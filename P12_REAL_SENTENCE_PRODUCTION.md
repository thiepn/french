# P12 — Real Sentence Production, Controlled Composition & Contextual Usage Transfer

French v5.3.0

## Purpose

P12 promotes P10/P11 verified lexical frames from phrase-level production into complete sentence production. Sentence evidence is deliberately independent from vocabulary retention: failing a sentence task never resets or moves a mature vocabulary card.

## Exercise set

The initial P12 corpus contains 36 curated tasks tied to verified P10 constructions/collocations. It covers all five P12 formats:

- Complete the thought
- Cue → sentence
- Constrained translation
- Sentence transformation
- Context transfer

The exercises prioritize high-value productive frames such as `tenir compte de`, `avoir besoin`, `prendre une décision`, `décider de`, `faire face à`, `prendre rendez-vous avec`, and other verified P10 records.

## Answer-family grading

P12 does not pretend that arbitrary French has one valid string.

Evaluation is layered:

1. exact reference sentence;
2. explicitly accepted sentence-family variant;
3. normalized orthographic/near-form match;
4. deterministic structural diagnosis for clear failures;
5. **Needs your judgment** when the requested construction is present but the sentence may be a legitimate alternative.

The manual path exposes Correct / Almost / Wrong controls instead of falsely rejecting an unlisted sentence.

## Sentence diagnostics

Current deterministic diagnoses include:

- exact reference;
- accepted family;
- orthography / small form issue;
- article contraction;
- construction / preposition;
- word order;
- missing element;
- target construction missing;
- ambiguous/manual judgment;
- blank answer.

## Repair and transfer

A failed sentence can be retried before rating.

After an Again/Hard result, P12 looks for another task using the same verified frame and schedules it later in the queue, preferring a context-transfer variant. This produces the intended:

`mistake → repair → delay → transfer`

loop without immediate answer memorization.

## Sentence mastery

Sentence attempts are stored in the review log with their own fields:

- exercise ID and type;
- verified P10 record ID;
- context;
- diagnosis;
- learner answer;
- reference answer;
- correct / almost state.

Sentence state progresses through:

- `not_started`
- `sentence_guided`
- `sentence_controlled`
- `sentence_transfer`
- `sentence_secure`

A phrase family is sentence-secure only after repeated successful evidence across at least two days and at least one successful transfer. Transfer security has its own threshold.

## Sentence 10

P12 adds **Sentence 10**, a compact adaptive production session. Tasks are prioritized by:

- readiness from earlier phrase/production evidence;
- untested sentence frames;
- insecure sentence mastery;
- missing transfer evidence;
- P10/P11 phrase strength.

Sentence 10 is available from Home, Words, Word Detail, and Progress.

## Word-detail production ladder

Word detail now exposes a compact ladder:

`Recognize → Recall → Listen → Phrase → Sentence → Transfer`

Each stage is derived from actual evidence. Sentence/transfer weakness does not overwrite earlier dimensions.

## Search

P12 adds filters:

- `sentence:ready`
- `sentence:secure`
- `sentence:transfer`
- `sentence:gap`
- `sentence:unseen`
- `sentence-error:<diagnosis>`

## Progress

The P12 Progress panel shows:

- curated sentence tasks;
- ready phrase families;
- sentence-tested families;
- sentence-secure families;
- transfer-secure families;
- transfer gaps;
- recent sentence-error profile.

## Personalized path

`sentence` is now a first-class P8/P13-style path focus.

When sentence gaps are established, automatic mode can prioritize a small number of Sentence 10 tasks while preserving due-review priority. A manual **Sentence production & transfer** focus is also available in Settings.

## Persistence and compatibility

- Sentence work is practice-only.
- Vocabulary SRS intervals are not changed.
- Sentence metadata survives review-log normalization.
- Sentence tasks survive session snapshot/resume.
- P1–P11 state remains valid.
- The service-worker shell cache is advanced for v5.3.0.

## Release validation

Before committing the main P12 implementation:

- the patched 1.7 MB single-file application was syntax-compiled successfully;
- all required P12 integration markers were asserted;
- all 36 exercise IDs were checked for uniqueness;
- no P1–P11 block was removed or rewritten.
