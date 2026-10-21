import assert from 'node:assert/strict';
import {P35_P30_B2_SCENES,P35_LATER_B2_FUNCTIONS} from '../app/src/core/conversation/source-parity.ts';
import {getP35SourceScenario} from '../app/src/core/conversation/p35-graphs.ts';
import {emptySourceGraphState,startB2SourceGraph,respondSourceGraph,
 matchingP35AuthoredExamples,sourceSupport,safeSourceGraphState,
 cancelSourceGraph,SOURCE_GRAPH_KEY,SOURCE_GRAPH_SCHEMA
} from '../app/src/core/conversation/p35-runtime.ts';
import {deriveB2ContextTransfer} from '../app/src/core/conversation/b2-context-transfer.ts';

const now=1_790_100_000_000;
let tick=now;
const first=emptySourceGraphState();
const initial=deriveB2ContextTransfer(first);
assert.equal(initial.length,6,'the exact six original P30 communicative functions');
assert.deepEqual(initial.map(x=>x.functionId),[...P35_LATER_B2_FUNCTIONS]);
assert.ok(initial.every(x=>x.authoredContexts>=2),'never claim context variation without two original graphs');
assert.ok(initial.every(x=>x.completedUnassistedContexts===0&&x.unassistedRuleMatches===0));
assert.ok(initial.every(x=>x.status==='not-observed'));
assert.equal(initial[0].nextSceneId,'work-policy-debate');
assert.equal(initial[0].nextAction,'first-context');

function runToEnd(state){
 let steps=0;
 while(state.active&&steps++<20){
  const graph=getP35SourceScenario(state.active.scenarioId);
  assert.ok(graph&&graph.level==='B2');
  const available=matchingP35AuthoredExamples(graph,state.active.nodeId,state.active.slots);
  assert.ok(available.length>0,'original author gave usable matching source text for '+graph.id+'/'+state.active.nodeId);
  const reply=available[0];
  const result=respondSourceGraph(state,reply,++tick);
  assert.ok(result.outcome==='accepted'||result.outcome==='finished');
  state=result.state;
 }
 assert.ok(steps<=20&&state.active===null,'bounded original B2 graph completed');
 return state;
}
function evaluate(state){return deriveB2ContextTransfer(state).find(r=>r.functionId==='evaluate');}
let partial=startB2SourceGraph(first,'work-policy-debate',++tick);
const original=getP35SourceScenario(partial.active!.scenarioId)!;
const firstResponse=matchingP35AuthoredExamples(original,partial.active!.nodeId,{})[0];
partial=respondSourceGraph(partial,firstResponse,++tick).state;
let provisional=evaluate(partial)!;
assert.equal(provisional.completedUnassistedContexts,0,'partial source run is never a completed context');
assert.equal(provisional.unfinishedUnassistedContexts,1);
assert.equal(provisional.status,'unfinished');
assert.equal(provisional.nextSceneId,'work-policy-debate','resumes its unfinished original context before recommending new one');
partial=safeSourceGraphState(JSON.parse(JSON.stringify(partial)));
assert.equal(evaluate(partial)?.unfinishedUnassistedContexts,1,'interruption/reload retains source, not a new transfer store');

let one=runToEnd(partial);
const originalEvidence=one.evidence.length,originalHistory=one.history.length;
const p=evaluate(one)!;
assert.equal(p.completedUnassistedContexts,1,'only completed original P35 context');
assert.equal(p.unassistedRuleMatches,1);
assert.equal(p.status,'one-context');
assert.equal(p.nextSceneId,'civic-transport-debate','second original authored setting distinct from first');
assert.equal(p.nextAction,'different-context');
assert.equal(p.observedVariants,1);
assert.equal(one.maxLevel,'A1','no B2 promotion from transfer practice');
assert.equal(one.evidence.every(e=>e.practiceOnly),true);
assert.equal(one.missionHistory?.length,0);
const serial=JSON.stringify(one);
assert.ok(!serial.includes(firstResponse),'raw source text is not retained');
assert.equal(SOURCE_GRAPH_KEY,'p35-source-graph-v1');
assert.equal(SOURCE_GRAPH_SCHEMA,'thiepn-french-p35-source-graph-v1');

let two=startB2SourceGraph(one,p.nextSceneId!,++tick);
two=runToEnd(two);
const second=evaluate(two)!;
assert.equal(second.status,'cross-context');
assert.equal(second.completedUnassistedContexts,2);
assert.equal(second.observedVariants,2);
assert.equal(second.nextSceneId,'project-crisis','recommend an unobserved third P35 setting, not same-context repetition');
assert.equal(second.nextAction,'different-context');
assert.ok(two.evidence.length>originalEvidence);
assert.ok(two.history.length>originalHistory);
const recovered=safeSourceGraphState(JSON.parse(JSON.stringify(two)));
assert.deepEqual(deriveB2ContextTransfer(recovered),deriveB2ContextTransfer(two),'same existing canonical backup preserves transfer suggestions');

let assisted=startB2SourceGraph(first,'media-claim',++tick);
assisted=sourceSupport(assisted,2,++tick);
assisted=runToEnd(assisted);
const afterHelp=evaluate(assisted)!;
assert.equal(afterHelp.completedUnassistedContexts,0,'completed source goal with model used gives no unassisted function context');
assert.equal(afterHelp.supportedOnlyContexts,1);
assert.equal(afterHelp.assistedRuleMatches,1);
assert.equal(afterHelp.nextSceneId,'media-claim','retry supported source task without help before switching');
assert.equal(afterHelp.nextAction,'retry-without-help');
assert.equal(afterHelp.status,'supported-only');
assert.equal(assisted.evidence[0].credit,0,'source model reveal withholds turn credit');

const interrupted=cancelSourceGraph(partial);
assert.equal(evaluate(interrupted)?.completedUnassistedContexts,0,'abandoned original node cannot become completed');
const forged=safeSourceGraphState({...two,evidence:[
 ...two.evidence,{...two.evidence[0],id:'source:fake:work-policy-debate:0',scenarioId:'work-policy-debate',
  variant:0,at:now,credit:two.evidence[0].credit}
]});
assert.deepEqual(deriveB2ContextTransfer(forged),deriveB2ContextTransfer(two),
 'unlinked/tampered imported source event cannot create a second independent context');
assert.ok(P35_P30_B2_SCENES.every(id=>getP35SourceScenario(id)?.level==='B2'));
assert.ok(!JSON.stringify(deriveB2ContextTransfer(two)).includes(firstResponse));
console.log(JSON.stringify({schema:'u71-original-b2-cross-context-practice',status:'PASS',
 sourceFunctions:6,originalSourceScenes:5,firstThenSecondContext:true,
 unfinishedAbstains:true,supportedAbstains:true,originalScenarioVariants:true,
 originalHistoryLinkRequired:true,backupRoundtrip:true,
 newPersistence:false,fsrsWrites:false,b2Benchmark:false}));
