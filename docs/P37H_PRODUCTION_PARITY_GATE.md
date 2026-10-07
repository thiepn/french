# P37H — Production parity gate

P37H exists because the scalable runtime must not reach production merely because it is faster.

## Completed in this branch

The merged P37A–G runtime had functional Home, Learn, Review and Words routes, while Listen, Speak, Progress and Settings were explanatory placeholders. This branch converts those routes into useful lazy-loaded workspaces and restores release-critical local infrastructure:

- **Progress intelligence** ports the core P5 decision model to vNext: catalog→introduced→recognition/production/balanced coverage, CEFR coverage, live FSRS recall, independent skill health, recognition→production gaps, review-pressure buckets, weakness ranking/repair causes, recent evidence and deterministic next actions.
- **Settings foundation** persists daily workload, desired retention, grading mode, typed-answer preference, article strictness and sibling spacing in canonical learner state.
- **Contextual listening evidence** now implements core P15 semantics over native vocabulary example sentences: Comprehensible/Intensive/Targeted modes, 0.78×/1.00×/1.08× playback, progressive transcript→translation support, first-listen classification, aural error taxonomy, practice-only evidence that cannot move SRS, delayed independent retest, Word→Listen targeting, connected-speech cues, and Progress evidence.
- **Spoken production foundation** now implements P16's four-mode shape: Pronunciation, Shadowing, Spoken recall and Spoken transfer; temporary local microphone recording/playback; explicit recording cleanup; optional conservative speech recognition; manual self-assessment; support-aware practice-only evidence; Word→Speak targeting; and Progress spoken evidence. Recognition is explicitly not an accent score.
- **Backup/recovery** exports every vNext IndexedDB store with a SHA-256 payload checksum, validates imports before mutation, performs one cross-store replacement transaction, and forces a pre-restore safety export from the UI.
- **Offline/PWA** restores installable metadata and generates a build-specific service worker. Shell and lazy route chunks are precached while the large vocabulary corpus remains on-demand and caches only as used.

These are functional foundations, **not claims of complete P35 feature parity**. The stable product still contains deeper capabilities that must be deliberately ported or superseded, including P14 reading and Read↔Listen pairing, P15's original 19-reading aligned/dialogue corpus layer, P16's original P12-backed transfer/calibration depth, account synchronization, and related cross-surface integrations. P5's core decision/intelligence surface is now represented natively in vNext.

None of these feature modules is imported into the critical startup bundle.

## Explicit non-cutover state

This branch is **not** the production cutover. P35 remains production.

Remaining release blockers:

1. rebuild the authentic **P14 Reading** corpus/workspace and saved-state semantics as native modular content rather than importing the old monolith;
2. finish the remaining **P15 pairing/dialogue layer** after P14 exists and reconnect **P16 spoken transfer to the future native P12-style sentence/transfer engine**, then calibrate the final speaking evidence contract;
3. port **THIEPN Account sync** to the current first-party account architecture with explicit local/cloud conflict resolution and guest-first behavior;
4. run whole-product P35→vNext migration/parity acceptance across preserved learner data, user content, evidence and scheduling;
5. run the five-engine browser/device matrix on the final candidate plus physical-device checks for installed-PWA, microphone/speech and mobile keyboard behavior;
6. only then execute a reversible production cutover with the P35 commit preserved as rollback.

The P35 runtime remains a data-compatibility source and rollback implementation, not a runtime dependency of vNext.
