import {test,expect} from '@playwright/test';

/** Browser tests verify real original source UI, never simulated human listening or speech scores. */
const cases=[
 {id:'transfer-160',title:'Un silence mal interprété',reading:'Ce qu’un silence peut signifier',
  first:'Fictional private unsent draft',second:'Fictional personal note',lexeme:'un malentendu',
  source:'190–250',listening:'180–230',debate:'210–260',speaker:'Camille',
  wrong:'Her painful feeling proves that Samir deliberately wanted her to suffer.',feedback:'does not establish'},
 {id:'transfer-161',title:'Reprendre contact sans tout effacer',reading:'Revenir sur le passé',
  first:'Fictional private reflective note',second:'Fictional jointly approved practical task recap',lexeme:'revenir sur une conversation',
  source:'190–250',listening:'180–230',debate:'210–270',speaker:'Samir',
  wrong:'He guarantees he will attend all future exhibition openings.',feedback:'cannot promise attendance'}
];
for(const item of cases){
 test(item.id+' opens sequential original B2 course, vocabulary, nine-turn dialogue and ten independent recall tasks',async({page})=>{
  await page.goto('/#course/B2/'+item.id);
  await expect(page.locator('[data-u6-stage="understand"]')).toBeVisible({timeout:45000});
  await expect(page.locator('.u6-unit-header h3')).toContainText(item.title);
  await page.locator('.course-directory-trigger').click();
  await expect(page.locator('.cur02-level-lesson-list button')).toHaveCount(73);
  await page.keyboard.press('Escape');
  await page.locator('.u6-stage-nav').getByRole('button',{name:'2. Vocabulary'}).click();
  await expect(page.locator('.u6-stage-body')).toContainText(item.lexeme);
  await page.locator('.u6-stage-nav').getByRole('button',{name:'3. Read'}).click();
  await expect(page.locator('.u6-dialogue-turn')).toHaveCount(9);
  await page.locator('.u6-stage-nav').getByRole('button',{name:'5. Recall'}).click();
  await expect(page.locator('.u6-active-task')).toContainText('Question 1 of 10');
 });
 test(item.id+' uses private fictional perspectives and three substantial paragraphs in native Read',async({page})=>{
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
 test(item.id+' keeps native text-led listening honest about unverified French device audio',async({page})=>{
  await page.goto('/#course/B2/'+item.id);
  await expect(page.locator('.u6-stage-nav')).toBeVisible({timeout:45000});
  await page.locator('.u6-stage-nav').getByRole('button',{name:'4. Listen'}).click();
  const deep=page.locator('details.u39-context-tools').filter({has:page.getByText('Optional deeper listening interpretation and grammar')});
  await deep.locator('summary').click();
  const lab=page.getByRole('region',{name:'Original multi-speaker listening and interpretation lab'});
  await expect(lab).toBeVisible();
  await lab.locator('.u30-disclosure > summary').click();
  await expect(lab.locator('.u30-question')).toBeVisible();
  const selfReport=lab.getByRole('button',{name:'I heard the device audio for this question (self-report)'});
  await expect(selfReport).toBeDisabled();
  await lab.getByRole('button',{name:'Use written/transcript practice instead'}).click();
  await expect(lab.locator('.u30-evidence-mode')).toContainText('no hearing or pronunciation claim');
  await lab.locator('.u30-question select').selectOption({index:1});
  await lab.getByRole('button',{name:'Check against authored key'}).click();
  await expect(lab.locator('.u30-feedback')).toContainText('No audio claim: text-led comprehension');
  await expect(selfReport).toBeDisabled();
 });
 test(item.id+' offers three independent French writing modes, source boundaries, length guidance and private drafts',async({page})=>{
  await page.goto('/#course/B2/'+item.id);
  await expect(page.locator('.u6-stage-nav')).toBeVisible({timeout:45000});
  await page.locator('.u6-stage-nav').getByRole('button',{name:'6. Write'}).click();
  const body=page.locator('[data-u6-stage="write"]');
  const select=body.getByRole('combobox',{name:'Choose evidence-to-writing transfer mode'});
  const answer=body.getByRole('textbox',{name:'Independent original French writing response'});
  await expect(body.locator('.u43-original-source-document')).toHaveCount(2);
  await expect(body.locator('.u43-writing-word-count')).toContainText('target '+item.source);
  await expect(body.locator('.u6-model')).toBeHidden();
  await answer.fill('Je décris mon ressenti sans prétendre connaître les intentions de mon ami. Je propose une discussion facultative, sans exiger une justification intime.');
  await expect(body.locator('.u43-writing-word-count')).toContainText('Below the authored range');
  await select.selectOption('fromListening');
  await expect(body.locator('.u43-original-source-document')).toHaveCount(0);
  await expect(body).toContainText('Written source documents are not audio evidence');
  await expect(body.locator('.u43-writing-word-count')).toContainText('target '+item.listening);
  await select.selectOption('fromDebate');
  await expect(body.locator('.u43-writing-word-count')).toContainText('target '+item.debate);
  await select.selectOption('fromSources');
  await expect(answer).toHaveValue(/Je décris mon ressenti/);
  await expect(body.locator('.u43-original-source-document')).toHaveCount(2);
 });
 test(item.id+' has original seven-stage U31 speaking with case-specific repair and no invented speech grade',async({page})=>{
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
