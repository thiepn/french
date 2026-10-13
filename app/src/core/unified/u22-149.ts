import {originalB2DebateProduction,type U21OriginalSourceStory} from './u21-content-helper.ts';
const SOURCE:readonly U21OriginalSourceStory[]=[
  {
    "id": "transfer-149",
    "title": "Participatory budget survey: voluntary ballots versus representative support",
    "goal": "Examine selection bias, conditional project funding and how numerical participation differs from a population mandate.",
    "grammarKeys": [
      "source",
      "condition"
    ],
    "vocabulary": [
      [
        "un budget participatif",
        "participatory budget",
        "Le budget participatif dispose d'une enveloppe limitée."
      ],
      [
        "un bulletin",
        "ballot",
        "Chaque bulletin accepté concerne une proposition."
      ],
      [
        "un échantillon",
        "sample",
        "L'échantillon en ligne ne représente pas tous les ménages."
      ],
      [
        "un taux de participation",
        "participation rate",
        "Le taux de participation exige un dénominateur défini."
      ],
      [
        "un ménage",
        "household",
        "Un ménage peut comprendre plusieurs habitants."
      ],
      [
        "une proposition",
        "proposal",
        "La proposition du jardin reste soumise à vérification."
      ],
      [
        "un dénominateur",
        "denominator",
        "Le dénominateur indiqué n'est pas la population totale."
      ],
      [
        "un biais de sélection",
        "selection bias",
        "Le biais de sélection privilégie les personnes connectées."
      ],
      [
        "un scrutin",
        "vote",
        "Le scrutin consultatif ne remplace pas une décision budgétaire."
      ],
      [
        "une enveloppe",
        "funding allocation",
        "L'enveloppe votée ne couvre pas les coûts imprévus."
      ],
      [
        "une permanence",
        "walk-in session",
        "Une permanence permet aux personnes sans internet de s'informer."
      ],
      [
        "une délibération",
        "deliberation",
        "La délibération du conseil aura lieu après le contrôle des coûts."
      ]
    ],
    "dialogue": [
      [
        "Samira",
        "Le panneau annonce que quatre habitants sur cinq veulent le jardin partagé.",
        "Samira quotes a claim about overwhelming support."
      ],
      [
        "Louis",
        "Le tableau indique seulement quatre-vingts votes favorables sur cent bulletins reçus.",
        "Louis distinguishes the actual respondent denominator."
      ],
      [
        "Aïcha",
        "Ces cent bulletins ne proviennent pas d'un échantillon tiré au hasard.",
        "Aïcha identifies the non-random participation mechanism."
      ],
      [
        "Samira",
        "Des personnes sans internet n'ont peut-être même pas vu l'appel à voter.",
        "Samira notes missing offline access."
      ],
      [
        "Louis",
        "Le portail autorisait une réponse par compte, pas nécessairement par ménage.",
        "Louis distinguishes accounts from households."
      ],
      [
        "Aïcha",
        "La proposition a-t-elle déjà obtenu les vingt mille euros prévus?",
        "Aïcha asks whether the earmarked budget is final."
      ],
      [
        "Samira",
        "Non, le conseil doit encore vérifier le coût de l'entretien et la faisabilité.",
        "Samira says costs and feasibility await council review."
      ],
      [
        "Louis",
        "Organisons une permanence et publions les critères avant de relancer la consultation.",
        "Louis proposes a more inclusive consultation."
      ],
      [
        "Aïcha",
        "Nous pourrons annoncer le soutien des répondants, pas celui de tous les habitants.",
        "Aïcha formulates an accurate and qualified conclusion."
      ]
    ],
    "readingTitle": "Quatre-vingts voix, mais de quelle population?",
    "paragraphs": [
      "Dans une commune fictive, une association propose de transformer une cour inutilisée en jardin partagé. Sur son affiche, elle affirme que « quatre habitants sur cinq » approuvent le projet. Le chiffre frappe les élus, mais Samira examine la plateforme de consultation et découvre que quatre-vingts réponses favorables ont été enregistrées parmi cent bulletins déposés volontairement. Aucun tirage au sort n'a été effectué parmi les ménages de la commune, dont le nombre exact n'apparaît pas dans la présentation publique. Le ratio de quatre-vingts pour cent décrit donc seulement les réponses collectées, et non l'opinion de toute la population.",
      "La difficulté n'est pas seulement mathématique. Pour participer, il fallait connaître l'existence du portail, disposer d'un accès numérique et créer un compte. La plateforme limitait les bulletins par compte, mais ne vérifiait pas qu'un compte représentait une personne ou un ménage distinct. Aïcha remarque que les habitants plus âgés et ceux qui n'utilisent pas internet risquent d'être moins présents parmi les répondants. Une permanence à la médiathèque pourrait recueillir d'autres points de vue, sans effacer le résultat déjà observé. Il faudra aussi distinguer les avis consultatifs d'un scrutin légal: le premier éclaire le débat, il ne confère pas à lui seul un mandat universel.",
      "Le budget annoncé pose une autre question. Une enveloppe indicative de vingt mille euros figure dans le dossier, mais le conseil municipal n'a pas encore approuvé les dépenses d'entretien et l'étude de faisabilité. Louis propose de réécrire l'affiche en indiquant exactement le nombre de bulletins reçus, le mode de recrutement et les décisions encore attendues. L'équipe présentera aussi les préoccupations opposées, notamment l'accès à la cour et les coûts futurs. Si la consultation élargie confirme un intérêt durable et si le conseil valide les dépenses, le jardin pourra être retenu. En attendant, une majorité parmi des volontaires n'autorise pas à parler au nom de tous."
    ],
    "evidence": [
      {
        "label": "Community association garden campaign poster",
        "type": "poster",
        "french": "Quatre habitants sur cinq approuvent notre jardin! La majorité de la commune s'est prononcée. Les vingt mille euros sont disponibles: les travaux commenceront bientôt. L'affiche ne précise ni qui pouvait voter ni quelles décisions restent conditionnelles."
      },
      {
        "label": "Public portal method note and provisional council agenda",
        "type": "minutes",
        "french": "Cent bulletins volontaires déposés en ligne, dont quatre-vingts favorables. Aucun tirage représentatif, accès numérique et création de compte requis; l'unicité des ménages n'a pas été contrôlée. Enveloppe de 20 000 € indicative; coût d'entretien et faisabilité inscrits à une délibération ultérieure."
      }
    ],
    "reading": [
      [
        "How many favorable ballots were actually recorded?",
        "quatre-vingts",
        "quatre cents",
        "huit mille",
        "There were eighty favorable responses among one hundred voluntary submissions, not a population-wide poll."
      ],
      [
        "Why could the collected responses be unrepresentative?",
        "un accès numérique volontaire",
        "un recensement obligatoire",
        "un tirage au sort strict",
        "Voluntary online recruitment excludes people who cannot or do not choose to participate."
      ],
      [
        "What budget decision remains outstanding?",
        "l'entretien et la faisabilité",
        "l'achat déjà signé",
        "le remboursement des billets",
        "The provisional envelope does not settle future upkeep and feasibility costs."
      ]
    ],
    "compare": [
      [
        "Which document claims the whole commune approved?",
        "l'affiche de l'association",
        "la note méthodologique",
        "l'ordre du jour du conseil",
        "The campaign poster improperly extends the voluntary sample ratio to all residents."
      ],
      [
        "Which source states that the respondents were not randomly chosen?",
        "la note du portail",
        "l'affiche",
        "aucune source",
        "The method note identifies the non-random online invitation and limits of account uniqueness."
      ]
    ],
    "listen": [
      [
        "What fraction does the poster announce?",
        "quatre sur cinq",
        "un sur cinq",
        "un sur dix",
        "Samira quotes four out of five, but this is not a verified proportion of all inhabitants."
      ],
      [
        "How many favorable ballots did Louis find?",
        "quatre-vingts",
        "cinquante",
        "cent vingt",
        "Louis finds eighty favorable ballots out of one hundred received."
      ],
      [
        "Was the sample randomly drawn?",
        "non",
        "oui",
        "la méthode reste inconnue",
        "Aïcha explicitly notes that the one hundred submissions were not randomly sampled."
      ],
      [
        "What limits access to the consultation?",
        "l'absence d'internet",
        "le prix du billet",
        "la langue du jardin",
        "Samira identifies people without internet who may not have heard of the online invitation."
      ],
      [
        "Has the council already confirmed the money?",
        "non",
        "oui",
        "le paiement est achevé",
        "The council has yet to assess maintenance, feasibility and the indicative allocation."
      ],
      [
        "What conclusion does Aïcha accept?",
        "le soutien des répondants",
        "le soutien de toute la commune",
        "un mandat légal universel",
        "Aïcha confines the observed support to actual respondents and refuses a population-wide claim."
      ]
    ],
    "clozes": [
      [
        "Selon la note, les habitants ___ répondu volontairement. (avoir, présent)",
        "ont",
        "The plural subject les habitants takes ont in passé composé: ont répondu.",
        "reported survey method"
      ],
      [
        "Si le conseil valide les coûts, le projet ___ possible. (devenir, futur simple)",
        "deviendra",
        "A real future si clause uses present; the main clause may take the future simple deviendra.",
        "conditional future"
      ]
    ],
    "order": [
      "Le sondage ne représente pas tous les ménages.",
      [
        "pas tous les ménages.",
        "Le sondage ne représente"
      ],
      "The two-word discontinuous negation ne ... pas surrounds the finite verb.",
      "representativeness and negation"
    ],
    "writing": {
      "listening": [
        "Summarize the three speakers' concerns, giving the numerical denominator, access limitations and pending decision.",
        "Samira rapporte que l'affiche mentionne quatre habitants sur cinq, tandis que Louis explique que la plateforme compte seulement quatre-vingts bulletins favorables sur cent réponses volontaires. Aïcha précise qu'aucun échantillon représentatif n'a été constitué. L'obligation d'utiliser internet et l'absence de vérification par ménage peuvent modifier le profil des répondants. Le financement reste lui aussi conditionnel, puisque le conseil doit examiner les coûts. Une permanence ouverte et une communication plus précise permettraient de poursuivre le débat sans nier les réponses déjà recueillies."
      ],
      "sources": [
        "Write an accurate public correction contrasting the association's poster with the method note.",
        "L'affiche de l'association indique que quatre habitants sur cinq approuvent le jardin, mais la note méthodologique confirme seulement quatre-vingts réponses favorables sur cent bulletins en ligne. Les personnes ont participé volontairement; il ne s'agit ni d'un sondage aléatoire ni d'une preuve de soutien majoritaire dans toute la commune. Par ailleurs, les vingt mille euros figurent comme enveloppe indicative, sans décision définitive sur l'entretien ou la faisabilité. Nous publierons ces limites et accueillerons d'autres avis avant la délibération."
      ],
      "debate": [
        "Defend a fair consultation method and respond to the argument that the existing poll is already enough.",
        "Le résultat de quatre-vingts voix favorables mérite d'être pris au sérieux, car il montre un intérêt réel parmi les participants. Certains estiment qu'une nouvelle consultation serait inutile et ralentirait le jardin. Pourtant, on ne sait pas quelle part des ménages a été entendue; l'accès exclusivement numérique peut aussi exclure des personnes. Je proposerais une permanence, une publication claire des coûts et une consultation complémentaire. Si les données deviennent plus représentatives et que le conseil valide le financement, le projet pourra avancer avec une légitimité mieux établie."
      ]
    },
    "oral": [
      "Explain the difference between 80% of ballots and 80% of residents; recommend a conditional decision.",
      "Quatre-vingts bulletins favorables parmi cent réponses ne signifient pas que quatre habitants sur cinq soutiennent le jardin. La consultation était volontaire et numérique, sans sélection aléatoire des ménages. Je préserverais cette information, mais je demanderais d'élargir l'accès et de publier la méthode. Le conseil devra aussi vérifier l'entretien et le budget avant de décider. Le résultat actuel est utile pour orienter le débat, pas pour certifier une majorité communale."
    ]
  }
];
export const U22_149=Object.freeze(SOURCE.map(s=>originalB2DebateProduction(s,149)));
