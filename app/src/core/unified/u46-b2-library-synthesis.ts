import {getOriginalMaterial,getOriginalCatalogEntry} from './u23-registry.ts';

/** Original, fictional library dossier 154–156. No audio recordings, grades or learner writes. */
export interface LibrarySourceAnchor {
 readonly lessonId:'transfer-154'|'transfer-155'|'transfer-156';
 readonly speaker:string;
 readonly quote:string;
}
export interface LibrarySynthesisCase {
 readonly id:string;
 readonly title:string;
 readonly sources:readonly LibrarySourceAnchor[];
 readonly question:string;
 readonly answer:string;
 readonly distractors:readonly [string,string];
 readonly corrections:readonly [string,string];
 readonly explanation:string;
 readonly frenchPrompt:string;
 readonly selfChecks:readonly [string,string,string,string];
 readonly frenchModel:string;
}
export interface ResolvedLibraryTurn {
 readonly lessonId:string;readonly lessonTitle:string;
 readonly sourceRevision:string;readonly speaker:string;
 readonly number:number;readonly french:string;
}
export const ORIGINAL_LIBRARY_SYNTHESIS:readonly LibrarySynthesisCase[]=Object.freeze([
 {
  id:'counts-and-representation',
  title:'1 · Evidence before consultation',
  sources:[
   {lessonId:'transfer-154',speaker:'Hugo',quote:'1 200 entrées en octobre'},
   {lessonId:'transfer-154',speaker:'Salomé',quote:'68 % des répondants'},
   {lessonId:'transfer-155',speaker:'Maya',quote:'n’incluait presque pas les non-usagers'},
   {lessonId:'transfer-156',speaker:'Hugo',quote:'le registre ne mesure toujours pas les habitants privés d’accès'}
  ],
  question:'Combining the initial register, the consultation and the council discussion, what may the spokesperson claim?',
  answer:'The register counts 1,200 entries; 68% describes on-site respondents, while non-users and access barriers remain under-measured.',
  distractors:[
   'The register establishes 1,200 distinct residents and 68% support among all inhabitants.',
   'The consultation made the earlier on-site survey representative without collecting more responses.'
  ],
  corrections:[
   'Repeat entries are possible, and the 68% sample excludes many residents who could not visit.',
   'Maya acknowledges the omission; the later discussion does not retrospectively repair the sample.'
  ],
  explanation:'Hugo’s October number counts visits, not unique people. Salomé reports a preference among respondents already at reception. Maya and the later Hugo both preserve the unmet-access limitation; none of these turns supplies a population denominator.',
  frenchPrompt:'En une minute, expliquez à un habitant pourquoi les 1 200 entrées et les 68 % ne permettent pas de décrire tous les habitants. Reliez explicitement le registre initial, la consultation et le rappel du conseil.',
  selfChecks:[
   'J’attribue 1 200 entrées au registre, sans inventer 1 200 personnes distinctes.',
   'Je limite les 68 % aux répondants interrogés à l’accueil.',
   'J’explique pourquoi les non-usagers manquent dans les données.',
   'Je demande une consultation plus accessible sans annoncer de résultats futurs.'
  ],
  frenchModel:'D’abord, Hugo a expliqué que le registre comptait 1 200 entrées et non 1 200 personnes différentes. Salomé a cité les 68 % des répondants interrogés à l’accueil, mais les non-usagers étaient largement absents. Pendant la consultation, Maya a reconnu cette limite. Le conseil ne peut donc pas présenter ces chiffres comme une opinion de toute la ville. Il faut écouter aussi les personnes empêchées de venir.'
 },
 {
  id:'mediation-and-safeguards',
  title:'2 · From consultation to conditions',
  sources:[
   {lessonId:'transfer-154',speaker:'Maya',quote:'consulter aussi les absents'},
   {lessonId:'transfer-155',speaker:'Nora',quote:'le mercredi en fin d’après-midi'},
   {lessonId:'transfer-155',speaker:'Yanis',quote:'le dernier bus'},
   {lessonId:'transfer-155',speaker:'Claire',quote:'aucun accord sur les heures supplémentaires n’a encore été signé'},
   {lessonId:'transfer-156',speaker:'Maya',quote:'à condition que les accords et le transport soient confirmés'}
  ],
  question:'How does the later conditional recommendation respond to the distinct needs raised in the consultation?',
  answer:'Wednesday access, Thursday transport and a signed safe paid-staff arrangement must be addressed before a limited trial begins.',
  distractors:[
   'The six-week funding announcement alone guarantees access and staff consent.',
   'The public consultation unanimously approved two permanent evening openings without conditions.'
  ],
  corrections:[
   'Claire explicitly states that the overtime agreement remains unsigned, and Yanis identifies the last-bus barrier.',
   'The public meeting forwarded a conditional proposal; the later council vote is not permanent opening.'
  ],
  explanation:'The earlier request to reach missing groups becomes separate Wednesday and Thursday needs. Nora represents families, Yanis identifies bus access, and Claire requires a paid safe rota. Maya conditions the experiment on unresolved agreements and transport; possible funding alone cannot replace them.',
  frenchPrompt:'Vous animez la réunion: répondez séparément à Nora, Yanis et Claire. Expliquez ce qui était une demande, ce qui a été seulement proposé et ce qui doit être confirmé avant l’essai.',
  selfChecks:[
   'Je distingue le mercredi demandé par Nora du jeudi défendu par Yanis.',
   'J’explique le dernier bus sans prétendre que le transport est déjà garanti.',
   'Je mentionne le roulement payé et l’accord de sécurité écrit encore nécessaire.',
   'Je défends une proposition conditionnelle et non un accord permanent.'
  ],
  frenchModel:'Nora demande un créneau le mercredi pour les familles, tandis que Yanis souhaite un accès le jeudi pour les salariés. Cependant, le dernier bus peut rendre cette deuxième option inutile. Claire rappelle que le roulement doit être payé et que la sécurité exige un accord écrit. La consultation n’a pas approuvé une ouverture définitive. Je soutiendrais un essai limité seulement si les transports et les accords du personnel étaient confirmés.'
 },
 {
  id:'decision-and-revision',
  title:'3 · Conditional council decision and review',
  sources:[
   {lessonId:'transfer-154',speaker:'Salomé',quote:'rien n’est encore décidé'},
   {lessonId:'transfer-155',speaker:'Maya',quote:'nous n’approuvons pas l’ouverture définitive'},
   {lessonId:'transfer-156',speaker:'Maya',quote:'six semaines d’essai avec un bilan à mi-parcours'},
   {lessonId:'transfer-156',speaker:'Hugo',quote:'les nouveaux usagers et les personnes qui renoncent'},
   {lessonId:'transfer-156',speaker:'Maya',quote:'l’ouverture définitive fera l’objet d’une autre décision publique'}
  ],
  question:'A headline says the new hours have already succeeded permanently. What correction follows the three original lessons?',
  answer:'The council authorized preparation of a conditional six-week trial, with a midterm review and a later public decision on permanence; no trial outcomes exist yet.',
  distractors:[
   'The six-week trial is completed and has already proved that every group benefits.',
   'The first 68% survey was a binding permanent vote, so the council review is unnecessary.'
  ],
  corrections:[
   'The six-week period and review are prospective; no results have been measured.',
   'The initial on-site survey was neither representative of all residents nor a council decision.'
  ],
  explanation:'The first lesson ends without a decision, the mediation sends a proposal onward, and only the third authorizes preparation under safeguards. Hugo requests distinct measures of visits, new users and exclusions. The review must assess actual results, with another public decision required before permanent opening.',
  frenchPrompt:'Prononcez une synthèse publique autonome de trois à quatre minutes: preuves du registre, objections de la consultation, conditions avant ouverture, indicateurs à trois et six semaines, puis circonstances qui vous feraient modifier ou suspendre le projet.',
  selfChecks:[
   'Je relie explicitement les leçons 154, 155 et 156 en attribuant leurs sources.',
   'Je précise six semaines d’essai et un bilan après trois et six semaines, sans inventer de résultats.',
   'Je distingue passages, nouveaux usagers et personnes toujours exclues.',
   'Je propose une révision ou suspension si transports, sécurité ou équité échouent; la permanence exige une autre décision.'
  ],
  frenchModel:'Nous avons d’abord observé 1 200 entrées, sans connaître le nombre de visiteurs distincts. Le sondage à l’accueil reflétait certains répondants, mais pas les personnes empêchées de venir. Ensuite, la consultation a révélé des besoins différents: mercredi pour les familles, jeudi pour les salariés, avec des risques liés au dernier bus et au roulement du personnel. Le conseil a seulement autorisé la préparation d’un essai de six semaines, sous réserve des accords de sécurité, des transports et d’une information accessible. À trois puis six semaines, nous devrons comparer les entrées, les nouveaux usagers et les personnes toujours exclues. Si les conditions ne sont pas remplies, il faudra modifier ou suspendre l’essai. Une ouverture permanente nécessitera une autre décision publique.'
 }
]);
function normalized(value:string):string {
 return value.normalize('NFC').replace(/[’‘]/g,"'").toLocaleLowerCase('fr').trim();
}
export function resolveLibrarySynthesisSources(item:LibrarySynthesisCase):readonly ResolvedLibraryTurn[]|null {
 const resolved:ResolvedLibraryTurn[]=[];
 for(const source of item.sources){
  const material=getOriginalMaterial(source.lessonId),entry=getOriginalCatalogEntry(source.lessonId);
  if(!material||!entry)return null;
  const matches=material.unit.dialogue.map((t,i)=>({t,i})).filter(({t})=>
   t.speaker===source.speaker&&normalized(t.fr).includes(normalized(source.quote)));
  if(matches.length!==1)return null;
  resolved.push(Object.freeze({lessonId:source.lessonId,lessonTitle:entry.title,
   sourceRevision:entry.sourceRevision,speaker:matches[0].t.speaker,
   number:matches[0].i+1,french:matches[0].t.fr}));
 }
 return Object.freeze(resolved);
}
export function checkLibrarySynthesisChoice(item:LibrarySynthesisCase,choice:string):{
 readonly correct:boolean;readonly feedback:string
}{
 const value=normalized(choice),correct=value===normalized(item.answer);
 const wrong=item.distractors.findIndex(d=>normalized(d)===value);
 return {correct,feedback:(correct?'Source-supported. ':wrong>=0?item.corrections[wrong]+' ':'This answer does not match the authored comparison. ')+item.explanation};
}
export function validateLibrarySynthesis():readonly string[]{
 const errors:string[]=[];
 if(ORIGINAL_LIBRARY_SYNTHESIS.length!==3)errors.push('Expected three cumulative dossier questions');
 for(const item of ORIGINAL_LIBRARY_SYNTHESIS){
  const resolved=resolveLibrarySynthesisSources(item);
  if(!resolved)errors.push('Missing exact original dialogue anchor for '+item.id);
  if(new Set(item.sources.map(s=>s.lessonId)).size!==3)errors.push('Missing one of the three original lessons in '+item.id);
  if(item.distractors.length!==2||item.corrections.length!==2||
    item.selfChecks.length!==4||item.explanation.length<120||item.frenchModel.length<180)
   errors.push('Incomplete authored comparison or oral model: '+item.id);
  if(new Set([item.answer,...item.distractors]).size!==3)errors.push('Duplicate authored choices: '+item.id);
 }
 return errors;
}
