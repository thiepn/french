import {test,expect} from '@playwright/test';
// R7: new evidence on isolated browser contexts. No real profiles, Account, or production.
// Native 200% zoom, mobile soft keyboard and assistive technology are HUMAN_PENDING.
async function openA1(page){
 await page.goto('/#course/A1/a1-01');
 await expect(page.locator('[data-u6-stage="understand"]')).toBeVisible({timeout:45_000});
}
for(const [width,height] of [[320,568],[360,720],[390,844],[568,320]]){
 test('R7 real Chromium lesson geometry '+width+'x'+height,async({page})=>{
  await page.setViewportSize({width,height});
  await openA1(page);
  const m=await page.evaluate(()=>{
   const rect=selector=>document.querySelector(selector)?.getBoundingClientRect();
   return {width:innerWidth,doc:document.documentElement.scrollWidth,
    footer:rect('.u6-stage-footer')?.bottom,nav:rect('.primary-nav')?.top,
    content:document.querySelector('.u6-stage-body')?.clientHeight,
    stageHeight:rect('.u6-stage-nav')?.height};
  });
  expect(m.doc).toBeLessThanOrEqual(m.width+2);
  if(height<=400){
   // A short landscape viewport cannot show the full six-stage lesson on one
   // screen. Require genuine scrolling to make the footer fully reachable
   // ABOVE the fixed application navigation, never underneath it.
   const host=page.locator('.route-host.course-host');
   await expect(host).toHaveCSS('overflow-y','auto');
   await host.evaluate(el=>{el.scrollTop=el.scrollHeight;});
   const after=await page.evaluate(()=>({
    footer:document.querySelector('.u6-stage-footer')?.getBoundingClientRect().bottom,
    nav:document.querySelector('.primary-nav')?.getBoundingClientRect().top,
    scroll:document.querySelector('.route-host.course-host')?.scrollTop
   }));
   expect(after.scroll).toBeGreaterThan(0);
   expect(after.footer).toBeLessThanOrEqual(after.nav+2);
  }else expect(m.footer).toBeLessThanOrEqual(m.nav+2);
  expect(m.content).toBeGreaterThan(55);
  expect(m.stageHeight).toBeLessThanOrEqual(65);
  await expect(page.locator('.u6-stage-footer .primary-action')).toBeVisible();
 });
}
test('R7 200% CSS zoom proxy at 320x568 — not native browser zoom sign-off',async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await openA1(page);
 await page.evaluate(()=>{document.documentElement.style.zoom='200%';});
 const m=await page.evaluate(()=>({
  doc:document.documentElement.scrollWidth,width:innerWidth,
  footer:document.querySelector('.u6-stage-footer')?.getBoundingClientRect().bottom,
  nav:document.querySelector('.primary-nav')?.getBoundingClientRect().top
 }));
 expect(m.doc).toBeLessThanOrEqual(m.width+2);
 expect(m.footer).toBeLessThanOrEqual(m.nav+2);
});
test('R7 native modal: labelled, backdrop/inert, Tab trap, Escape/close and return focus',async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await openA1(page);
 const trigger=page.getByRole('button',{name:'All lessons'});
 await trigger.focus();
 await page.keyboard.press('Enter');
 const dialog=page.getByRole('dialog',{name:'Browse original French lessons'});
 await expect(dialog).toBeVisible();
 expect(await dialog.evaluate(el=>el.matches(':modal'))).toBe(true);
 expect(await dialog.evaluate(el=>el.contains(document.activeElement))).toBe(true);
 for(let i=0;i<14;i++){
  await page.keyboard.press('Tab');
  expect(await dialog.evaluate(el=>el.contains(document.activeElement))).toBe(true);
 }
 await page.keyboard.press('Escape');
 await expect(dialog).toBeHidden();
 await expect(trigger).toBeFocused();
 await trigger.click();
 await dialog.getByRole('button',{name:'Close lesson browser'}).click();
 await expect(dialog).toBeHidden();
 await expect(trigger).toBeFocused();
});
test('R7 six real stages remain keyboard reachable and readable at 320px',async({page})=>{
 await page.setViewportSize({width:320,height:568});
 await openA1(page);
 const nav=page.locator('.u6-stage-nav');
 await expect(nav.getByRole('button')).toHaveCount(6);
 const measurements=await nav.evaluate(el=>({
  scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,
  sizes:[...el.querySelectorAll('button')].map(b=>({width:b.getBoundingClientRect().width,height:b.getBoundingClientRect().height,font:parseFloat(getComputedStyle(b).fontSize)}))
 }));
 expect(measurements.sizes.every(b=>b.height>=44&&b.font>=13)).toBe(true);
 expect(measurements.scrollWidth).toBeGreaterThan(measurements.clientWidth);
 await nav.getByRole('button',{name:'2. Vocabulary',exact:true}).click();
 await expect(page.locator('[data-u6-stage="words"]')).toBeVisible();
});
test('R7 cancelled unsent writing navigation retains private draft',async({page})=>{
 await openA1(page);
 await page.locator('.u6-stage-nav .u6-stage-button').last().click();
 await expect(page.locator('[data-u6-stage="write"]')).toBeVisible();
 const field=page.locator('.u6-stage-body textarea').first();
 await field.fill('Une note privée non envoyée');
 page.once('dialog',d=>d.dismiss());
 await page.locator('.u6-stage-nav .u6-stage-button').first().click();
 await expect(page.locator('[data-u6-stage="write"]')).toBeVisible();
 await expect(field).toHaveValue('Une note privée non envoyée');
});
test('R7 hash history returns from course to Home and forward to lesson',async({page})=>{
 await page.goto('/#home');
 await expect(page.locator('.route-host h1')).toHaveText('Continue French',{timeout:45_000});
 await page.evaluate(()=>{location.hash='#course/A1/a1-01';});
 await expect(page.locator('.u6-unit-header h3')).toBeVisible({timeout:45_000});
 await page.goBack();
 await expect(page.locator('.route-host h1')).toHaveText('Continue French',{timeout:45_000});
 await page.goForward();
 await expect(page.locator('.u6-unit-header h3')).toBeVisible({timeout:45_000});
 await expect(page).toHaveURL(/#course\/A1\/a1-01$/);
});
test.describe('R7 missing asynchronous route asset',()=>{
 test.use({serviceWorkers:'block'});
 test('original Learn module failure is honest and offers full reload retry',async({page})=>{
  await page.goto('/#home');
  await expect(page.locator('.route-host h1')).toHaveText('Continue French',{timeout:45_000});
  const failingAsset=/\/assets\/learn-[^/]+\.js/;
  await page.route(failingAsset,route=>route.abort('failed'));
  await page.evaluate(()=>{location.hash='#learn';});
  const error=page.locator('.route-error');
  await expect(error.getByRole('heading',{name:'Could not open this section'})).toBeVisible({timeout:15_000});
  const retry=error.getByRole('button',{name:'Retry this section'});
  await expect(retry).toBeVisible();
  await page.unroute(failingAsset);
  await retry.click();
  await expect(page.locator('.route-host h1')).toHaveText('Learn French',{timeout:30_000});
 });
});