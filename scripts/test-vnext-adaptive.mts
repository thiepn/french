import assert from 'node:assert/strict';
import { nextAdaptiveSkill,pacingDecision } from '../app/src/core/learner/adaptive.ts';
import type { CanonicalReviewEventV1,CanonicalSrsRecordV1,SkillId } from '../app/src/core/learner/model.ts';

const now=1_700_000_000_000;
const meta={
  id:'chat',word:'chat',meaning:'cat',ipa:'',pos:'noun',article:'un',gender:'m',
  level:'A1',order:1,packId:'vocabulary-a1-01'
};
function record(skill:SkillId,patch:Partial<CanonicalSrsRecordV1>={}):CanonicalSrsRecordV1{
  return{
    schema:'thiepn-french-srs-record-v1',id:'chat::d31:0:'+skill,noteId:'chat',sense:0,skill,
    status:'new',seen:0,streak:0,intervalDays:0,dueAt:0,lastReviewedAt:0,learnedAt:0,ease:2.5,
    lapses:0,successes:0,lastRating:'',learningStep:0,againCount:0,hardCount:0,goodCount:0,easyCount:0,
    lastResponseMs:0,starred:false,suspended:false,buriedUntil:0,manualKnown:false,note:'',stability:0,
    difficulty:5,relearning:false,lastElapsedDays:0,fsrsVersion:'',fsrsState:'new',scheduledDays:0,
    elapsedDays:0,retrievability:0,lastAnswerIssue:'',...patch
  };
}
function event(correct:boolean):CanonicalReviewEventV1{
  return{
    schema:'thiepn-french-review-event-v1',eventId:Math.random().toString(),t:now,id:'x',noteId:'x',
    skill:'recognition',rating:correct?'good':'again',responseMs:5000,wasNew:false,intervalDays:1,
    direction:'fr-en',typed:false,typedQuality:'none',level:'A1',pos:'noun',theme:'',practice:'review',
    correct,xp:0,practiceOnly:false,stability:1,difficulty:5,retrievability:.9,scheduledDays:1,fsrsState:'review'
  };
}

assert.equal(nextAdaptiveSkill(meta,[]),'recognition');
assert.equal(nextAdaptiveSkill(meta,[record('recognition',{status:'learning',seen:2,successes:1,stability:.4})]),null);

const recognition=record('recognition',{status:'learned',seen:4,successes:3,stability:1.2});
assert.equal(nextAdaptiveSkill(meta,[recognition]),'article');

const article=record('article',{status:'learned',seen:2,successes:2,stability:.6});
assert.equal(nextAdaptiveSkill(meta,[recognition,article]),'production');

const production=record('production',{status:'learned',seen:4,successes:3,stability:1.3});
assert.equal(nextAdaptiveSkill(meta,[recognition,article,production]),'spelling');

const spelling=record('spelling',{status:'learned',seen:2,successes:2,stability:.7});
assert.equal(nextAdaptiveSkill(meta,[recognition,article,production,spelling]),'listening');

assert.equal(pacingDecision(200,20,200,[]).factor,0);
assert.equal(pacingDecision(130,20,200,[]).factor,.5);
assert.equal(pacingDecision(20,20,200,Array.from({length:30},(_,i)=>event(i<21))).factor,.5);
assert.equal(pacingDecision(20,20,200,Array.from({length:40},(_,i)=>event(i<30))).factor,.75);
assert.equal(pacingDecision(20,20,200,Array.from({length:40},()=>event(true))).factor,1);

console.log(JSON.stringify({
  schema:'thiepn-french-p37g-adaptive-pacing-parity',
  ok:true,
  stageFixtures:5,
  pacingFixtures:5
},null,2));
