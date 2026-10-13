# THIEPN French U12 — Original B1 Listening, Discussion & Independent Production

U12 continues on a **separate isolated source-only branch** from U11 draft PR #35 exact head `deb2519822ef47ab11ed24504ea2f3a8d2df3206`. All earlier draft sources, 80 prior original full lessons, `main`, production and the native Account / FSRS / SRS / CEFR / Learn / Review authorities remain unchanged. No new scheduler, shadow progress recorder, account writer, checkpoint or proficiency certification.

## Actual independently authored learning content

| Full lesson | Focus |
| --- | --- |
| B1-29 | Telephone appointment negotiation, proposals versus confirmed slots |
| B1-30 | Service complaints with observable defects and actionable remedies |
| B1-31 | Fair group discussion, competing views and consensus boundaries |
| B1-32 | Survey interpretation with denominators, percentage points and causal limits |
| B1-33 | Delayed journey, prior warning versus later cancellation and alternative routes |
| B1-34 | Interview listening, source attribution, speculative versus verified headlines |
| B1-35 | Personal storytelling with imparfait, passé composé, plus-que-parfait and reflection |
| B1-36 | Housing decisions under different price, fee and transport constraints |
| B1-37 | Practical study advice, autonomous recall and realistic feedback |
| B1-38 | Volunteer project presentation, accepted tasks and conditional feasibility |
| B1-39 | Fact-checking a circulating claim without asserting certainty or falsehood |
| B1-40 | Respectful intercultural hosting, genuine preferences and flexible itineraries |
| B1-41 | Resolving misunderstandings through clarification and correction |
| B1-42 | Integrated B1+ synthesis from notices, dialogue, testimony and open decisions |

**New U12 inventory (authored source):** 14 substantial original full B1/B1+ lessons, 28 original grammar blocks with bilingual examples and wrong→right→why feedback, 168 contextual French–English vocabulary entries (not necessarily unique lemmas), 70 extended bilingual dialogue turns, 140 individually answer-keyed exercises mixing cloze, choice, text comprehension and reordering with explanations, 14 guided extended writing productions with original model answers, 14 independent original three-paragraph French reading passages (**3,115 French words**), 42 original reading inference/synthesis questions with keyed evidence, 28 original dialogue-grounded listening questions, and 14 original ungraded structured spoken-response preparations with three-part planning guidance and a hidden French model.

**Cumulative original full Course U6–U12:** **94 lessons** (24 A1, 28 A2, 42 B1/B1+), **1,128 contextual vocabulary entries**, **472 dialogue turns**, **189 grammar teaching blocks**, **940 answer-checked recall tasks**, **94 guided writing assignments**, **176 original dialogue listening questions**, and **42 longer B1 reading passages** containing **7,883 French words** and **112 reading/inference questions**. Counts include earlier U6–U11 source inventories and exclude separate supplementary micro-lessons/missions. These inventory counts do not represent independently verified CEFR attainment or distinct vocabulary lemmas.

## Existing six-stage Course integration

- `u12-course.ts` composes the original inherited 80 lesson objects **without modifying their source IDs** and appends original `b1-29` through `b1-42`. It retains the existing six learning stages **Understand → Vocabulary → Read → Listen → Recall → Write**, temporary local exercise responses and guided writing fields. A **B1 production** shortcut and sequence heading extend the current Course navigation.
- `u12-material.ts` aggregates the 42 B1 original readings (28 inherited + 14 new) and routes their original comprehension checks through the unchanged existing Read-stage UI, using three paragraphs per new text.
- The original `u7-listening-panel.ts` retains optional browser/device synthesized French TTS, slow playback, per-line replay and transcript disclosure, and obtains U12's 28 new source-grounded questions. **No native recording, microphone capture, transcription, pronunciation verification or automatically assessed speaking credit**. A lightweight speaking preparation section in that same stage displays an original prompt, three distinct planning points and an optional hidden model. The learner can choose to say their answer aloud independently, but nothing is collected or graded.
- The U12 lesson vocabulary is original teaching material **not automatically enrolled** in the native vocabulary/FSRS/SRS system. No authoritative learner records are written, and Carnet/French 2.2 rights-restricted content remains metadata-only.

## Focused source-level checks and current limitations

The current in-session source audit **PASS** checked exact 14 original lesson IDs, order, 28 grammar explanations with corrections, 168 contextual vocab entries, 70 substantial bilingual dialogue turns, 140 answer-keyed tasks with four different task types and word-order tile parity, 14 longer writing models, 14 three-paragraph reading texts (3,115 French words) and 42 keyed evidence questions, 28 listening items, 14 oral-response scaffoldings, and the actual Course, Read, Listen and Course-landing integration wiring.

**NOT_TESTED:** actual TypeScript compilation, production build/bundle, Chromium/mobile behavior, physical-device TTS voices, human language-pedagogical review, rights acceptance and production release. No expensive CI, broad acceptance, user data access, paid API call, migration, merge or deployment was initiated. These are source-only development improvements, not a qualified product release.

## U13 — Practical B1 integration

Next, focus on genuine learner activity and original substantial multi-skill practice: realistic extended simulations, cumulative mixed inference and recall, reading-to-dialogue-to-writing transfer, independent writing prompts, and guided review within the existing authority boundaries. Avoid infrastructure-only or certification phases.
