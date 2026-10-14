import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {ORIGINAL_FRENCH_U22_COURSE,validateU22OriginalCourse} from '../app/src/core/unified/u22-course.ts';
import {ORIGINAL_U22_CONNECTED_READINGS} from '../app/src/core/unified/u22-material.ts';
import {A1_COMPLETE_UNITS,validateCompleteA1Course} from '../app/src/core/unified/u7-a1-course.ts';
import {
 listeningDialogueText,listeningQuestions,originalA1SoundContrasts,
 originalA1ListeningEvidence,originalA1SpokenTransfer,
 validateListeningCatalog,validateOriginalA1SoundContrasts,
 validateOriginalA1ListeningEvidence,validateOriginalA1SpokenTransfer
} from '../app/src/core/unified/u7-listening.ts';

assert.deepEqual(validateU22OriginalCourse(),[],'Canonical historical original course stays valid');
assert.deepEqual(validateCompleteA1Course(),[],'Original A1 source IDs unchanged');
assert.deepEqual(validateListeningCatalog(A1_COMPLETE_UNITS),[],'Native original listening keys valid');
assert.deepEqual(validateOriginalA1SoundContrasts(),[],'48 original sound comparisons remain intact');
assert.deepEqual(validateOriginalA1ListeningEvidence(A1_COMPLETE_UNITS),[],
 'Every original A1 listening question has exact source dialogue turns');
assert.deepEqual(validateOriginalA1SpokenTransfer(),[],
 'Learner-owned speaking situations remain coherent and source-linked');
assert.equal(ORIGINAL_FRENCH_U22_COURSE.length,244,'Preserve original 94 full lessons and 150 transfers');
assert.equal(ORIGINAL_U22_CONNECTED_READINGS.length,192,'Preserve original connected reading IDs');
assert.equal(A1_COMPLETE_UNITS.length,24);
const priorA1LaterKeys:Readonly<Record<string,readonly [string,string,string]>>={
 'a1-13':['de la salade','de l’eau','de la salade et des œufs'],
 'a1-14':['trente euros','par carte','douze euros'],
 'a1-15':['trois','neuf euros','une bouteille d’eau et un paquet de riz'],
 'a1-16':['deux','une soupe de légumes','le plat du jour et de l’eau'],
 'a1-17':['le matin','visiter le musée','un parapluie'],
 'a1-18':['un appartement','deux','non, Rayan n’a pas encore répondu'],
 'a1-19':['la ligne quatre','à République','changez à République'],
 'a1-20':['Martin','le deuxième étage','la chambre est prête et la clé est donnée'],
 'a1-21':['dans le sac','appeler Omar','le sac'],
 'a1-22':['il travaille','lundi à midi','lundi à midi'],
 'a1-23':['une lettre','pour comprendre plus lentement','elle demande de répéter plus lentement'],
 'a1-24':['le tram est en retard','du pain et une bouteille d’eau','combien ça coûte']
};
let soundPairs=0,sourceReplays=0,independentTasks=0,listeningItems=0;
const taskIds=new Set<string>();
for(const [i,unit] of A1_COMPLETE_UNITS.entries()){
 const id='a1-'+String(i+1).padStart(2,'0');
 assert.equal(unit.id,id);
 assert.equal(unit.dialogue.length,5,'Keep each original authored five-turn exchange');
 assert.equal(unit.source.source,'original');
 assert.equal(unit.source.rights,'original-owned');
 for(const [j,t] of unit.tasks.entries()){
  assert.equal(t.id,id+'-task-'+String(j+1).padStart(2,'0'));
  assert.ok(!taskIds.has(t.id),'No duplicated historical practice IDs');
  taskIds.add(t.id);
 }
 assert.equal(listeningDialogueText(unit),unit.dialogue.map(x=>x.fr).join(' '));
 const comparisons=originalA1SoundContrasts(id);
 assert.equal(comparisons.length,2,'Do not re-invent phonology source IDs');
 for(const item of comparisons){
  assert.ok(item.a.french&&item.b.french&&item.a.reading.includes('/')&&item.b.reading.includes('/'));
  assert.ok(item.guidance.length>=95&&item.selfCheck.length>=60);
  soundPairs++;
 }
 const originalTransfer=originalA1SpokenTransfer(id);
 assert.ok(originalTransfer&&originalTransfer.context.length>=78&&originalTransfer.selfCheck.length>=95,
  'One original non-scored different-context response per lesson');
 independentTasks++;
 const questions=listeningQuestions(unit);
 assert.equal(questions.length,i<12?2:3);
 if(i>=12)assert.deepEqual(questions.map(q=>q.answer),priorA1LaterKeys[id],
  'Preserve both prior A1-13..24 listening answers and U45 listen-3');
 for(const [j,q] of questions.entries()){
  assert.equal(q.id,id+'-listen-'+(j+1),'Question ID unchanged');
  assert.ok(q.options.includes(q.answer));
  const evidence=originalA1ListeningEvidence(unit,q.id);
  assert.ok(evidence.length>=1&&evidence.length<=3,
   'Every question replays one to three original dialogue turns, no new words invented');
  for(const line of evidence)assert.ok(unit.dialogue.includes(line),
   'Transcript replay uses the original source rows by identity');
  sourceReplays++;
  listeningItems++;
 }
}
assert.equal(soundPairs,48);
assert.equal(independentTasks,24);
assert.equal(listeningItems,60);
assert.equal(sourceReplays,60);
assert.equal(originalA1SoundContrasts('a1-05')[0].hearingLimit,'homophone');
assert.equal(originalA1SoundContrasts('a1-06')[1].hearingLimit,'homophone');
assert.equal(A1_COMPLETE_UNITS.find(x=>x.id==='a1-22')?.tasks.find(t=>t.type==='reading'&&
 t.answer==='lundi')?.prompt,'Which alternative day do Hugo and Farah discuss after Sunday is impossible?',
 'Correct an overclaimed finished meeting while preserving the answer key');
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const panel=readFileSync(resolve(root,'app/src/routes/u7-listening-panel.ts'),'utf8');
assert.ok(panel.includes('originalA1ListeningEvidence(unit,question.id)'));
assert.ok(panel.includes('originalA1SpokenTransfer(unit.id)'));
assert.ok(panel.includes("contrast.hearingLimit==='homophone'"));
assert.ok(panel.includes('Replay source exchange'));
assert.ok(panel.includes('Read source exchange'));
assert.ok(panel.includes('const explanation=el('));
assert.ok(panel.includes('explanation.hidden=correct'));
assert.ok(panel.includes("activeSpeech!==speech"));
assert.ok(panel.includes('No microphone, recording, transcription or pronunciation grade.'));
console.log(JSON.stringify({
 schema:'thiepn-french-u46-native-a1-source-integration',status:'PASS',
 originalCourseUnits:244,connectedReadings:192,sourceSoundContrasts:soundPairs,
 learnerOwnedSpeakingTasks:independentTasks,sourceIndexedQuestionReplays:sourceReplays,
 historicalListeningIdsAndKeysIntact:true,totalA1Listening:60,
 recordedHumanAudio:false,pronunciationScored:false,newFSRSWriter:false,
 browserAudioVerified:false
}));
