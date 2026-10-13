export type TransferGrammarBlock=readonly [string,string,readonly (readonly [string,string])[],readonly [string,string,string]];
/** Independently authored cumulative A1–B1 grammar bridges for transfer scenarios. */
export const TRANSFER_GRAMMAR:Readonly<Record<string,TransferGrammarBlock>>={
  "articles": [
    "A1 transfer — articles and partitives",
    "In French, un and une introduce one countable item, while du, de la and de l’ express an unspecified amount. In a negative statement, ordinary indefinite and partitive objects often become de or d’: je prends du pain, but je ne prends pas de pain. Context matters: le pain refers to known bread, not just an amount. Compare the intended quantity and polarity rather than copying English word by word.",
    [
      [
        "Je voudrais du pain et une pomme.",
        "I would like some bread and an apple."
      ],
      [
        "Je ne veux pas de lait aujourd’hui.",
        "I do not want any milk today."
      ]
    ],
    [
      "Je ne prends pas du sucre.",
      "Je ne prends pas de sucre.",
      "Under ordinary negation of quantity, de replaces the partitive article."
    ]
  ],
  "questions": [
    "A1 transfer — asking and negating",
    "For a direct question, est-ce que allows a familiar subject–verb order: est-ce que la salle est libre ? A question word can precede it: quand est-ce que le bus arrive ? Negation normally surrounds the conjugated verb: je ne connais pas l’horaire. When an answer is not known, ask a precise question instead of suggesting that an uncertain detail is fact.",
    [
      [
        "Est-ce que le bus arrive à neuf heures ?",
        "Does the bus arrive at nine?"
      ],
      [
        "Je ne connais pas encore la date.",
        "I do not yet know the date."
      ]
    ],
    [
      "Je pas connais l’heure.",
      "Je ne connais pas l’heure.",
      "In standard written French, ne ... pas surrounds the conjugated verb."
    ]
  ],
  "future": [
    "A1 transfer — future plans and conditions",
    "Futur proche combines aller in the present with an infinitive: nous allons visiter le musée. Futur simple can express a later decision or promise: je vous répondrai demain. Do not turn a proposed plan into a verified event; nous pourrions venir is merely a possibility. For a real future condition use si plus present before the future main clause: si la salle est libre, nous viendrons.",
    [
      [
        "Nous allons visiter le musée demain.",
        "We are going to visit the museum tomorrow."
      ],
      [
        "Si le centre confirme, nous viendrons.",
        "If the center confirms, we will come."
      ]
    ],
    [
      "Si le centre confirmera, nous viendrons.",
      "Si le centre confirme, nous viendrons.",
      "A real future si clause takes present, not future."
    ]
  ],
  "past": [
    "A2 transfer — background and completed action",
    "Imparfait supplies a scene or an ongoing habit, whereas passé composé advances a bounded past event. Nous attendions quand le bus est arrivé sets an extended wait and then a new arrival. The choice is about the role of an event in the story, not simply whether the event happened a long time ago. When summarizing a notice, distinguish a previous expectation from an actual cancellation.",
    [
      [
        "Il pleuvait lorsque nous sommes sortis.",
        "It was raining when we went outside."
      ],
      [
        "Nous avons raté le train parce qu’il est parti tôt.",
        "We missed the train because it left early."
      ]
    ],
    [
      "Nous attendions et tout à coup le bus arrivait.",
      "Nous attendions et tout à coup le bus est arrivé.",
      "A new bounded arrival is foregrounded with passé composé."
    ]
  ],
  "pluperfect": [
    "B1 transfer — earlier preparations",
    "Plus-que-parfait uses imparfait of avoir or être plus a past participle: j’avais réservé, elle était partie. It locates one event before another event in the past. An earlier warning that a schedule might change does not itself mean cancellation had already been confirmed. In an evidence-based narrative, state what was known at each time and separate the earlier preparation from the later result.",
    [
      [
        "Nous avions réservé avant l’annonce.",
        "We had booked before the notice."
      ],
      [
        "Elle était déjà arrivée quand je suis parti.",
        "She had already arrived when I left."
      ]
    ],
    [
      "Elle avait arrivé quand je suis parti.",
      "Elle était arrivée quand je suis parti.",
      "Arriver forms compound tenses with être."
    ]
  ],
  "pronouns": [
    "A2 transfer — direct and indirect object references",
    "Le, la and les typically replace direct objects, while lui and leur often replace indirect objects introduced by à for people. Je vois Marie becomes je la vois; je téléphone à Marie becomes je lui téléphone. In common present affirmative clauses object pronouns precede the conjugated verb. Use unambiguous names when several possible referents would make a message unclear.",
    [
      [
        "Je téléphone à Paul : je lui téléphone.",
        "I call Paul: I call him."
      ],
      [
        "Je connais la date : je la connais.",
        "I know the date: I know it."
      ]
    ],
    [
      "Je téléphone Paul, alors je le téléphone.",
      "Je téléphone à Paul, alors je lui téléphone.",
      "Téléphoner à takes an indirect object pronoun."
    ]
  ],
  "compare": [
    "A2 transfer — comparisons for choices",
    "Plus ... que, moins ... que and aussi ... que compare qualities: ce trajet est moins long que l’autre. Autant de plus a noun compares quantities, while meilleur is an adjective and mieux describes doing something. A sound recommendation names the relevant criterion and person; cheaper and faster can lead to different choices. Do not infer unknown costs from a single attractive picture.",
    [
      [
        "Le train est plus rapide que le bus.",
        "The train is faster than the bus."
      ],
      [
        "Cette salle offre autant de places que l’autre.",
        "This room has as many seats as the other."
      ]
    ],
    [
      "Cet appartement est plus meilleur.",
      "Cet appartement est meilleur pour mon trajet.",
      "Meilleur is already comparative; do not add plus in this sense."
    ]
  ],
  "polite": [
    "A2 transfer — conditional politeness",
    "Je voudrais and pourriez-vous express polite requests. After a modal such as pourriez-vous or souhaiterais, the lexical verb normally stays infinitive: pourriez-vous vérifier ? A conditional request is not an assertion of entitlement, and a reply promising to examine a request does not mean it has been accepted. Restating the pending action is often as important as the courtesy.",
    [
      [
        "Pourriez-vous préciser la date ?",
        "Could you clarify the date?"
      ],
      [
        "Je souhaiterais connaître les options disponibles.",
        "I would like to know the available options."
      ]
    ],
    [
      "Pourriez-vous vérifiez mon dossier ?",
      "Pourriez-vous vérifier mon dossier ?",
      "After pourriez-vous the next verb is an infinitive, not the vous form."
    ]
  ],
  "relative": [
    "B1 transfer — connect relative references",
    "Qui introduces a subject relative, que a direct-object relative, and dont commonly a complement introduced by de: le dossier dont je parle. Ce qui and ce que refer to unspecified ideas as subject and object respectively. If two earlier nouns could match a pronoun, repeat the relevant noun for clarity instead of leaving the reader guessing. Better connection increases precision, not just sentence length.",
    [
      [
        "C’est le document dont je parle.",
        "That is the document I am talking about."
      ],
      [
        "Ce qui reste incertain, c’est l’heure.",
        "What remains uncertain is the time."
      ]
    ],
    [
      "La date dont je regarde est ancienne.",
      "La date que je regarde est ancienne.",
      "Regarder takes a direct object, so use que, not dont."
    ]
  ],
  "condition": [
    "B1 transfer — realistic versus hypothetical conditions",
    "Si plus present with a future main clause describes a realistic future: si nous recevons le courriel, nous répondrons. Si plus imparfait with conditional gives a hypothetical situation: si j’avais une voiture, je pourrais partir plus tôt. Do not put futur simple or conditional immediately after si in these patterns. A hypothetical route cannot be reported as a confirmed transportation plan.",
    [
      [
        "Si la salle est libre, nous viendrons.",
        "If the room is free, we will come."
      ],
      [
        "Si j’avais plus de temps, je lirais davantage.",
        "If I had more time, I would read more."
      ]
    ],
    [
      "Si j’aurais le temps, je participerais.",
      "Si j’avais le temps, je participerais.",
      "A hypothetical si clause uses imparfait, not conditional."
    ]
  ],
  "concession": [
    "B1 transfer — concede without surrendering reasoning",
    "Même si generally takes indicative: même si la salle est petite, elle est accessible. Bien que often takes subjunctive: bien que la salle soit petite, elle convient. A concession acknowledges a relevant counterpoint while keeping the conclusion qualified. Certes ... mais can work in an argument, yet even a fair concession does not prove the chosen alternative will succeed.",
    [
      [
        "Même si le trajet est long, je peux venir.",
        "Even if the journey is long, I can attend."
      ],
      [
        "Bien que le coût soit élevé, la solution reste possible.",
        "Although the cost is high, the solution remains possible."
      ]
    ],
    [
      "Bien que la salle est petite, elle convient.",
      "Bien que la salle soit petite, elle convient.",
      "Bien que normally calls for the subjunctive form soit."
    ]
  ],
  "source": [
    "B1 transfer — facts, reports and uncertainty",
    "Selon le courriel ... attributes a claim to a particular source; on peut en déduire que signals a supported inference, not an explicit quotation. Il est possible que may take the subjunctive in a finite clause, while il est probable que often uses the indicative. Report which facts are confirmed, which are reasonable interpretations and what remains unknown. An unsupported certainty is not stronger French.",
    [
      [
        "Selon l’avis, certaines salles ferment lundi.",
        "According to the notice, some rooms close Monday."
      ],
      [
        "Il est possible que le cours soit déplacé.",
        "The class may be moved."
      ]
    ],
    [
      "Le message dit « certaines salles », donc toutes les salles ferment.",
      "Le message annonce la fermeture de certaines salles.",
      "Some does not mean all."
    ]
  ],
  "purpose": [
    "B1 transfer — purpose clauses for cooperation",
    "Pour and afin de plus infinitive express the aim when the actor stays the same: je vérifie pour comprendre. Pour que plus subjunctive expresses a purpose with a different subject: je répète pour que tu comprennes. This distinction helps when explaining why a volunteer should contact participants. Do not treat an intended outcome as evidence the effort has already succeeded.",
    [
      [
        "Je relis le texte afin de comprendre la consigne.",
        "I reread the text to understand the instruction."
      ],
      [
        "Je parle lentement pour que chacun puisse répondre.",
        "I speak slowly so everyone can reply."
      ]
    ],
    [
      "Je répète pour que chacun peut comprendre.",
      "Je répète pour que chacun puisse comprendre.",
      "Pour que requires subjunctive puisse here."
    ]
  ],
  "report": [
    "B1 transfer — faithful reported speech",
    "Elle a expliqué que ... introduces a reported statement. When reporting a future from a past viewpoint, an original future can shift to conditional: elle a dit qu’elle viendrait le lendemain. Preserve the original source's uncertainty, especially pouvait, pourrait or sous réserve de. A question asked by a journalist must never become a promise attributed to the respondent.",
    [
      [
        "Elle a annoncé qu’elle reviendrait le lendemain.",
        "She announced that she would return the next day."
      ],
      [
        "Il a précisé qu’aucune décision n’était prise.",
        "He clarified that no decision had been made."
      ]
    ],
    [
      "La journaliste pose la question, donc l’invitée a confirmé.",
      "La journaliste a posé la question, mais l’invitée n’a pas confirmé.",
      "A question does not prove the answer or an official decision."
    ]
  ],
  "passive": [
    "B1 transfer — processes and passive descriptions",
    "Être plus past participle lets a process foreground the item affected: les dossiers sont examinés. The passive participle agrees with the subject in gender and number: les réponses seront envoyées. Après avoir plus past participle marks a completed prior step: après avoir vérifié le dossier. A receipt or administrative action should not be confused with final approval.",
    [
      [
        "Les demandes sont examinées par un agent.",
        "Applications are examined by an agent."
      ],
      [
        "Après avoir vérifié le document, nous répondrons.",
        "After checking the document, we will reply."
      ]
    ],
    [
      "Les réponses sont envoyés demain.",
      "Les réponses sont envoyées demain.",
      "A feminine plural passive subject requires envoyées."
    ]
  ]
};
