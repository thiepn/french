import {test,expect} from '@playwright/test';

async function readStorage(page){
 return page.evaluate(async()=>new Promise((resolve,reject)=>{
  const open=indexedDB.open('thiepn-french-vnext',5);
  open.onerror=()=>reject(open.error);
  open.onsuccess=()=>{
   const db=open.result,tx=db.transaction(['learner','srs','activity'],'readonly');
   const lr=tx.objectStore('learner').get('state-v1');
   const sr=tx.objectStore('srs').count(),ar=tx.objectStore('activity').count();
   tx.oncomplete=()=>{db.close();resolve({learner:lr.result,srs:sr.result,activity:ar.result})};
   tx.onerror=()=>reject(tx.error);
  };
 }));
}
async function seedP31(page){
 await page.evaluate(async()=>new Promise((resolve,reject)=>{
  const open=indexedDB.open('thiepn-french-vnext',5);
  open.onerror=()=>reject(open.error);
  open.onsuccess=()=>{
   const db=open.result,tx=db.transaction('learner','readwrite'),store=tx.objectStore('learner');
   const get=store.get('state-v1');
   get.onsuccess=()=>{
    const row=get.result,at=Date.now();
    const receipt=id=>({taskId:id,modality:'argument',wordCount:155,sentenceCount:8,
      markerFamilies:['contrast','example','conclusion'],score:91,confidence:91,topicGroups:3,
      directCopyPct:0,transformation:75,playCount:0,elapsedMs:128000,
      status:'structural-targets-met',reason:'Synthetic browser test fixture, not learner evidence.',
      evaluator:'u65-structural-v1'});
    store.put({...row,featureState:{...row.featureState,
      vU65B2StructuralEvidence:{
       schema:'thiepn-french-u65-b2-evidence-v1',token:'u66-test-p31-unique-token',
       history:[{id:'synthetic-p31-browser',kind:'p31',at,status:'structural-targets-met',
        evaluator:'u65-structural-v1',tasks:[receipt('fixture-task-1'),receipt('fixture-task-2')]}]
      }
    }},'state-v1');
   };
   tx.oncomplete=()=>{db.close();resolve()};
   tx.onerror=()=>reject(tx.error);
  };
 }));
}

test('U66 P32 original P35 keyed reading and completed synthetic listening create revision-bound private two-task receipts',async({page})=>{
 await page.addInitScript(()=>{
  class SyntheticUtterance{
   constructor(text){this.text=text;this.lang='';this.rate=1}
  }
  Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:SyntheticUtterance});
  Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{
   speak(u){queueMicrotask(()=>{u.onstart?.();queueMicrotask(()=>u.onend?.());});},
   cancel(){},getVoices(){return[]}
  }});
 });
 await page.goto('/#b2-assess');
 await expect(page.getByRole('button',{name:'Begin P31 two-task argument assessment'})).toBeVisible({timeout:45000});
 await seedP31(page);
 await page.reload();
 await expect(page.getByRole('button',{name:'Begin P32 original-source capstone'})).toBeEnabled({timeout:45000});
 const before=await readStorage(page);
 await page.getByRole('button',{name:'Begin P32 original-source capstone'}).click();
 await expect(page.getByRole('heading',{name:/B2/})).toBeVisible();
 await expect(page.getByText(/P35 .* · SHA [a-f0-9]{12}/)).toBeVisible();
 await expect(page.getByRole('group',{name:/Original P35 source question/})).toBeVisible();
 await page.getByRole('radio').nth(1).check(); // Original P35 read-b2-teletravail q1 answer index 1.
 const readingProse='PRIVATE_U66_READING_ANSWER_DO_NOT_SAVE '+
  ('Je recommande une politique qui considère les conditions, les collègues et la direction. ').repeat(15);
 await page.getByRole('textbox',{name:'Calibrated B2 French response'}).fill(readingProse);
 await page.getByRole('checkbox').check();
 await page.getByRole('button',{name:'Submit independent task 1'}).click();
 await expect(page.getByRole('heading',{name:'Task 1 recorded in this tab only'})).toBeVisible();
 await page.getByRole('button',{name:'Continue to task 2'}).click();
 await expect(page.getByText('No complete French playback yet.')).toBeVisible();
 await page.getByRole('button',{name:'Play original French (maximum two)'}).click();
 await expect(page.getByText(/Device reported playback completion/)).toBeVisible();
 await page.getByRole('radio').nth(1).check(); // Original P35 read-b2-logement q2 answer index 1.
 const listeningProse='PRIVATE_U66_LISTENING_ANSWER_DO_NOT_SAVE '+
  ('Cependant, la ville doit examiner les priorités, le quartier, les habitants et le compromis. ').repeat(13);
 await page.getByRole('textbox',{name:'Calibrated B2 French response'}).fill(listeningProse);
 await page.getByRole('checkbox').check();
 await page.getByRole('button',{name:'Submit independent task 2'}).click();
 await expect(page.getByRole('heading',{name:'Two-task structural report'})).toBeVisible({timeout:30000});
 const after=await readStorage(page);
 expect(after.srs).toBe(before.srs);
 expect(after.activity).toBe(before.activity);
 const saved=after.learner.featureState.vU65B2StructuralEvidence;
 expect(saved.history).toHaveLength(2);
 const last=saved.history[1];
 expect(last.kind).toBe('p32');
 expect(last.tasks.map(t=>t.sourceId)).toEqual(['read-b2-teletravail','read-b2-logement']);
 expect(last.tasks.map(t=>t.questionId)).toEqual(['q1','q2']);
 expect(last.tasks.map(t=>t.comprehensionCorrect)).toEqual([true,true]);
 expect(last.tasks.map(t=>t.sourceDigest)).toEqual([expect.stringMatching(/^[a-f0-9]{64}$/),expect.stringMatching(/^[a-f0-9]{64}$/)]);
 expect(last.tasks[0].sourceDigest).toBe(last.tasks[1].sourceDigest);
 expect(last.tasks[0].sourceBlob).toBe(last.tasks[1].sourceBlob);
 expect(last.tasks[1].playbackCompleted).toBe(true);
 expect(last.tasks[1].playCount).toBe(1);
 expect(last.tasks.every(t=>t.sourceEvaluator==='u66-source-comprehension-v1')).toBe(true);
 expect(JSON.stringify(saved)).not.toContain('PRIVATE_U66');
 expect(after.learner.promotions?.B2?.earnedAt||0).toBe(0);
 await page.reload();
 await expect(page.getByText('2 private assessment receipts',{exact:false})).toBeVisible({timeout:45000});
 await expect(page.getByRole('button',{name:'Begin P32 original-source capstone'})).toBeEnabled();
});

