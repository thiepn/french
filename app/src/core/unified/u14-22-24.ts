import {authorU14Scenario,type U14AuthoredScenario} from './u14-model.ts';
const SOURCE:readonly U14AuthoredScenario[]=[
  {
    "id": "transfer-22",
    "title": "Understand a household energy bill and meter reading",
    "goal": "Explain billed consumption and estimated readings without inventing a refund or tariff condition.",
    "grammarKeys": [
      "compare",
      "source"
    ],
    "vocabulary": [
      [
        "une facture",
        "bill",
        "La facture arrive lundi."
      ],
      [
        "un compteur",
        "meter",
        "Je lis le compteur."
      ],
      [
        "une consommation",
        "usage",
        "La consommation varie."
      ],
      [
        "un relevé",
        "reading",
        "Le relevé est estimé."
      ],
      [
        "un tarif",
        "rate",
        "Le tarif est indiqué sur le contrat."
      ],
      [
        "un montant",
        "amount",
        "Le montant est provisoire."
      ],
      [
        "une estimation",
        "estimate",
        "L’estimation reste à confirmer."
      ],
      [
        "une période",
        "period",
        "La période dure un mois."
      ],
      [
        "un contrat",
        "contract",
        "Je relis le contrat."
      ],
      [
        "un prélèvement",
        "direct debit",
        "Le prélèvement est indiqué."
      ],
      [
        "une correction",
        "adjustment",
        "Je demande une correction si nécessaire."
      ],
      [
        "un justificatif",
        "evidence",
        "Je garde la photo du compteur."
      ]
    ],
    "dialogue": [
      [
        "Mila",
        "Ma facture d’électricité est plus élevée que celle du mois dernier, mais elle semble utiliser une estimation plutôt qu’un relevé récent du compteur.",
        "My electricity bill is higher but seems to use estimated rather than recent meter data."
      ],
      [
        "Hugo",
        "Comparons d’abord les périodes et les quantités facturées; un montant différent peut venir de plusieurs facteurs et ne prouve pas une erreur.",
        "Let's compare billing periods and quantities; a higher total doesn't prove an error."
      ],
      [
        "Mila",
        "J’ai noté l’index affiché aujourd’hui, mais je ne sais pas comment le fournisseur prendra en compte cette information.",
        "I noted today's meter reading but don't know how the provider will use it."
      ],
      [
        "Hugo",
        "Tu pourrais demander si la facture est basée sur une estimation, comment transmettre un relevé et quand une éventuelle correction serait étudiée.",
        "You could ask whether it is estimated, how to submit a reading and when adjustments are considered."
      ],
      [
        "Mila",
        "Je vais donc envoyer une demande précise avec les dates utiles, sans annoncer un remboursement avant une vérification du dossier.",
        "I'll ask with dates and avoid assuming a refund before review."
      ]
    ],
    "reading": {
      "title": "Un montant plus haut ne prouve pas automatiquement une erreur",
      "paragraphs": [
        "Mila reçoit une facture d'électricité qu'elle trouve plus élevée que d'habitude. Elle compare rapidement le montant avec celui du mois précédent, puis remarque que les deux périodes ne couvrent pas exactement le même nombre de jours. Une mention sur la nouvelle facture indique que la consommation a été estimée. Mila se souvient avoir relevé son compteur récemment, mais ce chiffre ne figure pas dans le document reçu.",
        "Hugo lui conseille de séparer plusieurs questions. La quantité d'énergie indiquée sur la facture, la période couverte et le tarif appliqué sont des éléments différents. Pour comprendre la hausse, il faudrait vérifier chacun d'eux. Le relevé que Mila a photographié pourrait aider le fournisseur à examiner la situation, mais il ne prouve pas à lui seul le montant qui devrait être facturé. Les conditions du contrat restent également pertinentes.",
        "Mila prépare un message comportant les dates des deux factures et le relevé actuel de son compteur. Elle demande quelle estimation a été utilisée et comment une correction éventuelle pourrait être étudiée. Elle ne réclame pas comme acquis un remboursement dont les conditions ne sont pas établies. Cette méthode transforme une inquiétude générale en une demande documentée que le service pourra examiner."
      ],
      "questions": [
        [
          "Which detail shows the new bill may not use a recent measurement?",
          "une consommation estimée",
          [
            "une consommation estimée",
            "un tarif gratuit",
            "une remise confirmée"
          ],
          "The invoice explicitly indicates estimated consumption."
        ],
        [
          "Why is the month-to-month amount comparison incomplete?",
          "les périodes et quantités diffèrent",
          [
            "les périodes et quantités diffèrent",
            "les deux factures sont identiques",
            "le compteur n’existe pas"
          ],
          "Different billing periods and consumption can influence totals."
        ],
        [
          "What outcome can Mila already claim?",
          "aucune correction approuvée",
          [
            "un remboursement garanti",
            "aucune correction approuvée",
            "une facture annulée"
          ],
          "She needs the provider to examine evidence before any adjustment is confirmed."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Current energy invoice extract",
        "type": "data",
        "french": "Période facturée : 35 jours. Consommation estimée : 210 kWh. Le montant repose sur les données disponibles au moment de l’édition et peut faire l’objet d’une vérification."
      },
      {
        "label": "Customer meter-reading note",
        "type": "email",
        "french": "J’ai photographié l’index du compteur aujourd’hui et souhaite savoir comment transmettre le relevé pour vérifier la facture. Je ne connais pas encore la méthode de correction applicable."
      }
    ],
    "comparison": [
      [
        "Which source indicates the energy figure is estimated?",
        "la facture",
        [
          "la facture",
          "la note du client",
          "aucun"
        ],
        "The invoice identifies its 210 kWh as estimated consumption."
      ],
      [
        "Does the meter note establish a guaranteed correction?",
        "non",
        [
          "oui",
          "non",
          "elle annule le contrat"
        ],
        "The note asks about verification; it does not establish a right or approved adjustment."
      ]
    ],
    "listening": [
      [
        "What worries Mila about the bill?",
        "elle est plus élevée et estimée",
        [
          "elle est plus élevée et estimée",
          "elle n’est pas arrivée",
          "elle est déjà remboursée"
        ],
        "Mila contrasts a high amount with estimated consumption."
      ],
      [
        "Which physical value has Mila recorded?",
        "l’index du compteur",
        [
          "l’index du compteur",
          "la température de la pièce",
          "la vitesse du vélo"
        ],
        "She noted the number shown by her meter."
      ],
      [
        "What does Hugo suggest besides sending a value?",
        "demander la méthode de correction",
        [
          "demander la méthode de correction",
          "payer deux fois",
          "ignorer les dates"
        ],
        "Hugo suggests asking about estimated billing and the process for adjustments."
      ]
    ],
    "recall": {
      "clozes": [
        [
          "La nouvelle facture est plus élevée ___ l’ancienne.",
          "que",
          "Plus ... que compares two billed amounts, not necessarily equal periods.",
          "comparison"
        ],
        [
          "Selon la facture, la consommation ___ estimée. (être, present)",
          "est",
          "Est is the present form reporting what the document explicitly states.",
          "attribution"
        ]
      ],
      "order": [
        "Le montant reste à vérifier",
        [
          "reste à vérifier",
          "Le montant"
        ],
        "An estimated bill may require examination before the correct outcome is known.",
        "source limit"
      ]
    },
    "writing": {
      "fromListening": [
        "Summarize the conversation about the electricity bill as a neutral observer.",
        [
          "Mention the estimate and differing periods.",
          "Explain why a meter photo alone does not approve a correction.",
          "Report the precise question Mila intends to ask."
        ],
        "Mila a reçu une facture d’électricité plus élevée que la précédente. Le document semble se fonder sur une estimation et les périodes comparées ne sont pas identiques. Mila dispose d’un relevé récent de son compteur, mais elle ne sait pas comment le fournisseur l’utilisera. Hugo lui conseille de vérifier les dates, la consommation et le tarif avant de conclure à une erreur. Mila demandera au service quelle estimation a été retenue et comment une correction pourrait être examinée. Aucun remboursement n’est encore confirmé."
      ],
      "fromSources": [
        "Write a precise billing clarification request grounded in the two source extracts.",
        [
          "Cite the 35-day estimated period accurately.",
          "Refer to the photo as available evidence, not proof of a refund.",
          "Ask the provider for a verification process."
        ],
        "Bonjour, je souhaite obtenir une précision sur ma dernière facture. Le document mentionne une période de trente-cinq jours et une consommation estimée de deux cent dix kilowattheures. J’ai pris une photo de l’index du compteur aujourd’hui et voudrais savoir comment transmettre cette information. Pourriez-vous également m’indiquer comment l’estimation a été calculée et selon quelle procédure une correction éventuelle pourrait être étudiée ? Je comprends que ma demande doit être vérifiée avant toute décision sur le montant. Merci pour votre réponse."
      ]
    },
    "oral": {
      "prompt": "Explain why an estimated bill should be reviewed carefully without promising a financial result.",
      "plan": [
        "Name the different periods and estimated consumption.",
        "Describe the value of the meter photograph.",
        "State a proportionate verification request."
      ],
      "model": "La facture de Mila est plus élevée, mais elle couvre une période différente et utilise une consommation estimée. Mila possède une photo de son compteur, qui pourrait aider à vérifier le calcul. Elle devrait comparer les dates et demander comment le fournisseur a établi la quantité et le tarif. Il serait incorrect d’affirmer immédiatement que la facture est fausse ou qu’un remboursement est garanti. La correction éventuelle dépend de l’examen du dossier."
    }
  },
  {
    "id": "transfer-23",
    "title": "Report a leaking window and coordinate a maintenance visit",
    "goal": "Distinguish an observed housing fault, access proposal and approved repair in practical correspondence.",
    "grammarKeys": [
      "past",
      "polite"
    ],
    "vocabulary": [
      [
        "une fenêtre",
        "window",
        "La fenêtre laisse passer l’eau."
      ],
      [
        "une fuite",
        "leak",
        "Une fuite apparaît après la pluie."
      ],
      [
        "un logement",
        "home",
        "Le logement est occupé."
      ],
      [
        "un propriétaire",
        "landlord",
        "Le propriétaire reçoit le message."
      ],
      [
        "un locataire",
        "tenant",
        "Le locataire décrit le défaut."
      ],
      [
        "un technicien",
        "technician",
        "Le technicien doit vérifier."
      ],
      [
        "une visite",
        "visit",
        "Une visite est proposée."
      ],
      [
        "un créneau",
        "time slot",
        "Le créneau n’est pas confirmé."
      ],
      [
        "une réparation",
        "repair",
        "La réparation exige un diagnostic."
      ],
      [
        "un constat",
        "observation",
        "Le constat décrit l’eau."
      ],
      [
        "une photo",
        "photo",
        "La photo documente la fuite."
      ],
      [
        "une confirmation",
        "confirmation",
        "J’attends la confirmation écrite."
      ]
    ],
    "dialogue": [
      [
        "Inès",
        "Hier soir, de l’eau est entrée près de la fenêtre pendant qu’il pleuvait, et j’ai pris une photo pour montrer exactement ce que j’ai observé.",
        "Water entered by the window during rain; I photographed the observed problem."
      ],
      [
        "Gestionnaire",
        "Merci pour cette description; nous pouvons proposer une visite du technicien jeudi, mais nous devons encore vérifier son horaire et l’accès au logement.",
        "We can propose a technician Thursday but must check schedule and access."
      ],
      [
        "Inès",
        "Je suis disponible jeudi après-midi, cependant je voudrais savoir si la visite vise seulement un diagnostic ou une réparation déjà autorisée.",
        "I'm available Thursday afternoon but want to know whether it is inspection or an approved repair."
      ],
      [
        "Gestionnaire",
        "Pour le moment, seule une vérification du problème est envisagée; le technicien expliquera les travaux éventuels après son constat.",
        "Only inspection is envisaged; the technician will explain possible work afterward."
      ],
      [
        "Inès",
        "Je vais donc conserver les photos et attendre une confirmation de visite, sans annoncer que la fuite sera définitivement réparée jeudi.",
        "I'll preserve photos and await a confirmed visit, without saying the leak will be repaired Thursday."
      ]
    ],
    "reading": {
      "title": "Un créneau de visite ne décrit pas encore les travaux",
      "paragraphs": [
        "Inès habite dans un appartement dont une fenêtre laisse passer de l'eau lorsqu'il pleut fortement. Un soir, elle remarque une petite flaque près du mur et prend des photographies. Elle écrit ensuite au gestionnaire du logement pour décrire la situation : l'heure approximative, le lieu et les effets visibles. Elle ne prétend pas connaître la cause technique exacte, car elle n'a pas examiné l'intérieur de la fenêtre.",
        "Le gestionnaire répond en proposant le passage d'un technicien jeudi. Cependant, le message indique qu'il doit encore vérifier les disponibilités. Inès demande si la visite permettra de réparer immédiatement la fenêtre ou seulement de constater le problème. Le gestionnaire explique que le premier objectif est d'identifier le défaut. Selon le résultat du diagnostic, d'autres travaux pourraient devoir être planifiés.",
        "Inès conserve les photos et prépare un accès au logement pour le créneau qui sera finalement confirmé. Elle garde la distinction entre trois étapes : le dommage observé, la visite proposée et la réparation éventuelle. Un diagnostic à venir ne signifie pas qu'un résultat est déjà garanti. En écrivant ces étapes clairement, elle permet au gestionnaire et au technicien de comprendre ce qui est établi et ce qui reste à déterminer."
      ],
      "questions": [
        [
          "What did Inès directly observe?",
          "de l’eau près de la fenêtre",
          [
            "de l’eau près de la fenêtre",
            "une cause interne prouvée",
            "une réparation terminée"
          ],
          "Her photos document water appearing, not the precise technical cause."
        ],
        [
          "What is the first purpose of the technician's visit?",
          "identifier le problème",
          [
            "identifier le problème",
            "garantir de nouveaux vitrages",
            "changer de locataire"
          ],
          "The manager says the first visit is diagnostic."
        ],
        [
          "What must still happen before the proposed Thursday visit?",
          "confirmer le créneau",
          [
            "confirmer le créneau",
            "signer un nouveau bail",
            "annuler les photos"
          ],
          "The technician's availability and access have not been definitively confirmed."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Tenant's observation report",
        "type": "email",
        "french": "Hier vers 20 h, j’ai constaté de l’eau à côté de la fenêtre du salon pendant la pluie. Des photographies montrent le problème visible; je ne connais pas sa cause exacte."
      },
      {
        "label": "Building manager's reply",
        "type": "email",
        "french": "Une visite technique jeudi pourrait être organisée sous réserve de disponibilité. Le premier passage viserait à constater le défaut; les réparations nécessaires seront déterminées ensuite."
      }
    ],
    "comparison": [
      [
        "Which source directly describes the observed water?",
        "le signalement de la locataire",
        [
          "le signalement de la locataire",
          "la réponse du gestionnaire",
          "aucun"
        ],
        "Inès's report documents the visible condition; the reply offers a future inspection."
      ],
      [
        "Which claim is not supported by either document?",
        "la réparation complète jeudi",
        [
          "une visite possible jeudi",
          "la réparation complète jeudi",
          "des photos du problème"
        ],
        "No source promises a completed repair Thursday."
      ]
    ],
    "listening": [
      [
        "When was water noticed?",
        "hier soir pendant la pluie",
        [
          "hier soir pendant la pluie",
          "la semaine prochaine",
          "pendant un repas"
        ],
        "Inès specifies the previous evening during rainfall."
      ],
      [
        "Which first activity does the technician plan?",
        "un diagnostic",
        [
          "un diagnostic",
          "une livraison de meubles",
          "une visite touristique"
        ],
        "The manager says the initial visit checks the defect."
      ],
      [
        "Is Thursday already a guaranteed repair date?",
        "non",
        [
          "oui",
          "non",
          "un contrat a été signé"
        ],
        "The time is provisional and the repair scope remains undetermined."
      ]
    ],
    "recall": {
      "clozes": [
        [
          "Nous ___ quand l’eau est entrée. (dormir, imperfect nous)",
          "dormions",
          "Imparfait expresses an ongoing background action during a later event.",
          "narrative background"
        ],
        [
          "Pourriez-vous ___ le créneau de visite ?",
          "confirmer",
          "The polite modal requires the infinitive confirmer.",
          "polite request"
        ]
      ],
      "order": [
        "La réparation reste à déterminer",
        [
          "reste à déterminer",
          "La réparation"
        ],
        "Diagnosis will inform actual repair scope later.",
        "process"
      ]
    },
    "writing": {
      "fromListening": [
        "Write a neutral incident summary for the technician arriving at the apartment.",
        [
          "State the observed leak and approximate timing.",
          "Distinguish photos from proof of technical cause.",
          "Mention only inspection, not guaranteed repair."
        ],
        "Hier soir, pendant une forte pluie, Inès a remarqué de l’eau près de la fenêtre du salon. Elle a pris plusieurs photos montrant l’endroit concerné, mais elle ne connaît pas encore la cause du problème. Le gestionnaire a proposé une visite technique jeudi, sous réserve de confirmation. Cette première visite servira à constater le défaut et à déterminer la suite. Aucun remplacement de fenêtre n’a été approuvé pour l’instant. Le technicien pourra consulter les photos et examiner la situation sur place."
      ],
      "fromSources": [
        "Compose a precise reply asking whether the technician's slot is confirmed and what it covers.",
        [
          "Identify the photographed observed problem.",
          "Ask about timing and access.",
          "Avoid reporting an approved repair before diagnosis."
        ],
        "Bonjour, merci pour votre réponse au sujet de l’eau constatée près de la fenêtre du salon. J’ai conservé les photographies prises hier pendant la pluie. Vous avez proposé une visite technique jeudi, mais j’ai compris que ce créneau restait soumis à une vérification. Pourriez-vous m’en confirmer l’heure et préciser comment organiser l’accès au logement ? Je comprends que ce premier passage servira à constater le défaut et que les réparations éventuelles seront décidées ensuite. Je vous remercie de votre confirmation écrite."
      ]
    },
    "oral": {
      "prompt": "Explain the three distinct stages of the window-maintenance case.",
      "plan": [
        "Describe the photographed observation.",
        "Identify the proposed but unconfirmed visit.",
        "Distinguish diagnosis from actual authorization and completion."
      ],
      "model": "Inès a observé de l’eau près de sa fenêtre pendant la pluie et l’a photographiée. Elle a signalé le problème au gestionnaire, qui propose de faire venir un technicien jeudi. Le créneau reste à confirmer. La première visite servira à identifier la cause et à déterminer les travaux nécessaires. Il serait donc inexact d’annoncer que la fuite sera forcément réparée jeudi. Inès attend une confirmation et conservera les informations utiles."
    }
  },
  {
    "id": "transfer-24",
    "title": "Organize a river cleanup safely from event instructions",
    "goal": "Interpret a cleanup invitation and weather-dependent event update while recognizing volunteer safety limits.",
    "grammarKeys": [
      "purpose",
      "condition"
    ],
    "vocabulary": [
      [
        "une collecte",
        "collection",
        "La collecte est prévue dimanche."
      ],
      [
        "une rivière",
        "river",
        "La rivière traverse le quartier."
      ],
      [
        "un bénévole",
        "volunteer",
        "Le bénévole doit s’inscrire."
      ],
      [
        "un point de rendez-vous",
        "meeting point",
        "Le point de rendez-vous est devant le parc."
      ],
      [
        "un gant",
        "glove",
        "Les gants sont fournis."
      ],
      [
        "un sac",
        "bag",
        "Les sacs sont distribués."
      ],
      [
        "un objet dangereux",
        "hazardous object",
        "Un objet dangereux ne doit pas être touché."
      ],
      [
        "un organisateur",
        "organizer",
        "L’organisateur définit les zones."
      ],
      [
        "une zone autorisée",
        "approved area",
        "Restez dans la zone autorisée."
      ],
      [
        "un report",
        "postponement",
        "Un report reste possible."
      ],
      [
        "un avertissement",
        "warning",
        "L’avertissement dépend des conditions."
      ],
      [
        "un encadrement",
        "supervision",
        "L’encadrement est nécessaire."
      ]
    ],
    "dialogue": [
      [
        "Thomas",
        "Je me suis inscrit à la collecte près de la rivière dimanche, mais le message récent parle d’un report possible si les conditions deviennent défavorables.",
        "I signed up for Sunday's cleanup, but a new message says weather may cause postponement."
      ],
      [
        "Organisatrice",
        "L’invitation initiale reste valable comme description du projet, mais nous confirmerons la tenue de l’événement après avoir évalué les conditions sur place.",
        "The invitation explains the project, but occurrence will be confirmed after assessing conditions."
      ],
      [
        "Thomas",
        "Je voudrais connaître les zones autorisées et savoir si des gants et des sacs seront disponibles pour les tâches habituelles.",
        "I want to know the approved areas and equipment."
      ],
      [
        "Organisatrice",
        "Les bénévoles suivront les instructions des responsables; ils ne devront pas toucher aux objets dangereux ni entrer dans les zones interdites.",
        "Volunteers must follow staff, avoid hazardous objects and restricted areas."
      ],
      [
        "Thomas",
        "Je vais donc attendre la confirmation officielle avant de me déplacer et respecter les limites fixées par l’équipe plutôt que d’improviser.",
        "I'll await official confirmation and follow staff-defined boundaries."
      ]
    ],
    "reading": {
      "title": "Une activité utile dépend de conditions réelles",
      "paragraphs": [
        "Une association invite les habitants à participer à une collecte de déchets près d'une rivière. L'affiche présente l'objectif : ramasser des papiers et des emballages dans les zones qui seront désignées par les responsables. Les participants doivent se retrouver dimanche matin près du parc. Thomas s'inscrit avec quelques amis et prévoit de prendre les transports en commun pour rejoindre le groupe.",
        "Deux jours avant l'événement, les organisateurs publient un message complémentaire. Les conditions sur les berges pourraient rendre certaines zones impraticables. La collecte pourrait donc être reportée ou limitée à un périmètre plus petit. Le message précise aussi que les bénévoles ne doivent pas manipuler d'objets dangereux et qu'ils devront suivre les consignes de l'équipe. Thomas remarque que cette mise à jour ne dit pas encore si la collecte aura effectivement lieu.",
        "Il écrit alors pour demander comment les participants recevront la décision finale et quel matériel sera fourni. Il conserve l'invitation initiale comme description du projet, mais ne traite plus son horaire comme définitivement garanti. Lorsque les responsables confirmeront les conditions et les zones autorisées, il pourra préparer sa participation. Il comprend qu'aider ne signifie pas se charger seul de situations qui nécessitent une intervention spécialisée."
      ],
      "questions": [
        [
          "What is the cleanup's intended activity?",
          "ramasser des papiers et emballages dans les zones autorisées",
          [
            "ramasser des papiers et emballages dans les zones autorisées",
            "entrer dans l’eau pour chercher des objets",
            "déplacer des déchets dangereux"
          ],
          "The invitation limits ordinary volunteer activity to supervised permitted areas."
        ],
        [
          "What can change after the weather update?",
          "la date ou le périmètre",
          [
            "le nom de la rivière",
            "la date ou le périmètre",
            "la langue de l’affiche"
          ],
          "Organizers may postpone or restrict the event depending on local conditions."
        ],
        [
          "Why does Thomas wait for confirmation?",
          "les conditions doivent être évaluées",
          [
            "les conditions doivent être évaluées",
            "la collecte est déjà terminée",
            "les sacs sont gratuits"
          ],
          "The update leaves the event's operation dependent on a staff decision."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Cleanup invitation",
        "type": "poster",
        "french": "Collecte de quartier dimanche à 10 h près du parc. Activité prévue : ramassage de papiers et d’emballages dans les zones autorisées sous encadrement. Informations pratiques à confirmer."
      },
      {
        "label": "Organizer's safety update",
        "type": "notice",
        "french": "Selon les conditions des berges, la collecte pourra être limitée ou reportée. Ne touchez pas aux objets dangereux et n’entrez pas dans les zones interdites. Attendez la confirmation officielle."
      }
    ],
    "comparison": [
      [
        "Which source first states the intended meeting time?",
        "l’invitation",
        [
          "l’invitation",
          "la mise à jour",
          "aucun"
        ],
        "The poster proposes Sunday at ten, while the notice qualifies whether it will occur."
      ],
      [
        "What behavior is explicitly prohibited by the update?",
        "toucher les objets dangereux",
        [
          "toucher les objets dangereux",
          "demander des gants",
          "attendre un responsable"
        ],
        "The organizer's update forbids handling hazardous objects."
      ]
    ],
    "listening": [
      [
        "What event did Thomas register for?",
        "une collecte près de la rivière",
        [
          "une collecte près de la rivière",
          "une visite au musée",
          "un cours de cuisine"
        ],
        "Thomas registered for the river cleanup."
      ],
      [
        "Why might the event be postponed?",
        "des conditions défavorables sur place",
        [
          "des conditions défavorables sur place",
          "le prix des billets",
          "un livre perdu"
        ],
        "The organizer will check local conditions first."
      ],
      [
        "What should volunteers never handle themselves?",
        "des objets dangereux",
        [
          "des objets dangereux",
          "des gants fournis",
          "des sacs ordinaires"
        ],
        "The staff explicitly warns against touching hazardous items."
      ]
    ],
    "recall": {
      "clozes": [
        [
          "Nous attendons pour que les organisateurs ___ confirmer. (pouvoir)",
          "puissent",
          "With plural organizers, the subjunctive is puissent after pour que.",
          "purpose"
        ],
        [
          "Si l’événement est confirmé, nous ___ au parc. (aller, future nous)",
          "irons",
          "A real si plus present clause takes future irons in the main clause.",
          "condition"
        ]
      ],
      "order": [
        "La tenue reste à confirmer",
        [
          "reste à confirmer",
          "La tenue"
        ],
        "The event's occurrence is not established until organizers decide.",
        "safety status"
      ]
    },
    "writing": {
      "fromListening": [
        "Write a concise volunteer safety briefing based on the organizer conversation.",
        [
          "Distinguish project intention from current event confirmation.",
          "Mention the restricted zones and hazardous-object rule.",
          "Direct volunteers to official staff information."
        ],
        "L’association souhaite organiser une collecte près de la rivière dimanche. Cependant, les conditions des berges doivent encore être évaluées et l’événement pourrait être limité ou reporté. Les bénévoles devront suivre les indications des organisateurs, rester dans les zones autorisées et ne pas toucher aux objets dangereux. Les responsables confirmeront la date, le lieu et le matériel à apporter. Il serait incorrect de garantir que la collecte aura lieu comme prévu ou de demander aux participants d’improviser des interventions risquées."
      ],
      "fromSources": [
        "Draft an evidence-based participant update comparing the invitation with the later safety notice.",
        [
          "State the proposed start and project purpose.",
          "Explain the weather-dependent limits accurately.",
          "Request a final decision and avoid unsafe independent actions."
        ],
        "Bonjour, nous avons reçu l’invitation à la collecte prévue dimanche à dix heures près du parc. Le projet concerne le ramassage de déchets ordinaires dans des zones autorisées et sous encadrement. Un avis plus récent précise que les conditions des berges pourraient entraîner un report ou une limitation du parcours. Nous attendrons donc la confirmation officielle avant de nous déplacer. Les bénévoles ne devront pas entrer dans les zones interdites ni toucher aux objets dangereux. Merci de communiquer les consignes définitives et le matériel prévu."
      ]
    },
    "oral": {
      "prompt": "Present a short volunteer update that preserves the organizer's safety boundaries.",
      "plan": [
        "Identify the planned activity and tentative time.",
        "Explain the conditions affecting the event.",
        "Communicate the prohibited actions and confirmation plan."
      ],
      "model": "La collecte près de la rivière est prévue dimanche à dix heures, mais les organisateurs doivent encore vérifier les conditions des berges. L’événement pourrait être reporté ou limité à certaines zones. Les bénévoles aideront seulement dans le périmètre autorisé et suivront les responsables. Ils ne toucheront pas aux objets dangereux. Je recommande d’attendre la confirmation officielle et de vérifier le matériel avant de se déplacer."
    }
  }
];
export const U14_22_24=Object.freeze(SOURCE.map((record,i)=>authorU14Scenario(record,22+i)));
