import type { RouteContext } from '../core/types';
import { loadContentManifest } from '../core/content/manifest';
import { readActiveStudySession } from '../core/learner/repository';
import { createLearnStudySession,createTodayStudySession } from '../core/learner/study-session-builder';

export async function mount({main,signal,navigate}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page learn-page"><p class="eyebrow">Adaptive curriculum</p><h1>Learn</h1><p class="lede">Start a new-card session or let French compose today’s due + new work from your migrated limits.</p><div class="inline-status" data-status>Loading curriculum index…</div><div class="action-grid learn-actions"><button class="primary-action" data-start="today">Study today</button><button class="secondary-action" data-start="new">Learn new words</button></div><div data-resume></div></section>';
  const manifest=await loadContentManifest(signal);
  const status=main.querySelector<HTMLElement>('[data-status]');
  const todayButton=main.querySelector<HTMLButtonElement>('[data-start="today"]');
  const newButton=main.querySelector<HTMLButtonElement>('[data-start="new"]');
  const resumeHost=main.querySelector<HTMLElement>('[data-resume]');
  if(status){
    const records=manifest.totals?.records??0;
    const packs=manifest.totals?.packs??manifest.packs.length;
    status.textContent=records?records.toLocaleString()+' vocabulary records across '+packs+' on-demand packs.':'Content migration has not started yet.';
  }

  const active=await readActiveStudySession();
  if(active&&resumeHost){
    const card=document.createElement('div');card.className='inline-status resume-session';
    const text=document.createElement('span');
    text.textContent='Saved '+active.mode+' session · '+Math.max(0,active.queueIds.length-active.cursor)+' items remaining';
    const resume=document.createElement('button');resume.type='button';resume.className='secondary-action compact-action';resume.textContent='Resume';
    resume.addEventListener('click',()=>navigate('review'));
    card.append(text,resume);resumeHost.append(card);
  }

  const start=async(kind:'today'|'new')=>{
    if(todayButton)todayButton.disabled=true;
    if(newButton)newButton.disabled=true;
    try{
      const session=kind==='today'?await createTodayStudySession():await createLearnStudySession();
      if(!session.queueIds.length){
        status!.textContent=kind==='today'?'Nothing is scheduled for today.':'No unseen vocabulary is available in the current corpus.';
        return;
      }
      navigate('review');
    }catch(error){
      status!.textContent='Could not build this study session.';
      console.error('French study session build failed',error);
    }finally{
      if(todayButton)todayButton.disabled=false;
      if(newButton)newButton.disabled=false;
    }
  };

  todayButton?.addEventListener('click',()=>void start('today'));
  newButton?.addEventListener('click',()=>void start('new'));
}
