import { test, expect } from '@playwright/test';

// Every production-looking URL is intercepted and backed by the CI-local build.
// Supabase and Account responses are synthetic: no live user account is used.
const ORIGIN = 'https://french.thiepn.dev';
const ACCOUNT = 'https://account.thiepn.dev';
const ISSUER = 'https://hycegznamzjhwinegaai.supabase.co';
const CLIENT = 'bf2e7fca-98dd-4833-9fee-306ecd6fc7d7';
const USER_ID = 'cfaea278-8a20-4a6b-a895-6e935f833321';
const ACCESS_TOKEN = 'french-test-access-token-'.repeat(4);
const REFRESH_TOKEN = 'french-test-refresh-token-'.repeat(4);
const TOKEN_KEY = 'thiepn:french-sso:v1:tokens';
const PENDING_KEY = 'thiepn:french-sso:v1:pending';
const RETURN_KEY = 'thiepn:french-sso:return:v1';
const ROOT = process.env.P37H_BASE_URL || 'http://127.0.0.1:4175';

async function interceptProduction(context, options = {}) {
  const state = { connected: options.connected !== false, cloud: null, uploads: 0, writeStarted: 0, delayWriteMs: 0, tokenExchanges: 0, requests: [] };

  // Routes registered on the browser context also cover independently created pages.
  await context.route(ORIGIN + '/**', async route => {
    const incoming = new URL(route.request().url());
    // The browser keeps the actual production origin for origin checks; only bytes
    // are read from the local, qualified static build.
    const asset = await route.fetch({ url: ROOT + incoming.pathname + incoming.search });
    await route.fulfill({ response: asset });
  });
  await context.route(ACCOUNT + '/**', async route => {
    const incoming = new URL(route.request().url());
    if (incoming.pathname !== '/sso/probe') {
      return route.fulfill({ status: 404, body: 'Synthetic Account probe only' });
    }
    const body = `<!doctype html><script>
      parent.postMessage({type:'thiepn:sso-probe:v1',clientId:'${CLIENT}',signedIn:false,eligible:true},'${ORIGIN}');
    </script>`;
    await route.fulfill({ status: 200, contentType: 'text/html', body });
  });

  const json = (route, data, status = 200) => route.fulfill({
    status, contentType: 'application/json',
    headers: {
      'Access-Control-Allow-Origin': ORIGIN,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'apikey,authorization,content-type,prefer',
      'Access-Control-Max-Age': '3600',
      'Cache-Control': 'no-store'
    },
    body: JSON.stringify(data)
  });

  await context.route(ISSUER + '/**', async route => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;
    state.requests.push(request.method() + ' ' + path);
    if (request.method() === 'OPTIONS') return json(route, null, 204);
    if (path === '/auth/v1/oauth/token') {
      state.tokenExchanges++;
      return json(route, {
        access_token: ACCESS_TOKEN,
        refresh_token: REFRESH_TOKEN,
        token_type: 'bearer',
        expires_in: 3600,
        scope: 'openid email profile offline_access'
      });
    }
    if (path === '/auth/v1/user') {
      return json(route, { id: USER_ID, email: 'french-integration@example.invalid' });
    }
    if (path === '/rest/v1/account_app_connections') {
      return json(route, state.connected ? [{ status: 'connected' }] : []);
    }
    if (path === '/rest/v1/french_sync_state') {
      return json(route, state.cloud ? [state.cloud] : []);
    }
    if (path === '/rest/v1/rpc/sync_thiepn_french_state') {
      const data = request.postDataJSON();
      if (!state.connected) return json(route, { message: 'FRENCH_APP_NOT_CONNECTED' }, 403);
      state.writeStarted++;
      if (state.delayWriteMs > 0) await new Promise(resolve => setTimeout(resolve, state.delayWriteMs));
      const expected = data.p_expected_revision;
      if (expected !== (state.cloud?.revision ?? null)) {
        return json(route, { message: 'FRENCH_SYNC_CONFLICT' }, 409);
      }
      state.uploads++;
      state.cloud = {
        revision: (state.cloud?.revision ?? 0) + 1,
        state: data.p_state,
        updated_at: new Date().toISOString()
      };
      return json(route, state.cloud);
    }
    return json(route, { message: 'Unexpected synthetic Account path: ' + path }, 404);
  });

  return state;
}

