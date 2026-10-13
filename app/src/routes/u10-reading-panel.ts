import {getOriginalB1ReadingU12} from '../core/unified/u12-material';
import {checkPracticeAnswer} from '../core/unified/u2-grammar';
import type {A1Unit} from '../core/unified/u6-a1-model';
import './unified-u10.css';

function node<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string,classes?:string):HTMLElementTagNameMap[K]{
 const element=document.createElement(tag);
 if(text!==undefined)element.textContent=text;
 if(classes)element.className=classes;
 return element;
}
/** Adds longer evidence-based B1 reading to the existing Read stage; no new progress engine. */
export function appendOriginalB1Reading(container:HTMLElement,unit:A1Unit):void{
 const reading=getOriginalB1ReadingU12(unit.id);
 if(!reading)return;
 const section=node('section',undefined,'u10-reading');
 section.setAttribute('aria-label','Original B1 connected reading and evidence questions');
 section.append(node('h4','Connected reading: '+reading.title),
  node('p','Read the full original text, then distinguish stated facts from supported inferences. These checks are temporary practice, not CEFR evidence.','u6-small'));
 const article=node('article',reading.french,'u10-reading-text');
 article.lang='fr';
 section.append(article);
 reading.questions.forEach((question,i)=>{
  const form=node('form',undefined,'u10-inference');
  const label=node('label',(i+1)+'. '+question.prompt);
  const options=node('select');options.setAttribute('aria-label','Reading inference '+(i+1));
  const choose=node('option','Choose an interpretation');choose.value='';options.append(choose);
  for(const item of question.options){const option=node('option',item);option.value=item;options.append(option);}
  label.append(options);
  const answer=node('p','','u10-reading-feedback');answer.setAttribute('role','status');answer.setAttribute('aria-live','polite');
  const submit=node('button','Check interpretation','secondary-action compact-action');submit.type='submit';
  form.addEventListener('submit',event=>{
   event.preventDefault();
   if(!options.value){answer.textContent='Choose an interpretation before checking.';return;}
   answer.textContent=(checkPracticeAnswer(options.value,question.answer)?
    'Supported interpretation. ':'Review the original text: this answer is not supported. ')+question.explanation;
  });
  form.append(label,submit,answer);section.append(form);
 });
 container.append(section);
}
