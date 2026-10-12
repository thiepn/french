import assert from 'node:assert/strict';
import {ORIGINAL_FRENCH_UNITS,validateOriginalFrenchCourse} from '../app/src/core/unified/u8-course.ts';
import {PRACTICAL_A2_UNITS,FULL_ORIGINAL_FRENCH_COURSE,getFullFrenchUnit,
 suggestedFullFrenchUnit,fullFrenchPracticeStatus,validateFullFrenchCourse} from '../app/src/core/unified/u9-course.ts';
import {validatePracticalA2Units} from '../app/src/core/unified/u9-a2-model.ts';
import {listeningQuestionsForFullFrenchCourse,validateU9Listening} from '../app/src/core/unified/u9-listening.ts';
import {listeningDialogueText} from '../app/src/core/unified/u7-listening.ts';
import {checkPracticeAnswer} from '../app/src/core/unified/u2-grammar.ts';
import {SOURCES} from '../app/src/core/unified/source.ts';

// Optional content-only check; no browser, CI dispatch, remote writes or learner records.
assert.deepEqual(validateOriginalFrenchCourse(),[],'Prior U6–U8 content contracts must stand');
assert.deepEqual(validatePracticalA2Units(PRACTICAL_A2_UNITS),[]);
assert.deepEqual(validateFullFrenchCourse(),[]);
assert.deepEqual(validateU9Listening(),[]);
assert.equal(ORIGINAL_FRENCH_UNITS.length,38);
assert.equal(PRACTICAL_A2_UNITS.length,14);
assert.equal(FULL_ORIGINAL_FRENCH_COURSE.length,52);
assert.deepEqual(FULL_ORIGINAL_FRENCH_COURSE.slice(0,38).map(u=>u.source.qualifiedId),
 ORIGINAL_FRENCH_UNITS.map(u=>u.source.qualifiedId),'Prior original source identities unchanged');

const ids=new Set<string>(),taskIds=new Set<string>();
let vocab=0,grammar=0,dialogue=0,exercises=0,questions=0;
for(const [offset,unit] of PRACTICAL_A2_UNITS.entries()){
 const id='a2-'+String(offset+15).padStart(2,'0');
 assert.equal(unit.id,id);
 assert.equal(unit.order,39+offset);
 assert.deepEqual(unit.prerequisites,['a2-'+String(offset+14).padStart(2,'0')]);
 assert.equal(unit.source.source,'original');
 assert.equal(unit.source.rights,'original-owned');
 assert.equal(unit.source.sourceRevision,SOURCES.original.revision);
 assert.equal(unit.source.qualifiedId,'fru1:original@'+SOURCES.original.revision+':session:u9-'+id);
 assert.ok(!ids.has(unit.id));ids.add(unit.id);
 assert.equal(unit.vocabulary.length,12);
 assert.equal(unit.grammar.length,2);
 assert.ok(unit.dialogue.length>=5);
 assert.equal(unit.tasks.length,10);
 assert.ok(unit.grammar.every(g=>g.explanation.length>=120&&g.examples.length>=2&&g.correction.every(t=>t.length>5)));
 assert.ok(unit.writing.model.length>=65&&unit.writing.criteria.length>=3);
 const modes=new Set<string>();
 for(const task of unit.tasks){
  assert.ok(!taskIds.has(task.id));taskIds.add(task.id);
  modes.add(task.type);
  assert.ok(checkPracticeAnswer(task.answer,task.answer),task.id+' model answer must pass native checking');
  assert.ok(task.explanation.length>=25);
  if(task.type==='choice'||task.type==='reading'){
   assert.ok(task.options.length>=3&&task.options.includes(task.answer));
  }
  if(task.type==='order'){
   const sorted=(s:string)=>s.trim().split(/\s+/).sort().join('|');
   assert.equal(sorted(task.options.join(' ')),sorted(task.answer),task.id+' word parity');
   assert.notEqual(task.options.join(' '),task.answer,task.id+' tiles are not preordered');
  }
 }
 for(const type of ['choice','fill','reading','order'])assert.ok(modes.has(type),unit.id+' '+type);
 const listening=listeningQuestionsForFullFrenchCourse(unit);
 assert.equal(listening.length,2);
 assert.equal(listeningDialogueText(unit),unit.dialogue.map(d=>d.fr).join(' '));
 for(const q of listening)assert.ok(q.options.length>=3&&q.options.includes(q.answer)&&q.explanation.length>=25);
 vocab+=unit.vocabulary.length;grammar+=unit.grammar.length;dialogue+=unit.dialogue.length;
 exercises+=unit.tasks.length;questions+=listening.length;
}
assert.equal(vocab,168);
assert.equal(grammar,28);
assert.equal(dialogue,70);
assert.equal(exercises,140);
assert.equal(questions,28);
assert.equal(getFullFrenchUnit('a2-28')?.title,'A2 practical capstone: independent decisions');
assert.equal(getFullFrenchUnit('a1-24')?.title,'A1 capstone — a day in France');
assert.equal(getFullFrenchUnit('missing'),null);
const older=new Set(ORIGINAL_FRENCH_UNITS.map(u=>u.id));
assert.equal(suggestedFullFrenchUnit(older)?.id,'a2-15');
assert.equal(suggestedFullFrenchUnit(new Set(FULL_ORIGINAL_FRENCH_COURSE.map(u=>u.id))),null);
const first=PRACTICAL_A2_UNITS[0];
assert.equal(fullFrenchPracticeStatus(first.id,new Map())?.remaining,10);
assert.equal(fullFrenchPracticeStatus(first.id,new Map(first.tasks.map(t=>[t.id,true])))?.locallyPracticed,true);
assert.equal(fullFrenchPracticeStatus('missing',new Map()),null);
console.log(JSON.stringify({schema:'thiepn-french-u9-original-a2',status:'PASS',
 originalFullLessons:52,newA2Lessons:14,grammar,vocab,dialogue,exercises,questions,
 nativeAuthorityWrites:false,verifiedProficiency:false}));
