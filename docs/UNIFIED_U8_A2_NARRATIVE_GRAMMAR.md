# THIEPN French U8 — A2 Narrative Grammar & Communication

## Direct source lineage

New isolated draft source branch `feature/unified-u8-a2-narrative-lessons` starts from U7 stacked PR #31 exact head `fcbee3294b8b129235800355985dd4f92c4e87f7` (U6 #30, U5 #29, all earlier drafts preserved). Existing U6/U7 24 full A1 lessons are not reauthored, moved or overwritten. This continues the **content-first** roadmap, without new Account, FSRS, SRS, CEFR, release-evidence, checkpoint, database or progress engines.

## Substantial original A2 learning content

| New A2 lesson | Actual learning outcome |
|---|---|
| A2-01 | Passé composé with avoir, regular participles and negation |
| A2-02 | High-frequency irregular past participles, experience questions |
| A2-03 | Selected movement verbs with être and subject–participle agreement |
| A2-04 | Reflexive past, pronoun order, agreement and indirect-object exceptions |
| A2-05 | Imparfait formation, habitual actions, background states |
| A2-06 | Meaningful contrast between imparfait background and completed events |
| A2-07 | Chronological travel storytelling with both past tenses |
| A2-08 | Il y a, depuis, pendant and timelines |
| A2-09 | Direct objects before avoir, le/la/les and past participle agreement |
| A2-10 | Indirect recipients lui/leur versus direct objects, no false agreement |
| A2-11 | Reporting a conversation, past perspective and question structure |
| A2-12 | Explaining missed appointments, symptoms and past consequences |
| A2-13 | Travel delay, help, rebooking and a resolved incident narrative |
| A2-14 | A2 narrative capstone with background, events, pronouns, evidence and outcome |

**A2 source inventory:** 14 wholly original lessons; 28 substantive grammar explanation blocks (two per lesson), each with original French/English examples and a worked error→correction→reason; 168 contextual vocabulary *entries* (12/lesson, repetitions across lessons are intentional); 72 original bilingual dialogue turns; 140 authored cloze, reading, choice and sentence-order exercises (10/lesson), each with a keyed answer and substantive explanation; 14 multi-criterion writing productions with original models; 28 independent dialogue-based listening comprehension questions. This is meaningful learner practice, not an automatic CEFR A2 certification.

**Combined full Course (U6+U7+U8):** 38 full original lessons, 456 contextual lexical entries, 192 dialogue turns, **77 grammar blocks**, **380 recall exercises**, 38 writing assignments, 64 listening questions (36 A1, 28 new A2). The 20 earlier U2/U3 micro-lessons and U4/U5 missions remain supplementary, not counted as full lessons.

## Working Course integration

- `u8-a2-model.ts` adapts the existing source-owned U6 unit schema rather than adding another course engine; A2-01 has a suggested A1-24 prerequisite, subsequent units chain through A2-14. A2 units have distinct `fru1:original@…:session:u8-a2-NN` provenance. Earlier U6 and U7 source IDs stay intact.
- `u8-course.ts` combines 24 U7 A1 units and 14 A2 lessons in one catalog. The original Course route retains **the same six stages**: Understand → Vocabulary → Read → Listen → Recall → Write, with context explanations, optional translations, existing answer checking and visible worked corrections. Added A1/A2 jump controls, a labeled A2 section and straightforward next-lesson progression.
- `u8-listening.ts` supplies 28 new original comprehension questions based on A2 dialogues to the **existing U7 device-TTS playback** and optionally revealable transcript. No synthesized audio is misrepresented as human-recorded French. No microphone, automatic pronunciation judgment or speaking grade is introduced.
- Course history, practice counters and writing drafts remain temporary in-memory hints; they do not sync, award official CEFR, approve vocab imports, or write FSRS/SRS/Account learner evidence. Existing native Learn and Review remain unchanged. No unauthorized Le Carnet Français PDF/HTML teaching prose or French 2.2 textbook glosses is redistributed.

## Lightweight focused checks

- In-tool structural/source audit **PASS** across all 14 A2 original authored units: count/order, 28 explanation blocks, 168 vocabulary entries, 72 dialogue turns, all 140 answer-keyed tasks and four active practice types, word-order tile parity, writing coverage, 28 dialogue-grounded listening questions and U7 Course player wiring.
- Corrected one misleading `ouvrir` exercise (it now uses transitive `quelqu’un a ouvert la porte`) during source review.
- Added an **opt-in** `npm run test:vnext:u8` deterministic content test retaining the original A1 contract, checking complete 38-lesson continuity and qualifying all A2 identities and listening. It was **NOT EXECUTED**, and is **not** appended to broad `qualify:vnext` CI.
- **NOT_TESTED:** full TypeScript compilation, production build and size budget, local/hosted browser acceptance, physical-device audio behavior, actual learner records, human French-teacher content acceptance, human rights sign-off and production release qualification. No CI workflow was manually dispatched; all source commits use `[skip ci]`. Draft remains **NO-GO** for production.

## Next development phase — U9 (A2 Practical Independence)

Build approximately fourteen further original A2 full lessons within the same six-stage engine, prioritizing longer interactions, descriptions, comparisons, future and conditional politeness, travel/services and everyday independence. Maintain honest teaching limitations, native learning authority, material rights and implementation-first lightweight checking. Consolidate expensive qualification later instead of using a new technical workflow in every phase.
