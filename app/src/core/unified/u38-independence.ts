import {originalU37Communication,type U37Register,type U37Setting} from './u37-communication.ts';
import type {U32Witness} from './u32-discourse.ts';
import {getOriginalCatalogEntry,type OriginalLevel} from './u23-registry.ts';

/** New U38 partner dialogue is original pedagogical fiction, NEVER a historical
 * French witness. Only the U37/U23 original record owns source and lesson IDs. */
export type U38Role='requester'|'coordinator'|'concerned-party'|'mediator'|'fact-checker'|'audience';
export type U38Artifact='clarification'|'negotiation'|'record'|'public-brief';
export interface U38Turn {
 readonly id:string;readonly role:U38Role;readonly title:string;readonly roleDescription:string;
 readonly fictionalLine:string;readonly independentTask:string;readonly modeledReply:string;
 readonly register:U37Register;readonly misconception:string;readonly sourceLocators:readonly string[];
}
export interface U38ArtifactTask{
 readonly id:string;readonly kind:U38Artifact;readonly title:string;readonly recipient:string;
 readonly instruction:string;readonly outline:readonly string[];readonly sourceLocators:readonly string[];
 readonly illustrativeFrench:string;
}
export interface U38Choice{
 readonly id:string;readonly question:string;readonly answer:string;
 readonly choices:readonly string[];readonly sourceLocators:readonly string[];
 readonly feedback:string;readonly misconceptions:Readonly<Record<string,string>>;
}
export interface U38Journey{
 readonly lessonId:string;readonly qualifiedSourceId:string;readonly revision:string;readonly level:OriginalLevel;
 readonly title:string;readonly setting:U37Setting;readonly curated:boolean;
 readonly sourceWitnesses:readonly U32Witness[];readonly sourceGuard:string;
 readonly turns:readonly U38Turn[];readonly artifacts:readonly U38ArtifactTask[];
 readonly choices:readonly U38Choice[];
 readonly availableRead:boolean;readonly historicalIdentity:'u23-original';
}
interface Scenario{
 readonly id:string;readonly socialContext:string;readonly issue:string;
 readonly voices:readonly [string,string,string,string];
 readonly replies:readonly [string,string,string,string];
 readonly overclaim:string;readonly corrected:string;readonly registerContrast:string;
 readonly evidenceLimit:string;readonly verification:string;readonly languageTrap:string;
}
/* Four NEW voices/replies in each of the 13 existing originally attested
 * scenarios, allowing viewpoint changes, compromise and recordable next steps. */
