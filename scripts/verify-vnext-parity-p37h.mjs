import { readFile } from 'node:fs/promises';

const [progress,settings,listen,speak,repository,styles]=await Promise.all([
  readFile(new URL('../app/src/routes/progress.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/settings.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/listen.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/speak.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/learner/repository.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/styles/base.css',import.meta.url),'utf8')
]);

const failures=[];
const need=(source,token,label=token)=>{if(!source.includes(token))failures.push('missing '+label);};
const reject=(source,token,label=token)=>{if(source.includes(token))failures.push('placeholder remains '+label);};

for(const token of ['readRecentReviewEvents','countDueSrs','30-day skill mix','Last 7 days'])need(progress,token,'Progress '+token);
for(const token of ['replaceCanonicalLearnerSettings','dailyNewLimit','desiredRetention','strictArticles'])need(settings,token,'Settings '+token);
for(const token of ['loadVocabularySearchIndex','Play audio','French dictation','speechSynthesis'])need(listen,token,'Listen '+token);
for(const token of ['webkitSpeechRecognition','Play model','Speak now','phrase match'])need(speak,token,'Speak '+token);
need(repository,'export async function replaceCanonicalLearnerSettings','settings persistence');
for(const token of ['.progress-grid','.settings-form','.practice-card','.activity-bars'])need(styles,token,'styles '+token);

reject(progress,'Longitudinal mastery and CEFR analytics are queried when opened');
reject(settings,'Backup, diagnostics, account management, and migration tools stay outside');
reject(listen,'Audio and transcripts load only for the lesson being used');
reject(speak,'Microphone and speech code initialize only after entering speaking practice');

console.log(JSON.stringify({
  schema:'thiepn-french-p37h-production-parity',
  ok:failures.length===0,
  failures,
  functionalRoutes:['progress','settings','listen','speak'],
  productionCutover:false,
  remainingCutoverBlockers:['reading-workspace','account-sync','backup-recovery','offline-pwa','full-p35-parity-acceptance']
},null,2));
if(failures.length)process.exitCode=1;
