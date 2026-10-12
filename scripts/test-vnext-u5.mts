import assert from 'node:assert/strict';
import {INTEGRATED_MISSIONS,missionForId,missionForJourney,validateIntegratedMissions} from '../app/src/core/unified/u5-missions.ts';
import {missionEvent,missionFingerprint,exportMissionCheckpoint,inspectMissionCheckpoint,reviewAdvice,
 latestMissionRatings,validateMissionHandoff} from '../app/src/core/unified/u5-review.ts';
import {ORIGINAL_JOURNEYS} from '../app/src/core/unified/u4-journeys.ts';
import {ORIGINAL_PATH_LESSONS} from '../app/src/core/unified/u3-pathways.ts';
import {SOURCES} from '../app/src/core/unified/source.ts';
assert.deepEqual(validateIntegratedMissions(),[]);
assert.deepEqual(validateMissionHandoff(),[]);
assert.equal(INTEGRATED_MISSIONS.length,4);
assert.equal(new Set(INTEGRATED_MISSIONS.flatMap(m=>m.steps.map(s=>s.id))).size,16);
assert.equal(new Set(INTEGRATED_MISSIONS.map(m=>m.journeyId)).size,ORIGINAL_JOURNEYS.length);
assert.equal(missionForJourney('travel-day')?.id,'travel-and-change');
assert.equal(missionForId('missing'),null);
for(const mission of INTEGRATED_MISSIONS){
 assert.equal(mission.steps.length,4);
 assert.deepEqual(mission.steps.map(step=>step.mode),['reading','speaking-rehearsal','writing','transfer']);
 assert.equal(mission.sourceRevision,SOURCES.original.revision);
 for(const step of mission.steps){
  assert.equal(step.source.source,'original');
  assert.equal(step.source.rights,'original-owned');
  assert.ok(step.source.qualifiedId.startsWith('fru1:original@'));
  const lesson=ORIGINAL_PATH_LESSONS.find(l=>l.id===step.lessonId);
  assert.ok(lesson);
  assert.ok(ORIGINAL_JOURNEYS.find(j=>j.id===mission.journeyId)?.lessonIds.includes(step.lessonId));
  if(step.mode==='reading'){
   assert.ok(lesson?.dialogue.some(d=>d.fr===step.reference));
   assert.ok(step.options.includes(step.expected??''));
  }
  if(step.mode==='writing'||step.mode==='speaking-rehearsal'){
   assert.equal(step.expected,null);
   assert.ok(step.criteria.length>=3);
  }
 }
}
assert.ok(missionFingerprint().startsWith('fnv1a32-'));
const mission=INTEGRATED_MISSIONS[0],steps=mission.steps;
assert.equal(reviewAdvice(mission.id,[])?.kind,'continue');
assert.equal(reviewAdvice(mission.id,[])?.stepId,steps[0].id);
const needs=missionEvent(1,mission.id,steps[0].id,'needs-review')!;
assert.equal(reviewAdvice(mission.id,[needs])?.kind,'retry');
assert.equal(reviewAdvice(mission.id,[needs])?.grammarId,steps[0].grammarId);
const assisted=missionEvent(2,mission.id,steps[0].id,'assisted-claim')!;
assert.equal(reviewAdvice(mission.id,[needs,assisted])?.kind,'independent-practice');
const independent=missionEvent(3,mission.id,steps[0].id,'independent-claim')!;
assert.equal(reviewAdvice(mission.id,[needs,assisted,independent])?.kind,'continue');
assert.equal(reviewAdvice(mission.id,[needs,assisted,independent])?.stepId,steps[1].id);
const completed=steps.map((step,i)=>missionEvent(i+1,mission.id,step.id,'independent-claim')!);
assert.equal(reviewAdvice(mission.id,completed)?.kind,'finished');
assert.equal(latestMissionRatings(mission,[needs,assisted]).get(steps[0].id),'assisted-claim');
assert.equal(missionEvent(0,mission.id,steps[0].id,'needs-review'),null);
assert.equal(missionEvent(1,mission.id,'invalid','needs-review'),null);
assert.equal(missionEvent(1,'fake',steps[0].id,'needs-review'),null);
assert.equal(missionEvent(97,mission.id,steps[0].id,'needs-review'),null);
const exportFile=exportMissionCheckpoint([needs,assisted,independent]);
assert.equal(exportFile.approved,false);
assert.equal(exportFile.authoritative,false);
assert.equal(exportFile.custody,'self-reported-local-only');
assert.equal(exportFile.sourceRevision,SOURCES.original.revision);
assert.equal(exportFile.missionFingerprint,missionFingerprint());
assert.ok(!JSON.stringify(exportFile).includes('Bonjour, je voudrais'),'no authored reading prose is in the handoff');
const inspected=inspectMissionCheckpoint(JSON.stringify(exportFile));
assert.equal(inspected.status,'valid');
assert.equal(inspected.events.length,3);
assert.equal(inspected.authoritative,false);
assert.equal(inspected.verifiedPerformance,false);
assert.equal(reviewAdvice(mission.id,inspected.events)?.stepId,steps[1].id);
const blocked=(patch:Record<string,unknown>)=>{
 const result=inspectMissionCheckpoint(JSON.stringify({...exportFile,...patch}));
 assert.equal(result.status,'blocked');assert.deepEqual(result.events,[]);
};
blocked({approved:true});
blocked({authoritative:true});
blocked({sourceRevision:'stale'});
blocked({missionFingerprint:'fake'});
blocked({unknown:'dangerous'});
blocked({events:[{...needs,sequence:2}]});
blocked({events:[needs,{...assisted,stepId:'forged'}]});
blocked({events:[needs,{...assisted,approved:true}]});
blocked({events:[{...needs,rating:'verified-mastered'}]});
blocked({events:Array.from({length:97},(_,i)=>({...needs,sequence:i+1}))});
assert.equal(inspectMissionCheckpoint('invalid json').status,'blocked');
assert.equal(inspectMissionCheckpoint(' '.repeat(32769)).status,'blocked');
assert.throws(()=>exportMissionCheckpoint(Array.from({length:97},()=>needs)),/Too many/);
assert.equal(inspectMissionCheckpoint(JSON.stringify({...exportFile,events:[]})).status,'valid');
console.log(JSON.stringify({schema:'thiepn-french-u5-deterministic',status:'PASS',missions:4,steps:16,
 rights:'original-only',sourceRevision:SOURCES.original.revision,checkpointTrusted:false,canonicalWrites:false}));
