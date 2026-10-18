# THIEPN French U13 — Integrated A1–B1 Practical Communication & Cumulative Transfer

## Exact development lineage

U13 branches at **exact U12 draft PR #36 head `71a975dfad4a9342c2090107968acb3ff13463e0`** and stacks against the U12 development branch. All U11 #35, U10 #34, U9 #33, U8 #32, U7 #31, U6 #30, prior drafts, `main`, and production remain intact. The **94 full original lessons are preserved** with unmodified native lesson identities, and U13 adds fifteen original **integrated transfer scenarios** as supplementary sequential units `transfer-01`–`transfer-15` within the **same original six-stage Course**. The combined navigable practice sequence is **109 units (94 inherited full lessons + 15 integrated scenarios)**; these fifteen scenarios are not claimed to be formally CEFR-qualified additional lessons.

## Fifteen original integrated transfer scenarios

| Scenario | Multi-skill communicative purpose | Cross-source distinction |
| --- | --- | --- |
| 01 | Market shopping, quantities and partitive forms | Discount poster versus seller's actual conditions |
| 02 | Family invitation and future plans | Initial invitation versus revised proposed time |
| 03 | Clothing exchange and polite questions | Receipt versus case-specific stock reply |
| 04 | Travel timetable, delays and transport alternatives | Ticket schedule versus later station notice |
| 05 | Housing comparison and relative reference | Two listings with different cost disclosure |
| 06 | Restaurant booking, food and conditional availability | Sample menu versus unconfirmed reservation request |
| 07 | Lost property, past narratives and timeline | Personal report versus acknowledgment of filing |
| 08 | Festival invitation, object pronouns and future | Printed poster versus provisional online program |
| 09 | Registration and status reporting | Automatic receipt versus review procedures |
| 10 | Constructive service complaint and concession | General remedy policy versus individual support reply |
| 11 | Inclusive study-format recommendation | Current classroom schedule versus proposed remote option |
| 12 | Survey reasoning and evidence limits | Two percentages with unknown sampling methods |
| 13 | Volunteer-event planning and responsibility | Meeting minutes versus provisional invitation |
| 14 | Community rumor checking and source fidelity | Anonymous screenshot versus existing public opening hours |
| 15 | Integrated B1 community event capstone | Secretariat email versus unsigned event poster |

**U13 independently authored inventory:** 15 fully contextualized transfer sessions, 30 cumulative grammar teaching blocks selected from **15 new original A1–B1 grammar transfer explanations** with bilingual examples and misconception-specific feedback; 180 contextual French–English vocabulary entries (not necessarily unique lemmas); 75 original bilingual dialogue turns; 150 varied answer-keyed exercises (cloze, multiple choice, passage comprehension and word ordering), fifteen original **three-paragraph connected readings totaling 2,983 French words**, **45** original reading questions, **30** separate original attributed source excerpts (two per session), **30** further original cross-source interpretation questions with worked feedback, **30** original optional dialogue-TTS listening questions, **15** extended independent writing assignments with three or more review criteria and original models, and **15** independent ungraded oral-response preparation prompts with three planning steps and models. **105** additional source-/listening-based comprehension questions are distinct from the 150 main recall exercises.

## Learner-facing working source integration (no duplicate learning engine)

- `u13-course.ts` composes the original 94 full U6–U12 units by reference and appends 15 original `transfer-01`–`transfer-15` units. It reuses the inherited **Understand → Vocabulary → Read → Listen → Recall → Write** engine, original source-owned provenance, answer checker, session-only attempt counters and in-memory writing drafts. A **Integrated transfer** navigation shortcut and separate curriculum section enable direct entry.
- `u13-transfer-grammar.ts` introduces fifteen focused multi-level bridges that require an A1/A2 form to be used for a realistic B1 communicative purpose. No shadow grammar store, SRS, grade, or CEFR authority is created.
- `u13-material.ts` extends the original Read and Listen data contracts. In the **existing `u10-reading-panel.ts`**, each scenario now shows its original connected text, three source-grounded reading checks, *two separately labeled source documents* and two comparative inference questions, all checked with the **existing** `checkPracticeAnswer` and supported feedback; no new reading runner.
- The original `u7-listening-panel.ts` keeps optional device/browser French text-to-speech, slow and per-dialogue-turn playback and transcript reveal. Each scenario provides two original dialogue-grounded questions plus an ungraded oral preparation prompt with independent model. There is no microphone, recording, pronunciation scoring, hidden audio transmission or certified language proficiency claim.
- All source content is **new, original-owned** with `u13-transfer-NN` identities. No original Carnet or French 2.2 rights-restricted teaching bodies were accessed or redistributed. Native Learn/Review, FSRS, SRS, CEFR, Account records and their original ownership boundaries are untouched.

## Focused verification and release limits

**Focused, lightweight static source audit:** fifteen content records and exactly ordered source identities; thirty selected grammar blocks and fifteen original explanatory bridges; 180 contextual entries; 75 original dialogue turns; 150 answer-checked tasks; 15 three-paragraph reading texts (2,983 words), 45 reading questions, 30 two-source documents and 30 comparative questions; 30 listening questions; 15 extended writing models; 15 oral-response models; all choice and reading keys and word-order tile parity; and Course/Read/Listen source imports and branch wiring. One content audit identified five misplaced option fields and one nonidiomatic question; they were **corrected and committed**. An additional short grammar feedback rationale was expanded.

**NOT_TESTED:** TypeScript compilation, production build and gzip budget, browser/device performance, real device TTS, independent French language and teaching review, human source-rights and release acceptance. No manual CI workflows, broad tests, browser qualification, expensive services, deployment, migration, merge, credentials or personal learner data were used. This is **source development**, not a qualified production release, and remains **NO-GO**.

## U14 content-first continuation

Add original B1 and B1+ learner-facing training for spontaneous discourse, realistic independent response variation, mixed unseen transfer and contextual listening-to-writing. Consolidate existing lessons where useful; do not introduce certification-only gates, parallel schedulers or duplicate progress engines.
