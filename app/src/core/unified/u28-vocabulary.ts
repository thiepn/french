import {
 ORIGINAL_REGISTRY_ENTRIES,getOriginalUnit,getOriginalMaterial,getOriginalCatalogEntry,
 type OriginalLevel
} from './u23-registry.ts';
import {checkPracticeAnswer} from './u2-grammar.ts';

/**
 * Read-only lexical pointers into original Course vocabulary. All teaching
 * sentences and translations come from unchanged original-owned units.
 * No imported rights-restricted lexicon, learner store, card ID or scheduler.
 */
export interface OriginalLexeme{
 readonly key:string;readonly lessonId:string;readonly order:number;
 readonly qualifiedSourceId:string;readonly sourceRevision:string;
 readonly level:OriginalLevel;readonly french:string;readonly english:string;
 readonly context:string;readonly unitTitle:string;
}
export interface OriginalLexicalWitness{
 readonly source:'original-vocabulary'|'original-dialogue'|'original-connected-reading';
 readonly lessonId:string;readonly qualifiedSourceId:string;
 readonly french:string;readonly english?:string;
}
export interface OriginalLexicalContrast{
 readonly id:string;readonly title:string;readonly ownerUnit:string;
 readonly terms:readonly string[];readonly rule:string;
 readonly pitfall:string;readonly correction:string;
 readonly transfer:string;
}
export interface OriginalLexicalExercise {
 readonly id:string;readonly type:'meaning'|'production'|'cloze';
 readonly question:string;readonly answer:string;readonly sourceText:string;
 readonly hint:string;readonly explanation:string;readonly options:readonly string[];
 readonly qualifiedSourceId:string;
}
const normalize=(text:string)=>text.normalize('NFC').replace(/[‘’]/g,"'").trim()
 .replace(/\s+/g,' ').toLocaleLowerCase('fr');
