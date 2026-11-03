import assert from 'node:assert/strict';
import {ORIGINAL_FRENCH_U22_COURSE} from '../app/src/core/unified/u22-course.ts';
import {ORIGINAL_U22_CONNECTED_READINGS} from '../app/src/core/unified/u22-material.ts';
import {
 ORIGINAL_FRENCH_U42_COURSE,U42_B2_CASES,U46_B2_SEQUENCE,U49_B2_EXTENSION,
 U50_B2_SEQUENCE,U51_B2_INTERPERSONAL,validateU42Course
} from '../app/src/core/unified/u42-course.ts';
import {ORIGINAL_U42_CONNECTED_READINGS,u42OriginalEvidence,listeningQuestionsForU42,
 u42ProductionChoices,originalOralResponseU42} from '../app/src/core/unified/u42-material.ts';
import {U51_B2_GRAMMAR} from '../app/src/core/unified/u51-b2-grammar.ts';
import {ORIGINAL_REGISTRY_COUNTS,ORIGINAL_REGISTRY_ENTRIES,getOriginalMaterial,
 getOriginalCatalogEntry} from '../app/src/core/unified/u23-registry.ts';
import {originalU31OralJourney,U31_CURATED_JOURNEYS,validateU31SourceAnchors,
 evaluateU31Decision} from '../app/src/core/unified/u31-oral.ts';
import {originalU30Listening} from '../app/src/core/unified/u30-listening.ts';
import {b2WritingTarget,b2WritingLengthReview} from '../app/src/core/unified/u43-b2-writing-support.ts';
import {buildFrenchCourseNavigation,parseFrenchCourseLocation} from '../app/src/core/unified/cur02-level-nav.ts';
import {U42_REVISION_GUIDES} from '../app/src/core/unified/u42-revision-guides.ts';

assert.deepEqual(validateU42Course(),[],'Entire original Course source contract');
assert.deepEqual(validateU31SourceAnchors(),[],'Original French U31 anchors');
assert.equal(ORIGINAL_FRENCH_U42_COURSE.length,261);
assert.equal(ORIGINAL_U42_CONNECTED_READINGS.length,209);
assert.equal(ORIGINAL_REGISTRY_ENTRIES.length,261);
assert.deepEqual(ORIGINAL_REGISTRY_COUNTS,{lessons:261,connectedReadings:209});
assert.equal(new Set(ORIGINAL_REGISTRY_ENTRIES.map(x=>x.qualifiedId)).size,261);
const historicalLessons=[...ORIGINAL_FRENCH_U22_COURSE,...U42_B2_CASES.map(x=>x.unit),
 ...U46_B2_SEQUENCE.map(x=>x.unit),...U49_B2_EXTENSION.map(x=>x.unit),...U50_B2_SEQUENCE.map(x=>x.unit)];
const historicalReadings=[...ORIGINAL_U22_CONNECTED_READINGS,...U42_B2_CASES.map(x=>x.reading),
 ...U46_B2_SEQUENCE.map(x=>x.reading),...U49_B2_EXTENSION.map(x=>x.reading),...U50_B2_SEQUENCE.map(x=>x.reading)];
assert.equal(historicalLessons.length,253);
assert.equal(historicalReadings.length,201);
for(let i=0;i<253;i++)assert.equal(ORIGINAL_FRENCH_U42_COURSE[i],historicalLessons[i],
 'Historical 253 original lesson object changed at '+i);
for(let i=0;i<201;i++)assert.equal(ORIGINAL_U42_CONNECTED_READINGS[i],historicalReadings[i],
 'Historical 201 original reading object changed at '+i);
