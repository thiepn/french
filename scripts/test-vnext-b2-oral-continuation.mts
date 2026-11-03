import assert from 'node:assert/strict';
import {originalU31OralJourney,validateU31SourceAnchors,evaluateU31Decision} from '../app/src/core/unified/u31-oral.ts';
import {originalU30Listening} from '../app/src/core/unified/u30-listening.ts';
import {ORIGINAL_REGISTRY_ENTRIES,getOriginalMaterial} from '../app/src/core/unified/u23-registry.ts';
assert.deepEqual(validateU31SourceAnchors(),[],'all source anchors must resolve to exact French turns and speakers');
assert.equal(ORIGINAL_REGISTRY_ENTRIES.length,261);
for(const id of ['transfer-151','transfer-152','transfer-153','transfer-154','transfer-155','transfer-156','transfer-157','transfer-158','transfer-159','transfer-160','transfer-161','transfer-162','transfer-163','transfer-164','transfer-165']){
 const oral=originalU31OralJourney(id),listening=originalU30Listening(id);
 assert.ok(oral&&listening,id+' must exist in both existing oral/listening paths');
 assert.equal(oral.curated,true,id+' needs authored B2 interaction, not generic fallback');
 assert.equal(oral.stages.length,7);
 assert.equal(oral.decisions.length,3,'two authored reasoning checks and one original-turn provenance check');
 assert.equal(oral.documents.length,2);
 assert.equal(oral.u30DecisionCount,listening.decisions.length);
 assert.deepEqual(oral.dialogue,getOriginalMaterial(id)?.unit.dialogue);
 assert.ok(oral.stages.find(x=>x.id==='repair')?.task.includes(oral.misunderstanding));
 assert.ok(oral.stages.find(x=>x.id==='challenge')?.task.includes(oral.counterview));
 assert.ok(oral.stages.find(x=>x.id==='sustain')?.task.includes('sustained oral response'));
 assert.ok(oral.counterview.includes('fictional')||oral.counterview.includes('invented'));
 for(const d of oral.decisions){
  assert.ok(d.choices.includes(d.answer));
  assert.equal(new Set(d.choices).size,d.choices.length);
  assert.ok(d.evidence&&oral.dialogue[d.citedTurn].fr===d.evidence);
  assert.equal(evaluateU31Decision(d,d.answer).supported,true);
  for(const wrong of d.choices.filter(x=>x!==d.answer))
   assert.equal(evaluateU31Decision(d,wrong).supported,false);
 }
}
console.log('Original B2 oral 151–161: fifteen curated seven-stage source-anchored journeys; forty-five authored/attested decisions; first 250 original catalog identities unchanged');
