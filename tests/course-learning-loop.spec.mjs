import {test,expect} from '@playwright/test';

// Real authored A1-01 recall questions. Never infer proficiency from these
// checks or write exercise correctness into native learner state.
async function openRecall(page){
 await page.goto('/#course/A1/a1-01');
 await expect(page.locator('[data-u6-stage="understand"]')).toBeVisible({timeout:45_000});
 await page.locator('.u6-stage-nav').getByRole('button',{name:'5. Recall'}).click();
 await expect(page.locator('[data-u6-stage="practice"]')).toBeVisible();
}
async function firstQuestion(page,value){
 const active=page.locator('.u6-active-task');
 await expect(active.getByRole('heading',{name:/Which greeting is suited/})).toBeVisible();
 await active.getByRole('combobox',{name:'Answer question 1'}).selectOption(value);
 await active.getByRole('button',{name:'Check answer'}).click();
}
async function nativeCounts(page){
 return page.evaluate(async()=>new Promise((resolve,reject)=>{
  const open=indexedDB.open('thiepn-french-vnext',5);
  open.onerror=()=>reject(open.error);
  open.onsuccess=()=>{
   const db=open.result,tx=db.transaction(['srs','activity'],'readonly');
   const s=tx.objectStore('srs').count(),a=tx.objectStore('activity').count();
   tx.oncomplete=()=>{db.close();resolve([s.result,a.result])};
   tx.onerror=()=>reject(tx.error);
  };
 }));
}

test('Course recall distinguishes missed-first from eventual correctness and retakes only weak tasks',async({page})=>{
 await openRecall(page);
 const before=await nativeCounts(page);
 await firstQuestion(page,'Salut, madame.');
 await expect(page.locator('.u6-practice-status')).toContainText('Independent first tries: 0/10');
 await expect(page.locator('.u6-practice-status')).toContainText('Needed repair or model: 1');
 await firstQuestion(page,'Bonjour, madame.');
 await expect(page.locator('.u6-practice-status')).toContainText('Correct now: 1/10');
 await expect(page.locator('.u6-practice-status')).toContainText('Independent first tries: 0/10');
 await page.getByRole('button',{name:'Retry missed or assisted questions'}).click();
 await expect(page.locator('.u6-practice-status')).toContainText('Correct now: 0/10');
 await expect(page.locator('.u6-active-task').getByRole('combobox',{name:'Answer question 1'})).toHaveValue('');
 await firstQuestion(page,'Bonjour, madame.');
 await expect(page.locator('.u6-practice-status')).toContainText('Independent first tries: 0/10');
 await expect(page.locator('.u6-practice-status')).toContainText('Correct now: 1/10');
 expect(await nativeCounts(page)).toEqual(before);
});

test('Course worked answer makes later correctness assisted, clearing exercise answers resets temporary metrics',async({page})=>{
 await openRecall(page);
 const active=page.locator('.u6-active-task');
 await active.getByRole('button',{name:'Show worked answer (assisted)'}).click();
 await expect(active).toContainText('not an independent first attempt');
 await firstQuestion(page,'Bonjour, madame.');
 await expect(page.locator('.u6-practice-status')).toContainText('Independent first tries: 0/10');
 await expect(page.locator('.u6-practice-status')).toContainText('Needed repair or model: 1');
 await page.getByRole('button',{name:/Clear this lesson.s temporary answers/}).click();
 await expect(page.locator('.u6-practice-status')).toContainText('Correct now: 0/10');
 await expect(page.locator('.u6-practice-status')).toContainText('Needed repair or model: 0');
 await firstQuestion(page,'Bonjour, madame.');
 await expect(page.locator('.u6-practice-status')).toContainText('Independent first tries: 1/10');
 await expect(page.getByRole('button',{name:'Retry missed or assisted questions'})).toBeHidden();
});

test('Course independent recall evidence stays in page memory and is not presented as durable mastery',async({page})=>{
 await openRecall(page);
 await firstQuestion(page,'Bonjour, madame.');
 await expect(page.locator('.u6-practice-status')).toContainText('Independent first tries: 1/10');
 await page.reload();
 await expect(page.locator('.u6-stage-nav').getByRole('button',{name:'5. Recall'})).toBeVisible({timeout:45_000});
 await page.locator('.u6-stage-nav').getByRole('button',{name:'5. Recall'}).click();
 await expect(page.locator('.u6-practice-status')).toContainText('Independent first tries: 0/10');
 await expect(page.locator('.u6-practice-status')).toContainText('Correct now: 0/10');
});

