import type {RouteContext} from '../core/types';
import {hydrateLearnerState} from '../core/storage/hydrate';
import {readCanonicalLearnerState} from '../core/learner/repository';
import {loadStableReadingPack} from '../core/content/loader';
import {loadContentManifest} from '../core/content/manifest';
import {verifyP32SourceAuthority} from '../core/learner/b2-source-contract';
import {B2_EVIDENCE_KEY,normalizeB2Evidence} from '../core/learner/b2-assessment';
import {deriveB2Pathway,type B2PathStep} from '../core/learner/b2-pathway';
import './b2.css';

const element=<T extends keyof HTMLElementTagNameMap>(tag:T,label='',cls=''):HTMLElementTagNameMap[T]=>{
 const n=document.createElement(tag);n.textContent=label;
 if(cls)n.className=cls;
 return n;
};
function action(label:string,primary=false):HTMLButtonElement{
 const b=element('button',label,'b2-action'+(primary?' is-primary':''));
 b.type='button';return b;
}
const names:Record<B2PathStep['state'],string>={
 current:'Current',missing:'Not started',blocked:'Locked',
 expired:'Expired','scored-retest-needed':'Re-test needed','source-changed':'Source changed'
};
const date=(timestamp:number)=>new Date(timestamp).toLocaleDateString();
export async function mount({main,signal,navigate}:RouteContext):Promise<void>{
 const host=element('section','','page b2-studio b2-pathway');
 const heading=element('h1','B2 pathway');
 const status=element('p','Reading original learner evidence…','b2-loading');
 status.setAttribute('role','status');
 const stage=element('div','','b2-path-content');
 host.append(heading,status,stage);main.replaceChildren(host);
 const alive=()=>!signal.aborted&&host.isConnected;
 let sourceDigest:string|null=null,sourceError='';
 try{
  // Use the same strict content manifest and original P35 pack authority
  // already used by P32 and P33; never guess a source digest.
  const [pack,manifest]=await Promise.all([
   loadStableReadingPack(signal),loadContentManifest(signal)
  ]);
  const verified=verifyP32SourceAuthority(pack,manifest.packs.find(x=>x.id==='reading-stable-p35'));
  if(verified)sourceDigest=verified.digest;
  else sourceError='Original P35 B2 source verification failed. Source-dependent tasks are locked.';
 }catch{
  sourceError='Original P35 B2 source is unavailable. Existing local argument evidence is still readable.';
 }
 let reading=false;
 const refresh=async()=>{
  if(!alive()||reading)return;
  reading=true;
  try{
   await hydrateLearnerState();
   const learner=await readCanonicalLearnerState();
   if(!alive())return;
   if(!learner){
    status.textContent='Original learner state unavailable.';
    stage.replaceChildren();
    const learn=action('Open Learn',true);learn.onclick=()=>navigate('learn');stage.append(learn);
    return;
   }
   const evidence=normalizeB2Evidence(learner.featureState[B2_EVIDENCE_KEY]);
   if(!evidence){
    status.textContent='Unsupported or damaged B2 receipt. Existing data was not modified.';
    stage.replaceChildren(element('p','Preserve your original backup and resolve the unsupported receipt before proceeding.'));
    return;
   }
   const pathway=deriveB2Pathway(evidence,sourceDigest);
   status.textContent=pathway.completed+' of 3 current structural stages · original P35 source '+
    (pathway.sourceVerified?'verified':'unavailable');
   stage.replaceChildren();
   if(sourceError)stage.append(element('p',sourceError,'b2-path-warning'));
   const next=element('section','','b2-path-next');
   if(pathway.next){
    next.append(element('h2','Next step'),element('p',pathway.next.title));
    const go=action(pathway.next.action,true);
    go.onclick=()=>navigate(pathway.next!.route);
    go.disabled=pathway.next.state==='blocked';
    next.append(go);
    if(pathway.next.state==='blocked'){
     const alternate=action('Open prerequisite assessment',true);
     alternate.onclick=()=>navigate(pathway.next?.phase==='p33'?'b2-assess':'b2');
     next.append(alternate);
    }
   }else{
    next.append(element('h2','Three structural stages current'),
     element('p','P31, P32 and P33 have current local structural evidence. This does not grant a P35 assessment result or B2 benchmark pass.','b2-path-explanation'));
    const review=action('Review B2 evidence',true);review.onclick=()=>navigate('b2-assess');next.append(review);
   }
   stage.append(next);
   const list=element('ol','','b2-path-stages');
   for(const step of pathway.steps){
    const item=element('li','','b2-path-stage');
    const title=element('h3',step.title);
    const state=element('strong',names[step.state],'b2-path-state');
    const message=element('p',step.detail,'b2-path-explanation');
    item.append(title,state,message);
    if(step.lastAt!==undefined){
     item.append(element('p','Latest scored evidence: '+date(step.lastAt),'b2-path-date'));
    }
    if(step.expiresAt!==undefined)item.append(element('p','Valid through '+date(step.expiresAt),'b2-path-date'));
    const open=action(step.action);
    open.disabled=step.state==='blocked';
    open.onclick=()=>navigate(step.route);
    item.append(open);list.append(item);
   }
   const sequence=element('section','','b2-path-sequence');
   sequence.append(element('h2','Evidence stages'),list);
   stage.append(sequence);
   const boundary=element('section','','b2-path-boundary');
   boundary.append(element('h2','Original functional benchmark and maintenance'),
    element('p','P28 fixed-task benchmarks and P29 longitudinal maintenance are supported for A1–B1 in the original P35 application. P28 has no B2 mission battery; P29 cannot create B2 maintenance without real P28 passes.'),
    element('p','Completing the B2 pathway above does not unlock a fictional benchmark, grant a CEFR level or reset maintenance.'));
   const practice=action('Continue B2 supported practice');
   practice.onclick=()=>navigate('b2');boundary.append(practice);
   stage.append(boundary);
   const controls=element('div','','b2-actions');
   const update=action('Refresh current evidence');
   update.onclick=()=>void refresh();controls.append(update);
   stage.append(controls);
  }catch{
   if(alive())status.textContent='Could not read original local evidence. Nothing was changed.';
  }finally{reading=false;}
 };
 const focus=()=>{void refresh()};
 const visible=()=>{if(!document.hidden)void refresh()};
 window.addEventListener('focus',focus);
 document.addEventListener('visibilitychange',visible);
 signal.addEventListener('abort',()=>{
  window.removeEventListener('focus',focus);
  document.removeEventListener('visibilitychange',visible);
 },{once:true});
 await refresh();
}
