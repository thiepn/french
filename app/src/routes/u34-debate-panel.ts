import {
 originalU34Debate,compareU34Decision,
 type U34Claim,type U34Turn,type U34Genre,type U34GenreTask
} from '../core/unified/u34-debate.ts';
import type {OriginalSurface} from '../core/unified/u23-registry.ts';
import './u34-debate-panel.css';

interface Options {
 readonly signal:AbortSignal;
 readonly onPrivateChange?:(hasDraft:boolean)=>void;
 readonly onOpenSurface?:(surface:OriginalSurface,id:string)=>void;
 readonly onNativeReview?:()=>void;
}
function el<K extends keyof HTMLElementTagNameMap>(tag:K,text='',cls=''):HTMLElementTagNameMap[K]{
 const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;
}
function button(text:string,run:()=>void,primary=false):HTMLButtonElement{
 const b=el('button',text,primary?'primary-action compact-action':'secondary-action compact-action');
 b.type='button';b.addEventListener('click',run);return b;
}
type DraftState={first:string;independent:string;snapshot:string;register:string;selfReported:boolean};
function initialState():DraftState{return {first:'',independent:'',snapshot:'',register:'peer',selfReported:false};}
/**
 * Source-attested debate and genre transfer, inserted inside the existing
 * U33/U32/U31 oral workspace. All draft state stays within this component.
 */
