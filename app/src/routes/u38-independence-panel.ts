import {
 originalU38Independence,assessU38AuthoredChoice,
 type U38Role,type U38Artifact,type U38Turn
} from '../core/unified/u38-independence.ts';
import type {U37Register} from '../core/unified/u37-communication.ts';
import type {OriginalSurface} from '../core/unified/u23-registry.ts';
import './u38-independence-panel.css';

interface Options{
 readonly signal:AbortSignal;
 readonly onPrivateChange?:(unsent:boolean)=>void;
 readonly onOpenSurface?:(surface:OriginalSurface,id:string)=>void;
 readonly onNativeReview?:()=>void;
}
type Draft={first:string;second:string;captured:string;register:U37Register};
type EvidenceNote={claim:string;unproven:string};
const empty=(register:U37Register):Draft=>({first:'',second:'',captured:'',register});
function el<K extends keyof HTMLElementTagNameMap>(tag:K,text='',cls=''):HTMLElementTagNameMap[K]{
 const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;
}
function button(text:string,click:()=>void,primary=false):HTMLButtonElement{
 const b=el('button',text,primary?'primary-action compact-action':'secondary-action compact-action');
 b.type='button';b.addEventListener('click',click);return b;
}
const REGISTERS:readonly [U37Register,string][]=[
 ['familiar','Familiar · tu only if the social relation warrants it'],
 ['professional','Professional · vous, precise and polite'],
 ['public','Public audience · inclusive, neutral and source qualified']
];

/** All U38 writing is ephemeral and owned by the already mounted U37 workspace.
 * No microphone, IndexedDB, storage, account mutations, native ratings or cache. */
