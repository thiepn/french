import type { RouteContext } from '../core/types';
import { ensureCanonicalLearnerState,exportCanonicalBackup,updateCanonicalSettings } from '../core/learner/repository';

function object(value:unknown):Record<string,unknown>{
  return value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
}
function number(value:unknown,fallback:number):number{
  const n=Number(value);return Number.isFinite(n)?n:fallback;
}
function checked(form:HTMLFormElement,name:string):boolean{
  return Boolean(form.elements.namedItem(name) instanceof HTMLInputElement&&(form.elements.namedItem(name) as HTMLInputElement).checked);
}
function value(form:HTMLFormElement,name:string):string{
  const field=form.elements.namedItem(name);
  return field instanceof HTMLInputElement||field instanceof HTMLSelectElement?field.value:'';
}

export async function mount({main,signal}:RouteContext):Promise<void>{
  main.innerHTML='<section class="page settings-page"><p class="eyebrow">Configuration</p><h1>Settings</h1><p class="lede">These controls update the canonical learner state used by Today, Learn and Review. Nothing loads during app bootstrap.</p><p class="inline-status" data-status>Loading settings…</p><div data-settings></div></section>';
  const host=main.querySelector<HTMLElement>('[data-settings]');
  const status=main.querySelector<HTMLElement>('[data-status]');
  if(!host||!status)return;

  const learner=await ensureCanonicalLearnerState();
  if(signal.aborted)return;
  const settings=object(learner.settings),session=object(settings.session);

  const form=document.createElement('form');form.className='settings-form';
  form.innerHTML=`
    <section class="settings-panel">
      <h2>Daily workload</h2>
      <div class="settings-grid">
        <label><span>New words / day</span><input name="dailyNewLimit" type="number" min="0" max="200" step="1"></label>
        <label><span>Review limit / day</span><input name="dailyReviewLimit" type="number" min="0" max="1000" step="1"></label>
        <label><span>Target retention</span><input name="desiredRetention" type="number" min="70" max="97" step="1"><small>Percent</small></label>
        <label><span>Leech threshold</span><input name="leechThreshold" type="number" min="3" max="30" step="1"></label>
      </div>
    </section>
    <section class="settings-panel">
      <h2>Review behavior</h2>
      <div class="settings-grid">
        <label><span>Typed grading</span><select name="gradingMode"><option value="strict">Strict</option><option value="learning">Learning</option><option value="lenient">Lenient</option></select></label>
        <label><span>Due / new order</span><select name="mix"><option value="due-first">Due first</option><option value="interleave">3 due : 1 new</option><option value="new-first">New first</option></select></label>
      </div>
      <div class="toggle-list">
        <label><input name="typed" type="checkbox"><span>Use typed answers for recognition when possible</span></label>
        <label><input name="strictArticles" type="checkbox"><span>Require articles when the active skill expects them</span></label>
        <label><input name="siblingSpacing" type="checkbox"><span>Space related skill cards apart</span></label>
        <label><input name="requeueAgain" type="checkbox"><span>Allow delayed practice after failed answers</span></label>
        <label><input name="autoSuspendLeeches" type="checkbox"><span>Automatically suspend repeated leeches</span></label>
      </div>
    </section>
    <div class="settings-actions"><button class="primary-action compact-action" type="submit">Save settings</button><button class="secondary-action compact-action" type="button" data-backup>Export backup</button></div>
  `;

  const set=(name:string,v:string|number|boolean)=>{
    const field=form.elements.namedItem(name);
    if(field instanceof HTMLInputElement){
      if(field.type==='checkbox')field.checked=Boolean(v);else field.value=String(v);
    }else if(field instanceof HTMLSelectElement)field.value=String(v);
  };
  set('dailyNewLimit',number(settings.dailyNewLimit,20));
  set('dailyReviewLimit',number(settings.dailyReviewLimit,200));
  set('desiredRetention',Math.round(number(settings.desiredRetention,.9)*100));
  set('leechThreshold',number(settings.leechThreshold,8));
  set('gradingMode',String(settings.gradingMode||'learning'));
  set('mix',String(session.mix||'due-first'));
  set('typed',session.typed===true);
  set('strictArticles',session.strictArticles!==false);
  set('siblingSpacing',session.siblingSpacing!==false);
  set('requeueAgain',session.requeueAgain!==false);
  set('autoSuspendLeeches',settings.autoSuspendLeeches===true);

  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const submit=form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if(submit)submit.disabled=true;
    try{
      await updateCanonicalSettings({
        dailyNewLimit:Math.max(0,Math.min(200,Math.round(Number(value(form,'dailyNewLimit'))||0))),
        dailyReviewLimit:Math.max(0,Math.min(1000,Math.round(Number(value(form,'dailyReviewLimit'))||0))),
        desiredRetention:Math.max(.7,Math.min(.97,(Number(value(form,'desiredRetention'))||90)/100)),
        leechThreshold:Math.max(3,Math.min(30,Math.round(Number(value(form,'leechThreshold'))||8))),
        gradingMode:value(form,'gradingMode')||'learning',
        autoSuspendLeeches:checked(form,'autoSuspendLeeches')
      },{
        mix:value(form,'mix')||'due-first',
        typed:checked(form,'typed'),
        strictArticles:checked(form,'strictArticles'),
        siblingSpacing:checked(form,'siblingSpacing'),
        requeueAgain:checked(form,'requeueAgain')
      });
      status.textContent='Settings saved. New sessions will use the updated configuration.';
    }catch(error){
      status.textContent='Could not save settings.';
      console.error('French settings save failed',error);
    }finally{if(submit)submit.disabled=false;}
  });

  form.querySelector<HTMLButtonElement>('[data-backup]')?.addEventListener('click',async()=>{
    const button=form.querySelector<HTMLButtonElement>('[data-backup]');
    if(button)button.disabled=true;
    try{
      const backup=await exportCanonicalBackup();
      const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});
      const url=URL.createObjectURL(blob);
      const link=document.createElement('a');link.href=url;link.download='french-backup-'+new Date().toISOString().slice(0,10)+'.json';
      document.body.append(link);link.click();link.remove();URL.revokeObjectURL(url);
      status.textContent='Backup exported.';
    }catch(error){
      status.textContent='Could not export backup.';
      console.error('French backup export failed',error);
    }finally{if(button)button.disabled=false;}
  });

  host.replaceChildren(form);
  status.textContent='Settings loaded.';
}
