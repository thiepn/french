import {
 originalU31OralJourney,evaluateU31Decision,type U31Stage
} from '../core/unified/u31-oral.ts';
import {
 browseOriginalMaterials,getOriginalCatalogEntry,handoffOriginalLesson,takeOriginalHandoff,
 type OriginalLevel,type OriginalSurface
} from '../core/unified/u23-registry.ts';
import type {RouteId} from '../core/types.ts';
import './u31-oral-panel.css';

export type U31Mode='course'|'speak'|'listen'|'read'|'write';
interface JourneyOptions{
 readonly mode:U31Mode;readonly signal:AbortSignal;
 readonly parentHandlesDraftExit?:boolean;
 readonly onOpenSurface?:(surface:OriginalSurface,id:string)=>void;
 readonly onNativeReview?:()=>void;
}
const STAGE_LABELS:Readonly<Record<U31Stage,string>>={
 position:'Position',respond:'Response',challenge:'Objection',repair:'Repair',
 justify:'Evidence',sustain:'Extended speech',transfer:'Independent transfer'
};
function el<K extends keyof HTMLElementTagNameMap>(tag:K,text='',cls=''):HTMLElementTagNameMap[K]{
 const node=document.createElement(tag);
 if(text)node.textContent=text;if(cls)node.className=cls;
 return node;
}
function action(text:string,fn:()=>void,primary=false):HTMLButtonElement{
 const b=el('button',text,primary?'primary-action compact-action':'secondary-action compact-action');
 b.type='button';b.addEventListener('click',fn);return b;
}
function paragraphFrench(text:string,cls='u31-french'):HTMLParagraphElement{
 const p=el('p',text,cls);p.lang='fr';return p;
}
function checkExit(root:HTMLElement):boolean{
 if(root.dataset.hasPrivateDraft!=='true')return true;
 return window.confirm('Your unsaved U31 French oral-preparation notes are private and temporary. Leave and discard all drafts?');
}
/** Source-driven oral rehearsal. No microphone, speech grading, learner-store writes or fake achievements. */
export function appendOriginalOralJourney(host:HTMLElement,lessonId:string,opts:JourneyOptions):()=>void{
 const journey=originalU31OralJourney(lessonId);
 if(!journey)return()=>{};
 const root=el('section','','u31-oral');
 root.setAttribute('aria-label','Independent original French oral production and repair');
 root.dataset.hasPrivateDraft='false';
 const detail=el('details','','u31-disclosure');
 detail.open=opts.mode==='speak';
 detail.append(el('summary','U31 · Independent speaking, objections and repair · 7 connected stages'));
 const body=el('div','','u31-body');detail.append(body);root.append(detail);host.append(root);
 const head=el('header','','u31-heading');
 head.append(el('p','ORIGINAL SOURCE · ORAL LAB','eyebrow'),
  el('h3',journey.scenarioTitle),
  el('p',journey.level+' · '+journey.qualifiedId+' · source revision '+journey.sourceRevision,'u31-provenance'),
  el('p','Source-owned dialogue and keyed micro-decisions; new objections are openly hypothetical. Compose and rehearse your own French answers. No recorded speech, recognition, automatic grammar/proficiency grade, stored attempt or scheduled review modification.','u31-notice'));
 if(!journey.curated)head.append(el('p','General oral framework for this original lesson; there is no separately authored U31 source-specific case.','u31-notice'));
 const context=el('div','','u31-context');
 context.append(el('p','Register: '+journey.desiredRegister),
  el('p','Original participants: '+journey.speakerNames.join(', ')),
  el('p','Linked U30 original listening decisions: '+journey.u30DecisionCount+' (separate ungraded workflow).'));
 const stageNav=el('nav','','u31-stage-nav');
 stageNav.setAttribute('aria-label','Speaking journey stages');
 const stage=el('article','','u31-stage');
 const counter=el('p','','u31-progress');counter.setAttribute('role','status');
 const stageTitle=el('h4');stageTitle.tabIndex=-1;
 const task=el('p','','u31-task');
 const sourcePreview=el('div','','u31-source-preview');
 const repairHint=el('p','','u31-repair');
 const hint=el('p','','u31-hint');hint.hidden=true;
 const supportLabel=el('p','','u31-support-state');supportLabel.setAttribute('role','status');
 const supportControls=el('div','','u31-support-controls');
 const sourceTurn=el('div','','u31-source-turn');sourceTurn.hidden=true;
 const sourceFull=el('div','','u31-source-full');sourceFull.hidden=true;
 const quote=el('details','','u31-source-list');
 quote.append(el('summary','Browse historical French dialogue and English explanations (source reference)'));
 const transcript=el('ol','','u31-transcript');
 journey.dialogue.forEach((line,i)=>{
  const li=el('li');
  li.append(el('strong','Turn '+(i+1)+' · '+line.speaker+': '),paragraphFrench(line.fr),
   el('p','Original English explanation: '+line.en,'u31-original-gloss'));
  transcript.append(li);
 });
 quote.append(transcript);
 if(journey.reading){
  const linked=el('details','','u31-linked-reading');
  linked.append(el('summary','Original connected reading · '+journey.reading.title+' (separate written text)'));
  for(const paragraph of journey.reading.text.split(/\n\s*\n/)){
   if(paragraph.trim())linked.append(paragraphFrench(paragraph.trim()));
  }
  quote.append(linked);
 }
 if(journey.documents.length){
  const docs=el('details','','u31-documents');
  docs.append(el('summary','Independent original written documents · not recorded dialogue'));
  for(const doc of journey.documents){
   const box=el('article','','u31-document');
   box.append(el('h5',doc.label+' · '+doc.type),paragraphFrench(doc.french));
   docs.append(box);
  }
  quote.append(docs);
 }
 if(journey.lexicalWitnesses.length){
  const lex=el('details','','u31-lexical');
  lex.append(el('summary','U28 attested vocabulary in these original dialogue turns'));
  const ul=el('ul');
  for(const word of journey.lexicalWitnesses){
   const row=el('li');
   row.append(el('strong',word.french+' — '+word.english),paragraphFrench(word.originalContext));
   ul.append(row);
  }
  lex.append(ul);quote.append(lex);
 }
 const rehearsal=el('div','','u31-rehearsal');
 const draftLabel=el('label','Private French speaking outline / written rehearsal · this page only','u31-private-draft');
 const draft=el('textarea');draft.rows=5;draft.spellcheck=true;
 draft.placeholder='Je comprends votre point de vue. Cependant… Selon le dialogue… Pour préciser…';
 draft.setAttribute('aria-label','Private French oral rehearsal text');
 draftLabel.append(draft);
 const oralActions=el('div','','u31-oral-actions');
 const checklist=el('fieldset','','u31-checklist');
 const legend=el('legend','Self-review — check only what you actually rehearsed');
 checklist.append(legend);
 const rehearsalStatus=el('p','','u31-rehearsal-status');rehearsalStatus.setAttribute('role','status');
 const model=el('div','','u31-oral-model');model.hidden=true;
 if(journey.oral?.prompt){
  model.append(el('h5','Historical original oral prompt'),el('p',journey.oral.prompt));
  const steps=el('ol');for(const x of journey.oral.plan??[])steps.append(el('li',x));
  model.append(steps);
  if(journey.oral.model)model.append(paragraphFrench(journey.oral.model));
 }else{
  model.append(el('p','No original authored oral-response model is published for this lesson. Refer to the original dialogue rather than inventing one.'));
 }
 const modelAction=action('Reveal original oral model / speaking guide',()=>{
  model.hidden=!model.hidden;
  modelAction.setAttribute('aria-expanded',String(!model.hidden));
  modelAction.textContent=model.hidden?'Reveal original oral model / speaking guide':'Hide oral model / guide';
  support=Math.max(support,3);drawSupport();
 });
 modelAction.setAttribute('aria-expanded','false');
 const challenges=el('section','','u31-choices');
 const choiceTitle=el('h4','Source-backed decisions before free production');
 const choiceNote=el('p','These are authored keyed comprehension/repair choices, not grades for your spoken response. An original quoted turn is source evidence; constructed replies are illustrative, not archival transcripts.','u31-notice');
 const question=el('div','','u31-decision');
 const questionNav=el('div','','u31-decision-nav');
 const outcomes=el('p','','u31-choice-outcome');outcomes.setAttribute('role','status');
 challenges.append(choiceTitle,choiceNote,question,questionNav,outcomes);
 const transfer=el('section','','u31-transfer');
 transfer.append(el('h4','Transfer to the original lesson, not a new progress engine'));
 if(journey.writingChoices?.fromListening){
  transfer.append(el('p','Original listening-to-writing assignment: '+journey.writingChoices.fromListening.prompt,'u31-notice'));
 }
 if(journey.writingChoices?.fromDebate){
  transfer.append(el('p','Original independent argument assignment: '+journey.writingChoices.fromDebate.prompt,'u31-notice'));
 }
 if(journey.reading){
  transfer.append(el('p','Original reading counterpart: '+journey.reading.title+'. Compare what the written passage establishes with what each dialogue participant actually says.','u31-notice'));
 }
 const transferActions=el('div','','u31-transfer-actions');
 if(opts.onOpenSurface){
  const links:readonly [OriginalSurface,string,boolean][]=[
   ['course','Return to this original Course lesson',true],
   ['listen','Revisit original Listen and U30 evidence',true],
   ['read','Read the original connected text',!!journey.reading],
   ['write','Continue to original source-grounded writing',true],
   ['speak','Open independent Speak workspace',true]
  ];
  for(const [surface,label,available] of links){
   if(!available||surface===opts.mode)continue;
   transferActions.append(action(label,()=>{
    if(!opts.parentHandlesDraftExit&&!checkExit(root))return;
    opts.onOpenSurface?.(surface,journey.lessonId);
   }));
  }
 }
 if(opts.onNativeReview)transferActions.append(action('Open existing scheduled Review',()=>{
  if(!opts.parentHandlesDraftExit&&!checkExit(root))return;opts.onNativeReview?.();
 }));
 transfer.append(transferActions,
  el('p','All transfers preserve the original source identity. Revisiting a route is not a completed Practice session or review grade.','u31-notice'));
 body.append(head,context,stageNav,counter,stage,challenges,quote,transfer);
 let phaseIndex=0,decisionIndex=0,support=0;
 const privateNotes=new Map<U31Stage,string>(),snapshots=new Map<U31Stage,string>();
 const selfReported=new Set<U31Stage>(),checksByStage=new Map<U31Stage,Set<number>>();
 const decisionResponses=new Map<string,{choice:string;supported:boolean}>();
 const onBeforeUnload=(event:BeforeUnloadEvent)=>{
  if(root.dataset.hasPrivateDraft!=='true')return;
  event.preventDefault();event.returnValue='';
 };
 window.addEventListener('beforeunload',onBeforeUnload);
 let disposed=false;
 function noteChange():void{
  privateNotes.set(journey.stages[phaseIndex].id,draft.value);
  root.dataset.hasPrivateDraft=([...privateNotes.values()].some(x=>x.trim())?'true':'false');
 }
 function drawSupport(){
  const phase=journey.stages[phaseIndex],selected=journey.dialogue[phase.sourceTurn];
  supportLabel.textContent=[
   'Support: independent — no source excerpt exposed.',
   'Support: speaking strategy revealed.',
   'Support: original attributed utterance revealed.',
   'Support: original oral guidance or full source consulted.'
  ][support]+' No formal proficiency inference.';
  hint.hidden=support<1;repairHint.hidden=support<1;
  sourceTurn.hidden=support<2;
  sourceFull.hidden=support<3;
  hint.textContent=phase.hint;
  sourceTurn.replaceChildren(el('h5','Attributed original turn '+(phase.sourceTurn+1)),
   el('p',selected.speaker+' · '+selected.en,'u31-original-gloss'),paragraphFrench(selected.fr));
  sourceFull.replaceChildren(el('p','For broader context, compare the actual original dialogue and, where available, the separate original reading.','u31-notice'));
  if(support>=3){
   sourceFull.append(paragraphFrench(journey.dialogue.map(x=>x.speaker+': '+x.fr).join('\n')));
  }
 }
 function selectPhase(i:number,focus=true):void{
  if(i<0||i>=journey.stages.length)return;
  phaseIndex=i;support=0;model.hidden=true;modelAction.setAttribute('aria-expanded','false');modelAction.textContent='Reveal original oral model / speaking guide';
  drawPhase();if(focus)stageTitle.focus({preventScroll:true});
 }
 function drawPhase():void{
  const phase=journey.stages[phaseIndex];
  stageNav.replaceChildren();
  journey.stages.forEach((item,i)=>{
   const b=action((i+1)+'. '+STAGE_LABELS[item.id],()=>selectPhase(i));
   b.setAttribute('aria-current',String(i===phaseIndex?'step':'false'));
   stageNav.append(b);
  });
  counter.textContent='Stage '+(phaseIndex+1)+' / '+journey.stages.length+' · '+selfReported.size+
   ' stages self-reported as spoken (unverified). Private notes are never stored.';
  stage.replaceChildren();
  stageTitle.textContent=phase.title;task.textContent=phase.task;
  repairHint.textContent='Suggested repair after your own attempt: '+phase.repair;
  sourcePreview.replaceChildren(
   el('p','Speaking objective: '+phase.target,'u31-target'),
   repairHint,
   el('p','Original French source context is available below; objections are newly constructed practice prompts.','u31-notice')
  );
  const revealHint=action('1 · Speaking strategy',()=>{support=Math.max(support,1);drawSupport();});
  const revealTurn=action('2 · Source utterance',()=>{support=Math.max(support,2);drawSupport();});
  const revealFull=action('3 · Full source context',()=>{support=Math.max(support,3);drawSupport();});
  const independently=action('Retry independently (hide support)',()=>{
   support=0;drawSupport();model.hidden=true;modelAction.setAttribute('aria-expanded','false');modelAction.textContent='Reveal original oral model / speaking guide';
   draft.focus();rehearsalStatus.textContent='Support hidden. The private draft is retained for self-revision; no independent success is inferred.';
  });
  supportControls.replaceChildren(revealHint,revealTurn,revealFull,independently);
  draft.value=privateNotes.get(phase.id)??'';
  draft.oninput=noteChange;
  const checklistChoices=checksByStage.get(phase.id)??new Set<number>();
  checklist.replaceChildren(legend);
  phase.criteria.forEach((criterion,i)=>{
   const label=el('label','','u31-check-row');
   const box=el('input');box.type='checkbox';box.checked=checklistChoices.has(i);
   box.addEventListener('change',()=>{
    const current=checksByStage.get(phase.id)??new Set<number>();
    if(box.checked)current.add(i);else current.delete(i);
    checksByStage.set(phase.id,current);
   });
   label.append(box,el('span',criterion));checklist.append(label);
  });
  const spoken=action('I rehearsed this step aloud (self-report)',()=>{
   selfReported.add(phase.id);
   rehearsalStatus.textContent='Self-report noted in this page only, not a recording, grade or completion.';
   counter.textContent='Stage '+(phaseIndex+1)+' / '+journey.stages.length+
    ' · '+selfReported.size+' steps self-reported as spoken; no verified performance.';
  });
  const snapshot=action('Keep current draft for revision comparison',()=>{
   if(!draft.value.trim()){
    rehearsalStatus.textContent='Write a preliminary French outline before keeping a comparison snapshot.';return;
   }
   snapshots.set(phase.id,draft.value);
   rehearsalStatus.textContent='Snapshot kept only in this page. Revise the outline and compare below.';
  });
  const compare=action('Compare earlier and revised drafts',()=>{
   const previous=snapshots.get(phase.id);
   if(!previous){rehearsalStatus.textContent='No earlier snapshot exists for this stage.';return;}
   comparison.replaceChildren(
    el('h5','Earlier working version'),paragraphFrench(previous),
    el('h5','Current revised version'),paragraphFrench(draft.value),
    el('p','Identify changes to accuracy, speaker attribution, register, conditions and uncertainty yourself. No semantic assessment has been performed.','u31-notice')
   );
   comparison.hidden=false;
  });
  const clear=action('Clear this stage draft',()=>{
   draft.value='';noteChange();snapshots.delete(phase.id);comparison.hidden=true;
   rehearsalStatus.textContent='This stage draft and revision snapshot cleared; other stage drafts remain private.';
  });
  const comparison=el('div','','u31-revision');comparison.hidden=true;
  const stageActions=el('div','','u31-stage-actions');
  const prev=action('Previous stage',()=>selectPhase(phaseIndex-1));
  const next=action(phaseIndex===journey.stages.length-1?'Return to stage 1':'Next stage →',()=>{
   selectPhase(phaseIndex===journey.stages.length-1?0:phaseIndex+1);
  },true);
  prev.disabled=phaseIndex===0;stageActions.append(prev,next);
  oralActions.replaceChildren(spoken,snapshot,compare,clear);
  rehearsal.replaceChildren(draftLabel,oralActions,checklist,rehearsalStatus,comparison,modelAction,model);
  stage.append(stageTitle,task,sourcePreview,supportControls,supportLabel,hint,sourceTurn,sourceFull,rehearsal,stageActions);
  drawSupport();
 }
 function drawDecision():void{
  const rows=journey.decisions;question.replaceChildren();questionNav.replaceChildren();
  if(!rows.length){challenges.hidden=true;return;}
  const d=rows[decisionIndex];const prior=decisionResponses.get(d.id);
  question.append(el('p','Decision '+(decisionIndex+1)+' / '+rows.length+' · '+d.kind,'u31-choice-index'),el('h5',d.prompt));
  const form=el('form','','u31-choice-form');
  const label=el('label','Choose one source-grounded response');
  const select=el('select');select.setAttribute('aria-label','U31 decision '+d.id);
  const first=el('option','Choose a response');first.value='';select.append(first);
  d.choices.forEach(x=>{const option=el('option',x);option.value=x;select.append(option);});
  label.append(select);
  const feedback=el('p','','u31-feedback');feedback.setAttribute('role','status');
  if(prior){select.value=prior.choice;feedback.textContent=(prior.supported?'Source-supported. ':'Needs correction. ')+evaluateU31Decision(d,prior.choice).feedback;}
  const submit=el('button','Check authored source comparison','primary-action compact-action');submit.type='submit';
  form.addEventListener('submit',event=>{
   event.preventDefault();if(!select.value){feedback.textContent='Select one response.';return;}
   const verdict=evaluateU31Decision(d,select.value);
   decisionResponses.set(d.id,{choice:select.value,supported:verdict.supported});
   feedback.textContent=(verdict.supported?'Source-supported. ':'Needs correction. ')+verdict.feedback+
    ' This choice is NOT an assessment of anything you said aloud.';
   outcomes.textContent=decisionResponses.size+' of '+rows.length+
    ' source questions attempted in page memory; zero native Practice records written.';
  });
  form.append(label,submit,feedback);question.append(form);
  const evidence=el('p','Turn '+(d.citedTurn+1)+' · '+journey.dialogue[d.citedTurn].speaker+': '+d.evidence,'u31-cited');
  evidence.lang='fr';evidence.hidden=true;
  question.append(action('Reveal relevant original turn',()=>{
   evidence.hidden=!evidence.hidden;
  }),evidence);
  const before=action('← Previous decision',()=>{decisionIndex--;drawDecision();});
  const after=action('Next decision →',()=>{decisionIndex++;drawDecision();});
  before.disabled=decisionIndex===0;after.disabled=decisionIndex>=rows.length-1;
  questionNav.append(before,after);
 }
 drawPhase();drawDecision();
 const cleanup=()=>{
  if(disposed)return;disposed=true;
  window.removeEventListener('beforeunload',onBeforeUnload);
  opts.signal.removeEventListener('abort',cleanup);
 };
 opts.signal.addEventListener('abort',cleanup,{once:true});
 return cleanup;
}
/** Uses the original U23 handoff map (navigation only) rather than new storage. */
export function createOriginalOralDiscovery(
 signal:AbortSignal,navigate:(route:RouteId)=>void
):HTMLElement{
 const root=el('section','','u31-discovery');
 root.setAttribute('aria-label','Source-qualified original oral learning');
 root.append(el('p','ORIGINAL COURSE · SPOKEN TRANSFER','eyebrow'),
  el('h2','Independent oral workshop'),
  el('p','Select any original French lesson. Practice speaking, answering objections and repairing misunderstandings without relying on automatic transcription or claimed proficiency.','u31-notice'));
 const filters=el('div','','u31-filters');
 const searchLabel=el('label','Search original lesson');const search=el('input');
 search.type='search';search.placeholder='Lesson topic or vocabulary';searchLabel.append(search);
 const levelLabel=el('label','CEFR teaching range');const level=el('select');
 for(const l of ['all','A1','A2','B1','B1+','Early B2']){
  const op=el('option',l==='all'?'All original levels':l);op.value=l;level.append(op);
 }levelLabel.append(level);
 const lessonLabel=el('label','Original speaking source');const picker=el('select');
 picker.setAttribute('aria-label','Select original French oral source');
 lessonLabel.append(picker);
 const count=el('p','','u31-notice');count.setAttribute('role','status');
 const more=action('Show more original lessons',()=>{visible+=60;refresh();});
 filters.append(searchLabel,levelLabel,lessonLabel,count,more);
 const panel=el('div','','u31-workspace');
 root.append(filters,panel);
 const incoming=takeOriginalHandoff('speak');
 let selected=incoming?.id??'a1-01',visible=60,dispose:()=>void=()=>{};
 const route=(surface:OriginalSurface,id:string)=>{
  if(surface==='speak'){selected=id;refresh();return;}
  if(handoffOriginalLesson(surface,id,surface==='course'?'listen':undefined))
   navigate(surface);
 };
 function draw():void{
  dispose();panel.replaceChildren();
  if(!getOriginalCatalogEntry(selected)){panel.append(el('p','No original lesson selected.'));return;}
  dispose=appendOriginalOralJourney(panel,selected,{
   mode:'speak',signal,onOpenSurface:route,onNativeReview:()=>navigate('review')
  });
 }
 function refresh():void{
  const found=browseOriginalMaterials({
   query:search.value,level:level.value as OriginalLevel|'all',material:'listening',limit:visible
  });
  const entries=[...found.entries],pinned=getOriginalCatalogEntry(selected);
  if(pinned?.listening&&!entries.some(x=>x.id===selected)&&!search.value&&level.value==='all')entries.unshift(pinned);
  picker.replaceChildren();
  for(const row of entries){
   const option=el('option',row.level+' · '+row.id+' · '+row.title);option.value=row.id;picker.append(option);
  }
  if(!entries.some(x=>x.id===selected))selected=entries[0]?.id??'';
  picker.value=selected;
  count.textContent=found.total+' source-qualified original dialogues · '+entries.length+' displayed.';
  more.hidden=found.total<=entries.length||visible>=found.total;
  draw();
 }
 function allowSwitch():boolean{
  const oral=panel.querySelector<HTMLElement>('.u31-oral');
  return !oral||checkExit(oral);
 }
 search.addEventListener('input',()=>{
  if(!allowSwitch()){search.value='';return;}visible=60;refresh();
 });
 level.addEventListener('change',()=>{
  if(!allowSwitch()){level.value='all';return;}visible=60;refresh();
 });
 picker.addEventListener('change',()=>{
  if(!allowSwitch()){picker.value=selected;return;}selected=picker.value;draw();
 });
 const cleanup=()=>dispose();
 signal.addEventListener('abort',cleanup,{once:true});
 refresh();
 return root;
}
