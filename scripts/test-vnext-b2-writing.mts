import assert from 'node:assert/strict';
import {b2WritingLengthReview,b2WritingTarget,countFrenchWritingWords,type B2WritingMode} from '../app/src/core/unified/u43-b2-writing-support.ts';
import {getOriginalMaterial} from '../app/src/core/unified/u23-registry.ts';
import {ORIGINAL_FRENCH_U42_COURSE,validateU42Course} from '../app/src/core/unified/u42-course.ts';
import {ORIGINAL_FRENCH_U22_COURSE} from '../app/src/core/unified/u22-course.ts';
assert.deepEqual(validateU42Course(),[]);
assert.equal(ORIGINAL_FRENCH_U42_COURSE.length,251);
assert.deepEqual(ORIGINAL_FRENCH_U42_COURSE.slice(0,244),ORIGINAL_FRENCH_U22_COURSE);
assert.equal(countFrenchWritingWords('L’école n’est pas fermée ; vingt-deux élèves l’ont dit.'),8);
assert.equal(countFrenchWritingWords(" \n ...  "),0);
assert.equal(countFrenchWritingWords('Je compare les deux documents.'),5);
const cases:readonly [string,B2WritingMode,number|null,number|null][]=[
 ['transfer-151','fromListening',150,200],['transfer-151','fromSources',170,220],
 ['transfer-151','fromDebate',180,220],['transfer-152','fromListening',160,220],
 ['transfer-152','fromSources',170,230],['transfer-152','fromDebate',null,null],
 ['transfer-153','fromListening',150,210],['transfer-153','fromSources',170,220],
 ['transfer-153','fromDebate',170,220],
 ['transfer-154','fromListening',150,200],['transfer-154','fromSources',170,220],['transfer-154','fromDebate',180,220],
 ['transfer-155','fromListening',150,200],['transfer-155','fromSources',170,220],['transfer-155','fromDebate',180,220],
 ['transfer-156','fromListening',160,220],['transfer-156','fromSources',180,230],['transfer-156','fromDebate',190,240],
 ['transfer-157','fromListening',170,220],['transfer-157','fromSources',180,230],['transfer-157','fromDebate',190,240]
];
for(const [id,mode,min,max] of cases){
 const material=getOriginalMaterial(id);
 assert.ok(material?.evidence?.sources.length===2,id+' needs both authored source documents');
 assert.ok(material.evidence.sources.every(d=>d.label&&d.french.length>90));
 assert.ok((material.writingChoices?.[mode]?.prompt?.length??0)>45,id+' '+mode+' must be authored');
 const target=b2WritingTarget(id,mode);
 assert.equal(target?.min??null,min);assert.equal(target?.max??null,max);
 assert.equal(b2WritingLengthReview(id,mode,'').status,'empty');
 const short=b2WritingLengthReview(id,mode,'Un argument limité.');
 assert.equal(short.words,3);
 if(min===null){
  assert.equal(short.status,'unbounded');
  assert.match(short.message,/no encoded word target in this helper/);
 }else{
  assert.equal(short.status,'short');
  assert.equal(b2WritingLengthReview(id,mode,Array(min).fill('mot').join(' ')).status,'within');
  assert.equal(b2WritingLengthReview(id,mode,Array(max!).fill('mot').join(' ')).status,'within');
  assert.equal(b2WritingLengthReview(id,mode,Array(max!+1).fill('mot').join(' ')).status,'long');
 }
}
assert.equal(b2WritingTarget('a1-01','fromSources'),null);
assert.equal(b2WritingLengthReview('a1-01','fromSources','Bonjour.').status,'unbounded');
console.log('B2 writing: historical 250 source IDs immutable, 21 mode targets, French word counting and 2 original documents per advanced case: PASS');
