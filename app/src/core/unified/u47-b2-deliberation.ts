/** Original French-first, three-voice B2 deliberation for the existing U30 listening engine.
 * These are fictional authored dialogues, not audio recordings or assessed speech.
 * An exact source-turn anchor is required for every claim.
 */
export interface B2Deliberation{
 readonly id:string;
 readonly lesson:'transfer-151'|'transfer-152'|'transfer-153';
 readonly sources:readonly [
  Readonly<{speaker:string;anchor:string}>,
  Readonly<{speaker:string;anchor:string}>,
  Readonly<{speaker:string;anchor:string}>
 ];
 readonly question:string;
 readonly answer:string;
 readonly distractors:readonly [string,string];
 readonly corrections:readonly [string,string];
 readonly explanation:string;
 readonly hint:string;
 readonly oralPrompt:string;
 readonly objection:string;
 readonly criteria:readonly [string,string,string,string];
 readonly model:string;
}
export const ORIGINAL_B2_DELIBERATIONS:readonly B2Deliberation[]=Object.freeze([
 {
  id:'phone-representation-access',lesson:'transfer-151',
  sources:[
   {speaker:'Marc',anchor:'72 % des répondants'},
   {speaker:'Nadia',anchor:'72 % de tout le lycée'},
   {speaker:'Lina',anchor:'sans règle commune'}
  ],
  question:'En réunissant les trois interventions, quelle conclusion peut-on défendre devant le conseil du lycée ?',
  answer:'Une règle commune peut être étudiée, mais les 72 % concernent uniquement les répondants et ne justifient pas une interdiction générale.',
  distractors:[
   'La majorité de tous les élèves a officiellement voté une interdiction définitive.',
   'Les limites du sondage prouvent qu’aucune règle collective ne pourra jamais être discutée.'
  ],
  corrections:[
   'Marc ne connaît pas le nombre des répondants; Nadia refuse explicitement de généraliser ce résultat à tout le lycée.',
   'Lina présente un risque réel en l’absence de règle commune; une donnée imparfaite n’interdit pas toute proposition proportionnée.'
  ],
  explanation:'Marc rapporte la perception des répondants, Nadia corrige l’extrapolation à tout l’établissement et Lina explique le besoin d’une règle prévisible. Une décision prudente doit tenir ensemble ce besoin et les limites du sondage.',
  hint:'Écoutez « des répondants », « tout le lycée » et « sans règle commune » : les trois expressions ne portent pas sur la même question.',
  oralPrompt:'Vous présidez le conseil. En une minute, distinguez la préférence rapportée, la population non mesurée et le besoin exprimé par Lina; proposez ensuite une mesure limitée.',
  objection:'Un parent vous interrompt : « Si vous ne pouvez pas prouver que 72 % des élèves le veulent, vous ne devez rien changer. » Répondez avec nuance et sans inventer de nouveau sondage.',
  criteria:[
   'J’attribue les 72 % aux seuls répondants et je dis que leur nombre est inconnu.',
   'Je reconnais la demande de règle commune formulée par Lina sans la présenter comme un vote.',
   'Je propose des exceptions d’accessibilité et le respect des messages privés.',
   'Je réponds au parent sans passer de « prudence » à « immobilisme ».'
  ],
  model:'Marc signale que 72 % des répondants se sentent distraits, mais nous ignorons combien d’élèves ont participé. Nadia a donc raison : ce chiffre ne représente pas tout le lycée. En même temps, Lina rappelle qu’une règle commune peut être utile. Je proposerais un essai limité à certains cours avec des exceptions pour l’accessibilité, sans collecte de messages privés. Nous pourrions consulter davantage d’élèves avant une décision durable.'
 },
 {
  id:'phone-cause-and-trial',lesson:'transfer-151',
  sources:[
   {speaker:'Lina',anchor:'moins d’interruptions'},
   {speaker:'Marc',anchor:'modifié la disposition des tables'},
   {speaker:'Nadia',anchor:'règle limitée à certains cours'}
  ],
  question:'Pourquoi la proposition de Nadia reste-t-elle conditionnelle après les observations de Lina et Marc ?',
  answer:'Une baisse d’interruptions a été observée, mais les tables ont aussi changé; un essai limité peut aider à mieux comparer les effets.',
  distractors:[
   'La fermeture des écrans est la seule cause démontrée de la baisse; un essai n’est plus nécessaire.',
   'Puisque les tables ont changé, Lina n’a pas observé de baisse des interruptions.'
  ],
  corrections:[
   'Marc signale un changement simultané de la disposition des tables, qui empêche d’isoler une cause unique; le résultat observé ne prouve donc pas l’effet des écrans seuls.',
   'L’observation de Lina existe; c’est son interprétation causale, et non le constat, qui doit être nuancée.'
  ],
  explanation:'Lina constate moins d’interruptions, Marc rappelle la modification concomitante des tables et Nadia propose une règle limitée. L’essai doit comparer les situations sans inventer de lien causal établi.',
  hint:'Séparez le constat de Lina de la mise en garde causale de Marc, puis cherchez la portée limitée de la proposition.',
  oralPrompt:'Présentez une recommandation de 90 secondes à une enseignante sceptique : dites ce que l’on a observé, ce que l’on ignore et comment comparer des classes.',
  objection:'L’enseignante répond : « Les interruptions ont baissé; pourquoi ne pas imposer la règle à toutes les classes demain ? » Reformulez le problème causal et proposez une vérification.',
  criteria:[
   'Je distingue une amélioration observée de son explication causale.',
   'Je nomme le changement simultané de la disposition des tables.',
   'Je limite la proposition à un essai réversible avec comparaison.',
   'Je réponds poliment à l’objection sans promettre un résultat futur.'
  ],
  model:'Lina a signalé moins d’interruptions après la fermeture des écrans. Cependant, Marc précise que la disposition des tables a changé en même temps : nous ne savons donc pas si les téléphones expliquent seuls la baisse. Nadia propose une règle limitée, ce qui me semble proportionné. Je comparerais plusieurs classes, avec des critères définis à l’avance, avant de recommander une extension.'
 },
 {
  id:'work-output-and-equity',lesson:'transfer-152',
  sources:[
   {speaker:'Thomas',anchor:'augmenté de 8 %'},
   {speaker:'Aïcha',anchor:'dossiers revenus pour correction'},
   {speaker:'Mélanie',anchor:'permanence du vendredi'}
  ],
  question:'Quelle appréciation de l’essai tient compte des trois voix sans effacer les coûts invisibles ?',
  answer:'La hausse de dossiers est un indicateur partiel; il faut contrôler les corrections, les heures et la permanence inégale du vendredi.',
  distractors:[
   'Les 8 % supplémentaires prouvent une amélioration égale pour tous les métiers.',
   'Le service d’accueil n’est jamais ouvert le vendredi et ne subit aucune contrainte.'
  ],
  corrections:[
   'Aïcha souligne les corrections et les heures supplémentaires absentes du chiffre; Mélanie décrit une contrainte propre à l’accueil.',
   'Mélanie confirme la permanence du vendredi et les différences d’horaires entre services.'
  ],
  explanation:'Thomas apporte un résultat de volume. Aïcha révèle les mesures de qualité et de temps manquantes. Mélanie décrit une charge de continuité de service. Une appréciation responsable doit examiner quantité, qualité et équité.',
  hint:'Repérez qui parle du nombre de dossiers, qui signale les corrections et qui assure réellement le vendredi.',
  oralPrompt:'Vous représentez l’accueil. Présentez aux dirigeants une intervention de 90 secondes qui reconnaît la hausse de production tout en défendant une évaluation équitable.',
  objection:'Un directeur répond : « Si les dossiers ont augmenté de 8 %, l’accueil doit simplement accepter le nouveau roulement. » Négociez une condition vérifiable.',
  criteria:[
   'Je cite 8 % comme hausse des dossiers traités, pas comme mesure générale du bien-être.',
   'Je demande les heures réellement effectuées et le nombre de dossiers corrigés.',
   'Je distingue les obligations du service d’accueil de celles des bureaux.',
   'Je propose rémunération, roulement équitable et bilan plutôt qu’un accord forcé.'
  ],
  model:'Thomas annonce une hausse de 8 % des dossiers traités, ce qui mérite d’être examiné. Pourtant, Aïcha explique que ce total ne comprend ni les heures supplémentaires ni les corrections. Mélanie rappelle que l’accueil doit rester ouvert le vendredi. Je ne rejetterais pas l’essai, mais je demanderais un roulement équitable, une compensation et un bilan des heures réelles et de la qualité avant de décider.'
 },
 {
  id:'work-survey-and-agreement',lesson:'transfer-152',
  sources:[
   {speaker:'Thomas',anchor:'exprimé une préférence'},
   {speaker:'Mélanie',anchor:'personnes absentes n’ont pas été interrogées'},
   {speaker:'Aïcha',anchor:'à condition de publier les heures réellement travaillées'}
  ],
  question:'Comment répondre à l’argument de préférence des salariés tout en préservant le caractère provisoire de la réforme ?',
  answer:'La préférence publiée concerne un groupe incomplet; il faut consulter les absents, publier les heures réelles et prolonger seulement sous conditions.',
  distractors:[
   'Le sondage a recueilli l’avis de tous les salariés sans exception.',
   'Les salariés absents ont unanimement rejeté la réforme et imposé sa suppression.'
  ],
  corrections:[
   'Mélanie précise que les absents n’ont pas été interrogés; aucune unanimité n’est attestée.',
   'Le silence des absents ne révèle pas leur préférence; Aïcha envisage une prolongation conditionnelle.'
  ],
  explanation:'Thomas transmet une préférence déclarée, Mélanie en limite la représentativité et Aïcha conditionne toute prolongation à de meilleurs indicateurs. Ni approbation générale ni rejet général ne suivent de ces données.',
  hint:'Suivez « préférence », « absentes » et « à condition de » sans confondre constat, échantillon et proposition.',
  oralPrompt:'En tant que délégué, préparez une minute d’argumentation au comité : faites une concession à la direction puis demandez un accord provisoire étayé.',
  objection:'La direction vous répond : « Nous avons demandé l’avis des salariés, la concertation est terminée. » Expliquez pourquoi la consultation doit être complétée.',
  criteria:[
   'J’attribue la préférence à la direction sans la transformer en opinion unanime.',
   'Je précise que les absents n’ont pas participé au sondage.',
   'Je réclame les heures réelles et les retours de qualité.',
   'Je formule une prolongation conditionnelle et réversible plutôt qu’un succès permanent.'
  ],
  model:'La direction affirme que certains salariés préfèrent le nouveau rythme. C’est un signal utile, mais Mélanie précise que les personnes absentes n’ont pas été interrogées. Il serait donc prématuré de parler d’une adhésion générale. Je propose de compléter la consultation, de publier les heures réellement travaillées et les retours de qualité, puis d’envisager un accord provisoire révisable.'
 },
 {
  id:'appliance-claims-and-urgency',lesson:'transfer-153',
  sources:[
   {speaker:'Amine',anchor:'25 % d’électricité en moins'},
   {speaker:'Sofia',anchor:'notre consommation réelle'},
   {speaker:'Clara',anchor:'stockage alimentaire sûr maintenant'}
  ],
  question:'Quelle recommandation joint correctement la publicité, ses limites et le besoin immédiat des habitants ?',
  answer:'Le chiffre standard ne garantit aucune économie locale; il faut obtenir les données réelles et assurer immédiatement une conservation sûre des aliments.',
  distractors:[
   'Les 25 % garantissent les mêmes économies pour la résidence; la sécurité alimentaire peut attendre quinze jours.',
   'L’absence de données locales prouve qu’aucun appareil neuf ne peut consommer moins.'
  ],
  corrections:[
   'Sofia précise que l’usage réel n’a pas été mesuré; Clara exige une solution sûre maintenant.',
   'Une comparaison standard reste une information, mais elle ne suffit pas à conclure pour cette résidence.'
  ],
  explanation:'Amine rapporte une affirmation issue d’un essai standard. Sofia conteste son application automatique au bâtiment, tandis que Clara souligne l’urgence alimentaire. La décision doit traiter sécurité immédiate et estimation à long terme séparément.',
  hint:'Écoutez « essai standard », « consommation réelle » et « maintenant » : ces trois dimensions correspondent à trois limites différentes.',
  oralPrompt:'Vous conseillez une association de résidents. En 90 secondes, expliquez pourquoi le chiffre de 25 % ne tranche pas la décision et ce qu’il faut faire dès aujourd’hui.',
  objection:'Un résident déclare : « Puisque le neuf est 25 % plus efficace, achetons-le immédiatement et ignorons le délai. » Répondez sans présenter une économie garantie.',
  criteria:[
   'J’attribue les 25 % au test standard et non à la facture locale.',
   'Je mentionne que la consommation actuelle et l’impact de fabrication manquent.',
   'Je traite la conservation sûre des aliments comme une priorité immédiate.',
   'Je compare les options sans conclure à une économie certaine.'
  ],
  model:'Amine cite un fabricant qui annonce 25 % d’électricité en moins dans un test standard. Sofia précise que nous ne connaissons pas la consommation réelle ni l’impact de fabrication. Clara rappelle surtout que les aliments doivent être conservés en sécurité dès maintenant. J’organiserais une solution provisoire et je demanderais les données locales avant de comparer réparation, reconditionnement et achat neuf.'
 },
 {
  id:'appliance-provisional-decision',lesson:'transfer-153',
  sources:[
   {speaker:'Clara',anchor:'quinze jours'},
   {speaker:'Amine',anchor:'emprunter un appareil'},
   {speaker:'Sofia',anchor:'devis pourrait augmenter'}
  ],
  question:'Pourquoi un prêt temporaire préserve-t-il mieux la décision collective que le choix immédiat d’une solution définitive ?',
  answer:'Il protège les aliments pendant le délai et laisse vérifier le diagnostic ainsi que le coût réel de la réparation.',
  distractors:[
   'Il garantit que la réparation coûtera exactement 180 euros malgré tout diagnostic.',
   'Il autorise les habitants à utiliser le réfrigérateur défectueux sans précaution pendant quinze jours.'
  ],
  corrections:[
   'Sofia indique explicitement que le devis pourrait augmenter après un diagnostic supplémentaire.',
   'Clara demande un stockage sûr maintenant, et non la poursuite d’une utilisation dangereuse.'
  ],
  explanation:'Clara signale le délai et l’urgence, Amine propose un prêt et Sofia maintient la possibilité d’un coût supérieur. Une solution provisoire protège la santé et permet une décision ultérieure fondée sur des données vérifiées.',
  hint:'Reliez le temps d’attente de Clara à la solution d’Amine, puis à la condition budgétaire rappelée par Sofia.',
  oralPrompt:'En tant que porte-parole, exposez un plan de 90 secondes qui sépare la sécurité immédiate, le diagnostic et la décision finale.',
  objection:'Une voisine répond : « Un prêt est une perte de temps; le devis de 180 euros est définitif. » Corrigez les deux affirmations et proposez des critères.',
  criteria:[
   'Je nomme le délai de quinze jours sans minimiser le besoin alimentaire actuel.',
   'Je présente le prêt comme provisoire et non comme une réparation garantie.',
   'Je précise que le devis dépend du diagnostic et pourrait augmenter.',
   'Je définis les critères de décision sans garantir l’issue.'
  ],
  model:'Clara annonce quinze jours d’attente, mais les aliments doivent être conservés dès aujourd’hui. Amine suggère d’emprunter un appareil provisoire : cela nous donne du temps sans exposer les habitants. Sofia rappelle que le devis initial pourrait augmenter selon le diagnostic. Je vérifierais le prêt, la panne, la garantie et le coût total avant de recommander une décision définitive.'
 }
]);
