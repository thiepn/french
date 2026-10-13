import type {A1Unit} from './u6-a1-model.ts';
import type {A1ListeningQuestion} from './u7-listening.ts';
import {listeningQuestionsForOriginalCourse,validateB1Listening} from './u10-listening.ts';
import {B1_DEPTH_UNITS} from './u11-course.ts';
type Q=readonly [string,string,readonly string[],string];
const PAIRS:Readonly<Record<string,readonly [Q,Q]>>={
  "b1-15": [
    [
      "Which room is exempt from the announced closure?",
      "la salle B",
      [
        "la salle A",
        "la salle B",
        "la salle C"
      ],
      "Camille identifies room B as accessible for already registered groups."
    ],
    [
      "Which point does Camille want clarified in writing?",
      "l’accès sans réservation",
      [
        "l’accès sans réservation",
        "la couleur des salles",
        "le prix du bus"
      ],
      "She cannot find instructions governing people without reservations."
    ]
  ],
  "b1-16": [
    [
      "What did Nora receive on Tuesday?",
      "un accusé de réception automatique",
      [
        "un accord définitif",
        "un accusé de réception automatique",
        "une facture"
      ],
      "The office sent a receipt acknowledgment, not approval of a change."
    ],
    [
      "Under what condition will Nora send a reminder on Thursday?",
      "si aucune réponse n’arrive",
      [
        "si aucune réponse n’arrive",
        "si elle paie de nouveau",
        "si le cours est annulé"
      ],
      "Nora will follow up only if no actual response arrives before Thursday."
    ]
  ],
  "b1-17": [
    [
      "How many contrasting user experiences are raised?",
      "au moins deux",
      [
        "au moins deux",
        "aucune",
        "cent"
      ],
      "Lucie describes a slow reply and a separate user reporting a rapid one."
    ],
    [
      "Which improvement does Thomas suggest?",
      "afficher un délai indicatif",
      [
        "fermer le forum",
        "afficher un délai indicatif",
        "annuler les réservations"
      ],
      "A published response estimate could help users know when a reminder is appropriate."
    ]
  ],
  "b1-18": [
    [
      "What work did the librarian do before retraining?",
      "elle travaillait dans une entreprise",
      [
        "elle travaillait dans une entreprise",
        "elle conduisait un train",
        "elle dirigeait un musée"
      ],
      "Maya reports the librarian's former job at a company before retraining."
    ],
    [
      "Which earlier experience supported the change?",
      "le bénévolat",
      [
        "un concours sportif",
        "le bénévolat",
        "un héritage"
      ],
      "Adam says she had already volunteered before the new training."
    ]
  ],
  "b1-19": [
    [
      "Does the official say every inhabitant supports extended hours?",
      "non, certains groupes seulement",
      [
        "oui, sans exception",
        "non, certains groupes seulement",
        "personne n’est intéressé"
      ],
      "She explicitly limits favorable feedback to some groups."
    ],
    [
      "What condition might allow a start next month?",
      "du personnel supplémentaire",
      [
        "une salle plus petite",
        "du personnel supplémentaire",
        "un nouveau titre"
      ],
      "The possible start depends on hiring and available resources."
    ]
  ],
  "b1-20": [
    [
      "What happens to the documents first?",
      "ils sont vérifiés",
      [
        "ils sont détruits",
        "ils sont vérifiés",
        "ils sont remboursés"
      ],
      "Élodie says documents are checked before an agent reviews missing information."
    ],
    [
      "What response period is guaranteed in the article?",
      "aucune durée fixe",
      [
        "vingt-quatre heures",
        "une semaine",
        "aucune durée fixe"
      ],
      "Élodie intends to say the consulted notice provides no guaranteed fixed timeframe."
    ]
  ],
  "b1-21": [
    [
      "What problem does Sacha notice about the keyboard?",
      "les touches sont bruyantes",
      [
        "le poids est élevé",
        "les touches sont bruyantes",
        "il n’a pas de touches"
      ],
      "Sacha finds the keys noisy despite liking its portability."
    ],
    [
      "Who should try it before buying according to Sacha?",
      "une personne sensible au bruit",
      [
        "un voyageur sans bagage",
        "une personne sensible au bruit",
        "un bibliothécaire seulement"
      ],
      "Noise-sensitive buyers should test the keyboard rather than rely solely on the review."
    ]
  ],
  "b1-22": [
    [
      "What visible sign does Amina see after the error?",
      "un numéro temporaire",
      [
        "une validation officielle",
        "un numéro temporaire",
        "une facture"
      ],
      "She sees a temporary number but no conclusive submission confirmation."
    ],
    [
      "What information does Jules advise preserving?",
      "le message, l’heure et les étapes",
      [
        "le message, l’heure et les étapes",
        "son mot de passe",
        "le nom d’un voisin"
      ],
      "He asks her to record the exact message, the time and the steps taken."
    ]
  ],
  "b1-23": [
    [
      "Why might an earlier meeting exclude Amina?",
      "elle travaille jusqu’à quinze heures",
      [
        "elle travaille jusqu’à quinze heures",
        "elle part en train",
        "elle est malade"
      ],
      "Bastien identifies Amina's work schedule as a conflict with an earlier start."
    ],
    [
      "What does Sarah plan before confirming a time?",
      "recueillir les choix du groupe",
      [
        "recueillir les choix du groupe",
        "annoncer le vendredi",
        "acheter des billets"
      ],
      "Sarah plans to offer concrete slots and obtain participant preferences first."
    ]
  ],
  "b1-24": [
    [
      "What replacement transport do the travelers discover?",
      "un bus",
      [
        "un tram",
        "un bus",
        "un avion"
      ],
      "Émilie and Romain describe a train replaced by a bus before departure."
    ],
    [
      "What useful event happens during the delay?",
      "une rencontre avec un habitant",
      [
        "une rencontre avec un habitant",
        "un remboursement",
        "une visite guidée"
      ],
      "A local resident advises the travelers where they can eat while waiting."
    ]
  ],
  "b1-25": [
    [
      "What percentage of respondents prefer the train?",
      "trente pour cent",
      [
        "vingt pour cent",
        "trente pour cent",
        "cinquante pour cent"
      ],
      "Chloé says the displayed survey figure is thirty percent of respondents."
    ],
    [
      "What methodological information is missing?",
      "le nombre de répondants et la comparabilité",
      [
        "le nom de la gare",
        "le nombre de répondants et la comparabilité",
        "l’heure du train"
      ],
      "The graph lacks sample count and information on whether surveys are comparable."
    ]
  ],
  "b1-26": [
    [
      "Who must check meeting-room equipment?",
      "Clara",
      [
        "Marc",
        "Clara",
        "Éva"
      ],
      "Noé confirms Clara has been assigned to check equipment before Thursday."
    ],
    [
      "Was an invitation sender designated?",
      "non",
      [
        "oui, Marc",
        "oui, Clara",
        "non"
      ],
      "Éva says the topic was discussed, but no person was appointed to invitations."
    ]
  ],
  "b1-27": [
    [
      "What service change does Louise want considered?",
      "des horaires plus accessibles",
      [
        "un bâtiment fermé",
        "des horaires plus accessibles",
        "une nouvelle gare"
      ],
      "Louise proposes studying longer accessible opening hours."
    ],
    [
      "What constraint does she explicitly recognize?",
      "un coût de personnel supplémentaire",
      [
        "un coût de personnel supplémentaire",
        "une fermeture définitive",
        "un voyage"
      ],
      "She acknowledges that additional staffing could increase costs."
    ]
  ],
  "b1-28": [
    [
      "What does the center's recent unsigned poster say?",
      "vendredi à dix heures",
      [
        "vendredi à dix heures",
        "lundi à midi",
        "jeudi à neuf heures"
      ],
      "The poster gives Friday at ten, conflicting with the earlier email at nine."
    ],
    [
      "What will Sophie do when confirmation arrives?",
      "rédiger une synthèse prudente",
      [
        "rédiger une synthèse prudente",
        "annoncer un accord avant vérification",
        "fermer le centre"
      ],
      "Sophie plans an evidence-calibrated summary after getting official confirmation."
    ]
  ]
};
export function listeningQuestionsForU11Course(unit:A1Unit):readonly A1ListeningQuestion[]{
 const pair=PAIRS[unit.id];
 if(!pair)return listeningQuestionsForOriginalCourse(unit);
 return pair.map(([prompt,answer,options,explanation],i)=>Object.freeze({id:unit.id+'-listen-'+(i+1),prompt,answer,options:Object.freeze([...options]),explanation}));
}
export function validateU11Listening():readonly string[]{
 const issues=[...validateB1Listening()];
 if(Object.keys(PAIRS).length!==14)issues.push('14 new B1 listening pairs expected');
 for(const unit of B1_DEPTH_UNITS){
  const items=listeningQuestionsForU11Course(unit);
  if(items.length!==2)issues.push(unit.id+' listening breadth');
  for(const item of items)if(item.options.length<3||!item.options.includes(item.answer)||item.explanation.length<35)
   issues.push('Unqualified listening question '+item.id);
 }
 return issues;
}
