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
    const cache=await caches.open('french-vnext-shell-v1');
    const keys=(await cache.keys()).map(request=>new URL(request.url).pathname);
    return{manifest:keys.includes('/content/manifest.json'),
      reading:keys.some(path=>path.startsWith('/content/packs/')&&/reading/i.test(path)),
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
