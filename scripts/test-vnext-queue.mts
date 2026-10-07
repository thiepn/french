import assert from 'node:assert/strict';
import { evidenceFromEvents,mixTodayQueue,sortSmartQueue,weaknessScore } from '../app/src/core/learner/queue.ts';
import type { CanonicalReviewEventV1,CanonicalSrsRecordV1 } from '../app/src/core/learner/model.ts';

const now=1_700_000_000_000;
const base=(id:string,patch:Partial<CanonicalSrsRecordV1>={}):CanonicalSrsRecordV1=>({
  schema:'thiepn-french-srs-record-v1',id,noteId:id.split('::')[0],sense:0,skill:'recognition',
  status:'learned',seen:5,streak:3,intervalDays:5,dueAt:now-86_400_000,lastReviewedAt:now-5*86_400_000,
  learnedAt:now-20*86_400_000,ease:2.5,lapses:0,successes:4,lastRating:'good',learningStep:3,
  againCount:0,hardCount:0,goodCount:4,easyCount:0,lastResponseMs:5000,starred:false,suspended:false,
  buriedUntil:0,manualKnown:false,note:'',stability:5,difficulty:5,relearning:false,lastElapsedDays:5,
  fsrsVersion:'FSRS-5-compatible',fsrsState:'review',scheduledDays:5,elapsedDays:5,retrievability:.85,lastAnswerIssue:'',
  ...patch
});
const event=(id:string,correct:boolean,typedQuality='exact'):CanonicalReviewEventV1=>({
  schema:'thiepn-french-review-event-v1',eventId:Math.random().toString(),t:now,id,noteId:id,skill:'recognition',
  rating:correct?'good':'again',responseMs:correct?5000:16000,wasNew:false,intervalDays:5,direction:'fr-en',
  typed:true,typedQuality,level:'A1',pos:'noun',theme:'',practice:'review',correct,xp:0,practiceOnly:false,
  stability:5,difficulty:5,retrievability:.8,scheduledDays:5,fsrsState:'review'
});

const weak=base('weak',{lapses:4,difficulty:8,retrievability:.55,lastRating:'again'});
const strong=base('strong',{lapses:0,difficulty:4,retrievability:.95,lastRating:'good'});
assert.ok(weaknessScore(weak,undefined,now)>weaknessScore(strong,undefined,now));

const evidence=evidenceFromEvents([event('weak',false,'review'),event('weak',false,'close'),event('strong',true)]);
const sorted=sortSmartQueue([
  {record:strong,order:2,familyKey:'s',evidence:evidence.get('strong')},
  {record:weak,order:1,familyKey:'w',evidence:evidence.get('weak')}
],{now,leechThreshold:8,siblingSpacing:true});
assert.equal(sorted[0].record.id,'weak');

assert.deepEqual(mixTodayQueue(['d1','d2','d3','d4'],['n1','n2'],'interleave'),['d1','d2','d3','n1','d4','n2']);
assert.deepEqual(mixTodayQueue(['d1'],['n1'],'new-first'),['n1','d1']);

console.log(JSON.stringify({schema:'thiepn-french-p37g-queue-parity',ok:true,fixtures:4},null,2));
