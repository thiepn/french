import assert from 'node:assert/strict';
import {ORIGINAL_FRENCH_U22_COURSE} from '../app/src/core/unified/u22-course.ts';
import {ORIGINAL_U22_CONNECTED_READINGS} from '../app/src/core/unified/u22-material.ts';
import {
 ORIGINAL_FRENCH_U42_COURSE,U42_B2_CASES,U46_B2_SEQUENCE,U49_B2_EXTENSION,
 U50_B2_SEQUENCE,U51_B2_INTERPERSONAL,U52_B2_PROFESSIONAL,U53_B2_NARRATIVE,
 validateU42Course
} from '../app/src/core/unified/u42-course.ts';
import {
 ORIGINAL_U42_CONNECTED_READINGS,u42OriginalEvidence,listeningQuestionsForU42,
 u42ProductionChoices,originalOralResponseU42
} from '../app/src/core/unified/u42-material.ts';
import {U53_B2_GRAMMAR} from '../app/src/core/unified/u53-b2-grammar.ts';
import {
 ORIGINAL_REGISTRY_COUNTS,ORIGINAL_REGISTRY_ENTRIES,getOriginalMaterial,getOriginalCatalogEntry
} from '../app/src/core/unified/u23-registry.ts';
import {
 originalU31OralJourney,U31_CURATED_JOURNEYS,validateU31SourceAnchors,
 evaluateU31Decision
} from '../app/src/core/unified/u31-oral.ts';
import {originalU30Listening} from '../app/src/core/unified/u30-listening.ts';
import {
 b2WritingTarget,b2WritingLengthReview
} from '../app/src/core/unified/u43-b2-writing-support.ts';
import {buildFrenchCourseNavigation,parseFrenchCourseLocation} from '../app/src/core/unified/cur02-level-nav.ts';
import {U42_REVISION_GUIDES} from '../app/src/core/unified/u42-revision-guides.ts';

