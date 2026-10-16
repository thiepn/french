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

test('U49 source-owned writing rehearsal saves support before route change and never writes a grade',async({page})=>{
 await page.goto('/#conversation');
 const start=page.getByRole('button',{name:/A1 · Order at a café · original graph/});
 await expect(start).toBeEnabled({timeout:45_000});
 await start.click();
 await expect(page.locator('.source-graph-deck')).toContainText('Original P35 deterministic source');
 const counts=await page.evaluate(()=>new Promise(resolve=>{
  const r=indexedDB.open('thiepn-french-vnext');
  r.onsuccess=()=>{const db=r.result,tx=db.transaction(['srs','activity'],'readonly');
   const s=tx.objectStore('srs').count(),a=tx.objectStore('activity').count();
   tx.oncomplete=()=>{db.close();resolve([s.result,a.result]);};};
 }));
 await page.getByRole('button',{name:'Rehearse this reply in Write'}).click();
 await expect(page).toHaveURL(/#write$/,{timeout:45_000});
 const panel=page.getByRole('region',{name:'Original P35 dialogue · draft your reply'});
 await expect(panel).toContainText('Order at a café');
 await panel.getByRole('textbox',{name:'Draft reply to original dialogue'}).fill('Bonjour, je voudrais un café, s’il vous plaît.');
 await panel.getByRole('button',{name:'Check original dialogue rule'}).click();
 await expect(panel.getByRole('status')).toContainText('Original source pattern recognized');
 await panel.getByRole('button',{name:'Return to original conversation'}).click();
 await expect(page).toHaveURL(/#conversation$/);
 await expect(page.locator('.source-graph-deck')).toContainText('wording variant 1/3');
 const state=await page.evaluate(()=>new Promise(resolve=>{
  const r=indexedDB.open('thiepn-french-vnext');
  r.onsuccess=()=>{const db=r.result,tx=db.transaction(['meta','srs','activity'],'readonly');
   const m=tx.objectStore('meta').get('p35-source-graph-v1'),s=tx.objectStore('srs').count(),a=tx.objectStore('activity').count();
   tx.oncomplete=()=>{db.close();resolve({source:m.result,srs:s.result,activity:a.result});};};
 }));
 expect(state.source.active.nodeId).toBe('order');
 expect(state.source.active.support).toBe(2);
 expect(state.source.active.turns).toBe(0);
 expect([state.srs,state.activity]).toEqual(counts);
});

test('U49 original source partner listening allows audio-independent transcript review without grades',async({page})=>{
 await page.goto('/#conversation');
 await page.getByRole('button',{name:/A1 · Order at a café · original graph/}).click();
 await page.getByRole('button',{name:'Listen to this original partner turn'}).click();
 await expect(page).toHaveURL(/#listen$/,{timeout:45_000});
 const panel=page.getByRole('region',{name:'Original P35 dialogue · partner listening'});
 await expect(panel).toContainText('Order at a café');
 await panel.getByRole('textbox',{name:'Transcribe original partner'}).fill('Bonjour, qu’est-ce que vous prenez ?');
 await panel.getByRole('button',{name:'Reveal transcript'}).click();
 await expect(panel).toContainText('Bonjour, qu’est-ce que vous prenez ?');
 await panel.getByRole('button',{name:'Check original transcription'}).click();
 await expect(panel.getByRole('status')).toContainText('Written-source only');
 await panel.getByRole('button',{name:'Return to original conversation'}).click();
 await expect(page).toHaveURL(/#conversation$/);
 const state=await page.evaluate(()=>new Promise(resolve=>{
  const r=indexedDB.open('thiepn-french-vnext');
  r.onsuccess=()=>{const db=r.result,tx=db.transaction('meta','readonly'),q=tx.objectStore('meta').get('p35-source-graph-v1');
   tx.oncomplete=()=>{db.close();resolve(q.result);};};
 }));
 expect(state.active.nodeId).toBe('order');
 expect(state.active.support).toBe(1);
 expect(state.active.turns).toBe(0);
});

test('U49 source mission checkpoint names its three source stages and focused rehearsal keeps mission authority intact',async({page})=>{
 await page.goto('/#conversation');
 const focus=page.getByRole('button',{name:/Rehearse mission task · Buy something at a bakery/});
 await expect(focus).toBeEnabled({timeout:45_000});
 await focus.click();
 await expect(page.locator('.source-graph-deck')).toContainText('Buy something at a bakery');
 await expect(page.locator('.conversation-mission-banner')).toHaveCount(0);
 page.once('dialog',dialog=>dialog.accept());
 await page.getByRole('button',{name:'End original graph (ungraded)'}).click();
 // Confirm UI depends on the source active record clearing before starting a full mission.
 await expect(page.getByRole('button',{name:'Morning in town · 3 original source graphs'})).toBeEnabled();
 await page.getByRole('button',{name:'Morning in town · 3 original source graphs'}).click();
 await expect(page.locator('.source-mission-steps li')).toHaveCount(3);
 await expect(page.locator('.source-mission-steps')).toContainText('Buy something at a bakery · Current task');
 await expect(page.locator('.source-mission-steps')).toContainText('Order at a café · Upcoming');
 await expect(page.locator('.source-mission-steps')).toContainText('Ask about opening hours · Upcoming');
 await page.reload();
 await expect(page.locator('.source-mission-steps li')).toHaveCount(3);
});

test('U49 completed original P18 mission summaries survive reload and can replay the original three stages',async({page})=>{
 await page.goto('/#conversation');
 await expect(page.getByRole('heading',{name:'Conversation',exact:true})).toBeVisible({timeout:45_000});
 await page.evaluate(async()=>{
  const ids=['bakery-buy','cafe-order','opening-hours'];
  const stages=ids.map((scenarioId,i)=>({id:'p35-stage-'+i,scenarioId,at:1700000000000+i,
   variant:0,turns:3,independent:1,assisted:2,repairs:0,manual:2,meanCredit:.1,complete:true}));
  await new Promise((resolve,reject)=>{
   const req=indexedDB.open('thiepn-french-vnext');
   req.onerror=()=>reject(req.error);
   req.onsuccess=()=>{const db=req.result,tx=db.transaction('meta','readwrite');
    tx.objectStore('meta').put({schema:'thiepn-french-p35-source-graph-v1',
      active:null,mission:null,maxLevel:'A1',history:stages,evidence:[],
      missionHistory:[{id:'p35-source-mission-1',missionId:'daily-errands',at:1700000000003,
        stages,practiceOnly:true}]},'p35-source-graph-v1');
    tx.oncomplete=()=>{db.close();resolve();};
    tx.onerror=()=>{db.close();reject(tx.error);};
   };
  });
 });
 await page.reload();
 await expect(page.locator('.source-mission-history')).toContainText('Morning in town',{timeout:45_000});
 await expect(page.locator('.source-mission-history')).toContainText('3/3 source objectives observed');
 await page.getByRole('button',{name:'Replay original mission · Morning in town'}).click();
 await expect(page.locator('.source-mission-steps li')).toHaveCount(3);
 await expect(page.locator('.source-graph-deck')).toContainText('Buy something at a bakery');
 await page.reload();
 await expect(page.locator('.source-mission-steps li')).toHaveCount(3);
});
