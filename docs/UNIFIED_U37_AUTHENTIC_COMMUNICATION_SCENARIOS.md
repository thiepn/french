# THIEPN French U37 — Independent Learning Transfer & Authentic Communication Scenarios

**Implementation first, content first, original source only.** Verified U36 stacked draft PR #63, branch \`feature/unified-u36-source-criticism-longform-production\` at exact head \`bfe630a2ab4226f7ac45966b33b01f1954ac2e0c\`. Checked the existing open PR stack; no U37 PR already existed. Created a separate exact-parent U36-child branch \`feature/unified-u37-authentic-communication-scenarios\`. Earlier stacked drafts, \`main\`, P35 production and original Account/learner authority are unchanged.

## Substantial original French curriculum implementation

\`app/src/core/unified/u37-communication.ts\` is a read-only view of **original U23–U36 source-qualified content**, with original dialogue turns, connected readings and separately attributed authored documents retaining their exact existing witness locator, qualified source ID and revision. U37 teaches language **using** those original materials; no original historical quotation, new original course ID or licensed text is fabricated.

- **13 fully newly authored, five-turn original-source-sensitive communication cases** span A1 through early B2. Each case has distinct fictional French partner prompts, independently authored French response illustrations, a well-defined audience and situation, exact source-boundary coaching, meaningful misconception trap, and source-faithful French corrective response. Every new fictional speaker is labeled as *new pedagogical fiction*, not historical dialogue.
  - A1 peer greetings respecting voluntary private disclosure and university reception with accurate student-group pronouns.
  - A2 retelling a past film without dropping negation, comparing apartment trade-offs without fictitious rent/availability, and negotiating hotel reservation changes without inventing booking confirmation.
  - B1 university Friday meeting/bus scheduling, mixed-access workplace meeting consultation without fabricated unanimity, and workplace document-version verification without assuming authorization.
  - B1+/early-B2 neutral noise mediation without inventing responsibility, translation editing preserving speaker hedges and authorial uncertainty, caption accessibility and online publication rights as separate approvals, voluntary town survey denominators versus citywide claims, and theoretical meteor forecasts versus local conditions.
- **Five progressive, meaningful decision rounds per eligible original lesson:** open accurately; clarify a misunderstanding; negotiate conditional, respectful options; repair a difficult but civil objection; produce an independent, audience-aware multi-sentence explanation. All rounds have genuine qualified historical original witness locators and U37-authored learner actions rather than an invented historic interview transcript.
- **Source-specific misconception practice:** two new curated original-source-constrained choices per case (accurate French misconception repair and appropriate verified-next-step) plus attributed-second-source choice when an actual distinct original label is available. Deliberately incorrect answers have **separate, concrete corrective explanations**; narrow authored-key choices never pretend to judge free conversation or alternative valid French.
- **Four authentic transfer dimensions:** original Listen, Speak, connected Read (only if the U23 source has an actual reading), and Write, each with its own **independent production assignment**, source attribution and direct canonical existing course surface handoff. U37 never impersonates a human recording, creates speech-to-text results, rates pronunciation, auto-copies learner drafts across apps or schedules an SRS review.

## Learner-facing implementation

\`app/src/routes/u37-communication-panel.ts\` with \`u37-communication-panel.css\` adds genuine interactive practice within the already-original U36→U35→U34→U33→U32→U31 oral learning stack.

1. **Five navigable source-sensitive French conversational turns**, preserving an individual, page-local response and register for each. Fictional counterpart statements are visually distinguished from actual original French dialogue and separately attributed witness cards.
2. **Progressive scaffold disclosure** (source-specific repair hint → actual historical source text → newly authored French illustration), independently reconstructable French answers, explicit initial version capture, independent second response with earlier model/notes hidden, and side-by-side learner-managed revision.
3. **Real pragmatic register choices** (familiar/tu, courteous professional/vous, neutral public), source-specific corrective explanations and opportunity to explain why an alternative inference is not justified.
4. **Source-bound keyed choice questions** with authentic witness preview, per-answer misconception-specific feedback, previous/next question navigation and temporary page-local choice memory. No self-reported or keyed response changes native CEFR/SRS/FSRS.
5. **Four independent cross-surface assignments** with temporary text for original listening interpretation, unrecorded speaking preparation, original reading evidence transfer where available, and authentic source-limited writing.
6. **Safe page-lifetime continuity:** switching scenario rounds, questions or transfer modes preserves local text until parent route exit, unmount or explicit task-scoped discard. U37 exposes \`data-has-private-draft\` and calls existing \`onPrivateChange\`; \`app/src/routes/u36-longform-panel.ts\` includes it in the original U36→U35→U34→U33 unsent-work path. Cleanup erases text with the already established signal. This **does not persist across reload** or add any new learner storage.
7. **Accessible responsive controls:** keyboard focus, readable genuine French language attributes, 44px controls, compact single-column mobile layout, clear source identity, semantically labeled inputs, status messages and reduced-motion behavior.
8. **True canonical navigation:** callbacks to historical original Course/Speak/Listen/Read/Write and existing native Review, carrying the historical original lesson ID only. Original U24 checkpoint and existing navigation ownership remain unchanged.

## Authority and privacy boundaries

- No new authoritative learner database, duplicate source registry, new teacher/publisher approval, SRS/FSRS/CEFR progression, Assessment/Account writer, semantics engine, cross-screen drafts, online submission or hidden grade.
- Original 244 authored Course units / 192 connected readings are inherited historical inventory expectations, **not recounted or validated by running any checks in this phase**.
- A new U37 fictional partner can present an objection for practice but is never evidence that the historical lesson characters said it. Source witnesses are attributed statements, not automatically verified real-world facts.
- Synthetic device voice is not original human audio; U37 neither records nor recognizes speech. Oral practice self-report is not an achieved speaking grade.
- Temporary learner work stays in component memory and is cleared on unmount. Do not claim reload-safe persistence.

## Exact changed files

- Added \`app/src/core/unified/u37-communication.ts\` — curated original French source-bounded communication cases and practice decisions.
- Added \`app/src/routes/u37-communication-panel.ts\` — five-turn interactive communication, source quotation access, original skill handoffs, independent drafts and revision.
- Added \`app/src/routes/u37-communication-panel.css\` — mobile/keyboard reader-first design.
- Modified \`app/src/routes/u36-longform-panel.ts\` — U37 child integration, unsent-text guard and cleanup.
- Added \`docs/UNIFIED_U37_AUTHENTIC_COMMUNICATION_SCENARIOS.md\` — implementation details, original-source boundaries and U38 handoff.

## NOT_TESTED — RELEASE NO-GO

Per explicit restriction: no TypeScript compilation, build, automated tests, GitHub CI/Actions, browser or mobile acceptance, language editorial audit, copyrighted-text review, Account roundtrip, migrations, merges, deployments, production updates, credentials or paid services. **NOT_TESTED** does not imply actual runtime acceptance; **release NO-GO**. Previous stacked draft branches, \`main\` and P35 production remain untouched.

## U38 — Integrated Real-World French Independence & Repair Studio

Continue as a **separate U37-child stacked draft** from the exact committed U37 head. IMPLEMENTATION FIRST / CONTENT FIRST: substantially extend the authentic original U23–U37 learner experiences into practical multi-source professional and social exchanges with different independent interlocutor roles, demanding clarification and civil negotiation, sustained French speech-writing-rehearsal without recording, nuanced source-backed register and grammar corrections, independent practical instructions and real-world reading/listening/writing handoffs. Preserve original U23–U37 historical IDs, source authority, owner-controlled U24 navigation, Account/SRS/FSRS/CEFR boundaries, temporary draft safeguards, earlier stacks and production. No invented recordings, semantic proficiency grade, unrelated content store, CI, tests, merges or deployments unless separately authorized.
