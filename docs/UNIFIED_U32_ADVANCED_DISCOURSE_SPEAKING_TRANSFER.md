# THIEPN French U32 — Advanced Discourse and Multi-Context Speaking Transfer

## Stack and constraints
- Parent U31 draft PR #58, branch feature/unified-u31-independent-oral-repair, verified exact commit 6df0239a710312ef355b1773210f8e36f2fb5ae2. The U31 parent ref compared identically to that SHA.
- Isolated child branch feature/unified-u32-advanced-discourse-transfer. Stacked draft PR targets U31 and not main. Nothing merged or deployed.
- Implementation and original teaching content first; no tests, builds, CI, migrations, credentials or paid services requested or run.

## Actual learner-facing implementation

### New U32 original-source discourse model
app/src/core/unified/u32-discourse.ts builds a read-only experience from original U23 Course speakers/turns, independently authored connected reading paragraphs, attributed original written evidence records, existing U29 source-linked reader and U31 original oral journey. Original qualified source identifiers and their revisions are preserved. U32 locators distinguish original unit, original dialogue turn, reading paragraph, and original independent written record as *display-only locators*, not new published source authorities.

**13 curated, source-attested case journeys:**
1. A1 greeting and respecting a personal boundary
2. A1 inclusive plural pronouns and explanation to a university contact
3. A2 recounting actions without reversing an explicitly unfinished film
4. A2 housing priorities and fair size/cost/proximity objections
5. A2 hotel reservation correction with polite conditional forms and date accuracy
6. B1 changing a meeting because of an earlier last Friday bus, without fabricating a cancelled network
7. B1 balancing online and in-person participation with a proposed, not finalized, compromise
8. B1 distinguishing competing document versions from verified official authority
9. B1+ mediation that distinguishes observed noise, a general rule and unconfirmed proposed work
10. Early B2 theatrical translation and the omitted epistemic hedge in the original manuscript
11. Early B2 theatre captioning errors, improvised performance and online-rights scope
12. Early B2 garden survey: voluntary 80/100 responses versus a municipality-wide representation claim; provisional budget
13. Early B2 astronomy: conditional theoretical maximum, two noncomparable local durations, transparent observational metadata

Every specialized case requires a literal original dialogue anchor with its correct speaker; if the original content changes, the specialized authored material is suppressed rather than attributed falsely. Uncurated original source-qualified dialogues still receive a general four-turn oral transfer track without claiming a separately authored case.

Each authored journey has **four consecutive** invented, clearly labeled new partner objections/prompts, escalating through framing, fair rebuttal, conversational repair and extended audience synthesis. Learners must preserve original source limits and change register between peer conversation, service/professional context, and a careful public explanation. Each of the thirteen authorial scenarios includes two meaningful keyed source or register judgments with distinct corrective feedback. These **textual** keys do not grade free speech.

### Authentic independent source comparisons
Five precisely anchored cross-record comparison sets provide ten additional independently keyed authorial questions, two per original two-record pair:
- transfer-31: general building rule versus tentative neighbor chat
- transfer-121: script excerpt's hedge versus provisional translation/rehearsal note
- transfer-148: promotional claim of faithful captions versus actual dated rehearsal error log
- transfer-149: campaign poster versus opt-in portal methodology/provisional council agenda
- transfer-150: guaranteed promotional meteor count versus qualified maximum and separate site logs

The additional authored questions appear only if *both* exact historical original documents still contain the required original text anchors; no unattested citations or fabricated recording claims. Independent source attributions are source-keyed from the actual original written documents (two-record attribution includes an explicit neither-document distractor where necessary). Separate reading paragraph-location activities only use real original connected readings and their original textual positions; they are not depicted as spoken utterances.

### New interactive U32 source-workspace
app/src/routes/u32-discourse-panel.ts and .css implement:
- Four consecutive connected speaking turns, explicit scenario and audience change
- Real original French evidence locators and responsible separate labels for speaking text, reading and written documents
- Progressive strategy → source → illustrative authored reply support; private independent second response with prior draft hidden
- Per-turn private text, optional snapshots, before/after and independent draft comparison, unverified aloud self-report and concrete manual evidence/register/source-truth checklist
- Source-based multiple choice with answer-specific misconceptions and exact original witness excerpts; answered state remains only in the current component
- Dual original source comparison board, selectable authentic pairs (two written records, written reading versus dialogue, written document versus dialogue, or transparently two turns of the same dialogue where no independent records exist)
- Independent written French attribution and synthesis notes **scoped to the exact two original source locators**, not silently moved to a new pair
- Original Course, Speak, Listen, Read, Write and canonical Review handoffs preserving U23 source identity through the original U31 integration

The existing U31 oral renderer embeds U32 directly, so its established native Course/Read/Listen/Write/Speak surfaces provide U32 without route duplication or a replacement teaching engine. U31's unsent-work flag includes any U32 notes; existing U22 and Course route protections and the standalone oral workspace discard choices apply. The U32 user content stays in page memory only, with no persistence, Account upload, review scheduling, FSRS/CEFR changes or learner mastery record. No browser/device microphone, recognition engine, recording or human speech rating is run by U32.

## Known boundaries
- Real-time examiner-style turn taking is a prompted roleplay, not live conversation with an actual person.
- U32 authored illustrative replies are new pedagogical examples and never masquerade as original recorded dialogue.
- Source checks verify exactly authored option keys and original provenance, not the semantic quality of a learner's original spoken sentences.
- User self-reported aloud performance is not audibly verified. Suppressing support for an independent retry does not prevent the learner from voluntarily opening references.
- Only page-lifetime drafts are retained. A generic SPA route can still discard them if it bypasses the native supported navigation guard; no cross-session restoration claim.
- Where a lesson lacks genuine independently published documents, the comparison board offers a connected reading/dialogue comparison or transparently labels two turns from the *same* dialogue; it never fabricates two independent documents.

## Qualification
**NOT_TESTED / RELEASE NO-GO:** no TypeScript compilation, full build, CI, test suite, browser or mobile acceptance, pronunciation/recording audit, historical content rights/editorial certification, Account round-trip, migration, merge or deployment has occurred. This branch is for the later consolidated integration/verification phase.

## U33 direction
Advanced self-directed French exposition and editorial source synthesis: lengthen source-grounded multi-register monologues and adversarial-yet-civil replies, use genuine historical independent documents to practice stronger warranted-versus-unwarranted claims, improve prompt fading and recoverable page-lifetime revision without shadow learner mastery stores or invented automatic speaking grades.
