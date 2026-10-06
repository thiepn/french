import { test, expect } from '@playwright/test';

const EXPECTED_TITLE = 'French — Adaptive language learning';
const EXPECTED_SUBTITLE = 'Adaptive French · vocabulary, grammar, listening, speaking & transfer';
const EXPECTED_BACKUP = 'french-complete-backup-v5.24.0.json';
const STARTUP_BUDGET_MS = 120000;

async function completeOnboardingIfNeeded(page) {
  const onboarding = page.locator('#v385-onboarding');
  if (!(await onboarding.isVisible().catch(() => false))) return;
  const start = onboarding.getByRole('button', { name: 'Save & start' });
  await expect(start).toBeVisible();
  /* WebKit can report the continuously settling first-run dialog as
     actionability-unstable while its real button is already visible. Invoke
     the button's normal DOM click so this helper tests onboarding behavior,
     not Playwright's animation heuristic. Navigation itself remains tested
     with real pointer clicks below. */
  await start.evaluate(button => button.click());
  await expect(onboarding).toBeHidden({ timeout: 15000 });
}

async function waitForStableBoot(page) {
  const main = page.locator('#main');
  await expect(main).toBeVisible();
  await expect(main.locator('.loading-screen')).toHaveCount(0, { timeout: STARTUP_BUDGET_MS });
  await expect(page.locator('#main h1, #main h2, #v385-onboarding[open]').first()).toBeVisible({ timeout: STARTUP_BUDGET_MS });

  await expect(page.locator('html')).toHaveAttribute('data-release', 'p35-stable-release', { timeout: STARTUP_BUDGET_MS });
  await expect(page.locator('html')).toHaveAttribute('data-release-channel', 'stable');
  await expect(page.locator('html')).toHaveAttribute('data-release-acceptance', 'browser-device-defect-only');
  await expect(page.locator('html')).toHaveAttribute('data-product-scope', 'adaptive-language-learning');
  await expect(page.locator('html')).toHaveAttribute('data-app-version', '5.24.0');
  await expect(page.locator('html')).toHaveAttribute('data-p35-boot-ready', 'true', { timeout: STARTUP_BUDGET_MS });

  await expect(page).toHaveTitle(EXPECTED_TITLE);
  await expect(page.locator('.brand-copy span')).toHaveText(EXPECTED_SUBTITLE);
  await expect(page.locator('body')).not.toContainText('Vocabulary could not be loaded');
  await expect(page.locator('body')).not.toContainText('French could not start');

  await completeOnboardingIfNeeded(page);
}

async function boot(page) {
  const started = Date.now();
  await page.goto('/', { waitUntil: 'commit', timeout: 15000 });
  await waitForStableBoot(page);
  const elapsed = Date.now() - started;
  expect(elapsed, `cold start exceeded ${STARTUP_BUDGET_MS} ms CI acceptance budget`).toBeLessThanOrEqual(STARTUP_BUDGET_MS);
  return elapsed;
}

async function openView(page, view) {
  const selector = `[aria-label="Primary navigation"] button[data-view="${view}"]:visible`;
  const button = page.locator(selector).first();
  await expect(button).toBeVisible();
  await button.click();
  /* Navigation is intentionally rebuilt by the current compatibility stack.
     Re-acquire the active control instead of asserting on the detached/replaced
     button object that initiated the navigation. */
  await expect(page.locator(`[aria-label="Primary navigation"] button[data-view="${view}"][aria-current="page"]:visible`).first()).toBeVisible();
}

async function openDataSettings(page) {
  await openView(page, 'settings');
  const dataTab = page.getByRole('tab', { name: 'Data', exact: true });
  await expect(dataTab).toBeVisible();
  await dataTab.click();
  await expect(dataTab).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('heading', { name: 'Data & recovery' })).toBeVisible();
}

