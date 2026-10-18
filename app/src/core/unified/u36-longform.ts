import {originalU35Synthesis,type U35Journey} from './u35-synthesis.ts';
import {getOriginalCatalogEntry,type OriginalLevel} from './u23-registry.ts';
import type {U32Witness} from './u32-discourse.ts';

/**
 * U36 is a read-only pedagogical extension of the original U23 sources.
 * U36 ids identify exercises, NEVER source records, review cards or owner writes.
 * Editorial examples and challenges are newly authored teaching text.
 */
export type U36StepKind='evidence'|'redline'|'counterargument'|'longform'|'transfer';
export type U36Audience='peer'|'professional'|'public';
export type U36EvidenceLabel='direct-quotation'|'reported-claim'|'interpretation'|'unestablished';
export type U36Genre='correspondence'|'report'|'briefing'|'editorial';
export interface U36EditorialCase{
 readonly lessonId:string;
 readonly category:'privacy'|'scope'|'negation'|'comparison'|'confirmation'|'authority'|'attribution'|'hedge'|'rights'|'sampling'|'measurement';
 readonly misleadingFrench:string;
 readonly responsibleFrench:string;
 readonly limit:string;
 readonly diagnostic:string;
 readonly challengeFrench:string;
 readonly additionalVerification:string;
 readonly styleRepair:string;
}
export interface U36SourcePair{
 readonly id:string;
 readonly first:string;
 readonly second:string;
 readonly label:'separately-attributed-records'|'cross-media'|'same-dialogue';
 readonly limitation:string;
}
export interface U36Step{
 readonly id:string;readonly kind:U36StepKind;
 readonly title:string;readonly assignment:string;
 readonly audience:U36Audience;
 readonly guidingQuestions:readonly string[];
 readonly editorExample:string;readonly sourceLocators:readonly string[];
 readonly sourceGuard:string;readonly paragraphGuidance:number;
}
export interface U36GenreAssignment{
 readonly genre:U36Genre;readonly title:string;readonly audience:string;
 readonly purpose:string;readonly constraints:readonly string[];
 readonly shortModel:string;readonly sourceLocators:readonly string[];
}
export interface U36Decision {
 readonly id:string;
 readonly question:string;readonly answer:string;
 readonly choices:readonly string[];
 readonly why:string;readonly misconceptions:Readonly<Record<string,string>>;
 readonly witnessLocators:readonly string[];
}
export interface U36Journey{
 readonly lessonId:string;readonly qualifiedSourceId:string;
 readonly sourceRevision:string;readonly title:string;readonly level:OriginalLevel;
 readonly witnesses:readonly U32Witness[];readonly pairings:readonly U36SourcePair[];
 readonly curated:boolean;readonly sourceGuard:string;
 readonly stages:readonly U36Step[];readonly genreAssignments:readonly U36GenreAssignment[];
 readonly decisions:readonly U36Decision[];
 readonly caseTeaching:U36EditorialCase|null;
 readonly originalAuthority:'u23-original-sources';
}

