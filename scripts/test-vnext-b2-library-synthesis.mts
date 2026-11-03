import assert from 'node:assert/strict';
import {
 ORIGINAL_LIBRARY_SYNTHESIS,resolveLibrarySynthesisSources,
 checkLibrarySynthesisChoice,validateLibrarySynthesis
} from '../app/src/core/unified/u46-b2-library-synthesis.ts';
import {ORIGINAL_FRENCH_U22_COURSE} from '../app/src/core/unified/u22-course.ts';
import {ORIGINAL_FRENCH_U42_COURSE} from '../app/src/core/unified/u42-course.ts';
import {getOriginalMaterial} from '../app/src/core/unified/u23-registry.ts';
assert.deepEqual(validateLibrarySynthesis(),[],'All authored source anchors and multi-lesson comparisons must be valid');
assert.equal(ORIGINAL_LIBRARY_SYNTHESIS.length,3);
assert.equal(ORIGINAL_FRENCH_U22_COURSE.length,244);
assert.equal(ORIGINAL_FRENCH_U42_COURSE.length,261);
assert.deepEqual(ORIGINAL_FRENCH_U42_COURSE.slice(0,244),ORIGINAL_FRENCH_U22_COURSE);
const newIds=['transfer-151','transfer-152','transfer-153','transfer-154','transfer-155','transfer-156'];
assert.deepEqual(ORIGINAL_FRENCH_U42_COURSE.slice(244,250).map(x=>x.id),newIds);
for(const item of ORIGINAL_LIBRARY_SYNTHESIS){
 const turns=resolveLibrarySynthesisSources(item);
 assert.ok(turns,'Original source anchors resolve for '+item.id);
 assert.ok(turns.length>=4,'Every cross-lesson task uses multiple attributed utterances');
 assert.deepEqual(new Set(turns.map(t=>t.lessonId)),new Set(['transfer-154','transfer-155','transfer-156']));
 for(const turn of turns){
  const material=getOriginalMaterial(turn.lessonId);
  assert.ok(material);
  assert.equal(material.unit.dialogue[turn.number-1]?.fr,turn.french);
  assert.equal(material.unit.dialogue[turn.number-1]?.speaker,turn.speaker);
 }
 assert.equal(checkLibrarySynthesisChoice(item,item.answer).correct,true);
 for(let i=0;i<2;i++){
  const verdict=checkLibrarySynthesisChoice(item,item.distractors[i]);
  assert.equal(verdict.correct,false);
  assert.ok(verdict.feedback.includes(item.corrections[i]),'Accurate source-specific correction, not generic correctness');
 }
 assert.ok(item.selfChecks.every(x=>x.length>=50));
 assert.ok(item.frenchModel.length>=180);
}
console.log('B2 library 154–156: three complete cross-lesson source comparisons, exact 3-lesson dialogue anchors, answer-specific corrections, original ungraded oral models; historical 250 course identities preserved before additive 157.');
