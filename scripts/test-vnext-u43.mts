import assert from 'node:assert/strict';
import {ORIGINAL_FRENCH_U22_COURSE} from '../app/src/core/unified/u22-course.ts';
import {ORIGINAL_U22_CONNECTED_READINGS,u22ProductionChoices} from '../app/src/core/unified/u22-material.ts';
import {ORIGINAL_B1_READINGS,validateOriginalB1Readings} from '../app/src/core/unified/u10-readings.ts';
import {validateU22OriginalCourse} from '../app/src/core/unified/u22-course.ts';
import {ORIGINAL_B1_UNITS} from '../app/src/core/unified/u10-course.ts';
import {listeningQuestionsForOriginalCourse,validateB1Listening} from '../app/src/core/unified/u10-listening.ts';

const lessons=ORIGINAL_FRENCH_U22_COURSE;
assert.equal(lessons.length,244,'Keep 94 original lessons and 150 historical transfers');
assert.equal(ORIGINAL_U22_CONNECTED_READINGS.length,192,'Keep 192 connected reading records');
assert.equal(new Set(lessons.map(x=>x.id)).size,244,'No duplicate original lesson IDs');
assert.deepEqual(validateU22OriginalCourse(),[],'Original unified source contracts unchanged');
assert.deepEqual(validateOriginalB1Readings(),[],'Original reading keys and content remain valid');

const reviewed=[
 'a1-17','a1-18','a1-19','a1-20',
 'a2-19','a2-20','a2-21','a2-22',
 'b1-01','b1-02','b1-03','b1-04',
 'b1-05','b1-06','b1-07','b1-08'
];
let detailedDistractors=0;
for(const id of reviewed){
 const unit=lessons.find(x=>x.id===id);
 assert.ok(unit,'Use actual canonical original lesson '+id);
 for(const [i,task] of unit!.tasks.entries())
  assert.equal(task.id,id+'-task-'+String(i+1).padStart(2,'0'),
   'Previously assigned academic IDs must not change');
 const tasks=unit!.tasks.filter(t=>t.misconceptionFeedback);
 assert.equal(tasks.length,1,'One carefully authored misconception case per selected lesson');
 for(const task of tasks){
  assert.equal(task.type,'choice');
  const reasons=Object.entries(task.misconceptionFeedback!);
  assert.equal(reasons.length,2,'Explain both original incorrect options');
  for(const [wrong,why] of reasons){
   assert.ok(task.options.includes(wrong)&&wrong!==task.answer,
    'Exact original distractor, never the correct answer');
   assert.ok(why.length>=55,'Individual source-grounded correction rather than generic feedback');
   detailedDistractors++;
  }
 }
}
assert.equal(detailedDistractors,32);

assert.equal(ORIGINAL_B1_READINGS.length,14);
let frenchWords=0,deepChecks=0;
for(const [index,reading] of ORIGINAL_B1_READINGS.entries()){
 const id='b1-'+String(index+1).padStart(2,'0');
 assert.equal(reading.unitId,id);
 const words=reading.french.trim().split(/\s+/).length;
 assert.ok(words>=185,'Longer connected B1 passage with natural context: '+id);
 assert.ok(reading.french.includes('\n\n'),'Keep contextual reading in two connected paragraphs');
 assert.equal(reading.questions.length,2,'Do not replace historic answer keys');
 for(const q of reading.questions){
  assert.ok(q.options.includes(q.answer),'Authentic original answer key remains selectable');
  assert.ok(q.explanation.length>=55);
 }
 assert.ok(reading.questions.some(q=>q.prompt.length>=60),
  'At least one cross-context comprehension request per text');
 frenchWords+=words;deepChecks++;
}
assert.deepEqual(validateB1Listening(),[],'Preserve original keyed listening contracts');
let deeperListening=0;
for(const unit of ORIGINAL_B1_UNITS){
 const items=listeningQuestionsForOriginalCourse(unit);
 assert.equal(items.length,2,'Keep two original listening questions per B1 lesson');
 const revised=items.filter(item=>item.prompt.length>=72&&item.explanation.length>=90);
 assert.equal(revised.length,1,'One genuine listening inference from each authored dialogue');
 for(const item of items)assert.ok(item.options.includes(item.answer),'Listening answer key remains original');
 deeperListening+=revised.length;
}
assert.equal(deeperListening,14);
for(const id of ['transfer-121','transfer-123','transfer-128','transfer-133','transfer-135']){
 const material=u22ProductionChoices(id);
 assert.ok(material,'Unchanged canonical advanced production source '+id);
 assert.ok(material!.fromSources.prompt.length>=270,'Original source question plus different-context independent writing');
 assert.ok(material!.fromDebate.prompt.length>=175,'Original debate plus authored audience objection');
 assert.ok(material!.fromSources.model.length>100,'Original source example not discarded');
}
console.log(JSON.stringify({
 schema:'thiepn-french-u43-source-quality',status:'PASS',
 originalLessons:lessons.length,originalConnectedReadings:ORIGINAL_U22_CONNECTED_READINGS.length,
 sourceReviewedTasks:reviewed.length,authoredIncorrectOptionReasons:detailedDistractors,
 longerB1Readings:deepChecks,b1FrenchWords:frenchWords,earlyB2IndependentCases:5,sourceLinkedListeningInferences:deeperListening,
 nativeReviewWrites:false,cefrCertification:false
}));
