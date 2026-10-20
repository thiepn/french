import {test,expect} from '@playwright/test';

async function stored(page){
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
async function seed(page,options={}){
 await page.evaluate(async(opts)=>{
  const manifest=await(await fetch('/content/manifest.json')).json();
  const digest=manifest.packs.find(p=>p.id==='reading-stable-p35')?.sha256;
  if(!/^[a-f0-9]{64}$/.test(digest))throw Error('Missing verified P35 digest in test fixture');
  await new Promise((resolve,reject)=>{
   const open=indexedDB.open('thiepn-french-vnext',5);
   open.onerror=()=>reject(open.error);
   open.onsuccess=()=>{
    const db=open.result,tx=db.transaction('learner','readwrite'),store=tx.objectStore('learner');
    const get=store.get('state-v1');
    get.onsuccess=()=>{
     const original=get.result,at=Date.now();
     const actualDigest=opts.sourceChanged?'e'.repeat(64):digest;
     const task=(id,modality='argument')=>({
      taskId:id,...(modality!=='argument'?{sourceId:id}:{}),
      modality,wordCount:160,sentenceCount:8,markerFamilies:['contrast','condition','example','conclusion'],
      score:90,confidence:91,topicGroups:4,directCopyPct:0,transformation:72,
      playCount:modality==='listening'?1:0,elapsedMs:110000,
      status:'structural-targets-met',reason:'Synthetic original-authority pathway fixture only',
      evaluator:'u65-structural-v1',
      ...(modality!=='argument'?{
       sourceDigest:actualDigest,sourceRevision:'8a354063b204',
       sourceBlob:'8a354063b20421ad53b3417b3f677adc926f3cb5',
       questionId:'q1',comprehensionCorrect:true,
       playbackCompleted:modality==='listening',sourceEvaluator:'u66-source-comprehension-v1'
      }:{})
     });
     const p31={id:'synthetic-p31',kind:'p31',at,status:'structural-targets-met',
      evaluator:'u65-structural-v1',tasks:[task('work'),task('mobility')]};
     const p32={id:'synthetic-p32',kind:'p32',at,
      status:opts.failed32?'insufficient':'structural-targets-met',
      evaluator:'u65-structural-v1',
      tasks:[task('read-b2-teletravail','reading'),task('read-b2-logement','listening')]};
     const oralTask=(id,mode)=>({
      promptId:id,mode,at,status:'structural-targets-met',words:112,
      durationMs:60000,wordsPerMinute:112,asrConfidence:85,fluencyProxy:82,
      discourseProxy:82,score:82,fillerRatio:0,longPauses:1,selfCorrections:1,
      topicGroups:3,markerFamilies:['contrast'],reason:'Synthetic ASR only',
      evaluator:'u67-p33-observable-oral-v1'
     });
     const first=oralTask('oral-work-policy','immediate');
     const oralHistory=opts.with33?[{id:'synthetic-oral',at,
      status:'structural-targets-met',evaluator:'u67-p33-observable-oral-v1',
      sourceDigest:actualDigest,tasks:[first,oralTask('oral-media-claim','brief-prep')]}]:undefined;
     const oralSession=opts.resumable?{
      id:'synthetic-resume',pair:0,cursor:1,at,first,prepStartedAt:at
     }:undefined;
     const history=[...(opts.with31===false?[]:[p31]),
      ...(opts.with32===false?[]:[p32])];
     const featureState={...original.featureState,
      vU65B2StructuralEvidence:{
       schema:'thiepn-french-u65-b2-evidence-v1',token:'u69-synthetic-test-only',history,
       ...(oralHistory?{oralHistory}:{}),...(oralSession?{oralSession}:{})
      }};
     store.put({...original,featureState},'state-v1');
    };
    tx.oncomplete=()=>{db.close();resolve()};
    tx.onerror=()=>reject(tx.error);
   };
  });
 },options);
}

test('U69 authentic B2 entry is useful when unstarted; no fictional P28 B2 benchmark or maintenance',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/#b2');
 await expect(page.getByRole('button',{name:'Continue B2 P31–P33 evidence pathway'})).toBeVisible({timeout:45000});
 await page.getByRole('button',{name:'Continue B2 P31–P33 evidence pathway'}).click();
 await expect(page).toHaveURL(/#b2-path$/);
 await expect(page.getByRole('heading',{name:'B2 pathway'})).toBeVisible();
 await expect(page.getByText('0 of 3 current structural stages',{exact:false})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Next step'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Open P31 assessment'}).first()).toBeEnabled();
 await expect(page.getByText(/P28 fixed-task benchmarks and P29 longitudinal maintenance are supported for A1–B1/)).toBeVisible();
 await expect(page.getByText(/P28 has no B2 mission battery/)).toBeVisible();
 await expect(page.getByRole('button',{name:/B2 benchmark/i})).toHaveCount(0);
 const w=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
 expect(w.scroll).toBeLessThanOrEqual(w.viewport+2);
 const data=await stored(page);
 expect(data.learner.featureState.vU65B2StructuralEvidence).toBeUndefined();
 await page.getByRole('button',{name:'Open P31 assessment'}).first().click();
 await expect(page).toHaveURL(/#b2-assess$/);
});

