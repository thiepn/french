# P26 — Weakness Diagnosis & Targeted Remediation

French v5.17.0

## Purpose

P26 changes the meaning of "weakness" from **a card that was answered badly** to **a diagnosed learning problem with a repair path**.

French already records rich error evidence across vocabulary recall, phrase production, sentence production, contextual listening, spoken production, reading retrieval, conversation, and missions. P26 unifies those signals and chooses the smallest useful intervention.

The operating rule is:

> Do not repeat the failed task blindly. Reduce the load, repair the missing relation, then retest independently.

## Root-cause taxonomy

P26 uses eight learner-facing root causes:

1. **Retrieval failure** — knowledge is not available reliably without support.
2. **Form / orthography** — intended French is close but exact written form is unstable.
3. **Grammar / connector** — articles, contractions, prepositions, or word order are the blocker.
4. **Lexical frame / structure** — the word is known but its required phrase or sentence construction is unstable.
5. **Listening discrimination** — connected speech, segmentation, speed, lexical recognition, or transcript dependence is the problem.
6. **Spoken retrieval / intelligibility** — spoken production is unreliable without a model or is not recognized reliably.
7. **Reading comprehension** — meaning is not transferring reliably from written context.
8. **Interaction independence** — communication still depends on clarification, support, or manual continuation.

## Evidence mapping

The diagnosis layer reuses existing structured evidence instead of parsing learner text again.

Examples:

- P11 phrase diagnoses:
  - orthography / spelling → Form
  - connector / word order → Grammar
  - collocate / neighboring frame / incomplete frame / missing anchor / structure → Lexical frame
  - blank → Retrieval

- P12 sentence diagnoses:
  - orthography → Form
  - contraction / preposition / word order → Grammar
  - incomplete / target missing → Lexical frame
  - blank → Retrieval

- P15 listening:
  - connected speech / segmentation / speed / transcript / lexical / detail → Listening
  - hearing correct but writing wrong → Form

- P16 speaking:
  - failed reliable production → Speaking

- P14 contextual retrieval:
  - failed comprehension retrieval → Reading

- P17/P20 interaction:
  - supported, repaired, manually continued, or failed turns → Interaction

Generic `Again` evidence falls back to Retrieval only when a more specific diagnosis is unavailable.

## Unresolved vs repaired cases

A diagnosis is keyed by vocabulary note and root cause.

A case remains open until later **clean evidence** for the same note and cause occurs after the latest failure.

Examples:

- listening closes only after an unsupported correct listening attempt;
- speaking closes only after a reliable, non-manual, unsupported correct spoken attempt;
- grammar/frame cases close after clean exact sentence/phrase evidence;
- orthography closes after exact form evidence.

This prevents a generic easy review from falsely clearing a specific weakness.

## Severity and confidence

Each case combines:

- number of failure signals;
- signal severity;
- recurrence across separate days;
- recency;
- evidence volume.

Severity is bounded to 0–100.

Evidence confidence increases with repeated observations and observations across multiple days. A one-off typo can therefore remain low-confidence instead of becoming a major intervention target.

## Repair sequence

Queueable weaknesses use up to three practice-only stages:

### 1. Scaffold

Reduce cognitive load while keeping the target relation visible.

Examples:

- recognition before failed active recall;
- isolated spelling;
- article/gender isolation;
- slower/reduced-load listening;
- silent production before spoken output.

### 2. Rebuild

Practice the exact missing relation.

Examples:

- complete phrase frame;
- connector or contraction inside a sentence;
- active French form;
- contextual listening rebuild;
- spoken target production.

### 3. Independent retest

Return to unsupported production or perception after other repair items have intervened.

The session interleaves stages across several cases rather than repeating the same word three times in a row.

## Scheduling boundary

Every P26 repair task is `practiceOnly`.

P26 therefore cannot:

- advance the real SRS interval;
- inflate FSRS stability;
- manufacture P24 durability;
- directly satisfy a P25 promotion gate merely by repeating scaffolds.

Later clean evidence remains authoritative.

## Reading and interaction

Reading and interaction weaknesses are not converted into artificial flashcard drills.

When those are the main root cause, P26 routes the learner to the native reading or adaptive-conversation system.

This keeps remediation semantically aligned with the actual failed skill.

## P22/P23/P24/P25 integration

P26 adds a bounded root-cause priority adjustment to the existing next-best-activity engine.

The mapping is:

- retrieval → retention;
- orthography → retention;
- grammar → sentence;
- lexical frame → phrase;
- listening → listening;
- speaking → speaking;
- reading → reading;
- interaction → conversation.

The adjustment is capped at **+14 scheduler points**.

This stacks with, but does not replace:

- P22 cross-skill need/readiness;
- P23 learned activity calibration;
- P24 longitudinal forgetting risk;
- P25 CEFR gate priority.

## Repair effectiveness

Completed P26 sessions store only compact run metadata:

- start/end timestamp;
- root causes targeted;
- number of cases;
- number of repair tasks;
- number of independent retests;
- successful independent retests.

Progress can therefore report whether repair sequences are producing clean retest success over time.

## UI

### Home

Home receives a compact **Targeted remediation** strip showing:

- strongest root cause;
- unresolved note-level patterns;
- patterns later repaired by clean evidence;
- repair-retest success rate when available;
- one direct action.

### Progress

Progress receives:

- ranked root causes;
- recent signal count;
- unresolved case count;
- per-note diagnosis;
- severity;
- evidence confidence;
- human-readable repair explanation;
- direct targeted-repair launch.

### Study

P26 repair cards display the current stage:

- Scaffold;
- Rebuild;
- Independent retest.

## Persistence

P26 uses:

- `french-remediation-v1`

Only compact repair-run metadata and an active repair-session descriptor are stored.

Raw learner answers, speech transcripts, expected answers, or reading text are not duplicated into P26 persistence.

Repair-card metadata is preserved in resumable study snapshots.

## QA

P26 adds **Weakness diagnosis & targeted remediation** to the QA chain.

The audit verifies:

- only known diagnosis causes are emitted;
- resolved cases cannot appear in the open-case set;
- severity remains inside 0–100;
- all generated repair tasks are practice-only;
- every task has a valid scaffold/rebuild/retest stage;
- repair-run retest successes cannot exceed retests;
- run timestamps are coherent;
- P26 persistence contains no raw learner content.

## Evidence boundary

P26 diagnoses patterns supported by the app's structured evidence. It does not claim to infer every linguistic cause from free-form French.

When evidence is ambiguous, the system keeps the diagnosis broad rather than pretending to know more than the data supports.

## PWA

P26 uses shell cache:

- `french-shell-v37`
