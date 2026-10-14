import {originalU36Longform} from './u36-longform.ts';
import {getOriginalCatalogEntry,type OriginalLevel} from './u23-registry.ts';
import type {U32Witness} from './u32-discourse.ts';

/**
 * U37 lives on top of historical ORIGINAL U23/U36 source witnesses.
 * Every new role, response, challenge and explanation is fictional original
 * teaching, not an archival French quotation, test result or account write.
 */
export type U37Interaction='orient'|'clarify'|'negotiate'|'repair'|'transfer';
export type U37Setting='social'|'university'|'service'|'workplace'|'mediation'|'public';
export type U37Register='familiar'|'professional'|'public';
export interface U37SceneTurn {
 readonly id:string;readonly kind:U37Interaction;readonly title:string;
 readonly fictionalPartner:string;readonly partnerPrompt:string;
 readonly learnerTask:string;readonly exampleFrench:string;
 readonly misconception:string;readonly sourceLocators:readonly string[];
 readonly independentChallenge:string;
}
export interface U37Scenario {
 readonly lessonId:string;readonly qualifiedSourceId:string;
 readonly revision:string;readonly title:string;readonly level:OriginalLevel;
 readonly curated:boolean;readonly setting:U37Setting;readonly objective:string;
 readonly assignedRegister:U37Register;readonly participants:string;
 readonly sourceGuard:string;readonly sourceWitnesses:readonly U32Witness[];
 readonly turns:readonly U37SceneTurn[];
 readonly checks:readonly U37KeyedChoice[];
 readonly transferTasks:readonly U37TransferTask[];
 readonly sourceCondition:'authored-original-witness';
}
export interface U37KeyedChoice {
 readonly id:string;readonly question:string;readonly answer:string;
 readonly choices:readonly string[];
 readonly sourceLocators:readonly string[];readonly explanation:string;
 readonly misconception:Readonly<Record<string,string>>;
}
export interface U37TransferTask {
 readonly id:string;readonly mode:'listen'|'speak'|'read'|'write';
 readonly title:string;readonly instruction:string;
 readonly sourceLocators:readonly string[];readonly independentPrompt:string;
}
type SceneCase=Readonly<{
 id:string;setting:U37Setting;register:U37Register;participants:string;objective:string;
 guard:string;partner:readonly [string,string,string,string,string];
 reply:readonly [string,string,string,string,string];
 pitfall:string;correction:string;scope:string;
}>;
/** New source-aware, original 5-turn scenarios. Partner lines are fictional. */
const CASES:readonly SceneCase[]=[
 {id:'a1-01',setting:'social',register:'familiar',
  participants:'Two acquaintances at a student welcome event',
  objective:'Reciprocate a greeting, protect voluntary disclosure and conclude politely.',
  guard:'Original « Et toi ? » asks about wellbeing, never profession or a name.',
  partner:['Salut ! Ça va ?','Tu veux savoir mon métier ?','Je préfère ne pas donner mon nom.','Mais on doit tout dire quand on se présente, non ?','Alors, que pourrais-tu dire à une autre personne ?'],
  reply:['« Ça va bien, merci. Et toi ? »','« Non, je demande seulement comment tu vas. »','« Pas de problème, je respecte ton choix. »','« On peut être poli sans demander d’informations personnelles. »','« Bonjour ! Comment allez-vous ? »'],
  pitfall:'« Pour être poli, il faut connaître le métier de l’autre. »',
  correction:'« Une salutation n’oblige personne à donner ses informations personnelles. »',
  scope:'A wellbeing question is not permission to insist on private biography.'},
 {id:'a1-02',setting:'university',register:'professional',
  participants:'A student and university reception staff',
  objective:'Explain a group identity, repair a pronoun misunderstanding and ask courteously for help.',
  guard:'Aya says « nous sommes tous étudiants » about a particular group, not a whole city.',
  partner:['Bonjour, vous êtes étudiante ?','« Nous », cela veut dire seulement vous ?','Donc tous les habitants de Paris sont étudiants ?','Votre groupe a-t-il déjà reçu une inscription officielle ?','Résumez la situation pour un autre agent.'],
  reply:['« Bonjour, oui, nous sommes étudiants. »','« Je parle de notre groupe, pas seulement de moi. »','« Non, je ne parle pas de tous les Parisiens. »','« Je ne peux pas confirmer cela avec ce dialogue. »','« Notre groupe est étudiant et souhaite obtenir des renseignements. »'],
  pitfall:'« Tous les habitants de Paris sont étudiants. »',
  correction:'« Ce sont les membres du groupe d’Aya qui sont étudiants. »',
  scope:'Neither citywide enrollment nor administrative registration is established.'},
 {id:'a2-01',setting:'social',register:'familiar',
  participants:'Two friends sharing what happened the night before',
  objective:'Retell past actions without dropping the negation or inventing the ending.',
  guard:'Émile began a film but did not finish it because he fell asleep.',
  partner:['Qu’est-ce qu’Émile a fait hier soir ?','Il a terminé son film, alors ?','Peux-tu me raconter la fin du film ?','Mais le passé composé signifie toujours que tout est fini !','Explique la soirée en quelques phrases claires.'],
  reply:['« Il a préparé le dîner et a commencé un film. »','« Non, il ne l’a pas terminé. »','« Je ne connais pas la fin : il s’est endormi. »','« Commencer le film ne signifie pas le terminer. »','« Il a mangé puis regardé un film, mais il s’est endormi avant la fin. »'],
  pitfall:'« Émile a terminé le film. »',
  correction:'« Il ne l’a pas terminé, parce qu’il s’est endormi. »',
  scope:'The historical source supports watching, falling asleep and non-completion, not seeing the ending.'},
 {id:'a2-15',setting:'service',register:'professional',
  participants:'Housing adviser and potential tenant comparing two apartments',
  objective:'Negotiate trade-offs without inventing rent figures, housing availability or a universal choice.',
  guard:'The first apartment is larger and more expensive; the second is closer to the station.',
  partner:['Quel appartement préférez-vous ?','Le plus grand est forcément moins cher, non ?','Quelle priorité voulez-vous garder ?','Je peux donc annoncer que le premier est réservé ?','Donnez-moi votre conseil final.'],
  reply:['« Je comparerais la taille, le prix et la gare. »','« Non, le premier est plus grand, mais plus cher. »','« La proximité de la gare est importante pour moi. »','« Pas sans une confirmation de disponibilité. »','« Si le trajet compte davantage, le deuxième pourrait convenir. »'],
  pitfall:'« Le plus grand est nécessairement le moins cher et le meilleur. »',
  correction:'« Il est plus grand, mais plus cher ; le deuxième est plus proche de la gare. »',
  scope:'Relative amenities do not establish exact prices, a signed booking or an unconditional choice.'},
 {id:'a2-17',setting:'service',register:'professional',
  participants:'Hotel guest and reservation reception',
  objective:'Request a reservation change and distinguish the request from confirmation.',
  guard:'A polite revised-price request is not proof the hotel accepted a changed date or rate.',
  partner:['Bonjour, que souhaitez-vous modifier ?','Vous voulez confirmer le nouveau prix ?','Puis-je dire que votre réservation est déjà modifiée ?','Et si je n’ai pas encore de réponse écrite ?','Résumez votre demande au responsable.'],
  reply:['« Bonjour, je voudrais modifier ma réservation, s’il vous plaît. »','« Pourriez-vous confirmer le nouveau tarif ? »','« Non, je souhaite d’abord une confirmation écrite. »','« Je préciserai que la demande reste en attente. »','« Merci de confirmer par écrit la date et le tarif proposés. »'],
  pitfall:'« Une demande de modification vaut réservation confirmée. »',
  correction:'« Le changement est demandé, mais la confirmation reste à obtenir. »',
  scope:'An unanswered request has no remote acknowledgment or binding booking status.'},
 {id:'b1-01',setting:'university',register:'professional',
  participants:'Student meeting organizer and transport-dependent attendees',
  objective:'Negotiate a meeting time while preserving a Friday last-bus constraint.',
  guard:'An earlier Friday last bus does not establish service-wide cancellation or participant consent.',
  partner:['Pourquoi faut-il revoir l’horaire ?','Alors, tous les bus du vendredi sont annulés ?','Peut-on avancer la réunion sans demander aux autres ?','Que faire si certains ne peuvent pas venir plus tôt ?','Rédigez une annonce provisoire aux participants.'],
  reply:['« Le dernier bus du vendredi part plus tôt. »','« Non, seul cet horaire est mentionné. »','« Il faudrait d’abord consulter chaque participant. »','« Nous pourrions recueillir leurs disponibilités. »','« Nous proposons un horaire avancé, sous réserve de vos réponses. »'],
  pitfall:'« Tout le réseau de bus est supprimé et la réunion est annulée. »',
  correction:'« Le dernier bus part plus tôt ; un changement d’horaire est proposé. »',
  scope:'The source establishes a timetable limitation, not a cancelled network or adopted solution.'},
 {id:'b1-02',setting:'workplace',register:'professional',
  participants:'Facilitator and participants in a mixed-format meeting',
  objective:'Handle accessibility preferences and consultation without fabricating consensus.',
  guard:'Omar proposes formats and asks for preferences; a final vote is absent.',
  partner:['Comment les membres souhaitent-ils participer ?','La formule hybride est-elle déjà acceptée ?','Un participant demande une connexion à distance : que répondez-vous ?','Peut-on annoncer que tout le monde est d’accord ?','Rédigez une consultation neutre.'],
  reply:['« Les besoins varient ; consultons chacun. »','« Non, elle n’est encore qu’une proposition. »','« Nous pouvons étudier cette possibilité. »','« Pas avant d’avoir reçu les réponses. »','« Merci de préciser votre préférence et vos contraintes. »'],
  pitfall:'« Tous les membres ont voté en faveur de la réunion hybride. »',
  correction:'« Plusieurs options sont proposées ; les préférences restent à recueillir. »',
  scope:'Options and consultation do not constitute proof of unanimous approval.'},
 {id:'b1-03',setting:'workplace',register:'professional',
  participants:'Document coordinator and manager checking an internal notice',
  objective:'Clarify competing document versions without treating a timestamp as authority.',
  guard:'Two versions circulate; their official status is not established until source-authorized confirmation.',
  partner:['Pourquoi ces deux fichiers posent-ils problème ?','Le document le plus récent est forcément officiel ?','Quelle preuve vous manque ?','Peut-on déjà publier la nouvelle version ?','Envoyez une courte demande de clarification.'],
  reply:['« Les deux versions n’ont pas un statut clairement établi. »','« Non, la date ne prouve pas l’approbation. »','« Il nous faut une confirmation écrite de l’autorité compétente. »','« Je recommande d’attendre cette confirmation. »','« Pourriez-vous préciser par écrit la version officielle à utiliser ? »'],
  pitfall:'« La version la plus récente est automatiquement officielle. »',
  correction:'« Le statut des deux versions doit être confirmé par écrit. »',
  scope:'Version chronology is not source authorization; no official decision is attested.'},
 {id:'transfer-31',setting:'mediation',register:'professional',
  participants:'Mediator, resident reporting noise and a person incorrectly accused',
  objective:'De-escalate a complaint and request facts rather than accusing an unverified individual.',
  guard:'Quiet-hours rules and unexplained reported noises do not identify a responsible neighbor.',
  partner:['Nous entendons du bruit à des heures difficiles.','Le règlement prouve que mon voisin est responsable !','Dois-je accuser cette personne devant tous ?','Comment entendre aussi le point de vue du voisin ?','Présentez une proposition de médiation neutre.'],
  reply:['« Je comprends la gêne et je note vos observations. »','« Le règlement ne permet pas d’identifier l’auteur des bruits. »','« Mieux vaut vérifier les faits sans accusation. »','« Nous pouvons inviter les personnes à expliquer leur expérience. »','« Je propose un échange respectueux après vérification des horaires. »'],
  pitfall:'« La plainte prouve qu’un voisin précis a déplacé les meubles. »',
  correction:'« La cause et la responsabilité des bruits restent à déterminer. »',
  scope:'The report concerns observed sound; responsibility remains unverified.'},
 {id:'transfer-121',setting:'workplace',register:'professional',
  participants:'Translation editor and literary review colleague',
  objective:'Protect a narrator’s uncertainty while discussing competing draft translations.',
  guard:'A draft and « il me semblait » do not prove which version an absent author endorsed.',
  partner:['Pourquoi conserver une expression d’hésitation ?','Une version plus fluide devrait-elle supprimer « il me semblait » ?','Quelle version l’autrice a-t-elle choisie définitivement ?','Comment présenter les deux versions au lecteur ?','Rédigez une note éditoriale prudente.'],
  reply:['« L’expression indique une perception incertaine. »','« Non, cela pourrait modifier la voix du narrateur. »','« Les documents ne permettent pas de le confirmer. »','« Nous pouvons expliquer les options et leur statut. »','« Je recommande de préserver la nuance et d’indiquer l’incertitude. »'],
  pitfall:'« L’autrice a officiellement préféré la traduction sans hésitation. »',
  correction:'« Le choix de l’autrice n’est pas confirmé ; la réserve doit être conservée. »',
  scope:'Editorial fluency is not evidence of a historical author’s intention or approval.'},
 {id:'transfer-148',setting:'service',register:'professional',
  participants:'Caption editor, performer and rights coordinator',
  objective:'Repair negation and separate on-site accessibility approval from online publishing rights.',
  guard:'An approved hall display does not itself authorize online distribution of captions.',
  partner:['Quels risques pose le sous-titrage automatique ?','Si la négation disparaît, est-ce seulement un détail ?','Les mots improvisés figurent-ils forcément dans le scénario ?','L’accord en salle permet-il une diffusion en ligne ?','Proposez les étapes avant la publication.'],
  reply:['« Il faut vérifier les paroles et leurs négations. »','« Non, cela peut transformer un refus en acceptation. »','« Pas nécessairement : comparons avec la performance réelle. »','« Non, les droits de diffusion doivent être vérifiés séparément. »','« Corrigeons les paroles et obtenons les autorisations nécessaires. »'],
  pitfall:'« Les sous-titres projetés en salle peuvent être publiés partout. »',
  correction:'« L’accord en salle ne prouve pas le droit de publier sur Internet. »',
  scope:'Accuracy, improvised performance and publication-right scope require distinct evidence.'},
 {id:'transfer-149',setting:'public',register:'public',
  participants:'Municipal garden organizer, skeptical resident and council representative',
  objective:'Explain voluntary survey proportions and distinguish public interest from budget approval.',
  guard:'80 of 100 voluntary ballots is not a representative survey of the whole town or a budget decision.',
  partner:['Combien de réponses favorables avez-vous reçues ?','Donc quatre habitants sur cinq soutiennent le jardin ?','Le financement est-il déjà garanti ?','Pourquoi parler des personnes qui n’ont pas participé ?','Présentez un bref communiqué au conseil.'],
  reply:['« Quatre-vingts réponses sur cent bulletins volontaires étaient favorables. »','« Nous ne pouvons pas généraliser ce résultat à toute la ville. »','« Le financement doit encore être confirmé. »','« Leur absence limite la représentativité des réponses. »','« Publions les chiffres, la méthode et le statut réel du budget. »'],
  pitfall:'« Tous les habitants sont favorables et le budget est garanti. »',
  correction:'« Le soutien mesuré concerne les réponses volontaires ; le budget reste à confirmer. »',
  scope:'A voluntary respondent denominator is not a municipality-wide mandate or an approved budget.'},
 {id:'transfer-150',setting:'public',register:'public',
  participants:'Astronomy volunteer, visiting family and local journalist',
  objective:'Give a responsible science explanation without guaranteed meteor counts.',
  guard:'A theoretical maximum depends on favorable conditions; observed counts vary by cloud, site and duration.',
  partner:['Pourquoi annoncez-vous soixante météores par heure ?','Chaque enfant verra-t-il exactement soixante météores ?','Une autre ville a compté davantage : qui se trompe ?','Quelles données doit-on comparer ?','Faites une annonce accessible aux visiteurs.'],
  reply:['« Ce nombre représente un maximum théorique sous conditions favorables. »','« Non, le nombre observé peut varier. »','« Il faut comparer la météo, le lieu et la durée d’observation. »','« Notons le temps d’observation et les conditions du ciel. »','« Préparez-vous à observer, sans considérer la prévision comme une garantie. »'],
  pitfall:'« Chaque visiteur verra exactement soixante météores par heure. »',
  correction:'« Ce maximum théorique n’est pas une promesse d’observation individuelle. »',
  scope:'Different duration, visibility and location prevent one guaranteed rate for everyone.'}
];
const MOVES:readonly [U37Interaction,string,string,string][]=[
 ['orient','Open and establish the situation','Say what you know from the genuine original source and greet the new participant appropriately.',
  'Use a source-faithful opening rather than inventing a new official outcome.'],
 ['clarify','Clarify a misunderstanding','Identify the misunderstanding, repair register or vocabulary, and ask an open clarification question.',
  'Separate what someone asked from what has actually been confirmed.'],
 ['negotiate','Negotiate respectfully','Present a realistic conditional option, acknowledge another person’s needs and seek consent before announcing a decision.',
  'A practical suggestion is not a completed booking, vote, permission or agreement.'],
 ['repair','Respond to a difficult objection','Concede a fair concern and explain exactly what the original evidence does not prove.',
  'New fictional interlocutors are teaching prompts and not historical witnesses.'],
 ['transfer','Transfer independently','Give an original multi-sentence French explanation for a new audience, then prepare a suitable written handoff.',
  'Preserve original negation, sampling limits, attribution, rights and uncertainty across genres.']
];
const TRANSFERS:readonly [U37TransferTask['mode'],string,string,string][]=[
 ['listen','Listen and notice speaker intent',
  'Open the original authored dialogue in Listen. Distinguish its actual speaker turns from this U37 fictional scenario.',
  'Return and summarize which original speaker said what; hearing optional device TTS is not a human recording.'],
 ['speak','Speak through independent repair',
  'Prepare an original multi-turn French oral response with no model visible. Present a clarification, a fair concession and a proportionate next step.',
  'Do not claim verified pronunciation or fluency; this is unrecorded speaking preparation.'],
 ['read','Read the actual supporting source',
  'Open the original connected Read material where available and locate evidence for the crucial claim, not just the fictional scenario.',
  'Identify a paragraph that can genuinely be cited and one conclusion it does not establish.'],
 ['write','Write a context-appropriate message',
  'Produce a French email, service explanation, mediation note or public update. Distinguish what was observed, proposed and confirmed.',
  'Make a new draft independently; do not auto-copy private text to native Write.']
];
function choices(seed:string,values:readonly string[]):readonly string[]{
 const unique=[...new Set(values)];
 if(!unique.length)return Object.freeze([]);
 const shift=[...seed].reduce((sum,c)=>sum+c.charCodeAt(0),0)%unique.length;
 return Object.freeze([...unique.slice(shift),...unique.slice(0,shift)]);
}
function originalLocators(first:U32Witness,other:U32Witness):readonly string[]{
 return Object.freeze([...new Set([first.locator,other.locator])]);
}
export function originalU37Communication(id:string):U37Scenario|null{
 const prior=originalU36Longform(id),entry=getOriginalCatalogEntry(id);
 if(!prior||!entry||!prior.witnesses.length)return null;
 const authored=CASES.find(c=>c.id===id);
 const primary=prior.witnesses.find(w=>w.kind==='dialogue')??prior.witnesses[0];
 const other=prior.witnesses.find(w=>w.kind==='document')??
  prior.witnesses.find(w=>w.kind==='reading')??
  prior.witnesses.find(w=>w.locator!==primary.locator)??primary;
 const locators=originalLocators(primary,other);
 const partner:readonly string[]=authored?.partner??[
  '« Bonjour, pouvez-vous présenter le sujet de ce document ? »',
  '« Est-ce que tout ce qui est évoqué est déjà confirmé ? »',
  '« Que proposeriez-vous pour respecter les besoins de chacun ? »',
  '« Pourquoi ne peut-on pas retenir mon interprétation avec certitude ? »',
  '« Pouvez-vous expliquer la situation à une autre personne ? »'
 ];
 const replies:readonly string[]=authored?.reply??[
  '« Bonjour. Je vais distinguer les paroles originales de mes commentaires. »',
  '« Non, le document ne confirme pas toutes les interprétations. »',
  '« Nous pourrions consulter les personnes concernées avant de décider. »',
  '« Votre question est légitime, mais la source ne suffit pas à prouver cette conclusion. »',
  '« Voici les faits rapportés, les incertitudes et la vérification à envisager. »'
 ];
 const turns:U37SceneTurn[]=MOVES.map(([kind,title,task,guard],i)=>({
  id:'u37:'+id+':'+kind,kind,title,
  fictionalPartner:authored?.participants??'Fictional source-critical practice partner',
  partnerPrompt:partner[i],learnerTask:task,exampleFrench:replies[i],
  misconception:kind==='repair'?(authored?.scope??prior.sourceGuard):guard,
  sourceLocators:locators,
  independentChallenge:kind==='transfer'?
   'Hide the scaffold and summarize the original source accurately for someone unfamiliar with it.':
   'Reply in your own French, then explain how your answer differs from the authored illustration.'
 }));
 const checks:U37KeyedChoice[]=[];
 if(authored){
  checks.push({
   id:'u37:'+id+':misconception',
   question:'Which French intervention repairs the source-specific misunderstanding without fabricating historical details?',
   answer:authored.correction,
   choices:choices(id+':repair',[authored.correction,authored.pitfall,
    '« Le partenaire fictif est une preuve historique officielle. »']),
   sourceLocators:locators,
   explanation:authored.scope+' The correction is U37-authored, not an original dialogue quotation.',
   misconception:{
    [authored.pitfall]:'This repeats the exact source-related misconception rather than correcting it.',
    '« Le partenaire fictif est une preuve historique officielle. »':
      'The U37 partner is a newly authored practice character, not original historical source evidence.'
   }
  });
  checks.push({
   id:'u37:'+id+':negotiation',
   question:'What is the responsible next communicative move when an original record leaves the outcome unresolved?',
   answer:'Ask the people or authority concerned for confirmation before announcing a definitive outcome.',
   choices:choices(id+':negotiation',[
    'Ask the people or authority concerned for confirmation before announcing a definitive outcome.',
    'Announce that everyone has already agreed, despite absent evidence.',
    'Treat a fictional simulation as an official authorization.'
   ]),
   sourceLocators:locators,
   explanation:authored.scope+' No fictional response constitutes an original account acknowledgment.',
   misconception:{
    'Announce that everyone has already agreed, despite absent evidence.':
      'A proposal, complaint or inquiry cannot be turned into consent or a final administrative outcome.',
    'Treat a fictional simulation as an official authorization.':
      'Roleplay does not establish any real administrative, legal or personal authorization.'
   }
  });
 }
 if(other.locator!==primary.locator&&other.label!==primary.label){
  checks.push({
   id:'u37:'+id+':provenance',
   question:'Which ORIGINAL source supplies the second evidence card?',
   answer:other.label,
   choices:choices(id+':provenance',[other.label,primary.label,'The U37 imaginary correspondent']),
   sourceLocators:locators,
   explanation:'The second source is attributed to '+other.label+
    '. Attribution does not prove factual agreement or independent publication.',
   misconception:{
    [primary.label]:'That label identifies the first source, not the second displayed card.',
    'The U37 imaginary correspondent':'An invented practice interlocutor cannot become original documentary evidence.'
   }
  });
 }
 const transfers=TRANSFERS.filter(x=>x[0]!=='read'||entry.reading)
  .map(([mode,title,instruction,independentPrompt]):U37TransferTask=>({
   id:'u37:'+id+':handoff:'+mode,mode,title,instruction,
   sourceLocators:locators,independentPrompt
  }));
 return Object.freeze({
  lessonId:id,qualifiedSourceId:entry.qualifiedId,revision:entry.sourceRevision,
  title:entry.title,level:entry.level,curated:!!authored,
  setting:authored?.setting??'social',assignedRegister:authored?.register??'professional',
  participants:authored?.participants??'Newly invented communication partner for this historical lesson',
  objective:authored?.objective??'Use the original French to communicate responsibly and repair uncertainty.',
  sourceGuard:authored?.guard??prior.sourceGuard,
  sourceWitnesses:prior.witnesses,
  turns:Object.freeze(turns),checks:Object.freeze(checks),transferTasks:Object.freeze(transfers),
  sourceCondition:'authored-original-witness'
 });
}
export function evaluateU37AuthoredChoice(item:U37KeyedChoice,response:string):{
 readonly matched:boolean;readonly feedback:string
}{
 const norm=(s:string)=>s.normalize('NFC').replace(/[‘’]/g,"'").trim().toLocaleLowerCase('fr');
 const matched=norm(response)===norm(item.answer);
 const specific=Object.entries(item.misconception).find(([answer])=>norm(answer)===norm(response))?.[1];
 return {matched,feedback:(matched?'Matches this limited authored text key. ':
  (specific??'This answer does not match the authored choice key.')+' ')+item.explanation+
  ' This is not a grade of spontaneous French speaking, writing or CEFR achievement.'};
}
export const U37_CURATED_LESSON_IDS:readonly string[]=Object.freeze(CASES.map(c=>c.id));
