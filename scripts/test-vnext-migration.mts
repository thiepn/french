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

// A fresh second device is safe to hydrate automatically, but any edited
// preferences, study plan, feature state or active session must trigger conflict.
const emptyFresh:CloudBackupPayload={
  dbName:'thiepn-french-vnext',dbVersion:5,
  stores:{
    learner:[{key:'state-v1',value:{
      sourceFingerprint:'fresh-vnext',
      settings:{
        session:{deck:'A1',direction:'fr-en',order:'smart',size:50,mode:'today',practice:'review',
          skillMode:'adaptive',scheduleMode:'review',typed:false,requeueAgain:true,
          mix:'due-first',siblingSpacing:true,strictArticles:true},
        dailyNewLimit:20,dailyReviewLimit:200,leechThreshold:8,autoSuspendLeeches:false,
        desiredRetention:.9,maxInterval:3650,learningSteps:[1,10,1440],
        relearningSteps:[10],gradingMode:'learning'
      },
      profile:{xp:0,bestCombo:0,lifetimeAnswers:0,lifetimeCorrect:0,
        typedAnswers:0,choiceAnswers:0,listeningAnswers:0,clozeAnswers:0,
        perfectSessions:0,achievements:[],claimedMissions:{}},
      studyPlan:{targetLevel:'B1',targetDate:'',studyDaysPerWeek:6,dailyMinutes:30,masteryGoal:90},
      promotions:{},featureState:{},studyDays:[]
    }}],
    srs:[],activity:[],
    'user-content':[{key:'content-v1',value:{userCards:{},cardEdits:{},smartDecks:{},customDecks:{}}}],
    session:[],meta:[],migration:[]
  }
};
const untouchedCloud=backupPayloadToFrenchCloudSnapshot(emptyFresh,1_700_000_000_000);
assert.equal(snapshotHasMeaningfulState(untouchedCloud),false,'a fresh device should hydrate from cloud');
const editedFresh=structuredClone(emptyFresh);
(editedFresh.stores.learner[0].value as {settings:{dailyNewLimit:number}}).settings.dailyNewLimit=17;
assert.equal(snapshotHasMeaningfulState(backupPayloadToFrenchCloudSnapshot(editedFresh)),true,
  'local settings must not be silently overwritten');
const plannedFresh=structuredClone(emptyFresh);
(plannedFresh.stores.learner[0].value as {studyPlan:{targetLevel:string}}).studyPlan.targetLevel='B2';
assert.equal(snapshotHasMeaningfulState(backupPayloadToFrenchCloudSnapshot(plannedFresh)),true,
  'local study plan must not be silently overwritten');
const activeFresh=structuredClone(emptyFresh);
activeFresh.stores.session.push({key:'active',value:{cursor:2}});
assert.equal(snapshotHasMeaningfulState(backupPayloadToFrenchCloudSnapshot(activeFresh)),true,
  'unfinished study session must not be silently overwritten');


const usageHintOnly=structuredClone(emptyFresh);
usageHintOnly.stores.meta.push({
  key:'native-usage-v1',
  value:{schema:'thiepn-french-usage-v1',history:[],modes:{
    usage:{index:0,support:1},production:{index:0,support:0},
    transfer:{index:0,support:0},repair:{index:0,support:0}
  }}
});
assert.equal(snapshotHasMeaningfulState(backupPayloadToFrenchCloudSnapshot(usageHintOnly)),true,
  'P10/P11 hint-only local usage progress must not be overwritten');
const usageAttemptOnly=structuredClone(emptyFresh);
usageAttemptOnly.stores.meta.push({
  key:'native-usage-v1',
  value:{schema:'thiepn-french-usage-v1',history:[{
    recordId:'p10-001',mode:'usage',at:Date.now(),outcome:'needs-practice',diagnosis:'connector',support:0
  }],modes:{}}
});
assert.equal(snapshotHasMeaningfulState(backupPayloadToFrenchCloudSnapshot(usageAttemptOnly)),true,
  'P10/P11 usage-only history must require cloud conflict review');

const conversationFresh=structuredClone(emptyFresh);
conversationFresh.stores.meta.push({
  key:'native-conversation-v1',
  value:{schema:'thiepn-french-native-conversation-v1',active:null,
    history:[{scenarioId:'bakery',totalTurns:3,independentTurns:2,completedAt:Date.now()}]}
});
assert.equal(snapshotHasMeaningfulState(backupPayloadToFrenchCloudSnapshot(conversationFresh)),true,
  'conversation-only evidence must not be silently overwritten by cloud adoption');
