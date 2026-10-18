import {authorB1DepthUnit} from './u11-b1-model.ts';
import type {A1AuthoredSpec} from './u6-a1-model.ts';
const units:A1AuthoredSpec[]=[
  {
    "id": "b1-27",
    "title": "Write a persuasive letter with fair concessions",
    "goal": "Present a verifiable case, acknowledge an opposing argument and request proportionate action.",
    "grammarIds": [],
    "grammar": [
      [
        "Thesis, reason, illustration and concession",
        "Une lettre persuasive efficace begins with a concrete request and a reason, then illustrates that reason with an example. Certes ... mais acknowledges a valid opposing consideration rather than dismissing it. Bien que + subjunctive can introduce concession, and cependant a different consideration. Do not call a claim a proven fact merely because it supports the position you prefer.",
        [
          [
            "Certes, la salle coûte cher, mais elle est accessible en transport.",
            "Admittedly the room costs more, but it is reachable by transit."
          ],
          [
            "Bien que ce soit difficile, nous pourrions consulter les habitants.",
            "Though it is difficult, we could consult residents."
          ]
        ],
        [
          "Bien que c’est difficile, nous proposerons un changement.",
          "Bien que ce soit difficile, nous proposerons un changement.",
          "Bien que usually selects the subjunctive soit, not indicative est."
        ]
      ],
      [
        "Specific request and accountable conclusion",
        "Pourriez-vous envisager de plus infinitive requests a review rather than asserting authority. A productive conclusion states the desired action, relevant constraints and what information would change your recommendation. C’est pourquoi links reason to the next step, while en conclusion marks a summarized position. A fair letter avoids manipulating attributed quotations or guessing how every stakeholder feels.",
        [
          [
            "Pourriez-vous envisager d’ajuster les horaires du service ?",
            "Could you consider adjusting service hours?"
          ],
          [
            "C’est pourquoi je propose une consultation avant la décision.",
            "That is why I propose a consultation before the decision."
          ]
        ],
        [
          "Je demande le changement, donc tout le monde a accepté.",
          "Je demande d’étudier ce changement; l’accord des autres reste à obtenir.",
          "A request cannot certify another person's consent."
        ]
      ]
    ],
    "vocabulary": [
      [
        "une lettre ouverte",
        "open letter",
        "La lettre ouverte présente une proposition."
      ],
      [
        "une thèse",
        "main claim",
        "La thèse doit être claire."
      ],
      [
        "un argument",
        "argument",
        "L’argument est étayé par un exemple."
      ],
      [
        "une concession",
        "concession",
        "Il reconnaît une concession."
      ],
      [
        "certes",
        "admittedly",
        "Certes, la solution coûte plus cher."
      ],
      [
        "en conclusion",
        "in conclusion",
        "En conclusion, je demande une réponse."
      ],
      [
        "étayer",
        "to substantiate",
        "Il faut étayer la demande."
      ],
      [
        "envisager",
        "to consider",
        "Pourriez-vous envisager un essai ?"
      ],
      [
        "une consultation",
        "consultation",
        "Une consultation serait utile."
      ],
      [
        "une priorité",
        "priority",
        "L’accessibilité est une priorité."
      ],
      [
        "une objection",
        "objection",
        "Je comprends l’objection."
      ],
      [
        "proportionné",
        "proportionate",
        "La solution doit être proportionnée."
      ]
    ],
    "dialogue": [
      [
        "Louise",
        "Je voudrais écrire une lettre ouverte pour demander des horaires plus accessibles, mais je ne veux pas exagérer les difficultés des habitants.",
        "I want to write an open letter about accessible hours without exaggerating residents' difficulties."
      ],
      [
        "Yanis",
        "Commence par un fait vérifiable : actuellement, la salle ferme avant que plusieurs travailleurs aient terminé leur journée.",
        "Start with a verifiable fact: the room currently closes before several people end work."
      ],
      [
        "Louise",
        "Je reconnaîtrai aussi que prolonger l’ouverture peut coûter davantage, puisqu’il faudrait peut-être rémunérer du personnel supplémentaire.",
        "I'll acknowledge extended hours may cost more because additional staff might be needed."
      ],
      [
        "Yanis",
        "Tu pourrais proposer un essai limité, à condition que le responsable examine le budget et consulte les personnes concernées.",
        "You could suggest a limited trial if the manager reviews budget and consults stakeholders."
      ],
      [
        "Louise",
        "Je demanderai donc d’étudier la proposition et de publier les critères de décision, plutôt que de présenter le changement comme déjà accepté.",
        "I'll request an assessment and public decision criteria, not claim the change is accepted."
      ]
    ],
    "tasks": [
      [
        "fill",
        "___, la solution coûte plus cher, mais elle peut aider.",
        "Certes",
        "Certes acknowledges a real counterargument before contrasting it.",
        [],
        "concession"
      ],
      [
        "choice",
        "Which contains an appropriate concession?",
        "Certes, c’est cher, mais certains usagers en bénéficieraient.",
        "It admits the cost while giving the potential benefit.",
        [
          "Aucun coût n’existe.",
          "Certes, c’est cher, mais certains usagers en bénéficieraient.",
          "Tous les habitants exigent cela."
        ],
        "balanced argument"
      ],
      [
        "reading",
        "Which limitation does Louise plan to acknowledge?",
        "le coût éventuel du personnel",
        "She explicitly notes possible additional staffing costs.",
        [
          "les livres sont gratuits",
          "le coût éventuel du personnel",
          "les visiteurs ne veulent pas venir"
        ],
        "counterargument"
      ],
      [
        "fill",
        "Bien que ce ___ difficile, il faut discuter. (être)",
        "soit",
        "Bien que normally takes the subjunctive soit in this common pattern.",
        [],
        "subjunctive"
      ],
      [
        "choice",
        "Which is a bounded and realistic proposal?",
        "tester des horaires élargis sur une période",
        "A limited trial permits evaluation before permanent adoption.",
        [
          "imposer les nouveaux horaires sans budget",
          "tester des horaires élargis sur une période",
          "garantir que tout le monde viendra"
        ],
        "feasibility"
      ],
      [
        "order",
        "Arrange: une consultation / Je propose",
        "Je propose une consultation",
        "The present statement names a proposal, not a finished decision.",
        [
          "une consultation",
          "Je propose"
        ],
        "syntax"
      ],
      [
        "fill",
        "Pourriez-vous ___ cette possibilité ?",
        "envisager",
        "Envisager means to consider a possible action or proposal.",
        [],
        "register"
      ],
      [
        "reading",
        "What will Louise avoid claiming in the final letter?",
        "que le changement est déjà accepté",
        "She distinguishes a pending evaluation from actual adoption.",
        [
          "que les horaires sont courts",
          "que le changement est déjà accepté",
          "que le budget existe"
        ],
        "truthfulness"
      ],
      [
        "choice",
        "Which type of example makes an argument stronger?",
        "a specific verifiable schedule",
        "A checkable example can support a request without inventing consensus.",
        [
          "an invented quotation",
          "a specific verifiable schedule",
          "a universal assertion without sources"
        ],
        "evidence"
      ],
      [
        "fill",
        "Un argument doit être ___ par des éléments fiables.",
        "étayé",
        "Étayé means supported by concrete relevant evidence.",
        [],
        "argumentation"
      ]
    ],
    "writing": [
      "Write a formal persuasive letter of at least nine sentences requesting a practical change with a conceded constraint and evaluable proposal.",
      [
        "Begin with an exact request and an example you could verify.",
        "Concede at least one legitimate resource or scheduling concern.",
        "Suggest a proportionate trial, ask for consultation and avoid claiming consent."
      ],
      "Objet : Proposition d’adaptation des horaires. Bonjour Madame, je vous écris au sujet de la salle commune du quartier. Plusieurs habitants terminent leur travail après sa fermeture actuelle. Il serait utile d’examiner une ouverture plus tardive un jour par semaine. Certes, cette mesure pourrait entraîner un coût supplémentaire pour le personnel. Toutefois, elle faciliterait l’accès à certains usagers qui ne peuvent pas venir l’après-midi. Pourriez-vous envisager un essai de quelques semaines ? Je propose aussi de consulter les utilisateurs concernés et de publier les critères de décision. Je ne considère pas cette proposition comme approuvée à ce stade. Je vous remercie pour votre réponse. Cordialement, Louise."
    ]
  },
  {
    "id": "b1-28",
    "title": "B1 independent synthesis capstone",
    "goal": "Read several genres, evaluate evidence, and compose a clear nuanced recommendation with follow-up questions.",
    "grammarIds": [],
    "grammar": [
      [
        "Build a synthesis from unequal sources",
        "A synthesis compares what a formal notice, personal testimony and meeting summary each contribute. Le document officiel indique que can carry a specific attributed statement, whereas d’après un témoignage signals an individual case; neither necessarily settles a disputed detail. Use ce qui, ce que and dont to link ideas clearly, and reserve on peut en déduire que for supported inferences rather than invented facts.",
        [
          [
            "Ce qui reste incertain, c’est la date de mise en œuvre.",
            "What remains uncertain is the implementation date."
          ],
          [
            "Les informations dont nous disposons ne suffisent pas à confirmer le coût.",
            "Our available information is insufficient to confirm the cost."
          ]
        ],
        [
          "Un avis personnel dit que c’est simple, donc l’application sera simple pour tous.",
          "Un usager le trouve simple, mais les besoins des autres restent à étudier.",
          "A testimonial does not automatically represent all users."
        ]
      ],
      [
        "Develop a recommendation and invite verification",
        "Use d’une part ... d’autre part for competing considerations; bien que ce soit for concession; and si + present followed by future for the next conditional action. An independent B1 response should clearly name a preferred option, explain how it follows from evidence and identify one unknown that would change the decision. Keep conclusions proportional to the sources.",
        [
          [
            "Si le responsable confirme les horaires, nous informerons les participants.",
            "If the manager confirms the hours, we will inform participants."
          ],
          [
            "Bien que ce soit une option intéressante, les moyens restent à vérifier.",
            "Although it is interesting, the resources need checking."
          ]
        ],
        [
          "Si le responsable confirmera, nous publierons la date.",
          "Si le responsable confirme, nous publierons la date.",
          "Use present in a real future si condition, not futur simple."
        ]
      ]
    ],
    "vocabulary": [
      [
        "une synthèse",
        "synthesis",
        "Je rédige une synthèse claire."
      ],
      [
        "une source",
        "source",
        "Chaque source est identifiée."
      ],
      [
        "un témoignage",
        "testimonial",
        "Le témoignage ne représente qu’une personne."
      ],
      [
        "une réserve",
        "caveat",
        "J’ajoute une réserve nécessaire."
      ],
      [
        "une hypothèse",
        "hypothesis",
        "Cette hypothèse n’est pas confirmée."
      ],
      [
        "en déduire",
        "to infer",
        "On peut en déduire une possibilité."
      ],
      [
        "une décision",
        "decision",
        "La décision n’est pas définitive."
      ],
      [
        "un critère",
        "criterion",
        "Le coût est un critère pertinent."
      ],
      [
        "d’une part",
        "on one hand",
        "D’une part, le trajet est court."
      ],
      [
        "d’autre part",
        "on the other",
        "D’autre part, le coût augmente."
      ],
      [
        "une recommandation",
        "recommendation",
        "La recommandation reste prudente."
      ],
      [
        "une vérification",
        "verification",
        "Une vérification est indispensable."
      ]
    ],
    "dialogue": [
      [
        "Sophie",
        "Le centre a publié une annonce indiquant un nouveau créneau vendredi, mais elle ne dit pas si la réunion en ligne sera maintenue.",
        "The center announced a new Friday slot but not whether the online meeting continues."
      ],
      [
        "Idris",
        "Plusieurs participants ont raconté des expériences différentes avec le système actuel; ces témoignages ne suffisent pas à décider pour tout le monde.",
        "Participants report different experiences, which do not by themselves settle the decision for all."
      ],
      [
        "Sophie",
        "Ce qui me préoccupe, c’est l’accessibilité pour les personnes qui travaillent tard et celles qui se déplacent difficilement.",
        "What concerns me is accessibility for people who work late or cannot travel easily."
      ],
      [
        "Idris",
        "Nous pourrions recommander une période d’essai, bien que ce soit plus compliqué à organiser et que le budget reste incertain.",
        "We could recommend a trial, although organization is harder and budget uncertain."
      ],
      [
        "Sophie",
        "Si nous obtenons une confirmation écrite du créneau et des ressources, je préparerai une synthèse présentant les avantages, les limites et les questions ouvertes.",
        "If we receive written confirmation of the slot and resources, I'll prepare a balanced synthesis."
      ]
    ],
    "tasks": [
      [
        "fill",
        "Ce ___ m’inquiète, c’est l’accessibilité.",
        "qui",
        "Ce qui is the subject of the relative clause with inquiète.",
        [],
        "complex relative"
      ],
      [
        "choice",
        "What does a testimonial by one participant establish?",
        "that participant's experience",
        "One account cannot certify the whole group's needs.",
        [
          "every participant agrees",
          "that participant's experience",
          "the budget is approved"
        ],
        "evidence scope"
      ],
      [
        "reading",
        "What remains uncertain in the proposed trial?",
        "le budget et les ressources",
        "Idris says the budget remains unknown, and Sophie requests confirmation of resources.",
        [
          "la nationalité des participants",
          "le budget et les ressources",
          "le nom du bus"
        ],
        "synthesis"
      ],
      [
        "fill",
        "Les informations ___ nous disposons sont incomplètes.",
        "dont",
        "Disposer de requires dont in a relative clause.",
        [],
        "relative de"
      ],
      [
        "choice",
        "Which is a cautious recommendation?",
        "tester la formule après vérification des moyens",
        "It respects resource uncertainty before trying a new format.",
        [
          "annoncer un accord déjà signé",
          "tester la formule après vérification des moyens",
          "garantir que tous peuvent venir"
        ],
        "proportionate action"
      ],
      [
        "order",
        "Arrange: nous informerons les participants / Si la date est confirmée",
        "Si la date est confirmée nous informerons les participants",
        "The present in si introduces a real condition for a future action.",
        [
          "nous informerons les participants",
          "Si la date est confirmée"
        ],
        "condition"
      ],
      [
        "fill",
        "Bien que ce ___ plus compliqué, nous essayerons. (être)",
        "soit",
        "Bien que selects the subjunctive form soit.",
        [],
        "concession"
      ],
      [
        "reading",
        "Why are individual reports not enough to decide?",
        "les besoins sont différents et non vérifiés",
        "The speakers explicitly separate anecdotes from overall participation needs.",
        [
          "le lieu est déjà fermé",
          "les besoins sont différents et non vérifiés",
          "personne ne parle français"
        ],
        "critical reading"
      ],
      [
        "choice",
        "Which creates a balanced comparison?",
        "D’une part le format aide, d’autre part il coûte.",
        "The paired structure names both benefit and constraint.",
        [
          "Le format est parfait.",
          "D’une part le format aide, d’autre part il coûte.",
          "Aucun risque n’existe."
        ],
        "argument structure"
      ],
      [
        "fill",
        "Je vais demander une ___ avant de conclure.",
        "vérification",
        "Vérification names the additional checking required before a definitive conclusion.",
        [],
        "meta-reading"
      ]
    ],
    "writing": [
      "Produce a ten-to-twelve sentence evidence-grounded synthesis combining a notice, an interview and a meeting summary into a practical decision memo.",
      [
        "Attribute at least three distinct kinds of evidence without claiming agreement where none exists.",
        "Use two relative forms and an accurate concession or real condition.",
        "Recommend a concrete next step, with what is known, unknown and who needs to confirm it."
      ],
      "Le centre propose de modifier le créneau du vendredi. L’annonce officielle précise une nouvelle heure, mais elle ne confirme pas le maintien de la participation à distance. Plusieurs participants ont raconté des expériences différentes avec le système précédent. Ces témoignages montrent des besoins variés, sans représenter automatiquement tout le groupe. Ce qui reste incertain, c’est le matériel disponible pour une formule mixte. D’une part, cette formule pourrait faciliter l’accès de certaines personnes. D’autre part, elle demanderait des ressources supplémentaires. Bien que ce soit une possibilité intéressante, il faut encore vérifier le budget. Je recommande une courte période d’essai après consultation des personnes concernées. Si le responsable confirme les horaires et les moyens, nous pourrons informer le groupe. Avant cette réponse, je ne présenterai pas la nouvelle organisation comme approuvée."
    ]
  }
];
export const B1_UNITS_27_28=Object.freeze(units.map((spec,i)=>authorB1DepthUnit(spec,i+27)));
