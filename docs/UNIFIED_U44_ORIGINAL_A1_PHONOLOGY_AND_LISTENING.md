# THIEPN French U44 — A1 sound contrasts and listening comprehension

## Original parent and scope
Exact verified parent U43 PR #70, `feature/unified-u43-authentic-context-misconception-repair`, SHA `35d9f3c84b7f3c45ac607903708ad4535123f56c`.
U44 is a distinct stacked direct child `feature/unified-u44-a1-phonological-contrast`, targeting U43 only. It does not change main or production.

## Source-linked original teaching
- Directly extended original `u7-listening.ts` with **24 independently authored context-based sound contrasts**, two per existing `a1-01` through `a1-12`. They cover u vs ou, é vs è, nasal vs oral vowels, bon/bonne, the aspirated-h class of héros, liaison and blocked liaison, gender and final consonants, present -ent homophony, -ons/-ez, qui/que, homophonous où/ou, ne deletion in casual speech (without reversing negation), partitive in negative contexts, number-plus-noun liaison, reflexive m' elision, and rhythmic connected phrases with on.
- Each contrast has two meaningful full French sentences, English meanings, **explicit target IPA** (representative reference French, not a device-specific acoustic measurement), independent listen-and-repeat directions, and misconception-specific explanation. Some examples, such as il parle / ils parlent and où / ou, deliberately teach that **sounds may be identical** and only orthography/context can resolve meaning. These are **not** fabricated minimal pairs or audio-only listening tests.
- The original `a1-01` sounds block and core A1 -er, negation and directions instruction were corrected with specific articulatory and liaison information. No original lesson, word, reading, dialogue, question, model or task IDs were removed.

## Genuine original native learner pathway
- Original `u7-listening-panel.ts` Listen stage now contains an **optional, keyboard-operable 'French sound focus' details section** for each qualifying A1 source. Learners can hear both full context sentences with the same **existing browser/device TTS playback function**, repeat their own version, and reveal exact French forms, reference IPA, English meaning and written explanation.
- A pair is not counted as correct or wrong: available voices can differ, liaison synthesis can be unnatural, and no human recordings, microphones, sound discrimination inference or pronunciation scores are used.
- Source repair to existing TTS cleanup: replace a shared `playing` Boolean with the owned `SpeechSynthesisUtterance` identity. Cancelled or stale `onend`/`onerror` events no longer overwrite the status of a newer learner-triggered utterance. Preserve abort cleanup and explicit no-French-voice/transcript fallbacks.
- Styles reuse `unified-u7.css` tokens, visible focus indicators, ≥44px buttons and responsive two-column/audio controls; no additional page, speech service, data store or review authority.

## More reliable original A1 comprehension
- Original A1-01–12 previously inherited **one** U6 fallback reading task as `listen-1`. This remains **identical** (same ID, prompt, answer and options).
- Add **twelve new actual-dialogue-grounded `listen-2` items**, one for each early A1 lesson, testing speaker identity, ages, school items, morning/evening routine, what a shop assistant has not answered, negated preferences, direction details, meeting times, reflexive routines and changing plans.
- Each new comprehension item has three authored alternatives, its original correct answer, a concrete explanation and **24 individually written misconceptions** mapped to the exact two incorrect choices.
- Original native listening answer form, correctness checker, temporary-only practice semantics and optional source-linked oral preparation remain the same. No native FSRS grades or score writers. Original U7 test assumptions were updated from 36 to 48 listening questions, explicitly preserving original sources.

## Qualification and limitations
- Added `npm run test:vnext:u44` source-contract regression for unchanged 244 source IDs / 192 readings, A1 24 lessons, exact historic practice/listen-1 IDs, 24 contrasts, 12 listen-2 additions, 24 wrong-option explanations, 48 A1 listening questions and native TTS handling.
- **Source-only inspectability is not a test or browser PASS.** Run/test/build statuses will be recorded strictly from observed evidence.
- U43 exact-head P37H/G/runtime failed with 68 inherited TypeScript diagnostics (U22, U28, U30–U34 and U36). U44 does not hide them. No actual device-acoustic quality, real French-voice availability, human review, IPA attestation or learner proficiency certification has been demonstrated.
- Original 94 lessons, 150 transfer cases, 192 connected readings, earlier historical academic/practice IDs, U40 Words/Review/FSRS, U41 translations, U42 grammatical level alignment, U43 native feedback and content depth, Account, source rights, local-only private data, all earlier draft ancestry, main and production remain untouched.

## Next suggested U45
Deepen later A1 13–24 original pronunciation linked to food ordering, numbers, prices, public transport, negation, connected casual speech and everyday dialogues; verify known IPA/phonotactics and demand genuine Chromium/mobile playback when available. Keep original six-step Course/Listen engine, no extra store, no automatic voice grading. Separate inherited TypeScript cleanup and release qualification into a focused technical gate.
