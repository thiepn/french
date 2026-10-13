import {authorB1DepthUnit} from './u11-b1-model.ts';
import type {A1AuthoredSpec} from './u6-a1-model.ts';
const units:A1AuthoredSpec[]=[
  {
    "id": "b1-19",
    "title": "Follow an interview beyond the headline",
    "goal": "Recover a speaker’s qualifications and conditions instead of repeating a misleading headline.",
    "grammarIds": [],
    "grammar": [
      [
        "Question, answer and attribution",
        "Dans une interview, distinguez la question du journaliste et la réponse effectivement donnée. Selon la personne interrogée attributes an opinion, tandis que elle précise que introduces an explicit clarification. A headline may summarize only one part of a longer answer. Check whether a reported claim was expressed as a fact, possibility or condition before paraphrasing.",
        [
          [
            "Selon l’interviewée, la mesure pourrait aider certains usagers.",
            "According to the interviewee, the measure could help some users."
          ],
          [
            "Elle précise que le projet n’est pas encore approuvé.",
            "She specifies that the project is not yet approved."
          ]
        ],
        [
          "Elle a dit « tout le monde est d’accord », alors qu’elle a dit « certains ».",
          "Elle a dit que certains participants étaient d’accord.",
          "Do not enlarge a limited assertion into a universal quotation."
        ]
      ],
      [
        "Limits expressed by conditional and concession",
        "Pour autant does not follow logically just because a speaker accepts one point; it often means nevertheless. À condition de followed by infinitive names a condition with the same implicit actor, while à condition que usually takes subjunctive when subjects differ. The conditional pourrait signals a possible outcome, not a guaranteed result; preserve it when retelling an interview.",
        [
          [
            "Le service pourrait fonctionner à condition de disposer d’un agent.",
            "The service might work provided an employee is available."
          ],
          [
            "Bien que le projet soit intéressant, il nécessite encore une étude.",
            "Although the project is interesting, it still requires study."
          ]
        ],
        [
          "Le service pourrait aider, donc il aidera nécessairement.",
          "Le service pourrait aider, mais son efficacité reste à vérifier.",
          "Conditional possibility must not become a guaranteed outcome."
        ]
      ]
    ],
    "vocabulary": [
      [
        "une interview",
        "interview",
        "L’interview paraît demain."
      ],
      [
        "un titre",
        "headline",
        "Le titre simplifie la réponse."
      ],
      [
        "interroger",
        "to interview/question",
        "La journaliste interroge une responsable."
      ],
      [
        "préciser",
        "to clarify",
        "Elle précise son propos."
      ],
      [
        "selon",
        "according to",
        "Selon le responsable, rien n’est décidé."
      ],
      [
        "une réserve",
        "reservation",
        "Elle exprime une réserve."
      ],
      [
        "à condition de",
        "provided that",
        "On peut partir à condition de réserver."
      ],
      [
        "une citation",
        "quotation",
        "Cette citation est incomplète."
      ],
      [
        "une interprétation",
        "interpretation",
        "Mon interprétation est incertaine."
      ],
      [
        "un propos",
        "statement",
        "Respectez ses propos."
      ],
      [
        "une possibilité",
        "possibility",
        "Ce n’est qu’une possibilité."
      ],
      [
        "pour autant",
        "for all that",
        "Ce n’est pas confirmé pour autant."
      ]
    ],
    "dialogue": [
      [
        "Journaliste",
        "Vous proposez de prolonger les horaires de la salle commune, mais pouvez-vous affirmer que tous les habitants soutiennent cette idée ?",
        "You propose extending room hours, but can you say all residents support it?"
      ],
      [
        "Responsable",
        "Non, je ne peux pas l’affirmer; certains groupes nous ont donné un avis favorable, tandis que d’autres attendent davantage d’informations.",
        "No; some groups support it, while others await more information."
      ],
      [
        "Journaliste",
        "Le nouveau dispositif pourrait-il commencer dès le mois prochain, comme le laisse entendre le titre de notre annonce ?",
        "Could the new arrangement start next month, as the headline suggests?"
      ],
      [
        "Responsable",
        "Ce serait possible à condition de recruter une personne supplémentaire, mais nous n’avons pas encore vérifié les ressources disponibles.",
        "Possible if we hire another person, but we have not checked resources yet."
      ],
      [
        "Journaliste",
        "Je préciserai donc dans mon article qu’il s’agit d’une hypothèse et non d’une décision qui aurait déjà été prise.",
        "I will clarify that this is a hypothesis, not an already adopted decision."
      ]
    ],
    "tasks": [
      [
        "fill",
        "___ la responsable, le projet reste à l’étude.",
        "Selon",
        "Selon attributes the status to the person interviewed instead of the narrator.",
        [],
        "attribution"
      ],
      [
        "choice",
        "What does pourrait convey?",
        "a possibility",
        "The conditional presents a possible outcome, not a guarantee.",
        [
          "a completed approval",
          "a possibility",
          "a past obligation"
        ],
        "conditional nuance"
      ],
      [
        "reading",
        "Have all residents expressed support?",
        "non, seulement certains groupes",
        "The responsible person expressly limits the favorable responses to some groups.",
        [
          "oui, tous",
          "non, seulement certains groupes",
          "aucun groupe"
        ],
        "scope"
      ],
      [
        "fill",
        "Le projet avancerait à ___ de recruter une personne.",
        "condition",
        "À condition de introduces a necessary practical constraint.",
        [],
        "conditional prerequisite"
      ],
      [
        "choice",
        "What correction should be made to an optimistic headline?",
        "clarifier que la date n’est pas confirmée",
        "The manager has not verified resources for a next-month start.",
        [
          "annoncer une date certaine",
          "clarifier que la date n’est pas confirmée",
          "supprimer la réponse complète"
        ],
        "source fidelity"
      ],
      [
        "order",
        "Arrange: reste à vérifier / La possibilité de démarrer",
        "La possibilité de démarrer reste à vérifier",
        "The statement separates a tentative option from confirmed feasibility.",
        [
          "reste à vérifier",
          "La possibilité de démarrer"
        ],
        "syntax"
      ],
      [
        "fill",
        "Elle ___ que le projet n’est pas adopté.",
        "précise",
        "Préciser means to clarify a statement rather than expand its scope.",
        [],
        "reporting"
      ],
      [
        "reading",
        "Which practical condition remains unchecked?",
        "les ressources disponibles",
        "The official has not checked whether the resources are sufficient.",
        [
          "le nom du journaliste",
          "les ressources disponibles",
          "la météo"
        ],
        "inference"
      ],
      [
        "choice",
        "Which statement faithfully captures the answer?",
        "Certains sont favorables; la décision est en attente.",
        "It preserves limited support and the unconfirmed decision.",
        [
          "Tous ont accepté et le projet commencera demain.",
          "Certains sont favorables; la décision est en attente.",
          "Le projet est définitivement refusé."
        ],
        "faithful synthesis"
      ],
      [
        "fill",
        "Le titre ne doit pas déformer les ___ de l’interviewée.",
        "propos",
        "Propos are what the interviewee actually said.",
        [],
        "vocabulary"
      ]
    ],
    "writing": [
      "Draft a short accurate account of an interview response, including a quote, a condition and a correction to a misleading headline.",
      [
        "Distinguish interviewer assumptions from the interviewee’s verified words.",
        "Preserve conditional wording and specify the unresolved resource constraint.",
        "Do not create a fake quotation or present a planned date as confirmed."
      ],
      "Dans l’entretien, la responsable explique que seuls certains groupes soutiennent l’extension des horaires. Elle ne présente donc pas le projet comme adopté. Selon elle, une ouverture dès le mois prochain serait possible à condition de recruter une personne supplémentaire. Cependant, les ressources n’ont pas encore été vérifiées. Le titre qui annonce une ouverture certaine semble donc trop catégorique. L’article devrait préciser qu’il s’agit d’une hypothèse et demander quand une décision officielle sera prise."
    ]
  },
  {
    "id": "b1-20",
    "title": "Explain a process in a short article",
    "goal": "Read and write a structured explanatory article connecting stages, cause and outcome.",
    "grammarIds": [],
    "grammar": [
      [
        "Ordering steps and expressing means",
        "Tout d’abord, ensuite, après cela and enfin can make a process comprehensible, but connectors do not replace causal reasoning. Grâce à introduces a positive means or enabling circumstance, whereas à cause de commonly gives a detrimental cause. En + present participle describes the manner or concurrent action: en comparant les réponses, on peut repérer des erreurs.",
        [
          [
            "En vérifiant les données, nous évitons des doublons.",
            "By checking the data, we avoid duplicates."
          ],
          [
            "Grâce à une liste commune, les réponses sont plus faciles à comparer.",
            "Thanks to a shared list, the answers are easier to compare."
          ]
        ],
        [
          "En nous vérifions les données, nous évitons des erreurs.",
          "En vérifiant les données, nous évitons des erreurs.",
          "The gerund uses en plus a present participle, not a finite conjugation."
        ]
      ],
      [
        "Passive voice for procedures",
        "The passive construction être + past participle draws attention to what is done: les demandes sont examinées par un agent. It is useful when the process matters more than the actor, but the participle agrees with the passive subject: les réponses sont conservées. Distinguish the passive from être in a completed past event; the verb form should fit the time and agent.",
        [
          [
            "Les dossiers sont classés par date.",
            "The files are classified by date."
          ],
          [
            "La réponse sera envoyée après vérification.",
            "The answer will be sent after checking."
          ]
        ],
        [
          "Les demandes sont examinés chaque jour.",
          "Les demandes sont examinées chaque jour.",
          "A feminine plural passive subject requires examinées."
        ]
      ]
    ],
    "vocabulary": [
      [
        "une procédure",
        "procedure",
        "La procédure comporte quatre étapes."
      ],
      [
        "une étape",
        "stage",
        "Chaque étape est expliquée."
      ],
      [
        "tout d’abord",
        "first of all",
        "Tout d’abord, ouvrez le document."
      ],
      [
        "après cela",
        "after that",
        "Après cela, vérifiez la date."
      ],
      [
        "grâce à",
        "thanks to",
        "Grâce à ce tableau, le tri est simple."
      ],
      [
        "à cause de",
        "because of",
        "Le retard vient à cause d’une panne."
      ],
      [
        "en vérifiant",
        "by checking",
        "En vérifiant, on évite des erreurs."
      ],
      [
        "être classé",
        "to be classified",
        "Les dossiers sont classés par date."
      ],
      [
        "un doublon",
        "duplicate",
        "Le système détecte un doublon."
      ],
      [
        "une vérification",
        "check",
        "Une vérification est nécessaire."
      ],
      [
        "un envoi",
        "dispatch",
        "L’envoi aura lieu demain."
      ],
      [
        "un résultat",
        "result",
        "Le résultat doit être confirmé."
      ]
    ],
    "dialogue": [
      [
        "Élodie",
        "Je prépare un article qui explique comment les demandes sont reçues, classées et examinées avant qu’une réponse soit envoyée.",
        "I am preparing an article on how requests are received, classified and examined."
      ],
      [
        "Yanis",
        "Tu pourrais commencer par identifier les différentes étapes, afin que les lecteurs ne confondent pas réception et acceptation.",
        "Begin by naming steps so readers do not confuse receipt with acceptance."
      ],
      [
        "Élodie",
        "D’abord, les documents sont vérifiés; ensuite, un agent examine les informations manquantes et contacte les demandeurs concernés.",
        "First documents are checked; then an agent reviews missing information and contacts applicants."
      ],
      [
        "Yanis",
        "Très bien, mais il faut aussi expliquer qu’un retard peut venir d’un dossier incomplet, sans prétendre que c’est toujours le cas.",
        "Good, but explain that delay can come from incomplete files without saying that's always why."
      ],
      [
        "Élodie",
        "Je terminerai en décrivant la confirmation finale et en rappelant qu’aucune durée fixe n’est garantie dans la notice consultée.",
        "I will end with final confirmation and note no fixed duration is guaranteed."
      ]
    ],
    "tasks": [
      [
        "fill",
        "___ vérifiant les documents, on évite des doublons.",
        "En",
        "En plus present participle describes a method of checking.",
        [],
        "gerund"
      ],
      [
        "choice",
        "Choose the correct feminine plural passive.",
        "Les réponses sont conservées.",
        "The participle agrees with feminine plural réponses.",
        [
          "Les réponses sont conservés.",
          "Les réponses sont conservées.",
          "Les réponses ont conserver."
        ],
        "passive agreement"
      ],
      [
        "reading",
        "Why should the article distinguish reception from acceptance?",
        "ce sont des étapes différentes",
        "Yanis emphasizes that receiving a file does not mean approving it.",
        [
          "les personnes parlent différentes langues",
          "ce sont des étapes différentes",
          "le bureau est vide"
        ],
        "process inference"
      ],
      [
        "fill",
        "Les demandes sont ___ par un agent. (examiner)",
        "examinées",
        "Feminine plural demandes governs passive agreement.",
        [],
        "passive"
      ],
      [
        "choice",
        "Which expression introduces a beneficial enabling condition?",
        "grâce à",
        "Grâce à credits an aid or positive cause in context.",
        [
          "à cause de",
          "grâce à",
          "malgré"
        ],
        "cause"
      ],
      [
        "order",
        "Arrange: après vérification / La réponse sera envoyée",
        "La réponse sera envoyée après vérification",
        "The passive future identifies the action and its prerequisite.",
        [
          "après vérification",
          "La réponse sera envoyée"
        ],
        "syntax"
      ],
      [
        "fill",
        "Un dossier répété constitue un ___.",
        "doublon",
        "Doublon means a duplicated entry or item.",
        [],
        "vocabulary"
      ],
      [
        "reading",
        "What claim does Élodie avoid in the conclusion?",
        "un délai fixe garanti",
        "The consulted notice does not guarantee a fixed response period.",
        [
          "des dossiers existent",
          "un délai fixe garanti",
          "les documents sont vérifiés"
        ],
        "source limit"
      ],
      [
        "choice",
        "Which sentence describes a method?",
        "En comparant les dossiers, on repère les erreurs.",
        "The gerund explains how errors are detected.",
        [
          "Comparer les dossiers hier.",
          "En comparant les dossiers, on repère les erreurs.",
          "Les dossiers sont comparer."
        ],
        "process"
      ],
      [
        "fill",
        "___, les demandes sont classées par date.",
        "Ensuite",
        "Ensuite connects the next step in a process.",
        [],
        "sequencing"
      ]
    ],
    "writing": [
      "Write an explanatory article in eight or more sentences about a realistic registration process.",
      [
        "Describe at least three stages and distinguish submission from approval.",
        "Use an accurate passive form and one en + participle method clause.",
        "Mention a genuine uncertainty without inventing a deadline or policy."
      ],
      "Pour demander une inscription, il faut tout d’abord remplir le formulaire et vérifier les informations. Ensuite, les documents sont reçus par le secrétariat. En comparant les références, l’agent peut repérer des doublons. Les dossiers sont alors classés et examinés selon les critères annoncés. Si un élément manque, la personne concernée pourra être contactée. Cette étape peut prendre du temps, mais la notice ne précise pas de délai garanti. Enfin, une réponse est envoyée aux demandeurs. Recevoir un accusé ne signifie donc pas que la demande a été acceptée."
    ]
  },
  {
    "id": "b1-21",
    "title": "Read and write a balanced product review",
    "goal": "Distinguish personal testing, objective features and a recommendation conditional on users' needs.",
    "grammarIds": [],
    "grammar": [
      [
        "Express degree and limits in reviews",
        "Plutôt, assez, particulièrement and relativement qualify the strength of an evaluation. For a comparison say moins … que or davantage de + noun, while autant de expresses equal quantities. Une critique constructive distingue une caractéristique vérifiable, une expérience personnelle et une préférence; adjectives like meilleur are comparative, not universal proof.",
        [
          [
            "Le clavier est moins bruyant que mon ancien modèle.",
            "The keyboard is quieter than my old model."
          ],
          [
            "Cet appareil offre davantage de réglages.",
            "This device offers more settings."
          ]
        ],
        [
          "Ce produit est objectivement le meilleur pour tout le monde.",
          "À mon avis, ce produit convient mieux à mes besoins.",
          "A personal preference must not be presented as universal evidence."
        ]
      ],
      [
        "Comparative recommendation and conditions",
        "En revanche can introduce a drawback; pour quelqu’un qui … gives a conditional target user; à condition de plus infinitive specifies a practical prerequisite. Conclude with je le recommanderais à … parce que …, and explain when you would not recommend it. This is more useful than a positive adjective without observable grounds.",
        [
          [
            "Je le recommanderais à une personne qui voyage souvent.",
            "I would recommend it to someone who travels often."
          ],
          [
            "Il reste utile à condition de pouvoir le recharger chaque soir.",
            "It remains useful provided one can recharge it nightly."
          ]
        ],
        [
          "Je recommande le modèle à tout le monde malgré les limites.",
          "Je le recommanderais aux personnes qui acceptent ces limites.",
          "A conditional recommendation reflects different needs."
        ]
      ]
    ],
    "vocabulary": [
      [
        "un avis",
        "review",
        "Je rédige un avis équilibré."
      ],
      [
        "un essai",
        "trial/test",
        "J’ai fait un essai de deux jours."
      ],
      [
        "un critère",
        "criterion",
        "Le bruit est un critère important."
      ],
      [
        "fiable",
        "reliable",
        "La connexion semble fiable."
      ],
      [
        "relativement",
        "relatively",
        "L’appareil est relativement léger."
      ],
      [
        "davantage de",
        "more of",
        "Il propose davantage de réglages."
      ],
      [
        "autant de",
        "as many/much",
        "Les deux ont autant de touches."
      ],
      [
        "une limite",
        "limitation",
        "La batterie a une limite."
      ],
      [
        "en revanche",
        "however",
        "En revanche, le prix est élevé."
      ],
      [
        "un avantage",
        "advantage",
        "Le poids est un avantage."
      ],
      [
        "un inconvénient",
        "drawback",
        "Le bruit est un inconvénient."
      ],
      [
        "recommander",
        "to recommend",
        "Je le recommanderais aux voyageurs."
      ]
    ],
    "dialogue": [
      [
        "Sacha",
        "J’ai utilisé ce petit clavier pendant une semaine; je le trouve pratique pour voyager, mais j’ai remarqué que ses touches sont assez bruyantes.",
        "I used this small keyboard for a week; it's convenient for travel but noisy."
      ],
      [
        "Mina",
        "Peux-tu distinguer les caractéristiques que tu as vérifiées de ton impression personnelle sur son confort et sa fiabilité ?",
        "Can you separate verified features from your personal comfort impressions?"
      ],
      [
        "Sacha",
        "Je peux confirmer son poids et la présence de plusieurs réglages, tandis que mon avis sur la frappe reste subjectif.",
        "I can confirm its weight and settings, while my opinion on typing is subjective."
      ],
      [
        "Mina",
        "Alors tu pourrais expliquer à quel utilisateur tu le recommanderais, et pour quelle situation un autre modèle serait préférable.",
        "Explain whom you'd recommend it to and when another model may suit better."
      ],
      [
        "Sacha",
        "Je dirai que ce clavier peut convenir aux voyageurs, mais qu’une personne sensible au bruit devrait l’essayer avant de l’acheter.",
        "I'll say it may suit travelers but noise-sensitive users should try it first."
      ]
    ],
    "tasks": [
      [
        "fill",
        "Cet appareil offre ___ de réglages que l’ancien.",
        "davantage",
        "Davantage de plus a noun compares larger quantities.",
        [],
        "quantity"
      ],
      [
        "choice",
        "What kind of claim is 'je le trouve agréable'?",
        "a personal evaluation",
        "A comfort assessment is subjective even after using the item.",
        [
          "a manufacturer's guarantee",
          "a personal evaluation",
          "a universal law"
        ],
        "evaluation"
      ],
      [
        "reading",
        "Which characteristic can Sacha objectively confirm?",
        "le poids et les réglages",
        "Sacha distinguishes weight and settings from subjective typing comfort.",
        [
          "le confort universel",
          "le poids et les réglages",
          "la durée garantie"
        ],
        "fact vs opinion"
      ],
      [
        "fill",
        "Le nouveau modèle est moins bruyant ___ l’ancien.",
        "que",
        "Adjective comparison follows moins … que.",
        [],
        "comparison"
      ],
      [
        "choice",
        "Which review offers a clear limitation?",
        "Pratique, mais ses touches sont bruyantes.",
        "It provides an advantage alongside an observed drawback.",
        [
          "Parfait pour tout le monde.",
          "Pratique, mais ses touches sont bruyantes.",
          "Aucun problème n’est possible."
        ],
        "balance"
      ],
      [
        "order",
        "Arrange: aux voyageurs / Je le recommanderais",
        "Je le recommanderais aux voyageurs",
        "The conditional recommendation identifies a target group.",
        [
          "aux voyageurs",
          "Je le recommanderais"
        ],
        "word order"
      ],
      [
        "fill",
        "Ce critère est particulièrement ___ pour moi.",
        "important",
        "Important qualifies the significance of a criterion to the speaker.",
        [],
        "nuance"
      ],
      [
        "reading",
        "Who should test the keyboard before buying?",
        "les personnes sensibles au bruit",
        "The sound limitation specifically matters to noise-sensitive buyers.",
        [
          "tous les enseignants",
          "les personnes sensibles au bruit",
          "les personnes sans ordinateur"
        ],
        "target-user inference"
      ],
      [
        "choice",
        "Which recommendation appropriately narrows scope?",
        "Il convient peut-être aux personnes qui voyagent souvent.",
        "A conditional target avoids promising identical results for all users.",
        [
          "Tout le monde doit l’acheter.",
          "Il convient peut-être aux personnes qui voyagent souvent.",
          "Il n’a jamais aucun défaut."
        ],
        "scope"
      ],
      [
        "fill",
        "En ___, son prix reste assez élevé.",
        "revanche",
        "En revanche introduces a contrasting drawback.",
        [],
        "connector"
      ]
    ],
    "writing": [
      "Draft an evidence-aware review of a device or everyday product, comparing alternatives and identifying its intended audience.",
      [
        "Give two specific features and separate subjective judgments from observations.",
        "Explain one benefit and one limitation using accurate comparisons.",
        "Make a conditional recommendation to a clearly defined user group."
      ],
      "J’ai essayé ce clavier pendant plusieurs jours pour travailler en déplacement. Il est relativement léger et propose davantage de réglages que mon ancien modèle. À mon avis, sa taille est pratique, mais le bruit des touches est parfois gênant. Je ne peux pas juger sa fiabilité à long terme après une période d’essai aussi courte. Je le recommanderais plutôt aux personnes qui cherchent un appareil compact et qui acceptent cette limite. Pour une utilisation dans une bibliothèque calme, je conseillerais de comparer d’autres options avant de décider."
    ]
  },
  {
    "id": "b1-22",
    "title": "Understand instructions and troubleshoot responsibly",
    "goal": "Follow conditional technical instructions, report the observed result and escalate uncertain problems.",
    "grammarIds": [],
    "grammar": [
      [
        "Imperatives, conditions and sequence",
        "French instructions use imperatives such as vérifiez, ouvrez, éteignez and réessayez. They may also state real conditions with si + present: si le message apparaît, notez son contenu. Before taking a step, distinguish a harmless check from an action that might erase data or change settings; an instruction should not imply that risky operations are automatically safe.",
        [
          [
            "Vérifiez d’abord que le document est enregistré.",
            "First check that the document has been saved."
          ],
          [
            "Si le problème persiste, contactez le service d’aide.",
            "If the problem persists, contact support."
          ]
        ],
        [
          "Si le problème persistera, contacter le service.",
          "Si le problème persiste, contactez le service.",
          "A real conditional uses present after si and an imperative addressed to vous."
        ]
      ],
      [
        "Reporting outcomes with precise uncertainty",
        "Après avoir + past participle links a completed preparatory action: après avoir vérifié, j’ai relancé l’application. However, if there is any doubt about the effect, describe what was observed rather than claiming success: le message a disparu, mais je n’ai pas encore vérifié mes fichiers. Use sembler plus infinitive for a tentative observation and preserve error messages accurately when communicating with a technician.",
        [
          [
            "Après avoir vérifié le fichier, j’ai fermé la fenêtre.",
            "After checking the file, I closed the window."
          ],
          [
            "Le programme semble fonctionner, mais le problème pourrait revenir.",
            "The program seems to work, but the problem might return."
          ]
        ],
        [
          "Après avoir vérifier, j’ai redémarré.",
          "Après avoir vérifié, j’ai relancé le programme.",
          "Après avoir requires a past participle, not an infinitive."
        ]
      ]
    ],
    "vocabulary": [
      [
        "une consigne",
        "instruction",
        "Suivez la consigne écrite."
      ],
      [
        "une étape",
        "step",
        "Notez chaque étape effectuée."
      ],
      [
        "vérifiez",
        "check (formal/plural imperative)",
        "Vérifiez le nom du fichier."
      ],
      [
        "réessayez",
        "try again",
        "Réessayez seulement si c’est approprié."
      ],
      [
        "un message d’erreur",
        "error message",
        "Copiez le message d’erreur."
      ],
      [
        "persister",
        "to persist",
        "Le problème persiste."
      ],
      [
        "un fichier",
        "file",
        "Le fichier n’est pas enregistré."
      ],
      [
        "une sauvegarde",
        "backup",
        "Vérifiez la sauvegarde."
      ],
      [
        "une assistance",
        "support",
        "Contactez l’assistance."
      ],
      [
        "un résultat",
        "result",
        "Le résultat reste incertain."
      ],
      [
        "après avoir",
        "after having",
        "Après avoir lu, j’ai répondu."
      ],
      [
        "sembler",
        "to seem",
        "Le programme semble fonctionner."
      ]
    ],
    "dialogue": [
      [
        "Amina",
        "Le formulaire affiche un message d’erreur, mais je ne sais pas si mes réponses ont déjà été enregistrées correctement.",
        "The form displays an error; I don't know if responses were saved."
      ],
      [
        "Jules",
        "Avant de recommencer, vérifie si une confirmation existe et note exactement ce que le message indique à l’écran.",
        "Before restarting, check for confirmation and write down the exact message."
      ],
      [
        "Amina",
        "Je vois un numéro temporaire, cependant le site ne dit pas clairement si l’envoi est terminé ou encore en cours.",
        "I see a temporary number, but the site doesn't clearly say whether submission is done."
      ],
      [
        "Jules",
        "Alors ne soumets pas plusieurs copies au hasard; contacte le service d’aide en précisant l’heure et les étapes déjà effectuées.",
        "Then don't submit multiple copies randomly; contact support with time and steps."
      ],
      [
        "Amina",
        "Je vais conserver ces informations et demander une confirmation avant d’affirmer que le formulaire a bien été reçu.",
        "I'll preserve this information and request confirmation before claiming receipt."
      ]
    ],
    "tasks": [
      [
        "fill",
        "Si le problème ___, contactez l’assistance.",
        "persiste",
        "Si plus present introduces the real condition in this instruction.",
        [],
        "conditional"
      ],
      [
        "choice",
        "Which is a formal plural imperative?",
        "Vérifiez le fichier.",
        "Vérifiez is the vous imperative appropriate for written instructions.",
        [
          "Vous vérifier le fichier.",
          "Vérifiez le fichier.",
          "Vous vérifie le fichier."
        ],
        "imperative"
      ],
      [
        "reading",
        "Why should Amina avoid repeatedly submitting?",
        "l’état de l’envoi est inconnu",
        "She has no confirmation that the form was received and could create duplicates.",
        [
          "le centre est fermé",
          "l’état de l’envoi est inconnu",
          "les réponses sont fausses"
        ],
        "risk inference"
      ],
      [
        "fill",
        "Après avoir ___ la date, j’ai fermé la page.",
        "vérifié",
        "Après avoir takes the past participle vérifié.",
        [],
        "prior action"
      ],
      [
        "choice",
        "Which statement keeps uncertainty explicit?",
        "Le site semble fonctionner; l’envoi reste à confirmer.",
        "It separates an apparent interface state from actual submission confirmation.",
        [
          "Toutes les réponses sont reçues.",
          "Le site semble fonctionner; l’envoi reste à confirmer.",
          "Le problème ne reviendra jamais."
        ],
        "status"
      ],
      [
        "order",
        "Arrange: contactez l’assistance / Si l’erreur persiste",
        "Si l’erreur persiste contactez l’assistance",
        "The real-condition clause precedes the formal imperative.",
        [
          "contactez l’assistance",
          "Si l’erreur persiste"
        ],
        "syntax"
      ],
      [
        "fill",
        "Je vais copier le message d’___ pour le support.",
        "erreur",
        "Message d’erreur is the standard phrase for an error message.",
        [],
        "lexicon"
      ],
      [
        "reading",
        "Which details will Amina preserve?",
        "le message, l’heure et les étapes",
        "Jules asks for the exact message, time and steps already attempted.",
        [
          "seulement son mot de passe",
          "le message, l’heure et les étapes",
          "la météo"
        ],
        "evidence"
      ],
      [
        "choice",
        "Which is the safer language for an unverified result?",
        "Je vais demander une confirmation.",
        "The confirmation request avoids reporting success without evidence.",
        [
          "L’envoi a forcément réussi.",
          "Je vais demander une confirmation.",
          "Il est inutile de vérifier."
        ],
        "uncertainty"
      ],
      [
        "fill",
        "Le programme ___ fonctionner, mais je ne suis pas sûr.",
        "semble",
        "Semble expresses appearance rather than a verified complete outcome.",
        [],
        "hedging"
      ]
    ],
    "writing": [
      "Write a concise support request describing a problem, what you observed and what remains unconfirmed.",
      [
        "Describe the precise observed message and avoid pretending to know the cause.",
        "List safe checks already completed in chronological order.",
        "Request confirmation or a next step without proposing destructive changes."
      ],
      "Bonjour, j’ai essayé d’envoyer mon formulaire ce matin. Le site a affiché un message d’erreur, mais un numéro temporaire apparaît encore à l’écran. Avant de réessayer, j’ai vérifié si une confirmation était disponible; je n’en ai pas trouvé. Je ne sais donc pas si mon envoi a été reçu. J’ai noté l’heure et le texte exact du message. Pourriez-vous vérifier l’état du dossier et m’indiquer la prochaine étape à suivre sans créer une deuxième demande inutile ?"
    ]
  }
];
export const B1_UNITS_19_22=Object.freeze(units.map((spec,i)=>authorB1DepthUnit(spec,i+19)));
