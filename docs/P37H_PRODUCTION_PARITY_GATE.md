# P37H — Production parity gate

P37H exists because the scalable runtime must not reach production merely because it is faster.

## Completed in this branch

The merged P37A–G runtime had functional Home, Learn, Review and Words routes, while Listen, Speak, Progress and Settings were explanatory placeholders. This branch converts those routes into useful lazy-loaded workspaces and restores release-critical local infrastructure:

- **Progress foundation** reads canonical SRS/activity evidence on demand and exposes due work, 7/30-day accuracy, lifetime evidence, XP, combo, recent activity and skill mix.
- **Settings foundation** persists daily workload, desired retention, grading mode, typed-answer preference, article strictness and sibling spacing in canonical learner state.
- **Listen foundation** provides compact French dictation from recent learner vocabulary plus corpus fallback using device speech synthesis.
- **Speak foundation** provides model playback, shadowing and capability-aware browser speech recognition with a no-recognition fallback.
- **Backup/recovery** exports every vNext IndexedDB store with a SHA-256 payload checksum, validates imports before mutation, performs one cross-store replacement transaction, and forces a pre-restore safety export from the UI.
- **Offline/PWA** restores installable metadata and generates a build-specific service worker. Shell and lazy route chunks are precached while the large vocabulary corpus remains on-demand and caches only as used.

These are functional foundations, **not claims of complete P35 feature parity**. The stable product still contains deeper capabilities that must be deliberately ported or superseded, including P5 vocabulary intelligence, P14 reading, P15 contextual listening/support-aware evidence, P16 spoken-production modes/evidence, richer progress actions, account synchronization, and related cross-surface integrations.

None of these feature modules is imported into the critical startup bundle.

## Explicit non-cutover state

This branch is **not** the production cutover. P35 remains production.

Remaining release blockers:

1. rebuild the authentic **P14 Reading** corpus/workspace and saved-state semantics as native modular content rather than importing the old monolith;
2. complete **P5/P15/P16 deep parity or deliberate replacements** for progress intelligence, contextual listening evidence, speaking/recording/spoken recall/transfer, and their cross-surface bridges;
3. port **THIEPN Account sync** to the current first-party account architecture with explicit local/cloud conflict resolution and guest-first behavior;
4. run whole-product P35→vNext migration/parity acceptance across preserved learner data, user content, evidence and scheduling;
5. run the five-engine browser/device matrix on the final candidate plus physical-device checks for installed-PWA, microphone/speech and mobile keyboard behavior;
6. only then execute a reversible production cutover with the P35 commit preserved as rollback.

The P35 runtime remains a data-compatibility source and rollback implementation, not a runtime dependency of vNext.
