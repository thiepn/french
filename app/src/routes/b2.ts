import type {RouteContext} from '../core/types';
import {loadStableReadingPack,type ReadingItem} from '../core/content/loader';
import {createFrenchPlayback} from './french-playback';
import {B2_ARGUMENT_PAIRS,observeB2Draft,sourceFivegramOverlap} from '../core/learner/b2-observation';
import './b2.css';

type Track='argument'|'read'|'listen';
function el<K extends keyof HTMLElementTagNameMap>(tag:K,copy='',className=''):HTMLElementTagNameMap[K]{
 const n=document.createElement(tag);if(copy)n.textContent=copy;if(className)n.className=className;return n;
}
function action(label:string,className='b2-action'):HTMLButtonElement{
 const n=el('button',label,className);n.type='button';return n;
}
function pct(ratio:number):string{return (ratio*100).toFixed(1)+'%';}

export async function mount({main,signal,navigate}:RouteContext):Promise<void>{
 const host=el('section','','page b2-studio');
 host.append(
  el('p','B2 · advanced practice','eyebrow'),
  el('h1','Argument & Source Studio'),
  el('p','Build sustained French arguments and transform verified original reading or listening material. This is formative practice, not a P31/P32 calibration, P28 benchmark or CEFR promotion. No answer text, score or practice completion is saved.','lede')
 );
 const navigation=el('div','','b2-tracks');navigation.setAttribute('role','group');navigation.setAttribute('aria-label','Advanced practice track');
 const sets=el('div','','b2-sets');sets.setAttribute('role','group');sets.setAttribute('aria-label','Choose a practice prompt set');
 const stage=el('div','','b2-stage');
 const note=el('p','Preparing verified B2 source material…','b2-loading');note.setAttribute('role','status');
 const calibration=action('Open P31 / P32 independent B2 assessment');
 calibration.onclick=()=>navigate('b2-assess');
 host.append(calibration,navigation,sets,note,stage);
 main.replaceChildren(host);

 const speech=createFrenchPlayback(signal);
 let track:Track='argument',pair=0,argumentTask=0;
 let readings:ReadingItem[]=[];
 let sourceFailure='';
 const drafts=new Map<string,string>();
 const transcriptRevealed=new Set<string>();
 const playStarts=new Map<string,number>();
 let pendingPlay=false;
 const trackButtons:ReadonlyArray<readonly [Track,string,string]>=[
  ['argument','P31 · Argumentation','Two new original writing situations in each practice set'],
  ['read','P32 · Reading transfer','Write a synthesis from an original P35 B2 text'],
  ['listen','P32 · Listening transfer','Hear an original P35 B2 text before writing']
 ];
 const makeKey=(source:ReadingItem|null)=>track==='argument'?'argument:'+pair+':'+argumentTask:track+':'+(source?.id??'missing');
 const getSource=():ReadingItem|null=>{
  if(readings.length<2)return null;
  // Source selection retains original reading IDs and never manufactures source prose.
  const index=(pair*2+(track==='listen'?1:0))%readings.length;
  return readings[index];
 };
 const active=()=>!signal.aborted&&host.isConnected;
 const draw=()=>{
  if(!active())return;
  speech.cancel();pendingPlay=false;
  navigation.replaceChildren();
  for(const [name,title,description] of trackButtons){
   const button=action(title,'b2-tab'+(track===name?' is-active':''));
   button.title=description;button.setAttribute('aria-pressed',String(track===name));
   button.addEventListener('click',()=>{if(track===name)return;track=name;draw();});
   navigation.append(button);
  }
  sets.replaceChildren();
  for(let i=0;i<3;i++){
   const button=action('Set '+(i+1),'b2-set'+(pair===i?' is-active':''));
   button.setAttribute('aria-pressed',String(pair===i));
   button.addEventListener('click',()=>{if(pair===i)return;pair=i;argumentTask=0;draw();});
   sets.append(button);
  }
  stage.replaceChildren();
  const source=track==='argument'?null:getSource();
  if(track!=='argument'&&!source){
   note.textContent=sourceFailure||'At least two source-verified P35 B2 readings are required. This source-transfer track is unavailable; argument practice remains available.';
   stage.append(el('p','No original B2 source has been substituted with invented text. Use the ordinary Read or Listen routes until source packs are available.','b2-disclaimer'));
   const returnLink=action('Open original reading →');returnLink.addEventListener('click',()=>navigate('read'));stage.append(returnLink);
   return;
  }
  note.textContent=track==='argument'?
   'Six newly authored practice prompts follow the original P31 six-theme contract. They are not copied P35 assessment prompts.':
   'Original P35 '+source!.id+' · '+source!.sourceLabel+' · '+source!.license+' · independently verified public reading pack.';
  const key=makeKey(source);
  const prompt=el('article','','b2-prompt');
  const eyebrow=el('p',track==='argument'?'INDEPENDENT ARGUMENT · 150-WORD PRACTICE TARGET':
   track==='read'?'SOURCE-BASED READING → PRODUCTION':'SOURCE-BASED LISTENING → PRODUCTION','b2-kicker');
  prompt.append(eyebrow);
  if(track==='argument'){
   const definition=B2_ARGUMENT_PAIRS[pair][argumentTask];
   prompt.append(el('h2',definition.title),el('p',definition.task,'b2-question'));
   const tasks=el('div','','b2-tasks');
   for(let i=0;i<2;i++){
    const b=action('Task '+(i+1),'b2-set'+(argumentTask===i?' is-active':''));
    b.setAttribute('aria-pressed',String(argumentTask===i));
    b.onclick=()=>{argumentTask=i;draw();};tasks.append(b);
   }
   prompt.append(tasks);
   const criteria=el('ul','','b2-criteria');
   for(const q of definition.questions)criteria.append(el('li',q));
   prompt.append(el('p','Before inspecting any markers, explain your position in your own French. A structurally complete answer may still be incorrect or irrelevant.','b2-disclaimer'),criteria);
  }else{
   const reading=source!;
   prompt.append(el('h2',reading.title),el('p','Level '+reading.level+' · '+reading.topic+' · '+reading.register,'b2-source-id'));
   prompt.append(el('p',track==='read'?
    'Read the original French source, identify its central trade-offs and write an independent recommendation. Avoid copying source sentences.':
    'Listen to the original French source and write an independent account of the choices and limitations it describes. Device speech is not a verified recording or listening assessment.','b2-question'));
   const prose=reading.sentences.map(s=>s.fr).join(' ').trim();
   const excerpt=el('div','','b2-source-text');
   excerpt.setAttribute('aria-label','Verified original B2 source text');
   for(const sentence of reading.sentences)excerpt.append(el('p',sentence.fr));
   if(track==='read'){
    prompt.append(excerpt);
   }else{
    const state=el('p','Transcript hidden · no playback started.','b2-disclaimer');
    state.setAttribute('role','status');
    const play=action('Play French source');
    play.disabled=!speech.supported;
    if(!speech.supported)state.textContent='Device French speech is unavailable. Reveal the source for supported reading practice; no listening evidence is awarded.';
    play.onclick=()=>{
     const started=playStarts.get(key)??0;
     if(started>=2||pendingPlay||!active())return;
     pendingPlay=true;play.disabled=true;
     state.textContent='Device speech requested. A request is not evidence that playback started.';
     const startedOk=speech.play(prose,1,()=>{
      if(!active()||!stage.contains(play))return;
      pendingPlay=false;
      const next=(playStarts.get(key)??0)+1;playStarts.set(key,next);
      state.textContent='Device speech started '+next+'/2 times · rehearsal only, no listening score.';
      play.disabled=next>=2;
     },()=>{
      if(!active()||!stage.contains(play))return;
      pendingPlay=false;play.disabled=(playStarts.get(key)??0)>=2||!speech.supported;
      state.textContent='Device speech failed. Reveal the verified French text for supported reading practice.';
     });
     if(!startedOk){pendingPlay=false;play.disabled=true;state.textContent='Device speech unavailable; source reveal is the fallback.';}
    };
    const show=action('Reveal original transcript (supported)');
    show.onclick=()=>{
     transcriptRevealed.add(key);excerpt.hidden=false;
     state.textContent='Original source revealed. This is supported reading, not independent listening evidence.';
    };
    excerpt.hidden=!transcriptRevealed.has(key);
    if(excerpt.hidden===false)state.textContent='Transcript previously revealed in this open practice session · supported reading only.';
    const listening=el('div','','b2-listening');listening.append(play,show,state,excerpt);
    prompt.append(listening);
   }
   if(reading.questions.length){
    const original=el('details','','b2-comprehension');
    original.append(el('summary','Original comprehension questions (supported self-check)'));
    for(const q of reading.questions.slice(0,3))original.append(el('p',q.prompt));
    prompt.append(original);
   }
   prompt.append(el('p','Retain the source’s meaning, distinguish facts from opinions, qualify your recommendation and identify one limitation. Your response is not compared semantically with the source.','b2-disclaimer'));
  }
  const writing=el('section','','b2-writing');
  const heading=el('h3','Your independent French draft');
  const explain=el('p','Draft remains only in this open page. Leaving or reloading discards it; do not enter confidential material. Copy it before navigating away.','b2-disclaimer');
  const draft=el('textarea');
  draft.setAttribute('aria-label','B2 French draft');draft.rows=12;draft.maxLength=12000;
  draft.spellcheck=true;draft.value=drafts.get(key)??'';
  draft.placeholder='Rédigez votre réponse en français…';
  const measure=el('p','','b2-count');measure.setAttribute('aria-live','polite');
  const report=el('div','','b2-report');report.setAttribute('role','status');report.setAttribute('aria-live','polite');
  const refreshCount=()=>{
   const measurement=observeB2Draft(draft.value);
   measure.textContent=measurement.words+' words · '+measurement.sentences+' punctuated sentences · '+measurement.distinctWords+' distinct longer words';
  };
  draft.addEventListener('input',()=>{drafts.set(key,draft.value);refreshCount();report.replaceChildren();});
  refreshCount();
  const inspect=action('Inspect observable structure','b2-action is-primary');
  inspect.addEventListener('click',()=>{
   if(!active())return;
   const result=observeB2Draft(draft.value);
   report.replaceChildren(el('h4','Observable structure — no grade'));
   const observed=el('p',result.markerFamilies.length?
    'Detected connector families: '+result.markerFamilies.join(', ')+'.':
    'No listed discourse-connective families detected. Alternative valid phrasing is possible.');
   report.append(observed,el('p','Repeated five-word sequences: '+result.possibleRepeatedPhrases+' (a mechanical signal, not a quality judgment).'));
   if(source){
    const originalText=source.sentences.map(x=>x.fr).join(' ');
    report.append(el('p','Direct matching five-word windows: '+pct(sourceFivegramOverlap(draft.value,originalText))+
      '. This narrow diagnostic cannot determine plagiarism or semantic transfer.'));
   }
   const tips=el('ul');for(const item of result.guidance)tips.append(el('li',item));report.append(tips);
   report.append(el('p','Not checked: grammatical accuracy, truth, comprehension, argument validity, pronunciation, human-rated CEFR level or original P31/P32 calibration.','b2-disclaimer'));
  });
  const checklist=el('fieldset','','b2-self-check');
  checklist.append(el('legend','Human self-review — not an assessment result'));
  const criteria=track==='argument'?
   ['Did I answer the actual situation, not just provide a generic template?','Did I defend a position and explain a credible objection?','Are my conditions, examples and conclusion relevant?','Have I checked grammar and meaning without an automated proficiency claim?']:
   ['Did I represent the verified source faithfully?','Did I transform and select ideas rather than copy sentences?','Did I distinguish the source’s position from my own recommendation?','Could I defend my interpretation with specific original details?'];
  for(const item of criteria){
   const label=el('label','','b2-check');const checkbox=el('input');
   checkbox.type='checkbox';label.append(checkbox,document.createTextNode(item));checklist.append(label);
  }
  const footer=el('div','','b2-actions');footer.append(inspect);
  const copy=action('Copy draft');
  const copyStatus=el('p','','b2-disclaimer');copyStatus.setAttribute('role','status');
  copy.addEventListener('click',async()=>{
   try{
    if(!draft.value){copyStatus.textContent='Write a draft before copying.';return;}
    await navigator.clipboard.writeText(draft.value);
    copyStatus.textContent='Draft copied. No data was saved to French.';
   }catch{copyStatus.textContent='Clipboard unavailable. Select the draft and copy it manually.';}
  });
  footer.append(copy);
  const home=action(track==='argument'?'Open everyday writing':'Open original '+(track==='read'?'Read':'Listen'));
  home.onclick=()=>navigate(track==='argument'?'write':track);
  footer.append(home);
  writing.append(heading,explain,draft,measure,footer,copyStatus,report,checklist);
  stage.append(prompt,writing);
 };
 draw();
 try{
  const pack=await loadStableReadingPack(signal);
  if(!active())return;
  if(pack.schema!=='thiepn-french-reading-pack-v1'||!Array.isArray(pack.readings))
    throw Error('Unrecognized original reading pack.');
  readings=pack.readings.filter(item=>
   item.level==='B2'&&typeof item.id==='string'&&
   item.license&&item.sourceLabel&&Array.isArray(item.sentences)&&item.sentences.length>=3&&
   item.sentences.every(s=>typeof s.fr==='string'&&s.fr.trim().length>0));
  if(readings.length<2)sourceFailure='The verified original reading pack does not contain two qualified B2 texts. The integrated practice tracks remain unavailable.';
  if(active())draw();
 }catch(error){
  if(!active())return;
  sourceFailure='Verified original B2 reading source is currently unavailable. Reconnect or restore the offline pack; no replacement text will be invented.';
  console.warn('Native B2 source practice unavailable',error);
  draw();
 }
}
