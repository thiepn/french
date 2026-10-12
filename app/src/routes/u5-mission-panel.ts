import {INTEGRATED_MISSIONS,missionForJourney,type IntegratedMission,type MissionStep} from '../core/unified/u5-missions';
import {reviewAdvice,latestMissionRatings,missionEvent,exportMissionCheckpoint,inspectMissionCheckpoint,
 type MissionEvent,type MissionRating,validateMissionHandoff} from '../core/unified/u5-review';
import {checkPracticeAnswer} from '../core/unified/u2-grammar';
import {analyzeAttempt,reviewProduction} from '../core/unified/u4-feedback';
import {ORIGINAL_PATH_LESSONS} from '../core/unified/u3-pathways';
import './unified-u5.css';

interface Actions {
 readonly openLesson:(lessonId:string)=>void;
 readonly signal:AbortSignal;
}
function make<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string,className?:string):HTMLElementTagNameMap[K]{
 const element=document.createElement(tag);
 if(text!==undefined)element.textContent=text;
 if(className)element.className=className;
 return element;
}
function btn(label:string,click:()=>void,className='secondary-action compact-action'):HTMLButtonElement{
 const button=make('button',label,className);
 button.type='button';button.addEventListener('click',click);
 return button;
}
export function mountMissionWorkspace(host:HTMLElement,actions:Actions):{setJourney:(id:string)=>void;refresh:()=>void}{
 const errors=validateMissionHandoff();
 if(errors.length)throw Error('Original U5 mission contract failed: '+errors.join('; '));
 const events:MissionEvent[]=[];
 let mission:IntegratedMission=INTEGRATED_MISSIONS[0];
 let index=0;
 let hintCount=0;
 host.replaceChildren();
 host.className='u5-workspace';
 const top=make('div',undefined,'u5-heading');
 top.append(make('h3','Integrated practice mission'),
  make('p','Original mini-missions connect reading, oral rehearsal, writing and recall. Feedback is local, ungraded and self-reported.'));
 const summary=make('p','','u5-mission-summary');summary.setAttribute('role','status');
 const steps=make('div',undefined,'u5-step-navigation');steps.setAttribute('role','group');steps.setAttribute('aria-label','Mission steps');
 const stage=make('section',undefined,'u5-step-stage');stage.dataset.missionStage='';
 const recommendations=make('aside',undefined,'u5-recommendation');
 const actionRow=make('div',undefined,'u5-mission-actions');
 const exportButton=btn('Export mission handoff',()=>{
  if(!events.length){status.textContent='Complete or mark a mission step first.';return;}
  try{
   const data=exportMissionCheckpoint(events);
   const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
   const anchor=make('a');anchor.href=url;anchor.download='french-u5-mission-handoff.json';anchor.click();
   setTimeout(()=>URL.revokeObjectURL(url),1000);
   status.textContent='Exported self-reported mission outcomes only; no answer text or speaking recordings.';
  }catch{status.textContent='Unable to export. No practice was changed.';}
 });
 const fileLabel=make('label','Import mission handoff (explicit file selection)');
 const file=make('input');file.type='file';file.accept='.json,application/json';
 file.setAttribute('aria-label','Mission handoff JSON');fileLabel.append(file);
 const reset=btn('Clear mission practice',()=>{
  events.length=0;index=0;hintCount=0;status.textContent='Temporary mission history cleared. Native progress was unchanged.';refresh();
 });
 actionRow.append(exportButton,fileLabel,reset);
 const status=make('p','Mission status is temporary until you explicitly export a file.','u5-handoff-status');
 status.setAttribute('role','status');
 const footer=make('p','Self-reported practice only. No CEFR, FSRS, SRS, Account or verified speaking score. No recorded audio or saved writing.','u5-custody');
 host.append(top,summary,steps,stage,recommendations,actionRow,status,footer);
 function record(step:MissionStep,rating:MissionRating){
  if(events.length>=96){status.textContent='96-event handoff limit reached. Export or clear before recording more outcomes.';return;}
  const event=missionEvent(events.length+1,mission.id,step.id,rating);
  if(!event){status.textContent='Practice step could not be recorded.';return;}
  events.push(event);
  status.textContent='Recorded '+rating.replace('-claim',' (self-reported)')+' for '+step.title+'.';
  refresh(true);
 }
 function showStep(){
  stage.replaceChildren();
  const step=mission.steps[index],lesson=ORIGINAL_PATH_LESSONS.find(l=>l.id===step.lessonId)!;
  const label=make('p','Step '+(index+1)+' of '+mission.steps.length+' · '+step.mode.replace('-', ' '),'eyebrow');
  const heading=make('h4',step.title),prompt=make('p',step.prompt);
  stage.append(label,heading,prompt);
  if(step.reference){
   const quote=make('blockquote',step.reference,'u5-reading-reference');quote.lang='fr';stage.append(quote);
  }
  stage.append(btn('Open source lesson: '+lesson.title,()=>actions.openLesson(lesson.id)));
  const feedback=make('p','','u5-step-feedback');feedback.setAttribute('role','status');
  const hint=make('div',undefined,'u5-hint');hint.setAttribute('role','note');
  const reveal=btn('Reveal a contextual hint',()=>{
   if(hintCount<step.hints.length){hint.textContent=step.hints[hintCount];hintCount++;}
   else hint.textContent='All original hints shown. Try again without the hints later.';
  });
  if(step.mode==='reading'||step.mode==='transfer'){
   const form=make('form',undefined,'u5-step-form');
   let input:HTMLSelectElement|HTMLInputElement;
   if(step.mode==='reading'){
    input=make('select');input.setAttribute('aria-label','Reading response');
    const placeholder=make('option','Choose a response');placeholder.value='';input.append(placeholder);
    for(const value of step.options){const option=make('option',value);option.value=value;input.append(option);}
   }else{
    input=make('input');input.type='text';input.lang='fr';input.autocomplete='off';input.maxLength=80;
    input.setAttribute('aria-label','Contextual transfer answer');
   }
   const check=make('button','Check mission answer','primary-action compact-action');check.type='submit';
   form.addEventListener('submit',e=>{
    e.preventDefault();
    if(!input.value.trim()){feedback.textContent='Choose or type an answer.';return;}
    const pass=checkPracticeAnswer(input.value,step.expected??'');
    if(!pass){
     const diagnosis=analyzeAttempt(input.value,step.expected??'',step.grammarId);
     feedback.textContent='Not yet: '+diagnosis.cue;
     record(step,'needs-review');
    }else{
     feedback.textContent='Matches the original answer. This is local recall, not verified mastery.';
     record(step,hintCount?'assisted-claim':'independent-claim');
    }
   });
   form.append(input,check);stage.append(form);
   if(step.hints.length)stage.append(reveal,hint);
  }else{
   const criteria=make('fieldset',undefined,'u5-criteria');
   criteria.append(make('legend','Self-review criteria (not a graded rubric)'));
   const checks:HTMLInputElement[]=[];
   for(const criterion of step.criteria){
    const label=make('label');
    const checkbox=make('input');checkbox.type='checkbox';checkbox.setAttribute('aria-label',criterion);
    label.append(checkbox,make('span',criterion));criteria.append(label);checks.push(checkbox);
   }
   stage.append(criteria);
   let response:HTMLTextAreaElement|null=null;
   if(step.mode==='writing'){
    response=make('textarea');response.rows=4;response.maxLength=1200;response.lang='fr';
    response.setAttribute('aria-label','Mission writing response');
    stage.append(response,btn('Review writing prompts',()=>{
     const value=response?.value??'';
     const review=reviewProduction(step.lessonId,value);
     feedback.textContent=[...review.notes,...review.promptChecks].join(' ')+
      ' This is heuristic feedback, not a grammar or CEFR grade.';
    }));
   }else{
    const cue=make('p','Speak the answer aloud on your own. No microphone, upload, transcription or voice evaluation is performed.','u5-cue');
    const source=lesson.dialogue.find(row=>row.fr.includes('Je ')||row.fr.includes('Tu '))??lesson.dialogue[0];
    const sample=make('p',source.fr,'u5-speech-example');sample.lang='fr';sample.hidden=true;
    const show=btn('Show original pronunciation practice line',()=>{
     sample.hidden=!sample.hidden;hintCount++;
    });
    stage.append(cue,show,sample);
   }
   const ratingRow=make('div',undefined,'u5-rating-actions');
   const independent=btn('Mark practiced independently',()=>{
    if(response!==null&&!response.value.trim()){feedback.textContent='Write a response before self-rating.';return;}
    if(!checks.every(x=>x.checked)){feedback.textContent='Review all three criteria before marking this step.';return;}
    record(step,hintCount?'assisted-claim':'independent-claim');
   },'primary-action compact-action');
   const assisted=btn('Mark practiced with support',()=>{
    if(response!==null&&!response.value.trim()){feedback.textContent='Write a response before self-rating.';return;}
    record(step,'assisted-claim');
   });
   const retry=btn('Needs more practice',()=>record(step,'needs-review'));
   ratingRow.append(independent,assisted,retry);stage.append(ratingRow);
  }
  stage.append(feedback);
 }
 function showAdvice(){
  recommendations.replaceChildren();
  const advice=reviewAdvice(mission.id,events);
  if(!advice)return;
  recommendations.append(make('h4','Recommended next practice'),make('p',advice.reason));
  if(advice.stepId){
   recommendations.append(btn(advice.title,()=>{
    const next=mission.steps.findIndex(s=>s.id===advice.stepId);
    if(next>=0){index=next;hintCount=0;refresh();}
   },'primary-action compact-action'));
   if(advice.lessonId)recommendations.append(btn('Review original source lesson',()=>actions.openLesson(advice.lessonId!)));
  }else recommendations.append(make('p','All steps were self-reported. Repeat any step to strengthen recall; no completion credit is issued.'));
 }
 function refresh(preserveStage=false){
  if(actions.signal.aborted)return;
  const latest=latestMissionRatings(mission,events);
  summary.textContent=mission.context+' · '+latest.size+'/'+mission.steps.length+
   ' different steps attempted locally; no proficiency credits.';
  steps.replaceChildren();
  for(const [i,step] of mission.steps.entries()){
   const status=latest.get(step.id);
   const button=btn((i+1)+'. '+step.mode.replace('-', ' ')+(status?' · '+(status==='needs-review'?'retry':'practiced'):''),
    ()=>{index=i;hintCount=0;refresh();},'u5-step-button');
   if(i===index){button.classList.add('active');button.setAttribute('aria-current','step');}
   button.dataset.missionStep=step.id;steps.append(button);
  }
  exportButton.disabled=events.length===0;
  if(!preserveStage)showStep();showAdvice();
 }
 steps.addEventListener('keydown',event=>{
  if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
  const buttons=[...steps.querySelectorAll<HTMLButtonElement>('button')];
  const i=buttons.indexOf(document.activeElement as HTMLButtonElement);if(i<0)return;
  event.preventDefault();
  const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:
   (i+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
  buttons[next]?.focus();buttons[next]?.click();
 });
 file.addEventListener('change',async()=>{
  const selected=file.files?.[0];if(!selected)return;
  try{
   if(selected.size>32768){status.textContent='Blocked: file exceeds 32 KiB.';return;}
   const raw=await selected.text();if(actions.signal.aborted)return;
   const result=inspectMissionCheckpoint(raw);
   if(result.status!=='valid'){status.textContent='Blocked: '+result.reasons.join('; ')+'. Existing practice unchanged.';return;}
   events.splice(0,events.length,...result.events);
   const last=events[events.length-1];
   const imported=last?INTEGRATED_MISSIONS.find(m=>m.id===last.missionId):null;
   if(imported){mission=imported;index=mission.steps.findIndex(s=>s.id===last.stepId);if(index<0)index=0;}
   hintCount=0;refresh();
   status.textContent='Imported '+events.length+' self-reported step outcomes into this temporary page. No verified progress was restored.';
  }catch{if(!actions.signal.aborted)status.textContent='Invalid checkpoint. Previous practice unchanged.';}
  finally{file.value='';}
 });
 const setJourney=(journeyId:string)=>{
  const next=missionForJourney(journeyId);
  if(!next||next.id===mission.id)return;
  mission=next;index=0;hintCount=0;refresh();
 };
 refresh();
 return {setJourney,refresh};
}
