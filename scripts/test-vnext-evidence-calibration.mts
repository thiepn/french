import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import type {CanonicalReviewEventV1} from '../app/src/core/learner/model.ts';
import type {FunctionEvidence} from '../app/src/core/conversation/curriculum.ts';
import type {UsagePack,SentenceExercisePack} from '../app/src/core/content/loader.ts';
import {freshUsageState,accumulateUsageTally,type UsageAttempt,type UsageState} from '../app/src/core/usage/session.ts';
import {freshWritingState} from '../app/src/core/writing/session.ts';
import {calibrateFrenchEvidence,D2_WINDOW_DAYS,D2_RECENT_DAYS}
  from '../app/src/core/learner/evidence-calibration.ts';
const [usageRaw,sentencesRaw]=await Promise.all([
  readFile(new URL('./data/stable-usage-corpus-v1.json',import.meta.url),'utf8'),
  readFile(new URL('./data/stable-sentence-exercises-v1.json',import.meta.url),'utf8')
]);
const usagePack={records:JSON.parse(usageRaw).records} as Pick<UsagePack,'records'>;
const sentences={exercises:JSON.parse(sentencesRaw).exercises} as Pick<SentenceExercisePack,'exercises'>;
const DAY=86_400_000,now=Date.now();
const ev=(practice:string,props:Record<string,unknown>={}):CanonicalReviewEventV1=>({
  schema:'thiepn-french-review-event-v1',eventId:crypto.randomUUID(),t:now,
  id:'test::d31:0:production',noteId:'test',skill:'production',
  rating:'good',correct:true,practiceOnly:true,practice,
  typed:true,typedQuality:'exact',manualJudgment:'matched',
  supportLevel:0,transcriptUsed:false,translationUsed:false,
  ...props
} as CanonicalReviewEventV1);
const base={
  events:[] as CanonicalReviewEventV1[],functionEvents:[] as FunctionEvidence[],
  usage:freshUsageState(),writing:freshWritingState(),usagePack,sentences,now
};
const first=calibrateFrenchEvidence(base);
assert.equal(first.cefr,'not-assessed');
assert.equal(D2_WINDOW_DAYS,30);
assert.equal(D2_RECENT_DAYS,14);
assert.equal(first.lanes.length,7);
assert.ok(first.lanes.every(x=>x.status==='unobserved'));
assert.equal(first.bridges.sourceFrames,67);
assert.equal(first.bridges.sourceLinkedSentences,36);
const input=[
  ev('spoken-transfer',{typed:false,correct:true,manualJudgment:'correct',
    typedQuality:'manual-correct',recognizedText:'recognized speech text',targetText:'private reference'}),
  ev('spoken-recall',{typed:false,correct:true,manualJudgment:'matched',
    recognitionConfidence:.99,recognizedText:'an asr transcript',targetText:'a model sentence'}),
  ev('contextual-listening',{firstListen:false,playCount:2,playbackRate:1}),
  ev('contextual-listening',{firstListen:true,playCount:1,playbackRate:.8}),
  ev('contextual-listening',{firstListen:true,playCount:1,transcriptUsed:true}),
  ev('contextual-listening',{firstListen:true,playCount:1,typedQuality:'close'}),
  ev('contextual-listening',{firstListen:true,playCount:1,noteId:'segment-A',t:now-3*DAY}),
  ev('contextual-listening',{firstListen:true,playCount:1,noteId:'segment-B',t:now-2*DAY}),
  ev('contextual-listening',{firstListen:true,playCount:1,noteId:'segment-C',t:now-DAY}),
  ev('written-bridge',{sentenceExerciseId:'p12-007',typedQuality:'exact',sentenceDiagnosis:'exact',
    noteId:'sentence:p12-007',t:now-5*DAY}),
  ev('written-bridge',{sentenceExerciseId:'p12-007',typedQuality:'exact',sentenceDiagnosis:'exact',
    noteId:'sentence:p12-007',t:now-DAY}),
  ev('written-sentence',{sentenceExerciseId:'p12-001',typedQuality:'manual-self-assessed',
    correct:true,manualJudgment:'self-assessed'}),
  ev('reading-context',{skill:'recognition',supportLevel:1,correct:true}),
  ev('classic',{practiceOnly:false,skill:'recognition',noteId:'vocab:one',t:now-2*DAY}),
  ev('classic',{practiceOnly:false,skill:'production',noteId:'vocab:two',t:now-DAY}),
  ev('contextual-listening',{firstListen:true,playCount:1,noteId:'old',t:now-31*DAY})
];
const rated=calibrateFrenchEvidence({...base,events:input});
const lane=(id:string)=>rated.lanes.find(x=>x.id===id)!;
assert.equal(lane('speaking').independent,0,'manual speaking and ASR confidence cannot certify speech');
assert.equal(lane('speaking').manual,1,'self-assessed speech is tracked separately');
assert.equal(lane('reading').independent,0,'supported reading tasks cannot certify comprehension');
assert.equal(lane('listening').independent,3,'only exact first normal-speed playback counts');
assert.equal(lane('listening').status,'varied','three contexts and two days support varied task exposure');
assert.equal(lane('listening').attempts,7,'old listening event excluded from 30-day window');
assert.equal(lane('writing').independent,2,'manual source sentence must not count');
assert.equal(lane('writing').distinctTasks,1,'two repetitions of one P12 sentence are not varied');
assert.equal(lane('writing').status,'single-context');
assert.equal(lane('vocabulary').independent,2,'scheduled recall is different from contextual production');
assert.equal(rated.bridges.multiModal,0,'unrelated writing and listening do not combine into a bridge');

