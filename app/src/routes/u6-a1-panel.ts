import type {RouteId} from '../core/types';
import {loadOriginalFrenchCourse,getOriginalFrenchUnit,suggestedOriginalFrenchUnit,originalFrenchPracticeStatus} from '../core/unified/u8-course';
import {mountA1Listening} from './u7-listening-panel';
import {checkPracticeAnswer} from '../core/unified/u2-grammar';
import {inspectDraftStructure} from '../core/unified/u3-writing';
import type {A1Task,A1Unit} from '../core/unified/u6-a1-model';
import './unified-u6.css';
import './unified-u8.css';
type Stage='understand'|'words'|'dialogue'|'listen'|'practice'|'write';
const STAGES:readonly [Stage,string][]=[
 ['understand','1. Understand'],['words','2. Vocabulary'],['dialogue','3. Read'],
 ['listen','4. Listen'],['practice','5. Recall'],['write','6. Write']
];
function el<K extends keyof HTMLElementTagNameMap>(tag:K,content?:string,classes?:string):HTMLElementTagNameMap[K]{
 const node=document.createElement(tag);
 if(content!==undefined)node.textContent=content;
 if(classes)node.className=classes;
 return node;
}
function button(label:string,action:()=>void,classes='secondary-action compact-action'):HTMLButtonElement{
 const b=el('button',label,classes);b.type='button';b.addEventListener('click',action);return b;
}
export async function mountA1FullCourse(host:HTMLElement,navigate:(route:RouteId)=>void,signal:AbortSignal):Promise<void>{
 host.replaceChildren(el('p','Loading the original A1 course…'));
 try{
  const lessons=await loadOriginalFrenchCourse();
  if(signal.aborted||!host.isConnected)return;
  // Ephemeral course practice, deliberately independent of the canonical native scheduler.
  const answers=new Map<string,Map<string,boolean>>();
  const mistakes=new Map<string,Set<string>>();
  const drafts=new Map<string,string>();
  let current=lessons[0],stage:Stage='understand',taskIndex=0;
  let stopAudio:(()=>void)|null=null;
  host.replaceChildren();host.className='u6-full-course';
  const header=el('header',undefined,'u6-head');
  header.append(el('p','ORIGINAL COURSE · A1 + A2','eyebrow'),
    el('h2','Learn French from the beginning'),
    el('p','Twenty-four full A1 lessons lead into fourteen original A2 narrative lessons. Continue through grammar, vocabulary, reading, French-device listening, recall and writing.'));
  const status=el('p',undefined,'u6-course-status');status.setAttribute('role','status');
  const layout=el('div',undefined,'u6-layout');
  const sidebar=el('nav',undefined,'u6-lesson-index');sidebar.setAttribute('aria-label','A1 full course lessons');
  const article=el('article',undefined,'u6-lesson-content');article.dataset.u6LessonContent='';
  layout.append(sidebar,article);host.append(header,status,layout);
  const answerMap=(id:string)=>{
   let found=answers.get(id);
   if(!found){found=new Map();answers.set(id,found);}
   return found;
  };
  const practiced=()=>{
   const passed=new Set<string>();
   for(const unit of lessons)if(originalFrenchPracticeStatus(unit.id,answerMap(unit.id))?.locallyPracticed)passed.add(unit.id);
   return passed;
  };
  function renderIndex(){
   const done=practiced(),next=suggestedOriginalFrenchUnit(done);
   status.textContent=done.size+'/'+lessons.length+
    ' lesson exercise sets practiced in this page visit. '+
    (next?'Suggested next: '+next.title+'.':'Every lesson exercise set has a correct response recorded locally.');
   sidebar.replaceChildren(el('h3','A1–A2 lesson sequence'));
   const jump=el('div',undefined,'u8-jump-level');
   jump.append(button('Start A1',()=>open('a1-01','understand'),'u8-level-button'),
    button('Start A2',()=>open('a2-01','understand'),'u8-level-button'));
   sidebar.append(jump);
   for(const unit of lessons){
    if(unit.id==='a2-01')sidebar.append(el('h4','A2 · Past actions and stories','u8-course-divider'));
    const practice=originalFrenchPracticeStatus(unit.id,answerMap(unit.id))!;
    const label=String(unit.order).padStart(2,'0')+' · '+unit.title+
     (practice.correct?' ('+practice.correct+'/'+practice.total+')':'');
    const item=button(label,()=>open(unit.id,'understand'),'u6-unit-button');
    item.dataset.u6Unit=unit.id;
    if(current.id===unit.id){item.classList.add('selected');item.setAttribute('aria-current','true');}
    sidebar.append(item);
   }
   sidebar.append(el('p','Recommended order only. Browsing or local correctness never updates native mastery.','u6-small'));
  }
  function stepNavigation(step:Stage){
   const selected=STAGES.findIndex(([id])=>id===step);
   const next=STAGES[selected+1],previous=STAGES[selected-1];
   const row=el('div',undefined,'u6-stage-footer');
   if(previous)row.append(button('← '+previous[1],()=>open(current.id,previous[0])));
   if(next)row.append(button(next[1]+' →',()=>open(current.id,next[0]),'primary-action compact-action'));
   else row.append(button('Next original lesson →',()=>{
    const candidate=lessons[current.order];
    if(candidate)open(candidate.id,'understand');
    else open(lessons[0].id,'understand');
   },'primary-action compact-action'));
   return row;
  }
  function renderUnderstand(unit:A1Unit,container:HTMLElement){
   container.append(el('p','Read each rule before trying the exercises. Examples and corrections are original teaching content.','u6-small'));
   for(const grammar of unit.grammar){
    const block=el('section',undefined,'u6-grammar-block');
    block.append(el('h4',grammar.heading),el('p',grammar.explanation));
    const examples=el('div',undefined,'u6-examples');
    for(const [french,english] of grammar.examples){
     const card=el('div',undefined,'u6-example');
     const fr=el('strong',french);fr.lang='fr';
     examples.append(card);card.append(fr,el('p',english));
    }
    block.append(examples);
    const [wrong,correct,why]=grammar.correction;
    const correction=el('div',undefined,'u6-worked-correction');
    correction.append(el('strong','Common mistake and correction'),
     el('s',wrong),el('p',correct),el('p',why));
    block.append(correction);container.append(block);
   }
   if(unit.grammarIds.length){
    const related=el('div',undefined,'u6-external-actions');
    related.append(el('p','Continue with the existing grammar reference:'));
    for(const grammarId of unit.grammarIds)related.append(button('Open '+grammarId.replaceAll('-',' ')+' guide',()=>{
     try{sessionStorage.setItem('french-u2-grammar-target',grammarId);}catch{}
     navigate('grammar');
    }));
    container.append(related);
   }
  }
  function renderWords(unit:A1Unit,container:HTMLElement){
   container.append(el('p','Learn the expression and its article or verb form together. Read the contextual example aloud before revealing the English meaning.','u6-small'));
   const list=el('div',undefined,'u6-word-grid');
   for(const word of unit.vocabulary){
    const item=el('article',undefined,'u6-word');
    const fr=el('strong',word.french);fr.lang='fr';
    const sample=el('p',word.context);sample.lang='fr';
    const gloss=el('p',word.english,'u6-gloss');gloss.hidden=true;
    const reveal=button('Reveal meaning',()=>{
     gloss.hidden=!gloss.hidden;
     reveal.textContent=gloss.hidden?'Reveal meaning':'Hide meaning';
     reveal.setAttribute('aria-expanded',String(!gloss.hidden));
    });
    reveal.setAttribute('aria-expanded','false');
    item.append(fr,sample,reveal,gloss);list.append(item);
   }
   container.append(list,el('p','For scheduled vocabulary review, continue into native Learn/Review. This original course does not create unapproved vocabulary imports.','u6-small'),
    button('Open native Learn',()=>navigate('learn')));
  }
  function renderDialogue(unit:A1Unit,container:HTMLElement){
   container.append(el('p','Read the complete exchange first. Reveal translations only when needed, then return to the French without them.','u6-small'));
   for(const line of unit.dialogue){
    const row=el('div',undefined,'u6-dialogue-turn');
    const name=el('strong',line.speaker),fr=el('p',line.fr);
    fr.lang='fr';const english=el('p',line.en,'u6-gloss');english.hidden=true;
    const toggle=button('Show translation',()=>{
     english.hidden=!english.hidden;
     toggle.textContent=english.hidden?'Show translation':'Hide translation';
     toggle.setAttribute('aria-expanded',String(!english.hidden));
    });
    toggle.setAttribute('aria-expanded','false');
    row.append(name,fr,toggle,english);container.append(row);
   }
   container.append(el('p','Now answer the comprehension questions in Stage 4 without revealing the translations.','u6-small'));
  }
  function renderPractice(unit:A1Unit,container:HTMLElement){
   const record=answerMap(unit.id);
   const practicedCount=originalFrenchPracticeStatus(unit.id,record)!;
   const errors=mistakes.get(unit.id)??new Set<string>();
   container.append(el('p',practicedCount.correct+'/'+practicedCount.total+
    ' correct tasks during this temporary page visit. No FSRS or CEFR score is recorded.','u6-practice-status'));
   const nav=el('div',undefined,'u6-task-navigation');nav.setAttribute('role','group');nav.setAttribute('aria-label','Practice task navigation');
   unit.tasks.forEach((task,i)=>{
    const b=button(String(i+1)+(record.get(task.id)?' ✓':''),()=>{taskIndex=i;render();},'u6-task-button');
    b.setAttribute('aria-label','Open task '+(i+1));
    if(i===taskIndex){b.setAttribute('aria-current','step');b.classList.add('active');}
    nav.append(b);
   });
   container.append(nav);
   const task=unit.tasks[taskIndex],card=el('section',undefined,'u6-active-task');
   const kind=task.type==='reading'?'Reading comprehension':task.type==='order'?'Sentence order':
    task.type==='choice'?'Choose in context':'Complete the French';
   card.append(el('p','Question '+(taskIndex+1)+' of '+unit.tasks.length+' · '+kind,'eyebrow'),
    el('h4',task.prompt));
   const form=el('form',undefined,'u6-answer-form');
   let getAnswer:()=>string=()=>'',reset:()=>void=()=>{};
   if(task.type==='choice'||task.type==='reading'){
    const select=el('select');select.setAttribute('aria-label','Answer question '+(taskIndex+1));
    const empty=el('option','Choose an answer');empty.value='';select.append(empty);
    for(const option of task.options){const row=el('option',option);row.value=option;select.append(row);}
    form.append(select);getAnswer=()=>select.value;reset=()=>{select.value='';};
   }else if(task.type==='order'){
    const words=el('div',undefined,'u6-order-words');
    const assembled=el('p','Your sentence: —','u6-assembled');assembled.setAttribute('role','status');
    const picked:string[]=[];const available:HTMLButtonElement[]=[];
    for(const token of task.options){
     const tokenButton=button(token,()=>{
      picked.push(token);tokenButton.disabled=true;
      assembled.textContent='Your sentence: '+picked.join(' ');
     },'u6-word-token');
     available.push(tokenButton);words.append(tokenButton);
    }
    const erase=button('Reset word order',()=>{
     picked.length=0;available.forEach(b=>{b.disabled=false;});assembled.textContent='Your sentence: —';
    });
    form.append(words,assembled,erase);getAnswer=()=>picked.join(' ');
    reset=()=>erase.click();
   }else{
    const input=el('input');input.type='text';input.lang='fr';input.autocomplete='off';input.maxLength=140;
    input.setAttribute('aria-label','Answer question '+(taskIndex+1));
    form.append(input);getAnswer=()=>input.value;reset=()=>{input.value='';};
   }
   const result=el('p','','u6-answer-feedback');result.setAttribute('role','status');
   const help=el('div',undefined,'u6-answer-help');
   const submit=el('button','Check answer','primary-action compact-action');submit.type='submit';
   form.addEventListener('submit',event=>{
    event.preventDefault();
    const value=getAnswer().trim();
    if(!value){result.textContent='Enter or select an answer before checking.';return;}
    const passed=checkPracticeAnswer(value,task.answer);
    if(passed){
     record.set(task.id,true);
     result.textContent='Correct. '+task.explanation;
     help.replaceChildren();
    }else{
     errors.add(task.focus);mistakes.set(unit.id,errors);
     result.textContent='Not yet. '+task.explanation+' Revisit the '+task.focus+' point, then try again.';
     help.replaceChildren(button('Review lesson explanation',()=>open(unit.id,'understand')));
    }
    // Refresh counters and side navigation without removing typed answer or feedback.
    renderIndex();
    const label=nav.querySelector<HTMLButtonElement>('button:nth-child('+(taskIndex+1)+')');
    if(label&&passed)label.textContent=String(taskIndex+1)+' ✓';
    container.querySelector<HTMLElement>('.u6-practice-status')!.textContent=
     originalFrenchPracticeStatus(unit.id,record)!.correct+'/'+unit.tasks.length+
     ' correct tasks this visit · ungraded and not saved.';
   });
   const reveal=button('Show worked answer (assisted)',()=>{
    help.replaceChildren(el('p','Model answer: '+task.answer+'. '+task.explanation));
   });
   const next=button(taskIndex===unit.tasks.length-1?'Return to first question':'Next question →',()=>{
    taskIndex=(taskIndex+1)%unit.tasks.length;render();
   });
   form.append(submit,reveal,result,help,next);card.append(form);container.append(card);
   if(errors.size)container.append(el('p','Recommended review topics from your attempts: '+[...errors].join(', ')+'.','u6-recommendation'));
   const resetAll=button('Clear this lesson’s temporary answers',()=>{
    answers.delete(unit.id);mistakes.delete(unit.id);taskIndex=0;reset();render();
   });
   container.append(resetAll);
  }
  function renderWrite(unit:A1Unit,container:HTMLElement){
   container.append(el('h4','Independent writing'),el('p',unit.writing.prompt));
   const items=el('ul',undefined,'u6-write-criteria');
   for(const criterion of unit.writing.criteria)items.append(el('li',criterion));
   const editor=el('textarea');editor.rows=5;editor.lang='fr';editor.maxLength=2400;
   editor.value=drafts.get(unit.id)??'';editor.setAttribute('aria-label','Original A1 writing response');
   editor.addEventListener('input',()=>drafts.set(unit.id,editor.value));
   const result=el('p','Your text remains in memory only until this Course view closes.','u6-small');
   const check=button('Check structure (not grammar grading)',()=>{
    result.textContent=inspectDraftStructure(editor.value).join(' ')+
     ' Meaning, spelling and grammar are not automatically assessed.';
   });
   const model=el('blockquote',unit.writing.model,'u6-model');model.lang='fr';model.hidden=true;
   const compare=button('Reveal original sample answer',()=>{
    model.hidden=!model.hidden;
    compare.textContent=model.hidden?'Reveal original sample answer':'Hide sample answer';
   });
   const clear=button('Clear this writing draft',()=>{
    editor.value='';drafts.delete(unit.id);result.textContent='Draft cleared. No account data was changed.';
   });
   container.append(items,editor,check,compare,clear,result,model,
    el('p','You decide whether your response meets the criteria; this does not certify A1 proficiency.','u6-small'));
  }
  function render(){
   if(signal.aborted)return;
   article.replaceChildren();
   const head=el('header',undefined,'u6-unit-header');
   head.append(el('p',(current.id.startsWith('a2-')?'A2':'A1')+' · LESSON '+current.id.slice(3)+' · ABOUT '+current.minutes+' MINUTES','eyebrow'),
    el('h3',current.title),el('p',current.goal));
   const pre=el('p',current.prerequisites.length?
    'Suggested foundation: '+(getOriginalFrenchUnit(current.prerequisites[0])?.title??current.prerequisites[0])+'. The lesson is not locked.':
    'Start here: no prior lesson is required.','u6-small');
   head.append(pre);article.append(head);
   const stageNav=el('div',undefined,'u6-stage-nav');stageNav.setAttribute('role','group');stageNav.setAttribute('aria-label','Lesson learning stages');
   for(const [id,title] of STAGES){
    const tab=button(title,()=>open(current.id,id),'u6-stage-button');
    if(stage===id){tab.classList.add('active');tab.setAttribute('aria-current','step');}
    stageNav.append(tab);
   }
   article.append(stageNav);
   const content=el('div',undefined,'u6-stage-body');content.dataset.u6Stage=stage;
   switch(stage){
    case 'understand':renderUnderstand(current,content);break;
    case 'words':renderWords(current,content);break;
    case 'dialogue':renderDialogue(current,content);break;
    case 'listen':stopAudio=mountA1Listening(content,current,signal);break;
    case 'practice':renderPractice(current,content);break;
    case 'write':renderWrite(current,content);break;
   }
   content.append(stepNavigation(stage));article.append(content);
   const trace=el('p','Source: '+current.source.qualifiedId+' · original-owned; learning activity is local only.','u6-provenance');
   article.append(trace);
  }
  function open(id:string,next:Stage){
   const lesson=getOriginalFrenchUnit(id);if(!lesson)return;
   stopAudio?.();stopAudio=null;
   if(id!==current.id)taskIndex=0;
   current=lesson;stage=next;
   renderIndex();render();
  }
  sidebar.addEventListener('keydown',event=>{
   if(!['ArrowUp','ArrowDown','Home','End'].includes(event.key))return;
   const buttons=[...sidebar.querySelectorAll<HTMLButtonElement>('[data-u6-unit]')];
   const at=buttons.indexOf(document.activeElement as HTMLButtonElement);
   if(at<0)return;
   event.preventDefault();
   const selected=event.key==='Home'?0:event.key==='End'?buttons.length-1:
    (at+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;
   const chosen=lessons[selected];
   if(chosen){open(chosen.id,'understand');
    sidebar.querySelector<HTMLButtonElement>('[data-u6-unit="'+chosen.id+'"]')?.focus();}
  });
  signal.addEventListener('abort',()=>stopAudio?.(),{once:true});
  open(lessons[0].id,'understand');
 }catch(error){
  if(signal.aborted)return;
  host.replaceChildren(el('p','Original A1 lessons unavailable. Existing native Learn and Review remain unaffected.'));
  console.error('U6 original A1 course could not be loaded',error);
 }
}
