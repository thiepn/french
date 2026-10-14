import {
 originalPlacementQuestions,originalPlacementLevels,checkOriginalPlacementKey,
 originalPlacementFeedback,summarizeOriginalPlacement,originalPlacementEntries,
 originalPlacementPrerequisites,
 type PlacementQuestion,type PlacementResponse,type PlacementGoal,type PlacementBackground
} from '../core/unified/u27-placement.ts';
import {ORIGINAL_PATHWAYS} from '../core/unified/u25-pathways.ts';
import {
 getOriginalCatalogEntry,type OriginalLevel,type OriginalSurface
} from '../core/unified/u23-registry.ts';
import './u27-placement-panel.css';

const GOALS:readonly [PlacementGoal,string,string][]=[
 ['balanced','Explore the full course','Grammar, reading, listening and writing in sequence'],
 ['grammar','Strengthen grammar','Original explanations and independent application'],
 ['reading','Read with evidence','Original connected texts and comprehension'],
 ['listening','Understand dialogue','Source-authored French dialogue; optional device TTS'],
 ['writing','Write independently','Original prompts and unguided first drafts']
];
type Pane='setup'|'question'|'results';
interface Options{
 readonly signal:AbortSignal;
 readonly onOpenCourse:(id:string)=>void;
 readonly onOpenSurface:(surface:Exclude<OriginalSurface,'course'>,id:string)=>void;
 readonly onNativeReview:()=>void;
}
function node<K extends keyof HTMLElementTagNameMap>(tag:K,text='',css=''):HTMLElementTagNameMap[K]{
 const element=document.createElement(tag);
 if(text)element.textContent=text;
 if(css)element.className=css;
 return element;
}
function button(text:string,fn:()=>void,css='secondary-action compact-action'):HTMLButtonElement{
 const element=node('button',text,css);
 element.type='button';element.addEventListener('click',fn);
 return element;
}
function option(value:string,title:string):HTMLOptionElement{
 const e=node('option',title);e.value=value;return e;
}
/**
 * Session-only UI. Each response and self-declared goal lives in this mounted
 * component and is lost on route exit. Never touches account, learner,
 * featureState, U24 CAS, scheduler, CEFR or any persistence writer.
 */
