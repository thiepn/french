import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {A1_COMPLETE_UNITS,validateCompleteA1Course} from '../app/src/core/unified/u7-a1-course.ts';
import {ORIGINAL_FRENCH_U22_COURSE} from '../app/src/core/unified/u22-course.ts';
import {ORIGINAL_U22_CONNECTED_READINGS} from '../app/src/core/unified/u22-material.ts';
import {getOriginalMaterial} from '../app/src/core/unified/u23-registry.ts';
import {
 listeningQuestions,validateListeningCatalog,originalA1SoundContrasts,
 validateOriginalA1SoundContrasts,originalA1ConversationTransfer,
 validateOriginalA1ConversationTransfers,originalA1ConversationRepair
} from '../app/src/core/unified/u7-listening.ts';

assert.deepEqual(validateCompleteA1Course(),[],'Original A1 lessons unchanged');
assert.deepEqual(validateListeningCatalog(A1_COMPLETE_UNITS),[],'Keyed listening catalog and source pointers');
assert.deepEqual(validateOriginalA1SoundContrasts(),[],'48 source-owned sound comparisons');
for(let i=1;i<=24;i++){
 const id='a1-'+String(i).padStart(2,'0');
 const repair=originalA1ConversationRepair(id);
 assert.ok(repair?.misunderstanding&&repair?.responseTask&&repair?.evidenceCheck,
  'Source-linked second-context repair '+id);
}
assert.deepEqual(validateOriginalA1ConversationTransfers(),[],'24 learner-owned conversation contexts');
assert.equal(ORIGINAL_FRENCH_U22_COURSE.length,244,'Original 94 lessons + 150 scenarios unchanged');
assert.equal(ORIGINAL_U22_CONNECTED_READINGS.length,192,'Keep 192 connected reading authorities');
assert.equal(A1_COMPLETE_UNITS.length,24);

const explicitSourceTurns:Readonly<Record<string,number>>={
 'a1-01':1,'a1-02':3,'a1-03':3,'a1-04':3,'a1-05':1,'a1-06':4,
 'a1-07':3,'a1-08':1,'a1-09':3,'a1-10':2,'a1-11':3,'a1-12':3,
 'a1-13':2,'a1-14':4,'a1-15':3,'a1-16':3,'a1-17':4,'a1-18':4,
 'a1-19':3,'a1-20':4,'a1-21':2,'a1-22':4,'a1-23':4,'a1-24':4
};
let soundComparisons=0,sourceQualified=0,totalListening=0,situations=0;
for(const [i,unit] of A1_COMPLETE_UNITS.entries()){
 const id='a1-'+String(i+1).padStart(2,'0');
 assert.equal(unit.id,id);
 assert.equal(unit.dialogue.length,5,'Historical original dialogue turns retained');
 assert.equal(unit.source.source,'original');
 assert.equal(unit.source.rights,'original-owned');
 for(const [index,task] of unit.tasks.entries())
  assert.equal(task.id,id+'-task-'+String(index+1).padStart(2,'0'),'Historical task ID unchanged');
 const sounds=originalA1SoundContrasts(id);
 assert.equal(sounds.length,2,'Two original U44/U45 sound comparisons per lesson');
 soundComparisons+=sounds.length;
 const original=originalA1ConversationTransfer(id);
 assert.ok(original,'Learner-owned scenario in the existing original lesson');
 assert.ok(original!.context.length>=60&&original!.task.length>=65&&original!.check.length>=75);
 assert.ok(original!.relevantTurnIndex>=0&&original!.relevantTurnIndex<5);
 situations++;
 const questions=listeningQuestions(unit),connected=getOriginalMaterial(id)?.listening;
 assert.ok(connected,'Original native registry must expose this specific lesson');
 assert.equal(questions.length,i<12?2:3,'Original A1 question inventory');
 assert.deepEqual(connected!.map(q=>q.id),questions.map(q=>q.id),
  'Original Course/Listen material registry delegates to same canonical questions');
 assert.deepEqual(connected!.map(q=>q.answer),questions.map(q=>q.answer),
  'No shadow keys or source identity changes');
 for(const q of questions)assert.ok(q.options.includes(q.answer));
 const newQuestion=questions[i<12?1:2];
 assert.equal(newQuestion.id,id+'-listen-'+(i<12?2:3));
 assert.equal(newQuestion.sourceTurnIndex,explicitSourceTurns[id],
  'Source repair points at verified original dialogue turn');
 assert.ok(unit.dialogue[newQuestion.sourceTurnIndex!].fr.length>10);
 assert.equal(Object.keys(newQuestion.misconceptionFeedback??{}).length,2);
 for(const [wrong,why] of Object.entries(newQuestion.misconceptionFeedback??{})){
  assert.ok(wrong!==newQuestion.answer&&newQuestion.options.includes(wrong));
  assert.ok(why.length>=40);
 }
 totalListening+=questions.length;sourceQualified++;
}
assert.equal(soundComparisons,48);
assert.equal(situations,24);
assert.equal(totalListening,60);
assert.equal(sourceQualified,24);
const id='a1-22',p=A1_COMPLETE_UNITS.find(unit=>unit.id===id)!;
const schedule=listeningQuestions(p)[1];
assert.equal(schedule.id,'a1-22-listen-2','Historical listening identity retained');
assert.equal(schedule.answer,'lundi à midi','Historical answer key retained');
assert.ok(schedule.prompt.includes('propose'));
assert.ok(schedule.explanation.includes('not a confirmed'));
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const ui=readFileSync(resolve(root,'app/src/routes/u7-listening-panel.ts'),'utf8');
assert.ok(ui.includes('const index=question.sourceTurnIndex'),'Native original-turn navigation exists');
assert.ok(ui.includes('read')&&ui.includes('Replay relevant original turn'));
assert.ok(ui.includes('originalA1ConversationTransfer(unit.id)'),'Reuse existing Listen view');
assert.ok(ui.includes('answerText.hidden=!answerText.hidden'),'Learner chooses when to reveal answer');
assert.ok(ui.includes('speech.onstart=()'),'TTS is not claimed started at request time');
assert.ok(ui.includes('No microphone, recording, transcription or pronunciation grade.'),
 'No artificial acoustic assessment');
console.log(JSON.stringify({schema:'thiepn-french-u46-original-a1-continuity',
 status:'PASS',originalUnits:244,connectedReadings:192,
 a1Lessons:24,soundComparisons,originalListeningQuestions:totalListening,
 directlyLinkedComprehensionSources:sourceQualified,independentSituations:situations,
 actualSpokenGrade:false,actualBrowserAcceptance:false,allAnswersSessionLocal:true
}));
