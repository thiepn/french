import {getConversationScenario,type ConversationTurn} from './scenarios';

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
}
export interface ConversationState{
  schema:'thiepn-french-native-conversation-v1';
  active:ConversationActive|null;history:ConversationResult[];
}
export function initialConversationState():ConversationState{
  return{schema:'thiepn-french-native-conversation-v1',active:null,history:[]};
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
export function startConversation(state:ConversationState,id:string,now=Date.now()):ConversationState{
  if(!getConversationScenario(id))throw new Error('UNKNOWN_CONVERSATION');
  if(state.active)throw new Error('CONVERSATION_ALREADY_ACTIVE');
  return{...state,active:{scenarioId:id,startedAt:now,updatedAt:now,cursor:0,support:0,attempts:0,turns:[]}};
}
export function raiseConversationSupport(state:ConversationState,level:1|2,now=Date.now()):ConversationState{
  if(!state.active)throw new Error('NO_ACTIVE_CONVERSATION');
  return{...state,active:{...state.active,updatedAt:now,support:Math.max(state.active.support,level) as 1|2}};
}
export type SubmitResult={state:ConversationState;accepted:boolean;finished:boolean;matched:number;total:number};
export function submitConversationResponse(state:ConversationState,response:string,manual=false,now=Date.now()):SubmitResult{
  const active=state.active;if(!active)throw new Error('NO_ACTIVE_CONVERSATION');
  const scenario=getConversationScenario(active.scenarioId),turn=scenario?.turns[active.cursor];
  if(!scenario||!turn)throw new Error('INVALID_CONVERSATION_CURSOR');
  const check=evaluateConversationTurn(turn,response);
  if(!manual&&!check.accepted){
    return{state:{...state,active:{...active,updatedAt:now,attempts:Math.min(100,active.attempts+1)}},accepted:false,finished:false,matched:check.matched,total:check.total};
  }
  const result:TurnEvidence={
    index:active.cursor,functionId:turn.functionId,independent:!manual&&active.support===0&&active.attempts===0,
    manual,support:active.support,attempts:active.attempts,
    matched:manual?0:check.matched,at:now
  };
  const turns=[...active.turns,result],cursor=active.cursor+1;
  if(cursor<scenario.turns.length){
    return{state:{...state,active:{...active,cursor,turns,attempts:0,support:0,updatedAt:now}},accepted:true,finished:false,matched:check.matched,total:check.total};
  }
  const completed:ConversationResult={
    scenarioId:scenario.id,completedAt:now,totalTurns:turns.length,
    independentTurns:turns.filter(row=>row.independent).length,
    manualTurns:turns.filter(row=>row.manual).length,
    maxSupport:Math.max(0,...turns.map(row=>row.support)),
    repairAttempts:turns.reduce((sum,row)=>sum+row.attempts,0)
  };
  return{state:{...state,active:null,history:[completed,...state.history].slice(0,120)},accepted:true,finished:true,matched:check.matched,total:check.total};
}
export function safeConversationState(raw:unknown):ConversationState{
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return initialConversationState();
  const value=raw as Partial<ConversationState>;
  if(value.schema!=='thiepn-french-native-conversation-v1')return initialConversationState();
  const history=(Array.isArray(value.history)?value.history:[]).filter(row=>row&&getConversationScenario(row.scenarioId)).slice(0,120);
  const candidate=value.active;
  const scenario=candidate&&getConversationScenario(candidate.scenarioId);
  const active=scenario&&Number.isInteger(candidate?.cursor)&&candidate.cursor>=0&&candidate.cursor<scenario.turns.length&&
    Array.isArray(candidate.turns)&&candidate.turns.length===candidate.cursor
    ?candidate:null;
  return{schema:'thiepn-french-native-conversation-v1',active,history};
}
