# Phase 5 — Original French U28 reference illustrations

Source catalog: [THIEPN Languages PR #29](https://github.com/thiepn/languages/pull/29)
at cb38b6ae5cb6922d0bc00078f6e3a68174e7eb22.
Original lexemes: thiepn/french@3fb5c720cfeceaf682ce53c897701b489b7eaf6f, U28 original-source vocabulary.

Six *source-qualified* exact French U28 identifiers map to five original authored SVGs:
étudiant, étudiante, professeur, un livre, une école and un sac. See
`app/src/routes/u28-shared-visuals.ts` for the immutable key, sense, file,
alt and Git SHA contract. Assets are byte-identical to the source catalog.

Only U28 **Discover** uses these illustrations. **Recall** and **Use** are
unmodified, as are native Cards, Learn, Review, scheduler, SRS, progress,
backup, identity and migrations. Unmapped words are text-only. A broken
or evicted image removes only its figure; original word, gloss and context
remain readable. No translated-word auto-join, second cache or network image
dependency was introduced.

Assets are first-party `app/public/visual-lexicon/assets/*.svg` so the
existing French build and integrity-checked app-shell precache include them
without a new cache. Lazy/deferred decoding, 320×240 intrinsic dimensions
and a maximum display width of 184 px prevent mobile overflow. No additional
educational source material is created.

CI acceptance: `npm run verify:vnext` executes the exact-key, original-source,
source-SVG SHA and recall-absence regressions. Full `npm run qualify:vnext`
includes the project's original TypeScript, production build and browser
contracts. This is draft integration, not a production rights or physical
device release qualification.

**Concurrent UX warning:** French PR #79 changes U6 Course navigation.
This branch starts from main and only edits U28's standalone panel/stylesheet,
the original root verification chain and new files. Do not overwrite PR #79;
integrate with its Course UX on its own ancestry before production.
