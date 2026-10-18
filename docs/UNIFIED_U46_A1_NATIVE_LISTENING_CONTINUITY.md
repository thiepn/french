# THIEPN French U46 — Native A1 Listening & Pronunciation Consolidation

## Stack
Direct verified U45 draft PR #72, branch `feature/unified-u45-later-a1-natural-speech`, exact parent `4253a4abcccc967a1969a223a0dc4c9c76892f45`.
Separate child branch `fix/unified-u46-a1-sound-listening-continuity`; base = U45, not main.

## Concrete defects repaired
1. **A1-22 implied a confirmed meeting where the dialogue only proposed Monday at noon.** Reworded the existing original `listen-2` prompt and explanation to describe Farah’s proposal; historical ID `a1-22-listen-2`, answer `lundi à midi` and options retained.
2. **Wrong answers immediately exposed the complete authored explanation and offered no direct route to the source.** The original `u7-listening-panel.ts` now presents authored misconception feedback, lets learners replay or read the indexed original dialogue turn and retry, and reveals the complete keyed answer only on an explicit button. This is session-local UI feedback, not a graded attempt or private journal.
3. **A1 original `listen-2/3` comprehension had no authorial source-turn pointer.** Added optional `sourceTurnIndex` for all 24 newer original questions, never rewriting the original question identities or answer keys. `validateListeningCatalog` verifies that links remain valid for the exact source unit.
4. **Browser speech synthesis was described as playing immediately when it was only requested.** The native speech status now distinguishes `speak()` request from the actual `onstart` event, retaining U44 cancellation identity checks, abort cleanup and no-French-voice fallbacks.
5. **Sound comparisons encouraged reliance on potentially inaccurate TTS and suggested every A/B case was acoustically discriminable.** Existing U44/U45 comparison intro now explicitly supports text-first study, explains IPA labels are only focus descriptions, warns about homophones, allophones and non-minimal pairs, and stops owned playback when the sound section closes.
6. **A1 independent different-context oral production was not systematically guided across all original lessons.** Added exactly 24 original, source-qualified `originalA1ConversationTransfer` cases to the existing `u7-listening.ts` native module, with situation, independent spoken task, specific self-check and original dialogue turn. Existing optional original Listen view presents the prompt and non-recorded self-review, not a new page, recorder, writer, course unit or score.

## Curriculum, rights and data
- 94 original full lessons + 150 transfer scenarios = 244 original Course entries, 192 connected reading records, 24 original A1 lesson IDs, 48 original U44/U45 contextual sound contrasts, and 60 original A1 listening question IDs retained. Only one clearly incorrect A1-22 *prompt/explanation* changed to avoid false confirmation, without changing its original answer key.
- All U40 native Words/FSRS, U41 bilingual translations, U42 foundation bands, U43 original reading and wrong-option repairs, U44 device-TTS and U45 later-A1 source content unchanged except the targeted source metadata and one factual correction.
- New work is original author-written everyday language teaching; no third-party content copied. Speech examples are not certified native recordings. TTS accents, liaison, schwa and timing cannot be verified through source inspection.
- Account authorization, private drafts, canonical Review, original grading and historical source rights untouched. No new storage, synthetic proficiency claim, microphone capture, merged PR or deployment.

## Qualification scope
- `npm run test:vnext:u46` is an opt-in focused contract covering 244 historical lessons, 192 readings, 48 contrasts, 60 original listening keys, 24 exact source-turn pointers, 24 independent scenarios, A1-22 correct uncertainty, and existing UI mechanisms. Source inspections are not substitutes for executing the test.
- U45 exact-head P37H/G/scalable runtime had **68 inherited TypeScript diagnostics**, with browser skipped. No U46 release PASS will be claimed until compilation and focused Chromium/mobile (including real device voice behavior and keyboard reflow) are observed.
- Executable container checkout attempt: GitHub remote clone failed due to DNS resolution (`Could not resolve host: github.com`) with Node v22 available; do not conflate a missing checkout with an application failure.
- No CI, unit test, browser, acoustic score or deployment has been fabricated.

## Next
A focused technical release gate should address the existing 68 TypeScript diagnostics in U22/U28/U30–U34/U36 on a separate direct child, then run the original course/listen focused Node scripts, TypeScript build and real Chromium/mobile acceptance before declaring the app release-ready.
