import {test,expect} from '@playwright/test';

async function seedB2Prerequisites(page){
 await page.evaluate(async()=>{
  const manifest=await(await fetch('/content/manifest.json')).json();
  const digest=manifest.packs.find(p=>p.id==='reading-stable-p35')?.sha256;
  if(!/^[a-f0-9]{64}$/.test(digest))throw Error('original source manifest digest missing');
  await new Promise((resolve,reject)=>{
   const open=indexedDB.open('thiepn-french-vnext',5);
   open.onerror=()=>reject(open.error);
   open.onsuccess=()=>{
    const db=open.result,tx=db.transaction('learner','readwrite'),store=tx.objectStore('learner');
    const get=store.get('state-v1');
    get.onsuccess=()=>{
     const learner=get.result,now=Date.now();
     const rec=(id,modality='argument',sourceId)=>({
      taskId:id,...(sourceId?{sourceId}:{}),modality,wordCount:170,sentenceCount:9,
      markerFamilies:['contrast','concession','condition','example','consequence','conclusion'],
      score:96,confidence:96,topicGroups:4,directCopyPct:0,transformation:91,
      playCount:modality==='listening'?1:0,elapsedMs:165000,
      status:'structural-targets-met',reason:'Browser synthetic prerequisite only.',
      evaluator:'u65-structural-v1',
      ...(sourceId?{
       sourceDigest:digest,sourceRevision:'8a354063b204',
       sourceBlob:'8a354063b20421ad53b3417b3f677adc926f3cb5',
       questionId:'q1',comprehensionCorrect:true,
       playbackCompleted:modality==='listening',sourceEvaluator:'u66-source-comprehension-v1'
      }:{})
     });
     const p31={id:'synthetic-p31',kind:'p31',at:now,
      status:'structural-targets-met',evaluator:'u65-structural-v1',
      tasks:[rec('work'),rec('transport')]};
     const p32={id:'synthetic-p32',kind:'p32',at:now,
      status:'structural-targets-met',evaluator:'u65-structural-v1',
      tasks:[rec('read-b2-teletravail','reading','read-b2-teletravail'),
       rec('read-b2-logement','listening','read-b2-logement')]};
     store.put({...learner,featureState:{...learner.featureState,
      vU65B2StructuralEvidence:{
       schema:'thiepn-french-u65-b2-evidence-v1',token:'u67-test-b2-preconditions',
       history:[p31,p32]
      }
     }},'state-v1');
    };
    tx.oncomplete=()=>{db.close();resolve()};
    tx.onerror=()=>reject(tx.error);
   };
  });
 });
}
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
const browserRecognition=()=>{
 class BrowserRecognition{
  lang='';continuous=false;interimResults=false;maxAlternatives=0;
  start(){
   window.__p33Starts=(window.__p33Starts??0)+1;
   queueMicrotask(()=>this.onstart?.());
  }
  stop(){
   const question=document.querySelector('.b2-oral .b2-question')?.textContent??'';
   const media=/étude|réseaux sociaux/i.test(question);
   const words=media?'étude cause preuve':'télétravail bureau équipe';
   const transcript=[
    'Je recommande une solution prudente pour '+words+' en considérant les intérêts contradictoires des personnes concernées.',
    'Cependant, les responsables devraient reconnaître plusieurs risques et expliquer les conséquences possibles pour les équipes.',
    'Par exemple, une organisation pourrait tester deux approches différentes avant de modifier définitivement les règles collectives.',
    'Même si les avantages semblent considérables, une décision rigide risque de produire des résultats inattendus et des problèmes sociaux.',
    'Si les conditions changent, les personnes responsables devront consulter les intéressés et discuter des objectifs avec précision.',
    'Je veux dire, il faut aussi écouter les objections et vérifier les contraintes pratiques avant de proposer une mesure immédiate.',
    'Par conséquent, une expérimentation limitée devrait permettre une comparaison équitable et transparente des diverses options disponibles.',
    'En conclusion, je recommande une évaluation progressive, avec des critères définis et la possibilité explicite de revoir cette décision.'
   ].join(' ');
   queueMicrotask(()=>{
    this.onresult?.({resultIndex:0,results:[{isFinal:true,0:{transcript,confidence:.89}}]});
    this.onend?.();
   });
  }
  abort(){window.__p33Aborts=(window.__p33Aborts??0)+1}
 }
 Object.defineProperty(window,'SpeechRecognition',{configurable:true,value:BrowserRecognition});
};

