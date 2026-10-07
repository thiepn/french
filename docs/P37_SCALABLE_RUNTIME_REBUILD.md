# P37 — Scalable Runtime Rebuild

P37 rebuilds French so the application can grow dramatically without repeating the single-file startup failure of P1–P35.

The stable 5.24.0/P35 application remains production until the replacement reaches feature and data parity.

## Non-negotiable invariant

**content growth must not increase bootstrap cost**

The runtime separates application shell, feature code, learner state, and curriculum/media content.

## Architecture

### Tiny shell
Bootstrap contains only app chrome, navigation, route loading, a compact local summary, and startup/error instrumentation.

### Feature islands
Home, Learn, Review, Words, Listen, Speak, Progress, and Settings are independent dynamic imports. Heavy future features must remain separate islands.

### Content is data
Curriculum is addressed through `/content/manifest.json`, which points to versioned packs for vocabulary, grammar, reading, listening, speaking, and assessments. Packs and media are fetched only when needed.

### State hydrates after paint
The shell renders first. IndexedDB hydration follows asynchronously. THIEPN Account/cloud sync will later run after local state and can never gate the shell.

### Analytics are query-time work
CEFR evidence, longitudinal mastery, diagnostics, and corpus audits run when requested, in workers/background tasks, or in CI—not on boot.

### Migration boundary
vNext must preserve learner **data compatibility**, not historical runtime-code compatibility.

## P37A performance budgets

| Initial asset | Raw ceiling |
| --- | ---: |
| HTML | 6 KB |
| bootstrap JavaScript | 24 KB |
| initial CSS | 24 KB |
| total initial source | 48 KB |

Real-device targets after parity: under 1 s warm desktop shell, under 2 s normal desktop cold shell, under 3 s mid-range mobile cold shell.

The architecture is intended to remain viable with 100,000+ lexical/content records, hundreds of units, thousands of media assets, additional CEFR stages, richer progress history, and future adaptive/AI features.

## Rebuild sequence

### P37A — Runtime foundation
Vite + TypeScript build, tiny shell, eight lazy routes, external content manifest, background IndexedDB hydration, strict startup budgets. **No production cutover in P37A.**

### P37B — Stable data contract extraction
Document and fixture-test P35 IndexedDB stores, localStorage keys, SRS/review state, settings, CEFR evidence, backup schema, and account-sync payloads.

### P37C — Core learner engine migration
Cleanly reimplement learner state, scheduling/SRS, settings, evidence, progression primitives, and backup/recovery without historical wrappers.

### P37D — Content pipeline migration
Extract embedded curriculum from the 2.8 MB legacy app into validated, versioned packs with deterministic indexes, cache/version rules, and worker-based search where useful.

### P37E — Feature parity migration
Move Home, Learn, Review, Words, reading/listening, speaking/pronunciation, Progress, and Settings with parity tests against stable.

### P37F — Platform services
Migrate THIEPN Account, cloud sync, PWA/offline behavior, language-platform contracts, microphone/speech capabilities, and optional diagnostics without making them startup dependencies.

### P37G — Parallel qualification
Run stable and vNext against shared fixtures for data migration, SRS/progression equivalence, backup/import, offline behavior, accessibility, and real startup measurements.

### P37H — Controlled production cutover
Preserve P35 rollback, build vNext to production root, migrate data non-destructively, deploy, run live acceptance, and retain rollback until field use confirms stability.

The result is a runtime intended to support years of additional French development, not merely a smaller copy of the old file.
