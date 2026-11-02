import {test,expect} from '@playwright/test';

async function courseListening(page){
 await page.goto('/#course/B2/transfer-156');
 await expect(page.locator('.u6-stage-nav')).toBeVisible({timeout:45_000});
 await page.locator('.u6-stage-nav').getByRole('button',{name:'4. Listen'}).click();
 const advanced=page.locator('details.u39-context-tools').filter({has:page.getByText('Optional deeper listening interpretation and grammar')});
 await advanced.locator('summary').click();
 const lab=page.getByRole('region',{name:'Original multi-speaker listening and interpretation lab'});
 await lab.locator('.u30-disclosure > summary').click();
 const synthesis=lab.getByRole('region',{name:'Three-lesson B2 library listening and oral synthesis'});
 await expect(synthesis).toBeVisible({timeout:20_000});
 return synthesis;
}

test('U30 genuinely compares all three original library lessons, corrects unsupported choices and preserves independent French notes',async({page})=>{
 const panel=await courseListening(page);
 await expect(panel.locator('.u46-case-nav button')).toHaveCount(3);
 await expect(panel.locator('.u46-case-sources')).toContainText('4 exact dialogue turns from 3 original lessons');
 await expect(panel.locator('.u46-source-list')).toBeHidden();
 const answer=panel.getByRole('combobox',{name:'Cumulative library answer counts-and-representation'});
 await answer.selectOption({label:'The register establishes 1,200 distinct residents and 68% support among all inhabitants.'});
 await panel.getByRole('button',{name:'Check against the three original sources'}).click();
 await expect(panel.locator('.u46-choice-feedback')).toContainText('Repeat entries are possible');
 await answer.selectOption({label:'The register counts 1,200 entries; 68% describes on-site respondents, while non-users and access barriers remain under-measured.'});
 await panel.getByRole('button',{name:'Check against the three original sources'}).click();
 await expect(panel.locator('.u46-choice-feedback')).toContainText('Source-supported');
 await panel.getByRole('button',{name:'Reveal original French turns'}).click();
 await expect(panel.locator('.u46-source-card')).toHaveCount(4);
 await expect(panel.locator('.u46-source-list')).toContainText('transfer-154');
 await expect(panel.locator('.u46-source-list')).toContainText('transfer-155');
 await expect(panel.locator('.u46-source-list')).toContainText('transfer-156');
 await expect(panel.locator('.u46-status')).toContainText('transcript visible');
 const notes=panel.getByRole('textbox',{name:'Cumulative French oral synthesis notes'});
 await notes.fill('Hugo distingue les entrées des personnes. Maya rappelle les non-usagers.');
 await panel.locator('.u46-case-nav').getByRole('button',{name:/2 · From consultation/}).click();
 await expect(panel.locator('.u46-case-sources')).toContainText('5 exact dialogue turns');
 await panel.locator('.u46-case-nav').getByRole('button',{name:/1 · Evidence/}).click();
 await expect(panel.getByRole('textbox',{name:'Cumulative French oral synthesis notes'})).toHaveValue('Hugo distingue les entrées des personnes. Maya rappelle les non-usagers.');
 await panel.locator('.u46-case-nav').getByRole('button',{name:/3 · Conditional/}).click();
 await expect(panel.locator('.u46-french')).toContainText('Prononcez une synthèse publique');
 await expect(panel.locator('.u46-oral-model')).toBeHidden();
 await panel.getByRole('button',{name:'Reveal authored French model'}).click();
 await expect(panel.locator('.u46-oral-model')).toContainText('Une ouverture permanente nécessitera une autre décision publique');
 await expect(panel.locator('.u46-oral-model')).toContainText('not automatic feedback');
});

test('U31 native independent speak carries source-backed cumulative oral synthesis and private exit guard',async({page})=>{
 await page.goto('/#speak');
 const source=page.getByRole('region',{name:'Source-qualified original oral learning'});
 await expect(source).toBeVisible({timeout:45_000});
 await source.getByPlaceholder('Lesson topic or vocabulary').fill('transfer-156');
 await expect(source.getByRole('combobox',{name:'Select original French oral source'})).toHaveValue('transfer-156');
 const panel=source.getByRole('region',{name:'Three-lesson B2 library listening and oral synthesis'});
 await expect(panel).toBeVisible();
 await expect(source.locator('.u31-stage-nav button')).toHaveCount(7);
 await expect(panel.locator('.u46-oral-criteria li')).toHaveCount(4);
 await panel.getByRole('textbox',{name:'Cumulative French oral synthesis notes'}).fill('Selon les sources, le vote reste conditionnel.');
 await expect(source.locator('.u31-oral')).toHaveAttribute('data-has-private-draft','true');
 await panel.getByRole('button',{name:'I rehearsed aloud (self-report only)'}).click();
 await expect(panel.locator('.u46-oral-status')).toContainText('No speech, pronunciation, fluency or CEFR grade was recorded');
});

test('Cancelled cross-lesson TTS never turns a stale browser onend into evidence of listening',async({page})=>{
 await page.addInitScript(()=>{
  window.__libraryUtterances=[];
  class FakeUtterance{constructor(text){this.text=text;this.lang='';this.rate=1;this.onend=null;this.onerror=null;}}
  Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:FakeUtterance});
  Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{
   getVoices:()=>[{lang:'fr-FR',name:'Mock French voice'}],cancel:()=>{},
   speak:u=>window.__libraryUtterances.push(u)
  }});
 });
 const panel=await courseListening(page);
 await panel.getByRole('button',{name:'Play attributed French source turns (synthetic TTS)'}).click();
 await expect.poll(()=>page.evaluate(()=>window.__libraryUtterances.length)).toBe(4);
 await panel.getByRole('button',{name:'Stop synthetic reading'}).click();
 await page.evaluate(()=>window.__libraryUtterances.at(-1)?.onend?.());
 await expect(panel.locator('.u46-status')).toContainText('Playback stopped');
 await expect(panel.locator('.u46-status')).not.toContainText('playback ended');
 await panel.locator('.u46-case-nav').getByRole('button',{name:/3 · Conditional/}).click();
 await page.evaluate(()=>window.__libraryUtterances.at(-1)?.onend?.());
 await expect(panel.locator('.u46-status')).toContainText('Original transcript hidden');
 await expect(panel.locator('.u46-oral-status')).not.toContainText('speech');
});