test('U67 real Chromium P33 original two-task simulated recognition, 20-second prep, private receipts and reload',async({page})=>{
 await page.clock.install();
 await page.addInitScript(browserRecognition);
 await page.goto('/#b2-oral');
 await expect(page.getByRole('heading',{name:'B2 spontaneous speaking'})).toBeVisible({timeout:45000});
 await seedB2Prerequisites(page);await page.reload();
 await expect(page.getByRole('button',{name:'Start P33 two-task oral assessment'})).toBeEnabled({timeout:45000});
 const before=await stored(page);
 await page.getByRole('button',{name:'Start P33 two-task oral assessment'}).click();
 await expect(page.getByRole('heading',{name:'Immediate response · prompt hidden'})).toBeVisible();
 await expect(page.getByText('The prompt appears only after device recognition starts.')).toBeVisible();
 await expect(page.getByRole('button',{name:'Begin French speech recognition'})).toBeDisabled();
 await page.getByRole('checkbox').check();
 await page.getByRole('button',{name:'Begin French speech recognition'}).click();
 await expect(page.getByText(/Une direction souhaite supprimer/)).toBeVisible();
 await page.clock.fastForward(60000);
 await page.getByRole('button',{name:'Finish this spoken response'}).click();
 await expect(page.getByText(/Observable transcript\/timing thresholds met/)).toBeVisible();
 await page.getByRole('button',{name:'Save task 1 evidence and continue to timed preparation'}).click();
 await expect(page.getByText(/mental preparation/i).first()).toBeVisible();
 await expect(page.getByRole('button',{name:/Mental preparation:/})).toBeDisabled();
 await page.reload();
 await expect(page.getByRole('button',{name:'Resume interrupted P33 two-task attempt'})).toBeVisible();
 await page.getByRole('button',{name:'Resume interrupted P33 two-task attempt'}).click();
 await page.clock.fastForward(20500);
 await expect(page.getByRole('button',{name:'Begin French speech recognition'})).toBeDisabled();
 await page.getByRole('checkbox').check();
 await expect(page.getByRole('button',{name:'Begin French speech recognition'})).toBeEnabled();
 await page.getByRole('button',{name:'Begin French speech recognition'}).click();
 await expect(page.getByText(/Device reported recognition started/)).toBeVisible();
 await page.clock.fastForward(60000);
 await page.getByRole('button',{name:'Finish this spoken response'}).click();
 await expect(page.getByRole('button',{name:'Save two-task aggregate evidence'})).toBeVisible();
 await page.getByRole('button',{name:'Save two-task aggregate evidence'}).click();
 await expect(page.getByText(/Private P33 aggregate history/)).toBeVisible();
 const after=await stored(page);
 expect(after.srs).toEqual(before.srs);expect(after.activity).toEqual(before.activity);
 const field=after.learner.featureState.vU65B2StructuralEvidence;
 expect(field.oralSession).toBeUndefined();
 expect(field.oralHistory).toHaveLength(1);
 const oral=field.oralHistory[0];
 expect(oral.evaluator).toBe('u67-p33-observable-oral-v1');
 expect(oral.tasks.map(t=>t.mode)).toEqual(['immediate','brief-prep']);
 expect(oral.tasks.every(t=>t.durationMs>=40000&&t.durationMs<=105000)).toBe(true);
 expect(oral.tasks.every(t=>t.asrConfidence>=25)).toBe(true);
 expect(oral.tasks.map(t=>t.promptId)).toEqual(['oral-work-policy','oral-media-claim']);
 expect(JSON.stringify(field)).not.toContain('Je recommande une solution prudente');
 expect(JSON.stringify(field)).not.toContain('transcript');
 expect(after.learner.promotions?.B2?.earnedAt||0).toBe(0);
 await page.reload();await expect(page.getByText(/Current observable P33 structural receipt/)).toBeVisible();
});

