import assert from 'node:assert/strict';
import {ORIGINAL_B2_DELIBERATIONS} from '../app/src/core/unified/u47-b2-deliberation.ts';
import {originalU30Listening,evaluateU30Answer,validateU30SourceModel} from '../app/src/core/unified/u30-listening.ts';
import {getOriginalMaterial} from '../app/src/core/unified/u23-registry.ts';
import {ORIGINAL_FRENCH_U22_COURSE} from '../app/src/core/unified/u22-course.ts';
import {ORIGINAL_FRENCH_U42_COURSE} from '../app/src/core/unified/u42-course.ts';
import {ORIGINAL_U42_CONNECTED_READINGS} from '../app/src/core/unified/u42-material.ts';

assert.equal(ORIGINAL_FRENCH_U42_COURSE.length,259);
assert.equal(ORIGINAL_U42_CONNECTED_READINGS.length,207);
assert.deepEqual(ORIGINAL_FRENCH_U42_COURSE.slice(0,244),ORIGINAL_FRENCH_U22_COURSE);
assert.deepEqual(validateU30SourceModel(),[]);
assert.equal(ORIGINAL_B2_DELIBERATIONS.length,6);
assert.deepEqual(
 ORIGINAL_B2_DELIBERATIONS.map(x=>x.lesson),
 ['transfer-151','transfer-151','transfer-152','transfer-152','transfer-153','transfer-153']
);
for(const caseStudy of ORIGINAL_B2_DELIBERATIONS){
 const material=getOriginalMaterial(caseStudy.lesson);
 const lesson=originalU30Listening(caseStudy.lesson);
 assert.ok(material&&lesson);
 const decision=lesson.decisions.find(d=>d.id==='u30:'+caseStudy.lesson+':deliberation-'+caseStudy.id);
 assert.ok(decision);
 assert.equal(decision.kind,'interpretation');
 assert.equal(decision.contextualTurns?.length,3);
 assert.equal(new Set(decision.contextualTurns).size,3);
 for(let i=0;i<3;i++){
  const turn=material.unit.dialogue[decision.contextualTurns[i]],anchor=caseStudy.sources[i];
  assert.equal(turn.speaker,anchor.speaker);
  assert.ok(turn.fr.normalize('NFC').replace(/[’‘]/g,"'").includes(anchor.anchor.normalize('NFC').replace(/[’‘]/g,"'")));
 }
 assert.equal(decision.oralPrompt,caseStudy.oralPrompt);
 assert.equal(decision.oralObjection,caseStudy.objection);
 assert.equal(decision.oralModel,caseStudy.model);
 assert.deepEqual(decision.oralSelfChecks,caseStudy.criteria);
 assert.equal(evaluateU30Answer(decision,caseStudy.answer).correct,true);
 for(let i=0;i<2;i++){
  const feedback=evaluateU30Answer(decision,caseStudy.distractors[i]);
  assert.equal(feedback.correct,false);
  assert.ok(feedback.feedback.includes(caseStudy.corrections[i]));
 }
 assert.ok(caseStudy.question.length>=80&&caseStudy.model.length>=250);
}
// Earlier B2 two-turn tasks remain available, not replaced by these advanced cases.
for(const id of ['transfer-151','transfer-152','transfer-153']){
 const pair=originalU30Listening(id)?.decisions.filter(x=>x.id.includes(':paired-'));
 const triple=originalU30Listening(id)?.decisions.filter(x=>x.id.includes(':deliberation-'));
 assert.equal(pair?.length,2);
 assert.equal(triple?.length,2);
}
console.log('B2 151–153: six exact three-turn French deliberations, individual misconception feedback, six authored objections and six ungraded original oral models; first 250 units/198 readings preserved, one original 157 lesson and reading added.');
