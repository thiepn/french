import type { HydratedLearnerState } from '../storage/hydrate';
import type { LegacySnapshotEnvelope } from '../migration/legacy-contract';
import { legacySummary } from '../migration/legacy-summary';
import { legacyEnvelopeToCanonical } from './from-legacy';
import { canonicalMigrationFingerprint,writeCanonicalMigration } from './repository';

export async function migrateLegacyEnvelopeOnce(envelope:LegacySnapshotEnvelope):Promise<HydratedLearnerState>{
  const current=await canonicalMigrationFingerprint();
  if(current===envelope.fingerprint)return legacySummary(envelope.payload);

  const canonical=legacyEnvelopeToCanonical(envelope);
  await writeCanonicalMigration(canonical);
  return legacySummary(envelope.payload);
}
