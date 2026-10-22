/**
 * U67 native P33 observable speech evidence; original P35 P33 design contract.
 * Recognized words are never durable. ASR accuracy, pronunciation, semantics,
 * spoken confidence and CEFR mastery are NOT established by these proxies.
 */
import {B2_ARGUMENT_PAIRS,observeB2Draft} from './b2-observation.ts';

export const P33_EVALUATOR='u67-p33-observable-oral-v1';
export const P33_MIN_ASR_CONFIDENCE=.25;
export const P33_PREP_MS=20_000;
export const P33_MIN_MS=40_000;
export const P33_MAX_MS=105_000;
export const P33_VALID_MS=35*86_400_000;
/** A recognition request that never starts, or a stop that never settles,
 * must not strand an in-progress learner or record a timed oral failure. */
export const P33_START_WATCHDOG_MS=12_000;
export const P33_STOP_WATCHDOG_MS=8_000;
export type P33CaptureExit='finished'|'time-ceiling'|'unexpected-end'|'start-failed'|'start-timeout'|'recognition-error'|'stop-timeout';
/** Never score an operational device/recognition failure as learner weakness. */
export function p33CaptureMustAbstain(exit:P33CaptureExit):boolean{
 return exit!=='finished'&&exit!=='time-ceiling';
}
/** Learner-specific next actions based solely on observable aggregates, no grammar/semantics inference. */
export function p33RecoveryGuidance(exit:P33CaptureExit,result:P33Receipt):string{
 if(p33CaptureMustAbstain(exit))return 'The browser did not complete a reliable French recognition session. Check microphone permission, connection and speech-recognition support, then retry this task. No oral failure is inferred.';
 if(result.status==='unscored')return 'Recognition confidence or final words were unavailable. Retry in a quieter setting or use text rehearsal without claiming oral evidence.';
 if(result.durationMs<P33_MIN_MS)return 'Speak for at least 40 seconds before finishing; develop a position, a counterargument and a qualified conclusion.';
 if(result.words<80||result.wordsPerMinute<70)return 'Try developing your argument with a concrete example, an objection and a conclusion. The recognizer may miss words; this is not a pronunciation judgment.';
 if(result.wordsPerMinute>200)return 'Try a measured pace with one idea at a time. Recognition timing cannot grade real fluency.';
 if(result.topicGroups<2)return 'Respond directly to more of the displayed situation before comparing alternatives.';
 if(result.status==='insufficient')return 'Organize your response with an example, concession and conclusion; these checks are only observable transcript proxies.';
 return 'Review the argument and consider a clearer counterargument before the next source-linked situation. No semantic or CEFR grade is implied.';
}
export type P33Status='structural-targets-met'|'insufficient'|'unscored';
export type P33Mode='immediate'|'brief-prep';
export interface P33Prompt{
 id:string;mode:P33Mode;originalPracticeId:string;
 title:string;question:string;anchors:readonly string[];minWords:number;
}
export const P33_PAIRS:readonly (readonly [P33Prompt,P33Prompt])[]=[
 [
  {id:'oral-work-policy',mode:'immediate',originalPracticeId:B2_ARGUMENT_PAIRS[0][0].id,title:'Organisation du travail',
   question:'Une direction souhaite supprimer deux jours de télétravail. Exposez une décision nuancée et une condition de révision.',anchors:['télétravail','bureau','équipe'],minWords:80},
  {id:'oral-media-claim',mode:'brief-prep',originalPracticeId:B2_ARGUMENT_PAIRS[1][0].id,title:'Information contestée',
   question:'Une étude affirme que l’usage des réseaux sociaux cause une baisse de concentration. Examinez cette conclusion et une autre explication.',anchors:['étude','cause','preuve'],minWords:85}
 ],
 [
  {id:'oral-city-policy',mode:'immediate',originalPracticeId:B2_ARGUMENT_PAIRS[0][1].id,title:'Mobilité en ville',
   question:'Votre ville annonce une restriction de voiture dès demain. Défendez une réponse équitable pour les habitants.',anchors:['ville','voiture','transport'],minWords:80},
  {id:'oral-project-crisis',mode:'brief-prep',originalPracticeId:B2_ARGUMENT_PAIRS[1][1].id,title:'Projet en crise',
   question:'Une équipe doit présenter un projet incomplet au client. Proposez un compromis responsable malgré le délai.',anchors:['projet','client','équipe'],minWords:85}
 ],
 [
  {id:'oral-team-conflict',mode:'immediate',originalPracticeId:B2_ARGUMENT_PAIRS[2][0].id,title:'Conflit d’équipe',
   question:'Deux collègues demandent des priorités incompatibles. Présentez votre méthode de médiation sans privilégier un seul côté.',anchors:['collègues','conflit','compromis'],minWords:80},
  {id:'oral-priority-choice',mode:'brief-prep',originalPracticeId:B2_ARGUMENT_PAIRS[2][1].id,title:'Choix collectifs',
   question:'Une association dispose d’un budget insuffisant pour deux projets utiles. Justifiez un choix révisable et ses limites.',anchors:['association','budget','priorités'],minWords:85}
 ]
];
export interface P33FinalSegment {text:string;confidence:number;receivedAt:number}
export interface P33Receipt{
 promptId:string;mode:P33Mode;at:number;status:P33Status;
 words:number;durationMs:number;wordsPerMinute:number;asrConfidence:number;
 fluencyProxy:number;discourseProxy:number;score:number;
 fillerRatio:number;longPauses:number;selfCorrections:number;
 topicGroups:number;markerFamilies:string[];reason:string;
 evaluator:typeof P33_EVALUATOR;
}
export interface P33PairReceipt{
 id:string;at:number;status:P33Status;tasks:[P33Receipt,P33Receipt];
 evaluator:typeof P33_EVALUATOR;
 /** P32 original reading-pack sha required to keep prerequisite binding. */
 sourceDigest:string;
}
export interface P33Session {
 id:string;pair:number;cursor:0|1;at:number;first?:P33Receipt;prepStartedAt?:number;
}
const obj=(v:unknown):Record<string,unknown>|null=>
 v&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:null;
