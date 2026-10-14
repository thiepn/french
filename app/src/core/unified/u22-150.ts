import {originalB2DebateProduction,type U21OriginalSourceStory} from './u21-content-helper.ts';
const SOURCE:readonly U21OriginalSourceStory[]=[
  {
    "id": "transfer-150",
    "title": "Night-sky forecast: predicted meteor activity and verified observations",
    "goal": "Distinguish an astronomical prediction from observed counts, compare incompatible observation windows and propose a reproducible public science report.",
    "grammarKeys": [
      "condition",
      "concession"
    ],
    "vocabulary": [
      [
        "une pluie d'étoiles filantes",
        "meteor shower",
        "La pluie d'étoiles filantes est attendue en fin de nuit."
      ],
      [
        "une prévision",
        "forecast",
        "Une prévision exprime une activité probable, pas un résultat garanti."
      ],
      [
        "une observation",
        "observation",
        "Chaque observation doit être datée et située."
      ],
      [
        "un ciel couvert",
        "overcast sky",
        "Le ciel couvert a empêché plusieurs relevés."
      ],
      [
        "un horizon",
        "horizon",
        "L'horizon sud était masqué par des arbres."
      ],
      [
        "une période de comptage",
        "counting interval",
        "La période de comptage dure quinze minutes."
      ],
      [
        "une visibilité",
        "visibility",
        "La visibilité change selon les nuages et l'éclairage."
      ],
      [
        "un télescope",
        "telescope",
        "Un télescope n'est pas nécessaire pour compter les météores visibles."
      ],
      [
        "une estimation",
        "estimate",
        "L'estimation publiée dépend de conditions idéales."
      ],
      [
        "une équipe bénévole",
        "volunteer team",
        "L'équipe bénévole note ses interruptions de mesure."
      ],
      [
        "un relevé",
        "measurement log",
        "Le relevé du jeudi porte sur un seul site."
      ],
      [
        "une incertitude",
        "uncertainty",
        "L'incertitude doit figurer dans le compte rendu public."
      ]
    ],
    "dialogue": [
      [
        "Lina",
        "Le site annonce jusqu'à soixante météores par heure pendant la nuit.",
        "The website forecasts up to sixty meteors per hour during the night."
      ],
      [
        "Hugo",
        "Ce chiffre suppose un ciel sombre, dégagé et une longue observation.",
        "That figure assumes a dark, clear sky and a long observation period."
      ],
      [
        "Maya",
        "Notre équipe n'a compté que neuf météores en trente minutes jeudi.",
        "Our team counted only nine meteors in thirty minutes on Thursday."
      ],
      [
        "Lina",
        "Peut-on donc écrire que la prévision était fausse partout ?",
        "So can we write that the forecast was wrong everywhere?"
      ],
      [
        "Hugo",
        "Non, des nuages ont couvert notre site pendant une partie du relevé.",
        "No, clouds covered our site during part of the observation."
      ],
      [
        "Maya",
        "L'autre groupe dit en avoir vu quinze, mais il a observé quarante-cinq minutes.",
        "The other group says it saw fifteen, but it observed for forty-five minutes."
      ],
      [
        "Lina",
        "Il faudrait aussi indiquer l'heure, le lieu, l'horizon et l'éclairage.",
        "We should also record the time, place, horizon and lighting."
      ],
      [
        "Hugo",
        "Nous pourrions refaire des sessions de quinze minutes, en signalant les interruptions.",
        "We could run fifteen-minute sessions again, noting any interruptions."
      ],
      [
        "Maya",
        "Le bilan distinguera la prévision générale, nos chiffres locaux et ce qui reste inconnu.",
        "The report will distinguish the general forecast, our local figures and what remains unknown."
      ]
    ],
    "readingTitle": "Un ciel promis, deux carnets de nuit",
    "paragraphs": [
      "Une association d'astronomie amateur invite les habitants à observer une pluie d'étoiles filantes. Sur l'affiche, la mention « soixante météores par heure » est présentée comme le nombre que chacun verra. Le modèle consulté par Hugo précise pourtant qu'il s'agit d'un maximum théorique dans des conditions d'observation très favorables, avec un ciel sombre et dégagé. Plusieurs visiteurs imaginent donc une promesse personnalisée là où la source fournit seulement une estimation sous hypothèses. Lina propose de conserver l'enthousiasme du programme sans transformer une limite supérieure en résultat certain pour tous les observateurs.",
      "Le jeudi, Maya et deux bénévoles regardent le ciel depuis un terrain éclairé près du village. Ils notent neuf météores en trente minutes, mais une couverture nuageuse interrompt leur attention à plusieurs reprises. Un autre groupe annonce quinze météores: il a pourtant observé pendant quarante-cinq minutes depuis un site plus sombre et ne précise pas la portion d'horizon visible. Comparer neuf et quinze comme s'il s'agissait de deux taux directement équivalents serait trompeur. Multiplier simplement un compte par deux ne suffit pas non plus à reconstituer une heure idéale lorsque la visibilité change pendant la séance.",
      "Les bénévoles créent alors une fiche commune: heures exactes, durée, lieu, éclairage, horizon, nuages, interruptions et nombre d'observateurs. Les prochaines séances utiliseront des périodes de quinze minutes. Le bilan public distinguera le chiffre prévu par le modèle, les observations réellement effectuées et les incertitudes qui les accompagnent. Si les conditions sont mauvaises, les organisateurs proposeront plutôt une présentation pédagogique en salle; ils n'affirmeront ni que la pluie est absente ni qu'elle sera visible partout. Leur objectif n'est pas d'obtenir artificiellement le plus grand chiffre, mais de permettre à d'autres de comprendre, reproduire et éventuellement corriger leurs conclusions."
    ],
    "evidence": [
      {
        "label": "Public stargazing night invitation",
        "type": "poster",
        "french": "Cette nuit, chacun observera soixante étoiles filantes par heure! Rejoignez-nous pour un spectacle garanti. Le nombre affiché est présenté sans les hypothèses de ciel sombre, d'horizon dégagé et de conditions favorables de la prévision."
      },
      {
        "label": "Forecast qualification and two site logs",
        "type": "data",
        "french": "Maximum théorique estimé sous ciel dégagé et sombre, non une observation garantie. Terrain village: neuf météores en trente minutes avec passages nuageux et éclairage. Deuxième groupe: quinze météores en quarante-cinq minutes depuis un autre site; horizon et interruptions non renseignés."
      }
    ],
    "reading": [
      [
        "What does the number sixty describe?",
        "un maximum théorique conditionnel",
        "un relevé garanti pour chacun",
        "la mesure du jeudi",
        "The forecast specifies a conditional ideal upper estimate, not a count guaranteed for visitors."
      ],
      [
        "Why are the two local counts not directly comparable?",
        "des durées et conditions différentes",
        "le même terrain et la même durée",
        "un seul observateur commun",
        "The teams used different time windows, darkness, interruption logs and unknown horizon coverage."
      ],
      [
        "What interval will the new protocol use?",
        "quinze minutes",
        "deux heures",
        "une seconde",
        "The proposed repeatable observation sheet standardizes counting blocks to fifteen minutes."
      ]
    ],
    "compare": [
      [
        "Which document promises sixty meteors to everyone?",
        "l'invitation",
        "la fiche de relevé",
        "les deux documents",
        "The invitation promotes up to 60 meteors per hour as though each visitor will see that many. The technical forecast depends on a dark, clear sky and sustained observation, so no individual outcome is guaranteed."
      ],
      [
        "Which source identifies unequal observation durations?",
        "les relevés",
        "l'invitation",
        "aucune source",
        "The observation log compares nine meteors in 30 minutes with fifteen in 45 minutes at different times and conditions. Raw totals cannot establish which site performed better; record duration, weather and visibility before comparison."
      ]
    ],
    "listen": [
      [
        "What number does Lina quote?",
        "soixante par heure",
        "neuf par heure",
        "quinze par jour",
        "Lina refers to the advertised maximum of sixty meteors per hour."
      ],
      [
        "Which condition does Hugo mention?",
        "un ciel sombre et dégagé",
        "une salle éclairée",
        "un vent obligatoire",
        "Hugo says the upper estimate assumes a dark, clear sky."
      ],
      [
        "How many meteors did Maya's team count?",
        "neuf",
        "quinze",
        "soixante",
        "Maya reports nine observed events during thirty minutes on Thursday."
      ],
      [
        "Why cannot the count disprove the forecast everywhere?",
        "des nuages locaux",
        "une panne de télévision",
        "une autre langue",
        "Hugo warns that local clouds affected observation and do not prove universal absence."
      ],
      [
        "How long did the other team observe?",
        "quarante-cinq minutes",
        "quinze minutes",
        "trente minutes",
        "Maya explicitly says the second team observed for forty-five minutes."
      ],
      [
        "What future comparison method does Hugo propose?",
        "des sessions de quinze minutes",
        "des nombres sans durée",
        "des annonces garanties",
        "Hugo proposes standardized fifteen-minute sessions with interruption records."
      ]
    ],
    "clozes": [
      [
        "Bien que les bénévoles ___ observé neuf météores, ils restent prudents. (avoir, subjonctif)",
        "aient",
        "Bien que requires the subjunctive; the plural perfect subjunctive is aient observé.",
        "concession with completed event"
      ],
      [
        "Si le ciel reste couvert, nous ___ une activité en salle. (proposer, futur simple)",
        "proposerons",
        "After si plus present in a real future condition, the main clause may use future simple proposerons.",
        "conditional alternative"
      ]
    ],
    "order": [
      "Les observations doivent indiquer leur durée exacte.",
      [
        "indiquer leur durée exacte.",
        "Les observations doivent"
      ],
      "The infinitive indiquer follows the modal doivent, and the subject comes before the finite verb.",
      "reporting comparability"
    ],
    "writing": {
      "listening": [
        "Write a field report attributing each speaker and identifying every known observation limit.",
        "Lina rapporte que l'invitation promet jusqu'à soixante météores par heure, mais Hugo rappelle que la prévision suppose des conditions idéales. Maya précise que son équipe a compté neuf météores en trente minutes jeudi, malgré des passages nuageux. L'autre groupe signale quinze météores sur quarante-cinq minutes, sans décrire entièrement l'horizon. Ces chiffres ne sont donc pas immédiatement comparables. L'équipe propose de nouvelles séances de quinze minutes, avec indication du lieu, de la visibilité et des interruptions, avant de publier des conclusions plus solides."
      ],
      "sources": [
        "Correct the invitation for a first-time stargazer, distinguishing the ideal-condition upper forecast from the local recorded counts and weather limitations. After comparing with the model, independently write a two-sentence update for a cloudy night without promising any meteor count.",
        "L'invitation promet à chaque visiteur soixante météores par heure, alors que la fiche technique présente ce nombre comme un maximum théorique sous ciel sombre et dégagé. Les bénévoles ont réellement relevé neuf météores en trente minutes sur un site partiellement nuageux; un autre groupe en annonce quinze pendant quarante-cinq minutes, dans des conditions différentes et incomplètement décrites. Aucune de ces observations ne prouve que le modèle est juste ou faux partout. Nous publierons les périodes et les limites de mesure avant de proposer un nouveau comptage comparable."
      ],
      "debate": [
        "Defend or reject holding the public night despite uncertain visibility, considering safety, scientific honesty and outreach.",
        "Je maintiendrais l'invitation seulement sous une forme conditionnelle: une observation peut être utile même quand la prévision ne se réalise pas pour chaque visiteur. Certains préféreraient annuler l'événement pour ne pas décevoir le public, et cette inquiétude est compréhensible. Cependant, expliquer comment une estimation diffère d'un relevé est une occasion scientifique. Les organisateurs doivent annoncer les nuages possibles, préparer une activité intérieure et noter des sessions comparables. Si la météo empêche l'observation, aucune visibilité ne sera promise et le bilan présentera honnêtement cette limite."
      ]
    },
    "oral": [
      "Distinguish conditional maximum from observed counts and propose how to make follow-up measurements comparable.",
      "Soixante météores par heure est une prévision pour des conditions favorables, pas une promesse faite à chaque personne. Une équipe a observé neuf météores en trente minutes avec des nuages; une autre en a compté quinze en quarante-cinq minutes, sans préciser tout son horizon. Je ne comparerais pas directement ces nombres. Je proposerais des relevés de quinze minutes avec horaires, éclairage et interruptions, puis un bilan séparant hypothèses et observations."
    ]
  }
];
export const U22_150=Object.freeze(SOURCE.map(s=>originalB2DebateProduction(s,150)));
