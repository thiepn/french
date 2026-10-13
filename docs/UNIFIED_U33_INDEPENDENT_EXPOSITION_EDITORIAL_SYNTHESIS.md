# THIEPN French U33 — Independent Exposition & Editorial Source Synthesis

**Implementation-first, content-first stacked source phase.** Before implementation, U32 draft PR #59 and its branch `feature/unified-u32-advanced-discourse-transfer` were independently verified at exactly `9a1f92a229fa8911e116c6e8da9e0679fb24b3ac`. No open U33 PR was found. A distinct child branch `feature/unified-u33-independent-exposition-editorial-synthesis` was created from that exact SHA. Previous PR stacks, main, U32 and P35 production remain unchanged.

## Actual authored learning content

`app/src/core/unified/u33-editorial.ts` reads **only real U23/U32 original source identity and material**. It does not store learner data, originate a parallel curriculum, or reassign an historical source ID.

- **13 substantive authored, source-qualified editorial briefs** across A1, A2, B1, B1+ and early B2, anchored to existing U32 cases: greeting boundaries; plural identity; negated past events; housing size/cost compromises; hotel reservation request versus confirmation; Friday last-bus meeting changes; hybrid participation; conflicting official document versions; unproven building-noise allegations; missing translated uncertainty; theatre captioning and internet rights; voluntary survey denominator and funding; cloudy-night observational forecasts.
- Each brief defines a real **source-bounded thesis**, a hypothetical adversarial-but-civil editor challenge, explicit factual or rights limitations, a misleading example that learners must correct, and an original, suitable French correction. The newly written editor quotes are marked as **pedagogical fiction**, never a historical speaker's reported words.
- Each original dialogue lesson receives a **five-stage authored editorial pathway**, even if it does not have one of 13 dedicated briefs: qualified thesis; evidence development; strongest fair objection; correction of overclaim; independent neutral-audience synthesis. Every stage points to actual U32 witness locators, labels their provenance and offers a distinct original pedagogical French illustration. Uncurated lessons are explicitly identified as general tracks, not bespoke U33 source briefs.
- Each curated case has **two independent authored source/editorial decisions** (scope and repair) with real source-linked witnesses, authored response traps and explicit misconception-specific correction. Where distinct source witnesses are available, the original attributed source is checked separately. Exact-option comparison is **not** automated assessment of natural French.
- Suggested independent production length increases progressively across the **author's A1–early-B2 teaching labels**: A1 two developed paragraphs / four sentences, A2 three / six, B1 four / eight, B1+ and early B2 five / twelve. These are voluntary pedagogical targets, **not** official CEFR proficiency requirements.
- Original source witnesses remain the source of truth. Comparisons use two **independently attributed original written records** when present; otherwise a transparently labeled written-reading/dialogue or **two turns of the same dialogue**. The latter never masquerades as independent publications.

## Actual interactive learner workspace

`app/src/routes/u33-editorial-panel.ts` and `.css` add one full native, responsive, keyboard-accessible U33 editorial learning experience:

1. Source-qualified scenario and audience-specific brief, including explicit editor-fabrication warnings.
2. Five progressively demanding written-to-spoken argument sections with actual source witness lookup, optional speaking outline and clearly labeled illustrative response. Learner switches among peer, professional/service and neutral public registers without source inflation.
3. Private, local per-stage first versions and independent second answers; explicit capture of earlier text, side-by-side comparison and self-review. Learners can move between stages without dropping their in-page working notes.
4. Separate **full multi-paragraph exposition** with real source evidence; independent second, initially hidden-first-version synthesis; explicit capture, revision comparison and discard controls. All text is page-lifetime only.
5. Exact source record selection for evidence comparison, with first/second source reports and free French synthesis held under the *exact original pair of witness locators*, not silently moved to another source.
6. Curated text-only misconception correction and optional witness reveal. The only automated response operation is comparing against a small, authored exact answer key. No comprehensive semantic grading or pronunciation evaluation.
7. Self-review of source provenance, limitations, quotation accuracy, register, objection fairness, cohesion and conditional conclusions; explicit speaking-rehearsal self-report, never claimed verified recording.
8. Original Course, Listen, Read, Write, Speak and native scheduled Review handoffs reuse existing source-qualified routes. No text, scores, grades, audio or SRS events are transferred with navigation.

## Integration and privacy

`app/src/routes/u32-discourse-panel.ts` embeds U33 **inside the existing U32/U31 oral renderer**, rather than introducing a duplicate route or learning engine. It incorporates U33's temporary draft flag into U32's original `data-has-private-draft` and `onPrivateChange` signals, preserving the parent U31 exit/unsent-work guards. The U33 component is disposed on its original abort/cleanup path.

The content includes no new database tables, permanent feature-state keys, SRS/FSRS scheduling, automatic CEFR grades, Account permissions, audio recording, machine-speaking grade, fabricated historical utterances or automatic upload/persistence of independent writing.

## Changed files

- Added `app/src/core/unified/u33-editorial.ts`
- Added `app/src/routes/u33-editorial-panel.ts`
- Added `app/src/routes/u33-editorial-panel.css`
- Modified `app/src/routes/u32-discourse-panel.ts`
- Added `docs/UNIFIED_U33_INDEPENDENT_EXPOSITION_EDITORIAL_SYNTHESIS.md`

## NOT_TESTED / release boundary

No TypeScript compilation, tests, builds, GitHub Actions, CI, language editorial certification, source-rights auditing, browser or mobile validation, live microphone/recording verification, Account cloud round-trip, migrations, merges, deployments, credentials or paid services have been performed. Source code and authored content are committed but **not runtime qualified**. **NOT_TESTED / release NO-GO**. P35 production, main and prior stacked PR branches remain unchanged.

## U34 handoff — Source-Critical Autonomous Debate & Cross-Genre Argument

Create an isolated U33-child development branch and stacked draft, implementation first. Substantially improve original A1–early B2 independent evidence-based French argumentation with multi-round adversarial-but-civil debate; claim/evidence/counterargument maps tied to authentic U23 sources; progressively independent cross-genre editorial production (service correspondence, debate, neutral report and spoken briefing), verifiable lexical/grammar misconception-specific interventions, fair-source comparisons, practical pause/resume within page lifetime, and consistent Course/Speak/Read/Listen/Write source identities. Reuse the canonical U23–U33 mechanisms and Account/SRS/FSRS/CEFR authorities; no fabricated speech evidence, novel grading engine, mastery store or unsent-draft auto-storage. Defer testing, builds, CI and production changes until explicitly authorized.
