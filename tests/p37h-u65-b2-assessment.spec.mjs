import {test,expect} from '@playwright/test';

async function openStore(page,fn){
 return page.evaluate(async()=>new Promise((resolve,reject)=>{
  const request=indexedDB.open('thiepn-french-vnext',5);
  request.onerror=()=>reject(request.error);
  request.onsuccess=()=>{
   const db=request.result,tx=db.transaction(['learner','srs','activity'],'readwrite');
   const learner=tx.objectStore('learner').get('state-v1');
   const s=tx.objectStore('srs').count(),a=tx.objectStore('activity').count();
   let row=null;
   learner.onsuccess=()=>{row=learner.result};
   tx.oncomplete=()=>{db.close();resolve({
    learner:row,activity:a.result,srs:s.result
   });};
   tx.onerror=()=>reject(tx.error);
  };
 }));
}

test('U65 native two-task P31 receipt survives reload without French prose or SRS/FSRS mutation',async({page})=>{
 await page.goto('/#b2-assess');
 await expect(page.getByRole('heading',{name:'B2 Evidence Lab'})).toBeVisible({timeout:45000});
 const before=await openStore(page);
 await expect(page.getByRole('button',{name:'Begin P32 original-source capstone'})).toBeDisabled();
 await page.getByRole('button',{name:'Begin P31 two-task argument assessment'}).click();
 await expect(page.getByRole('heading',{name:'Organisation du travail'})).toBeVisible();
 await page.getByRole('textbox',{name:'Calibrated B2 French response'}).fill('Une phrase volontairement insuffisante qui ne démontre pas une argumentation complète.');
 await page.getByRole('checkbox').check();
 await page.getByRole('button',{name:'Submit independent task 1'}).click();
 await expect(page.getByText('Task 1 recorded in this tab only')).toBeVisible();
 await page.getByRole('button',{name:'Continue to task 2'}).click();
 await expect(page.getByRole('heading',{name:'Mobilité et équité'})).toBeVisible();
 const privateProse='UNIQUE_PRIVATE_TEST_DRAFT_NEVER_PERSIST_6894573';
 await page.getByRole('textbox',{name:'Calibrated B2 French response'}).fill(privateProse+' Une deuxième phrase trop courte.');
 await page.getByRole('checkbox').check();
 await page.getByRole('button',{name:'Submit independent task 2'}).click();
 await expect(page.getByRole('heading',{name:'Two-task structural report'})).toBeVisible({timeout:30000});
 await expect(page.getByText('Result: insufficient.',{exact:false})).toBeVisible();
 const after=await openStore(page);
 expect(after.activity).toBe(before.activity);expect(after.srs).toBe(before.srs);
 const evidence=after.learner.featureState.vU65B2StructuralEvidence;
 expect(evidence.schema).toBe('thiepn-french-u65-b2-evidence-v1');
 expect(evidence.history).toHaveLength(1);
 expect(evidence.history[0].tasks).toHaveLength(2);
 expect(evidence.history[0].status).toBe('insufficient');
 expect(JSON.stringify(evidence)).not.toContain(privateProse);
 expect(JSON.stringify(evidence)).not.toContain('Une phrase volontairement insuffisante');
 await page.reload();
 await expect(page.getByRole('heading',{name:'B2 Evidence Lab'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Begin P32 original-source capstone'})).toBeDisabled();
 await expect(page.getByText('1 private assessment receipts',{exact:false})).toBeVisible();
});

test('U65 never scores missing attestation or awards B2 original CEFR promotion',async({page})=>{
 await page.goto('/#b2-assess');
 await page.getByRole('button',{name:'Begin P31 two-task argument assessment'}).click();
 await page.getByRole('textbox',{name:'Calibrated B2 French response'}).fill('Cette phrase est insuffisante.');
 await page.getByRole('button',{name:'Submit independent task 1'}).click();
 await expect(page.getByText('unscored',{exact:false}).first()).toBeVisible();
 await page.getByRole('button',{name:'Continue to task 2'}).click();
 await page.getByRole('textbox',{name:'Calibrated B2 French response'}).fill('La seconde phrase ne garantit rien.');
 await page.getByRole('button',{name:'Submit independent task 2'}).click();
 await expect(page.getByText('Result: unscored.',{exact:false})).toBeVisible();
 const state=await openStore(page);
 expect(state.learner.promotions.B2?.earnedAt||0).toBe(0);
 expect(state.learner.featureState.vU65B2StructuralEvidence.history[0].status).toBe('unscored');
});

test('U65 genuine original-source P32 remains blocked when device French TTS is unavailable even with synthetic qualifying P31 fixture',async({page})=>{
 await page.addInitScript(()=>{
  Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:undefined});
 });
 await page.goto('/#b2-assess');
 await expect(page.getByRole('heading',{name:'B2 Evidence Lab'})).toBeVisible({timeout:45000});
 await page.evaluate(async()=>{
  await new Promise((resolve,reject)=>{
   const open=indexedDB.open('thiepn-french-vnext',5);
   open.onerror=()=>reject(open.error);
   open.onsuccess=()=>{
    const db=open.result,tx=db.transaction('learner','readwrite'),store=tx.objectStore('learner'),request=store.get('state-v1');
    request.onsuccess=()=>{
     const learner=request.result,now=Date.now();
     const task=(id)=>({taskId:id,modality:'argument',wordCount:160,sentenceCount:9,markerFamilies:['contrast','condition','example','conclusion'],score:89,confidence:91,topicGroups:3,directCopyPct:0,transformation:70,playCount:0,elapsedMs:160000,status:'structural-targets-met',reason:'Synthetic test evidence, not a real learner result.',evaluator:'u65-structural-v1'});
     const attempt={id:'synthetic-test-p31-only',kind:'p31',at:now,status:'structural-targets-met',evaluator:'u65-structural-v1',tasks:[task('fixture-one'),task('fixture-two')]};
     store.put({...learner,featureState:{...learner.featureState,vU65B2StructuralEvidence:{schema:'thiepn-french-u65-b2-evidence-v1',token:'fixture-unique-token',history:[attempt]}}},'state-v1');
    };
    tx.oncomplete=()=>{db.close();resolve()};
    tx.onerror=()=>reject(tx.error);
   };
  });
 });
 await page.reload();
 await expect(page.getByRole('button',{name:'Begin P32 original-source capstone'})).toBeDisabled();
 await expect(page.getByText(/P32 calibrated listening unavailable/)).toBeVisible();
 await expect(page.getByText(/Current structural thresholds met/)).toBeVisible();
});

test('U65 390px phone layout retains accessible two-task input and strict source boundaries',async({page})=>{
 await page.setViewportSize({width:390,height:840});
 await page.goto('/#b2');
 await page.getByRole('button',{name:'Open P31 / P32 independent B2 assessment'}).click();
 await expect(page).toHaveURL(/#b2-assess$/);
 await page.getByRole('button',{name:'Begin P31 two-task argument assessment'}).click();
 await expect(page.getByRole('checkbox')).toBeVisible();
 await page.getByRole('textbox',{name:'Calibrated B2 French response'}).fill('Un essai brouillon '.repeat(70));
 const widths=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
 expect(widths.scroll).toBeLessThanOrEqual(widths.viewport+2);
 await page.getByRole('button',{name:'Discard assessment without saving'}).click();
 await expect(page.getByRole('button',{name:'Begin P31 two-task argument assessment'})).toBeVisible();
 const state=await openStore(page);
 expect(state.learner.featureState?.vU65B2StructuralEvidence).toBeUndefined();
});
