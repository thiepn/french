import {authorU14Scenario,type U14AuthoredScenario} from './u14-model.ts';
const SOURCE:readonly U14AuthoredScenario[]=[
  {
    "id": "transfer-25",
    "title": "Plan an inclusive celebration from invitations and dietary replies",
    "goal": "Coordinate attendance, voluntary meal preferences and menu confirmation without making personal assumptions.",
    "grammarKeys": [
      "pronouns",
      "purpose"
    ],
    "vocabulary": [
      [
        "une invitation",
        "invitation",
        "J’envoie les invitations."
      ],
      [
        "une réponse",
        "response",
        "J’attends une réponse."
      ],
      [
        "un repas",
        "meal",
        "Le repas sera préparé."
      ],
      [
        "un régime alimentaire",
        "dietary pattern",
        "Chacun peut indiquer ses préférences."
      ],
      [
        "une allergie",
        "allergy",
        "Une allergie doit être prise au sérieux."
      ],
      [
        "un ingrédient",
        "ingredient",
        "La liste des ingrédients manque."
      ],
      [
        "une option",
        "option",
        "Une option végétarienne est proposée."
      ],
      [
        "un traiteur",
        "caterer",
        "Le traiteur confirmera les plats."
      ],
      [
        "un invité",
        "guest",
        "Chaque invité reste libre de répondre."
      ],
      [
        "confirmer",
        "confirm",
        "Je demande une confirmation écrite."
      ],
      [
        "un horaire",
        "time",
        "L’horaire est inscrit sur la carte."
      ],
      [
        "respecter",
        "respect",
        "Nous respectons les choix personnels."
      ]
    ],
    "dialogue": [
      [
        "Élodie",
        "Nous organisons une fête samedi; plusieurs invités ont répondu, mais nous ne savons pas encore quelles options de repas seront réellement disponibles.",
        "We are planning a party; some have replied but meal options are not confirmed."
      ],
      [
        "Moussa",
        "Dans l’invitation, on propose un plat végétarien, pourtant le traiteur n’a pas encore communiqué la liste complète des ingrédients.",
        "The invitation suggests a vegetarian dish, but the caterer hasn't confirmed ingredients."
      ],
      [
        "Élodie",
        "Je voudrais demander les préférences de chacun sans supposer ce qu’une personne mange à partir de son origine ou de ses habitudes.",
        "I want to ask individual preferences without stereotyping anyone's food choices."
      ],
      [
        "Moussa",
        "Nous pouvons proposer une réponse facultative et demander directement au traiteur de confirmer les ingrédients, surtout lorsqu’une personne signale une contrainte importante.",
        "We can offer voluntary replies and obtain actual ingredient confirmation for important restrictions."
      ],
      [
        "Élodie",
        "Je transmettrai uniquement les options confirmées et laisserai chacun décider quelles informations personnelles il souhaite communiquer.",
        "I'll share confirmed options and let guests decide what personal details to disclose."
      ]
    ],
    "reading": {
      "title": "Un menu annoncé sans liste d'ingrédients",
      "paragraphs": [
        "Élodie prépare une fête destinée à des amis de plusieurs générations. L'invitation mentionne un repas et indique qu'une option végétarienne pourrait être proposée. Plusieurs invités répondent qu'ils aimeraient participer. Une personne demande toutefois si les ingrédients des plats seront affichés. Élodie réalise que le traiteur n'a pas encore fourni cette information. Elle ne peut donc pas affirmer qu'un plat convient à une contrainte particulière.",
        "Moussa lui conseille de poser deux questions distinctes. La première concerne les choix de repas que les participants souhaitent éventuellement exprimer; la seconde concerne les ingrédients que le traiteur peut effectivement garantir. Élodie prépare un questionnaire facultatif, sans demander des détails personnels inutiles. Elle sait qu'une personne peut préférer un plat pour de nombreuses raisons, et qu'il ne faut pas lui attribuer une préférence en fonction de son origine.",
        "Le traiteur promet de transmettre une liste précise avant la fête. En attendant, Élodie annonce que le menu final n'est pas encore confirmé. Elle distingue le fait qu'une option figure dans l'invitation de la possibilité réelle de répondre aux besoins de chaque invité. Elle prévoit de communiquer les ingrédients vérifiés et de laisser chacun décider librement ce qui lui convient. Cette organisation favorise une participation respectueuse et limite les promesses impossibles à tenir."
      ],
      "questions": [
        [
          "What information has the caterer not supplied?",
          "la liste des ingrédients",
          [
            "la liste des ingrédients",
            "la date de la fête",
            "le nombre de réponses"
          ],
          "The ingredient list remains absent, so suitability cannot be guaranteed."
        ],
        [
          "Why is the preference form voluntary?",
          "pour respecter les choix des invités",
          [
            "pour respecter les choix des invités",
            "pour décider à leur place",
            "pour annuler les repas"
          ],
          "Each invitee can choose what information they wish to share."
        ],
        [
          "Which claim would be premature?",
          "un plat convient certainement à tous",
          [
            "un plat convient certainement à tous",
            "une option a été mentionnée",
            "des personnes ont répondu"
          ],
          "An invitation's proposed option is not a verified universally suitable meal."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Celebration invitation",
        "type": "email",
        "french": "Fête samedi à 18 h, avec repas partagé. Une option végétarienne est envisagée. Merci de répondre si vous souhaitez participer; les détails définitifs du menu suivront."
      },
      {
        "label": "Caterer's current reply",
        "type": "email",
        "french": "Nous préparons plusieurs propositions, mais la liste complète des ingrédients n’est pas encore confirmée. Nous vous communiquerons les plats validés et leurs composants avant l’événement."
      }
    ],
    "comparison": [
      [
        "Which text specifies a start time?",
        "l’invitation",
        [
          "l’invitation",
          "la réponse du traiteur",
          "aucun"
        ],
        "The invitation schedules eighteen hours; the catering reply concerns menu confirmation."
      ],
      [
        "Does either text certify a universally suitable meal?",
        "non",
        [
          "oui",
          "non",
          "tous les invités sont végétariens"
        ],
        "The meal options and ingredients remain provisional."
      ]
    ],
    "listening": [
      [
        "What option does the invitation mention?",
        "un plat végétarien",
        [
          "un plat végétarien",
          "un transport gratuit",
          "un gâteau obligatoire"
        ],
        "Moussa refers to a vegetarian option."
      ],
      [
        "Who will confirm the actual ingredients?",
        "le traiteur",
        [
          "le traiteur",
          "les voisins",
          "le chauffeur"
        ],
        "The caterer must supply reliable ingredient information."
      ],
      [
        "How should guests provide preferences?",
        "librement et volontairement",
        [
          "librement et volontairement",
          "selon une nationalité supposée",
          "en donnant tous leurs dossiers personnels"
        ],
        "Élodie wants to avoid assumptions and unnecessary private details."
      ]
    ],
    "recall": {
      "clozes": [
        [
          "Je ___ transmettrai la liste une fois confirmée. (leur)",
          "leur",
          "Leur is an indirect object pronoun replacing à eux/à elles.",
          "indirect pronoun"
        ],
        [
          "Nous vérifions les ingrédients pour que chacun ___ choisir. (pouvoir)",
          "puisse",
          "Pour que introduces subjunctive puisse for the guests' intended ability.",
          "purpose"
        ]
      ],
      "order": [
        "Le menu reste à confirmer",
        [
          "reste à confirmer",
          "Le menu"
        ],
        "The catered options are still provisional, not guaranteed.",
        "menu status"
      ]
    },
    "writing": {
      "fromListening": [
        "Write a neutral organization update based on the meal-planning conversation.",
        [
          "State the vegetarian option is proposed rather than confirmed.",
          "Name the pending ingredient list.",
          "Explain that guests control their own preference disclosures."
        ],
        "La fête est prévue samedi et plusieurs invités ont déjà répondu. L’invitation mentionne une option végétarienne, mais le traiteur n’a pas encore communiqué les ingrédients exacts. Élodie souhaite connaître les préférences des participants sans supposer leurs choix ou demander des détails personnels inutiles. Une réponse volontaire pourra aider à organiser le repas. Les options définitives seront communiquées après vérification auprès du traiteur. Pour l’instant, il serait incorrect de garantir que tous les invités pourront manger chacun des plats proposés."
      ],
      "fromSources": [
        "Compose a considerate guest update comparing the invitation and catering reply.",
        [
          "Give the actual event time.",
          "Distinguish proposed meal options from confirmed ingredient information.",
          "Invite optional feedback without assuming personal needs."
        ],
        "Bonjour à tous, notre fête aura lieu samedi à dix-huit heures. L’invitation évoquait une option végétarienne, mais le traiteur doit encore confirmer la liste des plats et des ingrédients. Nous partagerons ces informations dès qu’elles seront disponibles pour que chacun puisse faire son choix. Si vous souhaitez nous communiquer une préférence alimentaire utile à l’organisation, vous pouvez le faire volontairement. Aucune explication personnelle n’est demandée. Nous éviterons de promettre un plat précis avant la confirmation du traiteur. Merci pour vos réponses."
      ]
    },
    "oral": {
      "prompt": "Brief the celebration team about what may and may not be promised to guests.",
      "plan": [
        "Name the scheduled event and proposed meal.",
        "Explain why ingredients are not yet guaranteed.",
        "Describe voluntary, individual preference gathering."
      ],
      "model": "La fête est organisée samedi à dix-huit heures. Une option végétarienne apparaît dans l’invitation, mais elle n’est pas encore confirmée avec ses ingrédients. Le traiteur doit envoyer une liste précise. Nous pouvons demander aux invités s’ils souhaitent partager une préférence, sans la déduire de leur origine ni exiger des informations inutiles. Dès que les plats sont confirmés, nous communiquerons les options exactes. Il faut distinguer invitation, proposition et menu validé."
    }
  },
  {
    "id": "transfer-26",
    "title": "Internship interview: evidence, past experience and future goals",
    "goal": "Report a previous project accurately, interpret job requirements and write a measured follow-up.",
    "grammarKeys": [
      "past",
      "report"
    ],
    "vocabulary": [
      [
        "un stage",
        "internship",
        "Je cherche un stage."
      ],
      [
        "une candidature",
        "application",
        "Ma candidature est envoyée."
      ],
      [
        "un entretien",
        "interview",
        "L’entretien dure trente minutes."
      ],
      [
        "une expérience",
        "experience",
        "Cette expérience m’a appris à organiser."
      ],
      [
        "une responsabilité",
        "responsibility",
        "J’avais une responsabilité précise."
      ],
      [
        "une compétence",
        "skill",
        "Je développe mes compétences."
      ],
      [
        "un projet",
        "project",
        "Le projet a été présenté."
      ],
      [
        "une équipe",
        "team",
        "Je travaillais dans une équipe."
      ],
      [
        "un exemple",
        "example",
        "Je donne un exemple concret."
      ],
      [
        "une mission",
        "assignment",
        "Les missions ne sont pas encore attribuées."
      ],
      [
        "un retour",
        "feedback",
        "Je demande un retour."
      ],
      [
        "une décision",
        "decision",
        "La décision sera communiquée plus tard."
      ]
    ],
    "dialogue": [
      [
        "Recruteuse",
        "Dans votre candidature, vous écrivez avoir coordonné un projet étudiant; pourriez-vous expliquer précisément ce que vous avez réalisé vous-même ?",
        "Your application says you coordinated a student project; what exactly did you do?"
      ],
      [
        "Yanis",
        "J’ai organisé les réunions et préparé un calendrier, tandis que d’autres membres ont réalisé les illustrations et vérifié les chiffres.",
        "I organized meetings and timeline while others made illustrations and checked figures."
      ],
      [
        "Recruteuse",
        "Merci d’avoir distingué vos tâches de celles de l’équipe; quelles difficultés avez-vous rencontrées et comment avez-vous réagi ?",
        "Thanks for distinguishing your work; what challenges arose and how did you respond?"
      ],
      [
        "Yanis",
        "Nous attendions une réponse lorsque le lieu a changé, alors j’ai proposé un nouveau calendrier et informé les membres concernés.",
        "We awaited a response when the venue changed; I proposed a revised schedule."
      ],
      [
        "Recruteuse",
        "Nous examinerons votre candidature avec les autres dossiers et vous communiquerons notre décision; cet entretien n’est pas encore une offre de stage.",
        "We'll review applications and communicate a decision; this interview is not an offer."
      ]
    ],
    "reading": {
      "title": "Décrire son rôle sans s'attribuer celui des autres",
      "paragraphs": [
        "Yanis prépare un entretien pour un stage dans une petite organisation. L'annonce mentionne la communication, le travail d'équipe et la capacité à gérer les imprévus. Dans son dossier, Yanis a décrit un projet mené avec d'autres étudiants. Avant l'entretien, il relit le compte rendu pour distinguer ses actions personnelles de celles des autres membres. Il souhaite montrer ses compétences avec des exemples précis plutôt qu'avec des affirmations très générales.",
        "Pendant l'entretien, la recruteuse lui demande ce qu'il a réellement fait. Yanis explique qu'il avait préparé le planning et animé plusieurs réunions. Les illustrations, en revanche, avaient été produites par une autre personne. Lorsque le lieu prévu a été changé, Yanis avait demandé les nouvelles disponibilités avant d'envoyer un programme révisé. Il reconnaît aussi qu'une activité a été reportée et qu'il aurait aimé communiquer plus tôt sur l'incertitude.",
        "À la fin, la recruteuse explique que plusieurs candidatures seront étudiées et qu'aucune décision n'est encore prise. Yanis remercie l'équipe et prépare un message de suivi. Il y rappelle brièvement l'exemple pertinent et son intérêt pour le stage, sans présenter l'entretien comme une promesse d'embauche. Son récit est convaincant parce qu'il attribue clairement les contributions, reconnaît une difficulté et explique ce qu'il a appris."
      ],
      "questions": [
        [
          "Which contribution did Yanis personally make?",
          "le planning et les réunions",
          [
            "le planning et les réunions",
            "toutes les illustrations",
            "tous les calculs"
          ],
          "Yanis names planning and meetings as his own work."
        ],
        [
          "What did Yanis do after the venue changed?",
          "proposer un calendrier révisé",
          [
            "proposer un calendrier révisé",
            "annuler sans informer",
            "terminer le recrutement"
          ],
          "He revised the schedule after collecting new information."
        ],
        [
          "Does the interview confirm a place on the internship?",
          "non",
          [
            "oui",
            "non",
            "il a commencé lundi"
          ],
          "The recruiter still needs to review other applications."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Internship advertisement",
        "type": "notice",
        "french": "Stage en coordination de projets : travail en équipe, communication claire et adaptation aux changements. Les candidatures sont étudiées après entretien; une réponse officielle sera envoyée."
      },
      {
        "label": "Student project summary",
        "type": "minutes",
        "french": "Yanis : planification et animation des réunions. Lina : illustrations. Paul : vérification des données. Un changement de salle a nécessité un programme révisé."
      }
    ],
    "comparison": [
      [
        "Which source attributes a specific task to Yanis?",
        "le compte rendu du projet",
        [
          "le compte rendu du projet",
          "l’annonce du stage",
          "aucun"
        ],
        "Only the student minutes name individual project responsibilities."
      ],
      [
        "What does the advertisement say about the recruitment decision?",
        "elle suivra l’examen des candidatures",
        [
          "elle suivra l’examen des candidatures",
          "elle est automatique",
          "elle a déjà été rendue"
        ],
        "The advertisement says evaluation follows the interview."
      ]
    ],
    "listening": [
      [
        "Which task did Yanis carry out?",
        "organiser les réunions",
        [
          "organiser les réunions",
          "réaliser toutes les illustrations",
          "valider les chiffres"
        ],
        "Yanis explicitly identifies his own planning role."
      ],
      [
        "What unexpected change occurred?",
        "un changement de lieu",
        [
          "un changement de lieu",
          "une fermeture de magasin",
          "une grève de train"
        ],
        "He describes responding to a changed venue."
      ],
      [
        "What does the recruiter clarify about the interview?",
        "ce n’est pas une offre",
        [
          "ce n’est pas une offre",
          "le stage est confirmé",
          "la décision a été envoyée"
        ],
        "She says interviews precede the recruitment decision."
      ]
    ],
    "recall": {
      "clozes": [
        [
          "Nous ___ une réponse quand le lieu a changé. (attendre, imperfect nous)",
          "attendions",
          "Imparfait describes the ongoing wait interrupted by a bounded change.",
          "narrative"
        ],
        [
          "Elle a expliqué que la décision ___ plus tard. (venir, conditional)",
          "viendrait",
          "Reported future from a past viewpoint often becomes conditional viendrait.",
          "reported speech"
        ]
      ],
      "order": [
        "La candidature reste à examiner",
        [
          "reste à examiner",
          "La candidature"
        ],
        "The interview occurred, but evaluation and decision are still pending.",
        "recruitment status"
      ]
    },
    "writing": {
      "fromListening": [
        "Write an objective recap of the interview for a career advisor.",
        [
          "Separate Yanis's contributions from team tasks.",
          "Describe the disruption and response using past tenses.",
          "Record that no internship decision has been made."
        ],
        "Yanis a participé à un entretien pour un stage en coordination de projets. Il a expliqué avoir organisé les réunions et préparé le calendrier d’un projet étudiant. Les illustrations et la vérification des données avaient été réalisées par d’autres membres. Quand la salle prévue a changé, Yanis a proposé un programme révisé et informé les personnes concernées. La recruteuse lui a posé des questions sur ses difficultés et sur les compétences acquises. Elle a indiqué que les candidatures seraient encore examinées. Aucune proposition de stage n’a été confirmée."
      ],
      "fromSources": [
        "Write a professional follow-up referencing the advertisement and your documented responsibilities.",
        [
          "Connect one actual skill to the advertisement.",
          "Attribute teamwork contributions accurately.",
          "Express interest without implying an accepted offer."
        ],
        "Madame, je vous remercie pour notre entretien concernant le stage en coordination de projets. Votre annonce souligne l’importance de la communication et de l’adaptation aux imprévus. Comme nous en avons discuté, j’ai préparé le calendrier et animé les réunions d’un projet étudiant, tandis que mes collègues ont assuré les illustrations et la vérification des données. Lorsque le lieu de l’activité a changé, j’ai coordonné un nouveau programme. Cette expérience m’a appris à communiquer plus clairement lorsque des informations restent incertaines. Je comprends que les candidatures doivent encore être examinées et reste à votre disposition pour toute précision."
      ]
    },
    "oral": {
      "prompt": "Give an evidence-based one-minute explanation of your project role in the internship interview.",
      "plan": [
        "Identify only your own contributions.",
        "Describe an unexpected event and your actual response.",
        "Explain what you learned without claiming an offer."
      ],
      "model": "Dans mon projet étudiant, j’étais responsable du calendrier et de l’organisation des réunions. D’autres membres ont conçu les illustrations et vérifié les données. Quand notre lieu de rencontre a changé, nous avons dû adapter le programme. J’ai proposé de nouvelles dates et communiqué avec l’équipe. Cette expérience m’a appris à clarifier les contraintes avant de promettre une échéance. Je souhaite appliquer ces compétences pendant le stage, mais je sais que le recrutement n’est pas encore terminé."
    }
  },
  {
    "id": "transfer-27",
    "title": "Allocate a limited neighborhood budget fairly",
    "goal": "Compare two proposals, identify non-comparable costs and justify a transparent consultation.",
    "grammarKeys": [
      "compare",
      "concession"
    ],
    "vocabulary": [
      [
        "un budget",
        "budget",
        "Le budget est limité."
      ],
      [
        "une dépense",
        "expense",
        "Chaque dépense doit être expliquée."
      ],
      [
        "un projet",
        "proposal",
        "Deux projets sont présentés."
      ],
      [
        "une subvention",
        "grant",
        "La subvention reste à confirmer."
      ],
      [
        "un banc",
        "bench",
        "Le parc pourrait recevoir un banc."
      ],
      [
        "un arbre",
        "tree",
        "Des arbres sont proposés."
      ],
      [
        "un entretien",
        "maintenance",
        "L’entretien entraîne un coût."
      ],
      [
        "une priorité",
        "priority",
        "La priorité dépend des besoins."
      ],
      [
        "un devis",
        "estimate",
        "Un devis manque."
      ],
      [
        "une consultation",
        "consultation",
        "Les habitants seront consultés."
      ],
      [
        "une décision",
        "decision",
        "La décision n’est pas prise."
      ],
      [
        "un compromis",
        "compromise",
        "Un compromis demande des chiffres fiables."
      ]
    ],
    "dialogue": [
      [
        "Lila",
        "Le quartier dispose d’un budget limité et deux groupes proposent des projets différents : installer des bancs ou planter davantage d’arbres.",
        "The neighborhood has a limited budget and two groups propose benches or trees."
      ],
      [
        "Karim",
        "Le devis des bancs inclut l’installation, mais celui des arbres ne précise pas les frais d’entretien; les coûts ne sont donc pas directement comparables.",
        "The bench quote includes installation; the tree quote omits maintenance."
      ],
      [
        "Lila",
        "Certes, davantage d’ombre serait utile, mais nous devons comprendre les besoins des habitants et le coût total avant de choisir.",
        "More shade would help, but we need community preferences and full costs."
      ],
      [
        "Karim",
        "Nous pourrions demander un devis complété et organiser une consultation qui présente les avantages ainsi que les limites des deux options.",
        "We could request a full quote and consult residents with balanced information."
      ],
      [
        "Lila",
        "Je rédigerai une synthèse claire; aucune des deux propositions ne doit être annoncée comme votée tant que la décision reste ouverte.",
        "I'll summarize without declaring either proposal approved."
      ]
    ],
    "reading": {
      "title": "Deux bonnes idées, des chiffres encore incomplets",
      "paragraphs": [
        "Une association de quartier reçoit une petite somme destinée à améliorer les espaces publics. Un premier groupe propose d'installer plusieurs bancs dans le parc. Un deuxième souhaite planter des arbres pour créer des zones d'ombre. Les habitants reconnaissent que les deux projets pourraient apporter des avantages, mais les ressources disponibles ne permettront probablement pas de tout réaliser immédiatement. Une décision devra donc prendre en compte les besoins et les coûts.",
        "Karim examine les documents. Le devis des bancs comprend le prix et l'installation, tandis que celui des arbres précise seulement l'achat des végétaux. Il manque les frais possibles d'entretien et de préparation du terrain. Comparer directement les montants affichés pourrait conduire à une conclusion trompeuse. Le groupe demande donc une estimation plus complète et prévoit de discuter des critères qui comptent vraiment pour les usagers du parc.",
        "Lila rédige un résumé pour les habitants. Elle présente les arguments en faveur de chaque projet sans affirmer que l'un est toujours meilleur. Les bancs offriraient des places pour s'asseoir, alors que les arbres pourraient améliorer le confort pendant les journées chaudes. Elle recommande de recueillir les avis et d'obtenir des devis comparables. Le budget ne sera engagé qu'après une décision claire. Cette démarche permet de distinguer préférence personnelle, information financière et choix collectif."
      ],
      "questions": [
        [
          "Which estimate lacks maintenance costs?",
          "celui des arbres",
          [
            "celui des arbres",
            "celui des bancs",
            "les deux sont complets"
          ],
          "The tree proposal omits ongoing maintenance."
        ],
        [
          "Why can't the prices be compared directly?",
          "les dépenses couvertes diffèrent",
          [
            "les dépenses couvertes diffèrent",
            "aucun projet n’existe",
            "les bancs sont gratuits"
          ],
          "One quote includes installation while the other lacks full cost scope."
        ],
        [
          "What is the agreed process?",
          "compléter les devis et consulter",
          [
            "compléter les devis et consulter",
            "adopter immédiatement les arbres",
            "annuler le parc"
          ],
          "A better estimate and consultation precede a final vote."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Bench proposal estimate",
        "type": "data",
        "french": "Projet bancs : devis de 1 800 € comprenant l’achat et l’installation des bancs. Les besoins futurs d’entretien devront être suivis dans le programme du parc."
      },
      {
        "label": "Tree planting proposal estimate",
        "type": "data",
        "french": "Projet arbres : 1 250 € pour l’achat des plants. Les frais de préparation du terrain et d’entretien ne figurent pas encore dans cette estimation."
      }
    ],
    "comparison": [
      [
        "Which estimate includes installation?",
        "le devis des bancs",
        [
          "le devis des bancs",
          "le devis des arbres",
          "aucun"
        ],
        "The bench figure expressly includes purchase and installation."
      ],
      [
        "Can the lower listed tree amount be called the cheaper total project?",
        "non",
        [
          "oui",
          "non",
          "les arbres ne coûtent rien"
        ],
        "Missing preparation and maintenance costs prevent a total-cost ranking."
      ]
    ],
    "listening": [
      [
        "What are the competing proposals?",
        "des bancs et des arbres",
        [
          "des bancs et des arbres",
          "des livres et des vélos",
          "deux restaurants"
        ],
        "Lila names benches and tree planting."
      ],
      [
        "What cost is missing from the tree estimate?",
        "l’entretien",
        [
          "l’entretien",
          "le prix des plants",
          "la livraison d’un livre"
        ],
        "Karim notes the omitted tree maintenance."
      ],
      [
        "What will the group do before choosing?",
        "demander des devis comparables et consulter",
        [
          "demander des devis comparables et consulter",
          "attribuer les fonds immédiatement",
          "annuler la consultation"
        ],
        "The group plans a completed estimate and community input."
      ]
    ],
    "recall": {
      "clozes": [
        [
          "Le devis des arbres semble moins élevé ___ celui des bancs.",
          "que",
          "Moins ... que compares the displayed amounts, not verified full costs.",
          "comparison"
        ],
        [
          "Bien que les deux projets ___ utiles, il faut choisir. (être)",
          "soient",
          "Bien que takes plural subjunctive soient for two projects.",
          "concession"
        ]
      ],
      "order": [
        "Les coûts restent à compléter",
        [
          "restent à compléter",
          "Les coûts"
        ],
        "The estimates have different scope and are not yet comparable.",
        "financial comparison"
      ]
    },
    "writing": {
      "fromListening": [
        "Write a neutral meeting recap distinguishing benefits, quotes and pending decision.",
        [
          "Name both projects and their plausible benefits.",
          "Describe missing costs without inventing amounts.",
          "Recommend a concrete comparison and consultation before voting."
        ],
        "Deux projets ont été présentés pour améliorer le parc : installer des bancs et planter davantage d’arbres. Les bancs pourraient offrir des places pour se reposer, tandis que les arbres créeraient plus d’ombre. Le devis des bancs inclut l’installation, mais l’estimation des arbres ne couvre pas certains frais d’entretien. Les montants publiés ne permettent donc pas encore une comparaison complète. Le groupe proposera de demander des chiffres comparables et de consulter les habitants. Aucune décision définitive sur l’utilisation du budget n’a été prise."
      ],
      "fromSources": [
        "Compose an evidence-grounded public comparison of the two project estimates.",
        [
          "Report 1,800 and 1,250 euros with what each includes.",
          "Explain why a lower listed figure is not necessarily a lower full cost.",
          "Ask for further figures and participation without implying an approved winner."
        ],
        "Bonjour, deux projets sont envisagés pour notre parc. Le devis des bancs s’élève à mille huit cents euros et comprend leur achat ainsi que l’installation. La proposition concernant les arbres mentionne mille deux cent cinquante euros pour les plants, mais elle ne précise pas encore les frais de préparation et d’entretien. Il serait donc prématuré d’affirmer que ce deuxième projet coûtera moins cher au total. Nous demanderons des estimations complètes avant de consulter les habitants sur leurs besoins. Aucun choix définitif n’a encore été voté."
      ]
    },
    "oral": {
      "prompt": "Explain the budget trade-off without ranking projects from incomplete prices.",
      "plan": [
        "Describe each project's use and published estimate.",
        "Identify omitted costs and why they matter.",
        "Suggest a fair decision process."
      ],
      "model": "Le quartier dispose d’un budget limité. Les bancs offriraient des places assises et leur devis annoncé est de mille huit cents euros, installation comprise. Les arbres pourraient apporter de l’ombre, mais le montant de mille deux cent cinquante euros ne comprend pas encore tous les frais. Nous ne pouvons donc pas comparer les coûts totaux de manière fiable. Je recommande de compléter les devis, de consulter les habitants et de choisir ensuite selon des critères clairs."
    }
  }
];
export const U14_25_27=Object.freeze(SOURCE.map((record,i)=>authorU14Scenario(record,25+i)));
