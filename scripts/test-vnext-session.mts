import assert from 'node:assert/strict';
import { advanceSession,applyAgainRequeue,createStudySession,normalizeStudySession } from '../app/src/core/learner/session.ts';

const now=1_700_000_000_000;
let session=createStudySession(['a','b','c','d','e','f','g','h'],{now,requeueAgain:true});
session=applyAgainRequeue(session,'a');
assert.equal(session.queueIds.indexOf('a',1),7);
session=advanceSession(session,now+1000);
assert.equal(session.cursor,1);
assert.equal(session.currentId,'b');
assert.ok(normalizeStudySession(session,now+2000));

const expired={...session,updatedAt:now-15*86_400_000};
assert.equal(normalizeStudySession(expired,now),null);

console.log(JSON.stringify({schema:'thiepn-french-p37g-session-contract',ok:true,fixtures:4},null,2));
