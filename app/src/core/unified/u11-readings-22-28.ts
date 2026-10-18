import type {B1Reading} from './u10-readings-01-07.ts';
type Q=readonly [string,string,readonly string[],string];
const RECORDS:readonly (readonly [string,string,readonly string[],readonly Q[]])[]=[
  [
    "b1-22",
    "Mode d’emploi : un envoi incertain",
    [
      "Un étudiant remplit un formulaire électronique pour participer à un atelier. Après avoir envoyé ses réponses, il voit apparaître un message d’erreur et un numéro provisoire. Le guide d’utilisation conseille de vérifier d’abord si un courriel de confirmation est arrivé. Il précise aussi que le simple affichage d’un numéro temporaire ne prouve pas qu’une inscription a été validée. L’étudiant ne trouve aucun message dans sa boîte de réception et hésite à remplir immédiatement le formulaire une seconde fois.",
      "Dans la section consacrée aux difficultés techniques, le guide recommande de noter l’heure de l’incident et de conserver le texte exact du message. Il explique que soumettre plusieurs dossiers identiques peut compliquer le suivi lorsque le premier envoi est en réalité encore en cours de traitement. Une nouvelle tentative est possible dans certaines circonstances, mais le document ne décrit pas de méthode universelle qui permettrait de vérifier tous les envois. L’étudiant décide donc de ne pas multiplier les actions au hasard.",
      "Il écrit au service d’aide en donnant son numéro provisoire et la description de l’erreur. Dans son message, il distingue ce qu’il a observé de ce qu’il ignore : le formulaire a affiché une erreur, mais la réception effective reste incertaine. Il demande si son dossier existe déjà et quelle étape il peut suivre sans créer de doublon. Le support lui répond que le dossier sera vérifié; cette réponse ne constitue toujours pas une confirmation d’inscription."
    ],
    [
      [
        "Does a temporary number prove approval?",
        "non, il ne confirme pas l’inscription",
        [
          "oui, sans exception",
          "non, il ne confirme pas l’inscription",
          "seulement le vendredi"
        ],
        "The guide explicitly distinguishes a temporary number from validated registration."
      ],
      [
        "Why is repeated submission potentially problematic?",
        "cela peut créer des doublons",
        [
          "cela peut créer des doublons",
          "cela supprime les courriels",
          "cela ferme le centre"
        ],
        "If an earlier request is still processing, additional attempts may create duplicates."
      ],
      [
        "What does the support reply confirm?",
        "une vérification sera effectuée",
        [
          "l’inscription est acceptée",
          "une vérification sera effectuée",
          "un remboursement est promis"
        ],
        "The reply promises to check the case but does not decide its status."
      ]
    ]
  ],
  [
    "b1-23",
    "Deux emplois du temps pour une équipe",
    [
      "Une équipe prépare une rencontre entre des bénévoles qui n’ont pas tous les mêmes horaires. Luc termine son travail à quinze heures et peut arriver au centre vers seize heures. Sarah dispose d’une soirée libre, mais son dernier bus part à dix-neuf heures. Amina, qui accompagne un proche le vendredi, préfère un rendez-vous samedi matin. Le groupe souhaite organiser une réunion complète plutôt que de demander à certains membres de partir avant les décisions importantes.",
      "Au début, un participant propose vendredi de dix-huit à vingt heures. Cette idée convient à quelques personnes, mais elle obligerait Sarah à partir trop tôt. Une deuxième proposition prévoit samedi à dix heures, sans que les disponibilités de tous aient été vérifiées. La responsable estime qu’aucune de ces options ne peut encore être annoncée comme définitive. Elle demande à chacun de préciser ses contraintes réelles au lieu de supposer que tout le monde est libre le week-end.",
      "Un message collectif présente donc les deux créneaux avec leurs avantages et leurs limites. Il explique que le groupe pourra retenir une option à condition que chaque personne indispensable puisse participer. Si aucun horaire ne convient, une courte réunion en ligne sera envisagée, mais son équipement reste à confirmer. La responsable fixe une date de réponse et s’engage à transmettre la décision seulement après avoir reçu les préférences nécessaires."
    ],
    [
      [
        "Why is Friday 18–20 unsuitable for Sarah?",
        "son dernier bus part avant la fin",
        [
          "son dernier bus part avant la fin",
          "elle travaille jusqu’à vingt heures",
          "elle est déjà en ligne"
        ],
        "Her bus departs at nineteen, one hour before the proposed meeting ends."
      ],
      [
        "Is Saturday formally adopted?",
        "non, les disponibilités restent à vérifier",
        [
          "oui, par tous",
          "non, les disponibilités restent à vérifier",
          "le centre est fermé"
        ],
        "The group has a suggestion, not verified availability or a final decision."
      ],
      [
        "What principle guides the final decision?",
        "permettre la participation des personnes nécessaires",
        [
          "choisir la première proposition",
          "permettre la participation des personnes nécessaires",
          "écarter les réponses"
        ],
        "The coordinator intends to secure participation rather than assume consensus."
      ]
    ]
  ],
  [
    "b1-24",
    "Carnet d’un voyage modifié",
    [
      "Jeudi soir, Nora prépare un court voyage à la montagne. Elle avait réservé un train pour le lendemain et pensait arriver assez tôt pour marcher avant le dîner. Les prévisions annonçaient un temps variable, mais elles ne signalaient aucun problème particulier sur la ligne. Nora prépare donc son sac et se couche tôt. Elle ne vérifie pourtant pas la dernière notification envoyée par la compagnie, car elle croit connaître déjà tous les détails de son billet.",
      "Vendredi matin, en arrivant à la gare, elle découvre que le train a été remplacé par un autocar. Le trajet est plus long et comprend un détour par une autre ville. Pendant l’attente, Nora rencontre un couple qui se rend au même endroit. Ils comparent les informations disponibles et remarquent que la nouvelle heure d’arrivée reste approximative. Personne ne leur garantit qu’ils pourront encore faire la promenade prévue. Au lieu de se presser, les voyageurs décident de prévenir leur hébergement.",
      "Finalement, Nora atteint le village en début de soirée. Elle est déçue d’avoir manqué sa promenade, mais elle garde un bon souvenir des conversations échangées pendant l’attente. Dans son carnet, elle distingue son projet initial, le changement annoncé par la compagnie et les décisions qu’elle a réellement prises. Elle ajoute que son expérience ne prouve pas que le transport est toujours peu fiable. La prochaine fois, elle consultera les mises à jour avant de quitter son domicile."
    ],
    [
      [
        "What earlier omission contributed to Nora's surprise?",
        "elle n’a pas lu la dernière notification",
        [
          "elle n’a pas acheté de billet",
          "elle n’a pas lu la dernière notification",
          "elle a oublié son sac"
        ],
        "She had made a booking but overlooked the latest transport notification."
      ],
      [
        "What was the new arrival estimate?",
        "approximatif",
        [
          "approximatif",
          "garanti à midi",
          "déjà confirmé à seize heures"
        ],
        "The travelers noticed that arrival time was not guaranteed."
      ],
      [
        "How does Nora avoid overgeneralizing?",
        "elle ne juge pas tous les transports à partir du voyage",
        [
          "elle ne juge pas tous les transports à partir du voyage",
          "elle annule tous ses futurs voyages",
          "elle ignore les retards"
        ],
        "Her reflection distinguishes one trip's disruption from a universal claim."
      ]
    ]
  ],
  [
    "b1-25",
    "Une enquête et ses limites",
    [
      "Un article présente les résultats de deux enquêtes sur les moyens de transport préférés par des visiteurs. Dans la première, vingt pour cent des personnes interrogées choisissent le train; dans la seconde, trente pour cent le préfèrent. L’auteur explique correctement que la part déclarée augmente de dix points de pourcentage. Pourtant, le tableau ne précise pas le nombre de répondants ni la méthode utilisée pour les sélectionner. La présentation graphique est claire, mais plusieurs informations méthodologiques essentielles manquent.",
      "Un lecteur conclut immédiatement que toute la population utilise davantage le train. Une autre personne affirme qu’une nouvelle ligne ferroviaire a forcément provoqué ce changement. L’article ne fournit pourtant aucune preuve permettant de soutenir ces deux affirmations. Les groupes interrogés pourraient être différents, et les questions posées pourraient ne pas avoir le même sens. Une différence visible dans un graphique ne suffit pas à établir une cause ni à garantir la représentativité des réponses.",
      "La rédactrice décide de réviser son résumé. Elle conserve les deux valeurs publiées et leur différence en points de pourcentage, mais précise qu’elles concernent uniquement les répondants des enquêtes décrites. Elle note que la portée du résultat reste limitée sans taille d’échantillon et sans protocole comparable. Elle suggère de consulter les questionnaires originaux avant d’interpréter les tendances comme une évolution générale. Son article demeure informatif précisément parce qu’il reconnaît ce qui n’est pas connu."
    ],
    [
      [
        "How large is the observed difference?",
        "dix points de pourcentage",
        [
          "dix points de pourcentage",
          "dix pour cent relatif",
          "trente points"
        ],
        "Thirty minus twenty equals ten percentage points, not ten percent relative increase."
      ],
      [
        "Which causal claim is unsupported?",
        "la nouvelle ligne explique forcément la hausse",
        [
          "la nouvelle ligne explique forcément la hausse",
          "les deux enquêtes ont des valeurs différentes",
          "les répondants ont donné des réponses"
        ],
        "The article provides no evidence identifying why the values changed."
      ],
      [
        "What should be checked before generalizing?",
        "les échantillons et les questionnaires",
        [
          "les échantillons et les questionnaires",
          "le nom du train",
          "la couleur du graphique"
        ],
        "Comparable survey populations and wording are necessary for stronger interpretation."
      ]
    ]
  ],
  [
    "b1-26",
    "Compte rendu : que s’est-il vraiment passé ?",
    [
      "Lors d’une réunion de quartier, cinq bénévoles discutent de l’organisation d’un atelier ouvert au public. Deux personnes proposent un événement dans une salle commune; une troisième préfère une formule mixte avec participation à distance. Aucun vote n’a lieu, car les participants souhaitent connaître les besoins techniques avant de se prononcer. La discussion se termine sans décision définitive sur le format. Toutefois, chacun s’accorde sur la nécessité de recueillir davantage d’informations avant le prochain rendez-vous.",
      "Le groupe confie à Camille la tâche de vérifier l’équipement de la salle avant jeudi. Karim accepte de contacter des bénévoles pour connaître leurs horaires, mais aucune date limite précise n’est fixée pour cette seconde tâche. Le sujet des invitations est abordé rapidement sans qu’une personne responsable soit désignée. Lorsqu’elle prépare le compte rendu, Léa doit donc distinguer les propositions discutées, les missions réellement attribuées et les questions restées ouvertes.",
      "Dans sa première version, Léa écrit que les invitations seront envoyées vendredi et que la rencontre aura lieu en format mixte. Elle relit ensuite ses notes et constate que ces deux affirmations dépassent ce qui a été décidé. Elle les corrige avant de diffuser le document provisoire. Son compte rendu indique désormais le travail confié à Camille, la démarche de Karim et la nécessité de décider du format et des invitations lors d’une prochaine réunion."
    ],
    [
      [
        "Which task has an explicit deadline?",
        "Camille vérifiera le matériel avant jeudi",
        [
          "Camille vérifiera le matériel avant jeudi",
          "Karim enverra les invitations vendredi",
          "Léa organisera la rencontre demain"
        ],
        "Camille's equipment check is specifically due before Thursday."
      ],
      [
        "Was the hybrid meeting format adopted?",
        "non, aucune décision n’a été prise",
        [
          "oui, à l’unanimité",
          "non, aucune décision n’a été prise",
          "oui, après un vote"
        ],
        "The meeting discussed possibilities but held no vote and made no format decision."
      ],
      [
        "Why does Léa revise the first minutes?",
        "elles présentaient des propositions comme des décisions",
        [
          "elles présentaient des propositions comme des décisions",
          "elles contenaient trop peu de noms",
          "elles étaient en anglais"
        ],
        "The early draft improperly turned open questions into fixed outcomes."
      ]
    ]
  ],
  [
    "b1-27",
    "Une lettre ouverte sur l’accès à la bibliothèque",
    [
      "Madame, Monsieur, notre quartier dispose d’une bibliothèque appréciée des habitants, mais elle ferme actuellement à dix-sept heures plusieurs jours par semaine. Certains travailleurs et étudiants indiquent qu’ils terminent leurs activités trop tard pour profiter de ce service. Plusieurs bénévoles aimeraient donc que les responsables examinent une ouverture prolongée un soir par semaine. Cette lettre ne prétend pas représenter l’ensemble des habitants : elle présente une difficulté précise et demande qu’elle soit étudiée avec attention.",
      "Nous reconnaissons que toute prolongation des horaires peut entraîner des frais supplémentaires. Il faudrait peut-être mobiliser du personnel et vérifier la disponibilité du bâtiment. Toutefois, ces contraintes ne signifient pas que toute modification est impossible. Une période d’essai limitée permettrait de recueillir des informations sur la fréquentation et les besoins réels. Il serait également utile de consulter les personnes qui utilisent rarement la bibliothèque, afin de comprendre les obstacles qu’elles rencontrent.",
      "Nous vous demandons donc d’envisager cette possibilité sans considérer notre proposition comme une décision déjà prise. Pourriez-vous préciser quels critères permettraient d’évaluer un essai, et à quel moment une consultation pourrait avoir lieu ? Nous sommes prêts à présenter des témoignages, tout en sachant qu’ils ne remplacent pas une enquête représentative. Nous vous remercions de l’attention portée à cette demande et restons disponibles pour discuter des solutions possibles. Cordialement, le collectif des bénévoles."
    ],
    [
      [
        "What change do the writers actually request?",
        "examiner une ouverture un soir par semaine",
        [
          "fermer la bibliothèque",
          "examiner une ouverture un soir par semaine",
          "remplacer tous les livres"
        ],
        "The letter asks leaders to consider an evening extension rather than impose it."
      ],
      [
        "Which concession strengthens their argument?",
        "une prolongation peut coûter davantage",
        [
          "une prolongation peut coûter davantage",
          "personne ne lit le soir",
          "les bénévoles contrôlent le budget"
        ],
        "They explicitly acknowledge staffing and building costs."
      ],
      [
        "What evidence would a limited trial provide?",
        "la fréquentation et les besoins réels",
        [
          "la fréquentation et les besoins réels",
          "l’approbation automatique",
          "la durée de vie des livres"
        ],
        "A trial could measure actual use before a permanent decision."
      ]
    ]
  ],
  [
    "b1-28",
    "Dossier final : plusieurs sources, une décision à préparer",
    [
      "Le secrétariat annonce une modification des horaires d’un centre de quartier. Un courriel officiel mentionne le vendredi à neuf heures, tandis qu’une affiche récente, dont l’auteur n’est pas indiqué, donne dix heures. Par ailleurs, un forum réunit des témoignages contradictoires : certains utilisateurs trouvent l’organisation facile, d’autres disent avoir attendu longtemps une réponse. Ces messages montrent des expériences réelles, mais ne permettent pas à eux seuls de déterminer le nouvel horaire ni les besoins de l’ensemble des participants.",
      "Lors d’une réunion, deux bénévoles proposent d’organiser un essai avec un accueil prolongé. Une autre personne souligne que le budget et le matériel n’ont pas encore été vérifiés. Le groupe ne vote pas; il décide seulement de demander une confirmation écrite au responsable et de consulter les personnes concernées. Dans le compte rendu, les propositions sont clairement séparées des tâches attribuées. Une bénévole doit recueillir les disponibilités avant jeudi, mais personne n’a été autorisé à annoncer la nouvelle organisation comme adoptée.",
      "Le rapport de synthèse final distingue alors trois catégories. Les faits vérifiables sont l’existence des messages divergents et la tâche réellement confiée à la bénévole. L’hypothèse d’une prolongation possible reste conditionnelle. Les inconnues concernent l’heure officielle, les ressources et les préférences des participants. L’auteur recommande de demander les documents les plus récents, de consulter le groupe et d’examiner un essai seulement si les conditions nécessaires sont réunies. Cette conclusion est nuancée, mais suffisamment précise pour guider l’étape suivante."
    ],
    [
      [
        "What is the principal conflict between the notices?",
        "neuf heures contre dix heures",
        [
          "neuf heures contre dix heures",
          "vendredi contre samedi",
          "salle A contre salle B"
        ],
        "Both concern Friday, but the email and unsigned poster give different start times."
      ],
      [
        "What was actually decided in the meeting?",
        "demander confirmation et consulter",
        [
          "adopter les nouveaux horaires",
          "demander confirmation et consulter",
          "acheter du matériel immédiatement"
        ],
        "The group chose information gathering and consultation, not a new schedule."
      ],
      [
        "Which recommendation is best supported by all sources?",
        "vérifier l’horaire et les moyens avant un essai",
        [
          "annoncer dix heures comme officiel",
          "vérifier l’horaire et les moyens avant un essai",
          "ignorer les participants"
        ],
        "Verification of schedule and resources is justified before any adoption or trial."
      ]
    ]
  ]
];
export const U11_READINGS_22_28:readonly B1Reading[]=Object.freeze(RECORDS.map(([unitId,title,paragraphs,questions])=>Object.freeze({unitId,title,french:paragraphs.join('\n\n'),questions:Object.freeze(questions.map(([prompt,answer,options,explanation])=>Object.freeze({prompt,answer,options:Object.freeze([...options]),explanation})))})));
