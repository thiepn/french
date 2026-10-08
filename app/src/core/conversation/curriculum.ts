import {CONVERSATION_STARTERS,type ConversationScenario} from './scenarios.ts';
import {MISSION_CHAINS,type MissionDefinition} from './missions.ts';

export type ConversationLevel='A1'|'A2'|'B1';
export type FunctionGroup='Foundation'|'Interaction'|'Problem solving'|'Planning & opinion'|'Narrative';
export interface CommunicativeFunction{
  id:string;label:string;group:FunctionGroup;
}
// This native subset has 23 observable functions. It is not the original
// P20 25-function taxonomy and must not be labelled full P20 parity.
export const FUNCTION_CATALOG:readonly CommunicativeFunction[]=[
  {id:'greeting',label:'Greeting',group:'Foundation'},
  {id:'introduction',label:'Introducing yourself',group:'Foundation'},
  {id:'request',label:'Making requests',group:'Foundation'},
  {id:'thanks',label:'Expressing thanks',group:'Foundation'},
  {id:'information',label:'Asking or giving information',group:'Foundation'},
  {id:'price',label:'Asking about prices',group:'Foundation'},
  {id:'payment',label:'Paying',group:'Foundation'},
  {id:'choice',label:'Choosing',group:'Interaction'},
  {id:'clarification',label:'Checking understanding',group:'Interaction'},
  {id:'confirmation',label:'Confirming details',group:'Interaction'},
  {id:'correction',label:'Correcting a mistake',group:'Interaction'},
  {id:'problem-solving',label:'Solving a problem',group:'Problem solving'},
  {id:'explanation',label:'Explaining a situation',group:'Problem solving'},
  {id:'consequence',label:'Explaining consequences',group:'Problem solving'},
  {id:'planning',label:'Planning',group:'Planning & opinion'},
  {id:'arrangement',label:'Making arrangements',group:'Planning & opinion'},
  {id:'suggestion',label:'Suggesting',group:'Planning & opinion'},
  {id:'opinion',label:'Giving an opinion',group:'Planning & opinion'},
  {id:'disagreement',label:'Disagreeing politely',group:'Planning & opinion'},
  {id:'negotiation',label:'Negotiating',group:'Planning & opinion'},
  {id:'decision',label:'Making a decision',group:'Planning & opinion'},
  {id:'narration',label:'Narrating events',group:'Narrative'},
  {id:'justification',label:'Justifying an opinion',group:'Narrative'}
];
export interface FunctionEvidence{
  scenarioId:string;functionId:string;turnIndex:number;
  at:number;level:ConversationLevel;
  accepted:boolean;manual:boolean;independent:boolean;
  support:number;retries:number;matched:number;required:number;
  credit:number;
}
export interface FunctionProfile{
  id:string;label:string;group:FunctionGroup;
  attempts:number;successes:number;independentSuccesses:number;
  contexts:number;days:number;confidence:number;strength:number;
  state:'unseen'|'emerging'|'developing'|'functional'|'secure';
  lastAt:number;
}
export interface RankedScenario{
  scenarioId:string;title:string;level:ConversationLevel;score:number;
  focus:string[];reason:string;
}
const LEVELS:readonly ConversationLevel[]=['A1','A2','B1'];
export function allowedConversationLevel(level:ConversationLevel,ceiling:ConversationLevel):boolean{
  return LEVELS.indexOf(level)<=LEVELS.indexOf(ceiling);
}
export function evidenceCredit(manual:boolean,support:number,retries:number,accepted:boolean):number{
  if(manual||!accepted)return 0;
  return Math.max(0,Math.min(1,(support===0?1:support===1?.65:.2)*(retries>0?.65:1)));
}
export function validateFunctionCatalog():string[]{
  const errors:string[]=[],ids=new Set<string>();
  for(const fn of FUNCTION_CATALOG){
    if(ids.has(fn.id))errors.push('Duplicate function '+fn.id);
    ids.add(fn.id);
  }
  const used=new Set<string>();
  for(const scene of CONVERSATION_STARTERS)
    for(const turn of scene.turns){
      used.add(turn.functionId);
      if(!ids.has(turn.functionId))errors.push('Unobservable function '+scene.id+'/'+turn.functionId);
    }
  for(const id of ids)if(!used.has(id))errors.push('Unused function '+id);
  return errors;
}
export function functionProfiles(events:readonly FunctionEvidence[]):FunctionProfile[]{
  return FUNCTION_CATALOG.map(fn=>{
    const rows=events.filter(row=>row.functionId===fn.id&&Number.isFinite(row.at));
    const successful=rows.filter(row=>row.accepted&&!row.manual);
    const independentSuccesses=successful.filter(row=>row.independent).length;
    const contexts=new Set(successful.map(row=>row.scenarioId)).size;
    const days=new Set(successful.map(row=>new Date(row.at).toISOString().slice(0,10))).size;
    const quality=successful.length?successful.reduce((n,row)=>n+Math.max(0,Math.min(1,row.credit)),0)/successful.length:0;
    // No "secure" from one day or one script. One-scene functions remain
    // capped at functional until distinct prompt variants are implemented.
    const availableContexts=new Set(CONVERSATION_STARTERS.filter(scene=>scene.turns.some(t=>t.functionId===fn.id)).map(x=>x.id)).size;
    const confidence=Math.min(1,(Math.min(rows.length,12)/12)*.35+
      (Math.min(days,4)/4)*.35+(Math.min(contexts,3)/3)*.3);
    const independence=successful.length?independentSuccesses/successful.length:0;
    const reliability=rows.length?successful.length/rows.length:0;
    const strength=quality*independence*reliability*confidence;
    const state:FunctionProfile['state']=rows.length===0?'unseen'
      :strength>=.72&&confidence>=.78&&days>=3&&independentSuccesses>=3&&contexts>=2&&availableContexts>=2?'secure'
      :strength>=.47&&independentSuccesses>=2&&days>=2?'functional'
      :strength>=.20&&independentSuccesses>=1?'developing':'emerging';
    return{id:fn.id,label:fn.label,group:fn.group,attempts:rows.length,
      successes:successful.length,independentSuccesses,
      contexts,days,confidence,strength,state,
      lastAt:Math.max(0,...rows.map(row=>row.at))};
  });
}
export function rankedNativeScenarios(events:readonly FunctionEvidence[],
  history:readonly {scenarioId:string;completedAt:number}[],ceiling:ConversationLevel='A1',
  now=Date.now()):RankedScenario[]{
  const profiles=new Map(functionProfiles(events).map(row=>[row.id,row]));
  return CONVERSATION_STARTERS.filter(scene=>allowedConversationLevel(scene.level,ceiling)).map(scene=>{
    const ids=[...new Set(scene.turns.map(t=>t.functionId))];
    const values=ids.map(id=>profiles.get(id)).filter((v):v is FunctionProfile=>Boolean(v));
    const weakness=values.reduce((n,v)=>n+1-v.strength,0)/Math.max(1,values.length);
    const unseen=values.filter(v=>v.state==='unseen').length/Math.max(1,values.length);
    const recent=history.filter(row=>row.scenarioId===scene.id&&row.completedAt>=now-7*86_400_000).length;
    const all=history.filter(row=>row.scenarioId===scene.id).length;
    const score=Math.round(100*weakness+35*unseen+Math.max(0,18-all*3)-recent*30);
    const focus=values.sort((a,b)=>a.strength-b.strength).slice(0,2).map(x=>x.id);
    const reason=unseen>0?'Introduces an unpractised communicative function'
      :weakness>.65?'Revisits weaker conversational skills'
      :'Builds repeat practice with a different situation';
    return{scenarioId:scene.id,title:scene.title,level:scene.level,score,focus,reason};
  }).sort((a,b)=>b.score-a.score||a.scenarioId.localeCompare(b.scenarioId));
}
export function rankNativeMissions(events:readonly FunctionEvidence[],
  missionHistory:readonly {missionId:string;completedAt:number;independencePass:boolean}[],
  ceiling:ConversationLevel='A1',now=Date.now()):MissionDefinition[]{
  const ranks=new Map(rankedNativeScenarios(events,[],ceiling,now).map(row=>[row.scenarioId,row.score]));
  return MISSION_CHAINS.filter(m=>allowedConversationLevel(m.level,ceiling)&&m.scenarioIds.every(id=>ranks.has(id)))
    .map(m=>{
      const score=m.scenarioIds.reduce((sum,id)=>sum+(ranks.get(id)??0),0)
        -missionHistory.filter(row=>row.missionId===m.id&&row.completedAt>=now-7*86_400_000).length*60
        -missionHistory.some(row=>row.missionId===m.id&&row.independencePass)?0:0;
      return{mission:m,score};
    }).sort((a,b)=>b.score-a.score||a.mission.id.localeCompare(b.mission.id)).map(row=>row.mission);
}
export function chooseAdaptiveQueue(events:readonly FunctionEvidence[],
  history:readonly {scenarioId:string;completedAt:number}[],
  ceiling:ConversationLevel='A1',now=Date.now()):readonly [string,string,string]{
  const choices=rankedNativeScenarios(events,history,ceiling,now);
  if(choices.length<3)throw new Error('NOT_ENOUGH_SCENARIOS');
  const selected:RankedScenario[]=[],covered=new Set<string>();
  for(let i=0;i<3;i++){
    const eligible=choices.filter(x=>!selected.some(y=>y.scenarioId===x.scenarioId));
    const ranked=eligible.map(x=>({
      row:x,score:x.score+45*x.focus.filter(id=>!covered.has(id)).length
    })).sort((a,b)=>b.score-a.score||a.row.scenarioId.localeCompare(b.row.scenarioId));
    const picked=ranked[0].row;selected.push(picked);for(const fn of picked.focus)covered.add(fn);
  }
  return[selected[0].scenarioId,selected[1].scenarioId,selected[2].scenarioId];
}
