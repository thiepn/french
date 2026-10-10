import assert from 'node:assert/strict';
import {P35_SOURCE_SCENARIOS,getP35SourceScenario} from '../app/src/core/conversation/p35-graphs.ts';
import {P35_P18_MISSIONS,P35_P20_FUNCTIONS} from '../app/src/core/conversation/source-parity.ts';
import {emptySourceGraphState,startSourceGraph,startSourceMission,sourceSupport,
 sourcePrompt,foldSource,matchSourceRule,validateSourceGraphs,respondSourceGraph,
 safeSourceGraphState,cancelSourceGraph} from '../app/src/core/conversation/p35-runtime.ts';

const now=1_780_000_000_000,initial=emptySourceGraphState();
assert.equal(P35_SOURCE_SCENARIOS.length,19,'original 19 pinned graph objects');
assert.equal(P35_P20_FUNCTIONS.length,25,'original P20 identities');
assert.deepEqual(validateSourceGraphs(),[],'no unresolved source node or rule edge');
assert.ok(P35_SOURCE_SCENARIOS.some(g=>Object.values(g.nodes).some(n=>n.rules?.some(r=>r.skipIfSlot))),
 'real source slot-branching rules retained');
assert.throws(()=>startSourceGraph(initial,'work-policy-debate',now),/SOURCE_GRAPH_NOT_AUTHORIZED/);
assert.throws(()=>startSourceGraph(initial,'train-ticket',now),/SOURCE_LEVEL_LOCKED/);
assert.throws(()=>startSourceMission(initial,'arrival-day',now),/SOURCE_MISSION_LEVEL_LOCKED/);
assert.throws(()=>startSourceMission(initial,'unknown',now),/UNKNOWN_SOURCE_MISSION/);
const g=getP35SourceScenario('cafe-order');
assert.ok(g);if(!g)throw Error('source scenario missing');
assert.equal(g.nodes.order.rules?.[0].skipIfSlot,'size');
assert.equal(g.nodes.order.rules?.[0].skipNext,'confirm');
assert.equal(g.variantCount,3);
assert.equal(matchSourceRule(g,'order','un café',{}).status,'uncertain','short non-goal utterance abstains');
assert.equal(matchSourceRule(g,'order','cest anglais uniquement',{}).status,'uncertain','no invented open semantic pass');
const first=matchSourceRule(g,'order','Bonjour, je voudrais un café, s’il vous plaît.',{});
assert.equal(first.status,'accepted');
assert.equal(first.next,'size');
const skipped=matchSourceRule(g,'order','Bonjour, je voudrais un grand café, s’il vous plaît.',{});
assert.equal(skipped.next,'confirm','slot-filled original graph skips size node');
assert.equal(skipped.slots.size,'grand');
let state=startSourceGraph(initial,'cafe-order',now);
assert.equal(sourcePrompt(state.active!),g.nodes.order.npcVariants?.[0]);
assert.throws(()=>startSourceGraph(state,'bakery-buy',now+1),/SOURCE_ALREADY_ACTIVE/);
let r=respondSourceGraph(state,'Bonjour, je voudrais un grand café, s’il vous plaît.',now+2);
assert.equal(r.outcome,'accepted');
state=r.state;
assert.equal(state.active?.nodeId,'confirm','source skip edge used by actual runtime');
assert.ok(state.active?.goals.includes('detail'),'source skipped goal satisfied by explicitly captured slot');
assert.equal(state.evidence.length,1);
assert.equal(state.evidence[0].functionId,'request');
assert.equal(state.evidence[0].practiceOnly,true);
assert.ok(state.evidence[0].credit<1,'never issue full P35 scorer parity credit');
state=respondSourceGraph(state,'Oui, c’est tout, merci.',now+3).state;
assert.equal(state.active,null);
assert.equal(state.history[0].complete,true);
assert.equal(state.history[0].turns,2,'original source branch is shorter than fixed native 3-turn script');
assert.deepEqual(state.history[0].scenarioId,'cafe-order');
assert.equal(JSON.stringify(state).includes('un grand café'),false,'never persist typed responses');
const second=startSourceGraph(state,'cafe-order',now+4);
assert.equal(second.active?.variant,1);
assert.notEqual(sourcePrompt(second.active!),g.nodes.order.npcVariants?.[0]);
let repaired=startSourceGraph(initial,'cafe-order',now+10);
r=respondSourceGraph(repaired,'Pardon, pouvez-vous répéter ?',now+11);
assert.equal(r.outcome,'repair');
assert.equal(r.state.active?.nodeId,'order');
assert.equal(r.state.active?.support,1);
assert.equal(r.state.evidence.at(-1)?.functionId,'clarify');
assert.equal(r.state.evidence.at(-1)?.credit,0,'repair is an observed move not grade');
repaired=safeSourceGraphState(JSON.parse(JSON.stringify(r.state)));
assert.equal(repaired.evidence.length,1,'zero credit repair event survives backup restore');
repaired=sourceSupport(repaired,2,now+12);
repaired=respondSourceGraph(repaired,'Bonjour, je voudrais un café, s’il vous plaît.',now+13).state;
assert.equal(repaired.evidence.at(-1)?.credit,0,'model revealed: proficiency evidence withheld');
assert.equal(repaired.evidence.at(-1)?.independent,false);
assert.equal(cancelSourceGraph(repaired).active,null);
const forgery=safeSourceGraphState({...state,evidence:[
 {...state.evidence[0],functionId:'synthesize'},
 {...state.evidence[0],credit:1},
 {...state.evidence[0],practiceOnly:false},
 {...state.evidence[0],independent:false}
]});
assert.equal(forgery.evidence.length,0,'tampered imported credit, mapping and practice flags excluded');
let mission=startSourceMission(initial,'daily-errands',now+20);
let t=now+20;
assert.equal(mission.mission?.index,0);
for(let phase=0;phase<3;phase++){
 const source=getP35SourceScenario(P35_P18_MISSIONS[0].scenarios[phase]);
 assert.ok(source);
 if(phase===1){
  mission=safeSourceGraphState(JSON.parse(JSON.stringify(mission)));
  assert.equal(mission.mission?.index,1,'interrupt/reload restores exact source mission stage');
  assert.equal(mission.mission?.completed[0]?.scenarioId,'bakery-buy');
 }
 let count=0;
 while(mission.active?.scenarioId===source?.id&&count++<12){
  const node=source?.nodes[mission.active.nodeId],rule=node?.rules?.[0];
  assert.ok(rule,'source node contains original candidate rule');
  const answer=rule?.sample??'';
  const trial=respondSourceGraph(mission,answer,++t);
  assert.notEqual(trial.outcome,'uncertain',source?.id+'/'+mission.active.nodeId+' original source sample should be accepted');
  mission=trial.state;
 }
 assert.ok(count<12,'no accidental graph cycles');
}
assert.equal(mission.active,null);
assert.equal(mission.mission,null);
assert.equal(mission.history.length,3);
assert.equal(mission.history[0].scenarioId,'opening-hours');
assert.equal(mission.history[1].scenarioId,'cafe-order');
assert.equal(mission.history[2].scenarioId,'bakery-buy');
assert.equal(JSON.stringify(mission).includes('Bonjour !'),false,'no raw partner/learner dialogue retained in history');
console.log(JSON.stringify({schema:'thiepn-french-b7-original-graph',ok:true,
 pinnedOriginalGraphs:19,sourceMissions:5,originalFunctions:25,sourceBranches:true,
 sourceVariantRotation:true,repairEvidenceZeroCredit:true,graphPersistence:true,
 modelHintZeroCredit:true,tamperedImportsDenied:true,noTranscriptRetention:true}));
