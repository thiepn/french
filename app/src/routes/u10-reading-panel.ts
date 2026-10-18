import {getOriginalMaterial} from '../core/unified/u23-registry';
import {checkPracticeAnswer} from '../core/unified/u2-grammar';
import {appendU26GrammarPractice} from './u26-grammar-panel';
import type {A1Unit} from '../core/unified/u6-a1-model';
import type {B1ReadingQuestion} from '../core/unified/u10-readings-01-07';
import './unified-u10.css';

function node<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string,classes?:string):HTMLElementTagNameMap[K]{
 const element=document.createElement(tag);
 if(text!==undefined)element.textContent=text;
 if(classes)element.className=classes;
 return element;
}
function appendEvidenceQuestion(host:HTMLElement,question:B1ReadingQuestion,i:number,kind:string){
 const form=node('form',undefined,'u10-inference');
 const label=node('label',(i+1)+'. '+question.prompt);
 const options=node('select');options.setAttribute('aria-label',kind+' answer '+(i+1));
 const choose=node('option','Choose an interpretation');choose.value='';options.append(choose);
 for(const item of question.options){
  const option=node('option',item);option.value=item;options.append(option);
 }
 label.append(options);
 const feedback=node('p','','u10-reading-feedback');
 feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
 const submit=node('button','Check interpretation','secondary-action compact-action');submit.type='submit';
 form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!options.value){feedback.textContent='Choose an interpretation before checking.';return;}
  feedback.textContent=(checkPracticeAnswer(options.value,question.answer)?
   'Supported interpretation. ':'Review the original text: this answer is not supported. ')+question.explanation;
 });
 form.append(label,submit,feedback);host.append(form);
}
/** Existing original Read stage: connected passages and original paired-source contextual transfer. */
export function appendOriginalB1Reading(container:HTMLElement,unit:A1Unit):void{
 const material=getOriginalMaterial(unit.id);
 const reading=material?.reading;
 if(!reading)return;
 const section=node('section',undefined,'u10-reading');
 section.setAttribute('aria-label','Original connected reading and evidence questions');
 section.append(node('h4','Connected reading: '+reading.title),
  node('p','Read the original text before checking explicit details, supported inferences and synthesis. Answers are temporary practice, not CEFR credit.','u6-small'));
 const article=node('article',reading.french,'u10-reading-text');
 article.lang='fr';section.append(article);
 reading.questions.forEach((question,i)=>appendEvidenceQuestion(section,question,i,'Reading inference'));
 const comparison=material?.evidence;
 if(comparison){
  const sources=node('section',undefined,'u13-sources');
  sources.setAttribute('aria-label','Two original independent source documents');
  sources.append(node('h4','Compare two sources'),
   node('p','Different documents can agree on a fact while providing incompatible or incomplete details. Identify what each source actually establishes.','u6-small'));
  comparison.sources.forEach((source,i)=>{
   const card=node('article',undefined,'u13-source-card');
   card.append(node('h5','Source '+(i+1)+' · '+source.label+' ('+source.type+')'));
   const text=node('p',source.french);text.lang='fr';card.append(text);sources.append(card);
  });
  sources.append(node('h5','Cross-source comprehension and inference'));
  comparison.questions.forEach((question,i)=>appendEvidenceQuestion(sources,question,i,'Cross-source inference'));
  section.append(sources);
 }
 container.append(section);
 appendU26GrammarPractice(container,unit.id,'read');
}
