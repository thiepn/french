import type { RouteContext } from '../core/types';
import {
  readAllSrsRecords,
  readReviewEventsSince,
  recordStandalonePractice
} from '../core/learner/repository';
import { loadVocabularySearchIndex,loadVocabularyWord,type VocabularySearchRow,type VocabularyWord } from '../core/content/loader';

type SpeakMode='pronunciation'|'shadow'|'recall';

function normalize(value:string):string{
  return value.toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim().replace(/\s+/g,' ');
}
function similarity(a:string,b:string):number{
  const left=[...normalize(a)],right=[...normalize(b)];
  if(!left.length||!right.length)return 0;
  const row=Array.from({length:right.length+1},(_,i)=>i);
  for(let i=1;i<=left.length;i++){
    let previous=row[0];row[0]=i;
    for(let j=1;j<=right.length;j++){
      const saved=row[j];
      row[j]=Math.min(row[j]+1,row[j-1]+1,previous+(left[i-1]===right[j-1]?0:1));
      previous=saved;
    }
  }
  return Math.max(0,1-row[right.length]/Math.max(left.length,right.length));
}
function speakFrench(text:string,rate=.92):void{
  if(!('speechSynthesis' in window))return;
  speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);utterance.lang='fr-FR';utterance.rate=rate;
  const voices=speechSynthesis.getVoices().filter(voice=>/^fr([-_]|$)/i.test(voice.lang));
  if(voices[0])utterance.voice=voices[0];
  speechSynthesis.speak(utterance);
}
function firstExample(word:VocabularyWord):{fr:string;en:string}{
  const example=word.sentences?.find(item=>item?.text)||word.sentences?.[0];
  return{fr:example?.text??'',en:example?.translation??''};
}

