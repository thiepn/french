import type {RouteContext} from '../core/types';
import {COURSE_SESSIONS,findCourseSession} from '../core/unified/catalog';
import {SOURCES} from '../core/unified/source';
import {preflightLegacyJson,type LegacySource} from '../core/unified/preflight';
import './unified.css';

export function mount({main,signal,navigate}:RouteContext):void {
  main.innerHTML=`<section class="page unified-page">
    <p class="eyebrow">French curriculum · original teaching</p><h1>Course</h1>
    <p class="lede">Study 94 full original A1–B1+ lessons and 135 original U13–U21 practical communication scenarios. U21 adds long original early-B2 dialogues, six grounded optional device-TTS questions, multi-paragraph genre reading, contrasted original documents and three extended independent writing approaches with session-only source-specific revision.</p>
    <div class="unified-alert" role="note">The original A1–B1 course is practice-only and does not modify existing learner grades, SRS, CEFR or Account records. Native Learn and Review stay authoritative.</div>
    <section data-u6-a1 aria-label="Original A1 through B1 full lesson course"></section>
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
  const fullCourse=main.querySelector<HTMLElement>('[data-u6-a1]');
  if(fullCourse)void import('./u6-a1-panel').then(module=>{
    if(!signal.aborted)void module.mountA1FullCourse(fullCourse,navigate,signal);
  }).catch(error=>{
    if(!signal.aborted){fullCourse.textContent='Original A1 lessons unavailable. Native Learn remains available.';console.error(error);}
  });
  const studio=main.querySelector<HTMLElement>('[data-u2-studio]');
  if(studio)void import('./u2-studio').then(module=>{
    if(!signal.aborted)void module.mountOriginalLessons(studio,navigate,signal);
  }).catch(error=>{
    if(!signal.aborted){studio.textContent='Original course studio unavailable. Source references remain available.';console.error(error);}
  });
  show(1);
}