async function studyMarkers(page){
 return page.evaluate(async()=>new Promise((resolve,reject)=>{
  const req=indexedDB.open('thiepn-french-vnext',5);
  req.onerror=()=>reject(req.error);
  req.onsuccess=()=>{
   const db=req.result,tx=db.transaction('learner','readonly');
   const row=tx.objectStore('learner').get('state-v1');
   row.onsuccess=()=>resolve(row.result?.featureState?.vU41OriginalCourseStudy??null);
   row.onerror=()=>reject(row.error);
   tx.oncomplete=()=>db.close();
  };
 }));
}
async function openWriting(page){
 await page.goto('/#course/A1/a1-01');
 await expect(page.locator('.u6-stage-nav')).toBeVisible({timeout:45_000});
 // Existing canonical navigation may already point at Write in a second tab.
 if(await page.locator('[data-u6-stage="write"]').count()===0)
  await page.locator('.u6-stage-nav').getByRole('button',{name:'6. Write'}).click();
 await expect(page.locator('[data-u6-stage="write"]')).toBeVisible();
 const marker=page.getByRole('region',{name:'Your lesson study marker'});
 await expect(marker).toBeVisible();
 return marker;
}
test('Opt-in studied marker survives reload without native SRS writes or false CEFR evidence',async({page})=>{
 const marker=await openWriting(page);
 const before=await nativeCounts(page);
 expect(await studyMarkers(page)).toBeNull();
 await marker.getByRole('button',{name:'Mark this lesson studied'}).click();
 await expect(marker).toContainText('1/247 lessons you marked studied');
 await expect(marker.getByRole('button',{name:'Remove studied marker'})).toBeVisible();
 const state=await studyMarkers(page);
 expect(state.schema).toBe('original-course-studied-v1');
 expect(state.studied).toHaveLength(1);
 expect(state.studied[0].id).toBe('a1-01');
 expect(state.studied[0].qualifiedId).toContain(':session:');
 expect(JSON.stringify(state)).not.toContain('Bonjour,');
 expect(await nativeCounts(page)).toEqual(before);
 await page.reload();
 await expect(page.locator('.u6-stage-nav').getByRole('button',{name:'6. Write'})).toBeVisible({timeout:45_000});
 await page.locator('.u6-stage-nav').getByRole('button',{name:'6. Write'}).click();
 const again=page.getByRole('region',{name:'Your lesson study marker'});
 await expect(again.getByRole('button',{name:'Remove studied marker'})).toBeVisible();
 await again.getByRole('button',{name:'Remove studied marker'}).click();
 await expect(again).toContainText('0/247 lessons you marked studied');
 expect((await studyMarkers(page)).studied).toHaveLength(0);
 expect(await nativeCounts(page)).toEqual(before);
});

test('Two tabs cannot overwrite a newer explicit studied marker without refreshing owner state',async({page,context})=>{
 const first=await openWriting(page);
 const secondPage=await context.newPage();
 const second=await openWriting(secondPage);
 await expect(second.getByRole('button',{name:'Mark this lesson studied'})).toBeVisible();
 await first.getByRole('button',{name:'Mark this lesson studied'}).click();
 await expect(first).toContainText('1/247 lessons you marked studied');
 await second.getByRole('button',{name:'Mark this lesson studied'}).click();
 await expect(second).toContainText('Another tab or account update changed your markers');
 await expect(second.getByRole('button',{name:'Refresh studied-marker review'})).toBeVisible();
 await expect(second.getByRole('button',{name:'Mark this lesson studied'})).toHaveCount(0);
 expect((await studyMarkers(secondPage)).studied).toHaveLength(1);
 await second.getByRole('button',{name:'Refresh studied-marker review'}).click();
 await expect(second.getByRole('button',{name:'Remove studied marker'})).toBeVisible();
 await secondPage.close();
});

