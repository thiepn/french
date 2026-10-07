import { test,expect } from '@playwright/test';

test('Progress is a real evidence workspace',async({page})=>{
  await page.goto('/#progress');
  await expect(page.getByRole('heading',{name:'Progress'})).toBeVisible();
  await expect(page.locator('.progress-grid .stat-card')).toHaveCount(6);
  await expect(page.getByRole('heading',{name:'Last 7 days'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'30-day skill mix'})).toBeVisible();
});

test('Settings persist canonical learner preferences',async({page})=>{
  await page.goto('/#settings');
  const newLimit=page.locator('input[name="dailyNewLimit"]');
  await expect(newLimit).toBeVisible();
  await newLimit.fill('17');
  await page.getByRole('button',{name:'Save settings'}).click();
  await expect(page.locator('[data-status]')).toContainText('Saved on this device.');
  await page.goto('/#home');
  await page.goto('/#settings');
  await expect(page.locator('input[name="dailyNewLimit"]')).toHaveValue('17');
});

test('Listen exposes an on-demand dictation session',async({page})=>{
  await page.goto('/#listen');
  await expect(page.getByRole('heading',{name:'Listen'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Play audio'})).toBeVisible({timeout:30_000});
  await expect(page.getByRole('textbox',{name:'Type what you hear'})).toBeVisible();
});

test('Speak exposes shadowing and capability-aware recognition',async({page})=>{
  await page.goto('/#speak');
  await expect(page.getByRole('heading',{name:'Speak'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Play model'})).toBeVisible({timeout:30_000});
  const speak=page.getByRole('button',{name:/Speak now|Recognition unavailable/});
  await expect(speak).toBeVisible();
});
