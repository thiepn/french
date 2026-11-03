import assert from 'node:assert/strict';
import {ORIGINAL_B2_NEGOTIATIONS,resolveB2NegotiationSources,evaluateB2NegotiationMove,validateB2Negotiations}
 from '../app/src/core/unified/u48-b2-negotiation.ts';
import {ORIGINAL_REGISTRY_ENTRIES,getOriginalMaterial} from '../app/src/core/unified/u23-registry.ts';
import {ORIGINAL_FRENCH_U42_COURSE} from '../app/src/core/unified/u42-course.ts';
import {ORIGINAL_FRENCH_U22_COURSE} from '../app/src/core/unified/u22-course.ts';
import {ORIGINAL_U42_CONNECTED_READINGS} from '../app/src/core/unified/u42-material.ts';
import {originalU31OralJourney} from '../app/src/core/unified/u31-oral.ts';
import {originalU30Listening} from '../app/src/core/unified/u30-listening.ts';

assert.equal(ORIGINAL_REGISTRY_ENTRIES.length,259);
assert.equal(ORIGINAL_FRENCH_U42_COURSE.length,259);
assert.equal(ORIGINAL_U42_CONNECTED_READINGS.length,207);
assert.deepEqual(ORIGINAL_FRENCH_U42_COURSE.slice(0,244),ORIGINAL_FRENCH_U22_COURSE);
assert.deepEqual(validateB2Negotiations(),[],'each fictional challenge must bind to exact source-owned French turns');
assert.equal(ORIGINAL_B2_NEGOTIATIONS.length,3);
assert.deepEqual(ORIGINAL_B2_NEGOTIATIONS.map(x=>x.lesson),['transfer-151','transfer-152','transfer-153']);
for(const scene of ORIGINAL_B2_NEGOTIATIONS){
 const original=getOriginalMaterial(scene.lesson);
 const sources=resolveB2NegotiationSources(scene);
 assert.ok(original&&sources,'All four anchors must be exact original dialogue and distinct');
 assert.equal(sources.length,4);
 assert.equal(new Set(sources.map(x=>x.index)).size,4);
 for(let i=0;i<4;i++){
  assert.equal(sources[i].speaker,scene.sources[i].speaker);
  assert.equal(sources[i].fr,original.unit.dialogue[sources[i].index].fr);
  assert.ok(sources[i].fr.normalize('NFC').replace(/[‘’]/g,"'").toLocaleLowerCase('fr').includes(
   scene.sources[i].anchor.normalize('NFC').replace(/[‘’]/g,"'").toLocaleLowerCase('fr')));
 }
 assert.equal(scene.routes.length,2);
 for(const route of scene.routes){
  assert.equal(route.moves.length,2);
  assert.deepEqual(route.moves.map(x=>x.id),['grounded','overclaim']);
  assert.deepEqual(route.moves.map(x=>x.supported),[true,false]);
  assert.ok(route.interlocutor.includes('fictive'));
  assert.ok(route.question.length>=80);
  assert.ok(route.model.length>=280);
  assert.ok(route.criteria.length===4);
  for(const i of route.sourceIndices)assert.ok(i>=0&&i<sources.length);
  for(const move of route.moves){
   const result=evaluateB2NegotiationMove(move);
   assert.equal(result.supported,move.supported);
   assert.equal(result.feedback,move.feedback);
   assert.ok(result.feedback.length>=120);
   assert.ok(move.followUp.length>=75);
  }
 }
 const u31=originalU31OralJourney(scene.lesson),u30=originalU30Listening(scene.lesson);
 assert.ok(u31&&u30);
 assert.equal(u31.stages.length,7);
 assert.equal(u31.decisions.length,3);
 assert.equal(u30.decisions.filter(x=>x.contextualTurns?.length===3).length,2);
}
console.log('U48 original B2 151–153: three scenarios, six independent stakeholder priorities, 12 keyed negotiating consequences, six authored French final models, four exact original source turns per scene, historical 250/198 identities preserved, one additive 157 original unit/reading. No speech/CEFR grade or new persistence.');
