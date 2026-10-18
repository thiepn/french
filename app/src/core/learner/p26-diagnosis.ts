/** P37I-D6-A — P26 original eight-root-cause triage over authored evidence.
 * Read-only observations: no SRS scheduling, remediation run, or CEFR award.
 * A repair route is guidance, never automatic practice-only credit.
 */
import type {CanonicalReviewEventV1} from './model';
import type {FunctionEvidence} from '../conversation/curriculum.ts';
export const P26_OBSERVATION_DAYS=90;
const DAY=86_400_000;
export const P26_CAUSES=[
 'retrieval','form','grammar','lexical-frame','listening','speaking','reading','interaction'
] as const;
export type P26Cause=typeof P26_CAUSES[number];
export type P26Route='review'|'write'|'listen'|'speak'|'read'|'conversation';
export type P26Stage='scaffold'|'rebuild'|'independent-retest';
export interface P26Case{
 key:string;noteId:string;cause:P26Cause;route:P26Route;
 status:'open'|'repaired';failures:number;activeDays:number;
 severity:number;confidence:number;lastFailedAt:number;lastCleanAt:number;
 explanation:string;
}
export interface P26Task{noteId:string;cause:P26Cause;stage:P26Stage;route:P26Route;practiceOnly:true}
export interface P26Report{
 schema:'thiepn-french-d6-p26-observations';windowDays:90;open:P26Case[];
 repaired:P26Case[];totalSignals:number;sourceLimited:boolean;
 note:string;
}
const routes:Record<P26Cause,P26Route>={
 retrieval:'review',form:'write',grammar:'write','lexical-frame':'write',
 listening:'listen',speaking:'speak',reading:'read',interaction:'conversation'
};
const explanation:Record<P26Cause,string>={
 retrieval:'Recall is not independently reliable.',
 form:'French form or spelling needs exact written production.',
 grammar:'A connector, article, preposition or order is unstable.',
 'lexical-frame':'The word is known, but its construction or phrase frame is unstable.',
 listening:'Unassisted connected French was not reliably distinguished.',
 speaking:'Spoken retrieval was not reliably demonstrated.',
 reading:'Independent context comprehension was not demonstrated.',
 interaction:'Conversation relied on help or missed a communicative function.'
};
const FORM=new Set(['orthography','spelling','accent','typo','form']);
const GRAMMAR=new Set(['connector','contraction','preposition','word-order','word order','article','gender']);
const FRAME=new Set(['structure','collocate','collocation','neighboring-frame','incomplete-frame','missing-anchor','target-missing','incomplete','frame']);
function category(value:unknown):string{return typeof value==='string'?value.toLowerCase().trim().slice(0,80):'';}
function boundedAt(value:number,now:number):boolean{
 return Number.isFinite(value)&&value>now-P26_OBSERVATION_DAYS*DAY&&value<=now;
}
function causeOf(event:CanonicalReviewEventV1):P26Cause|null{
 if(event.correct!==false)return null;
 const p=String(event.practice||''),error=category(event.errorCategory||event.sentenceDiagnosis||
    (event.practiceOnly?undefined:event.typedQuality));
 if(p.startsWith('spoken-'))return 'speaking';
 if(p.startsWith('reading-'))return 'reading';
 if(p.startsWith('contextual-listening'))return FORM.has(error)?'form':'listening';
 if(FORM.has(error))return 'form';
 if(GRAMMAR.has(error))return 'grammar';
 if(FRAME.has(error))return 'lexical-frame';
 // A clean native practice failure without a diagnostic is ambiguous, never
 // fabricate a precise grammar or spoken cause from generic Again feedback.
 if(p.startsWith('verified-usage-')||p.startsWith('written-'))return 'retrieval';
 return event.practiceOnly?'retrieval':'retrieval';
}
function cleanFor(event:CanonicalReviewEventV1,cause:P26Cause):boolean{
 if(event.correct!==true||(event.supportLevel??0)!==0||
    event.transcriptUsed===true||event.translationUsed===true||
    event.manualJudgment==='self-assessed'||event.manualJudgment==='manual'||
    event.typedQuality?.startsWith('manual-'))return false;
 const p=String(event.practice||'');
 const exact=event.typed===true&&event.typedQuality==='exact';
 if(cause==='speaking'||cause==='interaction')return false; // no independent oral scorer
 if(cause==='listening')return p.startsWith('contextual-listening')&&exact&&
    event.firstListen===true&&event.playCount===1&&(event.playbackRate??1)>=1;
 if(cause==='reading')return p.startsWith('reading-context')&&event.correct===true&&
    event.manualJudgment!== 'self-assessed';
 if(cause==='form')return exact&&
    (!event.practiceOnly||p.startsWith('written-')||p.startsWith('verified-usage-'));
 if(cause==='grammar'||cause==='lexical-frame')return exact&&
    (p.startsWith('written-')||p.startsWith('verified-usage-'))&&
    ['exact','accepted',''].includes(category(event.sentenceDiagnosis));
 return !event.practiceOnly&&event.rating!=='again'&&
    (event.skill==='recognition'||event.skill==='production');
}
interface MutableCase extends P26Case{days:Set<string>}
function day(at:number):string{return new Date(at).toISOString().slice(0,10);}
function applyFailure(cases:Map<string,MutableCase>,noteId:string,cause:P26Cause,at:number){
 const key=noteId+':'+cause;
 let value=cases.get(key);
 if(!value){
  value={key,noteId,cause,route:routes[cause],status:'open',failures:0,activeDays:0,
   severity:0,confidence:0,lastFailedAt:0,lastCleanAt:0,
   explanation:explanation[cause],days:new Set<string>()};
  cases.set(key,value);
 }
 value.failures++;value.days.add(day(at));value.lastFailedAt=at;value.status='open';
}
export function diagnoseP26(input:{
 events:readonly CanonicalReviewEventV1[];functionEvents?:readonly FunctionEvidence[];
 now?:number;sourceLimit?:number;
}):P26Report{
 const now=input.now??Date.now(),limit=Math.max(1,Math.min(15_000,input.sourceLimit??15_000));
 const seen=new Set<string>(),rows:Array<{t:number;kind:'event'|'function';data:CanonicalReviewEventV1|FunctionEvidence}>=[];
 for(const e of input.events){
  if(!boundedAt(e.t,now)||!e.noteId)continue;
  const id=String(e.eventId||'');if(id&&seen.has('e:'+id))continue;
  if(id)seen.add('e:'+id);
  rows.push({t:e.t,kind:'event',data:e});
 }
 for(const f of input.functionEvents??[]){
  if(!boundedAt(f.at,now)||!f.functionId||!f.scenarioId)continue;
  const id='f:'+f.functionId+':'+f.scenarioId+':'+f.turnIndex+':'+f.at;
  if(seen.has(id))continue;seen.add(id);
  rows.push({t:f.at,kind:'function',data:f});
 }
 rows.sort((x,y)=>x.t-y.t);
 const limited=rows.length>limit;
 const samples=rows.slice(-limit);
 const cases=new Map<string,MutableCase>();
 for(const row of samples){
  if(row.kind==='event'){
   const e=row.data as CanonicalReviewEventV1;
   const noteId=String(e.noteId).slice(0,160);
   const cause=causeOf(e);
   if(cause)applyFailure(cases,noteId,cause,row.t);
   else if(e.correct===true)for(const c of cases.values()){
    if(c.noteId!==noteId||c.status!=='open'||row.t<=c.lastFailedAt)continue;
    if(cleanFor(e,c.cause)){c.status='repaired';c.lastCleanAt=row.t;}
   }
  }else{
   const f=row.data as FunctionEvidence;
   const noteId='function:'+String(f.functionId).slice(0,100);
   const independent=f.manual!==true&&f.support===0&&f.retries===0;
   const accepted=f.accepted===true&&f.independent===true&&
     f.required>0&&f.matched>=f.required&&f.credit>=.99;
   if(!accepted||!independent)applyFailure(cases,noteId,'interaction',row.t);
   else{
    const c=cases.get(noteId+':interaction');
    if(c&&c.status==='open'&&row.t>c.lastFailedAt){
     c.status='repaired';c.lastCleanAt=row.t;
    }
   }
  }
 }
 const flattened:P26Case[]=[];
 for(const c of cases.values()){
  const activeDays=c.days.size;
  const recency=Math.max(0,1-(now-c.lastFailedAt)/(30*DAY));
  c.activeDays=activeDays;
  c.severity=Math.min(100,Math.round(18+Math.min(45,c.failures*9)+
   Math.min(20,activeDays*7)+17*recency));
  c.confidence=Math.min(100,Math.round(15+Math.min(45,c.failures*10)+
   Math.min(40,activeDays*12)));
  const {days:_,...stable}=c;flattened.push(stable);
 }
 flattened.sort((a,b)=>b.severity-a.severity||b.lastFailedAt-a.lastFailedAt||a.key.localeCompare(b.key));
 return{schema:'thiepn-french-d6-p26-observations',windowDays:90,
  open:flattened.filter(c=>c.status==='open').slice(0,300),
  repaired:flattened.filter(c=>c.status==='repaired').slice(0,300),
  totalSignals:samples.length,sourceLimited:limited,
  note:'Structured practice patterns only. Guidance is not P24 durability, P25 promotion, or a calibrated oral assessment.'};
}
export function p26RepairPreview(c:P26Case):P26Task[]{
 return(['scaffold','rebuild','independent-retest'] as P26Stage[]).map(stage=>({
  noteId:c.noteId,cause:c.cause,stage,route:c.route,practiceOnly:true
 }));
}
