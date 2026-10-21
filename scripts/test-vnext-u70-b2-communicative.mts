import assert from 'node:assert/strict';
import {P35_SOURCE_SCENARIOS,getP35SourceScenario} from '../app/src/core/conversation/p35-graphs.ts';
import {P35_P18_MISSIONS,P35_P30_B2_SCENES,P35_P30_B2_PRACTICE_CHAINS,
 P35_LATER_B2_FUNCTIONS} from '../app/src/core/conversation/source-parity.ts';
import {emptySourceGraphState,startSourceGraph,startSourceMission,startB2SourceGraph,
 startB2SourcePracticeChain,respondSourceGraph,matchSourceRule,sourcePrompt,
 safeSourceGraphState,validateSourceGraphs,matchingP35AuthoredExamples,sourceSupport,cancelSourceGraph,
 SOURCE_GRAPH_KEY,SOURCE_GRAPH_SCHEMA} from '../app/src/core/conversation/p35-runtime.ts';
const now=1_790_000_000_000;
assert.deepEqual(validateSourceGraphs(),[],'all 19 original pinned graph nodes/rules and U70 practice coverage valid');
assert.equal(P35_SOURCE_SCENARIOS.length,19);
assert.equal(P35_P30_B2_SCENES.length,5);
assert.equal(P35_P30_B2_PRACTICE_CHAINS.length,2);
assert.equal(P35_P18_MISSIONS.length,5,'original P18 mission identity/catalog unchanged');
assert.equal(SOURCE_GRAPH_KEY,'p35-source-graph-v1','no shadow persistence');
assert.equal(SOURCE_GRAPH_SCHEMA,'thiepn-french-p35-source-graph-v1','no schema migration');
const initial=emptySourceGraphState();
assert.equal(initial.maxLevel,'A1');
assert.throws(()=>startSourceGraph(initial,P35_P30_B2_SCENES[0],now),/SOURCE_GRAPH_NOT_AUTHORIZED/,
 'lower P18 source entry never silently authorizes B2');
assert.throws(()=>startSourceMission(initial,P35_P30_B2_PRACTICE_CHAINS[0].id,now),
 /SOURCE_MISSION_LEVEL_LOCKED/,'original P18 mission API cannot mint B2 mission credit');
