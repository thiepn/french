import {originalB1ComplexProduction,type U19OriginalSourceStory} from './u19-content-helper.ts';
const SOURCE:readonly U19OriginalSourceStory[]=[
  {
    "id": "transfer-97",
    "title": "Neighborhood archive: an unidentified photo and conflicting place names",
    "goal": "Build a provenance-aware community archive entry without making a guessed location into verified metadata.",
    "grammarKeys": [
      "relative",
      "source"
    ],
    "grammarApplications": [
      [
        "Describe a photo whose location is uncertain.",
        "La photo que je parle montre une place.",
        "La photo dont je parle montre peut-être une place du quartier.",
        "Parler de takes dont and peut-être identifies the uncertain geographic match."
      ],
      [
        "Attribute an archive caption while separating editorial guess and established finding.",
        "La légende prouve que l’image vient de 1940.",
        "Selon la légende provisoire, la photographie pourrait dater des années 1940.",
        "Source attribution and conditional modal avoid converting an uncertain caption to a verified date."
      ]
    ],
    "vocabulary": [
      [
        "un fonds",
        "collection",
        "Le fonds contient des clichés anciens."
      ],
      [
        "une photographie",
        "photograph",
        "La photographie montre une façade."
      ],
      [
        "une légende",
        "caption",
        "La légende est provisoire."
      ],
      [
        "un repère",
        "landmark",
        "Le repère a peut-être changé."
      ],
      [
        "une place",
        "square",
        "La place figure sur plusieurs cartes."
      ],
      [
        "une adresse",
        "address",
        "L’adresse reste à confirmer."
      ],
      [
        "une archive",
        "archive",
        "L’archive conserve des négatifs."
      ],
      [
        "une provenance",
        "provenance",
        "La provenance n’est pas documentée."
      ],
      [
        "une ressemblance",
        "resemblance",
        "La ressemblance ne suffit pas."
      ],
      [
        "un témoin",
        "witness",
        "Un témoin reconnaît une rue."
      ],
      [
        "un inventaire",
        "inventory",
        "L’inventaire distingue les hypothèses."
      ],
      [
        "une correction",
        "correction",
        "La correction conserve l’ancien libellé."
      ]
    ],
    "dialogue": [
      [
        "Zoé",
        "Une photographie reçue sans légende ressemble à l’ancienne place du Marché, alors j’ai écrit cette adresse dans notre catalogue.",
        "I assigned an address based on visual resemblance."
      ],
      [
        "Rami",
        "Le clocher du fond pourrait être celui d’un autre quartier; notre impression n’est pas encore une identification.",
        "The distant tower might belong elsewhere."
      ],
      [
        "Zoé",
        "Une personne âgée pense reconnaître la place, mais elle n’est pas certaine de l’année où la photo a été prise.",
        "An elderly witness thinks it's the square but doesn't know the year."
      ],
      [
        "Rami",
        "Gardons son témoignage comme une proposition attribuée, sans effacer la possibilité d’autres lieux.",
        "We should attribute their suggestion and leave alternatives."
      ],
      [
        "Zoé",
        "Une carte ancienne montre deux rues portant des noms proches, ce qui pourrait expliquer la confusion.",
        "Historical maps contain similar street names."
      ],
      [
        "Rami",
        "Publions la photo avec une localisation incertaine et invitons les habitants à proposer des indices vérifiables.",
        "Publish uncertainty and request verifiable clues."
      ],
      [
        "Zoé",
        "Je voudrais également conserver l’historique des corrections pour que la prochaine équipe comprenne nos changements.",
        "Keep a record of metadata changes."
      ],
      [
        "Rami",
        "C’est préférable à une adresse inventée qui serait ensuite recopiée comme un fait dans plusieurs projets.",
        "Prevent unsupported metadata propagation."
      ]
    ],
    "paragraphs": [
      "Un collectif d’histoire locale reçoit un carton de photographies dont plusieurs ont perdu leurs légendes. Zoé reconnaît dans une image une façade qui lui rappelle la place du Marché. Elle ajoute immédiatement cette adresse à la fiche numérique, puis remarque que la forme du clocher situé au fond ne correspond pas tout à fait à ses souvenirs. Rami lui propose de distinguer une ressemblance visuelle d’une identification démontrée. Une erreur dans un catalogue peut être répétée par de nombreux lecteurs, surtout lorsque l’incertitude du premier classement a disparu.",
      "Une habitante âgée déclare que la photographie pourrait effectivement représenter l’ancienne place, mais reconnaît ne pas savoir à quelle année elle correspond. Une carte d’époque comporte deux rues portant des noms proches et ne permet pas de trancher. Le collectif possède ainsi plusieurs indices, mais aucune preuve suffisante pour fixer l’adresse et la date. Il serait injuste de rejeter le souvenir de l’habitante comme inutile; il serait tout aussi imprudent de le transformer en certitude. Les différents éléments doivent rester attribués et comparables.",
      "Zoé remplace l’adresse affirmative par une localisation proposée et enregistre la correction dans l’historique de la fiche. Elle joint la carte et résume le témoignage avec l’accord de sa source. Une rubrique invite les lecteurs à soumettre de nouveaux documents permettant une vérification. Si une photographie prise sous un autre angle apparaît, l’identification pourra être mise à jour. L’archive devient ainsi un outil de recherche ouvert plutôt qu’un ensemble d’affirmations définitives construites sur une intuition initiale."
    ],
    "evidence": [
      {
        "label": "Unlabeled photograph intake record",
        "type": "data",
        "french": "Photographie de rue sans date ni adresse d’origine. Une ressemblance visuelle avec la place du Marché a été proposée lors du catalogage, sans confirmation indépendante."
      },
      {
        "label": "Local witness and map note",
        "type": "minutes",
        "french": "Une habitante pense reconnaître la place, sans pouvoir dater l’image. Une carte ancienne comporte deux noms de rues voisins et ne permet pas de trancher la localisation."
      }
    ],
    "reading": [
      [
        "What is actually documented about the image?",
        "elle n’a ni date ni adresse confirmées",
        "son emplacement est certain",
        "elle vient directement du musée",
        "The intake record says its metadata are unknown."
      ],
      [
        "Why is the witness's account useful but limited?",
        "elle reconnaît peut-être un lieu",
        "elle fournit un numéro de rue vérifié",
        "elle détient le négatif original",
        "Her recollection adds a lead, not definitive identification."
      ],
      [
        "What protects future researchers?",
        "une fiche avec incertitude et historique",
        "une adresse supposée sans réserve",
        "la suppression du cliché",
        "Traceable qualifications prevent error propagation."
      ]
    ],
    "compare": [
      [
        "Which source describes missing metadata?",
        "la fiche de réception",
        "la note du témoin",
        "aucun",
        "The intake record documents missing date and address."
      ],
      [
        "Which source adds uncertain testimony and similar street names?",
        "la note complémentaire",
        "la fiche de réception",
        "les deux prouvent l’adresse",
        "The witness and map note offers two unresolved leads."
      ]
    ],
    "listen": [
      [
        "What location did Zoé initially suggest?",
        "la place du Marché",
        "la gare centrale",
        "une école",
        "Zoé names the market square."
      ],
      [
        "What visual feature complicates the identification?",
        "un clocher",
        "une rivière",
        "une enseigne lumineuse",
        "Rami questions the distant tower."
      ],
      [
        "Is the historical date known?",
        "non",
        "oui",
        "le témoin la donne précisément",
        "The witness cannot date the scene."
      ],
      [
        "What does the map contain?",
        "des rues aux noms proches",
        "un contrat de vente",
        "une photographie du témoin",
        "The old map has potentially confusing names."
      ],
      [
        "How will Zoé publish the location?",
        "comme hypothèse",
        "comme vérité certaine",
        "en supprimant le lieu",
        "She will mark uncertainty."
      ],
      [
        "What will be preserved for later staff?",
        "l’historique des corrections",
        "uniquement la photo",
        "un titre sans source",
        "Zoé wants traceable changes."
      ]
    ],
    "clozes": [
      [
        "La photographie ___ nous parlons n’est pas datée. (de)",
        "dont",
        "Parler de demands relative dont.",
        "relative"
      ],
      [
        "Selon l’inventaire, l’adresse ___ incertaine. (rester, présent)",
        "reste",
        "Reste expresses the documented uncertainty without guessing.",
        "source"
      ]
    ],
    "order": [
      "La localisation reste à établir",
      [
        "reste à établir",
        "La localisation"
      ],
      "The catalog cannot present an unsupported guess as confirmed.",
      "archival care"
    ],
    "writing": {
      "listening": [
        "Summarize the local-archive conversation accurately.",
        "Zoé a cru reconnaître la place du Marché sur une photographie sans légende. Rami lui a fait remarquer qu’un clocher pouvait correspondre à un autre lieu. Une habitante pense également reconnaître la place, mais ignore la date de l’image, tandis qu’une carte comporte deux noms de rues proches. Le collectif ne dispose donc pas d’une identification certaine. Zoé modifiera la fiche pour signaler cette incertitude, conservera l’historique des corrections et acceptera de nouveaux indices vérifiables avant d’attribuer une adresse définitive."
      ],
      "sources": [
        "Draft a provenance-aware catalog entry.",
        "Photographie de rue, date et adresse inconnues. Lors du premier catalogage, une ressemblance avec l’ancienne place du Marché a été proposée. Une habitante locale évoque la même possibilité, mais ne peut pas dater l’image. Une carte ancienne présente deux noms de rues proches, ce qui empêche pour le moment une identification sûre. La localisation est donc enregistrée comme hypothèse et non comme donnée confirmée. Cette fiche conserve les révisions et pourra être actualisée si une preuve indépendante permet de préciser le lieu."
      ],
      "debate": [
        "Defend public community archives that welcome memory without disguising conjecture as fact.",
        "Je pense qu’une archive locale gagne beaucoup à recueillir les souvenirs des habitants, car ces personnes peuvent reconnaître des éléments absents des dossiers écrits. Cependant, la mémoire et la ressemblance visuelle ne remplacent pas automatiquement une preuve de localisation. Certains souhaitent publier une adresse précise pour faciliter la recherche. Je préférerais une fiche qui indique les hypothèses et permette aux visiteurs d’apporter des documents. Conserver l’historique des corrections est également important : une erreur doit pouvoir être comprise et réparée. L’incertitude affichée ne diminue pas la valeur d’une photographie; elle encourage la recherche."
      ]
    },
    "oral": [
      "Explain why the photograph has no confirmed location.",
      "Zoé a proposé la place du Marché en reconnaissant une façade, mais Rami a signalé un clocher difficile à identifier. Une habitante propose le même lieu sans connaître la date, et la carte ancienne ne permet pas de trancher. Je présenterais donc l’adresse comme une hypothèse et conserverais les sources ainsi que l’historique des corrections."
    ]
  },
  {
    "id": "transfer-98",
    "title": "Short-story adaptation: two endings and the limits of a narrator's knowledge",
    "goal": "Compare a narrator's account with a character letter and defend more than one supported ending interpretation.",
    "grammarKeys": [
      "pluperfect",
      "concession"
    ],
    "grammarApplications": [
      [
        "Explain a letter lost before the storyteller learned of it.",
        "Elle n’a pas reçu la lettre quand il arrivait.",
        "Elle n’avait pas reçu la lettre quand il est arrivé.",
        "Plus-que-parfait situates nonreceipt before a later bounded arrival."
      ],
      [
        "Accept that an alternate ending is plausible without making it canon.",
        "Bien que la deuxième fin est possible, elle n’est pas certaine.",
        "Bien que la deuxième fin soit possible, elle n’est pas imposée par le texte.",
        "Bien que selects the subjunctive and maintains multiple interpretations."
      ]
    ],
    "vocabulary": [
      [
        "un narrateur",
        "narrator",
        "Le narrateur ignore un secret."
      ],
      [
        "une fin",
        "ending",
        "La fin du récit reste ouverte."
      ],
      [
        "un personnage",
        "character",
        "Le personnage change d’avis."
      ],
      [
        "une lettre",
        "letter",
        "La lettre n’a pas été remise."
      ],
      [
        "un malentendu",
        "misunderstanding",
        "Le malentendu entraîne le départ."
      ],
      [
        "un point de vue",
        "perspective",
        "Le point de vue varie."
      ],
      [
        "un indice",
        "clue",
        "L’indice apparaît au dernier chapitre."
      ],
      [
        "une interprétation",
        "interpretation",
        "L’interprétation exige des preuves."
      ],
      [
        "une adaptation",
        "adaptation",
        "L’adaptation propose une autre fin."
      ],
      [
        "une certitude",
        "certainty",
        "La certitude du narrateur est limitée."
      ],
      [
        "une intention",
        "motive",
        "Son intention n’est pas révélée."
      ],
      [
        "une ambiguïté",
        "ambiguity",
        "L’ambiguïté rend le récit complexe."
      ]
    ],
    "dialogue": [
      [
        "Éva",
        "Dans notre adaptation, j’aimerais que Léonie revienne au village, car le narrateur dit qu’elle regrettait son départ.",
        "I want Léonie to return because the narrator claims she regretted leaving."
      ],
      [
        "Julien",
        "Il déduit son regret d’un silence, mais ne raconte pas ce qu’elle pensait réellement.",
        "The narrator infers regret from silence, not her thoughts."
      ],
      [
        "Éva",
        "Une lettre conservée par un autre personnage dit qu’elle avait déjà décidé de partir avant leur dispute.",
        "A separate letter suggests the decision predates the quarrel."
      ],
      [
        "Julien",
        "Cette lettre n’exclut pas un retour futur; elle rend seulement l’explication du narrateur moins sûre.",
        "The letter weakens one explanation without dictating the future."
      ],
      [
        "Éva",
        "Nous pourrions écrire deux fins, l’une où elle revient pour discuter et l’autre où elle poursuit sa route.",
        "We could write two plausible endings."
      ],
      [
        "Julien",
        "Il faudrait indiquer les indices qui justifient chacune, puis distinguer ce que le texte montre de notre imagination.",
        "We should mark textual evidence and our creative extensions."
      ],
      [
        "Éva",
        "Je préfère éviter une morale qui transforme un personnage complexe en exemple d’un seul sentiment.",
        "I don't want to flatten the character's motives."
      ],
      [
        "Julien",
        "Une adaptation fidèle peut inventer une suite, à condition de reconnaître qu’elle n’était pas imposée par la source.",
        "Creative additions should be distinguished from source facts."
      ]
    ],
    "paragraphs": [
      "Un atelier de lecture prépare une adaptation d’une nouvelle racontée à la première personne. Le narrateur décrit le départ de Léonie et assure qu’elle regrettait d’avoir quitté le village. Éva imagine un dénouement où la jeune femme revient demander pardon. Julien relit le passage et remarque que le narrateur ne parle jamais directement avec Léonie après son départ. Il interprète son silence comme une preuve de regret, sans disposer de ses pensées. Cette distinction fragilise la certitude de l’explication, même si l’émotion du narrateur reste convaincante.",
      "Une lettre citée plus loin dans la nouvelle évoque une décision de partir prise bien avant la dispute. Ce nouveau document suggère que le conflit n’était peut-être pas la seule cause du départ. Il ne raconte pourtant pas ce que Léonie fera ensuite. Éva reconnaît qu’un retour demeure possible, mais qu’il doit être présenté comme un choix d’adaptation et non comme une conclusion obligatoire de l’auteur. Julien propose une autre fin où Léonie poursuit son voyage et écrit simplement aux personnes qu’elle a laissées derrière elle.",
      "Les deux lecteurs préparent une présentation comparant ces dénouements. Pour chaque version, ils citeront un détail du texte qui la rend plausible et préciseront ce qu’ils ont ajouté. Ils éviteront d’attribuer au personnage une intention certaine qui ne figure dans aucun document. Leur objectif n’est pas de choisir une morale unique, mais de montrer comment le point de vue du narrateur oriente l’imagination du lecteur. Une adaptation créative peut donc être rigoureuse lorsqu’elle respecte les limites de l’histoire source."
    ],
    "evidence": [
      {
        "label": "First-person story passage",
        "type": "article",
        "french": "« Léonie ne répondit pas. J’ai compris qu’elle regrettait notre dispute et qu’elle reviendrait un jour. » Le narrateur présente une conclusion personnelle sans rapporter ses pensées."
      },
      {
        "label": "Inserted character letter",
        "type": "article",
        "french": "« J’avais prévu de partir avant notre désaccord. Je ne sais pas encore quand je reviendrai. » La lettre situe une décision antérieure sans fixer l’avenir."
      }
    ],
    "reading": [
      [
        "What supports the narrator's claim of regret?",
        "son interprétation du silence",
        "une confession directe de Léonie",
        "un retour déjà décrit",
        "The first-person narrator infers motive rather than quotes it."
      ],
      [
        "What does the letter establish?",
        "une décision antérieure",
        "un retour impossible",
        "une réconciliation certaine",
        "The letter says the plan predates the quarrel."
      ],
      [
        "What makes two endings legitimate adaptations?",
        "leurs ajouts sont clairement signalés",
        "les deux sont dans la source",
        "toute interprétation est égale",
        "A creative ending must be distinguished from source events."
      ]
    ],
    "compare": [
      [
        "Which source predicts a return as the narrator's impression?",
        "le récit",
        "la lettre",
        "les deux promettent un retour",
        "The narrator interprets the silence optimistically."
      ],
      [
        "Which source states departure was planned before the dispute?",
        "la lettre",
        "le récit",
        "aucun",
        "The character's letter places the plan earlier."
      ]
    ],
    "listen": [
      [
        "Who is the departing character?",
        "Léonie",
        "Éva",
        "Julien",
        "Éva discusses Léonie."
      ],
      [
        "What does the narrator infer?",
        "un regret",
        "un emploi",
        "une maladie",
        "He interprets silence as regret."
      ],
      [
        "What does the letter change?",
        "la chronologie de la décision",
        "le lieu de naissance",
        "la date de publication",
        "It says departure was planned earlier."
      ],
      [
        "How many endings do readers plan?",
        "deux",
        "trois",
        "une seule",
        "They consider two approaches."
      ],
      [
        "Does the letter exclude a future return?",
        "non",
        "oui",
        "elle annonce une date",
        "The letter leaves the future open."
      ],
      [
        "What must be marked in the adaptation?",
        "les ajouts imaginés",
        "les pensées connues",
        "la réponse certaine",
        "Julien wants additions separated from evidence."
      ]
    ],
    "clozes": [
      [
        "Elle ___ décidé de partir avant la dispute. (avoir, plus-que-parfait)",
        "avait",
        "Plus-que-parfait places an earlier plan before the conflict.",
        "timeline"
      ],
      [
        "Bien que son retour ___ possible, rien n’est fixé. (être, subjonctif)",
        "soit",
        "Bien que requires subjunctive soit.",
        "concession"
      ]
    ],
    "order": [
      "La fin reste à imaginer",
      [
        "reste à imaginer",
        "La fin"
      ],
      "An open story supports adaptations, not a fabricated canonical answer.",
      "fiction"
    ],
    "writing": {
      "listening": [
        "Summarize Éva and Julien's disagreement about the short story.",
        "Éva souhaite écrire une fin où Léonie revient, car le narrateur affirme qu’elle regrettait son départ. Julien fait remarquer que cette affirmation vient d’une interprétation du silence. Une lettre indique que Léonie avait déjà prévu de partir avant leur dispute, sans exclure un retour futur. Les lecteurs proposeront deux fins différentes et expliqueront les indices qui les rendent plausibles. Ils distingueront les événements du récit de leurs inventions, pour éviter de présenter un choix d’adaptation comme l’intention certaine de l’autrice."
      ],
      "sources": [
        "Compare the narrator and the letter in a literary paragraph.",
        "Le récit à la première personne affirme que Léonie regrettait la dispute et reviendrait un jour. Pourtant, le narrateur déduit cette idée du silence de son amie et ne connaît pas directement ses pensées. Dans une lettre, Léonie écrit qu’elle avait prévu de partir avant le désaccord et qu’elle ignore quand elle reviendra. Ce document élargit les causes possibles du départ et rend l’anticipation du narrateur incertaine. Une adaptation peut imaginer un retour ou une continuation du voyage, mais elle doit annoncer ce qui relève de la création du lecteur plutôt que du texte établi."
      ],
      "debate": [
        "Defend one plausible ending while acknowledging the alternative as textually credible.",
        "Je choisirais une fin où Léonie poursuit son voyage avant de reprendre contact avec le village par lettre. Ce dénouement respecte sa décision de partir, qu’elle avait prise avant la dispute, et évite de réduire tous ses choix au regret supposé par le narrateur. Éva préfère un retour suivi d’une conversation, et cette solution reste possible puisque la lettre n’exclut pas un retour futur. Cependant, elle n’est pas annoncée comme certaine. Je défends donc mon adaptation en distinguant la chronologie connue, les intentions inconnues et les scènes que j’ajoute pour donner une nouvelle direction au récit."
      ]
    },
    "oral": [
      "Explain why the short story allows more than one plausible ending.",
      "Le narrateur pense que Léonie regrette son départ, mais il interprète seulement son silence. Sa lettre indique qu’elle avait prévu de partir avant la dispute et ne précise pas son avenir. On peut donc imaginer un retour ou la continuation de son voyage. Je présenterais chaque fin comme une adaptation justifiée par certains indices, non comme un événement définitivement raconté par la nouvelle."
    ]
  },
  {
    "id": "transfer-99",
    "title": "River science volunteers: one water sample and a regional conclusion",
    "goal": "Differentiate a short sampling result, a seasonal baseline and a supported environmental claim.",
    "grammarKeys": [
      "compare",
      "condition"
    ],
    "grammarApplications": [
      [
        "Compare short-term measurements without drawing an unsupported long-term conclusion.",
        "Cette mesure prouve que toute la rivière est plus propre.",
        "Cette mesure est plus basse que celle relevée au même point hier, sans établir la tendance du bassin.",
        "A comparative is about the measured pairs, not the entire river's long-term state."
      ],
      [
        "Plan another sampling round as conditional future action.",
        "Si la météo permettra, nous prélèverons demain.",
        "Si la météo le permet, nous prélèverons demain.",
        "Real future condition uses present permet in the si-clause."
      ]
    ],
    "vocabulary": [
      [
        "un prélèvement",
        "sample",
        "Le prélèvement vient d’un seul lieu."
      ],
      [
        "une rivière",
        "river",
        "La rivière traverse plusieurs communes."
      ],
      [
        "une mesure",
        "measurement",
        "La mesure doit être datée."
      ],
      [
        "une saison",
        "season",
        "La saison change le débit."
      ],
      [
        "un débit",
        "flow",
        "Le débit influence les résultats."
      ],
      [
        "un bassin",
        "watershed",
        "Le bassin dépasse ce village."
      ],
      [
        "un laboratoire",
        "laboratory",
        "Le laboratoire fournit un résultat."
      ],
      [
        "une comparaison",
        "comparison",
        "La comparaison exige une méthode stable."
      ],
      [
        "une tendance",
        "trend",
        "Une tendance demande plusieurs séries."
      ],
      [
        "un protocole",
        "protocol",
        "Le protocole décrit le prélèvement."
      ],
      [
        "une observation",
        "observation",
        "L’observation est limitée."
      ],
      [
        "une conclusion",
        "conclusion",
        "La conclusion reste provisoire."
      ]
    ],
    "dialogue": [
      [
        "Maël",
        "Notre groupe a reçu un chiffre plus faible pour un prélèvement de rivière et certains veulent annoncer que toute l’eau du bassin est devenue plus propre.",
        "One lower sample leads some to claim the entire basin improved."
      ],
      [
        "Chloé",
        "Le laboratoire a analysé un seul échantillon pris mardi à un endroit précis; nous ignorons ce qui se passe ailleurs.",
        "A single site sample can't represent the whole watershed."
      ],
      [
        "Maël",
        "Le rapport de l’an dernier a été réalisé pendant une autre saison, alors que le débit était très différent.",
        "The past report comes from a different season and flow."
      ],
      [
        "Chloé",
        "Ces circonstances peuvent limiter la comparaison; il faut décrire les dates, lieux et méthodes au lieu de publier une tendance certaine.",
        "Describe observation contexts."
      ],
      [
        "Maël",
        "Les bénévoles ont travaillé sérieusement; je ne veux pas donner l’impression que leur contribution ne sert à rien.",
        "I value their work while recognizing limits."
      ],
      [
        "Chloé",
        "Le prélèvement constitue une information utile pour ce point et ce jour, même s’il ne mesure pas tout le territoire.",
        "Its local value is real without region-wide extrapolation."
      ],
      [
        "Maël",
        "Nous pourrions poursuivre les relevés avec un protocole commun, puis demander une interprétation compétente des séries.",
        "Plan repeatable sampling and qualified interpretation."
      ],
      [
        "Chloé",
        "Dans le bulletin, écrivons ce que nous avons mesuré et ce que nous ne savons pas encore.",
        "Publish facts and unknowns clearly."
      ]
    ],
    "paragraphs": [
      "Une association de science participative organise des prélèvements dans une rivière qui traverse plusieurs communes. Maël reçoit un résultat de laboratoire inférieur à un chiffre cité dans un ancien rapport. Il imagine que les actions menées par les habitants ont rendu toute l’eau du bassin plus propre. Chloé lui demande de vérifier où et quand les échantillons ont été prélevés. Le résultat récent concerne un seul point de la rivière et une journée précise. Le rapport plus ancien a été rédigé pendant une autre saison, avec des conditions d’écoulement différentes.",
      "Les deux documents peuvent donc contenir des mesures correctement réalisées tout en restant difficiles à comparer directement. Un prélèvement local ne décrit pas nécessairement les autres parties du cours d’eau, et un écart entre deux chiffres n’établit pas une tendance régionale ou la cause d’un changement. Chloé reconnaît néanmoins que le travail des bénévoles est utile : il fournit une observation qui pourra enrichir une série future. Une méthode stable et des dates clairement indiquées aideront à comprendre les variations réelles et les limites des résultats.",
      "Maël prépare un bulletin présentant le lieu, la date et la portée du nouveau prélèvement. Il évite la formule selon laquelle « toute la rivière est redevenue propre » et propose plutôt de poursuivre les mesures avec un protocole commun. Les bénévoles pourront comparer plusieurs séries lorsque des résultats adaptés seront disponibles. Une interprétation plus large devra tenir compte des conditions du bassin et des avis compétents. Le bulletin valorisera l’effort collectif sans présenter une conclusion que les documents actuels ne soutiennent pas."
    ],
    "evidence": [
      {
        "label": "Local laboratory sample result",
        "type": "data",
        "french": "Analyse d’un échantillon prélevé mardi à un point précis de la rivière. Ce chiffre décrit les conditions du prélèvement et ne caractérise pas à lui seul tout le bassin."
      },
      {
        "label": "Previous seasonal watershed report",
        "type": "article",
        "french": "Relevés établis lors d’une autre saison et dans des conditions de débit différentes. Les méthodes et lieux doivent être examinés avant toute comparaison de tendance avec un prélèvement isolé."
      }
    ],
    "reading": [
      [
        "What geographic area is directly measured now?",
        "un point de la rivière",
        "tout le bassin",
        "toutes les communes",
        "The lab report specifies a single sampling location."
      ],
      [
        "What limits direct historical comparison?",
        "saison et débit différents",
        "l’absence de bénévoles",
        "des noms de communes identiques",
        "Sampling conditions and methods differ."
      ],
      [
        "What next step can strengthen the conclusion?",
        "des séries comparables",
        "une annonce régionale immédiate",
        "une photo unique",
        "Repeated standardized data improve trend reasoning."
      ]
    ],
    "compare": [
      [
        "Which document reports Tuesday's local sample?",
        "le résultat du laboratoire",
        "l’ancien rapport",
        "aucun",
        "The lab note names the specific sampling day."
      ],
      [
        "Which source describes a different season and flow?",
        "l’ancien rapport",
        "le résultat local",
        "les deux prouvent une amélioration",
        "The earlier report's context differs."
      ]
    ],
    "listen": [
      [
        "How many recent sampling points are confirmed?",
        "un",
        "douze",
        "tous les points",
        "Chloé mentions only one."
      ],
      [
        "On which day was the sample taken?",
        "mardi",
        "vendredi",
        "dimanche",
        "The lab record says Tuesday."
      ],
      [
        "What is different about the older report?",
        "la saison et le débit",
        "la langue seulement",
        "le propriétaire du musée",
        "Maël notes seasonal differences."
      ],
      [
        "What broad claim is unsupported?",
        "tout le bassin s’est amélioré",
        "un laboratoire a fourni un chiffre",
        "un prélèvement existe",
        "One site cannot prove regional improvement."
      ],
      [
        "How do the speakers view volunteers' work?",
        "utile mais limité",
        "inutile",
        "une certification définitive",
        "They recognize its local value."
      ],
      [
        "What future practice is proposed?",
        "un protocole commun",
        "des conclusions sans dates",
        "une seule observation permanente",
        "They plan standardized repeat sampling."
      ]
    ],
    "clozes": [
      [
        "Le chiffre est plus bas ___ l’ancien relevé.",
        "que",
        "Plus ... que compares the stated numbers without a regional claim.",
        "comparison"
      ],
      [
        "Si le laboratoire répond, nous ___ le protocole. (clarifier, futur)",
        "clarifierons",
        "Present si-clause with future clarifierons describes a possible next step.",
        "condition"
      ]
    ],
    "order": [
      "La tendance reste à démontrer",
      [
        "reste à démontrer",
        "La tendance"
      ],
      "One observation is not an independently verified regional trend.",
      "data"
    ],
    "writing": {
      "listening": [
        "Summarize the volunteer conversation about the river measurements.",
        "Maël a reçu un résultat local plus faible qu’un chiffre d’un ancien rapport et souhaitait annoncer une amélioration de tout le bassin. Chloé rappelle que le nouveau prélèvement vient d’un seul endroit et d’un jour précis. L’ancien rapport concerne une autre saison et un débit différent. Les bénévoles ont donc produit une observation utile, mais elle ne permet pas de conclure à une tendance générale. Le groupe souhaite publier les limites des chiffres et poursuivre les relevés selon un protocole comparable avant d’avancer une interprétation plus large."
      ],
      "sources": [
        "Write a careful citizen-science bulletin comparing both records.",
        "Notre groupe a reçu un résultat de laboratoire concernant un prélèvement effectué mardi à un endroit déterminé de la rivière. L’ancien rapport du bassin présente d’autres relevés recueillis pendant une saison et des conditions de débit différentes. Ces documents ne suffisent pas pour affirmer que toute la rivière s’est améliorée ni pour identifier la cause d’un changement. L’observation récente apporte toutefois une information locale intéressante. Nous envisageons de poursuivre les prélèvements selon une méthode cohérente et de comparer les séries avec prudence lorsqu’elles seront disponibles."
      ],
      "debate": [
        "Defend community science while rejecting unsupported regional environmental claims.",
        "Je considère que les initiatives de science participative ont une valeur importante : elles encouragent les habitants à observer leur environnement et peuvent compléter d’autres données. Un résultat de laboratoire plus faible semble encourageant, et les bénévoles ont raison de s’intéresser à sa signification. Pourtant, un seul prélèvement ne représente pas l’ensemble d’un bassin, surtout lorsque la comparaison ancienne vient d’une autre saison. Certains craignent qu’une communication prudente réduise l’enthousiasme. Je pense qu’elle renforce au contraire la confiance. Je recommande des mesures répétées, un protocole clair et des conclusions limitées à ce qui est réellement documenté."
      ]
    },
    "oral": [
      "Explain why a river sample cannot establish whole-basin improvement.",
      "Le laboratoire a analysé un échantillon pris mardi à un endroit précis. Un rapport plus ancien utilise d’autres conditions de saison et de débit. Ces chiffres peuvent être utiles, mais ne suffisent pas à démontrer l’amélioration de toute la rivière. Je recommande de poursuivre des prélèvements comparables et de présenter les résultats avec leurs dates et leurs limites."
    ]
  }
];
export const U19_97_99=Object.freeze(SOURCE.map((record,i)=>originalB1ComplexProduction(record,97+i)));
