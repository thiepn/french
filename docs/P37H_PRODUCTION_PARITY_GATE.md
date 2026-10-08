# P37H — Production parity gate

P37H exists because the scalable runtime must not reach production merely because it is faster.

## Completed in this branch

The merged P37A–G runtime had functional Home, Learn, Review and Words routes, while Listen, Speak, Progress and Settings were explanatory placeholders. This branch converts those routes into useful lazy-loaded workspaces and restores release-critical local infrastructure:

- **Progress intelligence** ports the core P5 decision model to vNext: catalog→introduced→recognition/production/balanced coverage, CEFR coverage, live FSRS recall, independent skill health, recognition→production gaps, review-pressure buckets, weakness ranking/repair causes, recent evidence and deterministic next actions.
- **Settings foundation** persists daily workload, desired retention, grading mode, typed-answer preference, article strictness and sibling spacing in canonical learner state.
- **P14 Reading + P15 pairing** is now native: the actual 25-text stable corpus (A1–B2) is extracted from preserved P35 data into a verified modular content pack; the Read route supports Extensive/Intensive/Targeted modes, mastery coverage, resume position, lookups, saved discoveries, exposure tracking, context retrieval, difficulty feedback, Word→Read targeting, Reading→Progress evidence, and direct Read↔Listen pairing. The paired listening path uses the selected reading's sentence segments without loading legacy runtime code.
- **P16 spoken production + native P12 transfer** now implements all four speaking modes with the stable 36-task P12 sentence corpus and shared deterministic sentence diagnosis. Spoken transfer uses accepted sentence families, contraction/preposition/order/missing-target/manual-ambiguity handling instead of a duplicate similarity grader. The speaking surface also has normal/slow model audio, temporary local recording/playback, coarse pace feedback, conservative optional recognition, Correct/Almost/Retry manual judgment, support-aware practice-only evidence, Read→Speak and Listen→Speak context bridges, Word→Speak targeting, and Progress spoken evidence. Raw microphone audio is never persisted.
- **Backup/recovery** exports every vNext IndexedDB store with a SHA-256 payload checksum, validates imports before mutation, performs one cross-store replacement transaction, and forces a pre-restore safety export from the UI.
- **Offline/PWA** restores installable metadata and generates a build-specific service worker. Shell and lazy route chunks are precached while the large vocabulary corpus remains on-demand and caches only as used.

These are functional foundations, **not yet a production-cutover claim**. P5 core progress intelligence, P14 Reading, P15 reading-aligned listening, and the P12-backed core of P16 are now represented natively in vNext. The first-party THIEPN Account client, rollback-compatible cloud snapshot, silent SSO probe, explicit device adoption, conflict handling, Settings controls, and OAuth-aware RLS/RPC are implemented. The only Account blocker left is the one-time production OAuth client registration/pin, after which the pending client constant can be replaced with the issued UUID.

None of these feature modules is imported into the critical startup bundle.

## Explicit non-cutover state

This branch is **not** the production cutover. P35 remains production.

Remaining release blockers:

1. perform the **one-time French first-party OAuth client registration and Account registry pin** for exact origin/callback `https://french.thiepn.dev/`, then replace the pending client constant and run live SSO/sync acceptance;
2. run live THIEPN Account SSO/sync acceptance after the client is pinned;
3. run final physical-device checks for installed-PWA, microphone/speech and mobile keyboard behavior;
4. only then execute a reversible production cutover with the P35 commit preserved as rollback.

The P35 runtime remains a data-compatibility source and rollback implementation, not a runtime dependency of vNext.


## THIEPN Account cutover boundary

vNext uses the shared THIEPN first-party OAuth 2.1 + PKCE session contract. It does not start Google OAuth directly. The Account runtime silently probes only signed-in/eligibility state, and identity attachment is separate from cloud adoption. **Signing in never uploads French data.** The user must choose **Sync this device**.

Cloud snapshots keep P35-compatible top-level fields for rollback while carrying an exact `_vnext` IndexedDB payload. vNext can restore either format. Production RLS/RPC now accepts native P35 Account sessions and, once registered, only the exact OAuth client that Account maps to `app_slug='french'`; unknown delegated clients remain denied.

The repository deliberately contains `__PENDING_FRENCH_OAUTH_CLIENT_ID__` until the manual production registration is completed. This is a fail-closed release blocker, not a fallback to direct Google auth.


## Executable migration/parity acceptance

P37H now runs an executable P35→vNext fixture test in every `qualify:vnext` run. It verifies:

- depth-style skill IDs retain note, sense, and skill identity;
- SRS interval/due/retrievability fields survive conversion;
- scheduled review evidence and typed-quality metadata survive conversion;
- settings, profile, study plan, study days, promotions, user cards, edits and decks survive conversion;
- P14/P15/P16 and other phase state stays in canonical `featureState`;
- vNext cloud snapshots expose P35-compatible top-level fields;
- the exact vNext IndexedDB payload is retained under `_vnext`;
- cloud hashes ignore only volatile `updatedAt` while still detecting substantive changes.

This closes the code-level P35→vNext migration/parity blocker. Live account-token and physical-device acceptance remain separate release gates.


P35-only compatibility state that does not belong in the new scheduler model—`mistakeLog`, `resumeSnapshot`, and `sessionHistory`—is retained losslessly in canonical feature state. It is therefore carried back into the top-level rollback-compatible cloud snapshot even though vNext does not interpret the old active-session format.


### Closed: P35 → vNext data parity

The executable migration fixture is green in `qualify:vnext`. It verifies preservation of scheduled SRS state, review evidence, user content, phase feature state, P35-only compatibility state, rollback-readable cloud fields, exact vNext payload restoration, and substantive-change hashing. This is no longer a cutover blocker.
