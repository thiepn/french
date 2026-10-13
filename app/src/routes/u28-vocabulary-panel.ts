import {
 originalVocabularyForUnit,originalVocabularyRelated,originalVocabularyWitnesses,
 originalLexicalContrastsForUnit,originalLexicalExercises,compareOriginalLexicalAnswer,
 originalLexicalCorrection,browseOriginalVocabulary,
 type OriginalLexeme,type OriginalLexicalExercise
} from '../core/unified/u28-vocabulary.ts';
import {getOriginalCatalogEntry,neighboringOriginalLessons,type OriginalSurface} from '../core/unified/u23-registry.ts';
import './u28-vocabulary-panel.css';

type Mode='course'|'read'|'listen'|'write';
type Phase='discover'|'retrieve'|'transfer';
export interface OriginalVocabularyJourneyOptions {
 readonly mode:Mode;
 readonly signal:AbortSignal;
 readonly onNativeReview?:()=>void;
 readonly onOpenCourse?:(id:string)=>void;
 readonly onOpenSurface?:(surface:Exclude<OriginalSurface,'course'>,id:string)=>void;
}
function el<K extends keyof HTMLElementTagNameMap>(tag:K,text='',cls=''):HTMLElementTagNameMap[K]{
 const element=document.createElement(tag);if(text)element.textContent=text;if(cls)element.className=cls;return element;
}
function button(label:string,onClick:()=>void,cls='secondary-action compact-action'):HTMLButtonElement{
 const b=el('button',label,cls);b.type='button';b.addEventListener('click',onClick);return b;
}
function contextLine(host:HTMLElement,original:string,caption:string){
 const p=el('p',original,'u28-french');p.lang='fr';
 host.append(el('p',caption,'u28-note'),p);
}
/**
 * Session-only original-source recall, with no grades or new review writer.
 * A keyed match says nothing about native mastery or ungraded creative output.
 */
