# THIEPN French U4 — Guided Learning Journeys & Practice Intelligence

## Source lineage and containment

U4 is stacked directly on U3 draft PR #27, exact parent `e04b6a6c87d4ee957f94d2feafdc6c355050ee30`, itself on U2 #26, U1 #25 and B7 #23. Main, production P35 rollback, credentials, Account, FSRS, SRS, CEFR, native progress and prior draft branches remain untouched. No external license-uncleared Carnet lesson text, French 2.2 glosses or learner storage was copied.

## U3 release acceptance checked

U3 P35 run `38297810481` passed static plus Chromium desktop, Android Chromium, Firefox, desktop WebKit and iOS WebKit browser-local. The optional live-production job was skipped as intended. No observed P35 source regression required repair.

## Implemented

- **Four original connected journeys**: First conversations, Travel day, Tell your story, Practical appointments. Each is ordered by the 20 existing source-owned lessons and checked for a unique, acyclic prerequisite-complete sequence. Each stop opens its existing lesson; progress indicators are explicitly per-page **practice only** and do not lock content or claim mastery. A themed navigator and original course selector remain available.
- **Contextual remediation**: Answers are checked only against deterministic authored exercise solutions. Missed accents, word-order issues, negation, articles, verb constructions and other errors receive distinct local diagnostic cues. There are nine separately authored optional grammar transfer mini-exercises with their own feedback, which do not credit canonical progress.
- **Guarded writing feedback**: Existing source-qualified writing prompts gain local contextual checks about negative constructions, near-future forms, avoir-based passé composé and question markers; tips are heuristics and make no claim to grammatical completeness or proficiency scoring. A 4,000-character input limit keeps the check bounded.
- **Keyboard/mobile**: Keyboard arrows plus Home/End navigate lesson selector buttons, with visible focus. Journeys, practice inputs and checkpoint controls use accessible native controls and responsive layout; no animation is essential.
- **Optional local checkpoint**: Explicit download and file picker. The `thiepn-french-u4-local-practice-v1` schema includes only source-owned lesson exercise attempts (not free writing or imported textbook content). Export is bounded to 128 attempts, answer length 160 and JSON 64 KiB; import validates exact field sets, contiguous sequence, existing source-owned IDs, revision and deterministic curriculum fingerprint. Import rejects stale, forged, oversized or malformed files **atomically**. A valid file replays answers through current authored solutions to reconstruct only temporary practice display state.
- **Crucial trust boundary**: The non-cryptographic catalog fingerprint detects content drift, not forgery. The downloadable JSON is user-editable and **self-reported, not trusted evidence**. Any reconstituted counts must never promote CEFR, FSRS, mastery, payment, Account or other authoritative status. Imports are explicit and scoped to the current Course instance; leaving or reloading does not preserve this local practice context.

## Qualification

`scripts/test-vnext-u4.mts` checks journey prerequisite order, diagnostics, source authority, original remedial tasks, checkpoint correct/incorrect replay, source fingerprint, altered approval flags, unknown IDs, invalid sequences, stale content and atomic rejection. Existing `qualify:vnext` includes U0–U4 inherited regressions, typecheck, production build and startup budget. P37G browser acceptance includes course journey navigation, keyboard movement, a targeted remedial response and user-driven checkpoint export/restore/denial. Existing P37H production parity and P35 original release regressions remain required for review. No production migration, merge or deployment.

## U5 direction

Extend genuinely authored multi-step production tasks, session handoff between speaking/writing/reading routes and deeper error-adaptive review planning with transparent non-authoritative evidence. Do not relax rights qualification or canonical learning authority. Preserve implementation-first batching and draft stack discipline.
