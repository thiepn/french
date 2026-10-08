import assert from 'node:assert/strict';
import { legacyEnvelopeToCanonical } from '../app/src/core/learner/from-legacy.ts';
import { backupPayloadToFrenchCloudSnapshot,hashFrenchCloudSnapshot,snapshotHasMeaningfulState,type CloudBackupPayload } from '../app/src/core/account/cloud-format.ts';
import type { LegacySnapshotEnvelope } from '../app/src/core/migration/legacy-contract.ts';

const legacyId='bonjour::d31:2:production';
const payload={
  progress:{
    [legacyId]:{
      status:'learned',seen:7,streak:4,interval:12.5,due:1_700_100_000_000,lastReviewed:1_699_000_000_000,
      learnedAt:1_698_000_000_000,ease:2.3,lapses:1,successes:6,lastRating:'good',learningStep:0,
      againCount:1,hardCount:1,goodCount:4,easyCount:1,lastResponseMs:4200,starred:true,suspended:false,
      buriedUntil:0,manualKnown:false,note:'keep this',stability:9.1,difficulty:4.2,relearning:false,
      lastElapsedDays:11,fsrsVersion:'fsrs-v1',fsrsState:'review',scheduledDays:12.5,elapsedDays:11,
      retrievability:.84,lastAnswerIssue:'accent'
    }
  },
  reviewLog:[{
    t:1_699_000_000_000,id:legacyId,noteId:'bonjour',skill:'production',rating:'good',responseMs:4200,
    wasNew:false,interval:12.5,direction:'en-fr',typed:true,typedQuality:'exact',level:'A1',pos:'interjection',
    theme:'greetings',practice:'review',correct:true,xp:3,practiceOnly:false,stability:9.1,difficulty:4.2,
    retrievability:.84,scheduledDays:12.5,fsrsState:'review'
  }],
  settings:{desiredRetention:.91},profile:{xp:88},studyPlan:{targetLevel:'B1'},studyDays:['2026-10-06','2026-10-07'],
  mistakeLog:[{id:legacyId,issue:'accent'}],
  resumeSnapshot:{cursor:4,queue:[legacyId]},
  sessionHistory:[{endedAt:1_699_200_000_000,correct:8,total:10}],
  userCards:{custom1:{word:'salut'}},cardEdits:{bonjour:{meaning:'hello'}},smartDecks:{weak:{name:'Weak'}},customDecks:{travel:{name:'Travel'}},
  v550Reading:{history:{'read-a1-matin':{completedAt:123}}},
  v560Listening:{attempts:3},
  v570Speaking:{attempts:2},
  v5160Progression:{promotions:{A1:{earnedAt:111},A2:{earnedAt:222}}}
} as const;

const envelope:LegacySnapshotEnvelope={
  schema:'thiepn-french-legacy-import-v1',source:'depth-db',capturedAt:1_700_000_000_000,
  sourceUpdatedAt:1_699_500_000_000,sourceVersion:'5.24.0',sourceSchema:13,
  fingerprint:'fixture-p35',payload:{...payload}
};
const canonical=legacyEnvelopeToCanonical(envelope);
assert.equal(canonical.learner.sourceFingerprint,'fixture-p35');
assert.equal(canonical.learner.settings.desiredRetention,.91);
assert.deepEqual(canonical.learner.studyDays,['2026-10-06','2026-10-07']);
assert.deepEqual(canonical.learner.promotions,{A1:{earnedAt:111},A2:{earnedAt:222}});
assert.deepEqual(canonical.learner.featureState.mistakeLog,payload.mistakeLog);
assert.deepEqual(canonical.learner.featureState.resumeSnapshot,payload.resumeSnapshot);
assert.deepEqual(canonical.learner.featureState.sessionHistory,payload.sessionHistory);
assert.deepEqual(canonical.learner.featureState.v550Reading,payload.v550Reading);
assert.deepEqual(canonical.learner.featureState.v560Listening,payload.v560Listening);
assert.deepEqual(canonical.learner.featureState.v570Speaking,payload.v570Speaking);
assert.equal(canonical.srs.length,1);
assert.equal(canonical.srs[0].id,legacyId);
assert.equal(canonical.srs[0].noteId,'bonjour');
assert.equal(canonical.srs[0].sense,2);
assert.equal(canonical.srs[0].skill,'production');
assert.equal(canonical.srs[0].intervalDays,12.5);
assert.equal(canonical.srs[0].dueAt,1_700_100_000_000);
assert.equal(canonical.srs[0].retrievability,.84);
assert.equal(canonical.reviews.length,1);
assert.equal(canonical.reviews[0].intervalDays,12.5);
assert.equal(canonical.reviews[0].practice,'review');
assert.equal(canonical.reviews[0].typedQuality,'exact');
assert.deepEqual(canonical.userContent.userCards,payload.userCards);
assert.deepEqual(canonical.userContent.cardEdits,payload.cardEdits);
assert.deepEqual(canonical.userContent.smartDecks,payload.smartDecks);
assert.deepEqual(canonical.userContent.customDecks,payload.customDecks);

const backup:CloudBackupPayload={
  dbName:'thiepn-french-vnext',dbVersion:5,
  stores:{
    learner:[{key:'state-v1',value:canonical.learner}],
    srs:canonical.srs.map(row=>({key:row.id,value:row})),
    activity:canonical.reviews.map(row=>({key:row.eventId,value:row})),
    'user-content':[{key:'content-v1',value:canonical.userContent}],
    session:[{key:'active',value:{schema:'thiepn-french-study-session-v1',cursor:1}}],
    meta:[{key:'learner-summary',value:{currentLevel:'A2',dueCount:1,streakDays:2}}],
    migration:[{key:'legacy-import-v1',value:envelope}]
  }
};
const cloud=backupPayloadToFrenchCloudSnapshot(backup,1_700_000_000_000);
assert.equal(cloud.schema,13);
assert.equal(cloud.version,'vnext-p37h');
assert.equal((cloud.progress as Record<string,any>)[legacyId].interval,12.5);
assert.equal((cloud.progress as Record<string,any>)[legacyId].due,1_700_100_000_000);
assert.equal((cloud.progress as Record<string,any>)[legacyId].lastReviewed,1_699_000_000_000);
assert.deepEqual(cloud.settings,canonical.learner.settings);
assert.deepEqual(cloud.userCards,canonical.userContent.userCards);
assert.deepEqual(cloud.mistakeLog,payload.mistakeLog);
assert.deepEqual(cloud.resumeSnapshot,payload.resumeSnapshot);
assert.deepEqual(cloud.sessionHistory,payload.sessionHistory);
assert.deepEqual(cloud.v550Reading,payload.v550Reading);
assert.deepEqual(cloud._vnext?.payload,backup);
assert.equal(snapshotHasMeaningfulState(cloud),true);

const same={...cloud,updatedAt:Number(cloud.updatedAt)+99_999};
assert.equal(await hashFrenchCloudSnapshot(cloud),await hashFrenchCloudSnapshot(same));
assert.notEqual(await hashFrenchCloudSnapshot(cloud),await hashFrenchCloudSnapshot({...cloud,profile:{xp:89}}));

console.log(JSON.stringify({
  schema:'thiepn-french-p37h-migration-parity',
  ok:true,
  legacySrsRecords:canonical.srs.length,
  legacyReviewEvents:canonical.reviews.length,
  preservedFeatureKeys:Object.keys(canonical.learner.featureState).sort(),
  rollbackReadable:true,
  exactVnextPayload:true,
  timestampStableHash:true
},null,2));
