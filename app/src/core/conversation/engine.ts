import {getConversationScenario,type ConversationTurn} from './scenarios.ts';
import {getMission} from './missions.ts';

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
export interface ConversationState{
  schema:'thiepn-french-native-conversation-v1';
  active:ConversationActive|null;history:ConversationResult[];
  mission:MissionActive|null;missionHistory:MissionResult[];
}
export function initialConversationState():ConversationState{
  return{schema:'thiepn-french-native-conversation-v1',active:null,history:[],mission:null,missionHistory:[]};
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
  if(state.active||state.mission)throw new Error('CONVERSATION_ALREADY_ACTIVE');
  return{...state,active:activeFor(id,now)};
}
export function beginMission(state:ConversationState,id:string,now=Date.now()):ConversationState{
  const mission=getMission(id);
  if(!mission)throw new Error('UNKNOWN_MISSION');
  if(state.active||state.mission)throw new Error('CONVERSATION_ALREADY_ACTIVE');
  return{...state,mission:{missionId:id,step:0,startedAt:now,updatedAt:now,completed:[]},
    active:activeFor(mission.scenarioIds[0],now)};
}
export function endConversation(state:ConversationState):ConversationState{
  return{...state,active:null,mission:null};
}
export function raiseConversationSupport(state:ConversationState,level:1|2,now=Date.now()):ConversationState{
  if(!state.active)throw new Error('NO_ACTIVE_CONVERSATION');
  return{...state,active:{...state.active,updatedAt:now,support:Math.max(state.active.support,level) as 1|2}};
}
export type SubmitResult={state:ConversationState;accepted:boolean;finished:boolean;matched:number;total:number};
function evidenceCredit(turn:TurnEvidence):number{
  if(turn.manual)return 0;
  const support=turn.support===0?1:turn.support===1?.65:.2;
  return support*(turn.attempts>0?.65:1);
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
  const check=evaluateConversationTurn(turn,response);
  if(!manual&&!check.accepted){
    return{state:{...state,active:{...active,updatedAt:now,attempts:Math.min(100,active.attempts+1)}},
      accepted:false,finished:false,matched:check.matched,total:check.total};
  }
  const result:TurnEvidence={
    index:active.cursor,functionId:turn.functionId,independent:!manual&&active.support===0&&active.attempts===0,
    manual,support:active.support,attempts:active.attempts,matched:manual?0:check.matched,at:now
  };
  const turns=[...active.turns,result],cursor=active.cursor+1;
  if(cursor<scene.turns.length){
    return{state:{...state,active:{...active,cursor,turns,attempts:0,support:0,updatedAt:now}},
      accepted:true,finished:false,matched:check.matched,total:check.total};
  }
  const completed:ConversationResult={
    scenarioId:scene.id,completedAt:now,totalTurns:turns.length,
    independentTurns:turns.filter(row=>row.independent).length,
    manualTurns:turns.filter(row=>row.manual).length,
    maxSupport:Math.max(0,...turns.map(row=>row.support)),
    repairAttempts:turns.reduce((sum,row)=>sum+row.attempts,0),
    averageEvidence:turns.reduce((sum,row)=>sum+evidenceCredit(row),0)/turns.length
  };
  const history=[completed,...state.history].slice(0,120);
  if(!state.mission){
    return{state:{...state,active:null,history},accepted:true,finished:true,matched:check.matched,total:check.total};
  }
  const mission=state.mission,definition=getMission(mission.missionId);
  if(!definition)throw new Error('INVALID_MISSION_LINK');
  const finishedTasks=[...mission.completed,completed];
  const step=mission.step+1;
  if(step<definition.scenarioIds.length){
    return{state:{...state,history,mission:{...mission,step,updatedAt:now,completed:finishedTasks},
      active:activeFor(definition.scenarioIds[step],now)},accepted:true,finished:true,matched:check.matched,total:check.total};
  }
  const missionResult=completeMission(mission,finishedTasks,now);
  return{state:{...state,history,active:null,mission:null,
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
  const mission=definition&&active&&Number.isInteger(m?.step)&&m.step>=0&&m.step<3
    &&definition.scenarioIds[m.step]===active.scenarioId&&Array.isArray(m.completed)
    &&m.completed.length===m.step&&m.completed.every((row,index)=>row?.scenarioId===definition.scenarioIds[index])
    ?m:null;
  const missionHistory=(Array.isArray(value.missionHistory)?value.missionHistory:[])
    .filter(row=>row&&getMission(row.missionId)&&Array.isArray(row.tasks)&&row.tasks.length===3).slice(0,80);
  return{schema:'thiepn-french-native-conversation-v1',active,history,mission,missionHistory};
}