const activeConversationFresh=structuredClone(emptyFresh);
activeConversationFresh.stores.meta.push({
  key:'native-conversation-v1',
  value:{schema:'thiepn-french-native-conversation-v1',active:{scenarioId:'bakery',cursor:2},history:[]}
});
assert.equal(snapshotHasMeaningfulState(backupPayloadToFrenchCloudSnapshot(activeConversationFresh)),true,
  'an unfinished conversation must not be silently overwritten');

const completedMissionFresh=structuredClone(emptyFresh);
completedMissionFresh.stores.meta.push({
  key:'native-conversation-v1',
  value:{schema:'thiepn-french-native-conversation-v1',active:null,history:[],mission:null,
    missionHistory:[{missionId:'morning-town',totalTurns:9,independentTurns:9,completedAt:Date.now()}]}
});
assert.equal(snapshotHasMeaningfulState(backupPayloadToFrenchCloudSnapshot(completedMissionFresh)),true,
  'mission history alone must block silent cloud overwrite');
const pausedMissionFresh=structuredClone(emptyFresh);
pausedMissionFresh.stores.meta.push({
  key:'native-conversation-v1',
  value:{schema:'thiepn-french-native-conversation-v1',active:null,history:[],
    mission:{missionId:'arrival-day',step:1},missionHistory:[]}
});
assert.equal(snapshotHasMeaningfulState(backupPayloadToFrenchCloudSnapshot(pausedMissionFresh)),true,
  'active mission alone must block silent cloud overwrite');

const functionOnlyFresh=structuredClone(emptyFresh);
functionOnlyFresh.stores.meta.push({
  key:'native-conversation-v1',
  value:{schema:'thiepn-french-native-conversation-v1',active:null,history:[],mission:null,
    adaptive:null,missionHistory:[],adaptiveHistory:[],functionEvents:[
      {scenarioId:'bakery',functionId:'request',accepted:false,at:Date.now(),credit:0}]}
});
assert.equal(snapshotHasMeaningfulState(backupPayloadToFrenchCloudSnapshot(functionOnlyFresh)),true,
  'failed function evidence must not be silently overwritten by cloud adoption');
const adaptiveOnlyFresh=structuredClone(emptyFresh);
adaptiveOnlyFresh.stores.meta.push({
  key:'native-conversation-v1',
  value:{schema:'thiepn-french-native-conversation-v1',active:null,history:[],mission:null,
    adaptive:{step:1,queue:['bakery','cafe','opening-hours']},missionHistory:[],adaptiveHistory:[],functionEvents:[]}
});
assert.equal(snapshotHasMeaningfulState(backupPayloadToFrenchCloudSnapshot(adaptiveOnlyFresh)),true,
  'adaptive task state must not be silently overwritten by cloud adoption');

const writingFresh=structuredClone(emptyFresh);
writingFresh.stores.meta.push({
  key:'native-writing-v1',
  value:{schema:'thiepn-french-writing-v1',
    modes:{phrase:{index:1,support:0},sentence:{index:0,support:0},transfer:{index:0,support:0}},
    history:[{exerciseId:'p12-001',mode:'phrase',at:Date.now(),outcome:'matched',diagnosis:'exact',support:0}]}
});
assert.equal(snapshotHasMeaningfulState(backupPayloadToFrenchCloudSnapshot(writingFresh)),true,
  'writing-only local progress must never be treated as an empty new device');
const supportedWritingFresh=structuredClone(emptyFresh);
supportedWritingFresh.stores.meta.push({
  key:'native-writing-v1',value:{schema:'thiepn-french-writing-v1',
    modes:{phrase:{index:0,support:2},sentence:{index:0,support:0},transfer:{index:0,support:0}},
    history:[]}
});
assert.equal(snapshotHasMeaningfulState(backupPayloadToFrenchCloudSnapshot(supportedWritingFresh)),true,
  'partially assisted writing attempts must not be silently overwritten');

const wireUnequal=structuredClone(emptyFresh);
wireUnequal.stores.meta.push({
  key:'learner-summary',
  value:{currentLevel:undefined,dueCount:0,streakDays:0,migratedAt:new Date('2026-10-08T18:00:00Z')}
});
const withOptionalMetadata=backupPayloadToFrenchCloudSnapshot(wireUnequal);
const jsonRoundTrip=JSON.parse(JSON.stringify(withOptionalMetadata)) as typeof withOptionalMetadata;
assert.equal(await hashFrenchCloudSnapshot(withOptionalMetadata),await hashFrenchCloudSnapshot(jsonRoundTrip),
  'local IndexedDB-only values cannot create a false cloud divergence after JSON transport');

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
  timestampStableHash:true,
  preferencesConflictProtected:true,
  activeSessionConflictProtected:true
},null,2));
