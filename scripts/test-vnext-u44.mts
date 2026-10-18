import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import {A1_FULL_UNITS,validateA1FullCourse} from '../app/src/core/unified/u6-a1-course.ts';
import {A1_COMPLETE_UNITS,validateCompleteA1Course} from '../app/src/core/unified/u7-a1-course.ts';
import {
 originalA1SoundContrasts,validateOriginalA1SoundContrasts,
 listeningQuestions,listeningDialogueText,validateListeningCatalog
} from '../app/src/core/unified/u7-listening.ts';
import {ORIGINAL_FRENCH_U22_COURSE} from '../app/src/core/unified/u22-course.ts';
import {ORIGINAL_U22_CONNECTED_READINGS} from '../app/src/core/unified/u22-material.ts';

assert.deepEqual(validateA1FullCourse(),[],'Original 12 foundational lessons stay valid');
assert.deepEqual(validateCompleteA1Course(),[],'Original 24 A1 lessons stay valid');
assert.deepEqual(validateOriginalA1SoundContrasts(),[],'Original context-grounded sound pairs are complete');
assert.deepEqual(validateListeningCatalog(A1_COMPLETE_UNITS),[],'Original Listen task schema unchanged');
assert.equal(ORIGINAL_FRENCH_U22_COURSE.length,244,'Preserve 94 full lessons + 150 original transfers');
assert.equal(ORIGINAL_U22_CONNECTED_READINGS.length,192,'Preserve 192 original connected readings');
assert.equal(A1_FULL_UNITS.length,12);
assert.equal(A1_COMPLETE_UNITS.length,24);
const originalTaskIds=A1_FULL_UNITS.flatMap(unit=>unit.tasks.map(t=>t.id));
assert.equal(new Set(originalTaskIds).size,originalTaskIds.length);
let contrasts=0,extraListening=0,wrongChoices=0;
for(const [i,unit] of A1_FULL_UNITS.entries()){
 const id='a1-'+String(i+1).padStart(2,'0');
 assert.equal(unit.id,id,'Original teaching order and identity');
 assert.equal(unit.dialogue.length,5,'Historical author-created dialogues stay intact');
 assert.equal(unit.source.source,'original');
 assert.equal(unit.source.rights,'original-owned');
 for(const [index,task] of unit.tasks.entries())
  assert.equal(task.id,id+'-task-'+String(index+1).padStart(2,'0'),
   'Historical practice IDs and ordinal meaning untouched');
 const items=originalA1SoundContrasts(id);
 assert.equal(items.length,2,'Two meaningful context-bound contrasts');
 for(const contrast of items){
  assert.ok(contrast.a.french!==contrast.b.french);
  assert.ok(contrast.a.meaning!==contrast.b.meaning);
  assert.ok(contrast.a.reading.includes('/')&&contrast.b.reading.includes('/'));
  assert.ok(contrast.guidance.length>=95&&contrast.selfCheck.length>=60,
   'Actionable phonological correction and independent reflection');
  contrasts++;
 }
 const firstOriginal=unit.tasks.find(task=>task.type==='reading');
 assert.ok(firstOriginal);
 const questions=listeningQuestions(unit);
 assert.equal(questions.length,2);
 assert.equal(questions[0].id,id+'-listen-1','Do not repurpose the historical first listening task');
 assert.equal(questions[0].prompt,firstOriginal!.prompt);
 assert.equal(questions[0].answer,firstOriginal!.answer);
 assert.deepEqual(questions[0].options,firstOriginal!.options);
 const newQuestion=questions[1];
 assert.equal(newQuestion.id,id+'-listen-2','Append, never overwrite');
 assert.equal(newQuestion.options.length,3);
 assert.ok(newQuestion.options.includes(newQuestion.answer));
 assert.ok(newQuestion.explanation.length>=55);
 assert.equal(Object.keys(newQuestion.misconceptionFeedback??{}).length,2);
 for(const [wrong,reason] of Object.entries(newQuestion.misconceptionFeedback??{})){
  assert.ok(newQuestion.options.includes(wrong)&&wrong!==newQuestion.answer);
  assert.ok(reason.length>=55);
  wrongChoices++;
 }
 assert.equal(listeningDialogueText(unit),unit.dialogue.map(row=>row.fr).join(' '));
 extraListening++;
}
assert.equal(contrasts,24);assert.equal(extraListening,12);assert.equal(wrongChoices,24);
assert.equal(A1_COMPLETE_UNITS.reduce((sum,u)=>sum+listeningQuestions(u).length,0),60);
for(const unit of A1_COMPLETE_UNITS.slice(12)){
 assert.equal(listeningQuestions(unit).length,3,'U45 appends a third question, retaining U44 lessons and IDs');
 assert.equal(originalA1SoundContrasts(unit.id).length,2,'U45 extends the same source-owned phonology catalog');
}
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const ui=readFileSync(resolve(root,'app/src/routes/u7-listening-panel.ts'),'utf8');
assert.ok(ui.includes('originalA1SoundContrasts(unit.id)'));
assert.ok(ui.includes('speech.lang=')||ui.includes("speech.lang='fr-FR'"));
assert.ok(ui.includes('const repair=question.misconceptionFeedback?.[select.value]'));
assert.ok(ui.includes('activeSpeech!==speech'),'Late synth events must not overwrite subsequent playback');
assert.ok(ui.includes('No microphone, recording, transcription or pronunciation grade.'));
console.log(JSON.stringify({schema:'thiepn-french-u44-original-a1-phonology',
 status:'PASS',sourceContrasts:contrasts,extraA1Listening:extraListening,
 individualWrongOptionReasons:wrongChoices,totalA1Listening:48,
 originalFrenchCourse:244,originalConnectedReadings:192,
 deviceSynthesizedSpeechOnly:true,pronunciationGraded:false,fsrsWrites:false,
 noRealDevicePlaybackWasTested:true
}));
