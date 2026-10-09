import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import type {CanonicalReviewEventV1,CanonicalSrsRecordV1} from '../app/src/core/learner/model.ts';
import type {UsagePack,SentenceExercisePack} from '../app/src/core/content/loader.ts';
import {initialConversationState} from '../app/src/core/conversation/engine.ts';
import {freshUsageState,accumulateUsageTally,type UsageAttempt} from '../app/src/core/usage/session.ts';
import {freshWritingState} from '../app/src/core/writing/session.ts';
import {planFrenchPractice,D1_WINDOW_DAYS} from '../app/src/core/learner/orchestrator.ts';
const [original,source]=await Promise.all([
  readFile(new URL('./data/stable-usage-corpus-v1.json',import.meta.url),'utf8'),
  readFile(new URL('./data/stable-sentence-exercises-v1.json',import.meta.url),'utf8')
]);
const usagePack={records:JSON.parse(original).records} as Pick<UsagePack,'records'>;
const sentences={exercises:JSON.parse(source).exercises} as Pick<SentenceExercisePack,'exercises'>;
const now=Date.now(),DAY=86_400_000;
const base={events:[] as CanonicalReviewEventV1[],srs:[] as CanonicalSrsRecordV1[],
  conversations:initialConversationState(),usage:freshUsageState(),writing:freshWritingState(),
  usagePack,sentences,readingCompletions:0,targetLevel:'B1',now};
const initial=planFrenchPractice(base);
assert.equal(D1_WINDOW_DAYS,30);
assert.equal(initial.cefr.verdict,'not-assessed');
assert.equal(initial.cefr.target,'B1');
assert.ok(initial.cefr.missing.length>3);
assert.ok(initial.actions.some(x=>x.id==='reading'));
assert.ok(initial.actions.some(x=>x.id==='lane-listen'));
assert.ok(initial.actions.some(x=>x.id==='lane-speak'));
assert.ok(initial.actions.some(x=>x.id==='lane-write'));
assert.equal(initial.lanes.find(x=>x.lane==='conversation')?.independent,0);
const srs=(props:Record<string,unknown>)=>({
  noteId:'vocab:1',skill:'production',status:'learned',dueAt:now-DAY,seen:4,
  lastRating:'again',relearning:false,suspended:false,buriedUntil:0,...props
} as CanonicalSrsRecordV1);
const due=[srs({}),srs({noteId:'vocab:2',skill:'recognition',lastRating:'good'})];
const previous=JSON.stringify(due);
const scheduled=planFrenchPractice({...base,srs:due});
assert.equal(scheduled.actions[0].id,'due','due review beats speculative progression');
assert.equal(JSON.stringify(due),previous,'planner must never mutate FSRS records');
assert.ok(scheduled.actions.find(x=>x.id==='vocab-production'));
const resumed=planFrenchPractice({...base,srs:due,
  conversations:{...initialConversationState(),active:{scenarioId:'c1',startedAt:now,
    updatedAt:now,cursor:0,support:0,attempts:0,turns:[]}}});
assert.equal(resumed.actions[0].id,'resume-conversation','resumable conversation preserved');
const event=(practice:string,correct:boolean,supportLevel:number,manualJudgment:string,t=now):CanonicalReviewEventV1=>({
  schema:'thiepn-french-review-event-v1',eventId:practice+':'+t,t,
  noteId:'test',skill:'production',practice,practiceOnly:true,correct,
  typed:true,sentenceDiagnosis:'exact',supportLevel,manualJudgment,
  typedQuality:manualJudgment==='self-assessed'?'manual-self-assessed':'exact',
  transcriptUsed:false,translationUsed:false
} as CanonicalReviewEventV1);
const practice=[
  event('written-sentence',true,1,'matched'),
  event('written-sentence',true,0,'self-assessed',now-2*DAY),
  event('written-sentence',true,0,'matched',now-3*DAY),
  event('spoken-recall',true,1,'matched'),
  event('contextual-listening',true,0,'matched',now-31*DAY)
];
const rated=planFrenchPractice({...base,events:practice});
assert.equal(rated.lanes.find(x=>x.lane==='write')?.attempts,3);
assert.equal(rated.lanes.find(x=>x.lane==='write')?.independent,1,'hint/manual outcomes cannot give independent credit');
assert.equal(rated.lanes.find(x=>x.lane==='speak')?.independent,0);
assert.equal(rated.lanes.find(x=>x.lane==='listen')?.attempts,0,'30-day bound must exclude stale event');
assert.ok(rated.actions.some(x=>x.id==='lane-speak'));
const recentDictation={...event('contextual-listening',true,0,'matched',now-DAY),
  playCount:1,firstListen:true,playbackRate:1,typed:true};
const trusted=planFrenchPractice({...base,events:[recentDictation,
  {...recentDictation,t:now-2*DAY,playCount:3,firstListen:false},
  event('spoken-transfer',true,0,'matched',now-3*DAY)]});
assert.equal(trusted.lanes.find(x=>x.lane==='listen')?.independent,1,
  'only first normal-speed unaided listening may count independently');
assert.equal(trusted.lanes.find(x=>x.lane==='speak')?.independent,0,
  'manual/ASR native speech cannot enter the independently calibrated lane');
let usage=freshUsageState();
function usageAttempt(recordId:string,mode:'usage'|'context'|'production',at:number,variant:0|1=0,
  outcome:'matched'|'needs-practice'='matched',diagnosis:'exact'|'connector'='exact'){
  const attempt:UsageAttempt={recordId,mode,at,variant,outcome,diagnosis,support:0};
  const tally={...(usage.tallies[recordId]??{})};
  tally[mode]=accumulateUsageTally(tally[mode],attempt);
  usage={...usage,history:[attempt,...usage.history].slice(0,300),tallies:{...usage.tallies,[recordId]:tally}};
}
usageAttempt('p10-001','usage',now-40*DAY);
usageAttempt('p10-001','usage',now-39*DAY);
usageAttempt('p10-001','context',now-33*DAY,0);
usageAttempt('p10-001','context',now-32*DAY,1);
usageAttempt('p10-002','production',now-2*DAY,0,'needs-practice','connector');
const writing=freshWritingState();
writing.evidence['p12-001']={attempts:2,independentExact:0,lastAt:now-DAY,
  lastIndependent:false,lastDiagnosis:'connector'};
const plan=planFrenchPractice({...base,usage,writing,readingCompletions:2});
assert.ok(plan.actions.some(x=>x.id==='usage-repair'),'construction repair must surface');
assert.ok(plan.actions.some(x=>x.id==='context-refresh'),'30-day context refresh must surface');
assert.ok(plan.actions.some(x=>x.id==='sentence-repair'),'source-linked sentence repair must surface');
assert.ok(!plan.actions.some(x=>x.id==='reading'),'completed texts suppress missing-reading recommendation');
assert.equal(plan.cefr.verdict,'not-assessed','practice cannot silently promote CEFR');
assert.equal(JSON.stringify(plan).includes("J'apprends"),false,'no typed answer stored in plan');
console.log(JSON.stringify({schema:'french-p37i-d1-cross-skill',ok:true,
  windowDays:D1_WINDOW_DAYS,cefr:'not-assessed',scheduledSrsUntouched:true,
  supportedCannotCertify:true,repairAcrossSkills:true,privacy:'metadata-only'}));
