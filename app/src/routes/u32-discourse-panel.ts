import {
 originalU32Discourse,evaluateU32Decision,
 type U32Witness,type U32Turn,type U32Decision
} from '../core/unified/u32-discourse.ts';
import type {OriginalSurface} from '../core/unified/u23-registry.ts';
import {appendOriginalEditorialJourney} from './u33-editorial-panel.ts';
import './u32-discourse-panel.css';

interface Options{
 readonly signal:AbortSignal;
 readonly onPrivateChange?:(hasDraft:boolean)=>void;
 readonly onOpenSurface?:(surface:OriginalSurface,id:string)=>void;
 readonly onNativeReview?:()=>void;
}
const MOVES:Readonly<Record<U32Turn['move'],string>>={
 frame:'Frame',contrast:'Compare',object:'Answer objection',repair:'Repair',
 justify:'Cite evidence',reframe:'Reframe',synthesize:'Synthesize'
};
function el<K extends keyof HTMLElementTagNameMap>(tag:K,text='',cls=''):HTMLElementTagNameMap[K]{
 const node=document.createElement(tag);if(text)node.textContent=text;
 if(cls)node.className=cls;return node;
}
function action(text:string,handler:()=>void,primary=false):HTMLButtonElement{
 const button=el('button',text,primary?'primary-action compact-action':'secondary-action compact-action');
 button.type='button';button.addEventListener('click',handler);return button;
}
function originalText(text:string):HTMLParagraphElement{
 const p=el('p',text,'u32-original-fr');p.lang='fr';return p;
}
const TYPE:Readonly<Record<U32Witness['kind'],string>>={
 dialogue:'Original spoken-text dialogue (not recorded audio)',
 reading:'Original published connected reading (written)',
 document:'Independent original written document (not audio)'
};
/**
 * One disposable learner-facing study surface. Canonical lesson, vocabulary,
 * reading, listening, writing and review writers are never called.
 */
