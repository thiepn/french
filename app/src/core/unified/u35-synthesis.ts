import {originalU34Debate,type U34Journey,type U34Genre} from './u34-debate.ts';
import type {U32Witness} from './u32-discourse.ts';
import {getOriginalCatalogEntry,type OriginalLevel} from './u23-registry.ts';

/**
 * U35 is an original content-and-presentation layer. Authentic witness
 * locators/IDs, source rights and revision authority belong solely to U23–U34.
 * No new progress, review, grade, scheduling or drafting store.
 */
export type U35TaskKind='verify'|'repair'|'argue'|'transfer';
export type U35Audience='peer'|'professional'|'public';
export interface U35SourcePair {
 readonly id:string;readonly title:string;readonly first:string;readonly second:string;
 readonly relation:'independent-written-records'|'cross-medium'|'same-dialogue';
 readonly caveat:string;
}
export interface U35Step {
 readonly id:string;readonly kind:U35TaskKind;readonly title:string;
 readonly audience:U35Audience;readonly task:string;readonly sourceLocators:readonly string[];
 readonly prompts:readonly string[];readonly authoredIllustration:string;readonly limitation:string;
 readonly expectedParagraphs:number;
}
export interface U35SourceDecision {
 readonly id:string;readonly question:string;readonly answer:string;readonly options:readonly string[];
 readonly sourceLocators:readonly string[];readonly explanation:string;
 readonly misconception:Readonly<Record<string,string>>;
}
export interface U35Journey {
 readonly lessonId:string;readonly title:string;readonly qualifiedId:string;
 readonly level:OriginalLevel;readonly sourceRevision:string;readonly curated:boolean;
 readonly witnesses:readonly U32Witness[];readonly pairs:readonly U35SourcePair[];
 readonly steps:readonly U35Step[];readonly decisions:readonly U35SourceDecision[];
 readonly originalAuthority:'u23-qualified-original';
 readonly minimumSentenceGuidance:number;
}
type EditorialCase=Readonly<{
 lessonId:string;overclaim:string;repair:string;scope:string;
 audience:string;consequence:string;challenge:string;
}>;
const EDITORIAL_CASES:readonly EditorialCase[]=[
 {lessonId:'a1-01',overclaim:'« Il faut toujours donner son métier quand on répond à une salutation. »',
  repair:'« Une salutation ne donne pas le droit d’exiger des informations personnelles. »',
  scope:'The original « Et toi ? » concerns wellbeing, not work or identity.',
  audience:'un nouveau visiteur de l’université',
  consequence:'respecter une personne qui préfère ne pas répondre',
  challenge:'« On ne peut pas être poli sans demander le métier de l’autre. »'},
 {lessonId:'a1-02',overclaim:'« Tous les Parisiens sont étudiants parce qu’Aya dit nous. »',
  repair:'« Aya parle de son groupe, pas de tous les habitants de Paris. »',
  scope:'Nous and tous refer to the described group, not a citywide statistic.',
  audience:'une équipe d’accueil étudiant',
  consequence:'présenter le groupe sans attribuer une caractéristique à toute la ville',
  challenge:'« Le pronom nous veut dire que tout Paris étudie. »'},
 {lessonId:'a2-01',overclaim:'« Émile a terminé le film qu’il a regardé hier soir. »',
  repair:'« Il a commencé le film, mais il ne l’a pas terminé : il s’est endormi. »',
  scope:'Preserve completed actions and explicit negation; do not infer the ending was seen.',
  audience:'un ami qui a manqué la conversation',
  consequence:'raconter les événements sans supprimer la négation',
  challenge:'« Le passé composé signifie forcément que le film a été terminé. »'},
 {lessonId:'a2-15',overclaim:'« Le plus grand appartement est automatiquement le meilleur et le moins cher. »',
  repair:'« Le premier est plus grand mais plus cher ; le deuxième est plus proche de la gare. »',
  scope:'Comparison does not establish numerical prices or confirmed availability.',
  audience:'un conseiller en logement',
  consequence:'comparer plusieurs critères avant de recommander un appartement',
  challenge:'« La superficie suffit à décider pour tous les locataires. »'},
 {lessonId:'a2-17',overclaim:'« Une demande de prix confirme la nouvelle réservation. »',
  repair:'« La cliente demande une modification ; la confirmation du prix et de la date manque encore. »',
  scope:'A question or proposed change is not a response from the hotel.',
  audience:'le service de réservation',
  consequence:'demander une confirmation écrite sans inventer un accord',
  challenge:'« L’hôtel a sûrement accepté puisque la cliente a demandé. »'},
 {lessonId:'b1-01',overclaim:'« Tous les bus du vendredi ont été supprimés et la réunion est annulée. »',
  repair:'« Le dernier bus part plus tôt ; le groupe envisage un horaire de réunion différent. »',
  scope:'An earlier final bus does not imply network cancellation or group agreement.',
  audience:'les participants à la réunion',
  consequence:'proposer un horaire puis confirmer les disponibilités',
  challenge:'« Une difficulté de transport prouve que l’événement doit être annulé. »'},
 {lessonId:'b1-02',overclaim:'« Tous les membres ont voté pour une réunion hybride. »',
  repair:'« Omar propose des solutions et souhaite demander les préférences de chacun. »',
  scope:'No final vote or unanimous decision is established.',
  audience:'la personne qui organise la réunion',
  consequence:'consulter le groupe avant de publier une décision',
  challenge:'« Demander l’avis des membres signifie qu’ils ont déjà accepté. »'},
 {lessonId:'b1-03',overclaim:'« Le fichier le plus récent est la version officielle approuvée. »',
  repair:'« Deux versions circulent ; l’autorité de la version officielle doit être confirmée par écrit. »',
  scope:'Modification date and administrative approval are distinct.',
  audience:'une collègue chargée des documents',
  consequence:'demander une confirmation d’autorité avant toute publication',
  challenge:'« La date d’un fichier vaut approbation de la direction. »'},
 {lessonId:'transfer-31',overclaim:'« Le règlement prouve qu’un voisin précis est responsable des bruits. »',
  repair:'« Des bruits ont été signalés, mais leur origine et la responsabilité restent inconnues. »',
  scope:'A rule, an observation and a suspected explanation are not equivalent evidence.',
  audience:'les habitants et une médiatrice',
  consequence:'organiser un échange sans accusation non vérifiée',
  challenge:'« Une plainte suffit pour identifier définitivement le responsable. »'},
 {lessonId:'transfer-121',overclaim:'« L’autrice a officiellement choisi la traduction sans hésitation. »',
  repair:'« Le brouillon présente plusieurs possibilités ; “il me semblait” exprime une réserve à préserver. »',
  scope:'Neither the translator’s draft nor its fluency proves the absent author’s preference.',
  audience:'une responsable éditoriale',
  consequence:'conserver la nuance et attribuer chaque version',
  challenge:'« Rendre une phrase fluide justifie toujours d’effacer les réserves. »'},
 {lessonId:'transfer-148',overclaim:'« L’accord de sous-titrage en salle autorise automatiquement la diffusion en ligne. »',
  repair:'« L’affichage en salle et la publication en ligne nécessitent des vérifications de droits distinctes. »',
  scope:'On-site use, improvised actual speech and digital redistribution are different questions.',
  audience:'une équipe de sous-titrage et les ayants droit',
  consequence:'vérifier la négation, la performance et les autorisations avant diffusion',
  challenge:'« Une phrase corrigée est nécessairement autorisée à être publiée. »'},
 {lessonId:'transfer-149',overclaim:'« Quatre habitants sur cinq ont voté oui et le budget municipal est acquis. »',
  repair:'« Parmi cent bulletins volontaires, quatre-vingts étaient favorables ; le financement reste à confirmer. »',
  scope:'The denominator is voluntary ballots, not all residents; interest is not a budget vote.',
  audience:'un conseil municipal et les habitants',
  consequence:'publier le dénominateur, les biais et le statut réel du financement',
  challenge:'« Un sondage volontaire est toujours représentatif de toute la commune. »'},
 {lessonId:'transfer-150',overclaim:'« Chaque visiteur verra exactement soixante météores par heure. »',
  repair:'« Soixante correspond à un maximum théorique conditionnel ; les observations locales dépendent du ciel et de la durée. »',
  scope:'An ideal-condition upper bound is not a site-specific personal guarantee.',
  audience:'les visiteurs d’une soirée d’astronomie',
  consequence:'publier ensemble prévision, météo et durée des observations',
  challenge:'« Un chiffre scientifique doit être garanti pour chaque personne. »'}
];
function unique(locators:readonly string[]):readonly string[]{return Object.freeze([...new Set(locators)]);}
function rotate(seed:string,values:readonly string[]):readonly string[]{
 const data=[...new Set(values)];if(data.length<2)return data;
 const index=[...seed].reduce((sum,c)=>sum+c.charCodeAt(0),0)%data.length;
 return Object.freeze([...data.slice(index),...data.slice(0,index)]);
}
function makePairs(source:U34Journey):readonly U35SourcePair[]{
 const docs=source.witnesses.filter(w=>w.kind==='document');
 const reading=source.witnesses.filter(w=>w.kind==='reading');
 const dialog=source.witnesses.filter(w=>w.kind==='dialogue');
 const pairs:U35SourcePair[]=[];
 const add=(first:U32Witness,second:U32Witness,relation:U35SourcePair['relation'],caveat:string)=>{
  if(first.locator===second.locator)return;
  const id='u35:'+source.lessonId+':pair:'+first.locator+'::'+second.locator;
  pairs.push({id,title:first.label+' ↔ '+second.label,first:first.locator,second:second.locator,relation,caveat});
 };
 if(docs.length>1)add(docs[0],docs[1],'independent-written-records',
  'Two separately attributed written records can disagree and need not verify each other.');
 if(reading.length&&docs.length)add(reading[0],docs[0],'cross-medium',
  'The connected reading and original document have distinct authorial roles; do not assume independent publication merely from separate rendering.');
 if(dialog.length&&docs.length)add(dialog[0],docs[0],'cross-medium',
  'Original speaker-turn claims and a separately attributed written document are not interchangeable.');
 if(!pairs.length&&reading.length&&dialog.length)add(reading[0],dialog[0],'cross-medium',
  'Reading and dialogue belong to the original authored teaching; distinct formats alone do not prove independent publication.');
 if(!pairs.length&&dialog.length>1)add(dialog[0],dialog[1],'same-dialogue',
  'Both quotations belong to the SAME original dialogue and are not independent historical sources.');
 return Object.freeze(pairs);
}
export function originalU35Synthesis(id:string):U35Journey|null{
 const source=originalU34Debate(id),entry=getOriginalCatalogEntry(id);
 if(!source||!entry||!source.witnesses.length)return null;
 const scenario=EDITORIAL_CASES.find(x=>x.lessonId===id);
 const primary=source.witnesses.find(w=>w.kind==='dialogue')??source.witnesses[0];
 const alternate=source.witnesses.find(w=>w.kind==='document')??
  source.witnesses.find(w=>w.kind==='reading')??
  source.witnesses.find(w=>w.locator!==primary.locator)??primary;
 const title=source.topic;
 const realSource=unique([primary.locator,alternate.locator]);
 const taskStages:readonly [U35TaskKind,string,string,U35Audience][]=[
  ['verify','Identify warranted claims',
   'List the actual claims in the selected original source and classify each as observation, reported speech, proposal or uncertainty. State what the source does NOT establish.','peer'],
  ['repair','Correct a misleading account',
   'Rewrite the overclaim in accurate, natural French. Explain which source words limit the inference, which facts remain unknown, and how your correction avoids misleading readers.','professional'],
  ['argue','Defend a multi-paragraph position',
   'Make a bounded thesis, analyze real original evidence, concede a legitimate opposing concern, answer a hypothetical hostile-but-civil challenge and propose conditional next steps.','public'],
  ['transfer','Recontextualize for a real audience',
   'Transform your source-grounded argument into a courteous professional request, a neutral analysis, a spoken public briefing and a short independent editorial. Preserve the same factual boundaries.','professional']
 ];
 const paragraphs=entry.level==='A1'?1:entry.level==='A2'?2:entry.level==='B1'?3:4;
 const promptsByKind:Readonly<Record<U35TaskKind,readonly string[]>>={
  verify:['Name the exact original speaker or document.','Find the strongest direct wording and its scope.',
   'Describe one fact the original source does not establish.'],
  repair:['Identify a change of negation, source attribution, sample scope, conditions or permission.',
   'Use a specific original witness to justify your correction.',
   'Explain to your reader why the inaccurate claim was tempting.'],
  argue:['Advance a source-bounded thesis and direct evidence.','Give the fair version of an opposing view.',
   'Respond civilly, distinguish evidence and inference, and preserve uncertainty.',
   'Offer a responsible conditional next step.'],
  transfer:['Service: make a precise courteous request.','Report: separate observed data and interpretation.',
   'Briefing: speak clearly without reading and mark uncertainty.','Editorial: defend a proportionate view with rebuttal.']
 };
 const steps=taskStages.map(([kind,stageTitle,task,audience],i):U35Step=>({
  id:'u35:'+id+':'+kind,kind,title:stageTitle,audience,
  task:(scenario&&kind==='repair'?task+' Repair this U35 fictional misleading claim: '+scenario.overclaim:
   kind==='argue'&&scenario?task+' A fictional opponent says: '+scenario.challenge:task),
  sourceLocators:realSource,prompts:promptsByKind[kind],
  authoredIllustration:scenario?
   kind==='verify'?'« Selon '+primary.label+', il faut préciser la portée de l’affirmation. »':
   kind==='repair'?scenario.repair:
   kind==='argue'?'« Je comprends cette objection, cependant '+scenario.scope+' »':
   '« Bonjour, je souhaiterais confirmer les faits et agir sans dépasser les sources disponibles. »':
   '« Selon la source originale, cette interprétation reste limitée et nécessite une vérification. »',
  limitation:scenario?.scope??'The attributed original source does not automatically verify claims beyond its wording.',
  expectedParagraphs:Math.max(1,paragraphs+(i>=2?1:0))
 }));
 const checks:U35SourceDecision[]=[];
 if(scenario){
  const original=unique([primary.locator,alternate.locator]);
  checks.push({
   id:'u35:'+id+':repair-choice',
   question:'Which new editorial sentence corrects the misleading claim without asserting facts beyond the original material?',
   answer:scenario.repair,
   options:rotate(id+':repair',[scenario.repair,scenario.overclaim,scenario.challenge]),
   sourceLocators:original,explanation:scenario.scope+' Practical transfer: '+scenario.consequence+'.',
   misconception:{
    [scenario.overclaim]:'This repeats the inaccurate claim rather than repairing its factual scope.',
    [scenario.challenge]:'This is a fictional adversarial challenge and not a historically attested source quotation.'
   }
  });
  const sourceScope='This statement is the authorial original-source limit, not an independent eyewitness testimony.';
  checks.push({
   id:'u35:'+id+':scope',
   question:'Which limitation must remain explicit when moving the story into another audience or genre?',
   answer:scenario.scope,
   options:rotate(id+':scope',[scenario.scope,
    'The U35 hypothetical opponent is an original eyewitness.',
    'A single source automatically proves all causal and administrative interpretations.']),
   sourceLocators:original,explanation:sourceScope+' '+scenario.scope,
   misconception:{
    'The U35 hypothetical opponent is an original eyewitness.':
     'U35 adversarial remarks are newly written learning prompts, not archival testimony.',
    'A single source automatically proves all causal and administrative interpretations.':
     'Original source attribution does not establish that every inferred conclusion is true.'
   }
  });
 }
 const pairs=makePairs(source);
 if(pairs.length){
  const first=pairs[0];
  const a=source.witnesses.find(w=>w.locator===first.first)!;
  const b=source.witnesses.find(w=>w.locator===first.second)!;
  if(a.label!==b.label)checks.push({
   id:'u35:'+id+':attribution',
   question:'Which original source supplies the second displayed comparison excerpt?',
   answer:b.label,
   options:rotate(id+':attribution',[a.label,b.label,'U35 fictional editor']),
   sourceLocators:unique([a.locator,b.locator]),
   explanation:'The second excerpt belongs to '+b.label+'. '+first.caveat,
   misconception:{[a.label]:'This is the first original source, not the second.',
    'U35 fictional editor':'An invented editorial counterargument is not an original document.'}
  });
 }
 return Object.freeze({
  lessonId:id,title,qualifiedId:entry.qualifiedId,level:entry.level,
  sourceRevision:entry.sourceRevision,curated:!!scenario,
  witnesses:Object.freeze(source.witnesses),pairs,steps:Object.freeze(steps),
  decisions:Object.freeze(checks),
  originalAuthority:'u23-qualified-original',
  minimumSentenceGuidance:entry.level==='A1'?4:entry.level==='A2'?6:entry.level==='B1'?8:12
 });
}
export function compareU35AuthoredKey(decision:U35SourceDecision,value:string):{
 readonly matched:boolean;readonly explanation:string
}{
 const normalize=(s:string)=>s.normalize('NFC').replace(/[‘’]/g,"'").trim().toLocaleLowerCase('fr');
 const matched=normalize(decision.answer)===normalize(value);
 const correction=Object.entries(decision.misconception).find(([option])=>normalize(option)===normalize(value))?.[1];
 return {matched,explanation:(matched?'Matches the narrow authored choice key. ':
  (correction??'Not the authored response key.')+' ')+decision.explanation+
  ' This check does not grade independent French writing or assign proficiency.'};
}
export const U35_ORIGINAL_CURATED_IDS:readonly string[]=Object.freeze(EDITORIAL_CASES.map(x=>x.lessonId));
