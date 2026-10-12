import assert from 'node:assert/strict';
import {A1_FULL_UNITS,getA1FullUnit,validateA1FullCourse,suggestedA1Unit,a1PracticeStatus} from '../app/src/core/unified/u6-a1-course.ts';
import {checkPracticeAnswer} from '../app/src/core/unified/u2-grammar.ts';
import {SOURCES} from '../app/src/core/unified/source.ts';

// Focused original curriculum contracts; run only on demand. No CI qualification or production acceptance.
assert.deepEqual(validateA1FullCourse(),[]);
assert.equal(A1_FULL_UNITS.length,12);
const ids=new Set<string>(),taskIds=new Set<string>();
let totalExercises=0,totalVocabulary=0,totalTurns=0,totalGrammar=0;
for(const [i,unit] of A1_FULL_UNITS.entries()){
 assert.equal(unit.order,i+1);
 assert.equal(unit.id,'a1-'+String(i+1).padStart(2,'0'));
 assert.equal(unit.source.source,'original');
 assert.equal(unit.source.rights,'original-owned');
 assert.equal(unit.source.sourceRevision,SOURCES.original.revision);
 assert.ok(unit.source.qualifiedId.startsWith('fru1:original@'));
 assert.ok(!ids.has(unit.id));ids.add(unit.id);
 assert.deepEqual(unit.prerequisites,i===0?[]:[A1_FULL_UNITS[i-1].id]);
 assert.equal(unit.tasks.length,10);
 assert.equal(unit.vocabulary.length,12);
 assert.equal(unit.dialogue.length,5);
 assert.ok(unit.grammar.length>=2);
 assert.ok(unit.grammar.every(g=>g.examples.length>=2&&g.explanation.length>=100&&g.correction.every(x=>x.length>0)));
 assert.ok(unit.writing.criteria.length>=3&&unit.writing.model.length>=50);
 for(const task of unit.tasks){
  assert.ok(!taskIds.has(task.id));taskIds.add(task.id);
  assert.ok(checkPracticeAnswer(task.answer,task.answer),task.id+' must be checkable');
  assert.ok(task.explanation.length>=22);
  if(task.type==='choice'||task.type==='reading'){
   assert.ok(task.options.includes(task.answer));
   assert.ok(task.options.length>=3);
  }
  if(task.type==='order'){
   assert.notEqual(task.options.join(' '),task.answer);
   assert.equal(task.options.slice().sort().join(' / '),
    task.answer.split(' ').sort().join(' / '),'same word tiles as model '+task.id);
  }
 }
 assert.ok(unit.tasks.some(t=>t.type==='fill'));
 assert.ok(unit.tasks.some(t=>t.type==='reading'));
 assert.ok(unit.tasks.some(t=>t.type==='choice'));
 assert.ok(unit.tasks.some(t=>t.type==='order'));
 totalExercises+=unit.tasks.length;totalVocabulary+=unit.vocabulary.length;
 totalTurns+=unit.dialogue.length;totalGrammar+=unit.grammar.length;
}
assert.equal(totalExercises,120);
assert.equal(totalVocabulary,144);
assert.equal(totalTurns,60);
assert.ok(totalGrammar>=24);
assert.equal(suggestedA1Unit(new Set())?.id,'a1-01');
assert.equal(suggestedA1Unit(new Set(['a1-01','a1-02']))?.id,'a1-03');
assert.equal(suggestedA1Unit(ids),null);
const unit=A1_FULL_UNITS[0];
assert.deepEqual(a1PracticeStatus(unit.id,new Map()),{
 lessonId:unit.id,correct:0,total:10,remaining:10,locallyPracticed:false
});
const practised=new Map(unit.tasks.map(t=>[t.id,true]));
assert.equal(a1PracticeStatus(unit.id,practised)?.locallyPracticed,true);
assert.equal(a1PracticeStatus(unit.id,practised)?.remaining,0);
assert.equal(a1PracticeStatus('missing',practised),null);
assert.equal(getA1FullUnit('a1-12')?.title,'Invitations and the near future');
console.log(JSON.stringify({schema:'thiepn-french-u6-a1-content',status:'PASS',fullLessons:12,grammarBlocks:totalGrammar,
 lexicalEntries:totalVocabulary,dialogueTurns:totalTurns,originalTasks:totalExercises,
 authoritativeWrites:false,legacyCopyrightImported:false}));
