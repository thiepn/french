import {test,expect} from '@playwright/test';

test('French primary navigation is four stable destinations, and original tools remain reachable',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/#home');
 const nav=page.getByRole('navigation',{name:'Main navigation'});
 await expect(nav.locator('button')).toHaveCount(4);
 for(const name of ['Home','Course','Review','Me'])await expect(nav.getByRole('button',{name,exact:true})).toBeVisible();
 const width=await page.evaluate(()=>({document:document.documentElement.scrollWidth,viewport:innerWidth,nav:document.querySelector('.primary-nav')?.scrollWidth}));
 expect(width.document).toBeLessThanOrEqual(width.viewport+2);
 expect(width.nav).toBeLessThanOrEqual(width.viewport+2);
 await page.getByLabel('Open additional French learning tools').click();
 await page.getByRole('button',{name:'Reading',exact:true}).click();
 await expect(page).toHaveURL(/#read$/);
 await expect(nav.getByRole('button',{name:'Course'})).toHaveAttribute('aria-current','page');
 await page.getByLabel('Open additional French learning tools').click();
 await page.getByRole('button',{name:'Progress',exact:true}).click();
 await expect(page).toHaveURL(/#progress$/);
 await expect(nav.getByRole('button',{name:'Me',exact:true})).toHaveAttribute('aria-current','page');
});

test('One tap on an original level from Home opens its real lesson, without intro-redirects',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/#home');
 await expect(page.getByRole('button',{name:'Start A2 course'})).toBeVisible({timeout:45000});
 await page.getByRole('button',{name:'Start A2 course'}).click();
 await expect(page).toHaveURL(/#course$/);
 await expect(page.getByRole('heading',{name:'Course',exact:true})).toBeVisible();
 await expect(page.locator('.u6-lesson-content .u6-unit-header h3')).toBeVisible({timeout:45000});
 await expect(page.locator('.course-level-choice.is-selected')).toContainText('A2');
 await expect(page.locator('[data-u6-stage="understand"]')).toBeVisible();
 await expect(page.locator('.u6-stage-footer button.primary-action')).toBeVisible();
 const size=await page.evaluate(()=>{
   const target=document.querySelector('.u6-stage-footer')?.getBoundingClientRect();
   const bottomNav=document.querySelector('.primary-nav')?.getBoundingClientRect();
   return {docWidth:document.documentElement.scrollWidth,screenWidth:innerWidth,
    footerTop:target?.top,footerBottom:target?.bottom,
    navTop:bottomNav?.top,bodyScrollHeight:document.body.scrollHeight,height:innerHeight,
    scrollViewport:document.querySelector('.u6-stage-body')?.clientHeight};
 });
 expect(size.docWidth).toBeLessThanOrEqual(size.screenWidth+2);
 expect(size.footerBottom).toBeLessThanOrEqual(size.navTop+2);
 expect(size.footerTop).toBeGreaterThan(0);
 expect(size.scrollViewport).toBeGreaterThan(100);
 expect(size.bodyScrollHeight).toBeLessThanOrEqual(size.height+3);
});

test('Original lesson stays on one screen with fixed Next and six reversible original source stages',async({page})=>{
 await page.setViewportSize({width:360,height:720});
 await page.goto('/#course');
 await expect(page.locator('.u6-stage-footer .primary-action')).toBeVisible({timeout:45000});
 const initial=await page.locator('.u6-unit-header h3').textContent();
 await page.locator('.u6-stage-footer .primary-action').click();
 await expect(page.locator('[data-u6-stage="words"]')).toBeVisible();
 await expect(page).toHaveURL(/#course$/);
 await expect(page.locator('.u6-unit-header h3')).toHaveText(initial);
 const footer=page.locator('.u6-stage-footer');
 await expect(footer.getByRole('button',{name:/3\. Read/})).toBeVisible();
 await footer.getByRole('button',{name:/3\. Read/}).click();
 await expect(page.locator('[data-u6-stage="dialogue"]')).toBeVisible();
 await expect(page).toHaveURL(/#course$/);
 const measurements=await page.evaluate(()=>{
  const main=document.querySelector('.route-host');
  const body=document.querySelector('.u6-stage-body');
  const dock=document.querySelector('.u6-stage-footer')?.getBoundingClientRect();
  const nav=document.querySelector('.primary-nav')?.getBoundingClientRect();
  return {mainHeight:main?.clientHeight,bodyHeight:body?.clientHeight,bodyScroll:body?.scrollHeight,
   dockBottom:dock?.bottom,navTop:nav?.top,documentWidth:document.documentElement.scrollWidth,width:innerWidth};
 });
 expect(measurements.bodyHeight).toBeGreaterThan(100);
 expect(measurements.dockBottom).toBeLessThanOrEqual(measurements.navTop+2);
 expect(measurements.documentWidth).toBeLessThanOrEqual(measurements.width+2);
});

test('Original checkpoint resumes automatically after reload; advanced source features are still available',async({page})=>{
 await page.goto('/#course');
 await expect(page.locator('.u6-stage-footer .primary-action')).toBeVisible({timeout:45000});
 await page.locator('.u6-stage-footer .primary-action').click();
 await expect(page.locator('[data-u6-stage="words"]')).toBeVisible();
 await expect.poll(async()=>page.evaluate(async()=>new Promise(resolve=>{
  const req=indexedDB.open('thiepn-french-vnext',5);
  req.onerror=()=>resolve('');
  req.onsuccess=()=>{
   const db=req.result,tx=db.transaction('learner','readonly');
   const result=tx.objectStore('learner').get('state-v1');
   result.onsuccess=()=>{const raw=result.result?.featureState?.vU24OriginalCourse;
    resolve(raw?.schema==='original-course-checkpoint-v1'?raw.stage:'')};
   tx.oncomplete=()=>db.close();
   tx.onerror=()=>resolve('');
  };
 }))).toBe('words');
 await page.reload();
 await expect(page.locator('[data-u6-stage="words"]')).toBeVisible({timeout:45000});
 await expect(page.locator('.course-lesson-picker select')).toHaveValue('a1-01');
 const tools=page.locator('.course-extra-tools');
 await tools.locator(':scope > summary').click();
 await expect(tools.getByRole('heading',{name:'Choose where to learn'})).toBeVisible();
 await expect(page.getByRole('navigation',{name:'Main navigation'}).locator('button')).toHaveCount(4);
});
