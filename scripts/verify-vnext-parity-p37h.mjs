import { readFile } from 'node:fs/promises';

const [progress,settings,listen,speak,read,repository,styles,backup,main,index,swBuilder,manifest,contentBuilder,readingSource,sentenceSource,sentenceDiagnosis,router,shell,accountSessionVendor,accountConfig,accountSync,accountRuntime,accountUi,accountMigration]=await Promise.all([
  readFile(new URL('../app/src/routes/progress.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/settings.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/listen.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/speak.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/read.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/learner/repository.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/styles/base.css',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/backup/archive.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/main.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/index.html',import.meta.url),'utf8'),
  readFile(new URL('./build-vnext-service-worker.mjs',import.meta.url),'utf8'),
  readFile(new URL('../app/public/manifest.webmanifest',import.meta.url),'utf8'),
  readFile(new URL('./build-vnext-content.mjs',import.meta.url),'utf8'),
  readFile(new URL('./data/stable-readings-v1.json',import.meta.url),'utf8'),
  readFile(new URL('./data/stable-sentence-exercises-v1.json',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/content/sentence-diagnosis.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/router.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/shell.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/account/account-session-vendor.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/account/config.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/account/sync.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/account/runtime.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/account/settings-ui.ts',import.meta.url),'utf8'),
  readFile(new URL('../supabase/migrations/20261007221500_french_first_party_sso_access.sql',import.meta.url),'utf8')
]);

// A passing compatibility suite must not accidentally authorize a production cutover.
const release=JSON.parse(await readFile(new URL('../app/public/vnext-release.json',import.meta.url),'utf8'));
const [curriculum,coaching]=await Promise.all([
  readFile(new URL('../app/src/core/conversation/curriculum.ts',import.meta.url),'utf8'),
  readFile(new URL('../scripts/test-vnext-curriculum.mts',import.meta.url),'utf8')
]);
const [conversationRoute,conversationEngine,conversationScenes,missionDefinitions,missionTests]=await Promise.all([
  readFile(new URL('../app/src/routes/conversation.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/conversation/engine.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/conversation/scenarios.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/conversation/missions.ts',import.meta.url),'utf8'),
  readFile(new URL('../scripts/test-vnext-mission.mts',import.meta.url),'utf8')
]);
const conversationVariants=await readFile(new URL('../app/src/core/conversation/variants.ts',import.meta.url),'utf8');
const [writingRoute,writingEngine]=await Promise.all([
  readFile(new URL('../app/src/routes/write.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/writing/session.ts',import.meta.url),'utf8')
]);
const [usageSourceText,usageRouteEngine,usageStore,cloudFormat,usageTests]=await Promise.all([
  readFile(new URL('./data/stable-usage-corpus-v1.json',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/usage/session.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/usage/storage.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/account/cloud-format.ts',import.meta.url),'utf8'),
  readFile(new URL('./test-vnext-usage.mts',import.meta.url),'utf8')
]);
const usageSource=JSON.parse(usageSourceText);
const failures=[];
if(release.productionCutover!==false)failures.push('vNext production cutover was enabled before acceptance');
if(release.fullP35FeatureParity!==false)failures.push('P35 feature parity was marked complete without the P37I sign-off');
if(!release.remainingCutoverBlockers?.includes('p35-feature-parity-signoff'))
  failures.push('P37I feature parity release gate is missing');
const need=(source,token,label=token)=>{if(!source.includes(token))failures.push('missing '+label);};
const reject=(source,token,label=token)=>{if(source.includes(token))failures.push('placeholder remains '+label);};

if(usageSource.schema!=='thiepn-french-stable-usage-source-v1'||
   usageSource.sourceBlob!=='8a354063b20421ad53b3417b3f677adc926f3cb5'||
   usageSource.records?.length!==67||usageSource.count!==67) failures.push('incomplete P10 original verified source frames');
for(const item of usageSource.records??[]){
  if(!usageSource.sources?.[item.sourceKey]||!item.frame.includes(item.blank)||!/^p10-\\d{3}$/.test(item.id))
    failures.push('invalid P10 provenance or frame '+item.id);
}
for(const token of ['loadStableUsageCorpus','Usage & phrase transfer (P10/P11)','Check phrase','recordPracticeEvidence','practiceOnly'])
  if(token==='practiceOnly')need(repository,token,'C2 practice-only evidence contract');
  else need(writingRoute,token,'P37I-C2 writing workspace '+token);
for(const token of ['diagnoseUsage','safeUsageState','repairCandidates','completeUsageAttempt','mode===\'repair\'?0:old.index+1'])
  need(usageRouteEngine,token,'P37I-C2 usage engine '+token);
need(usageStore,'native-usage-v1','C2 metadata store');
need(cloudFormat,"at(payload,'meta','native-usage-v1')",'C2 local-first first-sync protection');
for(const token of ['noTypedTranscripts:true','p10-067','repairCandidates','sourceFrames:67'])
  need(usageTests,token,'C2 source and privacy test '+token);

for(const token of ['readAllSrsRecords','loadVocabularySearchIndex','Vocabulary coverage','Skill health','CEFR coverage','Review pressure','Weakest vocabulary','What to do next','productionGap','weaknessScore','retrievability'])need(progress,token,'Progress intelligence '+token);
for(const token of ['replaceCanonicalLearnerSettings','dailyNewLimit','desiredRetention','strictArticles','Export backup','Restore selected backup','mandatory safety backup'])need(settings,token,'Settings '+token);
for(const token of ['loadVocabularySearchIndex','Play audio','speechSynthesis','Comprehensible','Intensive','Targeted','Reveal transcript','Reveal translation','firstListen','supportLevel','contextual-listening','cursor+4','repair:true'])need(listen,token,'Listen evidence '+token);
for(const token of ['webkitSpeechRecognition','Pronunciation','Shadowing','Spoken recall','Spoken transfer','Start recording','MediaRecorder','getUserMedia','Check recognition','Manual judgment','never an accent','recordPracticeEvidence','spoken-','loadStableSentenceExercises','diagnoseSentence','Slow model','paceRatio','french-vnext-speak-reading'])need(speak,token,'Speak evidence '+token);
for(const token of ['loadStableReadingPack','Extensive','Intensive','Targeted','Save discovery','Finish reading','reading-context','replaceCanonicalFeatureState','french-vnext-listen-reading','french-vnext-read-open'])need(read,token,'Reading workspace '+token);
for(const token of ['READING_SOURCE_FILE','reading-stable-p35','thiepn-french-reading-pack-v1','stable-readings.json'])need(contentBuilder,token,'reading content '+token);
for(const token of ['"count": 25','"read-a1-matin"','"read-b2-association"'])need(readingSource,token,'stable reading source '+token);
for(const token of ['"count": 36','"p12-001"','"p12-036"','"type": "transfer"'])need(sentenceSource,token,'stable sentence source '+token);
for(const token of ['diagnoseSentence','wrongContraction','wrongConnector','Needs your judgment','Target construction missing'])need(sentenceDiagnosis,token,'P12 diagnosis '+token);
for(const token of ['SENTENCE_SOURCE_FILE','sentence-stable-p12','thiepn-french-sentence-pack-v1','stable-sentence-exercises.json'])need(contentBuilder,token,'sentence content '+token);
need(router,"read:()=>import('../routes/read')",'lazy Read route');
need(router,"conversation:()=>import('../routes/conversation')",'lazy conversation route');
need(router,"write:()=>import('../routes/write')",'lazy written practice route');
for(const term of ['loadStableSentenceExercises','diagnoseSentence','recordPracticeEvidence','Needs practice & next'])
  need(writingRoute,term,'Native writing UI '+term);
for(const term of ['safeWritingState','completeWritingAttempt','currentWritingExercise'])
  need(writingEngine,term,'Native writing engine '+term);
need(conversationVariants,'validateConversationVariants','authored variant completeness check');
need(conversationEngine,'requestConversationRepeat','repeat evidence without automatic advancement');
for(const term of ['Pause & home','My response fits','Show hint','Send response'])need(conversationRoute,term,'Conversation UI '+term);
for(const term of ['submitConversationResponse','independent:!manual','safeConversationState'])need(conversationEngine,term,'Conversation evidence '+term);
for(const term of ["id:'bakery'","id:'cafe'","id:'directions'","id:'rail'","id:'repair'"])need(conversationScenes,term,'Conversation starter '+term);
for(const missionId of ['morning-town','arrival-day','meet-plan-decide','solve-problems','independent-living']){
  need(missionDefinitions,"id:'"+missionId+"'","Mission definition "+missionId);
}
for(const term of ['beginMission','completeMission','independencePass','fullyUnsupported','missionHistory'])
  need(conversationEngine,term,'Mission completion contract '+term);
for(const term of ['selectMission','Mission complete','Mission history','Mission  '])
  if(term!=='Mission  ')need(conversationRoute,term,'Mission UI '+term);
for(const term of ['FUNCTION_CATALOG','functionProfiles','rankedNativeScenarios','chooseAdaptiveQueue','evidenceCredit'])
  need(curriculum,term,'Curriculum '+term);
for(const term of ['Communicative function evidence','Practise weak functions','functionProfiles'])
  need(progress,term,'B4 Progress evidence '+term);
for(const term of ['turn.functionId','row.level!==scenario.level','Math.abs(credit-row.credit)'])
  need(conversationEngine,term,'B4 import evidence validation '+term);
for(const term of ['beginAdaptiveSet','functionEvents','adaptiveHistory','changeConversationCeiling'])
  need(conversationEngine,term,'Adaptive state '+term);
for(const term of ['Adaptive set · 3 tasks','Function map','Start recommendation','Adaptive task'])
  need(conversationRoute,term,'Adaptive UI '+term);
for(const term of ['scenarioId','transcriptsPersisted','adaptiveTasks'])
  need(coaching,term,'Adaptive tests '+term);
for(const term of ['safeConversationState','manual continuations','independencePass'])
  if(term!=='manual continuations')need(missionTests,term,'Mission tests '+term);

for(const token of ["params.has('state')","params.has('code')","params.has('error')","!location.hash&&!oauthReturn"])need(router,token,'preserved OAuth callback '+token);
need(shell,"read:'Read'",'Read navigation');
for(const token of ['createThiepnAccountSession','authorizationUrl','completeCallback','getAccessToken','authPolicy'])need(accountSessionVendor,token,'shared Account session '+token);
for(const token of ['https://account.thiepn.dev','https://french.thiepn.dev/','bf2e7fca-98dd-4833-9fee-306ecd6fc7d7'])need(accountConfig,token,'Account config '+token);
reject(accountConfig,'__PENDING_FRENCH_OAUTH_CLIENT_ID__','stale OAuth registration blocker');
for(const token of ['isFrenchAccountConnectionActive','sync_thiepn_french_state','Sync this device','chooseThisDevice','chooseCloud'])need(accountSync+accountUi,token,'Account sync '+token);
for(const token of ['probeFrenchAccountSession','isFrenchOAuthCallback','reconcileFrenchSync','if(identityKey===lastIdentityKey)return','if(!running)schedule(250)'])need(accountRuntime,token,'Account runtime '+token);
reject(accountSync,"connect_thiepn_app","native-only connection RPC must not run from French OAuth token");
for(const token of ["is_thiepn_first_party_oauth_client_for_app('french')","app_data.read","app_data.write","FRENCH_APP_NOT_CONNECTED"])need(accountMigration,token,'Account RLS '+token);
for(const source of [accountSessionVendor,accountSync,accountRuntime,accountUi]){reject(source,"signInWithOAuth","direct Google/Supabase provider flow");reject(source,"provider:'google'","direct Google provider");}
for(const token of ['recordPracticeEvidence','practiceOnly:true','supportLevel','firstListen','errorCategory'])need(repository,token,'practice evidence '+token);
need(repository,'export async function replaceCanonicalLearnerSettings','settings persistence');
for(const token of ['.progress-grid','.practice-card','.activity-bars','.data-recovery','.account-panel'])need(styles,token,'styles '+token);

for(const token of ['thiepn-french-vnext-backup-v1','SHA-256','createBackupArchive','inspectBackupArchive','restoreBackupArchive',"db.transaction([...STORE_NAMES],'readwrite')"])need(backup,token,'backup '+token);
need(main,"navigator.serviceWorker.register('/service-worker.js')",'service worker registration');
need(index,'rel="manifest"','PWA manifest link');
for(const token of ["french-vnext-shell-v1","!path.startsWith('content/')","service-worker.js"])need(swBuilder,token,'offline builder '+token);
for(const token of ['"display": "standalone"','"start_url": "/"','"scope": "/"'])need(manifest,token,'manifest '+token);

reject(progress,'Longitudinal mastery and CEFR analytics are queried when opened');
reject(settings,'Backup, diagnostics, account management, and migration tools stay outside');
reject(listen,'Audio and transcripts load only for the lesson being used');
reject(speak,'Microphone and speech code initialize only after entering speaking practice');

console.log(JSON.stringify({
  schema:'thiepn-french-p37h-production-parity',
  ok:failures.length===0,
  failures,
  functionalRoutes:['read','progress','settings','listen','speak'],
  recovery:'transactional-vnext-backup-with-safety-export',
  offline:'lazy-corpus-pwa-shell',
  productionCutover:false,
  remainingCutoverBlockers:['p35-feature-parity-signoff','live-account-sync-acceptance','real-device-qualification']
},null,2));
if(failures.length)process.exitCode=1;
