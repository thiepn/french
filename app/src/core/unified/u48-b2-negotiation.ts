import {getOriginalMaterial} from './u23-registry.ts';

/** Original authored B2 negotiations. All interlocutor follow-ups are imaginary practice,
 * never additions to the original dialogue; no learner speech is graded or recorded.
 */
export interface U48Source{readonly speaker:string;readonly anchor:string}
export interface U48Move{
 readonly id:'grounded'|'overclaim';readonly text:string;readonly supported:boolean;
 readonly feedback:string;readonly followUp:string;
}
export interface U48Route{
 readonly id:string;readonly choice:string;readonly objective:string;
 readonly interlocutor:string;readonly question:string;readonly task:string;
 readonly sourceIndices:readonly [number,number];readonly moves:readonly [U48Move,U48Move];
 readonly finalTask:string;readonly criteria:readonly [string,string,string,string];
 readonly model:string;
}
export interface U48Scenario{
 readonly id:string;readonly lesson:'transfer-151'|'transfer-152'|'transfer-153';
 readonly title:string;readonly context:string;readonly opening:string;
 readonly openingTask:string;readonly sources:readonly [U48Source,U48Source,U48Source,U48Source];
 readonly routes:readonly [U48Route,U48Route];
}
export const ORIGINAL_B2_NEGOTIATIONS:readonly U48Scenario[]=Object.freeze([
 {
  id:'school-council',lesson:'transfer-151',title:'Conseil du lycée : un accord réversible',
  context:'Conseil fictif : il faut concilier la réduction des distractions, les besoins d’accessibilité et une preuve encore incomplète.',
  opening:'Une représentante des parents : « Vous citez 72 %. Est-ce une décision prise par tous les élèves ? Comment avancer sans exclure personne ? »',
  openingTask:'Répondez oralement pendant 45 à 60 secondes : attribuez correctement le chiffre, indiquez ce qui reste inconnu et annoncez une priorité de négociation.',
  sources:[
   {speaker:'Marc',anchor:'72 % des répondants'},
   {speaker:'Nadia',anchor:'règle limitée à certains cours'},
   {speaker:'Lina',anchor:'besoins d’accessibilité soient traités'},
   {speaker:'Marc',anchor:'comparons plusieurs classes'}
  ],
  routes:[
   {
    id:'access',choice:'Priorité A · Garantir l’accès équitable aux cours',
    objective:'Protéger les outils d’assistance tout en formulant une règle compréhensible.',
    interlocutor:'Représentante des élèves (objection fictive)',
    question:'« Si vous autorisez des exceptions, ne sera-t-il pas impossible d’appliquer une règle commune ? »',
    task:'Négociez à voix haute : reconnaissez le besoin de clarté puis proposez une exception vérifiable sans demander l’accès aux messages privés.',
    sourceIndices:[1,2],
    moves:[
     {id:'grounded',supported:true,text:'Prévoir un essai limité avec exceptions d’accessibilité explicites, sans collecte de messages privés.',
      feedback:'Nadia propose une règle limitée et des exceptions transparentes; Lina conditionne son soutien à la prise en compte préalable des besoins d’accessibilité. Cette stratégie reste révisable.',
      followUp:'« Les exceptions sont claires; comment saurez-vous si cet essai aide réellement, sans identifier les élèves concernés ? »'},
     {id:'overclaim',supported:false,text:'Interdire tous les téléphones sans exception parce que 72 % de tout le lycée l’exige.',
      feedback:'Marc parle seulement des répondants et leur nombre est inconnu. Lina demande de traiter l’accessibilité AVANT l’essai. Cette position transforme un sondage partiel en vote universel.',
      followUp:'« Vous venez de supprimer les exceptions et de généraliser le 72 %. Pouvez-vous réparer ces deux affirmations ? »'}
    ],
    finalTask:'Répondez à la relance en français, reformulez une concession, donnez un critère de bilan et proposez une échéance pour reconsidérer la règle. Aucune conclusion n’est déjà acquise.',
    criteria:[
     'Je distingue « répondants » et « tout le lycée » sans inventer un taux de participation.',
     'Je nomme les besoins d’accessibilité et propose des exceptions explicites.',
     'Je refuse la collecte de messages privés et je distingue essai et décision permanente.',
     'Je réponds à la nouvelle question avec une concession et un bilan vérifiable.'
    ],
    model:'Je comprends qu’une règle commune doive rester lisible. Le chiffre de 72 % ne concerne pourtant que les répondants, et Marc ne connaît pas leur nombre. Je proposerais, comme Nadia, un essai limité à certains cours avec des exceptions d’accessibilité publiées à l’avance. Les messages privés ne seraient pas collectés. Nous pourrions comparer les interruptions entre plusieurs classes et demander l’avis des personnes concernées avant toute décision durable.'
   },
   {
    id:'evidence',choice:'Priorité B · Vérifier les effets avant une généralisation',
    objective:'Définir des preuves comparables sans faire de l’incertitude une raison de ne rien tenter.',
    interlocutor:'Enseignante sceptique (objection fictive)',
    question:'« Une classe a eu moins d’interruptions. Pourquoi ne pas imposer la règle dès demain à tous les cours ? »',
    task:'Répondez oralement en distinguant l’observation du lien causal et en proposant une mesure réversible.',
    sourceIndices:[0,3],
    moves:[
     {id:'grounded',supported:true,text:'Comparer plusieurs classes et consulter les personnes concernées avant toute extension.',
      feedback:'Marc propose explicitement de comparer plusieurs classes. Le 72 % concerne seulement les répondants, et l’observation de moins d’interruptions n’isole pas l’effet des téléphones.',
      followUp:'« J’accepte une comparaison limitée. Quels critères et quelle consultation annoncerez-vous avant l’essai ? »'},
     {id:'overclaim',supported:false,text:'Déclarer que les écrans étaient l’unique cause de toutes les interruptions constatées.',
      feedback:'Le dialogue mentionne aussi le changement de disposition des tables. La baisse observée n’établit pas une cause unique; une telle déclaration exagérerait la preuve.',
      followUp:'« Vous avez isolé une cause que personne n’a vérifiée. Comment corrigerez-vous cette explication devant le conseil ? »'}
    ],
    finalTask:'Présentez votre réponse finale à l’enseignante en français : rectifiez l’inférence si nécessaire, prévoyez une comparaison et dites dans quelles conditions vous changeriez d’avis.',
    criteria:[
     'J’attribue le sondage uniquement aux répondants et ne généralise pas son pourcentage.',
     'Je distingue observation, hypothèse causale et preuve comparée avant toute généralisation à l’établissement.',
     'Je propose une règle limitée et une consultation des personnes concernées.',
     'Je réponds à la relance par des critères concrets et une décision révisable.'
    ],
    model:'L’amélioration observée dans une classe mérite notre attention, mais elle ne suffit pas à prouver que la fermeture des écrans en est la seule cause. Le mobilier a aussi changé. Marc recommande de comparer plusieurs classes et de consulter les personnes concernées. Je défendrais donc un essai réversible, avec une définition commune des interruptions, une vérification des besoins d’accessibilité et un bilan public. Si les données ne confirment pas les bénéfices, nous modifierons la règle.'
   }
  ]
 },
 {
  id:'work-committee',lesson:'transfer-152',title:'Comité du travail : compromis sous conditions',
  context:'Entreprise fictive : la semaine de quatre jours répartit toujours trente-cinq heures et l’accueil reste ouvert le vendredi.',
  opening:'Le directeur : « Les dossiers traités ont augmenté de 8 %. Qu’est-ce qui vous empêche d’approuver définitivement notre réforme ? »',
  openingTask:'Parlez pendant une minute : reconnaissez le résultat annoncé sans en tirer une conclusion générale; précisez votre priorité de négociation.',
  sources:[
   {speaker:'Thomas',anchor:'augmenté de 8 %'},
   {speaker:'Aïcha',anchor:'dossiers revenus pour correction'},
   {speaker:'Mélanie',anchor:'permanence du vendredi'},
   {speaker:'Mélanie',anchor:'personnes absentes n’ont pas été interrogées'}
  ],
  routes:[
   {
    id:'equity',choice:'Priorité A · Répartir équitablement la permanence',
    objective:'Défendre les horaires de l’accueil sans effacer les bénéfices possibles pour les bureaux.',
    interlocutor:'Directeur du personnel (objection fictive)',
    question:'« Les collègues de bureau sont contents. Pourquoi l’accueil demanderait-il une compensation supplémentaire ? »',
    task:'Répondez au directeur en français, distinguez les obligations des services et négociez un roulement concret.',
    sourceIndices:[0,2],
    moves:[
     {id:'grounded',supported:true,text:'Négocier une compensation et un roulement équitable pour la permanence du vendredi.',
      feedback:'Mélanie confirme que l’accueil doit assurer le vendredi, contrairement aux bureaux. Thomas soutient une compensation et un roulement équitable sous conditions dans la source originale.',
      followUp:'« Nous pourrions revoir le roulement. Quelles données et quelle échéance permettraient d’en vérifier l’équité ? »'},
     {id:'overclaim',supported:false,text:'Affirmer que tous les salariés ont les mêmes horaires et acceptent déjà la permanence du vendredi.',
      feedback:'Mélanie décrit des horaires différents et la permanence assurée par les collègues d’accueil. Le sondage n’a pas interrogé les personnes absentes; une approbation générale est injustifiée.',
      followUp:'« Vous avez présenté les horaires comme identiques. Pouvez-vous corriger cette erreur avant de négocier la compensation ? »'}
    ],
    finalTask:'Répondez en une minute : proposez une compensation, un contrôle des heures réelles et une révision de l’accord après six semaines.',
    criteria:[
     'Je mentionne les 8 % comme résultat partiel et non comme gain de qualité prouvé.',
     'Je distingue les contraintes de l’accueil de celles des autres services.',
     'Je propose compensation, roulement équitable et contrôle des heures réelles.',
     'Je réponds à la relance en gardant l’accord provisoire et révisable.'
    ],
    model:'Je reconnais que le nombre de dossiers traités a augmenté de 8 %, comme le rapporte Thomas. Toutefois, ce chiffre ne renseigne ni sur les heures supplémentaires ni sur les corrections. Mélanie rappelle que les collègues de l’accueil assurent la permanence du vendredi et n’ont pas tous la même liberté d’organisation. Je proposerais un roulement équitable et une compensation des contraintes, avec un bilan des heures réellement travaillées après six semaines. Nous pourrions alors adapter l’accord plutôt que déclarer une réussite définitive.'
   },
   {
    id:'quality',choice:'Priorité B · Mesurer la qualité et consulter les absents',
    objective:'Dépasser le seul volume de dossiers pour juger la réforme de façon représentative.',
    interlocutor:'Responsable des opérations (objection fictive)',
    question:'« Les 8 % de dossiers en plus suffisent; les corrections et l’avis des absents n’ont aucune importance. »',
    task:'Répondez en français avec une objection polie et deux mesures complémentaires réellement nécessaires.',
    sourceIndices:[1,3],
    moves:[
     {id:'grounded',supported:true,text:'Mesurer les corrections et heures supplémentaires et consulter les salariés absents.',
      feedback:'Aïcha signale précisément les dossiers revenus pour correction et les heures supplémentaires non mesurées. Mélanie précise que les absents ont été exclus du sondage.',
      followUp:'« Je peux publier ces informations. Quel type de décision provisoire peut-on prendre avant leur vérification ? »'},
     {id:'overclaim',supported:false,text:'Déclarer la satisfaction unanime de tout le personnel à partir du seul sondage interne.',
      feedback:'Le sondage ne concernait que les personnes présentes pendant l’essai. Mélanie dit explicitement que les personnes absentes n’ont pas été interrogées.',
      followUp:'« Vous avez parlé d’unanimité sans consultation générale. Comment rétablir une décision représentative ? »'}
    ],
    finalTask:'Formulez un accord temporaire de six semaines avec conditions de prolongation et révision; distinguez clairement volume, qualité et consultation.',
    criteria:[
     'Je ne transforme pas les 8 % en preuve de satisfaction ou de qualité globale.',
     'Je mentionne le coût possible des corrections et des heures supplémentaires.',
     'Je reconnais l’absence de consultation des salariés non présents.',
     'Je négocie une prolongation conditionnelle et un calendrier de bilan.'
    ],
    model:'Une hausse de 8 % du volume des dossiers peut être encourageante, mais elle ne prouve pas une amélioration générale. Aïcha souligne que les corrections et les heures supplémentaires ne sont pas comptées. Mélanie ajoute que les salariés absents n’ont pas été interrogés. Je proposerais donc un accord provisoire de six semaines, avec publication des heures réelles, des retours de qualité et une consultation complémentaire. La direction et les représentants décideraient ensuite si la réforme doit être modifiée ou prolongée.'
   }
  ]
 },
 {
  id:'residence-refrigerator',lesson:'transfer-153',title:'Résidence : sécurité immédiate et choix durable',
  context:'Résidence fictive : une panne rend la conservation des aliments incertaine. Réparation, reconditionnement et achat neuf sont à comparer.',
  opening:'Une résidente : « Le nouveau modèle consommerait 25 % de moins. Pourquoi attendre, si notre réfrigérateur ne refroidit plus ? »',
  openingTask:'Répondez oralement : dissociez l’urgence alimentaire du calcul des économies, et choisissez votre priorité de négociation.',
  sources:[
   {speaker:'Amine',anchor:'25 % d’électricité en moins'},
   {speaker:'Sofia',anchor:'notre consommation réelle'},
   {speaker:'Clara',anchor:'stockage alimentaire sûr maintenant'},
   {speaker:'Amine',anchor:'emprunter un appareil de remplacement provisoire'}
  ],
  routes:[
   {
    id:'safety',choice:'Priorité A · Protéger immédiatement les aliments',
    objective:'Éviter de confondre délai de réparation et tolérance au risque alimentaire.',
    interlocutor:'Résidente pressée (objection fictive)',
    question:'« La pièce arrive dans quinze jours. Pourquoi ne pas simplement utiliser le réfrigérateur actuel en attendant ? »',
    task:'Expliquez poliment les exigences immédiates de sécurité et proposez une solution provisoire.',
    sourceIndices:[2,3],
    moves:[
     {id:'grounded',supported:true,text:'Emprunter provisoirement un autre appareil sûr et vérifier le diagnostic avant la décision finale.',
      feedback:'Clara demande une conservation sûre maintenant; Amine propose expressément d’emprunter un appareil provisoire plutôt que de décider dans l’urgence.',
      followUp:'« J’accepte un prêt temporaire. Que vérifierons-nous ensuite avant de choisir entre réparation, reconditionné et neuf ? »'},
     {id:'overclaim',supported:false,text:'Continuer à utiliser l’appareil défectueux sans précaution pendant les quinze jours.',
      feedback:'Clara dit que les habitants ont besoin d’un stockage alimentaire sûr immédiatement. Reporter la sécurité jusqu’à la livraison contredit le problème initial.',
      followUp:'« Nous devons protéger les aliments dès aujourd’hui. Comment corrigerez-vous votre proposition sans promettre une réparation certaine ? »'}
    ],
    finalTask:'Défendez en français la solution immédiate, indiquez les inconnues du devis et exposez les critères pour la décision définitive.',
    criteria:[
     'Je sépare la conservation sûre immédiate du délai de quinze jours.',
     'Je présente un appareil de prêt comme une mesure provisoire, sans promettre la réussite ni le coût de la réparation.',
     'Je précise que le diagnostic et le coût final de réparation restent incertains.',
     'Je réponds à la nouvelle demande sans promettre une économie garantie.'
    ],
    model:'La sécurité alimentaire doit être assurée dès maintenant, même si la pièce détachée n’arrive que dans quinze jours. Clara insiste sur ce besoin immédiat et Amine suggère d’emprunter un appareil provisoire. Je suivrais cette solution pour éviter de choisir dans l’urgence. Pendant le prêt, nous demanderions un diagnostic définitif, un devis actualisé et une comparaison des garanties, des délais et des coûts réels. La décision finale pourrait alors être prise sans exposer les habitants.'
   },
   {
    id:'evidence',choice:'Priorité B · Comparer les coûts et les preuves environnementales',
    objective:'Examiner les promesses d’économie et la réparation sans fabriquer une certitude sur le long terme.',
    interlocutor:'Trésorier de la résidence (objection fictive)',
    question:'« Le fabricant promet 25 % d’électricité en moins; cela garantit forcément une facture réduite de 25 %, non ? »',
    task:'Répondez à l’objection avec une distinction entre test standard, consommation réelle et urgence.',
    sourceIndices:[0,1],
    moves:[
     {id:'grounded',supported:true,text:'Vérifier la consommation locale et les coûts totaux, tout en organisant une solution sûre immédiate.',
      feedback:'Amine cite un test standard; Sofia précise que la consommation réelle et l’impact de fabrication ne sont pas établis. Le risque alimentaire impose néanmoins une solution immédiate.',
      followUp:'« Très bien, demandons ces données. Quelle décision provisoire prendrons-nous pendant le diagnostic ? »'},
     {id:'overclaim',supported:false,text:'Garantir que la facture annuelle baissera de 25 % et que le neuf sera toujours plus écologique.',
      feedback:'Sofia dit que la comparaison ignore la consommation réelle et l’impact de fabrication. Le 25 % du test standard ne garantit ni la facture locale ni le bilan environnemental.',
      followUp:'« Vous avez transformé une valeur normalisée en garantie locale. Pouvez-vous corriger le raisonnement et proposer une solution pour aujourd’hui ? »'}
    ],
    finalTask:'Présentez un choix conditionnel à la trésorerie : sécurité présente, données à réunir, diagnostic, garantie et comparaison finale.',
    criteria:[
     'Je distingue les 25 % mesurés en test standard de l’usage réel de la résidence.',
     'Je ne promets ni économies locales ni supériorité écologique automatique.',
     'Je nomme au moins deux informations vérifiables avant la décision finale.',
     'Je tiens compte du stockage alimentaire immédiat et propose une mesure temporaire.'
    ],
    model:'Le fabricant annonce 25 % d’électricité en moins dans un test standard, mais Sofia souligne que nous ignorons la consommation réelle de la résidence et l’impact de fabrication. Nous ne pouvons donc pas garantir une économie annuelle de 25 %. Avant le choix définitif, je comparerais le coût total, le devis final de réparation, les garanties et la consommation locale. En parallèle, nous devons protéger les aliments immédiatement, par exemple grâce à un appareil de prêt, puisque le diagnostic et la livraison prennent du temps.'
   }
  ]
 }
]);
function normalized(x:string):string{
 return x.normalize('NFC').replace(/[‘’]/g,"'").toLocaleLowerCase('fr').replace(/\s+/g,' ').trim();
}
export function resolveB2NegotiationSources(scene:U48Scenario):readonly {speaker:string;fr:string;index:number}[]|null{
 const original=getOriginalMaterial(scene.lesson);
 if(!original)return null;
 const turns=original.unit.dialogue;
 const found=scene.sources.map(({speaker,anchor})=>{
  const index=turns.findIndex(t=>t.speaker===speaker&&normalized(t.fr).includes(normalized(anchor)));
  return index<0?null:{index,speaker,fr:turns[index].fr};
 });
 if(found.some(x=>x===null)||new Set(found.map(x=>x?.index)).size!==scene.sources.length)return null;
 return found as {speaker:string;fr:string;index:number}[];
}
export function evaluateB2NegotiationMove(move:U48Move):{supported:boolean;feedback:string}{
 return{supported:move.supported,feedback:move.feedback};
}
export function validateB2Negotiations():readonly string[]{
 const errors:string[]=[];
 if(ORIGINAL_B2_NEGOTIATIONS.length!==3)errors.push('Expected exactly three original early B2 scenarios');
 const ids=new Set<string>();
 for(const item of ORIGINAL_B2_NEGOTIATIONS){
  if(ids.has(item.id))errors.push('Duplicate negotiation '+item.id);ids.add(item.id);
  if(!resolveB2NegotiationSources(item))errors.push('Missing unique exact original source turns: '+item.lesson);
  if(item.routes.length!==2||new Set(item.routes.map(x=>x.id)).size!==2)
   errors.push('Missing two distinct negotiation priorities: '+item.id);
  for(const route of item.routes){
   if(route.moves.length!==2||route.moves.filter(x=>x.supported).length!==1||
    route.moves.filter(x=>!x.supported).length!==1)
    errors.push('Expected one evidence-grounded and one overclaim move: '+item.id+'/'+route.id);
   if(route.sourceIndices.some(i=>i<0||i>=item.sources.length)||route.sourceIndices[0]===route.sourceIndices[1])
    errors.push('Bad negotiation source reference: '+item.id+'/'+route.id);
   if(route.model.length<280||route.criteria.length!==4||route.criteria.some(s=>s.length<65)||
    route.moves.some(x=>x.feedback.length<120||x.followUp.length<75))
    errors.push('Insufficient French feedback or independent model: '+item.id+'/'+route.id);
  }
 }
 return errors;
}
