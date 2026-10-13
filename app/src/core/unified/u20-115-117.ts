import {originalB2RevisionProduction,type U20OriginalSourceStory} from './u20-content-helper.ts';
const SOURCE:readonly U20OriginalSourceStory[]=[
  {
    "id": "transfer-115",
    "title": "Digital lending library: displayed e-book availability versus actual license permissions",
    "goal": "Produce a careful availability note separating discovery, lending entitlement and device access.",
    "grammarKeys": [
      "relative",
      "condition"
    ],
    "vocabulary": [
      [
        "un prêt numérique",
        "digital loan",
        "Le prêt numérique dépend de la licence."
      ],
      [
        "une licence",
        "license",
        "La licence autorise certains emprunts."
      ],
      [
        "un catalogue",
        "catalog",
        "Le catalogue affiche un titre."
      ],
      [
        "un fichier",
        "file",
        "Le fichier n’est pas toujours téléchargeable."
      ],
      [
        "un accès",
        "access",
        "L’accès varie selon l’abonnement."
      ],
      [
        "une plateforme",
        "platform",
        "La plateforme gère les emprunts."
      ],
      [
        "une réservation",
        "hold",
        "La réservation n’est pas garantie."
      ],
      [
        "une durée",
        "duration",
        "La durée du prêt est limitée."
      ],
      [
        "un lecteur",
        "reader",
        "Le lecteur consulte les conditions."
      ],
      [
        "une édition",
        "edition",
        "L’édition numérique diffère parfois."
      ],
      [
        "une restriction",
        "restriction",
        "La restriction doit être expliquée."
      ],
      [
        "un droit",
        "right",
        "Le droit d’utilisation doit être confirmé."
      ]
    ],
    "dialogue": [
      [
        "Claire",
        "Notre bibliothèque affiche le roman en version numérique et l’annonce dit que tous les lecteurs peuvent le télécharger gratuitement.",
        "The ebook appears in the catalog, but the advert claims free downloading for everyone."
      ],
      [
        "Sami",
        "Le catalogue permet de découvrir une édition; il ne prouve ni le droit de prêt ni l’accès sur chaque appareil.",
        "Listing does not prove lending rights or device compatibility."
      ],
      [
        "Claire",
        "La fiche de la plateforme indique trois licences de prêt simultané, mais elles sont déjà occupées aujourd’hui.",
        "The three concurrent digital licenses are currently in use."
      ],
      [
        "Sami",
        "Une personne pourra peut-être réserver le titre, mais la procédure et les durées doivent être précisées par le service.",
        "A possible hold isn't an immediate download."
      ],
      [
        "Claire",
        "Un autre site propose la même couverture, sans préciser s’il s’agit de la même édition ou d’une copie légalement distribuée.",
        "A similar cover does not establish edition or rights."
      ],
      [
        "Sami",
        "Nous ne devons pas réorienter les lecteurs vers un fichier non vérifié pour contourner les conditions de la licence.",
        "No unverified file workaround."
      ],
      [
        "Claire",
        "Je pourrais expliquer la différence entre consulter le catalogue, attendre un prêt et acheter séparément une autre édition.",
        "Separate discovery, borrowing and third-party purchase."
      ],
      [
        "Sami",
        "Certains lecteurs auront aussi besoin d’informations sur les formats réellement pris en charge par leur appareil.",
        "Device and accessibility requirements matter."
      ],
      [
        "Claire",
        "Je corrigerai la page pour annoncer la disponibilité comme conditionnelle plutôt que comme un téléchargement garanti.",
        "I'll revise the promise."
      ]
    ],
    "readingTitle": "Notice du catalogue : un livre visible n’est pas forcément empruntable immédiatement",
    "paragraphs": [
      "Une bibliothèque municipale enrichit son catalogue de livres numériques. Claire voit qu’un roman apparaît dans les résultats et prépare une annonce indiquant que chaque lecteur pourra le télécharger gratuitement. Sami lit les conditions du prestataire : la bibliothèque dispose de trois droits de prêt simultanés, tous utilisés au moment de sa consultation. La présence du titre dans le catalogue permet donc d’en découvrir la notice, mais ne signifie pas qu’un nouveau prêt est immédiatement disponible. Il faut aussi distinguer le droit d’emprunter temporairement un fichier de celui de le conserver ou de le redistribuer.",
      "Le catalogue propose parfois une réservation lorsque toutes les licences sont occupées, mais les modalités concrètes dépendent de la plateforme. Certaines éditions numériques utilisent des formats ou des protections qui ne fonctionnent pas de la même manière sur tous les appareils. Par ailleurs, un site extérieur affiche une couverture identique, sans information suffisante pour établir que son fichier correspond à l’édition autorisée. Sami conseille de ne pas recommander une source non vérifiée simplement parce qu’elle semble offrir un accès plus rapide. Les droits numériques et les contraintes techniques doivent être présentés honnêtement.",
      "Claire rédige une nouvelle page décrivant les étapes : vérifier l’édition, connaître la disponibilité de la licence, consulter les conditions de réservation et vérifier les formats pris en charge. Elle ne promet plus un téléchargement immédiat à tous les utilisateurs. Cette communication peut paraître moins attirante, mais elle réduit les déceptions et aide les lecteurs à choisir une démarche légitime. Le service pourra actualiser l’information si des licences supplémentaires sont acquises ou si les conditions de la plateforme changent."
    ],
    "evidence": [
      {
        "label": "Public online catalog record",
        "type": "data",
        "french": "Roman listé au catalogue numérique. Cette notice indique le titre et l’édition, sans garantir qu’un exemplaire numérique peut être emprunté ou téléchargé immédiatement."
      },
      {
        "label": "Digital lending license dashboard",
        "type": "notice",
        "french": "Trois licences de prêt simultané autorisées; les trois sont actuellement en cours d’utilisation. La réservation éventuelle dépend des conditions de la plateforme et de la compatibilité du format."
      }
    ],
    "reading": [
      [
        "What does catalog presence prove?",
        "la présence d’une notice",
        "un prêt disponible à tous",
        "un téléchargement permanent",
        "A catalog entry is discovery metadata, not a loan entitlement."
      ],
      [
        "Why is immediate access unavailable?",
        "les trois licences sont occupées",
        "le livre n’existe pas",
        "le catalogue est interdit",
        "Concurrent lending slots are in use."
      ],
      [
        "What is a responsible public revision?",
        "indiquer licences, réservations et formats",
        "promettre un fichier à tous",
        "suggérer une copie inconnue",
        "Accurate access information must distinguish permission and technology."
      ]
    ],
    "compare": [
      [
        "Which source documents the listed title?",
        "la notice du catalogue",
        "le tableau des licences",
        "aucun",
        "The catalog record identifies the book edition."
      ],
      [
        "Which document describes three occupied licenses?",
        "le tableau des licences",
        "la notice seule",
        "les deux garantissent l’accès",
        "The platform's license dashboard reports concurrency."
      ]
    ],
    "listen": [
      [
        "What kind of book does Claire advertise?",
        "un roman numérique",
        "un manuscrit papier",
        "un dictionnaire vendu",
        "The topic is a digital novel."
      ],
      [
        "How many concurrent licenses exist?",
        "trois",
        "dix",
        "une seule",
        "Sami reads three simultaneous slots."
      ],
      [
        "Are these slots presently free?",
        "non",
        "oui",
        "pour toujours",
        "All three are occupied. This detail is directly supported by the characters' original exchange, not a general assumption."
      ],
      [
        "What does a matching cover not guarantee?",
        "la même édition autorisée",
        "un titre visible",
        "un dessin",
        "A cover isn't evidence of legitimate distribution."
      ],
      [
        "What extra technical detail may matter?",
        "le format du fichier",
        "le nom du bibliothécaire",
        "la couleur du bureau",
        "Reader devices may differ in format support."
      ],
      [
        "How will the page change?",
        "indiquer des conditions de prêt",
        "promettre des téléchargements illimités",
        "ne plus afficher le titre",
        "Claire will qualify availability."
      ]
    ],
    "clozes": [
      [
        "C’est le titre ___ les lecteurs parlent.",
        "dont",
        "Parler de requires dont. The required construction determines the verb form in this sentence.",
        "relative"
      ],
      [
        "Si une licence se libère, un prêt ___ possible. (devenir, futur)",
        "deviendra",
        "The future deviendra is conditional on an available license.",
        "condition"
      ]
    ],
    "order": [
      "Les licences restent à vérifier",
      [
        "restent à vérifier",
        "Les licences"
      ],
      "Title visibility cannot guarantee borrowing capacity.",
      "rights"
    ],
    "writing": {
      "listening": [
        "Summarize the digital library debate while keeping access and license rights distinct.",
        "Claire découvre un roman dans le catalogue numérique et annonce d’abord que tout le monde pourra le télécharger gratuitement. Sami rappelle que les trois licences de prêt simultané sont déjà utilisées. Une notice bibliographique n’est donc pas un droit d’accès immédiat. Les lecteurs peuvent avoir besoin d’informations sur les réservations et les formats adaptés à leur appareil. Une couverture identique trouvée ailleurs ne prouve pas la légitimité d’un autre fichier. Claire souhaite publier une description précise des conditions sans recommander de copie non vérifiée."
      ],
      "sources": [
        "Write a lawful, practical lending notice using the catalog and license dashboard.",
        "Ce roman figure dans notre catalogue numérique, mais sa présence dans les résultats ne garantit pas un prêt immédiat. Le service dispose actuellement de trois licences simultanées, toutes utilisées. Les possibilités de réservation, la durée du prêt et les formats disponibles dépendent des conditions de la plateforme. Nous vous invitons à consulter ces renseignements avant de prévoir votre lecture. Une couverture identique sur un autre site ne permet pas de confirmer les droits de diffusion de son fichier. Nous actualiserons cette notice lorsque la disponibilité ou les conditions d’accès changeront."
      ],
      "debate": [
        "Defend transparent digital lending while acknowledging readers' legitimate frustration.",
        "L’accès numérique à la lecture peut être particulièrement utile aux personnes qui ne peuvent pas se rendre facilement à la bibliothèque. Il est compréhensible qu’un lecteur soit frustré lorsqu’un titre affiché ne peut pas être immédiatement emprunté. Pourtant, trois licences déjà utilisées ne permettent pas de promettre des téléchargements illimités. Je recommande une présentation visible des disponibilités, des modalités de réservation et des formats compatibles, ainsi qu’une réflexion sur l’acquisition de licences supplémentaires si la demande le justifie. Une information honnête sur les restrictions protège les droits tout en permettant au public de planifier sa lecture."
      ]
    },
    "oral": [
      "Explain what a catalog listing does and does not guarantee.",
      "Le roman figure dans le catalogue, mais ses trois licences numériques sont déjà occupées. Sa notice ne garantit donc pas un téléchargement immédiat. Il faut vérifier les réservations possibles, la durée du prêt et les formats compatibles. Je recommande une annonce précise, sans diriger les lecteurs vers un fichier extérieur dont les droits sont inconnus."
    ]
  },
  {
    "id": "transfer-116",
    "title": "Participatory neighborhood budget: attendance and vote weights must not be confused",
    "goal": "Compare a consultation tally with a formally eligible vote count and defend a fair explanatory report.",
    "grammarKeys": [
      "compare",
      "report"
    ],
    "vocabulary": [
      [
        "un budget participatif",
        "participatory budget",
        "Le budget participatif finance des projets."
      ],
      [
        "une voix",
        "vote",
        "Une voix suit des règles."
      ],
      [
        "une consultation",
        "consultation",
        "La consultation accueille des idées."
      ],
      [
        "un électeur",
        "voter",
        "L’électeur doit être éligible."
      ],
      [
        "une proposition",
        "proposal",
        "La proposition reste à examiner."
      ],
      [
        "un dépouillement",
        "count",
        "Le dépouillement doit être expliqué."
      ],
      [
        "une règle",
        "rule",
        "La règle définit les voix admises."
      ],
      [
        "un classement",
        "ranking",
        "Le classement peut évoluer."
      ],
      [
        "une participation",
        "participation",
        "La participation ne prouve pas le vote."
      ],
      [
        "un formulaire",
        "form",
        "Le formulaire recueille les préférences."
      ],
      [
        "une vérification",
        "verification",
        "La vérification précède le résultat."
      ],
      [
        "un résultat",
        "result",
        "Le résultat officiel n’est pas publié."
      ]
    ],
    "dialogue": [
      [
        "Tania",
        "La page du quartier annonce déjà que le jardin gagne, parce que cent personnes ont aimé sa présentation.",
        "The page declares a winner from likes, not counted votes."
      ],
      [
        "Rémi",
        "Le règlement distingue les soutiens publics et les bulletins effectivement admis au vote.",
        "Likes and eligible ballots are different evidence."
      ],
      [
        "Tania",
        "L’atelier de consultation a aussi réuni des enfants et des visiteurs qui ne votent pas forcément selon les règles du budget.",
        "Consultation participation is broader than voting eligibility."
      ],
      [
        "Rémi",
        "Leurs opinions restent intéressantes, sans devoir être présentées comme des suffrages officiellement comptés.",
        "Their views matter but don't automatically count as ballots."
      ],
      [
        "Tania",
        "Le tableau provisoire ne contient que les formulaires saisis jusqu’à mardi, pas le dépouillement final.",
        "The interim spreadsheet is incomplete."
      ],
      [
        "Rémi",
        "Il faudrait publier la méthode de comptage avant d’annoncer un classement définitif.",
        "Explain procedure before proclaiming a result."
      ],
      [
        "Tania",
        "Certains proposent de donner plus de poids aux projets pour les jeunes; cela pourrait être discuté pour l’avenir, mais pas appliqué après coup.",
        "Rule changes shouldn't be applied retroactively."
      ],
      [
        "Rémi",
        "La confiance dépend aussi de la stabilité des critères et de la transparence des vérifications.",
        "Stable rules and provenance matter."
      ],
      [
        "Tania",
        "Je corrigerai la page pour distinguer intérêt public, vote admissible et décision de financement.",
        "I'll separate support, eligible count and allocation."
      ]
    ],
    "readingTitle": "Compte rendu démocratique : aimer un projet et voter pour lui ne sont pas le même acte",
    "paragraphs": [
      "Une commune organise un budget participatif pour financer plusieurs projets de quartier. Une proposition de jardin collectif reçoit beaucoup d’attention sur un réseau social. Tania lit plus de cent réactions positives et prépare un message déclarant que le jardin a gagné. Rémi lui rappelle que le règlement prévoit une procédure de vote spécifique, avec des bulletins recevables et un dépouillement. Une réaction en ligne peut manifester un intérêt sincère, mais elle n’équivaut pas automatiquement à une voix admise dans le scrutin. Confondre les deux pourrait créer de fausses attentes.",
      "Le groupe consulte aussi les comptes rendus des ateliers. Certaines personnes ont participé aux discussions sans relever de la catégorie des électeurs définie pour cette édition. Leurs observations peuvent enrichir le débat, sans être artificiellement ajoutées aux résultats officiels. Un tableau provisoire présente les formulaires reçus à une date donnée, mais le comptage final n’a pas encore été effectué. Plusieurs habitants souhaitent donner davantage de poids à certains types de projets. Une telle modification devrait être débattue pour une prochaine procédure, pas introduite pendant ou après un vote selon des règles déjà annoncées.",
      "Tania rédige un message de correction. Il précisera que le jardin suscite de l’intérêt, que les bulletins doivent encore être vérifiés et qu’aucun classement définitif n’est connu. Lorsque les résultats officiels seront disponibles, la commune pourra expliquer la méthode de dépouillement et la décision de financement. Cette information évite de réduire la participation démocratique à un seul nombre : soutenir une idée, discuter publiquement et voter selon une procédure sont des actions liées, mais différentes."
    ],
    "evidence": [
      {
        "label": "Neighborhood social support dashboard",
        "type": "data",
        "french": "Projet de jardin : 113 réactions favorables sur la plateforme de discussion. Les réactions ne correspondent pas aux bulletins admissibles du budget participatif."
      },
      {
        "label": "Participatory budget vote bulletin",
        "type": "notice",
        "french": "Résultats définitifs non disponibles. Les bulletins soumis feront l’objet d’une vérification d’éligibilité et d’un dépouillement selon les règles publiées avant le scrutin."
      }
    ],
    "reading": [
      [
        "What do 113 reactions demonstrate?",
        "un intérêt en ligne",
        "des votes officiels",
        "une subvention attribuée",
        "A like is not automatically an admissible ballot."
      ],
      [
        "Why can't the winner be announced yet?",
        "le dépouillement n’est pas achevé",
        "il n’y a aucun projet",
        "les règles ont été supprimées",
        "Official eligible vote totals aren't available."
      ],
      [
        "What should happen with proposals to change weighting?",
        "les discuter pour l’avenir",
        "les appliquer après le vote",
        "ignorer toutes les opinions",
        "Retroactive changes would undermine stable election criteria."
      ]
    ],
    "compare": [
      [
        "Which document counts 113 online reactions?",
        "le tableau de soutien",
        "l’avis officiel",
        "aucun",
        "The social dashboard measures interest."
      ],
      [
        "Which document describes forthcoming ballot verification?",
        "l’avis du vote",
        "le tableau des réactions",
        "les deux annoncent un gagnant",
        "The procedure notice describes actual counting."
      ]
    ],
    "listen": [
      [
        "Which project draws online support?",
        "un jardin collectif",
        "une bibliothèque numérique",
        "un musée",
        "Tania identifies the proposed garden."
      ],
      [
        "What number of reactions is mentioned?",
        "plus de cent",
        "douze",
        "trois",
        "The conversation describes more than one hundred likes."
      ],
      [
        "What is not yet final?",
        "le dépouillement",
        "la présence d’une page",
        "la réunion passée",
        "Rémi says ballots haven't been fully counted."
      ],
      [
        "Can all consultation participants automatically vote?",
        "non",
        "oui",
        "le réseau social le décide",
        "Eligibility is distinct from attending an event."
      ],
      [
        "When should weighting-rule changes apply?",
        "à une procédure future",
        "après avoir vu le gagnant",
        "au milieu du comptage",
        "They shouldn't be imposed after voting."
      ],
      [
        "What will Tania correct?",
        "la déclaration de victoire",
        "le nom du jardin",
        "la météo",
        "The project can't be called the official winner."
      ]
    ],
    "clozes": [
      [
        "Les réactions sont moins officielles ___ les bulletins admis.",
        "que",
        "Moins ... que compares the evidentiary status of two different actions.",
        "comparison"
      ],
      [
        "Rémi a expliqué que le vote ___ encore à vérifier. (rester, imparfait)",
        "restait",
        "Reported earlier state uses restait à vérifier.",
        "report"
      ]
    ],
    "order": [
      "Le résultat reste à établir",
      [
        "reste à établir",
        "Le résultat"
      ],
      "Public support figures cannot establish the final eligible vote.",
      "governance"
    ],
    "writing": {
      "listening": [
        "Summarize the dispute between public enthusiasm and the formal procedure.",
        "Tania pense d’abord qu’un jardin collectif a remporté le budget participatif en raison de nombreuses réactions positives en ligne. Rémi rappelle que ces réactions ne sont pas nécessairement des bulletins admis. Les ateliers de consultation ont également accueilli des participants dont les opinions comptent dans la discussion sans être automatiquement des votes. Le tableau disponible est provisoire et le dépouillement final manque encore. Le groupe convient qu’il faut préserver les règles annoncées et attendre une vérification avant de communiquer un classement. Tania corrigera sa déclaration de victoire."
      ],
      "sources": [
        "Draft an accurate public status announcement.",
        "Le projet de jardin collectif suscite un intérêt important sur la plateforme de discussion, où 113 réactions favorables ont été enregistrées. Ce chiffre ne constitue toutefois pas le nombre de bulletins admis au budget participatif. Le règlement prévoit une vérification de l’éligibilité et un dépouillement qui n’est pas encore terminé. Les ateliers de consultation permettent également d’exprimer des préférences sans se confondre avec le vote officiel. Aucun projet ne peut donc être annoncé comme gagnant sur cette base. La commune publiera les résultats et leur méthode de calcul lorsque la procédure sera achevée."
      ],
      "debate": [
        "Defend meaningful participation without substituting popularity metrics for a legitimate count.",
        "Je trouve encourageant qu’un jardin collectif suscite plus de cent réactions positives. Les discussions en ligne et les ateliers peuvent rendre un budget participatif plus accessible et faire connaître de nouvelles idées. Cependant, une réaction n’est pas nécessairement un bulletin recevable, et les résultats provisoires ne permettent pas d’annoncer un vainqueur. Certains voudraient modifier les critères pour favoriser les projets destinés aux jeunes; ce débat peut être légitime pour une prochaine édition. Je recommande de maintenir les règles du scrutin présent, de publier clairement le dépouillement et de distinguer consultation, soutien et décision financière."
      ]
    },
    "oral": [
      "Explain why the most-liked project has not automatically won.",
      "Le jardin a reçu 113 réactions favorables, mais le budget participatif repose sur des bulletins admis selon des règles précises. Le dépouillement n’est pas achevé. Je recommande de présenter les réactions comme un intérêt public et d’attendre les résultats vérifiés avant d’annoncer un financement. Les modifications du système de vote devraient être discutées pour l’avenir."
    ]
  },
  {
    "id": "transfer-117",
    "title": "Community makerspace: booking cancellation, tool access and evidence of training",
    "goal": "Write an interruption-safe, rights-respecting workshop notice where a registration record is not a certified safety qualification.",
    "grammarKeys": [
      "concession",
      "condition"
    ],
    "vocabulary": [
      [
        "un atelier partagé",
        "makerspace",
        "L’atelier partagé accueille des projets."
      ],
      [
        "une réservation",
        "booking",
        "La réservation concerne une salle."
      ],
      [
        "un outil",
        "tool",
        "L’outil exige des consignes."
      ],
      [
        "une formation",
        "training",
        "La formation doit être documentée."
      ],
      [
        "une présence",
        "attendance",
        "La présence ne prouve pas toutes les compétences."
      ],
      [
        "une annulation",
        "cancellation",
        "L’annulation doit être annoncée."
      ],
      [
        "un accès",
        "access",
        "L’accès dépend des règles."
      ],
      [
        "une qualification",
        "qualification",
        "La qualification ne peut pas être inventée."
      ],
      [
        "un responsable",
        "supervisor",
        "Le responsable vérifie les conditions."
      ],
      [
        "une confirmation",
        "confirmation",
        "La confirmation précise le créneau."
      ],
      [
        "une règle",
        "rule",
        "La règle est donnée avant l’activité."
      ],
      [
        "une reprise",
        "resumption",
        "La reprise devra être autorisée."
      ]
    ],
    "dialogue": [
      [
        "Maud",
        "Le calendrier confirme ma réservation de salle, mais le courriel automatique dit aussi que je peux utiliser tous les outils sans restriction.",
        "The booking email overpromises equipment authorization."
      ],
      [
        "Karim",
        "Réserver une salle ne prouve pas que chaque personne a reçu une formation adaptée ou possède un droit d’usage sur tout le matériel.",
        "A room booking is not a tool qualification."
      ],
      [
        "Maud",
        "Une feuille de présence montre que j’ai assisté à une séance d’introduction, sans préciser les appareils présentés.",
        "Attendance gives limited information."
      ],
      [
        "Karim",
        "Nous devons vérifier les conditions propres à chaque activité auprès des responsables, plutôt que fabriquer une attestation générale.",
        "Specific permissions should remain authoritative."
      ],
      [
        "Maud",
        "De plus, la salle sera exceptionnellement fermée samedi matin pour une intervention technique.",
        "Saturday morning access will be interrupted."
      ],
      [
        "Karim",
        "Il faut informer les personnes concernées et clarifier si les réservations sont déplacées ou simplement annulées.",
        "Be specific about cancel vs reschedule."
      ],
      [
        "Maud",
        "Je souhaite retrouver mon projet plus tard sans supposer que son ancien créneau ou ses autorisations se reportent automatiquement.",
        "Plan continuity doesn't imply carried-over access."
      ],
      [
        "Karim",
        "Une confirmation nouvelle devra indiquer le créneau, le lieu et les consignes pertinentes, sans demander de données personnelles superflues.",
        "Reconfirmation should state exact terms."
      ],
      [
        "Maud",
        "Je corrigerai le message automatique et préparerai une liste claire de questions pour les responsables.",
        "I'll replace unsupported promises with actionable checks."
      ]
    ],
    "readingTitle": "Règlement d'atelier : un créneau confirmé n'est pas un passe-partout technique",
    "paragraphs": [
      "Un atelier partagé permet aux habitants de réaliser différents projets dans des espaces communs. Maud réserve une salle sur le calendrier du samedi. Elle reçoit un courriel automatique indiquant non seulement que le créneau est confirmé, mais aussi que tous les outils de l’atelier lui sont accessibles. Karim remarque que cette deuxième phrase ne correspond pas aux règles du lieu. Certains équipements demandent des consignes particulières et des décisions explicites. Une réservation de salle fournit une information sur la disponibilité de l’espace; elle ne constitue pas une attestation générale de formation ou une autorisation illimitée.",
      "Une feuille de présence révèle que Maud a participé à une introduction collective, mais elle ne précise pas les outils présentés ni les conditions d’utilisation qui ont été validées. Par ailleurs, une annonce technique prévoit la fermeture exceptionnelle de la salle samedi matin. Les inscriptions déjà reçues ne peuvent donc pas être traitées comme si le créneau devait se dérouler normalement. Le groupe doit vérifier les annulations, les éventuels reports et les permissions avant de préparer de nouvelles activités. Il ne doit pas demander des informations personnelles sans utilité pour ces décisions.",
      "Maud propose de corriger les confirmations automatiques. Elles distingueront clairement le statut de la salle, les conditions d’accès aux équipements et la procédure en cas de fermeture. Les participants seront invités à obtenir une nouvelle confirmation si leur séance doit être déplacée. Cette organisation protège la continuité des projets sans présenter des autorisations que le système ne possède pas. Une documentation précise peut être moins spectaculaire qu’un message de bienvenue général, mais elle rend les activités plus prévisibles et responsables."
    ],
    "evidence": [
      {
        "label": "Makerspace booking confirmation",
        "type": "email",
        "french": "Salle réservée samedi de 9 h à 12 h. Le modèle de confirmation ajoute « accès libre à tous les équipements », sans vérifier les autorisations propres à chaque outil."
      },
      {
        "label": "Facilities closure and induction records",
        "type": "minutes",
        "french": "Fermeture exceptionnelle samedi matin. Présence attestée à une introduction générale, sans inventaire de qualifications pour chaque équipement et sans garantie de report automatique."
      }
    ],
    "reading": [
      [
        "What is actually confirmed by the booking?",
        "un créneau de salle",
        "toutes les qualifications techniques",
        "une formation pour chaque outil",
        "Room availability doesn't certify equipment eligibility."
      ],
      [
        "What does the induction attendance not demonstrate?",
        "une autorisation pour tous les outils",
        "une présence à une séance",
        "une date d’introduction",
        "The attendance sheet lacks device-level coverage."
      ],
      [
        "What is a correct response to closure?",
        "informer et reconfirmer les suites",
        "déclarer tout automatiquement reporté",
        "ignorer les inscrits",
        "Interruption requires explicit status and next-step communication."
      ]
    ],
    "compare": [
      [
        "Which source contains the overbroad equipment claim?",
        "le courriel",
        "le relevé",
        "aucun",
        "The automated confirmation wrongly generalizes room access."
      ],
      [
        "Which source documents the Saturday closure?",
        "le relevé des installations",
        "le courriel",
        "les deux garantissent la tenue",
        "The facilities notice supersedes the old booking plan."
      ]
    ],
    "listen": [
      [
        "What did Maud reserve?",
        "une salle",
        "une machine précise",
        "un contrat d’achat",
        "The reservation concerned room space."
      ],
      [
        "What did the automatic email wrongly grant?",
        "tous les outils",
        "un tarif gratuit",
        "un emploi",
        "It promised unrestricted equipment use."
      ],
      [
        "What does the attendance sheet show?",
        "une introduction générale",
        "une qualification complète",
        "une inspection électrique",
        "Maud attended a general introduction."
      ],
      [
        "What happens Saturday morning?",
        "une fermeture exceptionnelle",
        "une ouverture prolongée",
        "un déménagement définitif",
        "The room won't be available then."
      ],
      [
        "What isn't guaranteed after interruption?",
        "le report automatique",
        "la date du samedi",
        "le nom de Maud",
        "An existing booking doesn't necessarily move itself."
      ],
      [
        "What will the revised notice require?",
        "des confirmations précises",
        "des données intrusives",
        "des qualifications inventées",
        "The new communication separates room, tools and next steps."
      ]
    ],
    "clozes": [
      [
        "Bien que la salle ___ réservée, les outils demandent des règles. (être, subjunctive)",
        "soit",
        "Bien que requires the subjunctive soit.",
        "concession"
      ],
      [
        "Si le lieu rouvre, nous ___ les séances. (reprogrammer, futur)",
        "reprogrammerons",
        "Reprogrammerons expresses a conditional future rather than an automatic transfer.",
        "condition"
      ]
    ],
    "order": [
      "Les accès restent à confirmer",
      [
        "restent à confirmer",
        "Les accès"
      ],
      "Booking and equipment permission must remain distinct.",
      "qualification"
    ],
    "writing": {
      "listening": [
        "Summarize the makerspace's contradictory information without claiming universal tool rights.",
        "Maud reçoit une confirmation de salle accompagnée d’une promesse d’accès à tous les outils. Karim rappelle que cette formule dépasse les autorisations connues. La feuille de présence montre seulement une introduction générale et ne prouve pas une qualification pour chaque équipement. Une fermeture exceptionnelle empêche aussi la séance prévue samedi matin. Les responsables doivent informer les personnes inscrites, clarifier les annulations et demander de nouvelles confirmations pour les éventuels reports. Le message corrigé distinguera réservation, règles techniques et continuité du projet."
      ],
      "sources": [
        "Write a correction notice using the booking and facilities records.",
        "Information concernant les réservations de samedi : le courriel automatique confirmait une salle de neuf à douze heures et mentionnait à tort un accès libre à tous les outils. Les autorisations d’équipement dépendent des conditions propres aux activités, et une présence à une introduction générale ne certifie pas chaque qualification. Par ailleurs, la salle sera exceptionnellement fermée samedi matin. Les personnes inscrites seront informées des possibilités de report ou d’annulation après confirmation des responsables. Aucun ancien créneau ni droit d’usage ne doit être considéré comme automatiquement transféré."
      ],
      "debate": [
        "Defend explicit equipment permissions and interruption recovery without discouraging creative projects.",
        "Un atelier partagé devrait encourager les habitants à apprendre et à mener leurs projets, mais cela suppose des informations fiables sur les espaces et les outils. Un courriel qui promet un accès illimité paraît accueillant, pourtant il peut être trompeur lorsqu’une réservation ne couvre que la salle. Certains craignent que des vérifications particulières rendent l’activité moins spontanée. Je pense toutefois qu’une procédure claire peut éviter les malentendus et protéger la continuité des projets. Je recommande de confirmer séparément les créneaux et les conditions d’usage, puis de communiquer explicitement toute annulation ou nouvelle disponibilité."
      ]
    },
    "oral": [
      "Explain why a room booking should not be presented as full equipment access.",
      "Maud a réservé une salle, mais le message automatique promet aussi tous les outils sans vérification. Sa présence à une introduction ne prouve pas chaque qualification. En plus, la salle sera fermée samedi matin. Je recommande une information claire sur l’annulation, les nouveaux créneaux éventuels et les autorisations spécifiques, sans supposer qu’elles sont transférées automatiquement."
    ]
  }
];
export const U20_115_117=Object.freeze(SOURCE.map((record,i)=>originalB2RevisionProduction(record,115+i)));
