import {getOriginalCatalogEntry,getOriginalMaterial,type OriginalLevel} from './u23-registry.ts';
import {originalVocabularyForUnit,type OriginalLexeme} from './u28-vocabulary.ts';
import {checkPracticeAnswer} from './u2-grammar.ts';

export type OriginalReadingDecisionKind='locate'|'meaning'|'inference'|'reference'|'source';
export interface OriginalReadingDecision{
 readonly id:string;
 readonly kind:OriginalReadingDecisionKind;
 readonly question:string;
 readonly sourceId:string;
 readonly sourceLabel:string;
 readonly evidence:string;
 readonly options:readonly string[];
 readonly answer:string;
 readonly hint:string;
 readonly explanation:string;
 readonly misconception:readonly {readonly value:string;readonly repair:string}[];
 readonly lexemeKey?:string;
 readonly qualifiedSourceId?:string;
}
export interface OriginalReadingStudy{
 readonly lessonId:string;
 readonly qualifiedId:string;
 readonly sourceRevision:string;
 readonly level:OriginalLevel;
 readonly title:string;
 readonly paragraphs:readonly string[];
 readonly documents:readonly {readonly label:string;readonly type:string;readonly text:string}[];
 readonly decisions:readonly OriginalReadingDecision[];
 readonly originalQuestions:readonly {readonly prompt:string;readonly answer:string;readonly options:readonly string[];readonly explanation:string}[];
 readonly nextAction:string;
}
type Authored = Readonly<{
 id:string;lesson:string;kind:'reference'|'inference'|'meaning';
 anchor:string;prompt:string;answer:string;distractors:readonly [string,string];
 why:string;repairs:readonly [string,string];
}>;
/**
 * Each new comprehension question points at a verbatim fragment in its
 * historical original connected reading. Unsupported anchors are omitted.
 * Those authored answers do not modify or replace original reading questions.
 */
