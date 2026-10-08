import { accountJson,rpc } from './api';
import { createFrenchCloudSnapshot,applyFrenchCloudSnapshot,hashFrenchCloudSnapshot,snapshotHasMeaningfulState,type FrenchCloudSnapshot } from './cloud-snapshot';
import type { FrenchAccountUser } from './session';

const META_KEY='french-thiepn-sync-v2',DEVICE_KEY='french-thiepn-device-id-v1',APP_VERSION='vnext-p37h';
export type FrenchSyncStatus='disabled'|'synced'|'pushed'|'pulled'|'conflict'|'offline'|'error';
export interface FrenchSyncResult{status:FrenchSyncStatus;message:string;revision?:number;cloudUpdatedAt?:string}
interface Meta{schemaVersion:2;userId:string;enabled:boolean;revision?:number;hash?:string;lastSyncedAt?:string;deviceId:string}
interface Cloud{revision:number;state:FrenchCloudSnapshot;updated_at?:string}
function deviceId():string{try{const current=localStorage.getItem(DEVICE_KEY);if(current)return current;const value=crypto.randomUUID();localStorage.setItem(DEVICE_KEY,value);return value;}catch{return'french-'+Date.now();}}
export function readFrenchSyncMeta():Meta|null{try{const v=JSON.parse(localStorage.getItem(META_KEY)??'null') as Partial<Meta>|null;if(!v||v.schemaVersion!==2||typeof v.userId!=='string'||typeof v.enabled!=='boolean')return null;return{schemaVersion:2,userId:v.userId,enabled:v.enabled,...(typeof v.revision==='number'?{revision:v.revision}:{}),...(typeof v.hash==='string'?{hash:v.hash}:{}),...(typeof v.lastSyncedAt==='string'?{lastSyncedAt:v.lastSyncedAt}:{}),deviceId:typeof v.deviceId==='string'&&v.deviceId?v.deviceId:deviceId()};}catch{return null;}}
function writeMeta(meta:Meta):void{try{localStorage.setItem(META_KEY,JSON.stringify(meta));}catch{}}
function metaFor(userId:string):Meta{const current=readFrenchSyncMeta();return current?.userId===userId?current:{schemaVersion:2,userId,enabled:false,deviceId:deviceId()};}
export function isFrenchSyncEnabled(userId:string):boolean{const m=readFrenchSyncMeta();return m?.userId===userId&&m.enabled;}
export function pauseFrenchSync(userId:string):void{writeMeta({...metaFor(userId),enabled:false});emit({status:'disabled',message:'Cloud sync is paused on this device.'});}
function emit(result:FrenchSyncResult):void{dispatchEvent(new CustomEvent('thiepn:french-sync',{detail:result}));}
function cloudRow(value:unknown):Cloud{
  if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('INVALID_FRENCH_CLOUD_STATE');
  const row=value as Record<string,unknown>;if(typeof row.revision!=='number'||!Number.isFinite(row.revision)||!row.state||typeof row.state!=='object'||Array.isArray(row.state))throw new Error('INVALID_FRENCH_CLOUD_STATE');
  return{revision:row.revision,state:row.state as FrenchCloudSnapshot,...(typeof row.updated_at==='string'?{updated_at:row.updated_at}: {})};
}
export async function isFrenchAccountConnectionActive():Promise<boolean>{
  const rows=await accountJson<Array<{status?:string}>>('/rest/v1/account_app_connections?select=status&app_slug=eq.french&limit=1');
  return rows[0]?.status==='connected'||rows[0]?.status==='limited';
}
async function readCloud():Promise<Cloud|undefined>{const rows=await accountJson<Array<Record<string,unknown>>>('/rest/v1/french_sync_state?select=revision,state,updated_at&limit=1');return rows[0]?cloudRow(rows[0]):undefined;}
async function writeCloud(expected:number|null,state:FrenchCloudSnapshot,device:string):Promise<Cloud>{return cloudRow(await rpc('sync_thiepn_french_state',{p_expected_revision:expected,p_state:state,p_app_version:APP_VERSION,p_device_id:device,p_client_updated_at:new Date().toISOString()}));}
function baseline(userId:string,cloud:Cloud,hash:string):void{const m=metaFor(userId);writeMeta({...m,enabled:true,revision:cloud.revision,hash,lastSyncedAt:new Date().toISOString()});}
async function push(userId:string,cloud:Cloud|undefined,local:FrenchCloudSnapshot):Promise<FrenchSyncResult>{
  const m=metaFor(userId),uploaded=await writeCloud(cloud?.revision??null,local,m.deviceId),hash=await hashFrenchCloudSnapshot(local);baseline(userId,uploaded,hash);
  const result:FrenchSyncResult={status:'pushed',message:'This device is now synced to THIEPN Account.',revision:uploaded.revision,...(uploaded.updated_at?{cloudUpdatedAt:uploaded.updated_at}:{})};emit(result);return result;
}
async function pull(userId:string,cloud:Cloud):Promise<FrenchSyncResult>{
  await applyFrenchCloudSnapshot(cloud.state);const hash=await hashFrenchCloudSnapshot(cloud.state);baseline(userId,cloud,hash);
  const result:FrenchSyncResult={status:'pulled',message:'Cloud French progress was restored on this device.',revision:cloud.revision,...(cloud.updated_at?{cloudUpdatedAt:cloud.updated_at}:{})};emit(result);return result;
}
export async function enableFrenchSync(user:FrenchAccountUser):Promise<FrenchSyncResult>{
  if(!(await isFrenchAccountConnectionActive()))return{status:'disabled',message:'Reconnect French through THIEPN Account before enabling cloud sync.'};
  const m=metaFor(user.id);writeMeta({...m,enabled:true});return reconcileFrenchSync(user);
}
export async function reconcileFrenchSync(user:FrenchAccountUser):Promise<FrenchSyncResult>{
  const m=metaFor(user.id);if(!m.enabled)return{status:'disabled',message:'Cloud sync is not enabled on this device.'};
  if(!navigator.onLine)return{status:'offline',message:'Offline. French remains fully local and sync will resume when connected.'};
  try{
    if(!(await isFrenchAccountConnectionActive())){writeMeta({...m,enabled:false});const r:FrenchSyncResult={status:'disabled',message:'French is disconnected in THIEPN Account.'};emit(r);return r;}
    const [local,cloud]=await Promise.all([createFrenchCloudSnapshot(),readCloud()]),localHash=await hashFrenchCloudSnapshot(local),cloudHash=cloud?await hashFrenchCloudSnapshot(cloud.state):undefined;
    if(!cloud){if(m.revision!==undefined){const r:FrenchSyncResult={status:'conflict',message:'The earlier cloud copy is missing. Choose whether to recreate it from this device.'};emit(r);return r;}return push(user.id,undefined,local);}
    if(localHash===cloudHash){baseline(user.id,cloud,localHash);const r:FrenchSyncResult={status:'synced',message:'French is up to date.',revision:cloud.revision,...(cloud.updated_at?{cloudUpdatedAt:cloud.updated_at}:{})};emit(r);return r;}
    if(m.revision===undefined||!m.hash){if(snapshotHasMeaningfulState(local)){const r:FrenchSyncResult={status:'conflict',message:'This device and the cloud both contain French progress. Choose the source of truth.',revision:cloud.revision,...(cloud.updated_at?{cloudUpdatedAt:cloud.updated_at}:{})};emit(r);return r;}return pull(user.id,cloud);}
    const localChanged=localHash!==m.hash,cloudChanged=cloudHash!==m.hash;
    if(localChanged&&cloudChanged){const r:FrenchSyncResult={status:'conflict',message:'French changed on this device and in the cloud. Choose the source of truth.',revision:cloud.revision,...(cloud.updated_at?{cloudUpdatedAt:cloud.updated_at}:{})};emit(r);return r;}
    if(localChanged)return push(user.id,cloud,local);if(cloudChanged)return pull(user.id,cloud);
    baseline(user.id,cloud,localHash);return{status:'synced',message:'French is up to date.',revision:cloud.revision,...(cloud.updated_at?{cloudUpdatedAt:cloud.updated_at}:{})};
  }catch(error){
    const message=error instanceof Error?error.message:String(error),conflict=/FRENCH_SYNC_CONFLICT|40001/i.test(message);
    const r:FrenchSyncResult={status:conflict?'conflict':'error',message:conflict?'Another device updated French while this device was syncing. Review the conflict before continuing.':message};emit(r);return r;
  }
}
export async function chooseThisDevice(user:FrenchAccountUser):Promise<FrenchSyncResult>{const [local,cloud]=await Promise.all([createFrenchCloudSnapshot(),readCloud()]);return push(user.id,cloud,local);}
export async function chooseCloud(user:FrenchAccountUser):Promise<FrenchSyncResult>{const cloud=await readCloud();if(!cloud)return{status:'error',message:'No French cloud copy exists.'};return pull(user.id,cloud);}
