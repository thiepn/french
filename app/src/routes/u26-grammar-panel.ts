import {checkPracticeAnswer} from '../core/unified/u2-grammar.ts';
import {
 originalU26GrammarForUnit,originalU26GrammarForLevel,
 type U26GrammarFocus,type U26IndependentPrompt
} from '../core/unified/u26-grammar-content.ts';
import {getOriginalCatalogEntry} from '../core/unified/u23-registry.ts';
import './u26-grammar-panel.css';

type Mode='course'|'read'|'listen'|'write';
function node<K extends keyof HTMLElementTagNameMap>(tag:K,text='',className=''):HTMLElementTagNameMap[K]{
 const el=document.createElement(tag);
 if(text)el.textContent=text;
 if(className)el.className=className;
 return el;
}
function action(text:string,handler:()=>void):HTMLButtonElement{
 const b=node('button',text,'secondary-action compact-action');b.type='button';
 b.addEventListener('click',handler);return b;
}
function appendQuestion(host:HTMLElement,item:U26IndependentPrompt,index:number):void{
 const section=node('section','','u26-question');
 const label=node('label',(index+1)+'. '+item.question,'u26-question-label');
 const cue=node('p',item.cue,'u26-cue');cue.lang='en';
 const input=node('input');input.type='text';input.lang='fr';input.autocomplete='off';
 input.maxLength=150;input.setAttribute('aria-label','Independent French answer '+(index+1));
 label.append(input);
 const form=node('form','','u26-answer');
 const feedback=node('p','','u26-feedback');feedback.setAttribute('role','status');
 const hint=node('p','','u26-hint');hint.hidden=true;
 const comparison=node('p','','u26-explanation');comparison.hidden=true;comparison.lang='en';
 let hintLevel=0,attempted=false;
 const hintButton=action('First hint',()=>{
  if(hintLevel===0){
   hint.textContent=item.hint;
   hintLevel=1;hintButton.textContent='Show contrast';
  }else if(hintLevel===1){
   hint.textContent=item.explanation;
   hintLevel=2;hintButton.textContent='Hints shown';hintButton.disabled=true;
  }
  hint.hidden=false;
 });
 const modelButton=action('Reveal keyed example',()=>{
  comparison.hidden=!comparison.hidden;
  comparison.textContent='Authored keyed response: '+item.answer+
   '. '+item.explanation+' This is not a semantic grade of alternative French.';
  modelButton.textContent=comparison.hidden?'Reveal keyed example':'Hide keyed example';
  modelButton.setAttribute('aria-expanded',String(!comparison.hidden));
 });
 modelButton.setAttribute('aria-expanded','false');
 const submit=node('button','Check exact response','primary-action compact-action');submit.type='submit';
 form.addEventListener('submit',event=>{
  event.preventDefault();
  const entered=input.value.trim();
  if(!entered){feedback.textContent='Enter your own answer before checking.';return;}
  attempted=true;
  if(checkPracticeAnswer(entered,item.answer)){
   feedback.textContent='Matches the authored practice key. '+item.explanation+
    ' This does not update native assessment or CEFR.';
  }else{
   const misconception=item.misconceptions.find(x=>checkPracticeAnswer(entered,x.response));
   feedback.textContent=misconception?
    'Not the keyed form: '+misconception.why+' '+item.explanation:
    'This response does not match the limited authored key. Review the cue: '+item.hint+
    ' Other valid French alternatives are not automatically evaluated.';
  }
 });
 input.addEventListener('input',()=>{
  if(attempted){feedback.textContent='Answer changed. Recheck the new response to compare with the authored key.';attempted=false;}
 });
 const actions=node('div','','u26-actions');
 actions.append(submit,hintButton,modelButton);
 form.append(cue,label,actions,feedback,hint,comparison);
 section.append(form);host.append(section);
}
function appendFocus(host:HTMLElement,focus:U26GrammarFocus,mode:Mode,linked:boolean):void{
 const section=node('article','','u26-focus');
 section.append(node('p',linked?'LESSON-LINKED GRAMMAR':'OPTIONAL GRAMMAR FROM THIS LEVEL','eyebrow'),
  node('h4',focus.title),node('p',focus.context,'u26-context'));
 const explanation=node('p',focus.explanation);section.append(explanation);
 const contrast=node('div','','u26-contrast');
 contrast.append(node('h5','Meaningful contrast'),node('p',focus.contrast));
 const examples=node('ul');
 for(const [fr,en] of focus.examples){
  const li=node('li');const french=node('strong',fr);french.lang='fr';li.append(french,node('span',' — '+en));examples.append(li);
 }
 contrast.append(examples);
 const correction=node('div','','u26-correction');
 correction.append(node('p','Common confusion: '+focus.wrong),
  node('p','Correct in this context: '+focus.corrected),node('p',focus.repair));
 contrast.append(correction);section.append(contrast);
 const practice=node('details','','u26-practice');
 const legend=node('summary','Independent grammar application · '+focus.tasks.length+' authored questions');
 practice.append(legend,node('p','Answer independently before checking. Hints are optional and feedback compares only the authored key; no automatic open-ended evaluation.','u26-note'));
 for(const [i,item] of focus.tasks.entries())appendQuestion(practice,item,i);
 section.append(practice);
 const transfer=node('details','','u26-transfer');
 transfer.append(node('summary',mode==='read'?'Reading transfer':mode==='listen'?'Listening transfer':mode==='write'?'Writing transfer':'Transfer to Read, Listen and Write'));
 const methods:readonly ['read'|'listen'|'write',string][]=[
  ['read','Read for form and meaning'],['listen','Listen for grammar and stance'],['write','Produce a short response']
 ];
 for(const [kind,title] of methods){
  if(mode!=='course'&&mode!==kind)continue;
  transfer.append(node('h5',title),node('p',focus[kind]));
 }
 if(mode==='write'||mode==='course'){
  const model=node('p',focus.writingModel,'u26-written-model');model.lang='fr';model.hidden=true;
  const reveal=action('Reveal one original writing model',()=>{
   model.hidden=!model.hidden;
   reveal.setAttribute('aria-expanded',String(!model.hidden));
   reveal.textContent=model.hidden?'Reveal one original writing model':'Hide writing model';
  });reveal.setAttribute('aria-expanded','false');
  transfer.append(node('p','Drafts and independent speaking are not persisted or graded by this grammar panel.','u26-note'),reveal,model);
 }
 section.append(transfer);
 const provenance=node('p','Original focus '+focus.id+' · teaching anchor '+focus.anchorId+
  ' · original-owned, ungraded','u26-provenance');
 section.append(provenance);host.append(section);
}
/**
 * U26 supplements inherited source-owned Course material. It only calls the
 * existing closed-key practice comparator and never touches a learner writer.
 */
