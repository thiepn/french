import assert from 'node:assert/strict';
import {B2_ARGUMENT_PAIRS} from '../app/src/core/learner/b2-observation.ts';
import {
 B2_EVIDENCE_KEY,B2_EVALUATOR_VERSION,B2_EVIDENCE_DAYS,assessB2Structure,
 emptyB2Evidence,normalizeB2Evidence,finalizeB2Attempt,appendB2Attempt,
 currentB2Evidence,sourceLexicalCoverage
} from '../app/src/core/learner/b2-assessment.ts';
assert.equal(B2_EVIDENCE_KEY,'vU65B2StructuralEvidence');
assert.equal(B2_EVIDENCE_DAYS,35);
const strong=([
 'Je recommande le télétravail flexible pour les collègues, car la direction devrait examiner chaque mission avec prudence.',
 'Certes, le bureau facilite certaines collaborations, mais les employés à distance peuvent préserver leur autonomie selon leurs responsabilités.',
 'Par exemple, une entreprise pourrait organiser une rencontre mensuelle afin de comparer des objectifs transparents et des conditions réelles.',
 'Si le déplacement quotidien augmente les dépenses, il est possible de proposer une politique adaptée qui reconnaît les contraintes familiales.',
 'Cependant, une décision durable doit aussi considérer la qualité des échanges, les coûts matériels, les horaires divers et la confiance mutuelle.',
 'En revanche, le travail présentiel conserve une utilité particulière pour des ateliers collectifs ou des projets exigeant des outils communs.',
 'Bien que plusieurs opinions divergent, nous pouvons organiser une évaluation progressive avec des critères simples et des délais raisonnables.',
 'Par conséquent, cette approche permet de recueillir des observations fiables avant de modifier les règles au profit du personnel.',
 'En conclusion, je recommande cette expérimentation limitée avec une révision publique lorsque les indicateurs deviennent suffisamment clairs.'
]).join(' ');
const second=([
 'La mobilité dans la ville dépend autant des transports accessibles que des besoins des habitants du quartier.',
 'Je recommande une politique équitable, car les citoyens qui travaillent au centre ne disposent pas tous des mêmes alternatives.',
 'Certes, la voiture simplifie certains trajets, mais sa circulation importante impose des conséquences collectives et économiques.',
 'Par exemple, la municipalité pourrait financer des autobus réguliers, des stations sécurisées et un réseau lisible pour les usagers.',
 'Si les restrictions automobiles commencent avant les nouveaux services, de nombreuses familles pourraient subir une difficulté injuste.',
 'Cependant, une expérimentation graduelle permettrait de comparer le coût, le bruit et la santé publique dans plusieurs rues.',
 'Bien que ce projet nécessite des ressources, il est possible de consulter les riverains et les responsables de commerces indépendants.',
 'Par conséquent, des ajustements ciblés rendraient la décision moins brutale et davantage transparente pour les personnes concernées.',
 'En conclusion, nous proposons une adaptation progressive conditionnée à des résultats mesurables et à des solutions réellement disponibles.'
]).join(' ');
const a=assessB2Structure({kind:'p31',taskId:B2_ARGUMENT_PAIRS[0][0].id,modality:'argument',text:strong,elapsedMs:188000,attested:true,pair:0,taskIndex:0});
const b=assessB2Structure({kind:'p31',taskId:B2_ARGUMENT_PAIRS[0][1].id,modality:'argument',text:second,elapsedMs:205000,attested:true,pair:0,taskIndex:1});
assert.equal(a.evaluator,B2_EVALUATOR_VERSION);
assert.equal(a.status,'structural-targets-met','long independent argument with anchored structural signals passes only proxy gates');
assert.equal(b.status,'structural-targets-met','second distinct original task assessed separately');
assert.equal(assessB2Structure({kind:'p31',taskId:a.taskId,modality:'argument',text:strong,attested:false,elapsedMs:5}).status,'unscored','no self-attestation = abstain');
assert.equal(assessB2Structure({kind:'p31',taskId:a.taskId,modality:'argument',text:'Je recommande cela.',attested:true,elapsedMs:5}).status,'insufficient','short answers cannot pass');
assert.equal(assessB2Structure({kind:'p31',taskId:a.taskId,modality:'argument',text:second,attested:true,elapsedMs:5,pair:0,taskIndex:0}).status,'insufficient','generic rhetoric from unrelated source lacks P31 topic anchors');
const now=Date.now();
const pair=finalizeB2Attempt('p31',a,b,now);
assert.equal(pair.status,'structural-targets-met','two independently qualifying tasks needed');
let history=appendB2Attempt(emptyB2Evidence(),pair,'token-1-unique');
assert.ok(currentB2Evidence(history,'p31',now));
assert.equal(currentB2Evidence(history,'p31',now+36*86400000),null,'35-day expiry');
assert.equal(currentB2Evidence(history,'p32',now),null,'P31 cannot stand in for P32');
const failed=finalizeB2Attempt('p31',a,assessB2Structure({kind:'p31',taskId:b.taskId,modality:'argument',text:'Non.',attested:true,elapsedMs:1}),now+1000);
history=appendB2Attempt(history,failed,'token-2-unique');
assert.equal(currentB2Evidence(history,'p31',now+1000),null,'later scored failure supersedes older pass');
const abstained=finalizeB2Attempt('p31',a,assessB2Structure({kind:'p31',taskId:b.taskId,modality:'argument',text:'Non.',attested:false,elapsedMs:1}),now+2000);
const restored=appendB2Attempt(appendB2Attempt(emptyB2Evidence(),pair,'token-3-unique'),abstained,'token-4-unique');
assert.ok(currentB2Evidence(restored,'p31',now+2000),'unscored attempt does not undo still-current structural pass');
assert.deepEqual(normalizeB2Evidence(JSON.parse(JSON.stringify(restored))),restored,'minimal versioned backup round trip');
assert.equal(normalizeB2Evidence({...restored,schema:'unknown-future'}),null,'unknown future authority cannot be overwritten');
assert.equal(JSON.stringify(restored).includes(strong),false,'no original French response persisted');
const paragraphs=[
 'La mobilité durable demande des transports accessibles aux habitants du quartier.',
 'Les employés du centre ont besoin de services réguliers pour rejoindre les commerces.',
 'Des politiques publiques doivent examiner le coût réel et la qualité locale.',
 'Une décision collective suppose des critères transparents pour chaque citoyen.',
 'Le réseau urbain pourrait réunir des autobus et des pistes cyclables sécurisées.',
 'Certaines familles préfèrent la voiture pour des déplacements difficiles.',
 'La sécurité piétonne et les dépenses communales exigent une évaluation honnête.',
 'Un compromis prévoit une consultation suivie de changements progressifs.'
];
const source={
 id:'original-b2-source-1',level:'B2',title:'Source',type:'article',minutes:8,
 topic:'transport',register:'public',authenticity:'original',sourceLabel:'P35',license:'original-owned',
 targets:[],phrases:[],questions:[],sentences:paragraphs.map(fr=>({fr,en:''}))
};
assert.equal(sourceLexicalCoverage('Les habitants discutent des transports au quartier. Des employés rencontrent les commerces au centre. Ces politiques évaluent le coût et la qualité. Une décision nécessite des critères pour chaque citoyen. Le réseau permet des autobus sécurisés. Les familles utilisent la voiture pour des déplacements. La sécurité reste liée aux dépenses. Un compromis après consultation permettra des changements.',source),1);
const listening=assessB2Structure({kind:'p32',taskId:'original-2',modality:'listening',source,attested:true,text:strong,elapsedMs:70000,playCount:1,audioCompleted:false});
assert.equal(listening.status,'unscored','requested/started but incomplete device playback never graded');
assert.equal(assessB2Structure({kind:'p32',taskId:'original-2',modality:'listening',source,attested:true,text:strong,elapsedMs:70000,playCount:1,audioCompleted:true,transcriptRevealed:true}).status,'unscored','shown transcript invalidates calibrated listening');
assert.throws(()=>appendB2Attempt(emptyB2Evidence(),{
 ...pair,kind:'p32',tasks:[{...a,modality:'reading',sourceId:'s1'},{...b,modality:'listening',sourceId:'s2'}]
},'token'),/P32_REQUIRES_CURRENT_P31/);
assert.throws(()=>finalizeB2Attempt('p32',{...a,modality:'reading',sourceId:'same'},{...b,modality:'listening',sourceId:'same'},now),/P32_SOURCE_PAIR_MISMATCH/);
console.log(JSON.stringify({schema:'u65-b2-assessment',ok:true,version:B2_EVALUATOR_VERSION,p31:'two distinct hard-gated tasks',p32:'source + listener prerequisite',privacy:'no prose/audio/transcript',cas:'atomic repository writer'}));
