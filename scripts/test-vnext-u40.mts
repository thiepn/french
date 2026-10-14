import assert from 'node:assert/strict';
import {crosswalkOriginalVocabulary} from '../app/src/core/unified/u40-lexical-bridge.ts';
import {originalVocabularyForUnit} from '../app/src/core/unified/u28-vocabulary.ts';
import type {VocabularySearchRow} from '../app/src/core/content/loader.ts';

const source=originalVocabularyForUnit('a1-01');
assert.ok(source.length>=12,'original A1 lesson remains source-owned');
const first=source.find(item=>item.french==='bonjour');
assert.ok(first,'the original greeting has not changed');
const row=(id:string,meaning:string):VocabularySearchRow=>({
 id,word:'bonjour',meaning,ipa:'',pos:'',article:'',gender:'',
 level:'A1',order:1,packId:'fixture-canonical'
});
let matched=crosswalkOriginalVocabulary('a1-01',[row('real-canonical-note','hello')]);
assert.equal(matched.links.find(link=>link.source.key===first.key)?.native?.id,'real-canonical-note');
assert.equal(matched.matched,1);
matched=crosswalkOriginalVocabulary('a1-01',[row('meaning-conflict','a fireplace')]);
assert.equal(matched.links.find(link=>link.source.key===first.key)?.status,'unmatched');
matched=crosswalkOriginalVocabulary('a1-01',[
 row('duplicate-1','hello'),row('duplicate-2','hello')
]);
assert.equal(matched.links.find(link=>link.source.key===first.key)?.status,'ambiguous');
assert.equal(matched.links.find(link=>link.source.key===first.key)?.native,null);
matched=crosswalkOriginalVocabulary('a1-01',[]);
assert.equal(matched.matched,0);
assert.equal(matched.unmatched,source.length);
assert.equal(new Set(source.map(item=>item.key)).size,source.length);
console.log('U40 source→canonical exact and ambiguous matching fixture assertions complete.');
