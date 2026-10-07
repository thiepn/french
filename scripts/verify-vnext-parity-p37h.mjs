import { readFile } from 'node:fs/promises';

const [progress,settings,listen,speak,repository,styles,backup,main,index,swBuilder,manifest]=await Promise.all([
  readFile(new URL('../app/src/routes/progress.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/settings.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/listen.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/speak.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/learner/repository.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/styles/base.css',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/backup/archive.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/main.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/index.html',import.meta.url),'utf8'),
  readFile(new URL('./build-vnext-service-worker.mjs',import.meta.url),'utf8'),
  readFile(new URL('../app/public/manifest.webmanifest',import.meta.url),'utf8')
]);

const failures=[];
const need=(source,token,label=token)=>{if(!source.includes(token))failures.push('missing '+label);};
const reject=(source,token,label=token)=>{if(source.includes(token))failures.push('placeholder remains '+label);};

for(const token of ['readRecentReviewEvents','countDueSrs','30-day skill mix','Last 7 days'])need(progress,token,'Progress '+token);
for(const token of ['replaceCanonicalLearnerSettings','dailyNewLimit','desiredRetention','strictArticles','Export backup','Restore selected backup','mandatory safety backup'])need(settings,token,'Settings '+token);
for(const token of ['loadVocabularySearchIndex','Play audio','French dictation','speechSynthesis'])need(listen,token,'Listen '+token);
for(const token of ['webkitSpeechRecognition','Play model','Speak now','phrase match'])need(speak,token,'Speak '+token);
need(repository,'export async function replaceCanonicalLearnerSettings','settings persistence');
for(const token of ['.progress-grid','.settings-form','.practice-card','.activity-bars','.data-recovery'])need(styles,token,'styles '+token);

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
  functionalRoutes:['progress','settings','listen','speak'],
  recovery:'transactional-vnext-backup-with-safety-export',
  offline:'lazy-corpus-pwa-shell',
  productionCutover:false,
  remainingCutoverBlockers:['p14-reading','p5-p15-p16-deep-parity','thiepn-account-sync','whole-product-p35-parity-acceptance','five-engine-final-matrix','real-device-qualification']
},null,2));
if(failures.length)process.exitCode=1;
