# P37I-D3 — Longitudinal Mastery and Targeted Remediation

**Status:** vNext candidate only. No P35 production changes or CEFR promotion.

## Goal
Find repeated, objectively *graded in-app* weaknesses that persist across
time instead of rewarding a good session or a large number of practice clicks.
The core module is `app/src/core/learner/longitudinal.ts`. It reads existing
activity and communicative-function event metadata and does not write to
SRS, learner state, activity, or the cloud.

## Two comparable cohorts
- **Earlier:** 90 to 45 days before the current date.
- **Recent:** last 45 days.
- A trend is comparable only with **3 or more graded attempts across at
  least 2 distinct days in EACH window** for the **same target**.
- Replayed, supported, manually judged, incomplete, malformed, duplicated,
  future, and out-of-window activity cannot boost the verified numerator.
- Unverified activity is counted separately rather than being silently
  assumed to be correct or incorrect.
- Events are deduplicated by their persisted event identifiers. Results
  come from the newest capped activity sample available to Progress;
  a 10,000-event cap is explicitly surfaced when reached.

## Comparable dimensions
| Stream | Matched key | Grading limitation |
| --- | --- | --- |
| Scheduled vocabulary | Canonical note and skill-record identifier | Scheduler answer ratings are learner-reported, not objective correctness |
| Listening | Same note/source item | Accurate first-listen text response at normal speed; supported answers excluded; independently attempted failed dictations retained |
| P12 writing | Exact sentence exercise ID | Exact/reference-match only; other valid French expressions cannot be scored automatically |
| P10 constructions | Original record ID **and practice mode** | Structural usage and actual contextual production stay separate; repaired frame alone does not imply contextual competence |
| Conversation | Communicative function ID | Deterministic scenario slot checks, not unrestricted or formally verified communication |

There is deliberately no longitudinal **speaking mastery percentage**:
optional browser ASR and self-rated oral recording cannot provide independent,
reliable pronunciation or CEFR evidence. Reading completion is exposure,
not a standard repeatable correctness measurement, and does not enter this
same-item trend engine.

## Status rules
With sufficient comparable attempts:
- **Improving:** at least +25 percentage points, at least 75% recent
  graded success, 2 earlier errors and 3 recent independently graded successes.
- **Declining:** at least -25 percentage points and 2 recent errors.
- **Persistent risk:** both windows below 60% with at least 2 errors each.
- **Stable:** both windows at least 75% with at most 1 recent error.
- **Mixed:** other adequately observed combinations.
- **Insufficient:** either cohort misses the attempts/day threshold.

These engineering rules are **heuristics**, not calibrated inferential
statistics, statistical significance, transfer guarantees, or CEFR standards.
The denominator is displayed alongside every status. Small/cohort-limited
samples remain explicitly inconclusive.

## Remediation and attribution
A `verified-usage-repair` event indicates a *logged repair attempt* only.
The planner requires a later window with 3+ graded outcomes on at least 2
days and actual improvement before marking **observed after repair**.
An intervention after successful answers does not earn credit.

Time ordering alone does **not establish causation**. There is no randomized
control, educational treatment-effect estimate, or attribution to any
particular curriculum or feature. The UI explicitly states this.

At-risk targets provide buttons opening actual Review, Listen, Write, or
Conversation workspaces. The system never edits a due date, creates
synthetic evidence, triggers automatic promotion, or stores learner answers.

## Qualifications still needed
- Longitudinal comparisons with authentic P35 historical activity across
  multiple devices and real backup/import revisions.
- More comprehensive intervention-type audit: P12 remediation, reading
  comprehension, real listening segments, independent oral assessment.
- Better identity and sense-level mappings where the legacy data lacks
  stable note IDs and explicit context/level labels.
- Physical mobile-device checks; accessibility/performance qualification
  with large real activity stores and imported histories.
- Controlled evaluation that exercises different content before calling a
  change *transfer* or *causally attributable mastery*.

This phase complements D1 recommendations and D2 blocked CEFR diagnostics;
it does not complete P25 promotion or authorize the vNext cutover.
