# P21 — Open-World French Bridge, Personal Corpus & Authentic Transfer

French3000 v5.12.0

## Purpose

P21 closes the main gap left after P14–P20: French3000 can now work with French the learner actually encounters instead of limiting contextual reading to the bundled graded corpus.

The feature is deliberately not another generic AI/chat surface. It is a local-first bridge from learner-supplied French into the existing French3000 mastery model.

A learner can paste French from material they are allowed to use, or open a local `.txt` / `.md` file. French3000 then:

- tokenizes the text with the existing P14 reading pipeline;
- resolves mapped forms against the live French3000 lexicon;
- compares those words with the learner's current mastery state;
- highlights mapped gaps;
- reuses the established P14 lookup, save and deliberate-practice actions;
- records aggregate exposure after the learner finishes.

## Privacy model

Raw imported text is session-only.

French3000 does **not** persist:

- the pasted/imported text;
- the optional source label;
- paragraph contents;
- a copy of the source material in backups or IndexedDB state.

The persistent P21 store contains only aggregate session telemetry:

- session ID and completion time;
- source kind (`paste` or `file`);
- total word occurrences;
- known occurrences;
- learning occurrences;
- mapped-but-new occurrences;
- unmapped occurrences;
- known percentage;
- mapped percentage;
- effective lexical-load percentage;
- lookup count.

This keeps the personal corpus useful without silently building a durable archive of user-supplied text.

## Input limits

P21 currently accepts:

- pasted text;
- plain-text files;
- Markdown files.

Limits:

- 20,000 characters per active text;
- 256 KB per local file;
- at least 20 French word tokens before opening the reader.

Unsupported document formats are intentionally excluded from this first release rather than being parsed unreliably.

## Reuse of the P14 reading engine

P21 does not create a second vocabulary or tokenization system.

It reuses the P14 primitives for:

- French word tokenization;
- morphology-aware catalog resolution;
- current word-state classification;
- interactive word rendering;
- lookup;
- saved discoveries;
- deliberate word practice.

This means the same learner model drives both bundled graded reading and open-world reading.

## Coverage model

Every mapped occurrence is classified as:

- **known** — currently familiar by the live mastery model;
- **learning** — already studied or carrying learning evidence;
- **mapped-new** — present in the French3000 catalog but not yet learned;
- **unmapped** — not resolved to the current catalog.

The reader reports:

- known percentage;
- mapped percentage;
- unmapped occurrences;
- an effective lexical-load band.

The effective lexical-load estimate gives partial credit to learning and mapped-new words instead of pretending that only binary known/unknown status matters.

The bands are:

- Comfortable;
- Manageable;
- Stretch;
- High support.

High-support texts remain readable, but the UI explicitly warns that they are substantially above the learner's present lexical comfort band.

## Mapped-gap ranking

P21 extracts mapped words that are not yet known and ranks them primarily by frequency within the active text.

The reader surfaces up to twelve high-value gaps.

Selecting one opens the same P14 lookup used in bundled reading, where the learner can:

- inspect the catalog gloss and mastery state;
- save the discovery;
- open full word details;
- deliberately practice the mapped word.

Repeated exposure itself does not auto-promote a word into the SRS.

## Evidence policy

Open-world reading is **exposure-only** by default.

Finishing a text:

- records aggregate exposure statistics;
- does not rate vocabulary cards;
- does not create successful retrieval evidence;
- does not alter vocabulary intervals;
- does not claim communicative mastery.

If the learner explicitly starts deliberate practice from a mapped lookup, the normal existing practice engine owns that evidence.

This preserves the evidence-calibration principles introduced before P21.

## Read surface

The P14 Read home now contains an **Open-world French** panel.

It provides:

- optional ephemeral source label;
- pasted-text input;
- local `.txt` / `.md` import;
- live word count;
- Analyze & read action;
- aggregate recent-session history;
- explicit privacy/evidence disclosure.

The open-world reader provides:

- lexical coverage summary;
- reading-load band;
- mapped-gap shortlist;
- interactive word lookup throughout the source text;
- finish controls at the top and bottom of the reading surface.

## Progress surface

Progress now includes a **Real French exposure** panel.

It reports only aggregate P21 data:

- completed texts;
- words read;
- weighted known percentage;
- weighted catalog-mapping percentage;
- lookup count;
- latest known percentage.

No source text or source label is shown because neither is persisted.

## Persistence and backup

P21 uses:

- `french3000-open-world-v1`

Its normalized aggregate state participates in:

- localStorage persistence;
- depth snapshot;
- import/restore;
- IndexedDB hydration.

The active raw-text draft is deliberately excluded from those paths.

## QA integration

P21 extends the P19/P20 QA chain with an **Open-world privacy & bridge integrity** check.

The audit verifies that:

- normalized session coverage counts sum to total words;
- persisted P21 state contains no raw `text`, `source`, or `title` fields;
- the required P14 bridge primitives are available;
- the active draft obeys the character cap.

A failure is surfaced in the existing Settings QA panel.

## PWA

P21 uses shell cache:

- `french3000-shell-v30`

The web-app manifest now advertises the open-world personal French reading bridge.

## Release boundary

P21 intentionally does not yet attempt:

- PDF/EPUB/web-page scraping;
- automated translation of arbitrary unmapped words;
- cloud storage of imported source text;
- AI-generated explanations for arbitrary passages;
- automatic SRS promotion from passive exposure.

Those are separate product decisions. P21's release goal is a reliable, privacy-minimal bridge from real French into the existing evidence-calibrated learning system.
