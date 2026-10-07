import type { RouteContext } from '../core/types';
import { loadVocabularySearchIndex,loadVocabularyWord,type VocabularyWord } from '../core/content/loader';
import { readRecentReviewEvents } from '../core/learner/repository';

type RecognitionLike={
  lang:string;interimResults:boolean;maxAlternatives:number;
  start:()=>void;stop:()=>void;
  onresult:((event:any)=>void)|null;
  onerror:((event:any)=>void)|null;
  onend:(()=>void)|null;
};
type RecognitionCtor=new()=>RecognitionLike;

function fold(value:string):string{return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr').replace(/[’']/g,"'").replace(/[^a-z0-9' -]/g,'').trim();}
function similarity(a:string,b:string):number{
  const x=fold(a),y=fold(b);if(!x||!y)return 0;if(x===y)return 100;
  const xa=new Set(x.split(/\s+/)),ya=new Set(y.split(/\s+/));let common=0;for(const token of xa)if(ya.has(token))common++;
  return Math.round(common/Math.max(xa.size,ya.size)*100);
}
function speakModel(text:string):boolean{
  if(!('speechSynthesis' in window))return false;
  window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='fr-FR';utterance.rate=.82;window.speechSynthesis.speak(utterance);return true;
}
function recognitionCtor():RecognitionCtor|undefined{
  const w=window as unknown as {SpeechRecognition?:RecognitionCtor;webkitSpeechRecognition?:RecognitionCtor};
  return w.SpeechRecognition??w.webkitSpeechRecognition;
}

export async function mount({main,signal}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page practice-page"><p class="eyebrow">Pronunciation & shadowing</p><h1>Speak</h1><p class="lede">Hear a model, repeat it aloud, and compare browser speech recognition when the device supports it.</p><p class="inline-status" data-status>Preparing speaking prompts…</p><div data-practice></div></section>';
  const host=main.querySelector<HTMLElement>('[data-practice]');
  const status=main.querySelector<HTMLElement>('[data-status]');
  if(!host||!status)return;
  const [index,events]=await Promise.all([loadVocabularySearchIndex(signal),readRecentReviewEvents(300)]);
  const ids:string[]=[];const seen=new Set<string>();
  for(const id of [...events.map(event=>event.noteId),...index.rows.map(row=>row.id)]){
    if(id&&!seen.has(id)){seen.add(id);ids.push(id);if(ids.length>=8)break;}
  }
  const words:VocabularyWord[]=[];
  for(const id of ids){const word=await loadVocabularyWord(id,signal);if(word?.word&&word.meaning)words.push(word);}
  if(!words.length){status.textContent='No vocabulary is available for speaking practice.';return;}

  const Recognition=recognitionCtor();
  let cursor=0,recognition:RecognitionLike|null=null;
  const render=()=>{
    const word=words[cursor%words.length];
    host.innerHTML='<article class="practice-card"><div class="practice-meta"><span data-count></span><span>Shadowing</span></div><p class="practice-meaning" data-meaning></p><h2 data-word></h2><div class="practice-controls"><button class="primary-action compact-action" data-model type="button">Play model</button><button class="secondary-action compact-action" data-record type="button">Speak now</button><button class="secondary-action compact-action" data-next type="button">Next prompt</button></div><div class="practice-feedback" data-feedback><span>Repeat the French phrase aloud after the model.</span></div></article>';
    const wordNode=host.querySelector<HTMLElement>('[data-word]');if(wordNode)wordNode.textContent=word.word;
    const meaning=host.querySelector<HTMLElement>('[data-meaning]');if(meaning)meaning.textContent=word.meaning;
    const count=host.querySelector<HTMLElement>('[data-count]');if(count)count.textContent=(cursor%words.length+1)+' / '+words.length;
    const feedback=host.querySelector<HTMLElement>('[data-feedback]');
    const record=host.querySelector<HTMLButtonElement>('[data-record]');
    host.querySelector<HTMLButtonElement>('[data-model]')?.addEventListener('click',()=>{if(!speakModel(word.word))status.textContent='Speech synthesis is unavailable in this browser.';});
    host.querySelector<HTMLButtonElement>('[data-next]')?.addEventListener('click',()=>{recognition?.stop();recognition=null;cursor++;render();});
    if(!Recognition&&record){record.disabled=true;record.textContent='Recognition unavailable';if(feedback)feedback.textContent='Use the model for shadowing. This browser does not expose French speech recognition.';}
    record?.addEventListener('click',()=>{
      if(!Recognition)return;
      recognition?.stop();
      recognition=new Recognition();recognition.lang='fr-FR';recognition.interimResults=false;recognition.maxAlternatives=1;
      record.disabled=true;record.textContent='Listening…';if(feedback)feedback.textContent='Speak the phrase once.';
      recognition.onresult=(event:any)=>{
        const transcript=String(event?.results?.[0]?.[0]?.transcript??'').trim();
        const score=similarity(transcript,word.word);
        if(feedback)feedback.textContent='Heard: “'+transcript+'” · '+score+'% phrase match.';
      };
      recognition.onerror=()=>{if(feedback)feedback.textContent='Recognition failed. Replay the model and try again.';};
      recognition.onend=()=>{record.disabled=false;record.textContent='Speak again';recognition=null;};
      recognition.start();
    });
    queueMicrotask(()=>speakModel(word.word));
  };
  status.textContent=Recognition?'Microphone recognition available · nothing is uploaded by French.':'Shadowing mode ready · browser recognition is unavailable.';
  render();
  signal.addEventListener('abort',()=>{recognition?.stop();if('speechSynthesis' in window)window.speechSynthesis.cancel();},{once:true});
}
