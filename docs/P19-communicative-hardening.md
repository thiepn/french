# P19 — Communicative System Hardening, Evidence Calibration & Real-Device QA

French v5.10.0

## Purpose

P19 hardens the communicative-learning stack built across P12–P18 instead of adding another learning surface.

The phase addresses four production risks:

1. assisted success receiving too much mastery credit;
2. active conversation/mission state becoming inconsistent after navigation, reload, suspension, or accidental duplicate input;
3. mobile interaction problems around touch targets, virtual keyboards, landscape mode, scrolling, and safe areas;
4. insufficient device-level diagnostics for speech, microphone, storage, PWA, and deterministic-content integrity.

## Evidence calibration

The mastery engine now calibrates communicative evidence for listening, phrase, sentence, and transfer dimensions.

A successful attempt receives less mastery credit when it used:

- support level 1, 2, or 3;
- a non-first attempt;
- manual continuation;
- an unreliable spoken-recognition result;
- repeated listening rather than first-listen success.

P17 conversation evidence also incorporates matcher confidence.

Calibrated dimension confidence now incorporates:

- attempt count;
- study-day spacing;
- evidence time span;
- independent successes;
- context diversity.

This prevents a run of highly scaffolded successes in one context from appearing equivalent to durable independent transfer.

Progress now exposes the calibrated evidence mix directly: communicative attempts, independent successes, supported successes, manual continuations, average success credit, and context diversity.

## Scenario and mission security

P17's **secure scenario** count is stricter in P19. A scenario now needs:

- at least two completed runs;
- at least two wording variants;
- at least four successful learner turns;
- at least 70% independent successful turns;
- average transfer evidence of at least 0.55;
- manual continuation on no more than 20% of successful turns.

P18 mission independence passes now require:

- the complete mission chain;
- at least two successful turns per mission task;
- at least 80% independent successful turns;
- no manual continuation;
- no support above level 1;
- average evidence of at least 0.55.

These labels remain practiced-task evidence, not general CEFR certification.

## Interaction hardening

### Duplicate submission guard

Rapid duplicate submissions of the same response in the same active conversation are ignored for 900 ms.

This prevents a double click/tap from applying the same answer to the following conversation node after the first submission advances the state machine.

### Pause instead of destructive back navigation

The P17 practice view's old back action discarded the active conversation.

P19 replaces it with **Pause & home**:

- active conversation state is preserved;
- the learner returns to Conversation home;
- **Resume active** returns to the same conversation;
- active P18 mission state is preserved.

### Lifecycle persistence

Conversation and mission state is persisted when:

- the page becomes hidden;
- the page receives `pagehide`.

Active speech recognition and temporary recording are stopped on page hide/unload paths so microphone resources are not left open.

### State reconciliation

Boot reconciliation checks mission/conversation linkage.

It repairs orphaned mission batch IDs and finalizes a mission whose final scenario result was persisted immediately before an interruption.

## Mobile and real-device hardening

P19 adds:

- 44 px minimum communicative-action targets on coarse-pointer devices;
- `touch-action: manipulation` for communicative controls;
- 16 px conversation textarea text on narrow screens to prevent mobile browser input zoom;
- virtual-keyboard scroll margin;
- safe-area handling for the communicative shell;
- contained momentum scrolling for conversation history;
- hidden horizontal-nav scrollbar on mobile;
- compact landscape rules for short screens;
- overflow protection for long French responses and task labels;
- progressbar roles and ARIA values;
- assertive matcher-uncertainty status announcements;
- explicit French response field labeling and mobile input hints.

## Communicative QA panel

Settings now contains **P19 communicative QA**.

It checks:

- P17 conversation-graph integrity;
- P18 mission-chain integrity;
- review-log support/manual/independence invariants;
- active conversation/mission state coherence;
- localStorage;
- IndexedDB;
- secure context;
- speech recognition;
- microphone recording support;
- speech synthesis;
- service-worker support;
- current viewport, DPR, touch points, pointer type, display mode, and network state.

Missing optional speech capabilities are warnings rather than failures because P17/P18 text-mode conversation remains functional offline.

The report can be rerun and copied for real-device testing.

## PWA

P19 uses shell cache:

- `french3000-shell-v25`

The web-app manifest description now includes calibrated progress evidence and device QA.
