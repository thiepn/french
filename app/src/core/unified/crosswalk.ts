import {sourceId,type SourceKey} from './source.ts';
/** Surface-form matches are unverified hypotheses, never equal senses or transferable mastery. */
export interface LexicalRow {
  readonly source:SourceKey;
  readonly localId:string;
  readonly form:string;
  readonly senseId?:string;
  readonly partOfSpeech?:string;
}
export type Disposition='candidate-only'|'ambiguous'|'unmatched'|'insufficient-sense'|'invalid';
export interface CrosswalkRow {
  readonly from:string;
  readonly to:readonly string[];
  readonly disposition:Disposition;
  readonly reason:string;
}
export interface CrosswalkReport {
  readonly schema:'thiepn-french-crosswalk-loss-v1';
  readonly rows:readonly CrosswalkRow[];
  readonly totals:Readonly<{source:number;target:number;candidateOnly:number;ambiguous:number;unmatched:number;insufficientSense:number;invalid:number;unusedTargets:number}>;
  readonly verifiedSenseEquivalences:0;
  readonly progressImported:false;
}
export function normalizeFrenchSurface(form:string):string {
  return form.normalize('NFC').toLocaleLowerCase('fr').replace(/[’]/g,"'").replace(/\s+/g,' ').trim();
}
function valid(row:LexicalRow):boolean {
  return !!row&&typeof row.form==='string'&&normalizeFrenchSurface(row.form).length>0
    &&typeof row.localId==='string'&&/^[A-Za-z0-9][A-Za-z0-9._/-]{0,127}$/.test(row.localId);
}
export function crosswalkWithLosses(from:readonly LexicalRow[],to:readonly LexicalRow[]):CrosswalkReport {
  const index=new Map<string,LexicalRow[]>();
  const sourceFrequency=new Map<string,number>();
  for(const row of to)if(valid(row)){
    const key=normalizeFrenchSurface(row.form);
    index.set(key,[...(index.get(key)??[]),row]);
  }
  for(const row of from)if(valid(row)){
    const key=normalizeFrenchSurface(row.form);
    sourceFrequency.set(key,(sourceFrequency.get(key)??0)+1);
  }
  const usedTargets=new Set<string>();
  const count={source:from.length,target:to.length,candidateOnly:0,ambiguous:0,
    unmatched:0,insufficientSense:0,invalid:0,unusedTargets:0};
  const rows:CrosswalkRow[]=from.map(row=>{
    if(!valid(row)){count.invalid++;return{from:'invalid-row',to:[],disposition:'invalid',reason:'invalid input row'};}
    const key=normalizeFrenchSurface(row.form);
    const matches=index.get(key)??[];
    const targets=matches.map(match=>sourceId(match.source,'lexeme',match.localId));
    for(const id of targets)usedTargets.add(id);
    const id=sourceId(row.source,'lexeme',row.localId);
    if(matches.length===0){count.unmatched++;return{from:id,to:targets,disposition:'unmatched',reason:'no identical French surface form'};}
    if(matches.length!==1||sourceFrequency.get(key)!==1||new Set(targets).size!==targets.length){
      count.ambiguous++;return{from:id,to:targets,disposition:'ambiguous',reason:'one-to-many, homograph, or duplicate source row'};
    }
    if(!row.senseId||!matches[0].senseId||!row.partOfSpeech||!matches[0].partOfSpeech){
      count.insufficientSense++;return{from:id,to:targets,disposition:'insufficient-sense',reason:'missing word-sense or part-of-speech evidence'};
    }
    count.candidateOnly++;
    return{from:id,to:targets,disposition:'candidate-only',reason:'manual bilingual sense verification still required'};
  });
  count.unusedTargets=to.filter(row=>!valid(row)||!usedTargets.has(sourceId(row.source,'lexeme',row.localId))).length;
  return{schema:'thiepn-french-crosswalk-loss-v1',rows,totals:count,verifiedSenseEquivalences:0,progressImported:false};
}
