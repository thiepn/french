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
