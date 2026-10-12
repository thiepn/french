import type {RouteId} from '../core/types';
import {loadUnifiedOriginalPath,ORIGINAL_PATH_LESSONS,getLessonPath,missingPrerequisites,suggestedLesson} from '../core/unified/u3-pathways';
import {writingScaffold} from '../core/unified/u3-writing';
import {analyzeAttempt,repairForGrammar,reviewProduction} from '../core/unified/u4-feedback';
import {practiceEvent,type PracticeEvent} from '../core/unified/u4-checkpoints';
import {mountJourneyWorkspace} from './u4-journey-panel';
import {enrichGrammar,checkPracticeAnswer} from '../core/unified/u2-grammar';
import {distributionAllowed} from '../core/unified/source';
import './unified-u2.css';
import './unified-u3.css';

function make<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string,css?:string):HTMLElementTagNameMap[K]{
 const element=document.createElement(tag);
 if(text!==undefined)element.textContent=text;
 if(css)element.className=css;
 return element;
}
function control(label:string,handler:()=>void,className='secondary-action compact-action'):HTMLButtonElement{
 const b=make('button',label,className);b.type='button';b.addEventListener('click',handler);return b;
}
export async function mountOriginalLessons(host:HTMLElement,navigate:(route:RouteId)=>void,signal:AbortSignal):Promise<void>{
 host.replaceChildren(make('p','Loading reviewed source-qualified lessons…','unified-result'));
 try{
  const lessons=await loadUnifiedOriginalPath();
  const attempts=new Map<string,Set<string>>(); // route-scoped, never canonical or account-owned
  const practiced=new Set<string>();
  const localEvents:PracticeEvent[]=[];
  let journeyWorkspace:{refresh:()=>void}|null=null;
  if(signal.aborted||!host.isConnected)return;
  if(lessons.some(l=>!distributionAllowed(l.source.source)||l.source.source!=='original'))throw Error('Unqualified lesson source');
  host.replaceChildren();
  const head=make('div',undefined,'u2-studio-head');
  head.append(make('h2','Original guided lessons'),make('p','20 independently written micro-lessons · not the 60 Carnet source sessions · practice only'));
  const pathSummary=make('p','','u3-path-summary');pathSummary.setAttribute('role','status');
  const nextSuggested=control('Start suggested lesson',()=>{const next=suggestedLesson(practiced);if(next)open(next.id);});
  const pathwayNav=make('div',undefined,'u3-path-controls');
  const themeLabel=make('label','Learning pathway');
  const themeSelect=make('select');themeSelect.setAttribute('aria-label','Learning pathway');
  for(const [value,label] of [['all','All original lessons'],['everyday','Everyday situations'],['travel','Travel and services'],['storytelling','Past and storytelling']]){
   const option=make('option',label);option.value=value;themeSelect.append(option);
  }
  themeLabel.append(themeSelect);pathwayNav.append(themeLabel,nextSuggested);
  const updatePath=()=>{
   const theme=themeSelect.value as 'all'|'everyday'|'travel'|'storytelling';
   const suggested=suggestedLesson(practiced,theme);
   pathSummary.textContent=practiced.size+'/'+lessons.length+' lesson exercise sets practiced in this temporary page visit · '+
    (suggested?'Suggested next: '+suggested.title:'No additional suggested lesson in this pathway.');
   nextSuggested.disabled=!suggested;
   nextSuggested.textContent=suggested?'Open suggested: '+suggested.title:'No suggested lesson';
   journeyWorkspace?.refresh();
   for(const button of grid.querySelectorAll<HTMLButtonElement>('[data-u2-id]')){
    const node=getLessonPath(button.dataset.u2Id??'');
    button.hidden=theme!=='all'&&node?.theme!==theme;
    if(node)button.title=missingPrerequisites(node.lessonId,practiced).length?
     'Suggested prerequisites: '+missingPrerequisites(node.lessonId,practiced).join(', '):'Suggested preparation available';
   }
  };
  themeSelect.addEventListener('change',updatePath);head.append(pathwayNav,pathSummary);
  const journeyHost=make('section',undefined,'u4-journey-host');
  head.append(journeyHost);
  const grid=make('div',undefined,'u2-lessons-grid'),stage=make('article',undefined,'u2-lesson-stage');
  grid.dataset.u2Lessons='';
  stage.dataset.u2Stage='';
  const picker=make('label','Lesson','u2-picker');
  const select=make('select');select.setAttribute('aria-label','Original lesson');
  lessons.forEach((lesson,i)=>{
   const option=make('option',String(i+1).padStart(2,'0')+' · '+lesson.title+' ('+lesson.level+')');
   option.value=lesson.id;select.append(option);
  });
  picker.append(select);
  const layout=make('div',undefined,'u2-learning-layout');
  layout.append(grid,stage);
  host.append(head,picker,layout);
  const open=(id:string)=>{
   const lesson=lessons.find(x=>x.id===id);
   if(!lesson)return;
   select.value=id;stage.replaceChildren();
   const topic=make('header',undefined,'u2-lesson-heading');
   topic.append(make('p',lesson.level+' · '+lesson.estimatedMinutes+' min · original source-owned content','eyebrow'),
    make('h3',lesson.title),make('p',lesson.goal));
   stage.append(topic);
   const outstanding=missingPrerequisites(lesson.id,practiced);
   const prerequisite=make('aside',undefined,'u3-prerequisite');
   prerequisite.append(make('strong',outstanding.length?
    'Recommended first (not a lock):':'Recommended foundations:'));
   if(outstanding.length)for(const dep of outstanding){
    const prior=lessons.find(l=>l.id===dep);
    if(prior)prerequisite.append(control('Review '+prior.title,()=>open(prior.id)));
   }
   else prerequisite.append(make('p','The suggested prerequisites have been practiced during this page visit, or this is an entry lesson.'));
   prerequisite.append(make('small','Prerequisites are guidance only. Course browsing never grants mastery or blocks access.'));
   stage.append(prerequisite);
   const situation=make('section',undefined,'u2-dialogue');
   situation.append(make('h4','Dialogue'),make('p',lesson.situation));
   for(const line of lesson.dialogue){
    const row=make('div',undefined,'u2-dialogue-line');
    const fr=make('p',line.fr);fr.lang='fr';row.append(fr);
    const translation=make('p',line.en,'u2-translation');translation.hidden=true;
    row.append(control('Show translation',()=>{
     translation.hidden=!translation.hidden;
    }),translation);
    situation.append(row);
   }
   stage.append(situation);
   const words=make('section',undefined,'u2-words');
   words.append(make('h4','Key expressions'));
   const dl=make('dl');
   for(const entry of lesson.vocabulary){
    const dt=make('dt',entry.fr);dt.lang='fr';dl.append(dt,make('dd',entry.en));
   }
   words.append(dl);stage.append(words);
   const grammar=make('section',undefined,'u2-linked-grammar');
   grammar.append(make('h4','Grammar connection'));
   for(const id of lesson.grammarIds){
    const entry=enrichGrammar(id);
    if(!entry)continue;
    grammar.append(make('p',entry.detail),
     control('Study '+entry.guide.title,()=>{
      sessionStorage.setItem('french-u2-grammar-target',entry.guide.id);navigate('grammar');
     }));
   }
   stage.append(grammar);
   const practice=make('section',undefined,'u2-practice');
   practice.append(make('h4','Active recall'),make('p','Answers are checked locally. No grade, FSRS scheduling or CEFR progress is recorded.'));
   const tally=make('p','','u2-practice-tally');tally.setAttribute('role','status');
   const correct=attempts.get(id)??new Set<string>();
   attempts.set(id,correct);
   const renderTally=()=>{
    tally.textContent=correct.size+' / '+lesson.exercises.length+' tasks answered correctly during this page visit.';
    if(correct.size===lesson.exercises.length)practiced.add(id);
    updatePath();
   };
   renderTally();
   lesson.exercises.forEach((task,index)=>{
    const form=make('form',undefined,'u2-exercise');
    form.append(make('strong','Task '+(index+1)+': '+task.prompt));
    let input:HTMLInputElement|HTMLSelectElement;
    if(task.type==='choice'){
     const selectInput=make('select');selectInput.setAttribute('aria-label','Answer task '+(index+1));
     const placeholder=make('option','Choose an answer');placeholder.value='';selectInput.append(placeholder);
     task.options.forEach(value=>{const opt=make('option',value);opt.value=value;selectInput.append(opt);});
     input=selectInput;
    }else{
     const textInput=make('input');textInput.type='text';textInput.autocomplete='off';
     textInput.setAttribute('aria-label','Answer task '+(index+1));input=textInput;
    }
    const feedback=make('p','','u2-feedback');feedback.setAttribute('role','status');
    const repairPanel=make('aside',undefined,'u4-repair');repairPanel.hidden=true;
    if(input instanceof HTMLInputElement)input.maxLength=160;
    const submit=make('button','Check answer','primary-action compact-action');submit.type='submit';
    form.addEventListener('submit',event=>{
     event.preventDefault();
     if(!input.value.trim()){feedback.textContent='Enter an answer first.';return;}
     const pass=checkPracticeAnswer(input.value,task.answer);
     const record=practiceEvent(localEvents.length+1,lesson.id,task.id,input.value);
     if(record)localEvents.push(record);
     if(pass)correct.add(task.id);
     const diagnosis=analyzeAttempt(input.value,task.answer,lesson.grammarIds[0]??null);
     feedback.textContent=pass?'Correct · '+task.explanation:'Not yet. '+diagnosis.cue+' '+task.explanation;
     repairPanel.replaceChildren();
     repairPanel.hidden=pass;
     if(!pass){
      const related=repairForGrammar(lesson.grammarIds[0]??null);
      if(related){
       repairPanel.append(make('strong','Focused transfer practice (ungraded)'));
       const form2=make('form',undefined,'u4-remediation');
       const lab=make('label',related.prompt);
       const answer=make('input');answer.type='text';answer.lang='fr';answer.autocomplete='off';
       answer.setAttribute('aria-label','Focused answer');answer.maxLength=160;
       const msg=make('p','','u2-feedback');msg.setAttribute('role','status');
       const check2=make('button','Check focused answer','secondary-action compact-action');check2.type='submit';
       form2.addEventListener('submit',event=>{
        event.preventDefault();
        msg.textContent=checkPracticeAnswer(answer.value,related.answer)?
         'Correct local transfer response. '+related.explanation:
         analyzeAttempt(answer.value,related.answer,related.grammarId).cue;
       });
       lab.append(answer);form2.append(lab,check2,msg);repairPanel.append(form2);
      }else repairPanel.append(make('p','Review the source dialogue and try again.'));
     }
     renderTally();
    });
    form.append(input,submit,feedback,repairPanel);practice.append(form);
   });
   practice.append(tally);stage.append(practice);
   const production=make('section',undefined,'u2-production');
   production.append(make('h4','Write it yourself'),make('p',lesson.productionPrompt));
   const scaffold=writingScaffold(lesson.id);
   const hint=make('div',undefined,'u3-writing-hints');
   if(scaffold){
    const reveal=control('Show optional writing guidance',()=>{
     hint.hidden=!hint.hidden;
     reveal.textContent=hint.hidden?'Show optional writing guidance':'Hide writing guidance';
    });
    production.append(reveal);
    hint.hidden=true;
    hint.append(make('p','Sentence starters: '+scaffold.starters.join(' / ')),
     make('p','Useful words: '+scaffold.keyExpressions.join(' · ')),
     make('p','Check: '+scaffold.checkpoints.join(' ')));
    hint.append(control('Reveal a model to compare',()=>{
     if(!hint.querySelector('[data-model]')){
      const model=make('p','One possible response: '+scaffold.model);
      model.dataset.model='';hint.append(model);
     }
    }));
    production.append(hint);
   }
   const response=make('textarea');response.rows=3;response.maxLength=4000;response.setAttribute('aria-label','Free writing response');
   const state=make('p','No answer stored. You can compare your sentence with the dialogue above.','u2-feedback');
   const check=control('Check structure (not grading)',()=>{
    const review=reviewProduction(lesson.id,response.value);
    state.textContent=[...review.notes,...review.promptChecks].join(' ')+
     ' Automated hints are not an assessment. No CEFR or mastery score is assigned.';
   });
   production.append(response,check,control('Clear response',()=>{response.value='';state.textContent='Cleared. Nothing was saved.';}),state);
   stage.append(production);
   const actions=make('div',undefined,'u2-actions');
   const index=lessons.indexOf(lesson),next=lessons[index+1];
   if(next)actions.append(control('Next: '+next.title,()=>open(next.id),'primary-action compact-action'));
   actions.append(control('Review native vocabulary links',()=>navigate('links')));
   stage.append(actions);
   stage.append(make('p','Source: '+lesson.source.qualifiedId+' · original-owned. Not linked to Carnet positions.','u2-provenance'));
   for(const b of grid.querySelectorAll<HTMLButtonElement>('[data-u2-id]')){
    const isActive=b.dataset.u2Id===id;
    b.classList.toggle('selected',isActive);
    if(isActive)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');
   }
  };
  for(const [i,lesson] of lessons.entries()){
   const button=control(String(i+1).padStart(2,'0')+'  '+lesson.title,()=>open(lesson.id),'u2-lesson-option');
   button.dataset.u2Id=lesson.id;grid.append(button);
  }
  select.addEventListener('change',()=>open(select.value));
  grid.addEventListener('keydown',event=>{
   if(!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
   const options=[...grid.querySelectorAll<HTMLButtonElement>('[data-u2-id]')].filter(b=>!b.hidden);
   const index=options.indexOf(document.activeElement as HTMLButtonElement);
   if(index<0||!options.length)return;
   event.preventDefault();
   const next=event.key==='Home'?0:event.key==='End'?options.length-1:
    (index+(event.key==='ArrowDown'||event.key==='ArrowRight'?1:-1)+options.length)%options.length;
   options[next].focus();options[next].click();
  });
  journeyWorkspace=mountJourneyWorkspace(journeyHost,{
   open:(id)=>open(id),practiced,events:()=>localEvents,signal,
   restore:(entries,ids)=>{
    attempts.clear();practiced.clear();localEvents.splice(0,localEvents.length,...entries);
    for(const entry of entries){
     const found=lessons.find(l=>l.id===entry.lessonId)?.exercises.find(e=>e.id===entry.exerciseId);
     if(found&&checkPracticeAnswer(entry.submitted,found.answer)){
      if(!attempts.has(entry.lessonId))attempts.set(entry.lessonId,new Set());
      attempts.get(entry.lessonId)!.add(entry.exerciseId);
     }
    }
    for(const id of ids)practiced.add(id);
    open(select.value);updatePath();
   }
  });
  let preferred:string|null=null;
  try{preferred=sessionStorage.getItem('french-u2-lesson-target');sessionStorage.removeItem('french-u2-lesson-target');}catch{}
  open(lessons.some(x=>x.id===preferred)?preferred!:lessons[0].id);
  updatePath();
 }catch(error){
  if(signal.aborted)return;
  host.replaceChildren(make('p','Original curriculum unavailable. Native Learn and Review are unaffected.','unified-result'));
  console.error('U2 lesson qualification failed',error);
 }
}
export function addGrammarDeepDive(host:HTMLElement,id:string,navigate:(route:RouteId)=>void):void{
 const data=enrichGrammar(id);
 if(!data){host.replaceChildren();return;}
 host.replaceChildren();
 const wrap=make('section',undefined,'u2-grammar-depth');
 wrap.append(make('h3','Understand the rule'),make('p',data.detail));
 const examples=make('div',undefined,'u2-worked');
 for(const example of data.examples){
  const box=make('div',undefined,'u2-worked-example');
  const fr=make('strong',example.fr);fr.lang='fr';
  box.append(fr,make('p',example.en));examples.append(box);
 }
 wrap.append(examples,make('h3','Common corrections'));
 for(const item of data.contrast){
  const row=make('div',undefined,'u2-correction');
  row.append(make('s',item.wrong),make('strong',item.corrected),make('p',item.why));wrap.append(row);
 }
 wrap.append(make('h3','Apply it in context'),make('p','Two additional practice questions; ungraded and not stored.'));
 for(const [index,question] of data.challenge.entries()){
  const form=make('form',undefined,'u2-exercise');
  const questionLabel=make('label',question.prompt);questionLabel.htmlFor='u2-grammar-'+index;
  const input=make('input');input.id='u2-grammar-'+index;input.autocomplete='off';input.lang='fr';
  const result=make('p','','u2-feedback');result.setAttribute('role','status');
  const button=make('button','Check','secondary-action compact-action');button.type='submit';
  form.addEventListener('submit',event=>{
   event.preventDefault();result.textContent=checkPracticeAnswer(input.value,question.answer)?
    'Correct · ungraded.':'Not yet. Hint: '+question.hint;
  });
  form.append(questionLabel,input,button,result);wrap.append(form);
 }
 const links=make('div',undefined,'u2-grammar-links');
 links.append(make('h3','Use this in a lesson'));
 for(const lessonId of data.linkedLessonIds){
  const lesson=ORIGINAL_PATH_LESSONS.find(item=>item.id===lessonId);
  if(lesson)links.append(control(lesson.title,()=>{
   sessionStorage.setItem('french-u2-lesson-target',lesson.id);navigate('course');
  }));
 }
 wrap.append(links,make('p','Original U2 expansion · no imported textbook prose · '+data.guide.source.qualifiedId,'u2-provenance'));
 host.append(wrap);
}
