import type { HydratedLearnerState } from '../storage/hydrate';
import type { LegacySnapshotEnvelope } from '../migration/legacy-contract';
import { legacySummary } from '../migration/legacy-summary';
import { legacyEnvelopeToCanonical } from './from-legacy';
import { initializeCanonicalMigrationIfAbsent } from './repository';
import { readLearnerSummary } from '../storage/idb';

export async function migrateLegacyEnvelopeOnce(envelope:LegacySnapshotEnvelope):Promise<HydratedLearnerState>{
  // Never reimport or reset vNext work because P35 changed in another tab.
  // Ownership is checked atomically in the same transaction as first import.
  const canonical=legacyEnvelopeToCanonical(envelope);
  await initializeCanonicalMigrationIfAbsent(canonical);
  const existing=await readLearnerSummary();
  return existing.currentLevel!==undefined||existing.dueCount!==undefined||existing.streakDays!==undefined
    ?existing:legacySummary(envelope.payload);
}