async function seedSession(context) {
  await context.addInitScript(({ origin, key, access, refresh }) => {
    if (location.origin !== origin) return;
    localStorage.setItem(key, JSON.stringify({
      accessToken: access, refreshToken: refresh,
      expiresAt: Date.now() + 3_600_000,
      scope: 'openid email profile offline_access'
    }));
  }, { origin: ORIGIN, key: TOKEN_KEY, access: ACCESS_TOKEN, refresh: REFRESH_TOKEN });
}

test('first-party OAuth callback attaches identity without uploading study data', async ({ page, context }) => {
  const api = await interceptProduction(context);
  const state = 's'.repeat(48);
  await context.addInitScript(({ origin, pending, ret, state }) => {
    if (location.origin !== origin) return;
    sessionStorage.setItem(pending, JSON.stringify({
      state, verifier: 'v'.repeat(48), startedAt: Date.now()
    }));
    sessionStorage.setItem(ret, '/#settings');
  }, { origin: ORIGIN, pending: PENDING_KEY, ret: RETURN_KEY, state });
  await page.goto(ORIGIN + '/?code=synthetic-auth-code&state=' + state);
  await expect(page.getByRole('button', { name: 'Sync this device' })).toBeVisible({ timeout: 30_000 });
  await expect.poll(() => page.url()).not.toContain('code=');
  expect(api.tokenExchanges).toBe(1);
  expect(api.uploads).toBe(0);
  await expect(page.getByText(/signed in, local-only/)).toBeVisible();
});

test('invalid OAuth state never leaves authorization code in the URL or uploads data', async ({ page, context }) => {
  const api = await interceptProduction(context);
  const state = 'x'.repeat(48);
  await context.addInitScript(({ origin, key }) => {
    if (location.origin === origin) sessionStorage.setItem(key, '/#settings');
  }, { origin: ORIGIN, key: RETURN_KEY });
  // No matching PKCE pending authorization exists, so this callback must be rejected.
  await page.goto(ORIGIN + '/?code=invalid-synthetic-code&state=' + state);
  await expect.poll(() => page.url(), { timeout: 20_000 }).not.toContain('code=');
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole('button', { name: 'Connect THIEPN Account' })).toBeVisible();
  expect(api.uploads).toBe(0);
  expect(api.tokenExchanges).toBe(0);
});

