import { test, expect } from '@playwright/test';

const EXPECTED_TITLE = 'French — Adaptive language learning';
const EXPECTED_SUBTITLE = 'Adaptive French · vocabulary, grammar, listening, speaking & transfer';
const EXPECTED_VERSION = 'v5.24.0';

async function waitForStableBoot(page) {
  await page.waitForFunction(
    () => document.documentElement.dataset.release === 'p35-stable-release',
    null,
    { timeout: 45000 }
  );
  await expect(page.locator('#main')).toBeVisible();
  await expect(page.locator('.version-badge')).toHaveText(EXPECTED_VERSION);
  await expect(page.locator('.brand-copy span')).toHaveText(EXPECTED_SUBTITLE);
  await expect(page).toHaveTitle(EXPECTED_TITLE);
  await expect(page.locator('body')).not.toContainText('Vocabulary could not be loaded');
}

async function boot(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await waitForStableBoot(page);
}

function navSelector(projectName, view) {
  return /android|ios/i.test(projectName)
    ? `.mobile-nav button[data-view="${view}"]`
    : `.nav button[data-view="${view}"]`;
}

async function openView(page, testInfo, view) {
  const selector = navSelector(testInfo.project.name, view);
  const button = page.locator(selector);
  await expect(button).toBeVisible();
  await button.click();
  await expect(button).toHaveClass(/active/);
}

test('stable shell boots, identifies itself correctly, and core navigation remains usable', async ({ page }, testInfo) => {
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
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
  }));

  expect(releaseState).toMatchObject({
    release: 'p35-stable-release',
    channel: 'stable',
    acceptance: 'browser-device-defect-only',
    productScope: 'adaptive-language-learning',
    appVersion: '5.24.0'
  });
  expect(releaseState.description).toContain('listening');
  expect(releaseState.description).toContain('speaking');

  const overflow = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth - window.innerWidth,
    body: document.body.scrollWidth - window.innerWidth
  }));
  expect(overflow.document).toBeLessThanOrEqual(2);
  expect(overflow.body).toBeLessThanOrEqual(2);

  await openView(page, testInfo, 'browse');
  await expect(page.locator('#browse-search')).toBeVisible();

  await openView(page, testInfo, 'progress');
  await expect(page.locator('#export-progress')).toBeVisible();

  await openView(page, testInfo, 'dashboard');
  await expect(page.locator('#main')).toBeVisible();

  expect(pageErrors).toEqual([]);
});

test('manifest and install metadata expose the full stable product', async ({ page }) => {
  await boot(page);

  const manifest = await page.evaluate(async () => {
    const response = await fetch('/manifest.webmanifest', { cache: 'no-store' });
    if (!response.ok) throw new Error(`manifest HTTP ${response.status}`);
    return response.json();
  });

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

  const release = await page.evaluate(async () => {
    const response = await fetch('/release.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`release marker HTTP ${response.status}`);
    return response.json();
  });

  expect(release).toMatchObject({
    app: 'French',
    appVersion: '5.24.0',
    phase: 'P35',
    channel: 'stable',
    learnerLogic: 'frozen-from-p33'
  });
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
  await openView(page, testInfo, 'progress');

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
  await openView(page, testInfo, 'progress');
  await expect(page.locator('#export-progress')).toBeVisible();

  expect(pageErrors).toEqual([]);
});
