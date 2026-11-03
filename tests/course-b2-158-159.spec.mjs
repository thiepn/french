import {test,expect} from '@playwright/test';

const cases=[
 {id:'transfer-158',title:'La carte officielle et le terrain',reading:'Quand un document récent',first:'transport-operator',second:'field observation',lexeme:'un plan actualisé',
  listening:'170–230',source:'180–240',debate:'190–250',anchor:'des barrières bloquaient cette rampe',
  wrong:'The route operator formally cancelled T7 permanently.',feedback:'not a transit-service cancellation',speaker:'Élodie'},
 {id:'transfer-159',title:'Corriger sa propre rectification',reading:'Une rectification responsable',first:'operational update',second:'independent step-free',lexeme:'un correctif daté',
  listening:'170–230',source:'190–250',debate:'200–260',anchor:'je conserve l’heure',wrong:'Delete the Thursday observation and tell readers the original evidence was fabricated.',
  feedback:'preserves the timestamp',speaker:'Malik'}
];
for(const item of cases){
 test(item.id+' is a full advanced original course unit adjacent to its chronological predecessor',async({page})=>{
  await page.goto('/#course/B2/'+item.id);
  await expect(page.locator('[data-u6-stage="understand"]')).toBeVisible({timeout:45000});
  await expect(page.locator('.u6-unit-header h3')).toContainText(item.title);
  await page.locator('.course-directory-trigger').click();
  await expect(page.locator('.cur02-level-lesson-list button')).toHaveCount(69);
  await page.keyboard.press('Escape');
  await page.locator('.u6-stage-nav').getByRole('button',{name:'2. Vocabulary'}).click();
  await expect(page.locator('.u6-stage-body')).toContainText(item.lexeme);
  await page.locator('.u6-stage-nav').getByRole('button',{name:'3. Read'}).click();
  await expect(page.locator('.u6-dialogue-turn')).toHaveCount(9);
  await page.locator('.u6-stage-nav').getByRole('button',{name:'5. Recall'}).click();
  await expect(page.locator('.u6-active-task')).toContainText('Question 1 of 10');
 });
 test(item.id+' exposes two distinct dated original records and 3 French paragraphs via native Read',async({page})=>{
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
 test(item.id+' supports source-separated, independent French writing in all three native modes without grading',async({page})=>{
  await page.goto('/#course/B2/'+item.id);
  await expect(page.locator('.u6-stage-nav')).toBeVisible({timeout:45000});
  await page.locator('.u6-stage-nav').getByRole('button',{name:'6. Write'}).click();
  const body=page.locator('[data-u6-stage="write"]'),sel=body.getByRole('combobox',{name:'Choose evidence-to-writing transfer mode'});
  const draft=body.getByRole('textbox',{name:'Independent original French writing response'});
  await expect(body.locator('.u43-original-source-document')).toHaveCount(2);
  await expect(body.locator('.u43-writing-word-count')).toContainText('target '+item.source);
  await expect(body.locator('.u6-model')).toBeHidden();
  await draft.fill('Selon la première source, un changement reste soumis à une vérification. Je conserve la chronologie dans une rectification datée.');
  await expect(body.locator('.u43-writing-word-count')).toContainText('Below the authored range');
  await sel.selectOption('fromListening');
  await expect(body.locator('.u43-original-source-document')).toHaveCount(0);
  await expect(body).toContainText('Written source documents are not audio evidence');
  await expect(body.locator('.u43-writing-word-count')).toContainText('target '+item.listening);
  await sel.selectOption('fromDebate');
  await expect(body.locator('.u43-writing-word-count')).toContainText('target '+item.debate);
  await sel.selectOption('fromSources');
  await expect(draft).toHaveValue(/Selon la première source/);
  await expect(body.locator('.u43-original-source-document')).toHaveCount(2);
 });
 test(item.id+' offers curated original U31 oral repair with sourced misconception feedback, no speech grade',async({page})=>{
  await page.goto('/#speak');
  const discovery=page.getByRole('region',{name:'Source-qualified original oral learning'});
  await expect(discovery).toBeVisible({timeout:45000});
  await discovery.getByPlaceholder('Lesson topic or vocabulary').fill(item.id);
  await expect(discovery.getByRole('combobox',{name:'Select original French oral source'})).toHaveValue(item.id);
  await expect(discovery.locator('.u31-stage-nav button')).toHaveCount(7);
  await discovery.getByRole('button',{name:'4. Repair'}).click();
  await expect(discovery.locator('.u31-task')).toContainText('Your partner misunderstands');
  await expect(discovery.locator('.u31-cited')).toBeHidden();
  const options=discovery.locator('.u31-decision select');
  await expect(options.locator('option')).toHaveCount(4);
  await options.selectOption({label:item.wrong});
  await discovery.getByRole('button',{name:'Check authored source comparison'}).click();
  await expect(discovery.locator('.u31-feedback')).toContainText(item.feedback);
  await expect(discovery.locator('.u31-feedback')).toContainText('NOT an assessment');
  await discovery.getByRole('button',{name:'Reveal relevant original turn'}).click();
  await expect(discovery.locator('.u31-cited')).toContainText(item.speaker);
 });
}
