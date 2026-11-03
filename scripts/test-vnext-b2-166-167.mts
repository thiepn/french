import assert from 'node:assert/strict';
import {ORIGINAL_FRENCH_U22_COURSE} from '../app/src/core/unified/u22-course.ts';
import {ORIGINAL_U22_CONNECTED_READINGS} from '../app/src/core/unified/u22-material.ts';
import {
 ORIGINAL_FRENCH_U42_COURSE,U42_B2_CASES,U46_B2_SEQUENCE,U49_B2_EXTENSION,
 U50_B2_SEQUENCE,U51_B2_INTERPERSONAL,U52_B2_PROFESSIONAL,
 U53_B2_NARRATIVE,U54_B2_MEDIATION,validateU42Course
} from '../app/src/core/unified/u42-course.ts';
import {
 ORIGINAL_U42_CONNECTED_READINGS,u42OriginalEvidence,listeningQuestionsForU42,
 u42ProductionChoices,originalOralResponseU42
} from '../app/src/core/unified/u42-material.ts';
import {U54_B2_GRAMMAR} from '../app/src/core/unified/u54-b2-grammar.ts';
import {
 ORIGINAL_REGISTRY_COUNTS,ORIGINAL_REGISTRY_ENTRIES,
 getOriginalMaterial,getOriginalCatalogEntry
} from '../app/src/core/unified/u23-registry.ts';
import {
 originalU31OralJourney,U31_CURATED_JOURNEYS,validateU31SourceAnchors,
 evaluateU31Decision
} from '../app/src/core/unified/u31-oral.ts';
import {originalU30Listening} from '../app/src/core/unified/u30-listening.ts';
import {b2WritingTarget,b2WritingLengthReview} from '../app/src/core/unified/u43-b2-writing-support.ts';
import {buildFrenchCourseNavigation,parseFrenchCourseLocation} from '../app/src/core/unified/cur02-level-nav.ts';
import {U42_REVISION_GUIDES} from '../app/src/core/unified/u42-revision-guides.ts';

