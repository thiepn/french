# French P3 — Frictionless Study UX

Date: 2026-09-30  
Release: v4.4.0 — P3 Frictionless Study UX  
Baseline: v4.3.0 P2 Study Engine 2.0

## Goal

P3 removes remaining interaction friction from the normal vocabulary workflow while leaving the P2 FSRS-compatible scheduler and skill schedules authoritative.

The target daily path is now: **Open app → see today's work → press Study → answer cards → finish → leave.**

## Implemented

### 1. One-action daily start

Home keeps one dominant study action. Its label now includes approximate duration. Resume remains dominant when an unfinished session exists and shows the remaining count.

### 2. Quick 10

When today's queue is larger than ten cards and no unfinished session exists, Home exposes **Quick 10**. It uses the normal Today queue, keeps P2 scheduling active, and refuses to overwrite an unfinished session.

### 3. Inline daily-plan editor

**Change daily plan** opens a compact dialog for CEFR level, session size, new words/day, practice style, and skill focus. Advanced scheduling stays in Settings. During an active session, edits apply only to the next session.

### 4. Full-screen study progress

A 3 px progress indicator sits directly below the study header and reaches 100% at completion without consuming meaningful vertical space.

### 5. Undo promoted

Undo is now visible in the quick-action row whenever an undo is available instead of being buried in More.

### 6. Clearer session exit

The study exit reads **Home**. The session snapshot is still saved. The study menu can edit the next-session plan without leaving the active session.

### 7. Safe post-session practice

**Practice missed** and **Practice session again** now run in practice-only mode. They reinforce material without immediately changing FSRS due dates a second time.

### 8. Mobile ergonomics

The existing full-screen mobile layout and sticky four-button rating dock are preserved. P3 adds only the thin progress bar, conditional Undo, and compact plan dialog; no multi-row toolbar returns.

## Preservation

P3 preserves P1 vocabulary data, stable note/skill IDs, P2 FSRS memory state, due dates, review history, custom lists, user cards, backups, and recognition/production separation.

The PWA shell cache moves to v6.

## Verification

- production main-script syntax: PASS
- service-worker syntax: PASS
- P1 fingerprint retained
- P2 study-engine block retained
- P3 plan, Quick 10, progress, Undo, and safe-practice hooks present

## Next phase

**P4 — Listening, Pronunciation & Audio Mastery**
