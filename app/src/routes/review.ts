import type { RouteContext } from '../core/types';
import { readDueSrs,recordCanonicalReview } from '../core/learner/repository';
import type { CanonicalSrsRecordV1 } from '../core/learner/model';
import type { SchedulerRating } from '../core/learner/scheduler';
import { resolveReviewWord,type ReviewWord } from '../core/content/review-content';

interface PromptSpec{
  label:string;
  prompt:string;
  answer:string;
  direction:string;
  listening:boolean;
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
    return{label:'Listening → French',prompt:'Listen, then recall the French form.',answer:word.word+' · '+word.meaning,direction:'audio-fr',listening:true};
  }
  return{label:'French → meaning',prompt:word.word,answer:word.meaning,direction:'fr-en',listening:false};
}

function speakFrench(text:string):void{
  if(!('speechSynthesis' in window))return;
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.lang='fr-FR';
  window.speechSynthesis.speak(utterance);
}

export async function mount({main,signal}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page review-page"><p class="eyebrow">Retrieval first</p><h1>Review</h1><p class="lede">Due reviews come directly from the canonical SRS store. Content is resolved only for the current item.</p><p class="inline-status" data-status>Reading due reviews…</p><div class="review-stage" data-stage></div></section>';
  const stage=main.querySelector<HTMLElement>('[data-stage]');
  const status=main.querySelector<HTMLElement>('[data-status]');
  if(!stage||!status)return;

  let queue=await readDueSrs(30);
  let unresolved=0;

  const updateStatus=()=>{
    status.textContent=queue.length
      ?queue.length+' due item'+(queue.length===1?'':'s')+' loaded'+(unresolved?' · '+unresolved+' unresolved skipped':'')
      :'No reviews due right now'+(unresolved?' · '+unresolved+' unresolved item'+(unresolved===1?'':'s')+' skipped':'');
  };

  const renderDone=()=>{
    stage.replaceChildren();
    const card=document.createElement('article');card.className='review-card review-done';
    const h=document.createElement('h2');h.textContent='Reviews clear';
    const p=document.createElement('p');p.textContent='There are no more due items in this review batch.';
    const refresh=document.createElement('button');refresh.type='button';refresh.className='secondary-action';refresh.textContent='Check again';
    refresh.addEventListener('click',async()=>{
      refresh.disabled=true;
      queue=await readDueSrs(30);
      updateStatus();
      void renderCurrent();
    });
    card.append(h,p,refresh);stage.append(card);
  };

  const renderCurrent=async():Promise<void>=>{
    if(signal.aborted)return;
    if(!queue.length){updateStatus();renderDone();return;}

    const record=queue[0];
    stage.innerHTML='<article class="review-card"><p>Loading review content…</p></article>';
    const word=await resolveReviewWord(record,signal);
    if(signal.aborted)return;

    if(!word){
      stage.replaceChildren();
      const card=document.createElement('article');card.className='review-card review-unresolved';
      const h=document.createElement('h2');h.textContent='Content not resolved';
      const p=document.createElement('p');p.textContent='The saved SRS record '+record.noteId+' is preserved, but its content is not in the current corpus or migrated user cards.';
      const skip=document.createElement('button');skip.type='button';skip.className='secondary-action';skip.textContent='Skip without changing progress';
      skip.addEventListener('click',()=>{unresolved++;queue.shift();updateStatus();void renderCurrent();});
      card.append(h,p,skip);stage.append(card);return;
    }

    const spec=promptFor(record,word);
    const started=performance.now();
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
      const listen=document.createElement('button');listen.type='button';listen.className='secondary-action';listen.textContent='Play French';
      listen.addEventListener('click',()=>speakFrench(word.word));prompt.append(listen);
    }

    const answer=document.createElement('div');answer.className='review-answer';answer.hidden=true;
    const answerLabel=document.createElement('span');answerLabel.textContent='Answer';
    const answerText=document.createElement('strong');answerText.textContent=spec.answer;
    answer.append(answerLabel,answerText);

    const actions=document.createElement('div');actions.className='review-actions';
    const reveal=document.createElement('button');reveal.type='button';reveal.className='primary-action';reveal.textContent='Show answer';
    actions.append(reveal);

    const ratings=document.createElement('div');ratings.className='rating-grid';ratings.hidden=true;
    const ratingSpecs:Array<[SchedulerRating,string]>=[['again','Again'],['hard','Hard'],['good','Good'],['easy','Easy']];
    for(const [rating,labelText] of ratingSpecs){
      const button=document.createElement('button');button.type='button';button.dataset.rating=rating;button.textContent=labelText;
      button.addEventListener('click',async()=>{
        for(const control of ratings.querySelectorAll<HTMLButtonElement>('button'))control.disabled=true;
        const responseMs=Math.max(0,Math.round(performance.now()-started));
        try{
          await recordCanonicalReview(record,rating,{
            level:word.level,pos:word.pos,direction:spec.direction,practice:'review',correct:rating!=='again'
          },Date.now(),responseMs,'none');
          queue.shift();updateStatus();void renderCurrent();
        }catch(error){
          for(const control of ratings.querySelectorAll<HTMLButtonElement>('button'))control.disabled=false;
          status.textContent='Could not save this review. Your previous SRS record remains intact.';
          console.error('French review write failed',error);
        }
      });
      ratings.append(button);
    }

    reveal.addEventListener('click',()=>{
      reveal.hidden=true;answer.hidden=false;ratings.hidden=false;
      if(spec.listening)speakFrench(word.word);
    });

    card.append(meta,prompt,answer,actions,ratings);
    stage.append(card);
    updateStatus();
  };

  updateStatus();
  await renderCurrent();
  signal.addEventListener('abort',()=>{if('speechSynthesis' in window)window.speechSynthesis.cancel();},{once:true});
}
