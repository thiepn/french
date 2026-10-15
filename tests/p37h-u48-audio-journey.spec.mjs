import {test,expect} from '@playwright/test';

/** U48 acceptance exercises native routes, a fresh learner profile and real DOM. */
test('U48 A1 independent speaking is visible without opening optional sound comparison',async({page},testInfo)=>{
 await page.goto('/#course');
 await expect(page.locator('.u6-stage-nav')).toBeVisible({timeout:45_000});
 await page.locator('.u6-stage-nav').getByRole('button',{name:'4. Listen'}).click();
 await expect(page.locator('[data-u6-stage="listen"]')).toBeVisible();
 const sounds=page.locator('.u44-original-sounds');
 await expect(sounds).not.toHaveAttribute('open','');
 const transfer=page.locator('.u46-original-speech-transfer');
 await expect(transfer).toBeVisible();
 await expect(transfer).toContainText('Try it in another situation');
 await expect(transfer).toContainText('Independent speaking');
 await expect(transfer.getByRole('button',{name:'Show independent self-check'})).toBeVisible();
 await transfer.getByRole('button',{name:'Read the original turn instead'}).click();
 await expect(transfer.locator('.u46-transfer-source')).toBeVisible();
 await transfer.getByRole('button',{name:'Show independent self-check'}).click();
 await expect(transfer.locator('.u46-transfer-check')).toBeVisible();
 for(const [name,width] of [['mobile',390],['tablet',768],['desktop',1280]]){
   await page.setViewportSize({width,height:860});
   await expect(transfer).toBeVisible();
   const dimensions=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
   expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport+2);
   await page.screenshot({path:testInfo.outputPath('u48-a1-listen-'+name+'.png'),fullPage:true});
 }
 await page.emulateMedia({colorScheme:'dark'});
 await page.screenshot({path:testInfo.outputPath('u48-a1-listen-dark.png'),fullPage:true});
 await page.locator('.u6-stage-nav').getByRole('button',{name:'6. Write'}).click();
 await expect(page.locator('[data-u6-stage="write"] textarea').first()).toBeVisible();
});

test('U48 native Listen allows written fallback without fabricated listening evidence',async({page},testInfo)=>{
 await page.addInitScript(()=>{
   Object.defineProperty(window,'SpeechSynthesisUtterance',{value:undefined,configurable:true});
 });
 await page.goto('/#listen');
 const play=page.getByRole('button',{name:'Play audio'});
 await expect(play).toBeVisible({timeout:45_000});
 await expect(play).toBeDisabled();
 await page.getByRole('button',{name:'Reveal transcript'}).click();
 const source=page.locator('[data-transcript-panel]');
 await expect(source).toBeVisible();
 const written=(await source.textContent())?.trim()??'';
 expect(written.length).toBeGreaterThan(1);
 await page.getByRole('textbox',{name:'Type what you hear'}).fill(written);
 await page.getByRole('button',{name:'Check',exact:true}).click();
 await expect(page.locator('[data-feedback]')).toContainText('Written-source practice only');
 await expect(page.locator('[data-status]')).toContainText('no listening evidence or FSRS grade was saved');
 await page.screenshot({path:testInfo.outputPath('u48-listen-no-tts.png'),fullPage:true});
 await page.getByRole('button',{name:'Next'}).click();
 await expect(page.getByRole('button',{name:'Reveal transcript'})).toBeVisible();
 await page.goto('/#speak');
 await expect(page.getByRole('button',{name:'Play model'})).toBeVisible({timeout:45_000});
 await expect(page.getByRole('button',{name:'Play model'})).toBeDisabled();
 await expect(page.getByRole('button',{name:'Slow model'})).toBeDisabled();
 await expect(page.getByRole('button',{name:'Reveal target'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Retry'})).toBeVisible();
});

test('U48 late microphone permission resolves safely after original Speak mode switches',async({page})=>{
 await page.addInitScript(()=>{
   Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{
     getUserMedia:()=>new Promise(resolve=>{window.__u48MicResolve=resolve;})
   }});
   window.__u48Stopped=0;
 });
 await page.goto('/#speak');
 const record=page.getByRole('button',{name:'Start recording'});
 await expect(record).toBeVisible({timeout:45_000});
 await record.click();
 await expect(page.getByRole('button',{name:'Requesting microphone…'})).toBeDisabled();
 await page.getByRole('button',{name:'Spoken transfer'}).click();
 await page.evaluate(()=>{
   const stop=()=>{window.__u48Stopped++;};
   window.__u48MicResolve?.({getTracks:()=>[{stop}]});
 });
 await expect.poll(()=>page.evaluate(()=>window.__u48Stopped)).toBe(1);
 await expect(page.getByRole('button',{name:'Start recording'})).toBeVisible();
});
