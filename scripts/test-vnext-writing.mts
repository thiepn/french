import assert from 'node:assert/strict';
import type {SentenceExercise} from '../app/src/core/content/loader.ts';
import {freshWritingState,writingExercises,currentWritingExercise,revealWritingSupport,completeWritingAttempt,safeWritingState} from '../app/src/core/writing/session.ts';
const source:SentenceExercise[]=[
  {id:'p12-001',type:'complete',frame:'avoir besoin',context:'test',prompt:'Complete',expected:'J’ai besoin de temps.',alternatives:[],required:['besoin']},
  {id:'p12-007',type:'cue',frame:'apprendre',context:'test',prompt:'Cue',expected:'J’apprends.',alternatives:[],required:['apprends']},
  {id:'p12-013',type:'translate',frame:'permettre',context:'test',prompt:'Translate',expected:'Il permet.',alternatives:[],required:['permet']},
  {id:'p12-019',type:'transform',frame:'changer',context:'test',prompt:'Transform',expected:'Il change.',alternatives:[],required:['change']},
  {id:'p12-025',type:'transfer',frame:'tenir compte',context:'test',prompt:'Transfer',expected:'Il faut tenir compte.',alternatives:[],required:['compte']}
];
const pack={exercises:source};
assert.deepEqual(writingExercises(pack,'phrase').map(x=>x.id),['p12-001','p12-007']);
assert.deepEqual(writingExercises(pack,'sentence').map(x=>x.id),['p12-013','p12-019']);
assert.deepEqual(writingExercises(pack,'transfer').map(x=>x.id),['p12-025']);
let state=freshWritingState();
assert.equal(currentWritingExercise(pack,state,'phrase')?.id,'p12-001');
state=revealWritingSupport(state,'phrase',1);
state=revealWritingSupport(state,'phrase',2);
state=revealWritingSupport(state,'phrase',1);
assert.equal(state.modes.phrase.support,2,'support level cannot be cleared to gain unsupported credit');
state=completeWritingAttempt(pack,state,'phrase','p12-001','matched','exact',1700000000000);
assert.equal(state.modes.phrase.index,1);
assert.equal(state.modes.phrase.support,0);
assert.equal(state.history[0].support,2);
assert.equal(currentWritingExercise(pack,state,'phrase')?.id,'p12-007');
assert.throws(()=>completeWritingAttempt(pack,state,'phrase','p12-001','matched','exact'),/STALE_WRITING_EXERCISE/);
state=completeWritingAttempt(pack,state,'phrase','p12-007','needs-practice','target',1700000000001);
assert.equal(currentWritingExercise(pack,state,'phrase')?.id,'p12-001','rotates without inventing new exercises');
assert.equal(state.modes.sentence.index,0,'independent track cursor');
const loaded=safeWritingState(JSON.parse(JSON.stringify(state)));
assert.equal(loaded.history[0].outcome,'needs-practice');
assert.equal(JSON.stringify(loaded).includes('J’ai besoin de temps.'),false,'learner answer is not saved');
assert.equal(safeWritingState({schema:'bad'}).history.length,0);
console.log(JSON.stringify({schema:'french-p37i-c1-writing',ok:true,checks:13,noTypedTranscripts:true}));
