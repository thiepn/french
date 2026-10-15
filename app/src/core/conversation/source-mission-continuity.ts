import {P35_P18_MISSIONS} from './source-parity.ts';
import {getP35SourceScenario} from './p35-graphs.ts';
import type {SourceGraphState} from './p35-runtime.ts';

/** Source-only advisory. Neither historical scripted matches nor mission runs are CEFR proficiency. */
export function rankSourceMissionContinuity(state:SourceGraphState){
 const levels=['A1','A2','B1'];
 const ceiling=levels.indexOf(state.maxLevel);
 return P35_P18_MISSIONS.map(mission=>{
  const scenes=mission.scenarios.map(id=>getP35SourceScenario(id));
  const locked=scenes.some(scene=>!scene||levels.indexOf(scene.level)>ceiling||scene.level==='B2');
  const finished=scenes.map(scene=>(state.history??[])
   .filter(h=>h.scenarioId===scene?.id&&h.complete));
  const practised=finished.filter(rows=>rows.length>0).length;
  const weakest=scenes.flatMap((scene,i)=>finished[i].length?[]:[scene?.title??mission.scenarios[i]]);
  const average=finished.flatMap(x=>x).reduce((sum,run)=>sum+run.meanCredit,0)/
   Math.max(1,finished.flatMap(x=>x).length);
  return {id:mission.id,title:mission.title,locked,practised,total:3,missing:weakest,
    observedMeanCredit:Math.round(average*100)/100,
    isActive:state.mission?.id===mission.id};
 }).sort((a,b)=>Number(b.isActive)-Number(a.isActive)||Number(a.locked)-Number(b.locked)||
  a.practised-b.practised||a.observedMeanCredit-b.observedMeanCredit||a.title.localeCompare(b.title));
}
