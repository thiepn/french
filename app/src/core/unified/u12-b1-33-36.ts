import {authorU12Lesson,type U12AuthoredLesson} from './u12-model.ts';
const authored:readonly U12AuthoredLesson[]=[
  {
    "id": "b1-33",
    "title": "Explain a delayed journey in a phone call",
    "goal": "Recount delays chronologically, distinguish earlier warnings from actual disruptions, and negotiate alternatives.",
    "grammarIds": [],
    "grammar": [
      [
        "Narrating three past time layers",
        "Plus-que-parfait expresses a past event already completed before another past reference: le service avait averti les passagers. Imparfait sets an ongoing circumstance: nous attendions à la gare. Passé composé advances the actual events: le bus est arrivé. Combine these tenses to explain why a plan changed without turning assumptions into facts.",
        [
          [
            "Le train était déjà parti quand je suis arrivé.",
            "The train had already left when I arrived."
          ],
          [
            "Nous attendions lorsque l’agent a fait une annonce.",
            "We were waiting when the agent made an announcement."
          ]
        ],
        [
          "J’avais parti avant l’annonce.",
          "J’étais parti avant l’annonce.",
          "Partir selects être in the compound tenses."
        ]
      ],
      [
        "Reported warnings and current options",
        "Il avait été annoncé que ... reports a past notice; cela ne signifiait pas que ... limits what it proved. Conditional pourrais or serait can propose a substitute route; if an agent has not checked availability, the solution is not confirmed. When calling someone who expects you, state the last verified location, your estimate and when you will update them.",
        [
          [
            "Le transporteur avait annoncé un changement d’horaire.",
            "The carrier had announced a timetable change."
          ],
          [
            "Je pourrais prendre un autocar si une place est disponible.",
            "I could take a coach if a seat is available."
          ]
        ],
        [
          "On envisage un autocar, donc j’y ai déjà une place.",
          "On envisage un autocar, mais aucune place n’est confirmée.",
          "A possible alternative is not an actual reservation."
        ]
      ]
    ],
    "vocabulary": [
      [
        "un retard",
        "delay",
        "Le retard vient d’être annoncé."
      ],
      [
        "une correspondance",
        "connection",
        "J’ai manqué ma correspondance."
      ],
      [
        "un autocar",
        "coach",
        "Un autocar remplace le train."
      ],
      [
        "un avertissement",
        "warning",
        "J’avais reçu un avertissement."
      ],
      [
        "le quai",
        "platform",
        "Je vous appelle depuis le quai."
      ],
      [
        "un détour",
        "detour",
        "Un détour allonge le trajet."
      ],
      [
        "une estimation",
        "estimate",
        "L’estimation reste provisoire."
      ],
      [
        "une alternative",
        "alternative",
        "Nous cherchons une alternative."
      ],
      [
        "rappeler",
        "call back",
        "Je te rappellerai après l’annonce."
      ],
      [
        "effectivement",
        "actually",
        "Le train est effectivement annulé."
      ],
      [
        "auparavant",
        "beforehand",
        "Auparavant, j’avais vérifié l’heure."
      ],
      [
        "un changement",
        "change",
        "Le changement est encore à confirmer."
      ]
    ],
    "dialogue": [
      [
        "Lina",
        "Je t’appelle depuis la gare, car notre train a été supprimé et nous attendons des informations concernant un autre trajet possible.",
        "I'm calling from the station because our train was cancelled and we're awaiting another route."
      ],
      [
        "Hugo",
        "Tu avais reçu une information avant ton départ, ou cette annulation vient-elle seulement d’être annoncée sur le quai ?",
        "Did you receive notice before leaving, or was the cancellation only announced here?"
      ],
      [
        "Lina",
        "Un message avait signalé un risque de modification hier, mais l’annulation n’a été confirmée qu’il y a vingt minutes.",
        "A message warned of possible changes yesterday, but cancellation was confirmed twenty minutes ago."
      ],
      [
        "Hugo",
        "Je comprends; pourrais-tu me dire quelle correspondance tu envisages et si ton heure d’arrivée est déjà certaine ?",
        "I understand; what connection are you considering, and is your arrival time certain?"
      ],
      [
        "Lina",
        "Un agent examine la possibilité d’un autocar, mais je n’ai pas encore de place; je te rappellerai dès que j’aurai une confirmation.",
        "An agent is checking a coach, but I have no seat yet; I'll call when it's confirmed."
      ]
    ],
    "tasks": [
      [
        "fill",
        "Quand je suis arrivé, le train était déjà ___. (partir)",
        "parti",
        "The earlier departure uses the past participle parti with être.",
        [],
        "prior past"
      ],
      [
        "choice",
        "What was confirmed twenty minutes earlier?",
        "l’annulation du train",
        "The earlier message warned of a risk, but cancellation was only recently confirmed.",
        [
          "un autocar réservé",
          "l’annulation du train",
          "l’arrivée à destination"
        ],
        "timeline"
      ],
      [
        "reading",
        "What is Lina still waiting for?",
        "une place dans l’autocar",
        "She says the alternative coach is merely being examined.",
        [
          "une place dans l’autocar",
          "une nouvelle valise",
          "un hôtel"
        ],
        "unresolved alternative"
      ],
      [
        "fill",
        "Je te ___ dès que j’aurai une réponse. (rappeler)",
        "rappellerai",
        "Rappeler doubles the l in first-person future rappellerai.",
        [],
        "future"
      ],
      [
        "choice",
        "Which tense locates an earlier warning?",
        "plus-que-parfait",
        "It places the notice before the later cancellation announcement.",
        [
          "présent de l’impératif",
          "plus-que-parfait",
          "futur proche"
        ],
        "aspect"
      ],
      [
        "order",
        "Arrange: une possibilité / L’agent examine",
        "L’agent examine une possibilité",
        "An examination does not imply acceptance of a proposed journey.",
        [
          "une possibilité",
          "L’agent examine"
        ],
        "syntax"
      ],
      [
        "fill",
        "J’ai manqué la ___ à cause du retard.",
        "correspondance",
        "A correspondance is a transport connection between services.",
        [],
        "transport"
      ],
      [
        "reading",
        "Does Lina have a confirmed alternative departure?",
        "non",
        "Lina explicitly says she has no place yet.",
        [
          "oui",
          "non",
          "elle est arrivée"
        ],
        "status"
      ],
      [
        "choice",
        "Which reply respects uncertainty?",
        "Je t’informerai après confirmation.",
        "It promises an update instead of a made-up arrival time.",
        [
          "J’arriverai sûrement à midi.",
          "Je t’informerai après confirmation.",
          "L’autocar est définitivement réservé."
        ],
        "communication"
      ],
      [
        "fill",
        "Un message avait signalé un ___ de modification.",
        "risque",
        "Risque expresses a possible change rather than its confirmed occurrence.",
        [],
        "modality"
      ]
    ],
    "writing": [
      "Write a travel update to someone waiting for you, giving the verified disruption, earlier notice, possible alternative and next update.",
      [
        "Use past perfect for the earlier warning and passé composé for the cancellation.",
        "Distinguish estimated times from confirmed details.",
        "Give one specific plan for communicating again."
      ],
      "Bonjour Hugo, je t’écris depuis la gare. Hier, la compagnie avait signalé un risque de modification, mais le train a été officiellement annulé aujourd’hui. Nous attendions sur le quai lorsque l’annonce a été faite. Un agent examine une solution en autocar, mais aucune place ne m’a été attribuée pour le moment. Je ne peux donc pas confirmer mon heure d’arrivée. Je te rappellerai dès que le nouveau trajet aura été vérifié. Merci de ta compréhension."
    ],
    "reading": {
      "title": "Un avertissement qui n’était pas encore une annulation",
      "paragraphs": [
        "La veille de son départ, Lina reçoit un message du transporteur signalant des perturbations possibles. Elle vérifie son billet, mais l'horaire affiché reste identique. Elle décide donc de préparer sa valise comme prévu. Le lendemain, elle se rend à la gare. Sur le quai, les autres voyageurs semblent eux aussi attendre des informations. Personne ne sait encore si le train pourra circuler normalement ni quand une décision définitive sera annoncée.",
        "Vingt minutes avant le départ, un agent informe les passagers que le train est supprimé. Cette nouvelle est différente du message reçu la veille, qui évoquait seulement un risque. Une correspondance devient impossible et Lina téléphone à Hugo, qui l'attend à destination. Elle lui décrit la situation sans prétendre connaître une heure d'arrivée. Le personnel envisage un autocar, mais la capacité du véhicule reste à vérifier.",
        "Plus tard, Lina reçoit une proposition de trajet, sans confirmation de place. Elle préfère attendre le message officiel avant de prévenir Hugo une seconde fois. Son récit distingue trois étapes : l'avertissement ancien, l'annulation désormais certaine et l'alternative encore incertaine. Cette chronologie permet à son interlocuteur de comprendre les faits sans confondre une possibilité avec une réservation réellement obtenue."
      ],
      "questions": [
        [
          "Which message came first?",
          "un risque de perturbation",
          [
            "une annulation définitive",
            "un risque de perturbation",
            "une place garantie"
          ],
          "The previous day's message mentioned potential disruptions only."
        ],
        [
          "Why can Lina not provide an arrival time?",
          "l’alternative n’a pas été confirmée",
          [
            "l’alternative n’a pas été confirmée",
            "elle a perdu son téléphone",
            "elle refuse de voyager"
          ],
          "The coach has neither confirmed capacity nor a reserved place for Lina."
        ],
        [
          "Which distinction organizes the reading?",
          "avertissement, annulation, possibilité",
          [
            "réservation, paiement, remboursement",
            "avertissement, annulation, possibilité",
            "billet, repas, hôtel"
          ],
          "The three stages progress from risk to fact to a possible but unconfirmed solution."
        ]
      ]
    },
    "listening": [
      [
        "What did the previous day's message say?",
        "un risque de modification",
        [
          "une réservation d’autocar",
          "un risque de modification",
          "une arrivée garantie"
        ],
        "The earlier warning was about possible change, not definite cancellation."
      ],
      [
        "What will Lina do after an alternative is confirmed?",
        "rappeler Hugo",
        [
          "rappeler Hugo",
          "acheter une valise",
          "annuler son téléphone"
        ],
        "She promises to call Hugo after receiving confirmed details."
      ]
    ],
    "oral": {
      "prompt": "Give a one-minute chronological travel update, making the three statuses explicit.",
      "plan": [
        "Explain the earlier possible warning.",
        "State the later confirmed cancellation.",
        "Describe the still-unconfirmed replacement and next contact."
      ],
      "model": "Hier, la compagnie avait signalé un risque de changement, mais mon horaire n’avait pas encore été modifié. Aujourd’hui, le train a finalement été annulé vingt minutes avant le départ. Je suis encore à la gare. Un agent envisage un autocar, mais je n’ai aucune place confirmée et je ne peux pas donner une heure d’arrivée fiable. Je rappellerai la personne qui m’attend dès que le transporteur m’aura communiqué une solution officielle."
    }
  },
  {
    "id": "b1-34",
    "title": "Interpret an interview and report it accurately",
    "goal": "Distinguish a quotation, a reported view and a hypothesis in a spoken interview.",
    "grammarIds": [],
    "grammar": [
      [
        "Speech attribution and reported clauses",
        "Il a déclaré que introduces indirect reported speech, while d’après l’interview ... identifies a source. The viewpoint may shift when the report is anchored in the past: elle a dit qu’elle viendrait le lendemain. A journalist's question is not the interviewee's opinion; separate the asked premise from the answer. Preserve the distinction between a direct quote and an interpretive summary.",
        [
          [
            "Elle a dit qu’elle reviendrait le lendemain.",
            "She said she would return the following day."
          ],
          [
            "Selon l’interview, aucune date n’est encore décidée.",
            "According to the interview, no date has yet been decided."
          ]
        ],
        [
          "Le journaliste demande si le projet est utile, donc l’invitée affirme qu’il l’est.",
          "Le journaliste demande si le projet est utile; l’invitée n’a pas encore répondu.",
          "A question is not a statement made by the interviewee."
        ]
      ],
      [
        "Reported reservations and conditional claims",
        "Pourrait in an answer expresses a possibility; il faudra vérifier names a necessary step. When paraphrasing, retain markers like selon elle and à condition de, rather than transforming a potential benefit into certain success. Si the reporting verb is in past, indirect future often becomes conditional: elle a expliqué que la décision viendrait plus tard.",
        [
          [
            "Elle a expliqué que le projet pourrait commencer en hiver.",
            "She explained that the project might start in winter."
          ],
          [
            "Ce serait possible à condition de trouver des bénévoles.",
            "It would be possible provided volunteers were found."
          ]
        ],
        [
          "Elle a dit que cela pourrait marcher, donc cela marchera.",
          "Elle a dit que cela pourrait marcher, sous certaines conditions.",
          "The conditional cannot be restated as an unconditional prediction."
        ]
      ]
    ],
    "vocabulary": [
      [
        "une interview",
        "interview",
        "L’interview contient cinq réponses."
      ],
      [
        "une citation",
        "quotation",
        "La citation doit rester fidèle."
      ],
      [
        "un propos",
        "statement",
        "Je rapporte son propos."
      ],
      [
        "d’après",
        "according to",
        "D’après la responsable, rien n’est confirmé."
      ],
      [
        "selon elle",
        "in her view",
        "Selon elle, un essai serait utile."
      ],
      [
        "une réserve",
        "caveat",
        "La réserve concerne le budget."
      ],
      [
        "une hypothèse",
        "hypothesis",
        "L’hypothèse reste à vérifier."
      ],
      [
        "affirmer",
        "state firmly",
        "Elle n’a pas affirmé une date."
      ],
      [
        "préciser",
        "clarify",
        "Elle précise les conditions."
      ],
      [
        "un financement",
        "funding",
        "Le financement manque encore."
      ],
      [
        "un titre",
        "headline",
        "Le titre simplifie la réponse."
      ],
      [
        "une réponse",
        "answer",
        "Sa réponse nuance la question."
      ]
    ],
    "dialogue": [
      [
        "Journaliste",
        "Vous présentez une nouvelle initiative pour le centre; pouvons-nous dire qu’elle sera lancée dès janvier avec le soutien de tous les habitants ?",
        "Can we say the initiative launches in January with support from all residents?"
      ],
      [
        "Responsable",
        "Non, cela serait trop affirmatif; plusieurs personnes sont intéressées, mais nous devons encore consulter les autres et vérifier le financement.",
        "No, that's too firm; several are interested, but consultation and funding checks remain."
      ],
      [
        "Journaliste",
        "Si je comprends bien, vous voyez une possibilité intéressante, mais vous ne considérez ni le calendrier ni le budget comme définitifs.",
        "So you see an interesting possibility but neither timing nor budget as final?"
      ],
      [
        "Responsable",
        "Exactement; le projet pourrait commencer en janvier si les ressources sont disponibles, mais aucune décision officielle n’a encore été prise.",
        "Exactly; January might work if resources exist, but no official decision has been taken."
      ],
      [
        "Journaliste",
        "Je conserverai donc le conditionnel dans l’article et distinguerai les soutiens exprimés des avis que nous n’avons pas encore recueillis.",
        "I'll retain conditional phrasing and distinguish expressed support from views not yet collected."
      ]
    ],
    "tasks": [
      [
        "fill",
        "___ la responsable, aucune date officielle n’est fixée.",
        "Selon",
        "Selon identifies the source of a claim instead of presenting it as independent fact.",
        [],
        "attribution"
      ],
      [
        "choice",
        "What does pourrait commencer mean?",
        "a conditional possibility",
        "Pourrait expresses possibility dependent on resources, not an approved launch.",
        [
          "a guaranteed launch",
          "a conditional possibility",
          "a past cancellation"
        ],
        "modality"
      ],
      [
        "reading",
        "Which assumption in the journalist's first question is unsupported?",
        "le soutien de tous les habitants",
        "The manager says only several people expressed interest.",
        [
          "la réunion existe",
          "le soutien de tous les habitants",
          "il y a un centre"
        ],
        "question premise"
      ],
      [
        "fill",
        "Le projet ___ commencer en janvier, sous conditions.",
        "pourrait",
        "The conditional might happen if resources become available.",
        [],
        "conditional"
      ],
      [
        "choice",
        "Which is a faithful summary?",
        "La date et le budget restent incertains.",
        "The manager explicitly says both are not definitive.",
        [
          "Le projet est approuvé.",
          "La date et le budget restent incertains.",
          "Tous les habitants ont voté oui."
        ],
        "summary"
      ],
      [
        "order",
        "Arrange: à vérifier / Le financement reste",
        "Le financement reste à vérifier",
        "The sentence describes a still-pending resource check.",
        [
          "à vérifier",
          "Le financement reste"
        ],
        "word order"
      ],
      [
        "fill",
        "Une ___ exacte ne doit pas inventer d’accord.",
        "citation",
        "Citation means an exact quotation and should not be altered to imply agreement.",
        [],
        "journalism"
      ],
      [
        "reading",
        "What will the journalist preserve in the article?",
        "le conditionnel",
        "She explicitly says she will keep conditional wording to maintain nuance.",
        [
          "le conditionnel",
          "une date imposée",
          "un budget inventé"
        ],
        "source nuance"
      ],
      [
        "choice",
        "What is a question in the interview?",
        "the journalist's request for information",
        "The question's assumption is not automatically the interviewee's assertion.",
        [
          "the interviewee's confirmed decision",
          "the journalist's request for information",
          "a financial record"
        ],
        "reporting"
      ],
      [
        "fill",
        "La responsable a ___ que les ressources restaient incertaines.",
        "précisé",
        "Précisé introduces a clarification made by the official.",
        [],
        "reported speech"
      ]
    ],
    "writing": [
      "Write a concise news-style interview summary with two attributed facts, one reported uncertainty and no fabricated quotation.",
      [
        "Distinguish the journalist's question from the manager's actual response.",
        "Preserve conditional or tentative statements as such.",
        "Explain what consultation or funding information remains missing."
      ],
      "Dans une interview, la responsable du centre a présenté un projet qui pourrait démarrer en janvier. Elle a cependant précisé qu’aucune décision officielle n’avait encore été prise. Selon elle, plusieurs habitants ont exprimé un intérêt, mais une consultation plus large reste nécessaire. La date envisagée dépendra aussi du financement disponible. Le journaliste avait demandé si tous les habitants soutenaient déjà le projet; la responsable n’a pas confirmé cette hypothèse. L’article devra donc présenter janvier comme une possibilité et non comme une promesse."
    ],
    "reading": {
      "title": "Un titre trop certain pour une décision incertaine",
      "paragraphs": [
        "Une journaliste prépare un article sur une initiative locale destinée à prolonger les horaires d'un centre de quartier. Pendant l'interview, elle demande à la responsable si le projet commencera dès janvier et si tous les habitants le soutiennent. La responsable répond que plusieurs participants ont manifesté leur intérêt, mais qu'aucune enquête générale n'a encore été réalisée. Elle rappelle également que l'équipe doit vérifier son budget avant de proposer un calendrier. La formulation initiale de la question contient donc deux hypothèses non établies.",
        "Le lendemain, une première version de l'article porte le titre « Le centre ouvrira plus longtemps dès janvier ». En relisant le texte, la journaliste constate que ce titre ne correspond pas exactement aux propos recueillis. La responsable avait utilisé le conditionnel et ajouté plusieurs contraintes. Un début en janvier était présenté comme une possibilité dépendant des moyens disponibles. Le soutien exprimé par certains visiteurs ne pouvait pas non plus être attribué à l'ensemble de la population.",
        "La journaliste remplace alors son titre par une formulation plus prudente. Elle indique que le centre étudie une prolongation des horaires et qu'une décision sera communiquée après consultation et vérification du financement. Elle précise quelles informations sont déjà connues et lesquelles restent à obtenir. Son article conserve l'intérêt du projet sans annoncer un résultat qui n'existe pas encore. Cette précision aide les lecteurs à distinguer l'espoir, le plan et la décision."
      ],
      "questions": [
        [
          "Why is the first headline misleading?",
          "il transforme une possibilité en certitude",
          [
            "il manque le nom de la ville",
            "il transforme une possibilité en certitude",
            "il contient un chiffre"
          ],
          "The source only suggests January conditionally, not as an official launch."
        ],
        [
          "What is the actual status of residents' support?",
          "certains ont exprimé leur intérêt",
          [
            "tous ont approuvé",
            "certains ont exprimé leur intérêt",
            "personne n’a été consulté"
          ],
          "Several expressions of interest are reported; the wider population was not surveyed."
        ],
        [
          "Which editorial change best protects fidelity?",
          "garder les conditions et l’incertitude",
          [
            "garder les conditions et l’incertitude",
            "supprimer les réserves",
            "ajouter une citation inventée"
          ],
          "Faithful reporting retains the conditions in the interviewee's answer."
        ]
      ]
    },
    "listening": [
      [
        "What condition could allow a January start?",
        "des ressources disponibles",
        [
          "des ressources disponibles",
          "un accord déjà signé",
          "une nouvelle salle gratuite"
        ],
        "The manager says January is possible only if resources are available."
      ],
      [
        "What will the journalist keep in the article?",
        "le conditionnel",
        [
          "le conditionnel",
          "une date garantie",
          "un nombre de visiteurs inventé"
        ],
        "She promises to retain conditional language rather than assert a confirmed opening."
      ]
    ],
    "oral": {
      "prompt": "Summarize the interview orally in 60–90 seconds, separating the reporter's assumptions from the manager's confirmed statements.",
      "plan": [
        "Identify the question's two assumptions.",
        "Explain what the official actually stated and what remains to verify.",
        "Give a truthful short headline using conditional wording."
      ],
      "model": "La journaliste a demandé si le projet commencerait dès janvier avec l’accord de tous les habitants. La responsable a répondu que plusieurs personnes étaient intéressées, mais que les autres devaient encore être consultées. Elle a aussi expliqué que le financement restait à vérifier. Un lancement en janvier serait possible seulement si les moyens nécessaires étaient disponibles. Aucun accord officiel n’a donc été annoncé. Un titre plus fidèle serait : « Le centre étudie une prolongation des horaires sous certaines conditions »."
    }
  },
  {
    "id": "b1-35",
    "title": "Tell a personal experience with reflection",
    "goal": "Build a coherent spoken narrative with prior preparations, turning point, emotion and lesson.",
    "grammarIds": [],
    "grammar": [
      [
        "Narrative aspect and turning points",
        "Imparfait describes the background (il faisait froid, nous attendions), passé composé presents bounded events (le guide est arrivé), and plus-que-parfait sets an earlier preparation (nous avions réservé). Tout à coup signals a turning point, while finalement gives the outcome. The choice of tense depends on the event's place in the story, not a memorized adverb-to-tense table.",
        [
          [
            "Nous attendions quand le guide est arrivé.",
            "We were waiting when the guide arrived."
          ],
          [
            "J’avais vérifié les horaires avant de partir.",
            "I had checked the times before leaving."
          ]
        ],
        [
          "Je suis attendu lorsque le guide arrivait soudain.",
          "J’attendais lorsque le guide est arrivé soudainement.",
          "The ongoing wait uses imperfect; the arrival is a completed event."
        ]
      ],
      [
        "Reflection rather than unsupported lessons",
        "Cela m’a appris à + infinitive introduces a personal takeaway; j’ai compris que may describe a realization. Do not turn one episode into an assertion about every service or person. A balanced story includes one choice that turned out well and one remaining limitation; explain what you would do differently rather than assigning blame without evidence.",
        [
          [
            "Cette expérience m’a appris à garder une solution de rechange.",
            "This taught me to keep a backup plan."
          ],
          [
            "Je ne peux pas conclure que tous les guides sont en retard.",
            "I cannot conclude that all guides are late."
          ]
        ],
        [
          "Un guide a tardé, donc tous les guides sont peu fiables.",
          "Un guide est arrivé en retard; je vérifierai les prochaines informations.",
          "A single incident does not justify judging everyone."
        ]
      ]
    ],
    "vocabulary": [
      [
        "un souvenir",
        "memory",
        "Ce souvenir reste marquant."
      ],
      [
        "un tournant",
        "turning point",
        "Ce moment a été un tournant."
      ],
      [
        "tout à coup",
        "suddenly",
        "Tout à coup, la pluie a commencé."
      ],
      [
        "auparavant",
        "previously",
        "Auparavant, nous avions réservé."
      ],
      [
        "finalement",
        "eventually",
        "Finalement, nous sommes rentrés."
      ],
      [
        "une impression",
        "impression",
        "Mon impression a changé."
      ],
      [
        "un imprévu",
        "unexpected event",
        "Un imprévu a modifié le programme."
      ],
      [
        "réagir",
        "react",
        "Nous avons réagi calmement."
      ],
      [
        "un regret",
        "regret",
        "J’ai un petit regret."
      ],
      [
        "retenir",
        "retain/remember",
        "Je retiens une leçon simple."
      ],
      [
        "un détail",
        "detail",
        "Ce détail était important."
      ],
      [
        "une solution de rechange",
        "backup option",
        "Gardons une solution de rechange."
      ]
    ],
    "dialogue": [
      [
        "Ariane",
        "Samedi, nous voulions visiter un petit village; nous avions réservé un guide et préparé notre parcours bien avant le départ.",
        "Saturday we wanted to visit a village; we'd booked a guide and planned the route in advance."
      ],
      [
        "Mehdi",
        "Comment la journée s’est-elle déroulée lorsque vous êtes arrivés au point de rendez-vous et que le groupe a commencé à attendre ?",
        "What happened when you reached the meeting point and the group began waiting?"
      ],
      [
        "Ariane",
        "Il faisait très froid et nous attendions depuis vingt minutes quand un message nous a annoncé que le guide serait retardé.",
        "It was cold and we'd waited twenty minutes when a message said the guide would be late."
      ],
      [
        "Mehdi",
        "Avez-vous dû annuler toute la visite, ou avez-vous trouvé une autre activité qui permettait de profiter quand même de la journée ?",
        "Did you cancel everything, or find another way to enjoy the day?"
      ],
      [
        "Ariane",
        "Finalement, nous avons commencé par le musée; cette expérience m’a appris à prévoir une solution de rechange sans généraliser à tous les guides.",
        "We started at the museum; the experience taught me to keep a backup without judging every guide."
      ]
    ],
    "tasks": [
      [
        "fill",
        "Il ___ froid pendant que nous attendions. (faire, imperfect)",
        "faisait",
        "Imparfait provides the ongoing background weather.",
        [],
        "imparfait"
      ],
      [
        "choice",
        "Which activity happened before the day's events?",
        "ils avaient réservé un guide",
        "Plus-que-parfait describes the earlier guide booking.",
        [
          "le message est arrivé",
          "ils avaient réservé un guide",
          "ils ont visité le musée"
        ],
        "past ordering"
      ],
      [
        "reading",
        "What interrupted the original plan?",
        "un retard du guide",
        "Ariane says a message announced the guide would be late.",
        [
          "un retard du guide",
          "la fermeture du musée",
          "une panne de voiture"
        ],
        "turning point"
      ],
      [
        "fill",
        "Tout à coup, un message nous a ___ le retard. (annoncer)",
        "annoncé",
        "The past participle annoncé describes a completed announcement.",
        [],
        "past tense"
      ],
      [
        "choice",
        "Which introduces the eventual outcome?",
        "finalement",
        "Finalement connects the final route to earlier disruption.",
        [
          "auparavant",
          "finalement",
          "pendant que"
        ],
        "narrative marker"
      ],
      [
        "order",
        "Arrange: une solution de rechange / Nous avons trouvé",
        "Nous avons trouvé une solution de rechange",
        "Passé composé advances the concrete response to the problem.",
        [
          "une solution de rechange",
          "Nous avons trouvé"
        ],
        "sentence order"
      ],
      [
        "fill",
        "Cette journée m’a ___ à mieux prévoir. (apprendre)",
        "appris",
        "Appris is the irregular past participle of apprendre.",
        [],
        "reflection"
      ],
      [
        "reading",
        "What did the group do instead of cancelling?",
        "visiter le musée d’abord",
        "They started with the museum while waiting for the delayed guide.",
        [
          "rentrer immédiatement",
          "visiter le musée d’abord",
          "acheter une voiture"
        ],
        "response"
      ],
      [
        "choice",
        "Which conclusion is proportionate?",
        "Je préparerai une autre activité la prochaine fois.",
        "It translates one experience into a personal planning choice without unsupported generalization.",
        [
          "Tous les guides sont en retard.",
          "Je préparerai une autre activité la prochaine fois.",
          "Aucun guide ne mérite confiance."
        ],
        "evidence-bound reflection"
      ],
      [
        "fill",
        "Nous avions ___ notre parcours avant le départ. (préparer)",
        "préparé",
        "Plus-que-parfait uses avais/avions plus the past participle préparé.",
        [],
        "pluperfect"
      ]
    ],
    "writing": [
      "Write a ten-sentence personal experience narrative with three tense layers and a realistic reflection.",
      [
        "Set the scene in imparfait and use plus-que-parfait for an earlier plan.",
        "Describe the unexpected event and your response in passé composé.",
        "End with one credible lesson rather than a universal accusation."
      ],
      "Samedi, nous voulions visiter un village avec un guide. Nous avions réservé notre place et préparé un parcours. Le matin, il faisait froid et nous attendions au point de rendez-vous. Après vingt minutes, nous avons reçu un message annonçant un retard. Nous étions déçus, mais le musée voisin était ouvert. Nous avons donc commencé la journée par cette visite. Plus tard, le guide nous a retrouvés et nous avons repris le programme. Finalement, la journée a été différente de nos attentes. Cette expérience m’a appris à préparer une solution de rechange. Je ne crois pas qu’un seul retard permette de juger tous les guides."
    ],
    "reading": {
      "title": "Une promenade transformée en bonne surprise",
      "paragraphs": [
        "Ariane organise une excursion avec trois amis. Plusieurs semaines auparavant, elle avait réservé une visite guidée d'un village historique et avait étudié les transports nécessaires. Elle voulait arriver tôt pour profiter de l'après-midi. Le matin du départ, il faisait froid, mais le ciel était clair. Le groupe atteint le point de rendez-vous avec un peu d'avance. Tout semble se dérouler comme prévu, jusqu'au moment où l'heure annoncée passe sans que le guide apparaisse.",
        "Pendant que les visiteurs attendent, un message explique que le guide arrivera plus tard à cause d'un problème d'organisation. Personne ne sait encore combien de temps le retard durera. Deux personnes proposent de rentrer; Ariane remarque cependant que le petit musée voisin est ouvert. Le groupe décide d'y entrer plutôt que d'attendre dehors. Au musée, les amis découvrent une exposition qui complète le thème de leur promenade. Ils profitent finalement de cette activité inattendue.",
        "Lorsque le guide arrive, le groupe peut reprendre une partie de la visite prévue. Tout le programme n'est pas réalisé, mais les amis sont satisfaits d'avoir trouvé une solution utile. En racontant l'expérience, Ariane distingue son attente initiale, le retard réellement annoncé et la décision prise sur place. Elle ajoute qu'un incident ne suffit pas à juger la qualité de tous les guides. La prochaine fois, elle prévoira une activité de rechange et vérifiera comment recevoir les dernières informations."
      ],
      "questions": [
        [
          "Which event was completed before the excursion?",
          "la réservation du guide",
          [
            "la visite du musée",
            "la réservation du guide",
            "le message de retard"
          ],
          "The guide was booked weeks before the day of the trip."
        ],
        [
          "Why was the museum a reasonable alternative?",
          "il était ouvert et lié au sujet de la visite",
          [
            "il était ouvert et lié au sujet de la visite",
            "il garantissait un remboursement",
            "il remplaçait tous les guides"
          ],
          "The available museum helped the group spend waiting time on a relevant activity."
        ],
        [
          "What is the supported reflection?",
          "prévoir une activité alternative",
          [
            "ne plus jamais voyager",
            "prévoir une activité alternative",
            "accuser tous les guides"
          ],
          "Ariane learns to make contingency plans rather than generalize from one delay."
        ]
      ]
    },
    "listening": [
      [
        "Which activity did Ariane plan before leaving?",
        "une visite guidée",
        [
          "un cours de cuisine",
          "une visite guidée",
          "une réunion de travail"
        ],
        "Ariane booked a guide and prepared the itinerary in advance."
      ],
      [
        "Where did the group go during the delay?",
        "au musée",
        [
          "au restaurant",
          "au musée",
          "à la gare"
        ],
        "Ariane says the group visited the museum instead of cancelling all activities."
      ]
    ],
    "oral": {
      "prompt": "Narrate the excursion aloud using the background, earlier preparation, disruption, response and reflection.",
      "plan": [
        "Set the scene and earlier booking using past tenses.",
        "Identify the unexpected delay and substitute activity.",
        "Explain one limited lesson based on this experience."
      ],
      "model": "Nous avions organisé une visite guidée d’un village plusieurs semaines avant le départ. Le matin, il faisait froid et nous attendions tranquillement notre guide. Puis nous avons reçu un message annonçant un retard. Plutôt que de rentrer, nous avons décidé de visiter un musée voisin. Finalement, le guide est arrivé et nous avons pu continuer une partie de la promenade. Cette journée m’a appris à préparer une activité de rechange, mais elle ne prouve rien sur la fiabilité des autres guides."
    }
  },
  {
    "id": "b1-36",
    "title": "Compare housing choices for different people",
    "goal": "Recommend a housing option by weighing price, transport, light and personal constraints.",
    "grammarIds": [],
    "grammar": [
      [
        "Comparison with explicit criteria",
        "Plus ... que, moins ... que and aussi ... que compare qualities, while autant de + noun expresses equal quantities. Meilleur agrees with the noun, whereas mieux compares how something works. In a housing discussion, an apartment can be cheaper but farther away; an accurate recommendation needs to name the criterion and whose needs are being considered.",
        [
          [
            "Le studio est moins cher que le grand appartement.",
            "The studio is cheaper than the larger apartment."
          ],
          [
            "Cet appartement reçoit autant de lumière que l’autre.",
            "This apartment gets as much light as the other."
          ]
        ],
        [
          "Il est plus meilleur et mieux prix.",
          "Il a un meilleur rapport qualité-prix.",
          "Meilleur is an adjective, while mieux modifies verbs; the original combination is not idiomatic."
        ]
      ],
      [
        "Conditional recommendations and relative descriptions",
        "Pour quelqu’un qui travaille tard, ... describes a relevant user rather than a universal preference. The relative où identifies a location, and dont expresses a verb or noun taking de: le quartier dont je parle. Si + present followed by futur can state an actionable decision condition. Good comparisons distinguish fixed details (rent, transport stops) from unverifiable claims about a neighborhood.",
        [
          [
            "C’est le quartier où se trouve la gare.",
            "It is the neighborhood where the station is located."
          ],
          [
            "Si le loyer reste dans mon budget, je choisirai le studio.",
            "If rent stays within budget, I will choose the studio."
          ]
        ],
        [
          "Le quartier que je parle est calme.",
          "Le quartier dont je parle est calme.",
          "Parler de takes dont, not object relative que."
        ]
      ]
    ],
    "vocabulary": [
      [
        "un loyer",
        "rent",
        "Le loyer dépasse mon budget."
      ],
      [
        "une caution",
        "deposit",
        "La caution doit être vérifiée."
      ],
      [
        "un trajet",
        "commute",
        "Le trajet prend trente minutes."
      ],
      [
        "un voisinage",
        "neighborhood",
        "Le voisinage semble calme."
      ],
      [
        "une annonce",
        "listing",
        "L’annonce mentionne les charges."
      ],
      [
        "les charges",
        "utilities/fees",
        "Les charges ne sont pas incluses."
      ],
      [
        "lumineux",
        "bright",
        "Cet appartement est lumineux."
      ],
      [
        "un balcon",
        "balcony",
        "Le premier logement possède un balcon."
      ],
      [
        "un compromis",
        "trade-off",
        "Le choix demande un compromis."
      ],
      [
        "accessible",
        "accessible",
        "Le logement est accessible en bus."
      ],
      [
        "une distance",
        "distance",
        "La distance est importante."
      ],
      [
        "une préférence",
        "preference",
        "Ma préférence dépend du trajet."
      ]
    ],
    "dialogue": [
      [
        "Maya",
        "J’hésite entre deux appartements : le premier est moins cher, mais il se trouve assez loin de mon travail et du centre-ville.",
        "I'm choosing between two flats: the first is cheaper but far from work and downtown."
      ],
      [
        "Julien",
        "Le second coûte davantage, pourtant il est près de la gare et le trajet quotidien serait beaucoup plus court pour toi.",
        "The second costs more but is near the station and cuts your daily commute."
      ],
      [
        "Maya",
        "C’est vrai; en revanche, le premier est aussi lumineux que le second et les charges annoncées semblent moins élevées.",
        "True; the first is equally bright and its listed fees seem lower."
      ],
      [
        "Julien",
        "Tu devrais vérifier les charges exactes et les conditions de location avant de décider sur la seule base des photographies.",
        "You should verify actual fees and rental terms before deciding based on photos."
      ],
      [
        "Maya",
        "Je comparerai donc les coûts totaux et les trajets; si le deuxième reste dans mon budget, il pourrait mieux convenir à mes horaires.",
        "I'll compare total costs and commutes; if the second fits my budget it might suit my hours better."
      ]
    ],
    "tasks": [
      [
        "fill",
        "Le studio est moins cher ___ l’appartement.",
        "que",
        "Adjective comparatives link the two choices with que.",
        [],
        "comparison"
      ],
      [
        "choice",
        "Which housing option is closer to the train station?",
        "le deuxième",
        "Julien identifies the second apartment as being near the station.",
        [
          "le premier",
          "le deuxième",
          "aucun"
        ],
        "dialogue"
      ],
      [
        "reading",
        "What is not yet clear about the first apartment?",
        "les charges exactes",
        "Maya says listed fees appear lower, but Julien recommends checking them.",
        [
          "le nombre d’étages",
          "les charges exactes",
          "l’existence de fenêtres"
        ],
        "uncertainty"
      ],
      [
        "fill",
        "L’appartement ___ je parle est près de la gare.",
        "dont",
        "Parler de requires the relative dont.",
        [],
        "relative"
      ],
      [
        "choice",
        "Which statement is a meaningful conditional recommendation?",
        "Si le loyer convient, je choisirai le deuxième.",
        "It ties a decision to a confirmed budget constraint.",
        [
          "Le deuxième est parfait pour tous.",
          "Si le loyer convient, je choisirai le deuxième.",
          "Toute annonce dit la vérité."
        ],
        "condition"
      ],
      [
        "order",
        "Arrange: davantage de lumière / Le studio reçoit",
        "Le studio reçoit davantage de lumière",
        "Davantage de quantifies the noun lumière.",
        [
          "davantage de lumière",
          "Le studio reçoit"
        ],
        "syntax"
      ],
      [
        "fill",
        "Le ___ mensuel doit rester dans mon budget.",
        "loyer",
        "Loyer is regular rent, a relevant cost of housing.",
        [],
        "vocabulary"
      ],
      [
        "reading",
        "Why might the second suit Maya better despite its price?",
        "le trajet serait plus court",
        "A shorter daily commute matters to Maya's work schedule.",
        [
          "il est toujours gratuit",
          "le trajet serait plus court",
          "il est garanti sans charges"
        ],
        "interpretation"
      ],
      [
        "choice",
        "What does aussi lumineux que indicate?",
        "equal brightness",
        "Aussi ... que expresses the same degree of light, not superiority.",
        [
          "equal brightness",
          "higher rent",
          "longer commute"
        ],
        "equality"
      ],
      [
        "fill",
        "Il faut vérifier les ___ avant de signer.",
        "charges",
        "Charges are additional housing costs whose amount needs verification.",
        [],
        "practical vocabulary"
      ]
    ],
    "writing": [
      "Compare two fictional flats and recommend one for a commuter, stating an unresolved rental detail.",
      [
        "Use three distinct comparison forms accurately.",
        "Consider total rent/fees and travel time rather than one criterion.",
        "Make the recommendation conditional on a checkable constraint."
      ],
      "Je compare deux logements pour une personne qui travaille près de la gare. Le premier studio est moins cher et aussi lumineux que le second, mais il se trouve plus loin du lieu de travail. Le deuxième appartement coûte davantage, pourtant son trajet quotidien serait plus court. Les charges exactes des deux annonces restent à confirmer, et il faut aussi étudier les conditions de location. Si le deuxième logement reste dans le budget total, je le recommanderais à cette personne. Pour quelqu’un qui travaille surtout à domicile, le premier pourrait au contraire mieux convenir."
    ],
    "reading": {
      "title": "Un appartement idéal pour qui ?",
      "paragraphs": [
        "Maya cherche un logement parce que son trajet actuel jusqu'au travail est long. Elle visite deux appartements le même samedi. Le premier studio coûte moins cher et possède une grande fenêtre; il est cependant situé dans un quartier éloigné de la gare. Le second appartement est plus petit, mais il se trouve à quelques minutes des transports. Les deux propriétaires présentent leurs logements comme très pratiques, sans connaître exactement les besoins de Maya.",
        "Après les visites, Maya compare les annonces avec Julien. Ils examinent le loyer, les charges, la luminosité et surtout la durée du trajet. Le studio coûte moins cher, mais les déplacements quotidiens pourraient prendre davantage de temps et d'argent. Le second appartement semble plus adapté à ses horaires professionnels, à condition que les frais supplémentaires restent raisonnables. Certains montants ne figurent pas clairement dans les annonces, ce qui empêche toute décision ferme.",
        "Maya décide de demander les charges exactes et les conditions du contrat avant de faire son choix. Elle note qu'une autre personne pourrait préférer le studio moins cher, par exemple si elle travaillait toujours à domicile. Sa comparaison ne cherche donc pas à désigner un meilleur logement dans toutes les situations. Elle explique plutôt quel logement conviendrait mieux à ses propres contraintes et quelles informations doivent encore être vérifiées."
      ],
      "questions": [
        [
          "Which criterion especially matters for Maya?",
          "la durée du trajet",
          [
            "la durée du trajet",
            "la couleur des murs",
            "le nom du propriétaire"
          ],
          "Her reason for moving is to reduce a long commute."
        ],
        [
          "Why can't she make a final choice immediately?",
          "certains frais ne sont pas précisés",
          [
            "certains frais ne sont pas précisés",
            "elle n’aime aucune fenêtre",
            "les logements sont occupés"
          ],
          "Missing fee and contract details affect total cost and suitability."
        ],
        [
          "What broader idea does the passage support?",
          "le meilleur choix dépend des besoins",
          [
            "le studio moins cher convient toujours",
            "le meilleur choix dépend des besoins",
            "il faut toujours habiter en centre-ville"
          ],
          "Maya acknowledges another person with different commuting needs could prefer the other property."
        ]
      ]
    },
    "listening": [
      [
        "Which apartment is less expensive?",
        "le premier",
        [
          "le premier",
          "le deuxième",
          "les deux"
        ],
        "Maya explicitly states the first flat is less expensive but located farther from her work."
      ],
      [
        "What must Maya verify before deciding?",
        "les charges exactes",
        [
          "les charges exactes",
          "le numéro de téléphone de Julien",
          "la météo"
        ],
        "Julien tells her to check the actual charges and rental conditions."
      ]
    ],
    "oral": {
      "prompt": "Give a short spoken housing recommendation to Maya, comparing both options with one caveat.",
      "plan": [
        "Compare price and transport for both apartments.",
        "Identify Maya's daily work constraint.",
        "State which fees must be checked before a choice can be final."
      ],
      "model": "Le premier appartement est moins cher et assez lumineux, mais il est éloigné de la gare. Le deuxième coûte davantage, toutefois le trajet jusqu’au travail serait plus court pour Maya. Comme elle veut réduire ses déplacements quotidiens, je lui recommanderais plutôt le second, à condition que le loyer et les charges restent dans son budget. Il faudrait vérifier ces frais avant de signer le contrat. Pour une autre personne qui travaille à domicile, le premier logement pourrait être préférable."
    }
  }
];
export const U12_LESSONS_33_36=Object.freeze(authored.map((spec,i)=>authorU12Lesson(spec,i+33)));
