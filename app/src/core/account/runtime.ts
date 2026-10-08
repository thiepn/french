import { hasFrenchAccountConfiguration,isFrenchProductionOrigin } from './config';
import { beginFrenchAccountSso,completeFrenchAccountCallback,consumeFrenchAccountReturnTo,getVerifiedFrenchAccountUser,isFrenchOAuthCallback,subscribeFrenchAccount } from './session';
import { probeFrenchAccountSession } from './sso-probe';
import { isFrenchAccountConnectionActive,isFrenchSyncEnabled,pauseFrenchSync,reconcileFrenchSync } from './sync';

const COOLDOWN=30_000;
export function mountFrenchAccountRuntime():()=>void{
  if(!hasFrenchAccountConfiguration()||!isFrenchProductionOrigin())return()=>{};
  let timer=0,running=false,disposed=false,lastProbe=0;
  const run=async()=>{
    if(disposed||running)return;running=true;
    try{
      if(isFrenchOAuthCallback()){
        const user=await completeFrenchAccountCallback();
        if(user){location.replace(consumeFrenchAccountReturnTo());return;}
      }
      const user=await getVerifiedFrenchAccountUser();
      dispatchEvent(new CustomEvent('thiepn:french-account',{detail:user}));
      if(!user){
        if(navigator.onLine&&Date.now()-lastProbe>=COOLDOWN){
          lastProbe=Date.now();const probe=await probeFrenchAccountSession();
          if(probe==='signed-in'){await beginFrenchAccountSso(location.href);return;}
        }
      }else{
        const connected=await isFrenchAccountConnectionActive();
        if(!connected){if(isFrenchSyncEnabled(user.id))pauseFrenchSync(user.id);return;}
        if(isFrenchSyncEnabled(user.id))await reconcileFrenchSync(user);
      }
    }catch(error){console.warn('French Account runtime degraded gracefully',error);}
    finally{running=false;}
  };
  const schedule=(delay=3500)=>{clearTimeout(timer);timer=window.setTimeout(()=>void run(),delay);};
  const online=()=>schedule(250),focus=()=>schedule(500),visibility=()=>{if(!document.hidden)schedule(500);};
  const storage=(event:StorageEvent)=>{if(event.key?.startsWith('french-thiepn-')||event.key?.startsWith('thiepn:french-'))schedule(750);};
  addEventListener('online',online);addEventListener('focus',focus);addEventListener('storage',storage);document.addEventListener('visibilitychange',visibility);
  // verify() republishes identity on every call. Only respond to a real identity transition:
  // re-scheduling on every verification creates an endless 250ms auth/API polling loop.
  let lastIdentityKey: string|undefined;
  const unsubscribe=subscribeFrenchAccount(identity=>{
    const identityKey=identity.status==='signed-in'
      ?'signed-in:'+identity.id
      :identity.status==='unavailable'?'unavailable:'+identity.code:identity.status;
    if(identityKey===lastIdentityKey)return;
    lastIdentityKey=identityKey;
    if(!running)schedule(250);
  });schedule(300);
  return()=>{disposed=true;clearTimeout(timer);removeEventListener('online',online);removeEventListener('focus',focus);removeEventListener('storage',storage);document.removeEventListener('visibilitychange',visibility);unsubscribe();};
}
