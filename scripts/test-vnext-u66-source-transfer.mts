import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {
 verifyP32SourceAuthority,originalP32Question,sourceMatchesAuthority
} from '../app/src/core/learner/b2-source-contract.ts';
import {
 assessB2Structure,finalizeB2Attempt,currentB2Evidence,appendB2Attempt,
 emptyB2Evidence,normalizeB2Evidence,P32_SOURCE_EVALUATOR,B2_EVALUATOR_VERSION
} from '../app/src/core/learner/b2-assessment.ts';
const raw=JSON.parse(readFileSync(new URL('./data/stable-readings-v1.json',import.meta.url),'utf8'));
const pack={
 schema:'thiepn-french-reading-pack-v1',id:'reading-stable-p35',
 revision:raw.sourceBlob.slice(0,12),sourceRuntime:raw.sourceRuntime,
 sourceBlob:raw.sourceBlob,morphology:raw.morphology??{},readings:raw.readings
};
const descriptor={
 id:pack.id,kind:'reading',revision:pack.revision,level:'A1-B2',
 path:'/content/readings/stable-readings.json',
 sha256:createHash('sha256').update(JSON.stringify(pack)).digest('hex')
};
const authority=verifyP32SourceAuthority(pack,descriptor);
assert.ok(authority,'actual P35 bundled data has exactly six usable distinct B2 texts and original question keys');
assert.equal(authority.readings.length,6);
assert.equal(authority.sourceRuntime,'5.24.0/P35');
assert.equal(authority.sourceBlob,raw.sourceBlob);
assert.equal(authority.digest,descriptor.sha256);
const wrongRevision={...descriptor,revision:'unrelated'};
assert.equal(verifyP32SourceAuthority(pack,wrongRevision),null,'must reject mismatched revision');
assert.equal(verifyP32SourceAuthority(pack,{...descriptor,sha256:'broken'}),null,'must reject unpinned source pack');
assert.equal(verifyP32SourceAuthority({...pack,sourceBlob:'an-unknown-blob'},descriptor),null);
assert.equal(verifyP32SourceAuthority({...pack,readings:[...pack.readings.filter(x=>x.level!=='B2'),...authority.readings.slice(0,5),authority.readings[0]]},descriptor),null,'no duplicated canonical B2 IDs');
const first=authority.readings[0],second=authority.readings[1];
const q1=originalP32Question(first,first.questions[0].id);
const q2=originalP32Question(second,second.questions[1].id);
assert.ok(q1&&q2);
assert.equal(originalP32Question(first,'invented-q99'),null);
assert.equal(sourceMatchesAuthority(authority,{...first},q1.id),false,'same ID with substituted source body is not current verified object');
assert.equal(sourceMatchesAuthority(authority,first,q1.id),true);
const text=[
 'Selon le texte original, le télétravail et la présence au bureau ne répondent pas de la même manière aux besoins des salariés.',
 'Cependant, la direction doit examiner les contraintes spécifiques et la diversité des activités pour définir une politique stable.',
 'Par exemple, certains collègues trouvent une meilleure concentration à distance, alors que les tâches collectives exigent une coordination.',
 'Bien que les conditions individuelles puissent varier, cette organisation mérite une discussion transparente et des critères prévisibles.',
 'Si les responsables imposent des règles rigides, des collaborateurs pourraient rencontrer des difficultés inutiles et des tensions durables.',
 'Par conséquent, une expérimentation progressive permettrait de comparer les besoins et les résultats avant de décider une généralisation.',
 'En conclusion, je recommande des consultations régulières et une adaptation attentive pour maintenir confiance et responsabilité communes.',
 'Cette solution comporte des limites car aucune organisation ne convient automatiquement à toutes les situations professionnelles.'
].join(' ');
const common={kind:'p32',modality:'reading',taskId:first.id,source:first,sourceAuthority:authority,questionId:q1.id,elapsedMs:120000,attested:true,text,answerIndex:q1.answer};
const correct=assessB2Structure(common);
assert.equal(correct.sourceDigest,descriptor.sha256);
assert.equal(correct.questionId,q1.id);
assert.equal(correct.sourceRevision,pack.revision);
assert.equal(correct.sourceBlob,pack.sourceBlob);
assert.equal(correct.sourceEvaluator,P32_SOURCE_EVALUATOR);
assert.equal(correct.comprehensionCorrect,true);
assert.notEqual(correct.status,'unscored','a verified source and keyed answer is eligible for structural checks, not guaranteed pass');
assert.equal(assessB2Structure({...common,answerIndex:null}).status,'unscored');
assert.equal(assessB2Structure({...common,answerIndex:(q1.answer+1)%q1.options.length}).status,'insufficient');
assert.equal(assessB2Structure({...common,questionId:'made-up'}).status,'unscored');
assert.equal(assessB2Structure({...common,sourceAuthority:undefined}).status,'unscored');
const listening={...common,source:second,taskId:second.id,questionId:q2.id,
 answerIndex:q2.answer,modality:'listening',audioCompleted:true,playCount:1};
const heard=assessB2Structure(listening);
assert.equal(heard.comprehensionCorrect,true);
assert.equal(heard.playbackCompleted,true);
assert.equal(assessB2Structure({...listening,audioCompleted:false}).status,'unscored');
assert.equal(assessB2Structure({...listening,transcriptRevealed:true}).status,'unscored');
assert.equal(assessB2Structure({...listening,playCount:0}).status,'unscored');
const p32=finalizeB2Attempt('p32',correct,heard,Date.now());
assert.equal(p32.tasks[0].sourceId,first.id);
assert.equal(p32.tasks[1].sourceId,second.id);
assert.throws(()=>finalizeB2Attempt('p32',correct,{...heard,sourceDigest:'f'.repeat(64)},Date.now()),/P32_SOURCE_REVISION_MISMATCH/);
const now=Date.now();
const p31Task=id=>({taskId:id,modality:'argument',wordCount:170,sentenceCount:8,
 markerFamilies:['contrast'],score:95,confidence:95,topicGroups:4,directCopyPct:0,transformation:80,
 playCount:0,elapsedMs:125000,status:'structural-targets-met',reason:'synthetic fixture only',evaluator:B2_EVALUATOR_VERSION});
const p31={id:'synthetic-p31',kind:'p31',at:now,status:'structural-targets-met',
 evaluator:B2_EVALUATOR_VERSION,tasks:[p31Task('one'),p31Task('two')]};
let data=appendB2Attempt(emptyB2Evidence(),p31,'token-one');
data=appendB2Attempt(data,{...p32,status:'structural-targets-met',at:now},'token-two');
assert.ok(currentB2Evidence(data,'p32',now,authority.digest));
assert.equal(currentB2Evidence(data,'p32',now,'e'.repeat(64)),null,'different original source revision invalidates P32 current evidence');
assert.equal(currentB2Evidence(data,'p32',now),null,'unbound retrieval cannot grant P32 credit');
assert.deepEqual(normalizeB2Evidence(JSON.parse(JSON.stringify(data))),data,'v1 records with v2 source proof remain backup-compatible');
assert.equal(JSON.stringify(data).includes(text),false,'raw French essay never saved');
console.log(JSON.stringify({schema:'u66-source-transfer',status:'PASS',sourceReadings:authority.readings.length,
 keyedQuestions:authority.readings.reduce((n,x)=>n+x.questions.length,0),
 digest:authority.digest.slice(0,12),receipts:'revision-bound',plaintext:false}));
