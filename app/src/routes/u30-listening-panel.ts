import {
 originalU30Listening,evaluateU30Answer,type U30Kind,type U30Decision
} from '../core/unified/u30-listening.ts';
import {getOriginalMaterial,handoffOriginalLesson,type OriginalSurface} from '../core/unified/u23-registry.ts';
import './u30-listening-panel.css';

interface Options{
 readonly signal:AbortSignal;readonly mode:'course'|'listen';
 readonly onOpenSurface?:(surface:Exclude<OriginalSurface,'course'>,id:string)=>void;
 readonly onNativeReview?:()=>void;
}
const LABELS:Readonly<Record<U30Kind,string>>={
 speaker:'Who says it?',sequence:'Follow the exchange',
 interpretation:'Interpret what was said',vocabulary:'Hear words in context',
 source:'Verify written evidence'
};
function el<K extends keyof HTMLElementTagNameMap>(tag:K,text='',cls=''):HTMLElementTagNameMap[K]{
 const node=document.createElement(tag);if(text)node.textContent=text;if(cls)node.className=cls;return node;
}
function action(label:string,handler:()=>void):HTMLButtonElement{
 const node=el('button',label,'secondary-action compact-action');
 node.type='button';node.addEventListener('click',handler);return node;
}
/** All U30 responses are disposable in-page study interactions, not SRS grades. */
export function appendOriginalListeningJourney(host:HTMLElement,id:string,opts:Options):()=>void{
 const lesson=originalU30Listening(id);
 if(!lesson)return()=>{};
 const source=getOriginalMaterial(id);
 if(!source)return()=>{};
 const wrapper=el('section','','u30-listening');
 wrapper.setAttribute('aria-label','Original multi-speaker listening and interpretation lab');
 const disclosure=el('details','','u30-disclosure');
 disclosure.open=opts.mode==='listen';
 disclosure.append(el('summary','U30 · Listening evidence lab · '+lesson.decisions.length+' source-linked decisions'));
 const content=el('div','','u30-body');
 disclosure.append(content);wrapper.append(disclosure);host.append(wrapper);
 const title=el('h3','Listen, attribute, interpret and respond');
 const notice=el('p','Optional device-generated French speech (TTS), not recorded conversation. A single synthetic voice may read all speakers. Speaker questions test dialogue attribution and content, not voice recognition. No microphone or pronunciation assessment; no saved grades or scheduled review changes.','u30-note');
 const provenance=el('p',lesson.level+' · '+lesson.qualifiedId+' · revision '+lesson.sourceRevision,'u30-source');
 const speakers=el('p','Participants in the original written dialogue: '+lesson.speakers.join(' · '),'u30-speakers');
 const audio=el('section','','u30-audio');
 audio.append(el('h4','First listen · source-owned French dialogue'));
 const audioControls=el('div','','u30-audio-controls');
 const voiceStatus=el('p','No device speech requested yet.','u30-status');voiceStatus.setAttribute('role','status');
 const speedLabel=el('label','TTS playback speed');
 const speed=el('select');speed.setAttribute('aria-label','Listening speed');
 for(const [value,label] of [['1','Standard (1×)'],['0.8','Supported replay (0.8×)']]){
  const option=el('option',label);option.value=value;speed.append(option);
 }
 speedLabel.append(speed);
 const turnLabel=el('label','Replay one turn (without speaker label)');
 const turnSelect=el('select');turnSelect.setAttribute('aria-label','Select French turn number');
 lesson.turns.forEach((_,i)=>{const option=el('option','Turn '+(i+1));option.value=String(i);turnSelect.append(option);});
 turnLabel.append(turnSelect);
 audioControls.append(speedLabel,turnLabel);
 const supported='speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
 let active=false,requestCount=0,usedSlow=false,destroyed=false;
 const stop=()=>{
  if(supported&&active){window.speechSynthesis.cancel();active=false;}
 };
 function speak(indices:readonly number[]):void{
  if(!supported||destroyed||opts.signal.aborted||!wrapper.isConnected){
   voiceStatus.textContent='Device French TTS unavailable. Use transcript-led comprehension; no listening success can be inferred.';return;
  }
  stop();
  const synth=window.speechSynthesis;
  const voices=synth.getVoices(),french=voices.find(v=>v.lang.toLowerCase()==='fr-fr')??
   voices.find(v=>v.lang.toLowerCase().startsWith('fr'));
  if(voices.length&& !french){
   voiceStatus.textContent='No French voice is available on this device. Open the written transcript instead.';return;
  }
  const rate=Number(speed.value)===.8?.8:1;
  requestCount++;if(rate<1)usedSlow=true;
  active=true;
  const valid=indices.filter(i=>i>=0&&i<lesson.turns.length);
  if(!valid.length){active=false;return;}
  valid.forEach((index,i)=>{
   const utterance=new SpeechSynthesisUtterance(lesson.turns[index].fr);
   utterance.lang='fr-FR';utterance.rate=rate;if(french)utterance.voice=french;
   if(i===valid.length-1){
    utterance.onend=()=>{active=false;if(!destroyed&&wrapper.isConnected)voiceStatus.textContent='TTS sequence ended. Audio quality and audibility were not measured.';};
    utterance.onerror=()=>{active=false;if(!destroyed&&wrapper.isConnected)voiceStatus.textContent='TTS encountered an error. Use the original transcript.';};
   }
   try{synth.speak(utterance);}catch{
    active=false;voiceStatus.textContent='TTS could not start. Use transcript-led practice.';
   }
  });
  voiceStatus.textContent=french?'Requested French TTS using '+french.name+'.':
   'Requested French TTS; this device did not expose a French voice inventory.';
 }
 const playAll=action('Play full original exchange',()=>speak(lesson.turns.map((_,i)=>i)));
 const playTurn=action('Play selected turn',()=>speak([Number(turnSelect.value)]));
 const stopButton=action('Stop audio',()=>{stop();voiceStatus.textContent='Playback stopped.';});
 if(!supported){playAll.disabled=true;playTurn.disabled=true;voiceStatus.textContent='TTS unavailable. You can study the transcript and take the same source-based questions without an audio claim.';}
 audioControls.append(playAll,playTurn,stopButton);
 const support=el('div','','u30-support');
 const supportControls=el('div','','u30-support-controls');
 const excerpt=el('p','','u30-excerpt');excerpt.hidden=true;excerpt.lang='fr';
 const transcript=el('ol','','u30-transcript');transcript.hidden=true;
 lesson.turns.forEach((turn,i)=>{
  const li=el('li','','u30-line');
  li.append(el('strong','Turn '+(i+1)+' · '+turn.speaker+': '));
  const fr=el('span',turn.fr);fr.lang='fr';li.append(fr);transcript.append(li);
 });
 const english=el('ol','','u30-glosses');english.hidden=true;
 lesson.turns.forEach((turn,i)=>english.append(el('li','Turn '+(i+1)+' · '+turn.en)));
 let supportLevel=0;
 const supportState=el('p','Support: transcript hidden.','u30-support-state');
 const showTurn=action('Reveal current French turn',()=>{
  supportLevel=Math.max(supportLevel,1);updateExcerpt();excerpt.hidden=false;
  supportState.textContent='Support: one original French turn revealed.';
 });
 const showAll=action('Reveal full attributed transcript',()=>{
  supportLevel=Math.max(supportLevel,2);
  transcript.hidden=!transcript.hidden;
  showAll.textContent=transcript.hidden?'Reveal full attributed transcript':'Hide full attributed transcript';
  showAll.setAttribute('aria-expanded',String(!transcript.hidden));
  supportState.textContent='Support: full original transcript has been revealed.';
 });
 showAll.setAttribute('aria-expanded','false');
 const showEnglish=action('Reveal original English explanations',()=>{
  supportLevel=Math.max(supportLevel,3);english.hidden=!english.hidden;
  showEnglish.textContent=english.hidden?'Reveal original English explanations':'Hide English explanations';
  showEnglish.setAttribute('aria-expanded',String(!english.hidden));
  supportState.textContent='Support: original English explanations have been revealed.';
 });
 supportControls.append(showTurn,showAll,showEnglish);
 support.append(supportControls,supportState,excerpt,transcript,english);
 audio.append(audioControls,voiceStatus,support);
 const decisions=lesson.decisions;
 const tabs=el('nav','','u30-tabs');tabs.setAttribute('aria-label','Listening question category');
 const progress=el('p','','u30-progress');progress.setAttribute('role','status');
 const questionHost=el('article','','u30-question');
 const navigation=el('div','','u30-navigation');
 const written=el('section','','u30-written');
 const transfer=el('section','','u30-interpretation');
 transfer.append(el('h4','Independent spoken interpretation → writing'));
 const taskPrompt=el('p','Explain, out loud in French, what one speaker asserts, what remains uncertain, and which exact line supports your interpretation. Then write a short source-qualified summary in French. This activity is self-reviewed, not automatically marked.','u30-note');
 const oral=source.oral;
 if(oral?.prompt)transfer.append(el('p','Original oral task: '+oral.prompt));
 if(oral?.plan?.length){
  const plan=el('ol');oral.plan.forEach(s=>plan.append(el('li',s)));transfer.append(plan);
 }
 const editorLabel=el('label','Private working draft · not saved or transmitted','u30-editor-label');
 const editor=el('textarea');editor.rows=4;editor.placeholder='Selon le dialogue, … Pourtant, … Il reste à vérifier …';
 editor.setAttribute('aria-label','Optional independent French oral and writing preparation');
 editorLabel.append(editor);
 const revision=el('ul','','u30-self-check');
 for(const check of [
  'Identify speakers and distinguish their statements from your inference.',
  'Quote or locate the French utterance supporting each important claim.',
  'Preserve negation, uncertainty, conditional meaning and source limits.',
  'Distinguish a written independent document from words actually spoken.',
  'Say your summary aloud without reading it; revise unclear formulations.'
 ])revision.append(el('li',check));
 const selfModel=el('p',oral?.model??'Compare your own interpretation with the original French turns and their published English explanations.','u30-model');
 selfModel.lang='fr';selfModel.hidden=true;
 const modelToggle=action('Reveal original oral model / guidance',()=>{
  selfModel.hidden=!selfModel.hidden;modelToggle.textContent=selfModel.hidden?'Reveal original oral model / guidance':'Hide original oral model / guidance';
 });
 const handoffs=el('div','','u30-handoffs');
 if(opts.onOpenSurface){
  for(const [surface,label] of [['read','Continue to original reading'],['write','Continue to independent writing']] as const){
   if(surface==='read'&&!source.reading)continue;
   if(surface==='write'&&!source.unit.writing.prompt)continue;
   handoffs.append(action(label,()=>{
    if(editor.value.trim()&&!window.confirm('This U30 private draft is not saved. Discard it and change workspace?'))return;
    opts.onOpenSurface?.(surface,id);
   }));
  }
 }
 if(opts.onNativeReview)handoffs.append(action('Open native scheduled Review',()=>{
  if(editor.value.trim()&&!window.confirm('Discard the U30 private draft and open native Review?'))return;
  opts.onNativeReview?.();
 }));
 transfer.append(taskPrompt,editorLabel,el('h5','Self-review checklist'),revision,modelToggle,selfModel,handoffs,
  el('p','Speaking preparation and written summary are ungraded visits. Practice history, native due reviews, FSRS and CEFR estimates remain unchanged.','u30-note'));
 content.append(title,notice,provenance,speakers,audio,tabs,progress,questionHost,navigation,written,transfer);
 let index=0,category:U30Kind|null=null;
 const responses=new Map<string,{correct:boolean;chosen:string;support:number;ttsRequested:boolean}>();
 const visibleDecisions=()=>category?decisions.filter(d=>d.kind===category):decisions;
 function updateExcerpt(){
  const d=visibleDecisions()[index],turn=d?.turnIndex;
  if(turn==null){excerpt.textContent=d?.evidence??'';return;}
  excerpt.textContent='Turn '+(turn+1)+' · '+lesson.turns[turn].fr;
 }
 function showWrittenEvidence():void{
  written.replaceChildren();
  if(!lesson.documents.length)return;
  const details=el('details','','u30-documents');
  details.append(el('summary','Independent original written documents · not audio'));
  for(const doc of lesson.documents){
   const card=el('article','','u30-document');
   card.append(el('h5',doc.label+' · '+doc.type));
   const fr=el('p',doc.fr);fr.lang='fr';card.append(fr);details.append(card);
  }
  written.append(details);
 }
 function drawTabs():void{
  tabs.replaceChildren();
  const counts=[...new Set(decisions.map(d=>d.kind))] as U30Kind[];
  for(const kind of counts){
   const button=action(LABELS[kind]+' · '+decisions.filter(d=>d.kind===kind).length,()=>{
    category=kind;index=0;drawTabs();draw();
   });
   if(category===kind)button.setAttribute('aria-current','true');
   tabs.append(button);
  }
  tabs.prepend(action('All decisions · '+decisions.length,()=>{
   category=null;index=0;drawTabs();draw();
  }));
 }
 function draw():void{
  const pool=visibleDecisions();const d=pool[index];
  questionHost.replaceChildren();navigation.replaceChildren();
  if(!d)return;
  excerpt.hidden=true;
  const prior=responses.get(d.id);
  progress.textContent='Decision '+(index+1)+' / '+pool.length+' · '+responses.size+' attempted in this page · '+LABELS[d.kind]+
   ' · TTS requests '+requestCount+(usedSlow?' · slow playback used':'')+'. No formal grades.';
  const heading=el('h4',d.question);heading.tabIndex=-1;
  questionHost.append(el('p',LABELS[d.kind]+' · original turn '+(d.turnIndex===null?'written source':d.turnIndex+1),'u30-source'),heading);
  const form=el('form','','u30-answer');
  const selectLabel=el('label','Choose the answer supported by the original source');
  const picker=el('select');picker.setAttribute('aria-label','Answer '+d.id);
  const empty=el('option','Select a source-supported interpretation');empty.value='';picker.append(empty);
  d.options.forEach(value=>{const option=el('option',value);option.value=value;picker.append(option);});
  selectLabel.append(picker);
  const hint=el('p',d.hint,'u30-hint');hint.hidden=true;
  const hintButton=action('Show listening hint',()=>{hint.hidden=false;supportLevel=Math.max(supportLevel,1);});
  const feedback=el('p','','u30-feedback');feedback.setAttribute('role','status');
  const submit=el('button','Check against authored key','primary-action compact-action');submit.type='submit';
  if(prior){
   picker.value=prior.chosen;feedback.textContent=(prior.correct?'Supported. ':'Needs correction. ')+evaluateU30Answer(d,prior.chosen).feedback+
    ' Earlier support level: '+prior.support+'.'+(prior.ttsRequested?' TTS was requested, not verified.':' Text-only attempt.');
  }
  form.addEventListener('submit',event=>{
   event.preventDefault();
   if(!picker.value){feedback.textContent='Choose an answer before checking.';return;}
   const checked=evaluateU30Answer(d,picker.value);
   responses.set(d.id,{chosen:picker.value,correct:checked.correct,support:supportLevel,
    ttsRequested:requestCount>0});
   feedback.textContent=(checked.correct?'Supported. ':'Needs correction. ')+checked.feedback+
    (requestCount?' TTS was requested; audio reception is unverified.':' No TTS requested: this was text-based comprehension.');
   progress.textContent='Decision '+(index+1)+' / '+pool.length+' · '+responses.size+' decisions attempted locally; no Practice event recorded.';
  });
  form.append(selectLabel,submit,hintButton,hint,feedback);
  questionHost.append(form);
  const prev=action('Previous question',()=>{index=Math.max(0,index-1);draw();});
  const next=action('Next question',()=>{index=Math.min(pool.length-1,index+1);draw();});
  prev.disabled=index===0;next.disabled=index===pool.length-1;
  navigation.append(prev,next);
  const key=action('Show correct source and explanation',()=>{
   excerpt.hidden=false;updateExcerpt();supportLevel=Math.max(supportLevel,2);
   const note=el('p','Correct authored answer: '+d.answer+'. '+d.explanation,'u30-feedback');
   questionHost.append(note);
  });
  navigation.append(key);
  heading.focus({preventScroll:true});
 }
 const cleanup=()=>{destroyed=true;stop();};
 opts.signal.addEventListener('abort',cleanup,{once:true});
 showWrittenEvidence();drawTabs();draw();
 return cleanup;
}
