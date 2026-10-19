import {test,expect} from '@playwright/test';

test('U63 Learn gives original lessons, scheduled recall and other skills distinct entry points',async({page})=>{
  await page.goto('/#learn');
  await expect(page.getByRole('heading',{name:'Learn French'})).toBeVisible({timeout:45_000});
  await expect(page.getByRole('heading',{name:'Original French Course'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Vocabulary and Review'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Start or continue a lesson'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Study today'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Learn new words'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Open Review'})).toBeVisible();
  for(const label of ['Read','Listen','Speak','Conversation','Write','Grammar'])
    await expect(page.locator('.learn-skill-grid').getByRole('button',{name:new RegExp('^'+label)})).toBeVisible();
  await page.getByRole('button',{name:'Start or continue a lesson'}).click();
  await expect(page).toHaveURL(/#course$/);
  await expect(page.getByRole('heading',{name:'Course',exact:true})).toBeVisible();
  await page.goto('/#learn');
  await page.locator('.learn-skill-grid').getByRole('button',{name:/^Listen/}).click();
  await expect(page).toHaveURL(/#listen$/);
  await expect(page.getByRole('button',{name:'Play audio'})).toBeVisible({timeout:45_000});
});

test('U63 offline manifest failure still offers source teaching and independent practice',async({page})=>{
  await page.addInitScript(()=>{
    const originalFetch=window.fetch.bind(window);
    window.fetch=(input,init)=>{
      if(new URL(typeof input==='string'?input:input instanceof Request?input.url:String(input),location.href).pathname==='/content/manifest.json')
        return Promise.reject(new Error('Synthetic content-network failure'));
      return originalFetch(input,init);
    };
    // Simulate a fresh device whose verified manifest was evicted. This only
    // affects page CacheStorage; the installed service worker is untouched.
    Object.defineProperty(window,'caches',{configurable:true,value:undefined});
  });
  await page.goto('/#learn');
  await expect(page.getByRole('heading',{name:'Learn French'})).toBeVisible({timeout:45_000});
  await expect(page.locator('[data-corpus]')).toContainText('Vocabulary content is unavailable');
  await expect(page.getByRole('button',{name:'Study today'})).toBeDisabled();
  await expect(page.getByRole('button',{name:'Learn new words'})).toBeDisabled();
  await expect(page.getByRole('button',{name:'Start or continue a lesson'})).toBeEnabled();
  await expect(page.locator('.learn-skill-grid').getByRole('button',{name:/^Conversation/})).toBeEnabled();
  await page.getByRole('button',{name:'Start or continue a lesson'}).click();
  await expect(page).toHaveURL(/#course$/);
  await expect(page.getByRole('heading',{name:'Course',exact:true})).toBeVisible();
  await page.goto('/#learn');
  await page.getByRole('button',{name:'Open Review'}).click();
  await expect(page).toHaveURL(/#review$/);
});
