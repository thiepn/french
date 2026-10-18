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

import {listP35PrivateDecks,listAllPrivateDecks,applyP35DeckMutation} from '../app/src/core/learner/private-decks.ts';
const originalP35={name:'Morning words',cardIds:['bonjour-canonical','user:original','starter:bonjour'],createdAt:1700000000000};
const envelope={customDecks:{'deck-legacy-a':originalP35,'deck:vnext:owned':owned}};
const recovered=listP35PrivateDecks(envelope);
assert.deepEqual(recovered.map(d=>d.id),['deck-legacy-a']);
assert.deepEqual(recovered[0].noteIds,originalP35.cardIds);
assert.equal(recovered[0].kind,'p35');
assert.equal(listAllPrivateDecks(envelope).length,2);
assert.equal(listP35PrivateDecks({customDecks:{broken:{name:'Mixed',cardIds:['valid',null],createdAt:1}}}).length,0);
const renamed=applyP35DeckMutation(originalP35,'rename','Travel French',[]);
assert.equal(renamed.name,'Travel French');
assert.deepEqual(renamed.cardIds,originalP35.cardIds);
const appended=applyP35DeckMutation(originalP35,'add','', ['new-canonical']);
assert.deepEqual(appended.cardIds,[...originalP35.cardIds,'new-canonical']);
const removed=applyP35DeckMutation(originalP35,'remove','', ['user:original']);
assert.deepEqual(removed.cardIds,['bonjour-canonical','starter:bonjour']);
assert.deepEqual(originalP35.cardIds,['bonjour-canonical','user:original','starter:bonjour']);
assert.deepEqual(Object.keys(originalP35).sort(),Object.keys(removed).sort());
