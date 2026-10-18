# THIEPN French U9 — Original A2 Practical Independence

## Direct content-first lineage and boundaries

This work is a new isolated source-only branch from U8 stacked draft PR #32 **exact commit `6b151bd0948d42e434ee7b1d4ffa35c3f2744cf0`**, inheriting U7 #31, U6 #30 and earlier drafts unchanged. It **adds real independently authored teaching content**, not new checkpoint, Account, FSRS, CEFR, evidence or review engines. All new U9 content is original-owned `fru1:original@unified-u1-original-v1:session:u9-a2-NN`. No Carnet PDF/HTML or French 2.2 text bodies were redistributed, and no rights, proficiency or academic acceptance was certified.

## Original authored lessons (A2-15 to A2-28)

| Lesson | Central learning outcome |
|---|---|
| A2-15 | Accurate comparisons: plus/moins/aussi, meilleur vs mieux |
| A2-16 | Futur simple, conjugation endings and irregular future stems |
| A2-17 | Conditional present for polite questions, voudrais/pourrais |
| A2-18 | Real si + present conditions, alternatives and suggestions |
| A2-19 | Relative qui, que/qu’ and où, identifying grammatical roles |
| A2-20 | Elementary y/en: destinations, de-phrases and quantities |
| A2-21 | Shopping exchanges, size/defects, receipt and polite remedies |
| A2-22 | Transport bookings, transfer points, fare comparisons and itinerary changes |
| A2-23 | Relationships, understanding others and tentative advice |
| A2-24 | Housing malfunctions, descriptions and repair appointments |
| A2-25 | Professional email purpose, courteous register and confirmation |
| A2-26 | Work/study responsibilities, deadlines and realistic requests |
| A2-27 | Service complaints, clarification and distinguishing options from agreement |
| A2-28 | A2 practical capstone with comparisons, conditions, time and official confirmations |

**New U9 inventory:** 14 substantial lesson sequences, two original explanatory grammar blocks per lesson (**28**), original bilingual examples, specific wrong→correct→reason demonstrations, **168** original contextual vocabulary entries (12 per lesson; repeated words between lessons count as entries, not unique lemmas), **70** original bilingual dialogue turns (five per lesson), **140** genuinely authored varied answer-checked exercise items (ten per lesson with fill, multiple-choice, reading and clickable sentence-order formats), **14** original longer writing assignments with explicit criteria and model responses, and **28** original dialogue-grounded listening comprehension questions (two per lesson).

**Cumulative U6–U9 Course inventory:** **52 full authored lessons** (24 A1 + 28 A2), **624 contextual vocabulary entries**, **262 bilingual dialogue turns**, **105 grammar teaching blocks**, **520 original answer-keyed recall exercises**, **52 guided writing assignments** and **92 comprehension questions**. These totals do not imply CEFR certification or distinct dictionary lemmas.

## Working user-facing integration

- `u9-a2-model.ts` adapts the existing U6 full-lesson authoring/validation schema, assigning stable sequential `a2-15` through `a2-28` IDs and qualified independent `u9` provenance. U9 lesson 15 follows original U8 lesson 14 in the advisory prerequisite chain. All U6–U8 original source identities remain unchanged.
- `u9-course.ts` extends the original `u8-course.ts` catalog in the **same six-stage** Course: **Understand → Vocabulary → Read → Listen → Recall → Write**. No second lesson renderer, independent progress writer or grading engine. Existing per-page practice counts, answers and writing drafts remain temporary and non-authoritative.
- Course navigation now distinguishes **Start A1**, **A2 stories** and **A2 practical** as keyboard-reachable shortcuts within the same list, with an A2 practical section header at unit 15. The root Course correctly describes all 52 authored lessons while retaining U2–U5 supplementary micro-lessons, journeys and missions, plus rights-restricted legacy metadata.
- `u9-listening.ts` supplies 28 new contextually authored comprehension items to the **existing optional device/browser French speech synthesis** with slow/normal/line playback and on-demand transcript. These are not human audio recordings, cannot assess learner pronunciation and do not upload microphone data.
- Course lessons do **not** approve new vocabulary for the canonical SRS/FSRS/Account store, award CEFR level or change the native authoritative Learn/Review. Local answer correctness in a practice card is not verified proficiency.

## Focused verification and honest gates

- Focused in-session **source/structure audit PASS** over all 14 authored lessons, checking identity and order, minimum grammar depth and worked corrections, 12 contextual entries and five dialogue turns per lesson, ten differentiated exercise items with exact keys, four answer formats, usable sentence-order word tiles, 14 guided writing assignments, 28 U9 listening sets and the continuous 52-lesson Course/listener source wiring.
- `scripts/test-vnext-u9.mts` is committed as an **opt-in content-only test** (`npm run test:vnext:u9`) including original U8/A1 custody invariants; it is **NOT EXECUTED** and is **not** appended to broad `qualify:vnext`. No CI workflow was manually dispatched; commits use `[skip ci]`.
- **NOT_TESTED:** actual TypeScript compilation, bundled production build/size budget, browser/mobile TTS behavior, physical-device acceptance, content pedagogical review by a French-language instructor, translation rights review and release. Any release remains **NO-GO** until a later consolidated qualification and owner approval.

## U10 content-first continuation

Develop approximately 14 further full original B1 lessons within this same teaching architecture, focusing on richer opinions, structured explanations, contrast and cause, relative/conditional constructions, varied texts and meaningful writing. Preserve source ownership and canonical progress authority; avoid producing another layer of governance, reports or shadow learning engines.
