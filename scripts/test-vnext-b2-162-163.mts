import assert from 'node:assert/strict';
import {ORIGINAL_FRENCH_U22_COURSE} from '../app/src/core/unified/u22-course.ts';
import {ORIGINAL_U22_CONNECTED_READINGS} from '../app/src/core/unified/u22-material.ts';
import {
 ORIGINAL_FRENCH_U42_COURSE,U42_B2_CASES,U46_B2_SEQUENCE,U49_B2_EXTENSION,
 U50_B2_SEQUENCE,U51_B2_INTERPERSONAL,U52_B2_PROFESSIONAL,validateU42Course
} from '../app/src/core/unified/u42-course.ts';
import {
 ORIGINAL_U42_CONNECTED_READINGS,u42OriginalEvidence,listeningQuestionsForU42,
 u42ProductionChoices,originalOralResponseU42
} from '../app/src/core/unified/u42-material.ts';
import {U52_B2_GRAMMAR} from '../app/src/core/unified/u52-b2-grammar.ts';
import {
 ORIGINAL_REGISTRY_COUNTS,ORIGINAL_REGISTRY_ENTRIES,
 getOriginalMaterial,getOriginalCatalogEntry
} from '../app/src/core/unified/u23-registry.ts';
import {
 originalU31OralJourney,U31_CURATED_JOURNEYS,
 validateU31SourceAnchors,evaluateU31Decision
} from '../app/src/core/unified/u31-oral.ts';
import {originalU30Listening} from '../app/src/core/unified/u30-listening.ts';
import {
 b2WritingTarget,b2WritingLengthReview
} from '../app/src/core/unified/u43-b2-writing-support.ts';
import {
 buildFrenchCourseNavigation,parseFrenchCourseLocation
} from '../app/src/core/unified/cur02-level-nav.ts';
import {U42_REVISION_GUIDES} from '../app/src/core/unified/u42-revision-guides.ts';

assert.deepEqual(validateU42Course(),[],'Every original Course unit must validate');
assert.deepEqual(validateU31SourceAnchors(),[],'Existing source-owned oral anchors must resolve');
assert.equal(ORIGINAL_FRENCH_U42_COURSE.length,257);
assert.equal(ORIGINAL_U42_CONNECTED_READINGS.length,205);
assert.equal(ORIGINAL_REGISTRY_ENTRIES.length,257);
assert.deepEqual(ORIGINAL_REGISTRY_COUNTS,{lessons:257,connectedReadings:205});
assert.equal(new Set(ORIGINAL_REGISTRY_ENTRIES.map(x=>x.qualifiedId)).size,257);
const historicalLessons=[
 ...ORIGINAL_FRENCH_U22_COURSE,...U42_B2_CASES.map(x=>x.unit),
 ...U46_B2_SEQUENCE.map(x=>x.unit),...U49_B2_EXTENSION.map(x=>x.unit),
 ...U50_B2_SEQUENCE.map(x=>x.unit),...U51_B2_INTERPERSONAL.map(x=>x.unit)
];
const historicalReadings=[
 ...ORIGINAL_U22_CONNECTED_READINGS,...U42_B2_CASES.map(x=>x.reading),
 ...U46_B2_SEQUENCE.map(x=>x.reading),...U49_B2_EXTENSION.map(x=>x.reading),
 ...U50_B2_SEQUENCE.map(x=>x.reading),...U51_B2_INTERPERSONAL.map(x=>x.reading)
];
assert.equal(historicalLessons.length,255);
assert.equal(historicalReadings.length,203);
for(let i=0;i<255;i++)assert.equal(ORIGINAL_FRENCH_U42_COURSE[i],historicalLessons[i],
 'Changed historical source-owned lesson object at '+i);
for(let i=0;i<203;i++)assert.equal(ORIGINAL_U42_CONNECTED_READINGS[i],historicalReadings[i],
 'Changed historical source-owned reading object at '+i);
