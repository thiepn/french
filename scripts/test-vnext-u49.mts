import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {normalizeUserVocabularyInput,listUserVocabularyCards} from '../app/src/core/learner/user-vocabulary-model.ts';
const input=normalizeUserVocabularyInput({fr:'  l’école  ',en:' school ',exampleFr:' Mon école ',exampleEn:' My school '});
assert.equal(input.fr,'l’école');
assert.equal(input.en,'school');
assert.throws(()=>normalizeUserVocabularyInput({fr:' ',en:'meaning'}),/FRENCH_AND_MEANING_REQUIRED/);
assert.throws(()=>normalizeUserVocabularyInput({fr:'bonjour',en:'x'.repeat(201)}),/INVALID_CARD_TEXT/);
const list=listUserVocabularyCards({userCards:{
  'historical-owned':{word:'salut',meaning:'hello',example:'Salut, Nina !'},
  'user:vnext:fixture':{fr:'pomme',en:'apple'},
  malformed:{fr:'',en:'empty'}
}});
assert.deepEqual(list.map(x=>x.id),['user:vnext:fixture','historical-owned']);
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=(path:string)=>readFileSync(resolve(root,path),'utf8');
const storage=read('app/src/core/learner/user-vocabulary.ts');
const builder=read('app/src/core/learner/study-session-builder.ts');
const words=read('app/src/routes/words.ts');
assert.ok(storage.includes("db.transaction(['user-content','srs'],'readwrite')"));
assert.ok(storage.includes("newRecognitionRecord(id)"));
assert.ok(storage.includes("state.userCards[id]={...prior,...cleaned}"));
assert.ok(builder.includes('createSelectedVocabularySession'));
assert.ok(builder.includes('pacingDecision')&&builder.includes('claimActiveStudySession(session'));
assert.ok(builder.includes('claimActiveStudySession(session,[...staged,...fresh]'));
assert.ok(builder.includes('claimActiveStudySession(session,fresh'));
assert.ok(!builder.includes('writeActiveStudySession(session)'));
const repository=read('app/src/core/learner/repository.ts');
assert.ok(repository.includes("db.transaction(['session','srs'],'readwrite')"));
assert.ok(repository.includes("if(active&&active.cursor<active.queueIds.length)"));
assert.ok(repository.includes("if(lookup.result===undefined)srs.put(row,row.id)"));
assert.ok(!builder.includes('await ensureNewRecognitionRecords('));
assert.ok(!builder.includes('await ensureSkillRecord('));
assert.ok(words.includes('Study my words')&&words.includes('createSelectedVocabularySession'));
assert.ok(words.includes('saveUserVocabularyCard')&&words.includes('navigate(\'review\')'));
assert.ok(!read('app/src/core/content/review-content.ts').includes('userContentPromise'));
console.log('U49 custom vocabulary model, owner-store atomicity and native study integration: PASS');
