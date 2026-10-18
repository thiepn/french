import type { RouteContext } from '../core/types';
import { ensureCanonicalLearnerState,replaceCanonicalLearnerSettings } from '../core/learner/repository';
import { createBackupArchive,inspectBackupArchive,restoreBackupArchive } from '../core/backup/archive';

function object(value:unknown):Record<string,unknown>{return value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};}
function number(value:unknown,fallback:number):number{const n=Number(value);return Number.isFinite(n)?n:fallback;}
function checked(value:unknown,fallback=false):boolean{return typeof value==='boolean'?value:fallback;}
function downloadText(text:string,filename:string):void{
  const blob=new Blob([text],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement('a');anchor.href=url;anchor.download=filename;anchor.hidden=true;
  document.body.append(anchor);anchor.click();anchor.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

export async function mount({main}:RouteContext):Promise<void>{
  const learner=await ensureCanonicalLearnerState();
  const current={...learner.settings};
  const session={...object(current.session)};
  main.innerHTML='<section class="page settings-page"><p class="eyebrow">Study configuration</p><h1>Settings</h1><p class="lede">Tune workload, review behavior, and local data recovery without loading these tools during startup.</p><form class="settings-form" data-form><section class="data-panel"><h2>Daily workload</h2><div class="field-grid"><label><span>New words / day</span><input name="dailyNewLimit" type="number" min="0" max="100" step="1"></label><label><span>Reviews / day</span><input name="dailyReviewLimit" type="number" min="10" max="1000" step="10"></label><label><span>Desired retention</span><input name="desiredRetention" type="number" min="0.70" max="0.97" step="0.01"></label></div></section><section class="data-panel"><h2>Answer behavior</h2><div class="field-grid"><label><span>Grading mode</span><select name="gradingMode"><option value="strict">Strict</option><option value="learning">Learning</option><option value="lenient">Lenient</option></select></label><label class="toggle-row"><input name="typed" type="checkbox"><span>Prefer typed answers</span></label><label class="toggle-row"><input name="strictArticles" type="checkbox"><span>Require articles when applicable</span></label><label class="toggle-row"><input name="siblingSpacing" type="checkbox"><span>Space sibling skills apart</span></label></div></section><div class="settings-actions"><button class="primary-action compact-action" type="submit">Save settings</button><p class="inline-status" data-status>Ready.</p></div></form><section class="data-panel data-recovery"><h2>Data & recovery</h2><p class="muted-copy">Backups include learner state, SRS, review history, user content, active sessions and migration metadata. Import replaces local vNext data only after integrity validation and a safety export.</p><div class="data-actions"><button class="secondary-action compact-action" data-export type="button">Export backup</button><label class="file-action"><span>Choose backup</span><input data-import type="file" accept="application/json,.json"></label></div><div class="backup-preview" data-preview hidden></div><label class="restore-confirm" data-confirm hidden><input type="checkbox" data-confirm-check><span>I understand that restoring replaces current local vNext data.</span></label><button class="secondary-action compact-action danger-action" data-restore type="button" hidden disabled>Restore selected backup</button><p class="inline-status" data-data-status>Local-first · no cloud connection is required.</p></section><section class="data-panel account-panel" data-account-panel><h2>THIEPN Account</h2><p class="muted-copy">Loading account boundary…</p></section></section>';
  const accountPanel=main.querySelector<HTMLElement>('[data-account-panel]');
  if(accountPanel)void import('../core/account/settings-ui').then(module=>module.mountFrenchAccountSettings(accountPanel)).catch(error=>{accountPanel.innerHTML='<h2>THIEPN Account</h2><p class="muted-copy">Account controls are unavailable in this build.</p>';console.warn(error);});
  const form=main.querySelector<HTMLFormElement>('[data-form]');
  const status=main.querySelector<HTMLElement>('[data-status]');
  if(!form||!status)return;
  const input=(name:string)=>form.elements.namedItem(name) as HTMLInputElement;
  const select=(name:string)=>form.elements.namedItem(name) as HTMLSelectElement;
  input('dailyNewLimit').value=String(Math.round(number(current.dailyNewLimit,20)));
  input('dailyReviewLimit').value=String(Math.round(number(current.dailyReviewLimit,200)));
  input('desiredRetention').value=number(current.desiredRetention,.9).toFixed(2);
  select('gradingMode').value=['strict','learning','lenient'].includes(String(current.gradingMode))?String(current.gradingMode):'learning';
  input('typed').checked=checked(session.typed,false);
  input('strictArticles').checked=checked(session.strictArticles,true);
  input('siblingSpacing').checked=checked(session.siblingSpacing,true);

  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const submit=form.querySelector<HTMLButtonElement>('button[type="submit"]');if(submit)submit.disabled=true;
    status.textContent='Saving…';
    try{
      const dailyNewLimit=Math.min(100,Math.max(0,Math.round(number(input('dailyNewLimit').value,20))));
      const dailyReviewLimit=Math.min(1000,Math.max(10,Math.round(number(input('dailyReviewLimit').value,200))));
      const desiredRetention=Math.min(.97,Math.max(.7,number(input('desiredRetention').value,.9)));
      const nextSession={...session,typed:input('typed').checked,strictArticles:input('strictArticles').checked,siblingSpacing:input('siblingSpacing').checked};
      const next={...current,dailyNewLimit,dailyReviewLimit,desiredRetention,gradingMode:select('gradingMode').value,session:nextSession};
      await replaceCanonicalLearnerSettings(next);
      Object.assign(current,next);Object.assign(session,nextSession);
      status.textContent='Saved on this device.';
    }catch(error){
      status.textContent='Could not save settings.';
      console.error('French settings save failed',error);
    }finally{if(submit)submit.disabled=false;}
  });

  const exportButton=main.querySelector<HTMLButtonElement>('[data-export]');
  const fileInput=main.querySelector<HTMLInputElement>('[data-import]');
  const preview=main.querySelector<HTMLElement>('[data-preview]');
  const confirmRow=main.querySelector<HTMLElement>('[data-confirm]');
  const confirmCheck=main.querySelector<HTMLInputElement>('[data-confirm-check]');
  const restoreButton=main.querySelector<HTMLButtonElement>('[data-restore]');
  const dataStatus=main.querySelector<HTMLElement>('[data-data-status]');
  let selectedText='';

  exportButton?.addEventListener('click',async()=>{
    exportButton.disabled=true;if(dataStatus)dataStatus.textContent='Building complete backup…';
    try{
      const backup=await createBackupArchive();downloadText(backup.text,backup.filename);
      if(dataStatus)dataStatus.textContent='Backup exported with SHA-256 integrity protection.';
    }catch(error){if(dataStatus)dataStatus.textContent='Backup export failed.';console.error(error);}
    finally{exportButton.disabled=false;}
  });

  fileInput?.addEventListener('change',async()=>{
    selectedText='';if(preview)preview.hidden=true;if(confirmRow)confirmRow.hidden=true;if(restoreButton){restoreButton.hidden=true;restoreButton.disabled=true;}if(confirmCheck)confirmCheck.checked=false;
    const file=fileInput.files?.[0];if(!file)return;
    if(dataStatus)dataStatus.textContent='Validating '+file.name+'…';
    try{
      const text=await file.text();
      const inspection=await inspectBackupArchive(text);
      selectedText=text;
      if(preview){
        preview.hidden=false;
        preview.textContent=new Date(inspection.createdAt).toLocaleString()+' · '+inspection.totalRows+' database rows · '+inspection.rowsByStore.activity+' activity events · '+inspection.rowsByStore.srs+' SRS records';
      }
      if(confirmRow)confirmRow.hidden=false;if(restoreButton)restoreButton.hidden=false;
      if(dataStatus)dataStatus.textContent='Backup validated. Review the preview before restoring.';
    }catch(error){
      if(dataStatus)dataStatus.textContent=error instanceof Error?error.message:'Backup validation failed.';
    }
  });
  confirmCheck?.addEventListener('change',()=>{if(restoreButton)restoreButton.disabled=!confirmCheck.checked||!selectedText;});
  restoreButton?.addEventListener('click',async()=>{
    if(!selectedText||!confirmCheck?.checked)return;
    restoreButton.disabled=true;if(dataStatus)dataStatus.textContent='Creating mandatory safety backup…';
    try{
      const safety=await createBackupArchive();downloadText(safety.text,'pre-restore-'+safety.filename);
      if(dataStatus)dataStatus.textContent='Safety backup exported. Restoring validated data…';
      await restoreBackupArchive(selectedText);
      if(dataStatus)dataStatus.textContent='Restore complete. Reloading French…';
      setTimeout(()=>location.reload(),250);
    }catch(error){
      if(dataStatus)dataStatus.textContent=error instanceof Error?error.message:'Restore failed; current data was not replaced.';
      restoreButton.disabled=false;
    }
  });
}
