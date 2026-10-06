# P37B — Stable Data Migration Contract

P37B defines how vNext inherits P35 learner data without inheriting the P35 runtime.

## Authority order

The preferred stable source is:

- IndexedDB database: `french3000-depth-v31`
- database version: `1`
- object store: `kv`
- key: `app-state`
- base snapshot version: `3.6.9`
- base snapshot schema: `13`

The final P35 snapshot is richer than the original schema-13 base because later phases wrap `depthStateSnapshot()` and append their own normalized state.

The current stable snapshot may therefore include:

- `progress`
- `settings`
- `reviewLog`
- `studyDays`
- `profile`
- `mistakeLog`
- `customDecks`
- `sessionHistory`
- `studyPlan`
- `userCards`
- `cardEdits`
- `smartDecks`
- reading/listening/speaking/conversation state
- functional mission and communicative curriculum evidence
- open-world and adaptive orchestration/composition state
- longitudinal mastery state
- CEFR promotion state
- remediation state
- functional benchmark state
- B2 open-production/capstone/oral state

## LocalStorage fallback

If the authoritative depth snapshot is unavailable, vNext reconstructs a preservation snapshot from the stable localStorage keys.

This fallback includes the base learner/SRS keys and the phase-owned state keys such as:

- `french3000-progress-v2`
- `french3000-settings-v2`
- `french3000-review-log-v3`
- `french3000-study-days-v3`
- `french3000-profile-v1`
- `french3000-user-cards-v1`
- `french3000-card-edits-v1`
- `french3000-smart-decks-v1`
- `french-cefr-progression-v1`
- the current reading/listening/speaking/conversation/mission and B2 evidence keys

The fallback exists for resilience. IndexedDB `app-state` is preferred because it is the most complete stable snapshot.

## Import rule

P37B performs a **preservation import**, not a destructive migration.

1. Read P35 data.
2. Build a `thiepn-french-legacy-import-v1` envelope.
3. SHA-256 fingerprint the preserved payload when Web Crypto is available.
4. Save the envelope in vNext IndexedDB database `thiepn-french-vnext`, store `migration`, key `legacy-import-v1`.
5. Derive only a tiny boot summary for immediate vNext use.
6. Leave every P35 localStorage key and IndexedDB database unchanged.

The full preserved envelope becomes the input fixture for P37C's canonical learner-state conversion.

## Rollback guarantee

Until P37H production cutover is field-qualified:

- vNext never deletes P35 storage;
- vNext never rewrites P35 storage;
- vNext never changes `french3000-depth-v31`;
- vNext keeps its own database namespace.

A user can therefore return to the P35 runtime without vNext having destroyed the stable copy.

## Summary derivation

Before P37C exists, vNext derives only non-authoritative display data from the preserved payload:

- due item count from persisted progress;
- study streak from persisted study-day keys;
- highest consecutively earned CEFR promotion from `v5160Progression`.

No SRS interval or progression evidence is recalculated during this preservation phase.

## P37C handoff

P37C must convert the preserved legacy envelope into a clean canonical schema with explicit domain models and migration tests.

The preserved P35 payload remains available as a rollback/audit source even after canonical conversion succeeds.
