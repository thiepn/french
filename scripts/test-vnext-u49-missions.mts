import assert from 'node:assert/strict';
import {emptySourceGraphState} from '../app/src/core/conversation/p35-runtime.ts';
import {rankSourceMissionContinuity} from '../app/src/core/conversation/source-mission-continuity.ts';
const state=emptySourceGraphState();
const locked=rankSourceMissionContinuity(state);
assert.equal(locked.length,5);
assert.ok(locked.some(x=>x.locked),'The A1 ceiling must block higher-level original missions');
assert.ok(locked.some(x=>!x.locked),'At least one A1 source mission is available');
const expanded=rankSourceMissionContinuity({...state,maxLevel:'B1'});
assert.ok(expanded.every(x=>!x.locked));
assert.equal(expanded.reduce((count,x)=>count+x.practised,0),0);
assert.ok(expanded.every(x=>x.missing.length===3));
console.log('Source mission continuity advisories preserve original goals and readiness ceilings.');

import {startSourceGraph} from '../app/src/core/conversation/p35-runtime.ts';
const older={...state,history:[{id:'source:fixture',scenarioId:'cafe-order',at:1600000000000,
 variant:0,turns:3,independent:3,assisted:0,repairs:0,manual:0,meanCredit:1,complete:true}]};
const replay=startSourceGraph(older,'cafe-order',1700000000000);
assert.equal(replay.active?.scenarioId,'cafe-order');
assert.equal(replay.active?.variant,1);
assert.deepEqual(replay.history,older.history);
assert.equal(replay.active?.turns,0);
assert.equal(replay.mission,null);

import {sourceFunctionPracticePlan} from '../app/src/core/conversation/source-function-practice.ts';
const functionPlans=sourceFunctionPracticePlan(state);
assert.equal(functionPlans.length,25);
assert.ok(functionPlans.some(x=>x.availableScenes>0&&x.nextSceneId),'Original A1 function practice reachable');
assert.ok(functionPlans.every(x=>!x.nextSceneId||x.availableScenes>0),'No invented source scenario');
const originalFunctions=new Set(functionPlans.map(x=>x.id));
assert.equal(originalFunctions.size,25);
const sourceEvidence=sourceFunctionPracticePlan({...state,evidence:[{id:'fixture',scenarioId:'cafe-order',nodeId:'order',
  functionId:'request',variant:0,at:1,accepted:true,repair:false,manual:false,support:0,
  retries:0,independent:true,confidence:1,credit:.5,practiceOnly:true}]});
assert.equal(sourceEvidence.find(x=>x.id==='request')?.independentRuleMatches,1);
assert.equal(sourceEvidence.find(x=>x.id==='specify')?.independentRuleMatches,0);
