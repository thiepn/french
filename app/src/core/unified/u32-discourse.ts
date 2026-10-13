import {
 getOriginalCatalogEntry,getOriginalMaterial,type OriginalLevel
} from './u23-registry.ts';
import {originalU31OralJourney} from './u31-oral.ts';
import {originalIntegratedReading} from './u29-reading.ts';

/**
 * Source witnesses always point to original U23 material. Local U32 locators
 * are display-only and are never written as canonical source or learner IDs.
 */
export type U32SourceKind='dialogue'|'reading'|'document';
export type U32Move='frame'|'contrast'|'object'|'repair'|'justify'|'reframe'|'synthesize';
export interface U32Witness{
 readonly locator:string;readonly kind:U32SourceKind;readonly label:string;
 readonly french:string;readonly explanation?:string;readonly index:number;
 readonly qualifiedSourceId:string;readonly sourceRevision:string;
}
export interface U32Turn{
 readonly id:string;readonly move:U32Move;readonly setting:string;
 readonly partner:string;readonly partnerSays:string;readonly task:string;
 readonly intendedRegister:string;readonly safeguard:string;
 readonly scaffold:string;readonly independentTarget:string;
 readonly witnessLocators:readonly string[];
 readonly illustrativeReply?:string;
}
export interface U32Decision{
 readonly id:string;readonly type:'scope'|'attribution'|'register'|'comparison';
 readonly prompt:string;readonly answer:string;readonly choices:readonly string[];
 readonly explanation:string;readonly misconception:Readonly<Record<string,string>>;
 readonly relevantLocators:readonly string[];
 readonly sourceQualifiedId:string;
}
export interface U32Journey{
 readonly lessonId:string;readonly title:string;readonly level:OriginalLevel;
 readonly qualifiedId:string;readonly sourceRevision:string;
 readonly caseTitle:string;readonly caseDescription:string;
 readonly originalUnits:readonly string[];
 readonly witnesses:readonly U32Witness[];
 readonly turns:readonly U32Turn[];
 readonly decisions:readonly U32Decision[];
 readonly curated:boolean;readonly sourceComparisonAvailable:boolean;
 readonly nativeReadingCount:number;
}
type Case={
 id:string; anchor:string;speaker:string;title:string;description:string;
 settings:readonly [string,string,string];
 // Four fictional partner provocations. These are original *practice prompts*,
 // never attributed to original French participants.
 reactions:readonly [string,string,string,string];
 instructions:readonly [string,string,string,string];
 repair:string;scope:string;register:string;quote:string;
 wrongScope:readonly [string,string];wrongRegister:readonly [string,string];
 repairs:readonly [string,string,string,string];
 model:readonly [string,string,string,string];
};
const CASES:readonly Case[]=[
 {
 id:'a1-01',speaker:'Malik',anchor:'Très bien, merci. Et toi ?',
 title:'A greeting with a respectful boundary',
 description:'Move from a friendly check-in to a courteous new acquaintance without turning a reciprocal question into an interrogation.',
 settings:['Two friends','A new acquaintance','Short spoken recap'],
 reactions:['Salut ! Ça va ?','Excusez-moi, vous demandez mon métier ?','Je préfère ne pas donner mon nom.','Alors, de quoi parlait le dialogue ?'],
 instructions:['Answer and return the greeting question in French.','Repair the confusion about « Et toi ? » without changing its meaning.','Respect the boundary and close courteously.','Explain who asks whom and summarize in four short linked sentences.'],
 repair:'« Je demandais simplement comment vous allez. »',
 scope:'« Et toi ? » repeats the wellbeing question after Malik says he is fine.',
 register:'« Bonjour. Comment allez-vous ? »',
 quote:'Use the greeting turn and identify which speaker asks the reciprocal question.',
 wrongScope:['Malik asks Inès to state her job.','The exchange ends before Malik replies.'],
 wrongRegister:['« Hé, toi, donne-moi ton métier ! »','« Salut, madame la directrice, dis-moi tout ! »'],
 repairs:['No profession is asked in Malik’s original turn.','Malik replies and continues the conversation.','An intrusive imperative is wrong for a polite introduction.','Mixing casual commands into a formal greeting undermines the stated setting.'],
 model:['« Ça va bien, merci. Et toi ? »','« Je demande simplement comment tu vas. »','« Je comprends. À bientôt ! »','« Inès et Malik se saluent. Malik va bien et demande comment va Inès. Ils terminent leur échange. »']
 },
 {
 id:'a1-02',speaker:'Aya',anchor:'Oui, nous sommes tous étudiants.',
 title:'Correcting who belongs to the group',
 description:'Explain a group identity, clarify plural pronouns and adjust formality without inventing who else is enrolled.',
 settings:['Two fellow students','University reception','A short class presentation'],
 reactions:['Tu es étudiante ?','Vous parlez de vous uniquement ?','Donc personne d’autre n’est étudiant ?','Présentez le groupe en quatre phrases.'],
 instructions:['Give a brief accurate response from the dialogue.','Clarify « nous » versus « je » courteously.','Explain that « tous » applies to the mentioned group.','Deliver a clear short presentation distinguishing speaker and group.'],
 repair:'« Non, je parle de notre groupe, pas seulement de moi. »',
 scope:'Aya’s « nous sommes tous étudiants » refers to a group, not Aya alone.',
 register:'« Bonjour, nous sommes étudiants à Paris. »',
 quote:'Use Aya’s exact plural statement and do not invent enrollment numbers.',
 wrongScope:['Aya says she alone is a student.','Aya says all of Paris is made of students.'],
 wrongRegister:['« Hé, toi, nous étudiant ! »','« Fermez la porte, étudiants ! »'],
 repairs:['« Nous » is explicitly plural.','The group is not the whole city.','This form is ungrammatical and brusque.','An order is not a group introduction.'],
 model:['« Oui, je suis étudiante à Paris. »','« Non, nous parlons de plusieurs étudiants. »','« Nous sommes tous étudiants dans ce groupe. »','« Aya est étudiante à Paris. Elle parle aussi de ses amis. Ils sont tous étudiants. »']
 },
 {
 id:'a2-01',speaker:'Émile',anchor:'je n’ai pas fini le film : j’ai dormi',
 title:'Retelling events without reversing negation',
 description:'Distinguish a past action, an unfinished film and a new situation where another speaker mistakenly assumes completion.',
 settings:['Chat after a film night','Polite explanation to a classmate','One-minute recount'],
 reactions:['Tu as aimé le film ?','Tu l’as donc regardé jusqu’à la fin ?','Pourquoi tu n’as pas terminé ?','Racontez les faits dans un ordre logique.'],
 instructions:['Report what happened using passé composé.','Correct the false completion politely.','Give the attested cause instead of inventing another.','Link four or more past actions and include the original negation.'],
 repair:'« En fait, je ne l’ai pas terminé, parce que je me suis endormi. »',
 scope:'Émile did not finish the film because he fell asleep.',
 register:'« Je n’ai pas terminé le film ; je me suis endormi. »',
 quote:'Maintain « ne … pas fini » and the reason « j’ai dormi ».',
 wrongScope:['Émile watched the whole film.','Émile deliberately chose not to start any film.'],
 wrongRegister:['« J’ai complètement fini le film. »','« Ça ne vous regarde pas, tais-toi ! »'],
 repairs:['The original completion is explicitly negated.','He started the film; no deliberate refusal is attested.','This reverses the source fact.','Hostile wording is inappropriate to a simple classmate’s question.'],
 model:['« J’ai préparé le dîner, puis j’ai regardé un film. »','« Non, je ne l’ai pas fini. »','« J’ai dormi, donc je n’ai pas vu la fin. »','« Hier soir, Émile a préparé le dîner. Il a regardé un film, mais il ne l’a pas fini. Il s’est endormi. »']
 },
 {
 id:'a2-15',speaker:'Romain',anchor:'Le premier est plus grand, mais il est aussi plus cher.',
 title:'Negotiating housing priorities',
 description:'Respond to a fair size objection, compare real published trade-offs, and adapt from peer chat to a courteous housing inquiry.',
 settings:['Flatmates comparing homes','Polite housing-adviser meeting','Decision presentation'],
 reactions:['Le premier est plus grand !','La taille suffit à décider, non ?','Le deuxième est-il moins cher et plus proche ?','Résumez deux avantages et une limite avant de conseiller.'],
 instructions:['Explain the first apartment’s advantage and drawback.','Acknowledge the value of extra space but add other factors.','Avoid inventing an exact price for the second flat; the relative cost is described.','Give a conditional recommendation tied to stated priorities.'],
 repair:'« Le premier est plus grand, mais aussi plus cher ; le deuxième est plus près de la gare. »',
 scope:'The first flat is larger and more expensive; the second is nearer the station.',
 register:'« Pourriez-vous préciser le prix du deuxième appartement ? »',
 quote:'Cite both Romain’s original cost statement and the later proximity claim.',
 wrongScope:['Both apartments cost exactly the same.','The first apartment is nearest the station.'],
 wrongRegister:['« Donne-moi le prix, vite ! »','« J’ordonne de choisir le premier. »'],
 repairs:['Romain explicitly describes the first flat as more expensive; the prices cannot be exactly the same.','The second is described as closer to the station.','Abrupt imperative is not suited to an adviser.','A one-sided command bypasses the decision criteria.'],
 model:['« Le premier est plus grand, mais il est plus cher. »','« C’est vrai, mais le prix est important aussi. »','« Le deuxième est plus près de la gare ; je vérifierais les prix exacts. »','« Si nous privilégions le trajet, le deuxième semble intéressant. En revanche, si nous voulons de l’espace, le premier a un avantage. »']
 },
 {
 id:'a2-17',speaker:'Cliente',anchor:'Pourriez-vous confirmer le nouveau prix ?',
 title:'Reservation repair across registers',
 description:'Adapt a polite reservation change to an additional misunderstanding without inventing a completed booking.',
 settings:['At hotel reception','Formal phone call','Clear follow-up explanation'],
 reactions:['Bonjour, que souhaitez-vous modifier ?','Vous voulez finalement mercredi ?','Je peux confirmer seulement la disponibilité, pas encore le prix.','Expliquez la demande et les points encore à vérifier.'],
 instructions:['Request a Thursday change courteously.','Correct the repeated Wednesday date with clear contrast.','Acknowledge the limitation and ask a narrower confirmation question.','Summarize the date change and unresolved price without declaring payment completed.'],
 repair:'« Je voudrais jeudi au lieu de mercredi. Pourriez-vous vérifier la date ? »',
 scope:'The customer asks to come on Thursday rather than Wednesday and requests the new price.',
 register:'« Pourriez-vous confirmer le nouveau prix, s’il vous plaît ? »',
 quote:'Use the original customer’s date contrast and conditional request.',
 wrongScope:['The customer asks to change Thursday back to Wednesday.','The customer confirms a refund has already been paid.'],
 wrongRegister:['« Hé toi, confirme le prix maintenant ! »','« Tu dois obéir et changer ma réservation. »'],
 repairs:['The original direction of change is Wednesday to Thursday.','No refund was stated.','This is too brusque for formal service contact.','A command with tu contradicts the courteous setting.'],
 model:['« Bonjour, je voudrais venir jeudi au lieu de mercredi. »','« Pardon, je disais jeudi, pas mercredi. »','« Merci. Pourriez-vous confirmer le prix lorsque vous aurez vérifié ? »','« La cliente souhaite modifier la date. Jeudi est disponible, mais elle demande encore la confirmation du nouveau prix. »']
 },
 {
 id:'b1-01',speaker:'Eva',anchor:'le dernier bus part plus tôt le vendredi',
 title:'Practical meeting change without imaginary disruption',
 description:'Sustain a proposed timing compromise, respond to a sceptical colleague, and attribute timetable claims accurately.',
 settings:['Informal project coordination','Professional team meeting','Evidence-aware summary'],
 reactions:['Pourquoi changer notre rendez-vous ?','Nous avons toujours commencé à la même heure.','Donc le réseau de bus ne fonctionne plus du tout ?','Présentez la proposition, la vérification et une solution de repli.'],
 instructions:['Give Eva’s stated reason and a measured alternative.','Recognize the colleague’s need for predictability and propose checking availability.','Correct the false network-cancellation interpretation.','Sustain a reasoned summary distinguishing observed bus timing, other opening times and unconfirmed details.'],
 repair:'« Le dernier bus part plus tôt le vendredi ; je n’ai pas dit que tous les bus étaient annulés. »',
 scope:'Eva mentions an earlier last Friday bus, not a total bus cancellation.',
 register:'« Pourrions-nous vérifier les horaires avant de fixer un nouveau créneau ? »',
 quote:'Use the earlier departure statement and Martin’s intent to verify the official hours.',
 wrongScope:['Every Friday bus service has been cancelled.','Martin states he already verified all closing times.'],
 wrongRegister:['« Changez l’heure sans discussion ! »','« Tu inventes toujours tes excuses. »'],
 repairs:['The original says the last bus leaves earlier, not that all buses stop.','Martin says he will check; the result is not yet known.','An unnegotiated command is not constructive planning.','An accusation undermines reasonable team coordination.'],
 model:['« Le dernier bus part plus tôt vendredi. Je voudrais avancer notre réunion. »','« Je comprends que changer nos habitudes soit compliqué ; vérifions les possibilités. »','« Non, il s’agit du dernier départ, pas d’une annulation générale. »','« Eva propose un horaire plus tôt. Martin souhaite vérifier une autre fermeture officielle. Nous devons encore confirmer les horaires avant de décider ensemble. »']
 },
 {
 id:'b1-02',speaker:'Omar',anchor:'nous pourrions proposer deux options et demander les préférences de chacun',
 title:'Defending a balanced meeting format',
 description:'Move from collegial disagreement to a formal facilitation announcement while preserving uncertainty and every participant’s interests.',
 settings:['Discussion with a teammate','Facilitation meeting','Neutral public recap'],
 reactions:['Je préfère parler aux gens en personne.','Les personnes éloignées n’ont qu’à venir !','Donc notre décision est déjà définitive ?','Présentez deux arguments, une concession et la méthode de décision.'],
 instructions:['Acknowledge the colleague’s in-person preference without dismissing remote access.','Disagree politely with the exclusionary objection.','Repair the mistaken idea of a finalized meeting decision.','Synthesize the costs and preferences before recommending a consultation.'],
 repair:'« Ce n’est pas encore décidé ; nous pourrions proposer deux options et consulter le groupe. »',
 scope:'Omar recommends offering two options and consulting everyone, not imposing a decision.',
 register:'« Nous proposons de consulter les préférences de l’ensemble des participants. »',
 quote:'Distinguish Nora’s concerns about travel from Omar’s compromise proposal.',
 wrongScope:['Omar has announced mandatory in-person attendance.','Omar has ruled out remote access entirely.'],
 wrongRegister:['« Vous devez tous venir, point final. »','« Ceux qui habitent loin n’ont pas d’avis. »'],
 repairs:['The conditional « pourrions » introduces a proposal, not a final rule.','Two options remain under consideration.','A categorical command omits the consultation.','This excludes the exact group whose needs are being considered.'],
 model:['« Je comprends le souhait de se voir, mais plusieurs personnes habitent loin. »','« Nous devons aussi tenir compte des collègues éloignés. »','« Non, la proposition n’est pas encore une décision. »','« Nora évoque le coût du transport. Omar rappelle le besoin de contact. Le groupe pourrait proposer deux options et recueillir les préférences avant de décider. »']
 },
 {
 id:'b1-03',speaker:'Paul',anchor:'une confirmation écrite de la version officielle',
 title:'A precise source-status briefing',
 description:'Handle a premature distribution request, challenge unsupported confidence and preserve the difference between source version and official authority.',
 settings:['Teammate asks about a file','Formal supervisor briefing','Release recommendation'],
 reactions:['Nous avons deux versions, laquelle faut-il envoyer ?','Le fichier le plus récent est sûrement le bon.','Vous refusez donc de transmettre quoi que ce soit ?','Présentez la divergence, la preuve manquante et un plan de confirmation.'],
 instructions:['Explain that a document exists but official status is unresolved.','Challenge the filename-based inference without accusing anyone.','Clarify that temporary withholding is a source-verification precaution.','Recommend written confirmation before broad distribution.'],
 repair:'« Nous avons deux versions ; aucune n’est encore confirmée comme officielle. »',
 scope:'The team needs written confirmation identifying which of two versions is official.',
 register:'« Avant toute diffusion, nous demanderons une confirmation écrite de la version applicable. »',
 quote:'Refer to Paul’s express requirement for written confirmation.',
 wrongScope:['The file with a newer date is automatically official.','Both versions are formally approved for publication.'],
 wrongRegister:['« Vous ne savez rien, taisez-vous. »','« Peu importe la source, publiez tout immédiatement ! »'],
 repairs:['A date alone does not prove authority.','The dialogue never establishes two approvals.','Personal insult is not a professional correction.','Unverified publication ignores the documented version conflict.'],
 model:['« Deux versions existent, mais leur statut reste incertain. »','« La date ne suffit pas à identifier la version officielle. »','« Nous souhaitons seulement vérifier avant une diffusion plus large. »','« Le dossier présente deux versions. Paul demande une confirmation écrite. Nous pouvons transmettre le document lorsque l’autorité sera clarifiée. »']
 },
 {
 id:'transfer-31',speaker:'Aline',anchor:'je ne peux pas affirmer qu’ils viennent de l’appartement voisin',
 title:'Mediating noise without an unproved culprit',
 description:'Answer a demand for immediate blame, distinguish a recorded observation from a rule and move to a cautious community statement.',
 settings:['Conversation between neighbors','Building mediation','Public factual recap'],
 reactions:['J’ai entendu du bruit, et toi ?','Accusons immédiatement l’appartement voisin !','Le règlement prouve donc qui a fait du bruit ?','Présentez observations, hypothèses, limite des sources et action suivante.'],
 instructions:['State Aline’s actual observation without adding an eyewitness account.','Challenge unsupported attribution while acknowledging residents’ concern.','Separate a rule on quiet hours from identification of a culprit.','Prepare a neutral briefing with a voluntary mediation plan.'],
 repair:'« J’ai entendu des bruits, mais je n’ai pas identifié leur origine. »',
 scope:'Aline observed noise but did not establish that the neighboring apartment caused it.',
 register:'« Les faits rapportés ne permettent pas de désigner un habitant responsable. »',
 quote:'Compare Aline’s attested uncertainty with Youssef’s statement that rules name no resident.',
 wrongScope:['Aline directly witnessed the neighboring resident moving furniture.','The general building rules prove the identity of a culprit.'],
 wrongRegister:['« Notre voisin est coupable, prévenez tout le monde ! »','« Vos objections ne comptent pas, taisez-vous. »'],
 repairs:['No eyewitness identification appears in the conversation.','Rules set obligations but do not establish a particular violation.','Public blame without proof is misleading.','The hostile response blocks mediation.'],
 model:['« J’entends parfois du bruit tard, mais je n’en connais pas la source. »','« Il vaut mieux recueillir les observations avant d’accuser quelqu’un. »','« Le règlement décrit les horaires, pas l’identité d’un responsable. »','« Aline rapporte les heures observées. L’origine des sons reste incertaine. Une médiation volontaire permettrait d’en parler sans accusation injustifiée. »']
 },
 {
 id:'transfer-121',speaker:'Leïla',anchor:'supprime pourtant « il me semblait »',
 title:'Defending uncertainty in a theatre translation',
 description:'Compare a manuscript line, translation omission and rehearsal alternatives while sustaining two reasonable interpretive readings.',
 settings:['Translator and colleague','Editorial review board','Public program note'],
 reactions:['Pourquoi garder « il me semblait » ?','Une traduction directe serait plus claire sans hésitation.','Donc nous savons que l’autrice préférait cette version ?','Exposez le texte, deux lectures possibles et votre recommandation justifiée.'],
 instructions:['Explain how the hedging phrase changes confidence.','Acknowledge a legitimate clarity goal, then defend semantic fidelity.','Repair an invented claim of established authorial preference.','Present evidence, counterargument and an appropriately qualified editorial decision.'],
 repair:'« Aucun document ne prouve quelle version l’autrice aurait préférée. »',
 scope:'Omitting « il me semblait » suppresses hesitation; the author’s preferred rehearsal version remains unproved.',
 register:'« Cette formulation préserve une incertitude explicitement présente dans le texte original. »',
 quote:'Use Leïla’s statement about omission and her later statement about undocumented preference.',
 wrongScope:['The narrator is proved to be deliberately lying.','The manuscript proves which rehearsal version the author approved.'],
 wrongRegister:['« La clarté ne compte jamais, faites ce que je dis ! »','« Les personnes qui ne comprennent pas ont tort. »'],
 repairs:['Discrepant recollection does not prove deliberate deceit.','The original discussion explicitly states the preference is not established.','Rejecting clarity without argument is not an editorial explanation.','Attacking readers is not a serious interpretive response.'],
 model:['« « Il me semblait » exprime une hésitation ; sa suppression change le sens. »','« La clarté importe, mais la nuance du texte doit rester visible. »','« Non, nous n’avons pas de preuve sur la préférence de l’autrice. »','« Les deux versions permettent plusieurs lectures. Je préserverais l’incertitude et expliquerais les choix de mise en scène sans les présenter comme certains. »']
 },
 {
 id:'transfer-148',speaker:'Malik',anchor:"pas la publication des sous-titres en ligne",
 title:'Correcting captions and explaining publication limits',
 description:'Bridge approved script, an actual transcription mistake, improvised performance and a restricted display permission in a rights-aware release briefing.',
 settings:['Accessibility production team','Public venue management','Transparent release announcement'],
 reactions:['La scène finale est-elle correctement sous-titrée ?','Nous avons déjà un accord pour la projection, donc mettons tout en ligne.','Le texte approuvé reflète forcément chaque improvisation, non ?','Expliquez les erreurs, leur gravité, la portée des autorisations et les limites restantes.'],
 instructions:['Describe the lost negation and its change of meaning.','Distinguish venue projection permission from ungranted online rights.','Challenge the assumption that an approved script records improvised performance exactly.','Give a qualified, non-promissory plan for a checked event version and separate online consent.'],
 repair:'« L’accord concerne la salle, pas la publication en ligne ; il faut vérifier les droits. »',
 scope:'The original agreement authorizes on-site projection, not online distribution.',
 register:'« Une version contrôlée sera présentée en salle ; toute diffusion supplémentaire nécessite vérification et autorisation. »',
 quote:'Cite Malik on permission, Nina on the approved refusal and Élodie on improvisation.',
 wrongScope:['Existing permission automatically includes all online distribution.','The automatic caption’s lost negation does not affect the character’s decision.'],
 wrongRegister:['« Publiez immédiatement, personne ne remarquera les erreurs ! »','« Nous avons tous les droits, inutile de vérifier. »'],
 repairs:['The original permission is expressly limited to display in the venue.','Removing a negative changes the reported refusal into apparent acceptance.','Concealing significant errors is unacceptable in a transparent release notice.','Unsupported rights claims contradict the cited permission boundary.'],
 model:['« La transcription a perdu une négation : le refus a semblé devenir une acceptation. »','« L’accord actuel ne couvre que la projection dans la salle. »','« Non, l’improvisation peut différer du scénario approuvé. »','« Nous devons contrôler les répliques, annoncer les limites du sous-titrage et obtenir les droits nécessaires avant toute diffusion en ligne. »']
 },
 {
 id:'transfer-149',speaker:'Aïcha',anchor:'Nous pourrons annoncer le soutien des répondants, pas celui de tous les habitants.',
 title:'A garden survey without an invented population mandate',
 description:'Compare an advocacy poster with the online consultation method and make a defensible public recommendation that recognizes non-response and pending costs.',
 settings:['Community debate','Municipal public hearing','Accessible survey correction'],
 reactions:['Quatre personnes sur cinq approuvent, n’est-ce pas ?','Pourquoi ne pas annoncer que toute la commune a voté ?','Les vingt mille euros sont donc définitivement accordés ?','Faites une déclaration avec le dénominateur, la méthode et la décision encore attendue.'],
 instructions:['Identify the actual numerator and denominator reported.','Correct population-wide extrapolation without dismissing genuine respondent support.','Distinguish a provisional budget from approved maintenance and feasibility costs.','Propose a clearer invitation and qualified summary in a neutral public register.'],
 repair:'« Quatre-vingts réponses sur cent bulletins volontaires étaient favorables, pas quatre habitants sur cinq de toute la commune. »',
 scope:'The sample contains 80 favorable responses among 100 voluntary online ballots, not a verified municipality-wide majority.',
 register:'« Le résultat concerne les répondants volontaires et ne représente pas nécessairement toute la commune. »',
 quote:'Compare the association poster, portal method note and Aïcha’s final qualified speaker statement.',
 wrongScope:['A randomized poll verified that 80% of every household supports the garden.','The council has already approved the final 20 000 € maintenance budget.'],
 wrongRegister:['« Tous les habitants ont voté : la discussion est close ! »','« Les personnes sans internet n’ont pas leur mot à dire. »'],
 repairs:['The online sample was voluntary, not randomized or household-verified.','The 20 000 € amount is indicative and costs await deliberation.','This wrongly turns respondents into the entire population.','Excluding those without internet repeats the documented access bias.'],
 model:['« La plateforme a reçu cent bulletins, dont quatre-vingts favorables. »','« Cela montre l’avis de ces répondants, pas nécessairement celui de tous les habitants. »','« Non, le conseil doit encore examiner les dépenses et la faisabilité. »','« Nous publierons le nombre de réponses, les limites du recrutement et les coûts restant à confirmer avant une consultation plus ouverte. »']
 },
 {
 id:'transfer-150',speaker:'Hugo',anchor:'Ce chiffre suppose un ciel sombre, dégagé et une longue observation.',
 title:'Explaining conditional forecasts and unequal measurements',
 description:'Defend an honest public astronomy announcement, compare two different observation durations and distinguish local clouds from a universal prediction.',
 settings:['Astronomy club dialogue','Press and public Q&A','Scientific observation briefing'],
 reactions:['Verrons-nous tous soixante météores par heure ?','Neuf observations prouvent-elles que la prévision est fausse partout ?','Mais un autre groupe a vu quinze météores !','Proposez un protocole commun et une conclusion conditionnelle et vérifiable.'],
 instructions:['Identify the advertised theoretical limit and its viewing conditions.','Explain why clouds at one site do not disprove a general conditional model.','Contrast durations and missing observation conditions without equating raw counts.','Present a cautious public summary and the proposed standard fifteen-minute sessions.'],
 repair:'« Soixante par heure est une estimation maximale sous conditions, non une observation garantie pour chaque visiteur. »',
 scope:'Sixty per hour is a conditional theoretical maximum; groups observed 9 in 30 minutes and 15 in 45 minutes under differing conditions.',
 register:'« Ces résultats locaux ne permettent pas de valider ou de réfuter universellement la prévision sans conditions comparables. »',
 quote:'Distinguish Hugo’s qualification, Maya’s two local counts and the public invitation wording.',
 wrongScope:['Each visitor is guaranteed sixty visible meteors every hour.','Nine observations in thirty minutes prove that every sky has no meteors.'],
 wrongRegister:['« Nos chiffres prouvent tout, ne posez aucune question ! »','« Quinze est forcément mieux que neuf ; aucune autre donnée ne compte. »'],
 repairs:['A model maximum with favorable assumptions is not a guaranteed personal observation.','A cloudy site is a restricted measurement, not a universal refutation.','Absolute certainty without comparable conditions is not justified.','Raw counts with different durations and visibility cannot be compared directly.'],
 model:['« Soixante est un maximum théorique par heure, si le ciel est favorable. »','« Non, les nuages ont limité l’observation d’un groupe. »','« L’autre groupe a observé quarante-cinq minutes, contre trente pour le premier. »','« Comparons de nouvelles séances de quinze minutes avec lieu, visibilité, horizon et interruptions afin de présenter un bilan transparent. »']
 }
];
function norm(s:string){return s.normalize('NFC').replace(/[‘’]/g,"'").toLocaleLowerCase('fr').trim().replace(/\s+/g,' ');}
function rotateChoices(id:string,values:readonly string[]):readonly string[]{
 const unique=[...new Set(values)];if(unique.length<2)return Object.freeze(unique);
 const offset=[...id].reduce((v,c)=>v+c.charCodeAt(0),0)%unique.length;
 return Object.freeze([...unique.slice(offset),...unique.slice(0,offset)]);
}
export function evaluateU32Decision(decision:U32Decision,answer:string):{
 readonly supported:boolean;readonly feedback:string
}{
 const supported=norm(answer)===norm(decision.answer);
 const correction=Object.entries(decision.misconception).find(([k])=>norm(k)===norm(answer))?.[1];
 return {supported,feedback:supported?
  'Matches the authored source-backed key. '+decision.explanation:
  (correction??'This option is not the original source-supported key.')+' '+decision.explanation};
}
function lessonWitnesses(id:string,qualifiedId:string,revision:string):U32Witness[]{
 const source=getOriginalMaterial(id);if(!source)return [];
 const result:U32Witness[]=[];
 source.unit.dialogue.forEach((turn,i)=>result.push(Object.freeze({
  locator:id+':dialogue:'+i,kind:'dialogue' as const,
  label:'Original dialogue · turn '+(i+1)+' · '+turn.speaker,
  french:turn.fr,explanation:turn.en,index:i,
  qualifiedSourceId:qualifiedId,sourceRevision:revision
 })));
 source.reading?.french.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean).forEach((p,i)=>result.push(Object.freeze({
  locator:id+':reading:'+i,kind:'reading' as const,
  label:'Original connected reading · paragraph '+(i+1),
  french:p,index:i,qualifiedSourceId:qualifiedId,sourceRevision:revision
 })));
 source.evidence?.sources.forEach((record,i)=>result.push(Object.freeze({
  locator:id+':document:'+i,kind:'document' as const,
  label:'Original independent '+record.type+' · '+record.label,
  french:record.french,index:i,qualifiedSourceId:qualifiedId,sourceRevision:revision
 }));
 return result;
}
function decision(id:string,type:U32Decision['type'],prompt:string,answer:string,
 distractors:readonly string[],explanation:string,wrong:Readonly<Record<string,string>>,
 evidence:readonly string[],qualified:string):U32Decision|null{
 const options=rotateChoices(id,[answer,...distractors]);
 if(options.length<3||options.some(x=>!x))return null;
 return Object.freeze({
  id,type,prompt,answer,choices:options,explanation,misconception:wrong,
  relevantLocators:evidence,sourceQualifiedId:qualified
 });
}
export function originalU32Discourse(id:string):U32Journey|null{
 const entry=getOriginalCatalogEntry(id),source=getOriginalMaterial(id);
 const u31=originalU31OralJourney(id);
 if(!entry||!source||!u31||source.unit.dialogue.length<2)return null;
 const witnesses=lessonWitnesses(id,entry.qualifiedId,entry.sourceRevision);
 const d=source.unit.dialogue;
 const authored=CASES.find(c=>c.id===id&&d.some(t=>t.speaker===c.speaker&&norm(t.fr).includes(norm(c.anchor))));
 const anchorIndex=authored?d.findIndex(t=>t.speaker===authored.speaker&&norm(t.fr).includes(norm(authored.anchor))):0;
 const citations=(indices:readonly number[])=>indices.filter(i=>i>=0&&i<d.length).map(i=>id+':dialogue:'+i);
 const theme=authored?.title??'Source-grounded extended conversation: '+entry.title;
 const description=authored?.description??
  'Practice a longer exchange based on the existing original dialogue without treating an invented partner objection as source evidence.';
 const generalSetting:readonly [string,string,string]=['Original conversation','New peer discussion','Structured audience briefing'];
 const generalReactions:readonly [string,string,string,string]=[
  '« Pourriez-vous expliquer ce qui s’est passé dans le dialogue ? » (hypothetical prompt)',
  '« Je ne suis pas d’accord. Pouvez-vous justifier votre interprétation ? » (hypothetical prompt)',
  '« Votre résumé transforme-t-il une proposition en fait certain ? » (hypothetical prompt)',
  '« Présentez un résumé équilibré avec une preuve et une réserve. » (hypothetical prompt)'
 ];
 const generalInstructions:readonly [string,string,string,string]=[
  'Describe the actual speakers and situation, without inventing a new original statement.',
  'Respond to a challenging viewpoint; cite a real French speaker turn and avoid pretending agreement.',
  'Clarify what is said versus what remains uncertain; ask for verification when the source is silent.',
  'Deliver a sustained, coherent explanation with speaker attribution, concession and an actionable next step.'
 ];
 const settings=authored?.settings??generalSetting;
 const reactions=authored?.reactions??generalReactions;
 const instructions=authored?.instructions??generalInstructions;
 const modes:readonly U32Move[]=['frame','object','repair','synthesize'];
 const turns=modes.map((move,i):U32Turn=>{
  const sourceIndex=i===3?d.length-1:i===1?Math.min(1,d.length-1):anchorIndex;
  const illustrative=authored?.model[i];
  const scenario=i===0?settings[0]:i===1?settings[1]:settings[2];
  const register=authored?.register??(i===2?'Respectful clarification':i===3?'Neutral public explanatory register':u31.desiredRegister);
  const strategy=[
   'Introduce the situation, attributed speaker and factual source claim.',
   'Recognize the objection fairly, then connect a source-supported counterpoint.',
   'Restate accurately with a polite repair formula and preserve uncertainty.',
   'Synthesize source support and its limits, propose an appropriate next step.'
  ][i];
  return Object.freeze({
   id:'u32:'+id+':move:'+move,move,
   setting:scenario,
   partner:['Partner A','Partner B','Partner A','Audience'][i],
   partnerSays:reactions[i],task:instructions[i],
   intendedRegister:register,
   safeguard:authored?.repair??'Separate what original speakers said from this invented partner challenge.',
   scaffold:strategy,independentTarget:authored?.model[i]??'Construct your own source-grounded French response; there is no automatic model answer for this lesson.',
   witnessLocators:Object.freeze(citations(i===3?[anchorIndex,d.length-1]:[sourceIndex])),
   illustrativeReply:illustrative
  });
 });
 const decisions:U32Decision[]=[];
 if(authored){
  const locator=[id+':dialogue:'+anchorIndex];
  const [a,b]=authored.wrongScope,[c,e]=authored.wrongRegister;
  const keyed=decision('u32:'+id+':scope','scope',
   'Which meaning is defensible from the exact original French dialogue, without adopting the hypothetical objection?',
   authored.scope,[a,b],
   'The original speaker '+authored.speaker+' provides the anchor for this interpretation. Do not turn a fictional response into evidence.',
   {[a]:authored.repairs[0],[b]:authored.repairs[1]},locator,entry.qualifiedId);
  if(keyed)decisions.push(keyed);
  const social=decision('u32:'+id+':register','register',
   'Which French intervention suits the new '+settings[1].toLowerCase()+' situation while preserving the original claim?',
   authored.register,[c,e],
   'This is an authored register-choice comparison about a newly constructed situation, not a quotation from the historical dialogue.',
   {[c]:authored.repairs[2],[e]:authored.repairs[3]},locator,entry.qualifiedId);
  if(social)decisions.push(social);
 }
 // Reconstruct actual document provenance, with source-qualified original
 // records. Names must be unique and excerpts must not occur in other records.
 const docs=witnesses.filter(x=>x.kind==='document');
 if(docs.length>=2){
  const distinct=docs.filter(x=>docs.filter(y=>y.label===x.label).length===1);
  for(const current of distinct.slice(0,3)){
   const excerpt=current.french.match(/[^.!?]+[.!?]+|[^.!?]+$/u)?.[0]?.trim()??'';
   if(excerpt.length<24||docs.some(x=>x!==current&&norm(x.french).includes(norm(excerpt))))continue;
   const others=docs.filter(x=>x.locator!==current.locator&&x.label!==current.label).map(x=>x.label);
   if(others.length<2)continue;
   const traps=others.slice(0,2);
   const item=decision('u32:'+id+':document:'+current.index,'attribution',
    'Which independently published original *written* record contains this exact statement? « '+excerpt.slice(0,135)+' »',
    current.label,traps,
    'The quoted statement is in '+current.label+'. A document being published does not independently verify its accuracy or make it recorded speech.',
    Object.fromEntries(traps.map(label=>[label,'This quotation is not in '+label+'. Compare the distinct attributed written documents.'])),
    [current.locator],entry.qualifiedId);
   if(item)decisions.push(item);
  }
 }
 const reading=witnesses.filter(x=>x.kind==='reading');
 if(reading.length>=2){
  const x=reading[0];
  const fragment=x.french.slice(0,Math.min(110,x.french.length)).trim();
  if(fragment.length>=30&&!reading.slice(1).some(y=>norm(y.french).includes(norm(fragment)))){
   const traps=reading.slice(1,3).map(row=>'Reading paragraph '+(row.index+1));
   if(traps.length>=2){
    const item=decision('u32:'+id+':reading-location','comparison',
     'Which original written paragraph contains this passage (not necessarily something uttered by a dialogue speaker)? « '+fragment+' »',
     'Reading paragraph 1',traps,
     'The quoted passage appears in paragraph 1 of the separate original reading. It is not automatically a dialogue transcript.',
     Object.fromEntries(traps.map(label=>[label,'The quoted passage is not in '+label+'. Keep written and spoken provenance separate.'])),
     [x.locator],entry.qualifiedId);
    if(item)decisions.push(item);
   }
  }
 }
 // Never imply semantic equivalence when neither source actually establishes it.
 const oldReading=originalIntegratedReading(id);
 return Object.freeze({
  lessonId:id,title:entry.title,level:entry.level,qualifiedId:entry.qualifiedId,
  sourceRevision:entry.sourceRevision,caseTitle:theme,caseDescription:description,
  originalUnits:Object.freeze([id]),witnesses:Object.freeze(witnesses),
  turns:Object.freeze(turns),decisions:Object.freeze(decisions),curated:!!authored,
  sourceComparisonAvailable:docs.length>=2||reading.length>=2,
  nativeReadingCount:oldReading?.originalQuestions.length??0
 });
}
export function validateU32HistoricalAnchors():readonly string[]{
 return CASES.flatMap(c=>{
  const source=getOriginalMaterial(c.id);
  return source?.unit.dialogue.some(t=>t.speaker===c.speaker&&norm(t.fr).includes(norm(c.anchor)))?
   []:['U32 anchored case unavailable: '+c.id+' / '+c.speaker];
 });
}
export const U32_CURATED_CASE_IDS:readonly string[]=Object.freeze(CASES.map(c=>c.id));
