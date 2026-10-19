import { defineConfig,devices } from '@playwright/test';

const baseURL=process.env.P37H_BASE_URL||'http://127.0.0.1:4175';

export default defineConfig({
  testDir:'.',
  testMatch:['p37h-vnext.spec.mjs','p37h-account-integration.spec.mjs','p37h-u47-a1-course.spec.mjs','p37h-u48-audio-journey.spec.mjs','p37h-u49-words.spec.mjs','p37h-u49-original-replay.spec.mjs','p37h-u63-learn-entry.spec.mjs'],
  timeout:60_000,
  expect:{timeout:15_000},
  retries:1,
  workers:1,
  reporter:[['line']],
  use:{baseURL,trace:'retain-on-failure',screenshot:'only-on-failure'},
  outputDir:'../test-results/p37h',
  projects:[
    {name:'chromium-desktop',use:{...devices['Desktop Chrome']}},
    {name:'android-chrome',use:{...devices['Pixel 7']}}
  ]
});
