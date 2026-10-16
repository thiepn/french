import {test,expect} from '@playwright/test';

test('U49 original source graph replay rotates authored partner variant and preserves private grade authority',async({page})=>{
 await page.goto('/#conversation');
 await expect(page.getByRole('heading',{name:'Conversation',exact:true})).toBeVisible({timeout:45_000});
 await page.evaluate(async()=>{
  await new Promise((resolve,reject)=>{
   const req=indexedDB.open('thiepn-french-vnext');
   req.onerror=()=>reject(req.error);
   req.onsuccess=()=>{
    const db=req.result,tx=db.transaction('meta','readwrite');
    tx.objectStore('meta').put({
      schema:'thiepn-french-p35-source-graph-v1',active:null,mission:null,maxLevel:'A1',
      history:[{id:'source:fixture',scenarioId:'cafe-order',at:1700000000000,variant:0,
        turns:3,independent:2,assisted:1,repairs:0,manual:0,meanCredit:.6,complete:true}],
      evidence:[]
    },'p35-source-graph-v1');
    tx.oncomplete=()=>{db.close();resolve();};
    tx.onerror=()=>{db.close();reject(tx.error);};
   };
  });
 });
 await page.reload();
 const replay=page.getByRole('button',{name:'Replay recent original dialogue · next partner wording'});
 await expect(replay).toBeVisible({timeout:45_000});
 await replay.click();
 await expect(page.locator('.source-graph-deck')).toContainText('wording variant 2/3');
 await expect(page.locator('.source-graph-deck')).toContainText('0/3 original source objectives evidenced');
 await page.reload();
 await expect(page.locator('.source-graph-deck')).toContainText('wording variant 2/3',{timeout:45_000});
 await page.getByRole('button',{name:'Pause original graph & home'}).click();
 await expect(page.getByRole('button',{name:'Resume original dialogue'})).toBeVisible();
 await page.getByRole('button',{name:'Resume original dialogue'}).click();
 await expect(page.locator('.source-graph-deck')).toContainText('wording variant 2/3');
});

test('U49 original P20 function practice opens a pinned source graph and never upgrades CEFR',async({page})=>{
 await page.goto('/#conversation');
 await expect(page.getByRole('heading',{name:'Conversation',exact:true})).toBeVisible({timeout:45_000});
 const original=page.locator('.conversation-source-parity');
 await original.locator('summary').click();
 const button=original.getByRole('button',{name:/Practise original Request in/}).first();
 await expect(button).toBeEnabled();
 await button.click();
 await expect(page.locator('.source-graph-deck')).toContainText('Original P35 deterministic source',{timeout:30_000});
 await expect(page.locator('.source-graph-deck')).toContainText('No automatic SRS, CEFR or true oral fluency award');
 await page.reload();
 await expect(page.locator('.source-graph-deck')).toContainText('Original P35 deterministic source');
});
