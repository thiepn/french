import {originalB2DebateProduction,type U21OriginalSourceStory} from './u21-content-helper.ts';
const SOURCE:readonly U21OriginalSourceStory[]=[
  {
    "id": "transfer-136",
    "title": "Tree census: counts, survival and a public planting promise",
    "goal": "Separate planted saplings from surviving trees, compare dated registers and recommend a verifiable neighborhood survey.",
    "grammarKeys": [
      "compare",
      "condition"
    ],
    "vocabulary": [
      [
        "un recensement",
        "census",
        "Le recensement distingue les arbres vivants."
      ],
      [
        "une plantation",
        "planting",
        "La plantation a eu lieu au printemps."
      ],
      [
        "une pousse",
        "sapling",
        "Une pousse peut mourir pendant l'été."
      ],
      [
        "un relevé",
        "survey record",
        "Le relevé date du mois de juin."
      ],
      [
        "une parcelle",
        "plot",
        "Cette parcelle manque dans le tableau."
      ],
      [
        "survivre",
        "to survive",
        "Tous les jeunes arbres ne survivent pas."
      ],
      [
        "un arrosage",
        "watering",
        "L'arrosage dépend des bénévoles."
      ],
      [
        "une estimation",
        "estimate",
        "L'estimation n'est pas une observation."
      ],
      [
        "une étiquette",
        "tag",
        "L'étiquette indique la date."
      ],
      [
        "une vérification",
        "verification",
        "La vérification aura lieu en septembre."
      ],
      [
        "un taux",
        "rate",
        "Un taux exige un dénominateur fiable."
      ],
      [
        "une réserve",
        "caveat",
        "Cette réserve figure dans le compte rendu."
      ]
    ],
    "dialogue": [
      [
        "Nora",
        "L'affiche promet que deux cents arbres vivent déjà dans le quartier, pourtant le registre parle de deux cents plants distribués.",
        "The poster claims two hundred living trees, but the register counts saplings distributed."
      ],
      [
        "Bastien",
        "Certains habitants ont planté plusieurs pousses; nous ne savons pas combien ont survécu.",
        "Some people planted several saplings; survival is unknown."
      ],
      [
        "Nora",
        "Le tableau de juin mentionne quatre-vingts parcelles contrôlées, mais il n'inclut pas le square du nord.",
        "The June table covers eighty plots but omits the northern square."
      ],
      [
        "Bastien",
        "Il serait trompeur de soustraire les arbres absents comme s'ils étaient tous morts.",
        "Treating every missing tree as dead would mislead."
      ],
      [
        "Nora",
        "Le public souhaite pourtant savoir si le programme d'ombrage fonctionne réellement.",
        "Residents want to know whether the shade programme works."
      ],
      [
        "Bastien",
        "On pourrait identifier les mêmes parcelles en septembre et noter les arbres retrouvés.",
        "They could revisit identical plots in September."
      ],
      [
        "Nora",
        "Et les équipes d'arrosage doivent expliquer leurs horaires, sans prétendre avoir couvert toutes les rues.",
        "Watering teams should disclose their actual coverage."
      ],
      [
        "Bastien",
        "Si les données sont comparables, nous pourrons publier un taux avec ses limites.",
        "Comparable data would allow a qualified survival rate."
      ],
      [
        "Nora",
        "Je corrigerai l'affiche maintenant; nous annoncerons les plantations, pas une survie prouvée.",
        "Nora will correct the poster to report plantings, not verified survival."
      ]
    ],
    "paragraphs": [
      "À Saint-Roch, une association annonce que deux cents nouveaux arbres donnent déjà de l'ombre aux rues. Sa campagne de printemps avait pourtant distribué deux cents jeunes plants, dont certains ont été confiés aux mêmes volontaires. Le registre initial contient des dates de livraison et des noms de parcelles, mais pas de contrôle uniforme de survie. Quand Nora prépare un article sur le projet, elle découvre que l'affiche utilise le nombre distribué comme si chaque jeune plant était encore vivant. La distinction semble technique, mais elle change le sens de la promesse faite aux habitants. Une plantation réalisée et un arbre durablement établi ne sont pas le même résultat.",
      "Un deuxième document fournit un relevé de juin sur quatre-vingts parcelles. Il signale des plants retrouvés, quelques étiquettes illisibles et plusieurs endroits non visités. Le square du nord n'y figure pas et les conditions de sécheresse ont varié d'une rue à l'autre. Bastien refuse donc de calculer un taux définitif de survie à partir de deux fichiers qui n'ont ni le même périmètre ni la même date. Certains bénévoles souhaitent conserver une formule enthousiaste pour attirer du soutien, tandis que d'autres craignent que la publicité exagérée ne diminue la confiance. Nora reconnaît ces deux préoccupations sans transformer le manque de données en accusation.",
      "L'association décide de distinguer, dans un nouveau panneau, les deux cents plants distribués, les parcelles effectivement observées et les résultats encore inconnus. Une visite de septembre utilisera des identifiants de parcelles stables et notera les nouvelles plantations séparément. Les équipes expliqueront les limites de leur calendrier d'arrosage. Si les relevés deviennent comparables, l'association pourra publier une estimation de survie avec son dénominateur et sa période. Pour l'instant, elle invite les habitants à signaler les étiquettes manquantes sans conclure qu'un arbre est mort. Cette communication moins spectaculaire est aussi plus utile pour décider où replanter."
    ],
    "readingTitle": "Le nombre annoncé et les arbres réellement vérifiés",
    "evidence": [
      {
        "label": "Spring distribution poster",
        "type": "poster",
        "french": "Deux cents arbres sont déjà installés pour rafraîchir le quartier. Notre campagne a distribué deux cents plants au printemps; aucune opération de contrôle de survie n'est mentionnée et le mot « vivants » apparaît dans le titre."
      },
      {
        "label": "June parcel sampling log",
        "type": "data",
        "french": "Relevé de juin: quatre-vingts parcelles visitées, identifiants incomplets, square du nord non couvert, étiquettes parfois illisibles. Le document ne donne pas de total vérifié de survie pour les deux cents plants distribués."
      }
    ],
    "reading": [
      [
        "What did the initial register actually count?",
        "des plants distribués",
        "des arbres vivants",
        "des arbres centenaires",
        "The initial register reports distribution rather than established survival."
      ],
      [
        "Which part was absent from the June log?",
        "le square du nord",
        "la mairie",
        "le terrain du sud",
        "The text explicitly says the northern square was not surveyed."
      ],
      [
        "When is the planned re-check?",
        "en septembre",
        "en avril",
        "en décembre",
        "The follow-up is planned for September with stable plot identifiers."
      ]
    ],
    "compare": [
      [
        "Which source uses the unverified claim of already established trees?",
        "l'affiche",
        "le relevé",
        "aucun des deux",
        "The poster's headline treats distribution as proof of survival."
      ],
      [
        "Which document specifies incomplete plot coverage?",
        "le relevé",
        "l'affiche",
        "les deux documents prouvent la survie",
        "Only the dated survey log identifies the omitted square and missing labels."
      ]
    ],
    "listen": [
      [
        "How many saplings were distributed?",
        "deux cents",
        "quatre-vingts",
        "cent vingt",
        "Nora names two hundred distributed saplings, not two hundred confirmed surviving trees."
      ],
      [
        "How many plots did June cover?",
        "quatre-vingts",
        "deux cents",
        "quarante",
        "Nora explicitly reports eighty surveyed plots in the June table."
      ],
      [
        "What geographical area is missing?",
        "le square du nord",
        "la gare",
        "le jardin de l'école",
        "The northern square is absent from the cited survey."
      ],
      [
        "Why not mark missing plants as dead?",
        "ils n'ont peut-être pas été observés",
        "ils sont toujours vivants",
        "ils ont tous été replantés",
        "Bastien distinguishes an unvisited plot from an established death."
      ],
      [
        "What should be stable in September?",
        "les identifiants des parcelles",
        "la couleur de l'affiche",
        "le prix des arbres",
        "Bastien proposes revisiting the same identified plots for meaningful comparison."
      ],
      [
        "What is Nora correcting now?",
        "la promesse de survie",
        "le financement municipal",
        "l'horaire des trains",
        "She explicitly replaces the unverified survival claim with a distribution count."
      ]
    ],
    "clozes": [
      [
        "Si les relevés sont comparables, nous ___ un taux. (publier, futur)",
        "publierons",
        "Si plus present takes a future main clause for this conditional plan.",
        "condition"
      ],
      [
        "La parcelle de juin est ___ documentée que celle de septembre. (less)",
        "moins",
        "Moins ... que expresses a relative shortfall in recorded evidence.",
        "comparison"
      ]
    ],
    "order": [
      "Le taux reste à vérifier",
      [
        "reste à vérifier",
        "Le taux"
      ],
      "A distribution tally cannot establish survival without comparable observations.",
      "evidence"
    ],
    "writing": {
      "listening": [
        "Summarize the conversation for volunteers without implying the programme failed.",
        "Nora découvre que l'affiche confond deux cents plants distribués et deux cents arbres vivants. Bastien souligne que le relevé de juin ne couvre que quatre-vingts parcelles et laisse de côté le square du nord. Il ne conclut ni que tous les plants ont survécu ni que les absents sont morts. Les interlocuteurs proposent de vérifier les mêmes emplacements en septembre. Nora veut corriger la promesse publique dès maintenant et présenter clairement les limites des observations. Le but reste d'améliorer l'ombrage sans exagérer les résultats."
      ],
      "sources": [
        "Write an evidence-led correction comparing the two original documents.",
        "L'affiche du printemps annonce deux cents arbres déjà installés, mais son chiffre provient du nombre de plants distribués. Le relevé de juin décrit seulement quatre-vingts parcelles visitées, avec des identifiants incomplets et un secteur non couvert. Ces documents n'établissent donc pas un taux de survie fiable. Il serait également injustifié de déclarer morts les arbres non observés. Une communication corrigée distinguera les plantations confirmées, les parcelles contrôlées et les résultats qui attendent encore une vérification. Une campagne supplémentaire devra employer des lieux et des dates comparables."
      ],
      "debate": [
        "Argue for a transparent public report while addressing fears about volunteer motivation.",
        "Je recommande de rectifier l'affiche plutôt que de défendre un résultat non mesuré. Certains bénévoles craignent qu'un message prudent fasse perdre des soutiens, et cette inquiétude mérite une réponse. Toutefois, annoncer deux cents arbres vivants sans relevé comparable risque davantage de fragiliser la confiance. Le projet peut célébrer la distribution de plants tout en expliquant ce qui reste inconnu. Si les équipes réexaminent les mêmes parcelles en septembre, elles pourront publier un taux et orienter l'arrosage. Je réviserais cette recommandation si des relevés complets et vérifiables existaient déjà."
      ]
    },
    "oral": [
      "Explain to a resident why a planting count is not yet a survival rate.",
      "Nous savons que l'association a distribué deux cents jeunes plants. Nous ne savons pas combien sont toujours vivants, parce que le relevé couvre seulement une partie des parcelles et des dates différentes. Je conseillerais un nouveau comptage sur les mêmes lieux avant de publier un taux. Cette prudence n'enlève rien au travail des bénévoles; elle permet de mieux décider où planter ensuite."
    ]
  },
  {
    "id": "transfer-137",
    "title": "Rural teleconsultation: advertised access versus actual appointments",
    "goal": "Read accessibility promises against a dated pilot schedule while protecting privacy and proposing realistic alternatives.",
    "grammarKeys": [
      "concession",
      "polite"
    ],
    "vocabulary": [
      [
        "une téléconsultation",
        "remote consultation",
        "La téléconsultation reste facultative."
      ],
      [
        "une permanence",
        "service session",
        "La permanence a lieu le jeudi."
      ],
      [
        "un créneau",
        "time slot",
        "Les créneaux sont limités."
      ],
      [
        "un équipement",
        "equipment",
        "L'équipement fonctionne à la mairie."
      ],
      [
        "une connexion",
        "connection",
        "La connexion n'est pas garantie."
      ],
      [
        "une ordonnance",
        "prescription",
        "Le médecin décide de l'ordonnance."
      ],
      [
        "une confidentialité",
        "confidentiality",
        "La confidentialité doit être préservée."
      ],
      [
        "un rendez-vous",
        "appointment",
        "Le rendez-vous nécessite une confirmation."
      ],
      [
        "un accompagnement",
        "assistance",
        "L'accompagnement est proposé sur place."
      ],
      [
        "une dérogation",
        "exception",
        "Aucune dérogation générale n'est promise."
      ],
      [
        "une urgence",
        "emergency",
        "Une urgence ne doit pas attendre ce service."
      ],
      [
        "un horaire",
        "schedule",
        "L'horaire du service est publié chaque semaine."
      ]
    ],
    "dialogue": [
      [
        "Louise",
        "Le dépliant affirme qu'un médecin est disponible à distance chaque jour dans notre village.",
        "The leaflet promises a remote physician every day."
      ],
      [
        "Hugo",
        "Or le contrat du pilote confirme seulement une permanence le jeudi avec six créneaux.",
        "The pilot contract confirms only six Thursday appointments."
      ],
      [
        "Louise",
        "L'association craint de décourager les habitants qui n'ont pas de voiture.",
        "The association worries that realistic limits may discourage isolated residents."
      ],
      [
        "Hugo",
        "Il faut pourtant préciser que la salle n'est pas un service d'urgence.",
        "The room is not an emergency service."
      ],
      [
        "Louise",
        "Un bénévole propose de garder les dossiers médicaux sur son ordinateur personnel.",
        "A volunteer proposes keeping health files on a personal computer."
      ],
      [
        "Hugo",
        "Cette solution ne respecte pas notre besoin de confidentialité; demandons plutôt une procédure autorisée.",
        "That shortcut conflicts with confidentiality; seek an approved process."
      ],
      [
        "Louise",
        "Pour ceux qui ne maîtrisent pas l'outil, pourrions-nous prévoir un accueil sans collecter leurs informations de santé ?",
        "They consider technical help without collecting medical information."
      ],
      [
        "Hugo",
        "Oui, mais chaque rendez-vous devra être confirmé par le prestataire médical.",
        "Appointments require provider confirmation."
      ],
      [
        "Louise",
        "Je modifierai le dépliant et demanderai des créneaux supplémentaires sans les annoncer avant leur accord.",
        "Louise will correct the leaflet and request, not promise, more slots."
      ]
    ],
    "paragraphs": [
      "Dans un village éloigné de l'hôpital, la commune ouvre une salle destinée aux téléconsultations. Le dépliant de lancement présente un médecin disponible chaque jour, sans distinguer un service souhaité d'un service déjà contractualisé. Louise rencontre plusieurs habitants âgés qui ont du mal à se déplacer et voudrait les rassurer rapidement. Hugo consulte cependant le contrat de la phase pilote: une permanence à distance a été acceptée le jeudi, avec six créneaux à réserver et une assistance technique limitée. Aucune permanence quotidienne ne figure dans ce document. Le problème n'est pas seulement administratif: des personnes pourraient se présenter un mardi en croyant avoir un rendez-vous.",
      "Un bénévole suggère alors de conserver sur son ordinateur les dossiers médicaux apportés par les habitants pour faciliter les prochaines séances. Hugo refuse de prendre cette initiative sans procédure autorisée. Les données de santé ne doivent pas être collectées simplement parce qu'une solution paraît commode. La salle peut proposer une aide à l'utilisation du matériel, mais elle ne garantit ni une ordonnance ni une consultation immédiate. La brochure ne doit jamais laisser croire que le lieu remplace un service d'urgence. Certains conseillers municipaux trouvent le nouveau message moins rassurant. Louise leur rappelle qu'une information exacte aide aussi les usagers à organiser un déplacement alternatif.",
      "Le groupe rédige une nouvelle fiche indiquant la permanence du jeudi, les six créneaux prévus, la nécessité d'une confirmation et un contact pour les questions d'accessibilité. Il sépare explicitement l'accueil technique de l'activité médicale et retire toute proposition informelle de stockage. Louise demandera au prestataire s'il peut ajouter une autre journée. Tant que sa réponse n'est pas arrivée, aucune disponibilité supplémentaire n'est publiée. Les organisateurs prévoient aussi des indications vers les services appropriés selon la situation, sans donner eux-mêmes de conseils médicaux. Leur objectif reste l'accès aux soins, mais la confiance dépend d'abord d'un service décrit avec exactitude."
    ],
    "readingTitle": "Une promesse quotidienne pour une permanence hebdomadaire",
    "evidence": [
      {
        "label": "Village launch leaflet",
        "type": "notice",
        "french": "Téléconsultation médicale disponible tous les jours au centre rural; venez sans attendre, un médecin sera présent à distance. Aucun nombre de créneaux, aucune procédure de réservation et aucune limite relative aux urgences ne sont indiqués."
      },
      {
        "label": "Signed pilot availability schedule",
        "type": "minutes",
        "french": "Pilote confirmé: jeudi, six créneaux de téléconsultation à réserver auprès du prestataire. Accueil technique seulement sur place. Les autres jours sont à l'étude; aucun transfert de dossier vers les appareils privés des bénévoles n'est autorisé."
      }
    ],
    "reading": [
      [
        "On which day is the medical pilot actually confirmed?",
        "le jeudi",
        "tous les jours",
        "le mardi",
        "The signed schedule provides a weekly Thursday session, not daily availability."
      ],
      [
        "How many slots are confirmed?",
        "six",
        "vingt",
        "un seul",
        "The contract states six slots and requires provider confirmation."
      ],
      [
        "What must remain separate from medical decisions?",
        "l'aide technique",
        "la réservation",
        "la présence du médecin",
        "Technical assistance does not authorize handling clinical decisions."
      ]
    ],
    "compare": [
      [
        "Which source overstates daily access?",
        "le dépliant",
        "le contrat",
        "aucun des deux",
        "The public leaflet states daily availability despite the limited contract."
      ],
      [
        "Which source prohibits volunteer personal storage?",
        "le planning signé",
        "le dépliant",
        "les deux autorisent le stockage",
        "The pilot record disallows transferring dossiers to personal volunteer devices."
      ]
    ],
    "listen": [
      [
        "What access does the leaflet promise?",
        "chaque jour",
        "seulement le jeudi",
        "une fois par mois",
        "Louise repeats the leaflet's daily promise, not the real pilot schedule."
      ],
      [
        "When is the confirmed remote medical session?",
        "le jeudi",
        "le lundi",
        "le samedi",
        "Hugo cites the weekly Thursday availability in the pilot agreement."
      ],
      [
        "How many appointments are confirmed?",
        "six",
        "quatre",
        "douze",
        "Hugo identifies six scheduled consultation slots."
      ],
      [
        "Where did the volunteer offer to keep medical files?",
        "sur son ordinateur personnel",
        "à l'hôpital",
        "dans la salle sécurisée",
        "The proposed personal-computer storage was rejected as inappropriate."
      ],
      [
        "Who must confirm the appointment?",
        "le prestataire médical",
        "un voisin",
        "la mairie seule",
        "Hugo says only the medical provider can confirm a consultation slot."
      ],
      [
        "What does Louise plan to request but not announce?",
        "des créneaux supplémentaires",
        "une nouvelle ordonnance",
        "une urgence sans rendez-vous",
        "Additional slots remain a request, not confirmed access."
      ]
    ],
    "clozes": [
      [
        "Bien que le dépliant ___ rassurant, il est inexact. (être)",
        "soit",
        "The concessive conjunction bien que requires subjunctive soit.",
        "concession"
      ],
      [
        "___-nous prévoir une aide technique ? (pouvoir, conditionnel)",
        "Pourrions",
        "The conditional form is used to make a courteous proposal rather than a guarantee.",
        "polite request"
      ]
    ],
    "order": [
      "Les créneaux doivent être confirmés",
      [
        "doivent être confirmés",
        "Les créneaux"
      ],
      "Only the medical provider can confirm actual consultation availability.",
      "service authority"
    ],
    "writing": {
      "listening": [
        "Write a neutral briefing for residents based on what the speakers know.",
        "Louise souhaite faciliter les téléconsultations dans son village, mais le dépliant annonce à tort une disponibilité quotidienne. Hugo explique que le prestataire ne confirme qu'une permanence le jeudi, avec six rendez-vous à réserver. Les interlocuteurs refusent de conserver les dossiers médicaux sur un ordinateur privé et veulent distinguer l'aide technique du travail du médecin. Louise modifiera la brochure et demandera des créneaux supplémentaires. Elle ne les promettra pas avant une réponse officielle. Les habitants pourront ainsi organiser leurs démarches à partir d'informations précises."
      ],
      "sources": [
        "Draft a corrected public notice with faithful source attribution.",
        "Notre centre rural propose une salle équipée pour les téléconsultations. Contrairement au premier dépliant, le planning signé prévoit actuellement six créneaux le jeudi, à confirmer auprès du prestataire médical. Les autres jours ne sont pas encore ouverts. Une aide technique pourra être proposée sur place, mais elle ne constitue pas une consultation, ne garantit aucune ordonnance et ne remplace pas les services d'urgence. Les bénévoles ne stockeront pas les dossiers médicaux sur leurs ordinateurs personnels. Nous publierons toute extension uniquement après confirmation de son organisation."
      ],
      "debate": [
        "Argue for honest scheduling while addressing the transport-access problem.",
        "Je soutiens l'ouverture de ce service, car l'éloignement des consultations peut compliquer la vie des habitants. Certains élus pensent qu'une brochure prudente découragera les usagers; leur souci d'accessibilité est légitime. Cependant, afficher un médecin disponible tous les jours lorsque seuls six créneaux le jeudi sont confirmés peut créer des déplacements inutiles. Il vaut mieux proposer une aide claire à la réservation et rechercher des horaires supplémentaires. Si le prestataire accepte une deuxième permanence, la commune pourra l'annoncer. La confidentialité des dossiers doit rester une condition de chaque solution."
      ]
    },
    "oral": [
      "Explain courteously why a Thursday appointment is not guaranteed by the leaflet.",
      "Le projet rural a pour objectif de faciliter l'accès à une consultation, mais le document contractuel prévoit seulement six créneaux le jeudi. Le dépliant initial était trop large. Pourriez-vous confirmer votre rendez-vous auprès du prestataire avant de vous déplacer ? Une aide technique peut être proposée, mais elle ne remplace ni l'avis médical ni les services d'urgence."
    ]
  },
  {
    "id": "transfer-138",
    "title": "An emigrant ship diary: conflicting dates and responsible family history",
    "goal": "Interpret a ship clerk's log and later family recollection without erasing memory or inventing chronological certainty.",
    "grammarKeys": [
      "past",
      "report"
    ],
    "vocabulary": [
      [
        "un journal de bord",
        "ship's log",
        "Le journal de bord note la marée."
      ],
      [
        "une traversée",
        "crossing",
        "La traversée a duré plusieurs jours."
      ],
      [
        "un témoin",
        "witness",
        "Le témoin se souvient d'une chanson."
      ],
      [
        "un départ",
        "departure",
        "Le départ annoncé a été retardé."
      ],
      [
        "une escale",
        "stopover",
        "Une escale figure dans le registre."
      ],
      [
        "un souvenir",
        "memory",
        "Le souvenir de famille est précieux."
      ],
      [
        "une copie",
        "copy",
        "La copie ne montre pas toutes les pages."
      ],
      [
        "une encre",
        "ink",
        "L'encre a pâli sur la date."
      ],
      [
        "un équipage",
        "crew",
        "L'équipage attendait la marée."
      ],
      [
        "une légende",
        "caption",
        "La légende doit citer sa source."
      ],
      [
        "un témoignage",
        "testimony",
        "Le témoignage a été enregistré plus tard."
      ],
      [
        "une chronologie",
        "timeline",
        "La chronologie conserve les deux hypothèses."
      ]
    ],
    "dialogue": [
      [
        "Inès",
        "Ma grand-mère racontait que notre famille avait quitté le port un dimanche, après la dernière chanson de l'équipage.",
        "Her grandmother remembered a Sunday departure and a song."
      ],
      [
        "Adrien",
        "Le journal de bord du commis porte pourtant la date de lundi pour le départ du navire.",
        "The ship clerk's log dates departure to Monday."
      ],
      [
        "Inès",
        "Faut-il corriger son souvenir en écrivant qu'elle s'est trompée ?",
        "Should the memory be corrected as a mistake?"
      ],
      [
        "Adrien",
        "Pas forcément: elle peut parler de la sortie de la maison plutôt que du moment où le bateau a quitté le quai.",
        "She may have remembered leaving home rather than sailing."
      ],
      [
        "Inès",
        "La copie du journal ne contient que trois pages; il manque le feuillet des préparatifs.",
        "The surviving copy is incomplete."
      ],
      [
        "Adrien",
        "Alors nous ne pouvons pas établir une chronologie exacte de chaque déplacement.",
        "An exact sequence cannot be established."
      ],
      [
        "Inès",
        "J'aimerais conserver la chanson et l'émotion du récit dans notre exposition familiale.",
        "Inès wants to preserve the emotional account."
      ],
      [
        "Adrien",
        "Attribuons le dimanche au souvenir oral et le lundi au registre, sans les fusionner.",
        "Attribute each date to its source instead of conflating them."
      ],
      [
        "Inès",
        "J'écrirai une légende qui explique les deux dates et les pages manquantes.",
        "She will write an accurate caption about the conflicting sources."
      ]
    ],
    "paragraphs": [
      "Inès prépare une petite exposition familiale consacrée au départ de ses arrière-grands-parents. Pendant son enfance, elle entendait souvent sa grand-mère raconter un dimanche pluvieux, une chanson près des bagages et l'adieu au quartier du port. Cette scène représente un souvenir important, transmis longtemps après les événements. Lorsqu'Adrien examine une copie du journal de bord, il trouve pourtant une ligne indiquant que le navire a quitté le quai le lundi. La tentation est forte de décider qu'une source annule l'autre. Adrien rappelle cependant qu'elles n'observent pas forcément le même moment et qu'aucune ne répond à toutes les questions.",
      "Le registre du commis décrit l'horaire maritime, mais la copie disponible ne contient que trois pages. Le feuillet consacré aux préparatifs a disparu. La grand-mère pouvait avoir parlé du jour où la famille avait quitté sa maison, avant d'attendre le départ du bateau. Il serait néanmoins excessif de présenter cette hypothèse comme un fait démontré. Les visiteurs de l'exposition apprécieront peut-être un récit simple, mais une légende trop certaine effacerait les questions ouvertes. Inès veut aussi éviter de traiter la mémoire de sa famille comme un document administratif ou, à l'inverse, de faire du témoignage une preuve de l'heure exacte de navigation.",
      "Les deux organisateurs choisissent une présentation en deux colonnes: « dimanche selon le récit familial » et « lundi dans la copie du journal de bord ». Ils ajoutent une carte prudente du port et indiquent les pages absentes, sans inventer de détails sur la traversée. La chanson peut être racontée comme un souvenir oral, tandis que la date maritime est attribuée au commis. Si un autre document apparaît, la chronologie sera révisée. Leur démarche ne transforme pas l'histoire en un simple problème de dates: elle permet au contraire de conserver la valeur humaine du témoignage, tout en distinguant la mémoire, l'archive et l'interprétation."
    ],
    "readingTitle": "Deux dates pour un départ, deux regards sur l'histoire",
    "evidence": [
      {
        "label": "Later family oral recollection",
        "type": "diary",
        "french": "La grand-mère se rappelait un dimanche de pluie: nous avons quitté la maison avec nos affaires, et quelqu'un chantait près du port. Le récit a été transmis plusieurs décennies après la traversée, sans préciser l'heure où le navire a quitté le quai."
      },
      {
        "label": "Surviving partial ship clerk log",
        "type": "data",
        "french": "Copie de trois pages du registre: lundi, sortie du navire du quai inscrite par le commis. Le feuillet des préparatifs et les pages précédentes sont absents; aucune date de départ du domicile familial n'est conservée."
      }
    ],
    "reading": [
      [
        "What event does the Monday date identify?",
        "la sortie du navire du quai",
        "le départ du domicile",
        "la naissance de la grand-mère",
        "The clerk's log dates the ship leaving the quay, not the family's earlier movements."
      ],
      [
        "What part of the archival copy is missing?",
        "le feuillet des préparatifs",
        "le registre du lundi",
        "la chanson entière",
        "The missing preparation sheet prevents a full reconstruction of events."
      ],
      [
        "How will the exhibit treat the two dates?",
        "en les attribuant aux sources",
        "en supprimant le dimanche",
        "en déclarant le lundi impossible",
        "The exhibition keeps Sunday as oral recollection and Monday as log entry."
      ]
    ],
    "compare": [
      [
        "Which source remembers a song?",
        "le récit oral",
        "le journal du commis",
        "aucun document",
        "The song appears in the grandmother's later oral memory."
      ],
      [
        "Which source records a maritime departure on Monday?",
        "le journal de bord",
        "le récit oral",
        "les deux documents",
        "The surviving ship log contains the Monday quay-departure entry."
      ]
    ],
    "listen": [
      [
        "What day did the grandmother remember?",
        "dimanche",
        "lundi",
        "mardi",
        "Inès recounts her grandmother's memory of a Sunday before the departure."
      ],
      [
        "What day appears in the ship log?",
        "lundi",
        "dimanche",
        "vendredi",
        "Adrien explicitly attributes Monday to the surviving clerk's log."
      ],
      [
        "How many log pages survive in the copy?",
        "trois",
        "deux",
        "dix",
        "Inès says only three pages are available for their research."
      ],
      [
        "What alternative meaning could Sunday have?",
        "le départ de la maison",
        "l'arrivée au nouveau pays",
        "la première escale",
        "Adrien suggests that Sunday may refer to leaving home rather than sailing."
      ],
      [
        "What does Inès want to preserve?",
        "la chanson et l'émotion",
        "le numéro du billet",
        "la liste complète des passagers",
        "She wants the family song and emotional context kept in the exhibit."
      ],
      [
        "What will the final caption acknowledge?",
        "deux dates et des pages manquantes",
        "une date incontestable",
        "un récit totalement inventé",
        "Inès plans to attribute conflicting dates and disclose the gaps in the record."
      ]
    ],
    "clozes": [
      [
        "Lorsque le commis écrivait, le bateau ___ encore au quai. (être, imparfait)",
        "était",
        "Imparfait describes background state rather than inventing another completed event.",
        "past background"
      ],
      [
        "La grand-mère ___ que le départ avait eu lieu dimanche. (raconter, imparfait)",
        "racontait",
        "Reported recollections use a past reporting verb without treating memory as proof.",
        "reported narrative"
      ]
    ],
    "order": [
      "Les deux dates ont des sources distinctes",
      [
        "ont des sources distinctes",
        "Les deux dates"
      ],
      "The display must attribute Sunday recollection and Monday log separately.",
      "source attribution"
    ],
    "writing": {
      "listening": [
        "Retell the discussion while preserving both speakers' uncertainty.",
        "Inès se souvenait du récit de sa grand-mère, qui associait le départ familial à un dimanche de pluie et à une chanson. Adrien a trouvé dans le journal de bord une date différente: le navire aurait quitté le quai le lundi. Il explique que les deux récits peuvent concerner des étapes distinctes. Comme la copie du registre est incomplète, ils ne prétendent pas connaître chaque mouvement de la famille. Ils décident de conserver l'émotion du témoignage et de préciser les limites du document écrit dans la légende de l'exposition."
      ],
      "sources": [
        "Write an exhibition caption that distinguishes archive from recollection.",
        "**Deux souvenirs du départ.** Dans un témoignage oral enregistré bien après le voyage, la grand-mère décrit un dimanche de pluie, des bagages et une chanson près du port. La copie partielle du journal de bord indique que le navire a quitté le quai le lundi. Ces sources ne décrivent pas nécessairement la même étape. Le feuillet relatif aux préparatifs manque et aucune archive consultée ne donne la date exacte du départ du domicile. Nous présentons donc les deux dates avec leurs attributions respectives, sans remplacer la mémoire familiale par une certitude archivistique."
      ],
      "debate": [
        "Argue for transparent historical uncertainty against calls for one simplified date.",
        "Je choisirais de présenter les deux dates dans l'exposition. Certains visiteurs préfèrent une chronologie unique, et leur besoin de lisibilité se comprend. Cependant, choisir arbitrairement le dimanche ou le lundi supprimerait une information importante. Le récit oral concerne peut-être le départ du domicile, tandis que le registre note celui du navire. Nous ne pouvons pas prouver cette interprétation, surtout avec des pages manquantes. Une légende courte peut expliquer les deux perspectives sans affaiblir l'émotion du témoignage. Si un nouveau registre complet était découvert, la présentation pourrait être modifiée."
      ]
    },
    "oral": [
      "Explain why an oral memory and a ship log are not automatically contradictory.",
      "La grand-mère raconte un départ vécu un dimanche, et le journal de bord inscrit le lundi comme date de sortie du navire. Il est possible que la famille ait quitté sa maison avant l'embarquement, mais nous ne pouvons pas le prouver. Je proposerais d'indiquer les deux dates avec leurs sources, puis d'expliquer que le registre conservé est incomplet. Ainsi, le témoignage reste respecté sans devenir une preuve de l'heure maritime."
    ]
  }
];
export const U22_136_138=Object.freeze(SOURCE.map((s,i)=>originalB2DebateProduction(s,136+i)));
