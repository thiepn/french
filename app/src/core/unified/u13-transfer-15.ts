import {authorTransferScenario,type TransferAuthoredSpec} from './u13-transfer-model.ts';
type Compact=Omit<TransferAuthoredSpec,'tasks'> & {clozes:readonly (readonly [string,string,string,string])[];order:readonly [string,readonly string[],string,string]};
const CONTENT:readonly Compact[]=[
  {
    "id": "transfer-15",
    "title": "Integrated B1 capstone: community meeting facts, preferences and decisions",
    "level": "B1 integrated",
    "goal": "Reconcile conflicting event notices and distinct participant preferences in a reasoned recommendation.",
    "grammarKeys": [
      "relative",
      "concession"
    ],
    "vocabulary": [
      [
        "une synthèse",
        "synthesis",
        "Je rédige une synthèse."
      ],
      [
        "un courriel",
        "email",
        "Le courriel donne seize heures."
      ],
      [
        "une affiche",
        "poster",
        "L’affiche annonce une autre heure."
      ],
      [
        "un programme",
        "program",
        "Le programme reste à confirmer."
      ],
      [
        "un horaire",
        "time",
        "L’horaire exact manque."
      ],
      [
        "une préférence",
        "preference",
        "Les préférences diffèrent."
      ],
      [
        "un accord",
        "agreement",
        "Le format n’a pas d’accord."
      ],
      [
        "une consultation",
        "consultation",
        "Une consultation est prévue."
      ],
      [
        "le matériel",
        "equipment",
        "Le matériel reste à vérifier."
      ],
      [
        "une décision",
        "decision",
        "Aucune décision finale n’existe."
      ],
      [
        "une recommandation",
        "recommendation",
        "Ma recommandation est conditionnelle."
      ],
      [
        "une preuve",
        "evidence",
        "Une preuve officielle serait utile."
      ]
    ],
    "dialogue": [
      [
        "Maya",
        "Le courriel du secrétariat annonce vendredi à seize heures, mais une affiche récente et non signée indique dix-sept heures pour la même rencontre.",
        "The office email gives Friday at four, while a newer unsigned poster says five."
      ],
      [
        "Samir",
        "Nous devons demander quel document est valable; une affiche plus récente n’est pas automatiquement une décision officielle.",
        "We must find out which document applies; a newer poster isn't necessarily official."
      ],
      [
        "Maya",
        "Certains bénévoles aimeraient participer à distance, tandis que d’autres souhaitent se rencontrer en personne pour échanger directement.",
        "Some volunteers want remote participation, while others prefer meeting in person."
      ],
      [
        "Samir",
        "Nous avons accepté de consulter les participants et de vérifier les équipements, mais aucun format définitif n’a encore été choisi.",
        "We agreed to consult the group and check equipment, but no final format was chosen."
      ],
      [
        "Maya",
        "Je présenterai les faits, les préférences et les inconnues dans une synthèse, puis une recommandation sous réserve de confirmation.",
        "I'll summarize facts, preferences and unknowns before a conditional recommendation."
      ]
    ],
    "reading": {
      "title": "Deux horaires, deux besoins et une décision ouverte",
      "paragraphs": [
        "Un centre de quartier organise une réunion destinée à ses bénévoles. Le secrétariat envoie un courriel qui indique vendredi à seize heures. Quelques jours plus tard, une affiche apparaît dans l'entrée et annonce dix-sept heures pour le même événement. Elle ne porte aucune signature et ne précise pas si elle remplace le courriel. Plusieurs participants commencent déjà à organiser leur trajet selon l'une de ces deux heures. Maya décide de conserver les documents et de demander une confirmation officielle.",
        "Le groupe discute également du format de la rencontre. Certains bénévoles préfèrent se retrouver dans la même salle, car les échanges directs sont importants pour eux. D'autres souhaiteraient participer à distance pour éviter un trajet compliqué. Un compte rendu mentionne que les responsables doivent consulter les personnes concernées et vérifier le matériel de visioconférence. Le document ne rapporte cependant ni vote sur le format ni décision définitive sur l'heure.",
        "Dans sa synthèse, Maya distingue les éléments confirmés des opinions et des tâches à accomplir. Les deux annonces concernent vendredi, mais elles divergent sur l'heure. Les bénévoles ont des préférences différentes, tandis que les ressources techniques restent inconnues. Elle recommande de demander une réponse au secrétariat, de consulter le groupe et de contrôler l'équipement avant de communiquer une organisation définitive. Cette approche permet de progresser sans confondre proposition et décision."
      ],
      "questions": [
        [
          "Which detail is shared by the two notices?",
          "vendredi",
          [
            "vendredi",
            "seize heures",
            "dix-sept heures"
          ],
          "Both sources agree on Friday but disagree on the clock time."
        ],
        [
          "What was actually approved in the meeting?",
          "consulter et vérifier le matériel",
          [
            "choisir le format mixte",
            "consulter et vérifier le matériel",
            "annoncer dix-sept heures"
          ],
          "The group agreed on information gathering, not on a final meeting arrangement."
        ],
        [
          "What must precede a definitive announcement?",
          "confirmer l’heure et le format",
          [
            "confirmer l’heure et le format",
            "choisir la plus belle affiche",
            "ignorer les bénévoles"
          ],
          "Both the time and participation arrangement remain unresolved."
        ]
      ]
    },
    "evidence": [
      {
        "label": "Secretariat email",
        "type": "email",
        "french": "Rencontre des bénévoles vendredi à 16 h au centre. Une modification officielle des horaires ou du format sera annoncée par le secrétariat aux personnes concernées."
      },
      {
        "label": "Unsigned entrance poster",
        "type": "poster",
        "french": "Rencontre des bénévoles vendredi à 17 h. Un dispositif de participation à distance pourrait être proposé. Cette affiche ne précise ni auteur ni décision définitive."
      }
    ],
    "crossQuestions": [
      [
        "What day is supported by both?",
        "vendredi",
        [
          "vendredi",
          "jeudi",
          "samedi"
        ],
        "Both documents refer to Friday despite differing start times."
      ],
      [
        "What is still unsupported as final?",
        "le début exact et le format",
        [
          "le début exact et le format",
          "le lieu du centre",
          "le nom de l’événement"
        ],
        "The poster conflicts with the email and treats remote participation as a possibility."
      ]
    ],
    "listening": [
      [
        "What two start times are mentioned?",
        "seize et dix-sept heures",
        [
          "seize et dix-sept heures",
          "quatorze et quinze heures",
          "neuf et dix heures"
        ],
        "Maya explicitly contrasts sixteen and seventeen hours."
      ],
      [
        "Which two procedural actions have been agreed?",
        "consulter et vérifier le matériel",
        [
          "consulter et vérifier le matériel",
          "adopter un format mixte",
          "annuler vendredi"
        ],
        "Samir identifies consultation and equipment checking as agreed steps."
      ]
    ],
    "writing": [
      "Write a ten-sentence evidence-grounded memo about the event, comparing documents and dialogue.",
      [
        "Attribute each published hour to its actual source.",
        "Distinguish participant preferences from agreed procedural steps.",
        "Use a relative clause, concession and conditional recommendation."
      ],
      "Le centre prépare une rencontre pour les bénévoles vendredi. Le courriel du secrétariat annonce seize heures, tandis qu’une affiche sans signature mentionne dix-sept heures. Les deux documents ne permettent pas de confirmer l’heure exacte. Certains participants préfèrent une rencontre en personne, alors que d’autres souhaitent participer à distance. Ce qui reste incertain concerne le matériel et les préférences de toutes les personnes intéressées. Bien que le format mixte soit une idée utile, il n’a pas été adopté. Le groupe a accepté de consulter les bénévoles et de vérifier les équipements. Je recommande donc de demander une confirmation d’horaire au secrétariat. Si les ressources et les réponses sont disponibles, les responsables pourront décider puis envoyer un programme fiable."
    ],
    "oral": {
      "prompt": "Give an impartial 90-second briefing on the conflicting event announcements and the unresolved participation format.",
      "plan": [
        "Compare the weekday and disputed times from both sources.",
        "Explain the contrasting participant needs and actual agreed steps.",
        "Recommend how to confirm the remaining decisions before announcing them."
      ],
      "model": "Deux annonces concernent la réunion de vendredi. Le courriel indique seize heures et une affiche non signée dix-sept heures. Aucune information ne confirme quel horaire a été retenu. Certains bénévoles souhaitent venir sur place, tandis que d’autres aimeraient participer à distance. Le groupe a seulement convenu de consulter les membres et de vérifier le matériel. Je recommande de confirmer l’heure au secrétariat puis de décider du format après les vérifications. Il serait prématuré de présenter le programme comme définitif."
    },
    "clozes": [
      [
        "Ce ___ manque, c’est une confirmation officielle.",
        "qui",
        "Ce qui is the subject of the verb manque.",
        "relative"
      ],
      [
        "Les documents ___ nous disposons donnent deux heures.",
        "dont",
        "Disposer de takes the relative pronoun dont.",
        "relative de"
      ]
    ],
    "order": [
      "Le format reste à confirmer",
      [
        "reste à confirmer",
        "Le format"
      ],
      "The participants have not approved a final arrangement.",
      "decision status"
    ]
  }
];
export const TRANSFER_15=Object.freeze(CONTENT.map(spec=>{
 const tasks:TransferAuthoredSpec['tasks']=[
  ...spec.reading.questions.map(([q,a,o,why])=>['reading',q,a,why,[...o],'text evidence'] as TransferAuthoredSpec['tasks'][number]),
  ...spec.crossQuestions.map(([q,a,o,why])=>['choice',q,a,why,[...o],'sources'] as TransferAuthoredSpec['tasks'][number]),
  ...spec.clozes.map(([q,a,why,focus])=>['fill',q,a,why,[],focus] as TransferAuthoredSpec['tasks'][number]),
  ['order','Arrange the words into the correct statement.',spec.order[0],spec.order[2],[...spec.order[1]],spec.order[3]],
  ...spec.listening.map(([q,a,o,why])=>['choice',q,a,why,[...o],'dialogue recall'] as TransferAuthoredSpec['tasks'][number])
 ];
 const {clozes,order,...authored}=spec;
 return authorTransferScenario({...authored,tasks},15);
}));