export function appendOriginalU38Independence(host:HTMLElement,id:string,opts:Options):()=>void{
 const lesson=originalU38Independence(id);
 if(!lesson)return()=>{};
 const root=el('section','','u38-independence');
 root.dataset.hasPrivateDraft='false';
 root.setAttribute('aria-label','Independent original-source French negotiation studio');
 const disclosure=el('details','','u38-disclosure');
 disclosure.append(el('summary','U38 · Multi-participant independence and repair studio'));
 const body=el('div','','u38-body');disclosure.append(body);root.append(disclosure);host.append(root);
 const header=el('header','','u38-header');
 header.append(el('p','SOURCE-QUALIFIED FRENCH COMMUNICATION','eyebrow'),
  el('h3',lesson.title),
  el('p',lesson.level+' · '+lesson.qualifiedSourceId+' · revision '+lesson.revision,'u38-meta'),
  el('p','Six role-based conversation turns and four independent communication outputs. All participants, prompts and illustrated answers are NEW teaching fiction, distinct from historical original witness cards. No recorded speech, automated oral grades or persistent learner drafts.','u38-caveat'));
 if(!lesson.curated)header.append(el('p',
  'General source-aware U38 framework: this original lesson does not have a separately authored specialist case.','u38-caveat'));
 const witnessLibrary=el('details','','u38-evidence');
 witnessLibrary.append(el('summary','Original historical French source witnesses and identities'));
 const libraryBody=el('div','','u38-witness-grid');witnessLibrary.append(libraryBody);
 const caseIntro=el('section','','u38-casefile');
 caseIntro.append(el('h4','Source-bound case notes'));
 const notePicker=el('label','Choose the original witness to analyse','u38-label');
 const noteSelect=el('select');noteSelect.setAttribute('aria-label','Select genuine source witness');
 for(const w of lesson.sourceWitnesses){
  const opt=el('option',w.label);opt.value=w.locator;noteSelect.append(opt);
 }
 notePicker.append(noteSelect);
 const notesArea=el('div','','u38-notes-area');
 caseIntro.append(el('p','Your own source interpretation is not a certified fact. Record a source-supported assertion and a limitation for each ORIGINAL witness.','u38-caveat'),notePicker,notesArea);
 const conversation=el('section','','u38-conversation');
 conversation.append(el('h4','Six-turn, multi-participant practical negotiation'));
 const roleNav=el('nav','','u38-navigation');
 roleNav.setAttribute('aria-label','Navigate fictional participants and negotiation turns');
 const rolePane=el('article','','u38-role-pane');
 conversation.append(roleNav,rolePane);
 const decisions=el('section','','u38-decisions');
 decisions.append(el('h4','Source-aware grammar, register and evidence decisions'));
 const decisionPane=el('div','','u38-decision-pane');
 decisions.append(decisionPane);
 const artifacts=el('section','','u38-artifacts');
 artifacts.append(el('h4','Four independent real-world French communication outputs'));
 const artifactNav=el('nav','','u38-navigation');artifactNav.setAttribute('aria-label','Communication artifact types');
 const artifactPane=el('article','','u38-artifact-pane');
 artifacts.append(artifactNav,artifactPane);
 const record=el('section','','u38-record');
 record.append(el('h4','Review your page-local conversation record'));
 const recordPane=el('div','','u38-record-pane');
 record.append(recordPane);
 const handoffs=el('section','','u38-handoffs');
 handoffs.append(el('h4','Original Course, Listen, Speak, Read, Write and scheduled Review'));
 const status=el('p','','u38-status');status.setAttribute('role','status');
 body.append(header,witnessLibrary,caseIntro,conversation,decisions,artifacts,record,handoffs,status);
 let activeRole=0,activeArtifact:U38Artifact='clarification',activeDecision=0,disposed=false;
 const roleDrafts=new Map<U38Role,Draft>();
 const artifactDrafts=new Map<U38Artifact,Draft>();
 const evidenceNotes=new Map<string,EvidenceNote>();
 const answered=new Map<string,string>();
 const supportLevels=new Map<U38Role,number>();
 const saidAloud=new Set<U38Role>();
 const hasPrivate=()=>{
  const draft=[...roleDrafts.values(),...artifactDrafts.values()]
   .some(x=>x.first.trim()!==''||x.second.trim()!=='');
  const notes=[...evidenceNotes.values()].some(x=>x.claim.trim()!==''||x.unproven.trim()!=='');
  return draft||notes;
 };
 const notify=()=>{
  if(disposed)return;
  const present=hasPrivate();root.dataset.hasPrivateDraft=String(present);
  opts.onPrivateChange?.(present);
 };
 const witnessCard=(locator:string)=>{
  const w=lesson.sourceWitnesses.find(x=>x.locator===locator);
  if(!w)return null;
  const card=el('article','','u38-witness');
  card.append(el('h5',w.label),
   el('p',w.kind==='dialogue'?'Original authored French dialogue text · not human voice recording':
    w.kind==='reading'?'Original connected reading':
    'Separately attributed original written document','u38-meta'));
  const fr=el('p',w.french,'u38-french');fr.lang='fr';card.append(fr);
  if(w.explanation)card.append(el('p','Original English gloss/context: '+w.explanation,'u38-meta'));
  card.append(el('p',w.qualifiedSourceId+' · '+w.sourceRevision,'u38-meta'));
  return card;
 };
 const cite=(locators:readonly string[],label:string)=>{
  const d=el('details','','u38-evidence');d.append(el('summary',label));
  const grid=el('div','','u38-witness-grid');
  for(const loc of locators){const card=witnessCard(loc);if(card)grid.append(card);}
  d.append(grid);return d;
 };
 for(const witness of lesson.sourceWitnesses){
  const card=witnessCard(witness.locator);if(card)libraryBody.append(card);
 }
 const renderNotes=()=>{
  notesArea.replaceChildren();
  const locator=noteSelect.value,w=lesson.sourceWitnesses.find(x=>x.locator===locator);
  if(!w)return;
  const saved=evidenceNotes.get(locator)??{claim:'',unproven:''};
  notesArea.append(cite([locator],'Open exact original French text for this witness'));
  const claimLabel=el('label','French statement genuinely anchored in this specific witness','u38-label');
  const claim=el('textarea');claim.lang='fr';claim.rows=3;claim.maxLength=5000;
  claim.value=saved.claim;claimLabel.append(claim);
  const uncertaintyLabel=el('label','What remains uncertain or cannot be inferred from this witness','u38-label');
  const unproven=el('textarea');unproven.lang='fr';unproven.rows=3;unproven.maxLength=5000;
  unproven.value=saved.unproven;uncertaintyLabel.append(unproven);
  const update=()=>{evidenceNotes.set(locator,{claim:claim.value,unproven:unproven.value});notify();};
  claim.addEventListener('input',update);unproven.addEventListener('input',update);
  const actions=el('div','','u38-actions');
  actions.append(button('Discard only this witness note',()=>{
   if((claim.value.trim()||unproven.value.trim())&&
      !window.confirm('Discard these page-local source notes?'))return;
   evidenceNotes.delete(locator);renderNotes();notify();
  }));
  notesArea.append(claimLabel,uncertaintyLabel,actions);
 };
 noteSelect.addEventListener('change',renderNotes);

 const editable=(store:Map<U38Role,Draft>|Map<U38Artifact,Draft>,key:U38Role|U38Artifact,
  register:U37Register,parent:HTMLElement,scaffolding:HTMLElement,label:string)=>{
  // Both stores are page-local and keyed by the original U38 turn or artifact.
  const get=():Draft=>{
   if(key==='requester'||key==='coordinator'||key==='concerned-party'||key==='mediator'||
      key==='fact-checker'||key==='audience')
    return roleDrafts.get(key)??empty(register);
   return artifactDrafts.get(key as U38Artifact)??empty(register);
  };
  const put=(state:Draft)=>{
   if(key==='requester'||key==='coordinator'||key==='concerned-party'||key==='mediator'||
      key==='fact-checker'||key==='audience')roleDrafts.set(key,state);
   else artifactDrafts.set(key as U38Artifact,state);
   notify();
  };
  const remove=()=>{
   if(key==='requester'||key==='coordinator'||key==='concerned-party'||key==='mediator'||
      key==='fact-checker'||key==='audience')roleDrafts.delete(key);
   else artifactDrafts.delete(key as U38Artifact);
   notify();
  };
  const state=get();
  const registerLabel=el('label','Recipient-appropriate register','u38-label');
  const registerSelect=el('select');registerSelect.setAttribute('aria-label','Communication audience register');
  for(const [k,text] of REGISTERS){const o=el('option',text);o.value=k;registerSelect.append(o);}
  registerSelect.value=state.register;
  registerSelect.addEventListener('change',()=>put({...get(),register:registerSelect.value as U37Register}));
  registerLabel.append(registerSelect);
  const firstLabel=el('label','My first independently written French response','u38-label');
  const first=el('textarea');first.rows=7;first.maxLength=15000;first.lang='fr';
  first.value=state.first;first.setAttribute('aria-label','First '+label+' French draft');firstLabel.append(first);
  const secondLabel=el('label','Unassisted French reply · first attempt and scaffolding hidden','u38-label');
  const second=el('textarea');second.rows=7;second.maxLength=15000;second.lang='fr';
  second.value=state.second;second.setAttribute('aria-label','Independent second '+label+' French draft');
  secondLabel.append(second);secondLabel.hidden=true;
  first.addEventListener('input',()=>{put({...get(),first:first.value});renderRecord();});
  second.addEventListener('input',()=>{put({...get(),second:second.value});renderRecord();});
  const liveText=el('p','','u38-status');liveText.setAttribute('role','status');
  const comparison=el('div','','u38-comparison');comparison.hidden=true;
  const actions=el('div','','u38-actions');
  actions.append(
   button('Capture this version in this page',()=>{
    if(!first.value.trim()){liveText.textContent='Write a first version before capturing it.';return;}
    put({...get(),captured:first.value});liveText.textContent='First version captured locally, not sent or graded.';
   }),
   button('Produce an independent second version',()=>{
    firstLabel.hidden=true;scaffolding.hidden=true;secondLabel.hidden=false;second.focus();
    liveText.textContent='Earlier words and model hidden. Original source evidence can be opened separately.';
   },true),
   button('Return to first draft and original supports',()=>{
    secondLabel.hidden=true;firstLabel.hidden=false;scaffolding.hidden=false;first.focus();
   }),
   button('Review my own changes',()=>{
    if(!get().captured){liveText.textContent='Capture a first draft before comparing.';return;}
    comparison.replaceChildren();
    for(const [title,value] of [
     ['Captured draft',get().captured],['Edited current draft',first.value],
     ['New independent draft',second.value||'(not yet written)']
    ])comparison.append(el('h5',title),el('p',value,'u38-french'));
    comparison.append(el('p','Self-review clarity, source identity, fairness, register, negation and unresolved confirmation. No automatic writing-quality grade.','u38-caveat'));
    comparison.hidden=false;
   }),
   button('Discard this activity’s drafts',()=>{
    if((first.value.trim()||second.value.trim())&&
       !window.confirm('Discard only these local French drafts?'))return;
    remove();first.value='';second.value='';comparison.hidden=true;renderRecord();
    liveText.textContent='This activity was cleared; other page-local work remains.';
   })
  );
  parent.append(registerLabel,firstLabel,secondLabel,actions,liveText,comparison);
 };

 const renderRoles=(focus=false)=>{
  roleNav.replaceChildren();rolePane.replaceChildren();
  for(const [i,turn] of lesson.turns.entries()){
   const b=button((i+1)+'. '+turn.role,()=>{activeRole=i;renderRoles(true);});
   if(i===activeRole)b.setAttribute('aria-current','step');roleNav.append(b);
  }
  const turn=lesson.turns[activeRole];
  const heading=el('h5',turn.title);heading.tabIndex=-1;
  const quote=el('blockquote','','u38-quote');
  const line=el('p',turn.fictionalLine,'u38-french');line.lang='fr';
  quote.append(line,el('p',turn.roleDescription+' — FICTIONAL U38 interlocutor','u38-meta'));
  const task=el('p',turn.independentTask,'u38-instruction');
  const scaffolding=el('div','','u38-guidance');
  const sourceHint=el('p',turn.misconception,'u38-caveat');
  const exact=el('div','','u38-witness-grid');
  const example=el('p',turn.modeledReply,'u38-french');example.lang='fr';
  scaffolding.append(sourceHint,exact,example);
  const paintSupport=(level:number)=>{
   supportLevels.set(turn.role,Math.max(level,supportLevels.get(turn.role)??0));
   const n=supportLevels.get(turn.role)??0;
   sourceHint.hidden=n<1;exact.hidden=n<2;example.hidden=n<3;
   exact.replaceChildren();
   if(n>=2)for(const loc of turn.sourceLocators){
    const c=witnessCard(loc);if(c)exact.append(c);
   }
  };
  const helpButtons=el('div','','u38-actions');
  helpButtons.append(button('1 · Source-specific communication hint',()=>paintSupport(1)),
   button('2 · Authentic historical evidence',()=>paintSupport(2)),
   button('3 · New authored French illustration',()=>paintSupport(3)));
  rolePane.append(heading,quote,task,helpButtons,scaffolding);
  paintSupport(supportLevels.get(turn.role)??0);
  editable(roleDrafts,turn.role,turn.register,rolePane,scaffolding,turn.role);
  rolePane.append(cite(turn.sourceLocators,'Original source evidence, separate from fictional dialogue'));
  const spoken=el('div','','u38-actions');
  const report=el('p','','u38-status');report.setAttribute('role','status');
  spoken.append(button('I rehearsed my reply aloud · unverified self-report',()=>{
   saidAloud.add(turn.role);
   report.textContent='Self-reported unrecorded practice only; no speech capture or pronunciation result.';
  }),report);
  const review=el('ul','','u38-checklist');
  for(const item of [
   'I distinguished actual original evidence from U38 fictional requests.',
   'I addressed this participant’s concern without inventing agreement.',
   'My French negation and level of certainty preserve historical meaning.',
   'I named the real next step and who would need to confirm it.'
  ])review.append(el('li',item));
  const navigate=el('div','','u38-actions');
  const prev=button('← Previous role',()=>{activeRole--;renderRoles(true);});
  const next=button('Next role →',()=>{activeRole++;renderRoles(true);},true);
  prev.disabled=activeRole===0;next.disabled=activeRole===lesson.turns.length-1;
  navigate.append(prev,next);
  rolePane.append(spoken,review,navigate);
  if(focus)heading.focus({preventScroll:true});
 };
 const renderDecisions=()=>{
  decisionPane.replaceChildren();
  if(!lesson.choices.length){
   decisionPane.append(el('p','No authored U38 keyed problems for this general original lesson. Open production remains self-reviewed.','u38-caveat'));return;
  }
  activeDecision=Math.max(0,Math.min(activeDecision,lesson.choices.length-1));
  const item=lesson.choices[activeDecision];
  const form=el('form','','u38-check-form');
  form.append(el('p','Authored source decision '+(activeDecision+1)+' / '+lesson.choices.length,'u38-meta'),
   el('h5',item.question));
  const label=el('label','Compare one original-source-aware choice','u38-label');
  const select=el('select');select.setAttribute('aria-label','Source-anchored communication decision');
  const blank=el('option','Select an option');blank.value='';select.append(blank);
  for(const option of item.choices){const o=el('option',option);o.value=option;select.append(o);}
  const previous=answered.get(item.id);if(previous)select.value=previous;
  label.append(select);
  const feedback=el('p',previous?assessU38AuthoredChoice(item,previous).feedback:'','u38-status');
  feedback.setAttribute('role','status');
  const check=el('button','Compare against authored text key','primary-action compact-action');check.type='submit';
  form.addEventListener('submit',event=>{
   event.preventDefault();if(!select.value){feedback.textContent='Choose one response.';return;}
   answered.set(item.id,select.value);
   feedback.textContent=assessU38AuthoredChoice(item,select.value).feedback;
  });
  select.addEventListener('change',()=>{feedback.textContent='Choice changed; check the new answer for its own feedback.';});
  form.append(label,check,feedback);
  const actions=el('div','','u38-actions');
  const prev=button('Previous decision',()=>{activeDecision--;renderDecisions();});
  const next=button('Next decision',()=>{activeDecision++;renderDecisions();});
  prev.disabled=activeDecision===0;next.disabled=activeDecision===lesson.choices.length-1;
  actions.append(prev,next);
  decisionPane.append(form,cite(item.sourceLocators,'See original source evidence'),actions);
 };
 const renderArtifacts=()=>{
  artifactNav.replaceChildren();artifactPane.replaceChildren();
  for(const task of lesson.artifacts){
   const b=button(task.title,()=>{activeArtifact=task.kind;renderArtifacts();});
   if(task.kind===activeArtifact)b.setAttribute('aria-current','step');
   artifactNav.append(b);
  }
  const task=lesson.artifacts.find(t=>t.kind===activeArtifact);
  if(!task)return;
  artifactPane.append(el('h5',task.title),
   el('p','Recipient: '+task.recipient,'u38-meta'),
   el('p',task.instruction,'u38-instruction'));
  const helper=el('div','','u38-guidance');
  const outline=el('details','','u38-evidence');
  outline.append(el('summary','Optional authentic genre outline'));
  const list=el('ol','','u38-checklist');for(const item of task.outline)list.append(el('li',item));
  outline.append(list);
  const example=el('details','','u38-evidence');
  example.append(el('summary','Show a new U38 illustrative response (not historical)'));
  const model=el('p',task.illustrativeFrench,'u38-french');model.lang='fr';example.append(model);
  helper.append(outline,example);
  artifactPane.append(helper);
  editable(artifactDrafts,task.kind,'professional',artifactPane,helper,task.kind);
  artifactPane.append(cite(task.sourceLocators,'Original witnesses relevant to this document'));
 };
 const renderRecord=()=>{
  recordPane.replaceChildren();
  recordPane.append(el('p','This is an ephemeral view of your own page-local responses. Fictional participants remain explicitly separate from original documents.','u38-caveat'));
  for(const turn of lesson.turns){
   const draft=roleDrafts.get(turn.role);
   if(!draft?.first.trim()&&!draft?.second.trim())continue;
   const section=el('article','','u38-record-entry');
   section.append(el('h5','Practice role: '+turn.role+' · fictional U38 interaction'));
   const response=el('p',draft.second.trim()||draft.first,'u38-french');response.lang='fr';
   section.append(response,el('p','Original source locators: '+turn.sourceLocators.join(' ; '),'u38-meta'));
   recordPane.append(section);
  }
  for(const task of lesson.artifacts){
   const draft=artifactDrafts.get(task.kind);
   if(!draft?.first.trim()&&!draft?.second.trim())continue;
   const section=el('article','','u38-record-entry');
   section.append(el('h5','Independent communication output: '+task.title));
   const response=el('p',draft.second.trim()||draft.first,'u38-french');response.lang='fr';
   section.append(response);recordPane.append(section);
  }
  if(recordPane.children.length===1)recordPane.append(el('p','Your conversation record will appear here after you write in a role or artifact.','u38-caveat'));
 };
 const renderHandoffs=()=>{
  const row=el('div','','u38-actions');
  if(opts.onOpenSurface){
   const links:readonly [OriginalSurface,string,boolean][]=[
    ['course','Original Course',true],['listen','Original Listen',true],
    ['speak','Original Speak',true],['read','Original connected Read',lesson.availableRead],
    ['write','Original Write',true]
   ];
   for(const [surface,label,available] of links){
    if(available)row.append(button(label,()=>opts.onOpenSurface?.(surface,id)));
   }
  }
  if(opts.onNativeReview)row.append(button('Native scheduled Review',()=>opts.onNativeReview?.()));
  handoffs.append(row,el('p','The existing U37→U36→U35→U34→U33 unsent-work guard governs exits. Handoffs transfer only the original historical lesson identity; private drafts and fictional grades are never submitted.','u38-caveat'));
 };
 const cleanup=()=>{
  if(disposed)return;disposed=true;
  opts.signal.removeEventListener('abort',cleanup);
  roleDrafts.clear();artifactDrafts.clear();evidenceNotes.clear();
  answered.clear();supportLevels.clear();saidAloud.clear();root.remove();
 };
 opts.signal.addEventListener('abort',cleanup,{once:true});
 renderNotes();renderRoles();renderDecisions();renderArtifacts();renderRecord();renderHandoffs();
 status.textContent='Source-grounded U38 scenario available. This lesson has no new Account, scheduler or CEFR mastery writer.';
 return cleanup;
}
