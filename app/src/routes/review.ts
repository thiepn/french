import type { RouteContext } from '../core/types';
import {
  clearActiveStudySession,
  readActiveStudySession,
  readCanonicalLearnerState,
  readSrsById,
  recordStudySessionReview,
  skipStudySessionItem,
  undoLastStudySessionReview
} from '../core/learner/repository';
import { createReviewStudySession } from '../core/learner/study-session-builder';
import type { StudySessionStateV1 } from '../core/learner/session';
import type { CanonicalSrsRecordV1 } from '../core/learner/model';
import type { SchedulerRating } from '../core/learner/scheduler';
import { gradeTypedAnswer,suggestedRating,type GradingMode,type TypedGrade } from '../core/learner/grader';
import { resolveReviewWord,type ReviewWord } from '../core/content/review-content';

interface PromptSpec{
  label:string;
  prompt:string;
  answer:string;
  direction:'fr-en'|'en-fr'|'audio-fr';
  listening:boolean;
}
function object(value:unknown):Record<string,unknown>{
  return value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
}
function promptFor(record:CanonicalSrsRecordV1,word:ReviewWord):PromptSpec{
  if(record.skill==='production'||record.skill==='spelling'){
    return{label:record.skill==='spelling'?'Meaning → exact French':'Meaning → French',prompt:word.meaning,answer:word.word,direction:'en-fr',listening:false};
  }
  if(record.skill==='article'){
    const full=[word.article,word.word].filter(Boolean).join(' ');
    return{label:'Meaning → article + noun',prompt:word.meaning,answer:full||word.word,direction:'en-fr',listening:false};
  }
  if(record.skill==='listening'){
    return{label:'Listening → French',prompt:'Listen, then type the French form.',answer:word.word,direction:'audio-fr',listening:true};
  }
  return{label:'French → meaning',prompt:word.word,answer:word.meaning,direction:'fr-en',listening:false};
}
function speakFrench(text:string):void{
  if(!('speechSynthesis' in window))return;
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);utterance.lang='fr-FR';window.speechSynthesis.speak(utterance);
}
function sessionLabel(session:StudySessionStateV1):string{
  if(session.mode==='learn')return'New-card learning';
  if(session.mode==='today')return"Today's session";
  return'Review';
}

