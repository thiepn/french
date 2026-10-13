import {authorTransferScenario,type TransferAuthoredSpec} from './u13-transfer-model.ts';
const CONTENT:readonly TransferAuthoredSpec[]=[
  {
    "id": "transfer-06",
    "title": "Restaurant booking: a menu and an unconfirmed table",
    "level": "A2→B1",
    "goal": "Make a polite reservation inquiry, read meal offers and distinguish a request from confirmation.",
    "grammarKeys": [
      "polite",
      "condition"
    ],
    "vocabulary": [
      [
        "une réservation",
        "booking",
        "Je demande une réservation."
      ],
      [
        "une table",
        "table",
        "Une table pour trois personnes."
      ],
      [
        "un menu",
        "menu",
        "Le menu propose deux plats."
      ],
      [
        "un plat",
        "dish",
        "Quel plat est disponible ?"
      ],
      [
        "une entrée",
        "starter",
        "Je préfère une entrée légère."
      ],
      [
        "le service",
        "service",
        "Le service commence à midi."
      ],
      [
        "une confirmation",
        "confirmation",
        "J’attends la confirmation."
      ],
      [
        "complet",
        "fully booked",
        "Le restaurant est complet."
      ],
      [
        "une préférence",
        "preference",
        "Je donne ma préférence."
      ],
      [
        "un créneau",
        "time slot",
        "Ce créneau reste proposé."
      ],
      [
        "annuler",
        "cancel",
        "Je souhaite annuler la demande."
      ],
      [
        "disponible",
        "available",
        "La salle est-elle disponible ?"
      ]
    ],
    "dialogue": [
      [
        "Client",
        "Bonjour, je souhaiterais réserver une table pour trois personnes samedi à dix-neuf heures; pouvez-vous vérifier si ce créneau est disponible ?",
        "Hello, I would like to book a table for three Saturday at seven; can you check availability?"
      ],
      [
        "Employée",
        "Nous avons peut-être encore une table, mais je dois consulter la liste des réservations avant de vous donner une réponse définitive.",
        "We may have a table, but I need to check the booking list."
      ],
      [
        "Client",
        "Merci; j’ai aussi vu un menu sur votre site, et je voudrais savoir si les plats annoncés seront proposés samedi soir.",
        "Thanks; I also saw a menu online and want to know if those dishes will be offered Saturday evening."
      ],
      [
        "Employée",
        "Le menu publié est un exemple et certaines spécialités peuvent changer; je peux demander la liste du jour lorsque la cuisine l’aura confirmée.",
        "The published menu is a sample, and some specials may change; I can ask for that day's list."
      ],
      [
        "Client",
        "Je comprends; je vais donc attendre votre réponse écrite pour la table et les détails du menu, sans considérer la réservation comme acquise.",
        "I understand; I'll wait for written confirmation of table and menu rather than assume it is booked."
      ]
    ],
    "reading": {
      "title": "Le menu affiché n’est pas toujours celui du samedi",
      "paragraphs": [
        "Trois amis préparent un dîner au restaurant pour samedi soir. Sur le site, ils trouvent un menu attractif et un formulaire permettant de demander une table. Léa remplit les informations nécessaires et choisit dix-neuf heures. Le formulaire lui répond que sa demande a été reçue. Elle remarque cependant que le texte ne contient ni numéro de réservation confirmée ni garantie de disponibilité. Elle décide de téléphoner pour clarifier la situation.",
        "Au téléphone, une employée explique que plusieurs demandes sont encore en cours d'examen. Le restaurant pourrait proposer une table, mais l'équipe doit vérifier le planning. Elle ajoute que la carte en ligne montre des exemples : les spécialités du samedi dépendront des produits disponibles. Les amis comprennent que le repas présenté sur le site ne sera pas nécessairement celui qu'ils pourront commander.",
        "Léa note les deux incertitudes séparément : l'heure de la table et les plats du soir. Elle remercie l'employée et demande une confirmation écrite. En attendant, elle n'annonce pas aux autres que le restaurant les attend à dix-neuf heures. Elle propose plutôt de vérifier une autre possibilité si aucune réponse n'arrive. Ce comportement évite de confondre une demande envoyée avec une réservation acceptée."
      ],
      "questions": [
        [
          "What does the form confirm?",
          "la réception de la demande",
          [
            "la table définitivement réservée",
            "la réception de la demande",
            "les plats du samedi"
          ],
          "A received request does not guarantee a table."
        ],
        [
          "Why might the menu differ?",
          "les spécialités peuvent changer",
          [
            "les spécialités peuvent changer",
            "la cuisine est toujours fermée",
            "le site est inutilisable"
          ],
          "The employee describes the online menu as examples whose specials vary."
        ],
        [
          "What are the two unresolved points?",
          "la table et les plats",
          [
            "la table et les plats",
            "le nombre d’amis et leur ville",
            "le prix du transport"
          ],
          "Both the reservation time and specific dishes await confirmation."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Restaurant site menu",
        "type": "article",
        "french": "Exemple de menu : entrée de saison, plat végétarien et dessert maison. Les spécialités changent selon les produits disponibles et ne sont pas garanties pour chaque service."
      },
      {
        "label": "Reservation acknowledgment",
        "type": "email",
        "french": "Votre demande pour trois personnes samedi à 19 h a été reçue. Un membre de notre équipe vérifiera les disponibilités et vous transmettra une confirmation si une table est disponible."
      }
    ],
    "crossQuestions": [
      [
        "Which source confirms a reserved table?",
        "aucun des deux",
        [
          "le menu",
          "le courriel",
          "aucun des deux"
        ],
        "An acknowledgment and example menu do not secure a reservation."
      ],
      [
        "What are the two distinct conditions?",
        "disponibilité de la table et des plats",
        [
          "paiement obligatoire",
          "disponibilité de la table et des plats",
          "inscription à un cours"
        ],
        "Table availability and menu availability are separately conditional."
      ]
    ],
    "listening": [
      [
        "For how many people does the client request a table?",
        "trois",
        [
          "deux",
          "trois",
          "quatre"
        ],
        "The caller requests three people."
      ],
      [
        "What is pending before a definitive answer?",
        "la vérification du planning",
        [
          "la vérification du planning",
          "le dessert",
          "le transport"
        ],
        "The employee must check the reservations list."
      ]
    ],
    "writing": [
      "Write a reservation follow-up distinguishing menu information and unconfirmed seating.",
      [
        "Name party size, day and requested time.",
        "Use a polite conditional question and state which booking detail is pending.",
        "Avoid claiming that a sample menu guarantees specific dishes."
      ],
      "Bonjour, je vous remercie pour l’accusé de réception de ma demande de table pour trois personnes samedi à dix-neuf heures. J’ai bien compris que la disponibilité doit encore être vérifiée. Pourriez-vous me confirmer par écrit si le créneau peut être réservé ? J’ai également consulté votre menu en ligne, mais je comprends que les spécialités peuvent changer selon le service. Serait-il possible de connaître la carte prévue pour samedi lorsque les informations seront disponibles ? Je vous remercie et reste dans l’attente de votre réponse."
    ],
    "oral": {
      "prompt": "Explain the difference between the restaurant's menu and reservation reply.",
      "plan": [
        "Identify the desired party and slot.",
        "Separate the menu's changing specials from seating confirmation.",
        "State what information should be requested in writing."
      ],
      "model": "Nous avons demandé une table pour trois samedi à dix-neuf heures. Le restaurant a confirmé la réception de la demande, mais pas encore la réservation. Le menu publié présente des exemples et les plats peuvent changer. Nous devons donc attendre la confirmation de la table et éventuellement demander les spécialités disponibles samedi. Il serait trop tôt de dire que le dîner est définitivement organisé."
    },
    "tasks": [
      [
        "fill",
        "Je ___ réserver une table pour trois. (vouloir, conditional)",
        "voudrais",
        "Voudrais is the polite conditional first person of vouloir.",
        [],
        "polite request"
      ],
      [
        "choice",
        "What does the acknowledgment confirm?",
        "une demande reçue",
        "It confirms only submission and review, not a table.",
        [
          "une table définitive",
          "une demande reçue",
          "un plat gratuit"
        ],
        "confirmation"
      ],
      [
        "reading",
        "Why might a published special change?",
        "les produits disponibles changent",
        "The menu explicitly depends on products for that service.",
        [
          "les produits disponibles changent",
          "le client arrive tôt",
          "la salle est petite"
        ],
        "source"
      ],
      [
        "fill",
        "Si la table est disponible, nous ___ samedi. (venir)",
        "viendrons",
        "Si plus present may lead to futur simple viendrons.",
        [],
        "conditional"
      ],
      [
        "order",
        "Arrange: reste à confirmer / La réservation",
        "La réservation reste à confirmer",
        "A request and its confirmation are separate.",
        [
          "reste à confirmer",
          "La réservation"
        ],
        "syntax"
      ],
      [
        "choice",
        "Which expression asks politely?",
        "Pourriez-vous vérifier ?",
        "Conditional pourriez-vous plus infinitive requests information.",
        [
          "Vous vérifiez immédiatement !",
          "Pourriez-vous vérifier ?",
          "Tu dois réserver !"
        ],
        "register"
      ],
      [
        "fill",
        "Je voudrais connaître les ___ du samedi.",
        "spécialités",
        "Spécialités refers to selected dishes that may vary.",
        [],
        "lexicon"
      ],
      [
        "reading",
        "How many unresolved topics does Léa note?",
        "deux",
        "She notes seating and dishes as separate unknowns.",
        [
          "un",
          "deux",
          "quatre"
        ],
        "evidence"
      ],
      [
        "choice",
        "Which is unsupported?",
        "La table est déjà réservée.",
        "The site only reports receipt of a booking request.",
        [
          "Une demande a été reçue.",
          "La table est déjà réservée.",
          "Le menu peut changer."
        ],
        "misconception"
      ],
      [
        "fill",
        "Il faut attendre une ___ écrite.",
        "confirmation",
        "A written confirmation would resolve the actual booking status.",
        [],
        "status"
      ]
    ]
  },
  {
    "id": "transfer-07",
    "title": "Lost property: the bag, the timeline and the office",
    "level": "A2→B1",
    "goal": "Use past tense layers, object pronouns and a written incident description to inquire about a lost bag.",
    "grammarKeys": [
      "past",
      "pluperfect"
    ],
    "vocabulary": [
      [
        "un sac",
        "bag",
        "J’ai oublié mon sac."
      ],
      [
        "un guichet",
        "counter",
        "Je vais au guichet."
      ],
      [
        "une déclaration",
        "report",
        "Je fais une déclaration."
      ],
      [
        "perdre",
        "lose",
        "J’ai perdu mon sac."
      ],
      [
        "retrouver",
        "find again",
        "Je voudrais le retrouver."
      ],
      [
        "un trajet",
        "journey",
        "Je précise mon trajet."
      ],
      [
        "une heure",
        "time",
        "L’heure est approximative."
      ],
      [
        "une description",
        "description",
        "Je donne une description précise."
      ],
      [
        "un objet",
        "object",
        "L’objet a été retrouvé."
      ],
      [
        "un numéro",
        "number",
        "J’ai reçu un numéro de dossier."
      ],
      [
        "une réponse",
        "reply",
        "J’attends la réponse."
      ],
      [
        "le service des objets trouvés",
        "lost property desk",
        "Le service des objets trouvés traite le dossier."
      ]
    ],
    "dialogue": [
      [
        "Mina",
        "Hier soir, j’ai oublié mon sac dans le bus après avoir changé de place; je l’avais pourtant posé près de mon siège en montant.",
        "Yesterday I left my bag on the bus after changing seats; I had put it near my seat when boarding."
      ],
      [
        "Agent",
        "Pouvez-vous préciser le numéro de la ligne, l’heure approximative et la couleur du sac pour que nous puissions examiner votre déclaration ?",
        "Can you give route, approximate time and bag color so we can examine the report?"
      ],
      [
        "Mina",
        "C’était la ligne douze vers dix-huit heures quarante; le sac était bleu et contenait des livres et un carnet.",
        "It was route twelve at about 18:40; the bag was blue and contained books and a notebook."
      ],
      [
        "Agent",
        "Je vais enregistrer ces détails, mais un numéro de dossier ne signifie pas que nous avons retrouvé votre sac.",
        "I'll register these details, but a file number does not mean the bag has been found."
      ],
      [
        "Mina",
        "Je comprends; je conserverai le numéro et j’attendrai une réponse indiquant si un objet correspondant a réellement été déposé.",
        "I understand; I'll keep the reference and await news whether a matching item was handed in."
      ]
    ],
    "reading": {
      "title": "Un trajet, un oubli et une recherche ouverte",
      "paragraphs": [
        "Mina prend le bus pour rentrer chez elle après une longue journée. En montant, elle pose son sac bleu près de son siège et commence à lire. Plus tard, elle change de place pour laisser passer un autre voyageur. À l'arrêt final, elle descend rapidement et oublie son sac. Elle ne s'en rend compte qu'une demi-heure plus tard. À ce moment-là, elle ne sait pas où le bus se trouve.",
        "Le lendemain, Mina contacte le service des objets trouvés. Elle explique qu'elle avait posé le sac à côté de son premier siège avant de changer de place. Elle fournit le numéro de la ligne, une heure approximative et une description de l'objet. L'agent prend note de ces détails et ouvre un dossier. Il insiste sur un point important : l'enregistrement du signalement ne prouve pas que le sac a été retrouvé.",
        "Mina garde le numéro de dossier et prépare une courte description écrite pour faciliter les recherches. Elle distingue les éléments observés, comme la couleur du sac, de ceux qu'elle ignore, comme l'arrêt où l'objet aurait pu être récupéré. Elle espère obtenir une réponse, mais n'annonce pas à sa famille que le sac est déjà au guichet. Son récit chronologique aide le personnel à rechercher le bon objet."
      ],
      "questions": [
        [
          "When did Mina realize the bag was missing?",
          "une demi-heure après la descente",
          [
            "avant de monter",
            "une demi-heure après la descente",
            "une semaine plus tard"
          ],
          "The narrative places recognition thirty minutes after exiting the bus."
        ],
        [
          "What does the file number prove?",
          "la déclaration a été enregistrée",
          [
            "la déclaration a été enregistrée",
            "le sac a été trouvé",
            "le livre est disponible"
          ],
          "A registered report is not a confirmation that the object was located."
        ],
        [
          "Why does Mina distinguish observed from unknown details?",
          "pour aider une recherche fidèle",
          [
            "pour aider une recherche fidèle",
            "pour changer la ligne",
            "pour acheter un billet"
          ],
          "Accurate information helps staff match an actual bag without inventing an exact location."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Mina's incident report",
        "type": "email",
        "french": "Objet : sac bleu oublié, ligne 12, trajet de 18 h 40 environ. J’avais posé le sac près de mon siège avant de changer de place; il contenait des livres et un carnet."
      },
      {
        "label": "Lost property acknowledgment",
        "type": "email",
        "french": "Votre signalement a été enregistré sous la référence OBJ-124. Cette référence confirme la réception du signalement, mais ne garantit pas qu’un objet correspondant ait été retrouvé."
      }
    ],
    "crossQuestions": [
      [
        "Which source provides details to identify the object?",
        "le signalement de Mina",
        [
          "le signalement de Mina",
          "l’accusé de réception",
          "aucun"
        ],
        "The report contains the color, route, time and contents."
      ],
      [
        "Can the second source prove the bag was found?",
        "non",
        [
          "oui",
          "non",
          "seulement vendredi"
        ],
        "The acknowledgment explicitly states it does not guarantee a recovered object."
      ]
    ],
    "listening": [
      [
        "Which route did Mina take?",
        "la ligne douze",
        [
          "la ligne douze",
          "la ligne vingt",
          "le métro trois"
        ],
        "Mina specifies bus line twelve."
      ],
      [
        "What does the agent say about a case number?",
        "il ne prouve pas la découverte du sac",
        [
          "il ne prouve pas la découverte du sac",
          "il garantit un remboursement",
          "il réserve un siège"
        ],
        "The reference records a report without establishing recovery."
      ]
    ],
    "writing": [
      "Write a lost-property statement with a clear earlier preparation, observed loss and precise identification.",
      [
        "Use passé composé, imparfait and plus-que-parfait appropriately.",
        "Include identifying details without inventing an exact find location.",
        "Explain that the reference is an acknowledgment, not proof of recovery."
      ],
      "Bonjour, je signale la perte d’un sac bleu dans le bus de la ligne douze hier soir vers dix-huit heures quarante. J’avais posé le sac à côté de mon siège en montant dans le bus. Pendant le trajet, j’ai changé de place et je suis descendu sans reprendre l’objet. Le sac contenait des livres et un carnet. J’ai déjà reçu le numéro de signalement OBJ-124, mais je comprends que cela ne signifie pas que le sac a été retrouvé. Pourriez-vous me prévenir si un objet correspondant est déposé au service ?"
    ],
    "oral": {
      "prompt": "Give the lost-property officer a chronological summary of the incident.",
      "plan": [
        "Explain where you had initially placed the bag.",
        "Describe when the loss occurred and its identifying features.",
        "Distinguish a recorded report from a found object."
      ],
      "model": "J’avais placé mon sac bleu près de mon siège en montant dans le bus douze. J’ai changé de place pendant le trajet, puis je suis descendu vers dix-huit heures quarante. Une demi-heure plus tard, j’ai remarqué que mon sac avait disparu. Il contenait des livres et un carnet. Le service a enregistré mon signalement, mais cela ne prouve pas que l’objet a déjà été retrouvé. J’attends une confirmation."
    },
    "tasks": [
      [
        "fill",
        "J’___ posé le sac avant de changer de place.",
        "avais",
        "Plus-que-parfait uses avais to place the action before the seat change.",
        [],
        "past layering"
      ],
      [
        "choice",
        "What is recorded in the case?",
        "un signalement",
        "The office acknowledges a report, not a recovered item.",
        [
          "un signalement",
          "une preuve de découverte",
          "une demande de remboursement"
        ],
        "authority"
      ],
      [
        "reading",
        "Which details identify the bag?",
        "bleu, livres, carnet",
        "The report provides these object identifiers.",
        [
          "bleu, livres, carnet",
          "rouge, chaussures, vélo",
          "noir, casque, clés"
        ],
        "matching"
      ],
      [
        "fill",
        "Le sac était bleu et je l’ai ___. (perdre)",
        "perdu",
        "Perdre forms the past participle perdu.",
        [],
        "past participle"
      ],
      [
        "order",
        "Arrange: a été enregistré / Le signalement",
        "Le signalement a été enregistré",
        "Passive passé composé describes an administrative step, not recovery.",
        [
          "a été enregistré",
          "Le signalement"
        ],
        "syntax"
      ],
      [
        "choice",
        "Which is a factual conclusion?",
        "Le dossier a été ouvert.",
        "Opening the file is reported; finding the bag is not.",
        [
          "Le sac est retrouvé.",
          "Le dossier a été ouvert.",
          "L’agent possède le sac."
        ],
        "evidence"
      ],
      [
        "fill",
        "J’ai donné une ___ de l’objet.",
        "description",
        "Description provides observable identifying details.",
        [],
        "vocabulary"
      ],
      [
        "reading",
        "When did Mina notice the loss?",
        "après avoir quitté le bus",
        "She noticed only after leaving the bus.",
        [
          "avant le départ",
          "après avoir quitté le bus",
          "dans le guichet"
        ],
        "chronology"
      ],
      [
        "choice",
        "Which prior-past form is correct?",
        "Elle avait posé le sac.",
        "Avoir in imperfect plus past participle gives plus-que-parfait.",
        [
          "Elle a avait posé le sac.",
          "Elle avait posé le sac.",
          "Elle était poser le sac."
        ],
        "grammar"
      ],
      [
        "fill",
        "Je garde le numéro de ___.",
        "dossier",
        "The case number helps future follow-up without guaranteeing the object is found.",
        [],
        "lexicon"
      ]
    ]
  },
  {
    "id": "transfer-08",
    "title": "Festival invitation: direct objects and conflicting times",
    "level": "A2→B1",
    "goal": "Compare event announcements, use pronouns correctly and draft a careful invitation.",
    "grammarKeys": [
      "pronouns",
      "future"
    ],
    "vocabulary": [
      [
        "un festival",
        "festival",
        "Le festival a lieu samedi."
      ],
      [
        "un billet",
        "ticket",
        "J’achète un billet."
      ],
      [
        "une entrée",
        "entry",
        "L’entrée commence à seize heures."
      ],
      [
        "un spectacle",
        "show",
        "Le spectacle est annoncé."
      ],
      [
        "une scène",
        "stage",
        "La scène est près de l’entrée."
      ],
      [
        "un horaire",
        "schedule",
        "L’horaire peut changer."
      ],
      [
        "une affiche",
        "poster",
        "L’affiche indique dix-sept heures."
      ],
      [
        "inviter",
        "invite",
        "Je vais l’inviter."
      ],
      [
        "confirmer",
        "confirm",
        "Il faut confirmer le lieu."
      ],
      [
        "un programme",
        "program",
        "Je regarde le programme."
      ],
      [
        "une réponse",
        "reply",
        "J’attends une réponse."
      ],
      [
        "un changement",
        "change",
        "Un changement a été annoncé."
      ]
    ],
    "dialogue": [
      [
        "Noémie",
        "Je voudrais inviter Camille au festival de samedi; l’affiche annonce le premier concert à dix-sept heures, mais le programme en ligne indique dix-huit heures.",
        "I want to invite Camille to the festival Saturday; the poster says five, online program six."
      ],
      [
        "Idris",
        "Tu peux lui proposer de venir, mais avant de lui communiquer une heure certaine, il faudrait vérifier quel programme est à jour.",
        "You can invite her, but check which schedule is current before giving a definite time."
      ],
      [
        "Noémie",
        "Je vais lui expliquer la différence; je la connais bien et je sais qu’elle préfère organiser son trajet à l’avance.",
        "I'll explain the discrepancy; I know her and she likes planning travel ahead."
      ],
      [
        "Idris",
        "Téléphone-lui pour demander si elle souhaite venir, puis contacte les organisateurs pour leur demander de préciser l’heure exacte.",
        "Call her to ask whether she wants to come, then contact organizers for confirmation."
      ],
      [
        "Noémie",
        "Je lui enverrai le programme confirmé dès que nous l’aurons reçu, sans transformer l’une des deux annonces en vérité définitive.",
        "I'll send her the confirmed program as soon as we receive it, without declaring either version certain."
      ]
    ],
    "reading": {
      "title": "Une invitation et deux programmes",
      "paragraphs": [
        "Noémie prépare une invitation pour une amie qui habite assez loin du lieu du festival. Elle trouve une affiche annonçant un concert samedi à dix-sept heures. En cherchant l'adresse exacte, elle ouvre le programme en ligne et découvre que le même concert y figure à dix-huit heures. Elle ne sait pas quel document reflète le dernier changement. Comme son amie doit organiser son trajet, elle décide de ne pas choisir une heure au hasard.",
        "Idris lui conseille de distinguer la simple invitation de l'annonce des informations pratiques. Noémie peut demander à Camille si elle souhaite participer, puis vérifier la programmation auprès des organisateurs. Elle appelle Camille, qui répond qu'elle aimerait venir si le trajet est raisonnable. Cette réponse montre une intention, mais pas une arrivée confirmée. Noémie note aussi qu'un billet pourrait être nécessaire selon les activités choisies.",
        "Une fois la réponse officielle obtenue, Noémie préparera un message précisant le lieu, l'horaire et les conditions d'entrée. Elle gardera les deux versions initiales pour pouvoir expliquer le changement si quelqu'un pose une question. Son objectif est de permettre à son amie de prendre une décision informée, non de la convaincre avec une certitude qu'elle ne possède pas."
      ],
      "questions": [
        [
          "Which two start times conflict?",
          "dix-sept et dix-huit heures",
          [
            "dix-sept et dix-huit heures",
            "seize et dix-sept heures",
            "quinze et vingt heures"
          ],
          "The poster shows seventeen, the online program eighteen."
        ],
        [
          "Does Camille promise to arrive?",
          "non, elle souhaite venir sous condition",
          [
            "oui, absolument",
            "non, elle souhaite venir sous condition",
            "elle refuse"
          ],
          "She expresses interest depending on a reasonable journey."
        ],
        [
          "What should the final invitation include?",
          "heure, lieu et conditions d’entrée",
          [
            "heure, lieu et conditions d’entrée",
            "une date inventée",
            "un nombre de billets inconnus"
          ],
          "Accurate practical planning requires confirmation of time, place and entry conditions."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Printed festival poster",
        "type": "poster",
        "french": "Festival du quartier — samedi. Premier concert à 17 h sur la scène principale. Consultez le programme complet pour connaître toutes les activités."
      },
      {
        "label": "Online program",
        "type": "article",
        "french": "Programme provisoire du festival : concert d’ouverture samedi à 18 h. Les horaires peuvent être modifiés; vérifiez les mises à jour officielles avant votre déplacement."
      }
    ],
    "crossQuestions": [
      [
        "Which source identifies itself as provisional?",
        "le programme en ligne",
        [
          "l’affiche",
          "le programme en ligne",
          "aucun"
        ],
        "The online document explicitly calls its program provisional."
      ],
      [
        "Do the two sources justify declaring 18 h final?",
        "non",
        [
          "oui",
          "non",
          "seulement s’il pleut"
        ],
        "Both versions conflict, and the online schedule itself warns changes are possible."
      ]
    ],
    "listening": [
      [
        "What time does the printed poster announce?",
        "dix-sept heures",
        [
          "dix-sept heures",
          "dix-huit heures",
          "seize heures"
        ],
        "Noémie states the printed poster's time."
      ],
      [
        "Who will Noémie contact for exact timing?",
        "les organisateurs",
        [
          "les organisateurs",
          "son professeur",
          "la banque"
        ],
        "Idris recommends checking with event organizers."
      ]
    ],
    "writing": [
      "Write a French invitation that identifies a conflicting concert schedule and requests a preference.",
      [
        "Use direct and indirect object pronouns in context.",
        "State two published times without certifying either.",
        "Invite a response and promise to share official confirmation."
      ],
      "Bonjour Camille, j’aimerais t’inviter au festival du quartier samedi. J’ai vu une affiche annonçant un concert à dix-sept heures, mais le programme en ligne donne dix-huit heures. Je vais contacter les organisateurs pour leur demander quel horaire est valable. Si tu souhaites venir, pourrais-tu me dire quelles heures te conviendraient pour ton trajet ? Dès que j’aurai une confirmation, je te l’enverrai avec les informations d’entrée. J’espère que nous pourrons y aller ensemble."
    ],
    "oral": {
      "prompt": "Explain the scheduling discrepancy and give Camille a non-pressuring invitation.",
      "plan": [
        "Name the festival and the two published times.",
        "Use a correct pronoun to refer to Camille.",
        "Say how the verified program will be shared."
      ],
      "model": "Je voudrais inviter Camille au festival de samedi. Une affiche annonce dix-sept heures, mais le programme en ligne indique dix-huit heures et reste provisoire. Je vais lui demander si elle veut venir, puis contacter les organisateurs pour confirmer le début du concert. Comme Camille doit organiser son trajet, je ne lui donnerai pas une heure certaine avant cette réponse. Je lui enverrai les informations exactes dès qu’elles seront disponibles."
    },
    "tasks": [
      [
        "fill",
        "Je connais Camille : je ___ connais.",
        "la",
        "La replaces the direct object Camille.",
        [],
        "direct pronoun"
      ],
      [
        "choice",
        "What time is in the poster?",
        "dix-sept heures",
        "The printed announcement lists the opening at 17 h.",
        [
          "dix-sept heures",
          "dix-huit heures",
          "seize heures"
        ],
        "evidence"
      ],
      [
        "reading",
        "What does the online program say about certainty?",
        "ses horaires peuvent changer",
        "The online program is expressly provisional.",
        [
          "ses horaires peuvent changer",
          "tous les concerts sont annulés",
          "aucun billet n’existe"
        ],
        "source"
      ],
      [
        "fill",
        "Je téléphone à Camille : je ___ téléphone.",
        "lui",
        "Téléphoner à takes the indirect object lui.",
        [],
        "indirect pronoun"
      ],
      [
        "order",
        "Arrange: le programme confirmé / Je lui enverrai",
        "Je lui enverrai le programme confirmé",
        "Future simple shows a later action after confirmation.",
        [
          "le programme confirmé",
          "Je lui enverrai"
        ],
        "syntax"
      ],
      [
        "choice",
        "What does interest from Camille imply?",
        "une envie conditionnelle",
        "She indicates an interest conditioned on her travel circumstances.",
        [
          "une arrivée garantie",
          "une envie conditionnelle",
          "un refus définitif"
        ],
        "modal precision"
      ],
      [
        "fill",
        "Nous ___ au concert si l’heure convient. (aller, future nous)",
        "irons",
        "Aller has the irregular future stem ir-.",
        [],
        "future"
      ],
      [
        "reading",
        "Why check with the organizer?",
        "les sources se contredisent",
        "Two conflicting schedules require an authoritative clarification.",
        [
          "les sources se contredisent",
          "le billet est perdu",
          "le festival a été supprimé"
        ],
        "inference"
      ],
      [
        "choice",
        "Which statement is defensible?",
        "L’heure du concert doit être confirmée.",
        "Both documents disagree and one is explicitly provisional.",
        [
          "Le concert commence certainement à 18 h.",
          "L’heure du concert doit être confirmée.",
          "Le festival se déroule lundi."
        ],
        "accuracy"
      ],
      [
        "fill",
        "Je vais lui envoyer une ___ après vérification.",
        "confirmation",
        "A confirmation resolves ambiguity before a final invitation.",
        [],
        "lexicon"
      ]
    ]
  },
  {
    "id": "transfer-09",
    "title": "Course registration: receipt and approval in a message chain",
    "level": "A2→B1",
    "goal": "Integrate polite conditional, passive status and sourced email comparison.",
    "grammarKeys": [
      "passive",
      "report"
    ],
    "vocabulary": [
      [
        "une inscription",
        "registration",
        "Mon inscription reste en cours."
      ],
      [
        "un accusé de réception",
        "acknowledgment",
        "J’ai reçu un accusé de réception."
      ],
      [
        "un dossier",
        "application file",
        "Le dossier est examiné."
      ],
      [
        "une décision",
        "decision",
        "La décision sera annoncée."
      ],
      [
        "approuver",
        "approve",
        "La demande n’est pas approuvée."
      ],
      [
        "une référence",
        "reference",
        "Je garde ma référence."
      ],
      [
        "une demande",
        "request",
        "La demande peut être étudiée."
      ],
      [
        "un délai",
        "timeframe",
        "Le délai n’est pas garanti."
      ],
      [
        "contacter",
        "contact",
        "Je vais contacter le secrétariat."
      ],
      [
        "un justificatif",
        "supporting document",
        "Un justificatif peut être demandé."
      ],
      [
        "une réponse",
        "reply",
        "Je n’ai pas reçu de décision."
      ],
      [
        "une confirmation",
        "confirmation",
        "J’attends une confirmation officielle."
      ]
    ],
    "dialogue": [
      [
        "Zoé",
        "J’ai envoyé mon inscription lundi et reçu un numéro de référence mardi; je pensais que cela signifiait que ma place était confirmée.",
        "I applied Monday and received a reference Tuesday; I thought it confirmed my place."
      ],
      [
        "Omar",
        "Regarde le texte exact : un accusé de réception ne signifie pas toujours que le dossier a été approuvé ou qu’une place est disponible.",
        "Read the actual message: acknowledgment does not mean approval or availability."
      ],
      [
        "Zoé",
        "Le courriel indique que les demandes seront examinées cette semaine, mais il ne donne pas de date de réponse précise.",
        "The email says applications will be reviewed this week but gives no exact reply date."
      ],
      [
        "Omar",
        "Tu pourrais attendre la date annoncée, puis envoyer une relance polie en mentionnant ton numéro de dossier et l’information manquante.",
        "You could wait through the stated period, then send a polite reminder with reference and question."
      ],
      [
        "Zoé",
        "Je vais donc garder l’accusé de réception, sans dire à mes amis que je suis inscrite définitivement avant une réponse officielle.",
        "I'll keep the acknowledgment but won't claim a confirmed registration until an official reply."
      ]
    ],
    "reading": {
      "title": "Un numéro ne garantit pas une place",
      "paragraphs": [
        "Zoé dépose un formulaire pour participer à un atelier. L'envoi se termine sans erreur et un message automatique lui attribue un numéro de référence. Elle se réjouit et commence à organiser sa semaine comme si son inscription avait été approuvée. Le lendemain, elle relit le texte et remarque qu'il utilise seulement l'expression « accusé de réception ». Elle demande à Omar si ce document confirme réellement sa place.",
        "Omar lui explique que la réception et l'examen d'une demande sont deux étapes différentes. Le centre doit encore vérifier la disponibilité et certaines informations administratives. Zoé retrouve un autre courriel précisant que les dossiers seront examinés pendant la semaine, sans date finale garantie. Elle comprend que la référence sert à identifier sa demande mais ne constitue pas une décision. Elle ne doit donc pas supposer qu'un siège lui est réservé.",
        "Zoé décide d'attendre la réponse du centre. Si aucune décision n'arrive après la période annoncée, elle préparera un court courriel avec le numéro et une question précise sur son statut. Elle expliquera à ses amis qu'elle a envoyé le formulaire, mais qu'elle attend toujours l'acceptation. Son récit transforme une compréhension erronée en démarche claire, sans modifier le dossier ni prétendre obtenir une garantie."
      ],
      "questions": [
        [
          "Which event happened Monday?",
          "l’envoi de l’inscription",
          [
            "l’envoi de l’inscription",
            "l’approbation",
            "la première séance"
          ],
          "The application was submitted, not necessarily approved."
        ],
        [
          "What is the purpose of the reference number?",
          "identifier le dossier",
          [
            "garantir une place",
            "identifier le dossier",
            "annuler automatiquement"
          ],
          "The number identifies the file for follow-up."
        ],
        [
          "What should Zoé do if no decision arrives?",
          "envoyer une relance précise",
          [
            "envoyer une relance précise",
            "affirmer qu’elle est acceptée",
            "s’inscrire deux fois sans raison"
          ],
          "A targeted follow-up is appropriate after the stated review period."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Automatic acknowledgment",
        "type": "email",
        "french": "Votre demande d’inscription a été reçue. Référence U-419. Ce courriel automatique confirme la réception du formulaire et ne constitue pas une confirmation de place."
      },
      {
        "label": "Review information",
        "type": "notice",
        "french": "Les dossiers complets seront examinés pendant la semaine. Les décisions seront communiquées directement par le secrétariat. Aucun délai de réponse exact n’est garanti."
      }
    ],
    "crossQuestions": [
      [
        "Which source contains the registration reference?",
        "l’accusé de réception",
        [
          "l’accusé de réception",
          "la notice",
          "aucun"
        ],
        "The acknowledgment carries the case reference U-419."
      ],
      [
        "What shared fact do both sources support?",
        "une décision reste à communiquer",
        [
          "une place est confirmée",
          "une décision reste à communiquer",
          "la formation est annulée"
        ],
        "Both distinguish initial processing from a final decision."
      ]
    ],
    "listening": [
      [
        "What did Zoé receive Tuesday?",
        "un numéro de référence",
        [
          "une décision définitive",
          "un numéro de référence",
          "une facture"
        ],
        "Zoé received a reference number, not confirmed enrollment."
      ],
      [
        "What does Omar advise after the review period?",
        "une relance polie",
        [
          "une relance polie",
          "une annulation immédiate",
          "un paiement répété"
        ],
        "He suggests a specific follow-up if the promised time passes."
      ]
    ],
    "writing": [
      "Write an enrollment status email with accurate attribution and a polite next step.",
      [
        "Name the application date and reference.",
        "Distinguish acknowledgment from final approval.",
        "Ask a precise question without demanding an unverified entitlement."
      ],
      "Bonjour Madame, j’ai envoyé ma demande d’inscription lundi et reçu mardi un accusé de réception portant la référence U-419. Le message confirme que mon formulaire a été reçu, mais il ne précise pas que ma place est acceptée. J’ai également lu que les dossiers seraient examinés pendant la semaine. Pourriez-vous m’indiquer si une décision a été prise ou si d’autres informations sont nécessaires ? Je vous remercie pour votre réponse et conserve la référence pour faciliter le suivi. Cordialement, Zoé."
    ],
    "oral": {
      "prompt": "Explain Zoé's registration status as a neutral friend.",
      "plan": [
        "State what the two documents actually say.",
        "Clarify why the reference does not mean approved registration.",
        "Describe the appropriate follow-up."
      ],
      "model": "Zoé a déposé son inscription lundi et reçu un accusé de réception avec un numéro de référence. Ce document montre seulement que le formulaire est arrivé. Le centre examine les dossiers pendant la semaine et communiquera ensuite les décisions. Zoé n’a donc pas encore une place confirmée. Si elle n’obtient pas de réponse, elle pourra envoyer une relance polie en indiquant la référence et en demandant son statut."
    },
    "tasks": [
      [
        "fill",
        "Les demandes sont ___ par le secrétariat. (examiner)",
        "examinées",
        "Passive participle agrees with feminine plural demandes.",
        [],
        "passive"
      ],
      [
        "choice",
        "What does the reference prove?",
        "le formulaire est reçu",
        "The automatic reply explicitly restricts its meaning to receipt.",
        [
          "la place est garantie",
          "le formulaire est reçu",
          "la formation est annulée"
        ],
        "scope"
      ],
      [
        "reading",
        "Which document describes the review period?",
        "la notice",
        "The review information states applications are examined during the week.",
        [
          "le reçu automatique",
          "la notice",
          "la liste des participants"
        ],
        "evidence"
      ],
      [
        "fill",
        "Je vous remercie de votre ___ .",
        "réponse",
        "Réponse is the reply the applicant is requesting.",
        [],
        "polite register"
      ],
      [
        "order",
        "Arrange: reste à examiner / Le dossier",
        "Le dossier reste à examiner",
        "The administrative step is still pending.",
        [
          "reste à examiner",
          "Le dossier"
        ],
        "syntax"
      ],
      [
        "choice",
        "Which is not a justified conclusion?",
        "Zoé a une place confirmée.",
        "No source confirms acceptance or reserves a place.",
        [
          "La demande est reçue.",
          "Zoé a une place confirmée.",
          "Le dossier a une référence."
        ],
        "misconception"
      ],
      [
        "fill",
        "Les décisions seront ___ par écrit. (communiquer)",
        "communiquées",
        "Feminine plural decisions requires communiquées in passive future.",
        [],
        "agreement"
      ],
      [
        "reading",
        "When should Zoé consider a reminder?",
        "après la période annoncée",
        "Omar recommends waiting until the stated review window ends.",
        [
          "avant d’envoyer la demande",
          "après la période annoncée",
          "pendant le premier cours"
        ],
        "timing"
      ],
      [
        "choice",
        "Which is an accurate indirect report?",
        "Omar a expliqué que l’accord manquait.",
        "The report preserves the still-pending decision.",
        [
          "Omar a confirmé l’inscription.",
          "Omar a expliqué que l’accord manquait.",
          "Omar a donné une nouvelle place."
        ],
        "reported speech"
      ],
      [
        "fill",
        "Je conserve mon ___ de dossier.",
        "numéro",
        "The file number allows a targeted follow-up.",
        [],
        "lexicon"
      ]
    ]
  },
  {
    "id": "transfer-10",
    "title": "Service complaint: a policy notice and a support reply",
    "level": "B1 integrated",
    "goal": "Synthesize a general published policy with case-specific reply and request a verifiable decision.",
    "grammarKeys": [
      "polite",
      "concession"
    ],
    "vocabulary": [
      [
        "une réclamation",
        "complaint",
        "Je prépare une réclamation."
      ],
      [
        "un défaut",
        "defect",
        "L’objet a un défaut."
      ],
      [
        "une garantie",
        "warranty",
        "La garantie doit être vérifiée."
      ],
      [
        "une preuve",
        "proof",
        "Je garde une preuve d’achat."
      ],
      [
        "une facture",
        "invoice",
        "La facture indique la date."
      ],
      [
        "un échange",
        "exchange",
        "Un échange reste possible."
      ],
      [
        "une réparation",
        "repair",
        "Une réparation peut être proposée."
      ],
      [
        "un remboursement",
        "refund",
        "Je demande les conditions de remboursement."
      ],
      [
        "un délai",
        "timeframe",
        "Le délai est indicatif."
      ],
      [
        "examiner",
        "examine",
        "Nous examinerons votre dossier."
      ],
      [
        "une condition",
        "condition",
        "Une condition reste à vérifier."
      ],
      [
        "une décision",
        "decision",
        "La décision n’est pas communiquée."
      ]
    ],
    "dialogue": [
      [
        "Adèle",
        "J’ai acheté un casque qui ne fonctionne pas correctement; la notice présente plusieurs solutions possibles, mais je ne sais pas laquelle s’applique à mon achat.",
        "I bought headphones that don't work properly; the policy lists possible remedies but I'm unsure which applies."
      ],
      [
        "Conseiller",
        "Nous devons vérifier la facture, la description du défaut et les conditions du dossier avant de préciser les options disponibles.",
        "We must check the invoice, defect and conditions before listing available options."
      ],
      [
        "Adèle",
        "Je comprends; pourriez-vous confirmer que ma réclamation a bien été reçue et m’indiquer si une réparation peut être étudiée ?",
        "Could you confirm receipt and whether a repair may be considered?"
      ],
      [
        "Conseiller",
        "Oui, votre signalement a été enregistré, mais nous n’avons encore approuvé ni échange ni remboursement; une réponse écrite suivra.",
        "Your complaint is recorded, but neither exchange nor refund approved; written reply will follow."
      ],
      [
        "Adèle",
        "Je vais donc conserver la facture et attendre votre examen, sans présenter la politique générale comme une décision personnelle déjà prise.",
        "I'll keep the invoice and await review, without treating general policy as a specific decision."
      ]
    ],
    "reading": {
      "title": "Une politique générale, un cas particulier",
      "paragraphs": [
        "Adèle a acheté un casque audio qu'elle souhaite utiliser pour ses cours. Après quelques jours, elle remarque un défaut : le son se coupe régulièrement. Elle vérifie la facture et consulte les informations publiées par le vendeur. Le texte évoque différentes solutions, notamment une réparation, un échange ou un remboursement selon les conditions applicables. Adèle ne peut cependant pas savoir immédiatement quelle solution correspond à son cas.",
        "Elle contacte alors le service client en décrivant le défaut et en indiquant la référence de l'achat. Un conseiller confirme que la réclamation a été enregistrée et que le dossier doit être étudié. Il demande une précision sur le problème, puis annonce qu'une réponse sera envoyée par écrit. Aucune réparation n'a encore été organisée et aucune décision de remboursement n'a été communiquée. Adèle choisit donc de ne pas supposer une issue certaine.",
        "Dans son message de suivi, Adèle distingue la politique publique des démarches spécifiques à son dossier. Elle peut citer les options mentionnées sur le site, mais elle doit attendre que le vendeur précise laquelle est disponible après vérification. Elle explique son problème sans exagérer ni inventer de garanties. Cette démarche produit une demande vérifiable et un compte rendu fidèle des échanges."
      ],
      "questions": [
        [
          "Which solutions appear in the public policy?",
          "réparation, échange ou remboursement",
          [
            "réparation, échange ou remboursement",
            "seulement un remboursement",
            "un billet gratuit"
          ],
          "The notice lists these possible remedies subject to conditions."
        ],
        [
          "What did support actually confirm?",
          "la réception de la réclamation",
          [
            "une réparation approuvée",
            "la réception de la réclamation",
            "un remboursement envoyé"
          ],
          "The adviser confirms receipt and pending review, not a specific outcome."
        ],
        [
          "Why are the policy and reply not interchangeable?",
          "la politique est générale, la réponse concerne un dossier",
          [
            "la politique est générale, la réponse concerne un dossier",
            "les deux confirment une réparation",
            "la facture est fausse"
          ],
          "Generic options are not approvals for an individual case."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Published service policy",
        "type": "notice",
        "french": "Selon les conditions applicables, un article présentant un défaut peut faire l’objet d’un examen conduisant éventuellement à une réparation, un échange ou un remboursement. Les options dépendent du dossier."
      },
      {
        "label": "Individual support reply",
        "type": "email",
        "french": "Nous accusons réception de votre réclamation R-405. Le défaut signalé sera examiné; à ce stade, aucune réparation, aucun échange et aucun remboursement ne sont approuvés."
      }
    ],
    "crossQuestions": [
      [
        "Which source mentions the complaint reference?",
        "la réponse individuelle",
        [
          "la réponse individuelle",
          "la politique générale",
          "les deux"
        ],
        "Only the case-specific support message identifies R-405."
      ],
      [
        "What would be inaccurate after reading both?",
        "dire que le remboursement est approuvé",
        [
          "dire que la demande est enregistrée",
          "dire que le remboursement est approuvé",
          "dire qu’un examen reste nécessaire"
        ],
        "The policy lists possibilities and the reply explicitly rejects any claim of approval so far."
      ]
    ],
    "listening": [
      [
        "What problem does Adèle report?",
        "le casque fonctionne mal",
        [
          "le casque fonctionne mal",
          "le bus est retardé",
          "le colis est absent"
        ],
        "Adèle describes malfunctioning headphones."
      ],
      [
        "What decision is confirmed by the adviser?",
        "aucune réparation ni remboursement",
        [
          "un remboursement immédiat",
          "aucune réparation ni remboursement",
          "un nouvel achat"
        ],
        "Support confirms receipt but no remedy has yet been approved."
      ]
    ],
    "writing": [
      "Write a precise service follow-up comparing the general policy with the individual response.",
      [
        "Quote no rights or entitlements that the sources do not establish.",
        "Summarize the case-specific acknowledgment accurately.",
        "Request a written remedy decision after the required examination."
      ],
      "Bonjour, je vous écris au sujet de ma réclamation R-405 concernant un casque dont le son se coupe régulièrement. J’ai consulté votre politique indiquant qu’une réparation, un échange ou un remboursement pourrait être proposé selon les conditions applicables. Votre réponse individuelle confirme toutefois seulement la réception du dossier et l’examen à venir. Je comprends donc qu’aucune solution n’a encore été approuvée. Pourriez-vous m’indiquer si d’autres informations sont nécessaires et quand une réponse écrite pourrait être transmise ? Je conserve ma facture pour faciliter la vérification."
    ],
    "oral": {
      "prompt": "Explain to Adèle why she cannot claim an approved refund yet.",
      "plan": [
        "Summarize the general policy and its conditions.",
        "State the actual case-specific reply.",
        "Recommend a precise follow-up request."
      ],
      "model": "Le vendeur publie plusieurs solutions possibles en cas de défaut, notamment réparation, échange ou remboursement. Cependant, ces options dépendent des conditions de chaque dossier. Dans la réponse à Adèle, le service confirme uniquement qu’il a reçu sa réclamation et qu’il va l’examiner. Aucun remboursement n’est approuvé. Adèle devrait conserver sa facture, donner une description exacte du problème et demander une réponse écrite après vérification."
    },
    "tasks": [
      [
        "fill",
        "Je ___ connaître les solutions possibles. (souhaiter, conditional)",
        "souhaiterais",
        "Souhaiterais is a polite conditional form for a request.",
        [],
        "politeness"
      ],
      [
        "choice",
        "What does the specific reply confirm?",
        "la réception du dossier",
        "The adviser confirms that the complaint was logged.",
        [
          "le remboursement",
          "la réception du dossier",
          "l’échange"
        ],
        "status"
      ],
      [
        "reading",
        "What kind of document lists possible solutions?",
        "la politique générale",
        "The published notice lists generic conditional remedies.",
        [
          "la politique générale",
          "le reçu individuel",
          "le programme de formation"
        ],
        "cross-source"
      ],
      [
        "fill",
        "Bien que le défaut ___ réel, un examen reste nécessaire. (être)",
        "soit",
        "Bien que selects subjunctive soit in this concession.",
        [],
        "concession"
      ],
      [
        "order",
        "Arrange: reste à examiner / La réclamation",
        "La réclamation reste à examiner",
        "The reply establishes a pending review, not an approved outcome.",
        [
          "reste à examiner",
          "La réclamation"
        ],
        "syntax"
      ],
      [
        "choice",
        "Which assertion is unsupported?",
        "Le remboursement est déjà approuvé.",
        "The individual case reply expressly says no remedy is approved.",
        [
          "La réclamation est reçue.",
          "Le remboursement est déjà approuvé.",
          "Le casque a un défaut signalé."
        ],
        "evidence"
      ],
      [
        "fill",
        "Je garde la ___ de mon achat.",
        "facture",
        "An invoice supports identification and details of an earlier purchase.",
        [],
        "lexicon"
      ],
      [
        "reading",
        "What will follow the examination?",
        "une réponse écrite",
        "Support commits to a written reply after reviewing the case.",
        [
          "une réponse écrite",
          "une livraison garantie",
          "une invitation"
        ],
        "workflow"
      ],
      [
        "choice",
        "Which polite question is correct?",
        "Pourriez-vous préciser la décision ?",
        "Pourriez-vous takes the infinitive préciser.",
        [
          "Pourriez-vous précisez la décision ?",
          "Pourriez-vous préciser la décision ?",
          "Vous pourriez précise la décision ?"
        ],
        "grammar"
      ],
      [
        "fill",
        "Le problème doit être ___ avant toute décision. (examiner)",
        "examiné",
        "Passive infinitive être examiné gives the required prior step.",
        [],
        "process"
      ]
    ]
  }
];
export const TRANSFER_06_10=Object.freeze(CONTENT.map((spec,i)=>authorTransferScenario(spec,i+6)));
