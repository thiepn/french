import {authorB1DepthUnit} from './u11-b1-model.ts';
import type {A1AuthoredSpec} from './u6-a1-model.ts';
const units:A1AuthoredSpec[]=[
  {
    "id": "b1-15",
    "title": "Read a public notice and its exceptions",
    "goal": "Extract scope, deadlines and exceptions from a formal announcement; explain what remains uncertain.",
    "grammarIds": [],
    "grammar": [
      [
        "Restriction and exception in notices",
        "Sauf and excepté mark an exclusion: les salles sont ouvertes sauf le lundi. À partir de introduces the first applicable date, while jusqu’au identifies an end point. Ne confondez pas la publication d’un avis et le début de son application; a dated notice may take effect later. Read the precise subject and the scope of the rule before generalizing it.",
        [
          [
            "Les salles seront fermées sauf la salle B.",
            "The rooms will close except room B."
          ],
          [
            "La mesure s’appliquera à partir du quinze mai.",
            "The measure will apply from 15 May."
          ]
        ],
        [
          "Tous les services fermeront sauf lundi.",
          "Les salles fermeront le lundi, sauf la salle B.",
          "The exclusion should name the actual room, not accidentally exclude a day."
        ]
      ],
      [
        "Required actions and missing details",
        "Il est obligatoire de followed by an infinitive states a requirement; il est recommandé de gives advice, not an obligation. Pour accéder à introduces a purpose or condition for entry, and sous réserve de means subject to a condition. An announcement that does not specify penalties, exceptions or official contacts does not authorize the reader to invent them.",
        [
          [
            "Il est recommandé de réserver à l’avance.",
            "Advance reservation is recommended."
          ],
          [
            "L’accès est possible sous réserve de disponibilité.",
            "Entry is possible subject to availability."
          ]
        ],
        [
          "Il est recommandé de réserver, donc une réservation est obligatoire.",
          "Il est recommandé de réserver; ce n’est pas présenté comme une obligation.",
          "A recommendation cannot be promoted to a compulsory rule."
        ]
      ]
    ],
    "vocabulary": [
      [
        "un avis",
        "notice",
        "Un avis est affiché à l’entrée."
      ],
      [
        "une exception",
        "exception",
        "Une exception concerne la salle B."
      ],
      [
        "sauf",
        "except",
        "Tout est ouvert sauf la salle C."
      ],
      [
        "à partir de",
        "from/as of",
        "La règle vaut à partir de lundi."
      ],
      [
        "jusqu’au",
        "until",
        "La permanence dure jusqu’au vendredi."
      ],
      [
        "obligatoire",
        "mandatory",
        "Une inscription est obligatoire."
      ],
      [
        "recommandé",
        "recommended",
        "Il est recommandé de téléphoner."
      ],
      [
        "sous réserve de",
        "subject to",
        "L’accès est sous réserve de places."
      ],
      [
        "une condition",
        "condition",
        "Vérifiez la condition d’accès."
      ],
      [
        "une fermeture",
        "closure",
        "La fermeture est temporaire."
      ],
      [
        "un affichage",
        "posted notice",
        "L’affichage a été modifié."
      ],
      [
        "une précision",
        "clarification",
        "Une précision manque dans l’avis."
      ]
    ],
    "dialogue": [
      [
        "Camille",
        "J’ai lu l’avis à l’entrée : plusieurs salles fermeront lundi, mais la petite salle B restera accessible aux groupes déjà inscrits.",
        "I read the notice: several rooms close Monday, but room B stays available to registered groups."
      ],
      [
        "Benoît",
        "L’avis précise-t-il à partir de quelle heure la fermeture s’applique, ou devons-nous encore demander une confirmation au secrétariat ?",
        "Does it state the time the closure begins, or must we check with the office?"
      ],
      [
        "Camille",
        "Il indique une fermeture à partir de neuf heures; cependant, je ne vois aucune information sur les groupes sans réservation.",
        "It says from nine, but I see no information about groups without reservations."
      ],
      [
        "Benoît",
        "Alors nous pouvons prévenir les membres inscrits, mais il ne faut pas promettre l’accès à ceux qui ne sont pas mentionnés.",
        "We can inform registered members, but should not promise access to unmentioned groups."
      ],
      [
        "Camille",
        "Je vais donc demander une précision écrite afin que chaque participant sache exactement quelles conditions s’appliquent à sa situation.",
        "I will ask for written clarification so participants know their conditions."
      ]
    ],
    "tasks": [
      [
        "fill",
        "Les salles ferment ___ la salle B.",
        "sauf",
        "Sauf identifies the room expressly excluded from the general closure.",
        [],
        "exception"
      ],
      [
        "choice",
        "What does il est recommandé de réserver express?",
        "advice",
        "Recommandé expresses advice; it does not by itself make booking compulsory.",
        [
          "a legal penalty",
          "advice",
          "a complete prohibition"
        ],
        "modal force"
      ],
      [
        "reading",
        "Which groups can still use room B according to Camille?",
        "les groupes déjà inscrits",
        "Camille identifies registered groups as the explicit exception to closure.",
        [
          "tous les visiteurs",
          "les groupes déjà inscrits",
          "aucun groupe"
        ],
        "scope"
      ],
      [
        "fill",
        "La nouvelle règle s’applique à ___ de lundi.",
        "partir",
        "À partir de marks the point when the rule begins to apply.",
        [],
        "starting point"
      ],
      [
        "choice",
        "What is still uncertain in the dialogue?",
        "l’accès sans réservation",
        "They know the rule for registered groups but lack information about unregistered users.",
        [
          "l’heure de fermeture",
          "le nom de la salle",
          "l’accès sans réservation"
        ],
        "missing evidence"
      ],
      [
        "order",
        "Arrange: doit être confirmé / L’accès sans réservation",
        "L’accès sans réservation doit être confirmé",
        "The subject phrase precedes the passive obligation construction.",
        [
          "doit être confirmé",
          "L’accès sans réservation"
        ],
        "syntax"
      ],
      [
        "fill",
        "L’accès reste possible sous ___ de places.",
        "réserve",
        "Sous réserve de makes access conditional on the available places.",
        [],
        "conditions"
      ],
      [
        "reading",
        "Why does Camille request a written clarification?",
        "éviter des promesses infondées",
        "Written conditions prevent the group from promising access not supported by the notice.",
        [
          "changer la date elle-même",
          "éviter des promesses infondées",
          "supprimer les réservations"
        ],
        "inference"
      ],
      [
        "choice",
        "Which correctly distinguishes two levels of requirement?",
        "obligatoire is stronger than recommandé",
        "Obligatoire states a requirement; recommandé is advisory.",
        [
          "recommandé always means forbidden",
          "obligatoire is stronger than recommandé",
          "both expressions mean optional"
        ],
        "interpretation"
      ],
      [
        "fill",
        "Il manque une ___ sur les visiteurs sans inscription.",
        "précision",
        "Une précision is a missing clarification that can be requested.",
        [],
        "vocabulary"
      ]
    ],
    "writing": [
      "Write a concise explanation of a fictional public notice, covering rule, exception, effective date and one unknown.",
      [
        "State the scope and effective time exactly.",
        "Distinguish obligation from recommendation and identify the exception.",
        "Ask one concrete question rather than inventing missing policy."
      ],
      "L’avis du centre annonce la fermeture de plusieurs salles à partir de lundi à neuf heures. La salle B restera accessible aux groupes déjà inscrits. En revanche, le document ne précise pas si les visiteurs sans réservation pourront entrer. Il est recommandé de contacter le secrétariat, mais cette recommandation ne remplace pas les conditions officielles. Je propose donc d’informer les groupes inscrits et de demander une confirmation écrite concernant les autres visiteurs."
    ]
  },
  {
    "id": "b1-16",
    "title": "Follow an email exchange without losing the thread",
    "goal": "Connect requests, responses and pending decisions across several professional messages.",
    "grammarIds": [],
    "grammar": [
      [
        "Referring back precisely",
        "Ce dernier and celle-ci can refer to a previously mentioned person or thing, but ambiguous pronouns obscure who did what. In an email thread, use votre message du… or concernant votre demande to keep the referent explicit. Lorsque introduces a time clause; dès que normally takes the indicative, including future where relevant: dès que nous aurons reçu la réponse.",
        [
          [
            "Concernant votre demande du mardi, voici une précision.",
            "Regarding your Tuesday request, here is a clarification."
          ],
          [
            "Dès que nous aurons reçu le document, nous vous répondrons.",
            "As soon as we have received the document, we will reply."
          ]
        ],
        [
          "Dès que nous recevions votre réponse, nous confirmerons.",
          "Dès que nous recevrons votre réponse, nous confirmerons.",
          "For a specific future completion, use futur simple after dès que."
        ]
      ],
      [
        "Distinguishing process from approval",
        "Nous accusons réception confirms receipt only, not acceptance. Votre dossier est à l’étude means an examination is ongoing, whereas votre demande a été acceptée reports a decision. A precise reply restates the exact question and indicates whether a decision has been made; do not infer approval from politeness or a reference number.",
        [
          [
            "Nous accusons réception de votre demande.",
            "We acknowledge receipt of your request."
          ],
          [
            "Votre dossier reste à l’étude.",
            "Your application is still being reviewed."
          ]
        ],
        [
          "Ils ont reçu mon message, donc ils ont accepté.",
          "Ils ont reçu mon message, mais ma demande reste en attente.",
          "Receipt is not proof of approval."
        ]
      ]
    ],
    "vocabulary": [
      [
        "un fil de discussion",
        "message thread",
        "Le fil contient trois courriels."
      ],
      [
        "accuser réception",
        "acknowledge receipt",
        "Nous accusons réception du dossier."
      ],
      [
        "une suite",
        "follow-up",
        "Je donnerai une suite à votre demande."
      ],
      [
        "en attente",
        "pending",
        "La décision reste en attente."
      ],
      [
        "à l’étude",
        "under review",
        "Votre dossier est à l’étude."
      ],
      [
        "concernant",
        "regarding",
        "Concernant votre inscription, voici la réponse."
      ],
      [
        "dès que",
        "as soon as",
        "Dès que je saurai, je répondrai."
      ],
      [
        "entre-temps",
        "in the meantime",
        "Entre-temps, gardez le reçu."
      ],
      [
        "un délai",
        "timeframe",
        "Un délai n’a pas été indiqué."
      ],
      [
        "une relance",
        "follow-up reminder",
        "J’envoie une relance polie."
      ],
      [
        "un accusé",
        "acknowledgment",
        "L’accusé ne vaut pas accord."
      ],
      [
        "une décision",
        "decision",
        "La décision sera communiquée."
      ]
    ],
    "dialogue": [
      [
        "Nora",
        "J’ai écrit lundi pour changer mon inscription; mardi, le secrétariat m’a seulement envoyé un accusé de réception automatique.",
        "I wrote Monday to change registration; Tuesday, the office sent only an automatic acknowledgment."
      ],
      [
        "Paul",
        "Ce message indique-t-il que le changement a été accepté, ou confirme-t-il simplement que le dossier est arrivé ?",
        "Does the message say it was approved, or only that the file arrived?"
      ],
      [
        "Nora",
        "Il confirme uniquement la réception, et précise que le dossier restera à l’étude jusqu’à ce qu’un agent réponde.",
        "It confirms receipt and says the file will remain under review until an agent replies."
      ],
      [
        "Paul",
        "Dans ce cas, tu pourrais envoyer une relance polie pour demander le délai prévu, sans présenter la demande comme approuvée.",
        "Then send a polite follow-up asking about the timeframe, without treating it as approved."
      ],
      [
        "Nora",
        "Je vais le faire jeudi, si aucune réponse n’arrive; entre-temps, je conserverai les références de tous les messages.",
        "I will do so Thursday if no answer arrives; meanwhile I will keep all message references."
      ]
    ],
    "tasks": [
      [
        "fill",
        "Nous accusons ___ de votre courriel.",
        "réception",
        "Accuser réception acknowledges a message's arrival, not approval.",
        [],
        "register"
      ],
      [
        "choice",
        "Which statement means the case is still being considered?",
        "Le dossier est à l’étude.",
        "À l’étude signals active review without a final outcome.",
        [
          "La demande a été acceptée.",
          "Le dossier est à l’étude.",
          "L’inscription est confirmée."
        ],
        "status"
      ],
      [
        "reading",
        "What did the automatic message actually confirm?",
        "la réception du dossier",
        "Nora explicitly says the automatic email confirmed only receipt.",
        [
          "une nouvelle inscription",
          "la réception du dossier",
          "un remboursement"
        ],
        "literal meaning"
      ],
      [
        "fill",
        "Dès que nous ___ une réponse, nous vous écrirons. (avoir, future)",
        "aurons",
        "Dès que can be followed by future in French when the event is future.",
        [],
        "future chronology"
      ],
      [
        "choice",
        "Which follow-up is appropriate?",
        "Pourriez-vous préciser le délai de réponse ?",
        "A polite, specific question asks about the expected reply timeframe.",
        [
          "Vous avez déjà accepté, c’est certain.",
          "Pourriez-vous préciser le délai de réponse ?",
          "Je supprime votre message."
        ],
        "email register"
      ],
      [
        "order",
        "Arrange: reste en attente / Ma demande",
        "Ma demande reste en attente",
        "The current status is pending, not automatically approved.",
        [
          "reste en attente",
          "Ma demande"
        ],
        "word order"
      ],
      [
        "fill",
        "___, je garderai une copie des messages.",
        "Entre-temps",
        "Entre-temps marks the interim period before further information arrives.",
        [],
        "sequence"
      ],
      [
        "reading",
        "What condition triggers Nora's Thursday reminder?",
        "aucune réponse d’ici jeudi",
        "She will follow up Thursday only if no response has arrived.",
        [
          "son dossier a été refusé",
          "aucune réponse d’ici jeudi",
          "le cours commence lundi"
        ],
        "conditional inference"
      ],
      [
        "choice",
        "What does an accusé de réception NOT prove?",
        "l’acceptation de la demande",
        "An acknowledgment only confirms receipt, not a decision.",
        [
          "que le message est arrivé",
          "l’acceptation de la demande",
          "qu’un courriel existe"
        ],
        "document interpretation"
      ],
      [
        "fill",
        "Je voudrais envoyer une ___ polie.",
        "relance",
        "A relance is a follow-up message about an unanswered request.",
        [],
        "lexicon"
      ]
    ],
    "writing": [
      "Write a polite follow-up email that respects the difference between acknowledgment and approval.",
      [
        "Summarize the dates and contents of earlier messages.",
        "Ask for an expected response time without claiming acceptance.",
        "Provide a specific reference and courteous closing."
      ],
      "Objet : Suivi de ma demande de modification. Bonjour Madame, je vous ai écrit lundi concernant mon inscription et j’ai reçu mardi un accusé de réception. Celui-ci confirme uniquement que mon dossier est arrivé. Je comprends que ma demande reste à l’étude. Pourriez-vous m’indiquer le délai prévu pour une réponse ? Je conserverai les références de nos échanges afin d’éviter tout malentendu. Je vous remercie pour votre aide. Cordialement, Nora."
    ]
  },
  {
    "id": "b1-17",
    "title": "Analyze a forum debate responsibly",
    "goal": "Compare personal testimony, general claims and practical suggestions in an online discussion.",
    "grammarIds": [],
    "grammar": [
      [
        "Reported experience is not population evidence",
        "D’après mon expérience introduces an individual's observation, whereas en général suggests a wider pattern requiring broader evidence. Certains … d’autres … contrasts participant views without suggesting every person belongs to one group. Évitez de confondre j’ai rencontré un problème and ce service ne fonctionne jamais; one anecdote does not establish a universal rule.",
        [
          [
            "D’après mon expérience, le système était facile à utiliser.",
            "In my experience, the system was easy to use."
          ],
          [
            "Certains préfèrent réserver en ligne, tandis que d’autres téléphonent.",
            "Some prefer booking online, whereas others phone."
          ]
        ],
        [
          "Une fois j’ai attendu; donc personne ne reçoit de réponse.",
          "J’ai attendu longtemps une fois, mais je ne connais pas les délais habituels.",
          "A single episode does not justify a universal claim."
        ]
      ],
      [
        "Counterexamples and constructive proposals",
        "Toutefois and en revanche introduce a counterpoint; cela dit can soften a direct disagreement. Si l’on veut améliorer un service, il vaut mieux proposer une action vérifiable que d'accuser sans preuve. Use ce serait utile de plus infinitive for a tentative practical recommendation, and distinguish a suggested solution from a guaranteed outcome.",
        [
          [
            "Cela dit, nous pourrions tester l’assistance téléphonique.",
            "That said, we could test telephone assistance."
          ],
          [
            "Ce serait utile de publier des délais indicatifs.",
            "It would be useful to publish estimated response times."
          ]
        ],
        [
          "Ce serait utile que publier des délais.",
          "Ce serait utile de publier des délais.",
          "Ce serait utile de takes an infinitive; do not insert que here."
        ]
      ]
    ],
    "vocabulary": [
      [
        "un forum",
        "discussion forum",
        "Le forum présente plusieurs avis."
      ],
      [
        "un témoignage",
        "personal account",
        "Son témoignage est détaillé."
      ],
      [
        "une généralisation",
        "generalization",
        "Cette généralisation est trop forte."
      ],
      [
        "un contre-exemple",
        "counterexample",
        "Un contre-exemple nuance l’idée."
      ],
      [
        "d’après mon expérience",
        "in my experience",
        "D’après mon expérience, le site est clair."
      ],
      [
        "certains",
        "some people",
        "Certains préfèrent téléphoner."
      ],
      [
        "d’autres",
        "others",
        "D’autres utilisent le site."
      ],
      [
        "cela dit",
        "that said",
        "Cela dit, je comprends le problème."
      ],
      [
        "une solution",
        "solution",
        "Il propose une solution testable."
      ],
      [
        "fiable",
        "reliable",
        "La connexion n’était pas fiable."
      ],
      [
        "représentatif",
        "representative",
        "L’exemple n’est pas représentatif."
      ],
      [
        "vérifiable",
        "verifiable",
        "Un délai écrit est vérifiable."
      ]
    ],
    "dialogue": [
      [
        "Lucie",
        "Sur le forum, une personne dit que le service est toujours lent, mais elle décrit seulement une réservation faite le mois dernier.",
        "A person on the forum says the service is always slow but describes only one booking last month."
      ],
      [
        "Thomas",
        "Son témoignage mérite d’être entendu; cependant, nous ne savons pas si cette expérience représente celle de la majorité des utilisateurs.",
        "Her account matters, but we do not know if it represents most users."
      ],
      [
        "Lucie",
        "Une autre personne affirme avoir reçu une réponse rapide, ce qui montre au moins que les expériences publiées ne sont pas identiques.",
        "Another person reports a fast reply, showing that posted experiences differ."
      ],
      [
        "Thomas",
        "Nous pourrions suggérer que le site affiche un délai indicatif, afin que les usagers sachent quand envoyer une relance.",
        "We could suggest that the site show an estimated timeframe so people know when to follow up."
      ],
      [
        "Lucie",
        "Je vais résumer les deux témoignages sans décider qui a raison et demander s’il existe des informations officielles sur les délais.",
        "I will summarize both accounts without deciding who is right and seek official response-time information."
      ]
    ],
    "tasks": [
      [
        "fill",
        "D’___ mon expérience, le site était simple.",
        "après",
        "D’après mon expérience explicitly narrows a claim to a personal observation.",
        [],
        "attribution"
      ],
      [
        "choice",
        "What does a single negative testimony establish?",
        "one person's experience",
        "One experience is evidence about that case, not everyone's outcomes.",
        [
          "a universal failure",
          "one person's experience",
          "a formal policy"
        ],
        "evidence"
      ],
      [
        "reading",
        "Why does Thomas resist the phrase 'always slow'?",
        "un seul cas ne représente pas tout le monde",
        "The quoted complaint describes one booking, not all users.",
        [
          "le site est gratuit",
          "un seul cas ne représente pas tout le monde",
          "les réponses sont toujours rapides"
        ],
        "inference"
      ],
      [
        "fill",
        "Certains écrivent en ligne, ___ téléphonent.",
        "d’autres",
        "D’autres contrasts another group without implying unanimity.",
        [],
        "comparison"
      ],
      [
        "choice",
        "Which proposal can be checked?",
        "Afficher un délai indicatif.",
        "Publishing an estimated response time is a specific verifiable action.",
        [
          "Ignorer tous les messages.",
          "Afficher un délai indicatif.",
          "Dire que tout est parfait."
        ],
        "practical action"
      ],
      [
        "order",
        "Arrange: mérite attention / Ce témoignage",
        "Ce témoignage mérite attention",
        "The sentence acknowledges the account without generalizing it.",
        [
          "mérite attention",
          "Ce témoignage"
        ],
        "syntax"
      ],
      [
        "fill",
        "Ce serait utile ___ publier les délais.",
        "de",
        "The impersonal conditional construction takes de plus infinitive.",
        [],
        "recommendation"
      ],
      [
        "reading",
        "What will Lucie look for after reading the posts?",
        "des informations officielles sur les délais",
        "She intends to find an authoritative statement of response times.",
        [
          "de nouveaux billets",
          "des informations officielles sur les délais",
          "des photos du forum"
        ],
        "synthesis"
      ],
      [
        "choice",
        "Which is a balanced conclusion?",
        "Les expériences rapportées diffèrent.",
        "It preserves the contrast without pretending to know a population-wide pattern.",
        [
          "Tous les usagers attendent longtemps.",
          "Les expériences rapportées diffèrent.",
          "Aucun témoignage n’est valable."
        ],
        "nuance"
      ],
      [
        "fill",
        "Cet exemple n’est pas forcément ___.",
        "représentatif",
        "Représentatif means typical of a wider group; a single case may not be.",
        [],
        "lexicon"
      ]
    ],
    "writing": [
      "Write a fair forum reply comparing two incompatible testimonials and offering one constructive service improvement.",
      [
        "Attribute each experience correctly without extending it to everyone.",
        "Acknowledge a counterexample and uncertainty.",
        "Propose a concrete action that users could verify."
      ],
      "Je comprends la frustration de la personne qui a attendu longtemps après sa réservation. Cependant, son témoignage décrit une seule expérience. Une autre utilisatrice explique avoir reçu une réponse rapide, ce qui montre que les situations sont différentes. Nous ne pouvons donc pas conclure que le service est toujours lent. Cela dit, ce serait utile de publier les délais habituels de réponse et un moyen clair de relancer une demande. Une information officielle aiderait chacun à mieux s’organiser."
    ]
  },
  {
    "id": "b1-18",
    "title": "Interpret a profile and a change of direction",
    "goal": "Connect motivations, life events and reported decisions in a biographical profile.",
    "grammarIds": [],
    "grammar": [
      [
        "Biography: period, turning point, consequence",
        "Use pendant plusieurs années or autrefois for a sustained earlier period, then un jour or c’est à ce moment-là que to identify a turning point. Plus-que-parfait locates preparations before that turning point; passé composé advances the biographical events. Une décision n’explique pas automatiquement tous les résultats suivants; report the person's stated reasons rather than inventing them.",
        [
          [
            "Elle travaillait en ville lorsqu’elle a décidé de déménager.",
            "She was working in town when she decided to move."
          ],
          [
            "Elle avait suivi une formation avant de changer d’emploi.",
            "She had taken training before changing jobs."
          ]
        ],
        [
          "Elle a travaillé dix ans, donc elle était forcément malheureuse.",
          "Elle a travaillé dix ans, puis elle a changé d’emploi pour des raisons qu’elle a expliquées.",
          "The duration of employment does not prove a particular emotion."
        ]
      ],
      [
        "Relative clauses in biographical descriptions",
        "C’est une personne qui… describes a subject's action, tandis que la décision qu’elle a prise uses a preceding direct object relative. Dont links a de complement: le métier dont elle rêvait. Report personal motivations with selon elle or elle explique que, because narration cannot directly observe an internal intention unless it is stated.",
        [
          [
            "C’est le métier dont elle rêvait.",
            "It is the career she dreamed of."
          ],
          [
            "La décision qu’elle a prise a surpris ses amis.",
            "The decision she made surprised her friends."
          ]
        ],
        [
          "Le métier que elle rêvait.",
          "Le métier dont elle rêvait.",
          "Rêver de requires dont, not direct-object que."
        ]
      ]
    ],
    "vocabulary": [
      [
        "un parcours",
        "path/career",
        "Son parcours a changé."
      ],
      [
        "un tournant",
        "turning point",
        "Ce fut un tournant important."
      ],
      [
        "auparavant",
        "previously",
        "Auparavant, elle travaillait à Lille."
      ],
      [
        "une formation",
        "training",
        "Elle a suivi une formation."
      ],
      [
        "une vocation",
        "calling",
        "Elle décrit sa vocation."
      ],
      [
        "se reconvertir",
        "change careers",
        "Elle a choisi de se reconvertir."
      ],
      [
        "déménager",
        "move house",
        "Il a déménagé après ses études."
      ],
      [
        "un engagement",
        "commitment",
        "Son engagement reste volontaire."
      ],
      [
        "selon elle",
        "according to her",
        "Selon elle, ce choix était utile."
      ],
      [
        "un entretien",
        "interview",
        "L’entretien explique son choix."
      ],
      [
        "un rêve",
        "dream",
        "C’est le métier dont elle rêvait."
      ],
      [
        "une étape",
        "stage",
        "Cette étape a pris du temps."
      ]
    ],
    "dialogue": [
      [
        "Maya",
        "J’ai lu le portrait d’une bibliothécaire qui travaillait auparavant dans une entreprise et qui a changé de métier après une formation.",
        "I read a profile of a librarian who formerly worked for a company and retrained."
      ],
      [
        "Adam",
        "Le texte explique-t-il pourquoi elle a décidé de partir, ou est-ce seulement notre interprétation de son ancien emploi ?",
        "Does the text explain why she left, or is that merely our interpretation?"
      ],
      [
        "Maya",
        "Selon l’entretien, elle voulait travailler davantage avec le public, mais elle ne dit pas qu’elle était malheureuse dans son poste précédent.",
        "According to the interview, she wanted more public contact but does not say she was unhappy before."
      ],
      [
        "Adam",
        "C’est intéressant : elle avait déjà fait du bénévolat avant sa formation, donc sa décision n’est pas sortie de nulle part.",
        "Interesting: she had volunteered before training, so the choice was not out of nowhere."
      ],
      [
        "Maya",
        "Je vais résumer les événements dans l’ordre et citer ses propres raisons, au lieu de lui attribuer des sentiments qu’elle n’a pas exprimés.",
        "I will summarize events chronologically and attribute her reasons accurately."
      ]
    ],
    "tasks": [
      [
        "fill",
        "C’est le métier ___ elle rêvait.",
        "dont",
        "Rêver de takes dont for the relative de complement.",
        [],
        "relative construction"
      ],
      [
        "choice",
        "Which is the earlier preparation?",
        "elle avait fait du bénévolat",
        "Plus-que-parfait places volunteering before her later professional change.",
        [
          "elle a commencé son nouveau métier",
          "elle avait fait du bénévolat",
          "elle donne une interview aujourd’hui"
        ],
        "chronology"
      ],
      [
        "reading",
        "Which motivation does the profile explicitly report?",
        "travailler davantage avec le public",
        "She directly states a wish to work more with people.",
        [
          "quitter des collègues désagréables",
          "travailler davantage avec le public",
          "gagner plus d’argent"
        ],
        "reported motive"
      ],
      [
        "fill",
        "Elle avait suivi une ___ avant de changer d’emploi.",
        "formation",
        "Une formation is a course of preparation before changing careers.",
        [],
        "vocabulary"
      ],
      [
        "choice",
        "Which claim would be unsupported?",
        "elle détestait son ancien travail",
        "The interview does not state that she hated her previous job.",
        [
          "elle a changé de métier",
          "elle a suivi une formation",
          "elle détestait son ancien travail"
        ],
        "evidence"
      ],
      [
        "order",
        "Arrange: a surpris ses amis / La décision qu’elle a prise",
        "La décision qu’elle a prise a surpris ses amis",
        "The object relative clause follows the antecedent la décision.",
        [
          "a surpris ses amis",
          "La décision qu’elle a prise"
        ],
        "syntax"
      ],
      [
        "fill",
        "___ elle, ce métier permet un contact humain.",
        "Selon",
        "Selon elle attributes the motivation to the interviewee.",
        [],
        "attribution"
      ],
      [
        "reading",
        "What made the career change less sudden?",
        "une expérience antérieure de bénévolat",
        "Earlier volunteer work gave her relevant experience before training.",
        [
          "un héritage inattendu",
          "une expérience antérieure de bénévolat",
          "la fermeture de la bibliothèque"
        ],
        "inference"
      ],
      [
        "choice",
        "Which tense typically sets a prior ongoing situation?",
        "imparfait",
        "Imparfait can describe a sustained background activity in a life story.",
        [
          "futur simple",
          "imparfait",
          "impératif"
        ],
        "aspect"
      ],
      [
        "fill",
        "Le nouveau travail représente un ___ dans son parcours.",
        "tournant",
        "Un tournant is a change of direction in a personal history.",
        [],
        "meaning"
      ]
    ],
    "writing": [
      "Write a short biographical account based on stated facts and avoid inventing someone's private motives.",
      [
        "Distinguish background, preparation and main turning point using three past-time forms.",
        "Use one relative clause with dont or que appropriately.",
        "Attribute motivations to the person, not the narrator's speculation."
      ],
      "Pendant plusieurs années, Camille travaillait dans une entreprise. Elle avait aussi fait du bénévolat dans son quartier avant de commencer une formation. Un jour, elle a décidé de changer de métier et elle est devenue bibliothécaire. Selon elle, ce choix lui permettait de travailler davantage avec le public. Le métier dont elle rêvait exigeait pourtant de nouvelles compétences. Son parcours montre comment une préparation progressive peut précéder un changement important, mais il ne prouve pas qu’elle détestait son ancien emploi."
    ]
  }
];
export const B1_UNITS_15_18=Object.freeze(units.map((spec,i)=>authorB1DepthUnit(spec,i+15)));
