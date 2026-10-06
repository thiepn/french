import assert from 'node:assert/strict';
import { advanceSession,createStudySession,insertReinforcement,normalizeStudySession,reinforcementAt } from '../app/src/core/learner/session.ts';

const now=1_700_000_000_000;
let session=createStudySession(['a','b','c','d','e','f','g','h','i','j'],{now,requeueAgain:true});

session=insertReinforcement(session,'a','context',4,'fr-en','cloze');
assert.equal(session.queueIds[4],'a');
assert.equal(session.reinforcements.length,1);
assert.equal(session.reinforcements[0].type,'context');
assert.equal(session.stats.adaptiveReinforcements,1);

session=insertReinforcement(session,'a','reverse',8,'en-fr','review');
assert.equal(session.reinforcements.length,2);
assert.equal(session.stats.adaptiveReinforcements,2);

session=advanceSession(session,now+1000);
assert.equal(session.cursor,1);
assert.equal(session.currentId,'b');
const normalized=normalizeStudySession(session,now+2000);
assert.ok(normalized);
assert.equal(normalized.reinforcements.length,2);

const atContext={...normalized,cursor:normalized.reinforcements.find(item=>item.type==='context').index};
assert.equal(reinforcementAt(atContext)?.type,'context');

const expired={...session,updatedAt:now-15*86_400_000};
assert.equal(normalizeStudySession(expired,now),null);

console.log(JSON.stringify({
  schema:'thiepn-french-p37g-session-contract',
  ok:true,
  fixtures:['context-reinforcement','reverse-reinforcement','resume-metadata','reinforcement-lookup','14-day-expiry']
},null,2));
