import type { RouteContext } from '../core/types';
import { loadPracticeWords } from '../core/content/practice';
import type { VocabularyWord } from '../core/content/loader';
import type { ReviewWord } from '../core/content/review-content';
import { ensureCanonicalLearnerState,recordStandalonePractice } from '../core/learner/repository';
import { gradeTypedAnswer,suggestedRating,type GradingMode,type TypedGrade } from '../core/learner/grader';

function object(value:unknown):Record<string,unknown>{
  return value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
}
function reviewWord(word:VocabularyWord):ReviewWord{
  const example=word.sentences?.find(item=>item?.text)||word.sentences?.[0];
  return{
    id:String(word.id),word:word.word,meaning:word.meaning,ipa:word.ipa??'',pos:word.pos??'',level:word.level??'',
    article:word.article??'',gender:word.gender??'',plural:word.plural??'',aliases:word.aliases??[],
    exampleFr:example?.text??'',exampleEn:example?.translation??'',source:'corpus'
  };
}
function earnedLevel(promotions:Record<string,unknown>):string{
  let current='A1';
  for(const level of ['A1','A2','B1','B2']){
    const row=object(promotions[level]);
    if(Number(row.earnedAt)>0)current=level;else break;
  }
  return current;
}
function speak(text:string,rate=0.92):boolean{
  if(!('speechSynthesis' in window))return false;
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.lang='fr-FR';utterance.rate=rate;
  const voice=window.speechSynthesis.getVoices().find(item=>item.lang.toLowerCase().startsWith('fr'));
  if(voice)utterance.voice=voice;
  window.speechSynthesis.speak(utterance);
  return true;
}

export async function mount({main,signal}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page media-practice-page"><p class="eyebrow">Audio on demand</p><h1>Listen</h1><p class="lede">Hear one French item, type what you heard, and get French-aware feedback. Only one small vocabulary pack is loaded for this practice set.</p><p class="inline-status" data-status>Preparing listening practice…</p><div class="media-practice-stage" data-stage></div></section>';
  const stage=main.querySelector<HTMLElement>('[data-stage]');
  const status=main.querySelector<HTMLElement>('[data-status]');
  if(!stage||!status)return;

  const learner=await ensureCanonicalLearnerState();
  const gradingMode=(['strict','learning','lenient'].includes(String(learner.settings.gradingMode))?String(learner.settings.gradingMode):'learning') as GradingMode;
  const level=earnedLevel(learner.promotions);
  const words=await loadPracticeWords(level,20,signal);
  if(signal.aborted)return;

  if(!words.length){
    status.textContent='No listening content is available.';
    return;
  }

  let index=0;
  const speechAvailable='speechSynthesis' in window;
  status.textContent=speechAvailable
    ?words.length+' items · '+level+' · device French speech'
    :words.length+' items · '+level+' · speech synthesis is unavailable on this browser';

  const render=()=>{
    if(signal.aborted)return;
    const raw=words[index%words.length],word=reviewWord(raw),started=performance.now();
    let result:TypedGrade|null=null;
    let saved=false;
    stage.replaceChildren();

    const card=document.createElement('article');card.className='media-practice-card';
    const meta=document.createElement('div');meta.className='review-meta';
    const count=document.createElement('span');count.textContent=(index+1)+' / '+words.length;
    const levelTag=document.createElement('span');levelTag.textContent=[word.level,word.pos].filter(Boolean).join(' · ');
    meta.append(count,levelTag);

    const prompt=document.createElement('div');prompt.className='media-prompt';
    const icon=document.createElement('div');icon.className='media-prompt-icon';icon.setAttribute('aria-hidden','true');icon.textContent='♪';
    const h=document.createElement('h2');h.textContent='What did you hear?';
    const hint=document.createElement('p');hint.textContent='Play the French audio, then type the word or phrase exactly as you hear it.';
    prompt.append(icon,h,hint);

    const play=document.createElement('button');play.type='button';play.className='primary-action compact-action media-play';play.textContent='Play French';
    play.disabled=!speechAvailable;
    play.addEventListener('click',()=>speak(word.word));

    const form=document.createElement('form');form.className='media-answer-form';
    const input=document.createElement('input');input.type='text';input.autocomplete='off';input.spellcheck=false;input.placeholder='Type the French you heard';input.setAttribute('aria-label','French you heard');
    const check=document.createElement('button');check.type='submit';check.className='secondary-action compact-action';check.textContent='Check';
    const reveal=document.createElement('button');reveal.type='button';reveal.className='secondary-action compact-action';reveal.textContent='Reveal';
    form.append(input,check,reveal);

    const feedback=document.createElement('div');feedback.className='media-feedback';feedback.hidden=true;
    const actions=document.createElement('div');actions.className='media-next-actions';actions.hidden=true;
    const replay=document.createElement('button');replay.type='button';replay.className='secondary-action compact-action';replay.textContent='Replay';
    replay.addEventListener('click',()=>speak(word.word,.84));
    const next=document.createElement('button');next.type='button';next.className='primary-action compact-action';next.textContent=index+1>=words.length?'Start again':'Next';
    next.addEventListener('click',()=>{index=(index+1)%words.length;render();});
    actions.append(replay,next);

    const finish=async(answer:string,revealed=false)=>{
      if(result)return;
      const responseMs=Math.max(0,Math.round(performance.now()-started));
      result=gradeTypedAnswer(answer,word,{skill:'listening',direction:'audio-fr',strictArticles:false,gradingMode});
      const rating=revealed?'again':suggestedRating(result,responseMs);
      input.disabled=true;check.disabled=true;reveal.disabled=true;
      feedback.hidden=false;feedback.replaceChildren();
      const label=document.createElement('strong');label.textContent=revealed?'Answer revealed':result.label;
      const answerLine=document.createElement('p');answerLine.textContent=word.word+' — '+word.meaning;
      feedback.append(label,answerLine);
      if(word.ipa){const ipa=document.createElement('small');ipa.textContent=word.ipa;feedback.append(ipa);}
      actions.hidden=false;
      if(!saved){
        saved=true;
        try{
          await recordStandalonePractice({
            noteId:word.id,skill:'listening',rating,correct:revealed?false:result.correct,responseMs,
            typed:true,typedQuality:revealed?'review':result.quality,level:word.level,pos:word.pos,
            direction:'audio-fr',practice:'listening'
          });
        }catch(error){console.error('French listening practice save failed',error);}
      }
    };

    form.addEventListener('submit',event=>{event.preventDefault();void finish(input.value);});
    reveal.addEventListener('click',()=>void finish('',true));

    card.append(meta,prompt,play,form,feedback,actions);
    stage.append(card);
    queueMicrotask(()=>{if(speechAvailable)speak(word.word);input.focus();});
  };

  render();
  signal.addEventListener('abort',()=>{if('speechSynthesis' in window)window.speechSynthesis.cancel();},{once:true});
}
