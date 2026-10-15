import assert from 'node:assert/strict';
import {privateDeckTitle,listNativePrivateDecks,updateDeckMembers} from '../app/src/core/learner/private-decks.ts';
assert.equal(privateDeckTitle('  Food  & drinks  '),'Food & drinks');
assert.throws(()=>privateDeckTitle(' '.repeat(3)),/INVALID_DECK_TITLE/);
assert.throws(()=>privateDeckTitle('x'.repeat(65)),/INVALID_DECK_TITLE/);
const owned={schema:'thiepn-french-private-deck-v1',id:'deck:vnext:owned',title:'Food',noteIds:['user:a','user:b'],createdAt:1,updatedAt:2};
assert.deepEqual(listNativePrivateDecks({customDecks:{
 'deck:vnext:owned':owned,
 legacy:{title:'Opaque P35 collection',cards:['user:a']},
 'deck:vnext:spoof':{...owned,id:'wrong'}
}}).map(x=>x.id),['deck:vnext:owned']);
assert.deepEqual(updateDeckMembers(['a','b'],['b','c'],'add'),['a','b','c']);
assert.deepEqual(updateDeckMembers(['a','b','c'],['b'],'remove'),['a','c']);
console.log('U49 native owned deck parsing, legacy isolation, member add/remove: PASS');
