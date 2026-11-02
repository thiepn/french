import {test,expect} from '@playwright/test';

// These test source-based UI behavior only. Simulated SpeechSynthesis callbacks
// cannot demonstrate actual audible French, pronunciation or human performance.
async function openB2Listening(page){
 await page.goto('/#course/B2/transfer-151');
 await expect(page.locator('.u6-stage-nav')).toBeVisible({timeout:45_000});
 await page.locator('.u6-stage-nav').getByRole('button',{name:'4. Listen'}).click();
 const deep=page.locator('details.u39-context-tools').filter({has:page.getByText('Optional deeper listening interpretation and grammar')});
 await deep.locator('summary').click();
 const lab=page.getByRole('region',{name:'Original multi-speaker listening and interpretation lab'});
 await expect(lab).toBeVisible();
 await lab.locator('.u30-disclosure summary').click();
 return lab;
}
test('B2 listening remains explicitly text-led when no synthesized audio is heard',async({page})=>{
 const lab=await openB2Listening(page);
 await expect(lab.locator('.u30-question')).toBeVisible();
 const button=lab.getByRole('button',{name:'I heard the device audio for this question (self-report)'});
 await expect(button).toBeDisabled();
 await expect(lab.locator('.u30-evidence-mode')).toContainText('Audio has not been confirmed');
 await lab.getByRole('button',{name:'Use written/transcript practice instead'}).click();
 await expect(lab.locator('.u30-evidence-mode')).toContainText('no hearing or pronunciation claim');
 const choose=lab.locator('.u30-question select');
 await choose.selectOption({index:1});
 await lab.getByRole('button',{name:'Check against authored key'}).click();
 await expect(lab.locator('.u30-feedback')).toContainText('No audio claim: text-led comprehension');
 await expect(lab.locator('.u30-feedback')).toContainText('Written support/hints were exposed');
 await expect(button).toBeDisabled();
});
test('B2 listening confirms only user-reported synthetic hearing after browser completion',async({page})=>{
 await page.addInitScript(()=>{
  class FakeUtterance{
   constructor(text){this.text=text;this.lang='';this.rate=1;this.onend=null;this.onerror=null;}
  }
  Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:FakeUtterance});
  const fake={getVoices:()=>[{lang:'fr-FR',name:'Mock browser French voice'}],
   cancel:()=>{},speak:(u)=>queueMicrotask(()=>u.onend?.())};
  Object.defineProperty(window,'speechSynthesis',{configurable:true,value:fake});
 });
 const lab=await openB2Listening(page);
 const admit=lab.getByRole('button',{name:'I heard the device audio for this question (self-report)'});
 await expect(admit).toBeDisabled();
 await lab.getByRole('button',{name:'Play selected turn'}).click();
 await expect(lab.locator('.u30-evidence-mode')).toContainText('Browser playback ended');
 await expect(admit).toBeEnabled();
 await admit.click();
 await expect(lab.locator('.u30-evidence-mode')).toContainText('Self-reported audio listening');
 const choose=lab.locator('.u30-question select');
 await choose.selectOption({index:1});
 await lab.getByRole('button',{name:'Check against authored key'}).click();
 await expect(lab.locator('.u30-feedback')).toContainText('Learner reported hearing the synthetic audio');
 await expect(lab.locator('.u30-feedback')).toContainText('actual audibility is unverified');
 await lab.getByRole('button',{name:'Next question'}).click();
 await expect(lab.getByRole('button',{name:'I heard the device audio for this question (self-report)'})).toBeDisabled();
});
test('New B2 cases have source-anchored independent seven-stage speaking rather than a generic fallback',async({page})=>{
 await page.goto('/#speak');
 const discovery=page.getByRole('region',{name:'Source-qualified original oral learning'});
 await expect(discovery).toBeVisible({timeout:45_000});
 const query=discovery.getByPlaceholder('Lesson topic or vocabulary');
 for(const [id,part] of [['transfer-151','phone policy'],['transfer-152','four-day work'],['transfer-153','repair']]){
  await query.fill(id);
  const source=discovery.getByRole('combobox',{name:'Select original French oral source'});
  await expect(source).toHaveValue(id,{timeout:25_000});
  await expect(discovery.locator('.u31-oral')).toBeVisible();
  await expect(discovery.locator('.u31-heading')).not.toContainText('General oral framework');
  await expect(discovery.locator('.u31-stage-nav button')).toHaveCount(7);
  await expect(discovery.locator('.u31-decision select option')).toHaveCount(4);
  await discovery.getByRole('button',{name:'3. Objection'}).click();
  await expect(discovery.locator('.u31-task')).toContainText('invented');
  await discovery.getByRole('button',{name:'4. Repair'}).click();
  await expect(discovery.locator('.u31-task')).toContainText('Your partner misunderstands');
 }
});
