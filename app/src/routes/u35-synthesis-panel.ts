import {
 originalU35Synthesis,compareU35AuthoredKey,
 type U35TaskKind,type U35Audience
} from '../core/unified/u35-synthesis.ts';
import type {OriginalSurface} from '../core/unified/u23-registry.ts';
import './u35-synthesis-panel.css';
import {appendOriginalU36Longform} from './u36-longform-panel.ts';

interface Options{
 readonly signal:AbortSignal;
 readonly onPrivateChange?:(hasDraft:boolean)=>void;
 readonly onOpenSurface?:(surface:OriginalSurface,id:string)=>void;
 readonly onNativeReview?:()=>void;
}
interface Response{
 first:string;second:string;captured:string;spoken:boolean;
 audience:U35Audience;
}
function empty(audience:U35Audience):Response{
 return {first:'',second:'',captured:'',spoken:false,audience};
}
function el<K extends keyof HTMLElementTagNameMap>(tag:K,text='',cls=''):HTMLElementTagNameMap[K]{
 const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;
}
function button(text:string,fn:()=>void,primary=false):HTMLButtonElement{
 const n=el('button',text,primary?'primary-action compact-action':'secondary-action compact-action');
 n.type='button';n.addEventListener('click',fn);return n;
}
const AUDIENCE:readonly [U35Audience,string][]=[
 ['peer','Peer · clear and collaborative'],
 ['professional','Service/professional · formal and precise'],
 ['public','Public · neutral and evidence-aware']
];
const GENRES:readonly [string,string,string][]=[
 ['service','Professional request',
  'Write a concise, courteous correspondence that identifies what should be confirmed and why.'],
 ['report','Neutral evidence report',
  'Compare what the original records establish and where they differ; distinguish a concern from an allegation.'],
 ['briefing','Unrecorded public briefing',
  'Prepare a spoken script with a defined audience, accurate source attribution and a civil objection.'],
 ['editorial','Independent editorial',
  'Write a coherent argument with a fair counterargument, explicit limits and a responsible proposal.']
];
/**
 * U35 state lives only as lexical variables while this mounted component exists.
 * The original U34→U33→U32 private-draft signal owns exit confirmation.
 */
