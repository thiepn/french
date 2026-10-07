import assert from 'node:assert/strict';
import { gradeTypedAnswer,suggestedRating } from '../app/src/core/learner/grader.ts';
import type { ReviewWord } from '../app/src/core/content/review-content.ts';

const base:ReviewWord={id:'fr:ecole',word:'école',meaning:'school',ipa:'/ekɔl/',pos:'noun',level:'A1',article:'une',gender:'f',plural:'écoles',aliases:[],source:'edited'};
const options={skill:'production' as const,direction:'en-fr' as const,strictArticles:false,gradingMode:'learning' as const};

let result=gradeTypedAnswer('école',base,options);
assert.equal(result.quality,'exact');assert.equal(result.correct,true);assert.equal(suggestedRating(result,4000),'easy');

result=gradeTypedAnswer('ecole',base,options);
assert.equal(result.issue,'accent');assert.equal(result.correct,true);assert.equal(suggestedRating(result,8000),'hard');

result=gradeTypedAnswer('bonjor',{...base,id:'fr:bonjour',word:'bonjour',meaning:'hello',article:'',plural:'',aliases:[]},options);
assert.equal(result.issue,'spelling');assert.equal(result.correct,false);

result=gradeTypedAnswer('maison',base,options);
assert.equal(result.quality,'review');assert.equal(suggestedRating(result,5000),'again');

result=gradeTypedAnswer('école',base,{...options,skill:'article',strictArticles:true,gradingMode:'strict'});
assert.equal(result.issue,'missing-article');assert.equal(result.quality,'missing-article');

result=gradeTypedAnswer('un école',base,{...options,skill:'article',strictArticles:true,gradingMode:'strict'});
assert.equal(result.issue,'wrong-article');

result=gradeTypedAnswer('une école',base,{...options,skill:'article',strictArticles:true,gradingMode:'strict'});
assert.equal(result.quality,'exact');

result=gradeTypedAnswer('school',base,{...options,skill:'recognition',direction:'fr-en'});
assert.equal(result.quality,'exact');

console.log(JSON.stringify({schema:'thiepn-french-p37f-typed-grading-parity',ok:true,fixtures:8},null,2));