export function appendOriginalDiscourseJourney(
 host:HTMLElement,lessonId:string,options:Options
):()=>void{
 const source=originalU32Discourse(lessonId);
 if(!source)return()=>{};
 const root=el('section','','u32-discourse');
 root.setAttribute('aria-label','Advanced original French discourse and multi-context transfer');
 root.dataset.hasPrivateDraft='false';
 const details=el('details','','u32-disclosure');
 details.append(el('summary','U32 · Multi-context discussion · '+source.turns.length+
  ' response turns · '+source.decisions.length+' grounded checks'));
 const body=el('div','','u32-body');details.append(body);root.append(details);host.append(root);
 const heading=el('header','','u32-head');
 heading.append(el('p','ORIGINAL SOURCE · CONTEXTUAL DISCOURSE','eyebrow'),
  el('h3',source.caseTitle),el('p',source.caseDescription),
  el('p',source.level+' · '+source.qualifiedId+' · revision '+source.sourceRevision,'u32-source-label'),
  el('p','All partner challenges and suggested replies below are U32-authored practice fiction. Quoted original French is separately labeled by historical speaker/document. Your free answers are neither recorded nor graded.','u32-caveat'));
 if(!source.curated)heading.append(el('p','This lesson uses a general evidence-backed discussion path; no special U32-authored case is claimed for this topic.','u32-caveat'));

 const nav=el('nav','','u32-round-nav');nav.setAttribute('aria-label','Discourse response turns');
 const round=el('article','','u32-round');
 const progress=el('p','','u32-live');progress.setAttribute('role','status');
 const compare=el('section','','u32-compare');
 compare.append(el('h4','Compare actual original sources before drawing a conclusion'));
 const compareIntro=el('p','A dialogue turn, a connected reading and an attributed written document have different evidentiary roles. Comparing them does not prove that they agree. Use original French source records below.','u32-caveat');
 const sourcePair=el('div','','u32-source-pair');
 const pairActions=el('div','','u32-pair-actions');
 const pairNotes=el('div','','u32-pair-notes');
 const pairLabelA=el('label','What the first original source actually establishes');
 const pairA=el('textarea');pairA.rows=3;pairA.placeholder='La première source affirme… Elle ne prouve pas…';
 pairLabelA.append(pairA);
 const pairLabelB=el('label','What the second original source establishes or leaves uncertain');
 const pairB=el('textarea');pairB.rows=3;pairB.placeholder='Selon cette autre source… En revanche…';
 pairLabelB.append(pairB);
 const pairLabelS=el('label','Your independent synthesis in French');
 const pairS=el('textarea');pairS.rows=4;pairS.placeholder='Les deux sources présentent… Pourtant, il reste à vérifier…';
 pairLabelS.append(pairS);
 const pairStatus=el('p','Source comparison is self-reviewed and in page memory only.','u32-caveat');pairStatus.setAttribute('role','status');
 pairNotes.append(pairLabelA,pairLabelB,pairLabelS,pairStatus);
 compare.append(compareIntro,sourcePair,pairActions,pairNotes);
 const questions=el('section','','u32-decisions');
 questions.append(el('h4','Repair misconceptions with actual source evidence'),
  el('p','Only these authored textual choices use exact keyed comparison. They do not assess the correctness, fluency or pronunciation of an original free response.','u32-caveat'));
 const questionPane=el('div','','u32-question-pane');
 const questionNav=el('div','','u32-question-nav');
 const questionStatus=el('p','','u32-live');questionStatus.setAttribute('role','status');
 questions.append(questionPane,questionNav,questionStatus);
 const sourceExplorer=el('details','','u32-evidence');
 sourceExplorer.append(el('summary','Browse exact original dialogue, readings and attributed documents'));
 const sourceItems=el('div','','u32-evidence-list');
 for(const witness of source.witnesses){
  const card=el('article','','u32-evidence-item');
  card.append(el('h5',witness.label),el('p',TYPE[witness.kind],'u32-source-label'),
   originalText(witness.french));
  if(witness.explanation)card.append(el('p','Original English explanation: '+witness.explanation,'u32-source-label'));
  sourceItems.append(card);
 }
 sourceExplorer.append(sourceItems);
 const exits=el('section','','u32-exits');
 exits.append(el('h4','Continue in the canonical French workspaces'));
 const exitActions=el('div','','u32-exit-actions');
 if(options.onOpenSurface){
  const destinations:readonly [OriginalSurface,string,boolean][]=[
   ['course','Open Course',true],['listen','Revisit U30 listening',true],
   ['speak','Continue U31 oral production',true],
   ['read','Read the connected original record',source.witnesses.some(x=>x.kind==='reading')],
   ['write','Open original writing',true]
  ];
  for(const [surface,title,available] of destinations){
   if(available)exitActions.append(action(title,()=>options.onOpenSurface?.(surface,source.lessonId)));
  }
 }
 if(options.onNativeReview)exitActions.append(action('Native scheduled Review',()=>options.onNativeReview?.()));
 exits.append(exitActions,el('p','These are navigation handoffs using the original U23 source identity; no completion, grading or Account sync is inferred.','u32-caveat'));
 const editorialHost=el('div','','u33-integration');
 body.append(heading,nav,progress,round,compare,questions,sourceExplorer,exits,editorialHost);

 let roundIndex=0,questionIndex=0,shownSupport=0,independent=false,disposed=false;
 const notes=new Map<string,string>(),firstDrafts=new Map<string,string>();
 const independentDrafts=new Map<string,string>(),spoke=new Set<string>();
 const keyed=new Map<string,{value:string;correct:boolean}>();
 const pairDrafts=[pairA,pairB,pairS];
 const pairCacheBySource=new Map<string,[string,string,string]>();
 let activePairKey='';
 const privateChanged=()=>{
  const present=[...notes.values(),...independentDrafts.values(),
   ...[...pairCacheBySource.values()].flat()].some(x=>x.trim().length>0)||
   !!editorialHost.querySelector<HTMLElement>('.u33-editorial[data-has-private-draft="true"]');
  root.dataset.hasPrivateDraft=String(present);
  options.onPrivateChange?.(present);
 };
 const stopU33=appendOriginalEditorialJourney(editorialHost,lessonId,{
  signal:options.signal,
  onPrivateChange:()=>privateChanged(),
  onOpenSurface:options.onOpenSurface,
  onNativeReview:options.onNativeReview
 });
 pairDrafts.forEach((textarea,i)=>textarea.addEventListener('input',()=>{
  if(!activePairKey)return;
  const previous=pairCacheBySource.get(activePairKey)??(['','',''] as [string,string,string]);
  const current:[string,string,string]=[previous[0],previous[1],previous[2]];
  current[i]=textarea.value;
  pairCacheBySource.set(activePairKey,current);
  privateChanged();
 }));
 function originalWitness(locator:string):U32Witness|null{
  return source.witnesses.find(x=>x.locator===locator)??null;
 }
 function evidenceCard(w:U32Witness):HTMLElement{
  const card=el('article','','u32-evidence-item');
  card.append(el('h5',w.label),el('p',TYPE[w.kind],'u32-source-label'),originalText(w.french));
  if(w.explanation)card.append(el('p','Original English explanation: '+w.explanation,'u32-source-label'));
  return card;
 }
 function drawPair():void{
  sourcePair.replaceChildren();pairActions.replaceChildren();
  const docs=source.witnesses.filter(w=>w.kind==='document');
  const readings=source.witnesses.filter(w=>w.kind==='reading');
  const dialogue=source.witnesses.filter(w=>w.kind==='dialogue');
  const choices:readonly [string,U32Witness,U32Witness][]=[];
  const candidates:[string,U32Witness,U32Witness][]=[];
  if(docs.length>=2)candidates.push(['Two independently attributed written records',docs[0],docs[1]]);
  if(readings.length&&dialogue.length)candidates.push(['Connected written reading versus original dialogue turn',readings[0],dialogue[0]]);
  if(docs.length&&dialogue.length)candidates.push(['Written record versus original dialogue turn',docs[0],dialogue[0]]);
  if(!candidates.length&&dialogue.length>=2)candidates.push(['Two turns in the SAME original dialogue, not independent sources',dialogue[0],dialogue[1]]);
  for(const x of candidates)choices.push(x);
  if(!choices.length)return;
  let selected=0;
  const examples=el('div','','u32-pair-source-cards');
  const info=el('p','','u32-caveat');
  const refresh=()=>{
   const [label,first,second]=choices[selected];
   activePairKey=first.locator+'::'+second.locator;
   const preserved=pairCacheBySource.get(activePairKey)??(['','',''] as [string,string,string]);
   pairDrafts.forEach((textarea,i)=>{textarea.value=preserved[i];});
   info.textContent=label+'. Source labels and text are published originals; your comparison must distinguish attribution from factual verification. Notes are kept separately for this exact source pair.';
   examples.replaceChildren(evidenceCard(first),evidenceCard(second));
  };
  choices.forEach(([label],i)=>{
   const b=action(label,()=>{selected=i;refresh();});
   pairActions.append(b);
  });
  sourcePair.append(info,examples);refresh();
 }
 function drawRound(focus=false):void{
  const x=source.turns[roundIndex];
  round.replaceChildren();nav.replaceChildren();
  source.turns.forEach((turn,i)=>{
   const button=action((i+1)+'. '+MOVES[turn.move],()=>{roundIndex=i;shownSupport=0;independent=false;drawRound(true);});
   if(i===roundIndex)button.setAttribute('aria-current','step');
   nav.append(button);
  });
  const title=el('h4','Turn '+(roundIndex+1)+' · '+MOVES[x.move]);title.tabIndex=-1;
  const setting=el('p','Speaking setting: '+x.setting+' · register: '+x.intendedRegister,'u32-setting');
  const interlocutor=el('blockquote','','u32-interlocutor');
  interlocutor.append(el('strong','New hypothetical '+x.partner+' says:'),el('p',x.partnerSays));
  const task=el('p','Your independent French task: '+x.task,'u32-task');
  const coach=el('div','','u32-coach');
  const coachStatus=el('p','','u32-live');coachStatus.setAttribute('role','status');
  const hint=el('p',x.scaffold,'u32-coach-hint');
  const correction=el('p','Repair guard: '+x.safeguard,'u32-coach-hint');
  const revealed=el('div','','u32-turn-evidence');
  const example=el('p','','u32-illustrative');example.lang='fr';
  const currentText=notes.get(x.id)??'';
  const editorLabel=el('label','Draft your own French response. This is not recorded or transmitted.');
  const editor=el('textarea');editor.rows=5;editor.value=currentText;editor.placeholder='Je comprends votre question. Cependant, selon le dialogue…';
  editorLabel.append(editor);
  const independentLabel=el('label','Independent second response · without reading your previous notes');
  const independentEditor=el('textarea');independentEditor.rows=5;
  independentEditor.value=independentDrafts.get(x.id)??'';
  independentEditor.placeholder='Répondez de mémoire avec vos propres phrases…';
  independentLabel.append(independentEditor);independentLabel.hidden=true;
  const compareDrafts=el('div','','u32-revision');compareDrafts.hidden=true;
  const live=el('p','','u32-live');live.setAttribute('role','status');
  const controls=el('div','','u32-round-controls');
  const replyState=el('p','','u32-live');
  function supportDraw(){
   hint.hidden=shownSupport<1||independent;
   correction.hidden=shownSupport<1||independent;
   revealed.hidden=shownSupport<2||independent;
   example.hidden=shownSupport<3||independent;
   coachStatus.textContent=independent?'Independent rehearsal: original scaffolds and first draft hidden.':
    'Support: '+['none','speaking structure','original witness','illustrative reply'][shownSupport]+
    '. Revealing help does not establish a pass.';
   revealed.replaceChildren();
   if(shownSupport>=2&&!independent){
    for(const loc of x.witnessLocators){
     const witness=originalWitness(loc);if(witness)revealed.append(evidenceCard(witness));
    }
   }
   if(shownSupport>=3&&!independent){
    example.textContent=x.illustrativeReply??
     'No authored model reply exists for this lesson. Revisit the original French evidence and form your own response.';
   }
   replyState.textContent=spoke.has(x.id)?
    'You marked this round rehearsed aloud. This is an unverified self-report, not recorded speech.':'No speaking event is recorded.';
  }
  const revealStructure=action('1 · Speaking structure',()=>{shownSupport=Math.max(shownSupport,1);supportDraw();});
  const revealSource=action('2 · Original source turn',()=>{shownSupport=Math.max(shownSupport,2);supportDraw();});
  const revealModel=action('3 · Illustrative reply',()=>{shownSupport=3;supportDraw();});
  const retry=action('Independent second attempt · hide first draft',()=>{
   independent=true;supportDraw();editorLabel.hidden=true;independentLabel.hidden=false;
   independentEditor.focus();live.textContent='Prepare your own unprompted version. Your earlier draft remains private for comparison.';
  },true);
  const backToNotes=action('Return to first draft',()=>{
   independent=false;editorLabel.hidden=false;independentLabel.hidden=true;supportDraw();
  });
  backToNotes.hidden=true;
  retry.addEventListener('click',()=>{retry.hidden=true;backToNotes.hidden=false;});
  backToNotes.addEventListener('click',()=>{retry.hidden=false;backToNotes.hidden=true;});
  const capture=action('Capture first draft for revision',()=>{
   if(!editor.value.trim()){live.textContent='Write an initial response before capturing it.';return;}
   firstDrafts.set(x.id,editor.value);
   live.textContent='Earlier draft captured in page memory. Revise and compare; no correction is automatically inferred.';
  });
  const showCompare=action('Compare original, revision and independent response',()=>{
   const earlier=firstDrafts.get(x.id);if(!earlier){live.textContent='Capture an earlier draft first.';return;}
   compareDrafts.replaceChildren(
    el('h5','Earlier version'),originalText(earlier),
    el('h5','Current edited response'),originalText(editor.value),
    el('h5','Independent response'),originalText(independentDrafts.get(x.id)??'(not attempted)'),
    el('p','Check claim scope, source attribution, speaker perspective, register, objections and corrections yourself. No semantic or pronunciation grade is available.','u32-caveat')
   );compareDrafts.hidden=false;
  });
  const spoken=action('I spoke this response aloud (self-report)',()=>{
   spoke.add(x.id);supportDraw();updateProgress();
  });
  const clear=action('Clear this response and independent attempt',()=>{
   notes.delete(x.id);independentDrafts.delete(x.id);firstDrafts.delete(x.id);
   editor.value='';independentEditor.value='';compareDrafts.hidden=true;
   privateChanged();live.textContent='Private content cleared for this turn only.';
  });
  const prev=action('← Previous turn',()=>{if(roundIndex>0){roundIndex--;shownSupport=0;independent=false;drawRound(true);}});
  const next=action('Next turn →',()=>{
   if(roundIndex<source.turns.length-1){roundIndex++;shownSupport=0;independent=false;drawRound(true);}
  },true);
  prev.disabled=roundIndex===0;next.disabled=roundIndex===source.turns.length-1;
  editor.addEventListener('input',()=>{notes.set(x.id,editor.value);privateChanged();});
  independentEditor.addEventListener('input',()=>{independentDrafts.set(x.id,independentEditor.value);privateChanged();});
  const selfCheck=el('fieldset','','u32-self-check');
  selfCheck.append(el('legend','Use this rubric for your own spoken revision'));
  [
   'My answer reacts to the hypothetical partner, not to an invented historical quote.',
   'I distinguish an original source claim from my own inference.',
   'I use the correct register and respond to objections respectfully.',
   'I retain negation, conditions, uncertainty and distinct speaker attributions.',
   'I provide a coherent reason or next action instead of unsupported certainty.'
  ].forEach(x=>{
   const label=el('label','','u32-check-item'),input=el('input');input.type='checkbox';
   label.append(input,el('span',x));selfCheck.append(label);
  });
  coach.append(coachStatus,hint,correction,revealed,example);
  controls.append(revealStructure,revealSource,revealModel,retry,backToNotes,capture,showCompare,spoken,clear);
  const navFooter=el('div','','u32-nav-footer');navFooter.append(prev,next);
  round.append(title,setting,interlocutor,task,coach,editorLabel,independentLabel,controls,
   selfCheck,live,compareDrafts,replyState,navFooter);
  supportDraw();updateProgress();
  if(focus)title.focus({preventScroll:true});
 }
 function updateProgress(){
  progress.textContent='Round '+(roundIndex+1)+' / '+source.turns.length+' · '+spoke.size+
   ' oral rehearsals self-reported (unverified). '+keyed.size+' source questions answered locally. No formal credits.';
 }
 function drawQuestions():void{
  questionPane.replaceChildren();questionNav.replaceChildren();
  if(!source.decisions.length){
   questions.append(el('p','No independently keyed source questions are available for this source. Free-speaking tasks remain self-reviewed.','u32-caveat'));
   questionStatus.textContent='Text question set unavailable';return;
  }
  const d:U32Decision=source.decisions[questionIndex];
  questionPane.append(el('p','Source question '+(questionIndex+1)+' / '+source.decisions.length+' · '+d.type,'u32-source-label'),
   el('h5',d.prompt));
  const form=el('form','','u32-question-form');
  const label=el('label','Select the source-supported interpretation');
  const select=el('select');const empty=el('option','Choose an option');empty.value='';select.append(empty);
  for(const x of d.choices){const op=el('option',x);op.value=x;select.append(op);}
  label.append(select);
  const feedback=el('p','','u32-feedback');feedback.setAttribute('role','status');
  const existing=keyed.get(d.id);
  if(existing){
   select.value=existing.value;
   feedback.textContent=(existing.correct?'Source-supported. ':'Source correction. ')+evaluateU32Decision(d,existing.value).feedback;
  }
  const check=el('button','Check original source key','primary-action compact-action');check.type='submit';
  form.append(label,check,feedback);
  form.addEventListener('submit',event=>{
   event.preventDefault();
   if(!select.value){feedback.textContent='Choose a response to compare with the original published key.';return;}
   const verdict=evaluateU32Decision(d,select.value);
   keyed.set(d.id,{value:select.value,correct:verdict.supported});
   feedback.textContent=(verdict.supported?'Source-supported. ':'Source correction. ')+verdict.feedback+
    ' This does not grade the free speaking response.';
   updateProgress();
   questionStatus.textContent=keyed.size+' of '+source.decisions.length+
    ' keyed source checks attempted in page memory; no native Practice or SRS events.';
  });
  const evidence=el('div','','u32-question-evidence');evidence.hidden=true;
  for(const loc of d.relevantLocators){
   const w=originalWitness(loc);if(w)evidence.append(evidenceCard(w));
  }
  const show=action('Reveal exact supporting source',()=>{evidence.hidden=!evidence.hidden;});
  questionPane.append(form,show,evidence);
  const prev=action('Previous source check',()=>{questionIndex--;drawQuestions();});
  const next=action('Next source check',()=>{questionIndex++;drawQuestions();});
  prev.disabled=questionIndex===0;next.disabled=questionIndex===source.decisions.length-1;
  questionNav.append(prev,next);
 }
 const cleanup=()=>{
  if(disposed)return;disposed=true;
  stopU33();
  options.signal.removeEventListener('abort',cleanup);
 };
 options.signal.addEventListener('abort',cleanup,{once:true});
 drawRound();drawPair();drawQuestions();updateProgress();
 return cleanup;
}
