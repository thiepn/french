import {originalB1Production,type U15OriginalSourceStory} from './u15-content-helper.ts';
const SOURCE:readonly U15OriginalSourceStory[]=[
  {
    "id": "transfer-37",
    "title": "Food-surplus charity: offer, stock and safe distribution",
    "goal": "Report a proposed donation without overstating stock availability or safe handling.",
    "grammarKeys": [
      "condition",
      "purpose"
    ],
    "vocabulary": [
      [
        "un don",
        "donation",
        "Un don a été proposé."
      ],
      [
        "un aliment",
        "food item",
        "Chaque aliment doit être vérifié."
      ],
      [
        "un stock",
        "inventory",
        "Le stock reste inconnu."
      ],
      [
        "une collecte",
        "collection",
        "La collecte est prévue demain."
      ],
      [
        "une association",
        "association",
        "L’association organise la distribution."
      ],
      [
        "une conservation",
        "storage",
        "La conservation suit les consignes."
      ],
      [
        "un bénévole",
        "volunteer",
        "Le bénévole suit le responsable."
      ],
      [
        "une date",
        "date",
        "La date doit être lue."
      ],
      [
        "une confirmation",
        "confirmation",
        "Nous attendons la confirmation."
      ],
      [
        "une quantité",
        "quantity",
        "La quantité proposée est approximative."
      ],
      [
        "un responsable",
        "supervisor",
        "Le responsable vérifie les produits."
      ],
      [
        "une distribution",
        "distribution",
        "La distribution dépend du stock accepté."
      ]
    ],
    "dialogue": [
      [
        "Inès",
        "Une boulangerie propose de donner des produits demain matin, mais elle ne connaît pas encore la quantité exacte qu’elle pourra fournir.",
        "A bakery proposes a donation but cannot state exact quantities."
      ],
      [
        "Benoît",
        "L’affiche de notre association décrit les horaires habituels de distribution, pas une garantie que ces produits seront disponibles.",
        "The charity's published times don't guarantee particular stock."
      ],
      [
        "Inès",
        "Il faudra vérifier les produits et suivre les consignes de conservation avant d’annoncer aux familles ce qui pourra être distribué.",
        "Products must be checked and handled according to instructions before promising them."
      ],
      [
        "Benoît",
        "Nous pouvons demander des bénévoles pour préparer l’accueil, mais nous ne devrions pas promettre un panier précis avant confirmation.",
        "We can recruit helpers without promising a specific basket."
      ],
      [
        "Inès",
        "Je rédigerai un message expliquant l’offre, les contrôles nécessaires et la manière dont les informations définitives seront communiquées.",
        "I'll describe the offer and checks before final information."
      ]
    ],
    "readingTitle": "Un don proposé n’est pas un panier garanti",
    "paragraphs": [
      "Une association locale organise des distributions de produits alimentaires. Une boulangerie lui écrit pour proposer un don de produits invendus le lendemain matin. La commerçante ne peut pas encore indiquer le nombre de pièces ni leur composition exacte. Inès est heureuse de cette possibilité et commence à réfléchir au nombre de bénévoles nécessaires. Elle se rend pourtant compte qu'une proposition ne suffit pas à établir quel stock sera effectivement disponible pour les personnes accueillies.",
      "Benoît lui montre l'affiche habituelle de l'association, qui décrit les heures d'ouverture et le fonctionnement général de la distribution. Ce document ne garantit aucun produit particulier. Les responsables doivent aussi examiner les aliments reçus et respecter leurs règles de conservation. Les bénévoles ne doivent pas improviser une décision concernant des produits dont les conditions ne sont pas connues. Une annonce trop précise pourrait créer des attentes impossibles à satisfaire.",
      "Le groupe prépare donc un message prudent. Il remercie la boulangerie pour son offre, demande une confirmation de quantité et réserve la décision de distribution aux responsables qui contrôleront les produits. Les familles seront informées après l'arrivée et la vérification du don. Cette organisation reconnaît à la fois l'intérêt d'une contribution généreuse et les contraintes pratiques qui conditionnent la distribution réelle."
    ],
    "evidence": [
      {
        "label": "Bakery's offer",
        "type": "email",
        "french": "Nous pourrions donner demain matin quelques produits invendus. La quantité et la composition ne sont pas connues à ce stade; nous les préciserons avant la collecte."
      },
      {
        "label": "Association's regular notice",
        "type": "notice",
        "french": "Accueil des bénéficiaires le mardi de 15 h à 17 h. Les produits disponibles varient selon les dons réellement reçus, contrôlés et jugés distribuables par les responsables."
      }
    ],
    "reading": [
      [
        "What is uncertain about the bakery's offer?",
        "la quantité et la composition",
        "l’existence de la boulangerie",
        "l’horaire habituel de l’association",
        "The bakery cannot yet identify exact products or volume."
      ],
      [
        "What does the association's notice actually state?",
        "les horaires habituels",
        "un panier garanti",
        "des produits vérifiés avant arrivée",
        "It describes opening hours, not specific incoming stock."
      ],
      [
        "Who decides whether products can be distributed?",
        "les responsables après contrôle",
        "chaque visiteur à l’avance",
        "l’affiche automatique",
        "The association's responsible staff check product suitability."
      ]
    ],
    "compare": [
      [
        "Which document offers possible future items?",
        "le courriel de la boulangerie",
        "l’affiche habituelle",
        "aucun",
        "The bakery communicates a tentative donation."
      ],
      [
        "Does either promise a specific basket?",
        "non",
        "oui",
        "les deux",
        "Both documents explicitly leave quantities or available products open."
      ]
    ],
    "listen": [
      [
        "Who proposes a donation?",
        "une boulangerie",
        "une librairie",
        "un musée",
        "Inès names a bakery. This detail comes directly from the original spoken exchange."
      ],
      [
        "When might the donation arrive?",
        "demain matin",
        "la semaine prochaine",
        "hier soir",
        "The offer concerns tomorrow morning."
      ],
      [
        "What must be checked?",
        "les produits et leur conservation",
        "la couleur des sacs uniquement",
        "les horaires des trains",
        "Inès requires appropriate checking and storage."
      ],
      [
        "What will the public message avoid?",
        "promettre un panier précis",
        "remercier la boulangerie",
        "décrire la collecte",
        "A specific basket is not guaranteed."
      ]
    ],
    "clozes": [
      [
        "Si les produits arrivent, nous les ___ après contrôle. (distribuer, future)",
        "distribuerons",
        "After si plus present, future distribuerons is possible.",
        "condition"
      ],
      [
        "Nous vérifions les aliments pour que la distribution ___ organisée. (être)",
        "soit",
        "Pour que calls for subjunctive soit.",
        "purpose"
      ]
    ],
    "order": [
      "Le stock reste à confirmer",
      [
        "reste à confirmer",
        "Le stock"
      ],
      "The offered supply may differ from the actual delivered stock.",
      "availability"
    ],
    "writing": {
      "listening": [
        "Summarize the charity's preparation for volunteers.",
        "Une boulangerie a proposé de donner des produits invendus à une association, mais elle ne connaît pas encore la quantité ni la composition du don. Benoît rappelle que les horaires de l’association ne constituent pas une promesse de produits précis. Inès souhaite mobiliser des bénévoles tout en laissant aux responsables le contrôle des aliments et des conditions de conservation. Les familles recevront des informations lorsque le stock aura été livré et vérifié. Il serait incorrect d’annoncer aujourd’hui un panier garanti pour chaque personne."
      ],
      "sources": [
        "Draft a public information note based on the donor and association messages.",
        "Bonjour, une boulangerie nous a proposé un don de produits alimentaires pour demain matin. Nous la remercions de cette initiative, mais la quantité exacte et les produits disponibles restent à confirmer. Les responsables de l’association vérifieront ce qui aura effectivement été reçu et les conditions permettant une distribution appropriée. Notre accueil habituel se déroule mardi de quinze à dix-sept heures; toutefois, ces horaires ne garantissent pas un assortiment précis. Nous communiquerons les informations sur le stock réel après les vérifications nécessaires."
      ],
      "debate": [
        "Argue for transparency even when enthusiasm about donations is justified.",
        "Les dons alimentaires représentent une aide potentiellement importante pour les familles. Il est donc compréhensible que les bénévoles souhaitent les annoncer rapidement. Pourtant, annoncer un panier précis avant de recevoir et de vérifier les produits pourrait décevoir les personnes accueillies et conduire à des décisions inappropriées. Je recommande de remercier le donateur, de préparer une équipe et de garder les quantités provisoires. Dès que les responsables auront confirmé le stock distribuable, une annonce concrète et fiable pourra être faite."
      ]
    },
    "oral": [
      "Explain the difference between a generous offer and available stock.",
      "Une boulangerie souhaite offrir des produits demain, mais leur quantité et leur composition ne sont pas encore établies. Les horaires de l’association ne garantissent pas un panier. Les responsables doivent recevoir et vérifier les aliments en respectant leurs consignes. Je propose donc de préparer les bénévoles sans faire de promesses précises aux familles. L’annonce définitive suivra les vérifications."
    ]
  },
  {
    "id": "transfer-38",
    "title": "Local arts grant: eligibility and evidence of a pending application",
    "goal": "Interpret published criteria and an acknowledgment without declaring an award.",
    "grammarKeys": [
      "passive",
      "polite"
    ],
    "vocabulary": [
      [
        "une subvention",
        "grant",
        "La subvention n’est pas attribuée."
      ],
      [
        "un dossier",
        "application",
        "Le dossier a été envoyé."
      ],
      [
        "un critère",
        "criterion",
        "Chaque critère est expliqué."
      ],
      [
        "une candidature",
        "application",
        "La candidature est recevable sous conditions."
      ],
      [
        "un budget",
        "budget",
        "Le budget doit être justifié."
      ],
      [
        "un projet",
        "project",
        "Le projet reste en préparation."
      ],
      [
        "une pièce jointe",
        "attachment",
        "La pièce jointe manque."
      ],
      [
        "un examen",
        "review",
        "L’examen commence plus tard."
      ],
      [
        "une attribution",
        "award",
        "L’attribution suit la décision."
      ],
      [
        "un délai",
        "period",
        "Le délai est indicatif."
      ],
      [
        "un accusé de réception",
        "receipt",
        "L’accusé confirme seulement l’envoi."
      ],
      [
        "une décision",
        "decision",
        "La décision sera communiquée."
      ]
    ],
    "dialogue": [
      [
        "Olivier",
        "Notre association a envoyé une demande de subvention pour un atelier artistique et reçu un numéro de dossier hier.",
        "Our association submitted a grant application and got a reference."
      ],
      [
        "Salma",
        "Le règlement exige un budget détaillé et une description des participants; avons-nous vérifié les pièces jointes avant l’examen ?",
        "The rules require a budget and participant description; have we checked attachments?"
      ],
      [
        "Olivier",
        "Le courriel automatique confirme seulement la réception de la demande, sans mentionner que le financement est approuvé.",
        "The auto email confirms receipt, not funding."
      ],
      [
        "Salma",
        "Nous pourrions préparer les informations complémentaires et demander poliment si le dossier est complet.",
        "We could prepare additions and ask whether the file is complete."
      ],
      [
        "Olivier",
        "Je dirai aux artistes que le projet est candidat, mais que son financement et sa date définitive restent conditionnels.",
        "I'll tell artists the project applied but lacks confirmed funds."
      ]
    ],
    "readingTitle": "Un numéro de demande n'est pas une aide attribuée",
    "paragraphs": [
      "Une association souhaite organiser un atelier où des habitants pourraient découvrir plusieurs pratiques artistiques. Olivier rédige une demande de subvention afin de financer les matériaux et les intervenants. Le site de l'organisme indique plusieurs critères, notamment une description claire du projet et un budget prévisionnel détaillé. Olivier remplit le formulaire et reçoit ensuite un accusé de réception automatique contenant une référence. Il est soulagé, mais se demande si le financement peut déjà être annoncé.",
      "Salma relit attentivement les documents. Elle constate que l'accusé confirme uniquement que le dossier a été transmis. Le règlement explique qu'un examen suivra et que l'organisme pourra demander des précisions. Le fait de respecter les critères publiés ne garantit pas qu'une demande sera choisie, car les décisions dépendent aussi des procédures et des ressources disponibles. Salma propose donc de vérifier si toutes les pièces sont présentes avant de promettre des achats.",
      "L'association prépare une communication destinée aux artistes intéressés. Elle présente l'objectif de l'atelier et précise qu'une demande de financement a été déposée. La date du projet restera conditionnelle jusqu'à la décision et à la disponibilité des participants. Cette formulation n'empêche pas de préparer les activités pédagogiques, mais évite de confondre une candidature avec un accord officiel. Les bénévoles peuvent ainsi travailler sur le contenu sans engager des dépenses qu'ils supposeraient couvertes."
    ],
    "evidence": [
      {
        "label": "Grant criteria notice",
        "type": "notice",
        "french": "Toute demande doit comprendre une description du projet et un budget détaillé. Les dossiers seront examinés selon les critères publiés; le dépôt ne garantit aucune attribution."
      },
      {
        "label": "Automatic application acknowledgment",
        "type": "email",
        "french": "Nous avons reçu votre formulaire. Référence ART-731. Cet accusé atteste de la réception du dossier et ne vaut pas décision de financement."
      }
    ],
    "reading": [
      [
        "What information is required by the criteria?",
        "un projet et un budget détaillé",
        "un billet de concert",
        "une promesse de succès",
        "The notice requires a description and detailed budget."
      ],
      [
        "What does the receipt prove?",
        "la transmission du dossier",
        "une subvention approuvée",
        "des achats autorisés",
        "The acknowledgment only documents submission."
      ],
      [
        "How should the planned workshop be described?",
        "un projet conditionnel",
        "un événement intégralement financé",
        "une activité terminée",
        "The project remains contingent on the review decision."
      ]
    ],
    "compare": [
      [
        "Which document specifies application criteria?",
        "le règlement",
        "l’accusé automatique",
        "aucun",
        "The public notice lists dossier requirements."
      ],
      [
        "Which document contains ART-731?",
        "le courriel automatique",
        "le règlement",
        "les deux",
        "The acknowledgment supplies the specific reference."
      ]
    ],
    "listen": [
      [
        "What project needs funding?",
        "un atelier artistique",
        "un concert terminé",
        "un bus",
        "Olivier describes an arts workshop."
      ],
      [
        "What has been issued?",
        "un numéro de dossier",
        "une décision finale",
        "un chèque",
        "Only the application reference was received."
      ],
      [
        "What attachments concern Salma?",
        "le budget et la description",
        "un billet de train",
        "une photo personnelle",
        "She checks proposal documents and budgets."
      ],
      [
        "What will Olivier avoid saying?",
        "le financement est approuvé",
        "le dossier est envoyé",
        "le projet est candidat",
        "The grant award is not yet established."
      ]
    ],
    "clozes": [
      [
        "Les candidatures seront ___ selon les critères. (examiner)",
        "examinées",
        "Feminine plural candidatures requires examinées.",
        "passive"
      ],
      [
        "Pourriez-vous ___ si le dossier est complet ?",
        "préciser",
        "The conditional could-you request takes infinitive préciser.",
        "polite clarification"
      ]
    ],
    "order": [
      "La subvention reste à attribuer",
      [
        "reste à attribuer",
        "La subvention"
      ],
      "Submission does not establish approval.",
      "grant status"
    ],
    "writing": {
      "listening": [
        "Give the arts team an accurate application update.",
        "Olivier a envoyé une demande de subvention pour financer un atelier artistique. L’association a reçu une référence, mais cette confirmation automatique ne signifie pas que le projet sera financé. Salma vérifie le budget et la description exigés par le règlement. Elle rappelle que le dossier doit encore être examiné et que des informations complémentaires pourraient être demandées. Les artistes peuvent préparer leurs idées, mais la date et les dépenses importantes restent conditionnelles. Une communication claire évitera de présenter une candidature comme une aide déjà accordée."
      ],
      "sources": [
        "Write a polite follow-up about application completeness.",
        "Bonjour, notre association a transmis une demande de financement pour un atelier artistique et reçu l’accusé de réception ART-731. Nous avons pris connaissance des critères demandant une description du projet et un budget détaillé. Nous comprenons que cet accusé confirme uniquement la réception du dossier et ne constitue pas une décision. Pourriez-vous préciser si les pièces fournies sont complètes ou si des documents supplémentaires sont nécessaires avant l’examen ? Nous attendrons la communication officielle avant d’annoncer le financement et de fixer une date définitive."
      ],
      "debate": [
        "Defend responsible preparation of an unfunded but promising arts project.",
        "Je pense qu’il est utile de préparer le contenu de l’atelier avant la décision, car l’équipe peut réfléchir aux activités et recueillir l’intérêt des participants sans engager de dépenses. Certains bénévoles craignent à juste titre de travailler pour un projet qui ne sera peut-être pas financé. Il faut reconnaître ce risque et limiter les engagements irréversibles. Je recommande donc une préparation pédagogique légère, une vérification du dossier et une annonce transparente sur le caractère conditionnel du financement. L’association décidera des achats seulement après une attribution confirmée."
      ]
    },
    "oral": [
      "Present a funding status report without implying acceptance.",
      "Le projet artistique a fait l’objet d’une demande de subvention. L’organisme a envoyé un accusé de réception portant la référence ART-731, mais n’a pas encore communiqué de décision. L’association doit vérifier le budget et les pièces nécessaires. Nous pouvons poursuivre une préparation limitée sans annoncer que le financement est assuré. Les dépenses et la date définitive dépendront de la réponse officielle."
    ]
  },
  {
    "id": "transfer-39",
    "title": "Local news correction: headline, article and revised fact",
    "goal": "Recognize corrections and describe the scope of a published clarification.",
    "grammarKeys": [
      "report",
      "source"
    ],
    "vocabulary": [
      [
        "un titre",
        "headline",
        "Le titre simplifie l’information."
      ],
      [
        "un article",
        "article",
        "L’article décrit les faits."
      ],
      [
        "une correction",
        "correction",
        "La correction est publiée."
      ],
      [
        "un chiffre",
        "figure",
        "Le chiffre avait été mal reproduit."
      ],
      [
        "une source",
        "source",
        "La source originale est accessible."
      ],
      [
        "une citation",
        "quotation",
        "Une citation doit garder le sens."
      ],
      [
        "une erreur",
        "error",
        "L’erreur concerne une durée."
      ],
      [
        "un journaliste",
        "journalist",
        "Le journaliste précise la modification."
      ],
      [
        "une publication",
        "publication",
        "La publication a été modifiée."
      ],
      [
        "une précision",
        "clarification",
        "Une précision accompagne la correction."
      ],
      [
        "une confiance",
        "trust",
        "La confiance dépend de la transparence."
      ],
      [
        "une rectification",
        "amendment",
        "La rectification reste visible."
      ]
    ],
    "dialogue": [
      [
        "Marine",
        "Un article annonçait que le centre fermerait pendant trois mois, mais une correction précise aujourd’hui qu’il s’agissait de trois semaines.",
        "An article originally said three months; correction says three weeks."
      ],
      [
        "Paul",
        "La rectification change l’importance pratique de l’information, même si la fermeture temporaire elle-même reste prévue.",
        "That matters practically though a closure is still planned."
      ],
      [
        "Marine",
        "Je voudrais partager la version corrigée plutôt que répéter le titre ancien ou affirmer que toute l’information était fausse.",
        "I want to share the corrected version without dismissing all facts."
      ],
      [
        "Paul",
        "Nous devrions conserver la date de mise à jour et expliquer précisément quel chiffre a été corrigé.",
        "We should identify exactly which detail changed."
      ],
      [
        "Marine",
        "Je publierai un résumé indiquant la durée corrigée et les questions qui restent ouvertes, notamment les services accessibles pendant les travaux.",
        "I'll summarize the correction and pending service information."
      ]
    ],
    "readingTitle": "Une correction peut changer le sens pratique d'une nouvelle",
    "paragraphs": [
      "Un journal local publie un article sur des travaux dans un centre culturel. Le titre initial annonce une fermeture de trois mois, ce qui inquiète les personnes qui utilisent régulièrement le bâtiment. Marine transmet cette information à un groupe d'habitants, puis remarque qu'une rectification a été ajoutée au texte. Le journal explique que la durée correcte est de trois semaines et qu'une erreur de rédaction a été commise. La nouvelle version conserve pourtant l'annonce de travaux.",
      "Paul conseille à Marine de ne pas conclure que le centre restera ouvert simplement parce qu'un chiffre était faux. La fermeture temporaire est toujours évoquée, mais son étendue dans le temps change considérablement. Pour expliquer la situation, il faut distinguer le fait commun aux deux versions, l'information corrigée et les points que l'article ne précise pas encore. Les services éventuellement disponibles ailleurs pendant les travaux restent inconnus.",
      "Marine rédige une mise à jour à son groupe. Elle indique que le premier titre mentionnait trois mois, puis que le journal a rectifié la durée à trois semaines. Elle joint la nouvelle référence et conseille de vérifier les informations pratiques auprès du centre avant de modifier des rendez-vous. Elle reconnaît que transmettre une correction explicite est plus utile que laisser circuler une version ancienne. Elle ne transforme pas pour autant l'erreur corrigée en preuve que toutes les autres phrases du journal sont fausses."
    ],
    "evidence": [
      {
        "label": "Initial headline excerpt",
        "type": "article",
        "french": "Centre culturel : une fermeture annoncée pour trois mois à partir du prochain chantier. Cet extrait provient de la première version du titre, avant rectification."
      },
      {
        "label": "Publisher's correction note",
        "type": "notice",
        "french": "Rectification publiée : la durée évoquée est de trois semaines, et non trois mois. Une erreur s’est glissée dans le titre initial; les travaux restent annoncés."
      }
    ],
    "reading": [
      [
        "What was incorrect in the initial article?",
        "la durée",
        "l’existence du centre",
        "la nature culturelle du bâtiment",
        "The correction explicitly concerns the length of closure."
      ],
      [
        "What remains announced after the correction?",
        "des travaux",
        "une fermeture annulée",
        "un nouveau musée",
        "The update retains planned works despite fixing duration."
      ],
      [
        "Which information remains unresolved?",
        "les services pendant les travaux",
        "la durée corrigée",
        "le fait d’une correction",
        "The article doesn't specify alternative access to services."
      ]
    ],
    "compare": [
      [
        "Which source has the superseded duration?",
        "le titre initial",
        "la rectification",
        "aucun",
        "The earlier headline claimed three months."
      ],
      [
        "Which source reports three weeks?",
        "la rectification",
        "le titre initial",
        "les deux",
        "The correction substitutes three weeks for three months."
      ]
    ],
    "listen": [
      [
        "What was the first incorrect duration?",
        "trois mois",
        "trois jours",
        "trois semaines",
        "Marine states the original headline said three months."
      ],
      [
        "What is the corrected duration?",
        "trois semaines",
        "trois mois",
        "trois ans",
        "The note corrects the duration to three weeks."
      ],
      [
        "Does this eliminate the planned work?",
        "non",
        "oui",
        "le journal est fermé",
        "The planned works still exist."
      ],
      [
        "What does Marine want to share?",
        "la version corrigée",
        "le titre ancien uniquement",
        "une nouvelle durée inventée",
        "She favors the updated source."
      ]
    ],
    "clozes": [
      [
        "Le journaliste a expliqué que la durée ___ erronée. (être, imperfect)",
        "était",
        "Reported explanation uses était for the earlier status.",
        "reported speech"
      ],
      [
        "Selon la correction, les travaux dureront trois ___.",
        "semaines",
        "The correction explicitly gives weeks, not months.",
        "source precision"
      ]
    ],
    "order": [
      "La durée a été corrigée",
      [
        "a été corrigée",
        "La durée"
      ],
      "A correction changes the specified fact, not necessarily every other claim.",
      "scope"
    ],
    "writing": {
      "listening": [
        "Summarize the correction without discarding the entire article.",
        "Un journal local a d’abord annoncé une fermeture de trois mois pour des travaux dans un centre culturel. Marine a ensuite découvert une rectification précisant que la durée prévue était de trois semaines. Paul rappelle que cette erreur modifie fortement l’organisation des habitants, mais qu’elle ne signifie pas que les travaux ont été annulés. Marine souhaite partager le texte corrigé et la date de la mise à jour. Elle précisera aussi que les services disponibles pendant la fermeture ne sont pas encore décrits dans ces extraits."
      ],
      "sources": [
        "Write a factual update to people who read the superseded headline.",
        "Bonjour, une information importante a été corrigée dans l’article consacré au centre culturel. Le titre initial indiquait une fermeture de trois mois. Le journal a publié une rectification précisant qu’il s’agit de trois semaines. Cette correction ne supprime pas l’annonce des travaux, mais elle change considérablement la durée évoquée. Nous vous conseillons donc de consulter la version actualisée et de demander directement au centre quels services resteront accessibles. Merci de ne plus relayer le chiffre de trois mois comme s’il était toujours valable."
      ],
      "debate": [
        "Argue why transparent correction supports better public understanding.",
        "Je considère qu’une rectification visible est nécessaire lorsqu’une erreur de durée peut influencer les projets des habitants. Certains lecteurs peuvent perdre confiance après avoir vu deux chiffres différents; cette réaction est compréhensible. Pourtant, la correction explicite permet aussi de comprendre exactement ce qui a changé. Le travail journalistique devrait conserver la trace de l’erreur, préciser sa portée et orienter vers les renseignements pratiques encore manquants. Il serait excessif de traiter toute l’information comme fausse alors que la correction concerne un chiffre spécifique."
      ]
    },
    "oral": [
      "Give an accurate explanation of the corrected news item.",
      "Le journal avait annoncé une fermeture de trois mois, mais il a corrigé cette durée à trois semaines. Les travaux restent prévus; c’est leur durée qui a changé. Il faut informer les personnes qui ont vu le premier titre et leur donner accès à la version rectifiée. Les modalités d’accès aux services pendant les travaux restent à vérifier. Une erreur corrigée ne rend pas automatiquement toutes les autres informations fausses."
    ]
  }
];
export const U15_37_39=Object.freeze(SOURCE.map((record,i)=>originalB1Production(record,37+i)));
