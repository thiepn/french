import './learn.css';
import type {RouteContext,RouteId} from '../core/types';
import {loadContentManifest} from '../core/content/manifest';
import {countDueSrs,readActiveStudySession,readCanonicalLearnerState} from '../core/learner/repository';
import {createLearnStudySession,createTodayStudySession} from '../core/learner/study-session-builder';

/** The Course owns original lesson checkpoints. This route only advertises their existence. */
function hasOriginalPosition(raw:unknown):boolean {
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return false;
  const value=raw as Record<string,unknown>;
  return value.schema==='original-course-checkpoint-v1'&&typeof value.id==='string'&&value.id.length>0;
}

export async function mount({main,signal,navigate}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page learn-page">'+
    '<p class="eyebrow">A clear place to begin</p><h1>Learn French</h1>'+
    '<p class="lede">Follow an original lesson, then practise with scheduled recall. Lessons and review are separate: completing a lesson never silently awards an FSRS grade or a CEFR level.</p>'+
    '<section class="learn-path" aria-labelledby="learn-course-heading">'+
      '<div><p class="learn-kicker">01 · Guided teaching</p><h2 id="learn-course-heading">Original French Course</h2>'+
      '<p>Build understanding through grammar, vocabulary, reading, listening, speaking and writing. Keep your source-verified lesson position.</p>'+
      '<p class="learn-path-note" data-course-position>Course checks the validity of any saved lesson when it opens.</p></div>'+
      '<button type="button" class="primary-action compact-action" data-course>Start or continue a lesson →</button></section>'+
    '<section class="learn-path" aria-labelledby="learn-study-heading">'+
      '<div><p class="learn-kicker">02 · Scheduled recall</p><h2 id="learn-study-heading">Vocabulary and Review</h2>'+
      '<p>Continue an unfinished session before starting another. Native scheduled grades belong only to Review.</p></div>'+
      '<p class="learn-path-note" data-corpus role="status">Checking available native content…</p>'+
      '<p class="learn-due" data-due>Reading your due count…</p>'+
      '<div data-resume></div>'+
      '<div class="learn-start-actions"><button class="primary-action compact-action" type="button" data-start="today" disabled>Study today</button>'+
      '<button class="secondary-action compact-action" type="button" data-start="new" disabled>Learn new words</button>'+
      '<button class="secondary-action compact-action" type="button" data-review>Open Review</button></div>'+
      '<p class="learn-path-note" data-status role="status" aria-live="polite">Checking saved study-session ownership…</p></section>'+
    '<section class="learn-skill-section" aria-labelledby="learn-skills-heading"><h2 id="learn-skills-heading">Practise another skill</h2>'+
      '<p>Open independent practice even when the vocabulary manifest is unavailable. Practice evidence is not a proficiency certificate.</p>'+
      '<div class="learn-skill-grid">'+
      '<button type="button" data-route="read"><strong>Read</strong><span>Understand graded French and personal texts</span></button>'+
      '<button type="button" data-route="listen"><strong>Listen</strong><span>First listening, transcript and repair</span></button>'+
      '<button type="button" data-route="speak"><strong>Speak</strong><span>Original oral prompts and recording</span></button>'+
      '<button type="button" data-route="conversation"><strong>Conversation</strong><span>Source-labelled exchanges and missions</span></button>'+
      '<button type="button" data-route="write"><strong>Write</strong><span>Sentences, constructions and transfer</span></button>'+
      '<button type="button" data-route="grammar"><strong>Grammar</strong><span>Explanations and original examples</span></button>'+
      '</div></section></section>';
  const status=main.querySelector<HTMLElement>('[data-status]')!;
  const corpus=main.querySelector<HTMLElement>('[data-corpus]')!;
  const dueStatus=main.querySelector<HTMLElement>('[data-due]')!;
  const position=main.querySelector<HTMLElement>('[data-course-position]')!;
  const today=main.querySelector<HTMLButtonElement>('[data-start="today"]')!;
  const fresh=main.querySelector<HTMLButtonElement>('[data-start="new"]')!;
  const resumeHost=main.querySelector<HTMLElement>('[data-resume]')!;
  main.querySelector('[data-course]')?.addEventListener('click',()=>navigate('course'));
  main.querySelector('[data-review]')?.addEventListener('click',()=>navigate('review'));
  main.querySelectorAll<HTMLButtonElement>('button[data-route]').forEach(button=>{
    button.addEventListener('click',()=>navigate(button.dataset.route as RouteId));
  });

  // Neither an unavailable manifest nor an IndexedDB failure should strand
  // a learner on a generic route-error screen without a Course/Review entry.
  const [content,active,learner,due]=await Promise.allSettled([
    loadContentManifest(signal),
    readActiveStudySession(),
    readCanonicalLearnerState(),
    countDueSrs(Date.now())
  ]);
  if(signal.aborted||!main.isConnected)return;

  const hasContent=content.status==='fulfilled'&&content.value.packs.length>0;
  if(hasContent){
    const records=content.value.totals?.records??0;
    corpus.textContent=records?records.toLocaleString()+' vocabulary records across '+content.value.packs.length+' verified packs.':
      content.value.packs.length+' verified content packs indexed.';
  }else{
    corpus.textContent='Vocabulary content is unavailable. Reconnect or restore the verified offline pack; original Course and other practice remain accessible.';
  }
  dueStatus.textContent=due.status==='fulfilled'?
    (due.value===0?'No scheduled words are due now.':due.value+' scheduled items due now.') :
    'Due count unavailable. Review can still try to recover the saved local session.';
  if(learner.status==='fulfilled'&&hasOriginalPosition(learner.value?.featureState?.vU24OriginalCourse)){
    position.textContent='A previous Course position is saved. Course will verify its original source before resuming.';
  }
  const saved=active.status==='fulfilled'?active.value:null;
  const unfinished=Boolean(saved&&saved.cursor<saved.queueIds.length);
  if(unfinished&&saved){
    const card=document.createElement('div');card.className='learn-resume';
    const text=document.createElement('p');
    text.textContent='Unfinished '+saved.mode+' session · '+Math.max(0,saved.queueIds.length-saved.cursor)+' items remaining';
    const button=document.createElement('button');button.type='button';button.className='secondary-action compact-action';
    button.textContent='Resume saved session';button.addEventListener('click',()=>navigate('review'));
    card.append(text,button);resumeHost.replaceChildren(card);
    status.textContent='Resume this session first. No new study queue has been created.';
  }else if(active.status==='rejected'){
    status.textContent='Saved study sessions could not be checked. Starting a new session is disabled to protect existing work; Course and Review remain available.';
  }else if(!hasContent){
    status.textContent='New vocabulary sessions require an available verified corpus. Existing Review and Course remain accessible.';
  }else{
    status.textContent='Ready to start. Study today respects your saved limits and due cards. '+corpus.textContent;
  }

  let starting=false;
  const mayStart=()=>hasContent&&active.status==='fulfilled'&&!unfinished&&!starting&&!signal.aborted;
  const updateButtons=()=>{
    today.disabled=!mayStart();fresh.disabled=!mayStart();
  };
  const start=async(kind:'today'|'new')=>{
    if(!mayStart())return;
    starting=true;updateButtons();
    status.textContent='Checking for another tab’s saved session…';
    try{
      const pending=await readActiveStudySession();
      if(pending&&pending.cursor<pending.queueIds.length){
        status.textContent='A session was started in another tab. Open Review to resume it; no new queue was created.';
        return;
      }
      const session=kind==='today'?await createTodayStudySession():await createLearnStudySession();
      if(signal.aborted)return;
      if(!session.queueIds.length){
        status.textContent=kind==='today'?'No due or new words are scheduled now.':'No new vocabulary is available at your current limits.';
        return;
      }
      if(session.mode!==(kind==='today'?'today':'learn')){
        status.textContent='Another tab owns a '+session.mode+' session. Open Review to continue it.';
        return;
      }
      navigate('review');
    }catch(error){
      if(!signal.aborted){
        status.textContent='Could not start a session. Your saved progress was not intentionally changed; check Review before retrying.';
        console.error('French learner session start failed',error);
      }
    }finally{
      starting=false;updateButtons();
    }
  };
  today.addEventListener('click',()=>void start('today'));
  fresh.addEventListener('click',()=>void start('new'));
  updateButtons();
}
