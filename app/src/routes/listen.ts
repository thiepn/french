import type { RouteContext } from '../core/types';
import { loadVocabularySearchIndex,loadVocabularyWord,type VocabularyWord } from '../core/content/loader';
import { readRecentReviewEvents } from '../core/learner/repository';

function fold(value:string):string{return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr').replace(/[’']/g,"'").replace(/[^a-z0-9' -]/g,'').trim();}
function speak(text:string):boolean{
  if(!('speechSynthesis' in window))return false;
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);utterance.lang='fr-FR';utterance.rate=.88;
  window.speechSynthesis.speak(utterance);return true;
}
function sampleIds(recent:string[],fallback:string[],limit=10):string[]{
  const seen=new Set<string>(),result:string[]=[];
  for(const id of [...recent,...fallback]){if(id&&!seen.has(id)){seen.add(id);result.push(id);if(result.length>=limit)break;}}
  return result;
}

export async function mount({main,signal}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page practice-page"><p class="eyebrow">Focused listening</p><h1>Listen</h1><p class="lede">Short dictation practice loads only when opened. Audio uses the device French voice and never blocks app startup.</p><p class="inline-status" data-status>Preparing a listening set…</p><div data-practice></div></section>';
  const host=main.querySelector<HTMLElement>('[data-practice]');
  const status=main.querySelector<HTMLElement>('[data-status]');
  if(!host||!status)return;
  const [index,events]=await Promise.all([loadVocabularySearchIndex(signal),readRecentReviewEvents(300)]);
  if(signal.aborted)return;
  const recent=events.filter(event=>event.practiceOnly!==true).map(event=>event.noteId);
  const ids=sampleIds(recent,index.rows.map(row=>row.id),10);
  const words:VocabularyWord[]=[];
  for(const id of ids){
    const word=await loadVocabularyWord(id,signal);
    if(signal.aborted)return;
    if(word?.word&&word.meaning)words.push(word);
  }
  if(!words.length){status.textContent='No vocabulary is available for listening practice.';return;}

  let cursor=0,correct=0,attempted=0;
  const render=()=>{
    if(cursor>=words.length){
      host.innerHTML='<article class="practice-card practice-done"><h2>Listening set complete</h2><p data-summary></p><button class="secondary-action compact-action" data-restart type="button">Practice again</button></article>';
      const summary=host.querySelector<HTMLElement>('[data-summary]');if(summary)summary.textContent=correct+' / '+attempted+' exact dictations.';
      host.querySelector<HTMLButtonElement>('[data-restart]')?.addEventListener('click',()=>{cursor=0;correct=0;attempted=0;render();});
      status.textContent='Listening session complete.';return;
    }
    const word=words[cursor];
    host.innerHTML='<article class="practice-card"><div class="practice-meta"><span data-count></span><span>French dictation</span></div><h2>Listen, then type what you hear.</h2><button class="primary-action compact-action" data-play type="button">Play audio</button><form class="typed-answer practice-answer" data-form><input data-answer aria-label="Type what you hear" autocomplete="off" spellcheck="false" placeholder="Type French"><button class="primary-action compact-action" type="submit">Check</button><button class="secondary-action compact-action" data-reveal type="button">Reveal</button></form><div class="practice-feedback" data-feedback hidden></div><button class="secondary-action compact-action" data-next type="button" hidden>Next</button></article>';
    const count=host.querySelector<HTMLElement>('[data-count]');if(count)count.textContent=(cursor+1)+' / '+words.length;
    const play=host.querySelector<HTMLButtonElement>('[data-play]');
    const form=host.querySelector<HTMLFormElement>('[data-form]');
    const input=host.querySelector<HTMLInputElement>('[data-answer]');
    const feedback=host.querySelector<HTMLElement>('[data-feedback]');
    const next=host.querySelector<HTMLButtonElement>('[data-next]');
    const reveal=host.querySelector<HTMLButtonElement>('[data-reveal]');
    const finish=(value:string,revealed=false)=>{
      if(!feedback||!next||!input||!reveal)return;
      attempted++;
      const ok=!revealed&&fold(value)===fold(word.word);if(ok)correct++;
      feedback.hidden=false;
      feedback.textContent=(ok?'Correct. ':'Answer: ')+word.word+' — '+word.meaning;
      input.disabled=true;reveal.disabled=true;next.hidden=false;next.focus();
      status.textContent=correct+' correct of '+attempted+' attempted.';
    };
    play?.addEventListener('click',()=>{if(!speak(word.word))status.textContent='Speech synthesis is unavailable in this browser.';});
    form?.addEventListener('submit',event=>{event.preventDefault();if(input&&!input.disabled)finish(input.value);});
    reveal?.addEventListener('click',()=>{if(input&&!input.disabled)finish('',true);});
    next?.addEventListener('click',()=>{cursor++;render();queueMicrotask(()=>speak(words[cursor]?.word??''));});
    queueMicrotask(()=>{speak(word.word);input?.focus();});
  };
  status.textContent=words.length+' prompts ready · audio is generated on demand.';
  render();
  signal.addEventListener('abort',()=>{if('speechSynthesis' in window)window.speechSynthesis.cancel();},{once:true});
}
