import type {A1Unit} from './u6-a1-model.ts';
export interface B1ReadingQuestion{
 readonly prompt:string;readonly answer:string;readonly options:readonly string[];
 readonly explanation:string;
}
export interface B1Reading{
 readonly unitId:string;readonly title:string;readonly french:string;
 readonly questions:readonly B1ReadingQuestion[];
}
type R=readonly [string,string,string,readonly [string,string,readonly string[],string],readonly [string,string,readonly string[],string]];
/** Entirely new French B1 texts. No restricted third-party course content. */
const TEXTS:readonly R[]=[
 ['b1-01','Pourquoi la réunion a changé',
 'Le groupe devait se retrouver vendredi à dix-huit heures. Deux participants ont remarqué que le dernier bus partait plus tôt que prévu, tandis que la bibliothèque fermait à dix-neuf heures. Comme ils ne voulaient laisser personne sans moyen de rentrer, ils ont proposé de commencer une heure plus tôt. Certains membres étaient déjà disponibles; les autres devaient encore répondre. La responsable a donc envoyé un message expliquant le problème et demandant les disponibilités de chacun. Elle a précisé que le nouvel horaire restait une proposition, et non une décision. Son objectif était de trouver une solution pratique plutôt que de faire croire que tous avaient déjà accepté.',
  ['Why is the new time not yet final?','certains membres doivent encore répondre',['certains membres doivent encore répondre','le groupe a annulé le projet','la bibliothèque a fermé définitivement'],'The text separates a proposed change from consent not yet received.'],
  ['Which reason motivates an earlier start?','permettre aux membres de rentrer',['permettre aux membres de rentrer','acheter du nouveau matériel','changer le jour de travail'],'The early bus departure and safe return motivate the proposal.']
 ],
 ['b1-02','Deux façons de se rencontrer',
 'Les bénévoles d’une association discutent du format de leur prochaine rencontre. Une partie du groupe préfère se retrouver dans la même salle, car les échanges sont plus spontanés. D’autres personnes expliquent pourtant qu’un déplacement leur coûterait cher et prendrait trop de temps. Une participante propose une rencontre mixte, bien qu’elle sache que cela demandera du matériel supplémentaire. Personne ne dit que cette solution résoudra automatiquement tous les problèmes. Le groupe décide donc de demander les préférences de chacun avant de choisir. Même si les opinions restent différentes, les participants veulent que la décision tienne compte des besoins réellement exprimés plutôt que des habitudes de quelques personnes.',
  ['What is the main value of surveying participants?','ne pas supposer leurs besoins',['ne pas supposer leurs besoins','garantir une réunion gratuite','éviter tout désaccord'],'The consultation prevents treating a small group’s preferences as universal.'],
  ['What limitation remains with the hybrid idea?','elle demande du matériel',['elle demande du matériel','personne ne peut parler','le lieu sera fermé'],'The proposal needs additional equipment despite its inclusive goal.']
 ],
 ['b1-03','La version du document',
 'À la fin de la semaine, Léa retrouve un document qui décrit les nouveaux horaires de son centre. Le fichier dont elle dispose a une date différente de celle affichée à l’accueil. Son collègue lui demande ce qu’elle peut confirmer avec certitude. Elle répond que les deux documents existent, mais que leur statut n’est pas clair. Ce qui l’inquiète surtout, ce sont les étudiants qui organisent leurs déplacements à partir de ces informations. Elle refuse donc de choisir arbitrairement une version. Au lieu de cela, elle adresse une question précise à la responsable: quel horaire est en vigueur et à partir de quand ? Elle attend une réponse avant de transmettre la nouvelle au groupe.',
  ['Why does Léa delay sharing an exact time?','le statut des versions est incertain',['le statut des versions est incertain','elle a oublié le document','le groupe refuse de venir'],'Both dates exist, but the text does not establish which is official.'],
  ['What does she seek from the manager?','l’horaire applicable et sa date',['l’horaire applicable et sa date','le prix des livres','le nom de tous les étudiants'],'The message asks which schedule applies and when it begins.']
 ],
 ['b1-04','Ce qui aurait pu arriver',
 'Nadia et Karim préparent un voyage pour samedi. Si le temps reste agréable, ils marcheront jusqu’au village voisin. Si la pluie arrive, ils prendront plutôt le train. Karim imagine aussi une situation différente: s’ils avaient une voiture, ils pourraient emporter davantage de bagages. Nadia rappelle ce qui s’est réellement passé la semaine précédente. Ils avaient oublié de vérifier les horaires et avaient manqué la dernière correspondance. S’ils avaient consulté l’application plus tôt, ils auraient attendu moins longtemps. Ils distinguent ce regret du programme de samedi, qui n’est pas encore décidé. Cette fois, ils veulent vérifier les options avant de partir, même si les prévisions peuvent changer.',
  ['Which event belongs to reality rather than a hypothesis?','ils ont manqué une correspondance',['ils ont manqué une correspondance','ils possèdent une voiture','il pleuvra samedi avec certitude'],'The missed connection is described as a real past event.'],
  ['What controls Saturday’s route?','les conditions météorologiques',['les conditions météorologiques','le dernier voyage','la taille des sacs uniquement'],'Their plans depend on whether the weather stays favorable.']
 ],
 ['b1-05','Une idée pour la bibliothèque',
 'Une habitante écrit au conseil de son quartier pour donner son avis sur la bibliothèque. Elle explique qu’elle apprécie cet espace, où des étudiants peuvent travailler et des visiteurs demander de l’aide. Selon elle, fermer la bibliothèque serait regrettable, parce que tout le monde n’a pas les mêmes ressources à la maison. Elle reconnaît néanmoins que les horaires actuels sont trop courts pour plusieurs personnes qui travaillent tard. Plutôt que d’affirmer que tous les habitants pensent comme elle, elle propose une consultation locale. Elle aimerait comparer les besoins exprimés et les moyens disponibles avant de décider d’une éventuelle extension des horaires. Son courrier présente donc une préférence forte, mais aussi une limite concrète et une méthode de décision.',
  ['Why does the writer propose a consultation?','les besoins des habitants diffèrent',['les besoins des habitants diffèrent','personne ne lit de livres','le conseil a déjà décidé'],'She wants evidence about varied needs rather than assuming universal agreement.'],
  ['Which reservation qualifies her positive opinion?','les horaires sont trop courts',['les horaires sont trop courts','les livres sont interdits','les étudiants ne peuvent pas entrer'],'She acknowledges that current opening hours exclude some users.']
 ],
 ['b1-06','Préparer un accueil compréhensible',
 'Une équipe prépare un atelier pour de nouveaux habitants qui ne connaissent pas encore les services du quartier. Les organisateurs veulent créer un guide simple afin de réduire les questions répétées. Ils préparent aussi des exemples visuels pour que chaque participant puisse comprendre les démarches importantes, même sans connaître tous les termes administratifs. Une bénévole propose de lire les informations lentement; un autre prévoit du temps pour poser des questions. À la fin, ils demanderont aux participants de reformuler une consigne avec leurs propres mots. Leur objectif n’est pas seulement de distribuer des documents, mais de vérifier que les personnes savent réellement comment utiliser les services. Ils adapteront le guide selon les difficultés observées.',
  ['Why do participants reformulate a rule?','pour vérifier la compréhension',['pour vérifier la compréhension','pour remplacer les employés','pour apprendre une poésie'],'Restating a procedure checks understanding more directly than receiving a leaflet.'],
  ['What makes the examples useful?','ils rendent les démarches plus accessibles',['ils rendent les démarches plus accessibles','ils suppriment toutes les formalités','ils garantissent un résultat'],'The team uses examples to support understanding despite unfamiliar vocabulary.']
 ],
 ['b1-07','Le message que personne n’a confirmé',
 'Au cours d’une réunion, un responsable annonce oralement que les bureaux ouvriront plus tôt le lendemain. Julie raconte ensuite à ses collègues ce qu’elle a entendu: le responsable a dit que les bureaux ouvriraient plus tôt le jour suivant. Une collègue demande si ce changement concerne aussi le samedi. Julie n’a pas entendu de précision sur ce point et refuse de répondre oui sans preuve. Elle explique la différence entre la phrase effectivement prononcée et la conclusion que certains ont tirée. Enfin, elle propose de demander un courriel récapitulatif. Pour elle, rapporter fidèlement une annonce signifie aussi indiquer ce qu’elle ne permet pas de conclure. Les collègues décident d’attendre la confirmation écrite.',
  ['Which day remains unconfirmed?','samedi',['samedi','le lendemain','le jour de la réunion'],'The manager never clarified whether Saturday was included.'],
  ['Why does Julie ask for an email?','pour distinguer annonce et supposition',['pour distinguer annonce et supposition','pour annuler le rendez-vous','pour supprimer les horaires'],'Written clarification would separate the original announcement from inference.']
 ]
];
export const B1_READINGS_01_07:readonly B1Reading[]=Object.freeze(TEXTS.map(([unitId,title,french,q1,q2])=>Object.freeze({
 unitId,title,french,questions:Object.freeze([q1,q2].map(([prompt,answer,options,explanation])=>Object.freeze({
  prompt,answer,options:Object.freeze([...options]),explanation
 })))
})));
