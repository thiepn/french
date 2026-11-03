import assert from 'node:assert/strict';
import {ORIGINAL_FRENCH_U22_COURSE} from '../app/src/core/unified/u22-course.ts';
import {
 ORIGINAL_FRENCH_U42_COURSE,U42_B2_CASES,U46_B2_SEQUENCE,U49_B2_EXTENSION,U50_B2_SEQUENCE,U51_B2_INTERPERSONAL,U52_B2_PROFESSIONAL,U53_B2_NARRATIVE,U54_B2_MEDIATION,validateU42Course
} from '../app/src/core/unified/u42-course.ts';
import {
 ORIGINAL_U42_CONNECTED_READINGS,u42OriginalEvidence,
 listeningQuestionsForU42,u42ProductionChoices,originalOralResponseU42
} from '../app/src/core/unified/u42-material.ts';
import {ORIGINAL_REGISTRY_ENTRIES,getOriginalMaterial,getOriginalCatalogEntry} from '../app/src/core/unified/u23-registry.ts';
import {CUR02_LEVELS,buildFrenchCourseNavigation,parseFrenchCourseLocation} from '../app/src/core/unified/cur02-level-nav.ts';
assert.equal(ORIGINAL_FRENCH_U22_COURSE.length,244,'244 existing authored lesson identities remain intact');
assert.equal(ORIGINAL_FRENCH_U42_COURSE.length,261);
assert.deepEqual(ORIGINAL_FRENCH_U42_COURSE.slice(0,244),ORIGINAL_FRENCH_U22_COURSE,
 'Original historical teaching material must not be modified');
assert.deepEqual(U42_B2_CASES.map(s=>s.unit.id),['transfer-151','transfer-152','transfer-153']);
assert.deepEqual(validateU42Course(),[],'New B2 lesson authoring and source guards must pass');
assert.deepEqual(ORIGINAL_FRENCH_U42_COURSE.slice(244,247),U42_B2_CASES.map(s=>s.unit),
 'Prior 247 original IDs and lesson objects remain unchanged');
assert.deepEqual(U46_B2_SEQUENCE.map(s=>s.unit.id),['transfer-154','transfer-155','transfer-156']);
assert.equal(ORIGINAL_U42_CONNECTED_READINGS.length,209,'Historical 207 plus new original 166–167 mediation readings');
assert.equal(ORIGINAL_REGISTRY_ENTRIES.length,261);
assert.equal(new Set(ORIGINAL_REGISTRY_ENTRIES.map(e=>e.qualifiedId)).size,261);
const levels=buildFrenchCourseNavigation(ORIGINAL_REGISTRY_ENTRIES);
assert.deepEqual(levels.map(x=>x.level),CUR02_LEVELS);
assert.equal(levels.find(x=>x.level==='B2')?.lessons.length,77);
assert.deepEqual(U49_B2_EXTENSION.map(s=>s.unit.id),['transfer-157']);
assert.deepEqual(U50_B2_SEQUENCE.map(s=>s.unit.id),['transfer-158','transfer-159']);
assert.deepEqual(U51_B2_INTERPERSONAL.map(s=>s.unit.id),['transfer-160','transfer-161']);
assert.deepEqual(U52_B2_PROFESSIONAL.map(s=>s.unit.id),['transfer-162','transfer-163']);
assert.deepEqual(U53_B2_NARRATIVE.map(s=>s.unit.id),['transfer-164','transfer-165']);
assert.deepEqual(U54_B2_MEDIATION.map(s=>s.unit.id),['transfer-166','transfer-167']);
assert.deepEqual(ORIGINAL_FRENCH_U42_COURSE.slice(251,253),U50_B2_SEQUENCE.map(s=>s.unit),'Past 158–159 source lessons preserved');
assert.deepEqual(ORIGINAL_FRENCH_U42_COURSE.slice(244,251).map(s=>s.id),[...U42_B2_CASES,...U46_B2_SEQUENCE,...U49_B2_EXTENSION].map(s=>s.unit.id),'The historical seven advanced original sources stay in their positions');
assert.deepEqual(ORIGINAL_FRENCH_U42_COURSE.slice(244,250).map(s=>s.id),[...U42_B2_CASES,...U46_B2_SEQUENCE].map(s=>s.unit.id),
 'All six original 151–156 source objects stay in their historical positions');
assert.equal(ORIGINAL_U42_CONNECTED_READINGS[198].unitId,'transfer-157');
for(let n=151;n<=167;n++){
 const id='transfer-'+n,lesson=getOriginalMaterial(id),entry=getOriginalCatalogEntry(id);
 assert.ok(lesson&&entry,'New B2 source unavailable '+id);
 assert.equal(entry.level,'Early B2');
 assert.equal(entry.id,id);
 assert.equal(lesson.unit.order,n+94);
 assert.equal(lesson.unit.source.rights,'original-owned');
 assert.equal(lesson.unit.source.localId,(n<=153?'u42-':n<=156?'u46-':n===157?'u49-':n<=159?'u50-':n<=161?'u51-':n<=163?'u52-':n<=165?'u53-':'u54-')+id);
 assert.equal(lesson.unit.prerequisites.join(),'transfer-'+(n-1));
 assert.equal(lesson.unit.vocabulary.length,12);
 assert.equal(lesson.unit.dialogue.length,9);
 assert.equal(lesson.unit.grammar.length,2);
 assert.equal(lesson.unit.tasks.length,10);
 for(const task of lesson.unit.tasks)if(task.type==='choice'||task.type==='reading'){
  assert.equal(task.options.length,3);
  assert.ok(task.options.includes(task.answer),task.id+' missing answer');
 }
 assert.ok((lesson.reading?.french.trim().split(/\s+/).length??0)>=170);
 assert.equal(lesson.reading?.questions.length,3);
 assert.equal(u42OriginalEvidence(id)?.sources.length,2);
 assert.equal(u42OriginalEvidence(id)?.questions.length,2);
 assert.equal(listeningQuestionsForU42(lesson.unit).length,6);
 assert.ok((u42ProductionChoices(id)?.fromSources.model.length??0)>190);
 assert.ok((u42ProductionChoices(id)?.fromListening.model.length??0)>190);
 assert.ok((u42ProductionChoices(id)?.fromDebate.model.length??0)>190);
 assert.ok((originalOralResponseU42(id)?.model.length??0)>115);
 assert.ok(lesson.unit.dialogue.every(line=>line.fr.length>30));
 assert.deepEqual(parseFrenchCourseLocation('#course/B2/'+id,levels),{level:'B2',id});
 assert.equal(parseFrenchCourseLocation('#course/C1/'+id,levels),null);
}
console.log('B2 Course: historical 250 lesson identities and 198 readings preserved; 157–159 form a three-part original fictional media-verification/chronological-correction sequence, no CEFR promotion.');
