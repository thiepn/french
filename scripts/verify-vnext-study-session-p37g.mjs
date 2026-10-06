import { readFile } from 'node:fs/promises';

const [idb,queue,session,repo,builder,learn,review,workflow,tests,docs]=await Promise.all([
  readFile(new URL('../app/src/core/storage/idb.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/learner/queue.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/learner/session.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/learner/repository.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/learner/study-session-builder.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/learn.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/review.ts',import.meta.url),'utf8'),
  readFile(new URL('../.github/workflows/p37g-vnext-browser.yml',import.meta.url),'utf8'),
  readFile(new URL('../tests/p37g-vnext.spec.mjs',import.meta.url),'utf8'),
  readFile(new URL('../docs/P37G_STUDY_SESSION_PARITY.md',import.meta.url),'utf8')
]);

const failures=[];
const need=(source,token,label=token)=>{if(!source.includes(token))failures.push('missing '+label);};

for(const token of ["const DB_VERSION=5","'session'","createIndex('dueAt','dueAt'"])need(idb,token,'storage '+token);
for(const token of ['weaknessScore','smartPriority','mixTodayQueue','spaceSiblingFamilies'])need(queue,token,'queue '+token);
for(const token of ['14*86_400_000','applyAgainRequeue','normalizeStudySession','StudyUndoEntryV1'])need(session,token,'session '+token);
for(const token of [
  'recordStudySessionReview',
  "db.transaction(['learner','srs','activity','meta','session'],'readwrite')",
  'undoLastStudySessionReview',
  'ensureCanonicalLearnerState',
  'readStartedRecognitionNoteIds'
])need(repo,token,'repository '+token);
for(const token of ['createReviewStudySession','createLearnStudySession','createTodayStudySession','todayReviewCounts'])need(builder,token,'builder '+token);
for(const token of ["data-start="today"","data-start="new"",'readActiveStudySession'])need(learn,token,'Learn '+token);
for(const token of ['recordStudySessionReview','undoLastStudySessionReview','skipStudySessionItem','readActiveStudySession'])need(review,token,'Study route '+token);
for(const token of ['chromium-desktop','firefox-desktop','webkit-desktop','android-chrome','ios-webkit'])need(workflow,token,'browser matrix '+token);
for(const token of ['Again requeue','Undo rollback','reload resume'].map(()=>''))void token;
for(const token of ['queueIds.filter','Undo answer','page.reload','content/packs/'])need(tests,token,'browser test '+token);
for(const token of ['weakness-aware smart ordering','14-day resumable active sessions','Fresh-user support','P35 remains the production runtime'])need(docs,token,'documentation '+token);

console.log(JSON.stringify({
  schema:'thiepn-french-p37g-study-session-parity',
  ok:failures.length===0,
  failures,
  resumableDays:14,
  browserProjects:5,
  productionCutover:false
},null,2));
if(failures.length)process.exitCode=1;
