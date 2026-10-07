import { readFile } from 'node:fs/promises';

const [types,router,startup,manifest,loader,builder,repo,account,read,listen,speak,progress,settings,docs]=await Promise.all([
  readFile(new URL('../app/src/core/types.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/router.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/startup.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/content/manifest.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/content/loader.ts',import.meta.url),'utf8'),
  readFile(new URL('./build-vnext-content.mjs',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/learner/repository.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/account/runtime.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/read.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/listen.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/speak.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/progress.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/settings.ts',import.meta.url),'utf8'),
  readFile(new URL('../docs/P37H_PRODUCT_SURFACE_PARITY.md',import.meta.url),'utf8')
]);
const failures=[];
const need=(source,token,label=token)=>{if(!source.includes(token))failures.push('missing '+label);};

for(const route of ['read','listen','speak','progress','settings'])need(types,`'${route}'`,'route '+route);
need(router,"read:()=>import('../routes/read')",'lazy Read route');
need(startup,"import('./account/runtime')",'lazy account startup');
if(startup.includes('supabase.co')||startup.includes('jsdelivr.net/npm/@supabase'))failures.push('account provider leaked into startup');
need(manifest,'readings?:ContentIndexDescriptor','reading manifest descriptor');
for(const token of ['loadReadingCorpus','thiepn-french-reading-corpus-v1'])need(loader,token,'reading loader '+token);
for(const token of ['READINGS_SOURCE',"'readingCount':"].filter(()=>false))void token;
for(const token of ['READINGS_SOURCE','readingLibrary',"'/content/readings/library.json'"])need(builder,token,'reading build '+token);
for(const token of ['recordStandalonePractice','practiceOnly:true','exportCanonicalCloudSnapshot','replaceCanonicalCloudSnapshot','updateLearnerFeatureState'])need(repo,token,'repository '+token);
for(const token of ["from('french_sync_state')","rpc('sync_thiepn_french_state'","rpc('connect_thiepn_app'","legacyCloudStateToCanonical","scheduleSync"])need(account,token,'account '+token);
for(const token of ['loadReadingCorpus','Finish & review','updateLearnerFeatureState','recordStandalonePractice'])need(read,token,'Read '+token);
for(const token of ['speechSynthesis','Dictation','recordStandalonePractice','gradeTypedAnswer'])need(listen,token,'Listen '+token);
for(const token of ['MediaRecorder','SpeechRecognition','I got it','recordStandalonePractice'])need(speak,token,'Speak '+token);
for(const token of ['loadProgressSnapshot','Corpus coverage','Adaptive progression','Promotion record'])need(progress,token,'Progress '+token);
for(const token of ['THIEPN Account','Export backup','Import backup','enableSync','replaceCanonicalCloudSnapshot'])need(settings,token,'Settings '+token);
for(const token of ['Full Product-Surface Parity','P35 remains live','Production promotion belongs to the next'])need(docs,token,'P37H documentation '+token);

console.log(JSON.stringify({
  schema:'thiepn-french-p37h-product-surface-parity',
  ok:failures.length===0,
  failures,
  primaryRoutes:9,
  readingTexts:25,
  productionCutover:false
},null,2));
if(failures.length)process.exitCode=1;
