# THIEPN French U24 — Recoverable Original Learner Work and Draft Transitions

**Source-only implementation on a separate U23-child branch.** Verified exact U23 draft PR #49 head `245de05ab56335bc20907916d4627f19d890b650`, base `feature/unified-u23-course-material-registry`. Neither the parent U23 branch nor earlier draft PRs, `main`, P35 production or Account authorization have been changed.

## Actual implemented continuity

- One small canonical owner-native feature entry: `CanonicalLearnerStateV1.featureState.vU24OriginalCourse`. This **reuses the existing learner IndexedDB store and backup/account mechanisms**; no separate checkpoint database, shared browser-storage key, scheduler, progress ledger, shadow authority or new cloud writer.
- **Explicit opt-in to remember navigation** in the original Course. After choosing *Remember my lesson position*, subsequent original lesson/stage/question navigation writes only source-qualified lesson identity, source revision, source-content fingerprint, original task identity, stage, question index, timestamp, and opaque CAS token. The stored object is labeled `navigationOnly: true` and does not count as independently verified practice.
- **Visible resume/discard/replace/review options** on the Course workspace. A return visit does not automatically jump into a saved lesson or overwrite it: the learner explicitly chooses *Resume saved lesson*, *Save this position instead* or *Discard saved position*. A paused checkpoint retains the last successfully saved location without continuing automatic saves.
- **Source-scoped revalidation** before resume: existing original registry identity, original-owned qualified source ID, source revision, exact task ID, task-index bounds, lightweight authored-content fingerprint, acceptable time bounds (90 days) and a recognized schema. Expired, missing or changed material never auto-resumes. The digest detects source changes but is not a cryptographic authenticity proof.
- **Atomic transactional compare-and-set** for U24 writes within the original learner store, using the token from the last reviewed state. A newer token from another tab causes a conflict and blocks destructive overwrite. The original learner state is updated as one transaction with all unrelated feature keys preserved. This uses no review, SRS, activity or grading writer.
- **Non-destructive recovery from errors:** if device storage is unavailable or save fails, Course remains usable without claiming the checkpoint was persisted. On conflict, automatic checkpoint updates stop and the UI requires a fresh review. Explicit discard with a valid reviewed token can also clear an unsupported/corrupt checkpoint; opaque unrecognized records without a usable token are not silently overwritten.
- **Return affordances:** Home notices the presence of a saved original Course location without eagerly loading the curriculum, linking into Course for actual source and owner-state review. The shared original Read/Listen/Write panel offers a *Review Course resume choices* handoff without implicitly resuming.
- **Writing privacy and draft transitions:** the existing original Course and supplemental practice drafts stay within page memory. Cross-workspace departure with unsent text prompts before losing the draft; browser unload requests a standard browser warning when supported. The checkpoint never contains essay text, answers, transcripts, recordings, scoring evidence, pronunciation claims, learner identity or saved draft snapshots.

## Implementation boundaries

The 244 original authored Course units, 192 connected reading references, lesson/grammar/source IDs, existing original adapters, typed graded native FSRS/SRS review, canonical CEFR gate and THIEPN Account ownership remain unchanged. The U24 position is a navigation bookmark, **not a replacement for the native study session**, independent exercise completion, validated proficiency, writing feedback or mastery.

The existing canonical `replaceCanonicalFeatureState` helper and unrelated legacy writers are not rewritten here. U24's own writes are atomic and compare the reviewed U24 token; this phase does not claim a global multi-writer Account synchronization or live two-device acceptance guarantee.

Resuming an original practice stage does **not** restore previous answer selections, revealing/hint usage, incomplete word order, spoken playback position or unsent free text. That is deliberate: the stage/question pointer survives, while private content and session-only exercise correctness do not. The page-save feature can become available only after the learner opts in on a device with working canonical storage.

## Deferred acceptance

**NOT_TESTED:** No TypeScript compilation, build, CI, tests, browser/mobile acceptance, native Account or cloud acceptance, P35 parity verification, physical speech/microphone checks, migration, deployment, release qualification or production modification were run. This is substantial committed source functionality, **release NO-GO** until later authorized consolidated qualification.

## U25 handoff — Learning-First Course Navigation

Next, simplify native original Course access and returning-user wayfinding: clear Start/Continue entry, compact level-based pathways, grouped section discovery, contextual upcoming material, quick daily study entry and coherent mobile navigation. Reuse the U23 source registry and U24 checkpoint; avoid grading inflation, redundant controls, new learner databases or broad test gates.
