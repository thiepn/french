# P37I-D2 — Explainable CEFR Practice-Evidence Gates

**Status:** Candidate implementation. **Never a CEFR award, certificate, or production promotion.**

## Purpose
Give learners and reviewers a traceable account of which prerequisites have
measurable *in-app* evidence, which are not yet observed, and which cannot
be evaluated by the current app. The engine lives in
`app/src/core/learner/cefr-gates.ts` and runs read-only in the Progress route.
It never calls any learner state or FSRS write operation.

D2 is an **internal diagnostic, not the historical P25 seven-gate protocol**.
The old P35 promotion records remain preserved in the legacy migration and
are never edited by this implementation. Passing practice checks cannot
promote a user.

## Provisional practice thresholds (NOT official CEFR scores)

| Level | Unique same-sense lexical recognition+production pairs | Accurate level-labelled first-listen attempts | Exact level-labelled written attempts | Independent scenario turns | Minimum distinct active days | Minimum conversation contexts | Completed reading texts with comprehension participation |
|---|---:|---:|---:|---:|---:|---:|---:|
| A1 | 12 | 3 | 3 | 5 | 2 | 2 | 2 |
| A2 | 20 | 4 | 4 | 8 | 3 | 2 | 2 |
| B1 | 30 | 6 | 6 | 12 | 3 | 3 | 3 |
| B2 | 40 | 8 | 8 | 15 | 4 | 3 | 3 |

These are transparent, conservative engineering **coverage indicators only**.
They are not psychometrically calibrated, validated, or aligned with an
external assessment provider. They should not be converted into a numerical
CEFR confidence score or a probability of passing an exam.

## Data provenance and isolation

1. **Lexical:** only scheduled canonical SRS records with the same `noteId`
   and **same `sense`** for recognition and production are paired.
   Both must be non-suspended, learned, have recent successful reviews and
   not be currently due. "Manual known", arbitrary same-lemma matches, and
   construction-practice events do not count as lexical proficiency.
2. **Reading:** source reading IDs and source CEFR levels are verified against
   the loaded stable reading pack. A completed text with at least one correct
   comprehension response is evidence of participation only.
3. **Listening:** objective exact first-listen dictation requires one normal-
   speed listen, no transcript/translation, no hints, an exact answer and
   an explicit source level in the native activity record.
4. **Writing:** only independent exact typed source prompts with a
   meaningful `sentenceExerciseId` and explicit level count. **The current
   P12 corpus has no source CEFR level labels**, so its attempts are not
   silently assigned to A1/B1. This gate will often remain incomplete until
   an independently reviewed level mapping is provided.
5. **Conversation:** only exact native turn evidence carrying an explicit
   level, a supported scenario ID, diverse contexts and multiple active days
   counts toward a provisional practice criterion. At least one recent
   fully unsupported mission pass is required. Slot-matching is not a
   qualified conversation assessment.
6. **Speaking:** all native practice is ASR-assisted or self-assessed.
   Such events **cannot** fulfill the independent speaking assessment gate.
7. **Formal assessment:** no validated, independently scored level exam
   exists in vNext, so the final CEFR promotion gate is always unavailable.

Curriculum availability uses the native level-indexed content: at least
three reading texts, three scenarios and one valid three-scene mission.
The original P27 **three listening-source-items** coverage requirement
is still unaudited; available reading-linked listening segments are not
misrepresented as a verified inventory.

All modalities use a rolling **90-day** observation window. Future, stale,
cross-level, assisted, or unlabelled records are conservatively rejected.
Existing SRS due dates, learner notes, promotions, cloud backups, speech
transcripts, and personal answers are not modified.

## User-facing states

- `content-unavailable`: the native curricular source inventory cannot
  support even the provisional practice checks.
- `evidence-incomplete`: some prerequisites lack recent traceable practice.
- `practice-checks-met-assessment-pending`: every provisional practice
  check is observed, **but the independent speaking and validated assessment
  gates still block promotion**.
- `promotion: blocked`: mandatory for every level and every learner.

The Progress UI uses an accessible expandable ledger with each criterion's
observed value, provisional threshold, evidence limitation, and a route to
a working native practice workspace. No progress percentage implies CEFR
certification.

## Missing before original P25 parity

- Exact P35 progression-gate criteria and migrated semantic equivalence.
- Audited level mapping for the source P12 writing corpus, broader P17–P20
  and B2 mission coverage, and independent listening-source audit.
- Reliable speaking assessment with an independent rubric and consent.
- A validated examination/assessment protocol that is sensitive to actual
  communicative competence and longitudinal performance.
- Explicit user approval, secure promotion authorization, rollback and
  account-scoped synchronization qualification.

D2 should remain **read-only and locked** until these gates are implemented
and independently reviewed. The production deployment marker remains NO-GO.
