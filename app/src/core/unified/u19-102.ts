import {originalB1CriticalProduction,type U19OriginalSourceStory} from './u19-content-helper.ts';
const SOURCE:readonly U19OriginalSourceStory[]=[
  {
    "id": "transfer-102",
    "title": "Community electronics workshop: a reported fix versus independently verified repair",
    "goal": "Distinguish symptom reports, limited bench tests and permissions before claiming a device repaired.",
    "grammarKeys": [
      "passive",
      "condition"
    ],
    "vocabulary": [
      [
        "un appareil",
        "device",
        "L’appareil reste débranché."
      ],
      [
        "une panne",
        "fault",
        "La panne n’est pas identifiée."
      ],
      [
        "un symptôme",
        "symptom",
        "Le symptôme a disparu une fois."
      ],
      [
        "un essai",
        "trial",
        "L’essai a été limité."
      ],
      [
        "un contrôle",
        "check",
        "Le contrôle doit être adapté."
      ],
      [
        "une réparation",
        "repair",
        "La réparation n’est pas certifiée."
      ],
      [
        "un propriétaire",
        "owner",
        "Le propriétaire autorise une démarche."
      ],
      [
        "une fiche",
        "record",
        "La fiche décrit les observations."
      ],
      [
        "un composant",
        "component",
        "Le composant n’a pas été examiné."
      ],
      [
        "un retour",
        "feedback",
        "Le retour porte sur un essai."
      ],
      [
        "une limite",
        "limit",
        "La limite doit être signalée."
      ],
      [
        "une autorisation",
        "authorization",
        "L’autorisation doit être explicite."
      ]
    ],
    "dialogue": [
      [
        "Roxane",
        "Un bénévole a annoncé que l’appareil était réparé parce qu’il s’est allumé une fois pendant l’atelier.",
        "A device turned on once and was called repaired."
      ],
      [
        "Mehdi",
        "Un démarrage réussi ne démontre pas nécessairement que la panne d’origine a été comprise ou résolue durablement.",
        "One boot doesn't prove a durable fix."
      ],
      [
        "Roxane",
        "La fiche indique d’ailleurs qu’aucun contrôle complémentaire n’a été réalisé et que le symptôme initial pourrait revenir.",
        "The note says no broader check was performed."
      ],
      [
        "Mehdi",
        "Il faut aussi respecter ce que le propriétaire a réellement autorisé, sans entreprendre des interventions supplémentaires de notre propre initiative.",
        "Respect the owner's permission boundaries."
      ],
      [
        "Roxane",
        "Je ne veux pas donner des instructions techniques à des personnes qui ne sont pas qualifiées pour travailler sur un appareil dangereux.",
        "We should not turn this lesson into unsafe repair directions."
      ],
      [
        "Mehdi",
        "Nous pouvons décrire les observations, l’incertitude et la nécessité d’un avis compétent sans prétendre délivrer un certificat de sécurité.",
        "Report facts, not fabricated safety certification."
      ],
      [
        "Roxane",
        "Le message public pourrait dire qu’un essai a fonctionné, mais que l’appareil n’a pas été déclaré fiable.",
        "The announcement can limit the claim to one successful trial."
      ],
      [
        "Mehdi",
        "Le propriétaire doit pouvoir choisir la suite après avoir reçu une description honnête des limites de l’atelier.",
        "The owner needs informed choice."
      ],
      [
        "Roxane",
        "J’écrirai une note d’intervention qui sépare les actions acceptées, les résultats observés et les contrôles non effectués.",
        "I'll record permissions, observations and missing checks."
      ]
    ],
    "readingTitle": "Compte rendu d'atelier : un appareil allumé n'est pas forcément un appareil réparé",
    "paragraphs": [
      "Dans un atelier associatif, des bénévoles aident les habitants à comprendre les problèmes rencontrés avec de petits appareils. Roxane remarque qu'un objet apporté par un participant a réussi à démarrer une fois après une intervention limitée. Un autre bénévole annonce immédiatement dans le groupe que l'appareil est réparé et peut être réutilisé sans réserve. La fiche de l'atelier ne soutient pourtant pas cette conclusion : elle mentionne seulement un essai de démarrage. Le problème initial n'a pas été identifié de manière certaine, et aucun contrôle complet n'est enregistré.",
      "Mehdi souligne qu'un résultat ponctuel peut être encourageant sans constituer une preuve de fonctionnement durable. Il faut également savoir quelles démarches le propriétaire a autorisées. Un atelier de quartier ne devrait pas inventer un diagnostic technique ou donner une certification de sécurité qu'il n'est pas en mesure de délivrer. Les bénévoles peuvent aider à consigner le symptôme rapporté, les observations réalisées et les vérifications qui restent nécessaires. Si des risques techniques existent, la suite doit relever de personnes compétentes dans des conditions adaptées.",
      "Roxane prépare un message de suivi. Il indique que l'appareil s'est allumé pendant un essai limité, sans affirmer que le défaut initial est éliminé. La note précise les limites de l'observation et demande au propriétaire comment il souhaite poursuivre après avoir reçu ces informations. Une communication prudente n'enlève rien à la valeur du travail associatif; elle évite simplement de transformer un résultat partiel en promesse de fiabilité. Le groupe souhaite adopter cette manière de documenter les essais futurs."
    ],
    "evidence": [
      {
        "label": "Repair workshop test sheet",
        "type": "data",
        "french": "Un démarrage observé durant un essai limité. Cause initiale de la panne non déterminée; aucune vérification approfondie de fiabilité ou de sécurité n’est documentée."
      },
      {
        "label": "Volunteer public announcement draft",
        "type": "chat",
        "french": "« Appareil totalement réparé et utilisable sans problème. » Cette affirmation dépasse le résultat enregistré sur la fiche d’essai."
      }
    ],
    "reading": [
      [
        "What was actually observed?",
        "un démarrage unique",
        "un fonctionnement durable certifié",
        "une panne identifiée",
        "The sheet records only one successful start."
      ],
      [
        "What remains unknown?",
        "fiabilité et cause du défaut",
        "la présence d’un appareil",
        "l’existence du bénévole",
        "Neither root cause nor broader testing is established."
      ],
      [
        "What update is accurate?",
        "essai réussi, contrôle incomplet",
        "sécurité certifiée",
        "panne éliminée définitivement",
        "The report must limit claims to verified observations."
      ]
    ],
    "compare": [
      [
        "Which source records the one start?",
        "la fiche d’essai",
        "l’annonce",
        "aucun",
        "The test sheet is specific about the observed event."
      ],
      [
        "Which source overstates reliability?",
        "l’annonce publique",
        "la fiche",
        "les deux certifient la sécurité",
        "The draft claims a complete fix without supporting evidence."
      ]
    ],
    "listen": [
      [
        "What happened once?",
        "l’appareil a démarré",
        "l’appareil a disparu",
        "une garantie a été signée",
        "Roxane reports one start."
      ],
      [
        "What has not been determined?",
        "la cause de la panne",
        "l’existence du propriétaire",
        "la date de l’atelier",
        "Mehdi notes the unknown cause."
      ],
      [
        "What must be respected?",
        "l’autorisation du propriétaire",
        "la publicité seulement",
        "une garantie imaginaire",
        "The owner controls permitted work."
      ],
      [
        "What should the group avoid issuing?",
        "une certification de sécurité",
        "une fiche factuelle",
        "une question ouverte",
        "A limited volunteer test is not safety qualification."
      ],
      [
        "What will the updated message state?",
        "un essai fonctionnel limité",
        "une réparation totale",
        "une garantie illimitée",
        "Roxane will report the narrower observed result."
      ],
      [
        "Who decides the next authorized step?",
        "le propriétaire informé",
        "un visiteur inconnu",
        "un automate",
        "Mehdi emphasizes informed ownership."
      ]
    ],
    "clozes": [
      [
        "Un essai ___ réalisé. (être, passé composé passif)",
        "a été",
        "A été réalisé expresses a completed passive action.",
        "passive"
      ],
      [
        "Si un contrôle est nécessaire, nous ___ un professionnel. (consulter, futur)",
        "consulterons",
        "A real si-clause takes future consulterons.",
        "condition"
      ]
    ],
    "order": [
      "La fiabilité reste à vérifier",
      [
        "reste à vérifier",
        "La fiabilité"
      ],
      "One successful start does not certify reliability.",
      "testing"
    ],
    "writing": {
      "listening": [
        "Give the device owner a precise recap without technical safety promises.",
        "Roxane constate qu’un appareil s’est allumé une fois lors d’un essai limité. Mehdi rappelle qu’un tel résultat ne démontre pas la disparition durable de la panne. La fiche ne contient ni cause identifiée ni vérification approfondie. Le groupe doit aussi respecter les limites de l’autorisation du propriétaire et éviter de délivrer une certification qu’il ne possède pas. Le message public sera corrigé pour décrire seulement l’essai réalisé. Le propriétaire pourra ensuite décider de la suite à partir d’informations exactes."
      ],
      "sources": [
        "Correct the workshop's unsupported success announcement.",
        "Rectification de notre compte rendu : l’appareil examiné durant l’atelier a démarré lors d’un essai limité. La fiche disponible ne permet pas d’affirmer que la panne d’origine est entièrement résolue ni que son fonctionnement futur ou sa sécurité ont été vérifiés. Le message annonçant une réparation totale était donc trop catégorique. Nous transmettrons au propriétaire le détail des observations et des contrôles non effectués. Toute intervention supplémentaire dépendra de son accord et, si nécessaire, de l’avis d’une personne compétente."
      ],
      "debate": [
        "Defend transparent volunteer repair reporting without minimizing genuine success.",
        "Les ateliers de réparation permettent aux habitants d’apprendre et de prolonger la durée d’utilisation d’objets. Un appareil qui démarre après une intervention peut représenter un résultat encourageant et mérite d’être signalé. Cependant, ce succès ponctuel ne prouve pas qu’un défaut est définitivement éliminé. Certains bénévoles aimeraient présenter rapidement des chiffres de réparations réussies afin de montrer l’utilité du projet. Je recommande une distinction entre essais positifs, réparations vérifiées et dossiers encore incertains. Une information honnête protège les propriétaires et la crédibilité de l’atelier, sans diminuer l’engagement de ses bénévoles."
      ]
    },
    "oral": [
      "Explain the difference between a successful trial and a verified repair.",
      "L’appareil s’est allumé une fois, mais la cause de la panne n’a pas été déterminée et aucun contrôle approfondi n’est documenté. Je recommande de décrire le résultat comme un essai limité, sans promettre une sécurité ou une fiabilité certifiée. Le propriétaire doit recevoir les informations et décider des prochaines démarches autorisées."
    ]
  }
];
export const U19_102=Object.freeze(SOURCE.map((record,i)=>originalB1CriticalProduction(record,102+i)));
