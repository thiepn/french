import {getConversationScenario} from './scenarios.ts';

export interface MissionDefinition{
  id:string;title:string;level:'A1'|'A2'|'B1';
  scenarioIds:readonly [string,string,string];
}
export const MISSION_CHAINS:readonly MissionDefinition[]=[
  {id:'morning-town',title:'Morning in town',level:'A1',scenarioIds:['bakery','cafe','opening-hours']},
  {id:'arrival-day',title:'Arrival day',level:'A2',scenarioIds:['rail','directions','hotel']},
  {id:'meet-plan-decide',title:'Meet, plan, decide',level:'B1',scenarioIds:['classmate','weekend','disagreement']},
  {id:'solve-problems',title:'Solve everyday problems',level:'B1',scenarioIds:['restaurant','return','past-problem']},
  {id:'independent-living',title:'Independent living',level:'B1',scenarioIds:['delay','repair','neighbour']}
];
export function getMission(id:string):MissionDefinition|undefined{
  return MISSION_CHAINS.find(mission=>mission.id===id);
}
export function validateMissions():string[]{
  const errors:string[]=[];
  const ids=new Set<string>();
  for(const mission of MISSION_CHAINS){
    if(ids.has(mission.id))errors.push('Duplicate mission '+mission.id);
    ids.add(mission.id);
    if(mission.scenarioIds.length!==3||new Set(mission.scenarioIds).size!==3)
      errors.push('Invalid scenario chain '+mission.id);
    for(const scenarioId of mission.scenarioIds)
      if(!getConversationScenario(scenarioId))errors.push('Unknown scenario '+mission.id+'/'+scenarioId);
  }
  return errors;
}