test('B2 extension opens actual original sources and six-stage progression instead of a placeholder',async({page})=>{
 await page.goto('/#course/B2/transfer-151');
 await expect(page.locator('[data-u6-stage="understand"]')).toBeVisible({timeout:45_000});
 await expect(page.locator('.u6-unit-header h3')).toContainText('Interdire les téléphones');
 const original=page.locator('.u6-unit-header h3');
 await page.locator('.course-directory-trigger').click();
 await expect(page.locator('.cur02-level-lesson-list button')).toHaveCount(63);
 await page.keyboard.press('Escape');
 await page.locator('.u6-stage-nav').getByRole('button',{name:'3. Read'}).click();
 await expect(page.locator('[data-u6-stage="dialogue"] .u6-dialogue-turn')).toHaveCount(9);
 await expect(original).toContainText('Interdire les téléphones');
 await page.locator('.u6-stage-nav').getByRole('button',{name:'5. Recall'}).click();
 await expect(page.locator('.u6-active-task')).toContainText('Question 1 of 10');
 await page.locator('.u6-stage-nav').getByRole('button',{name:'6. Write'}).click();
 await expect(page.locator('select[aria-label="Choose evidence-to-writing transfer mode"] option[value="fromSources"]')).toHaveText('Compare two source documents');
 await expect(page.locator('.u6-stage-body')).toContainText('Compare the two fictional sources');
 await expect(page.locator('.u6-stage-body')).toContainText('Independent writing');
 await expect(page.locator('.u6-stage-body')).toContainText('Your lesson progress');
 await expect(page.getByRole('button',{name:/Continue to.*quatre jours/i})).toBeVisible();
});
test('B2 extension retains all three connected reading documents and distinct source handoffs',async({page})=>{
 for(const [id,heading] of [
  ['transfer-151','Interdire les téléphones'],
  ['transfer-152','La semaine de quatre jours'],
  ['transfer-153','Réparer ou remplacer']
 ]){
  await page.goto('/#course/B2/'+id);
  await expect(page.locator('.u6-unit-header h3')).toContainText(heading,{timeout:45_000});
  await expect(page.locator('[data-u6-stage="understand"]')).toBeVisible();
  await page.locator('.u6-stage-nav').getByRole('button',{name:'3. Read'}).click();
  await expect(page.locator('.u6-dialogue-turn')).toHaveCount(9);
  await expect(page.getByRole('button',{name:'Continue this lesson in native Read'})).toBeVisible();
  await page.getByRole('button',{name:'Continue this lesson in native Read'}).click();
  await expect(page).toHaveURL(/#read$/);
  await expect(page.locator('.u22-source-paragraph')).toHaveCount(3,{timeout:30_000});
  await expect(page.locator('.u22-source-document')).toHaveCount(2);
  await expect(page.locator('.u22-source-question')).toHaveCount(5);
  await expect(page.locator('.u22-source-note').filter({hasText:id}).first()).toBeVisible();
 }
});

test('B2 source writing displays both actual documents, honest length and preserves separate draft modes',async({page})=>{
 await page.goto('/#course/B2/transfer-151');
 await expect(page.locator('.u6-stage-nav')).toBeVisible({timeout:45_000});
 await page.locator('.u6-stage-nav').getByRole('button',{name:'6. Write'}).click();
 const body=page.locator('[data-u6-stage="write"]');
 const editor=body.getByRole('textbox',{name:'Independent original French writing response'});
 await expect(body.locator('.u43-original-source-document')).toHaveCount(2);
 await expect(body.locator('.u43-original-source-document').first()).toContainText('questionnaire');
 await expect(body.locator('.u43-original-source-document').last()).toContainText('classroom');
 await expect(body.locator('.u43-writing-word-count')).toContainText('target 170–220');
 await expect(body.locator('.u6-model')).toBeHidden();
 await editor.fill('Le questionnaire décrit les répondants et ne prouve pas une cause.');
 await expect(body.locator('.u43-writing-word-count')).toContainText('Below the authored range');
 await body.getByRole('button',{name:'Review supporting sources'}).click();
 await expect(body.locator('.u43-source-details')).toHaveAttribute('open','');
 await expect(editor).toHaveValue('Le questionnaire décrit les répondants et ne prouve pas une cause.');
 const mode=body.getByRole('combobox',{name:'Choose evidence-to-writing transfer mode'});
 await mode.selectOption('fromListening');
 await expect(body.locator('.u43-original-source-document')).toHaveCount(0);
 await expect(body).toContainText('Written source documents are not audio evidence');
 await expect(body.locator('.u43-writing-word-count')).toContainText('target 150–200');
 await mode.selectOption('fromSources');
 await expect(editor).toHaveValue('Le questionnaire décrit les répondants et ne prouve pas une cause.');
 await expect(body.locator('.u43-original-source-document')).toHaveCount(2);
});
test('Native Write handoff offers source-backed B2 drafting without grading or source duplication',async({page})=>{
 await page.goto('/#course/B2/transfer-153');
 await expect(page.locator('.u6-stage-nav')).toBeVisible({timeout:45_000});
 await page.locator('.course-lesson-references summary').first().click();
 await page.getByRole('navigation',{name:'Open this lesson in another workspace'}).getByRole('button',{name:'Open Write'}).click();
 await expect(page).toHaveURL(/#write$/);
 const panel=page.locator('.u22-source-panel');
 await expect(panel).toBeVisible();
 await panel.getByRole('button',{name:'Source comparison'}).click();
 const source=panel.locator('.u22-source-content');
 await expect(source.locator('.u43-original-source-document')).toHaveCount(2);
 await expect(source.locator('.u43-original-source-document').first()).toContainText('technician');
 await expect(source.locator('.u43-writing-word-count')).toContainText('target 170–220');
 const editor=source.getByRole('textbox',{name:'Write your own answer in French'});
 await editor.fill('Le devis reste provisoire et la consommation réelle est inconnue.');
 await expect(source.locator('.u43-writing-word-count')).toContainText('Below the authored range');
 await expect(source.locator('article.u22-source-document')).toBeHidden();
 await panel.getByRole('button',{name:'Debate response'}).click();
 await expect(source.locator('.u43-original-source-document')).toHaveCount(2);
 await expect(source.locator('.u43-writing-word-count')).toContainText('target 170–220');
 await panel.getByRole('button',{name:'Source comparison'}).click();
 await expect(source.getByRole('textbox',{name:'Write your own answer in French'})).toHaveValue('Le devis reste provisoire et la consommation réelle est inconnue.');
});