export function appendU26GrammarPractice(host:HTMLElement,id:string,mode:Mode='course'):void{
 const entry=getOriginalCatalogEntry(id);if(!entry)return;
 const linked=originalU26GrammarForUnit(id);
 const choices=linked.length?linked:originalU26GrammarForLevel(entry.level);
 if(!choices.length)return;
 const section=node('section','','u26-grammar');
 section.setAttribute('aria-label','Contextual original grammar practice');
 section.append(node('h3','Grammar in context'),
  node('p',linked.length?
   'These original contrasts relate to this lesson’s authored grammar anchors. Practise independently and inspect specific errors.':
   'No explicit U26 grammar anchor is associated with this lesson. The following are optional topics from the same authored level, not a claim that this lesson teaches them.',
   'u26-note'));
 const pickerLabel=node('label','Choose a grammar contrast','u26-picker');
 const picker=node('select');picker.setAttribute('aria-label','Choose a contextual grammar focus');
 for(const focus of choices){
  const option=node('option',focus.title+' · '+focus.anchorId);
  option.value=focus.id;picker.append(option);
 }
 pickerLabel.append(picker);
 const content=node('div','','u26-focus-content');
 const render=()=>{
  content.replaceChildren();
  const found=choices.find(x=>x.id===picker.value)??choices[0];
  if(found)appendFocus(content,found,mode,linked.some(x=>x.id===found.id));
 };
 picker.addEventListener('change',render);
 section.append(pickerLabel,content);
 render();host.append(section);
}
