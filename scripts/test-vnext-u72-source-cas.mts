import assert from 'node:assert/strict';
import {emptySourceGraphState,startB2SourceGraph,startB2SourcePracticeChain,
 respondSourceGraph,matchingP35AuthoredExamples,safeSourceGraphState,sourceSupport,
 SOURCE_GRAPH_KEY,SOURCE_GRAPH_SCHEMA} from '../app/src/core/conversation/p35-runtime.ts';
import {getP35SourceScenario} from '../app/src/core/conversation/p35-graphs.ts';
import {sameSourceGraphSnapshot,SourceGraphWriteConflictError} from '../app/src/core/conversation/p35-storage.ts';

const at=1_791_000_000_000;
const empty=emptySourceGraphState();
const copy=x=>JSON.parse(JSON.stringify(x));
assert.equal(SOURCE_GRAPH_KEY,'p35-source-graph-v1');
assert.equal(SOURCE_GRAPH_SCHEMA,'thiepn-french-p35-source-graph-v1');
assert.equal(sameSourceGraphSnapshot(undefined,empty),true,'legacy uninitialized graph matches normalized original empty');
assert.equal(sameSourceGraphSnapshot(copy(empty),empty),true);
let original=startB2SourcePracticeChain(empty,'u70-workplace-practice',at);
assert.equal(sameSourceGraphSnapshot(empty,original),false,'starting a mission is visible to original CAS');
assert.equal(sameSourceGraphSnapshot(original,empty),false,'stale idle tab cannot overwrite new mission');
assert.equal(original.mission?.index,0);
assert.equal(original.active?.scenarioId,'project-crisis');
const graph=getP35SourceScenario('project-crisis');
assert.ok(graph);
const phrase=matchingP35AuthoredExamples(graph,original.active.nodeId,original.active.slots)[0];
assert.ok(phrase);
const responded=respondSourceGraph(original,phrase,at+1000).state;
assert.equal(responded.active.nodeId,'options');
assert.equal(sameSourceGraphSnapshot(original,responded),false,'stale node cannot erase accepted P35 turn');
assert.equal(sameSourceGraphSnapshot(responded,original),false);
const assisted=sourceSupport(original,2,at+1001);
assert.equal(sameSourceGraphSnapshot(assisted,original),false,'support downgrade cannot disappear during cross-tab conflict');
const repaired=respondSourceGraph(original,'Pardon, pouvez-vous répéter ?',at+1002).state;
assert.equal(sameSourceGraphSnapshot(repaired,original),false,'repair cannot overwrite independent response');
const restored=safeSourceGraphState(copy(responded));
assert.equal(sameSourceGraphSnapshot(restored,responded),true,'unchanged original source graph survives canonical backup normalization');
assert.equal(sameSourceGraphSnapshot({...responded,active:{...responded.active,updatedAt:at+4000}},responded),false,
 'same node after another tab updates support/timing is not silently overwritten');
const another=startB2SourceGraph(empty,'work-policy-debate',at+4000);
assert.equal(sameSourceGraphSnapshot(another,original),false,
 'two simultaneous different original B2 graph selections are incompatible');
assert.equal(sameSourceGraphSnapshot({...empty,history:[{id:'source:test',scenarioId:'work-policy-debate',at,variant:0,turns:6,independent:6,assisted:0,repairs:0,manual:0,meanCredit:0.8,complete:true}]},empty),false,
 'an idle tab cannot erase completed source history and B2 context continuity');
assert.equal(sameSourceGraphSnapshot({...empty,maxLevel:'B1'},empty),false,
 'source practice ceiling is original-state-owned');
assert.match(new SourceGraphWriteConflictError().message,/changed in another tab/);
assert.equal(new SourceGraphWriteConflictError().name,'SourceGraphWriteConflictError');
assert.ok(!JSON.stringify(responded).includes(phrase),'raw learner French must not be stored');
assert.equal(responded.evidence[0].practiceOnly,true);
assert.equal(responded.maxLevel,'A1');
console.log(JSON.stringify({schema:'u72-original-p35-source-cas',status:'PASS',
 originalMetaKey:SOURCE_GRAPH_KEY,originalSchema:SOURCE_GRAPH_SCHEMA,
 originalB2Mission:true,conflicts:['start','mission','node','support','repair','history','ceiling'],
 backupRoundtrip:true,newStore:false,transcript:false,cefrGrade:false}));
