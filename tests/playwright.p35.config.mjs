import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.P35_BASE_URL || 'http://127.0.0.1:4173';
const live = /^https:/i.test(baseURL);

export default defineConfig({
  testDir: '.',
  testMatch: /p35-release\.spec\.mjs/,
  timeout: live ? 120000 : 90000,
  expect: { timeout: 15000 },
  retries: 1,
  workers: 1,
  outputDir: '../test-results/p35',
  reporter: [['line']],
  use: {
    baseURL,
    serviceWorkers: 'allow',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off'
  },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox-desktop', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit-desktop', use: { ...devices['Desktop Safari'] } },
    { name: 'android-chrome', use: { ...devices['Pixel 7'] } },
    { name: 'ios-webkit', use: { ...devices['iPhone 13'] } }
  ]
});
