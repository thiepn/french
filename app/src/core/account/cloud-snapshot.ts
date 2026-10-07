import { createBackupPayload,restoreBackupPayload,type BackupPayload } from '../backup/archive';
import { legacyEnvelopeToCanonical } from '../learner/from-legacy';
import { writeCanonicalMigration } from '../learner/repository';
import { openFrenchDatabase } from '../storage/idb';
import type { LegacySnapshotEnvelope } from '../migration/legacy-contract';

export interface FrenchCloudSnapshot extends Record<string,unknown>{
  _vnext?:{schema:'thiepn-french-cloud-vnext-v1';payload:BackupPayload};
}
function at(payload:BackupPayload,store:keyof BackupPayload['stores'],key:string):unknown{return payload.stores[store].find(row=>String(row.key)===key)?.value;}
function obj(value:unknown):Record<string,unknown>{return value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};}
function progress(payload:BackupPayload):Record<string,unknown>{
  const out:Record<string,unknown>={};
  for(const row of payload.stores.srs){const v=obj(row.value),id=String(v.id??row.key);if(id)out[id]={...v,interval:v.intervalDays??0,due:v.dueAt??0,lastReviewed:v.lastReviewedAt??0};}
  return out;
}
function reviews(payload:BackupPayload):unknown[]{return payload.stores.activity.map(row=>{const v=obj(row.value);return{...v,interval:v.intervalDays??0};});}
export async function createFrenchCloudSnapshot():Promise<FrenchCloudSnapshot>{
  const payload=await createBackupPayload(),learner=obj(at(payload,'learner','state-v1')),content=obj(at(payload,'user-content','content-v1')),feature=obj(learner.featureState),reviewLog=reviews(payload);
  const lastReview=reviewLog.reduce((max,row)=>Math.max(max,Number(obj(row).t)||0),0);
  return{version:'vnext-p37h',schema:13,updatedAt:Math.max(Date.now(),lastReview),progress:progress(payload),settings:obj(learner.settings),reviewLog,
    studyDays:Array.isArray(learner.studyDays)?learner.studyDays:[],profile:obj(learner.profile),studyPlan:obj(learner.studyPlan),
    userCards:obj(content.userCards),cardEdits:obj(content.cardEdits),smartDecks:obj(content.smartDecks),customDecks:obj(content.customDecks),...feature,
    _vnext:{schema:'thiepn-french-cloud-vnext-v1',payload}};
}
export function snapshotHasMeaningfulState(snapshot:FrenchCloudSnapshot):boolean{
  return Object.keys(obj(snapshot.progress)).length>0||(Array.isArray(snapshot.reviewLog)&&snapshot.reviewLog.length>0)||(Array.isArray(snapshot.studyDays)&&snapshot.studyDays.length>0)
    ||Object.keys(obj(snapshot.userCards)).length>0||Object.keys(obj(snapshot.cardEdits)).length>0||Object.keys(obj(snapshot.v550Reading)).length>0;
}
function stable(value:unknown):string{
  if(value===null||typeof value!=='object')return JSON.stringify(value);
  if(Array.isArray(value))return'['+value.map(stable).join(',')+']';
  const row=value as Record<string,unknown>;
  return'{'+Object.keys(row).filter(key=>key!=='updatedAt').sort().map(key=>JSON.stringify(key)+':'+stable(row[key])).join(',')+'}';
}
export async function hashFrenchCloudSnapshot(snapshot:FrenchCloudSnapshot):Promise<string>{
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(stable(snapshot)));
  return[...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
}
async function clearSession():Promise<void>{
  const db=await openFrenchDatabase();try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction('session','readwrite');tx.objectStore('session').clear();tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error??new Error('Session clear failed.'));tx.onabort=()=>reject(tx.error??new Error('Session clear aborted.'));});}finally{db.close();}
}
export async function applyFrenchCloudSnapshot(snapshot:FrenchCloudSnapshot):Promise<void>{
  const vnext=obj(snapshot._vnext);
  if(vnext.schema==='thiepn-french-cloud-vnext-v1'&&vnext.payload){await restoreBackupPayload(vnext.payload);return;}
  const hash=await hashFrenchCloudSnapshot(snapshot);
  const envelope:LegacySnapshotEnvelope={schema:'thiepn-french-legacy-import-v1',source:'local-storage',capturedAt:Date.now(),sourceUpdatedAt:Number(snapshot.updatedAt)||Date.now(),sourceVersion:String(snapshot.version??'cloud-legacy'),sourceSchema:Number(snapshot.schema)||0,fingerprint:'cloud:'+hash,payload:snapshot};
  await writeCanonicalMigration(legacyEnvelopeToCanonical(envelope));await clearSession();
}
