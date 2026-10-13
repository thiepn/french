import {originalB2DebateProduction,type U21OriginalSourceStory} from './u21-content-helper.ts';
const SOURCE:readonly U21OriginalSourceStory[]=[
  {
    "id": "transfer-139",
    "title": "School air-quality experiments: replication instead of headlines",
    "goal": "Compare measurements collected under different conditions, explain reproducibility and draft a fair correction.",
    "grammarKeys": [
      "source",
      "concession"
    ],
    "vocabulary": [
      [
        "un capteur",
        "sensor",
        "Le capteur mesure l'air près de la fenêtre."
      ],
      [
        "une mesure",
        "measurement",
        "La mesure a eu lieu à midi."
      ],
      [
        "un protocole",
        "protocol",
        "Le protocole exige une heure fixe."
      ],
      [
        "une répétition",
        "repeat",
        "La répétition réduit une erreur possible."
      ],
      [
        "un étalonnage",
        "calibration",
        "L'étalonnage n'a pas été noté."
      ],
      [
        "une concentration",
        "concentration",
        "La concentration varie selon le lieu."
      ],
      [
        "une fenêtre",
        "window",
        "La fenêtre était ouverte mercredi."
      ],
      [
        "un graphique",
        "chart",
        "Le graphique confond plusieurs jours."
      ],
      [
        "un biais",
        "bias",
        "Le biais vient d'horaires différents."
      ],
      [
        "une comparaison",
        "comparison",
        "La comparaison doit être justifiée."
      ],
      [
        "un résultat",
        "result",
        "Le résultat ne prouve pas une cause."
      ],
      [
        "une hypothèse",
        "hypothesis",
        "L'hypothèse sera examinée ensuite."
      ]
    ],
    "dialogue": [
      [
        "Lila",
        "Notre affiche affirme que la nouvelle ventilation a diminué la pollution de moitié en trois jours.",
        "Their poster claims pollution was halved in three days."
      ],
      [
        "Sofiane",
        "Les mesures avant travaux ont été prises dehors à huit heures, celles d'après dans la classe à midi.",
        "Before and after were measured at different places and times."
      ],
      [
        "Lila",
        "Les élèves ont travaillé longtemps; je ne veux pas nier leurs observations.",
        "She values the students' effort."
      ],
      [
        "Sofiane",
        "Reconnaître le travail ne signifie pas accepter une comparaison impossible.",
        "Effort does not validate a non-comparable comparison."
      ],
      [
        "Lila",
        "En plus, le dossier n'indique aucun étalonnage du capteur emprunté.",
        "The borrowed sensor lacks a calibration record."
      ],
      [
        "Sofiane",
        "Si nous répétons les mesures aux mêmes heures et aux mêmes endroits, nous comprendrons mieux les écarts.",
        "He proposes a controlled repeat."
      ],
      [
        "Lila",
        "Pourrions-nous conserver les graphiques comme observations exploratoires ?",
        "They can retain the graphs as exploratory data."
      ],
      [
        "Sofiane",
        "Oui, à condition de nommer les différences de protocole et d'éviter une conclusion causale.",
        "They must disclose method differences and avoid causal claims."
      ],
      [
        "Lila",
        "Je remplacerai le titre par une question ouverte et nous publierons le nouveau protocole.",
        "They will correct the headline and publish the method."
      ]
    ],
    "paragraphs": [
      "Une équipe d'élèves étudie la qualité de l'air autour de son école et présente une affiche annonçant que la nouvelle ventilation a réduit de moitié une concentration mesurée. Lila admire la créativité des participants et souhaite afficher leurs résultats au prochain conseil. Sofiane examine pourtant les carnets de mesures. Avant les travaux, les élèves ont utilisé un capteur à huit heures près de la rue; après les travaux, ils ont mesuré l'air à midi dans une salle dont la fenêtre était ouverte. Le graphique réunit ces nombres sous la même étiquette, alors qu'ils n'ont pas été obtenus dans des conditions comparables.",
      "Les élèves possèdent bien des observations, mais elles ne permettent pas encore de conclure que la ventilation a causé la baisse annoncée. Le carnet ne décrit pas l'étalonnage du capteur, et la variation entre le matin et midi peut avoir d'autres explications. Certains parents demandent une réponse rapide sur l'environnement de l'école; d'autres craignent que la correction n'humilie les élèves. Sofiane précise qu'une démarche scientifique solide peut montrer ses erreurs de méthode et apprendre à les corriger. Personne n'a besoin d'inventer une mesure officielle ni de transformer une première exploration en certificat de sécurité.",
      "Lila propose une nouvelle campagne: mêmes points de mesure, horaires répétés, fenêtres et conditions notées, et vérification des instruments disponibles. Les graphiques initiaux seront conservés avec la mention « données exploratoires non comparables ». La classe publiera ensuite les valeurs, les limites et les résultats des répétitions, même si ceux-ci ne confirment pas l'hypothèse. Le conseil pourra alors discuter des mesures utiles sans attribuer prématurément un effet précis à la ventilation. Cette révision n'efface pas les efforts des élèves; elle leur permet de défendre un raisonnement plutôt qu'un slogan."
    ],
    "readingTitle": "Un bon travail, mais pas encore une preuve",
    "evidence": [
      {
        "label": "Student exhibition poster",
        "type": "poster",
        "french": "La ventilation a réduit la pollution de moitié en trois jours. Graphique comparant 08:00 extérieur avant travaux et 12:00 salle intérieure après travaux; le protocole, les fenêtres et le contrôle de capteur ne sont pas affichés."
      },
      {
        "label": "Lab notebook of observations",
        "type": "data",
        "french": "Avant: mesures extérieures vers 08:00, près de la rue. Après: intérieur à midi, fenêtre ouverte. Étape d'étalonnage non documentée, nombre de répétitions insuffisant pour attribuer une cause. Résultat décrit comme exploratoire."
      }
    ],
    "reading": [
      [
        "Where were the pre-installation measurements made?",
        "près de la rue",
        "dans le gymnase",
        "au laboratoire municipal",
        "The initial readings were collected outside near the road."
      ],
      [
        "What calibration detail is missing?",
        "l'étalonnage du capteur",
        "la présence des élèves",
        "le numéro du local",
        "No calibration step was documented for the borrowed instrument."
      ],
      [
        "What is the revised status of the first graphs?",
        "des données exploratoires",
        "une certification officielle",
        "une preuve causale",
        "The initial non-comparable observations remain exploratory evidence."
      ]
    ],
    "compare": [
      [
        "Which document makes the halving claim?",
        "l'affiche",
        "le carnet",
        "aucun document",
        "The exhibition poster states the unjustified headline."
      ],
      [
        "Which source reveals the changed measurement conditions?",
        "le carnet",
        "l'affiche seule",
        "les deux valident la cause",
        "The notebook contains the locations, times and missing calibration procedure."
      ]
    ],
    "listen": [
      [
        "What improvement does the poster claim?",
        "une baisse de moitié",
        "une disparition totale",
        "une hausse constante",
        "Lila quotes a halving of concentration, which remains unproven."
      ],
      [
        "When were the before measurements taken?",
        "à huit heures",
        "à midi",
        "à vingt heures",
        "Sofiane identifies the initial morning readings."
      ],
      [
        "Where were the after measurements taken?",
        "dans la classe",
        "dans la rue",
        "au parking",
        "The after readings occurred inside the classroom."
      ],
      [
        "What was not recorded?",
        "l'étalonnage",
        "la température du déjeuner",
        "le nom des parents",
        "Lila notes that no calibration was documented for the borrowed sensor."
      ],
      [
        "What must a repeat keep stable?",
        "les horaires et les lieux",
        "la couleur du graphique",
        "le titre de l'affiche",
        "Sofiane asks for the same times and locations to support meaningful comparisons."
      ],
      [
        "How will Lila alter the poster?",
        "avec une question ouverte",
        "avec une preuve officielle",
        "sans graphiques",
        "She will replace the causal claim with a question and disclose the new procedure."
      ]
    ],
    "clozes": [
      [
        "Bien que l'équipe ___ des données, elle ne prouve pas la cause. (avoir)",
        "ait",
        "Concession after bien que requires the subjunctive ait.",
        "concession"
      ],
      [
        "D'après le carnet, les mesures ___ dans des lieux différents. (être, imparfait)",
        "étaient",
        "An attributed methodological description calls for the past state étaient.",
        "source attribution"
      ]
    ],
    "order": [
      "Les résultats restent exploratoires",
      [
        "restent exploratoires",
        "Les résultats"
      ],
      "Non-comparable data should be disclosed as exploratory observations.",
      "scientific inference"
    ],
    "writing": {
      "listening": [
        "Write a fair account of the students' discussion without treating a draft hypothesis as confirmed.",
        "Lila et Sofiane examinent une affiche qui attribue à la ventilation une baisse de pollution de moitié. Sofiane souligne que les mesures comparées n'ont pas été prises aux mêmes heures ni dans les mêmes lieux. Le carnet ne mentionne pas non plus l'étalonnage du capteur. Lila veut reconnaître le travail des élèves tout en corrigeant le titre. Ils décident de conserver les graphiques comme explorations et de répéter les observations selon un protocole commun. Aucune conclusion sur la sécurité de l'air n'est encore justifiée."
      ],
      "sources": [
        "Prepare a scientific correction note distinguishing the poster and notebook.",
        "L'affiche scolaire annonce que la ventilation a divisé la pollution par deux. Le carnet de laboratoire montre cependant que les données initiales proviennent de la rue à huit heures, tandis que les données suivantes ont été recueillies dans une salle à midi. Le capteur n'a pas fait l'objet d'un étalonnage documenté. Ces différences empêchent de déduire un effet causal fiable à partir du graphique actuel. Le premier travail mérite d'être conservé sous l'étiquette « observation exploratoire ». Un nouveau protocole devra fixer les lieux, les horaires et les répétitions."
      ],
      "debate": [
        "Defend a reproducible experiment against pressure to announce a reassuring outcome.",
        "Je recommande de modifier le titre de l'affiche avant sa présentation publique. Les familles souhaitent une réponse claire, et je comprends qu'une annonce rassurante puisse paraître utile. Mais il serait trompeur de déclarer une baisse de moitié à partir de mesures collectées dans des lieux et à des heures différents. Les élèves peuvent expliquer ce qu'ils ont réellement observé, puis organiser des répétitions comparables. Si de nouveaux résultats cohérents apparaissent, la classe pourra discuter de leur interprétation. La confiance se construit aussi en reconnaissant ce qui reste incertain."
      ]
    },
    "oral": [
      "Explain in French why inconsistent measurements cannot demonstrate causation.",
      "Les élèves ont enregistré des valeurs intéressantes, mais les mesures avant et après ne sont pas comparables. Les horaires, les lieux et l'état des fenêtres ont changé. Il manque aussi des informations sur l'étalonnage. Je proposerais de répéter l'expérience dans des conditions stables, puis de publier les écarts observés. Ce n'est qu'après cette vérification qu'une conclusion prudente pourra être discutée."
    ]
  },
  {
    "id": "transfer-140",
    "title": "The accessible transit map: advertised routes and actual service restrictions",
    "goal": "Contrast accessibility symbols with dated lift outages and plan a conditional, respectful journey.",
    "grammarKeys": [
      "condition",
      "relative"
    ],
    "vocabulary": [
      [
        "un ascenseur",
        "lift",
        "L'ascenseur est hors service."
      ],
      [
        "un itinéraire",
        "route",
        "L'itinéraire dépend de l'accès."
      ],
      [
        "une correspondance",
        "transfer",
        "La correspondance nécessite un ascenseur."
      ],
      [
        "une rampe",
        "ramp",
        "La rampe est disponible sur demande."
      ],
      [
        "un quai",
        "platform",
        "Le quai opposé n'est pas accessible."
      ],
      [
        "une panne",
        "breakdown",
        "La panne a commencé mardi."
      ],
      [
        "un pictogramme",
        "icon",
        "Le pictogramme ne décrit pas une panne."
      ],
      [
        "une déviation",
        "detour",
        "La déviation allonge le trajet."
      ],
      [
        "une assistance",
        "assistance",
        "L'assistance demande une réservation."
      ],
      [
        "un avis",
        "notice",
        "L'avis porte une date récente."
      ],
      [
        "une alternative",
        "alternative",
        "Une alternative doit être confirmée."
      ],
      [
        "un accès",
        "access",
        "L'accès varie selon la direction."
      ]
    ],
    "dialogue": [
      [
        "Maya",
        "La carte imprime un symbole d'accessibilité à la station Victor-Hugo.",
        "The map shows an accessible symbol at Victor-Hugo station."
      ],
      [
        "Olivier",
        "L'avis de service annonce pourtant une panne d'ascenseur sur le quai vers le centre depuis mardi.",
        "The service notice reports a lift outage on one platform."
      ],
      [
        "Maya",
        "Je dois rejoindre la bibliothèque demain et la carte me proposait cette correspondance.",
        "Maya needs a reliable transfer tomorrow."
      ],
      [
        "Olivier",
        "Le symbole décrit l'installation normale; il ne garantit pas l'accès pendant une panne.",
        "The standard map is not live service status."
      ],
      [
        "Maya",
        "Le document mentionne une rampe, mais seulement avec une réservation préalable.",
        "The ramp needs advance booking."
      ],
      [
        "Olivier",
        "N'affirmons donc pas qu'une autre ligne est accessible avant de vérifier sa direction et son horaire.",
        "Alternative accessibility must be checked."
      ],
      [
        "Maya",
        "Pourrions-nous appeler le service et demander une confirmation écrite de l'assistance ?",
        "They could obtain an explicit service confirmation."
      ],
      [
        "Olivier",
        "Oui, puis conserver une autre possibilité si l'équipement reste indisponible demain.",
        "They will retain a fallback if the outage continues."
      ],
      [
        "Maya",
        "Je partagerai un itinéraire conditionnel, avec la date de l'avis et un contact pour vérifier.",
        "Maya will share dated, conditional travel information."
      ]
    ],
    "paragraphs": [
      "Maya prépare un déplacement à la bibliothèque et utilise un plan de transport où la station Victor-Hugo porte un pictogramme d'accessibilité. Ce symbole signifie qu'en situation normale la station dispose d'un équipement adapté. Il ne montre cependant pas les pannes du jour. Olivier consulte un avis de service récent: depuis mardi, l'ascenseur du quai vers le centre est indisponible. L'autre direction n'est pas nécessairement concernée. Maya comprend alors qu'un itinéraire généré à partir de la carte peut échouer au moment de changer de ligne. Pour elle, une information approximative signifie bien davantage qu'un léger détour.",
      "Le site du réseau évoque aussi une assistance avec rampe, mais l'avis précise qu'une réservation est requise. Aucun des documents ne garantit que cette aide sera disponible à l'heure de Maya. Olivier refuse donc de proposer immédiatement une correspondance alternative comme solution certaine. Une autre station peut avoir une sortie accessible dans un sens et un escalier obligatoire dans l'autre. La description des infrastructures, l'état actuel du service et la confirmation d'une assistance constituent trois informations différentes. Les usagers devraient pouvoir les distinguer sans devoir deviner les limites cachées d'un simple pictogramme.",
      "Maya contacte le service de transport afin de demander un parcours adapté pour le lendemain, avec un horaire d'assistance réellement confirmé. Elle prépare une seconde option qui ne sera retenue qu'après vérification des arrêts et de la direction. Dans son message à la bibliothèque, elle indique qu'elle arrivera selon les informations disponibles au moment du trajet. Olivier propose de signaler la différence entre carte permanente et avis temporaire dans le guide de quartier. Leur échange montre qu'une communication accessible ne consiste pas à multiplier les symboles: elle doit donner des conditions, des contacts et des informations actualisées."
    ],
    "readingTitle": "Un pictogramme ne remplace pas un avis de service",
    "evidence": [
      {
        "label": "Printed network accessibility map",
        "type": "poster",
        "french": "Station Victor-Hugo indiquée accessible grâce à des ascenseurs permanents. La carte représente les équipements ordinaires et ne contient ni état en temps réel ni garantie de fonctionnement le lendemain."
      },
      {
        "label": "Dated accessibility service bulletin",
        "type": "notice",
        "french": "Depuis mardi: ascenseur du quai vers le centre indisponible. Une rampe ou une assistance peut être proposée avec réservation préalable et confirmation du service. L'état de la panne pourra changer; consulter le bulletin à jour."
      }
    ],
    "reading": [
      [
        "Which direction has the reported outage?",
        "vers le centre",
        "vers la campagne",
        "les deux directions officiellement",
        "The bulletin restricts the outage to the platform heading towards the centre."
      ],
      [
        "What must happen before using the assistance ramp?",
        "une réservation confirmée",
        "une simple consultation de la carte",
        "aucune démarche",
        "The availability of assisted boarding is conditional on advance confirmation."
      ],
      [
        "What is Maya's next action?",
        "contacter le service de transport",
        "annoncer une arrivée certaine",
        "ignorer le bulletin",
        "Maya seeks a confirmed itinerary before committing to an arrival time."
      ]
    ],
    "compare": [
      [
        "Which document describes permanent accessibility facilities?",
        "la carte",
        "le bulletin de panne",
        "aucun des deux",
        "The printed map depicts infrastructure in normal operation."
      ],
      [
        "Which source reports a dated lift outage?",
        "le bulletin",
        "la carte imprimée",
        "les deux garantissent un accès complet",
        "Only the dated service notice contains the lift fault detail."
      ]
    ],
    "listen": [
      [
        "Which station appears accessible on the map?",
        "Victor-Hugo",
        "Belleville",
        "République",
        "Maya identifies the accessible icon at Victor-Hugo."
      ],
      [
        "What equipment is currently out of service?",
        "un ascenseur",
        "une rame",
        "un distributeur",
        "Olivier cites the lift outage for one platform."
      ],
      [
        "Since when has it been broken?",
        "mardi",
        "vendredi",
        "dimanche",
        "The notice identifies Tuesday as the reported start date."
      ],
      [
        "What does the ramp require?",
        "une réservation préalable",
        "un nouveau billet",
        "un horaire sans condition",
        "Maya says the assistance ramp requires prior booking."
      ],
      [
        "What does Maya want in writing?",
        "une confirmation d'assistance",
        "une carte ancienne",
        "un reçu de restaurant",
        "She wants written confirmation from the transport service."
      ],
      [
        "What will she share with others?",
        "un itinéraire conditionnel",
        "une garantie générale",
        "un trajet sans horaires",
        "The proposed route must include the notice date and means of verification."
      ]
    ],
    "clozes": [
      [
        "Si l'ascenseur reste en panne, nous ___ un autre parcours. (chercher, futur)",
        "chercherons",
        "A real future condition takes present after si and future in the main clause.",
        "condition"
      ],
      [
        "La station ___ figure sur la carte n'est pas toujours accessible. (relative pronoun)",
        "qui",
        "Qui functions as the subject of figure within this relative clause.",
        "relative"
      ]
    ],
    "order": [
      "L'assistance exige une confirmation",
      [
        "exige une confirmation",
        "L'assistance"
      ],
      "A standard accessibility symbol cannot guarantee assistance during an outage.",
      "access planning"
    ],
    "writing": {
      "listening": [
        "Summarize the conversation without guaranteeing that the suggested transfer will work.",
        "Maya souhaite rejoindre une bibliothèque en transport collectif. La carte indique que la station Victor-Hugo dispose d'ascenseurs, mais Olivier cite un bulletin annonçant la panne du quai vers le centre. Une rampe existe peut-être, à condition de réserver une assistance. Les interlocuteurs ne savent pas si cet équipement sera disponible demain. Maya contactera donc le réseau pour confirmer un itinéraire adapté et préparera une alternative. Elle partagera les dates des informations consultées et un moyen de vérifier les changements."
      ],
      "sources": [
        "Compose a clear accessibility advisory with distinct source roles.",
        "La carte officielle du réseau signale des équipements d'accessibilité à Victor-Hugo dans les conditions normales. Un bulletin plus récent précise toutefois que l'ascenseur du quai vers le centre est hors service depuis mardi. Une assistance peut être demandée à l'avance, sans garantie automatique à toutes les heures. Les voyageurs concernés sont invités à contacter le service pour vérifier leur direction, les réservations et les accès disponibles. Un autre itinéraire ne devrait pas être présenté comme accessible tant que son parcours réel n'a pas été confirmé."
      ],
      "debate": [
        "Argue for conditional travel information rather than relying on permanent map icons.",
        "Je recommande de publier les avis de panne datés à côté des pictogrammes permanents. Certaines personnes apprécient la simplicité d'une carte stable, mais une image seule ne suffit pas à préparer un déplacement accessible. Pour Maya, une correspondance impossible peut remettre en cause toute la visite. La communication devrait distinguer le réseau habituel, les restrictions actuelles et l'assistance confirmée. Si le service répare l'ascenseur, l'avis pourra être actualisé. Tant que la panne persiste, il faut proposer un contact fiable et des options vérifiables, sans promettre un parcours inaccessible."
      ]
    },
    "oral": [
      "Politely explain a conditional accessible route using an up-to-date bulletin.",
      "La carte présente Victor-Hugo comme accessible, mais le bulletin récent annonce une panne d'ascenseur vers le centre. Pourriez-vous vérifier auprès du service si une assistance est possible à votre heure de passage ? Il faut obtenir une confirmation avant de compter sur la rampe. Je préparerais aussi une autre correspondance vérifiée. Je ne peux pas garantir ce trajet tant que les conditions de demain restent inconnues."
    ]
  },
  {
    "id": "transfer-141",
    "title": "Drought forecasts, farm records and conditional water sharing",
    "goal": "Distinguish a seasonal forecast from measured soil moisture and negotiate an equitable monitoring proposal.",
    "grammarKeys": [
      "future",
      "compare"
    ],
    "vocabulary": [
      [
        "une sécheresse",
        "drought",
        "La sécheresse menace les cultures."
      ],
      [
        "un sol",
        "soil",
        "Le sol reste humide à vingt centimètres."
      ],
      [
        "une sonde",
        "probe",
        "La sonde doit être vérifiée."
      ],
      [
        "une prévision",
        "forecast",
        "La prévision concerne le mois prochain."
      ],
      [
        "une réserve d'eau",
        "water reserve",
        "La réserve d'eau n'est pas infinie."
      ],
      [
        "une parcelle",
        "field",
        "La parcelle sud reçoit moins d'eau."
      ],
      [
        "un prélèvement",
        "withdrawal",
        "Le prélèvement est consigné dans le registre."
      ],
      [
        "un partage",
        "sharing",
        "Le partage nécessite un accord."
      ],
      [
        "une culture",
        "crop",
        "Cette culture supporte mal le manque d'eau."
      ],
      [
        "une priorité",
        "priority",
        "La priorité dépend des besoins mesurés."
      ],
      [
        "un arrosage",
        "irrigation",
        "L'arrosage sera adapté aux relevés."
      ],
      [
        "une marge",
        "margin",
        "La marge d'incertitude est présentée."
      ]
    ],
    "dialogue": [
      [
        "Camille",
        "La brochure affirme que les champs manqueront d'eau dès lundi à cause de la sécheresse annoncée.",
        "The brochure predicts certain drought from Monday."
      ],
      [
        "Yanis",
        "Pourtant le bulletin régional parle d'un risque saisonnier, pas d'une certitude sur chaque parcelle.",
        "The forecast is probabilistic, not a site-specific guarantee."
      ],
      [
        "Camille",
        "Les sondes du nord signalent un sol sec, mais les relevés du sud sont incomplets.",
        "Northern probes are dry; southern data are incomplete."
      ],
      [
        "Yanis",
        "Une sonde n'a pas été vérifiée depuis le printemps; gardons cette limite dans le rapport.",
        "One instrument has not been checked since spring."
      ],
      [
        "Camille",
        "Deux exploitations se disputent déjà la réserve commune pour leurs cultures.",
        "Two farms dispute the shared water reserve."
      ],
      [
        "Yanis",
        "Au lieu de promettre une quantité fixe, nous pourrions fixer des dates de mesure comparables.",
        "They could agree on comparable monitoring dates."
      ],
      [
        "Camille",
        "Et mentionner les besoins particuliers des cultures avant de répartir l'arrosage.",
        "Crop needs should inform any allocation."
      ],
      [
        "Yanis",
        "Si les valeurs et la météo changent, la décision devra être réexaminée avec les exploitants.",
        "Allocation must be revisited if observations change."
      ],
      [
        "Camille",
        "Je proposerai un calendrier provisoire et publierai les inconnues, sans annoncer une pénurie certaine.",
        "Camille will propose a provisional plan without guaranteeing a shortage."
      ]
    ],
    "paragraphs": [
      "Deux exploitations agricoles utilisent une réserve d'eau commune et préparent leur calendrier d'arrosage. Après plusieurs semaines chaudes, une brochure locale annonce une pénurie certaine dès lundi. Camille comprend l'inquiétude des cultivateurs, mais Yanis lit le bulletin régional: il décrit une probabilité accrue de sécheresse pendant la saison, sans affirmer que toutes les parcelles manqueront d'eau le même jour. Les relevés disponibles portent sur quelques points de mesure au nord. Les données du sud sont incomplètes et une sonde n'a pas fait l'objet d'un contrôle récent. Il faut donc distinguer une prévision, une mesure locale et une décision de répartition.",
      "Les exploitants cultivent des plantes dont les besoins ne sont pas identiques. L'un souhaite réserver l'eau immédiatement pour sécuriser sa récolte; l'autre estime que le sol de sa parcelle reste suffisamment humide. Les deux demandes peuvent être compréhensibles sans être également documentées. Camille vérifie les dates des prélèvements inscrits dans le registre, et Yanis suggère de comparer l'humidité aux mêmes profondeurs à des heures connues. Ils ne disposent pas d'autorité pour garantir un volume d'eau à chaque exploitation. Une promesse irrévocable risquerait d'ignorer un changement météorologique ou une erreur de mesure.",
      "Une réunion aboutit à un projet de suivi partagé. Chaque exploitation pourra présenter ses besoins, vérifier le fonctionnement des sondes et consulter un relevé commun daté. Les participants discuteront ensuite d'un calendrier provisoire, révisable si les conditions évoluent. Le compte rendu distinguera le risque annoncé par le bulletin régional des observations effectivement réalisées sur les parcelles. Personne ne déclarera la pénurie certaine à partir d'une prévision générale. La démarche ne règle pas à elle seule les conflits de ressources, mais elle remplace une opposition de slogans par des informations comparables et des décisions transparentes."
    ],
    "readingTitle": "Une prévision n'est pas une pénurie déjà mesurée",
    "evidence": [
      {
        "label": "Seasonal regional drought outlook",
        "type": "article",
        "french": "Le risque de sécheresse est supérieur à la normale pour les semaines à venir; ce bulletin régional ne prévoit pas de date certaine de pénurie pour chaque exploitation ni de volume local disponible."
      },
      {
        "label": "Farm soil-monitoring register",
        "type": "data",
        "french": "Les relevés du nord indiquent un sol plus sec aux points visités; les mesures du sud restent incomplètes. Une sonde n'est pas contrôlée depuis le printemps. Les dates de prélèvement d'eau sont consignées séparément des prévisions régionales."
      }
    ],
    "reading": [
      [
        "Does the bulletin guarantee a shortage next Monday?",
        "non",
        "oui, pour chaque parcelle",
        "uniquement dans le sud",
        "The outlook reports higher seasonal risk, not a dated certainty."
      ],
      [
        "Which part of the farm measurements is incomplete?",
        "le sud",
        "le nord",
        "toutes les dates de prélèvement",
        "The monitoring register states that the southern measurements are incomplete."
      ],
      [
        "What allocation approach is proposed?",
        "un calendrier provisoire révisable",
        "une quantité irrévocable",
        "l'absence de toute mesure",
        "The group will reassess sharing after comparable measurements and discussion."
      ]
    ],
    "compare": [
      [
        "Which source reports regional seasonal risk?",
        "le bulletin",
        "le registre",
        "aucun des deux",
        "The regional outlook speaks about seasonal risk without local guarantees."
      ],
      [
        "Which source documents an unchecked probe?",
        "le registre",
        "le bulletin",
        "les deux prouvent une panne",
        "The farm log records that a soil probe has not been checked since spring."
      ]
    ],
    "listen": [
      [
        "When does the brochure predict shortage?",
        "dès lundi",
        "dans un an",
        "à la fin de l'hiver",
        "Camille reports the brochure's Monday claim as an assertion under review."
      ],
      [
        "What does the regional report actually present?",
        "un risque saisonnier",
        "une date certaine pour tous",
        "une réserve garantie",
        "Yanis distinguishes a probability forecast from a guaranteed shortage."
      ],
      [
        "Which area's measurements are incomplete?",
        "le sud",
        "le nord",
        "le village entier",
        "Camille identifies incomplete records on the southern plots."
      ],
      [
        "What has not been checked since spring?",
        "une sonde",
        "la réserve commune",
        "toutes les cultures",
        "Yanis notes an unverified monitoring probe."
      ],
      [
        "What do the farms disagree about?",
        "la réserve d'eau",
        "les billets de train",
        "le programme scolaire",
        "Two farms contest access to the shared water supply."
      ],
      [
        "What is Camille's intended decision?",
        "un calendrier provisoire",
        "une pénurie garantie",
        "l'interdiction permanente",
        "She plans a temporary reviewable schedule rather than a definitive water claim."
      ]
    ],
    "clozes": [
      [
        "Si les mesures changent, nous ___ la répartition. (réexaminer, futur)",
        "réexaminerons",
        "The future main clause follows si plus present for a real future condition.",
        "planning"
      ],
      [
        "Les mesures du sud sont ___ complètes que celles du nord. (less)",
        "moins",
        "Moins ... que expresses the documented difference in coverage.",
        "comparison"
      ]
    ],
    "order": [
      "Le calendrier reste provisoire",
      [
        "reste provisoire",
        "Le calendrier"
      ],
      "The allocation must remain revisable while regional forecasts and local records differ.",
      "conditional decisions"
    ],
    "writing": {
      "listening": [
        "Summarize the farmers' debate without pretending to know the future weather.",
        "Camille cite une brochure qui annonce une pénurie dès lundi. Yanis explique que le bulletin régional présente seulement un risque saisonnier de sécheresse. Les mesures locales sont incomplètes, notamment au sud, et une sonde n'a pas été vérifiée depuis le printemps. Les exploitations ne sont pas d'accord sur le partage de leur réserve d'eau. Les interlocuteurs souhaitent donc comparer les relevés, examiner les besoins des cultures et établir un calendrier provisoire. Aucun volume définitif ne peut être promis sur la seule base d'une prévision."
      ],
      "sources": [
        "Write an explanatory report distinguishing the weather outlook from local measurements.",
        "Le bulletin régional indique un risque accru de sécheresse pendant les prochaines semaines, sans annoncer une pénurie certaine pour lundi. Le registre des exploitations révèle des mesures d'humidité plus faibles au nord, des données incomplètes au sud et une sonde dont le contrôle est ancien. Ces informations ne doivent pas être confondues. Une prévision générale ne remplace pas les observations locales, et une mesure ponctuelle ne décrit pas tout un territoire. Le partage de l'eau devra donc s'appuyer sur des relevés comparables et une discussion explicite des besoins des cultures."
      ],
      "debate": [
        "Defend revisable water-sharing rules while addressing urgent needs from both farms.",
        "Je recommanderais un accord provisoire sur l'utilisation de la réserve d'eau. Les cultivateurs ont raison de se préparer aux risques de sécheresse, et les besoins des plantes ne sont pas tous identiques. Mais une prévision saisonnière ne permet pas de déclarer une pénurie certaine à partir de lundi. Le dossier contient aussi des mesures incomplètes et un instrument non vérifié. Les deux exploitations devraient comparer les observations, déclarer leurs prélèvements et discuter des priorités. Si les relevés ou la météo évoluent, la répartition devra être réexaminée plutôt que défendue comme une promesse définitive."
      ]
    },
    "oral": [
      "Explain why a drought outlook cannot determine a fixed water allocation by itself.",
      "Le bulletin régional annonce un risque de sécheresse plus élevé, mais pas une pénurie certaine sur chaque parcelle. Les mesures des exploitations sont incomplètes et une sonde doit être contrôlée. Je proposerais de comparer des relevés réguliers et de discuter des besoins des cultures. Un partage provisoire serait plus responsable qu'une quantité garantie sans données fiables. Nous pourrions le réviser selon la météo et les mesures futures."
    ]
  }
];
export const U22_139_141=Object.freeze(SOURCE.map((s,i)=>originalB2DebateProduction(s,139+i)));
