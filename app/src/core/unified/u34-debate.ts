import {originalU33Editorial,type U33Journey} from './u33-editorial.ts';
import {getOriginalCatalogEntry,type OriginalLevel,type OriginalSurface} from './u23-registry.ts';
import type {U32Witness} from './u32-discourse.ts';

/** All new objects are read-only editorial teaching prompts. Original source
 * locators remain unchanged; U34 ids are temporary activity identifiers only. */
export type U34Genre='service'|'analysis'|'briefing'|'editorial';
export type U34Move='assert'|'press'|'concede'|'counter'|'reconcile';
export interface U34Claim{
 readonly id:string;
 readonly role:'claim'|'evidence'|'counterclaim'|'rebuttal'|'limit';
 readonly label:string;readonly coaching:string;
 readonly sourceLocators:readonly string[];
 readonly original:Boolean;
}
export interface U34Turn{
 readonly id:string;readonly move:U34Move;readonly title:string;
 readonly challenge:string;readonly instruction:string;readonly guard:string;
 readonly model:string;readonly sourceLocators:readonly string[];
}
export interface U34GenreTask{
 readonly genre:U34Genre;readonly title:string;readonly audience:string;
 readonly format:string;readonly task:string;readonly outline:readonly string[];
 readonly model:string;readonly sourceLocators:readonly string[];
}
export interface U34Decision{
 readonly id:string;readonly question:string;readonly answer:string;
 readonly options:readonly string[];readonly explanation:string;
 readonly sourceLocators:readonly string[];
 readonly corrections:Readonly<Record<string,string>>;
}
export interface U34Journey{
 readonly lessonId:string;readonly title:string;readonly level:OriginalLevel;
 readonly qualifiedId:string;readonly sourceRevision:string;
 readonly curated:boolean;readonly topic:string;
 readonly claims:readonly U34Claim[];
 readonly turns:readonly U34Turn[];
 readonly genres:readonly U34GenreTask[];
 readonly checks:readonly U34Decision[];
 readonly witnesses:readonly U32Witness[];
 readonly independentlyPublishedDocuments:boolean;
 readonly suitableTargets:readonly OriginalSurface[];
}
type Brief=Readonly<{
 id:string;pressure:string;fairPoint:string;unsupported:string;
 question:string;response:string;repair:string;model:string;
 register:string;conditional:string;
}>;
const BRIEFS:readonly Brief[]=[
 {id:'a1-01',pressure:'« Si tu me salues, tu dois me donner ton nom et ton métier. »',
  fairPoint:'An introduction may include personal details when willingly shared.',
  unsupported:'A reciprocal wellbeing question compels career information.',
  question:'Que demande vraiment « Et toi ? »',response:'Une réponse sur le bien-être, pas une profession.',
  repair:'« Je demandais simplement comment tu vas. Tu peux garder tes informations privées. »',
  model:'« Inès et Malik se saluent. Ils peuvent répondre poliment sans donner d’informations privées. »',
  register:'Use vous and a courteous opening with an unfamiliar adult.',
  conditional:'If the other person declines to disclose, end politely without insisting.'},
 {id:'a1-02',pressure:'« Tous les habitants de Paris sont étudiants puisque Aya dit “nous”. »',
  fairPoint:'Aya genuinely speaks for a plural group.',
  unsupported:'The source establishes the status of everyone in the city.',
  question:'De quel ensemble parle « nous » ?',response:'Du groupe présenté par Aya, pas de toute la ville.',
  repair:'« Aya parle de son groupe d’étudiants. Elle ne décrit pas tous les habitants. »',
  model:'« Nous sommes étudiants. Ce nous désigne notre groupe; il ne signifie pas tout Paris. »',
  register:'For university reception, identify the group politely and precisely.',
  conditional:'If the audience asks for numbers, say the original dialogue does not specify them.'},
 {id:'a2-01',pressure:'« Émile a regardé le film jusqu’à la fin : le passé composé le prouve. »',
  fairPoint:'Émile began watching the film.',
  unsupported:'Émile finished the film.',
  question:'Quelle négation change le sens du récit ?',response:'Il n’a pas fini le film : il s’est endormi.',
  repair:'« Il a commencé le film, mais il ne l’a pas terminé parce qu’il a dormi. »',
  model:'« Émile a regardé un film, mais il ne l’a pas fini. Nous ne devons pas supprimer la négation. »',
  register:'Retell a friend’s evening accurately in a neutral recap.',
  conditional:'If asked about the ending, do not pretend the speaker saw it.'},
 {id:'a2-15',pressure:'« Le plus grand logement est nécessairement le meilleur. »',
  fairPoint:'Additional space can genuinely be valuable.',
  unsupported:'A larger apartment is best regardless of price or distance.',
  question:'Quels critères sont comparés ?',response:'La taille, le coût et la proximité de la gare.',
  repair:'« Le premier est plus grand mais plus cher. Le deuxième est plus près de la gare. »',
  model:'« Je reconnais l’intérêt de la surface. Cependant, la proximité et le prix comptent aussi. »',
  register:'Give courteous conditional advice to a housing professional.',
  conditional:'Do not invent a numeric price or availability not in the source.'},
 {id:'a2-17',pressure:'« La demande de prix prouve que la réservation a été modifiée. »',
  fairPoint:'The customer has genuinely requested a change.',
  unsupported:'The hotel has already confirmed the new reservation and price.',
  question:'Qu’est-ce qui manque après la demande ?',response:'Une confirmation du prix, de la date et de la réservation.',
  repair:'« Pourriez-vous confirmer par écrit le nouveau prix et la date souhaitée ? »',
  model:'« La cliente a demandé un changement; il faut encore vérifier son acceptation. »',
  register:'Use the conditional of politeness in written correspondence.',
  conditional:'Do not present a reservation as accepted until a real reply establishes it.'},
 {id:'b1-01',pressure:'« Le réseau de bus est annulé le vendredi : annulons aussi la réunion. »',
  fairPoint:'The earlier Friday last bus can genuinely constrain attendance.',
  unsupported:'The whole Friday bus service is cancelled or a new time is accepted.',
  question:'Quelle difficulté de transport est établie ?',response:'Le dernier bus part plus tôt le vendredi.',
  repair:'« Le dernier bus part plus tôt, donc proposons un horaire et consultons chacun. »',
  model:'« Une adaptation est possible, mais l’accord du groupe reste à obtenir. »',
  register:'Frame a neutral practical notice rather than a dramatic cancellation.',
  conditional:'If participants cannot attend earlier, ask them before finalizing.'},
 {id:'b1-02',pressure:'« Une formule hybride est forcément approuvée par tout le monde. »',
  fairPoint:'Hybrid participation might solve genuine access differences.',
  unsupported:'The participants unanimously approved a final format.',
  question:'Qu’a proposé Omar avant toute décision ?',response:'Deux options et une consultation des préférences.',
  repair:'« Proposons les deux formules, puis demandons l’avis des participants. »',
  model:'« Le compromis peut être utile, mais les préférences n’ont pas encore été confirmées. »',
  register:'Address a mixed group in inclusive, non-presumptive language.',
  conditional:'A proposal is not a vote and must not be reported as adopted.'},
 {id:'b1-03',pressure:'« Le fichier le plus récent est automatiquement la version officielle. »',
  fairPoint:'Modification dates are relevant to tracing document versions.',
  unsupported:'The newest timestamp alone proves administrative authority.',
  question:'Quelle preuve d’autorité faut-il obtenir ?',response:'Une confirmation écrite de la version officielle.',
  repair:'« Les versions diffèrent et leur statut reste à confirmer par écrit. »',
  model:'« Le document récent n’est pas forcément officiel. Nous demanderons validation. »',
  register:'Write a cautious administrative clarification without inventing an ACK.',
  conditional:'Do not mark either version authoritative before appropriate confirmation.'},
 {id:'transfer-31',pressure:'« Le règlement des heures calmes prouve que le voisin a déplacé les meubles. »',
  fairPoint:'Noise complaints deserve respectful investigation and quiet-hour rules matter.',
  unsupported:'A particular neighbor has been proven responsible.',
  question:'Quels faits ne permettent pas d’identifier une personne ?',response:'Le règlement général et un signalement de bruit sans témoin direct.',
  repair:'« Les sons sont signalés, mais leur origine et la responsabilité restent à vérifier. »',
  model:'« Nous proposons une médiation sans accusation personnelle non vérifiée. »',
  register:'Use respectful non-accusatory mediation language.',
  conditional:'Separate observed noise, general rules and possible causes.'},
 {id:'transfer-121',pressure:'« Une traduction fluide peut supprimer “il me semblait” sans changer la portée. »',
  fairPoint:'Fluency matters to a translation audience.',
  unsupported:'The source proves that the author was certain or preferred this draft.',
  question:'Quel marqueur grammatical exprime la réserve ?',response:'« Il me semblait » exprime une perception incertaine.',
  repair:'« La traduction doit préserver l’hésitation et signaler les préférences non confirmées. »',
  model:'« La fluidité est importante, mais elle ne doit pas effacer la réserve du narrateur. »',
  register:'Write an editorial note distinguishing manuscript and provisional translation.',
  conditional:'Do not claim the absent author endorsed a particular version.'},
 {id:'transfer-148',pressure:'« Les sous-titres en salle sont approuvés, donc la publication en ligne est permise. »',
  fairPoint:'Legible on-site captions benefit accessibility.',
  unsupported:'On-site display rights automatically authorize online distribution.',
  question:'Quelles trois questions faut-il distinguer ?',response:'La négation, la performance improvisée et la portée des droits.',
  repair:'« Vérifions les paroles réellement prononcées et les droits de publication distincts. »',
  model:'« Une correction linguistique ne remplace pas une autorisation de diffusion. »',
  register:'Give a formal accessibility and rights-scoping editorial memo.',
  conditional:'Publication must remain conditional on actual rights and accurate performance evidence.'},
 {id:'transfer-149',pressure:'« Quatre habitants sur cinq ont voté oui; le financement est définitivement acquis. »',
  fairPoint:'The volunteered submissions are a meaningful measured response.',
  unsupported:'The respondents represent every municipal resident or establish budget approval.',
  question:'Quel est le vrai dénominateur du résultat ?',response:'Cent bulletins volontaires, pas l’ensemble des habitants.',
  repair:'« Parmi cent réponses volontaires, quatre-vingts sont favorables; le budget reste à confirmer. »',
  model:'« Les résultats signalent de l’intérêt, non un mandat représentatif de toute la ville. »',
  register:'Write a data-methods note and a cautious public announcement.',
  conditional:'Do not infer representativeness or financing from voluntary vote counts.'},
 {id:'transfer-150',pressure:'« Le maximum théorique garantit soixante météores à chaque visiteur. »',
  fairPoint:'A model maximum may be useful for setting expectations.',
  unsupported:'Every viewer will observe the same count regardless of clouds or exposure.',
  question:'Quelles conditions empêchent la comparaison directe ?',response:'Le ciel, le lieu et la durée d’observation varient.',
  repair:'« La prévision est conditionnelle; comparons les comptages avec leurs conditions. »',
  model:'« Le chiffre maximal n’est ni un comptage local ni une garantie individuelle. »',
  register:'Prepare a clear scientific briefing with distinct forecast and observations.',
  conditional:'Quote actual sky conditions and time intervals rather than extrapolating guaranteed counts.'}
];
const GENRES:readonly [U34Genre,string,string,string,readonly string[]][]=[
 ['service','Service correspondence','A specific professional or service recipient','Polite, precise email or letter',
  ['State why you are contacting the recipient','Attribute the observed evidence','Present one fair concern or requested clarification','End with a conditional and actionable request']],
 ['analysis','Evidence-weighted report','A colleague reviewing competing source materials','Neutral comparative memorandum',
  ['List each original source and its scope','Distinguish attested facts from inferred explanations','Discuss the strongest competing interpretation','Recommend a verification step without overclaiming']],
 ['briefing','Independent spoken briefing','A public or mixed-proficiency audience','Structured spoken explanation, without recording',
  ['Orient the listener to the source and its limits','Explain the claim with a contextual example','Acknowledge a reasonable objection and rebut fairly','Summarize remaining uncertainty and a next step']],
 ['editorial','Independent editorial argument','Readers seeking a balanced position','Long-form original French editorial',
  ['Give an accurate bounded thesis','Develop original witness-based evidence','Concede a strong counterargument fairly','Revise any misleading overstatement and conclude conditionally']]
];
function rotate(id:string,values:readonly string[]):readonly string[]{
 const unique=[...new Set(values)];if(!unique.length)return unique;
 const offset=[...id].reduce((n,c)=>n+c.charCodeAt(0),0)%unique.length;
 return Object.freeze([...unique.slice(offset),...unique.slice(0,offset)]);
}
export function originalU34Debate(id:string):U34Journey|null{
 const prior=originalU33Editorial(id),entry=getOriginalCatalogEntry(id);
 if(!prior||!entry)return null;
 const authored=BRIEFS.find(x=>x.id===id),witnesses=prior.witnesses;
 const spoken=witnesses.filter(w=>w.kind==='dialogue');
 if(!spoken.length)return null;
 const written=witnesses.filter(w=>w.kind==='document');
 const reading=witnesses.filter(w=>w.kind==='reading');
 const primary=spoken[0];
 const secondary=written[0]??reading[0]??spoken[1]??primary;
 const third=written[1]??reading[1]??spoken[2]??secondary;
 const thesis=authored?.response??prior.thesis;
 const concern=authored?.fairPoint??'An alternative perspective may capture a legitimate concern.';
 const pressure=authored?.pressure??'« La première interprétation est forcément complète et officielle. » (hypothetical)';
 const limitation=authored?.conditional??prior.guard;
 const sourceIds=(...w:U32Witness[])=>Object.freeze([...new Set(w.map(x=>x.locator))]);
 const claims:U34Claim[]=[
  {id:'u34:'+id+':claim',role:'claim',label:thesis,coaching:'State the most defensible original-source-limited proposition.',sourceLocators:sourceIds(primary),original:false},
  {id:'u34:'+id+':evidence',role:'evidence',label:'Original primary witness: '+primary.label,
   coaching:'Read the actual cited passage; the label is provenance, not proof of accuracy.',sourceLocators:sourceIds(primary),original:true},
  {id:'u34:'+id+':counterclaim',role:'counterclaim',label:concern,
   coaching:'Acknowledge a fair hypothetical objection without attributing it to a historical source.',sourceLocators:sourceIds(secondary),original:false},
  {id:'u34:'+id+':rebuttal',role:'rebuttal',label:authored?.repair??'Selon les paroles originales, une interprétation plus prudente est nécessaire.',
   coaching:'Respond using real evidence and a proportional French correction.',sourceLocators:sourceIds(primary,secondary),original:false},
  {id:'u34:'+id+':limit',role:'limit',label:limitation,
   coaching:'Make dates, permissions, scope, sampling and uncertainties conditional where the record requires.',sourceLocators:sourceIds(secondary,third),original:false}
 ];
 const turns:U34Turn[]=[
  {id:'u34:'+id+':round:1',move:'assert',title:'Round 1 · Build a defensible case',
   challenge:'The hypothetical moderator asks: « Quelle est votre position, et quelle parole originale l’appuie ? »',
   instruction:'Present a coherent French thesis, cite an actual historical witness by label, and explain its scope.',
   guard:prior.guard,model:'« Selon '+primary.label+', '+(authored?.model??'ce point mérite une interprétation précise')+' »',
   sourceLocators:sourceIds(primary)},
  {id:'u34:'+id+':round:2',move:'press',title:'Round 2 · Face an unfairly confident challenge',
   challenge:'New fictional opposing participant: '+pressure,
   instruction:'First paraphrase the challenge fairly. Identify the legitimate concern and isolate the invented claim.',
   guard:'This opposition is a new training prompt, never original French testimony.',
   model:'« Je comprends votre inquiétude. Toutefois, '+(authored?.unsupported??'la source ne justifie pas cette certitude')+'. »',
   sourceLocators:sourceIds(primary,secondary)},
  {id:'u34:'+id+':round:3',move:'concede',title:'Round 3 · Concede a valid objection',
   challenge:'The invented editor presses: « Reconnaissez au moins ce que votre interlocuteur a raison de souligner. »',
   instruction:'Concede one fair concern without surrendering the source-grounded position.',
   guard:'A fair concession is not an endorsement of the unsupported portion of a challenge.',
   model:'« Il est vrai que '+concern+'. Cependant, cela ne démontre pas toute la conclusion proposée. »',
   sourceLocators:sourceIds(secondary)},
  {id:'u34:'+id+':round:4',move:'counter',title:'Round 4 · Repair attribution or inference',
   challenge:'A hypothetical fact-checker asks: « Quelle partie peut-on vérifier, et laquelle demeure incertaine ? »',
   instruction:'Explain actual provenance, correct the misleading overstatement and name missing evidence.',
   guard:limitation,model:authored?.repair??'« Nous devons distinguer cette affirmation du témoignage original. »',
   sourceLocators:sourceIds(primary,secondary,third)},
  {id:'u34:'+id+':round:5',move:'reconcile',title:'Round 5 · Independent civil synthesis',
   challenge:'The fictional public chair asks: « Donnez une conclusion équilibrée et une action responsable, sans vos notes. »',
   instruction:'Produce an extended French conclusion with thesis, evidence, fair counterclaim, limit and conditional next step.',
   guard:'Do not treat scripted or self-reported spoken work as recorded or automatically rated.',
   model:'« En résumé, la source établit certains faits, mais '+limitation+' Il faudrait donc vérifier les éléments manquants. »',
   sourceLocators:sourceIds(primary,secondary,third)}
 ];
 const genres=GENRES.map(([genre,title,audience,format,outline]):U34GenreTask=>({
  genre,title,audience,format,outline,
  task:'Adapt the original source-grounded argument about '+prior.topic+
   '. Preserve negation, factual scope, permissions and source attributions while changing the audience and genre.',
  model:genre==='service'?
   '« Bonjour, je vous contacte au sujet de '+prior.topic+'. Pourriez-vous confirmer les éléments encore incertains ? »':
   genre==='analysis'?
   '« Selon les documents cités, la première interprétation est limitée. Une vérification indépendante reste nécessaire. »':
   genre==='briefing'?
   '« Voici les faits que les sources permettent de distinguer, l’objection principale et la réserve qui demeure. »':
   '« On peut défendre une position sans transformer une hypothèse en fait établi. »',
  sourceLocators:sourceIds(primary,secondary,third)
 }));
 const decisions:U34Decision[]=[];
 if(authored){
  const options=rotate(id+':bounded',[authored.response,authored.unsupported,pressure]);
  decisions.push({
   id:'u34:'+id+':bounded',question:'Which statement best preserves the original source boundary?',
   answer:authored.response,options,sourceLocators:sourceIds(primary,secondary),
   explanation:'The original witness supports this limited interpretation; the other claims overstate certainty.',
   corrections:{
    [authored.unsupported]:'This is precisely the overclaim to correct: '+authored.conditional,
    [pressure]:'The opposing quotation is U34 practice fiction, not original source evidence.'
   }
  });
  const second=rotate(id+':repair',[authored.repair,authored.unsupported,
   '« Un texte original et un dialogue fictif constituent automatiquement deux preuves indépendantes. »']);
  decisions.push({
   id:'u34:'+id+':repair',question:'Which French intervention is the best grounded editorial repair?',
   answer:authored.repair,options:second,sourceLocators:sourceIds(primary,secondary),
   explanation:authored.conditional+' This is authored corrective teaching, not a historical quotation.',
   corrections:{
    [authored.unsupported]:'This repeats the error without qualifying the source.',
    '« Un texte original et un dialogue fictif constituent automatiquement deux preuves indépendantes. »':
      'Hypothetical debate prompts are not historical independent records.'
   }
  });
 }
 if(secondary.locator!==primary.locator&&secondary.label!==primary.label){
  const answer=secondary.label;
  decisions.push({
   id:'u34:'+id+':source',question:'Which named original source supplies the second comparison excerpt?',
   answer,options:rotate(id+':source',[answer,primary.label,'U34 hypothetical participant']),
   sourceLocators:sourceIds(primary,secondary),
   explanation:'The second displayed original source is '+secondary.label+
    '. Attribution is not automatic verification of factual truth.',
   corrections:{
    [primary.label]:'That label belongs to the first source, not the second comparison excerpt.',
    'U34 hypothetical participant':'A new exercise interlocutor is not an original documentary source.'
   }
  });
 }
 return Object.freeze({
  lessonId:id,title:prior.title,level:entry.level,
  qualifiedId:entry.qualifiedId,sourceRevision:entry.sourceRevision,
  curated:prior.curated,topic:prior.topic,
  claims:Object.freeze(claims),turns:Object.freeze(turns),
  genres:Object.freeze(genres),checks:Object.freeze(decisions),
  witnesses:Object.freeze(witnesses),
  independentlyPublishedDocuments:written.length>=2,
  suitableTargets:Object.freeze(['course','speak','listen','read','write','review'].filter(s=>
   s!=='read'||reading.length>0) as OriginalSurface[])
 });
}
export function compareU34Decision(item:U34Decision,value:string):{
 readonly matched:boolean;readonly feedback:string
}{
 const norm=(text:string)=>text.normalize('NFC').replace(/[’‘]/g,"'").trim().toLocaleLowerCase('fr');
 const matched=norm(item.answer)===norm(value);
 const error=Object.entries(item.corrections).find(([answer])=>norm(answer)===norm(value))?.[1];
 return {matched,feedback:(matched?'Matches the authored key. '+item.explanation:
  (error??'This response is not the authored practice key. ')+item.explanation)+
  ' This text choice does not assess your open debate or CEFR proficiency.'};
}
export const U34_CURATED_CASE_IDS:readonly string[]=Object.freeze(BRIEFS.map(x=>x.id));
