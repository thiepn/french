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

test('Read restores the native P14 corpus and paired listening bridge',async({page})=>{
  await page.goto('/#read');
  await expect(page.getByRole('heading',{name:'Read'})).toBeVisible();
  await expect(page.getByText(/25 original graded texts/i)).toBeVisible({timeout:30_000});
  await expect(page.getByRole('heading',{name:'Recommended now'})).toBeVisible();
  const firstOpen=page.getByRole('button',{name:/Open|Resume/}).first();
  await firstOpen.click();
  await expect(page.getByRole('button',{name:'Listen pair'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Speak context'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Extensive'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Intensive'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Targeted'})).toBeVisible();
  await page.getByRole('button',{name:'Listen pair'}).click();
  await expect(page.getByRole('heading',{name:'Listen'})).toBeVisible();
  await expect(page.getByText(/aligned segments ready/i)).toBeVisible({timeout:30_000});
  await expect(page.getByRole('button',{name:/Back to /})).toBeVisible();
});

test('Listen exposes support-aware contextual evidence without moving SRS',async({page})=>{
  await page.goto('/#listen');
  await expect(page.getByRole('heading',{name:'Listen'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Comprehensible'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Intensive'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Targeted'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Play audio'})).toBeVisible({timeout:30_000});
  await expect(page.getByRole('button',{name:'Reveal transcript'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Reveal translation'})).toBeDisabled();
  await expect(page.getByRole('textbox',{name:'Type what you hear'})).toBeVisible();
});

test('Speak exposes four modes, local recording and conservative recognition',async({page})=>{
  await page.goto('/#speak');
  await expect(page.getByRole('heading',{name:'Speak'})).toBeVisible();
  for(const name of ['Pronunciation','Shadowing','Spoken recall','Spoken transfer'])await expect(page.getByRole('button',{name})).toBeVisible();
  await expect(page.getByRole('button',{name:'Play model'})).toBeVisible({timeout:30_000});
  await expect(page.getByRole('button',{name:'Start recording'})).toBeVisible();
  await expect(page.getByRole('button',{name:/Check recognition|Recognition unavailable/})).toBeVisible();
  await expect(page.getByText(/not an accent or pronunciation score/i)).toBeVisible();
  await expect(page.getByText('Manual judgment')).toBeVisible();
  await expect(page.getByRole('button',{name:'Slow model'})).toBeVisible();
  await page.getByRole('button',{name:'Spoken transfer'}).click();
  await expect(page.getByText(/P12 p12-/)).toBeVisible();
  await expect(page.getByText(/Required:/)).toBeVisible();
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
