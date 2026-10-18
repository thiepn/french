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

async function countPracticeEvents(page,practice){
  return page.evaluate(async practiceName=>new Promise((resolve,reject)=>{
    const request=indexedDB.open('thiepn-french-vnext');
    request.onerror=()=>reject(request.error);
    request.onsuccess=()=>{
      const db=request.result;let count=0;
      const tx=db.transaction('activity','readonly');
      const cursor=tx.objectStore('activity').openCursor();
      cursor.onsuccess=()=>{const row=cursor.result;if(!row)return;if(row.value?.practice===practiceName&&row.value?.practiceOnly===true)count++;row.continue();};
      cursor.onerror=()=>reject(cursor.error);
      tx.oncomplete=()=>{db.close();resolve(count);};
    };
  },practice));
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


test('Listen loads one small pack and saves practice-only evidence',async({page})=>{
  await page.goto('/#listen');
  await expect(page.getByRole('heading',{name:'Listen'})).toBeVisible();
  await expect(page.locator('.media-practice-card')).toBeVisible({timeout:30_000});
  const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(entry=>entry.name));
  expect(resources.some(url=>url.includes('/content/search/vocabulary-index.json'))).toBeFalsy();
  expect(resources.filter(url=>url.includes('/content/packs/')).length).toBeLessThanOrEqual(1);

  await page.getByRole('button',{name:'Reveal'}).click();
  await expect(page.locator('.media-feedback')).toBeVisible();
  await expect.poll(()=>countPracticeEvents(page,'listening')).toBe(1);
});

test('Speak initializes microphone recognition only after explicit action',async({page})=>{
  await page.addInitScript(()=>{
    window.__speechStarts=0;
    class FakeRecognition{
      constructor(){this.lang='';this.interimResults=false;this.continuous=false;this.maxAlternatives=1;this.onresult=null;this.onerror=null;this.onend=null;}
      start(){
        window.__speechStarts++;
        setTimeout(()=>{
          this.onresult?.({resultIndex:0,results:[{0:{transcript:'bonjour',confidence:.9},length:1,isFinal:true}]});
          this.onend?.();
        },0);
      }
      stop(){this.onend?.();}
      abort(){this.onend?.();}
    }
    window.SpeechRecognition=FakeRecognition;
    window.webkitSpeechRecognition=FakeRecognition;
  });
  await page.goto('/#speak');
  await expect(page.getByRole('heading',{name:'Speak'})).toBeVisible();
  await expect(page.locator('.media-practice-card')).toBeVisible({timeout:30_000});
  expect(await page.evaluate(()=>window.__speechStarts)).toBe(0);

  const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(entry=>entry.name));
  expect(resources.some(url=>url.includes('/content/search/vocabulary-index.json'))).toBeFalsy();
  expect(resources.filter(url=>url.includes('/content/packs/')).length).toBeLessThanOrEqual(1);

  await page.getByRole('button',{name:'Start microphone'}).click();
  await expect.poll(()=>page.evaluate(()=>window.__speechStarts)).toBe(1);
  await expect(page.locator('.media-feedback')).toBeVisible();
  await expect.poll(()=>countPracticeEvents(page,'speaking')).toBe(1);
});


test('offline runtime reloads the used shell and listening pack without network',async({page,context})=>{
  await page.goto('/#listen');
  await expect(page.locator('.media-practice-card')).toBeVisible({timeout:30_000});
  await page.evaluate(async()=>{
    if(!('serviceWorker' in navigator))throw new Error('Service workers unavailable.');
    await navigator.serviceWorker.ready;
  });
  await expect.poll(()=>page.evaluate(()=>Boolean(navigator.serviceWorker?.controller)),{timeout:15_000}).toBeTruthy();

  await context.setOffline(true);
  try{
    await page.reload({waitUntil:'domcontentloaded'});
    await expect(page.getByRole('heading',{name:'Listen'})).toBeVisible({timeout:15_000});
    await expect(page.locator('.media-practice-card')).toBeVisible({timeout:15_000});
  }finally{
    await context.setOffline(false);
  }
});


test('Progress renders canonical evidence without loading the corpus search index',async({page})=>{
  await page.goto('/#progress');
  await expect(page.getByRole('heading',{name:'Progress'})).toBeVisible();
  await expect(page.locator('.progress-metrics')).toBeVisible({timeout:30_000});
  await expect(page.locator('.progress-section').filter({hasText:'Memory state'})).toBeVisible();
  await expect(page.locator('.progress-section').filter({hasText:'Skill coverage'})).toBeVisible();

  const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(entry=>entry.name));
  expect(resources.some(url=>url.includes('/content/search/vocabulary-index.json'))).toBeFalsy();
  expect(resources.some(url=>url.includes('/content/packs/'))).toBeFalsy();
});

test('Settings persists canonical workload and session preferences',async({page})=>{
  await page.goto('/#settings');
  await expect(page.getByRole('heading',{name:'Settings'})).toBeVisible();
  const newLimit=page.locator('input[name="dailyNewLimit"]');
  const reviewLimit=page.locator('input[name="dailyReviewLimit"]');
  const mix=page.locator('select[name="mix"]');
  await expect(newLimit).toBeVisible({timeout:30_000});

  await newLimit.fill('13');
  await reviewLimit.fill('77');
  await mix.selectOption('interleave');
  await page.getByRole('button',{name:'Save settings'}).click();
  await expect(page.locator('[data-status]')).toHaveText('Settings saved.');

  await page.reload();
  await expect(newLimit).toHaveValue('13');
  await expect(reviewLimit).toHaveValue('77');
  await expect(mix).toHaveValue('interleave');
  await expect(page.getByText('THIEPN Account',{exact:true})).toBeVisible();
});
