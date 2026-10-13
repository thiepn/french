import {
 compareAndSetOriginalCourseCheckpoint,readCanonicalLearnerState
} from '../learner/repository.ts';
import {getOriginalCatalogEntry,getOriginalUnit,getOriginalMaterial,type OriginalStage} from './u23-registry.ts';

export const ORIGINAL_CONTINUITY_KEY='vU24OriginalCourse';
const SCHEMA='original-course-checkpoint-v1';
const MAX_AGE_MS=90*86_400_000;
const STAGES:readonly OriginalStage[]=['understand','words','dialogue','listen','practice','write'];

/**
 * Navigation only. No typed answer, draft, transcript, score, hint, SRS/CEFR
 * evidence, user identity or source text ever enters canonical featureState.
 */
export interface OriginalCourseCheckpoint{
 readonly schema:typeof SCHEMA;
 readonly token:string;
 readonly id:string;
 readonly qualifiedId:string;
 readonly sourceRevision:string;
 readonly stage:OriginalStage;
 readonly taskIndex:number;
 readonly taskId:string;
 readonly sourceSignature:string;
 readonly updatedAt:number;
 readonly navigationOnly:true;
}
export type ContinuityReview=Readonly<{
 status:'empty'|'ready'|'stale'|'blocked'|'unavailable';
 checkpoint:OriginalCourseCheckpoint|null;
 expectedToken:string|null;
 message:string;
}>;
function object(value:unknown):Record<string,unknown>|null{
 return value!==null&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:null;
}
/** Lightweight authoring-change detector, not a cryptographic rights signature. */
function originalSourceSignature(id:string):string|null{
 const data=getOriginalMaterial(id);if(!data)return null;
 const unit=data.unit;
 const source=[unit.source.qualifiedId,unit.title,unit.goal,
  ...unit.tasks.flatMap(task=>[task.id,task.prompt,task.answer]),
  ...unit.dialogue.map(turn=>turn.fr),unit.writing.prompt,unit.writing.model,
  data.reading?.french??''].join('\u241f');
 let hash=2166136261;
 for(let i=0;i<source.length;i++){
  hash^=source.charCodeAt(i);
  hash=Math.imul(hash,16777619);
 }
 return (hash>>>0).toString(16).padStart(8,'0');
}
function parseCheckpoint(value:unknown):OriginalCourseCheckpoint|null{
 const v=object(value);
 if(!v||v.schema!==SCHEMA||typeof v.token!=='string'||v.token.length<8||v.token.length>100||
    typeof v.id!=='string'||typeof v.qualifiedId!=='string'||typeof v.sourceRevision!=='string'||
    typeof v.taskId!=='string'||typeof v.sourceSignature!=='string'||
    !STAGES.includes(v.stage as OriginalStage)||typeof v.taskIndex!=='number'||!Number.isSafeInteger(v.taskIndex)||
    typeof v.updatedAt!=='number'||!Number.isFinite(v.updatedAt)||v.navigationOnly!==true)return null;
 return v as unknown as OriginalCourseCheckpoint;
}
export function reviewOriginalContinuity(value:unknown,now=Date.now()):ContinuityReview{
 if(value==null)return {status:'empty',checkpoint:null,expectedToken:null,message:'No original Course position saved on this device.'};
 const record=object(value),expectedToken=typeof record?.token==='string'?record.token:null;
 const checkpoint=parseCheckpoint(value);
 if(!checkpoint){
  return {status:'blocked',checkpoint:null,expectedToken,
   message:'Existing original Course position metadata is not recognized. It will not be replaced automatically.'};
 }
 const entry=getOriginalCatalogEntry(checkpoint.id),unit=getOriginalUnit(checkpoint.id);
 if(!entry||!unit||entry.qualifiedId!==checkpoint.qualifiedId||
    entry.sourceRevision!==checkpoint.sourceRevision||
    unit.tasks[checkpoint.taskIndex]?.id!==checkpoint.taskId||
    originalSourceSignature(checkpoint.id)!==checkpoint.sourceSignature||
    (checkpoint.stage==='practice'&&checkpoint.taskIndex>=unit.tasks.length)||
    checkpoint.taskIndex<0||checkpoint.taskIndex>=Math.max(1,unit.tasks.length)||
    checkpoint.updatedAt>now+300_000||
    now-checkpoint.updatedAt>MAX_AGE_MS){
  return {status:'stale',checkpoint,expectedToken,
   message:'The saved lesson source, exercise position or age needs review. It will not resume or overwrite automatically.'};
 }
 return {status:'ready',checkpoint,expectedToken,
  message:'Saved original Course position verified against current lesson and source revision.'};
}
export async function readOriginalContinuity():Promise<ContinuityReview>{
 try{
  const learner=await readCanonicalLearnerState();
  return reviewOriginalContinuity(learner?.featureState?.[ORIGINAL_CONTINUITY_KEY]);
 }catch{
  return {status:'unavailable',checkpoint:null,expectedToken:null,
   message:'Device learning storage is unavailable; Course lessons remain available without recovery.'};
 }
}
export function originalCheckpointTarget(id:string,stage:OriginalStage,taskIndex:number,now=Date.now()):
 OriginalCourseCheckpoint|null{
 const entry=getOriginalCatalogEntry(id),unit=getOriginalUnit(id);
 if(!entry||!unit||!STAGES.includes(stage)||!Number.isSafeInteger(taskIndex)||
    taskIndex<0||taskIndex>=Math.max(1,unit.tasks.length))return null;
 return {
  schema:SCHEMA,token:crypto.randomUUID(),id,qualifiedId:entry.qualifiedId,
  sourceRevision:entry.sourceRevision,stage,taskIndex,
  taskId:unit.tasks[taskIndex]?.id??'',sourceSignature:originalSourceSignature(id)??'',
  updatedAt:now,navigationOnly:true
 };
}
export async function saveOriginalContinuity(
 current:ContinuityReview,id:string,stage:OriginalStage,taskIndex:number
):Promise<{outcome:'saved'|'conflict'|'blocked';review:ContinuityReview}>{
 if(current.status==='unavailable'||current.status==='blocked'||current.status==='stale')
  return {outcome:'blocked',review:current};
 const next=originalCheckpointTarget(id,stage,taskIndex);
 if(!next)return {outcome:'blocked',review:current};
 const outcome=await compareAndSetOriginalCourseCheckpoint(current.expectedToken,next);
 if(outcome==='conflict')return {outcome:'conflict',review:await readOriginalContinuity()};
 return {outcome:'saved',review:reviewOriginalContinuity(next)};
}
export async function discardOriginalContinuity(current:ContinuityReview):
 Promise<{outcome:'discarded'|'conflict'|'blocked';review:ContinuityReview}>{
 if(current.status==='empty'||current.status==='unavailable'||current.status==='blocked')
  return {outcome:'blocked',review:current};
 const outcome=await compareAndSetOriginalCourseCheckpoint(current.expectedToken,null);
 if(outcome==='conflict')return {outcome:'conflict',review:await readOriginalContinuity()};
 return {outcome:'discarded',review:reviewOriginalContinuity(null)};
}
