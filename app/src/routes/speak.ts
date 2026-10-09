import type { RouteContext } from '../core/types';
import {
  loadStableReadingPack,loadStableSentenceExercises,loadVocabularySearchIndex,loadVocabularyWord,
  type ReadingItem,type SentenceExercise,type VocabularySearchRow,type VocabularyWord
} from '../core/content/loader';
import { diagnoseSentence,type SentenceDiagnosis } from '../core/content/sentence-diagnosis';
import { readRecentReviewEvents,recordPracticeEvidence } from '../core/learner/repository';
import { levenshtein } from '../core/learner/grader';

type Mode='pronunciation'|'shadowing'|'recall'|'transfer';
type RecognitionLike={
  lang:string;interimResults:boolean;maxAlternatives:number;
  start:()=>void;stop:()=>void;
  onresult:((event:any)=>void)|null;onerror:((event:any)=>void)|null;onend:(()=>void)|null;
};
type RecognitionCtor=new()=>RecognitionLike;
type SpeakTask={
  noteId:string;word?:VocabularyWord;target:string;cue:string;context:string;theme:string;
  readingId?:string;readingTitle?:string;segmentIndex?:number;exercise?:SentenceExercise;
};

function normalize(value:string):string{return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr').replace(/[’']/g,"'").replace(/[^a-z0-9' -]/g,' ').replace(/\s+/g,' ').trim();}
function similarity(a:string,b:string):number{
  const x=normalize(a),y=normalize(b);if(!x||!y)return 0;if(x===y)return 100;
  return Math.max(0,Math.round((1-levenshtein(x,y)/Math.max(x.length,y.length,1))*100));
}
function recognitionVerdict(score:number):string{
  if(score>=96)return'Recognizer heard the target clearly.';
  if(score>=82)return'Recognizer heard a close form. Check rhythm and missing words yourself.';
  if(score>=60)return'Recognizer heard part of the target. This is not a pronunciation failure.';
  return'Recognizer was uncertain. Use playback and self-assessment rather than treating this as a score.';
}
function diagnosisVerdict(result:SentenceDiagnosis):string{
  if(result.code==='exact'||result.code==='accepted')return result.label+'.';
  if(result.code==='orthography')return result.label+'; speech recognition may be responsible for spelling detail.';
  if(result.code==='manual')return result.label+'. Compare meaning and grammar yourself.';
  return result.label+'. Recognition is only a draft transcript; confirm manually.';
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
function connectedCues(text:string):string[]{
  const out:string[]=[];
  if(/[cdjlmnstqu]['’][a-zàâçéèêëîïôûùüÿœ]/i.test(text))out.push('elision');
  if(/\bne\b.+\b(pas|plus|jamais|rien)\b/i.test(text))out.push('negative frame');
  if(/\b(un|des|les|mes|tes|ses|nos|vos|aux|en)\s+[aeiouhàâéèêëîïôùûü]/i.test(text))out.push('possible liaison environment');
  return out;
}
function sentenceVocabulary(sentence:string,rows:VocabularySearchRow[],preferred:string[]=[]):VocabularySearchRow|undefined{
  const sentenceFold=normalize(sentence),tokens=new Set(sentenceFold.split(/\s+/));
  for(const target of preferred){
    const folded=normalize(target);
    const exact=rows.find(row=>normalize(row.word)===folded);
    if(exact&&tokens.has(normalize(exact.word)))return exact;
  }
  const candidates=rows.filter(row=>{const token=normalize(row.word);return token.length>=3&&tokens.has(token);});
  return candidates.sort((a,b)=>normalize(b.word).length-normalize(a.word).length||a.order-b.order)[0];
}
function taskNoteForExercise(exercise:SentenceExercise,rows:VocabularySearchRow[]):VocabularySearchRow|undefined{
  const expected=normalize(exercise.expected),required=(exercise.required??[]).map(normalize);
  const exact=rows.filter(row=>{
    const word=normalize(row.word);return word.length>=3&&expected.split(/\s+/).includes(word);
  });
  exact.sort((a,b)=>{
    const ar=required.some(value=>value.includes(normalize(a.word)))?0:1;
    const br=required.some(value=>value.includes(normalize(b.word)))?0:1;
    return ar-br||normalize(b.word).length-normalize(a.word).length||a.order-b.order;
  });
  return exact[0];
}
function estimateModelDurationMs(text:string,rate=.85):number{
  const words=Math.max(1,normalize(text).split(/\s+/).filter(Boolean).length);
  return Math.round(words/2.55/Math.max(.5,rate)*1000);
}
function create<K extends keyof HTMLElementTagNameMap>(tag:K,value='',className=''):HTMLElementTagNameMap[K]{
  const el=document.createElement(tag);if(value)el.textContent=value;if(className)el.className=className;return el;
}

export async function mount({main,signal}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page practice-page speak-workspace"><p class="eyebrow">Spoken production</p><h1>Speak</h1><p class="lede">Record locally, compare intelligibility conservatively, and self-assess. Recognition may use a browser/OS network service and is never an accent score.</p><div class="mode-tabs" role="group" aria-label="Speaking mode"><button data-mode="pronunciation" class="is-active" type="button">Pronunciation</button><button data-mode="shadowing" type="button">Shadowing</button><button data-mode="recall" type="button">Spoken recall</button><button data-mode="transfer" type="button">Spoken transfer</button></div><p class="inline-status" data-status>Preparing speaking prompts…</p><div data-practice></div></section>';
  const host=main.querySelector<HTMLElement>('[data-practice]');
  const status=main.querySelector<HTMLElement>('[data-status]');
  if(!host||!status)return;

  const selectedNote=sessionStorage.getItem('french-vnext-speak-note')??'';
  const selectedReading=sessionStorage.getItem('french-vnext-speak-reading')??'';
  sessionStorage.removeItem('french-vnext-speak-note');sessionStorage.removeItem('french-vnext-speak-reading');

  const [index,events,sentencePack,readingPack]=await Promise.all([
    loadVocabularySearchIndex(signal),readRecentReviewEvents(1200),loadStableSentenceExercises(signal),
    selectedReading?loadStableReadingPack(signal):Promise.resolve(null)
  ]);
  if(signal.aborted)return;

  const weak=events.filter(event=>event.practiceOnly!==true&&!event.correct).map(event=>event.noteId);
  const ids=unique([selectedNote,...weak,...events.filter(event=>event.practiceOnly!==true).map(event=>event.noteId),...index.rows.map(row=>row.id)],60);
  const lexical:SpeakTask[]=[];
  for(const id of ids){
    const word=await loadVocabularyWord(id,signal);if(signal.aborted)return;
    if(!word?.word||!word.meaning)continue;
    const sentence=word.sentences?.find(item=>item?.text&&item?.translation)??word.sentences?.find(item=>item?.text);
    lexical.push({noteId:word.id,word,target:sentence?.text??word.word,cue:sentence?.translation??word.meaning,context:word.meaning,theme:''});
    if(lexical.length>=10)break;
  }

  const paired=readingPack?.readings.find((reading:ReadingItem)=>reading.id===selectedReading);
  const contextual:SpeakTask[]=[];
  if(paired){
    for(let segmentIndex=0;segmentIndex<paired.sentences.length;segmentIndex++){
      const sentence=paired.sentences[segmentIndex];
      const row=sentenceVocabulary(sentence.fr,index.rows,paired.targets);
      if(!row)continue;
      const word=await loadVocabularyWord(row.id,signal);if(!word)continue;
      contextual.push({noteId:row.id,word,target:sentence.fr,cue:sentence.en,context:paired.title,theme:paired.topic,readingId:paired.id,readingTitle:paired.title,segmentIndex});
    }
  }

  const transfer:SpeakTask[]=[];
  for(const exercise of sentencePack.exercises.filter(exercise=>exercise.type==='transfer')){
    const row=taskNoteForExercise(exercise,index.rows);
    transfer.push({
      noteId:row?.id??('sentence:'+exercise.id),target:exercise.expected,
      cue:exercise.prompt,context:exercise.frame,theme:exercise.context,exercise
    });
  }

  if(!lexical.length&&!contextual.length&&!transfer.length){status.textContent='No speaking material is available.';return;}

  const Recognition=recognitionCtor();
  let mode:Mode=paired?'shadowing':selectedNote?'pronunciation':'pronunciation',cursor=0;
  let recognition:RecognitionLike|null=null,stream:MediaStream|null=null,recorder:MediaRecorder|null=null,audioUrl='',chunks:Blob[]=[];
  let recordingDurationMs=0,recordingStartedAt=0;
  const revokeAudio=()=>{if(audioUrl){URL.revokeObjectURL(audioUrl);audioUrl='';}};
  const stopStream=()=>{recorder=null;for(const track of stream?.getTracks()??[])track.stop();stream=null;chunks=[];};
  const discardRecording=()=>{try{if(recorder){recorder.ondataavailable=null;recorder.onstop=null;if(recorder.state==='recording')recorder.stop();}}catch{}revokeAudio();stopStream();recordingDurationMs=0;recordingStartedAt=0;};
  const modeButtons=[...main.querySelectorAll<HTMLButtonElement>('[data-mode]')];

  const tasksFor=(value:Mode):SpeakTask[]=>{
    if(value==='transfer')return transfer;
    if((value==='shadowing'||value==='recall')&&contextual.length)return contextual;
    return lexical;
  };
  const setMode=(next:Mode)=>{
    recognition?.stop();recognition=null;discardRecording();mode=next;cursor=0;
    for(const button of modeButtons)button.classList.toggle('is-active',button.dataset.mode===mode);
    render();
  };
  for(const button of modeButtons){button.classList.toggle('is-active',button.dataset.mode===mode);button.addEventListener('click',()=>setMode(button.dataset.mode as Mode));}

  const render=()=>{
    recognition?.stop();recognition=null;discardRecording();
    const tasks=tasksFor(mode);
    if(!tasks.length){host.innerHTML='<article class="practice-card"><h2>No prompts for this mode yet</h2><p class="muted-copy">Choose another speaking mode.</p></article>';return;}
    const task=tasks[cursor%tasks.length];
    const target=mode==='pronunciation'?(task.word?.word??task.target):task.target;
    const cue=mode==='pronunciation'?(task.word?.meaning??task.cue):task.cue;
    let support=mode==='pronunciation'||mode==='shadowing'?1:0;
    let recognized='',recognitionScore=0,recognitionConfidence=0,diagnosis:SentenceDiagnosis|null=null,started=performance.now(),saved=false;
    let lastModelRate=.85;
    const cues=mode==='shadowing'?connectedCues(target):[];

    host.innerHTML='<article class="practice-card speak-card"><div class="practice-meta"><span data-count></span><span data-mode-label></span></div><p class="practice-meaning" data-cue></p><div class="speak-target" data-target></div><div class="connected-cues" data-cues hidden></div><div class="practice-feedback speech-principle">Speech recognition checks intelligibility only. It is not an accent or pronunciation score.</div><div class="practice-controls"><button class="primary-action compact-action" data-model type="button">Play model</button><button class="secondary-action compact-action" data-slow type="button">Slow model</button><button class="secondary-action compact-action" data-record type="button">Start recording</button><button class="secondary-action compact-action" data-recognize type="button">Check recognition</button><button class="secondary-action compact-action" data-reveal type="button">Reveal target</button></div><audio data-playback controls hidden></audio><div class="practice-feedback" data-feedback>Record one attempt, play it back, then use recognition or self-assessment if useful.</div><div class="self-assess"><span>Manual judgment</span><div><button data-self="retry" type="button">Retry</button><button data-self="almost" type="button">Almost</button><button data-self="correct" type="button">Correct</button></div></div><button class="secondary-action compact-action" data-next type="button">Next prompt</button></article>';
    const count=host.querySelector<HTMLElement>('[data-count]');if(count)count.textContent=(cursor%tasks.length+1)+' / '+tasks.length;
    const modeLabel=host.querySelector<HTMLElement>('[data-mode-label]');if(modeLabel)modeLabel.textContent=modeName(mode)+(task.exercise?' · P12 '+task.exercise.id:'');
    const cueNode=host.querySelector<HTMLElement>('[data-cue]');if(cueNode)cueNode.textContent=task.exercise?cue+' · Required: '+task.exercise.frame:cue;
    const targetNode=host.querySelector<HTMLElement>('[data-target]');
    const cuePanel=host.querySelector<HTMLElement>('[data-cues]');
    const feedback=host.querySelector<HTMLElement>('[data-feedback]');
    const model=host.querySelector<HTMLButtonElement>('[data-model]');
    const slow=host.querySelector<HTMLButtonElement>('[data-slow]');
    const record=host.querySelector<HTMLButtonElement>('[data-record]');
    const recognize=host.querySelector<HTMLButtonElement>('[data-recognize]');
    const reveal=host.querySelector<HTMLButtonElement>('[data-reveal]');
    const playback=host.querySelector<HTMLAudioElement>('[data-playback]');
    const next=host.querySelector<HTMLButtonElement>('[data-next]');
    const assess=[...host.querySelectorAll<HTMLButtonElement>('[data-self]')];

    const showTarget=()=>{
      if(!targetNode)return;targetNode.textContent=target;targetNode.hidden=false;
      if(mode==='pronunciation'&&task.word?.ipa)targetNode.append(create('small',task.word.ipa,'word-ipa speak-ipa'));
    };
    if(mode==='pronunciation'||mode==='shadowing')showTarget();else if(targetNode)targetNode.hidden=true;
    if(mode==='pronunciation'&&reveal)reveal.hidden=true;
    if(cuePanel&&cues.length){cuePanel.hidden=false;cuePanel.textContent='Connected-speech cues: '+cues.join(' · ');}
    if(!Recognition&&recognize){recognize.disabled=true;recognize.textContent='Recognition unavailable';}

    const playModel=(rate:number)=>{
      lastModelRate=rate;
      if(mode==='recall'||mode==='transfer')support=Math.max(support,rate<.8?2:1);
      else if(rate<.8)support=Math.max(support,2);
      if(!say(target,rate))status.textContent='Speech synthesis is unavailable in this browser.';
    };
    model?.addEventListener('click',()=>playModel(.88));
    slow?.addEventListener('click',()=>playModel(.68));
    reveal?.addEventListener('click',()=>{support=Math.max(support,2);showTarget();reveal.disabled=true;});

    record?.addEventListener('click',async()=>{
      if(recorder?.state==='recording'){recorder.stop();record.disabled=true;record.textContent='Finishing…';return;}
      if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){
        if(feedback)feedback.textContent='Temporary browser recording is unavailable. Model playback, recognition and manual judgment still work.';return;
      }
      try{
        discardRecording();
        stream=await navigator.mediaDevices.getUserMedia({audio:true});
        if(signal.aborted){for(const track of stream.getTracks())track.stop();stream=null;return;}
        chunks=[];recorder=new MediaRecorder(stream);recordingStartedAt=performance.now();
        const activeRecorder=recorder;
        recorder.ondataavailable=event=>{if(event.data.size)chunks.push(event.data);};
        recorder.onstop=()=>{
          recordingDurationMs=Math.max(0,Math.round(performance.now()-recordingStartedAt));
          const mime=activeRecorder.mimeType||'audio/webm',blob=new Blob(chunks,{type:mime});
          revokeAudio();audioUrl=URL.createObjectURL(blob);
          if(playback){playback.src=audioUrl;playback.hidden=false;}
          record.disabled=false;record.textContent='Record again';
          for(const track of stream?.getTracks()??[])track.stop();stream=null;recorder=null;chunks=[];
          const modelMs=estimateModelDurationMs(target,lastModelRate),ratio=modelMs?recordingDurationMs/modelMs:0;
          if(feedback)feedback.textContent='Recording kept only in this tab · coarse pace '+ratio.toFixed(2)+'× model duration. This is rhythm context, not a score.';
        };
        recorder.start();record.textContent='Stop recording';
        if(feedback)feedback.textContent='Recording locally… nothing is uploaded or written to backup.';
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
        recognized=String(event?.results?.[0]?.[0]?.transcript??'').trim();
        recognitionConfidence=Number(event?.results?.[0]?.[0]?.confidence)||0;
        if(task.exercise){
          diagnosis=diagnoseSentence(recognized,task.exercise);
          recognitionScore=Math.round(diagnosis.score*100);
          if(feedback)feedback.textContent='Heard: “'+recognized+'” · '+diagnosisVerdict(diagnosis);
        }else{
          recognitionScore=similarity(recognized,target);
          if(feedback)feedback.textContent='Heard: “'+recognized+'” · '+recognitionVerdict(recognitionScore);
        }
      };
      recognition.onerror=()=>{if(feedback)feedback.textContent='Recognition failed. This creates no learner failure; use playback and manual judgment.';};
      recognition.onend=()=>{recognize.disabled=false;recognize.textContent='Check recognition';recognition=null;};
      recognition.start();
    });

    const saveAssessment=async(judgment:string)=>{
      if(saved)return;saved=true;for(const button of assess)button.disabled=true;
      const correct=judgment==='correct',almost=judgment==='almost';
      const modelDurationMs=estimateModelDurationMs(target,lastModelRate);
      const paceRatio=modelDurationMs&&recordingDurationMs?recordingDurationMs/modelDurationMs:0;
      try{
        await recordPracticeEvidence({
          noteId:task.noteId,skill:'production',practice:'spoken-'+mode,direction:'spoken-fr',
          correct,typed:false,typedQuality:'manual-'+judgment,responseMs:Math.round(performance.now()-started),
          level:task.word?.level??'',pos:task.word?.pos??'',theme:task.theme,supportLevel:support,
          errorCategory:task.exercise?(diagnosis?.code??(almost?'manual-almost':correct?'':'manual-retry')):(recognized?(recognitionScore>=82?'':'recognition-uncertain'):(correct?'':'self-assessed-repair')),
          sentenceExerciseId:task.exercise?.id??'',sentenceDiagnosis:diagnosis?.code??'',
          targetText:target,recognizedText:recognized,recognitionConfidence,manualJudgment:judgment,
          recordingDurationMs,modelDurationMs,paceRatio
        });
        status.textContent=modeName(mode)+' evidence saved as practice-only · SRS unchanged.';
      }catch(error){saved=false;for(const button of assess)button.disabled=false;status.textContent='Could not save speaking evidence.';console.error(error);}
    };
    for(const button of assess)button.addEventListener('click',()=>void saveAssessment(button.dataset.self??'retry'));
    next?.addEventListener('click',()=>{cursor=(cursor+1)%tasks.length;render();});
  };

  status.textContent=(Recognition?'Recognition available · ':'Recognition optional/unavailable · ')+(paired?'context paired from '+paired.title+' · ':'')+'recordings remain temporary and local.';
  render();
  signal.addEventListener('abort',()=>{recognition?.stop();discardRecording();if('speechSynthesis' in window)window.speechSynthesis.cancel();},{once:true});
}
