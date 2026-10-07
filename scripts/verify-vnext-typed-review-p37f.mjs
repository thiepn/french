import { readFile } from 'node:fs/promises';

const [grader,review,resolver,test,docs]=await Promise.all([
  readFile(new URL('../app/src/core/learner/grader.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/routes/review.ts',import.meta.url),'utf8'),
  readFile(new URL('../app/src/core/content/review-content.ts',import.meta.url),'utf8'),
  readFile(new URL('./test-vnext-grader.mts',import.meta.url),'utf8'),
  readFile(new URL('../docs/P37F_TYPED_REVIEW_PARITY.md',import.meta.url),'utf8')
]);

const failures=[];
const need=(source,token,label=token)=>{if(!source.includes(token))failures.push('missing '+label);};

for(const token of [
  'gradeTypedAnswer',
  'suggestedRating',
  "quality:'missing-article'",
  "gradingMode==='lenient'",
  "gradingMode==='learning'",
  'levenshtein'
])need(grader,token,'grader '+token);

for(const token of [
  'gradeTypedAnswer(input.value',
  'suggestedRating(result',
  "typedQuality:grade?.quality??'none'",
  "grade?.quality??'none'"
])need(review,token,'Review integration '+token);

for(const token of ['plural:string','aliases:string[]',"source:'edited'"])need(resolver,token,'review content '+token);
for(const token of ['missing-article','wrong-article',"direction:'fr-en'"])need(test,token,'grader fixture '+token);
for(const token of ['Pure grader','Suggested ratings','P35 remains production'])need(docs,token,'P37F documentation '+token);

console.log(JSON.stringify({
  schema:'thiepn-french-p37f-typed-review-parity',
  ok:failures.length===0,
  failures,
  deterministicFixtures:8,
  fullSessionParity:false
},null,2));
if(failures.length)process.exitCode=1;
