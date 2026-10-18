import { test,expect } from '@playwright/test';

async function idbValue(page,store,key){
  return page.evaluate(({store,key})=>new Promise((resolve,reject)=>{
    const request=indexedDB.open('thiepn-french-vnext');
    request.onerror=()=>reject(request.error);
    request.onsuccess=()=>{
      const db=request.result;
      const tx=db.transaction(store,'readonly');
      const get=tx.objectStore(store).get(key);
      get.onsuccess=()=>{resolve(get.result??null);db.close();};
      get.onerror=()=>{reject(get.error);db.close();};
    };
  }),{store,key});
}
async function idbAll(page,store){
  return page.evaluate(store=>new Promise((resolve,reject)=>{
    const request=indexedDB.open('thiepn-french-vnext');
    request.onerror=()=>reject(request.error);
    request.onsuccess=()=>{
      const db=request.result,rows=[];
      const tx=db.transaction(store,'readonly');
      const cursor=tx.objectStore(store).openCursor();
      cursor.onsuccess=()=>{
        const row=cursor.result;
        if(!row)return;
        rows.push(row.value);row.continue();
      };
      cursor.onerror=()=>reject(cursor.error);
      tx.oncomplete=()=>{resolve(rows);db.close();};
      tx.onerror=()=>{reject(tx.error);db.close();};
    };
  }),store);
}

test('nine primary routes include functional Read surface',async({page})=>{
  await page.goto('/#read');
  await expect(page.getByRole('heading',{name:'Read'})).toBeVisible();
  await expect(page.locator('.primary-nav button')).toHaveCount(9);
  await expect(page.locator('.reading-card')).toHaveCount(25);
  await page.locator('[data-reading]').first().click();
  await expect(page.locator('.reading-text')).toBeVisible();
  await page.getByRole('button',{name:'Finish & review'}).click();
  await expect(page.locator('.reading-questions article').first()).toBeVisible();
  await page.locator('.reading-questions article').first().locator('[data-option]').first().click();

  await expect.poll(async()=>{
    const learner=await idbValue(page,'learner','state-v1');
    const reading=learner?.featureState?.v550Reading;
    return Object.values(reading?.history??{}).some(row=>Number(row?.completionCount)>0);
  }).toBeTruthy();
  await expect.poll(async()=>{
    const rows=await idbAll(page,'activity');
    return rows.some(row=>row.practice==='reading'&&row.practiceOnly===true);
  }).toBeTruthy();
});

test('Listen records practice-only evidence without scheduling',async({page})=>{
  await page.goto('/#listen');
  await expect(page.getByRole('heading',{name:'Listen'})).toBeVisible();
  await expect(page.locator('.listen-options button').first()).toBeVisible();
  await page.locator('.listen-options button').first().click();
  await expect.poll(async()=>{
    const rows=await idbAll(page,'activity');
    return rows.some(row=>row.practice==='listening'&&row.practiceOnly===true);
  }).toBeTruthy();
});

test('Speak works without requiring microphone permission and stores self-assessment',async({page})=>{
  await page.goto('/#speak');
  await expect(page.getByRole('heading',{name:'Speak'})).toBeVisible();
  await expect(page.getByRole('button',{name:'I got it'})).toBeVisible();
  await page.getByRole('button',{name:'I got it'}).click();
  await expect.poll(async()=>{
    const rows=await idbAll(page,'activity');
    return rows.some(row=>row.practice==='speaking'&&row.practiceOnly===true&&row.correct===true);
  }).toBeTruthy();
});

test('Progress renders canonical corpus and skill analytics',async({page})=>{
  await page.goto('/#progress');
  await expect(page.getByRole('heading',{name:'Progress'})).toBeVisible();
  await expect(page.getByText('Corpus coverage')).toBeVisible();
  await expect(page.getByText('Adaptive progression')).toBeVisible();
  await expect(page.getByText('Promotion record')).toBeVisible();
  await expect(page.locator('.progress-metrics article')).toHaveCount(6);
});

test('Settings persists canonical preferences while guest Account stays network-lazy',async({page})=>{
  const accountRequests=[];
  page.on('request',request=>{
    const url=request.url();
    if(url.includes('supabase.co')||url.includes('cdn.jsdelivr.net/npm/@supabase'))accountRequests.push(url);
  });
  await page.goto('/#settings');
  await expect(page.getByRole('heading',{name:'Settings'})).toBeVisible();
  await expect(page.getByText('Guest · local progress only')).toBeVisible({timeout:20_000});
  await page.waitForTimeout(600);
  expect(accountRequests).toEqual([]);

  const input=page.locator('input[name="dailyNewLimit"]');
  await input.fill('17');
  await page.getByRole('button',{name:'Save study settings'}).click();
  await expect.poll(async()=>{
    const learner=await idbValue(page,'learner','state-v1');
    return learner?.settings?.dailyNewLimit;
  }).toBe(17);

  await expect(page.getByRole('button',{name:'Export backup'})).toBeVisible();
  await expect(page.locator('[data-import]')).toHaveCount(1);
});
