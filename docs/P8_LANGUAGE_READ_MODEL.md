# P8 Language Read Model

French now exposes a privacy-minimal P8 language read model from the existing single-file application.

Platform pin:

- `thiepn/languages@e74a10aa9d9d161c7f427ce7691be32df4bbc31c`
- read model package: `0.8.0`
- contract: `p8-read-model-v1`

The browser artifact is vendored at:

`vendor/thiepn-languages-read-model.js`

and cached in the service-worker app shell.

## Authoritative inputs

The producer reads existing French state only:

- `overallStats()`, `todayStats()`, `rollingStats(7)` and `studyStreak()`;
- P22/P23 `coachSnapshot()` for the recommended next action;
- the target-date study-plan snapshot;
- P25 `v5160Progression()` / current frontier / promotion history;
- P28 fixed functional-benchmark history and P29 longitudinal maintenance snapshots;
- the current review-log timestamp for freshness/state revision.

It does not alter those systems.

## Projection

The emitted snapshot contains:

- due/new/practice/course workload;
- today and seven-day activity counts;
- streak and last-study timestamp;
- vocabulary and target-curriculum progress counters;
- functional benchmark levels passed, long-term-transfer levels, and maintenance-due levels;
- internal CEFR-aligned gate dimensions;
- highest internally promoted band and current frontier;
- the coach's existing recommended action.

The projection is exposed through:

`globalThis.THIEPN_FRENCH_LANGUAGE_READ_MODEL.getSnapshot()`

and can emit a browser event using:

`globalThis.THIEPN_FRENCH_LANGUAGE_READ_MODEL.publish()`

## Privacy

The producer does not export raw review entries, answers, StudyEvents, memory traces, account identifiers or private content.

The shared P8 validator rejects raw/private fields.

## Proficiency scope

French reports:

`THIEPN French internal CEFR-aligned gates`

with claim type `internal`.

This preserves the existing P25 rule that promotion is an internal evidence gate, not an accredited CEFR certificate.

## Authority

French remains authoritative for content, review scheduling, mastery, CEFR gates, coach/orchestration, persistence and THIEPN Account sync.

P8 only produces a Hub-facing projection.

Authenticated cross-device persistence of this projection is deferred to P9.


## Producer refresh after P30

The P8 envelope remains `p8-read-model-v1`; no transport/schema change was required.

French producer revision `french-p8-read-model-v2` additionally projects the current P28/P29 longitudinal functional evidence as labelled Hub progress metrics:

- functional benchmark levels passed;
- long-term transfer levels;
- functional maintenance due.

P30's B2 corpus unlock flows through the existing P25 frontier and P28/P29 systems rather than becoming a separate Hub proficiency claim.

Verification continues to use the unchanged `p8-read-model-v1` privacy and authority guarantees.


## Producer refresh after P31

The shared envelope still remains `p8-read-model-v1`.

French producer revision `french-p8-read-model-v3` adds one privacy-minimal aggregate metric:

- `b2-open-production-calibration` — 1 when the current P31 B2 open-production calibration is valid, otherwise 0.

The producer reads this signal from `v5220CalibrationSnapshot()`. It never exports learner response text, rubric-axis detail, drafts, or prompt content.

P25 remains the proficiency authority. P31 only strengthens the B2 transfer evidence that P25 consumes.


## P33 oral calibration projection

French producer revision `french-p8-read-model-v5` adds one aggregate progress metric:

- `b2-spontaneous-oral-calibration` — 1 when the current P33 oral calibration is valid, otherwise 0.

The shared schema remains `p8-read-model-v1`. No transcript, audio, ASR segments, prompt response, or detailed oral rubric data is exported to Hub.
