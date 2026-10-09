import { test,expect } from '@playwright/test';

async function readActiveSession(page){
  return page.evaluate(async()=>new Promise((resolve,reject)=>{
    const request=indexedDB.open('thiepn-french-vnext');
    request.onerror=()=>reject(request.error);
    request.onsuccess=()=>{
      const db=request.result;
      const tx=db.transaction('session','readonly');
      const get=tx.objectStore('session').get('active');
      get.onsuccess=()=>{resolve(get.result??null);db.close();};
      get.onerror=()=>{reject(get.error);db.close();};
    };
  }));
}

test('shell stays content-independent on first Home paint',async({page})=>{
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-shell-ready','true');
  await expect(page.getByRole('heading',{name:'Continue French'})).toBeVisible();

  const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(entry=>entry.name));
  expect(resources.some(url=>url.includes('/content/packs/'))).toBeFalsy();
  expect(resources.some(url=>url.includes('/content/search/'))).toBeFalsy();
});

test('Words searches full corpus off bootstrap and lazily resolves a result',async({page})=>{
  await page.goto('/#words');
  const input=page.getByRole('searchbox',{name:'Search French or English'});
  await expect(input).toBeVisible();
  await expect(page.locator('[data-status]')).toContainText(/words ready|local search fallback/i,{timeout:30_000});

  await input.fill('bonjour');
  const result=page.locator('.word-result').filter({hasText:/bonjour/i}).first();
  await expect(result).toBeVisible();
  await result.click();
  await expect(page.locator('.word-detail h2')).toContainText(/bonjour/i);

  const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(entry=>entry.name));
  expect(resources.some(url=>url.includes('/content/search/vocabulary-index.json'))).toBeTruthy();
  expect(resources.filter(url=>url.includes('/content/packs/')).length).toBeLessThanOrEqual(1);
});

test('new-card session persists practice-only reinforcement, undo, and reload resume',async({page})=>{
  await page.goto('/#learn');
  const newButton=page.getByRole('button',{name:'Learn new words'});
  await expect(newButton).toBeVisible();
  await newButton.click();
  await expect(page).toHaveURL(/#review$/);

  await expect(page.locator('.review-card')).toBeVisible({timeout:30_000});
  const before=await readActiveSession(page);
  expect(before).toBeTruthy();
  expect(before.mode).toBe('learn');
  expect(before.currentId).toBeTruthy();
  const firstId=before.currentId;

  await page.getByRole('button',{name:'Show answer'}).click();
  await page.getByRole('button',{name:'Again'}).click();

  await expect(page.getByRole('button',{name:'Undo answer'})).toBeVisible();
  const after=await readActiveSession(page);
  expect(after.undo.length).toBe(1);
  expect(after.cursor).toBe(1);
  expect(after.reinforcements.length).toBeGreaterThan(0);
  expect(after.queueIds.filter(id=>id===firstId).length).toBeGreaterThanOrEqual(2);
  expect(after.reinforcements.every(item=>after.queueIds[item.index]===firstId)).toBeTruthy();

  const undoButton=page.getByRole('button',{name:'Undo answer'});
  await undoButton.click();
  await expect(undoButton).toBeHidden();
  await expect.poll(async()=>{
    const current=await readActiveSession(page);
    return current?.currentId??'';
  }).toBe(firstId);
  const undone=await readActiveSession(page);
  expect(undone.currentId).toBe(firstId);
  expect(undone.cursor).toBe(0);
  expect(undone.undo.length).toBe(0);
  expect(undone.reinforcements.length).toBe(0);

  await page.reload();
  await expect(page).toHaveURL(/#review$/);
  await expect(page.locator('.review-card')).toBeVisible({timeout:30_000});
  const resumed=await readActiveSession(page);
  expect(resumed.currentId).toBe(firstId);
});

test('Today session composes persisted session state on a fresh profile',async({page})=>{
  await page.goto('/#learn');
  await page.getByRole('button',{name:'Study today'}).click();
  await expect(page).toHaveURL(/#review$/);
  const session=await readActiveSession(page);
  expect(session).toBeTruthy();
  expect(session.mode).toBe('today');
  expect(session.queueIds.length).toBeGreaterThan(0);
  expect(session.expiresAt-session.updatedAt).toBeGreaterThan(13*86_400_000);
});

test('P37I-D5 P21 exposure and P23 block work in the cross-engine/browser matrix',async({page})=>{
  await page.goto('/#read');
  const panel=page.locator('.open-world-entry');
  await expect(panel).toBeVisible();
  await panel.locator('textarea').fill(
    'Bonjour nous apprenons le français avec un texte personnel contenant suffisamment de phrases et de mots. '.repeat(3));
  await panel.getByRole('button',{name:'Analyze & read'}).click();
  await expect(page.locator('.open-world-reader')).toBeVisible();
  await page.getByRole('button',{name:'Finish exposure'}).click();
  await expect(panel).toContainText('1 completed personal reading');
  await page.goto('/#home');
  await expect(page.getByRole('button',{name:'Build a short adaptive block'})).toBeVisible();
  await page.getByRole('button',{name:'Build a short adaptive block'}).click();
  await expect(page.locator('.home-focus')).toContainText('Step 1 of');
  await page.reload();
  await expect(page.locator('.home-focus')).toContainText('Step 1 of');
  await page.getByRole('button',{name:'End block; keep study progress'}).click();
});

test('P37I-D6 P26 diagnostic route is available without CEFR promotion controls',async({page})=>{
 await page.goto('/#progress');
 const panel=page.locator('.p26-diagnostics');
 await expect(panel.getByRole('heading',{name:'Targeted remediation (P26)'})).toBeVisible();
 await expect(panel).toContainText('does not award a repair pass or change SRS');
});