test('U69 canonical original source P31/P32/P33 receipts show 3/3 current, preserve private data, and still disallow P28 B2',async({page})=>{
 await page.goto('/#b2-path');
 await expect(page.getByRole('heading',{name:'B2 pathway'})).toBeVisible({timeout:45000});
 const before=await stored(page);
 await seed(page,{with33:true});
 await page.reload();
 await expect(page.getByText('3 of 3 current structural stages',{exact:false})).toBeVisible({timeout:45000});
 await expect(page.getByRole('heading',{name:'Three structural stages current'})).toBeVisible();
 await expect(page.getByText('Valid through',{exact:false})).toHaveCount(3);
 await expect(page.getByText('Current',{exact:true})).toHaveCount(3);
 await expect(page.getByText(/Completing the B2 pathway above does not unlock a fictional benchmark/)).toBeVisible();
 const after=await stored(page);
 expect(after.srs).toBe(before.srs);
 expect(after.activity).toBe(before.activity);
 expect(after.learner.promotions?.B2?.earnedAt||0).toBe(0);
 expect(after.learner.featureState.vU65B2StructuralEvidence.history).toHaveLength(2);
 expect(after.learner.featureState.vU65B2StructuralEvidence.oralHistory).toHaveLength(1);
 expect(after.learner.featureState.vU65B2StructuralEvidence).not.toHaveProperty('p28Benchmark');
 await page.getByRole('button',{name:'Review B2 evidence'}).click();
 await expect(page).toHaveURL(/#b2-assess$/);
 await expect(page.getByRole('button',{name:'Review B2 P31–P33 pathway'})).toBeVisible();
});

test('U69 source digest mismatch stops P32/P33 progression but retains P31 and original oral records',async({page})=>{
 await page.goto('/#b2-path');
 await expect(page.getByRole('heading',{name:'B2 pathway'})).toBeVisible({timeout:45000});
 await seed(page,{with33:true,sourceChanged:true});
 await page.reload();
 await expect(page.getByText('1 of 3 current structural stages',{exact:false})).toBeVisible();
 await expect(page.getByText('Source changed',{exact:true})).toBeVisible();
 await expect(page.getByText(/last P32 source digest differs from the current original P35/)).toBeVisible();
 await expect(page.getByText('Locked',{exact:true})).toBeVisible();
 const after=await stored(page);
 const e=after.learner.featureState.vU65B2StructuralEvidence;
 expect(e.history).toHaveLength(2);
 expect(e.oralHistory).toHaveLength(1);
 expect(e.history[1].tasks[0].sourceDigest).toBe('e'.repeat(64));
 await page.getByRole('button',{name:'Open P32 source assessment'}).first().click();
 await expect(page).toHaveURL(/#b2-assess$/);
});

test('U69 legitimate P33 interrupted checkpoint exposes resume, without replacing the canonical oral session',async({page})=>{
 await page.goto('/#b2-path');
 await expect(page.getByRole('heading',{name:'B2 pathway'})).toBeVisible({timeout:45000});
 await seed(page,{with33:false,resumable:true});
 await page.reload();
 await expect(page.getByText('2 of 3 current structural stages',{exact:false})).toBeVisible();
 await expect(page.getByRole('button',{name:'Resume P33 oral pair'}).first()).toBeVisible();
 await expect(page.getByText(/previous oral pair has a resumable task checkpoint/)).toBeVisible();
 const data=await stored(page);
 expect(data.learner.featureState.vU65B2StructuralEvidence.oralSession.cursor).toBe(1);
 expect(data.learner.featureState.vU65B2StructuralEvidence.oralHistory).toBeUndefined();
 await page.getByRole('button',{name:'Resume P33 oral pair'}).first().click();
 await expect(page).toHaveURL(/#b2-oral$/);
});

test('U69 refresh observes an independently saved scored P32 failure, never credits a stale P33 pass',async({page})=>{
 await page.goto('/#b2-path');
 await expect(page.getByRole('heading',{name:'B2 pathway'})).toBeVisible({timeout:45000});
 await seed(page,{with33:true});
 await page.reload();
 await expect(page.getByText('3 of 3 current structural stages',{exact:false})).toBeVisible();
 await page.evaluate(async()=>new Promise((resolve,reject)=>{
  const open=indexedDB.open('thiepn-french-vnext',5);
  open.onerror=()=>reject(open.error);
  open.onsuccess=()=>{
   const db=open.result,tx=db.transaction('learner','readwrite'),store=tx.objectStore('learner');
   const get=store.get('state-v1');
   get.onsuccess=()=>{
    const learner=get.result,e=learner.featureState.vU65B2StructuralEvidence;
    store.put({...learner,featureState:{...learner.featureState,
     vU65B2StructuralEvidence:{...e,token:'another-tab-u69-scored-fail',
      history:[...e.history,{...e.history[1],id:'newer-scored-p32-fail',
       at:Date.now(),status:'insufficient'}]}
    }},'state-v1');
   };
   tx.oncomplete=()=>{db.close();resolve()};
   tx.onerror=()=>reject(tx.error);
  };
 }));
 await page.getByRole('button',{name:'Refresh current evidence'}).click();
 await expect(page.getByText('1 of 3 current structural stages',{exact:false})).toBeVisible();
 await expect(page.getByText('Re-test needed',{exact:true})).toBeVisible();
 await expect(page.getByText('Locked',{exact:true})).toBeVisible();
 const state=await stored(page);
 expect(state.learner.featureState.vU65B2StructuralEvidence.token).toBe('another-tab-u69-scored-fail');
 expect(state.learner.featureState.vU65B2StructuralEvidence.oralHistory).toHaveLength(1);
 expect(state.learner.featureState.vU65B2StructuralEvidence.history).toHaveLength(3);
});
