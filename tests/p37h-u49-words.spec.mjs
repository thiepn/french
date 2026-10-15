import {test,expect} from '@playwright/test';

async function ownState(page){
 return page.evaluate(()=>new Promise((resolve,reject)=>{
  const open=indexedDB.open('thiepn-french-vnext');
  open.onerror=()=>reject(open.error);
  open.onsuccess=()=>{
   const db=open.result,tx=db.transaction(['user-content','srs','activity'],'readonly');
   let content,srs=[],events=[];
   const a=tx.objectStore('user-content').get('content-v1');
   a.onsuccess=()=>{content=a.result;};
   const b=tx.objectStore('srs').getAll();
   b.onsuccess=()=>{srs=b.result;};
   const c=tx.objectStore('activity').getAll();
   c.onsuccess=()=>{events=c.result;};
   tx.oncomplete=()=>{db.close();resolve({content,srs,events});};
   tx.onerror=()=>{db.close();reject(tx.error);};
  };
 }));
}

test('U49 personal cards create, edit, reload and enter the existing FSRS study session',async({page})=>{
 await page.goto('/#words');
 const form=page.locator('[data-card-form]');
 await expect(form).toBeVisible({timeout:45_000});
 const french='la fenêtre';
 await form.locator('[name="fr"]').fill(french);
 await form.locator('[name="en"]').fill('window');
 await form.locator('[name="exampleFr"]').fill('La fenêtre est ouverte.');
 await form.locator('[name="exampleEn"]').fill('The window is open.');
 await form.getByRole('button',{name:'Save my word'}).click();
 await expect(page.locator('[data-card-status]')).toContainText('Word saved');
 const entry=page.locator('.word-custom-item').filter({hasText:french});
 await expect(entry).toContainText('window');
 const created=await ownState(page);
 const ids=Object.keys(created.content.userCards).filter(id=>id.startsWith('user:vnext:'));
 expect(ids).toHaveLength(1);
 const id=ids[0];
 expect(created.content.userCards[id].fr).toBe(french);
 expect(created.srs.filter(row=>row.noteId===id&&row.skill==='recognition')).toHaveLength(1);
 expect(created.events.some(row=>row.noteId===id)).toBe(false); // Save is not a grade.
 await page.reload();
 await expect(page.locator('.word-custom-item').filter({hasText:french})).toBeVisible({timeout:45_000});
 await page.locator('.word-custom-item').filter({hasText:french}).getByRole('button',{name:'Edit'}).click();
 await form.locator('[name="en"]').fill('window pane');
 await form.getByRole('button',{name:'Save changes'}).click();
 await expect(page.locator('.word-custom-item').filter({hasText:french})).toContainText('window pane');
 const edited=await ownState(page);
 expect(edited.content.userCards[id].en).toBe('window pane');
 expect(edited.srs.filter(row=>row.noteId===id&&row.skill==='recognition')).toHaveLength(1);
 await page.getByRole('button',{name:'Study my words'}).click();
 await expect(page).toHaveURL(/#review$/,{timeout:45_000});
 await expect(page.locator('.review-prompt')).toContainText(french,{timeout:30_000});
 await page.getByRole('button',{name:'Show answer'}).click();
 await expect(page.locator('.review-answer')).toContainText('window pane');
 await page.getByRole('button',{name:'Good',exact:true}).click();
 await expect.poll(async()=>(await ownState(page)).events.filter(row=>row.noteId===id&&!row.practiceOnly).length).toBe(1);
});

test('U49 original corpus word opens native selected-word review without making a new user card',async({page})=>{
 await page.goto('/#words');
 const search=page.getByRole('searchbox',{name:'Search French or English'});
 await expect(search).toBeVisible({timeout:45_000});
 await search.fill('bonjour');
 const result=page.locator('.word-result').filter({hasText:/bonjour/i}).first();
 await expect(result).toBeVisible({timeout:30_000});
 await result.click();
 await expect(page.locator('.word-detail h2')).toContainText(/bonjour/i);
 await page.getByRole('button',{name:'Study this word'}).click();
 await expect(page).toHaveURL(/#review$/,{timeout:45_000});
 await expect(page.locator('.review-card')).toBeVisible({timeout:30_000});
 const state=await ownState(page);
 expect(Object.keys(state.content?.userCards??{}).filter(id=>id.startsWith('user:vnext:'))).toHaveLength(0);
});
