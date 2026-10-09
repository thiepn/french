import assert from 'node:assert/strict';
import {diagnoseP26,p26RepairPreview,P26_CAUSES} from '../app/src/core/learner/p26-diagnosis.ts';
import type {CanonicalReviewEventV1} from '../app/src/core/learner/model.ts';
const DAY=86_400_000,now=1_700_500_000_000;
let index=0;
function observation(noteId:string,age:number,correct:boolean,more:Record<string,unknown>={}):CanonicalReviewEventV1{
 return{schema:'thiepn-french-review-event-v1',eventId:'p26:'+ ++index,
  noteId,id:noteId+'::d31:0:production',skill:'production',practice:'review',
  practiceOnly:false,t:now-age*DAY,correct,typed:true,typedQuality:correct?'exact':'review',
  rating:correct?'good':'again',...more} as CanonicalReviewEventV1;
}
const corpus=[
 observation('grammar:1',27,false,{practice:'written-bridge',practiceOnly:true,errorCategory:'connector'}),
 observation('grammar:1',14,false,{practice:'written-bridge',practiceOnly:true,errorCategory:'preposition'}),
 observation('grammar:1',3,true,{practice:'written-bridge',practiceOnly:true,
   typedQuality:'exact',sentenceDiagnosis:'exact',supportLevel:0}),
 observation('form:1',9,false,{practice:'written-phrase',practiceOnly:true,errorCategory:'orthography'}),
 observation('frame:1',8,false,{practice:'verified-usage-production',practiceOnly:true,errorCategory:'structure'}),
 observation('listen:1',6,false,{practice:'contextual-listening',practiceOnly:true,errorCategory:'segmentation'}),
 observation('speak:1',6,false,{practice:'spoken-transfer',practiceOnly:true,manualJudgment:'self-assessed'}),
 observation('speak:1',2,true,{practice:'spoken-transfer',practiceOnly:true,manualJudgment:'self-assessed'}),
 observation('read:1',7,false,{practice:'reading-context',practiceOnly:true}),
 observation('review:1',8,false),
 observation('review:1',1,true,{skill:'recognition'}),
 observation('old:1',95,false)
];
const report=diagnoseP26({events:[...corpus,corpus[0]],now});
assert.equal(report.windowDays,90);assert.ok(report.open.length>=4);
assert.equal(report.sourceLimited,false);
const by=(id:string)=>[...report.open,...report.repaired].find(row=>row.noteId===id);
assert.equal(by('grammar:1')?.status,'repaired','specific later independently exact grammar evidence closes grammar');
assert.equal(by('grammar:1')?.failures,2,'replayed event IDs never inflate failure counts');
assert.equal(by('speak:1')?.status,'open','manual speaking success cannot clear independent oral weakness');
assert.equal(by('review:1')?.status,'repaired','independent scheduled review clears generic retrieval');
assert.equal(by('old:1'),undefined,'90-day horizon');
assert.equal(by('frame:1')?.cause,'lexical-frame');
assert.equal(by('listen:1')?.cause,'listening');
assert.equal(by('read:1')?.cause,'reading');
for(const row of [...report.open,...report.repaired]){
 assert.ok(P26_CAUSES.includes(row.cause));
 assert.ok(row.severity>=0&&row.severity<=100&&row.confidence<=100);
 const tasks=p26RepairPreview(row);
 assert.deepEqual(tasks.map(t=>t.stage),['scaffold','rebuild','independent-retest']);
 assert.ok(tasks.every(t=>t.practiceOnly===true),'P26 repair must never schedule a real FSRS grade');
}
const forced=diagnoseP26({events:corpus,now,sourceLimit:2});
assert.equal(forced.sourceLimited,true);
const identity=JSON.stringify(report);
for(const secret of ['rawAnswer','spokenTranscript','sourceText'])assert.ok(!identity.includes(secret));
console.log(JSON.stringify({schema:'thiepn-french-d6-p26-diagnostics',ok:true,
 eightCauses:P26_CAUSES.length,practiceOnly:true,cefrPromotion:false,srsMutation:false}));
