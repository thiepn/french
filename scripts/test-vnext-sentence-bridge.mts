import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import type {SentenceExercisePack,UsagePack} from '../app/src/core/content/loader.ts';
import {freshUsageState,accumulateUsageTally,type UsageState,type UsageAttempt} from '../app/src/core/usage/session.ts';
import {freshWritingState,revealWritingSupport,completeWritingAttempt,
  currentWritingExercise,safeWritingState,WRITING_MODES} from '../app/src/core/writing/session.ts';
import {sentenceSourceMap,rankedSentenceBridge,sentenceBridgeSummary}
  from '../app/src/core/writing/bridge.ts';
const [u,p]=await Promise.all([
  readFile(new URL('./data/stable-usage-corpus-v1.json',import.meta.url),'utf8'),
  readFile(new URL('./data/stable-sentence-exercises-v1.json',import.meta.url),'utf8')
]);
const usage={records:JSON.parse(u).records} as Pick<UsagePack,'records'>;
const sentences={exercises:JSON.parse(p).exercises} as Pick<SentenceExercisePack,'exercises'>;
const now=Date.now();
const links=sentenceSourceMap(sentences,usage);
assert.equal(links.size,36,'all 36 original P12 exercises are mapped from source-identical P10 frames');
assert.equal(links.get('p12-001')?.id,'p10-036');
assert.equal(links.get('p12-025')?.id,'p10-036');
assert.equal(links.get('p12-031')?.id,'p10-004');
let state=freshWritingState(),usageState=freshUsageState();
assert.deepEqual(WRITING_MODES,['phrase','sentence','transfer','bridge']);
assert.equal(currentWritingExercise(sentences,state,'bridge',usage,usageState),undefined,
  'no unsupported bridge unlocks');
function usageHit(recordId:string,support:0|1|2=0,outcome:UsageAttempt['outcome']='matched'){
  const event:UsageAttempt={recordId,mode:'usage',outcome,diagnosis:outcome==='matched'?'exact':'connector',
    at:now-10_000+usageState.history.length,support};
  const group={...(usageState.tallies[recordId]??{})};
  group.usage=accumulateUsageTally(group.usage,event);
  usageState={...usageState,tallies:{...usageState.tallies,[recordId]:group},history:[event,...usageState.history]};
}
usageHit('p10-036',2);
usageHit('p10-036',0);
assert.equal(rankedSentenceBridge(sentences,usage,usageState,state).length,0,'one hinted + one exact is insufficient');
usageHit('p10-036');
let candidates=rankedSentenceBridge(sentences,usage,usageState,state);
assert.equal(candidates.length,2,'two P12 situations unlocked for one verified construction');
assert.equal(currentWritingExercise(sentences,state,'bridge',usage,usageState)?.id,'p12-001');
state=revealWritingSupport(state,'bridge',2);
state=completeWritingAttempt(sentences,state,'bridge','p12-001','matched','exact',now,usage,usageState);
assert.equal(state.evidence['p12-001'].independentExact,0,'model-revealed sentence gets no independent credit');
assert.equal(state.evidence['p12-001'].attempts,1);
assert.equal(currentWritingExercise(sentences,state,'bridge',usage,usageState)?.id,'p12-025',
  'adaptive bridge directs learner toward another context');
state=completeWritingAttempt(sentences,state,'bridge','p12-025','matched','accepted',now+1,usage,usageState);
assert.equal(state.evidence['p12-025'].independentExact,1,'source-author accepted alternative counts without hint');
assert.equal(sentenceBridgeSummary(sentences,usage,usageState,state).pairedContexts,0);
assert.equal(currentWritingExercise(sentences,state,'bridge',usage,usageState)?.id,'p12-001');
state=completeWritingAttempt(sentences,state,'bridge','p12-001','matched','exact',now+2,usage,usageState);
assert.equal(sentenceBridgeSummary(sentences,usage,usageState,state).pairedContexts,1,
  'distinct original P12 contexts have independent model evidence');
assert.equal(sentenceBridgeSummary(sentences,usage,usageState,state).pairedPossible,4,'original P12 has exactly four two-context construction pairs');

const raw=JSON.parse(JSON.stringify(state));
assert.equal(JSON.stringify(raw).includes('Nous devons tenir compte'),false,'metadata only, no typed answer');
assert.equal(safeWritingState(raw).evidence['p12-001'].independentExact,1,'round-trip preserves cumulative metadata');
const bogus=structuredClone(raw);
bogus.evidence['p12-001'].independentExact=1_000_000;
assert.equal(safeWritingState(bogus).evidence['p12-001'].attempts,2,'forged tally reconstructed from history');
const old={schema:'thiepn-french-writing-v1',modes:state.modes,history:state.history};
assert.equal(safeWritingState(old).evidence['p12-001'].attempts,2,'C1-C4 history-only migration');
let many=state;
for(let i=0;i<400;i++){
  // Full production history must not be required for cumulative P12 metrics.
  const fresh={exerciseId:'p12-001',mode:'phrase' as const,at:now+3+i,
    outcome:'matched' as const,diagnosis:'exact',support:0 as const};
  many={...many,history:[fresh,...many.history].slice(0,300),
    evidence:{...many.evidence,'p12-001':{
      ...many.evidence['p12-001'],
      attempts:many.evidence['p12-001'].attempts+1,
      independentExact:many.evidence['p12-001'].independentExact+1,
      lastAt:fresh.at,lastIndependent:true,lastDiagnosis:'exact'}}};
}
assert.equal(safeWritingState(JSON.parse(JSON.stringify(many))).evidence['p12-001'].attempts,402,
  'cumulative writing evidence survives the 300-event history bound');
assert.throws(()=>completeWritingAttempt(sentences,state,'bridge','p12-002','matched','exact',now,usage,usageState),/STALE_WRITING_EXERCISE/);
console.log(JSON.stringify({
  schema:'french-p37i-c4-linked-sentence-transfer',ok:true,originalSentences:links.size,
  independentGate:2,separateSentenceEvidence:true,multiContext:true,metadataOnly:true
}));
