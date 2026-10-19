import type {RouteContext} from '../core/types';
import {loadStableReadingPack,type ReadingItem} from '../core/content/loader';
import {loadContentManifest} from '../core/content/manifest';
import {originalP32Question,verifyP32SourceAuthority,type P32SourceAuthority} from '../core/learner/b2-source-contract';
import {readCanonicalLearnerState,compareAndSetB2Evidence} from '../core/learner/repository';
import {hydrateLearnerState} from '../core/storage/hydrate';
import {createFrenchPlayback} from './french-playback';
import {B2_ARGUMENT_PAIRS} from '../core/learner/b2-observation';
import {
 B2_EVIDENCE_KEY,B2_EVIDENCE_DAYS,B2_EVALUATOR_VERSION,
 normalizeB2Evidence,currentB2Evidence,assessB2Structure,
 finalizeB2Attempt,appendB2Attempt,emptyB2Evidence,
 type B2Kind,type B2Evidence,type B2Receipt
} from '../core/learner/b2-assessment';
import './b2.css';

function el<K extends keyof HTMLElementTagNameMap>(tag:K,copy='',cls=''):HTMLElementTagNameMap[K]{
 const node=document.createElement(tag);if(copy)node.textContent=copy;if(cls)node.className=cls;return node;
}
function button(label:string,cls='b2-action'):HTMLButtonElement{
 const node=el('button',label,cls);node.type='button';return node;
}
interface Run {
 kind:B2Kind;pair:number;cursor:0|1;startedAt:number;
 results:B2Receipt[];id:string;
}
export async function mount({main,signal,navigate}:RouteContext):Promise<void>{
 const host=el('section','','page b2-studio b2-assessment');
 host.append(el('p','B2 · independent structural assessment','eyebrow'),
  el('h1','B2 Evidence Lab'),
  el('p','Two-task calibrated checks against observable writing structure and original source contact. A local structural result is not a human examination, linguistic accuracy judgment, P25 promotion, P28 benchmark, CEFR certificate or P35 assessment result.','lede'));
 const status=el('p','Reading private assessment history…','b2-loading');status.setAttribute('role','status');
 const stage=el('div','','b2-stage');
 host.append(status,stage);
 main.replaceChildren(host);
 const active=()=>!signal.aborted&&host.isConnected;
 let evidence:B2Evidence=emptyB2Evidence(),run:Run|null=null;
 let sources:ReadingItem[]=[],sourceAuthority:P32SourceAuthority|null=null,sourceProblem='',savePending=false;
 const speech=createFrenchPlayback(signal);
 let audioStarts=0,audioCompleted=false,audioPending=false,audioError='',transcriptRevealed=false;
 const sourceFor=(pair:number,cursor:0|1):ReadingItem|null=>{
  if(sources.length<6)return null;
  return sources[(pair*2+cursor)%sources.length]??null;
 };
 const loadSource=async()=>{
  try{
   const [pack,manifest]=await Promise.all([loadStableReadingPack(signal),loadContentManifest(signal)]);
   if(!active())return;
   sourceAuthority=verifyP32SourceAuthority(pack,manifest.packs.find(p=>p.id==='reading-stable-p35'));
   if(!sourceAuthority)throw Error('P35 B2 revision, original questions, IDs or pack digest invalid');
   sources=sourceAuthority.readings;
  }catch(error){
   sourceProblem='SHA-verified original P35 B2 source unavailable. P32 is locked, not replaced with invented text.';
   console.warn('U65 original B2 assessment source could not load',error);
  }
 };
 const refresh=async()=>{
  // Share the shell's guarded first-import pipeline before touching the
  // learner row. A direct deep link must never pre-empt P35 migration.
  await hydrateLearnerState();
  const learner=await readCanonicalLearnerState();
  if(!active())return false;
  if(!learner){status.textContent='Canonical learner state is not initialized. Use the original Learn route first.';return false;}
  const normalized=normalizeB2Evidence(learner.featureState[B2_EVIDENCE_KEY]);
  if(!normalized){
   status.textContent='Unsupported or damaged assessment evidence; no overwrite is permitted. Preserve a backup and resolve this state before assessing.';
   return false;
  }
  evidence=normalized;return true;
 };
 const renderHome=()=>{
  if(!active())return;
  speech.cancel();run=null;
  const p31=currentB2Evidence(evidence,'p31'),p32=currentB2Evidence(evidence,'p32',Date.now(),sourceAuthority?.digest);
  const last31=[...evidence.history].reverse().find(e=>e.kind==='p31');
  const last32=[...evidence.history].reverse().find(e=>e.kind==='p32');
  status.textContent=evidence.history.length+' private assessment receipts · evaluator '+B2_EVALUATOR_VERSION+' · '+B2_EVIDENCE_DAYS+'-day evidence window';
  stage.replaceChildren();
  const overview=el('section','','b2-assessment-summary');
  overview.append(el('h2','Independent structural evidence'));
  for(const [name,current,last] of [
   ['P31 · Sustained argumentation',p31,last31],
   ['P32 · Original-source transfer',p32,last32]
  ] as const){
   const card=el('div','','b2-assessment-line');
   card.append(el('strong',name),el('span',current?
    'Current structural thresholds met · '+new Date(current.at).toLocaleDateString():
    last?'No current structural qualification · latest '+last.status.replace(/-/g,' '):
     'No completed assessment'));
   overview.append(card);
  }
  overview.append(el('p','Only a current P31 structural-threshold result unlocks P32. P32 requires one reading and one listening task from different original P35 B2 source IDs. Failing a scored rerun supersedes earlier evidence; an unscored attempt does not.','b2-disclaimer'));
  stage.append(overview);
  const actions=el('div','','b2-actions');
  const open31=button('Begin P31 two-task argument assessment','b2-action is-primary');
  open31.onclick=()=>start('p31');
  actions.append(open31);
  const open32=button('Begin P32 original-source capstone');
  const can32=Boolean(p31)&&Boolean(sourceAuthority)&&sources.length===6&&speech.supported;
  open32.disabled=!can32;
  open32.onclick=()=>start('p32');
  actions.append(open32);
  stage.append(actions);
  if(!p31)stage.append(el('p','P32 locked: finish a current P31 two-task structural assessment first. Historical P35 results are not reinterpreted.','b2-disclaimer'));
  if(sourceProblem)stage.append(el('p',sourceProblem,'b2-disclaimer'));
  if(!speech.supported)stage.append(el('p','P32 calibrated listening unavailable: browser speech synthesis is missing. P31 writing remains available; use P32 supported practice in the original studio.','b2-disclaimer'));
  const practice=button('Return to B2 practice');
  practice.onclick=()=>navigate('b2');stage.append(practice);
  if(evidence.history.length){
   const history=el('details','','b2-comprehension');history.append(el('summary','Versioned historical receipts (no prose or transcript)'));
   const list=el('ol');
   for(const entry of [...evidence.history].reverse().slice(0,8)){
    list.append(el('li',entry.kind.toUpperCase()+' · '+new Date(entry.at).toLocaleString()+
     ' · '+entry.status.replace(/-/g,' ')+' · '+entry.tasks.map(t=>t.taskId+' '+t.score+' structural').join(' / ')));
   }
   history.append(list);stage.append(history);
  }
 };
 const start=(kind:B2Kind)=>{
  if(!active()||savePending)return;
  if(kind==='p32'&&(!currentB2Evidence(evidence,'p31')||!sourceAuthority||sources.length!==6||!speech.supported))return;
  const count=evidence.history.filter(e=>e.kind===kind).length;
  run={kind,pair:count%3,cursor:0,startedAt:Date.now(),results:[],id:crypto.randomUUID()};
  audioStarts=0;audioCompleted=false;audioPending=false;audioError='';transcriptRevealed=false;
  renderTask();
 };
 const renderTask=()=>{
  if(!active()||!run)return;
  speech.cancel();audioPending=false;
  const attempt=run;
  const source=attempt.kind==='p32'?sourceFor(attempt.pair,attempt.cursor):null;
  const original=attempt.kind==='p31'?B2_ARGUMENT_PAIRS[attempt.pair][attempt.cursor]:null;
  const taskId=original?.id??source?.id??'missing-source';
  const question=source?originalP32Question(source,source.questions[attempt.cursor]?.id??''):null;
  let selectedAnswer:number|null=null;
  status.textContent=attempt.kind.toUpperCase()+' · task '+(attempt.cursor+1)+' / 2 · independent evidence only';
  stage.replaceChildren();
  const panel=el('article','','b2-prompt');
  panel.append(el('p',(attempt.kind==='p31'?'ARGUMENT':'SOURCE TRANSFER')+
   ' · Task '+(attempt.cursor+1)+' of 2','b2-kicker'),
   el('h2',original?.title??source?.title??'Original source unavailable'));
  if(original){
   panel.append(el('p',original.task,'b2-question'));
   const criteria=el('ul','','b2-criteria');
   for(const q of original.questions)criteria.append(el('li',q));
   panel.append(criteria,el('p','Calibration: at least 110 words, four sentences, topic contact, observable argumentation, nuance, cohesion, and no strong repetition. The offline markers do not evaluate correctness.','b2-disclaimer'));
  }else if(source){
   panel.append(el('p','Source '+source.id+' · '+source.sourceLabel+' · '+source.license+' · P35 '+(sourceAuthority?.revision??'unverified')+' · SHA '+(sourceAuthority?.digest.slice(0,12)??'unknown'),'b2-source-id'));
   panel.append(el('p','The original keyed question checks a specific detail. A correct selection does not verify the meaning or originality of your written synthesis.','b2-disclaimer'));
   panel.append(el('p',attempt.cursor===0?
    'Read the original French source and produce a qualified independent synthesis. Select relevant ideas, consider a limitation and conclude in your own words.':
    'Hear the original French source (no transcript) and write a qualified synthesis from memory. Browser speech events cannot verify comprehension or the quality of audio.','b2-question'));
   const excerpt=el('div','','b2-source-text');
   excerpt.setAttribute('aria-label','Original B2 assessment source');
   for(const sentence of source.sentences)excerpt.append(el('p',sentence.fr));
   if(attempt.cursor===0)panel.append(excerpt);
   else{
    const state=el('p','No complete French playback yet.','b2-disclaimer');
    state.setAttribute('role','status');
    const play=button('Play original French (maximum two)');
    play.disabled=!speech.supported;
    play.onclick=()=>{
     if(!active()||run!==attempt||audioStarts>=2||audioPending||audioCompleted&&audioStarts>=2)return;
     audioPending=true;audioCompleted=false;play.disabled=true;audioError='';
     state.textContent='Playback requested; only onstart and onend can confirm device events.';
     const requested=speech.play(source.sentences.map(s=>s.fr).join(' '),1,()=>{
      if(!active()||run!==attempt)return;
      audioStarts++;state.textContent='French synthesis started ('+audioStarts+'/2). Awaiting completion.';
     },()=>{
      if(!active()||run!==attempt)return;
      audioPending=false;audioCompleted=false;audioError='Device playback failed.';
      state.textContent=audioError+' This task will abstain; use supported practice instead.';
      play.disabled=true;
     },()=>{
      if(!active()||run!==attempt)return;
      audioCompleted=true;audioPending=false;
      state.textContent='Device reported playback completion ('+audioStarts+'/2). This is not proof of listening proficiency.';
      play.disabled=audioStarts>=2;
     });
     if(!requested){
      audioPending=false;audioError='Device speech could not start.';state.textContent=audioError;
      play.disabled=true;
     }
    };
    const switchPractice=button('Open supported listening practice (discard assessment)');
    switchPractice.onclick=()=>{transcriptRevealed=true;speech.cancel();navigate('b2');};
    panel.append(el('div','','b2-listening'));panel.lastElementChild?.append(play,switchPractice,state);
   }
   if(question){
    const quiz=el('fieldset','','b2-source-question');
    quiz.append(el('legend','Original P35 source question · '+question.id));
    quiz.append(el('p',question.prompt,'b2-question'));
    for(let i=0;i<question.options.length;i++){
     const label=el('label','','b2-check'),input=el('input');
     input.type='radio';input.name='source-answer-'+attempt.id+'-'+attempt.cursor;input.value=String(i);
     input.addEventListener('change',()=>{if(input.checked)selectedAnswer=i;});
     label.append(input,document.createTextNode(question.options[i]));quiz.append(label);
    }
    panel.append(quiz);
   }else{
    panel.append(el('p','Original P35 comprehension key unavailable; this task will abstain.','b2-disclaimer'));
   }
  }else{
   panel.append(el('p','Original P35 B2 source has disappeared; assessment will abstain.','b2-disclaimer'));
  }
  const form=el('section','','b2-writing');
  form.append(el('h3','Independent response'));
  const answer=el('textarea');answer.rows=12;answer.maxLength=12000;
  answer.setAttribute('aria-label','Calibrated B2 French response');
  answer.placeholder='Rédigez votre réponse en français…';
  const metrics=el('p','','b2-count');metrics.setAttribute('aria-live','polite');
  answer.addEventListener('input',()=>{metrics.textContent=String(answer.value.trim().split(/\s+/).filter(Boolean).length)+' approximate words';});
  form.append(answer,metrics);
  const consent=el('label','','b2-check');
  const checked=el('input');checked.type='checkbox';
  consent.append(checked,document.createTextNode(attempt.kind==='p31'?
   'I wrote this response independently, without a translator, AI-generated answer, prepared notes, or a model response.':
   'I wrote this response independently, without a translator, AI-generated answer or prepared notes; I used only the provided original source in the permitted modality.'));
  form.append(consent);
  const feedback=el('div','','b2-report');feedback.setAttribute('role','status');
  const controls=el('div','','b2-actions');
  const submit=button('Submit independent task '+(attempt.cursor+1),'b2-action is-primary');
  const discard=button('Discard assessment without saving');
  discard.onclick=()=>{if(savePending)return;speech.cancel();run=null;renderHome();};
  submit.onclick=async()=>{
   if(!active()||run!==attempt||savePending)return;
   if(!answer.value.trim()){feedback.textContent='Write a response before submitting. Nothing recorded.';return;}
   submit.disabled=true;
   const receipt=assessB2Structure({
    kind:attempt.kind,taskId,modality:attempt.kind==='p31'?'argument':attempt.cursor===0?'reading':'listening',
    text:answer.value,elapsedMs:Date.now()-attempt.startedAt,attested:checked.checked,
    pair:attempt.pair,taskIndex:attempt.cursor,
    source:source??undefined,sourceAuthority:sourceAuthority??undefined,
    questionId:question?.id,answerIndex:selectedAnswer,playCount:audioStarts,
    audioCompleted:audioCompleted&&!audioPending&&!audioError,
    transcriptRevealed
   });
   // Raw response is lost when this task closes. Only a bounded receipt survives.
   answer.value='';
   if(attempt.cursor===0){
    attempt.results.push(receipt);
    feedback.replaceChildren(el('h4','Task 1 recorded in this tab only'),
     el('p',receipt.status.replace(/-/g,' ')+' · '+receipt.reason),
     el('p','Observable structural proxy '+receipt.score+'/100; no semantic, grammar or CEFR grade.'));
    controls.replaceChildren();
    const continueButton=button('Continue to task 2','b2-action is-primary');
    continueButton.onclick=()=>{if(run!==attempt)return;attempt.cursor=1;attempt.startedAt=Date.now();
     audioStarts=0;audioCompleted=false;audioPending=false;audioError='';renderTask();};
    controls.append(continueButton,discard);
    return;
   }
   attempt.results.push(receipt);
   if(attempt.results.length!==2){feedback.textContent='Incomplete assessment pair; nothing saved.';return;}
   let completed;
   try{completed=finalizeB2Attempt(attempt.kind,attempt.results[0],attempt.results[1],Date.now());}
   catch{feedback.textContent='Task source mismatch; nothing was saved.';return;}
   savePending=true;
   feedback.textContent='Saving versioned aggregate results to the original learner record…';
   try{
    // Recheck the live P31 prerequisite and original CAS token inside this tab;
    // a competing tab is separately rejected atomically in IndexedDB.
    const now=Date.now();
    if(attempt.kind==='p32'){
     if(!currentB2Evidence(evidence,'p31',now))
      throw Error('P32 prerequisite expired before completion');
     // The original pack digest is pinned to these JS bytes. Recheck it before
     // preserving the source-linked receipt, not just when entering P32.
     const manifest=await loadContentManifest(signal);
     const descriptor=manifest.packs.find(p=>p.id==='reading-stable-p35');
     if(!sourceAuthority||descriptor?.sha256!==sourceAuthority.digest||
        completed.tasks.some(t=>t.sourceDigest!==sourceAuthority?.digest))
      throw Error('P32 source revision changed; no stale evidence was saved');
    }
    const next=appendB2Attempt(evidence,completed,crypto.randomUUID());
    const saved=await compareAndSetB2Evidence(evidence.token,next);
    if(!active())return;
    if(saved!=='saved')throw Error('Concurrent assessment update: do not overwrite another tab. Reload to review newest results.');
    evidence=next;run=null;speech.cancel();
    stage.replaceChildren();
    status.textContent='Original learner aggregate saved · '+completed.kind.toUpperCase()+' · '+completed.status.replace(/-/g,' ');
    const result=el('section','','b2-assessment-summary');
    result.append(el('h2','Two-task structural report'),
     el('p','Result: '+completed.status.replace(/-/g,' ')+'. This is only bounded offline structural evidence; it does not establish language ability, P35 calibrated qualification or certified B2 proficiency.','b2-disclaimer'));
    for(const t of completed.tasks){
     result.append(el('p',t.taskId+' · '+t.modality+' · '+t.status.replace(/-/g,' ')+
      ' · structural proxy '+t.score+'/100 · observation confidence '+t.confidence+
      '/100 · '+t.wordCount+' words · '+t.reason));
    }
    const back=button('Review B2 evidence and next action','b2-action is-primary');
    back.onclick=()=>renderHome();result.append(back);stage.append(result);
   }catch(error){
    if(!active())return;
    feedback.textContent=String(error instanceof Error?error.message:error)+
     ' Your response was not persisted; no learner data was overwritten.';
    // Keep receipt metadata in-memory for diagnostics, but do not silently retry.
    status.textContent='B2 evidence not saved';
   }finally{savePending=false;}
  };
  controls.append(submit,discard);
  form.append(controls,feedback);
  stage.append(panel,form);
 };
 try{
  if(!await refresh())return;
  await loadSource();
  if(!active())return;
  renderHome();
 }catch(error){
  if(!active())return;
  status.textContent='Could not read the original private learner evidence. No change was saved.';
  console.error('U65 learner evidence read failed',error);
 }
}
