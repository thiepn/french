import type {CoachAction,CoachRoute} from './study-coach';
/** P23: native activities own completion. The plan holds metadata, never answers. */
export type StepId='review'|'read'|'listen'|'speak'|'write'|'conversation'|'open-world';
export const STEP_MINUTES:Record<StepId,number>={review:10,read:6,listen:6,speak:8,write:8,conversation:10,'open-world':8};
const ROUTES:Record<StepId,CoachRoute>={review:'review',read:'read',listen:'listen',speak:'speak',write:'write',conversation:'conversation','open-world':'read'};
const PRIOR:Partial<Record<StepId,StepId[]>>={listen:['read'],speak:['listen','write'],conversation:['speak','write'],write:['review'],'open-world':['read','review']};
const IDS=Object.keys(ROUTES) as StepId[];
export type CompletionCounts=Record<StepId,number>;
export interface AdaptiveStep{id:StepId;title:string;route:CoachRoute;minutes:number;launchedAt:number;baseline:number;completedAt:number}
export interface AdaptiveBlock{schema:'thiepn-french-d5-adaptive-block';createdAt:number;cursor:number;steps:AdaptiveStep[];status:'active'|'completed'}
const num=(v:unknown)=>Number.isSafeInteger(v)&&Number(v)>=0?Number(v):0;
export function normalizeAdaptiveBlock(raw:unknown):AdaptiveBlock|null{
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return null;
  const x=raw as Record<string,unknown>;
  if(x.schema!=='thiepn-french-d5-adaptive-block'||!Array.isArray(x.steps)||x.steps.length<1||x.steps.length>3)return null;
  const steps:AdaptiveStep[]=[];
  for(const entry of x.steps){
    if(!entry||typeof entry!=='object'||Array.isArray(entry))return null;
    const v=entry as Record<string,unknown>,id=v.id as StepId;
    if(!IDS.includes(id)||steps.some(s=>s.id===id))return null;
    steps.push({id,route:ROUTES[id],title:String(v.title??id).slice(0,96),minutes:STEP_MINUTES[id],
      launchedAt:num(v.launchedAt),baseline:num(v.baseline),completedAt:num(v.completedAt)});
  }
  const cursor=num(x.cursor);
  if(cursor>steps.length||steps.reduce((n,s)=>n+s.minutes,0)>26)return null;
  return{schema:'thiepn-french-d5-adaptive-block',createdAt:num(x.createdAt),cursor,steps,status:cursor===steps.length?'completed':'active'};
}
export function composeAdaptiveBlock(actions:readonly CoachAction[],now=Date.now(),hasNativeWork=false):AdaptiveBlock|null{
  if(hasNativeWork)return null;
  const usable=actions.filter(x=>IDS.includes(x.id as StepId));
  if(!usable.length)return null;
  const available=new Map(usable.map(x=>[x.id as StepId,x]));
  const anchor=usable[0].id as StepId,chosen:StepId[]=[];let minutes=0;
  const add=(id:StepId)=>{
    if(!available.has(id)||chosen.includes(id)||chosen.length>=3||minutes+STEP_MINUTES[id]>26)return;
    chosen.push(id);minutes+=STEP_MINUTES[id];
  };
  for(const dep of PRIOR[anchor]??[])add(dep);
  add(anchor);
  for(const action of usable)add(action.id as StepId);
  return {schema:'thiepn-french-d5-adaptive-block',createdAt:now,cursor:0,status:'active',
    steps:chosen.map(id=>({id,title:available.get(id)!.title,route:ROUTES[id],minutes:STEP_MINUTES[id],launchedAt:0,baseline:0,completedAt:0}))};
}
export function launchAdaptiveStep(input:AdaptiveBlock,counters:CompletionCounts,now:number):AdaptiveBlock{
  const plan=normalizeAdaptiveBlock(input);if(!plan||plan.status!=='active')return input;
  const step=plan.steps[plan.cursor];if(!step.launchedAt){step.launchedAt=now;step.baseline=num(counters[step.id]);}
  return plan;
}
export function observeNativeCompletion(input:AdaptiveBlock,counters:CompletionCounts,now:number):AdaptiveBlock{
  const plan=normalizeAdaptiveBlock(input);if(!plan||plan.status!=='active')return input;
  const step=plan.steps[plan.cursor];
  if(!step.launchedAt||now<step.launchedAt||num(counters[step.id])<=step.baseline)return plan;
  step.completedAt=now;plan.cursor++;
  plan.status=plan.cursor===plan.steps.length?'completed':'active';return plan;
}
