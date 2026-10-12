import {INTEGRATED_MISSIONS,missionForId,validateIntegratedMissions,type IntegratedMission,type MissionStep} from './u5-missions.ts';
import {SOURCES} from './source.ts';

export type MissionRating='independent-claim'|'assisted-claim'|'needs-review';
export interface MissionEvent{
 readonly sequence:number;readonly missionId:string;readonly stepId:string;readonly rating:MissionRating;
}
export interface MissionCheckpoint{
 readonly schema:'thiepn-french-u5-mission-checkpoint-v1';
 readonly custody:'self-reported-local-only';readonly authoritative:false;readonly approved:false;
 readonly sourceRevision:string;readonly missionFingerprint:string;
 readonly events:readonly MissionEvent[];
}
export interface MissionReplay{
 readonly status:'valid'|'blocked';readonly reasons:readonly string[];
 readonly events:readonly MissionEvent[];readonly authoritative:false;readonly verifiedPerformance:false;
}
export interface ReviewAdvice{
 readonly kind:'retry'|'independent-practice'|'continue'|'finished';
 readonly missionId:string;readonly stepId:string|null;
 readonly title:string;readonly reason:string;readonly grammarId:string|null;readonly lessonId:string|null;
}
const MAX_EVENTS=96,MAX_BYTES=32768;
const RATINGS:readonly MissionRating[]=['independent-claim','assisted-claim','needs-review'];
const ROOT=['schema','custody','authoritative','approved','sourceRevision','missionFingerprint','events'];
const EVENT=['sequence','missionId','stepId','rating'];
function exact(obj:Record<string,unknown>,keys:readonly string[]):boolean{
 return Object.keys(obj).length===keys.length&&Object.keys(obj).every(k=>keys.includes(k));
}
function object(v:unknown):v is Record<string,unknown>{return !!v&&typeof v==='object'&&!Array.isArray(v);}
function sourceBytes():string{
 return INTEGRATED_MISSIONS.map(m=>[m.id,m.journeyId,m.sourceRevision,...m.steps.map(s=>
  [s.source.qualifiedId,s.lessonId,s.mode,s.prompt,s.reference,s.expected??'',...s.options,...s.criteria,...s.hints].join('|'))].join('~')).join('\n');
}
/** Change detector, NOT an authenticity signature; client JSON cannot prove performance. */
export function missionFingerprint():string{
 let result=2166136261;
 for(const b of new TextEncoder().encode(sourceBytes()))result=Math.imul(result^b,16777619)>>>0;
 return 'fnv1a32-'+result.toString(16).padStart(8,'0');
}
export function missionEvent(sequence:number,missionId:string,stepId:string,rating:MissionRating):MissionEvent|null{
 if(!Number.isSafeInteger(sequence)||sequence<1||sequence>MAX_EVENTS||!RATINGS.includes(rating))return null;
 const step=missionForId(missionId)?.steps.find(s=>s.id===stepId);
 return step?{sequence,missionId,stepId,rating}:null;
}
export function exportMissionCheckpoint(events:readonly MissionEvent[]):MissionCheckpoint{
 if(events.length>MAX_EVENTS)throw Error('Too many mission events to export');
 const items=events.map((e,i)=>({...e,sequence:i+1}));
 const snapshot:MissionCheckpoint={schema:'thiepn-french-u5-mission-checkpoint-v1',
  custody:'self-reported-local-only',authoritative:false,approved:false,
  sourceRevision:SOURCES.original.revision,missionFingerprint:missionFingerprint(),events:items};
 const check=inspectMissionCheckpoint(JSON.stringify(snapshot));
 if(check.status!=='valid')throw Error('Cannot export invalid mission events');
 return snapshot;
}
export function inspectMissionCheckpoint(raw:string):MissionReplay{
 const reasons:string[]=[];
 const blocked=():MissionReplay=>({status:'blocked',reasons:[...reasons],events:[],authoritative:false,verifiedPerformance:false});
 if(new TextEncoder().encode(raw).length>MAX_BYTES){reasons.push('File exceeds 32 KiB');return blocked();}
 let data:unknown;try{data=JSON.parse(raw);}catch{reasons.push('Malformed JSON');return blocked();}
 if(!object(data)||!exact(data,ROOT)){reasons.push('Unexpected schema fields');return blocked();}
 if(data.schema!=='thiepn-french-u5-mission-checkpoint-v1'||data.custody!=='self-reported-local-only'
  ||data.authoritative!==false||data.approved!==false){reasons.push('Disallowed authority claim');}
 if(data.sourceRevision!==SOURCES.original.revision||data.missionFingerprint!==missionFingerprint()){
  reasons.push('Stale mission catalog or source revision');
 }
 if(!Array.isArray(data.events)||data.events.length>MAX_EVENTS){reasons.push('Invalid event count');}
 if(reasons.length)return blocked();
 const events:MissionEvent[]=[];
 for(const rawEvent of data.events as unknown[]){
  if(!object(rawEvent)||!exact(rawEvent,EVENT)){reasons.push('Unexpected event shape');break;}
  const event=missionEvent(rawEvent.sequence as number,rawEvent.missionId as string,rawEvent.stepId as string,rawEvent.rating as MissionRating);
  if(!event||event.sequence!==events.length+1){reasons.push('Invalid event order, mission, step or rating');break;}
  events.push(event);
 }
 if(reasons.length)return blocked();
 return {status:'valid',reasons:[],events,authoritative:false,verifiedPerformance:false};
}
export function latestMissionRatings(mission:IntegratedMission,events:readonly MissionEvent[]):ReadonlyMap<string,MissionRating>{
 const result=new Map<string,MissionRating>();
 for(const event of events)if(event.missionId===mission.id&&mission.steps.some(s=>s.id===event.stepId))
  result.set(event.stepId,event.rating);
 return result;
}
export function reviewAdvice(missionId:string,events:readonly MissionEvent[]):ReviewAdvice|null{
 const mission=missionForId(missionId);if(!mission)return null;
 const ratings=latestMissionRatings(mission,events);
 const repeat=mission.steps.find(step=>ratings.get(step.id)==='needs-review');
 if(repeat)return advice('retry',mission,repeat,'Revisit this step. Check the source example and linked grammar.');
 const assisted=mission.steps.find(step=>ratings.get(step.id)==='assisted-claim');
 if(assisted)return advice('independent-practice',mission,assisted,'You used hints or a model. Try another attempt without them; this remains self-reported.');
 const next=mission.steps.find(step=>!ratings.has(step.id));
 if(next)return advice('continue',mission,next,'Move to the next original task in this journey.');
 return {kind:'finished',missionId,title:'Review your independent practice',stepId:null,
  reason:'All four steps were self-reported as attempted. No verified proficiency is awarded.',
  grammarId:null,lessonId:null};
}
function advice(kind:ReviewAdvice['kind'],mission:IntegratedMission,step:MissionStep,reason:string):ReviewAdvice{
 return {kind,missionId:mission.id,stepId:step.id,title:step.title,reason,grammarId:step.grammarId,lessonId:step.lessonId};
}
export function validateMissionHandoff():readonly string[]{
 const errors=[...validateIntegratedMissions()];
 if(new Set(INTEGRATED_MISSIONS.flatMap(m=>m.steps.map(s=>s.id))).size!==INTEGRATED_MISSIONS.length*4)
  errors.push('Duplicate step IDs');
 return errors;
}
