import {test,expect} from '@playwright/test';

async function deliberation(page,id){
 await page.goto('/#course/B2/'+id);
 await expect(page.locator('.u6-stage-nav')).toBeVisible({timeout:45_000});
 await page.locator('.u6-stage-nav').getByRole('button',{name:'4. Listen'}).click();
 const advanced=page.locator('details.u39-context-tools')
  .filter({has:page.getByText('Optional deeper listening interpretation and grammar')});
 await advanced.locator('summary').click();
 const lab=page.getByRole('region',{name:'Original multi-speaker listening and interpretation lab'});
 await lab.locator('.u30-disclosure > summary').click();
 await lab.getByRole('button',{name:/Interpret what was said/}).click();
 for(let i=0;i<4;i++)await lab.getByRole('button',{name:'Next question'}).click();
 await expect(lab.locator('.u30-source')).toContainText('compare original spoken turns');
 await expect(lab.getByRole('button',{name:'Replay all three original turns (synthetic French TTS)'})).toBeVisible();
 return lab;
}
const variants=[
 {id:'transfer-151',wrong:'La majorité de tous les élèves a officiellement voté une interdiction définitive.',correction:'Marc ne connaît pas le nombre des répondants',model:'Marc signale que 72 % des répondants'},
 {id:'transfer-152',wrong:'Les 8 % supplémentaires prouvent une amélioration égale pour tous les métiers.',correction:'Aïcha souligne les corrections',model:'Thomas annonce une hausse de 8 %'},
 {id:'transfer-153',wrong:'Les 25 % garantissent les mêmes économies pour la résidence; la sécurité alimentaire peut attendre quinze jours.',correction:'Sofia précise que l’usage réel n’a pas été mesuré',model:'Amine cite un fabricant'}
];
for(const v of variants){
 test('Three-voice '+v.id+' gives French source correction, private independent oral response and authored comparison',async({page})=>{
  const lab=await deliberation(page,v.id);
  const pick=lab.locator('.u30-question select').first();
  await expect(lab.locator('.u30-excerpt')).toBeHidden();
  await pick.selectOption({label:v.wrong});
  await lab.getByRole('button',{name:'Check against authored key'}).click();
  await expect(lab.locator('.u30-feedback')).toContainText(v.correction);
  await expect(lab.locator('.u30-feedback')).toContainText('No audio claim: text-led comprehension');
  const response=lab.locator('.u45-oral-transfer');
  await expect(response).toBeVisible();
  await expect(response.locator('.u45-oral-criteria li')).toHaveCount(4);
  await expect(response.locator('.u47-oral-challenge')).toBeVisible();
  await expect(response.locator('.u47-model')).toBeHidden();
  const draft=response.getByRole('textbox',{name:'Private French deliberation rehearsal'});
  const text='Je comprends votre objection, mais les sources montrent une limite importante. Il faut vérifier les conditions.';
  await draft.fill(text);
  await lab.getByRole('button',{name:'Next question'}).click();
  await lab.getByRole('button',{name:'Previous question'}).click();
  await expect(lab.locator('.u45-oral-transfer').getByRole('textbox',{name:'Private French deliberation rehearsal'})).toHaveValue(text);
  await response.getByRole('button',{name:'Reveal authored French response'}).click();
  await expect(response.locator('.u47-model')).toContainText(v.model);
  await expect(response.locator('.u47-model')).toContainText('not a transcription or grade');
  await lab.getByRole('button',{name:'Reveal all three original French turns'}).click();
  await expect(lab.locator('.u30-excerpt')).toBeVisible();
  const excerpt=await lab.locator('.u30-excerpt').innerText();
  expect((excerpt.match(/Turn \d+ ·/g)||[]).length).toBe(3);
  await expect(lab.locator('.u30-support-state')).toContainText('transcript-assisted');
 });
}
test('Three-turn TTS reports only browser completion and ignores stale completion after stopping',async({page})=>{
 await page.addInitScript(()=>{
  window.__b2DeliberationUtterances=[];
  class FakeUtterance{constructor(text){this.text=text;this.lang='';this.rate=1;this.onend=null;this.onerror=null;}}
  Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:FakeUtterance});
  Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{
   getVoices:()=>[{lang:'fr-FR',name:'Mock French voice'}],
   cancel:()=>{},speak:u=>window.__b2DeliberationUtterances.push(u)
  }});
 });
 const lab=await deliberation(page,'transfer-151');
 const play=lab.getByRole('button',{name:'Replay all three original turns (synthetic French TTS)'});
 const confirm=lab.getByRole('button',{name:'I heard the device audio for this question (self-report)'});
 await expect(confirm).toBeDisabled();
 await play.click();
 await expect.poll(()=>page.evaluate(()=>window.__b2DeliberationUtterances.length)).toBe(3);
 await page.evaluate(()=>window.__b2DeliberationUtterances.at(-1)?.onend?.());
 await expect(confirm).toBeEnabled();
 await expect(lab.locator('.u30-evidence-mode')).toContainText('Browser playback ended');
 await lab.getByRole('button',{name:'Stop audio'}).click();
 await page.evaluate(()=>window.__b2DeliberationUtterances.at(-1)?.onend?.());
 await expect(lab.locator('.u30-status')).toContainText('Playback stopped');
 await lab.getByRole('button',{name:'Next question'}).click();
 await expect(lab.locator('.u30-evidence-mode')).toContainText('Audio has not been confirmed');
 await expect(lab.getByRole('button',{name:'I heard the device audio for this question (self-report)'})).toBeDisabled();
});
