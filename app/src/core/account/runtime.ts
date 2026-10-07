import {
  exportCanonicalCloudSnapshot,
  replaceCanonicalCloudSnapshot,
  replaceCanonicalState
} from '../learner/repository';
import {
  cloudSnapshotHash,
  isCanonicalCloudSnapshot,
  legacyCloudStateEnvelope,
  legacyCloudStateToCanonical,
  type CanonicalCloudSnapshotV1
} from '../learner/snapshot';
import { writeMigrationValue } from '../storage/idb';

const SUPABASE_URL='https://hycegznamzjhwinegaai.supabase.co';
const PUBLISHABLE_KEY='sb_publishable_1rZzRPzfLMaAH5pIgCwIjA_19UPMIsR';
const MODULE_URL='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/+esm';
const APP_SLUG='french';
const SYNC_META_KEY='french-thiepn-sync-v1';
const DEVICE_KEY='french-thiepn-device-id-v1';
const RETURN_KEY='french-thiepn-auth-return-v1';
const AUTH_STORAGE_KEY='thiepn-account-french-auth-v1';
const SYNC_DELAY=4500;
const APP_VERSION='6.0.0-p37h';

type SupabaseClientLike=any;
export type AccountStatus='guest'|'loading'|'signed-in'|'synced'|'syncing'|'conflict'|'error';

export interface SyncMeta {
  userId:string;
  enabled:boolean;
  revision:number|null;
  localHash:string;
  syncedAt:number;
}
export interface RemoteState {
  revision:number;
  state:unknown;
  app_version?:string;
  device_id?:string;
  client_updated_at?:string;
  updated_at?:string;
}
export interface AccountConflict {
  remote:RemoteState;
  kind:'claim'|'diverged';
}
export interface AccountRuntimeState {
  status:AccountStatus;
  ready:boolean;
  busy:boolean;
  user:{id:string;email?:string|null}|null;
  error:string;
  lastSyncedAt:number;
  conflict:AccountConflict|null;
}

let client:SupabaseClientLike|null=null;
let authSubscription:{unsubscribe?:()=>void}|null=null;
let syncTimer=0;
let applying=false;
const localStateListener=()=>scheduleSync();
window.addEventListener('french:local-state-changed',localStateListener);
let runtime:AccountRuntimeState={
  status:'guest',ready:false,busy:false,user:null,error:'',lastSyncedAt:0,conflict:null
};

