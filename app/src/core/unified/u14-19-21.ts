import {authorU14Scenario,type U14AuthoredScenario} from './u14-model.ts';
const SOURCE:readonly U14AuthoredScenario[]=[
  {
    "id": "transfer-19",
    "title": "Coordinate a remote team's handoff across schedules",
    "goal": "Resolve missing ownership, local clock assumptions and incomplete meeting notes in a project handoff.",
    "grammarKeys": [
      "relative",
      "condition"
    ],
    "vocabulary": [
      [
        "une équipe",
        "team",
        "Notre équipe est répartie."
      ],
      [
        "une réunion",
        "meeting",
        "La réunion commence à quinze heures."
      ],
      [
        "un fuseau horaire",
        "time zone",
        "Le fuseau horaire doit être indiqué."
      ],
      [
        "un compte rendu",
        "minutes",
        "Le compte rendu liste les décisions."
      ],
      [
        "une tâche",
        "task",
        "Chaque tâche doit avoir un responsable."
      ],
      [
        "une échéance",
        "deadline",
        "L’échéance reste ambiguë."
      ],
      [
        "un brouillon",
        "draft",
        "Le brouillon attend une relecture."
      ],
      [
        "valider",
        "approve",
        "Le responsable doit valider le fichier."
      ],
      [
        "un transfert",
        "handoff",
        "Le transfert demande du contexte."
      ],
      [
        "une priorité",
        "priority",
        "La priorité est expliquée."
      ],
      [
        "un retour",
        "feedback",
        "J’attends un retour précis."
      ],
      [
        "une version",
        "version",
        "La version finale n’est pas encore disponible."
      ]
    ],
    "dialogue": [
      [
        "Camille",
        "Dans le compte rendu, on lit « livrer vendredi à quinze heures », mais personne n’a précisé le fuseau horaire, ce qui complique notre travail à distance.",
        "The minutes say deliver Friday at three but omit the time zone."
      ],
      [
        "Arun",
        "La note indique aussi que le document doit être relu, mais elle ne dit pas qui accepte la responsabilité de la validation finale.",
        "It also requires review but names no final approver."
      ],
      [
        "Camille",
        "Je peux préparer le brouillon aujourd’hui; en revanche, je ne veux pas annoncer qu’il est validé simplement parce qu’il a été envoyé au groupe.",
        "I can prepare the draft, but sending it isn't approval."
      ],
      [
        "Arun",
        "Nous pourrions demander une heure avec son fuseau, un nom pour la validation et un retour précis sur les passages à modifier.",
        "We should request a time with zone, an approver and targeted feedback."
      ],
      [
        "Camille",
        "D’accord, je rédigerai un message clair qui distingue mon travail terminé des deux décisions que nous attendons encore.",
        "I'll distinguish completed drafting from the two pending decisions."
      ]
    ],
    "reading": {
      "title": "Un fichier envoyé n'est pas un fichier approuvé",
      "paragraphs": [
        "Une petite équipe prépare un guide destiné à des collègues travaillant dans plusieurs pays. Camille rédige la première version du document, tandis qu'Arun rassemble les commentaires. Dans le compte rendu de leur dernière réunion, un objectif apparaît : le guide devrait être livré vendredi à quinze heures. Le texte ne précise toutefois aucun fuseau horaire. Les membres de l'équipe savent donc le jour proposé, mais pas l'heure exacte à laquelle chacun doit agir.",
        "Une autre ambiguïté concerne la validation. Les notes indiquent que le brouillon doit être relu, mais personne n'a accepté officiellement la dernière vérification. Camille pense avoir terminé sa partie et envoie son fichier au groupe. Arun lui rappelle que cette transmission prouve seulement qu'un brouillon existe. Elle ne signifie pas que toutes les corrections ont été étudiées ni que le document peut être publié.",
        "Les deux collègues rédigent alors un message de clarification. Ils demandent au responsable de préciser l'heure et son fuseau ainsi que la personne chargée d'approuver la version définitive. En attendant, ils peuvent relire les passages déjà disponibles, sans annoncer que le guide est finalisé. Leurs questions évitent un malentendu fréquent : une date sans référence géographique et une tâche sans propriétaire ne constituent pas un plan de livraison fiable."
      ],
      "questions": [
        [
          "What is missing from the proposed deadline?",
          "le fuseau horaire",
          [
            "le fuseau horaire",
            "le nom de Camille",
            "le jour vendredi"
          ],
          "A clock time across countries is ambiguous without its time zone."
        ],
        [
          "Why is the guide not yet final?",
          "personne n’a accepté la validation",
          [
            "le texte est invisible",
            "personne n’a accepté la validation",
            "la réunion est annulée"
          ],
          "Sending a draft is not an approval and no final reviewer is assigned."
        ],
        [
          "What should the clarification request contain?",
          "heure complète et validateur",
          [
            "heure complète et validateur",
            "nouvelle police et logo",
            "adresse du restaurant"
          ],
          "A reliable handoff requires a time-zone-resolved deadline and owner."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Draft meeting minutes",
        "type": "minutes",
        "french": "Objectif : livrer le guide vendredi à 15 h. Le brouillon doit être relu avant diffusion. Aucun fuseau horaire ou validateur final n’est précisé dans ces notes."
      },
      {
        "label": "Camille's progress message",
        "type": "email",
        "french": "J’ai terminé la première version du guide et l’ai partagée avec l’équipe. Il reste à recueillir les corrections puis à confirmer qui validera le document."
      }
    ],
    "comparison": [
      [
        "What does the progress email actually confirm?",
        "un brouillon partagé",
        [
          "un brouillon partagé",
          "une publication approuvée",
          "un délai résolu"
        ],
        "Camille states the first version was sent, not signed off."
      ],
      [
        "Which question is unresolved by both texts?",
        "qui approuvera la version finale",
        [
          "qui approuvera la version finale",
          "le nom de la rédactrice",
          "l’existence du guide"
        ],
        "Neither source assigns approval authority."
      ]
    ],
    "listening": [
      [
        "What crucial detail does the deadline lack?",
        "le fuseau horaire",
        [
          "le fuseau horaire",
          "la langue française",
          "la date"
        ],
        "Camille notes no zone was specified for fifteen hours."
      ],
      [
        "What will Camille complete before the handoff?",
        "le brouillon",
        [
          "le brouillon",
          "la validation officielle",
          "une réunion"
        ],
        "Camille can prepare a draft without assuming approval."
      ],
      [
        "Which additional person is still needed?",
        "un responsable de validation",
        [
          "un responsable de validation",
          "un nouveau chauffeur",
          "un traducteur"
        ],
        "The team needs a named final approver."
      ]
    ],
    "recall": {
      "clozes": [
        [
          "C’est le fichier ___ je parle.",
          "dont",
          "Parler de selects the relative dont.",
          "relative"
        ],
        [
          "Si l’heure est précisée, nous ___ le délai. (respecter, future)",
          "respecterons",
          "Si plus present with future main clause supports a feasible plan.",
          "real condition"
        ]
      ],
      "order": [
        "Le brouillon reste à valider",
        [
          "reste à valider",
          "Le brouillon"
        ],
        "A sent file may still require authorization before publication.",
        "authority"
      ]
    },
    "writing": {
      "fromListening": [
        "Write a teammate handoff note from the conversation, distinguishing completed and pending steps.",
        [
          "Report Camille's draft as completed, not published.",
          "Identify the missing time zone and validation owner.",
          "Propose concrete next actions without assigning unaccepted tasks."
        ],
        "Camille a terminé la première version du guide et l’a partagée avec l’équipe. Arun rassemble les remarques mais la relecture finale n’est pas encore attribuée. Le compte rendu mentionne vendredi à quinze heures sans préciser le fuseau horaire. Nous devons demander au responsable une échéance complète et une personne clairement chargée de valider le document. Les collègues peuvent commenter le brouillon en attendant. Le fichier ne doit pas être présenté comme approuvé ou publié tant que cette étape n’est pas terminée."
      ],
      "fromSources": [
        "Draft a clarification email to a distributed project leader about deadline and approval.",
        [
          "Cite the meeting minutes and progress email separately.",
          "Ask for the exact zone and assigned approver.",
          "Acknowledge that submission and approval are different."
        ],
        "Bonjour, je vous contacte au sujet du guide en cours de préparation. Le compte rendu indique une livraison vendredi à quinze heures, mais ne précise pas le fuseau horaire. Camille a confirmé avoir partagé un premier brouillon; elle n’a pas annoncé que cette version était déjà approuvée. Pourriez-vous indiquer l’heure exacte avec le fuseau concerné et désigner la personne responsable de la validation finale ? Nous poursuivrons les corrections disponibles en attendant. Cette clarification nous permettra de respecter l’échéance sans confondre dépôt et autorisation de publication."
      ]
    },
    "oral": {
      "prompt": "Give a 90-second handoff briefing to a colleague joining the project.",
      "plan": [
        "State what was completed and where it was shared.",
        "Identify the deadline and approval ambiguities.",
        "Ask for a precise, verifiable next action."
      ],
      "model": "Notre équipe prépare un guide. Camille a terminé et transmis un premier brouillon, mais aucune version définitive n’a été approuvée. Les notes proposent vendredi à quinze heures, sans préciser le fuseau horaire. Il manque aussi une personne chargée de la validation finale. Nous allons demander ces deux renseignements au responsable, puis poursuivre la relecture. Le simple fait d’avoir envoyé le fichier ne signifie pas qu’il peut déjà être publié."
    }
  },
  {
    "id": "transfer-20",
    "title": "Museum visit: access needs and conflicting visitor information",
    "goal": "Ask respectful access questions and compare a brochure with updated visitor information.",
    "grammarKeys": [
      "polite",
      "concession"
    ],
    "vocabulary": [
      [
        "un musée",
        "museum",
        "Nous visiterons le musée."
      ],
      [
        "une entrée",
        "entrance",
        "L’entrée principale est indiquée."
      ],
      [
        "un accès",
        "access",
        "L’accès est en travaux."
      ],
      [
        "une rampe",
        "ramp",
        "La rampe doit être vérifiée."
      ],
      [
        "un ascenseur",
        "lift",
        "L’ascenseur est indisponible."
      ],
      [
        "un parcours",
        "route",
        "Le parcours peut changer."
      ],
      [
        "une réservation",
        "reservation",
        "La visite exige parfois une réservation."
      ],
      [
        "une exposition",
        "exhibition",
        "L’exposition commence vendredi."
      ],
      [
        "une brochure",
        "brochure",
        "La brochure donne un plan."
      ],
      [
        "une mise à jour",
        "update",
        "La mise à jour est datée."
      ],
      [
        "une confirmation",
        "confirmation",
        "Je demande une confirmation."
      ],
      [
        "une visite guidée",
        "guided visit",
        "La visite guidée peut être adaptée."
      ]
    ],
    "dialogue": [
      [
        "Nadia",
        "La brochure du musée montre un ascenseur pour accéder à la galerie, mais la page de visites indique qu’il est momentanément indisponible.",
        "The brochure shows a lift, but the visitor page reports it is temporarily unavailable."
      ],
      [
        "Guide",
        "C’est exact; la brochure décrit le parcours habituel, tandis que la page récente signale des travaux qui modifient certains accès.",
        "The brochure describes normal routes; the new page reflects changes during works."
      ],
      [
        "Nadia",
        "Je souhaiterais savoir quel itinéraire reste possible, car un membre de notre groupe préfère éviter les escaliers pendant la visite.",
        "I would like an accessible route because someone in our group prefers avoiding stairs."
      ],
      [
        "Guide",
        "Je peux demander au service d’accueil quelles zones sont actuellement accessibles, mais je ne veux pas garantir un trajet sans vérification.",
        "I can ask visitor services which areas are currently reachable, but cannot promise an unchecked route."
      ],
      [
        "Nadia",
        "Merci de vérifier les possibilités réelles; nous choisirons ensuite notre parcours et communiquerons uniquement les informations confirmées.",
        "Please verify actual options; we'll choose a route after confirmation."
      ]
    ],
    "reading": {
      "title": "Un plan habituel et des travaux temporaires",
      "paragraphs": [
        "Un groupe d'amis prévoit une visite dans un musée consacré à l'histoire locale. Nadia consulte une brochure illustrée qui présente plusieurs salles et un ascenseur reliant deux étages. Elle pense d'abord que le parcours sera simple pour tout le monde. En ouvrant ensuite la page de renseignements destinée aux visiteurs, elle découvre un avis récent annonçant la fermeture temporaire de l'ascenseur pour travaux. Le document présente donc une situation différente de celle dessinée dans la brochure.",
        "Le guide explique que le plan imprimé représente le parcours habituel du musée. Certaines salles restent ouvertes, mais leur accès doit être vérifié selon les travaux. Nadia demande si un autre itinéraire permet de visiter l'exposition sans utiliser les escaliers. Elle ne suppose pas que les besoins de tous les participants sont identiques et préfère demander les préférences du groupe. Le guide promet de consulter le service d'accueil avant de donner une réponse précise.",
        "Après la conversation, Nadia rédige un message aux visiteurs. Elle indique que l'ascenseur figurant dans la brochure est signalé comme indisponible dans l'avis récent. Elle demande à chacun de préciser, s'il le souhaite, ses préférences pratiques pour le déplacement dans le musée. Le parcours sera choisi lorsque les informations du service seront confirmées. L'objectif n'est pas de renoncer immédiatement à la visite, mais de préparer une expérience qui repose sur des renseignements fiables."
      ],
      "questions": [
        [
          "Which facility is reported unavailable?",
          "l’ascenseur",
          [
            "l’ascenseur",
            "la billetterie",
            "toutes les salles"
          ],
          "The updated page explicitly mentions temporary lift works."
        ],
        [
          "Why can the brochure and notice differ?",
          "la brochure présente le parcours habituel",
          [
            "la brochure présente le parcours habituel",
            "le musée a déménagé",
            "le guide ne connaît rien"
          ],
          "A standard diagram can be outdated for temporary access works."
        ],
        [
          "What does Nadia do before choosing a route?",
          "demander les préférences et vérifier l’accès",
          [
            "demander les préférences et vérifier l’accès",
            "affirmer que tous peuvent monter",
            "annuler sans discussion"
          ],
          "She requests both participant preferences and a verified alternative."
        ]
      ]
    },
    "evidence": [
      {
        "label": "General museum brochure",
        "type": "article",
        "french": "Parcours habituel : salles du rez-de-chaussée et galerie supérieure accessibles par un ascenseur signalé sur notre plan général. Cette brochure décrit l’aménagement normal."
      },
      {
        "label": "Updated visitor notice",
        "type": "notice",
        "french": "Travaux en cours : l’ascenseur vers la galerie supérieure est temporairement indisponible. Veuillez contacter l’accueil pour connaître les parcours actuellement possibles avant votre visite."
      }
    ],
    "comparison": [
      [
        "Which source is specifically about the temporary works?",
        "l’avis récent",
        [
          "la brochure",
          "l’avis récent",
          "aucun"
        ],
        "The dated visitor notice overrides assumptions based on standard brochure layout."
      ],
      [
        "Can visitors conclude that every gallery is inaccessible?",
        "non",
        [
          "oui",
          "non",
          "les deux textes le prouvent"
        ],
        "The notice names one lift, not a definitive closure of every space."
      ]
    ],
    "listening": [
      [
        "What does the brochure display?",
        "un ascenseur",
        [
          "un ascenseur",
          "un nouveau tramway",
          "une deuxième bibliothèque"
        ],
        "Nadia says the brochure shows a lift."
      ],
      [
        "What does the guide promise to check?",
        "les zones accessibles actuellement",
        [
          "les zones accessibles actuellement",
          "la météo",
          "le menu du café"
        ],
        "The guide will ask staff which routes are possible now."
      ],
      [
        "Does Nadia claim all participants share the same needs?",
        "non",
        [
          "oui",
          "non",
          "elle ne connaît personne"
        ],
        "Nadia asks about individual route preferences rather than assuming identical needs."
      ]
    ],
    "recall": {
      "clozes": [
        [
          "Je ___ connaître les parcours possibles. (souhaiter, conditional)",
          "souhaiterais",
          "The conditional souhaiterais expresses a courteous request.",
          "register"
        ],
        [
          "Bien que le plan ___ habituel, les accès changent. (être)",
          "soit",
          "Bien que requires subjunctive soit for concession.",
          "concession"
        ]
      ],
      "order": [
        "L’accès reste à vérifier",
        [
          "reste à vérifier",
          "L’accès"
        ],
        "The changed route must be checked rather than assumed from the brochure.",
        "source limits"
      ]
    },
    "writing": {
      "fromListening": [
        "Write a respectful group update summarizing the access conversation.",
        [
          "Mention the temporary lift restriction accurately.",
          "Avoid deciding other people's needs for them.",
          "Promise only verified route information."
        ],
        "Le musée présente habituellement un ascenseur permettant d’accéder à la galerie supérieure. Cependant, le guide a confirmé qu’un avis récent signale des travaux et l’indisponibilité temporaire de cet équipement. Il doit encore vérifier les autres parcours avec l’accueil. Avant de choisir notre visite, nous demanderons aux participants quelles options leur conviendraient. Nous ne pouvons pas affirmer que toutes les salles sont fermées ou que tous peuvent utiliser les escaliers. Une information précise suivra après la réponse du musée."
      ],
      "fromSources": [
        "Draft a visitor inquiry comparing the brochure and updated accessibility notice.",
        [
          "Attribute the normal plan and new works notice.",
          "Ask for practical routes without assuming universal needs.",
          "Request a checked response before confirming the group's itinerary."
        ],
        "Bonjour, notre groupe prépare une visite au musée. La brochure générale montre un ascenseur vers la galerie supérieure, mais l’avis récent indique que cet équipement est temporairement indisponible. Pourriez-vous nous préciser quelles salles restent accessibles et s’il existe un autre parcours permettant d’éviter les escaliers ? Nous souhaitons proposer plusieurs options aux participants selon leurs préférences. Nous attendrons vos informations vérifiées avant de confirmer l’itinéraire. Merci pour votre aide."
      ]
    },
    "oral": {
      "prompt": "Explain the changed museum access situation to a mixed group of visitors.",
      "plan": [
        "Distinguish the standard brochure from temporary works.",
        "Ask about preferences without assumptions.",
        "Explain which practical details still require staff confirmation."
      ],
      "model": "La brochure du musée montre un ascenseur permettant normalement d’accéder à la galerie supérieure. Un avis récent indique toutefois que cet ascenseur est indisponible pendant des travaux. Cela ne prouve pas que toutes les salles soient fermées, mais nous devons vérifier les autres itinéraires. Nous allons consulter l’accueil et demander aux visiteurs quelles options leur conviennent. Le parcours final sera communiqué après confirmation."
    }
  },
  {
    "id": "transfer-21",
    "title": "Community garden: water rota, weather and shared responsibility",
    "goal": "Negotiate practical volunteering shifts using conditional plans, fairness and two schedule sources.",
    "grammarKeys": [
      "condition",
      "purpose"
    ],
    "vocabulary": [
      [
        "un jardin partagé",
        "community garden",
        "Le jardin partagé est ouvert."
      ],
      [
        "arroser",
        "water",
        "Nous allons arroser les plantes."
      ],
      [
        "un créneau",
        "shift",
        "Un créneau se libère."
      ],
      [
        "une disponibilité",
        "availability",
        "Je donne ma disponibilité."
      ],
      [
        "la météo",
        "weather",
        "La météo peut changer."
      ],
      [
        "une réserve d’eau",
        "water supply",
        "La réserve d’eau est limitée."
      ],
      [
        "un responsable",
        "coordinator",
        "Le responsable confirme les créneaux."
      ],
      [
        "une inscription",
        "signup",
        "Mon inscription est enregistrée."
      ],
      [
        "un planning",
        "roster",
        "Le planning est provisoire."
      ],
      [
        "un tuyau",
        "hose",
        "Le tuyau reste au jardin."
      ],
      [
        "un remplacement",
        "replacement",
        "Je cherche un remplacement."
      ],
      [
        "un message",
        "message",
        "Je vérifie le message récent."
      ]
    ],
    "dialogue": [
      [
        "Sophie",
        "Le planning du jardin me donne le créneau de samedi matin, mais je dois travailler ce jour-là et je ne pourrai pas arroser les plantes.",
        "The garden rota assigns me Saturday morning, but I have to work."
      ],
      [
        "Amir",
        "Un message récent demande des volontaires pour dimanche, pourtant personne n’a encore accepté de remplacer ton créneau de samedi.",
        "A new message asks for Sunday volunteers, but nobody has accepted Saturday replacement."
      ],
      [
        "Sophie",
        "Je pourrais venir dimanche après-midi si le responsable confirme ce créneau et si les besoins du jardin sont toujours les mêmes.",
        "I could attend Sunday afternoon if the coordinator confirms it and the needs remain the same."
      ],
      [
        "Amir",
        "Nous devrions vérifier la réserve d’eau et les consignes plutôt que d’arroser automatiquement sans tenir compte des conditions.",
        "We should check the water supply and instructions instead of watering automatically."
      ],
      [
        "Sophie",
        "Je vais demander un échange de créneau par écrit et attendre l’accord du groupe avant de considérer samedi comme couvert.",
        "I'll request a shift swap in writing and wait for agreement before considering Saturday covered."
      ]
    ],
    "reading": {
      "title": "Un créneau annoncé n'est pas un remplacement accepté",
      "paragraphs": [
        "Dans un jardin partagé, les bénévoles s'organisent pour arroser les plantes et entretenir les chemins. Sophie avait choisi le samedi matin, mais une nouvelle obligation professionnelle l'empêche d'être présente. Elle consulte le planning commun et constate que son nom figure encore sur ce créneau. Une discussion récente propose de trouver davantage de personnes pour le dimanche. Elle pense d'abord que sa tâche pourrait être déplacée automatiquement.",
        "Amir lui rappelle que les besoins de samedi n'ont pas disparu pour autant. Le message du dimanche demande des volontaires supplémentaires et ne nomme personne pour remplacer Sophie. Il faut donc distinguer une nouvelle possibilité de participation et un changement réellement accepté dans le planning. Les deux amis discutent aussi de la réserve d'eau, dont la quantité sera vérifiée avant de prévoir le travail de la semaine.",
        "Sophie écrit au coordinateur pour signaler son indisponibilité et proposer le dimanche après-midi. Elle demande si un autre bénévole pourrait prendre le samedi et quelle quantité d'eau devrait être utilisée selon les consignes du jardin. Elle garde sa responsabilité initiale ouverte jusqu'à la réponse du groupe, sans annoncer que le créneau est couvert. Sa communication permet une répartition plus juste des tâches et évite de laisser une action importante sans propriétaire."
      ],
      "questions": [
        [
          "What prevents Sophie from attending Saturday?",
          "une obligation professionnelle",
          [
            "une obligation professionnelle",
            "une maladie annoncée",
            "la fermeture du jardin"
          ],
          "She reports a work commitment rather than a change in garden opening."
        ],
        [
          "Is Saturday automatically covered by the Sunday invitation?",
          "non",
          [
            "oui",
            "non",
            "le jardin est fermé"
          ],
          "The new volunteer request does not reassign the Saturday task."
        ],
        [
          "Why check the water supply?",
          "pour organiser le travail selon les ressources",
          [
            "pour organiser le travail selon les ressources",
            "pour vendre de l’eau",
            "pour supprimer toutes les tâches"
          ],
          "The garden must plan watering based on actual available resources and instructions."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Published volunteer rota",
        "type": "data",
        "french": "Planning du jardin : samedi matin, arrosage confié à Sophie. La responsabilité reste active jusqu’à confirmation d’un échange par le coordinateur."
      },
      {
        "label": "Weekend volunteer request",
        "type": "chat",
        "french": "Appel à volontaires : besoin éventuel dimanche après-midi pour l’entretien du jardin. Ce message ne désigne aucun remplaçant pour les tâches déjà prévues samedi."
      }
    ],
    "comparison": [
      [
        "Which source assigns the Saturday shift?",
        "le planning",
        [
          "le planning",
          "l’appel dimanche",
          "aucun"
        ],
        "The rota assigns Sophie and has not been officially changed."
      ],
      [
        "What remains unresolved after both sources?",
        "le remplacement du samedi",
        [
          "le remplacement du samedi",
          "le nom de Sophie",
          "l’existence du jardin"
        ],
        "No message identifies someone who has accepted Saturday duties."
      ]
    ],
    "listening": [
      [
        "Why can Sophie not attend her assigned shift?",
        "elle travaille samedi",
        [
          "elle travaille samedi",
          "elle part en train",
          "elle a oublié les clés"
        ],
        "Sophie reports a Saturday work obligation."
      ],
      [
        "When could Sophie offer to attend?",
        "dimanche après-midi",
        [
          "dimanche après-midi",
          "vendredi matin",
          "mardi soir"
        ],
        "She proposes Sunday afternoon if confirmed."
      ],
      [
        "What must be established for Saturday?",
        "un remplacement accepté",
        [
          "un remplacement accepté",
          "un nouveau jardin",
          "une réduction"
        ],
        "The shift remains uncovered until someone accepts it and the coordinator confirms."
      ]
    ],
    "recall": {
      "clozes": [
        [
          "Si le responsable confirme, je ___ dimanche. (venir, future)",
          "viendrai",
          "A real conditional with si plus present uses future viendrai.",
          "conditional"
        ],
        [
          "J’écris pour que le groupe ___ organiser les créneaux. (pouvoir)",
          "puisse",
          "Pour que introduces subjunctive puisse with another subject.",
          "purpose"
        ]
      ],
      "order": [
        "Le remplacement reste à organiser",
        [
          "reste à organiser",
          "Le remplacement"
        ],
        "A request for Sunday volunteers does not cover Saturday automatically.",
        "ownership"
      ]
    },
    "writing": {
      "fromListening": [
        "Write a handoff summary for the garden coordinator based on the dialogue.",
        [
          "State Sophie's actual shift and constraint.",
          "Separate the Sunday offer from a confirmed Saturday replacement.",
          "Request a responsible owner and water-resource check."
        ],
        "Sophie figure toujours sur le planning de samedi matin, mais elle doit travailler et ne pourra pas arroser les plantes. Amir a expliqué qu’un appel à volontaires existe pour dimanche, sans personne désignée pour remplacer le samedi. Sophie propose donc dimanche après-midi, à condition que le coordinateur accepte ce changement. Le groupe devra encore trouver et confirmer une personne pour le créneau initial. Il serait utile de vérifier la réserve d’eau et les consignes avant de répartir les tâches. Pour l’instant, samedi reste à organiser."
      ],
      "fromSources": [
        "Write a clear volunteer rota-change request referring to both documents.",
        [
          "Identify the active Saturday responsibility.",
          "Offer a realistic conditional alternative.",
          "Do not claim Sunday volunteering automatically cancels Saturday."
        ],
        "Bonjour, je vous contacte au sujet de mon créneau d’arrosage prévu samedi matin dans le planning du jardin. Une obligation professionnelle m’empêche finalement de venir à cette heure. J’ai vu le message qui propose des activités supplémentaires dimanche après-midi et je pourrais participer à ce moment-là. Toutefois, je comprends qu’aucun remplacement n’a encore été confirmé pour samedi. Pourriez-vous me dire si un échange est possible et si quelqu’un accepte mon créneau initial ? Je garderai cette tâche comme ouverte jusqu’à votre réponse."
      ]
    },
    "oral": {
      "prompt": "Explain to the volunteers why a schedule change requires explicit handoff.",
      "plan": [
        "Name the assigned Saturday shift and the problem.",
        "Describe the offered Sunday contribution.",
        "Request explicit replacement acceptance before closing the Saturday task."
      ],
      "model": "Sophie était chargée de l’arrosage samedi matin, mais elle doit désormais travailler à ce moment-là. Un message demande des volontaires pour dimanche, et Sophie pourrait proposer son aide dimanche après-midi. Cependant, cette nouvelle possibilité ne remplace pas automatiquement la tâche de samedi. Il faut demander à une autre personne d’accepter ce créneau et obtenir l’accord du coordinateur. Nous vérifierons aussi les besoins du jardin avant de répartir le travail."
    }
  }
];
export const U14_19_21=Object.freeze(SOURCE.map((record,i)=>authorU14Scenario(record,19+i)));
