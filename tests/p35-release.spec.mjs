import { test, expect } from '@playwright/test';

const EXPECTED_TITLE = 'French — Adaptive language learning';
const EXPECTED_SUBTITLE = 'Adaptive French · vocabulary, grammar, listening, speaking & transfer';

async function waitForStableBoot(page) {
  await page.waitForFunction(() => {
    const main = document.querySelector('#main');
    if (!main) return false;
    if (main.querySelector('.loading-screen')) return false;
    const text = String(main.textContent || '');
    if (/French could not start|Vocabulary could not be loaded/i.test(text)) return false;
    return Boolean(main.querySelector('h1,h2') || document.querySelector('#v385-onboarding[open]'));
  }, null, { timeout: 60000 });

  await page.waitForFunction(
    () => document.documentElement.dataset.release === 'p35-stable-release',
    null,
    { timeout: 15000 }
  );

  await expect(page.locator('#main')).toBeVisible();
  await expect(page).toHaveTitle(EXPECTED_TITLE);
  await expect(page.locator('.brand-copy span')).toHaveText(EXPECTED_SUBTITLE);
  await expect(page.locator('body')).not.toContainText('Vocabulary could not be loaded');
  await expect(page.locator('body')).not.toContainText('French could not start');

  const onboarding = page.locator('#v385-onboarding');
  if (await onboarding.isVisible().catch(() => false)) {
    await onboarding.locator('#v385-defaults').click();
    await onboarding.locator('#v385-start').click();
    await expect(onboarding).toBeHidden();
  }
}

async function boot(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await waitForStableBoot(page);
}

async function openView(page, view) {
  const button = page.locator(`[aria-label="Primary navigation"] button[data-view="${view}"]:visible`).first();
  await expect(button).toBeVisible();
  await button.click();
  await expect(button).toHaveAttribute('aria-current', 'page');
}

test('stable shell boots, identifies itself correctly, and core navigation remains usable', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error?.message || error)));

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
  await expect(page.locator('#browse-search')).toBeVisible();

  await openView(page, 'progress');
  await expect(page.locator('#export-progress')).toBeVisible();

  await openView(page, 'dashboard');
  await expect(page.locator('#main')).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test('manifest, static shell, and release metadata expose the full stable product', async ({ page }) => {
  await boot(page);

  const metadata = await page.evaluate(async () => {
    const [manifestResponse, releaseResponse, shellResponse] = await Promise.all([
      fetch('/manifest.webmanifest', { cache: 'no-store' }),
      fetch('/release.json', { cache: 'no-store' }),
      fetch('/', { cache: 'no-store' })
    ]);
    if (!manifestResponse.ok) throw new Error(`manifest HTTP ${manifestResponse.status}`);
    if (!releaseResponse.ok) throw new Error(`release marker HTTP ${releaseResponse.status}`);
    if (!shellResponse.ok) throw new Error(`shell HTTP ${shellResponse.status}`);
    return {
      manifest: await manifestResponse.json(),
      release: await releaseResponse.json(),
      shell: await shellResponse.text()
    };
  });

  const { manifest, release, shell } = metadata;
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

  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitForStableBoot(page);

  await page.context().setOffline(true);
  try {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await waitForStableBoot(page);
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
  await openView(page, 'progress');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#export-progress').click()
  ]);
  expect(download.suggestedFilename()).toBe('french-progress.json');

  const dialogPromise = new Promise(resolve => {
    page.once('dialog', async dialog => {
      const message = dialog.message();
      await dialog.dismiss();
      resolve(message);
    });
  });

  await page.locator('#import-progress').setInputFiles({
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
  await openView(page, 'progress');
  await expect(page.locator('#export-progress')).toBeVisible();

  expect(pageErrors).toEqual([]);
});
