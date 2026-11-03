import assert from 'node:assert/strict';
import {ORIGINAL_FRENCH_U22_COURSE} from '../app/src/core/unified/u22-course.ts';
import {
 ORIGINAL_FRENCH_U42_COURSE,U42_B2_CASES,U46_B2_SEQUENCE,U49_B2_EXTENSION,validateU42Course
} from '../app/src/core/unified/u42-course.ts';
import {ORIGINAL_U42_CONNECTED_READINGS,u42OriginalEvidence,originalOralResponseU42,
 listeningQuestionsForU42,u42ProductionChoices} from '../app/src/core/unified/u42-material.ts';
import {ORIGINAL_REGISTRY_ENTRIES,getOriginalMaterial,getOriginalCatalogEntry,
 ORIGINAL_REGISTRY_COUNTS} from '../app/src/core/unified/u23-registry.ts';
import {ORIGINAL_U22_CONNECTED_READINGS} from '../app/src/core/unified/u22-material.ts';
import {originalU31OralJourney,validateU31SourceAnchors,evaluateU31Decision} from '../app/src/core/unified/u31-oral.ts';
import {originalU30Listening} from '../app/src/core/unified/u30-listening.ts';
import {b2WritingTarget,b2WritingLengthReview} from '../app/src/core/unified/u43-b2-writing-support.ts';
import {buildFrenchCourseNavigation,parseFrenchCourseLocation} from '../app/src/core/unified/cur02-level-nav.ts';
import {U42_REVISION_GUIDES} from '../app/src/core/unified/u42-revision-guides.ts';

assert.deepEqual(validateU42Course(),[]);
assert.deepEqual(validateU31SourceAnchors(),[]);
assert.equal(ORIGINAL_FRENCH_U22_COURSE.length,244);
assert.equal(ORIGINAL_U22_CONNECTED_READINGS.length,192);
assert.equal(U42_B2_CASES.length,3);
assert.equal(U46_B2_SEQUENCE.length,3);
assert.equal(U49_B2_EXTENSION.length,1);
assert.equal(ORIGINAL_FRENCH_U42_COURSE.length,253);
assert.equal(ORIGINAL_U42_CONNECTED_READINGS.length,201);
assert.equal(ORIGINAL_REGISTRY_ENTRIES.length,253);
assert.deepEqual(ORIGINAL_REGISTRY_COUNTS,{lessons:253,connectedReadings:201});
assert.deepEqual(ORIGINAL_FRENCH_U42_COURSE.slice(0,244),ORIGINAL_FRENCH_U22_COURSE);
assert.deepEqual(ORIGINAL_U42_CONNECTED_READINGS.slice(0,192),ORIGINAL_U22_CONNECTED_READINGS);
assert.deepEqual(ORIGINAL_FRENCH_U42_COURSE.slice(244,250),
 [...U42_B2_CASES,...U46_B2_SEQUENCE].map(s=>s.unit),
 'Six previously authored B2 objects must not be reauthored or moved');
assert.deepEqual(ORIGINAL_U42_CONNECTED_READINGS.slice(192,198),
 [...U42_B2_CASES,...U46_B2_SEQUENCE].map(s=>s.reading));
const n=U49_B2_EXTENSION[0],unit=n.unit,id='transfer-157';
assert.equal(unit.id,id);
assert.equal(unit.order,251);
assert.deepEqual(unit.prerequisites,['transfer-156']);
assert.equal(unit.source.rights,'original-owned');
assert.equal(unit.source.source,'original');
assert.ok(unit.source.qualifiedId.endsWith(':session:u49-transfer-157'));
assert.equal(ORIGINAL_FRENCH_U42_COURSE[250],unit);
assert.equal(ORIGINAL_U42_CONNECTED_READINGS[198],n.reading);
assert.equal(getOriginalMaterial(id)?.unit,unit);
assert.equal(getOriginalMaterial(id)?.reading,n.reading);
assert.equal(getOriginalCatalogEntry(id)?.level,'Early B2');
assert.equal(getOriginalCatalogEntry(id)?.sourceComparison,true);
const levels=buildFrenchCourseNavigation(ORIGINAL_REGISTRY_ENTRIES);
assert.equal(levels.find(x=>x.level==='B2')?.lessons.length,69);
assert.deepEqual(parseFrenchCourseLocation('#course/B2/transfer-157',levels),{level:'B2',id});
assert.equal(parseFrenchCourseLocation('#course/C1/transfer-157',levels),null);
assert.equal(unit.vocabulary.length,12);
assert.equal(unit.dialogue.length,9);
assert.equal(unit.grammar.length,2);
assert.equal(unit.tasks.length,10);
assert.equal(new Set(unit.tasks.map(x=>x.id)).size,10);
assert.ok(n.reading.french.trim().split(/\s+/).length>=270);
assert.equal(n.reading.questions.length,3);
assert.equal(n.evidence.length,2);
assert.equal(n.crossQuestions.length,2);
assert.equal(n.listening.length,6);
assert.equal(u42OriginalEvidence(id)?.sources.length,2);
assert.equal(listeningQuestionsForU42(unit).length,6);
assert.equal(u42ProductionChoices(id)?.fromSources.model,n.writingChoices.fromSources.model);
assert.equal(originalOralResponseU42(id)?.model,n.oral.model);
assert.equal(U42_REVISION_GUIDES[id]?.length,3);
for(const mode of ['fromListening','fromSources','fromDebate'] as const){
 const target=b2WritingTarget(id,mode);assert.ok(target?.min&&target.max>target.min);
 assert.equal(b2WritingLengthReview(id,mode,Array(target.min).fill('mot').join(' ')).status,'within');
 assert.ok(n.writingChoices[mode].model.length>490);
}
for(const q of [...n.reading.questions,...n.crossQuestions,...n.listening]){
 assert.ok(q.options.includes(q.answer));
 assert.equal(new Set(q.options).size,q.options.length);
 assert.ok(q.explanation.length>45);
}
const oral=originalU31OralJourney(id),listen=originalU30Listening(id);
assert.ok(oral&&listen);
assert.equal(oral.curated,true);
assert.equal(oral.stages.length,7);
assert.equal(oral.decisions.length,3);
assert.equal(oral.documents.length,2);
assert.equal(oral.reading?.title,n.reading.title);
assert.equal(oral.u30DecisionCount,listen.decisions.length);
for(const d of oral.decisions){
 assert.ok(d.choices.includes(d.answer));
 assert.equal(evaluateU31Decision(d,d.answer).supported,true);
 for(const option of d.choices.filter(x=>x!==d.answer))
  assert.equal(evaluateU31Decision(d,option).supported,false);
}
console.log('Original B2 157 media-verification lesson PASS: one 9-turn source-owned chapter, 270+ French reading words, two distinct original documents, 10 active recall tasks, six listening questions, three structured writing modes, curated seven-stage oral; all historical 250 lessons and 198 readings retained, no CEFR claim.');
