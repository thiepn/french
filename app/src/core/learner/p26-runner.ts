/** D6-B: privacy-minimal, practice-only P26 remediation session.
 * Guided stage acknowledgements are never correctness, SRS or CEFR credit.
 * An independent retest can finish only from later native graded evidence.
 */
import type {P26Case,P26Cause,P26Report,P26Route,P26Stage} from './p26-diagnosis.ts';
import {P26_CAUSES} from './p26-diagnosis.ts';

export const P26_STATE_KEY='v5170Remediation';
export const P26_STATE_SCHEMA='thiepn-french-p26-run-v1';
export interface RepairTask{
 key:string;noteId:string;cause:P26Cause;route:P26Route;stage:P26Stage;
 practiceOnly:true;armedAt?:number;
}
export interface RepairOutcome{key:string;kind:'passed'|'failed'|'skipped';at:number}
export interface ActiveRepairRun{
 id:string;startedAt:number;updatedAt:number;cursor:number;
 tasks:RepairTask[];outcomes:RepairOutcome[];
}
export interface CompletedRepairRun{
 id:string;startedAt:number;endedAt:number;status:'completed'|'cancelled';
 causes:P26Cause[];cases:number;tasks:number;retests:number;passed:number;
}
export interface RepairState{
 schema:typeof P26_STATE_SCHEMA;active:ActiveRepairRun|null;history:CompletedRepairRun[];
}
const STAGES:P26Stage[]=['scaffold','rebuild','independent-retest'];
const ROUTES:P26Route[]=['review','write','listen','speak','read','conversation'];
const finite=(value:unknown):value is number=>typeof value==='number'&&Number.isFinite(value)&&value>0;
const obj=(v:unknown):Record<string,unknown>=>v&&typeof v==='object'&&!Array.isArray(v)?v as Record<string,unknown>:{};
const validCause=(v:unknown):v is P26Cause=>P26_CAUSES.some(c=>c===v);
const validRoute=(v:unknown):v is P26Route=>ROUTES.some(c=>c===v);
const validStage=(v:unknown):v is P26Stage=>STAGES.some(c=>c===v);

