import { createBackupPayload,restoreBackupPayload,type BackupPayload } from '../backup/archive';
import { legacyEnvelopeToCanonical } from '../learner/from-legacy';
import { writeCanonicalMigration } from '../learner/repository';
import type { LegacySnapshotEnvelope } from '../migration/legacy-contract';

export { backupPayloadToFrenchCloudSnapshot,hashFrenchCloudSnapshot,snapshotHasMeaningfulState } from './cloud-format';
export type { FrenchCloudSnapshot } from './cloud-format';
import { backupPayloadToFrenchCloudSnapshot,hashFrenchCloudSnapshot } from './cloud-format';
import type { FrenchCloudSnapshot } from './cloud-format';
function object(value:unknown):Record<string,unknown>{return value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{};}

export async function createFrenchCloudSnapshot():Promise<FrenchCloudSnapshot>{
  return backupPayloadToFrenchCloudSnapshot(await createBackupPayload());
}
export async function applyFrenchCloudSnapshot(snapshot:FrenchCloudSnapshot,expectedLocal:FrenchCloudSnapshot):Promise<void>{
  const vnext=object(snapshot._vnext);
  const reviewed=object(expectedLocal._vnext);
  if(reviewed.schema!=='thiepn-french-cloud-vnext-v1'||!reviewed.payload)
    throw Error('FRENCH_RESTORE_EXPECTED_LOCAL_MISSING');
  const baseline=reviewed.payload as BackupPayload;
  if(vnext.schema==='thiepn-french-cloud-vnext-v1'&&vnext.payload){
    await restoreBackupPayload(vnext.payload,baseline);
    return;
  }
  const hash=await hashFrenchCloudSnapshot(snapshot);
  const envelope:LegacySnapshotEnvelope={schema:'thiepn-french-legacy-import-v1',source:'local-storage',capturedAt:Date.now(),sourceUpdatedAt:Number(snapshot.updatedAt)||Date.now(),sourceVersion:String(snapshot.version??'cloud-legacy'),sourceSchema:Number(snapshot.schema)||0,fingerprint:'cloud:'+hash,payload:snapshot};
  await writeCanonicalMigration(legacyEnvelopeToCanonical(envelope),baseline);
}
