import {getConversationScenario,type ConversationTurn} from './scenarios.ts';
import {getMission} from './missions.ts';
import {
  chooseAdaptiveQueue,evidenceCredit,type FunctionEvidence,type ConversationLevel
} from './curriculum.ts';

export interface TurnEvidence{
  index:number;functionId:string;independent:boolean;manual:boolean;
  support:number;attempts:number;matched:number;at:number;
}
export interface ConversationActive{
  scenarioId:string;startedAt:number;updatedAt:number;cursor:number;
  support:0|1|2;attempts:number;turns:TurnEvidence[];
}
export interface ConversationResult{
  scenarioId:string;completedAt:number;totalTurns:number;independentTurns:number;
  manualTurns:number;maxSupport:number;repairAttempts:number;
  averageEvidence?:number;
}
export interface MissionActive{
  missionId:string;step:number;startedAt:number;updatedAt:number;
  completed:ConversationResult[];
}
export interface MissionResult{
  missionId:string;startedAt:number;completedAt:number;
  tasks:ConversationResult[];independentTurns:number;totalTurns:number;
  manualTurns:number;maxSupport:number;averageEvidence:number;
  independencePass:boolean;fullyUnsupported:boolean;
}
export interface AdaptiveActive{
  queue:readonly [string,string,string];step:number;startedAt:number;updatedAt:number;
  completed:ConversationResult[];focus:string[];
}
export interface AdaptiveResult{
  queue:readonly [string,string,string];completedAt:number;startedAt:number;tasks:ConversationResult[];
  independentTurns:number;totalTurns:number;
}
export interface ConversationState{
  schema:'thiepn-french-native-conversation-v1';
  active:ConversationActive|null;history:ConversationResult[];
  mission:MissionActive|null;missionHistory:MissionResult[];
  adaptive:AdaptiveActive|null;adaptiveHistory:AdaptiveResult[];
  functionEvents:FunctionEvidence[];levelCeiling:ConversationLevel;
}
export function initialConversationState():ConversationState{
  return{schema:'thiepn-french-native-conversation-v1',active:null,history:[],mission:null,missionHistory:[],
    adaptive:null,adaptiveHistory:[],functionEvents:[],levelCeiling:'A1'};
}
export function normalizeFrench(value:string):string{
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLocaleLowerCase('fr').replace(/[’']/g,' ').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
}
export function evaluateConversationTurn(turn:ConversationTurn,response:string):{accepted:boolean;matched:number;total:number}{
  const text=' '+normalizeFrench(response)+' ';
  const matched=turn.slots.filter(slot=>slot.some(variant=>{
    const key=normalizeFrench(variant);return key.length>0&&text.includes(' '+key+' ');
  })).length;
  return{accepted:matched===turn.slots.length&&normalizeFrench(response).length>=2,matched,total:turn.slots.length};
}
function activeFor(scenarioId:string,now:number):ConversationActive{
  return{scenarioId,startedAt:now,updatedAt:now,cursor:0,support:0,attempts:0,turns:[]};
}
export function startConversation(state:ConversationState,id:string,now=Date.now()):ConversationState{
  if(!getConversationScenario(id))throw new Error('UNKNOWN_CONVERSATION');
  if(state.active||state.mission||state.adaptive)throw new Error('CONVERSATION_ALREADY_ACTIVE');
  return{...state,active:activeFor(id,now)};
}
export function beginMission(state:ConversationState,id:string,now=Date.now()):ConversationState{
  const mission=getMission(id);
  if(!mission)throw new Error('UNKNOWN_MISSION');
  if(state.active||state.mission||state.adaptive)throw new Error('CONVERSATION_ALREADY_ACTIVE');
  return{...state,mission:{missionId:id,step:0,startedAt:now,updatedAt:now,completed:[]},
    active:activeFor(mission.scenarioIds[0],now)};
}
export function beginAdaptiveSet(state:ConversationState,now=Date.now()):ConversationState{
  if(state.active||state.mission||state.adaptive)throw new Error('CONVERSATION_ALREADY_ACTIVE');
  const queue=chooseAdaptiveQueue(state.functionEvents,state.history,state.levelCeiling,now);
  const focus=[...new Set(queue.flatMap(id=>getConversationScenario(id)?.turns.map(row=>row.functionId)??[]))];
  return{...state,adaptive:{queue,step:0,startedAt:now,updatedAt:now,completed:[],focus},
    active:activeFor(queue[0],now)};
}
export function changeConversationCeiling(state:ConversationState,level:ConversationLevel):ConversationState{
  if(!['A1','A2','B1'].includes(level))throw new Error('INVALID_LEVEL');
  if(state.active||state.mission||state.adaptive)throw new Error('CONVERSATION_ALREADY_ACTIVE');
  return{...state,levelCeiling:level};
}
export function endConversation(state:ConversationState):ConversationState{
  return{...state,active:null,mission:null,adaptive:null};
}
export function raiseConversationSupport(state:ConversationState,level:1|2,now=Date.now()):ConversationState{
  if(!state.active)throw new Error('NO_ACTIVE_CONVERSATION');
  return{...state,active:{...state.active,updatedAt:now,support:Math.max(state.active.support,level) as 1|2}};
}
export type SubmitResult={state:ConversationState;accepted:boolean;finished:boolean;matched:number;total:number};
// Raw learner text is never part of the persisted function evidence.
function compactFunctionEvidence(sceneId:string,level:ConversationLevel,index:number,functionId:string,
  at:number,check:{matched:number;total:number},accepted:boolean,manual:boolean,
  support:number,retries:number):FunctionEvidence{
  const independent=accepted&&!manual&&support===0&&retries===0;
  return{scenarioId:sceneId,level,functionId,turnIndex:index,at,accepted,manual,independent,
    support,retries,matched:check.matched,required:check.total,
    credit:evidenceCredit(manual,support,retries,accepted)};
}
function addEvidence(state:ConversationState,row:FunctionEvidence):FunctionEvidence[]{
  return[...state.functionEvents,row].slice(-1800);
}
function completeMission(mission:MissionActive,tasks:ConversationResult[],now:number):MissionResult{
  const totalTurns=tasks.reduce((total,row)=>total+row.totalTurns,0);
  const independentTurns=tasks.reduce((total,row)=>total+row.independentTurns,0);
  const manualTurns=tasks.reduce((total,row)=>total+row.manualTurns,0);
  const maxSupport=Math.max(0,...tasks.map(row=>row.maxSupport));
  const averageEvidence=totalTurns?tasks.reduce((total,row)=>total+(row.averageEvidence??0)*row.totalTurns,0)/totalTurns:0;
  const independencePass=tasks.length===3&&tasks.every(row=>row.totalTurns>=2)
    &&totalTurns>0&&independentTurns/totalTurns>=.8&&manualTurns===0&&maxSupport<=1&&averageEvidence>=.55;
  const fullyUnsupported=independencePass&&independentTurns===totalTurns&&maxSupport===0
    &&tasks.every(row=>row.repairAttempts===0);
  return{missionId:mission.missionId,startedAt:mission.startedAt,completedAt:now,tasks,
    independentTurns,totalTurns,manualTurns,maxSupport,averageEvidence,independencePass,fullyUnsupported};
}
export function submitConversationResponse(state:ConversationState,response:string,manual=false,now=Date.now()):SubmitResult{
  const active=state.active;if(!active)throw new Error('NO_ACTIVE_CONVERSATION');
  const scene=getConversationScenario(active.scenarioId),turn=scene?.turns[active.cursor];
  if(!scene||!turn)throw new Error('INVALID_CONVERSATION_CURSOR');
  if(state.mission&&getMission(state.mission.missionId)?.scenarioIds[state.mission.step]!==scene.id)
    throw new Error('INVALID_MISSION_LINK');
  if(state.adaptive&&state.adaptive.queue[state.adaptive.step]!==scene.id)
    throw new Error('INVALID_ADAPTIVE_LINK');
  const check=evaluateConversationTurn(turn,response);
  if(!manual&&!check.accepted){
    const nextAttempts=Math.min(100,active.attempts+1);
    const evidence=compactFunctionEvidence(scene.id,scene.level,active.cursor,turn.functionId,
      now,check,false,false,active.support,nextAttempts);
    return{state:{...state,functionEvents:addEvidence(state,evidence),
      active:{...active,updatedAt:now,attempts:nextAttempts}},
      accepted:false,finished:false,matched:check.matched,total:check.total};
  }
  const result:TurnEvidence={
    index:active.cursor,functionId:turn.functionId,independent:!manual&&active.support===0&&active.attempts===0,
    manual,support:active.support,attempts:active.attempts,matched:manual?0:check.matched,at:now
  };
  const turns=[...active.turns,result],cursor=active.cursor+1;
  const evidence=compactFunctionEvidence(scene.id,scene.level,active.cursor,turn.functionId,
    now,check,true,manual,active.support,active.attempts);
  const functionEvents=addEvidence(state,evidence);
  if(cursor<scene.turns.length){
    return{state:{...state,functionEvents,
      active:{...active,cursor,turns,attempts:0,support:0,updatedAt:now}},
      accepted:true,finished:false,matched:check.matched,total:check.total};
  }
  const completed:ConversationResult={
    scenarioId:scene.id,completedAt:now,totalTurns:turns.length,
    independentTurns:turns.filter(row=>row.independent).length,
    manualTurns:turns.filter(row=>row.manual).length,
    maxSupport:Math.max(0,...turns.map(row=>row.support)),
    repairAttempts:turns.reduce((sum,row)=>sum+row.attempts,0),
    averageEvidence:turns.reduce((sum,row)=>sum+
      evidenceCredit(row.manual,row.support,row.attempts,true),0)/turns.length
  };
  const history=[completed,...state.history].slice(0,120);
  if(state.adaptive){
    const adaptive=state.adaptive,completedTasks=[...adaptive.completed,completed];
    const step=adaptive.step+1;
    if(step<adaptive.queue.length)
      return{state:{...state,functionEvents,history,
        adaptive:{...adaptive,step,updatedAt:now,completed:completedTasks},
        active:activeFor(adaptive.queue[step],now)},
        accepted:true,finished:true,matched:check.matched,total:check.total};
    const totalTurns=completedTasks.reduce((n,row)=>n+row.totalTurns,0);
    const independentTurns=completedTasks.reduce((n,row)=>n+row.independentTurns,0);
    const result:AdaptiveResult={queue:adaptive.queue,startedAt:adaptive.startedAt,
      completedAt:now,tasks:completedTasks,totalTurns,independentTurns};
    return{state:{...state,functionEvents,history,active:null,adaptive:null,
      adaptiveHistory:[result,...state.adaptiveHistory].slice(0,60)},
      accepted:true,finished:true,matched:check.matched,total:check.total};
  }
  if(!state.mission){
    return{state:{...state,functionEvents,active:null,history},
      accepted:true,finished:true,matched:check.matched,total:check.total};
  }
  const mission=state.mission,definition=getMission(mission.missionId);
  if(!definition)throw new Error('INVALID_MISSION_LINK');
  const finishedTasks=[...mission.completed,completed];
  const step=mission.step+1;
  if(step<definition.scenarioIds.length){
    return{state:{...state,functionEvents,history,mission:{...mission,step,updatedAt:now,completed:finishedTasks},
      active:activeFor(definition.scenarioIds[step],now)},accepted:true,finished:true,matched:check.matched,total:check.total};
  }
  const missionResult=completeMission(mission,finishedTasks,now);
  return{state:{...state,functionEvents,history,active:null,mission:null,
    missionHistory:[missionResult,...state.missionHistory].slice(0,80)},
    accepted:true,finished:true,matched:check.matched,total:check.total};
}
export function safeConversationState(raw:unknown):ConversationState{
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return initialConversationState();
  const value=raw as Partial<ConversationState>;
  if(value.schema!=='thiepn-french-native-conversation-v1')return initialConversationState();
  const history=(Array.isArray(value.history)?value.history:[])
    .filter(row=>row&&getConversationScenario(row.scenarioId)).slice(0,120);
  const candidate=value.active,scene=candidate&&getConversationScenario(candidate.scenarioId);
  const active=scene&&Number.isInteger(candidate?.cursor)&&candidate.cursor>=0&&candidate.cursor<scene.turns.length
    &&Array.isArray(candidate.turns)&&candidate.turns.length===candidate.cursor?candidate:null;
  const m=value.mission,definition=m&&getMission(m.missionId);
  // If a stored mission and its in-progress scenario disagree, keep the scene
  // but do not invent missing completed tasks or silently award a mission pass.
  const mission=m&&definition&&active&&Number.isInteger(m.step)&&m.step>=0&&m.step<3
    &&definition.scenarioIds[m.step]===active.scenarioId&&Array.isArray(m.completed)
    &&m.completed.length===m.step&&m.completed.every((row,index)=>row?.scenarioId===definition.scenarioIds[index])
    ?m:null;
  const missionHistory=(Array.isArray(value.missionHistory)?value.missionHistory:[])
    .filter(row=>row&&getMission(row.missionId)&&Array.isArray(row.tasks)&&row.tasks.length===3).slice(0,80);
  const a=value.adaptive,queue=a?.queue;
  const adaptive=a&&active&&Array.isArray(queue)&&queue.length===3
    &&queue.every(id=>typeof id==='string'&&getConversationScenario(id))
    &&Number.isInteger(a.step)&&a.step>=0&&a.step<3
    &&queue[a.step]===active.scenarioId&&Array.isArray(a.completed)&&a.completed.length===a.step
    &&a.completed.every((row,index)=>row?.scenarioId===queue[index])&&!mission
    ?a:null;
  // Imported/synchronized progress is untrusted. Only internally consistent,
  // known scenario turns may contribute to communicative-function strength.
  // A mismatched function, source level or forged independence flag cannot
  // manufacture "secure" evidence through an edited backup.
  const functionEvents=(Array.isArray(value.functionEvents)?value.functionEvents:[])
    .filter((row):row is FunctionEvidence=>{
      if(!row||typeof row!=='object')return false;
      const scenario=getConversationScenario(row.scenarioId);
      if(!scenario||!Number.isInteger(row.turnIndex)||row.turnIndex<0||
        row.turnIndex>=scenario.turns.length)return false;
      const turn=scenario.turns[row.turnIndex];
      if(row.functionId!==turn.functionId||row.level!==scenario.level)return false;
      if(!Number.isFinite(row.at)||row.at<0||
        typeof row.accepted!=='boolean'||typeof row.manual!=='boolean'||
        typeof row.independent!=='boolean')return false;
      if(!Number.isInteger(row.support)||row.support<0||row.support>2||
        !Number.isInteger(row.retries)||row.retries<0||row.retries>100||
        !Number.isInteger(row.matched)||row.matched<0||
        row.matched>turn.slots.length||row.required!==turn.slots.length)return false;
      if(row.manual&&!row.accepted)return false;
      if(row.independent!==(row.accepted&&!row.manual&&row.support===0&&row.retries===0))
        return false;
      const credit=evidenceCredit(row.manual,row.support,row.retries,row.accepted);
      return Number.isFinite(row.credit)&&Math.abs(credit-row.credit)<1e-8;
    }).slice(-1800);
  const adaptiveHistory=(Array.isArray(value.adaptiveHistory)?value.adaptiveHistory:[])
    .filter(row=>row&&Array.isArray(row.queue)&&row.queue.length===3&&
      row.queue.every(id=>typeof id==='string'&&getConversationScenario(id))&&
      Array.isArray(row.tasks)&&row.tasks.length===3).slice(0,60);
  const levelCeiling:ConversationLevel=
    ['A1','A2','B1'].includes(String(value.levelCeiling))?value.levelCeiling as ConversationLevel:'A1';
  return{schema:'thiepn-french-native-conversation-v1',active,history,
    mission:adaptive?null:mission,missionHistory,
    adaptive,adaptiveHistory,functionEvents,levelCeiling};
}
