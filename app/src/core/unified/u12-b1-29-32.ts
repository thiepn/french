import {authorU12Lesson,type U12AuthoredLesson} from './u12-model.ts';
const authored:readonly U12AuthoredLesson[]=[
  {
    "id": "b1-29",
    "title": "Negotiate an appointment by phone",
    "goal": "Listen for proposed dates, concessions and unresolved confirmation in a multi-turn call.",
    "grammarIds": [],
    "grammar": [
      [
        "Reformulation and polite clarification",
        "Au téléphone, si j’ai bien compris introduces a check of what the other person said, while vous proposez donc expresses a tentative summary. Pourriez-vous préciser ... ? asks for missing information without implying fault. Indirect questions keep normal statement order: je voudrais savoir si le rendez-vous est possible, not si est le rendez-vous possible. Repeat dates and times clearly because an unconfirmed slot is still only a proposal.",
        [
          [
            "Si j’ai bien compris, vous proposez jeudi à seize heures.",
            "If I understood correctly, you suggest Thursday at four."
          ],
          [
            "Je voudrais savoir si le créneau est encore disponible.",
            "I would like to know whether the slot is still available."
          ]
        ],
        [
          "Je voudrais savoir si est disponible le créneau.",
          "Je voudrais savoir si le créneau est disponible.",
          "Indirect yes/no questions follow normal subject–verb order."
        ]
      ],
      [
        "Concession and arranging an alternative",
        "Je pourrais + infinitive signals flexibility; je ne pourrai pas + infinitive describes a future constraint. À moins que plus subjunctive means unless, but at this stage avoid shifting the condition onto the listener: explain who is constrained. When responding, repeat the chosen day, hour and whether confirmation will arrive later; an agent's promise to check does not itself book the appointment.",
        [
          [
            "Je pourrais venir vendredi, mais pas avant quinze heures.",
            "I could come Friday, but not before three."
          ],
          [
            "Je vous confirmerai le créneau après avoir consulté le planning.",
            "I will confirm the slot after checking the schedule."
          ]
        ],
        [
          "Vous allez vérifier, donc le rendez-vous est confirmé.",
          "Vous allez vérifier, donc j’attends encore votre confirmation.",
          "Checking availability is not the same as confirming an appointment."
        ]
      ]
    ],
    "vocabulary": [
      [
        "un créneau",
        "time slot",
        "Le créneau de jeudi est libre."
      ],
      [
        "un standard",
        "switchboard",
        "J’appelle le standard du centre."
      ],
      [
        "reporter",
        "postpone",
        "Je souhaite reporter notre entretien."
      ],
      [
        "décaler",
        "move to another time",
        "Pourriez-vous décaler l’appel ?"
      ],
      [
        "une disponibilité",
        "availability",
        "Je vérifie les disponibilités."
      ],
      [
        "si j’ai bien compris",
        "if I understood correctly",
        "Si j’ai bien compris, ce sera vendredi."
      ],
      [
        "préciser",
        "clarify",
        "Pouvez-vous préciser l’heure ?"
      ],
      [
        "une confirmation",
        "confirmation",
        "J’attends une confirmation écrite."
      ],
      [
        "un imprévu",
        "unexpected issue",
        "Un imprévu empêche ma venue."
      ],
      [
        "rappeler",
        "call back",
        "Je vous rappellerai lundi."
      ],
      [
        "convenir de",
        "agree on",
        "Nous devons convenir d’une heure."
      ],
      [
        "le planning",
        "schedule",
        "Le planning doit être vérifié."
      ]
    ],
    "dialogue": [
      [
        "Client",
        "Bonjour, je vous appelle au sujet de mon rendez-vous de jeudi matin, car un imprévu professionnel m’empêchera de venir à l’heure prévue.",
        "Hello, I'm calling about my Thursday appointment because an unexpected work matter means I cannot come then."
      ],
      [
        "Agente",
        "Je comprends; nous pourrions envisager vendredi à quinze heures, mais je dois d’abord vérifier si la personne concernée sera disponible.",
        "I understand; Friday at three may work, but I must check whether the relevant person is available."
      ],
      [
        "Client",
        "Si j’ai bien compris, vendredi à quinze heures n’est encore qu’une possibilité; pourriez-vous aussi vérifier jeudi en fin d’après-midi ?",
        "If I understand, Friday at three is only possible; could you also check late Thursday?"
      ],
      [
        "Agente",
        "Bien sûr, je vais comparer les deux créneaux et vous envoyer une réponse écrite après avoir consulté notre planning actualisé.",
        "Of course, I'll compare both slots and write after checking our updated schedule."
      ],
      [
        "Client",
        "Merci pour votre aide; je garderai mon ancien rendez-vous dans mon agenda jusqu’à ce que vous m’ayez confirmé la modification.",
        "Thanks; I'll keep the old appointment on my calendar until the modification is confirmed."
      ]
    ],
    "tasks": [
      [
        "fill",
        "Je voudrais savoir ___ le créneau est libre.",
        "si",
        "Indirect yes/no questions use si and standard word order.",
        [],
        "indirect question"
      ],
      [
        "choice",
        "Which statement indicates a tentative slot?",
        "Nous pourrions envisager vendredi.",
        "Pourrions expresses a possibility rather than a final arrangement.",
        [
          "Le rendez-vous est confirmé.",
          "Nous pourrions envisager vendredi.",
          "La réservation a été validée."
        ],
        "conditional nuance"
      ],
      [
        "reading",
        "Why is the client calling?",
        "un imprévu professionnel",
        "The client states a work conflict with the Thursday appointment.",
        [
          "un imprévu professionnel",
          "une panne de train",
          "une facture perdue"
        ],
        "listening inference"
      ],
      [
        "fill",
        "Pourriez-vous ___ l’heure du rendez-vous ?",
        "préciser",
        "Préciser requests the specific time needed for clarity.",
        [],
        "polite request"
      ],
      [
        "choice",
        "Which time is not yet approved?",
        "vendredi à quinze heures",
        "The agent must check availability before accepting Friday at three.",
        [
          "jeudi à neuf heures confirmé",
          "vendredi à quinze heures",
          "aucun rendez-vous n’existe"
        ],
        "evidence"
      ],
      [
        "order",
        "Arrange: pas encore confirmé / Le changement n’est",
        "Le changement n’est pas encore confirmé",
        "The negative phrase keeps the proposal separate from approval.",
        [
          "pas encore confirmé",
          "Le changement n’est"
        ],
        "word order"
      ],
      [
        "fill",
        "Je vais consulter notre ___ actualisé.",
        "planning",
        "Planning refers to the schedule the agent still needs to inspect.",
        [],
        "service vocabulary"
      ],
      [
        "reading",
        "Which additional option does the client ask about?",
        "jeudi en fin d’après-midi",
        "The client proposes another late-Thursday time to be checked.",
        [
          "samedi matin",
          "jeudi en fin d’après-midi",
          "mardi à midi"
        ],
        "detail"
      ],
      [
        "choice",
        "How should the client treat the old appointment?",
        "keep it until a change is confirmed",
        "The client explicitly says the previous time stays in the calendar pending confirmation.",
        [
          "erase it immediately",
          "keep it until a change is confirmed",
          "declare the new slot booked"
        ],
        "practical reasoning"
      ],
      [
        "fill",
        "Je vous ___ après avoir vérifié le calendrier. (rappeler, future)",
        "rappellerai",
        "The future of rappeler doubles l: rappellerai.",
        [],
        "future irregular spelling"
      ]
    ],
    "writing": [
      "Write an eight-sentence follow-up message after an inconclusive appointment call.",
      [
        "Give the existing time and both proposed alternatives.",
        "Distinguish proposed availability from confirmed booking.",
        "End with a polite request for exact written confirmation."
      ],
      "Objet : Suite à notre appel concernant le rendez-vous. Bonjour Madame, je vous remercie pour notre échange téléphonique de ce matin. Mon rendez-vous initial est prévu jeudi à neuf heures, mais un imprévu professionnel m’empêche de venir. Vous avez proposé de vérifier vendredi à quinze heures ainsi que jeudi en fin d’après-midi. Si j’ai bien compris, aucun de ces créneaux n’est encore confirmé. Je conserve donc l’horaire initial dans mon agenda. Pourriez-vous me préciser par écrit la date retenue lorsque votre planning aura été vérifié ? Je vous remercie pour votre aide. Cordialement, Léa."
    ],
    "reading": {
      "title": "Un appel, deux propositions et une seule question",
      "paragraphs": [
        "Le centre médical reçoit un appel de Léa, qui ne peut plus assister à son rendez-vous prévu jeudi matin. Elle explique calmement que son employeur lui a demandé de participer à une réunion imprévue. L'agente d'accueil propose d'examiner vendredi à quinze heures, mais précise que la personne qui doit recevoir Léa pourrait être absente. Elle ne confirme donc pas immédiatement ce créneau. Léa reformule la proposition pour s'assurer qu'elle a compris ce qui est disponible et ce qui reste à vérifier.",
        "Pendant la conversation, Léa évoque une autre possibilité : jeudi en fin d'après-midi. L'agente promet de comparer les deux options sur le planning actualisé et d'envoyer un message écrit. Le téléphone ne permet pas de résoudre toute la situation, car la disponibilité dépend d'un autre professionnel. L'agente préfère attendre des informations fiables plutôt que de donner une réponse rassurante mais inexacte. Elle note le nom de Léa et la référence du rendez-vous initial.",
        "Après l'appel, Léa rédige un court courriel récapitulatif. Elle remercie l'agente, rappelle les deux créneaux évoqués et demande quelle date sera finalement retenue. Elle ne présente pas vendredi comme une réservation acceptée et conserve l'ancien horaire jusqu'à confirmation. Son message montre que reformuler ne consiste pas à répéter toutes les paroles : il faut identifier les détails utiles, le point encore incertain et l'action qui permettra d'obtenir une décision."
      ],
      "questions": [
        [
          "Which date is definitively confirmed at the end of the call?",
          "aucune nouvelle date",
          [
            "vendredi à quinze heures",
            "aucune nouvelle date",
            "jeudi soir"
          ],
          "The agent promises to check options but never provides final booking confirmation."
        ],
        [
          "Why can the agent not confirm immediately?",
          "la disponibilité d’un professionnel reste inconnue",
          [
            "la disponibilité d’un professionnel reste inconnue",
            "Léa a oublié son nom",
            "le centre est fermé"
          ],
          "Another professional's schedule determines whether the proposed time is viable."
        ],
        [
          "What makes the follow-up email effective?",
          "il résume les options et la question ouverte",
          [
            "il transforme la proposition en accord",
            "il résume les options et la question ouverte",
            "il exige un remboursement"
          ],
          "The message accurately summarizes possibilities while requesting an actual confirmed time."
        ]
      ]
    },
    "listening": [
      [
        "What causes the client to request a change?",
        "un imprévu professionnel",
        [
          "une fermeture de salle",
          "un imprévu professionnel",
          "un changement de téléphone"
        ],
        "The first turn explains that work prevents attending the scheduled Thursday time."
      ],
      [
        "What does the agent promise to send?",
        "une réponse écrite",
        [
          "une réponse écrite",
          "une facture immédiate",
          "une invitation déjà confirmée"
        ],
        "The agent will compare options and send a written reply after consulting the schedule."
      ]
    ],
    "oral": {
      "prompt": "Summarize the telephone conversation aloud in about one minute, distinguishing what was proposed from what was confirmed.",
      "plan": [
        "Identify the original problem and existing appointment.",
        "Name both alternative slots and explain why neither is approved.",
        "Close with the promised next action."
      ],
      "model": "Le client ne peut pas assister à son rendez-vous du jeudi matin à cause d’un imprévu professionnel. L’agente envisage vendredi à quinze heures et doit aussi vérifier jeudi en fin d’après-midi. Aucun créneau n’est encore confirmé, car le planning doit être consulté. L’agente enverra une réponse écrite. Il serait donc trop tôt d’annoncer que le rendez-vous a déjà été modifié."
    }
  },
  {
    "id": "b1-30",
    "title": "Resolve a service complaint constructively",
    "goal": "State a fault, paraphrase the offered remedy and request verifiable next steps.",
    "grammarIds": [],
    "grammar": [
      [
        "Problem, effect and requested resolution",
        "Une réclamation utile separates the observation (le colis est arrivé abîmé), its practical effect (je ne peux pas l'utiliser) and the requested response (pourriez-vous indiquer les possibilités ?). Avoid claiming a particular refund right when policy details are unknown. Parce que introduces a cause; c'est pourquoi introduces the consequence or reason for making contact.",
        [
          [
            "L'article est arrivé cassé; c'est pourquoi je vous écris.",
            "The item arrived broken; that is why I am writing."
          ],
          [
            "Je souhaiterais connaître les solutions proposées.",
            "I would like to know the offered solutions."
          ]
        ],
        [
          "Je veux un remboursement parce que toutes les règles me donnent raison.",
          "Je souhaiterais connaître les solutions possibles après vérification.",
          "Without established policy, do not invent legal entitlements."
        ]
      ],
      [
        "Conditional offers versus completed agreements",
        "Nous pourrions proposer un échange differs from l'échange est confirmé. Après vérification is a prerequisite, not proof the check happened. Si j'ai bien compris checks an offered option; pourriez-vous me confirmer par écrit asks for a durable record. In an accurate complaint response, name which steps the company actually agreed to and which remain pending.",
        [
          [
            "Un échange serait possible après vérification du dossier.",
            "An exchange may be possible after the file is checked."
          ],
          [
            "Pourriez-vous confirmer la solution choisie par écrit ?",
            "Could you confirm the chosen remedy in writing?"
          ]
        ],
        [
          "Vous avez proposé une étude; mon remplacement est donc envoyé.",
          "Vous avez proposé de vérifier mon dossier; j’attends la décision.",
          "An offer to investigate is not an approved replacement."
        ]
      ]
    ],
    "vocabulary": [
      [
        "une réclamation",
        "complaint",
        "Je prépare une réclamation claire."
      ],
      [
        "un défaut",
        "defect",
        "J’ai remarqué un défaut visible."
      ],
      [
        "endommagé",
        "damaged",
        "L’objet est endommagé."
      ],
      [
        "un échange",
        "exchange",
        "Un échange peut être envisagé."
      ],
      [
        "un remboursement",
        "refund",
        "Je demande les conditions de remboursement."
      ],
      [
        "une vérification",
        "inspection",
        "Une vérification doit être effectuée."
      ],
      [
        "une preuve",
        "evidence",
        "Je conserve une preuve d’achat."
      ],
      [
        "une référence",
        "reference",
        "Voici la référence de commande."
      ],
      [
        "une solution",
        "solution",
        "Quelle solution proposez-vous ?"
      ],
      [
        "un délai",
        "timeframe",
        "Le délai reste à confirmer."
      ],
      [
        "par écrit",
        "in writing",
        "Merci de répondre par écrit."
      ],
      [
        "un accord",
        "agreement",
        "Aucun accord final n’est encore signé."
      ]
    ],
    "dialogue": [
      [
        "Client",
        "Bonjour, j’ai reçu hier la lampe commandée la semaine dernière, mais une pièce est cassée et je ne peux pas utiliser l’article.",
        "Hello, the lamp I ordered arrived yesterday, but a part is broken and I cannot use it."
      ],
      [
        "Conseillère",
        "Je suis désolée pour ce problème; pourriez-vous communiquer la référence de commande et décrire précisément la pièce endommagée ?",
        "I am sorry; could you provide the reference and describe the damaged part?"
      ],
      [
        "Client",
        "Voici la référence et une description du défaut; je souhaiterais savoir si un échange ou une autre solution pourrait être étudié.",
        "Here are the reference and defect; I would like to know if an exchange or other solution is possible."
      ],
      [
        "Conseillère",
        "Nous allons d’abord examiner votre dossier; ensuite, nous vous préciserons les options disponibles, mais je ne peux encore rien confirmer.",
        "We will first review the case; then clarify options, but I cannot confirm anything yet."
      ],
      [
        "Client",
        "Si j’ai bien compris, aucune solution n’est encore approuvée; pourriez-vous m’envoyer les prochaines étapes et le délai indicatif par écrit ?",
        "So no solution is approved yet; could you send the steps and estimated timeframe in writing?"
      ]
    ],
    "tasks": [
      [
        "fill",
        "Je voudrais déposer une ___ concernant cet article.",
        "réclamation",
        "A réclamation communicates a problem and requests resolution.",
        [],
        "service context"
      ],
      [
        "choice",
        "What was actually offered?",
        "un examen du dossier",
        "The adviser offers to review the case, not an approved refund.",
        [
          "un remboursement garanti",
          "un examen du dossier",
          "un échange déjà envoyé"
        ],
        "status"
      ],
      [
        "reading",
        "Why can the client not use the item?",
        "une pièce est cassée",
        "The first turn reports the lamp has a broken part.",
        [
          "une pièce est cassée",
          "il manque l’adresse",
          "le client veut une autre couleur"
        ],
        "detail"
      ],
      [
        "fill",
        "La pièce est ___ et doit être examinée.",
        "endommagée",
        "The feminine participial adjective agrees with pièce.",
        [],
        "adjective agreement"
      ],
      [
        "choice",
        "Which question requests an actual record?",
        "Pourriez-vous répondre par écrit ?",
        "A written reply would make next steps verifiable.",
        [
          "C’est déjà accepté !",
          "Pourriez-vous répondre par écrit ?",
          "Je suppose que tout est fini."
        ],
        "formal request"
      ],
      [
        "order",
        "Arrange: reste à confirmer / La solution",
        "La solution reste à confirmer",
        "An unresolved remedy must be represented as pending.",
        [
          "reste à confirmer",
          "La solution"
        ],
        "sentence order"
      ],
      [
        "fill",
        "Un ___ pourrait être envisagé après vérification.",
        "échange",
        "Échange names a potential replacement transaction, not an approved outcome.",
        [],
        "vocabulary"
      ],
      [
        "reading",
        "What two details does the client request at the end?",
        "les étapes et le délai indicatif",
        "The final turn requests next steps and an estimated timeframe.",
        [
          "un autre colis et une facture",
          "les étapes et le délai indicatif",
          "une adresse et un taxi"
        ],
        "inference"
      ],
      [
        "choice",
        "Which statement correctly distinguishes proposal from approval?",
        "L’entreprise va vérifier avant de décider.",
        "The verification is upcoming and cannot be equated with approval.",
        [
          "L’échange a déjà eu lieu.",
          "L’entreprise va vérifier avant de décider.",
          "Le remboursement est garanti."
        ],
        "source accuracy"
      ],
      [
        "fill",
        "Pourriez-vous me confirmer la réponse ___ écrit ?",
        "par",
        "Par écrit describes written confirmation rather than oral assurance.",
        [],
        "register"
      ]
    ],
    "writing": [
      "Draft a service complaint that distinguishes observed damage, its impact, offered options and unresolved confirmation.",
      [
        "Give the item, purchase context, precise defect and practical effect.",
        "Use a polite conditional request without inventing policy.",
        "Ask for a written next step and estimated timeframe."
      ],
      "Objet : Article endommagé — demande de vérification. Bonjour Madame, j’ai reçu hier une lampe dont une pièce est cassée. Le défaut empêche une utilisation normale de l’article. Je dispose de la référence de commande et peux décrire le problème précisément. Je souhaiterais connaître les solutions possibles, notamment si un échange peut être envisagé. Je comprends qu’une vérification préalable de mon dossier sera nécessaire. Pourriez-vous m’indiquer les prochaines étapes et le délai indicatif de réponse ? Je vous remercie pour votre aide. Cordialement, Alex."
    ],
    "reading": {
      "title": "Une lampe cassée et une réponse encore ouverte",
      "paragraphs": [
        "Alex commande une lampe pour son bureau et la reçoit au début de la semaine. En ouvrant la boîte, il constate qu'une petite pièce de fixation est cassée. La lampe ne peut pas être installée correctement. Il garde la référence de commande et écrit un message au service client, sans affirmer qu'il connaît déjà toutes les conditions d'échange. Son premier message explique l'état de l'objet, précise la date de réception et décrit la conséquence pratique du défaut.",
        "Le service répond avec courtoisie et demande une description plus précise de la pièce. L'agente explique que l'entreprise doit examiner le dossier avant d'indiquer si un échange ou une autre solution peut être proposé. Alex est impatient, mais il remarque qu'aucune décision n'a été prise. Il choisit de ne pas reformuler la réponse comme une promesse de remplacement. Il rassemble les informations disponibles et les communique dans un second message.",
        "Lors d'un appel, Alex résume les étapes déjà effectuées : réception, constat du défaut, premier courriel, demande de renseignements. Il reformule la proposition de l'agente, puis demande quand une réponse pourrait arriver. Celle-ci promet de préciser les possibilités après vérification et de les communiquer par écrit. Alex termine l'échange en confirmant ce qui reste à faire, sans présenter le dossier comme accepté. Son compte rendu est clair parce qu'il sépare le dommage observé de la décision attendue."
      ],
      "questions": [
        [
          "Which fact is directly observed?",
          "une pièce de fixation est cassée",
          [
            "une pièce de fixation est cassée",
            "la politique impose un remboursement",
            "le vendeur a refusé toute aide"
          ],
          "Alex observes a broken fastening part; the company's remedies remain to be determined."
        ],
        [
          "Why does Alex avoid announcing a replacement?",
          "aucune décision n’a été communiquée",
          [
            "l’article fonctionne bien",
            "aucune décision n’a été communiquée",
            "le service refuse de répondre"
          ],
          "The agent says the case requires examination before options can be specified."
        ],
        [
          "What distinguishes the final summary from a complaint alone?",
          "il précise les étapes et l’attente",
          [
            "il précise les étapes et l’attente",
            "il exige un droit inconnu",
            "il accuse sans preuve"
          ],
          "The final summary tracks the process and what remains pending."
        ]
      ]
    },
    "listening": [
      [
        "What defect does the client report?",
        "une pièce de lampe cassée",
        [
          "un câble trop long",
          "une pièce de lampe cassée",
          "une couleur incorrecte"
        ],
        "The client explains that a broken part prevents using the lamp."
      ],
      [
        "What does the adviser commit to do first?",
        "examiner le dossier",
        [
          "envoyer un remboursement",
          "examiner le dossier",
          "annuler la commande"
        ],
        "She explicitly says the case must be examined before options can be confirmed."
      ]
    ],
    "oral": {
      "prompt": "Explain the complaint and proposed response aloud to a neutral third person, without overstating the agent's promise.",
      "plan": [
        "State the observable defect and practical effect.",
        "Explain the agent's actual proposed review.",
        "Specify the requested written follow-up and what is not yet agreed."
      ],
      "model": "Le client a reçu une lampe dont une pièce est cassée, ce qui l’empêche de l’utiliser normalement. Il a communiqué sa référence et demandé quelles solutions pouvaient être envisagées. La conseillère a promis d’examiner le dossier, mais aucun échange ni remboursement n’a été approuvé. Le client souhaite donc recevoir une réponse écrite précisant les options et un délai indicatif. Il serait inexact de présenter la vérification comme une décision finale."
    }
  },
  {
    "id": "b1-31",
    "title": "Moderate a community discussion fairly",
    "goal": "Acknowledge divergent views and summarize actionable consensus without inventing agreement.",
    "grammarIds": [],
    "grammar": [
      [
        "Comparing perspectives with concession",
        "Certains … tandis que d’autres … presents different views without exaggerating the number of supporters. Cela dit acknowledges another perspective; certes … mais balances its merit and limitation. A meeting facilitator should attribute viewpoints and ask whether a summary is accurate. Avoid using tout le monde when some participants have not expressed a view.",
        [
          [
            "Certains préfèrent le samedi, tandis que d’autres travaillent ce jour-là.",
            "Some prefer Saturday, whereas others work that day."
          ],
          [
            "Certes, une salle facilite les échanges, mais les déplacements coûtent du temps.",
            "A room helps discussion, but travel takes time."
          ]
        ],
        [
          "Deux personnes sont d’accord, donc tout le groupe accepte.",
          "Deux personnes sont favorables, mais le groupe doit encore répondre.",
          "Two voices cannot stand for an entire group's consent."
        ]
      ],
      [
        "Reporting a tentative shared next step",
        "Nous pourrions + infinitive offers a proposal; nous avons convenu de reports an actual agreement. A facilitator can state il reste à décider ... and ask for written feedback. Reaching agreement on *checking* a proposal does not mean agreeing to implement it. Use pour que + subjunctive for the purpose of enabling all parties: pour que chacun puisse s’exprimer.",
        [
          [
            "Nous avons convenu de recueillir les réponses avant lundi.",
            "We agreed to collect responses before Monday."
          ],
          [
            "Il reste à décider si la réunion sera en ligne.",
            "It remains to decide whether the meeting will be online."
          ]
        ],
        [
          "Nous avons convenu de demander des avis, donc le format est adopté.",
          "Nous avons convenu de consulter les membres; le format reste ouvert.",
          "Agreement to consult is not agreement to adopt."
        ]
      ]
    ],
    "vocabulary": [
      [
        "animer",
        "to facilitate",
        "Elle anime la discussion."
      ],
      [
        "modérer",
        "to moderate",
        "Il modère les échanges."
      ],
      [
        "un désaccord",
        "disagreement",
        "Le désaccord reste respectueux."
      ],
      [
        "un point commun",
        "common ground",
        "Cherchons un point commun."
      ],
      [
        "une réserve",
        "reservation",
        "Je comprends cette réserve."
      ],
      [
        "certes",
        "admittedly",
        "Certes, cette option a un avantage."
      ],
      [
        "tandis que",
        "whereas",
        "Certains viennent, tandis que d’autres attendent."
      ],
      [
        "convenir de",
        "agree on",
        "Nous convenons d’un prochain échange."
      ],
      [
        "consulter",
        "consult",
        "Il faut consulter le groupe."
      ],
      [
        "un consensus",
        "consensus",
        "Aucun consensus n’est encore trouvé."
      ],
      [
        "un compte rendu",
        "summary/minutes",
        "Le compte rendu précise les tâches."
      ],
      [
        "une décision",
        "decision",
        "La décision sera annoncée après consultation."
      ]
    ],
    "dialogue": [
      [
        "Animatrice",
        "Nous devons choisir un format pour notre rencontre; je propose que chacun explique ses contraintes avant que nous discutions des solutions possibles.",
        "We must choose a format; I'd like everyone to describe constraints before discussing solutions."
      ],
      [
        "Léon",
        "Je préfère une rencontre en personne parce que les échanges spontanés me semblent plus simples et que nous travaillons mieux ensemble.",
        "I prefer meeting in person for spontaneity and collaboration."
      ],
      [
        "Mariam",
        "Je comprends cet avantage, mais certaines personnes habitent loin; une participation à distance réduirait leurs déplacements.",
        "I understand, but some live far away and online participation would reduce travel."
      ],
      [
        "Animatrice",
        "Si j’ai bien compris, nous partageons l’objectif de faire participer tout le monde, mais nous ne sommes pas encore d’accord sur le moyen.",
        "If I understand, we share participation as the goal but disagree on the method."
      ],
      [
        "Léon",
        "Oui, je propose que nous consultions les autres membres et vérifiions le matériel, sans annoncer aujourd’hui un format définitif.",
        "Yes, consult other members and check equipment without announcing a final format today."
      ]
    ],
    "tasks": [
      [
        "fill",
        "Certains préfèrent venir, ___ que d’autres souhaitent participer en ligne.",
        "tandis",
        "Tandis que contrasts two genuine preferences without implying universal agreement.",
        [],
        "contrast"
      ],
      [
        "choice",
        "What did the participants actually agree on?",
        "consulter et vérifier",
        "They agree to consult others and check resources, not to adopt a format.",
        [
          "se réunir toujours en ligne",
          "consulter et vérifier",
          "interdire les rencontres"
        ],
        "consensus boundary"
      ],
      [
        "reading",
        "What goal do Léon and Mariam share?",
        "la participation de tous",
        "The facilitator identifies participation as the common goal despite different methods.",
        [
          "la participation de tous",
          "les transports gratuits",
          "un budget illimité"
        ],
        "common ground"
      ],
      [
        "fill",
        "Nous voulons que chacun ___ participer. (pouvoir)",
        "puisse",
        "A wish involving another subject takes the subjunctive puisse.",
        [],
        "subjunctive"
      ],
      [
        "choice",
        "Which sentence fairly reflects the disagreement?",
        "Ils partagent le but mais préfèrent des moyens différents.",
        "It preserves agreement on the goal and difference on the format.",
        [
          "Tous préfèrent le présentiel.",
          "Ils partagent le but mais préfèrent des moyens différents.",
          "Personne ne veut participer."
        ],
        "fair paraphrase"
      ],
      [
        "order",
        "Arrange: reste à décider / Le format",
        "Le format reste à décider",
        "The infinitive marks a still-pending decision.",
        [
          "reste à décider",
          "Le format"
        ],
        "status"
      ],
      [
        "fill",
        "La personne qui dirige les échanges les ___.",
        "modère",
        "Modérer describes guiding discussion and maintaining fairness.",
        [],
        "vocabulary"
      ],
      [
        "reading",
        "Which advantage does Léon mention?",
        "les échanges spontanés",
        "Léon explicitly values spontaneous conversation and working together in person.",
        [
          "les échanges spontanés",
          "les transports gratuits",
          "les présentations enregistrées"
        ],
        "listening detail"
      ],
      [
        "choice",
        "Which phrase accurately indicates a next step?",
        "Nous consulterons les autres membres.",
        "Future consultation is a concrete plan, not approval of a format.",
        [
          "Le format est définitivement choisi.",
          "Nous consulterons les autres membres.",
          "Le groupe ne sera jamais consulté."
        ],
        "action"
      ],
      [
        "fill",
        "Nous cherchons un point ___ malgré le désaccord.",
        "commun",
        "Point commun denotes the shared aim the facilitator identifies.",
        [],
        "nuance"
      ]
    ],
    "writing": [
      "Prepare a balanced discussion summary distinguishing shared goals, opposing constraints and an agreed next action.",
      [
        "Attribute each position and acknowledge its strongest argument.",
        "Identify common ground without inventing a final consensus.",
        "State the consultation and technical verification required before choosing."
      ],
      "Le groupe a discuté du format de la prochaine rencontre. Léon préfère une réunion en personne, car elle facilite selon lui les échanges spontanés. Mariam souligne qu’une solution à distance aiderait les personnes habitant loin. Tous deux souhaitent permettre une participation réelle, mais ils ne s’accordent pas encore sur le moyen. La discussion a permis de convenir d’une consultation des autres membres et d’une vérification du matériel. Le format définitif reste donc à décider après réception des réponses. Ce résumé distingue les avis, l’objectif partagé et la prochaine étape."
    ],
    "reading": {
      "title": "Le même objectif, plusieurs chemins",
      "paragraphs": [
        "Une association de quartier doit préparer une rencontre annuelle. Lors de la réunion de planification, Léon défend le principe d'une rencontre en personne. Il explique que les bénévoles communiquent plus spontanément lorsqu'ils peuvent discuter directement. Mariam préfère qu'une participation à distance soit possible, car plusieurs membres travaillent tard ou vivent loin du centre. Chacun apporte une expérience différente, mais aucun des deux ne prétend parler au nom de tous les participants.",
        "L'animatrice interrompt brièvement le débat pour reformuler ce qu'elle a entendu. Elle souligne que Léon et Mariam veulent tous deux favoriser des échanges de qualité et permettre à chacun de contribuer. Leur désaccord porte plutôt sur les moyens : la présence physique facilite certaines conversations, tandis que le déplacement exclut parfois les personnes éloignées. Elle demande aux participants si ce résumé correspond à leur avis. Les deux confirment, sans pour autant accepter immédiatement la solution de l'autre.",
        "Le groupe convient finalement de contacter les autres membres et de vérifier la capacité du système de visioconférence. Une personne rédigera les questions de consultation; une autre cherchera les moyens techniques disponibles. Le compte rendu mentionnera ces actions, mais ne déclarera pas que le format mixte a été adopté. La réunion illustre ainsi une différence importante : il est possible de se mettre d'accord sur la manière de décider sans être déjà d'accord sur la décision elle-même."
      ],
      "questions": [
        [
          "What was shared by the opposing speakers?",
          "la volonté de permettre la participation",
          [
            "la volonté de permettre la participation",
            "le choix du format mixte",
            "le refus de consulter"
          ],
          "Both express a desire for meaningful participation despite disagreeing about format."
        ],
        [
          "What exactly was agreed upon?",
          "consulter et vérifier les moyens techniques",
          [
            "adopter le présentiel",
            "consulter et vérifier les moyens techniques",
            "annuler la rencontre"
          ],
          "They agree only on the consultation and equipment-check process."
        ],
        [
          "Which inference about the moderator is supported?",
          "elle reformule et vérifie la compréhension",
          [
            "elle impose son avis",
            "elle reformule et vérifie la compréhension",
            "elle refuse les opinions"
          ],
          "She checks her paraphrase with speakers before recording it."
        ]
      ]
    },
    "listening": [
      [
        "What does Léon prefer?",
        "une rencontre en personne",
        [
          "une rencontre en personne",
          "un sondage uniquement",
          "une rencontre annulée"
        ],
        "Léon clearly describes his preference for direct in-person discussion."
      ],
      [
        "What does the moderator say is still disputed?",
        "le moyen de participer",
        [
          "le moyen de participer",
          "l’objectif de participation",
          "le nom du groupe"
        ],
        "The moderator identifies a shared objective but a disagreement over how to reach it."
      ]
    ],
    "oral": {
      "prompt": "Give a 75-second balanced oral summary of the group discussion as if addressing members who could not attend.",
      "plan": [
        "Explain each preference using neutral attribution.",
        "Identify the goal both sides share and the actual point of disagreement.",
        "Report only the consultation and check as agreed next steps."
      ],
      "model": "Pendant la réunion, Léon a préféré un format en personne, car il apprécie les échanges directs. Mariam a proposé une participation à distance afin de réduire les déplacements. Les deux intervenants souhaitent que les membres puissent réellement participer. Leur désaccord concerne le format et non cet objectif commun. Le groupe n’a pas encore choisi de solution définitive. Il a seulement convenu de consulter les absents et de vérifier le matériel disponible avant de prendre une décision."
    }
  },
  {
    "id": "b1-32",
    "title": "Present evidence and acknowledge its limits",
    "goal": "Explain a small survey or study without confusing correlation, coverage and causal proof.",
    "grammarIds": [],
    "grammar": [
      [
        "Quantifying and attributing accurately",
        "Dans une enquête, vingt personnes sur cinquante ... names the denominator explicitly, whereas vingt pour cent des personnes interrogées is about survey respondents and must not be generalized automatically to an entire city. Use selon cette enquête to attribute numbers. A comparison from twenty to thirty percent is a ten-point increase, not a ten-percent relative increase. Numbers require units and a clear population.",
        [
          [
            "Selon l’enquête, trente pour cent des répondants prennent le bus.",
            "According to the survey, thirty percent of respondents use the bus."
          ],
          [
            "La proportion augmente de dix points de pourcentage.",
            "The proportion rises by ten percentage points."
          ]
        ],
        [
          "De vingt à trente pour cent, c’est dix pour cent de hausse.",
          "De vingt à trente pour cent, c’est dix points de pourcentage de plus.",
          "This is ten percentage points; the relative rise would be different."
        ]
      ],
      [
        "Evidence, interpretation and limitation",
        "Le graphique montre ... can report a visible change, but cela ne prouve pas que ... identifies a reasoning limit. Étant donné que introduces a known explanation, yet you cannot assume a cause without evidence. Correlation between two rising series does not establish which influences the other. A responsible oral presentation includes the unknown sample size, sampling method and any unresolved alternative explanations.",
        [
          [
            "Le résultat pourrait refléter un changement de participants.",
            "The result might reflect a change in respondents."
          ],
          [
            "Ces deux évolutions ne démontrent pas une relation de cause à effet.",
            "These two trends do not demonstrate causation."
          ]
        ],
        [
          "Les valeurs augmentent ensemble, donc la première cause la seconde.",
          "Les valeurs augmentent ensemble, sans que la causalité soit établie.",
          "Co-movement alone does not prove a causal explanation."
        ]
      ]
    ],
    "vocabulary": [
      [
        "un échantillon",
        "sample",
        "La taille de l’échantillon est inconnue."
      ],
      [
        "un répondant",
        "respondent",
        "Le répondant indique son choix."
      ],
      [
        "un pourcentage",
        "percentage",
        "Le pourcentage reste précis."
      ],
      [
        "un point de pourcentage",
        "percentage point",
        "La part gagne dix points."
      ],
      [
        "une enquête",
        "survey",
        "L’enquête interroge des volontaires."
      ],
      [
        "une méthode",
        "method",
        "La méthode n’est pas décrite."
      ],
      [
        "une cause",
        "cause",
        "La cause reste inconnue."
      ],
      [
        "une corrélation",
        "correlation",
        "Une corrélation ne suffit pas."
      ],
      [
        "une conclusion",
        "conclusion",
        "La conclusion doit rester prudente."
      ],
      [
        "un résultat",
        "finding",
        "Ce résultat concerne les répondants."
      ],
      [
        "une limite",
        "limitation",
        "Il existe une limite méthodologique."
      ],
      [
        "selon",
        "according to",
        "Selon cette enquête, les réponses diffèrent."
      ]
    ],
    "dialogue": [
      [
        "Élise",
        "Dans le premier questionnaire, vingt pour cent des répondants préféraient le train; dans le second, cette proportion atteint trente pour cent.",
        "In the first survey twenty percent preferred trains; in the second thirty percent did."
      ],
      [
        "Nassim",
        "Cela représente une hausse de dix points de pourcentage, mais sais-tu si les deux enquêtes ont interrogé le même type de participants ?",
        "That is a ten-percentage-point rise, but were participants comparable?"
      ],
      [
        "Élise",
        "Je ne le sais pas, car la présentation ne donne ni la taille des échantillons ni les questions exactes qui ont été posées.",
        "I don't know; the summary omits sample sizes and precise questions."
      ],
      [
        "Nassim",
        "Nous pouvons décrire les deux chiffres, mais nous ne devons pas affirmer que toute la population a changé d’avis ou que la nouvelle ligne en est la cause.",
        "We may describe the values but must not claim the entire population changed or a new line caused it."
      ],
      [
        "Élise",
        "Je présenterai donc les résultats avec leur dénominateur et expliquerai quelles informations supplémentaires permettraient une comparaison plus solide.",
        "I will state the respondent base and the information needed for a firmer comparison."
      ]
    ],
    "tasks": [
      [
        "fill",
        "La valeur passe de vingt à trente pour cent, soit dix ___ de pourcentage.",
        "points",
        "Percentage points are absolute differences between percentage rates.",
        [],
        "units"
      ],
      [
        "choice",
        "Who do the reported percentages describe?",
        "les répondants",
        "The cited data concern survey respondents, not necessarily the full public.",
        [
          "toute la population",
          "les répondants",
          "tous les voyageurs"
        ],
        "denominator"
      ],
      [
        "reading",
        "Which information is missing?",
        "les tailles d’échantillon et les questions",
        "Élise says the report omits sample sizes and exact question wording.",
        [
          "le jour de la semaine",
          "les tailles d’échantillon et les questions",
          "le coût du train"
        ],
        "missing methods"
      ],
      [
        "fill",
        "Une ___ ne prouve pas à elle seule une cause.",
        "corrélation",
        "Correlation can exist without a demonstrated causal connection.",
        [],
        "causal reasoning"
      ],
      [
        "choice",
        "Which assertion is sufficiently cautious?",
        "Les résultats diffèrent entre les enquêtes.",
        "This reports the observable contrast without extrapolating beyond available data.",
        [
          "Tous les habitants ont changé d’avis.",
          "Les résultats diffèrent entre les enquêtes.",
          "La nouvelle ligne a certainement tout changé."
        ],
        "certainty"
      ],
      [
        "order",
        "Arrange: doit être précisée / La taille de l’échantillon",
        "La taille de l’échantillon doit être précisée",
        "The passive obligation identifies the missing methodological detail.",
        [
          "doit être précisée",
          "La taille de l’échantillon"
        ],
        "word order"
      ],
      [
        "fill",
        "___ cette enquête, les préférences semblent évoluer.",
        "Selon",
        "Selon attributes a claim to a specific survey rather than a universal truth.",
        [],
        "attribution"
      ],
      [
        "reading",
        "Why does Nassim reject an automatic causal explanation?",
        "aucune preuve de causalité n’est fournie",
        "Two percentages alone cannot show that a new train line caused changed responses.",
        [
          "il n’aime pas les trains",
          "aucune preuve de causalité n’est fournie",
          "le questionnaire était gratuit"
        ],
        "inference"
      ],
      [
        "choice",
        "What relative change is from 20% to 30%?",
        "cinquante pour cent",
        "A rise of 10 on a base of 20 equals a 50% relative increase.",
        [
          "dix pour cent",
          "vingt pour cent",
          "cinquante pour cent"
        ],
        "relative percentage"
      ],
      [
        "fill",
        "Il faut connaître le ___ pour interpréter une proportion.",
        "dénominateur",
        "The denominator tells which population or count the share refers to.",
        [],
        "quantitative reading"
      ]
    ],
    "writing": [
      "Write a short evidence-aware oral presentation script about two survey results and what is not established.",
      [
        "Report the values and ten-percentage-point difference accurately.",
        "Name the respondent population and one unknown methodological detail.",
        "Avoid causal assertions and request specific missing data."
      ],
      "Bonjour à tous, je vais présenter deux résultats d’enquête sur le choix du transport. Dans la première enquête, vingt pour cent des répondants préféraient le train. Dans la seconde, cette part atteint trente pour cent, soit une hausse de dix points de pourcentage. Les chiffres montrent une différence entre les deux groupes interrogés. Cependant, nous ne connaissons ni la taille des échantillons ni les questions exactes. Nous ne pouvons donc pas affirmer que toute la ville a changé d’avis ou qu’une nouvelle ligne explique le résultat. Il faudrait consulter les méthodes avant de tirer une conclusion générale."
    ],
    "reading": {
      "title": "Quand les chiffres parlent, mais pas tout seuls",
      "paragraphs": [
        "Deux questionnaires portant sur les transports sont présentés lors d'une réunion municipale. Le premier indique que vingt pour cent des personnes interrogées préfèrent le train; le second en indique trente pour cent. L'organisatrice de la présentation calcule correctement une différence de dix points de pourcentage. Elle précise que les valeurs concernent les répondants, mais l'affiche utilisée pendant la réunion ne mentionne pas leur nombre total. Certains spectateurs ne remarquent pas cette absence d'information.",
        "Un participant affirme que la nouvelle ligne ferroviaire a persuadé tous les habitants de choisir le train. Une autre personne rappelle que la seconde enquête a peut-être interrogé un groupe différent. Les questions pourraient aussi avoir été formulées autrement. Aucune donnée du dossier ne permet de choisir entre ces hypothèses. Le simple fait que la proportion augmente ne prouve pas une cause particulière, ni même que l'évolution représente toute la population de la ville.",
        "À la fin, l'organisatrice modifie son résumé pour éviter un titre trop catégorique. Elle conserve les deux chiffres et les unités, tout en indiquant que la taille des échantillons et la méthode de sélection restent inconnues. Elle demande à consulter les questionnaires originaux avant de proposer une explication. La présentation devient plus utile, car le public peut distinguer le résultat observé, les interprétations possibles et les informations nécessaires pour comprendre réellement ce qui a changé."
      ],
      "questions": [
        [
          "Which is the correct absolute difference?",
          "dix points de pourcentage",
          [
            "dix pour cent relatifs",
            "dix points de pourcentage",
            "trente points"
          ],
          "The displayed shares are 20% and 30%, which differ by ten percentage points."
        ],
        [
          "What remains unproven?",
          "la cause du changement",
          [
            "la valeur de trente pour cent",
            "la cause du changement",
            "l’existence des questionnaires"
          ],
          "The report cannot establish why the two results differ."
        ],
        [
          "How does the presenter improve her summary?",
          "elle nomme les limites méthodologiques",
          [
            "elle invente une cause",
            "elle nomme les limites méthodologiques",
            "elle supprime tous les chiffres"
          ],
          "She retains observed values while exposing unknown sample details."
        ]
      ]
    },
    "listening": [
      [
        "What two percentages does Élise report?",
        "vingt et trente pour cent",
        [
          "vingt et trente pour cent",
          "dix et vingt pour cent",
          "trente et quarante pour cent"
        ],
        "Élise says the respondent share goes from twenty to thirty percent."
      ],
      [
        "What two pieces of methodology are unknown?",
        "échantillons et questions exactes",
        [
          "les tickets et les trains",
          "échantillons et questions exactes",
          "le lieu et le mois"
        ],
        "She says the report gives neither sample sizes nor exact survey questions."
      ]
    ],
    "oral": {
      "prompt": "Deliver a one-minute explanation of a two-survey comparison, with correct percentage points and two limitations.",
      "plan": [
        "Say exactly which respondents and values were measured.",
        "Distinguish percentage-point and relative changes.",
        "Explain why neither population-wide change nor causation is established."
      ],
      "model": "La première enquête présente vingt pour cent de répondants favorables au train, contre trente pour cent dans la seconde. Il s’agit d’une augmentation de dix points de pourcentage. En revanche, nous ne savons pas combien de personnes ont été interrogées ni si les méthodes étaient comparables. Ces valeurs ne démontrent pas une évolution de toute la population, et elles ne prouvent pas que la nouvelle ligne a causé le changement. Pour aller plus loin, il faudrait étudier les questionnaires originaux."
    }
  }
];
export const U12_LESSONS_29_32=Object.freeze(authored.map((spec,i)=>authorU12Lesson(spec,i+29)));
