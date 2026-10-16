import {P35_SOURCE_SCENARIOS,getP35SourceScenario} from './p35-graphs.ts';
import {P35_P18_MISSIONS} from './source-parity.ts';
import type {SourceGraphState,SourceEvidence} from './p35-runtime.ts';

export interface OriginalRepairTarget {
 scenarioId:string;title:string;level:'A1'|'A2'|'B1';nodeId:string;
 functionId:string;independent:number;supported:number;repairs:number;
 sceneRuns:number;completedRuns:number;reason:'unseen'|'supported'|'repair'|'revisit';
}
function isVerifiedIndependent(e:SourceEvidence):boolean{
 return e.practiceOnly===true&&e.accepted&&e.independent&&!e.manual&&!e.repair&&
  e.support===0&&e.retries===0;
}
/** P17-P20 next practice derived exclusively from authored rule nodes and
 * local P35 practice-only history. Does not calculate CEFR/mastery or new grades.
 */
export function originalRepairTargets(state:SourceGraphState,limit=5):OriginalRepairTarget[]{
 const ceiling=['A1','A2','B1'].indexOf(state.maxLevel);
 const targets:OriginalRepairTarget[]=[];
 for(const graph of P35_SOURCE_SCENARIOS){
  if(graph.level==='B2'||['A1','A2','B1'].indexOf(graph.level)>ceiling)continue;
  const runs=state.history.filter(r=>r.scenarioId===graph.id);
  const source=state.evidence.filter(e=>e.scenarioId===graph.id&&e.practiceOnly===true);
  // One target per distinct P35 node/function pair; no synthetic sentences.
  const seen=new Set<string>();
  for(const [nodeId,node] of Object.entries(graph.nodes)){
   if(!node||node.end)continue;
   for(const rule of node.rules??[]){
    const key=nodeId+'|'+rule.func;
    if(seen.has(key))continue;seen.add(key);
    const matches=source.filter(e=>e.nodeId===nodeId&&e.functionId===rule.func);
    const independent=matches.filter(isVerifiedIndependent).length;
    const repairs=source.filter(e=>e.nodeId===nodeId&&e.repair).length;
    const supported=matches.filter(e=>e.accepted&&!isVerifiedIndependent(e)).length;
    const reason:OriginalRepairTarget['reason']=!matches.length?'unseen':
      repairs&&!independent?'repair':supported&&!independent?'supported':'revisit';
    targets.push({scenarioId:graph.id,title:graph.title,level:graph.level,
      nodeId,functionId:rule.func,independent,supported,repairs,
      sceneRuns:runs.length,completedRuns:runs.filter(r=>r.complete).length,reason});
   }
  }
 }
 const priority:Record<OriginalRepairTarget['reason'],number>={repair:0,supported:1,unseen:2,revisit:3};
 return targets.sort((a,b)=>priority[a.reason]-priority[b.reason]||
   a.independent-b.independent||a.completedRuns-b.completedRuns||
   a.sceneRuns-b.sceneRuns||a.scenarioId.localeCompare(b.scenarioId)||
   a.nodeId.localeCompare(b.nodeId)||a.functionId.localeCompare(b.functionId))
 .slice(0,Math.max(0,Math.min(20,limit)));
}
/** Selects original mission stage needing most rehearsal using actual P35
 * evidence and authored scenario order. A finished manual stage is NOT mastery.
 */
export function originalMissionRepairStages(state:SourceGraphState){
 const ceiling=['A1','A2','B1'].indexOf(state.maxLevel);
 return P35_P18_MISSIONS.map(mission=>{
  const eligible=mission.scenarios.every(id=>{
   const graph=getP35SourceScenario(id);
   return graph&&graph.level!=='B2'&&['A1','A2','B1'].indexOf(graph.level)<=ceiling;
  });
  const stages=mission.scenarios.map((scenarioId,index)=>{
   const runs=state.history.filter(r=>r.scenarioId===scenarioId);
   const latest=runs[0];
   const evidence=state.evidence.filter(e=>e.scenarioId===scenarioId);
   const independent=evidence.filter(isVerifiedIndependent).length;
   const supported=evidence.filter(e=>e.accepted&&!isVerifiedIndependent(e)).length;
   const repairs=evidence.filter(e=>e.repair).length;
   // Completed source-only runs with unsupported/incomplete goals retain priority.
   const priority=runs.length===0?0:!latest?.complete?1:
     repairs&&!independent?2:supported&&!independent?3:4;
   return{scenarioId,index,title:getP35SourceScenario(scenarioId)?.title??scenarioId,
     runs:runs.length,independent,supported,repairs,completed:latest?.complete??false,priority};
  }).sort((a,b)=>a.priority-b.priority||a.independent-b.independent||
    a.runs-b.runs||a.index-b.index);
  return{missionId:mission.id,title:mission.title,eligible,
    target:eligible?stages[0]:null,stages};
 });
}
