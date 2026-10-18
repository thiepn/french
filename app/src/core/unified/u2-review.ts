import {sourceId} from './source.ts';
import {ORIGINAL_PATH_LESSONS} from './u3-pathways.ts';
import {safeNativeLocalId} from './u3-native-id.ts';
import {crosswalkWithLosses,normalizeFrenchSurface,type LexicalRow,type CrosswalkReport} from './crosswalk.ts';

export interface OriginalSense {
  readonly id:string;readonly form:string;readonly gloss:string;readonly lessonIds:readonly string[];
  readonly sourceId:string;
}
export interface CandidateDecision {
  readonly sourceId:string;
  readonly targetId:string|null;
  readonly status:'needs-evidence'|'proposed-match'|'rejected';
  readonly note:string;
}
export interface DraftReview {
  readonly schema:'thiepn-french-u2-lexical-review-draft-v1';
  readonly authority:'review-only';readonly approved:false;readonly progressImported:false;
  readonly sourceRevision:string;readonly targetRevision:string|null;
  readonly decisions:readonly CandidateDecision[];
  readonly lossSummary:CrosswalkReport['totals'];
}
export const ORIGINAL_SENSES:readonly OriginalSense[]=Object.freeze((()=>{
 const grouped=new Map<string,{form:string;gloss:string;lessons:Set<string>}>();
 for(const lesson of ORIGINAL_PATH_LESSONS)for(const word of lesson.vocabulary){
  const key=normalizeFrenchSurface(word.fr)+'|'+word.en.toLowerCase();
  const existing=grouped.get(key);
  if(existing)existing.lessons.add(lesson.id);
  else grouped.set(key,{form:word.fr,gloss:word.en,lessons:new Set([lesson.id])});
 }
 return [...grouped.entries()].map(([key,row],i)=>Object.freeze({
  id:(i<36?'u2-sense-':'u3-sense-')+String(i<36?i+1:i-35).padStart(3,'0'),form:row.form,gloss:row.gloss,
  lessonIds:Object.freeze([...row.lessons]),sourceId:sourceId('original','sense',(i<36?'u2-sense-':'u3-sense-')+String(i<36?i+1:i-35).padStart(3,'0'))
 }));
})());
export function makeReviewReport(
 target:readonly {id:string;word:string;meaning:string;pos:string}[],
 targetRevision:string|null
):CrosswalkReport{
 const originals:LexicalRow[]=ORIGINAL_SENSES.map(row=>({
  source:'original',localId:row.id,form:row.form,senseId:row.gloss
 }));
 const native:LexicalRow[]=target.flatMap(row=>{
  try{return [{source:'native' as const,localId:safeNativeLocalId(row.id),form:row.word,
   senseId:undefined,partOfSpeech:row.pos||undefined}];}
  catch{return []; } // Unrepresentable native IDs abstain; never crash the entire workspace.
 });
 return crosswalkWithLosses(originals,native);
}
export function buildReviewExport(
 decisions:readonly CandidateDecision[],
 report:CrosswalkReport,
 targetRevision:string|null
):DraftReview{
 const validSources=new Set(ORIGINAL_SENSES.map(row=>row.sourceId));
 const seen=new Set<string>();
 const vetted:CandidateDecision[]=[];
 for(const row of decisions){
  if(!validSources.has(row.sourceId)||!['needs-evidence','proposed-match','rejected'].includes(row.status)
    ||typeof row.note!=='string'||row.note.length>600||seen.has(row.sourceId))continue;
  const matched=report.rows.find(r=>r.from===sourceId('original','lexeme',ORIGINAL_SENSES.find(s=>s.sourceId===row.sourceId)!.id));
  if(row.targetId!==null&&!matched?.to.includes(row.targetId))continue;
  if(row.status==='proposed-match'&&(row.targetId===null||!row.note.trim()))continue;
  seen.add(row.sourceId);vetted.push({...row,note:row.note.trim()});
 }
 return{
  schema:'thiepn-french-u2-lexical-review-draft-v1',authority:'review-only',approved:false,
  progressImported:false,sourceRevision:'unified-u1-original-v1',targetRevision,
  decisions:vetted,lossSummary:report.totals
 };
}
