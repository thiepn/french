import type { RouteContext } from '../core/types';
import { loadPracticeWords } from '../core/content/practice';
import type { VocabularyWord } from '../core/content/loader';
import type { ReviewWord } from '../core/content/review-content';
import { ensureCanonicalLearnerState,recordStandalonePractice } from '../core/learner/repository';
import { gradeTypedAnswer,suggestedRating,type GradingMode,type TypedGrade } from '../core/learner/grader';
import type { SchedulerRating } from '../core/learner/scheduler';

interface RecognitionAlternativeLike{transcript:string;confidence?:number;}
interface RecognitionResultLike{0:RecognitionAlternativeLike;length:number;isFinal:boolean;}
interface RecognitionEventLike{results:{[index:number]:RecognitionResultLike;length:number};resultIndex:number;}
interface RecognitionErrorEventLike{error?:string;message?:string;}
interface RecognitionLike{
  lang:string;interimResults:boolean;continuous:boolean;maxAlternatives:number;
  onresult:((event:RecognitionEventLike)=>void)|null;
  onerror:((event:RecognitionErrorEventLike)=>void)|null;
  onend:(()=>void)|null;
  start():void;stop():void;abort():void;
}
interface RecognitionCtor{new():RecognitionLike;}
type SpeechWindow=Window&{SpeechRecognition?:RecognitionCtor;webkitSpeechRecognition?:RecognitionCtor};

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
function speakModel(text:string,rate=.86):boolean{
  if(!('speechSynthesis' in window))return false;
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);
  utterance.lang='fr-FR';utterance.rate=rate;
  const voice=window.speechSynthesis.getVoices().find(item=>item.lang.toLowerCase().startsWith('fr'));
  if(voice)utterance.voice=voice;
  window.speechSynthesis.speak(utterance);return true;
}
function recognitionConstructor():RecognitionCtor|null{
  const target=window as SpeechWindow;
  return target.SpeechRecognition??target.webkitSpeechRecognition??null;
}
function selfRating(label:'again'|'good'|'easy'):SchedulerRating{return label;}