export function createOriginalPlacementPanel({signal,onOpenCourse,onOpenSurface,onNativeReview}:Options):HTMLElement{
 const root=node('section','','u27-placement');
 root.setAttribute('aria-label','Optional original French placement self-check');
 const disclosure=node('details','','u27-placement-disclosure');
 disclosure.append(node('summary','Unsure where to begin? Optional original-course self-check'));
 root.append(disclosure);
 const content=node('div','','u27-placement-inner');
 disclosure.append(content);
 const heading=node('h3','Find an original lesson that fits your goal');
 heading.tabIndex=-1;
 content.append(heading,node('p',
  'Choose any pathway, or compare a few independently answerable original questions. This is not a standardized placement test, CEFR award, progress record or native assessment. Nothing you answer here is saved.','u27-disclaimer'));
 const controls=node('div','','u27-settings');
 const levelLabel=node('label','Pathway to explore','u27-field'),level=node('select');
 level.setAttribute('aria-label','Self-check original French level');
 for(const value of originalPlacementLevels())level.append(option(value,value));
 levelLabel.append(level);
 const goalLabel=node('label','Your learning goal','u27-field'),goal=node('select');
 for(const [value,title] of GOALS)goal.append(option(value,title));
 goalLabel.append(goal);
 const backgroundLabel=node('label','Your own starting point','u27-field'),background=node('select');
 for(const [value,title] of [
  ['unsure','I am unsure what fits'],
  ['new','I am new to this material'],
  ['reviewing','I have studied related French before']
 ] as const)background.append(option(value,title));
 backgroundLabel.append(background);
 controls.append(levelLabel,goalLabel,backgroundLabel);
 const contentArea=node('div','','u27-placement-content');
 content.append(controls,contentArea);
 let view:Pane='setup',step=0;
 let questions:readonly PlacementQuestion[]=[];
 const responses=new Map<string,PlacementResponse>();
 let goalChosen:PlacementGoal='balanced',backgroundChosen:PlacementBackground='unsure';
 let selectedLevel:OriginalLevel='A1';
 const live=node('p','','u27-placement-live');live.setAttribute('role','status');
 content.append(live);
 const openUnit=(id:string)=>{
  if(signal.aborted)return;
  const entry=getOriginalCatalogEntry(id);
  if(entry)onOpenCourse(entry.id);
 };
 const openSurface=(surface:Exclude<OriginalSurface,'course'>,id:string)=>{
  if(signal.aborted)return;
  const entry=getOriginalCatalogEntry(id);
  const possible=entry&&(surface==='read'?entry.reading:surface==='listen'?entry.listening:entry.writing);
  if(possible)onOpenSurface(surface,id);
 };
 const syncSettings=()=>{
  selectedLevel=level.value as OriginalLevel;
  goalChosen=goal.value as PlacementGoal;
  backgroundChosen=background.value as PlacementBackground;
 };
 const rowButtons=(...items:HTMLButtonElement[])=>{
  const actions=node('div','','u27-actions');
  actions.append(...items);return actions;
 };
 const showGuidance=(host:HTMLElement)=>{
  const result=summarizeOriginalPlacement(questions,responses);
  const entries=originalPlacementEntries(selectedLevel,goalChosen,questions,responses);
  const section=node('section','','u27-entry');
  section.append(node('h4','Possible entry points'),
   node('p',
    result.answered?result.interpretation:
     'No quiz result is needed. These are optional entry points from your chosen level and goal.',
    'u27-disclaimer'));
  if(backgroundChosen==='new')section.append(node('p',
   'You selected “new to this material.” Consider an earlier original foundation even if the short keyed questions match.','u27-context'));
  if(backgroundChosen==='reviewing')section.append(node('p',
   'You selected previous experience. Choose any entry directly, but the original prerequisites remain visible.','u27-context'));
  const list=node('div','','u27-entry-list');
  for(const entry of entries){
   const card=node('article','','u27-entry-card');
   const band=getOriginalCatalogEntry(entry.id)?.foundationBand;
   card.append(node('p',entry.level+' · '+entry.kind.toUpperCase()+
      (band?' · grammar '+band:''),'u27-eyebrow'),
    node('h5',entry.title),
    node('p',entry.reason,'u27-context'),
    node('p','Original source: '+entry.qualifiedId,'u27-source-id'));
   const go=button('Open original lesson',()=>openUnit(entry.id),'primary-action compact-action');
   const row=rowButtons(go);
   const meta=getOriginalCatalogEntry(entry.id);
   if(meta){
    if(meta.reading)row.append(button('Read source',()=>openSurface('read',entry.id)));
    if(meta.listening)row.append(button('Listen',()=>openSurface('listen',entry.id)));
    if(meta.writing)row.append(button('Write',()=>openSurface('write',entry.id)));
   }
   card.append(row);list.append(card);
  }
  if(!entries.length)section.append(node('p','No eligible original entry found. Use the existing Course pathway browser.','u27-context'));
  section.append(list,node('p',
   'Starting further ahead never marks earlier lessons complete. If U24 navigation saving is enabled, opening a Course lesson uses its existing source-validated position rules.','u27-disclaimer'));
  host.append(section);
 };
 function showSetup(){
  view='setup';contentArea.replaceChildren();
  controls.hidden=false;live.textContent='';
  const path=ORIGINAL_PATHWAYS.find(p=>p.level===level.value);
  const intro=node('div','','u27-setup');
  intro.append(node('h4','Choose freely, without a placement score'),
   node('p',path?path.description:'Select an original level to see its available learning pathway.','u27-context'));
  const action=rowButtons(
   button('Start source-linked self-check',()=>{
    syncSettings();questions=originalPlacementQuestions(selectedLevel);
    responses.clear();step=0;controls.hidden=true;
    if(questions.length){showQuestion();return;}
    live.textContent='No source-linked questions are available for this original level. You may still choose the pathway.';
    showEntriesOnly();
   },'primary-action compact-action'),
   button('Skip questions · choose an entry',()=>{
    syncSettings();questions=originalPlacementQuestions(selectedLevel);
    responses.clear();controls.hidden=true;showEntriesOnly();
   }),
   button('Go to first lesson in this pathway',()=>{
    syncSettings();
    const first=ORIGINAL_PATHWAYS.find(p=>p.level===selectedLevel)?.firstId;
    if(first)openUnit(first);
   })
  );
  intro.append(action,node('p',
   'Short samples are selected from existing original grammar, dialogue and connected reading. A matching key measures only that individual response, not your general French level.','u27-disclaimer'));
  contentArea.append(intro);
 }
 function showEntriesOnly(){
  view='results';contentArea.replaceChildren();
  contentArea.append(node('h4','Entry without testing'));
  showGuidance(contentArea);
  contentArea.append(rowButtons(button('Choose another level or goal',()=>{controls.hidden=false;showSetup();}),
   button('Native scheduled Review',onNativeReview)));
 }
 function showQuestion(){
  if(signal.aborted)return;
  view='question';
  const q=questions[step];if(!q){showResults();return;}
  contentArea.replaceChildren();
  const item=node('article','','u27-question');
  const progress=node('p','Original '+selectedLevel+' · Question '+(step+1)+' of '+questions.length,'u27-eyebrow');
  const source=node('details','','u27-reading-source');source.open=true;
  source.append(node('summary',q.origin==='grammar'?'Authored grammar cue':'Original '+(q.origin==='connected-reading'?'connected reading':'French dialogue')));
  const sourceHeading=node('h5',q.sourceTitle);
  const sourceText=node('p',q.sourceText,'u27-french-source');
  if(q.origin!=='grammar')sourceText.lang='fr';
  source.append(sourceHeading,sourceText);
  item.append(progress,node('h4',q.title),source,
   node('p','Source: '+q.qualifiedSourceId+' · this question has a limited original answer key','u27-source-id'));
  const form=node('form','','u27-question-form');
  const questionLabel=node('label',q.prompt,'u27-question-label');
  const existing=responses.get(q.id);
  const input=q.options.length?node('select'):node('input');
  input.setAttribute('aria-label','Your independent answer');
  if(input instanceof HTMLInputElement){
   input.type='text';input.lang='fr';input.maxLength=220;input.autocomplete='off';input.spellcheck=false;
   input.placeholder='Enter the requested French form';
  }else{
   input.append(option('','Choose from the authored options'));
   for(const text of q.options)input.append(option(text,text));
  }
  input.value=existing?.status==='answered'?existing.value:'';
  questionLabel.append(input);
  const confidenceLabel=node('label','How sure are you? (self-report only)','u27-field');
  const confidence=node('select');confidence.setAttribute('aria-label','Your confidence, not a mastery score');
  for(const [value,title] of [
   ['not-sure','Unsure'],['somewhat','Somewhat sure'],['confident','Confident']
  ] as const)confidence.append(option(value,title));
  confidence.value=existing?.confidence??'not-sure';confidenceLabel.append(confidence);
  const feedback=node('p','','u27-feedback');feedback.setAttribute('role','status');
  const hint=node('p',q.hint,'u27-hint');hint.hidden=true;
  const hintButton=button('Show an authored hint',()=>{hint.hidden=!hint.hidden;hintButton.textContent=hint.hidden?'Show an authored hint':'Hide the hint';});
  const check=node('button','Compare with authored key','primary-action compact-action');check.type='submit';
  const next=button(step===questions.length-1?'See source-based entry options':'Next question →',()=>{
   if(step===questions.length-1)showResults();
   else {step++;showQuestion();}
  });
  next.disabled=!existing;
  form.addEventListener('submit',event=>{
   event.preventDefault();
   const value=input.value.trim();
   if(!value){feedback.textContent='Enter or choose an answer, or skip this question.';return;}
   const saved:PlacementResponse={value,confidence:confidence.value as PlacementResponse['confidence'],status:'answered'};
   responses.set(q.id,saved);
   next.disabled=false;
   feedback.textContent=originalPlacementFeedback(q,value)+
    (checkOriginalPlacementKey(value,q)?' Authored-key match only; no grade saved.':'');
   live.textContent='Question '+(step+1)+' compared with the original authored response.';
  });
  input.addEventListener('input',()=>{next.disabled=true;feedback.textContent='Response changed. Compare again or skip before continuing.';});
  if(existing?.status==='answered')feedback.textContent=originalPlacementFeedback(q,existing.value);
  if(existing?.status==='skipped')feedback.textContent='You skipped this question. You can answer it now or continue.';
  const skip=button('Skip this question',()=>{
   responses.set(q.id,{value:'',status:'skipped',confidence:'not-sure'});
   if(step===questions.length-1)showResults();else{step++;showQuestion();}
  });
  const back=button('← Previous',()=>{step=Math.max(0,step-1);showQuestion();});
  back.disabled=step===0;
  form.append(questionLabel,confidenceLabel,
   rowButtons(check,hintButton,back,skip,next),hint,feedback);
  item.append(form);
  contentArea.append(item,rowButtons(
   button('Choose an entry without finishing',showResults),
   button('Change pathway / restart',()=>{controls.hidden=false;responses.clear();showSetup();})
  ));
 }
 function showResults(){
  view='results';contentArea.replaceChildren();
  const summary=summarizeOriginalPlacement(questions,responses);
  const headline=node('h4','Your answers, not a placement grade');
  const note=node('p',summary.interpretation,'u27-disclaimer');
  const counts=node('p',summary.matched+' keyed matches · '+summary.unmatched+
   ' nonmatching responses · '+summary.skipped+' skipped · '+summary.uncertain+
   ' self-reported unsure responses. No official level inferred.','u27-context');
  contentArea.append(headline,note,counts);
  const detail=node('details','','u27-review');detail.append(node('summary','Review individual original-source responses'));
  for(const [i,q] of questions.entries()){
   const response=responses.get(q.id);
   const row=node('div','','u27-review-item');
   row.append(node('h5',(i+1)+'. '+q.title),
    node('p','Your response: '+(response?.status==='answered'?response.value:'Not answered'),'u27-context'),
    node('p','Authored key: '+q.answer+' — '+q.explanation,'u27-context'),
    node('p','Source: '+q.qualifiedSourceId,'u27-source-id'));
   detail.append(row);
  }
  contentArea.append(detail);
  showGuidance(contentArea);
  contentArea.append(rowButtons(
   button('Revisit questions',()=>{step=0;showQuestion();}),
   button('Try another original level',()=>{controls.hidden=false;responses.clear();showSetup();}),
   button('Clear my temporary answers',()=>{responses.clear();showEntriesOnly();}),
   button('Native scheduled Review',onNativeReview)
  ));
  live.textContent='Self-check finished. Source references and voluntary entry choices are available.';
 }
 level.addEventListener('change',()=>{if(view==='setup')showSetup();});
 showSetup();
 signal.addEventListener('abort',()=>responses.clear(),{once:true});
 return root;
}
