# P22 — Unified Cross-Skill Adaptive Orchestration & Next-Best-Activity Engine

French3000 v5.13.0

## Purpose

P22 changes French3000 from a collection of individually adaptive learning modes into one coordinated learning system.

Before P22, each major subsystem already had its own evidence and recommendation logic:

- durable vocabulary and mixed retrieval;
- reference-backed usage;
- phrase transfer;
- sentence production and transfer;
- contextual reading;
- contextual listening;
- spoken production;
- multi-turn conversation;
- real-world missions;
- communicative-function mastery;
- open-world French exposure.

The remaining problem was **cross-skill orchestration**. A learner could have strong vocabulary but weak listening, strong sentence production but little spoken transfer, or good conversation evidence but no mission-level transfer, while the home screen still exposed several independent recommendations.

P22 introduces one next-best-activity ranking layer above those existing systems.

It does not replace their evidence models and does not create mastery merely because an activity was recommended or started.

## Cross-skill evidence map

P22 derives live profiles for:

- Durable vocabulary
- Natural usage
- Phrase transfer
- Sentence transfer
- Reading comprehension
- Context listening
- Spoken production
- Conversation independence
- Functional missions
- Communicative functions
- Open-world exposure

Each profile has two separate quantities:

- **strength** — what the underlying evidence currently supports;
- **evidence confidence** — how much relevant evidence exists.

Missing evidence is therefore not treated as demonstrated failure.

Visible evidence states are:

- unseen;
- emerging;
- developing;
- functional;
- secure.

These are orchestration states, not CEFR certifications.

## Evidence ownership

P22 reads existing subsystem outputs rather than creating parallel scoring rules.

Examples:

- vocabulary strength comes from P13 durable active mastery;
- usage comes from P10 reference-backed construction evidence;
- phrase transfer comes from P11;
- sentence transfer comes from P12;
- reading uses P14 completion and retrieval checks;
- listening uses P15 correctness and unsupported success;
- speaking uses P16 reliable spoken evidence;
- conversation uses P17 independence and scenario security;
- missions use P18 independence passes;
- communicative functions use P20 function profiles;
- open-world activity uses P21 aggregate exposure only.

The original subsystem remains authoritative for its own evidence.

## Transfer graph

P22 models a practical dependency chain.

Examples:

- vocabulary → usage;
- usage + vocabulary → phrase transfer;
- phrase + usage → sentence transfer;
- vocabulary → reading;
- reading + vocabulary → listening;
- sentence + listening → speaking;
- sentence + speaking + communicative functions → conversation;
- conversation + communicative functions → missions;
- vocabulary + reading → open-world French.

This allows P22 to detect a **downstream transfer gap**.

If upstream knowledge is substantially stronger than the downstream skill, the downstream activity receives additional priority.

The graph is a scheduling heuristic only. It does not block access to any mode.

## Next-best-activity scoring

Every launchable activity receives a priority score built from:

- current skill need;
- evidence confidence;
- upstream-to-downstream transfer gap;
- prerequisite readiness;
- activity novelty;
- recent repetition penalty;
- activity-specific urgency.

Examples of activity-specific urgency include:

- due-card pressure for Mixed Review;
- unresolved usage/transfer gaps;
- sentence-transfer gaps;
- lexical/aural mismatch for listening;
- sentence-to-speaking mismatch;
- weak communicative-function coverage;
- conversation readiness for missions.

Low prerequisite readiness now suppresses premature downstream recommendations. This prevents a new learner with little vocabulary evidence from being pushed directly into mission-level work merely because mission evidence is absent.

## Resume-first rule

Existing work always outranks new work.

P22 checks, in order, for:

- an active P20 adaptive conversation set;
- an active P18 mission;
- an active P17 conversation;
- a saved study session.

When one exists, the orchestrator presents that work as the next action instead of creating a competing session.

This preserves the transactional state protections introduced in P19/P20.

## Ranked activities

P22 can rank and launch:

- Mixed Review;
- Usage 10;
- Phrase transfer 10;
- Sentence 10;
- recommended contextual reading;
- recommended contextual listening;
- Speak 10;
- Adaptive conversation · 3 tasks;
- recommended real-world mission;
- Open-world French input.

Only currently launchable activities are included.

The top result is the recommended next activity. Two alternatives are also shown so the learner retains agency without having to navigate through separate mode dashboards.

## Explainability

Each recommendation exposes the main scheduling factors:

- gap;
- evidence confidence;
- transfer gap;
- prerequisite readiness;
- recent repetition penalty.

The recommendation also includes a short natural-language reason generated from deterministic app state.

The priority number is a scheduler score, not a mastery score.

## Repetition control

P22 persists only launch history:

- time;
- activity ID;
- priority score at launch;
- launch surface.

Recent repetition creates a penalty, especially when the same activity is chosen repeatedly.

This keeps the adaptive loop from collapsing into one modality when several useful activities are available.

Stored history is bounded to 300 launches.

## Home integration

Home now contains a prominent **Best next activity** panel.

It shows:

- unified evidence readiness;
- cross-skill balance;
- measured bottleneck;
- top recommendation;
- two alternatives;
- scheduling-factor traces;
- direct Start / Resume controls.

The existing specialist panels remain available below it.

## Progress integration

Progress now includes a **Cross-skill orchestration** panel.

It shows:

- strength for each measured skill;
- evidence confidence;
- evidence state;
- subsystem-specific detail;
- current top-three activity ranking;
- unified evidence readiness;
- cross-skill balance;
- measured bottleneck.

Open-world French is explicitly kept outside the core readiness average because P21 exposure is not mastery evidence.

## Sparse-evidence calibration

P22 does not report a false 100% cross-skill balance for a brand-new learner.

Balance is only computed after at least two skill streams have sufficient evidence.

With insufficient measured evidence:

- readiness remains evidence-limited;
- balance remains unqualified;
- no synthetic mastery is inferred.

## Persistence and backup

P22 uses:

- `french3000-cross-skill-orchestrator-v1`

Persisted data contains launch history only.

It participates in:

- localStorage persistence;
- depth snapshot;
- import/restore;
- IndexedDB hydration.

The cross-skill profiles and activity rankings are always recomputed from current evidence.

## QA integration

P22 extends the existing Settings QA chain with **Cross-skill orchestrator integrity**.

The audit checks:

- every skill strength is finite and bounded;
- every evidence-confidence value is finite and bounded;
- activity IDs are recognized;
- priority scores are finite and bounded;
- duplicate normal activity candidates are rejected;
- launch-history bounds are respected;
- at least one next activity is available.

A P22 integrity failure is surfaced as a normal QA failure.

## Evidence boundary

P22 is intentionally conservative.

It does **not** claim:

- a general CEFR level;
- global speaking proficiency from browser recognition;
- reading mastery from passive exposure;
- vocabulary mastery from launching an activity;
- mission proficiency from unpracticed scenarios.

It is an orchestration layer for choosing the next useful task from the evidence French3000 already owns.

## PWA

P22 uses shell cache:

- `french3000-shell-v31`

The manifest description now includes unified cross-skill next-best-activity orchestration.
