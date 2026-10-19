import assert from 'node:assert/strict';
import {
 P33_PAIRS,P33_EVALUATOR,P33_MIN_MS,P33_MAX_MS,P33_PREP_MS,
 evaluateP33Task,completeP33Pair,currentP33Evidence,normalizeP33Fields
} from '../app/src/core/learner/b2-oral.ts';
import {emptyB2Evidence,normalizeB2Evidence} from '../app/src/core/learner/b2-assessment.ts';

assert.equal(P33_PAIRS.length,3);
assert.equal(new Set(P33_PAIRS.flat().map(p=>p.id)).size,6);
assert.ok(P33_PAIRS.every(p=>p[0].mode==='immediate'&&p[1].mode==='brief-prep'));
assert.equal(P33_PREP_MS,20000);assert.equal(P33_MIN_MS,40000);assert.equal(P33_MAX_MS,105000);
const sample=(prompt)=>{
 const anchors=prompt.anchors.join(' et ');
 return [
  'Je recommande une solution prudente pour '+anchors+' en considérant les intérêts contradictoires des personnes concernées.',
  'Cependant, les responsables devraient reconnaître plusieurs risques et expliquer les conséquences possibles pour les équipes.',
  'Par exemple, une organisation pourrait tester deux approches différentes avant de modifier définitivement les règles collectives.',
  'Même si les avantages semblent considérables, une décision rigide risque de produire des résultats inattendus et des problèmes sociaux.',
  'Si les conditions changent, les personnes responsables devront consulter les intéressés et discuter des objectifs avec précision.',
  'Je veux dire, il faut aussi écouter les objections et vérifier les contraintes pratiques avant de proposer une mesure immédiate.',
  'Par conséquent, une expérimentation limitée devrait permettre une comparaison équitable et transparente des diverses options disponibles.',
  'En conclusion, je recommande une évaluation progressive, avec des critères définis et la possibilité explicite de revoir cette décision.'
 ].join(' ');
};
const start=1700000000000;
const speaking=(p,duration=60000,confidence=.88,operationalError=false)=>
 evaluateP33Task(p,[{text:sample(p),confidence,receivedAt:start+duration-500}],start,start+duration,operationalError);
const immediate=speaking(P33_PAIRS[0][0]),prepared=speaking(P33_PAIRS[0][1]);
assert.equal(immediate.status,'structural-targets-met');
assert.equal(prepared.status,'structural-targets-met');
assert.equal(immediate.evaluator,P33_EVALUATOR);
assert.ok(immediate.words>=80&&prepared.words>=85);
assert.ok(immediate.selfCorrections>=1,'explicit reformulation must be detected, not penalized');
assert.equal(speaking(P33_PAIRS[0][0],39000).status,'insufficient','40 seconds is a hard gate');
assert.equal(speaking(P33_PAIRS[0][0],106000).status,'insufficient','105 seconds maximum');
assert.equal(speaking(P33_PAIRS[0][0],60000,.13).status,'unscored','ASR below confidence threshold abstains');
assert.equal(speaking(P33_PAIRS[0][0],60000,0).status,'unscored','missing recognition confidence abstains');
assert.equal(speaking(P33_PAIRS[0][0],60000,.85,true).status,'unscored','recognition error abstains');
assert.equal(evaluateP33Task(P33_PAIRS[0][0],[],start,start+60000).status,'unscored','text cannot substitute for final speech-recognition segments');
assert.equal(evaluateP33Task(P33_PAIRS[0][0],[{text:'Je pense.',confidence:.9,receivedAt:start+45000}],start,start+60000).status,'insufficient');
const digest='a'.repeat(64);
const pair=completeP33Pair(immediate,prepared,digest,start+61000);
assert.equal(pair.status,'structural-targets-met');
assert.ok(currentP33Evidence([pair],digest,true,start+61000));
assert.equal(currentP33Evidence([pair],digest,false,start+61000),null,'P31/P32 current chain required');
assert.equal(currentP33Evidence([pair],'b'.repeat(64),true,start+61000),null,'P32 source changed');
assert.equal(currentP33Evidence([pair],digest,true,start+61000+36*86400000),null,'35-day expiry');
const unscored=completeP33Pair(immediate,speaking(P33_PAIRS[0][1],60000,.01),digest,start+62000);
assert.ok(currentP33Evidence([pair,unscored],digest,true,start+62000),'later ASR abstention does not supersede older current pass');
const failed=completeP33Pair(immediate,speaking(P33_PAIRS[0][1],41000),digest,start+63000);
assert.equal(currentP33Evidence([pair,failed],digest,true,start+64000),null,'newer scored failure supersedes older pass');
assert.throws(()=>completeP33Pair(immediate,speaking(P33_PAIRS[1][1]),digest,start+62000),/ORIGINAL_PAIR/);
const session={id:'first-original-session',pair:0,cursor:1,at:start,
 first:immediate,prepStartedAt:start+61000};
const learner={...emptyB2Evidence(),oralHistory:[pair],oralSession:session};
const normalized=normalizeB2Evidence(JSON.parse(JSON.stringify(learner)));
assert.ok(normalized);
assert.deepEqual(JSON.parse(JSON.stringify(normalized)),JSON.parse(JSON.stringify(learner)));
assert.equal(normalizeB2Evidence({...learner,oralSession:{...session,cursor:1,first:undefined}}),null,'invalid resumed second task rejected');
assert.equal(normalizeP33Fields({oralHistory:[{...pair,tasks:[{...immediate,transcript:'UNSAVED_AUDIO_LEAK'},prepared]}]})?.oralHistory?.[0].tasks[0].promptId,immediate.promptId);
assert.ok(!JSON.stringify(normalized).includes('Je recommande une solution'));
assert.ok(!JSON.stringify(normalized).includes('Je veux dire'));
assert.equal(normalizeP33Fields({oralHistory:[{...pair,tasks:[{...immediate,evaluator:'future'},prepared]}]}),null);
console.log(JSON.stringify({schema:'u67-p33-native-oral',status:'PASS',prompts:6,
 twoTasks:'immediate+20s-prep',minMs:P33_MIN_MS,maxMs:P33_MAX_MS,
 observed:'ASR confidence, rate, pauses, reformulations',persistedProse:false,sourceBound:true}));
