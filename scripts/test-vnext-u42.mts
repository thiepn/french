import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {
 ORIGINAL_REGISTRY_COUNTS,ORIGINAL_REGISTRY_ENTRIES,
 getOriginalCatalogEntry,getOriginalMaterial
} from '../app/src/core/unified/u23-registry.ts';
import {ORIGINAL_TRANSFER_SCENARIOS} from '../app/src/core/unified/u13-course.ts';
import {originalPlacementGrammarRefreshers} from '../app/src/core/unified/u27-placement.ts';

assert.equal(ORIGINAL_REGISTRY_COUNTS.lessons,244,'Original historical lesson inventory');
assert.equal(ORIGINAL_REGISTRY_COUNTS.connectedReadings,192,'Connected reading inventory');
assert.equal(new Set(ORIGINAL_REGISTRY_ENTRIES.map(e=>e.qualifiedId)).size,244,'Original source IDs remain unique');
const bands:{[key:string]:string}={};
for(const scenario of ORIGINAL_TRANSFER_SCENARIOS){
 const entry=getOriginalCatalogEntry(scenario.unit.id);
 assert.ok(entry,'Every original U13 source is discoverable');
 assert.equal(entry?.foundationBand,scenario.level,'Use original authorial grammar band, not an inferred CEFR grade');
 assert.equal(entry?.level,'B1','U13 complete source-comparison remains a cumulative B1 challenge');
 assert.deepEqual(entry?.prerequisites,scenario.unit.prerequisites,
  'Historical authored sequential prerequisites must not be rewritten');
 bands[entry!.id]=entry!.foundationBand!;
}
for(let n=1;n<=15;n++){
 const id='transfer-'+String(n).padStart(2,'0');
 const band=n<=4?'A1→A2':n<=9?'A2→B1':'B1 integrated';
 assert.equal(bands[id],band,'Source-authored levels keep their original bands');
}
for(let n=1;n<=10;n++){
 const id='transfer-'+String(n).padStart(2,'0');
 const entry=getOriginalCatalogEntry(id);
 for(const refresher of originalPlacementGrammarRefreshers(id)){
  const foundation=getOriginalCatalogEntry(refresher.id);
  assert.ok(foundation&&entry?.grammarRefreshers?.includes(refresher.id),
   'Optional grammar foundations must resolve to actual catalog sources');
  assert.notEqual(refresher.id,id,'A refresher must not be its own lesson');
 }
}
const expanded=[
 'a1-05','a1-06','a1-07','a1-08',
 'a2-05','a2-06','a2-07','a2-08','a2-19','a2-20','a2-21','a2-22',
 'b1-01','b1-02','b1-03','b1-04','b1-05','b1-06','b1-07','b1-08'
];
let addedExamples=0;
for(const id of expanded){
 const lesson=getOriginalMaterial(id)?.unit;
 assert.ok(lesson,'An original lesson cannot be replaced by a generated alternative');
 assert.equal(lesson!.grammar.length,2,'Preserve the two existing grammar explanations');
 for(const block of lesson!.grammar){
  assert.equal(block.examples.length,3,'Two inherited plus one new contextual example per grammar block');
  for(const [fr,en] of block.examples)assert.ok(fr.length>15&&en.length>15,'Bilingual contextual accuracy fields exist');
  addedExamples++;
 }
 assert.ok(lesson!.writing.criteria.length>=4,'An independent contextual revision step is included');
}
assert.equal(addedExamples,40);
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const content=readFileSync(resolve(root,'app/src/core/unified/u13-transfer-01-05.ts'),'utf8');
for(const [id,phrase] of [
 ['transfer-01','cinema ticket'],['transfer-02','study meeting'],
 ['transfer-03','headphones'],['transfer-04','bus route'],['transfer-05','two bicycles']
]){
 const at=content.indexOf('"id": "'+id+'"');
 const next=content.indexOf('"id": "transfer-',at+1);
 assert.ok(at>=0);
 assert.ok(content.slice(at,next<0?undefined:next).includes(phrase),
  'Different-context original U13 independent writing: '+id);
}
for(const number of [148,149,150]){
 const id='transfer-'+number;
 const lesson=getOriginalMaterial(id);
 assert.ok(lesson?.writingChoices?.fromSources?.prompt.includes('After comparing with the model'),
  'Early B2 authored source writing offers a second independent use of the model: '+id);
}
console.log('U42 source contracts: 244 original IDs / 192 readings, 15 authorial grammar bands, 40 bilingual grammar examples in 20 lessons, five everyday transfer prompts and three advanced source writing prompts.');
