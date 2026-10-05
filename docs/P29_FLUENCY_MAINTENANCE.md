# P29 — Functional Fluency Consolidation, Maintenance & Long-Term Transfer

French 5.20.0 turns P28 benchmark passes into a longitudinal evidence model.

## Core rule

P29 does not create a second proficiency authority.

P28 remains the only source of functional-benchmark pass/fail evidence. P29 asks whether that evidence has survived enough time and enough context variation to be considered consolidated, maintained, or long-term.

Ordinary vocabulary review, conversation practice, XP, streaks, and time spent never refresh P29 maintenance.

## Evidence stages

### Initial pass

The first successful P28 benchmark establishes a functional baseline for that level.

It does not immediately claim durable fluency.

### Consolidation

A second successful P28 benchmark can become a spaced pass only when it occurs at least **7 days** after the previous qualifying pass.

Two spaced passes establish consolidation.

### Context transfer

P29 stores the P28 mission/scenario variant signature used by each benchmark pass.

Multiple distinct signatures provide direct evidence that the learner is not merely repeating an identical deterministic path.

Context diversity is reported separately from spacing. It is required for the strongest long-term-transfer state.

### Maintenance

After consolidation, the evidence checkpoint repeats every **30 days** from the latest successful P28 pass.

When the checkpoint arrives, P29 asks for another P28 benchmark. Practice outside the benchmark cannot reset the deadline.

### Long-term transfer

A level reaches the long-term-transfer state only when all of these are true:

- at least three spaced benchmark passes exist;
- the first and latest successful passes span at least **60 days**;
- at least two distinct verified mission/scenario variant patterns exist.

The long-term state still has recurring maintenance checkpoints.

## Failed re-tests

A failed P28 attempt after the most recent pass creates a **requalification needed** state.

The old successful result is preserved as historical evidence, but P29 stops presenting it as current maintained evidence until a new benchmark pass is earned.

This avoids both extremes:

- deleting genuine historical achievement;
- pretending a newer failed re-test never happened.

## Stale evidence

A maintenance checkpoint has a 30-day grace period.

After that, P29 marks the evidence as **stale**.

This is deliberately an evidence claim, not an ability claim:

> stale evidence does not mean the learner is assumed to have lost the language.

The correct action is fresh re-measurement.

## Level scope

P29 tracks only levels for which P28 has a valid benchmark:

- A1
- A2
- B1

B2 remains unavailable until P27/P28 have sufficient audited B2 communicative content and a real B2 benchmark battery.

## Product integration

P29 adds:

- a Progress panel with per-level longitudinal status;
- spaced-pass, context-diversity, evidence-span, and due-date metrics;
- re-test actions only when maintenance evidence is due;
- a Dashboard maintenance card when action is required;
- Study Coach routing to a `maintenance` action when no higher-priority review debt exists;
- Hub/read-model `maintain` next-action support;
- Hub `maintenanceNeeded` propagation.

## Persistence

P29 itself is derived and therefore needs no new persistent authority.

The necessary evidence already lives inside P28 benchmark history, which is included in:

- local snapshots;
- IndexedDB;
- export/import;
- THIEPN Account sync.

P29 extends P28 mission results with a compact deterministic `contextSignature` so future passes can demonstrate variant diversity.

## Verification

`scripts/verify-fluency-maintenance-p29.mjs` checks:

- app version/release;
- 7/30/60-day longitudinal thresholds;
- context-signature capture;
- P28-only pass sourcing;
- failed-retest requalification;
- stale-evidence semantics;
- B2 exclusion;
- Study Coach maintenance routing;
- Hub `maintain` integration;
- the P29 QA policy;
- JavaScript parse validity;
- offline-shell revision.
