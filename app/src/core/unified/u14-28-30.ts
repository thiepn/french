import {authorU14Scenario,type U14AuthoredScenario} from './u14-model.ts';
const SOURCE:readonly U14AuthoredScenario[]=[
  {
    "id": "transfer-28",
    "title": "Local history exhibition: timelines, captions and attribution",
    "goal": "Interpret conflicting historical exhibition dates and communicate the difference between planning and inauguration.",
    "grammarKeys": [
      "pluperfect",
      "source"
    ],
    "vocabulary": [
      [
        "une exposition",
        "exhibition",
        "L’exposition présente des archives."
      ],
      [
        "une archive",
        "archive",
        "Les archives portent des dates."
      ],
      [
        "une photographie",
        "photograph",
        "La photographie montre la place."
      ],
      [
        "un témoignage",
        "testimony",
        "Le témoignage apporte un détail."
      ],
      [
        "une inauguration",
        "opening ceremony",
        "L’inauguration a eu lieu plus tard."
      ],
      [
        "une construction",
        "construction",
        "La construction a commencé avant."
      ],
      [
        "un projet",
        "project",
        "Le projet avait été annoncé."
      ],
      [
        "une légende",
        "caption",
        "La légende donne une année."
      ],
      [
        "une chronologie",
        "timeline",
        "La chronologie doit être précise."
      ],
      [
        "une interprétation",
        "interpretation",
        "Cette interprétation reste discutable."
      ],
      [
        "un document",
        "document",
        "Le document indique une autre date."
      ],
      [
        "un contexte",
        "context",
        "Le contexte explique la différence."
      ]
    ],
    "dialogue": [
      [
        "Guide",
        "Notre exposition présente l’ancienne bibliothèque du quartier; une légende mentionne 1932, mais l’archive administrative donne 1934.",
        "The exhibition caption says 1932, while an administrative record says 1934."
      ],
      [
        "Élise",
        "Est-ce possible que 1932 corresponde au lancement du projet et 1934 à l’ouverture du bâtiment, plutôt qu’à une erreur dans les deux documents ?",
        "Could 1932 be project launch and 1934 opening rather than one being wrong?"
      ],
      [
        "Guide",
        "C’est une hypothèse plausible, mais nous devons vérifier ce que désigne chaque date avant de la présenter comme une explication historique certaine.",
        "Plausible, but we must check the meaning of each date before treating it as fact."
      ],
      [
        "Élise",
        "Pourrions-nous consulter la formulation exacte du registre et ajouter aux légendes les événements qu’il permet réellement d’établir ?",
        "Could we consult the register wording and specify precisely what it proves?"
      ],
      [
        "Guide",
        "Oui, je vais demander l’archive complète afin de distinguer la préparation, la construction et l’inauguration dans la prochaine version du texte.",
        "I'll request the full record and distinguish preparation, building and inauguration."
      ]
    ],
    "reading": {
      "title": "Une date sans événement peut induire en erreur",
      "paragraphs": [
        "Une exposition consacrée au quartier présente une ancienne bibliothèque. Sous une photographie du bâtiment, une courte légende indique l'année 1932. Certains visiteurs comprennent que la bibliothèque a ouvert ses portes cette année-là. Pourtant, un registre administratif conservé par la ville mentionne une inauguration en 1934. La guide du musée ne sait pas encore pourquoi les dates sont différentes. Elle préfère décrire cette divergence plutôt que de supprimer immédiatement l'une des informations.",
        "Élise propose une explication possible : le projet aurait pu être annoncé en 1932 avant l'ouverture officielle deux ans plus tard. Cette hypothèse semble raisonnable, mais le document disponible ne dit pas à quel événement la première date correspond. La guide demande donc une copie plus complète du registre et cherche les procès-verbaux de l'époque. Il faut distinguer les étapes d'un projet avant de conclure à une erreur ou à une contradiction insoluble.",
        "Dans son projet de nouvelle légende, la guide écrit que les sources présentent deux années, mais que leur signification doit encore être précisée. Elle ne transforme pas l'hypothèse d'Élise en certitude. Lorsque les documents complémentaires seront examinés, le musée pourra identifier la date de préparation, de construction ou d'inauguration, selon les preuves retrouvées. Cette démarche illustre l'importance du contexte pour lire des sources historiques."
      ],
      "questions": [
        [
          "What year does the photograph caption show?",
          "1932",
          [
            "1932",
            "1934",
            "1942"
          ],
          "The caption contains 1932 without specifying precisely which event it names."
        ],
        [
          "What event is linked to 1934?",
          "l’inauguration",
          [
            "la préparation",
            "l’inauguration",
            "la démolition"
          ],
          "The administrative record names an inauguration in 1934."
        ],
        [
          "Is the proposed 1932 planning explanation established?",
          "non",
          [
            "oui",
            "non",
            "la photo le prouve"
          ],
          "It is a plausible hypothesis, not yet documented by the available caption."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Undated exhibit caption",
        "type": "article",
        "french": "Ancienne bibliothèque du quartier — 1932. Cette légende abrégée accompagne une photographie mais ne précise pas si l’année concerne un projet, la construction ou l’ouverture."
      },
      {
        "label": "Municipal inauguration register extract",
        "type": "data",
        "french": "Registre : cérémonie d’inauguration de la bibliothèque en 1934. L’extrait ne donne pas la date à laquelle le projet a été proposé ou lancé."
      }
    ],
    "comparison": [
      [
        "Which document explicitly identifies an inauguration?",
        "le registre",
        [
          "le registre",
          "la légende",
          "aucun"
        ],
        "The register specifies the event associated with 1934."
      ],
      [
        "Can the sources establish that the building opened in 1932?",
        "non",
        [
          "oui",
          "non",
          "les deux le disent"
        ],
        "The caption supplies only a year without identifying an opening event."
      ]
    ],
    "listening": [
      [
        "Which two years are discussed?",
        "1932 et 1934",
        [
          "1932 et 1934",
          "1930 et 1931",
          "1944 et 1952"
        ],
        "The guide contrasts the caption and register years."
      ],
      [
        "What explanation does Élise propose?",
        "projet puis ouverture",
        [
          "projet puis ouverture",
          "fermeture puis démolition",
          "deux bibliothèques"
        ],
        "She suggests the dates could mark different stages of one project."
      ],
      [
        "What will the guide request?",
        "l’archive complète",
        [
          "l’archive complète",
          "une nouvelle photo inventée",
          "un livre de fiction"
        ],
        "The guide plans to obtain fuller archival context."
      ]
    ],
    "recall": {
      "clozes": [
        [
          "Le projet avait été ___ avant l’inauguration. (annoncer)",
          "annoncé",
          "Past perfect passive can locate a prior announcement, but only when established.",
          "prior event"
        ],
        [
          "Selon le registre, l’inauguration ___ eu lieu en 1934. (avoir)",
          "a",
          "Passé composé a eu lieu reports the event explicitly attributed to the register.",
          "attributed past"
        ]
      ],
      "order": [
        "La première date reste à expliquer",
        [
          "reste à expliquer",
          "La première date"
        ],
        "The caption's event reference is not specified by available evidence.",
        "historical caution"
      ]
    },
    "writing": {
      "fromListening": [
        "Write a neutral exhibition guide note summarizing the chronological uncertainty.",
        [
          "Mention each year and the source that contains it.",
          "Distinguish the proposed explanation from documented facts.",
          "Explain which additional record is needed."
        ],
        "Une photographie de l’ancienne bibliothèque porte une légende indiquant 1932. En revanche, un registre administratif mentionne une inauguration en 1934. Élise propose que la première année corresponde au lancement du projet, mais cette explication n’est pas encore établie. La guide prévoit de demander l’archive complète afin de distinguer les différentes étapes. Pour le moment, le musée devrait présenter les deux dates en précisant ce que chaque document indique réellement. Il serait incorrect d’affirmer que la bibliothèque a ouvert en 1932 sans preuve supplémentaire."
      ],
      "fromSources": [
        "Rewrite a museum label that is concise, correct and transparent about uncertainty.",
        [
          "Name the photograph caption and municipal register separately.",
          "Avoid inventing a planning or construction date.",
          "Explain that fuller archives may resolve the ambiguity."
        ],
        "Ancienne bibliothèque du quartier. La légende associée à cette photographie mentionne l’année 1932, sans préciser l’événement concerné. Un extrait du registre municipal indique en revanche que la cérémonie d’inauguration a eu lieu en 1934. Ces deux informations pourraient se rapporter à des étapes différentes du projet, mais les documents actuellement présentés ne permettent pas de le confirmer. Le musée examine des archives complémentaires afin de préciser la chronologie. Cette notice sera actualisée lorsque les événements correspondant à chaque date seront établis."
      ]
    },
    "oral": {
      "prompt": "Give a concise museum explanation without resolving the timeline by guesswork.",
      "plan": [
        "State both documented years.",
        "Name the hypothesis as a hypothesis.",
        "Identify the archive needed to reach a firmer conclusion."
      ],
      "model": "La photographie porte l’année 1932, mais la légende ne précise pas à quel événement cette date correspond. Le registre municipal mentionne une inauguration en 1934. Il est possible que la première année concerne le projet ou la construction, mais nous n’avons pas encore de preuve. La guide souhaite consulter l’archive complète avant de modifier l’explication. Une bonne présentation historique doit distinguer les dates attestées, leurs événements et les hypothèses."
    }
  },
  {
    "id": "transfer-29",
    "title": "Digital service incident: status page, help desk and user update",
    "goal": "Distinguish reported downtime, partial restoration and individually verified access without making unsupported promises.",
    "grammarKeys": [
      "passive",
      "report"
    ],
    "vocabulary": [
      [
        "une panne",
        "outage",
        "Une panne affecte le service."
      ],
      [
        "un compte",
        "account",
        "Mon compte est accessible."
      ],
      [
        "une connexion",
        "connection",
        "La connexion échoue."
      ],
      [
        "une page d’état",
        "status page",
        "La page d’état indique un incident."
      ],
      [
        "une restauration",
        "restoration",
        "La restauration est partielle."
      ],
      [
        "un incident",
        "incident",
        "L’incident est en cours."
      ],
      [
        "une vérification",
        "verification",
        "La vérification continue."
      ],
      [
        "un utilisateur",
        "user",
        "Chaque utilisateur peut signaler un problème."
      ],
      [
        "un service",
        "service",
        "Le service fonctionne parfois."
      ],
      [
        "un correctif",
        "fix",
        "Le correctif n’est pas confirmé."
      ],
      [
        "une mise à jour",
        "update",
        "Une mise à jour sera publiée."
      ],
      [
        "un délai",
        "timeframe",
        "Le délai n’est pas garanti."
      ]
    ],
    "dialogue": [
      [
        "Ana",
        "Depuis ce matin, je n’arrive pas à ouvrir mon espace de cours, et la page d’état indique qu’un incident touche certaines connexions.",
        "I can't open my course space, and the status page reports an incident affecting some connections."
      ],
      [
        "Technicien",
        "Une partie du service a été rétablie, mais nous vérifions encore les accès et ne pouvons pas garantir que tous les comptes fonctionnent.",
        "Some service is restored, but not all accounts are verified."
      ],
      [
        "Ana",
        "Je peux consulter la page d’accueil, pourtant mon espace personnel reste inaccessible; est-ce utile de signaler ce détail avec l’heure de l’essai ?",
        "I can access the homepage but not my personal space; should I report the attempted time?"
      ],
      [
        "Technicien",
        "Oui, décrivez ce qui fonctionne et ce qui échoue sans transmettre de mot de passe; une mise à jour officielle expliquera les prochaines étapes.",
        "Yes, describe working and failing features without sharing passwords."
      ],
      [
        "Ana",
        "Je vais informer mon groupe qu’un rétablissement partiel a été signalé, sans annoncer que l’incident est terminé pour chacun.",
        "I'll tell classmates partial recovery was reported, not that everyone is restored."
      ]
    ],
    "reading": {
      "title": "La page d'accueil fonctionne, pas forcément tous les espaces",
      "paragraphs": [
        "Un matin, plusieurs étudiants ne parviennent pas à accéder à leur espace de cours en ligne. La page d'état du service mentionne un incident affectant certaines connexions. Ana essaie de se reconnecter et parvient à ouvrir la page d'accueil, mais son espace personnel ne charge toujours pas. Elle se demande si cette amélioration signifie que le service est complètement rétabli. En consultant le message officiel, elle remarque le mot « partiel ».",
        "Le support explique que certaines fonctions ont été restaurées, tandis que des vérifications se poursuivent pour les comptes concernés. Le service n'a pas annoncé d'heure de résolution garantie. Ana prépare un signalement contenant la période approximative des essais, les pages qui fonctionnent et celles qui restent inaccessibles. Elle ne fournit pas de mot de passe ni d'autres informations secrètes. Le technicien lui conseille de suivre les prochaines mises à jour officielles.",
        "Dans le groupe d'étudiants, Ana décrit la situation avec précision. Elle écrit que l'accès à certaines pages semble revenu, mais que des utilisateurs signalent encore des difficultés. Elle évite de conclure que tous les comptes sont réparés parce que la page d'accueil s'ouvre. Son message aide les autres à comprendre la différence entre un rétablissement partiel, une vérification en cours et une résolution complète qui reste à confirmer."
      ],
      "questions": [
        [
          "What does partial restoration mean here?",
          "certaines fonctions reviennent",
          [
            "certaines fonctions reviennent",
            "tous les comptes sont réparés",
            "le service est supprimé"
          ],
          "The provider reports some functions restored while others still fail."
        ],
        [
          "Which information can Ana responsibly report?",
          "les pages et heures d’échec",
          [
            "son mot de passe",
            "les pages et heures d’échec",
            "les identifiants d’autrui"
          ],
          "Nonsecret failure context helps support without exposing credentials."
        ],
        [
          "Is a complete restoration time guaranteed?",
          "non",
          [
            "oui",
            "non",
            "la page d’accueil le prouve"
          ],
          "The status information does not promise an exact resolution time."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Official service status update",
        "type": "notice",
        "french": "Incident de connexion en cours. Certaines fonctions ont été rétablies; les accès restants font encore l’objet de vérifications. Aucun horaire de résolution définitive n’est garanti."
      },
      {
        "label": "User-facing support reply",
        "type": "email",
        "french": "Vous pouvez signaler les pages inaccessibles et l’heure approximative des essais. Ne transmettez jamais de mot de passe. Nous informerons les utilisateurs lorsque la restauration sera confirmée."
      }
    ],
    "comparison": [
      [
        "Which document describes the incident's global status?",
        "la page d’état",
        [
          "la page d’état",
          "la réponse d’aide",
          "aucun"
        ],
        "The status notice characterizes partial recovery across the service."
      ],
      [
        "What does support explicitly warn not to share?",
        "un mot de passe",
        [
          "un mot de passe",
          "une heure approximative",
          "une page inaccessible"
        ],
        "The reply says not to transmit credentials."
      ]
    ],
    "listening": [
      [
        "What remains inaccessible for Ana?",
        "son espace personnel",
        [
          "son espace personnel",
          "la page d’accueil",
          "le site du musée"
        ],
        "Ana can open the homepage but not her personal course space."
      ],
      [
        "Which recovery status is reported?",
        "partiel",
        [
          "partiel",
          "total garanti",
          "aucun incident"
        ],
        "The technician says some service has been restored."
      ],
      [
        "What should Ana avoid supplying?",
        "son mot de passe",
        [
          "son mot de passe",
          "l’heure de l’essai",
          "la page défaillante"
        ],
        "The help desk explicitly discourages password disclosure."
      ]
    ],
    "recall": {
      "clozes": [
        [
          "Certaines fonctions ont été ___ . (rétablir)",
          "rétablies",
          "Feminine plural fonctions triggers agreement in passive passé composé.",
          "passive agreement"
        ],
        [
          "Le technicien a précisé que la restauration ___ partielle. (être, imperfect)",
          "était",
          "Indirect speech following a past report uses était to describe the state.",
          "reported status"
        ]
      ],
      "order": [
        "La résolution reste à confirmer",
        [
          "reste à confirmer",
          "La résolution"
        ],
        "Partial recovery is not evidence of complete resolution.",
        "incident status"
      ]
    },
    "writing": {
      "fromListening": [
        "Summarize the incident for classmates without overstating recovery.",
        [
          "Differentiate homepage access from personal-space access.",
          "State that recovery remains partial.",
          "Avoid collecting credentials or guaranteeing a deadline."
        ],
        "Ana n’arrive pas à ouvrir son espace de cours en ligne, même si la page d’accueil fonctionne de nouveau. Le service a annoncé une restauration partielle, mais certaines connexions restent à vérifier. Le technicien a conseillé de signaler les pages concernées et les heures approximatives des essais, sans communiquer de mot de passe. Il n’a donné aucune heure de résolution garantie. Le groupe peut donc suivre la page d’état et attendre une confirmation avant d’annoncer que tous les comptes fonctionnent."
      ],
      "fromSources": [
        "Compose a clear support inquiry and public update referencing the official notice.",
        [
          "Distinguish the status page's partial restoration from your individual failure.",
          "Provide nonsecret symptoms only.",
          "Request an update but not a promised recovery time."
        ],
        "Bonjour, la page d’état indique qu’une partie du service a été rétablie, mais que les vérifications continuent. De mon côté, la page d’accueil s’ouvre, tandis que mon espace de cours reste inaccessible depuis ce matin. Je peux fournir les heures approximatives de mes essais et les noms des pages concernées, sans transmettre de mot de passe. Pourriez-vous me préciser s’il existe une mise à jour concernant cette fonction et comment suivre la résolution ? Je comprends qu’aucun délai définitif n’est actuellement garanti."
      ]
    },
    "oral": {
      "prompt": "Give a truthful incident update to a class group after partial service recovery.",
      "plan": [
        "Report what Ana can and cannot access.",
        "Distinguish partial recovery from full resolution.",
        "State safe support details and the absence of a guaranteed deadline."
      ],
      "model": "La plateforme de cours connaît un incident de connexion. Certaines fonctions ont été rétablies, mais le service n’a pas annoncé une résolution complète. Ana peut ouvrir la page d’accueil, mais pas son espace personnel. Le support demande des informations sur les pages concernées et les heures des essais, sans mot de passe. Nous devons donc suivre les mises à jour officielles plutôt que de promettre une heure de retour à la normale."
    }
  },
  {
    "id": "transfer-30",
    "title": "B1+ capstone: plan a public lecture from conflicting sources",
    "goal": "Independently synthesize schedules, room access, speakers' positions and a conditional communication plan.",
    "grammarKeys": [
      "relative",
      "concession"
    ],
    "vocabulary": [
      [
        "une conférence",
        "lecture",
        "La conférence est proposée."
      ],
      [
        "un intervenant",
        "speaker",
        "L’intervenant attend une confirmation."
      ],
      [
        "une salle",
        "room",
        "La salle doit être vérifiée."
      ],
      [
        "une invitation",
        "invitation",
        "L’invitation indique vingt heures."
      ],
      [
        "un programme",
        "program",
        "Le programme est provisoire."
      ],
      [
        "une réservation",
        "booking",
        "La réservation n’est pas confirmée."
      ],
      [
        "un accès",
        "access",
        "L’accès est en travaux."
      ],
      [
        "une inscription",
        "registration",
        "L’inscription ouvre bientôt."
      ],
      [
        "un responsable",
        "coordinator",
        "Le responsable répondra."
      ],
      [
        "une consultation",
        "consultation",
        "Une consultation est prévue."
      ],
      [
        "une modification",
        "change",
        "Une modification reste possible."
      ],
      [
        "une synthèse",
        "synthesis",
        "La synthèse distingue les incertitudes."
      ]
    ],
    "dialogue": [
      [
        "Clara",
        "L’invitation annonce une conférence vendredi à vingt heures dans la grande salle, mais le programme récent indique dix-neuf heures trente sans confirmer le lieu.",
        "The invitation says Friday eight in the main hall; the new program says 7:30 and omits venue confirmation."
      ],
      [
        "Malik",
        "La grande salle pourrait être indisponible pendant les travaux; nous devons vérifier le lieu avant d’inviter des personnes qui ont des contraintes d’accès.",
        "The main hall may be unavailable due to works; we need to check access before inviting people."
      ],
      [
        "Clara",
        "L’intervenante a accepté de préparer sa présentation, mais elle n’a pas confirmé qu’elle pouvait arriver à dix-neuf heures trente.",
        "The speaker agreed to prepare her talk but hasn't confirmed a 7:30 arrival."
      ],
      [
        "Malik",
        "Nous pourrions proposer un horaire précis après consultation du responsable et de l’intervenante, puis informer les participants des accès vérifiés.",
        "We could confirm time with the manager and speaker, then share verified access."
      ],
      [
        "Clara",
        "Je rédigerai donc une synthèse qui sépare les annonces publiées, les conditions pratiques et les engagements réellement acceptés.",
        "I'll separate posted notices, practical constraints and actual commitments."
      ]
    ],
    "reading": {
      "title": "Une conférence ne peut pas être annoncée à deux heures définitives",
      "paragraphs": [
        "Une association prépare une conférence publique sur l'histoire de son quartier. Une première invitation envoyée aux membres annonce vendredi à vingt heures dans la grande salle. Quelques jours plus tard, un programme provisoire est partagé sur un autre canal : il mentionne dix-neuf heures trente, mais ne confirme pas l'emplacement. Certains bénévoles supposent que le second document remplace automatiquement le premier. Clara remarque toutefois qu'aucune personne responsable n'a expliqué ce changement.",
        "Une difficulté supplémentaire concerne le bâtiment. Des travaux pourraient rendre la grande salle indisponible, et le chemin d'accès habituel pourrait également être modifié. L'intervenante a accepté de préparer son exposé, mais elle n'a pas encore répondu à la proposition d'horaire avancé. Malik conseille de contacter le responsable des salles et l'intervenante avant d'envoyer une nouvelle annonce. Il rappelle qu'accepter de préparer un exposé ne signifie pas accepter n'importe quel changement d'horaire.",
        "Clara rédige une note de synthèse. Elle indique que la date de vendredi figure dans les deux documents, mais que l'heure et le lieu restent incertains. Elle recommande de vérifier la disponibilité de la salle, les conditions d'accès et la réponse de l'intervenante. Lorsque ces informations auront été confirmées, le groupe pourra communiquer un programme cohérent et ouvrir les inscriptions. Sa note est utile précisément parce qu'elle distingue les faits, les hypothèses et les décisions encore nécessaires."
      ],
      "questions": [
        [
          "Which detail is common to both program documents?",
          "vendredi",
          [
            "vendredi",
            "vingt heures",
            "la grande salle confirmée"
          ],
          "Both texts concern Friday even though the times disagree."
        ],
        [
          "What is not established about the speaker?",
          "sa disponibilité à dix-neuf heures trente",
          [
            "sa disponibilité à dix-neuf heures trente",
            "son accord pour préparer l’exposé",
            "l’existence du sujet"
          ],
          "The speaker agreed to prepare, not to an earlier arrival."
        ],
        [
          "What must precede final registration announcements?",
          "vérifier horaire, salle et accès",
          [
            "vérifier horaire, salle et accès",
            "choisir une affiche colorée",
            "supposer tous les accès ouverts"
          ],
          "Time, venue and actual entry route remain unconfirmed."
        ]
      ]
    },
    "evidence": [
      {
        "label": "First association invitation",
        "type": "email",
        "french": "Conférence d’histoire locale vendredi à 20 h, grande salle du centre. Les informations pratiques seront confirmées avant l’ouverture des inscriptions."
      },
      {
        "label": "Recent provisional program",
        "type": "notice",
        "french": "Projet de programme : conférence vendredi à 19 h 30. L’horaire proposé, la salle et les conditions d’accès restent soumis aux confirmations nécessaires."
      }
    ],
    "comparison": [
      [
        "Which fact is securely shared by both texts?",
        "le jour vendredi",
        [
          "le jour vendredi",
          "une heure unique",
          "l’accès garanti"
        ],
        "Both sources identify Friday without agreeing on all practical details."
      ],
      [
        "Can either document establish the final venue and start time together?",
        "non",
        [
          "oui",
          "non",
          "la première version suffit toujours"
        ],
        "Both notices explicitly leave final practical details to further confirmation."
      ]
    ],
    "listening": [
      [
        "What two opening times are mentioned?",
        "vingt heures et dix-neuf heures trente",
        [
          "vingt heures et dix-neuf heures trente",
          "neuf et dix heures",
          "dix-huit et dix-neuf heures"
        ],
        "Clara contrasts twenty hours with nineteen thirty."
      ],
      [
        "What has the speaker actually accepted?",
        "préparer la présentation",
        [
          "préparer la présentation",
          "arriver à dix-neuf heures trente",
          "choisir la salle"
        ],
        "The speaker's commitment concerns preparation, not early arrival."
      ],
      [
        "What practical condition may affect the venue?",
        "les travaux et l’accès",
        [
          "les travaux et l’accès",
          "la couleur des billets",
          "la durée des applaudissements"
        ],
        "Malik raises potential room closure and access changes."
      ]
    ],
    "recall": {
      "clozes": [
        [
          "Ce ___ reste incertain, c’est la salle.",
          "qui",
          "Ce qui introduces the subject of reste and refers to an unspecified element.",
          "relative subject"
        ],
        [
          "Bien que le projet ___ intéressant, la salle doit être vérifiée. (être)",
          "soit",
          "Bien que selects subjunctive soit to express concession.",
          "concession"
        ]
      ],
      "order": [
        "Le programme reste à confirmer",
        [
          "reste à confirmer",
          "Le programme"
        ],
        "The documents contain proposed details without final authorization.",
        "cross-source synthesis"
      ]
    },
    "writing": {
      "fromListening": [
        "Write an independent facilitator's recap of the dialogue and unresolved decision chain.",
        [
          "Identify both proposed starting times and source statuses.",
          "Distinguish the speaker's presentation commitment from schedule availability.",
          "Recommend an ordered confirmation workflow before public registration."
        ],
        "La conférence est envisagée vendredi, mais deux horaires différents circulent. L’invitation initiale annonce vingt heures, tandis que le programme récent propose dix-neuf heures trente. L’intervenante a accepté de préparer son exposé, sans confirmer le nouvel horaire. Des travaux pourraient aussi modifier l’accès à la grande salle. Malik recommande de vérifier la disponibilité du lieu et de consulter l’intervenante avant toute annonce définitive. Clara rédigera une synthèse qui distingue les faits connus, les propositions et les réponses attendues. Les inscriptions devraient commencer seulement lorsque les détails pratiques auront été confirmés."
      ],
      "fromSources": [
        "Produce a public-facing B1+ clarification notice comparing both program versions without inventing final arrangements.",
        [
          "Attribute the two different times to their correct sources.",
          "Explain venue and access uncertainty and speaker confirmation.",
          "Give the audience an exact next step and condition for a final announcement."
        ],
        "Bonjour, notre association prépare une conférence d’histoire locale pour vendredi. L’invitation initiale mentionne vingt heures dans la grande salle du centre, mais un programme provisoire plus récent propose dix-neuf heures trente sans confirmer le lieu. Nous devons encore vérifier la disponibilité de la salle, les conditions d’accès pendant les travaux et la réponse de l’intervenante au nouvel horaire. Bien que les deux documents annoncent le même jour, aucune heure définitive ne peut encore être publiée. Nous communiquerons le programme final et les modalités d’inscription lorsque ces éléments auront été confirmés. Merci de votre compréhension."
      ]
    },
    "oral": {
      "prompt": "Deliver a 90-second public lecture briefing that separates facts, proposed changes and outstanding commitments.",
      "plan": [
        "State the common day and conflicting times.",
        "Explain the speaker's actual commitment and venue concerns.",
        "Describe a conditional confirmation and public communication sequence."
      ],
      "model": "La conférence d’histoire locale est prévue vendredi, mais son horaire exact reste à confirmer. L’invitation initiale indiquait vingt heures dans la grande salle, alors que le programme provisoire mentionne dix-neuf heures trente. L’intervenante a accepté de préparer sa présentation, mais pas encore le nouveau créneau. Des travaux pourraient également modifier la salle ou son accès. Nous allons consulter le responsable et l’intervenante, puis communiquer une décision complète. Il serait prématuré d’ouvrir les inscriptions avec des informations contradictoires."
    }
  }
];
export const U14_28_30=Object.freeze(SOURCE.map((record,i)=>authorU14Scenario(record,28+i)));
