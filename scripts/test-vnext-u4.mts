import assert from 'node:assert/strict';
import {ORIGINAL_JOURNEYS,validateJourneys,journeyStatus,upcomingInJourney,firstJourneyForLesson} from '../app/src/core/unified/u4-journeys.ts';
import {analyzeAttempt,repairForGrammar,reviewProduction} from '../app/src/core/unified/u4-feedback.ts';
import {practiceEvent,exportPracticeCheckpoint,inspectPracticeCheckpoint,practiceCatalogFingerprint} from '../app/src/core/unified/u4-checkpoints.ts';
import {SOURCES} from '../app/src/core/unified/source.ts';
import {ORIGINAL_PATH_LESSONS} from '../app/src/core/unified/u3-pathways.ts';

assert.equal(ORIGINAL_JOURNEYS.length,4);
assert.deepEqual(validateJourneys(),[]);
assert.ok(ORIGINAL_JOURNEYS.every(j=>j.source==='original'&&j.revision===SOURCES.original.revision&&j.lessonIds.length>=4));
assert.equal(journeyStatus('not-found',new Set()),null);
assert.deepEqual(journeyStatus('first-conversations',new Set())?.remaining,['greetings','cafe','preferences','market']);
assert.equal(journeyStatus('first-conversations',new Set())?.suggestedId,'greetings');
assert.equal(journeyStatus('first-conversations',new Set(['greetings']))?.suggestedId,'cafe');
assert.equal(journeyStatus('first-conversations',new Set(['greetings','cafe','preferences','market']))?.finishedInPage,true);
assert.equal(journeyStatus('travel-day',new Set(['greetings']))?.suggestedId,'schedule');
assert.equal(upcomingInJourney('first-conversations','cafe'),'preferences');
assert.equal(upcomingInJourney('first-conversations','market'),null);
assert.equal(firstJourneyForLesson('late-train')?.id,'travel-day');
assert.equal(firstJourneyForLesson('nonexistent'),null);
assert.equal(analyzeAttempt('suis','suis','etre').correct,true);
assert.equal(analyzeAttempt('où','ou','questions').kind,'accent-or-apostrophe');
assert.equal(analyzeAttempt('pas ne','ne pas','negation').kind,'word-order');
assert.equal(analyzeAttempt('je','pas','negation').kind,'negation');
assert.equal(analyzeAttempt('la','le','articles').kind,'article');
assert.equal(analyzeAttempt('sont','sommes','etre').kind,'conjugation');
assert.equal(analyzeAttempt('','avais','imparfait').kind,'missing-answer');
assert.equal(analyzeAttempt('x','y').kind,'different-word');
for(const grammar of ['articles','indefinite','etre','avoir','negation','questions','futur-proche','passe-compose','imparfait']){
 const task=repairForGrammar(grammar);
 assert.ok(task&&task.answer&&task.prompt&&task.explanation,grammar+' must have an original transfer prompt');
}
assert.equal(repairForGrammar('missing'),null);
assert.equal(reviewProduction('weather','Nous n’allons pas marcher. Il pleut aujourd’hui.').graded,false);
assert.ok(reviewProduction('weather','Je reste à la maison.').promptChecks.length>=1);
assert.ok(reviewProduction('yesterday','J’ai parlé hier. Et ensuite j’ai étudié.').promptChecks.some(s=>s.includes('participle')));
assert.equal(reviewProduction('not-real','Je vais marcher.').graded,false);
assert.ok(reviewProduction('greetings','x'.repeat(4001)).notes[0].includes('4,000-character'));

const first=ORIGINAL_PATH_LESSONS.find(l=>l.id==='greetings')!;
const events=[
 practiceEvent(1,'greetings',first.exercises[0].id,first.exercises[0].answer)!,
 practiceEvent(2,'greetings',first.exercises[1].id,first.exercises[1].answer)!
];
assert.ok(events.every(Boolean));
assert.equal(practiceEvent(0,'greetings',first.exercises[0].id,'suis'),null);
assert.equal(practiceEvent(1,'greetings','forged','suis'),null);
assert.ok(practiceCatalogFingerprint().startsWith('fnv1a32-'));
const snapshot=exportPracticeCheckpoint(events);
assert.equal(snapshot.authoritative,false);
assert.equal(snapshot.approved,false);
assert.equal(snapshot.custody,'self-reported-local-only');
assert.equal(snapshot.catalogFingerprint,practiceCatalogFingerprint());
const verified=inspectPracticeCheckpoint(JSON.stringify(snapshot));
assert.equal(verified.status,'valid');
assert.equal(verified.replayCorrect,2);
assert.deepEqual(verified.practicedLessons,['greetings']);
assert.equal(verified.evidenceTrusted,false);
assert.equal(verified.authoritative,false);
assert.equal(inspectPracticeCheckpoint(JSON.stringify({...snapshot,approved:true})).status,'blocked');
assert.equal(inspectPracticeCheckpoint(JSON.stringify({...snapshot,authoritative:true})).status,'blocked');
assert.equal(inspectPracticeCheckpoint(JSON.stringify({...snapshot,sourceRevision:'stale'})).status,'blocked');
assert.equal(inspectPracticeCheckpoint(JSON.stringify({...snapshot,catalogFingerprint:'fake'})).status,'blocked');
assert.equal(inspectPracticeCheckpoint(JSON.stringify({...snapshot,hiddenExtra:'x'})).status,'blocked');
assert.equal(inspectPracticeCheckpoint(JSON.stringify({...snapshot,events:[{...events[0],sequence:2}]})).status,'blocked');
assert.equal(inspectPracticeCheckpoint(JSON.stringify({...snapshot,events:[events[0],{...events[1],exerciseId:'fake'}]})).status,'blocked');
assert.equal(inspectPracticeCheckpoint(JSON.stringify({...snapshot,events:[events[0],{...events[1],approved:true}]})).status,'blocked');
assert.equal(inspectPracticeCheckpoint(' '.repeat(64*1024+1)).status,'blocked');
assert.equal(inspectPracticeCheckpoint('{bad json').status,'blocked');
assert.deepEqual(inspectPracticeCheckpoint(JSON.stringify({...snapshot,events:[]})).practicedLessons,[]);
assert.equal(inspectPracticeCheckpoint(JSON.stringify({...snapshot,events:[{...events[0],submitted:'wrong'}]})).replayCorrect,0);
assert.equal(inspectPracticeCheckpoint(JSON.stringify({...snapshot,events:[events[0],{...events[1],exerciseId:'fake'}]})).events.length,0,'atomic rejection');
console.log(JSON.stringify({schema:'thiepn-french-u4-deterministic',status:'PASS',
 journeys:ORIGINAL_JOURNEYS.length,lessons:ORIGINAL_PATH_LESSONS.length,
 curriculumFingerprint:practiceCatalogFingerprint(),checkpointTrusted:false,authorityWrites:false}));
