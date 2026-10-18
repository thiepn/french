/** P37I-C6: cautious lexical crosswalk for source constructions.
 * A unique dictionary lemma is only a lexical identity, not proof that the
 * learner knows the matching P10 syntax or a particular word sense.
 * Nothing in this file writes to the SRS scheduler or stores learner answers.
 */
import type {UsageRecord,VocabularySearchRow} from '../content/loader';
import type {CanonicalSrsRecordV1} from '../learner/model';

export type LexicalStatus='unmapped'|'ambiguous'|'untracked'|'developing'|'weak'|'due'|'recent-production';
export interface LexicalSignal{
  recordId:string;anchor:string;noteId:string|null;status:LexicalStatus;
  detail:string;priority:number;
}
function canonicalWord(value:string):string{
  return value.normalize('NFC').toLocaleLowerCase('fr').replace(/’/g,"'").trim().replace(/\s+/g,' ');
}
function isVerb(pos:string):boolean{
  return /^(?:verb|verbe|v\.?|v\.(?:tr|intr|pron)\.?)(?:\s|$)/i.test(pos.trim());
}
export function uniqueLexicalAnchor(record:Pick<UsageRecord,'anchor'>,rows:readonly VocabularySearchRow[]):VocabularySearchRow|null{
  const anchor=canonicalWord(record.anchor);
  if(!anchor||anchor.includes('+'))return null;
  // Count all exact headword matches, not only verbs; homographic nouns and
  // polysemous entries make it unsafe to invent a sense-level mapping.
  const matches=rows.filter(row=>canonicalWord(row.word)===anchor);
  return matches.length===1&&isVerb(matches[0].pos)&&Boolean(matches[0].id)
    ?matches[0]:null;
}
function statusFromSrs(noteId:string,rows:readonly CanonicalSrsRecordV1[],now:number):Omit<LexicalSignal,'recordId'|'anchor'|'noteId'>{
  const production=rows.filter(row=>row.noteId===noteId&&row.skill==='production'&&row.sense===0);
  // Multiple production records for the same note/sense mean an unresolved
  // migration or data inconsistency; do not silently choose the best one.
  if(production.length!==1)return production.length
    ?{status:'ambiguous',priority:0,detail:'Conflicting production records; lexical evidence not inferred.'}
    :{status:'untracked',priority:20,detail:'No scheduled production history for this unique lemma.'};
  const row=production[0];
  if(row.suspended||row.manualKnown||row.status==='new'||row.seen<2||row.successes<2)
    return{status:'developing',priority:45,detail:'Vocabulary production is not independently established.'};
  if(row.relearning||row.lastRating==='again'||row.lastRating==='hard'||row.lapses>=Math.max(2,row.successes))
    return{status:'weak',priority:90,detail:'Recent production difficulty: use the sentence as extra practice.'};
  if(row.dueAt>0&&row.dueAt<=now)
    return{status:'due',priority:110,detail:'The scheduled vocabulary production review is due. Context work does not complete that review.'};
  if(row.status==='learned'&&['good','easy'].includes(row.lastRating))
    return{status:'recent-production',priority:0,detail:'Scheduled production evidence exists for this lemma; construction mastery is still separate.'};
  return{status:'developing',priority:45,detail:'Production is developing; no word-sense equivalence is claimed.'};
}
export function buildLexicalSignals(
  records:readonly UsageRecord[],indexRows:readonly VocabularySearchRow[],
  srsByNoteId:ReadonlyMap<string,readonly CanonicalSrsRecordV1[]>,now=Date.now()
):Map<string,LexicalSignal>{
  const counts=new Map<string,number>();
  const exact=new Map<string,VocabularySearchRow[]>();
  for(const word of indexRows){
    const key=canonicalWord(word.word);
    if(!key)continue;
    counts.set(key,(counts.get(key)??0)+1);
    if(isVerb(word.pos)&&word.id)exact.set(key,[...(exact.get(key)??[]),word]);
  }
  const signals=new Map<string,LexicalSignal>();
  for(const record of records){
    const key=canonicalWord(record.anchor),count=counts.get(key)??0;
    const matches=exact.get(key)??[];
    let signal:LexicalSignal;
    if(count>1){
      signal={recordId:record.id,anchor:record.anchor,noteId:null,status:'ambiguous',
        priority:0,detail:'Multiple dictionary entries share this lemma; mapping withheld.'};
    }else if(count!==1||matches.length!==1){
      signal={recordId:record.id,anchor:record.anchor,noteId:null,status:'unmapped',
        priority:0,detail:'No unique verb lemma found in the pinned vocabulary index.'};
    }else{
      const noteId=matches[0].id;
      signal={recordId:record.id,anchor:record.anchor,noteId,...statusFromSrs(noteId,srsByNoteId.get(noteId)??[],now)};
    }
    signals.set(record.id,signal);
  }
  return signals;
}
export function lexicalPriority(signal:LexicalSignal|undefined):number{
  return signal?.priority??0;
}
export function linkedNoteIds(records:readonly UsageRecord[],indexRows:readonly VocabularySearchRow[]):string[]{
  const keys=new Set(records.map(record=>canonicalWord(record.anchor)));
  const count=new Map<string,number>();
  for(const row of indexRows){
    const key=canonicalWord(row.word);
    if(keys.has(key))count.set(key,(count.get(key)??0)+1);
  }
  return [...new Set(indexRows.filter(row=>
    keys.has(canonicalWord(row.word))&&count.get(canonicalWord(row.word))===1&&
    isVerb(row.pos)&&Boolean(row.id)).map(row=>row.id))];
}
