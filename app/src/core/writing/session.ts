import type {SentenceExercise,SentenceExercisePack,UsagePack} from '../content/loader';
import type {UsageState} from '../usage/session';
import {rankedSentenceBridge} from './bridge';

export const WRITING_MODES=['phrase','sentence','transfer','bridge'] as const;
export type WritingMode=typeof WRITING_MODES[number];
export interface WritingAttempt{
  exerciseId:string;mode:WritingMode;at:number;
  outcome:'matched'|'self-assessed'|'needs-practice';
  diagnosis:string;support:0|1|2;
}
export interface WritingTally{
  attempts:number;independentExact:number;lastAt:number;lastIndependent:boolean;lastDiagnosis:string;
}
export interface WritingProgress{
  index:number;support:0|1|2;
}
export interface WritingState{
  schema:'thiepn-french-writing-v1';
  modes:Record<WritingMode,WritingProgress>;
  history:WritingAttempt[];
  evidence:Record<string,WritingTally>;
}
export function writingExercises(pack:Pick<SentenceExercisePack,'exercises'>,mode:WritingMode):SentenceExercise[]{
  if(mode==='bridge')return pack.exercises;
  const types=mode==='phrase'?['complete','cue']:mode==='sentence'?['translate','transform']:['transfer'];
  return pack.exercises.filter(row=>types.includes(row.type));
}
export function freshWritingState():WritingState{
  return{schema:'thiepn-french-writing-v1',
    modes:{phrase:{index:0,support:0},sentence:{index:0,support:0},transfer:{index:0,support:0},bridge:{index:0,support:0}},
    history:[],evidence:{}};
}
function validMode(value:unknown):value is WritingMode{
  return WRITING_MODES.includes(value as WritingMode);
}
function index(value:unknown):number{
  return Number.isSafeInteger(value)&&Number(value)>=0&&Number(value)<=10_000_000?Number(value):0;
}
function support(value:unknown):0|1|2{
  return value===1||value===2?value:0;
}
export function safeWritingState(raw:unknown):WritingState{
  const empty=freshWritingState();
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return empty;
  const value=raw as Partial<WritingState>;
  if(value.schema!==empty.schema)return empty;
  const modes={...empty.modes};
  for(const mode of WRITING_MODES){
    const entry=value.modes?.[mode];
    modes[mode]={index:index(entry?.index),support:support(entry?.support)};
  }
  const history=Array.isArray(value.history)?value.history.filter((attempt):attempt is WritingAttempt=>{
    if(!attempt||typeof attempt!=='object'||!validMode(attempt.mode))return false;
    return typeof attempt.exerciseId==='string'&&/^p12-(?:00[1-9]|0[12]\d|03[0-6])$/.test(attempt.exerciseId)
      &&Number.isSafeInteger(attempt.at)&&attempt.at>=0&&attempt.at<=Date.now()+86_400_000
      &&['matched','self-assessed','needs-practice'].includes(attempt.outcome)
      &&typeof attempt.diagnosis==='string'&&attempt.diagnosis.length<=40
      &&[0,1,2].includes(attempt.support);
  }).slice(0,300):[];
  const evidence:WritingState['evidence']={};
  const supplied=value.evidence;
  // C4 only accepts compact metadata for known preserved P12 ID slots.
  if(supplied&&typeof supplied==='object'&&!Array.isArray(supplied)){
    for(const [id,row] of Object.entries(supplied)){
      if(!/^p12-(?:00[1-9]|0[12]\d|03[0-6])$/.test(id)||!row||
         !Number.isSafeInteger(row.attempts)||row.attempts<0||row.attempts>10_000_000||
         !Number.isSafeInteger(row.independentExact)||row.independentExact<0||
         row.independentExact>row.attempts||
         !Number.isSafeInteger(row.lastAt)||row.lastAt<0||row.lastAt>Date.now()+86_400_000||
         typeof row.lastIndependent!=='boolean'||typeof row.lastDiagnosis!=='string'||
         row.lastDiagnosis.length>40||
         (row.lastIndependent&&(!['exact','accepted'].includes(row.lastDiagnosis)||
           row.independentExact===0)))continue;
      evidence[id]={attempts:row.attempts,independentExact:row.independentExact,
        lastAt:row.lastAt,lastIndependent:row.lastIndependent,lastDiagnosis:row.lastDiagnosis};
    }
  }
  // Backfill C1-C4 devices with history-only data. Never let a bounded
  // history overwrite a validated greater cumulative tally.
  const reconstructed:WritingState['evidence']={};
  for(const attempt of [...history].sort((a,b)=>a.at-b.at)){
    const t=reconstructed[attempt.exerciseId];
    reconstructed[attempt.exerciseId]=nextWritingTally(t,attempt);
  }
  for(const [id,row] of Object.entries(reconstructed)){
    if(!evidence[id]||evidence[id].attempts<row.attempts||evidence[id].lastAt<row.lastAt) evidence[id]=row;
  }
  return{schema:empty.schema,modes,history,evidence};
}
export function currentWritingExercise(
  pack:Pick<SentenceExercisePack,'exercises'>,state:WritingState,mode:WritingMode,
  usagePack?:Pick<UsagePack,'records'>,usageState?:UsageState
):SentenceExercise|undefined{
  if(mode==='bridge'){
    if(!usagePack||!usageState)return undefined;
    const ranked=rankedSentenceBridge(pack,usagePack,usageState,state);
    const previous=state.history.find(e=>e.mode==='bridge')?.exerciseId;
    return (ranked.find(item=>item.exercise.id!==previous)??ranked[0])?.exercise;
  }
  const items=writingExercises(pack,mode);
  return items.length?items[state.modes[mode].index%items.length]:undefined;
}
export function revealWritingSupport(state:WritingState,mode:WritingMode,level:1|2):WritingState{
  const old=state.modes[mode];
  return{...state,modes:{...state.modes,[mode]:{...old,support:Math.max(old.support,level) as 1|2}}};
}
export function nextWritingTally(previous:WritingTally|undefined,event:WritingAttempt):WritingTally{
  const exact=event.outcome==='matched'&&['exact','accepted'].includes(event.diagnosis)&&event.support===0;
  return {attempts:(previous?.attempts??0)+1,independentExact:(previous?.independentExact??0)+Number(exact),
    lastAt:Math.max(previous?.lastAt??0,event.at),lastIndependent:exact,lastDiagnosis:event.diagnosis};
}
export function completeWritingAttempt(
  pack:Pick<SentenceExercisePack,'exercises'>,
  state:WritingState,mode:WritingMode,exerciseId:string,
  outcome:WritingAttempt['outcome'],diagnosis:string,at=Date.now(),
  usagePack?:Pick<UsagePack,'records'>,usageState?:UsageState
):WritingState{
  if(currentWritingExercise(pack,state,mode,usagePack,usageState)?.id!==exerciseId)throw Error('STALE_WRITING_EXERCISE');
  if(!['matched','self-assessed','needs-practice'].includes(outcome))throw Error('INVALID_WRITING_OUTCOME');
  const previous=state.modes[mode];
  const attempt:WritingAttempt={exerciseId,mode,at,outcome,diagnosis:diagnosis.slice(0,40),support:previous.support};
  return{...state,modes:{...state.modes,[mode]:{index:previous.index+1,support:0}},
    history:[attempt,...state.history].slice(0,300),
    evidence:{...state.evidence,[exerciseId]:nextWritingTally(state.evidence[exerciseId],attempt)}};
}