const CUSTOM:readonly Authored[]=[
 {id:'b1-meeting-confirmation',lesson:'b1-01',kind:'inference',
  anchor:'Son objectif était de trouver une solution pratique',
  prompt:'What remains to be established before the earlier meeting time can be treated as agreed?',
  answer:'the availability and agreement of the remaining members',
  distractors:['the existence of the library','whether the bus has any wheels'],
  why:'The coordinator asks everyone about availability and describes the new time as a proposal, not a decision.',
  repairs:['A library closing time is background, not consent.','The passage does not discuss bus mechanics.']},
 {id:'b1-hybrid-preferences',lesson:'b1-02',kind:'reference',
  anchor:'Le groupe décide donc de demander les préférences de chacun',
  prompt:'What does « les préférences de chacun » refer to in the group decision?',
  answer:'the preferences of all participants in the group',
  distractors:['only the members in the physical room','the equipment suppliers'],
  why:'The consultation is intended to reflect the needs expressed by different participants.',
  repairs:['The passage explicitly wants more than the habits of a few in-person members.','Suppliers are not described as the people consulted.']},
 {id:'b1-version-status',lesson:'b1-03',kind:'inference',
  anchor:'leur statut n’est pas clair',
  prompt:'What can Léa establish before asking her manager?',
  answer:'that two document versions exist but their authority is unresolved',
  distractors:['that the reception display is necessarily outdated','that the file must be the official version'],
  why:'The disagreement proves only that two differently dated versions are present, not which applies.',
  repairs:['The text never authorizes declaring the display outdated.','The file date alone does not establish official status.']},
 {id:'b1-trip-condition',lesson:'b1-04',kind:'inference',
  anchor:'s’ils avaient une voiture, ils pourraient emporter davantage de bagages',
  prompt:'How should the mention of a car be interpreted?',
  answer:'as a hypothetical alternative, not an established possession',
  distractors:['as proof that Nadia owns a car','as a confirmed Saturday transport booking'],
  why:'The imperfect si-clause and conditional result present an imagined scenario.',
  repairs:['A contrary-to-fact or speculative si-clause is not ownership evidence.','The Saturday plan remains undecided.']},
 {id:'b1-library-scope',lesson:'b1-05',kind:'inference',
  anchor:'elle propose une consultation locale',
  prompt:'Why would it be inaccurate to claim everyone in the area agrees with the writer?',
  answer:'her personal preference does not establish the needs of every resident',
  distractors:['the library is already closed','the letter reports a binding neighborhood vote'],
  why:'She asks to consult residents instead of treating her own view as universally shared.',
  repairs:['The passage does not say the library has already closed.','The proposed consultation has not occurred as a binding vote.']},
 {id:'b1-guidance-demonstrate',lesson:'b1-06',kind:'reference',
  anchor:'reformuler une consigne avec leurs propres mots',
  prompt:'What is the purpose of asking participants to restate a procedure?',
  answer:'to demonstrate practical understanding rather than passive receipt',
  distractors:['to replace all administrative requirements','to rank the speakers by nationality'],
  why:'Rephrasing indicates whether participants actually understand how to use the services.',
  repairs:['Reformulation does not eliminate procedures.','No nationality ranking appears in the source.']},
 {id:'b1-saturday-scope',lesson:'b1-07',kind:'inference',
  anchor:'Julie n’a pas entendu de précision sur ce point',
  prompt:'What should Julie say about Saturday opening?',
  answer:'that Saturday was not specified and requires confirmation',
  distractors:['that opening on Saturday is guaranteed','that the announced change has been cancelled'],
  why:'An announcement about the following day did not state whether Saturday was included.',
  repairs:['An unspecified day cannot be presented as guaranteed.','The passage does not describe a cancellation of the announced change.']},
 {id:'b1plus-noise-observation',lesson:'transfer-31',kind:'inference',
  anchor:'Les deux documents ne prouvent donc ni la cause des sons',
  prompt:'Which claim is supported by comparing the quiet-hours rule and the tentative work report?',
  answer:'the reported disturbance has no established source or responsible person',
  distractors:['the neighboring apartment was proven responsible','a violation by a named resident has been officially established'],
  why:'A general rule and uncertain report do not identify who created the sounds.',
  repairs:['The reading says no one was observed moving furniture.','The rule does not assign responsibility for this particular noise.']},
 {id:'b1plus-repair-authority',lesson:'transfer-46',kind:'inference',
  anchor:'personne n’a encore vérifié sa formation',
  prompt:'What must be confirmed before a new volunteer uses a specialized tool?',
  answer:'the volunteer’s appropriate training or competence',
  distractors:['only the number of people registered','that every submitted device will be repaired'],
  why:'Registration and claimed confidence do not replace a safety assessment.',
  repairs:['Queue size does not establish training.','No guarantee of successful repair is given.']},
 {id:'b1plus-archive-date',lesson:'transfer-76',kind:'inference',
  anchor:'une photographie datée de 1965',
  prompt:'Which historical claim follows from a photo dated 1965 alone?',
  answer:'the image documents an appearance of the building in 1965',
  distractors:['the building was constructed in 1965','the building’s façade never changed after 1965'],
  why:'Dating a photograph is not the same as dating construction or later alterations.',
  repairs:['A dated photo cannot alone establish the year of construction.','One historical photograph cannot establish every later change.']},
 {id:'b2-caption-negation',lesson:'transfer-148',kind:'inference',
  anchor:'Je ne signerai pas',
  prompt:'Why does removing the negation change the reported scene?',
  answer:'it turns an explicit refusal into apparent acceptance',
  distractors:['it makes the contractual refusal stronger','it changes only punctuation while preserving meaning'],
  why:'The character refuses to sign. Removing ne ... pas reverses the stated decision.',
  repairs:['Removing negation cancels, not strengthens, the refusal.','The grammatical change alters the propositional meaning.']},
 {id:'b2-survey-denominator',lesson:'transfer-149',kind:'inference',
  anchor:'parmi cent bulletins déposés volontairement',
  prompt:'Which population is actually measured by the stated 80 percent?',
  answer:'the voluntary submitted ballots, not the whole town',
  distractors:['all households in the municipality','every resident selected in a representative random draw'],
  why:'The text explains that 80 of 100 voluntary submissions were favorable, without representative sampling.',
  repairs:['The number of town households is not established.','No random representative sample was drawn.']},
 {id:'b2-meteor-conditions',lesson:'transfer-150',kind:'inference',
  anchor:'un maximum théorique dans des conditions d’observation très favorables',
  prompt:'What does the advertised number of sixty meteors per hour actually describe?',
  answer:'a conditional theoretical maximum under favorable viewing conditions',
  distractors:['a guaranteed personal count for each visitor','the number recorded during the village’s cloudy half-hour'],
  why:'A model maximum is not the observed count at a particular site and time.',
  repairs:['A theoretical ideal is not a personal guarantee.','The village log recorded nine meteors in thirty minutes, with clouds.']}
];

