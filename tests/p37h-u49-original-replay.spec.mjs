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

test('U49 source repair workbench opens original authored function and hint phrase options never auto-grade',async({page})=>{
 await page.goto('/#conversation');
 const workbench=page.locator('.source-practice-review');
 await expect(workbench.getByRole('heading',{name:'Next original-source practice'})).toBeVisible({timeout:45_000});
 const source=workbench.getByRole('button',{name:/Practise source function/}).first();
 await expect(source).toBeEnabled();
 await source.click();
 await expect(page.locator('.source-graph-deck')).toContainText('Original P35 deterministic source');
 await page.getByRole('button',{name:'Show source example'}).click();
 const authored=page.locator('.source-authored-options');
 await expect(authored).toContainText('Original P35 authored examples');
 const use=authored.getByRole('button',{name:/Use authored phrase/}).first();
 await expect(use).toBeVisible();
 const text=(await use.textContent()).replace('Use authored phrase · ','').trim();
 await use.click();
 await expect(page.getByRole('textbox',{name:'Reply to original source graph in French'})).toHaveValue(text);
 const before=await page.evaluate(()=>new Promise(resolve=>{
  const req=indexedDB.open('thiepn-french-vnext');
  req.onsuccess=()=>{const db=req.result,tx=db.transaction('meta','readonly'),q=tx.objectStore('meta').get('p35-source-graph-v1');
   tx.oncomplete=()=>{db.close();resolve(q.result);};};
 }));
 expect(before.active.support).toBe(2);
 expect(before.active.turns).toBe(0);
 await page.reload();
 await expect(page.locator('.source-authored-options')).toContainText('Original P35 authored examples');
});

test('U49 ambiguous original source reply is preserved for iterative independent repair',async({page})=>{
 await page.goto('/#conversation');
 await page.getByRole('button',{name:/A1 · Order at a café · original graph/}).click();
 const reply=page.getByRole('textbox',{name:'Reply to original source graph in French'});
 await reply.fill('Je voudrais visiter le musée demain');
 await page.getByRole('button',{name:'Check source rule'}).click();
 await expect(reply).toHaveValue('Je voudrais visiter le musée demain');
 await expect(page.locator('[role=status].conversation-feedback')).toContainText('did not confidently match');
 await page.getByRole('button',{name:'Ask for clarification'}).click();
 await expect(page.locator('.conversation-assistance')).toContainText('Source hint');
 await expect(reply).toHaveValue('Je voudrais visiter le musée demain');
 await expect(page.locator('.source-graph-deck')).toContainText('Original P35 deterministic source');
});

