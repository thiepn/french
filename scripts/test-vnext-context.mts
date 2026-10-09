import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import type {UsagePack} from '../app/src/core/content/loader.ts';
import {CONTEXT_SCENES,assessContextAnswer,contextScene,hasContextScenes} from '../app/src/core/usage/context.ts';
import {freshUsageState,accumulateUsageTally,completeUsageAttempt,currentUsageRecord,
  safeUsageState,diagnoseContextUsage,type UsageAttempt,type UsageMode,type UsageState
} from '../app/src/core/usage/session.ts';
import {rankUsageCandidates,usageRecordMastery,contextCueVariant,usageAggregate} from '../app/src/core/usage/mastery.ts';
const source=JSON.parse(await readFile(new URL('./data/stable-usage-corpus-v1.json',import.meta.url),'utf8'));
const pack={records:source.records} as Pick<UsagePack,'records'>;
const now=Date.now(),recordId='p10-001',DAY=86_400_000;
assert.equal(CONTEXT_SCENES.length,16);
assert.equal(new Set(CONTEXT_SCENES.map(row=>row.id)).size,16);
assert.equal(new Set(CONTEXT_SCENES.map(row=>row.recordId)).size,8);
for(const scene of CONTEXT_SCENES){
  assert.ok(source.records.some((row:{id:string})=>row.id===scene.recordId),'every new scenario has a real P10 construction');
  assert.ok(scene.situation&&scene.english&&scene.expected&&scene.hint);
  assert.equal(assessContextAnswer(scene.expected,scene),'exact');
  assert.equal(contextScene(scene.recordId,scene.variant)?.id,scene.id);
  assert.equal(assessContextAnswer('',scene),'blank');
  assert.equal(assessContextAnswer('La table.',scene),'needs-human-review');
}
for(const id of new Set(CONTEXT_SCENES.map(row=>row.recordId))){
  assert.equal(hasContextScenes(id),true,'two distinct authored situations per context construction');
  assert.notEqual(contextScene(id,0)?.situation,contextScene(id,1)?.situation,
    'contexts must be situationally different, not a restyled prompt');
}
assert.equal(hasContextScenes('p10-003'),false,'unsupported source frames stay out of contextual queue');
assert.equal(assessContextAnswer('Elle apprend a cuisiner.',contextScene(recordId,1)!),'orthography');
assert.equal(diagnoseContextUsage('Elle apprend à cuisiner.',contextScene(recordId,1)!).correct,true);
assert.equal(diagnoseContextUsage('Elle cuisine.',contextScene(recordId,1)!).correct,false);

function add(state:UsageState,mode:UsageMode,variant:0|1=0,
  support:0|1|2=0,outcome:'matched'|'needs-practice'|'self-assessed'='matched',
  diagnosis:'exact'|'structure'='exact',record=recordId,at=now):UsageState{
  const event:UsageAttempt={recordId:record,mode,at,outcome,diagnosis,support,variant};
  const row={...(state.tallies[record]??{})};
  row[mode]=accumulateUsageTally(row[mode],event);
  return{...state,history:[event,...state.history].slice(0,300),tallies:{...state.tallies,[record]:row}};
}
let state=freshUsageState();
assert.equal(state.modes.context.index,0);
assert.equal(rankUsageCandidates(pack,state,'context',now).length,0,'contexts initially locked');
state=add(state,'usage',0,0,'matched','exact',recordId,now-2*DAY);
assert.equal(usageRecordMastery(recordId,state,now).contextual.ready,false);
state=add(state,'usage',0,0,'matched','exact',recordId,now-DAY);
assert.equal(usageRecordMastery(recordId,state,now).contextual.ready,true);
assert.equal(rankUsageCandidates(pack,state,'context',now).some(row=>row.record.id===recordId),true);
assert.equal(contextCueVariant(state,recordId),0);
const first=currentUsageRecord(pack,state,'context');
assert.equal(first?.id,recordId);
state=completeUsageAttempt(pack,state,'context',recordId,'matched','exact',now,0);
assert.equal(state.modes.context.index,1);
assert.equal(state.tallies[recordId].context?.variantMask,1);
assert.equal(contextCueVariant(state,recordId),1);
assert.equal(usageRecordMastery(recordId,state,now).contextual.secure,false,'one scenario alone cannot claim general transfer');
const repeated=add(state,'context',0,0,'matched','exact',recordId,now+1);
assert.equal(usageRecordMastery(recordId,repeated,now+1).contextual.secure,false,'repeating the same scenario is not independent variation');
const assisted=add(state,'context',1,2,'matched','exact',recordId,now+2);
assert.equal(usageRecordMastery(recordId,assisted,now+2).contextual.secure,false,'assisted model answers cannot confer security');
const manual=add(state,'context',1,0,'self-assessed','structure',recordId,now+3);
assert.equal(usageRecordMastery(recordId,manual,now+3).contextual.secure,false,'manual judgments cannot certify correctness');
state=add(state,'context',1,0,'matched','exact',recordId,now+4);
assert.equal(usageRecordMastery(recordId,state,now+4).contextual.secure,true,'both distinct situations must be exact and unassisted');
assert.equal(usageRecordMastery(recordId,state,now+4).transfer.secure,false,'context must not fabricate structural-transfer mastery');
assert.equal(usageAggregate(pack,state,now+4).contextSecure,1);
assert.equal(usageRecordMastery(recordId,state,now+4).repairNeeded,false,'context mistakes must not create source-frame repair demand');
assert.throws(()=>completeUsageAttempt(pack,state,'context','p10-003','matched','exact',now+5,0),/STALE_USAGE_RECORD|INVALID_USAGE_OUTCOME/);
assert.equal(safeUsageState(JSON.parse(JSON.stringify(state)),pack).tallies[recordId].context?.variantMask,3,
  'contextual tally survives reload and migration');
assert.equal(JSON.stringify(state).includes('Elle apprend à cuisiner.'),false,'never store typed sentences or reference text');
console.log(JSON.stringify({schema:'french-p37i-c5-contextual-production',ok:true,
  scenes:CONTEXT_SCENES.length,sourceFrames:8,
  measures:'exact model matches in two independent situations',cefrCertification:false,
  separateStructuralAndContextualEvidence:true,privacy:'metadata-only'}));
