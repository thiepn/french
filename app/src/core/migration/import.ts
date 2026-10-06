import type { HydratedLearnerState } from '../storage/hydrate';
import { readMigrationValue, writeMigrationValue, writeMetaValue } from '../storage/idb';
import { readLegacySnapshotEnvelope } from './legacy-reader';
import { legacySummary } from './legacy-summary';
import type { LegacySnapshotEnvelope } from './legacy-contract';

const IMPORT_KEY='legacy-import-v1';
const IMPORT_SUMMARY_KEY='legacy-import-summary-v1';

export async function importLegacyStateOnce():Promise<HydratedLearnerState|null> {
  const existing=await readMigrationValue<LegacySnapshotEnvelope>(IMPORT_KEY);
  if(existing?.schema==='thiepn-french-legacy-import-v1'){
    return legacySummary(existing.payload);
  }

  const envelope=await readLegacySnapshotEnvelope();
  if(!envelope) return null;

  // The original P35 stores are intentionally never modified or deleted.
  await writeMigrationValue(IMPORT_KEY,envelope);
  const summary=legacySummary(envelope.payload);
  await writeMetaValue(IMPORT_SUMMARY_KEY,summary);
  await writeMetaValue('legacy-import-fingerprint-v1',envelope.fingerprint);
  return summary;
}
