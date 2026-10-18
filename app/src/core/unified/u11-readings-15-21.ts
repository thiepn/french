import type {B1Reading} from './u10-readings-01-07.ts';
type Q=readonly [string,string,readonly string[],string];
const RECORDS:readonly (readonly [string,string,readonly string[],readonly Q[]])[]=[
  [
    "b1-15",
    "Avis municipal : accès aux salles",
    [
      "Le centre du quartier publie un avis annonçant une fermeture partielle de ses locaux à partir du lundi 18 mai. Les salles A et C ne pourront pas accueillir de visiteurs pendant des travaux de sécurité. La salle B restera accessible aux associations qui disposent déjà d’une réservation confirmée. Le texte recommande à ces associations de contacter l’accueil avant de se déplacer. Il précise que l’avis concerne uniquement les salles de réunion.",
      "Plusieurs habitants interprètent pourtant cette annonce comme une fermeture complète du bâtiment. Une bénévole remarque que l’accueil et le petit espace de lecture ne sont pas mentionnés dans les restrictions. Elle explique qu’il serait imprudent de promettre que ces services resteront ouverts, car le texte n’indique ni leurs horaires ni la présence éventuelle du personnel. L’exception pour la salle B ne donne pas non plus automatiquement accès aux visiteurs sans inscription.",
      "L’association prépare une courte note destinée à ses membres. Elle rappelle la date d’application, la portée limitée de la fermeture et l’exception réservée aux groupes déjà inscrits. Elle distingue la recommandation de téléphoner d’une obligation de réserver, puisque les deux expressions n’ont pas la même force. Enfin, elle demande une précision au secrétariat sur les services qui ne figurent pas dans l’avis, avant de partager une conclusion définitive."
    ],
    [
      [
        "Which rooms are explicitly closed?",
        "les salles A et C",
        [
          "les salles A et C",
          "toutes les salles",
          "seulement la salle B"
        ],
        "The notice expressly names rooms A and C for closure during safety work."
      ],
      [
        "Can visitors without reservations be promised entry to room B?",
        "non, ce n’est pas confirmé",
        [
          "oui, pour tous",
          "non, ce n’est pas confirmé",
          "seulement le dimanche"
        ],
        "Room B's exception is limited to associations with confirmed reservations."
      ],
      [
        "What should the association communicate responsibly?",
        "la portée et les exceptions, puis vérifier le reste",
        [
          "annoncer une fermeture totale",
          "la portée et les exceptions, puis vérifier le reste",
          "dire que tout est ouvert"
        ],
        "A careful synthesis separates explicit restrictions from services not covered by the notice."
      ]
    ]
  ],
  [
    "b1-16",
    "Trois courriels et aucune décision",
    [
      "Lundi matin, Mélanie écrit au secrétariat d’un centre de formation pour demander le report de son inscription. Dans son premier message, elle indique la date initiale, explique que son nouvel horaire de travail l’empêche d’y assister et propose deux autres journées. Elle demande poliment si une modification est envisageable. Elle ne parle ni de remboursement ni de droit automatique à une autre place, car elle n’a pas consulté les conditions applicables.",
      "Mardi, un accusé de réception automatique arrive dans sa boîte de messagerie. Le document confirme que son dossier a bien été reçu et fournit un numéro de référence. Il explique que les demandes seront examinées dans l’ordre, mais ne promet aucune durée exacte. Mélanie pense d’abord que la présence d’un numéro signifie que son changement est validé. En relisant le texte, elle comprend cependant qu’il indique seulement une étape administrative.",
      "Jeudi après-midi, n’ayant obtenu aucune décision, Mélanie prépare une relance. Elle rappelle les échanges dans leur ordre, mentionne le numéro reçu et demande un délai indicatif de réponse. Avant d’envoyer ce troisième courriel, elle relit sa phrase « ma nouvelle date confirmée » et la remplace par « la date demandée ». Ce petit changement évite de présenter comme accepté ce qui reste en attente. Son message conserve un ton poli et une question concrète."
    ],
    [
      [
        "Which email gives an actual decision?",
        "aucun des trois",
        [
          "le premier",
          "le deuxième",
          "aucun des trois"
        ],
        "The first requests, the second acknowledges receipt and the third follows up; none approves."
      ],
      [
        "Why does Mélanie change her wording?",
        "la date n’est pas approuvée",
        [
          "elle veut annuler",
          "la date n’est pas approuvée",
          "le numéro est faux"
        ],
        "She removes the word confirmed because the office has not accepted the new date."
      ],
      [
        "What makes her follow-up useful?",
        "référence et question sur le délai",
        [
          "référence et question sur le délai",
          "demande de remboursement inventé",
          "ton agressif"
        ],
        "The follow-up identifies the case and asks one actionable question without assuming approval."
      ]
    ]
  ],
  [
    "b1-17",
    "Forum : les réponses arrivent-elles vraiment trop tard ?",
    [
      "Sur un forum local, Adrien affirme que le nouveau service de réservation « ne répond jamais ». Il décrit une demande faite un vendredi soir et une réponse reçue le mardi. Plusieurs personnes réagissent immédiatement à son message. Une lectrice affirme avoir attendu une semaine; un autre utilisateur explique avoir obtenu une réponse le lendemain matin. Personne ne précise combien de demandes ont été traitées au total ni comment les délais sont calculés.",
      "Une modératrice invite les participants à distinguer leurs expériences personnelles de la situation générale. Elle reconnaît que plusieurs attentes ont pu être pénibles, surtout lorsque les utilisateurs devaient organiser un déplacement. Toutefois, les trois témoignages ne permettent pas de connaître le délai habituel du service. Même une réponse rapide ne suffit pas à prouver que tout fonctionne toujours bien. Le problème mérite une vérification plus large que les messages publiés.",
      "Au lieu de classer les usagers entre personnes satisfaites et personnes mécontentes, la modératrice propose une amélioration concrète. Le site pourrait indiquer un délai de réponse estimé et expliquer comment relancer une demande qui reste sans réponse. Elle suggère aussi de publier les horaires pendant lesquels des agents examinent les dossiers. Les participants apprécient l’idée, mais comprennent qu’il faudra demander aux responsables si ces informations peuvent réellement être communiquées."
    ],
    [
      [
        "How many individual experiences are specifically described?",
        "trois",
        [
          "deux",
          "trois",
          "plus de cent"
        ],
        "The passage describes Adrien and two additional users, not a population survey."
      ],
      [
        "Why is 'never replies' unsupported?",
        "des réponses ont été reçues",
        [
          "le site n’existe pas",
          "des réponses ont été reçues",
          "la réservation est gratuite"
        ],
        "Each reported experience actually includes a response, although waiting time varies."
      ],
      [
        "What actionable improvement is proposed?",
        "publier un délai indicatif et les relances",
        [
          "supprimer toutes les réservations",
          "publier un délai indicatif et les relances",
          "annoncer une réponse immédiate garantie"
        ],
        "A published estimate and follow-up procedure would help users plan without promising a guaranteed time."
      ]
    ]
  ],
  [
    "b1-18",
    "Portrait : changer de métier sans réinventer sa vie",
    [
      "Dans un entretien pour un journal associatif, Camille raconte son parcours professionnel. Elle a travaillé pendant presque dix ans dans une entreprise de transport et s’occupait surtout de tâches administratives. En parallèle, elle participait chaque semaine à des activités bénévoles dans une bibliothèque. Elle explique qu’elle aimait rencontrer des lecteurs et aider les nouveaux habitants à trouver des informations. L’article ne décrit pas son ancien emploi comme insupportable; au contraire, elle remercie plusieurs collègues pour leur soutien.",
      "Après quelques années de bénévolat, Camille a suivi une formation complémentaire. Elle avait longtemps hésité avant de déposer sa candidature, parce qu’elle voulait être certaine de comprendre les exigences du nouveau métier. Quand un poste s’est libéré dans son quartier, elle a présenté son dossier. Plusieurs mois plus tard, elle a commencé à travailler à la bibliothèque. Selon elle, la préparation précédente a rendu la transition moins brusque, même si elle a dû apprendre beaucoup de nouvelles choses.",
      "Le journaliste lui demande finalement si elle conseillerait à tout le monde de changer de profession. Camille répond que chaque situation est différente et qu’elle ne peut pas donner une réponse universelle. Elle recommande plutôt de rencontrer des personnes qui exercent le métier envisagé et d’étudier les conséquences pratiques d’une formation. Le portrait présente donc un tournant important, mais n’en fait ni une preuve que tous les changements réussissent ni une critique injustifiée des emplois précédents."
    ],
    [
      [
        "What experience came before the career training?",
        "le bénévolat à la bibliothèque",
        [
          "le bénévolat à la bibliothèque",
          "un poste permanent",
          "un déménagement"
        ],
        "The profile explicitly places regular volunteer work before further training."
      ],
      [
        "Does Camille say her former employment was unbearable?",
        "non, elle remercie des collègues",
        [
          "oui, elle le détestait",
          "non, elle remercie des collègues",
          "elle refuse d’en parler"
        ],
        "The interview thanks colleagues and does not present the former position as unbearable."
      ],
      [
        "What advice can responsibly be attributed to Camille?",
        "se renseigner sur le métier et la formation",
        [
          "démissionner immédiatement",
          "se renseigner sur le métier et la formation",
          "changer de travail tous les ans"
        ],
        "She suggests investigating the work and practical implications before changing careers."
      ]
    ]
  ],
  [
    "b1-19",
    "Entretien : le projet est-il prêt ?",
    [
      "Une journaliste interroge la responsable d’une petite maison de quartier au sujet d’un projet de prolongation des horaires. L’introduction de l’article annonce que « le centre pourrait bientôt ouvrir plus longtemps ». Dans sa réponse, la responsable explique que quelques associations ont proposé cette idée, mais qu’aucune consultation complète n’a été réalisée. Elle ne sait pas encore combien d’habitants seraient intéressés par une ouverture supplémentaire, ni quels jours leur conviendraient.",
      "La journaliste demande ensuite si une nouvelle plage horaire pourrait commencer dès le mois suivant. La responsable répond que cela dépendrait d’un budget complémentaire et de la disponibilité du personnel. Elle juge une période d’essai envisageable, à condition que les ressources soient suffisantes. Le projet n’a pas été soumis au vote, et aucune date n’a été annoncée officiellement. Malgré ces précisions, un lecteur pressé pourrait retenir seulement les mots « ouverture prolongée » du titre.",
      "Avant de publier son article, la journaliste revient sur les éléments essentiels : le besoin exprimé par certains groupes, le financement incertain, la consultation à organiser et l’absence de décision. Elle décide de conserver le conditionnel dans son résumé afin de ne pas transformer une possibilité en engagement ferme. Elle ajoutera une question sur le calendrier des discussions. Ainsi, l’article pourra être encourageant sans faire croire que les nouvelles heures sont déjà garanties."
    ],
    [
      [
        "Has a date been formally announced?",
        "non, aucune date officielle",
        [
          "oui, le mois suivant",
          "non, aucune date officielle",
          "oui, vendredi"
        ],
        "The official explicitly says no decision or date has been announced."
      ],
      [
        "What would make a trial possible?",
        "des ressources et du personnel disponibles",
        [
          "des ressources et du personnel disponibles",
          "un titre plus court",
          "une fermeture complète"
        ],
        "The proposal depends on budget and staff availability."
      ],
      [
        "How can the article remain accurate despite a hopeful headline?",
        "conserver le conditionnel et les réserves",
        [
          "promettre une ouverture",
          "conserver le conditionnel et les réserves",
          "supprimer la réponse"
        ],
        "Conditional wording and explicit constraints distinguish a possibility from an approved plan."
      ]
    ]
  ],
  [
    "b1-20",
    "Comment une demande est traitée",
    [
      "Un article du bulletin municipal décrit le traitement des inscriptions à un atelier. Tout d’abord, les demandes sont reçues par le secrétariat et enregistrées avec une référence. Ensuite, un agent examine si les informations exigées sont présentes. Quand un document manque, le service contacte la personne concernée afin de lui permettre de compléter son dossier. L’accusé de réception envoyé au début du processus ne signifie donc pas que la demande a été acceptée.",
      "Le texte explique aussi pourquoi certaines réponses prennent davantage de temps. Les dossiers incomplets exigent parfois des échanges supplémentaires, tandis que d’autres peuvent être étudiés rapidement. En comparant les références, les agents évitent des doublons qui compliqueraient le suivi. Cependant, l’article ne fournit pas de durée moyenne précise. Il serait donc trompeur d’annoncer un délai garanti à tous les demandeurs en s’appuyant uniquement sur cette description du processus.",
      "Enfin, l’agent responsable examine les places disponibles avant de notifier la décision. Si une demande est acceptée, le courrier de confirmation précise les conditions de participation. Dans les autres cas, le service indique quelles étapes restent possibles, lorsque ces possibilités existent réellement. L’article recommande aux candidats de conserver leurs références et de vérifier les messages reçus. Il rappelle qu’un problème technique apparent ne doit pas être traité comme une preuve d’acceptation ou de refus."
    ],
    [
      [
        "What happens before a decision is made?",
        "vérification et examen des places",
        [
          "vérification et examen des places",
          "paiement automatique garanti",
          "ouverture d’une nouvelle salle"
        ],
        "The article places completeness review and available-seat examination before the final notification."
      ],
      [
        "Does the article guarantee a fixed reply time?",
        "non",
        [
          "oui, un jour",
          "non",
          "oui, une semaine"
        ],
        "It explicitly says no reliable average or guaranteed duration is provided."
      ],
      [
        "Why should applicants retain references?",
        "pour suivre leur demande sans confusion",
        [
          "pour recevoir un cadeau",
          "pour suivre leur demande sans confusion",
          "pour choisir un agent"
        ],
        "References support follow-up across the stages without implying approval."
      ]
    ]
  ],
  [
    "b1-21",
    "Avis sur un objet pratique",
    [
      "Pendant six jours, Bastien a essayé un petit sac destiné aux trajets quotidiens. Il décrit son poids, le nombre de poches et la présence d’une fermeture supplémentaire, éléments qu’un lecteur pourrait vérifier sur le produit. Selon lui, le sac est plus confortable que son ancien modèle pendant de courtes promenades. Il reconnaît cependant que son expérience est personnelle et qu’il ne l’a pas encore utilisé sous une forte pluie ni pendant un voyage de plusieurs semaines.",
      "Dans son avis, Bastien explique aussi ce qui l’a déçu. La poche extérieure lui semble trop étroite pour sa bouteille, et la fermeture est parfois difficile à saisir avec des gants. En revanche, la petite taille du sac représente un avantage dans les transports en commun. Il compare deux usages au lieu de déclarer que l’article est simplement excellent ou mauvais. Pour quelqu’un qui transporte beaucoup de matériel, un modèle plus grand serait sans doute mieux adapté.",
      "Sa recommandation finale reste donc conditionnelle. Il proposerait d’essayer ce sac à une personne qui recherche un objet léger pour des déplacements courts, à condition qu’elle n’ait pas besoin de nombreuses affaires. Il invite les lecteurs à vérifier eux-mêmes les dimensions avant l’achat et à ne pas confondre ses impressions avec un test de durabilité. L’avis est ainsi utile non parce qu’il promet la perfection, mais parce qu’il explique les critères sur lesquels repose le jugement."
    ],
    [
      [
        "What has Bastien NOT tested?",
        "le sac sous forte pluie",
        [
          "le poids du sac",
          "le sac sous forte pluie",
          "les poches"
        ],
        "He explicitly notes that heavy rain and long-term use remain untested."
      ],
      [
        "For whom might a larger bag be preferable?",
        "une personne transportant beaucoup de matériel",
        [
          "une personne transportant beaucoup de matériel",
          "un voyageur sans affaires",
          "quelqu’un qui cherche une poche légère"
        ],
        "He says the compact bag is less suited to carrying lots of equipment."
      ],
      [
        "Why is the recommendation credible despite limitations?",
        "elle nomme l’usage et les limites",
        [
          "elle nomme l’usage et les limites",
          "elle prétend être universelle",
          "elle promet vingt ans de durabilité"
        ],
        "The review distinguishes verified features, short-term opinion, and suitability constraints."
      ]
    ]
  ]
];
export const U11_READINGS_15_21:readonly B1Reading[]=Object.freeze(RECORDS.map(([unitId,title,paragraphs,questions])=>Object.freeze({unitId,title,french:paragraphs.join('\n\n'),questions:Object.freeze(questions.map(([prompt,answer,options,explanation])=>Object.freeze({prompt,answer,options:Object.freeze([...options]),explanation})))})));