export async function mount({main,signal}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page media-practice-page"><p class="eyebrow">Microphone on demand</p><h1>Speak</h1><p class="lede">Recall the French expression, say it aloud, and compare what the browser heard. Microphone access starts only after you request it.</p><p class="inline-status" data-status>Preparing speaking practice…</p><div class="media-practice-stage" data-stage></div></section>';
  const stage=main.querySelector<HTMLElement>('[data-stage]');
  const status=main.querySelector<HTMLElement>('[data-status]');
  if(!stage||!status)return;

  const learner=await ensureCanonicalLearnerState();
  const gradingMode=(['strict','learning','lenient'].includes(String(learner.settings.gradingMode))?String(learner.settings.gradingMode):'learning') as GradingMode;
  const level=earnedLevel(learner.promotions);
  const words=await loadPracticeWords(level,18,signal);
  if(signal.aborted)return;
  if(!words.length){status.textContent='No speaking content is available.';return;}

  const Recognition=recognitionConstructor();
  status.textContent=Recognition
    ?words.length+' prompts · '+level+' · speech recognition available'
    :words.length+' prompts · '+level+' · speech recognition unavailable; self-rating fallback enabled';

  let index=0;
  let activeRecognition:RecognitionLike|null=null;

  const render=()=>{
    if(signal.aborted)return;
    activeRecognition?.abort();activeRecognition=null;
    const word=reviewWord(words[index%words.length]),started=performance.now();
    let saved=false,grade:TypedGrade|null=null;
    stage.replaceChildren();

    const card=document.createElement('article');card.className='media-practice-card';
    const meta=document.createElement('div');meta.className='review-meta';
    const count=document.createElement('span');count.textContent=(index+1)+' / '+words.length;
    const levelTag=document.createElement('span');levelTag.textContent=[word.level,word.pos].filter(Boolean).join(' · ');
    meta.append(count,levelTag);

    const prompt=document.createElement('div');prompt.className='media-prompt speaking-prompt';
    const lead=document.createElement('p');lead.className='eyebrow';lead.textContent='Say this in French';
    const meaning=document.createElement('h2');meaning.textContent=word.meaning;
    const guidance=document.createElement('p');guidance.textContent=Recognition?'Press the microphone, say your answer once, then compare the transcript.':'Say your answer aloud, then reveal the model and self-rate it.';
    prompt.append(lead,meaning,guidance);

    const controls=document.createElement('div');controls.className='media-control-row';
    const mic=document.createElement('button');mic.type='button';mic.className='primary-action compact-action';mic.textContent=Recognition?'Start microphone':'Microphone unavailable';mic.disabled=!Recognition;
    const model=document.createElement('button');model.type='button';model.className='secondary-action compact-action';model.textContent='Hear model';model.addEventListener('click',()=>speakModel(word.word));
    const reveal=document.createElement('button');reveal.type='button';reveal.className='secondary-action compact-action';reveal.textContent='Reveal French';
    controls.append(mic,model,reveal);

    const live=document.createElement('div');live.className='speech-live';live.hidden=true;live.setAttribute('aria-live','polite');
    const resultBox=document.createElement('div');resultBox.className='media-feedback';resultBox.hidden=true;
    const fallback=document.createElement('div');fallback.className='self-rating-grid';fallback.hidden=true;
    const nextActions=document.createElement('div');nextActions.className='media-next-actions';nextActions.hidden=true;
    const retry=document.createElement('button');retry.type='button';retry.className='secondary-action compact-action';retry.textContent='Try again';
    const next=document.createElement('button');next.type='button';next.className='primary-action compact-action';next.textContent=index+1>=words.length?'Start again':'Next';
    next.addEventListener('click',()=>{index=(index+1)%words.length;render();});
    retry.addEventListener('click',()=>{resultBox.hidden=true;fallback.hidden=true;nextActions.hidden=true;mic.disabled=!Recognition;mic.textContent=Recognition?'Start microphone':'Microphone unavailable';grade=null;saved=false;});
    nextActions.append(retry,next);

    const showModel=(headline:string,transcript='')=>{
      resultBox.hidden=false;resultBox.replaceChildren();
      const h=document.createElement('strong');h.textContent=headline;
      resultBox.append(h);
      if(transcript){const heard=document.createElement('p');heard.textContent='Heard: '+transcript;resultBox.append(heard);}
      const target=document.createElement('p');target.textContent='French: '+word.word+' — '+word.meaning;resultBox.append(target);
      if(word.ipa){const ipa=document.createElement('small');ipa.textContent=word.ipa;resultBox.append(ipa);}
      nextActions.hidden=false;
    };
    const persist=async(rating:SchedulerRating,correct:boolean,typedQuality:string,responseMs:number)=>{
      if(saved)return;saved=true;
      try{
        await recordStandalonePractice({
          noteId:word.id,skill:'production',rating,correct,responseMs,typed:Boolean(grade),
          typedQuality,level:word.level,pos:word.pos,direction:'en-fr',practice:'speaking'
        });
      }catch(error){console.error('French speaking practice save failed',error);}
    };
    const showSelfRating=()=>{
      fallback.hidden=false;fallback.replaceChildren();
      const note=document.createElement('p');note.textContent='How close was your spoken answer?';fallback.append(note);
      const options:Array<[SchedulerRating,string,boolean]>=[['again','Needs work',false],['good','Good',true],['easy','Easy',true]];
      for(const [rating,label,correct] of options){
        const button=document.createElement('button');button.type='button';button.className='secondary-action compact-action';button.textContent=label;
        button.addEventListener('click',()=>{
          for(const item of fallback.querySelectorAll<HTMLButtonElement>('button'))item.disabled=true;
          void persist(selfRating(rating as 'again'|'good'|'easy'),correct,'none',Math.max(0,Math.round(performance.now()-started)));
          nextActions.hidden=false;
        });
        fallback.append(button);
      }
    };

    reveal.addEventListener('click',()=>{
      reveal.disabled=true;showModel('Model answer');speakModel(word.word);
      if(!Recognition)showSelfRating();
      else nextActions.hidden=false;
    });

    if(Recognition){
      mic.addEventListener('click',()=>{
        if(activeRecognition){activeRecognition.stop();return;}
        const recognition=new Recognition();activeRecognition=recognition;
        recognition.lang='fr-FR';recognition.interimResults=false;recognition.continuous=false;recognition.maxAlternatives=1;
        live.hidden=false;live.textContent='Listening…';mic.textContent='Stop microphone';mic.disabled=false;
        recognition.onresult=event=>{
          const transcript=event.results[event.resultIndex]?.[0]?.transcript?.trim()??'';
          const responseMs=Math.max(0,Math.round(performance.now()-started));
          grade=gradeTypedAnswer(transcript,word,{skill:'production',direction:'en-fr',strictArticles:false,gradingMode});
          const rating=suggestedRating(grade,responseMs);
          live.textContent=transcript?'Transcript captured.':'No transcript captured.';
          showModel(grade.label,transcript);
          void persist(rating,grade.correct,grade.quality,responseMs);
        };
        recognition.onerror=event=>{
          live.hidden=false;live.textContent=event.error==='not-allowed'?'Microphone permission was not granted. Use the self-rating fallback.':'Speech recognition could not complete. Use the self-rating fallback.';
          showModel('Use self-rating');
          showSelfRating();
        };
        recognition.onend=()=>{activeRecognition=null;mic.textContent='Start microphone';};
        try{recognition.start();}
        catch(error){activeRecognition=null;mic.textContent='Start microphone';live.hidden=false;live.textContent='Speech recognition could not start.';showSelfRating();console.error('French microphone start failed',error);}
      });
    }

    card.append(meta,prompt,controls,live,resultBox,fallback,nextActions);stage.append(card);
  };

  render();
  signal.addEventListener('abort',()=>{activeRecognition?.abort();if('speechSynthesis' in window)window.speechSynthesis.cancel();},{once:true});
}
