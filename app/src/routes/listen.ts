import type { RouteContext } from '../core/types';
import {
  ensureCanonicalLearnerState,
  readAllSrsRecords,
  readReviewEventsSince,
  recordStandalonePractice
} from '../core/learner/repository';
import { loadVocabularySearchIndex,loadVocabularyWord,type VocabularySearchRow,type VocabularyWord } from '../core/content/loader';
import { gradeTypedAnswer,type GradingMode } from '../core/learner/grader';
import type { ReviewWord } from '../core/content/review-content';

type ListenMode='meaning'|'dictation';

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
function speak(text:string,rate=1):void{
  if(!('speechSynthesis' in window))return;
  speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);utterance.lang='fr-FR';utterance.rate=rate;
  const voices=speechSynthesis.getVoices().filter(voice=>/^fr([-_]|$)/i.test(voice.lang));
  if(voices[0])utterance.voice=voices[0];
  speechSynthesis.speak(utterance);
}
function choiceRows(current:VocabularySearchRow,rows:VocabularySearchRow[]):VocabularySearchRow[]{
  const same=rows.filter(row=>row.id!==current.id&&row.level===current.level&&row.meaning!==current.meaning);
  const result=[current];
  for(const offset of [7,19,31,43,59,71]){
    if(result.length>=4)break;
    const row=same[(current.order+offset)%Math.max(1,same.length)];
    if(row&&!result.some(item=>item.id===row.id))result.push(row);
  }
  while(result.length<4){
    const row=rows[(current.order+result.length*23)%rows.length];
    if(row&&!result.some(item=>item.id===row.id)&&row.meaning!==current.meaning)result.push(row);
  }
  return result.sort((a,b)=>((a.order*17+current.order*7)%101)-((b.order*17+current.order*7)%101));
}

