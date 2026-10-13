import {originalB1CriticalProduction,type U19OriginalSourceStory} from './u19-content-helper.ts';
const SOURCE:readonly U19OriginalSourceStory[]=[
  {
    "id": "transfer-97",
    "title": "Bus service inquiry: contradictory timestamps and passenger testimony",
    "goal": "Compose a formal transport inquiry that distinguishes scheduled, recorded and personally observed times.",
    "grammarKeys": [
      "past",
      "source"
    ],
    "vocabulary": [
      [
        "un arrêt",
        "stop",
        "L’arrêt se trouve près de la mairie."
      ],
      [
        "un horaire",
        "timetable",
        "L’horaire indique huit heures."
      ],
      [
        "une arrivée",
        "arrival",
        "L’arrivée est discutée."
      ],
      [
        "un retard",
        "delay",
        "Le retard doit être établi."
      ],
      [
        "un journal",
        "log",
        "Le journal affiche un événement."
      ],
      [
        "une application",
        "app",
        "L’application indique une position."
      ],
      [
        "une preuve",
        "evidence",
        "La preuve concerne un moment."
      ],
      [
        "un témoignage",
        "testimony",
        "Le témoignage décrit une attente."
      ],
      [
        "une correspondance",
        "connection",
        "La correspondance a été manquée."
      ],
      [
        "une réclamation",
        "complaint",
        "La réclamation demande une réponse."
      ],
      [
        "une vérification",
        "verification",
        "La vérification relève de l’opérateur."
      ],
      [
        "une date",
        "date",
        "La date permet de situer le trajet."
      ]
    ],
    "dialogue": [
      [
        "Ana",
        "J’ai attendu le bus de huit heures pendant vingt minutes et j’ai manqué ma correspondance.",
        "I waited twenty minutes and missed a connection."
      ],
      [
        "Malik",
        "L’application indique un passage à huit heures trois, mais cela peut représenter la position transmise par un appareil, pas nécessairement l’ouverture des portes.",
        "The app's event may not mean passenger boarding."
      ],
      [
        "Ana",
        "Le tableau d’horaires affiche huit heures exactement; je ne sais pas quelle mesure a servi au journal numérique.",
        "The schedule is a plan and the log method is unclear."
      ],
      [
        "Malik",
        "Le service doit préciser ce qu’il enregistre : un véhicule à proximité, une arrivée effective ou un départ.",
        "The operator should define its event."
      ],
      [
        "Ana",
        "Une autre passagère se souvient d’un bus passant sur la voie opposée, mais n’a pas relevé son numéro.",
        "Another witness saw a bus but not the route number."
      ],
      [
        "Malik",
        "Son témoignage peut aider à chercher, sans prouver que c’était le véhicule attendu.",
        "Witness memory can suggest but not establish identification."
      ],
      [
        "Ana",
        "Je vais écrire une réclamation avec la date, l’arrêt et les heures que j’ai personnellement observées.",
        "I'll supply date, stop and observed times."
      ],
      [
        "Malik",
        "Demandons une explication plutôt que d’affirmer que le conducteur a volontairement ignoré l’arrêt.",
        "Don't invent driver intent."
      ],
      [
        "Ana",
        "Je souhaite une réponse précise sur la correspondance manquée, sans exagérer la portée des preuves.",
        "I'll seek a specific account without exaggeration."
      ]
    ],
    "readingTitle": "Réclamation de transport : trois horloges, trois sortes d'information",
    "paragraphs": [
      "Ana se rend chaque matin au travail en bus et doit prendre une correspondance. Un mardi, elle se présente à l’arrêt peu avant huit heures. Le bus attendu ne se présente pas à l’endroit où elle patiente, et elle décide finalement d’emprunter un autre trajet. Elle estime avoir attendu vingt minutes. Lorsqu’elle ouvre l’application de transport, elle remarque un événement enregistré à huit heures trois. Cette information semble contredire son expérience, mais elle ne sait pas ce que le système appelle exactement un passage.",
      "Malik lui conseille de distinguer trois sources : l’horaire prévu, le journal électronique et le souvenir d’un voyageur. L’horaire affiche un objectif d’exploitation, tandis que le journal peut dépendre d’un point de mesure dont la signification n’est pas précisée. Une autre passagère dit avoir aperçu un bus sur la voie opposée, mais elle n’a pas identifié le numéro de la ligne. Aucun document disponible n’autorise donc à conclure que le conducteur a ignoré volontairement Ana ou que le trajet s’est déroulé normalement.",
      "Ana prépare une réclamation factuelle. Elle indique l’arrêt, la date, le départ prévu et la durée approximative de son attente. Elle explique qu’elle a manqué une correspondance, puis demande à l’opérateur de préciser les données liées au véhicule et le sens de l’événement enregistré. La réponse pourra éclaircir les faits et éventuellement les modalités de suivi. Une bonne réclamation ne doit pas dissimuler la gêne vécue, mais elle gagne à ne pas remplacer les informations manquantes par une accusation qui n’a pas été démontrée."
    ],
    "evidence": [
      {
        "label": "Published route timetable",
        "type": "notice",
        "french": "Départ prévu à l’arrêt Hôtel de Ville : 08 h 00 le mardi. Il s’agit d’un horaire théorique, non d’une attestation de l’arrivée effectivement observée."
      },
      {
        "label": "Automatic vehicle activity export",
        "type": "data",
        "french": "Événement enregistré mardi à 08 h 03, véhicule associé à la ligne. La définition technique de cet événement et la présence effective au quai ne sont pas indiquées."
      }
    ],
    "reading": [
      [
        "What does the timetable establish?",
        "une heure prévue",
        "une arrivée observée",
        "une absence volontaire",
        "A timetable is planned service, not evidence of actual boarding."
      ],
      [
        "Why is the automatic record ambiguous?",
        "son événement n’est pas défini",
        "il n'a pas d'heure",
        "il décrit un passager",
        "A timestamp requires an operational definition."
      ],
      [
        "What is a fair complaint?",
        "un récit daté et une question précise",
        "une accusation certaine",
        "une suppression des horaires",
        "Known experience and uncertain system data should be separated."
      ]
    ],
    "compare": [
      [
        "Which source states 08 h 00?",
        "l’horaire publié",
        "le journal numérique",
        "aucun",
        "The public timetable lists the scheduled departure."
      ],
      [
        "Which source records 08 h 03 without defining arrival?",
        "le journal numérique",
        "l’horaire",
        "les deux certifient l’embarquement",
        "The export does not establish where doors opened."
      ]
    ],
    "listen": [
      [
        "When did Ana expect the bus?",
        "huit heures",
        "neuf heures",
        "sept heures",
        "She references the eight o'clock bus."
      ],
      [
        "How long did she wait?",
        "vingt minutes",
        "trois minutes",
        "une heure",
        "Ana estimates twenty minutes."
      ],
      [
        "Which digital event time appears?",
        "huit heures trois",
        "huit heures vingt",
        "neuf heures",
        "Malik reads 08:03."
      ],
      [
        "What identification did the witness lack?",
        "le numéro de ligne",
        "la couleur du ciel",
        "l’heure de son réveil",
        "The witness didn't note the route."
      ],
      [
        "What intent cannot be established?",
        "un refus volontaire du conducteur",
        "une correspondance manquée",
        "une attente",
        "No evidence proves deliberate driver behavior."
      ],
      [
        "What will Ana request?",
        "la définition de l’événement",
        "une accusation publiée",
        "un billet fictif",
        "She wants the operator's record explained."
      ]
    ],
    "clozes": [
      [
        "Ana ___ vingt minutes. (attendre, passé composé)",
        "a attendu",
        "A attendu reports a completed personal experience.",
        "past narrative"
      ],
      [
        "Selon le journal, un événement ___ enregistré à huit heures trois. (être, passé composé passif)",
        "a été",
        "A été enregistré attributes the record without interpreting it.",
        "attribution"
      ]
    ],
    "order": [
      "Le passage reste à clarifier",
      [
        "reste à clarifier",
        "Le passage"
      ],
      "A log event alone does not prove passenger boarding.",
      "timestamp"
    ],
    "writing": {
      "listening": [
        "Summarize Ana's complaint while accurately distinguishing the records.",
        "Ana a attendu le bus prévu à huit heures et estime avoir patienté vingt minutes sans pouvoir prendre le véhicule. L’application comporte pourtant un événement à huit heures trois. Malik explique que ce chiffre ne permet pas de savoir si les portes se sont réellement ouvertes à son arrêt. Une autre passagère a vu un bus, mais n’a pas identifié sa ligne. Ana souhaite transmettre son expérience et demander la définition du journal au service responsable. Elle ne présentera pas une intention du conducteur comme un fait établi."
      ],
      "sources": [
        "Draft a precise passenger inquiry comparing schedule and system log.",
        "Bonjour, mardi dernier, j’ai attendu à l’arrêt Hôtel de Ville le départ indiqué à huit heures. Je suis restée sur place environ vingt minutes sans voir le bus attendu et j’ai manqué ma correspondance. L’application affiche un événement à huit heures trois, mais le document consulté n’explique pas si cette heure correspond à un passage réel avec embarquement. Pourriez-vous vérifier l’activité du véhicule et préciser le sens de cet enregistrement ? Je souhaite comprendre l’écart entre l’horaire et mon observation, sans présumer de la cause avant votre réponse."
      ],
      "debate": [
        "Defend fair public complaints while acknowledging the limits of passenger recollection.",
        "Les voyageurs ont raison de signaler un problème lorsque le service prévu ne leur permet pas d’effectuer leur trajet. Ana décrit une attente de vingt minutes et une correspondance manquée, ce qui mérite une réponse. Toutefois, un horaire théorique et un événement électronique mal défini ne suffisent pas à déterminer exactement ce qui s’est passé. On pourrait reprocher à Ana de ne pas avoir obtenu une photographie du bus, mais les usagers ne disposent pas toujours des moyens d’un enquêteur. Je recommande une réclamation précise et une vérification par l’opérateur, plutôt qu’une accusation personnelle sans preuve."
      ]
    },
    "oral": [
      "Present the complaint and two evidence limitations.",
      "Ana attendait le bus prévu à huit heures et a manqué sa correspondance. L’application indique un événement à huit heures trois, mais sa signification n’est pas expliquée. Une autre personne a vu un bus sans relever sa ligne. Je recommande un courrier daté demandant une vérification, sans supposer l’intention du conducteur. Les sources permettent de poser une question précise, pas de décider déjà qui est responsable."
    ]
  }
];
export const U19_97=Object.freeze(SOURCE.map((record,i)=>originalB1CriticalProduction(record,97+i)));
