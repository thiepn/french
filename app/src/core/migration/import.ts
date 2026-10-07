import { readMigrationValue,writeMigrationValue,writeMetaValue } from '../storage/idb';
import { readLegacySnapshotEnvelope } from './legacy-reader';
import type { LegacySnapshotEnvelope } from './legacy-contract';

const IMPORT_KEY='legacy-import-v1';

export async function preserveLegacyStateOnce():Promise<LegacySnapshotEnvelope|null>{
  const existing=await readMigrationValue<LegacySnapshotEnvelope>(IMPORT_KEY);
  if(existing?.schema==='thiepn-french-legacy-import-v1')return existing;

  const envelope=await readLegacySnapshotEnvelope();
  if(!envelope)return null;

  // The original P35 stores are intentionally never modified or deleted.
  await writeMigrationValue(IMPORT_KEY,envelope);
  await writeMetaValue('legacy-import-fingerprint-v1',envelope.fingerprint);
  return envelope;
}
