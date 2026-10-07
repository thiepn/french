import type { RouteContext } from '../core/types';
import {
  ensureCanonicalLearnerState,
  exportCanonicalBackup,
  updateCanonicalSettings
} from '../core/learner/repository';

function object(value:unknown):Record<string,unknown>{
  return value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
}
function number(value:unknown,fallback:number):number{
  const n=Number(value);return Number.isFinite(n)?n:fallback;
}
function downloadJson(filename:string,value:unknown):void{
  const blob=new Blob([JSON.stringify(value,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement('a');anchor.href=url;anchor.download=filename;anchor.click();
  setTimeout(()=>URL.revokeObjectURL(url),0);
}

export async function mount({main,signal}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page settings-page"><p class="eyebrow">Configuration</p><h1>Settings</h1><p class="lede">Study behavior is stored in the same canonical learner record used by Today and Review.</p><p class="inline-status" data-status>Loading settings…</p><form class="settings-form" data-form hidden><section class="settings-section"><h2>Daily workload</h2><label>New words per day<input name="dailyNewLimit" type="number" min="0" max="200" step="1"></label><label>Reviews per day<input name="dailyReviewLimit" type="number" min="0" max="1000" step="1"></label><label>Desired retention<input name="desiredRetention" type="number" min="70" max="97" step="1"><small>Percent target used by the scheduler.</small></label></section><section class="settings-section"><h2>Answer grading</h2><label>Grading mode<select name="gradingMode"><option value="strict">Strict</option><option value="learning">Learning</option><option value="lenient">Lenient</option></select></label><label class="check-setting"><input name="typed" type="checkbox"><span>Prefer typed answers when supported</span></label><label class="check-setting"><input name="strictArticles" type="checkbox"><span>Require articles in article practice</span></label></section><section class="settings-section"><h2>Session behavior</h2><label>Due / new order<select name="mix"><option value="due-first">Due first</option><option value="interleave">Interleave 3 due : 1 new</option><option value="new-first">New first</option></select></label><label class="check-setting"><input name="requeueAgain" type="checkbox"><span>Requeue Again cards later in the session</span></label><label class="check-setting"><input name="siblingSpacing" type="checkbox"><span>Space skill siblings from the same word</span></label></section><div class="settings-actions"><button class="primary-action compact-action" type="submit">Save settings</button><button class="secondary-action compact-action" data-backup type="button">Export backup</button></div></form></section>';
  const status=main.querySelector<HTMLElement>('[data-status]');
  const form=main.querySelector<HTMLFormElement>('[data-form]');
  const backup=main.querySelector<HTMLButtonElement>('[data-backup]');
  if(!status||!form||!backup)return;

  const learner=await ensureCanonicalLearnerState();
  if(signal.aborted)return;
  const settings=object(learner.settings);
  const session=object(settings.session);
  const field=<T extends HTMLInputElement|HTMLSelectElement>(name:string)=>form.elements.namedItem(name) as T;

  field<HTMLInputElement>('dailyNewLimit').value=String(Math.round(number(settings.dailyNewLimit,20)));
  field<HTMLInputElement>('dailyReviewLimit').value=String(Math.round(number(settings.dailyReviewLimit,200)));
  field<HTMLInputElement>('desiredRetention').value=String(Math.round(number(settings.desiredRetention,.9)*100));
  field<HTMLSelectElement>('gradingMode').value=['strict','learning','lenient'].includes(String(settings.gradingMode))?String(settings.gradingMode):'learning';
  field<HTMLInputElement>('typed').checked=session.typed===true;
  field<HTMLInputElement>('strictArticles').checked=session.strictArticles!==false;
  field<HTMLSelectElement>('mix').value=['due-first','interleave','new-first'].includes(String(session.mix))?String(session.mix):'due-first';
  field<HTMLInputElement>('requeueAgain').checked=session.requeueAgain!==false;
  field<HTMLInputElement>('siblingSpacing').checked=session.siblingSpacing!==false;
  form.hidden=false;
  status.textContent='Settings loaded locally.';

  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const submit=form.querySelector<HTMLButtonElement>('button[type="submit"]');if(submit)submit.disabled=true;
    try{
      await updateCanonicalSettings({
        dailyNewLimit:Math.max(0,Math.min(200,Math.round(number(field<HTMLInputElement>('dailyNewLimit').value,20)))),
        dailyReviewLimit:Math.max(0,Math.min(1000,Math.round(number(field<HTMLInputElement>('dailyReviewLimit').value,200)))),
        desiredRetention:Math.max(.7,Math.min(.97,number(field<HTMLInputElement>('desiredRetention').value,90)/100)),
        gradingMode:field<HTMLSelectElement>('gradingMode').value
      },{
        typed:field<HTMLInputElement>('typed').checked,
        strictArticles:field<HTMLInputElement>('strictArticles').checked,
        mix:field<HTMLSelectElement>('mix').value,
        requeueAgain:field<HTMLInputElement>('requeueAgain').checked,
        siblingSpacing:field<HTMLInputElement>('siblingSpacing').checked
      });
      status.textContent='Settings saved.';
    }catch(error){
      status.textContent='Could not save settings.';
      console.error('French settings save failed',error);
    }finally{if(submit)submit.disabled=false;}
  });

  backup.addEventListener('click',async()=>{
    backup.disabled=true;
    try{
      const data=await exportCanonicalBackup();
      downloadJson('french-vnext-backup-'+new Date().toISOString().slice(0,10)+'.json',data);
      status.textContent='Backup exported.';
    }catch(error){
      status.textContent='Could not export backup.';
      console.error('French backup export failed',error);
    }finally{backup.disabled=false;}
  });
}
