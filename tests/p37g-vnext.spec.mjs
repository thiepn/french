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


test('U1 60-session course exposes rights-gated source references and local preflight',async({page})=>{
  await page.goto('/#course');
  await expect(page.getByRole('heading',{name:'Course',exact:true})).toBeVisible();
  await expect(page.locator('.unified-session')).toHaveCount(60);
  await page.getByLabel('Select course session').selectOption('60');
  await expect(page.locator('[data-detail]')).toContainText('Session 60');
  await expect(page.locator('[data-detail]')).toContainText('reference only');
  await expect(page.locator('[data-detail] code')).toContainText('carnet@211208195e37');
  await page.locator('[data-file]').setInputFiles({
    name:'carnet-export.json',mimeType:'application/json',
    buffer:Buffer.from(JSON.stringify({storageKey:'fr-a1a2-practice-v6',progress:{},history:[{}]}))
  });
  await expect(page.locator('[data-result]')).toContainText('inspectable');
  await expect(page.locator('[data-result]')).toContainText('No data imported');
  await page.locator('[data-file]').setInputFiles({
    name:'bad.json',mimeType:'application/json',buffer:Buffer.from('not JSON')
  });
  await expect(page.locator('[data-result]')).toContainText('blocked');
});

test('U1 lazy Grammar guides check recall without entering native progress',async({page})=>{
  await page.goto('/#course');
  await page.getByRole('button',{name:'Open Grammar'}).click();
  await expect(page).toHaveURL(/#grammar$/);
  await expect(page.getByRole('heading',{name:'Grammar',exact:true})).toBeVisible();
  await expect(page.locator('[data-guide]')).toHaveCount(9);
  await page.getByLabel('Complete: ___ livre est ici.').fill('le');
  await page.getByRole('button',{name:'Check answer'}).click();
  await expect(page.locator('.unified-exercise [role=status]')).toContainText('Correct · practice only');
  await page.locator('[data-level]').selectOption('A2');
  await expect(page.locator('[data-guide]')).toHaveCount(2);
  await expect(page.locator('[data-lesson]')).toContainText('Original U1 guide');
  await page.getByRole('button',{name:'Browse 60-session course'}).click();
  await expect(page).toHaveURL(/#course$/);
});


test('U2 original course makes contextual dialogues, recalls and next lessons accessible',async({page})=>{
  await page.goto('/#course');
  const studio=page.locator('[data-u2-studio]');
  await expect(studio.getByRole('heading',{name:'Original guided lessons'})).toBeVisible();
  await expect(studio.locator('[data-u2-id]')).toHaveCount(20); // U2's 12 preserved + 8 original U3 lessons
  await expect(studio.locator('.u2-dialogue-line')).toHaveCount(3);
  await expect(studio).toContainText('not the 60 Carnet source sessions');
  await studio.getByRole('button',{name:'Show translation'}).first().click();
  await expect(studio.locator('.u2-translation').first()).toBeVisible();
  const first=studio.locator('.u2-exercise').first();
  await first.getByRole('textbox',{name:'Answer task 1'}).fill('suis');
  await first.getByRole('button',{name:'Check answer'}).click();
  await expect(first.getByRole('status')).toContainText('Correct');
  await expect(studio.locator('.u2-practice-tally')).toContainText('1 / 2');
  await studio.getByRole('combobox',{name:'Original lesson'}).selectOption('yesterday');
  await expect(studio.locator('.u2-lesson-heading')).toContainText('What happened yesterday');
  await studio.getByRole('button',{name:'Study Le passé composé'}).click();
  await expect(page).toHaveURL(/#grammar$/);
  await expect(page.locator('[data-u2-grammar]')).toContainText('Common corrections');
  await expect(page.locator('[data-u2-grammar]')).toContainText('Use this in a lesson');
  const challenge=page.locator('[data-u2-grammar] .u2-exercise').first();
  await challenge.getByRole('textbox').fill('as');
  await challenge.getByRole('button',{name:'Check'}).click();
  await expect(challenge.getByRole('status')).toContainText('Correct');
  await page.locator('[data-u2-grammar]').getByRole('button',{name:'What happened yesterday'}).click();
  await expect(page).toHaveURL(/#course$/);
  await expect(page.locator('.u2-lesson-heading')).toContainText('What happened yesterday');
});

test('U2 lexical mapping requires explicit evidence and exports non-authoritative drafts',async({page})=>{
  await page.goto('/#links');
  await expect(page.getByRole('heading',{name:'Sense links'})).toBeVisible();
  await expect(page.locator('[data-status]')).toContainText(/Loaded .*native vocabulary rows|Native index unavailable/,{timeout:30_000});
  await expect(page.locator('.u2-review-option').first()).toBeVisible();
  await page.getByRole('button',{name:'Save draft decision'}).click();
  await expect(page.locator('[data-detail] [role=status]')).toContainText('Saved as local, unapproved');
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Export review draft'}).click();
  const download=await downloadPromise;
  const {readFile}=await import('node:fs/promises');
  const payload=JSON.parse(await readFile(await download.path(),'utf8'));
  expect(payload.schema).toBe('thiepn-french-u2-lexical-review-draft-v1');
  expect(payload.authority).toBe('review-only');
  expect(payload.approved).toBe(false);
  expect(payload.progressImported).toBe(false);
  expect(payload.decisions).toHaveLength(1);
  await page.getByRole('button',{name:'Clear draft decisions'}).click();
  await expect(page.locator('[data-counts]')).toContainText('0 reviewed drafts');
  await expect(page.getByRole('button',{name:'Export review draft'})).toBeDisabled();
});


test('U3 guided prerequisites, themed path, writing prompts and original grammar navigation',async({page})=>{
  await page.goto('/#course');
  const studio=page.locator('[data-u2-studio]');
  await expect(studio.getByRole('heading',{name:'Original guided lessons'})).toBeVisible();
  await expect(studio.locator('[data-u2-id]')).toHaveCount(20);
  await expect(studio.locator('.u3-path-summary')).toContainText('0/20');
  await studio.getByRole('combobox',{name:'Learning pathway'}).selectOption('travel');
  await expect(studio.locator('[data-u2-id="market"]')).toBeVisible();
  await expect(studio.locator('[data-u2-id="memory"]')).toBeHidden();
  await studio.getByRole('combobox',{name:'Learning pathway'}).selectOption('all');
  await studio.getByRole('combobox',{name:'Original lesson'}).selectOption('late-train');
  await expect(studio.locator('.u2-lesson-heading')).toContainText('A delayed train');
  await expect(studio.locator('.u3-prerequisite')).toContainText('Recommended first');
  await studio.locator('.u3-prerequisite').getByRole('button',{name:'Review Buying a ticket'}).click();
  await expect(studio.locator('.u2-lesson-heading')).toContainText('Buying a ticket');
  await studio.getByRole('combobox',{name:'Original lesson'}).selectOption('market');
  await expect(studio.locator('.u2-dialogue-line')).toHaveCount(3);
  await studio.getByRole('button',{name:'Show optional writing guidance'}).click();
  await expect(studio.locator('.u3-writing-hints')).toBeVisible();
  await expect(studio.locator('.u3-writing-hints')).toContainText('pommes');
  const writing=studio.getByRole('textbox',{name:'Free writing response'});
  await writing.fill('Je voudrais trois pommes, s’il vous plaît. Combien ça coûte ?');
  await studio.getByRole('button',{name:'Check structure (not grading)'}).click();
  await expect(studio.locator('.u2-production .u2-feedback')).toContainText('No CEFR or mastery score is assigned');
  await studio.getByRole('button',{name:'Clear response'}).click();
  await expect(writing).toHaveValue('');
  await studio.getByRole('button',{name:'Study Articles indéfinis'}).click();
  await expect(page).toHaveURL(/#grammar$/);
  await expect(page.locator('[data-u2-grammar]')).toContainText('At the market');
});

test('U3 exported lexical review reload is strictly inspected then only kept as draft',async({page})=>{
  await page.goto('/#links');
  await expect(page.locator('[data-status]')).toContainText('Loaded',{timeout:30_000});
  await page.getByRole('button',{name:'Save draft decision'}).click();
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Export review draft'}).click();
  const download=await downloadPromise;
  const {readFile}=await import('node:fs/promises');
  const exported=JSON.parse(await readFile(await download.path(),'utf8'));
  expect(exported.approved).toBe(false);
  await page.getByRole('button',{name:'Clear draft decisions'}).click();
  await expect(page.locator('[data-counts]')).toContainText('0 reviewed drafts');
  await page.locator('[data-import-file]').setInputFiles({name:'review.json',mimeType:'application/json',
    buffer:Buffer.from(JSON.stringify(exported))});
  await expect(page.locator('[data-import-status]')).toContainText('Validated 1 unapproved');
  await expect(page.getByRole('button',{name:'Keep selected as local draft'})).toBeEnabled();
  await page.getByRole('button',{name:'Keep selected as local draft'}).click();
  await expect(page.locator('[data-counts]')).toContainText('1 reviewed drafts');
  await page.locator('[data-import-file]').setInputFiles({name:'forged.json',mimeType:'application/json',
    buffer:Buffer.from(JSON.stringify({...exported,approved:true}))});
  await expect(page.locator('[data-import-status]')).toContainText('Blocked:');
  await expect(page.locator('[data-counts]')).toContainText('1 reviewed drafts');
  await page.getByRole('button',{name:'Clear draft decisions'}).click();
  await expect(page.getByRole('button',{name:'Export review draft'})).toBeDisabled();
});


test('U4 guided journey navigation, targeted error repair and keyboard passage',async({page})=>{
 await page.goto('/#course');
 const studio=page.locator('[data-u2-studio]');
 const journey=studio.locator('.u4-journeys');
 await expect(journey.getByRole('heading',{name:'Guided journeys'})).toBeVisible();
 await expect(journey.locator('[data-journey-lesson]')).toHaveCount(4);
 await journey.getByRole('combobox',{name:'Guided journey'}).selectOption('travel-day');
 await expect(journey.locator('[data-journey-lesson]')).toHaveCount(7);
 await expect(journey.locator('[data-journey-summary]')).toContainText('0/7');
 await journey.getByRole('combobox',{name:'Guided journey'}).selectOption('first-conversations');
 await journey.locator('[data-journey-lesson="greetings"]').click();
 const first=studio.locator('.u2-exercise').first();
 await first.getByRole('textbox',{name:'Answer task 1'}).fill('sont');
 await first.getByRole('button',{name:'Check answer'}).click();
 await expect(first.locator('.u4-repair')).toBeVisible();
 await expect(first.locator('.u4-repair')).toContainText('Focused transfer practice');
 await first.getByRole('textbox',{name:'Focused answer'}).fill('êtes');
 await first.getByRole('button',{name:'Check focused answer'}).click();
 await expect(first.locator('.u4-remediation [role=status]')).toContainText('Correct local transfer response');
 await first.getByRole('textbox',{name:'Answer task 1'}).fill('suis');
 await first.getByRole('button',{name:'Check answer'}).click();
 const second=studio.locator('.u2-exercise').nth(1);
 await second.getByRole('combobox',{name:'Answer task 2'}).selectOption('Bonjour');
 await second.getByRole('button',{name:'Check answer'}).click();
 await expect(journey.locator('[data-journey-summary]')).toContainText('1/4');
 const firstButton=studio.locator('[data-u2-id="greetings"]');
 await firstButton.focus();await firstButton.press('ArrowDown');
 await expect(studio.locator('.u2-lesson-heading')).toContainText('At the café');
 await expect(studio.locator('[data-u2-id="cafe"]')).toBeFocused();
});
test('U4 optional checkpoint explicit export and replay are local, bounded and deny forged claims',async({page})=>{
 await page.goto('/#course');
 const studio=page.locator('[data-u2-studio]');
 const journey=studio.locator('.u4-journeys');
 await expect(journey).toBeVisible();
 const first=studio.locator('.u2-exercise').first();
 await first.getByRole('textbox',{name:'Answer task 1'}).fill('suis');
 await first.getByRole('button',{name:'Check answer'}).click();
 const downloadPromise=page.waitForEvent('download');
 await journey.getByRole('button',{name:'Export local practice checkpoint'}).click();
 const file=await downloadPromise;
 const {readFile}=await import('node:fs/promises');
 const raw=await readFile(await file.path(),'utf8');
 const data=JSON.parse(raw);
 expect(data.authoritative).toBe(false);
 expect(data.approved).toBe(false);
 expect(data.custody).toBe('self-reported-local-only');
 expect(data.events).toHaveLength(1);
 await journey.getByRole('button',{name:'Clear temporary practice'}).click();
 await expect(studio.locator('.u2-practice-tally')).toContainText('0 / 2');
 await journey.locator('input[type="file"]').setInputFiles({
  name:'self-reported.json',mimeType:'application/json',buffer:Buffer.from(raw)
 });
 await expect(journey.locator('.u4-checkpoint-status')).toContainText('Replayed 1 self-reported events');
 await expect(studio.locator('.u2-practice-tally')).toContainText('1 / 2');
 await journey.locator('input[type="file"]').setInputFiles({
  name:'forged.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...data,authoritative:true}))
 });
 await expect(journey.locator('.u4-checkpoint-status')).toContainText('Blocked:');
 await expect(studio.locator('.u2-practice-tally')).toContainText('1 / 2');
});