test('sync requires deliberate adoption and preserves data across two devices', async ({ page, context, browser }) => {
  const api = await interceptProduction(context);
  await seedSession(context);
  await page.goto(ORIGIN + '/#settings');
  await expect(page.getByRole('button', { name: 'Sync this device' })).toBeVisible({ timeout: 30_000 });
  expect(api.uploads).toBe(0);

  const limit1 = page.locator('input[name="dailyNewLimit"]');
  await limit1.fill('18');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.locator('[data-status]')).toContainText('Saved on this device.');
  expect(api.uploads).toBe(0);

  await page.getByRole('button', { name: 'Sync this device' }).click();
  await expect(page.getByText('This device is now synced to THIEPN Account.')).toBeVisible();
  expect(api.cloud?.revision).toBe(1);
  expect(api.uploads).toBe(1);

  const second = await browser.newContext();
  try {
    // Both isolated devices address one synthetic shared cloud.
    // The first context's backend handlers are not inherited by second.
    await second.route(ORIGIN + '/**', async route => {
      const incoming = new URL(route.request().url());
      const asset = await route.fetch({ url: ROOT + incoming.pathname + incoming.search });
      await route.fulfill({ response: asset });
    });
    await second.route(ISSUER + '/**', async route => {
      const req = route.request(), url = new URL(req.url());
      const json = (data, status = 200) => route.fulfill({
        status, contentType: 'application/json', headers: {
          'Access-Control-Allow-Origin': ORIGIN,
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'apikey,authorization,content-type,prefer'
        }, body: JSON.stringify(data)
      });
      if (req.method() === 'OPTIONS') return json(null, 204);
      if (url.pathname === '/auth/v1/user') return json({ id: USER_ID, email: 'french-integration@example.invalid' });
      if (url.pathname === '/rest/v1/account_app_connections') return json([{ status: 'connected' }]);
      if (url.pathname === '/rest/v1/french_sync_state') return json(api.cloud ? [api.cloud] : []);
      if (url.pathname === '/rest/v1/rpc/sync_thiepn_french_state') {
        const data = req.postDataJSON();
        if (data.p_expected_revision !== (api.cloud?.revision ?? null)) return json({ message: 'FRENCH_SYNC_CONFLICT' }, 409);
        api.uploads++;
        api.cloud = { revision: (api.cloud?.revision ?? 0) + 1, state: data.p_state, updated_at: new Date().toISOString() };
        return json(api.cloud);
      }
      return json({ message: 'Unknown synthetic path' }, 404);
    });
    await second.route(ACCOUNT + '/**', route => route.fulfill({
      status: 200, contentType: 'text/html',
      body: `<script>parent.postMessage({type:'thiepn:sso-probe:v1',clientId:'${CLIENT}',signedIn:false,eligible:true},'${ORIGIN}')</script>`
    }));
    await seedSession(second);

    const page2 = await second.newPage();
    await page2.goto(ORIGIN + '/#settings');
    await expect(page2.getByRole('button', { name: 'Sync this device' })).toBeVisible({ timeout: 30_000 });
    await page2.getByRole('button', { name: 'Sync this device' }).click();
    await expect(page2.getByText('Cloud French progress was restored on this device.')).toBeVisible();
    expect(api.uploads).toBe(1);
    await page2.reload(); // Rehydrate the restored local state into the route's form.
    await expect(page2.locator('input[name="dailyNewLimit"]')).toHaveValue('18');

    // A genuinely concurrent edit requires device B to stop receiving
    // automatic focus/online cloud pulls before device A commits revision 2.
    await second.setOffline(true);

    await limit1.fill('19');
    await page.getByRole('button', { name: 'Save settings' }).click();
    await expect(page.locator('[data-status]')).toContainText('Saved on this device.');
    await page.getByRole('button', { name: 'Sync now' }).click();
    await expect(page.getByText('This device is now synced to THIEPN Account.')).toBeVisible();
    await expect.poll(() => api.cloud?.revision).toBe(2);

    const limit2 = page2.locator('input[name="dailyNewLimit"]');
    await limit2.fill('23');
    await page2.getByRole('button', { name: 'Save settings' }).click();
    await expect(page2.locator('[data-status]')).toContainText('Saved on this device.');
    // No online reconciliation can have run on B since it was disconnected.
    await second.setOffline(false);
    await page2.getByRole('button', { name: 'Sync now' }).click();
    await expect(page2.getByText(/French changed on this device and in the cloud/)).toBeVisible();
    await expect(page2.getByRole('button', { name: 'Use cloud' })).toBeVisible();
    await expect.poll(() => api.cloud?.revision).toBe(2);
    expect(api.uploads).toBe(2);

    page2.once('dialog', dialog => dialog.accept());
    await page2.getByRole('button', { name: 'Use cloud' }).click();
    await expect(page2.getByText('Cloud French progress was restored on this device.')).toBeVisible();
    await page2.reload();
    await expect(page2.locator('input[name="dailyNewLimit"]')).toHaveValue('19');
    expect(api.uploads).toBe(2);
  } finally {
    await second.close();
  }
});

test('Account disconnection never auto-reconnects or uploads local changes', async ({ page, context }) => {
  const api = await interceptProduction(context, { connected: false });
  await seedSession(context);
  await page.goto(ORIGIN + '/#settings');
  await expect(page.getByRole('button', { name: 'Reconnect French through THIEPN Account' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sync this device' })).toHaveCount(0);
  const limit = page.locator('input[name="dailyNewLimit"]');
  await limit.fill('27');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.locator('[data-status]')).toContainText('Saved on this device.');
  await page.reload();
  await expect(page.locator('input[name="dailyNewLimit"]')).toHaveValue('27');
  expect(api.uploads).toBe(0);
  expect(api.tokenExchanges).toBe(0);
  expect(api.requests.some(request => request.includes('oauth/authorize'))).toBe(false);
});

test('pausing during an in-flight sync never turns cloud sync back on', async ({ page, context }) => {
  const api = await interceptProduction(context);
  await seedSession(context);
  await page.goto(ORIGIN + '/#settings');
  await page.getByRole('button', { name: 'Sync this device' }).click();
  await expect(page.getByRole('button', { name: 'Sync now' })).toBeVisible({ timeout: 30_000 });
  await expect.poll(() => api.cloud?.revision).toBe(1);

  await page.locator('input[name="dailyNewLimit"]').fill('31');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.locator('[data-status]')).toContainText('Saved on this device.');
  api.delayWriteMs = 650;
  await page.getByRole('button', { name: 'Sync now' }).click();
  await expect.poll(() => api.writeStarted).toBe(2);
  await page.getByRole('button', { name: 'Pause sync' }).click();
  await expect.poll(() => api.cloud?.revision).toBe(2);
  await expect(page.getByRole('button', { name: 'Sync this device' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sync now' })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Sync this device' })).toBeVisible();
  expect(api.uploads).toBe(2);
});
