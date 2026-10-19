import type {RouteContext} from '../core/types';
import {hydrateLearnerState} from '../core/storage/hydrate';
import {readCanonicalLearnerState,compareAndSetB2Evidence} from '../core/learner/repository';
import {loadContentManifest} from '../core/content/manifest';
import {loadStableReadingPack} from '../core/content/loader';
import {verifyP32SourceAuthority} from '../core/learner/b2-source-contract';
import {B2_EVIDENCE_KEY,emptyB2Evidence,normalizeB2Evidence,currentB2Evidence,type B2Evidence} from '../core/learner/b2-assessment';
import {
 P33_PAIRS,P33_PREP_MS,P33_MAX_MS,P33_MIN_MS,P33_EVALUATOR,
 evaluateP33Task,completeP33Pair,currentP33Evidence,
 type P33Prompt,type P33Receipt,type P33FinalSegment,type P33Session
} from '../core/learner/b2-oral';
import './b2.css';

interface SpeechResultLike{isFinal:boolean;0:{transcript:string;confidence:number}}
interface SpeechEventLike{resultIndex:number;results:ArrayLike<SpeechResultLike>}
interface RecognitionLike{
 lang:string;continuous:boolean;interimResults:boolean;maxAlternatives:number;
 start():void;stop():void;abort():void;
 onstart:(()=>void)|null;onresult:((event:SpeechEventLike)=>void)|null;
 onerror:((event:{error?:string})=>void)|null;onend:(()=>void)|null;
}
type RecognitionCtor=new()=>RecognitionLike;
function recognitionCtor():RecognitionCtor|undefined{
 const provider=window as unknown as {SpeechRecognition?:RecognitionCtor;webkitSpeechRecognition?:RecognitionCtor};
 return provider.SpeechRecognition??provider.webkitSpeechRecognition;
}
function node<K extends keyof HTMLElementTagNameMap>(tag:K,txt='',cls=''):HTMLElementTagNameMap[K]{
 const out=document.createElement(tag);if(txt)out.textContent=txt;if(cls)out.className=cls;return out;
}
function action(txt:string,primary=false){
 const el=node('button',txt,'b2-action'+(primary?' is-primary':''));el.type='button';return el;
}
type Mode='assessment'|'practice';
export async function mount({main,signal,navigate}:RouteContext):Promise<void>{
 const host=node('section','','page b2-studio b2-oral');
 const head=node('h1','B2 spontaneous speaking');
 const status=node('p','Loading learner evidence…','b2-loading');status.setAttribute('role','status');
 const stage=node('div','','b2-stage');
 host.append(head,status,stage);main.replaceChildren(host);
 const alive=()=>!signal.aborted&&host.isConnected;
 let evidence:B2Evidence=emptyB2Evidence();
 let digest='',sourceError='',saving=false,mode:Mode='assessment';
 let currentRecognition:RecognitionLike|null=null,stopTimer=0,prepTimer=0;
 let recorderStartedAt=0,recorderStoppedAt=0,recorderError=false,stopping=false;
 let startObserved=false,segments=new Map<number,P33FinalSegment>(),session:P33Session|null=null;
 let runningTask:P33Prompt|null=null,activeTake=0;
 const clean=()=>{
  window.clearTimeout(stopTimer);window.clearInterval(prepTimer);
  if(currentRecognition){const current=currentRecognition;currentRecognition=null;
   current.onstart=null;current.onresult=null;current.onerror=null;current.onend=null;
   try{current.abort()}catch{/* user can revoke microphone access */}}
 };
 signal.addEventListener('abort',clean,{once:true});
 const reload=async()=>{
  const learner=await readCanonicalLearnerState();
  if(!alive()||!learner)throw Error('Original canonical learner not available');
  const saved=normalizeB2Evidence(learner.featureState[B2_EVIDENCE_KEY]);
  if(!saved)throw Error('Unsupported or damaged B2 evidence; no overwrite will be attempted');
  evidence=saved;session=evidence.oralSession??null;
 };
 const write=async(modify:(base:B2Evidence)=>B2Evidence)=>{
  if(saving)throw Error('Assessment save in progress');
  saving=true;
  try{
   const next=modify(evidence);
   const candidate={...next,token:crypto.randomUUID()};
   if(!normalizeB2Evidence(candidate))throw Error('Invalid P33 private evidence; nothing saved');
   if(await compareAndSetB2Evidence(evidence.token,candidate)!=='saved')
    throw Error('Other tab updated learner evidence. Reload before continuing; nothing was overwritten');
   evidence=candidate;session=evidence.oralSession??null;
  }finally{saving=false;}
 };
 const ready=()=>Boolean(digest)&&Boolean(currentB2Evidence(evidence,'p31'))&&
  Boolean(currentB2Evidence(evidence,'p32',Date.now(),digest));
 const showHome=()=>{
  if(!alive())return;clean();
  const eligible=ready(),ctor=recognitionCtor();
  const latest=currentP33Evidence(evidence.oralHistory??[],digest,eligible);
  status.textContent=latest?'Current observable P33 structural receipt · '+new Date(latest.at).toLocaleDateString():
   'No current P33 oral qualification. Practice is available separately.';
  stage.replaceChildren();
  const contract=node('p','P33 uses two original-source prompt families: zero preparation, then 20 seconds of mental preparation. Speech recognition may use an external browser service. Browser ASR is not a pronunciation, grammar, accent, semantic or CEFR assessment.','b2-disclaimer');
  stage.append(contract);
  const details=node('p','Assessment requires current P31 and original-revision-bound P32, working French speech recognition and explicit microphone access. Recognized text stays in this tab only. An interrupted take must be restarted; completed task metadata can be resumed.','b2-disclaimer');
  stage.append(details);
  const actions=node('div','','b2-actions');
  if(session){
   const resumed=action('Resume interrupted P33 two-task attempt',true);
   resumed.disabled=!eligible||!ctor;
   resumed.onclick=()=>{mode='assessment';renderTask()};
   actions.append(resumed);
   const discard=action('Discard incomplete P33 attempt');
   discard.onclick=async()=>{try{await write(old=>({...old,oralSession:undefined}));showHome()}
    catch(error){status.textContent=String(error)}};
   actions.append(discard);
  }else{
   const start=action('Start P33 two-task oral assessment',true);
   start.disabled=!eligible||!ctor;
   start.onclick=async()=>{
    if(!ready()||!recognitionCtor())return;
    try{
     const pair=(evidence.oralHistory?.length??0)%P33_PAIRS.length;
     const selected:P33Session={id:crypto.randomUUID(),pair,cursor:0,at:Date.now()};
     await write(old=>({...old,oralSession:selected}));mode='assessment';renderTask();
    }catch(error){status.textContent=String(error)}
   };actions.append(start);
  }
  const practice=action('Open text-only speaking rehearsal');
  practice.onclick=()=>{mode='practice';renderPractice()};
  actions.append(practice);
  const back=action('Return to B2 evidence');
  back.onclick=()=>navigate('b2-assess');actions.append(back);
  stage.append(actions);
  if(!eligible)stage.append(node('p','Assessment locked: obtain current P31 and P32 structural evidence bound to this installed original P35 reading revision. No historical P35 grade is reinterpreted.','b2-disclaimer'));
  if(!ctor)stage.append(node('p','Browser SpeechRecognition is unavailable; oral assessment abstains. Text rehearsal is not spoken evidence.','b2-disclaimer'));
  if(sourceError)stage.append(node('p',sourceError,'b2-disclaimer'));
  if(evidence.oralHistory?.length){
   const list=node('details','','b2-comprehension');list.append(node('summary','Private P33 aggregate history'));
   const ol=node('ol');
   for(const p of [...evidence.oralHistory].reverse()){
    ol.append(node('li',new Date(p.at).toLocaleString()+' · '+p.status.replaceAll('-',' ')+
     ' · '+p.tasks.map(t=>t.promptId+': '+t.words+' recognized words, '+t.durationMs/1000+'s').join(' / ')));
   }list.append(ol);stage.append(list);
  }
 };
 const renderPractice=()=>{
  clean();stage.replaceChildren();
  status.textContent='Text-only rehearsal · never P33 speech evidence';
  stage.append(node('h2','Prepare a spoken argument'));
  const pair=P33_PAIRS[(evidence.oralHistory?.length??0)%3];
  for(const prompt of pair){
   const section=node('section','','b2-prompt');
   section.append(node('h3',prompt.title),node('p',prompt.question,'b2-question'));
   const scratch=node('textarea','','b2-oral-scratch');scratch.rows=4;scratch.maxLength=2500;
   scratch.placeholder='Optional private text outline; not saved, graded, or counted as speech';
   scratch.setAttribute('aria-label','Private text-only rehearsal '+prompt.title);
   section.append(scratch);stage.append(section);
  }
  const returnButton=action('Return to P33 assessment');
  returnButton.onclick=showHome;stage.append(returnButton);
 };
 const renderTask=()=>{
  if(!alive())return;
  clean();stage.replaceChildren();
  if(!session||!ready()||!recognitionCtor()){showHome();return;}
  const prompt=P33_PAIRS[session.pair][session.cursor],selectedSession=session;
  const responseMode=prompt.mode;
  const promptVisible=responseMode==='brief-prep';
  const panel=node('section','','b2-prompt');
  const promptHead=node('h2',promptVisible?prompt.title:'Immediate response · prompt hidden');
  const question=node('p',promptVisible?prompt.question:'The prompt appears only after device recognition starts. Do not prepare notes.','b2-question');
  const label=node('p',prompt.mode==='immediate'?'Task 1 / 2 · zero preparation':
   'Task 2 / 2 · 20 seconds of mental preparation','b2-kicker');
  panel.append(label,promptHead,question);
  if(responseMode==='brief-prep')panel.append(node('p','Do not type or write notes during mental preparation.','b2-disclaimer'));
  const report=node('div','','b2-report');report.setAttribute('role','status');
  const controls=node('div','','b2-actions');
  const begin=action('Begin French speech recognition',true),stop=action('Finish this spoken response');
  stop.disabled=true;const exit=action('Leave and resume later');
  exit.onclick=()=>{clean();showHome();};
  controls.append(begin,stop,exit);
  panel.append(controls,report);stage.append(panel);
  status.textContent=prompt.mode==='immediate'?
   'Zero-preparation task: prompt is hidden until browser recognition reports started.':
   'Prepared task: a 20-second mental-planning window is required.';
  if(responseMode==='brief-prep'){
   const startPrep=async()=>{
    if(!alive()||session!==selectedSession)return;
    if(!selectedSession.prepStartedAt){
     try{
      const prepStartedAt=Date.now();
      await write(old=>({...old,oralSession:{...selectedSession,prepStartedAt}}));
     }catch(error){report.textContent=String(error);return}
    }
    const update=()=>{
     if(!alive())return;
     const ms=Math.max(0,(session?.prepStartedAt??Date.now())+P33_PREP_MS-Date.now());
     if(ms>0){begin.disabled=true;begin.textContent='Mental preparation: '+Math.ceil(ms/1000)+' s remaining';}
     else{begin.disabled=false;begin.textContent='Begin French speech recognition';window.clearInterval(prepTimer)}
    };update();prepTimer=window.setInterval(update,250);
   };void startPrep();
  }
  const evaluateEnd=async()=>{
   if(!alive()||!runningTask||session?.id!==selectedSession.id)return;
   const task=runningTask;runningTask=null;stop.disabled=true;
   const final=[...segments.entries()].sort(([a],[b])=>a-b).map(([,s])=>s);
   const result=evaluateP33Task(task,final,recorderStartedAt,recorderStoppedAt||Date.now(),recorderError||!startObserved);
   // Final text and ASR segments are discarded before any storage boundary.
   segments.clear();
   if(mode!=='assessment'){showHome();return}
   report.replaceChildren(node('h3','Observable oral evidence'),
    node('p',result.status.replaceAll('-',' ')+' · '+result.reason),
    node('p',result.words+' recognized words · '+Math.round(result.durationMs/1000)+' s · '+result.wordsPerMinute+' WPM · recognition confidence '+result.asrConfidence+'%'),
    node('p','Fluency proxy '+result.fluencyProxy+'/100 · discourse proxy '+result.discourseProxy+'/100 · '+result.selfCorrections+' explicit reformulations; these are not accent or semantic grades.'));
   controls.replaceChildren();
   const reflection=node('textarea','','b2-oral-scratch');reflection.rows=3;reflection.maxLength=1800;
   reflection.placeholder='Private self-repair: What would you qualify, clarify or reorganize? This text is not saved.';
   reflection.setAttribute('aria-label','Private unsaved oral self-repair notes');
   panel.append(reflection);
   const repeat=action('Retry current spoken task');
   repeat.onclick=()=>{if(!alive())return;renderTask()};controls.append(repeat);
   const continueButton=action(selectedSession.cursor===0?'Save task 1 evidence and continue to timed preparation':'Save two-task aggregate evidence',true);
   controls.append(continueButton);
   continueButton.onclick=async()=>{
    if(saving)return;
    try{
     if(!ready())throw Error('Current P31/P32 prerequisite expired or the original source changed');
     if(selectedSession.cursor===0){
      await write(old=>({...old,oralSession:{...selectedSession,cursor:1,first:result,prepStartedAt:Date.now()}}));
      renderTask();
     }else{
      if(!selectedSession.first)throw Error('Original immediate task missing');
      const completed=completeP33Pair(selectedSession.first,result,digest,Date.now());
      await write(old=>({...old,oralHistory:[...(old.oralHistory??[]),completed].slice(-12),oralSession:undefined}));
      showHome();
     }
    }catch(error){report.textContent=String(error)+' · no newer learner evidence was overwritten.'}
   };
  };
  begin.onclick=()=>{
   if(!alive()||!session||session.id!==selectedSession.id||!ready()||
    (responseMode==='brief-prep'&&Date.now()<(session.prepStartedAt??Infinity)+P33_PREP_MS))return;
   const ctor=recognitionCtor();if(!ctor){report.textContent='Speech recognition unavailable; no oral evidence.';return;}
   begin.disabled=true;activeTake++;const take=activeTake;
   const rec=new ctor();currentRecognition=rec;runningTask=prompt;
   recorderStartedAt=0;recorderStoppedAt=0;recorderError=false;stopping=false;startObserved=false;
   segments=new Map();
   rec.lang='fr-FR';rec.continuous=true;rec.interimResults=true;rec.maxAlternatives=1;
   rec.onstart=()=>{
    if(!alive()||currentRecognition!==rec||take!==activeTake)return;
    startObserved=true;recorderStartedAt=Date.now();
    if(responseMode==='immediate'){
     promptHead.textContent=prompt.title;question.textContent=prompt.question;
    }
    stop.disabled=false;report.textContent='Device reported recognition started. Respond for at least 40 seconds (maximum 105).';
    stopTimer=window.setTimeout(()=>{if(currentRecognition===rec){stopping=true;recorderStoppedAt=Date.now();rec.stop()}},P33_MAX_MS);
   };
   rec.onresult=event=>{
    if(!alive()||currentRecognition!==rec||!startObserved)return;
    for(let i=event.resultIndex;i<event.results.length;i++){
     const item=event.results[i];
     if(item?.isFinal&&typeof item[0]?.transcript==='string'){
      segments.set(i,{text:item[0].transcript.slice(0,2000),
       confidence:item[0].confidence,receivedAt:Date.now()});
     }
    }
   };
   rec.onerror=event=>{
    if(currentRecognition!==rec)return;
    recorderError=true;
    report.textContent='Speech recognition error ('+(event.error??'unknown')+'). This take will abstain; no recording is stored.';
   };
   rec.onend=()=>{
    if(currentRecognition!==rec||take!==activeTake)return;
    window.clearTimeout(stopTimer);currentRecognition=null;
    recorderStoppedAt=recorderStoppedAt||Date.now();
    void evaluateEnd();
   };
   try{rec.start()}catch{
    recorderError=true;recorderStoppedAt=Date.now();currentRecognition=null;
    report.textContent='Microphone access or device recognition start failed. No oral result was saved.';
    begin.disabled=false;runningTask=null;
   }
  };
  stop.onclick=()=>{
   if(!currentRecognition||stopping||!startObserved)return;
   stopping=true;stop.disabled=true;recorderStoppedAt=Date.now();
   try{currentRecognition.stop()}catch{
    recorderError=true;clean();void evaluateEnd();
   }
  };
 };
 try{
  await hydrateLearnerState();await reload();
  const [manifest,pack]=await Promise.all([loadContentManifest(signal),loadStableReadingPack(signal)]);
  if(!alive())return;
  const authority=verifyP32SourceAuthority(pack,manifest.packs.find(p=>p.id==='reading-stable-p35'));
  if(authority)digest=authority.digest;
  else sourceError='Original P35 source revision could not be verified; oral assessment locked.';
  showHome();
 }catch(error){
  if(!alive())return;
  sourceError='Original learner or P35 source unavailable; oral assessment cannot start.';
  status.textContent=sourceError;
  stage.replaceChildren(node('p',String(error),'b2-disclaimer'));
  const practice=action('Return to B2 practice');practice.onclick=()=>navigate('b2');stage.append(practice);
 }
}
