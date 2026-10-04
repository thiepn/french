# P20 — Adaptive Communicative Curriculum, Function Mastery & Next-Best-Task Engine

French v5.11.0

## Purpose

P20 turns the communicative stack from P12–P19 into an adaptive curriculum.

Before P20, French already had sentence production, transfer drills, authentic reading/listening, spoken production, guided conversation, real-world missions, calibrated evidence and device QA. The remaining weakness was orchestration: scenario recommendations were still driven primarily by lexical readiness, recency and replay counts.

P20 makes the app choose communicative work from demonstrated function-level gaps.

Every scenario function advertised to the adaptive curriculum must now be emitted by at least one scoring rule. P20 QA treats advertised-but-unobservable functions as a release failure.

## Communicative-function model

P20 models 25 directly observable communicative functions across five groups:

- Foundation
- Interaction
- Problem solving
- Planning & opinion
- Narrative

Examples include requesting, asking for information, clarification, correction, explanation, negotiation, disagreement, recommendation, justification and narration.

Every function profile tracks:

- attempts;
- successes;
- independent successes;
- study days;
- scenario/context diversity;
- historical completed-scenario exposure;
- evidence quality;
- independence rate;
- evidence confidence;
- recency.

Function strength is confidence-damped. A small number of successful attempts cannot immediately create a high function score.

The visible states are:

- unseen;
- emerging;
- developing;
- functional;
- secure.

“Secure” requires strong evidence, sufficient confidence, at least three independent successes, and coverage across multiple scenarios when the curriculum offers them. Functions currently represented in only one scenario instead require successful evidence across multiple wording variants.

## Privacy-minimal function evidence

P20 stores function-level attempt metadata under:

- `french3000-communicative-curriculum-v1`

It does **not** store a second copy of the learner’s response transcript.

Stored evidence includes only the minimum curriculum fields needed for adaptation:

- scenario;
- communicative function;
- level and variant;
- task node;
- success/failure;
- repair status;
- support level;
- manual continuation;
- independence;
- matcher confidence;
- calibrated evidence;
- response word count;
- number of target-word hits;
- batch/focus linkage.

Older P17 review-log evidence is used as a historical bridge only for events that predate the P20 curriculum store.

## Next-best-scenario engine

P20 replaces the P17 lexical-first recommendation with a combined score using:

- communicative-function weakness;
- unseen-function priority;
- lexical readiness;
- desirable difficulty;
- scenario novelty;
- recent-practice penalty.

The engine respects the current curriculum ceiling:

- A1: Foundation communication
- A2: Everyday independence
- B1: Independent problem solving

A weak function therefore influences what the learner practices next instead of simply appearing in Progress.

## Mission recommendation

P18 real-world mission recommendations are also function-aware.

Mission priority combines:

- weakness across the functions represented by its component scenarios;
- lexical readiness across the chain;
- whether the learner has already earned an independence pass.

This preserves the mission system while making it serve the adaptive curriculum.

## Adaptive set — 3 tasks

Conversation now offers an **Adaptive set · 3 tasks**.

The set is built greedily from the best current scenarios while rewarding function diversity, so three nearly identical tasks are less likely to be selected.

The set persists:

- current task index;
- scenario queue;
- priority functions;
- per-task completion result;
- historical completed focus sets.

It can be paused and resumed.

Cross-mode ownership is exclusive: a paused standalone conversation, Conversation 5 batch, P18 mission, and P20 adaptive set cannot silently overwrite one another. Start/resume/continue operations are guarded before their indexes or batch state mutate. Starting an adaptive set intentionally clears a paused Conversation 5 batch; already completed scenario evidence remains preserved.

Ending an adaptive set detaches any paused in-progress conversation from the set rather than deleting it. Boot reconciliation also repairs orphaned adaptive-set linkage after interrupted or imported state.

P20 integrates with the P19 **Pause & home** behavior, so pausing an active adaptive task returns to a Conversation home that still exposes the adaptive curriculum and resume action.

## Function-level attempt capture

P20 records more complete communicative evidence than the old target-word log.

It records:

- accepted turns;
- clarification/repair moves;
- matcher-uncertain attempts.

This matters because a learner who repeatedly cannot execute a function should not look identical to a learner who simply never used one of the target vocabulary words in an otherwise successful response.

Rapid duplicate submissions blocked by P19 are not double-recorded.

## Conversation UI

Conversation home now includes a P20 adaptive curriculum panel showing:

- current curriculum stage;
- number of functions at functional-or-better evidence;
- number of secure functions;
- highest-priority weak functions;
- next-best scenario;
- the evidence reason for that recommendation;
- lexical readiness;
- adaptive-set controls.

The existing P17/P18 scenario and mission systems remain intact underneath.

## Progress UI

Progress now contains a full communicative-function map grouped by function family.

Each function shows:

- current evidence state;
- calibrated function score;
- attempt count;
- context count.

This sits alongside the P19 aggregate calibration panel, so the learner can inspect both the global evidence mix and the specific functional gaps driving recommendations.

## QA integration

P20 extends the P19 Communicative QA system.

The curriculum audit checks:

- every scenario-declared function exists in the P20 taxonomy;
- every rule-level communicative function exists in the taxonomy;
- no unused taxonomy entries remain;
- adaptive-set queue references are valid;
- active adaptive-set task and active conversation agree;
- a P18 mission and P20 adaptive set are not active simultaneously.

A P20 curriculum integrity failure is surfaced as a normal QA failure in Settings.

## Persistence and backup

P20 curriculum state participates in the existing:

- localStorage persistence;
- depth snapshot;
- import/restore;
- IndexedDB hydration.

## PWA

P20 uses shell cache:

- `french3000-shell-v28`

The manifest description now includes the adaptive communicative curriculum.
