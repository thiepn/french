/** Six original B2 inferential listening comparisons. Each asks the learner to
 * reconcile TWO distinct verbatim source turns; authored corrections are
 * written explanations, not claims that audio was heard or understood.
 */
export interface B2ListeningPair{
 readonly id:string; readonly lesson:string;
 readonly first:Readonly<{speaker:string;anchor:string}>;
 readonly second:Readonly<{speaker:string;anchor:string}>;
 readonly question:string;readonly answer:string;
 readonly distractors:readonly [string,string];
 readonly corrections:readonly [string,string];
 readonly explanation:string;readonly hint:string;
 readonly oralPrompt:string;readonly oralCriteria:readonly [string,string,string];
}
export const ORIGINAL_B2_LISTENING_PAIRS:readonly B2ListeningPair[]=Object.freeze([
 {
  id:'survey-denominator',lesson:'transfer-151',
  first:{speaker:'Marc',anchor:'72 % des répondants'},
  second:{speaker:'Nadia',anchor:'72 % de tout le lycée'},
  question:'After Marc and Nadia speak, why would the statement “72 % of the whole school wants a ban” be unjustified?',
  answer:'The 72 % refers only to survey respondents and the number surveyed is unknown.',
  distractors:['The survey records 72 % of all enrolled pupils, so the claim is already verified.','Nadia denies that anyone reported distraction.'],
  corrections:['Marc explicitly says they do not know how many responded, so respondents cannot be equated with all pupils.','Nadia challenges the population claim, not the fact that some respondents felt distracted.'],
  explanation:'The two utterances separate a reported respondent percentage from an unsupported whole-school estimate. This is a denominator problem, not proof of a school-wide preference.',
  oralPrompt:'En 45 secondes, expliquez la différence entre les répondants et tout le lycée, puis proposez une vérification avant de décider.',
  oralCriteria:['Attribuez le chiffre à Marc sans changer la population.','Expliquez pourquoi le nombre de répondants importe.','Formulez une proposition conditionnelle sans annoncer un vote général.'],
  hint:'Listen for « des répondants » in Marc’s claim and « tout le lycée » in Nadia’s limitation.'
 },
 {
  id:'classroom-causality',lesson:'transfer-151',
  first:{speaker:'Lina',anchor:'moins d’interruptions'},
  second:{speaker:'Marc',anchor:'modifié la disposition des tables'},
  question:'Which conclusion correctly joins the classroom observation and Marc’s caution?',
  answer:'Interruptions fell, but the simultaneous table rearrangement prevents attributing the change solely to screens.',
  distractors:['Closing screens was proven to be the sole cause of the decline.','The class reported more interruptions after the change.'],
  corrections:['The teacher also changed the tables, so the speakers do not isolate a single cause.','Lina explicitly reports fewer, not more, interruptions.'],
  explanation:'An observation of improvement and a concurrent change must both be retained. A policy trial should investigate competing explanations rather than manufacture causality.',
  oralPrompt:'Résumez en français les deux observations sans conclure à une cause unique. Proposez un essai qui permette une comparaison.',
  oralCriteria:['Distinguez la diminution observée de son explication possible.','Mentionnez le changement simultané des tables.','Proposez une comparaison limitée, et non une causalité prouvée.'],
  hint:'Contrast Lina’s « moins » with Marc’s « simultanément » and « incertaine ».'
 },
 {
  id:'quantity-versus-quality',lesson:'transfer-152',
  first:{speaker:'Thomas',anchor:'augmenté de 8 %'},
  second:{speaker:'Aïcha',anchor:'dossiers revenus pour correction'},
  question:'Why does the eight-percent processing increase not establish the workweek trial’s overall success?',
  answer:'It measures handled cases but omits overtime and files returned for correction.',
  distractors:['The 8 % figure already includes every overtime hour and corrected file.','Aïcha says there were no processed cases at all.'],
  corrections:['Aïcha expressly names missing overtime and correction information.','The first claim reports a positive count change, not a zero volume.'],
  explanation:'Throughput is one reported quantity; the second speaker identifies potentially costly quality and labor dimensions that are not established by it.',
  oralPrompt:'Présentez les résultats de l’essai au comité en distinguant les dossiers traités, la qualité et les heures supplémentaires.',
  oralCriteria:['Attribuez la hausse de 8 % à Thomas, et non à Aïcha.','N’affirmez pas que les corrections et les heures supplémentaires sont connues.','Proposez des mesures complémentaires vérifiables.'],
  hint:'Hear Thomas’s positive figure and Aïcha’s double exclusion « ni… ni… ».'
 },
 {
  id:'missing-respondents',lesson:'transfer-152',
  first:{speaker:'Thomas',anchor:'exprimé une préférence'},
  second:{speaker:'Mélanie',anchor:'personnes absentes n’ont pas été interrogées'},
  question:'What limitation must qualify management’s reported employee preference?',
  answer:'Only staff present during the trial were surveyed; absent staff were not asked.',
  distractors:['Every employee was personally interviewed, including absent colleagues.','The employees unanimously rejected the new schedule.'],
  corrections:['Mélanie states the survey explicitly excluded staff absent from the trial.','A reported preference from selected respondents does not establish unanimous opposition.'],
  explanation:'The dialogue distinguishes a management summary of preference from the actual sampling frame, which excludes absent staff.',
  oralPrompt:'Reformulez la préférence rapportée par la direction et expliquez en quoi les absences limitent la consultation.',
  oralCriteria:['Séparez la préférence annoncée du groupe effectivement consulté.','N’oubliez pas les salariés absents pendant l’essai.','Proposez une consultation plus représentative.'],
  hint:'Listen for who the survey was addressed to and the negation « n’ont pas été interrogées ».'
 },
 {
  id:'standard-versus-actual',lesson:'transfer-153',
  first:{speaker:'Amine',anchor:'25 % d’électricité en moins'},
  second:{speaker:'Sofia',anchor:'notre consommation réelle'},
  question:'What can the manufacturer’s 25 % electricity figure establish about annual savings for this residence?',
  answer:'It comes from a standard test; the residence’s actual use and full impact are not established.',
  distractors:['It guarantees 25 % lower total costs and environmental impact for this residence.','Sofia confirms the exact electricity consumption of the current fridge.'],
  corrections:['The percentage refers only to a standardized comparison, not verified local bills or lifecycle impacts.','Sofia says actual residence consumption is not specified.'],
  explanation:'A claimed laboratory difference and the local missing-use information cannot be combined into a guaranteed outcome.',
  oralPrompt:'Expliquez aux résidents la portée limitée du chiffre de 25 % et dites quelles données il faudrait réunir avant l’achat.',
  oralCriteria:['Présentez le chiffre comme une affirmation issue d’un essai standard.','N’inventez ni facture réelle ni gain environnemental garanti.','Nommez les mesures locales nécessaires à une décision.'],
  hint:'Listen for « essai standard » and Sofia’s « ne précise pas ».'
 },
 {
  id:'delay-versus-safety',lesson:'transfer-153',
  first:{speaker:'Clara',anchor:'quinze jours'},
  second:{speaker:'Amine',anchor:'emprunter un appareil'},
  question:'How could residents respect the delivery delay without compromising immediate food storage?',
  answer:'Arrange a temporary loan while the spare part is delayed, then decide with verified information.',
  distractors:['Continue using an unsafe fridge for fifteen days without an alternative.','Buy a new device immediately because the price and diagnosis are already final.'],
  corrections:['Clara explicitly says safe food storage is needed now; a temporary loan addresses the gap.','The repair quote remains conditional, and Amine suggests borrowing before deciding in haste.'],
  explanation:'The speakers combine a present safety constraint with a provisional response that preserves future decision options.',
  oralPrompt:'Défendez une solution provisoire qui protège les aliments et laisse la décision finale ouverte pendant les quinze jours.',
  oralCriteria:['Mentionnez le délai de quinze jours de la pièce détachée.','Expliquez le besoin immédiat de conservation sûre.','Proposez le prêt temporaire sans garantir la réparation.'],
  hint:'Connect Clara’s « maintenant » with Amine’s « provisoire » and « plutôt que ».'
 }
]);
