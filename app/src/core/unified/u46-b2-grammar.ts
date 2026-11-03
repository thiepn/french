import type {A1Grammar} from './u6-a1-model.ts';

/** Original advanced-language teaching for the three linked library meetings.
 * Explicitly non-certifying: CEFR groups original tasks for navigation only.
 */
export const U46_B2_GRAMMAR:Readonly<Record<string,readonly A1Grammar[]>>=Object.freeze({
 'transfer-154':Object.freeze([
  {heading:'Décrire une statistique sans changer son dénominateur',
   explanation:'Selon le registre names the source of an observation. The noun entrées counts visits, not unique residents; similarly 68 % des répondants is not 68 % des habitants. When the population is uncertain, use on ne peut pas en déduire que instead of inventing a general claim. The following source correction changes the unsupported population, not the number itself.',
   examples:[['Selon le registre, la bibliothèque a compté 1 200 entrées.','According to the register, the library counted 1,200 entries.'],['On ne peut pas en déduire que 1 200 habitants différents sont venus.','We cannot infer that 1,200 different residents came.']],
   correction:['Selon le registre, 1 200 habitants différents ont été accueillis.','Selon le registre, 1 200 entrées ont été enregistrées.','The record supplies entries; changing entries into distinct inhabitants without individual-level evidence invents a denominator.']},
  {heading:'Concession et limite de représentativité',
   explanation:'Bien que introduces a concession with a subjunctive verb, for example bien que le sondage soit utile. It acknowledges that a finding may still be useful while limiting what can follow from it. Même si normally takes indicative when granting a circumstance. An accurate concession names those missing from the survey instead of treating non-response as disagreement.',
   examples:[['Bien que le sondage soit utile, il représente surtout les usagers présents.','Although the survey is useful, it mainly represents visitors who were present.'],['Même si la demande existe, son ampleur reste inconnue.','Even if there is demand, its scale remains unknown.']],
   correction:['Bien que le questionnaire est limité, il peut éclairer le débat.','Bien que le questionnaire soit limité, il peut éclairer le débat.','Bien que requires the subjunctive soit here; the concession does not turn an on-site sample into a representative survey.']}
 ] as const),
 'transfer-155':Object.freeze([
  {heading:'Condition négociée : à condition que et sous réserve de',
   explanation:'À condition que is followed by the subjunctive and turns a general preference into a testable prerequisite: à condition que les transports soient confirmés. Sous réserve de can introduce a noun or an infinitive to reserve agreement until evidence arrives. In a compromise, distinguish a proposed provision from a signed obligation; reported potential funding is not permission to start immediately.',
   examples:[['Nous accepterions le jeudi à condition que le retour soit assuré.','We would accept Thursday provided the journey home were secured.'],['La proposition reste soumise à la signature d’un accord.','The proposal remains subject to a signed agreement.']],
   correction:['Nous lancerons le service à condition que les équipes sont payées.','Nous lancerons le service à condition que les équipes soient payées.','After à condition que, use the subjunctive soient rather than sont; staffing must be confirmed before launch.']},
  {heading:'Rapporter des positions sans fabriquer un accord',
   explanation:'Selon Nora, pour Yanis and Claire rappelle que keep competing positions attributed. La mairie affirme pouvoir financer un essai conveys what the municipality claims, not an independently verified budget or a signed collective agreement. Use le conseil examinera rather than le conseil a approuvé when the proposal remains pending. A fair summary preserves what each participant still refuses.',
   examples:[['Nora souhaite le mercredi, tandis que Yanis privilégie le jeudi.','Nora wants Wednesday, whereas Yanis favors Thursday.'],['La mairie affirme pouvoir financer un essai, mais aucun accord n’est signé.','The municipality says it can fund a trial, but no agreement has been signed.']],
   correction:['Tout le monde a approuvé les horaires définitifs.','La réunion a transmis une proposition amendée au conseil.','The consultation documents preferences and a proposed compromise; it does not authorize permanent hours.']}
 ] as const),
 'transfer-156':Object.freeze([
  {heading:'Concession, décision et résultat : trois niveaux à distinguer',
   explanation:'Bien que plus subjunctive introduces a fact granted as a concession: bien que les chiffres paraissent favorables. The council has merely authorized preparation subject to conditions. Do not turn this administrative step into a measured successful outcome. Distinguish la décision prévoit, le protocole mesurera and le bilan a constaté when the last stage has not yet happened.',
   examples:[['Bien que l’essai soit envisagé, son efficacité n’a pas été démontrée.','Although the trial is envisaged, its effectiveness has not been demonstrated.'],['Le conseil autorise la préparation, non l’ouverture permanente.','The council authorizes preparation, not permanent opening.']],
   correction:['Bien que les résultats sont bons, le projet a définitivement réussi.','Bien que la proposition soit retenue, les résultats restent à mesurer.','Use subjunctive soit with bien que and avoid describing unobserved trial results as established success.']},
  {heading:'Si réel, condition de suspension et décision réversible',
   explanation:'A real future condition uses si plus present indicative followed by a future verb: si le retour est impossible, le conseil suspendra. Avoid the future after si in this ordinary conditional construction. A credible recommendation names measurable triggers for review before implementation rather than deciding after seeing only favorable results.',
   examples:[['Si le dernier bus ne permet pas le retour, le conseil suspendra l’essai.','If the last bus prevents the return journey, the council will suspend the trial.'],['Nous réviserons les horaires si les familles restent exclues.','We will revise the hours if families remain excluded.']],
   correction:['Si le bus ne permettra pas le retour, nous suspendrons le jeudi.','Si le bus ne permet pas le retour, nous suspendrons le jeudi.','Use present permet after si in a real future condition, then future suspendrons in the result.']}
 ] as const)
});
