import {test,expect} from '@playwright/test';

async function reviewCounts(page){
 return page.evaluate(async()=>new Promise((resolve,reject)=>{
  const request=indexedDB.open('thiepn-french-vnext');
  request.onerror=()=>reject(request.error);
  request.onsuccess=()=>{
   const db=request.result,tx=db.transaction(['srs','activity'],'readonly');
   const s=tx.objectStore('srs').count(),a=tx.objectStore('activity').count();
   tx.oncomplete=()=>{db.close();resolve([s.result,a.result]);};
   tx.onerror=()=>reject(tx.error);
  };
 }));
}

test('U64 native B2 argument studio shows six authored prompts and transient observation only',async({page})=>{
 await page.goto('/#b2');
 await expect(page.getByRole('heading',{name:'Argument & Source Studio'})).toBeVisible({timeout:45_000});
 await expect(page.getByText('not a P31/P32 calibration', {exact:false})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Organisation du travail'})).toBeVisible();
 const initial=await reviewCounts(page);
 const draft=page.getByRole('textbox',{name:'B2 French draft'});
 const original='Bien que cette situation soit complexe, je recommande une décision prudente. '+
  'Par exemple, nous devons comparer les résultats. Si une solution échoue, elle doit être révisée. '+
  'Cependant, les conséquences restent importantes. En conclusion, nous proposons une expérimentation limitée.';
 await draft.fill(original);
 await page.getByRole('button',{name:'Inspect observable structure'}).click();
 await expect(page.getByRole('status').filter({hasText:'Observable structure — no grade'})).toBeVisible();
 await expect(page.locator('.b2-report')).toContainText('Detected connector families');
 await expect(page.locator('.b2-report')).toContainText('Not checked: grammatical accuracy');
 expect(await reviewCounts(page)).toEqual(initial);
 await page.getByRole('button',{name:'Task 2'}).click();
 await expect(page.getByRole('heading',{name:'Mobilité et équité'})).toBeVisible();
 await page.getByRole('button',{name:'Task 1'}).click();
 await expect(draft).toHaveValue(original);
 await page.getByRole('button',{name:'Set 2'}).click();
 await expect(page.getByRole('heading',{name:'Information contestée'})).toBeVisible();
 await page.getByRole('button',{name:'Set 3'}).click();
 await expect(page.getByRole('heading',{name:'Conflit dans une équipe'})).toBeVisible();
 await page.reload();
 await expect(page.getByRole('textbox',{name:'B2 French draft'})).toHaveValue('');
 expect(await reviewCounts(page)).toEqual(initial);
});

test('U64 P32 reading synthesis uses original P35 B2 French source, not invented text',async({page})=>{
 await page.goto('/#b2');
 await page.getByRole('button',{name:'P32 · Reading transfer'}).click();
 await expect(page.getByText(/Original P35 .* reading pack/)).toBeVisible({timeout:45_000});
 const source=page.getByLabel('Verified original B2 source text');
 await expect(source).toBeVisible();
 const content=(await source.textContent())?.trim()??'';
 expect(content.length).toBeGreaterThan(150);
 const first=content.split(/\s+/).slice(0,13).join(' ');
 await page.getByRole('textbox',{name:'B2 French draft'}).fill(first);
 await page.getByRole('button',{name:'Inspect observable structure'}).click();
 await expect(page.locator('.b2-report')).toContainText('Direct matching five-word windows');
 await expect(page.locator('.b2-report')).toContainText('cannot determine plagiarism or semantic transfer');
 await expect(page.getByText('Original comprehension questions (supported self-check)')).toBeVisible();
});

test('U64 P32 listening abstains without device speech and supports source reveal',async({page})=>{
 await page.addInitScript(()=>{
  Object.defineProperty(window,'SpeechSynthesisUtterance',{value:undefined,configurable:true});
 });
 await page.goto('/#b2');
 await page.getByRole('button',{name:'P32 · Listening transfer'}).click();
 await expect(page.getByText(/Original P35 .* reading pack/)).toBeVisible({timeout:45_000});
 await expect(page.getByRole('button',{name:'Play French source'})).toBeDisabled();
 await expect(page.getByText(/Device French speech is unavailable/)).toBeVisible();
 await expect(page.getByLabel('Verified original B2 source text')).toBeHidden();
 await page.getByRole('button',{name:'Reveal original transcript (supported)'}).click();
 await expect(page.getByLabel('Verified original B2 source text')).toBeVisible();
 await expect(page.getByText(/supported reading, not independent listening evidence/)).toBeVisible();
 await page.getByRole('textbox',{name:'B2 French draft'}).fill('Je voudrais comprendre les priorités et proposer une autre solution.');
 await page.getByRole('button',{name:'Inspect observable structure'}).click();
 await expect(page.locator('.b2-report')).toContainText('Not checked: grammatical accuracy');
});

test('U64 B2 mobile long writing remains accessible without page overflow',async({page})=>{
 await page.setViewportSize({width:390,height:840});
 await page.goto('/#learn');
 await page.locator('.learn-skill-grid').getByRole('button',{name:/B2 Studio/}).click();
 await expect(page).toHaveURL(/#b2$/);
 await expect(page.getByRole('textbox',{name:'B2 French draft'})).toBeVisible({timeout:45_000});
 await page.getByRole('textbox',{name:'B2 French draft'}).fill('Ce projet présente plusieurs avantages. '.repeat(100));
 const measures=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:innerWidth}));
 expect(measures.width).toBeLessThanOrEqual(measures.viewport+2);
 await expect(page.getByRole('button',{name:'Inspect observable structure'})).toBeVisible();
});
