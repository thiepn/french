import {authorTransferScenario,type TransferAuthoredSpec} from './u13-transfer-model.ts';
const CONTENT:readonly TransferAuthoredSpec[]=[
  {
    "id": "transfer-01",
    "title": "At the market: quantities, labels and the seller",
    "level": "A1→A2",
    "goal": "Compare a market sign with a spoken offer; use partitives, quantities and a precise follow-up.",
    "grammarKeys": [
      "articles",
      "questions"
    ],
    "vocabulary": [
      [
        "du pain",
        "some bread",
        "Je voudrais du pain."
      ],
      [
        "une pomme",
        "an apple",
        "Je prends une pomme."
      ],
      [
        "un kilo",
        "a kilogram",
        "Un kilo coûte trois euros."
      ],
      [
        "le prix",
        "price",
        "Le prix est indiqué sur l’affiche."
      ],
      [
        "frais",
        "fresh",
        "Les légumes sont frais."
      ],
      [
        "la caisse",
        "checkout",
        "Je paie à la caisse."
      ],
      [
        "le vendeur",
        "seller",
        "Le vendeur explique le prix."
      ],
      [
        "une réduction",
        "discount",
        "La réduction concerne deux kilos."
      ],
      [
        "le panier",
        "basket",
        "Je mets les fruits dans le panier."
      ],
      [
        "un reçu",
        "receipt",
        "Je garde le reçu."
      ],
      [
        "combien",
        "how much",
        "Combien coûte un kilo ?"
      ],
      [
        "une affiche",
        "sign",
        "L’affiche date de lundi."
      ]
    ],
    "dialogue": [
      [
        "Léna",
        "Bonjour, je voudrais du pain et un kilo de pommes, mais je ne comprends pas si le prix sur l’affiche est encore valable.",
        "Hello, I'd like bread and a kilo of apples, but I can't tell whether the sign's price still applies."
      ],
      [
        "Marchand",
        "Bonjour, les pommes coûtent trois euros le kilo aujourd’hui; l’affiche de deux euros concerne uniquement les achats de deux kilos.",
        "Hello, apples are three euros per kilo today; the two-euro sign applies only to purchases of two kilos."
      ],
      [
        "Léna",
        "Merci, je préfère acheter un seul kilo; est-ce que je peux payer par carte et recevoir un reçu avec les prix exacts ?",
        "Thanks; I prefer one kilo. Can I pay by card and have a receipt with exact prices?"
      ],
      [
        "Marchand",
        "Oui, le paiement par carte est possible et le reçu indiquera le prix de chaque produit, mais le pain sera payé séparément.",
        "Yes, card payment is available and the receipt lists each item's price, but bread is paid separately."
      ],
      [
        "Léna",
        "Très bien, je prends un kilo de pommes et du pain; je vais vérifier le reçu plutôt que de supposer que la réduction s’applique.",
        "Great, I'll take one kilo of apples and some bread; I'll check the receipt rather than assume the discount."
      ]
    ],
    "reading": {
      "title": "Une affiche qui ne dit pas tout",
      "paragraphs": [
        "Chaque samedi, Léna se rend au marché pour acheter quelques produits frais. Cette semaine, elle remarque une affiche annonçant des pommes à deux euros le kilo. Elle n'a besoin que d'un kilo et pense d'abord payer deux euros. En arrivant au stand, elle voit une deuxième pancarte plus petite, mais elle ne peut pas lire toutes les conditions. Plutôt que de remplir son panier sans demander, elle s'adresse directement au vendeur.",
        "Le marchand lui explique que la réduction à deux euros le kilo n'est valable que pour un achat de deux kilos. Pour un seul kilo, le tarif est de trois euros. Léna remercie le vendeur et décide de ne pas acheter davantage de fruits uniquement pour obtenir un prix réduit. Elle demande aussi si elle peut payer par carte et recevoir un reçu détaillé. Le vendeur répond que ces deux possibilités sont disponibles aujourd'hui.",
        "Après son achat, Léna compare le reçu avec les informations reçues au stand. Les pommes ont bien été comptées au tarif normal d'un kilo. Elle comprend que le prix annoncé sur une affiche peut être exact tout en étant soumis à une condition. À l'avenir, elle vérifiera la quantité concernée et la date d'application d'une promotion. Une question simple au vendeur lui aura évité une mauvaise interprétation."
      ],
      "questions": [
        [
          "Which price applies to one kilogram?",
          "trois euros",
          [
            "deux euros",
            "trois euros",
            "cinq euros"
          ],
          "The two-euro rate requires buying two kilograms; one kilogram costs three."
        ],
        [
          "Why does Léna not buy an additional kilogram?",
          "elle n’en a pas besoin",
          [
            "elle n’en a pas besoin",
            "les pommes sont absentes",
            "la carte est refusée"
          ],
          "She decides not to increase her quantity solely to receive the discount."
        ],
        [
          "Which lesson follows from the reading?",
          "vérifier la condition de quantité",
          [
            "croire toutes les petites affiches",
            "vérifier la condition de quantité",
            "toujours acheter deux kilos"
          ],
          "The issue was a conditional promotion that required a specific quantity."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Market poster",
        "type": "poster",
        "french": "Offre du samedi : pommes à 2 € le kilo pour tout achat de 2 kilos. Pour une quantité différente, demander le prix à la caisse. Offre soumise aux stocks disponibles."
      },
      {
        "label": "Seller's explanation",
        "type": "chat",
        "french": "Aujourd’hui, un seul kilo coûte 3 €. Deux kilos bénéficient du tarif affiché de 2 € par kilo. Le paiement par carte est possible et un reçu détaillé peut être demandé."
      }
    ],
    "crossQuestions": [
      [
        "What condition is repeated by both sources?",
        "acheter deux kilos",
        [
          "acheter deux kilos",
          "payer seulement en espèces",
          "acheter aussi du pain"
        ],
        "Both descriptions limit the displayed two-euro rate to a two-kilogram purchase."
      ],
      [
        "What additional detail comes specifically from the seller?",
        "le paiement par carte",
        [
          "la date de samedi",
          "le paiement par carte",
          "la nécessité de deux kilos"
        ],
        "The seller adds that card payment and a detailed receipt are available."
      ]
    ],
    "listening": [
      [
        "What quantity does Léna want?",
        "un kilo de pommes",
        [
          "deux kilos de pommes",
          "un kilo de pommes",
          "trois pains"
        ],
        "Léna says she needs only one kilogram of apples."
      ],
      [
        "What document does she request?",
        "un reçu détaillé",
        [
          "une carte d’identité",
          "un reçu détaillé",
          "une nouvelle affiche"
        ],
        "She asks for a receipt to confirm actual purchase prices."
      ]
    ],
    "writing": [
      "Write a short message explaining the sign, the seller's clarification and what you bought.",
      [
        "Use partitive and quantity articles correctly.",
        "Attribute the conditional price to the market poster.",
        "Explain why one kilogram does not get the discount."
      ],
      "Au marché, j’ai vu une affiche proposant des pommes à deux euros le kilo. J’ai demandé au vendeur si ce prix s’appliquait à mon achat. Il m’a expliqué que la réduction concernait seulement les personnes qui achetaient deux kilos. Comme je voulais un seul kilo, j’ai payé trois euros pour mes pommes. J’ai aussi acheté du pain et demandé un reçu. À l’avenir, je regarderai les conditions de quantité avant de choisir une promotion."
    ],
    "oral": {
      "prompt": "Explain the market price difference orally to a friend who only saw the large sign.",
      "plan": [
        "State what the sign promises.",
        "Explain the two-kilogram condition and one-kilogram price.",
        "Give a practical question the friend should ask."
      ],
      "model": "L’affiche indique deux euros par kilo, mais seulement pour un achat de deux kilos. Si tu achètes un seul kilo, le vendeur demande trois euros. Léna a choisi un kilo parce qu’elle n’avait pas besoin de davantage de pommes. Elle a demandé un reçu détaillé. Avant de payer, je te conseillerais donc de demander quelle quantité est concernée par le prix affiché."
    },
    "tasks": [
      [
        "fill",
        "Je voudrais ___ pain et une pomme.",
        "du",
        "Du is the partitive article with masculine mass noun pain.",
        [],
        "partitive"
      ],
      [
        "choice",
        "What is the price of one kilo today?",
        "trois euros",
        "The seller explicitly contrasts one-kilogram and two-kilogram rates.",
        [
          "deux euros",
          "trois euros",
          "quatre euros"
        ],
        "prices"
      ],
      [
        "reading",
        "What condition is on the market sign?",
        "acheter deux kilos",
        "The posted lower price requires a purchase of two kilograms.",
        [
          "payer en espèces",
          "acheter deux kilos",
          "venir le dimanche"
        ],
        "sign interpretation"
      ],
      [
        "fill",
        "Je ne prends pas ___ lait.",
        "de",
        "The partitive becomes de under ordinary negation.",
        [],
        "negation"
      ],
      [
        "order",
        "Arrange: un kilo de pommes / Je voudrais",
        "Je voudrais un kilo de pommes",
        "The polite request introduces an exact quantity.",
        [
          "un kilo de pommes",
          "Je voudrais"
        ],
        "sentence production"
      ],
      [
        "choice",
        "What does the seller add beyond the sign?",
        "le paiement par carte",
        "The seller confirms payment methods, which the sign does not mention.",
        [
          "la date de samedi",
          "le paiement par carte",
          "les deux kilos"
        ],
        "cross-source detail"
      ],
      [
        "fill",
        "___ coûte un kilo de pommes ?",
        "Combien",
        "Combien asks the quantity or price in the normal direct question Combien coûte un kilo de pommes ?",
        [],
        "question word"
      ],
      [
        "reading",
        "Why does Léna request a receipt?",
        "vérifier les prix payés",
        "The receipt records purchase-specific prices and supports verification.",
        [
          "vérifier les prix payés",
          "avoir un nouveau panier",
          "réserver une table"
        ],
        "evidence"
      ],
      [
        "choice",
        "Which sentence is a suitable purchase request?",
        "Je voudrais du pain.",
        "It uses a polite form and appropriate partitive article.",
        [
          "Je voudrais de le pain.",
          "Je voudrais du pain.",
          "Je veut du pains."
        ],
        "grammar"
      ],
      [
        "fill",
        "J’ai gardé mon ___ après le paiement.",
        "reçu",
        "A receipt documents the amount paid for a specific transaction.",
        [],
        "lexicon"
      ]
    ]
  },
  {
    "id": "transfer-02",
    "title": "Family visit: invitations and changing plans",
    "level": "A1→A2",
    "goal": "Bridge A1 future plans with A2 information checking, invitations and choices.",
    "grammarKeys": [
      "future",
      "questions"
    ],
    "vocabulary": [
      [
        "une invitation",
        "invitation",
        "J’envoie une invitation."
      ],
      [
        "samedi",
        "Saturday",
        "Je viendrai samedi."
      ],
      [
        "rendre visite",
        "visit someone",
        "Nous allons rendre visite à Léa."
      ],
      [
        "un horaire",
        "schedule",
        "Je confirme l’horaire."
      ],
      [
        "un repas",
        "meal",
        "Nous préparons un repas."
      ],
      [
        "apporter",
        "bring",
        "Je vais apporter du jus."
      ],
      [
        "un gâteau",
        "cake",
        "Il apporte un gâteau."
      ],
      [
        "une adresse",
        "address",
        "Peux-tu confirmer l’adresse ?"
      ],
      [
        "un message",
        "message",
        "Le nouveau message est daté."
      ],
      [
        "reporter",
        "postpone",
        "Ils pourraient reporter le repas."
      ],
      [
        "venir",
        "come",
        "Je peux venir samedi."
      ],
      [
        "une réponse",
        "reply",
        "J’attends encore une réponse."
      ]
    ],
    "dialogue": [
      [
        "Emma",
        "Nous allons rendre visite à ma tante samedi; son premier message proposait midi, mais un nouveau message évoque plutôt treize heures.",
        "We are visiting my aunt Saturday; her first message said noon, but a new message suggests one."
      ],
      [
        "Noah",
        "Est-ce que le nouveau message confirme treize heures, ou est-ce seulement une possibilité qu’elle souhaite vérifier avec les autres ?",
        "Does the new message confirm one, or is it only an option she wants to check?"
      ],
      [
        "Emma",
        "Elle écrit que treize heures serait plus pratique, mais elle demande encore notre réponse avant de préparer le repas.",
        "She says one would suit her better but asks for our reply before preparing lunch."
      ],
      [
        "Noah",
        "Nous pourrions accepter treize heures et lui demander de confirmer l’adresse; je vais aussi proposer d’apporter un gâteau.",
        "We could accept one and ask her to confirm the address; I'll offer to bring a cake."
      ],
      [
        "Emma",
        "D’accord, j’enverrai notre réponse aujourd’hui, puis je vérifierai sa confirmation avant d’annoncer l’horaire à toute la famille.",
        "I'll reply today and check her confirmation before telling the whole family."
      ]
    ],
    "reading": {
      "title": "Deux messages et un repas de famille",
      "paragraphs": [
        "Emma souhaite organiser une visite chez sa tante et reçoit une invitation pour samedi à midi. Elle répond d'abord qu'elle aimerait venir avec Noah. Le lendemain, sa tante lui envoie un deuxième message : treize heures lui conviendrait mieux, mais elle souhaite encore connaître les disponibilités des invités. Emma comprend que cette nouvelle heure n'est pas une décision définitive. Elle préfère ne pas annoncer immédiatement le changement à ses cousins.",
        "Noah suggère de répondre qu'ils peuvent venir à treize heures et de demander l'adresse exacte, car la tante a récemment changé de logement. Il propose aussi d'apporter un gâteau. Emma prépare alors une réponse courte qui distingue leur préférence de la confirmation attendue. Elle écrit qu'ils sont disponibles à treize heures, qu'ils apporteront un dessert et qu'ils attendent l'accord de la tante.",
        "Plus tard, la tante confirme par écrit le nouvel horaire ainsi que l'adresse. Emma transmet les informations vérifiées à sa famille. Elle constate qu'une invitation peut évoluer sans que chaque proposition devienne automatiquement définitive. En vérifiant le dernier message, elle évite une arrivée à la mauvaise heure et peut préparer le trajet de manière réaliste."
      ],
      "questions": [
        [
          "What time was in the first invitation?",
          "midi",
          [
            "midi",
            "treize heures",
            "quinze heures"
          ],
          "The initial invitation explicitly proposed noon."
        ],
        [
          "When does thirteen o'clock become confirmed?",
          "après la réponse écrite de la tante",
          [
            "dès le premier message",
            "après la réponse écrite de la tante",
            "quand Noah propose un gâteau"
          ],
          "The second message expresses a preference; later written confirmation finalizes it."
        ],
        [
          "What useful detail needs checking besides time?",
          "l’adresse",
          [
            "la couleur du gâteau",
            "l’adresse",
            "le prix du bus"
          ],
          "The aunt has moved, so Emma and Noah verify the address."
        ]
      ]
    },
    "evidence": [
      {
        "label": "First invitation",
        "type": "email",
        "french": "Bonjour Emma, je serais heureuse de vous recevoir samedi à midi pour un déjeuner en famille. Je t’enverrai l’adresse complète pour faciliter votre trajet."
      },
      {
        "label": "Later proposal",
        "type": "chat",
        "french": "Finalement, treize heures serait plus pratique pour moi. Est-ce que cet horaire vous conviendrait ? Répondez avant que je prépare le repas, s’il vous plaît."
      }
    ],
    "crossQuestions": [
      [
        "Which text establishes a definite new meeting at thirteen hours?",
        "aucun des deux",
        [
          "le premier",
          "le deuxième",
          "aucun des deux"
        ],
        "The new hour remains a proposal in both messages."
      ],
      [
        "What change can be inferred from the two sources?",
        "une préférence pour treize heures",
        [
          "une annulation complète",
          "une préférence pour treize heures",
          "une autre date"
        ],
        "The later message clearly signals the host's preferred hour."
      ]
    ],
    "listening": [
      [
        "What did the aunt's first message propose?",
        "midi",
        [
          "midi",
          "treize heures",
          "seize heures"
        ],
        "The conversation cites noon in the original invitation."
      ],
      [
        "What will Noah bring?",
        "un gâteau",
        [
          "du pain",
          "un gâteau",
          "des fleurs"
        ],
        "Noah explicitly offers to bring a cake."
      ]
    ],
    "writing": [
      "Reply to the later invitation, clearly accepting a proposed time and requesting final confirmation.",
      [
        "Use futur proche or futur simple appropriately.",
        "Ask a direct question about the unconfirmed detail.",
        "Offer one concrete contribution without assuming the change is final."
      ],
      "Bonjour, merci pour ton invitation de samedi. Nous pouvons venir à treize heures si cet horaire te convient mieux. Nous allons préparer notre trajet et Noah apportera un gâteau. Pourrais-tu confirmer définitivement l’heure et nous envoyer l’adresse complète ? Nous préférons attendre ta réponse avant de prévenir le reste de la famille. À bientôt, Emma."
    ],
    "oral": {
      "prompt": "Briefly explain the invitation change and how you would respond.",
      "plan": [
        "Distinguish noon in the first invitation from the later preference.",
        "State your availability and what you will bring.",
        "Request a confirmed time and address."
      ],
      "model": "La tante a d’abord proposé samedi à midi, puis elle a expliqué que treize heures serait plus pratique. Cette deuxième heure n’était pas encore confirmée. Emma et Noah peuvent venir à treize heures et Noah propose d’apporter un gâteau. Ils vont répondre à la tante et lui demander de confirmer l’heure ainsi que l’adresse avant d’informer toute la famille."
    },
    "tasks": [
      [
        "fill",
        "Nous ___ visiter ma tante samedi. (aller, nous)",
        "allons",
        "Futur proche combines present allons and infinitive visiter.",
        [],
        "future proche"
      ],
      [
        "choice",
        "Which time is in the first invitation?",
        "midi",
        "The first message clearly states noon.",
        [
          "midi",
          "treize heures",
          "quatorze heures"
        ],
        "source detail"
      ],
      [
        "reading",
        "Does the second message confirm a changed time?",
        "non",
        "It asks the guests whether the later time suits them.",
        [
          "oui",
          "non",
          "le message annule la visite"
        ],
        "modalities"
      ],
      [
        "fill",
        "___ est-ce que nous allons venir ?",
        "Quand",
        "Quand asks when an activity will happen.",
        [],
        "questions"
      ],
      [
        "order",
        "Arrange: un gâteau / Noah apportera",
        "Noah apportera un gâteau",
        "The future simple reports Noah's stated contribution.",
        [
          "un gâteau",
          "Noah apportera"
        ],
        "syntax"
      ],
      [
        "choice",
        "What still needs confirmation?",
        "l’heure et l’adresse",
        "The reply should obtain the hour and full address.",
        [
          "la couleur du gâteau",
          "l’heure et l’adresse",
          "la langue du repas"
        ],
        "practical inference"
      ],
      [
        "fill",
        "Si la tante confirme, nous ___ samedi. (venir, future nous)",
        "viendrons",
        "Viendrons is the irregular future first-person plural of venir.",
        [],
        "future"
      ],
      [
        "reading",
        "Why did Emma not tell everyone immediately?",
        "la nouvelle heure était proposée",
        "The new time was conditional on guest responses.",
        [
          "elle avait perdu son téléphone",
          "la nouvelle heure était proposée",
          "elle ne voulait pas venir"
        ],
        "text comprehension"
      ],
      [
        "choice",
        "Which question is correct?",
        "Est-ce que treize heures te convient ?",
        "The est-ce que form retains normal subject and verb order.",
        [
          "Est-ce que te convient treize heures ?",
          "Est-ce que treize heures te convient ?",
          "Est-ce treize heure convient ?"
        ],
        "question form"
      ],
      [
        "fill",
        "La tante a envoyé une ___ écrite.",
        "confirmation",
        "Confirmation is the final response that makes the proposed time definite.",
        [],
        "vocab"
      ]
    ]
  },
  {
    "id": "transfer-03",
    "title": "Shopping exchange: receipt versus customer reply",
    "level": "A1→A2",
    "goal": "Apply quantities, polite requests and written proof to an everyday return inquiry.",
    "grammarKeys": [
      "articles",
      "polite"
    ],
    "vocabulary": [
      [
        "un achat",
        "purchase",
        "Je conserve la preuve d’achat."
      ],
      [
        "un reçu",
        "receipt",
        "Le reçu indique le prix."
      ],
      [
        "un article",
        "item",
        "Cet article est trop petit."
      ],
      [
        "la taille",
        "size",
        "La taille ne me convient pas."
      ],
      [
        "un échange",
        "exchange",
        "Je voudrais connaître les échanges possibles."
      ],
      [
        "une caisse",
        "checkout",
        "Je vais à la caisse."
      ],
      [
        "une réponse",
        "reply",
        "La réponse reste provisoire."
      ],
      [
        "une condition",
        "condition",
        "La condition est écrite."
      ],
      [
        "une demande",
        "request",
        "Je fais une demande précise."
      ],
      [
        "remplacer",
        "replace",
        "Peut-on remplacer l’article ?"
      ],
      [
        "un dossier",
        "file",
        "Le service examine le dossier."
      ],
      [
        "attendre",
        "wait",
        "Je vais attendre la réponse."
      ]
    ],
    "dialogue": [
      [
        "Camille",
        "J’ai acheté une veste hier et j’ai gardé le reçu, mais la taille ne me convient pas; je voudrais savoir si un échange est possible.",
        "I bought a jacket yesterday and kept the receipt, but the size doesn't fit; can I exchange it?"
      ],
      [
        "Vendeur",
        "Nous pouvons examiner votre demande si vous présentez le reçu, cependant je dois vérifier les conditions applicables à cet article.",
        "We can review your request with the receipt, but I must check terms for this item."
      ],
      [
        "Camille",
        "Voici le reçu avec la date et le prix; pourriez-vous me préciser si une autre taille est disponible aujourd’hui ?",
        "Here's the receipt with date and price. Could you clarify whether another size is available today?"
      ],
      [
        "Vendeur",
        "La taille recherchée n’est pas dans le magasin pour le moment; nous pouvons demander un contrôle du stock, sans garantir un échange.",
        "That size isn't in store now; we can check stock without guaranteeing an exchange."
      ],
      [
        "Camille",
        "Merci, je vais garder le reçu et attendre votre réponse sur les possibilités plutôt que de dire que l’échange est déjà accepté.",
        "Thanks. I'll keep the receipt and await your answer, rather than say the exchange is approved."
      ]
    ],
    "reading": {
      "title": "Un reçu ne suffit pas à décider",
      "paragraphs": [
        "Camille achète une veste dans une boutique du centre-ville. Chez elle, elle constate que la taille ne lui convient pas. Le lendemain, elle revient au magasin avec le reçu et la veste. Elle souhaite demander s'il serait possible d'obtenir une taille différente. Elle a lu quelques informations sur les échanges, mais ne connaît pas les conditions qui s'appliquent exactement à son achat. Elle préfère donc poser une question plutôt que de supposer connaître ses droits.",
        "Le vendeur examine la date et la référence indiquées sur le reçu. Il explique que les demandes peuvent être étudiées, mais que certaines conditions dépendent de l'article et de la disponibilité du stock. La taille voulue n'est pas actuellement présente dans le magasin. Le vendeur propose de vérifier si elle existe dans un autre point de vente, sans promettre que cette vérification aboutira à un échange.",
        "Camille remercie le vendeur et demande quand elle pourra recevoir une réponse. Elle conserve son reçu et note la référence de sa demande. Dans son résumé à une amie, elle distingue trois faits : elle a acheté la veste, la taille ne convient pas et le magasin doit encore examiner une possibilité. Elle ne transforme pas une offre d'information en confirmation d'un échange réalisé."
      ],
      "questions": [
        [
          "Why does Camille bring the receipt?",
          "il prouve les détails de l’achat",
          [
            "il prouve les détails de l’achat",
            "il garantit un échange",
            "il donne une réduction"
          ],
          "The receipt records purchase information but does not establish an exchange decision."
        ],
        [
          "Is the desired size available in that store?",
          "non",
          [
            "oui",
            "non",
            "elle est déjà réservée"
          ],
          "The seller says the desired size is not currently in the store."
        ],
        [
          "What is the status at the end?",
          "une vérification du stock reste à faire",
          [
            "l’échange est terminé",
            "une vérification du stock reste à faire",
            "la boutique rembourse automatiquement"
          ],
          "The seller offered a stock check, not a confirmed replacement."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Purchase receipt",
        "type": "data",
        "french": "Achat : veste taille M, payé 42 €, date du 12 octobre. Numéro de vente 5084. Ce reçu indique l’article acheté et le montant réglé."
      },
      {
        "label": "Customer service reply",
        "type": "email",
        "french": "Votre demande d’échange peut être examinée après contrôle des conditions et du stock. Nous ne pouvons pas confirmer immédiatement la disponibilité de la taille souhaitée."
      }
    ],
    "crossQuestions": [
      [
        "Which document proves the purchased size?",
        "le reçu",
        [
          "le reçu",
          "la réponse du service",
          "aucun document"
        ],
        "The receipt names size M on the original purchase."
      ],
      [
        "What does the service reply NOT confirm?",
        "la disponibilité d’une autre taille",
        [
          "la disponibilité d’une autre taille",
          "le paiement initial",
          "le numéro de vente"
        ],
        "The reply explicitly says availability is not yet confirmed."
      ]
    ],
    "listening": [
      [
        "What problem does Camille describe?",
        "la taille ne convient pas",
        [
          "la taille ne convient pas",
          "la couleur a changé",
          "l’article est perdu"
        ],
        "Camille says the purchased jacket does not fit."
      ],
      [
        "What does the seller promise to check?",
        "le stock",
        [
          "le stock",
          "le trajet du bus",
          "les heures de cinéma"
        ],
        "The seller offers a stock check, not a guaranteed exchange."
      ]
    ],
    "writing": [
      "Compose a polite follow-up about an exchange inquiry, retaining uncertainty about stock.",
      [
        "Identify the product and receipt, without unnecessary private information.",
        "Use a polite conditional request.",
        "Differentiate the proposed stock check from an approved exchange."
      ],
      "Bonjour, je vous écris au sujet d’une veste achetée hier, dont je possède le reçu. La taille M ne me convient pas et j’aimerais connaître les possibilités d’échange. Lors de ma visite, un vendeur m’a expliqué que la taille souhaitée n’était pas disponible immédiatement et qu’un contrôle du stock était nécessaire. Pourriez-vous me préciser si cette vérification a été effectuée et quelles options sont possibles ? Je comprends qu’aucun échange n’est encore confirmé. Merci pour votre réponse."
    ],
    "oral": {
      "prompt": "Explain the purchase and return inquiry to a friend, avoiding unsupported assumptions.",
      "plan": [
        "Describe the observed size problem.",
        "Identify exactly what the receipt shows.",
        "Report the stock check as pending, not as acceptance."
      ],
      "model": "Camille a acheté une veste, mais elle a découvert que la taille ne lui convenait pas. Elle a gardé son reçu, qui indique le produit et le prix payé. Le vendeur a proposé d’examiner sa demande et de vérifier une autre taille, mais cette taille n’est pas actuellement dans le magasin. Aucun échange n’a donc été confirmé. Camille attend une réponse après vérification."
    },
    "tasks": [
      [
        "fill",
        "Je voudrais demander ___ échange.",
        "un",
        "Échange is a masculine countable noun, introduced by un.",
        [],
        "articles"
      ],
      [
        "choice",
        "Which document shows the original paid amount?",
        "le reçu",
        "The receipt lists the product, date and amount.",
        [
          "une réponse orale",
          "le reçu",
          "une vitrine"
        ],
        "documents"
      ],
      [
        "reading",
        "What does the service say is still unknown?",
        "la disponibilité",
        "Availability requires a stock check before a decision.",
        [
          "le prix d’achat",
          "la disponibilité",
          "la date du reçu"
        ],
        "cross-source"
      ],
      [
        "fill",
        "Pourriez-vous ___ le stock ?",
        "vérifier",
        "The verb after pourriez-vous stays infinitive.",
        [],
        "politeness"
      ],
      [
        "order",
        "Arrange: reste à confirmer / La taille demandée",
        "La taille demandée reste à confirmer",
        "A requested size is not automatically a stock-confirmed item.",
        [
          "reste à confirmer",
          "La taille demandée"
        ],
        "word order"
      ],
      [
        "choice",
        "Which sentence is appropriately cautious?",
        "Un échange pourrait être possible.",
        "Conditional phrasing matches the pending examination.",
        [
          "L’échange est terminé.",
          "Un échange pourrait être possible.",
          "Le vendeur a accepté définitivement."
        ],
        "certainty"
      ],
      [
        "fill",
        "J’ai gardé le ___ de mon achat.",
        "reçu",
        "Reçu is the documentary record of the purchase.",
        [],
        "lexicon"
      ],
      [
        "reading",
        "Why does Camille avoid promising an exchange?",
        "le magasin n’a pas confirmé la solution",
        "The vendor offered to check conditions and stock, not approve an outcome.",
        [
          "le magasin n’a pas confirmé la solution",
          "elle refuse de revenir",
          "la veste est gratuite"
        ],
        "reasoning"
      ],
      [
        "choice",
        "Which question follows the correct polite pattern?",
        "Pourriez-vous préciser la condition ?",
        "The conditional modal is followed by the infinitive préciser.",
        [
          "Pourriez-vous précisez la condition ?",
          "Pourriez-vous préciser la condition ?",
          "Vous pourriez précisez la condition ?"
        ],
        "syntax"
      ],
      [
        "fill",
        "La réponse reste ___ en attente. (choose word: encore)",
        "encore",
        "Encore makes clear that a response is still outstanding.",
        [],
        "time nuance"
      ]
    ]
  },
  {
    "id": "transfer-04",
    "title": "Travel connection: timetable and observed delay",
    "level": "A1→A2",
    "goal": "Interpret timetable entries, past transport events and conditional next departures.",
    "grammarKeys": [
      "future",
      "past"
    ],
    "vocabulary": [
      [
        "un train",
        "train",
        "Le train part à huit heures."
      ],
      [
        "un bus",
        "bus",
        "Le bus arrive plus tard."
      ],
      [
        "une correspondance",
        "connection",
        "J’ai manqué la correspondance."
      ],
      [
        "un retard",
        "delay",
        "Le retard est annoncé."
      ],
      [
        "le quai",
        "platform",
        "Je suis sur le quai."
      ],
      [
        "un horaire",
        "timetable",
        "L’horaire est provisoire."
      ],
      [
        "un départ",
        "departure",
        "Le départ reste prévu à neuf heures."
      ],
      [
        "une arrivée",
        "arrival",
        "L’arrivée n’est pas confirmée."
      ],
      [
        "un billet",
        "ticket",
        "Je garde mon billet."
      ],
      [
        "une annonce",
        "announcement",
        "L’annonce change le trajet."
      ],
      [
        "changer",
        "change",
        "Je vais changer de bus."
      ],
      [
        "une option",
        "option",
        "Je compare les options disponibles."
      ]
    ],
    "dialogue": [
      [
        "Noé",
        "Le panneau indique un train à huit heures dix, mais une annonce vient de signaler vingt minutes de retard pour notre ligne.",
        "The board lists a train at 8:10, but an announcement just reported a twenty-minute delay."
      ],
      [
        "Lina",
        "Est-ce que ce retard change notre correspondance de huit heures quarante, ou le deuxième train attendra-t-il notre arrivée ?",
        "Does that affect our 8:40 connection, or will the second train wait?"
      ],
      [
        "Noé",
        "Je ne sais pas, et l’affichage ne mentionne aucun changement pour le deuxième train; nous devons donc vérifier.",
        "I don't know, and the board shows no change for the second train; we need to check."
      ],
      [
        "Lina",
        "Nous avons déjà acheté les billets et nous attendions sur le quai quand l’annonce est arrivée; je vais demander une solution à l’agent.",
        "We've bought tickets and were waiting when the announcement came; I'll ask staff for an option."
      ],
      [
        "Noé",
        "D’accord, nous informerons nos amis dès que notre nouveau trajet sera confirmé, sans inventer une heure d’arrivée.",
        "We'll inform friends when the new route is confirmed without inventing an arrival time."
      ]
    ],
    "reading": {
      "title": "Le tableau ne confirme pas la correspondance",
      "paragraphs": [
        "Noé et Lina se rendent en train dans une ville voisine. Leurs billets indiquent un premier départ à huit heures dix et une correspondance à huit heures quarante. Ils arrivent à la gare à l'avance et consultent le panneau. Tout semble normal au début, puis une annonce sonore informe les passagers d'un retard estimé à vingt minutes pour le premier train. Noé remarque que le tableau du deuxième train n'a pas encore été modifié.",
        "Lina pense que leur correspondance pourrait être compromise. Elle ne sait pas si le deuxième train attendra les voyageurs retardés. Un employé leur explique qu'aucune décision n'a été communiquée concernant ce train et leur conseille de consulter les mises à jour. Ils gardent leurs billets et demandent s'il existe un autre trajet. L'employé propose de vérifier, sans promettre qu'une place sera disponible.",
        "Les voyageurs écrivent alors un message à leurs amis pour expliquer la situation. Ils indiquent l'horaire initial et le retard annoncé, mais ne donnent aucune nouvelle heure d'arrivée comme si elle était certaine. Ils prévoient d'envoyer une mise à jour lorsqu'ils auront obtenu une confirmation. Leur communication montre comment associer le passé de l'annonce, l'incertitude présente et une action future raisonnable."
      ],
      "questions": [
        [
          "What delay is reported for the first train?",
          "vingt minutes",
          [
            "dix minutes",
            "vingt minutes",
            "quarante minutes"
          ],
          "The announcement says the first train may be twenty minutes late."
        ],
        [
          "Is the second train known to wait?",
          "non",
          [
            "oui",
            "non",
            "il est annulé"
          ],
          "No decision has been announced about the second service."
        ],
        [
          "Why do the friends receive no precise arrival time?",
          "le trajet de remplacement est incertain",
          [
            "le trajet de remplacement est incertain",
            "les billets sont perdus",
            "la gare est fermée"
          ],
          "The travelers do not yet know how the connection will be handled."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Original timetable",
        "type": "data",
        "french": "Billets : train 1 départ 08:10, arrivée 08:30; correspondance train 2 départ 08:40. Ces horaires proviennent de la réservation initiale."
      },
      {
        "label": "Station announcement",
        "type": "notice",
        "french": "Retard estimé de 20 minutes pour le train 1. Aucune information nouvelle sur le départ du train 2 à ce stade. Consultez les mises à jour officielles."
      }
    ],
    "crossQuestions": [
      [
        "Which source establishes the scheduled connection?",
        "le billet initial",
        [
          "le billet initial",
          "l’annonce de retard",
          "aucun des deux"
        ],
        "The ticket lists the planned 08:40 connection."
      ],
      [
        "Can the arrival time be calculated as guaranteed?",
        "non",
        [
          "oui, exactement",
          "non",
          "seulement par le prix"
        ],
        "The announcement does not establish whether the connecting train will wait or another service will be needed."
      ]
    ],
    "listening": [
      [
        "How much delay does the announcement report?",
        "vingt minutes",
        [
          "dix minutes",
          "vingt minutes",
          "trente minutes"
        ],
        "Noé reports twenty minutes for the first train."
      ],
      [
        "What will Lina ask a staff member?",
        "une solution alternative",
        [
          "une solution alternative",
          "une réduction pour un musée",
          "un nouveau téléphone"
        ],
        "She intends to ask the agent about an alternative route."
      ]
    ],
    "writing": [
      "Write a transport delay update identifying scheduled departures, new information and an unconfirmed connection.",
      [
        "Use past tense for the announcement and future for the next update.",
        "Attribute the timetable and station announcement separately.",
        "Do not promise a precise arrival time without verification."
      ],
      "Bonjour, nous sommes à la gare pour notre trajet prévu ce matin. Notre billet indiquait un départ à huit heures dix et une correspondance à huit heures quarante. Pendant que nous attendions, une annonce a signalé un retard estimé à vingt minutes pour le premier train. Nous ne savons pas encore si la correspondance sera maintenue. Un agent doit vérifier les possibilités. Dès que nous aurons une réponse, nous vous informerons de notre nouveau trajet. Pour l’instant, notre heure d’arrivée reste incertaine."
    ],
    "oral": {
      "prompt": "Explain the transport problem in roughly one minute, clearly distinguishing the old schedule and new notice.",
      "plan": [
        "Read the planned first and second departure from the ticket.",
        "Describe the reported delay and unknown connection.",
        "State who should confirm the next route."
      ],
      "model": "Le billet indiquait un premier train à huit heures dix et une correspondance à huit heures quarante. À la gare, une annonce a signalé vingt minutes de retard pour le premier train. Nous ne savons pas si le deuxième train attendra. Nous avons demandé à un agent de vérifier les possibilités et nous attendons une réponse. Je ne peux pas annoncer une heure d’arrivée exacte tant que le nouveau trajet n’est pas confirmé."
    },
    "tasks": [
      [
        "fill",
        "Nous ___ déjà sur le quai. (attendre, imperfect nous)",
        "attendions",
        "Imparfait describes the ongoing wait before the announcement.",
        [],
        "imperfect"
      ],
      [
        "choice",
        "What does the ticket specify for train 2?",
        "08:40",
        "The original reservation shows a second departure at 08:40.",
        [
          "08:10",
          "08:40",
          "09:40"
        ],
        "timetable"
      ],
      [
        "reading",
        "What is unknown after the delay notice?",
        "si le deuxième train attendra",
        "No source confirms the connecting train will wait.",
        [
          "le prix des billets",
          "si le deuxième train attendra",
          "la destination du train"
        ],
        "inference"
      ],
      [
        "fill",
        "Nous avons ___ les billets. (acheter)",
        "acheté",
        "Passé composé uses the past participle acheté.",
        [],
        "completed past"
      ],
      [
        "order",
        "Arrange: une confirmation / Nous attendons",
        "Nous attendons une confirmation",
        "The sentence keeps the uncertain connection status explicit.",
        [
          "une confirmation",
          "Nous attendons"
        ],
        "word order"
      ],
      [
        "choice",
        "What should the travelers avoid saying?",
        "une heure d’arrivée garantie",
        "The connection remains unknown, so a guaranteed arrival time is unsupported.",
        [
          "leur départ initial",
          "une heure d’arrivée garantie",
          "le retard annoncé"
        ],
        "calibration"
      ],
      [
        "fill",
        "Le premier train ___ arriver plus tard. (aller, present il)",
        "va",
        "Futur proche combines va with the infinitive arriver.",
        [],
        "near future"
      ],
      [
        "reading",
        "Why do they contact an agent?",
        "pour vérifier des options",
        "They need verified options for a potentially missed connection.",
        [
          "pour acheter un journal",
          "pour vérifier des options",
          "pour retrouver un gâteau"
        ],
        "purpose"
      ],
      [
        "choice",
        "Which event happened while they waited?",
        "une annonce de retard",
        "The announcement interrupted their time on the platform.",
        [
          "l’arrivée au restaurant",
          "une annonce de retard",
          "la fin du voyage"
        ],
        "chronology"
      ],
      [
        "fill",
        "Je vais vérifier l’horaire de la ___.",
        "correspondance",
        "Correspondance names the connection between two services.",
        [],
        "lexicon"
      ]
    ]
  },
  {
    "id": "transfer-05",
    "title": "Housing choice: two listings and tenant questions",
    "level": "A2→B1",
    "goal": "Compare housing listings and personal constraints without treating estimates as verified costs.",
    "grammarKeys": [
      "compare",
      "relative"
    ],
    "vocabulary": [
      [
        "un loyer",
        "rent",
        "Le loyer est indiqué par mois."
      ],
      [
        "les charges",
        "additional fees",
        "Les charges restent à vérifier."
      ],
      [
        "un trajet",
        "commute",
        "Le trajet est assez court."
      ],
      [
        "un studio",
        "studio flat",
        "Le studio est près du bus."
      ],
      [
        "une annonce",
        "listing",
        "Je lis deux annonces."
      ],
      [
        "lumineux",
        "bright",
        "La pièce est lumineuse."
      ],
      [
        "une distance",
        "distance",
        "La distance change mon choix."
      ],
      [
        "une caution",
        "deposit",
        "Je demande la caution prévue."
      ],
      [
        "le quartier",
        "neighborhood",
        "Le quartier est calme selon l’annonce."
      ],
      [
        "un budget",
        "budget",
        "Je vérifie mon budget total."
      ],
      [
        "un balcon",
        "balcony",
        "Le studio possède un balcon."
      ],
      [
        "une visite",
        "viewing",
        "Je demande une visite du logement."
      ]
    ],
    "dialogue": [
      [
        "Amina",
        "J’ai trouvé deux annonces de studios; le premier est moins cher, mais il se trouve plus loin de l’université où j’étudie.",
        "I found two studio listings; the first is cheaper but farther from university."
      ],
      [
        "Paul",
        "Le deuxième coûte davantage chaque mois, pourtant son trajet est plus court et il semble avoir plus de lumière naturelle.",
        "The second costs more but is a shorter commute and seems brighter."
      ],
      [
        "Amina",
        "L’annonce du deuxième logement ne précise pas les charges, et je ne veux pas supposer que son prix total sera abordable.",
        "The second listing omits fees, so I won't assume its total cost is affordable."
      ],
      [
        "Paul",
        "Tu pourrais demander les charges exactes et visiter les deux studios avant de choisir; les photos ne donnent pas toutes les informations.",
        "Ask about exact charges and view both flats; photos do not give everything."
      ],
      [
        "Amina",
        "Si les frais restent dans mon budget, je préférerai peut-être le deuxième, mais je vais d’abord obtenir une réponse écrite.",
        "If costs fit my budget I may prefer the second, but I'll get a written reply first."
      ]
    ],
    "reading": {
      "title": "Deux studios, quatre critères",
      "paragraphs": [
        "Amina cherche un studio pour son prochain semestre. Elle trouve une première annonce proposant un petit logement à un prix relativement bas. Le studio se situe cependant assez loin de l'université. Une autre annonce présente un appartement un peu plus cher mais proche d'un arrêt de transport. Les photographies du deuxième logement donnent une impression de luminosité. Amina souhaite néanmoins vérifier ces impressions pendant une visite.",
        "Elle compare les prix affichés avec son budget. Le premier studio indique des charges mensuelles, tandis que le deuxième ne mentionne pas clairement ce montant. Amina remarque donc qu'elle ne peut pas comparer directement les coûts totaux. Paul lui conseille d'envoyer deux questions précises aux propriétaires : quel montant comprend le loyer et quels frais restent à payer séparément ? Il lui rappelle aussi que la durée d'un trajet dépend du service réellement disponible.",
        "Amina décide de ne pas choisir sur la seule base du prix affiché ou des photos. Elle demande une visite et une réponse écrite concernant les charges. Si le deuxième studio reste dans son budget total, il pourrait convenir davantage à sa routine universitaire. Pourtant, une autre personne travaillant à domicile pourrait préférer le logement moins cher. Son choix dépend de critères personnels, pas d'un classement universel des appartements."
      ],
      "questions": [
        [
          "Which listing omits clear fee information?",
          "le deuxième",
          [
            "le premier",
            "le deuxième",
            "les deux"
          ],
          "The passage says the second studio does not clearly show additional charges."
        ],
        [
          "Why is a direct total-cost comparison premature?",
          "les charges sont incomplètes",
          [
            "les appartements sont identiques",
            "les charges sont incomplètes",
            "le premier est fermé"
          ],
          "The unknown fees prevent an exact comparison."
        ],
        [
          "What might change the preferred apartment?",
          "le budget total et le trajet",
          [
            "seulement les photos",
            "le budget total et le trajet",
            "la couleur de l’annonce"
          ],
          "Amina's decision balances total cost and campus travel."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Listing A",
        "type": "poster",
        "french": "Studio A : loyer mensuel 520 €, charges prévues 70 €, à 40 minutes de l’université en transport. Une visite peut être demandée."
      },
      {
        "label": "Listing B",
        "type": "poster",
        "french": "Studio B : loyer mensuel 585 €, à environ 15 minutes de l’université selon l’annonce. Le montant des charges n’est pas indiqué."
      }
    ],
    "crossQuestions": [
      [
        "Which listing states the total of listed rent and charges?",
        "le studio A",
        [
          "le studio A",
          "le studio B",
          "aucun"
        ],
        "A lists 520 and 70 euros; B does not provide charges."
      ],
      [
        "Which apparent advantage of B is qualified?",
        "le trajet plus court",
        [
          "le loyer plus bas",
          "le trajet plus court",
          "les charges connues"
        ],
        "B reports a shorter estimated commute, but exact commute and fees still need checking."
      ]
    ],
    "listening": [
      [
        "What is Amina's main uncertainty about studio B?",
        "les charges",
        [
          "les charges",
          "la présence d’un plafond",
          "le nom du quartier"
        ],
        "She says B's listing omits fees."
      ],
      [
        "What does Paul suggest before choosing?",
        "visiter et demander les frais",
        [
          "visiter et demander les frais",
          "choisir à partir des photos",
          "ignorer le budget"
        ],
        "He suggests viewing both flats and getting exact extra costs."
      ]
    ],
    "writing": [
      "Compare two original listing sources and recommend a viewing order based on a student budget.",
      [
        "Use two accurate comparison structures.",
        "Identify the missing charges for studio B.",
        "State a conditional recommendation and a specific verification question."
      ],
      "J’ai comparé deux annonces de studios pour une étudiante. Le studio A est moins cher et les charges mensuelles sont indiquées, mais son trajet vers l’université serait plus long. Le studio B coûte davantage et se trouve apparemment plus près du campus. En revanche, son annonce ne précise pas les charges supplémentaires. Il serait donc impossible de connaître immédiatement le coût total du logement B. Je demanderais d’abord ces frais et les conditions de location, puis je visiterais les deux studios. Si le budget le permet, le deuxième pourrait mieux convenir à une personne qui se rend chaque jour à l’université."
    ],
    "oral": {
      "prompt": "Recommend a first viewing to Amina using at least two comparative structures and a cost caveat.",
      "plan": [
        "Contrast listed prices and estimated transport times.",
        "Explain the unknown fees for B.",
        "Recommend what to verify before choosing."
      ],
      "model": "Le studio A est moins cher que le studio B, mais il est plus loin de l’université. Le deuxième paraît plus pratique pour le trajet, toutefois son annonce ne donne pas le montant des charges. Je recommanderais à Amina de vérifier d’abord les frais et de visiter les deux appartements. Si le coût total du deuxième reste dans son budget, celui-ci pourrait mieux convenir à son emploi du temps. Le choix ne serait pas forcément le même pour une personne qui travaille à domicile."
    },
    "tasks": [
      [
        "fill",
        "Le studio A est moins cher ___ le studio B.",
        "que",
        "The comparative construction moins ... que compares two prices.",
        [],
        "comparison"
      ],
      [
        "choice",
        "Which listing leaves charges unspecified?",
        "B",
        "Listing B does not state additional charges.",
        [
          "A",
          "B",
          "les deux"
        ],
        "source evidence"
      ],
      [
        "reading",
        "What is Amina's priority besides cost?",
        "le trajet universitaire",
        "She mentions her university commute as a major criterion.",
        [
          "le balcon uniquement",
          "le trajet universitaire",
          "les meubles anciens"
        ],
        "motivation"
      ],
      [
        "fill",
        "C’est le quartier ___ je parle.",
        "dont",
        "Parler de takes the relative dont.",
        [],
        "relative de"
      ],
      [
        "order",
        "Arrange: reste à vérifier / Le coût total",
        "Le coût total reste à vérifier",
        "The total cannot be calculated for listing B from disclosed values.",
        [
          "reste à vérifier",
          "Le coût total"
        ],
        "word order"
      ],
      [
        "choice",
        "Which studio reports a shorter estimated commute?",
        "B",
        "Listing B reports approximately fifteen minutes rather than forty.",
        [
          "A",
          "B",
          "aucun"
        ],
        "data comparison"
      ],
      [
        "fill",
        "Il faut demander le montant des ___.",
        "charges",
        "Charges are fees beyond the main rent amount.",
        [],
        "housing"
      ],
      [
        "reading",
        "Why will Amina view both apartments?",
        "les photos ne suffisent pas",
        "The dialogue distinguishes impressions from verified conditions.",
        [
          "les photos ne suffisent pas",
          "elle cherche un hôtel",
          "elle connaît les propriétaires"
        ],
        "verification"
      ],
      [
        "choice",
        "Which recommendation is justified?",
        "Choisir sous réserve de vérifier le budget.",
        "A recommendation conditional on actual fees fits incomplete listing evidence.",
        [
          "Le deuxième est toujours meilleur.",
          "Choisir sous réserve de vérifier le budget.",
          "Acheter sans visiter."
        ],
        "decision"
      ],
      [
        "fill",
        "Je souhaite faire une ___ avant de signer.",
        "visite",
        "A visit is an on-site viewing before committing to housing.",
        [],
        "vocabulary"
      ]
    ]
  }
];
export const TRANSFER_01_05=Object.freeze(CONTENT.map((spec,i)=>authorTransferScenario(spec,i+1)));
