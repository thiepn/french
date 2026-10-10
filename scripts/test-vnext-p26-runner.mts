import assert from 'node:assert/strict';
import {diagnoseP26} from '../app/src/core/learner/p26-diagnosis.ts';
import {P26_STATE_KEY,P26_STATE_SCHEMA,normalizeRepairState,startRepairRun,currentRepairTask,
 completeGuidedStep,armRepairRetest,checkRepairRetest,resolveRepairRetest,cancelRepairRun,repairSummary}
 from '../app/src/core/learner/p26-runner.ts';
import type {CanonicalReviewEventV1} from '../app/src/core/learner/model.ts';
const DAY=86_400_000,now=1_700_500_000_000;
let count=0;
function event(noteId:string,t:number,correct:boolean,category:string,practice:string):CanonicalReviewEventV1{
 return{schema:'thiepn-french-review-event-v1',eventId:'d6b:'+ ++count,
  noteId,id:noteId+'::d31:0:production',t,correct,typed:true,
  typedQuality:correct?'exact':'near',sentenceDiagnosis:correct?'exact':category,
  errorCategory:correct?'':category,rating:correct?'good':'again',
  skill:'production',practice,practiceOnly:true,supportLevel:0,firstListen:true,
  playCount:1,playbackRate:1} as CanonicalReviewEventV1;
}
const baseline=[
 event('grammar-example',now-DAY,false,'connector','written-bridge'),
 event('listening-example',now-DAY,false,'segmentation','contextual-listening')
];
const report=diagnoseP26({events:baseline,now});
let state=startRepairRun(undefined,report,now,2);
assert.equal(P26_STATE_KEY,'v5170Remediation');
assert.equal(state.schema,P26_STATE_SCHEMA);
assert.ok(state.active);
assert.deepEqual(state.active.tasks.map(t=>t.stage),[
 'scaffold','scaffold','rebuild','rebuild','independent-retest','independent-retest']);
assert.ok(state.active.tasks.every(t=>t.practiceOnly===true));
assert.notEqual(state.active.tasks[0].noteId,state.active.tasks[1].noteId,'interleave independent cases');
assert.deepEqual(startRepairRun(state,report,now+1),state,'duplicate start is a no-op');
const originalKey=state.active.tasks[0].key;
assert.deepEqual(completeGuidedStep(state,'wrong:key',now+1),state,'stale click has no effect');
for(let k=0;k<4;k++){
 const task=currentRepairTask(state);
 assert.ok(task&&task.stage!=='independent-retest');
 state=completeGuidedStep(state,task.key,now+k+1);
}
assert.equal(state.active?.cursor,4);
const first=currentRepairTask(state);
assert.ok(first&&first.stage==='independent-retest');
assert.equal(checkRepairRetest(state,report),'not-armed');
assert.deepEqual(resolveRepairRetest(state,first.key,report,now+7),state,'pre-armed retest is not a grade');
state=armRepairRetest(state,first.key,now+8);
assert.equal(checkRepairRetest(state,report),'pending');
assert.deepEqual(resolveRepairRetest(state,first.key,report,now+9),state,'no post-arm native evidence is no grade');
const completedFirst=[...baseline,event(first.noteId,now+10,true,'','written-bridge')];
const passed=diagnoseP26({events:completedFirst,now:now+11});
assert.equal(checkRepairRetest(state,passed),'passed');
state=resolveRepairRetest(state,first.key,passed,now+12);
assert.equal(state.active?.cursor,5);
assert.equal(state.active?.outcomes.length,1);
assert.deepEqual(resolveRepairRetest(state,first.key,passed,now+13),state,'replayed resolution cannot increment outcome');
const second=currentRepairTask(state);
assert.ok(second);
state=armRepairRetest(state,second.key,now+14);
const manualSpeech=event(second.noteId,now+15,true,'','spoken-transfer');
manualSpeech.manualJudgment='self-assessed';
const invalid=diagnoseP26({events:[...completedFirst,manualSpeech],now:now+16});
assert.equal(checkRepairRetest(state,invalid),'pending','unrelated modality cannot clear listening');
const failed=diagnoseP26({events:[...completedFirst,event(second.noteId,now+17,false,'segmentation','contextual-listening')],now:now+18});
assert.equal(checkRepairRetest(state,failed),'failed');
state=resolveRepairRetest(state,second.key,failed,now+19);
assert.equal(state.active,null);
assert.deepEqual(repairSummary(state),{runs:1,retests:2,passed:1});
assert.deepEqual(state.history[0].status,'completed');
assert.ok(!JSON.stringify(state).includes('spokenTranscript'));
assert.ok(!JSON.stringify(state).includes('rawAnswer'));
assert.ok(!JSON.stringify(state).includes('recognizedText'));
const restored=normalizeRepairState(JSON.parse(JSON.stringify(state)));
assert.deepEqual(restored,state,'metadata-only state survives round-trip');
let resumed=startRepairRun(restored,report,now+25,2);
resumed=completeGuidedStep(resumed,currentRepairTask(resumed).key,now+26);
const resumedRoundtrip=normalizeRepairState(JSON.parse(JSON.stringify(resumed)));
assert.equal(resumedRoundtrip.active?.cursor,1,'interrupted run resumes');
const cancelled=cancelRepairRun(resumedRoundtrip,now+27);
assert.equal(cancelled.active,null);
assert.equal(cancelled.history[1]?.status,'cancelled');
assert.deepEqual(repairSummary(cancelled),{runs:1,retests:2,passed:1},'cancellation is not a completed grade');
assert.equal(startRepairRun(undefined,{...report,sourceLimited:true},now).active,null,'source-capped sessions cannot start');
assert.equal(checkRepairRetest(armRepairRetest(
 startRepairRun(undefined,report,now+50,1),originalKey,now+51),report),'not-armed',
 'only current retest task may be armed');
console.log(JSON.stringify({schema:'thiepn-french-d6b-remediation',ok:true,
 interleaved:true,resumable:true,independentNativeRetestOnly:true,
 passiveSrsMutation:false,cefrPromotion:false,rawAnswerRetention:false}));
