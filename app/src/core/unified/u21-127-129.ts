import {originalB2DebateProduction,type U21OriginalSourceStory} from './u21-content-helper.ts';
const SOURCE:readonly U21OriginalSourceStory[]=[
  {
    "id": "transfer-127",
    "title": "Public-library repair diaries: maintenance logs, anecdotal failures and user trust",
    "goal": "Differentiate reported incidents from complete reliability statistics and write a reasoned service-status report.",
    "grammarKeys": [
      "passive",
      "condition"
    ],
    "vocabulary": [
      [
        "une panne",
        "failure",
        "La panne a été signalée mardi."
      ],
      [
        "un incident",
        "incident",
        "L’incident ne concerne qu’un appareil."
      ],
      [
        "un registre",
        "log",
        "Le registre indique les demandes."
      ],
      [
        "une réparation",
        "repair",
        "La réparation reste à vérifier."
      ],
      [
        "un emprunt",
        "loan",
        "L’emprunt est momentanément suspendu."
      ],
      [
        "un usager",
        "user",
        "L’usager explique son expérience."
      ],
      [
        "une disponibilité",
        "availability",
        "La disponibilité varie selon l’appareil."
      ],
      [
        "une intervention",
        "intervention",
        "L’intervention a été programmée."
      ],
      [
        "un contrôle",
        "check",
        "Le contrôle doit être documenté."
      ],
      [
        "une statistique",
        "statistic",
        "La statistique demande un dénominateur."
      ],
      [
        "un témoignage",
        "testimony",
        "Le témoignage décrit un cas précis."
      ],
      [
        "une garantie",
        "guarantee",
        "La garantie ne peut pas être inventée."
      ]
    ],
    "dialogue": [
      [
        "Céline",
        "Trois usagers se plaignent d’une liseuse prêtée par la bibliothèque, et l’affiche affirme que tous les appareils sont défectueux.",
        "Three complaints trigger an unsupported universal claim."
      ],
      [
        "Malik",
        "Les réclamations peuvent concerner le même appareil ou la même panne; nous n’avons pas encore le nombre total d’emprunts.",
        "The denominator and duplication are unknown."
      ],
      [
        "Céline",
        "Le registre mentionne une intervention prévue, mais pas un contrôle final confirmant la disparition du problème.",
        "A scheduled intervention isn't verified repair."
      ],
      [
        "Malik",
        "Nous devrions suspendre uniquement les prêts concernés suivant les décisions du service, plutôt que conclure que chaque appareil est dangereux.",
        "Scope action to established service decisions."
      ],
      [
        "Céline",
        "Une lectrice dit que l’écran s’est figé pendant son trajet, et son expérience mérite une réponse.",
        "The user's experience matters even if limited."
      ],
      [
        "Malik",
        "Cela ne prouve pas que toutes les unités présentent le même défaut, ni que l’intervention a déjà réussi.",
        "Individual cases don't establish a fleet-wide trend."
      ],
      [
        "Céline",
        "Je voudrais présenter les signalements, les appareils effectivement examinés et les prochaines vérifications.",
        "Document reports, examinations and pending steps."
      ],
      [
        "Malik",
        "Si le contrôle confirme le résultat, nous pourrons actualiser la disponibilité sans parler d’une fiabilité éternelle.",
        "Verified status can be updated conditionally."
      ],
      [
        "Céline",
        "Je réécrirai la note pour informer les lecteurs sans masquer les incidents ni généraliser au-delà des preuves.",
        "Rewrite with bounded claims."
      ]
    ],
    "paragraphs": [
      "La bibliothèque du quartier propose plusieurs liseuses en prêt. Au cours d’une semaine, trois utilisateurs signalent des difficultés : un écran qui se bloque et des redémarrages inattendus. Céline souhaite alerter les lecteurs et écrit que tous les appareils sont défectueux. Malik consulte le registre et constate que certains signalements semblent concerner une même unité. Le service ne dispose pas encore du nombre exact de prêts correspondant à la période. Les plaintes sont importantes, mais elles ne permettent donc pas d’établir un taux de panne général ou de conclure que tous les appareils ont le même défaut.",
      "Une intervention technique a été programmée pour l’une des liseuses, sans qu’un contrôle final soit enregistré. La fiche de maintenance et les récits des lecteurs ne décrivent pas la même chose : la première documente des décisions de service, les seconds racontent des expériences individuelles. Aucun document disponible ne confirme un résultat durable de la réparation. La bibliothèque doit respecter les restrictions déjà décidées sur certains prêts sans inventer une certification pour les autres appareils. Elle souhaite également inviter les usagers à signaler des problèmes précis sans publier de données personnelles.",
      "Céline rédige un avis indiquant quels prêts sont momentanément suspendus, quels signalements ont été reçus et à quel moment une mise à jour sera possible. Les résultats ne seront annoncés comme vérifiés qu’après les contrôles correspondants. Le service pourra étudier ultérieurement la fréquence des incidents si les données deviennent comparables. Une information claire reconnaît la gêne des lecteurs et la valeur de leurs témoignages, tout en distinguant une observation singulière d’une conclusion statistique sur le matériel."
    ],
    "evidence": [
      {
        "label": "Public user complaints collected at circulation desk",
        "type": "chat",
        "french": "Trois réclamations relatives à une liseuse; certaines décrivent un écran figé et pourraient concerner le même exemplaire. Aucun total complet des prêts de la période n’accompagne ce relevé."
      },
      {
        "label": "Library maintenance work-order log",
        "type": "data",
        "french": "Intervention prévue sur un appareil identifié. Prêt de cet exemplaire suspendu. Aucun compte rendu de vérification finale ni de réparation confirmée n’est enregistré."
      }
    ],
    "reading": [
      [
        "What is absent for a meaningful failure rate?",
        "le total des emprunts",
        "les trois plaintes",
        "l’existence des liseuses",
        "The denominator is missing and complaints may overlap."
      ],
      [
        "What has not been established?",
        "la réparation vérifiée",
        "une intervention programmée",
        "un prêt suspendu",
        "A scheduled visit cannot prove the defect is resolved."
      ],
      [
        "Which notice is defensible?",
        "décrire les cas et les contrôles attendus",
        "déclarer tous les appareils cassés",
        "certifier la fiabilité future",
        "A bounded status report separates incidents from general reliability."
      ]
    ],
    "compare": [
      [
        "Which document records three user experiences?",
        "les réclamations",
        "le registre de maintenance",
        "aucun",
        "The user reports contain the three complaints."
      ],
      [
        "Which document identifies an intervention not yet verified?",
        "le registre",
        "les réclamations",
        "les deux certifient la réparation",
        "The work order lists pending maintenance."
      ]
    ],
    "listen": [
      [
        "How many complaints were received?",
        "trois",
        "douze",
        "cent",
        "Céline cites three complaints."
      ],
      [
        "Which device is involved?",
        "une liseuse",
        "une lampe",
        "un vélo",
        "The library lends e-readers."
      ],
      [
        "What numerical quantity is missing?",
        "le total des emprunts",
        "le nombre de plaintes",
        "une date possible",
        "Malik notes an unknown denominator."
      ],
      [
        "Has final repair been confirmed?",
        "non",
        "oui",
        "sur tous les appareils",
        "No completed verification is logged."
      ],
      [
        "What will Céline distinguish?",
        "signalements et contrôles",
        "garanties et achats",
        "livres et enfants",
        "She plans to separate reports and checked equipment."
      ],
      [
        "What condition permits an update?",
        "un contrôle concluant",
        "une promesse orale",
        "un slogan",
        "Availability claims should follow actual checks."
      ]
    ],
    "clozes": [
      [
        "Une intervention ___ programmée. (être, passé composé passif)",
        "a été",
        "A été programmée describes scheduling, not a verified repair.",
        "passive"
      ],
      [
        "Si le contrôle réussit, nous ___ la notice. (actualiser, futur)",
        "actualiserons",
        "The future actualiserons follows a real si-condition.",
        "condition"
      ]
    ],
    "order": [
      "La réparation reste à vérifier",
      [
        "reste à vérifier",
        "La réparation"
      ],
      "A planned intervention is not evidence of restored reliability.",
      "maintenance"
    ],
    "writing": {
      "listening": [
        "Summarize the maintenance dispute without claiming a fleet-wide fault.",
        "Céline reçoit trois plaintes concernant des liseuses et souhaite annoncer que tout le matériel est défectueux. Malik rappelle que plusieurs réclamations peuvent décrire un même appareil et que le total des emprunts n’est pas connu. Une intervention est prévue, mais sa réussite n’a pas été vérifiée. La bibliothèque souhaite prendre au sérieux les expériences des lecteurs, suspendre les prêts concernés et publier une information précise. Elle pourra actualiser l’avis après les contrôles, sans transformer une réparation ponctuelle en garantie universelle."
      ],
      "sources": [
        "Write a corrected status bulletin distinguishing reports from completed checks.",
        "La bibliothèque a reçu trois signalements de difficultés concernant des liseuses. Certains pourraient concerner le même exemplaire; le nombre total de prêts de la période n’a pas encore été établi. Le registre confirme une intervention programmée et la suspension du prêt d’un appareil, sans contrôle final de réparation. Nous ne pouvons donc pas affirmer que tous les équipements présentent le même problème, ni que l’appareil examiné fonctionne désormais sans réserve. Les lecteurs pourront consulter les disponibilités mises à jour après vérification et transmettre des signalements précis au service."
      ],
      "debate": [
        "Defend openness about faults while responding to fears of undermining public confidence.",
        "Une bibliothèque doit traiter sérieusement les pannes signalées par les usagers. Trois plaintes peuvent justifier une action sur les appareils concernés, même si leur fréquence globale reste inconnue. Certains responsables craignent qu’une communication prudente inquiète les lecteurs; d’autres souhaitent annoncer immédiatement une réparation totale. Je recommande un avis factuel, indiquant les prêts suspendus, les vérifications programmées et les résultats réellement confirmés. Si de nouvelles données établissent un problème plus large, le service pourra élargir son action. La confiance repose sur la distinction entre signalement, diagnostic et réparation vérifiée."
      ]
    },
    "oral": [
      "Explain what the three complaints prove and what they do not.",
      "Trois usagers ont signalé des problèmes, mais nous ne savons pas combien d’emprunts ont été effectués ni si les plaintes concernent des appareils différents. Une intervention est programmée sans résultat final. Je recommande une information limitée aux faits et une mise à jour après contrôle."
    ]
  },
  {
    "id": "transfer-128",
    "title": "Historic neighborhood cookbook: oral recipe variants and false claims of a single authentic version",
    "goal": "Compare multiple family recollections without fabricating ingredient identity or declaring one tradition uniquely authentic.",
    "grammarKeys": [
      "report",
      "concession"
    ],
    "vocabulary": [
      [
        "une recette",
        "recipe",
        "La recette a plusieurs variantes."
      ],
      [
        "une tradition",
        "tradition",
        "La tradition change entre les familles."
      ],
      [
        "un ingrédient",
        "ingredient",
        "L’ingrédient exact reste inconnu."
      ],
      [
        "un carnet",
        "notebook",
        "Le carnet omet une quantité."
      ],
      [
        "un témoignage",
        "recollection",
        "Le témoignage raconte un repas."
      ],
      [
        "une variante",
        "variant",
        "La variante utilise une autre herbe."
      ],
      [
        "une adaptation",
        "adaptation",
        "L’adaptation est récente."
      ],
      [
        "une origine",
        "origin",
        "L’origine certaine n’est pas établie."
      ],
      [
        "une cuisson",
        "cooking",
        "La cuisson dépend du plat."
      ],
      [
        "une mémoire",
        "memory",
        "La mémoire conserve l’ambiance."
      ],
      [
        "une composition",
        "ingredients",
        "La composition ne doit pas être garantie."
      ],
      [
        "une transmission",
        "passing down",
        "La transmission est souvent orale."
      ]
    ],
    "dialogue": [
      [
        "Fatima",
        "Dans le livre collectif, on annonce une recette authentique unique du quartier, alors que trois familles m’ont raconté des versions différentes.",
        "Three families give different versions despite the single-authentic claim."
      ],
      [
        "Hervé",
        "Le carnet de 1950 nomme une herbe locale sans préciser son identité ni la quantité exacte.",
        "The older notebook names an unidentified herb."
      ],
      [
        "Fatima",
        "Une version moderne remplace cette herbe par un produit du marché et se présente comme la recette originale.",
        "The modern substitution claims identity without evidence."
      ],
      [
        "Hervé",
        "Cela peut être une adaptation intéressante, mais il faut la décrire comme telle.",
        "An adaptation should be labeled honestly."
      ],
      [
        "Fatima",
        "Une participante se souvient surtout du repas partagé après le travail, pas de toutes les étapes de cuisine.",
        "Memory preserves social context beyond reproducible instructions."
      ],
      [
        "Hervé",
        "Nous devons distinguer les récits culturels de la composition vérifiée d’un plat réellement préparé aujourd’hui.",
        "Do not treat recollection as tested ingredient information."
      ],
      [
        "Fatima",
        "L’éditeur souhaite un seul titre simple, car trop de variantes lui semblent confuses.",
        "The editor favors a marketable single story."
      ],
      [
        "Hervé",
        "On peut proposer une introduction claire puis expliquer les différences et les lacunes, sans effacer les familles.",
        "Structure can preserve nuance."
      ],
      [
        "Fatima",
        "Je réviserai le chapitre pour garder chaque voix et éviter les garanties alimentaires sans fondement.",
        "She'll revise attribution and ingredient claims."
      ]
    ],
    "paragraphs": [
      "Une association culturelle prépare un livre sur les recettes transmises dans un ancien quartier ouvrier. Fatima interroge plusieurs familles et découvre que les souvenirs diffèrent concernant une soupe partagée lors des fêtes. L’éditeur propose de présenter une seule version comme « la recette authentique ». Fatima hésite, car le carnet le plus ancien mentionne une herbe locale sans fournir son identification précise ni les quantités employées. Le document est une trace précieuse, mais il ne suffit pas à reconstituer sans incertitude une préparation alimentaire complète. La diversité des témoignages fait partie de l’histoire du quartier.",
      "Une fiche contemporaine remplace cette herbe par un produit vendu aujourd’hui. Elle se présente cependant comme identique à la soupe du carnet. Hervé explique que cette ressemblance n’a pas été établie. Une adaptation peut être utile aux lecteurs si ses ingrédients réels sont décrits, mais elle ne devient pas automatiquement un original historique. D’autres participants racontent les circonstances du repas, le travail collectif et les relations familiales plutôt que les recettes elles-mêmes. Ces souvenirs doivent être attribués à leurs auteurs et ne peuvent pas être transformés en consignes de composition vérifiées.",
      "Fatima organise le chapitre en trois parties : les témoignages, les documents anciens et les adaptations contemporaines. Une introduction expliquera que plusieurs traditions familiales ont coexisté. Les détails inconnus seront signalés au lieu d’être comblés par une invention. Les lecteurs pourront apprécier les récits et comprendre les conditions de leur transmission sans croire qu’un produit moderne a été identifié comme l’herbe du carnet. Le livre préservera ainsi une mémoire vivante et plurielle, tout en distinguant les sources historiques des propositions culinaires d’aujourd’hui."
    ],
    "evidence": [
      {
        "label": "Family recipe notebook, 1950",
        "type": "article",
        "french": "« Notre soupe de fête se faisait avec l’herbe du jardin. » Aucun nom botanique, dosage complet ou indication vérifiée de composition ne figure dans le passage conservé."
      },
      {
        "label": "Modern neighborhood recipe card",
        "type": "poster",
        "french": "« La véritable soupe originale » : la fiche substitue une herbe commerciale à celle du carnet, sans preuve qu’il s’agit du même ingrédient ni qu’une seule tradition ait existé."
      }
    ],
    "reading": [
      [
        "What cannot be reconstructed from the notebook?",
        "l’identité complète de l’herbe",
        "l’existence d’une soupe",
        "le contexte du quartier",
        "The source lacks precise ingredient identity and quantities."
      ],
      [
        "What is misleading about the modern card?",
        "elle assimile la substitution à l’original",
        "elle est récente",
        "elle décrit un repas",
        "The substitution is not verified as the historical ingredient."
      ],
      [
        "What chapter structure is best supported?",
        "témoignages, documents et adaptations",
        "une seule version certifiée",
        "les souvenirs anonymes sans contexte",
        "Multiple source genres should remain distinct."
      ]
    ],
    "compare": [
      [
        "Which source mentions an unidentified garden herb?",
        "le carnet ancien",
        "la fiche actuelle",
        "aucun",
        "The old notebook contains the uncertain ingredient."
      ],
      [
        "Which text claims a modern recipe is uniquely authentic?",
        "la fiche moderne",
        "le carnet",
        "les deux garantissent les ingrédients",
        "The contemporary card makes the unsupported claim."
      ]
    ],
    "listen": [
      [
        "How many families gave different versions?",
        "trois",
        "une seule",
        "dix",
        "Fatima interviewed three families."
      ],
      [
        "What ingredient is unclear?",
        "une herbe locale",
        "une pomme certaine",
        "de l’eau",
        "The notebook doesn't identify the plant."
      ],
      [
        "What did the modern version change?",
        "l’herbe utilisée",
        "la date du carnet",
        "le nom de l’association",
        "The substitute is a commercial herb."
      ],
      [
        "What do some stories emphasize?",
        "le repas collectif",
        "les quantités précises",
        "un prix certain",
        "The memories preserve social context."
      ],
      [
        "Why does the editor want one title?",
        "la simplicité",
        "une preuve scientifique",
        "un vote officiel",
        "The editor is concerned about reader clarity."
      ],
      [
        "What will Fatima preserve?",
        "des voix distinctes",
        "une version imposée",
        "une composition garantie",
        "The chapter will retain variant sources."
      ]
    ],
    "clozes": [
      [
        "Hervé a expliqué que les variantes ___ différentes. (être, imparfait)",
        "étaient",
        "Reported explanation calls for plural imperfect étaient.",
        "reported voices"
      ],
      [
        "Bien que la fiche ___ moderne, elle peut être utile. (être)",
        "soit",
        "Bien que takes subjunctive soit.",
        "concession"
      ]
    ],
    "order": [
      "Les recettes restent à comparer",
      [
        "restent à comparer",
        "Les recettes"
      ],
      "Distinct families can preserve differing legitimate traditions.",
      "source diversity"
    ],
    "writing": {
      "listening": [
        "Recount the editorial conflict without claiming an authenticated recipe.",
        "Fatima reçoit trois versions différentes d’une soupe traditionnelle. Hervé remarque que le carnet le plus ancien ne précise pas l’identité de l’herbe locale et qu’une fiche moderne a remplacé cet ingrédient sans preuve d’équivalence. L’éditeur souhaiterait une version unique pour faciliter la lecture, mais les souvenirs familiaux conservent également l’histoire des repas collectifs. Fatima décide de présenter séparément les témoignages, les documents anciens et les adaptations. Le chapitre n’affirmera ni une origine unique ni une composition alimentaire non vérifiée."
      ],
      "sources": [
        "Prepare a balanced historical cookbook introduction using both documents.",
        "Ce chapitre présente plusieurs souvenirs d’une soupe préparée dans le quartier. Le carnet de 1950 évoque une herbe de jardin, sans préciser son identité ou sa quantité. Une fiche contemporaine propose une substitution et décrit sa version comme authentique, mais cette équivalence n’est pas démontrée. Nous considérons donc le premier texte comme une trace historique et le second comme une adaptation moderne. Les témoignages des familles apportent d’autres variantes ainsi que des souvenirs de repas partagés. Ce livre ne prétend pas garantir une composition alimentaire ancienne dont tous les éléments n’ont pas été établis."
      ],
      "debate": [
        "Defend plural culinary memory with a fair response to readers seeking a practical recipe.",
        "Je comprends qu’un lecteur souhaite découvrir une recette claire et facile à suivre. Une version moderne peut servir d’introduction à une tradition et donner envie de connaître son histoire. Pourtant, trois familles décrivent des variantes et le carnet de 1950 ne permet pas de déterminer précisément l’herbe employée. Présenter la substitution actuelle comme l’unique recette authentique effacerait les différences entre les témoignages. Je recommande de conserver les récits avec leur origine, puis de proposer séparément une adaptation dont les ingrédients réels sont documentés. Le lecteur pourra ainsi distinguer histoire et pratique contemporaine sans recevoir de garantie inventée."
      ]
    },
    "oral": [
      "Explain why one modern recipe should not be labeled uniquely authentic.",
      "Trois familles racontent différentes versions de la soupe. Le carnet ancien mentionne une herbe sans l’identifier exactement, tandis que la fiche moderne utilise un substitut. Je recommande de présenter les souvenirs et les adaptations séparément, avec leurs sources. Une version pratique peut être utile sans devenir la seule tradition authentique."
    ]
  },
  {
    "id": "transfer-129",
    "title": "Community science fair: citizen noise maps, uncalibrated devices and policy claims",
    "goal": "Critically compare crowd-sourced sound readings and source methodology before proposing urban policy.",
    "grammarKeys": [
      "compare",
      "condition"
    ],
    "vocabulary": [
      [
        "un bruit",
        "noise",
        "Le bruit varie selon l’heure."
      ],
      [
        "une mesure",
        "measurement",
        "La mesure dépend du dispositif."
      ],
      [
        "un capteur",
        "sensor",
        "Le capteur n’a pas été calibré."
      ],
      [
        "une carte",
        "map",
        "La carte affiche plusieurs couleurs."
      ],
      [
        "une nuisance",
        "nuisance",
        "La nuisance est ressentie différemment."
      ],
      [
        "un relevé",
        "reading",
        "Le relevé est daté."
      ],
      [
        "une comparaison",
        "comparison",
        "La comparaison exige une méthode commune."
      ],
      [
        "un étalonnage",
        "calibration",
        "L’étalonnage n’est pas documenté."
      ],
      [
        "une consultation",
        "consultation",
        "La consultation recueille des récits."
      ],
      [
        "une proposition",
        "proposal",
        "La proposition reste en discussion."
      ],
      [
        "un règlement",
        "regulation",
        "Le règlement ne peut pas être inventé."
      ],
      [
        "un protocole",
        "protocol",
        "Le protocole doit préciser les conditions."
      ]
    ],
    "dialogue": [
      [
        "Milo",
        "Les élèves ont créé une carte sonore du quartier et l’affiche affirme que la rue du marché dépasse toujours les limites autorisées.",
        "The poster claims a constant legal breach from student readings."
      ],
      [
        "Roxane",
        "Les téléphones employés ne sont pas étalonnés et les relevés ont été faits à des heures très différentes.",
        "The instruments and timings aren't comparable."
      ],
      [
        "Milo",
        "Cela ne signifie pas que le bruit ressenti par les habitants est imaginaire; plusieurs personnes décrivent des difficultés.",
        "Resident discomfort remains relevant."
      ],
      [
        "Roxane",
        "Un témoignage personnel n’est cependant pas la même chose qu’une mesure conforme à une procédure officielle.",
        "Personal reports and regulatory evidence serve different roles."
      ],
      [
        "Milo",
        "La carte pourrait indiquer les lieux et horaires des observations sans afficher un verdict juridique.",
        "Show observations rather than legal conclusions."
      ],
      [
        "Roxane",
        "Nous pourrions consulter les habitants puis demander à un service compétent comment réaliser une étude appropriée.",
        "Seek expert methodology."
      ],
      [
        "Milo",
        "Certains proposent déjà une interdiction des événements du soir, mais le conseil n’a pas débattu cette mesure.",
        "A ban is not yet a decision."
      ],
      [
        "Roxane",
        "L’équipe devrait comparer les besoins des riverains et les usages culturels avant de soutenir une politique proportionnée.",
        "Address competing legitimate interests."
      ],
      [
        "Milo",
        "Je réviserai le dossier pour distinguer carte participative, méthode de mesure et éventuelle décision publique.",
        "Separate field notes from authority."
      ]
    ],
    "paragraphs": [
      "Pour une foire de sciences, des élèves créent une carte du bruit de leur quartier. Ils enregistrent des valeurs sur plusieurs téléphones personnels et associent des couleurs aux rues visitées. Une affiche affirme que la rue du marché dépasse en permanence les limites autorisées. Roxane examine le protocole et constate que les dispositifs n’ont pas été étalonnés de manière documentée. De plus, certains relevés proviennent du matin et d’autres d’une soirée animée. Les nombres rassemblés peuvent donner envie de poursuivre l’étude, mais ils ne constituent pas des mesures réglementaires directement comparables.",
      "Les habitants ont également des expériences variées. Plusieurs riverains signalent que certains événements sont difficiles à supporter, tandis que des associations apprécient les rencontres organisées dans le quartier. Milo reconnaît que ces préoccupations ne doivent pas être effacées au motif que les capteurs sont imparfaits. Cependant, une plainte et une carte participative ne prouvent pas automatiquement une infraction juridique ni la nécessité d’une interdiction générale. Aucune décision de ce type ne figure dans le compte rendu municipal consulté. Il faut distinguer les besoins ressentis, les observations techniques et les politiques qui restent à discuter.",
      "Les élèves décident de conserver leurs données avec leurs dates, lieux et limites méthodologiques. Ils demanderont à un service compétent quel protocole serait nécessaire pour approfondir la question. La présentation proposera aussi un espace de dialogue sur les usages culturels et la tranquillité des résidents. Les étudiants souhaitent montrer qu’une recherche citoyenne peut être utile sans revendiquer une autorité qu’elle ne possède pas. Une carte honnête signale ce qui a été observé, comment cela a été recueilli et quelles conclusions restent encore ouvertes."
    ],
    "evidence": [
      {
        "label": "Student crowd-sourced sound map",
        "type": "data",
        "french": "Relevés collectés avec plusieurs téléphones non étalonnés; dates, heures et conditions variables. La carte montre des valeurs locales, sans vérification réglementaire des instruments."
      },
      {
        "label": "Municipal discussion excerpt",
        "type": "minutes",
        "french": "Échanges sur le confort sonore et les activités culturelles, sans décision d’interdiction des événements. Une étude spécialisée et une consultation plus large restent des possibilités."
      }
    ],
    "reading": [
      [
        "Why are the phone readings insufficient for a legal claim?",
        "étalonnage et horaires incompatibles",
        "absence de téléphone",
        "une loi déjà votée",
        "Instrument calibration and time variation matter."
      ],
      [
        "What policy claim is still unsupported?",
        "une interdiction adoptée",
        "une discussion municipale",
        "des plaintes d’habitants",
        "The minutes contain discussion, not a ban."
      ],
      [
        "How should the map be presented?",
        "avec dates et limites",
        "comme verdict judiciaire",
        "sans contexte",
        "Method details and source distinction are essential."
      ]
    ],
    "compare": [
      [
        "Which source contains the uncalibrated readings?",
        "la carte des élèves",
        "le compte rendu",
        "aucun",
        "The student dataset describes measurement conditions."
      ],
      [
        "Which source records an undecided policy discussion?",
        "le compte rendu",
        "la carte",
        "les deux annoncent une interdiction",
        "The municipal note contains debate without adoption."
      ]
    ],
    "listen": [
      [
        "What tool did pupils use?",
        "des téléphones",
        "des satellites certifiés",
        "un microscope",
        "Milo describes crowd-sourced phone sensors."
      ],
      [
        "What is missing from the instruments?",
        "un étalonnage documenté",
        "des couleurs",
        "des batteries garanties",
        "Roxane flags calibration."
      ],
      [
        "What other factor differs?",
        "les heures",
        "les noms de rues",
        "la présence d’un marché",
        "Timing makes readings less comparable."
      ],
      [
        "What do residents describe?",
        "des nuisances ressenties",
        "une décision de justice",
        "un bruit inexistant",
        "Some residents experience discomfort."
      ],
      [
        "Has an event ban been voted?",
        "non",
        "oui",
        "unanimement",
        "The minutes show no such decision."
      ],
      [
        "What will the new report distinguish?",
        "observations et décisions",
        "lois et météo identiques",
        "tous les appareils parfaits",
        "Milo plans a provenance-aware report."
      ]
    ],
    "clozes": [
      [
        "Les relevés sont moins comparables ___ l’affiche ne le prétend.",
        "que",
        "Moins ... que signals a comparison rather than regulatory proof.",
        "comparison"
      ],
      [
        "Si une étude est approuvée, nous ___ un protocole. (suivre, futur)",
        "suivrons",
        "Future suivrons is conditional on approved study conditions.",
        "condition"
      ]
    ],
    "order": [
      "Les mesures restent à valider",
      [
        "restent à valider",
        "Les mesures"
      ],
      "A participatory map cannot by itself establish a legal noise exceedance.",
      "methods"
    ],
    "writing": {
      "listening": [
        "Summarize the students' noise study without making an unsupported legal finding.",
        "Milo présente une carte sonore du quartier créée à partir de téléphones personnels. Roxane explique que les appareils n’ont pas été étalonnés et que les relevés ont été effectués à des heures différentes. Certains habitants se plaignent du bruit, tandis que des associations apprécient les événements culturels. La mairie n’a pas voté d’interdiction générale. Les élèves veulent conserver leurs observations mais corriger l’affiche pour ne plus les présenter comme preuve d’un dépassement réglementaire permanent. Ils envisagent une consultation et une étude plus rigoureuse."
      ],
      "sources": [
        "Write a responsible methods and policy summary from both source documents.",
        "Notre carte participative rassemble des relevés réalisés avec différents téléphones, sans étalonnage documenté et à des horaires variés. Les valeurs présentées ne constituent donc pas, à elles seules, une mesure réglementaire de la rue du marché. Le compte rendu municipal fait état de préoccupations liées au bruit et de l’intérêt des activités culturelles, mais ne contient aucune décision d’interdiction. Nous proposons de conserver les données avec leurs conditions, de demander un avis compétent sur les méthodes et d’organiser une discussion avec les habitants. Toute conclusion officielle devra reposer sur une procédure adaptée."
      ],
      "debate": [
        "Defend participatory science with a counterargument about regulatory reliability.",
        "Je trouve qu’une carte du bruit réalisée par des élèves peut aider un quartier à discuter de problèmes concrets. Les habitants qui signalent des nuisances méritent d’être écoutés, même si les téléphones ne sont pas des instruments réglementaires étalonnés. Certains souhaitent utiliser la carte pour justifier immédiatement l’interdiction des événements du soir. Je pense qu’une telle décision serait prématurée, car les relevés sont peu comparables et les besoins culturels doivent aussi être pris en compte. Je recommande une étude appropriée et une consultation avant toute mesure politique. Cette prudence renforce plutôt qu’elle n’affaiblit le projet citoyen."
      ]
    },
    "oral": [
      "Explain the evidential limits of the student noise map.",
      "Les élèves ont relevé des sons avec des téléphones non étalonnés et à des heures différentes. Ces données ne prouvent pas un dépassement légal constant. Les plaintes des habitants restent importantes, mais aucune interdiction n’a été votée. Je recommande une présentation claire des limites et une étude spécialisée si la commune décide de poursuivre."
    ]
  }
];
export const U21_127_129=Object.freeze(SOURCE.map((record,i)=>originalB2DebateProduction(record,127+i)));
