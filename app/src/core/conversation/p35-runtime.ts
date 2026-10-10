/** B7 practice-only P35 source graph execution.
 * No speech/meaning equivalence or CEFR credit is claimed. Source rules and
 * graph nodes are originals; grading abstains when no exact rule matches.
 */
import {P35_SOURCE_SCENARIOS,getP35SourceScenario,type P35Graph,type P35Rule} from './p35-graphs';
import {P35_P18_MISSIONS,P35_P20_FUNCTIONS} from './source-parity';
export const SOURCE_GRAPH_KEY='p35-source-graph-v1';
export const SOURCE_GRAPH_SCHEMA='thiepn-french-p35-source-graph-v1';
export interface SourceEvidence{
 id:string;scenarioId:string;nodeId:string;functionId:string;variant:number;at:number;
 accepted:boolean;repair:boolean;manual:boolean;support:number;retries:number;
 independent:boolean;confidence:number;credit:number;practiceOnly:true;
}
export interface SourceRun{
 id:string;scenarioId:string;at:number;variant:number;turns:number;independent:number;
 assisted:number;repairs:number;manual:number;meanCredit:number;complete:boolean;
}
export interface SourceActive{
 runId:string;scenarioId:string;nodeId:string;variant:number;
 startedAt:number;updatedAt:number;visits:number;turns:number;independent:number;
 assisted:number;repairs:number;manual:number;creditSum:number;
 support:0|1|2;attempts:number;slots:Record<string,string>;goals:string[];
}
export interface SourceMission{
 id:string;index:number;startedAt:number;completed:SourceRun[];
}
export interface SourceGraphState{
 schema:typeof SOURCE_GRAPH_SCHEMA;active:SourceActive|null;mission:SourceMission|null;
 history:SourceRun[];evidence:SourceEvidence[];maxLevel:'A1'|'A2'|'B1';
}
const originalFns=new Set<string>(P35_P20_FUNCTIONS.map(x=>x.id));
const missionById=(id:string)=>P35_P18_MISSIONS.find(x=>x.id===id);
const safeInt=(n:unknown,max=100)=>Number.isInteger(n)&&Number(n)>=0&&Number(n)<=max?Number(n):0;
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const obj=(input:unknown):Record<string,unknown>=>input&&typeof input==='object'&&!Array.isArray(input)?input as Record<string,unknown>:{};
const validLevel=(x:unknown):x is SourceGraphState['maxLevel']=>x==='A1'||x==='A2'||x==='B1';
export function emptySourceGraphState():SourceGraphState{
 return{schema:SOURCE_GRAPH_SCHEMA,active:null,mission:null,history:[],evidence:[],maxLevel:'A1'};
}
export function foldSource(value:string):string{
 return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr')
 .replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
}
function hasPattern(text:string,word:string):boolean{
 const pattern=foldSource(word);return Boolean(pattern)&&(' '+text+' ').includes(' '+pattern+' ');
}
function slotsFor(graph:P35Graph,raw:string,base:Record<string,string>):Record<string,string>{
 const text=foldSource(raw),next={...base};
 for(const [name,values] of Object.entries(graph.slots??{})){
  for(const [id,forms] of Object.entries(values??{})){
   if(forms.some(form=>hasPattern(text,form))){next[name]=id;break;}
  }
 }
 return next;
}
function sourceCredit(support:number,retries:number,manual:boolean,repair:boolean,confidence:number):number{
 if(manual||repair)return 0;
 return Math.round(clamp(confidence)*Math.max(0,support===0?1:support===1?.55:0)*
  (retries===0?1:.6)*.75*1000)/1000;
}
export function sourcePrompt(s:SourceActive):string{
 const graph=getP35SourceScenario(s.scenarioId),node=graph?.nodes[s.nodeId];
 if(!node)return '';
 const text=node.npcVariants?.[s.variant%node.npcVariants.length]??node.npc??'';
 return text.replace(/\{([a-zA-Z0-9_-]+)\}/g,(_,key:string)=>s.slots[key]??key);
}
export type SourceMatch={status:'accepted'|'repair'|'uncertain';rule?:P35Rule;slots:Record<string,string>;confidence:number;next?:string};
const repairs=['pardon','pouvez vous repeter','vous pouvez repeter','je n ai pas compris','je nai pas compris','plus lentement','qu est ce que ca veut dire'];
export function matchSourceRule(graph:P35Graph,nodeId:string,response:string,storedSlots:Record<string,string>):SourceMatch{
 const node=graph.nodes[nodeId],text=foldSource(response);
 if(!node||node.end)throw Error('UNKNOWN_SOURCE_NODE');
 const slots=slotsFor(graph,response,storedSlots);
 if(!text)return{status:'uncertain',slots,confidence:0};
 if(repairs.some(r=>hasPattern(text,r)))return{status:'repair',slots:storedSlots,confidence:.9};
 const count=text.split(' ').length;
 for(const rule of node.rules??[]){
  const matched=rule.need.filter(g=>g.some(v=>hasPattern(text,v))).length;
  const needed=rule.need.length;
  const threshold=typeof rule.minWords==='number'?Math.max(1,rule.minWords):Math.max(1,needed);
  // P35 similarity fallbacks and open semantic matches intentionally abstain
  // without a separately validated scorer instead of implying equivalent credit.
  if(matched===needed&&count>=threshold&&needed>0){
   const next=rule.skipIfSlot&&slots[rule.skipIfSlot]&&rule.skipNext?rule.skipNext:rule.next;
   if(!graph.nodes[next])throw Error('INVALID_SOURCE_EDGE');
   return{status:'accepted',rule,slots,confidence:clamp(.65+.06*matched),next};
  }
 }
 return{status:'uncertain',slots:storedSlots,confidence:0};
}
export function validateSourceGraphs():string[]{
 const problems:string[]=[],ids=new Set<string>();
 for(const graph of P35_SOURCE_SCENARIOS){
  if(ids.has(graph.id))problems.push('duplicate '+graph.id);ids.add(graph.id);
  if(!graph.nodes[graph.start])problems.push('start missing '+graph.id);
  for(const [id,node] of Object.entries(graph.nodes)){
   if(!node){problems.push('empty node '+graph.id+'/'+id);continue;}
   if(!node.end&&!(node.rules??[]).length)problems.push('no rules '+graph.id+'/'+id);
   for(const rule of node.rules??[]){
    if(!graph.nodes[rule.next])problems.push('missing edge '+graph.id+'/'+id+'/'+rule.next);
    if(rule.skipNext&&!graph.nodes[rule.skipNext])problems.push('missing skip edge '+graph.id+'/'+id+'/'+rule.skipNext);
    if(!rule.need.every(group=>group.length&&group.every(Boolean)))problems.push('empty rule '+graph.id+'/'+id);
   }
  }
 }
 for(const mission of P35_P18_MISSIONS)
  for(const id of mission.scenarios)if(!ids.has(id))problems.push('missing mission scene '+mission.id+'/'+id);
 return problems;
}
function newActive(state:SourceGraphState,graph:P35Graph,now:number):SourceActive{
 const count=state.history.filter(r=>r.scenarioId===graph.id).length;
 return{runId:'source:'+now+':'+graph.id,scenarioId:graph.id,nodeId:graph.start,
  variant:count%graph.variantCount,startedAt:now,updatedAt:now,visits:0,turns:0,
  independent:0,assisted:0,repairs:0,manual:0,creditSum:0,support:0,attempts:0,slots:{},goals:[]};
}
export function startSourceGraph(state:SourceGraphState,id:string,now:number):SourceGraphState{
 const g=getP35SourceScenario(id);
 if(!g||g.level==='B2')throw Error('SOURCE_GRAPH_NOT_AUTHORIZED');
 if(state.active||state.mission)throw Error('SOURCE_ALREADY_ACTIVE');
 if(['A1','A2','B1'].indexOf(g.level)>['A1','A2','B1'].indexOf(state.maxLevel))throw Error('SOURCE_LEVEL_LOCKED');
 return{...state,active:newActive(state,g,now)};
}
export function startSourceMission(state:SourceGraphState,id:string,now:number):SourceGraphState{
 const mission=missionById(id);
 if(!mission)throw Error('UNKNOWN_SOURCE_MISSION');
 if(state.active||state.mission)throw Error('SOURCE_ALREADY_ACTIVE');
 const graphs=mission.scenarios.map(id=>getP35SourceScenario(id));
 if(graphs.some(g=>!g||g.level==='B2'||['A1','A2','B1'].indexOf(g.level)>
 ['A1','A2','B1'].indexOf(state.maxLevel)))throw Error('SOURCE_MISSION_LEVEL_LOCKED');
 const graph=graphs[0];
 if(!graph)throw Error('UNKNOWN_SOURCE_GRAPH');
 return{...state,mission:{id,index:0,startedAt:now,completed:[]},
  active:newActive(state,graph,now)};
}
export function sourceSupport(state:SourceGraphState,level:1|2,now:number):SourceGraphState{
 if(!state.active)return state;
 return{...state,active:{...state.active,support:Math.max(state.active.support,level) as 1|2,updatedAt:now}};
}
export function cancelSourceGraph(state:SourceGraphState):SourceGraphState{return{...state,active:null,mission:null};}
export type SourceAction={state:SourceGraphState;outcome:'accepted'|'uncertain'|'repair'|'finished';message:string};
export function respondSourceGraph(state:SourceGraphState,response:string,now:number,manual=false):SourceAction{
 const active=state.active,graph=active&&getP35SourceScenario(active.scenarioId);
 if(!active||!graph||!graph.nodes[active.nodeId])throw Error('NO_SOURCE_ACTIVE');
 if(response.trim().length===0||response.length>650)return{state,outcome:'uncertain',message:'Enter a short French reply.'};
 const matched=matchSourceRule(graph,active.nodeId,response,active.slots);
 if(matched.status==='repair'){
  const updated={...active,support:Math.max(1,active.support) as 1|2,
   attempts:Math.min(100,active.attempts+1),repairs:active.repairs+1,updatedAt:now};
  const repairEvidence:SourceEvidence={id:active.runId+':repair:'+active.visits+':'+updated.repairs,
   scenarioId:graph.id,nodeId:active.nodeId,functionId:'clarify',variant:active.variant,at:now,
   accepted:false,repair:true,manual:false,support:updated.support,retries:updated.attempts,
   independent:false,confidence:0,credit:0,practiceOnly:true};
  return{state:{...state,active:updated,evidence:[...state.evidence,repairEvidence].slice(-1000)},outcome:'repair',
   message:graph.nodes[active.nodeId]?.clarify??'Bien sûr, je reformule la question.'};
 }
 if(matched.status==='uncertain'&&!manual){
  const updated={...active,attempts:Math.min(100,active.attempts+1),updatedAt:now};
  return{state:{...state,active:updated},outcome:'uncertain',
   message:'The original source rules did not confidently match. Try again, ask for help, or continue without credit.'};
 }
 const rule=matched.rule??graph.nodes[active.nodeId]?.rules?.[0];
 if(!rule)throw Error('SOURCE_NO_FALLBACK_RULE');
 const next=matched.next??(rule.skipIfSlot&&matched.slots[rule.skipIfSlot]&&rule.skipNext?rule.skipNext:rule.next);
 if(!graph.nodes[next])throw Error('INVALID_SOURCE_EDGE');
 if(active.visits>=45)throw Error('SOURCE_GRAPH_VISIT_CAP');
 const independent=!manual&&active.support===0&&active.attempts===0;
 const credit=sourceCredit(active.support,active.attempts,manual,false,matched.confidence);
 const fn=rule.func;
 const evidence:SourceEvidence[]=[...state.evidence];
 if(originalFns.has(fn)){
  // Practice-only provenance. Not translated to existing native profile
  // scores, FSRS cards, benchmark, or CEFR; unknown functions abstain.
  evidence.push({id:active.runId+':'+active.visits,scenarioId:graph.id,nodeId:active.nodeId,
   functionId:fn,variant:active.variant,at:now,accepted:!manual,repair:false,
   manual,support:active.support,retries:active.attempts,independent,
   confidence:manual?0:matched.confidence,credit,practiceOnly:true});
 }
 const done=graph.nodes[next].end===true;
 const updated:SourceActive={...active,nodeId:next,visits:active.visits+1,turns:active.turns+1,
  independent:active.independent+(independent?1:0),
  assisted:active.assisted+(!independent?1:0),
  manual:active.manual+(manual?1:0),creditSum:active.creditSum+credit,
  goals:[...new Set([...active.goals,...rule.gain,
   ...(rule.skipIfSlot&&matched.slots[rule.skipIfSlot]&&rule.skipNext?
     (graph.nodes[rule.next]?.rules?.[0]?.gain??[]):[])])].slice(0,30),
  slots:matched.slots,support:0,attempts:0,updatedAt:now};
 const newEvidence=evidence.slice(-1000);
 if(!done)return{state:{...state,active:updated,evidence:newEvidence},outcome:'accepted',
  message:'Matched a pinned source rule. Practice only; no proficiency or SRS credit.'};
 const run:SourceRun={id:active.runId,scenarioId:graph.id,at:now,variant:active.variant,
  turns:updated.turns,independent:updated.independent,assisted:updated.assisted,
  repairs:updated.repairs,manual:updated.manual,meanCredit:Math.round(updated.creditSum/updated.turns*1000)/1000,
  complete:graph.requiredGoals.every(g=>updated.goals.includes(g))};
 const history=[run,...state.history].slice(0,90);
 if(state.mission){
  const mission=missionById(state.mission.id);
  if(!mission||mission.scenarios[state.mission.index]!==graph.id)throw Error('SOURCE_MISSION_LINK_INVALID');
  const index=state.mission.index+1,completed=[...state.mission.completed,run];
  if(index<3){
   const nextGraph=getP35SourceScenario(mission.scenarios[index]);
   if(!nextGraph)throw Error('SOURCE_MISSION_GRAPH_MISSING');
   const withHistory={...state,history,evidence:newEvidence};
   return{state:{...withHistory,mission:{...state.mission,index,completed},
     active:newActive(withHistory,nextGraph,now)},outcome:'finished',
     message:'Source scenario finished. Next mission task '+(index+1)+' of 3; practice evidence only.'};
  }
  return{state:{...state,active:null,mission:null,history,evidence:newEvidence},
   outcome:'finished',message:'Source mission finished: '+completed.filter(x=>x.complete).length+
   '/3 task goals observed. No original P35 release or CEFR certification.'};
 }
 return{state:{...state,active:null,history,evidence:newEvidence},outcome:'finished',
  message:'Source dialogue finished · '+updated.independent+'/'+updated.turns+
   ' unassisted rule-matched turns. No CEFR or SRS award.'};
}
export function safeSourceGraphState(raw:unknown):SourceGraphState{
 const input=obj(raw);if(input.schema!==SOURCE_GRAPH_SCHEMA)return emptySourceGraphState();
 const history:SourceRun[]=[];
 for(const row of Array.isArray(input.history)?input.history.slice(0,90):[]){
  const x=obj(row),g=typeof x.scenarioId==='string'&&getP35SourceScenario(x.scenarioId);
  if(!g||typeof x.id!=='string'||!Number.isFinite(x.at))continue;
  history.push({id:x.id.slice(0,100),scenarioId:g.id,at:Number(x.at),variant:safeInt(x.variant,2),
   turns:safeInt(x.turns,45),independent:safeInt(x.independent,45),assisted:safeInt(x.assisted,45),
   repairs:safeInt(x.repairs,100),manual:safeInt(x.manual,45),
   meanCredit:clamp(Number(x.meanCredit)||0),complete:x.complete===true});
 }
 const evidence:SourceEvidence[]=[];
 for(const value of Array.isArray(input.evidence)?input.evidence.slice(-1000):[]){
  const x=obj(value),graph=typeof x.scenarioId==='string'?getP35SourceScenario(x.scenarioId):undefined;
  const node=graph?.nodes[String(x.nodeId)];
  if(!graph||!node||!originalFns.has(String(x.functionId))||
   !(x.repair===true&&x.functionId==='clarify'||(node.rules??[]).some(r=>r.func===x.functionId))||
   typeof x.id!=='string'||!Number.isFinite(x.at)||x.practiceOnly!==true||
   typeof x.repair!=='boolean'||typeof x.manual!=='boolean'||typeof x.accepted!=='boolean'||
   (!x.repair&&x.accepted===x.manual)||!Number.isInteger(x.support)||Number(x.support)<0||Number(x.support)>2||
   !Number.isInteger(x.retries)||Number(x.retries)<0||Number(x.retries)>100||
   (x.independent!==(x.accepted&&x.support===0&&x.retries===0)))continue;
  const confidence=Number(x.confidence);
  if(!Number.isFinite(confidence)||confidence<0||confidence>1)continue;
  if(x.repair&&(x.accepted||x.manual||x.independent||confidence!==0||x.credit!==0))continue;
  const credit=sourceCredit(Number(x.support),Number(x.retries),x.manual,x.repair,confidence);
  if(!Number.isFinite(x.credit)||Math.abs(credit-Number(x.credit))>1e-7)continue;
  evidence.push({id:x.id.slice(0,140),scenarioId:graph.id,nodeId:String(x.nodeId),
   functionId:String(x.functionId),variant:safeInt(x.variant,2),at:Number(x.at),accepted:x.accepted,
   manual:x.manual,repair:x.repair,support:Number(x.support),retries:Number(x.retries),
   independent:x.independent,confidence,credit,practiceOnly:true});
 }
 let active:SourceActive|null=null;
 const a=obj(input.active),g=typeof a.scenarioId==='string'&&getP35SourceScenario(a.scenarioId);
 if(g&&g.level!=='B2'&&typeof a.runId==='string'&&typeof a.nodeId==='string'&&
   g.nodes[a.nodeId]&&!g.nodes[a.nodeId]?.end&&Number.isFinite(a.startedAt)){
  const slots:Record<string,string>={};
  for(const [k,v] of Object.entries(obj(a.slots)).slice(0,20))
   if(typeof v==='string'&&g.slots?.[k]?.[v])slots[k]=v;
  active={runId:a.runId.slice(0,100),scenarioId:g.id,nodeId:a.nodeId,
   variant:safeInt(a.variant,2),startedAt:Number(a.startedAt),
   updatedAt:Number.isFinite(a.updatedAt)?Number(a.updatedAt):Number(a.startedAt),
   visits:safeInt(a.visits,45),turns:safeInt(a.turns,45),independent:safeInt(a.independent,45),
   assisted:safeInt(a.assisted,45),repairs:safeInt(a.repairs),manual:safeInt(a.manual,45),
   creditSum:Number.isFinite(a.creditSum)?Math.max(0,Math.min(45,Number(a.creditSum))):0,
   support:safeInt(a.support,2) as 0|1|2,attempts:safeInt(a.attempts),
   slots,goals:(Array.isArray(a.goals)?a.goals:[]).filter((v):v is string=>typeof v==='string'&&g.requiredGoals.includes(v)).slice(0,30)};
 }
 let mission:SourceMission|null=null;
 const m=obj(input.mission),definition=typeof m.id==='string'&&missionById(m.id);
 if(active&&definition&&safeInt(m.index,2)<3&&
   definition.scenarios[safeInt(m.index,2)]===active.scenarioId&&
   Array.isArray(m.completed)&&m.completed.length===safeInt(m.index,2)&&
   m.completed.every((r:unknown,i:number)=>obj(r).scenarioId===definition.scenarios[i])){
  mission={id:definition.id,index:safeInt(m.index,2),startedAt:Number(m.startedAt)||active.startedAt,
   completed:m.completed.map((v:unknown)=>history.find(r=>r.id===obj(v).id))
     .filter((v:SourceRun|undefined):v is SourceRun=>Boolean(v)).slice(0,2)};
 }
 return{schema:SOURCE_GRAPH_SCHEMA,active,mission,history,evidence,
  maxLevel:validLevel(input.maxLevel)?input.maxLevel:'A1'};
}
