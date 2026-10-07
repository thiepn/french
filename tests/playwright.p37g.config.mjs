import { defineConfig,devices } from '@playwright/test';

const baseURL=process.env.P37G_BASE_URL||'http://127.0.0.1:4174';

export default defineConfig({
  testDir:'.',
  testMatch:'p37g-vnext.spec.mjs',
  timeout:60_000,
  expect:{timeout:15_000},
  retries:1,
  workers:1,
  reporter:[['line']],
  use:{baseURL,trace:'retain-on-failure',screenshot:'only-on-failure'},
  outputDir:'../test-results/p37g',
  projects:[
    {name:'chromium-desktop',use:{...devices['Desktop Chrome']}},
    {name:'firefox-desktop',use:{...devices['Desktop Firefox']}},
    {name:'webkit-desktop',use:{...devices['Desktop Safari']}},
    {name:'android-chrome',use:{...devices['Pixel 7']}},
    {name:'ios-webkit',use:{...devices['iPhone 15']}}
  ]
});
