# THIEPN French U14 — Independent B1+ Communication & Unseen Transfer

## Lineage and retained authority

U14 is a new **source-only child of U13 draft PR #37** at **exact commit `82d3496d9d6545528b53949a416594f04cab271d`**, retaining U12 #36, U11 #35, U10 #34, U9 #33, U8 #32, U7 #31, U6 #30, earlier draft material, main and production. No changes to authoritative FSRS/SRS, canonical vocabulary approval, CEFR credit, owner/Account custody, permissions, migrations, personal learner data, or Le Carnet/French 2.2 rights restrictions. All new content is independently written as original-owned `u14-transfer-NN`. The earlier 94 full original A1–B1+ lessons and all 15 U13 original transfer scenarios remain the same objects and retain their stable provenance.

## Content-first learner-facing development

U14 contributes **15 distinct original B1/B1+ integrated applied communication scenarios**, `transfer-16` through `transfer-30`, retaining the original **Understand → Vocabulary → Read → Listen → Recall → Write** player:

| Transfer | Original scenario and practical reasoning |
|---|---|
| 16 | Clarify two clinic appointment messages while distinguishing admin instructions from unverified medical assumptions |
| 17 | Review bicycle repair estimates, safety of use, approval and unresolved replacement costs |
| 18 | Facilitate a reading-club discussion using a fictional synopsis versus subjective personal review |
| 19 | Hand off remote work with unknown time zone, unfinished review and unassigned final approval |
| 20 | Plan a museum visit using general brochure versus temporary access notice |
| 21 | Coordinate community garden volunteer shifts, supply limits and actual ownership of duties |
| 22 | Explain an estimated energy bill without claiming an unapproved correction |
| 23 | Report a leaking window with observed facts, provisional technician visit and unknown repair scope |
| 24 | Explain supervised river-cleanup plans and restrictions following a weather-dependent safety update |
| 25 | Arrange an inclusive celebration with optional meal preferences and unconfirmed ingredient information |
| 26 | Present accurately attributed internship project work, prior narrative and still-pending recruitment decision |
| 27 | Compare neighborhood park budget proposals with incomparable up-front/maintenance cost estimates |
| 28 | Explain a historical exhibition discrepancy between an undated caption and dated opening record |
| 29 | Report partial restoration during a digital service outage without passwords or false promises |
| 30 | Integrate a public lecture invitation, provisional schedule, venue access and speaker's actual commitments |

**Substantial original U14 authoring inventory:**
- **15 complete original B1+ practical scenarios**, with 30 cross-level grammar teaching blocks using earlier independently authored A1–B1 bridges with worked examples and misconception-specific feedback;
- **180 original contextual French-English vocabulary entries**, **75 original extended bilingual dialogue turns**;
- **150 original varied answer-keyed recall exercises** (three passage-detail/inference, two cross-source, two grammar cloze, one original scrambled word order, two dialogue questions per scenario);
- **15 original three-paragraph connected French readings totaling 3,096 French words**, **45 reading comprehension/inference questions**, **30 independently written labeled source documents** and **30 comparative interpretation questions** with keyed detailed explanations;
- **45 original longer-dialogue inference questions** designed for the existing optional device/browser French TTS; three per scenario with transcript reveal, slow replay and original dialogue turns;
- **30 distinct extended guided independent written productions**: one dialogue/listening-to-writing summary and one paired-document synthesis per scenario, each with its own task, three review criteria and independently authored extended French model;
- **15 ungraded guided oral-response preparations** with three planning points and original French examples.

Content is authored specifically for these fictional, practical situations, not reused copyrighted material. Counts are **authoring inventory**, not distinct lemma totals, formal proficiency evidence or independent human content certification.

## Existing working architecture

- `u14-model.ts` adapts the existing original `authorA1Unit` contract and source provenance; no second lesson player or scheduler.
- `u14-course.ts` composes **94 untouched full original lessons + 15 U13 original transfer sessions + 15 U14 new scenarios**, giving **124 navigable practice units**. All remain under the same six original stages, practice-only ephemeral session responses, and original lesson navigation. A **Independent B1+** jump links to U14's first scenario.
- `u14-material.ts` extends the inherited original Read/Listen source catalogs to **72 connected readings** total (42 older B1, 15 U13, 15 U14). The existing `u10-reading-panel.ts` displays the new three-paragraph passage, two separately labeled independently written sources and five original reading/cross-source interpretation questions. It reuses the original answer checker and feedback.
- The existing `u7-listening-panel.ts` uses U14 data for **three** original comprehension questions per new dialogue. It preserves optional device TTS, transcript reveal, slow and turn replay, ungraded speaking preparation and an explicit no-pronunciation-grade warning.
- The original `u6-a1-panel.ts` Write stage now offers **two real choices** for U14: **listen and write a neutral summary**, or **compare two source documents**. Each mode displays its own prompt, criteria and original model; each **has its own temporary per-page draft key** so switching preserves the alternative draft. The learner can jump back to the relevant Listen or Read stage; neither is stored or graded outside the current Course session. Older lessons' writing behavior is retained.

## Checks, qualification and outstanding blocks

An in-session **focused static authored-source audit PASS** validated the fifteen distinct records, 30 teaching blocks, 180 contextual vocabulary entries, 75 bilingual turns, 150 main keyed exercises, reading and source keys, exact word-order token parity, 15 original readings (3,096 French words), 30 independent document excerpts, 30 cross-source questions, 45 listening questions, 30 distinct writing prompts/models, 15 oral models and source references from Course, Read and Listen, including the actual writing-mode selector. This is **source-level evidence**, not execution.

**NOT_TESTED:** TypeScript compilation, production build and performance budget, actual browser/mobile or voice acceptance, independent native-French educational review and final source-rights/release qualification. No CI, browser suites, paid services, migrations, merges, deployments, credentials or personal data were touched. The draft remains **NO-GO** for main/production until later consolidated acceptance.

## U15 content-first direction

Expand additional original multi-source discussion and production on new practical topics with genuine listening nuance, alternative defensible answers, useful error repair and longer independent narrative/argumentation. Continue refining the existing Course, Read, Listen and Write stages rather than building progress dashboards, shadow review stores or certification infrastructure.
