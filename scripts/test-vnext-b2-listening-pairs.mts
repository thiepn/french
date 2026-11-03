import assert from 'node:assert/strict';
import {ORIGINAL_B2_LISTENING_PAIRS} from '../app/src/core/unified/u45-b2-listening-pairs.ts';
import {originalU30Listening,validateU30SourceModel,evaluateU30Answer} from '../app/src/core/unified/u30-listening.ts';
import {ORIGINAL_FRENCH_U22_COURSE} from '../app/src/core/unified/u22-course.ts';
import {ORIGINAL_FRENCH_U42_COURSE} from '../app/src/core/unified/u42-course.ts';
import {getOriginalMaterial} from '../app/src/core/unified/u23-registry.ts';
assert.equal(ORIGINAL_FRENCH_U22_COURSE.length,244);
assert.equal(ORIGINAL_FRENCH_U42_COURSE.length,257);
assert.deepEqual(ORIGINAL_FRENCH_U42_COURSE.slice(0,244),ORIGINAL_FRENCH_U22_COURSE);
assert.deepEqual(validateU30SourceModel(),[],'Original paired French source anchors and authoring must be exact');
assert.equal(ORIGINAL_B2_LISTENING_PAIRS.length,6);
for(const id of ['transfer-151','transfer-152','transfer-153']){
 const actual=originalU30Listening(id),material=getOriginalMaterial(id);
 assert.ok(actual&&material);
 const cases=ORIGINAL_B2_LISTENING_PAIRS.filter(x=>x.lesson===id);
 assert.equal(cases.length,2,'Each new B2 case includes two cross-turn inferences');
 for(const spec of cases){
  const d=actual.decisions.find(x=>x.id==='u30:'+id+':paired-'+spec.id);
  assert.ok(d,'The paired B2 task must be reachable through existing U30: '+spec.id);
  assert.equal(d.kind,'interpretation');
  assert.deepEqual(d.contextualTurns?.length,2);
  assert.equal(d.oralPrompt,spec.oralPrompt);
  assert.deepEqual(d.oralCriteria,spec.oralCriteria);
  const [a,b]=d.contextualTurns!;
  assert.notEqual(a,b);
  const first=material.unit.dialogue[a],second=material.unit.dialogue[b];
  assert.equal(first.speaker,spec.first.speaker);
  assert.equal(second.speaker,spec.second.speaker);
  assert.ok(first.fr.includes(spec.first.anchor)&&second.fr.includes(spec.second.anchor));
  assert.equal(d.evidence,second.fr);
  assert.equal(d.translation,second.en);
  assert.equal(d.options.length,3);
  assert.equal(new Set(d.options).size,3);
  assert.equal(evaluateU30Answer(d,spec.answer).correct,true);
  for(const wrong of spec.distractors){
   assert.equal(evaluateU30Answer(d,wrong).correct,false);
   assert.ok(evaluateU30Answer(d,wrong).feedback.includes(spec.explanation));
  }
  assert.ok(spec.oralPrompt.length>=95);
  assert.ok(spec.oralCriteria.every(c=>c.length>=45));
 }
}
console.log('B2 listening 151–153: six verified two-turn inference tasks, 18 authorial oral criteria, three preserved earlier course source identities and no SRS writes.');
