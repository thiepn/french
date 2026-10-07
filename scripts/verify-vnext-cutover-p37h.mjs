import { readFile } from 'node:fs/promises';

const [progress,settings,repo,account,startup,shell,router,docs]=await Promise.all([
  readFile(new URL('../app/src/routes/progress.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/settings.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/learner/repository.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/account/sync.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/startup.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/shell.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/router.ts',import.meta.url),'utf8'),
  readFile(new URL('../docs/P37H_CUTOVER_READINESS.md',import.meta.url),'utf8')
]);
const failures=[];
const need=(source,token,label=token)=>{if(!source.includes(token))failures.push('missing '+label);};

for(const token of ['readCanonicalProgressSnapshot','30-day accuracy','CEFR progression','Skill records'])need(progress,token,'Progress '+token);
for(const token of ['updateCanonicalSettings','Export backup','THIEPN Account','subscribeAccount','initializeAccount(false)'])need(settings,token,'Settings '+token);
for(const token of ['readCanonicalProgressSnapshot','updateCanonicalSettings','exportCanonicalBackup','replaceCanonicalBackup','session?:StudySessionStateV1|null'])need(repo,token,'repository '+token);
for(const token of [
  "APP_SLUG='french'","SYNC_META_KEY='french-thiepn-sync-v1'","AUTH_STORAGE_KEY='thiepn-account-french-auth-v1'",
  "connect_thiepn_app","sync_thiepn_french_state","legacyEnvelopeToCanonical","replaceCanonicalBackup",
  "state.conflict=remote","useDevice","useCloud","pauseSync"
])need(account,token,'account '+token);
for(const token of ['hasAccountSignal',"import('./account/sync')",'hydrateLearnerState'])need(startup,token,'startup '+token);
for(const token of ['account-chip','french:vnext-account-state'])need(shell,token,'shell '+token);
need(router,'french:vnext-state-replaced','router remote-state refresh');
for(const token of ['P35 remains the production root','Listen is functional','Speak is functional','service worker / offline shell'])need(docs,token,'documentation '+token);

console.log(JSON.stringify({
  schema:'thiepn-french-p37h-cutover-readiness',
  ok:failures.length===0,
  failures,
  completed:['progress','settings','account-architecture'],
  cutoverReady:false
},null,2));
if(failures.length)process.exitCode=1;
