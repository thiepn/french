import {
 originalU37Communication,evaluateU37AuthoredChoice,
 type U37Interaction,type U37Register
} from '../core/unified/u37-communication.ts';
import type {OriginalSurface} from '../core/unified/u23-registry.ts';
import './u37-communication-panel.css';

interface Options{
 readonly signal:AbortSignal;
 readonly onPrivateChange?:(hasDraft:boolean)=>void;
 readonly onOpenSurface?:(surface:OriginalSurface,id:string)=>void;
 readonly onNativeReview?:()=>void;
}
type Work={first:string;second:string;captured:string;register:U37Register};
const blank=(register:U37Register):Work=>({first:'',second:'',captured:'',register});
const REGISTERS:readonly [U37Register,string][]=[
 ['familiar','Familiar / tu · only when appropriate'],
 ['professional','Professional / vous · courteous precision'],
 ['public','Public audience · neutral and evidence-qualified']
];
function el<K extends keyof HTMLElementTagNameMap>(tag:K,text='',cls=''):HTMLElementTagNameMap[K]{
 const x=document.createElement(tag);if(text)x.textContent=text;if(cls)x.className=cls;return x;
}
function button(name:string,fn:()=>void,primary=false):HTMLButtonElement{
 const b=el('button',name,primary?'primary-action compact-action':'secondary-action compact-action');
 b.type='button';b.addEventListener('click',fn);return b;
}
/** Single disposable U36/U35-owned original French lesson surface; no new storage. */
export function appendOriginalU37Communication(host:HTMLElement,id:string,options:Options):()=>void{
 const scene=originalU37Communication(id);if(!scene)return()=>{};
 const root=el('section','','u37-communication');
 root.dataset.hasPrivateDraft='false';
 root.setAttribute('aria-label','Original-source French practical communication scenarios');
 const details=el('details','','u37-disclosure');
 details.append(el('summary','U37 · Real-world French communication and independent repair'));
 const body=el('div','','u37-body');details.append(body);root.append(details);host.append(root);
 const intro=el('header','','u37-intro');
 intro.append(el('p','ORIGINAL-SOURCE-QUALIFIED COMMUNICATION','eyebrow'),
  el('h3',scene.title),el('p',scene.objective,'u37-task'),
  el('p',scene.level+' · '+scene.qualifiedSourceId+' · revision '+scene.revision,'u37-provenance'),
  el('p','Roleplay partners, objections, suggested answers and scenario situations are new U37 teaching fiction. Only separately attributed French witness cards are historical source text. No voice recording, automated writing grade or native progress update.','u37-caveat'));
 if(!scene.curated)intro.append(el('p',
  'General, source-qualified scenario framework; this lesson does not have a separately authored U37 situation.',
  'u37-caveat'));
 const sourceArea=el('details','','u37-original');
 sourceArea.append(el('summary','Inspect actual original French source witnesses'));
 const sourceGrid=el('div','','u37-source-grid');sourceArea.append(sourceGrid);
 const journey=el('section','','u37-journey');
 journey.append(el('h4','Five-turn practical conversation'));
 const nav=el('nav','','u37-nav');nav.setAttribute('aria-label','Communication conversation rounds');
 const stage=el('article','','u37-stage');
 journey.append(nav,stage);
 const sourceChecks=el('section','','u37-checks');
 sourceChecks.append(el('h4','Make accurate independent communication choices'));
 const checksArea=el('div','','u37-check-area');
 sourceChecks.append(checksArea);
 const handoffs=el('section','','u37-handoffs');
 handoffs.append(el('h4','Transfer between original listening, speaking, reading and writing'));
 const modeNav=el('nav','','u37-nav');modeNav.setAttribute('aria-label','Original skill transfer activities');
 const modeArea=el('div','','u37-mode-area');
 handoffs.append(modeNav,modeArea);
 const exit=el('section','','u37-exit');
 exit.append(el('h4','Return to original learning'));
 const live=el('p','','u37-status');live.setAttribute('role','status');
 body.append(intro,sourceArea,journey,sourceChecks,handoffs,exit,live);
 const work=new Map<string,Work>(),transferWork=new Map<string,Work>();
 const answered=new Map<string,string>();
 const reported=new Set<string>();
 const helpLevels=new Map<string,number>();
 let current=0,decisionIndex=0,modeIndex=0,disposed=false;
 const textExists=()=>{
  const stored=[...work.values(),...transferWork.values()];
  return stored.some(s=>!!s.first.trim()||!!s.second.trim());
 };
 const notify=()=>{
  if(disposed)return;
  const yes=textExists();root.dataset.hasPrivateDraft=String(yes);
  options.onPrivateChange?.(yes);
 };
 const witnessCard=(locator:string)=>{
  const witness=scene.sourceWitnesses.find(x=>x.locator===locator);if(!witness)return null;
  const card=el('article','','u37-witness');
  card.append(el('h5',witness.label),
   el('p',witness.kind==='dialogue'?'Original French dialogue TEXT · not human-recorded audio':
    witness.kind==='reading'?'Original connected French reading':
    'Original separately attributed written document','u37-provenance'));
  const phrase=el('p',witness.french,'u37-french');phrase.lang='fr';card.append(phrase);
  if(witness.explanation)card.append(el('p','Original English explanation: '+witness.explanation,'u37-provenance'));
  card.append(el('p',witness.qualifiedSourceId+' · '+witness.sourceRevision,'u37-provenance'));
  return card;
 };
 const realSource=(locators:readonly string[],label:string)=>{
  const d=el('details','','u37-evidence');
  d.append(el('summary',label));
  const grid=el('div','','u37-source-grid');
  for(const locator of locators){const card=witnessCard(locator);if(card)grid.append(card);}
  d.append(grid);return d;
 };
 for(const witness of scene.sourceWitnesses){
  const card=witnessCard(witness.locator);if(card)sourceGrid.append(card);
 }

 /** Dedicated local writing drafts for each turn or transfer, with explicit comparison. */
 const responseEditor=(key:string,store:Map<string,Work>,register:U37Register,
  container:HTMLElement,guide:HTMLElement,title:string)=>{
  const state=store.get(key)??blank(register);
  const read=()=>store.get(key)??blank(register);
  const save=(patch:Partial<Work>)=>{
   store.set(key,{...read(),...patch});notify();
  };
  const registerLabel=el('label','Appropriate audience register','u37-label');
  const choice=el('select');choice.setAttribute('aria-label','Communication register');
  for(const [value,label] of REGISTERS){
   const o=el('option',label);o.value=value;choice.append(o);
  }
  choice.value=state.register;
  choice.addEventListener('change',()=>save({register:choice.value as U37Register}));
  registerLabel.append(choice);
  const firstLabel=el('label','My original French response · page-local','u37-label');
  const first=el('textarea');first.lang='fr';first.rows=6;first.maxLength=12000;first.value=state.first;
  first.setAttribute('aria-label','My first '+title+' French response');
  firstLabel.append(first);
  const secondLabel=el('label','Independent response · first version and support hidden','u37-label');
  const second=el('textarea');second.lang='fr';second.rows=6;second.maxLength=12000;
  second.value=state.second;
  second.setAttribute('aria-label','Independent second '+title+' French response');
  secondLabel.append(second);secondLabel.hidden=true;
  first.addEventListener('input',()=>save({first:first.value}));
  second.addEventListener('input',()=>save({second:second.value}));
  const feedback=el('p','','u37-status');feedback.setAttribute('role','status');
  const comparePane=el('div','','u37-comparison');comparePane.hidden=true;
  const controls=el('div','','u37-actions');
  controls.append(
   button('Capture my first response',()=>{
    if(!first.value.trim()){feedback.textContent='Write a response before capturing it.';return;}
    save({captured:first.value});feedback.textContent='First response saved in this mounted page only.';
   }),
   button('Try independently · hide first draft and prompts',()=>{
    firstLabel.hidden=true;secondLabel.hidden=false;guide.hidden=true;
    second.focus();feedback.textContent='Independent attempt. Earlier text remains in local page memory for explicit comparison.';
   },true),
   button('Return to the working version',()=>{
    secondLabel.hidden=true;firstLabel.hidden=false;guide.hidden=false;first.focus();
   }),
   button('Compare my two French versions',()=>{
    const original=read().captured;
    if(!original){feedback.textContent='Capture a first version to compare.';return;}
    comparePane.replaceChildren();
    for(const [name,value] of [
     ['Captured version',original],['Current edited version',first.value],
     ['Independent second attempt',second.value||'(not written yet)']
    ])comparePane.append(el('h5',name),el('p',value,'u37-french'));
    comparePane.append(el('p','Self-review meaning, negation, consent, evidence limits, clarity and register. No semantic improvement grade is inferred.','u37-caveat'));
    comparePane.hidden=false;
   }),
   button('Clear this activity only',()=>{
    if((first.value.trim()||second.value.trim())&&
       !window.confirm('Discard only this activity’s temporary French responses?'))return;
    store.delete(key);first.value='';second.value='';comparePane.hidden=true;
    notify();feedback.textContent='Only the current activity text was discarded.';
   })
  );
  container.append(registerLabel,firstLabel,secondLabel,controls,feedback,comparePane);
 };
 const renderTurn=(focus=false)=>{
  if(disposed)return;
  stage.replaceChildren();nav.replaceChildren();
  scene.turns.forEach((turn,i)=>{
   const tab=button((i+1)+'. '+turn.title,()=>{
    current=i;renderTurn(true);
   });
   if(current===i)tab.setAttribute('aria-current','step');
   nav.append(tab);
  });
  const turn=scene.turns[current];
  const heading=el('h5',turn.title);heading.tabIndex=-1;
  const opponent=el('blockquote','','u37-opponent');
  opponent.append(el('p',turn.partnerPrompt,'u37-french'),
   el('p','NEW hypothetical communication partner · not historical testimony','u37-provenance'));
  opponent.querySelector<HTMLParagraphElement>('.u37-french')?.setAttribute('lang','fr');
  const mainTask=el('p',turn.learnerTask,'u37-task');
  const supports=el('div','','u37-guidance');
  const hint=el('p',turn.misconception,'u37-caveat');
  const primary=el('div','','u37-source-grid');
  const model=el('p',turn.exampleFrench,'u37-french');model.lang='fr';
  supports.append(hint,primary,model);
  const shown=(level:number)=>{
   helpLevels.set(turn.id,Math.max(level,helpLevels.get(turn.id)??0));
   const current=helpLevels.get(turn.id)!;
   hint.hidden=current<1;primary.hidden=current<2;model.hidden=current<3;
   primary.replaceChildren();
   if(current>=2)for(const locator of turn.sourceLocators){
    const card=witnessCard(locator);if(card)primary.append(card);
   }
  };
  const actions=el('div','','u37-actions');
  actions.append(button('1 · Communicative repair hint',()=>shown(1)),
   button('2 · Genuine original source',()=>shown(2)),
   button('3 · New illustrated French reply',()=>shown(3)));
  stage.append(heading,opponent,mainTask,actions,supports);
  shown(helpLevels.get(turn.id)??0);
  responseEditor(turn.id,work,scene.assignedRegister,stage,supports,turn.kind);
  const feedback=el('p','','u37-status');feedback.setAttribute('role','status');
  const spoken=button('I practiced this French reply aloud · self-report only',()=>{
   reported.add(turn.id);
   feedback.textContent='Rehearsal self-reported. No microphone or pronunciation assessment occurred.';
  });
  const checklist=el('ul','','u37-checklist');
  for(const item of [
   'I preserved the historical dialogue’s actual claims and uncertainties.',
   'My register is suitable for the audience, without unnecessary intrusion.',
   'I clarified the misunderstanding rather than repeating it.',
   'I distinguished my fictional partner’s words from original evidence.'
  ])checklist.append(el('li',item));
  const next=el('div','','u37-actions');
  const previous=button('← Previous conversation turn',()=>{current--;renderTurn(true);});
  const forward=button('Next conversation turn →',()=>{current++;renderTurn(true);},true);
  previous.disabled=current===0;forward.disabled=current===scene.turns.length-1;
  next.append(previous,forward);
  stage.append(spoken,feedback,checklist,next);
  if(focus)heading.focus({preventScroll:true});
 };
 const renderChecks=()=>{
  checksArea.replaceChildren();
  if(!scene.checks.length){
   checksArea.append(el('p','No special keyed U37 situation is authored for this lesson. The source-qualified open responses are self-reviewed.','u37-caveat'));return;
  }
  decisionIndex=Math.max(0,Math.min(decisionIndex,scene.checks.length-1));
  const item=scene.checks[decisionIndex];
  const form=el('form','','u37-check-form');
  form.append(el('p','Context choice '+(decisionIndex+1)+' / '+scene.checks.length,'u37-provenance'),
   el('h5',item.question));
  const answerLabel=el('label','Choose the source-faithful authored response','u37-label');
  const select=el('select');select.setAttribute('aria-label','Original-source contextual choice');
  const blank=el('option','Choose an answer');blank.value='';select.append(blank);
  for(const choice of item.choices){const o=el('option',choice);o.value=choice;select.append(o);}
  const previous=answered.get(item.id);if(previous)select.value=previous;
  answerLabel.append(select);
  const result=el('p',previous?evaluateU37AuthoredChoice(item,previous).feedback:'','u37-status');
  result.setAttribute('role','status');
  const check=el('button','Compare with limited authored key','primary-action compact-action');check.type='submit';
  form.addEventListener('submit',e=>{
   e.preventDefault();
   if(!select.value){result.textContent='Choose an answer before comparing.';return;}
   answered.set(item.id,select.value);
   result.textContent=evaluateU37AuthoredChoice(item,select.value).feedback;
  });
  select.addEventListener('change',()=>{result.textContent='Response changed; compare again for source-specific feedback.';});
  form.append(answerLabel,check,result);
  const actions=el('div','','u37-actions');
  const before=button('Previous contextual choice',()=>{decisionIndex--;renderChecks();});
  const after=button('Next contextual choice',()=>{decisionIndex++;renderChecks();});
  before.disabled=decisionIndex===0;after.disabled=decisionIndex===scene.checks.length-1;
  actions.append(before,after);
  checksArea.append(form,realSource(item.sourceLocators,'Reveal exact original evidence'),actions);
 };
 const renderMode=()=>{
  modeNav.replaceChildren();modeArea.replaceChildren();
  if(!scene.transferTasks.length)return;
  modeIndex=Math.max(0,Math.min(modeIndex,scene.transferTasks.length-1));
  scene.transferTasks.forEach((task,i)=>{
   const b=button(task.title,()=>{modeIndex=i;renderMode();});
   if(i===modeIndex)b.setAttribute('aria-current','step');
   modeNav.append(b);
  });
  const task=scene.transferTasks[modeIndex];
  modeArea.append(el('h5',task.title),
   el('p',task.instruction,'u37-task'),el('p',task.independentPrompt,'u37-caveat'));
  const guide=el('div','','u37-guidance');
  guide.append(realSource(task.sourceLocators,'Optional original French source'));
  modeArea.append(guide);
  responseEditor(task.id,transferWork,scene.assignedRegister,modeArea,guide,task.mode);
  const row=el('div','','u37-actions');
  if(options.onOpenSurface)
   row.append(button('Open native original '+task.mode,()=>options.onOpenSurface?.(task.mode,id)));
  modeArea.append(row,el('p','The native original workspace is separate; your private page-local draft is never silently copied into it.','u37-caveat'));
 };
 const renderExits=()=>{
  const actions=el('div','','u37-actions');
  if(options.onOpenSurface){
   const destinations:readonly [OriginalSurface,string,boolean][]=[
    ['course','Return to original Course',true],
    ['speak','Original speaking workspace',true],
    ['listen','Original listening workspace',true],
    ['read','Original connected reading',scene.sourceWitnesses.some(w=>w.kind==='reading')],
    ['write','Original independent writing',true]
   ];
   for(const [surface,label,possible] of destinations){
    if(possible)actions.append(button(label,()=>options.onOpenSurface?.(surface,id)));
   }
  }
  if(options.onNativeReview)actions.append(button('Native scheduled Review',()=>options.onNativeReview?.()));
  exit.append(actions,
   el('p','Only the original historical lesson identity is handed off. The existing U36/U35/U34/U33 unsent-work guard governs navigation; no simulated assessment or draft transfers occur.','u37-caveat'));
 };
 const cleanup=()=>{
  if(disposed)return;disposed=true;
  options.signal.removeEventListener('abort',cleanup);
  work.clear();transferWork.clear();answered.clear();reported.clear();helpLevels.clear();root.remove();
 };
 options.signal.addEventListener('abort',cleanup,{once:true});
 renderTurn();renderChecks();renderMode();renderExits();
 live.textContent='Original-source-qualified communication scenarios ready. No language mastery or audio recording is inferred.';
 return cleanup;
}
