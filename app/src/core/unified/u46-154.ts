import {originalB2DebateProduction,type U21OriginalSourceStory} from './u21-content-helper.ts';

/** Original fictional municipal-library dossier, first case in a cumulative B2 sequence. */
const story:U21OriginalSourceStory={
 id:'transfer-154',title:'Bibliothèque du quartier : lire des chiffres avant de décider',
 goal:'Interpret incomplete opening-hour data, distinguish attendance from unmet demand and prepare a fair public consultation.',
 grammarKeys:['source','concession'],
 vocabulary:[
  ['la fréquentation','attendance','La fréquentation totale ne révèle pas qui ne peut pas venir.'],
  ['un créneau horaire','time slot','Le créneau du jeudi soir est réservé aux ateliers.'],
  ['un registre','register','Le registre compte les entrées, non les personnes différentes.'],
  ['un usager','library user','Chaque usager peut exprimer un besoin distinct.'],
  ['un non-répondant','non-respondent','Un non-répondant ne représente pas automatiquement un avis négatif.'],
  ['un dénominateur','denominator','Sans dénominateur, le pourcentage peut induire en erreur.'],
  ['une amplitude horaire','opening-hours span','Une amplitude horaire plus large ne garantit pas l’accès.'],
  ['une barrière d’accès','access barrier','Le dernier bus constitue une barrière d’accès pour certains habitants.'],
  ['une période d’essai','trial period','La période d’essai permettra de revoir le calendrier.'],
  ['un relevé','record','Le relevé indique les visites, pas leur motif.'],
  ['un biais de sélection','selection bias','Le biais de sélection concerne les personnes interrogées sur place.'],
  ['une permanence','staffed service','Une permanence doit être assurée pendant l’atelier du soir.']
 ],
 dialogue:[
  ['Maya','La mairie propose d’ouvrir notre bibliothèque deux soirs par semaine, mais nous devons vérifier à qui cet horaire servirait.','The municipality proposes opening our library two evenings a week, but we must check whom that schedule would serve.'],
  ['Hugo','Le registre annonce 1 200 entrées en octobre; il ne distingue pas les visiteurs réguliers des personnes venues une seule fois.','The register reports 1,200 entries in October; it does not separate regular visitors from one-time users.'],
  ['Maya','Nous ne pouvons donc pas dire que 1 200 habitants différents fréquentent le lieu.','We therefore cannot say that 1,200 different residents use the place.'],
  ['Salomé','Le sondage mené à l’accueil indique que 68 % des répondants aimeraient une ouverture le jeudi soir.','The survey conducted at reception says 68% of respondents would like Thursday evening opening.'],
  ['Hugo','Cependant, les personnes qui ne peuvent pas venir aux horaires actuels étaient presque absentes de ce sondage.','However, people who cannot come during current hours were almost absent from that survey.'],
  ['Salomé','Une étudiante m’a expliqué qu’elle sort du travail à dix-neuf heures, mais que le dernier bus passe tôt.','A student explained to me that she finishes work at seven, but the last bus runs early.'],
  ['Maya','Il faudrait consulter aussi les absents, les personnes à mobilité réduite et les familles avant de fixer les horaires.','We should also consult those absent, people with limited mobility and families before setting hours.'],
  ['Hugo','Si nous définissons des indicateurs et un essai limité, nous pourrons comparer les usages sans promettre un succès.','If we define indicators and a limited trial, we will be able to compare use without promising success.'],
  ['Salomé','D’accord, préparons un questionnaire accessible et une réunion publique; rien n’est encore décidé.','Agreed, let us prepare an accessible survey and a public meeting; nothing has been decided yet.']
 ],
 readingTitle:'Le registre ne décrit pas tous les habitants',
 paragraphs:[
  'Dans une ville fictive, une bibliothèque municipale envisage de prolonger ses horaires deux soirs par semaine. Son registre signale 1 200 entrées durant le mois d’octobre. Ce total compte des passages et non des personnes distinctes: un habitant qui entre cinq fois apparaît cinq fois. La direction souhaite améliorer l’accès des travailleurs et des étudiants, mais elle ne dispose d’aucune mesure du nombre de personnes actuellement empêchées de venir. Il serait donc incorrect de présenter les 1 200 entrées comme le nombre d’habitants satisfaits ou de déduire qu’une extension profiterait à tous.',
  'Un court questionnaire distribué à l’accueil annonce que 68 % des répondants préfèrent une ouverture le jeudi soir. Pourtant, seuls les visiteurs déjà présents ont pu répondre facilement. Les parents ayant des horaires irréguliers, les personnes âgées dépendantes du bus et les salariés qui terminent tard risquent de manquer dans l’échantillon. De plus, une soirée supplémentaire ne serait utile que si le personnel, l’éclairage et le trajet de retour sont adaptés. Des élus défendent l’idée de maximiser les entrées, tandis qu’une association de quartier demande de mesurer aussi les obstacles d’accès.',
  'Le conseil de la bibliothèque refuse de prendre une décision définitive à partir de ces chiffres. Il propose de consulter plusieurs groupes, y compris des non-usagers, de publier les limites du sondage et de prévoir un essai réversible. Les nouveaux indicateurs distingueront les passages, les besoins exprimés et les difficultés de transport. Une réunion publique sera organisée avant le choix des deux créneaux. Le conseil insiste sur une distinction: un avis recueilli sur place peut révéler une demande réelle sans constituer une photographie représentative de toute la population.'
 ],
 evidence:[
  {label:'Fictional October library attendance register',type:'data',french:'Octobre : 1 200 entrées enregistrées, dont plusieurs visites d’une même personne possibles. Aucun décompte fiable de visiteurs uniques ni des personnes empêchées de venir n’a été établi. Les chiffres ne peuvent pas être interprétés comme la proportion de la population desservie.'},
  {label:'Fictional on-site library opening-hours survey',type:'minutes',french:'Parmi les répondants interrogés à l’accueil, 68 % préfèrent une ouverture le jeudi soir. Le questionnaire n’a presque pas touché les habitants absents pendant les heures habituelles. Le taux de réponse de la population totale et les besoins de transport restent inconnus.'}
 ],
 reading:[
  ['What does the number 1,200 actually measure?','les entrées enregistrées','les habitants différents','les votes favorables','The attendance register counts entries, including repeat visits; it cannot identify unique residents.'],
  ['Why might the 68% survey exclude important needs?','les personnes absentes aux heures actuelles','les visiteurs habituels présents','les bibliothécaires du soir','The questionnaire mainly reached people already able to attend during existing opening times.'],
  ['What is the next justified decision?','consulter aussi les non-usagers','annoncer un succès permanent','fermer le service des transports','The council proposes broader consultation, explicit indicators and a reversible trial before permanent scheduling.']
 ],
 compare:[
  ['What do the register and survey fail to establish together?','la demande de toute la population','le nombre de passages du mois','la préférence des répondants présents','Neither repeat entry counts nor an on-site survey measures the full population or those excluded from current hours.'],
  ['Which attribution keeps both fictional sources accurate?','le registre compte les passages; le sondage rapporte les répondants','1 200 personnes réclament le jeudi soir','68 % des habitants viennent chaque jour','Each document concerns a different observed population and cannot be collapsed into a single claim.']
 ],
 listen:[
  ['Who presents the monthly attendance figure?','Hugo','Maya','Salomé','Hugo reports the register’s 1,200 entries without equating them to distinct residents.'],
  ['How many October entries are mentioned?','1 200','120','12 000','The numerical figure is a count of entries and can include repeat visits.'],
  ['What share of respondents prefers Thursday evening?','68 %','86 %','48 %','Salomé attributes 68 percent to respondents from the reception survey only.'],
  ['Which group was almost absent from the survey?','les personnes empêchées de venir','les visiteurs interrogés à l’accueil','les responsables du registre','Hugo says people excluded by existing opening hours were largely missing.'],
  ['What transport concern is raised?','le dernier bus passe tôt','un avion est annulé','la route est fermée définitivement','The student’s last bus makes late opening potentially inaccessible despite a stated preference.'],
  ['Has the council finalized the two evening slots?','non','oui','le registre le décide','Salomé explicitly says no final decision has been made.']
 ],
 clozes:[
  ['Complétez l’attribution : « ___ le registre, 1 200 entrées ont été comptées. »','Selon','Selon attributes a numerical observation without redefining its population.','source attribution'],
  ['Complétez la concession : « ___ le sondage soit utile, il exclut certains habitants. »','Bien que','Bien que takes the subjunctive soit, allowing the writer to accept usefulness while showing a limit.','concession']
 ],
 order:['Le registre ne compte pas les personnes uniques.',['pas les personnes uniques.','Le registre ne compte'],'The negation frames compte and the wording retains the distinction between entries and unique people.','negation'],
 writing:{
  listening:['Write a neutral 150–200-word meeting account in French, correctly attributing all three speakers and identifying what is still undecided.','Pendant la réunion, Hugo a présenté les 1 200 entrées d’octobre, sans prétendre qu’il s’agissait de 1 200 visiteurs différents. Salomé a cité un sondage mené à l’accueil dans lequel 68 % des répondants préféraient le jeudi soir. Hugo a toutefois rappelé que les habitants absents pendant les horaires actuels avaient été peu interrogés. Maya a proposé de consulter également les non-usagers et les personnes ayant des contraintes de transport ou d’accessibilité. Le conseil souhaite organiser une réunion publique, préciser les indicateurs et envisager un essai réversible. Les deux nouveaux créneaux ne sont pas encore fixés.'],
  sources:['Compare the register and survey in 170–220 words of French; distinguish counts, samples and omitted residents before making a justified proposal.','Le registre de la bibliothèque dénombre 1 200 passages en octobre. Ce chiffre ne correspond pas au nombre de personnes différentes car certains visiteurs reviennent régulièrement. Le sondage, pour sa part, indique une préférence pour le jeudi soir chez 68 % des répondants présents à l’accueil. Cependant, les habitants qui ne pouvaient pas venir aux horaires actuels sont sous-représentés. Ces sources mesurent des réalités différentes: une activité enregistrée et des préférences exprimées dans un échantillon limité. Je recommanderais une consultation accessible aux non-usagers, avec des questions sur le transport et les horaires de travail. Un essai réversible pourrait ensuite vérifier les effets sans annoncer de succès définitif.'],
  debate:['Argue in 180–220 French words for a fair consultation before extending opening hours. Answer the objection that maximum visits are the only relevant objective.','Je suis favorable à une extension des horaires, mais uniquement après une consultation plus large. Le registre compte des passages, pas des habitants distincts; il ne suffit donc pas de viser le plus grand nombre d’entrées. Certains usagers réguliers souhaitent le jeudi soir, tandis que les personnes actuellement exclues n’ont presque pas été entendues. On pourrait objecter que les statistiques de fréquentation permettent une décision rapide. Pourtant, une politique publique doit examiner qui bénéficie du service et qui reste à l’écart. Je proposerais un questionnaire accessible, une réunion ouverte aux non-usagers et un essai limité avec des critères publiés. Si la nouvelle organisation aggravait les difficultés de transport ou l’inégalité d’accès, elle devrait être revue.']
 },
 oral:['Give a three-minute source-attributed public consultation opening in French. Distinguish entries from distinct users and invite missing voices before proposing an experiment.','Je souhaite rappeler que les 1 200 entrées ne représentent pas nécessairement 1 200 personnes. Le sondage indique une préférence de certains répondants, mais plusieurs habitants n’ont pas été consultés. Avant de choisir deux soirées, ouvrons la discussion aux non-usagers et vérifions les contraintes de transport. Nous pourrions ensuite mener un essai réversible.']
};
export const U46_154=Object.freeze([originalB2DebateProduction(story,154)]);
