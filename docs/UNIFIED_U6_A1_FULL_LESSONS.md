# THIEPN French Unified Platform U6 — A1 Foundations, Full Lesson System

## Purpose and source custody

U6 resets development priority to substantive language teaching. It is an isolated draft stacked directly on U5 PR #29 at `d6e153ae1c52ae8f13e1080fbd5d5483250b364e`, preserving U1–U5, main, rights review, credentials, and production. All 12 full lessons were written for this branch, with `provenance('original','session','u6-a1-NN')` and source-owned copyright status. The old 20 original micro-lessons and U4/U5 missions remain independently available as **supplementary practice**; they are not counted among the new full lessons. The 60 Le Carnet Français positions remain rights-restricted metadata only, and French 2.2 textbook glosses are not redistributed.

## Authored A1 curriculum — 12 complete original units

| Unit | Focus |
|---|---|
| 01 | First French words, greetings, self-introduction, u/ou and silent consonants |
| 02 | Identity, occupation, place and irregular present tense of être |
| 03 | Noun gender, definite and indefinite articles, elision, plural |
| 04 | Avoir, family, possessions, age and fixed hunger/thirst expressions |
| 05 | Regular -er present conjugation, sentences about work/study |
| 06 | Est-ce que, yes/no and information questions, word order |
| 07 | Written ne … pas, negative avoir, preferences and article changes |
| 08 | Adjective gender/number agreement and common adjective order |
| 09 | Place prepositions, directions, au/aux and du/des contractions |
| 10 | Clock time, weekday frequency and arranging a meeting |
| 11 | Reflexive present verbs and coherent descriptions of daily routines |
| 12 | Aller + infinitive, invitations, declining politely and making another plan |

**Course inventory:** 12 new full lessons, **144 contextual vocabulary entries** (12 per lesson; repeated words across units are pedagogically expected), **60 original dialogue turns** (five per lesson), **120 source-qualified active-recall tasks** (10 per lesson) and **25 standalone grammar explanation blocks** with worked bilingual examples and common mistake→correction→reason. Each unit ends with an independently authored writing prompt, at least three self-review criteria and a sample response. Estimates are 25 minutes per unit, not CEFR proof.

### Actual Course experience

The Course screen now presents the new A1 curriculum before the older metadata and supplementary activities. Its lazy-loaded five-stage reader provides:
1. **Understand**: multiple substantive original grammar blocks with bilingual examples, a specific common error, corrected form, reason and optional link to the existing native grammar route.
2. **Vocabulary**: 12 words or expressions in genuinely contextual French sentences; meaning is hidden until requested. Native Learn remains the existing scheduler; U6 does not import unreviewed new lexical items into it.
3. **Read**: five-line original dialogue, speaker names, real French text and individually opt-in English translations.
4. **Recall**: ten actual answer-checked tasks, including multiple choice, cloze, reading comprehension and clickable word-order reconstruction. Immediate targeted explanatory feedback, on-demand worked answer, ungraded per-lesson answer state and optional follow-up to the relevant teaching block.
5. **Write**: longer open response, independent writing criteria, simple local structure hints and deliberately optional original model answer. Writing is **not** mechanically certified as grammatically correct.

The UI has native accessibility semantics, responsive mobile layout, keyboard navigation through lesson index, lesson/stage progress controls, and next-step affordances. Responses and progress indicators exist only in the current Course route instance. No Account, learner record, FSRS, SRS, CEFR, billing, cross-application, migration or backend write occurs.

## Focused verification, not qualification theater

`scripts/test-vnext-u6.mts` is **opt-in**, invoked via `npm run test:vnext:u6`. It checks lesson count/order/prerequisites, qualified original provenance, 12-word and five-turn minimums, grammar examples and corrections, all 120 exact answer keys, four active-recall variants, word-order token parity, production criteria and ephemeral practice counters. It is **not** inserted into the broad `qualify:vnext` workflow by design. Changes use `[skip ci]` commit markers to avoid deliberately requesting GitHub CI; no workflow is manually dispatched.

A lightweight in-tool, non-browser structural audit of the three authored content files checked all 12 lesson records, 144 vocabulary rows, 60 dialogue turns, 120 exercises, 24 then 25 grammar blocks, option-answer membership, ordering-token parity, writing examples and minimum explanation lengths, passing before this handoff. This audit does **not** substitute for a TypeScript typecheck, a compiled browser run, physical mobile testing or human review. Those remain NOT_TESTED until separately approved or run in a qualified environment.

## U7 development objective

Extend the same full-lesson engine with 12 further **original** A1 lessons on shopping/quantities, food/partitives, housing, weather, movement, travel, pronouns, daily errands, polite social exchanges and comprehensive contextual practice. Build meaningful original audio or accurately labeled device TTS listening exercises and optional record/playback speaking where technically and legally qualified, with no automatic pronunciation grading claims. Continue the **content-first** approach and reserve broad CI and release qualification for a consolidated gate.
