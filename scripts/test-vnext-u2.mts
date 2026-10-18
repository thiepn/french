import assert from 'node:assert/strict';
import {U2_ORIGINAL_LESSONS,loadU2Curriculum,getU2Lesson} from '../app/src/core/unified/u2-curriculum.ts';
import {enrichGrammar,grammarForLesson,checkPracticeAnswer} from '../app/src/core/unified/u2-grammar.ts';
import {ORIGINAL_SENSES,makeReviewReport,buildReviewExport} from '../app/src/core/unified/u2-review.ts';
import {sourceId,distributionAllowed} from '../app/src/core/unified/source.ts';

const lessons=await loadU2Curriculum();
assert.equal(lessons.length,12);
assert.equal(lessons.filter(x=>x.level==='A1').length,8);
assert.equal(lessons.filter(x=>x.level==='A2').length,4);
assert.equal(new Set(lessons.map(x=>x.id)).size,12);
assert.ok(lessons.every(x=>x.source.source==='original'&&x.source.rights==='original-owned'
  &&x.dialogue.length===3&&x.vocabulary.length===3&&x.exercises.length===2
  &&x.grammarIds.length>0&&x.productionPrompt));
assert.ok(lessons.every(x=>x.exercises.every(y=>y.prompt&&y.answer&&y.explanation)));
assert.ok(lessons.every(x=>x.exercises.filter(y=>y.type==='choice').every(y=>y.options.includes(y.answer))));
assert.equal(getU2Lesson('greetings')?.title,'Meeting someone');
assert.equal(getU2Lesson('missing'),null);
assert.equal(distributionAllowed('carnet'),false);
assert.equal(distributionAllowed('french22'),false);
assert.ok(lessons.every(l=>grammarForLesson(l.id).length>=1));
assert.ok(enrichGrammar('articles')?.contrast.length===2);
assert.ok(enrichGrammar('passe-compose')?.challenge.length===2);
assert.equal(enrichGrammar('unknown'),null);
assert.equal(checkPracticeAnswer('  l’ ','L\''),true);
assert.equal(checkPracticeAnswer('sont','sont'),true);
assert.equal(checkPracticeAnswer('ou','où'),false,'do not silently remove meaningful accents');
assert.equal(checkPracticeAnswer('  ','a'),false);
assert.equal(new Set(ORIGINAL_SENSES.map(x=>x.sourceId)).size,ORIGINAL_SENSES.length);
assert.ok(ORIGINAL_SENSES.length>=28);
assert.ok(ORIGINAL_SENSES.every(x=>x.form&&x.gloss&&x.lessonIds.length>0));
assert.ok(ORIGINAL_SENSES.every(x=>x.sourceId.startsWith('fru1:original@unified-u1-original-v1:sense:')));
const first=ORIGINAL_SENSES[0];
const matched=makeReviewReport([{id:'native-1',word:first.form,meaning:first.gloss,pos:'noun'}],'test-native-revision');
assert.equal(matched.rows.length,ORIGINAL_SENSES.length);
assert.equal(matched.verifiedSenseEquivalences,0);
assert.equal(matched.progressImported,false);
const proposal={
 sourceId:first.sourceId,targetId:sourceId('native','lexeme','native-1'),
 status:'proposed-match' as const,note:'Original and native test fixtures have matching glosses; still needs human approval.'
};
const draft=buildReviewExport([proposal],matched,'test-native-revision');
assert.equal(draft.approved,false);
assert.equal(draft.authority,'review-only');
assert.equal(draft.progressImported,false);
assert.equal(draft.decisions.length,1);
assert.equal(draft.decisions[0].targetId,proposal.targetId);
assert.equal(buildReviewExport([{...proposal,note:''}],matched,null).decisions.length,0,'evidence required');
assert.equal(buildReviewExport([{...proposal,targetId:sourceId('native','lexeme','unrelated')}],matched,null).decisions.length,0,'cannot propose unrelated native target');
assert.equal(buildReviewExport([proposal,proposal],matched,null).decisions.length,1,'one decision per authored sense');
assert.equal(buildReviewExport([{...proposal,sourceId:'forged'}],matched,null).decisions.length,0);
const ambiguous=makeReviewReport([
 {id:'native-1',word:first.form,meaning:first.gloss,pos:'noun'},
 {id:'native-2',word:first.form,meaning:'different sense',pos:'verb'}
],null);
assert.ok(ambiguous.totals.ambiguous>=1);
assert.equal(ambiguous.verifiedSenseEquivalences,0);
console.log(JSON.stringify({schema:'thiepn-french-u2-deterministic',ok:true,lessons:lessons.length,
 originalSenses:ORIGINAL_SENSES.length,grammarDepth:9,importedProgress:false}));
