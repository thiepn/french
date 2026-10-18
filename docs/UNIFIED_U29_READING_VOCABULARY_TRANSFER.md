# THIEPN French U29 — Integrated Reading & Vocabulary Transfer

**Implementation-first and source-only.** Verified U28 draft PR #55 / `feature/unified-u28-source-aware-vocabulary-recall` at exact head `5237d17903b516af5314ca96adc048b5d2cc00d3` before creating this distinct U28-child development branch `feature/unified-u29-integrated-reading-lexical-transfer`. All prior draft branches, main and P35 production remain unchanged.

## Substantial actual source changes

### Source-grounded integrated original reading model

`app/src/core/unified/u29-reading.ts` uses the original U23 registry and U28 vocabulary index, not a new content ingestion pipeline, grade writer, SRS card table, CEFR store, scheduler, or copied protected third-party source.

- **Evidence-location retrieval:** each existing original connected reading is segmented into its actual authored paragraphs. The learner identifies the location of an **exact original paragraph excerpt**, with descriptive evidence-specific explanations and repairs on misattribution. Dialogue-only original A1/A2 lessons are segmented into their real speaker turns.
- **Independent authored meaning, reference and inference:** **13 new authored contextual interpretation questions** for original `b1-01`–`b1-07`, `transfer-31`, `transfer-46`, `transfer-76`, `transfer-148`, `transfer-149`, `transfer-150`. Every added prompt has a precise original reading anchor copied from an existing source, its own key, two source-relevant distractors with **two misconception-specific repairs**, and a written explanation. A question is omitted if its historical original text does not contain the anchor; no invented quotation, guaranteed runtime inventory or fabricated learner result.
- **Original Course A1/A2 dialogue comprehension:** existing original authored `reading` task prompts, answer options, task IDs and explanation are re-presented as independently answerable source-backed interpretation steps for dialogue-only lessons. Speaker text is verbatim from the original Course. Those results are temporary and are not new authoritative grades or a duplicate engine.
- **Context-qualified U28 vocabulary:** find original vocabulary records whose French written form actually occurs as a standalone word/expression in the original connected reading. Pair the original sentence witness with that original record's **published English gloss**, and offer two different authored glosses as limited keyed choices. The question explicitly asks for the published gloss, not all possible natural-language senses. Per-lesson record and source-revision identity are retained. An unattested expression is not presented as reading evidence.
- **Attributed original paired-source comparison:** where the existing original Course has independently published notice/email/chat/data documents, select distinct original quoted statements that occur only in the named source and ask learners to identify the correct document. **A shared quotation is omitted** instead of guessing attribution. The explanatory text states explicitly that the identity of the document does not prove its claim true. The original source-comparison questions and authorial evidence remain intact.
- **No invented answer quality:** all authored-choice comparisons use existing `checkPracticeAnswer` from U2 grammar. No generative essay feedback, automatic summary accuracy, assumed understanding, inferred CEFR status or schedule changes.

### Accessible, independent learner-facing journey

`app/src/routes/u29-reading-panel.ts` and `.css` create a unified multi-step source reader that supplements rather than replaces inherited U10 connected readings and U22 original Read material.

- Five available activity groups: **locate evidence**, **contextual vocabulary**, **infer/interpret**, **resolve referents** (for authored content), and **identify the original document**. Groups appear only when their original source supports those tasks.
- Real numbered French source paragraphs or speaker turns and distinct attributed documents can be opened as needed; long text is rendered as French text with original source identity, not synthetic translation or a made-up short summary.
- Independently choose an answer, revisit preceding and next decisions, request a targeted evidence-location hint, optionally reveal the literal original excerpt, compare the authored key, and receive misconception-specific corrections where available. Temporary questions compared are counted only within the page visit, **not** as native assessment progress.
- A separate **guided-to-independent synthesis** section invites a 4–7-sentence French summary with direct evidence references, distinct observations vs interpretations, source limitations, contextual vocabulary use, and explicit conditions/uncertainty. The self-review criteria and optional writing plan guide revision, but **no automatic semantic grade** is given.
- **Speaking transfer:** explain a source-supported observation and inference aloud, without inventing voice capture or pronunciation scoring.
- **Listening/writing/vocabulary/native Review handoffs:** original U23 one-use Course → Read/Listen/Write source identities and U28 vocabulary/grammar journeys are reused. A nonempty temporary U29 summary stays within the current mounted panel; the existing U24/U28 route/stage protection warns before discarding that text when leaving.
- Responsive accessible buttons, labels, source previews, evidence overlays and keyboard focus styles including compact single-column actions.

### Specific original integration

- `app/src/routes/u6-a1-panel.ts` adds the U29 lab to the original Course **Read/dialogue** learning stage. A1/A2 dialogue-only source and B1–early-B2 authored connected reading can both access meaningful source-grounded independent work. Original U10 reading comprehension and source-comparison remain in place; U26 grammar and U28 vocabulary are unchanged.
- `app/src/routes/u22-source-panel.ts` adds the same U29 lab after the existing original Read text, original keyed reading questions and original U13–U22 document comparisons. Listening/Write native and original interfaces remain unchanged. The existing exit/switch warnings now also consider temporary U29 summary text.
- `app/src/routes/u29-reading-panel.css` provides a neutral reader-first layout, intact French punctuation, source provenance, focus and mobile behavior. There are no newly manufactured files, indexes or Account permissions.

## Ownership boundaries and limitations

- Original 244 Course units and 192 connected reading references are **inherited U22/U23 inventory figures**, not counted or accepted by a new build/test run.
- Every original lesson/source ID, U24 opt-in checkpoint, U25 pathway, U26 grammar reference, U27 non-certifying placement and U28 source-based vocabulary remains historical/canonical. New exercise IDs beginning `u29:` are **transient content pointers, not source or SRS identities**.
- Passage-location decisions test the ability to locate quotations and do not independently prove comprehension. Some short, descriptive reading questions may be easier than independent synthesis. Authored-source attribution identifies *who said something*, not the claim's objective truth.
- U29 does not run a semantic validator for original writing or source essays, infer native proficiency, save a private draft, create new training data, schedule reviews, claim actual audio listening accuracy or fabricate approval by a native speaker.
- Browser/generated display and content-accuracy acceptance are **not** verified here. Existing canonical FSRS/SRS/CEFR and THIEPN Account ownership are unchanged.

## NOT_TESTED — release NO-GO

Explicitly excluded and **NOT_TESTED**: TypeScript compilation, build, automated tests, GitHub CI, browser/physical mobile acceptance, accessibility certification, editor/language-source verification, source rights audit, Account synchronization checks, P35 production parity, migrations, deployment or release. No tests, builds, CI, audits, migrations, merges, deployments, credentials or paid services were initiated.

## U30 handoff — Integrated Listening Evidence & Spoken Interpretation

Create a separate U29-child stacked draft from the exact U29 head. Substantially improve authored original A1–early-B2 multi-turn listening comprehension, listening-to-reading correspondence, authentic speaker attribution, source-specific inference, lexical distinctions, nuanced repairs, staged transcript support, independent spoken preparation and contextual Read/Write handoffs. Reuse original dialogue and existing optional device TTS responsibly; never call synthetic TTS human audio or claim microphone validation. Preserve U23–U29 owner-scoped source and learning authorities and historical IDs. No tests/builds/CI or production changes without explicit user authorization.
