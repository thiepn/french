/** P37I-D2 — Read-only cross-skill evidence calibration.
 * A finite model match, scheduled word recall, ASR hypothesis and self-rated
 * speech are different observations. No CEFR inference or SRS writes.
 * Output is aggregate metadata only; never copy spoken/written learner text.
 */
import type {CanonicalReviewEventV1} from './model';
import type {FunctionEvidence} from '../conversation/curriculum';
import type {UsageState} from '../usage/session';
import {usageRecordMastery} from '../usage/mastery';
import type {WritingState} from '../writing/session';
import type {UsagePack,SentenceExercisePack} from '../content/loader';
import {sentenceSourceMap} from '../writing/bridge';

const DAY=86_400_000;
export const D2_WINDOW_DAYS=30;
export const D2_RECENT_DAYS=14;
export type EvidenceSkill='vocabulary'|'reading'|'listening'|'speaking'|'writing'|'context'|'interaction';
export type EvidenceStatus='unobserved'|'assisted-or-manual'|'single-context'|'repeated'|'varied';
export interface CalibratedLane{
  id:EvidenceSkill;label:string;attempts:number;independent:number;
  supported:number;manual:number;distinctTasks:number;activeDays:number;
  recentIndependent:number;status:EvidenceStatus;scope:string;limitation:string;
}
export interface CrossSkillBridge{
  usageReady:number;linkedWriting:number;contextSecured:number;
  multiModal:number;sourceFrames:number;sourceLinkedSentences:number;
}
export interface EvidenceCalibration{
  schema:'thiepn-french-p37i-d2-calibration';
  windowDays:30;lanes:CalibratedLane[];bridges:CrossSkillBridge;
  gaps:{id:string;route:'review'|'read'|'listen'|'speak'|'write'|'conversation';label:string;reason:string}[];
  caveat:string;cefr:'not-assessed';
}
export interface CalibrationInputs{
  events:readonly CanonicalReviewEventV1[];
  functionEvents:readonly FunctionEvidence[];
  usage:UsageState;writing:WritingState;
  usagePack:Pick<UsagePack,'records'>;
  sentences:Pick<SentenceExercisePack,'exercises'>;
  now?:number;
}
type Observation={at:number;task:string;independent:boolean;manual:boolean;support:boolean};
const TYPES:readonly EvidenceSkill[]=['vocabulary','reading','listening','speaking','writing','context','interaction'];
const INFO:Record<EvidenceSkill,[string,string,string]>={
  vocabulary:['Vocabulary recall','Scheduled individual-word recall','Recall of a word is not sentence production or comprehension.'],
  reading:['Reading comprehension','Recorded text-linked comprehension','Reading completion alone is exposure, not independently verified comprehension.'],
  listening:['First-listen dictation','Exact typed reproduction after first normal-speed playback','Repeated playback and transcripts do not verify first-listen comprehension.'],
  speaking:['Spoken production','Recording and self-rated/ASR-assisted production','Speech recognition and personal judgments do not verify pronunciation or spontaneous fluency.'],
  writing:['Sentence writing','Exact authored P12 sentence models','A model-sentence match is not unrestricted or spontaneous composition.'],
  context:['Situational usage','Two authored situations for a verified construction','Authored translations are not independent semantic assessment.'],
  interaction:['Guided interaction','Deterministically matched communicative functions','Scripted turns do not demonstrate unscripted conversational competence.']
};
const ROUTES:Record<EvidenceSkill,'review'|'read'|'listen'|'speak'|'write'|'conversation'>={
  vocabulary:'review',reading:'read',listening:'listen',speaking:'speak',
  writing:'write',context:'write',interaction:'conversation'
};
function valid(at:number,now:number):boolean{return Number.isSafeInteger(at)&&at>0&&at<=now&&at>=now-D2_WINDOW_DAYS*DAY;}
function noManual(e:CanonicalReviewEventV1):boolean{
  return !e.manualJudgment||e.manualJudgment==='matched';
}
function source(e:CanonicalReviewEventV1):EvidenceSkill|null{
  const p=e.practice??'';
  if(e.practiceOnly!==true)return 'vocabulary';
  if(p.startsWith('contextual-listening'))return 'listening';
  if(p.startsWith('spoken-'))return 'speaking';
  if(p.startsWith('written-'))return 'writing';
  if(p==='reading-context')return 'reading';
  // Usage-context is reconstructed from versioned, per-variant native state
  // instead; there is no variant ID in the canonical activity event.
  return null;
}
function uniqueTask(event:CanonicalReviewEventV1):string{
  return (event.sentenceExerciseId||event.noteId||event.id||'unknown').slice(0,120);
}
function trusted(event:CanonicalReviewEventV1,skill:EvidenceSkill):boolean{
  if(!event.correct||!noManual(event)||(event.supportLevel??0)>0||
      event.transcriptUsed===true||event.translationUsed===true)return false;
  if(event.typedQuality?.startsWith('manual-'))return false;
  switch(skill){
    case 'vocabulary':return event.practiceOnly!==true&&event.rating!=='again';
    case 'listening':return event.typed===true&&event.typedQuality==='exact'&&
      event.firstListen===true&&event.playCount===1&&
      (event.playbackRate??1)>=1;
    case 'writing':return event.typed===true&&
      ['exact','accepted'].includes(event.sentenceDiagnosis??event.typedQuality)&&
      ['exact','accepted'].includes(event.typedQuality);
    case 'reading':return false; // P35 reading task responses require source-specific verification.
    case 'speaking':return false; // Native speaking uses manual self-assessment.
    default:return false;
  }
}
function classify(rows:Observation[]):EvidenceStatus{
  const verified=rows.filter(row=>row.independent);
  if(!rows.length)return 'unobserved';
  if(!verified.length)return 'assisted-or-manual';
  const tasks=new Set(verified.map(row=>row.task));
  const days=new Set(verified.map(row=>new Date(row.at).toISOString().slice(0,10)));
  if(verified.length>=3&&tasks.size>=3&&days.size>=2)return 'varied';
  if(verified.length>=2&&tasks.size>=2&&days.size>=2)return 'repeated';
  return 'single-context';
}
export function calibrateFrenchEvidence(input:CalibrationInputs):EvidenceCalibration{
  const now=input.now??Date.now(),buckets=new Map<EvidenceSkill,Observation[]>(TYPES.map(key=>[key,[]]));
  const append=(skill:EvidenceSkill,row:Observation)=>{if(valid(row.at,now))buckets.get(skill)!.push(row);};
  for(const e of input.events){
    if(!valid(e.t,now))continue;
    const kind=source(e);if(!kind)continue;
    const independent=trusted(e,kind);
    append(kind,{at:e.t,task:uniqueTask(e),independent,
      manual:kind==='speaking'||!noManual(e)||Boolean(e.typedQuality?.startsWith('manual-')),
      support:(e.supportLevel??0)>0||Boolean(e.transcriptUsed||e.translationUsed)});
  }
  for(const e of input.functionEvents){
    if(!valid(e.at,now))continue;
    const independent=e.accepted===true&&e.independent===true&&
      e.manual===false&&e.support===0&&e.retries===0&&
      e.matched>=e.required&&e.required>0;
    append('interaction',{at:e.at,task:e.scenarioId+'|'+e.functionId,independent,
      manual:e.manual,support:e.support>0||e.retries>0});
  }
  // Contextual attempts must use the separate source-linked practice ledger,
  // not duplicate review-log entries that omit the attempted situation.
  for(const e of input.usage.history){
    if(e.mode!=='context'||!valid(e.at,now))continue;
    const independent=e.outcome==='matched'&&e.diagnosis==='exact'&&e.support===0;
    append('context',{at:e.at,task:e.recordId+':'+(e.variant??0),independent,
      manual:e.outcome==='self-assessed',support:e.support>0});
  }
  const calibrated=TYPES.map(id=>{
    const rows=buckets.get(id)??[];
    const accurate=rows.filter(e=>e.independent);
    const [label,scope,limitation]=INFO[id];
    return {id,label,attempts:rows.length,independent:accurate.length,
      supported:rows.filter(e=>e.support).length,manual:rows.filter(e=>e.manual).length,
      distinctTasks:new Set(accurate.map(e=>e.task)).size,
      activeDays:new Set(accurate.map(e=>new Date(e.at).toISOString().slice(0,10))).size,
      recentIndependent:accurate.filter(e=>e.at>=now-D2_RECENT_DAYS*DAY).length,
      status:classify(rows),scope,limitation};
  });
  const links=sentenceSourceMap(input.sentences,input.usagePack);
  const byRecord=new Map<string,string[]>();
  for(const [exerciseId,record] of links){
    byRecord.set(record.id,[...(byRecord.get(record.id)??[]),exerciseId]);
  }
  let usageReady=0,linkedWriting=0,contextSecured=0,multiModal=0;
  for(const record of input.usagePack.records){
    const evidence=usageRecordMastery(record.id,input.usage,now);
    const sourceReady=evidence.usage.independentExact>=2;
    const writeReady=(byRecord.get(record.id)??[]).some(id=>{
      const row=input.writing.evidence[id];
      return Boolean(row?.lastIndependent&&row.independentExact>0&&
        row.lastAt>=now-D2_WINDOW_DAYS*DAY&&row.lastAt<=now);
    });
    if(sourceReady)usageReady++;
    if(sourceReady&&writeReady)linkedWriting++;
    if(sourceReady&&evidence.contextual.secure)contextSecured++;
    if(sourceReady&&writeReady&&evidence.contextual.secure)multiModal++;
  }
  const gaps=calibrated.filter(lane=>lane.status!=='varied').map(lane=>({
    id:'calibrate-'+lane.id,route:ROUTES[lane.id],label:lane.label,
    reason:lane.status==='unobserved'?'No recent observable practice':
      lane.status==='assisted-or-manual'?'Only supported, manual or unverified responses recorded':
      lane.status==='single-context'?'Repeat independently on another prompt and day':
      'Broaden to a third independently verified prompt'
  }));
  return {schema:'thiepn-french-p37i-d2-calibration',windowDays:D2_WINDOW_DAYS,
    lanes:calibrated,bridges:{usageReady,linkedWriting,contextSecured,multiModal,
      sourceFrames:input.usagePack.records.length,sourceLinkedSentences:links.size},
    gaps,caveat:'Evidence coverage is not a proficiency percentage. Model matches, first-listen dictation, scheduled vocabulary recall and scripted conversation cannot certify open-ended CEFR competence.',
    cefr:'not-assessed'};
}
