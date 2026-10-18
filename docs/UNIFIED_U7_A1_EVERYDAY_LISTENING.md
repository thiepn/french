# THIEPN French U7 — A1 Everyday Communication & Listening Foundations

## Source / stack

This U7 branch is a source-only draft stacked on U6 PR #30 **exact commit `d559d5be614a9e67a26b2658418475fa637281c9`**. U1–U6, main, production, native Learn, Review, learner Accounts, FSRS, SRS, CEFR and original progress/custody remain unchanged. All new lesson dialogue, vocabulary examples, teaching explanations, task keys and guided writing are independently authored original content, not copied from the restricted Carnet PDF/HTML or the French 2.2 textbook. The legacy 60-session positions remain indexed metadata only.

## Full new teaching inventory

| Lesson | New A1 topic |
|---|---|
| 13 | Food, drinks, partitives du/de la/de l’/des, ordinary negative de |
| 14 | Shopping prices, demonstratives and polite purchasing |
| 15 | Quantities, measures, de after kilo/litre, market requests |
| 16 | Restaurant seating, menu choices, drinks, bill |
| 17 | Weather phrases, seasons, adjusting a near-future plan |
| 18 | Housing, il y a, negative existence, furniture location |
| 19 | Transport, prendre, route numbers, transfers and timetables |
| 20 | Train arrival and hotel check-in, reservation and problems |
| 21 | Introductory recognition of direct object le/la/les, me/te |
| 22 | Invitations and polite acceptance/declining, vouloir/pouvoir |
| 23 | Service-desk questions, parcels, help and clarification |
| 24 | Original cross-topic A1 capstone — a day in France |

**U7 addition:** 12 complete original full lessons; 144 contextual lexical *entries* (duplicates across lessons are intentional), 60 original bilingual dialogue turns, 24 substantive grammar blocks each with worked contrast/correction, **120 original varied exercises** (10/lesson with cloze, multiple choice, reading and scrambled sentence tiles), 12 written-production assignments with criteria and worked models, and **24 original listening comprehension questions** grounded in those dialogues.

**Cumulative U6 + U7:** 24 complete A1 lessons; 288 contextual lexical entries; 120 original dialogue turns; 49 substantive grammar blocks; 240 graded-against-an-authored-answer **practice** exercises; 24 guided writing prompts; 36 listening questions (U6 reuses one previously authored reading comprehension question per lesson, U7 adds two independently authored listening questions per new unit).

## Working product integration

- Extends the **existing U6 five-stage learning engine** into six stages: Understand → Vocabulary → Read → **Listen** → Recall → Write. The Course route now introduces the 24 full A1 lessons first. Earlier U2/U3 micro-lessons, U4/U5 missions and metadata-only rights-restricted source positions are retained as secondary activities.
- `u7-a1-course.ts` composes U6's original 12 units (unaltered) and U7's 12 new units. `validateA1Units` accepts an optional desired count (default remains 12 to keep inherited U6 validation) while the complete A1 version requires 24. U7's independently authored source qualified IDs are `fru1:original@unified-u1-original-v1:session:u7-a1-NN` and do not overwrite U6 source IDs.
- Lesson selection, optional foundation suggestions, contextual grammar, translations, recall, original worked answer, writing and native navigation retain the existing user experience. The same route-local in-memory counters continue to be **practice only**, not SRS or CEFR.
- **Listening** uses the device's **browser SpeechSynthesis Web API**, with French locale `fr-FR`, an explicitly identified French voice when available, normal and slow playback, stop, selectable line-by-line replay, a French transcript initially hidden, and source-authored understanding questions with immediate explanations. If French TTS is unsupported, or a populated voice list has no French voice, playback is unavailable and users can still work with the original transcript. When a device doesn't expose any voice inventory, the UI transparently labels the voice as unverified. Playback is not a rights-cleared native speaker recording; synthesized accent and quality vary.
- The app does **not** request microphone access, capture audio, upload speech, evaluate pronunciation or assign a listening/speaking CEFR grade. TTS comprehension outcomes remain route-local and cannot write native progress. Playback is canceled on lesson/stage change and route abort.
- No approved new U7 lexical items are silently inserted into native SRS. Learners can explicitly navigate to the existing native Learn/Review system for already available qualified content.

## Focused verification, no broad CI/acceptance

- Focused in-session authored-content structural audit **PASS**: 12 added units, 144 new contextual entries, 60 new dialogue turns, 120 answer-keyed exercises, 24 teaching blocks, 24 original listening questions, sequence IDs, selection keys, sentence tile parity, explanation lengths and writing criteria. A malformed lesson-19 grammar source string was discovered and corrected in U7; the audit then passed.
- Focused in-session integration/source audit **PASS**: original U6 count contract preserved, 24-unit catalog wired, six-stage player, playback cleanup, opt-in original TTS/audio controls, transcript, native navigation and no broad CI script addition.
- `scripts/test-vnext-u7.mts` and `npm run test:vnext:u7` are **committed as an optional focused deterministic check but NOT EXECUTED**. It audits 24 lesson/custody contracts, original U6 invariants, per-unit question keys, 36 listening tasks, 240 exercises and absence of proficiency authority writes.
- **NOT_TESTED**: TypeScript `tsc` project typecheck, production bundle/build budget, Web Speech behavior on physical Android/iOS/desktop, full Chromium/WebKit/browser acceptance, voice availability, independent pedagogical review, human visual rights/source approvals, live-account or production integration. No CI workflow manually dispatched and changes use `[skip ci]`; no claim of production readiness.

## U8 proposed content-first direction

Continue with approximately 14 fully authored original A2 lessons, richer grammar (passé composé with avoir/être, reflexive past, imparfait and tense contrasts, pronouns, descriptive narration) and comprehension rooted in original reading/dialogue, including valid TTS where supported. Keep native learner rights/authority and lightweight source checks intact, with broad qualification consolidated later. No new checkpoint or review authority engines.
