import type {A1Unit} from '../core/unified/u6-a1-model';
import {listeningDialogueText} from '../core/unified/u7-listening';
import {listeningQuestionsForU17,originalOralResponseU17} from '../core/unified/u17-material';
import {checkPracticeAnswer} from '../core/unified/u2-grammar';
import './unified-u7.css';

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
 let playing=false;
 const supported='speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
 const stop=()=>{
  if(playing&&supported){window.speechSynthesis.cancel();playing=false;}
 };
 const cleanup=()=>{stop();signal.removeEventListener('abort',cleanup);};
 signal.addEventListener('abort',cleanup,{once:true});
 const play=(rate:number,text:string=listeningDialogueText(unit))=>{
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
  playing=true;
  speech.onend=()=>{playing=false;if(!signal.aborted&&host.isConnected)status.textContent='Playback finished. Try the listening questions without the transcript.';};
  speech.onerror=()=>{playing=false;if(!signal.aborted&&host.isConnected)status.textContent='Device playback could not complete. The written transcript is still available.';};
  try{
   synth.speak(speech);
   status.textContent=french?'Playing synthesized French using '+french.name+'.':
    'French TTS requested. The device did not expose a voice inventory, so speech quality cannot be verified.';
  }catch{
   playing=false;status.textContent='TTS playback failed. Use the transcript instead.';
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
 listeningQuestionsForU17(unit).forEach((question,i)=>{
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
   result.textContent=checkPracticeAnswer(select.value,question.answer)?
    'Correct. '+question.explanation:
    'Not yet. Listen again or reveal the French transcript. '+question.explanation;
  });
  form.append(label,submit,result);host.append(form);
 });
 const oral=originalOralResponseU17(unit.id);
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
  practice.append(reveal,model);host.append(practice);
 }
 return cleanup;
}
