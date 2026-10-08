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
  await expect(page.getByRole('heading',{name:'Other ways to practise'})).toBeVisible({timeout:30_000});
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
