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
