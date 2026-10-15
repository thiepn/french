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
