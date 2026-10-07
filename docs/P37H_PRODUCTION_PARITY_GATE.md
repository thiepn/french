# P37H — Production parity gate

P37H exists because the scalable runtime must not reach production merely because it is faster.

## What this tranche replaces

The P37A–G branch had functional Home, Learn, Review and Words routes, but Listen, Speak, Progress and Settings were still explanatory placeholders. P37H converts those four routes into real lazy-loaded workspaces:

- **Progress** reads canonical SRS/activity evidence on demand and exposes due work, 7/30-day accuracy, lifetime evidence, XP, combo, activity and skill mix.
- **Settings** persists daily workload, desired retention, grading mode, typed-answer preference, article strictness and sibling spacing in the canonical learner state.
- **Listen** builds a compact dictation set from recent learner vocabulary plus corpus fallback and uses the device French speech engine.
- **Speak** provides model playback, shadowing and capability-aware browser speech recognition with a no-recognition fallback.

None of these routes is imported into the startup bundle.

## Explicit non-cutover state

This tranche is **not** the production cutover. P35 remains production.

The remaining blockers are product parity, not startup architecture:

1. restore the authentic **Reading** workspace and its saved state,
2. port **THIEPN Account sync** and explicit local/cloud conflict resolution,
3. restore **backup/export/import/recovery** tools,
4. restore **offline/PWA** behavior without pre-caching the full corpus,
5. run whole-product P35→vNext parity acceptance and real-device qualification,
6. only then perform a reversible production cutover with the P35 commit preserved as rollback.

A fast runtime that removes those capabilities is not a valid release.
