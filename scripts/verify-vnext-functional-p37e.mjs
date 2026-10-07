import { readFile } from 'node:fs/promises';

const [builder,loader,worker,idb,repository,words,review,docs]=await Promise.all([
  readFile(new URL('./build-vnext-content.mjs',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/content/loader.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/workers/vocabulary-search.worker.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/storage/idb.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/learner/repository.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/words.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/review.ts',import.meta.url),'utf8'),
  readFile(new URL('../docs/P37E_FUNCTIONAL_VERTICAL_SLICES.md',import.meta.url),'utf8')
]);

const failures=[];
const need=(source,token,label=token)=>{if(!source.includes(token))failures.push('missing '+label);};

for(const token of [
  "schema: 'thiepn-french-vocabulary-search-v1'",
  "searchRows.push",
  "vocabulary: vocabularySearch"
])need(builder,token,'search build '+token);

for(const token of [
  'verifySha256(bytes,sha256)',
  'loadVocabularySearchIndex',
  'loadVocabularyWord'
])need(loader,token,'content loader '+token);

for(const token of [
  "message.type==='init'",
  "message.type==='search'",
  'verifySha256(bytes,message.sha256)'
])need(worker,token,'search worker '+token);

for(const token of [
  'const DB_VERSION=5',
  "createIndex('dueAt','dueAt'",
  "createIndex('noteId','noteId'",
  "createIndex('t','t'"
])need(idb,token,'indexed storage '+token);

for(const token of [
  'readDueSrs',
  'recordStudySessionReview',
  "db.transaction(['learner','srs','activity','meta','session'],'readwrite')",
  "tx.objectStore('srs').put(next,next.id)",
  "tx.objectStore('activity').put(event,event.eventId)"
])need(repository,token,'review repository '+token);

for(const token of [
  "new Worker(new URL('../workers/vocabulary-search.worker.ts'",
  'loadVocabularyWord(row.id',
  "input.addEventListener('input'"
])need(words,token,'Words route '+token);

for(const token of [
  'readActiveStudySession()',
  'resolveReviewWord(record,signal)',
  'recordStudySessionReview(record,rating',
  "['again','Again'],['hard','Hard'],['good','Good'],['easy','Easy']"
])need(review,token,'Review route '+token);

for(const token of [
  'dedicated Web Worker',
  'Atomic answer commit',
  'P35 remains production'
])need(docs,token,'P37E documentation '+token);

console.log(JSON.stringify({
  schema:'thiepn-french-p37e-functional-vertical-slices',
  ok:failures.length===0,
  failures,
  wordsSearch:'worker-and-lazy-pack',
  reviewPersistence:'indexed-and-atomic',
  productionCutover:false
},null,2));
if(failures.length)process.exitCode=1;
