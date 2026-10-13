import {
 browseOriginalMaterials,getOriginalMaterial,getOriginalCatalogEntry,handoffOriginalLesson,
 takeOriginalHandoff,type OriginalLevel,type OriginalSurface
} from '../core/unified/u23-registry.ts';
import {U20_REVISION_GUIDES} from '../core/unified/u20-revision-guides.ts';
import {U21_REVISION_GUIDES} from '../core/unified/u21-revision-guides.ts';
import {U22_REVISION_GUIDES} from '../core/unified/u22-revision-guides.ts';
import type {RouteId} from '../core/types';
import {readOriginalContinuity} from '../core/unified/u24-continuity';
import {appendU26GrammarPractice} from './u26-grammar-panel';
import {appendOriginalVocabularyJourney} from './u28-vocabulary-panel';
import {appendOriginalReadingJourney} from './u29-reading-panel';
import './u22-source-panel.css';

type Mode='read'|'listen'|'write';
type Material=NonNullable<ReturnType<typeof getOriginalMaterial>>;
function el<K extends keyof HTMLElementTagNameMap>(tag:K,text='',css=''):HTMLElementTagNameMap[K]{
 const n=document.createElement(tag);if(text)n.textContent=text;if(css)n.className=css;return n;
}
function button(label:string,fn:()=>void):HTMLButtonElement{
 const b=el('button',label,'secondary-action compact-action');b.type='button';b.onclick=fn;return b;
}
type Question={readonly prompt:string;readonly answer:string;readonly options:readonly string[];readonly explanation:string};
function questionSet(host:HTMLElement,items:readonly Question[],kind:string){
 for(const [i,q] of items.entries()){
  const form=el('form','','u22-source-question'),label=el('label',(i+1)+'. '+q.prompt);
  const select=el('select');select.setAttribute('aria-label',kind+' '+(i+1));
  const first=el('option','Choose an answer');first.value='';select.append(first);
  for(const text of q.options){const o=el('option',text);o.value=text;select.append(o);}
  const feedback=el('p','','u22-source-feedback');feedback.setAttribute('role','status');
  const submit=el('button','Check answer','secondary-action compact-action');submit.type='submit';
  form.onsubmit=event=>{
   event.preventDefault();
   if(!select.value){feedback.textContent='Choose an answer.';return;}
   feedback.textContent=(select.value.normalize('NFC')===q.answer.normalize('NFC')?
    'Supported by the authored source. ':'Not supported by the authored source. ')+q.explanation;
  };
  label.append(select);form.append(label,submit,feedback);host.append(form);
 }
}
function renderRead(host:HTMLElement,s:Material){
 if(!s.reading){host.append(el('p','No independently authored connected reading is linked to this lesson.','u22-source-note'));return;}
 host.append(el('h3',s.reading.title),el('p','Read the full passage before answering. Authored practice does not establish CEFR proficiency.','u22-source-note'));
 for(const text of s.reading.french.split(/\n\s*\n/)){const p=el('p',text,'u22-source-paragraph');p.lang='fr';host.append(p);}
 host.append(el('h3','Reading comprehension'));questionSet(host,s.reading.questions,'Reading');
 if(s.evidence?.sources.length){
  host.append(el('h3','Compare attributed sources'));
  for(const [i,src] of s.evidence.sources.entries()){
   const box=el('article','','u22-source-document');
   box.append(el('h4','Source '+(i+1)+' · '+src.label+' ('+src.type+')'));
   const p=el('p',src.french);p.lang='fr';box.append(p);host.append(box);
  }
  questionSet(host,s.evidence.questions,'Source comparison');
 }
}
function renderListen(host:HTMLElement,s:Material,signal:AbortSignal){
 host.append(el('h3','Original French dialogue listening'),el('p','Optional device-generated French text-to-speech, not a human recording or pronunciation grade. Listen before revealing the transcript.','u22-source-note'));
 const supported='speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
 const select=el('select');select.setAttribute('aria-label','Select French dialogue turn');
 s.unit.dialogue.forEach((line,i)=>{const opt=el('option',String(i+1)+' · '+line.speaker);opt.value=String(i);select.append(opt);});
 const transcription=el('ol','','u22-source-transcript');transcription.hidden=true;transcription.lang='fr';
 s.unit.dialogue.forEach(line=>transcription.append(el('li',line.speaker+': '+line.fr)));
 const controls=el('div','','u22-source-controls');
 let playing=false;
 const play=button('Play turn',()=>{
  if(!supported||signal.aborted)return;
  window.speechSynthesis.cancel();
  const item=s.unit.dialogue[Number(select.value)||0];if(!item)return;
  const speech=new SpeechSynthesisUtterance(item.fr);
  speech.lang='fr-FR';speech.rate=.92;playing=true;
  speech.onend=()=>{playing=false;};speech.onerror=()=>{playing=false;};
  window.speechSynthesis.speak(speech);
 });play.disabled=!supported;
 const reveal=button('Show transcript',()=>{
  transcription.hidden=!transcription.hidden;
  reveal.textContent=transcription.hidden?'Show transcript':'Hide transcript';
  reveal.setAttribute('aria-expanded',String(!transcription.hidden));
 });reveal.setAttribute('aria-expanded','false');
 controls.append(select,play,reveal);host.append(controls);
 if(!supported)host.append(el('p','French device speech unavailable; the written dialogue is still accessible.','u22-source-note'));
 host.append(transcription);
 if(s.listening.length){host.append(el('h3','Listening comprehension'));questionSet(host,s.listening,'Listening');}
 else host.append(el('p','Use the transcript and turn playback for ungraded practice; this lesson has no authored listening questions.','u22-source-note'));
 signal.addEventListener('abort',()=>{if(playing&&supported)window.speechSynthesis.cancel();},{once:true});
}
function renderWrite(host:HTMLElement,s:Material,drafts:Map<string,string>){
 host.append(el('h3','Independent original French writing'),el('p','Drafts remain in this page only. Authored examples are not automatic semantic grading; no SRS, CEFR or Account writes.','u22-source-note'));
 const expanded=s.writingChoices;
 const modes:{label:string;prompt:string;criteria:readonly string[];model:string}[]=expanded?
  [{label:'Listening response',...expanded.fromListening},
   {label:'Source comparison',...expanded.fromSources},
   {label:'Debate response',...expanded.fromDebate}]:
  [{label:'Original writing',...s.unit.writing}];
 const bar=el('div','','u22-source-controls'),content=el('div','','u22-source-write');
 let active=0;
 const buttons=modes.map(({label},i)=>{const b=button(label,()=>{active=i;draw();});bar.append(b);return b;});
 host.append(bar,content);
 function draw(){
  content.replaceChildren();
  buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===active)));
  const item=modes[active],key=s.unit.id+':'+active;
  content.append(el('h4',item.label),el('p',item.prompt));
  const checks=el('ul');for(const criterion of item.criteria)checks.append(el('li',criterion));content.append(checks);
  const label=el('label','Write your own answer in French');
  const input=el('textarea');input.rows=8;input.maxLength=12000;input.spellcheck=true;
  input.value=drafts.get(key)??'';input.addEventListener('input',()=>drafts.set(key,input.value));
  label.append(input);content.append(label);
  const model=el('article','','u22-source-document');model.hidden=true;
  model.append(el('h4','Original example, not the only valid response'));
  const example=el('p',item.model,'u22-source-paragraph');example.lang='fr';model.append(example);
  const reveal=button('Show authored example',()=>{
   model.hidden=!model.hidden;reveal.textContent=model.hidden?'Show authored example':'Hide authored example';
   reveal.setAttribute('aria-expanded',String(!model.hidden));
  });reveal.setAttribute('aria-expanded','false');content.append(reveal,model);
  const guide=U22_REVISION_GUIDES[s.unit.id]??
   U21_REVISION_GUIDES[s.unit.id]??U20_REVISION_GUIDES[s.unit.id];
  if(guide){
   const details=el('details'),summary=el('summary','Source-specific revision guidance'),list=el('ol');
   for(const note of guide)list.append(el('li',note));
   details.append(summary,list);content.append(details);
  }
 }draw();
}
/** Shared original-material renderer; historical U22 filename retained, no second learner engine. */
export function createOriginalMaterialPanel(mode:Mode,signal:AbortSignal,navigate:(route:RouteId)=>void):HTMLElement {
 const panel=el('section','','u22-source-panel');
 panel.setAttribute('aria-label','Original French '+mode+' study');
 const heading=el('h2','Original '+(mode==='read'?'reading':mode==='listen'?'listening':'writing'));
 heading.tabIndex=-1;
 panel.append(el('p','ORIGINAL COURSE · SOURCE-QUALIFIED','eyebrow'),heading,
  el('p','Browse the original A1–B2 course using the same source identities as Course. Practice here is independent of native SRS and CEFR scoring.','u22-source-note'));
 const initial=takeOriginalHandoff(mode);
 const queryLabel=el('label','Find a lesson or French expression');
 const query=el('input');query.type='search';query.placeholder='Title, topic, grammar or vocabulary';query.autocomplete='off';
 query.setAttribute('aria-label','Search original French material');queryLabel.append(query);
 const levelLabel=el('label','Level'),level=el('select');
 for(const value of ['all','A1','A2','B1','B1+','Early B2'] as const){
  const option=el('option',value==='all'?'All levels':value);option.value=value;level.append(option);
 }levelLabel.append(level);
 const pickerLabel=el('label','Original lesson'),picker=el('select');
 picker.setAttribute('aria-label','Choose source-qualified lesson');pickerLabel.append(picker);
 const count=el('p','','u22-source-note');count.setAttribute('role','status');
 const showMore=button('Show more lessons',()=>{visible+=60;refresh(false);});
 const filters=el('div','','u23-material-filters');filters.append(queryLabel,levelLabel,pickerLabel,count,showMore);
 const stage=el('div','','u22-source-content'),drafts=new Map<string,string>();
 const unsent=()=>[...drafts.values()].some(value=>value.trim())||
  !!stage.querySelector<HTMLTextAreaElement>('.u28-writing textarea')?.value.trim()||
  !!stage.querySelector<HTMLTextAreaElement>('.u29-summary-label textarea')?.value.trim();
 const safeLeave=()=>!unsent()||window.confirm(
  'Your original writing is unsent and temporary. Navigation checkpoints save no text. Leave this workspace and discard its drafts?'
 );
 const onBeforeUnload=(event:BeforeUnloadEvent)=>{
  if(!unsent())return;
  event.preventDefault();event.returnValue='';
 };
 window.addEventListener('beforeunload',onBeforeUnload);
 signal.addEventListener('abort',()=>window.removeEventListener('beforeunload',onBeforeUnload),{once:true});
 const actions=el('nav','','u22-source-controls');actions.setAttribute('aria-label','Open selected lesson in another workspace');
 const availability=mode==='read'?'reading':mode==='listen'?'listening':'writing';
 let visible=60;
 let selected=initial?.id??'';
 const refresh=(reset:boolean)=>{
  if(reset)visible=60;
  const results=browseOriginalMaterials({
   query:query.value,level:level.value as OriginalLevel|'all',material:availability,limit:visible
  });
  const entries=[...results.entries];
  const picked=getOriginalCatalogEntry(selected);
  if(picked&&(availability==='reading'?picked.reading:availability==='listening'?picked.listening:picked.writing)&&
     !entries.some(row=>row.id===picked.id)&&!query.value&&!level.value.match(/^(A1|A2|B1|B1\+|Early B2)$/)){
   entries.unshift(picked);
  }
  picker.replaceChildren();
  if(!entries.length){
   const option=el('option','No matching original lesson');option.value='';picker.append(option);
   selected='';stage.replaceChildren(el('p','No source-qualified material matches these filters.','u22-source-note'));
  }else{
   if(!entries.some(row=>row.id===selected))selected=entries[0].id;
   for(const row of entries){
    const option=el('option',row.level+' · '+row.id+' · '+row.title);option.value=row.id;picker.append(option);
   }
   picker.value=selected;render();
  }
  count.textContent=results.total+' matching lessons · '+Math.min(results.total,entries.length)+' shown';
  showMore.hidden=results.entries.length>=results.total||visible>=results.total;
 };
 function render(){
  const s=getOriginalMaterial(selected),entry=getOriginalCatalogEntry(selected);
  if(mode==='listen'&&'speechSynthesis' in window)window.speechSynthesis.cancel();
  stage.replaceChildren();actions.replaceChildren();
  if(!s||!entry){stage.append(el('p','This source is unavailable. Select another original lesson.','u22-source-note'));return;}
  stage.append(el('p',entry.id+' · '+entry.level+' · '+entry.qualifiedId,'u22-source-note'),
   el('p',s.unit.goal,'u22-source-note'));
  const destinations:readonly [OriginalSurface,string][]=[
   ['course','Open Course'],['read','Read'],['listen','Listen'],['write','Write']
  ];
  for(const [surface,label] of destinations){
   if(surface===mode)continue;
   const permitted=surface==='course'||(surface==='read'?entry.reading:surface==='listen'?entry.listening:entry.writing);
   if(!permitted)continue;
   actions.append(button(label,()=>{
    if(!safeLeave())return;
    if(handoffOriginalLesson(surface,entry.id,surface==='course'?
      mode==='read'?'dialogue':mode==='listen'?'listen':'write':undefined))navigate(surface);
   }));
  }
  stage.append(actions);
  if(mode==='read'){
   renderRead(stage,s);
   appendOriginalReadingJourney(stage,s.unit.id,{
    mode:'read',signal,
    onOpenCourse:id=>{
     if(!safeLeave())return;
     if(handoffOriginalLesson('course',id,'words'))navigate('course');
    },
    onOpenSurface:(surface,id)=>{
     if(!safeLeave())return;
     if(handoffOriginalLesson(surface,id))navigate(surface);
    },
    onNativeReview:()=>{if(safeLeave())navigate('review');}
   });
  }else if(mode==='listen')renderListen(stage,s,signal);
  else renderWrite(stage,s,drafts);
  appendU26GrammarPractice(stage,s.unit.id,mode);
  appendOriginalVocabularyJourney(stage,s.unit.id,{
   mode,signal,
   onNativeReview:()=>{if(safeLeave())navigate('review');},
   onNativeLearn:()=>{if(safeLeave())navigate('learn');},
   onOpenCourse:id=>{
    if(!safeLeave())return;
    if(handoffOriginalLesson('course',id,'words'))navigate('course');
   },
   onOpenSurface:(surface,id)=>{
    if(!safeLeave())return;
    if(handoffOriginalLesson(surface,id))navigate(surface);
   }
  });
 }
 query.addEventListener('input',()=>{
  if(!safeLeave()){query.value='';return;}
  selected='';refresh(true);
 });
 level.addEventListener('change',()=>{
  if(!safeLeave()){level.value='all';return;}
  selected='';refresh(true);
 });
 picker.addEventListener('change',()=>{
  if(!safeLeave()){picker.value=selected;return;}
  selected=picker.value;render();
 });
 const returning=el('div','','u24-source-return');
 returning.setAttribute('aria-label','Return to a saved original Course lesson');
 panel.append(filters,returning,stage);
 // This reads only the existing canonical learner feature and never auto-resumes
 // or transfers a writing draft. Course independently validates before resuming.
 void readOriginalContinuity().then(review=>{
  if(signal.aborted||!panel.isConnected||!review.checkpoint)return;
  returning.replaceChildren(el('p',
   review.status==='ready'?'An original Course position is available.':
    'A saved original Course position needs source or age review.',
   'u22-source-note'));
  returning.append(button('Review Course resume choices',()=>{
   if(safeLeave())navigate('course');
  }));
 });
 refresh(true);
 if(initial&&selected===initial.id)queueMicrotask(()=>{
  if(!signal.aborted&&panel.isConnected){panel.scrollIntoView({block:'start'});heading.focus({preventScroll:true});}
 });
 return panel;
}