export async function mount({main,signal}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page review-page"><p class="eyebrow">Retrieval first</p><h1>Study</h1><p class="lede">This session is resumable for 14 days and persists each answer atomically.</p><div class="study-session-toolbar"><p class="inline-status" data-status>Opening session…</p><button class="secondary-action compact-action" data-undo type="button" hidden>Undo answer</button></div><div class="review-stage" data-stage></div></section>';
  const stage=main.querySelector<HTMLElement>('[data-stage]');
  const status=main.querySelector<HTMLElement>('[data-status]');
  const undoButton=main.querySelector<HTMLButtonElement>('[data-undo]');
  if(!stage||!status||!undoButton)return;

  const learner=await readCanonicalLearnerState();
  const settings=object(learner?.settings),sessionSettings=object(settings.session);
  const gradingMode=(['strict','learning','lenient'].includes(String(settings.gradingMode))?String(settings.gradingMode):'learning') as GradingMode;
  const strictArticles=sessionSettings.strictArticles!==false;
  const typedPreference=sessionSettings.typed===true;

  let session=await readActiveStudySession();
  if(!session)session=await createReviewStudySession(50);

  const refreshToolbar=()=>{
    const total=session.queueIds.length;
    const shown=Math.min(total,session.cursor+1);
    status.textContent=total
      ?sessionLabel(session)+' · '+shown+' / '+total+' · '+session.stats.reviewed+' answered · '+session.stats.skipped+' skipped'
      :'No cards available for this session.';
    undoButton.hidden=session.undo.length===0;
  };

  const renderDone=async()=>{
    const finalSession=session;
    stage.replaceChildren();
    const card=document.createElement('article');card.className='review-card review-done';
    const h=document.createElement('h2');h.textContent='Session complete';
    const accuracy=finalSession.stats.reviewed?Math.round(finalSession.stats.correct/finalSession.stats.reviewed*100):0;
    const p=document.createElement('p');
    p.textContent=finalSession.stats.reviewed+' answers · '+finalSession.stats.newSeen+' new · '+finalSession.stats.skipped+' skipped · '+accuracy+'% successful.';
    const restart=document.createElement('button');restart.type='button';restart.className='secondary-action';restart.textContent='Check due reviews again';
    restart.addEventListener('click',async()=>{
      restart.disabled=true;
      await clearActiveStudySession();
      session=await createReviewStudySession(50);
      refreshToolbar();
      void renderCurrent();
    });
    card.append(h,p,restart);stage.append(card);
    status.textContent='Session complete · '+finalSession.stats.reviewed+' answers saved';
    undoButton.hidden=true;
    await clearActiveStudySession();
  };

  const renderCurrent=async():Promise<void>=>{
    if(signal.aborted)return;
    if(session.cursor>=session.queueIds.length||!session.currentId){await renderDone();return;}

    const record=await readSrsById(session.currentId);
    if(!record){
      const advanced=await skipStudySessionItem();
      if(!advanced){await renderDone();return;}
      session=advanced;refreshToolbar();void renderCurrent();return;
    }

    stage.innerHTML='<article class="review-card"><p>Loading review content…</p></article>';
    const word=await resolveReviewWord(record,signal);
    if(signal.aborted)return;

    if(!word){
      stage.replaceChildren();
      const card=document.createElement('article');card.className='review-card review-unresolved';
      const h=document.createElement('h2');h.textContent='Content not resolved';
      const p=document.createElement('p');p.textContent='The saved SRS record '+record.noteId+' is preserved, but its content is not in the current corpus or migrated user cards.';
      const skip=document.createElement('button');skip.type='button';skip.className='secondary-action';skip.textContent='Skip without changing progress';
      skip.addEventListener('click',async()=>{
        const advanced=await skipStudySessionItem();
        if(advanced)session=advanced;
        refreshToolbar();void renderCurrent();
      });
      card.append(h,p,skip);stage.append(card);refreshToolbar();return;
    }

    const spec=promptFor(record,word);
    const typed=typedPreference||['production','listening','spelling','article'].includes(record.skill);
    const started=performance.now();
    let grade:TypedGrade|null=null;
    stage.replaceChildren();

    const card=document.createElement('article');card.className='review-card';
    const meta=document.createElement('div');meta.className='review-meta';
    const direction=document.createElement('span');direction.textContent=spec.label;
    const level=document.createElement('span');level.textContent=[word.level,word.pos].filter(Boolean).join(' · ')||word.source;
    meta.append(direction,level);

    const prompt=document.createElement('div');prompt.className='review-prompt';
    const promptText=document.createElement('h2');promptText.textContent=spec.prompt;prompt.append(promptText);
    if(word.ipa&&!spec.listening){const ipa=document.createElement('p');ipa.className='word-ipa';ipa.textContent=word.ipa;prompt.append(ipa);}
    if(spec.listening){
      const listen=document.createElement('button');listen.type='button';listen.className='secondary-action compact-action';listen.textContent='Play French';
      listen.addEventListener('click',()=>speakFrench(word.word));prompt.append(listen);
    }

    const answer=document.createElement('div');answer.className='review-answer';answer.hidden=true;
    const answerLabel=document.createElement('span');answerLabel.textContent='Answer';
    const answerText=document.createElement('strong');answerText.textContent=spec.answer;
    answer.append(answerLabel,answerText);

    const feedback=document.createElement('p');feedback.className='grade-feedback';feedback.hidden=true;
    const actions=document.createElement('div');actions.className='review-actions';
    const ratings=document.createElement('div');ratings.className='rating-grid';ratings.hidden=true;
    const ratingButtons=new Map<SchedulerRating,HTMLButtonElement>();

    const revealRatings=(result:TypedGrade|null)=>{
      answer.hidden=false;ratings.hidden=false;
      if(result){
        feedback.hidden=false;feedback.textContent=result.label;
        const suggested=suggestedRating(result,Math.max(0,Math.round(performance.now()-started)));
        ratingButtons.get(suggested)?.classList.add('is-suggested');
      }
      if(spec.listening)speakFrench(word.word);
    };

    let input:HTMLInputElement|null=null;
    if(typed){
      const form=document.createElement('form');form.className='typed-answer';
      input=document.createElement('input');input.type='text';input.autocomplete='off';input.spellcheck=false;input.placeholder=spec.direction==='fr-en'?'Type the meaning':'Type French';
      input.setAttribute('aria-label','Your answer');
      const check=document.createElement('button');check.type='submit';check.className='primary-action';check.textContent='Check answer';
      const reveal=document.createElement('button');reveal.type='button';reveal.className='secondary-action';reveal.textContent='Show answer';
      form.append(input,check,reveal);actions.append(form);
      form.addEventListener('submit',event=>{
        event.preventDefault();
        if(!input)return;
        grade=gradeTypedAnswer(input.value,word,{skill:record.skill,direction:spec.direction,strictArticles,gradingMode});
        input.disabled=true;check.disabled=true;reveal.hidden=true;revealRatings(grade);
      });
      reveal.addEventListener('click',()=>{
        if(!input)return;
        grade=gradeTypedAnswer('',word,{skill:record.skill,direction:spec.direction,strictArticles,gradingMode});
        input.disabled=true;check.disabled=true;reveal.hidden=true;revealRatings(grade);
      });
    }else{
      const reveal=document.createElement('button');reveal.type='button';reveal.className='primary-action';reveal.textContent='Show answer';
      reveal.addEventListener('click',()=>{reveal.hidden=true;revealRatings(null);});
      actions.append(reveal);
    }

    const ratingSpecs:Array<[SchedulerRating,string]>=[['again','Again'],['hard','Hard'],['good','Good'],['easy','Easy']];
    for(const [rating,labelText] of ratingSpecs){
      const button=document.createElement('button');button.type='button';button.dataset.rating=rating;button.textContent=labelText;ratingButtons.set(rating,button);
      button.addEventListener('click',async()=>{
        for(const control of ratings.querySelectorAll<HTMLButtonElement>('button'))control.disabled=true;
        const responseMs=Math.max(0,Math.round(performance.now()-started));
        try{
          const saved=await recordStudySessionReview(record,rating,{
            level:word.level,pos:word.pos,direction:spec.direction,practice:spec.listening?'listening':'review',
            typed:Boolean(grade),typedQuality:grade?.quality??'none',correct:grade?.correct??rating!=='again'
          },Date.now(),responseMs,grade?.quality??'none');
          session=saved.session;refreshToolbar();void renderCurrent();
        }catch(error){
          for(const control of ratings.querySelectorAll<HTMLButtonElement>('button'))control.disabled=false;
          status.textContent='Could not save this answer. The previous SRS and session state remain intact.';
          console.error('French session review write failed',error);
        }
      });
      ratings.append(button);
    }

    card.append(meta,prompt,answer,feedback,actions,ratings);stage.append(card);
    if(input)queueMicrotask(()=>input?.focus());
    refreshToolbar();
  };

  undoButton.addEventListener('click',async()=>{
    undoButton.disabled=true;
    try{
      const restored=await undoLastStudySessionReview();
      if(restored){session=restored;refreshToolbar();await renderCurrent();}
    }finally{undoButton.disabled=false;}
  });

  refreshToolbar();
  await renderCurrent();
  signal.addEventListener('abort',()=>{if('speechSynthesis' in window)window.speechSynthesis.cancel();},{once:true});
}