export async function mount({main,signal}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page listen-page"><p class="eyebrow">Audio first</p><h1>Listen</h1><p class="lede">Preparing listening practice from your active vocabulary…</p><div class="inline-status">Loading listening evidence…</div></section>';
  const [index,srs,learner,recent]=await Promise.all([
    loadVocabularySearchIndex(signal),
    readAllSrsRecords(),
    ensureCanonicalLearnerState(),
    readReviewEventsSince(Date.now()-30*86_400_000,20_000)
  ]);
  if(signal.aborted)return;

  const started=new Set(srs.filter(row=>row.skill==='recognition'&&(row.seen>0||row.status!=='new')).map(row=>row.noteId));
  const preferred=index.rows.filter(row=>started.has(row.id));
  const queue=(preferred.length?preferred:index.rows.filter(row=>row.level==='A1')).slice(0,200);
  const attempts=recent.filter(row=>row.practiceOnly&&(row.practice==='listening'||row.practice==='dictation'));
  const correct=attempts.filter(row=>row.correct).length;
  const settings=object(learner.settings);
  const gradingMode=(['strict','learning','lenient'].includes(String(settings.gradingMode))?String(settings.gradingMode):'learning') as GradingMode;

  let cursor=0,mode:ListenMode='meaning',revealed=false,answered=false,startedAt=performance.now();

  main.innerHTML=`
  <section class="page listen-page">
    <p class="eyebrow">Listening in context</p>
    <h1>Listen</h1>
    <p class="lede">Hear French before reading it. Replays and transcripts are support; your first answer is recorded separately from spaced repetition.</p>
    <div class="listen-stats">
      <span><strong>${attempts.length}</strong> attempts / 30d</span>
      <span><strong>${attempts.length?Math.round(correct/attempts.length*100):0}%</strong> accuracy</span>
      <span><strong>${queue.length}</strong> available targets</span>
    </div>
    <div class="listen-tabs" role="tablist">
      <button type="button" data-mode="meaning" class="is-active">Meaning</button>
      <button type="button" data-mode="dictation">Dictation</button>
    </div>
    <article class="listen-card" data-card></article>
  </section>`;
  const card=main.querySelector<HTMLElement>('[data-card]');
  if(!card)return;

  const setMode=(next:ListenMode)=>{
    mode=next;answered=false;revealed=false;startedAt=performance.now();
    main.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(button=>button.classList.toggle('is-active',button.dataset.mode===next));
    void render();
  };
  main.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.mode as ListenMode)));

  const next=()=>{cursor=(cursor+1)%Math.max(1,queue.length);answered=false;revealed=false;startedAt=performance.now();void render();};

  const render=async()=>{
    if(signal.aborted)return;
    const meta=queue[cursor];
    if(!meta){card.innerHTML='<p>No listening targets are available yet.</p>';return;}
    const raw=await loadVocabularyWord(meta.id,signal);
    if(signal.aborted)return;
    if(!raw){next();return;}
    const word=reviewWord(raw);
    card.replaceChildren();

    const head=document.createElement('div');head.className='listen-card-head';
    const progress=document.createElement('span');progress.textContent=(cursor+1)+' / '+queue.length+' · '+meta.level;
    const label=document.createElement('strong');label.textContent=mode==='meaning'?'Listen for meaning':'Type exactly what you hear';
    head.append(progress,label);

    const player=document.createElement('div');player.className='listen-player';
    const play=document.createElement('button');play.type='button';play.className='primary-action compact-action';play.textContent='▶ Play French';
    const slow=document.createElement('button');slow.type='button';slow.className='secondary-action compact-action';slow.textContent='0.72×';
    play.addEventListener('click',()=>speak(word.word,1));
    slow.addEventListener('click',()=>speak(word.word,.72));
    player.append(play,slow);

    const transcript=document.createElement('div');transcript.className='listen-transcript';transcript.hidden=!revealed&& !answered;
    const term=document.createElement('strong');term.lang='fr';term.textContent=word.word;
    const ipa=document.createElement('span');ipa.textContent=word.ipa;
    const meaning=document.createElement('span');meaning.textContent=word.meaning;
    transcript.append(term,ipa,meaning);

    const reveal=document.createElement('button');reveal.type='button';reveal.className='secondary-action compact-action';reveal.textContent='Reveal transcript';
    reveal.hidden=answered;
    reveal.addEventListener('click',()=>{revealed=true;transcript.hidden=false;reveal.hidden=true;});

    const response=document.createElement('div');response.className='listen-response';
    if(mode==='meaning'){
      const options=document.createElement('div');options.className='listen-options';
      for(const option of choiceRows(meta,index.rows)){
        const button=document.createElement('button');button.type='button';button.textContent=option.meaning;button.disabled=answered;
        button.addEventListener('click',async()=>{
          if(answered)return;answered=true;
          const ok=option.id===meta.id,responseMs=Math.round(performance.now()-startedAt);
          await recordStandalonePractice({
            noteId:meta.id,skill:'listening',practice:'listening',correct:ok,responseMs,
            level:meta.level,pos:meta.pos,direction:'audio-en',xp:ok?4:1
          });
          button.classList.add(ok?'is-correct':'is-wrong');
          for(const control of options.querySelectorAll<HTMLButtonElement>('button')){
            control.disabled=true;
            if(control.textContent===meta.meaning)control.classList.add('is-correct');
          }
          transcript.hidden=false;reveal.hidden=true;finish.textContent=ok?'Correct.':'Answer: '+meta.meaning;nextButton.hidden=false;
        });
        options.append(button);
      }
      response.append(options);
    }else{
      const form=document.createElement('form');form.className='listen-dictation';
      const input=document.createElement('input');input.type='text';input.autocomplete='off';input.spellcheck=false;input.placeholder='Type the French word';input.setAttribute('aria-label','French dictation answer');
      const check=document.createElement('button');check.type='submit';check.className='primary-action compact-action';check.textContent='Check';
      form.append(input,check);
      form.addEventListener('submit',event=>{
        event.preventDefault();if(answered)return;
        const result=gradeTypedAnswer(input.value,word,{skill:'listening',direction:'audio-fr',strictArticles:false,gradingMode});
        answered=true;input.disabled=true;check.disabled=true;
        const responseMs=Math.round(performance.now()-startedAt);
        void recordStandalonePractice({
          noteId:meta.id,skill:'listening',practice:'dictation',correct:result.correct,responseMs,typed:true,
          typedQuality:result.quality,level:meta.level,pos:meta.pos,direction:'audio-fr',xp:result.correct?5:1
        });
        transcript.hidden=false;reveal.hidden=true;finish.textContent=result.label;nextButton.hidden=false;
      });
      response.append(form);
      queueMicrotask(()=>input.focus());
    }

    const finish=document.createElement('p');finish.className='grade-feedback';finish.hidden=false;finish.textContent='';
    const nextButton=document.createElement('button');nextButton.type='button';nextButton.className='secondary-action compact-action';nextButton.textContent='Next';nextButton.hidden=true;nextButton.addEventListener('click',next);

    card.append(head,player,transcript,reveal,response,finish,nextButton);
    if(cursor===0&&!answered)setTimeout(()=>{if(!signal.aborted)speak(word.word,1);},120);
  };

  await render();
  signal.addEventListener('abort',()=>{if('speechSynthesis' in window)speechSynthesis.cancel();},{once:true});
}
