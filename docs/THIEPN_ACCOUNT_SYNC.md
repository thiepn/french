# THIEPN Account sync

French is **guest-first**. No account is required to begin studying, and signing in alone never uploads local learning data.

## User flow

1. Study locally as a guest.
2. Sign in with THIEPN Account.
3. Select **Sync this device**.
4. If no cloud snapshot exists, the complete local learning snapshot becomes revision 1.
5. If cloud progress exists and the current device has no meaningful learning history, the cloud snapshot is restored automatically.
6. If meaningful progress exists both locally and in the cloud, French pauses synchronization and asks the user to choose **Use this device** or **Use cloud**.

Pausing sync or signing out leaves browser-local data intact.

## Data boundary

Identity comes from the canonical THIEPN Account Supabase Auth project. French owns its app data in `public.french_sync_state`. The stored payload is the app's canonical `depthStateSnapshot()`, which is also the basis of local persistence/export and is extended by later learning modules.

The table is RLS-protected for owner reads. Writes go through `sync_thiepn_french_state`, which derives the owner from `auth.uid()` and requires an expected revision for updates. This provides optimistic concurrency and prevents silent last-write-wins overwrites.

## Client reconciliation

Each browser keeps a non-authoritative local sync baseline:

- account user ID
- last observed cloud revision
- hash of the local snapshot at that revision
- last successful sync time

On reconciliation:

- local changed / cloud unchanged → push
- local unchanged / cloud changed → pull
- neither changed → no-op
- both changed → stop and require an explicit source-of-truth choice

The hash ignores volatile `updatedAt` fields so persistence timestamps alone do not trigger uploads.

## Authentication

The static French client uses the same Supabase Auth identity as THIEPN Account, with PKCE, persisted browser sessions, token refresh, and `getUser()` verification. The Supabase JS client is pinned to the same version used by the Account repository.

OAuth return URL: `https://french.thiepn.dev/`.

## Operational notes

The Account control-plane registry lists French with shared identity and isolated app data. Required permissions are `identity.basic`, `app_data.read`, and `app_data.write`. Enabling sync calls `connect_thiepn_app('french')` before any cloud adoption.