const freeze=(array:OriginalLexeme[])=>Object.freeze(array);
const byUnit=new Map<string,readonly OriginalLexeme[]>();
const byForm=new Map<string,OriginalLexeme[]>();
const byKey=new Map<string,OriginalLexeme>();
for(const entry of ORIGINAL_REGISTRY_ENTRIES){
 const unit=getOriginalUnit(entry.id);
 if(!unit)continue;
 const words=unit.vocabulary.map((item,i)=>Object.freeze({
  key:entry.qualifiedId+'#vocab-'+String(i+1).padStart(2,'0'),
  lessonId:entry.id,order:i+1,qualifiedSourceId:entry.qualifiedId,
  sourceRevision:entry.sourceRevision,level:entry.level,unitTitle:entry.title,
  french:item.french,english:item.english,context:item.context
 } satisfies OriginalLexeme));
 byUnit.set(entry.id,freeze(words));
 for(const item of words){
  byKey.set(item.key,item);
  const form=normalize(item.french);
  if(!byForm.has(form))byForm.set(form,[]);
  byForm.get(form)!.push(item);
 }
}
/** Locators are derived from the already published source. They are not SRS note IDs. */
export function originalVocabularyForUnit(id:string):readonly OriginalLexeme[]{
 return byUnit.get(id)??[];
}
export function originalVocabularyByKey(key:string):OriginalLexeme|null {
 return byKey.get(key)??null;
}
export function originalVocabularyRelated(item:OriginalLexeme,limit=5):readonly OriginalLexeme[]{
 return (byForm.get(normalize(item.french))??[]).filter(x=>x.key!==item.key).slice(0,limit);
}
export function browseOriginalVocabulary(query:string,level:OriginalLevel|'all'='all',limit=80):readonly OriginalLexeme[]{
 const text=normalize(query);
 const items=[...byKey.values()];
 const filtered=items.filter(x=>(level==='all'||x.level===level)&&
  (!text||normalize([x.french,x.english,x.context,x.unitTitle,x.lessonId].join(' ')).includes(text)));
 return filtered.slice(0,Math.max(1,Math.min(240,limit)));
}
/** Collocations use the exact authorial context: no synthetic invented attestation. */
export function originalVocabularyWitnesses(item:OriginalLexeme):readonly OriginalLexicalWitness[]{
 const source=getOriginalMaterial(item.lessonId);
 const result:OriginalLexicalWitness[]=[{
  source:'original-vocabulary',lessonId:item.lessonId,
  qualifiedSourceId:item.qualifiedSourceId,french:item.context,english:item.english
 }];
 if(!source)return result;
 const form=normalize(item.french);
 const contains=(line:string)=>{
  const sentence=normalize(line);
  const index=sentence.indexOf(form);
  if(index<0)return false;
  const before=index===0?' ':sentence[index-1],after=sentence[index+form.length]??' ';
  return !/[\p{L}\p{N}]/u.test(before)&&!/[\p{L}\p{N}]/u.test(after);
 };
 for(const line of source.unit.dialogue){
  if(contains(line.fr)&&result.length<4)result.push({
   source:'original-dialogue',lessonId:item.lessonId,qualifiedSourceId:item.qualifiedSourceId,
   french:line.fr,english:line.en
  });
 }
 const reading=source.reading;
 if(reading){
  for(const paragraph of reading.french.split(/\n\s*\n/)){
   if(contains(paragraph)&&result.length<5)result.push({
    source:'original-connected-reading',lessonId:item.lessonId,
    qualifiedSourceId:item.qualifiedSourceId,french:paragraph
   });
  }
 }
 return result;
}
export const ORIGINAL_LEXICAL_CONTRASTS:readonly OriginalLexicalContrast[]=Object.freeze([
 {
  id:'greeting-register',ownerUnit:'a1-01',title:'Bonjour or salut?',
  terms:['bonjour','salut'],rule:'Bonjour suits both unfamiliar adults and friends in daytime settings; salut is familiar.',
  pitfall:'Using salut to address an unfamiliar professional can sound overly familiar.',
  correction:'Choose « Bonjour, madame » in a formal daytime greeting.',
  transfer:'Greet an unfamiliar teacher, then a close friend. Explain why your register changes.'
 },{
  id:'tu-vous',ownerUnit:'a1-01',title:'Tu or vous?',
  terms:['tu','vous'],rule:'Tu generally addresses one familiar person; vous addresses several people or one person politely.',
  pitfall:'Treating vous as plural only misses formal singular address.',
  correction:'Use « Vous êtes ici ? » to address one unfamiliar adult politely.',
  transfer:'Write one invitation to a friend and one to an unfamiliar administrator.'
 },{
  id:'past-distance',ownerUnit:'a2-01',title:'Hier or avant-hier?',
  terms:['hier','avant-hier'],rule:'Hier is yesterday; avant-hier is the day before yesterday. Both mark dates relative to the speaker.',
  pitfall:'Confusing the two changes the date being reported.',
  correction:'Say « Hier, j’ai travaillé » for yesterday, not the day before.',
  transfer:'Describe two completed actions on consecutive previous days with precise time markers.'
 },{
  id:'past-action',ownerUnit:'a2-01',title:'Écouter versus regarder',
  terms:['écouté','regardé'],rule:'Écouter primarily concerns listening; regarder concerns watching or looking.',
  pitfall:'The English verb « followed » may hide the sensory difference.',
  correction:'Use « Elle a regardé un film » for watching a movie.',
  transfer:'Write what you listened to and what you watched yesterday.'
 },{
  id:'cause-effect',ownerUnit:'b1-01',title:'Cause and consequence',
  terms:['une cause','une conséquence'],rule:'A cause explains why something happens; a consequence is the result.',
  pitfall:'Presenting a consequence as evidence of a cause reverses the logic.',
  correction:'Describe the cancelled bus as a possible cause and changing route as a consequence.',
  transfer:'Read one explanation and identify observed cause, claimed result and remaining uncertainty.'
 },{
  id:'connector-stance',ownerUnit:'b1-01',title:'Puisque, comme and par conséquent',
  terms:['puisque','comme','par conséquent'],rule:'Puisque tends to treat a reason as shared; comme often foregrounds a cause; par conséquent announces a result.',
  pitfall:'Par conséquent does not introduce a subordinate cause like parce que.',
  correction:'Use « Comme il pleuvait, nous sommes rentrés » for the cause, then state a result.',
  transfer:'Explain a revised plan using one cause and one separately justified consequence.'
 },{
  id:'evidence-outcome',ownerUnit:'b1-01',title:'Une preuve versus un résultat',
  terms:['une preuve','un résultat'],rule:'A result is an observed or calculated outcome; proof is evidence that supports a stated claim.',
  pitfall:'One result does not automatically prove a general explanation or causal relationship.',
  correction:'Name the observed résultat first, then identify whether it offers a preuve for the precise claim.',
  transfer:'Summarize a report without calling its conclusion proven unless the source warrants it.'
 },{
  id:'observation-reason',ownerUnit:'b1-01',title:'Constater or justifier?',
  terms:['constater','justifier'],rule:'Constater is to observe/establish what was noticed; justifier is to provide supporting reasons.',
  pitfall:'A speaker can justify a proposal without having independently observed its claimed cause.',
  correction:'Write « J’ai constaté un problème » before arguing for a remedy.',
  transfer:'Give a direct observation and a separate justification for a proposed response.'
 },{
  id:'uncertainty-evidence',ownerUnit:'transfer-31',title:'Hypothèse versus plainte',
  terms:['une hypothèse','une plainte'],rule:'Une hypothèse is a proposed explanation; une plainte reports a grievance. Neither automatically identifies responsibility.',
  pitfall:'A complaint may contain assumptions that have not been verified.',
  correction:'Separate the observed noise and its time from a hypothesis about its source.',
  transfer:'Prepare a respectful spoken mediation request that does not accuse someone without evidence.'
 },{
  id:'historical-document',ownerUnit:'transfer-121',title:'Brouillon versus témoignage',
  terms:['un brouillon','un témoignage'],rule:'A brouillon is a draft version; a témoignage is an attributed account. They have different evidentiary limitations.',
  pitfall:'A draft can preserve a proposed line without proving it was performed or witnessed.',
  correction:'Attribute the draft to the script and the testimony to its actual narrator.',
  transfer:'Compare two original records and state which claims each can support.'
 }
]);
/** Only present editorial comparisons when every expression is actually in the owner's original vocabulary. */
export function originalLexicalContrastsForUnit(id:string):readonly OriginalLexicalContrast[]{
 const available=new Set(originalVocabularyForUnit(id).map(x=>normalize(x.french)));
 return ORIGINAL_LEXICAL_CONTRASTS.filter(x=>x.ownerUnit===id&&x.terms.every(t=>available.has(normalize(t))));
}
/** A local exercise key is a source pointer, never an SRS card or score. */
export function originalLexicalExercises(item:OriginalLexeme):readonly OriginalLexicalExercise[]{
 const result:OriginalLexicalExercise[]=[];
 const prefix=item.key;
 result.push({
  id:prefix+':meaning',type:'meaning',
  question:'Which English meaning is associated with « '+item.french+' » in this original source?',
  answer:item.english,sourceText:item.context,
  hint:'Read the original French contextual sentence and consider the expression’s role.',
  explanation:'Original published vocabulary gloss: '+item.english+'. This is one contextual meaning.',
  options:[],qualifiedSourceId:item.qualifiedSourceId
 });
 result.push({
  id:prefix+':production',type:'production',
  question:'Produce the original French expression for: '+item.english,
  answer:item.french,sourceText:item.context,
  hint:'Retrieve the French expression without using the model sentence first.',
  explanation:'One original published response is « '+item.french+' ». Context: '+item.context,
  options:[],qualifiedSourceId:item.qualifiedSourceId
 });
 const phrase=item.context;
 const target=normalize(item.french);
 const normPhrase=normalize(phrase);
 const first=normPhrase.indexOf(target);
 if(first>=0){
  const before=first===0?' ':normPhrase[first-1],after=normPhrase[first+target.length]??' ';
  if(!/[\p{L}\p{N}]/u.test(before)&&!/[\p{L}\p{N}]/u.test(after)){
   const contextWithGap=phrase.slice(0,first)+'_____'+phrase.slice(first+item.french.length);
   result.push({
    id:prefix+':cloze',type:'cloze',
    question:'Complete this exact original source sentence with the missing expression.',
    answer:item.french,sourceText:contextWithGap,
    hint:'The source gloss is: '+item.english+'. Preserve accents and register.',
    explanation:'Original authorial example: '+item.context,
    options:[],qualifiedSourceId:item.qualifiedSourceId
   });
  }
 }
 return result;
}
export function compareOriginalLexicalAnswer(value:string,answer:string):boolean{
 return checkPracticeAnswer(value,answer);
}
/** Register-specific repair only for verified authored expressions. */
export function originalLexicalCorrection(item:OriginalLexeme,submitted:string):string|null{
 const form=normalize(item.french),response=normalize(submitted);
 const errors:Readonly<Record<string,Readonly<Record<string,string>>>>={
  bonjour:{salut:'Salut is familiar. Bonjour is safer for an unfamiliar adult.'},
  salut:{bonjour:'Bonjour is correct French, but the cue asks for the familiar greeting salut.'},
  tu:{vous:'Vous is formal singular or plural; tu addresses one familiar person.'},
  vous:{tu:'Tu is familiar singular; vous is polite singular or plural.'},
  hier:{'avant-hier':'Avant-hier is the day before yesterday, not yesterday.'},
  'avant-hier':{hier:'Hier is yesterday; avant-hier is two days ago.'},
  'une cause':{'une conséquence':'A consequence is a result; a cause explains why it happened.'},
  'une conséquence':{'une cause':'A cause explains the event; a consequence follows from it.'},
  puisque:{'par conséquent':'Par conséquent introduces a consequence rather than a shared cause.'},
  'par conséquent':{puisque:'Puisque introduces a reason assumed known, not the result.'},
  'une preuve':{'un résultat':'A result need not prove a general claim.'},
  'un résultat':{'une preuve':'A proof supports a claim; the result is the reported outcome.'}
 };
 return errors[form]?.[response]??null;
}
