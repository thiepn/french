import { exportCanonicalBackup,replaceCanonicalBackup,writeCanonicalMigration,type CanonicalBackupV1 } from '../learner/repository';
import { legacyEnvelopeToCanonical } from '../learner/from-legacy';
import type { JsonObject,LegacySnapshotEnvelope } from '../migration/legacy-contract';

const SUPABASE_URL='https://hycegznamzjhwinegaai.supabase.co';
const SUPABASE_KEY='sb_publishable_1rZzRPzfLMaAH5pIgCwIjA_19UPMIsR';
const MODULE_URL='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.2/+esm';
const APP_SLUG='french';
const SYNC_META_KEY='french-thiepn-sync-v1';
const DEVICE_KEY='french-thiepn-device-id-v1';
const RETURN_KEY='french-thiepn-auth-return-v1';
const AUTH_STORAGE_KEY='thiepn-account-french-auth-v1';
const SYNC_DELAY=4500;

type AccountStatus='guest'|'signed-in'|'synced'|'syncing'|'conflict'|'error';
type ErrorLike={message?:string;code?:string;name?:string};
type UserLike={id:string;email?:string|null};
type RpcResponse<T>={data:T;error:ErrorLike|null};
type RemoteRow={
  revision:number;
  state:unknown;
  app_version?:string|null;
  device_id?:string|null;
  client_updated_at?:string|null;
  updated_at?:string|null;
};
interface SupabaseClientLike{
  auth:{
    getUser():Promise<RpcResponse<{user:UserLike|null}>>;
    signInWithOAuth(args:{provider:'google';options:{redirectTo:string}}):Promise<RpcResponse<unknown>>;
    signOut(args:{scope:'local'}):Promise<RpcResponse<unknown>>;
    onAuthStateChange(callback:()=>void):{data?:{subscription?:{unsubscribe():void}}};
  };
  from(name:string):{select(columns:string):{maybeSingle():Promise<RpcResponse<RemoteRow|null>>}};
  rpc<T=unknown>(name:string,args:Record<string,unknown>):Promise<RpcResponse<T>>;
}
interface SupabaseModuleLike{
  createClient(url:string,key:string,options:Record<string,unknown>):SupabaseClientLike;
}

interface SyncMeta{
  format:'vnext';
  userId:string;
  enabled:boolean;
  revision:number|null;
  localHash:string;
  syncedAt:number;
}
export interface PublicAccountState{
  ready:boolean;
  busy:boolean;
  status:AccountStatus;
  user:{id:string;email:string}|null;
  syncEnabled:boolean;
  revision:number|null;
  lastSyncedAt:number;
  error:string;
  hasConflict:boolean;
}

const state:{
  client:SupabaseClientLike|null;
  user:UserLike|null;
  ready:boolean;
  busy:boolean;
  status:AccountStatus;
  error:string;
  conflict:RemoteRow|null;
  syncTimer:number|null;
  initialized:boolean;
  localListenerBound:boolean;
}={
  client:null,user:null,ready:false,busy:false,status:'guest',error:'',conflict:null,
  syncTimer:null,initialized:false,localListenerBound:false
};

const listeners=new Set<(value:PublicAccountState)=>void>();

