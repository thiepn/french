import assert from 'node:assert/strict';
import type {CanonicalReviewEventV1,CanonicalSrsRecordV1} from '../app/src/core/learner/model.ts';
import type {ConversationState} from '../app/src/core/conversation/engine.ts';
import type {VocabularySearchRow,ReadingItem} from '../app/src/core/content/loader.ts';
import {evaluateCefrEvidence,D2_WINDOW_DAYS,D2_RULES,CEFR_DIAGNOSTIC_LEVELS} from '../app/src/core/learner/cefr-gates.ts';
const now=Date.now(),DAY=86_400_000;
const vocabulary=[...Array(12)].map((_,i)=>({id:'a1:'+i,level:'A1',word:'mot '+i} as VocabularySearchRow));
const srs:CanonicalSrsRecordV1[]=vocabulary.flatMap(row=>(['recognition','production'] as const).map(skill=>({
  id:row.id+':1:'+skill,noteId:row.id,sense:1,skill,status:'learned',seen:7,successes:6,lastRating:'good',
  lastReviewedAt:now-2*DAY,dueAt:now+10*DAY,suspended:false,manualKnown:false
} as CanonicalSrsRecordV1)));
const readings=(['A1','A2','B1'] as const).flatMap(level=>
  [...Array(3)].map((_,i)=>({id:level==='A1'?'r'+i:level+'-r'+i,level} as ReadingItem)));
const readingHistory={r0:{completedAt:now-3*DAY,questionAttempts:2,questionCorrect:1},
  r1:{completedAt:now-2*DAY,questionAttempts:2,questionCorrect:1},
  r2:{completedAt:now-1*DAY,questionAttempts:0,questionCorrect:0}};
const review=(type:string,day:number,n:number,more:Record<string,unknown>={})=>({
  eventId:type+day+n,practice:type,practiceOnly:true,correct:true,
  typed:true,typedQuality:'exact',level:'A1',t:now-day*DAY,
  supportLevel:0,playCount:1,playbackRate:1,firstListen:true,
  transcriptUsed:false,translationUsed:false,sentenceExerciseId:'p12-00'+(n%2+1),
  ...more
} as CanonicalReviewEventV1);
const reviews:CanonicalReviewEventV1[]=[
  review('contextual-listening',1,1),review('contextual-listening',2,2),review('contextual-listening',3,3),
  review('written-sentence',1,1),review('written-sentence',2,2),review('written-sentence',3,3)
];
const initialConversation={
  functionEvents:[...Array(5)].map((_,i)=>({
    functionId:'greeting',scenarioId:i%2?'bakery':'cafe',index:i,
    level:'A1',at:now-(i%2+1)*DAY,credit:1,accepted:true,manual:false,
    independent:true,support:0,retries:0,matched:1,required:1,turnIndex:i
  })),
  missionHistory:[{missionId:'morning-town',completedAt:now-DAY,
    independencePass:true,fullyUnsupported:true}]
} as unknown as Pick<ConversationState,'functionEvents'|'missionHistory'>;
const source={targetLevel:'A1',now,vocabulary,srs,reviews,readings,readingHistory,
  conversations:initialConversation};
const previous=JSON.stringify({srs,reviews,readingHistory,initialConversation});
const summary=evaluateCefrEvidence(source);
const a1=summary.levels[0];
assert.deepEqual([...CEFR_DIAGNOSTIC_LEVELS],['A1','A2','B1','B2']);
assert.equal(D2_WINDOW_DAYS,90);
assert.equal(D2_RULES.length,4);
assert.equal(summary.schema,'thiepn-french-p37i-d2-gates');
assert.equal(a1.state,'practice-checks-met-assessment-pending');
assert.equal(a1.metPracticeChecks,a1.totalPracticeChecks);
assert.equal(a1.promotion,'blocked');
assert.equal(a1.checks.find(c=>c.id==='speaking')?.status,'unavailable');
assert.equal(a1.checks.find(c=>c.id==='assessment')?.status,'unavailable');
assert.equal(summary.officialCertification,false);
assert.equal(summary.automaticPromotion,false);
assert.equal(summary.levels[3].state,'content-unavailable','B2 conversation and mission coverage absent');
assert.equal(summary.levels[3].promotion,'blocked');
assert.equal(summary.levels[1].state,'evidence-incomplete','A1 does not certify A2');
assert.equal(JSON.stringify({srs,reviews,readingHistory,initialConversation}),previous,'read-only evaluator');

const unsupported=evaluateCefrEvidence({...source,reviews:reviews.map(x=>({
  ...x,supportLevel:1,playCount:2,firstListen:false
}))});
assert.equal(unsupported.levels[0].checks.find(x=>x.id==='writing')?.status,'missing');
assert.equal(unsupported.levels[0].checks.find(x=>x.id==='listening')?.status,'missing');
assert.equal(unsupported.levels[0].promotion,'blocked');
const falseLevel=evaluateCefrEvidence({...source,reviews:reviews.map(x=>({...x,level:'B1'}))});
assert.equal(falseLevel.levels[0].checks.find(x=>x.id==='listening')?.status,'missing');
assert.equal(falseLevel.levels[0].checks.find(x=>x.id==='writing')?.status,'missing');
assert.equal(falseLevel.levels[2].checks.find(x=>x.id==='listening')?.status,'missing','cross-level evidence does not claim B1');
const overdue=evaluateCefrEvidence({...source,srs:srs.map(row=>({...row,dueAt:now-DAY}))});
assert.equal(overdue.levels[0].checks.find(x=>x.id==='lexical')?.observed,'0 unique word senses');
const forgedSenses=evaluateCefrEvidence({...source,srs:srs.map(row=>({...row,sense:row.skill==='production'?2:1}))});
assert.equal(forgedSenses.levels[0].checks.find(x=>x.id==='lexical')?.observed,'0 unique word senses',
  'two different senses must never be paired');
const old=evaluateCefrEvidence({...source,reviews:reviews.map(x=>({...x,t:now-94*DAY})),
  readingHistory:{r0:{completedAt:now-94*DAY,questionAttempts:1,questionCorrect:1}}});
assert.equal(old.levels[0].checks.find(x=>x.id==='listening')?.observed,'0 exact · 0 days');
assert.equal(old.levels[0].checks.find(x=>x.id==='reading')?.status,'missing');
const selfSpeech=evaluateCefrEvidence({...source,reviews:[...reviews,
  review('spoken-recall',1,50,{typed:false,typedQuality:'manual-correct',manualJudgment:'correct'})]});
assert.equal(selfSpeech.levels[0].checks.find(x=>x.id==='speaking')?.status,'unavailable');
assert.equal(selfSpeech.levels[0].promotion,'blocked','self-assessed oral practice is not CEFR evidence');
const noMission=evaluateCefrEvidence({...source,conversations:{...initialConversation,missionHistory:[]}});
assert.equal(noMission.levels[0].checks.find(x=>x.id==='conversation')?.status,'missing');
assert.equal(JSON.stringify(summary).includes('recognizedText'),false);
assert.equal(JSON.stringify(summary).includes('targetText'),false);
console.log(JSON.stringify({schema:'french-p37i-d2-cefr-gates',ok:true,levels:4,
  levelSpecific:true,assessmentHold:true,senseSafe:true,windowDays:D2_WINDOW_DAYS,
  readOnly:true,privacy:'aggregated-evidence-only'}));
