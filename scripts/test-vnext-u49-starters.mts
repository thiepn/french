import assert from 'node:assert/strict';
import {resolveP35StarterLinks,eligibleSourceDeckIds} from '../app/src/core/learner/p35-starter-links.ts';
const original=[
 {id:'source:bonjour',word:'bonjour'},
 {id:'source:cafe',word:'café'},
 {id:'source:salut-1',word:'salut'},
 {id:'source:salut-2',word:'salut'},
 {id:'source:pain',word:'pain'}
];
const stored=['starter:bonjour','starter:café','starter:cafe','starter:salut',
 'starter:unknown','source:pain','user:private'];
const links=resolveP35StarterLinks(stored,original);
assert.deepEqual(links.map(x=>x.status),[
 'unique-starter','unique-starter','missing','ambiguous','missing','canonical','missing']);
assert.equal(links[0].resolvedId,'source:bonjour');
assert.equal(links[1].resolvedId,'source:cafe');
assert.equal(links[3].resolvedId,null);
const eligible=eligibleSourceDeckIds(stored,original,new Set(['user:private']));
assert.deepEqual(eligible.eligibleIds,['source:bonjour','source:cafe','source:pain','user:private']);
assert.equal(eligible.aliased,2);
assert.equal(eligible.unresolved,2);
assert.equal(eligible.ambiguous,1);
assert.deepEqual(stored,['starter:bonjour','starter:café','starter:cafe','starter:salut',
 'starter:unknown','source:pain','user:private']);
console.log('Source P35 starter ID resolution: unique only, non-destructive, ambiguity-safe PASS');
