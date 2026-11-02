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
 await lab.locator('.u30-disclosure > summary').click();
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

test('B2 original listening requires reconciling two attributed French turns and offers independent oral follow-up',async({page})=>{
 const lab=await openB2Listening(page);
 await lab.getByRole('button',{name:/Interpret what was said/}).click();
 await lab.getByRole('button',{name:'Next question'}).click();
 await lab.getByRole('button',{name:'Next question'}).click();
 const source=lab.locator('.u30-question');
 await expect(source.locator('.u30-source')).toContainText('compare original spoken turns 2 and 3');
 await expect(source.getByRole('button',{name:'Replay both original turns (synthetic French TTS)'})).toBeVisible();
 await expect(source.locator('.u45-oral-transfer')).toBeHidden();
 await source.getByRole('button',{name:'Reveal both original French turns'}).click();
 await expect(lab.locator('.u30-excerpt')).toContainText('Marc: Le questionnaire indique');
 await expect(lab.locator('.u30-excerpt')).toContainText('Nadia: Nous ne pouvons donc pas');
 await source.locator('select').selectOption({index:1});
 await source.getByRole('button',{name:'Check against authored key'}).click();
 await expect(source.locator('.u45-oral-transfer')).toBeVisible();
 await expect(source.locator('.u45-oral-prompt')).toContainText('les répondants et tout le lycée');
 await expect(source.locator('.u45-oral-criteria li')).toHaveCount(3);
 await expect(source.locator('.u45-oral-transfer')).toContainText('not a recorded performance');
});
test('Cancelled synthesized French replay cannot unlock an unverified listening claim after a stale onend',async({page})=>{
 await page.addInitScript(()=>{
  window.__utterances=[];
  class FakeUtterance{
   constructor(text){this.text=text;this.lang='';this.rate=1;this.onend=null;this.onerror=null;}
  }
  Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:FakeUtterance});
  Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{
   getVoices:()=>[{lang:'fr-FR',name:'Mock voice'}],
   cancel:()=>{},speak:u=>window.__utterances.push(u)
  }});
 });
 const lab=await openB2Listening(page);
 await lab.getByRole('button',{name:/Interpret what was said/}).click();
 await lab.getByRole('button',{name:'Next question'}).click();
 await lab.getByRole('button',{name:'Next question'}).click();
 await lab.getByRole('button',{name:'Replay both original turns (synthetic French TTS)'}).click();
 await expect.poll(()=>page.evaluate(()=>window.__utterances.length)).toBe(2);
 await lab.getByRole('button',{name:'Stop audio'}).click();
 await page.evaluate(()=>window.__utterances.at(-1)?.onend?.());
 const confirm=lab.getByRole('button',{name:'I heard the device audio for this question (self-report)'});
 await expect(confirm).toBeDisabled();
 await expect(lab.locator('.u30-evidence-mode')).toContainText('Audio has not been confirmed');
 await expect(lab.locator('.u30-status')).toContainText('Playback stopped; completion cannot be claimed');
});

test('B2 paired inference drafts survive question navigation and remain ungraded with authored comparison',async({page})=>{
 const lab=await openB2Listening(page);
 await lab.getByRole('button',{name:/Interpret what was said/}).click();
 await lab.getByRole('button',{name:'Next question'}).click();
 await lab.getByRole('button',{name:'Next question'}).click();
 const note=lab.getByRole('textbox',{name:'Private French two-turn inference notes'});
 const initial='Marc cite les répondants, tandis que Nadia conteste une généralisation à tout le lycée.';
 await note.fill(initial);
 await expect(lab.locator('.u46-inference-review')).toBeHidden();
 await lab.getByRole('button',{name:'Show listening hint'}).click();
 await lab.getByRole('button',{name:'Next question'}).click();
 await expect(lab.getByRole('textbox',{name:'Private French two-turn inference notes'})).toBeEmpty();
 await lab.locator('.u30-question select').selectOption({index:1});
 await lab.getByRole('button',{name:'Check against authored key'}).click();
 await expect(lab.locator('.u30-feedback')).toContainText('No audio claim: text-led comprehension');
 await expect(lab.locator('.u30-feedback')).not.toContainText('Written support/hints were exposed');
 await lab.getByRole('button',{name:'Previous question'}).click();
 await expect(lab.getByRole('textbox',{name:'Private French two-turn inference notes'})).toHaveValue(initial);
 await lab.locator('.u30-question select').selectOption({index:1});
 await lab.getByRole('button',{name:'Check against authored key'}).click();
 await expect(lab.locator('.u30-feedback')).toContainText('Written support/hints were exposed');
 await lab.getByRole('button',{name:'Compare your inference notes with authored source explanation'}).click();
 await expect(lab.locator('.u46-inference-feedback')).toContainText(initial);
 await expect(lab.locator('.u46-inference-feedback')).toContainText('not a grade for your notes');
 await expect(lab.locator('.u46-inference-feedback')).toContainText('attribute both speakers');
});
test('TTS request on one B2 question does not mislabel another question as listened',async({page})=>{
 await page.addInitScript(()=>{
  class Utterance{constructor(text){this.text=text;this.lang='';this.rate=1;}}
  Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:Utterance});
  Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{
   getVoices:()=>[{lang:'fr-FR',name:'Mock'}],cancel:()=>{},speak:()=>{}
  }});
 });
 const lab=await openB2Listening(page);
 await lab.getByRole('button',{name:'Play selected turn'}).click();
 await lab.getByRole('button',{name:'Next question'}).click();
 await lab.locator('.u30-question select').selectOption({index:1});
 await lab.getByRole('button',{name:'Check against authored key'}).click();
 await expect(lab.locator('.u30-feedback')).toContainText('No audio claim: text-led comprehension');
 await expect(lab.locator('.u30-feedback')).not.toContainText('TTS was requested');
 await lab.getByRole('button',{name:'Previous question'}).click();
 await lab.locator('.u30-question select').selectOption({index:1});
 await lab.getByRole('button',{name:'Check against authored key'}).click();
 await expect(lab.locator('.u30-feedback')).toContainText('TTS was requested for this question');
});

test('Moving to another listening question cancels stale TTS and never confirms hearing',async({page})=>{
 await page.addInitScript(()=>{
  window.__b2Utterances=[];
  class FakeUtterance{constructor(text){this.text=text;this.lang='';this.rate=1;}}
  Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:FakeUtterance});
  Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{
   getVoices:()=>[{lang:'fr-FR',name:'Mock'}],
   cancel:()=>{},speak:u=>window.__b2Utterances.push(u)
  }});
 });
 const lab=await openB2Listening(page);
 await lab.getByRole('button',{name:'Play selected turn'}).click();
 await expect.poll(()=>page.evaluate(()=>window.__b2Utterances.length)).toBe(1);
 await lab.getByRole('button',{name:'Next question'}).click();
 await page.evaluate(()=>window.__b2Utterances[0]?.onend?.());
 await expect(lab.locator('.u30-evidence-mode')).toContainText('Audio has not been confirmed');
 await expect(lab.getByRole('button',{name:'I heard the device audio for this question (self-report)'})).toBeDisabled();
 await expect(lab.locator('.u30-status')).not.toContainText('Browser reported TTS sequence ended');
});
