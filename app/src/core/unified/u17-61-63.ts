import {originalB1GenreProduction,type U17OriginalSourceStory} from './u17-content-helper.ts';
const SOURCE:readonly U17OriginalSourceStory[]=[
  {
    "id": "transfer-61",
    "title": "Digital library catalog: a misidentified edition",
    "goal": "Write a responsible catalog correction distinguishing an edition date from a work's original publication.",
    "grammarKeys": [
      "source",
      "relative"
    ],
    "vocabulary": [
      [
        "une édition",
        "edition",
        "Cette édition comporte une préface."
      ],
      [
        "une notice",
        "catalog entry",
        "La notice décrit le volume."
      ],
      [
        "un catalogue",
        "catalog",
        "Le catalogue doit être corrigé."
      ],
      [
        "une préface",
        "preface",
        "La préface date de 2018."
      ],
      [
        "un ouvrage",
        "work",
        "L’ouvrage est plus ancien."
      ],
      [
        "une référence",
        "reference",
        "La référence contient deux dates."
      ],
      [
        "une couverture",
        "cover",
        "La couverture mentionne l’éditeur."
      ],
      [
        "un exemplaire",
        "copy",
        "Cet exemplaire est consultable."
      ],
      [
        "une erreur",
        "error",
        "Une erreur peut être rectifiée."
      ],
      [
        "une bibliothécaire",
        "librarian",
        "La bibliothécaire vérifie les sources."
      ],
      [
        "un manuscrit",
        "manuscript",
        "Le manuscrit n’est pas disponible."
      ],
      [
        "une vérification",
        "verification",
        "La vérification précède la correction."
      ]
    ],
    "dialogue": [
      [
        "Clara",
        "Notre catalogue indique que le roman a été écrit en 2018, mais l’exemplaire que j’ai consulté semble être une réédition d’un texte plus ancien.",
        "The catalogue lists 2018 as composition year, but the copy appears to be a reprint."
      ],
      [
        "Baptiste",
        "La page de titre donne 2018 pour cette édition; elle ne précise pas à elle seule la date de rédaction de l’œuvre.",
        "The title page dates the edition, not the writing."
      ],
      [
        "Clara",
        "La notice de l’éditeur présente une préface nouvelle et parle d’un ouvrage paru initialement bien avant cette édition.",
        "The publisher notes a new preface and earlier initial publication."
      ],
      [
        "Baptiste",
        "Avant de modifier le catalogue, vérifions la formulation exacte et l’identifiant de l’exemplaire concerné.",
        "Let's confirm the wording and copy identifier."
      ],
      [
        "Clara",
        "Je voudrais que les lecteurs sachent distinguer l’édition consultée et l’histoire du texte, sans inventer une date de manuscrit.",
        "Readers need an edition date distinct from composition."
      ],
      [
        "Baptiste",
        "Une correction indiquant « édition de 2018 » serait déjà plus fidèle; l’année de première publication pourrait être ajoutée seulement après vérification.",
        "Label edition 2018; add first publication only once verified."
      ],
      [
        "Clara",
        "Je transmettrai donc les deux sources au service et demanderai une modification qui reste limitée aux informations établies.",
        "I'll submit both sources for a bounded correction."
      ]
    ],
    "readingTitle": "Note bibliographique : une date peut désigner plusieurs événements",
    "paragraphs": [
      "Une lectrice découvre dans le catalogue d'une bibliothèque une notice présentant un roman comme une œuvre écrite en 2018. En empruntant le livre, elle remarque que la page de titre indique simplement « édition de 2018 ». Une préface évoque une histoire éditoriale plus longue, mais ne donne pas la date de rédaction du manuscrit original. Clara pense que la notice du catalogue a peut-être confondu la date d'un exemplaire avec celle du texte lui-même. Elle souhaite prévenir la bibliothèque sans présenter son hypothèse comme une certitude.",
      "Baptiste, chargé des collections, examine la description de l'éditeur. Celle-ci explique qu'une nouvelle préface accompagne une réédition d'un ouvrage plus ancien. Elle ne fournit pourtant pas dans l'extrait disponible l'année précise de première publication. Il faudrait donc éviter deux erreurs : conserver la formule « écrit en 2018 » et inventer une autre année pour remplacer la première. Baptiste propose d'identifier exactement l'exemplaire grâce à ses données bibliographiques et de vérifier des sources complémentaires avant d'enrichir la notice.",
      "Clara prépare une demande de correction qui cite les deux documents. Elle suggère de présenter 2018 comme l'année de l'édition consultée, en précisant que les informations sur la rédaction initiale demandent encore une recherche. Cette formulation aiderait les lecteurs à retrouver le bon exemplaire tout en évitant une chronologie imprécise. Une notice de catalogue n'est pas une biographie complète de l'auteur : elle doit surtout décrire avec exactitude l'objet disponible et les données qui peuvent être justifiées."
    ],
    "evidence": [
      {
        "label": "Library catalog entry",
        "type": "data",
        "french": "Notice du catalogue : « Roman écrit en 2018 ». Cette formulation est actuellement affichée sans précision sur l’édition du volume disponible."
      },
      {
        "label": "Publisher's edition description",
        "type": "article",
        "french": "Édition de 2018 avec une préface nouvelle. Réédition d’un ouvrage antérieur. L’extrait ne donne pas la date de rédaction du manuscrit ni l’année précise de première publication."
      }
    ],
    "reading": [
      [
        "Which date can be safely assigned to the physical volume?",
        "2018 pour l’édition",
        "2018 pour la rédaction",
        "2018 pour la naissance de l’auteur",
        "The publisher calls 2018 an edition date."
      ],
      [
        "Why not provide a new manuscript date?",
        "elle n’est pas établie",
        "le catalogue est toujours exact",
        "la préface l’interdit",
        "Neither supplied source proves a composition year."
      ],
      [
        "What is Clara's proposed limited correction?",
        "préciser l’édition",
        "supprimer le roman",
        "inventer un manuscrit",
        "She suggests accurately labeling the date of the copy."
      ]
    ],
    "compare": [
      [
        "Which source conflates writing and dating?",
        "la notice du catalogue",
        "la description de l’éditeur",
        "aucun",
        "The catalog calls the work written in 2018 without support."
      ],
      [
        "Which source calls it a reedition?",
        "la description de l’éditeur",
        "la notice du catalogue",
        "les deux donnent la date de rédaction",
        "The publisher explicitly distinguishes edition and older work."
      ]
    ],
    "listen": [
      [
        "What is the disputed year?",
        "2018",
        "2008",
        "2028",
        "Clara and Baptiste discuss 2018."
      ],
      [
        "What does the page of title establish?",
        "la date d’édition",
        "la date de rédaction",
        "une traduction obligatoire",
        "The title page records the edition."
      ],
      [
        "What new material does the reedition include?",
        "une préface",
        "un film",
        "une carte interactive",
        "The publisher describes a new preface."
      ],
      [
        "What information remains absent?",
        "l’année du manuscrit",
        "l’identité du roman",
        "l’existence d’un livre",
        "Neither source gives composition year."
      ],
      [
        "Who should approve a catalog change?",
        "le service bibliothécaire",
        "le premier visiteur",
        "un vendeur anonyme",
        "Baptiste works in collections and checks sources."
      ],
      [
        "What will Clara send?",
        "les deux documents",
        "une année inventée",
        "une demande de suppression",
        "She will supply both source descriptions."
      ]
    ],
    "clozes": [
      [
        "Selon l’éditeur, il s’agit d’une ___ de 2018.",
        "édition",
        "The publisher qualifies 2018 as an edition date.",
        "source fidelity"
      ],
      [
        "C’est l’exemplaire ___ nous parlons.",
        "dont",
        "Parler de takes the relative pronoun dont.",
        "relative"
      ]
    ],
    "order": [
      "La date reste à préciser",
      [
        "reste à préciser",
        "La date"
      ],
      "Different historical dates describe different bibliographic events.",
      "bibliography"
    ],
    "writing": {
      "listening": [
        "Report what Clara and Baptiste established and what remains unknown.",
        "Clara a constaté que le catalogue présente le roman comme écrit en 2018, alors que son exemplaire porte seulement une date d’édition. Baptiste a consulté la description de l’éditeur, qui parle d’une réédition accompagnée d’une nouvelle préface. Aucun document présenté ne précise quand le manuscrit a été rédigé. Ils souhaitent donc éviter de remplacer une date inexacte par une autre date supposée. Clara transmettra les deux sources au service, qui pourra d’abord préciser que 2018 désigne l’édition consultée."
      ],
      "sources": [
        "Write a source-based catalog correction request.",
        "Bonjour, j’ai consulté votre notice qui présente ce roman comme « écrit en 2018 ». La description de l’éditeur indique cependant qu’il s’agit d’une édition de 2018 avec une préface nouvelle, publiée à partir d’un ouvrage antérieur. Elle ne précise pas la date de rédaction initiale. Pourriez-vous vérifier l’exemplaire référencé et, si ces informations sont confirmées, indiquer plutôt « édition de 2018 » ? Je ne propose aucune nouvelle date de manuscrit sans source supplémentaire. Cette correction pourrait aider les lecteurs à distinguer les éditions de l’histoire de l’œuvre."
      ],
      "debate": [
        "Defend modest catalog corrections instead of ambitious but unsupported biography.",
        "Je recommande une correction limitée mais précise. Le catalogue doit permettre aux lecteurs d’identifier l’exemplaire disponible; présenter une date d’édition comme une date de rédaction peut les induire en erreur. On pourrait souhaiter ajouter immédiatement une chronologie plus complète de l’œuvre, mais cela demanderait des sources supplémentaires. Il serait préférable de modifier d’abord la formule en « édition de 2018 » et d’ouvrir une vérification séparée sur la première publication. Une information modeste et exacte rend davantage service qu’un détail séduisant mais inventé."
      ]
    },
    "oral": [
      "Explain the difference between a book edition and original authorship dates.",
      "La date de 2018 figure sur l’édition disponible, mais cela ne prouve pas que le roman a été écrit cette année-là. L’éditeur évoque un ouvrage plus ancien et une nouvelle préface. Je recommande de corriger la notice pour identifier clairement l’édition, puis de rechercher séparément la date de première publication. Aucune année de rédaction ne devrait être inventée."
    ]
  },
  {
    "id": "transfer-62",
    "title": "Community petition: signatures, consideration and actual policy change",
    "goal": "Argue for civic participation while separating a consultation threshold from binding adoption.",
    "grammarKeys": [
      "condition",
      "concession"
    ],
    "vocabulary": [
      [
        "une pétition",
        "petition",
        "La pétition recueille des signatures."
      ],
      [
        "une signature",
        "signature",
        "Une signature exprime un soutien."
      ],
      [
        "un seuil",
        "threshold",
        "Le seuil déclenche un examen."
      ],
      [
        "une proposition",
        "proposal",
        "La proposition reste débattue."
      ],
      [
        "un conseil",
        "council",
        "Le conseil examinera le texte."
      ],
      [
        "une consultation",
        "consultation",
        "La consultation rassemble des avis."
      ],
      [
        "une décision",
        "decision",
        "La décision n’est pas automatique."
      ],
      [
        "un règlement",
        "policy",
        "Le règlement doit être adopté."
      ],
      [
        "un quartier",
        "neighborhood",
        "Le quartier a des besoins variés."
      ],
      [
        "une réunion",
        "meeting",
        "Une réunion peut être organisée."
      ],
      [
        "un opposant",
        "opponent",
        "Un opposant propose une autre solution."
      ],
      [
        "une adoption",
        "adoption",
        "L’adoption exige un vote."
      ]
    ],
    "dialogue": [
      [
        "Mathis",
        "Notre pétition pour prolonger les horaires de la salle commune dépasse le seuil indiqué sur le site, donc certains disent que la mesure entre en vigueur lundi.",
        "The petition surpassed the threshold; some think the rule starts Monday."
      ],
      [
        "Lina",
        "Le seuil permet seulement de demander son inscription à l’ordre du jour; le conseil doit encore examiner la proposition.",
        "The threshold only qualifies it for consideration."
      ],
      [
        "Mathis",
        "Les signataires veulent davantage d’accès le soir, mais d’autres habitants s’inquiètent du bruit et du coût de surveillance.",
        "Supporters want evening access; others worry about noise and cost."
      ],
      [
        "Lina",
        "Ce désaccord ne rend pas la pétition inutile; il montre quelles conséquences doivent être étudiées publiquement.",
        "Disagreement identifies trade-offs to assess."
      ],
      [
        "Mathis",
        "Je proposerai un créneau expérimental sous conditions, sans annoncer que le règlement actuel a déjà changé.",
        "We could suggest a conditional pilot, not claim policy adopted."
      ],
      [
        "Lina",
        "Le compte rendu de la réunion devrait préciser les votes, les arguments des deux camps et toute date réellement adoptée.",
        "Minutes should report actual decisions."
      ],
      [
        "Mathis",
        "Je remercierai les signataires tout en expliquant que leur soutien ouvre une discussion et ne remplace pas la décision du conseil.",
        "I'll thank supporters without promising automatic enactment."
      ]
    ],
    "readingTitle": "Lettre ouverte : soutenir une idée sans annoncer une règle",
    "paragraphs": [
      "Un groupe d'habitants souhaite utiliser plus longtemps la salle commune du quartier. Une pétition propose de prolonger les horaires certains soirs de semaine. Lorsque le nombre de signatures dépasse le seuil annoncé sur le site de la commune, plusieurs bénévoles publient un message affirmant que les nouveaux horaires seront appliqués dès lundi. Mathis consulte le règlement et constate que le seuil permet seulement d'obtenir l'examen officiel de la proposition. Le texte ne prévoit pas son adoption automatique.",
      "Lors d'une discussion préparatoire, les habitants expriment des intérêts différents. Les membres d'associations souhaitent organiser des ateliers après le travail, tandis que certains voisins craignent des nuisances tardives ou une augmentation des coûts. Lina souligne que ces objections ne constituent pas une raison de supprimer le débat. Elles peuvent servir à préciser des conditions pratiques : horaires limités, réservation confirmée, règles de calme et bilan après une période d'essai. Le conseil devra décider si ces propositions sont acceptables.",
      "Mathis écrit une lettre ouverte qui remercie les signataires et reconnaît la diversité des positions. Il rappelle que la pétition a atteint un seuil de prise en compte, mais que le règlement actuel reste applicable jusqu'à une décision. Il invite les habitants à participer à la consultation et propose d'évaluer un essai si les responsables le valident. Une démarche civique peut être encourageante sans annoncer comme acquise une modification que personne n'a encore votée."
    ],
    "evidence": [
      {
        "label": "Petition procedure notice",
        "type": "notice",
        "french": "À partir de 300 signatures vérifiées, une proposition peut être inscrite pour examen par le conseil. Ce seuil ne modifie pas automatiquement les horaires ou règlements en vigueur."
      },
      {
        "label": "Campaign organizer's update",
        "type": "email",
        "french": "Nous avons recueilli 327 signatures et demanderons l’examen de notre proposition d’horaires du soir. Aucune réunion de décision ni modification du règlement n’est encore annoncée."
      }
    ],
    "reading": [
      [
        "What does the numerical threshold authorize?",
        "un examen du conseil",
        "une adoption immédiate",
        "une ouverture lundi garantie",
        "The notice explicitly describes consideration only."
      ],
      [
        "What concerns do opponents raise?",
        "bruit et surveillance",
        "la couleur des affiches",
        "le nombre de signatures",
        "These are practical trade-offs rather than proof against participation."
      ],
      [
        "Which option does Mathis suggest?",
        "un essai validé",
        "une ouverture imposée",
        "une suppression des réservations",
        "A conditional pilot preserves deliberation."
      ]
    ],
    "compare": [
      [
        "Which source defines the 300-signature rule?",
        "l’avis de procédure",
        "la lettre des organisateurs",
        "aucun",
        "Only the procedure defines threshold consequences."
      ],
      [
        "Which source confirms 327 signatures?",
        "le message de campagne",
        "l’avis général",
        "les deux",
        "The organizers report the specific verified total."
      ]
    ],
    "listen": [
      [
        "How many signatures did the campaign obtain?",
        "327",
        "300 exactement",
        "400",
        "The organizer's update reports 327 signatures."
      ],
      [
        "What action does the threshold permit?",
        "un examen officiel",
        "une entrée en vigueur lundi",
        "une élection automatique",
        "The council must still evaluate the proposal."
      ],
      [
        "What do residents disagree about?",
        "l’accès du soir et ses effets",
        "l’existence de la salle",
        "la langue du site",
        "The discussion contrasts access with nuisance and staffing costs."
      ],
      [
        "What compromise is suggested?",
        "un essai encadré",
        "une ouverture sans règle",
        "une fermeture définitive",
        "Mathis proposes a regulated trial."
      ],
      [
        "Are the existing rules already changed?",
        "non",
        "oui",
        "cela dépend des signatures seules",
        "The decision has not been taken."
      ],
      [
        "Who should record votes and decisions?",
        "le conseil",
        "les bénévoles uniquement",
        "le premier signataire",
        "Official minutes should follow the council's actual action."
      ]
    ],
    "clozes": [
      [
        "Si le conseil accepte, les horaires ___ modifiés. (être, future)",
        "seront",
        "Real si plus present can take future passive seront modifiés.",
        "condition"
      ],
      [
        "Bien que la pétition ___ soutenue, elle ne vaut pas décision. (être)",
        "soit",
        "Bien que requires subjunctive soit.",
        "concession"
      ]
    ],
    "order": [
      "La proposition reste à examiner",
      [
        "reste à examiner",
        "La proposition"
      ],
      "Crossing a signature threshold cannot bypass a council's authority.",
      "governance"
    ],
    "writing": {
      "listening": [
        "Summarize the civic discussion for residents who did not attend.",
        "La pétition en faveur d’horaires prolongés a réuni plus de trois cents signatures. Mathis pensait d’abord que les nouveaux horaires pourraient être annoncés dès lundi, mais Lina a expliqué que le seuil autorise seulement l’examen de la proposition. Certains habitants souhaitent plus d’accès le soir, tandis que d’autres craignent le bruit et les frais de surveillance. Une période d’essai assortie de conditions pourrait être discutée. Le conseil doit encore examiner le projet et adopter une éventuelle modification avant tout changement officiel."
      ],
      "sources": [
        "Write an evidence-accurate update using the petition rule and signature report.",
        "Bonjour, notre pétition pour élargir les horaires de la salle commune a recueilli trois cent vingt-sept signatures. Le règlement de consultation précise qu’un seuil de trois cents signatures permet de demander l’examen d’une proposition par le conseil. Il ne modifie pas automatiquement les horaires actuels. Nous allons donc solliciter une discussion officielle et prendre en compte les préoccupations concernant le calme et les coûts. Nous vous informerons après la réunion des décisions réellement adoptées. Merci à toutes les personnes qui ont exprimé leur avis, favorable ou critique."
      ],
      "debate": [
        "Defend participatory decision-making while acknowledging the petition is not binding.",
        "Je soutiens cette pétition, car des habitants souhaitent utiliser la salle commune en dehors de leurs heures de travail. Les trois cent vingt-sept signatures montrent un intérêt réel, mais elles ne donnent pas à elles seules le pouvoir de modifier le règlement. Les opposants soulignent des difficultés légitimes, comme le bruit et les coûts de surveillance. Je propose donc que le conseil examine un essai limité, fixe des conditions claires et recueille un bilan. Si ces conditions ne sont pas réalisables, une autre organisation devra être discutée. La participation gagne en crédibilité lorsqu’elle respecte la procédure."
      ]
    },
    "oral": [
      "Explain what petition signatures have and have not accomplished.",
      "La pétition a dépassé le seuil de trois cents signatures. Cela permet de demander l’examen du projet par le conseil, mais les horaires ne sont pas encore modifiés. Certains habitants veulent davantage d’accès, d’autres s’inquiètent du bruit et des coûts. Je recommanderais une consultation suivie éventuellement d’un essai limité. Il faut attendre une décision officielle avant d’annoncer une nouvelle règle."
    ]
  },
  {
    "id": "transfer-63",
    "title": "Bulk food cooperative: weights, shared costs and informed ordering",
    "goal": "Reconcile a quoted per-kilogram price with variable delivery charges and differing household needs.",
    "grammarKeys": [
      "compare",
      "polite"
    ],
    "vocabulary": [
      [
        "un achat groupé",
        "bulk purchase",
        "L’achat groupé rassemble les commandes."
      ],
      [
        "un kilogramme",
        "kilogram",
        "Le prix est indiqué au kilogramme."
      ],
      [
        "un devis",
        "quotation",
        "Le devis précise une partie des frais."
      ],
      [
        "une livraison",
        "delivery",
        "La livraison dépend du poids total."
      ],
      [
        "une participation",
        "share",
        "Chaque participation doit être confirmée."
      ],
      [
        "une quantité",
        "amount",
        "La quantité demandée varie."
      ],
      [
        "un coût",
        "cost",
        "Le coût complet reste à calculer."
      ],
      [
        "un supplément",
        "surcharge",
        "Un supplément est possible."
      ],
      [
        "une commande",
        "order",
        "La commande n’est pas validée."
      ],
      [
        "une coopérative",
        "cooperative",
        "La coopérative explique les règles."
      ],
      [
        "une répartition",
        "allocation",
        "La répartition doit être transparente."
      ],
      [
        "une confirmation",
        "confirmation",
        "La confirmation viendra après le devis final."
      ]
    ],
    "dialogue": [
      [
        "Louise",
        "La coopérative propose du riz à deux euros le kilogramme, mais mon voisin affirme que cinq kilos coûteront exactement dix euros, livraison comprise.",
        "A neighbor assumes 5 kg costs €10 delivered."
      ],
      [
        "Rachid",
        "La liste indique seulement le prix de la marchandise; le transport sera réparti après confirmation des quantités de tous.",
        "The list excludes freight allocation."
      ],
      [
        "Louise",
        "Plusieurs ménages souhaitent des quantités différentes, donc nous devons calculer les frais sans supposer que chacun paie la même somme.",
        "Households vary, so fair allocations need explanation."
      ],
      [
        "Rachid",
        "Nous pourrions demander un devis final et proposer de valider chaque commande une fois le montant complet connu.",
        "Get the final quote and individual approval."
      ],
      [
        "Louise",
        "Une personne préfère finalement trois kilos et ne doit pas être inscrite pour cinq sans son accord.",
        "Someone wants three kilos, not five."
      ],
      [
        "Rachid",
        "Bien que le prix par kilogramme soit attractif, les frais supplémentaires pourraient modifier l’intérêt de l’achat.",
        "Added charges may affect savings."
      ],
      [
        "Louise",
        "Je rédigerai un tableau provisoire avec prix et quantités, mais aucune facture définitive avant la confirmation du transport.",
        "I'll prepare a provisional table without calling it final."
      ]
    ],
    "readingTitle": "Compte rendu de coopérative : le prix affiché n’est qu’une partie du total",
    "paragraphs": [
      "Une petite coopérative souhaite acheter du riz en quantité afin de réduire les coûts pour plusieurs ménages. Le fournisseur annonce un prix de deux euros par kilogramme. Louise recueille les demandes et constate que les familles n'ont pas toutes les mêmes besoins. Certaines souhaitent cinq kilogrammes, d'autres seulement trois. Un voisin calcule immédiatement dix euros pour un sac de cinq kilogrammes et annonce ce montant comme prix livré. Louise remarque pourtant que le fournisseur n'a pas encore donné les frais de transport.",
      "Rachid examine le message commercial. Le prix unitaire concerne uniquement le riz et les frais de livraison seront connus lorsque le poids total aura été établi. La coopérative doit aussi décider comment répartir ces frais entre les participants. Une répartition égale peut sembler simple, mais elle ne produira pas nécessairement le même résultat qu'une répartition proportionnelle aux quantités. La méthode devrait être annoncée et discutée avant toute commande. Personne ne doit être engagé pour une quantité différente de celle qu'il a demandée.",
      "Louise prépare un tableau contenant les quantités exprimées, le prix de base et une colonne réservée aux frais encore inconnus. Elle demandera au fournisseur un devis complet puis transmettra les montants individuels à chaque participant pour confirmation. Si le coût final devient trop élevé pour certains ménages, ils pourront réduire leur demande ou renoncer à l'achat avant validation. Cette transparence permet de distinguer une estimation utile d'un engagement financier réellement accepté."
    ],
    "evidence": [
      {
        "label": "Supplier unit-price quotation",
        "type": "data",
        "french": "Riz : 2 € par kilogramme, hors livraison. Le tarif de transport et toute réduction éventuelle seront précisés après réception du poids total commandé."
      },
      {
        "label": "Cooperative participation form",
        "type": "notice",
        "french": "Les participants indiquent une quantité souhaitée, provisoire. Aucune commande ni obligation de paiement ne naît avant communication et acceptation du montant complet."
      }
    ],
    "reading": [
      [
        "What does the two-euro rate exclude?",
        "la livraison",
        "le kilogramme de riz",
        "le prix du produit",
        "The quotation explicitly excludes transport."
      ],
      [
        "Why are individual amounts not fixed?",
        "les quantités et frais finaux restent ouverts",
        "tous veulent cinq kilos",
        "le vendeur a renoncé",
        "Weights and delivery allocation are still unknown."
      ],
      [
        "When may participants commit?",
        "après le coût complet et leur accord",
        "dès le formulaire initial",
        "après une supposition",
        "The cooperative form requires informed approval."
      ]
    ],
    "compare": [
      [
        "Which document sets the price per kilogram?",
        "le devis fournisseur",
        "le formulaire",
        "aucun",
        "The supplier quotes €2/kg excluding transport."
      ],
      [
        "Which document prohibits automatic commitment?",
        "le formulaire coopératif",
        "le devis fournisseur",
        "les deux imposent l’achat",
        "Participants must accept the final amount."
      ]
    ],
    "listen": [
      [
        "What is the quoted price?",
        "deux euros par kilogramme",
        "dix euros par kilogramme",
        "trois euros livrés",
        "Louise identifies the unit price."
      ],
      [
        "What extra cost remains uncertain?",
        "la livraison",
        "la masse du riz",
        "la monnaie utilisée",
        "Rachid notes undetermined transport."
      ],
      [
        "What amount does one household now prefer?",
        "trois kilogrammes",
        "cinq sacs identiques",
        "un seul gramme",
        "Louise mentions the changed three-kilogram preference."
      ],
      [
        "Are all household quantities equal?",
        "non",
        "oui",
        "elles sont imposées",
        "Demand differs across participants."
      ],
      [
        "When should the order be validated?",
        "après devis complet",
        "dès la première annonce",
        "avant de lire les conditions",
        "The final amounts need informed confirmation."
      ],
      [
        "How will Louise present the first table?",
        "comme provisoire",
        "comme facture finale",
        "comme règlement municipal",
        "She commits to labeling unknown costs."
      ]
    ],
    "clozes": [
      [
        "Le riz coûte deux euros ___ kilogramme.",
        "par",
        "Par kilogramme expresses a unit rate, not delivery inclusion.",
        "price unit"
      ],
      [
        "Pourriez-vous ___ les frais de livraison ?",
        "préciser",
        "The polite question takes infinitive préciser.",
        "polite clarification"
      ]
    ],
    "order": [
      "Le montant reste à calculer",
      [
        "reste à calculer",
        "Le montant"
      ],
      "A unit rate and unknown transport cannot determine total cost.",
      "cost"
    ],
    "writing": {
      "listening": [
        "Explain the cooperative proposal and uncertainty to a new participant.",
        "La coopérative souhaite organiser un achat groupé de riz. Le fournisseur propose deux euros par kilogramme, mais ce tarif n’inclut pas la livraison. Les ménages demandent des quantités différentes et la méthode de répartition du transport reste à discuter. Louise a remarqué qu’un participant préfère désormais trois kilogrammes au lieu de cinq. Elle préparera un tableau provisoire, puis demandera un devis complet. Aucun ménage ne sera engagé avant d’avoir accepté son montant final. Le prix affiché peut être intéressant sans constituer déjà le coût total."
      ],
      "sources": [
        "Write a cooperative update explaining the two source documents.",
        "Bonjour, le fournisseur propose du riz à deux euros le kilogramme, hors livraison. Les frais de transport seront précisés seulement lorsque nous aurons communiqué la quantité totale. Notre formulaire permet actuellement de signaler un souhait d’achat, mais ne crée aucune obligation de paiement. Nous allons réunir les quantités, discuter d’une méthode de partage des frais et demander le devis final. Chaque participant recevra ensuite son montant complet pour acceptation. Il serait incorrect d’annoncer dix euros comme prix définitivement livré pour cinq kilogrammes."
      ],
      "debate": [
        "Defend transparent shared purchasing while accounting for unequal household needs.",
        "Je soutiens l’achat groupé, car il peut permettre à plusieurs ménages de profiter d’un prix unitaire intéressant. Cependant, la coopération doit rester volontaire et tenir compte des quantités différentes. Une répartition identique du transport pourrait être simple, mais elle ne serait pas nécessairement acceptée comme juste par tout le monde. Je propose de présenter plusieurs méthodes de calcul avec le devis complet, puis de demander l’accord de chaque foyer avant de commander. Si le montant final n’est pas avantageux pour certains, ils doivent pouvoir modifier leur quantité ou renoncer."
      ]
    },
    "oral": [
      "Explain why the initial per-kilogram quote is not a final shared cost.",
      "Le riz est annoncé à deux euros le kilogramme, mais les frais de livraison sont encore inconnus. Les ménages souhaitent des quantités différentes. La coopérative doit donc calculer le coût complet et expliquer comment le transport sera réparti. Je recommande un tableau provisoire, puis une confirmation individuelle avant la commande. Personne ne devrait être obligé de payer un montant non accepté."
    ]
  }
];
export const U17_61_63=Object.freeze(SOURCE.map((record,i)=>originalB1GenreProduction(record,61+i)));
