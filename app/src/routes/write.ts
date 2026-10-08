import './write.css';
import type {RouteContext} from '../core/types';
import {loadStableSentenceExercises,type SentenceExercise} from '../core/content/loader';
import {diagnoseSentence,type SentenceDiagnosis} from '../core/content/sentence-diagnosis';
import {recordPracticeEvidence} from '../core/learner/repository';
import {
  WRITING_MODES,currentWritingExercise,completeWritingAttempt,revealWritingSupport,
  writingExercises,type WritingMode,type WritingState,type WritingAttempt
} from '../core/writing/session';
import {loadWritingState,saveWritingState} from '../core/writing/storage';

function element<K extends keyof HTMLElementTagNameMap>(tag:K,content='',className=''):HTMLElementTagNameMap[K]{
  const e=document.createElement(tag);if(content)e.textContent=content;if(className)e.className=className;return e;
}
function control(label:string,className='secondary-action compact-action'):HTMLButtonElement{
  const e=element('button',label,className);e.type='button';return e;
}
const TITLES:Record<WritingMode,string>={phrase:'Build a phrase',sentence:'Construct a sentence',transfer:'Transfer to a new situation'};
const CAPTIONS:Record<WritingMode,string>={
  phrase:'Complete or construct useful French expressions.',
  sentence:'Translate or transform full sentences in context.',
  transfer:'Apply a familiar construction to a different situation.'
};
export async function mount({main,signal}:RouteContext):Promise<void>{
  const host=element('section','','page write-workspace');
  host.append(element('p','ACTIVE PRODUCTION','eyebrow'),element('h1','Write'),
    element('p','Produce French from a prompt, inspect deterministic feedback, and decide whether the answer needs more practice. This does not change scheduled SRS.','lede'));
  const tabs=element('div','','write-modes');tabs.setAttribute('role','group');tabs.setAttribute('aria-label','Writing practice track');
  const message=element('p','Loading sentence exercises…','inline-status');message.setAttribute('aria-live','polite');
  const stage=element('div','','write-stage');
  host.append(tabs,message,stage);main.replaceChildren(host);

  const [pack,stateValue]=await Promise.all([loadStableSentenceExercises(signal),loadWritingState()]);
  if(signal.aborted)return;
  let state:WritingState=stateValue,mode:WritingMode='phrase',busy=false,started=performance.now();
  const save=async(next:WritingState)=>{await saveWritingState(next);state=next;};
  const draw=()=>{
    if(signal.aborted)return;
    tabs.replaceChildren();
    for(const name of WRITING_MODES){
      const btn=control(name==='phrase'?'Phrases':name==='sentence'?'Sentences':'Transfer','write-tab'+(mode===name?' is-active':''));
      btn.setAttribute('aria-pressed',String(mode===name));
      btn.addEventListener('click',()=>{if(busy)return;mode=name;started=performance.now();draw();});
      tabs.append(btn);
    }
    const rows=writingExercises(pack,mode);
    const exercise=currentWritingExercise(pack,state,mode);
    stage.replaceChildren();
    if(!exercise){
      stage.append(element('p','No verified prompts available for this track.','write-note'));
      message.textContent='No exercises available.';return;
    }
    const current=state.modes[mode];
    const completed=state.history.filter(row=>row.mode===mode).length;
    message.textContent=rows.length+' verified prompts in this track · '+completed+' recorded attempts · local-first';
    const heading=element('div','','write-heading');
    heading.append(element('p',exercise.context+' · '+exercise.type,'write-context'),element('h2',TITLES[mode]),
      element('p',CAPTIONS[mode],'write-note'));
    const progress=element('div','','write-progress');
    progress.append(element('strong','Prompt '+((current.index%rows.length)+1)+' / '+rows.length),
      element('small',completed+' recorded attempts'));
    const task=element('article','','write-task');
    task.append(element('p','PROMPT','write-label'),element('p',exercise.prompt,'write-prompt'));
    const form=element('form','','write-form');
    const answer=element('textarea','','write-answer');answer.setAttribute('aria-label','Your written French answer');
    answer.placeholder='Écrivez votre réponse en français…';answer.rows=4;answer.maxLength=1200;answer.spellcheck=true;
    const actions=element('div','','write-actions');
    const check=control('Check answer','primary-action compact-action');check.type='submit';
    const hint=control('Hint');const model=control('Show reference');
    actions.append(check,hint,model);form.append(answer,actions);
    const support=element('p','','write-support');
    if(current.support>=1)support.textContent=current.support===2?'Reference · '+exercise.expected:'Construction · '+exercise.frame;
    const feedback=element('div','','write-feedback');feedback.setAttribute('role','status');
    const next=element('div','','write-assess');next.setAttribute('aria-label','Save writing assessment');
    task.append(form,support,feedback,next);
    stage.append(heading,progress,task);
    let diagnosis:SentenceDiagnosis|null=null;
    let submitted='';
    const setSupport=async(level:1|2)=>{
      if(busy)return;busy=true;
      try{await save(revealWritingSupport(state,mode,level));support.textContent=level===2?'Reference · '+exercise.expected:'Construction · '+exercise.frame;}
      catch(error){feedback.textContent='Could not save support state. Try again.';console.error(error);}
      finally{busy=false;}
    };
    hint.onclick=()=>void setSupport(1);
    model.onclick=()=>void setSupport(2);
    const record=async(outcome:WritingAttempt['outcome'])=>{
      if(busy||!diagnosis)return;
      busy=true;next.querySelectorAll('button').forEach(node=>(node as HTMLButtonElement).disabled=true);
      const correct=outcome!=='needs-practice';
      const currentSupport=state.modes[mode].support;
      try{
        await recordPracticeEvidence({
          noteId:'sentence:'+exercise.id,skill:'production',practice:'written-'+mode,
          direction:'en-fr',correct,typed:true,
          typedQuality:outcome==='self-assessed'?'manual-self-assessed':diagnosis.quality,
          responseMs:Math.max(0,Math.round(performance.now()-started)),
          supportLevel:currentSupport,errorCategory:diagnosis.code,
          sentenceExerciseId:exercise.id,sentenceDiagnosis:diagnosis.code,
          theme:exercise.context,manualJudgment:outcome
        });
      }catch(error){
        busy=false;next.querySelectorAll('button').forEach(node=>(node as HTMLButtonElement).disabled=false);
        feedback.textContent='The result was not saved. Please try again.';console.error(error);return;
      }
      try{
        await save(completeWritingAttempt(pack,state,mode,exercise.id,outcome,diagnosis.code));
        started=performance.now();draw();
      }catch(error){
        // The practice event may already be committed. Do not re-enable the
        // submit controls and risk recording duplicate evidence.
        feedback.textContent='Your practice event was saved, but the next prompt could not be opened. Reload the page before continuing.';
        console.error(error);
      }finally{busy=false;}
    };
    form.addEventListener('submit',event=>{
      event.preventDefault();
      if(busy)return;
      const entered=answer.value.trim();
      if(!entered){feedback.textContent='Write your sentence before checking it.';return;}
      diagnosis=diagnoseSentence(entered,exercise);submitted=entered;
      feedback.replaceChildren(element('strong',diagnosis.label),element('p',diagnosis.detail),
        element('p','Reference · '+exercise.expected,'write-reference'));
      next.replaceChildren();
      if(diagnosis.correct===true){
        const yes=control('Save correct & next','primary-action compact-action');
        yes.onclick=()=>void record('matched');next.append(yes);
      }else if(diagnosis.correct===null){
        const manual=control('Self-assess correct','primary-action compact-action');
        manual.onclick=()=>void record('self-assessed');next.append(manual);
      }
      const missed=control('Needs practice & next');
      missed.onclick=()=>void record('needs-practice');
      const retry=control('Edit answer');
      retry.onclick=()=>{diagnosis=null;submitted='';feedback.textContent='You can edit and check again.';next.replaceChildren();answer.focus();};
      next.append(missed,retry);
    });
    answer.addEventListener('input',()=>{
      if(diagnosis&&answer.value.trim()!==submitted){
        diagnosis=null;next.replaceChildren();feedback.textContent='Answer changed. Check again before saving.';
      }
    });
    answer.focus({preventScroll:true});
  };
  draw();
}
