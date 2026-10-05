# P33 — B2 Spontaneous Spoken Production, Fluency, Discourse Control & Oral Assessment Calibration

French 5.24.0 adds a calibrated oral-production layer on top of P31 open production and P32 integrated transfer.

The purpose is narrow:

> Can the learner sustain an independent B2-level spoken response under real planning pressure?

P33 does not claim that browser speech recognition can grade accent quality, phonetic accuracy, or every grammatical choice.

## Assessment design

A calibrated P33 assessment contains exactly two tasks:

1. one **zero-preparation** response;
2. one response after **20 seconds of mental preparation**.

Three rotating pairs are drawn from six B2 prompt families:

- workplace policy;
- disputed media claim;
- city transport policy;
- project crisis;
- team conflict;
- competing-priority decision.

The zero-prep prompt is hidden until speech recognition starts. The brief-prep task allows twenty seconds of mental planning but no written notes.

Both tasks must pass. A strong prepared response cannot compensate for weak spontaneous production.

## Response window

Calibrated responses target sustained speech rather than sentence repetition.

- minimum scored duration: **40 seconds**;
- automatic ceiling: **105 seconds**;
- minimum recognized content: 80–85 words depending on the prompt;
- calibrated speaking-rate band: 70–200 recognized words/minute.

The broad rate band prevents the app from treating raw speed as fluency.

## Observable oral evidence

P33 reuses P31's structural discourse evaluator for observable transcript features and adds oral-specific proxies.

### Discourse control

The evaluator considers:

- task coverage;
- argument development;
- nuance;
- cohesion;
- lexical range;
- structural complexity.

These are inferred only from the speech-recognition transcript. P33 does not claim full semantic or grammatical grading.

### Fluency proxy

Fluency combines:

- speaking-rate plausibility;
- filler frequency;
- long-pause signals between final recognition segments.

The result is deliberately called a **fluency proxy** because browser recognition events are not a phonetic timing instrument.

### Self-correction

Explicit reformulation markers such as “je veux dire” or “plus exactement” are recorded as metadata.

Self-correction is **not penalized by itself**. Controlled reformulation can be normal competent speech.

## Confidence-aware abstention

A calibrated oral task requires usable French speech-recognition confidence.

If the browser:

- does not expose speech recognition;
- cannot capture speech;
- produces an operational recognition error; or
- returns confidence below the minimum usable threshold,

P33 marks the task **unscored / abstained**.

An abstention is not treated as evidence of weak French.

A later ASR abstention also does not invalidate an older still-current successful oral calibration. A newer *scored failure* does supersede the older pass for current qualification.

## What P33 does not grade

P33 explicitly does **not** infer:

- accent quality;
- native-likeness;
- phoneme-level pronunciation accuracy;
- prosody quality;
- every hesitation;
- every grammatical error.

P16 remains useful pronunciation/shadowing practice, but P33 only uses speech recognition for recoverability and transcript/timing evidence it can defend.

## Privacy

Raw learner speech is not persisted by French.

P33 persistent/synced state contains only:

- prompt ID;
- task mode;
- pass / abstention status;
- aggregate score and confidence;
- recognized word count;
- response duration;
- words per minute;
- aggregate ASR confidence;
- fluency and discourse scores;
- filler ratio;
- long-pause count;
- explicit self-correction count;
- P31-derived axis scores;
- topic coverage;
- evaluator version.

It stores neither:

- recognized transcript;
- audio recording;
- audio Blob;
- live ASR segments;
- learner response text.

The browser's speech-recognition implementation may use its own speech service; P33 does not represent that external processing as local-only.

## Assessment prerequisites

A **calibrated** P33 attempt requires current:

1. P31 B2 open-production evidence;
2. P32 B2 integrated-skills evidence.

Practice can be opened separately, but it does not become qualification evidence.

This keeps browser ASR from becoming the sole authority for B2 production quality.

## P25 integration

For B2 only, the P25 **Speaking** gate now additionally requires current P33 evidence.

When current, the gate conservatively uses the minimum of:

- its existing P16-derived speaking score/confidence;
- P33 oral score/confidence.

Therefore neither vocabulary-level spoken practice nor one strong oral calibration can compensate for weakness in the other.

## P28 benchmark integration

A B2 P28 benchmark cannot start or pass without current P33 evidence.

P33 also repairs the prerequisite continuation chain. P31 and P32 “continue benchmark” controls now re-enter the current `v5190StartBenchmark` gate rather than calling captured older implementations.

The resulting sequence is:

**P31 → P32 → P33 → P28 B2 benchmark**

No later prerequisite can be bypassed by a continuation button from an earlier phase.

## Study Coach

When:

- urgent review debt is not dominant;
- P31 is current;
- P32 is current;
- P33 is missing or stale;
- the learner is on the B2 frontier,

Study Coach can recommend:

**Calibrate B2 spontaneous speaking**

## THIEPN Languages / Hub

The shared schema remains:

`p8-read-model-v1`

The French producer advances to:

`french-p8-read-model-v5`

It adds one aggregate metric:

`b2-spontaneous-oral-calibration`

Hub receives only the current-pass bit. No transcript, audio, ASR segment data, or detailed oral rubric is projected.

## Verification

`scripts/verify-spontaneous-oral-p33.mjs` verifies:

- app / phase version;
- six-prompt oral bank;
- three mixed zero-prep / brief-prep pairs;
- 20-second prep policy;
- 40–105 second response window;
- ASR-confidence abstention;
- continuous French speech recognition;
- no accent-quality claim;
- privacy-minimal persistence;
- P31/P32 prerequisites;
- P25 B2 speaking-gate integration;
- P28 start/pass integration;
- dynamic prerequisite-chain continuation;
- Study Coach routing;
- Hub producer v5 and oral metric;
- JavaScript syntax;
- offline-shell revision.
