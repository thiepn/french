import {
 originalU36Longform,compareU36AuthoredChoice,
 type U36Genre,type U36StepKind,type U36EvidenceLabel,type U36Audience
} from '../core/unified/u36-longform.ts';
import type {OriginalSurface} from '../core/unified/u23-registry.ts';
import './u36-longform-panel.css';

interface Options{
 readonly signal:AbortSignal;
 readonly onPrivateChange?:(present:boolean)=>void;
 readonly onOpenSurface?:(surface:OriginalSurface,id:string)=>void;
 readonly onNativeReview?:()=>void;
}
type Work={draft:string;independent:string;captured:string;audience:U36Audience};
type EvidenceNote={claim:string;limitation:string;classification:U36EvidenceLabel};
type PairNote={first:string;second:string;interpretation:string};
const WORK_DEFAULT=(audience:U36Audience):Work=>({
 draft:'',independent:'',captured:'',audience
});
function el<K extends keyof HTMLElementTagNameMap>(tag:K,text='',cls=''):HTMLElementTagNameMap[K]{
 const n=document.createElement(tag);
 if(text)n.textContent=text;
 if(cls)n.className=cls;
 return n;
}
function button(title:string,fn:()=>void,primary=false):HTMLButtonElement{
 const b=el('button',title,primary?'primary-action compact-action':'secondary-action compact-action');
 b.type='button';b.addEventListener('click',fn);return b;
}
const AUDIENCES:readonly [U36Audience,string][]=[
 ['peer','Peer · natural explanatory French'],['professional','Professional · polite and precise'],
 ['public','Public · accessible and source-qualified']
];
const CLASSIFICATIONS:readonly [U36EvidenceLabel,string][]=[
 ['direct-quotation','Direct statement in original text'],
 ['reported-claim','Reported claim by an original speaker'],
 ['interpretation','My proposed interpretation (not automatically verified)'],
 ['unestablished','A fact still unestablished by this source']
];

