import type { RouteContext } from '../core/types';
import {
  ensureCanonicalLearnerState,
  exportCanonicalCloudSnapshot,
  replaceCanonicalCloudSnapshot,
  replaceCanonicalState,
  updateLearnerSettings
} from '../core/learner/repository';
import {
  isCanonicalCloudSnapshot,
  legacyCloudStateEnvelope,
  legacyCloudStateToCanonical
} from '../core/learner/snapshot';
import { writeMigrationValue } from '../core/storage/idb';
import {
  bootstrapAccountInBackground,
  disableSync,
  enableSync,
  getAccountState,
  reconcile,
  signIn,
  signOut,
  subscribeAccount,
  useCloudCopy,
  useDeviceCopy,
  type AccountRuntimeState
} from '../core/account/runtime';

function object(value:unknown):Record<string,unknown>{
  return value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
}
function number(value:unknown,fallback:number):number{
  const n=Number(value);return Number.isFinite(n)?n:fallback;
}
function checked(value:boolean):string{return value?'checked':'';}
function accountLabel(state:AccountRuntimeState):string{
  if(state.status==='guest')return'Guest · local progress only';
  if(state.status==='signed-in')return'Signed in · sync not enabled';
  if(state.status==='synced')return state.lastSyncedAt?'Synced · '+new Date(state.lastSyncedAt).toLocaleString():'Sync enabled';
  if(state.status==='syncing')return'Syncing…';
  if(state.status==='conflict')return'Conflict · choose which copy to keep';
  if(state.status==='loading')return'Checking account…';
  return state.error||'Account unavailable';
}
function downloadJson(value:unknown,fileName:string):void{
  const blob=new Blob([JSON.stringify(value,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=fileName;a.click();
  setTimeout(()=>URL.revokeObjectURL(url),0);
}

export async function mount({main,signal}:RouteContext):Promise<void>{
  const learner=await ensureCanonicalLearnerState();
  const settings=object(learner.settings),session=object(settings.session);
  main.innerHTML=`
  <section class="page settings-page">
    <p class="eyebrow">Configuration</p>
    <h1>Settings</h1>
    <p class="lede">Study preferences, account sync, and data tools stay outside the critical startup path.</p>

    <form class="settings-grid" data-settings-form>
      <section class="settings-card">
        <h2>Study workload</h2>
        <label><span>Daily new words</span><input name="dailyNewLimit" type="number" min="0" max="200" value="${Math.round(number(settings.dailyNewLimit,20))}"></label>
        <label><span>Daily review limit</span><input name="dailyReviewLimit" type="number" min="0" max="1000" value="${Math.round(number(settings.dailyReviewLimit,200))}"></label>
        <label><span>Desired retention</span><input name="desiredRetention" type="number" min="0.70" max="0.97" step="0.01" value="${number(settings.desiredRetention,.9)}"></label>
        <label><span>Session size</span><input name="sessionSize" type="number" min="0" max="3000" value="${Math.round(number(session.size,50))}"><small>0 = all matching cards</small></label>
      </section>

      <section class="settings-card">
        <h2>Review behavior</h2>
        <label><span>Daily mix</span><select name="mix">
          <option value="due-first" ${session.mix==='due-first'?'selected':''}>Due first</option>
          <option value="interleave" ${session.mix==='interleave'?'selected':''}>Interleave due and new</option>
          <option value="new-first" ${session.mix==='new-first'?'selected':''}>New first</option>
        </select></label>
        <label><span>Typed grading</span><select name="gradingMode">
          <option value="strict" ${settings.gradingMode==='strict'?'selected':''}>Strict</option>
          <option value="learning" ${settings.gradingMode!=='strict'&&settings.gradingMode!=='lenient'?'selected':''}>Learning</option>
          <option value="lenient" ${settings.gradingMode==='lenient'?'selected':''}>Lenient</option>
        </select></label>
        <label class="settings-toggle"><input name="typed" type="checkbox" ${checked(session.typed===true)}><span>Type recognition answers too</span></label>
        <label class="settings-toggle"><input name="requeueAgain" type="checkbox" ${checked(session.requeueAgain!==false)}><span>Extra practice after Again</span></label>
        <label class="settings-toggle"><input name="siblingSpacing" type="checkbox" ${checked(session.siblingSpacing!==false)}><span>Space related forms apart</span></label>
        <label class="settings-toggle"><input name="strictArticles" type="checkbox" ${checked(session.strictArticles!==false)}><span>Require articles when scheduled</span></label>
      </section>

      <section class="settings-card settings-account" data-account>
        <h2>THIEPN Account</h2>
        <p data-account-status>Checking account…</p>
        <p class="settings-error" data-account-error hidden></p>
        <div class="settings-actions" data-account-actions></div>
        <div class="conflict-actions" data-conflict hidden>
          <p>French changed both here and in the cloud.</p>
          <button type="button" class="secondary-action" data-account-use-device>Keep this device</button>
          <button type="button" class="secondary-action" data-account-use-cloud>Use cloud copy</button>
        </div>
      </section>

      <section class="settings-card">
        <h2>Backup & restore</h2>
        <p>Backups contain canonical learner state, SRS history, reviews, user content, and the preserved P35 envelope when available.</p>
        <div class="settings-actions">
          <button type="button" class="secondary-action" data-export>Export backup</button>
          <label class="file-action"><span>Import backup</span><input data-import type="file" accept="application/json,.json"></label>
        </div>
        <p class="inline-status" data-data-status>Local data stays on this device unless sync is enabled.</p>
      </section>

      <div class="settings-save-row">
        <button type="submit" class="primary-action">Save study settings</button>
        <span class="inline-status" data-save-status></span>
      </div>
    </form>
  </section>`;

  const form=main.querySelector<HTMLFormElement>('[data-settings-form]');
  const saveStatus=main.querySelector<HTMLElement>('[data-save-status]');
  const dataStatus=main.querySelector<HTMLElement>('[data-data-status]');
  if(!form)return;

  form.addEventListener('submit',event=>{
    event.preventDefault();
    const data=new FormData(form);
    void updateLearnerSettings(current=>{
      const previous=object(current.session);
      return{
        ...current,
        dailyNewLimit:Math.max(0,Math.min(200,Math.round(number(data.get('dailyNewLimit'),20)))),
        dailyReviewLimit:Math.max(0,Math.min(1000,Math.round(number(data.get('dailyReviewLimit'),200)))),
        desiredRetention:Math.max(.7,Math.min(.97,number(data.get('desiredRetention'),.9))),
        gradingMode:String(data.get('gradingMode')||'learning'),
        session:{
          ...previous,
          size:Math.max(0,Math.min(3000,Math.round(number(data.get('sessionSize'),50)))),
          mix:String(data.get('mix')||'due-first'),
          typed:data.get('typed')==='on',
          requeueAgain:data.get('requeueAgain')==='on',
          siblingSpacing:data.get('siblingSpacing')==='on',
          strictArticles:data.get('strictArticles')==='on'
        }
      };
    }).then(()=>{
      if(saveStatus)saveStatus.textContent='Saved.';
      window.dispatchEvent(new CustomEvent('french:learner-settings-changed'));
    }).catch(error=>{
      if(saveStatus)saveStatus.textContent='Could not save settings.';
      console.error(error);
    });
  });

  main.querySelector<HTMLButtonElement>('[data-export]')?.addEventListener('click',async()=>{
    if(dataStatus)dataStatus.textContent='Preparing backup…';
    try{
      const snapshot=await exportCanonicalCloudSnapshot('6.0.0-p37h');
      downloadJson(snapshot,'french-backup-'+new Date().toISOString().slice(0,10)+'.json');
      if(dataStatus)dataStatus.textContent='Backup exported.';
    }catch(error){
      if(dataStatus)dataStatus.textContent='Backup export failed.';
      console.error(error);
    }
  });

  main.querySelector<HTMLInputElement>('[data-import]')?.addEventListener('change',event=>{
    const input=event.currentTarget as HTMLInputElement,file=input.files?.[0];
    if(!file)return;
    void (async()=>{
      if(dataStatus)dataStatus.textContent='Validating backup…';
      try{
        const raw=JSON.parse(await file.text()) as unknown;
        if(isCanonicalCloudSnapshot(raw)){
          await replaceCanonicalCloudSnapshot(raw);
        }else{
          const envelope=await legacyCloudStateEnvelope(raw);
          const migration=await legacyCloudStateToCanonical(raw);
          await replaceCanonicalState(migration,'manual-legacy:'+envelope.fingerprint);
          await writeMigrationValue('legacy-import-v1',envelope);
        }
        if(dataStatus)dataStatus.textContent='Backup restored. Active study session was cleared safely.';
        window.dispatchEvent(new CustomEvent('french:canonical-state-replaced'));
      }catch(error){
        if(dataStatus)dataStatus.textContent='This backup could not be imported.';
        console.error(error);
      }finally{input.value='';}
    })();
  });

  const statusNode=main.querySelector<HTMLElement>('[data-account-status]');
  const errorNode=main.querySelector<HTMLElement>('[data-account-error]');
  const actions=main.querySelector<HTMLElement>('[data-account-actions]');
  const conflict=main.querySelector<HTMLElement>('[data-conflict]');

  const renderAccount=(state:AccountRuntimeState)=>{
    if(signal.aborted)return;
    if(statusNode)statusNode.textContent=accountLabel(state);
    if(errorNode){errorNode.hidden=!state.error;errorNode.textContent=state.error;}
    if(conflict)conflict.hidden=state.status!=='conflict';
    if(!actions)return;
    actions.replaceChildren();
    const add=(label:string,fn:()=>void,primary=false)=>{
      const button=document.createElement('button');button.type='button';button.textContent=label;
      button.className=primary?'primary-action':'secondary-action';button.disabled=state.busy;
      button.addEventListener('click',fn);actions.append(button);
    };
    if(!state.user){
      add('Sign in with Google',()=>void signIn(),true);
      return;
    }
    if(state.status==='signed-in'){
      add('Enable sync',()=>void enableSync(),true);
      add('Sign out',()=>void signOut());
    }else{
      add('Sync now',()=>void reconcile({background:false}),true);
      add('Pause sync',()=>disableSync());
      add('Sign out',()=>void signOut());
    }
  };
  const unsubscribe=subscribeAccount(renderAccount);
  signal.addEventListener('abort',unsubscribe,{once:true});
  main.querySelector<HTMLButtonElement>('[data-account-use-device]')?.addEventListener('click',()=>void useDeviceCopy());
  main.querySelector<HTMLButtonElement>('[data-account-use-cloud]')?.addEventListener('click',()=>void useCloudCopy());
  void bootstrapAccountInBackground().then(()=>renderAccount(getAccountState()));
}
