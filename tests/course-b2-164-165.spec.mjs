import {test,expect} from '@playwright/test';

/** Genuine Course/Read/Listen/Write/Speak browser behavior, not oral proficiency or audible TTS evidence. */
const cases=[
 {id:'transfer-164',title:'Le soir où la pluie a changé le programme',reading:'Une soirée imprévue, racontée de l’intérieur',
  first:'Fictional early draft',second:'Fictional alternative closing',lexeme:'planter le décor',
  source:'200–270',listening:'190–250',debate:'220–290',speaker:'Inès',
  wrong:'The reading had always been booked inside the arcade, and the downpour happened after the comic ending.',
  feedback:'arcade is identified only during the unexpected rain'},
 {id:'transfer-165',title:'Il ne manquait que le pain',reading:'Le repas où le mot « partager »',
  first:'Fictional original invitation',second:'Fictional workshop revision',lexeme:'l’autodérision',
  source:'200–270',listening:'190–250',debate:'230–300',speaker:'Aya',
  wrong:'It is literal evidence that no bread was brought to the dinner.',
  feedback:'literal lack-of-bread claim visibly contradicts'}
];
for(const item of cases){
 test(item.id+' opens sequential original B2 course, twelve source phrases, nine original dialogue turns and ten recall tasks',async({page})=>{
  await page.goto('/#course/B2/'+item.id);
  await expect(page.locator('[data-u6-stage="understand"]')).toBeVisible({timeout:45000});
  await expect(page.locator('.u6-unit-header h3')).toContainText(item.title);
  await page.locator('.course-directory-trigger').click();
  await expect(page.locator('.cur02-level-lesson-list button')).toHaveCount(75);
  await page.keyboard.press('Escape');
  await page.locator('.u6-stage-nav').getByRole('button',{name:'2. Vocabulary'}).click();
  await expect(page.locator('.u6-stage-body')).toContainText(item.lexeme);
  await page.locator('.u6-stage-nav').getByRole('button',{name:'3. Read'}).click();
  await expect(page.locator('.u6-dialogue-turn')).toHaveCount(9);
  await page.locator('.u6-stage-nav').getByRole('button',{name:'5. Recall'}).click();
  await expect(page.locator('.u6-active-task')).toContainText('Question 1 of 10');
 });
 test(item.id+' hands off a substantive original three-paragraph reading with two fictional storytelling drafts',async({page})=>{
  await page.goto('/#course/B2/'+item.id);
  await expect(page.locator('.u6-stage-nav')).toBeVisible({timeout:45000});
  await page.locator('.u6-stage-nav').getByRole('button',{name:'3. Read'}).click();
  await page.getByRole('button',{name:'Continue this lesson in native Read'}).click();
  await expect(page).toHaveURL(/#read$/);
  const panel=page.locator('.u22-source-panel');
  await expect(panel).toBeVisible({timeout:30000});
  await expect(panel.locator('.u22-source-paragraph')).toHaveCount(3);
  await expect(panel.locator('h3').filter({hasText:item.reading}).first()).toBeVisible();
  await expect(panel.locator('.u22-source-document')).toHaveCount(2);
  await expect(panel.locator('.u22-source-document').first()).toContainText(item.first);
  await expect(panel.locator('.u22-source-document').last()).toContainText(item.second);
  await expect(panel.locator('.u22-source-question')).toHaveCount(5);
  await expect(panel.locator('.u22-source-note').filter({hasText:item.id}).first()).toBeVisible();
 });
 test(item.id+' uses native U30 text-led listening with honest no-audio status and keyed original comprehension',async({page})=>{
  await page.goto('/#course/B2/'+item.id);
  await expect(page.locator('.u6-stage-nav')).toBeVisible({timeout:45000});
  await page.locator('.u6-stage-nav').getByRole('button',{name:'4. Listen'}).click();
  const deep=page.locator('details.u39-context-tools').filter({has:page.getByText('Optional deeper listening interpretation and grammar')});
  await deep.locator('summary').click();
  const lab=page.getByRole('region',{name:'Original multi-speaker listening and interpretation lab'});
  await expect(lab).toBeVisible();
  await lab.locator('.u30-disclosure > summary').click();
  await expect(lab.locator('.u30-question')).toBeVisible();
  const heard=lab.getByRole('button',{name:'I heard the device audio for this question (self-report)'});
  await expect(heard).toBeDisabled();
  await lab.getByRole('button',{name:'Use written/transcript practice instead'}).click();
  await expect(lab.locator('.u30-evidence-mode')).toContainText('no hearing or pronunciation claim');
  await lab.locator('.u30-question select').selectOption({index:1});
  await lab.getByRole('button',{name:'Check against authored key'}).click();
  await expect(lab.locator('.u30-feedback')).toContainText('No audio claim: text-led comprehension');
  await expect(heard).toBeDisabled();
 });
 test(item.id+' supports all three independent independent original narrative writing modes with private drafts and no semantic grade',async({page})=>{
  await page.goto('/#course/B2/'+item.id);
  await expect(page.locator('.u6-stage-nav')).toBeVisible({timeout:45000});
  await page.locator('.u6-stage-nav').getByRole('button',{name:'6. Write'}).click();
  const body=page.locator('[data-u6-stage="write"]');
  const select=body.getByRole('combobox',{name:'Choose evidence-to-writing transfer mode'});
  const answer=body.getByRole('textbox',{name:'Independent original French writing response'});
  await expect(body.locator('.u43-original-source-document')).toHaveCount(2);
  await expect(body.locator('.u43-writing-word-count')).toContainText('target '+item.source);
  await expect(body.locator('.u6-model')).toBeHidden();
  await answer.fill('Je précise mon rôle personnel, les limites du résultat et la validation encore nécessaire avant de promettre un délai.');
  await expect(body.locator('.u43-writing-word-count')).toContainText('Below the authored range');
  await select.selectOption('fromListening');
  await expect(body.locator('.u43-original-source-document')).toHaveCount(0);
  await expect(body).toContainText('Written source documents are not audio evidence');
  await expect(body.locator('.u43-writing-word-count')).toContainText('target '+item.listening);
  await select.selectOption('fromDebate');
  await expect(body.locator('.u43-writing-word-count')).toContainText('target '+item.debate);
  await select.selectOption('fromSources');
  await expect(answer).toHaveValue(/Je précise mon rôle personnel/);
  await expect(body.locator('.u43-original-source-document')).toHaveCount(2);
 });
 test(item.id+' offers a curated seven-stage U31 narrative and irony oral repair anchored to original French with no speech score',async({page})=>{
  await page.goto('/#speak');
  const discovery=page.getByRole('region',{name:'Source-qualified original oral learning'});
  await expect(discovery).toBeVisible({timeout:45000});
  await discovery.getByPlaceholder('Lesson topic or vocabulary').fill(item.id);
  await expect(discovery.getByRole('combobox',{name:'Select original French oral source'})).toHaveValue(item.id);
  await expect(discovery.locator('.u31-heading')).not.toContainText('General oral framework');
  await expect(discovery.locator('.u31-stage-nav button')).toHaveCount(7);
  await discovery.getByRole('button',{name:'4. Repair'}).click();
  await expect(discovery.locator('.u31-task')).toContainText('Your partner misunderstands');
  await expect(discovery.locator('.u31-cited')).toBeHidden();
  const choices=discovery.locator('.u31-decision select');
  await expect(choices.locator('option')).toHaveCount(4);
  await choices.selectOption({label:item.wrong});
  await discovery.getByRole('button',{name:'Check authored source comparison'}).click();
  await expect(discovery.locator('.u31-feedback')).toContainText(item.feedback);
  await expect(discovery.locator('.u31-feedback')).toContainText('NOT an assessment');
  await discovery.getByRole('button',{name:'Reveal relevant original turn'}).click();
  await expect(discovery.locator('.u31-cited')).toContainText(item.speaker);
 });
}
