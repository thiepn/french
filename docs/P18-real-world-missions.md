# P18 — Real-World Tasks, Scenario Chains & Functional French Independence

French3000 v5.9.0

## Purpose

P18 composes the deterministic P17 conversation scenarios into longer real-world missions without introducing a generative chatbot or paid API dependency.

The evidence model remains deliberately narrow: mission results describe performance on practiced deterministic tasks. They are not CEFR certification and do not claim general French proficiency.

## Mission system

P18 ships five three-task chains:

1. **Morning in town (A1)** — bakery purchase → café order → opening-hours enquiry.
2. **Arrival day (A2)** — buy a train ticket → ask directions → solve a hotel problem.
3. **Meet, plan, decide (A2–B1)** — meet a classmate → make a weekend plan → disagree/recommend politely.
4. **Solve everyday problems (A2–B1)** — correct a restaurant order → return an item → explain a past customer-service problem.
5. **Independent living circuit (B1)** — handle a travel delay → arrange an apartment repair → explain a past problem.

Each run rotates the underlying P17 scenario variant so repeated missions are less dependent on memorized partner wording.

## Independence evidence

A mission is complete when every chained task is complete.

An **independence pass** requires:

- all mission tasks completed;
- at least 80% of successful learner turns completed independently;
- no manual “my response fits” continuation;
- no support above P17 level 1.

A **fully unsupported** run additionally requires every successful turn to be independent and support level 0 throughout.

Clarification/repair remains visible as a communicative skill and is tracked separately.

## UX integration

P18 does not add another permanent navigation destination. Missions live inside **Conversation**.

It adds:

- a mission section on Conversation home;
- active-mission resume/end controls;
- task-chain progress banners during a conversation;
- next-task and mission-completion actions on scenario results;
- a compact Today dashboard mission card;
- a mission evidence panel in Progress.

## Persistence and recovery

Mission history and active mission state are stored under:

- `french3000-missions-v1`

The state is included in the existing depth snapshot/import/IndexedDB hydration path so app backup and restore cover mission progress.

## Production safeguards

P18 adds a runtime audit that verifies:

- unique mission IDs;
- at least three scenarios per mission;
- every referenced P17 scenario exists;
- no duplicate scenario inside a mission;
- at least four real-world mission definitions exist.

The release also bumps the PWA shell cache to `french3000-shell-v21` and refreshes the manifest description.
