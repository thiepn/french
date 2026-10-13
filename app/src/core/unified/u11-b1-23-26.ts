import {authorB1DepthUnit} from './u11-b1-model.ts';
import type {A1AuthoredSpec} from './u6-a1-model.ts';
const units:A1AuthoredSpec[]=[
  {
    "id": "b1-23",
    "title": "Negotiate a schedule across different needs",
    "goal": "Understand competing time constraints and propose a balanced meeting schedule.",
    "grammarIds": [],
    "grammar": [
      [
        "Participial time and simultaneity",
        "Tandis que and alors que contrast simultaneous situations: je termine à dix-huit heures, tandis que mon collègue commence plus tard. Pendant que links actions occurring together. En + present participle can express how a result is obtained, as in en déplaçant la réunion, nous libérons la salle. Do not use alors que as a universal cause marker; sometimes it signals contrast or simultaneity rather than reason.",
        [
          [
            "Pendant que je travaille, mon collègue prépare la salle.",
            "While I work, my colleague prepares the room."
          ],
          [
            "En avançant le début, nous évitons le dernier bus.",
            "By moving the start earlier, we avoid the last bus."
          ]
        ],
        [
          "En nous avançons la réunion, tout le monde est libre.",
          "En avançant la réunion, nous libérons la soirée.",
          "En is followed by a present participle, not conjugated nous avançons."
        ]
      ],
      [
        "Negotiating rather than asserting agreement",
        "Serait-il possible de + infinitive makes a polite change request; à condition que + subjunctive expresses a necessary condition involving another subject. Une proposition ne devient pas un accord tant que les personnes concernées n’ont pas confirmé. A useful scheduling message names the proposed slot, each constraint and the response needed.",
        [
          [
            "Nous pourrions commencer plus tôt, à condition que chacun puisse venir.",
            "We could begin earlier provided everyone can come."
          ],
          [
            "Serait-il possible de décaler la réunion à jeudi ?",
            "Would it be possible to move the meeting to Thursday?"
          ]
        ],
        [
          "À condition que tous peuvent venir, nous commençons.",
          "À condition que tous puissent venir, nous pourrions commencer.",
          "À condition que selects subjunctive puissent."
        ]
      ]
    ],
    "vocabulary": [
      [
        "un créneau",
        "time slot",
        "Le créneau de mardi est disponible."
      ],
      [
        "décaler",
        "to reschedule",
        "Nous pouvons décaler l’entretien."
      ],
      [
        "avancer",
        "move earlier",
        "J’aimerais avancer la réunion."
      ],
      [
        "reporter",
        "postpone",
        "Il faut reporter la décision."
      ],
      [
        "un chevauchement",
        "overlap",
        "Il existe un chevauchement d’horaires."
      ],
      [
        "une contrainte",
        "constraint",
        "J’ai une contrainte de transport."
      ],
      [
        "pendant que",
        "while",
        "Pendant que je travaille, elle attend."
      ],
      [
        "alors que",
        "whereas/while",
        "Je finis à midi alors qu’il finit à seize heures."
      ],
      [
        "à condition que",
        "provided that",
        "À condition que chacun puisse venir."
      ],
      [
        "une disponibilité",
        "availability",
        "Je demande ses disponibilités."
      ],
      [
        "un accord",
        "agreement",
        "L’accord n’est pas encore obtenu."
      ],
      [
        "un compromis",
        "compromise",
        "Cherchons un compromis réaliste."
      ]
    ],
    "dialogue": [
      [
        "Sarah",
        "J’aimerais avancer la réunion de vendredi, car mon dernier bus part avant la fin du créneau actuellement proposé.",
        "I would like to move Friday's meeting earlier because my last bus leaves before the current slot ends."
      ],
      [
        "Bastien",
        "Je comprends, mais Amina travaille jusqu’à quinze heures et ne pourra probablement pas participer à la première partie.",
        "I understand, but Amina works until three and likely cannot attend the opening."
      ],
      [
        "Sarah",
        "Nous pourrions commencer à seize heures, à condition que les autres membres puissent confirmer leur disponibilité.",
        "We could start at four provided the other members confirm availability."
      ],
      [
        "Bastien",
        "C’est une option raisonnable; cependant, aucune réponse ne garantit encore que tout le groupe pourra être présent.",
        "Reasonable, but no response yet guarantees everyone can attend."
      ],
      [
        "Sarah",
        "Je vais envoyer deux créneaux précis et demander à chacun de choisir avant de présenter un horaire définitif.",
        "I will send two exact slots and ask everyone to choose before calling any time final."
      ]
    ],
    "tasks": [
      [
        "fill",
        "Nous pourrions commencer à seize heures, à condition que tous ___ venir.",
        "puissent",
        "À condition que with a different subject requires subjunctive puissent.",
        [],
        "subjunctive"
      ],
      [
        "choice",
        "What does un créneau mean here?",
        "a time slot",
        "The noun describes an available interval proposed for a meeting.",
        [
          "a train ticket",
          "a time slot",
          "a written complaint"
        ],
        "vocabulary"
      ],
      [
        "reading",
        "Why might Amina miss an earlier meeting?",
        "elle travaille jusqu’à quinze heures",
        "Bastien reports a work constraint that limits Amina’s availability.",
        [
          "elle part en vacances",
          "elle travaille jusqu’à quinze heures",
          "elle n’aime pas la réunion"
        ],
        "constraint"
      ],
      [
        "fill",
        "En ___ la réunion, nous évitons le dernier bus. (avancer)",
        "avançant",
        "The gerund is en plus present participle avançant.",
        [],
        "gerund"
      ],
      [
        "choice",
        "Which sentence avoids premature approval?",
        "Le créneau reste à confirmer.",
        "A suggested time needs actual responses before it becomes fixed.",
        [
          "Tout le monde a accepté.",
          "Le créneau reste à confirmer.",
          "La réunion est définitivement déplacée."
        ],
        "status"
      ],
      [
        "order",
        "Arrange: deux créneaux précis / Je proposerai",
        "Je proposerai deux créneaux précis",
        "The finite future verb introduces the clear options.",
        [
          "deux créneaux précis",
          "Je proposerai"
        ],
        "syntax"
      ],
      [
        "fill",
        "Serait-il possible de ___ la réunion à jeudi ?",
        "décaler",
        "Décaler means moving a scheduled activity to another slot.",
        [],
        "polite rescheduling"
      ],
      [
        "reading",
        "What response will Sarah request?",
        "que chacun choisisse un créneau",
        "She will ask every participant to select between specific times.",
        [
          "une nouvelle salle",
          "que chacun choisisse un créneau",
          "des billets de bus"
        ],
        "next action"
      ],
      [
        "choice",
        "Which phrase contrasts two schedules?",
        "alors que",
        "Alors que compares simultaneous or contrasting situations.",
        [
          "par conséquent",
          "alors que",
          "grâce à"
        ],
        "connector"
      ],
      [
        "fill",
        "Nous attendons encore un ___ de la part du groupe.",
        "accord",
        "An accord requires an actual decision, not a suggested possibility.",
        [],
        "agreement"
      ]
    ],
    "writing": [
      "Write a five-to-eight sentence scheduling proposal acknowledging two different constraints.",
      [
        "Give two concrete alternative slots and an explanation for each.",
        "Use a polite request and one correct conditional construction.",
        "Say explicitly that the new schedule is not final until replies arrive."
      ],
      "Bonjour à tous, le créneau de vendredi pose deux difficultés. Mon dernier bus part avant la fin de la réunion, tandis qu’Amina travaille jusqu’à quinze heures. Nous pourrions nous retrouver à seize heures ou décaler la réunion à samedi matin. La première option conviendrait au transport, à condition que chacun puisse venir. Pourriez-vous indiquer votre préférence avant mercredi ? Je ne présenterai aucun horaire comme définitif avant d’avoir reçu vos réponses. Merci pour votre aide."
    ]
  },
  {
    "id": "b1-24",
    "title": "Evaluate a travel diary and its uncertainties",
    "goal": "Retell a multi-stage journey and explain how expectations changed when new evidence appeared.",
    "grammarIds": [],
    "grammar": [
      [
        "Temporal perspective and reported expectations",
        "When recounting a journey, distinguish a plan made beforehand (nous pensions partir tôt), preparation earlier than another past event (nous avions réservé) and the event itself (le train a été annulé). Finalement introduces the actual eventual outcome. Le voyageur pensait que ... reports the writer's previous expectation, not necessarily a true fact about the world.",
        [
          [
            "Nous avions réservé avant de découvrir le changement.",
            "We had booked before discovering the change."
          ],
          [
            "Je pensais que le train partirait à neuf heures.",
            "I thought the train would leave at nine."
          ]
        ],
        [
          "Je pensais que le train est parti demain.",
          "Je pensais que le train partirait le lendemain.",
          "In a past viewpoint, future-in-the-past uses the conditional partirait."
        ]
      ],
      [
        "Differentiate obstacle, response and lesson",
        "Un imprévu describes the disruption, tandis que la solution names a response. Use cependant to limit an overconfident conclusion; after one delay a writer may learn to verify timetables, but not that travel always fails. Link outcome and insight with cette expérience m’a appris à plus infinitive and identify what actually changed.",
        [
          [
            "Nous avons trouvé un autre itinéraire après l’annulation.",
            "We found another route after the cancellation."
          ],
          [
            "Cette expérience m’a appris à prévoir du temps supplémentaire.",
            "This experience taught me to allow extra time."
          ]
        ],
        [
          "Le train était en retard; par conséquent, aucun train ne sera ponctuel.",
          "Le train était en retard; je vérifierai les prochains départs.",
          "One delay does not establish a universal rule."
        ]
      ]
    ],
    "vocabulary": [
      [
        "un carnet de voyage",
        "travel diary",
        "J’écris mon carnet de voyage."
      ],
      [
        "une étape",
        "stage",
        "Chaque étape est racontée."
      ],
      [
        "un imprévu",
        "unforeseen event",
        "Un imprévu a changé le trajet."
      ],
      [
        "une prévision",
        "forecast",
        "La prévision n’était pas exacte."
      ],
      [
        "un détour",
        "detour",
        "Nous avons fait un détour."
      ],
      [
        "un itinéraire",
        "route",
        "L’itinéraire a été modifié."
      ],
      [
        "un contretemps",
        "setback",
        "Un contretemps nous a ralentis."
      ],
      [
        "finalement",
        "eventually",
        "Finalement, nous sommes arrivés."
      ],
      [
        "un souvenir",
        "memory",
        "Ce voyage reste un souvenir."
      ],
      [
        "auparavant",
        "beforehand",
        "Auparavant, nous avions réservé."
      ],
      [
        "une impression",
        "impression",
        "Mon impression a changé."
      ],
      [
        "une leçon",
        "lesson learned",
        "J’en ai tiré une leçon."
      ]
    ],
    "dialogue": [
      [
        "Émilie",
        "Dans mon carnet de voyage, j’ai écrit que nous pensions arriver samedi matin, puisque notre billet indiquait un départ très tôt.",
        "In my travel diary I wrote we expected to arrive Saturday morning because the ticket had an early departure."
      ],
      [
        "Romain",
        "Cependant, tu expliques ensuite que le train avait été remplacé par un bus avant votre départ, sans que vous l’ayez remarqué.",
        "But you later explain the train had been replaced by a bus before you departed."
      ],
      [
        "Émilie",
        "Exactement, nous avons découvert le changement à la gare et avons dû faire un détour qui a duré presque deux heures.",
        "Exactly, we discovered the change at the station and took a detour lasting almost two hours."
      ],
      [
        "Romain",
        "Tu racontes aussi que vous avez rencontré un habitant qui vous a indiqué un endroit agréable pour déjeuner pendant l’attente.",
        "You also tell how a local person recommended a lunch spot during the wait."
      ],
      [
        "Émilie",
        "Oui, finalement la journée était différente de nos prévisions, mais elle m’a appris à vérifier les messages avant chaque étape.",
        "Yes, ultimately the day differed from the plan but taught me to check messages before each leg."
      ]
    ],
    "tasks": [
      [
        "fill",
        "Nous ___ réservé avant de découvrir le changement.",
        "avions",
        "Plus-que-parfait places a reservation before another past event.",
        [],
        "earlier past"
      ],
      [
        "choice",
        "Which is the actual outcome rather than a forecast?",
        "Ils ont fait un détour.",
        "The detour is narrated as an event that actually happened.",
        [
          "Ils arriveraient forcément tôt.",
          "Ils ont fait un détour.",
          "Le train partirait sans doute."
        ],
        "actuality"
      ],
      [
        "reading",
        "What happened to the service before departure?",
        "un train remplacé par un bus",
        "The original train was replaced by a bus before the travelers knew.",
        [
          "un bus devenu bateau",
          "un train remplacé par un bus",
          "une route ouverte plus tôt"
        ],
        "chronology"
      ],
      [
        "fill",
        "Je pensais que le train ___ à neuf heures. (partir, future in past)",
        "partirait",
        "Reported future in a past perspective uses conditional partirait.",
        [],
        "future in past"
      ],
      [
        "choice",
        "What does finalement signal in a diary?",
        "the eventual result",
        "It introduces the observed final outcome after complications.",
        [
          "the earliest plan",
          "the eventual result",
          "a legal condition"
        ],
        "narrative"
      ],
      [
        "order",
        "Arrange: un autre itinéraire / Nous avons trouvé",
        "Nous avons trouvé un autre itinéraire",
        "The completed solution advances the narrative.",
        [
          "un autre itinéraire",
          "Nous avons trouvé"
        ],
        "syntax"
      ],
      [
        "fill",
        "Nous avons fait un ___ pour éviter la fermeture.",
        "détour",
        "A détour is a diversion from the original route.",
        [],
        "lexicon"
      ],
      [
        "reading",
        "What positive event occurred during the wait?",
        "un habitant a conseillé un lieu pour déjeuner",
        "The narrator reports helpful local advice during the delay.",
        [
          "ils ont acheté une voiture",
          "un habitant a conseillé un lieu pour déjeuner",
          "leur hôtel était gratuit"
        ],
        "reading"
      ],
      [
        "choice",
        "Which lesson is supported by this experience?",
        "vérifier les messages avant les étapes",
        "The delayed transport supports checking updates, not claiming all trains fail.",
        [
          "aucun train n’est fiable",
          "vérifier les messages avant les étapes",
          "il faut arrêter tout voyage"
        ],
        "reflection"
      ],
      [
        "fill",
        "Cette expérience m’a ___ à être plus attentif. (apprendre)",
        "appris",
        "Apprendre has the irregular past participle appris.",
        [],
        "participle"
      ]
    ],
    "writing": [
      "Write a nine-sentence diary about a changed journey with an expectation, an earlier cause, actual outcome and modest reflection.",
      [
        "Use imparfait, passé composé and plus-que-parfait accurately.",
        "Distinguish a past assumption from confirmed events.",
        "End with one useful lesson that follows from your experience."
      ],
      "Samedi, nous pensions rejoindre une petite ville avant midi. Nous avions réservé un train tôt dans la semaine. Pourtant, la compagnie avait modifié le trajet la veille. Nous avons découvert ce changement en arrivant à la gare. Un bus remplaçait le train et nous avons dû faire un détour. Pendant l’attente, un habitant nous a conseillé un petit café. Nous y avons déjeuné avant de continuer. Finalement, nous sommes arrivés plus tard que prévu. Cette expérience m’a appris à vérifier les messages récents avant chaque départ."
    ]
  },
  {
    "id": "b1-25",
    "title": "Interpret percentages without inventing conclusions",
    "goal": "Read simple quantitative claims accurately and explain what a chart does and does not establish.",
    "grammarIds": [],
    "grammar": [
      [
        "Numerical comparisons and denominators",
        "Un pourcentage describes a fraction of a defined group, not a free-standing universal claim. Trente pour cent des personnes interrogées ont choisi le train differs from trente pour cent de la population. Le nombre de participants and l’échantillon tell readers what the number refers to. Compare hausse de dix points de pourcentage with hausse de dix pour cent, which are not the same.",
        [
          [
            "Trente pour cent des répondants préfèrent le train.",
            "Thirty percent of respondents prefer the train."
          ],
          [
            "La part est passée de vingt à trente pour cent, soit dix points de plus.",
            "The share increased from 20% to 30%, a rise of ten percentage points."
          ]
        ],
        [
          "Le taux passe de vingt à trente pour cent, donc il augmente de dix pour cent.",
          "Le taux passe de vingt à trente pour cent : il augmente de dix points.",
          "The difference is ten percentage points, not a 10% relative increase."
        ]
      ],
      [
        "Correlation, causes and uncertainty",
        "Une enquête descriptive reports answers from respondents; it cannot necessarily establish why those answers differ. Use semble, peut-être and ne permet pas de conclure que to qualify interpretation. If a chart lacks a sample size, comparison basis or date, say those details are missing instead of guessing them. A measured change is not automatically caused by the nearest event.",
        [
          [
            "Le graphique montre une hausse, mais n’en explique pas la cause.",
            "The chart shows an increase but does not explain its cause."
          ],
          [
            "Sans connaître l’échantillon, la portée du résultat reste limitée.",
            "Without knowing the sample, the result's scope is limited."
          ]
        ],
        [
          "Deux valeurs montent ensemble, donc l’une cause l’autre.",
          "Les deux valeurs augmentent ensemble, mais leur relation causale n’est pas établie.",
          "A shared trend does not prove a cause-and-effect relationship."
        ]
      ]
    ],
    "vocabulary": [
      [
        "un pourcentage",
        "percentage",
        "Le pourcentage est de trente pour cent."
      ],
      [
        "un répondant",
        "respondent",
        "Chaque répondant donne un avis."
      ],
      [
        "un échantillon",
        "sample",
        "L’échantillon est limité."
      ],
      [
        "une proportion",
        "proportion",
        "La proportion a changé."
      ],
      [
        "un point de pourcentage",
        "percentage point",
        "La part augmente de cinq points."
      ],
      [
        "une hausse",
        "increase",
        "Une hausse a été observée."
      ],
      [
        "une baisse",
        "decrease",
        "La baisse est légère."
      ],
      [
        "une tendance",
        "trend",
        "La tendance est incertaine."
      ],
      [
        "un graphique",
        "chart",
        "Le graphique décrit des réponses."
      ],
      [
        "une enquête",
        "survey",
        "L’enquête interroge des volontaires."
      ],
      [
        "une corrélation",
        "correlation",
        "Une corrélation ne prouve pas la cause."
      ],
      [
        "un dénominateur",
        "denominator",
        "Le dénominateur doit être clair."
      ]
    ],
    "dialogue": [
      [
        "Chloé",
        "Le graphique indique que trente pour cent des personnes interrogées préfèrent le train, mais il ne donne pas le nombre total de répondants.",
        "The graph says 30% of respondents prefer trains but omits the total."
      ],
      [
        "Léo",
        "Nous pouvons donc décrire cette proportion, sans affirmer qu’elle représente automatiquement toute la population de la ville.",
        "We can describe that share without assuming it represents the whole city."
      ],
      [
        "Chloé",
        "La part est passée de vingt à trente pour cent entre deux enquêtes, ce qui correspond à dix points de pourcentage.",
        "The share rose from 20 to 30 percent, a gain of ten percentage points."
      ],
      [
        "Léo",
        "C’est exact; cependant, nous ne savons pas si les enquêtes ont utilisé les mêmes questions et le même échantillon.",
        "Correct, but we do not know whether the surveys used the same questions and sample."
      ],
      [
        "Chloé",
        "Dans notre résumé, nous distinguerons la variation observée des causes possibles, qui restent à étudier avant toute conclusion.",
        "Our summary will separate observed change from possible causes that require research."
      ]
    ],
    "tasks": [
      [
        "fill",
        "Trente pour ___ des répondants préfèrent le train.",
        "cent",
        "Pour cent expresses a proportion of a specified group.",
        [],
        "percentage"
      ],
      [
        "choice",
        "From 20% to 30% is an increase of how many percentage points?",
        "dix",
        "The absolute difference between 30 and 20 is ten points, not ten percent relative.",
        [
          "dix",
          "trente",
          "cinquante"
        ],
        "percentage points"
      ],
      [
        "reading",
        "What key sample detail is missing?",
        "le nombre de répondants",
        "Chloé states the graph omits the total number surveyed.",
        [
          "le titre du graphique",
          "le nombre de répondants",
          "la date du cours"
        ],
        "scope"
      ],
      [
        "fill",
        "Le groupe étudié forme un ___.",
        "échantillon",
        "An échantillon is the group from which survey answers are drawn.",
        [],
        "vocabulary"
      ],
      [
        "choice",
        "What cannot be inferred solely from two rising values?",
        "that one causes the other",
        "Co-movement does not independently establish a causal relation.",
        [
          "that both increased",
          "that one causes the other",
          "that the chart has values"
        ],
        "causation"
      ],
      [
        "order",
        "Arrange: reste limitée / La portée du résultat",
        "La portée du résultat reste limitée",
        "The subject phrase introduces the limit on generalization.",
        [
          "reste limitée",
          "La portée du résultat"
        ],
        "syntax"
      ],
      [
        "fill",
        "Le graphique indique une ___ de dix points.",
        "hausse",
        "Une hausse describes the observed rise in the reported measure.",
        [],
        "trend"
      ],
      [
        "reading",
        "Why do the speakers avoid comparing the surveys too confidently?",
        "les questions et échantillons sont inconnus",
        "The survey methods and groups might differ across the two observations.",
        [
          "la gare a déménagé",
          "les questions et échantillons sont inconnus",
          "le train est gratuit"
        ],
        "method"
      ],
      [
        "choice",
        "Which statement properly identifies the population?",
        "Trente pour cent des personnes interrogées…",
        "It ties the percentage to its actual denominator.",
        [
          "Trente pour cent de tous les habitants…",
          "Trente pour cent des personnes interrogées…",
          "Tout le monde prend le train."
        ],
        "precision"
      ],
      [
        "fill",
        "Une ___ ne prouve pas à elle seule une cause.",
        "corrélation",
        "Correlation can exist without an established causal explanation.",
        [],
        "reasoning"
      ]
    ],
    "writing": [
      "Write a short text comparing two survey percentages while preserving the unknown sample context.",
      [
        "State the two values and their percentage-point difference correctly.",
        "Identify exactly which group the percentage describes.",
        "Explain at least two limitations before suggesting any cause."
      ],
      "La première enquête indique que vingt pour cent des répondants préfèrent le train. Dans la seconde, la proportion atteint trente pour cent, soit dix points de pourcentage de plus. Cette variation est observable dans les résultats présentés. Cependant, nous ne connaissons ni le nombre total de participants ni les méthodes de sélection. Nous ignorons aussi si les questions étaient identiques. Il serait donc prématuré d’affirmer que cette évolution concerne tous les habitants ou qu’une politique particulière en est la cause. Une comparaison mieux documentée serait nécessaire."
    ]
  },
  {
    "id": "b1-26",
    "title": "Turn meeting notes into an accurate summary",
    "goal": "Separate proposals, action owners, decisions and unresolved questions in a concise meeting report.",
    "grammarIds": [],
    "grammar": [
      [
        "Distinguish proposals, decisions and tasks",
        "Un compte rendu n’est pas une transcription intégrale; it is a structured record of the important points. A proposé de signals a suggestion, a décidé de signals a decision, and est chargé de names an assigned action. Do not collapse these different statuses. Use qui fera quoi et avant quand to describe an accountable next step only if the meeting actually established those details.",
        [
          [
            "Le groupe a proposé de déplacer la réunion.",
            "The group proposed moving the meeting."
          ],
          [
            "Amina est chargée de demander les disponibilités.",
            "Amina is responsible for asking about availability."
          ]
        ],
        [
          "Nous avons discuté d’une autre salle; le changement est confirmé.",
          "Nous avons discuté d’une autre salle, mais aucun changement n’a été décidé.",
          "Discussion does not establish a final decision."
        ]
      ],
      [
        "Neutral reported speech and precise reference",
        "Selon le compte rendu can attribute a decision to the written record; d’après les notes provisoires flags uncertainty. Pour éviter les ambiguïtés, replace vague pronouns with names when several people might be the referent. Separate a task due by a date from an option that remains pending; some meetings produce no final decision, which should be recorded honestly.",
        [
          [
            "D’après les notes, Paul doit vérifier les horaires avant jeudi.",
            "According to the notes, Paul must verify the times before Thursday."
          ],
          [
            "La proposition sera examinée lors de la prochaine réunion.",
            "The proposal will be considered at the next meeting."
          ]
        ],
        [
          "Elle a dit qu’elle allait le faire, donc tout est terminé.",
          "Elle a accepté la tâche, mais son exécution reste à confirmer.",
          "An assigned task is not a completed task."
        ]
      ]
    ],
    "vocabulary": [
      [
        "un compte rendu",
        "minutes/summary",
        "Le compte rendu résume la réunion."
      ],
      [
        "un ordre du jour",
        "agenda",
        "L’ordre du jour comporte trois points."
      ],
      [
        "une décision",
        "decision",
        "La décision est notée clairement."
      ],
      [
        "une proposition",
        "proposal",
        "La proposition n’est pas adoptée."
      ],
      [
        "un responsable",
        "person in charge",
        "Le responsable vérifiera le matériel."
      ],
      [
        "une tâche",
        "task",
        "Chaque tâche a un responsable."
      ],
      [
        "une échéance",
        "deadline",
        "L’échéance est mercredi."
      ],
      [
        "provisoire",
        "provisional",
        "Les notes sont provisoires."
      ],
      [
        "à confirmer",
        "to be confirmed",
        "La salle reste à confirmer."
      ],
      [
        "un suivi",
        "follow-up",
        "Le suivi aura lieu vendredi."
      ],
      [
        "adopter",
        "to adopt",
        "Le groupe adopte une proposition."
      ],
      [
        "une synthèse",
        "summary",
        "Cette synthèse est neutre."
      ]
    ],
    "dialogue": [
      [
        "Éva",
        "Dans le compte rendu, j’ai noté que Marc a proposé une rencontre mixte, mais personne n’a encore voté pour ce format.",
        "In the minutes, I noted Marc proposed a hybrid event, but no one has voted."
      ],
      [
        "Noé",
        "Tu peux aussi préciser que Clara doit vérifier le matériel avant jeudi, car cette tâche lui a été confiée pendant la réunion.",
        "You can also say Clara was assigned to check equipment by Thursday."
      ],
      [
        "Éva",
        "C’est vrai, mais je ne sais pas qui sera responsable des invitations; nous avons discuté du sujet sans désigner personne.",
        "True, but nobody was appointed to invitations though it was discussed."
      ],
      [
        "Noé",
        "Dans ce cas, laisse ce point ouvert et évite d’écrire que les invitations partiront vendredi comme si cela était certain.",
        "Leave the point open; don't write that invitations will go Friday as a certainty."
      ],
      [
        "Éva",
        "Je présenterai donc trois rubriques distinctes : décisions prises, tâches attribuées et questions qui demandent encore une réponse.",
        "I'll present decisions, assigned tasks and unresolved questions separately."
      ]
    ],
    "tasks": [
      [
        "fill",
        "Le groupe a ___ une rencontre mixte. (proposer)",
        "proposé",
        "The completed act of proposing is not the same as adopting.",
        [],
        "meeting status"
      ],
      [
        "choice",
        "Which phrase names an assigned duty?",
        "être chargé de",
        "Être chargé de identifies responsibility for an action.",
        [
          "être sûr de",
          "être chargé de",
          "être surpris de"
        ],
        "responsibility"
      ],
      [
        "reading",
        "Who must check equipment?",
        "Clara",
        "Noé says Clara was assigned the equipment check before Thursday.",
        [
          "Marc",
          "Clara",
          "Éva"
        ],
        "action owner"
      ],
      [
        "fill",
        "Le format reste ___ confirmer.",
        "à",
        "À confirmer signals no final determination has yet been recorded.",
        [],
        "status"
      ],
      [
        "choice",
        "What is the status of invitations?",
        "no owner was assigned",
        "The participants discussed invitations without assigning a person.",
        [
          "they are already sent",
          "no owner was assigned",
          "they are cancelled"
        ],
        "unresolved task"
      ],
      [
        "order",
        "Arrange: n’a pas été adoptée / La proposition",
        "La proposition n’a pas été adoptée",
        "The negative passive correctly reports the still-unapproved proposal.",
        [
          "n’a pas été adoptée",
          "La proposition"
        ],
        "syntax"
      ],
      [
        "fill",
        "Un compte ___ résume les décisions et les tâches.",
        "rendu",
        "Compte rendu means an organized record of a meeting.",
        [],
        "terminology"
      ],
      [
        "reading",
        "Why should Friday not be listed as a confirmed invitation date?",
        "aucune décision ni responsable n’existent",
        "Without an assigned person or decision, the date would be speculative.",
        [
          "le bureau est fermé mardi",
          "aucune décision ni responsable n’existent",
          "tout le monde refuse"
        ],
        "accountability"
      ],
      [
        "choice",
        "Which summary is faithful?",
        "Clara vérifiera le matériel; le format reste proposé.",
        "It separates an assigned task from an undecided proposed format.",
        [
          "La rencontre mixte est votée et les invitations partent.",
          "Clara vérifiera le matériel; le format reste proposé.",
          "Marc a déjà envoyé les invitations."
        ],
        "synthesis"
      ],
      [
        "fill",
        "Les notes restent ___ tant que le groupe ne les vérifie pas.",
        "provisoires",
        "Provisoires describes draft notes not yet confirmed by reviewers.",
        [],
        "qualification"
      ]
    ],
    "writing": [
      "Prepare concise minutes summarizing a fictional meeting with explicit decisions, assigned tasks and open issues.",
      [
        "Use separate headings or sentences for adopted decisions versus proposals.",
        "Name a responsible person and due date only when confirmed.",
        "Preserve unanswered questions without inventing agreements."
      ],
      "Compte rendu provisoire de la réunion. Le groupe a discuté de la possibilité d’une rencontre mixte. Marc a proposé ce format, mais la proposition n’a pas encore été adoptée. Clara est chargée de vérifier les besoins techniques avant jeudi. Aucun responsable n’a été désigné pour les invitations et aucune date d’envoi n’a été décidée. La prochaine réunion devra examiner ces deux questions. Cette synthèse distingue les tâches réellement attribuées des décisions encore en attente."
    ]
  }
];
export const B1_UNITS_23_26=Object.freeze(units.map((spec,i)=>authorB1DepthUnit(spec,i+23)));
