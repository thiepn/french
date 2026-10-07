import assert from 'node:assert/strict';
import { scheduleRating,type SchedulerConfig } from '../app/src/core/learner/scheduler.ts';
import type { CanonicalSrsRecordV1 } from '../app/src/core/learner/model.ts';

const settings:SchedulerConfig={
  desiredRetention:.9,
  maxInterval:3650,
  learningSteps:[1,10,1440],
  relearningSteps:[10],
  autoSuspendLeeches:false,
  leechThreshold:8
};
const T=1_700_000_000_000;
const DAY=86_400_000;

function record(overrides:Partial<CanonicalSrsRecordV1>={}):CanonicalSrsRecordV1{
  return {
    schema:'thiepn-french-srs-record-v1',
    id:'note-1::d31:0:recognition',
    noteId:'note-1',
    sense:0,
    skill:'recognition',
    status:'new',seen:0,streak:0,intervalDays:0,dueAt:0,lastReviewedAt:0,learnedAt:0,
    ease:2.5,lapses:0,successes:0,lastRating:'',learningStep:0,againCount:0,hardCount:0,
    goodCount:0,easyCount:0,lastResponseMs:0,starred:false,suspended:false,buriedUntil:0,
    manualKnown:false,note:'',stability:0,difficulty:5,relearning:false,lastElapsedDays:0,
    fsrsVersion:'',fsrsState:'new',scheduledDays:0,elapsedDays:0,retrievability:0,lastAnswerIssue:'',
    ...overrides
  };
}
function close(actual:number,expected:number,tolerance=1e-9):void{
  assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} != ${expected}`);
}

const newAgain=scheduleRating(record(),'again',T,0,'none',settings);
assert.equal(newAgain.status,'learning');
assert.equal(newAgain.fsrsState,'learning');
assert.equal(newAgain.dueAt,T+60_000);
assert.equal(newAgain.againCount,1);
close(newAgain.stability,.212);
close(newAgain.difficulty,6.4133);

const newGood=scheduleRating(record(),'good',T,0,'none',settings);
assert.equal(newGood.status,'learning');
assert.equal(newGood.learningStep,1);
assert.equal(newGood.dueAt,T+600_000);
close(newGood.stability,2.3065);
close(newGood.difficulty,2.118103970459015);

const newEasy=scheduleRating(record(),'easy',T,0,'none',settings);
assert.equal(newEasy.status,'learned');
assert.equal(newEasy.intervalDays,8);
assert.equal(newEasy.dueAt,T+8*DAY);
assert.equal(newEasy.easyCount,1);
close(newEasy.stability,8.2956);
close(newEasy.difficulty,1);

const mature=record({
  status:'learned',seen:10,streak:4,intervalDays:10,dueAt:T,lastReviewedAt:T-10*DAY,
  learnedAt:T-20*DAY,stability:10,difficulty:5,fsrsState:'review',scheduledDays:10
});

const reviewGood=scheduleRating(mature,'good',T,0,'none',settings);
assert.equal(reviewGood.status,'learned');
assert.equal(reviewGood.intervalDays,32);
assert.equal(reviewGood.dueAt,T+32*DAY);
assert.equal(reviewGood.streak,5);
assert.equal(reviewGood.goodCount,1);
close(reviewGood.retrievability,.9);
close(reviewGood.stability,32.04141396830805);
close(reviewGood.difficulty,4.996);

const lapse=scheduleRating(mature,'again',T,0,'none',settings);
assert.equal(lapse.status,'learning');
assert.equal(lapse.fsrsState,'relearning');
assert.equal(lapse.relearning,true);
assert.equal(lapse.dueAt,T+600_000);
assert.equal(lapse.lapses,1);
assert.equal(lapse.againCount,1);
assert.equal(lapse.intervalDays,0);
close(lapse.stability,1.3339880193718714);
close(lapse.difficulty,10);

const closeAnswer=scheduleRating(mature,'good',T,0,'close',settings);
assert.equal(closeAnswer.intervalDays,26);
close(closeAnswer.stability,26.273959454012598);
assert.ok(closeAnswer.stability<reviewGood.stability);

const leechSettings={...settings,autoSuspendLeeches:true,leechThreshold:3};
const leech=scheduleRating(record({status:'learned',seen:5,lapses:2,againCount:2,stability:2,difficulty:8,fsrsState:'review'}),'again',T,0,'none',leechSettings);
assert.equal(leech.suspended,true);

console.log(JSON.stringify({
  schema:'thiepn-french-p37c-scheduler-parity-fixtures',
  ok:true,
  fixtures:['new-again','new-good','new-easy','review-good','review-again','typed-close-penalty','leech-suspend']
},null,2));
