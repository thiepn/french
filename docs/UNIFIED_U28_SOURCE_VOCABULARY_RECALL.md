# THIEPN French U28 — Source-Aware Vocabulary & Recall Journeys

**Implementation-first, content-first, source-only stacked development.** Started by verifying U27 draft PR #54, branch `feature/unified-u27-placement-flexible-pathways`, at exact SHA `f58c08cd7314b117be351f1439d5a6f1b8929aca`. U28 is a separate U27-child branch. Previous stacked drafts, `main`, canonical native learning authority and P35 production remain unchanged.

## Implemented source-attested original vocabulary

`app/src/core/unified/u28-vocabulary.ts` provides a **read-only lexical index over the existing 244 original Course units**, built directly from their existing `A1Unit.vocabulary` French forms, precise English glosses and originally authored contextual example sentences. No copied, scraped or third-party rights-restricted lexicon is included. The existing U23 `qualifiedId` and `sourceRevision` are kept. A derived `#vocab-NN` suffix is a local position pointer within an original lesson, **not** a historical authored source ID, SRS card identity, backup key, or independently approved publisher document.

- Browse original vocabulary by written French form, English meaning, lesson title/context and the original registry's A1 / A2 / B1 / B1+ / early-B2 level labels.
- Recover source-specific original contextual sentences; optionally present an original dialogue turn or connected-reading paragraph **only where the literal expression occurs in that original source**. A word appearing in the vocabulary array but not in its reading is never falsely labeled as reading-attested.
- Find identical French expressions across other original unit records, preserving **each original lesson's independent qualified source ID** and its own published context. No inferred same meaning when independent source glosses differ.
- Ten editorially explained semantic/register contrasts (polite/familiar greetings and pronouns; yesterday/earlier time; audio/video observation; cause/result; evidence/outcome; observation/justification; uncertain attribution) **only appear for the designated source unit when every named contrasting expression actually exists in that unit's original vocabulary array**.
- Ten optional curated lexical families (decision, information, observation, verification/confirmation, comparison, justification, translation, revision, uncertainty and evidence) are **only surfaced when two or more distinct family members are actually present in the original vocabulary index**. Related original source records remain separate. Family commentary is marked as additional teaching, not a fictitious source attestation or automated etymology.
- For each original vocabulary record, generate source-qualified **original gloss recognition**, **French recall from the originally authored gloss** and, only when attested by the original exact French context, **cloze retrieval of the real original sentence**. No synthetic source quotations.
- Independent response comparison deliberately reuses the existing `checkPracticeAnswer` function from original U2 grammar. Exact-key matches and curated frequent confusions can display corrective detail. **Alternative valid French/English meanings are not automatically evaluated**, no language-model grading is claimed, and open writing is entirely ungraded.

## Actual learner journeys

`app/src/routes/u28-vocabulary-panel.ts` and `.css` add one shared, responsive vocabulary learning journey:

1. **Discover:** learner selects a source-qualified vocabulary form, sees the original French headword and original example, reveals an exact authored English gloss, optionally hears on-device French synthetic TTS, inspects independently attested dialogue/reading witnesses, sees verified cross-lesson uses and carefully labeled contextual contrasts and lexical-family guidance.
2. **Recall:** practice independent keyed gloss recognition, French production and conditional original-sentence cloze. Reveal a source cue/hint/model explicitly; compare the learner's answer against a **limited authored exact key**, with meaning/register misconception repair when authored. The transient keyed-match count is displayed as **page-visit practice only**, never as learned vocabulary/mastery.
3. **Transfer:** independently write another sentence using the expression, say it aloud, compare to the **actual original contextual model**, listen to device TTS of the original sentence, and move into the existing original Course, linked Read, Listen or Write using U23 one-use memory-only handoffs. Temporary creative text is **not** automatically saved, scored, captured by microphone or submitted as SRS evidence. Changing the current vocabulary phase/word or using built-in handoffs with a nonempty creative draft prompts an explicit discard decision.
4. **Native Review:** learner may independently open original native `Learn` or `Review` routes. U28 never invents card IDs, queues, SRS/FSRS grades, CEFR promotion or Account-authorized write operations. Source-qualified Course vocabulary alone does **not** enroll words into native scheduling.

`app/src/routes/u6-a1-panel.ts` replaces the previous basic, duplicated word-reveal grid in original Course **Vocabulary** with the full U28 journey while retaining the historical original unit, original vocabulary source, U23 IDs, U24 opt-in navigation, U25 pathways and U27 placement. Optional cross-course vocabulary discovery is accessible without leaving Course; choosing a result opens its original unit on the Vocabulary stage. Course transitions also guard nonempty temporary U28 writing.

`app/src/routes/u22-source-panel.ts` renders the **same U28 journey** inside the shared original Read / Listen / Write source-qualified panel, alongside original written/read/listen material and U26 grammar. It preserves the existing original draft-exit confirmation, U23 source-to-surface handoff, and session-only ungraded review. Existing original Content, native Learn/Review, rights restrictions, CEFR and Account mechanisms remain authoritative.

`app/src/routes/u28-vocabulary-panel.css` provides understated original-reader styling, mobile one-column interactions, source provenance, keyboard-visible focus, 44px+ buttons, accessible labels/status messages and reduced-motion behavior without copying generic rounded/gradient UI templates.

## Important limitations

- The lexicon is derived from **authored original unit vocabulary only**; it is not a full-language dictionary or proof of lexical coverage at a certified CEFR level.
- `#vocab-NN` identifies the vocabulary array position in the historical original unit; it is an ephemeral locator. **The original historical qualified lesson/source IDs are unchanged.**
- Sources may use the same French written word with different meanings; separate glosses and independent records remain separate. No morphological equivalence or reading appearance is inferred from string similarity alone.
- Optional browser/device TTS has variable voice quality and availability, is **not an approved French human recording**, and offers **no pronunciation assessment**.
- The original vocabulary journey has no persisted answers or new scheduling: everything the learner types here is temporary, with page-local authored-key comparison; native Review remains its own system.
- Any original connected reading or dialogue is displayed unchanged from existing original-owned published material. No fabricated vocabulary example is presented as an existing approved text.
- There is **no audio recording, semantic writing grade, proficiency certification, new learner store, duplicate SRS/FSRS scheduler, unapproved progress event, automatic Account syncing or hidden cloud write**.

## Verification / release boundary

**NOT_TESTED:** No TypeScript compilation, automated test, build, GitHub Action/CI, browser acceptance, physical mobile or device speech check, original-source rights audit, language editorial verification, data migration, Account cloud round-trip, accessibility qualification, release audit or P35 production parity verification were executed. New code is committed but not runtime-certified; **release NO-GO** until user-authorized consolidated qualification.

No migrations, merges, deployments, credentials or paid services were initiated. Existing draft stacks, `main` and P35 production have been preserved.

## U29 — Integrated Reading & Vocabulary Transfer

Next: develop **source-supported multi-step reading and lexical comprehension journeys** that use original U23 authored reading and dialogue, U28 vocabulary context, U26 grammar, U27 learner-controlled pathways, and U24 recoverable navigation. Include richer evidence-location prompts, progressively independent summaries, genuine lexical disambiguation, referent/context resolution, linked read-to-listen/write transfer and transparent misconception repair. Continue with an isolated U28-child stacked draft, preserve all original source IDs and native learner authorities. No separate assessment engine, fabricated comprehension grades, automatic draft persistence, broad qualification, merges or deployment.