assert.deepEqual(U52_B2_PROFESSIONAL.map(x=>x.unit.id),['transfer-162','transfer-163']);
assert.equal(ORIGINAL_FRENCH_U42_COURSE[254].id,'transfer-161');
assert.equal(ORIGINAL_U42_CONNECTED_READINGS[202].unitId,'transfer-161');
const nav=buildFrenchCourseNavigation(ORIGINAL_REGISTRY_ENTRIES);
assert.equal(nav.find(x=>x.level==='B2')?.lessons.length,73);
for(const [i,story] of U52_B2_PROFESSIONAL.entries()){
 const n=162+i,id='transfer-'+n,unit=story.unit;
 assert.equal(ORIGINAL_FRENCH_U42_COURSE[255+i],unit);
 assert.equal(ORIGINAL_U42_CONNECTED_READINGS[203+i],story.reading);
 assert.equal(unit.order,n+94);
 assert.equal(unit.prerequisites.join(),'transfer-'+(n-1));
 assert.equal(unit.source.source,'original');
 assert.equal(unit.source.rights,'original-owned');
 assert.ok(unit.source.qualifiedId.endsWith(':session:u52-'+id));
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
 assert.equal(unit.grammar,U52_B2_GRAMMAR[id]);
 assert.equal(unit.grammar.length,2);
 assert.ok(unit.grammar.every(x=>x.explanation.length>=530&&x.correction[2].length>=150));
 assert.ok(story.reading.french.trim().split(/\s+/).length>=355);
 assert.equal(story.reading.french.split('\n\n').length,3);
 assert.equal(story.reading.questions.length,3);
 assert.equal(story.evidence.length,2);
 assert.ok(story.evidence.every(x=>x.french.length>=280));
 assert.equal(story.crossQuestions.length,2);
 assert.equal(story.listening.length,6);
 assert.equal(u42OriginalEvidence(id)?.sources.length,2);
 assert.equal(listeningQuestionsForU42(unit).length,6);
 assert.equal(originalOralResponseU42(id)?.model,story.oral.model);
 assert.equal(u42ProductionChoices(id)?.fromSources.model,story.writingChoices.fromSources.model);
 assert.equal(U42_REVISION_GUIDES[id]?.length,3);
 for(const mode of ['fromListening','fromSources','fromDebate'] as const){
  const target=b2WritingTarget(id,mode);
  assert.ok(target&&target.min>=190&&target.max>target.min);
  assert.equal(b2WritingLengthReview(id,mode,'').status,'empty');
  assert.equal(b2WritingLengthReview(id,mode,Array(target.min).fill('mot').join(' ')).status,'within');
  assert.ok(story.writingChoices[mode].model.length>=740);
 }
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
 for(const d of oral.decisions){
  assert.equal(evaluateU31Decision(d,d.answer).supported,true);
  for(const wrong of d.choices.filter(x=>x!==d.answer))
   assert.equal(evaluateU31Decision(d,wrong).supported,false);
 }
}
const [interview,handover]=U52_B2_PROFESSIONAL;
assert.ok(interview.unit.dialogue.some(t=>t.fr.includes('C’est le total de l’équipe')));
assert.ok(interview.reading.french.includes('quatre-vingts'));
assert.ok(interview.writingChoices.fromSources.prompt.includes('employer'));
assert.ok(interview.evidence[0].french.includes('80 dossiers'));
assert.ok(interview.evidence[1].french.includes('ni une offre ferme'));
assert.ok(handover.unit.dialogue.some(t=>t.fr.includes('Si j’ai bien compris, je transmets')));
assert.ok(handover.reading.french.includes('six fiches'));
assert.ok(handover.evidence[1].french.includes('aucun envoi sur le site'));
assert.ok(handover.writingChoices.fromSources.model.includes('aucune mise en ligne'));
console.log('Original B2 professional 162–163 source contract PASS: 255 historical original lesson objects and 203 readings preserved, 2 extensive French professional narrative chapters, 4 fictional portfolio/brief/meeting documents, 18 original dialogue turns, 20 active-recall tasks, 12 source-specific listening questions, 6 independently authored extended writing tasks, 2 U31 curated journeys, no invented recorded audio or CEFR grade.');