test('U66 P32 cannot persist a stale receipt after another tab changes the original learner CAS token',async({page})=>{
 await page.addInitScript(()=>{
  class SyntheticUtterance{constructor(text){this.text=text}}
  Object.defineProperty(window,'SpeechSynthesisUtterance',{value:SyntheticUtterance,configurable:true});
  Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{
   speak(u){queueMicrotask(()=>{u.onstart?.();u.onend?.()})},cancel(){},getVoices(){return[]}
  }});
 });
 await page.goto('/#b2-assess');
 await expect(page.getByRole('button',{name:'Begin P31 two-task argument assessment'})).toBeVisible({timeout:45000});
 await seedP31(page);
 await page.reload();
 await page.getByRole('button',{name:'Begin P32 original-source capstone'}).click();
 await page.getByRole('radio').nth(1).check();
 await page.getByRole('textbox',{name:'Calibrated B2 French response'}).fill('Une réponse indépendante de longueur modeste.');
 await page.getByRole('checkbox').check();
 await page.getByRole('button',{name:'Submit independent task 1'}).click();
 await page.getByRole('button',{name:'Continue to task 2'}).click();
 // Simulate another independent tab atomically changing the canonical token.
 await page.evaluate(async()=>new Promise((resolve,reject)=>{
  const open=indexedDB.open('thiepn-french-vnext',5);
  open.onerror=()=>reject(open.error);
  open.onsuccess=()=>{
   const db=open.result,tx=db.transaction('learner','readwrite'),store=tx.objectStore('learner');
   const get=store.get('state-v1');
   get.onsuccess=()=>{
    const row=get.result,record=row.featureState.vU65B2StructuralEvidence;
    store.put({...row,featureState:{...row.featureState,vU65B2StructuralEvidence:{
     ...record,token:'another-tab-updated-token'
    }}},'state-v1');
   };
   tx.oncomplete=()=>{db.close();resolve()};
   tx.onerror=()=>reject(tx.error);
  };
 }));
 await page.getByRole('button',{name:'Play original French (maximum two)'}).click();
 await page.getByRole('radio').nth(1).check();
 await page.getByRole('textbox',{name:'Calibrated B2 French response'}).fill('Une seconde réponse indépendante.');
 await page.getByRole('checkbox').check();
 await page.getByRole('button',{name:'Submit independent task 2'}).click();
 await expect(page.getByText(/Concurrent assessment update/)).toBeVisible();
 const saved=await readStorage(page);
 expect(saved.learner.featureState.vU65B2StructuralEvidence.token).toBe('another-tab-updated-token');
 expect(saved.learner.featureState.vU65B2StructuralEvidence.history).toHaveLength(1);
});
