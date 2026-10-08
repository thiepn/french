import assert from 'node:assert/strict';
import {rankNativeActivities} from '../app/src/core/learner/study-coach.ts';

const fresh={due:0,newLimit:20,remainingSession:0,recent:{reviews:0,reading:0,listening:0,speaking:0}};
assert.equal(rankNativeActivities(fresh)[0].id,'learn','fresh learners should start with vocabulary');
assert.equal(rankNativeActivities({...fresh,due:20})[0].id,'review','due SRS must outrank starting new cards');
assert.equal(rankNativeActivities({...fresh,due:50,remainingSession:3})[0].id,'resume','unfinished session always wins');
assert.equal(rankNativeActivities({...fresh,due:50,activeConversation:true})[0].id,'conversation-resume','unfinished conversation outranks due review');
assert.equal(rankNativeActivities({...fresh,newLimit:0}).some(x=>x.id==='learn'),false,'honor configured zero-new-card limit');
assert.equal(rankNativeActivities({...fresh,due:0,remainingSession:0,recent:{reviews:80,reading:8,listening:0,speaking:4}})[0].id,'listen','weak cross-skill practice stream should be eligible');
assert.equal(rankNativeActivities({...fresh,due:-1,newLimit:0}).some(x=>x.route==='review'),false,'do not recommend an empty review');
for(const action of rankNativeActivities(fresh))assert.ok(['learn','review','read','listen','speak','conversation'].includes(action.route),'no unavailable P35 route should be recommended');
console.log(JSON.stringify({schema:'french-p37i-native-study-coach',ok:true,fixtures:8}));