const SCENARIOS:readonly Scenario[]=[
 {id:'a1-01',socialContext:'social',
 issue:'Respect a stranger who does not want to reveal personal information.',
 voices:[
  '« Je suis nouveau ici, mais je préfère ne pas raconter ma vie. »',
  '« Il faut donc éviter toute question personnelle ? »',
  '« Vous pouvez accueillir quelqu’un sans insister sur son identité. »',
  '« Comment allez-vous présenter l’échange à la prochaine personne ? »'],
 replies:[
  '« Bienvenue ! On peut simplement discuter de votre journée. »',
  '« Pas toutes les questions : il faut respecter la réponse et le choix de chacun. »',
  '« Je comprends et je peux changer de sujet. »',
  '« Nous nous sommes salués, sans exiger de renseignements privés. »'],
 overclaim:'« Toute personne polie doit dire son métier dès qu’on la salue. »',
 corrected:'« Une salutation polie n’oblige pas à communiquer son métier. »',
 registerContrast:'Use « Comment allez-vous ? » rather than « Et toi ? » for an unfamiliar adult.',
 evidenceLimit:'The original « Et toi ? » is reciprocal wellbeing, not professional background.',
 verification:'Do not infer a name, job, or consent from the historical dialogue.',
 languageTrap:'The tu/vous change concerns relationship, not the truth of a biographical claim.'},
 {id:'a1-02',socialContext:'university',
 issue:'Represent a student group without expanding nous into everyone in Paris.',
 voices:[
  '« Bonjour, je viens avec notre groupe d’étudiants. »',
  '« Votre nous signifie-t-il que vous parlez au nom de toute la ville ? »',
  '« Le bureau a besoin d’une liste, mais nous ne l’avons pas encore reçue. »',
  '« Comment expliquer clairement qui est membre du groupe ? »'],
 replies:[
  '« Bonjour, nous sommes étudiants et souhaitons des renseignements. »',
  '« Non, nous désigne notre groupe, pas tous les habitants. »',
  '« Nous pouvons demander la liste avant toute confirmation. »',
  '« Nous parlons des étudiants présents dans ce groupe uniquement. »'],
 overclaim:'« Aya dit nous, donc tous les Parisiens sont étudiants. »',
 corrected:'« Aya parle de son groupe d’étudiants, pas de tous les Parisiens. »',
 registerContrast:'Use « nous » for the actual group; « tous les habitants » requires independent evidence.',
 evidenceLimit:'No citywide count or university registration status follows from Aya’s words.',
 verification:'Ask the university for the specific enrollment confirmation if needed.',
 languageTrap:'Tous applies to the identified group, not an undefined population.'},
 {id:'a2-01',socialContext:'social',
 issue:'Retell a past evening accurately when someone assumes an unfinished film was completed.',
 voices:[
  '« Émile a commencé un film après le dîner. »',
  '« Si tu dis qu’il a regardé un film, il doit l’avoir terminé, non ? »',
  '« Je voudrais connaître la fin, mais personne ne l’a racontée. »',
  '« Peux-tu expliquer ce qui s’est passé, sans inventer de détails ? »'],
 replies:[
  '« Oui, il a commencé le film, mais il ne l’a pas terminé. »',
  '« Non : il s’est endormi avant la fin. »',
  '« Le dialogue ne nous permet pas de raconter cette fin. »',
  '« Il a dîné, commencé un film puis s’est endormi. »'],
 overclaim:'« Émile a vu le film jusqu’à la fin. »',
 corrected:'« Émile n’a pas terminé le film parce qu’il s’est endormi. »',
 registerContrast:'Maintain the passé composé event sequence and ne … pas to preserve non-completion.',
 evidenceLimit:'Beginning to watch is attested; knowledge of the ending is not.',
 verification:'Ask someone who actually saw the ending rather than inventing it.',
 languageTrap:'The passé composé does not automatically mean the entire movie was finished.'},
 {id:'a2-15',socialContext:'service',
 issue:'Balance apartment space, rent, station proximity and unconfirmed availability.',
 voices:[
  '« Je veux de l’espace, mais je dois aussi faire attention au prix. »',
  '« Alors l’appartement le plus grand est forcément le meilleur ? »',
  '« La gare pourrait être importante pour les déplacements quotidiens. »',
  '« Quelle recommandation pouvez-vous formuler sans signer à notre place ? »'],
 replies:[
  '« Comparons la taille, le prix et les transports. »',
  '« Pas forcément : le premier est plus cher. »',
  '« Le deuxième est plus proche de la gare. »',
  '« Si les transports sont prioritaires, le deuxième pourrait convenir. »'],
 overclaim:'« Le plus grand appartement est aussi le moins cher. »',
 corrected:'« Le premier est plus grand, mais plus cher ; le deuxième est plus proche de la gare. »',
 registerContrast:'Use conditional recommendations, not definitive « il faut choisir » for another tenant.',
 evidenceLimit:'The original compares criteria but supplies no confirmed reservation or exact rent.',
 verification:'Request actual availability, costs and conditions before making a binding choice.',
 languageTrap:'Plus grand does not mean moins cher; conditionals signal dependent preferences.'},
 {id:'a2-17',socialContext:'service',
 issue:'Request a hotel booking change without treating a request as an accepted reservation.',
 voices:[
  '« Bonjour, je souhaite changer la date de mon séjour. »',
  '« Votre demande suffit-elle pour confirmer le nouveau tarif ? »',
  '« Notre équipe doit encore vérifier les disponibilités. »',
  '« Que pouvons-nous écrire au client en attendant la réponse ? »'],
 replies:[
  '« Pourriez-vous étudier la nouvelle date, s’il vous plaît ? »',
  '« Non, j’attends une confirmation écrite. »',
  '« Merci de me préciser le tarif et la disponibilité. »',
  '« La modification a été demandée, mais elle n’est pas encore confirmée. »'],
 overclaim:'« La demande envoyée garantit le changement de réservation. »',
 corrected:'« La demande ne vaut pas confirmation de la nouvelle réservation. »',
 registerContrast:'« Pourriez-vous confirmer » is a request; « vous avez confirmé » alleges completed consent.',
 evidenceLimit:'There is no hotel acknowledgment in the original passage.',
 verification:'Obtain an actual hotel response with date, room and price.',
 languageTrap:'The conditional of politeness does not become a confirmed past transaction.'},
 {id:'b1-01',socialContext:'university',
 issue:'Agree on an adjusted meeting time without wrongly claiming cancellation of all buses.',
 voices:[
  '« Mon dernier bus part plus tôt le vendredi. »',
  '« Cela veut-il dire que tous les bus sont supprimés ? »',
  '« Plusieurs étudiants n’ont pas encore confirmé leur disponibilité. »',
  '« Quelle annonce pouvons-nous envoyer sans les mettre devant le fait accompli ? »'],
 replies:[
  '« Nous pourrions avancer la réunion. »',
  '« Non, c’est le dernier départ qui pose problème. »',
  '« Il faut demander les disponibilités de chacun. »',
  '« Nous proposons un horaire plus tôt, sous réserve de vos réponses. »'],
 overclaim:'« Tous les bus du vendredi sont annulés, et la réunion aussi. »',
 corrected:'« Le dernier bus part plus tôt ; le groupe envisage un horaire adapté. »',
 registerContrast:'Distinguish « proposer » and « confirmer » in a practical announcement.',
 evidenceLimit:'A Friday timetable constraint and proposal do not establish a cancelled network or group consensus.',
 verification:'Collect participants’ replies before finalizing the meeting.',
 languageTrap:'Le dernier bus ≠ tous les bus; the indicative and conditional mark decision status.'},
 {id:'b1-02',socialContext:'workplace',
 issue:'Consult remote and in-person participants without fabricating unanimous approval.',
 voices:[
  '« J’aimerais pouvoir participer à distance. »',
  '« Une réunion hybride conviendra-t-elle forcément à tout le monde ? »',
  '« Certains collègues préféreraient une réunion en personne. »',
  '« Comment présenter les deux possibilités de manière équitable ? »'],
 replies:[
  '« Nous pouvons étudier cette option. »',
  '« Il faut vérifier les besoins de chaque participant. »',
  '« Merci de partager vos préférences et vos contraintes. »',
  '« Plusieurs formules sont envisagées ; aucune décision finale n’est encore prise. »'],
 overclaim:'« Tous les membres ont unanimement accepté le format hybride. »',
 corrected:'« Une consultation est proposée ; l’accord de tous n’est pas établi. »',
 registerContrast:'Avoid « approuvé » where « proposé » or « envisagé » matches the source.',
 evidenceLimit:'An inclusive proposal is not a recorded final vote.',
 verification:'Collect actual responses and announce an authorized decision only afterward.',
 languageTrap:'A proposal expressed in the conditional cannot be silently changed into unanimous approval.'},
 {id:'b1-03',socialContext:'workplace',
 issue:'Handle conflicting document versions and seek written authority before publishing.',
 voices:[
  '« J’ai reçu deux versions différentes de la même note. »',
  '« Pourquoi ne pas choisir automatiquement la plus récente ? »',
  '« La direction n’a pas encore confirmé laquelle est officielle. »',
  '« Que faut-il demander avant d’envoyer le document aux collègues ? »'],
 replies:[
  '« Nous devons identifier leur origine et leur statut. »',
  '« Une date récente ne prouve pas l’approbation. »',
  '« Attendons une réponse écrite de la personne compétente. »',
  '« Pourriez-vous confirmer la version autorisée à diffuser ? »'],
 overclaim:'« La version avec la date la plus récente est officiellement validée. »',
 corrected:'« Le statut officiel de chaque version doit être confirmé par écrit. »',
 registerContrast:'« J’ai reçu » refers to receipt; « la direction a approuvé » requires evidence.',
 evidenceLimit:'Timestamp and administrative authority are different facts.',
 verification:'Seek a real authorized written version designation.',
 languageTrap:'Receipt and validity are not synonymous; avoid fabricated past-tense approvals.'},
 {id:'transfer-31',socialContext:'mediation',
 issue:'Hear noise complaints neutrally without identifying an unproven responsible neighbor.',
 voices:[
  '« J’ai entendu des bruits à plusieurs reprises. »',
  '« Le règlement ne prouve-t-il pas qui est responsable ? »',
  '« Je voudrais que mes observations soient entendues sans accusation. »',
  '« Quelle proposition respectera aussi le droit de réponse du voisin ? »'],
 replies:[
  '« Je comprends que cette situation soit gênante. »',
  '« Le règlement ne désigne pas de responsable. »',
  '« Notons les heures observées et vérifions les faits. »',
  '« Proposons une discussion où chacun pourra s’exprimer. »'],
 overclaim:'« Le règlement prouve qu’un voisin précis a fait ce bruit. »',
 corrected:'« Les bruits sont signalés, mais leur origine reste à déterminer. »',
 registerContrast:'Use cautious attribution and the conditional for uncertain explanations.',
 evidenceLimit:'General rules and a report cannot identify a particular person.',
 verification:'Check direct observations and invite all parties to a fair mediation.',
 languageTrap:'A hypothesis about responsibility is not a proven statement in the indicative.'},
 {id:'transfer-121',socialContext:'workplace',
 issue:'Negotiate readable translation while preserving an author’s hedged narrator.',
 voices:[
  '« Je voudrais rendre cette phrase plus naturelle en français. »',
  '« Peut-on supprimer “il me semblait” pour gagner en fluidité ? »',
  '« Les versions disponibles ne précisent pas le choix définitif de l’autrice. »',
  '« Comment expliquer cette nuance à la personne qui publie le texte ? »'],
 replies:[
  '« La fluidité est importante, mais la nuance aussi. »',
  '« Non, cela changerait le degré de certitude. »',
  '« Nous devons attribuer les versions sans inventer une préférence. »',
  '« Conservons la réserve et signalons ce qui reste incertain. »'],
 overclaim:'« L’autrice a définitivement approuvé la version sans hésitation. »',
 corrected:'« Les documents ne confirment pas son choix ; la réserve doit être préservée. »',
 registerContrast:'Preserve epistemic verbs such as « il me semblait » instead of upgrading them to certainty.',
 evidenceLimit:'A draft is not evidence of a deceased/absent author’s final preference.',
 verification:'Compare attributable manuscripts and explain unresolved approval.',
 languageTrap:'Deleting a hedge changes evidential meaning; style improvement does not license invention.'},
 {id:'transfer-148',socialContext:'service',
 issue:'Correct inaccurate captions and check separate online rights for a performance.',
 voices:[
  '« Nous avons relevé une erreur de négation dans les sous-titres. »',
  '« Si le texte était affiché en salle, pouvons-nous le publier partout ? »',
  '« Les interprètes ont parfois improvisé pendant la représentation. »',
  '« Que faut-il vérifier avant de diffuser la vidéo ? »'],
 replies:[
  '« Vérifions les paroles réellement prononcées. »',
  '« Non, l’autorisation en salle ne couvre pas nécessairement Internet. »',
  '« Il faut comparer les sous-titres avec la performance, pas seulement le scénario. »',
  '« Vérifions le texte exact et obtenons les droits adaptés. »'],
 overclaim:'« Un accord d’affichage en salle autorise la diffusion mondiale des sous-titres. »',
 corrected:'« Les droits de diffusion en ligne doivent être vérifiés séparément. »',
 registerContrast:'Use explicit « ne … pas » for refusal and conditional language for uncertain rights.',
 evidenceLimit:'Performance accuracy and display rights do not establish digital publication permission.',
 verification:'Obtain explicit rightsholder authorization for the proposed online use.',
 languageTrap:'Removing negation reverses refusals; « autorisé en salle » is scope-limited.'},
 {id:'transfer-149',socialContext:'public',
 issue:'Explain a voluntary survey honestly before municipal funding is decided.',
 voices:[
  '« Nous avons reçu cent bulletins, dont quatre-vingts favorables. »',
  '« Cela signifie-t-il que quatre habitants sur cinq approuvent le projet ? »',
  '« Le budget doit encore être examiné par les élus. »',
  '« Comment publier ces résultats sans faire croire que tout est décidé ? »'],
 replies:[
  '« Il s’agit de réponses volontaires. »',
  '« Nous ne pouvons pas généraliser à toute la population. »',
  '« Le financement reste à confirmer. »',
  '« Présentons la méthode, les réponses et la décision encore attendue. »'],
 overclaim:'« Quatre habitants sur cinq approuvent, et le budget est garanti. »',
 corrected:'« Quatre-vingts réponses volontaires sur cent étaient favorables ; le budget reste à décider. »',
 registerContrast:'Prefer « parmi les répondants » over « parmi les habitants » without a representative sample.',
 evidenceLimit:'Voluntary replies are not a municipality-wide mandate and do not approve a budget.',
 verification:'Disclose sampling method and actual council decision status.',
 languageTrap:'Denominator change and categorical « est garanti » manufacture stronger claims.'},
 {id:'transfer-150',socialContext:'public',
 issue:'Describe meteor forecasts and differing observation conditions without promises.',
 voices:[
  '« La prévision indique un maximum théorique sous un ciel favorable. »',
  '« Tout le monde verra donc exactement soixante météores ? »',
  '« Certains sites avaient des nuages et des durées d’observation différentes. »',
  '« Quelle information claire faut-il donner aux familles ? »'],
 replies:[
  '« La prévision dépend des conditions. »',
  '« Non, ce maximum n’est pas une garantie pour chaque visiteur. »',
  '« Comparons le lieu, la météo et la durée d’observation. »',
  '« Venez observer, mais le résultat réel pourra être différent. »'],
 overclaim:'« Chaque personne observera exactement soixante météores par heure. »',
 corrected:'« Le maximum théorique ne garantit pas une observation identique pour tous. »',
 registerContrast:'Use « pourrait », « dépend » and distinct « prévision »/« observation ».',
 evidenceLimit:'A model under favorable conditions is not an observed guaranteed per-person rate.',
 verification:'Record observation duration, weather and site before comparing local counts.',
 languageTrap:'Turning a theoretical maximum into an unequivocal future prediction overstates certainty.'}
];
const ROLE_SEQUENCE:readonly [U38Role,string,string][]=[
 ['requester','Clarify the initial need',
  'Ask one precise question and repeat only what the original historical witness establishes.'],
 ['coordinator','Propose a workable response',
  'Offer an appropriate register and a conditional practical option, without announcing consent.'],
 ['concerned-party','Handle a countervailing concern',
  'Acknowledge an opposing participant fairly while distinguishing direct evidence from suspicion.'],
 ['mediator','Negotiate and repair',
  'Restate the opposing view respectfully, correct the relevant language misconception and propose consent-seeking next steps.'],
 ['fact-checker','Verify source and authority',
  'Distinguish original quoted facts from the new roleplay and identify what external confirmation remains missing.'],
 ['audience','Deliver an independent public handoff',
  'Explain the genuinely supported historical facts, the civil objection, the unresolved point and a realistic follow-up.']
];
function rotate(seed:string,values:readonly string[]):readonly string[]{
 const unique=[...new Set(values)];if(!unique.length)return unique;
 const offset=[...seed].reduce((s,c)=>s+c.charCodeAt(0),0)%unique.length;
 return Object.freeze([...unique.slice(offset),...unique.slice(0,offset)]);
}
export function originalU38Independence(id:string):U38Journey|null{
 const original=originalU37Communication(id),entry=getOriginalCatalogEntry(id);
 if(!original||!entry||!original.sourceWitnesses.length)return null;
 const authored=SCENARIOS.find(c=>c.id===id);
 const first=original.sourceWitnesses.find(w=>w.kind==='dialogue')??original.sourceWitnesses[0];
 const second=original.sourceWitnesses.find(w=>w.kind==='document')??
  original.sourceWitnesses.find(w=>w.kind==='reading')??
  original.sourceWitnesses.find(w=>w.locator!==first.locator)??first;
 const sources=Object.freeze([...new Set([first.locator,second.locator])]);
 const fictionalLines:readonly string[]=authored?[
  original.turns[0].partnerPrompt,
  authored.voices[0],authored.voices[1],authored.voices[2],
  authored.voices[3],original.turns[4].partnerPrompt
 ]:[
  original.turns[0].partnerPrompt,
  '« Pouvez-vous proposer une solution raisonnable ? »',
  '« Avez-vous pris en compte le point de vue des autres ? »',
  '« Quelle clarification serait la plus juste ? »',
  '« Comment vérifier ce qui a réellement été confirmé ? »',
  original.turns[4].partnerPrompt
 ];
 const examples:readonly string[]=authored?[
  original.turns[0].exampleFrench,
  authored.replies[0],authored.replies[1],authored.replies[2],
  authored.replies[3],original.turns[4].exampleFrench
 ]:[
  original.turns[0].exampleFrench,
  '« Nous pourrions demander des précisions avant de décider. »',
  '« Je comprends ce point de vue, mais la source comporte des limites. »',
  '« Une vérification nous aiderait à éviter un malentendu. »',
  '« Il faut distinguer la demande de la confirmation. »',
  original.turns[4].exampleFrench
 ];
 const roles:readonly string[]=[
  'Fictional requestor in a practice scene',
  'New fictional coordinator',
  'New fictional participant with different priorities',
  'New fictional mediator',
  'New fictional fact checker',
  'New fictional audience member'
 ];
 const turns:readonly U38Turn[]=Object.freeze(ROLE_SEQUENCE.map(([role,title,task],i)=>({
  id:'u38:'+id+':role:'+role,role,title,roleDescription:roles[i],
  fictionalLine:fictionalLines[i],independentTask:task,
  modeledReply:examples[i],register:i===0?original.assignedRegister:
   i===5?'public':'professional',
  misconception:authored?.evidenceLimit??original.sourceGuard,
  sourceLocators:sources
 })));
 const tasks:readonly [U38Artifact,string,string,string,readonly string[]][]=[
  ['clarification','A courteous clarification','An actual service recipient or colleague',
   'Produce a short French message correcting a genuine ambiguity without presuming agreement.',
   ['Describe the original speaker’s exact limited statement.','State the missing confirmation.','Make a polite, answerable clarification request.']],
  ['negotiation','A fair negotiation record','People with conflicting priorities',
   'Summarize both sides fairly, propose a conditional compromise and name the consent that remains to be obtained.',
   ['State each fictional participant’s interest as simulation, not original testimony.','Attribute genuine facts to original witnesses.','Offer one viable conditional step and seek agreement.']],
  ['record','A neutral source-sensitive report','A team or reviewer requiring reliable facts',
   'Build a documentary note clearly separating original citations, roleplay, interpretation and outstanding external checks.',
   ['Identify authentic witness IDs and speaker roles.','Correct the tempting source-specific overclaim.','Mark unsupported assumptions and verification owners.']],
  ['public-brief','An accessible independent public briefing','A non-specialist public audience',
   'Prepare a sustained unrecorded French briefing with clear attribution, fair objection, response, uncertainty and proposed follow-up.',
   ['Introduce original evidence without overclaiming.','Acknowledge the strongest reasonable objection.','Conclude conditionally and communicate the next action.']]
 ];
 const artifactTasks:readonly U38ArtifactTask[]=Object.freeze(tasks.map(([kind,title,recipient,instruction,outline])=>({
  id:'u38:'+id+':artifact:'+kind,kind,title,recipient,instruction,outline,
  sourceLocators:sources,
  illustrativeFrench:kind==='clarification'?
   '« Bonjour, pourriez-vous préciser ce point avant que nous prenions une décision ? »':
   kind==='negotiation'?
   '« Je comprends vos priorités. Nous pourrions comparer les options avant de confirmer notre choix. »':
   kind==='record'?
   '« Selon la source originale, certains éléments restent à confirmer. »':
   '« Nous disposons d’informations utiles, mais il faut en préciser les limites. »'
 })));
 const checks:U38Choice[]=[];
 if(authored){
  const fake='« Le personnage fictif est une preuve historique originale. »';
  checks.push({
   id:'u38:'+id+':misconception',
   question:'Which French repair accurately corrects the source-related misunderstanding?',
   answer:authored.corrected,
   choices:rotate(id+':repair',[authored.corrected,authored.overclaim,fake]),
   sourceLocators:sources,feedback:authored.evidenceLimit,
   misconceptions:{
    [authored.overclaim]:'This repeats a known overclaim instead of correcting what the original says.',
    [fake]:'A newly invented scenario character is not historical French evidence.'
   }
  });
  const wrong='A confident fictional roleplay statement is enough to authorize a real-world decision.';
  const wrong2='Remove all grammatical negation, uncertainty and consent boundaries to sound more decisive.';
  checks.push({
   id:'u38:'+id+':verification',
   question:'What practical safeguard should accompany the final negotiated French message?',
   answer:authored.verification,choices:rotate(id+':verification',[authored.verification,wrong,wrong2]),
   sourceLocators:sources,feedback:authored.evidenceLimit+' '+authored.registerContrast,
   misconceptions:{
    [wrong]:'Simulation cannot authorize real bookings, publication, enrollment, blame or group approval.',
    [wrong2]:'Deleting uncertainty, negation or consent conditions would distort the original evidence.'
   }
  });
  const inaccurate='« Le ton formel transforme automatiquement une hypothèse en fait confirmé. »';
  const exaggerated='« Le tutoiement est toujours correct face à une autorité inconnue. »';
  checks.push({
   id:'u38:'+id+':register',
   question:'Which register or grammar distinction should remain intact during professional communication?',
   answer:authored.languageTrap,choices:rotate(id+':register',[authored.languageTrap,inaccurate,exaggerated]),
   sourceLocators:sources,feedback:authored.registerContrast,
   misconceptions:{
    [inaccurate]:'A more formal tone does not establish an unverified source claim.',
    [exaggerated]:'Appropriate register depends on the addressee and context, not a universal rule.'
   }
  });
 }
 if(second.locator!==first.locator&&second.label!==first.label){
  checks.push({
   id:'u38:'+id+':source',question:'Which authentic original source is represented by the second witness card?',
   answer:second.label,choices:rotate(id+':source',[second.label,first.label,'U38 fictional mediator']),
   sourceLocators:sources,
   feedback:'The second original attributed witness is '+second.label+
    '. A second dialogue turn is not automatically an independently published historical record.',
   misconceptions:{
    [first.label]:'This is the label of the first witness.',
    'U38 fictional mediator':'The mediator is a new learning persona, not a historical original source.'
   }
  });
 }
 return Object.freeze({
  lessonId:id,qualifiedSourceId:entry.qualifiedId,revision:entry.sourceRevision,
  title:entry.title,level:entry.level,setting:original.setting,curated:!!authored,
  sourceWitnesses:original.sourceWitnesses,sourceGuard:authored?.evidenceLimit??original.sourceGuard,
  turns,artifacts:artifactTasks,choices:Object.freeze(checks),
  availableRead:entry.reading,historicalIdentity:'u23-original'
 });
}
export function assessU38AuthoredChoice(item:U38Choice,response:string):{
 readonly matched:boolean;readonly feedback:string
}{
 const norm=(x:string)=>x.normalize('NFC').replace(/[’‘]/g,"'").trim().toLocaleLowerCase('fr');
 const matched=norm(response)===norm(item.answer);
 const specific=Object.entries(item.misconceptions).find(([value])=>norm(value)===norm(response))?.[1];
 return {matched,feedback:(matched?'Matches the limited U38-authored original-source key. ':
  (specific??'This option does not match the authored key.')+' ')+item.feedback+
  ' This is not a free-text grammar, speech or CEFR proficiency grade.'};
}
export const U38_CURATED_IDS:readonly string[]=Object.freeze(SCENARIOS.map(x=>x.id));