test('stable shell boots, identifies itself correctly, and core navigation remains usable', async ({ page }) => {
  test.setTimeout(150000);
  const pageErrors = [];
  const p25AuditErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error?.message || error)));
  page.on('console', message => {
    if (message.type() === 'error' && message.text().includes('French P25 CEFR progression audit failed')) {
      p25AuditErrors.push(message.text());
    }
  });

  await boot(page);

  await expect(page.locator('a.skip-link')).toHaveAttribute('href', '#main');
  await expect(page.locator('#thiepn-account-chip')).toBeVisible();

  const releaseState = await page.evaluate(() => ({
    release: document.documentElement.dataset.release,
    channel: document.documentElement.dataset.releaseChannel,
    acceptance: document.documentElement.dataset.releaseAcceptance,
    productScope: document.documentElement.dataset.productScope,
    appVersion: document.documentElement.dataset.appVersion,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    subtitle: document.querySelector('.brand-copy span')?.textContent || ''
  }));

  expect(releaseState).toMatchObject({
    release: 'p35-stable-release',
    channel: 'stable',
    acceptance: 'browser-device-defect-only',
    productScope: 'adaptive-language-learning',
    appVersion: '5.24.0',
    subtitle: EXPECTED_SUBTITLE
  });
  expect(releaseState.description).toContain('listening');
  expect(releaseState.description).toContain('speaking');

  const overflow = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth - window.innerWidth,
    body: document.body.scrollWidth - window.innerWidth
  }));
  expect(overflow.document).toBeLessThanOrEqual(2);
  expect(overflow.body).toBeLessThanOrEqual(2);

  await openView(page, 'browse');
  await expect(page.getByRole('searchbox', { name: 'Search vocabulary' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Words', exact: true })).toBeVisible();

  await openView(page, 'progress');
  await expect(page.getByRole('heading', { name: 'What you know, what is fragile, what to do next' })).toBeVisible();

  await openView(page, 'dashboard');
  await expect(page.locator('#main h1, #main h2').first()).toBeVisible();

  expect(pageErrors).toEqual([]);
  expect(p25AuditErrors).toEqual([]);
});

test('manifest, static shell, and release metadata expose the full stable product', async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Static HTTP metadata is engine-independent and is qualified once.');

  /* Static deployment metadata is an origin contract, not an application
     main-thread contract. Use Playwright's request context directly: the
     runtime browser matrix already proves the rendered title and shell. */
  const [manifestResponse, releaseResponse, shellResponse] = await Promise.all([
    request.get('/manifest.webmanifest'),
    request.get('/release.json'),
    request.get('/')
  ]);
  expect(manifestResponse.ok()).toBe(true);
  expect(releaseResponse.ok()).toBe(true);
  expect(shellResponse.ok()).toBe(true);
  const manifest = await manifestResponse.json();
  const release = await releaseResponse.json();
  const shell = await shellResponse.text();
  expect(manifest.name).toBe('French');
  expect(manifest.short_name).toBe('French');
  expect(manifest.start_url).toBe('/');
  expect(manifest.scope).toBe('/');
  expect(manifest.display).toBe('standalone');
  expect(manifest.description).toContain('grammar');
  expect(manifest.description).toContain('speaking');
  expect((manifest.icons || []).map(icon => icon.src)).toEqual(
    expect.arrayContaining(['/icon-192.png', '/icon-512.png', '/maskable-icon.svg'])
  );

  expect(release).toMatchObject({
    app: 'French',
    appVersion: '5.24.0',
    phase: 'P35',
    channel: 'stable',
    learnerLogic: 'frozen-from-p33'
  });

  expect(shell).toContain('<title>French — Adaptive language learning</title>');
  expect(shell).toContain('<small class="version-badge">v5.24.0</small>');
  expect(shell).toContain('Adaptive French · vocabulary, grammar, listening, speaking &amp; transfer');
});

test('offline shell survives a controlled reload after first online boot', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'One Chromium service-worker run is sufficient for shell qualification.');
  test.setTimeout(240000);

  await boot(page);

  const serviceWorkerReady = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return false;
    const registration = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise(resolve => setTimeout(() => resolve(null), 15000))
    ]);
    return Boolean(registration?.active);
  });
  expect(serviceWorkerReady).toBe(true);

  /* An active worker is not sufficient: the current page must actually be
     controlled before an offline navigation is meaningful. Once it controls
     this page, a second online reload adds no coverage and merely repeats the
     expensive single-file cold start. */
  await expect.poll(
    () => page.evaluate(() => Boolean(navigator.serviceWorker?.controller)),
    { timeout: 15000, message: 'service worker should control the release page before offline reload' }
  ).toBe(true);

  await page.context().setOffline(true);
  try {
    const started = Date.now();
    await page.reload({ waitUntil: 'commit', timeout: 15000 });
    await waitForStableBoot(page);
    expect(Date.now() - started, 'offline controlled reload exceeded startup acceptance budget').toBeLessThanOrEqual(STARTUP_BUDGET_MS);
    await expect(page.locator('#main')).toBeVisible();
    await expect(page.locator('body')).not.toContainText('Vocabulary could not be loaded');
  } finally {
    await page.context().setOffline(false);
  }
});

test('progress backup exports and malformed imports fail safely', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'File-flow acceptance is exercised once in Chromium.');

  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error?.message || error)));

  await boot(page);
  await openDataSettings(page);

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#v371-export-backup').click()
  ]);
  expect(download.suggestedFilename()).toBe(EXPECTED_BACKUP);

  const dialogPromise = new Promise(resolve => {
    page.once('dialog', async dialog => {
      const message = dialog.message();
      await dialog.dismiss();
      resolve(message);
    });
  });

  await page.locator('#v371-import-backup').setInputFiles({
    name: 'broken-progress.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{not-valid-json', 'utf8')
  });

  const dialogMessage = await dialogPromise;
  expect(dialogMessage).toContain('Could not import this backup');
  expect(pageErrors).toEqual([]);
});

test('corrupt settings and missing speech recognition do not break startup', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Recovery path is browser-independent and needs one deterministic execution.');

  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error?.message || error)));

  await page.addInitScript(() => {
    localStorage.setItem('french3000-settings-v2', '{broken-json');
    try { delete window.SpeechRecognition; } catch {}
    try { delete window.webkitSpeechRecognition; } catch {}
  });

  await boot(page);

  await expect(page.locator('#main')).toBeVisible();
  await expect(page.locator('body')).not.toContainText('Vocabulary could not be loaded');
  await openDataSettings(page);
  await expect(page.locator('#v371-export-backup')).toBeVisible();

  expect(pageErrors).toEqual([]);
});