export function appendOriginalVocabularyJourney(host:HTMLElement,id:string,opts:OriginalVocabularyJourneyOptions):void{
 const entry=getOriginalCatalogEntry(id),words=originalVocabularyForUnit(id);
 if(!entry||!words.length)return;
 const wrapper=el('section','','u28-vocabulary');
 wrapper.setAttribute('aria-label','Original source-qualified vocabulary journey');
 const disclosure=el('details','','u28-disclosure');
 disclosure.open=opts.mode==='course';
 disclosure.append(el('summary','Vocabulary journey · '+words.length+' original expressions'));
 const body=el('div','','u28-body');
 wrapper.append(disclosure);disclosure.append(body);host.append(wrapper);
 const selectedWords=new Set<string>();
 const keyedMatches=new Set<string>();
 let selected=words[0].key,phase:Phase='discover',exercise=0;
 const heading=el('h3','Use vocabulary in context');heading.tabIndex=-1;
 const note=el('p','Every expression and example is from this original lesson. Hints, answers, oral practice and keyed matches remain in this page visit; native Review is separate.','u28-note');
 const tabs=el('nav','','u28-phases');
 tabs.setAttribute('aria-label','Vocabulary learning stages');
 const picker=el('select');picker.setAttribute('aria-label','Choose an original French expression');
 for(const word of words){const o=el('option',word.french+' · '+word.english);o.value=word.key;picker.append(o);}
 const pickerLabel=el('label','Choose an expression','u28-picker');pickerLabel.append(picker);
 const status=el('p','','u28-status');status.setAttribute('role','status');
 const content=el('div','','u28-content');
 body.append(heading,note,tabs,pickerLabel,status,content);
 const play=(utterance:string)=>{
  if(opts.signal.aborted||!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){
   status.textContent='French device speech is unavailable. The original text remains readable.';
   return;
  }
  window.speechSynthesis.cancel();
  const voices=window.speechSynthesis.getVoices();
  const fr=voices.find(v=>v.lang.toLowerCase()==='fr-fr')??voices.find(v=>v.lang.toLowerCase().startsWith('fr'));
  if(voices.length&&!fr){
   status.textContent='No French voice is installed on this device. Use the written example.';
   return;
  }
  const item=new SpeechSynthesisUtterance(utterance);
  item.lang='fr-FR';item.rate=.88;if(fr)item.voice=fr;
  item.onerror=()=>{if(!opts.signal.aborted)status.textContent='Device speech was interrupted; use the written example.';};
  window.speechSynthesis.speak(item);
 };
 const footer=(item:OriginalLexeme,area:HTMLElement)=>{
  const actions=el('div','','u28-actions');
  const next=words[words.indexOf(item)+1];
  actions.append(button('Read original lesson',()=>opts.onOpenCourse?.(id)));
  if(opts.onNativeReview)actions.append(button('Native scheduled Review',opts.onNativeReview));
  if(next)actions.append(button('Next expression →',()=>{
   selected=next.key;exercise=0;picker.value=selected;draw();
  }));
  area.append(actions);
 };
 const renderDiscover=(item:OriginalLexeme)=>{
  const pane=el('div','','u28-discovery');
  const word=el('h4',item.french,'u28-headword');word.lang='fr';
  pane.append(el('p',entry.level+' · original expression '+item.order+'/'+words.length,'u28-eyebrow'),word);
  const gloss=el('p','','u28-gloss');gloss.hidden=true;
  gloss.textContent=item.english;
  const show=button('Reveal English gloss',()=>{
   gloss.hidden=!gloss.hidden;
   show.textContent=gloss.hidden?'Reveal English gloss':'Hide English gloss';
   show.setAttribute('aria-expanded',String(!gloss.hidden));
  });show.setAttribute('aria-expanded','false');
  pane.append(show,gloss);
  contextLine(pane,item.context,'Original authored context (not a fabricated example)');
  const actions=el('div','','u28-actions');
  actions.append(button('Hear expression (device TTS)',()=>play(item.french)),
   button('Hear original sentence (device TTS)',()=>play(item.context)));
  pane.append(actions);
  const witnesses=originalVocabularyWitnesses(item);
  if(witnesses.length>1){
   const sources=el('details','','u28-witnesses');
   sources.append(el('summary','More attestations within this original lesson ('+(witnesses.length-1)+')'));
   for(const source of witnesses.slice(1)){
    sources.append(el('p',source.source.replaceAll('-',' ')+' · '+source.qualifiedSourceId,'u28-source'));
    contextLine(sources,source.french,'Original '+source.source.replaceAll('-',' '));
    if(source.english)sources.append(el('p',source.english,'u28-translation'));
   }
   pane.append(sources);
  }
  const others=originalVocabularyRelated(item);
  if(others.length){
   const parallels=el('details','','u28-related');
   parallels.append(el('summary','Same written expression in '+others.length+' other original lesson'+(others.length===1?'':'s')));
   for(const other of others){
    const block=el('article','','u28-parallel');
    block.append(el('p',other.level+' · '+other.lessonId+' · '+other.qualifiedSourceId,'u28-source'));
    contextLine(block,other.context,'Source-authored context');
    block.append(button('Open this source lesson',()=>opts.onOpenCourse?.(other.lessonId)));
    parallels.append(block);
   }
   pane.append(parallels);
  }
  const contrasts=originalLexicalContrastsForUnit(id).filter(c=>
   c.terms.some(t=>t.normalize('NFC').toLowerCase()===item.french.normalize('NFC').toLowerCase()));
  for(const contrast of contrasts){
   const card=el('article','','u28-contrast');
   card.append(el('h5',contrast.title),el('p',contrast.rule),
    el('p','Typical confusion: '+contrast.pitfall,'u28-note'),
    el('p','Repair: '+contrast.correction),el('p','Use it: '+contrast.transfer,'u28-note'));
   pane.append(card);
  }
  pane.append(el('p','Source: '+item.qualifiedSourceId+' · vocabulary position '+item.order+
   ' · revision '+item.sourceRevision+'. No new card ID created.','u28-source'));
  pane.append(button('Try independent recall →',()=>{phase='retrieve';exercise=0;draw();},'primary-action compact-action'));
  content.append(pane);
 };
 const renderRetrieve=(item:OriginalLexeme)=>{
  const exercises=originalLexicalExercises(item);
  if(!exercises.length)return;
  exercise=Math.min(exercise,exercises.length-1);
  const task=exercises[exercise],form=el('form','','u28-recall');
  form.append(el('p','Original keyed exercise '+(exercise+1)+'/'+exercises.length+
   ' · '+task.type,'u28-eyebrow'),el('h4',task.question));
  const cue=el('p',task.sourceText,'u28-french');
  cue.lang=task.type==='meaning'?'fr':'fr';
  if(task.type==='production')cue.hidden=true;
  const cueToggle=button('Reveal original contextual cue',()=>{
   cue.hidden=!cue.hidden;cueToggle.textContent=cue.hidden?'Reveal original contextual cue':'Hide original contextual cue';
  });
  form.append(cueToggle,cue);
  const answerLabel=el('label','Your independent answer','u28-answer');
  const input=el('input');
  input.type='text';input.lang=task.type==='meaning'?'en':'fr';
  input.maxLength=200;input.autocomplete='off';input.spellcheck=false;
  input.setAttribute('aria-label',task.type==='meaning'?'Write English contextual meaning':'Write French expression');
  answerLabel.append(input);form.append(answerLabel);
  const feedback=el('p','','u28-feedback');feedback.setAttribute('role','status');
  const hint=el('p',task.hint,'u28-hint');hint.hidden=true;
  const model=el('p','','u28-model');model.hidden=true;
  let compared=false;
  const hintButton=button('Show hint',()=>{
   hint.hidden=!hint.hidden;hintButton.textContent=hint.hidden?'Show hint':'Hide hint';
  });
  const reveal=button('Show authored key',()=>{
   model.hidden=!model.hidden;
   model.textContent='Original keyed answer: '+task.answer+' · '+task.explanation;
   reveal.textContent=model.hidden?'Show authored key':'Hide authored key';
  });
  const submit=el('button','Compare with original key','primary-action compact-action');submit.type='submit';
  const next=button(exercise+1===exercises.length?'Transfer this expression →':'Next question →',()=>{
   if(exercise+1===exercises.length){phase='transfer';draw();}
   else{exercise++;draw();}
  });
  next.disabled=true;
  form.addEventListener('submit',e=>{
   e.preventDefault();
   const given=input.value.trim();
   if(!given){feedback.textContent='Write an answer, reveal a hint or choose the next expression.';return;}
   compared=true;
   const isMatch=compareOriginalLexicalAnswer(given,task.answer);
   const error=task.type==='production'||task.type==='cloze'?
    originalLexicalCorrection(item,given):null;
   if(isMatch){keyedMatches.add(task.id);feedback.textContent='Matches this authored key. '+task.explanation+
     ' A keyed match does not update native vocabulary mastery.';}
   else feedback.textContent=error?'This response matches a documented confusion: '+error+' '+task.explanation:
    'Not an exact match to this limited authored key. '+task.hint+
    ' Other valid French or English expressions are not automatically evaluated.';
   next.disabled=false;
   selectedWords.add(item.key);status.textContent=keyedMatches.size+
    ' question keys matched during this temporary visit. No native score or SRS review recorded.';
  });
  input.addEventListener('input',()=>{
   if(compared){next.disabled=true;feedback.textContent='Response changed. Compare the new answer or show the authored key.';compared=false;}
  });
  const actions=el('div','','u28-actions');
  actions.append(submit,hintButton,reveal,next);
  form.append(actions,feedback,hint,model,
   el('p','This single-key exercise does not grade synonyms, semantic accuracy or free writing.','u28-note'));
  content.append(form);
 };
 const renderTransfer=(item:OriginalLexeme)=>{
  const pane=el('div','','u28-transfer');
  pane.append(el('h4','Use « '+item.french+' » in a new context'),
   el('p','Original reference sentence: '+item.context,'u28-french'),
   el('p','Reading: identify the expression’s meaning from the original sentence before translating.','u28-note'),
   el('p','Listening: listen for the expression in the device-generated original example; the device does not grade your pronunciation.','u28-note'));
  const actions=el('div','','u28-actions');
  actions.append(button('Hear the contextual sentence',()=>play(item.context)));
  const writing=el('details','','u28-writing');
  writing.append(el('summary','Independent writing and speaking prompt'));
  writing.append(el('p','Create a different French sentence using « '+item.french+' ». Then say it aloud without reading. Do not assume the example is automatically validated.','u28-note'));
  const editor=el('textarea');editor.rows=3;editor.lang='fr';editor.maxLength=1000;
  editor.setAttribute('aria-label','Temporary independent French sentence');
  editor.placeholder='Write your own French sentence…';
  const source=el('p',item.context,'u28-model');source.lang='fr';source.hidden=true;
  const show=button('Compare with the original example',()=>{
   source.hidden=!source.hidden;
   show.setAttribute('aria-expanded',String(!source.hidden));
  });show.setAttribute('aria-expanded','false');
  writing.append(editor,show,source,el('p','This draft exists only inside this open panel, is never saved or graded and will be discarded when the panel changes.','u28-note'));
  pane.append(actions,writing);
  const cross=el('div','','u28-actions');
  const availability=getOriginalCatalogEntry(item.lessonId);
  if(availability?.reading&&opts.onOpenSurface)cross.append(button('Read linked original text',()=>opts.onOpenSurface!('read',id)));
  if(availability?.listening&&opts.onOpenSurface)cross.append(button('Listen to original dialogue',()=>opts.onOpenSurface!('listen',id)));
  if(availability?.writing&&opts.onOpenSurface)cross.append(button('Open independent Write',()=>opts.onOpenSurface!('write',id)));
  pane.append(cross);
  const n=neighboringOriginalLessons(id).next;
  if(n&&opts.onOpenCourse)pane.append(button('Preview next lesson: '+n.title,()=>opts.onOpenCourse!(n.id)));
  pane.append(el('p','Source: '+item.qualifiedSourceId+' · no CEFR, pronunciation or writing grade.','u28-source'));
  footer(item,pane);content.append(pane);
 };
 function draw(){
  if(opts.signal.aborted)return;
  const item=words.find(x=>x.key===selected)??words[0];
  if(!item)return;
  content.replaceChildren();picker.value=item.key;
  tabs.replaceChildren();
  for(const [value,label] of [['discover','1. Discover'],['retrieve','2. Recall'],['transfer','3. Use']] as const){
   const b=button(label,()=>{phase=value;exercise=0;draw();},'u28-phase');
   if(phase===value){b.classList.add('is-current');b.setAttribute('aria-current','step');}
   tabs.append(b);
  }
  status.textContent='Expression '+item.order+'/'+words.length+' · '+entry.level+
   ' · '+keyedMatches.size+' authored keys matched in this page visit (not a native score).';
  if(phase==='discover')renderDiscover(item);
  else if(phase==='retrieve')renderRetrieve(item);
  else renderTransfer(item);
 }
 picker.addEventListener('change',()=>{selected=picker.value;phase='discover';exercise=0;draw();});
 opts.signal.addEventListener('abort',()=>{
  keyedMatches.clear();selectedWords.clear();
  if('speechSynthesis' in window)window.speechSynthesis.cancel();
 },{once:true});
 draw();
}
