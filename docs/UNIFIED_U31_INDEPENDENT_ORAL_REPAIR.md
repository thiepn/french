# THIEPN French U31 — Independent Oral Production & Conversational Repair

## Git lineage
- Base: U30 stacked draft PR #57, branch `feature/unified-u30-listening-evidence-spoken-interpretation`, verified exact head `03451efbf64b6fed3139990d82fe55470bdc5a8c`.
- U31 separate child: `feature/unified-u31-independent-oral-repair`.
- This phase neither merges nor deploys U30, earlier drafts, main, or production.

## Shipped source changes

### Independent original-source oral model
`app/src/core/unified/u31-oral.ts` reads only the canonical U23 original material registry, stable original dialogue turns, real attributed source documents, existing U28 attested vocabulary, U30 linked listening exercises, historical oral-response prompts, and original writing/reading sources. It does not import other copyrighted source material or create competing IDs or persistence. The exact qualified original ID and revision appear in the learner UI.

11 additional curated, source-anchored scenarios (A1 2; A2 3; B1 3; later transfer 3): familiar greetings, group inclusion, passé composé negation, apartment trade-offs, courteous hotel reservation repair, meeting rescheduling, hybrid meeting compromises, official document version uncertainty, neighbor noise allegations, theatre translation uncertainty, and captioning/consent limits.

Each authored scenario includes: a literal original French anchor and speaker constraint; an independent communicative goal; an explicitly *hypothetical* objection and misunderstanding; a specific appropriate register; a fair response and concrete correction strategy; staged oral structure; two independently keyed source-backed misconception decisions with distinct explanations for both distractors. Missing historical anchors suppress the specialized scenario. All other qualifying original dialogues receive a general, explicitly non-curated seven-stage oral track, source turn attribution exercise, original prompts and original cross-surface handoffs. Original authored source content is never rewritten.

### Seven-stage learner journey
`app/src/routes/u31-oral-panel.ts` integrates:
1. Establish a precise source-supported position.
2. Answer the original interlocutor independently with appropriate politeness.
3. Respond fairly to a clearly hypothetical counterargument.
4. Correct a demonstrable misunderstanding without overstating the source.
5. Justify the conclusion with an actual attributed French turn.
6. Deliver a sustained structured speech with counterpoint, uncertainty and next steps.
7. Reproduce the explanation with support hidden, then translate the communicative work into a self-reviewed French written summary.

For each stage: concrete French speaking task, stage-specific evidence-aware rubric, accessible keyboard navigation, optional strategy, progressively revealed original turn/full transcript, original oral model where historically available, on-page private French rehearsal draft, self-reported rehearsal marker (never verified performance), in-memory revision snapshot, before/after comparison, private draft deletion and an independent retry without assistance. Revealing support never creates an independently passed grade.

An adjacent source-question lab explicitly distinguishes separately authored keyed choices from free oral output. Negative feedback is specific to source-level misconceptions. No ungraded oral self-review is included in formal Practice history or review scheduler.

### Actual transfers
- **Speak:** original U23 source-qualified lesson discovery and filter, restored with the existing in-memory U23 speak handoff; independent of the preexisting device recording and speech-recognition flow.
- **Course:** embedded in the canonical original Listen stage, in addition to its existing U7/U30 listening experience, and using normal Course stage navigation and owner-scoped U24 checkpoint rules.
- **Read, Listen, Write:** embedded within the existing U22 source-qualified original materials panel, without replacing U29 comprehension, U30 listening, original writing, U26 grammar or U28 vocabulary.
- **Read and writing transfer:** original connected French passages shown as separate written sources; original historical listening-to-writing and argument prompts shown when available; explicit links to canonical Read, Listen, Write, Course and Speak routes.
- **Native Review:** a link to the existing authoritative scheduled review, not a new progress engine. The source registry's `OriginalSurface` now permits `speak` as an **in-memory navigation handoff** only, accepting existing original dialogue sources.

### Privacy and lifecycle
U31 maps, choices, snapshots and notes remain confined to the current DOM/component instance; no account transfer, IndexedDB/localStorage/sessionStorage use, additional grade event, review state, private audio recording, transcript, remote ASR result, CEFR promotion, or persisted course completion is written. Core original reading, listening and writing objects, source identities and review authorities are reused. U22 and Course route navigation guards include nonvisible U31 stage drafts, and the standalone panel guards page unload. Other global SPA navigation may discard drafts without an intercept; there is no claim of universal restoration. Source switches clean up the earlier U31 handlers.

### Limits
Device microphone or speech-recognition capabilities on the *preexisting* Speak page are not part of U31. U31 itself performs no microphone recording, automatic speech transcription, pronunciation scoring or semantic grading of free answers. Keyed multiple-choice correction establishes whether one **text choice** matches an authored original-source key; it proves nothing about actual spoken fluency. Hypothetical objections are expressly labeled, not misrepresented as source testimony. Written independent evidence is never misrepresented as recorded conversation.

### Verification status
**NOT_TESTED** — no TypeScript compile, build, CI, automated test, browser/mobile acceptance, publishing rights review, account sync check, deployment, migration, certification or merge has been run. Release **NO-GO** until later consolidated validation.

## U32 suggested continuation
Interactive discourse organization and multi-context speaking transfer: integrate more independent source pairs and register shifts, enable genuinely recoverable source-citation mistakes and objective source-level corrections, and preserve honest boundaries of unrecorded oral work.
