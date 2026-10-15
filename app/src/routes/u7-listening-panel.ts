import type {A1Unit} from '../core/unified/u6-a1-model';
import {listeningDialogueText,originalA1SoundContrasts,originalA1ConversationTransfer,originalA1ConversationRepair} from '../core/unified/u7-listening';
import {getOriginalMaterial} from '../core/unified/u23-registry';
import {checkPracticeAnswer} from '../core/unified/u2-grammar';
import {appendU26GrammarPractice} from './u26-grammar-panel';
import './unified-u7.css';
import {appendOriginalListeningJourney} from './u30-listening-panel';

function el<K extends keyof HTMLElementTagNameMap>(tag:K,value?:string,css?:string):HTMLElementTagNameMap[K]{
 const item=document.createElement(tag);
 if(value!==undefined)item.textContent=value;
 if(css)item.className=css;
 return item;
}
function action(label:string,callback:()=>void):HTMLButtonElement{
 const b=el('button',label,'secondary-action compact-action');b.type='button';b.addEventListener('click',callback);return b;
}
/** Device speech synthesis is not qualified French narration and cannot grade pronunciation. */
export function mountA1Listening(host:HTMLElement,unit:A1Unit,signal:AbortSignal):()=>void{
 host.replaceChildren(el('h4','Listen to original French'),
  el('p','Optional browser/device text-to-speech (TTS), not human-recorded audio. French voices, quality, accent and availability vary by device. No microphone, recording, transcription or pronunciation grade.','u7-listening-notice'));
 const status=el('p','Playback has not started.','u7-speech-status');status.setAttribute('role','status');
 const controls=el('div',undefined,'u7-audio-actions');
 let activeSpeech:SpeechSynthesisUtterance|null=null;
 // A present but unavailable or blocked device API cannot be used for playback.
 const supported=typeof window.speechSynthesis?.speak==='function'&&
  typeof window.SpeechSynthesisUtterance==='function';
 const stop=()=>{
  if(activeSpeech&&supported){
   const previous=activeSpeech;activeSpeech=null;
   previous.onend=null;previous.onerror=null;
   window.speechSynthesis.cancel();
  }
 };
 let stopU30:()=>void=()=>{};
 const cleanup=()=>{stop();stopU30();signal.removeEventListener('abort',cleanup);};
 signal.addEventListener('abort',cleanup,{once:true});
 const play=(rate:number,text:string=listeningDialogueText(unit))=>{
  if(signal.aborted||!host.isConnected)return;
  if(!supported){status.textContent='Speech synthesis is unavailable. The transcript can be read instead.';return;}
  stop();
  const synth=window.speechSynthesis;
  const voices=synth.getVoices();
  const french=voices.find(v=>v.lang.toLowerCase()==='fr-fr')??
   voices.find(v=>v.lang.toLowerCase().startsWith('fr'));
  if(voices.length>0&&!french){
   status.textContent='No French TTS voice is listed on this device. Use the original transcript below.';
   return;
  }
  const speech=new SpeechSynthesisUtterance(text);
  speech.lang='fr-FR';speech.rate=rate;speech.pitch=1;
  if(french)speech.voice=french;
  activeSpeech=speech;
  speech.onstart=()=>{
   if(activeSpeech!==speech||signal.aborted||!host.isConnected)return;
   status.textContent=french?'Device synthesized French started using '+french.name+'.':
    'Device synthesized French started. The voice inventory was not exposed; pronunciation accuracy is unverified.';
  };
  speech.onend=()=>{
   if(activeSpeech!==speech)return;
   activeSpeech=null;
   if(!signal.aborted&&host.isConnected)status.textContent='Playback finished. Compare the original French speech with the transcript if needed.';
  };
  speech.onerror=()=>{
   if(activeSpeech!==speech)return;
   activeSpeech=null;
   if(!signal.aborted&&host.isConnected)status.textContent='Device playback could not complete. The written transcript is still available.';
  };
  try{
   synth.speak(speech);
   status.textContent='Device French TTS requested. If no sound starts, use the written original text; voices and pronunciation quality are not verified.';
  }catch{
   activeSpeech=null;status.textContent='TTS playback failed. Use the transcript instead.';
  }
 };
 const normal=action('Play TTS dialogue',()=>play(1));
 const slow=action('Play slowly',()=>play(.78));
 const halt=action('Stop TTS',()=>{stop();status.textContent='Playback stopped.';});
 if(!supported){normal.disabled=true;slow.disabled=true;}
 const lineControls=el('div',undefined,'u7-line-controls');
 const lineLabel=el('label','Repeat one dialogue turn');
 const linePicker=el('select');linePicker.setAttribute('aria-label','Choose spoken dialogue turn');
 unit.dialogue.forEach((line,i)=>{
  const option=el('option',(i+1)+'. '+line.speaker);option.value=String(i);linePicker.append(option);
 });
 lineLabel.append(linePicker);
 const repeat=action('Play selected turn',()=>{
  const selected=unit.dialogue[Number(linePicker.value)];
  if(selected)play(.85,selected.fr);
 });
 if(!supported)repeat.disabled=true;
 lineControls.append(lineLabel,repeat);
 controls.append(normal,slow,halt);host.append(controls,lineControls,status);

 const soundContrasts=originalA1SoundContrasts(unit.id);
 if(soundContrasts.length){
  const section=el('details',undefined,'u44-original-sounds');
  const summary=el('summary','French sound focus · '+soundContrasts.length+' original A1 contrasts (ungraded)');
  section.append(summary,
   el('p','Compare two meaningful sentences. Play A and B if reliable device French TTS is available, or reveal and read them yourself. The examples are not always minimal pairs: some sound identical and need context or spelling. IPA labels describe only the focus words or phrase, not a certified whole-sentence recording. No microphone, grade, FSRS change or automatic hearing claim.','u7-listening-notice'));
  section.addEventListener('toggle',()=>{if(!section.open)stop();});
  soundContrasts.forEach((contrast,index)=>{
   const panel=el('section',undefined,'u44-original-sound-case');
   panel.setAttribute('aria-label','Pronunciation contrast '+(index+1)+': '+contrast.focus);
   panel.append(el('h5',(index+1)+'. '+contrast.focus),
    el('p',contrast.selfCheck,'u44-sound-prompt'));
   const beforeReveal=el('p','A/B audio is optional. You can compare written forms first; focus on the sounds noted below, then say your own related sentence.','u6-small');
   panel.append(beforeReveal);
   const actions=el('div',undefined,'u7-audio-actions');
   const playA=action('Hear A',()=>play(.85,contrast.a.french));
   const playB=action('Hear B',()=>play(.85,contrast.b.french));
   if(!supported){playA.disabled=true;playB.disabled=true;}
   actions.append(playA,playB);
   panel.append(actions);
   const answer=el('div',undefined,'u44-sound-explanation');answer.hidden=true;
   for(const [letter,sample] of [['A',contrast.a],['B',contrast.b]] as const){
    const expression=el('p',letter+' · '+sample.french);expression.lang='fr';
    const english=el('p',sample.meaning+' · target: '+sample.reading,'u6-small');
    answer.append(expression,english);
   }
   answer.append(el('p',contrast.guidance,'u44-sound-guidance'));
   const reveal=action('Show / hide French text and sound guidance',()=>{
    answer.hidden=!answer.hidden;
    reveal.textContent=answer.hidden?'Show French text and sound guidance':'Hide French text and sound guidance';
    reveal.setAttribute('aria-expanded',String(!answer.hidden));
   });
   reveal.setAttribute('aria-expanded','false');
   panel.append(reveal,answer);section.append(panel);
  });
  const transfer=originalA1ConversationTransfer(unit.id);
  if(transfer){
   const practice=el('section',undefined,'u46-original-speech-transfer');
   practice.setAttribute('aria-label','Independent everyday French conversation practice');
   practice.append(el('h5','Try it in another situation'),
    el('p',transfer.context,'u46-transfer-context'),
    el('p',transfer.task,'u46-transfer-task'),
    el('p','Prepare your own two or three sentences, then say them aloud. No answer text is captured, stored or automatically graded. You may use the original dialogue as a model, but change the people, place or decision to fit this new situation.','u6-small'));
   const turn=unit.dialogue[transfer.relevantTurnIndex];
   if(turn){
    const actions=el('div',undefined,'u7-audio-actions');
    const speak=action('Hear one original turn (device TTS)',()=>play(.85,turn.fr));
    if(!supported)speak.disabled=true;
    const originalText=el('p',turn.speaker+': '+turn.fr,'u46-transfer-source');
    originalText.lang='fr';originalText.hidden=true;
    const read=action('Read the original turn instead',()=>{
     originalText.hidden=!originalText.hidden;
     read.textContent=originalText.hidden?'Read the original turn instead':'Hide the original turn';
     read.setAttribute('aria-expanded',String(!originalText.hidden));
    });
    read.setAttribute('aria-expanded','false');
    actions.append(speak,read);
    practice.append(actions,originalText);
   }
   const reflection=el('p',transfer.check,'u46-transfer-check');
   reflection.hidden=true;
   const reveal=action('Show independent self-check',()=>{
    reflection.hidden=!reflection.hidden;
    reveal.textContent=reflection.hidden?'Show independent self-check':'Hide independent self-check';
    reveal.setAttribute('aria-expanded',String(!reflection.hidden));
   });
   reveal.setAttribute('aria-expanded','false');
   practice.append(reveal,reflection);
   const repair=originalA1ConversationRepair(unit.id);
   if(repair){
    const change=el('details',undefined,'u46-original-repair');
    change.append(el('summary','A second interlocutor misunderstood you · repair the exchange'),
      el('p',repair.misunderstanding,'u46-transfer-context'),
      el('p',repair.responseTask,'u46-transfer-task'),
      el('p','Listen to the original turn again or use its transcript. Then respond independently in French before opening the explanation. This is unscored speaking and listening practice.','u6-small'));
    const evidence=el('details');
    evidence.append(el('summary','Compare the intended meaning after speaking'),
      el('p',repair.evidenceCheck,'u46-transfer-check'));
    change.append(evidence);practice.append(change);
   }
   section.append(practice);
  }
  host.append(section);
 }

 const transcript=el('div',undefined,'u7-listening-transcript');
 transcript.id='original-french-transcript-'+unit.id;
 transcript.hidden=true;transcript.setAttribute('aria-label','Original French transcript');
 for(const line of unit.dialogue){
  const turn=el('p',line.speaker+': '+line.fr);turn.lang='fr';transcript.append(turn);
 }
 const toggle=action('Show French transcript',()=>{
  transcript.hidden=!transcript.hidden;
  toggle.textContent=transcript.hidden?'Show French transcript':'Hide French transcript';
  toggle.setAttribute('aria-expanded',String(!transcript.hidden));
 });
 toggle.setAttribute('aria-expanded','false');
 toggle.setAttribute('aria-controls',transcript.id);
 host.append(toggle,transcript,el('p','Try each question after listening. If TTS is unavailable, use the text. Comprehension checking is temporary, not a formal listening assessment.','u6-small'));
 getOriginalMaterial(unit.id)?.listening.forEach((question,i)=>{
  const form=el('form',undefined,'u7-listening-question');
  const label=el('label',(i+1)+'. '+question.prompt);
  const select=el('select');select.setAttribute('aria-label','Listening answer '+(i+1));
  const placeholder=el('option','Choose your answer');placeholder.value='';select.append(placeholder);
  for(const option of question.options){const row=el('option',option);row.value=option;select.append(row);}
  label.append(select);
  const result=el('p',undefined,'u7-listening-result');result.setAttribute('role','status');
  const submit=el('button','Check listening answer','secondary-action compact-action');submit.type='submit';
  const sourceSupport=el('div',undefined,'u46-listen-source-support');
  sourceSupport.hidden=true;
  const showAnswer=action('Reveal authored answer and explanation',()=>{
   answerText.hidden=!answerText.hidden;
   showAnswer.textContent=answerText.hidden?'Reveal authored answer and explanation':'Hide authored answer and explanation';
   showAnswer.setAttribute('aria-expanded',String(!answerText.hidden));
  });
  const answerText=el('p','Authored key: '+question.answer+'. '+question.explanation,'u7-listening-result');
  answerText.hidden=true;showAnswer.setAttribute('aria-expanded','false');
  sourceSupport.append(showAnswer,answerText);
  const index=question.sourceTurnIndex;
  if(Number.isInteger(index)&&index!==undefined&&index>=0&&index<unit.dialogue.length){
   const originalTurn=unit.dialogue[index];
   const replay=action('Replay relevant original turn',()=>play(.85,originalTurn.fr));
   if(!supported)replay.disabled=true;
   const written=el('p',originalTurn.speaker+': '+originalTurn.fr,'u46-listen-source-turn');
   written.lang='fr';written.hidden=true;
   const revealSource=action('Read relevant original turn',()=>{
    written.hidden=!written.hidden;
    revealSource.textContent=written.hidden?'Read relevant original turn':'Hide original turn';
    revealSource.setAttribute('aria-expanded',String(!written.hidden));
   });
   revealSource.setAttribute('aria-expanded','false');
   sourceSupport.prepend(replay,revealSource,written);
  }
  let attempts=0;
  form.addEventListener('submit',event=>{
   event.preventDefault();
   if(!select.value){result.textContent='Choose a response first.';return;}
   attempts++;
   const correct=checkPracticeAnswer(select.value,question.answer);
   const repair=question.misconceptionFeedback?.[select.value];
   sourceSupport.hidden=false;
   if(correct){
    result.textContent='Matches the original authored answer. '+question.explanation;
    answerText.hidden=true;showAnswer.setAttribute('aria-expanded','false');
    return;
   }
   result.textContent='Not yet. '+(repair??'Check the original source before choosing again.')+
    ' Reconsider your answer, replay a relevant turn or consult the French text. No listening score is saved.';
   if(attempts>1)showAnswer.textContent='Reveal authored answer and explanation';
  });
  form.append(label,submit,result,sourceSupport);host.append(form);
 });
 const oral=getOriginalMaterial(unit.id)?.oral;
 if(oral){
  const practice=el('section',undefined,'u12-speaking-prep');
  practice.setAttribute('aria-label','Ungraded oral-response preparation');
  practice.append(el('h4','Prepare an independent spoken response'),
   el('p','Optional speaking prompt. Plan and say your answer aloud yourself. No microphone capture, transcription, automatic scoring or verified proficiency credit.','u7-listening-notice'),
   el('p',oral.prompt));
  const steps=el('ol');
  for(const step of oral.plan)steps.append(el('li',step));
  practice.append(steps);
  const model=el('p',oral.model,'u12-speaking-model');
  model.lang='fr';model.hidden=true;
  const reveal=action('Show example response',()=>{
   model.hidden=!model.hidden;
   reveal.textContent=model.hidden?'Show example response':'Hide example response';
   reveal.setAttribute('aria-expanded',String(!model.hidden));
  });
  reveal.setAttribute('aria-expanded','false');
  practice.append(reveal,model);
   const optionalSpeaking=el('details',undefined,'u39-context-tools');
   optionalSpeaking.append(el('summary','Optional original spoken-response preparation'),practice);
   host.append(optionalSpeaking);
 }
 const extension=el('details',undefined,'u39-context-tools');
 const extras=el('div',undefined,'u39-context-content');
 extension.append(el('summary','Optional deeper listening interpretation and grammar'),extras);
 host.append(extension);let mounted=false;
 extension.addEventListener('toggle',()=>{
  if(!extension.open||mounted||signal.aborted||!extension.isConnected)return;
  mounted=true;
  stopU30=appendOriginalListeningJourney(extras,unit.id,{signal,mode:'course'});
  appendU26GrammarPractice(extras,unit.id,'listen');
 });
 return cleanup;
}
