import { accountJson,rpc } from './api';
import { createFrenchCloudSnapshot,applyFrenchCloudSnapshot,hashFrenchCloudSnapshot,snapshotHasMeaningfulState,type FrenchCloudSnapshot } from './cloud-snapshot';
import { nativeLearnerEpoch } from './cloud-format';
import { getVerifiedFrenchAccountUser,type FrenchAccountUser } from './session';

const META_KEY='french-thiepn-sync-v2',DEVICE_KEY='french-thiepn-device-id-v1',APP_VERSION='vnext-p37h';
export type FrenchSyncStatus='disabled'|'synced'|'pushed'|'pulled'|'conflict'|'offline'|'error';
export interface FrenchSyncResult{status:FrenchSyncStatus;message:string;revision?:number;cloudUpdatedAt?:string;reviewedLocalHash?:string;recoveryOnly?:boolean}
interface Meta{schemaVersion:2;userId:string;enabled:boolean;revision?:number;hash?:string;nativeEpoch?:string;consentGeneration?:string;lastSyncedAt?:string;deviceId:string}
interface Cloud{revision:number;state:FrenchCloudSnapshot;updated_at?:string}
function deviceId():string{try{const current=localStorage.getItem(DEVICE_KEY);if(current)return current;const value=crypto.randomUUID();localStorage.setItem(DEVICE_KEY,value);return value;}catch{return'french-'+Date.now();}}
export function readFrenchSyncMeta():Meta|null{try{const v=JSON.parse(localStorage.getItem(META_KEY)??'null') as Partial<Meta>|null;if(!v||v.schemaVersion!==2||typeof v.userId!=='string'||typeof v.enabled!=='boolean')return null;return{schemaVersion:2,userId:v.userId,enabled:v.enabled,...(typeof v.revision==='number'?{revision:v.revision}:{}),...(typeof v.hash==='string'?{hash:v.hash}:{}),...(typeof v.nativeEpoch==='string'&&v.nativeEpoch?{nativeEpoch:v.nativeEpoch}:{}),...(typeof v.consentGeneration==='string'&&v.consentGeneration?{consentGeneration:v.consentGeneration}:{}),...(typeof v.lastSyncedAt==='string'?{lastSyncedAt:v.lastSyncedAt}:{}),deviceId:typeof v.deviceId==='string'&&v.deviceId?v.deviceId:deviceId()};}catch{return null;}}
function writeMeta(meta:Meta):void{try{localStorage.setItem(META_KEY,JSON.stringify(meta));}catch{}}
function metaFor(userId:string):Meta{const current=readFrenchSyncMeta();return current?.userId===userId?current:{schemaVersion:2,userId,enabled:false,deviceId:deviceId()};}
export function isFrenchSyncEnabled(userId:string):boolean{const m=readFrenchSyncMeta();return m?.userId===userId&&m.enabled;}
export function pauseFrenchSync(userId:string):void{writeMeta({...metaFor(userId),enabled:false,consentGeneration:crypto.randomUUID()});emit({status:'disabled',message:'Cloud sync is paused on this device.'});}
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
function baseline(userId:string,cloud:Cloud,hash:string,local:FrenchCloudSnapshot):void{
  const m=metaFor(userId),epoch=nativeLearnerEpoch(local);
  writeMeta({...m,revision:cloud.revision,hash,
    ...(epoch?{nativeEpoch:epoch}:{}),lastSyncedAt:new Date().toISOString()});
}
function lineageChanged(userId:string,local:FrenchCloudSnapshot):boolean{
  const previous=metaFor(userId).nativeEpoch;
  return Boolean(previous&&nativeLearnerEpoch(local)!==previous);
}
async function push(userId:string,cloud:Cloud|undefined,local:FrenchCloudSnapshot,generation:string|undefined):Promise<FrenchSyncResult>{
  // A formerly synced device can lose IndexedDB without losing localStorage.
  // Never publish a blank native database over meaningful remote progress,
  // including through an explicitly reviewed conflict choice.
  if(cloud&&snapshotHasMeaningfulState(cloud.state)&&
     (!snapshotHasMeaningfulState(local)||lineageChanged(userId,local)))
    return emptyLocalRecoveryConflict(cloud,await hashFrenchCloudSnapshot(local));
  // Read-only remote inspection may finish after the user pauses, signs out,
  // or changes Account identity. Never issue the write under stale consent.
  const denied=await transferDenied(userId,generation);
  if(denied)return denied;
  const m=metaFor(userId),uploaded=await writeCloud(cloud?.revision??null,local,m.deviceId),hash=await hashFrenchCloudSnapshot(local);baseline(userId,uploaded,hash,local);
  const result:FrenchSyncResult={status:'pushed',message:'This device is now synced to THIEPN Account.',revision:uploaded.revision,...(uploaded.updated_at?{cloudUpdatedAt:uploaded.updated_at}:{})};emit(result);return result;
}
function emptyLocalRecoveryConflict(cloud:Cloud,localHash:string):FrenchSyncResult{
  const result:FrenchSyncResult={
    status:'conflict',recoveryOnly:true,revision:cloud.revision,
    reviewedLocalHash:localHash,
    message:'The local French data store has changed identity or lost previously synced progress. Local storage may have been cleared. Nothing was uploaded; recover from the cloud or review the latest state.'
  };
  emit(result);return result;
}
function unsafeToReplace(message:string,revision?:number):FrenchSyncResult{
  const result:FrenchSyncResult={status:'conflict',message,...(revision!==undefined?{revision}:{})};
  emit(result);return result;
}
/** A pause/sign-out invalidates every earlier consent generation, even if
 * another tab opts in again while an earlier network request is outstanding.
 * Generation is origin-shared via the existing version-2 sync metadata.
 */
