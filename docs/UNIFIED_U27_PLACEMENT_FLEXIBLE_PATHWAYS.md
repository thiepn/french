# THIEPN French U27 — Optional Placement & Flexible Original Pathways

**Source-only implementation-first development.** Exact parent verified: U26 draft PR #53, `feature/unified-u26-contextual-grammar-repair`, SHA `472a29b331ef5d2f9844cabf77608c5b283434ca`. U27 exists on a separate U26-child branch and targets the U26 branch rather than `main`. P35 production and all earlier stacked changes remain unchanged.

## Implemented original placement experience

`app/src/core/unified/u27-placement.ts` assembles **up to six independently answerable original questions per learner-selected level**, across **five authored pathways** (A1, A2, B1, B1+, early B2):

- Four short contextual grammar items sourced from two existing original U26 grammar focuses, referencing the original authoritative lesson and its qualified source ID.
- Up to two source-text comprehension items: prefer original U23 connected reading and its unchanged independently authored keyed questions; where connected reading is unavailable, show the **original full French source dialogue** and an independently answerable original reading-type Course task. Never manufacture a reading answer or quote.
- The pathway/question source map is explicit, preserving the original authorial IDs and the existing key/explanation. Item counts depend on actual eligible source material; unavailable source questions are omitted.
- The original keyed response comparator `checkPracticeAnswer` is **reused** from U2. Exact key matches and specific U26 misconception replies are explained, but other natural French alternatives are *not* declared universally wrong. Reading multiple-choice options come from the exact original source.
- U27 holds original answers, skips, the selected level, confidence self-report and goal **only inside the mounted Course component**. No persistence, account sync, progress writers, grade promotion, CEFR certification or private text storage.

`app/src/routes/u27-placement-panel.ts` implements a complete optional learner-controlled flow:

1. Choose one of five original curriculum levels and a personal objective: balanced, grammar, reading, listening or independent writing; optionally self-report unfamiliarity or previous study.
2. Start the source-grounded short self-check **or bypass it entirely** and open the chosen level/first original lesson.
3. Read a clearly attributed original French passage/dialogue or contextual grammar cue and respond independently. Learners may disclose hints, choose their subjective confidence, compare to the original authored key, skip, move back, and revise.
4. Review session-only keyed matches, nonmatches, skipped and self-reported uncertainties, with each source ID, written explanation and example key. **The numbers are descriptive comparisons, not a normalized score, CEFR level, diagnostic certificate or mastery evidence.**
5. Choose source-linked optional entries: weak/uncertain question's original lesson, authored prerequisite chain, first lesson of selected level, compatible original reading/listening/writing lesson for the user's goal, or next original lesson. Each choice opens a real U23 original course ID or existing U23 memory-only Read/Listen/Write handoff.
6. Return to earlier questions, switch level, choose a different goal, discard all temporary answers, or switch to the existing authoritative scheduled native Review. No level is locked and no learning progression is automatically promoted.

## Source-backed prerequisite and route integration

- `originalPlacementPrerequisites(id)` walks only **existing U23 original Course prerequisite IDs** (up to three) and labels these as authored recommendations rather than blocked gates. The Course header now offers direct **Review suggested foundations** links for the selected lesson, without altering progress.
- `originalPlacementEntries` uses actual authored source/available material, the learner's explicit goal, skipped/uncertain/key-nonmatching examples, original authored pathway first IDs and original next-lesson adjacency. It never labels the result an official placement or claims an inferred CEFR outcome.
- `app/src/routes/u6-a1-panel.ts` integrates the diagnostic as a compact, **opt-in disclosure**, with a direct **Find my starting lesson** link from the original Start/Continue area. Entry via placement navigates to the exact original Course unit and keeps the Course's existing U24 checkpoint/write and original temporary draft boundaries. Separate Read/Listen/Write transitions wait until the existing unsent-draft navigation warning is accepted, then use the same U23 one-use in-memory handoff.
- `app/src/routes/u27-placement-panel.css` and `app/src/routes/unified-u6.css` provide real text-source display, responsive source preview, keyboard-focused controls, 44px minimum action height, clearly labeled forms and meaningful in-document status feedback.

## Authority and privacy constraints

**No new DB stores or featureState keys.** No duplicate progress engine, diagnostic master score, new SRS/FSRS/CEFR grade, new Account writer, automatic CEFR promotion, private-essay persistence, generated source material or fabricated official HSK/DELF certification. The U27 component state is discarded on unmount and page refresh. U24 navigation-only checkpoints are a distinct, explicitly opted-in authority; U27 never automatically creates or deletes one. Source-qualified original identities and rights remain inherited unchanged.

The five pathway labels organize existing authored A1–early-B2 teaching; they are **not official proficiency certifications**. A learner can choose any pathway directly regardless of the brief diagnostic. A keyed mismatch can reflect a wrong choice *or* another valid French wording the narrow author key does not support; feedback communicates this limitation.

## Exact U27 source changes

- Added `app/src/core/unified/u27-placement.ts` (source assembly, authored key comparison, descriptive result, prerequisite/entry recommendations).
- Added `app/src/routes/u27-placement-panel.ts` (full transient learner experience).
- Added `app/src/routes/u27-placement-panel.css` (responsive and keyboard presentation).
- Modified `app/src/routes/u6-a1-panel.ts` (original Course entry, handoff integration, authorial prerequisite links).
- Modified `app/src/routes/unified-u6.css` (prerequisite and entry presentation).
- Added this documentation file.

## Deliberately deferred

**NOT_TESTED:** No TypeScript compilation, runtime/browser checks, tests, builds, GitHub Actions/CI, mobile-device accessibility acceptance, French editorial/linguistic review, canonical Account round-trip, original-content rights audit, P35 parity assessment or production verification was performed. The original authored source counts, qualified IDs and diagnostic item assembly are **source declarations**, not verified executable acceptance outcomes.

**Release NO-GO.** This is a stacked implementation branch, not a completed production release. Main, P35, historic branches and all draft stacks are preserved. No migrations, merges, deployments, credentials or paid services initiated.

## Proposed U28 — Source-Aware Vocabulary and Recall

Continue directly from final U27 source commit on a distinct U27-child development branch and stacked draft PR. Build substantial learner-facing contextual vocabulary journeys drawing from the U23 original 244-unit curriculum, U26 grammar distinctions and U27 goal-driven entry points; introduce natural phrase families, collocations, register, audio/TTS-aware pronunciation prompts, source-specific misconception repair, independent recall and reading/listening/writing transfer. Integrate with **existing native** SRS/FSRS review authorities without shadow scheduling, mastery inflation, historical ID rewrites, automatic draft persistence, copied rights-restricted text or production activation. Follow implementation first and the user's explicit exclusion of tests/builds/CI/audits until later authorization.