/** A disposable original-source teaching component; no browser storage or remote writes. */
export function appendOriginalU36Longform(host:HTMLElement,id:string,options:Options):()=>void{
 const source=originalU36Longform(id);
 if(!source)return()=>{};
 const root=el('section','','u36-longform');
 root.dataset.hasPrivateDraft='false';
 root.setAttribute('aria-label','Source-critical autonomous French long-form production');
 const disclosure=el('details','','u36-disclosure');
 disclosure.append(el('summary','U36 · Independent source criticism and long-form production'));
 const body=el('div','','u36-body');
 disclosure.append(body);root.append(disclosure);host.append(root);
 const intro=el('header','','u36-intro');
 intro.append(el('p','ORIGINAL SOURCE · INDEPENDENT EDITORIAL LEARNING','eyebrow'),
  el('h3',source.title),
  el('p','Original identity: '+source.qualifiedSourceId+' · '+source.level+
   ' · revision '+source.sourceRevision,'u36-provenance'),
  el('p','Only attributed original dialogue/reading/documents are historical material. Opponents, corrections, sample arguments and genre models are NEW teaching content. French essays are self-reviewed; no recordings, CEFR grades, scores or private uploads.','u36-caveat'));
 if(!source.curated)intro.append(el('p',
  'General source-grounded independent pathway, not a dedicated U36 editorial case for this lesson.','u36-caveat'));
 const originals=el('details','','u36-source-library');
 originals.append(el('summary','Browse attributed original French evidence'));
 const originalItems=el('div','','u36-source-grid');
 originals.append(originalItems);
 const ledger=el('section','','u36-ledger');
 ledger.append(el('h4','Source-to-claim evidence ledger'),
  el('p','Attach your own observation, interpretation or unresolved question to ONE historical witness. The classification is your own judgment and is never auto-certified.','u36-caveat'));
 const ledgerChooser=el('label','Select an original source witness','u36-label');
 const ledgerSelect=el('select');
 ledgerSelect.setAttribute('aria-label','Original witness for evidence notes');
 for(const w of source.witnesses){
  const o=el('option',w.label);o.value=w.locator;ledgerSelect.append(o);
 }
 ledgerChooser.append(ledgerSelect);
 const ledgerArea=el('div','','u36-ledger-area');
 ledger.append(ledgerChooser,ledgerArea);
 const paired=el('section','','u36-paired');
 paired.append(el('h4','Compare original records without inventing independence'));
 const pairNav=el('nav','','u36-choice-nav');
 pairNav.setAttribute('aria-label','Available actual original source comparisons');
 const pairArea=el('div','','u36-pair-area');
 paired.append(pairNav,pairArea);
 const stages=el('section','','u36-stages');
 stages.append(el('h4','Five independent production stages'));
 const stageNav=el('nav','','u36-choice-nav');
 stageNav.setAttribute('aria-label','Source criticism production stages');
 const stageArea=el('article','','u36-stage');
 stages.append(stageNav,stageArea);
 const corrective=el('section','','u36-corrective');
 corrective.append(el('h4','Specific editorial misconception decisions'));
 const decisionArea=el('div','','u36-decision-area');
 corrective.append(decisionArea);
 const genres=el('section','','u36-genres');
 genres.append(el('h4','Long-form transfer into authentic situations'));
 const genreNav=el('nav','','u36-choice-nav');genreNav.setAttribute('aria-label','Select communication genre');
 const genreArea=el('article','','u36-genre');
 genres.append(genreNav,genreArea);
 const continuation=el('section','','u36-continuation');
 continuation.append(el('h4','Continue using existing original learning routes'));
 const live=el('p','','u36-status');live.setAttribute('role','status');
 body.append(intro,originals,ledger,paired,stages,corrective,genres,continuation,live);

 let disposed=false,activePair=0,activeStage=0,activeCheck=0,activeGenre:U36Genre='correspondence';
 const stagesWork=new Map<U36StepKind,Work>();
 const genreWork=new Map<U36Genre,Work>();
 const ledgerWork=new Map<string,EvidenceNote>();
 const pairsWork=new Map<string,PairNote>();
 const choices=new Map<string,string>();
 const selfReported=new Set<string>();
 const support=new Map<string,number>();
 const hasPrivate=()=>{
  const writing=[...stagesWork.values(),...genreWork.values()].some(v=>
   !!v.draft.trim()||!!v.independent.trim());
  const notes=[...ledgerWork.values()].some(v=>!!v.claim.trim()||!!v.limitation.trim());
  const pairNotes=[...pairsWork.values()].some(v=>
   !!v.first.trim()||!!v.second.trim()||!!v.interpretation.trim());
  return writing||notes||pairNotes;
 };
 const changed=()=>{
  if(disposed)return;
  const current=hasPrivate();
  root.dataset.hasPrivateDraft=String(current);
  options.onPrivateChange?.(current);
 };
 const witnessCard=(locator:string)=>{
  const w=source.witnesses.find(x=>x.locator===locator);
  if(!w)return null;
  const card=el('article','','u36-witness');
  card.append(el('h5',w.label),
   el('p',w.kind==='dialogue'?'Original dialogue turn (original TEXT, not recorded audio)':
    w.kind==='reading'?'Original connected reading':
    'Independently attributed original written document','u36-provenance'));
  const french=el('p',w.french,'u36-french');french.lang='fr';card.append(french);
  if(w.explanation)card.append(el('p','Original English explanation: '+w.explanation,'u36-provenance'));
  card.append(el('p',w.qualifiedSourceId+' · source revision '+w.sourceRevision,'u36-provenance'));
  return card;
 };
 const reveal=(locators:readonly string[],title:string)=>{
  const panel=el('details','','u36-source-reveal');
  panel.append(el('summary',title));
  const grid=el('div','','u36-source-grid');
  for(const locator of locators){
   const card=witnessCard(locator);if(card)grid.append(card);
  }
  panel.append(grid);return panel;
 };
 for(const witness of source.witnesses){
  const card=witnessCard(witness.locator);if(card)originalItems.append(card);
 }
 const renderLedger=()=>{
  ledgerArea.replaceChildren();
  const locator=ledgerSelect.value;
  const w=source.witnesses.find(x=>x.locator===locator);
  if(!w)return;
  ledgerArea.append(el('p','Historical witness: '+w.label,'u36-provenance'),
   reveal([w.locator],'Reveal this exact original text'));
  const current=ledgerWork.get(locator)??{claim:'',limitation:'',classification:'unestablished'};
  const classification=el('label','My evidence category (manual)','u36-label');
  const select=el('select');select.setAttribute('aria-label','Manual evidence category');
  for(const [value,label] of CLASSIFICATIONS){
   const option=el('option',label);option.value=value;select.append(option);
  }
  select.value=current.classification;
  classification.append(select);
  const claimLabel=el('label','What this specific original witness actually says','u36-label');
  const claim=el('textarea');claim.lang='fr';claim.rows=4;claim.maxLength=5500;
  claim.value=current.claim;claimLabel.append(claim);
  const limitLabel=el('label','What this witness alone DOES NOT establish','u36-label');
  const limit=el('textarea');limit.lang='fr';limit.rows=4;limit.maxLength=5500;
  limit.value=current.limitation;limitLabel.append(limit);
  const update=()=>{
   ledgerWork.set(locator,{claim:claim.value,limitation:limit.value,
    classification:select.value as U36EvidenceLabel});
   changed();
  };
  select.addEventListener('change',update);
  claim.addEventListener('input',update);limit.addEventListener('input',update);
  const actions=el('div','','u36-actions');
  actions.append(button('Discard notes for this witness',()=>{
   if((claim.value.trim()||limit.value.trim())&&
      !window.confirm('Discard only these unsaved source-specific notes?'))return;
   ledgerWork.delete(locator);renderLedger();changed();
  }));
  ledgerArea.append(classification,claimLabel,limitLabel,actions);
 };
 ledgerSelect.addEventListener('change',renderLedger);

 const renderPairs=()=>{
  pairNav.replaceChildren();pairArea.replaceChildren();
  if(!source.pairings.length){
   pairArea.append(el('p','No independent or distinct historical witness pair is available. Source independence is not invented.','u36-caveat'));
   return;
  }
  source.pairings.forEach((pair,i)=>{
   const a=source.witnesses.find(x=>x.locator===pair.first);
   const b=source.witnesses.find(x=>x.locator===pair.second);
   const selector=button((i+1)+'. '+(a?.label??'First')+' / '+(b?.label??'Second'),()=>{
    activePair=i;renderPairs();
   });
   if(i===activePair)selector.setAttribute('aria-current','step');
   pairNav.append(selector);
  });
  const pair=source.pairings[Math.min(activePair,source.pairings.length-1)];
  pairArea.append(el('p',pair.label+' · '+pair.limitation,'u36-caveat'));
  const cards=el('div','','u36-source-grid');
  for(const loc of [pair.first,pair.second]){
   const item=witnessCard(loc);if(item)cards.append(item);
  }
  pairArea.append(cards);
  const saved=pairsWork.get(pair.id)??{first:'',second:'',interpretation:''};
  for(const [key,labelText] of [
   ['first','What the FIRST original record establishes'],
   ['second','How the SECOND original record differs, supports or limits it'],
   ['interpretation','My independent qualified French synthesis and remaining uncertainty']
  ] as const){
   const label=el('label',labelText,'u36-label');
   const textarea=el('textarea');textarea.lang='fr';textarea.rows=key==='interpretation'?6:3;
   textarea.maxLength=6000;textarea.value=saved[key];
   textarea.addEventListener('input',()=>{
    const prior=pairsWork.get(pair.id)??{first:'',second:'',interpretation:''};
    pairsWork.set(pair.id,{...prior,[key]:textarea.value});changed();
   });
   label.append(textarea);pairArea.append(label);
  }
 };

 /** Staged, genuinely editable first and independent second versions with source-owned excerpts. */
 const writingPanel=(key:string,defaultAudience:U36Audience,store:Map<any,Work>,
  container:HTMLElement,supportContent:HTMLElement,sourceLocators:readonly string[])=>{
  const value=store.get(key)??{
   draft:'',independent:'',captured:'',audience:defaultAudience
  };
  const read=()=>store.get(key)??{
   draft:'',independent:'',captured:'',audience:defaultAudience
  };
  const write=(patch:Partial<Work>)=>{
   store.set(key,{...read(),...patch});changed();
  };
  const register=el('label','Audience register for this attempt','u36-label');
  const select=el('select');
  for(const [kind,text] of AUDIENCES){
   const option=el('option',text);option.value=kind;select.append(option);
  }
  select.value=value.audience;select.setAttribute('aria-label','French audience register');
  select.addEventListener('change',()=>write({audience:select.value as U36Audience}));
  register.append(select);
  const firstLabel=el('label','My first source-qualified French response','u36-label');
  const first=el('textarea');first.lang='fr';first.rows=10;first.maxLength=16000;
  first.setAttribute('aria-label','Temporary first French long-form response');
  first.value=value.draft;firstLabel.append(first);
  const secondLabel=el('label','Independent second version, with the first and scaffolds hidden','u36-label');
  const second=el('textarea');second.lang='fr';second.rows=10;second.maxLength=16000;
  second.setAttribute('aria-label','Independent second French long-form response');
  second.value=value.independent;secondLabel.append(second);secondLabel.hidden=true;
  first.addEventListener('input',()=>write({draft:first.value}));
  second.addEventListener('input',()=>write({independent:second.value}));
  const feedback=el('p','','u36-status');feedback.setAttribute('role','status');
  const versions=el('div','','u36-revision');versions.hidden=true;
  const actions=el('div','','u36-actions');
  actions.append(button('Capture this version for comparison',()=>{
   if(!first.value.trim()){feedback.textContent='Write a first response before capturing it.';return;}
   write({captured:first.value});
   feedback.textContent='Earlier version captured in this page only, with no grading.';
  }),button('Try independently · hide first draft and hints',()=>{
   firstLabel.hidden=true;supportContent.hidden=true;
   secondLabel.hidden=false;second.focus();
   feedback.textContent='Earlier writing and authored help hidden. Your source remains available separately.';
  },true),button('Return to the first version',()=>{
   secondLabel.hidden=true;firstLabel.hidden=false;supportContent.hidden=false;first.focus();
  }),button('Compare captured, edited and independent text',()=>{
   const captured=read().captured;
   if(!captured){feedback.textContent='Capture the earlier text first.';return;}
   versions.replaceChildren();
   for(const [title,text] of [
    ['Captured first response',captured],['Current edited response',first.value],
    ['New independent response',second.value||'(no independent text written)']
   ])versions.append(el('h5',title),el('p',text,'u36-french'));
   versions.append(el('p','Review evidence, cohesion, register, fair objections and uncertainty manually. This is not a semantic score.','u36-caveat'));
   versions.hidden=false;
  }),button('Discard this task’s drafts',()=>{
   if((first.value.trim()||second.value.trim())&&
      !window.confirm('Discard this task’s temporary French writing?'))return;
   store.delete(key);first.value='';second.value='';versions.hidden=true;changed();
   feedback.textContent='Only this task’s drafts were discarded.';
  }));
  const criteria=el('ul','','u36-criteria');
  for(const text of [
   'My central claim is actually supported by an attributed original witness.',
   'I distinguish a speaker’s report, document status and my own interpretation.',
   'The most serious objection is represented fairly before my rebuttal.',
   'Negation, uncertainty, consent, sample scope and permission remain accurate.',
   'The second text has an improved explanation I can describe without a fabricated grade.'
  ])criteria.append(el('li',text));
  container.append(register,firstLabel,secondLabel,actions,feedback,versions,criteria,
   reveal(sourceLocators,'Check genuine original source before finalizing'));
 };
 const renderStages=(focus=false)=>{
  stageNav.replaceChildren();stageArea.replaceChildren();
  for(const [i,step] of source.stages.entries()){
   const b=button((i+1)+'. '+step.title,()=>{activeStage=i;renderStages(true);});
   if(i===activeStage)b.setAttribute('aria-current','step');
   stageNav.append(b);
  }
  const step=source.stages[activeStage],title=el('h5',step.title);title.tabIndex=-1;
  stageArea.append(title,el('p',step.assignment,'u36-task'),
   el('p','Optional aim: about '+step.paragraphGuidance+' developed French paragraph(s); this is not a standardized CEFR requirement.','u36-caveat'),
   el('p','Source constraint: '+step.sourceGuard,'u36-caveat'));
  const helpers=el('div','','u36-helpers');
  const guidance=el('ol','','u36-criteria');
  for(const q of step.guidingQuestions)guidance.append(el('li',q));
  const original=el('div','','u36-source-grid');
  for(const locator of step.sourceLocators){
   const card=witnessCard(locator);if(card)original.append(card);
  }
  const model=el('p',step.editorExample,'u36-french');model.lang='fr';
  helpers.append(guidance,original,model);
  const currentLevel=support.get(step.id)??0;
  const show=(level:number)=>{
   support.set(step.id,Math.max(level,support.get(step.id)??0));
   const next=support.get(step.id)!;
   guidance.hidden=next<1;original.hidden=next<2;model.hidden=next<3;
  };
  const actions=el('div','','u36-actions');
  actions.append(button('1 · Show editing strategy',()=>show(1)),
   button('2 · Reveal exact original source',()=>show(2)),
   button('3 · Reveal U36 illustration (not a source quotation)',()=>show(3)));
  stageArea.append(actions,helpers);
  show(currentLevel);
  writingPanel(step.kind,step.audience,stagesWork,stageArea,helpers,step.sourceLocators);
  const navigation=el('div','','u36-actions');
  const prev=button('← Previous production stage',()=>{activeStage--;renderStages(true);});
  const next=button('Next production stage →',()=>{activeStage++;renderStages(true);},true);
  prev.disabled=activeStage===0;next.disabled=activeStage===source.stages.length-1;
  navigation.append(prev,next);stageArea.append(navigation);
  if(focus)title.focus({preventScroll:true});
 };
 const renderChoices=()=>{
  decisionArea.replaceChildren();
  if(!source.decisions.length){
   decisionArea.append(el('p','This original lesson has no dedicated U36 keyed corrections. Independent writing remains source-led and self-reviewed.','u36-caveat'));return;
  }
  activeCheck=Math.max(0,Math.min(activeCheck,source.decisions.length-1));
  const decision=source.decisions[activeCheck];
  const form=el('form','','u36-choice-form');
  form.append(el('p','Source-critical decision '+(activeCheck+1)+' / '+source.decisions.length,'u36-provenance'),
   el('h5',decision.question));
  const answerLabel=el('label','Choose the carefully source-qualified authored response','u36-label');
  const select=el('select');select.setAttribute('aria-label','Authorial source-critical question response');
  const blank=el('option','Choose an authored response');blank.value='';select.append(blank);
  for(const value of decision.choices){const o=el('option',value);o.value=value;select.append(o);}
  const remembered=choices.get(decision.id);if(remembered)select.value=remembered;
  answerLabel.append(select);
  const feedback=el('p',remembered?compareU36AuthoredChoice(decision,remembered).message:'','u36-status');
  feedback.setAttribute('role','status');
  const check=el('button','Compare with authored source key','primary-action compact-action');check.type='submit';
  form.addEventListener('submit',event=>{
   event.preventDefault();
   if(!select.value){feedback.textContent='Select an authored answer to compare.';return;}
   choices.set(decision.id,select.value);
   feedback.textContent=compareU36AuthoredChoice(decision,select.value).message;
  });
  select.addEventListener('change',()=>{feedback.textContent='Response changed; compare the new choice to the authored key.';});
  form.append(answerLabel,check,feedback);
  const nav=el('div','','u36-actions');
  const prev=button('Previous source check',()=>{activeCheck--;renderChoices();});
  const next=button('Next source check',()=>{activeCheck++;renderChoices();});
  prev.disabled=activeCheck===0;next.disabled=activeCheck===source.decisions.length-1;
  nav.append(prev,next);
  decisionArea.append(form,reveal(decision.witnessLocators,'Review the actual original evidence'),nav);
 };
 const renderGenres=()=>{
  genreNav.replaceChildren();genreArea.replaceChildren();
  for(const task of source.genreAssignments){
   const b=button(task.title,()=>{activeGenre=task.genre;renderGenres();});
   if(task.genre===activeGenre)b.setAttribute('aria-current','step');
   genreNav.append(b);
  }
  const task=source.genreAssignments.find(x=>x.genre===activeGenre);
  if(!task)return;
  genreArea.append(el('h5',task.title),el('p','Intended audience: '+task.audience,'u36-provenance'),
   el('p',task.purpose,'u36-task'));
  const hints=el('div','','u36-helpers');
  const outline=el('details','','u36-source-reveal');
  outline.append(el('summary','Optional genre-specific structure'));
  const ol=el('ol','','u36-criteria');
  for(const item of task.constraints)ol.append(el('li',item));
  outline.append(ol);
  const illustration=el('details','','u36-source-reveal');
  illustration.append(el('summary','New U36 model, NOT an original historical quote'));
  const fr=el('p',task.shortModel,'u36-french');fr.lang='fr';illustration.append(fr);
  hints.append(outline,illustration);
  genreArea.append(hints);
  writingPanel(task.genre,'professional',genreWork,genreArea,hints,task.sourceLocators);
 };
 const renderContinuation=()=>{
  const actions=el('div','','u36-actions');
  if(options.onOpenSurface){
   for(const [surface,label,allowed] of [
    ['course','Return to original Course',true],
    ['speak','Continue original speaking work',true],
    ['listen','Original dialogue listening',true],
    ['read','Original connected reading',source.witnesses.some(w=>w.kind==='reading')],
    ['write','Continue original writing',true]
   ] as const){
    if(allowed)actions.append(button(label,()=>options.onOpenSurface?.(surface,id)));
   }
  }
  if(options.onNativeReview)actions.append(button('Native scheduled Review',()=>options.onNativeReview?.()));
  continuation.append(actions,
   el('p','Existing parent U35→U34→U33 navigation handles unsent-work confirmation. Only the historical original lesson identity is handed off, not page-local essays or invented progress.','u36-caveat'));
 };
 const cleanup=()=>{
  if(disposed)return;disposed=true;
  options.signal.removeEventListener('abort',cleanup);
  stagesWork.clear();genreWork.clear();ledgerWork.clear();
  pairsWork.clear();choices.clear();support.clear();selfReported.clear();
  root.remove();
 };
 options.signal.addEventListener('abort',cleanup,{once:true});
 renderLedger();renderPairs();renderStages();renderChoices();renderGenres();renderContinuation();
 live.textContent='Source-critical writing is available. No native learning mastery, speech score, external upload or persistent draft is recorded.';
 return cleanup;
}
