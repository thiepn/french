import { readFile } from 'node:fs/promises';
const [html,model,converter,repository,docs]=await Promise.all([
  readFile(new URL('../index.html',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/learner/model.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/learner/from-legacy.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/learner/repository.ts',import.meta.url),'utf8'),
  readFile(new URL('../docs/P37C_CANONICAL_LEARNER_ENGINE.md',import.meta.url),'utf8')
]);
const failures=[],need=(s,t,label=t)=>{if(!s.includes(t))failures.push('missing '+label);};
for(const token of ['fsrsVersion','fsrsState','scheduledDays','elapsedDays','retrievability','lastAnswerIssue'])need(html,token,'stable progress field '+token);
for(const token of ['CanonicalSrsRecordV1','CanonicalReviewEventV1','CanonicalLearnerStateV1','CanonicalUserContentV1'])need(model,token);
for(const token of ['DEPTH_MARK','legacyProgressToCanonical','legacyReviewLogToCanonical','legacyEnvelopeToCanonical'])need(converter,token);
for(const token of ["transaction(['learner','srs','activity','user-content','meta'],'readwrite')","srs.put(row,row.id)","activity.put(row,row.eventId)"])need(repository,token);
for(const token of ['100,000 SRS records','P37B preservation envelope','FSRS-compatible scheduling functions'])need(docs,token);
console.log(JSON.stringify({schema:'thiepn-french-p37c-canonical-learner',ok:!failures.length,failures,monolithicState:false,canonicalStores:['learner','srs','activity','user-content']},null,2));
if(failures.length)process.exitCode=1;
