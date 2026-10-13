import {authorU12Lesson,type U12AuthoredLesson} from './u12-model.ts';
const authored:readonly U12AuthoredLesson[]=[
  {
    "id": "b1-37",
    "title": "Discuss learning plans and recommend study changes",
    "goal": "Listen to learning difficulties and make a realistic conditional recommendation.",
    "grammarIds": [],
    "grammar": [
      [
        "Advice with conditional and purpose",
        "Tu pourrais or tu devrais followed by infinitive offers advice, with devrais somewhat stronger. Pour + infinitive explains a purpose with the same actor; pour que + subjunctive identifies an intended result for another person: je répète pour que tu comprennes. A plan should specify time, material and a way to observe improvement, not declare instant mastery.",
        [
          [
            "Tu pourrais revoir trois expressions chaque matin.",
            "You could review three expressions every morning."
          ],
          [
            "Je parle plus lentement pour que tu comprennes mieux.",
            "I speak more slowly so you can understand better."
          ]
        ],
        [
          "Tu devrais révises cette leçon.",
          "Tu devrais réviser cette leçon.",
          "After conditional devrais, the following action is infinitive."
        ]
      ],
      [
        "Conditional habit and realistic feedback",
        "Si tu consacres dix minutes par jour à la lecture, tu progresseras probablement, but no short routine guarantees a level. Il vaut mieux followed by infinitive suggests a useful option; plutôt que de introduces an alternative not taken. When recommending a learning strategy, acknowledge actual constraints and choose a specific activity that can be repeated and checked.",
        [
          [
            "Si tu lis régulièrement, tu comprendras davantage de textes.",
            "If you read regularly, you will understand more texts."
          ],
          [
            "Il vaut mieux vérifier tes erreurs plutôt que de relire passivement.",
            "It is better to check mistakes rather than reread passively."
          ]
        ],
        [
          "Si tu liras dix minutes, tu maîtriseras tout.",
          "Si tu lis régulièrement, tu pourras observer tes progrès.",
          "A real si clause uses present; learning outcomes cannot be guaranteed."
        ]
      ]
    ],
    "vocabulary": [
      [
        "une habitude",
        "habit",
        "Je construis une habitude de lecture."
      ],
      [
        "un objectif",
        "goal",
        "Mon objectif est de comprendre un dialogue."
      ],
      [
        "une difficulté",
        "difficulty",
        "J’ai une difficulté avec les temps."
      ],
      [
        "une stratégie",
        "strategy",
        "Cette stratégie m’aide à réviser."
      ],
      [
        "une révision",
        "review",
        "Je fais une courte révision."
      ],
      [
        "une erreur",
        "error",
        "Je corrige mes erreurs."
      ],
      [
        "un progrès",
        "progress",
        "Je constate un progrès limité."
      ],
      [
        "régulièrement",
        "regularly",
        "Je lis régulièrement."
      ],
      [
        "pratiquer",
        "practice",
        "Je pratique l’écoute."
      ],
      [
        "un retour",
        "feedback",
        "Je demande un retour sur mon texte."
      ],
      [
        "un effort",
        "effort",
        "Cet effort demande du temps."
      ],
      [
        "autonome",
        "independent",
        "Je veux apprendre de manière autonome."
      ]
    ],
    "dialogue": [
      [
        "Anna",
        "Je comprends les règles pendant le cours, mais je les oublie quand je dois raconter une expérience sans regarder mon cahier.",
        "I understand rules in class, but forget them when narrating without notes."
      ],
      [
        "Bilal",
        "Tu pourrais revoir quelques phrases chaque matin, puis essayer de raconter le même événement avec tes propres mots.",
        "You could review a few sentences each morning, then retell the event in your words."
      ],
      [
        "Anna",
        "Cela paraît possible, mais je ne dispose que de vingt minutes par jour et je préfère travailler aussi la compréhension orale.",
        "That sounds possible, but I have only twenty minutes daily and also want listening practice."
      ],
      [
        "Bilal",
        "Alors, consacrons dix minutes à écouter un dialogue et les dix autres à le résumer, pour que tu relies l’écoute à l’expression.",
        "Then use ten minutes listening and ten summarizing so comprehension connects with expression."
      ],
      [
        "Anna",
        "Je vais essayer cette méthode une semaine et noter mes erreurs avant de décider si elle m’aide réellement à progresser.",
        "I'll try it for a week and log errors before deciding if it helps."
      ]
    ],
    "tasks": [
      [
        "fill",
        "Tu pourrais ___ quelques phrases chaque jour.",
        "revoir",
        "Conditional pourrais takes an infinitive after it.",
        [],
        "advice"
      ],
      [
        "choice",
        "How much time does Anna have daily?",
        "vingt minutes",
        "Anna explicitly states her available daily study time.",
        [
          "dix minutes",
          "vingt minutes",
          "une heure"
        ],
        "listening detail"
      ],
      [
        "reading",
        "What two skills does Bilal connect?",
        "écoute et expression",
        "He proposes listening followed by oral or written summary.",
        [
          "calcul et dessin",
          "écoute et expression",
          "grammaire et sport"
        ],
        "transfer"
      ],
      [
        "fill",
        "Pour que tu ___ mieux, je vais répéter. (comprendre)",
        "comprennes",
        "Pour que with a changed actor takes the subjunctive comprennes.",
        [],
        "purpose clause"
      ],
      [
        "choice",
        "Which plan is most verifiable?",
        "essayer une semaine et noter ses erreurs",
        "This supplies a repeatable activity and an observable feedback mechanism.",
        [
          "garantir B1 demain",
          "essayer une semaine et noter ses erreurs",
          "relire sans rien vérifier"
        ],
        "study design"
      ],
      [
        "order",
        "Arrange: mes erreurs / Je noterai",
        "Je noterai mes erreurs",
        "The learner records specific errors rather than claiming perfect mastery.",
        [
          "mes erreurs",
          "Je noterai"
        ],
        "word order"
      ],
      [
        "fill",
        "Il vaut mieux ___ tes réponses. (vérifier)",
        "vérifier",
        "Il vaut mieux takes an infinitive to express preferable action.",
        [],
        "advice"
      ],
      [
        "reading",
        "Why does Bilal propose two ten-minute blocks?",
        "respecter le temps d’Anna",
        "He adapts the plan to her twenty-minute limit.",
        [
          "respecter le temps d’Anna",
          "augmenter le temps à une heure",
          "éviter toute écoute"
        ],
        "practical inference"
      ],
      [
        "choice",
        "Which condition is grammatically correct?",
        "Si tu pratiques, tu progresseras.",
        "Present after si supports a real future condition.",
        [
          "Si tu pratiqueras, tu progresseras.",
          "Si tu pratiques, tu progresseras.",
          "Si tu pratiquerais, tu progresseras."
        ],
        "conditions"
      ],
      [
        "fill",
        "Je voudrais apprendre de façon ___.",
        "autonome",
        "Autonome describes self-directed learning with independent actions.",
        [],
        "lexicon"
      ]
    ],
    "writing": [
      "Write a realistic one-week study plan for a learner with twenty minutes per day.",
      [
        "Name the learner's actual constraints and one recurring difficulty.",
        "Divide the time into listening, recall and reflective production.",
        "Propose a practical way to judge progress without claiming guaranteed proficiency."
      ],
      "Pendant une semaine, je vais travailler le français pendant vingt minutes chaque jour. Je commencerai par écouter un dialogue court sans lire la transcription. Ensuite, je vérifierai deux ou trois mots difficiles et j’écouterai encore une fois. Pendant les dix dernières minutes, je résumerai le dialogue avec mes propres phrases. Je noterai les erreurs de temps et de vocabulaire que je remarque. Si une difficulté revient, je consacrerai une courte révision au point concerné. Après sept jours, je comparerai mes résumés pour voir ce qui s’est amélioré, sans prétendre avoir atteint un niveau officiel."
    ],
    "reading": {
      "title": "Un plan qui part des contraintes réelles",
      "paragraphs": [
        "Anna apprend le français depuis plusieurs mois et comprend souvent les explications données par son professeur. Pourtant, lorsqu'elle doit raconter une journée sans consulter ses notes, elle cherche ses mots et mélange les temps du passé. Elle aimerait lire davantage et écouter des conversations plus longues, mais son emploi du temps lui laisse seulement vingt minutes libres la plupart des jours. Un ami lui conseille d'étudier deux heures chaque soir. Anna refuse cette proposition, non parce qu'elle ne veut pas progresser, mais parce qu'elle ne pourrait pas maintenir ce rythme.",
        "Bilal écoute son problème et lui propose une activité plus courte. Elle pourra consacrer dix minutes à l'écoute d'un dialogue, puis dix minutes à un résumé personnel. L'objectif n'est pas de répéter mécaniquement chaque mot, mais d'essayer de reconstruire le sens sans aide. Bilal lui recommande aussi de noter ses erreurs les plus fréquentes afin de revoir les formes qui posent réellement problème. Il lui explique qu'une semaine de pratique ne garantit pas un résultat spectaculaire.",
        "Anna décide d'essayer ce programme pendant sept jours. Le premier soir, son résumé reste très court; le quatrième, elle réussit à exprimer deux idées avec davantage de précision. Elle remarque aussi qu'elle oublie souvent certains connecteurs. Plutôt que de conclure qu'elle maîtrise désormais le français, elle utilise ces observations pour choisir les prochains exercices. Son plan reste modeste, mais il peut être ajusté à partir d'informations concrètes sur ses difficultés et ses progrès."
      ],
      "questions": [
        [
          "Why is the two-hour plan unsuitable?",
          "Anna ne peut pas maintenir cet horaire",
          [
            "Anna ne peut pas maintenir cet horaire",
            "Anna n’aime pas le français",
            "le professeur l’interdit"
          ],
          "Her daily schedule allows only around twenty minutes."
        ],
        [
          "What makes the new plan adaptive?",
          "l’observation des erreurs récurrentes",
          [
            "le nombre de livres achetés",
            "l’observation des erreurs récurrentes",
            "une promesse de réussite"
          ],
          "She uses recurring errors to choose later practice."
        ],
        [
          "What can be inferred about the fourth day's progress?",
          "un progrès limité mais observable",
          [
            "une maîtrise officielle du B1",
            "un progrès limité mais observable",
            "l’absence totale d’erreurs"
          ],
          "Longer summaries show some progress, but do not establish formal proficiency."
        ]
      ]
    },
    "listening": [
      [
        "What does Anna forget during independent narration?",
        "les règles apprises en cours",
        [
          "les règles apprises en cours",
          "les noms de ses amis",
          "les horaires des trains"
        ],
        "She says she forgets rules when recounting experiences without notes."
      ],
      [
        "How long will Anna try Bilal's plan?",
        "une semaine",
        [
          "un mois",
          "une semaine",
          "un jour"
        ],
        "Anna agrees to experiment with the method for one week and track mistakes."
      ]
    ],
    "oral": {
      "prompt": "Offer a learner a one-minute oral study recommendation that respects a twenty-minute schedule.",
      "plan": [
        "Acknowledge the learner's difficulty and time limit.",
        "Recommend listening followed by recall and summary.",
        "Explain what evidence would show whether the approach is helping."
      ],
      "model": "Anna dispose de vingt minutes par jour et a du mal à raconter une expérience sans notes. Je lui conseillerais d’écouter un dialogue pendant dix minutes et d’utiliser le reste du temps pour en faire un résumé personnel. Cette activité permettrait de relier la compréhension à l’expression. Elle pourrait noter ses erreurs de grammaire et de vocabulaire. Après une semaine, elle comparerait ses résumés pour décider quels points demandent davantage de révision."
    }
  },
  {
    "id": "b1-38",
    "title": "Present a volunteer project and respond to questions",
    "goal": "Explain aims, responsibilities, resource limits and evaluation for a small community project.",
    "grammarIds": [],
    "grammar": [
      [
        "Purpose and allocating tasks",
        "Pour + infinitive states a goal with the same actor; pour que + subjunctive introduces a desired result involving another actor. Être chargé de + infinitive assigns responsibility, while se porter volontaire pour describes volunteering. An accountable plan distinguishes who has accepted a task from an open invitation that no one has yet answered.",
        [
          [
            "Sophie est chargée de contacter les bénévoles.",
            "Sophie is responsible for contacting the volunteers."
          ],
          [
            "Nous préparons un guide pour que chacun puisse participer.",
            "We prepare a guide so everyone can participate."
          ]
        ],
        [
          "Nous cherchons des bénévoles, donc Léa est chargée du matériel.",
          "Nous cherchons des bénévoles, mais personne n’est encore chargé du matériel.",
          "Recruiting volunteers does not establish who accepted responsibility."
        ]
      ],
      [
        "Criteria and evaluating a proposal",
        "À condition que plus subjunctive expresses a necessary condition: l’atelier aura lieu à condition que la salle soit disponible. Toutefois introduces a practical limitation. A project proposal should state a small measurable goal, costs or resources that still need checking, and an alternative if a requirement cannot be met. Reporting a trial as a success before it happened is a false conclusion.",
        [
          [
            "L’atelier aura lieu à condition que la salle soit libre.",
            "The workshop will take place provided the room is free."
          ],
          [
            "Nous demanderons un retour après la première séance.",
            "We will request feedback after the first session."
          ]
        ],
        [
          "À condition que le matériel est disponible, nous commençons.",
          "À condition que le matériel soit disponible, nous commencerons.",
          "À condition que normally takes subjunctive soit."
        ]
      ]
    ],
    "vocabulary": [
      [
        "un bénévole",
        "volunteer",
        "Le bénévole aide pendant l’atelier."
      ],
      [
        "une association",
        "association",
        "L’association organise une rencontre."
      ],
      [
        "un objectif",
        "goal",
        "Notre objectif est concret."
      ],
      [
        "une responsabilité",
        "responsibility",
        "Chaque tâche demande une responsabilité."
      ],
      [
        "être chargé de",
        "be responsible for",
        "Lucie est chargée des invitations."
      ],
      [
        "une ressource",
        "resource",
        "Nous devons vérifier les ressources."
      ],
      [
        "un budget",
        "budget",
        "Le budget reste à préciser."
      ],
      [
        "une séance",
        "session",
        "La première séance dure une heure."
      ],
      [
        "un retour",
        "feedback",
        "Nous demanderons un retour écrit."
      ],
      [
        "une inscription",
        "registration",
        "L’inscription est facultative."
      ],
      [
        "un essai",
        "trial",
        "Nous proposons un essai limité."
      ],
      [
        "une condition",
        "condition",
        "Une condition n’est pas encore remplie."
      ]
    ],
    "dialogue": [
      [
        "Sophie",
        "Je propose un petit atelier de conversation pour les nouveaux habitants, afin qu’ils puissent pratiquer le français dans une situation accueillante.",
        "I propose a small conversation workshop to help new residents practice French."
      ],
      [
        "Lucas",
        "L’objectif me paraît utile, mais savons-nous déjà qui animera les séances et quels moyens seront disponibles dans la salle ?",
        "The goal sounds useful, but do we know who will lead sessions and what resources are available?"
      ],
      [
        "Sophie",
        "J’ai accepté de préparer les thèmes, tandis que Marie vérifiera la salle; en revanche, personne n’a encore accepté de gérer les inscriptions.",
        "I accepted topic preparation and Marie will check the room; nobody owns registrations yet."
      ],
      [
        "Lucas",
        "Nous pourrions commencer par une séance d’essai, à condition que le matériel soit disponible et qu’un bénévole supplémentaire puisse aider.",
        "We could start with a trial if equipment and an additional volunteer are available."
      ],
      [
        "Sophie",
        "Je noterai ces conditions et demanderai aux participants un retour après l’essai, plutôt que d’annoncer dès aujourd’hui que le projet fonctionne.",
        "I'll record conditions and seek feedback after the trial instead of claiming success now."
      ]
    ],
    "tasks": [
      [
        "fill",
        "Nous préparons le guide pour que chacun ___ participer. (pouvoir)",
        "puisse",
        "Pour que introduces a desired outcome with subjunctive puisse.",
        [],
        "purpose"
      ],
      [
        "choice",
        "Which task has not yet been assigned?",
        "les inscriptions",
        "Sophie says no one has accepted registration responsibility.",
        [
          "la préparation des thèmes",
          "les inscriptions",
          "la vérification de la salle"
        ],
        "task ownership"
      ],
      [
        "reading",
        "Which condition affects the proposed trial?",
        "le matériel et un bénévole supplémentaire",
        "Lucas names both equipment and another volunteer as prerequisites.",
        [
          "le matériel et un bénévole supplémentaire",
          "un nouveau bus",
          "un programme officiel"
        ],
        "conditions"
      ],
      [
        "fill",
        "Marie est ___ de vérifier la salle.",
        "chargée",
        "Chargée agrees with feminine Marie in the responsibility expression.",
        [],
        "agreement"
      ],
      [
        "choice",
        "What would be premature?",
        "annoncer que le projet est réussi",
        "No trial has occurred and no feedback has been collected.",
        [
          "demander des bénévoles",
          "annoncer que le projet est réussi",
          "vérifier les ressources"
        ],
        "truthful reporting"
      ],
      [
        "order",
        "Arrange: une séance d’essai / Nous pourrions organiser",
        "Nous pourrions organiser une séance d’essai",
        "Conditional pourrais expresses a practical proposal, not an implemented event.",
        [
          "une séance d’essai",
          "Nous pourrions organiser"
        ],
        "syntax"
      ],
      [
        "fill",
        "L’atelier commencera à condition que la salle ___ libre.",
        "soit",
        "À condition que takes subjunctive soit to express the prerequisite.",
        [],
        "subjunctive"
      ],
      [
        "reading",
        "How will Sophie evaluate the workshop?",
        "demander un retour après l’essai",
        "She says feedback will follow the trial before calling it successful.",
        [
          "compter des affiches",
          "demander un retour après l’essai",
          "envoyer un certificat"
        ],
        "evaluation"
      ],
      [
        "choice",
        "Which is an assigned action?",
        "Sophie prépare les thèmes.",
        "Sophie clearly says she accepted this specific task.",
        [
          "Quelqu’un pourrait peut-être aider.",
          "Sophie prépare les thèmes.",
          "Nous chercherons une personne."
        ],
        "responsibility"
      ],
      [
        "fill",
        "Nous allons demander un ___ après la séance.",
        "retour",
        "Retour can refer to feedback from participants after an activity.",
        [],
        "vocabulary"
      ]
    ],
    "writing": [
      "Write a short volunteer project proposal with an achievable aim, assigned tasks, open needs and evaluation plan.",
      [
        "Distinguish confirmed responsibilities from tasks without owners.",
        "State a concrete condition for a pilot event.",
        "Explain how feedback would be collected before claiming success."
      ],
      "Je propose un atelier de conversation d’une heure pour les nouveaux habitants du quartier. Son objectif serait d’offrir une occasion de pratiquer le français dans un cadre accueillant. Sophie a accepté de préparer les thèmes et Marie vérifiera la disponibilité de la salle. Nous cherchons encore une personne pour les inscriptions. Une première séance pourrait avoir lieu à condition que le matériel soit disponible et qu’un bénévole supplémentaire accepte de venir. Après cet essai, nous demanderons un retour aux participants. Nous déciderons ensuite si une activité régulière est réaliste."
    ],
    "reading": {
      "title": "Une idée utile n’est pas encore un projet approuvé",
      "paragraphs": [
        "Une association locale souhaite proposer un atelier de conversation en français. Sophie, l'une des bénévoles, présente l'idée lors d'une réunion. Elle explique que plusieurs nouveaux habitants aimeraient pratiquer la langue dans des échanges simples, en dehors des cours traditionnels. Le projet viserait à organiser une rencontre d'une heure dans une salle commune. La plupart des participants trouvent l'objectif intéressant, mais ils savent qu'un soutien de principe ne suffit pas pour organiser une activité.",
        "Marie accepte de vérifier la disponibilité de la salle et Sophie se charge de préparer les premiers sujets de discussion. En revanche, personne n'a encore accepté de gérer les inscriptions ni confirmé la présence d'un second animateur. Le groupe examine aussi les ressources nécessaires : quelques tables, un espace calme et du matériel pour afficher des questions. Ces besoins semblent modestes, mais ils restent à vérifier avant d'annoncer une date.",
        "Les bénévoles proposent finalement une séance d'essai sous réserve de réunir les conditions essentielles. Ils souhaitent demander aux participants si l'activité était compréhensible, accessible et utile. Ce retour leur permettrait d'ajuster le programme. Le compte rendu indique clairement quelles tâches sont attribuées et lesquelles restent ouvertes. Il ne dit pas que l'atelier est déjà lancé ou qu'il a été une réussite. Le groupe choisit d'avancer par étapes concrètes plutôt que de promettre trop tôt un résultat."
      ],
      "questions": [
        [
          "Which duties have accepted owners?",
          "thèmes et vérification de salle",
          [
            "inscriptions et animation complète",
            "thèmes et vérification de salle",
            "publication et remboursement"
          ],
          "Sophie owns topics and Marie checks the room; registrations remain unassigned."
        ],
        [
          "Why is the first session only conditional?",
          "des ressources et un animateur restent à confirmer",
          [
            "des ressources et un animateur restent à confirmer",
            "le centre n’existe pas",
            "tous les participants sont absents"
          ],
          "Equipment and sufficient volunteer support are not yet secured."
        ],
        [
          "How will the group evaluate the idea?",
          "par un essai suivi de retours",
          [
            "par un essai suivi de retours",
            "par une certification automatique",
            "par une annonce de succès"
          ],
          "A trial followed by feedback provides usable evidence about whether to continue."
        ]
      ]
    },
    "listening": [
      [
        "Which preparation has Sophie accepted?",
        "les thèmes de discussion",
        [
          "les thèmes de discussion",
          "les inscriptions",
          "les factures"
        ],
        "Sophie states she has accepted responsibility for preparing the topics."
      ],
      [
        "What event does Lucas recommend first?",
        "une séance d’essai",
        [
          "une année complète",
          "une séance d’essai",
          "une cérémonie officielle"
        ],
        "Lucas recommends beginning with a trial conditional on equipment and another volunteer."
      ]
    ],
    "oral": {
      "prompt": "Present a two-minute volunteer project pitch and answer the question 'What is still uncertain?'",
      "plan": [
        "State the goal and intended participants.",
        "Name confirmed responsibilities separately from missing resources.",
        "Propose a trial and explain how feedback would guide the next decision."
      ],
      "model": "Notre association aimerait organiser un atelier de conversation pour les nouveaux habitants. L’objectif serait de pratiquer le français dans une rencontre d’une heure. Sophie prépare les sujets et Marie vérifiera la salle, mais nous recherchons encore une personne pour les inscriptions. Nous proposons une séance d’essai à condition de trouver du matériel et un animateur supplémentaire. Après l’activité, nous recueillerons les avis des participants. Nous ne pouvons pas annoncer le projet comme définitivement approuvé avant ces vérifications."
    }
  },
  {
    "id": "b1-39",
    "title": "Check a circulating claim before sharing it",
    "goal": "Evaluate social-message certainty, source attribution and the effects of spreading an unverified announcement.",
    "grammarIds": [],
    "grammar": [
      [
        "Reporting an unverified claim",
        "Il paraît que can introduce a rumor, but it is not proof. Selon ce message reports who made an assertion, whereas aucune source n’est indiquée identifies missing provenance. Ce qui est confirmé ... contrasts directly verified information with an untested interpretation. Avoid repeating an alarming statement as though it were established merely because it has been forwarded many times.",
        [
          [
            "Selon ce message, le centre fermerait demain.",
            "According to this message, the center may close tomorrow."
          ],
          [
            "Aucune annonce officielle n’a encore confirmé cette information.",
            "No official announcement has yet confirmed this information."
          ]
        ],
        [
          "Plusieurs personnes l’ont partagé, donc c’est certain.",
          "Le message circule, mais son contenu reste à vérifier.",
          "Many shares do not establish truth."
        ]
      ],
      [
        "Choosing a proportionate response",
        "Avant de + infinitive expresses a prior step: avant de diffuser, vérifiez la source. Si une confirmation officielle arrive, nous corrigerons notre message uses a real future condition. A sensible response may ask the institution a precise question, label the claim unverified and avoid amplifying it unnecessarily. Do not claim a falsehood has been proven when only its truth is unknown.",
        [
          [
            "Avant de transmettre l’information, je vérifierai l’annonce.",
            "Before forwarding the information, I will verify the notice."
          ],
          [
            "Si le centre confirme le changement, nous en informerons les membres.",
            "If the center confirms the change, we will inform the members."
          ]
        ],
        [
          "L’information n’est pas confirmée, donc elle est forcément fausse.",
          "L’information n’est pas confirmée; je vais demander une vérification.",
          "Unverified does not logically mean disproved."
        ]
      ]
    ],
    "vocabulary": [
      [
        "une rumeur",
        "rumor",
        "Une rumeur circule dans le groupe."
      ],
      [
        "une source",
        "source",
        "La source du message manque."
      ],
      [
        "vérifier",
        "verify",
        "Je vais vérifier la date annoncée."
      ],
      [
        "partager",
        "share",
        "Je préfère ne pas partager sans preuve."
      ],
      [
        "une affirmation",
        "claim",
        "Cette affirmation demande une preuve."
      ],
      [
        "une capture d’écran",
        "screenshot",
        "La capture ne montre pas l’auteur."
      ],
      [
        "un canal officiel",
        "official channel",
        "Consultez le canal officiel."
      ],
      [
        "fiable",
        "reliable",
        "Il nous faut une source fiable."
      ],
      [
        "non confirmé",
        "unconfirmed",
        "L’horaire reste non confirmé."
      ],
      [
        "corriger",
        "correct",
        "Je corrigerai l’annonce si nécessaire."
      ],
      [
        "une diffusion",
        "circulation",
        "La diffusion peut créer de la confusion."
      ],
      [
        "une précision",
        "clarification",
        "Demandons une précision écrite."
      ]
    ],
    "dialogue": [
      [
        "Leïla",
        "Un message circule dans notre groupe et affirme que le centre sera fermé demain, mais la capture d’écran ne montre ni auteur ni date.",
        "A message says the center closes tomorrow, but the screenshot shows neither author nor date."
      ],
      [
        "Marc",
        "Je l’ai reçu aussi; cependant, le fait qu’il ait été partagé plusieurs fois ne prouve pas que l’annonce soit officielle.",
        "I received it too; multiple shares do not prove it is official."
      ],
      [
        "Leïla",
        "Selon la page du centre que je viens de consulter, les horaires habituels restent affichés, mais cela ne suffit pas à réfuter une modification récente.",
        "The center's page still shows standard hours, but that does not disprove a recent change."
      ],
      [
        "Marc",
        "Nous pourrions contacter l’accueil et demander une confirmation précise avant de prévenir les participants que la fermeture est certaine.",
        "We could ask the center to confirm before telling attendees closure is certain."
      ],
      [
        "Leïla",
        "Je vais donc signaler que l’information est non vérifiée et transmettre uniquement la réponse officielle lorsqu’elle sera disponible.",
        "I'll say the claim is unverified and forward an official answer when available."
      ]
    ],
    "tasks": [
      [
        "fill",
        "Cette ___ n’a pas de source identifiable.",
        "rumeur",
        "Rumeur is an unverified claim circulating informally.",
        [],
        "source"
      ],
      [
        "choice",
        "What does frequent sharing prove?",
        "that the claim circulates",
        "Frequency of forwarding shows circulation, not accuracy.",
        [
          "that it is official",
          "that the claim circulates",
          "that the center is closed"
        ],
        "evidence"
      ],
      [
        "reading",
        "What is missing from the screenshot?",
        "l’auteur et la date",
        "Leïla explicitly says neither author nor date is visible.",
        [
          "le prix des billets",
          "l’auteur et la date",
          "le nom des élèves"
        ],
        "source details"
      ],
      [
        "fill",
        "Avant de ___ l’annonce, je vérifierai la source.",
        "partager",
        "Partager describes distributing a claim to others.",
        [],
        "responsibility"
      ],
      [
        "choice",
        "What can be concluded from normal hours still being posted?",
        "a change has not yet been verified",
        "The old hours neither confirm nor necessarily disprove a late update.",
        [
          "the rumor is proven false",
          "a change has not yet been verified",
          "the center is certainly open tomorrow"
        ],
        "uncertainty"
      ],
      [
        "order",
        "Arrange: reste à vérifier / La fermeture annoncée",
        "La fermeture annoncée reste à vérifier",
        "A circulated assertion is not a verified event.",
        [
          "reste à vérifier",
          "La fermeture annoncée"
        ],
        "syntax"
      ],
      [
        "fill",
        "Si le centre confirme, nous ___ les membres. (informer)",
        "informerons",
        "A real condition with si + present leads to futur simple informerons.",
        [],
        "future"
      ],
      [
        "reading",
        "What will Marc and Leïla do before informing participants?",
        "demander une confirmation au centre",
        "They propose contacting the reception for an authoritative response.",
        [
          "demander une confirmation au centre",
          "effacer leur téléphone",
          "imposer un nouvel horaire"
        ],
        "next step"
      ],
      [
        "choice",
        "Which label fits the current claim?",
        "non confirmé",
        "The available material does not establish the closure's authenticity.",
        [
          "définitivement faux",
          "non confirmé",
          "officiellement décidé"
        ],
        "calibration"
      ],
      [
        "fill",
        "Une réponse officielle permettra de ___ le message.",
        "corriger",
        "Corriger means updating inaccurate or incomplete claims with verified information.",
        [],
        "accuracy"
      ]
    ],
    "writing": [
      "Write an evidence-calibrated message to a group about a circulating claim, with a clear next action.",
      [
        "Name the circulating claim and exact provenance limitations.",
        "Distinguish unverified from disproved.",
        "Explain when and how a verified update will be communicated."
      ],
      "Bonjour à tous, un message circule actuellement au sujet d’une possible fermeture du centre demain. La capture d’écran partagée ne donne ni auteur ni date vérifiable. Les horaires habituels figurent encore sur la page du centre, mais cela ne confirme pas à lui seul la situation de demain. Nous avons donc demandé une précision directement à l’accueil. Pour le moment, nous considérons l’annonce comme non confirmée, et non comme nécessairement fausse. Dès qu’une réponse officielle sera disponible, nous transmettrons les informations exactes afin d’éviter toute confusion."
    ],
    "reading": {
      "title": "Une capture d’écran ne suffit pas",
      "paragraphs": [
        "Dans un groupe de bénévoles, un message annonce la fermeture d'un centre dès le lendemain. La capture d'écran paraît convaincante parce qu'elle comporte le nom du centre en haut, mais aucune date ni signature n'est visible. Plusieurs membres la transfèrent immédiatement. Certains commencent à annuler leur déplacement, et une personne écrit que la fermeture est désormais certaine. Personne ne peut cependant expliquer d'où vient exactement le document ni quand il aurait été publié.",
        "Leïla consulte le site public du centre, où les horaires habituels restent affichés. Elle se rend compte que cette information ne répond pas entièrement à la question : la page pourrait ne pas avoir été mise à jour. Elle refuse donc d'affirmer que la rumeur est fausse, tout comme elle refuse de la considérer comme prouvée. Avec Marc, elle prépare une demande courte au secrétariat, indiquant la date de la fermeture supposée et demandant si elle s'applique réellement.",
        "Le groupe décide ensuite de publier un message provisoire. Il explique que l'information circule sans source vérifiable et qu'une confirmation a été demandée. Les organisateurs promettent de partager la réponse officielle dès qu'ils la recevront. Cette méthode ne résout pas immédiatement la question, mais elle empêche qu'une hypothèse soit présentée comme un fait certain. Elle rappelle aussi que les partages répétés d'un message ne remplacent jamais la vérification de sa provenance."
      ],
      "questions": [
        [
          "Why is the screenshot unreliable as proof?",
          "la date et l’auteur manquent",
          [
            "la date et l’auteur manquent",
            "elle contient une photo",
            "le message est court"
          ],
          "Without provenance and date, the screenshot cannot establish an official closure."
        ],
        [
          "Does the unchanged website disprove the rumor?",
          "non, il peut manquer une mise à jour",
          [
            "oui, toujours",
            "non, il peut manquer une mise à jour",
            "oui, parce qu’il est en ligne"
          ],
          "A website with older hours does not conclusively disprove a later unposted change."
        ],
        [
          "What status should the group communicate?",
          "l’annonce est non confirmée",
          [
            "l’annonce est certaine",
            "l’annonce est non confirmée",
            "la rumeur est prouvée fausse"
          ],
          "A proportionate update marks uncertainty and seeks official confirmation."
        ]
      ]
    },
    "listening": [
      [
        "What is absent from the screenshot?",
        "l’auteur et la date",
        [
          "l’auteur et la date",
          "les images et le texte",
          "le nom du centre"
        ],
        "Leïla says the forwarded capture has no visible author or date."
      ],
      [
        "Whom will Marc contact to clarify the rumor?",
        "l’accueil du centre",
        [
          "la gare",
          "l’accueil du centre",
          "une boutique"
        ],
        "He recommends asking reception for a clear official confirmation."
      ]
    ],
    "oral": {
      "prompt": "Explain the rumor situation to a community group in about one minute, without certifying either truth or falsehood.",
      "plan": [
        "Identify the claim and missing provenance.",
        "Explain why an unchanged official page does not resolve everything.",
        "Offer a concrete verification step and update plan."
      ],
      "model": "Un message affirme que le centre sera fermé demain, mais la capture ne présente ni auteur ni date. Plusieurs personnes l’ont transmis, ce qui montre seulement que l’information circule. Le site du centre affiche encore les horaires habituels, mais une modification récente pourrait ne pas y apparaître. Nous devons donc considérer la fermeture comme non confirmée. Nous allons demander une réponse à l’accueil et communiquer uniquement les informations vérifiées dès qu’elles seront disponibles."
    }
  }
];
export const U12_LESSONS_37_39=Object.freeze(authored.map((spec,i)=>authorU12Lesson(spec,i+37)));
