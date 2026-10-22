import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {FRENCH_REFERENCE_VISUALS,originalFrenchReferenceImage} from '../app/src/routes/u28-shared-visuals.ts';
import {originalVocabularyForUnit} from '../app/src/core/unified/u28-vocabulary.ts';

const expected=[
  {
    "unit": "a1-02",
    "position": 8,
    "word": "étudiant",
    "asset": "student.svg",
    "conceptId": "person.student-with-book",
    "alt": "Illustration of a student carrying a schoolbook",
    "sha": "14dc2b0419bb55fd2632c6912a5223f951726e50"
  },
  {
    "unit": "a1-02",
    "position": 9,
    "word": "étudiante",
    "asset": "student.svg",
    "conceptId": "person.student-with-book",
    "alt": "Illustration of a student carrying a schoolbook",
    "sha": "14dc2b0419bb55fd2632c6912a5223f951726e50"
  },
  {
    "unit": "a1-02",
    "position": 10,
    "word": "professeur",
    "asset": "teacher.svg",
    "conceptId": "person.teacher-at-board",
    "alt": "Illustration of a teacher pointing at a classroom board",
    "sha": "ddcd6ec5d04ef4be9d854ad788994f146bab0009"
  },
  {
    "unit": "a1-03",
    "position": 1,
    "word": "un livre",
    "asset": "book.svg",
    "conceptId": "object.book",
    "alt": "Illustration of a closed book",
    "sha": "cbb6d7d4f16af1c24a5d20dd053ef9b67e53f20b"
  },
  {
    "unit": "a1-03",
    "position": 4,
    "word": "une école",
    "asset": "school.svg",
    "conceptId": "place.school",
    "alt": "Illustration of a multistory school with classroom windows and a clock",
    "sha": "a108414c725998dc75af0e9b72f125967769c7f0"
  },
  {
    "unit": "a1-03",
    "position": 5,
    "word": "un sac",
    "asset": "bag.svg",
    "conceptId": "object.handled-bag",
    "alt": "Illustration of a handled bag",
    "sha": "325ee8361196852997525941bc1da6983f3c513e"
  }
];
const keyPrefix="fru1:original@unified-u1-original-v1:session:u6-";

test('Phase 5 — exactly six attested original French U28 keys, not free-text or native learner IDs',()=>{
 assert.equal(Object.keys(FRENCH_REFERENCE_VISUALS).length,6);
 for(const row of expected){
  const words=originalVocabularyForUnit(row.unit);
  const item=words[row.position-1];
  assert.ok(item,'Missing source original at '+row.unit+'/'+row.position);
  assert.equal(item.key,keyPrefix+row.unit+'#vocab-'+String(row.position).padStart(2,'0'));
  assert.equal(item.french,row.word);
  const image=originalFrenchReferenceImage(item.key);
  assert.ok(image);
  assert.equal(image.src,'/visual-lexicon/assets/'+row.asset);
  assert.equal(image.conceptId,row.conceptId);
  assert.equal(image.alt,row.alt);
  assert.equal(image.blobSha,row.sha);
  assert.equal(image.loading,'lazy');assert.equal(image.decoding,'async');
  assert.equal(image.width,320);assert.equal(image.height,240);
 }
 for(const key of ['pomme','livre','fru1:original@unified-u1-original-v1:session:u6-a1-03#vocab-02',
  'custom-card:student','__proto__','constructor','']){
  assert.equal(originalFrenchReferenceImage(key),null,'Unexpected guessed image '+key);
 }
});
test('Phase 5 — all five original SVGs retain identical Japanese provenance, no remote content',()=>{
 assert.equal(new Set(expected.map(row=>row.asset)).size,5);
 for(const asset of new Set(expected.map(row=>row.asset))){
  const bytes=readFileSync(new URL('../app/public/visual-lexicon/assets/'+asset,import.meta.url));
  const gitBlob=createHash('sha1').update('blob '+bytes.length+'\\0').update(bytes).digest('hex');
  assert.equal(gitBlob,expected.find(row=>row.asset===asset).sha);
  const svg=bytes.toString('utf8');
  assert.match(svg,/<svg\\b/);
  assert.doesNotMatch(svg,/<script\\b|<foreignObject\\b|<image\\b|\\son[a-z]+\\s*=|\\shref\\s*=|url\\s*\\(/i);
 }
});
test('Phase 5 — visual is only mounted in discovery and has text-preserving failure fallback',()=>{
 const route=readFileSync(new URL('../app/src/routes/u28-vocabulary-panel.ts',import.meta.url),'utf8');
 const discover=route.slice(route.indexOf('const renderDiscover='),route.indexOf('const renderRetrieve='));
 const recall=route.slice(route.indexOf('const renderRetrieve='),route.indexOf('const renderTransfer='));
 const transfer=route.slice(route.indexOf('const renderTransfer='),route.indexOf('function draw(){'));
 assert.match(discover,/originalFrenchReferenceImage\\(item\\.key\\)/);
 assert.match(discover,/image\\.addEventListener\\('error',\\(\\)=>figure\\.remove\\(\\)/);
 assert.doesNotMatch(recall,/originalFrenchReferenceImage|u28-shared-visual/);
 assert.doesNotMatch(transfer,/originalFrenchReferenceImage|u28-shared-visual/);
 assert.match(discover,/pane\\.append\\(show,gloss\\)/);
 const builder=readFileSync(new URL('../scripts/build-vnext-service-worker.mjs',import.meta.url),'utf8');
 assert.match(builder,/files=\\(await walk\\(rootPath\\)\\)/);
 assert.match(builder,/APP_SHELL=/);
});
