import { test,expect } from '@playwright/test';

test('Progress is a real evidence workspace',async({page})=>{
  await page.goto('/#progress');
  await expect(page.getByRole('heading',{name:'Progress',exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Vocabulary coverage'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Skill health'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'CEFR coverage'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Review pressure'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Functional missions'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Communicative function evidence'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Practise weak functions'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Weakest vocabulary'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'What to do next'})).toBeVisible();
});

test('Home ranks real learning actions and avoids static placeholder recommendations',async({page})=>{
  await page.goto('/#home');
  await expect(page.getByRole('heading',{name:'Continue French'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Your original course and other practice'})).toBeVisible({timeout:30_000});
  await expect(page.locator('.home-start')).toBeVisible();
  await expect(page.getByText(/Recommendations use stored learning activity/)).toBeVisible();
});

test('Guided conversation is resumable and records independent versus manual practice',async({page})=>{
  await page.goto('/#conversation');
  await expect(page.getByRole('heading',{name:'Conversation'})).toBeVisible();
  await expect(page.getByRole('button',{name:/A1 At the bakery/})).toBeVisible();
  await page.getByRole('button',{name:/A1 At the bakery/}).click();
  const field=page.getByRole('textbox',{name:'Your French response'});
  await expect(field).toBeVisible();
  await field.fill('Bonjour madame');
  await page.getByRole('button',{name:'Send response'}).click();
  await expect(page.getByText(/Ask for a croissant/)).toBeVisible();
  await page.getByRole('button',{name:'Show hint'}).click();
  await expect(page.getByText(/Hint · Say you would like a croissant/)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/Ask for a croissant/)).toBeVisible();
  await page.getByRole('textbox',{name:'Your French response'}).fill('Je voudrais un croissant');
  await page.getByRole('button',{name:'Send response'}).click();
  await expect(page.getByText(/Ask how much it costs/)).toBeVisible();
  await page.getByRole('textbox',{name:'Your French response'}).fill('Combien ça coûte ?');
  await page.getByRole('button',{name:'Send response'}).click();
  await expect(page.getByRole('heading',{name:'Conversation complete'})).toBeVisible();
  await expect(page.locator('.conversation-result').getByText(/2 \/ 3 first-try independent turns/)).toBeVisible();
});

test('Three-scene mission resumes on reload and distinguishes independent completion',async({page})=>{
  await page.goto('/#conversation');
  await expect(page.getByRole('heading',{name:'Real-world missions'})).toBeVisible();
  await page.getByRole('button',{name:/A1 Morning in town/}).click();
  const turns=[
    [{goal:'Greet the seller.',answer:'Bonjour madame'},
     {goal:'Ask for a croissant.',answer:'Je voudrais un croissant, s’il vous plaît.'},
     {goal:'Ask how much it costs.',answer:'Combien ça coûte ?'}],
    [{goal:'Order a coffee or tea.',answer:'Je voudrais un café, s’il vous plaît.'},
     {goal:'Say that you will drink it here.',answer:'Sur place, merci.'},
     {goal:'Ask for the bill.',answer:'L’addition, s’il vous plaît.'}],
    [{goal:'Ask what time the shop opens.',answer:'À quelle heure le magasin ouvre ?'},
     {goal:'Confirm the opening time is nine.',answer:'Donc, à neuf heures, c’est bien ça ?'},
     {goal:'Thank the seller.',answer:'Merci beaucoup pour votre aide.'}]
  ];
  for(let task=0;task<3;task++){
    await expect(page.getByText('Mission '+(task+1)+' of 3')).toBeVisible();
    if(task===1){
      await page.getByRole('button',{name:'Pause & home'}).click();
      await expect(page.getByRole('button',{name:'Resume active'})).toBeVisible();
      await page.reload();
      await expect(page.getByText('Mission 2 of 3')).toBeVisible();
    }
    for(let turn=0;turn<3;turn++){
      await expect(page.getByText(turns[task][turn].goal,{exact:true})).toBeVisible();
      await page.getByRole('textbox',{name:'Your French response'}).fill(turns[task][turn].answer);
      await page.getByRole('button',{name:'Send response'}).click();
      if(turn<2)await expect(page.getByText(turns[task][turn+1].goal,{exact:true})).toBeVisible();
    }
    if(task<2)await expect(page.getByText('Mission '+(task+2)+' of 3')).toBeVisible();
  }
  await expect(page.getByRole('heading',{name:'Mission complete'})).toBeVisible();
  await expect(page.locator('.conversation-result').getByText('Morning in town · Independence pass',{exact:true})).toBeVisible();
  await expect(page.locator('.conversation-result').getByText(/9 \/ 9 independent turns/)).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading',{name:'Mission history'})).toBeVisible();
  await expect(page.getByText(/Morning in town · independence pass/)).toBeVisible();
  await page.goto('/#progress');
  await expect(page.getByRole('heading',{name:'Functional missions'})).toBeVisible();
  await expect(page.getByText('Independence passes')).toBeVisible();
});

test('Function map and adaptive set survive a reload without claiming proficiency',async({page})=>{
  await page.goto('/#conversation');
  await expect(page.getByRole('heading',{name:'Communicative practice'})).toBeVisible();
  await expect(page.getByText(/23 functions with functional evidence/)).toBeVisible();
   await expect(page.getByText(/Original P35 P20 functions · 25 source definitions/)).toBeVisible();
  await expect(page.getByRole('combobox',{name:'Conversation practice level'})).toHaveValue('A1');
  await page.getByRole('button',{name:'Start adaptive set'}).click();
  await expect(page.getByText('Adaptive task 1 of 3',{exact:false})).toBeVisible();
  await page.getByRole('button',{name:'Show hint'}).click();
  await page.getByRole('button',{name:'Pause & home'}).click();
  await expect(page.getByRole('button',{name:'Resume active'})).toBeVisible();
  await page.reload();
  await expect(page.getByText('Adaptive task 1 of 3',{exact:false})).toBeVisible();
  await page.getByRole('button',{name:'Pause & home'}).click();
  await expect(page.getByText(/Function map · 0 recorded attempts/)).toBeVisible();
  await page.getByRole('button',{name:'Resume active'}).click();
  page.once('dialog',dialog=>dialog.accept());
  await page.getByRole('button',{name:'End adaptive set'}).click();
  await expect(page.getByRole('button',{name:'Start adaptive set'})).toBeEnabled();
});

test('B4 function evidence flows from a real turn into Progress without claiming proficiency',async({page})=>{
  await page.goto('/#conversation');
  await page.getByRole('button',{name:/A1 At the bakery/}).click();
  await page.getByRole('textbox',{name:'Your French response'}).fill('Bonjour madame');
  await page.getByRole('button',{name:'Send response'}).click();
  await expect(page.getByText('Ask for a croissant.',{exact:true})).toBeVisible();
  await page.goto('/#progress');
  await expect(page.getByRole('heading',{name:'Communicative function evidence'})).toBeVisible();
  await expect(page.getByText('Recorded attempts')).toBeVisible();
  const greeting=page.locator('.skill-row').filter({hasText:'Greeting'});
  await expect(greeting).toContainText('emerging');
  await expect(greeting).toContainText('1 independent');
  await expect(greeting).toContainText('1 situations');
  await expect(page.getByText(/not verified CEFR performance/)).toBeVisible();
  await page.getByRole('button',{name:'Practise weak functions'}).click();
  await expect(page.getByRole('heading',{name:'Conversation'})).toBeVisible();
  await expect(page.getByText('Ask for a croissant.',{exact:true})).toBeVisible();
});

test('Dialogue wording rotates after a full run and repeat help survives reload',async({page})=>{
  await page.goto('/#conversation');
  await page.getByRole('button',{name:/A1 At the bakery/}).click();
  const firstPrompt=await page.locator('.conversation-prompt').textContent();
  await page.getByRole('button',{name:'Ask to repeat'}).click();
  await expect(page.getByText(/Partner repeats · /)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/Partner repeats · /)).toBeVisible();
  await expect(page.locator('.conversation-prompt')).toHaveText(firstPrompt??'');
  for(const row of [
    {goal:'Greet the seller.',reply:'Bonjour madame'},
    {goal:'Ask for a croissant.',reply:'Je voudrais un croissant'},
    {goal:'Ask how much it costs.',reply:'Combien ça coûte ?'}
  ]){
    await expect(page.getByText(row.goal,{exact:true})).toBeVisible();
    await page.getByRole('textbox',{name:'Your French response'}).fill(row.reply);
    await page.getByRole('button',{name:'Send response'}).click();
  }
  await expect(page.getByRole('heading',{name:'Conversation complete'})).toBeVisible();
  await expect(page.locator('.conversation-result').getByText(/2 \/ 3 first-try independent turns/)).toBeVisible();
  await page.getByRole('button',{name:/A1 At the bakery/}).click();
  const nextPrompt=await page.locator('.conversation-prompt').textContent();
  expect(nextPrompt).not.toBe(firstPrompt);
});

test('Native writing feedback and practice-only progress survive reload without storing typed answers',async({page})=>{
  await page.goto('/#write');
  await expect(page.getByRole('heading',{name:'Write',exact:true})).toBeVisible();
  await expect(page.getByText('Prompt 1 / 12')).toBeVisible();
  await expect(page.getByText('Complete the sentence: Nous devons ______ la météo.')).toBeVisible();
  await page.getByRole('textbox',{name:'Your written French answer'}).fill('Nous devons tenir compte de la météo.');
  await page.getByRole('button',{name:'Check answer'}).click();
  await expect(page.getByText('Exact reference sentence')).toBeVisible();
  await page.getByRole('button',{name:'Save correct & next'}).click();
  await expect(page.getByText('Prompt 2 / 12')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Prompt 2 / 12')).toBeVisible();
  const saved=await page.evaluate(async()=>new Promise(resolve=>{
    const open=indexedDB.open('thiepn-french-vnext');
    open.onsuccess=()=>{
      const db=open.result,tx=db.transaction(['meta','activity'],'readonly');
      const a=tx.objectStore('meta').get('native-writing-v1');
      const b=tx.objectStore('activity').getAll();
      tx.oncomplete=()=>{db.close();resolve({state:a.result,events:b.result});};
      tx.onerror=()=>{db.close();resolve(null);};
    };
    open.onerror=()=>resolve(null);
  }));
  expect(saved).toBeTruthy();
  expect(saved.state.modes.phrase.index).toBe(1);
  const written=saved.events.filter(event=>event.practice==='written-phrase');
  expect(written).toHaveLength(1);
  expect(written[0].practiceOnly).toBe(true);
  expect(written[0].sentenceExerciseId).toBe('p12-001');
  expect(written[0].correct).toBe(true);
  expect(JSON.stringify(saved)).not.toContain('Nous devons tenir compte de la météo.');
});

test('P37I-C4 writing treats a hinted exact response as supported and commits it with the cursor',async({page})=>{
  await page.goto('/#write');
  await expect(page.getByText('Prompt 1 / 12')).toBeVisible();
  await page.getByRole('button',{name:'Hint',exact:true}).click();
  await expect(page.locator('.write-support')).toContainText('Construction ·');
  await page.getByRole('textbox',{name:'Your written French answer'}).fill('Nous devons tenir compte de la météo.');
  await page.getByRole('button',{name:'Check answer'}).click();
  await page.getByRole('button',{name:'Save supported & next'}).click();
  await expect(page.getByText('Prompt 2 / 12')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Prompt 2 / 12')).toBeVisible();
  const saved=await page.evaluate(async()=>new Promise(resolve=>{
    const open=indexedDB.open('thiepn-french-vnext');
    open.onsuccess=()=>{
      const db=open.result,tx=db.transaction(['meta','activity'],'readonly');
      const meta=tx.objectStore('meta').get('native-writing-v1');
      const activity=tx.objectStore('activity').getAll();
      tx.oncomplete=()=>{db.close();resolve({state:meta.result,events:activity.result});};
      tx.onerror=()=>{db.close();resolve(null);};
    };
    open.onerror=()=>resolve(null);
  }));
  expect(saved).toBeTruthy();
  expect(saved.state.modes.phrase.index).toBe(1);
  expect(saved.state.history).toHaveLength(1);
  expect(saved.state.history[0].support).toBe(1);
  const written=saved.events.filter(event=>event.practice==='written-phrase');
  expect(written).toHaveLength(1);
  expect(written[0].practiceOnly).toBe(true);
  expect(written[0].correct).toBe(false);
  expect(written[0].supportLevel).toBe(1);
  expect(written[0].typedQuality).toBe('review');
  expect(JSON.stringify(saved)).not.toContain('Nous devons tenir compte de la météo.');
});

test('P37I-C4 close and manually assessed sentences cannot earn independently verified credit',async({page})=>{
  await page.goto('/#write');
  await expect(page.getByText('Prompt 1 / 12')).toBeVisible();
  await page.getByRole('textbox',{name:'Your written French answer'}).fill('Nous devons tenir compte de la meteo.');
  await page.getByRole('button',{name:'Check answer'}).click();
  await expect(page.getByText('Orthography / small form issue')).toBeVisible();
  await page.getByRole('button',{name:'Save close & next'}).click();
  await expect(page.getByText('Prompt 2 / 12')).toBeVisible();
  await page.getByRole('textbox',{name:'Your written French answer'}).fill("J'ai besoin de trente minutes pour finir.");
  await page.getByRole('button',{name:'Check answer'}).click();
  await expect(page.getByText('Needs your judgment')).toBeVisible();
  await page.getByRole('button',{name:'Self-assess correct'}).click();
  await expect(page.getByText('Prompt 3 / 12')).toBeVisible();
  const stored=await page.evaluate(async()=>new Promise(resolve=>{
    const open=indexedDB.open('thiepn-french-vnext');
    open.onsuccess=()=>{
      const db=open.result,tx=db.transaction(['meta','activity'],'readonly');
      const a=tx.objectStore('meta').get('native-writing-v1');
      const b=tx.objectStore('activity').getAll();
      tx.oncomplete=()=>{db.close();resolve({state:a.result,events:b.result});};
      tx.onerror=()=>{db.close();resolve(null);};
    };
    open.onerror=()=>resolve(null);
  }));
  expect(stored.state.modes.phrase.index).toBe(2);
  const written=stored.events.filter(event=>event.practice==='written-phrase');
  expect(written).toHaveLength(2);
  expect(written.every(event=>event.correct===false&&event.practiceOnly===true)).toBe(true);
  expect(written.some(event=>event.typedQuality==='manual-self-assessed')).toBe(true);
  expect(stored.state.history).toHaveLength(2);
  expect(JSON.stringify(stored)).not.toContain('trente minutes');
});

test('Settings persist preferences and expose recovery controls',async({page})=>{
  await page.goto('/#settings');
  const newLimit=page.locator('input[name="dailyNewLimit"]');
  await expect(newLimit).toBeVisible();
  await newLimit.fill('17');
  await page.getByRole('button',{name:'Save settings'}).click();
  await expect(page.locator('[data-status]')).toContainText('Saved on this device.');
  await page.goto('/#home');
  // Prove the preceding navigation finished before reloading Settings on
  // slower Android devices; do not let two full route loads race the SW.
  await expect(page.getByRole('heading',{name:'Continue French'})).toBeVisible({timeout:30_000});
  await page.goto('/#settings');
  await expect(page.locator('input[name="dailyNewLimit"]')).toHaveValue('17');
  await expect(page.getByRole('button',{name:'Export backup'})).toBeVisible();
  await expect(page.locator('input[data-import]')).toHaveAttribute('accept',/json/);
});

test('Read restores the native P14 corpus and paired listening bridge',async({page})=>{
  await page.goto('/#read');
  await expect(page.getByRole('heading',{name:'Read',exact:true})).toBeVisible();
  await expect(page.getByText(/25 original graded texts/i)).toBeVisible({timeout:30_000});
  await expect(page.getByRole('heading',{name:'Recommended now'})).toBeVisible();
  const firstOpen=page.getByRole('button',{name:/Open|Resume/}).first();
  await firstOpen.click();
  await expect(page.getByRole('button',{name:'Listen pair'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Speak context'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Extensive'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Intensive'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Targeted'})).toBeVisible();
  await page.getByRole('button',{name:'Listen pair'}).click();
  await expect(page.getByRole('heading',{name:'Listen',exact:true})).toBeVisible();
  await expect(page.getByText(/aligned segments ready/i)).toBeVisible({timeout:30_000});
  await expect(page.getByRole('button',{name:/Back to /})).toBeVisible();
});

test('Listen exposes support-aware contextual evidence without moving SRS',async({page})=>{
  await page.goto('/#listen');
  await expect(page.getByRole('heading',{name:'Listen',exact:true})).toBeVisible();
  await expect(page.getByRole('button',{name:'Comprehensible'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Intensive'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Targeted'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Play audio'})).toBeVisible({timeout:30_000});
  await expect(page.getByRole('button',{name:'Reveal transcript'})).toBeVisible();
  await expect(page.getByRole('button',{name:'Reveal translation'})).toBeDisabled();
  await expect(page.getByRole('textbox',{name:'Type what you hear'})).toBeVisible();
});

test('Speak exposes four modes, local recording and conservative recognition',async({page})=>{
  await page.goto('/#speak');
  await expect(page.getByRole('heading',{name:'Speak',exact:true})).toBeVisible();
  for(const name of ['Pronunciation','Shadowing','Spoken recall','Spoken transfer'])await expect(page.getByRole('button',{name})).toBeVisible();
  await expect(page.getByRole('button',{name:'Play model'})).toBeVisible({timeout:30_000});
  await expect(page.getByRole('button',{name:'Start recording'})).toBeVisible();
  await expect(page.getByRole('button',{name:/Check recognition|Recognition unavailable/})).toBeVisible();
  await expect(page.getByText(/not an accent or pronunciation score/i)).toBeVisible();
  await expect(page.getByText('Manual judgment')).toBeVisible();
  await expect(page.getByRole('button',{name:'Slow model'})).toBeVisible();
  await page.getByRole('button',{name:'Spoken transfer'}).click();
  await expect(page.getByText(/P12 p12-/)).toBeVisible();
  await expect(page.getByText(/Required:/)).toBeVisible();
});

test('installed vNext shell survives a real offline reload',async({page,context})=>{
  await page.goto('/#home');
  await page.evaluate(async()=>{
    if(!('serviceWorker' in navigator))throw new Error('service worker unavailable');
    await navigator.serviceWorker.ready;
  });
  if(!await page.evaluate(()=>Boolean(navigator.serviceWorker.controller))){
    await page.reload();
    await expect.poll(()=>page.evaluate(()=>Boolean(navigator.serviceWorker.controller)),{timeout:15_000}).toBeTruthy();
  }
  await context.setOffline(true);
  try{
    await page.reload();
    await expect(page.getByRole('heading',{name:'Continue French'})).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-shell-ready','true');
  }finally{
    await context.setOffline(false);
  }
});



test('U54 offline cold-start precaches public manifest without loading any private data',async({page,context})=>{
  await page.goto('/#home');
  await page.evaluate(async()=>navigator.serviceWorker.ready);
  if(!await page.evaluate(()=>Boolean(navigator.serviceWorker.controller))){
    await page.reload();
    await expect.poll(()=>page.evaluate(()=>Boolean(navigator.serviceWorker.controller)),{timeout:15_000}).toBe(true);
  }
  const prewarm=await page.evaluate(async()=>{
    const names=await caches.keys();
    const current=names.find(name=>/^french-vnext-shell-[0-9a-f]{12}$/.test(name));
    if(!current)throw Error('Versioned vNext shell was not installed');
    const store=await caches.open(current);
    const paths=(await store.keys()).map(request=>new URL(request.url).pathname);
    return {manifest:paths.includes('/content/manifest.json'),
      unrelated:paths.filter(path=>path.startsWith('/api/')||path.startsWith('/rest/v1/'))};
  });
  expect(prewarm).toEqual({manifest:true,unrelated:[]});
  await context.setOffline(true);
  try{
    await page.reload();
    await page.goto('/#learn');
    await expect(page.getByRole('heading',{name:'Learn'})).toBeVisible({timeout:30_000});
    await expect(page.locator('[data-status]')).toContainText('vocabulary records',{timeout:30_000});
    expect(await page.evaluate(async()=>{
      const response=await fetch('/content/manifest.json');
      const payload=await response.json();
      return response.ok&&payload.schema==='thiepn-french-content-manifest-v1';
    })).toBe(true);
  }finally{await context.setOffline(false);}
});

test('U54 P35 legacy cache survives vNext worker update and cannot supply foreign offline responses',async({page,context})=>{
  await page.goto('/#home');
  await page.evaluate(async()=>navigator.serviceWorker.ready);
  // Install a representative P35-owned cache before an isolated vNext worker update.
  await page.evaluate(async()=>{
    const legacy=await caches.open('french-shell-v35');
    await legacy.put('/content/packs/p35-legacy-only.json',new Response('P35_CACHE_ONLY',
      {headers:{'content-type':'application/json'}}));
    await legacy.put('/api/p35-private',new Response('P35_PRIVATE_ONLY',
      {headers:{'content-type':'text/plain'}}));
    const registration=await navigator.serviceWorker.register('/service-worker.js?u54-cache-boundary');
    await new Promise((resolve,reject)=>{
      if(registration.active?.scriptURL.includes('u54-cache-boundary')){resolve();return;}
      const active=registration.installing??registration.waiting;
      if(!active){reject(Error('Test update did not create a worker'));return;}
      active.addEventListener('statechange',()=>{
        if(active.state==='activated')resolve();
        if(active.state==='redundant')reject(Error('Test worker redundant'));
      });
    });
  });
  await expect.poll(async()=>page.evaluate(async()=>({
    controlled:Boolean(navigator.serviceWorker.controller?.scriptURL.includes('u54-cache-boundary')),
    legacy:(await caches.keys()).includes('french-shell-v35')
  })),{timeout:20_000}).toEqual({controlled:true,legacy:true});
  await context.setOffline(true);
  try{
    const found=await page.evaluate(async()=>{
      const check=async path=>{
        try{return await (await fetch(path)).text();}
        catch{return 'NETWORK_UNAVAILABLE';}
      };
      return {
        legacyPack:await check('/content/packs/p35-legacy-only.json'),
        privateApi:await check('/api/p35-private'),
        originalStillOwned:(await caches.keys()).includes('french-shell-v35'),
        nativeLeak:(await(await caches.open('french-vnext-content-v1')).keys())
          .some(request=>new URL(request.url).pathname==='/api/p35-private')
      };
    });
    expect(found).toEqual({
      legacyPack:'NETWORK_UNAVAILABLE',privateApi:'NETWORK_UNAVAILABLE',
      originalStillOwned:true,nativeLeak:false
    });
    await page.reload();
    await expect(page.getByRole('heading',{name:'Continue French'})).toBeVisible({timeout:30_000});
  }finally{await context.setOffline(false);}
});


test('U54 corpus index retries in the same tab after an offline cache miss',async({page,context})=>{
  await page.goto('/#home');
  await page.evaluate(async()=>navigator.serviceWorker.ready);
  if(!await page.evaluate(()=>Boolean(navigator.serviceWorker.controller))){
    await page.reload();
    await expect.poll(()=>page.evaluate(()=>Boolean(navigator.serviceWorker.controller)),{timeout:15_000}).toBe(true);
  }
  const before=await page.evaluate(async()=>{
    const store=await caches.open('french-vnext-content-v1');
    return Boolean(await store.match('/content/search/vocabulary-index.json'));
  });
  expect(before).toBe(false); // Full search index remains on-demand.
  await context.setOffline(true);
  try{
    await page.evaluate(()=>{location.hash='#words';});
    await expect(page.getByRole('heading',{name:'Words',exact:true})).toBeVisible({timeout:30_000});
    await expect(page.locator('[data-results] .word-result')).toHaveCount(0);
  }finally{await context.setOffline(false);}
  // Same JS realm: merely navigating to Home and back must recover both the
  // previously rejected index promise and any aborted route's signal.
  await page.evaluate(()=>{location.hash='#home';});
  await expect(page.getByRole('heading',{name:'Continue French'})).toBeVisible({timeout:30_000});
  await page.evaluate(()=>{location.hash='#words';});
  await expect(page.locator('[data-results] .word-result').first()).toBeVisible({timeout:45_000});
  expect(await page.evaluate(async()=>Boolean(
    await(await caches.open('french-vnext-content-v1')).match('/content/search/vocabulary-index.json')
  ))).toBe(true);
});

test('U56 vNext shell update preserves the previous build, P35 rollback and SHA-verified offline content',async({page,context})=>{
  await page.goto('/#read');
  await expect(page.locator('.open-world-entry')).toBeVisible({timeout:45_000});
  await page.evaluate(async()=>navigator.serviceWorker.ready);
  if(!await page.evaluate(()=>Boolean(navigator.serviceWorker.controller))){
    await page.reload();
    await expect.poll(()=>page.evaluate(()=>Boolean(navigator.serviceWorker.controller)),{timeout:15_000}).toBe(true);
  }
  const original=await page.evaluate(async()=>{
    const names=await caches.keys();
    const current=names.find(name=>/^french-vnext-shell-[0-9a-f]{12}$/.test(name));
    if(!current)throw Error('No content-addressed installed shell');
    const contents=await caches.open('french-vnext-content-v1');
    const contentPaths=(await contents.keys()).map(req=>new URL(req.url).pathname);
    const manifest=await (await contents.match('/content/manifest.json'))?.json();
    const reading=manifest?.packs.find(pack=>pack.id==='reading-stable-p35')?.path;
    if(!reading||!contentPaths.includes(reading))throw Error('Source-verified reading not prewarmed');
    // A prior build cache must not be mutated or deleted by installation.
    const prior=await caches.open('french-vnext-shell-000000000000');
    await prior.put('/u56-prior-build',new Response('IMMUTABLE_PRIOR_BUILD'));
    await prior.put('/assets/u56-legacy-hash.js',new Response('PREVIOUS_BUILD_CHUNK'));
    const stable=await caches.open('french-shell-v35');
    await stable.put('/u56-original-p35',new Response('ORIGINAL_P35'));
    return{current,reading,contentPaths};
  });
  await page.evaluate(async()=>{
    const registration=await navigator.serviceWorker.register('/service-worker.js?u56-upgrade-retention');
    await new Promise((resolve,reject)=>{
      if(registration.active?.scriptURL.includes('u56-upgrade-retention'))return resolve();
      const worker=registration.installing??registration.waiting;
      if(!worker)return reject(Error('No upgrade worker'));
      worker.addEventListener('statechange',()=>{
        if(worker.state==='activated')resolve();
        if(worker.state==='redundant')reject(Error('Upgrade worker redundant'));
      });
    });
  });
  await expect.poll(async()=>page.evaluate(()=>Boolean(
    navigator.serviceWorker.controller?.scriptURL.includes('u56-upgrade-retention')
  )),{timeout:20_000}).toBe(true);
  const kept=await page.evaluate(async()=>{
    const names=await caches.keys();
    const read=async(name,path)=>(await(await caches.open(name)).match(path))?.text();
    const contentPaths=(await(await caches.open('french-vnext-content-v1')).keys())
      .map(request=>new URL(request.url).pathname);
    return{
      previous:await read('french-vnext-shell-000000000000','/u56-prior-build'),
      p35:await read('french-shell-v35','/u56-original-p35'),
      contentPaths,current:names.find(name=>/^french-vnext-shell-[0-9a-f]{12}$/.test(name)&&name!=='french-vnext-shell-000000000000')
    };
  });
  expect(kept.previous).toBe('IMMUTABLE_PRIOR_BUILD');
  expect(kept.p35).toBe('ORIGINAL_P35');
  expect(kept.current).toBe(original.current);
  // A worker upgrade may add a SHA-pinned manifest to the verified cache.
  // Every previous verified path must survive, even if a new key is added.
  expect(original.contentPaths.every(path=>kept.contentPaths.includes(path))).toBe(true);
  await context.setOffline(true);
  try{
    await page.reload();
    await expect(page.locator('.open-world-entry')).toBeVisible({timeout:30_000});
    const body=await page.evaluate(async path=>(await fetch(path)).text(),original.reading);
    expect(body).toContain('reading-stable-p35');
    // The new worker must still serve an old tab's lazy hashed chunk.
    expect(await page.evaluate(async()=>{
      return(await fetch('/assets/u56-legacy-hash.js')).text();
    })).toBe('PREVIOUS_BUILD_CHUNK');
  }finally{await context.setOffline(false);}
});


test('U57 old-tab unversioned cache writes cannot replace SHA-pinned offline vocabulary',async({page,context})=>{
  await page.goto('/#words');
  await expect(page.locator('[data-results] .word-result').first()).toBeVisible({timeout:45_000});
  const baseline=await page.evaluate(async()=>{
    const store=await caches.open('french-vnext-content-v1');
    const manifestKey=(await store.keys()).find(request=>
      request.url.includes('/content/manifest.json?verifiedSha256='));
    if(!manifestKey)throw Error('Build-pinned verified manifest not available');
    const manifest=await(await store.match(manifestKey)).json();
    const descriptor=manifest.indexes.vocabulary;
    const pinned=descriptor.path+'?verifiedSha256='+descriptor.sha256;
    const response=await store.match(pinned);
    if(!response)throw Error('Verified index not pinned to its digest');
    const original=await response.text();
    await store.put(descriptor.path,new Response('{"schema":"foreign","rows":[{"word":"U57_CORRUPTED"}]}',
      {headers:{'content-type':'application/json'}}));
    return{pinned,original,sha:descriptor.sha256};
  });
  await context.setOffline(true);
  try{
    await page.reload();
    await expect(page.locator('[data-results] .word-result').first()).toBeVisible({timeout:45_000});
    const evidence=await page.evaluate(async pinned=>{
      const store=await caches.open('french-vnext-content-v1');
      const bytes=await(await store.match(pinned)).arrayBuffer();
      const actual=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)))
        .map(b=>b.toString(16).padStart(2,'0')).join('');
      return{actual,containsAttack:JSON.stringify(document.body.textContent).includes('U57_CORRUPTED')};
    },baseline.pinned);
    expect(evidence.actual).toBe(baseline.sha);
    expect(evidence.containsAttack).toBe(false);
  }finally{await context.setOffline(false);}
});

test('U57 damaged pinned and legacy corpus caches fail closed, then recover after reconnect',async({page,context})=>{
  await page.goto('/#words');
  await expect(page.locator('[data-results] .word-result').first()).toBeVisible({timeout:45_000});
  const target=await page.evaluate(async()=>{
    const store=await caches.open('french-vnext-content-v1');
    const manifestKey=(await store.keys()).find(request=>
      request.url.includes('/content/manifest.json?verifiedSha256='));
    if(!manifestKey)throw Error('Build-pinned verified manifest not available');
    const manifest=await(await store.match(manifestKey)).json();
    const descriptor=manifest.indexes.vocabulary;
    const pinned=descriptor.path+'?verifiedSha256='+descriptor.sha256;
    const poison=new Response('{"schema":"thiepn-french-vocabulary-search-v1","rows":[{"word":"U57_CORRUPTED"}]}',
      {headers:{'content-type':'application/json'}});
    await store.put(pinned,poison.clone());
    await store.put(descriptor.path,poison);
    return{pinned,sha:descriptor.sha256};
  });
  await context.setOffline(true);
  try{
    await page.reload();
    await expect(page.getByRole('heading',{name:'Words',exact:true})).toBeVisible({timeout:30_000});
    await expect(page.locator('[data-results] .word-result')).toHaveCount(0,{timeout:30_000});
    const remaining=await page.evaluate(async pinned=>Boolean(
      await(await caches.open('french-vnext-content-v1')).match(pinned)
    ),target.pinned);
    expect(remaining).toBe(false);
    expect(await page.evaluate(()=>document.body.textContent.includes('U57_CORRUPTED'))).toBe(false);
  }finally{await context.setOffline(false);}
  // The rejected shared promise must be replaced on navigation without reload.
  await page.evaluate(()=>{location.hash='#home';});
  await expect(page.getByRole('heading',{name:'Continue French'})).toBeVisible({timeout:30_000});
  await page.evaluate(()=>{location.hash='#words';});
  await expect(page.locator('[data-results] .word-result').first()).toBeVisible({timeout:45_000});
  const actual=await page.evaluate(async pinned=>{
    const response=await(await caches.open('french-vnext-content-v1')).match(pinned);
    if(!response)return'UNCACHED';
    const bytes=await response.arrayBuffer();
    return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)))
      .map(b=>b.toString(16).padStart(2,'0')).join('');
  },target.pinned);
  expect(actual).toBe(target.sha);
});


test('U58 active mixed-version tabs preserve all prior native shell caches across worker updates',async({page,context})=>{
  const older=await context.newPage();
  try{
    await page.goto('/#home');
    await older.goto('/#home');
    await expect(page.getByRole('heading',{name:'Continue French'})).toBeVisible();
    await expect(older.getByRole('heading',{name:'Continue French'})).toBeVisible();
    await page.evaluate(async()=>navigator.serviceWorker.ready);
    if(!await page.evaluate(()=>Boolean(navigator.serviceWorker.controller))){
      await page.reload();
      await expect.poll(()=>page.evaluate(()=>Boolean(navigator.serviceWorker.controller)),{timeout:15_000}).toBe(true);
    }
    const names=await page.evaluate(async()=>{
      const old=['french-vnext-shell-000000000001','french-vnext-shell-000000000002','french-vnext-shell-000000000003'];
      for(let i=0;i<old.length;i++){
        const store=await caches.open(old[i]);
        await store.put('/assets/u58-prior-'+i+'.js',new Response('PRIOR_BUILD_'+i));
      }
      const p35=await caches.open('french-shell-v35');
      await p35.put('/u58-p35-original',new Response('P35_INTACT'));
      const verified=await caches.open('french-vnext-content-v1');
      await verified.put('/u58-verified-public',new Response('VERIFIED_CONTENT'));
      return old;
    });
    await page.evaluate(async()=>{
      const registration=await navigator.serviceWorker.register('/service-worker.js?u58-mixed-version-protection');
      await new Promise((resolve,reject)=>{
        if(registration.active?.scriptURL.includes('u58-mixed-version-protection'))return resolve();
        const worker=registration.installing??registration.waiting;
        if(!worker)return reject(Error('No U58 upgrade worker'));
        worker.addEventListener('statechange',()=>{
          if(worker.state==='activated')resolve();
          if(worker.state==='redundant')reject(Error('Upgrade worker was redundant'));
        });
      });
    });
    await expect.poll(()=>page.evaluate(()=>Boolean(
      navigator.serviceWorker.controller?.scriptURL.includes('u58-mixed-version-protection')
    )),{timeout:20_000}).toBe(true);
    const retained=await page.evaluate(async names=>{
      const values=[];
      for(let i=0;i<names.length;i++)
        values.push(await(await(await caches.open(names[i])).match('/assets/u58-prior-'+i+'.js')).text());
      const p35=await(await(await caches.open('french-shell-v35')).match('/u58-p35-original')).text();
      const verified=await(await(await caches.open('french-vnext-content-v1')).match('/u58-verified-public')).text();
      return{values,p35,verified};
    },names);
    expect(retained).toEqual({
      values:['PRIOR_BUILD_0','PRIOR_BUILD_1','PRIOR_BUILD_2'],
      p35:'P35_INTACT',verified:'VERIFIED_CONTENT'
    });
    await context.setOffline(true);
    try{
      // Still-open old tabs can lazily fetch their own previous hashed assets.
      expect(await older.evaluate(async()=>(
        await fetch('/assets/u58-prior-0.js')
      ).text())).toBe('PRIOR_BUILD_0');
    }finally{await context.setOffline(false);}
  }finally{await older.close();}
});

test('U58 offline storage diagnostics show low quota and never delete original caches',async({page})=>{
  await page.goto('/#home');
  await expect(page.getByRole('heading',{name:'Continue French'})).toBeVisible();
  const before=await page.evaluate(async()=>{
    await caches.open('french-shell-v35');
    await caches.open('french-vnext-content-v1');
    Object.defineProperty(navigator,'storage',{configurable:true,value:{
      estimate:async()=>({usage:95_000_000,quota:100_000_000}),
      persisted:async()=>false,
      persist:async()=>false
    }});
    return await caches.keys();
  });
  await page.evaluate(()=>{location.hash='#settings';});
  await expect(page.getByRole('heading',{name:'Offline storage'})).toBeVisible({timeout:30_000});
  await page.getByRole('button',{name:'Check offline storage'}).click();
  await expect(page.locator('[data-offline-status]')).toContainText('95.0 MB of 100.0 MB');
  await expect(page.locator('[data-offline-status]')).toContainText('Low remaining space');
  await expect(page.locator('[data-offline-status]')).toContainText('No data was deleted');
  await page.getByRole('button',{name:'Request persistent storage'}).click();
  await expect(page.locator('[data-offline-status]')).toContainText('Persistent storage was not granted');
  expect(await page.evaluate(()=>caches.keys())).toEqual(before);
});

test('U59 older running build rejects a changed shared manifest and keeps SHA-pinned offline study',async({page,context})=>{
  await page.goto('/#words');
  await expect(page.locator('[data-results] .word-result').first()).toBeVisible({timeout:45_000});
  const saved=await page.evaluate(async()=>{
    const content=await caches.open('french-vnext-content-v1');
    const keys=(await content.keys()).map(request=>request.url);
    const pinned=keys.find(key=>key.includes('/content/manifest.json?verifiedSha256='));
    if(!pinned)throw Error('Build has no SHA-pinned manifest');
    const original=await(await content.match(pinned)).text();
    const sha=pinned.split('verifiedSha256=')[1];
    const bad=JSON.stringify({...JSON.parse(original),revision:'foreign-vnext-build'});
    await content.put('/content/manifest.json',new Response(bad,
      {headers:{'content-type':'application/json'}}));
    return {sha,pinned,original};
  });
  await context.setOffline(true);
  try{
    await page.reload();
    await expect(page.locator('[data-results] .word-result').first()).toBeVisible({timeout:45_000});
    const retained=await page.evaluate(async pinned=>{
      const storage=await caches.open('french-vnext-content-v1');
      const response=await storage.match(pinned);
      if(!response)return null;
      return await response.text();
    },saved.pinned);
    expect(retained).toBe(saved.original);
  }finally{await context.setOffline(false);}
});

test('U59 wrong-build online manifest is rejected and recovered from matching installed shell',async({page})=>{
  await page.goto('/#words');
  await expect(page.locator('[data-results] .word-result').first()).toBeVisible({timeout:45_000});
  const baseline=await page.evaluate(async()=>{
    const storage=await caches.open('french-vnext-content-v1');
    const keys=await storage.keys();
    const pinned=keys.map(request=>request.url).find(url=>url.includes('/content/manifest.json?verifiedSha256='));
    if(!pinned)throw Error('No build manifest');
    const original=await(await storage.match(pinned)).text();
    await storage.delete(pinned);
    await storage.delete('/content/manifest.json');
    return{pinned,original};
  });
  // Model a newer deployed origin serving a different valid-shaped manifest
  // while this tab still runs the old JS. The old immutable shell is intact.
  await page.addInitScript(()=>{
    const originalFetch=window.fetch.bind(window);
    window.fetch=(input,init)=>{
      const url=new URL(typeof input==='string'?input:input.url,location.href);
      if(url.pathname==='/content/manifest.json'){
        return Promise.resolve(new Response(JSON.stringify({
          schema:'thiepn-french-content-manifest-v1',revision:'foreign-new-build',
          indexes:{vocabulary:{path:'/content/search/vocabulary-index.json',
            sha256:'0'.repeat(64),schema:'x',count:0,bytes:1,revision:'foreign'}},
          packs:[]
        }),{status:200,headers:{'content-type':'application/json'}}));
      }
      return originalFetch(input,init);
    };
  });
  await page.reload();
  await expect(page.locator('[data-results] .word-result').first()).toBeVisible({timeout:45_000});
  const restored=await page.evaluate(async pinned=>{
    const r=await(await caches.open('french-vnext-content-v1')).match(pinned);
    return r?await r.text():null;
  },baseline.pinned);
  expect(restored).toBe(baseline.original);
});
test('Registered first-party French client remains local-only outside production',async({page})=>{
  await page.goto('/#settings');
  await expect(page.getByRole('heading',{name:'THIEPN Account'})).toBeVisible();
  await expect(page.getByText(/Account sync is production-origin only/i)).toBeVisible();
  await expect(page.getByText(/Configured public client bf2e7fca-98dd-4833-9fee-306ecd6fc7d7/i)).toBeVisible();
  await expect(page.getByRole('button',{name:'Sync this device'})).toHaveCount(0);
});

test('C2 restores P10 source frames, persists phrase evidence, and opens repair without typed answers',async({page})=>{
  await page.goto('/#write');
  await page.getByRole('button',{name:'Usage & phrase transfer (P10/P11)'}).click();
  await expect(page.getByText('67 source-tagged P10 frames',{exact:false})).toBeVisible({timeout:30_000});
  await expect(page.getByText('Frame 1 / 67')).toBeVisible();
  await expect(page.getByText('Complete the source frame: apprendre _____ + infinitif')).toBeVisible();
  await expect(page.getByRole('link',{name:/Tex.s French Grammar/})).toHaveAttribute('href',/^https:\/\//);
  await page.getByRole('textbox',{name:'Your French usage or phrase answer'}).fill('à');
  await page.getByRole('button',{name:'Check phrase'}).click();
  await expect(page.getByText('Exact verified frame')).toBeVisible();
  await page.getByRole('button',{name:'Save exact & next'}).click();
  await expect(page.getByText('Frame 2 / 67')).toBeVisible();
  await page.reload();
  await page.getByRole('button',{name:'Usage & phrase transfer (P10/P11)'}).click();
  await expect(page.getByText('Frame 2 / 67')).toBeVisible();
  await page.getByRole('textbox',{name:'Your French usage or phrase answer'}).fill('de');
  await page.getByRole('button',{name:'Check phrase'}).click();
  await expect(page.getByText('Different connector')).toBeVisible();
  await page.getByRole('button',{name:'Needs practice & next'}).click();
  await page.getByRole('button',{name:'Repair (1)'}).click();
  await expect(page.getByText(/Rebuild the previously missed construction for: arriver/)).toBeVisible();
  const stored=await page.evaluate(async()=>new Promise(resolve=>{
    const open=indexedDB.open('thiepn-french-vnext');
    open.onsuccess=()=>{
      const db=open.result,tx=db.transaction(['meta','activity'],'readonly');
      const state=tx.objectStore('meta').get('native-usage-v1'),events=tx.objectStore('activity').getAll();
      tx.oncomplete=()=>{db.close();resolve({state:state.result,events:events.result});};
      tx.onerror=()=>{db.close();resolve(null);};
    };
    open.onerror=()=>resolve(null);
  }));
  expect(stored).toBeTruthy();
  expect(stored.state.history).toHaveLength(2);
  const events=stored.events.filter(row=>String(row.practice||'').startsWith('verified-usage-'));
  expect(events).toHaveLength(2);
  expect(events.every(row=>row.practiceOnly===true)).toBe(true);
  expect(JSON.stringify(stored)).not.toContain('apprendre à + infinitif');
  await page.getByRole('button',{name:'Sentence writing (P12)'}).click();
  await expect(page.getByText('Prompt 1 / 12')).toBeVisible();
});

test('C3 gates and rotates transfer using independently exact usage evidence',async({page})=>{
  await page.goto('/#write');
  await page.getByRole('button',{name:'Usage & phrase transfer (P10/P11)'}).click();
  await expect(page.getByRole('button',{name:'Transfer (0)'})).toBeVisible();
  await expect(page.getByText('Usage secure')).toBeVisible();
  await expect(page.getByText('Frame 1 / 67')).toBeVisible();
  const typeAndSave=async(answer)=>{
    await page.getByRole('textbox',{name:'Your French usage or phrase answer'}).fill(answer);
    await page.getByRole('button',{name:'Check phrase'}).click();
    await expect(page.getByText('Exact verified frame')).toBeVisible();
    await page.getByRole('button',{name:'Save exact & next'}).click();
  };
  await typeAndSave('à');
  await expect(page.getByText('Record p10-002',{exact:false})).toBeVisible();
  await typeAndSave('à');
  await expect(page.getByText('Record p10-001',{exact:false})).toBeVisible();
  await typeAndSave('à');
  await expect(page.getByRole('button',{name:'Transfer (1)'})).toBeVisible();
  await page.getByRole('button',{name:'Transfer (1)'}).click();
  await expect(page.getByText(/Structural cue 1 of 3/)).toBeVisible();
  await typeAndSave('apprendre à + infinitif');
  await expect(page.getByText(/Structural cue 2 of 3/)).toBeVisible();
  await page.reload();
  await page.getByRole('button',{name:'Usage & phrase transfer (P10/P11)'}).click();
  await page.getByRole('button',{name:'Transfer (1)'}).click();
  await expect(page.getByText(/Structural cue 2 of 3/)).toBeVisible();
  await typeAndSave('apprendre à + infinitif');
  await expect(page.locator('.write-mastery-stat').filter({hasText:'Transfer secure'})).toContainText('1');
  const result=await page.evaluate(async()=>new Promise(resolve=>{
    const open=indexedDB.open('thiepn-french-vnext');
    open.onsuccess=()=>{
      const db=open.result,tx=db.transaction(['meta','activity'],'readonly');
      const a=tx.objectStore('meta').get('native-usage-v1'),b=tx.objectStore('activity').getAll();
      tx.oncomplete=()=>{db.close();resolve({state:a.result,events:b.result});};
      tx.onerror=()=>{db.close();resolve(null);};
    };
    open.onerror=()=>resolve(null);
  }));
  expect(result).toBeTruthy();
  expect(result.state.tallies['p10-001'].usage.attempts).toBe(2);
  expect(result.state.tallies['p10-001'].transfer.attempts).toBe(2);
  expect(result.state.tallies['p10-001'].transfer.variantMask).toBe(3);
  const usageEvents=result.events.filter(e=>String(e.practice).startsWith('verified-usage-'));
  expect(usageEvents).toHaveLength(5);
  expect(usageEvents.every(e=>e.practiceOnly===true)).toBe(true);
  expect(JSON.stringify(result)).not.toContain('apprendre à + infinitif');
});


test('P37I-C5 genuinely different contexts earn independent metadata-only evidence',async({page})=>{
  await page.goto('/#write');
  await page.getByRole('button',{name:'Usage & phrase transfer (P10/P11)'}).click();
  await expect(page.getByRole('button',{name:'Contexts (0)'})).toBeVisible();
  const solve=async(answer,attempt,track='usage')=>{
    await page.getByRole('textbox',{name:'Your French usage or phrase answer'}).fill(answer);
    await page.getByRole('button',{name:'Check phrase'}).click();
    await page.getByRole('button',{name:'Save exact & next'}).click();
    await expect(page.locator('.inline-status')).toContainText(
      attempt+' recorded '+track+' attempts');
  };
  await solve('à',1);
  await solve('à',2);
  await solve('à',3);
  await expect(page.getByRole('button',{name:'Contexts (1)'})).toBeVisible();
  await page.getByRole('button',{name:'Contexts (1)'}).click();
  await expect(page.getByText('Write in French: I am learning to read in French.')).toBeVisible();
  await expect(page.getByText(/VOCABULARY LINK/)).toBeVisible();
  await expect(page.getByText(/Contextual practice|production|dictionary|vocabulary|lemma/i).first()).toBeVisible();
  await expect(page.getByRole('link',{name:'Open vocabulary'})).toHaveAttribute('href','#words');
  await solve("J'apprends à lire en français.",1,'context');
  await expect(page.getByText('Write in French: She is learning to cook.')).toBeVisible();
  await solve('Elle apprend à cuisiner.',2,'context');
  await expect(page.locator('.write-mastery-stat').filter({hasText:'Contexts secure'})).toContainText('1');
  await expect(page.locator('.write-mastery-stat').filter({hasText:'Transfer secure'})).toContainText('0');
  await page.reload();
  await page.getByRole('button',{name:'Usage & phrase transfer (P10/P11)'}).click();
  const data=await page.evaluate(async()=>new Promise(resolve=>{
    const open=indexedDB.open('thiepn-french-vnext');
    open.onsuccess=()=>{
      const db=open.result,tx=db.transaction(['meta','activity'],'readonly');
      const s=tx.objectStore('meta').get('native-usage-v1');
      const a=tx.objectStore('activity').getAll();
      tx.oncomplete=()=>{db.close();resolve({state:s.result,events:a.result});};
      tx.onerror=()=>{db.close();resolve(null);};
    };
    open.onerror=()=>resolve(null);
  }));
  expect(data.state.tallies['p10-001'].context.attempts).toBe(2);
  expect(data.state.tallies['p10-001'].context.variantMask).toBe(3);
  expect(data.state.tallies['p10-001'].transfer).toBeUndefined();
  const events=data.events.filter(e=>e.practice==='verified-usage-context');
  expect(events).toHaveLength(2);
  expect(events.every(e=>e.correct===true&&e.practiceOnly===true)).toBe(true);
  expect(JSON.stringify(data)).not.toContain("J'apprends à lire en français.");
  expect(JSON.stringify(data)).not.toContain('Elle apprend à cuisiner.');
});


test('P37I-C4 bridges independent P10 recall to original P12 written application',async({page})=>{
  await page.goto('/#write');
  await page.getByRole('button',{name:'Sentence writing (P12)'}).click();
  await page.getByRole('button',{name:'Connected'}).click();
  await expect(page.getByText(/Connected sentences become available after two independent exact recalls/)).toBeVisible();
  await page.getByRole('button',{name:'Usage & phrase transfer (P10/P11)'}).click();
  const solveUsage=async(attempt)=>{
    await page.getByRole('textbox',{name:'Your French usage or phrase answer'}).fill('à');
    await page.getByRole('button',{name:'Check phrase'}).click();
    await page.getByRole('button',{name:'Save exact & next'}).click();
    await expect(page.locator('.inline-status')).toContainText(attempt+' recorded usage attempts');
  };
  await solveUsage(1);
  await solveUsage(2);
  await solveUsage(3);
  await page.getByRole('button',{name:'Sentence writing (P12)'}).click();
  await page.getByRole('button',{name:'Connected'}).click();
  await expect(page.getByRole('heading',{name:'Connected sentence transfer'})).toBeVisible();
  await expect(page.getByText(/source p10-001/)).toBeVisible();
  await expect(page.getByText(/36 P12 sentences linked to P10/)).toBeVisible();
  await page.getByRole('textbox',{name:'Your written French answer'}).fill("J'apprends à conduire.");
  await page.getByRole('button',{name:'Check answer'}).click();
  await page.getByRole('button',{name:'Save correct & next'}).click();
  // The save handler commits learner/activity/writing atomically but is async.
  // Wait until the next screen reflects durable evidence before reloading.
  await expect(page.locator('.inline-status')).toContainText('1 exact sentence models');
  await page.reload();
  await page.getByRole('button',{name:'Sentence writing (P12)'}).click();
  await page.getByRole('button',{name:'Connected'}).click();
  const result=await page.evaluate(async()=>new Promise(resolve=>{
    const open=indexedDB.open('thiepn-french-vnext');
    open.onsuccess=()=>{
      const db=open.result,tx=db.transaction(['meta','activity'],'readonly');
      const w=tx.objectStore('meta').get('native-writing-v1');
      const u=tx.objectStore('meta').get('native-usage-v1');
      const ev=tx.objectStore('activity').getAll();
      tx.oncomplete=()=>{db.close();resolve({writing:w.result,usage:u.result,events:ev.result});};
      tx.onerror=()=>{db.close();resolve(null);};
    };
    open.onerror=()=>resolve(null);
  }));
  expect(result.writing.evidence['p12-007'].independentExact).toBe(1);
  expect(result.usage.tallies['p10-001'].transfer).toBeUndefined();
  expect(result.usage.tallies['p10-001'].context).toBeUndefined();
  const events=result.events.filter(e=>e.practice==='written-bridge');
  expect(events).toHaveLength(1);
  expect(events[0].correct).toBe(true);
  expect(events[0].practiceOnly).toBe(true);
  expect(JSON.stringify(result)).not.toContain("J'apprends à conduire.");
});


test('P37I-D1 Progress exposes cross-skill remediation without awarding a CEFR level',async({page})=>{
  await page.goto('/#progress');
  await expect(page.getByRole('heading',{name:'Cross-skill study plan'})).toBeVisible();
  await expect(page.getByRole('heading',{name:/CEFR evidence gaps/})).toBeVisible();
  await expect(page.getByText(/not a CEFR readiness score/i)).toBeVisible();
  await expect(page.getByText(/30-day evidence:/)).toBeVisible();
  const before=await page.evaluate(async()=>new Promise(resolve=>{
    const o=indexedDB.open('thiepn-french-vnext');
    o.onsuccess=()=>{
      const db=o.result,tx=db.transaction(['srs','activity'],'readonly');
      const s=tx.objectStore('srs').count(),a=tx.objectStore('activity').count();
      tx.oncomplete=()=>{db.close();resolve([s.result,a.result]);};
      tx.onerror=()=>{db.close();resolve(null);};
    };
    o.onerror=()=>resolve(null);
  }));
  await page.reload();
  await expect(page.getByRole('heading',{name:'Cross-skill study plan'})).toBeVisible();
  const after=await page.evaluate(async()=>new Promise(resolve=>{
    const o=indexedDB.open('thiepn-french-vnext');
    o.onsuccess=()=>{
      const db=o.result,tx=db.transaction(['srs','activity'],'readonly');
      const s=tx.objectStore('srs').count(),a=tx.objectStore('activity').count();
      tx.oncomplete=()=>{db.close();resolve([s.result,a.result]);};
      tx.onerror=()=>{db.close();resolve(null);};
    };
    o.onerror=()=>resolve(null);
  }));
  expect(after).toEqual(before);
});

test('P37I-D2 CEFR evidence gates expose prerequisites and never promote learners',async({page})=>{
  await page.goto('/#progress');
  const section=page.locator('.cefr-gates');
  await expect(section.getByRole('heading',{name:'CEFR progression gates'})).toBeVisible();
  await expect(section.locator('.cefr-gate-entry')).toHaveCount(4);
  await expect(section).toContainText('promotion blocked');
  const a1=section.locator('.cefr-gate-entry').first();
  await expect(a1.locator('summary')).toContainText('A1');
  await expect(a1.locator('summary')).toContainText('practice checks');
  await expect(a1).toHaveAttribute('open','');
  await expect(a1).toContainText('Balanced vocabulary recall');
  await expect(a1).toContainText('Validated level assessment');
  await expect(a1).toContainText('Not performed');
  const b2=section.locator('.cefr-gate-entry').last();
  await expect(b2.locator('summary')).toContainText('B2');
  await expect(b2.locator('summary')).toContainText('Content unavailable');
  await b2.locator('summary').click();
  await expect(b2).toContainText('Independently verified speaking');
  await expect(section).toContainText('A level is never automatically awarded');
});


test('P37I-D2 calibration separates independent modality evidence without a proficiency score',async({page})=>{
  await page.goto('/#progress');
  const section=page.locator('.evidence-calibration');
  await expect(section.getByRole('heading',{name:'Cross-skill evidence calibration'})).toBeVisible();
  await expect(section.locator('.calibration-row')).toHaveCount(7);
  await expect(section).toContainText('First-listen dictation');
  await expect(section).toContainText('Spoken production');
  await expect(section).toContainText('Guided interaction');
  await expect(section).toContainText('Construction → sentence → situation');
  await expect(section).toContainText('not a proficiency percentage');
  const speaking=section.locator('.calibration-row').filter({hasText:'Spoken production'});
  await speaking.locator('summary').click();
  await expect(speaking).toContainText('Speech recognition and personal judgments');
  await expect(speaking).toContainText('manually judged');
  const listening=section.locator('.calibration-row').filter({hasText:'First-listen dictation'});
  await listening.locator('summary').click();
  await expect(listening).toContainText('Repeated playback and transcripts');
  const writing=section.locator('.calibration-row').filter({hasText:'Sentence writing'});
  await writing.locator('summary').click();
  await expect(writing.getByRole('button',{name:'Practice sentence writing'})).toBeVisible();
  await expect(page.locator('.cefr-gates')).toContainText('promotion blocked');
});

test('P37I-D3 longitudinal trends remain read-only and distinguish insufficient data',async({page})=>{
  await page.goto('/#progress');
  const panel=page.locator('.longitudinal-panel');
  await expect(panel.getByRole('heading',{name:'Longitudinal mastery'})).toBeVisible();
  await expect(panel).toContainText('Two 45-day windows');
  await expect(panel).toContainText('comparable');
  await expect(panel).toContainText('Not enough repeated, independently graded evidence yet');
  await expect(panel).toContainText('Observational');
  const before=await page.evaluate(async()=>new Promise(resolve=>{
    const open=indexedDB.open('thiepn-french-vnext');
    open.onsuccess=()=>{
      const db=open.result,tx=db.transaction(['srs','activity'],'readonly');
      const a=tx.objectStore('srs').count(),b=tx.objectStore('activity').count();
      tx.oncomplete=()=>{db.close();resolve([a.result,b.result]);};
      tx.onerror=()=>{db.close();resolve(null);};
    };
    open.onerror=()=>resolve(null);
  }));
  await page.reload();
  await expect(page.locator('.longitudinal-panel').getByRole('heading',{name:'Longitudinal mastery'})).toBeVisible();
  const after=await page.evaluate(async()=>new Promise(resolve=>{
    const open=indexedDB.open('thiepn-french-vnext');
    open.onsuccess=()=>{
      const db=open.result,tx=db.transaction(['srs','activity'],'readonly');
      const a=tx.objectStore('srs').count(),b=tx.objectStore('activity').count();
      tx.oncomplete=()=>{db.close();resolve([a.result,b.result]);};
      tx.onerror=()=>{db.close();resolve(null);};
    };
    open.onerror=()=>resolve(null);
  }));
  expect(after).toEqual(before);
});


test('P37I-D3 shows matched-target recurring errors and decline from real IndexedDB history',async({page})=>{
  await page.goto('/#progress');
  const seeded=await page.evaluate(async()=>{
    const db=await new Promise((resolve,reject)=>{
      const req=indexedDB.open('thiepn-french-vnext');
      req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
    });
    const now=Date.now(),DAY=86_400_000;
    const changes=[
      ['vnext-d3-improving',[false,false,false],[true,true,true]],
      ['vnext-d3-declining',[true,true,true],[false,false,false]],
      ['vnext-d3-persistent',[false,false,false],[false,false,false]]
    ];
    const all=[];
    for(const [id,old,recent] of changes){
      const ages=[82,70,58,22,12,3];
      for(const [i,correct] of [...old,...recent].entries()){
        all.push({
          schema:'thiepn-french-review-event-v1',eventId:'d3-browser:'+id+':'+i,
          id:id+'::d31:0:recognition',noteId:id,skill:'recognition',
          practice:'review',practiceOnly:false,t:now-ages[i]*DAY,
          rating:correct?'good':'again',correct,typed:true,
          typedQuality:correct?'exact':'review',responseMs:1200,
          direction:'fr-en',wasNew:false,xp:0
        });
      }
    }
    await new Promise((resolve,reject)=>{
      const tx=db.transaction('activity','readwrite'),store=tx.objectStore('activity');
      for(const row of all)store.put(row,row.eventId);
      tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);
      tx.onabort=()=>reject(tx.error);
    });
    const stored=await new Promise((resolve,reject)=>{
      const tx=db.transaction(['srs','activity'],'readonly');
      const sr=tx.objectStore('srs').count(),ev=tx.objectStore('activity').count();
      tx.oncomplete=()=>resolve([sr.result,ev.result]);
      tx.onerror=()=>reject(tx.error);
    });
    db.close();return stored;
  });
  expect(seeded[1]).toBeGreaterThanOrEqual(18);
  await page.reload();
  const panel=page.locator('.longitudinal-panel');
  await expect(panel.getByRole('heading',{name:'Longitudinal mastery'})).toBeVisible();
  await expect(panel.locator('.longitudinal-stats')).toContainText('3 comparable');
  await expect(panel.locator('.longitudinal-stats')).toContainText('1 improving');
  await expect(panel.locator('.longitudinal-stats')).toContainText('1 declining');
  await expect(panel.locator('.longitudinal-stats')).toContainText('1 persistent risks');
  const targets=panel.locator('.longitudinal-target');
  await expect(targets).toHaveCount(2);
  await expect(targets).toContainText(['Persistent errors','Recently declined']);
  const rows=panel.locator('.longitudinal-row');
  await expect(rows).toHaveCount(3);
  const improving=rows.filter({hasText:'vnext-d3-improving'});
  await improving.locator('summary').click();
  await expect(improving).toContainText('Recent graded performance improved for this same target');
  await expect(panel).toContainText(/observational/i);
  const after=await page.evaluate(async()=>new Promise(resolve=>{
    const open=indexedDB.open('thiepn-french-vnext');
    open.onsuccess=()=>{
      const db=open.result,tx=db.transaction(['srs','activity'],'readonly');
      const s=tx.objectStore('srs').count(),e=tx.objectStore('activity').count();
      tx.oncomplete=()=>{db.close();resolve([s.result,e.result]);};
      tx.onerror=()=>{db.close();resolve(null);};
    };open.onerror=()=>resolve(null);
  }));
  expect(after).toEqual(seeded);
});

test('P37I-D5 P21 personal reading persists aggregate exposure only, not pasted French or SRS credit',async({page})=>{
  await page.goto('/#read');
  const panel=page.locator('.open-world-entry');
  await expect(panel.getByRole('heading',{name:'Bring your own French'})).toBeVisible();
  const original='Bonjour mon ami, ceci est un texte de lecture personnel pour apprendre sans enregistrer le contenu. ';
  const secret='CONFIDENTIAL_STUDY_WORDS_NEVER_SYNC';
  await panel.locator('textarea').fill((original+secret+' ').repeat(3));
  await panel.getByRole('button',{name:'Analyze & read'}).click();
  await expect(page.locator('.open-world-reader')).toBeVisible();
  const before=await page.evaluate(async()=>new Promise(resolve=>{
    const o=indexedDB.open('thiepn-french-vnext');
    o.onsuccess=()=>{const d=o.result,t=d.transaction(['srs','activity'],'readonly');
      const x=t.objectStore('srs').count(),y=t.objectStore('activity').count();
      t.oncomplete=()=>{d.close();resolve([x.result,y.result]);};};
  }));
  await page.getByRole('button',{name:'Finish exposure'}).click();
  await expect(page.locator('.open-world-entry')).toContainText('1 completed personal reading');
  const saved=await page.evaluate(async()=>new Promise(resolve=>{
    const o=indexedDB.open('thiepn-french-vnext');
    o.onsuccess=()=>{const d=o.result,t=d.transaction(['learner','srs','activity'],'readonly');
      const learner=t.objectStore('learner').get('state-v1');
      const x=t.objectStore('srs').count(),y=t.objectStore('activity').count();
      t.oncomplete=()=>{d.close();resolve({learner:learner.result,counts:[x.result,y.result]});};};
  }));
  expect(saved.counts).toEqual(before);
  const persisted=JSON.stringify(saved.learner);
  expect(persisted).not.toContain(secret);
  expect(persisted).not.toContain(original);
  expect(saved.learner.featureState.v5120OpenWorld.sessions).toHaveLength(1);
  await page.reload();
  await expect(page.locator('.open-world-entry')).toContainText('1 completed personal reading');
  await expect(page.locator('.open-world-input')).toHaveValue('');
});

test('P37I-D5 P23 retains an adaptive study block without awarding SRS or inventing completion',async({page})=>{
  await page.goto('/#home');
  await expect(page.getByRole('button',{name:'Build a short adaptive block'})).toBeVisible();
  const before=await page.evaluate(async()=>new Promise(resolve=>{
    const o=indexedDB.open('thiepn-french-vnext');
    o.onsuccess=()=>{const d=o.result,t=d.transaction(['srs','activity'],'readonly');
      const s=t.objectStore('srs').count(),e=t.objectStore('activity').count();
      t.oncomplete=()=>{d.close();resolve([s.result,e.result]);};};
  }));
  await page.getByRole('button',{name:'Build a short adaptive block'}).click();
  await expect(page.locator('.home-focus')).toContainText('Step 1 of');
  await page.reload();
  await expect(page.locator('.home-focus')).toContainText('Step 1 of');
  const after=await page.evaluate(async()=>new Promise(resolve=>{
    const o=indexedDB.open('thiepn-french-vnext');
    o.onsuccess=()=>{const d=o.result,t=d.transaction(['learner','srs','activity'],'readonly');
      const q=t.objectStore('learner').get('state-v1'),s=t.objectStore('srs').count(),e=t.objectStore('activity').count();
      t.oncomplete=()=>{d.close();resolve({block:q.result.featureState.v5130AdaptiveBlock,counts:[s.result,e.result]});};};
  }));
  expect(after.counts).toEqual(before);
  expect(after.block.cursor).toBe(0);
  expect(after.block.steps.length).toBeLessThanOrEqual(3);
  expect(after.block.steps.reduce((n,s)=>n+s.minutes,0)).toBeLessThanOrEqual(26);
  await page.getByRole('button',{name:'End block; keep study progress'}).click();
  await expect(page.locator('.home-focus')).toContainText('Native study history remains unchanged');
  await page.reload();
  await expect(page.getByRole('button',{name:'Build a short adaptive block'})).toBeVisible();
});

test('P37I-D5 imported personal French remains local and readable after a PWA offline reload',async({page,context})=>{
  await page.goto('/#read');
  await expect(page.locator('.open-world-entry')).toBeVisible();
  await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
  if(!await page.evaluate(()=>Boolean(navigator.serviceWorker.controller))){
    await page.reload();
    await expect.poll(()=>page.evaluate(()=>Boolean(navigator.serviceWorker.controller)),{timeout:15_000}).toBeTruthy();
  }
  // The first online Read visit must persist only public, visited content in
  // Cache Storage, even if it happened before the SW acquired control.
  const offlineContent=await page.evaluate(async()=>{
    const cache=await caches.open('french-vnext-content-v1');
    const keys=(await cache.keys()).map(request=>new URL(request.url).pathname);
    const storedManifest=await cache.match('/content/manifest.json');
    const manifest=storedManifest?await storedManifest.json():null;
    const readingDescriptor=manifest?.packs?.find(row=>row.id==='reading-stable-p35');
    return{manifest:keys.includes('/content/manifest.json'),
      reading:Boolean(readingDescriptor?.path&&keys.includes(readingDescriptor.path)),
      vocabulary:keys.some(path=>path.includes('/content/search/'))};
  });
  expect(offlineContent).toEqual({manifest:true,reading:true,vocabulary:true});
  await context.setOffline(true);
  try{
    await page.reload();
    const panel=page.locator('.open-world-entry');
    await expect(panel.getByRole('heading',{name:'Bring your own French'})).toBeVisible({timeout:30_000});
    const secret='PRIVATE_OFFLINE_FRENCH_ONLY_IN_PAGE';
    await panel.locator('textarea').fill(
      ('Bonjour mon ami nous lisons ce texte français et discutons des mots '+secret+' ').repeat(3));
    await panel.getByRole('button',{name:'Analyze & read'}).click();
    await expect(page.locator('.open-world-reader')).toBeVisible();
    await page.getByRole('button',{name:'Finish exposure'}).click();
    await expect(page.locator('.open-world-entry')).toContainText('1 completed personal reading');
    const stored=await page.evaluate(async()=>new Promise(resolve=>{
      const o=indexedDB.open('thiepn-french-vnext');o.onsuccess=()=>{
        const d=o.result,t=d.transaction('learner','readonly'),request=t.objectStore('learner').get('state-v1');
        request.onsuccess=()=>{d.close();resolve(request.result.featureState.v5120OpenWorld);};
      };
    }));
    expect(stored.sessions.length).toBe(1);
    expect(JSON.stringify(stored)).not.toContain(secret);
  }finally{await context.setOffline(false);}
  await page.reload();
  await expect(page.locator('.open-world-entry')).toContainText('1 completed personal reading');
  await expect(page.locator('.open-world-input')).toHaveValue('');
});

test('P37I-D6 P26 diagnoses native wrong construction evidence without changing scheduling',async({page})=>{
  await page.goto('/#progress');
  await expect(page.getByRole('heading',{name:'Targeted remediation (P26)'})).toBeVisible();
  const seeded=await page.evaluate(async()=>new Promise((resolve,reject)=>{
    const o=indexedDB.open('thiepn-french-vnext');o.onerror=()=>reject(o.error);
    o.onsuccess=()=>{
      const db=o.result,tx=db.transaction(['activity','srs'],'readwrite');
      const record={schema:'thiepn-french-review-event-v1',
        eventId:'d6:p26:connector',noteId:'d6-connector-target',
        id:'d6-connector-target::d31:0:production',skill:'production',
        practice:'written-bridge',practiceOnly:true,t:Date.now()-86_400_000,
        rating:'again',correct:false,typed:true,typedQuality:'review',
        errorCategory:'connector',supportLevel:0,xp:0};
      const before=tx.objectStore('srs').count();
      tx.objectStore('activity').put(record,record.eventId);
      tx.oncomplete=()=>{const count=before.result;db.close();resolve(count);};
      tx.onerror=()=>reject(tx.error);
    };
  }));
  await page.reload();
  const panel=page.locator('.p26-diagnostics');
  await expect(panel).toContainText('d6-connector-target');
  await expect(panel).toContainText('grammar');
  await expect(panel).toContainText('practice-only proposed stages');
  const after=await page.evaluate(async()=>new Promise(resolve=>{
    const o=indexedDB.open('thiepn-french-vnext');o.onsuccess=()=>{
      const db=o.result,tx=db.transaction('srs','readonly');
      const q=tx.objectStore('srs').count();
      q.onsuccess=()=>{const n=q.result;db.close();resolve(n);};
    };
  }));
  expect(after).toBe(seeded);
  expect(await panel.getByRole('button',{name:/Open write/}).count()).toBeGreaterThan(0);
});


test('P37I-D6-B repairs resume, demand later independent note-specific evidence, and never mutate FSRS',async({page})=>{
  await page.goto('/#progress');
  await expect(page.locator('.p26-diagnostics')).toBeVisible();
  const before=await page.evaluate(async()=>new Promise((resolve,reject)=>{
    const req=indexedDB.open('thiepn-french-vnext');req.onerror=()=>reject(req.error);
    req.onsuccess=()=>{
      const db=req.result,tx=db.transaction(['activity','srs'],'readwrite');
      const s=tx.objectStore('srs').count();
      const row={schema:'thiepn-french-review-event-v1',eventId:'d6b:wrong',
        noteId:'d6b-grammar',id:'d6b-grammar::d31:0:production',skill:'production',
        practice:'written-bridge',practiceOnly:true,t:Date.now()-60_000,
        correct:false,typed:true,typedQuality:'near',rating:'again',
        errorCategory:'connector',supportLevel:0,xp:0};
      tx.objectStore('activity').put(row,row.eventId);
      tx.oncomplete=()=>{db.close();resolve(s.result);};tx.onerror=()=>reject(tx.error);
    };
  }));
  await page.reload();
  const panel=page.locator('.p26-diagnostics');
  await expect(panel).toContainText('d6b-grammar');
  await panel.getByRole('button',{name:'Start targeted repair (up to 3 cases)'}).click();
  await expect(panel.locator('.p26-run-card')).toContainText('scaffold');
  await panel.getByRole('button',{name:'I completed guided practice — no grade'}).click();
  await expect(panel.locator('.p26-run-card')).toContainText('rebuild');
  await page.reload();
  await expect(panel.locator('.p26-run-card')).toContainText('rebuild');
  await panel.getByRole('button',{name:'I completed guided practice — no grade'}).click();
  await expect(panel.locator('.p26-run-card')).toContainText('independent retest');
  await panel.getByRole('button',{name:'Begin independent retest'}).click();
  await panel.getByRole('button',{name:'Check new native evidence'}).click();
  await expect(panel.locator('[role=status]')).toContainText('No new independently verified');
  // Synthetic native-event fixture: this is not authenticated human acceptance.
  const seeded=await page.evaluate(async()=>new Promise((resolve,reject)=>{
    const req=indexedDB.open('thiepn-french-vnext');req.onerror=()=>reject(req.error);
    req.onsuccess=()=>{
      const db=req.result,tx=db.transaction('activity','readwrite');
      const row={schema:'thiepn-french-review-event-v1',eventId:'d6b:clean',
        noteId:'d6b-grammar',id:'d6b-grammar::d31:0:production',skill:'production',
        practice:'written-bridge',practiceOnly:true,t:Date.now()-1,
        correct:true,typed:true,typedQuality:'exact',sentenceDiagnosis:'exact',
        rating:'good',supportLevel:0,xp:0};
      tx.objectStore('activity').put(row,row.eventId);
      tx.oncomplete=()=>{db.close();resolve(true);};tx.onerror=()=>reject(tx.error);
    };
  }));
  expect(seeded).toBe(true);
  await panel.getByRole('button',{name:'Check new native evidence'}).click();
  await expect(panel).toContainText('1/1 independently observed successful retests');
  const proof=await page.evaluate(async()=>new Promise((resolve,reject)=>{
    const req=indexedDB.open('thiepn-french-vnext');req.onerror=()=>reject(req.error);
    req.onsuccess=()=>{
      const db=req.result,tx=db.transaction(['learner','activity','srs'],'readonly');
      const learner=tx.objectStore('learner').get('state-v1');
      const activity=tx.objectStore('activity').count();
      const srs=tx.objectStore('srs').count();
      tx.oncomplete=()=>{db.close();resolve({run:learner.result.featureState.v5170Remediation,
        activity:activity.result,srs:srs.result});};
      tx.onerror=()=>reject(tx.error);
    };
  }));
  expect(proof.run.active).toBeNull();
  expect(proof.run.history.at(-1)).toMatchObject({retests:1,passed:1,status:'completed'});
  expect(proof.srs).toBe(before);
  expect(proof.activity).toBeGreaterThanOrEqual(2);
  const serialized=JSON.stringify(proof.run);
  for(const secret of ['rawAnswer','recognizedText','transcript','sourceText'])expect(serialized).not.toContain(secret);
  await page.reload();
  await expect(panel).toContainText('1/1 independently observed successful retests');
});


test('B6 original P17/P20 source identities remain explanatory, never turn into native grade',async({page})=>{
  await page.goto('/#conversation');
  const inventory=page.locator('.conversation-source-parity');
  await expect(inventory.getByText(/Original P35 P20 functions · 25 source definitions/)).toBeVisible();
  await inventory.locator('summary').click();
  await expect(inventory.getByText('Source sequence · not independently assessed')).toBeVisible();
  await expect(inventory.getByText(/14 \/ 19 original P17 scene identities mapped/)).toBeVisible();
  const before=await page.evaluate(async()=>new Promise((resolve,reject)=>{
    const q=indexedDB.open('thiepn-french-vnext');q.onerror=()=>reject(q.error);
    q.onsuccess=()=>{const db=q.result,tx=db.transaction(['srs','activity'],'readonly');
      const a=tx.objectStore('srs').count(),e=tx.objectStore('activity').count();
      tx.oncomplete=()=>{db.close();resolve([a.result,e.result]);};tx.onerror=()=>reject(tx.error);};
  }));
  await page.getByRole('button',{name:/A1 At the bakery/}).click();
  await expect(page.locator('.conversation-source-note')).toContainText('bakery-buy');
  const goal=page.locator('.conversation-original-goal');
  await goal.locator('summary').click();
  await expect(goal).toContainText('Ask for an item, give a quantity, and close the purchase.');
  await page.getByRole('button',{name:'Ask to repeat'}).click();
  await expect(page.getByText(/Partner repeats/)).toBeVisible();
  await page.reload();
  await expect(page.locator('.conversation-source-note')).toContainText('bakery-buy');
  await expect(page.getByText(/Partner repeats/)).toBeVisible();
  const after=await page.evaluate(async()=>new Promise((resolve,reject)=>{
    const q=indexedDB.open('thiepn-french-vnext');q.onerror=()=>reject(q.error);
    q.onsuccess=()=>{const db=q.result,tx=db.transaction(['srs','activity','meta'],'readonly');
      const a=tx.objectStore('srs').count(),e=tx.objectStore('activity').count(),
        c=tx.objectStore('meta').get('native-conversation-v1');
      tx.oncomplete=()=>{db.close();resolve({counts:[a.result,e.result],conversation:c.result});};
      tx.onerror=()=>reject(tx.error);};
  }));
  expect(after.counts).toEqual(before);
  expect(after.conversation.active.scenarioId).toBe('bakery');
  expect(after.conversation.functionEvents.at(-1).credit).toBe(0);
  expect(JSON.stringify(after.conversation)).not.toContain('Bonjour madame');
});


test('B7 real P35 source graph branches, resumes and keeps source evidence separate from SRS',async({page})=>{
  await page.goto('/#conversation');
  const before=await page.evaluate(async()=>new Promise((resolve,reject)=>{
    const q=indexedDB.open('thiepn-french-vnext');q.onerror=()=>reject(q.error);
    q.onsuccess=()=>{const d=q.result,t=d.transaction(['srs','activity'],'readonly');
      const s=t.objectStore('srs').count(),a=t.objectStore('activity').count();
      t.oncomplete=()=>{d.close();resolve([s.result,a.result]);};t.onerror=()=>reject(t.error);};
  }));
  await expect(page.getByRole('heading',{name:'Original P35 dialogue graphs'})).toBeVisible();
  await page.getByRole('button',{name:/A1 · Order at a café · original graph/}).click();
  await expect(page.locator('.conversation-prompt')).toContainText('Bonjour');
  await expect(page.getByText(/original P35 deterministic source/i)).toBeVisible();
  const first=await page.locator('.conversation-prompt').textContent();
  await page.getByRole('textbox',{name:'Reply to original source graph in French'})
    .fill('Bonjour, je voudrais un grand café, s’il vous plaît.');
  await page.getByRole('button',{name:'Check source rule'}).click();
  await expect(page.getByText(/source graph node confirm/i)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/source graph node confirm/i)).toBeVisible();
  await page.getByRole('button',{name:'Show original hint'}).click();
  await expect(page.getByText(/Source hint/)).toBeVisible();
  await page.getByRole('textbox',{name:'Reply to original source graph in French'})
    .fill('Oui, c’est tout, merci.');
  await page.getByRole('button',{name:'Check source rule'}).click();
  await expect(page.getByText(/Recent original graph: Order at a café/)).toBeVisible();
  const saved=await page.evaluate(async()=>new Promise((resolve,reject)=>{
    const q=indexedDB.open('thiepn-french-vnext');q.onerror=()=>reject(q.error);
    q.onsuccess=()=>{const d=q.result,t=d.transaction(['meta','srs','activity'],'readonly');
      const m=t.objectStore('meta').get('p35-source-graph-v1'),
        s=t.objectStore('srs').count(),a=t.objectStore('activity').count();
      t.oncomplete=()=>{d.close();resolve({source:m.result,counts:[s.result,a.result]});};
      t.onerror=()=>reject(t.error);};
  }));
  expect(saved.counts).toEqual(before);
  expect(saved.source.active).toBeNull();
  expect(saved.source.history[0].turns).toBe(2);
  expect(saved.source.history[0].complete).toBe(true);
  expect(saved.source.evidence.every(row=>row.practiceOnly)).toBe(true);
  expect(saved.source.evidence.at(-1).independent).toBe(false);
  const compact=JSON.stringify(saved.source);
  for(const forbidden of ['un grand café','c’est tout, merci','recognizedText','rawAnswer','transcript'])
    expect(compact).not.toContain(forbidden);
  await page.getByRole('button',{name:/A1 · Order at a café · original graph/}).click();
  await expect(page.locator('.conversation-prompt')).not.toHaveText(first??'');
});

test('B7 source graph clarifications never mint original function mastery or CEFR promotion',async({page})=>{
  await page.goto('/#conversation');
  await page.getByRole('button',{name:/A1 · Order at a café · original graph/}).click();
  await page.getByRole('button',{name:'Ask for clarification'}).click();
  await expect(page.getByText(/Dites-moi simplement ce que vous voulez boire/)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/original P35 deterministic source/i)).toBeVisible();
  const events=await page.evaluate(async()=>new Promise((resolve,reject)=>{
    const q=indexedDB.open('thiepn-french-vnext');q.onerror=()=>reject(q.error);
    q.onsuccess=()=>{const d=q.result,t=d.transaction('meta','readonly');
      const m=t.objectStore('meta').get('p35-source-graph-v1');
      m.onsuccess=()=>{d.close();resolve(m.result);};m.onerror=()=>reject(m.error);};}));
  expect(events.active.repairs).toBe(1);
  expect(events.evidence).toMatchObject([{functionId:'clarify',repair:true,credit:0,practiceOnly:true}]);
  expect(events.active.nodeId).toBe('order');
  await page.getByRole('button',{name:'Show source example'}).click();
  await expect(page.getByText(/Source model/)).toBeVisible();
  await page.getByRole('textbox',{name:'Reply to original source graph in French'})
    .fill('Bonjour, je voudrais un café, s’il vous plaît.');
  await page.getByRole('button',{name:'Check source rule'}).click();
  const after=await page.evaluate(async()=>new Promise((resolve,reject)=>{
    const q=indexedDB.open('thiepn-french-vnext');q.onerror=()=>reject(q.error);
    q.onsuccess=()=>{const d=q.result,t=d.transaction('meta','readonly');
      const m=t.objectStore('meta').get('p35-source-graph-v1');
      m.onsuccess=()=>{d.close();resolve(m.result);};m.onerror=()=>reject(m.error);};}));
  expect(after.evidence.at(-1).credit).toBe(0);
  expect(after.evidence.at(-1).independent).toBe(false);
});
