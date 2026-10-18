import {authorTransferScenario,type TransferAuthoredSpec} from './u13-transfer-model.ts';
type Compact=Omit<TransferAuthoredSpec,'tasks'> & {clozes:readonly (readonly [string,string,string,string])[];order:readonly [string,readonly string[],string,string]};
const CONTENT:readonly Compact[]=[
  {
    "id": "transfer-14",
    "title": "Neighborhood notice: verify a circulating closure rumor",
    "level": "B1 integrated",
    "goal": "Compare an anonymous alert and public information before sharing claims.",
    "grammarKeys": [
      "source",
      "report"
    ],
    "vocabulary": [
      [
        "une rumeur",
        "rumor",
        "Une rumeur circule."
      ],
      [
        "une source",
        "source",
        "La source est inconnue."
      ],
      [
        "une capture d’écran",
        "screenshot",
        "La capture manque de date."
      ],
      [
        "un avis",
        "notice",
        "L’avis est provisoire."
      ],
      [
        "une fermeture",
        "closure",
        "Une fermeture est évoquée."
      ],
      [
        "un horaire",
        "hours",
        "Les horaires restent affichés."
      ],
      [
        "vérifier",
        "verify",
        "Je vais vérifier la source."
      ],
      [
        "partager",
        "share",
        "Je ne partage pas sans preuve."
      ],
      [
        "une confirmation",
        "confirmation",
        "Une confirmation reste nécessaire."
      ],
      [
        "l’accueil",
        "reception",
        "Contactons l’accueil."
      ],
      [
        "une précision",
        "clarification",
        "Demandons une précision."
      ],
      [
        "un responsable",
        "official",
        "Le responsable pourra répondre."
      ]
    ],
    "dialogue": [
      [
        "Sarah",
        "Une capture d’écran annonce que notre bibliothèque sera fermée demain, mais je ne peux identifier ni la personne qui l’a publiée ni sa date.",
        "A screenshot announces tomorrow's closure, but I cannot identify its publisher or date."
      ],
      [
        "Khalil",
        "La page officielle montre toujours les horaires habituels; cependant, cela ne prouve pas qu’un changement récent est impossible.",
        "The official site still shows regular hours but may not reflect a recent change."
      ],
      [
        "Sarah",
        "Plusieurs voisins ont partagé la capture, mais cette répétition ne suffit pas à établir qu’elle correspond à une annonce officielle.",
        "Many neighbors forwarded it, but repetition is not official confirmation."
      ],
      [
        "Khalil",
        "Demandons à l’accueil si la bibliothèque ouvrira demain et quels services seraient touchés par une fermeture éventuelle.",
        "Let's ask reception whether the library opens and which services might be affected."
      ],
      [
        "Sarah",
        "Je vais dire que l’information reste non confirmée et transmettre seulement la réponse vérifiée lorsque nous l’aurons obtenue.",
        "I will label it unconfirmed and share only the verified reply."
      ]
    ],
    "reading": {
      "title": "Un message partagé et une page qui n’a pas changé",
      "paragraphs": [
        "Dans un groupe de voisins, un message annonce une fermeture exceptionnelle de la bibliothèque pour le lendemain. La capture d'écran ne montre ni auteur, ni date de publication, ni lien vers une annonce officielle. Plusieurs personnes la partagent aussitôt. Certains commencent déjà à annuler leur visite, comme si la fermeture était certaine. Sarah remarque que la popularité du message n'apporte aucune preuve de sa validité.",
        "Elle consulte le site public de la bibliothèque. Les horaires habituels y figurent encore, mais aucune date de dernière mise à jour n'est visible. Khalil lui explique qu'une modification récente pourrait ne pas encore apparaître sur la page. Ils refusent donc de traiter la rumeur comme vraie, mais ne prétendent pas non plus qu'elle est définitivement fausse. Ils contactent l'accueil pour demander si une fermeture est prévue et à partir de quelle heure.",
        "En attendant, Sarah prépare un message très court pour les voisins. Elle distingue la capture anonyme, la page officielle et la réponse qui reste à obtenir. Elle précise que l'information n'est pas confirmée. Lorsque la bibliothèque répondra, elle corrigera le message collectif avec les détails vérifiés. Cette démarche évite de faire circuler une certitude inventée tout en permettant aux voisins de suivre la vérification."
      ],
      "questions": [
        [
          "What is missing from the screenshot?",
          "un auteur et une date",
          [
            "un auteur et une date",
            "une traduction",
            "une image"
          ],
          "The forwarded message has no verifiable publisher or publication date."
        ],
        [
          "Does the webpage prove that no change occurred?",
          "non",
          [
            "oui",
            "non",
            "seulement si elle est récente"
          ],
          "An unchanged page can be stale and cannot categorically disprove a recent exception."
        ],
        [
          "What is the correct provisional status?",
          "non confirmé",
          [
            "définitivement fermé",
            "non confirmé",
            "définitivement faux"
          ],
          "Neither source verifies the claimed closure for tomorrow."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Forwarded anonymous screenshot",
        "type": "chat",
        "french": "ATTENTION : la bibliothèque sera fermée demain. Transmettez cette information autour de vous. Aucune signature, date de publication ou adresse de source officielle n’apparaît sur l’image."
      },
      {
        "label": "Public library webpage",
        "type": "notice",
        "french": "Horaires habituels : de 9 h à 18 h du lundi au vendredi. Une modification exceptionnelle peut faire l’objet d’une annonce distincte. Pour confirmer demain, contacter l’accueil."
      }
    ],
    "crossQuestions": [
      [
        "Which document has no identifiable publisher?",
        "la capture",
        [
          "la capture",
          "la page publique",
          "aucun"
        ],
        "The forwarded screenshot provides no date or source author."
      ],
      [
        "Can the two excerpts settle tomorrow's opening status?",
        "non",
        [
          "oui",
          "non",
          "uniquement si le soleil brille"
        ],
        "The anonymous alert and possibly old webpage are insufficient for definitive confirmation."
      ]
    ],
    "listening": [
      [
        "Which two details are absent from the screenshot?",
        "la date et l’auteur",
        [
          "la date et l’auteur",
          "le nom de la bibliothèque et la langue",
          "le nom de Khalil"
        ],
        "Sarah says neither author nor publication date is identifiable."
      ],
      [
        "Whom will Khalil and Sarah contact?",
        "l’accueil",
        [
          "l’accueil",
          "le restaurant",
          "la gare"
        ],
        "They plan to verify directly with the library reception."
      ]
    ],
    "writing": [
      "Write a cautious message to the neighborhood group about the closure claim.",
      [
        "Identify the two sources and their limitations.",
        "Distinguish unverified from disproved.",
        "Describe who will check and when an update will follow."
      ],
      "Bonjour, un message circule actuellement à propos d’une possible fermeture de notre bibliothèque demain. La capture d’écran ne donne ni auteur ni date vérifiable. La page publique présente encore les horaires habituels, mais nous ne savons pas si elle a été actualisée. Nous avons donc contacté l’accueil afin de demander une confirmation précise. Pour le moment, la fermeture doit être considérée comme non confirmée, ce qui ne signifie pas qu’elle est forcément fausse. Nous transmettrons uniquement la réponse officielle dès qu’elle sera disponible."
    ],
    "oral": {
      "prompt": "Explain the rumor to neighbors without making unsupported assertions.",
      "plan": [
        "Identify the anonymous source and missing details.",
        "Explain why the public webpage may not be decisive.",
        "State the direct verification and responsible next update."
      ],
      "model": "Une capture d’écran affirme que la bibliothèque sera fermée demain, mais elle n’indique ni auteur ni date. Le site public affiche encore les horaires habituels; toutefois, nous ne savons pas si la page a été mise à jour. Nous ne pouvons donc pas traiter la fermeture comme confirmée ou réfutée. Nous allons demander une réponse à l’accueil et partager les informations vérifiées lorsque nous les recevrons."
    },
    "clozes": [
      [
        "Il est possible que la bibliothèque ___ fermée. (être)",
        "soit",
        "Il est possible que normally introduces subjunctive soit.",
        "subjunctive"
      ],
      [
        "Avant de partager, il faut ___ la source.",
        "vérifier",
        "Vérifier prevents publishing uncertain content as established.",
        "responsibility"
      ]
    ],
    "order": [
      "La fermeture reste à vérifier",
      [
        "reste à vérifier",
        "La fermeture"
      ],
      "The source evidence does not yet establish a closure.",
      "uncertainty"
    ]
  }
];
export const TRANSFER_14=Object.freeze(CONTENT.map(spec=>{
 const tasks:TransferAuthoredSpec['tasks']=[
  ...spec.reading.questions.map(([q,a,o,why])=>['reading',q,a,why,[...o],'text evidence'] as TransferAuthoredSpec['tasks'][number]),
  ...spec.crossQuestions.map(([q,a,o,why])=>['choice',q,a,why,[...o],'sources'] as TransferAuthoredSpec['tasks'][number]),
  ...spec.clozes.map(([q,a,why,focus])=>['fill',q,a,why,[],focus] as TransferAuthoredSpec['tasks'][number]),
  ['order','Arrange the words into the correct statement.',spec.order[0],spec.order[2],[...spec.order[1]],spec.order[3]],
  ...spec.listening.map(([q,a,o,why])=>['choice',q,a,why,[...o],'dialogue recall'] as TransferAuthoredSpec['tasks'][number])
 ];
 const {clozes,order,...authored}=spec;
 return authorTransferScenario({...authored,tasks},14);
}));
