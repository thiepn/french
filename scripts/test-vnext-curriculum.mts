import assert from 'node:assert/strict';
import {
  FUNCTION_CATALOG,validateFunctionCatalog,evidenceCredit,functionProfiles,
  rankedNativeScenarios,rankNativeMissions,chooseAdaptiveQueue,type FunctionEvidence
} from '../app/src/core/conversation/curriculum.ts';
import {
  initialConversationState,beginAdaptiveSet,beginMission,startConversation,
  submitConversationResponse,endConversation,safeConversationState
} from '../app/src/core/conversation/engine.ts';
import {getConversationScenario} from '../app/src/core/conversation/scenarios.ts';
import {MISSION_CHAINS} from '../app/src/core/conversation/missions.ts';

assert.equal(FUNCTION_CATALOG.length,23,'only actually observable native functions');
assert.deepEqual(validateFunctionCatalog(),[],'every function must be scored and used');
assert.equal(evidenceCredit(false,0,0,true),1);
assert.equal(evidenceCredit(false,1,0,true),.65);
assert.equal(evidenceCredit(false,0,2,true),.65);
assert.equal(evidenceCredit(true,0,0,true),0);
assert.equal(evidenceCredit(false,0,0,false),0);
const now=1_760_000_000_000;
function row(patch:Partial<FunctionEvidence>):FunctionEvidence{
  return{scenarioId:'bakery',functionId:'request',turnIndex:1,at:now,level:'A1',accepted:true,
    manual:false,independent:true,support:0,retries:0,matched:2,required:2,credit:1,...patch};
}
const empty=functionProfiles([]);
assert.equal(empty.find(x=>x.id==='request')?.state,'unseen');
const single=functionProfiles([row({})]).find(x=>x.id==='request');
assert.ok(single&&single.strength<.2,'single scripted success cannot signal mastery');
assert.notEqual(single?.state,'secure');
const ineffective=functionProfiles([row({accepted:false,independent:false,credit:0}),
  row({manual:true,independent:false,credit:0})]).find(x=>x.id==='request');
assert.equal(ineffective?.attempts,2);
assert.equal(ineffective?.successes,0);
const sustained=Array.from({length:12},(_,i)=>row({
  at:now+i*86_400_000,scenarioId:['bakery','cafe','rail'][i%3],
  level:i%3===2?'A2':'A1'
}));
const strong=functionProfiles(sustained).find(x=>x.id==='request');
assert.equal(strong?.state,'secure','distributed independent repeat evidence can become secure');
const singleScene=functionProfiles(Array.from({length:12},(_,i)=>row({
  at:now+i*86_400_000,scenarioId:'bakery',functionId:'greeting',turnIndex:0,matched:1,required:1
}))).find(x=>x.id==='greeting');
assert.notEqual(singleScene?.state,'secure','one memorized scene cannot be secure');
// Imported rows may not claim a different function, level, or unsupported score.
let honest=beginAdaptiveSet(initialConversationState(),now);
const firstScene=getConversationScenario(honest.active?.scenarioId??'');
assert.ok(firstScene);
if(!firstScene)throw Error('missing adaptive scenario');
honest=submitConversationResponse(honest,firstScene.turns[0].model,false,now+1).state;
const evidence=honest.functionEvents[0];
assert.equal(safeConversationState(honest).functionEvents.length,1);
for(const mutation of [
  {...evidence,functionId:'negotiation'},
  {...evidence,level:'B1'},
  {...evidence,credit:1.1},
  {...evidence,independent:false},
  {...evidence,turnIndex:99},
  {...evidence,required:99},
  {...evidence,support:2}
]){
  const imported=safeConversationState({...honest,functionEvents:[mutation]});
  assert.equal(imported.functionEvents.length,0,'tampered function evidence must not be counted');
}
assert.equal(safeConversationState({
  ...honest,functionEvents:[{...evidence,accepted:false,independent:false,credit:0}]
}).functionEvents.length,1,'a valid failed attempt is evidence of a gap');

const a1=rankedNativeScenarios([],[],'A1',now),a2=rankedNativeScenarios([],[],'A2',now);
assert.equal(a1.length,3);
assert.ok(a2.length>a1.length);
assert.ok(a1.every(x=>x.level==='A1'));
assert.equal(rankNativeMissions([],[],'A1',now).length,1);
assert.equal(rankNativeMissions([],[],'B1',now).length,MISSION_CHAINS.length);
const adaptiveQueue=chooseAdaptiveQueue([],[],'A1',now);
assert.equal(adaptiveQueue.length,3);
assert.equal(new Set(adaptiveQueue).size,3);
let state=beginAdaptiveSet(initialConversationState(),now);
assert.equal(state.adaptive?.step,0);
assert.throws(()=>beginMission(state,'morning-town'),/CONVERSATION_ALREADY_ACTIVE/);
assert.throws(()=>startConversation(state,'bakery'),/CONVERSATION_ALREADY_ACTIVE/);
let timestamp=now;
for(let step=0;step<3;step++){
  const scenario=getConversationScenario(state.adaptive?.queue[step]??'');
  assert.ok(scenario,'adaptive scene must exist');
  if(!scenario)throw Error('adaptive scene missing');
  for(const turn of scenario.turns){
    const result=submitConversationResponse(state,turn.model,false,++timestamp);
    assert.equal(result.accepted,true,'authored scene model must match');
    state=result.state;
  }
  if(step===0){
    state=safeConversationState(JSON.parse(JSON.stringify(state)));
    assert.equal(state.adaptive?.step,1,'first adaptive task must resume after serialization');
  }
}
assert.equal(state.adaptive,null);
assert.equal(state.adaptiveHistory.length,1);
assert.equal(state.adaptiveHistory[0].tasks.length,3);
assert.equal(state.adaptiveHistory[0].independentTurns,9);
assert.equal(state.functionEvents.length,9);
assert.equal(state.history.length,3);
assert.equal(JSON.stringify(state).includes('Bonjour madame'),false,'transcripts cannot persist');
const incomplete=beginAdaptiveSet(initialConversationState(),now);
const canceled=endConversation(incomplete);
assert.equal(canceled.adaptive,null);
assert.equal(canceled.adaptiveHistory.length,0);
const damaged=safeConversationState({...incomplete,adaptive:{...incomplete.adaptive!,step:2}});
assert.equal(damaged.adaptive,null,'corrupt adaptive state must be detached');
assert.equal(damaged.active?.scenarioId,incomplete.active?.scenarioId);
console.log(JSON.stringify({schema:'french-p37i-b3-communicative',ok:true,
  functions:23,scoredProfiles:true,adaptiveTasks:3,transcriptsPersisted:false}));