export async function mount({main,signal}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page speak-page"><p class="eyebrow">Spoken production</p><h1>Speak</h1><p class="lede">Preparing pronunciation and retrieval targets…</p><div class="inline-status">Loading spoken evidence…</div></section>';
  const [index,srs,recent]=await Promise.all([
    loadVocabularySearchIndex(signal),
    readAllSrsRecords(),
    readReviewEventsSince(Date.now()-30*86_400_000,20_000)
  ]);
  if(signal.aborted)return;
  const started=new Set(srs.filter(row=>row.skill==='recognition'&&(row.seen>0||row.status!=='new')).map(row=>row.noteId));
  const active=index.rows.filter(row=>started.has(row.id));
  const queue=(active.length?active:index.rows.filter(row=>row.level==='A1')).slice(0,160);
  const evidence=recent.filter(row=>row.practiceOnly&&row.practice==='speaking');
  const success=evidence.filter(row=>row.correct).length;

  let cursor=0,mode:SpeakMode='pronunciation',revealed=false,recording=false;
  let stream:MediaStream|null=null,recorder:MediaRecorder|null=null,chunks:BlobPart[]=[];
  let audioUrl='',recognized='',recognition:any=null,startedAt=performance.now();

  main.innerHTML=`
  <section class="page speak-page">
    <p class="eyebrow">Spoken production</p>
    <h1>Speak</h1>
    <p class="lede">Hear → imitate → retrieve. Recording stays on this device. Browser speech recognition is an optional intelligibility hint, never an automatic learner grade.</p>
    <div class="speak-stats">
      <span><strong>${evidence.length}</strong> attempts / 30d</span>
      <span><strong>${evidence.length?Math.round(success/evidence.length*100):0}%</strong> self-confirmed</span>
      <span><strong>${queue.length}</strong> active targets</span>
    </div>
    <div class="speak-tabs">
      <button type="button" data-mode="pronunciation" class="is-active">Pronunciation</button>
      <button type="button" data-mode="shadow">Shadow</button>
      <button type="button" data-mode="recall">Recall</button>
    </div>
    <article class="speak-card" data-card></article>
  </section>`;
  const card=main.querySelector<HTMLElement>('[data-card]');
  if(!card)return;

  const cleanRecording=()=>{
    try{recorder?.state==='recording'&&recorder.stop();}catch{}
    try{recognition?.abort?.();}catch{}
    recognition=null;recorder=null;recording=false;
    stream?.getTracks().forEach(track=>track.stop());stream=null;
    if(audioUrl){URL.revokeObjectURL(audioUrl);audioUrl='';}
    chunks=[];recognized='';
  };
  const setMode=(next:SpeakMode)=>{
    cleanRecording();mode=next;revealed=next!=='recall';startedAt=performance.now();
    main.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(button=>button.classList.toggle('is-active',button.dataset.mode===next));
    void render();
  };
  main.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.mode as SpeakMode)));

  const next=()=>{cleanRecording();cursor=(cursor+1)%Math.max(1,queue.length);revealed=mode!=='recall';startedAt=performance.now();void render();};

  const render=async()=>{
    if(signal.aborted)return;
    const meta=queue[cursor];
    if(!meta){card.innerHTML='<p>No spoken targets are available yet.</p>';return;}
    const word=await loadVocabularyWord(meta.id,signal);
    if(!word||signal.aborted){if(!signal.aborted)next();return;}
    const example=firstExample(word);
    const target=mode==='shadow'?(example.fr||word.word):word.word;
    const prompt=mode==='recall'?word.meaning:mode==='shadow'?(example.en||'Repeat the model with the same rhythm'):'Pronounce the French clearly';
    card.replaceChildren();

    const head=document.createElement('div');head.className='speak-card-head';
    const count=document.createElement('span');count.textContent=(cursor+1)+' / '+queue.length+' · '+meta.level;
    const modeLabel=document.createElement('strong');modeLabel.textContent=mode==='pronunciation'?'Pronunciation':mode==='shadow'?'Shadow connected speech':'Meaning → spoken French';
    head.append(count,modeLabel);

    const promptBox=document.createElement('div');promptBox.className='speak-prompt';
    const promptText=document.createElement('p');promptText.textContent=prompt;promptBox.append(promptText);
    const targetText=document.createElement('h2');targetText.lang='fr';targetText.textContent=revealed?target:'Speak before revealing';
    targetText.classList.toggle('is-hidden-target',!revealed);promptBox.append(targetText);
    if(word.ipa&&mode!=='shadow'&&revealed){const ipa=document.createElement('span');ipa.className='word-ipa';ipa.textContent=word.ipa;promptBox.append(ipa);}

    const model=document.createElement('div');model.className='speak-model';
    const hear=document.createElement('button');hear.type='button';hear.className='secondary-action compact-action';hear.textContent='Hear model';hear.addEventListener('click',()=>speakFrench(target,.92));
    const slow=document.createElement('button');slow.type='button';slow.className='secondary-action compact-action';slow.textContent='Slow model';slow.addEventListener('click',()=>speakFrench(target,.7));
    model.append(hear,slow);
    if(!revealed){
      const reveal=document.createElement('button');reveal.type='button';reveal.className='secondary-action compact-action';reveal.textContent='Reveal target';
      reveal.addEventListener('click',()=>{revealed=true;void render();});model.append(reveal);
    }

    const recordingBox=document.createElement('div');recordingBox.className='speak-recording';
    const record=document.createElement('button');record.type='button';record.className='primary-action compact-action';record.textContent=recording?'Stop recording':'Record me';
    const playMine=document.createElement('button');playMine.type='button';playMine.className='secondary-action compact-action';playMine.textContent='Play mine';playMine.disabled=!audioUrl;
    const capability=document.createElement('span');capability.textContent=navigator.mediaDevices?.getUserMedia?'Microphone available':'Microphone unavailable · self-assessment still works';
    recordingBox.append(record,playMine,capability);

    const recognitionBox=document.createElement('div');recognitionBox.className='speak-recognition';
    if(recognized){
      const recognizedLabel=document.createElement('span');recognizedLabel.textContent='Browser heard';
      const recognizedText=document.createElement('strong');recognizedText.textContent=recognized;
      const match=document.createElement('small');match.textContent=Math.round(similarity(recognized,target)*100)+'% text similarity · recognition can be wrong';
      recognitionBox.append(recognizedLabel,recognizedText,match);
    }else{
      recognitionBox.textContent='Optional recognition feedback will appear here when supported.';
    }

    const verdict=document.createElement('div');verdict.className='speak-verdict';
    const good=document.createElement('button');good.type='button';good.className='primary-action compact-action';good.textContent='I got it';
    const retry=document.createElement('button');retry.type='button';retry.className='secondary-action compact-action';retry.textContent='Needs work';
    const nextButton=document.createElement('button');nextButton.type='button';nextButton.className='secondary-action compact-action';nextButton.textContent='Next';nextButton.hidden=true;
    verdict.append(good,retry,nextButton);

    const saveVerdict=async(ok:boolean)=>{
      good.disabled=true;retry.disabled=true;revealed=true;
      await recordStandalonePractice({
        noteId:meta.id,skill:'production',practice:'speaking',correct:ok,
        responseMs:Math.round(performance.now()-startedAt),level:meta.level,pos:meta.pos,direction:mode==='recall'?'en-fr':'fr-fr',xp:ok?5:1
      });
      nextButton.hidden=false;
      targetText.textContent=target;targetText.classList.remove('is-hidden-target');
    };
    good.addEventListener('click',()=>void saveVerdict(true));
    retry.addEventListener('click',()=>void saveVerdict(false));
    nextButton.addEventListener('click',next);

    record.addEventListener('click',async()=>{
      if(recording){
        recording=false;record.textContent='Record me';
        try{recorder?.stop();}catch{}
        try{recognition?.stop?.();}catch{}
        return;
      }
      try{
        stream=await navigator.mediaDevices.getUserMedia({audio:true});
        chunks=[];
        recorder=new MediaRecorder(stream);
        recorder.ondataavailable=event=>{if(event.data?.size)chunks.push(event.data);};
        recorder.onstop=()=>{
          stream?.getTracks().forEach(track=>track.stop());stream=null;
          if(audioUrl)URL.revokeObjectURL(audioUrl);
          audioUrl=URL.createObjectURL(new Blob(chunks,{type:recorder?.mimeType||'audio/webm'}));
          playMine.disabled=false;recording=false;record.textContent='Record me';
        };
        recorder.start();recording=true;record.textContent='Stop recording';

        const Recognition=(window as any).SpeechRecognition||(window as any).webkitSpeechRecognition;
        if(Recognition){
          recognition=new Recognition();recognition.lang='fr-FR';recognition.interimResults=false;recognition.maxAlternatives=1;
          recognition.onresult=(event:any)=>{recognized=String(event.results?.[0]?.[0]?.transcript||'');void render();};
          recognition.onerror=()=>{recognition=null;};
          try{recognition.start();}catch{}
        }
      }catch(error){
        capability.textContent='Microphone permission unavailable · use model + self-assessment.';
        console.warn('French speaking recorder unavailable.',error);
      }
    });
    playMine.addEventListener('click',()=>{if(audioUrl)new Audio(audioUrl).play().catch(()=>{});});

    card.append(head,promptBox,model,recordingBox,recognitionBox,verdict);
  };

  await render();
  signal.addEventListener('abort',()=>{cleanRecording();if('speechSynthesis' in window)speechSynthesis.cancel();},{once:true});
}
