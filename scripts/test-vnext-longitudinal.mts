import assert from 'node:assert/strict';
import type {CanonicalReviewEventV1} from '../app/src/core/learner/model.ts';
import type {FunctionEvidence} from '../app/src/core/conversation/curriculum.ts';
import {evaluateLongitudinalEvidence,D3_WINDOW_DAYS,D3_LOOKBACK_DAYS}
  from '../app/src/core/learner/longitudinal.ts';
const DAY=86_400_000,now=Date.now();
let seq=0;
const event=(noteId:string,age:number,correct:boolean,props:Record<string,unknown>={})=>({
  eventId:'event-'+(++seq),id:noteId+'::d31:0:recognition',noteId,skill:'recognition',
  practice:'review',practiceOnly:false,t:now-age*DAY,correct,typed:true,typedQuality:correct?'exact':'review',
  direction:'fr-en',...props
} as CanonicalReviewEventV1);
const scheduled=(id:string,old:boolean[],recent:boolean[])=>[
  ...old.map((ok,i)=>event(id,[82,70,58][i],ok)),
  ...recent.map((ok,i)=>event(id,[22,12,3][i],ok))
];
const events:CanonicalReviewEventV1[]=[
  ...scheduled('v-improve',[false,false,false],[true,true,true]),
  ...scheduled('v-decline',[true,true,true],[false,false,false]),
  ...scheduled('v-stuck',[false,false,false],[false,false,false]),
  ...scheduled('v-stable',[true,true,true],[true,true,true]),
  event('v-sparse',10,true),
  ...[82,70,58].map((age)=>event('listen-1',age,false,{
    practice:'contextual-listening',practiceOnly:true,typedQuality:'review',
    supportLevel:0,playCount:1,playbackRate:1,firstListen:false})),
  ...[22,12,3].map(age=>event('listen-1',age,true,{
    practice:'contextual-listening',practiceOnly:true,typedQuality:'exact',
    supportLevel:0,playCount:1,playbackRate:1,firstListen:true})),
  event('listen-1',2,true,{practice:'contextual-listening',practiceOnly:true,
    typedQuality:'exact',supportLevel:2,playCount:2,playbackRate:0.75,firstListen:false}),
  ...[82,70,58].map(age=>event('sentence:p12-001',age,false,{
    practice:'written-bridge',practiceOnly:true,
    sentenceExerciseId:'p12-001',sentenceDiagnosis:'structure',
    supportLevel:0,manualJudgment:'needs-practice'})),
  ...[22,12,3].map(age=>event('sentence:p12-001',age,true,{
    practice:'written-bridge',practiceOnly:true,
    sentenceExerciseId:'p12-001',sentenceDiagnosis:'exact',
    supportLevel:0,manualJudgment:'matched'})),
  event('sentence:p12-001',1,true,{practice:'written-bridge',practiceOnly:true,
    sentenceExerciseId:'p12-001',sentenceDiagnosis:'exact',supportLevel:0,
    typedQuality:'manual-correct',manualJudgment:'self-assessed'}),
  ...[82,70,58].map(age=>event('usage:p10-001',age,false,{
    practice:'verified-usage-usage',practiceOnly:true,typedQuality:'review',
    errorCategory:'connector',manualJudgment:'needs-practice',supportLevel:0})),
  event('usage:p10-001',35,false,{
    practice:'verified-usage-repair',practiceOnly:true,typedQuality:'review',
    errorCategory:'connector',manualJudgment:'needs-practice',supportLevel:0}),
  ...[22,12,3].map(age=>event('usage:p10-001',age,true,{
    practice:'verified-usage-usage',practiceOnly:true,
    typedQuality:'exact',errorCategory:'exact',manualJudgment:'matched',supportLevel:0})),
  ...[82,70,58].map(age=>event('usage:p10-002',age,false,{
    practice:'verified-usage-context',practiceOnly:true,typedQuality:'review',
    errorCategory:'structure',manualJudgment:'needs-practice',supportLevel:0})),
  ...[22,12,3].map(age=>event('usage:p10-002',age,true,{
    practice:'verified-usage-context',practiceOnly:true,
    typedQuality:'exact',errorCategory:'exact',manualJudgment:'matched',supportLevel:0})),
  event('v-stable',110,false),
  event('v-stable',-3,false)
];
const fn=(age:number,accepted:boolean,context:string,opts:Record<string,unknown>={})=>({
  at:now-age*DAY,functionId:'request',scenarioId:context,
  turnIndex:age,level:'A1',support:0,retries:0,matched:accepted?1:0,required:1,
  accepted,manual:false,independent:accepted,credit:accepted?1:0,...opts
} as FunctionEvidence);
const functionEvents:FunctionEvidence[]=[
  fn(82,false,'bakery'),fn(70,false,'cafe'),fn(58,false,'bakery'),
  fn(22,true,'bakery'),fn(12,true,'cafe'),fn(3,true,'bakery'),
  fn(2,true,'bakery',{manual:true}),fn(1,true,'bakery',{support:2})
];
const before=JSON.stringify({events,functionEvents});
const input={events,functionEvents,vocabulary:[
  {id:'v-improve',word:'améliorer'},{id:'v-decline',word:'perdre'}
] as any,now};
const report=evaluateLongitudinalEvidence(input);
const by=(key:string)=>{const row=report.rows.find(x=>x.key===key);assert.ok(row,'missing '+key);return row!;};
assert.equal(report.schema,'thiepn-french-p37i-d3-longitudinal');
assert.equal(D3_WINDOW_DAYS,45);assert.equal(D3_LOOKBACK_DAYS,90);
assert.equal(by('vocab:v-improve:v-improve::d31:0:recognition').status,'improving');
assert.equal(by('vocab:v-decline:v-decline::d31:0:recognition').status,'declining');
assert.equal(by('vocab:v-stuck:v-stuck::d31:0:recognition').status,'persistent-risk');
assert.equal(by('vocab:v-stable:v-stable::d31:0:recognition').status,'stable');
assert.equal(by('vocab:v-sparse:v-sparse::d31:0:recognition').status,'insufficient');
assert.equal(by('listen:listen-1').baseline.negative,3,'independent failed first-listens cannot disappear');
assert.equal(by('listen:listen-1').recent.positive,3);
assert.equal(by('listen:listen-1').recent.unverified,1,'supported listening excluded from improvement');
assert.equal(by('listen:listen-1').status,'improving');
assert.equal(by('write:p12-001').status,'improving');
assert.equal(by('write:p12-001').recent.unverified,1,'manual judgment is never independent exact');
assert.equal(by('construct:usage:usage:p10-001').status,'improving');
assert.equal(by('construct:usage:usage:p10-001').repairTouches,1);
const repairEvent=events.find(e=>e.practice==='verified-usage-repair')!;
const duplicateRepair=evaluateLongitudinalEvidence({...input,
  events:[...events,repairEvent,repairEvent]});
