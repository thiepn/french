import { createBackupPayload,restoreBackupPayload } from '../backup/archive';
import { legacyEnvelopeToCanonical } from '../learner/from-legacy';
import { writeCanonicalMigration } from '../learner/repository';
import { openFrenchDatabase } from '../storage/idb';
import type { LegacySnapshotEnvelope } from '../migration/legacy-contract';

export { backupPayloadToFrenchCloudSnapshot,hashFrenchCloudSnapshot,snapshotHasMeaningfulState } from './cloud-format';
export type { FrenchCloudSnapshot } from './cloud-format';
import { backupPayloadToFrenchCloudSnapshot,hashFrenchCloudSnapshot } from './cloud-format';
import type { FrenchCloudSnapshot } from './cloud-format';
function object(value:unknown):Record<string,unknown>{return value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};}

export async function createFrenchCloudSnapshot():Promise<FrenchCloudSnapshot>{
  return backupPayloadToFrenchCloudSnapshot(await createBackupPayload());
}
async function clearSession():Promise<void>{
  const db=await openFrenchDatabase();try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction('session','readwrite');tx.objectStore('session').clear();tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error??new Error('Session clear failed.'));tx.onabort=()=>reject(tx.error??new Error('Session clear aborted.'));});}finally{db.close();}
}
export async function applyFrenchCloudSnapshot(snapshot:FrenchCloudSnapshot):Promise<void>{
  const vnext=object(snapshot._vnext);
  if(vnext.schema==='thiepn-french-cloud-vnext-v1'&&vnext.payload){await restoreBackupPayload(vnext.payload);return;}
  const hash=await hashFrenchCloudSnapshot(snapshot);
  const envelope:LegacySnapshotEnvelope={schema:'thiepn-french-legacy-import-v1',source:'local-storage',capturedAt:Date.now(),sourceUpdatedAt:Number(snapshot.updatedAt)||Date.now(),sourceVersion:String(snapshot.version??'cloud-legacy'),sourceSchema:Number(snapshot.schema)||0,fingerprint:'cloud:'+hash,payload:snapshot};
  await writeCanonicalMigration(legacyEnvelopeToCanonical(envelope));await clearSession();
}
