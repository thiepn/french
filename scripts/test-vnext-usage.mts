import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import type {UsagePack} from '../app/src/core/content/loader.ts';
import {
  USAGE_MODES,freshUsageState,safeUsageState,currentUsageRecord,repairCandidates,
  diagnoseUsage,maskUsageFrame,usageCue,revealUsageSupport,completeUsageAttempt
} from '../app/src/core/usage/session.ts';

const source=JSON.parse(await readFile(new URL('./data/stable-usage-corpus-v1.json',import.meta.url),'utf8'));
assert.equal(source.schema,'thiepn-french-stable-usage-source-v1');
assert.equal(source.sourceBlob,'8a354063b20421ad53b3417b3f677adc926f3cb5');
assert.equal(source.count,67,'all source P10 frames included');
assert.equal(source.records.length,67);
const pack={records:source.records} as Pick<UsagePack,'records'>;
assert.equal(source.records[0].id,'p10-001');
assert.equal(source.records[66].id,'p10-067');
for(const [i,r] of source.records.entries()){
  assert.equal(r.id,'p10-'+String(i+1).padStart(3,'0'));
  assert.ok(r.frame.includes(r.blank));
  assert.equal(source.sources[r.sourceKey]?.tier,'verified');
  assert.match(source.sources[r.sourceKey].url,/^https:\/\//);
}
const first=source.records[0];
assert.equal(maskUsageFrame(first),'apprendre _____ + infinitif');
assert.equal(diagnoseUsage('à',first,'usage',pack.records).code,'exact');
assert.equal(diagnoseUsage('a',first,'usage',pack.records).code,'orthography');
assert.equal(diagnoseUsage('de',first,'usage',pack.records).code,'connector');
assert.equal(diagnoseUsage('apprendre à + infinitif',first,'production',pack.records).correct,true);
assert.equal(diagnoseUsage('apprendre de + infinitif',first,'production',pack.records).code,'connector');
assert.equal(diagnoseUsage('apprendre à',first,'production',pack.records).code,'incomplete');
assert.match(usageCue(first,'transfer'),/structural cue/);
const attention=pack.records.find(r=>r.frame==='faire attention à + infinitif');
assert.ok(attention);
assert.equal(diagnoseUsage('faire attention de + infinitif',attention,'production',pack.records).code,'neighbor');

let state=freshUsageState();
assert.equal(USAGE_MODES.length,4);
assert.equal(currentUsageRecord(pack,state,'repair'),undefined);
state=revealUsageSupport(state,'usage',1);
state=revealUsageSupport(state,'usage',2);
state=revealUsageSupport(state,'usage',1);
assert.equal(state.modes.usage.support,2,'hint cannot be erased for credit');
state=completeUsageAttempt(pack,state,'usage','p10-001','needs-practice','connector',1_700_000_000_000);
assert.equal(currentUsageRecord(pack,state,'usage')?.id,'p10-002');
assert.equal(state.history[0].support,2);
assert.equal(repairCandidates(pack,state)[0].id,'p10-001');
assert.equal(currentUsageRecord(pack,state,'repair')?.id,'p10-001');
assert.throws(()=>completeUsageAttempt(pack,state,'repair','p10-002','matched','exact'),/STALE_USAGE_RECORD/);
assert.throws(()=>completeUsageAttempt(pack,state,'repair','p10-001','matched','connector'),/INVALID_USAGE_OUTCOME/);
state=completeUsageAttempt(pack,state,'repair','p10-001','matched','exact',1_700_000_000_001);
assert.equal(repairCandidates(pack,state).length,0,'successful repair clears the error');
assert.equal(state.modes.repair.index,0,'repair cursor stays at beginning of changing queue');
assert.equal(state.modes.usage.index,1,'repair cannot move unrelated practice track');
state=completeUsageAttempt(pack,state,'production','p10-001','self-assessed','structure',1_700_000_000_002);
assert.equal(state.history[0].outcome,'self-assessed');
const reloaded=safeUsageState(JSON.parse(JSON.stringify(state)),pack);
assert.equal(reloaded.history.length,3);
assert.equal(JSON.stringify(reloaded).includes('apprendre à + infinitif'),false,'no learner typed answer or source frame is stored');
const forged=safeUsageState({...state,history:[
  {...state.history[0],recordId:'p10-999'},
  {...state.history[0],outcome:'matched',diagnosis:'connector'},
  {...state.history[0],diagnosis:'exact'}
]},pack);
assert.equal(forged.history.length,1,'bad IDs and forged matched diagnostics must be discarded');
assert.equal(safeUsageState({schema:'wrong'}).history.length,0);
console.log(JSON.stringify({schema:'french-p37i-c2-original-usage',ok:true,sourceFrames:67,practiceModes:USAGE_MODES,noTypedTranscripts:true}));
