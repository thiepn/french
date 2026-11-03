import assert from 'node:assert/strict';
import {ORIGINAL_FRENCH_U22_COURSE} from '../app/src/core/unified/u22-course.ts';
import {ORIGINAL_U22_CONNECTED_READINGS} from '../app/src/core/unified/u22-material.ts';
import {
 ORIGINAL_FRENCH_U42_COURSE,U42_B2_CASES,U46_B2_SEQUENCE,U49_B2_EXTENSION,U50_B2_SEQUENCE,
 validateU42Course
} from '../app/src/core/unified/u42-course.ts';
import {ORIGINAL_U42_CONNECTED_READINGS,u42OriginalEvidence,listeningQuestionsForU42,
 u42ProductionChoices,originalOralResponseU42} from '../app/src/core/unified/u42-material.ts';
import {U50_B2_GRAMMAR} from '../app/src/core/unified/u50-b2-grammar.ts';
import {ORIGINAL_REGISTRY_COUNTS,ORIGINAL_REGISTRY_ENTRIES,getOriginalMaterial,getOriginalCatalogEntry} from '../app/src/core/unified/u23-registry.ts';
import {originalU31OralJourney,U31_CURATED_JOURNEYS,validateU31SourceAnchors,evaluateU31Decision} from '../app/src/core/unified/u31-oral.ts';
import {originalU30Listening} from '../app/src/core/unified/u30-listening.ts';
import {b2WritingTarget,b2WritingLengthReview} from '../app/src/core/unified/u43-b2-writing-support.ts';
import {buildFrenchCourseNavigation,parseFrenchCourseLocation} from '../app/src/core/unified/cur02-level-nav.ts';
import {U42_REVISION_GUIDES} from '../app/src/core/unified/u42-revision-guides.ts';

assert.deepEqual(validateU42Course(),[],'Original full course validation');
assert.deepEqual(validateU31SourceAnchors(),[],'U31 source anchors must match exact owned French dialogue');
assert.equal(ORIGINAL_FRENCH_U22_COURSE.length,244);
assert.equal(ORIGINAL_U22_CONNECTED_READINGS.length,192);
assert.equal(ORIGINAL_FRENCH_U42_COURSE.length,259);
assert.equal(ORIGINAL_U42_CONNECTED_READINGS.length,207);
assert.deepEqual(ORIGINAL_REGISTRY_COUNTS,{lessons:259,connectedReadings:207});
assert.equal(new Set(ORIGINAL_REGISTRY_ENTRIES.map(e=>e.qualifiedId)).size,259);
const previous=[...ORIGINAL_FRENCH_U22_COURSE,...U42_B2_CASES.map(s=>s.unit),
 ...U46_B2_SEQUENCE.map(s=>s.unit),...U49_B2_EXTENSION.map(s=>s.unit)];
const priorReadings=[...ORIGINAL_U22_CONNECTED_READINGS,...U42_B2_CASES.map(s=>s.reading),
 ...U46_B2_SEQUENCE.map(s=>s.reading),...U49_B2_EXTENSION.map(s=>s.reading)];
assert.equal(previous.length,251);
assert.equal(priorReadings.length,199);
for(let i=0;i<251;i++)assert.equal(ORIGINAL_FRENCH_U42_COURSE[i],previous[i],
 'Historical original lesson object/reference changed at position '+i);
for(let i=0;i<199;i++)assert.equal(ORIGINAL_U42_CONNECTED_READINGS[i],priorReadings[i],
 'Historical original reading object/reference changed at position '+i);