const AUTHORED_CASES:readonly U36EditorialCase[]=[
 {lessonId:'a1-01',category:'privacy',
  misleadingFrench:'« Pour répondre poliment à une salutation, il faut dire son métier. »',
  responsibleFrench:'« On peut répondre à une salutation sans communiquer son métier. »',
  limit:'The historical exchange asks about wellbeing, not professional identity.',
  diagnostic:'Adding biographical disclosure changes the question and can violate a conversational boundary.',
  challengeFrench:'« Une présentation est impolie si la personne refuse de donner sa profession. »',
  additionalVerification:'Check the exact original question and who answers it, without requesting private details.',
  styleRepair:'Use tu only in a familiar setting; with a stranger, a courteous vous form may fit better.'},
 {lessonId:'a1-02',category:'scope',
  misleadingFrench:'« Puisque Aya dit nous, tous les habitants de Paris sont étudiants. »',
  responsibleFrench:'« Aya décrit son groupe : elle ne parle pas de tous les habitants de Paris. »',
  limit:'The plural pronoun and tous are scoped to the stated group.',
  diagnostic:'A group quantifier was improperly generalized to an entire city.',
  challengeFrench:'« Si quelques personnes disent nous, on peut connaître la situation de toute la ville. »',
  additionalVerification:'Identify the actual members of the group without inventing population statistics.',
  styleRepair:'Distinguish notre groupe from l’ensemble de la ville.'},
 {lessonId:'a2-01',category:'negation',
  misleadingFrench:'« Émile a terminé le film qu’il a regardé. »',
  responsibleFrench:'« Émile a commencé le film, mais il ne l’a pas terminé : il s’est endormi. »',
  limit:'The historical statement explicitly distinguishes watching from finishing.',
  diagnostic:'Removing the negative construction reverses a meaningful completed-event claim.',
  challengeFrench:'« Le passé composé suffit à prouver qu’il a vu la fin. »',
  additionalVerification:'Locate the explicit negation and reason in the original dialogue.',
  styleRepair:'Use a contrast connector and preserve ne … pas accurately.'},
 {lessonId:'a2-15',category:'comparison',
  misleadingFrench:'« L’appartement le plus grand est nécessairement le meilleur et le moins cher. »',
  responsibleFrench:'« Le premier est plus grand, mais plus cher ; le deuxième est plus proche de la gare. »',
  limit:'A relative comparison supplies neither absolute prices nor an unconditional best choice.',
  diagnostic:'A single advantage was transformed into a universal recommendation.',
  challengeFrench:'« Le nombre de mètres carrés suffit pour choisir à la place des futurs locataires. »',
  additionalVerification:'Check the original contrasts, then ask for preferences and real rental conditions.',
  styleRepair:'Use mais and conditional language instead of forcément.'},
 {lessonId:'a2-17',category:'confirmation',
  misleadingFrench:'« Le nouveau prix demandé confirme que la réservation a changé. »',
  responsibleFrench:'« La cliente demande une modification ; le prix et la date doivent encore être confirmés. »',
  limit:'A request does not constitute a confirmed reply or accepted booking.',
  diagnostic:'A polite question was treated as an authoritative transaction acknowledgment.',
  challengeFrench:'« La demande envoyée suffit pour garantir la nouvelle réservation. »',
  additionalVerification:'Obtain an actual dated response from the hotel before describing the change as accepted.',
  styleRepair:'Use pourriez-vous to request confirmation; reserve confirmé for a verifiable response.'},
 {lessonId:'b1-01',category:'scope',
  misleadingFrench:'« Le réseau de bus du vendredi est supprimé et la réunion est annulée. »',
  responsibleFrench:'« Le dernier bus part plus tôt le vendredi ; le groupe envisage d’avancer la réunion. »',
  limit:'The passage mentions an earlier last bus and a proposed schedule, not service-wide cancellation.',
  diagnostic:'A limited transport constraint and a proposal were both upgraded into definitive outcomes.',
  challengeFrench:'« Si le dernier bus part plus tôt, tous les services sont forcément interrompus. »',
  additionalVerification:'Confirm participant availability and distinguish proposal from accepted time.',
  styleRepair:'Prefer envisage or propose until the group agrees.'},
 {lessonId:'b1-02',category:'confirmation',
  misleadingFrench:'« Tout le monde a déjà voté pour une réunion hybride. »',
  responsibleFrench:'« Omar propose plusieurs solutions et demande les préférences de chacun. »',
  limit:'Consultation and suggestion are not evidence of a unanimous vote.',
  diagnostic:'A question about preferences was rewritten as a completed collective decision.',
  challengeFrench:'« Demander l’avis des participants prouve que la décision est prise. »',
  additionalVerification:'Check responses before asserting a chosen or unanimous format.',
  styleRepair:'Distinguish proposer, consulter and approuver.'},
 {lessonId:'b1-03',category:'authority',
  misleadingFrench:'« Le fichier le plus récent est officiellement approuvé. »',
  responsibleFrench:'« Deux versions circulent ; il faut confirmer par écrit laquelle est officielle. »',
  limit:'A file modification date is not administrative authorization.',
  diagnostic:'Technical recency was confused with official authority.',
  challengeFrench:'« Le document daté le plus récemment est automatiquement validé. »',
  additionalVerification:'Request a source-authorized written decision about the official version.',
  styleRepair:'Separate il semble, selon le fichier and a confirmé in a formal correction.'},
 {lessonId:'transfer-31',category:'attribution',
  misleadingFrench:'« Le règlement prouve qu’un voisin précis est responsable des bruits. »',
  responsibleFrench:'« Les bruits sont signalés, mais leur origine et leur auteur restent à vérifier. »',
  limit:'A general building rule plus an unverified report cannot identify responsibility.',
  diagnostic:'Reported experience was rewritten as a personally attributable accusation.',
  challengeFrench:'« Un règlement et une plainte suffisent à nommer un coupable. »',
  additionalVerification:'Separate timestamps and direct observations from hypotheses, then propose mediation.',
  styleRepair:'Use au conditionnel for unverified causes; avoid accusations as direct facts.'},
 {lessonId:'transfer-121',category:'hedge',
  misleadingFrench:'« L’autrice a définitivement approuvé la traduction sans réserve. »',
  responsibleFrench:'« Le brouillon présente plusieurs possibilités et la traduction doit préserver “il me semblait”. »',
  limit:'A draft does not prove author preference; removing an uncertainty marker changes the narrator.',
  diagnostic:'An uncertain narrative voice and provisional editorial record were converted into certainty.',
  challengeFrench:'« La fluidité autorise à supprimer toute hésitation historique. »',
  additionalVerification:'Compare the actual original lines and attributed versions without asserting absent approval.',
  styleRepair:'Preserve the indicative hedge and note competing renderings clearly.'},
 {lessonId:'transfer-148',category:'rights',
  misleadingFrench:'« Des sous-titres affichés en salle peuvent être publiés en ligne sans autre accord. »',
  responsibleFrench:'« L’affichage en salle ne prouve pas que la diffusion en ligne soit autorisée. »',
  limit:'On-site caption rights, actual improvised speech and internet publication need separate verification.',
  diagnostic:'Permission for one use was generalized to a materially different publication.',
  challengeFrench:'« Un texte corrigé et projeté peut être diffusé partout automatiquement. »',
  additionalVerification:'Confirm performance-accurate captions and the explicit distribution scope with rights holders.',
  styleRepair:'Use ne prouve pas and sous réserve de to mark the permission boundary.'},
 {lessonId:'transfer-149',category:'sampling',
  misleadingFrench:'« Quatre habitants sur cinq approuvent le projet et son financement est acquis. »',
  responsibleFrench:'« Quatre-vingts bulletins favorables sur cent réponses volontaires ne prouvent ni l’avis de toute la ville ni le financement. »',
  limit:'A voluntary respondent denominator does not represent all residents or a binding budget vote.',
  diagnostic:'A sample proportion and a proposal were reported as representative approval and secured financing.',
  challengeFrench:'« Cent réponses volontaires représentent forcément chaque habitant. »',
  additionalVerification:'State the actual count, recruitment method and budget decision status.',
  styleRepair:'Use parmi les répondants and reste à confirmer instead of a citywide categorical claim.'},
 {lessonId:'transfer-150',category:'measurement',
  misleadingFrench:'« Chaque visiteur verra exactement soixante météores par heure. »',
  responsibleFrench:'« Le nombre annoncé est un maximum théorique sous conditions favorables, non une garantie individuelle. »',
  limit:'A theoretical forecast and local observed counts depend on cloud cover, site and time interval.',
  diagnostic:'An idealized model was presented as a guaranteed personal measurement.',
  challengeFrench:'« Un maximum scientifique doit être observé partout au même rythme. »',
  additionalVerification:'Record real viewing duration and sky conditions with any reported observation.',
  styleRepair:'Distinguish maximum théorique, observations locales and pourrait.'}
];
const GUIDANCE:readonly [U36StepKind,string,string,U36Audience,readonly string[]][]=[
 ['evidence','Build the evidence ledger',
  'Identify what two actual original witnesses state. Distinguish exact reported speech, a plausible interpretation, and what remains absent or unverifiable.',
  'peer',[
   'Cite a real original witness and copy only an excerpt it genuinely contains.',
   'Mark who said it and whether it is an observed event, proposal, accusation or forecast.',
   'State at least one relevant uncertainty that cannot be resolved from the text alone.'
  ]],
 ['redline','Rewrite and explain the misleading claim',
  'Perform a complete editorial redline in French: reproduce the questionable new claim, diagnose the source mismatch, then publish a carefully qualified correction.',
  'professional',[
   'Identify the altered subject, negation, scope, degree of certainty, rights or denominator.',
   'Compose a new French sentence preserving the historical wording’s limitations.',
   'Explain why the original overclaim could mislead an actual recipient.'
  ]],
 ['counterargument','Respond to a challenging but civil objection',
  'Represent the invented opponent fairly, concede a reasonable concern and rebut only the unsupported part using genuine source records.',
  'public',[
   'Paraphrase the fictional objection without calling it an original quotation.',
   'Explain one legitimate concern worth acknowledging.',
   'Cite actual witness evidence and identify what would still need to be checked.'
  ]],
 ['longform','Produce an independent long-form argument',
  'Write a coherent multi-paragraph French exposition with source-sensitive thesis, well-connected evidence, considered alternative interpretation and conditional conclusion.',
  'public',[
   'Introduce a bounded thesis and provenance.',
   'Develop a separate evidence paragraph with historical witness references.',
   'Respond to a fair counterargument without false equivalence.',
   'End with uncertainty and one proportionate follow-up step.'
  ]],
 ['transfer','Transfer and revise for a new audience',
  'Adapt the same carefully limited claims to an unfamiliar reader or listener. Draft, hide the model, create an independent second version, then compare revisions yourself.',
  'professional',[
   'Change register and structure, but not historical content.',
   'Distinguish a courteous request from an assertion of acceptance.',
   'Self-check that no invented certainty enters the revised version.'
  ]]
];
const GENRES:readonly [U36Genre,string,string,string,readonly string[]][]=[
 ['correspondence','Formal correspondence',
  'A service provider, colleague or decision-maker',
  'Write an actionable request that explains verified concerns and asks for missing confirmation.',
  ['Professional salutation and exact historical context','Verified source assertion with attribution',
   'A precise open question without presuming assent','Courteous, conditional next step']],
 ['report','Evidence-weighted report',
  'A neutral reviewer considering multiple documents',
  'Produce a balanced report separating facts, reported positions, methodological limitations and next checks.',
  ['Attributed original records and source distinctions','A reported fact vs a proposed interpretation',
   'The strongest competing explanation and its evidence','Limitations, verification plan and proportionate conclusion']],
 ['briefing','Public spoken briefing preparation',
  'A mixed, non-specialist audience',
  'Prepare a natural spoken explanation without reading a script word-for-word or claiming a recorded performance.',
  ['Plain-language orientation to the historical text','One genuinely attributed example and a contextual expression',
   'Fair response to an opposing view','Accessible conclusion with honest uncertainty']],
 ['editorial','Independent editorial',
  'Readers evaluating a contested claim',
  'Develop a longer source-grounded argument with civil objections and independent editorial revision.',
  ['Precise, limited proposition','Evidence-based development without invented quotations',
   'Genuine concession and targeted rebuttal','A conditional recommendation, no invented authorization']]
];
const choose=(seed:string,choices:readonly string[]):readonly string[]=>{
 const unique=[...new Set(choices)];
 if(!unique.length)return unique;
 const offset=[...seed].reduce((n,c)=>n+c.charCodeAt(0),0)%unique.length;
 return Object.freeze([...unique.slice(offset),...unique.slice(0,offset)]);
};
const locatorKeys=(...locators:string[])=>Object.freeze([...new Set(locators)]);
function pairsOf(base:U35Journey):readonly U36SourcePair[]{
 return Object.freeze(base.pairs.map((pair):U36SourcePair=>({
  id:'u36:'+pair.id,first:pair.first,second:pair.second,
  label:pair.relation==='independent-written-records'?'separately-attributed-records':
   pair.relation==='cross-medium'?'cross-media':'same-dialogue',
  limitation:pair.caveat
 })));
}
export function originalU36Longform(id:string):U36Journey|null{
 const base=originalU35Synthesis(id),entry=getOriginalCatalogEntry(id);
 if(!base||!entry||!base.witnesses.length)return null;
 const caseTeaching=AUTHORED_CASES.find(item=>item.lessonId===id)??null;
 const first=base.witnesses.find(w=>w.kind==='dialogue')??base.witnesses[0];
 const second=base.witnesses.find(w=>w.kind==='document')??
  base.witnesses.find(w=>w.kind==='reading')??
  base.witnesses.find(w=>w.locator!==first.locator)??first;
 const witnessLocators=locatorKeys(first.locator,second.locator);
 const level=base.level;
 const paragraphBase=level==='A1'?1:level==='A2'?2:level==='B1'?3:level==='B1+'?4:5;
 const stages:U36Step[]=GUIDANCE.map(([kind,title,assignment,audience,questions],i)=>({
  id:'u36:'+id+':'+kind,kind,title,assignment:
   kind==='redline'&&caseTeaching?assignment+
    ' Fictional statement to correct: '+caseTeaching.misleadingFrench:
   kind==='counterargument'&&caseTeaching?assignment+
    ' Fictional opposition: '+caseTeaching.challengeFrench:assignment,
  audience,guidingQuestions:questions,
  editorExample:caseTeaching?
    kind==='redline'?caseTeaching.responsibleFrench:
    kind==='evidence'?'« Selon la source, il faut distinguer les propos rapportés de mon interprétation. »':
    kind==='counterargument'?'« Cette objection est compréhensible. Pourtant, le document ne suffit pas à confirmer cette conclusion. »':
    kind==='longform'?caseTeaching.responsibleFrench:
    '« Pourriez-vous confirmer les éléments qui restent à vérifier ? »':
    '« Selon le document original, une conclusion exige de distinguer les faits et les hypothèses. »',
  sourceLocators:witnessLocators,
  sourceGuard:caseTeaching?.limit??'Original source attribution does not authorize unsupported inference.',
  paragraphGuidance:Math.max(1,paragraphBase+(i>1?1:0))
 }));
 const genreAssignments:U36GenreAssignment[]=GENRES.map(([genre,title,audience,purpose,constraints])=>({
  genre,title,audience,purpose,constraints,sourceLocators:witnessLocators,
  shortModel:caseTeaching?genre==='correspondence'?
    '« Bonjour, je vous écris pour demander une confirmation. » '+caseTeaching.responsibleFrench:
   genre==='report'?'« Le dossier exige de distinguer les données de leur interprétation. » '+caseTeaching.responsibleFrench:
   genre==='briefing'?'« Voici ce que la source permet de conclure. » '+caseTeaching.responsibleFrench:
   '« Une analyse responsable préserve les faits et leurs limites. » '+caseTeaching.responsibleFrench:
   '« Selon la source citée, certains faits sont établis, mais d’autres points doivent être confirmés. »'
 }));
 const decisions:U36Decision[]=[];
 if(caseTeaching){
  const fixed=caseTeaching.responsibleFrench;
  const wrong=caseTeaching.misleadingFrench;
  const distractor='« La nouvelle objection fictive est une citation historique du dialogue original. »';
  decisions.push({
   id:'u36:'+id+':editorial-repair',
   question:'Which precise French revision keeps the original source’s limits?',
   answer:fixed,choices:choose(id+':edit',[fixed,wrong,distractor]),
   why:caseTeaching.limit+' '+caseTeaching.diagnostic,
   misconceptions:{
    [wrong]:'This repeats the new inaccurate overclaim. '+caseTeaching.diagnostic,
    [distractor]:'The fictional U36 opponent is not an original speaker or historical witness.'
   },witnessLocators
  });
  const sound=caseTeaching.additionalVerification;
  const wrongVerify='The fictional editor’s objection proves the source claim is historically true.';
  const blank='No historical provenance is needed when an argument sounds persuasive.';
  decisions.push({
   id:'u36:'+id+':verification',
   question:'What genuine verification should accompany the revised argument?',
   answer:sound,choices:choose(id+':verification',[sound,wrongVerify,blank]),
   why:caseTeaching.limit+' The requested verification is a teaching recommendation, not proof that it happened.',
   misconceptions:{
    [wrongVerify]:'New debate teaching content is not historical verification.',
    [blank]:'Attribution remains essential even when prose sounds plausible.'
   },witnessLocators
  });
  decisions.push({
   id:'u36:'+id+':register',
   question:'Which register repair prevents the specific misleading interpretation?',
   answer:caseTeaching.styleRepair,
   choices:choose(id+':register',[caseTeaching.styleRepair,
    'Present this hypothetical challenge as an approved and authoritative original statement.',
    'Remove all uncertainty, conditions or negation to make the text stronger.']),
   why:caseTeaching.diagnostic+' '+caseTeaching.styleRepair,
   misconceptions:{
    'Present this hypothetical challenge as an approved and authoritative original statement.':
     'An invented exercise dialogue does not acquire original authority from confident formatting.',
    'Remove all uncertainty, conditions or negation to make the text stronger.':
     'Removing qualification may reverse meaning or manufacture factual certainty.'
   },witnessLocators
  });
 }
 const pairs=pairsOf(base);
 if(pairs.length){
  const pair=pairs[0],a=base.witnesses.find(w=>w.locator===pair.first),
   b=base.witnesses.find(w=>w.locator===pair.second);
  if(a&&b&&a.label!==b.label)decisions.push({
   id:'u36:'+id+':attribution',
   question:'Which genuine original record supplies the SECOND displayed excerpt?',
   answer:b.label,choices:choose(id+':source',[b.label,a.label,'An invented U36 editor']),
   why:'The second cited witness is '+b.label+'. '+pair.limitation,
   misconceptions:{
    [a.label]:'This names the FIRST original source, not the displayed second source.',
    'An invented U36 editor':'Practice opponents are not original documents.'
   },witnessLocators:locatorKeys(a.locator,b.locator)
  });
 }
 return Object.freeze({
  lessonId:id,qualifiedSourceId:entry.qualifiedId,sourceRevision:entry.sourceRevision,
  title:base.title,level,witnesses:base.witnesses,
  pairings:pairs,curated:!!caseTeaching,
  sourceGuard:caseTeaching?.limit??'Do not extend original quoted words into unsupported conclusions.',
  stages:Object.freeze(stages),genreAssignments:Object.freeze(genreAssignments),
  decisions:Object.freeze(decisions),caseTeaching,originalAuthority:'u23-original-sources'
 });
}
export function compareU36AuthoredChoice(
 decision:U36Decision,response:string
):{readonly matched:boolean;readonly message:string}{
 const normalize=(value:string)=>value.normalize('NFC').replace(/[‘’]/g,"'").trim().toLocaleLowerCase('fr');
 const matched=normalize(decision.answer)===normalize(response);
 const misconception=Object.entries(decision.misconceptions)
  .find(([value])=>normalize(value)===normalize(response))?.[1];
 return {matched,message:(matched?'Matches the narrow authored textual key. ':
  (misconception??'Not this authored key; review the original witness.')+' ')+decision.why+
  ' This does not measure free-text French ability or native CEFR mastery.'};
}
export const U36_CURATED_SOURCE_CASES:readonly string[]=Object.freeze(AUTHORED_CASES.map(x=>x.lessonId));
