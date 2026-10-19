/**
 * U65 B2 structural assessment, deliberately bounded to observable features.
 * This does NOT replicate or authorize the original P31/P32 P35 evaluator,
 * grant a CEFR qualification, prove semantic transfer or grade grammar.
 */
import {B2_ARGUMENT_PAIRS,observeB2Draft,sourceFivegramOverlap} from './b2-observation.ts';
import type {ReadingItem} from '../content/loader';
import {originalP32Question,sourceMatchesAuthority,type P32SourceAuthority} from './b2-source-contract.ts';
import {normalizeP33Fields,type P33PairReceipt,type P33Session} from './b2-oral.ts';

export const B2_EVIDENCE_KEY='vU65B2StructuralEvidence';
export const B2_EVIDENCE_SCHEMA='thiepn-french-u65-b2-evidence-v1';
export const B2_EVALUATOR_VERSION='u65-structural-v1';
export const B2_EVIDENCE_DAYS=35;
export const P32_SOURCE_EVALUATOR='u66-source-comprehension-v1';
export type B2Kind='p31'|'p32';
export type B2Status='structural-targets-met'|'insufficient'|'unscored';
export interface B2Receipt {
  taskId:string;sourceId?:string;modality:'argument'|'reading'|'listening';
  wordCount:number;sentenceCount:number;markerFamilies:string[];
  score:number;confidence:number;topicGroups:number;
  directCopyPct:number;transformation:number;playCount:number;
  elapsedMs:number;status:B2Status;reason:string;
  sourceDigest?:string;sourceRevision?:string;sourceBlob?:string;
  questionId?:string;comprehensionCorrect?:boolean;playbackCompleted?:boolean;
  sourceEvaluator?:typeof P32_SOURCE_EVALUATOR;
  evaluator:typeof B2_EVALUATOR_VERSION;
}
export interface B2Attempt{
  id:string;kind:B2Kind;at:number;status:B2Status;
  evaluator:typeof B2_EVALUATOR_VERSION;
  tasks:[B2Receipt,B2Receipt];
}
export interface B2Evidence{
  schema:typeof B2_EVIDENCE_SCHEMA;token:string;history:B2Attempt[];
  oralHistory?:P33PairReceipt[];oralSession?:P33Session;
}
function obj(v:unknown):Record<string,unknown>|null{
 return v&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:null;
}
export function emptyB2Evidence():B2Evidence{
 return{schema:B2_EVIDENCE_SCHEMA,token:'',history:[]};
}
/** Unknown future or damaged evidence must never become an empty writable state. */
export function normalizeB2Evidence(raw:unknown):B2Evidence|null{
 if(raw===undefined)return emptyB2Evidence();
 const root=obj(raw);
 if(!root||root.schema!==B2_EVIDENCE_SCHEMA||typeof root.token!=='string'||
    !Array.isArray(root.history)||root.history.length>24)return null;
 const history:B2Attempt[]=[];
 for(const rawAttempt of root.history){
  const entry=obj(rawAttempt);
  if(!entry||!['p31','p32'].includes(String(entry.kind))||
     !['structural-targets-met','insufficient','unscored'].includes(String(entry.status))||
     typeof entry.id!=='string'||entry.id.length>100||
     typeof entry.at!=='number'||!Number.isFinite(entry.at)||entry.at<=0||
     entry.evaluator!==B2_EVALUATOR_VERSION||
     !Array.isArray(entry.tasks)||entry.tasks.length!==2)return null;
  const tasks:B2Receipt[]=[];
  for(const rawTask of entry.tasks){
   const t=obj(rawTask);
   if(!t||typeof t.taskId!=='string'||t.taskId.length>100||
      !['argument','reading','listening'].includes(String(t.modality))||
      !['structural-targets-met','insufficient','unscored'].includes(String(t.status))||
      t.evaluator!==B2_EVALUATOR_VERSION||
      typeof t.reason!=='string'||t.reason.length>160||
      !Array.isArray(t.markerFamilies)||t.markerFamilies.length>7||
      !t.markerFamilies.every(x=>typeof x==='string'&&x.length<25)||
      !['wordCount','sentenceCount','score','confidence','topicGroups','directCopyPct',
        'transformation','playCount','elapsedMs'].every(k=>
          typeof t[k]==='number'&&Number.isFinite(t[k])&&Number(t[k])>=0))return null;
   if(t.sourceId!==undefined&&(typeof t.sourceId!=='string'||t.sourceId.length>100))return null;
   if(t.sourceDigest!==undefined&&(typeof t.sourceDigest!=='string'||!/^[0-9a-f]{64}$/.test(t.sourceDigest)))return null;
   if(t.sourceRevision!==undefined&&(typeof t.sourceRevision!=='string'||t.sourceRevision.length>70))return null;
   if(t.sourceBlob!==undefined&&(typeof t.sourceBlob!=='string'||!/^[0-9a-f]{40}$/.test(t.sourceBlob)))return null;
   if(t.questionId!==undefined&&(typeof t.questionId!=='string'||t.questionId.length>80))return null;
   if(t.comprehensionCorrect!==undefined&&typeof t.comprehensionCorrect!=='boolean')return null;
   if(t.playbackCompleted!==undefined&&typeof t.playbackCompleted!=='boolean')return null;
   if(t.sourceEvaluator!==undefined&&t.sourceEvaluator!==P32_SOURCE_EVALUATOR)return null;
   tasks.push({
    taskId:t.taskId,sourceId:t.sourceId as string|undefined,
    modality:t.modality as B2Receipt['modality'],
    wordCount:t.wordCount as number,sentenceCount:t.sentenceCount as number,
    markerFamilies:[...t.markerFamilies] as string[],
    score:t.score as number,confidence:t.confidence as number,topicGroups:t.topicGroups as number,
    directCopyPct:t.directCopyPct as number,transformation:t.transformation as number,
    playCount:t.playCount as number,elapsedMs:t.elapsedMs as number,status:t.status as B2Status,
    reason:t.reason as string,evaluator:B2_EVALUATOR_VERSION,
    ...(t.sourceDigest!==undefined?{sourceDigest:t.sourceDigest as string}:{}),
    ...(t.sourceRevision!==undefined?{sourceRevision:t.sourceRevision as string}:{}),
    ...(t.sourceBlob!==undefined?{sourceBlob:t.sourceBlob as string}:{}),
    ...(t.questionId!==undefined?{questionId:t.questionId as string}:{}),
    ...(t.comprehensionCorrect!==undefined?{comprehensionCorrect:t.comprehensionCorrect as boolean}:{}),
    ...(t.playbackCompleted!==undefined?{playbackCompleted:t.playbackCompleted as boolean}:{}),
    ...(t.sourceEvaluator!==undefined?{sourceEvaluator:P32_SOURCE_EVALUATOR}:{})
   });
  }
  if(entry.kind==='p31'&&tasks.some(t=>t.modality!=='argument'))return null;
  if(entry.kind==='p32'&&(tasks[0].modality!=='reading'||tasks[1].modality!=='listening'||
    !tasks[0].sourceId||!tasks[1].sourceId||tasks[0].sourceId===tasks[1].sourceId))return null;
  history.push({id:entry.id,kind:entry.kind as B2Kind,at:entry.at,
   status:entry.status as B2Status,evaluator:B2_EVALUATOR_VERSION,
   tasks:tasks as [B2Receipt,B2Receipt]});
 }
 const oral=normalizeP33Fields(root);
 if(!oral)return null;
 return {schema:B2_EVIDENCE_SCHEMA,token:root.token,history,...oral};
}
export function currentB2Evidence(state:B2Evidence,kind:B2Kind,now=Date.now(),expectedSourceDigest?:string):B2Attempt|null{
 // An unscored attempt is not a newly failed assessment; a scored failure supersedes.
 const newest=[...state.history].reverse().find(a=>a.kind===kind&&a.status!=='unscored');
 if(!newest||newest.status!=='structural-targets-met'||newest.evaluator!==B2_EVALUATOR_VERSION||
    newest.at>now||now-newest.at>B2_EVIDENCE_DAYS*86_400_000)return null;
 if(kind==='p32'){
  if(!currentB2Evidence(state,'p31',now))return null;
  const [read,listen]=newest.tasks;
  if(read.sourceEvaluator!==P32_SOURCE_EVALUATOR||listen.sourceEvaluator!==P32_SOURCE_EVALUATOR||
   !read.sourceDigest||read.sourceDigest!==listen.sourceDigest||
   read.sourceDigest!==expectedSourceDigest||
   !read.sourceRevision||read.sourceRevision!==listen.sourceRevision||
   !read.sourceBlob||read.sourceBlob!==listen.sourceBlob||
   !read.comprehensionCorrect||!listen.comprehensionCorrect||
   listen.playbackCompleted!==true)return null;
 }
 return newest;
}
const P31_ANCHORS:ReadonlyArray<readonly (readonly RegExp[])[]>=[
  [
   [/télétravail|distance|présentiel|bureau/iu,/collègu|employ|salari|équipe/iu,/direction|entreprise|organisation|politique/iu],
   [/mobilit|voiture|automobil|transport|circul/iu,/habitant|quartier|citoyen|usager/iu,/ville|centre|restriction|équité/iu]
  ],
  [
   [/média|publication|information|article|source/iu,/corrélation|causal|cause|preuve|donnée/iu,/biais|fiable|méthode|vérifi|alternative/iu],
   [/projet|livraison|livrer|échéance|délai/iu,/équipe|client|collègu|responsable/iu,/qualité|risque|temps|solution/iu]
  ],
  [
   [/conflit|désaccord|tension|divergen/iu,/équipe|collègu|membre|personne/iu,/médiation|compromis|priorit|accord/iu],
   [/association|budget|ressource|financ/iu,/projet|initiative|option|choix/iu,/priorit|critère|révision|décision/iu]
  ]
];
function clamp(v:number):number{return Math.max(0,Math.min(100,Math.round(v)));}
function groups(text:string,expressions:readonly RegExp[]):number{return expressions.filter(x=>x.test(text)).length;}
const SOURCE_STOP=new Set('avec alors aussi avant après avoir cette celui comme dans depuis donc dont elle elles encore entre être faire leur leurs mais même notre nous pour plus sans sont sous tout tous très vous votre leurs quand afin ainsi leurs lequel cette cette ceux sujet chose cette lors selon dans cette aussi cette'.split(' '));
function textWords(raw:string):string[]{
 return (raw.toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .match(/[a-z]{4,}/g)??[]).filter(x=>!SOURCE_STOP.has(x));
}
/** Four disjoint genuine source zones. Lexical contact only, not comprehension. */
export function sourceLexicalCoverage(answer:string,source:ReadingItem):number{
 const sentences=source.sentences.map(s=>s.fr).filter(Boolean);
 if(sentences.length<4)return 0;
 const seen=new Set(textWords(answer));
 let matched=0;
 for(let zone=0;zone<4;zone++){
  const start=Math.floor(zone*sentences.length/4),end=Math.floor((zone+1)*sentences.length/4);
  const sourceWords=new Set(textWords(sentences.slice(start,Math.max(start+1,end)).join(' ')));
  if([...sourceWords].filter(word=>seen.has(word)).length>=2)matched++;
 }
 return matched/4;
}
export interface AssessmentInput {
 kind:B2Kind;taskId:string;modality:B2Receipt['modality'];
 text:string;elapsedMs:number;attested:boolean;
 pair?:number;taskIndex?:number;source?:ReadingItem;playCount?:number;
 sourceAuthority?:P32SourceAuthority;questionId?:string;answerIndex?:number|null;
 audioCompleted?:boolean;transcriptRevealed?:boolean;
}
export function assessB2Structure(input:AssessmentInput):B2Receipt{
 const reading=input.source;
 const authority=input.sourceAuthority;
 const q=reading&&input.questionId?originalP32Question(reading,input.questionId):null;
 const sourceValid=Boolean(input.kind==='p32'&&reading&&authority&&q&&
  sourceMatchesAuthority(authority,reading,input.questionId??''));
 const answerProvided=Number.isInteger(input.answerIndex)&&Number(input.answerIndex)>=0&&
  Boolean(q&&Number(input.answerIndex)<q.options.length);
 const comprehensionCorrect=Boolean(q&&answerProvided&&q.answer===input.answerIndex);
 const base={taskId:input.taskId,sourceId:reading?.id,modality:input.modality,
  evaluator:B2_EVALUATOR_VERSION as typeof B2_EVALUATOR_VERSION,elapsedMs:Math.max(0,Math.min(7_200_000,Math.floor(input.elapsedMs))),
  playCount:Math.max(0,Math.min(2,input.playCount??0)),
  ...(input.kind==='p32'&&sourceValid&&authority?{
   sourceDigest:authority.digest,sourceRevision:authority.revision,sourceBlob:authority.sourceBlob,
   questionId:input.questionId,comprehensionCorrect,
   playbackCompleted:input.modality==='listening'&&input.audioCompleted===true,
   sourceEvaluator:P32_SOURCE_EVALUATOR as typeof P32_SOURCE_EVALUATOR
  }:{})};
 const observed=observeB2Draft(input.text);
 const marker=observed.markerFamilies;
 const contrast=Number(marker.includes('contrast')||marker.includes('concession'));
 const nuance=Number(marker.includes('qualification')||marker.includes('condition'))+contrast;
 const cohesion=['contrast','condition','example','consequence','conclusion'].filter(k=>marker.includes(k)).length;
 const lexRatio=observed.words?observed.distinctWords/observed.words:0;
 const anchorGroups=input.kind==='p31'
  ?groups(input.text,P31_ANCHORS[input.pair??0]?.[input.taskIndex??0]??[])
  :0;
 const coverage=input.kind==='p32'&&reading?sourceLexicalCoverage(input.text,reading):anchorGroups/3;
 const copy=input.kind==='p32'&&reading?
  sourceFivegramOverlap(input.text,reading.sentences.map(s=>s.fr).join(' ')):0;
 const repeat=observed.possibleRepeatedPhrases;
 const repetitionPenalty=clamp(100-repeat*8);
 const axes={
  task:clamp(coverage*100),
  argument:clamp((marker.includes('example')?25:0)+(marker.includes('conclusion')?25:0)+
   (observed.sentences>=4?25:0)+(observed.words>=110?25:0)),
  nuance:clamp(nuance*35),
  cohesion:clamp(cohesion*20),
  lexical:clamp(lexRatio*175),
  structural:clamp((observed.sentences>=4?45:0)+
   (marker.includes('condition')?30:0)+(observed.words>=110?25:0))
 };
 const score=clamp(.2*axes.task+.2*axes.argument+.17*axes.nuance+.17*axes.cohesion+
  .12*axes.lexical+.14*axes.structural);
 const confidence=clamp(40+(observed.words>=110?15:0)+(observed.sentences>=4?10:0)+
  (marker.length>=4?10:0)+(coverage>=.75?15:0)+(repetitionPenalty>=80?10:0));
 const transformation=clamp(.35*axes.argument+.3*axes.nuance+.35*axes.cohesion-
  Math.min(30,copy*100));
 let reason='Observable structural gates met; neither meaning nor grammar has been validated.';
 let status:B2Status='structural-targets-met';
 if(!input.attested){
  status='unscored';reason='Independent work attestation is required before calibrated structural checks.';
 }else if(input.kind==='p32'&&
  (!sourceValid||!reading||reading.level!=='B2'||input.modality==='argument'||reading.sentences.length<4)){
  status='unscored';reason='SHA-pinned P35 source or original question mismatch; transfer not scored.';
 }else if(input.kind==='p32'&&!answerProvided){
  status='unscored';reason='Answer the original P35 comprehension question before submitting.';
 }else if(input.kind==='p32'&&!comprehensionCorrect){
  status='insufficient';reason='Original source question was incorrect; no transfer credit.';
 }else if(input.kind==='p32'&&input.modality==='listening'&&
   (!input.audioCompleted||base.playCount<1||base.playCount>2||input.transcriptRevealed)){
  status='unscored';reason='Complete French device playback with hidden source is required; this is unscored.';
 }else if(observed.words<110||observed.sentences<4||coverage<.75||
    axes.argument<42||axes.nuance<35||axes.cohesion<35||
    score<58||confidence<(input.kind==='p32'?70:66)||repetitionPenalty<80||
    (input.kind==='p32'&&(transformation<52||copy>.18))){
  status='insufficient';reason='One or more observable hard gates were not met. This is not a language-ability judgment.';
 }
 return {...base,wordCount:observed.words,sentenceCount:observed.sentences,
  markerFamilies:marker,score,confidence,topicGroups:Math.round(coverage*4),
  directCopyPct:Math.round(copy*1000)/10,transformation,
  status,reason};
}
export function finalizeB2Attempt(kind:B2Kind,first:B2Receipt,second:B2Receipt,at:number):B2Attempt{
 if(kind==='p31'&&(first.modality!=='argument'||second.modality!=='argument'))
  throw Error('P31_TASK_PAIR_MISMATCH');
 if(kind==='p32'&&(first.modality!=='reading'||second.modality!=='listening'||
    !first.sourceId||!second.sourceId||first.sourceId===second.sourceId))
  throw Error('P32_SOURCE_PAIR_MISMATCH');
 if(kind==='p32'&&(
  first.sourceEvaluator!==P32_SOURCE_EVALUATOR||second.sourceEvaluator!==P32_SOURCE_EVALUATOR||
  !first.sourceDigest||first.sourceDigest!==second.sourceDigest||
  !first.sourceRevision||first.sourceRevision!==second.sourceRevision||
  !first.sourceBlob||first.sourceBlob!==second.sourceBlob))
  throw Error('P32_SOURCE_REVISION_MISMATCH');
 if(first.evaluator!==B2_EVALUATOR_VERSION||second.evaluator!==B2_EVALUATOR_VERSION)
  throw Error('B2_EVALUATOR_MISMATCH');
 const tasks:[B2Receipt,B2Receipt]=[first,second];
 const meanScore=(first.score+second.score)/2,meanConfidence=(first.confidence+second.confidence)/2;
 const status:B2Status=tasks.some(t=>t.status==='unscored')?'unscored':
  tasks.every(t=>t.status==='structural-targets-met')&&
   meanScore>=(kind==='p31'?62:64)&&meanConfidence>=(kind==='p31'?68:70)
   ?'structural-targets-met':'insufficient';
 return{id:'b2:'+kind+':'+at+':'+crypto.randomUUID(),kind,at,status,
  evaluator:B2_EVALUATOR_VERSION,tasks};
}
export function appendB2Attempt(old:B2Evidence,attempt:B2Attempt,nextToken:string):B2Evidence{
 if(attempt.kind==='p32'&&!currentB2Evidence(old,'p31',attempt.at))
  throw Error('P32_REQUIRES_CURRENT_P31');
 if(attempt.at<=0||!Number.isFinite(attempt.at)||!nextToken)throw Error('B2_INVALID_RECEIPT');
 return{schema:B2_EVIDENCE_SCHEMA,token:nextToken,
  history:[...old.history,attempt].slice(-24)};
}