const fe=(props:Record<string,unknown>={}):FunctionEvidence=>({
  scenarioId:'bakery',functionId:'request',turnIndex:0,at:now,
  level:'A1',accepted:true,manual:false,independent:true,
  support:0,retries:0,matched:2,required:2,credit:1,
  ...props
} as FunctionEvidence);
const withFunctions=calibrateFrenchEvidence({...base,functionEvents:[
  fe({at:now-2*DAY}),fe({scenarioId:'hotel',at:now-DAY}),
  fe({scenarioId:'hospital',functionId:'clarification',at:now}),
  fe({scenarioId:'bakery',functionId:'greeting',manual:true}),
  fe({scenarioId:'hotel',functionId:'thanks',support:1}),
  fe({scenarioId:'work',functionId:'price',retries:2}),
  fe({scenarioId:'school',functionId:'request',matched:0})
]});
const interaction=withFunctions.lanes.find(x=>x.id==='interaction')!;
assert.equal(interaction.attempts,7);
assert.equal(interaction.independent,3,'manual, retries, support and missed matcher cannot grant independent credit');
assert.equal(interaction.status,'varied');
assert.equal(interaction.distinctTasks,3);

let usage:UsageState=freshUsageState();
function addUsage(mode:'usage'|'context',variant:0|1,at:number,correct=true){
  const attempt:UsageAttempt={recordId:'p10-001',mode,variant,at,
    support:0,outcome:correct?'matched':'needs-practice',
    diagnosis:correct?'exact':'structure'};
  const group={...(usage.tallies['p10-001']??{})};
  group[mode]=accumulateUsageTally(group[mode],attempt);
  usage={...usage,history:[attempt,...usage.history],tallies:{...usage.tallies,'p10-001':group}};
}
addUsage('usage',0,now-6*DAY);
addUsage('usage',0,now-5*DAY);
addUsage('context',0,now-4*DAY);
addUsage('context',1,now-3*DAY);
const writing=freshWritingState();
writing.evidence['p12-007']={attempts:1,independentExact:1,
  lastAt:now-2*DAY,lastIndependent:true,lastDiagnosis:'exact'};
const tied=calibrateFrenchEvidence({...base,usage,writing});
assert.equal(tied.bridges.usageReady,1);
assert.equal(tied.bridges.linkedWriting,1);
assert.equal(tied.bridges.contextSecured,1);
assert.equal(tied.bridges.multiModal,1,'three controlled stages only after genuine source alignment');
assert.equal(tied.lanes.find(x=>x.id==='context')?.independent,2);
assert.equal(tied.lanes.find(x=>x.id==='context')?.distinctTasks,2);
assert.equal(tied.lanes.find(x=>x.id==='context')?.status,'single-context',
  'two situations in one day are not independent cross-day evidence');
addUsage('context',0,now-DAY,false);
const regressed=calibrateFrenchEvidence({...base,usage,writing});
assert.equal(regressed.bridges.multiModal,0,'latest failure revokes one contextual situation');
assert.equal(regressed.bridges.contextSecured,0);
assert.equal(regressed.lanes.find(x=>x.id==='context')?.independent,2,
  'historical successes remain visible without claiming current mastery');
const raw=JSON.stringify(rated)+JSON.stringify(tied);
for(const secret of ['recognized speech text','a model sentence','an asr transcript','private reference'])
  assert.equal(raw.includes(secret),false,'calibrated summary must never echo speech text');
assert.equal(rated.cefr,'not-assessed');
assert.equal(tied.cefr,'not-assessed');
console.log(JSON.stringify({
  schema:'french-p37i-d2-cross-skill-evidence-calibration',
  ok:true,lanes:7,scopedIndependentEvidence:true,manualSpeechNotCertified:true,
  strictFirstListen:true,sourceLinkedTransfer:true,privacy:'aggregate-only',cefr:'not-assessed'
}));