function consentCurrent(userId:string,generation:string|undefined):boolean{
  const m=readFrenchSyncMeta();
  return Boolean(m?.enabled&&m.userId===userId&&m.consentGeneration===generation);
}
function syncPaused():FrenchSyncResult{
  return{status:'disabled',message:'French sync authorization changed while checking the cloud. No new transfer was started.'};
}
function identityChanged():FrenchSyncResult{
  const result:FrenchSyncResult={status:'conflict',message:'THIEPN Account identity changed or cannot be verified. No French progress was transferred. Sign in and review the current account.'};
  emit(result);return result;
}
async function transferDenied(userId:string,generation:string|undefined):Promise<FrenchSyncResult|null>{
  if(!consentCurrent(userId,generation))return syncPaused();
  const verified=await getVerifiedFrenchAccountUser().catch(()=>null);
  if(!consentCurrent(userId,generation))return syncPaused();
  if(verified?.id!==userId)return identityChanged();
  return null;
}
async function pull(userId:string,cloud:Cloud,expectedLocalHash:string,generation:string|undefined):Promise<FrenchSyncResult>{
  // A learner can study or edit preferences while the remote read is pending.
  // Do not overwrite a newly changed local snapshot from a stale cloud decision.
  const expectedLocal=await createFrenchCloudSnapshot();
  const currentHash=await hashFrenchCloudSnapshot(expectedLocal);
  if(currentHash!==expectedLocalHash)return unsafeToReplace('French changed on this device while checking the cloud. Review the latest state before restoring.',cloud.revision);
  const denied=await transferDenied(userId,generation);
  if(denied)return denied;
  try{await applyFrenchCloudSnapshot(cloud.state,expectedLocal);}
  catch(error){
    if(String(error).includes('FRENCH_RESTORE_LOCAL_CHANGED'))
      return unsafeToReplace('French changed on this device while restoring from the cloud. Review the latest state before restoring.',cloud.revision);
    throw error;
  }
  // A legacy cloud payload is converted into native local learner data during
  // restoration; its pre-conversion wire envelope has no native lineage.
  const restoredLocal=await createFrenchCloudSnapshot();
  const hash=await hashFrenchCloudSnapshot(cloud.state);
  baseline(userId,cloud,hash,restoredLocal);
  const result:FrenchSyncResult={status:'pulled',message:'Cloud French progress was restored on this device.',revision:cloud.revision,...(cloud.updated_at?{cloudUpdatedAt:cloud.updated_at}:{})};emit(result);return result;
}
export async function enableFrenchSync(user:FrenchAccountUser):Promise<FrenchSyncResult>{
  const initial=metaFor(user.id).consentGeneration;
  if(!(await isFrenchAccountConnectionActive()))return{status:'disabled',message:'Reconnect French through THIEPN Account before enabling cloud sync.'};
  const verified=await getVerifiedFrenchAccountUser().catch(()=>null);
  if(verified?.id!==user.id)return identityChanged();
  const m=metaFor(user.id);
  if(m.consentGeneration!==initial)return syncPaused();
  writeMeta({...m,enabled:true,consentGeneration:crypto.randomUUID()});
  return reconcileFrenchSync(user);
}
// Serialize overlapping automatic/manual reconciliations for one identity.
// Two callers must never race to create the same initial cloud revision.
const reconciliations=new Map<string,Promise<FrenchSyncResult>>();
export function reconcileFrenchSync(user:FrenchAccountUser):Promise<FrenchSyncResult>{
  // A new deliberate opt-in after pause must not inherit an older in-flight
  // reconciliation from the previous consent generation.
  const key=user.id+':'+(metaFor(user.id).consentGeneration??'legacy');
  const pending=reconciliations.get(key);
  if(pending)return pending;
  const work=reconcileFrenchSyncOnce(user);
  reconciliations.set(key,work);
  void work.then(
    ()=>{if(reconciliations.get(key)===work)reconciliations.delete(key);},
    ()=>{if(reconciliations.get(key)===work)reconciliations.delete(key);}
  );
  return work;
}
async function reconcileFrenchSyncOnce(user:FrenchAccountUser):Promise<FrenchSyncResult>{
  const m=metaFor(user.id),generation=m.consentGeneration;
  if(!m.enabled)return{status:'disabled',message:'Cloud sync is not enabled on this device.'};
  if(!navigator.onLine)return{status:'offline',message:'Offline. French remains fully local and sync will resume when connected.'};
  try{
    const connected=await isFrenchAccountConnectionActive();
    if(!consentCurrent(user.id,generation))return syncPaused();
    if(!connected){writeMeta({...metaFor(user.id),enabled:false});const r:FrenchSyncResult={status:'disabled',message:'French is disconnected in THIEPN Account.'};emit(r);return r;}
    const [local,cloud]=await Promise.all([createFrenchCloudSnapshot(),readCloud()]),localHash=await hashFrenchCloudSnapshot(local),cloudHash=cloud?await hashFrenchCloudSnapshot(cloud.state):undefined;
    if(!consentCurrent(user.id,generation))return syncPaused();
    if(!cloud){if(m.revision!==undefined){const r:FrenchSyncResult={status:'conflict',message:'The earlier cloud copy is missing. Choose whether to recreate it from this device.',reviewedLocalHash:localHash};emit(r);return r;}return push(user.id,undefined,local,generation);}
    if(localHash===cloudHash){baseline(user.id,cloud,localHash,local);const r:FrenchSyncResult={status:'synced',message:'French is up to date.',revision:cloud.revision,...(cloud.updated_at?{cloudUpdatedAt:cloud.updated_at}:{})};emit(r);return r;}
    if(m.revision===undefined||!m.hash){if(snapshotHasMeaningfulState(local)){const r:FrenchSyncResult={status:'conflict',message:'This device and the cloud both contain French progress or preferences. Choose the source of truth.',revision:cloud.revision,reviewedLocalHash:localHash,...(cloud.updated_at?{cloudUpdatedAt:cloud.updated_at}:{})};emit(r);return r;}return pull(user.id,cloud,localHash,generation);}
    const localChanged=localHash!==m.hash,cloudChanged=cloudHash!==m.hash;
    if(localChanged&&snapshotHasMeaningfulState(cloud.state)&&
       (!snapshotHasMeaningfulState(local)||lineageChanged(user.id,local)))
      return emptyLocalRecoveryConflict(cloud,localHash);
    if(localChanged&&cloudChanged){const r:FrenchSyncResult={status:'conflict',message:'French changed on this device and in the cloud. Choose the source of truth.',revision:cloud.revision,reviewedLocalHash:localHash,...(cloud.updated_at?{cloudUpdatedAt:cloud.updated_at}:{})};emit(r);return r;}
    if(localChanged)return push(user.id,cloud,local,generation);if(cloudChanged)return pull(user.id,cloud,localHash,generation);
    baseline(user.id,cloud,localHash,local);return{status:'synced',message:'French is up to date.',revision:cloud.revision,...(cloud.updated_at?{cloudUpdatedAt:cloud.updated_at}:{})};
  }catch(error){
    const message=error instanceof Error?error.message:String(error),conflict=/FRENCH_SYNC_CONFLICT|40001/i.test(message);
    const r:FrenchSyncResult={status:conflict?'conflict':'error',message:conflict?'Another device updated French while this device was syncing. Review the conflict before continuing.':message};emit(r);return r;
  }
}
// A conflict-resolution choice must apply only to the exact cloud revision and
// local snapshot that were shown at review time. Never silently rebase an
// overwrite to a newer cloud revision from another device.
export async function chooseThisDevice(user:FrenchAccountUser,expectedCloudRevision:number|null,reviewedLocalHash:string):Promise<FrenchSyncResult>{
  const generation=metaFor(user.id).consentGeneration;
  if(!consentCurrent(user.id,generation))return syncPaused();
  const local=await createFrenchCloudSnapshot();
  if(await hashFrenchCloudSnapshot(local)!==reviewedLocalHash)
    return unsafeToReplace('This device changed after the conflict was reviewed. Review the latest state before replacing the cloud.');
  // A recovery-only decision cannot turn a cleared local database into a
  // destructive cloud replacement by reusing the generic "Use this device" path.
  const current=await readCloud();
  if(current&&snapshotHasMeaningfulState(current.state)&&
     (!snapshotHasMeaningfulState(local)||lineageChanged(user.id,local)))
    return emptyLocalRecoveryConflict(current,reviewedLocalHash);
  try{return await push(user.id,expectedCloudRevision===null?undefined:{revision:expectedCloudRevision,state:local},local,generation);}
  catch(error){
    const message=error instanceof Error?error.message:String(error);
    if(/FRENCH_SYNC_CONFLICT|40001/.test(message))return unsafeToReplace('The cloud changed after you reviewed the conflict. Review the latest state before replacing it.');
    return{status:'error',message};
  }
}
export async function chooseCloud(user:FrenchAccountUser,expectedCloudRevision:number|null,reviewedLocalHash:string):Promise<FrenchSyncResult>{
  const generation=metaFor(user.id).consentGeneration;
  if(!consentCurrent(user.id,generation))return syncPaused();
  const cloud=await readCloud();
  if(!cloud)return unsafeToReplace('The cloud copy is missing. Review the latest state before restoring.');
  if(cloud.revision!==expectedCloudRevision)return unsafeToReplace('The cloud changed after you reviewed the conflict. Review the latest state before restoring.',cloud.revision);
  return pull(user.id,cloud,reviewedLocalHash,generation);
}