const status=(v:unknown):v is P33Status=>['structural-targets-met','insufficient','unscored'].includes(String(v));
function normalizeReceipt(raw:unknown):P33Receipt|null{
 const x=obj(raw);if(!x||x.evaluator!==P33_EVALUATOR||!status(x.status)||
  !P33_PAIRS.flat().some(p=>p.id===x.promptId&&p.mode===x.mode)||
  typeof x.reason!=='string'||x.reason.length>180||
  !Array.isArray(x.markerFamilies)||x.markerFamilies.length>7||
  !x.markerFamilies.every(m=>typeof m==='string'&&m.length<=25)||
  !['at','words','durationMs','wordsPerMinute','asrConfidence','fluencyProxy','discourseProxy',
    'score','fillerRatio','longPauses','selfCorrections','topicGroups'].every(k=>
      typeof x[k]==='number'&&Number.isFinite(x[k])&&Number(x[k])>=0))return null;
 if(Number(x.at)<=0||Number(x.words)>5000||Number(x.durationMs)>P33_MAX_MS+5_000||
  Number(x.asrConfidence)>100||Number(x.fluencyProxy)>100||Number(x.discourseProxy)>100||
  Number(x.score)>100||Number(x.fillerRatio)>100||Number(x.topicGroups)>3||
  Number(x.longPauses)>500||Number(x.selfCorrections)>500)return null;
 return{
  promptId:x.promptId as string,mode:x.mode as P33Mode,at:x.at as number,
  status:x.status as P33Status,words:x.words as number,durationMs:x.durationMs as number,
  wordsPerMinute:x.wordsPerMinute as number,asrConfidence:x.asrConfidence as number,
  fluencyProxy:x.fluencyProxy as number,discourseProxy:x.discourseProxy as number,
  score:x.score as number,fillerRatio:x.fillerRatio as number,longPauses:x.longPauses as number,
  selfCorrections:x.selfCorrections as number,topicGroups:x.topicGroups as number,
  markerFamilies:[...x.markerFamilies] as string[],reason:x.reason as string,evaluator:P33_EVALUATOR
 };
}
export function normalizeP33Fields(root:Record<string,unknown>):
 {oralHistory?:P33PairReceipt[];oralSession?:P33Session}|null{
 const fields:{oralHistory?:P33PairReceipt[];oralSession?:P33Session}={};
 if(root.oralHistory!==undefined){
  if(!Array.isArray(root.oralHistory)||root.oralHistory.length>12)return null;
  const history:P33PairReceipt[]=[];
  for(const raw of root.oralHistory){
   const p=obj(raw);if(!p||p.evaluator!==P33_EVALUATOR||!status(p.status)||
    typeof p.id!=='string'||p.id.length>100||
    typeof p.at!=='number'||!Number.isFinite(p.at)||p.at<=0||
    typeof p.sourceDigest!=='string'||!/^[0-9a-f]{64}$/.test(p.sourceDigest)||
    !Array.isArray(p.tasks)||p.tasks.length!==2)return null;
   const a=normalizeReceipt(p.tasks[0]),b=normalizeReceipt(p.tasks[1]);
   if(!a||!b||a.mode!=='immediate'||b.mode!=='brief-prep'||
    !P33_PAIRS.some(pair=>pair[0].id===a.promptId&&pair[1].id===b.promptId))return null;
   history.push({id:p.id,at:p.at,status:p.status as P33Status,
    tasks:[a,b],evaluator:P33_EVALUATOR,sourceDigest:p.sourceDigest});
  }
  fields.oralHistory=history;
 }
 if(root.oralSession!==undefined){
  const x=obj(root.oralSession);
  if(!x||typeof x.id!=='string'||x.id.length>100||
   !Number.isInteger(x.pair)||Number(x.pair)<0||Number(x.pair)>=P33_PAIRS.length||
   (x.cursor!==0&&x.cursor!==1)||typeof x.at!=='number'||x.at<=0||
   !Number.isFinite(x.at))return null;
  const first=x.first===undefined?undefined:normalizeReceipt(x.first);
  if(x.first!==undefined&&(!first||first.promptId!==P33_PAIRS[x.pair as number][0].id))return null;
  if(x.cursor===1&&!first)return null;
  if(x.prepStartedAt!==undefined&&
    (x.cursor!==1||typeof x.prepStartedAt!=='number'||!Number.isFinite(x.prepStartedAt)||
      x.prepStartedAt<x.at))return null;
  fields.oralSession={id:x.id,pair:x.pair as number,cursor:x.cursor as 0|1,
   at:x.at,...(first?{first}:{}),
   ...(typeof x.prepStartedAt==='number'?{prepStartedAt:x.prepStartedAt}:{})};
 }
 return fields;
}
const clamp=(v:number)=>Math.max(0,Math.min(100,Math.round(v)));
const wordList=(s:string)=>s.match(/[\p{L}]+(?:[’'-][\p{L}]+)*/gu)??[];
export function evaluateP33Task(prompt:P33Prompt,segments:readonly P33FinalSegment[],
 startedAt:number,endedAt:number,operationalError=false):P33Receipt{
 const durationMs=Math.max(0,endedAt-startedAt);
 const transcript=segments.map(s=>s.text).join(' ').slice(0,12000);
 const observation=observeB2Draft(transcript);
 const words=wordList(transcript).length;
 const rate=durationMs>0?Math.round(words*60000/durationMs):0;
 const confidence=segments.length&&segments.every(s=>Number.isFinite(s.confidence)&&s.confidence>0&&s.confidence<=1)?
  segments.reduce((n,s)=>n+s.confidence,0)/segments.length:0;
 const filler=(transcript.match(/(?<!\p{L})(?:euh|heu|hum|ben|bah)(?!\p{L})/giu)??[]).length;
 const corrections=(transcript.match(/(?:je veux dire|plus exactement|autrement dit|je reformule)/giu)??[]).length;
 const pauses=segments.slice(1).filter((s,i)=>s.receivedAt-segments[i].receivedAt>=6500).length;
 const fold=transcript.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr');
 const groups=prompt.anchors.filter(a=>fold.includes(a.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr'))).length;
 const marker=observation.markerFamilies;
 const fluency=clamp((rate>=70&&rate<=200?65:20)+(pauses<=2?20:0)+(filler/Math.max(words,1)<=.07?15:0));
 const discourse=clamp((groups>=2?25:0)+(words>=prompt.minWords?20:0)+
  (marker.length>=3?30:marker.length*7)+(marker.includes('conclusion')?15:0)+
  (marker.includes('concession')||marker.includes('contrast')?10:0));
 const score=clamp(.55*discourse+.45*fluency);
 let state:P33Status='structural-targets-met';
 let reason='Observable transcript/timing thresholds met; oral accuracy and semantics were not verified.';
 if(operationalError||!segments.length||confidence<P33_MIN_ASR_CONFIDENCE||
  !Number.isFinite(startedAt)||!Number.isFinite(endedAt)||startedAt<=0||endedAt<startedAt){
  state='unscored';reason='Speech recognition failed, had no final content, or had insufficient ASR confidence.';
 }else if(durationMs<P33_MIN_MS||durationMs>P33_MAX_MS||words<prompt.minWords||
    rate<70||rate>200||groups<2||discourse<58||fluency<55||score<60){
  state='insufficient';reason='One or more observable oral hard gates were not met; not a pronunciation judgment.';
 }
 return {promptId:prompt.id,mode:prompt.mode,at:endedAt,status:state,
  words,durationMs,wordsPerMinute:rate,asrConfidence:clamp(confidence*100),
  fluencyProxy:fluency,discourseProxy:discourse,score,
  fillerRatio:clamp(100*filler/Math.max(words,1)),longPauses:pauses,
  selfCorrections:corrections,topicGroups:groups,markerFamilies:marker,
  reason,evaluator:P33_EVALUATOR};
}
export function completeP33Pair(first:P33Receipt,second:P33Receipt,sourceDigest:string,at:number):P33PairReceipt{
 if(!/^[0-9a-f]{64}$/.test(sourceDigest)||!P33_PAIRS.some(p=>p[0].id===first.promptId&&
 p[1].id===second.promptId)||first.evaluator!==P33_EVALUATOR||second.evaluator!==P33_EVALUATOR)
  throw Error('P33_ORIGINAL_PAIR_OR_SOURCE_INVALID');
 const tasks:[P33Receipt,P33Receipt]=[first,second];
 return{id:'p33:'+at+':'+crypto.randomUUID(),at,
  status:tasks.some(t=>t.status==='unscored')?'unscored':
   tasks.every(t=>t.status==='structural-targets-met')?'structural-targets-met':'insufficient',
  tasks,evaluator:P33_EVALUATOR,sourceDigest};
}
export function currentP33Evidence(history:readonly P33PairReceipt[],sourceDigest:string,prerequisites:boolean,now=Date.now()):P33PairReceipt|null{
 if(!prerequisites)return null;
 const latest=[...history].reverse().find(x=>x.status!=='unscored');
 if(!latest||latest.status!=='structural-targets-met'||latest.sourceDigest!==sourceDigest||
 latest.at>now||now-latest.at>P33_VALID_MS)return null;
 return latest;
}
