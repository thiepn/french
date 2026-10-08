import { FRENCH_OAUTH_CLIENT_ID,THIEPN_ACCOUNT_ORIGIN,hasFrenchAccountConfiguration,isFrenchProductionOrigin } from './config';
import { beginFrenchAccountSso,getVerifiedFrenchAccountUser,signOutFrenchAppSession } from './session';
import { chooseCloud,chooseThisDevice,enableFrenchSync,isFrenchAccountConnectionActive,isFrenchSyncEnabled,pauseFrenchSync,readFrenchSyncMeta,reconcileFrenchSync,type FrenchSyncResult } from './sync';

function el<K extends keyof HTMLElementTagNameMap>(tag:K,text='',className=''):HTMLElementTagNameMap[K]{const node=document.createElement(tag);if(text)node.textContent=text;if(className)node.className=className;return node;}
export async function mountFrenchAccountSettings(host:HTMLElement):Promise<void>{
  host.replaceChildren();host.append(el('h2','THIEPN Account'));
  const copy=el('p','','muted-copy');host.append(copy);
  if(!hasFrenchAccountConfiguration()){
    copy.textContent='First-party Account sync is staged but this branch is waiting for the one-time French OAuth client registration. Local study, backup and restore remain fully available.';
    host.append(el('p','Pending control-plane registration · no French data is uploaded.','inline-status'));return;
  }
  if(!isFrenchProductionOrigin()){
    copy.textContent='Account sync is production-origin only. This preview keeps all data local.';
    host.append(el('p','Configured public client '+FRENCH_OAUTH_CLIENT_ID,'inline-status'));return;
  }

  copy.textContent='Account identity and cloud adoption are separate. Signing in does not upload French progress.';
  const status=el('p','Checking account…','inline-status'),actions=el('div','','account-actions'),conflict=el('div','','account-conflict');
  host.append(status,actions,conflict);

  const render=async(result?:FrenchSyncResult)=>{
    actions.replaceChildren();conflict.replaceChildren();
    const user=await getVerifiedFrenchAccountUser().catch(()=>null);
    if(!user){
      status.textContent='Guest · local-first. No French data is uploaded.';
      const signIn=el('button','Connect THIEPN Account','primary-action compact-action');signIn.type='button';signIn.onclick=()=>void beginFrenchAccountSso(location.href);actions.append(signIn);
      const manage=el('a','Open THIEPN Account');manage.href=THIEPN_ACCOUNT_ORIGIN+'/';manage.rel='noopener';actions.append(manage);return;
    }
    const connection=await isFrenchAccountConnectionActive()
      .then(active=>active?'active' as const:'disconnected' as const)
      .catch(()=>'unavailable' as const);
    if(connection!=='active'){
      status.textContent=connection==='disconnected'
        ?'French is disconnected in THIEPN Account. Local progress remains on this device.'
        :'THIEPN Account connection cannot be checked. Local progress remains available.';
      if(connection==='disconnected'){
        const reconnect=el('button','Reconnect French through THIEPN Account','primary-action compact-action');
        reconnect.type='button';reconnect.onclick=()=>void beginFrenchAccountSso(location.href);
        actions.append(reconnect);
      }
      const manage=el('a','Manage THIEPN Account');manage.href=THIEPN_ACCOUNT_ORIGIN+'/apps/french';manage.rel='noopener';actions.append(manage);
      const out=el('button','Sign out of French','secondary-action compact-action');
      out.type='button';out.onclick=()=>{pauseFrenchSync(user.id);signOutFrenchAppSession();void render();};actions.append(out);
      if(result)conflict.append(el('p',result.message,'muted-copy'));
      return;
    }
    const meta=readFrenchSyncMeta(),enabled=isFrenchSyncEnabled(user.id);
    status.textContent=(user.email??'THIEPN Account')+' · '+(enabled?'sync enabled':'signed in, local-only')+(meta?.lastSyncedAt?' · last sync '+new Date(meta.lastSyncedAt).toLocaleString():'');
    if(!enabled){
      const enable=el('button','Sync this device','primary-action compact-action');enable.type='button';enable.onclick=async()=>render(await enableFrenchSync(user));actions.append(enable);
    }else{
      const now=el('button','Sync now','primary-action compact-action');now.type='button';now.onclick=async()=>render(await reconcileFrenchSync(user));
      const pause=el('button','Pause sync','secondary-action compact-action');pause.type='button';pause.onclick=()=>{pauseFrenchSync(user.id);void render();};actions.append(now,pause);
    }
    const out=el('button','Sign out of French','secondary-action compact-action');out.type='button';out.onclick=()=>{pauseFrenchSync(user.id);signOutFrenchAppSession();void render();};actions.append(out);
    const manage=el('a','Manage THIEPN Account');manage.href=THIEPN_ACCOUNT_ORIGIN+'/apps/french';manage.rel='noopener';actions.append(manage);
    if(result?.status==='conflict'){
      conflict.append(el('strong','Choose the source of truth'),el('p',result.message));
      const device=el('button','Use this device','primary-action compact-action');device.type='button';device.onclick=async()=>{if(!confirm('Replace the cloud French progress with this device’s progress? This overwrites the cloud copy. Export a backup first if you need it.'))return;await render(await chooseThisDevice(user));};
      const cloud=el('button','Use cloud','secondary-action compact-action');cloud.type='button';cloud.onclick=async()=>{if(!confirm('Replace the French progress on this device with the cloud copy? Export a local backup first if you need this device’s progress.'))return;await render(await chooseCloud(user));};conflict.append(device,cloud);
    }else if(result)conflict.append(el('p',result.message,'muted-copy'));
  };
  await render();
}
