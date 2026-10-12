import assert from 'node:assert/strict';
import {U2_ORIGINAL_LESSONS} from '../app/src/core/unified/u2-curriculum.ts';
import {ORIGINAL_PATH_LESSONS,U3_ORIGINAL_LESSONS,LESSON_PATH,validateLessonPath,
 getLessonPath,missingPrerequisites,suggestedLesson,loadUnifiedOriginalPath} from '../app/src/core/unified/u3-pathways.ts';
import {WRITING_SCAFFOLDS,inspectDraftStructure,writingScaffold} from '../app/src/core/unified/u3-writing.ts';
import {ORIGINAL_SENSES,makeReviewReport,buildReviewExport} from '../app/src/core/unified/u2-review.ts';
import {nativeQualifiedLexemeId,safeNativeLocalId} from '../app/src/core/unified/u3-native-id.ts';
import {inspectReviewExport,reviewPreviewIsAuthoritative} from '../app/src/core/unified/u3-review-import.ts';
import {sourceId} from '../app/src/core/unified/source.ts';
import {grammarForLesson} from '../app/src/core/unified/u2-grammar.ts';

assert.equal((await loadUnifiedOriginalPath()).length,20);
assert.equal(U2_ORIGINAL_LESSONS.length,12,'U2 parent remains unchanged');
assert.equal(U3_ORIGINAL_LESSONS.length,8);
assert.equal(LESSON_PATH.length,20);
assert.deepEqual(validateLessonPath(),[]);
assert.equal(new Set(ORIGINAL_PATH_LESSONS.map(l=>l.id)).size,20);
assert.equal(U3_ORIGINAL_LESSONS.filter(l=>l.level==='A1').length,4);
assert.equal(U3_ORIGINAL_LESSONS.filter(l=>l.level==='A2').length,4);
assert.ok(U3_ORIGINAL_LESSONS.every(l=>l.source.rights==='original-owned'&&l.source.source==='original'
 &&l.dialogue.length===3&&l.vocabulary.length===3&&l.exercises.length===2
 &&l.exercises.every(e=>e.type==='fill'||e.options.includes(e.answer))));
assert.ok(ORIGINAL_PATH_LESSONS.every(l=>grammarForLesson(l.id).length>0));
assert.deepEqual(getLessonPath('late-train')?.prerequisiteIds,['travel','yesterday']);
assert.deepEqual(missingPrerequisites('late-train',new Set(['travel'])),['yesterday']);
assert.deepEqual(missingPrerequisites('greetings',new Set()),[]);
assert.equal(suggestedLesson(new Set())?.id,'greetings');
assert.equal(suggestedLesson(new Set(),'travel'),null,'no false ready status if prerequisites unknown');
assert.equal(suggestedLesson(new Set(['greetings','schedule']),'travel')?.id,'directions');
assert.ok(WRITING_SCAFFOLDS.length===20);
assert.ok(writingScaffold('market')?.model.includes('pommes'));
assert.equal(writingScaffold('invalid'),null);
assert.ok(inspectDraftStructure('').join('').includes('Write one French sentence'));
assert.ok(inspectDraftStructure('Je suis ici.').length>=1);
assert.ok(inspectDraftStructure('Je suis ici et je vais marcher demain. Nous allons visiter le musée.').join('').includes('correctness still require'));
assert.equal(safeNativeLocalId('safe-123'),'safe-123');
assert.equal(safeNativeLocalId('fr:bonjour#verb').startsWith('n64-'),true);
assert.equal(safeNativeLocalId('fr:bonjour#verb'),safeNativeLocalId('fr:bonjour#verb'));
assert.notEqual(safeNativeLocalId('fr:bonjour#verb'),safeNativeLocalId('fr:bonjour#noun'));
assert.notEqual(safeNativeLocalId('à'),safeNativeLocalId('a'));
assert.ok(nativeQualifiedLexemeId('fr:bonjour#verb').startsWith('fru1:native@'));
assert.throws(()=>safeNativeLocalId(''),/Missing/);
assert.throws(()=>safeNativeLocalId(':'.repeat(200)),/too long/);
assert.throws(()=>sourceId('original','lexeme','invalid?'),/Invalid/,'original contract not weakened');
assert.equal(ORIGINAL_SENSES[0].id,'u2-sense-001');
assert.equal(ORIGINAL_SENSES[35].id,'u2-sense-036');
assert.equal(ORIGINAL_SENSES[36].id,'u3-sense-001');
assert.ok(ORIGINAL_SENSES.length>36);

const first=ORIGINAL_SENSES[0];
const nativeId='fr:bonjour#2026';
const report=makeReviewReport([{id:nativeId,word:first.form,meaning:first.gloss,pos:'interjection'}],'synthetic-revision');
const target=nativeQualifiedLexemeId(nativeId);
assert.ok(report.rows.find(r=>r.from===sourceId('original','lexeme',first.id))?.to.includes(target),'encoded native ID must resolve from exact-form source');
const draft=buildReviewExport([{sourceId:first.sourceId,targetId:target,status:'proposed-match',
 note:'Synthetic bilingual context reviewed; this is not approved sense evidence.'}],report,'synthetic-revision');
assert.equal(draft.approved,false);
assert.equal(draft.progressImported,false);
const preview=inspectReviewExport(JSON.stringify(draft),report,'synthetic-revision');
assert.equal(preview.state,'ready');
assert.equal(preview.pending.length,1);
assert.equal(preview.approved,false);
assert.equal(preview.importedIntoLearner,false);
assert.equal(reviewPreviewIsAuthoritative(preview),false);
assert.equal(inspectReviewExport(JSON.stringify({...draft,approved:true}),report,'synthetic-revision').state,'blocked');
assert.equal(inspectReviewExport(JSON.stringify({...draft,progressImported:true}),report,'synthetic-revision').state,'blocked');
assert.equal(inspectReviewExport(JSON.stringify({...draft,unexpected:1}),report,'synthetic-revision').state,'blocked');
assert.equal(inspectReviewExport(JSON.stringify({...draft,targetRevision:'different'}),report,'synthetic-revision').state,'blocked');
assert.equal(inspectReviewExport(JSON.stringify(draft),report,null).state,'blocked');
assert.equal(inspectReviewExport(JSON.stringify({...draft,decisions:[...draft.decisions,...draft.decisions]}),report,'synthetic-revision').state,'blocked');
assert.equal(inspectReviewExport(JSON.stringify({...draft,decisions:[{...draft.decisions[0],targetId:'forged'}]}),report,'synthetic-revision').state,'blocked');
assert.equal(inspectReviewExport(JSON.stringify({...draft,decisions:[{...draft.decisions[0],note:''}]}),report,'synthetic-revision').state,'blocked');
assert.equal(inspectReviewExport('not JSON',report,'synthetic-revision').state,'blocked');
assert.equal(inspectReviewExport(' '.repeat(256*1024+1),report,'synthetic-revision').state,'blocked');
const partial=inspectReviewExport(JSON.stringify({...draft,decisions:[...draft.decisions,{...draft.decisions[0],sourceId:'forged'}]}),report,'synthetic-revision');
assert.equal(partial.pending.length,0,'atomic denial: no partial imported proposals');
console.log(JSON.stringify({schema:'thiepn-french-u3-deterministic',status:'PASS',originalLessons:20,newLessons:8,
 originalSenses:ORIGINAL_SENSES.length,prerequisiteGraph:true,reviewOnly:true,authoritativeWrites:false}));