assert.deepEqual(validateU42Course(),[],'Every original unit and qualified source');
assert.deepEqual(validateU31SourceAnchors(),[],'Source-grounded native U31 original turns');
assert.equal(ORIGINAL_FRENCH_U42_COURSE.length,261);
assert.equal(ORIGINAL_U42_CONNECTED_READINGS.length,209);
assert.equal(ORIGINAL_REGISTRY_ENTRIES.length,261);
assert.deepEqual(ORIGINAL_REGISTRY_COUNTS,{lessons:261,connectedReadings:209});
assert.equal(new Set(ORIGINAL_REGISTRY_ENTRIES.map(x=>x.qualifiedId)).size,261);
const beforeLessons=[
 ...ORIGINAL_FRENCH_U22_COURSE,
 ...U42_B2_CASES.map(x=>x.unit),...U46_B2_SEQUENCE.map(x=>x.unit),
 ...U49_B2_EXTENSION.map(x=>x.unit),...U50_B2_SEQUENCE.map(x=>x.unit),
 ...U51_B2_INTERPERSONAL.map(x=>x.unit),...U52_B2_PROFESSIONAL.map(x=>x.unit),
 ...U53_B2_NARRATIVE.map(x=>x.unit)
];
const beforeReadings=[
 ...ORIGINAL_U22_CONNECTED_READINGS,
 ...U42_B2_CASES.map(x=>x.reading),...U46_B2_SEQUENCE.map(x=>x.reading),
 ...U49_B2_EXTENSION.map(x=>x.reading),...U50_B2_SEQUENCE.map(x=>x.reading),
 ...U51_B2_INTERPERSONAL.map(x=>x.reading),...U52_B2_PROFESSIONAL.map(x=>x.reading),
 ...U53_B2_NARRATIVE.map(x=>x.reading)
];
assert.equal(beforeLessons.length,259);
assert.equal(beforeReadings.length,207);
for(let i=0;i<259;i++)assert.equal(ORIGINAL_FRENCH_U42_COURSE[i],beforeLessons[i],'Historical original lesson reference '+i);
for(let i=0;i<207;i++)assert.equal(ORIGINAL_U42_CONNECTED_READINGS[i],beforeReadings[i],'Historical original reading reference '+i);
assert.equal(ORIGINAL_FRENCH_U42_COURSE[258].id,'transfer-165');
assert.equal(ORIGINAL_U42_CONNECTED_READINGS[206].unitId,'transfer-165');
assert.deepEqual(U54_B2_MEDIATION.map(x=>x.unit.id),['transfer-166','transfer-167']);
const nav=buildFrenchCourseNavigation(ORIGINAL_REGISTRY_ENTRIES);
assert.equal(nav.find(x=>x.level==='B2')?.lessons.length,77);
for(const [i,story] of U54_B2_MEDIATION.entries()){
 const n=i+166,id='transfer-'+n,unit=story.unit;
 assert.equal(ORIGINAL_FRENCH_U42_COURSE[259+i],unit);
 assert.equal(ORIGINAL_U42_CONNECTED_READINGS[207+i],story.reading);
 assert.equal(unit.order,n+94);
 assert.equal(unit.prerequisites.join(),'transfer-'+(n-1));
 assert.equal(unit.source.source,'original');
 assert.equal(unit.source.rights,'original-owned');
 assert.ok(unit.source.qualifiedId.endsWith(':session:u54-'+id));
 assert.equal(getOriginalMaterial(id)?.unit,unit);
 assert.equal(getOriginalMaterial(id)?.reading,story.reading);
 assert.equal(getOriginalCatalogEntry(id)?.level,'Early B2');
 assert.equal(getOriginalCatalogEntry(id)?.sourceComparison,true);
 assert.deepEqual(parseFrenchCourseLocation('#course/B2/'+id,nav),{level:'B2',id});
 assert.equal(parseFrenchCourseLocation('#course/C1/'+id,nav),null);
 assert.equal(unit.vocabulary.length,12);
 assert.equal(unit.dialogue.length,9);
 assert.equal(unit.tasks.length,10);
 assert.equal(new Set(unit.tasks.map(x=>x.id)).size,10);
 assert.deepEqual([...new Set(unit.tasks.map(t=>t.type))].sort(),['choice','fill','order','reading']);
 assert.equal(unit.grammar,U54_B2_GRAMMAR[id]);
 assert.equal(unit.grammar.length,2);
 assert.ok(unit.grammar.every(g=>g.explanation.length>=580&&g.correction[2].length>=130));
 assert.ok(story.reading.french.trim().split(/\s+/).length>=375);
 assert.equal(story.reading.french.split('\n\n').length,3);
 assert.equal(story.reading.questions.length,3);
 assert.equal(story.evidence.length,2);
 assert.ok(story.evidence.every(e=>e.french.length>=350));
 assert.equal(story.crossQuestions.length,2);
 assert.equal(story.listening.length,6);
 assert.equal(u42OriginalEvidence(id)?.sources.length,2);
 assert.equal(listeningQuestionsForU42(unit).length,6);
 assert.equal(u42ProductionChoices(id)?.fromSources.model,story.writingChoices.fromSources.model);
 assert.equal(originalOralResponseU42(id)?.model,story.oral.model);
 assert.equal(U42_REVISION_GUIDES[id]?.length,3);
 for(const mode of ['fromListening','fromSources','fromDebate'] as const){
  const target=b2WritingTarget(id,mode);
  assert.ok(target&&target.min>=190&&target.max>target.min);
  assert.equal(b2WritingLengthReview(id,mode,'').status,'empty');
  assert.equal(b2WritingLengthReview(id,mode,Array(target.min).fill('mot').join(' ')).status,'within');
  assert.ok(story.writingChoices[mode].model.length>=950);
  assert.equal(story.writingChoices[mode].criteria.length,3);
 }
 assert.ok(!story.writingChoices.fromSources.criteria.some(c=>c.includes('Attribute each document separately')));
 assert.ok(!story.oral.plan.some(c=>c.includes('Recommend a conditional practical next step')));
 for(const q of [...story.reading.questions,...story.crossQuestions,...story.listening]){
  assert.equal(q.options.length,3);
  assert.equal(new Set(q.options).size,3);
  assert.ok(q.options.includes(q.answer));
  assert.ok(q.explanation.length>=60);
 }
 assert.ok(U31_CURATED_JOURNEYS.includes(id));
 const oral=originalU31OralJourney(id),listen=originalU30Listening(id);
 assert.ok(oral&&listen);
 assert.equal(oral.curated,true);
 assert.equal(oral.stages.length,7);
 assert.equal(oral.decisions.length,3);
 assert.equal(oral.documents.length,2);
 assert.equal(oral.u30DecisionCount,listen.decisions.length);
 for(const choice of oral.decisions){
  assert.equal(evaluateU31Decision(choice,choice.answer).supported,true);
  for(const wrong of choice.choices.filter(x=>x!==choice.answer))
   assert.equal(evaluateU31Decision(choice,wrong).supported,false);
 }
}
const [game,folding]=U54_B2_MEDIATION;
assert.ok(game.unit.dialogue.some(x=>x.fr.includes('une diagonale A–C est donc interdite')));
assert.ok(game.reading.french.includes('trois tours'));
assert.ok(game.reading.french.includes('B–C'));
assert.ok(game.evidence[0].french.includes('Les Quatre Passerelles'));
assert.ok(game.writingChoices.fromSources.criteria.some(x=>x.includes('teach-back')));
assert.ok(folding.unit.dialogue.some(x=>x.fr.includes('du centre')));
assert.ok(folding.reading.french.includes('losange'));
assert.ok(folding.evidence[0].french.includes('Aucun adhésif'));
assert.ok(folding.writingChoices.fromSources.criteria.some(x=>x.includes('spatial')));
assert.notEqual(game.unit.dialogue[0].speaker,folding.unit.dialogue[0].speaker);
console.log('Original B2 166–167 procedural mediation contract PASS: 259 historical lesson objects and 207 reading objects preserved; 2 fully original three-part French readings, 4 invented instruction cards, 18 dialogue turns, 24 contextual vocabulary items, 12 source-specific written-listening checks, 20 recalled practice tasks, 6 original extended independent writing modes, 2 source-anchored U31 oral teach-back journeys. No manufactured French audio, physical performance or CEFR proficiency claim.');
