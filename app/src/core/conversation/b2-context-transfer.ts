/**
 * U71 read-only B2 cross-context practice continuity. All task/function
 * identities come from pinned original P35 graph rules (P30's six advanced
 * functions). Uses only existing P35 source-graph practice history/evidence;
 * no new store, evaluator, assessment, benchmark or CEFR authority.
 */
import {P35_P30_B2_SCENES,P35_LATER_B2_FUNCTIONS} from './source-parity.ts';
import {getP35SourceScenario} from './p35-graphs.ts';
import type {SourceGraphState,SourceEvidence,SourceRun} from './p35-runtime.ts';

export type B2FunctionId=typeof P35_LATER_B2_FUNCTIONS[number];
export interface B2ContextTransfer{
 functionId:B2FunctionId;
 label:string;
 authoredContexts:number;
 completedUnassistedContexts:number;
 unassistedRuleMatches:number;
 assistedRuleMatches:number;
 unfinishedUnassistedContexts:number;
 supportedOnlyContexts:number;
 observedVariants:number;
 status:'not-observed'|'unfinished'|'supported-only'|'one-context'|'cross-context';
 nextSceneId:string|null;
 nextSceneTitle:string|null;
 nextAction:'first-context'|'retry-without-help'|'different-context'|'new-original-variant'|null;
}
const FUNCTION_LABELS:Record<B2FunctionId,string>={
 evaluate:'Evaluate evidence and options',
 qualify:'Qualify a claim',
 hypothesize:'Explore consequences',
 persuade:'Build a persuasive case',
 mediate:'Mediate viewpoints',
 synthesize:'Synthesize and conclude'
};
const strictIndependent=(e:SourceEvidence):boolean=>
 e.practiceOnly===true&&e.accepted===true&&e.independent===true&&
 e.repair===false&&e.manual===false&&e.support===0&&e.retries===0&&e.credit>0;

function sourceRunForEvent(event:SourceEvidence,runs:readonly SourceRun[]):boolean{
 return runs.some(run=>run.complete===true&&run.scenarioId===event.scenarioId&&
  run.variant===event.variant&&event.id.startsWith(run.id+':')&&
  event.at<=run.at);
}
export function deriveB2ContextTransfer(state:SourceGraphState):B2ContextTransfer[]{
 return P35_LATER_B2_FUNCTIONS.map(functionId=>{
  // Graph identity and actual authored rule.func both need to agree.
  const graphs=P35_P30_B2_SCENES.map(id=>getP35SourceScenario(id))
   .filter((graph):graph is NonNullable<typeof graph>=>Boolean(graph&&graph.level==='B2'&&
    Object.values(graph.nodes).some(node=>node?.rules?.some(rule=>rule.func===functionId))));
  const scenes=graphs.map(graph=>{
   const source=state.evidence.filter(e=>e.scenarioId===graph.id&&e.functionId===functionId&&
    e.practiceOnly===true&&graph.nodes[e.nodeId]?.rules?.some(rule=>rule.func===functionId));
   const history=state.history.filter(run=>run.scenarioId===graph.id);
   const independent=source.filter(e=>strictIndependent(e)&&sourceRunForEvent(e,history));
   const assisted=source.filter(e=>e.accepted&&!strictIndependent(e));
   const unfinished=source.filter(e=>strictIndependent(e)&&!sourceRunForEvent(e,history));
   const variants=new Set(independent.map(e=>e.variant));
   return{graph,independent,assisted,unfinished,variants,completed:history.filter(r=>r.complete).length};
  });
  const complete=scenes.filter(scene=>scene.independent.length>0);
  const supportedOnly=scenes.filter(scene=>scene.assisted.length>0&&!scene.independent.length);
  const unfinishedOnly=scenes.filter(scene=>scene.unfinished.length>0&&!scene.independent.length);
  const total=complete.reduce((n,scene)=>n+scene.independent.length,0);
  const assisted=scenes.reduce((n,scene)=>n+scene.assisted.length,0);
  const status:B2ContextTransfer['status']=complete.length>=2?'cross-context':
   complete.length===1?'one-context':assisted>0?'supported-only':
   unfinishedOnly.length>0?'unfinished':'not-observed';
  // Until a successful completed source run exists, retry an attempted
  // supported context before sending the learner elsewhere. Once one context
  // is observed, prioritize a different original setting. After every
  // setting, rotating original wording is a *practice choice*, not mastery.
  const ranked=[...scenes].sort((a,b)=>{
   const rank=(s:typeof a)=>{
    if(complete.length)return [s.independent.length>0?1:0,s.completed>0?1:0,s.variants.size];
    return [s.assisted.length||s.unfinished.length?0:1,s.completed>0?0:1,s.variants.size];
   };
   const x=rank(a),y=rank(b);
   return x[0]-y[0]||x[1]-y[1]||x[2]-y[2]||
    P35_P30_B2_SCENES.indexOf(a.graph.id as typeof P35_P30_B2_SCENES[number])-
    P35_P30_B2_SCENES.indexOf(b.graph.id as typeof P35_P30_B2_SCENES[number]);
  });
  const chosen=ranked[0];
  const nextAction:B2ContextTransfer['nextAction']=!chosen?null:
   complete.length&&chosen.independent.length===0?'different-context':
   complete.length?'new-original-variant':
   chosen.assisted.length||chosen.unfinished.length?'retry-without-help':'first-context';
  return{
   functionId,label:FUNCTION_LABELS[functionId],authoredContexts:graphs.length,
   completedUnassistedContexts:complete.length,
   unassistedRuleMatches:total,
   assistedRuleMatches:assisted,
   unfinishedUnassistedContexts:unfinishedOnly.length,
   supportedOnlyContexts:supportedOnly.length,
   observedVariants:new Set(complete.flatMap(scene=>
    [...scene.variants].map(v=>scene.graph.id+':'+v))).size,
   status,
   nextSceneId:chosen?.graph.id??null,
   nextSceneTitle:chosen?.graph.title??null,
   nextAction
  };
 });
}
