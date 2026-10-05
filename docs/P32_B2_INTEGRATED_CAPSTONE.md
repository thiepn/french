# P32 — B2 Integrated-Skills Capstone, Source-Based Synthesis & Cross-Modal Transfer

French 5.23.0 adds the missing bridge between **understanding B2 input** and **producing an independent B2 response**.

P31 can evaluate the observable structure of an open-ended argument, but a learner can still produce a generic well-shaped response without showing that they understood and transformed unfamiliar input. P32 therefore adds source-grounded integrated tasks.

## Assessment design

A calibrated P32 capstone contains exactly two tasks:

1. one **reading → production** task;
2. one **listening → production** task.

Three rotating task pairs draw from the audited P30 B2 corpus.

The six task specifications use these sources:

- Réorganiser le travail hybride;
- Quand un algorithme recommande à notre place;
- Rendre la mobilité plus équitable;
- Prévenir plutôt que seulement réparer;
- Densifier sans dégrader le quartier;
- Décider quand les priorités s'opposent.

The content remains single-source: P32 references the existing P30 readings instead of maintaining duplicate transcripts.

## Reading task

The relevant French source extract remains visible.

The learner must:

- select the relevant ideas;
- reorganize them;
- connect them to a position or recommendation;
- include qualification, limitation, consequence, or compromise as required;
- avoid copying long sequences from the source.

## Listening task

The same audited B2 corpus is delivered through French speech synthesis.

During a calibrated task:

- the transcript is hidden;
- at least one play is required;
- at most **two plays** are allowed;
- the learner then produces an independent written response from the heard input.

Practice mode can reveal the transcript because practice never becomes calibration evidence.

## Source-grounded evaluator

P32 reuses the P31 six-axis structural evaluator and adds three source-transfer signals.

### Source coverage

Each task defines four source-specific concept groups.

At least **75%** of those groups must be represented in the response.

This prevents a polished but generic answer from passing.

### Transformation

The response must do more than repeat source vocabulary.

Transformation combines observable:

- argument structure;
- nuance;
- cohesion;
- task completion;
- independence from source wording.

Minimum transformation score: **52%**.

### Direct-copy ratio

P32 compares response and source five-word sequences.

A calibrated response must keep direct five-gram reuse at or below **18%**.

This is not a plagiarism detector. It is a narrow anti-copy control that makes source transformation materially different from copying the input.

## Per-task gates

Every task must satisfy the underlying P31 structural gates plus:

- minimum task word count: 100;
- source coverage ≥ 75%;
- transformation ≥ 52%;
- direct-copy ratio ≤ 18%;
- evaluator confidence ≥ 70%;
- valid listening evidence for listening tasks.

A strong average cannot compensate for a failed task.

## Capstone gates

Both tasks must pass.

The pair must contain one reading task and one listening task.

Across both tasks:

- mean integrated score ≥ **64%**;
- mean evaluator confidence ≥ **70%**.

A successful capstone remains current for **35 days**, matching the P31 calibration window and remaining compatible with P29 maintenance timing.

A newer failed capstone supersedes an older pass for current qualification purposes while historical attempts remain preserved.

## Limits of the offline evaluator

P32 does **not** claim to verify:

- every factual inference from the source;
- every grammatical choice;
- subtle semantic faithfulness;
- accredited CEFR integrated-skills performance.

“Source grounded” means that observable source concepts are represented and transformed. The evaluator explicitly abstains from stronger semantic claims it cannot justify offline.

## Privacy

P32 does not persist learner prose.

Persistent/synced state contains only:

- task ID;
- source ID;
- modality;
- integrated score;
- confidence;
- P31-derived axis scores;
- source-coverage score;
- transformation score;
- direct-copy ratio;
- listening play count;
- word/sentence counts;
- duration;
- pass/fail status;
- evaluator version.

Neither the response text nor a duplicated source transcript is stored in P32 state.

## P31 dependency

A calibrated P32 attempt requires a current P31 open-production calibration.

Practice remains available independently.

This keeps the assessment hierarchy explicit:

1. P31: can the learner independently build a sustained B2 response?
2. P32: can the learner do that **from unfamiliar B2 input**?

## P25 integration

For B2 only, the P25 active-transfer gate now requires both:

- current P31 open-production evidence;
- current P32 integrated source-transfer evidence.

When P32 is current, the transfer gate conservatively uses the minimum of its existing score/confidence and the P32 capstone score/confidence.

Earlier CEFR levels remain unchanged.

## P28 integration

A B2 P28 functional benchmark cannot start or pass without current P32 evidence.

If P31 is missing, P31 remains the first prerequisite.

If P31 is current but P32 is missing, starting the B2 benchmark opens P32 first.

P28 remains the multi-scenario functional benchmark; P32 does not replace it.

## Study Coach

When the B2 frontier is active, P31 is current, and P32 is missing or stale, Study Coach can recommend:

**Complete B2 integrated-skills capstone**

Urgent review debt, P29 maintenance, and missing P31 calibration retain their existing priority.

## THIEPN Languages / Hub

The shared read-model schema remains `p8-read-model-v1`.

The French producer revision advances to:

`french-p8-read-model-v4`

A new aggregate metric is projected:

`b2-integrated-capstone`

Only the current-pass bit is exported. Raw text, source excerpts, detailed rubric internals, and listening history are not exposed through the Hub contract.

## Verification

`scripts/verify-integrated-capstone-p32.mjs` checks:

- app/release version;
- six-task source bank;
- three reading/listening pairs;
- B2-only source references;
- source-coverage and transformation gates;
- five-gram anti-copy control;
- transcript-hidden two-play calibrated listening;
- privacy-minimal persistence;
- P31 dependency;
- P25 and P28 integration;
- Study Coach routing;
- Hub producer v4 and capstone metric;
- JavaScript syntax;
- offline-shell revision.
