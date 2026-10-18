import assert from 'node:assert/strict';
import {ORIGINAL_A1_A2_B1_COURSE,validateOriginalB1Course} from '../app/src/core/unified/u10-course.ts';
import {B1_DEPTH_UNITS,ORIGINAL_FRENCH_U11_UNITS,
 getU11OriginalUnit,suggestedU11OriginalUnit,u11PracticeStatus,
 validateU11OriginalCourse} from '../app/src/core/unified/u11-course.ts';
import {validateB1DepthUnits} from '../app/src/core/unified/u11-b1-model.ts';
import {ORIGINAL_B1_READINGS} from '../app/src/core/unified/u10-readings.ts';
import {U11_NEW_READINGS,FULL_ORIGINAL_B1_READINGS,getFullB1Reading,validateU11Readings} from '../app/src/core/unified/u11-readings.ts';
import {listeningQuestionsForU11Course,validateU11Listening} from '../app/src/core/unified/u11-listening.ts';
import {listeningDialogueText} from '../app/src/core/unified/u7-listening.ts';
import {checkPracticeAnswer} from '../app/src/core/unified/u2-grammar.ts';
import {SOURCES} from '../app/src/core/unified/source.ts';

// Optional focused source content check; not wired to CI, production or accounts.
assert.deepEqual(validateOriginalB1Course(),[],'Inherited original Course remains valid');
assert.deepEqual(validateB1DepthUnits(B1_DEPTH_UNITS),[]);
assert.deepEqual(validateU11OriginalCourse(),[]);
assert.deepEqual(validateU11Readings(),[]);
assert.deepEqual(validateU11Listening(),[]);
assert.equal(ORIGINAL_A1_A2_B1_COURSE.length,66);
assert.equal(ORIGINAL_FRENCH_U11_UNITS.length,80);
assert.equal(B1_DEPTH_UNITS.length,14);
assert.deepEqual(ORIGINAL_FRENCH_U11_UNITS.slice(0,66).map(u=>u.source.qualifiedId),
 ORIGINAL_A1_A2_B1_COURSE.map(u=>u.source.qualifiedId));
assert.equal(ORIGINAL_B1_READINGS.length,14);
assert.equal(U11_NEW_READINGS.length,14);
assert.equal(FULL_ORIGINAL_B1_READINGS.length,28);
let grammar=0,vocabulary=0,turns=0,exercises=0,readingWords=0,readingQs=0,listeningQs=0;
const seenTasks=new Set<string>();
for(const [i,u] of B1_DEPTH_UNITS.entries()){
 const id='b1-'+String(i+15).padStart(2,'0');
 assert.equal(u.id,id);assert.equal(u.order,i+67);
 assert.deepEqual(u.prerequisites,['b1-'+String(i+14).padStart(2,'0')]);
 assert.equal(u.source.source,'original');assert.equal(u.source.rights,'original-owned');
 assert.equal(u.source.sourceRevision,SOURCES.original.revision);
 assert.equal(u.source.qualifiedId,'fru1:original@'+SOURCES.original.revision+':session:u11-'+id);
 assert.equal(u.grammar.length,2);assert.equal(u.vocabulary.length,12);
 assert.equal(u.dialogue.length,5);assert.equal(u.tasks.length,10);
 assert.ok(u.writing.criteria.length>=3&&u.writing.model.length>=160);
 for(const g of u.grammar)
  assert.ok(g.explanation.length>=140&&g.examples.length>=2&&g.correction.every(part=>part.length>=6));
 const modes=new Set<string>();
 for(const t of u.tasks){
  assert.ok(!seenTasks.has(t.id));seenTasks.add(t.id);modes.add(t.type);
  assert.ok(t.explanation.length>=35&&t.prompt&&t.answer&&t.focus);
  assert.ok(checkPracticeAnswer(t.answer,t.answer));
  if(t.type==='choice'||t.type==='reading')assert.ok(t.options.length>=3&&t.options.includes(t.answer));
  if(t.type==='order'){
   const norm=(s:string)=>s.trim().split(/\s+/).sort().join('|');
   assert.equal(norm(t.options.join(' ')),norm(t.answer),t.id+' token parity');
   assert.notEqual(t.options.join(' '),t.answer,t.id+' word order must be scrambled');
  }
 }
 for(const k of ['fill','reading','choice','order'])assert.ok(modes.has(k),id+' missing '+k);
 const reading=getFullB1Reading(id);assert.ok(reading);
 assert.equal(reading.french.split(/\n\s*\n/).length,3);
 const count=reading.french.trim().split(/\s+/).length;assert.ok(count>=190);
 assert.equal(reading.questions.length,3);
 for(const q of reading.questions)
  assert.ok(q.options.length===3&&q.options.includes(q.answer)&&q.explanation.length>=40);
 const listening=listeningQuestionsForU11Course(u);assert.equal(listening.length,2);
 assert.equal(listeningDialogueText(u),u.dialogue.map(d=>d.fr).join(' '));
 for(const q of listening)assert.ok(q.options.length===3&&q.options.includes(q.answer)&&q.explanation.length>=35);
 grammar+=u.grammar.length;vocabulary+=u.vocabulary.length;turns+=u.dialogue.length;
 exercises+=u.tasks.length;readingWords+=count;readingQs+=reading.questions.length;listeningQs+=listening.length;
}
assert.equal(grammar,28);assert.equal(vocabulary,168);assert.equal(turns,70);
assert.equal(exercises,140);assert.equal(readingWords,3121);
assert.equal(readingQs,42);assert.equal(listeningQs,28);
assert.equal(getU11OriginalUnit('b1-28')?.title,'B1 independent synthesis capstone');
assert.equal(getU11OriginalUnit('missing'),null);
assert.equal(suggestedU11OriginalUnit(new Set(ORIGINAL_A1_A2_B1_COURSE.map(u=>u.id)))?.id,'b1-15');
assert.equal(suggestedU11OriginalUnit(new Set(ORIGINAL_FRENCH_U11_UNITS.map(u=>u.id))),null);
const first=B1_DEPTH_UNITS[0];
assert.equal(u11PracticeStatus(first.id,new Map())?.remaining,10);
assert.equal(u11PracticeStatus(first.id,new Map(first.tasks.map(t=>[t.id,true])))?.locallyPracticed,true);
console.log(JSON.stringify({schema:'thiepn-french-u11-original-b1',status:'PASS',totalLessons:80,
 newLessons:14,grammar,vocabulary,turns,exercises,readingWords,readingQs,listeningQs,
 certifiedCEFR:false,authoritativeProgressWrites:false}));
