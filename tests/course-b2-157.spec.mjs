import {test,expect} from '@playwright/test';

test('Original B2 lesson 157 is a real sequential course unit with advanced grammar, nine dialogue turns and ten original recall tasks',async({page})=>{
 await page.goto('/#course/B2/transfer-157');
 await expect(page.locator('[data-u6-stage="understand"]')).toBeVisible({timeout:45_000});
 await expect(page.locator('.u6-unit-header h3')).toContainText('Une ligne supprimée');
 await expect(page.locator('.u6-stage-body')).toContainText('capture');
 const heading=page.locator('.u6-unit-header h3');
 await page.locator('.course-directory-trigger').click();
 await expect(page.locator('.cur02-level-lesson-list button')).toHaveCount(67);
 await page.keyboard.press('Escape');
 await page.locator('.u6-stage-nav').getByRole('button',{name:'3. Read'}).click();
 await expect(page.locator('.u6-dialogue-turn')).toHaveCount(9);
 await expect(heading).toContainText('Une ligne supprimée');
 await page.locator('.u6-stage-nav').getByRole('button',{name:'5. Recall'}).click();
 await expect(page.locator('.u6-active-task')).toContainText('Question 1 of 10');
 await page.locator('.u6-stage-nav').getByRole('button',{name:'6. Write'}).click();
 await expect(page.locator('.u43-writing-word-count')).toContainText('target 180–230');
 await expect(page.locator('.u43-original-source-document')).toHaveCount(2);
 await expect(page.locator('.u43-original-source-document')).toContainText('municipal');
 await expect(page.locator('.u6-model')).toBeHidden();
 await expect(page.locator('.u6-stage-body')).toContainText('independent');
});

test('Original B2 157 has a long French article and two distinct written sources in native Read without inventing audio',async({page})=>{
 await page.goto('/#course/B2/transfer-157');
 await expect(page.locator('.u6-stage-nav')).toBeVisible({timeout:45_000});
 await page.locator('.u6-stage-nav').getByRole('button',{name:'3. Read'}).click();
 await page.getByRole('button',{name:'Continue this lesson in native Read'}).click();
 await expect(page).toHaveURL(/#read$/);
 const panel=page.locator('.u22-source-panel');
 await expect(panel).toBeVisible({timeout:30_000});
 await expect(panel.locator('.u22-source-paragraph')).toHaveCount(3);
 await expect(panel.locator('.u22-source-paragraph').first()).toContainText('capture d’écran');
 await expect(panel.locator('.u22-source-document')).toHaveCount(2);
 await expect(panel.locator('.u22-source-document')).toContainText('Fictional');
 await expect(panel.locator('.u22-source-question')).toHaveCount(5);
 await expect(panel.locator('.u22-source-note').filter({hasText:'transfer-157'}).first()).toBeVisible();
});

test('Original B2 157 leads to three structured, independent writing tasks with honest range and mode-specific source information',async({page})=>{
 await page.goto('/#course/B2/transfer-157');
 await expect(page.locator('.u6-stage-nav')).toBeVisible({timeout:45_000});
 await page.locator('.u6-stage-nav').getByRole('button',{name:'6. Write'}).click();
 const body=page.locator('[data-u6-stage="write"]');
 const select=body.getByRole('combobox',{name:'Choose evidence-to-writing transfer mode'});
 const input=body.getByRole('textbox',{name:'Independent original French writing response'});
 await expect(body.locator('.u43-writing-word-count')).toContainText('target 180–230');
 await expect(body.locator('.u43-original-source-document')).toHaveCount(2);
 await input.fill('Selon l’avis daté, la rumeur de fermeture définitive ne repose pas sur une décision signée. Cependant, l’accessibilité demeure incertaine.');
 await expect(body.locator('.u43-writing-word-count')).toContainText('Below the authored range');
 await select.selectOption('fromListening');
 await expect(body.locator('.u43-writing-word-count')).toContainText('target 170–220');
 await expect(body.locator('.u43-original-source-document')).toHaveCount(0);
 await expect(body).toContainText('Written source documents are not audio evidence');
 await select.selectOption('fromDebate');
 await expect(body.locator('.u43-writing-word-count')).toContainText('target 190–240');
 await select.selectOption('fromSources');
 await expect(input).toHaveValue(/Selon l’avis daté/);
 await expect(body.locator('.u43-original-source-document')).toHaveCount(2);
 await expect(body.locator('.u6-model')).toBeHidden();
});

test('Original 157 curated French oral stage corrects false permanence and preserves partial-poll plus accessibility concerns',async({page})=>{
 await page.goto('/#speak');
 const discovery=page.getByRole('region',{name:'Source-qualified original oral learning'});
 await expect(discovery).toBeVisible({timeout:45_000});
 await discovery.getByPlaceholder('Lesson topic or vocabulary').fill('transfer-157');
 await expect(discovery.getByRole('combobox',{name:'Select original French oral source'})).toHaveValue('transfer-157');
 await expect(discovery.locator('.u31-heading')).not.toContainText('General oral framework');
 await expect(discovery.locator('.u31-stage-nav button')).toHaveCount(7);
 await discovery.getByRole('button',{name:'3. Objection'}).click();
 await expect(discovery.locator('.u31-task')).toContainText('invented');
 await discovery.getByRole('button',{name:'4. Repair'}).click();
 await expect(discovery.locator('.u31-task')).toContainText('Your partner misunderstands');
 await expect(discovery.locator('.u31-decision select option')).toHaveCount(4);
 await expect(discovery.locator('.u31-cited')).toBeHidden();
 const choice=discovery.locator('.u31-decision select');
 await choice.selectOption({label:'Permanent cancellation of route T7 starting Monday.'});
 await discovery.getByRole('button',{name:'Check authored source comparison'}).click();
 await expect(discovery.locator('.u31-feedback')).toContainText('unsupported screenshot');
 await expect(discovery.locator('.u31-feedback')).toContainText('NOT an assessment');
 await discovery.getByRole('button',{name:'Reveal relevant original turn'}).click();
 await expect(discovery.locator('.u31-cited')).toContainText('Jeanne');
});
