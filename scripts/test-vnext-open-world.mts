import assert from 'node:assert/strict';
import {sanitizeOpenWorldText,openWorldTokens,normalizeOpenWorldHistory,analyzeOpenWorld,appendOpenWorldExposure,
  OPEN_WORLD_MAX_CHARS,OPEN_WORLD_MAX_FILE_BYTES} from '../app/src/core/learner/open-world.ts';
assert.equal(sanitizeOpenWorldText('ab\u0000cd'),'abcd');
assert.equal(sanitizeOpenWorldText('x'.repeat(25000)).length,OPEN_WORLD_MAX_CHARS);
assert.equal(OPEN_WORLD_MAX_FILE_BYTES,262144);
assert.deepEqual(openWorldTokens("C'est très bien"),["C'est","très","bien"]);
const text='Bonjour ami inconnu '.repeat(9);
const report=analyzeOpenWorld(text,w=>w==='Bonjour'?'known':w==='ami'?'learning':undefined);
assert.equal(report.words,27);assert.equal(report.known,9);
assert.equal(report.learning,9);assert.equal(report.unmapped,9);
const history=appendOpenWorldExposure({},report,'paste',5,1700000000000,'open-1');
assert.equal(history.sessions.length,1);
const hostile=normalizeOpenWorldHistory({sessions:[{...history.sessions[0],text:'private text',source:'private URL',title:'private title',transcript:'private voice',knownPct:200}]});
assert.equal(hostile.sessions[0].knownPct,100);
const json=JSON.stringify(hostile);
for(const secret of ['private text','private URL','private title','private voice'])
  assert.equal(json.includes(secret),false,'no raw personal content in persisted schema');
const repeated=Array.from({length:125},(_,i)=>({...history.sessions[0],id:'session-'+i}));
assert.equal(normalizeOpenWorldHistory({sessions:repeated}).sessions.length,120);
assert.throws(()=>appendOpenWorldExposure({},analyzeOpenWorld('Bonjour',()=>undefined),'paste',0,1,'bad'),/20/);
assert.equal(JSON.stringify(history).includes(text),false);
console.log(JSON.stringify({schema:'french-p37i-d5-p21',ok:true,rawSessionOnly:true,aggregateOnly:true,cap:120,srsCredit:false}));
