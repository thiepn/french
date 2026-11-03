import {
 getOriginalMaterial,getOriginalCatalogEntry,type OriginalLevel
} from './u23-registry.ts';
import {originalU30Listening} from './u30-listening.ts';
import {originalVocabularyForUnit,originalVocabularyWitnesses} from './u28-vocabulary.ts';

/** U31 never turns rehearsal text, choices or visits into native Practice evidence. */
export type U31Stage='position'|'respond'|'challenge'|'repair'|'justify'|'sustain'|'transfer';
export type U31DecisionKind='fidelity'|'repair'|'register'|'objection'|'evidence';
export interface U31Decision{
 readonly id:string;readonly kind:U31DecisionKind;readonly prompt:string;
 readonly answer:string;readonly choices:readonly string[];
 readonly explanation:string;readonly wrong:Readonly<Record<string,string>>;
 readonly citedTurn:number;readonly evidence:string;
}
export interface U31StagePlan{
 readonly id:U31Stage;readonly title:string;readonly task:string;
 readonly target:string;readonly hint:string;readonly repair:string;
 readonly criteria:readonly string[];
 readonly sourceTurn:number;
}
export interface U31Journey{
 readonly lessonId:string;readonly title:string;readonly level:OriginalLevel;
 readonly qualifiedId:string;readonly sourceRevision:string;
 readonly speakerNames:readonly string[];
 readonly dialogue:readonly {readonly speaker:string;readonly fr:string;readonly en:string}[];
 readonly reading:Readonly<{title:string;text:string}>|null;
 readonly documents:readonly {readonly label:string;readonly type:string;readonly french:string}[];
 readonly oral:NonNullable<ReturnType<typeof getOriginalMaterial>>['oral'];
 readonly writingChoices:NonNullable<ReturnType<typeof getOriginalMaterial>>['writingChoices'];
 readonly lexicalWitnesses:readonly {readonly french:string;readonly english:string;readonly originalContext:string}[];
 readonly scenarioTitle:string;readonly u30DecisionCount:number;readonly counterview:string;readonly misunderstanding:string;
 readonly desiredRegister:string;readonly stages:readonly U31StagePlan[];
 readonly decisions:readonly U31Decision[];
 readonly curated:boolean;
}
type DecisionSpec={
 readonly kind:U31DecisionKind;readonly prompt:string;readonly answer:string;
 readonly distractors:readonly [string,string];
 readonly corrections:readonly [string,string];readonly why:string;
};
type AuthoredJourney={
 readonly id:string;readonly speaker:string;readonly anchor:string;
 readonly situation:string;readonly counterview:string;readonly misunderstanding:string;
 readonly register:string;readonly objective:string;readonly repair:string;
 readonly structure:string;readonly decisions:readonly [DecisionSpec,DecisionSpec];
};
const AUTHORED:readonly AuthoredJourney[]=[
 {
 id:'a1-01',speaker:'Malik',anchor:'Très bien, merci. Et toi ?',
 situation:'Greeting a new person and keeping the exchange two-sided',
 counterview:'Imagine the other person says: « Je ne veux pas dire mon nom maintenant. » This is an invented speaking challenge, not historical dialogue.',
 misunderstanding:'A partner interprets « Et toi ? » as a request for a job title.',
 register:'Familiar exchange among two people who have introduced themselves',
 objective:'Greet, answer how you feel, return the question, and close naturally without demanding private information.',
 repair:'Explain politely that « Et toi ? » repeats the preceding how-are-you question.',
 structure:'Bonjour → je vais bien / assez bien → et toi ? → merci → au revoir.',
 decisions:[
  {kind:'repair',prompt:'Your partner says « Et toi ? » asks for your profession. What corrects this misunderstanding?',
   answer:'« Et toi ? » asks the other person how they are doing.',
   distractors:['It demands the other person’s job title.','It means the conversation has already ended.'],
   corrections:['Malik answers a wellbeing question before saying « Et toi ? ».','A reciprocal question is not a goodbye.'],
   why:'The original sequence makes « Et toi ? » a reciprocal wellbeing question.'},
  {kind:'register',prompt:'Which reply preserves the familiar, reciprocal tone of the original greeting?',
   answer:'« Ça va bien, merci. Et toi ? »',
   distractors:['« Déclarez immédiatement votre profession. »','« Ne me parle plus jamais. »'],
   corrections:['This imperative is inappropriate to a friendly greeting.','The hostile demand is not the register of the original exchange.'],
   why:'The model reply matches the polite/familiar form and gives the other person a turn.'}
 ]
 },
 {
 id:'a1-02',speaker:'Aya',anchor:'Oui, nous sommes tous étudiants.',
 situation:'Correcting an inaccurate summary about people in a student group',
 counterview:'A classmate assumes that only one member of the group studies. This is a hypothetical prompt, not a quoted dialogue.',
 misunderstanding:'A classmate thinks « nous sommes tous » describes Aya alone.',
 register:'Neutral, friendly explanation to a fellow student',
 objective:'Describe who belongs to the group, distinguish « je » from « nous », and respond in complete short sentences.',
 repair:'Point out that « nous » includes more than one person; « tous » includes everyone in the referenced group.',
 structure:'Je suis… → nous sommes… → tous… → et toi ?',
 decisions:[
  {kind:'fidelity',prompt:'Which claim keeps Aya’s original group statement intact?',
   answer:'Aya says the group she refers to are all students.',
   distractors:['Aya says she is the only student.','Aya says none of her friends studies.'],
   corrections:['The plural subject « nous » contradicts an individual-only summary.','« Tous étudiants » asserts student status, not its absence.'],
   why:'The original French uses both the inclusive plural subject and the quantifier « tous ».'},
  {kind:'repair',prompt:'Which is the clearest simple-language correction of « nous = Aya alone »?',
   answer:'« Non, nous parlons du groupe, pas seulement de moi. »',
   distractors:['« Oui, nous signifie seulement moi. »','« Non, il n’y a personne dans le groupe. »'],
   corrections:['This restates the incorrect singular reading.','The original explicitly describes an existing group.'],
   why:'The model answer distinguishes the subject group from the speaker alone.'}
 ]
 },
 {
 id:'a2-01',speaker:'Émile',anchor:'Oui, mais je n’ai pas fini le film : j’ai dormi !',
 situation:'Retelling what happened last night without dropping a negation',
 counterview:'A friend says Émile watched the whole film. This is a deliberate hypothetical misunderstanding.',
 misunderstanding:'Someone summarizes « je n’ai pas fini » as « j’ai fini ».',
 register:'Casual account of a recent personal experience',
 objective:'Describe completed actions, preserve the negative past, and explain why the film was not finished.',
 repair:'Correct the omitted « ne … pas », then state the reason without inventing new events.',
 structure:'Hier soir → j’ai préparé… → mais je n’ai pas fini… → parce que…',
 decisions:[
  {kind:'repair',prompt:'Your partner says Émile finished the film. Which correction is faithful?',
   answer:'He did not finish it because he fell asleep.',
   distractors:['He finished it and then fell asleep.','He refused to start a film because he was working.'],
   corrections:['The original includes « ne … pas fini ».','Neither refusal nor work appears in the original explanation.'],
   why:'The negated passé composé and « j’ai dormi » explicitly give the outcome and reason.'},
  {kind:'register',prompt:'Which spontaneous reply uses a natural friendly correction?',
   answer:'« En fait, je ne l’ai pas terminé : je me suis endormi. »',
   distractors:['« Vous êtes tenu de rectifier votre procès-verbal. »','« J’ai regardé tout le film, sans exception. »'],
   corrections:['This administrative formula is inappropriate for a casual friend.','This contradicts Émile’s explicitly negative completion claim.'],
   why:'The model keeps informal conversational repair and the unfinished outcome.'}
 ]
 },
 {
 id:'a2-15',speaker:'Romain',anchor:'Le premier est plus grand, mais il est aussi plus cher.',
 situation:'Negotiating an apartment choice rather than treating one advantage as decisive',
 counterview:'A roommate says size alone proves the first flat is better; this objection is hypothetical.',
 misunderstanding:'Someone reverses which apartment is more expensive.',
 register:'Respectful conversation with a peer considering a shared home',
 objective:'Compare size, price and proximity to the station; give a conditional rather than unsupported definitive recommendation.',
 repair:'Clarify that the larger first flat is also more expensive, while the second is nearer the station.',
 structure:'D’un côté… → cependant… → le deuxième… → donc, si notre priorité est…',
 decisions:[
  {kind:'fidelity',prompt:'Which comparison is supported by the original exchange?',
   answer:'The first is larger and more expensive; the second is closer to the station.',
   distractors:['The first is both smaller and cheaper.','The second is certainly larger and farther from the station.'],
   corrections:['Romain explicitly says the first is larger and costlier.','No one establishes that the second is larger; it is closer to the station.'],
   why:'The original speakers weigh three stated properties rather than a single advantage.'},
  {kind:'objection',prompt:'A partner objects that the first flat has more space. Which response fairly addresses that point?',
   answer:'« C’est vrai, mais il coûte plus cher. Le deuxième est plus près de la gare. »',
   distractors:['« Non, le premier est le moins cher. »','« La taille n’a jamais été mentionnée. »'],
   corrections:['This reverses the original cost comparison.','The discussion explicitly addresses size.'],
   why:'The model acknowledges the genuine advantage before adding two relevant trade-offs.'}
 ]
 },
 {
 id:'a2-17',speaker:'Cliente',anchor:'Pourriez-vous confirmer le nouveau prix ?',
 situation:'Politely repairing a misunderstanding about a hotel reservation',
 counterview:'A receptionist repeats the old date by mistake. This is a constructed role-play objection.',
 misunderstanding:'The receptionist thinks the request concerns Wednesday rather than Thursday.',
 register:'Formal and courteous request to a service employee using vous',
 objective:'Ask to change Wednesday to Thursday, request the updated price, and make the date explicit.',
 repair:'Restate « jeudi au lieu de mercredi » and request confirmation with « pourriez-vous ».',
 structure:'Bonjour → je voudrais… → jeudi au lieu de mercredi → pourriez-vous confirmer… → merci.',
 decisions:[
  {kind:'register',prompt:'Which request preserves the original customer’s courteous register?',
   answer:'« Pourriez-vous confirmer le nouveau prix, s’il vous plaît ? »',
   distractors:['« Hé toi, donne-moi le prix ! »','« Tu me diras le prix, c’est un ordre. »'],
   corrections:['The imperative with « toi » is too abrupt for this setting.','This is a command rather than a courteous request.'],
   why:'The original uses the conditional « pourriez-vous » and formal vous.'},
  {kind:'repair',prompt:'The receptionist confirms Wednesday. Which response corrects the date without inventing a booking?',
   answer:'« Je souhaitais jeudi, et non mercredi. Pourriez-vous vérifier ? »',
   distractors:['« Parfait, je confirme mercredi. »','« Vous m’avez déjà remboursé jeudi. »'],
   corrections:['This accepts the wrong date.','The original conversation does not mention a refund.'],
   why:'The response gently repairs the date mismatch while asking for verification.'}
 ]
 },
 {
 id:'b1-01',speaker:'Eva',anchor:'le dernier bus part plus tôt le vendredi',
 situation:'Proposing a changed meeting time and explaining the actual reason',
 counterview:'A colleague says the original meeting must stay unchanged. This is a hypothetical objection.',
 misunderstanding:'The colleague hears that every Friday bus has been cancelled.',
 register:'Constructive, courteous peer-to-peer project coordination',
 objective:'Explain the earlier last bus, suggest a new meeting time and distinguish a confirmed timetable from an invented cancellation.',
 repair:'Clarify that the stated problem is the earlier departure of the last bus, not a cancellation.',
 structure:'J’ai remarqué que… → donc… → je propose… → puisque… → vérifions…',
 decisions:[
  {kind:'fidelity',prompt:'Which reason can Eva actually give from the original exchange?',
   answer:'The last Friday bus leaves earlier, affecting the meeting plan.',
   distractors:['The bus service has cancelled every Friday route.','The post office refuses to serve Eva.'],
   corrections:['An earlier last departure is not a general cancellation.','The conversation mentions a closing time, not a refusal of service.'],
   why:'Eva states a concrete scheduling issue; Martin also plans to verify opening hours.'},
  {kind:'objection',prompt:'A colleague resists the change. Which reply states a reason and a proportionate next action?',
   answer:'« Je comprends, mais le dernier bus part plus tôt. Vérifions les horaires et cherchons un créneau. »',
   distractors:['« Le bus ne circule plus jamais, donc annule tout. »','« Tu n’as pas le droit de discuter nos horaires. »'],
   corrections:['The categorical cancellation exceeds the source.','A confrontational command is not a practical scheduling response.'],
   why:'A qualified claim, verification and a workable proposal fit the published conversation.'}
 ]
 },
 {
 id:'b1-02',speaker:'Omar',anchor:'nous pourrions proposer deux options et demander les préférences de chacun',
 situation:'Disagreeing constructively about remote versus in-person meetings',
 counterview:'A colleague insists that only one meeting format is acceptable. This is an invented role-play challenge.',
 misunderstanding:'A listener hears Omar’s compromise as an unconditional decision to meet in person.',
 register:'Professional but collegial; acknowledge competing needs',
 objective:'Present remote access, the wish for in-person contact and an option-based compromise without claiming unanimity.',
 repair:'Explain that Omar suggests asking preferences; he does not announce a final universal decision.',
 structure:'Je comprends… → pourtant… → même si… → nous pourrions… → demandons…',
 decisions:[
  {kind:'repair',prompt:'Someone claims Omar has already finalized an in-person meeting. What is the accurate correction?',
   answer:'He proposes two options and consulting everyone’s preferences.',
   distractors:['He has booked a physical room and made attendance mandatory.','He cancelled every online option.'],
   corrections:['The conversation reports a suggestion, not a binding reservation.','Omar’s proposal explicitly preserves two options.'],
   why:'Conditional « pourrions » and « demander » identify a proposal and a consultation.'},
  {kind:'objection',prompt:'Which response acknowledges a preference for face-to-face meetings without dismissing remote colleagues?',
   answer:'« Je comprends cette préférence. Pourtant, certains habitent loin ; proposons deux options. »',
   distractors:['« Personne ne préfère se voir en personne. »','« Les collègues éloignés n’ont pas leur mot à dire. »'],
   corrections:['Omar explicitly reports that some prefer meeting in person.','Excluding remote colleagues contradicts the proposal to ask everyone.'],
   why:'The model response fairly preserves both interests and the suggested compromise.'}
 ]
 },
 {
 id:'b1-03',speaker:'Paul',anchor:'une confirmation écrite de la version officielle',
 situation:'Explaining uncertainty between two document versions',
 counterview:'A supervisor tells the team to send whichever file seems newer. This is a hypothetical objection.',
 misunderstanding:'Someone treats the most recently encountered version as automatically official.',
 register:'Calm and precise update to an organizational colleague',
 objective:'Differentiate version existence from version authority, request written confirmation and avoid unverified claims.',
 repair:'Point out that the team needs confirmation of the official version before distributing the document.',
 structure:'Nous avons trouvé… → néanmoins… → ce dont nous avons besoin… → avant d’envoyer…',
 decisions:[
  {kind:'fidelity',prompt:'What requirement does Paul identify before a document can be presented as official?',
   answer:'Written confirmation identifying the authoritative version.',
   distractors:['A visually newer filename alone.','A rumor from a colleague, with no verification.'],
   corrections:['A filename does not establish official status.','The speaker specifically asks for written confirmation.'],
   why:'Paul says « une confirmation écrite de la version officielle ».'},
  {kind:'repair',prompt:'A teammate calls both versions official. Which correction preserves source uncertainty?',
   answer:'« Deux versions existent, mais nous devons encore confirmer laquelle est officielle. »',
   distractors:['« Les deux versions sont forcément officielles. »','« La date du fichier est une preuve définitive. »'],
   corrections:['Existence of two versions does not establish dual approval.','The date alone does not resolve the conflict.'],
   why:'The published exchange explicitly distinguishes contradictory versions from confirmation.'}
 ]
 },
 {
 id:'transfer-31',speaker:'Aline',anchor:'je ne peux pas affirmer qu’ils viennent de l’appartement voisin',
 situation:'Respectful neighborhood mediation without unsupported accusations',
 counterview:'A neighbor demands publicly naming someone as responsible immediately. This is an invented disagreement.',
 misunderstanding:'A participant thinks Aline witnessed a particular neighbor causing the sounds.',
 register:'Respectful, non-accusatory public or neighborhood communication',
 objective:'Describe what Aline heard, separate observation from hypothesis, respond to a demand for blame and suggest voluntary mediation.',
 repair:'Explain that sounds were heard, but neither the neighboring flat nor a responsible person has been established.',
 structure:'J’ai observé… → toutefois, je ne peux pas affirmer… → avant d’accuser… → proposons…',
 decisions:[
  {kind:'evidence',prompt:'Which claim is justified by the original attributed conversation?',
   answer:'Aline heard noise but could not reliably identify the apartment responsible.',
   distractors:['Aline saw a neighbor move furniture.','The building regulation identifies the exact culprit.'],
   corrections:['The speaker states no eyewitness identification.','The regulation states quiet hours but names no responsible resident.'],
   why:'The published dialogue explicitly separates observation from attribution.'},
  {kind:'repair',prompt:'Someone demands that you accuse the neighbor. Which source-consistent reply is appropriate?',
   answer:'« J’ai entendu les bruits, mais je ne sais pas d’où ils viennent ; vérifions les faits. »',
   distractors:['« J’ai vu notre voisin déplacer des meubles. »','« Le règlement désigne précisément notre voisin. »'],
   corrections:['The original source contains no such witnessed act.','The regulation does not name an individual.'],
   why:'The correction states observed evidence, acknowledges limits and proposes verification.'}
 ]
 },
 {
 id:'transfer-121',speaker:'Leïla',anchor:'supprime pourtant « il me semblait »',
 situation:'Defending an evidence-calibrated translation in a theatre discussion',
 counterview:'A producer insists the most categorical translation must always be clearer. This objection is hypothetical.',
 misunderstanding:'A translator claims the English version kept the narrator’s hesitation intact.',
 register:'Analytical, respectful editorial critique with careful uncertainty',
 objective:'Explain what the missing hedge changes, answer a clarity objection and distinguish the manuscript from staging choices.',
 repair:'Clarify that dropping « il me semblait » removes a cue of uncertainty; neither the author’s preference nor deliberate deception is proved.',
 structure:'Dans l’original… → en revanche… → cette omission… → pourtant… → je proposerais…',
 decisions:[
  {kind:'fidelity',prompt:'Which interpretation preserves Leïla’s concern about the translation?',
   answer:'Removing « il me semblait » turns a hesitant claim into a more certain one.',
   distractors:['The English version explicitly adds more uncertainty.','Leïla proves the narrator deliberately lied.'],
   corrections:['The objection concerns omitted uncertainty, not added uncertainty.','Neither a change in memory nor omission alone proves a deliberate lie.'],
   why:'The authored text contrasts a hedged original with a more categorical English wording.'},
  {kind:'objection',prompt:'The producer wants certainty for clarity. Which editorial response is evidence-calibrated?',
   answer:'« La clarté compte, mais il faut conserver l’hésitation présente dans le texte. »',
   distractors:['« L’autrice a forcément choisi notre première version. »','« Toutes les hésitations sont inutiles, supprimons-les. »'],
   corrections:['The original dialogue explicitly lacks proof of the author’s preference.','Deleting this hedge changes the narrator’s epistemic stance.'],
   why:'A precise translation should protect the original uncertainty while remaining readable.'}
 ]
 },
 {
 id:'transfer-148',speaker:'Malik',anchor:"pas la publication des sous-titres en ligne",
 situation:'Explaining a captioning error and the scope of publication consent',
 counterview:'An organizer wants to upload the draft transcript because it was approved for projection on site. This is hypothetical.',
 misunderstanding:'A viewer assumes dropping the negative sentence means the character accepted the contract.',
 register:'Formal, transparent public accessibility and rights communication',
 objective:'Correct a consequential negation error, distinguish rehearsed script from improvised performance and refuse unsupported online rights claims.',
 repair:'Explain that missing negation reversed the perceived decision, and the permission covers display in the venue, not online distribution.',
 structure:'La transcription… → pourtant, le texte approuvé… → en outre, l’autorisation… → vérifions…',
 decisions:[
  {kind:'repair',prompt:'Which correction repairs the audience’s mistaken understanding of the contract?',
   answer:'The approved line refuses the contract; the automatic captions lost negation.',
   distractors:['The approved line enthusiastically accepts the contract.','The error only concerns a background character’s name.'],
   corrections:['The approved text explicitly states refusal.','Names also vary, but the negation changes the contract decision.'],
   why:'The original discussion identifies a missing negative and its consequence for audience interpretation.'},
  {kind:'evidence',prompt:'Can venue-projection permission be cited as proof of online publication rights?',
   answer:'No; the published source limits existing permission to projection in the venue.',
   distractors:['Yes; all online uses are automatically included.','No captions may be shown in the venue either.'],
   corrections:['Projection permission does not imply a general internet licence.','The original explicitly permits on-site display.'],
   why:'Malik distinguishes existing display authorization from online release rights.'}
 ]
 } ,
 {
 id:'transfer-151',speaker:'Marc',anchor:'nous ignorons combien d’élèves ont répondu',
 situation:'Debating a reversible school phone policy without treating a response percentage as school-wide proof',
 counterview:'A fictional school-board member says: « Les 72 % prouvent que tous les élèves veulent une interdiction. » This is an invented objection, not an original quotation.',
 misunderstanding:'A participant confuses survey respondents with all pupils and assumes the observed improvement is causal.',
 register:'Formal, respectful consultation with pupils and staff',
 objective:'Attribute the survey precisely, explain the confounded classroom observation, protect accessibility needs and offer a reversible evidence-based trial.',
 repair:'Clarify that 72 % refers only to respondents, the response rate is unknown, and a simultaneously changed table layout prevents a single-cause conclusion.',
 structure:'Selon les répondants… → toutefois, le taux… → même si… → à condition que… → réévaluons…',
 decisions:[
  {kind:'fidelity',prompt:'Which reading of Marc’s statement about the questionnaire is justified by the original exchange?',
   answer:'72 % of respondents reported distraction; the number of pupils who answered is not known.',
   distractors:['72 % of the entire school approved a permanent ban.','The survey proved the phone restriction caused fewer interruptions.'],
   corrections:['The missing response rate prevents generalizing from respondents to the whole school.','A self-report questionnaire cannot isolate a causal effect.'],
   why:'Marc explicitly identifies an unknown number of survey respondents; this limits the population claim.'},
  {kind:'objection',prompt:'An imagined council member demands an immediate blanket ban. Which French response is proportionate and source-faithful?',
   answer:'« Je comprends l’inquiétude, mais la cause reste incertaine ; essayons une mesure limitée avec des exceptions accessibles. »',
   distractors:['« Les 72 % prouvent que tous les élèves souhaitent une interdiction définitive. »','« La disposition des tables n’a pas changé, donc les téléphones sont la seule cause. »'],
   corrections:['The percentage refers to respondents only, without a known response rate.','The dialogue explicitly mentions a simultaneous change in table arrangement.'],
   why:'The proposal acknowledges concern, preserves the evidence limits and provides an inclusive, reversible next action.'}
 ]
 },
 {
 id:'transfer-152',speaker:'Aïcha',anchor:'pas de trente-deux heures',
 situation:'Negotiating a proposed four-day work schedule without confusing compressed hours with shorter working time',
 counterview:'A fictional manager says: « L’augmentation de 8 % prouve que tous les services bénéficient de la réforme. » This objection is constructed, not a transcript.',
 misunderstanding:'A colleague calls a thirty-five-hour compressed week a thirty-two-hour reduction and treats volume as a complete quality measure.',
 register:'Professional and balanced workplace negotiation',
 objective:'Distinguish thirty-five compressed hours from reduced hours, respond fairly to reception staff and negotiate observable conditions with a six-week review.',
 repair:'The total contractual hours remain thirty-five; case counts omit correction quality and overtime, and Friday reception needs a negotiated rotation.',
 structure:'Il s’agit de trente-cinq heures… → pourtant… → à l’accueil… → si le bilan… → révisons…',
 decisions:[
  {kind:'fidelity',prompt:'What distinction does Aïcha make in the published workplace exchange?',
   answer:'The four-day schedule redistributes thirty-five hours, not a thirty-two-hour week.',
   distractors:['The reform reduces everyone’s working hours to thirty-two.','The company shuts reception on every Friday.'],
   corrections:['Aïcha explicitly says the contractual thirty-five hours remain.','Mélanie says reception must still provide Friday coverage.'],
   why:'The original speaker contrasts thirty-five hours redistributed with thirty-two hours, a different policy.'},
  {kind:'objection',prompt:'A manager argues that 8 % more processed cases means the trial is a complete success. Choose a careful French response.',
   answer:'« C’est encourageant, mais vérifions les heures supplémentaires, la qualité des dossiers et l’équité du roulement. »',
   distractors:['« Huit pour cent de dossiers en plus signifient huit pour cent de bien-être en plus. »','« Nous pouvons supprimer la permanence du vendredi sans consulter l’accueil. »'],
   corrections:['Throughput does not measure wellbeing, correction costs or overtime.','Reception explicitly needs Friday coverage and fair negotiation.'],
   why:'A source-grounded reply acknowledges the reported output gain while naming missing operational and equity evidence.'}
 ]
 },
 {
 id:'transfer-153',speaker:'Sofia',anchor:'sous réserve du diagnostic final',
 situation:'Defending a conditional repair-or-replace recommendation under uncertain costs, environmental claims and immediate safety needs',
 counterview:'A fictional resident claims: « Vingt-cinq pour cent d’électricité en moins prouve que l’achat neuf est toujours le meilleur choix. » This is an invented challenge.',
 misunderstanding:'A resident treats the provisional repair quote as guaranteed and a standardized efficiency difference as verified annual savings.',
 register:'Clear, respectful recommendation to an association of residents',
 objective:'Describe conditional repair costs, distinguish standardized energy claims from observed use and propose safe short-term food storage.',
 repair:'The €180 quote depends on further diagnosis; the 25 % figure is a standardized comparison, not an absolute environmental result.',
 structure:'Le devis indique… → toutefois… → en attendant… → si le diagnostic… → sinon…',
 decisions:[
  {kind:'fidelity',prompt:'What caveat does Sofia state with the 180-euro repair estimate?',
   answer:'The initial 180-euro estimate is provisional and depends on the final diagnosis.',
   distractors:['The technician has guaranteed a fixed all-inclusive price.','The manufacturer has already paid for the repair.'],
   corrections:['Sofia says the estimate remains subject to final diagnosis.','No manufacturer payment is mentioned in the original dialogue.'],
   why:'Sofia explicitly qualifies the estimate with « sous réserve du diagnostic final ».'},
  {kind:'objection',prompt:'A resident insists the 25 % efficiency claim proves a new appliance is always environmentally best. Which response is justified?',
   answer:'« Le chiffre vient d’un essai standard ; comparons notre usage réel, le coût total et la sécurité avant de décider. »',
   distractors:['« La consommation réelle de la résidence est déjà connue avec certitude. »','« Nous n’avons pas besoin de conserver les aliments pendant les quinze jours d’attente. »'],
   corrections:['The dialogue explicitly says actual local consumption is not known.','Residents still need safe storage during the spare-part delay.'],
   why:'The proposal respects both the unknown usage and immediate safety requirement rather than generalizing one promotional percentage.'}
 ]
 },
 {
 id:'transfer-154',speaker:'Hugo',anchor:'1 200 entrées en octobre',
 situation:'Explain unreliable denominators at the first fictional library consultation',
 counterview:'A fictional councillor insists that 1,200 entries means 1,200 separate residents. This is a constructed counterview, not quoted source.',
 misunderstanding:'A listener treats repeated library visits as unique residents and assumes an on-site poll reflects all absent residents.',
 register:'Measured public-consultation opening, accessible to non-specialists',
 objective:'Attribute the register and survey separately, acknowledge missing non-users and invite broader evidence before scheduling.',
 repair:'The register counts passages, while the reception survey represents respondents who could attend during existing hours.',
 structure:'Selon le registre… → toutefois… → le sondage… → avant de décider…',
 decisions:[
  {kind:'fidelity',prompt:'What does Hugo actually establish in the first library case?',
   answer:'The register shows 1,200 entries, which need not mean 1,200 different residents.',
   distractors:['Exactly 1,200 separate residents used the library.','No library entries occurred in October.'],
   corrections:['Repeat visits are possible; the register does not count unique residents.','Hugo explicitly reports 1,200 recorded passages.'],
   why:'The source distinguishes entries from people; the denominator for unique residents is unknown.'},
  {kind:'objection',prompt:'A hypothetical official says that 68% of the entire neighborhood voted for Thursday. How should a mediator respond?',
   answer:'« Selon les répondants présents à l’accueil, le jeudi semble intéressant ; consultons aussi ceux qui ne viennent pas. »',
   distractors:['« Les 68 % prouvent que la population entière a voté. »','« Les habitants absents ne peuvent pas avoir de besoins. »'],
   corrections:['The survey sample excludes many non-users and was not a neighborhood vote.','Current absence may signal access barriers, not lack of need.'],
   why:'The response attributes the sample correctly and proposes broader consultation.'}
 ]
 },
 {
 id:'transfer-155',speaker:'Claire',anchor:'aucun accord sur les heures supplémentaires n’a encore été signé',
 situation:'Mediate a consultation where families, workers and staff favor different library opening times',
 counterview:'A fictional councillor declares that possible funding means the committee must open immediately. This is an invented challenge.',
 misunderstanding:'A participant confuses tentative six-week funding with a signed staff agreement and a final council decision.',
 register:'Respectful civic mediation of unequal practical constraints',
 objective:'Answer Nora and Yanis separately, protect Claire’s working conditions and formulate a real condition for postponing the proposal.',
 repair:'The municipality has reported possible funding but paid rotations, safe staffing and late transport are not confirmed.',
 structure:'Nora demande… → Yanis souhaite… → Claire rappelle… → à condition que…',
 decisions:[
  {kind:'fidelity',prompt:'What does Claire explicitly state about the work agreement?',
   answer:'No agreement on overtime has been signed yet, despite the proposed six-week financing.',
   distractors:['The workforce has signed a permanent agreement.','The library does not require personnel on additional evenings.'],
   corrections:['Claire names an unsigned agreement, not a completed one.','The additional staffed evenings require a paid rota and safety coverage.'],
   why:'The dialogue distinguishes a potential funding statement from a signed staffing safeguard.'},
  {kind:'objection',prompt:'What is a proportionate answer to the claim that the library must open immediately?',
   answer:'« Nous pourrions essayer deux créneaux, à condition que les transports et le roulement payé soient confirmés. »',
   distractors:['« Un budget annoncé remplace tout accord de sécurité. »','« Les familles et les salariés ont exactement le même besoin. »'],
   corrections:['A tentative envelope does not replace safety and employment agreements.','Families and workers request different hours and transport arrangements.'],
   why:'The conditional proposal respects each stakeholder and does not invent an approval.'}
 ]
 },
 {
 id:'transfer-156',speaker:'Maya',anchor:'l’ouverture définitive fera l’objet d’une autre décision publique',
 situation:'Present a cumulative recommendation using the library survey, consultation and conditional resolution',
 counterview:'An invented newspaper headline announces that the six-week experiment has already proved permanent success.',
 misunderstanding:'A public speaker mistakes authorization to prepare a trial for a completed trial and a permanent opening.',
 register:'Precise public report by the chair of a municipal consultation',
 objective:'Use three stages of the dossier, state pre-launch safeguards and show how the council could revise the decision.',
 repair:'The council authorizes conditional preparation only; measures at three and six weeks have not occurred.',
 structure:'Nous avons d’abord observé… → puis consulté… → le conseil prévoit… → si les conditions…',
 decisions:[
  {kind:'fidelity',prompt:'What decision does Maya announce at the conclusion of the library dossier?',
   answer:'Only preparation for a conditional trial was authorized; permanent opening needs another public decision.',
   distractors:['The six-week trial has finished and proved success.','Every revised opening hour has already become permanent.'],
   corrections:['Maya discusses an experiment that has not yet been assessed.','The final line requires a separate future public decision.'],
   why:'The source explicitly reserves permanent opening for a later decision based on observed results.'},
  {kind:'objection',prompt:'How should a public spokesperson repair the inaccurate headline claiming proven success?',
   answer:'« Le conseil prépare un essai sous conditions ; les résultats seront examinés après trois et six semaines. »',
   distractors:['« Le sondage et les 1 200 entrées prouvent une réussite définitive. »','« Aucun indicateur ni accord préalable ne sera nécessaire. »'],
   corrections:['The initial count and nonrepresentative poll cannot prove an as-yet-unrun trial.','The resolution requires advance safety, transport and accessible-participation conditions.'],
   why:'The reformulation names the decision stage and specific review schedule without inventing results.'}
 ]
 },
 {
  id:'transfer-157',speaker:'Jeanne',anchor:'une déviation pendant les deux prochains week-ends',
  situation:'Give an accurate public correction of an incomplete viral screenshot and a conditional municipal notice',
  counterview:'An invented resident insists the screenshot proves permanent cancellation and asks why the journalist refuses to keep the viral headline.',
  misunderstanding:'A journalist treats a partial undated screenshot and a poll of worried respondents as proof that the municipality has permanently cancelled route T7.',
  register:'Measured public editorial correction that credits a reliable notice while respecting accessibility concerns',
  objective:'Distinguish the status of an unverified screenshot, a dated notice and a partial poll; correct the unsupported claim while preserving the outstanding stop-access question.',
  repair:'The dated notice concerns only a conditional two-weekend detour, not a permanently discontinued route; the replacement stop remains unverified.',
  structure:'Une capture affirme… → selon l’avis daté… → toutefois, l’accès… → nous vérifierons…',
  decisions:[
   {kind:'fidelity',
    prompt:'What change can Jeanne actually attribute to the dated official municipal notice?',
    answer:'A conditional detour over the next two weekends, with details and replacement-stop accessibility still to be confirmed.',
    distractors:['Permanent cancellation of route T7 starting Monday.','Guaranteed accessibility and a final service map that are already published.'],
    corrections:['Jeanne says only a weekend detour is envisaged under bridge-work conditions; cancellation is the unsupported screenshot claim.','Jeanne says a detailed map is planned and Élodie identifies accessibility as unverified, not guaranteed.'],
    why:'The attested original French explicitly limits the change in duration, conditions and certainty.'},
   {kind:'objection',
    prompt:'How should a journalist answer a resident who demands a correction but still fears an inaccessible detour?',
    answer:'« L’avis daté prévoit une déviation provisoire, non une suppression. Nous devons toutefois vérifier l’accès à l’arrêt de remplacement. »',
    distractors:['« Les 62 % des répondants prouvent que tous les voyageurs ont voté pour la fermeture. »','« Puisque la suppression définitive est fausse, l’arrêt provisoire est forcément accessible. »'],
    corrections:['Malik explicitly lacks the respondent denominator; fear expressed in a poll cannot authenticate a permanent municipal decision.','Élodie distinguishes the false cancellation rumor from the real outstanding question of wheelchair accessibility at the replacement stop.'],
    why:'The warranted correction attributes the published temporary plan and preserves the practical uncertainty without treating a claim about all travelers as verified.'}
  ]
 },
 {
  id:'transfer-158',speaker:'Élodie',anchor:'des barrières bloquaient cette rampe',
  situation:'Explain a new map-versus-field contradiction without confusing source status or observation time',
  counterview:'A fictional operator says the official pictogram proves the ramp is passable all weekend and therefore the eight-o’clock report should disappear.',
  misunderstanding:'A spokesperson treats the official map as a real Saturday check or extends one observed Thursday-morning barrier to every future service.',
  register:'Evidence-qualified French public travel advisory with dated independent field observations',
  objective:'Preserve the old correction, attribute two dated sources independently, and set a checkable condition for safe travel advice.',
  repair:'A map announces a ramp; Élodie actually observed barriers only at a specific morning time, and no Saturday passability check has yet been confirmed.',
  structure:'Selon le plan daté… → or, à huit heures… → cette observation ne prouve pas… → si le contrôle confirme…',
  decisions:[
   {kind:'fidelity',prompt:'What exactly does Élodie establish from her own direct observation?',
    answer:'Barriers blocked the mapped ramp at eight that morning; this does not prove Saturday or all hours would be blocked.',
    distractors:['The route operator formally cancelled T7 permanently.','Élodie checked all hours of Saturday and proved every possible detour was blocked.'],
    corrections:['Élodie reports a barrier at a stated time, not a transit-service cancellation; the earlier cancellation rumor remains unsupported.','Élodie restricts her account to one visit and explicitly avoids claiming every possible access point or future time was checked.'],
    why:'Her attested French line gives a precise time and location, allowing only a bounded field-evidence conclusion.'},
   {kind:'objection',prompt:'An official waves the new map and promises that the ramp will be safe on Saturday. Which answer is warranted?',
    answer:'« Le plan annonce une rampe; un relevé à huit heures constate des barrières. Demandons une vérification sur place avant samedi. »',
    distractors:['« Un pictogramme officiel remplace nécessairement toutes les visites sur le terrain. »','« La rampe était bloquée une fois; elle sera donc fermée définitivement. »'],
    corrections:['A dated map documents the intended route but is not direct evidence of its actual passability under construction conditions.','One observed barrier cannot establish a permanent or all-week closure, and it does not restore the disproved T7 cancellation rumor.'],
    why:'The reply attributes conflicting evidence and calls for a date-specific field check rather than inventing certainty.'}
  ]
 },
 {
  id:'transfer-159',speaker:'Malik',anchor:'je conserve l’heure de notre ancien constat',
  situation:'Publicly explain why a previously accurate warning must be revised after newer independently checked facts',
  counterview:'An invented reader accuses the newsroom of lying because Thursday’s blocked-ramp alert and Friday’s cleared-ramp update are different.',
  misunderstanding:'The audience assumes that a corrected present-tense warning erases the historic Thursday observation or that Friday’s clear ramp proves all weekend booking and nighttime travel fully accessible.',
  register:'Accountable French editorial correction with precise date, attribution and inclusion safeguards',
  objective:'Give the Thursday–Friday chronology, defend correction without erasure and identify the still exclusive phone-only booking and untested night service.',
  repair:'Thursday at eight the ramp was observed blocked; Friday at 17:30 the ramp was independently observed clear. The booking and nighttime access restrictions remain unverified.',
  structure:'Nous avions constaté… → vendredi, nous avons vérifié… → néanmoins, la réservation… → nous actualiserons si…',
  decisions:[
   {kind:'fidelity',prompt:'What does Malik say he will do with the previous ramp observation after Friday’s new evidence?',
    answer:'Correct the present-tense alert while retaining the time of the earlier observation and awaiting Saturday checks.',
    distractors:['Delete the Thursday observation and tell readers the original evidence was fabricated.','Announce that all weekend departures have already been verified safe and accessible.'],
    corrections:['Malik explicitly preserves the timestamp of the Thursday report because a later change does not falsify an earlier observed state.','Malik promises verification after Saturday; no nighttime or shuttle-use test has been completed in the dialogue.'],
    why:'His attested final French statement explicitly separates the historical report, present update and future check.'},
   {kind:'objection',prompt:'How should an editor address both the accusation of inconsistency and exclusion by phone-only booking?',
    answer:'« Le jeudi, la rampe était bloquée; vendredi, elle était dégagée. Pourtant, la réservation par téléphone et l’accès de nuit restent à vérifier. »',
    distractors:['« Le nouveau bulletin prouve que notre relevé de jeudi était mensonger. »','« Puisque la rampe est dégagée, tout voyageur pourra automatiquement réserver la navette samedi. »'],
    corrections:['The two observations concern different times; the earlier finding can remain valid while a present-tense warning needs updating.','An observed clear ramp does not establish a usable phone-booking process for everyone or a tested night-service route.'],
    why:'The corrected statement preserves chronology, the confirmed physical improvement and the unresolved inclusive-access constraints.'}
  ]
 }
 ,
 {
  id:'transfer-160',speaker:'Camille',anchor:'je me suis sentie mise à l’écart',
  situation:'Explain a missed shared event and emotional injury without assigning unverified personal motives',
  counterview:'A fictional friend argues that expressing hurt necessarily requires accusing Samir of deliberate cruelty or demanding all his private reasons.',
  misunderstanding:'A listener treats Camille’s first-person feeling as proof of Samir’s intention and mistakes her unsent draft for a message Samir received.',
  register:'Respectful French first-person vulnerability with specific requests, interpersonal boundaries and no forced forgiveness',
  objective:'Distinguish what happened, what was inferred and what was felt; acknowledge harm without demanding an intimate explanation.',
  repair:'Camille felt excluded when she welcomed guests alone; she cannot know whether Samir intended to reject her, and she can request a brief future notice while respecting his privacy.',
  structure:'Quand je suis arrivée… → je me suis sentie… → je ne sais pas pourquoi… → j’aurais aimé que tu…',
  decisions:[
   {kind:'fidelity',
    prompt:'What exactly can Camille claim without pretending to know Samir’s motives?',
    answer:'She arrived alone, felt excluded and can request an advance message; this does not prove he intended to hurt her.',
    distractors:['Her painful feeling proves that Samir deliberately wanted her to suffer.','The unsent accusation proves Samir read and agreed with her interpretation.'],
    corrections:['Camille explicitly says her feeling does not establish that Samir intended to avoid her; she knows the impact, not his hidden motives.','The original account says she drafted but did not send the accusation; private writing cannot be treated as received correspondence.'],
    why:'The exact original turn distinguishes emotional impact from inferred intention while making a practical request possible.'},
   {kind:'objection',
    prompt:'How should a friend express hurt while respecting Samir’s right not to disclose private circumstances?',
    answer:'« Je me suis sentie seule et j’aurais aimé que tu me préviennes; tu n’es pas obligé de raconter ta situation personnelle. »',
    distractors:['« Si tu ne racontes pas tous tes problèmes, je sais que tu me méprises. »','« Puisque tu avais besoin de recul, mon sentiment n’a aucune importance. »'],
    corrections:['Demanding intimate details assigns motives and violates a clearly stated boundary; neither friendship nor a missed event authorizes forced disclosure.','The private boundary does not erase Camille’s experienced hurt or the useful request for practical advance notice.'],
    why:'The original conversation combines a first-person impact statement with a bounded request, leaving both people autonomous.'}
  ]
 },
 {
  id:'transfer-161',speaker:'Samir',anchor:'Je suis d’accord pour cette tâche',
  situation:'Retell a past misunderstanding with genuine counterfactual regret and propose strictly limited voluntary cooperation',
  counterview:'A fictional visitor insists that agreeing to a Thursday proofreading task proves full forgiveness and permission to publish everyone’s personal reasons.',
  misunderstanding:'A listener confuses a limited agreement to proofread photo captions with restored trust, unconditional attendance and consent to share private conversation.',
  register:'Nuanced B2 retrospective narrative and careful interpersonal agreement respecting free consent',
  objective:'Use counterfactual past without blame, identify exactly what was agreed, protect privacy and leave later contact voluntary.',
  repair:'Samir offers Thursday proofreading only, Camille arranges a confirmed alternative for welcoming guests, and their private conversation and future trust remain outside the agreement.',
  structure:'Si j’avais… j’aurais peut-être… → aujourd’hui, je peux… → je préfère ne pas… → nous pourrons faire le point si…',
  decisions:[
   {kind:'fidelity',
    prompt:'What is Samir’s explicit agreement at the end of the conversation?',
    answer:'He agrees to the specific proofreading task and asks that their personal conversation and his reasons remain private.',
    distractors:['He guarantees he will attend all future exhibition openings.','He authorizes Camille to publish every personal detail from their exchange.'],
    corrections:['Samir says he cannot promise attendance; the agreed task is limited to sending photo-caption corrections by Thursday.','Samir explicitly requests confidentiality and does not grant permission to publish the reasons for his earlier absence.'],
    why:'The original French dialogue names a narrow accepted task and an independent privacy boundary.'},
   {kind:'objection',
    prompt:'How should a narrator answer someone who treats the limited task as proof that all trust has returned?',
    answer:'« Même s’ils ont accepté une relecture avant jeudi, ils n’ont pas déclaré leur confiance rétablie ni autorisé la diffusion de détails privés. »',
    distractors:['« Un seul accord pratique oblige les amis à se pardonner entièrement. »','« Puisque Samir ne révèle pas ses raisons, leur accord de relecture est impossible. »'],
    corrections:['The original Nour turn rejects the inference of fully restored trust; optional cooperation is not forced intimacy or complete forgiveness.','The task is explicitly accepted without requiring disclosure of reasons; a personal limit does not make all cooperation impossible.'],
    why:'The accepted scope and future optional review are the only warranted conclusions; interpersonal repair is not a scored outcome.'}
  ]
 },
 {
  id:'transfer-162',speaker:'Maëlle',anchor:'C’est le total de l’équipe sur deux semaines',
  situation:'Present a verifiable professional project in a formal interview and respond to precise questions about personal role, career gaps and realistic commitments',
  counterview:'An invented interviewer insists that the eighty processed files prove Maëlle personally doubled the team’s efficiency and should promise zero errors.',
  misunderstanding:'A recruiter equates collective output with the candidate’s individual work and reads a short private career interruption as proof she must disclose every detail.',
  register:'Formal, precise French job-interview speech: competent without exaggeration, respectful without evasive claims',
  objective:'Narrate context, own action and observable collective result, respond to a challenge about unsupported impact and clarify reciprocal role expectations.',
  repair:'Maëlle authored the guide, colleagues checked the files and the eighty dossiers are a two-week team total, not personal output or measured improvement.',
  structure:'Le contexte était… → j’ai personnellement rédigé… → notre équipe a traité… → cependant, cela ne mesure pas… → pourriez-vous préciser…',
  decisions:[
   {kind:'fidelity',
    prompt:'When Madame Roussel challenges the eighty-file result, what is Maëlle actually able to claim?',
    answer:'She authored the guide and checklist; the team, not Maëlle alone, processed eighty files over two weeks without a measured causal productivity gain.',
    distractors:['Maëlle personally checked all eighty documents and proved her guide doubled productivity.','An interview question about the numbers means that no team work happened at all.'],
    corrections:['Maëlle explicitly says eighty files is a collective two-week total and that she cannot attribute them all to her own effort or prove the entire gain.','The documented group total is real in the fictional portfolio; being unable to assign the entire result individually does not make it nonexistent.'],
    why:'The original fourth French dialogue turn states the agent, window and explicit limits of causal inference.'},
   {kind:'objection',
    prompt:'The interviewer asks for a guaranteed error-free start and intimate reasons for a gap. Which professional response is supportable?',
    answer:'« Je préfère garder ces raisons privées; je peux expliquer mes projets récents et demander qui valide les résultats avant de promettre un délai. »',
    distractors:['« Je garantis zéro erreur dès demain et mon guide a déjà prouvé le doublement de nos résultats. »','« Pour être crédible, je dois révéler toute ma situation personnelle et ne poser aucune question sur le poste. »'],
    corrections:['An absolute zero-error promise and a proven doubling are absent from the original portfolio and employer brief; Maëlle instead proposes a test and approval check.','Her dialogue clearly gives a bounded privacy answer while citing recent deadlines; a formal role clarification is appropriate, not evidence of incompetence.'],
    why:'A realistic interview answer respects professional privacy, accurate team contribution and the still unconfirmed validation expectations.'}
  ]
 },
 {
  id:'transfer-163',speaker:'Maëlle',anchor:'Si j’ai bien compris, je transmets les six fiches',
  situation:'Respond to specific constructive feedback and give an exact status-sensitive handover rather than blaming colleagues or overclaiming completion',
  counterview:'An invented colleague says the six internally checked records mean all eight are approved and should be published publicly without another decision.',
  misunderstanding:'A project member treats a provisional internal transfer as final publication and assumes a version-control error justifies personal blame rather than an accurate correction.',
  register:'Tactful formal French meeting summary with precise status verbs, deadlines and approval boundaries',
  objective:'Own the missing version check, fairly attribute an ambiguous instruction, and distinguish reviewed, pending and approved work using a polite reformulation.',
  repair:'Only six records can go to internal review; two uncertain records remain pending, and Madame Roussel has not approved any public publication.',
  structure:'Vous avez raison sur… → si j’ai bien compris… → six fiches sont… → deux restent… → pourriez-vous confirmer qui valide…',
  decisions:[
   {kind:'fidelity',
    prompt:'What does Maëlle say she has understood about the immediate deliverable?',
    answer:'Send six checked records for provisional internal review, hold two uncertain records and request Madame Roussel’s approval before any public publication.',
    distractors:['Immediately publish all eight records because the spreadsheet was sent to colleagues.','Treat the two uncertain codes as resolved without verifying their reference version.'],
    corrections:['Maëlle explicitly marks the six-file transmission provisional and asks for approval before publication; the manager has prohibited immediate public release.','The two remaining files still contain uncertain codes and cannot be counted as verified or published in the agreed handover.'],
    why:'The original French eighth turn restates the actual scope and approval gate before the manager confirms the interpretation.'},
   {kind:'objection',
    prompt:'How can Maëlle disagree when another colleague says internal review is the same as published, completed work?',
    answer:'« Six fiches ont été transmises pour contrôle interne, mais deux restent en attente et Madame Roussel doit encore autoriser toute publication. »',
    distractors:['« Le contrôle interne prouve que huit fiches ont déjà été validées et publiées. »','« Ilyès est seul responsable de toutes les erreurs; aucun autre détail n’est nécessaire. »'],
    corrections:['Internal review is not a public authorization; the six and two records have distinct statuses stated in the confirmed meeting recap.','Maëlle owns the old-version reuse and Ilyès owns an ambiguous instruction; blame does not resolve reference version, status or final approval.'],
    why:'The sourced professional answer differentiates verified, pending, transmitted and authorized work without personal condemnation.'}
  ]
 }
 ,
 {
  id:'transfer-164',speaker:'Inès',anchor:'Il était presque vingt heures',
  situation:'Perform a new vivid anecdote rather than deliver a civic briefing: orient the audience, build suspense, sequence a rain interruption and finish on the child’s impossible request',
  counterview:'An invented workshop listener argues that every sentence should use passé composé and the storyteller should announce the ending in the first line.',
  misunderstanding:'A listener treats Thomas’s earlier preparation as something that happened after the downpour, and assumes the covered arcade had been reserved before the outdoor event.',
  register:'Animated but precise spoken French storytelling with an atmospheric opening, tense contrasts and an earned punchline',
  objective:'Use imparfait for background, plus-que-parfait for earlier planning and passé composé for the decisive rain and relocation, without asserting the entire group was immediately safe.',
  repair:'Thomas had already prepared a backup; the unexpected rain interrupted the outdoor reading, and Lila checked the arcade before the group moved into it.',
  structure:'Il était presque… → nous avions préparé… → soudain… → pendant que… → après une pause…',
  decisions:[
   {kind:'fidelity',
    prompt:'Which original narrative sequence follows from Inès’s opening and the later dialogue?',
    answer:'Outdoor preparations were underway; the sudden rain interrupted the reading, and only afterward did Lila identify an available covered arcade.',
    distractors:['The reading had always been booked inside the arcade, and the downpour happened after the comic ending.','Everyone ran into a preapproved venue before anyone checked whether the group could enter.'],
    corrections:['The opening describes the outdoor square and prior plans; the arcade is identified only during the unexpected rain and cannot be treated as a prearranged venue.','Inès explicitly says the group did not yet know whether everyone could enter, so Lila checked first and only the first chairs were moved.'],
    why:'The French opening is background description in imparfait, and later source turns establish the bounded disruption and conditional relocation.'},
   {kind:'objection',
    prompt:'A listener says the ending should declare « tout le monde était parfaitement heureux » before the child speaks. What is a better spoken ending?',
    answer:'« Les gouttes résonnaient sur les vitres… puis un enfant a demandé si nous pouvions commander la pluie pour la prochaine lecture. »',
    distractors:['« Nous avions officiellement réservé le passage depuis des mois, donc rien d’imprévu ne s’est produit. »','« Tous les participants ont immédiatement été heureux, comme le prouve la météo. »'],
    corrections:['The arcade was not a reserved fallback in the narrated scene; inventing it would destroy both chronology and the original improvisation.','One child’s humorous request does not prove universal happiness, and explaining the punchline before it arrives reduces its effect.'],
    why:'A delayed comic line emerges from the described atmosphere; the narrator should not erase the original uncertainty or add an unsupported collective emotion.'}
  ]
 },
 {
  id:'transfer-165',speaker:'Aya',anchor:'Quelle chance, il ne manquait que le pain !',
  situation:'Tell a humorous everyday dinner anecdote with an interpreted antiphrase, a tactful repair and a final callback to the ambiguous invitation',
  counterview:'An invented guest says Farah deserves to be mocked for understanding « il ne manquait que le pain » literally and that a good joke must never be explained.',
  misunderstanding:'An audience member treats the utterance as a factual shortage of bread and wrongly thinks Aya’s joke is aimed at Farah rather than her own vague message.',
  register:'Playful, inclusive conversational French with credible nonverbal textual cues and precise non-literal interpretation',
  objective:'Build repetition, make the bread abundance visible, give the irony a comprehensible context and demonstrate explicit polite repair if someone initially misunderstands.',
  repair:'The meal had plenty of bread; Aya says the opposite for comic effect and states that her own unspecified invitation, not Farah, is the target.',
  structure:'J’avais écrit… → le premier panier… → puis le quatrième… → quelle chance… → je plaisantais sur ma consigne…',
  decisions:[
   {kind:'fidelity',
    prompt:'In the original dialogue, what is the intended meaning of Aya’s solemn statement about missing bread?',
    answer:'It is an antiphrase: the table overflows with bread, so Aya jokingly says the opposite while mocking her own vague invitation.',
    distractors:['It is literal evidence that no bread was brought to the dinner.','It is a direct insult proving Farah deliberately ignored the invitation.'],
    corrections:['Aya has just looked at baguettes, round loaves and rolls; the literal lack-of-bread claim visibly contradicts the scene.','Farah brought walnut bread in good faith, and Aya explicitly says the joke is about her own unclear invitation, not Farah.'],
    why:'The original fourth French turn contains the antiphrase and the preceding dialogue supplies the visually contradictory context.'},
   {kind:'objection',
    prompt:'How should Aya respond if Farah initially takes the ironic line literally?',
    answer:'« Je me moquais surtout de mon invitation trop vague, pas de ton panier. Je peux le dire plus clairement. »',
    distractors:['« Tu devrais avoir honte de ne pas comprendre mon humour; je ne dois jamais expliquer une blague. »','« Non, la table ne contient aucun pain et tu as imaginé tous ces paniers. »'],
    corrections:['Source-supported, inclusive humour targets the sender’s imprecise invitation; blaming a listener with incomplete context is the opposite of the original repair.','The dialogue and scene establish excess bread; denying it would contradict the source rather than make the non-literal meaning accessible.'],
    why:'The original invitation is underspecified and Aya’s French line explicitly offers a tactful clarification rather than humiliating Farah.'}
  ]
 }
];
function normalize(text:string):string{
 return text.normalize('NFC').replace(/[‘’]/g,"'").toLocaleLowerCase('fr').trim().replace(/\s+/g,' ');
}
function same(a:string,b:string):boolean{return normalize(a)===normalize(b);}
function stableChoices(id:string,answer:string,distractors:readonly string[]):readonly string[]{
 const all=[...new Set([answer,...distractors])];
 const offset=[...id].reduce((s,c)=>s+c.charCodeAt(0),0)%all.length;
 return Object.freeze([...all.slice(offset),...all.slice(0,offset)]);
}
export function evaluateU31Decision(decision:U31Decision,choice:string):{
 readonly supported:boolean;readonly feedback:string
}{
 if(same(decision.answer,choice))return{supported:true,feedback:decision.explanation};
 const error=Object.entries(decision.wrong).find(([option])=>same(option,choice))?.[1];
 return{supported:false,feedback:(error??'This response is not the authored source-backed choice.')+' '+decision.explanation};
}
const PHASES:readonly {id:U31Stage;title:string;criterion:string}[]=[
 {id:'position',title:'Establish your position',criterion:'State the core original claim accurately without making up evidence.'},
 {id:'respond',title:'Respond independently',criterion:'Address another person in an appropriate register, with a coherent answer.'},
 {id:'challenge',title:'Answer a fair objection',criterion:'Acknowledge the other perspective before offering supported reasons.'},
 {id:'repair',title:'Repair the misunderstanding',criterion:'Identify the exact mistaken inference and correct it without repeating the error.'},
 {id:'justify',title:'Explain source evidence',criterion:'Attribute an original French line to the right speaker; separate published facts from proposals.'},
 {id:'sustain',title:'Sustain an extended explanation',criterion:'Produce an organized multi-sentence response, including a limitation and a next step.'},
 {id:'transfer',title:'Reconstruct without prompts',criterion:'Speak independently, then compare your version with source and draft a concise written summary.'}
];
export function originalU31OralJourney(id:string):U31Journey|null{
 const material=getOriginalMaterial(id),entry=getOriginalCatalogEntry(id);
 if(!material||!entry||!entry.listening||material.unit.dialogue.length<2)return null;
 const dialogue=material.unit.dialogue;
 const design=AUTHORED.find(x=>x.id===id&&dialogue.some(t=>t.speaker===x.speaker&&normalize(t.fr).includes(normalize(x.anchor))));
 const sourceTurn=design?dialogue.findIndex(x=>x.speaker===design.speaker&&normalize(x.fr).includes(normalize(design.anchor))):0;
 const speakerNames=[...new Set(dialogue.map(t=>t.speaker))];
 const first=dialogue[0],last=dialogue[dialogue.length-1];
 const context=design?.situation??'Continue the original conversation and explain the reasons and limits of its outcome';
 const counterview=design?.counterview??
  'A conversational partner challenges your proposed conclusion and asks what in the original dialogue supports it. This challenge is hypothetical.';
 const misunderstanding=design?.misunderstanding??
  'A partner mistakenly claims every original statement was a confirmed decision. Correct any uncertainty only where the published wording supports it.';
 const register=design?.register??(entry.level==='A1'||entry.level==='A2'?'Clear and polite everyday French':'Respectful, evidence-aware discussion');
 const objective=design?.objective??
  'Summarize the original situation, reply to one participant, answer a counterargument and explain the source-supported limits.';
 const repair=design?.repair??
  'Use « Si je comprends bien… » or « Je voulais dire… » to clarify only what the original turns explicitly establish.';
 const plan=design?.structure??'Présenter le contexte → citer un propos → répondre → nuancer → proposer une suite.';
 const phases=PHASES.map(({id:phase,title,criterion})=>{
  const source=phase==='repair'?dialogue[sourceTurn]:phase==='justify'?last:first;
  const instructions:Record<U31Stage,string>={
   position:'In French, restate the situation and your source-bounded position. '+context+'. Keep the claim proportionate to the evidence.',
   respond:'Speak to '+(dialogue[sourceTurn]?.speaker??first.speaker)+'. '+objective+' Use natural interaction and do not read the published dialogue as your own answer.',
   challenge:'Reply in French to this invented objection: '+counterview+' Acknowledge its legitimate concern; then argue from the original source.',
   repair:'Your partner misunderstands: '+misunderstanding+' Politely correct the exact misconception without adding unsupported claims.',
   justify:'Justify your explanation with the attributed original turn below. Distinguish exact dialogue content, your own inference and any independent written documents.',
   sustain:'Give a sustained oral response: opening, source-backed explanation, counterpoint, precise correction, proposed next step and closing. '+plan,
   transfer:'Close the transcript. Deliver a new explanation from memory, then write a short French source-qualified summary or open the original reading/writing activity.'
  };
  const hints:Record<U31Stage,string>={
   position:'Start with « Dans le dialogue… », then state what is explicitly established.',
   respond:'Use an acknowledgment, then a connected sentence with « parce que ».',
   challenge:'Try « Je comprends cette objection. Cependant… »; avoid dismissing the other person.',
   repair:'Begin « Pour préciser… »; contrast what was said with what is not known.',
   justify:'Say « Selon '+source.speaker+'… ». Quote only what actually appears in the French source.',
   sustain:'Sequence: situation → claim → evidence → objection → correction → next step.',
   transfer:'Produce your answer before checking the transcript or earlier notes.'
  };
  const checks=[
   criterion,
   'Preserve the original speaker, negation, uncertainty and any condition.',
   'Distinguish an invented role-play objection from a historical French source.',
   ...(phase==='sustain'||phase==='transfer'?['Provide a coherent opening, transitions and closing across several connected sentences.']:[])
  ];
  return Object.freeze({
   id:phase,title,task:instructions[phase],target:phase==='challenge'?counterview:phase==='repair'?misunderstanding:objective,
   hint:hints[phase],repair,criteria:Object.freeze(checks),
   sourceTurn:phase==='justify'?dialogue.length-1:sourceTurn
  });
 });
 const decisions:U31Decision[]=[];
 if(design){
  design.decisions.forEach((item,i)=>{
   const idKey='u31:'+id+':authored-'+(i+1),wrong=Object.fromEntries(item.distractors.map((x,j)=>[x,item.corrections[j]]));
   decisions.push(Object.freeze({
    id:idKey,kind:item.kind,prompt:item.prompt,answer:item.answer,
    choices:stableChoices(idKey,item.answer,item.distractors),
    explanation:item.why,wrong,citedTurn:sourceTurn,evidence:dialogue[sourceTurn].fr
   }));
  });
 }
 // A source-grounded attribution check for ALL historical original lessons;
 // never synthetic "what would the speaker say" as a formally keyed answer.
 const distinct=dialogue.map((t,i)=>({t,i})).filter(x=>x.t.fr!==first.fr).slice(0,3).map(x=>x.t.fr);
 if(distinct.length>=2){
  const idKey='u31:'+id+':original-turn';
  decisions.push(Object.freeze({
   id:idKey,kind:'evidence',prompt:'Which line is actually the opening utterance of this original dialogue?',
   answer:first.fr,choices:stableChoices(idKey,first.fr,distinct),
   explanation:'Turn 1 belongs to '+first.speaker+' in the historically published source. Use attributed evidence, not plausible invented speech.',
   wrong:Object.fromEntries(distinct.map(x=>[x,'This line is from a different turn in the original conversation.'])),
   citedTurn:0,evidence:first.fr
  }));
 }
 // Canonical linked U30 interpretation remains accessible without duplicating
 // the existing engine or its responses.
 const u30=originalU30Listening(id);

 const witness=originalVocabularyForUnit(id).filter(word=>
  originalVocabularyWitnesses(word).some(w=>w.source==='original-dialogue'))
  .slice(0,3).map(word=>({french:word.french,english:word.english,
   originalContext:originalVocabularyWitnesses(word).find(w=>w.source==='original-dialogue')!.french}));
 const documents=(material.evidence?.sources??[]).map(s=>({label:s.label,type:s.type,french:s.french}));
 // Keep this a source label, not a listening or recording claim.
 const reading=material.reading?{title:material.reading.title,text:material.reading.french}:null;
 return Object.freeze({
  lessonId:id,title:entry.title,level:entry.level,qualifiedId:entry.qualifiedId,
  sourceRevision:entry.sourceRevision,speakerNames:Object.freeze(speakerNames),dialogue,
  reading,documents:Object.freeze(documents),oral:material.oral,
  writingChoices:material.writingChoices,
  lexicalWitnesses:Object.freeze(witness),
  scenarioTitle:context,u30DecisionCount:u30?.decisions.length??0,counterview,misunderstanding,desiredRegister:register,
  stages:Object.freeze(phases),decisions:Object.freeze(decisions),curated:!!design
 });
}
/** Model integrity is voluntary and independent of learner assessment. */
export function validateU31SourceAnchors():readonly string[]{
 return AUTHORED.filter(design=>{
  const material=getOriginalMaterial(design.id);
  return !material?.unit.dialogue.some(t=>t.speaker===design.speaker&&normalize(t.fr).includes(normalize(design.anchor)));
 }).map(design=>'Unresolved historical original dialogue anchor: '+design.id+' / '+design.speaker);
}
export const U31_CURATED_JOURNEYS=Object.freeze(AUTHORED.map(x=>x.id));
