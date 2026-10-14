import assert from 'node:assert/strict';
import {A1_FULL_UNITS} from '../app/src/core/unified/u6-a1-course.ts';
import {A1_COMPLETE_UNITS,validateCompleteA1Course} from '../app/src/core/unified/u7-a1-course.ts';
import {ORIGINAL_A2_UNITS,ORIGINAL_FRENCH_UNITS,getOriginalFrenchUnit,
 suggestedOriginalFrenchUnit,originalFrenchPracticeStatus,validateOriginalFrenchCourse} from '../app/src/core/unified/u8-course.ts';
import {validateA2Units} from '../app/src/core/unified/u8-a2-model.ts';
import {listeningQuestionsForFrenchUnit,validateOriginalA2Listening} from '../app/src/core/unified/u8-listening.ts';
import {checkPracticeAnswer} from '../app/src/core/unified/u2-grammar.ts';
import {SOURCES} from '../app/src/core/unified/source.ts';

// Opt-in deterministic content test, not part of broad CI or release certification.
assert.deepEqual(validateCompleteA1Course(),[],'A1 content must remain unchanged and qualified');
assert.deepEqual(validateA2Units(ORIGINAL_A2_UNITS),[]);
assert.deepEqual(validateOriginalFrenchCourse(),[]);
assert.deepEqual(validateOriginalA2Listening(),[]);
assert.equal(A1_FULL_UNITS.length,12);
assert.equal(A1_COMPLETE_UNITS.length,24);
assert.equal(ORIGINAL_A2_UNITS.length,14);
assert.equal(ORIGINAL_FRENCH_UNITS.length,38);
assert.deepEqual(ORIGINAL_FRENCH_UNITS.slice(0,24).map(u=>u.source.qualifiedId),
 A1_COMPLETE_UNITS.map(u=>u.source.qualifiedId));
const seen=new Set<string>(),tasksSeen=new Set<string>();
let vocabulary=0,dialogue=0,grammar=0,recall=0,listening=0;
for(const [i,unit] of ORIGINAL_A2_UNITS.entries()){
 const identity='a2-'+String(i+1).padStart(2,'0');
 assert.equal(unit.id,identity);
 assert.equal(unit.order,i+25);
 assert.deepEqual(unit.prerequisites,[i?'a2-'+String(i).padStart(2,'0'):'a1-24']);
 assert.equal(unit.source.source,'original');
 assert.equal(unit.source.rights,'original-owned');
 assert.equal(unit.source.sourceRevision,SOURCES.original.revision);
 assert.equal(unit.source.qualifiedId,'fru1:original@'+SOURCES.original.revision+':session:u8-'+identity);
 assert.ok(!seen.has(identity));seen.add(identity);
 assert.equal(unit.vocabulary.length,12);
 assert.ok(unit.dialogue.length>=5);
 assert.equal(unit.tasks.length,["a2-05","a2-06"].includes(unit.id)?12:10);
  for(const [index,task] of unit.tasks.slice(0,10).entries())assert.equal(task.id,unit.id+'-task-'+String(index+1).padStart(2,'0'),'Historical exercise IDs remain unchanged');
 assert.equal(unit.grammar.length,2);
 assert.ok(unit.grammar.every(g=>g.explanation.length>=120&&g.examples.length>=2&&
  g.correction.every(line=>line.length>0)));
 assert.ok(unit.writing.criteria.length>=3&&unit.writing.model.length>=65);
 const modes=new Set<string>();
 for(const task of unit.tasks){
  assert.ok(!tasksSeen.has(task.id));tasksSeen.add(task.id);
  modes.add(task.type);
  assert.ok(task.answer&&task.explanation.length>=25&&task.focus);
  assert.equal(checkPracticeAnswer(task.answer,task.answer),true);
  if(task.type==='reading'||task.type==='choice'){
   assert.ok(task.options.length>=3&&task.options.includes(task.answer));
  }
  if(task.type==='order'){
   const sortTokens=(tokens:string)=>tokens.split(/\s+/).sort().join('|');
   assert.equal(sortTokens(task.options.join(' ')),sortTokens(task.answer),'Order tiles '+task.id);
   assert.notEqual(task.options.join(' '),task.answer);
  }
 }
 for(const mode of ['fill','reading','choice','order'])assert.ok(modes.has(mode),unit.id+' must have '+mode);
 const questions=listeningQuestionsForFrenchUnit(unit);
 assert.equal(questions.length,2);
 for(const q of questions){
  assert.ok(q.options.includes(q.answer)&&q.options.length>=3&&q.explanation.length>=25);
  assert.ok(checkPracticeAnswer(q.answer,q.answer));
 }
 vocabulary+=unit.vocabulary.length;dialogue+=unit.dialogue.length;
 grammar+=unit.grammar.length;recall+=unit.tasks.length;listening+=questions.length;
}
assert.equal(vocabulary,168);
assert.ok(dialogue>=70);
assert.equal(grammar,28);
assert.equal(recall,144);
assert.equal(listening,28);
assert.equal(getOriginalFrenchUnit('a2-14')?.title,'A2 narrative capstone: from memory to message');
assert.equal(getOriginalFrenchUnit('a1-24')?.title,'A1 capstone — a day in France');
assert.equal(getOriginalFrenchUnit('invalid'),null);
assert.equal(suggestedOriginalFrenchUnit(new Set(A1_COMPLETE_UNITS.map(u=>u.id)))?.id,'a2-01');
assert.equal(suggestedOriginalFrenchUnit(new Set(ORIGINAL_FRENCH_UNITS.map(u=>u.id))),null);
const first=ORIGINAL_A2_UNITS[0];
assert.equal(originalFrenchPracticeStatus(first.id,new Map())?.correct,0);
assert.equal(originalFrenchPracticeStatus(first.id,new Map(first.tasks.map(t=>[t.id,true])))?.locallyPracticed,true);
assert.equal(originalFrenchPracticeStatus('invalid',new Map()),null);
console.log(JSON.stringify({schema:'thiepn-french-u8-original-a2',status:'PASS',
 totalFullLessons:38,newA2Lessons:14,vocabulary,dialogue,grammar,recall,listening,
 originalContent:true,canonicalWrites:false,gradeClaims:false}));