assert.deepEqual(U50_B2_SEQUENCE.map(s=>s.unit.id),['transfer-158','transfer-159']);
const levels=buildFrenchCourseNavigation(ORIGINAL_REGISTRY_ENTRIES);
assert.equal(levels.find(l=>l.level==='B2')?.lessons.length,75);
assert.equal(ORIGINAL_FRENCH_U42_COURSE[250].id,'transfer-157');
assert.equal(ORIGINAL_U42_CONNECTED_READINGS[198].unitId,'transfer-157');
for(const [i,study] of U50_B2_SEQUENCE.entries()){
 const n=158+i,id='transfer-'+n,{unit,reading}=study;
 assert.equal(ORIGINAL_FRENCH_U42_COURSE[251+i],unit);
 assert.equal(ORIGINAL_U42_CONNECTED_READINGS[199+i],reading);
 assert.equal(unit.order,252+i);
 assert.equal(unit.prerequisites.join(),'transfer-'+(n-1));
 assert.ok(unit.source.qualifiedId.endsWith(':session:u50-'+id));
 assert.equal(unit.source.rights,'original-owned');
 assert.equal(getOriginalMaterial(id)?.unit,unit);
 assert.equal(getOriginalMaterial(id)?.reading,reading);
 assert.equal(getOriginalCatalogEntry(id)?.level,'Early B2');
 assert.equal(getOriginalCatalogEntry(id)?.sourceComparison,true);
 assert.deepEqual(parseFrenchCourseLocation('#course/B2/'+id,levels),{level:'B2',id});
 assert.equal(parseFrenchCourseLocation('#course/C1/'+id,levels),null);
 assert.equal(unit.vocabulary.length,12);
 assert.equal(unit.dialogue.length,9);
 assert.equal(unit.grammar,U50_B2_GRAMMAR[id]);
 assert.equal(unit.grammar.length,2);
 assert.ok(unit.grammar.every(g=>g.explanation.length>=350&&g.correction[2].length>=130));
 assert.equal(unit.tasks.length,10);
 assert.deepEqual([...new Set(unit.tasks.map(q=>q.type))].sort(),['choice','fill','order','reading']);
 assert.equal(new Set(unit.tasks.map(t=>t.id)).size,10);
 assert.ok(reading.french.trim().split(/\s+/).length>=310);
 assert.equal(reading.french.split('\n\n').length,3);
 assert.equal(reading.questions.length,3);
 assert.equal(study.evidence.length,2);
 assert.ok(study.evidence.every(e=>e.french.length>=220));
 assert.equal(study.crossQuestions.length,2);
 assert.equal(study.listening.length,6);
 assert.equal(u42OriginalEvidence(id)?.sources.length,2);
 assert.equal(listeningQuestionsForU42(unit).length,6);
 assert.equal(originalOralResponseU42(id)?.model,study.oral.model);
 assert.equal(u42ProductionChoices(id)?.fromSources.model,study.writingChoices.fromSources.model);
 assert.equal(U42_REVISION_GUIDES[id]?.length,3);
 for(const mode of ['fromListening','fromSources','fromDebate'] as const){
  const target=b2WritingTarget(id,mode);assert.ok(target);
  assert.equal(b2WritingLengthReview(id,mode,'').status,'empty');
  assert.equal(b2WritingLengthReview(id,mode,Array(target.min).fill('mot').join(' ')).status,'within');
  assert.ok(study.writingChoices[mode].model.length>=600);
 }
 for(const q of [...study.crossQuestions,...study.listening,...reading.questions]){
  assert.equal(q.options.length,3);
  assert.equal(new Set(q.options).size,3);
  assert.ok(q.options.includes(q.answer));
  assert.ok(q.explanation.length>=45);
 }
 assert.ok(U31_CURATED_JOURNEYS.includes(id));
 const oral=originalU31OralJourney(id),u30=originalU30Listening(id);
 assert.ok(oral&&u30);
 assert.equal(oral.curated,true);
 assert.equal(oral.stages.length,7);
 assert.equal(oral.decisions.length,3);
 assert.equal(oral.documents.length,2);
 assert.equal(oral.u30DecisionCount,u30.decisions.length);
 for(const item of oral.decisions){
  assert.equal(evaluateU31Decision(item,item.answer).supported,true);
  for(const wrong of item.choices.filter(v=>v!==item.answer))
   assert.equal(evaluateU31Decision(item,wrong).supported,false);
 }
}
const [first,second]=U50_B2_SEQUENCE;
const e157=U49_B2_EXTENSION[0];
assert.ok(e157.unit.dialogue.some(t=>t.fr.includes('deux prochains week-ends')));
assert.ok(first.unit.dialogue.some(t=>t.fr.includes('250 mètres')));
assert.ok(first.unit.dialogue.some(t=>t.fr.includes('barrières')));
assert.ok(second.unit.dialogue.some(t=>t.fr.includes('vendredi à dix-sept heures trente')));
assert.ok(second.unit.dialogue.some(t=>t.fr.includes('réservée par téléphone')));
assert.ok(first.reading.french.includes('une observation ponctuelle'));
assert.ok(second.reading.french.includes('jeudi à huit heures'));
assert.ok(second.reading.french.includes('vendredi'));
assert.ok(second.writingChoices.fromDebate.prompt.includes('accus'));
console.log('Original 157–159 connected B2 T7 source sequence PASS: original 251 lesson and 199 reading objects preserved; 2 new long evidence-over-time chapters, 4 distinct documents, 18 dialogue turns, 20 recalled questions, 12 listening questions, 6 extended French writing tasks, curated U31 oral journeys and source-bound historical corrections; no invented ASR or CEFR award.');
