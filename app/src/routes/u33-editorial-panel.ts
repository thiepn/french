import {
 originalU33Editorial,compareU33EditorialKey,
 type U33Stage,type U33Journey,type U33SourceCheck
} from '../core/unified/u33-editorial.ts';
import type {OriginalSurface} from '../core/unified/u23-registry.ts';
import './u33-editorial-panel.css';
import {appendOriginalDebateJourney} from './u34-debate-panel.ts';

type Register='peer'|'service'|'public';
interface Options{
 readonly signal:AbortSignal;
 readonly onPrivateChange?:(hasDraft:boolean)=>void;
 readonly onOpenSurface?:(surface:OriginalSurface,id:string)=>void;
 readonly onNativeReview?:()=>void;
}
const REGISTER:Readonly<Record<Register,string>>={
 peer:'Explain naturally to a peer',
 service:'Explain courteously to a professional',
 public:'Explain neutrally to a public audience'
};
function el<K extends keyof HTMLElementTagNameMap>(tag:K,text='',className=''):HTMLElementTagNameMap[K]{
 const result=document.createElement(tag);
 if(text)result.textContent=text;
 if(className)result.className=className;
 return result;
}
function button(text:string,run:()=>void,primary=false):HTMLButtonElement{
 const b=el('button',text,primary?'primary-action compact-action':'secondary-action compact-action');
 b.type='button';b.addEventListener('click',run);return b;
}
function witnessText(source:U33Journey,locator:string):HTMLElement|null{
 const found=source.witnesses.find(x=>x.locator===locator);
 if(!found)return null;
 const card=el('article','','u33-evidence-item');
 card.append(el('h5',found.label),el('p',found.kind==='dialogue'?
  'Original French dialogue · original speaker text, not verified audio':
  found.kind==='document'?'Independently attributed original written document':
  'Original connected written reading','u33-provenance'));
 const p=el('p',found.french,'u33-french');p.lang='fr';card.append(p);
 if(found.explanation)card.append(el('p','Original English explanation: '+found.explanation,'u33-provenance'));
 card.append(el('p',source.qualifiedId+' · source revision '+source.sourceRevision,'u33-provenance'));
 return card;
}
function choicesFor(source:U33Journey){
 const docs=source.witnesses.filter(w=>w.kind==='document');
 const paragraphs=source.witnesses.filter(w=>w.kind==='reading');
 const turns=source.witnesses.filter(w=>w.kind==='dialogue');
 const pairs: [string,string,string][]=[];
 if(docs.length>=2)pairs.push(['Two independently attributed written records',docs[0].locator,docs[1].locator]);
 if(docs.length&&turns.length)pairs.push(['Written record versus original dialogue',docs[0].locator,turns[0].locator]);
 if(paragraphs.length&&turns.length)pairs.push(['Separate written reading versus original dialogue',paragraphs[0].locator,turns[0].locator]);
 if(!pairs.length&&turns.length>=2)
  pairs.push(['Two turns of ONE original dialogue (not independent documents)',turns[0].locator,turns[1].locator]);
 return pairs;
}
/** Ephemeral editorial composition within the already-original U32/U31 workspace. */
export function appendOriginalEditorialJourney(
 host:HTMLElement,id:string,options:Options
):()=>void{
 const source=originalU33Editorial(id);if(!source)return()=>{};
 const root=el('section','','u33-editorial');
 root.dataset.hasPrivateDraft='false';
 root.setAttribute('aria-label','Independent editorial exposition and original evidence synthesis');
 const details=el('details','','u33-disclosure');
 details.append(el('summary','U33 · Independent exposition, evidence and editorial synthesis'));
 const body=el('div','','u33-body');
 details.append(body);root.append(details);host.append(root);
 const header=el('header','','u33-heading');
 header.append(el('p','ORIGINAL SOURCE · INDEPENDENT ARGUMENTATION','eyebrow'),
  el('h3',source.title),el('p',source.topic),
  el('p',source.level+' · '+source.qualifiedId+' · revision '+source.sourceRevision,'u33-provenance'),
  el('p','New U33 objections and illustrations are original teaching prompts, NOT historical quotations. Published French witnesses are separately labeled below. No speech is captured, no free writing is graded, and no Account or native review state is written.','u33-caveat'));
 if(!source.curated)header.append(el('p',
  'General source-grounded editorial framework for this lesson; it is not a dedicated authored U33 case.',
  'u33-caveat'));
 const brief=el('section','','u33-brief');
 brief.append(el('h4','Your editorial assignment'),
  el('p','Audience contexts: '+source.targetAudience),
  el('p','An original-source-aligned thesis to examine: '+source.thesis),
  el('p','Hypothetical demanding editor objection: '+source.objection),
  el('p','Do not overclaim: '+source.guard,'u33-caveat'),
  el('p','Aim for about '+source.paragraphGoal+' developed paragraphs and at least '+
   source.sentenceGoal+' original French sentences. This is writing guidance, NOT a CEFR standard or grade.','u33-caveat'));
 const levelControls=el('nav','','u33-step-nav');
 levelControls.setAttribute('aria-label','Editorial exposition stages');
 const stageHost=el('article','','u33-stage');
 const decisions=el('section','','u33-questions');
 const evidence=el('details','','u33-source-library');
 evidence.append(el('summary','Browse actual original witnesses and their source identities'));
 const evidenceList=el('div','','u33-evidence-grid');
 for(const x of source.witnesses){
  const card=witnessText(source,x.locator);
  if(card)evidenceList.append(card);
 }
 evidence.append(evidenceList);
 const comparisons=el('section','','u33-comparison');
 const revision=el('section','','u33-consolidation');
 const transfers=el('section','','u33-transfer');
 const debateHost=el('div','','u34-integration');
 body.append(header,brief,levelControls,stageHost,decisions,evidence,comparisons,revision,transfers,debateHost);
 let current=0,unassisted=false,register:Register='peer',disposed=false,checkIndex=0;
 const notes=new Map<U33Stage,string>(),second=new Map<U33Stage,string>(),
  earlier=new Map<U33Stage,string>(),spoken=new Set<U33Stage>();
 const answerHistory=new Map<string,{value:string;matched:boolean}>();
 const pairNotes=new Map<string,[string,string,string]>();
 const pairChoices=choicesFor(source);
 let selectedPair=0,essayDraft='',independentEssay='',capturedEssay='';
 const live=el('p','','u33-live');live.setAttribute('role','status');
 const privateChanged=()=>{
  const written=[...notes.values(),...second.values(),...[...pairNotes.values()].flat(),essayDraft,independentEssay];
  const present=written.some(s=>s.trim().length>0)||
   !!debateHost.querySelector<HTMLElement>('.u34-debate[data-has-private-draft="true"]');
  root.dataset.hasPrivateDraft=String(present);
  options.onPrivateChange?.(present);
 };
 const stopU34=appendOriginalDebateJourney(debateHost,id,{
  signal:options.signal,
  onPrivateChange:()=>privateChanged(),
  onOpenSurface:options.onOpenSurface,
  onNativeReview:options.onNativeReview
 });
 function renderStage(focus=false){
  if(disposed)return;
  stageHost.replaceChildren();levelControls.replaceChildren();
  for(const [i,s] of source.stages.entries()){
   const tab=button((i+1)+'. '+s.title,()=>{current=i;unassisted=false;renderStage(true);});
   if(i===current)tab.setAttribute('aria-current','step');
   levelControls.append(tab);
  }
  const step=source.stages[current];
  const heading=el('h4','Stage '+(current+1)+' · '+step.title);heading.tabIndex=-1;
  const prompt=el('p',step.task,'u33-task');
  const registerLabel=el('label','Audience register for this response','u33-picker');
  const select=el('select');
  select.setAttribute('aria-label','Choose editorial speaking register');
  for(const [value,title] of Object.entries(REGISTER)){
   const option=el('option',title);option.value=value;select.append(option);
  }
  select.value=register;
  select.addEventListener('change',()=>{register=select.value as Register;registerStatus.textContent=
   'Selected audience: '+REGISTER[register]+'. Revise tone without inventing new source claims.';});
  registerLabel.append(select);
  const registerStatus=el('p','Selected audience: '+REGISTER[register],'u33-provenance');
  const help=el('div','','u33-hints');
  const hint=el('p',step.scaffold,'u33-caveat');hint.hidden=true;
  const sourceReveal=el('div','','u33-evidence-grid');sourceReveal.hidden=true;
  const model=el('p',step.authoredExample,'u33-french');model.lang='fr';model.hidden=true;
  help.append(
   button('1 · Outline prompt',()=>{hint.hidden=!hint.hidden;}),
   button('2 · Original source',()=>{
    sourceReveal.hidden=!sourceReveal.hidden;
    if(!sourceReveal.hidden){
     sourceReveal.replaceChildren();
     for(const loc of step.witnesses){
      const card=witnessText(source,loc);if(card)sourceReveal.append(card);
     }
    }
   }),
   button('3 · U33 illustration (not a quote)',()=>{model.hidden=!model.hidden;}),
   hint,sourceReveal,model
  );
  const editorLabel=el('label','Draft your own French argument · temporary page memory','u33-draft-label');
  const editor=el('textarea');editor.rows=6;editor.lang='fr';editor.maxLength=8000;
  editor.value=notes.get(step.stage)??'';
  editor.setAttribute('aria-label','French exposition draft for '+step.title);
  editorLabel.append(editor);
  const independentLabel=el('label','Independent second version · original outline hidden','u33-draft-label');
  const independentEditor=el('textarea');independentEditor.lang='fr';
  independentEditor.rows=6;independentEditor.maxLength=8000;
  independentEditor.value=second.get(step.stage)??'';
  independentEditor.setAttribute('aria-label','Independent second French response');
  independentLabel.append(independentEditor);independentLabel.hidden=!unassisted;
  editorLabel.hidden=unassisted;help.hidden=unassisted;
  const result=el('div','','u33-revision');result.hidden=true;
  const controls=el('div','','u33-actions');
  const capture=button('Capture this version for revision',()=>{
   if(!editor.value.trim()){live.textContent='Write your first response before capturing it.';return;}
   earlier.set(step.stage,editor.value);
   live.textContent='Earlier version held in page memory only. No correction or mastery is inferred.';
  });
  const compare=button('Compare earlier, revised and independent text',()=>{
   const original=earlier.get(step.stage);
   if(!original){live.textContent='Capture an earlier draft first.';return;}
   result.replaceChildren();
   for(const [title,text] of [
    ['Captured earlier draft',original],['Current revision',notes.get(step.stage)??''],
    ['Unassisted second attempt',second.get(step.stage)??'(not written)']
   ]){
    const section=el('section');
    section.append(el('h5',title),el('p',text,'u33-french'));result.append(section);
   }
   result.append(el('p','Compare claim scope, evidence location, objection fairness, register and truthful uncertainty manually. No automatic semantic grade exists.','u33-caveat'));
   result.hidden=false;
  });
  const restart=button('Independent attempt · hide the first draft',()=>{
   unassisted=true;editorLabel.hidden=true;help.hidden=true;independentLabel.hidden=false;
   independentEditor.focus();live.textContent='Independent attempt selected. Earlier work remains local for explicit comparison.';
  },true);
  const returnTo=button('Return to working draft',()=>{
   unassisted=false;editorLabel.hidden=false;help.hidden=false;independentLabel.hidden=true;
   editor.focus();
  });
  const speak=button('I rehearsed aloud · self-report only',()=>{
   spoken.add(step.stage);live.textContent='Oral rehearsal self-reported. No microphone, audio recording or verified fluency result.';
  });
  const clear=button('Clear this stage only',()=>{
   if((notes.get(step.stage)||second.get(step.stage))&&
      !window.confirm('Discard this stage’s temporary drafts?'))return;
   notes.delete(step.stage);second.delete(step.stage);earlier.delete(step.stage);
   editor.value='';independentEditor.value='';result.hidden=true;privateChanged();
   live.textContent='The selected stage was cleared. Other drafts remain available during this page visit.';
  });
  editor.addEventListener('input',()=>{notes.set(step.stage,editor.value);privateChanged();});
  independentEditor.addEventListener('input',()=>{second.set(step.stage,independentEditor.value);privateChanged();});
  controls.append(capture,compare,restart,returnTo,speak,clear);
  const check=el('fieldset','','u33-checklist');
  check.append(el('legend','Manual source and register review'));
  for(const x of [
   'I identify what the original source actually says.',
   'I label the new objection as hypothetical, not recorded history.',
   'I answer a reasonable part of the objection fairly.',
   'I do not convert uncertain information into verified fact.',
   'I can explain the same argument for a different audience.'
  ]){
   const label=el('label','','u33-check-item');const input=el('input');input.type='checkbox';
   label.append(input,el('span',x));check.append(label);
  }
  const navigate=el('div','','u33-actions');
  const prev=button('← Previous section',()=>{current=Math.max(0,current-1);unassisted=false;renderStage(true);});
  const next=button('Next section →',()=>{current=Math.min(source.stages.length-1,current+1);unassisted=false;renderStage(true);},true);
  prev.disabled=current===0;next.disabled=current===source.stages.length-1;
  navigate.append(prev,next);
  stageHost.append(heading,prompt,registerLabel,registerStatus,help,editorLabel,
   independentLabel,controls,check,result,live,navigate);
  if(focus)heading.focus({preventScroll:true});
 }
 function renderChoices(){
  decisions.replaceChildren(el('h4','Editorial claim repair with original evidence'),
   el('p','Only these authored multiple-choice items use keyed comparison. They do not grade a monologue or pronunciation.','u33-caveat'));
  if(!source.checks.length){decisions.append(el('p','No separate keyed U33 claims are authored for this original source. Use the independent evidence checks and writing plan.','u33-caveat'));return;}
  const task=source.checks[checkIndex];
  decisions.append(el('p','Source choice '+(checkIndex+1)+' / '+source.checks.length,'u33-provenance'),
   el('h5',task.question));
  const form=el('form','','u33-check-form');
  const label=el('label','Choose the responsible editorial claim');
  const selector=el('select');
  const empty=el('option','Choose a source-supported answer');empty.value='';selector.append(empty);
  for(const value of task.options){const opt=el('option',value);opt.value=value;selector.append(opt);}
  label.append(selector);
  const feedback=el('p','','u33-live');feedback.setAttribute('role','status');
  const prior=answerHistory.get(task.id);
  if(prior){selector.value=prior.value;feedback.textContent=compareU33EditorialKey(task,prior.value).feedback;}
  const check=el('button','Compare with authored evidence key','primary-action compact-action');check.type='submit';
  form.addEventListener('submit',event=>{
   event.preventDefault();
   if(!selector.value){feedback.textContent='Choose an answer before comparing.';return;}
   const verdict=compareU33EditorialKey(task,selector.value);
   answerHistory.set(task.id,{value:selector.value,matched:verdict.matched});
   feedback.textContent=verdict.feedback;
  });
  const reveal=el('details','','u33-exact-sources');
  reveal.append(el('summary','Reveal exact original witnesses for this source check'));
  for(const locator of task.witnessLocators){
   const card=witnessText(source,locator);if(card)reveal.append(card);
  }
  const nav=el('div','','u33-actions');
  const previous=button('Previous source check',()=>{checkIndex--;renderChoices();});
  const next=button('Next source check',()=>{checkIndex++;renderChoices();});
  previous.disabled=checkIndex===0;next.disabled=checkIndex===source.checks.length-1;
  nav.append(previous,next);
  decisions.append(form,reveal,nav);
  form.append(label,check,feedback);
 }
 function renderComparison(){
  comparisons.replaceChildren(el('h4','Editorial synthesis between actual source records'));
  const pairs=choicesFor(source);
  if(!pairs.length){
   comparisons.append(el('p','No authentic pair is available; do not pretend a single source is two independent publications.','u33-caveat'));return;
  }
  selectedPair=Math.min(selectedPair,pairs.length-1);
  const nav=el('div','','u33-actions'),cards=el('div','','u33-pair-grid');
  const editors=el('div','','u33-pair-notes');
  const labels=['First source: what is established?','Second source: what differs or remains uncertain?','Your independent, qualified synthesis in French'];
  const fields=labels.map((title,index)=>{
   const label=el('label',title,'u33-draft-label'),area=el('textarea');
   area.rows=index===2?5:3;area.lang='fr';area.maxLength=5000;
   label.append(area);return {label,area};
  });
  editors.append(...fields.map(f=>f.label));
  const explanation=el('p','','u33-caveat');
  const paint=(index:number)=>{
   selectedPair=index;
   const [name,first,second]=pairs[index],key=first+'::'+second;
   cards.replaceChildren();
   for(const locator of [first,second]){
    const card=witnessText(source,locator);if(card)cards.append(card);
   }
   const previous=pairNotes.get(key)??['','',''];
   fields.forEach((f,i)=>{f.area.value=previous[i];f.area.oninput=()=>{
    const state=pairNotes.get(key)??['','',''];
    const next:[string,string,string]=[state[0],state[1],state[2]];
    next[i]=f.area.value;pairNotes.set(key,next);privateChanged();
   };});
   explanation.textContent=name+'. Compare exact provenance; source attribution alone never establishes a claim’s truth. These notes stay attached to this exact pair.';
  };
  pairs.forEach(([label],i)=>nav.append(button(label,()=>paint(i))));
  comparisons.append(el('p','Use two genuinely separate written records when available. If none exist, the interface labels cross-media evidence or two turns of one conversation honestly.','u33-caveat'),
   nav,explanation,cards,editors);
  paint(selectedPair);
 }
 function renderSynthesis(){
  revision.replaceChildren(el('h4','Independent editorial exposition and revision'),
   el('p','Compose a sustained original French argument across approximately '+source.paragraphGoal+
    ' paragraphs, with a suggested minimum of '+source.sentenceGoal+
    ' sentences. These are optional practice targets, not CEFR pass criteria.','u33-caveat'));
  const preview=el('div','','u33-preview');
  const showOutline=button('Preview my five-stage working outline',()=>{
   preview.replaceChildren();
   for(const stage of source.stages){
    preview.append(el('h5',stage.title),
     el('p',notes.get(stage.stage)?.trim()||'(no text for this stage)','u33-french'));
   }
  });
  const mainLabel=el('label','My multi-paragraph French exposition · temporary','u33-draft-label');
  const main=el('textarea');main.rows=11;main.lang='fr';main.maxLength=12000;main.value=essayDraft;
  main.placeholder='Selon le dialogue original… Cependant, une objection… Il faudrait vérifier…';
  mainLabel.append(main);
  const independentLabel=el('label','My second independent public explanation · without reviewing the first','u33-draft-label');
  const independent=el('textarea');independent.rows=10;independent.lang='fr';independent.maxLength=12000;
  independent.value=independentEssay;independentLabel.append(independent);independentLabel.hidden=true;
  const feedback=el('p','','u33-live');feedback.setAttribute('role','status');
  const compareView=el('div','','u33-revision');compareView.hidden=true;
  const capture=button('Capture first exposition for later comparison',()=>{
   if(!main.value.trim()){feedback.textContent='Write an exposition before capturing it.';return;}
   capturedEssay=main.value;feedback.textContent='First draft captured in page memory only.';
  });
  const tryAlone=button('Try an unassisted second exposition',()=>{
   mainLabel.hidden=true;independentLabel.hidden=false;preview.hidden=true;
   independent.focus();feedback.textContent='Earlier prose hidden. Write from source memory without an automatic score.';
  },true);
  const returnTo=button('Return to my first version',()=>{
   mainLabel.hidden=false;independentLabel.hidden=true;preview.hidden=false;main.focus();
  });
  const compare=button('Compare original, revision and independent essay',()=>{
   if(!capturedEssay){feedback.textContent='Capture your original exposition first.';return;}
   compareView.replaceChildren();
   for(const [label,value] of [
    ['Earlier captured draft',capturedEssay],['Current edited draft',main.value],
    ['Independent retelling',independent.value.trim()||'(not written yet)']
   ]){
    const block=el('section');
    block.append(el('h5',label),el('p',value,'u33-french'));compareView.append(block);
   }
   compareView.append(el('p','Evaluate evidence scope, paragraph cohesion, register, fair objection, warranted claims and conditional conclusions yourself. No semantic grade is given.','u33-caveat'));
   compareView.hidden=false;
  });
  main.addEventListener('input',()=>{essayDraft=main.value;privateChanged();});
  independent.addEventListener('input',()=>{independentEssay=independent.value;privateChanged();});
  const clear=button('Discard both long-form drafts',()=>{
   if((essayDraft.trim()||independentEssay.trim())&&
     !window.confirm('Discard both temporary original French essays?'))return;
   essayDraft='';independentEssay='';capturedEssay='';
   main.value='';independent.value='';compareView.hidden=true;privateChanged();
   feedback.textContent='Long-form drafts discarded; no server state changed.';
  });
  const controls=el('div','','u33-actions');
  controls.append(capture,tryAlone,returnTo,compare,clear);
  const criteria=el('ul','','u33-criteria');
  for(const x of [
   'I distinguish the original source claim from my own interpretation.',
   'I provide original witness attribution and do not invent an independent record.',
   'I state the strongest objection fairly and reply proportionately.',
   'I preserve original negation, uncertainty, dates, conditions and rights.',
   'I change register without strengthening an unsupported factual claim.',
   'I identify a responsible next step rather than asserting unverified proof.'
  ])criteria.append(el('li',x));
  revision.append(showOutline,preview,mainLabel,independentLabel,controls,feedback,compareView,criteria);
  transfers.replaceChildren(el('h4','Continue with the original learner workspaces'),
   el('p','Original Course, Listen, Read, Write and native Review retain their separate authorities. Navigation does not transfer private drafts, imagined speech or assessment credits.','u33-caveat'));
  const destinations=el('div','','u33-actions');
  if(options.onOpenSurface){
   const available:readonly [OriginalSurface,string,boolean][]=[
    ['course','Return to original Course',true],['listen','Original listening',true],
    ['speak','Original oral production',true],
    ['read','Read connected source',source.witnesses.some(x=>x.kind==='reading')],
    ['write','Independent original Write',true]
   ];
   for(const [surface,label,valid] of available)
    if(valid)destinations.append(button(label,()=>options.onOpenSurface?.(surface,id)));
  }
  if(options.onNativeReview)destinations.append(button('Native scheduled Review',()=>options.onNativeReview?.()));
  transfers.append(destinations);
 }
 const clearAll=()=>{notes.clear();second.clear();earlier.clear();pairNotes.clear();spoken.clear();
  essayDraft='';independentEssay='';capturedEssay='';
  privateChanged();};
 const cleanup=()=>{
  if(disposed)return;disposed=true;
  options.signal.removeEventListener('abort',cleanup);
  stopU34();clearAll();root.remove();
 };
 options.signal.addEventListener('abort',cleanup,{once:true});
 renderStage();renderChoices();renderComparison();renderSynthesis();
 return cleanup;
}
