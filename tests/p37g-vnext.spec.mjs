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


test('P37I-D6-B practice-only runner is keyboard reachable and mobile-safe',async({page})=>{
  await page.goto('/#progress');
  const panel=page.locator('.p26-diagnostics');
  await expect(panel.getByRole('heading',{name:'Targeted remediation (P26)'})).toBeVisible();
  const seeded=await page.evaluate(async()=>new Promise((resolve,reject)=>{
    const req=indexedDB.open('thiepn-french-vnext');req.onerror=()=>reject(req.error);
    req.onsuccess=()=>{
      const db=req.result,tx=db.transaction('activity','readwrite');
      const row={schema:'thiepn-french-review-event-v1',eventId:'d6b:g:1',
       noteId:'d6b-mobile',id:'d6b-mobile::d31:0:production',
       practice:'written-bridge',skill:'production',practiceOnly:true,
       correct:false,typedQuality:'near',errorCategory:'connector',
       t:Date.now()-10000,rating:'again',supportLevel:0};
      tx.objectStore('activity').put(row,row.eventId);
      tx.oncomplete=()=>{db.close();resolve(true);};tx.onerror=()=>reject(tx.error);
    };
  }));
  expect(seeded).toBe(true);
  await page.reload();
  const start=panel.getByRole('button',{name:'Start targeted repair (up to 3 cases)'});
  await expect(start).toBeVisible();
  await start.focus();
  await expect(start).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(panel.locator('.p26-run-card')).toBeVisible();
  const counts=await page.evaluate(async()=>new Promise(resolve=>{
    const req=indexedDB.open('thiepn-french-vnext');
    req.onsuccess=()=>{const db=req.result,tx=db.transaction(['srs','activity'],'readonly');
      const s=tx.objectStore('srs').count(),a=tx.objectStore('activity').count();
      tx.oncomplete=()=>{db.close();resolve([s.result,a.result]);};};
  }));
  await panel.getByRole('button',{name:'I completed guided practice — no grade'}).click();
  // Wait for the async learner-state IDB transaction to commit before reload.
  // A plain click is not a durability barrier on Android emulation.
  await expect(panel.locator('.p26-run-card')).toContainText('rebuild');
  await page.reload();
  await expect(panel.locator('.p26-run-card')).toContainText('rebuild');
  const after=await page.evaluate(async()=>new Promise(resolve=>{
    const req=indexedDB.open('thiepn-french-vnext');
    req.onsuccess=()=>{const db=req.result,tx=db.transaction(['srs','activity'],'readonly');
      const s=tx.objectStore('srs').count(),a=tx.objectStore('activity').count();
      tx.oncomplete=()=>{db.close();resolve([s.result,a.result]);};};
  }));
  expect(after).toEqual(counts);
  const viewport=await page.evaluate(()=>({content:document.documentElement.scrollWidth,viewport:innerWidth}));
  expect(viewport.content).toBeLessThanOrEqual(viewport.viewport+2);
});


test('B6 source-linked missions and original functions remain readable by keyboard on small viewports',async({page})=>{
  await page.goto('/#conversation');
  const source=page.locator('.conversation-source-parity');
  await expect(source.locator('summary')).toContainText('25 source definitions');
  await source.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(source).toContainText('Source request · not independently assessed');
  await expect(source).toContainText('Source sequence · not independently assessed');
  await expect(page.getByText(/Five native chains match their P35 P18 source scenario identities/)).toBeVisible();
  await page.getByRole('button',{name:/A1 Morning in town/}).click();
  await expect(page.locator('.conversation-source-note')).toContainText('bakery-buy');
  const before=await page.locator('.conversation-prompt').textContent();
  await page.getByRole('button',{name:'Pause & home'}).click();
  await expect(page.getByRole('button',{name:'Resume active'})).toBeVisible();
  await page.reload();
  // The native route automatically renders saved active dialogue on reload;
  // a Resume button exists only on the paused home view.
  await expect(page.locator('.conversation-prompt')).toHaveText(before??'');
  const widths=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport+2);
});


test('B7 original source mission keyboard launch and reload resume on actual browser DOM',async({page})=>{
  await page.goto('/#conversation');
  await expect(page.getByRole('heading',{name:'Original P35 dialogue graphs'})).toBeVisible();
  const btn=page.getByRole('button',{name:/Morning in town · 3 original source graphs/});
  await expect(btn).toBeVisible();
  await btn.focus();
  await expect(btn).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByText(/Source mission Morning in town · task 1\/3/)).toBeVisible();
  const prompt=await page.locator('.conversation-prompt').textContent();
  await page.getByRole('button',{name:'Pause original graph & home'}).click();
  await expect(page.getByRole('button',{name:'Resume original dialogue'})).toBeVisible();
  await page.reload();
  await expect(page.locator('.conversation-prompt')).toHaveText(prompt??'');
  await page.getByRole('button',{name:'Ask for clarification'}).click();
  await expect(page.getByText(/clarification attempts/)).toBeVisible();
  const widths=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
  expect(widths.document).toBeLessThanOrEqual(widths.viewport+2);
});
