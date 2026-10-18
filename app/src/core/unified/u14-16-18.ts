import {authorU14Scenario,type U14AuthoredScenario} from './u14-model.ts';
const SOURCE:readonly U14AuthoredScenario[]=[
  {
    "id": "transfer-16",
    "title": "Prepare a clinic visit from two appointment messages",
    "goal": "Clarify appointment instructions, time changes and respectful follow-up without inventing medical guidance.",
    "grammarKeys": [
      "questions",
      "report"
    ],
    "vocabulary": [
      [
        "un rendez-vous",
        "appointment",
        "Le rendez-vous est prévu mardi."
      ],
      [
        "un secrétariat",
        "reception office",
        "Le secrétariat répond aux patients."
      ],
      [
        "une convocation",
        "appointment letter",
        "La convocation indique une heure."
      ],
      [
        "un horaire",
        "schedule",
        "L’horaire doit être confirmé."
      ],
      [
        "un formulaire",
        "form",
        "Le formulaire est incomplet."
      ],
      [
        "un document",
        "document",
        "Je prépare les documents demandés."
      ],
      [
        "un justificatif",
        "supporting proof",
        "Le justificatif est mentionné dans le courrier."
      ],
      [
        "reporter",
        "postpone",
        "Je voudrais reporter le rendez-vous."
      ],
      [
        "confirmer",
        "confirm",
        "Pouvez-vous confirmer l’heure ?"
      ],
      [
        "un créneau",
        "time slot",
        "Le créneau est provisoire."
      ],
      [
        "une précision",
        "clarification",
        "Je demande une précision écrite."
      ],
      [
        "une consigne",
        "instruction",
        "La consigne concerne l’accueil."
      ]
    ],
    "dialogue": [
      [
        "Lina",
        "J’ai reçu une convocation pour mardi à neuf heures, mais un second courriel évoque dix heures sans préciser s’il remplace le premier horaire.",
        "I received a letter for Tuesday at nine, but a new email mentions ten without saying if it replaces nine."
      ],
      [
        "Agent",
        "Le second message propose un changement, toutefois je dois vérifier le calendrier avant de confirmer définitivement votre heure de passage.",
        "The second message proposes a change, but I must check the calendar before confirming your time."
      ],
      [
        "Lina",
        "Je voudrais savoir quels documents administratifs je dois apporter et si le formulaire reçu doit être rempli avant mon arrivée.",
        "I would like to know which administrative documents to bring and whether to complete the form ahead."
      ],
      [
        "Agent",
        "La convocation mentionne votre pièce d’identité et le formulaire, mais une instruction différente devrait être communiquée par écrit si nécessaire.",
        "The letter lists ID and the form; any different instruction should be communicated in writing."
      ],
      [
        "Lina",
        "Merci, je vais préparer les éléments indiqués et attendre votre confirmation écrite de l’heure au lieu de me fier à une simple proposition.",
        "Thanks, I'll prepare listed items and await written confirmation of the time rather than rely on a proposal."
      ]
    ],
    "reading": {
      "title": "Une heure proposée et des documents à préparer",
      "paragraphs": [
        "Avant sa première visite au centre, Lina reçoit une convocation indiquant mardi à neuf heures. Le courrier précise qu'elle doit apporter une pièce d'identité et un formulaire administratif. Lina rassemble ces documents dans une chemise et note la date dans son agenda. Le lendemain, elle découvre un nouveau courriel qui évoque une possibilité à dix heures. Ce deuxième message ne dit pas clairement que le rendez-vous initial a été remplacé.",
        "Lina téléphone donc au secrétariat. L'agent lui explique que dix heures est une proposition encore soumise à une vérification du planning. Il confirme que les documents mentionnés dans la convocation doivent être préparés, mais ne donne aucune nouvelle consigne médicale. Lina demande une réponse écrite sur l'horaire et, si nécessaire, sur les papiers à fournir. Elle évite de demander à un agent administratif des conseils de santé qu'il n'a pas donnés.",
        "Après l'appel, elle rédige un résumé simple : une première heure est écrite sur la convocation; une autre est envisagée dans un courriel; le secrétariat doit encore trancher. Elle garde ses documents prêts mais n'annonce pas à sa famille que la nouvelle heure est définitive. En distinguant les instructions confirmées des modifications possibles, elle pourra se présenter avec les éléments appropriés après vérification."
      ],
      "questions": [
        [
          "Which hour is on the original letter?",
          "neuf heures",
          [
            "neuf heures",
            "dix heures",
            "onze heures"
          ],
          "The original written appointment specifically states nine."
        ],
        [
          "What is the status of ten o'clock?",
          "une proposition non confirmée",
          [
            "une proposition non confirmée",
            "l’heure approuvée",
            "une visite annulée"
          ],
          "The agent still needs to check the schedule before confirming ten."
        ],
        [
          "What kind of instructions are actually established?",
          "les documents administratifs",
          [
            "une nouvelle prescription",
            "les documents administratifs",
            "une intervention confirmée"
          ],
          "The letter lists administrative documents; no new medical instruction is supplied."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Initial appointment letter",
        "type": "email",
        "french": "Votre rendez-vous administratif est prévu mardi à 9 h. Merci de préparer une pièce d’identité ainsi que le formulaire joint. Pour une modification, contacter le secrétariat."
      },
      {
        "label": "Later scheduling message",
        "type": "email",
        "french": "Un passage à 10 h pourrait être envisagé mardi. Ce nouveau créneau reste soumis à la vérification du planning et ne constitue pas encore une confirmation."
      }
    ],
    "comparison": [
      [
        "What information is confirmed in the first source?",
        "l’heure de neuf heures et les pièces demandées",
        [
          "une procédure médicale",
          "l’heure de neuf heures et les pièces demandées",
          "dix heures définitivement"
        ],
        "The first letter states an appointment and administrative items, unlike the tentative later message."
      ],
      [
        "Do both sources confirm the same start time?",
        "non",
        [
          "oui",
          "non",
          "les deux annulent tout"
        ],
        "The sources mention different hours and explicitly qualify the later one."
      ]
    ],
    "listening": [
      [
        "Which hour is proposed in the second email?",
        "dix heures",
        [
          "neuf heures",
          "dix heures",
          "midi"
        ],
        "Lina says a second message raises ten o'clock."
      ],
      [
        "Who must check the planning?",
        "le secrétariat",
        [
          "le secrétariat",
          "le chauffeur",
          "la famille"
        ],
        "The agent says the reception office must check the appointment schedule."
      ],
      [
        "What will Lina prepare now?",
        "la pièce d’identité et le formulaire",
        [
          "une ordonnance inventée",
          "la pièce d’identité et le formulaire",
          "une facture de restaurant"
        ],
        "She prepares only the administrative items named in the letter."
      ]
    ],
    "recall": {
      "clozes": [
        [
          "Je voudrais savoir ___ le créneau est confirmé.",
          "si",
          "A yes/no indirect question uses si with normal statement word order.",
          "indirect question"
        ],
        [
          "Le secrétariat a expliqué qu’il ___ encore vérifier. (devoir, imperfect)",
          "devait",
          "Reported speech following a past introductory verb can use imparfait devait.",
          "reported obligation"
        ]
      ],
      "order": [
        "La nouvelle heure reste à confirmer",
        [
          "reste à confirmer",
          "La nouvelle heure"
        ],
        "The later time is merely proposed and needs official confirmation.",
        "status"
      ]
    },
    "writing": {
      "fromListening": [
        "After listening to the call, write the neutral four-part summary for someone accompanying Lina.",
        [
          "Report both time references.",
          "Identify who must verify the change.",
          "Limit the advice to actually specified administrative tasks."
        ],
        "Lina a reçu une convocation pour mardi à neuf heures. Un deuxième courriel propose dix heures, mais le secrétariat doit encore vérifier ce créneau. L’agent a précisé que la convocation demandait une pièce d’identité et un formulaire administratif. Aucune nouvelle consigne médicale n’a été fournie pendant cet appel. Lina préparera donc les documents indiqués et attendra une réponse écrite confirmant l’heure. Il serait incorrect de présenter dix heures comme un rendez-vous déjà modifié."
      ],
      "fromSources": [
        "Write a polite email comparing the two appointment documents and requesting a final clarification.",
        [
          "Attribute nine and ten to the correct sources.",
          "Ask one precise question about the official time.",
          "Do not invent instructions outside the documents."
        ],
        "Bonjour, je vous écris au sujet de mon rendez-vous de mardi. La convocation initiale indique neuf heures et demande une pièce d’identité ainsi que le formulaire joint. Dans votre message plus récent, dix heures est présenté comme un créneau possible, mais soumis à une vérification. Pourriez-vous me confirmer par écrit quelle heure a finalement été retenue ? Je préparerai les documents administratifs mentionnés dans le premier courrier. Merci pour votre aide et pour toute précision utile au sujet de l’accueil. Cordialement, Lina."
      ]
    },
    "oral": {
      "prompt": "Explain the difference between the original appointment and the later scheduling proposal.",
      "plan": [
        "Identify the original confirmed written information.",
        "Describe the later conditional proposal.",
        "State the next verification step without giving medical advice."
      ],
      "model": "Lina a reçu une convocation pour mardi à neuf heures, avec une demande de pièce d’identité et de formulaire. Le courriel suivant évoque dix heures, mais il ne confirme pas ce changement. Le secrétariat doit vérifier le planning et répondre par écrit. En attendant, Lina prépare seulement les documents administratifs indiqués. Je ne peux pas annoncer une nouvelle heure définitive ou des consignes médicales qui ne figurent pas dans les sources."
    }
  },
  {
    "id": "transfer-17",
    "title": "Bicycle repair: estimates, authorization and collection",
    "goal": "Compare a repair estimate and workshop message to choose a safe, documented next step.",
    "grammarKeys": [
      "polite",
      "condition"
    ],
    "vocabulary": [
      [
        "un vélo",
        "bicycle",
        "Mon vélo est à l’atelier."
      ],
      [
        "un frein",
        "brake",
        "Le frein semble usé."
      ],
      [
        "une réparation",
        "repair",
        "La réparation doit être autorisée."
      ],
      [
        "un devis",
        "estimate",
        "Je demande un devis détaillé."
      ],
      [
        "une pièce",
        "part",
        "La pièce coûte quinze euros."
      ],
      [
        "la main-d’œuvre",
        "labor",
        "Le devis inclut la main-d’œuvre."
      ],
      [
        "un diagnostic",
        "diagnosis/assessment",
        "Le diagnostic reste à vérifier."
      ],
      [
        "un accord",
        "approval",
        "Je n’ai pas donné mon accord."
      ],
      [
        "remplacer",
        "replace",
        "Il faudra peut-être remplacer la pièce."
      ],
      [
        "un délai",
        "timeframe",
        "Le délai est seulement estimé."
      ],
      [
        "récupérer",
        "collect",
        "Je voudrais récupérer le vélo."
      ],
      [
        "un atelier",
        "workshop",
        "L’atelier répond par écrit."
      ]
    ],
    "dialogue": [
      [
        "Camille",
        "J’ai déposé mon vélo parce que le frein arrière répond mal, et j’ai reçu un devis qui mentionne une vérification ainsi qu’un remplacement possible.",
        "I left my bike because the rear brake responds poorly; the estimate mentions inspection and possible replacement."
      ],
      [
        "Mécanicien",
        "Nous avons observé une usure, mais nous devons démonter une pièce pour confirmer son état avant de fixer le prix final.",
        "We observed wear, but must inspect a component before final pricing."
      ],
      [
        "Camille",
        "Je souhaiterais connaître le montant maximum prévu et savoir quelles opérations nécessiteraient mon accord avant de commencer.",
        "I would like the maximum estimated amount and which operations need my approval."
      ],
      [
        "Mécanicien",
        "La vérification initiale figure au devis; le remplacement n’est ni confirmé ni autorisé, et nous vous appellerons si nous le jugeons nécessaire.",
        "The initial inspection is quoted; replacement isn't confirmed or authorized, and we'll call if needed."
      ],
      [
        "Camille",
        "Merci, je vais attendre votre conclusion et ne pas utiliser le vélo avant que le système de freinage ait été examiné et déclaré prêt.",
        "Thanks; I'll wait for the assessment and not ride until the braking system has been checked and deemed ready."
      ]
    ],
    "reading": {
      "title": "Le devis décrit une possibilité, pas un travail terminé",
      "paragraphs": [
        "Camille utilise habituellement son vélo pour aller au travail. Depuis quelques jours, le frein arrière ne répond plus correctement. Elle décide de ne pas poursuivre ses déplacements habituels et apporte le vélo à un atelier. Un premier devis mentionne une vérification du système et une pièce qui pourrait devoir être remplacée. Le montant de cette pièce dépend toutefois du résultat du contrôle.",
        "Le mécanicien explique que l'usure visible ne permet pas de conclure immédiatement à une réparation précise. Il faut examiner certains éléments avant de décider ce qui doit être remplacé. Camille demande alors quelles opérations sont incluses dans le devis et lesquelles devront recevoir son accord. Le responsable confirme qu'il appellera avant toute intervention supplémentaire non autorisée. Aucun délai exact pour récupérer le vélo n'est encore assuré.",
        "Dans son message de suivi, Camille récapitule les étapes connues : le problème a été signalé, le contrôle est prévu, et une pièce pourrait être nécessaire. Elle demande une estimation mise à jour avant de prendre une décision. Elle évite d'affirmer que la réparation est déjà effectuée. Son objectif principal est de disposer d'un vélo dont le freinage aura été vérifié, sans confondre le diagnostic envisagé avec l'autorisation d'un travail supplémentaire."
      ],
      "questions": [
        [
          "What symptom led Camille to stop riding?",
          "le frein arrière répond mal",
          [
            "le frein arrière répond mal",
            "la selle est trop basse",
            "la roue a disparu"
          ],
          "The rear brake malfunction prompted the workshop visit."
        ],
        [
          "Is replacing the part already authorized?",
          "non",
          [
            "oui",
            "non",
            "le devis est une facture"
          ],
          "The mechanic explicitly distinguishes a possible replacement from approved work."
        ],
        [
          "Why does Camille request an updated estimate?",
          "pour décider avant une intervention supplémentaire",
          [
            "pour décider avant une intervention supplémentaire",
            "pour changer de couleur",
            "pour réserver un bus"
          ],
          "The final scope and price depend on inspection and customer authorization."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Workshop preliminary estimate",
        "type": "data",
        "french": "Vélo — contrôle du frein arrière : 28 € de diagnostic. Remplacement éventuel d’une pièce : prix à préciser après inspection. Le devis préliminaire n’autorise pas l’intervention supplémentaire."
      },
      {
        "label": "Mechanic's follow-up",
        "type": "email",
        "french": "Nous avons constaté une usure et vérifierons la pièce concernée. Si un remplacement est nécessaire, nous vous communiquerons son prix et demanderons votre accord avant de commencer."
      }
    ],
    "comparison": [
      [
        "Which amount is already listed precisely?",
        "vingt-huit euros",
        [
          "vingt-huit euros",
          "quarante euros",
          "soixante euros"
        ],
        "Only the diagnostic is quoted at 28 euros; replacement costs remain unknown."
      ],
      [
        "Does either source establish that the replacement is complete?",
        "non",
        [
          "oui",
          "non",
          "seulement mardi"
        ],
        "Both documents describe inspection and consent before possible repair."
      ]
    ],
    "listening": [
      [
        "Which part of the bicycle has a problem?",
        "le frein arrière",
        [
          "le frein arrière",
          "la sonnette",
          "la pédale"
        ],
        "Camille describes a rear brake problem."
      ],
      [
        "Which action has not been authorized?",
        "le remplacement de la pièce",
        [
          "la visite de l’atelier",
          "le remplacement de la pièce",
          "le diagnostic demandé"
        ],
        "The mechanic confirms replacement needs a further agreement."
      ],
      [
        "What matters before riding again?",
        "la vérification du freinage",
        [
          "la vérification du freinage",
          "un nouveau cadenas",
          "un reçu de restaurant"
        ],
        "Camille will wait until the braking system has been examined and deemed ready."
      ]
    ],
    "recall": {
      "clozes": [
        [
          "Pourriez-vous ___ le prix avant le remplacement ?",
          "préciser",
          "The modal pourriez-vous takes the infinitive préciser.",
          "polite request"
        ],
        [
          "Si la pièce doit être changée, je vous ___ mon accord. (donner, future)",
          "donnerai",
          "A real si + present clause uses future simple donnerai in its main clause.",
          "real condition"
        ]
      ],
      "order": [
        "Le remplacement reste à autoriser",
        [
          "reste à autoriser",
          "Le remplacement"
        ],
        "The possible repair requires separate approval before work.",
        "consent"
      ]
    },
    "writing": {
      "fromListening": [
        "Summarize the repair conversation for a person borrowing the bicycle.",
        [
          "Explain the observed brake problem and safety decision.",
          "Separate diagnostics from proposed replacement.",
          "State that collection is not yet authorized or confirmed."
        ],
        "Camille a apporté son vélo à l’atelier parce que le frein arrière fonctionnait mal. Le mécanicien a observé une usure, mais il doit encore examiner la pièce. Une vérification initiale est prévue; le remplacement supplémentaire n’a pas été autorisé. Camille souhaite obtenir le montant avant toute opération nouvelle. Elle n’utilisera pas le vélo tant que le freinage n’aura pas été contrôlé et que l’atelier n’aura pas confirmé son état. La date de récupération reste donc incertaine."
      ],
      "fromSources": [
        "Write a repair authorization clarification that distinguishes quoted and unquoted work.",
        [
          "State the 28-euro diagnostic amount.",
          "Ask about the conditional part replacement and authorization.",
          "Avoid asserting the bicycle is already repaired."
        ],
        "Bonjour, je fais suite au devis concernant mon vélo. J’ai compris que le contrôle du frein arrière est estimé à vingt-huit euros. Le remplacement d’une pièce reste éventuel, et son prix ne sera connu qu’après inspection. Pourriez-vous m’envoyer une estimation précise avant de réaliser une intervention supplémentaire ? Je souhaite donner mon accord séparément si cette réparation est nécessaire. Je récupérerai le vélo une fois le freinage vérifié et les travaux autorisés terminés. Merci pour votre réponse écrite."
      ]
    },
    "oral": {
      "prompt": "Explain the difference between repair diagnosis and authorized replacement.",
      "plan": [
        "Describe the observed symptom and inspection charge.",
        "Clarify the unknown cost and need for consent.",
        "Identify what should happen before collection and use."
      ],
      "model": "Le frein arrière du vélo de Camille fonctionne mal. L’atelier a prévu un diagnostic facturé vingt-huit euros, mais le mécanicien doit encore vérifier si une pièce doit être remplacée. Aucune nouvelle réparation n’a été autorisée et son prix reste à préciser. Camille demandera un devis mis à jour avant de donner son accord. Elle attendra que le freinage ait été vérifié avant d’utiliser de nouveau le vélo."
    }
  },
  {
    "id": "transfer-18",
    "title": "Reading club: distinguish a book's ending from a reviewer's opinion",
    "goal": "Interpret a reading summary and a subjective review, then lead a fair discussion without revealing unsupported spoilers.",
    "grammarKeys": [
      "relative",
      "concession"
    ],
    "vocabulary": [
      [
        "un roman",
        "novel",
        "Nous lisons un roman."
      ],
      [
        "un personnage",
        "character",
        "Le personnage cherche sa sœur."
      ],
      [
        "une intrigue",
        "plot",
        "L’intrigue avance lentement."
      ],
      [
        "un résumé",
        "summary",
        "Le résumé ne raconte pas la fin."
      ],
      [
        "un avis",
        "opinion",
        "Son avis est personnel."
      ],
      [
        "une critique",
        "review",
        "La critique trouve le rythme lent."
      ],
      [
        "un chapitre",
        "chapter",
        "J’ai terminé trois chapitres."
      ],
      [
        "un passage",
        "passage",
        "Le passage illustre le thème."
      ],
      [
        "un indice",
        "clue",
        "Un indice apparaît tôt."
      ],
      [
        "une interprétation",
        "interpretation",
        "Une interprétation reste discutable."
      ],
      [
        "une révélation",
        "revelation",
        "Évitons une révélation finale."
      ],
      [
        "nuancer",
        "qualify",
        "Je voudrais nuancer ce jugement."
      ]
    ],
    "dialogue": [
      [
        "Nora",
        "J’anime le club de lecture jeudi, mais une critique affirme que la fin du roman est décevante, alors que le résumé ne dit presque rien du dernier chapitre.",
        "I'm hosting the book club; a review calls the ending disappointing, but the summary says little about it."
      ],
      [
        "Émile",
        "La critique exprime une expérience personnelle; nous ne devrions pas présenter son jugement comme une description objective du dénouement.",
        "The review gives a subjective reaction, not an objective account of the ending."
      ],
      [
        "Nora",
        "Je vais poser des questions sur les choix des personnages et sur les indices des premiers chapitres, sans inventer de révélations.",
        "I'll ask about character choices and early clues without inventing spoilers."
      ],
      [
        "Émile",
        "Certes, certains lecteurs trouvent le rythme lent, mais ce ralentissement peut aussi permettre de mieux comprendre les relations entre personnages.",
        "Some find the pace slow; it may also develop relationships."
      ],
      [
        "Nora",
        "Je demanderai à chacun de citer un passage précis et de distinguer ce qu’il a lu de ce qu’il en a conclu.",
        "I'll ask everyone to cite an actual passage and distinguish text from interpretation."
      ]
    ],
    "reading": {
      "title": "La critique et le résumé ne racontent pas la même chose",
      "paragraphs": [
        "Le club de lecture se réunit pour discuter d'un roman consacré à une famille séparée pendant plusieurs années. Le résumé de l'éditeur présente les deux personnages principaux et annonce qu'une vieille lettre relance leurs recherches. Il s'arrête avant la résolution de l'histoire. Nora, qui animera la rencontre, trouve ensuite une critique d'une lectrice. Cette personne estime que le rythme est trop lent et que la fin manque de surprise.",
        "Émile rappelle que les deux documents ont des fonctions différentes. Le résumé sert à présenter la situation de départ sans raconter tout le roman. La critique propose un jugement personnel sur l'expérience de lecture. L'opinion de la lectrice peut être intéressante, mais elle n'établit pas à elle seule comment chaque lecteur comprendra les derniers chapitres. De plus, les participants qui n'ont pas terminé le livre risquent de recevoir des révélations prématurées.",
        "Nora prépare donc plusieurs questions ouvertes. Elle demande quels indices du début semblent importants, comment les personnages réagissent aux lettres reçues et quelles interprétations pourraient expliquer certaines décisions. Elle propose de commencer sans évoquer le dénouement, puis de prévoir une partie séparée pour ceux qui souhaitent en parler. Cette méthode permet de discuter avec précision sans confondre la présentation de l'intrigue, le jugement d'une critique et les conclusions des membres du groupe."
      ],
      "questions": [
        [
          "What does the publisher's summary leave out?",
          "la résolution finale",
          [
            "la résolution finale",
            "les deux personnages",
            "l’existence d’une lettre"
          ],
          "The summary introduces the story but stops before its ending."
        ],
        [
          "What is subjective in the review?",
          "le jugement sur le rythme et la fin",
          [
            "le jugement sur le rythme et la fin",
            "le titre du livre",
            "le nombre de personnages"
          ],
          "The critic evaluates pacing and satisfaction rather than establishing universal facts."
        ],
        [
          "Why does Nora split the discussion?",
          "pour éviter des révélations aux lecteurs non terminés",
          [
            "pour éviter des révélations aux lecteurs non terminés",
            "pour interdire toute critique",
            "pour changer de livre"
          ],
          "An initial spoiler-free phase protects members at different reading stages."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Publisher-style summary (original fictional text)",
        "type": "article",
        "french": "Deux membres d’une famille séparée retrouvent la trace d’une ancienne lettre. Leurs recherches les conduisent vers des souvenirs contradictoires. Ce résumé présente le point de départ et ne dévoile pas la résolution."
      },
      {
        "label": "Reader's personal review (original fictional text)",
        "type": "review",
        "french": "J’ai apprécié les personnages, mais j’ai trouvé le rythme parfois lent et la fin moins surprenante que prévu. C’est mon avis de lectrice, non une description de ce que tout le monde ressentira."
      }
    ],
    "comparison": [
      [
        "Which source directly discloses the ending?",
        "aucune",
        [
          "le résumé",
          "la critique",
          "aucune"
        ],
        "The review gives a subjective reaction without narrating the actual resolution."
      ],
      [
        "Which source explicitly marks its judgment as personal?",
        "la critique",
        [
          "la critique",
          "le résumé",
          "les deux"
        ],
        "The fictional review identifies its assessment as the reviewer's opinion."
      ]
    ],
    "listening": [
      [
        "Which issue does the reviewer raise?",
        "le rythme et la fin",
        [
          "le prix et la couverture",
          "le rythme et la fin",
          "la date de publication"
        ],
        "Nora describes the reviewer's negative reaction to pacing and ending."
      ],
      [
        "What will Nora ask participants to cite?",
        "un passage précis",
        [
          "un passage précis",
          "une note inventée",
          "une publicité"
        ],
        "She asks for a concrete passage rather than unsupported judgments."
      ],
      [
        "Why does Émile propose nuance?",
        "le rythme lent peut développer les personnages",
        [
          "le rythme lent peut développer les personnages",
          "le résumé est faux",
          "les chapitres manquent"
        ],
        "He gives an alternative interpretation of a feature others dislike."
      ]
    ],
    "recall": {
      "clozes": [
        [
          "C’est le passage ___ je parle.",
          "dont",
          "Parler de takes the relative pronoun dont.",
          "relative"
        ],
        [
          "Bien que le rythme ___ lent, certains apprécient les personnages. (être)",
          "soit",
          "Bien que takes the subjunctive soit to express concession.",
          "concession"
        ]
      ],
      "order": [
        "Un avis reste une interprétation",
        [
          "reste une interprétation",
          "Un avis"
        ],
        "A reader's opinion does not become a universal fact.",
        "critical distinction"
      ]
    },
    "writing": {
      "fromListening": [
        "Write a neutral introduction to the club discussion based on the recorded dialogue.",
        [
          "Identify the critic's opinion without endorsing it as fact.",
          "Give two open questions anchored in character choices.",
          "Protect readers who have not completed the novel."
        ],
        "Bienvenue au club de lecture. Aujourd’hui, nous discuterons d’un roman dont le résumé présente deux personnages séparés par des souvenirs contradictoires. Une critique trouve le rythme lent et la fin décevante, mais cela reste un jugement personnel. Pour commencer, quels indices du début vous ont paru importants ? Comment interprétez-vous les réactions des personnages aux lettres ? Nous éviterons les révélations finales dans cette première partie. Les personnes ayant terminé le roman pourront ensuite discuter séparément du dénouement. Chacun pourra appuyer ses idées sur un passage précis."
      ],
      "fromSources": [
        "Compose a balanced short comparison of the synopsis and review for prospective readers.",
        [
          "Explain the purpose of the publisher-style synopsis.",
          "Attribute the reviewer's aesthetic judgment.",
          "Do not invent a concrete ending or agreement among all readers."
        ],
        "Le résumé présente un roman consacré à deux membres d’une famille qui retrouvent une vieille lettre. Il décrit leur situation initiale sans dévoiler la résolution du récit. La critique, en revanche, donne l’opinion personnelle d’une lectrice qui a apprécié les personnages mais trouvé le rythme parfois lent. Bien que cette réaction puisse aider certains lecteurs à choisir, elle ne prouve pas que tous auront le même avis. Aucun des deux textes ne raconte précisément la fin. Je recommanderais donc de découvrir les premiers chapitres et de former sa propre interprétation."
      ]
    },
    "oral": {
      "prompt": "Moderate a spoiler-free opening minute of the reading club.",
      "plan": [
        "Introduce the premise from the summary.",
        "Qualify the reader review as an opinion.",
        "Ask open questions with evidence from the text."
      ],
      "model": "Notre livre raconte l’histoire de deux personnages qui retrouvent une lettre liée à leur famille. Le résumé ne dévoile pas le dénouement. Une critique estime que l’intrigue est lente, mais c’est une appréciation personnelle. J’aimerais connaître vos impressions : quel indice vous semble le plus important dans les premiers chapitres ? Comment comprenez-vous les choix des personnages ? Essayons de justifier nos réponses avec un passage précis, sans révéler la fin."
    }
  }
];
export const U14_16_18=Object.freeze(SOURCE.map((record,i)=>authorU14Scenario(record,16+i)));
