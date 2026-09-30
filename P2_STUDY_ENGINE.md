# French3000 P2 — Study Engine 2.0

Date: 2026-09-30  
Release: v4.3.0 — P2 Study Engine 2.0  
Baseline: v4.2.1 P1 Vocabulary Audit Verification

## Goal

P2 turns the existing advanced scheduling pieces into one coherent study engine without resetting stable note IDs, skill IDs, review history, or learner progress.

## Implemented

### 1. FSRS-style memory state remains authoritative

French3000 keeps the existing FSRS-5-compatible scheduler with:

- stability
- difficulty
- retrievability
- elapsed and scheduled days
- configurable desired retention
- learning and relearning steps
- separate learning, review, and relearning states

P2 additionally stores the memory state attached to each scheduled review-log event so later calibration can reconstruct why a card received its interval.

### 2. Directional mastery remains separate

Recognition (French → English) and production (English → French) remain independently scheduled skill cards rather than one blended mastery score.

P2 adds an explicit directional-strength comparison so a large recognition-versus-production gap contributes to weakness priority for production cards.

### 3. Unified weakness model

The previous app had several partially overlapping notions of "weak." P2 replaces their priority inputs with one evidence model using:

- lapses and Again/Hard outcomes
- FSRS difficulty and retrievability
- overdue age
- recent failure rate
- answer latency
- typed-answer precision errors
- stored mistake frequency
- recognition/production imbalance

The same model now feeds difficult-card detection, weakest-first study, and adaptive due ordering.

### 4. Prioritized review queue

The existing adaptive queue continues to order:

1. learning/relearning
2. weak or high-risk due reviews
3. normal due reviews
4. staged skill work
5. new recognition cards

P2 routes the weak/high-risk tier through the unified evidence score.

### 5. Staged learning and reinforcement

The established learning path remains intact:

- recognition first
- context/reinforcement when useful
- production after recognition is stable
- spelling/listening/article skills where applicable
- delayed recall through the FSRS schedule

Difficult items can receive delayed practice-only reinforcement without moving their scheduled due date.

### 6. Leech Repair

The existing leech-repair dialog remains the action surface for repeated failures. P2 adds an evidence-based diagnosis before the repair controls. It classifies the dominant problem as answer precision, production gap, repeated forgetting, slow retrieval, or general memory risk.

Repair practice remains practice-only unless the learner performs a scheduled review.

### 7. Continuity and migration safety

P2 does not intentionally reset:

- stable note IDs
- stable skill-card IDs
- review history
- current due dates
- recognition/production separation
- custom decks
- user-created cards
- settings or backups

The PWA shell cache moves to v5 so installed copies refresh to the new engine.

## Verification

Before commit, the complete production `index.html` main script and `service-worker.js` both passed JavaScript syntax compilation.

## Next phase

P3 — Frictionless Study UX.
