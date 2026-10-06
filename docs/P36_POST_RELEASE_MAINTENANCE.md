# P36 — Post-Release Observation, Real-Use Defect Intake & Maintenance Baseline

P36 begins after the P35 stable release has passed repository and live-production acceptance.

The purpose is deliberately narrow: **observe the released product, capture evidence from real study use, repair verified defects, and keep the stable line quiet.**

P36 does not reopen curriculum design, CEFR authority, learning architecture, account architecture, or add new study modes without evidence.

## Frozen release baseline

- product: `French`
- production origin: `https://french.thiepn.dev`
- stable application version: `5.24.0`
- stable release phase: `P35`
- baseline main commit: `85c7157b7ccc8ce3f1fa5f09a2a142d924ea1b76`
- learner/proficiency logic: frozen from P33
- qualification authority: P34 + P35 browser acceptance
- P36 role: maintenance process, not a product-version bump

`release.json` therefore remains P35/5.24.0 until an actual product change justifies a new release.

## Observation inputs

P36 accepts only evidence tied to actual behavior:

1. reproducible defects during real study;
2. repeated friction during real study;
3. failed scheduled production probes;
4. regressions caught by inherited P34/P35 qualification;
5. device-specific failures that can be reproduced on the affected environment.

Ideas without observed need are backlog material, not P36 work.

## Intake classes

### Defect

A behavior that violates an existing contract.

Examples:

- study surface cannot open;
- answer/review state is corrupted or lost;
- navigation is unreachable;
- offline behavior contradicts the installed-PWA contract;
- current learning state is not persisted correctly;
- current UI contradicts its accessibility contract;
- production differs from the accepted release.

### Friction

The product works, but repeated real use is unnecessarily slow, confusing, or error-prone.

A friction report records the learner goal and evidence first. It must not prescribe a feature as the problem statement.

## Severity

- **P0 — data/safety integrity:** data loss, destructive corruption, security/privacy failure, unrecoverable learner-state damage.
- **P1 — core study blocked:** normal study cannot continue on a supported path.
- **P2 — major degradation:** important workflow works only with a substantial workaround.
- **P3 — minor defect/friction:** limited impact, cosmetic defect, or non-blocking inconvenience.

P0/P1 may justify immediate defect-only work. P2/P3 normally accumulate evidence before code changes.

## Maintenance decision rule

A change belongs in P36 only when all are true:

1. there is a concrete observed failure or repeated friction;
2. the expected behavior is already defined by the stable product;
3. the smallest repair is identifiable;
4. the repair does not silently expand curriculum or product scope;
5. inherited release qualification can prove the repair did not regress the stable line.

If the proposed change alters the learning model, CEFR promotion rules, curriculum scope, account architecture, or creates a new mode, it is not a P36 maintenance patch.

## Production observation

`scripts/observe-production-p36.mjs` performs a lightweight live-origin probe.

It verifies:

- the production origin responds;
- `release.json` still identifies French 5.24.0 / P35 / stable;
- the deployed HTML still carries the stable P35 marker;
- the manifest still identifies the expected standalone French app;
- the service worker still exposes the P35 shell cache.

This is intentionally not another full browser matrix. The P35 browser suite remains the release acceptance authority. The P36 probe is a low-cost drift detector.

The scheduled workflow runs once daily and can also be triggered manually.

## Known debt carried into observation

P35 recorded unusually expensive Firefox startup on shared GitHub-hosted runners. A correct retry required 136.4 seconds, leading to the explicit 150-second CI ceiling.

P36 treats this as **performance debt to observe**, not permission to rewrite the app.

Escalation requires real evidence such as:

- repeatable slow startup on normal learner hardware;
- study abandonment caused by startup delay;
- browser-specific startup failure outside hosted CI;
- measurable worsening relative to the frozen stable baseline.

Without that evidence, the architecture remains closed.

## Required regression path for any patch

Every code patch must retain the inherited gates:

- P34 production qualification;
- P35 static release verifier;
- P35 five-profile local browser acceptance;
- P35 live-production browser acceptance after deployment.

P36 itself adds only the maintenance verifier and the production observation probe.

## Exit state

P36 is not a feature milestone with an automatic successor.

The correct steady state is maintenance mode:

- stable release remains quiet;
- real defects are repaired narrowly;
- friction is accumulated and prioritized by evidence;
- feature work begins only when evidence supports a separately scoped phase.

There is no automatic P37.