export function appendOriginalU35Synthesis(host:HTMLElement,id:string,opts:Options):()=>void{
 const source=originalU35Synthesis(id);if(!source)return()=>{};
 const root=el('section','','u35-synthesis');root.dataset.hasPrivateDraft='false';
 root.setAttribute('aria-label','U35 source-critical independent French synthesis and transfer');
 const disclosure=el('details','','u35-disclosure');
 disclosure.append(el('summary','U35 · Independent multi-source synthesis & real-world transfer'));
 const body=el('div','','u35-body');
 disclosure.append(body);root.append(disclosure);host.append(root);
 const header=el('header','','u35-header');
 header.append(el('p','ORIGINAL SOURCE · INDEPENDENT PRODUCTION','eyebrow'),
  el('h3',source.title),
  el('p',source.level+' · '+source.qualifiedId+' · revision '+source.sourceRevision,'u35-provenance'),
  el('p','Original dialogue, reading and documents retain their historical attribution. Editorial objections and models are NEW teaching fiction. All free French output remains page-local, self-reviewed and ungraded.','u35-caveat'));
 const stages=el('section','','u35-stages');
 stages.append(el('h4','Four-stage independent source work'));
 const stageNav=el('nav','','u35-navigation');stageNav.setAttribute('aria-label','Source synthesis stages');
 const stageArea=el('article','','u35-stage');
 stages.append(stageNav,stageArea);
 const documents=el('details','','u35-documents');
 documents.append(el('summary','Browse source-qualified original French witnesses'));
 const documentBody=el('div','','u35-evidence-grid');
 documents.append(documentBody);
 const comparisons=el('section','','u35-comparisons');
 comparisons.append(el('h4','Compare real source records, without inventing independence'));
 const comparisonNav=el('nav','','u35-actions');
 const comparisonContent=el('div','','u35-comparison-content');
 comparisons.append(comparisonNav,comparisonContent);
 const practice=el('section','','u35-choices');
 practice.append(el('h4','Misconception-specific editorial decisions'));
 const decisionContent=el('div','','u35-decision-content');
 practice.append(decisionContent);
 const genreArea=el('section','','u35-transfer');
 genreArea.append(el('h4','Cumulative real-world genre transfer'));
 const genreNav=el('nav','','u35-navigation');
 genreNav.setAttribute('aria-label','Independent French writing and speaking genres');
 const genreContent=el('div','','u35-genre-content');
 genreArea.append(genreNav,genreContent);
 const exits=el('section','','u35-exits');
 exits.append(el('h4','Continue in the existing original learning system'));
 const status=el('p','','u35-status');status.setAttribute('role','status');
 const u36Host=el('div','','u36-integration');
 body.append(header,stages,documents,comparisons,practice,genreArea,u36Host,exits,status);
 let activeStage=0,activePair=0,activeCheck=0,activeGenre='service',disposed=false;
 const drafts=new Map<string,Response>();
 const comparisonDrafts=new Map<string,[string,string,string]>();
 const keyed=new Map<string,{value:string;matched:boolean}>();
 const genreNotes=new Map<string,Response>();
 const read=(key:string,audience:U35Audience)=>drafts.get(key)??empty(audience);
 const readGenre=(key:string)=>genreNotes.get(key)??empty('professional');
 const notify=()=>{
  if(disposed)return;
  const written=[...drafts.values(),...genreNotes.values()].flatMap(x=>[x.first,x.second]);
  for(const pair of comparisonDrafts.values())written.push(...pair);
  const has=written.some(text=>text.trim().length>0)||
   !!u36Host.querySelector<HTMLElement>('.u36-longform[data-has-private-draft="true"]');
  root.dataset.hasPrivateDraft=String(has);
  opts.onPrivateChange?.(has);
 };
 const stopU36=appendOriginalU36Longform(u36Host,id,{
  signal:opts.signal,
  onPrivateChange:()=>notify(),
  onOpenSurface:opts.onOpenSurface,
  onNativeReview:opts.onNativeReview
 });
 const witnessCard=(locator:string)=>{
  const w=source.witnesses.find(w=>w.locator===locator);if(!w)return null;
  const card=el('article','','u35-evidence-card');
  card.append(el('h5',w.label),
   el('p',w.kind==='document'?'Original independently attributed written document':
    w.kind==='reading'?'Original connected reading':
    'Original historical French dialogue turn · TEXT ONLY','u35-provenance'));
  const fr=el('p',w.french,'u35-french');fr.lang='fr';card.append(fr);
  if(w.explanation)card.append(el('p','Original English explanation: '+w.explanation,'u35-provenance'));
  card.append(el('p',w.qualifiedSourceId+' · source revision '+w.sourceRevision,'u35-provenance'));
  return card;
 };
 for(const witness of source.witnesses){
  const card=witnessCard(witness.locator);if(card)documentBody.append(card);
 }
 const evidenceFor=(locators:readonly string[],name:string)=>{
  const details=el('details','','u35-attached-evidence');
  details.append(el('summary',name));
  for(const locator of locators){
   const card=witnessCard(locator);if(card)details.append(card);
  }
  return details;
 };
 const writingControls=(key:string,audience:U35Audience,host:HTMLElement,
  owner:Map<string,Response>,name:string)=>{
  const record=owner.get(key)??empty(audience);
  const firstLabel=el('label','First independent French version · temporary','u35-editor-label');
  const first=el('textarea');first.lang='fr';first.rows=8;first.maxLength=14000;first.value=record.first;
  first.setAttribute('aria-label','Original '+name+' French draft');firstLabel.append(first);
  const secondLabel=el('label','Second version · independently produced, earlier text hidden','u35-editor-label');
  const second=el('textarea');second.lang='fr';second.rows=8;second.maxLength=14000;second.value=record.second;
  second.setAttribute('aria-label','Independent '+name+' French second attempt');secondLabel.append(second);
  secondLabel.hidden=true;
  const register=el('label','Audience and register','u35-select-label');
  const select=el('select');select.setAttribute('aria-label','Select source-preserving audience');
  for(const [value,label] of AUDIENCE){const option=el('option',label);option.value=value;select.append(option);}
  select.value=record.audience;register.append(select);
  const save=(patch:Partial<Response>)=>{
   const value={...(owner.get(key)??empty(audience)),...patch};owner.set(key,value);notify();
  };
  first.addEventListener('input',()=>save({first:first.value}));
  second.addEventListener('input',()=>save({second:second.value}));
  select.addEventListener('change',()=>save({audience:select.value as U35Audience}));
  const details=el('div','','u35-output-compare');details.hidden=true;
  const feedback=el('p','','u35-status');feedback.setAttribute('role','status');
  const actions=el('div','','u35-actions');
  actions.append(button('Capture earlier version',()=>{
   if(!first.value.trim()){feedback.textContent='Write a first version before capturing it.';return;}
   save({captured:first.value});
   feedback.textContent='First version retained in this mounted component, not saved to an account.';
  }),button('Try without seeing the earlier draft',()=>{
   firstLabel.hidden=true;secondLabel.hidden=false;
   second.focus();feedback.textContent='Earlier draft hidden. Source-critical writing is self-assessed.';
  },true),button('Return to original draft',()=>{
   firstLabel.hidden=false;secondLabel.hidden=true;first.focus();
  }),button('Review draft changes',()=>{
   const snapshot=(owner.get(key)??empty(audience)).captured;
   if(!snapshot){feedback.textContent='Capture an earlier version before comparing revisions.';return;}
   details.replaceChildren();
   for(const [title,text] of [
    ['Captured earlier response',snapshot],['Latest edited response',first.value],
    ['Unassisted second response',second.value||'(not written yet)']
   ])details.append(el('h5',title),el('p',text,'u35-french'));
   details.append(el('p','Assess source identity, logical warrants, audience, negation and unsupported certainty yourself. No improvement grade is calculated.','u35-caveat'));
   details.hidden=false;
  }),button('Discard current task drafts',()=>{
   if((first.value.trim()||second.value.trim())&&
    !window.confirm('Discard only these temporary French drafts?'))return;
   owner.delete(key);first.value='';second.value='';details.hidden=true;
   notify();feedback.textContent='Current drafts discarded; other work in this page remains.';
  }));
  const self=el('ul','','u35-self-check');
  for(const criterion of [
   'I distinguish actual original speech from a new hypothetical editor.',
   'I can point to an accurate original textual witness for consequential assertions.',
   'My counterargument is stated fairly and does not erase limits of the source.',
   'I preserve negation, conditions, permission, sample size and attribution.',
   'My revised argument is clearer without claiming a measured proficiency gain.'
  ])self.append(el('li',criterion));
  host.append(register,firstLabel,secondLabel,actions,feedback,details,self);
 };
 const renderStages=(focus=false)=>{
  stageNav.replaceChildren();stageArea.replaceChildren();
  source.steps.forEach((step,i)=>{
   const tab=button((i+1)+'. '+step.title,()=>{activeStage=i;renderStages(true);});
   if(activeStage===i)tab.setAttribute('aria-current','step');
   stageNav.append(tab);
  });
  const step=source.steps[activeStage];
  const heading=el('h5',step.title);heading.tabIndex=-1;
  stageArea.append(heading,el('p',step.task,'u35-instruction'),
   el('p','Writing guidance: approximately '+step.expectedParagraphs+
    ' developed paragraph(s), not an official CEFR target.','u35-caveat'));
  const support=el('details','','u35-scaffold');
  support.append(el('summary','Optional plan and progressively revealed guidance'));
  const list=el('ol');for(const item of step.prompts)list.append(el('li',item));
  support.append(list,el('p','Source constraint: '+step.limitation,'u35-caveat'));
  const illustration=el('details');
  illustration.append(el('summary','Show newly authored illustration (not a source quote)'),
   el('p',step.authoredIllustration,'u35-french'));
  support.append(illustration);
  stageArea.append(support,evidenceFor(step.sourceLocators,'Reveal original evidence for this task'));
  writingControls(step.id,step.audience,stageArea,drafts,step.kind);
  const nav=el('div','','u35-actions');
  const prev=button('← Previous source stage',()=>{activeStage--;renderStages(true);});
  const next=button('Next source stage →',()=>{activeStage++;renderStages(true);},true);
  prev.disabled=activeStage===0;next.disabled=activeStage===source.steps.length-1;
  nav.append(prev,next);stageArea.append(nav);
  if(focus)heading.focus({preventScroll:true});
 };
 const renderPairs=()=>{
  comparisonNav.replaceChildren();comparisonContent.replaceChildren();
  if(!source.pairs.length){
   comparisonContent.append(el('p','Only one original source witness is available; no independent comparison is invented.','u35-caveat'));return;
  }
  source.pairs.forEach((pair,i)=>{
   const btn=button(pair.title,()=>{activePair=i;renderPairs();});
   if(i===activePair)btn.setAttribute('aria-current','step');comparisonNav.append(btn);
  });
  const pair=source.pairs[Math.min(activePair,source.pairs.length-1)];
  comparisonContent.append(el('p',pair.relation+' · '+pair.caveat,'u35-caveat'));
  const cards=el('div','','u35-evidence-grid');
  for(const loc of [pair.first,pair.second]){
   const card=witnessCard(loc);if(card)cards.append(card);
  }
  comparisonContent.append(cards);
  const labels=['First original source: exact claim and limitation',
   'Second original source: corroboration, conflict or different scope',
   'Independent French synthesis: what remains to verify'];
  const saved=comparisonDrafts.get(pair.id)??['','',''];
  for(let i=0;i<labels.length;i++){
   const label=el('label',labels[i],'u35-editor-label');
   const area=el('textarea');area.rows=i===2?6:3;area.maxLength=5000;area.lang='fr';area.value=saved[i];
   area.addEventListener('input',()=>{
    const prior=comparisonDrafts.get(pair.id)??['','',''];
    const next:[string,string,string]=[prior[0],prior[1],prior[2]];
    next[i]=area.value;comparisonDrafts.set(pair.id,next);notify();
   });
   label.append(area);comparisonContent.append(label);
  }
 };
 const renderChecks=()=>{
  decisionContent.replaceChildren();
  if(!source.decisions.length){
   decisionContent.append(el('p','No bespoke keyed U35 content is authored for this original lesson. Free production remains self-reviewed.','u35-caveat'));return;
  }
  activeCheck=Math.max(0,Math.min(activeCheck,source.decisions.length-1));
  const task=source.decisions[activeCheck];
  const form=el('form','','u35-decision');
  form.append(el('p','Source decision '+(activeCheck+1)+' of '+source.decisions.length,'u35-provenance'),
   el('h5',task.question));
  const label=el('label','Choose the source-grounded authored response','u35-select-label');
  const select=el('select');select.setAttribute('aria-label','Answer narrow authored source question');
  const blank=el('option','Choose a response');blank.value='';select.append(blank);
  for(const opt of task.options){const choice=el('option',opt);choice.value=opt;select.append(choice);}
  const prior=keyed.get(task.id);if(prior)select.value=prior.value;
  label.append(select);
  const feedback=el('p',prior?compareU35AuthoredKey(task,prior.value).explanation:'','u35-status');
  feedback.setAttribute('role','status');
  const check=el('button','Compare with authored key','primary-action compact-action');check.type='submit';
  form.addEventListener('submit',event=>{
   event.preventDefault();if(!select.value){feedback.textContent='Choose an authored response first.';return;}
   const result=compareU35AuthoredKey(task,select.value);
   keyed.set(task.id,{value:select.value,matched:result.matched});
   feedback.textContent=result.explanation;
  });
  const nav=el('div','','u35-actions');
  const prev=button('Previous decision',()=>{activeCheck--;renderChecks();});
  const next=button('Next decision',()=>{activeCheck++;renderChecks();});
  prev.disabled=activeCheck===0;next.disabled=activeCheck===source.decisions.length-1;
  nav.append(prev,next);
  form.append(label,check,feedback);
  decisionContent.append(form,evidenceFor(task.sourceLocators,'Reveal historical source witnesses'),nav);
 };
 const renderGenre=()=>{
  genreNav.replaceChildren();genreContent.replaceChildren();
  for(const [value,label] of GENRES){
   const b=button(label,()=>{activeGenre=value;renderGenre();});
   if(activeGenre===value)b.setAttribute('aria-current','step');
   genreNav.append(b);
  }
  const descriptor=GENRES.find(([v])=>v===activeGenre)!;
  genreContent.append(el('h5',descriptor[1]),el('p',descriptor[2],'u35-instruction'),
   el('p','Adapt facts responsibly across genres. Source changes must be evidenced, not invented.','u35-caveat'));
  const plan=el('details','','u35-scaffold');
  plan.append(el('summary','Optional audience-specific outline'));
  const list=el('ol');
  for(const instruction of [
   'Identify the source and who made each statement.',
   'Adapt salutation, register, voice and length for this audience.',
   'State a genuine fact, a fair contrary concern and an uncertainty.',
   'Request verification or a proportionate next step without inventing approval.'
  ])list.append(el('li',instruction));
  plan.append(list);genreContent.append(plan);
  if(source.pairs.length){
   const pair=source.pairs[0];
   genreContent.append(evidenceFor([pair.first,pair.second],'Recheck real sources for this genre'));
  }else genreContent.append(evidenceFor(source.steps[0].sourceLocators,'Recheck original source'));
  writingControls('genre:'+activeGenre,'professional',genreContent,genreNotes,activeGenre);
 };
 const renderExits=()=>{
  const row=el('div','','u35-actions');
  if(opts.onOpenSurface){
   for(const [surface,label,eligible] of [
    ['course','Original Course',true],['speak','Original Speak',true],
    ['listen','Original Listen',true],
    ['read','Original connected Read',source.witnesses.some(w=>w.kind==='reading')],
    ['write','Original Write',true]
   ] as const){
    if(eligible)row.append(button(label,()=>opts.onOpenSurface?.(surface,id)));
   }
  }
  if(opts.onNativeReview)row.append(button('Native scheduled Review',()=>opts.onNativeReview?.()));
  exits.append(row,el('p','All handoffs preserve original U23 identity and U34/U33 owner-controlled navigation. Temporary essays are never transferred.','u35-caveat'));
 };
 const cleanup=()=>{
  if(disposed)return;disposed=true;
  opts.signal.removeEventListener('abort',cleanup);
  stopU36();
  drafts.clear();comparisonDrafts.clear();keyed.clear();genreNotes.clear();root.remove();
 };
 opts.signal.addEventListener('abort',cleanup,{once:true});
 renderStages();renderPairs();renderChecks();renderGenre();renderExits();
 status.textContent='Original evidence and independent writing activities are available. No official results or persistent drafts are created.';
 return cleanup;
}
