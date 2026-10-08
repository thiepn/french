import { test,expect } from '@playwright/test';

test('Progress is a real evidence workspace',async({page})=>{
  await page.goto('/#progress');
  await expect(page.getByRole('heading',{name:'Progress',exact:true})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Vocabulary coverage'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Skill health'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'CEFR coverage'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Review pressure'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Functional missions'})).toBeVisible();
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
  await expect(page.getByText('At the bakery')).toBeVisible();
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
  await expect(page.getByText(/2 \/ 3 first-try independent turns/)).toBeVisible();
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
  await expect(page.getByText('Morning in town · Independence pass')).toBeVisible();
  await expect(page.getByText(/9 \/ 9 independent turns/)).toBeVisible();
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
