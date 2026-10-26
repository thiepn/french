import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.goto('http://127.0.0.1:4173/#course/C2',{waitUntil:'domcontentloaded'});
 await page.locator('.course-level-choices [data-course-level="C2"]').waitFor({timeout:30000});
 assert.match(page.url(),/#course\/C2$/);
 assert.match(await page.locator('.u6-lesson-content').innerText(),/C2 curriculum planned/);
 await page.goto('http://127.0.0.1:4173/#course/B1',{waitUntil:'domcontentloaded'});
 await page.locator('.course-level-choices [data-course-level="B1"]').waitFor({timeout:30000});
 assert.equal(await page.locator('.course-level-choice').count(),6);
 await page.locator('.course-level-choices [data-course-level="B2"]').click();
 await page.locator('.cur02-level-lesson-list button').first().waitFor();
 assert.match(page.url(),/#course\/B2\//);
 assert.match(await page.locator('.cur02-level-lesson-list').innerText(),/Early B2 only/);
 await page.locator('.course-level-choices [data-course-level="C2"]').click();
 assert.match(await page.locator('.u6-lesson-content').innerText(),/C2 curriculum planned/);
 assert.equal(await page.locator('.cur02-level-lesson-list button').count(),0);
 await page.locator('.course-level-choices [data-course-level="A1"]').click();
 await page.locator('.cur02-level-lesson-list button').first().click();
 assert.match(page.url(),/#course\/A1\//);
 // A different deep-linked unit starts at its own understanding section;
 // never inherit a saved lesson's later-stage checkpoint.
 await page.goto('http://127.0.0.1:4173/#course/B1/b1-01',{waitUntil:'domcontentloaded'});
 await page.locator('.u6-unit-header h3').waitFor({timeout:30000});
 assert.match(page.url(),/#course\/B1\/b1-01/);
 const title=await page.locator('.u6-unit-header h3').innerText();
 assert.ok(title.length>2);
 console.log('French CUR-02 Chromium mobile course navigation PASS');
}finally{await browser.close()}
