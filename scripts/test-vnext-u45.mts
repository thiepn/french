import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {A1_COMPLETE_UNITS,validateCompleteA1Course} from '../app/src/core/unified/u7-a1-course.ts';
import {ORIGINAL_FRENCH_U22_COURSE} from '../app/src/core/unified/u22-course.ts';
import {ORIGINAL_U22_CONNECTED_READINGS} from '../app/src/core/unified/u22-material.ts';
import {checkPracticeAnswer} from '../app/src/core/unified/u2-grammar.ts';
import {
 originalA1SoundContrasts,validateOriginalA1SoundContrasts,
 listeningQuestions,listeningDialogueText,validateListeningCatalog
} from '../app/src/core/unified/u7-listening.ts';

assert.deepEqual(validateCompleteA1Course(),[],'Keep original A1 authoring and source provenance');
assert.deepEqual(validateListeningCatalog(A1_COMPLETE_UNITS),[],'Native listening answer authority');
assert.deepEqual(validateOriginalA1SoundContrasts(),[],'All 24 original A1 sound-focused lessons');
assert.equal(ORIGINAL_FRENCH_U22_COURSE.length,244,'94 full lessons plus 150 transfers preserved');
assert.equal(ORIGINAL_U22_CONNECTED_READINGS.length,192,'All historic connected readings preserved');
assert.equal(A1_COMPLETE_UNITS.length,24);
const originalLaterKeys:Readonly<Record<string,readonly [string,string]>>={
 'a1-13':['de la salade','de l’eau'],
 'a1-14':['trente euros','par carte'],
 'a1-15':['trois','neuf euros'],
 'a1-16':['deux','une soupe de légumes'],
 'a1-17':['le matin','visiter le musée'],
 'a1-18':['un appartement','deux'],
 'a1-19':['la ligne quatre','à République'],
 'a1-20':['Martin','le deuxième étage'],
 'a1-21':['dans le sac','appeler Omar'],
 'a1-22':['il travaille','lundi à midi'],
 'a1-23':['une lettre','pour comprendre plus lentement'],
 'a1-24':['le tram est en retard','du pain et une bouteille d’eau']
};
let soundPairs=0,newQuestions=0,specificRepairs=0,questionCount=0;
for(const [index,unit] of A1_COMPLETE_UNITS.entries()){
 const id='a1-'+String(index+1).padStart(2,'0');
 assert.equal(unit.id,id,'Preserve original A1 identity');
 assert.equal(unit.dialogue.length,5,'No original recorded-dialogue fiction');
 assert.equal(unit.source.source,'original');
 assert.equal(unit.source.rights,'original-owned');
 for(const [taskIndex,task] of unit.tasks.entries())
  assert.equal(task.id,id+'-task-'+String(taskIndex+1).padStart(2,'0'),
   'Keep historical original practice task identities');
 const contrasts=originalA1SoundContrasts(id);
 assert.equal(contrasts.length,2,'Two context-authored contrasts per original lesson');
 for(const pair of contrasts){
  assert.ok(pair.a.french!==pair.b.french);
  assert.ok(pair.guidance.length>=95&&pair.selfCheck.length>=60);
  assert.ok(pair.a.meaning&&pair.b.meaning);
  assert.ok(pair.a.reading.includes('/')&&pair.b.reading.includes('/'));
  soundPairs++;
 }
 const listening=listeningQuestions(unit);
 assert.equal(listening.length,index<12?2:3);
 assert.equal(listeningDialogueText(unit),unit.dialogue.map(line=>line.fr).join(' '));
 if(index>=12){
  const old=originalLaterKeys[id];
  assert.ok(old,'All 12 later lessons must retain both original keys');
  assert.equal(listening[0].id,id+'-listen-1');
  assert.equal(listening[1].id,id+'-listen-2');
  assert.equal(listening[0].answer,old[0],'Do not rewrite first keyed answer');
  assert.equal(listening[1].answer,old[1],'Do not rewrite second keyed answer');
  const newItem=listening[2];
  assert.equal(newItem.id,id+'-listen-3','Only append original dialog inference');
  assert.ok(newItem.options.includes(newItem.answer));
  assert.ok(newItem.explanation.length>=60);
  const corrections=Object.entries(newItem.misconceptionFeedback??{});
  assert.equal(corrections.length,2,'Explain each actual wrong listening choice');
  for(const [wrong,why] of corrections){
   assert.ok(wrong!==newItem.answer&&newItem.options.includes(wrong));
   assert.ok(why.length>=55&&checkPracticeAnswer(newItem.answer,newItem.answer));
   specificRepairs++;
  }
  newQuestions++;
 }
 for(const q of listening)assert.ok(q.options.includes(q.answer));
 questionCount+=listening.length;
}
assert.equal(soundPairs,48);
assert.equal(newQuestions,12);
assert.equal(specificRepairs,24);
assert.equal(questionCount,60);
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const panel=readFileSync(resolve(root,'app/src/routes/u7-listening-panel.ts'),'utf8');
assert.ok(panel.includes('originalA1SoundContrasts(unit.id)'),'Reuse the native original Listen stage');
assert.ok(panel.includes('question.misconceptionFeedback?.[select.value]'),'Reuse answer-feedback path');
assert.ok(panel.includes('activeSpeech!==speech'),'Stale TTS callbacks must not override playback');
assert.ok(panel.includes('No microphone, recording, transcription or pronunciation grade.'),
 'No device voice grading or capture claims');
console.log(JSON.stringify({
 schema:'thiepn-french-u45-original-later-a1-phonology',status:'PASS',
 originalCourseUnits:244,connectedReadings:192,a1OriginalUnits:24,
 contextBoundSoundContrasts:soundPairs,additionalLaterListening:newQuestions,
 originalListeningAnswersPreserved:24,authoredWrongOptionReasons:specificRepairs,
 originalA1ListeningQuestions:questionCount,
 humanAudioCertified:false,pronunciationGraded:false,srsGradeWrites:false
}));
