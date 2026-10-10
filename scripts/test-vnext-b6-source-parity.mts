import assert from 'node:assert/strict';
import {P35_P17_SCENARIOS,P35_P20_FUNCTIONS,P35_LATER_B2_FUNCTIONS,
 P35_P18_MISSIONS,P35_SCENE_ALIASES,P35_MISSION_ALIASES,
 legacySceneId,legacyMissionId,inspectP35ConversationCoverage,auditSourceLinkedMissions}
 from '../app/src/core/conversation/source-parity.ts';
import {MISSION_CHAINS} from '../app/src/core/conversation/missions.ts';
import {CONVERSATION_STARTERS} from '../app/src/core/conversation/scenarios.ts';
import {initialConversationState,beginMission,submitConversationResponse,safeConversationState,
 requestConversationRepeat} from '../app/src/core/conversation/engine.ts';
import {FUNCTION_CATALOG,functionProfiles} from '../app/src/core/conversation/curriculum.ts';

assert.equal(P35_P17_SCENARIOS.length,19,'19 preserved P35 P17 source graphs');
assert.equal(P35_P20_FUNCTIONS.length,25,'exact P20 source taxonomy, not native 23');
assert.equal(new Set(P35_P20_FUNCTIONS.map(f=>f.id)).size,25);
assert.equal(P35_LATER_B2_FUNCTIONS.length,6,'do not silently call late B2 additions original P20');
assert.equal(P35_P18_MISSIONS.length,5);
assert.equal(FUNCTION_CATALOG.length,23,'existing native scorer remains untouched');
assert.equal(functionProfiles([]).length,23,'source reference does not award any new scores');
assert.deepEqual(auditSourceLinkedMissions(),[],'every native mission now follows exact source IDs');
assert.equal(legacySceneId('neighbour'),null,'new native scenario is not a P35 P17 scene');
assert.equal(legacySceneId('past-problem'),'past-event');
assert.equal(legacyMissionId('independent-living'),'independent-living');
for(const [n,original] of Object.entries(P35_SCENE_ALIASES)){
 assert.ok(CONVERSATION_STARTERS.some(x=>x.id===n),'source alias must point to a real native scene');
 assert.ok(P35_P17_SCENARIOS.includes(original as typeof P35_P17_SCENARIOS[number]));
}
assert.equal(Object.keys(P35_MISSION_ALIASES).length,5);
const coverage=inspectP35ConversationCoverage();
assert.equal(coverage.originalFunctionScoringCertified,false);
assert.equal(coverage.sourceDialogueGraphEquivalent,false);
assert.equal(coverage.independentOralAssessmentCertified,false);
assert.equal(coverage.mappedSourceScenes,14);
assert.equal(coverage.unmappedNativeScenes.join(','),'neighbour');
assert.ok(coverage.missingOriginalScenes.includes('project-crisis'),'missing original B2 scenes must remain visible');
assert.equal(MISSION_CHAINS[4].scenarioIds[2],'past-problem');
assert.equal(MISSION_CHAINS[3].scenarioIds[2],'past-problem','both original missions reuse past-event');
let now=1_770_000_000_000;
// The updated source-aligned final mission must remain valid, resume safely,
// and withhold independence after a partner repair request.
let state=beginMission(initialConversationState(),'independent-living',now++);
for(let step=0;step<3;step++){
 const scene=CONVERSATION_STARTERS.find(s=>s.id===MISSION_CHAINS[4].scenarioIds[step]);
 assert.ok(scene);
 if(step===1){
  state=safeConversationState(JSON.parse(JSON.stringify(state)));
  assert.equal(state.mission?.step,1);
 }
 for(let n=0;n<scene!.turns.length;n++){
  if((step===1||step===2)&&n===0){
   const before=state.functionEvents.length;
   state=requestConversationRepeat(state,now++);
   assert.equal(state.active?.cursor,0);
   assert.equal(state.functionEvents.length,before+1);
   const last=state.functionEvents.at(-1);
   assert.equal(last?.repair,true);
   assert.equal(last?.credit,0,'repair cannot grant functional mastery');
  }
  const result=submitConversationResponse(state,scene!.turns[n].model,false,now++);
  assert.equal(result.accepted,true);
  state=result.state;
 }
}
assert.equal(state.mission,null);
assert.equal(state.missionHistory[0].tasks[2].scenarioId,'past-problem');
assert.equal(state.missionHistory[0].independentTurns,7,'two repaired turns out of nine are not independent');
assert.equal(state.missionHistory[0].independencePass,false,
 'two independently repaired turns lower independence below original P19 80 percent threshold');
assert.equal(state.missionHistory[0].fullyUnsupported,false);
assert.equal(state.missionHistory[0].manualTurns,0);
assert.equal(state.missionHistory[0].tasks.filter(t=>t.repairAttempts>0).length,2);
assert.equal(JSON.stringify(state).includes('Bonjour madame'),false,'no free-text history');
assert.equal(JSON.stringify(state).includes('recognizedText'),false,'no speech transcripts');
console.log(JSON.stringify({schema:'thiepn-french-b6-source-parity',ok:true,
 p35P17Graphs:19,sourceMapped:14,sourceOriginalFunctions:25,
 sourceB2Additional:6,sourceMissionChains:5,sourceDialogueParityCertified:false,
 speechCertification:false,srsModified:false,independentRepairCredit:false}));
