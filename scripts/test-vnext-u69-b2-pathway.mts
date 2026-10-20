import assert from 'node:assert/strict';
import {deriveB2Pathway} from '../app/src/core/learner/b2-pathway.ts';
import {emptyB2Evidence,normalizeB2Evidence,B2_EVALUATOR_VERSION,P32_SOURCE_EVALUATOR} from '../app/src/core/learner/b2-assessment.ts';
import {P33_EVALUATOR,P33_PAIRS} from '../app/src/core/learner/b2-oral.ts';
const DAY=86_400_000;
const now=1_790_000_000_000,digest='a'.repeat(64),changed='b'.repeat(64);
const writing=(id,modality='argument',sha=digest)=>({
 taskId:id,...(modality!=='argument'?{sourceId:id}:{}),modality,
 wordCount:155,sentenceCount:8,markerFamilies:['contrast','example','conclusion'],
 score:90,confidence:90,topicGroups:4,directCopyPct:0,transformation:80,
 playCount:modality==='listening'?1:0,elapsedMs:90000,status:'structural-targets-met',
 reason:'Node fixture, not an original assessment',evaluator:B2_EVALUATOR_VERSION,
 ...(modality!=='argument'?{
  sourceDigest:sha,sourceRevision:'8a354063b204',
  sourceBlob:'8a354063b20421ad53b3417b3f677adc926f3cb5',
  sourceEvaluator:P32_SOURCE_EVALUATOR,questionId:'q1',comprehensionCorrect:true,
  playbackCompleted:modality==='listening'
 }:{})
});
const p31=(at=now,status='structural-targets-met')=>({
 id:'node-p31-'+at,kind:'p31',at,status,evaluator:B2_EVALUATOR_VERSION,
 tasks:[writing('u64-work-policy'),writing('u64-urban-mobility')]
});
const p32=(at=now,status='structural-targets-met',sha=digest)=>({
 id:'node-p32-'+at,kind:'p32',at,status,evaluator:B2_EVALUATOR_VERSION,
 tasks:[writing('read-b2-teletravail','reading',sha),writing('read-b2-logement','listening',sha)]
});
const oralTask=(prompt,at=now)=>({
 promptId:prompt.id,mode:prompt.mode,at,status:'structural-targets-met',
 words:110,durationMs:60000,wordsPerMinute:110,asrConfidence:88,
 fluencyProxy:85,discourseProxy:84,score:85,fillerRatio:0,
 longPauses:0,selfCorrections:1,topicGroups:3,markerFamilies:['contrast'],
 reason:'Synthetic oral source fixture only',evaluator:P33_EVALUATOR
});
const p33=(at=now,status='structural-targets-met',sha=digest)=>({
 id:'node-p33-'+at,at,status,
 tasks:[oralTask(P33_PAIRS[0][0],at),oralTask(P33_PAIRS[0][1],at)],
 evaluator:P33_EVALUATOR,sourceDigest:sha
});
const state=(history=[],oralHistory,oralSession)=>({
 ...emptyB2Evidence(),history,...(oralHistory?{oralHistory}:{}),
 ...(oralSession?{oralSession}:{})
});
const inspect=(e,sha=digest,clock=now)=>{
 const n=normalizeB2Evidence(e);
 assert.ok(n,'Original learner evidence must survive canonical normalization');
 return deriveB2Pathway(n,sha,clock);
};
let x=inspect(state());
assert.equal(x.completed,0);assert.equal(x.next.phase,'p31');assert.equal(x.steps[1].state,'blocked');
assert.equal(x.benchmark.available,false);assert.equal(x.maintenance.available,false);
assert.match(x.benchmark.reason,/no audited B2 mission battery/);
x=inspect(state([p31()]));
assert.equal(x.completed,1);assert.equal(x.next.phase,'p32');
assert.equal(x.steps[1].state,'missing');assert.equal(x.steps[2].state,'blocked');
x=inspect(state([p31(),p32()]));
assert.equal(x.completed,2);assert.equal(x.next.phase,'p33');assert.equal(x.steps[2].state,'missing');
x=inspect(state([p31(),p32()],[p33()]));
assert.equal(x.completed,3);assert.equal(x.next,null);
assert.equal(x.benchmark.available,false,'Three native structural receipts must never become a P28 B2 benchmark');
assert.equal(x.maintenance.available,false,'No P29 B2 clock or synthetic scheduler');
x=inspect(state([p31(),p32()],[p33()]),changed);
assert.equal(x.completed,1);assert.equal(x.steps[1].state,'source-changed');
assert.equal(x.steps[2].state,'blocked');
x=inspect(state([p31(),p32()],[p33(changed.length+now,'structural-targets-met',changed)]),digest);
assert.equal(x.completed,2);assert.equal(x.steps[2].state,'source-changed');
x=inspect(state([p31(),p32()],[p33()]),null);
assert.equal(x.completed,1);assert.equal(x.steps[1].state,'blocked');
assert.equal(x.sourceVerified,false);
x=inspect(state([p31(),p32()],[p33()]),digest,now+36*DAY);
assert.equal(x.steps[0].state,'expired');assert.equal(x.steps[1].state,'blocked');
x=inspect(state([p31(now-36*DAY),p31()]));
assert.equal(x.steps[0].state,'current');
x=inspect(state([p31(),p31(now,'unscored'),p32()],[p33()]));
assert.equal(x.completed,3,'unscored does not supersede a current scored pass');
x=inspect(state([p31(),p31(now,'insufficient'),p32()],[p33()]));
assert.equal(x.steps[0].state,'scored-retest-needed');assert.equal(x.completed,0);
x=inspect(state([p31(),p32(),p32(now,'insufficient')],[p33()]));
assert.equal(x.steps[1].state,'scored-retest-needed');
assert.equal(x.steps[2].state,'blocked');
x=inspect(state([p31(),p32()],[p33(),p33(now,'unscored')]));
assert.equal(x.completed,3,'ASR abstention cannot falsely invalidate an earlier pass');
x=inspect(state([p31(),p32()],[p33(),p33(now,'insufficient')]));
assert.equal(x.steps[2].state,'scored-retest-needed');
const oralSession={
 id:'unfinished-original-p33',pair:0,cursor:1,at:now,
 first:oralTask(P33_PAIRS[0][0]),prepStartedAt:now
};
x=inspect(state([p31(),p32()],undefined,oralSession));
assert.equal(x.oralResumable,true);
assert.equal(x.next.phase,'p33');assert.equal(x.next.action,'Resume P33 oral pair');
x=inspect(state([p31(),p32(now,'insufficient')],undefined,oralSession));
assert.equal(x.oralResumable,false);
const saved=state([p31(),p32()],[p33()],oralSession),unchanged=JSON.stringify(saved);
inspect(saved);
assert.equal(JSON.stringify(saved),unchanged,'Read-only projection never mutates canonical learner snapshot');
assert.ok(!unchanged.includes('audioBlob')&&!unchanged.includes('transcript'));
console.log(JSON.stringify({schema:'u69-native-b2-pathway',status:'PASS',
 scenarios:17,p31P32P33:'source-bound',expiry:'35 days',oral:'resume-preserved',
 p28B2:false,p29B2:false,canonicalMutation:false}));
