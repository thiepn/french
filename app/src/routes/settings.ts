import type { RouteContext } from '../core/types';
import { ensureCanonicalLearnerState,replaceCanonicalLearnerSettings } from '../core/learner/repository';

function object(value:unknown):Record<string,unknown>{return value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};}
function number(value:unknown,fallback:number):number{const n=Number(value);return Number.isFinite(n)?n:fallback;}
function checked(value:unknown,fallback=false):boolean{return typeof value==='boolean'?value:fallback;}

export async function mount({main}:RouteContext):Promise<void>{
  const learner=await ensureCanonicalLearnerState();
  const current={...learner.settings};
  const session={...object(current.session)};
  main.innerHTML='<section class="page settings-page"><p class="eyebrow">Study configuration</p><h1>Settings</h1><p class="lede">Tune workload and review behavior. Changes are stored locally in the canonical learner state.</p><form class="settings-form" data-form><section class="data-panel"><h2>Daily workload</h2><div class="field-grid"><label><span>New words / day</span><input name="dailyNewLimit" type="number" min="0" max="100" step="1"></label><label><span>Reviews / day</span><input name="dailyReviewLimit" type="number" min="10" max="1000" step="10"></label><label><span>Desired retention</span><input name="desiredRetention" type="number" min="0.70" max="0.97" step="0.01"></label></div></section><section class="data-panel"><h2>Answer behavior</h2><div class="field-grid"><label><span>Grading mode</span><select name="gradingMode"><option value="strict">Strict</option><option value="learning">Learning</option><option value="lenient">Lenient</option></select></label><label class="toggle-row"><input name="typed" type="checkbox"><span>Prefer typed answers</span></label><label class="toggle-row"><input name="strictArticles" type="checkbox"><span>Require articles when applicable</span></label><label class="toggle-row"><input name="siblingSpacing" type="checkbox"><span>Space sibling skills apart</span></label></div></section><div class="settings-actions"><button class="primary-action compact-action" type="submit">Save settings</button><p class="inline-status" data-status>Ready.</p></div></form></section>';
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
}
