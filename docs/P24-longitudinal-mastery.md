# P24 — Longitudinal Mastery Model & Forgetting Calibration

French v5.15.0

## Purpose

P24 separates **recent performance** from **durable retention**.

Earlier phases already track FSRS-compatible memory state, active-use mastery, cross-skill evidence, and adaptive session outcomes. P24 does not replace those systems. It adds a longitudinal interpretation layer that answers four different questions:

- what is strong right now;
- what is likely to remain retrievable after time passes;
- which knowledge looks strong but is fragile;
- whether French's forgetting forecasts match the learner's observed delayed recall.

The central rule is:

> recent successful practice can raise current evidence, but it cannot by itself create durable mastery.

## Evidence sources

P24 derives its model from evidence French already owns:

- FSRS-compatible stability and retrievability;
- review timestamps and intervals;
- delayed successful and failed retrievals;
- P13 recognition, active recall, phrase, sentence and transfer evidence;
- independent-vs-supported attempts;
- evidence span across calendar days;
- repeated lapses and relearning state.

No recommendation, launch, page view, or session completion is treated as mastery evidence on its own.

## Longitudinal mastery states

Each started vocabulary note receives one conservative state:

1. **Seen** — there is learning evidence, but no stronger claim is justified.
2. **Learned** — basic recognition/memory evidence exists.
3. **Retrievable** — current and near-term recall are supported.
4. **Usable** — active production evidence exists independently of recognition.
5. **Durable** — active use and delayed retrieval have survived meaningful spacing.

Unstarted core vocabulary is counted separately as **Unseen**.

The states are intentionally cumulative and conservative.

## Durable gate

A note cannot become **Durable** from repeated same-day success.

The v1 gate requires all of the following:

- the note has already reached **Usable**;
- its corrected 30-day retention forecast is at least 62%;
- at least two successful retrievals occurred after gaps of 7 days or more;
- its evidence spans at least 21 days;
- longitudinal evidence confidence is at least 42%.

This gate is separate from P13's existing DURABLE/ROBUST vocabulary labels. P13 measures broad active mastery; P24 specifically requires evidence that survives time.

## Retention forecasts

P24 exposes forecasts at:

- 1 day;
- 7 days;
- 30 days;
- 90 days.

The forecast begins with the current FSRS-compatible memory state of started recognition, production, and listening skill cards.

For each skill card:

`R(t) = 0.9 ^ ((elapsed + horizon) / stability)`

P24 combines the started skill forecasts conservatively:

- recognition is always the anchor;
- production receives nearly equal weight once it exists;
- listening adds a smaller contribution when it has started.

The global forgetting-calibration correction is then applied.

Forecasts are required to remain monotonic:

`1d ≥ 7d ≥ 30d ≥ 90d`

## Forgetting calibration

P24 compares historical delayed retrieval outcomes with the memory model that existed before those retrievals.

For a delayed pair, it uses:

- the previous review's stored stability;
- the actual gap until the next comparable retrieval;
- the implied recall probability at that delay;
- whether the later retrieval succeeded.

Calibration uses recognition, recall, and listening retrievals with gaps of at least one day.

The correction:

- remains **zero** until at least 12 delayed retrieval pairs exist;
- uses only 45% of the raw observed-minus-predicted gap;
- is bounded to **±8 percentage points**;
- changes P24 forecasts, not the underlying FSRS schedule.

## Uncertainty

Every horizon receives a conservative uncertainty band. The band narrows as evidence confidence grows and remains wider while forgetting calibration has little delayed data.

These are model uncertainty bands, not guarantees or formal statistical confidence intervals.

## Fragile knowledge

P24 marks a learned item as **fragile** when evidence looks good in the short term but long-term retention is not yet convincing.

Signals include:

- strong 7-day but weak 30-day forecast;
- repeated failures after 7+ day gaps despite otherwise strong active evidence;
- at least three historical lapses.

Fragility does not erase mastery. It tells the orchestrator that current strength may not be durable.

## Relearning

Relearning remains distinct from ordinary weakness. P24 detects cards already in the scheduler's relearning state and surfaces the aggregate count. It does not create a parallel relearning schedule.

## P22/P23 integration

P24 feeds longitudinal evidence back into the existing orchestrator.

P22's **Durable vocabulary** skill now uses a weighted longitudinal forecast:

- 35% 7-day retention;
- 40% 30-day retention;
- 25% 90-day retention.

The Mixed Review candidate receives a bounded additional risk adjustment when a large fraction of learned knowledge is fragile or the average 30-day forecast is below target. The adjustment is limited to **+18 scheduler points** and the final score remains capped at 120.

P23's learned calibration bonus remains independent and bounded as before.

## Daily longitudinal snapshots

P24 stores at most one aggregate snapshot per day. A snapshot contains only counts, aggregate forecasts, evidence confidence, and forgetting-calibration metadata.

It does **not** store learner answers, reading text, imported open-world text, transcripts, expected-answer strings, speech recordings, or per-word historical copies.

Up to 400 daily snapshots are retained.

## UI

Home receives a compact **Retention outlook** strip rather than another dashboard.

Progress receives the full longitudinal panel:

- Unseen → Durable distribution;
- 1/7/30/90-day forecasts;
- uncertainty bands;
- forgetting-calibration status;
- 30-day trend;
- most fragile learned vocabulary.

## Persistence

P24 uses:

- `french-longitudinal-mastery-v1`

P24 state participates in localStorage, depth snapshots, import/restore, and IndexedDB hydration.

Existing French3000-era persistence identifiers remain untouched for backward compatibility.

## QA

P24 adds **Longitudinal mastery & forgetting calibration** to the QA chain.

The audit verifies:

- at most 400 snapshots;
- one snapshot per day;
- no future snapshot timestamps;
- forgetting correction inside ±8 points;
- all forecasts inside [0,1];
- monotonic 1/7/30/90-day forecasts;
- the Durable spacing gate;
- absence of raw learner content in P24 persistence.

## Evidence boundary

P24 forecasts are decision-support estimates. They do not guarantee future recall at an exact percentage. The model is deliberately conservative because durable language ability matters more than an inflated mastery number.

## PWA

P24 uses shell cache:

- `french-shell-v35`
