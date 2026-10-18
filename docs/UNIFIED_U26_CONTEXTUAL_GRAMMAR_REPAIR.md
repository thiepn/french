# THIEPN French U26 — Contextual Grammar Progression & Misconception Repair

**Source-only implementation**, started from verified U25 stacked draft PR #51 exact head `b5f597e2ce4ee9633603a6c55eaf95d7b14278ec`, branch `feature/unified-u25-learning-first-course-navigation`. U26 uses a separate U25-child draft branch. No `main`, parent PR, historical learner state, production or deployment modification.

## Learner-facing original content

`app/src/core/unified/u26-grammar-content.ts` provides **24 substantial original contextual French grammar topics** with **72 independent keyed-answer prompts** (three per topic), each anchored to a genuine original U1–U25 course lesson ID. All 24 topics include:

- Contextual explanation and meaningful structural/semantic contrast
- Two original French examples with English explanations
- A precise false/corrected construction and misconception repair
- Three independently answerable contextual recall/production prompts with a limited authored key, first-stage hint, second-stage explanation, and **two authored misconception-specific response explanations per question**
- Reading-form/meaning, listening/stance and independent writing transfer instructions plus an original short French writing model
- Source-qualified anchor, author-level scope and ungraded practice labeling

This is an **authored material inventory**, not evidence that 72 learners passed questions or that CEFR, grammar accuracy or proficiency was measured.

| Original level | Grammar source anchors / distinctive contrasts |
| --- | --- |
| A1 | `a1-02` être; `a1-03` article specificity and gender; `a1-06` questions; `a1-07` formal negation; `a1-12` futur proche; `a1-13` partitives and negative quantities |
| A2 | `a2-01` avoir passé composé; `a2-03` être and participle agreement; `a2-06` imparfait vs perfective event; `a2-09` direct object pronouns; `a2-17` conditional politeness vs future; `a2-20` y versus en |
| B1 | `b1-01` cause/result; `b1-02` bien que + subjunctive vs même si; `b1-03` relative dont/que/qui; `b1-04` real/hypothetical si clauses; `b1-08` pluperfect chronology |
| B1+ | `transfer-31` polite mediation without unsupported accusation; `transfer-46` safety prerequisite and conditional volunteer commitments; `transfer-76` archival dates, passive voice and attribution |
| Early B2 | `transfer-121` reported uncertainty; `transfer-148` quotation fidelity and negation; `transfer-149` statistical scope and conditional decisions; `transfer-150` counterfactual past, concession and observation limits |

## Actual product integration

1. **Original Course:** U26 supplements existing authored grammar under Understand, existing keyed practice under Recall, and independently authored long-form production under Write. Existing task IDs, model examples, source identities and temporary answer-state ownership are unchanged.
2. **Connected Read:** U26's grammar support is linked after the existing source-owned reading and evidence questions. It provides a reading-specific grammar transfer prompt.
3. **Listening:** U26 is placed after original source-owned dialogues, optional synthetic device TTS, native listening questions and optional ungraded oral planning. It asks learners to distinguish grammar and stance without inventing microphone grading.
4. **Standalone Read / Listen / Write:** `u22-source-panel.ts` continues to own source-qualified selection and invokes the **same U26 renderer**, with the proper reading, listening or writing transfer content. Unsent written text remains page-local in the inherited authoring workflows.
5. **Existing Grammar route:** `grammar.ts` retains the historical U1 guides and U2 deep dive, while adding a clearly labeled 24-topic A1–early-B2 original grammar library. Level/topic selectors and explicit source-qualified Course handoffs use U23 registry and U25 pathways without duplicating material stores.
6. **Accessibility and mobility:** semantic form/labels, input hints, explicit exact-answer limitations, status text, keyboard focus outlines, responsive 44px controls, and opt-in reveal of authored hints/models in `u26-grammar-panel.css`.

## Feedback and learner-state authority

- `u26-grammar-panel.ts` **reuses the original `checkPracticeAnswer` closed-key practice comparison** from `u2-grammar.ts`. It does not introduce a new grader, FSRS scheduler, CEFR gate, attempt writer or mastery store.
- The comparison returns **only authored-key matching**, not a semantic or grammatical evaluation of all possible natural French. Specific preauthored common wrong forms lead to misconception-specific repairs. Unanticipated responses receive an explicit limited-key warning and a concept hint; no definitive claim of incorrect open-ended French.
- Hints, models, responses and short exercise attempts stay temporary and are not automatically uploaded or written to canonical learner state. Neither native Review nor Account/P35 authorization is altered.
- `originalU26GrammarForUnit` explicitly connects a grammar focus to its authored source ID/grammar keys within its level. Where there is **no explicit link**, optional same-level grammar is labeled accordingly rather than being misrepresented as teaching content of the selected unit.
- Historical U1–U25 original IDs, qualified provenance, U23 catalog, U24 revalidated navigation checkpoint and U25 learner-first Course surfaces remain authoritative. Course navigation points do not become assessment evidence.

## Boundaries and deferred verification

**NOT_TESTED:** No TypeScript typecheck, build, test suite, browser or physical mobile interaction, device speech, editorial native-speaker review, source-content certification, Account synchronization acceptance, rights audit, compliance qualification or P35 parity verification has been performed. New source may contain integration or copy issues until the explicitly deferred consolidated qualification. No CI, migrations, merges, deployments, credentials or paid services were initiated.

**Release: NO-GO.** Existing P35 production remains unchanged.

## U27 handoff — Non-certifying Placement & Flexible Pathways

As a separate U26-child implementation phase, connect U25’s original A1–B2 pathway discovery with an honest optional learner-controlled placement/self-check experience, documented prerequisite recommendations, transparent evidence-vs-preference distinction, practice-only diagnostic feedback and practical entry/skip controls. Preserve U23 source-qualified identities, U24 opt-in checkpoints, U26 contextual grammar authoring and all native FSRS/SRS/CEFR/Account authorities. No official placement/certification claims, fabricated mastery, automatic promotion or separate assessment/progress store. No tests/builds/CI/deployments until requested.