assert.deepEqual(U51_B2_INTERPERSONAL.map(s=>s.unit.id),['transfer-160','transfer-161']);
const nav=buildFrenchCourseNavigation(ORIGINAL_REGISTRY_ENTRIES);
assert.equal(nav.find(x=>x.level==='B2')?.lessons.length,77);
assert.equal(ORIGINAL_FRENCH_U42_COURSE[252].id,'transfer-159');
assert.equal(ORIGINAL_U42_CONNECTED_READINGS[200].unitId,'transfer-159');
for(const [i,story] of U51_B2_INTERPERSONAL.entries()){
 const n=160+i,id='transfer-'+n,unit=story.unit;
 assert.equal(ORIGINAL_FRENCH_U42_COURSE[253+i],unit);
 assert.equal(ORIGINAL_U42_CONNECTED_READINGS[201+i],story.reading);
 assert.equal(unit.order,n+94);
 assert.equal(unit.prerequisites.join(),'transfer-'+(n-1));
 assert.equal(unit.source.source,'original');
 assert.equal(unit.source.rights,'original-owned');
 assert.ok(unit.source.qualifiedId.endsWith(':session:u51-'+id));
 assert.equal(getOriginalMaterial(id)?.unit,unit);
 assert.equal(getOriginalMaterial(id)?.reading,story.reading);
 assert.equal(getOriginalCatalogEntry(id)?.level,'Early B2');
 assert.equal(getOriginalCatalogEntry(id)?.sourceComparison,true);
 assert.deepEqual(parseFrenchCourseLocation('#course/B2/'+id,nav),{level:'B2',id});
 assert.equal(parseFrenchCourseLocation('#course/C1/'+id,nav),null);
 assert.equal(unit.vocabulary.length,12);
 assert.equal(unit.dialogue.length,9);
 assert.equal(unit.tasks.length,10);
 assert.deepEqual([...new Set(unit.tasks.map(x=>x.type))].sort(),['choice','fill','order','reading']);
 assert.equal(new Set(unit.tasks.map(x=>x.id)).size,10);
 assert.equal(unit.grammar,U51_B2_GRAMMAR[id]);
 assert.equal(unit.grammar.length,2);
 assert.ok(unit.grammar.every(x=>x.explanation.length>=500&&x.correction[2].length>=135));
 assert.ok(story.reading.french.trim().split(/\s+/).length>=340);
 assert.equal(story.reading.french.split('\n\n').length,3);
 assert.equal(story.reading.questions.length,3);
 assert.equal(story.evidence.length,2);
 assert.ok(story.evidence.every(x=>x.french.length>=240));
 assert.equal(story.crossQuestions.length,2);
 assert.equal(story.listening.length,6);
 assert.equal(u42OriginalEvidence(id)?.sources.length,2);
 assert.equal(listeningQuestionsForU42(unit).length,6);
 assert.equal(originalOralResponseU42(id)?.model,story.oral.model);
 assert.equal(u42ProductionChoices(id)?.fromSources.model,story.writingChoices.fromSources.model);
 assert.equal(U42_REVISION_GUIDES[id]?.length,3);
 for(const m of ['fromListening','fromSources','fromDebate'] as const){
  const target=b2WritingTarget(id,m);
  assert.ok(target&&target.min>=180&&target.max>target.min);
  assert.equal(b2WritingLengthReview(id,m,'').status,'empty');
  assert.equal(b2WritingLengthReview(id,m,Array(target.min).fill('mot').join(' ')).status,'within');
  assert.ok(story.writingChoices[m].model.length>=700);
 }
 for(const q of [...story.reading.questions,...story.crossQuestions,...story.listening]){
  assert.equal(q.options.length,3);
  assert.equal(new Set(q.options).size,3);
  assert.ok(q.options.includes(q.answer));
  assert.ok(q.explanation.length>=55);
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
const [first,second]=U51_B2_INTERPERSONAL;
assert.ok(first.unit.dialogue.some(x=>x.fr.includes('je me suis sentie mise à l’écart')));
assert.ok(first.unit.dialogue.some(x=>x.fr.includes('je préfère ne pas en détailler')));
assert.ok(first.reading.french.includes('Nour'));
assert.ok(first.evidence[0].french.includes('non envoyé'));
assert.ok(first.evidence[1].french.includes('sans devoir exposer les raisons'));
assert.ok(second.unit.dialogue.some(x=>x.fr.includes('Si j’avais demandé')));
assert.ok(second.unit.dialogue.some(x=>x.fr.includes('Je suis d’accord pour cette tâche')));
assert.ok(second.evidence[1].french.includes('ne peuvent pas être partagées'));
assert.ok(second.reading.french.includes('Nour'));
assert.ok(second.writingChoices.fromDebate.prompt.includes('free consent'));
assert.ok(second.writingChoices.fromDebate.prompt.includes('counterfactual regret'));
console.log('Original interpersonal B2 160–161 PASS: historical 253 lessons and 201 readings preserved; 2 substantive French narratives, 4 private/consent-bounded texts, 18 original dialogue turns, 12 source-specific listening questions, 6 long independent French writing tasks and 2 original curated seven-stage oral continuations, no fabricated recording or CEFR claim.');
