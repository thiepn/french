# THIEPN French U40 — Canonical Vocabulary & Review Integration

## Parent and unchanged ownership
Stacked on U39 PR #66, head 2efbbad004cf8ded719af0496ff2a3f4b8e5924f, branch feature/unified-u39-practical-lesson-continuity. This is a separate child draft, not a main merge or P35 release.

## Implementation
- U40 read-only vocabulary crosswalk checks each U28 original-owned vocabulary expression against the bundled canonical vocabulary search index. French written form and English gloss (whole or exact semicolon-delimited clause) must match **exactly one canonical record**. Article+headword composition is allowed only when the canonical index carries the actual article. Unmatched, conflicting and ambiguous records are explicitly withheld; U28 source keys are not native note IDs. No generated note ID, invented sense number, silent card creation or fuzzy synonym-based promotion.
- The original Course Vocabulary step now first displays mapping coverage, actual authored French sentence context, canonical gloss and read-only native due/new/later/suspended state per matched word. One-click exact canonical Word detail uses a one-use in-memory navigation pointer, never persisted in SRS or local storage.
- Learners can explicitly begin a **lesson-scoped** native due/new session for only matched canonical notes. This uses the original learner database, FSRS records, existing due review ranking, global backlog pacing, the existing daily limits/mix/sibling spacing, native recognition record constructor and original active session writer. If an active session exists, U40 resumes it instead of overwriting queued work. The native Review route uses the existing grading, atomic answer persistence, Undo, 14-day Resume and scheduler. No independent grading or second scheduler is introduced.
- The native Words route resolves a one-use validated canonical ID from the already loaded index and opens exactly that real word record, with its canonical translations and read/listen/speak actions.
- Native Learn now disables replacement of an unfinished study session and rechecks existing work before starting Today/New. Resumption remains delegated to the existing Review screen. The Words loading message uses text nodes rather than interpolating indexed words as HTML.
- U40 never copies U28 recall correctness or private drafts to FSRS and never awards CEFR mastery. Introductory lesson text and canonical study records remain distinct even when linked.

## Explicit limitations
- Strong matching is still a conservative index-level written-form+gloss identity, not a linguist-verified historical sense equivalence. Inflected forms, near synonyms, alternate English definitions and multiple same-form same-gloss records deliberately abstain. A further editorial crosswalk is needed to expand actual coverage.
- Existing read/user card edits are owned by native content; the original Course witness remains original-owned and is not overwritten with canonical examples.
- The native session start is best-effort against concurrent tabs, not a new transactional cross-tab lock. A current session is rechecked before initiating one, but the legacy session writer itself does not compare-and-swap across tabs.
- A native review count and learning-state update can change after the U40 panel loads; remount Course for refreshed status.
- This phase does not resolve U41 French/English translation issues, full P35 native feature parity or device TTS quality.

## Qualification
Source-only implementation. No local build-capable checkout, TypeScript execution or browser acceptance was available through the connected GitHub API. Mark tests, browser/mobile and source-rights editorial sign-off **NOT_TESTED / release NO-GO** until exact-head qualification. P35 production untouched.

## U41 next
Fix source text accuracy, lesson translation vs summary labeling, answer-key meaning and editorial French naturalness; review ambiguous lexical crosswalk cases manually without invented approvals.
