import {P35_P20_FUNCTIONS} from './source-parity.ts';
import {P35_SOURCE_SCENARIOS} from './p35-graphs.ts';
import type {SourceGraphState} from './p35-runtime.ts';

/** A practical P20 source-function selector, never a new score or level engine.
 * Maps only original rule.func identities to original P35 authored scenarios.
 */
export function sourceFunctionPracticePlan(state:SourceGraphState){
 const levels=['A1','A2','B1'];
 const maxLevel=levels.indexOf(state.maxLevel);
 return P35_P20_FUNCTIONS.map(fn=>{
  const authored=P35_SOURCE_SCENARIOS.filter(g=>g.level!=='B2'&&
    Object.values(g.nodes).some(node=>node?.rules?.some(rule=>rule.func===fn.id)));
  const allowed=authored.filter(g=>levels.indexOf(g.level)<=maxLevel);
  const evidence=state.evidence.filter(e=>e.practiceOnly===true&&e.functionId===fn.id&&
    e.accepted&&e.independent&&!e.manual&&e.support===0);
  const attempted=new Set(evidence.map(e=>e.scenarioId));
  const choices=[...allowed].sort((a,b)=>Number(attempted.has(a.id))-Number(attempted.has(b.id))||
    levels.indexOf(a.level)-levels.indexOf(b.level)||a.id.localeCompare(b.id));
  return{id:fn.id,label:fn.label,group:fn.group,
    availableScenes:allowed.length,totalSourceScenes:authored.length,
    independentRuleMatches:evidence.length,practisedScenes:attempted.size,
    nextSceneId:choices[0]?.id??null,nextSceneTitle:choices[0]?.title??null};
 });
}
