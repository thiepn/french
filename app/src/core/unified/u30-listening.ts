import {getOriginalMaterial,getOriginalCatalogEntry,type OriginalLevel} from './u23-registry.ts';
import {originalVocabularyForUnit,originalVocabularyWitnesses} from './u28-vocabulary.ts';

/**
 * U30: all spoken turns, speaker names, translations and documentary claims
 * resolve to the historical U23 source. No guessed audio, pronunciation scores,
 * imported publication or parallel learner evidence store.
 */
export type U30Kind='speaker'|'sequence'|'interpretation'|'vocabulary'|'source';
export interface U30Decision{
 readonly id:string;readonly kind:U30Kind;readonly question:string;
 readonly answer:string;readonly options:readonly string[];
 readonly turnIndex:number|null;readonly evidence:string;readonly translation:string;
 readonly explanation:string;readonly hint:string;
 readonly errors:Readonly<Record<string,string>>;
 readonly documentLabel?:string;
}
export interface U30Lesson{
 readonly id:string;readonly title:string;readonly level:OriginalLevel;
 readonly qualifiedId:string;readonly sourceRevision:string;
 readonly turns:readonly {readonly speaker:string;readonly fr:string;readonly en:string}[];
 readonly speakers:readonly string[];
 readonly documents:readonly {readonly label:string;readonly type:string;readonly fr:string}[];
 readonly decisions:readonly U30Decision[];
 
}
// Authored interpretations are admitted only if a literal original dialogue turn
// still contains the quoted anchor. Changing historical content removes the task.
type Authored={
 id:string;lesson:string;anchor:string;prompt:string;answer:string;
 distractors:readonly [string,string];explanation:string;hint:string;
 corrections:readonly [string,string];
};
const AUTHORED:readonly Authored[]=[
 {id:'reciprocal-greeting',lesson:'a1-01',anchor:'Très bien, merci. Et toi ?',
  prompt:'What does Malik ask Inès after saying he is well?',
  answer:'How she is doing in return',distractors:['Whether she is his teacher','Whether she can say goodbye'],
  explanation:'« Et toi ? » hands the same greeting question back to Inès; it does not ask about her occupation.',
  hint:'Listen for the short question after « merci ».',
  corrections:['No profession is requested in Malik’s line.','« Et toi ? » is a reciprocal question, not a farewell.']},
 {id:'inclusive-students',lesson:'a1-02',anchor:'Oui, nous sommes tous étudiants.',
  prompt:'What does Aya clarify with « nous sommes tous »?',
  answer:'The group she refers to are all students',distractors:['Only Aya is a student','Their teacher is absent'],
  explanation:'« Nous » includes Aya with the others, and « tous » says the statement applies to them all.',
  hint:'Notice the subject « nous » and the quantifier « tous ».',
  corrections:['« Nous » cannot mean only Aya.','The exchange is about student identity, not a teacher’s absence.']},
 {id:'unproven-noise',lesson:'transfer-31',anchor:'je ne peux pas affirmer qu’ils viennent de l’appartement voisin',
  prompt:'What limitation does Aline place on her statement about the sounds?',
  answer:'She heard them but cannot establish that the neighboring flat caused them',
  distractors:['She personally witnessed the neighbor moving furniture','She is certain no sound was heard'],
  explanation:'Her observation of noise is separate from the unverified attribution to a particular apartment.',
  hint:'Listen for the negative claim « je ne peux pas affirmer ».',
  corrections:['The turn contains no eyewitness identification.','Aline explicitly says she heard sounds; she doubts the source.']},
 {id:'rules-vs-person',lesson:'transfer-31',anchor:'il ne désigne aucun habitant comme responsable',
  prompt:'How does Youssef distinguish the building regulation from evidence?',
  answer:'The regulation lists quiet hours but identifies no responsible resident',
  distractors:['The regulation proves which flat caused the noise','The regulation has been withdrawn'],
  explanation:'A rule about quiet hours is not evidence that a particular resident violated it.',
  hint:'Notice « aucun habitant ».',
  corrections:['No individual is identified in the rule.','The turn does not say the rule was withdrawn.']},
 {id:'translation-hesitation',lesson:'transfer-121',anchor:'supprime pourtant « il me semblait »',
  prompt:'Why does Leïla object to removing « il me semblait »?',
  answer:'It removes a signal that the narrator was unsure',
  distractors:['It adds a stronger expression of doubt','It leaves the narrator’s certainty unchanged'],
  explanation:'The missing expression weakens evidence of hesitation and makes the translated speaker sound more certain.',
  hint:'Listen for what the expression originally conveyed.',
  corrections:['Omitting a hedge cannot add stronger doubt.','The original hedge changes the narrator’s degree of certainty.']},
 {id:'two-rehearsal-versions',lesson:'transfer-121',anchor:'aucun document ne prouve laquelle l’autrice aurait préférée',
  prompt:'What can the rehearsal notebook establish about the writer’s preference?',
  answer:'It records two versions but cannot establish which the writer preferred',
  distractors:['The first version is officially approved','The writer personally rejected both versions'],
  explanation:'A record of alternatives does not prove an absent author’s preference.',
  hint:'Listen for « deux versions » and « aucun document ne prouve ».',
  corrections:['Sequence in a notebook is not formal approval.','There is no statement that the author rejected both.']},
 {id:'negation-reversal',lesson:'transfer-148',anchor:'a supprimé « ne »',
  prompt:'What risk does Malik identify in the automatic caption?',
  answer:'Dropping a negation can reverse the perceived decision',
  distractors:['The caption became a more emphatic refusal','The change affected only the actor’s name'],
  explanation:'The source conversation explains that a missing negation made a refusal look like acceptance.',
  hint:'Connect Malik’s transcript error to Élodie’s description of the spectator.',
  corrections:['The error removes a refusal, it does not strengthen one.','Names were also swapped, but this specific error concerns negation.']},
 {id:'stage-not-script',lesson:'transfer-148',anchor:'le scénario ne suffit pas à décrire la représentation',
  prompt:'Why does Élodie say the script alone is not enough?',
  answer:'The performers improvised, so the performed words may differ',
  distractors:['The script was destroyed before the show','The actors did not speak during rehearsals'],
  explanation:'A document can preserve the approved script without capturing every improvised performance.',
  hint:'Listen for what happened « mercredi ».',
  corrections:['No loss of the script is reported.','The actors improvised, rather than remaining silent.']},
 {id:'permission-scope',lesson:'transfer-148',anchor:"pas la publication des sous-titres en ligne",
  prompt:'Which distinction does Malik make about the existing consent?',
  answer:'On-site caption display is allowed; online publication is not covered',
  distractors:['Every online caption is already authorized','No on-site display is permitted'],
  explanation:'Permission for projection in the venue does not itself grant online distribution rights.',
  hint:'Contrast « affichage en salle » with « en ligne ».',
  corrections:['The reported consent is explicitly limited in scope.','The speaker states that on-site display is permitted.']},
 {id:'conditional-release',lesson:'transfer-148',anchor:'annonçons honnêtement les limites restantes',
  prompt:'What is the ethical condition of Élodie’s release proposal?',
  answer:'Publish the checked version for the event while declaring what remains uncertain',
  distractors:['Hide unresolved problems until audiences complain','Publish all unverified automatic captions online'],
  explanation:'Élodie calls for a controlled event version and an honest notice about residual limits.',
  hint:'Listen for « version contrôlée » and « limites restantes ».',
  corrections:['Her proposal explicitly discloses limits.','She does not authorize unrestricted online publication.']}
];
function normalize(text:string):string{
 return text.normalize('NFC').replace(/[’‘]/g,"'").toLocaleLowerCase('fr').trim();
}
function unique(values:readonly string[]):string[]{
 return [...new Set(values.filter(Boolean))];
}
function create(id:string,kind:U30Kind,question:string,answer:string,
 options:readonly string[],turnIndex:number|null,evidence:string,translation:string,
 explanation:string,hint:string,errors:Readonly<Record<string,string>>={},
 documentLabel?:string):U30Decision|null{
 const choices=unique([answer,...options]);
 if(!answer||choices.length<2)return null;
 // Stable authored-key-preserving rotation avoids always showing the answer first.
 const offset=[...id].reduce((sum,ch)=>sum+ch.charCodeAt(0),0)%choices.length;
 const ordered=[...choices.slice(offset),...choices.slice(0,offset)];
 return Object.freeze({id,kind,question,answer,options:Object.freeze(ordered),
  turnIndex,evidence,translation,explanation,hint,errors,documentLabel});
}
function push(tasks:U30Decision[],task:U30Decision|null):void{
 if(task&&!tasks.some(x=>x.id===task.id))tasks.push(task);
}
function attestedTurn(text:string,form:string):boolean{
 const sentence=normalize(text),needle=normalize(form),index=sentence.indexOf(needle);
 if(index<0||needle.length<3)return false;
 const before=sentence[index-1]??' ',after=sentence[index+needle.length]??' ';
 return !/[\p{L}\p{N}]/u.test(before)&&!/[\p{L}\p{N}]/u.test(after);
}
export function originalU30Listening(id:string):U30Lesson|null{
 const material=getOriginalMaterial(id),entry=getOriginalCatalogEntry(id);
 if(!material||!entry||!entry.listening||material.unit.dialogue.length<2)return null;
 const turns=material.unit.dialogue;
 const speakers=unique(turns.map(x=>x.speaker));
 if(speakers.length<2)return null;
 const tasks:U30Decision[]=[];
 // Attribution refers to textual conversational content, not a biometric
 // voice identity: a device TTS voice may read every line identically.
 const chosen: number[]=[];
 for(const name of speakers){
  const i=turns.findIndex((x,index)=>x.speaker===name&&!chosen.includes(index));
  if(i>=0)chosen.push(i);
 }
 for(const i of chosen.slice(0,3)){
  const line=turns[i];
  push(tasks,create('u30:'+id+':speaker-'+i,'speaker',
   'Which original participant says this line in the exchange?',line.speaker,
   speakers.filter(s=>s!==line.speaker),i,line.fr,line.en,
   'The original authored transcript attributes turn '+(i+1)+' to '+line.speaker+'. This is source attribution, not synthetic-voice recognition.',
   'Track who replies to whom; reveal the attributed original transcript if needed.'));
 }
 // The next utterance is selected from exact published text, never paraphrased
 // into fabricated speech. Require genuine alternatives, no duplicate lines.
 for(const i of [0,Math.floor(turns.length/2)]){
  if(i+1>=turns.length)continue;
  const right=turns[i+1],alternatives=unique(turns.filter((_,j)=>j!==i+1&&j!==i)
   .map(x=>x.fr)).filter(x=>x!==right.fr).slice(0,3);
  push(tasks,create('u30:'+id+':sequence-'+i,'sequence',
   'After the utterance in turn '+(i+1)+', which original French line comes next?',
   right.fr,alternatives,i+1,right.fr,right.en,
   'Turn '+(i+2)+' follows turn '+(i+1)+' in the original dialogue. Reconstruct the exchange rather than guessing from a topic.',
   'Listen to the turn before the answer and follow the response sequence.'));
 }
 // Translation-choice practice draws only from authored historical English
 // glosses. Some originals are summaries rather than verbatim translations.
 for(const i of unique([String(Math.floor(turns.length/3)),String(turns.length-2)])
  .map(Number).filter(n=>n>=0&&n<turns.length)){
  const target=turns[i],alternatives=unique(turns.filter((_,j)=>j!==i).map(x=>x.en))
   .filter(x=>x!==target.en).slice(0,3);
  push(tasks,create('u30:'+id+':interpret-'+i,'interpretation',
   'Which original English explanation accompanies turn '+(i+1)+'?',
   target.en,alternatives,i,target.fr,target.en,
   'This is the English explanation published with the original French turn; it may summarize rather than translate word for word.',
   'Listen for the action, negation, degree of certainty and speaker intention.'));
 }
 // Qualified U28 vocabulary may participate only when the same historical
 // French expression is witnessed in this dialogue, not merely a similar form.
 const vocab=originalVocabularyForUnit(id);
 const witnessed=vocab.filter(word=>turns.some(t=>attestedTurn(t.fr,word.french))&&
  originalVocabularyWitnesses(word).some(w=>w.source==='original-dialogue'));
 for(const word of witnessed.slice(0,2)){
  const i=turns.findIndex(t=>attestedTurn(t.fr,word.french));
  if(i<0)continue;
  const alternatives=unique(vocab.filter(w=>w.key!==word.key).map(w=>w.english))
   .filter(value=>value!==word.english).slice(0,3);
  push(tasks,create('u30:'+id+':lexical-'+word.order,'vocabulary',
   'In the original spoken turn, what is the published sense of « '+word.french+' »?',
   word.english,alternatives,i,turns[i].fr,turns[i].en,
   'The existing U28 original-owned vocabulary row '+word.key+
   ' associates this attested expression with « '+word.english+' » in the lesson. Check its full utterance.',
   'Reveal the turn and compare the exact expression in context.'));
 }
 for(const special of AUTHORED.filter(x=>x.lesson===id)){
  const index=turns.findIndex(t=>normalize(t.fr).includes(normalize(special.anchor)));
  if(index<0)continue;
  push(tasks,create('u30:'+id+':authored-'+special.id,'interpretation',
   special.prompt,special.answer,special.distractors,index,turns[index].fr,turns[index].en,
   special.explanation,special.hint,Object.fromEntries(special.distractors.map((wrong,i)=>[wrong,special.corrections[i]]))));
 }
 // Documentary comparison is visibly *written* evidence, never claimed audio.
 const documents=(material.evidence?.sources??[]).map(d=>({label:d.label,type:d.type,fr:d.french}));
 if(documents.length>=2){
  const item=documents.find(d=>documents.filter(x=>x.label===d.label).length===1&&
   d.fr.length>=30);
  if(item){
   const excerpt=item.fr.slice(0,Math.min(115,item.fr.length)).trim();
   push(tasks,create('u30:'+id+':written-source','source',
    'Which attributed written document contains this excerpt (not spoken audio)?',
    item.label,documents.filter(d=>d.label!==item.label).map(d=>d.label),null,
    excerpt,'', 'The excerpt belongs to the source labeled « '+item.label+
    ' ». Written documents must not be presented as recorded speech.',
    'Compare the independent published written records, not a reconstructed voice.',{},item.label));
  }
 }
 if(!tasks.length)return null;
 return Object.freeze({
  id,title:entry.title,level:entry.level,qualifiedId:entry.qualifiedId,
  sourceRevision:entry.sourceRevision,turns,speakers,
  documents:Object.freeze(documents),decisions:Object.freeze(tasks)
 });
}
export function evaluateU30Answer(decision:U30Decision,choice:string):{
 readonly correct:boolean;readonly feedback:string
}{
 const normalized=normalize(choice),matched=normalized===normalize(decision.answer);
 const misconception=Object.entries(decision.errors).find(([bad])=>normalize(bad)===normalized);
 return {correct:matched,feedback:matched?
  'Matches the original authored source. '+decision.explanation:
  (misconception?.[1]??'The selected answer does not match this published turn or source.')+
  ' '+decision.explanation};
}
export function validateU30SourceModel():readonly string[]{
 const errors:string[]=[];
 for(const item of AUTHORED){
  const original=getOriginalMaterial(item.lesson);
  if(!original?.unit.dialogue.some(t=>normalize(t.fr).includes(normalize(item.anchor))))
   errors.push('Source anchor missing: '+item.lesson+'/'+item.id);
 }
 return errors;
}
