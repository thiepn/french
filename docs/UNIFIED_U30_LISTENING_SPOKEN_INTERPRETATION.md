# Unified U30 — Integrated Listening Evidence & Spoken Interpretation

## Lineage
Parent: U29 draft PR #56, branch feature/unified-u29-integrated-reading-lexical-transfer, exact head 2a27923b6bec7f45818724c2deaa5d9a100ae976.
Child: feature/unified-u30-listening-evidence-spoken-interpretation. Separate development branch and stacked draft PR. Nothing merged into main or production.

## Implemented educational experiences
1. Original-dialogue listening in Course and Listen. U30 uses the original U23 qualified unit dialogue, speakers and original English explanations; standard/slow whole-dialogue and turn-by-turn device speech synthesis where available. Speakers' names are not synthesized as if they were identifiable voices.
2. Source-based speaker attribution. Choices derive from the actual published participants; keyed source attribution is not audible speaker recognition.
3. Multi-turn sequence recovery. Determine the next original turn from actual published dialogue. Distractors are alternative actual utterances, never fabricated speech.
4. Interpretation and nuance: paired original English explanations and ten new authored checks on reciprocal greetings, inclusive pronouns, uncertainty of accusations, rules versus evidence, translated hesitation, two unconfirmed script versions, caption negation, improvised performance, online consent and qualified release. Authored questions are omitted if historical French anchors do not match.
5. U28 contextual vocabulary: include a lexeme only when its French form and existing original-dialogue witness confirm the occurrence in the current source; preserve qualified lexical identity and its English gloss.
6. Independent documents are clearly presented as written evidence, not audio. One keyed document-attribution question appears only if distinct source labels and actual source text exist.
7. Progressive support: first TTS request, turn replay, slower speed, question hint, original French excerpt, attributed transcript, original English explanations and misconception-specific corrective feedback. No playback request is claimed as verified hearing.
8. Independent oral interpretation and writing: evidence-bounded speaking preparation, original oral model and plan where available, short private written summary and explicit self-check rubric, with preserved Read, Write and native Review handoffs.
9. Course and Listen have unsent-draft navigation guards for U30. TTS is stopped on interrupted stages and lesson switches.

## Source and authority
The 244 original Course units, 192 inherited connected readings, original source revisions/IDs, original Account and U24 checkpoint, U25 pathways, U26 grammar, U27 placement, U28 vocabulary, U29 reading, original native Practice and FSRS/CEFR authorities are untouched. No duplicate learner state, event ledger, review scheduler, transcript persistence or public publication path was created.

All U30 choice checking is temporary and in-memory: a response is NOT a native Practice grade, official listening assessment, SRS/FSRS update or CEFR credit. Spoken practice has no microphone/ASR, recording, diarization or pronunciation grading. Device TTS can be absent or have a single French voice for all participants. Original English explanations may summarize rather than literally translate original turns. U30's writing draft stays in the DOM/page lifetime and does not enter a navigation checkpoint or cloud transport.

## Qualification status
NOT_TESTED: TypeScript, build, CI, tests, browser/Android/mobile, rights/editorial, Account round-trip and production checks. Release NO-GO. No merges, deployments, migrations, paid services or credentials.

## Next phase
U31 — Independent oral output and correction journeys: source-grounded rehearsal, conversational repair, support fading and carefully bounded oral self-review, with no fabricated recorded evidence or proficiency claims.
