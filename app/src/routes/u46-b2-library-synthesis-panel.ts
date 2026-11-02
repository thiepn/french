import {
 ORIGINAL_LIBRARY_SYNTHESIS,resolveLibrarySynthesisSources,checkLibrarySynthesisChoice,
 validateLibrarySynthesis,type ResolvedLibraryTurn
} from '../core/unified/u46-b2-library-synthesis.ts';
import './u46-b2-library-synthesis-panel.css';

type Mode='listen'|'speak';
function node<K extends keyof HTMLElementTagNameMap>(tag:K,text='',className=''):HTMLElementTagNameMap[K]{
 const result=document.createElement(tag);result.textContent=text;
 if(className)result.className=className;return result;
}
function button(text:string,onClick:()=>void):HTMLButtonElement{
 const result=node('button',text,'secondary-action compact-action');result.type='button';
 result.addEventListener('click',onClick);return result;
}
/** Disposable cumulative source study on the existing U30/U31 surfaces; never stores learner or voice data. */
export function appendLibrarySynthesis(host:HTMLElement,lessonId:string,signal:AbortSignal,mode:Mode,onPrivateChange?:()=>void):()=>void{
 if(lessonId!=='transfer-156'||validateLibrarySynthesis().length)return()=>{};
 const root=node('section','','u46-library-synthesis');
 root.setAttribute('aria-label','Three-lesson B2 library listening and oral synthesis');
 root.dataset.hasPrivateDraft='false';
 const disclosure=node('details');
 disclosure.open=mode==='speak';
 disclosure.append(node('summary','Cumulative library dossier · lessons 154–156 · listen and speak'));
 const body=node('div','','u46-library-body');disclosure.append(body);root.append(disclosure);host.append(root);
 body.append(node('h4','From the register to the council decision'),
  node('p','Compare original French turns across lessons 154, 155 and 156. The library and meeting are fictional; no recordings exist. Device text-to-speech is optional and does not prove hearing. Choices check authored source interpretations; spoken French and private rehearsal notes are not graded or saved.','u30-note'));
 const nav=node('nav','','u46-case-nav');nav.setAttribute('aria-label','Cumulative dossier questions');
 const prompt=node('h5');prompt.tabIndex=-1;
 const support=node('div','','u46-case-sources');
 const status=node('p','Original transcript hidden.','u46-status');status.setAttribute('role','status');
 const choiceHost=node('div','','u46-case-choice');
 const rehearsal=node('div','','u46-case-oral');
 const drafts=new Map<string,string>();
 const answers=new Map<string,string>();
 const revealed=new Set<string>();
 const rehearsed=new Set<string>();
 const modelRevealed=new Set<string>();
 let index=0,epoch=0,disposed=false,active=false;
 const canSpeak='speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
 const stop=()=>{
  ++epoch;
  if(canSpeak&&active){window.speechSynthesis.cancel();active=false;}
 };
 const updateDraftFlag=()=>{
  root.dataset.hasPrivateDraft=String([...drafts.values()].some(d=>d.trim().length>0));
  onPrivateChange?.();
 };
 function makeOriginalTurn(turn:ResolvedLibraryTurn):HTMLElement{
  const card=node('article','','u46-source-card');
  card.append(node('h6',turn.lessonId+' · original turn '+turn.number+' · '+turn.speaker),
   node('p',turn.lessonTitle+' · revision '+turn.sourceRevision,'u30-source'));
  const quote=node('p',turn.french);quote.lang='fr';card.append(quote);return card;
 }
 function playOriginal(turns:readonly ResolvedLibraryTurn[]):void{
  stop();
  if(!canSpeak){status.textContent='Device TTS is unavailable; reveal the original text to continue without claiming audio.';return;}
  const voices=window.speechSynthesis.getVoices();
  const voice=voices.find(v=>v.lang.toLowerCase()==='fr-fr')??
   voices.find(v=>v.lang.toLowerCase().startsWith('fr'));
  if(voices.length&&!voice){status.textContent='No French TTS voice is available; use the exact original French turns as text.';return;}
  const current=epoch;
  active=true;
  try{
   turns.forEach((turn,i)=>{
    const utterance=new SpeechSynthesisUtterance(turn.french);
    utterance.lang='fr-FR';utterance.rate=0.9;if(voice)utterance.voice=voice;
    utterance.onerror=()=>{
     if(disposed||epoch!==current)return;
     stop();status.textContent='Synthetic playback failed; read the original French sources instead.';
    };
    if(i===turns.length-1)utterance.onend=()=>{
     if(disposed||epoch!==current||!root.isConnected)return;
     active=false;
     status.textContent='Browser reported that synthetic playback ended. Audibility, language quality and comprehension are not verified.';
    };
    window.speechSynthesis.speak(utterance);
   });
   status.textContent=voice?
    'Requested French synthetic reading using '+voice.name+'. Speakers share the device voice.':
    'Requested device TTS with fr-FR language hint. French voice quality is unverified.';
  }catch{
   stop();status.textContent='Synthetic playback could not start; original French text remains available.';
  }
 }
 function draw(focus=false):void{
  stop();const item=ORIGINAL_LIBRARY_SYNTHESIS[index];
  const turns=resolveLibrarySynthesisSources(item);
  nav.replaceChildren();support.replaceChildren();choiceHost.replaceChildren();rehearsal.replaceChildren();
  if(!turns){status.textContent='Exact original dialogue anchors could not be verified. This activity is unavailable.';return;}
  ORIGINAL_LIBRARY_SYNTHESIS.forEach((entry,i)=>{
   const jump=button(entry.title,()=>{index=i;draw(true);});
   jump.setAttribute('aria-current',i===index?'step':'false');nav.append(jump);
  });
  prompt.textContent=item.title+' · '+item.question;
  if(focus)prompt.focus({preventScroll:true});
  const play=button('Play attributed French source turns (synthetic TTS)',()=>playOriginal(turns));
  play.disabled=!canSpeak;
  const stopButton=button('Stop synthetic reading',()=>{
   stop();status.textContent='Playback stopped. No completion or listening result can be inferred.';
  });
  const reveal=button(revealed.has(item.id)?'Hide original French turns':'Reveal original French turns',()=>{
   if(revealed.has(item.id))revealed.delete(item.id);else revealed.add(item.id);
   draw();
  });
  support.append(node('p',turns.length+' exact dialogue turns from '+new Set(turns.map(t=>t.lessonId)).size+' original lessons. No recordings or fabricated speech.','u30-note'),
   play,stopButton,reveal);
  const sources=node('div','','u46-source-list');sources.hidden=!revealed.has(item.id);
  for(const turn of turns)sources.append(makeOriginalTurn(turn));
  support.append(sources);
  status.textContent=revealed.has(item.id)?
   'Original French transcript visible; any subsequent answer is transcript-assisted.':
   canSpeak?'Original transcript hidden. Synthetic audio is optional.':'Device TTS unavailable. Reveal original French text for source-led practice.';
  const label=node('label','Choose the conclusion supported across all three lessons');
  const select=node('select');select.setAttribute('aria-label','Cumulative library answer '+item.id);
  const placeholder=node('option','Select a source-supported conclusion');placeholder.value='';
  select.append(placeholder);
  // Stable rotation avoids revealing the correct answer by fixed position.
  const options=[item.answer,...item.distractors];
  const shift=item.id.length%options.length;
  for(const text of [...options.slice(shift),...options.slice(0,shift)]){
   const option=node('option',text);option.value=text;select.append(option);
  }
  select.value=answers.get(item.id)??'';label.append(select);
  const result=node('p','','u46-choice-feedback');result.setAttribute('role','status');
  const check=button('Check against the three original sources',()=>{
   if(!select.value){result.textContent='Select a response first.';return;}
   answers.set(item.id,select.value);
   const verdict=checkLibrarySynthesisChoice(item,select.value);
   result.textContent=verdict.feedback+
    (revealed.has(item.id)?' Original transcript was revealed; this is supported text practice.':
     ' No verified audio hearing is claimed.')+
    ' Your free French response is not automatically assessed.';
  });
  if(answers.has(item.id)){
   const prior=checkLibrarySynthesisChoice(item,answers.get(item.id)!);
   result.textContent=prior.feedback+' Source-choice feedback only; no oral grade.';
  }
  const hint=node('p','Compare how the claim changes from initial measurement to consultation to conditional authorization.','u30-note');
  choiceHost.append(label,check,result,hint);
  rehearsal.append(node('h5','Independent French oral synthesis · '+item.title));
  const oralPrompt=node('p',item.frenchPrompt,'u46-french');oralPrompt.lang='fr';rehearsal.append(oralPrompt);
  const draftLabel=node('label','Optional private French rehearsal notes (not transmitted or saved)');
  const draft=node('textarea');draft.rows=5;draft.lang='fr';draft.spellcheck=true;
  draft.setAttribute('aria-label','Cumulative French oral synthesis notes');
  draft.placeholder='D’abord, selon le registre… Pendant la consultation… Le conseil a décidé… Toutefois…';
  draft.value=drafts.get(item.id)??'';
  draft.addEventListener('input',()=>{drafts.set(item.id,draft.value);updateDraftFlag();});
  draftLabel.append(draft);rehearsal.append(draftLabel);
  const spokenStatus=node('p','','u46-oral-status');spokenStatus.setAttribute('role','status');
  const selfReport=button('I rehearsed aloud (self-report only)',()=>{
   rehearsed.add(item.id);spokenStatus.textContent='Self-reported rehearsal on this page only. No speech, pronunciation, fluency or CEFR grade was recorded.';
  });
  const selfCriteria=node('ol','','u46-oral-criteria');
  for(const criterion of item.selfChecks){
   const li=node('li',criterion);li.lang='fr';selfCriteria.append(li);
  }
  const sample=node('div','','u46-oral-model');sample.hidden=!modelRevealed.has(item.id);
  sample.append(node('h6','Original authored comparison model'));
  const french=node('p',item.frenchModel);french.lang='fr';sample.append(french);
  sample.append(node('p','Compare source attribution, factual limits and conditions yourself. The model is one possible response, not automatic feedback on your notes or speech.','u30-note'));
  const revealModel=button(sample.hidden?'Reveal authored French model':'Hide authored French model',()=>{
   if(modelRevealed.has(item.id))modelRevealed.delete(item.id);else modelRevealed.add(item.id);draw();
  });
  rehearsal.append(selfReport,spokenStatus,node('h6','Four specific self-review criteria'),selfCriteria,revealModel,sample);
  if(rehearsed.has(item.id))spokenStatus.textContent='Rehearsal self-reported, not verified or graded.';
 }
 body.append(nav,prompt,support,status,choiceHost,rehearsal);
 draw();
 const cleanup=()=>{
  if(disposed)return;disposed=true;stop();signal.removeEventListener('abort',cleanup);
 };
 signal.addEventListener('abort',cleanup,{once:true});
 return cleanup;
}
