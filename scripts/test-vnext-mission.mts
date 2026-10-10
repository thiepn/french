import assert from 'node:assert/strict';
import {MISSION_CHAINS,validateMissions} from '../app/src/core/conversation/missions.ts';
import {getConversationScenario} from '../app/src/core/conversation/scenarios.ts';
import {beginMission,endConversation,initialConversationState,safeConversationState,startConversation,submitConversationResponse} from '../app/src/core/conversation/engine.ts';
assert.equal(MISSION_CHAINS.length,5,'five complete real-world chains');
assert.deepEqual(validateMissions(),[],'every scene must exist without mission cycles');
assert.equal(new Set(MISSION_CHAINS.flatMap(m=>m.scenarioIds)).size,14,'P35 source deliberately reuses past-event in two chains');
let now=1_000;
for(const mission of MISSION_CHAINS){
  let state=beginMission(initialConversationState(),mission.id,now++);
  assert.throws(()=>beginMission(state,mission.id,now++),/CONVERSATION_ALREADY_ACTIVE/);
  assert.throws(()=>startConversation(state,'bakery',now++),/CONVERSATION_ALREADY_ACTIVE/);
  for(let step=0;step<3;step++){
    const scene=getConversationScenario(mission.scenarioIds[step]);
    assert.ok(scene);
    if(!scene)throw Error('missing scene');
    assert.equal(state.active?.scenarioId,scene.id,'mission stage must own current scenario');
    if(step===1){
      state=safeConversationState(JSON.parse(JSON.stringify(state)));
      assert.equal(state.mission?.step,1,'resume task index after backup roundtrip');
      assert.equal(state.mission?.completed.length,1,'retain completed task evidence');
    }
    for(const turn of scene.turns){
      const result=submitConversationResponse(state,turn.model,false,now++);
      assert.equal(result.accepted,true,'authored model must match '+scene.id+'/'+turn.functionId);
      state=result.state;
    }
  }
  assert.equal(state.active,null,'mission completes without an orphan conversation');
  assert.equal(state.mission,null);
  const result=state.missionHistory[0];
  assert.equal(result.missionId,mission.id);
  assert.equal(result.tasks.length,3);
  assert.equal(result.totalTurns,9);
  assert.equal(result.independentTurns,9);
  assert.equal(result.manualTurns,0);
  assert.equal(result.independencePass,true);
  assert.equal(result.fullyUnsupported,true);
  assert.equal(result.averageEvidence,1);
  assert.equal(state.history.length,3,'individual task evidence is also retained');
  assert.equal(JSON.stringify(state).includes('Bonjour madame'),false,'never persist transcript strings');
}
let assisted=beginMission(initialConversationState(),'morning-town',now++);
for(const [step,id] of MISSION_CHAINS[0].scenarioIds.entries()){
  const scene=getConversationScenario(id);
  assert.ok(scene);
  if(!scene)throw Error('missing mission scene');
  for(const [turnIndex,turn] of scene.turns.entries()){
    const result=submitConversationResponse(assisted,step===0&&turnIndex===0?'non standard response':turn.model,step===0&&turnIndex===0,now++);
    assisted=result.state;
  }
}
assert.equal(assisted.missionHistory[0].manualTurns,1);
assert.equal(assisted.missionHistory[0].independencePass,false,'manual continuations cannot inflate an independence pass');
assert.equal(assisted.missionHistory[0].fullyUnsupported,false);
const paused=beginMission(initialConversationState(),'arrival-day',now++);
const ended=endConversation(paused);
assert.equal(ended.active,null);
assert.equal(ended.mission,null);
assert.equal(ended.missionHistory.length,0,'cancelled mission cannot count as completed');
const broken=safeConversationState({...paused,mission:{...paused.mission,step:2}});
assert.equal(broken.mission,null,'never attach a mission to an inconsistent scene index');
assert.equal(broken.active?.scenarioId,'rail','preserve the standalone active scene if mission linkage is damaged');
console.log(JSON.stringify({schema:'french-p37i-b2-missions',ok:true,missions:5,taskScenarios:15,independentAndManualFixtures:true,resumeFixtures:true}));
