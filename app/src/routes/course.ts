import type {RouteContext} from '../core/types';
import {COURSE_SESSIONS,findCourseSession} from '../core/unified/catalog';
import {SOURCES} from '../core/unified/source';
import {preflightLegacyJson,type LegacySource} from '../core/unified/preflight';
import './unified.css';
import './unified-u39.css';

export function mount({main,signal,navigate}:RouteContext):void {
  main.innerHTML=`<section class="page unified-page">
    <p class="eyebrow">French curriculum · original teaching</p><h1>Course</h1>
    <p class="lede">One original lesson at a time: understand the grammar, learn its vocabulary, read, listen, recall, and write. Continue your source-verified lesson position when available.</p>
    <div class="unified-alert" role="note">Course exercises are formative, not FSRS or CEFR grades. Only native Learn and Review schedule vocabulary.</div>
    <div class="u39-course-actions" role="group" aria-label="Original lesson and native review">
      <button class="primary-action" type="button" data-course-continue disabled>Loading the original lessons…</button>
      <button class="secondary-action" type="button" data-course-review>Open scheduled Review</button>
      <button class="secondary-action" type="button" data-course-new>Learn new vocabulary</button>
    </div>
    <p class="u39-course-status" data-course-status role="status">Preparing original teaching materials…</p>
    <section data-u6-a1 aria-label="Original A1 through early B2 full lesson Course"></section>
    <details class="u25-supplementary" data-u25-supplementary>
      <summary>Other original teaching, source positions and export preflight</summary>
    <h2 class="u6-supplementary-heading">Supplementary source references</h2>
    <p>Le Carnet Français: 60 indexed positions only. Lesson bodies and learner history remain rights-restricted and are not reproduced here.</p>
    <div class="unified-tools">
      <label>Jump to position <select data-position aria-label="Select course session"></select></label>
      <button type="button" class="secondary-action compact-action" data-grammar>Open Grammar</button>
      <button type="button" class="primary-action compact-action" data-learn>Practice native content</button>
    </div>
    <div class="unified-session-grid" data-grid aria-label="60 source session positions"></div>
    <article class="unified-detail" data-detail aria-live="polite"></article>
    <h2 class="u6-supplementary-heading">Supplementary micro-lessons and practice missions</h2>
    <p>Earlier short original lessons, thematic journeys and U5 missions remain available below the full A1 curriculum.</p>
    <section data-u2-studio aria-label="Original U2 lessons"></section>
    <div class="unified-tools"><button type="button" class="secondary-action compact-action" data-links>Open lexical review workbench</button></div>
    <section class="unified-import" aria-labelledby="u1-preflight-heading">
      <h2 id="u1-preflight-heading">Legacy export preflight</h2>
      <p>Select a JSON export already saved on this device to inspect its shape locally. This cannot import, merge, sync or change any learning history. Cross-site storage is never read.</p>
      <div class="unified-tools">
        <label>Original app <select data-source>
          <option value="carnet">Le Carnet Français</option>
          <option value="french22">French 2.2</option>
        </select></label>
        <label>JSON file <input data-file type="file" accept=".json,application/json"></label>
      </div>
      <p class="unified-result" data-result role="status" aria-live="polite">No export inspected.</p>
    </section>
    </details>
  </section>`;
  const select=main.querySelector<HTMLSelectElement>('[data-position]')!;
  const grid=main.querySelector<HTMLElement>('[data-grid]')!;
  const detail=main.querySelector<HTMLElement>('[data-detail]')!;
  const result=main.querySelector<HTMLElement>('[data-result]')!;
  const fileInput=main.querySelector<HTMLInputElement>('[data-file]')!;
  const sourceInput=main.querySelector<HTMLSelectElement>('[data-source]')!;
  for(const session of COURSE_SESSIONS){
    const option=document.createElement('option');option.value=String(session.position);
    option.textContent=session.label;select.append(option);
    const button=document.createElement('button');button.type='button';button.className='unified-session';
    button.textContent=String(session.position).padStart(2,'0');
    button.setAttribute('aria-label','Inspect '+session.label);
    button.addEventListener('click',()=>show(session.position));grid.append(button);
  }
  const show=(position:number)=>{
    const session=findCourseSession(position);if(!session)return;
    select.value=String(position);
    for(const button of grid.querySelectorAll<HTMLButtonElement>('button')){
      const chosen=Number(button.textContent)===position;
      button.classList.toggle('selected',chosen);
      if(chosen)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current');
    }
    detail.replaceChildren();
    const title=document.createElement('h2');title.textContent=session.label;
    const status=document.createElement('p');status.textContent='A1–A2 source position · reference only · rights review pending';
    const identity=document.createElement('code');identity.textContent=session.source.qualifiedId;
    const note=document.createElement('p');note.textContent='No source lesson body or legacy progress has been copied. Select Learn for the independent native study engine or Grammar for U1 original teaching examples.';
    detail.append(title,status,identity,note);
  };
  select.addEventListener('change',()=>show(Number(select.value)));
  main.querySelector('[data-grammar]')?.addEventListener('click',()=>navigate('grammar'));
  main.querySelector('[data-learn]')?.addEventListener('click',()=>navigate('learn'));
  fileInput.addEventListener('change',async()=>{
    const file=fileInput.files?.[0];if(!file)return;
    result.textContent='Inspecting selected file locally…';
    if(file.size>5*1024*1024){result.textContent='Blocked: file exceeds the 5 MiB preflight limit.';return;}
    try{
      const contents=await file.text();
      if(signal.aborted)return;
      const source=sourceInput.value as LegacySource;
      const report=preflightLegacyJson(contents,source);
      const sourceName=SOURCES[source].displayName;
      result.textContent=sourceName+': '+report.status+' · '+report.observedBytes.toLocaleString()+
        ' bytes · '+report.recordEstimate.toLocaleString()+' array items observed. '+
        (report.issues.length?'Issues: '+report.issues.join('; ')+'. ':'Schema shape inspected. ')+
        'No data imported; conversion and review scheduling remain disabled.';
    }catch{
      if(!signal.aborted)result.textContent='File could not be inspected. No data changed.';
    }finally{fileInput.value='';}
  });
  main.querySelector('[data-links]')?.addEventListener('click',()=>navigate('links'));
  const continueButton=main.querySelector<HTMLButtonElement>('[data-course-continue]');
  const courseStatus=main.querySelector<HTMLElement>('[data-course-status]');
  const fullCourse=main.querySelector<HTMLElement>('[data-u6-a1]');
  main.querySelector('[data-course-review]')?.addEventListener('click',()=>navigate('review'));
  main.querySelector('[data-course-new]')?.addEventListener('click',()=>navigate('learn'));
  continueButton?.addEventListener('click',()=>{
    if(signal.aborted||!fullCourse)return;
    // Delegate to U24's source-verified Continue/Resume button. No new checkpoint writer.
    const original=fullCourse.querySelector<HTMLButtonElement>('.u25-hero .primary-action');
    if(original)original.click();
    else courseStatus!.textContent='Original lessons have not finished opening.';
  });
  if(fullCourse)void import('./u6-a1-panel').then(async module=>{
    if(signal.aborted)return;
    await module.mountA1FullCourse(fullCourse,navigate,signal);
    if(signal.aborted)return;
    const ready=!!fullCourse.querySelector('.u6-lesson-content');
    if(continueButton){continueButton.disabled=!ready;continueButton.textContent=ready?
      'Start or continue original lesson →':'Original Course unavailable';}
    if(courseStatus)courseStatus.textContent=ready?
      'Your original lesson is ready. Continuing validates a saved source position; no mastery is inferred.':
      'Original Course could not open. Native Learn and Review remain available.';
  }).catch(error=>{
    if(signal.aborted)return;
    if(fullCourse)fullCourse.textContent='Original lessons unavailable. Native Learn and Review remain available.';
    if(continueButton){continueButton.disabled=true;continueButton.textContent='Original Course unavailable';}
    if(courseStatus)courseStatus.textContent='Could not load original Course. Use native Learn or Review.';
    console.error(error);
  });
  const studio=main.querySelector<HTMLElement>('[data-u2-studio]');
  const extra=main.querySelector<HTMLDetailsElement>('[data-u25-supplementary]');
  let studioMounted=false;
  const openSupplementaryStudio=()=>{
    if(studioMounted||!studio||signal.aborted)return;
    studioMounted=true;
    void import('./u2-studio').then(module=>{
      if(!signal.aborted)void module.mountOriginalLessons(studio,navigate,signal);
    }).catch(error=>{
      if(!signal.aborted){studio.textContent='Original course studio unavailable. Source references remain available.';console.error(error);}
    });
  };
  extra?.addEventListener('toggle',()=>{if(extra.open)openSupplementaryStudio();});
  show(1);
}
