# P23 — Adaptive Session Composition, Outcome Feedback & Orchestrator Self-Calibration

French3000 v5.14.0

## Purpose

P22 could choose the best single next activity across French3000.

P23 extends that into a short adaptive learning block:

- compose several complementary activities around the current highest-value gap;
- preserve prerequisite order when a downstream task is not yet well supported;
- add a downstream transfer activity when readiness is high enough;
- observe what evidence changed after each completed step and after the whole block;
- allow optional learner feedback about session fit;
- make only small, bounded future ranking adjustments after repeated observations.

P23 remains an orchestration system. It does not create a second language-learning model and it does not treat a recommendation, click, or launch as learning evidence.

## Adaptive block composition

A block contains at most **three activities**.

The default time budget is approximately **26 minutes**.

Estimated activity durations are used only for composition:

- Mixed Review — 10 min
- Usage — 7 min
- Phrase transfer — 7 min
- Sentence production — 8 min
- Reading — 6 min
- Listening — 6 min
- Speaking — 8 min
- Adaptive conversation — 10 min
- Mission — 15 min
- Open-world French — 8 min

The estimates do not create timers or enforce completion time.

## Composition strategy

P23 starts from the calibrated P22 activity ranking.

The highest-ranked normal activity becomes the **anchor**.

The composer then considers:

1. prerequisite support before the anchor when readiness is low;
2. the anchor activity itself;
3. downstream transfer after the anchor when readiness is sufficient;
4. other high-ranked complementary work if the block still has time and capacity.

The same dependency graph introduced by P22 is reused:

- vocabulary → usage;
- usage → phrase;
- phrase → sentence;
- vocabulary → reading;
- reading → listening;
- sentence + listening → speaking;
- speaking + sentence → conversation;
- conversation → mission;
- reading + vocabulary → open-world French.

Composition does not block manual access to any mode.

## Resume and ownership rules

Existing work still owns the learning state.

A new P23 block cannot begin while French3000 has resumable work such as:

- a saved study session;
- an active conversation;
- an active mission;
- an active P20 adaptive conversation set.

Once a P23 block exists, it owns the P22 recommendation slot. P22 therefore shows **Continue adaptive block** instead of recommending unrelated work in parallel.

For reading, listening, speaking, and open-world steps, P23 first restores the current in-memory surface when possible. It does not restart an in-progress activity merely because the learner navigated to Home and pressed Resume.

Ending the P23 block ends orchestration only. It does not silently delete or abort an underlying activity already started in its native subsystem.

## Completion ownership

P23 does not invent completion rules.

It listens to the normal completion boundary of each subsystem:

- review / usage / phrase / sentence — normal study-session completion;
- reading — P14 reading completion;
- listening — P15 contextual item completion;
- speaking — completion of Speak 10;
- conversation — completion of the P20 adaptive focus set;
- mission — P18 mission finalization;
- open-world French — P21 exposure completion.

The native subsystem remains authoritative for all evidence written during the activity.

## Step-level outcome capture

At step launch P23 stores a small baseline:

- target skill strength;
- evidence confidence;
- unified evidence readiness;
- cross-skill balance when qualified.

At normal activity completion it stores the same values again.

A step can therefore report:

- strength movement;
- confidence movement;
- optional activity-quality signal when one exists.

Examples of optional quality signals include:

- study-session accuracy;
- recent listening correctness;
- recent reliable speaking correctness;
- conversation independence;
- mission independence;
- open-world lexical familiarity.

These measurements are observational.

They are not interpreted as causal proof that the activity produced the change.

## Block-level outcome

When the final step finishes, P23 records:

- target-skill change;
- unified readiness change;
- qualified balance change;
- bounded aggregate observation.

The aggregate observation is limited to the interval **[-0.5, 0.5]**.

The user-facing result explicitly labels this as observed evidence movement rather than a learning-effect estimate.

## Optional learner feedback

After a completed block the learner can optionally label session fit as:

- Useful
- Neutral
- Too easy
- Too hard

This feedback is stored with the completed P23 run.

It influences later calibration only slightly.

It does not directly change mastery, card intervals, CEFR claims, or underlying subsystem evidence.

## Conservative activity attribution

P23 does not give every activity the same block result.

For each completed activity it builds a bounded observational value from:

- that step's own strength movement;
- that step's confidence movement;
- a very small quality contribution when available;
- a smaller share of the whole-block outcome;
- optional learner session-fit feedback.

This is still association, not causal attribution.

## Self-calibration

Self-calibration adjusts only the scheduler.

For each activity P23 tracks recent completed-block observations.

A learned ranking bonus:

- remains **0** until the activity has appeared in at least **3 completed adaptive blocks**;
- is based on recent observations rather than lifetime history;
- is bounded to **-6 to +6 scheduler points**;
- is recomputed deterministically from stored completed runs;
- cannot directly alter any mastery score.

The P22 base score remains the dominant signal.

This prevents early overfitting and keeps the system explainable.

## Repetition and P22 interaction

P22's existing:

- need;
- evidence confidence;
- transfer gap;
- prerequisite readiness;
- novelty;
- due pressure;
- recent-mode penalty

remain active.

P23 adds at most a small learned bonus on top.

The P22 factor display exposes the learned adjustment when it is non-zero.

## Home

Home now includes an **Adaptive block** panel below the P22 recommendation layer.

Before a block begins it previews:

- planned activities;
- estimated total minutes;
- current target;
- order of work.

During a block it shows:

- completed-step count;
- current step;
- Start next / Resume;
- End block.

When a P23 block is active, other major surfaces receive a compact continuation banner.

## Progress

Progress adds:

- current or proposed adaptive block;
- outcome summary from the latest completed block;
- per-step evidence movement;
- optional session-fit controls;
- calibration table for every orchestrated activity;
- observation count and current bounded bonus.

## Persistence

P23 uses:

- `french3000-adaptive-session-composer-v1`

Persisted state contains only orchestration metadata and aggregate evidence points:

- active block structure;
- activity IDs and safe target IDs;
- scheduler scores;
- timestamps;
- aggregate before/after evidence points;
- bounded deltas;
- optional quality ratios;
- completed-run feedback.

It does not persist:

- raw imported P21 text;
- learner speech recordings;
- speech-recognition transcripts;
- expected answer strings;
- reading passages;
- arbitrary learner-generated responses.

P23 state participates in:

- localStorage;
- depth snapshot;
- import/restore;
- IndexedDB hydration.

## QA

P23 adds **Adaptive session composer & calibration integrity** to the existing QA chain.

The audit checks:

- run-history bounds;
- maximum three steps;
- valid active-step index;
- bounded block observations;
- recognized activity IDs;
- calibration bounds;
- the three-observation minimum before non-zero calibration;
- absence of raw learning content in P23 persistence.

## Evidence boundary

P23 does not claim that its scheduler has learned the true causal effectiveness of a teaching method.

Its self-calibration means:

> repeated completed blocks can make small scheduling corrections when a pattern of useful or poor observed outcomes persists.

It does not mean:

> French3000 has experimentally proven that activity A causes more learning than activity B.

This distinction is deliberate.

## PWA

P23 uses shell cache:

- `french3000-shell-v33`

The manifest now advertises adaptive multi-activity session composition and bounded outcome self-calibration.
