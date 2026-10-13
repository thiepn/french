# THIEPN French U11 — B1 Reading Depth & Independent Expression

## Isolated source-only lineage

The U11 draft is stacked **exactly** on U10 draft PR #34 at `d9b700889d67ba8c53e632e0935337a79cd83616`, retaining U9 #33, U8 #32, U7 #31, U6 #30 and earlier drafts. The existing 66 full original A1–B1 lessons, all source-qualified lesson IDs, main, production, Account/FSRS/SRS/CEFR and native Learn/Review remain untouched. U11 adds original source-owned `u11-b1-15` through `u11-b1-28` content; rights-limited Carnet and French 2.2 sources remain metadata-only. No synthetic CEFR test credit or shadow progress writer is introduced.

## Substantial original B1 teaching content

| Lesson | Genre and learning objective |
|---|---|
| B1-15 | Public notices: scope, exceptions, effective dates, requirements |
| B1-16 | Email correspondence: receipt, pending requests, respectful follow-ups |
| B1-17 | Forum discussion: testimonies, generalized claims and counterexamples |
| B1-18 | Biographical profiles: motivation, past sequence and attribution |
| B1-19 | Interviews: quotations, conditional claims and headline limitations |
| B1-20 | Explanatory articles: step sequencing, gerund, passive constructions |
| B1-21 | Practical reviews: observed features, subjective opinion and conditional recommendations |
| B1-22 | Troubleshooting instructions: real conditions, observed results and safe escalation |
| B1-23 | Scheduling negotiations: competing constraints and unconfirmed agreements |
| B1-24 | Travel diary: earlier plans, actual disruptions and measured reflections |
| B1-25 | Survey interpretation: percentages, percentage points and causal limitations |
| B1-26 | Meeting minutes: decisions, proposals, ownership and pending tasks |
| B1-27 | Persuasive formal letters: thesis, concession, proportionate request |
| B1-28 | Independent B1 capstone: cross-source synthesis, evidence attribution and actionable conclusions |

**Genuinely authored U11 inventory:** 14 complete original full B1 lessons, each with two rigorous original grammar teaching sections (28 total) including original bilingual worked examples, specific misconception corrections and reasons; twelve contextual French/English vocabulary entries (168 entries; not all distinct lemmas); five original extended bilingual dialogue turns (70 turns); ten different answer-keyed cloze, choice, reading and sentence-order recall tasks with feedback (140 tasks); independently authored longer writing prompts, three or more criteria and complete model responses (14 writing assignments). All 14 lessons also contain **one distinct three-paragraph original French reading** of **211–237 words**, totaling **3,121 French words**, with **three evidence-based explicit/inference/synthesis checks each (42 questions)**; and two original comprehension questions on the original dialogue for optional device-TTS listening (28 listening questions).

**Cumulative original U6–U11 curriculum:** 80 full lessons (24 A1, 28 A2, 28 B1), 960 contextual vocabulary entries, 402 bilingual dialogue turns, 161 grammar blocks, 800 original answer-checked recall tasks, 80 guided writing assignments, 148 original dialogue listening questions; 28 longer B1 readings with 70 dedicated reading questions and 4,768 French words. Earlier micro-lessons and missions remain separately available as supplementary practice. These counts are authored inventory, **not formal CEFR achievement or independent learner success**.

## Working integration in the existing Course

- `u11-course.ts` composes all 66 untouched U6–U10 lessons and the new B1-15–28 sequence. Existing original unit/source identifiers stay intact. A B1 depth jump and an additional section header extend the current lesson navigation. The existing six-stage player remains **Understand → Vocabulary → Read → Listen → Recall → Write**, with temporary per-page practice state and existing answer checking.
- `u11-readings.ts` extends the existing U10 Read-stage source catalog from 14 to 28 B1 readings, and the existing `u10-reading-panel.ts` is updated **in place**, not duplicated. Every new reading has three paragraphs and three author-checked questions, using the existing accessible select/feedback interface. Wrong interpretations receive specific evidence explanations; answers remain local-only practice.
- `u11-listening.ts` adds 28 original dialogue-based listening comprehension questions to existing **optional browser/device-generated French TTS**, using inherited normal/slow/line replay, transcript controls and explicit warnings about voice availability. This is **not human recorded audio** and does not collect audio, assess pronunciation, award native grade or write to FSRS/SRS/CEFR/Account.
- None of these new lesson vocabulary entries are silently approved or pushed into native Learn/Review. No credentials, production data or canonical learner records accessed.

## Evidence and blockers

- Focused **source-level audit PASS** in the U11 branch for lesson identity/order, 14 full content records, 28 grammar blocks, 168 contextual vocabulary entries, 70 extended dialogue turns, 140 varied tasks, exact choice keys and sentence-order token parity, 14 writing assignments, fourteen 211–237-word three-paragraph readings (3,121 words), 42 reading checks, 28 dialogue listening items and Course/Read/listening source links.
- Committed optional `npm run test:vnext:u11` in `scripts/test-vnext-u11.mts`; this script **has not been executed** and was not added to `qualify:vnext`. Changes are committed with `[skip ci]`. No manual CI workflow triggered.
- **NOT_TESTED:** actual TypeScript compilation, production build and gzip budget, runtime UI/browser mobile usability, French device-voice behavior, learner Account/RLS access, native-speaker pedagogical review, comprehensive IP clearance and production release. No release certification or qualification is claimed. **NO-GO** for main/production until later consolidated authorization and acceptance.

## U12 proposed content-first continuation

Continue within the **same** six-stage course with substantial independently authored B1/B1+ modules emphasizing authentic-length dialogic listening scripts, perspective-taking, speech-to-writing transfer without fabricated speaking grades, structured multi-text composition, contextual recall and practical autonomous communication. Avoid creating another progress engine, workflow gate or proof machinery.
