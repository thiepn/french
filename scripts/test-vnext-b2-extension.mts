import assert from 'node:assert/strict';
import {ORIGINAL_FRENCH_U22_COURSE} from '../app/src/core/unified/u22-course.ts';
import {
 ORIGINAL_FRENCH_U42_COURSE,U42_B2_CASES,U46_B2_SEQUENCE,validateU42Course
} from '../app/src/core/unified/u42-course.ts';
import {
 ORIGINAL_U42_CONNECTED_READINGS,u42OriginalEvidence,
 listeningQuestionsForU42,u42ProductionChoices,originalOralResponseU42
} from '../app/src/core/unified/u42-material.ts';
import {ORIGINAL_REGISTRY_ENTRIES,getOriginalMaterial,getOriginalCatalogEntry} from '../app/src/core/unified/u23-registry.ts';
import {CUR02_LEVELS,buildFrenchCourseNavigation,parseFrenchCourseLocation} from '../app/src/core/unified/cur02-level-nav.ts';
assert.equal(ORIGINAL_FRENCH_U22_COURSE.length,244,'244 existing authored lesson identities remain intact');
assert.equal(ORIGINAL_FRENCH_U42_COURSE.length,250);
assert.deepEqual(ORIGINAL_FRENCH_U42_COURSE.slice(0,244),ORIGINAL_FRENCH_U22_COURSE,
 'Original historical teaching material must not be modified');
assert.deepEqual(U42_B2_CASES.map(s=>s.unit.id),['transfer-151','transfer-152','transfer-153']);
assert.deepEqual(validateU42Course(),[],'New B2 lesson authoring and source guards must pass');
assert.deepEqual(ORIGINAL_FRENCH_U42_COURSE.slice(244,247),U42_B2_CASES.map(s=>s.unit),
 'Prior 247 original IDs and lesson objects remain unchanged');
assert.deepEqual(U46_B2_SEQUENCE.map(s=>s.unit.id),['transfer-154','transfer-155','transfer-156']);
assert.equal(ORIGINAL_U42_CONNECTED_READINGS.length,198,'Six original connected B2 reading texts');
assert.equal(ORIGINAL_REGISTRY_ENTRIES.length,250);
assert.equal(new Set(ORIGINAL_REGISTRY_ENTRIES.map(e=>e.qualifiedId)).size,250);
const levels=buildFrenchCourseNavigation(ORIGINAL_REGISTRY_ENTRIES);
assert.deepEqual(levels.map(x=>x.level),CUR02_LEVELS);
assert.equal(levels.find(x=>x.level==='B2')?.lessons.length,66);
for(let n=151;n<=156;n++){
 const id='transfer-'+n,lesson=getOriginalMaterial(id),entry=getOriginalCatalogEntry(id);
 assert.ok(lesson&&entry,'New B2 source unavailable '+id);
 assert.equal(entry.level,'Early B2');
 assert.equal(entry.id,id);
 assert.equal(lesson.unit.order,n+94);
 assert.equal(lesson.unit.source.rights,'original-owned');
 assert.equal(lesson.unit.source.localId,(n<=153?'u42-':'u46-')+id);
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
console.log('B2 Course extension: three authored source-grounded studies, 244 immutable predecessor lessons, 198 connected readings, 66 early-B2 entries, no CEFR promotion.');
