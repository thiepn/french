# P7 THIEPN Languages integration

French consumes the THIEPN Languages P7 compatibility contract in read-only mode.

## Platform pin

- platform repository: `thiepn/languages`
- platform commit: `56bb7fda23ca179ae233cbc8d6f1c17b2f8cbc49`
- package version: `0.7.0`
- contract: `p7-readonly-v1`
- audited French source baseline: `28a39ce1c59ab02301b408f016522dbddc28d0c0`

The browser artifact is vendored at:

`vendor/thiepn-languages-consumer-contract.js`

It is cached in the service-worker app shell so the integration does not create a network dependency and continues to work offline.

## Authority

This phase does not migrate or replace French's authoritative systems.

French remains authoritative for:

- vocabulary/content loading and curation;
- local/cloud learner state;
- review history;
- scheduling;
- longitudinal mastery;
- CEFR progression;
- adaptive orchestration;
- THIEPN Account sync.

The shared platform contract is only read and validated during boot.

The app exposes the resulting frozen descriptor as:

`globalThis.THIEPN_FRENCH_LANGUAGE_PLATFORM`

for diagnostics.

## Verification

`scripts/verify-language-platform-p7.mjs` checks:

- the vendor artifact is loaded before the main application;
- the artifact is pinned to the expected platform commit;
- the contract version is correct;
- the audited French baseline is declared;
- integration mode remains read-only;
- memory authority remains with French;
- shared state cannot become authoritative;
- the browser artifact remains in the offline app shell.

GitHub Actions runs this smoke check on pull requests and `main`.

## Migration rule

Installing the P7 contract does not imply that French is migrated to shared Language Core.

Any future transfer of scheduling, mastery, proficiency, orchestration or canonical learner-state authority requires a separate explicit phase with parity tests and rollback behavior.
