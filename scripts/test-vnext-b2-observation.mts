import assert from 'node:assert/strict';
import {B2_ARGUMENT_PAIRS,observeB2Draft,sourceFivegramOverlap} from '../app/src/core/learner/b2-observation.ts';

assert.equal(B2_ARGUMENT_PAIRS.length,3,'P31 practice has three prompt pairs');
assert.deepEqual(B2_ARGUMENT_PAIRS.map(pair=>pair.length),[2,2,2]);
const prompts=B2_ARGUMENT_PAIRS.flat();
assert.equal(new Set(prompts.map(p=>p.id)).size,6,'Every prompt has a distinct new U64 ID');
for(const prompt of prompts){
 assert.ok(prompt.task.length>75,'Substantial independently authored situation');
 assert.equal(prompt.questions.length,4,'Specific human self-check requirements');
}
const strong='Je recommande une nouvelle politique, mais il faut considérer le contexte. '+
 'Par exemple, certains collègues perdent du temps, tandis que les familles gagnent en flexibilité. '+
 'Bien que ce choix puisse sembler simple, nous devons examiner les conséquences. '+
 'Si les conditions sont claires, nous pouvons proposer une évaluation. '+
 'Cependant, selon les résultats, il est possible de réviser le projet. '+
 'En conclusion, je recommande une expérimentation limitée.';
const report=observeB2Draft(strong);
assert.ok(report.words>40);
assert.ok(report.sentences>=4);
assert.ok(report.markerFamilies.includes('concession'));
assert.ok(report.markerFamilies.includes('contrast'));
assert.ok(report.markerFamilies.includes('condition'));
assert.ok(report.markerFamilies.includes('conclusion'));
assert.equal(observeB2Draft('La situation est difficile.').markerFamilies.length,0);
assert.equal(observeB2Draft('Un siège est ici.').markerFamilies.includes('condition'),false,
 'Marker detection requires word boundaries, not substrings within words');
assert.equal(sourceFivegramOverlap('je fais une proposition différente','un autre texte original'),0);
assert.ok(sourceFivegramOverlap('La décision est une responsabilité complexe de notre équipe.',
 'La décision est une responsabilité complexe de notre équipe.')>.5,
 'Direct copied five-word sequences must be observable');
assert.equal(sourceFivegramOverlap('Je pense.','Je pense.'),0,
 'Short responses cannot create invented fivegram metrics');
assert.equal(JSON.stringify(report).includes(strong),false,'No raw prose returned');
console.log('U64 B2 practice-only observations PASS: prompts, exact discourse markers, copy diagnostic, no grading.');
