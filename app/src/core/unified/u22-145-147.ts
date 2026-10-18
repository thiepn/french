import {originalB2DebateProduction,type U21OriginalSourceStory} from './u21-content-helper.ts';
const SOURCE:readonly U21OriginalSourceStory[]=[
  {
    "id": "transfer-145",
    "title": "Neighborhood solar cooperative: estimated savings versus signed commitments",
    "goal": "Separate energy production models from real household savings and conditional membership obligations.",
    "grammarKeys": [
      "condition",
      "future"
    ],
    "vocabulary": [
      [
        "un panneau solaire",
        "solar panel",
        "Le panneau solaire a un rendement estimé."
      ],
      [
        "une coopérative",
        "cooperative",
        "La coopérative n'est pas encore financée."
      ],
      [
        "une production",
        "production",
        "La production dépend de l'ensoleillement."
      ],
      [
        "une économie",
        "saving",
        "L'économie réelle dépend du contrat."
      ],
      [
        "une cotisation",
        "membership contribution",
        "La cotisation reste une proposition."
      ],
      [
        "un devis",
        "quotation",
        "Le devis expire en décembre."
      ],
      [
        "un contrat",
        "contract",
        "Le contrat n'a pas été signé."
      ],
      [
        "une simulation",
        "simulation",
        "La simulation suppose un prix constant."
      ],
      [
        "un stockage",
        "storage",
        "Le stockage n'est pas chiffré."
      ],
      [
        "une adhésion",
        "membership",
        "L'adhésion demeure facultative."
      ],
      [
        "un rendement",
        "yield",
        "Le rendement varie selon les saisons."
      ],
      [
        "une réserve",
        "contingency",
        "La réserve doit être discutée avant le vote."
      ]
    ],
    "dialogue": [
      [
        "Amine",
        "La brochure garantit trente pour cent d'économies sur chaque facture dès janvier.",
        "The brochure guarantees thirty percent off every bill in January."
      ],
      [
        "Jeanne",
        "Le tableur présente une simulation avec un prix d'électricité constant, pas une facture réelle.",
        "The spreadsheet is a model under assumptions."
      ],
      [
        "Amine",
        "Et le devis pour les batteries ne figure pas dans le budget affiché.",
        "Battery costs are omitted."
      ],
      [
        "Jeanne",
        "Aucun contrat d'achat n'est signé et les cotisations ne sont pas votées.",
        "Contracts and contributions are not finalized."
      ],
      [
        "Amine",
        "Les habitants espèrent tout de même réduire les dépenses et utiliser une énergie locale.",
        "Residents want lower costs and local energy."
      ],
      [
        "Jeanne",
        "Nous devons préciser qui serait propriétaire des panneaux et quels risques seraient partagés.",
        "Ownership and shared risks need clarification."
      ],
      [
        "Amine",
        "Pourrions-nous proposer une adhésion libre avant d'annoncer un rendement ?",
        "They consider voluntary membership."
      ],
      [
        "Jeanne",
        "Si les devis et les engagements sont confirmés, nous réviserons le budget et les projections.",
        "Projections should follow verified costs."
      ],
      [
        "Amine",
        "Je remplacerai la garantie par des scénarios explicites et une invitation à poser des questions.",
        "The guarantee will become conditional scenarios."
      ]
    ],
    "paragraphs": [
      "Une association de quartier envisage de créer une coopérative solaire. Son affiche annonce que chaque ménage réduira sa facture d'électricité de trente pour cent dès janvier. Amine trouve le projet attrayant, mais Jeanne consulte le tableur présenté aux membres. Il contient une simulation calculée avec un prix d'électricité supposé constant et un niveau d'ensoleillement moyen. Le résultat ne décrit aucune économie déjà réalisée. En outre, la proposition ne précise pas si chaque ménage consommera la même quantité d'énergie ni comment les avantages seront répartis.",
      "Un deuxième document, le dossier financier provisoire, ne comprend pas le coût du stockage par batteries. Aucun contrat d'achat d'électricité n'a été signé, et les cotisations des futurs membres doivent encore être discutées. Certains habitants craignent qu'une description prudente rende la campagne moins populaire. Jeanne estime pourtant qu'une garantie non fondée créerait des attentes injustes, surtout pour les ménages disposant de revenus limités. Amine ajoute qu'il faut expliquer la propriété des panneaux, les responsabilités de maintenance et les conditions permettant de quitter la coopérative. Une projection de rendement n'est pas une obligation contractuelle ni un droit au rabais.",
      "L'équipe rédige trois scénarios qui distinguent les hypothèses sur les prix, la production saisonnière et les dépenses supplémentaires. Les adhésions restent volontaires, sans promesse de réduction immédiate. Les devis seront actualisés, et une assemblée décidera ultérieurement des contributions et de la gouvernance. Si les accords sont conclus, une estimation mieux documentée pourra être publiée. En attendant, la coopérative présente les économies comme des possibilités variables et non comme une garantie uniforme. Les habitants peuvent ainsi débattre du projet et de ses risques sans confondre enthousiasme collectif et chiffres déjà vérifiés."
    ],
    "readingTitle": "Une simulation solaire ne signe pas le contrat",
    "evidence": [
      {
        "label": "Cooperative solar campaign brochure",
        "type": "poster",
        "french": "Économisez 30 % sur votre facture dès janvier: rendement garanti à chaque foyer. Les hypothèses de simulation, l'absence de contrat d'achat et les coûts de batteries non chiffrés n'apparaissent pas dans cette annonce."
      },
      {
        "label": "Provisional energy and finance workbook",
        "type": "data",
        "french": "Simulation sous prix d'énergie constant et ensoleillement moyen. Coût du stockage absent; aucun contrat d'achat signé, cotisations non votées, maintenance et répartition des gains à définir avant approbation collective."
      }
    ],
    "reading": [
      [
        "What is the claimed household saving?",
        "trente pour cent",
        "cinq pour cent",
        "soixante pour cent",
        "The promotional guarantee of 30 percent is not substantiated by actual bills."
      ],
      [
        "What major expenditure is missing?",
        "le stockage par batteries",
        "le papier publicitaire",
        "la location de chaises",
        "The provisional budget excludes battery storage pricing."
      ],
      [
        "What remains voluntary?",
        "l'adhésion",
        "le paiement déjà exigible",
        "le vote déjà clos",
        "Membership is not compulsory and financial contributions are still proposals."
      ]
    ],
    "compare": [
      [
        "Which source guarantees immediate savings?",
        "la brochure",
        "le tableur",
        "aucun des deux",
        "The public flyer promotes a guaranteed result unsupported by the assumptions."
      ],
      [
        "Which source identifies unsigned contracts?",
        "le dossier provisoire",
        "la brochure",
        "les deux prouvent le rendement",
        "The planning workbook records the missing purchase commitments."
      ]
    ],
    "listen": [
      [
        "What bill reduction is advertised?",
        "trente pour cent",
        "vingt pour cent",
        "dix pour cent",
        "Amine cites a disputed thirty-percent saving on every bill."
      ],
      [
        "What assumption does the model hold constant?",
        "le prix de l'électricité",
        "les revenus de chacun",
        "le nombre de familles",
        "Jeanne says the model uses a fixed electricity price."
      ],
      [
        "What cost is omitted?",
        "les batteries",
        "le café",
        "les travaux de peinture",
        "Amine points out that battery costs are not included."
      ],
      [
        "What documents remain unsigned?",
        "les contrats d'achat",
        "les comptes rendus scolaires",
        "les listes d'invités",
        "Jeanne says energy purchase contracts are not finalized."
      ],
      [
        "What membership principle is proposed?",
        "l'adhésion libre",
        "l'inscription automatique",
        "une obligation municipale",
        "Amine suggests optional membership without a yield promise."
      ],
      [
        "What will replace the guarantee?",
        "des scénarios conditionnels",
        "une facture déjà payée",
        "une économie certaine",
        "The group will disclose assumptions instead of guaranteeing savings."
      ]
    ],
    "clozes": [
      [
        "Si les devis sont confirmés, nous ___ le budget. (réviser, futur)",
        "réviserons",
        "Si plus present licenses future revision rather than a premature guarantee.",
        "condition"
      ],
      [
        "La coopérative ___ peut-être installée l'année prochaine. (être, futur)",
        "sera",
        "Futur describes a possibility in context and never makes the installation an approved fact.",
        "future"
      ]
    ],
    "order": [
      "Les économies restent des estimations",
      [
        "restent des estimations",
        "Les économies"
      ],
      "A simulated saving cannot become a signed uniform guarantee.",
      "financial evidence"
    ],
    "writing": {
      "listening": [
        "Write a balanced recap of the cooperative planning conversation.",
        "Amine présente une campagne solaire annonçant trente pour cent d'économies pour tous les ménages. Jeanne rappelle que ce chiffre vient d'une simulation avec des hypothèses de prix et d'ensoleillement. Le budget ne comprend pas les batteries, et aucun contrat d'achat n'est encore signé. Les membres doivent aussi décider des cotisations et des responsabilités. Les interlocuteurs souhaitent défendre le projet sans imposer une promesse trompeuse. Ils proposent une adhésion volontaire, des scénarios comparables et une révision du budget lorsque les devis seront confirmés."
      ],
      "sources": [
        "Prepare an accurate solar-project information note comparing the brochure and workbook.",
        "La brochure de la coopérative présente une réduction de facture de trente pour cent comme garantie dès janvier. Le tableur financier contient seulement une simulation fondée sur un prix d'électricité constant et un ensoleillement moyen. Le stockage par batteries n'est pas encore chiffré, les contrats d'achat ne sont pas signés et les cotisations doivent être votées. Aucun ménage ne peut donc considérer cette économie comme acquise. Les organisateurs publieront plusieurs scénarios et expliqueront leurs conditions avant de solliciter des engagements définitifs."
      ],
      "debate": [
        "Argue for transparent scenarios while addressing residents' hope for cheaper energy.",
        "Je soutiendrais l'étude d'une coopérative solaire, car de nombreux habitants souhaitent réduire leurs dépenses et produire une énergie locale. Mais je m'opposerais à une garantie uniforme de trente pour cent alors que les contrats et les coûts de stockage restent inconnus. Les membres doivent comprendre les risques, la gouvernance et les obligations envisagées avant de voter. Des scénarios explicites peuvent être motivants sans devenir des promesses. Si les devis, les contrats et le financement sont confirmés, les projections pourront être révisées. Une adhésion libre et éclairée protégera mieux le projet qu'une campagne qui confond modèle et facture réelle."
      ]
    },
    "oral": [
      "Explain why an energy model cannot guarantee identical household savings.",
      "Le modèle prévoit une production possible avec certaines hypothèses, mais aucun contrat d'achat n'a été signé. Le coût des batteries et les cotisations restent à définir. Les économies dépendront aussi de la consommation de chaque foyer. Je proposerais donc plusieurs scénarios clairement présentés, suivis d'une décision collective. L'adhésion doit être libre, et aucun pourcentage uniforme ne devrait être garanti aujourd'hui."
    ]
  },
  {
    "id": "transfer-146",
    "title": "Volunteer interpretation helpline: coverage promises and safeguarding limits",
    "goal": "Plan multilingual access while distinguishing volunteer language assistance from certified emergency or legal interpreting.",
    "grammarKeys": [
      "polite",
      "condition"
    ],
    "vocabulary": [
      [
        "un interprète",
        "interpreter",
        "L'interprète explique les propos."
      ],
      [
        "une permanence",
        "shift",
        "La permanence du mercredi est confirmée."
      ],
      [
        "un bénévole",
        "volunteer",
        "Le bénévole ne donne pas d'avis juridique."
      ],
      [
        "une traduction",
        "translation",
        "La traduction peut nécessiter une révision."
      ],
      [
        "une langue",
        "language",
        "La langue demandée n'est pas toujours disponible."
      ],
      [
        "une confidentialité",
        "confidentiality",
        "La confidentialité exige des procédures."
      ],
      [
        "un créneau",
        "slot",
        "Le créneau dépend du volontaire."
      ],
      [
        "un service d'urgence",
        "emergency service",
        "Le service d'urgence a son propre numéro."
      ],
      [
        "une compétence",
        "competence",
        "La compétence varie selon le domaine."
      ],
      [
        "un transfert",
        "handoff",
        "Le transfert doit être autorisé."
      ],
      [
        "un répertoire",
        "directory",
        "Le répertoire est mis à jour."
      ],
      [
        "une orientation",
        "referral",
        "L'orientation n'est pas un conseil professionnel."
      ]
    ],
    "dialogue": [
      [
        "Rachid",
        "Notre site annonce des interprètes disponibles vingt-quatre heures sur vingt-quatre dans huit langues.",
        "The site claims around-the-clock coverage in eight languages."
      ],
      [
        "Clara",
        "Le tableau confirme trois bénévoles le mercredi et seulement deux langues cette semaine.",
        "The rota lists three volunteers for two languages on Wednesday."
      ],
      [
        "Rachid",
        "Des familles auront pourtant besoin d'aide pour comprendre des courriers importants.",
        "Families need meaningful language assistance."
      ],
      [
        "Clara",
        "Une aide générale ne remplace pas un interprétariat qualifié lors d'une urgence ou d'une démarche juridique.",
        "Volunteer support is not qualified emergency or legal interpretation."
      ],
      [
        "Rachid",
        "Un bénévole voudrait enregistrer les appels afin de former les nouveaux arrivants.",
        "One volunteer proposes recording calls."
      ],
      [
        "Clara",
        "Sans information claire et accord approprié, nous ne devons pas enregistrer ces conversations.",
        "Call recording requires a proper basis and safeguards."
      ],
      [
        "Rachid",
        "Pourrions-nous publier les langues et les horaires réellement confirmés, avec une orientation vers les bons services ?",
        "They could list real hours, languages and official referrals."
      ],
      [
        "Clara",
        "Si les effectifs augmentent et que les procédures sont validées, nous étendrons progressivement la permanence.",
        "Expansion remains conditional."
      ],
      [
        "Rachid",
        "Je corrigerai le site et distinguerai l'écoute bénévole des prestations professionnelles.",
        "He will clarify the service boundaries."
      ]
    ],
    "paragraphs": [
      "Une association lance une permanence téléphonique destinée à aider des habitants qui ne comprennent pas facilement les courriers administratifs. Son site annonce une disponibilité permanente dans huit langues. Rachid lit pourtant le tableau des bénévoles: pour la semaine en cours, trois personnes se sont engagées le mercredi, dans deux langues seulement. La capacité réelle est donc beaucoup plus limitée que la promesse publique. Les responsables craignent de décevoir les familles, mais des personnes pourraient appeler à une heure critique en croyant obtenir immédiatement une aide spécialisée.",
      "Clara souligne également que parler deux langues ne donne pas automatiquement les compétences nécessaires à l'interprétation dans une procédure juridique, médicale ou d'urgence. Un bénévole propose de conserver les appels pour former les nouveaux participants. Cette idée soulève des questions de confidentialité et de consentement que l'association n'a pas encore examinées. Le public doit savoir quelles informations peuvent être partagées et quel type d'aide est réellement offert. Une orientation vers des services compétents peut être plus responsable qu'une traduction improvisée dans une situation à conséquences importantes.",
      "L'équipe modifie la page d'accueil pour indiquer les créneaux confirmés, les langues disponibles et les limites de son rôle. Elle prépare des consignes pour orienter les appels urgents ou spécialisés vers les services appropriés, sans prétendre décider à la place des usagers. Aucun enregistrement automatique n'est activé. Les bénévoles peuvent néanmoins expliquer des démarches générales lorsqu'ils sont disponibles et que la demande relève de leur compétence. Si de nouvelles permanences et procédures sont confirmées, le répertoire sera mis à jour. Une promesse moins large peut ainsi offrir une aide réellement accessible et sûre."
    ],
    "readingTitle": "Une ligne d'écoute n'est pas un service d'interprétation universel",
    "evidence": [
      {
        "label": "Multilingual helpline launch webpage",
        "type": "notice",
        "french": "Assistance immédiate vingt-quatre heures sur vingt-quatre dans huit langues, pour toutes les démarches médicales, juridiques et administratives. Aucune restriction de spécialité, de disponibilité ni de confidentialité n'est indiquée."
      },
      {
        "label": "Volunteer rota and operating note",
        "type": "minutes",
        "french": "Mercredi seulement: trois bénévoles confirmés dans deux langues. Information générale non professionnelle; aucune procédure d'enregistrement approuvée et aucune prestation garantie d'interprétation d'urgence ou juridique."
      }
    ],
    "reading": [
      [
        "How many volunteers are confirmed this week?",
        "trois",
        "huit",
        "vingt-quatre",
        "The rota confirms three people, not an around-the-clock team."
      ],
      [
        "How many languages are actually covered?",
        "deux",
        "huit",
        "douze",
        "Only two languages are staffed in the current schedule."
      ],
      [
        "What high-stakes service is not guaranteed?",
        "l'interprétation d'urgence",
        "l'information sur les horaires",
        "l'accueil général",
        "The association cannot promise professional emergency interpreting."
      ]
    ],
    "compare": [
      [
        "Which document claims all-day coverage?",
        "le site de lancement",
        "le tableau de service",
        "aucun des deux",
        "The launch webpage overstates the service's actual staffed availability."
      ],
      [
        "Which source states that calls should not yet be recorded?",
        "la note de fonctionnement",
        "le site de lancement",
        "les deux approuvent l'enregistrement",
        "The operating note lacks an authorized recording procedure."
      ]
    ],
    "listen": [
      [
        "How many languages does the site advertise?",
        "huit",
        "deux",
        "quatre",
        "Rachid describes the exaggerated eight-language claim."
      ],
      [
        "When are volunteers actually confirmed?",
        "mercredi",
        "tous les jours",
        "samedi uniquement",
        "Clara cites Wednesday as the only currently confirmed shift."
      ],
      [
        "How many volunteers are scheduled?",
        "trois",
        "huit",
        "un",
        "The current rota contains three volunteers."
      ],
      [
        "What professional role cannot be assumed?",
        "l'interprétation juridique ou d'urgence",
        "l'aide aux horaires",
        "l'accueil général",
        "Clara distinguishes bilingual volunteer help from qualified emergency and legal work."
      ],
      [
        "What unauthorized practice is proposed?",
        "enregistrer les appels",
        "publier les heures",
        "mettre à jour les langues",
        "The recording proposal is not supported by an approved procedure."
      ],
      [
        "What information will be published?",
        "les langues et horaires confirmés",
        "une disponibilité permanente fictive",
        "des numéros privés des appelants",
        "The revised page will identify actual coverage and appropriate referrals."
      ]
    ],
    "clozes": [
      [
        "___-vous préciser l'horaire confirmé ? (pouvoir, conditionnel)",
        "Pourriez",
        "The conditional form Pourriez-vous is an appropriate polite inquiry.",
        "polite request"
      ],
      [
        "Si les procédures sont validées, nous ___ la permanence. (étendre, futur)",
        "étendrons",
        "This is a conditional future expansion, not a currently guaranteed service.",
        "condition"
      ]
    ],
    "order": [
      "Le service reste limité à deux langues",
      [
        "reste limité à deux langues",
        "Le service"
      ],
      "Only current staffed languages may be promised as available.",
      "service capacity"
    ],
    "writing": {
      "listening": [
        "Summarize the helpline planning discussion without promising specialized services.",
        "Rachid présente un site qui annonce une permanence dans huit langues à toute heure. Clara consulte le planning réel: trois bénévoles sont confirmés le mercredi dans deux langues. Elle rappelle qu'une aide linguistique générale ne constitue pas une interprétation professionnelle en situation médicale, juridique ou d'urgence. Les interlocuteurs refusent aussi d'enregistrer les appels sans procédure appropriée. Rachid corrigera la page d'information et indiquera des orientations vers les services compétents. Une éventuelle extension dépendra de nouvelles disponibilités et de règles vérifiées."
      ],
      "sources": [
        "Write a corrected user-facing helpline description comparing publicity and staffing records.",
        "Notre association propose une aide linguistique bénévole pour des démarches générales, dans la limite des horaires et des langues effectivement confirmés. Contrairement à la première page de lancement, le tableau actuel indique trois bénévoles le mercredi et deux langues cette semaine. Nous ne garantissons ni une disponibilité permanente ni un interprétariat professionnel pour des urgences ou des procédures juridiques. Aucun enregistrement automatique d'appel n'est autorisé dans ce dispositif. Les personnes ayant des besoins spécialisés seront orientées vers les services adaptés. La page sera actualisée seulement lorsque de nouvelles permanences auront été validées."
      ],
      "debate": [
        "Defend honest support boundaries despite urgent multilingual community needs.",
        "Je crois qu'une permanence bénévole peut rendre des services utiles à des personnes isolées linguistiquement. Il est compréhensible que les organisateurs veuillent afficher huit langues et un accueil continu pour rassurer les familles. Mais promettre une aide inexistante pourrait retarder une démarche importante. Le planning confirme seulement trois bénévoles le mercredi et deux langues; il faut commencer par cette réalité. Des consignes de confidentialité et des orientations vers des professionnels sont essentielles. Si la formation, les effectifs et les procédures augmentent, l'offre pourra s'élargir. Une information précise rend l'aide moins spectaculaire, mais plus fiable."
      ]
    },
    "oral": [
      "Politely explain a volunteer interpretation service's current limits and referrals.",
      "Notre association peut aider à comprendre des informations générales pendant les créneaux annoncés. Cette semaine, seuls trois bénévoles sont confirmés le mercredi dans deux langues. Nous ne remplaçons pas un service d'urgence ou un interprète professionnel pour une procédure juridique. Pourriez-vous préciser votre demande afin que nous indiquions un service approprié ? Nous ne promettons pas une disponibilité qui n'a pas été confirmée."
    ]
  },
  {
    "id": "transfer-147",
    "title": "Forest visitor counts: counter failures and ecological pressure",
    "goal": "Separate partial trail-counter readings, seasonal visitor patterns and conservation decisions.",
    "grammarKeys": [
      "source",
      "compare"
    ],
    "vocabulary": [
      [
        "un sentier",
        "trail",
        "Le sentier traverse une zone sensible."
      ],
      [
        "un compteur",
        "counter",
        "Le compteur a cessé de fonctionner."
      ],
      [
        "une fréquentation",
        "visitor traffic",
        "La fréquentation varie selon la saison."
      ],
      [
        "une réserve naturelle",
        "nature reserve",
        "La réserve protège certaines espèces."
      ],
      [
        "une observation",
        "observation",
        "L'observation ne couvre que le week-end."
      ],
      [
        "une fermeture",
        "closure",
        "La fermeture n'est pas encore décidée."
      ],
      [
        "une déviation",
        "detour",
        "La déviation doit être étudiée."
      ],
      [
        "une érosion",
        "erosion",
        "L'érosion est visible près du ruisseau."
      ],
      [
        "un passage",
        "passing",
        "Un passage répété peut être compté deux fois."
      ],
      [
        "une saison",
        "season",
        "La saison change les usages du parc."
      ],
      [
        "une mesure",
        "measure",
        "La mesure suit un protocole."
      ],
      [
        "une protection",
        "protection",
        "La protection doit être proportionnée."
      ]
    ],
    "dialogue": [
      [
        "Iris",
        "Le panneau affirme que la fréquentation de la forêt a doublé cet été.",
        "The sign claims forest visits doubled."
      ],
      [
        "Mathieu",
        "Pourtant le compteur du sentier est tombé en panne deux semaines, et l'ancien relevé couvre une autre saison.",
        "The counter failed and periods differ."
      ],
      [
        "Iris",
        "Des habitants ont observé une érosion près du ruisseau; le problème mérite attention.",
        "People have genuinely observed erosion."
      ],
      [
        "Mathieu",
        "Oui, mais cette observation ne prouve pas que tous les visiteurs en sont responsables.",
        "Erosion does not prove universal visitor causation."
      ],
      [
        "Iris",
        "Une association demande la fermeture définitive du parcours.",
        "One group asks for permanent closure."
      ],
      [
        "Mathieu",
        "Les marcheurs rappellent qu'il existe peu d'itinéraires accessibles dans ce secteur.",
        "Walkers raise accessibility concerns."
      ],
      [
        "Iris",
        "Comparons d'abord les passages aux mêmes périodes, avec une étude du sol.",
        "They should compare comparable counts and inspect the ground."
      ],
      [
        "Mathieu",
        "Si les dommages sont confirmés, discutons d'une protection ciblée ou d'une déviation praticable.",
        "Conservation response should match evidence."
      ],
      [
        "Iris",
        "Je distinguerai les observations d'érosion, les chiffres partiels et les décisions non prises.",
        "She will separate data from proposed policy."
      ]
    ],
    "paragraphs": [
      "Une réserve naturelle publie un panneau annonçant que la fréquentation d'un sentier a doublé pendant l'été. Iris souhaite protéger les zones fragiles autour du ruisseau, où des promeneurs ont photographié des sols abîmés. Mathieu examine cependant le compteur automatique. Il a été hors service pendant deux semaines et l'année précédente les relevés disponibles avaient été réalisés pendant une autre saison. Certains passages peuvent également représenter la même personne faisant un aller-retour. Les chiffres ne constituent donc pas une comparaison fiable de la fréquentation sur deux étés complets.",
      "Les traces d'érosion méritent un examen indépendant des erreurs de comptage. Une association réclame la fermeture permanente de l'itinéraire; plusieurs habitants répondent que ce chemin reste l'un des rares parcours relativement accessibles. Mathieu refuse de présenter l'une ou l'autre position comme déjà adoptée par les gestionnaires. Les documents montrent des préoccupations réelles, des données partielles et un débat sur les solutions possibles. Ils n'établissent ni la responsabilité individuelle des visiteurs ni l'efficacité d'une fermeture. La conservation d'un site naturel demande parfois des restrictions, mais celles-ci doivent être adaptées aux problèmes constatés.",
      "L'équipe prépare un suivi qui séparera la mesure des passages, l'étude du sol et la consultation des usagers. Les compteurs seront contrôlés et les périodes comparées explicitement. Les zones d'érosion seront observées selon un protocole compréhensible. Si les dommages sont confirmés, les gestionnaires pourront étudier une protection ciblée, une signalisation ou une déviation accessible. La nouvelle communication retire la formule « fréquentation doublée » jusqu'à ce que les données puissent la soutenir. Elle indique clairement qu'aucune fermeture permanente n'a été décidée et que les habitants peuvent participer à l'examen des options."
    ],
    "readingTitle": "Compter des passages ne signifie pas compter des personnes",
    "evidence": [
      {
        "label": "Forest traffic campaign sign",
        "type": "poster",
        "french": "La fréquentation a doublé cet été: chaque visiteur menace notre forêt! Fermeture définitive indispensable. Le panneau n'indique ni panne du compteur, ni période de comparaison ni décision officielle de fermeture."
      },
      {
        "label": "Trail equipment and observation log",
        "type": "data",
        "french": "Compteur indisponible pendant deux semaines; période antérieure différente, passages répétés possibles. Observations distinctes d'érosion près du ruisseau. Aucune décision administrative de fermeture permanente consignée."
      }
    ],
    "reading": [
      [
        "What stopped working for two weeks?",
        "le compteur du sentier",
        "le pont",
        "la fontaine",
        "The trail counter had a two-week outage."
      ],
      [
        "What evidence does exist near the stream?",
        "des observations d'érosion",
        "une fermeture définitive signée",
        "un doublement vérifié",
        "Observed erosion is distinct from an unverified doubling claim."
      ],
      [
        "What measure remains undecided?",
        "une fermeture permanente",
        "le contrôle des compteurs",
        "l'observation du sol",
        "No official permanent closure has been adopted."
      ]
    ],
    "compare": [
      [
        "Which source calls closure indispensable?",
        "le panneau",
        "le journal du compteur",
        "les deux approuvent une fermeture",
        "The campaign sign recommends permanent closure without supporting the claim."
      ],
      [
        "Which source documents incomplete and mismatched counting?",
        "le journal",
        "le panneau",
        "aucun des deux",
        "The equipment log describes the outage and non-comparable measurement periods."
      ]
    ],
    "listen": [
      [
        "What visitor claim appears on the sign?",
        "un doublement",
        "une division par deux",
        "une baisse à zéro",
        "Iris quotes an unverified doubling of visitor traffic."
      ],
      [
        "How long was the counter broken?",
        "deux semaines",
        "deux jours",
        "un an",
        "Mathieu identifies a two-week equipment outage."
      ],
      [
        "Where was erosion observed?",
        "près du ruisseau",
        "dans la gare",
        "sur le parking de l'école",
        "Iris describes soil damage near the stream."
      ],
      [
        "What restriction is demanded by one group?",
        "une fermeture définitive",
        "un élargissement automatique",
        "une visite nocturne",
        "One association requests permanent closure, not yet an official decision."
      ],
      [
        "What concern do walkers raise?",
        "l'accès aux itinéraires",
        "le prix des livres",
        "l'horaire du cinéma",
        "Walkers note few accessible alternative routes in the area."
      ],
      [
        "What action comes before policy?",
        "comparer les mesures et étudier le sol",
        "fermer sans étude",
        "accuser tous les visiteurs",
        "The speakers propose comparable counts and direct ecological assessment."
      ]
    ],
    "clozes": [
      [
        "Selon le journal, le compteur ___ en panne deux semaines. (être, passé composé)",
        "a été",
        "Passé composé reports a dated interruption rather than making an eternal state.",
        "source reporting"
      ],
      [
        "La deuxième période est ___ comparable que la première. (less)",
        "moins",
        "Moins ... que expresses the methodological weakness of inconsistent periods.",
        "comparison"
      ]
    ],
    "order": [
      "Aucune fermeture n'a été décidée",
      [
        "n'a été décidée",
        "Aucune fermeture"
      ],
      "A proposed policy must not be described as an already authorized restriction.",
      "status distinction"
    ],
    "writing": {
      "listening": [
        "Summarize the conservation debate without treating a poster as proof.",
        "Iris cite une campagne affirmant que la fréquentation du sentier a doublé. Mathieu explique qu'un compteur a été en panne pendant deux semaines et que les périodes comparées ne sont pas équivalentes. Des habitants ont réellement observé une érosion près du ruisseau, mais son origine reste à examiner. Une association demande une fermeture permanente, tandis que des marcheurs soulignent le manque d'alternatives accessibles. Les interlocuteurs proposent des relevés comparables et une étude du sol avant toute décision. Iris corrigera le panneau pour distinguer les faits des propositions."
      ],
      "sources": [
        "Draft a careful notice comparing the trail poster and equipment log.",
        "Le panneau de campagne annonce un doublement de la fréquentation et présente une fermeture définitive comme nécessaire. Le journal technique indique pourtant une panne de compteur, des périodes différentes et la possibilité de passages comptés plusieurs fois. Ces conditions ne permettent pas de calculer une hausse fiable. Des observations d'érosion près du ruisseau sont documentées séparément et justifient une étude. Aucune fermeture permanente n'est adoptée dans les pièces examinées. Les gestionnaires vérifieront les compteurs, compareront les saisons et consulteront les usagers avant d'envisager des mesures ciblées."
      ],
      "debate": [
        "Defend proportionate ecological protection while engaging access concerns.",
        "Je soutiens la protection des zones fragiles, surtout lorsque des signes d'érosion sont observés. Mais je ne décrirais pas la fréquentation comme doublée sur la base d'un compteur défaillant et de périodes non comparables. Certains défenseurs de la nature souhaitent une fermeture rapide, alors que des marcheurs craignent de perdre un parcours accessible. Ces deux préoccupations méritent d'être entendues. Une étude du sol, des mesures fiables et une consultation permettraient de choisir une solution proportionnée. Si les dommages graves étaient confirmés, une restriction ciblée pourrait devenir justifiée. Aucune fermeture générale ne devrait être présentée comme déjà décidée."
      ]
    },
    "oral": [
      "Explain why ecological observation and visitor-count claims need separate evidence.",
      "On a observé une érosion près du ruisseau, ce qui mérite un examen. Cependant, le compteur de passages est resté en panne et les données des deux périodes ne sont pas comparables. On ne peut donc pas affirmer que les visiteurs ont doublé. Je recommanderais une étude du sol et de nouvelles mesures avant de choisir une restriction. Une déviation accessible pourrait être discutée si les dommages sont confirmés."
    ]
  }
];
export const U22_145_147=Object.freeze(SOURCE.map((s,i)=>originalB2DebateProduction(s,145+i)));
