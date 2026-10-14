import assert from 'node:assert/strict';
import {A1_FULL_UNITS,validateA1FullCourse} from '../app/src/core/unified/u6-a1-course.ts';
import {A1_COMPLETE_UNITS,validateCompleteA1Course,getA1CompleteUnit,suggestedCompleteA1Unit,completeA1PracticeStatus} from '../app/src/core/unified/u7-a1-course.ts';
import {listeningQuestions,listeningDialogueText,validateListeningCatalog} from '../app/src/core/unified/u7-listening.ts';
import {checkPracticeAnswer} from '../app/src/core/unified/u2-grammar.ts';
import {SOURCES} from '../app/src/core/unified/source.ts';

// Opt-in content-only test: npm run test:vnext:u7. No browser, CI, deployment or personal data.
assert.deepEqual(validateA1FullCourse(),[],'U6 exact original twelve must stay qualified');
assert.deepEqual(validateCompleteA1Course(),[],'All 24 A1 units must validate');
assert.deepEqual(validateListeningCatalog(A1_COMPLETE_UNITS),[]);
assert.equal(A1_FULL_UNITS.length,12);
assert.equal(A1_COMPLETE_UNITS.length,24);
assert.deepEqual(A1_COMPLETE_UNITS.slice(0,12).map(u=>u.source.qualifiedId),
 A1_FULL_UNITS.map(u=>u.source.qualifiedId),'U6 lesson custody remains identical');
let vocabulary=0,turns=0,grammar=0,tasks=0,listening=0;
const allIds=new Set<string>(),allTaskIds=new Set<string>();
for(const [i,unit] of A1_COMPLETE_UNITS.entries()){
 const order=i+1,id='a1-'+String(order).padStart(2,'0');
 assert.equal(unit.id,id);
 assert.equal(unit.order,order);
 assert.deepEqual(unit.prerequisites,i?['a1-'+String(order-1).padStart(2,'0')]:[]);
 assert.equal(unit.source.source,'original');
 assert.equal(unit.source.rights,'original-owned');
 assert.equal(unit.source.sourceRevision,SOURCES.original.revision);
 assert.equal(unit.source.qualifiedId,'fru1:original@'+SOURCES.original.revision+
  ':session:'+(order<=12?'u6-':'u7-')+unit.id);
 assert.ok(!allIds.has(unit.id));allIds.add(unit.id);
 assert.equal(unit.vocabulary.length,12);
 assert.equal(unit.dialogue.length,5);
 assert.equal(unit.tasks.length,["a1-06","a1-07"].includes(unit.id)?12:10);
  for(const [index,task] of unit.tasks.slice(0,10).entries())assert.equal(task.id,unit.id+'-task-'+String(index+1).padStart(2,'0'),'Historical exercise IDs remain unchanged');
 assert.ok(unit.grammar.length>=2);
 assert.ok(unit.grammar.every(g=>g.explanation.length>=100&&g.examples.length>=2&&
  g.correction.every(text=>text.trim().length>0)));
 assert.ok(unit.writing.criteria.length>=3&&unit.writing.model.length>=50);
 const kinds=new Set<string>();
 for(const task of unit.tasks){
  assert.ok(!allTaskIds.has(task.id));allTaskIds.add(task.id);
  assert.ok(checkPracticeAnswer(task.answer,task.answer));
  assert.ok(task.explanation.length>=22&&task.focus);
  kinds.add(task.type);
  if(task.type==='choice'||task.type==='reading'){
   assert.ok(task.options.length>=3&&task.options.includes(task.answer));
  }
  if(task.type==='order'){
   assert.notEqual(task.options.join(' '),task.answer);
   assert.equal(task.options.flatMap(piece=>piece.split(' ')).sort().join('|'),
    task.answer.split(' ').sort().join('|'),'Original ordering exercise tiles '+task.id);
  }
 }
 assert.deepEqual([...['choice','fill','reading','order'].filter(t=>!kinds.has(t))],[]);
 const questions=listeningQuestions(unit);
 assert.equal(questions.length,2,'U44 preserves listen-1 and adds one dialogue-grounded U6 listen-2');
 assert.equal(listeningDialogueText(unit),unit.dialogue.map(d=>d.fr).join(' '));
 for(const q of questions){
  assert.ok(q.prompt&&q.explanation.length>=20&&q.options.length>=3);
  assert.ok(q.options.includes(q.answer)&&checkPracticeAnswer(q.answer,q.answer));
  assert.ok(!q.prompt.toLowerCase().includes('pronunciation grade'));
 }
 vocabulary+=unit.vocabulary.length;turns+=unit.dialogue.length;
 grammar+=unit.grammar.length;tasks+=unit.tasks.length;listening+=questions.length;
}
assert.equal(vocabulary,288);
assert.equal(turns,120);
assert.equal(tasks,244);
assert.equal(listening,48);
assert.ok(grammar>=49);
assert.equal(getA1CompleteUnit('a1-24')?.title,'A1 capstone — a day in France');
assert.equal(getA1CompleteUnit('not-found'),null);
assert.equal(suggestedCompleteA1Unit(new Set(A1_COMPLETE_UNITS.slice(0,12).map(u=>u.id)))?.id,'a1-13');
assert.equal(suggestedCompleteA1Unit(new Set(A1_COMPLETE_UNITS.map(u=>u.id))),null);
const firstNew=A1_COMPLETE_UNITS[12];
assert.equal(completeA1PracticeStatus(firstNew.id,new Map())?.remaining,10);
assert.equal(completeA1PracticeStatus(firstNew.id,new Map(firstNew.tasks.map(t=>[t.id,true])))?.locallyPracticed,true);
assert.equal(completeA1PracticeStatus('not-found',new Map()),null);
console.log(JSON.stringify({schema:'thiepn-french-u7-original-a1',status:'PASS',
 allFullLessons:24,newFullLessons:12,totalVocabulary:vocabulary,totalDialogueTurns:turns,
 totalGrammarBlocks:grammar,totalRecallTasks:tasks,totalListeningQuestions:listening,
 deviceSpeechOnly:true,pronunciationScored:false,progressWrites:false}));