function emit():void{
  window.dispatchEvent(new CustomEvent('french:account-state',{detail:getAccountState()}));
}
function setRuntime(patch:Partial<AccountRuntimeState>):void{
  runtime={...runtime,...patch};emit();
}
export function getAccountState():AccountRuntimeState{
  return{...runtime,user:runtime.user?{...runtime.user}:null,conflict:runtime.conflict?{...runtime.conflict}:null};
}
export function subscribeAccount(listener:(state:AccountRuntimeState)=>void):()=>void{
  const handler=(event:Event)=>listener((event as CustomEvent<AccountRuntimeState>).detail);
  window.addEventListener('french:account-state',handler);
  listener(getAccountState());
  return()=>window.removeEventListener('french:account-state',handler);
}
function timeout<T>(promise:Promise<T>,ms:number,message:string):Promise<T>{
  return Promise.race([promise,new Promise<T>((_,reject)=>setTimeout(()=>reject(new Error(message)),ms))]);
}
function readMeta():SyncMeta|null{
  try{
    const raw=JSON.parse(localStorage.getItem(SYNC_META_KEY)||'null');
    if(!raw||typeof raw!=='object')return null;
    return{
      userId:typeof raw.userId==='string'?raw.userId:'',
      enabled:raw.enabled===true,
      revision:raw.revision===null||raw.revision===undefined?null:(Number.isFinite(Number(raw.revision))?Number(raw.revision):null),
      localHash:typeof raw.localHash==='string'?raw.localHash:'',
      syncedAt:Number.isFinite(Number(raw.syncedAt))?Number(raw.syncedAt):0
    };
  }catch{return null;}
}
function writeMeta(meta:SyncMeta):SyncMeta{
  try{localStorage.setItem(SYNC_META_KEY,JSON.stringify(meta));}catch{}
  runtime.lastSyncedAt=meta.syncedAt;
  return meta;
}
function deviceId():string{
  try{
    const existing=localStorage.getItem(DEVICE_KEY);
    if(existing)return existing;
    const value=crypto?.randomUUID?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint8Array(16)),n=>n.toString(16).padStart(2,'0')).join('');
    localStorage.setItem(DEVICE_KEY,value);return value;
  }catch{return'browser-'+Math.random().toString(36).slice(2);}
}
function errorMessage(error:unknown):string{
  const message=String((error as {message?:string})?.message||error||'Account request failed.');
  if(/FRENCH_SYNC_CONFLICT|40001/i.test(message))return'French changed on another device too. Choose which copy to keep.';
  if(/Failed to fetch|NetworkError|timed out/i.test(message))return'Account sync is temporarily unreachable. Your local progress is safe.';
  if(/redirect|oauth/i.test(message))return'Sign-in could not complete. Your local progress is unchanged.';
  return message.length>180?message.slice(0,177)+'…':message;
}
function isMissingSession(error:unknown):boolean{
  const value=error as {name?:string;message?:string};
  return /AuthSessionMissing|session missing|no session/i.test(String(value?.name||'')+' '+String(value?.message||''));
}
function isConflict(error:unknown):boolean{
  const value=error as {code?:string;message?:string};
  return /40001|FRENCH_SYNC_CONFLICT/i.test(String(value?.code||'')+' '+String(value?.message||''));
}
function cleanCallbackUrl():void{
  try{
    const url=new URL(location.href);
    const keys=['code','error','error_code','error_description','thiepn_auth'];
    let changed=false;
    for(const key of keys)if(url.searchParams.has(key)){url.searchParams.delete(key);changed=true;}
    if(changed)history.replaceState(history.state,'',url.pathname+(url.searchParams.toString()?'?'+url.searchParams.toString():'')+url.hash);
  }catch{}
}
async function loadClient():Promise<SupabaseClientLike>{
  if(client)return client;
  setRuntime({status:'loading',error:''});
  const module=await timeout(import(/* @vite-ignore */ MODULE_URL),10000,'THIEPN Account could not load.');
  client=module.createClient(SUPABASE_URL,PUBLISHABLE_KEY,{
    auth:{flowType:'pkce',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:AUTH_STORAGE_KEY}
  });
  const listener=client.auth.onAuthStateChange(()=>{
    setTimeout(()=>void refreshAuth({reconcile:true}).catch(error=>setRuntime({status:'error',error:errorMessage(error)})),0);
  });
  authSubscription=listener?.data?.subscription??null;
  return client;
}
async function fetchRemote():Promise<RemoteState|null>{
  if(!client||!runtime.user)return null;
  const response:any=await timeout<any>(
    client.from('french_sync_state').select('revision,state,app_version,device_id,client_updated_at,updated_at').maybeSingle(),
    10000,'Cloud progress check timed out.'
  );
  if(response.error)throw response.error;
  return response.data??null;
}
async function upload(snapshot:CanonicalCloudSnapshotV1,expectedRevision:number|null):Promise<{revision:number}>{
  if(!client)throw new Error('Account client is unavailable.');
  const response:any=await timeout<any>(client.rpc('sync_thiepn_french_state',{
    p_expected_revision:expectedRevision,
    p_state:snapshot,
    p_app_version:APP_VERSION,
    p_device_id:deviceId(),
    p_client_updated_at:new Date(snapshot.updatedAt||Date.now()).toISOString()
  }),12000,'Cloud upload timed out.');
  if(response.error)throw response.error;
  return response.data;
}
function hasMeaningfulLocal(snapshot:CanonicalCloudSnapshotV1):boolean{
  return snapshot.srs.some(row=>row.seen>0||row.status!=='new')||
    snapshot.reviews.length>0||
    snapshot.learner.studyDays.length>0||
    Object.keys(snapshot.userContent.userCards).length>0||
    Object.keys(snapshot.userContent.cardEdits).length>0;
}
function saveBaseline(userId:string,revision:number,localHash:string):void{
  writeMeta({userId,enabled:true,revision:Number(revision),localHash,syncedAt:Date.now()});
}
async function applyRemote(remote:RemoteState):Promise<void>{
  if(!remote?.state||typeof remote.state!=='object')throw new Error('Cloud progress is invalid.');
  applying=true;
  try{
    if(isCanonicalCloudSnapshot(remote.state)){
      await replaceCanonicalCloudSnapshot(remote.state);
    }else{
      const envelope=await legacyCloudStateEnvelope(remote.state);
      const migration=await legacyCloudStateToCanonical(remote.state);
      await replaceCanonicalState(migration,'cloud-legacy:'+envelope.fingerprint);
      await writeMigrationValue('legacy-import-v1',envelope);
    }
    const local=await exportCanonicalCloudSnapshot(APP_VERSION);
    const hash=await cloudSnapshotHash(local);
    if(!runtime.user)throw new Error('Account session ended during cloud apply.');
    saveBaseline(runtime.user.id,remote.revision,hash);
    setRuntime({conflict:null,status:'synced',error:'',lastSyncedAt:Date.now()});
    const cache=await import('../content/review-content');
    cache.invalidateReviewContentCache?.();
    window.dispatchEvent(new CustomEvent('french:canonical-state-replaced'));
  }finally{applying=false;}
}
export async function refreshAuth(options:{reconcile?:boolean}={}):Promise<AccountRuntimeState['user']>{
  const current=client??await loadClient();
  let response:any;
  try{response=await timeout<any>(current.auth.getUser(),8000,'Account verification timed out.');}
  catch(error){
    if(isMissingSession(error))response={data:{user:null},error:null};else throw error;
  }
  if(response?.error&&!isMissingSession(response.error))throw response.error;
  const user=response?.data?.user?{id:String(response.data.user.id),email:response.data.user.email??null}:null;
  const meta=readMeta();
  if(!user){
    setRuntime({user:null,ready:true,status:'guest',conflict:null,error:''});
  }else{
    setRuntime({
      user,ready:true,error:'',lastSyncedAt:meta?.syncedAt??0,
      status:meta?.enabled&&meta.userId===user.id?'synced':'signed-in'
    });
    if(options.reconcile&&meta?.enabled&&meta.userId===user.id){
      void reconcile({background:true});
    }
  }
  if(user)cleanCallbackUrl();
  return user;
}
export async function signIn():Promise<void>{
  setRuntime({busy:true,error:''});
  try{
    const current=client??await loadClient();
    sessionStorage.setItem(RETURN_KEY,'settings');
    const response=await current.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname}});
    if(response.error)throw response.error;
  }catch(error){
    setRuntime({busy:false,status:'error',error:errorMessage(error)});
  }
}
export async function signOut():Promise<void>{
  const current=client??await loadClient();
  const response=await current.auth.signOut();
  if(response.error)throw response.error;
  const meta=readMeta();
  if(meta)writeMeta({...meta,enabled:false});
  setRuntime({user:null,ready:true,busy:false,status:'guest',conflict:null,error:''});
}
export async function enableSync():Promise<void>{
  const current=client??await loadClient();
  const user=runtime.user??await refreshAuth();
  if(!user){await signIn();return;}
  setRuntime({busy:true,error:''});
  try{
    const connected=await current.rpc('connect_thiepn_app',{p_app_slug:APP_SLUG});
    if(connected.error)throw connected.error;
    const existing=readMeta();
    writeMeta({
      userId:user.id,enabled:true,
      revision:existing?.userId===user.id?existing.revision:null,
      localHash:existing?.userId===user.id?existing.localHash:'',
      syncedAt:existing?.userId===user.id?existing.syncedAt:0
    });
    setRuntime({busy:false,status:'signed-in'});
    await reconcile({background:false});
  }catch(error){
    setRuntime({busy:false,status:'error',error:errorMessage(error)});
    throw error;
  }
}
export function disableSync():void{
  const meta=readMeta();
  if(meta)writeMeta({...meta,enabled:false});
  setRuntime({status:runtime.user?'signed-in':'guest',conflict:null});
}
export async function reconcile(options:{background?:boolean}={}):Promise<void>{
  const user=runtime.user;
  const meta=readMeta();
  if(!user||runtime.busy||applying||!meta?.enabled||meta.userId!==user.id)return;
  setRuntime({busy:true,status:'syncing',error:''});
  try{
    const local=await exportCanonicalCloudSnapshot(APP_VERSION);
    const localHash=await cloudSnapshotHash(local);
    const remote=await fetchRemote();
    if(!remote){
      const uploaded=await upload(local,null);
      saveBaseline(user.id,uploaded.revision,localHash);
      setRuntime({conflict:null,status:'synced',busy:false,error:'',lastSyncedAt:Date.now()});
      return;
    }
    if(meta.revision===null||!meta.localHash){
      if(isCanonicalCloudSnapshot(remote.state)){
        const remoteHash=await cloudSnapshotHash(remote.state);
        if(remoteHash===localHash){
          saveBaseline(user.id,remote.revision,localHash);
          setRuntime({conflict:null,status:'synced',busy:false,lastSyncedAt:Date.now()});
          return;
        }
      }
      if(!hasMeaningfulLocal(local)){
        await applyRemote(remote);
        setRuntime({busy:false});
        return;
      }
      setRuntime({conflict:{remote,kind:'claim'},status:'conflict',busy:false});
      return;
    }
    const localChanged=localHash!==meta.localHash;
    const remoteChanged=Number(remote.revision)!==Number(meta.revision);
    if(!localChanged&&!remoteChanged){
      setRuntime({status:'synced',busy:false,lastSyncedAt:meta.syncedAt||Date.now()});
      return;
    }
    if(localChanged&&!remoteChanged){
      const uploaded=await upload(local,meta.revision);
      saveBaseline(user.id,uploaded.revision,localHash);
      setRuntime({conflict:null,status:'synced',busy:false,lastSyncedAt:Date.now()});
      return;
    }
    if(!localChanged&&remoteChanged){
      await applyRemote(remote);
      setRuntime({busy:false});
      return;
    }
    setRuntime({conflict:{remote,kind:'diverged'},status:'conflict',busy:false});
  }catch(error){
    if(isConflict(error)){
      const remote=await fetchRemote().catch(()=>null);
      setRuntime({conflict:remote?{remote,kind:'diverged'}:runtime.conflict,status:'conflict',busy:false,error:''});
    }else{
      setRuntime({status:'error',busy:false,error:errorMessage(error)});
      if(!options.background)throw error;
    }
  }
}
export async function useDeviceCopy():Promise<void>{
  const user=runtime.user,remote=runtime.conflict?.remote;
  if(!user||!remote)return;
  setRuntime({busy:true,status:'syncing',error:''});
  try{
    const local=await exportCanonicalCloudSnapshot(APP_VERSION);
    const hash=await cloudSnapshotHash(local);
    const uploaded=await upload(local,remote.revision);
    saveBaseline(user.id,uploaded.revision,hash);
    setRuntime({busy:false,status:'synced',conflict:null,lastSyncedAt:Date.now()});
  }catch(error){
    setRuntime({busy:false,status:'error',error:errorMessage(error)});throw error;
  }
}
export async function useCloudCopy():Promise<void>{
  const remote=runtime.conflict?.remote;
  if(!remote)return;
  setRuntime({busy:true,status:'syncing',error:''});
  try{await applyRemote(remote);setRuntime({busy:false});}
  catch(error){setRuntime({busy:false,status:'error',error:errorMessage(error)});throw error;}
}
export function scheduleSync(delay=SYNC_DELAY):void{
  const meta=readMeta();
  if(!runtime.user||applying||runtime.conflict||!meta?.enabled||meta.userId!==runtime.user.id)return;
  window.clearTimeout(syncTimer);
  syncTimer=window.setTimeout(()=>void reconcile({background:true}),delay);
}
export async function bootstrapAccountInBackground():Promise<void>{
  const params=new URLSearchParams(location.search);
  const meta=readMeta();
  let hasAuth=false;
  try{hasAuth=Boolean(localStorage.getItem(AUTH_STORAGE_KEY));}catch{}
  const callback=params.has('code')||params.has('error')||params.has('thiepn_auth');
  if(!hasAuth&&!meta?.enabled&&!callback){
    setRuntime({ready:true,status:'guest'});
    return;
  }
  try{await refreshAuth({reconcile:true});}
  catch(error){setRuntime({ready:true,status:'error',error:errorMessage(error)});}
}
export function destroyAccountRuntime():void{
  window.clearTimeout(syncTimer);
  authSubscription?.unsubscribe?.();
  authSubscription=null;
  client=null;
  window.removeEventListener('french:local-state-changed',localStateListener);
}
