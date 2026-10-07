# P37H — Production parity gate

P37H exists because the scalable runtime must not reach production merely because it is faster.

## Completed in this branch

The merged P37A–G runtime had functional Home, Learn, Review and Words routes, while Listen, Speak, Progress and Settings were explanatory placeholders. This branch converts those routes into useful lazy-loaded workspaces and restores release-critical local infrastructure:

- **Progress intelligence** ports the core P5 decision model to vNext: catalog→introduced→recognition/production/balanced coverage, CEFR coverage, live FSRS recall, independent skill health, recognition→production gaps, review-pressure buckets, weakness ranking/repair causes, recent evidence and deterministic next actions.
- **Settings foundation** persists daily workload, desired retention, grading mode, typed-answer preference, article strictness and sibling spacing in canonical learner state.
- **P14 Reading + P15 pairing** is now native: the actual 25-text stable corpus (A1–B2) is extracted from preserved P35 data into a verified modular content pack; the Read route supports Extensive/Intensive/Targeted modes, mastery coverage, resume position, lookups, saved discoveries, exposure tracking, context retrieval, difficulty feedback, Word→Read targeting, Reading→Progress evidence, and direct Read↔Listen pairing. The paired listening path uses the selected reading's sentence segments without loading legacy runtime code.
- **P16 spoken production + native P12 transfer** now implements all four speaking modes with the stable 36-task P12 sentence corpus and shared deterministic sentence diagnosis. Spoken transfer uses accepted sentence families, contraction/preposition/order/missing-target/manual-ambiguity handling instead of a duplicate similarity grader. The speaking surface also has normal/slow model audio, temporary local recording/playback, coarse pace feedback, conservative optional recognition, Correct/Almost/Retry manual judgment, support-aware practice-only evidence, Read→Speak and Listen→Speak context bridges, Word→Speak targeting, and Progress spoken evidence. Raw microphone audio is never persisted.
- **Backup/recovery** exports every vNext IndexedDB store with a SHA-256 payload checksum, validates imports before mutation, performs one cross-store replacement transaction, and forces a pre-restore safety export from the UI.
- **Offline/PWA** restores installable metadata and generates a build-specific service worker. Shell and lazy route chunks are precached while the large vocabulary corpus remains on-demand and caches only as used.

These are functional foundations, **not yet a production-cutover claim**. P5 core progress intelligence, P14 Reading, P15 reading-aligned listening, and the P12-backed core of P16 are now represented natively in vNext. The remaining product-level blocker is THIEPN Account synchronization, followed by final parity/browser/device qualification.

None of these feature modules is imported into the critical startup bundle.

## Explicit non-cutover state

This branch is **not** the production cutover. P35 remains production.

Remaining release blockers:

1. port **THIEPN Account sync** to the current first-party account architecture with explicit local/cloud conflict resolution and guest-first behavior;
2. run whole-product P35→vNext migration/parity acceptance across preserved learner data, user content, evidence and scheduling;
3. run the five-engine browser/device matrix on the final candidate plus physical-device checks for installed-PWA, microphone/speech and mobile keyboard behavior;
4. only then execute a reversible production cutover with the P35 commit preserved as rollback.

The P35 runtime remains a data-compatibility source and rollback implementation, not a runtime dependency of vNext.
