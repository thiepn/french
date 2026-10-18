import {authorTransferScenario,type TransferAuthoredSpec} from './u13-transfer-model.ts';
type Compact=Omit<TransferAuthoredSpec,'tasks'> & {
 clozes:readonly (readonly [string,string,string,string])[];
 order:readonly [string,readonly string[],string,string];
};
const RECORDS:readonly Compact[]=[
  {
    "id": "transfer-11",
    "title": "Choose a study format: cost, access and participation",
    "level": "B1 integrated",
    "goal": "Compare course formats and propose an inclusive, feasible learning plan.",
    "grammarKeys": [
      "compare",
      "purpose"
    ],
    "vocabulary": [
      [
        "une formation",
        "course",
        "La formation commence lundi."
      ],
      [
        "à distance",
        "remote",
        "La séance existe à distance."
      ],
      [
        "en présentiel",
        "in person",
        "Je préfère le présentiel."
      ],
      [
        "accessible",
        "accessible",
        "La salle est accessible."
      ],
      [
        "un trajet",
        "journey",
        "Le trajet prend une heure."
      ],
      [
        "une inscription",
        "enrollment",
        "Mon inscription est provisoire."
      ],
      [
        "un coût",
        "cost",
        "Le coût doit être vérifié."
      ],
      [
        "une séance",
        "session",
        "La séance dure une heure."
      ],
      [
        "un participant",
        "participant",
        "Chaque participant a des besoins."
      ],
      [
        "une préférence",
        "preference",
        "Je demande ta préférence."
      ],
      [
        "le matériel",
        "equipment",
        "Le matériel doit être testé."
      ],
      [
        "une consultation",
        "consultation",
        "Une consultation est prévue."
      ]
    ],
    "dialogue": [
      [
        "Fatima",
        "Les cours en présentiel permettent de discuter directement, mais ils demandent de longs trajets à plusieurs étudiants qui travaillent.",
        "In-person sessions allow discussion but require long commutes for working students."
      ],
      [
        "Paul",
        "Le cours à distance pourrait réduire ces déplacements, pourtant je ne sais pas si chacun possède le matériel nécessaire.",
        "Online classes could reduce travel but equipment availability is uncertain."
      ],
      [
        "Fatima",
        "Nous pourrions consulter les étudiants afin de connaître leurs besoins réels au lieu de décider uniquement selon nos préférences.",
        "We could consult learners about their actual needs rather than rely on our preferences."
      ],
      [
        "Paul",
        "Je suis favorable à une consultation, mais nous n’avons pas encore décidé de remplacer les séances prévues dans la salle.",
        "I support consultation, but we have not decided to replace in-person classes."
      ],
      [
        "Fatima",
        "Je comparerai le coût, l’accès et les échanges pour que chacun puisse donner un avis informé avant la décision.",
        "I'll compare cost, access and interaction so each person can offer an informed view."
      ]
    ],
    "reading": {
      "title": "Apprendre dans la même salle ou à distance",
      "paragraphs": [
        "Une association offre des cours du soir à des adultes qui ont des horaires professionnels différents. Certains participants apprécient les rencontres en présentiel, car ils peuvent poser leurs questions directement. D'autres trouvent que le trajet prend trop de temps après le travail. Ils demandent si une séance à distance pourrait être proposée une fois par semaine. Le programme officiel n'a toutefois pas encore changé.",
        "Pendant une réunion, une personne propose un essai en ligne. Plusieurs bénévoles trouvent cette idée intéressante, mais ils ne savent pas si tous les participants pourront utiliser le matériel nécessaire. Ils décident donc de consulter les étudiants et de vérifier les ressources disponibles. Aucun accord n'est pris sur une date de début ni sur le remplacement des cours actuels.",
        "Fatima rédige ensuite une comparaison des avantages et des limites. Le présentiel favorise les échanges spontanés, tandis que la distance réduit les déplacements. Elle suggère une consultation et un essai limité seulement si le matériel fonctionne. Sa recommandation n'impose pas un format à tous : elle repose sur les préférences exprimées et sur les contraintes qui peuvent être vérifiées."
      ],
      "questions": [
        [
          "Which format remains official?",
          "le présentiel",
          [
            "le présentiel",
            "le distanciel",
            "le mixte"
          ],
          "The existing program still schedules the class in person."
        ],
        [
          "What is not known about an online trial?",
          "le matériel disponible",
          [
            "la couleur des salles",
            "le matériel disponible",
            "le nombre de professeurs"
          ],
          "The group must check resources before announcing an online option."
        ],
        [
          "What did the group actually agree to do?",
          "consulter et vérifier",
          [
            "remplacer les séances",
            "consulter et vérifier",
            "annuler la formation"
          ],
          "The agreement concerns consultation and checks, not final adoption."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Current course timetable",
        "type": "notice",
        "french": "Cours du soir : séances en présentiel à 18 h au centre. Les horaires affichés représentent l’organisation actuelle. Toute modification officielle sera annoncée aux inscrits."
      },
      {
        "label": "Planning minutes",
        "type": "minutes",
        "french": "Proposition discutée : une séance à distance. Aucune décision de remplacement n’a été prise. Consulter les participants et vérifier le matériel avant toute annonce."
      }
    ],
    "crossQuestions": [
      [
        "Which source describes the actually scheduled format?",
        "le calendrier",
        [
          "le calendrier",
          "le compte rendu",
          "aucun"
        ],
        "The calendar documents the current course while the minutes contain only a proposal."
      ],
      [
        "Which actions remain necessary?",
        "consulter et vérifier les équipements",
        [
          "voter une fermeture immédiate",
          "consulter et vérifier les équipements",
          "supprimer les messages"
        ],
        "The meeting record lists consultation and equipment checks as prerequisites."
      ]
    ],
    "listening": [
      [
        "Which constraint concerns working students?",
        "les longs trajets",
        [
          "les longs trajets",
          "un manque de livres",
          "le coût de la cantine"
        ],
        "Fatima reports lengthy commutes for some participants."
      ],
      [
        "Has the online format been adopted?",
        "non",
        [
          "oui",
          "non",
          "le cours est terminé"
        ],
        "Paul says no replacement decision has been taken."
      ]
    ],
    "writing": [
      "Write a balanced note recommending how to evaluate a possible hybrid course.",
      [
        "Compare travel and interaction using precise criteria.",
        "Explain the open technical question and one purpose clause.",
        "Distinguish an agreed consultation from an adopted format."
      ],
      "Le programme actuel prévoit des cours en présentiel, ce qui facilite les échanges directs. Cependant, plusieurs participants travaillent et doivent effectuer un long trajet. Une option à distance pourrait être plus pratique pour eux, mais nous ne savons pas encore si le matériel nécessaire est disponible. Je recommande de consulter tous les étudiants pour que chacun puisse décrire ses besoins. Il faudrait aussi vérifier le coût et la qualité des équipements. Si ces conditions sont réunies, une séance d’essai pourrait être proposée. Aucun remplacement définitif des cours actuels ne doit être annoncé avant une décision."
    ],
    "oral": {
      "prompt": "Give a one-minute balanced recommendation on in-person versus online study.",
      "plan": [
        "Identify the existing format and differing needs.",
        "Compare benefits and limits.",
        "Propose consultation and a conditional trial."
      ],
      "model": "Le programme officiel reste en présentiel. Cette formule favorise les échanges, mais plusieurs étudiants doivent se déplacer longtemps après leur travail. Une séance en ligne pourrait les aider, sous réserve d’un matériel adapté. Je recommande donc de recueillir les avis des participants et de vérifier les ressources techniques. Le groupe pourra envisager une séance d’essai si les conditions sont réunies. Pour le moment, aucune nouvelle organisation n’est officiellement adoptée."
    },
    "clozes": [
      [
        "Le trajet est plus long ___ celui de la formation en ligne.",
        "que",
        "Plus ... que expresses comparison between two travel demands.",
        "comparison"
      ],
      [
        "Nous expliquons les choix pour que chacun ___ répondre. (pouvoir)",
        "puisse",
        "Pour que requires subjunctive puisse for another actor.",
        "purpose"
      ]
    ],
    "order": [
      "Nous consulterons les participants",
      [
        "les participants",
        "Nous consulterons"
      ],
      "This is a future step to gather evidence, not an established format decision.",
      "next action"
    ]
  },
  {
    "id": "transfer-12",
    "title": "Survey changes: percentage points, samples and conclusions",
    "level": "B1 integrated",
    "goal": "Explain two survey results without unsupported population or causal claims.",
    "grammarKeys": [
      "source",
      "condition"
    ],
    "vocabulary": [
      [
        "une enquête",
        "survey",
        "L’enquête est récente."
      ],
      [
        "un graphique",
        "chart",
        "Le graphique indique une hausse."
      ],
      [
        "un pourcentage",
        "percentage",
        "Le pourcentage est précis."
      ],
      [
        "un point",
        "point",
        "La part gagne dix points."
      ],
      [
        "un échantillon",
        "sample",
        "L’échantillon est inconnu."
      ],
      [
        "un répondant",
        "respondent",
        "Chaque répondant donne son avis."
      ],
      [
        "une proportion",
        "share",
        "La proportion change."
      ],
      [
        "une méthode",
        "method",
        "La méthode doit être connue."
      ],
      [
        "une cause",
        "cause",
        "La cause reste inconnue."
      ],
      [
        "une hausse",
        "increase",
        "La hausse est visible."
      ],
      [
        "représentatif",
        "representative",
        "L’étude n’est pas forcément représentative."
      ],
      [
        "comparable",
        "comparable",
        "Les groupes sont-ils comparables ?"
      ]
    ],
    "dialogue": [
      [
        "Clara",
        "La première enquête indique que vingt pour cent des répondants préfèrent le vélo, tandis que la seconde affiche trente pour cent.",
        "The first survey says twenty percent prefer cycling; the next says thirty percent."
      ],
      [
        "Jules",
        "La différence est de dix points de pourcentage, mais aucune source ne précise combien de personnes ont répondu à chaque questionnaire.",
        "That's ten percentage points, but no source gives respondent counts."
      ],
      [
        "Clara",
        "Nous ne pouvons donc pas affirmer que toute la ville a changé d’avis, même si les deux chiffres sont corrects dans leurs contextes.",
        "We can't claim the whole city changed its mind, even if the numbers are correct."
      ],
      [
        "Jules",
        "La nouvelle piste cyclable pourrait avoir joué un rôle, mais nous n’avons aucune preuve qu’elle explique cette différence entre les enquêtes.",
        "The new cycle path might be relevant, but the data provide no causal proof."
      ],
      [
        "Clara",
        "Je présenterai les résultats avec leurs limites et demanderai les méthodes avant de proposer une conclusion sur la population.",
        "I'll report the figures with their limits and request methods first."
      ]
    ],
    "reading": {
      "title": "Deux valeurs ne suffisent pas à expliquer une tendance",
      "paragraphs": [
        "Un journal local compare deux enquêtes sur les moyens de transport. Dans la première, vingt pour cent des personnes interrogées déclarent préférer le vélo. Dans la seconde, trente pour cent donnent cette réponse. La différence est de dix points de pourcentage. Le tableau publié ne donne cependant pas le nombre de répondants et ne précise pas la méthode utilisée pour les choisir.",
        "Des lecteurs interprètent immédiatement cette variation comme une preuve que les habitants utilisent davantage le vélo grâce à une nouvelle piste. Pourtant, les deux questionnaires pourraient avoir été distribués à des groupes différents. Les questions pourraient également avoir changé. Le résultat indique une différence parmi les personnes interrogées, mais il ne suffit pas à établir pourquoi les réponses ne sont pas identiques.",
        "Clara prépare donc un article prudent. Elle conserve les pourcentages et leur différence, mais précise leur population de référence. Elle mentionne la taille inconnue des échantillons et demande les questionnaires originaux. Son résumé aide le public à distinguer une observation mesurée d'une interprétation causale. Elle ne prétend pas que la piste n'a eu aucun effet; elle explique seulement que le lien reste à vérifier."
      ],
      "questions": [
        [
          "What is the difference between the rates?",
          "dix points de pourcentage",
          [
            "dix pour cent relatifs",
            "dix points de pourcentage",
            "vingt points"
          ],
          "Thirty minus twenty produces ten percentage points."
        ],
        [
          "Which methodological facts are missing?",
          "la taille et la méthode",
          [
            "la taille et la méthode",
            "le nom des cyclistes",
            "l’adresse du bureau"
          ],
          "Sample sizes and selection methods are not supplied."
        ],
        [
          "What causal conclusion is unsupported?",
          "la piste a causé l’évolution",
          [
            "les taux diffèrent",
            "la piste a causé l’évolution",
            "deux enquêtes existent"
          ],
          "The documents do not establish a causal relationship."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Survey A extract",
        "type": "data",
        "french": "Enquête A : 20 % des répondants indiquent une préférence pour le vélo. L’extrait ne présente ni la taille de l’échantillon ni la méthode de recrutement."
      },
      {
        "label": "Survey B extract",
        "type": "data",
        "french": "Enquête B : 30 % des répondants indiquent une préférence pour le vélo. Les questions détaillées et le nombre de participants ne sont pas fournis."
      }
    ],
    "crossQuestions": [
      [
        "What difference is actually measurable?",
        "dix points",
        [
          "dix points",
          "trente points",
          "aucune différence"
        ],
        "The two displayed rates differ by exactly ten percentage points."
      ],
      [
        "What important limitation affects both sources?",
        "les participants ne sont pas décrits",
        [
          "les participants ne sont pas décrits",
          "les chiffres sont absents",
          "les enquêtes ont été annulées"
        ],
        "Neither extract establishes the study populations well enough for generalization."
      ]
    ],
    "listening": [
      [
        "What is the later survey percentage?",
        "trente pour cent",
        [
          "trente pour cent",
          "vingt pour cent",
          "quarante pour cent"
        ],
        "Clara reports thirty percent in the second survey."
      ],
      [
        "What causal interpretation remains unproven?",
        "l’effet de la nouvelle piste",
        [
          "l’effet de la nouvelle piste",
          "l’existence de deux questionnaires",
          "la différence de dix points"
        ],
        "Jules explicitly avoids attributing the numerical difference to a new path."
      ]
    ],
    "writing": [
      "Write a cautious synthesis of two survey figures, identifying what is observed and unknown.",
      [
        "Use the correct unit of percentage points.",
        "Limit claims to the respondents instead of the entire city.",
        "Identify unknown sampling and causal explanation details."
      ],
      "La première enquête indique que vingt pour cent des répondants préfèrent le vélo, contre trente pour cent dans la seconde. La différence est de dix points de pourcentage. Ces chiffres décrivent uniquement les réponses recueillies dans les deux études. Nous ignorons le nombre de participants et les méthodes utilisées pour les choisir. Il serait donc prématuré de généraliser cette variation à tous les habitants. La nouvelle piste cyclable pourrait avoir contribué au résultat, mais aucun lien causal n’est établi par ces extraits. Une vérification des méthodes serait nécessaire."
    ],
    "oral": {
      "prompt": "Explain the numerical difference and why it doesn't establish a population-wide causal change.",
      "plan": [
        "Name both percentages and the correct unit.",
        "Clarify the respondents as the denominator.",
        "State which sampling and causal questions remain open."
      ],
      "model": "Les deux enquêtes indiquent vingt et trente pour cent de répondants favorables au vélo. Cela correspond à dix points de pourcentage supplémentaires. Cependant, nous ne savons pas combien de personnes ont répondu ni si les groupes sont comparables. Nous ne pouvons donc pas conclure que tous les habitants ont changé d’avis. La piste cyclable pourrait avoir joué un rôle, mais ce document n’en apporte pas la preuve. Il faudrait lire les questionnaires complets."
    },
    "clozes": [
      [
        "La hausse correspond à dix ___ de pourcentage.",
        "points",
        "Percentage points compare rates on an absolute scale.",
        "percentage points"
      ],
      [
        "Il est possible que l’échantillon ___ différent. (être)",
        "soit",
        "Il est possible que takes subjunctive soit.",
        "uncertainty"
      ]
    ],
    "order": [
      "La cause reste inconnue",
      [
        "reste inconnue",
        "La cause"
      ],
      "An observed numeric change alone does not identify a cause.",
      "evidence"
    ]
  },
  {
    "id": "transfer-13",
    "title": "Volunteer workshop: minutes, invitation and responsibilities",
    "level": "B1 integrated",
    "goal": "Reconcile an event invitation with provisional meeting decisions and role assignments.",
    "grammarKeys": [
      "purpose",
      "passive"
    ],
    "vocabulary": [
      [
        "un atelier",
        "workshop",
        "Nous proposons un atelier."
      ],
      [
        "une association",
        "association",
        "L’association prépare une activité."
      ],
      [
        "un bénévole",
        "volunteer",
        "Le bénévole aide le groupe."
      ],
      [
        "un responsable",
        "owner",
        "Le responsable a accepté sa tâche."
      ],
      [
        "une salle",
        "room",
        "La salle doit être vérifiée."
      ],
      [
        "un matériel",
        "equipment",
        "Le matériel n’est pas confirmé."
      ],
      [
        "une séance",
        "session",
        "Une séance d’essai est possible."
      ],
      [
        "une invitation",
        "invitation",
        "L’invitation reste provisoire."
      ],
      [
        "une inscription",
        "registration",
        "Les inscriptions restent ouvertes."
      ],
      [
        "un bilan",
        "review",
        "Nous ferons un bilan après l’essai."
      ],
      [
        "une décision",
        "decision",
        "La décision n’a pas été prise."
      ],
      [
        "une consultation",
        "consultation",
        "Le groupe prévoit une consultation."
      ]
    ],
    "dialogue": [
      [
        "Sophie",
        "Nous voulons organiser un atelier de conversation, mais nous n’avons pas encore confirmé la salle ni désigné un responsable des inscriptions.",
        "We want a conversation workshop, but venue and registrations are not confirmed."
      ],
      [
        "Marc",
        "J’ai accepté de vérifier la salle vendredi, tandis que tu prépares les thèmes dont les participants pourront discuter.",
        "I accepted checking the room Friday while you prepare the discussion topics."
      ],
      [
        "Sophie",
        "Nous pourrions rédiger une invitation provisoire pour que les personnes intéressées puissent exprimer leurs préférences.",
        "We could draft a provisional invitation so interested people can state their preferences."
      ],
      [
        "Marc",
        "Oui, mais ne présentons pas la séance d’essai comme adoptée avant que le matériel et les autres bénévoles aient été vérifiés.",
        "Yes, but don't present the trial as adopted before equipment and volunteers are checked."
      ],
      [
        "Sophie",
        "Je préciserai les tâches déjà confiées, celles qui restent ouvertes et l’idée d’un bilan après une éventuelle première séance.",
        "I'll distinguish assigned tasks, open roles and feedback after any first session."
      ]
    ],
    "reading": {
      "title": "Une invitation avant le feu vert",
      "paragraphs": [
        "Une association envisage un atelier de conversation pour les nouveaux habitants du quartier. L'objectif est de créer une occasion de pratiquer le français dans des échanges simples. Sophie accepte de préparer les sujets de discussion, et Marc se charge de vérifier vendredi la disponibilité de la salle. Cependant, personne n'a encore accepté la responsabilité des inscriptions et le matériel nécessaire n'est pas confirmé.",
        "À la réunion, les bénévoles discutent de la possibilité d'organiser une première séance d'essai. Le compte rendu indique clairement qu'il s'agit d'une proposition soumise aux moyens disponibles. Une invitation provisoire est rédigée pour recueillir l'intérêt des participants. Elle ne doit pas annoncer un rendez-vous définitif, car ni la salle ni les ressources ne sont encore garanties.",
        "Sophie décide de présenter les objectifs du projet et d'inviter les personnes intéressées à signaler leurs disponibilités. Après confirmation des moyens, le groupe pourra choisir une date. Si la séance a lieu, un bilan permettra de savoir ce qui a bien fonctionné et ce qui doit être amélioré. Cette démarche respecte les tâches réellement attribuées sans prétendre que le projet a déjà été lancé."
      ],
      "questions": [
        [
          "Who will check room availability?",
          "Marc",
          [
            "Marc",
            "Sophie",
            "aucun responsable"
          ],
          "Marc accepted the room check on Friday."
        ],
        [
          "Why is the invitation provisional?",
          "le lieu et les ressources restent incertains",
          [
            "le lieu et les ressources restent incertains",
            "le cours a déjà eu lieu",
            "tous ont refusé"
          ],
          "The event lacks verified space and sufficient resources."
        ],
        [
          "What can a trial's later bilan provide?",
          "un retour sur l’activité",
          [
            "un retour sur l’activité",
            "un certificat officiel",
            "une date automatique"
          ],
          "Post-event feedback helps evaluate the next steps."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Meeting minutes",
        "type": "minutes",
        "french": "Responsabilités : Sophie prépare les sujets; Marc vérifie la salle vendredi. Les inscriptions n’ont pas de responsable. Une séance d’essai a été proposée sans date approuvée."
      },
      {
        "label": "Provisional invitation",
        "type": "email",
        "french": "Nous envisageons un atelier de conversation. Les personnes intéressées peuvent indiquer leur disponibilité. La date et la salle seront communiquées seulement après confirmation."
      }
    ],
    "crossQuestions": [
      [
        "Which source assigns named tasks?",
        "le compte rendu",
        [
          "le compte rendu",
          "l’invitation",
          "aucun"
        ],
        "The minutes identify Sophie and Marc; the invitation does not."
      ],
      [
        "What status do both sources support?",
        "l’atelier est encore proposé",
        [
          "l’atelier est déjà terminé",
          "l’atelier est encore proposé",
          "le lieu est confirmé"
        ],
        "Both describe a possible workshop not yet approved for a time and place."
      ]
    ],
    "listening": [
      [
        "What task did Marc accept?",
        "vérifier la salle",
        [
          "vérifier la salle",
          "préparer les thèmes",
          "gérer les inscriptions"
        ],
        "Marc explicitly accepted checking the room Friday."
      ],
      [
        "What is Sophie planning to write?",
        "une invitation provisoire",
        [
          "une invitation provisoire",
          "une facture",
          "une attestation"
        ],
        "She proposes a provisional invitation for expressions of interest."
      ]
    ],
    "writing": [
      "Draft a provisional event message, respecting the assignment and resource boundaries.",
      [
        "Attribute Sophie and Marc's duties accurately.",
        "State that time and place remain conditional.",
        "Explain how a trial would later be evaluated."
      ],
      "Bonjour, notre association envisage un atelier de conversation pour les nouveaux habitants. Le projet permettrait de pratiquer le français dans un cadre accueillant. Sophie prépare les thèmes et Marc vérifiera la salle vendredi. Nous n’avons pas encore désigné de responsable pour les inscriptions, et les ressources doivent être examinées. La date et le lieu ne sont donc pas confirmés. Les personnes intéressées peuvent nous faire connaître leurs préférences. Si les conditions sont réunies, nous proposerons une séance d’essai et demanderons ensuite un bilan aux participants."
    ],
    "oral": {
      "prompt": "Present the actual volunteer commitments and open tasks in a one-minute briefing.",
      "plan": [
        "State the workshop aim and confirmed owners.",
        "Separate the invitation from a finalized event.",
        "Explain the resource checks and possible later evaluation."
      ],
      "model": "Notre association souhaite proposer un atelier de conversation. Sophie s’est chargée des sujets, et Marc vérifiera la salle vendredi. En revanche, aucun responsable des inscriptions n’a encore été désigné. L’invitation sera donc provisoire et demandera simplement aux personnes intéressées d’indiquer leurs disponibilités. Une séance d’essai pourrait être organisée si le matériel et les bénévoles sont disponibles. Ensuite, nous demanderons un retour avant de décider de la suite."
    },
    "clozes": [
      [
        "Sophie prépare des thèmes pour que chacun ___ participer. (pouvoir)",
        "puisse",
        "Pour que selects the subjunctive puisse when another person acts.",
        "purpose"
      ],
      [
        "Les invitations seront ___ après confirmation. (envoyer)",
        "envoyées",
        "The feminine plural passive subject invitations requires envoyées.",
        "passive agreement"
      ]
    ],
    "order": [
      "Le lieu reste à confirmer",
      [
        "reste à confirmer",
        "Le lieu"
      ],
      "A discussed venue is not confirmed without the promised check.",
      "status"
    ]
  }
];
export const TRANSFER_11_13=Object.freeze(RECORDS.map((spec,i)=>{
 const tasks:TransferAuthoredSpec['tasks']=[
  ...spec.reading.questions.map(([q,a,options,why])=>['reading',q,a,why,[...options],'passage evidence'] as TransferAuthoredSpec['tasks'][number]),
  ...spec.crossQuestions.map(([q,a,options,why])=>['choice',q,a,why,[...options],'multi-source comparison'] as TransferAuthoredSpec['tasks'][number]),
  ...spec.clozes.map(([q,a,why,focus])=>['fill',q,a,why,[],focus] as TransferAuthoredSpec['tasks'][number]),
  ['order','Arrange the words into the original sentence.',spec.order[0],spec.order[2],[...spec.order[1]],spec.order[3]],
  ...spec.listening.map(([q,a,options,why])=>['choice',q,a,why,[...options],'dialogue inference'] as TransferAuthoredSpec['tasks'][number])
 ];
 const {clozes,order,...content}=spec;
 return authorTransferScenario({...content,tasks},i+11);
}));
