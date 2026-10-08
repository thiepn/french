import assert from 'node:assert/strict';
import {CONVERSATION_STARTERS} from '../app/src/core/conversation/scenarios.ts';
import {evaluateConversationTurn,initialConversationState,startConversation,raiseConversationSupport,submitConversationResponse,safeConversationState} from '../app/src/core/conversation/engine.ts';
const ids=new Set(CONVERSATION_STARTERS.map(x=>x.id));
assert.equal(CONVERSATION_STARTERS.length,5);
assert.equal(ids.size,5);
for(const s of CONVERSATION_STARTERS){
  assert.ok(s.turns.length>=3,'every starter needs multi-turn interaction');
  for(const turn of s.turns){
    assert.ok(turn.slots.length>0&&turn.slots.every(slot=>slot.length>0),'required patterns');
    assert.equal(evaluateConversationTurn(turn,turn.model).accepted,true,'model should satisfy '+s.id+'/'+turn.functionId);
  }
}
let state=startConversation(initialConversationState(),'bakery',1000);
assert.throws(()=>startConversation(state,'cafe',1001),/CONVERSATION_ALREADY_ACTIVE/);
let attempt=submitConversationResponse(state,'bonjour',false,1002);
assert.equal(attempt.accepted,true);
assert.equal(attempt.state.active?.cursor,1);
state=attempt.state;
const rejected=submitConversationResponse(state,'une bouteille',false,1003);
assert.equal(rejected.accepted,false);
assert.equal(rejected.state.active?.cursor,1);
state=raiseConversationSupport(rejected.state,1,1004);
attempt=submitConversationResponse(state,'Je voudrais un croissant',false,1005);
assert.equal(attempt.accepted,true);
assert.equal(attempt.state.active?.turns[1].independent,false);
state=attempt.state;
attempt=submitConversationResponse(state,'combien ça coûte ?',false,1006);
assert.equal(attempt.finished,true);
assert.equal(attempt.state.active,null);
assert.equal(attempt.state.history[0].independentTurns,2);
assert.equal(attempt.state.history[0].repairAttempts,1);
assert.equal(attempt.state.history[0].manualTurns,0);
assert.equal(JSON.stringify(attempt.state).includes('croissant'),false,'never persist learner response text');
state=startConversation(attempt.state,'directions',1100);
state=submitConversationResponse(state,'je demande avec d autres mots',true,1101).state;
assert.equal(state.active?.turns[0].manual,true);
assert.equal(state.active?.turns[0].independent,false);
assert.equal(safeConversationState({schema:'invalid'}).active,null);
const malformed=safeConversationState({schema:'thiepn-french-native-conversation-v1',active:{scenarioId:'missing',cursor:999},history:[]});
assert.equal(malformed.active,null);
console.log(JSON.stringify({schema:'french-p37i-b1-native-conversation',ok:true,scenarios:5,turns:CONVERSATION_STARTERS.reduce((n,s)=>n+s.turns.length,0),noTranscriptPersistence:true}));
