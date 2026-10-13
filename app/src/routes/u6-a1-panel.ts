import type {RouteId} from '../core/types';
import {loadU22OriginalFrenchCourse,getU22OriginalUnit,suggestedU22OriginalUnit,u22PracticeStatus} from '../core/unified/u22-course';
import {u22ProductionChoices} from '../core/unified/u22-material';
import {U20_REVISION_GUIDES} from '../core/unified/u20-revision-guides';
import {U21_REVISION_GUIDES} from '../core/unified/u21-revision-guides';
import {U22_REVISION_GUIDES} from '../core/unified/u22-revision-guides';
import {appendOriginalB1Reading} from './u10-reading-panel';
import {mountA1Listening} from './u7-listening-panel';
import {checkPracticeAnswer} from '../core/unified/u2-grammar';
import {inspectDraftStructure} from '../core/unified/u3-writing';
import type {A1Task,A1Unit} from '../core/unified/u6-a1-model';
import './unified-u6.css';
import './unified-u8.css';
import './unified-u20.css';
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
 host.replaceChildren(el('p','Loading the original French full Course…'));
 try{
  const lessons=await loadU22OriginalFrenchCourse();
  if(signal.aborted||!host.isConnected)return;
  // Ephemeral course practice, deliberately independent of the canonical native scheduler.
  const answers=new Map<string,Map<string,boolean>>();
  const mistakes=new Map<string,Set<string>>();
  const drafts=new Map<string,string>();
  // Earlier draft snapshots for U20 self-revision; same page lifetime as original temporary drafts.
  const revisionSnapshots=new Map<string,string>();
  let current=lessons[0],stage:Stage='understand',taskIndex=0;
  let stopAudio:(()=>void)|null=null;
  host.replaceChildren();host.className='u6-full-course';
  const header=el('header',undefined,'u6-head');
  header.append(el('p','ORIGINAL COURSE · A1 + A2 + B1','eyebrow'),
    el('h2','Learn French from the beginning'),
    el('p','A continuous 244-unit original French curriculum: 94 complete A1–B1+ lessons and 150 original U13–U22 transfer scenarios. U22 adds fifteen early-B2 source-critical cases with extended reading, dated evidence, dialogue, optional synthetic listening, independent writing and revision.'));
  const status=el('p',undefined,'u6-course-status');status.setAttribute('role','status');
  const layout=el('div',undefined,'u6-layout');
  const sidebar=el('nav',undefined,'u6-lesson-index');sidebar.setAttribute('aria-label','Original A1, A2 and B1 full course lessons');
  const article=el('article',undefined,'u6-lesson-content');article.dataset.u6LessonContent='';
  layout.append(sidebar,article);host.append(header,status,layout);
  const answerMap=(id:string)=>{
   let found=answers.get(id);
   if(!found){found=new Map();answers.set(id,found);}
   return found;
  };
  const practiced=()=>{
   const passed=new Set<string>();
   for(const unit of lessons)if(u22PracticeStatus(unit.id,answerMap(unit.id))?.locallyPracticed)passed.add(unit.id);
   return passed;
  };
  function renderIndex(){
   const done=practiced(),next=suggestedU22OriginalUnit(done);
   status.textContent=done.size+'/'+lessons.length+
    ' lesson exercise sets practiced in this page visit. '+
    (next?'Suggested next: '+next.title+'.':'Every lesson exercise set has a correct response recorded locally.');
   sidebar.replaceChildren(el('h3','A1–B2 lesson sequence'));
   const jump=el('div',undefined,'u8-jump-level');
   jump.append(button('Start A1',()=>open('a1-01','understand'),'u8-level-button'),
    button('A2 stories',()=>open('a2-01','understand'),'u8-level-button'),
    button('A2 practical',()=>open('a2-15','understand'),'u8-level-button'),
    button('B1 reading',()=>open('b1-01','understand'),'u8-level-button'),
    button('B1 depth',()=>open('b1-15','understand'),'u8-level-button'),
    button('B1 production',()=>open('b1-29','understand'),'u8-level-button'),
    button('Integrated transfer',()=>open('transfer-01','understand'),'u8-level-button'),
    button('Independent B1+',()=>open('transfer-16','understand'),'u8-level-button'),
    button('B1+ argumentation',()=>open('transfer-31','understand'),'u8-level-button'),
    button('Extended inference',()=>open('transfer-46','understand'),'u8-level-button'),
    button('Genre-aware B1+',()=>open('transfer-61','understand'),'u8-level-button'),
    button('Advanced discourse',()=>open('transfer-76','understand'),'u8-level-button'),
    button('Critical B1+/B2',()=>open('transfer-91','understand'),'u8-level-button'),
    button('Early B2 revision',()=>open('transfer-106','understand'),'u8-level-button'),
    button('B2 narratives & debate',()=>open('transfer-121','understand'),'u8-level-button'),
     button('B2 source critique',()=>open('transfer-136','understand'),'u8-level-button'));
   sidebar.append(jump);
   for(const unit of lessons){
    if(unit.id==='a2-01')sidebar.append(el('h4','A2 · Past actions and practical communication','u8-course-divider'));
    if(unit.id==='a2-15')sidebar.append(el('h4','A2 · Practical independence','u8-course-divider'));
    if(unit.id==='b1-01')sidebar.append(el('h4','B1 · Connected reading and explanation','u8-course-divider'));
    if(unit.id==='b1-15')sidebar.append(el('h4','B1 · Genres, evidence and independent expression','u8-course-divider'));
    if(unit.id==='b1-29')sidebar.append(el('h4','B1 · Discussion, listening and independent production','u8-course-divider'));
    if(unit.id==='transfer-01')sidebar.append(el('h4','A1–B1 · Integrated real-world transfer','u8-course-divider'));
    if(unit.id==='transfer-16')sidebar.append(el('h4','B1+ · Unseen communication and independent transfer','u8-course-divider'));
    if(unit.id==='transfer-31')sidebar.append(el('h4','B1+ · Autonomous argumentation, evidence and nuanced response','u8-course-divider'));
    if(unit.id==='transfer-46')sidebar.append(el('h4','B1+ · Extended conversations, complex inference and autonomous expression','u8-course-divider'));
    if(unit.id==='transfer-61')sidebar.append(el('h4','B1+ · Genre-aware reading, spontaneous dialogue and independent production','u8-course-divider'));
    if(unit.id==='transfer-76')sidebar.append(el('h4','B1+ · Advanced discourse, nuanced listening and long-form synthesis','u8-course-divider'));
    if(unit.id==='transfer-91')sidebar.append(el('h4','B1+/early B2 · Critical reading, complex narratives and independent argumentation','u8-course-divider'));
    if(unit.id==='transfer-106')sidebar.append(el('h4','B1+/early B2 · Critical synthesis, extended discourse and independent revision','u8-course-divider'));
    if(unit.id==='transfer-121')sidebar.append(el('h4','Early B2 · Extended narratives, debate and autonomous revision','u8-course-divider'));
     if(unit.id==='transfer-136')sidebar.append(el('h4','Early B2 · Source-critical reading and responsible decisions','u8-course-divider'));
    const practice=u22PracticeStatus(unit.id,answerMap(unit.id))!;
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
   if(unit.id.startsWith('b1-')||unit.id.startsWith('transfer-'))appendOriginalB1Reading(container,unit);
   container.append(el('p','Next, try listening to the original dialogue without revealing the translations.','u6-small'));
  }
  function renderPractice(unit:A1Unit,container:HTMLElement){
   const record=answerMap(unit.id);
   const practicedCount=u22PracticeStatus(unit.id,record)!;
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
     u22PracticeStatus(unit.id,record)!.correct+'/'+unit.tasks.length+
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
   const variants=u22ProductionChoices(unit.id);
   let onWritingModeChanged=()=>{};
   let mode:'fromSources'|'fromListening'|'fromDebate'='fromSources';
   const chosen=()=>variants?(variants[mode]??variants.fromSources):unit.writing;
   const draftKey=()=>variants?unit.id+'::'+mode:unit.id;
   const heading=el('h4','Independent writing');
   const prompt=el('p',chosen().prompt,'u14-production-prompt');
   const items=el('ul',undefined,'u6-write-criteria');
   const editor=el('textarea');editor.rows=8;editor.lang='fr';editor.maxLength=3500;
   editor.setAttribute('aria-label','Independent original French writing response');
   const result=el('p','Your text remains in memory only until this Course view closes.','u6-small');
   const model=el('blockquote',chosen().model,'u6-model');model.lang='fr';model.hidden=true;
   const compare=button('Reveal original sample answer',()=>{
    model.hidden=!model.hidden;
    compare.textContent=model.hidden?'Reveal original sample answer':'Hide sample answer';
    compare.setAttribute('aria-expanded',String(!model.hidden));
   });
   compare.setAttribute('aria-expanded','false');
   const updatePrompt=()=>{
    const choice=chosen();
    prompt.textContent=choice.prompt;
    items.replaceChildren();
    for(const criterion of choice.criteria)items.append(el('li',criterion));
    editor.value=drafts.get(draftKey())??'';
    model.textContent=choice.model;model.hidden=true;
    compare.textContent='Reveal original sample answer';compare.setAttribute('aria-expanded','false');
    result.textContent='Your text stays in this Course page memory only. The selected task is not graded or uploaded.';
    onWritingModeChanged();
   };
   if(variants){
    const options=el('div',undefined,'u14-writing-mode');
    const label=el('label','Choose an independent communication task');
    const select=el('select');
    select.setAttribute('aria-label','Choose evidence-to-writing transfer mode');
    const source=el('option','Compare two source documents');source.value='fromSources';
    const listening=el('option','Listen and write a neutral summary');listening.value='fromListening';
    select.append(source,listening);
    if(variants.fromDebate){const argument=el('option','Make a reasoned recommendation and address a counterargument');argument.value='fromDebate';select.append(argument);}
    select.addEventListener('change',()=>{
     mode=select.value==='fromListening'?'fromListening':select.value==='fromDebate'&&variants.fromDebate?'fromDebate':'fromSources';
     updatePrompt();
    });
    label.append(select);
    const revisit=button('Review supporting sources',()=>{
     open(unit.id,mode==='fromListening'?'listen':'dialogue');
    });
    options.append(label,el('p','Choose original source synthesis, dialogue-to-writing, or—where available—an independent argument with an explicit counterpoint. Each has a distinct prompt, rubric and model; no proficiency is automatically graded.','u6-small'),revisit);
    container.append(options);
   }
   editor.addEventListener('input',()=>drafts.set(draftKey(),editor.value));
   const check=button('Check structure (not grammar grading)',()=>{
    result.textContent=inspectDraftStructure(editor.value).join(' ')+
     ' Meaning, grammar and source fidelity require your own comparison; no automatic grade is awarded.';
   });
   const clear=button('Clear selected writing draft',()=>{
    editor.value='';drafts.delete(draftKey());
    result.textContent='Only the currently selected temporary draft was cleared. No account data changed.';
   });
   container.append(heading,prompt,items,editor,check,compare,clear,result,model,
    el('p','Review your answer against the source and dialogue. Writing remains independent and session-only.','u6-small'));
   const revisionPrompts=U22_REVISION_GUIDES[unit.id]??U21_REVISION_GUIDES[unit.id]??U20_REVISION_GUIDES[unit.id];
   if(revisionPrompts){
    const studio=el('section',undefined,'u20-revision-studio');
    studio.append(el('h4','Revise your argument · ungraded'));
    const instructions=el('p','Write independently first. Capture a version, revise it, then compare both versions yourself. No automatic claim of grammar, source correctness or level is made.','u6-small');
    const questions=el('ol');
    for(const item of revisionPrompts)questions.append(el('li',item));
    const comparison=el('div',undefined,'u20-revision-comparison');
    comparison.setAttribute('role','status');
    onWritingModeChanged=()=>{
     comparison.replaceChildren(el('p','Select a writing mode and capture an initial draft to compare revisions in this visit.','u6-small'));
    };
    const capture=button('Capture this draft as the earlier version',()=>{
     if(!editor.value.trim()){comparison.textContent='Write a draft before capturing a version.';return;}
     revisionSnapshots.set(draftKey(),editor.value);
     comparison.textContent='Earlier version captured in this page visit. Revise the text above, then compare.';
    });
    const show=button('Compare revised draft with captured version',()=>{
     const before=revisionSnapshots.get(draftKey());
     if(!before){comparison.textContent='Capture an earlier version of this writing mode first.';return;}
     comparison.replaceChildren();
     const columns=el('div',undefined,'u20-revision-columns');
     const old=el('div'),newDraft=el('div');
     old.append(el('h5','Earlier version'),el('p',before,'u20-revision-copy'));
     newDraft.append(el('h5','Current version'),el('p',editor.value||'(empty draft)','u20-revision-copy'));
     columns.append(old,newDraft);
     comparison.append(columns,el('p','Review changed claims, source attribution, counterargument and conditional language. Only you decide whether the revision is accurate.','u6-small'));
    });
    const discard=button('Discard captured version',()=>{
     revisionSnapshots.delete(draftKey());
     comparison.textContent='Only the earlier temporary snapshot for this selected writing mode was discarded.';
    });
    const actions=el('div',undefined,'u20-revision-actions');actions.append(capture,show,discard);
    studio.append(instructions,questions,actions,comparison);
    container.append(studio);
    onWritingModeChanged();
   }
   updatePrompt();
  }
  function render(){
   if(signal.aborted)return;
   article.replaceChildren();
   const head=el('header',undefined,'u6-unit-header');
   head.append(el('p',(current.id.startsWith('transfer-')?'A1–B1 TRANSFER':current.id.startsWith('b1-')?'B1':current.id.startsWith('a2-')?'A2':'A1')+' · LESSON '+(current.id.startsWith('transfer-')?current.id.slice(9):current.id.slice(3))+' · ABOUT '+current.minutes+' MINUTES','eyebrow'),
    el('h3',current.title),el('p',current.goal));
   const pre=el('p',current.prerequisites.length?
    'Suggested foundation: '+(getU22OriginalUnit(current.prerequisites[0])?.title??current.prerequisites[0])+'. The lesson is not locked.':
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
   const lesson=getU22OriginalUnit(id);if(!lesson)return;
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
  host.replaceChildren(el('p','Original French lessons unavailable. Existing native Learn and Review remain unaffected.'));
  console.error('U6 original A1 course could not be loaded',error);
 }
}