assert.equal(duplicateRepair.rows.find(x=>x.key==='construct:usage:usage:p10-001')?.repairTouches,1,
  'reimporting one repair ID must not inflate intervention touch counts');
assert.equal(by('construct:usage:usage:p10-001').followup,'observed-after-repair');
assert.equal(by('construct:context:usage:p10-002').status,'improving');
assert.equal(by('function:request').status,'improving');
assert.ok(report.priority.some(x=>x.status==='declining'));
assert.ok(report.priority.some(x=>x.status==='persistent-risk'));
assert.equal(JSON.stringify({events,functionEvents}),before,'pure and read-only');
assert.equal(report.sourceLimited,false);
const truncated=evaluateLongitudinalEvidence({...input,sourceLimit:events.length});
assert.equal(truncated.sourceLimited,true);
assert.equal(truncated.comparable,0,'capped history cannot claim reliable longitudinal comparison');
assert.equal(truncated.improving,0);
assert.equal(truncated.declining,0);
assert.deepEqual(truncated.priority,[]);
assert.equal(truncated.rows.find(x=>x.key==='vocab:v-decline:v-decline::d31:0:recognition')?.status,
  'insufficient','known decline is still unclassifiable with incomplete source history');
const copies=evaluateLongitudinalEvidence({...input,events:[...events,events[0],events[0]]});
assert.equal(copies.rows.find(x=>x.key===by('vocab:v-improve:v-improve::d31:0:recognition').key)?.baseline.graded,3,'sync duplicates');
const sparse=evaluateLongitudinalEvidence({events:[],functionEvents:[],now});
assert.equal(sparse.comparable,0);
assert.deepEqual(sparse.priority,[]);
const reversedRepair=evaluateLongitudinalEvidence({...input,events:[
  ...events.filter(e=>e.practice!=='verified-usage-repair'),
  event('usage:p10-001',1,false,{practice:'verified-usage-repair',practiceOnly:true,
    typedQuality:'review',errorCategory:'connector',manualJudgment:'needs-practice',supportLevel:0})
]});
assert.equal(reversedRepair.rows.find(r=>r.key==='construct:usage:usage:p10-001')?.followup,
  'not-demonstrated','repair added after successful outcomes is not proof of remediation');
assert.equal(JSON.stringify(report).includes('recognizedText'),false);
assert.equal(JSON.stringify(report).includes('targetText'),false);
console.log(JSON.stringify({schema:'french-p37i-d3-longitudinal',ok:true,
  windows:[45,45],minimumGraded:3,minimumDays:2,similarTargetsOnly:true,
  noAutomaticCausation:true,failedFirstListenPreserved:true,
  assistedExcluded:true,deduplicated:true,cappedSourceAbstains:true,
  readOnly:true,privacy:'aggregate-metadata-only'}));
