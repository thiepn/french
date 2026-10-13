# THIEPN French U15 — Autonomous B1+ Argumentation, Listening Nuance & Production

## Scope and exact stack

This source-only phase begins directly at U14 draft PR #38 **exact commit `8363dc58f588f9d9d01c30dad731f6a2baa27a7c`**. The U15 development branch is stacked on `feature/unified-u14-b1-independent-unseen`, leaving all earlier drafts (U13 #37, U12 #36, U11 #35, U10 #34, U9 #33, U8 #32, U7 #31, U6 #30 and earlier), `main` and production unchanged. No migrations, credentials, Account/FSRS/SRS/CEFR changes, paid API usage or real learner-record writes.

## Fifteen implemented original practical B1/B1+ scenarios

| Original unit | Subject and genuine communicative transfer |
|---|---|
| transfer-31 | Neighborhood noise mediation: observations, unknown cause, compromise |
| transfer-32 | Secondhand laptop: competing condition claims and evidence-based purchase |
| transfer-33 | Student research: proper source attribution and correlation versus causation |
| transfer-34 | School crossing: witness reports versus a municipal consultation proposal |
| transfer-35 | Shared rehearsal room: contested slots, approvals, and fair allocation |
| transfer-36 | Outdoor cinema: probabilistic weather, unconfirmed fallback and official decision |
| transfer-37 | Food surplus: a proposed donation, stock checks and responsible communication |
| transfer-38 | Arts grant: published criteria versus unapproved application receipt |
| transfer-39 | Local journalism: a corrected closure duration and the remaining facts |
| transfer-40 | Packaging: incomplete weight versus life-cycle environmental comparisons |
| transfer-41 | Language exchange: pragmatic ambiguity, clarification and respectful boundaries |
| transfer-42 | Remote work: after-hours messages, response expectations and team agreement |
| transfer-43 | Volunteer mentoring: skill/need matching, learner consent and unconfirmed allocation |
| transfer-44 | Oral history: interview participation versus separate public-audio permission |
| transfer-45 | Independent policy capstone: an equitable community learning room, evidence and conditional decisions |

**Original U15 content inventory:** 15 source-owned `transfer-31`–`transfer-45` B1+ scenarios; 30 applied grammar teaching instances using previously authored original grammar bridges; 180 original French-English contextual vocabulary entries (not necessarily distinct lemmas); 75 original bilingual dialogue turns; 150 source-exact varied answer-checked recall exercises including 3 passage questions, 2 comparative source questions, 2 cloze, 1 scrambled reconstruction and 2 dialogue checks per scenario; 15 separate original three-paragraph connected readings (**3,177 French words; minimum 198 words per passage**); 30 separately identified original source texts and 30 independent cross-document comprehension questions; 60 original four-per-dialogue comprehension and intention questions designed for optional browser/device speech synthesis; **45 separate long-form written production prompts and original French models** (per scenario: dialogue-to-writing, source-comparison synthesis, and recommendation/counterargument), and 15 ungraded structured oral-response models.

Source content is independently written and uses the existing qualified `original-owned` `u15-transfer-XX` teaching source IDs. No lesson bodies from rights-limited Le Carnet/French 2.2 are imported or redistributed.

## Functionality implemented within existing native architecture

- `u15-model.ts`, `u15-content-helper.ts` and content modules reuse `authorA1Unit`, the same answer checker, grammar teaching blocks and original source custody. The authoring adapter defines exactly three keyed passage questions, two keyed cross-source inferences, four keyed dialogue questions, two grammar clozes, one correct word-order reconstruction, and three substantially distinct original writing assignments per scenario. This is **content authoring**, not a duplicate assessment or mastery engine.
- `u15-course.ts` composes the prior 124 original units unchanged and appends the new 15 for **139 navigable original units = 94 full original A1–B1+ lessons + 45 U13–U15 additional practical transfer scenarios**. It adds a B1+ argumentation jump and section in the inherited Course.
- `u15-material.ts` extends existing original reading catalogs to **87 original longer connected B1/B1+ readings** (42 older B1 + 15 U13 + 15 U14 + 15 U15) and routes source comparisons and original listener questions through the original `u10-reading-panel.ts` and `u7-listening-panel.ts`. TTS remains clearly identified as optional device/browser synthesis, not a human recording or verified language grade.
- The **original Write stage** has a third working `fromDebate` option only for U15 scenarios. It joins the inherited source synthesis and listening-to-writing variants, each with a separate **ephemeral in-memory draft**, separate original prompt, self-assessment criteria, and independently authored model. No networked recording, retention, Account writer, FSRS enrollment, CEFR grading, or shadow progress system.
- Native Learn and Review remain authoritative and unchanged. This U15 branch introduces no new scheduler, account store, checkpoint, certification infrastructure, source-rights escalation, migrations or production state.

## Focused source-only check and release limits

**PASS:** focused static authored-source content audit of the 15 consecutive original IDs; 30 grammar teaching instances; 180 contextual vocabulary entries; 75 substantial bilingual turns; 150 varied recall items; original answer choices and worked explanations; scrambled-tile permutation parity; 15 three-paragraph original readings (3,177 French words); 45 reading questions, 30 source texts, 30 comparative questions, 60 listening questions; 45 original independent writing models, 15 oral models; and Course/Read/Listen/Write imports, 139-unit inherited catalog and third writing variant. Four initially short misconception explanations were expanded in committed source, and the focused audit then passed.

**NOT_TESTED:** TypeScript compilation, full production build, browser or mobile interaction, available French device voice quality, human native-French pedagogical review, full source/rights release approval, authentic learner acceptance and performance qualification. No manual CI was triggered. **Merge and production release remain NO-GO** until later consolidated verification and independent acceptance. Counts are source inventory, not verified CEFR proficiency or unique vocabulary lemmas.

## U16 handoff

Continue content-first in the existing six-stage Course: longer realistic B1/B1+ communication and narrative response work, harder unseen inference, open-ended conversation and argumentation with contextual misconception repair and specific original worked examples. Avoid parallel learning engines, dashboards, artificial credentials, and costly per-phase qualification detours.