export function emptyRepairState():RepairState{
 return{schema:P26_STATE_SCHEMA,active:null,history:[]};
}
export function normalizeRepairState(input:unknown):RepairState{
 const data=obj(input);
 if(data.schema!==P26_STATE_SCHEMA)return emptyRepairState();
 const history:CompletedRepairRun[]=[];
 for(const value of Array.isArray(data.history)?data.history.slice(-30):[]){
  const x=obj(value);
  if(typeof x.id!=='string'||!finite(x.startedAt)||!finite(x.endedAt)||
     (x.status!=='completed'&&x.status!=='cancelled'))continue;
  const causes=(Array.isArray(x.causes)?x.causes:[]).filter(validCause).slice(0,8);
  const counts=['cases','tasks','retests','passed'].map(k=>
    Math.max(0,Math.min(1000,Math.floor(Number(x[k])||0))));
  history.push({id:x.id.slice(0,90),startedAt:x.startedAt,endedAt:x.endedAt,
   status:x.status,causes,cases:counts[0],tasks:counts[1],retests:counts[2],passed:Math.min(counts[2],counts[3])});
 }
 const raw=obj(data.active),tasks:RepairTask[]=[];
 for(const row of Array.isArray(raw.tasks)?raw.tasks.slice(0,36):[]){
  const x=obj(row);
  if(typeof x.key!=='string'||typeof x.noteId!=='string'||
     x.key!==x.noteId+':'+x.cause||!validCause(x.cause)||
     !validRoute(x.route)||!validStage(x.stage)||x.practiceOnly!==true)continue;
  const task:RepairTask={key:x.key.slice(0,220),noteId:x.noteId.slice(0,160),
   cause:x.cause,route:x.route,stage:x.stage,practiceOnly:true};
  if(finite(x.armedAt))task.armedAt=x.armedAt;
  tasks.push(task);
 }
 const outcomes:RepairOutcome[]=[];
 for(const row of Array.isArray(raw.outcomes)?raw.outcomes.slice(0,12):[]){
  const x=obj(row);
  if(typeof x.key==='string'&&finite(x.at)&&['passed','failed','skipped'].includes(String(x.kind)))
   outcomes.push({key:x.key.slice(0,220),kind:x.kind as RepairOutcome['kind'],at:x.at});
 }
 const cursor=Number(raw.cursor);
 const active=typeof raw.id==='string'&&finite(raw.startedAt)&&tasks.length>0&&
     Number.isInteger(cursor)&&cursor>=0&&cursor<tasks.length?
  {id:raw.id.slice(0,90),startedAt:raw.startedAt,updatedAt:finite(raw.updatedAt)?raw.updatedAt:raw.startedAt,
   cursor,tasks,outcomes}:null;
 return{schema:P26_STATE_SCHEMA,active,history};
}
function finish(state:RepairState,run:ActiveRepairRun,now:number,status:'completed'|'cancelled'):RepairState{
 const keys=new Set(run.tasks.map(t=>t.key));
 const causes=[...new Set(run.tasks.map(t=>t.cause))];
 const retests=run.outcomes.filter(o=>o.kind==='passed'||o.kind==='failed').length;
 const passed=run.outcomes.filter(o=>o.kind==='passed').length;
 const receipt:CompletedRepairRun={id:run.id,startedAt:run.startedAt,endedAt:now,
  status,causes,cases:keys.size,tasks:status==='completed'?run.tasks.length:run.cursor,
  retests,passed};
 return{schema:P26_STATE_SCHEMA,active:null,history:[...state.history,receipt].slice(-30)};
}
export function startRepairRun(source:unknown,report:P26Report,now:number,maxCases=3):RepairState{
 const state=normalizeRepairState(source);
 if(state.active||report.sourceLimited)return state;
 const candidates=report.open.filter(c=>validCause(c.cause)&&validRoute(c.route)).slice(0,Math.max(1,Math.min(4,maxCases)));
 if(!candidates.length)return state;
 const tasks:RepairTask[]=[];
 // Stage-major order interleaves different cases; never repeat one case
 // three times in succession when alternatives are available.
 for(const stage of STAGES)for(const c of candidates){
  tasks.push({key:c.key,noteId:c.noteId,cause:c.cause,route:c.route,stage,practiceOnly:true});
 }
 return{...state,active:{id:'p26:'+now,startedAt:now,updatedAt:now,cursor:0,tasks,outcomes:[]}};
}
export function currentRepairTask(input:unknown):RepairTask|null{
 const state=normalizeRepairState(input);
 return state.active?.tasks[state.active.cursor]??null;
}
export function completeGuidedStep(source:unknown,expectedKey:string,now:number):RepairState{
 const state=normalizeRepairState(source),run=state.active;
 if(!run)return state;
 const task=run.tasks[run.cursor];
 if(!task||task.key!==expectedKey||task.stage==='independent-retest')return state;
 const next={...run,cursor:run.cursor+1,updatedAt:now};
 return next.cursor===next.tasks.length?finish(state,next,now,'completed'):{...state,active:next};
}
export function armRepairRetest(source:unknown,expectedKey:string,now:number):RepairState{
 const state=normalizeRepairState(source),run=state.active;
 if(!run)return state;
 const current=run.tasks[run.cursor];
 if(!current||current.key!==expectedKey||current.stage!=='independent-retest'||current.armedAt)return state;
 const tasks=run.tasks.map((task,i)=>i===run.cursor?{...task,armedAt:now}:task);
 return{...state,active:{...run,tasks,updatedAt:now}};
}
export type RetestVerification='not-armed'|'source-limited'|'pending'|'passed'|'failed';
export function checkRepairRetest(source:unknown,report:P26Report):RetestVerification{
 const task=currentRepairTask(source);
 if(!task||task.stage!=='independent-retest'||!task.armedAt)return 'not-armed';
 if(report.sourceLimited)return 'source-limited';
 const c=[...report.open,...report.repaired].find(row=>row.key===task.key);
 if(!c)return 'pending';
 if(c.status==='repaired'&&c.lastCleanAt>task.armedAt)return 'passed';
 if(c.lastFailedAt>task.armedAt)return 'failed';
 return 'pending';
}
export function resolveRepairRetest(source:unknown,expectedKey:string,report:P26Report,
 now:number,skip=false):RepairState{
 const state=normalizeRepairState(source),run=state.active;
 if(!run)return state;
 const task=run.tasks[run.cursor];
 if(!task||task.key!==expectedKey||task.stage!=='independent-retest')return state;
 const evidence=checkRepairRetest(state,report);
 if(!skip&&!['passed','failed'].includes(evidence))return state;
 if(run.outcomes.some(o=>o.key===task.key))return state;
 const outcomes=[...run.outcomes,{key:task.key,kind:skip?'skipped':evidence as 'passed'|'failed',at:now} as RepairOutcome];
 const next:ActiveRepairRun={...run,outcomes,cursor:run.cursor+1,updatedAt:now};
 return next.cursor>=next.tasks.length?finish(state,next,now,'completed'):{...state,active:next};
}
export function cancelRepairRun(source:unknown,now:number):RepairState{
 const state=normalizeRepairState(source);
 return state.active?finish(state,state.active,now,'cancelled'):state;
}
/** Session receipts are observations only; never translate them into SRS or CEFR events. */
export function repairSummary(input:unknown):{runs:number;retests:number;passed:number}{
 const runs=normalizeRepairState(input).history.filter(r=>r.status==='completed');
 return{runs:runs.length,retests:runs.reduce((n,r)=>n+r.retests,0),passed:runs.reduce((n,r)=>n+r.passed,0)};
}