function object(value:unknown):Record<string,unknown>{
  return value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};
}
function timeout<T>(promise:Promise<T>,ms:number,message:string):Promise<T>{
  return Promise.race([
    promise,
    new Promise<T>((_,reject)=>globalThis.setTimeout(()=>reject(new Error(message)),ms))
  ]);
}
function errorMessage(error:unknown):string{
  const raw=error&&typeof error==='object'&&'message' in error?String((error as ErrorLike).message||''):String(error||'Account request failed.');
  if(/FRENCH_SYNC_CONFLICT|40001/i.test(raw))return'French changed on another device too. Choose which copy to keep.';
  if(/Failed to fetch|NetworkError|timed out|timeout/i.test(raw))return'Account sync is temporarily unreachable. Your local progress is safe.';
  if(/redirect|oauth/i.test(raw))return'Sign-in could not complete. Your local progress is unchanged.';
  return raw.length>180?raw.slice(0,177)+'…':raw;
}
function isMissingSession(error:unknown):boolean{
  const e=error as ErrorLike|undefined;
  return /AuthSessionMissing|session missing|no session/i.test(String(e?.name||'')+' '+String(e?.message||''));
}
function isConflict(error:unknown):boolean{
  const e=error as ErrorLike|undefined;
  return /40001|FRENCH_SYNC_CONFLICT/i.test(String(e?.code||'')+' '+String(e?.message||''));
}
function readMeta():SyncMeta|null{
  try{
    const raw=object(JSON.parse(localStorage.getItem(SYNC_META_KEY)||'null'));
    if(!raw.userId)return null;
    return{
      format:'vnext',
      userId:String(raw.userId),
      enabled:raw.enabled===true,
      revision:raw.revision===null||raw.revision===undefined?null:(Number.isFinite(Number(raw.revision))?Number(raw.revision):null),
      localHash:raw.format==='vnext'&&typeof raw.localHash==='string'?raw.localHash:'',
      syncedAt:Number.isFinite(Number(raw.syncedAt))?Number(raw.syncedAt):0
    };
  }catch{return null;}
}
function writeMeta(meta:SyncMeta):SyncMeta{
  try{localStorage.setItem(SYNC_META_KEY,JSON.stringify(meta));}catch{}
  return meta;
}
function deviceId():string{
  try{
    const existing=localStorage.getItem(DEVICE_KEY);
    if(existing)return existing;
    const value=crypto.randomUUID?.()??Array.from(crypto.getRandomValues(new Uint8Array(16)),n=>n.toString(16).padStart(2,'0')).join('');
    localStorage.setItem(DEVICE_KEY,value);return value;
  }catch{return'browser-'+Math.random().toString(36).slice(2);}
}
function publicState():PublicAccountState{
  const meta=readMeta();
  return{
    ready:state.ready,busy:state.busy,status:state.status,
    user:state.user?{id:state.user.id,email:String(state.user.email||'')}:null,
    syncEnabled:Boolean(state.user&&meta?.enabled&&meta.userId===state.user.id),
    revision:meta?.revision??null,lastSyncedAt:meta?.syncedAt??0,
    error:state.error,hasConflict:Boolean(state.conflict)
  };
}
function emit():void{
  const value=publicState();
  for(const listener of listeners)listener(value);
  window.dispatchEvent(new CustomEvent('french:vnext-account-state',{detail:value}));
}
export function subscribeAccount(listener:(value:PublicAccountState)=>void):()=>void{
  listeners.add(listener);listener(publicState());return()=>listeners.delete(listener);
}
export function getAccountState():PublicAccountState{return publicState();}

