import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import type {UsagePack} from '../app/src/core/content/loader.ts';
import {
  freshUsageState,safeUsageState,accumulateUsageTally,currentUsageRecord,
  type UsageAttempt,type UsageMode,type UsageOutcome,type UsageCode,type UsageState
} from '../app/src/core/usage/session.ts';
import {usageRecordMastery,rankUsageCandidates,usageAggregate,transferCueVariant,
  USAGE_SECURE_ATTEMPTS,USAGE_SECURE_ACCURACY,USAGE_REFRESH_DAYS,
  TRANSFER_SECURE_ATTEMPTS,TRANSFER_SECURE_ACCURACY} from '../app/src/core/usage/mastery.ts';
const source=JSON.parse(await readFile(new URL('./data/stable-usage-corpus-v1.json',import.meta.url),'utf8'));
const pack={records:source.records} as Pick<UsagePack,'records'>;
const now=Date.now(),DAY=86_400_000,id='p10-001';
function put(state:UsageState,mode:UsageMode,outcome:UsageOutcome='matched',
  code:UsageCode='exact',support:0|1|2=0,variant:0|1|2=0,at=now,recordId=id):UsageState{
  const event:UsageAttempt={recordId,mode,at,outcome,diagnosis:code,support,variant};
  const group={...(state.tallies[recordId]??{})};
  group[mode]=accumulateUsageTally(group[mode],event);
  return {...state,history:[event,...state.history].slice(0,300),tallies:{...state.tallies,[recordId]:group}};
}
assert.equal(USAGE_SECURE_ATTEMPTS,3);
assert.equal(USAGE_SECURE_ACCURACY,.8);
assert.equal(USAGE_REFRESH_DAYS,60);
assert.equal(TRANSFER_SECURE_ATTEMPTS,2);
assert.equal(TRANSFER_SECURE_ACCURACY,.8);

let state=freshUsageState();
assert.equal(rankUsageCandidates(pack,state,'production',now).length,0,'production requires introductory usage');
assert.equal(rankUsageCandidates(pack,state,'transfer',now).length,0,'no instant transfer unlock');
state=put(state,'usage','matched','exact',0,0,now-4*DAY);
assert.equal(rankUsageCandidates(pack,state,'production',now).some(r=>r.record.id===id),true);
assert.equal(usageRecordMastery(id,state,now).usage.secure,false);
state=put(state,'usage','matched','exact',0,0,now-3*DAY);
assert.equal(usageRecordMastery(id,state,now).transfer.ready,true,'P35 two usage attempts qualify for transfer practice');
assert.equal(rankUsageCandidates(pack,state,'transfer',now).some(r=>r.record.id===id),true);
state=put(state,'usage','needs-practice','connector',0,0,now-2*DAY);
assert.equal(usageRecordMastery(id,state,now).usage.secure,false,'2/3 < .8');
state=put(state,'usage','matched','exact',0,0,now-DAY);
state=put(state,'usage','matched','exact',0,0,now);
assert.equal(usageRecordMastery(id,state,now).usage.secure,true,'4/5 exact independent >= .8');
assert.equal(usageRecordMastery(id,state,now+61*DAY).usage.status,'refresh','P35 60-day stale threshold');
assert.equal(usageRecordMastery(id,state,now+61*DAY).usage.secure,false);
assert.equal(usageRecordMastery(id,state,now).repairNeeded,false,'exact independent repairs previously missed frame');

let variants=state;
variants=put(variants,'transfer','matched','exact',0,0,now);
variants=put(variants,'transfer','matched','exact',0,0,now+1);
assert.equal(usageRecordMastery(id,variants,now+1).transfer.secure,false,'one repeated cue cannot claim C3 transfer security');
assert.equal(transferCueVariant(variants,id),2);
variants=put(variants,'transfer','matched','exact',0,2,now+2);
assert.equal(usageRecordMastery(id,variants,now+2).transfer.secure,true,'distinct independently exact structural cues');
variants=put(variants,'transfer','matched','exact',2,1,now+3);
assert.equal(usageRecordMastery(id,variants,now+3).transfer.secure,false,'support must not earn transfer security');
variants=put(variants,'transfer','self-assessed','structure',0,0,now+4);
assert.equal(usageRecordMastery(id,variants,now+4).transfer.secure,false,'self-assessment cannot certify transfer');

const recent=new Set<string>();
let many=freshUsageState();
many=put(many,'usage','needs-practice','connector',0,0,now-100*DAY);
for(let i=0;i<400;i++)many=put(many,'usage','matched','exact',0,0,now-40_000+i);
const aggregate=usageRecordMastery(id,many,now);
assert.equal(many.history.length,300,'history remains capped for backup size');
assert.equal(aggregate.usage.attempts,401,'cumulative ledger is not truncated to 300');
assert.equal(aggregate.usage.independentExact,400);
assert.equal(safeUsageState(JSON.parse(JSON.stringify(many)),pack).tallies[id].usage?.attempts,401,'persisted ledger round-trip');
const invalid=structuredClone(many);
invalid.tallies[id].usage!.exact=9_999_999;
assert.equal(safeUsageState(invalid,pack).tallies[id].usage?.attempts,300,'invalid ledger falls back conservatively to checked recent events');
assert.equal(usageAggregate(pack,state,now).sourceFrames,67);
const broken=put(freshUsageState(),'production','needs-practice','connector',0,0,now,'p10-003');
assert.equal(rankUsageCandidates(pack,broken,'repair',now)[0].record.id,'p10-003');
assert.equal(currentUsageRecord(pack,broken,'repair')?.id,'p10-003');
assert.equal(JSON.stringify(many).includes('apprendre à + infinitif'),false,'no written learner response or corpus frame is retained');
console.log(JSON.stringify({
  schema:'french-p37i-c3-adaptive-usage-mastery',ok:true,sourceFrames:67,
  usageThreshold:'3 attempts / 80% / 60d',transferThreshold:'2 attempts / 80% / multi-cue',
  cumulativeLedger:true,privacy:'metadata-only'
}));