export function appendOriginalDebateJourney(host:HTMLElement,id:string,options:Options):()=>void{
 const source=originalU34Debate(id);
 if(!source)return()=>{};
 const root=el('section','','u34-debate');root.dataset.hasPrivateDraft='false';
 root.setAttribute('aria-label','Autonomous source-critical French debate and cross-genre work');
 const detail=el('details','','u34-disclosure');
 detail.append(el('summary','U34 · Five-round autonomous debate and four genre transfers'));
 const body=el('div','','u34-body');detail.append(body);root.append(detail);host.append(root);
 const header=el('header','','u34-heading');
 header.append(el('p','ORIGINAL SOURCE · CIVIL ARGUMENTATION','eyebrow'),
  el('h3',source.title),
  el('p','Original authorial source: '+source.qualifiedId+' · '+source.level+
   ' · revision '+source.sourceRevision,'u34-provenance'),
  el('p','The debates, opposing remarks and model arguments are new teaching fiction. Original French witnesses are marked separately. No speech is recorded or recognized; written answers are not automatically graded or saved.','u34-caveat'));
 const graph=el('section','','u34-argument-map');
 graph.append(el('h4','Source-aware claim and counterclaim map'));
 const mapCards=el('div','','u34-claim-grid');
 graph.append(mapCards);
 const evidence=el('details','','u34-witness-library');
 evidence.append(el('summary','Open original-source evidence (dialogue, reading and written records)'));
 const witnessList=el('div','','u34-witness-list');
 const witnessCard=(locator:string)=>{
  const witness=source.witnesses.find(w=>w.locator===locator);
  if(!witness)return null;
  const card=el('article','','u34-witness');
  card.append(el('h5',witness.label),
   el('p',witness.kind==='document'?'Independently attributed original written document':
    witness.kind==='reading'?'Original connected written reading':
    'Original authored dialogue turn (text, not recorded human speech)','u34-provenance'));
  const text=el('p',witness.french,'u34-french');text.lang='fr';card.append(text);
  if(witness.explanation)card.append(el('p','Original English explanation: '+witness.explanation,'u34-provenance'));
  card.append(el('p',witness.qualifiedSourceId+' · '+witness.sourceRevision,'u34-provenance'));
  return card;
 };
 for(const witness of source.witnesses){
  const card=witnessCard(witness.locator);if(card)witnessList.append(card);
 }
 evidence.append(witnessList);
 const debate=el('section','','u34-rounds');
 debate.append(el('h4','Debate with increasing independence'));
 const turnNav=el('nav','','u34-turn-nav');turnNav.setAttribute('aria-label','Five original debate rounds');
 const turnPane=el('article','','u34-turn-pane');
 debate.append(turnNav,turnPane);
 const genres=el('section','','u34-genres');
 genres.append(el('h4','Cross-genre composition and speaking'));
 const genreNav=el('nav','','u34-genre-nav');genreNav.setAttribute('aria-label','Choose a French argument genre');
 const genrePane=el('article','','u34-genre-pane');genres.append(genreNav,genrePane);
 const comparison=el('section','','u34-source-compare');
 comparison.append(el('h4','Evidence comparison, with strict provenance'));
 const checks=el('section','','u34-decisions');
 checks.append(el('h4','Authored source and register decisions'));
 const exit=el('section','','u34-exits');
 exit.append(el('h4','Continue through the existing original workspaces'));
 const live=el('p','','u34-status');live.setAttribute('role','status');
 body.append(header,graph,evidence,debate,genres,comparison,checks,exit,live);

 let selectedTurn=0,selectedGenre:U34Genre='service',support=0,showIndependent=false;
 let selectedPair=0,questionIndex=0,disposed=false;
 const turns=new Map<string,DraftState>(),genreDrafts=new Map<U34Genre,DraftState>();
 const pairDrafts=new Map<string,[string,string,string]>();
 const localChecks=new Map<string,{answer:string;matched:boolean}>();
 const getTurn=(key:string)=>turns.get(key)??initialState();
 const getGenre=(key:U34Genre)=>genreDrafts.get(key)??initialState();
 let activePairKey='';
 const notify=()=>{
  if(disposed)return;
  const all=[...turns.values(),...genreDrafts.values()].flatMap(s=>[s.first,s.independent]);
  for(const fields of pairDrafts.values())all.push(...fields);
  const hasDraft=all.some(s=>s.trim().length>0);
  root.dataset.hasPrivateDraft=String(hasDraft);
  options.onPrivateChange?.(hasDraft);
 };
 function drawGraph(){
  mapCards.replaceChildren();
  const definitions:Readonly<Record<U34Claim['role'],string>>={
   claim:'Claim to defend',evidence:'Original witness',
   counterclaim:'Fair competing perspective',rebuttal:'Reasoned reply',
   limit:'Source limit or open question'
  };
  for(const claim of source.claims){
   const card=el('article','','u34-claim');
   card.append(el('p',definitions[claim.role],'u34-eyebrow'),el('h5',claim.label),
    el('p',claim.coaching,'u34-caveat'));
   const refs=el('details');
   refs.append(el('summary','Review '+claim.sourceLocators.length+' original evidence locator(s)'));
   for(const locator of claim.sourceLocators){
    const text=witnessCard(locator);if(text)refs.append(text);
   }
   card.append(refs);mapCards.append(card);
  }
 }
 const registers:readonly [string,string][]=[
  ['peer','Respectful peer discussion'],['service','Courteous service/professional'],
  ['public','Neutral public explanation']
 ];
 function captureControls(
  first:HTMLTextAreaElement,other:HTMLTextAreaElement,feedback:HTMLElement,
  read:()=>DraftState,write:(value:DraftState)=>void,hidden:HTMLElement,
  initialContainer:HTMLElement,independentContainer:HTMLElement
 ){
  const actions=el('div','','u34-actions');
  const take=button('Capture initial version',()=>{
   if(!first.value.trim()){feedback.textContent='Write the first response before capturing it.';return;}
   const current=read();write({...current,first:first.value,snapshot:first.value});
   feedback.textContent='Captured first text in page memory; no proficiency or improvement grade.';
  });
  const alone=button('Independent second attempt · hide earlier work',()=>{
   initialContainer.hidden=true;independentContainer.hidden=false;hidden.hidden=true;
   other.focus();feedback.textContent='Independent attempt. Earlier source supports and draft are hidden, not deleted.';
  },true);
  const returnTo=button('Return to working notes',()=>{
   initialContainer.hidden=false;independentContainer.hidden=true;hidden.hidden=false;first.focus();
  });
  const compare=button('Compare initial, revision and independent response',()=>{
   const state=read();if(!state.snapshot.trim()){feedback.textContent='Capture the first draft before comparison.';return;}
   const output=el('div','','u34-version-comparison');
   for(const [name,value] of [
    ['Captured first version',state.snapshot],
    ['Edited current version',first.value],
    ['Independent second version',other.value||'(not yet written)']
   ])output.append(el('h5',name),el('p',value,'u34-french'));
   output.append(el('p','Self-review attribution, negation, concession, register and proportionate certainty; no semantic grading.','u34-caveat'));
   feedback.after(output);
  });
  const clear=button('Discard current task drafts',()=>{
   if((first.value.trim()||other.value.trim())&&!window.confirm(
    'Discard these temporary French drafts from this task?'))return;
   first.value='';other.value='';write(initialState());
   feedback.textContent='Only the current task drafts were discarded.';
  });
  actions.append(take,alone,returnTo,compare,clear);
  return actions;
 }
 function drawTurns(focus=false){
  const turn=source.turns[selectedTurn];turnPane.replaceChildren();turnNav.replaceChildren();
  source.turns.forEach((item,i)=>{
   const b=button((i+1)+'. '+item.move,()=>{selectedTurn=i;support=0;showIndependent=false;drawTurns(true);});
   if(i===selectedTurn)b.setAttribute('aria-current','step');
   turnNav.append(b);
  });
  const title=el('h5',turn.title);title.tabIndex=-1;
  const quote=el('blockquote','','u34-challenge');
  quote.append(el('p',turn.challenge),el('p','Hypothetical opponent — NOT an original participant','u34-provenance'));
  const task=el('p',turn.instruction,'u34-instruction');
  const helper=el('div','','u34-helper');
  const hint=el('p','Structure: thesis → original source → strongest fair opposing concern → qualified conclusion.','u34-caveat');
  const refs=el('div','','u34-witness-list');
  const model=el('p',turn.model,'u34-french');model.lang='fr';
  helper.append(hint,refs,model);
  const stageSupport=()=>{
   hint.hidden=support<1;
   refs.hidden=support<2;
   model.hidden=support<3;
   refs.replaceChildren();
   if(support>=2)for(const locator of turn.sourceLocators){
    const card=witnessCard(locator);if(card)refs.append(card);
   }
  };
  const supports=el('div','','u34-actions');
  supports.append(button('1 · Strategy hint',()=>{support=Math.max(1,support);stageSupport();}),
   button('2 · Original evidence',()=>{support=Math.max(2,support);stageSupport();}),
   button('3 · Authored illustrative reply',()=>{support=3;stageSupport();}));
  const registerLabel=el('label','Change audience register','u34-picker');
  const register=el('select');register.setAttribute('aria-label','Debate audience register');
  for(const [key,name] of registers){const option=el('option',name);option.value=key;register.append(option);}
  const now=getTurn(turn.id);register.value=now.register;
  register.addEventListener('change',()=>{
   turns.set(turn.id,{...getTurn(turn.id),register:register.value});
   status.textContent='Register changed. Preserve facts and source limits while adapting tone.';
  });
  registerLabel.append(register);
  const status=el('p','Original sources remain authoritative. '+turn.guard,'u34-caveat');
  const original=el('label','My source-grounded French response','u34-draft-label');
  const first=el('textarea');first.rows=7;first.maxLength=8000;first.lang='fr';first.value=now.first;
  first.setAttribute('aria-label','Temporary debate response');
  original.append(first);
  const secondLabel=el('label','Independent spoken or written second response','u34-draft-label');
  const second=el('textarea');second.rows=7;second.maxLength=8000;second.lang='fr';second.value=now.independent;
  second.setAttribute('aria-label','Independent French debate response');
  secondLabel.append(second);secondLabel.hidden=true;
  first.addEventListener('input',()=>{turns.set(turn.id,{...getTurn(turn.id),first:first.value});notify();});
  second.addEventListener('input',()=>{turns.set(turn.id,{...getTurn(turn.id),independent:second.value});notify();});
  const feedback=el('p','','u34-status');feedback.setAttribute('role','status');
  const actions=captureControls(first,second,feedback,()=>getTurn(turn.id),v=>{
   turns.set(turn.id,v);notify();
  },helper,original,secondLabel);
  const self=el('div','','u34-actions');
  self.append(button('I delivered my reply aloud (unverified self-report)',()=>{
   turns.set(turn.id,{...getTurn(turn.id),selfReported:true});
   feedback.textContent='Speaking self-reported only. U34 did not capture or rate audio.';
  }));
  const next=el('div','','u34-actions');
  next.append(button('← Previous debate round',()=>{selectedTurn--;support=0;drawTurns(true);}),
   button('Next debate round →',()=>{selectedTurn++;support=0;drawTurns(true);},true));
  next.querySelectorAll('button')[0].disabled=selectedTurn===0;
  next.querySelectorAll('button')[1].disabled=selectedTurn===source.turns.length-1;
  const checklist=el('ul','','u34-self-check');
  for(const criterion of ['I quoted a genuine original witness.',
   'I represented the hypothetical opponent fairly, without labeling fiction as history.',
   'My rebuttal respects original source limits and honest uncertainty.',
   'My reply changes tone without inventing agreement or confirmation.'])
   checklist.append(el('li',criterion));
  turnPane.append(title,quote,task,registerLabel,status,supports,helper,original,
   secondLabel,actions,self,feedback,checklist,next);
  stageSupport();
  if(focus)title.focus({preventScroll:true});
 }
 function drawGenres(){
  genrePane.replaceChildren();genreNav.replaceChildren();
  for(const task of source.genres){
   const b=button(task.title,()=>{selectedGenre=task.genre;drawGenres();});
   if(task.genre===selectedGenre)b.setAttribute('aria-current','step');
   genreNav.append(b);
  }
  const task=source.genres.find(x=>x.genre===selectedGenre)!;
  genrePane.append(el('h5',task.title),el('p',task.audience+' · '+task.format,'u34-provenance'),
   el('p',task.task,'u34-instruction'));
  const support=el('details','','u34-genre-outline');
  support.append(el('summary','Optional genre-specific outline'));
  const ol=el('ol');for(const step of task.outline)ol.append(el('li',step));
  support.append(ol);
  const evidence=el('details','','u34-genre-evidence');
  evidence.append(el('summary','View authentic original source records'));
  for(const locator of task.sourceLocators){
   const w=witnessCard(locator);if(w)evidence.append(w);
  }
  const example=el('details','','u34-genre-example');
  example.append(el('summary','Reveal newly authored illustration (not a source quotation)'));
  const model=el('p',task.model,'u34-french');model.lang='fr';example.append(model);
  const supports=el('div','','u34-genre-support');
  supports.append(support,evidence,example);
  const state=getGenre(task.genre);
  const label=el('label','My original French '+task.genre+' text · page-memory only','u34-draft-label');
  const first=el('textarea');first.rows=11;first.maxLength=14000;first.lang='fr';first.value=state.first;
  first.setAttribute('aria-label','Independent French '+task.genre+' composition');label.append(first);
  const retry=el('label','New independent version · earlier text hidden','u34-draft-label');
  const other=el('textarea');other.rows=11;other.maxLength=14000;other.lang='fr';other.value=state.independent;
  retry.append(other);retry.hidden=true;
  first.addEventListener('input',()=>{
   genreDrafts.set(task.genre,{...getGenre(task.genre),first:first.value});notify();
  });
  other.addEventListener('input',()=>{
   genreDrafts.set(task.genre,{...getGenre(task.genre),independent:other.value});notify();
  });
  const feedback=el('p','','u34-status');feedback.setAttribute('role','status');
  const actions=captureControls(first,other,feedback,()=>getGenre(task.genre),v=>{
   genreDrafts.set(task.genre,v);notify();
  },supports,label,retry);
  genrePane.append(supports,label,retry,actions,feedback,
   el('p','Check factual attribution, coherent paragraphs, reader register and conditional conclusions yourself. No writing or oral proficiency grade is generated.','u34-caveat'));
 }
 function drawComparison(){
  comparison.replaceChildren(el('h4','Compare actual sources before defending a claim'));
  const docs=source.witnesses.filter(w=>w.kind==='document');
  const readings=source.witnesses.filter(w=>w.kind==='reading');
  const dialogue=source.witnesses.filter(w=>w.kind==='dialogue');
  const choices:[string,string,string][]=[];
  if(docs.length>=2)choices.push(['Two independently attributed written records',docs[0].locator,docs[1].locator]);
  if(readings.length&&docs.length)choices.push(['Reading and independently attributed written document',readings[0].locator,docs[0].locator]);
  if(dialogue.length&&docs.length)choices.push(['Original dialogue versus independent written document',dialogue[0].locator,docs[0].locator]);
  if(!choices.length&&reading.length&&dialogue.length)choices.push(['Original reading versus original dialogue',readings[0].locator,dialogue[0].locator]);
  if(!choices.length&&dialogue.length>=2)choices.push(['Two turns of the SAME original dialogue (not independent publications)',dialogue[0].locator,dialogue[1].locator]);
  if(!choices.length){comparison.append(el('p','No two distinct original source witnesses are available for a comparison.','u34-caveat'));return;}
  const toolbar=el('nav','','u34-actions'),texts=el('div','','u34-compare-cards');
  const labels=['What the first source actually states','What the second source states or contradicts','A fair French synthesis with one limitation'];
  const fields=labels.map((title,i)=>{
   const label=el('label',title,'u34-draft-label'),area=el('textarea');
   area.rows=i===2?6:3;area.maxLength=6000;area.lang='fr';label.append(area);
   return {label,area};
  });
  const help=el('p','','u34-caveat');
  const paint=(index:number)=>{
   selectedPair=index;
   const [title,first,second]=choices[index],key=first+'::'+second;
   activePairKey=key;
   texts.replaceChildren();
   for(const locator of [first,second]){
    const card=witnessCard(locator);if(card)texts.append(card);
   }
   const saved=pairDrafts.get(key)??['','',''];
   fields.forEach((x,i)=>{
    x.area.value=saved[i];x.area.oninput=()=>{
     const current=pairDrafts.get(key)??['','',''];
     const changed:[string,string,string]=[current[0],current[1],current[2]];
     changed[i]=x.area.value;pairDrafts.set(key,changed);notify();
    };
   });
   help.textContent=title+'. Compare source scope and attribution; an original record may make an inaccurate claim, and two dialogue turns are not independent records.';
  };
  choices.forEach(([title],i)=>toolbar.append(button(title,()=>paint(i))));
  comparison.append(toolbar,help,texts,...fields.map(x=>x.label));
  paint(Math.min(selectedPair,choices.length-1));
 }
 function drawDecisions(){
  checks.replaceChildren(el('h4','Practice-only source and misconception decisions'));
  if(!source.checks.length){
   checks.append(el('p','No bespoke U34 keyed source checks exist for this general lesson. Use the authored debate and source map with independent self-review.','u34-caveat'));
   return;
  }
  questionIndex=Math.min(questionIndex,source.checks.length-1);
  const task=source.checks[questionIndex],form=el('form','','u34-decision-form');
  form.append(el('p','Keyed source question '+(questionIndex+1)+' / '+source.checks.length,'u34-provenance'),
   el('h5',task.question));
  const label=el('label','Choose the source-responsible answer','u34-draft-label');
  const select=el('select');const empty=el('option','Choose an authored option');empty.value='';select.append(empty);
  for(const x of task.options){const opt=el('option',x);opt.value=x;select.append(opt);}
  const old=localChecks.get(task.id);if(old)select.value=old.answer;
  label.append(select);
  const feedback=el('p',old?compareU34Decision(task,old.answer).feedback:'','u34-status');feedback.setAttribute('role','status');
  const submit=el('button','Compare with authored key','primary-action compact-action');submit.type='submit';
  form.addEventListener('submit',e=>{
   e.preventDefault();
   if(!select.value){feedback.textContent='Choose one original authored response before checking.';return;}
   const result=compareU34Decision(task,select.value);
   localChecks.set(task.id,{answer:select.value,matched:result.matched});
   feedback.textContent=result.feedback;
  });
  const evidence=el('details','','u34-decision-evidence');
  evidence.append(el('summary','Reveal original textual evidence'));
  for(const locator of task.sourceLocators){
   const w=witnessCard(locator);if(w)evidence.append(w);
  }
  const nav=el('div','','u34-actions');
  nav.append(button('Previous source decision',()=>{questionIndex--;drawDecisions();}),
   button('Next source decision',()=>{questionIndex++;drawDecisions();}));
  nav.querySelectorAll('button')[0].disabled=questionIndex===0;
  nav.querySelectorAll('button')[1].disabled=questionIndex===source.checks.length-1;
  form.append(label,submit,feedback);
  checks.append(form,evidence,nav);
 }
 function drawExits(){
  const buttons=el('div','','u34-actions');
  if(options.onOpenSurface){
   for(const [surface,title,available] of [
    ['course','Original Course',true],['speak','Oral training',true],['listen','Original dialogue listening',true],
    ['read','Original connected reading',source.witnesses.some(x=>x.kind==='reading')],
    ['write','Original independent writing',true]
   ] as const){
    if(available)buttons.append(button(title,()=>options.onOpenSurface?.(surface,id)));
   }
  }
  if(options.onNativeReview)buttons.append(button('Native scheduled Review',()=>options.onNativeReview?.()));
  exit.append(buttons,el('p','Navigation uses the existing historical U23 identity and parent exit guards. No essays, scores or made-up audio are carried into another screen.','u34-caveat'));
 }
 function cleanup(){
  if(disposed)return;disposed=true;
  options.signal.removeEventListener('abort',cleanup);
  turns.clear();genreDrafts.clear();pairDrafts.clear();localChecks.clear();
  root.remove();
 }
 options.signal.addEventListener('abort',cleanup,{once:true});
 drawGraph();drawTurns();drawGenres();drawComparison();drawDecisions();drawExits();
 live.textContent='Source-attested U34 activities are available. Private drafts exist only in this mounted page.';
 return cleanup;
}
