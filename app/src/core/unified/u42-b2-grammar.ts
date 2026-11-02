import type {A1Grammar} from './u6-a1-model.ts';

/** Authorial B2 explanations for the three additional cases.
 * These replace generic revision bridges only within new 151–153 cases.
 * Source-owned, not generated grades or independent CEFR certification.
 */
export const U42_B2_GRAMMAR:Readonly<Record<string,readonly A1Grammar[]>>=Object.freeze({
 'transfer-151':Object.freeze([
  {
   heading:'Concession: bien que + subjonctif, même si + indicatif',
   explanation:'A B2 argument can recognize a genuine opposing fact without abandoning its own conclusion. Bien que introduces a concession with the subjunctive: bien que le sondage soit limité. Même si normally uses the indicative for an admitted circumstance: même si les interruptions ont diminué. A concession is not proof that the conceded fact caused the result. Connect the clause to the precise limitation that follows.',
   examples:[
    ['Bien que le chiffre soit élevé, il ne décrit que les répondants.','Although the figure is high, it describes only the respondents.'],
    ['Même si les interruptions ont diminué, la cause reste à établir.','Even if interruptions decreased, the cause remains to be established.']
   ],
   correction:['Bien que le sondage est limité, nous l’utiliserons.','Bien que le sondage soit limité, nous l’utiliserons.','The subordinate verb following bien que takes the subjunctive soit rather than indicative est.']
  },
  {
   heading:'Source attribution and causal caution',
   explanation:'Selon introduces the provenance of a claim; it does not make the source representative or causally decisive. A survey measures what its respondents say, whereas an observation reports a situation under particular conditions. Distinguish les répondants déclarent que from les élèves sont, and use conditional language such as pourrait or semble when competing explanations remain. Avoid turning correlation into proof of causation.',
   examples:[
    ['Selon le questionnaire, 72 % des répondants signalent une distraction.','According to the questionnaire, 72% of respondents report distraction.'],
    ['La baisse observée pourrait aussi tenir à un nouvel aménagement.','The observed reduction could also be related to a new arrangement.']
   ],
   correction:['Le téléphone a causé la baisse des interruptions.','La baisse coïncide avec la consigne; sa cause reste à vérifier.','A concurrent change in room layout prevents a causal conclusion from this observation.']
  }
 ] as const),
 'transfer-152':Object.freeze([
  {
   heading:'Real and hypothetical conditions in collective negotiation',
   explanation:'A real future condition uses si followed by the present and then a future main clause: si le bilan confirme, nous prolongerons. An imagined situation uses si plus imparfait with the present conditional in the consequence: si les horaires étaient plus souples, nous accepterions. Do not put conditional morphology immediately after si in an ordinary hypothesis. Choose the pair based on whether the result is presented as possible under a real condition or merely imagined.',
   examples:[
    ['Si le bilan confirme un progrès, nous prolongerons l’essai.','If the evaluation confirms improvement, we will extend the trial.'],
    ['Si les horaires étaient mieux répartis, davantage de salariés accepteraient.','If hours were distributed more fairly, more staff would agree.']
   ],
   correction:['Si le bilan confirmerait un progrès, nous prolongerions.','Si le bilan confirmait un progrès, nous prolongerions.','An imaginary condition requires imparfait confirmait after si and conditionnel prolongerions in the main clause.']
  },
  {
   heading:'Negotiated reservations: à condition que, sous réserve de',
   explanation:'In a formal agreement, à condition que states a binding requirement and takes the subjunctive. Sous réserve de can introduce a noun or an infinitive phrase describing a reservation. Conditions should be verifiable: actual working hours, service quality and accessible consultation are measurable, while a vague promise of satisfaction is not. Use a clearly named actor and deadline so a collective proposal cannot be mistaken for an already accepted agreement.',
   examples:[
    ['Nous accepterions l’essai à condition que les heures soient déclarées.','We would accept the trial provided working hours were recorded.'],
    ['L’accord est prolongé sous réserve de publier un bilan à six semaines.','The agreement is extended subject to publishing a six-week evaluation.']
   ],
   correction:['À condition que les heures sont enregistrées, nous signerons.','À condition que les heures soient enregistrées, nous signerons.','À condition que requires the subjunctive soient; the indicative sont is not appropriate here.']
  }
 ] as const),
 'transfer-153':Object.freeze([
  {
   heading:'Comparative claims require a common criterion',
   explanation:'B2 comparisons identify exactly what is measured: a purchase price, actual energy consumption, delivery time or complete lifecycle cost. Moins cher à l’achat does not mean moins coûteux sur dix ans. Meilleur describes a noun, whereas mieux modifies how something is done. Attribute figures measured under standardized conditions and avoid presenting a quoted percentage as a guarantee for every user.',
   examples:[
    ['Le produit neuf coûte plus cher à l’achat, mais sa consommation reste à vérifier.','The new item costs more to buy, but its actual consumption still needs checking.'],
    ['Cette solution serait meilleure si la pièce restait disponible.','This solution would be better if the spare part remained available.']
   ],
   correction:['Cet appareil est plus meilleur pour tous les habitants.','Cet appareil serait meilleur sous certaines conditions.','Meilleur is already comparative; avoid plus meilleur and the unsupported universal claim.']
  },
  {
   heading:'Purpose, safeguard and conditional recommendation',
   explanation:'Use pour plus infinitive when the subject of the intended action is the same: demander un diagnostic pour comparer. Use pour que plus the subjunctive when a different subject must act: prévoir un prêt pour que les habitants puissent conserver les aliments. A conditional recommendation connects the action to an explicit safeguard; it does not assume that repair or replacement is automatically the best environmental outcome.',
   examples:[
    ['Nous demandons un diagnostic pour comparer les coûts réels.','We request a diagnosis to compare actual costs.'],
    ['Un prêt est nécessaire pour que les habitants puissent garder les aliments au frais.','A loan is necessary so that residents can keep food chilled.']
   ],
   correction:['Nous prévoyons un prêt pour que les habitants peuvent conserver les aliments.','Nous prévoyons un prêt pour que les habitants puissent conserver les aliments.','Pour que takes the subjunctive puissent, not the indicative peuvent.']
  }
 ] as const)
});
