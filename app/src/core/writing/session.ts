import type {SentenceExercise,SentenceExercisePack} from '../content/loader';

export const WRITING_MODES=['phrase','sentence','transfer'] as const;
export type WritingMode=typeof WRITING_MODES[number];
export interface WritingAttempt{
  exerciseId:string;mode:WritingMode;at:number;
  outcome:'matched'|'self-assessed'|'needs-practice';
  diagnosis:string;support:0|1|2;
}
export interface WritingProgress{
  index:number;support:0|1|2;
}
export interface WritingState{
  schema:'thiepn-french-writing-v1';
  modes:Record<WritingMode,WritingProgress>;
  history:WritingAttempt[];
}
export function writingExercises(pack:Pick<SentenceExercisePack,'exercises'>,mode:WritingMode):SentenceExercise[]{
  const types=mode==='phrase'?['complete','cue']:mode==='sentence'?['translate','transform']:['transfer'];
  return pack.exercises.filter(row=>types.includes(row.type));
}
export function freshWritingState():WritingState{
  return{schema:'thiepn-french-writing-v1',
    modes:{phrase:{index:0,support:0},sentence:{index:0,support:0},transfer:{index:0,support:0}},
    history:[]};
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
    return typeof attempt.exerciseId==='string'&&/^p12-\d{3}$/.test(attempt.exerciseId)
      &&Number.isFinite(attempt.at)&&attempt.at>=0
      &&['matched','self-assessed','needs-practice'].includes(attempt.outcome)
      &&typeof attempt.diagnosis==='string'&&attempt.diagnosis.length<=40
      &&[0,1,2].includes(attempt.support);
  }).slice(0,300):[];
  return{schema:empty.schema,modes,history};
}
export function currentWritingExercise(pack:Pick<SentenceExercisePack,'exercises'>,state:WritingState,mode:WritingMode):SentenceExercise|undefined{
  const items=writingExercises(pack,mode);
  return items.length?items[state.modes[mode].index%items.length]:undefined;
}
export function revealWritingSupport(state:WritingState,mode:WritingMode,level:1|2):WritingState{
  const old=state.modes[mode];
  return{...state,modes:{...state.modes,[mode]:{...old,support:Math.max(old.support,level) as 1|2}}};
}
export function completeWritingAttempt(
  pack:Pick<SentenceExercisePack,'exercises'>,
  state:WritingState,mode:WritingMode,exerciseId:string,
  outcome:WritingAttempt['outcome'],diagnosis:string,at=Date.now()
):WritingState{
  if(currentWritingExercise(pack,state,mode)?.id!==exerciseId)throw Error('STALE_WRITING_EXERCISE');
  if(!['matched','self-assessed','needs-practice'].includes(outcome))throw Error('INVALID_WRITING_OUTCOME');
  const previous=state.modes[mode];
  const attempt:WritingAttempt={exerciseId,mode,at,outcome,diagnosis:diagnosis.slice(0,40),support:previous.support};
  return{...state,modes:{...state.modes,[mode]:{index:previous.index+1,support:0}},
    history:[attempt,...state.history].slice(0,300)};
}
