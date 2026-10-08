# THIEPN Account sync

French is **guest-first**. Signing in attaches identity; it does not upload local progress. Cloud adoption requires a separate **Sync this device** action.

## Production OAuth connection

- Identity issuer: the THIEPN Account Supabase Auth project.
- First-party client: `bf2e7fca-98dd-4833-9fee-306ecd6fc7d7` (public OAuth 2.1 with authorization-code PKCE and refresh).
- Exact client URI and callback: `https://french.thiepn.dev/`.
- Trusted Account registry: `app_slug='french'`, identity-only automatic consent, production-origin scoped.
- On a signed-in Account browser, a silent SSO status probe may start authorization. App connection is created/reconnected by the Account OAuth authorization flow, **not** by a delegated French token calling `connect_thiepn_app`.
- Disconnection in Account revokes French OAuth sessions and suppresses silent reconnect; explicit reauthorization is required.
- Preview/dev origins remain guest-only.

## User flow

1. Study locally as a guest.
2. Sign in with THIEPN Account, or reuse an existing eligible Account session.
3. Select **Sync this device**. No cloud write is triggered merely by signing in.
4. With no cloud snapshot, the local snapshot is uploaded as revision 1.
5. If a cloud snapshot exists and the device has no meaningful learning history, restore it.
6. If both sources have progress, stop and ask to **Use this device** or **Use cloud**. Both destructive choices require explicit confirmation.

Pausing sync or signing out leaves local browser data untouched.

## Data ownership and rollback compatibility

The app owns its private `public.french_sync_state` record, keyed by the authenticated user. Owner reads are protected by RLS, while `sync_thiepn_french_state` uses the authenticated owner and revision checks for writes. The production policy accepts native P35 Account sessions and only the exact approved first-party French OAuth client; unrelated delegated clients are denied.

The cloud payload contains P35-readable top-level progress and a lossless `_vnext` backup for the new IndexedDB stores. Rollback compatibility is exercised by `npm run test:vnext:migration`.

## Reconciliation and conflict safety

Each browser holds a local baseline with the Account user ID, last revision, snapshot hash and last sync time. If just one side changes, that side is synchronized; if both change, synchronization pauses for explicit source-of-truth selection. Hashing ignores volatile timestamps, not substantive learning progress.

Before activating production vNext, validate sign-in, silent SSO, reconnect, offline use, two-device conflicts, rollback and physical-device behavior. The Account registry and client ID alone are not live release acceptance.
