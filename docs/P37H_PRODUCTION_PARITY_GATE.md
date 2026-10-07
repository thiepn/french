# P37H — Production parity gate

P37H exists because the scalable runtime must not reach production merely because it is faster.

## Completed in this branch

The P37A–G branch had functional Home, Learn, Review and Words routes, but Listen, Speak, Progress and Settings were still explanatory placeholders. P37H converts those four routes into real lazy-loaded workspaces:

- **Progress** reads canonical SRS/activity evidence on demand and exposes due work, 7/30-day accuracy, lifetime evidence, XP, combo, activity and skill mix.
- **Settings** persists daily workload, desired retention, grading mode, typed-answer preference, article strictness and sibling spacing in the canonical learner state.
- **Listen** builds compact dictation practice from recent learner vocabulary plus corpus fallback and uses device French speech synthesis.
- **Speak** provides model playback, shadowing and capability-aware browser speech recognition with a no-recognition fallback.
- **Backup/recovery** exports every vNext IndexedDB store with a SHA-256 payload checksum, validates imports before mutation, performs one cross-store replacement transaction, and forces a pre-restore safety export from the UI.
- **Offline/PWA** restores installable metadata and generates a build-specific service worker. The shell and all lazy route chunks are precached after first load while the large vocabulary corpus remains on-demand and is cached only as used.

None of these feature modules is imported into the critical startup bundle.

## Explicit non-cutover state

This branch is **not** the production cutover. P35 remains production.

The remaining blockers are now narrower:

1. restore the authentic **Reading** workspace and its saved-state semantics without importing the old monolith,
2. port **THIEPN Account sync** to the current first-party account architecture with explicit local/cloud conflict resolution,
3. run whole-product P35→vNext parity acceptance across the preserved learner-data contract,
4. perform physical-device qualification for installed-PWA, microphone/speech and mobile keyboard behavior,
5. only then execute a reversible production cutover with the P35 commit preserved as rollback.

The old P35 runtime remains a data-compatibility source and rollback implementation, not a runtime dependency of vNext.
