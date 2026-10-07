import { readFile } from 'node:fs/promises';

const [progress,settings,listen,speak,practice,repo,account,startup,shell,router,pwaRegister,serviceWorker,manifest,indexHtml,finalize,tests,docs]=await Promise.all([
  readFile(new URL('../app/src/routes/progress.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/settings.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/listen.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/speak.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/content/practice.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/learner/repository.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/account/sync.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/startup.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/shell.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/router.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/pwa/register.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/public/service-worker.js',import.meta.url),'utf8'),
  readFile(new URL('../app/public/manifest.webmanifest',import.meta.url),'utf8'),
  readFile(new URL('../app/index.html',import.meta.url),'utf8'),
  readFile(new URL('./finalize-vnext-dist.mjs',import.meta.url),'utf8'),
  readFile(new URL('../tests/p37g-vnext.spec.mjs',import.meta.url),'utf8'),
  readFile(new URL('../docs/P37H_CUTOVER_READINESS.md',import.meta.url),'utf8')
]);
const failures=[];
const need=(source,token,label=token)=>{if(!source.includes(token))failures.push('missing '+label);};

for(const token of ['readCanonicalProgressSnapshot','30-day accuracy','CEFR progression','Skill records'])need(progress,token,'Progress '+token);
for(const token of ['updateCanonicalSettings','Export backup','THIEPN Account','subscribeAccount','initializeAccount(false)'])need(settings,token,'Settings '+token);
for(const token of ['loadPracticeWords','speechSynthesis','gradeTypedAnswer','recordStandalonePractice',"practice:'listening'"])need(listen,token,'Listen '+token);
for(const token of ['loadPracticeWords','SpeechRecognition','Start microphone','recordStandalonePractice',"practice:'speaking'"])need(speak,token,'Speak '+token);
for(const token of ['listContentPacks','loadContentPack','Math.min(limit,words.length)'])need(practice,token,'practice loader '+token);
for(const token of ['readCanonicalProgressSnapshot','updateCanonicalSettings','exportCanonicalBackup','replaceCanonicalBackup','recordStandalonePractice','session?:StudySessionStateV1|null'])need(repo,token,'repository '+token);
for(const token of [
  "APP_SLUG='french'","SYNC_META_KEY='french-thiepn-sync-v1'","AUTH_STORAGE_KEY='thiepn-account-french-auth-v1'",
  'connect_thiepn_app','sync_thiepn_french_state','legacyEnvelopeToCanonical','replaceCanonicalBackup',
  'state.conflict=remote','useDevice','useCloud','pauseSync'
])need(account,token,'account '+token);
for(const token of ['hasAccountSignal',"import('./account/sync')",'hydrateLearnerState'])need(startup,token,'startup '+token);
for(const token of ['account-chip','french:vnext-account-state'])need(shell,token,'shell '+token);
need(router,'french:vnext-state-replaced','router remote-state refresh');
for(const token of ['serviceWorker.register','updateViaCache'])need(pwaRegister,token,'PWA registration '+token);
for(const token of ["const SHELL=['/','/manifest.webmanifest','/vnext-release.json']","path.startsWith('/content/packs/')","path.startsWith('/content/search/')","path.startsWith('/assets/')"])need(serviceWorker,token,'service worker '+token);
if(/SHELL=\[[^\]]*content\//.test(serviceWorker))failures.push('service worker precaches content');
for(const token of ['"start_url": "/"','"display": "standalone"','"/icon-192.png"','"/icon-512.png"'])need(manifest,token,'manifest '+token);
need(indexHtml,'rel="manifest"','installable index manifest link');
for(const token of ['icon-192.png','icon-512.png','maskable-icon.svg'])need(finalize,token,'artifact icon '+token);
for(const token of ["countPracticeEvents(page,'listening')","countPracticeEvents(page,'speaking')",'__speechStarts','content/search/vocabulary-index.json',"context.setOffline(true)","navigator.serviceWorker.ready"])need(tests,token,'browser media/PWA '+token);
for(const token of ['P35 remains the production root','Slice H2 — Listen & Speak','Slice H3 — PWA & Offline Ownership','live account sync is qualified'])need(docs,token,'documentation '+token);

console.log(JSON.stringify({
  schema:'thiepn-french-p37h-cutover-readiness',
  ok:failures.length===0,
  failures,
  completed:['progress','settings','account-architecture','listen','speak','pwa-offline-architecture'],
  cutoverReady:false
},null,2));
if(failures.length)process.exitCode=1;
