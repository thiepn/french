# P37F — Typed Review Grading Parity

P37F ports the final stable French-aware typed-answer behavior into the modular vNext Review flow.

## Pure grader

`app/src/core/learner/grader.ts` is storage- and DOM-free.

It preserves the stable answer diagnostics for:

- exact answers;
- punctuation/spacing differences;
- accent/diacritic differences;
- missing or wrong French articles;
- singular/plural mismatch when metadata exists;
- near spelling errors using Levenshtein similarity;
- incorrect lexical answers;
- empty answers.

The module also preserves strict, learning and lenient grading modes.

## Suggested ratings

Typed feedback produces the same rating guidance pattern:

- empty/lexical miss → Again;
- exact but slow → Hard;
- exact at normal speed → Good;
- exact very quickly → Easy;
- close answer → Hard.

The suggestion is visual guidance only. The learner can still choose any rating.

## Scheduler coupling

The chosen rating is passed to the P37C stable scheduler together with the typed-answer quality.

This is important because close, missing-article and review-quality answers carry the same stability penalties as the stable Depth Core implementation.

## Review behavior

Productive, spelling, article and listening skills use typed input by default.

Recognition also uses typed input when the migrated session preference enables it.

Listening uses French speech synthesis for the current item without loading speech code into startup.

## Preserved learner preferences

P37F reads migrated:

- `settings.gradingMode`;
- `settings.session.strictArticles`;
- `settings.session.typed`.

Migrated user cards and card edits contribute article, gender, plural and alias metadata when available.

## Tests

Deterministic grading fixtures cover:

- exact French;
- accent correction in learning mode;
- spelling error;
- lexical miss;
- missing article;
- wrong article;
- correct article;
- French → English recognition.

## Still remaining

P37F does not yet claim complete P35 study-session parity. Remaining work includes weakness-aware queue ordering, active-session resume, undo, practice-only/requeue behavior, richer media and new-card learning flow.

P35 remains production until the later parity and cutover phases.