async function stableHash(value:unknown):Promise<string>{
  const stringify=(input:unknown):string=>{
    if(input===null||typeof input!=='object')return JSON.stringify(input);
    if(Array.isArray(input))return'['+input.map(stringify).join(',')+']';
    const row=input as Record<string,unknown>;
    return'{'+Object.keys(row).filter(key=>key!=='exportedAt').sort().map(key=>JSON.stringify(key)+':'+stringify(row[key])).join(',')+'}';
  };
  const text=stringify(value);
  if(!crypto?.subtle)return'fallback-'+text.length;
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
  return[...new Uint8Array(digest)].map(n=>n.toString(16).padStart(2,'0')).join('');
}
function meaningfulLocal(snapshot:CanonicalBackupV1):boolean{
  if(snapshot.srs.length||snapshot.activity.length||snapshot.session)return true;
  if(snapshot.learner?.studyDays?.length)return true;
  const content=snapshot.userContent;
  return Boolean(content&&(Object.keys(content.userCards).length||Object.keys(content.cardEdits).length||Object.keys(content.customDecks).length||Object.keys(content.smartDecks).length));
}
async function loadClient():Promise<SupabaseClientLike>{
  if(state.client)return state.client;
  const module=await timeout(import(/* @vite-ignore */ MODULE_URL),10_000,'THIEPN Account could not load.') as unknown as SupabaseModuleLike;
  const client=module.createClient(SUPABASE_URL,SUPABASE_KEY,{
    auth:{flowType:'pkce',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:AUTH_STORAGE_KEY}
  });
  client.auth.onAuthStateChange(()=>globalThis.setTimeout(()=>void refreshAuth(true),0));
  state.client=client;
  return client;
}
async function fetchRemote():Promise<RemoteRow|null>{
  const client=state.client??await loadClient();
  const response=await timeout(
    client.from('french_sync_state').select('revision,state,app_version,device_id,client_updated_at,updated_at').maybeSingle(),
    10_000,'Cloud progress check timed out.'
  );
  if(response.error)throw response.error;
  return response.data??null;
}
async function upload(snapshot:CanonicalBackupV1,expectedRevision:number|null):Promise<{revision:number}>{
  const client=state.client??await loadClient();
  const response=await timeout(client.rpc<{revision:number}>('sync_thiepn_french_state',{
    p_expected_revision:expectedRevision,
    p_state:snapshot,
    p_app_version:'vnext-p37h',
    p_device_id:deviceId(),
    p_client_updated_at:new Date().toISOString()
  }),12_000,'Cloud upload timed out.');
  if(response.error)throw response.error;
  const data=response.data as unknown;
  if(!data||typeof data!=='object'||!Number.isFinite(Number((data as Record<string,unknown>).revision)))throw new Error('Cloud sync returned no revision.');
  return{revision:Number((data as Record<string,unknown>).revision)};
}
function saveBaseline(userId:string,revision:number,localHash:string):void{
  writeMeta({format:'vnext',userId,enabled:true,revision,localHash,syncedAt:Date.now()});
}
async function legacyEnvelope(stateValue:JsonObject):Promise<LegacySnapshotEnvelope>{
  return{
    schema:'thiepn-french-legacy-import-v1',
    source:'cloud',
    capturedAt:Date.now(),
    sourceUpdatedAt:Number(stateValue.updatedAt)||Date.now(),
    sourceVersion:typeof stateValue.version==='string'?stateValue.version:'cloud-p35',
    sourceSchema:Number.isFinite(Number(stateValue.schema))?Number(stateValue.schema):0,
    fingerprint:await stableHash(stateValue),
    payload:stateValue
  };
}
function isCanonicalBackup(value:unknown):value is CanonicalBackupV1{
  const raw=object(value);
  return raw.schema==='thiepn-french-vnext-backup-v1'&&Array.isArray(raw.srs)&&Array.isArray(raw.activity);
}
async function applyRemote(remote:RemoteRow):Promise<void>{
  if(!remote.state||typeof remote.state!=='object'||Array.isArray(remote.state))throw new Error('Cloud progress is invalid.');
  if(isCanonicalBackup(remote.state)){
    await replaceCanonicalBackup(remote.state);
  }else{
    const envelope=await legacyEnvelope(remote.state as JsonObject);
    await writeCanonicalMigration(legacyEnvelopeToCanonical(envelope));
  }
  const snapshot=await exportCanonicalBackup();
  saveBaseline(state.user?.id??'',remote.revision,await stableHash(snapshot));
  state.conflict=null;state.status='synced';state.error='';
  window.dispatchEvent(new Event('french:vnext-state-replaced'));
}
function cleanCallbackUrl():void{
  try{
    const url=new URL(location.href),keys=['code','error','error_code','error_description','thiepn_auth'];
    let changed=false;
    for(const key of keys)if(url.searchParams.has(key)){url.searchParams.delete(key);changed=true;}
    if(changed)history.replaceState(history.state,'',url.pathname+(url.searchParams.toString()?'?'+url.searchParams.toString():'')+url.hash);
  }catch{}
}
async function refreshAuth(reconcile=true):Promise<UserLike|null>{
  const client=state.client??await loadClient();
  let response:RpcResponse<{user:UserLike|null}>;
  try{response=await timeout(client.auth.getUser(),8_000,'Account verification timed out.');}
  catch(error){
    if(isMissingSession(error))response={data:{user:null},error:null};else throw error;
  }
  if(response.error&&!isMissingSession(response.error))throw response.error;
  state.user=response.data?.user??null;state.ready=true;state.error='';state.conflict=null;
  if(!state.user)state.status='guest';
  else{
    const meta=readMeta();
    state.status=meta?.enabled&&meta.userId===state.user.id?'synced':'signed-in';
    if(reconcile&&meta?.enabled&&meta.userId===state.user.id)void reconcileNow(true);
  }
  if(state.user)cleanCallbackUrl();
  const target=sessionStorage.getItem(RETURN_KEY);
  if(target){sessionStorage.removeItem(RETURN_KEY);location.hash='#'+target;}
  emit();return state.user;
}
export async function signIn():Promise<void>{
  state.busy=true;state.error='';emit();
  try{
    const client=state.client??await loadClient();
    sessionStorage.setItem(RETURN_KEY,'settings');
    const response=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname}});
    if(response.error)throw response.error;
  }catch(error){
    state.busy=false;state.status='error';state.error=errorMessage(error);emit();
  }
}
export async function enableSync():Promise<void>{
  if(!state.user){await signIn();return;}
  state.busy=true;state.error='';emit();
  try{
    const client=state.client??await loadClient();
    const connected=await client.rpc('connect_thiepn_app',{p_app_slug:APP_SLUG});
    if(connected.error)throw connected.error;
    const existing=readMeta();
    writeMeta({
      format:'vnext',userId:state.user.id,enabled:true,
      revision:existing?.userId===state.user.id?existing.revision:null,
      localHash:existing?.userId===state.user.id?existing.localHash:'',
      syncedAt:existing?.userId===state.user.id?existing.syncedAt:0
    });
    state.busy=false;await reconcileNow(false);
  }catch(error){
    state.busy=false;state.status='error';state.error=errorMessage(error);emit();
  }
}
export async function reconcileNow(background=false):Promise<void>{
  const user=state.user,meta=readMeta();
  if(!user||!meta?.enabled||meta.userId!==user.id||state.busy||state.conflict)return;
  state.busy=true;state.status='syncing';state.error='';emit();
  try{
    const local=await exportCanonicalBackup(),localHash=await stableHash(local),hasLocal=meaningfulLocal(local);
    const remote=await fetchRemote();
    if(!remote){
      const uploaded=await upload(local,null);saveBaseline(user.id,uploaded.revision,localHash);
      state.status='synced';return;
    }
    if(meta.revision===null){
      if(hasLocal){state.conflict=remote;state.status='conflict';return;}
      await applyRemote(remote);return;
    }
    if(remote.revision===meta.revision){
      if(meta.localHash&&meta.localHash===localHash){state.status='synced';return;}
      const uploaded=await upload(local,remote.revision);saveBaseline(user.id,uploaded.revision,localHash);state.status='synced';return;
    }
    if(meta.localHash&&meta.localHash===localHash){await applyRemote(remote);return;}
    state.conflict=remote;state.status='conflict';
  }catch(error){
    state.status=isConflict(error)?'conflict':'error';state.error=errorMessage(error);
    if(isConflict(error))state.conflict=await fetchRemote().catch(()=>null);
    if(background&&state.status==='error')console.warn('French account background sync deferred.',error);
  }finally{state.busy=false;emit();}
}
export async function useDevice():Promise<void>{
  if(!state.user||!state.conflict)return;
  state.busy=true;state.status='syncing';state.error='';emit();
  try{
    const local=await exportCanonicalBackup(),hash=await stableHash(local);
    const uploaded=await upload(local,state.conflict.revision);
    saveBaseline(state.user.id,uploaded.revision,hash);state.conflict=null;state.status='synced';
  }catch(error){
    state.status=isConflict(error)?'conflict':'error';state.error=errorMessage(error);
    if(isConflict(error))state.conflict=await fetchRemote().catch(()=>state.conflict);
  }finally{state.busy=false;emit();}
}
export async function useCloud():Promise<void>{
  if(!state.user||!state.conflict)return;
  state.busy=true;state.status='syncing';state.error='';emit();
  try{await applyRemote(state.conflict);}
  catch(error){state.status='error';state.error=errorMessage(error);}
  finally{state.busy=false;emit();}
}
export function pauseSync():void{
  if(state.syncTimer!==null){clearTimeout(state.syncTimer);state.syncTimer=null;}
  const meta=readMeta();
  if(state.user&&meta?.userId===state.user.id)writeMeta({...meta,enabled:false});
  state.conflict=null;state.status=state.user?'signed-in':'guest';state.error='';emit();
}
export async function signOut():Promise<void>{
  pauseSync();state.busy=true;emit();
  try{if(state.client)await state.client.auth.signOut({scope:'local'});}
  catch(error){state.error=errorMessage(error);}
  finally{state.busy=false;state.user=null;state.status='guest';state.conflict=null;emit();}
}
function scheduleSync():void{
  const meta=readMeta();
  if(!state.user||!meta?.enabled||meta.userId!==state.user.id||state.conflict)return;
  if(state.syncTimer!==null)clearTimeout(state.syncTimer);
  state.syncTimer=window.setTimeout(()=>{state.syncTimer=null;void reconcileNow(true);},SYNC_DELAY);
}
function bindLocalChanges():void{
  if(state.localListenerBound)return;
  state.localListenerBound=true;
  window.addEventListener('french:vnext-local-change',scheduleSync);
}
export function shouldInitializeAccount():boolean{
  try{
    const url=new URL(location.href);
    if(['code','error','error_code','error_description','thiepn_auth'].some(key=>url.searchParams.has(key)))return true;
    return localStorage.getItem(SYNC_META_KEY)!==null||localStorage.getItem(AUTH_STORAGE_KEY)!==null;
  }catch{return false;}
}
export async function initializeAccount(reconcile=true):Promise<PublicAccountState>{
  if(state.initialized){if(reconcile&&state.user)void reconcileNow(true);return publicState();}
  state.initialized=true;bindLocalChanges();
  try{await loadClient();await refreshAuth(reconcile);}
  catch(error){state.ready=true;state.status='error';state.error=errorMessage(error);emit();}
  return publicState();
}