/** Read-only, deterministic paragraph index; prose comes from original source. */
function paragraphsOf(text:string):readonly string[]{
 return text.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
}
function norm(s:string):string{
 return s.normalize('NFC').replace(/[’‘]/g,"'").toLocaleLowerCase('fr');
}
function containsWhole(sentence:string,word:string):boolean{
 const haystack=norm(sentence),needle=norm(word),at=haystack.indexOf(needle);
 if(at<0)return false;
 const before=haystack[at-1]??' ',after=haystack[at+needle.length]??' ';
 return !/[\p{L}\p{N}]/u.test(before)&&!/[\p{L}\p{N}]/u.test(after);
}
function sentenceExcerpt(text:string):string{
 const sentences=text.match(/[^.!?]+[.!?]+|[^.!?]+$/gu)??[text];
 return (sentences.find(x=>x.trim().length>35)??sentences[0]??'').trim().slice(0,210);
}
function authoredQuestions(id:string,paragraphs:readonly string[],qualified:string):OriginalReadingDecision[]{
 const complete=paragraphs.join('\n\n');
 return CUSTOM.filter(x=>x.lesson===id&&norm(complete).includes(norm(x.anchor))).map(x=>({
  id:'u29:'+id+':authored:'+x.id,kind:x.kind,
  question:x.prompt,sourceId:id,sourceLabel:'Original connected reading',
  evidence:x.anchor,options:[x.answer,...x.distractors],
  answer:x.answer,hint:'Find « '+x.anchor+' » in the original reading and check what it does not establish.',
  explanation:x.why,qualifiedSourceId:qualified,
  misconception:x.distractors.map((value,i)=>({value,repair:x.repairs[i]}))
 } as OriginalReadingDecision));
}
function paragraphDecisions(id:string,paragraphs:readonly string[]):OriginalReadingDecision[]{
 if(paragraphs.length<2)return [];
 return paragraphs.slice(0,Math.min(3,paragraphs.length)).map((paragraph,i)=>{
  const excerpt=sentenceExcerpt(paragraph);
  const options=paragraphs.map((_,n)=>'Paragraph '+(n+1));
  return {
   id:'u29:'+id+':paragraph:'+i,kind:'locate',
   question:'Which paragraph explicitly contains this original-source statement? Identify evidence before interpreting it.',
   sourceId:id,sourceLabel:'Original connected reading',evidence:excerpt,
   options,answer:'Paragraph '+(i+1),
   hint:'Scan the beginning and end of each paragraph; choose where this exact statement appears.',
   explanation:'The quoted fragment is from paragraph '+(i+1)+' of this original connected reading. Identifying its location does not establish any additional inference.',
   misconception:options.filter(x=>x!=='Paragraph '+(i+1)).map(value=>({value,
    repair:'This paragraph is not the location of the displayed quotation. Compare the original text.'}))
  } satisfies OriginalReadingDecision;
 });
}
function sourceDecisions(id:string,sources:readonly {readonly label:string;readonly type:string;readonly french:string}[]):
 OriginalReadingDecision[]{
 if(sources.length<2)return [];
 return sources.slice(0,3).flatMap((doc,i)=>{
  const fragment=sentenceExcerpt(doc.french);
  if(fragment.length<18||sources.some((other,j)=>i!==j&&norm(other.french).includes(norm(fragment))))return [];
  const options=sources.map(s=>s.label);
  return [{
   id:'u29:'+id+':document:'+i,kind:'source' as const,
   question:'Which independent original document actually makes this statement?',
   sourceId:id,sourceLabel:doc.label+' ('+doc.type+')',evidence:fragment,
   options,answer:doc.label,
   hint:'Do not attribute a campaign claim to a methodology note, or vice versa. Compare the original documents.',
   explanation:'The quotation occurs in « '+doc.label+' ». This does not independently verify its truth or prove that other documents agree.',
   misconception:options.filter(x=>x!==doc.label).map(value=>({value,
    repair:'The cited statement belongs to « '+doc.label+' », not « '+value+' ». Keep the original attribution.'}))
  }];
 });
}
function lexicalDecisions(id:string,text:string,qualified:string):OriginalReadingDecision[]{
 const words=originalVocabularyForUnit(id);
 const used=new Set<string>();
 return words.filter(item=>{
  const normWord=norm(item.french);
  if(used.has(normWord)||!containsWhole(text,item.french))return false;
  used.add(normWord);return true;
 }).slice(0,3).map(item=>{
  const wordOptions=[item.english,...words.filter(w=>w.key!==item.key&&w.english!==item.english)
   .slice(0,2).map(w=>w.english)];
  if(wordOptions.length<3)return null;
  const paragraph=paragraphsOf(text).find(p=>containsWhole(p,item.french))??text;
  const sentences=paragraph.match(/[^.!?]+[.!?]+|[^.!?]+$/gu)??[paragraph];
  const witnessed=sentences.find(x=>containsWhole(x,item.french))?.trim()??paragraph;
  return {
   id:'u29:'+id+':lexical:'+item.key,kind:'meaning' as const,
   question:'In this original reading, which published English gloss belongs to « '+item.french+' »?',
   sourceId:id,sourceLabel:'Original connected reading + published original vocabulary',
   evidence:witnessed,options:wordOptions,answer:item.english,lexemeKey:item.key,
   hint:'Locate the expression in the original sentence; choose its own source vocabulary gloss, not an unrelated word.',
   explanation:'The original vocabulary of '+id+' glosses « '+item.french+' » as « '+item.english+' ». Alternative contextual senses are not exhaustively assessed.',
   misconception:wordOptions.filter(x=>x!==item.english).map(value=>({value,
    repair:'« '+value+' » is the gloss of a different original expression; it is not the published gloss attached to « '+item.french+' ».'}))
  } satisfies OriginalReadingDecision;
 }).filter((x):x is NonNullable<typeof x>=>x!==null);
}
export function originalIntegratedReading(id:string):OriginalReadingStudy|null{
 const entry=getOriginalCatalogEntry(id),material=getOriginalMaterial(id);
 if(!entry||!material)return null;
 const reading=material.reading;
 const paragraphs=reading?paragraphsOf(reading.french):
  material.unit.dialogue.map(line=>line.speaker+': '+line.fr);
 if(!paragraphs.length)return null;
 const sourceText=reading?.french??paragraphs.join('\n\n');
 const documents=material.evidence?.sources.map(s=>({label:s.label,type:s.type,text:s.french}))??[];
 const decisions:OriginalReadingDecision[]=[
  ...paragraphDecisions(id,paragraphs),
  ...(reading?authoredQuestions(id,paragraphs,entry.qualifiedId):[]),
  ...(reading?lexicalDecisions(id,sourceText,entry.qualifiedId):[]),
  ...sourceDecisions(id,material.evidence?.sources??[])
 ];
 return {
  lessonId:id,qualifiedId:entry.qualifiedId,sourceRevision:entry.sourceRevision,
  level:entry.level,title:reading?.title??entry.title,
  paragraphs,documents,decisions,
  originalQuestions:reading?.questions??material.unit.tasks.filter(q=>q.type==='reading'&&q.options.length>1),
  nextAction:entry.reading?'Read and compare original text with the authorial comprehension questions.':
   'Read the original dialogue and identify what each speaker actually says.'
 };
}
export function compareReadingChoice(response:string,key:string):boolean{
 return checkPracticeAnswer(response,key);
}
export function originalReadingCorrection(decision:OriginalReadingDecision,response:string):string{
 const misconception=decision.misconception.find(x=>compareReadingChoice(x.value,response));
 if(misconception)return misconception.repair+' '+decision.explanation;
 return 'This answer does not match the authored evidence key. '+decision.hint+
  ' Other valid interpretations or paraphrases are not automatically evaluated.';
}
