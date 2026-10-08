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

const failures=[];
const need=(source,token,label=token)=>{if(!source.includes(token))failures.push('missing '+label);};
const reject=(source,token,label=token)=>{if(source.includes(token))failures.push('placeholder remains '+label);};

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
  remainingCutoverBlockers:['live-account-sync-acceptance','real-device-qualification']
},null,2));
if(failures.length)process.exitCode=1;