assert.deepEqual(validateU42Course(),[],'All original course source teaching and chronology');
assert.deepEqual(validateU31SourceAnchors(),[],'All curated oral French anchor phrases');
assert.equal(ORIGINAL_FRENCH_U42_COURSE.length,259);
assert.equal(ORIGINAL_U42_CONNECTED_READINGS.length,207);
assert.deepEqual(ORIGINAL_REGISTRY_COUNTS,{lessons:259,connectedReadings:207});
assert.equal(ORIGINAL_REGISTRY_ENTRIES.length,259);
assert.equal(new Set(ORIGINAL_REGISTRY_ENTRIES.map(x=>x.qualifiedId)).size,259);
const historicalLessons=[
 ...ORIGINAL_FRENCH_U22_COURSE,...U42_B2_CASES.map(x=>x.unit),...U46_B2_SEQUENCE.map(x=>x.unit),
 ...U49_B2_EXTENSION.map(x=>x.unit),...U50_B2_SEQUENCE.map(x=>x.unit),
 ...U51_B2_INTERPERSONAL.map(x=>x.unit),...U52_B2_PROFESSIONAL.map(x=>x.unit)
];
const historicalReadings=[
 ...ORIGINAL_U22_CONNECTED_READINGS,...U42_B2_CASES.map(x=>x.reading),...U46_B2_SEQUENCE.map(x=>x.reading),
 ...U49_B2_EXTENSION.map(x=>x.reading),...U50_B2_SEQUENCE.map(x=>x.reading),
 ...U51_B2_INTERPERSONAL.map(x=>x.reading),...U52_B2_PROFESSIONAL.map(x=>x.reading)
];
assert.equal(historicalLessons.length,257);
assert.equal(historicalReadings.length,205);
for(let i=0;i<257;i++)assert.equal(ORIGINAL_FRENCH_U42_COURSE[i],historicalLessons[i],'Changed historical original lesson object '+i);
for(let i=0;i<205;i++)assert.equal(ORIGINAL_U42_CONNECTED_READINGS[i],historicalReadings[i],'Changed historical original reading object '+i);
assert.equal(ORIGINAL_FRENCH_U42_COURSE[256].id,'transfer-163');
assert.equal(ORIGINAL_U42_CONNECTED_READINGS[204].unitId,'transfer-163');
assert.deepEqual(U53_B2_NARRATIVE.map(x=>x.unit.id),['transfer-164','transfer-165']);
const levels=buildFrenchCourseNavigation(ORIGINAL_REGISTRY_ENTRIES);
assert.equal(levels.find(x=>x.level==='B2')?.lessons.length,75);
for(const [i,story] of U53_B2_NARRATIVE.entries()){
 const id='transfer-'+(164+i),unit=story.unit;
 assert.equal(ORIGINAL_FRENCH_U42_COURSE[257+i],unit);
 assert.equal(ORIGINAL_U42_CONNECTED_READINGS[205+i],story.reading);
 assert.equal(unit.order,164+i+94);
 assert.equal(unit.prerequisites.join(),'transfer-'+(163+i));
 assert.equal(unit.source.source,'original');
 assert.equal(unit.source.rights,'original-owned');
 assert.ok(unit.source.qualifiedId.endsWith(':session:u53-'+id));
 assert.equal(getOriginalMaterial(id)?.unit,unit);
 assert.equal(getOriginalMaterial(id)?.reading,story.reading);
 assert.equal(getOriginalCatalogEntry(id)?.level,'Early B2');
 assert.deepEqual(parseFrenchCourseLocation('#course/B2/'+id,levels),{level:'B2',id});
 assert.equal(parseFrenchCourseLocation('#course/C1/'+id,levels),null);
 assert.equal(unit.vocabulary.length,12);
 assert.equal(unit.dialogue.length,9);
 assert.equal(unit.tasks.length,10);
 assert.equal(new Set(unit.tasks.map(t=>t.id)).size,10);
 assert.deepEqual([...new Set(unit.tasks.map(t=>t.type))].sort(),['choice','fill','order','reading']);
 assert.equal(unit.grammar,U53_B2_GRAMMAR[id]);
 assert.equal(unit.grammar.length,2);
 assert.ok(unit.grammar.every(g=>g.explanation.length>=500&&g.correction[2].length>=130));
 assert.ok(story.reading.french.trim().split(/\s+/).length>=365);
 assert.equal(story.reading.french.split('\n\n').length,3);
 assert.equal(story.reading.questions.length,3);
 assert.equal(story.evidence.length,2);
 assert.ok(story.evidence.every(d=>d.french.length>=300));
 assert.equal(story.crossQuestions.length,2);
 assert.equal(story.listening.length,6);
 assert.equal(u42OriginalEvidence(id)?.sources.length,2);
 assert.equal(listeningQuestionsForU42(unit).length,6);
 assert.equal(originalOralResponseU42(id)?.model,story.oral.model);
 assert.equal(u42ProductionChoices(id)?.fromSources.model,story.writingChoices.fromSources.model);
 assert.equal(U42_REVISION_GUIDES[id]?.length,3);
 for(const m of ['fromListening','fromSources','fromDebate'] as const){
  const target=b2WritingTarget(id,m);
  assert.ok(target&&target.min>=190&&target.max>target.min);
  assert.equal(b2WritingLengthReview(id,m,'').status,'empty');
  assert.equal(b2WritingLengthReview(id,m,Array(target.min).fill('mot').join(' ')).status,'within');
  assert.ok(story.writingChoices[m].model.length>=850);
  assert.equal(story.writingChoices[m].criteria.length,3);
 }
 assert.ok(!story.writingChoices.fromSources.criteria.some(t=>t.includes('Attribute each document separately')));
 assert.ok(!story.oral.plan.some(t=>t.includes('Recommend a conditional practical next step')));
 assert.ok(story.oral.model.length>=700);
 for(const q of [...story.reading.questions,...story.crossQuestions,...story.listening]){
  assert.equal(q.options.length,3);
  assert.equal(new Set(q.options).size,3);
  assert.ok(q.options.includes(q.answer));
  assert.ok(q.explanation.length>=45);
 }
 assert.ok(U31_CURATED_JOURNEYS.includes(id));
 const oral=originalU31OralJourney(id),listen=originalU30Listening(id);
 assert.ok(oral&&listen);
 assert.equal(oral.curated,true);
 assert.equal(oral.stages.length,7);
 assert.equal(oral.decisions.length,3);
 assert.equal(oral.documents.length,2);
 assert.equal(oral.u30DecisionCount,listen.decisions.length);
 for(const decision of oral.decisions){
  assert.equal(evaluateU31Decision(decision,decision.answer).supported,true);
  for(const wrong of decision.choices.filter(x=>x!==decision.answer))
   assert.equal(evaluateU31Decision(decision,wrong).supported,false);
 }
}
const [rain,irony]=U53_B2_NARRATIVE;
assert.ok(rain.unit.dialogue.some(x=>x.fr.includes('Il était presque vingt heures')));
assert.ok(rain.unit.dialogue.some(x=>x.fr.includes('J’ai voulu annoncer')));
assert.ok(rain.reading.french.includes('plus-que-parfait'));
assert.ok(rain.evidence[1].french.includes('chute'));
assert.ok(irony.unit.dialogue.some(x=>x.fr.includes('il ne manquait que le pain')));
assert.ok(irony.reading.french.includes('antiphrase'));
assert.ok(irony.reading.french.includes('Farah'));
assert.ok(irony.evidence[1].french.includes('Je me moque de ma consigne'));
assert.notEqual(rain.unit.dialogue[0].speaker,irony.unit.dialogue[0].speaker);
console.log('Original B2 164–165 narrative/humour contract PASS: 257 historical lesson and 205 reading objects preserved; two independent original prose narratives, four fictional storytelling artefacts, 18 dialogue turns, 12 authored listening questions, 20 recalls, 6 extended creative French writing tasks with original rubrics and two source-anchored U31 oral cases. No invented recorded audio, human scoring or CEFR qualification.');
