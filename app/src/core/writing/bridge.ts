/** P37I-C4 — P10 source construction -> P12 contextual sentence bridge.
 * P12 sentences come from the preserved P35 source pack. Progress is evidence
 * of exact written form in a finite authored task, NOT semantic fluency.
 */
import type {SentenceExercise,SentenceExercisePack,UsagePack,UsageRecord} from '../content/loader';
import type {WritingState,WritingTally} from './session';
import type {UsageState} from '../usage/session';
import {usageRecordMastery} from '../usage/mastery';

export interface SentenceBridgeCandidate{
  exercise:SentenceExercise;record:UsageRecord;score:number;reason:string;
  usageExact:number;writing:WritingTally|undefined;distinctContexts:number;
}
function frameKey(value:string):string{
  return value.toLocaleLowerCase('fr').normalize('NFC').replace(/’/g,"'")
    .replace(/\s+/g,' ').trim();
}
export function sentenceSourceMap(
  sentences:Pick<SentenceExercisePack,'exercises'>,usage:Pick<UsagePack,'records'>
):Map<string,UsageRecord>{
  const byFrame=new Map(usage.records.map(r=>[frameKey(r.frame),r]));
  const linked=new Map<string,UsageRecord>();
  for(const e of sentences.exercises){
    const r=byFrame.get(frameKey(e.frame));
    if(r)linked.set(e.id,r);
  }
  return linked;
}
export function independentSentenceExact(evidence:WritingTally|undefined):boolean{
  return Boolean(evidence?.lastIndependent);
}
export function rankedSentenceBridge(
  sentences:Pick<SentenceExercisePack,'exercises'>,usage:Pick<UsagePack,'records'>,
  usageState:UsageState,writingState:WritingState,now=Date.now()
):SentenceBridgeCandidate[]{
  const linked=sentenceSourceMap(sentences,usage);
  const results:SentenceBridgeCandidate[]=[];
  for(const exercise of sentences.exercises){
    const record=linked.get(exercise.id);
    if(!record)continue;
    const usageEvidence=usageRecordMastery(record.id,usageState,now);
    // An attempt with a hint or manual judgment cannot unlock cross-skill credit.
    if(usageEvidence.usage.independentExact<2)continue;
    const tally=writingState.evidence?.[exercise.id];
    const frames=sentences.exercises.filter(e=>linked.get(e.id)?.id===record.id);
    const distinctContexts=frames.filter(e=>(writingState.evidence?.[e.id]?.independentExact??0)>0)
      .map(e=>e.context).filter((v,i,arr)=>arr.indexOf(v)===i).length;
    const unfinished=tally?.attempts&&tally.lastIndependent===false;
    const score=(unfinished?240:!tally?.attempts?175:!tally.lastIndependent?160:30)
      +Math.max(0,30-Math.min(30,(tally?.attempts??0)*6))
      +Math.max(0,24-distinctContexts*12)
      +(usageEvidence.usage.secure?10:0);
    const reason=unfinished?'Revisit a sentence needing repair':
      !tally?.attempts?'Apply a known construction in a sentence':
      distinctContexts<2&&frames.length>1?'Try a different original context':
      'Maintain independent sentence recall';
    results.push({exercise,record,score,reason,usageExact:usageEvidence.usage.independentExact,
      writing:tally,distinctContexts});
  }
  return results.sort((a,b)=>b.score-a.score||a.exercise.id.localeCompare(b.exercise.id));
}
export function sentenceBridgeSummary(
  sentences:Pick<SentenceExercisePack,'exercises'>,usage:Pick<UsagePack,'records'>,
  usageState:UsageState,writingState:WritingState,now=Date.now()
){
  const links=sentenceSourceMap(sentences,usage),ranked=rankedSentenceBridge(sentences,usage,usageState,writingState,now);
  const byFrame=new Map<string,SentenceExercise[]>();
  for(const e of sentences.exercises){
    const record=links.get(e.id);if(!record)continue;
    byFrame.set(record.id,[...(byFrame.get(record.id)??[]),e]);
  }
  let pairedContexts=0;
  for(const exercises of byFrame.values()){
    const distinct=new Set(exercises.filter(e=>(writingState.evidence?.[e.id]?.independentExact??0)>0).map(e=>e.context));
    if(distinct.size>=2)pairedContexts++;
  }
  return {sourceLinked:links.size,eligible:ranked.length,
    practiced:ranked.filter(row=>(row.writing?.attempts??0)>0).length,
    independentlyExact:ranked.filter(row=>(row.writing?.independentExact??0)>0).length,
    pairedContexts,pairedPossible:[...byFrame.values()].filter(rows=>new Set(rows.map(e=>e.context)).size>=2).length};
}
