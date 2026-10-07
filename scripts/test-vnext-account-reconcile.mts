import assert from 'node:assert/strict';
import { decideReconciliation } from '../app/src/core/account/reconcile.ts';

assert.deepEqual(decideReconciliation({
  remoteExists:false,remoteRevision:null,baselineRevision:null,baselineHash:'',localHash:'local',meaningfulLocal:true
}),{action:'upload-new',expectedRevision:null,reason:'no cloud state exists'});

assert.equal(decideReconciliation({
  remoteExists:true,remoteRevision:4,baselineRevision:null,baselineHash:'',localHash:'local',meaningfulLocal:true
}).action,'conflict');

assert.equal(decideReconciliation({
  remoteExists:true,remoteRevision:4,baselineRevision:null,baselineHash:'',localHash:'empty',meaningfulLocal:false
}).action,'apply-remote');

assert.equal(decideReconciliation({
  remoteExists:true,remoteRevision:7,baselineRevision:7,baselineHash:'same',localHash:'same',meaningfulLocal:true
}).action,'synced');

const local=decideReconciliation({
  remoteExists:true,remoteRevision:7,baselineRevision:7,baselineHash:'old',localHash:'new',meaningfulLocal:true
});
assert.equal(local.action,'upload-current');assert.equal(local.expectedRevision,7);

assert.equal(decideReconciliation({
  remoteExists:true,remoteRevision:8,baselineRevision:7,baselineHash:'same',localHash:'same',meaningfulLocal:true
}).action,'apply-remote');

assert.equal(decideReconciliation({
  remoteExists:true,remoteRevision:8,baselineRevision:7,baselineHash:'old',localHash:'new',meaningfulLocal:true
}).action,'conflict');

assert.equal(decideReconciliation({
  remoteExists:true,remoteRevision:8,baselineRevision:7,baselineHash:'',localHash:'new',meaningfulLocal:true
}).action,'conflict');

console.log(JSON.stringify({schema:'thiepn-french-p37h-account-reconciliation',ok:true,fixtures:8},null,2));