test('U49 explicit source writing draft returns in memory and cannot grant independent evidence',async({page})=>{
 await page.goto('/#conversation');
 await page.getByRole('button',{name:/A1 · Order at a café · original graph/}).click();
 const before=await page.evaluate(()=>new Promise(resolve=>{
  const req=indexedDB.open('thiepn-french-vnext');
  req.onsuccess=()=>{const db=req.result,tx=db.transaction(['srs','activity'],'readonly');
   const s=tx.objectStore('srs').count(),a=tx.objectStore('activity').count();
   tx.oncomplete=()=>{db.close();resolve([s.result,a.result]);};};
 }));
 await page.getByRole('button',{name:'Rehearse this reply in Write'}).click();
 await expect(page).toHaveURL(/#write$/);
 const panel=page.getByRole('region',{name:'Original P35 dialogue · draft your reply'});
 const original='Bonjour, je voudrais un café, s’il vous plaît.';
 await panel.getByRole('textbox',{name:'Draft reply to original dialogue'}).fill(original);
 await panel.getByRole('button',{name:'Use this draft in original conversation (supported)'}).click();
 await expect(page).toHaveURL(/#conversation$/);
 await expect(page.getByRole('textbox',{name:'Reply to original source graph in French'})).toHaveValue(original);
 await expect(page.locator('.conversation-assistance')).toContainText('Explicit Write draft restored');
 const stored=await page.evaluate(()=>new Promise(resolve=>{
  const req=indexedDB.open('thiepn-french-vnext');
  req.onsuccess=()=>{const db=req.result,tx=db.transaction(['meta','srs','activity'],'readonly');
   const m=tx.objectStore('meta').get('p35-source-graph-v1'),
    s=tx.objectStore('srs').count(),a=tx.objectStore('activity').count();
   tx.oncomplete=()=>{db.close();resolve({source:m.result,srs:s.result,activity:a.result});};};
 }));
 expect(stored.source.active.nodeId).toBe('order');
 expect(stored.source.active.support).toBe(2);
 expect(stored.source.active.turns).toBe(0);
 expect([stored.srs,stored.activity]).toEqual(before);
 expect(JSON.stringify(stored.source)).not.toContain(original);
 await page.getByRole('button',{name:'Check source rule'}).click();
 const after=await page.evaluate(()=>new Promise(resolve=>{
  const req=indexedDB.open('thiepn-french-vnext');
  req.onsuccess=()=>{const db=req.result,tx=db.transaction(['meta','srs','activity'],'readonly');
   const m=tx.objectStore('meta').get('p35-source-graph-v1'),
    s=tx.objectStore('srs').count(),a=tx.objectStore('activity').count();
   tx.oncomplete=()=>{db.close();resolve({source:m.result,srs:s.result,activity:a.result});};};
 }));
 expect(after.source.active.nodeId).toBe('size');
 expect(after.source.active.independent).toBe(0);
 expect([after.srs,after.activity]).toEqual(before);
 await page.reload();
 await expect(page.getByRole('textbox',{name:'Reply to original source graph in French'})).toHaveValue('');
});

test('U49 complete original partner Listen to supported Write to Conversation preserves source turn and private grade authority',async({page})=>{
 await page.goto('/#conversation');
 await page.getByRole('button',{name:/A1 · Order at a café · original graph/}).click();
 const before=await page.evaluate(()=>new Promise(resolve=>{
  const req=indexedDB.open('thiepn-french-vnext');
  req.onsuccess=()=>{const db=req.result,tx=db.transaction(['srs','activity'],'readonly');
   const s=tx.objectStore('srs').count(),a=tx.objectStore('activity').count();
   tx.oncomplete=()=>{db.close();resolve([s.result,a.result]);};};
 }));
 await page.getByRole('button',{name:'Listen to this original partner turn'}).click();
 await expect(page).toHaveURL(/#listen$/);
 const listen=page.getByRole('region',{name:'Original P35 dialogue · partner listening'});
 await listen.getByRole('textbox',{name:'Transcribe original partner'}).fill('Bonjour, qu’est-ce que vous prenez ?');
 await listen.getByRole('button',{name:'Check original transcription'}).click();
 await expect(listen.getByRole('status')).toContainText('Written-source only');
 await listen.getByRole('button',{name:'Continue original conversation in Write'}).click();
 await expect(page).toHaveURL(/#write$/);
 const write=page.getByRole('region',{name:'Original P35 dialogue · draft your reply'});
 await expect(write).toContainText('Order at a café');
 const draft='Bonjour, je voudrais un thé, s’il vous plaît.';
 await write.getByRole('textbox',{name:'Draft reply to original dialogue'}).fill(draft);
 await write.getByRole('button',{name:'Check original dialogue rule'}).click();
 await expect(write.getByRole('status')).toContainText('Original source pattern recognized');
 await write.getByRole('button',{name:'Use this draft in original conversation (supported)'}).click();
 await expect(page).toHaveURL(/#conversation$/);
 await expect(page.getByRole('textbox',{name:'Reply to original source graph in French'})).toHaveValue(draft);
 await expect(page.locator('.conversation-assistance')).toContainText('Model support remains active');
 const current=await page.evaluate(()=>new Promise(resolve=>{
  const req=indexedDB.open('thiepn-french-vnext');
  req.onsuccess=()=>{const db=req.result,tx=db.transaction(['meta','srs','activity'],'readonly');
   const m=tx.objectStore('meta').get('p35-source-graph-v1'),
    s=tx.objectStore('srs').count(),a=tx.objectStore('activity').count();
   tx.oncomplete=()=>{db.close();resolve({source:m.result,srs:s.result,activity:a.result});};};
 }));
 expect(current.source.active.nodeId).toBe('order');
 expect(current.source.active.support).toBe(2);
 expect(current.source.active.independent).toBe(0);
 expect([current.srs,current.activity]).toEqual(before);
 expect(JSON.stringify(current.source)).not.toContain(draft);
});
