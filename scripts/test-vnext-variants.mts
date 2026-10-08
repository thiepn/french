import assert from 'node:assert/strict';
import {CONVERSATION_STARTERS,getConversationScenario} from '../app/src/core/conversation/scenarios.ts';
import {partnerWording,nextWordingVariant,validateConversationVariants} from '../app/src/core/conversation/variants.ts';
import {initialConversationState,startConversation,requestConversationRepeat,
  submitConversationResponse,safeConversationState,beginMission} from '../app/src/core/conversation/engine.ts';
import {functionProfiles,type FunctionEvidence} from '../app/src/core/conversation/curriculum.ts';

assert.deepEqual(validateConversationVariants(),[]);
assert.equal(CONVERSATION_STARTERS.length,15);
for(const scene of CONVERSATION_STARTERS)
  for(let turn=0;turn<scene.turns.length;turn++){
    assert.equal(partnerWording(scene.id,turn,0),scene.turns[turn].partner);
    assert.notEqual(partnerWording(scene.id,turn,1),scene.turns[turn].partner,
      'variant must really alter partner wording for '+scene.id+':'+turn);
  }
assert.throws(()=>partnerWording('missing',0,1),/INVALID_PARTNER_TURN/);
assert.equal(nextWordingVariant('bakery',[]),0);
assert.equal(nextWordingVariant('bakery',[{scenarioId:'bakery'}]),1);
assert.equal(nextWordingVariant('bakery',[{scenarioId:'cafe'}]),0);

let time=1_760_000_000_000;
let state=startConversation(initialConversationState(),'bakery',time++);
assert.equal(state.active?.variant,0);
for(const turn of getConversationScenario('bakery')!.turns)state=submitConversationResponse(state,turn.model,false,time++).state;
assert.equal(state.history[0].variant,0);
state=startConversation(state,'bakery',time++);
assert.equal(state.active?.variant,1,'second run must use alternate wording');
const before=state.active?.cursor;
state=requestConversationRepeat(state,time++);
assert.equal(state.active?.cursor,before,'repeat must never advance the exchange');
assert.equal(state.active?.attempts,1);
assert.equal(state.active?.support,1);
assert.equal(state.active?.repairMoves,1);
assert.equal(state.functionEvents.at(-1)?.repair,true);
assert.equal(state.functionEvents.at(-1)?.credit,0);
assert.equal(state.functionEvents.at(-1)?.accepted,false);
state=safeConversationState(JSON.parse(JSON.stringify(state)));
assert.equal(state.active?.variant,1,'reload must preserve partner wording');
assert.equal(state.active?.repairMoves,1,'reload must preserve repair support');
const first=submitConversationResponse(state,'Bonjour madame',false,time++);
state=first.state;
assert.equal(first.accepted,true);
assert.equal(state.active?.turns[0].independent,false,'repeated prompt cannot count as independent');
assert.equal(state.active?.turns[0].repairMoves,1);
assert.equal(state.functionEvents.at(-1)?.variant,1);
for(const turn of getConversationScenario('bakery')!.turns.slice(1))
  state=submitConversationResponse(state,turn.model,false,time++).state;
assert.equal(state.history[0].variant,1,'completed run retains prompt variant metadata');
assert.equal(state.history[0].independentTurns,2);
assert.equal(state.history[0].repairAttempts,1);
assert.equal(state.functionEvents.at(-1)?.variant,1);
assert.equal(JSON.stringify(state).includes('Bonjour madame'),false,'raw learner responses must never persist');

const template:FunctionEvidence={
  scenarioId:'bakery',functionId:'greeting',turnIndex:0,at:time,level:'A1',
  accepted:true,manual:false,independent:true,support:0,retries:0,
  matched:1,required:1,credit:1,variant:0,repair:false
};
const sameVariant=Array.from({length:12},(_,i)=>({...template,at:time+i*86_400_000}));
const rotatedVariant=sameVariant.map((row,i)=>({...row,variant:(i%2) as 0|1}));
assert.notEqual(functionProfiles(sameVariant).find(f=>f.id==='greeting')?.state,'secure',
  'single-scene repeats on one script cannot yield secure evidence');
assert.equal(functionProfiles(rotatedVariant).find(f=>f.id==='greeting')?.state,'secure',
  'multi-day independent evidence with both authored wordings may clear the variant gate');
const tampered=safeConversationState({...state,functionEvents:[
  {...template,variant:4},
  {...template,repair:true},
  {...template,repair:true,accepted:false,independent:false,credit:0,matched:0,retries:1,support:1}
]});
assert.equal(tampered.functionEvents.length,1,'forged variant/repair scoring must be rejected');

let mission=beginMission(state,'morning-town',time++);
assert.equal(mission.active?.variant,0,'first bakery in mission after two prior completed runs alternates back');
const prevMission=mission.mission?.missionId;
mission=requestConversationRepeat(mission,time++);
mission=safeConversationState(JSON.parse(JSON.stringify(mission)));
assert.equal(mission.mission?.missionId,prevMission,'repeat request must not detach mission');
assert.equal(mission.active?.variant,0);
console.log(JSON.stringify({schema:'french-p37i-b5-variants',ok:true,scenarios:15,alternatePrompts:45,
  repeatNoMastery:true,secureRequiresBreadth:true,missionResume:true}));
