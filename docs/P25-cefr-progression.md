# P25 — CEFR Progression Engine & Promotion Gates

French v5.16.0

## Purpose

P25 replaces vocabulary-count progression with a balanced evidence gate.

A learner is **not** promoted merely because many cards carry an A1, A2, B1, or B2 label. Promotion requires independent evidence across receptive, productive, interactive, and functional language use.

P25 is an internal learning-progression system. It is not an official CEFR assessment or certificate.

## Seven promotion gates

Every level is evaluated independently across:

1. **Lexical retention** — P24 30-day retention plus usable/durable vocabulary coverage.
2. **Active transfer** — P13 active recall, phrase, sentence, and transfer evidence.
3. **Reading** — level-matched bundled texts, comprehension accuracy, and breadth.
4. **Listening** — level-matched contextual listening, correctness, independence, and breadth.
5. **Speaking** — reliable spoken attempts, correctness, independence, and vocabulary breadth.
6. **Interaction** — level-matched conversation/function evidence, independent turns, and function breadth.
7. **Functional missions** — completed real-world scenario chains and independent passes.

No weighted average can compensate for a failed gate. Every gate must meet both a score threshold and an evidence-confidence threshold.

## Level thresholds

Thresholds rise from A1 through B2. A1 accepts smaller evidence volumes and lower independence; A2 and B1 require progressively more balanced and independent performance.

The thresholds are intentionally internal calibration thresholds. They are not claimed to reproduce DELF/DALF or another official examination rubric.

## Prerequisite order

Promotions are sequential:

- A1 must be earned before A2 can be recorded;
- A2 must be earned before B1;
- B1 must be earned before B2.

A promotion milestone is kept historically once earned. If current evidence later falls below a gate, the UI shows **Promoted · maintenance needed** rather than silently deleting the milestone.

## Study frontier

P25 becomes authoritative for the adaptive CEFR vocabulary frontier.

- no earned promotion → A1 frontier;
- A1 earned → A2 frontier;
- A2 earned → B1 frontier;
- B1 earned → B2 vocabulary frontier.

This changes P8's frontier selection from a vocabulary-only unlock to a whole-skill promotion boundary.

The learner can still manually browse and study any level.

## P22/P23 integration

The weakest failed gate at the current frontier receives a bounded scheduler boost.

Mappings:

- lexical retention → Mixed Review;
- active transfer → sentence production;
- reading → reading;
- listening → listening;
- speaking → spoken production;
- interaction → adaptive conversation;
- functional missions → missions.

The CEFR-gate boost is capped at **+16 scheduler points**.

P22's ordinary need/readiness model, P23's learned activity calibration, and P24's longitudinal-retention adjustment remain active.

## B2 coverage block

The current app has:

- 0 bundled B2 reading texts;
- 0 B2 contextual listening items;
- 0 B2 guided conversation scenarios;
- 0 B2 functional missions.

Therefore **B2 cannot currently receive a promotion claim**.

B2 vocabulary can still be studied, and lexical/transfer evidence can accumulate, but the promotion card remains **Coverage incomplete** until later phases add enough B2 communicative evidence.

This is deliberate: missing evidence is not treated as proficiency.

## UI

### Home

Home receives one compact **CEFR progression** strip showing:

- highest earned promotion;
- current study frontier;
- promotion gates met;
- weakest next gate;
- average gate score;
- aggregate evidence confidence.

### Progress

Progress receives a full level-by-level gate matrix for A1, A2, B1, and B2.

Each level shows:

- current promotion status;
- first-passed date when earned;
- seven gate scores;
- evidence confidence;
- the concrete evidence behind each score;
- explicit coverage limitations.

## Persistence

P25 stores only promotion milestones in:

- `french-cefr-progression-v1`

The stored state contains:

- level;
- first earned timestamp;
- score at first promotion;
- number of gates passed.

All current gate scores are recomputed from source evidence. Raw learner answers, transcripts, texts, or speech recordings are not duplicated into P25 persistence.

P25 state participates in localStorage, depth snapshots, import/restore, and IndexedDB hydration.

## QA

P25 adds **CEFR progression & promotion gates** to the QA chain.

The audit verifies:

- scores and confidence remain inside [0,1];
- a gate cannot pass without coverage;
- a gate cannot pass below either threshold;
- promotion cannot qualify without complete task coverage;
- prerequisite promotion order is preserved;
- B2 remains blocked while its communicative corpus is absent;
- P25 persistence contains no raw learning content.

## Evidence boundary

A P25 promotion means:

> French currently has sufficiently broad internal evidence to allow the learner to progress beyond this app-defined CEFR-labelled curriculum band.

It does **not** mean:

> the learner has received an official CEFR level or would necessarily pass an external CEFR examination.

## PWA

P25 uses shell cache:

- `french-shell-v36`
