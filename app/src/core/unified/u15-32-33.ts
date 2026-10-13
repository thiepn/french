import {originalB1Production,type U15OriginalSourceStory} from './u15-content-helper.ts';
const SOURCE:readonly U15OriginalSourceStory[]=[
  {
    "id": "transfer-32",
    "title": "Used laptop: condition claims and buying decisions",
    "goal": "Evaluate a sales claim, an explicit limitation and a conditional purchase.",
    "grammarKeys": [
      "condition",
      "compare"
    ],
    "vocabulary": [
      [
        "un ordinateur",
        "computer",
        "Cet ordinateur est d’occasion."
      ],
      [
        "une batterie",
        "battery",
        "La batterie dure moins longtemps."
      ],
      [
        "un chargeur",
        "charger",
        "Le chargeur est fourni."
      ],
      [
        "une annonce",
        "listing",
        "Je lis l’annonce."
      ],
      [
        "un essai",
        "test",
        "L’essai dure dix minutes."
      ],
      [
        "une autonomie",
        "battery runtime",
        "L’autonomie reste inconnue."
      ],
      [
        "un vendeur",
        "seller",
        "Le vendeur donne un détail."
      ],
      [
        "une preuve",
        "evidence",
        "Je demande une preuve récente."
      ],
      [
        "un état",
        "condition",
        "L’état doit être vérifié."
      ],
      [
        "un prix",
        "price",
        "Le prix est négociable."
      ],
      [
        "un clavier",
        "keyboard",
        "Le clavier sera testé."
      ],
      [
        "une décision",
        "decision",
        "La décision attend les vérifications."
      ]
    ],
    "dialogue": [
      [
        "Jules",
        "L’annonce décrit un ordinateur à trois cent vingt euros comme parfait, mais le vendeur indique maintenant que la batterie tient moins longtemps qu’avant.",
        "The listing says perfect, but the battery is degraded."
      ],
      [
        "Mina",
        "La nouvelle information limite clairement la première affirmation, même si le vendeur semble vouloir répondre à nos questions.",
        "That qualifies the original claim, although the seller is answering questions."
      ],
      [
        "Jules",
        "Il propose un essai de dix minutes, ce qui ne permettra pas de mesurer une autonomie de plusieurs heures.",
        "He offers ten minutes, too short to measure endurance."
      ],
      [
        "Mina",
        "Demandons la durée réellement observée et vérifions aussi le chargeur et le clavier avant de considérer le prix comme avantageux.",
        "Ask for measured duration and check charger and keyboard."
      ],
      [
        "Jules",
        "Je déciderai seulement après ces vérifications, sans affirmer que le vendeur a menti ou que l’achat sera nécessairement mauvais.",
        "I'll decide after evidence, without assigning dishonest intent."
      ]
    ],
    "readingTitle": "Ce que dix minutes de test peuvent démontrer",
    "paragraphs": [
      "Jules prépare la rentrée universitaire et cherche un ordinateur portable d'occasion. Il trouve une annonce à trois cent vingt euros qui présente l'appareil comme parfaitement fonctionnel. Le vendeur joint des photographies de l'écran allumé et annonce qu'un chargeur sera fourni. Jules apprécie le prix et serait prêt à se déplacer. Avant de confirmer, il demande si l'autonomie de la batterie a été mesurée récemment, car il devra utiliser l'ordinateur pendant plusieurs heures en cours.",
      "Le vendeur répond que la batterie se décharge plus vite qu'auparavant et propose un essai de dix minutes. Mina remarque qu'une courte démonstration peut montrer que l'ordinateur démarre et que le clavier réagit, mais pas garantir plusieurs heures de fonctionnement. Elle n'en conclut pas automatiquement que l'appareil est inutilisable. L'autonomie pourrait encore convenir à quelqu'un qui travaille surtout près d'une prise électrique. Jules doit donc confronter la limitation connue à ses propres besoins.",
      "Il prépare une liste de vérifications : essayer le clavier, regarder la présence du chargeur et demander une mesure raisonnable de l'autonomie. Il pourra ensuite comparer le prix avec l'état réel du matériel. Le vendeur reste libre de répondre et Jules de refuser l'achat. La décision serait plus solide si elle reposait sur des observations vérifiables plutôt que sur une formule commerciale générale."
    ],
    "evidence": [
      {
        "label": "Secondhand advertisement",
        "type": "poster",
        "french": "Ordinateur portable d’occasion : 320 €. Fonctionnement annoncé comme parfait, écran allumé sur les photos, chargeur compris. Aucune durée d’autonomie précise n’est publiée."
      },
      {
        "label": "Additional seller message",
        "type": "chat",
        "french": "Le clavier répond correctement, mais la batterie tient moins longtemps qu’au début. Je propose un essai de dix minutes sur place; je n’ai pas effectué un test d’autonomie de plusieurs heures."
      }
    ],
    "reading": [
      [
        "What is the published sale price?",
        "320 euros",
        "230 euros",
        "420 euros",
        "The listing identifies the 320-euro asking price."
      ],
      [
        "What can a short demonstration not verify?",
        "plusieurs heures d’autonomie",
        "le démarrage initial",
        "le clavier pendant dix minutes",
        "A short trial cannot establish multi-hour battery life."
      ],
      [
        "What is Jules's decision status?",
        "il attend les vérifications",
        "il a déjà payé",
        "il a accusé le vendeur",
        "The purchase remains conditional on tests."
      ]
    ],
    "compare": [
      [
        "Which source makes the broad perfection claim?",
        "l’annonce",
        "le message supplémentaire",
        "aucun",
        "The ad's general wording predates the disclosed battery limitation."
      ],
      [
        "Which source identifies weaker battery performance?",
        "le message du vendeur",
        "l’annonce initiale",
        "la photo",
        "The later seller reply qualifies battery condition."
      ]
    ],
    "listen": [
      [
        "How much is the listed laptop?",
        "320 euros",
        "200 euros",
        "500 euros",
        "Jules states the price."
      ],
      [
        "What limitation has been disclosed?",
        "la batterie plus faible",
        "un écran cassé",
        "un clavier manquant",
        "The battery runs less long than before."
      ],
      [
        "How long is the trial?",
        "dix minutes",
        "deux heures",
        "un jour",
        "The seller offers ten minutes."
      ],
      [
        "What does Mina advise checking?",
        "le chargeur et le clavier",
        "une réservation de restaurant",
        "la météo",
        "Mina recommends verifying supplied items and function."
      ]
    ],
    "clozes": [
      [
        "Si la batterie convient, j’___ l’appareil. (acheter, future)",
        "achèterai",
        "Si plus present uses future achèterai.",
        "real condition"
      ],
      [
        "Il fonctionne moins longtemps ___ avant.",
        "qu’",
        "Que elides before avant, yielding qu’avant.",
        "comparison"
      ]
    ],
    "order": [
      "L’autonomie reste à vérifier",
      [
        "reste à vérifier",
        "L’autonomie"
      ],
      "No measured endurance is available.",
      "uncertainty"
    ],
    "writing": {
      "listening": [
        "Retell the buyer's dilemma and provisional decision.",
        "Jules examine un ordinateur d’occasion vendu trois cent vingt euros. L’annonce parle d’un fonctionnement parfait, mais le vendeur reconnaît ensuite que la batterie dure moins longtemps qu’avant. Mina conseille de vérifier le chargeur, le clavier et l’autonomie avec des informations suffisantes. L’essai de dix minutes ne permet pas de garantir une utilisation de plusieurs heures. Jules n’a pas acheté l’appareil et ne suppose pas que le vendeur a voulu le tromper. Il décidera en fonction de ses besoins et des vérifications."
      ],
      "sources": [
        "Write a precise question to the seller after comparing the messages.",
        "Bonjour, je m’intéresse à votre ordinateur proposé à trois cent vingt euros. Votre annonce le décrit comme parfaitement fonctionnel, mais votre message précise que la batterie a perdu une partie de son autonomie. Pourriez-vous indiquer combien de temps elle tient actuellement dans un usage habituel ? Je souhaiterais également vérifier le clavier et le chargeur lors d’un essai. Je comprends qu’une démonstration de dix minutes ne garantit pas plusieurs heures de fonctionnement. Je déciderai après avoir examiné ces informations."
      ],
      "debate": [
        "Defend a cautious purchase with a fair counterargument.",
        "Je recommanderais de vérifier l’ordinateur avant de payer. Le prix pourrait être intéressant et le vendeur a fourni une précision utile sur la batterie; il ne serait pas justifié de le qualifier automatiquement de malhonnête. Toutefois, la mention « parfait » ne remplace pas une mesure d’autonomie. Pour un étudiant travaillant loin d’une prise, cette limite peut être importante. Si l’essai et les informations supplémentaires montrent que l’appareil répond aux besoins, l’achat resterait envisageable. Dans le cas contraire, il faudrait comparer d’autres offres."
      ]
    },
    "oral": [
      "Recommend a responsible pre-purchase decision.",
      "L’ordinateur coûte trois cent vingt euros et le vendeur fournit un chargeur. Cependant, la batterie ne tient plus aussi longtemps qu’avant, et l’essai proposé est très court. Je demanderais des informations supplémentaires et testerais les fonctions principales. Le prix peut rester correct pour certains usages, mais un étudiant doit vérifier que l’autonomie suffit à ses besoins. Je ne prendrais pas de décision définitive sans ce contrôle."
    ]
  },
  {
    "id": "transfer-33",
    "title": "Student research: distinguish quotation and causal claim",
    "goal": "Correct source attribution and overclaiming without alleging dishonest intent.",
    "grammarKeys": [
      "relative",
      "source"
    ],
    "vocabulary": [
      [
        "une citation",
        "quotation",
        "La citation est exacte."
      ],
      [
        "une reformulation",
        "paraphrase",
        "La reformulation garde le sens."
      ],
      [
        "une source",
        "source",
        "La source est visible."
      ],
      [
        "un auteur",
        "author",
        "L’auteur est identifié."
      ],
      [
        "une référence",
        "reference",
        "La référence accompagne le passage."
      ],
      [
        "une étude",
        "study",
        "L’étude observe une association."
      ],
      [
        "une causalité",
        "causation",
        "La causalité n’est pas démontrée."
      ],
      [
        "une association",
        "association",
        "Une association apparaît."
      ],
      [
        "un brouillon",
        "draft",
        "Le brouillon est relu."
      ],
      [
        "une synthèse",
        "synthesis",
        "La synthèse distingue les conclusions."
      ],
      [
        "attribuer",
        "attribute",
        "Nous devons attribuer cette idée."
      ],
      [
        "nuancer",
        "qualify",
        "Il faut nuancer l’affirmation."
      ]
    ],
    "dialogue": [
      [
        "Nadia",
        "Notre brouillon reprend presque exactement une phrase du rapport, mais je ne vois ni guillemets ni référence près du passage.",
        "Our draft closely repeats the report without quotation marks or citation."
      ],
      [
        "Pierre",
        "Nous devons la citer fidèlement ou la reformuler vraiment, tout en mentionnant l’auteur de l’idée.",
        "We should quote or genuinely paraphrase with attribution."
      ],
      [
        "Nadia",
        "Ailleurs, nous affirmons que la méthode cause une amélioration, alors que l’étude ne décrit qu’une association.",
        "Elsewhere we claim causation, though the study reports association."
      ],
      [
        "Pierre",
        "Changer les mots ne résout pas un changement de sens; la différence entre association et preuve causale doit rester visible.",
        "Changing words doesn't repair a changed epistemic claim."
      ],
      [
        "Nadia",
        "Je proposerai des corrections précises sans présumer que la personne qui a rédigé voulait tromper les lecteurs.",
        "I'll suggest corrections without attributing intent."
      ]
    ],
    "readingTitle": "Une reformulation qui respecte la preuve",
    "paragraphs": [
      "Des étudiants préparent ensemble un résumé de plusieurs recherches sur les méthodes de révision. Nadia retrouve dans leur brouillon une expression presque identique à celle d'un rapport publié. Aucun guillemet ni renvoi n'apparaît près de cette phrase. Elle ignore si l'auteur du passage a oublié la référence ou s'il croyait avoir suffisamment changé la formulation. Elle préfère donc signaler un problème vérifiable sans attribuer d'intention malhonnête à son collègue.",
      "En lisant un autre paragraphe, Pierre constate une erreur plus profonde. Le brouillon affirme qu'une pratique cause directement une hausse des résultats. Or le rapport décrit uniquement une association dans les données recueillies, sans démonstration d'un lien causal. La correction ne consiste pas seulement à remplacer quelques mots. Il faut conserver la nuance de l'étude et expliquer au lecteur ce que les chercheurs peuvent et ne peuvent pas conclure.",
      "Le groupe décide de relire toutes les phrases issues de documents externes. Les citations seront exactes et accompagnées de références. Les reformulations utiliseront une construction personnelle, tout en attribuant clairement l'idée. Les résultats seront présentés selon le degré de certitude autorisé par la méthode. La nouvelle synthèse sera ainsi plus crédible sans devenir inutilement prudente sur les faits réellement observés."
    ],
    "evidence": [
      {
        "label": "Original study excerpt",
        "type": "article",
        "french": "Une association a été observée entre la fréquence de révision et les résultats scolaires au sein des données recueillies. La méthodologie utilisée ne permet pas d’établir un effet causal direct."
      },
      {
        "label": "Unreviewed group summary",
        "type": "minutes",
        "french": "Réviser plus souvent améliore directement les résultats scolaires. Le brouillon avance cette relation causale sans décrire les limites de la méthodologie ni attribuer la formulation."
      }
    ],
    "reading": [
      [
        "Which two problems are found?",
        "attribution et causalité",
        "horaires et prix",
        "transport et météo",
        "The source problem and overclaiming are distinct defects."
      ],
      [
        "What does the original study demonstrate?",
        "une association",
        "une causalité prouvée",
        "aucune donnée",
        "The study expressly reports association without causal identification."
      ],
      [
        "What will the group do with direct quotations?",
        "les attribuer exactement",
        "les modifier sans référence",
        "les supprimer toutes",
        "Quotation marks and source attribution preserve authorship."
      ]
    ],
    "compare": [
      [
        "Which document qualifies its conclusion?",
        "l’étude",
        "le brouillon",
        "aucun",
        "The study carefully limits conclusions to association."
      ],
      [
        "Which document asserts unsupported causality?",
        "le brouillon",
        "l’étude",
        "les deux",
        "The summary turns correlation into direct improvement."
      ]
    ],
    "listen": [
      [
        "What is missing near a repeated phrase?",
        "des guillemets et une référence",
        "la couleur du texte",
        "la date du cours",
        "Nadia points to absent citation and quotation marks."
      ],
      [
        "What does Pierre recommend?",
        "citer ou reformuler en attribuant",
        "copier tout sans source",
        "inventer une étude",
        "He proposes proper citation or faithful paraphrase."
      ],
      [
        "What methodological distinction matters?",
        "association et causalité",
        "opinion et prix",
        "école et domicile",
        "The draft overstates evidence as causation."
      ],
      [
        "Does Nadia allege dishonest intent?",
        "non",
        "oui",
        "elle veut punir",
        "Nadia explicitly avoids guessing the writer's intent."
      ]
    ],
    "clozes": [
      [
        "C’est le rapport ___ nous parlons.",
        "dont",
        "Parler de takes dont.",
        "relative de"
      ],
      [
        "Selon l’étude, une ___ a été observée.",
        "association",
        "The original source reports an association, not causation.",
        "source fidelity"
      ]
    ],
    "order": [
      "La causalité reste à démontrer",
      [
        "reste à démontrer",
        "La causalité"
      ],
      "The study does not establish a direct causal effect.",
      "evidence"
    ],
    "writing": {
      "listening": [
        "Summarize the peer-review exchange respectfully.",
        "Nadia a découvert une phrase presque copiée d’un rapport sans guillemets ni référence visible. Pierre rappelle qu’il faut citer exactement ou reformuler avec une attribution claire. Le groupe a aussi présenté une association comme une cause certaine, contrairement aux limites de l’étude. Il devra corriger cette conclusion et préciser que le lien causal n’est pas établi. Les étudiants ne connaissent pas l’intention de la personne qui a rédigé le passage. Une relecture collaborative peut améliorer la précision sans lancer d’accusation injustifiée."
      ],
      "sources": [
        "Rewrite the group's research statement with accurate attribution.",
        "Selon l’étude consultée, une association a été observée entre la fréquence de révision et les résultats dans les données analysées. Cette observation peut être intéressante pour discuter des habitudes d’apprentissage, mais elle ne démontre pas que réviser plus souvent provoque directement de meilleurs résultats. Le brouillon initial présentait une conclusion causale plus forte que la source. Il convient de citer le rapport et de conserver la réserve méthodologique afin que les lecteurs distinguent le résultat recueilli de son interprétation."
      ],
      "debate": [
        "Defend careful editing while acknowledging an honest error is possible.",
        "Je soutiendrais une révision précise du brouillon plutôt qu’une accusation immédiate. Une phrase proche d’un rapport peut provenir d’une erreur de citation, mais elle doit tout de même être attribuée ou reformulée correctement. Plus grave, une association ne peut pas être présentée comme une cause sans preuve supplémentaire. Il serait possible que le rédacteur ait simplement voulu raccourcir le passage. Toutefois, la concision ne justifie pas une conclusion trompeuse. L’équipe devrait rétablir les références et le degré de certitude avant de publier le document."
      ]
    },
    "oral": [
      "Explain both source problems and a fair correction.",
      "Le groupe doit résoudre deux problèmes. Un passage proche du rapport manque de référence, et une conclusion présente une association comme une causalité prouvée. Les étudiants peuvent citer correctement, reformuler avec attribution et respecter la limite méthodologique. Ils ne doivent pas supposer une intention malhonnête. Une correction commune rendra la synthèse plus claire et plus fiable."
    ]
  }
];
export const U15_32_33=Object.freeze(SOURCE.map((record,i)=>originalB1Production(record,32+i)));