assert.throws(()=>startB2SourceGraph(initial,'bogus',now),/B2_SOURCE_GRAPH_NOT_PINNED/);
assert.throws(()=>startB2SourceGraph(initial,'cafe-order',now),/B2_SOURCE_GRAPH_NOT_PINNED/);
assert.throws(()=>startB2SourcePracticeChain(initial,'morning-town',now),/B2_NOT_A_P28_BENCHMARK/);
assert.throws(()=>startB2SourcePracticeChain(initial,'daily-errands',now),/B2_NOT_A_P28_BENCHMARK/);
assert.equal(P35_P30_B2_PRACTICE_CHAINS.every(x=>x.benchmarkEligible===false),true);
assert.equal(P35_P30_B2_PRACTICE_CHAINS.every(x=>x.provenance==='u70-p30-practice-composition'),true);
const originalIds=new Set(P35_P30_B2_SCENES);
assert.deepEqual(P35_P30_B2_PRACTICE_CHAINS.map(x=>x.scenarios),[
 ['project-crisis','work-policy-debate','team-conflict'],
 ['media-claim','civic-transport-debate','team-conflict']
]);
for(const fn of P35_LATER_B2_FUNCTIONS){
 const contexts=P35_SOURCE_SCENARIOS.filter(g=>g.level==='B2'&&Object.values(g.nodes)
  .some(node=>node?.rules?.some(rule=>rule.func===fn))).map(g=>g.id);
 assert.ok(contexts.length>=2,'B2 '+fn+' must have distinct authentic contexts');
}
let clock=now;
const sourceSamples:string[]=[];
let authoredMismatches=0;
for(const id of P35_P30_B2_SCENES){
 const graph=getP35SourceScenario(id)!;
 for(const [nodeId,node] of Object.entries(graph.nodes)){
  if(!node||node.end)continue;
  const sample=node.rules?.[0]?.sample;
  assert.ok(sample,'original P35 B2 source rule sample required');
  const match=matchSourceRule(graph,nodeId,sample!,{});
  const approved=matchingP35AuthoredExamples(graph,nodeId,{});
  assert.ok(approved.length>0,id+'/'+nodeId+' must offer a genuinely accepted original example');
  for(const phrase of approved)assert.equal(matchSourceRule(graph,nodeId,phrase,{}).status,'accepted');
  if(match.status!=='accepted'){
   authoredMismatches++;
   assert.ok(!approved.includes(sample!),'false-confidence original source example must not be offered');
  }
 }
}
assert.ok(authoredMismatches>=5,'pinned P35 B2 compact morphology mismatch remains honestly detected, not silently graded');
function advanceOriginalSource(state){
 const id=state.active?.scenarioId;
 const graph=id&&getP35SourceScenario(id);
 assert.ok(graph&&graph.level==='B2','only pinned B2 graphs are executed');
 const node=graph.nodes[state.active.nodeId];
 const rule=node?.rules?.[0];
 assert.ok(rule,'every original authored P35 B2 node must have a rule');
 const approved=matchingP35AuthoredExamples(graph,state.active.nodeId,state.active.slots);
 assert.ok(approved.length>0,graph.id+'/'+state.active.nodeId+
  ' must have at least one genuine original authored phrase accepted by its own pinned rule');
 const sample=approved[0];
 sourceSamples.push(sample);
 const match=matchSourceRule(graph,state.active.nodeId,sample,state.active.slots);
 assert.equal(match.status,'accepted',graph.id+'/'+state.active.nodeId+
  ' actual original source authored response must match; never substitute a fabricated answer');
 const result=respondSourceGraph(state,sample,++clock);
 assert.ok(result.outcome==='accepted'||result.outcome==='finished',
  graph.id+'/'+state.active.nodeId+' must be a genuine matched source turn');
 return result.state;
}
for(const id of P35_P30_B2_SCENES){
 const g=getP35SourceScenario(id);
 assert.ok(g&&g.level==='B2'&&g.variantCount>=4);
 assert.ok(g.requiredGoals.length>=5&&g.functions.length>=5);
 let state=startB2SourceGraph(initial,id,++clock);
 assert.equal(state.maxLevel,'A1','B2 practice must not change original course ceiling');
 assert.equal(state.active?.scenarioId,id);
 assert.equal(sourcePrompt(state.active),g.nodes[g.start]?.npcVariants?.[0]??g.nodes[g.start]?.npc);
 assert.throws(()=>startB2SourceGraph(state,id,++clock),/SOURCE_ALREADY_ACTIVE/);
 assert.throws(()=>startSourceMission(state,'daily-errands',++clock),/SOURCE_ALREADY_ACTIVE/);
 state=safeSourceGraphState(JSON.parse(JSON.stringify(state)));
 assert.equal(state.active?.scenarioId,id,'B2 practice interruption restored by canonical source state');
 let i=0;
 while(state.active&&i++<20)state=advanceOriginalSource(state);
 assert.ok(i<20,'original graph must finish without hidden loops: '+id);
 assert.equal(state.active,null);
 assert.equal(state.mission,null);
 assert.equal(state.history[0].scenarioId,id);
 assert.equal(state.history[0].complete,true);
 assert.ok(state.history[0].turns>=5,'complex P35 B2 source has substantive turns');
 assert.equal(state.maxLevel,'A1');
 assert.ok(state.evidence.every(e=>e.practiceOnly===true),'no source-turn CEFR or SRS grade');
 assert.ok(state.evidence.some(e=>P35_LATER_B2_FUNCTIONS.includes(e.functionId)),
  'advanced source function turns remain metadata-only');
 const replay=startB2SourceGraph(state,id,++clock);
 assert.equal(replay.active?.variant,1,'source-own variant rotates on next run');
 const assisted=sourceSupport(replay,2,++clock);
 const next=advanceOriginalSource(assisted);
 assert.ok(next.evidence.every(e=>e.practiceOnly));
 assert.equal(next.evidence.at(-1)?.credit,0,'authored model help must never look independent');
 assert.equal(cancelSourceGraph(next).active,null);
}
for(const chain of P35_P30_B2_PRACTICE_CHAINS){
 let state=startB2SourcePracticeChain(initial,chain.id,++clock);
 assert.equal(state.mission?.id,chain.id);
 assert.equal(state.active?.scenarioId,chain.scenarios[0]);
 assert.equal(state.maxLevel,'A1');
 let visited=0,roundtrips=0,steps=0;
 while(state.active&&steps++<30){
  if(state.mission?.index===1&&roundtrips===0){
   state=safeSourceGraphState(JSON.parse(JSON.stringify(state)));
   assert.equal(state.mission?.index,1,'original P35 B2 mission stage must survive reload');
   assert.equal(state.mission?.completed.length,1);
   assert.equal(state.mission.completed[0].scenarioId,chain.scenarios[0]);
   assert.equal(state.active?.scenarioId,chain.scenarios[1]);
   roundtrips++;
  }
  if(state.active.nodeId===getP35SourceScenario(state.active.scenarioId)?.start)visited++;
  state=advanceOriginalSource(state);
 }
 assert.ok(steps<30,'all 18+ authored source turns complete in bounded run');
 assert.equal(roundtrips,1,'B2 composed mission roundtrip must be genuine');
 assert.equal(visited,3);
 assert.equal(state.active,null);
 assert.equal(state.mission,null);
 assert.equal(state.missionHistory?.[0]?.missionId,chain.id);
 assert.equal(state.missionHistory?.[0]?.practiceOnly,true);
 assert.deepEqual(state.missionHistory?.[0]?.stages.map(x=>x.scenarioId),chain.scenarios);
 assert.equal(state.missionHistory?.[0]?.stages.length,3);
 assert.equal(state.maxLevel,'A1');
 assert.equal(state.history.length,3,'canonical source graph history tracks the three original scenes');
 const saved=JSON.stringify(state);
 for(const sample of sourceSamples)assert.ok(!saved.includes(sample),
  'source practice history must never persist learner transcript');
 assert.ok(!saved.includes('PRIVATE_LEARNER_TEXT'));
 const restored=safeSourceGraphState(JSON.parse(saved));
 assert.equal(restored.missionHistory?.[0]?.missionId,chain.id);
 assert.equal(restored.missionHistory?.[0]?.stages.length,3);
 assert.equal(restored.missionHistory?.[0]?.practiceOnly,true);
}
const paused=startB2SourcePracticeChain(initial,P35_P30_B2_PRACTICE_CHAINS[0].id,++clock);
const tampered=safeSourceGraphState({...paused,mission:{...paused.mission,id:'daily-errands'}});
assert.equal(tampered.mission,null,'unrelated lower-level P18 mission cannot attach to a B2 source active');
assert.equal(tampered.active?.scenarioId,'project-crisis','valid original source task preserved');
assert.ok(sourceSamples.length>=60,'actual authored multi-turn source corpus exercised');
console.log(JSON.stringify({schema:'u70-b2-original-communicative-practice',status:'PASS',
 originalP35B2Graphs:5,authoredFunctions:6,contextsPerFunction:'at-least-two',
 filteredOriginalAuthoredMismatches:authoredMismatches,
 originalB2ComposedPracticeChains:2,sourceTurns:sourceSamples.length,
 existingMissionEngine:true,backupRoundtrip:true,rawLearnerTextStored:false,
 originalP28B2Benchmark:false,p29Maintenance:false,originalCourseCeiling:'unchanged'}));
