import type { RouteContext } from '../core/types';
import {createOriginalMaterialPanel} from './u22-source-panel';
import { loadStableReadingPack,loadVocabularySearchIndex,loadVocabularyWord,type ReadingItem,type VocabularyWord,type VocabularySearchRow } from '../core/content/loader';
import { readRecentReviewEvents,recordPracticeEvidence } from '../core/learner/repository';
import { levenshtein } from '../core/learner/grader';
import { createFrenchPlayback } from './french-playback';
import {consumeSourceCompanion,sourceCompanionPanel} from './p35-source-companion';
import {loadSourceGraphState,persistSourceGraphState} from '../core/conversation/p35-storage';
import {sourceSupport} from '../core/conversation/p35-runtime';
import {createSourceHandoff,SOURCE_HANDOFF_KEY} from '../core/conversation/source-transfer';
import './p35-source-companion.css';

type Mode='comprehensible'|'intensive'|'targeted';
type Prompt={word:VocabularyWord;text:string;translation:string;repair:boolean;readingId?:string;readingTitle?:string;segmentIndex?:number;theme?:string};

function exact(value:string):string{return value.normalize('NFC').replace(/[‘’‛`´]/g,"'").toLocaleLowerCase('fr').trim().replace(/\s+/g,' ');}
function words(value:string):string{return exact(value).replace(/[.,!?;:«»()[\]{}]/g,' ').replace(/\s+/g,' ').trim();}
function accentFold(value:string):string{return words(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
function compact(value:string):string{return accentFold(value).replace(/[\s'-]+/g,'');}
function gradeSentence(answer:string,target:string):{correct:boolean;quality:string;error:string;label:string}{
  if(!answer.trim())return{correct:false,quality:'review',error:'lexical-item-not-recognized',label:'No answer entered'};
  if(exact(answer)===exact(target))return{correct:true,quality:'exact',error:'',label:'Accurate dictation'};
  if(words(answer)===words(target))return{correct:false,quality:'close',error:'orthography-after-correct-hearing',label:'Punctuation or spacing differs'};
  if(accentFold(answer)===accentFold(target))return{correct:false,quality:'close',error:'orthography-after-correct-hearing',label:'Accent or orthography differs'};
  if(compact(answer)===compact(target))return{correct:false,quality:'close',error:'word-boundary-segmentation',label:'Word-boundary / segmentation issue'};
  const a=accentFold(answer),b=accentFold(target);
  const score=1-levenshtein(a,b)/Math.max(a.length,b.length,1);
  if(score>=.78)return{correct:false,quality:'close',error:'connected-speech-form',label:'Close hearing · connected-speech or spelling issue'};
  return{correct:false,quality:'review',error:'lexical-item-not-recognized',label:'Lexical material not fully recognized'};
}
function cues(text:string):string[]{
  const result:string[]=[];
  if(/[cdjlmnstqu]['’][a-zàâçéèêëîïôûùüÿœ]/i.test(text))result.push('elision');
  if(/\bne\b.+\b(pas|plus|jamais|rien)\b/i.test(text))result.push('negative frame');
  if(/\b(un|des|les|mes|tes|ses|nos|vos|aux|en)\s+[aeiouhàâéèêëîïôùûü]/i.test(text))result.push('possible liaison environment');
  return result;
}
function uniqueIds(values:string[],limit:number):string[]{
  const seen=new Set<string>(),result:string[]=[];
  for(const id of values){if(id&&!seen.has(id)){seen.add(id);result.push(id);if(result.length>=limit)break;}}
  return result;
}
function supportLabel(level:number):string{return['Independent first listen','Replay / speed support','Transcript support','Translation support'][Math.max(0,Math.min(3,level))];}
function sentenceVocabulary(sentence:string,rows:VocabularySearchRow[],targets:string[]):VocabularySearchRow|undefined{
  const value=accentFold(sentence);
  const preferred=targets.map(target=>accentFold(target)).filter(Boolean);
  for(const target of preferred){
    const row=rows.find(item=>accentFold(item.word)===target||target.includes(accentFold(item.word))||accentFold(item.word).includes(target));
    if(row&&value.includes(accentFold(row.word)))return row;
  }
  return rows.find(row=>{
    const token=accentFold(row.word);
    return token.length>=3&&value.split(/\s+/).includes(token);
  });
}

export async function mount({main,signal,navigate}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page practice-page listen-contextual"><p class="eyebrow">Contextual listening</p><h1>Listen</h1><p class="lede">Sentence-level dictation with progressive support. Listening evidence is practice-only and never moves scheduled FSRS reviews.</p><div class="mode-tabs" role="group" aria-label="Listening mode"><button data-mode="comprehensible" class="is-active" type="button">Comprehensible</button><button data-mode="intensive" type="button">Intensive</button><button data-mode="targeted" type="button">Targeted</button></div><p class="inline-status" data-status>Preparing contextual listening…</p><div data-practice></div></section>';
  main.querySelector('.practice-page')?.append(createOriginalMaterialPanel('listen',signal,navigate));
  const host=main.querySelector<HTMLElement>('[data-practice]');
  const status=main.querySelector<HTMLElement>('[data-status]');
  if(!host||!status)return;
  const speech=createFrenchPlayback(signal);
  const sourceCompanion=await consumeSourceCompanion('listen');
  if(signal.aborted)return;
  if(sourceCompanion){
    const panel=sourceCompanionPanel('Original P35 dialogue · partner listening',
      'Listen to this original partner turn, then try transcribing it. Device speech is not verified audio, and no new listening grade, SRS credit or reply text is saved.');
    const scene=document.createElement('p');
    scene.textContent=sourceCompanion.graph.title+' · '+sourceCompanion.graph.goal;
    const actions=document.createElement('div');actions.className='p35-actions';
    const model=document.createElement('button');model.type='button';model.textContent='Play original partner';
    const slow=document.createElement('button');slow.type='button';slow.textContent='Play slowly';
    const reveal=document.createElement('button');reveal.type='button';reveal.textContent='Reveal transcript';
    const back=document.createElement('button');back.type='button';back.textContent='Return to original conversation';
    const continueWriting=document.createElement('button');
    continueWriting.type='button';continueWriting.textContent='Continue original conversation in Write';
    const draft=document.createElement('textarea');
    draft.setAttribute('aria-label','Transcribe original partner');draft.placeholder='What did the partner say in French?';
    const check=document.createElement('button');check.type='button';check.textContent='Check original transcription';
    const feedback=document.createElement('p');feedback.setAttribute('role','status');
    const transcript=document.createElement('p');transcript.hidden=true;transcript.textContent=sourceCompanion.prompt;
    let started=0,revealed=false;
    const play=(rate:number)=>{
      const requested=speech.play(sourceCompanion.prompt,rate,()=>{
        if(signal.aborted||!panel.isConnected)return;
        started++;
        feedback.textContent='Device French speech started · original source turn · no grade recorded.';
      },()=>{
        if(!signal.aborted&&panel.isConnected)
          feedback.textContent='Device speech did not start. Reveal the original transcript for written practice.';
      });
      if(!requested)feedback.textContent='Device speech unavailable. Reveal the source transcript to practise without audio.';
      else feedback.textContent='Device speech requested; listening evidence requires an actual start event.';
    };
    model.onclick=()=>play(1);
    slow.onclick=()=>play(.8);
    reveal.onclick=()=>{
      revealed=true;transcript.hidden=false;
      feedback.textContent='Transcript revealed. Any further check is written-source practice, not independent listening.';
    };
    check.onclick=()=>{
      const raw=draft.value.trim();
      if(!raw){feedback.textContent='Enter your own transcription first.';return;}
      const evaluated=gradeSentence(raw,sourceCompanion.prompt);
      feedback.textContent=(started>0&&!revealed?'After device-started audio':'Written-source only')+
        ' · '+evaluated.label+' · no new review, listening or CEFR evidence saved.';
    };
    back.onclick=()=>navigate('conversation');
    continueWriting.onclick=()=>{
      if(continueWriting.disabled||signal.aborted)return;
      continueWriting.disabled=true;
      void(async()=>{
        try{
          // Authoritative P35 active source state, not listening answer/grade.
          const state=await loadSourceGraphState();
          const active=state.active;
          if(!active||active.runId!==sourceCompanion.active.runId||
            active.scenarioId!==sourceCompanion.graph.id||
            active.nodeId!==sourceCompanion.active.nodeId)
            throw Error('SOURCE_DIALOGUE_CHANGED');
          const now=Date.now();
          const next=sourceSupport(state,2,now);
          await persistSourceGraphState(next);
          if(signal.aborted)return;
          sessionStorage.setItem(SOURCE_HANDOFF_KEY,JSON.stringify(createSourceHandoff(next,'write',now)));
          navigate('write');
        }catch(error){
          feedback.textContent='Original conversation changed or could not be saved. Return to Conversation to resume.';
          console.error('Source listening-to-writing handoff failed',error);
        }finally{continueWriting.disabled=false;}
      })();
    };
    actions.append(model,slow,reveal,continueWriting,back);
    panel.append(scene,actions,draft,check,feedback,transcript);
    host.before(panel);
    if(!speech.supported){model.disabled=true;slow.disabled=true;feedback.textContent='Device speech unavailable; original transcript can still be revealed.';}
  }

  const pairedReadingId=sessionStorage.getItem('french-vnext-listen-reading')??'';
  const returnReadingId=sessionStorage.getItem('french-vnext-listen-return-reading')??'';
  sessionStorage.removeItem('french-vnext-listen-reading');
  sessionStorage.removeItem('french-vnext-listen-return-reading');
  const [index,events,readingPack]=await Promise.all([loadVocabularySearchIndex(signal),readRecentReviewEvents(1000),pairedReadingId?loadStableReadingPack(signal):Promise.resolve(null)]);
  if(signal.aborted)return;
  const selected=sessionStorage.getItem('french-vnext-listen-note')??'';
  sessionStorage.removeItem('french-vnext-listen-note');
  const failures=events.filter(event=>event.practiceOnly!==true&&!event.correct).map(event=>event.noteId);
  const recent=events.filter(event=>event.practiceOnly!==true).map(event=>event.noteId);
  const candidateIds=uniqueIds([selected,...failures,...recent,...index.rows.map(row=>row.id)],60);
  const prompts:Prompt[]=[];
  const paired=readingPack?.readings.find((reading:ReadingItem)=>reading.id===pairedReadingId);
  if(paired){
    for(let segmentIndex=0;segmentIndex<paired.sentences.length;segmentIndex++){
      const sentence=paired.sentences[segmentIndex];
      const ref=sentenceVocabulary(sentence.fr,index.rows,paired.targets??[]);
      if(!ref)continue;
      const word=await loadVocabularyWord(ref.id,signal);if(signal.aborted)return;
      if(!word)continue;
      prompts.push({word,text:sentence.fr,translation:sentence.en,repair:false,readingId:paired.id,readingTitle:paired.title,segmentIndex,theme:paired.topic});
    }
  }
  if(!prompts.length){
    for(const id of candidateIds){
      const word=await loadVocabularyWord(id,signal);if(signal.aborted)return;
      if(!word?.word||!word.meaning)continue;
      const sentence=word.sentences?.find(item=>item?.text&&item?.translation)??word.sentences?.find(item=>item?.text);
      prompts.push({word,text:sentence?.text??word.word,translation:sentence?.translation??word.meaning,repair:false});
      if(prompts.length>=12)break;
    }
  }
  if(!prompts.length){status.textContent='No listening material is available.';return;}

  let mode:Mode=paired?'intensive':'comprehensible';
  let queue=[...prompts.slice(0,10)];
  let cursor=0,correct=0,attempted=0,firstListen=0,textChecks=0;
  const modeButtons=[...main.querySelectorAll<HTMLButtonElement>('[data-mode]')];
  const reset=(next:Mode)=>{
    speech.cancel();mode=next;cursor=0;correct=0;attempted=0;firstListen=0;textChecks=0;
    const targeted=[...prompts].sort((a,b)=>{
      const af=failures.indexOf(a.word.id),bf=failures.indexOf(b.word.id);
      return (af<0?999:af)-(bf<0?999:bf);
    });
    queue=(mode==='targeted'?targeted:prompts).slice(0,10).map(item=>({...item,repair:false}));
    for(const button of modeButtons)button.classList.toggle('is-active',button.dataset.mode===mode);
    render();
  };
  for(const button of modeButtons){button.classList.toggle('is-active',button.dataset.mode===mode);button.addEventListener('click',()=>reset(button.dataset.mode as Mode));}
  if(paired&&returnReadingId){
    const back=document.createElement('button');back.type='button';back.className='text-action listen-return';back.textContent='← Back to '+paired.title;
    back.addEventListener('click',()=>{sessionStorage.setItem('french-vnext-read-open',returnReadingId);navigate('read');});
    const speak=document.createElement('button');speak.type='button';speak.className='secondary-action compact-action listen-return';speak.textContent='Speak pair';
    speak.addEventListener('click',()=>{sessionStorage.setItem('french-vnext-speak-reading',paired.id);navigate('speak');});
    main.querySelector('.practice-page')?.prepend(speak);
    main.querySelector('.practice-page')?.prepend(back);
  }

  const render=()=>{
    speech.cancel();
    if(cursor>=queue.length){
      host.innerHTML='<article class="practice-card practice-done"><h2>Listening set complete</h2><p data-summary></p><button class="secondary-action compact-action" data-restart type="button">Practice again</button></article>';
      const summary=host.querySelector<HTMLElement>('[data-summary]');
      if(summary)summary.textContent=correct+' / '+attempted+' accurate device-started attempts · '+firstListen+' independent first listens · '+textChecks+' written-only checks (not listening evidence).';
      host.querySelector<HTMLButtonElement>('[data-restart]')?.addEventListener('click',()=>reset(mode));
      status.textContent='Contextual listening evidence saved · scheduled SRS unchanged.';return;
    }
    const prompt=queue[cursor];
    let plays=0,rate=1,support=0,transcriptUsed=false,translationUsed=false,started=performance.now(),answered=false;
    const cueList=cues(prompt.text);
    host.innerHTML='<article class="practice-card contextual-card"><div class="practice-meta"><span data-count></span><span data-support></span></div><div class="listen-context-label" data-context></div><h2>Listen for the complete French sentence.</h2><div class="audio-toolbar"><label><span>Speed</span><select data-rate><option value="0.78">0.78×</option><option value="1" selected>1.00×</option><option value="1.08">1.08×</option></select></label><button class="primary-action compact-action" data-play type="button">Play audio</button></div><div class="support-actions"><button class="secondary-action compact-action" data-transcript type="button">Reveal transcript</button><button class="secondary-action compact-action" data-translation type="button" disabled>Reveal translation</button></div><div class="listen-support" data-transcript-panel hidden></div><div class="listen-support" data-translation-panel hidden></div><div class="connected-cues" data-cues></div><form class="typed-answer practice-answer" data-form><input data-answer aria-label="Type what you hear" autocomplete="off" spellcheck="false" placeholder="Type the French sentence"><button class="primary-action compact-action" type="submit">Check</button></form><div class="practice-feedback" data-feedback hidden></div><button class="secondary-action compact-action" data-next type="button" hidden>Next</button></article>';
    const count=host.querySelector<HTMLElement>('[data-count]');if(count)count.textContent=(cursor+1)+' / '+queue.length+(prompt.repair?' · retest':'');
    const supportNode=host.querySelector<HTMLElement>('[data-support]');
    const context=host.querySelector<HTMLElement>('[data-context]');
    if(context)context.textContent=prompt.readingTitle
      ?prompt.readingTitle+' · segment '+((prompt.segmentIndex??0)+1)
      :prompt.word.meaning+' · '+(prompt.word.level??'');
    const rateSelect=host.querySelector<HTMLSelectElement>('[data-rate]');
    const play=host.querySelector<HTMLButtonElement>('[data-play]');
    const transcript=host.querySelector<HTMLButtonElement>('[data-transcript]');
    const translation=host.querySelector<HTMLButtonElement>('[data-translation]');
    const transcriptPanel=host.querySelector<HTMLElement>('[data-transcript-panel]');
    const translationPanel=host.querySelector<HTMLElement>('[data-translation-panel]');
    const cuePanel=host.querySelector<HTMLElement>('[data-cues]');
    const form=host.querySelector<HTMLFormElement>('[data-form]');
    const input=host.querySelector<HTMLInputElement>('[data-answer]');
    const feedback=host.querySelector<HTMLElement>('[data-feedback]');
    const next=host.querySelector<HTMLButtonElement>('[data-next]');
    const updateSupport=()=>{if(supportNode)supportNode.textContent=supportLabel(support);};
    if(play&&!speech.supported){play.disabled=true;play.title='Device audio unavailable; reveal transcript for written-source practice.';}
    updateSupport();
    if(cuePanel){
      cuePanel.textContent=mode==='intensive'&&cueList.length?'Connected-speech cues: '+cueList.join(' · '):'';
      cuePanel.hidden=!(mode==='intensive'&&cueList.length);
    }
    rateSelect?.addEventListener('change',()=>{rate=Number(rateSelect.value)||1;if(rate<1)support=Math.max(support,1);updateSupport();});
    play?.addEventListener('click',()=>{
      if(rate<1)support=Math.max(support,1);
      updateSupport();
      const requested=speech.play(prompt.text,rate,()=>{
        if(signal.aborted||!host.isConnected)return;
        plays++;
        if(plays>1)support=Math.max(support,1);
        updateSupport();
        status.textContent='Device speech started. Actual French voice accuracy and audibility are not verified.';
      },()=>{if(!signal.aborted&&host.isConnected)status.textContent='Device playback failed. Reveal transcript for written-source practice.';});
      status.textContent=requested?'Device speech requested. If playback does not start, reveal transcript.':
        'Device synthesis unavailable. Reveal transcript for written-source practice.';
    });
    transcript?.addEventListener('click',()=>{
      transcriptUsed=true;support=Math.max(support,2);updateSupport();transcript.disabled=true;if(translation)translation.disabled=false;
      if(transcriptPanel){transcriptPanel.hidden=false;transcriptPanel.textContent=prompt.text;}
    });
    translation?.addEventListener('click',()=>{
      translationUsed=true;support=Math.max(support,3);updateSupport();translation.disabled=true;
      if(translationPanel){translationPanel.hidden=false;translationPanel.textContent=prompt.translation;}
    });
    form?.addEventListener('submit',async event=>{
      event.preventDefault();if(answered||!input||!feedback||!next)return;
      if(plays===0&&!transcriptUsed){status.textContent='Device speech has not started. Play audio or reveal transcript for ungraded, written-only practice.';return;}
      answered=true;const result=gradeSentence(input.value,prompt.text);
      const textOnly=plays===0;
      if(textOnly)textChecks++;
      else{attempted++;if(result.correct)correct++;}
      const independent=!textOnly&&result.correct&&support===0&&plays===1&&rate>=1&&!transcriptUsed&&!translationUsed;
      if(independent)firstListen++;
      input.disabled=true;for(const button of form.querySelectorAll<HTMLButtonElement>('button'))button.disabled=true;
      feedback.hidden=false;feedback.textContent=(textOnly?'Written-source practice only (no audio started; no listening evidence). ':'')+(textOnly&&result.correct?'Exact written match (not dictation)':result.label)+' · '+prompt.text+' — '+prompt.translation;
      next.hidden=false;
      const row=index.rows.find(item=>item.id===prompt.word.id);
      if(textOnly){
        status.textContent='Written-source response reviewed locally; no listening evidence or FSRS grade was saved.';
      }else try{
        await recordPracticeEvidence({
          noteId:prompt.word.id,skill:'listening',direction:'audio-fr',
          typed:true,typedQuality:result.quality,correct:result.correct,responseMs:Math.round(performance.now()-started),
          level:prompt.word.level??row?.level??'',pos:prompt.word.pos??row?.pos??'',theme:prompt.theme??'',
          practice:prompt.readingId?'contextual-listening-reading':'contextual-listening',
          supportLevel:support,firstListen:independent,playCount:plays,playbackRate:rate,
          transcriptUsed,translationUsed,errorCategory:result.error
        });
        status.textContent=(independent?'Independent first-listen success saved.':supportLabel(support)+' evidence saved.')+' FSRS due dates unchanged.';
      }catch(error){status.textContent='Could not save listening evidence.';console.error(error);}
      if(!result.correct&&!prompt.repair){
        const insertAt=Math.min(queue.length,cursor+4);
        queue.splice(insertAt,0,{...prompt,repair:true});
      }
      next.focus();
    });
    next?.addEventListener('click',()=>{cursor++;render();});
    input?.focus();
  };

  status.textContent=paired
    ?prompts.length+' aligned segments ready from “'+paired.title+'” · no external audio request.'
    :prompts.length+' contextual prompts ready · no external audio request.';
  render();
  signal.addEventListener('abort',()=>{speech.cancel();},{once:true});
}
