import {originalU32Discourse,type U32Witness} from './u32-discourse.ts';
import {getOriginalCatalogEntry,type OriginalLevel} from './u23-registry.ts';

/** U33 editorial prompts are new authored exercises, never claimed as original quotations. */
export type U33Stage='thesis'|'evidence'|'objection'|'repair'|'synthesis';
export interface U33SourceCheck {
 readonly id:string;readonly question:string;readonly answer:string;
 readonly options:readonly string[];readonly witnessLocators:readonly string[];
 readonly explanation:string;readonly errors:Readonly<Record<string,string>>;
}
export interface U33StagePlan {
 readonly stage:U33Stage;readonly title:string;readonly task:string;
 readonly scaffold:string;readonly authoredExample:string;readonly witnesses:readonly string[];
}
export interface U33Journey {
 readonly id:string;readonly title:string;readonly level:OriginalLevel;readonly qualifiedId:string;
 readonly sourceRevision:string;readonly scenario:string;readonly targetAudience:string;
 readonly topic:string;readonly thesis:string;readonly objection:string;readonly guard:string;
 readonly stages:readonly U33StagePlan[];readonly checks:readonly U33SourceCheck[];
 readonly witnesses:readonly U32Witness[];readonly independentDocuments:boolean;readonly curated:boolean;
 readonly paragraphGoal:number;readonly sentenceGoal:number;
}
type Brief=readonly [string,string,string,string,string,string,string,string];
/** ID, audience, topic, warranted thesis, hypothetical objection, guard, faulty claim, model repair. */
const BRIEFS:readonly Brief[]=[
 ['a1-01','Friends and university reception','Polite introductions',
  '« Et toi ? » returns a question about wellbeing.','A greeting requires personal career details.',
  'Do not invent an occupation or require disclosure.','Malik demande le métier d’Inès.',
  '« Il demande comment va Inès, pas son métier. »'],
 ['a1-02','Students and reception staff','Inclusive pronouns',
  '« Nous sommes tous étudiants » describes the particular group.',
  'All of Paris must therefore be students.','The statement does not describe a whole city.',
  'Tous les Parisiens sont étudiants.',
  '« Le pronom nous désigne le groupe, pas toute la ville. »'],
 ['a2-01','Friends and a neutral recap audience','Past-tense event integrity',
  'Émile started a film but did not finish because he fell asleep.',
  'He certainly watched every minute.','Preserve the negative claim and the stated reason.',
  'Émile a fini le film.','« Il ne l’a pas terminé, car il s’est endormi. »'],
 ['a2-15','Roommates and housing advisers','Housing trade-offs',
  'A larger first apartment is more expensive while the second has different advantages.',
  'Size alone determines the better apartment.','Relative features do not establish exact prices.',
  'Le plus grand appartement est forcément le meilleur.',
  '« Il est plus grand, mais plus cher ; comparons aussi la proximité. »'],
 ['a2-17','Hotel staff and an impartial booking summary','Reservation versus request',
  'A polite request for a revised price is not a confirmed reservation.',
  'A price enquiry proves that the booking changed.','Ask for the specific written confirmation.',
  'La nouvelle réservation est déjà confirmée.',
  '« Pourriez-vous confirmer par écrit le prix et la date ? »'],
 ['b1-01','Meeting participants and a public notice','Last-Friday-bus constraint',
  'The Friday last bus leaves earlier; a meeting-time change is proposed.',
  'The whole Friday transit network was cancelled.','Do not invent a service-wide cancellation or agreement.',
  'Le réseau de bus est entièrement annulé.',
  '« Le dernier bus part plus tôt ; nous devons consulter les participants. »'],
 ['b1-02','Hybrid meeting attendees and a neutral chair','Consultation before consensus',
  'Omar proposes different formats and asks for participant preferences.',
  'Everybody already endorsed a hybrid meeting.','A consultation proposal is not a binding vote.',
  'Tous ont accepté la nouvelle formule.',
  '« Une solution est proposée, mais les préférences restent à confirmer. »'],
 ['b1-03','Colleagues and a formal office notice','Document status',
  'Two versions exist without confirmed official authority.',
  'The newer file is automatically authoritative.','Date and administrative authorization are separate.',
  'La version récente est officiellement validée.',
  '« Il faut demander la confirmation écrite de la version officielle. »'],
 ['transfer-31','Residents, mediator and neutral audience','Noise evidence',
  'Noise, a quiet-hours rule and suspected responsibility must stay distinct.',
  'The regulation proves the neighbor moved furniture.','No specific resident is proven responsible.',
  'Le voisin est certainement responsable.',
  '« Nous avons entendu des sons, mais leur cause reste à vérifier. »'],
 ['transfer-121','Translators and theatre editors','Translation uncertainty',
  'Removing « il me semblait » changes the narrator’s degree of certainty.',
  'A draft proves the absent author preferred the first version.',
  'Neither version is independently shown to be preferred by the author.',
  'L’autrice a approuvé la première traduction.',
  '« Le brouillon présente des possibilités, pas un choix prouvé. »'],
 ['transfer-148','Caption editors and rights reviewers','Performance and publication rights',
  'Dropped negation, improvisation and limited display consent require separate checks.',
  'Permission to display captions in the hall covers online publication.',
  'Venue display and web publication have distinct authorization scopes.',
  'La publication en ligne est déjà autorisée.',
  '« L’affichage en salle n’autorise pas automatiquement la diffusion en ligne. »'],
 ['transfer-149','Garden organizers, residents and council','Voluntary survey denominator',
  '80 favorable voluntary ballots among 100 are not a citywide representative vote.',
  'Four in five residents voted yes and financing is secured.',
  'Respondents, all residents and budget approval are distinct.',
  'Toute la ville a approuvé le projet.',
  '« Parmi cent réponses volontaires, quatre-vingts étaient favorables. »'],
 ['transfer-150','Astronomy volunteers and local media','Forecast versus local observation',
  'A theoretical maximum is conditional on favorable conditions.',
  'Every visitor will observe sixty meteors tonight.',
  'Different clouds, locations and observation periods limit comparison.',
  'Chacun verra soixante étoiles filantes.',
  '« Il s’agit d’un maximum théorique, non d’une garantie personnelle. »']
];
const TITLES:readonly [U33Stage,string,string,string][]=[
 ['thesis','Present a qualified thesis','Write your own introduction and make the source attribution explicit.','What original speaker, passage or attributed record supports this thesis?'],
 ['evidence','Develop evidence and counterevidence','Add a separate paragraph distinguishing what the original French establishes from what it cannot establish.','Point to a verifiable original witness; do not invent an independent record.'],
 ['objection','Represent the strongest fair objection','State the new hypothetical editor objection sympathetically before answering it without assigning it to an original participant.','What does the objection get right, and where does it outrun evidence?'],
 ['repair','Repair an exaggeration','Correct the misleading sentence; preserve negation, conditions, attribution, uncertainty and audience-appropriate register.','Which claim needs confirmation, and what honest statement can you make now?'],
 ['synthesis','Give an independent audience briefing','Produce a sustained structured explanation and a proportionate next step, first as notes then aloud without reading.','Does the synthesis distinguish evidence, interpretation, objection and uncertainty?']
];
function mix(seed:string,words:readonly string[]):readonly string[]{
 const unique=[...new Set(words)],n=[...seed].reduce((s,c)=>s+c.charCodeAt(0),0)%unique.length;
 return Object.freeze([...unique.slice(n),...unique.slice(0,n)]);
}
export function originalU33Editorial(id:string):U33Journey|null {
 const base=originalU32Discourse(id),entry=getOriginalCatalogEntry(id);
 if(!base||!entry)return null;
 const authored=BRIEFS.find(b=>b[0]===id);
 const [_,audience,topic,thesis,objection,guard,faulty,repair]=authored??[
  id,'A conversation partner and careful public audience',base.caseTitle,base.caseDescription,
  'The first reading must be the only correct interpretation.',
  'Do not conflate new hypothetical comments with the original source.',
  'La source prouve automatiquement cette interprétation.',
  '« Selon ce document, il reste des points à vérifier. »'
 ];
 const witnesses=base.witnesses;
 const dialogues=witnesses.filter(w=>w.kind==='dialogue');
 if(!dialogues.length)return null;
 const primary=dialogues[0],docs=witnesses.filter(w=>w.kind==='document');
 const reading=witnesses.filter(w=>w.kind==='reading');
 const secondary=docs[0]??reading[0]??dialogues[1]??primary;
 const frenchExamples=[
  '« Selon '+primary.label+', il convient de distinguer les paroles et mon interprétation. »',
  '« Le passage original apporte une précision importante, mais ne prouve pas toutes les hypothèses. »',
  '« Je comprends cette objection. Cependant, la source ne permet pas cette conclusion sans réserve. »',
  repair,
  '« En conclusion, nous pouvons proposer une démarche prudente et vérifier les éléments manquants. »'
 ];
 const stages=TITLES.map(([stage,title,task,scaffold],i):U33StagePlan=>({
  stage,title,task,scaffold,
  authoredExample:frenchExamples[i],
  witnesses:Object.freeze(i===0?[primary.locator]:i===2?[secondary.locator]:
   [...new Set([primary.locator,secondary.locator])])
 }));
 const checks:U33SourceCheck[]=[];
 if(authored){
  const incorrect='Le nouveau commentaire de l’éditeur figure mot pour mot dans le dialogue original.';
  checks.push({
   id:'u33:'+id+':claim',question:'Which qualified editorial claim is supported, rather than the exaggerated alternative?',
   answer:thesis,options:mix(id+':claim',[thesis,faulty,incorrect]),
   witnessLocators:[primary.locator],
   explanation:guard+' The editorial teaching examples are new, not original dialogue.',
   errors:{[faulty]:'The exaggerated claim exceeds the original evidence.',
    [incorrect]:'The fictional editor objection is not a source quotation.'}
  });
  checks.push({
   id:'u33:'+id+':repair',question:'Which French sentence responsibly repairs the exaggerated claim?',
   answer:repair,options:mix(id+':repair',[repair,
    '« '+faulty+' »',
    '« Ce commentaire imaginaire est une preuve historique. »']),
   witnessLocators:[primary.locator,secondary.locator],
   explanation:'This response is an authored model correction, not a verbatim original source.',
   errors:{['« '+faulty+' »']:'Repeating the overclaim is not an editorial correction.',
    '« Ce commentaire imaginaire est une preuve historique. »':'An invented challenge cannot count as historical evidence.'}
  });
 }
 if(secondary.locator!==primary.locator&&secondary.label!==primary.label)checks.push({
  id:'u33:'+id+':provenance',question:'Which actual original record provides the first displayed witness?',
  answer:primary.label,
  options:mix(id+':provenance',[primary.label,secondary.label,'The imagined editorial objection']),
  witnessLocators:[primary.locator,secondary.locator],
  explanation:'The first evidence excerpt comes from '+primary.label+
   '. A source is attributed, not automatically verified.',
  errors:{[secondary.label]:'This is the other displayed original record.',
   'The imagined editorial objection':'The editor objection is newly written for practice, not original evidence.'}
 });
 return Object.freeze({
  id,title:base.caseTitle,level:entry.level,qualifiedId:entry.qualifiedId,
  sourceRevision:entry.sourceRevision,scenario:base.caseDescription,
  targetAudience:audience,topic,thesis,objection,guard,
  stages:Object.freeze(stages),checks:Object.freeze(checks),
  witnesses:Object.freeze(witnesses),independentDocuments:docs.length>=2,
  curated:!!authored,
  paragraphGoal:entry.level==='A1'?2:entry.level==='A2'?3:entry.level==='B1'?4:5,
  sentenceGoal:entry.level==='A1'?4:entry.level==='A2'?6:entry.level==='B1'?8:12
 });
}
export function compareU33EditorialKey(item:U33SourceCheck,response:string):{
 readonly matched:boolean;readonly feedback:string
}{
 const clean=(s:string)=>s.normalize('NFC').replace(/[’‘]/g,"'").trim().toLowerCase();
 const matched=clean(response)===clean(item.answer);
 return {matched,feedback:matched?item.explanation+
  ' This is an authored text key, not an evaluation of free speech.':
  (Object.entries(item.errors).find(([s])=>clean(s)===clean(response))?.[1]??
   'The selected answer is not the limited authored key.')+' '+item.explanation};
}
export const U33_CURATED_CASE_IDS:readonly string[]=Object.freeze(BRIEFS.map(x=>x[0]));
