import type {A1Unit} from '../core/unified/u6-a1-model';
import {listeningDialogueText,originalA1SoundContrasts,originalA1SpokenTransfer,originalA1ListeningEvidence} from '../core/unified/u7-listening';
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
 const supported='speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
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
   status.textContent=french?'Playing synthesized French using '+french.name+'.':
    'French TTS requested. The device did not expose a voice inventory, so speech quality cannot be verified.';
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
  const summary=el('summary','French sound focus · '+soundContrasts.length+' comparisons + independent speaking (ungraded)');
  section.append(summary,
   el('p','Choose listen-first or reveal the written examples first. Device TTS is optional and may render liaison, schwa, homophones or vowels inaccurately. IPA shows a reference target, not a measurement of this device. No automatic recognition, recording, pronunciation grade or FSRS event is created.','u7-listening-notice'));
  soundContrasts.forEach((contrast,index)=>{
   const panel=el('section',undefined,'u44-original-sound-case');
   panel.setAttribute('aria-label','Pronunciation contrast '+(index+1)+': '+contrast.focus);
   panel.append(el('h5',(index+1)+'. '+contrast.focus),
    el('p',contrast.selfCheck,'u44-sound-prompt'));
   if(contrast.hearingLimit==='homophone')panel.append(
    el('p','Homophones: the focus words normally sound the same. Do not guess spelling from sound alone; compare the written sentence and meaning.','u7-listening-notice'));
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
   const reveal=action('Reveal written forms and sound explanation',()=>{
    answer.hidden=!answer.hidden;
    reveal.textContent=answer.hidden?'Reveal written forms and sound explanation':'Hide written forms and explanation';
    reveal.setAttribute('aria-expanded',String(!answer.hidden));
   });
   reveal.setAttribute('aria-expanded','false');
   panel.append(reveal,answer);section.append(panel);
  });
  const transfer=originalA1SpokenTransfer(unit.id);
  if(transfer){
   const practice=el('section',undefined,'u46-independent-speech');
   practice.setAttribute('aria-label','Independent spoken transfer for '+unit.id);
   practice.append(el('h5','Apply it in another situation'),
    el('p',transfer.context,'u46-transfer-prompt'),
    el('p','Say your own answer aloud before viewing the checklist. This is voluntary self-practice, not speech recognition or a recorded result.','u6-small'));
   const checks=el('p',transfer.selfCheck,'u46-transfer-checks');checks.hidden=true;
   const showChecks=action('Show self-check guidance',()=>{
    checks.hidden=!checks.hidden;
    showChecks.textContent=checks.hidden?'Show self-check guidance':'Hide self-check guidance';
    showChecks.setAttribute('aria-expanded',String(!checks.hidden));
   });
   showChecks.setAttribute('aria-expanded','false');
   practice.append(showChecks,checks);section.append(practice);
  }
  host.append(section);
 }

 const transcript=el('div',undefined,'u7-listening-transcript');
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
  form.addEventListener('submit',event=>{
   event.preventDefault();
   if(!select.value){result.textContent='Choose a response first.';return;}
   const correct=checkPracticeAnswer(select.value,question.answer);
   const repair=question.misconceptionFeedback?.[select.value];
   result.textContent=correct?'Correct. '+question.explanation:
    'Not yet. '+(repair??'Replay the source exchange or read the transcript, then choose again.')+
    ' You can retry before revealing the complete explanation.';
   explanation.hidden=correct;
  });
  const evidence=originalA1ListeningEvidence(unit,question.id);
  if(evidence.length){
   const help=el('div',undefined,'u46-question-evidence');
   const replay=action('Replay source exchange',()=>play(.85,evidence.map(line=>line.fr).join(' ')));
   replay.disabled=!supported;
   const supporting=el('div',undefined,'u46-question-lines');supporting.hidden=true;
   supporting.setAttribute('aria-label','Original source dialogue turns for '+question.id);
   for(const line of evidence){
    const turn=el('p',line.speaker+': '+line.fr);turn.lang='fr';
    supporting.append(turn);
   }
   const show=action('Read source exchange',()=>{
    supporting.hidden=!supporting.hidden;
    show.setAttribute('aria-expanded',String(!supporting.hidden));
    show.textContent=supporting.hidden?'Read source exchange':'Hide source exchange';
   });
   show.setAttribute('aria-expanded','false');
   help.append(replay,show);
   form.append(label,help,supporting);
  }else form.append(label);
  const explanation=el('details',undefined,'u46-listening-reveal');
  explanation.hidden=true;
  explanation.append(el('summary','Reveal explanation after attempting'),
   el('p',question.explanation));
  form.append(submit,result,explanation);host.append(form);
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
