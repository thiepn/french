# P31 — B2 Open-Ended Production, Argumentation Quality & Advanced Assessment Calibration

French 5.22.0 adds a conservative open-ended production layer for B2.

P30 made B2 structurally available, but its conversation engine still evaluates bounded communicative intents. P31 addresses the next problem: a learner can satisfy a sequence of accepted intents without demonstrating that they can independently build a sustained, nuanced argument.

P31 therefore evaluates longer open-ended French responses while explicitly refusing to pretend that an offline heuristic can fully grade grammar, semantics, or factual quality.

## Assessment model

A calibrated assessment contains **two independent open-ended tasks** selected from rotating prompt pairs.

The prompt bank covers:

- workplace policy argumentation;
- contested city policy;
- evaluating a disputed media claim;
- project-crisis decision making;
- team-conflict mediation;
- difficult priority synthesis.

Each prompt targets about 150 words and requires at least 110 words.

The learner must explicitly attest that the calibrated response was written without:

- a translator;
- an AI-generated answer;
- a model response;
- notes.

Practice mode is separate and may show a planning scaffold. Practice never becomes calibration evidence.

## Six-axis rubric

The offline evaluator measures only observable features:

| Axis | What it measures |
| --- | --- |
| Task coverage | Required rhetorical moves for the prompt |
| Argumentation | Position, reasons, examples/evidence, counter-position, consequences, conclusion |
| Nuance | Qualification, concession, uncertainty, conditions, contrast |
| Cohesion | Explicit relationships between reasons, examples, contrast, conditions, consequences, sequence, and conclusion |
| Lexical range | Content-word diversity plus a conservative lexical-sophistication proxy |
| Structural complexity | Sentence development, subordinate structures, and conditional-form evidence |

The evaluator also records:

- word count;
- sentence count;
- marker-family breadth;
- repetition penalty;
- evaluator confidence;
- response duration.

## What the evaluator does not claim

P31 does **not** claim to determine:

- whether every grammatical form is correct;
- whether every factual statement is true;
- whether every subtle semantic relationship is appropriate;
- an accredited CEFR writing score.

The result is deliberately described as **calibrated structural evidence**.

When the response is too short, too repetitive, structurally incomplete, or low-confidence, the evaluator abstains from granting a pass.

## Per-task hard gates

A task must satisfy all of these:

- at least 110 words;
- at least 4 sentences;
- at least 60% of prompt-specific rhetorical requirements;
- argumentation score ≥ 42%;
- nuance score ≥ 35%;
- cohesion score ≥ 35%;
- total structural score ≥ 58%;
- evaluator confidence ≥ 66%;
- repetition penalty ≥ 80%.

No strong average can compensate for a failed task.

## Assessment hard gates

Both tasks must pass.

Across the two tasks:

- mean structural score must be at least **62%**;
- mean evaluator confidence must be at least **68%**.

A successful calibration remains current for **35 days**. A newer failed assessment supersedes an older current pass for present qualification purposes, while historical attempts remain preserved.

## Calibration controls

P31 includes fixed strong/weak calibration fixtures.

Runtime QA verifies that:

- the weak fixture cannot pass;
- the strong fixture does pass;
- the strong fixture scores above the weak fixture;
- the validity window remains compatible with P29 maintenance timing;
- the marker detector uses phrase boundaries instead of arbitrary substring matches.

This does not make the evaluator equivalent to a human examiner. It protects against accidental scoring drift inside the app.

## Privacy

P31 never stores the learner's response text.

Persistent/synced state contains only:

- prompt ID;
- task kind;
- score;
- confidence;
- axis scores;
- word/sentence counts;
- marker-family IDs;
- repetition penalty;
- timing;
- pass/fail status;
- evaluator version.

The textarea exists only in transient UI memory. Closing or reloading can therefore discard an unfinished draft.

P31 state participates in the existing local snapshot, IndexedDB, export/import, and THIEPN Account synchronization chain without exposing raw learner prose.

## P25 integration

For B2 only, the P25 **active transfer** gate now requires a current P31 calibration.

If no current calibration exists:

- the existing transfer evidence remains visible;
- the B2 transfer gate is marked as lacking coverage;
- B2 cannot be currently qualified from sentence-level transfer alone.

When calibration exists, P25 combines the signals conservatively:

- transfer score = the lower of the existing transfer score and P31 score;
- transfer confidence = the lower of the existing transfer confidence and P31 confidence.

This prevents one strong source from averaging away weakness in the other.

Earlier CEFR levels are unchanged.

## P28 integration

A B2 P28 functional benchmark cannot start without current P31 calibration.

If B2 is selected without current calibration, French opens the P31 assessment first.

A legacy/in-progress B2 benchmark also cannot record a successful final result if current P31 calibration is missing.

P31 therefore becomes the open-ended production prerequisite, while P28 remains the functional multi-scenario benchmark.

## P29 integration

P29 continues to own delayed consolidation and long-term functional maintenance.

Because P31 calibration is current for 35 days and P29's regular maintenance checkpoint is 30 days, a normal B2 maintenance cycle can reuse a recent P31 pass. If the production calibration becomes stale, the next B2 functional benchmark requires fresh P31 evidence first.

Historical P28/P29 evidence is never deleted.

## Study Coach

When the learner's study frontier is B2 and no current P31 calibration exists, Study Coach can recommend:

**Calibrate B2 open-ended production**

Urgent review debt and functional-maintenance work retain higher priority.

## THIEPN Languages / Hub

The shared P8 read-model schema remains unchanged.

The French producer revision advances to:

`french-p8-read-model-v3`

A new aggregate progress metric is exposed:

`b2-open-production-calibration`

Only the current pass bit is projected. Raw responses and rubric internals are not exported through the Hub contract.

## Verification

`scripts/verify-open-production-p31.mjs` verifies:

- app/release version;
- six-prompt bank and rotating two-task sets;
- six-axis evaluator;
- exact marker matching;
- confidence and abstention gates;
- 35-day validity;
- privacy-minimal persistence;
- P25 transfer integration;
- P28 start/final-pass integration;
- Study Coach routing;
- P8 producer revision and metric;
- JavaScript syntax;
- offline shell revision.
