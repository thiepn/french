import assert from 'node:assert/strict';
import {FULL_ORIGINAL_FRENCH_COURSE,validateFullFrenchCourse} from '../app/src/core/unified/u9-course.ts';
import {ORIGINAL_B1_UNITS,ORIGINAL_A1_A2_B1_COURSE,getOriginalCourseUnit,
 suggestedOriginalCourseUnit,originalCoursePracticeStatus,validateOriginalB1Course} from '../app/src/core/unified/u10-course.ts';
import {validateB1Units} from '../app/src/core/unified/u10-b1-model.ts';
import {ORIGINAL_B1_READINGS,getOriginalB1Reading,validateOriginalB1Readings} from '../app/src/core/unified/u10-readings.ts';
import {listeningQuestionsForOriginalCourse,validateB1Listening} from '../app/src/core/unified/u10-listening.ts';
import {listeningDialogueText} from '../app/src/core/unified/u7-listening.ts';
import {checkPracticeAnswer} from '../app/src/core/unified/u2-grammar.ts';
import {SOURCES} from '../app/src/core/unified/source.ts';

// Opt-in content-only run; NOT a CI, browser, learner-authority or proficiency qualification.
assert.deepEqual(validateFullFrenchCourse(),[],'All U6–U9 lessons must remain valid');
assert.deepEqual(validateB1Units(ORIGINAL_B1_UNITS),[]);
assert.deepEqual(validateOriginalB1Course(),[]);
assert.deepEqual(validateOriginalB1Readings(),[]);
assert.deepEqual(validateB1Listening(),[]);
assert.equal(FULL_ORIGINAL_FRENCH_COURSE.length,52);
assert.equal(ORIGINAL_B1_UNITS.length,14);
assert.equal(ORIGINAL_A1_A2_B1_COURSE.length,66);
assert.deepEqual(ORIGINAL_A1_A2_B1_COURSE.slice(0,52).map(u=>u.source.qualifiedId),
 FULL_ORIGINAL_FRENCH_COURSE.map(u=>u.source.qualifiedId),'Existing lesson IDs must not change');
let grammar=0,vocabulary=0,dialogue=0,recall=0,readingWords=0,readingChecks=0,listeningChecks=0;
const allTasks=new Set<string>();
for(const [i,unit] of ORIGINAL_B1_UNITS.entries()){
 const id='b1-'+String(i+1).padStart(2,'0');
 assert.equal(unit.id,id);assert.equal(unit.order,i+53);
 assert.deepEqual(unit.prerequisites,[i?'b1-'+String(i).padStart(2,'0'):'a2-28']);
 assert.equal(unit.source.source,'original');assert.equal(unit.source.rights,'original-owned');
 assert.equal(unit.source.sourceRevision,SOURCES.original.revision);
 assert.equal(unit.source.qualifiedId,'fru1:original@'+SOURCES.original.revision+':session:u10-'+id);
 assert.equal(unit.vocabulary.length,12);assert.equal(unit.grammar.length,2);assert.ok(unit.dialogue.length>=5);
 assert.equal(unit.tasks.length,10);assert.ok(unit.writing.criteria.length>=3&&unit.writing.model.length>=125);
 for(const grammarItem of unit.grammar)assert.ok(grammarItem.explanation.length>=125&&
  grammarItem.examples.length>=2&&grammarItem.correction[2].length>=6);
 const kinds=new Set<string>();
 for(const t of unit.tasks){
  assert.ok(!allTasks.has(t.id),t.id);allTasks.add(t.id);
  kinds.add(t.type);
  assert.ok(t.explanation.length>=25&&t.focus&&checkPracticeAnswer(t.answer,t.answer));
  if(t.type==='choice'||t.type==='reading')assert.ok(t.options.length>=3&&t.options.includes(t.answer));
  if(t.type==='order'){
   const order=(v:string)=>v.trim().split(/\s+/).sort().join('|');
   assert.equal(order(t.answer),order(t.options.join(' ')),t.id);
   assert.notEqual(t.options.join(' '),t.answer,t.id);
  }
 }
 for(const k of ['choice','fill','reading','order'])assert.ok(kinds.has(k),id+' missing '+k);
 const reading=getOriginalB1Reading(id);
 assert.ok(reading);assert.equal(reading.questions.length,2);
 const wc=reading.french.trim().split(/\s+/).length;assert.ok(wc>=100);
 for(const q of reading.questions)assert.ok(q.options.length>=3&&q.options.includes(q.answer)&&q.explanation.length>=35);
 const audio=listeningQuestionsForOriginalCourse(unit);
 assert.equal(audio.length,2);
 assert.equal(listeningDialogueText(unit),unit.dialogue.map(d=>d.fr).join(' '));
 for(const item of audio)assert.ok(item.options.includes(item.answer)&&item.explanation.length>=25);
 grammar+=unit.grammar.length;vocabulary+=unit.vocabulary.length;dialogue+=unit.dialogue.length;
 recall+=unit.tasks.length;readingWords+=wc;readingChecks+=reading.questions.length;listeningChecks+=audio.length;
}
assert.equal(vocabulary,168);assert.equal(grammar,28);assert.equal(dialogue,70);
assert.equal(recall,140);assert.equal(readingChecks,28);assert.equal(listeningChecks,28);
assert.ok(readingWords>=1500);
assert.equal(getOriginalCourseUnit('b1-14')?.title,'B1 capstone: explain, read, infer and argue');
assert.equal(getOriginalCourseUnit('a2-28')?.title,'A2 practical capstone: independent decisions');
assert.equal(getOriginalCourseUnit('invalid'),null);
assert.equal(suggestedOriginalCourseUnit(new Set(FULL_ORIGINAL_FRENCH_COURSE.map(u=>u.id)))?.id,'b1-01');
assert.equal(suggestedOriginalCourseUnit(new Set(ORIGINAL_A1_A2_B1_COURSE.map(u=>u.id))),null);
assert.equal(originalCoursePracticeStatus(ORIGINAL_B1_UNITS[0].id,new Map())?.remaining,10);
assert.equal(originalCoursePracticeStatus('invalid',new Map()),null);
console.log(JSON.stringify({schema:'thiepn-french-u10-original-b1',status:'PASS',
 totalOriginalFullLessons:66,newB1Lessons:14,grammar,vocabulary,dialogue,recall,
 readingWords,readingChecks,listeningChecks,authoritativeProgressWrites:false,qualifiedCEFR:false}));
