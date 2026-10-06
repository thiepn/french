# P9 Authenticated Language Dashboard

French publishes its existing P8 privacy-minimal projection to THIEPN Core after successful THIEPN Account reconciliation.

## Privacy and consent

P9 does not change the guest-first Account contract. Signing in alone does not upload a language dashboard snapshot. Publication is attempted only when:

1. a canonical THIEPN Account user is present;
2. **Sync this device** is enabled for that user; and
3. French reconciliation has completed with status `synced`.

The browser retrieves the current Account access token only to authenticate the Core request. Core verifies that bearer token and derives ownership server-side.

## Projection boundary

The P9 publisher calls `thiepnFrenchLanguageReadModel()`. It never sends the full French cloud-sync snapshot, review log, user cards, edits, answers, recordings or account identifiers.

Shared browser transport:

`vendor/thiepn-languages-dashboard.js`

Dashboard contract:

`p9-dashboard-v1`

Target Core origin:

`https://api.thiepn.dev`

## Failure behavior

Core publication is secondary to French learning-state synchronization. If Core is unavailable, the already-reconciled French state remains valid and the P9 failure is logged without turning the French cloud-sync state into a conflict.

Production cross-device visibility requires the P9 Core database migration and Gateway deployment to be active.

## P33 compatibility

The P9 integration is replayed on top of the current P33 French producer. It does not freeze or downgrade the read model revision; spontaneous spoken-production calibration continues to flow through the same privacy-minimal P8 envelope before authenticated publication.
