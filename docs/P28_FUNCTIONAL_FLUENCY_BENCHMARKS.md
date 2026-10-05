# P28 — Real-World Transfer & Functional Fluency Benchmarking

French 5.19.0 adds explicit functional-fluency benchmark attempts on top of the existing deterministic P18 mission engine.

## Purpose

P28 answers a narrower question than the P25 progression engine:

> Can the learner complete a fixed, level-appropriate real-world task battery independently right now?

It does **not** treat vocabulary size, accumulated practice, or prior mission history as a benchmark pass.

## Standardized batteries

| Level | Required mission battery | Minimum independence | Minimum transfer evidence | Minimum intent confidence | Maximum support |
| --- | --- | ---: | ---: | ---: | ---: |
| A1 | Morning in town | 80% | 55% | 55% | 1 |
| A2 | Arrival day + Meet, plan, decide | 82% | 58% | 58% | 1 |
| B1 | Solve everyday problems + Independent living circuit | 85% | 62% | 62% | 1 |
| B2 | unavailable | — | — | — | — |

B2 is deliberately unavailable because P27 currently exposes incomplete B2 communicative coverage. P28 does not manufacture a benchmark from missing content.

## Attempt integrity

A benchmark attempt:

- starts with a new timestamp and fixed mission order;
- counts only mission runs launched after that attempt starts;
- requires every mission in the battery to pass;
- fails immediately when one required mission fails;
- never converts old practice history into a benchmark pass;
- permits normal app support, but support above the benchmark threshold fails the run;
- persists attempt history in the same local/export/cloud snapshot system as other learner state.

The mission engine still performs its existing P18/P19/P20 calibration. P28 adds stricter level-specific hard gates instead of replacing those rules.

## Scoring

Each required mission receives a bounded composite score from:

- independent successful turns: 35%;
- calibrated transfer evidence: 25%;
- intent confidence: 20%;
- task completion: 15%;
- support independence: 5%.

The composite score is descriptive. Passing remains hard-gated; a high average cannot compensate for a failed required mission.

## UI

The Progress view shows:

- total benchmark attempts and passes;
- highest internally passed benchmark;
- A1/A2/B1 benchmark cards and thresholds;
- practice-readiness context that is explicitly separate from benchmark outcome;
- active-attempt continuation/cancellation;
- B2 as unavailable rather than misleadingly “failed.”

During an attempt, Conversation shows the current benchmark mission and a continuation/cancel control.

## Claims

A P28 pass is an **internal fixed-task functional benchmark**. It is not:

- an accredited CEFR certificate;
- a claim of unrestricted real-world fluency;
- a replacement for P25 balanced progression gates;
- evidence from tasks the learner never actually performed.

## Persistence and sync

The state key is `french-functional-benchmarks-v1`.

Benchmark state is included in:

- full local learner snapshots;
- export/import recovery;
- IndexedDB hydration;
- THIEPN Account revision-safe sync.

## Verification

`scripts/verify-functional-benchmark-p28.mjs` statically verifies the release label, fixed batteries, fresh-attempt state, hard gates, B2 lockout, persistence hooks, QA registration, and offline-shell revision.
