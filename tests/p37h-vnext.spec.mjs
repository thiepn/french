import { test,expect } from '@playwright/test';

test('Progress is a real evidence workspace',async({page})=>{
  await page.goto('/#progress');
  await expect(page.getByRole('heading',{name:'Progress'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Vocabulary coverage'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Skill health'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'CEFR coverage'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Review pressure'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Weakest vocabulary'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'What to do next'})).toBeVisible();
});

test('Settings persist preferences and expose recovery controls',async({page})=>{
  await page.goto('/#settings');
  const newLimit=page.locator('input[name="dailyNewLimit"]');
  await expect(newLimit).toBeVisible();
  await newLimit.fill('17');
  await page.getByRole('button',{name:'Save settings'}).click();
  await expect(page.locator('[data-status]')).toContainText('Saved on this device.');
  await page.goto('/#home');
  await page.goto('/#settings');
  await expect(page.locator('input[name="dailyNewLimit"]')).toHaveValue('17');
  await expect(page.getByRole('button',{name:'Export backup'})).toBeVisible();
  await expect(page.locator('input[data-import]')).toHaveAttribute('accept',/json/);
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
  await expect(page.getByRole('button',{name:/Speak now|Recognition unavailable/})).toBeVisible();
});

test('installed vNext shell survives a real offline reload',async({page,context})=>{
  await page.goto('/#home');
  await page.evaluate(async()=>{
    if(!('serviceWorker' in navigator))throw new Error('service worker unavailable');
    await navigator.serviceWorker.ready;
  });
  if(!await page.evaluate(()=>Boolean(navigator.serviceWorker.controller))){
    await page.reload();
    await expect.poll(()=>page.evaluate(()=>Boolean(navigator.serviceWorker.controller)),{timeout:15_000}).toBeTruthy();
  }
  await context.setOffline(true);
  try{
    await page.reload();
    await expect(page.getByRole('heading',{name:'Continue French'})).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-shell-ready','true');
  }finally{
    await context.setOffline(false);
  }
});