test('U67 no SpeechRecognition cannot grant oral credit; private text-only rehearsal is never persisted',async({page})=>{
 await page.addInitScript(()=>{
  Object.defineProperty(window,'SpeechRecognition',{configurable:true,value:undefined});
  Object.defineProperty(window,'webkitSpeechRecognition',{configurable:true,value:undefined});
 });
 await page.goto('/#b2-oral');
 await expect(page.getByRole('button',{name:'Open text-only speaking rehearsal'})).toBeVisible({timeout:45000});
 await expect(page.getByRole('button',{name:'Start P33 two-task oral assessment'})).toBeDisabled();
 await expect(page.getByText(/Browser SpeechRecognition is unavailable/)).toBeVisible();
 await page.getByRole('button',{name:'Open text-only speaking rehearsal'}).click();
 await expect(page.getByText(/never P33 speech evidence/)).toBeVisible();
 await page.getByRole('textbox',{name:/Private text-only rehearsal/}).first().fill('PRIVATE_REHEARSAL_NOT_A_SPEECH_RESULT');
 await page.reload();
 const data=await stored(page);
 expect(data.learner.featureState?.vU65B2StructuralEvidence?.oralHistory).toBeUndefined();
 expect(data.learner.featureState?.vU65B2StructuralEvidence?.oralSession).toBeUndefined();
 expect(JSON.stringify(data.learner)).not.toContain('PRIVATE_REHEARSAL_NOT_A_SPEECH_RESULT');
});

test('U67 recognition interrupted before first task is resumable without transcript or grade',async({page})=>{
 await page.addInitScript(browserRecognition);
 await page.goto('/#b2-oral');await expect(page.getByRole('heading',{name:'B2 spontaneous speaking'})).toBeVisible({timeout:45000});
 await seedB2Prerequisites(page);await page.reload();
 await page.getByRole('button',{name:'Start P33 two-task oral assessment'}).click();
 await page.getByRole('checkbox').check();
 await page.getByRole('button',{name:'Begin French speech recognition'}).click();
 await expect(page.getByText(/Une direction souhaite supprimer/)).toBeVisible();
 await page.reload();
 await expect(page.getByRole('button',{name:'Resume interrupted P33 two-task attempt'})).toBeVisible();
 const data=await stored(page);
 expect(data.learner.featureState.vU65B2StructuralEvidence.oralSession.cursor).toBe(0);
 expect(data.learner.featureState.vU65B2StructuralEvidence.oralHistory).toBeUndefined();
 expect(JSON.stringify(data.learner)).not.toContain('Je recommande une solution prudente');
 await page.getByRole('button',{name:'Resume interrupted P33 two-task attempt'}).click();
 await expect(page.getByRole('heading',{name:'Immediate response · prompt hidden'})).toBeVisible();
 await page.getByRole('button',{name:'Leave and resume later'}).click();
 await expect(page.getByRole('button',{name:'Discard incomplete P33 attempt'})).toBeVisible();
});

test('U67 existing P31/P32 prerequisite cannot be bypassed by synthetic recognition availability',async({page})=>{
 await page.addInitScript(browserRecognition);
 await page.setViewportSize({width:390,height:844});
 await page.goto('/#b2-oral');
 await expect(page.getByRole('button',{name:'Start P33 two-task oral assessment'})).toBeDisabled({timeout:45000});
 await expect(page.getByText(/Assessment locked: obtain current P31 and P32/)).toBeVisible();
 const w=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
 expect(w.scroll).toBeLessThanOrEqual(w.viewport+2);
 const data=await stored(page);
 expect(data.learner.featureState.vU65B2StructuralEvidence).toBeUndefined();
});
