import {ORIGINAL_U22_SCENARIOS} from '../core/unified/u22-course.ts';
import {U22_REVISION_GUIDES} from '../core/unified/u22-revision-guides.ts';
import './u22-source-panel.css';

type Mode='read'|'listen'|'write';
type Story=(typeof ORIGINAL_U22_SCENARIOS)[number];
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
function renderRead(host:HTMLElement,s:Story){
 host.append(el('h3',s.reading.title),el('p','Read the full text before answering. Original fictional instructional sources, not official advice.','u22-source-note'));
 for(const text of s.reading.french.split(/\n\s*\n/)){const p=el('p',text,'u22-source-paragraph');p.lang='fr';host.append(p);}
 host.append(el('h3','Reading comprehension'));questionSet(host,s.reading.questions,'Reading');
 host.append(el('h3','Compare independent sources'));
 for(const [i,src] of s.evidence.entries()){
  const box=el('article','','u22-source-document');
  box.append(el('h4','Source '+(i+1)+' · '+src.label+' ('+src.type+')'));
  const p=el('p',src.french);p.lang='fr';box.append(p);host.append(box);
 }
 questionSet(host,s.crossQuestions,'Source comparison');
}
function renderListen(host:HTMLElement,s:Story,signal:AbortSignal){
 host.append(el('h3','Nine-turn listening dialogue'),el('p','Optional synthetic device French speech, not a native recording or pronunciation grade. Listen before revealing the transcript.','u22-source-note'));
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
  const item=s.unit.dialogue[Number(select.value)||0];
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
 host.append(transcription,el('h3','Listening comprehension'));
 questionSet(host,s.listening,'Listening');
 signal.addEventListener('abort',()=>{if(playing&&supported)window.speechSynthesis.cancel();},{once:true});
}
function renderWrite(host:HTMLElement,s:Story,drafts:Map<string,string>){
 host.append(el('h3','Independent B2 source writing'),el('p','Draft text is temporary and stays in this page. No score, SRS change, Account sync or CEFR promotion.','u22-source-note'));
 const modes=[
  ['Listening response',s.writingChoices.fromListening],
  ['Source comparison',s.writingChoices.fromSources],
  ['Debate response',s.writingChoices.fromDebate]
 ] as const;
 const bar=el('div','','u22-source-controls'),content=el('div','','u22-source-write');
 let active=0;
 const buttons=modes.map(([name],i)=>{const b=button(name,()=>{active=i;draw();});bar.append(b);return b;});
 host.append(bar,content);
 function draw(){
  content.replaceChildren();
  buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===active)));
  const item=modes[active][1],key=s.unit.id+':'+active;
  content.append(el('h4',modes[active][0]),el('p',item.prompt));
  const checks=el('ul');for(const criterion of item.criteria)checks.append(el('li',criterion));content.append(checks);
  const label=el('label','Write an independent answer in French');
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
  const guide=U22_REVISION_GUIDES[s.unit.id];
  if(guide){
   const details=el('details'),summary=el('summary','Source-specific revision guidance'),list=el('ol');
   for(const note of guide)list.append(el('li',note));
   details.append(summary,list);content.append(details);
  }
 }draw();
}
/** Read/Listen/Write extension. Practice only: all existing learner-state writers remain authoritative. */
export function createU22SourcePanel(mode:Mode,signal:AbortSignal):HTMLElement{
 const panel=el('section','','u22-source-panel');
 panel.setAttribute('aria-label','Original early-B2 '+mode+' practice');
 panel.append(el('p','ORIGINAL COURSE · EARLY B2','eyebrow'),
  el('h2','Source-critical '+(mode==='read'?'reading':mode==='listen'?'listening':'writing')),
  el('p','Fifteen original scenarios (136–150). Choose a case for independent, ungraded '+mode+' practice.','u22-source-note'));
 const label=el('label','Choose original B2 scenario'),select=el('select');
 select.setAttribute('aria-label','Choose U22 B2 scenario');
 for(const story of ORIGINAL_U22_SCENARIOS){
  const option=el('option',story.unit.id+' · '+story.unit.title);option.value=story.unit.id;select.append(option);
 }
 const stage=el('div','','u22-source-content'),drafts=new Map<string,string>();
 const render=()=>{
  if(signal.aborted)return;
  const s=ORIGINAL_U22_SCENARIOS.find(story=>story.unit.id===select.value)??ORIGINAL_U22_SCENARIOS[0];
  stage.replaceChildren(el('p',s.unit.goal,'u22-source-note'));
  if(mode==='read')renderRead(stage,s);
  else if(mode==='listen')renderListen(stage,s,signal);
  else renderWrite(stage,s,drafts);
 };
 label.append(select);panel.append(label,stage);
 select.addEventListener('change',render);render();return panel;
}
