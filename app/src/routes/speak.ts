import type { RouteContext } from '../core/types';
import { loadVocabularySearchIndex,loadVocabularyWord,type VocabularyWord } from '../core/content/loader';
import { readRecentReviewEvents,recordPracticeEvidence } from '../core/learner/repository';
import { levenshtein } from '../core/learner/grader';

type Mode='pronunciation'|'shadowing'|'recall'|'transfer';
type RecognitionLike={
  lang:string;interimResults:boolean;maxAlternatives:number;
  start:()=>void;stop:()=>void;
  onresult:((event:any)=>void)|null;onerror:((event:any)=>void)|null;onend:(()=>void)|null;
};
type RecognitionCtor=new()=>RecognitionLike;
type Prompt={word:VocabularyWord;text:string;translation:string};

function normalize(value:string):string{return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr').replace(/[’']/g,"'").replace(/[^a-z0-9' -]/g,' ').replace(/\s+/g,' ').trim();}
function similarity(a:string,b:string):number{
  const x=normalize(a),y=normalize(b);if(!x||!y)return 0;if(x===y)return 100;
  return Math.max(0,Math.round((1-levenshtein(x,y)/Math.max(x.length,y.length,1))*100));
}
function verdict(score:number):string{
  if(score>=96)return'Recognizer heard the target clearly.';
  if(score>=82)return'Recognizer heard a close form. Check rhythm and missing words yourself.';
  if(score>=60)return'Recognizer heard part of the target. This is not a pronunciation failure.';
  return'Recognizer was uncertain. Use playback and self-assessment rather than treating this as a score.';
}
function recognitionCtor():RecognitionCtor|undefined{
  const w=window as unknown as {SpeechRecognition?:RecognitionCtor;webkitSpeechRecognition?:RecognitionCtor};
  return w.SpeechRecognition??w.webkitSpeechRecognition;
}
function say(text:string,rate=.85):boolean{
  if(!('speechSynthesis' in window))return false;
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);utterance.lang='fr-FR';utterance.rate=rate;
  const voices=window.speechSynthesis.getVoices().filter(voice=>voice.lang.toLowerCase().startsWith('fr'));
  if(voices[0])utterance.voice=voices[0];
  window.speechSynthesis.speak(utterance);return true;
}
function unique(values:string[],limit:number):string[]{
  const result:string[]=[],seen=new Set<string>();for(const value of values){if(value&&!seen.has(value)){seen.add(value);result.push(value);if(result.length>=limit)break;}}return result;
}
function modeName(mode:Mode):string{return mode==='pronunciation'?'Pronunciation':mode==='shadowing'?'Shadowing':mode==='recall'?'Spoken recall':'Spoken transfer';}

export async function mount({main,signal}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page practice-page speak-workspace"><p class="eyebrow">Spoken production</p><h1>Speak</h1><p class="lede">Record locally, compare intelligibility conservatively, and self-assess. Recognition is optional and is never an accent score.</p><div class="mode-tabs" role="group" aria-label="Speaking mode"><button data-mode="pronunciation" class="is-active" type="button">Pronunciation</button><button data-mode="shadowing" type="button">Shadowing</button><button data-mode="recall" type="button">Spoken recall</button><button data-mode="transfer" type="button">Spoken transfer</button></div><p class="inline-status" data-status>Preparing speaking prompts…</p><div data-practice></div></section>';
  const host=main.querySelector<HTMLElement>('[data-practice]');
  const status=main.querySelector<HTMLElement>('[data-status]');
  if(!host||!status)return;

  const [index,events]=await Promise.all([loadVocabularySearchIndex(signal),readRecentReviewEvents(1000)]);
  if(signal.aborted)return;
  const selected=sessionStorage.getItem('french-vnext-speak-note')??'';sessionStorage.removeItem('french-vnext-speak-note');
  const weak=events.filter(event=>event.practiceOnly!==true&&!event.correct).map(event=>event.noteId);
  const ids=unique([selected,...weak,...events.filter(event=>event.practiceOnly!==true).map(event=>event.noteId),...index.rows.map(row=>row.id)],50);
  const prompts:Prompt[]=[];
  for(const id of ids){
    const word=await loadVocabularyWord(id,signal);if(signal.aborted)return;
    if(!word?.word||!word.meaning)continue;
    const sentence=word.sentences?.find(item=>item?.text&&item?.translation)??word.sentences?.find(item=>item?.text);
    prompts.push({word,text:sentence?.text??word.word,translation:sentence?.translation??word.meaning});
    if(prompts.length>=10)break;
  }
  if(!prompts.length){status.textContent='No speaking material is available.';return;}

  const Recognition=recognitionCtor();
  let mode:Mode='pronunciation',cursor=0;
  let recognition:RecognitionLike|null=null,stream:MediaStream|null=null,recorder:MediaRecorder|null=null,audioUrl='',chunks:Blob[]=[];
  const revokeAudio=()=>{if(audioUrl){URL.revokeObjectURL(audioUrl);audioUrl='';}};
  const stopStream=()=>{recorder=null;for(const track of stream?.getTracks()??[])track.stop();stream=null;chunks=[];};
  const discardRecording=()=>{try{if(recorder?.state==='recording')recorder.stop();}catch{}revokeAudio();stopStream();};
  const modeButtons=[...main.querySelectorAll<HTMLButtonElement>('[data-mode]')];

  const setMode=(next:Mode)=>{
    recognition?.stop();recognition=null;discardRecording();mode=next;cursor=0;
    for(const button of modeButtons)button.classList.toggle('is-active',button.dataset.mode===mode);
    render();
  };
  for(const button of modeButtons)button.addEventListener('click',()=>setMode(button.dataset.mode as Mode));

  const render=()=>{
    recognition?.stop();recognition=null;discardRecording();
    const prompt=prompts[cursor%prompts.length];
    const target=mode==='pronunciation'?prompt.word.word:prompt.text;
    const cue=mode==='pronunciation'?prompt.word.meaning:prompt.translation;
    let support=mode==='pronunciation'||mode==='shadowing'?1:0;
    let modelUsed=false,revealUsed=false,recognized='',recognitionScore=0,started=performance.now(),saved=false;

    host.innerHTML='<article class="practice-card speak-card"><div class="practice-meta"><span data-count></span><span data-mode-label></span></div><p class="practice-meaning" data-cue></p><div class="speak-target" data-target></div><div class="practice-feedback speech-principle">Speech recognition checks intelligibility only. It is not an accent or pronunciation score.</div><div class="practice-controls"><button class="primary-action compact-action" data-model type="button">Play model</button><button class="secondary-action compact-action" data-record type="button">Start recording</button><button class="secondary-action compact-action" data-recognize type="button">Check recognition</button><button class="secondary-action compact-action" data-reveal type="button">Reveal target</button></div><audio data-playback controls hidden></audio><div class="practice-feedback" data-feedback>Record one attempt, play it back, then use recognition or self-assessment if useful.</div><div class="self-assess"><span>Self-assessment</span><div><button data-self="again" type="button">Needs work</button><button data-self="hard" type="button">Understandable</button><button data-self="good" type="button">Good</button></div></div><button class="secondary-action compact-action" data-next type="button">Next prompt</button></article>';
    const count=host.querySelector<HTMLElement>('[data-count]');if(count)count.textContent=(cursor%prompts.length+1)+' / '+prompts.length;
    const modeLabel=host.querySelector<HTMLElement>('[data-mode-label]');if(modeLabel)modeLabel.textContent=modeName(mode);
    const cueNode=host.querySelector<HTMLElement>('[data-cue]');if(cueNode)cueNode.textContent=cue;
    const targetNode=host.querySelector<HTMLElement>('[data-target]');
    const feedback=host.querySelector<HTMLElement>('[data-feedback]');
    const model=host.querySelector<HTMLButtonElement>('[data-model]');
    const record=host.querySelector<HTMLButtonElement>('[data-record]');
    const recognize=host.querySelector<HTMLButtonElement>('[data-recognize]');
    const reveal=host.querySelector<HTMLButtonElement>('[data-reveal]');
    const playback=host.querySelector<HTMLAudioElement>('[data-playback]');
    const next=host.querySelector<HTMLButtonElement>('[data-next]');
    const assess=[...host.querySelectorAll<HTMLButtonElement>('[data-self]')];

    const showTarget=()=>{
      if(!targetNode)return;
      targetNode.textContent=target;
      targetNode.hidden=false;
      if(mode==='pronunciation'&&prompt.word.ipa)targetNode.append(textNode('small',prompt.word.ipa,'word-ipa speak-ipa'));
    };
    function textNode(tag:string,value:string,className=''):HTMLElement{const el=document.createElement(tag);el.textContent=value;if(className)el.className=className;return el;}
    if(mode==='pronunciation'||mode==='shadowing')showTarget();else if(targetNode)targetNode.hidden=true;
    if(mode==='pronunciation')reveal!.hidden=true;
    if(!Recognition&&recognize){recognize.disabled=true;recognize.textContent='Recognition unavailable';}

    model?.addEventListener('click',()=>{
      modelUsed=true;support=Math.max(support,1);if(mode==='recall'||mode==='transfer')support=Math.max(support,2);
      if(!say(target,mode==='pronunciation'?.75:.85))status.textContent='Speech synthesis is unavailable in this browser.';
    });
    reveal?.addEventListener('click',()=>{revealUsed=true;support=Math.max(support,2);showTarget();reveal.disabled=true;});

    record?.addEventListener('click',async()=>{
      if(recorder?.state==='recording'){recorder.stop();record.disabled=true;record.textContent='Finishing…';return;}
      if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){
        if(feedback)feedback.textContent='Temporary browser recording is unavailable. You can still use model playback, recognition, and self-assessment.';return;
      }
      try{
        discardRecording();
        stream=await navigator.mediaDevices.getUserMedia({audio:true});
        chunks=[];recorder=new MediaRecorder(stream);
        recorder.ondataavailable=event=>{if(event.data.size)chunks.push(event.data);};
        recorder.onstop=()=>{
          const blob=new Blob(chunks,{type:recorder?.mimeType||'audio/webm'});revokeAudio();audioUrl=URL.createObjectURL(blob);
          if(playback){playback.src=audioUrl;playback.hidden=false;}
          record.disabled=false;record.textContent='Record again';stopStream();
          if(feedback)feedback.textContent='Recording kept only in this tab. Play it back, then self-assess.';
        };
        recorder.start();record.textContent='Stop recording';
        if(feedback)feedback.textContent='Recording locally… nothing is uploaded.';
      }catch(error){
        stopStream();record.textContent='Start recording';
        if(feedback)feedback.textContent='Microphone recording was unavailable or permission was denied.';
        console.warn('French temporary recording unavailable',error);
      }
    });

    recognize?.addEventListener('click',()=>{
      if(!Recognition)return;
      recognition?.stop();recognition=new Recognition();recognition.lang='fr-FR';recognition.interimResults=false;recognition.maxAlternatives=1;
      recognize.disabled=true;recognize.textContent='Listening…';
      recognition.onresult=(event:any)=>{
        recognized=String(event?.results?.[0]?.[0]?.transcript??'').trim();recognitionScore=similarity(recognized,target);
        if(feedback)feedback.textContent='Heard: “'+recognized+'” · '+verdict(recognitionScore);
      };
      recognition.onerror=()=>{if(feedback)feedback.textContent='Recognition failed. This does not count as learner failure; use playback and self-assessment.';};
      recognition.onend=()=>{recognize.disabled=false;recognize.textContent='Check recognition';recognition=null;};
      recognition.start();
    });

    const saveAssessment=async(rating:string)=>{
      if(saved)return;saved=true;for(const button of assess)button.disabled=true;
      const correct=rating!=='again';
      const row=index.rows.find(item=>item.id===prompt.word.id);
      try{
        await recordPracticeEvidence({
          noteId:prompt.word.id,skill:'production',practice:'spoken-'+mode,direction:'spoken-fr',
          correct,typed:false,typedQuality:'self-'+rating,responseMs:Math.round(performance.now()-started),
          level:prompt.word.level??row?.level??'',pos:prompt.word.pos??row?.pos??'',supportLevel:support,
          errorCategory:recognized?(recognitionScore>=82?'':'recognition-uncertain'):(correct?'':'self-assessed-repair')
        });
        status.textContent=modeName(mode)+' evidence saved as practice-only · SRS unchanged.';
      }catch(error){saved=false;for(const button of assess)button.disabled=false;status.textContent='Could not save speaking evidence.';console.error(error);}
    };
    for(const button of assess)button.addEventListener('click',()=>void saveAssessment(button.dataset.self??'again'));
    next?.addEventListener('click',()=>{cursor=(cursor+1)%prompts.length;render();});
  };

  status.textContent=(Recognition?'Recognition available · ':'Recognition optional/unavailable · ')+'recordings remain temporary and local.';
  render();
  signal.addEventListener('abort',()=>{recognition?.stop();discardRecording();if('speechSynthesis' in window)window.speechSynthesis.cancel();},{once:true});
}
