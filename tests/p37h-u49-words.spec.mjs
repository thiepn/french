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

test('U49 deck ownership, filtering, renaming and deletion never erase cards or study history',async({page})=>{
 await page.goto('/#words');
 const form=page.locator('[data-card-form]');
 await expect(form).toBeVisible({timeout:45_000});
 await form.locator('[name="fr"]').fill('le jardin');
 await form.locator('[name="en"]').fill('garden');
 await form.getByRole('button',{name:'Save my word'}).click();
 await expect(page.locator('[data-card-status]')).toContainText('Word saved');
 const before=await ownState(page);
 const ids=Object.keys(before.content.userCards).filter(id=>id.startsWith('user:vnext:'));
 expect(ids).toHaveLength(1);
 await page.locator('[data-deck-title]').fill('Daily French');
 await page.locator('[data-deck-create]').click();
 await expect(page.locator('[data-deck-filter]')).toHaveValue(/deck:vnext:/);
 const deckId=await page.locator('[data-deck-filter]').inputValue();
 await page.reload();
 await expect(page.locator('[data-deck-filter] option[value="'+deckId+'"]')).toHaveCount(1,{timeout:45_000});
 const state=await ownState(page);
 expect(state.content.customDecks[deckId].title).toBe('Daily French');
 expect(state.content.customDecks[deckId].noteIds).toEqual([]);
 await page.locator('[data-deck-filter]').selectOption(deckId);
 await page.locator('[data-deck-title]').fill('Everyday life');
 await page.locator('[data-deck-rename]').click();
 await expect(page.locator('[data-deck-filter] option[value="'+deckId+'"]')).toContainText('Everyday life');
 await page.locator('[data-deck-delete]').click();
 await expect(page.locator('[data-deck-delete]')).toHaveText('Confirm delete deck');
 await page.locator('[data-deck-delete]').click();
 await expect(page.locator('[data-deck-filter] option[value="'+deckId+'"]')).toHaveCount(0);
 const after=await ownState(page);
 expect(after.content.customDecks[deckId]).toBeUndefined();
 expect(after.content.userCards[ids[0]].fr).toBe('le jardin');
 expect(after.srs.some(row=>row.noteId===ids[0])).toBe(true);
});

test('U49 bulk selection adds and removes owned words from native deck without changing SRS',async({page})=>{
 await page.goto('/#words');
 const form=page.locator('[data-card-form]');
 await expect(form).toBeVisible({timeout:45_000});
 for(const [fr,en] of [['la chaise','chair'],['la porte','door']]){
  await form.locator('[name="fr"]').fill(fr);
  await form.locator('[name="en"]').fill(en);
  await form.getByRole('button',{name:'Save my word'}).click();
  await expect(page.locator('[data-card-status]')).toContainText('Word saved');
 }
 const original=await ownState(page);
 await page.locator('[data-deck-title]').fill('Things at home');
 await page.locator('[data-deck-create]').click();
 await expect(page.locator('[data-deck-filter]')).toHaveValue(/^deck:vnext:/);
 const id=await page.locator('[data-deck-filter]').inputValue();
 await page.locator('[data-deck-filter]').selectOption('');
 await expect(page.locator('.word-custom-item')).toHaveCount(2);
 await page.locator('[data-card-select]').click();
 await expect(page.locator('.word-select-checkbox:checked')).toHaveCount(2);
 await page.locator('[data-deck-filter]').selectOption(id);
 await page.locator('[data-card-add]').click();
 await expect(page.locator('[data-card-list] .word-custom-item')).toHaveCount(2);
 let persisted=await ownState(page);
 expect(persisted.content.customDecks[id].noteIds).toHaveLength(2);
 expect(persisted.srs.length).toBe(original.srs.length);
 await page.reload();
 await page.locator('[data-deck-filter]').selectOption(id);
 await expect(page.locator('[data-card-list] .word-custom-item')).toHaveCount(2);
 await page.locator('[data-card-select]').click(); // Select both in deck
 await page.locator('[data-card-remove]').click();
 await expect(page.locator('[data-card-list] .word-custom-item')).toHaveCount(0);
 persisted=await ownState(page);
 expect(persisted.content.customDecks[id].noteIds).toHaveLength(0);
 expect(persisted.srs.length).toBe(original.srs.length);
});

test('U49 source-proven P35 deck recovers original IDs, handles missing source, preserves legacy writes and learns canonical corpus',async({page})=>{
 await page.goto('/#words');
 const form=page.locator('[data-card-form]');
 await expect(form).toBeVisible({timeout:45_000});
 await form.locator('[name="fr"]').fill('la bibliothèque');
 await form.locator('[name="en"]').fill('library');
 await form.getByRole('button',{name:'Save my word'}).click();
 await expect(page.locator('[data-card-status]')).toContainText('Word saved');
 const before=await ownState(page);
 const personalId=Object.keys(before.content.userCards).find(x=>x.startsWith('user:vnext:'));
 expect(personalId).toBeTruthy();
 const legacyId='deck-p35-owned-fixture';
 await page.evaluate(async({legacyId,personalId})=>{
  await new Promise((resolve,reject)=>{
   const request=indexedDB.open('thiepn-french-vnext');
   request.onerror=()=>reject(request.error);
   request.onsuccess=()=>{
    const db=request.result,tx=db.transaction('user-content','readwrite');
    const store=tx.objectStore('user-content'),req=store.get('content-v1');
    req.onsuccess=()=>{const current=req.result;current.customDecks[legacyId]={
      name:'P35 original list',cardIds:[personalId,'starter:bonjour'],createdAt:1700000000000
    };store.put(current,'content-v1');};
    tx.oncomplete=()=>{db.close();resolve();};
    tx.onerror=()=>{db.close();reject(tx.error);};
   };
  });
 },{legacyId,personalId});
 await page.reload();
 await expect(page.locator('[data-deck-filter] option[value="'+legacyId+'"]')).toContainText('Recovered P35',{timeout:45_000});
 await page.locator('[data-deck-filter]').selectOption(legacyId);
 await expect(page.locator('.word-custom-item')).toHaveCount(2);
 await expect(page.locator('.word-custom-item').filter({hasText:'starter:bonjour'}))
   .toContainText(/Resolved P35 starter ID|Unresolved P35 ID|Ambiguous P35 ID/);
 await page.locator('[data-deck-title]').fill('Original travel');
 await page.locator('[data-deck-rename]').click();
 await expect(page.locator('[data-deck-filter] option[value="'+legacyId+'"]')).toContainText('Original travel');
 const renamed=await ownState(page);
 expect(renamed.content.customDecks[legacyId].name).toBe('Original travel');
 expect(renamed.content.customDecks[legacyId].cardIds).toEqual([personalId,'starter:bonjour']);
 expect(renamed.srs).toEqual(before.srs);
 const search=page.getByRole('searchbox',{name:'Search French or English'});
 await search.fill('bonjour');
 await page.locator('.word-result').filter({hasText:/bonjour/i}).first().click();
 await expect(page.locator('.word-detail h2')).toContainText(/bonjour/i);
 await page.getByRole('button',{name:'Add this word to selected deck'}).click();
 await expect(page.locator('.word-detail [role="status"]')).toContainText('Canonical word added');
 const added=await ownState(page);
 const ids=added.content.customDecks[legacyId].cardIds;
 expect(ids.length).toBe(3);
 expect(ids.slice(0,2)).toEqual([personalId,'starter:bonjour']);
 expect(ids[2]).not.toBe('starter:bonjour');
 await expect(page.locator('.word-custom-item')).toHaveCount(3);
 await page.getByRole('button',{name:'Study this deck'}).click();
 await expect(page).toHaveURL(/#review$/,{timeout:45_000});
 await expect(page.locator('.review-card')).toBeVisible({timeout:30_000});
});

test('U49 bulk private theme edits existing cards without changing canonical SRS history',async({page})=>{
 await page.goto('/#words');
 const form=page.locator('[data-card-form]');
 await expect(form).toBeVisible({timeout:45_000});
 for(const [fr,en] of [['un arbre','tree'],['une fenêtre','window']]){
  await form.locator('[name="fr"]').fill(fr);await form.locator('[name="en"]').fill(en);
  await form.getByRole('button',{name:'Save my word'}).click();
  await expect(page.locator('[data-card-status]')).toContainText('Word saved');
 }
 const before=await ownState(page);
 await page.getByRole('button',{name:'Choose visible cards'}).click();
 await expect(page.locator('.word-select-checkbox:checked')).toHaveCount(2);
 await page.locator('[data-bulk-theme]').fill('Home life');
 await page.getByRole('button',{name:'Apply theme to selected'}).click();
 await expect(page.locator('[data-selection-status]')).toContainText('2 private cards updated');
 const after=await ownState(page);
 expect(after.srs).toEqual(before.srs);
 for(const id of Object.keys(after.content.userCards)){
  expect(after.content.userCards[id].theme).toBe('Home life');
 }
 await page.reload();
 await expect(page.locator('.word-custom-item').filter({hasText:'Home life'})).toHaveCount(2,{timeout:45_000});
});

test('U49 uniquely resolves source-qualified P35 starter alias without rewriting the legacy stored deck',async({page})=>{
 await page.goto('/#words');
 await expect(page.locator('[data-card-form]')).toBeVisible({timeout:45_000});
 const fixture=await page.evaluate(async()=>{
  const manifest=await fetch('/content/manifest.json').then(r=>r.json());
  const index=await fetch(manifest.indexes.vocabulary.path).then(r=>r.json());
  const count=new Map();
  for(const row of index.rows){
   const key=row.word.trim().toLocaleLowerCase('fr');
   count.set(key,(count.get(key)??0)+1);
  }
  const word=index.rows.find(row=>count.get(row.word.trim().toLocaleLowerCase('fr'))===1&&
   /^[a-zA-ZÀ-ÿ-]{3,40}$/.test(row.word)&&!row.id.startsWith('starter:'));
  if(!word)throw Error('No unique source row in pinned vocabulary search index');
  return{storedId:'starter:'+word.word,id:word.id,word:word.word};
 });
 const deckId='deck-p35-starter-fixture';
 await page.evaluate(async({deckId,storedId})=>{
  await new Promise((resolve,reject)=>{
   const req=indexedDB.open('thiepn-french-vnext');
   req.onerror=()=>reject(req.error);
   req.onsuccess=()=>{
    const db=req.result,tx=db.transaction('user-content','readwrite');
    const content=tx.objectStore('user-content'),read=content.get('content-v1');
    read.onsuccess=()=>{const row=read.result;row.customDecks[deckId]={
      name:'P35 exact starter match',cardIds:[storedId],createdAt:1700000000000
    };content.put(row,'content-v1');};
    tx.oncomplete=()=>{db.close();resolve();};
    tx.onerror=()=>{db.close();reject(tx.error);};
   };
  });
 },{deckId,storedId:fixture.storedId});
 await page.reload();
 await expect(page.locator('[data-deck-filter] option[value="'+deckId+'"]')).toHaveCount(1,{timeout:45_000});
 await page.locator('[data-deck-filter]').selectOption(deckId);
 await expect(page.locator('.word-custom-item')).toContainText('Resolved P35 starter ID');
 await expect(page.locator('.word-custom-item')).toContainText(fixture.storedId);
 const persisted=await ownState(page);
 expect(persisted.content.customDecks[deckId].cardIds).toEqual([fixture.storedId]);
 await page.getByRole('button',{name:'Study this deck'}).click();
 await expect(page).toHaveURL(/#review$/,{timeout:45_000});
 const reviewed=await ownState(page);
 expect(reviewed.content.customDecks[deckId].cardIds).toEqual([fixture.storedId]);
 expect(reviewed.srs.some(row=>row.noteId===fixture.id)).toBe(true);
 expect(reviewed.srs.some(row=>row.noteId===fixture.storedId)).toBe(false);
});

test('U49 original corpus filters and multi-select add original words to a native deck',async({page})=>{
 await page.goto('/#words');
 await expect(page.locator('[data-card-form]')).toBeVisible({timeout:45_000});
 const search=page.getByRole('searchbox',{name:'Search French or English'});
 await search.fill('bonjour');
 const result=page.locator('.word-corpus-result-row').filter({hasText:/bonjour/i}).first();
 await expect(result).toBeVisible({timeout:45_000});
 const level=await result.locator('.word-result-top span').textContent();
 if(level)await page.locator('[data-corpus-level]').selectOption(level);
 await expect(result).toBeVisible();
 await result.locator('.word-corpus-checkbox').check();
 await expect(page.locator('[data-corpus-selection]')).toContainText('1 source words selected');
 await page.locator('[data-deck-title]').fill('Corpus selection');
 await page.getByRole('button',{name:'Create deck'}).click();
 await expect(page.locator('[data-deck-filter]')).toHaveValue(/^deck:vnext:/);
 const id=await page.locator('[data-deck-filter]').inputValue();
 await page.getByRole('button',{name:'Add selected to my deck'}).click();
 await expect(page.locator('[data-corpus-selection]')).toContainText('verified corpus IDs added');
 const saved=await ownState(page);
 expect(saved.content.customDecks[id].noteIds).toHaveLength(1);
 const noteId=saved.content.customDecks[id].noteIds[0];
 expect(noteId).not.toMatch(/^starter:/);
 await page.locator('[data-deck-filter]').selectOption(id);
 await expect(page.locator('.word-custom-item')).toContainText(/bonjour/i);
 await page.reload();
 await page.locator('[data-deck-filter]').selectOption(id);
 await expect(page.locator('.word-custom-item')).toContainText(/bonjour/i);
});

test('U50 unfinished Review explicitly preserves a different requested word, deck and corpus selection',async({page})=>{
 await page.goto('/#words');
 const form=page.locator('[data-card-form]');
 await expect(form).toBeVisible({timeout:45_000});
 await form.locator('[name="fr"]').fill('un cahier');
 await form.locator('[name="en"]').fill('notebook');
 await form.getByRole('button',{name:'Save my word'}).click();
 await expect(page.locator('[data-card-status]')).toContainText('Word saved');
 await page.getByRole('button',{name:'Study my words'}).click();
 await expect(page).toHaveURL(/#review$/,{timeout:45_000});
 const snapshot=()=>page.evaluate(()=>new Promise((resolve,reject)=>{
  const req=indexedDB.open('thiepn-french-vnext');
  req.onerror=()=>reject(req.error);
  req.onsuccess=()=>{
   const db=req.result,tx=db.transaction(['session','srs','activity'],'readonly');
   const data={session:null,srs:[],activity:[]};
   tx.objectStore('session').get('active').onsuccess=e=>{data.session=e.target.result;};
   tx.objectStore('srs').getAll().onsuccess=e=>{data.srs=e.target.result;};
   tx.objectStore('activity').getAll().onsuccess=e=>{data.activity=e.target.result;};
   tx.oncomplete=()=>{db.close();resolve(data);};
   tx.onerror=()=>{db.close();reject(tx.error);};
  };
 }));
 const before=await snapshot();
 expect(before.session.queueIds.length).toBeGreaterThan(0);
 await page.goto('/#words');
 await expect(page.locator('[data-card-form]')).toBeVisible({timeout:45_000});
 await page.getByRole('button',{name:'Study my words'}).click();
 await expect(page).toHaveURL(/#words$/);
 await expect(page.locator('[data-card-status]')).toContainText('unfinished Review session');
 await expect(page.locator('[data-card-status]')).toContainText('not scheduled');
 const search=page.getByRole('searchbox',{name:'Search French or English'});
 await search.fill('bonjour');
 await page.locator('.word-result').filter({hasText:/bonjour/i}).first().click();
 await expect(page.locator('.word-detail h2')).toContainText(/bonjour/i);
 await page.getByRole('button',{name:'Study this word'}).click();
 await expect(page.locator('.word-detail [role="status"]')).toContainText('unfinished Review session');
 await expect(page).toHaveURL(/#words$/);
 await page.locator('.word-corpus-result-row').filter({hasText:/bonjour/i}).first().locator('.word-corpus-checkbox').check();
 await page.getByRole('button',{name:'Study selected words'}).click();
 await expect(page.locator('[data-corpus-selection]')).toContainText('unfinished Review session');
 await page.locator('[data-deck-title]').fill('Other selection');
 await page.getByRole('button',{name:'Create deck'}).click();
 await expect(page.locator('[data-deck-filter]')).toHaveValue(/^deck:vnext:/);
 const deckId=await page.locator('[data-deck-filter]').inputValue();
 await page.locator('[data-deck-filter]').selectOption('');
 await page.getByRole('button',{name:'Choose visible cards'}).click();
 await page.locator('[data-deck-filter]').selectOption(deckId);
 await page.getByRole('button',{name:'Add selected to deck'}).click();
 await expect(page.locator('[data-card-list] .word-custom-item')).toHaveCount(1);
 await page.getByRole('button',{name:'Study this deck'}).click();
 await expect(page.locator('[data-selection-status]')).toContainText('unfinished Review session');
 await expect(page).toHaveURL(/#words$/);
 expect(await snapshot()).toEqual(before);
 await page.locator('[data-selection-status] + [data-resume-saved-review]').click();
 await expect(page).toHaveURL(/#review$/,{timeout:45_000});
 await expect(page.locator('.review-prompt')).toContainText('un cahier',{timeout:30_000});
 expect(await snapshot()).toEqual(before);
});

test('U51 atomic two-tab corpus study: one winner, no abandoned SRS or overwritten session',async({context,page})=>{
 const other=await context.newPage();
 try{
  for(const [tab,term] of [[page,'bonjour'],[other,'merci']]){
   await tab.goto('/#words');
   await expect(tab.locator('[data-card-form]')).toBeVisible({timeout:45_000});
   const search=tab.getByRole('searchbox',{name:'Search French or English'});
   await search.fill(term);
   const row=tab.locator('.word-corpus-result-row').filter({hasText:new RegExp(term,'i')}).first();
   await expect(row).toBeVisible({timeout:45_000});
   await row.locator('.word-corpus-checkbox').check();
   await expect(tab.locator('[data-corpus-selection]')).toContainText('1 source words selected');
  }
  // Both tabs share IndexedDB but request different words at the same time.
  await Promise.all([
   page.getByRole('button',{name:'Study selected words'}).click(),
   other.getByRole('button',{name:'Study selected words'}).click()
  ]);
  await expect.poll(async()=>{
   const a=page.url().endsWith('#review'),b=other.url().endsWith('#review');
   return Number(a)+Number(b);
  },{timeout:45_000}).toBe(1);
  const winner=page.url().endsWith('#review')?page:other;
  const loser=winner===page?other:page;
  await expect(loser.locator('[data-corpus-selection]')).toContainText('unfinished Review session');
  const before=await winner.evaluate(()=>new Promise((resolve,reject)=>{
   const req=indexedDB.open('thiepn-french-vnext');
   req.onerror=()=>reject(req.error);
   req.onsuccess=()=>{
    const db=req.result,tx=db.transaction(['session','srs','activity'],'readonly');
    const state={session:null,srs:[],activity:[]};
    tx.objectStore('session').get('active').onsuccess=e=>{state.session=e.target.result;};
    tx.objectStore('srs').getAll().onsuccess=e=>{state.srs=e.target.result;};
    tx.objectStore('activity').getAll().onsuccess=e=>{state.activity=e.target.result;};
    tx.oncomplete=()=>{db.close();resolve(state);};
    tx.onerror=()=>{db.close();reject(tx.error);};
   };
  }));
  expect(before.session.queueIds).toHaveLength(1);
  expect(before.srs.map(row=>row.id)).toEqual(before.session.queueIds);
  expect(before.activity).toEqual([]);
  await loser.locator('[data-corpus-selection] + [data-resume-saved-review]').click();
  await expect(loser).toHaveURL(/#review$/,{timeout:45_000});
  await expect(loser.locator('.review-card')).toBeVisible({timeout:30_000});
  const after=await loser.evaluate(()=>new Promise((resolve,reject)=>{
   const req=indexedDB.open('thiepn-french-vnext');
   req.onerror=()=>reject(req.error);
   req.onsuccess=()=>{
    const db=req.result,tx=db.transaction(['session','srs','activity'],'readonly');
    const state={session:null,srs:[],activity:[]};
    tx.objectStore('session').get('active').onsuccess=e=>{state.session=e.target.result;};
    tx.objectStore('srs').getAll().onsuccess=e=>{state.srs=e.target.result;};
    tx.objectStore('activity').getAll().onsuccess=e=>{state.activity=e.target.result;};
    tx.oncomplete=()=>{db.close();resolve(state);};
    tx.onerror=()=>{db.close();reject(tx.error);};
   };
  }));
  expect(after).toEqual(before);
 }finally{await other.close();}
});

async function studySnapshot(page){
 return page.evaluate(()=>new Promise((resolve,reject)=>{
  const open=indexedDB.open('thiepn-french-vnext');
  open.onerror=()=>reject(open.error);
  open.onsuccess=()=>{
   const db=open.result,tx=db.transaction(['session','srs','activity','learner','meta'],'readonly');
   const state={session:null,srs:[],events:[],learner:null,summary:null};
   const fetch=(store,key,method='get')=>{
    const request=method==='getAll'?tx.objectStore(store).getAll():tx.objectStore(store).get(key);
    request.onsuccess=()=>{state[key==='active'?'session':key==='state-v1'?'learner':key==='learner-summary'?'summary':store==='activity'?'events':'srs']=request.result;};
   };
   fetch('session','active');fetch('srs','srs','getAll');fetch('activity','activity','getAll');
   fetch('learner','state-v1');fetch('meta','learner-summary');
   tx.oncomplete=()=>{db.close();resolve(state);};
   tx.onerror=()=>{db.close();reject(tx.error);};
  };
 }));
}

test('U52 two tabs grading and undoing the same review cannot double-apply learner evidence',async({context,page})=>{
 const other=await context.newPage();
 try{
  await page.goto('/#words');
  const form=page.locator('[data-card-form]');
  await expect(form).toBeVisible({timeout:45_000});
  for(const [fr,en] of [['un cahier','notebook'],['une maison','house']]){
   await form.locator('[name="fr"]').fill(fr);
   await form.locator('[name="en"]').fill(en);
   await form.getByRole('button',{name:'Save my word'}).click();
   await expect(page.locator('[data-card-status]')).toContainText('Word saved');
  }
  await page.getByRole('button',{name:'Study my words'}).click();
  await expect(page).toHaveURL(/#review$/,{timeout:45_000});
  await other.goto('/#review');
  for(const tab of [page,other]){
   await expect(tab.locator('.review-prompt')).toBeVisible({timeout:30_000});
   await tab.getByRole('button',{name:'Show answer'}).click();
   await expect(tab.locator('.review-answer')).toBeVisible();
  }
  const original=await studySnapshot(page);
  expect(original.session.queueIds).toHaveLength(2);
  await Promise.all([page.getByRole('button',{name:'Good',exact:true}).click(),
    other.getByRole('button',{name:'Good',exact:true}).click()]);
  await expect.poll(async()=>(await studySnapshot(page)).events.length,{timeout:30_000}).toBe(1);
  const graded=await studySnapshot(page);
  expect(graded.session.stats.reviewed).toBe(1);
  expect(graded.session.cursor).toBe(1);
  expect(graded.learner.profile.lifetimeAnswers-original.learner.profile.lifetimeAnswers).toBe(1);
  expect(graded.learner.profile.xp-original.learner.profile.xp).toBe(7);
  await page.reload();await other.reload();
  await expect(page.getByRole('button',{name:'Undo answer'})).toBeVisible({timeout:30_000});
  await expect(other.getByRole('button',{name:'Undo answer'})).toBeVisible({timeout:30_000});
  await Promise.all([page.getByRole('button',{name:'Undo answer'}).click(),
    other.getByRole('button',{name:'Undo answer'}).click()]);
  await expect.poll(async()=>(await studySnapshot(page)).events.length,{timeout:30_000}).toBe(0);
  const undone=await studySnapshot(page);
  expect(undone.session.cursor).toBe(0);
  expect(undone.session.stats.reviewed).toBe(0);
  expect(undone.srs).toEqual(original.srs);
  expect(undone.learner.profile).toEqual(original.learner.profile);
  expect(undone.summary).toEqual(original.summary);
 }finally{await other.close();}
});

test('U52 simultaneous skips of an unresolved word advance only once',async({context,page})=>{
 const other=await context.newPage();
 try{
  await page.goto('/#words');
  const form=page.locator('[data-card-form]');
  await expect(form).toBeVisible({timeout:45_000});
  for(const [fr,en] of [['un train','train'],['un autobus','bus']]){
   await form.locator('[name="fr"]').fill(fr);
   await form.locator('[name="en"]').fill(en);
   await form.getByRole('button',{name:'Save my word'}).click();
   await expect(page.locator('[data-card-status]')).toContainText('Word saved');
  }
  await page.getByRole('button',{name:'Study my words'}).click();
  await expect(page).toHaveURL(/#review$/,{timeout:45_000});
  const existing=await studySnapshot(page);
  expect(existing.session.queueIds).toHaveLength(2);
  const id=existing.session.queueIds[0].split('::d31:')[0];
  await page.evaluate(noteId=>new Promise((resolve,reject)=>{
   const open=indexedDB.open('thiepn-french-vnext');
   open.onerror=()=>reject(open.error);
   open.onsuccess=()=>{
    const db=open.result,tx=db.transaction('user-content','readwrite');
    const owner=tx.objectStore('user-content'),r=owner.get('content-v1');
    r.onsuccess=()=>{const content=r.result;delete content.userCards[noteId];owner.put(content,'content-v1');};
    tx.oncomplete=()=>{db.close();resolve();};
    tx.onerror=()=>{db.close();reject(tx.error);};
   };
  }),id);
  await page.reload();await other.goto('/#review');
  const skip='Skip without changing progress';
  await expect(page.getByRole('button',{name:skip})).toBeVisible({timeout:30_000});
  await expect(other.getByRole('button',{name:skip})).toBeVisible({timeout:30_000});
  await Promise.all([page.getByRole('button',{name:skip}).click(),
    other.getByRole('button',{name:skip}).click()]);
  await expect.poll(async()=>(await studySnapshot(page)).session.cursor,{timeout:30_000}).toBe(1);
  const saved=await studySnapshot(page);
  expect(saved.session.stats.skipped).toBe(1);
  expect(saved.events).toEqual([]);
  expect(saved.learner.profile).toEqual(existing.learner.profile);
 }finally{await other.close();}
});

test('U52 completed-tab restart preserves a newer session claimed by another tab',async({context,page})=>{
 const other=await context.newPage();
 try{
  await page.goto('/#words');
  const form=page.locator('[data-card-form]');
  await expect(form).toBeVisible({timeout:45_000});
  await form.locator('[name="fr"]').fill('un livre');
  await form.locator('[name="en"]').fill('book');
  await form.getByRole('button',{name:'Save my word'}).click();
  await expect(page.locator('[data-card-status]')).toContainText('Word saved');
  await page.getByRole('button',{name:'Study my words'}).click();
  await expect(page).toHaveURL(/#review$/,{timeout:45_000});
  await page.getByRole('button',{name:'Show answer'}).click();
  await page.getByRole('button',{name:'Good',exact:true}).click();
  await expect(page.getByRole('button',{name:'Check due reviews again'})).toBeVisible({timeout:30_000});
  // Another tab claims new learner-owned work while this completion screen remains open.
  await other.goto('/#words');
  await expect(other.locator('[data-card-form]')).toBeVisible({timeout:45_000});
  const otherForm=other.locator('[data-card-form]');
  await otherForm.locator('[name="fr"]').fill('une table');
  await otherForm.locator('[name="en"]').fill('table');
  await other.getByRole('button',{name:'Save my word'}).click();
  await expect(other.locator('[data-card-status]')).toContainText('Word saved');
  await other.getByRole('button',{name:'Study my words'}).click();
  await expect(other).toHaveURL(/#review$/,{timeout:45_000});
  await expect(other.locator('.review-prompt')).toContainText('une table');
  const before=await studySnapshot(other);
  expect(before.session.queueIds).toHaveLength(1);
  await page.getByRole('button',{name:'Check due reviews again'}).click();
  await expect(page.locator('.review-prompt')).toContainText('une table',{timeout:30_000});
  expect(await studySnapshot(other)).toEqual(before);
 }finally{await other.close();}
});

async function u53PortableArchive(page){
 return page.evaluate(async()=>{
  const db=await new Promise((resolve,reject)=>{
   const request=indexedDB.open('thiepn-french-vnext');
   request.onsuccess=()=>resolve(request.result);
   request.onerror=()=>reject(request.error);
  });
  const names=['learner','srs','activity','user-content','session','meta','migration'];
  const rows={};
  try{
   const tx=db.transaction(names,'readonly');
   const jobs=names.map(async name=>{
    const store=tx.objectStore(name);
    const keys=store.getAllKeys(),values=store.getAll();
    const read=request=>new Promise((resolve,reject)=>{
     request.onsuccess=()=>resolve(request.result);
     request.onerror=()=>reject(request.error);
    });
    const [allKeys,allValues]=await Promise.all([read(keys),read(values)]);
    rows[name]=allKeys.map((key,index)=>({key,value:allValues[index]}));
   });
   await Promise.all(jobs);
  }finally{db.close();}
  const payload={dbName:'thiepn-french-vnext',dbVersion:5,stores:rows};
  const serialized=JSON.stringify(payload);
  const checksum=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(serialized))))
   .map(x=>x.toString(16).padStart(2,'0')).join('');
  return JSON.stringify({schema:'thiepn-french-vnext-backup-v1',app:'French',
   createdAt:Date.now(),checksum,payload});
 });
}

test('U53 reviewed restore rejects cross-tab changes then safely recovers on explicit re-review',async({context,page})=>{
 const other=await context.newPage();
 try{
  await page.goto('/#words');
  const form=page.locator('[data-card-form]');
  await expect(form).toBeVisible({timeout:45_000});
  await form.locator('[name="fr"]').fill('un bateau');
  await form.locator('[name="en"]').fill('boat');
  await form.getByRole('button',{name:'Save my word'}).click();
  await expect(page.locator('[data-card-status]')).toContainText('Word saved');
  await page.evaluate(()=>localStorage.setItem('french3000-study-plan-v1','{"targetLevel":"B1","original":true}'));
  const original=await ownState(page);
  const archive=await u53PortableArchive(page);
  await page.goto('/#settings');
  await expect(page.getByRole('heading',{name:'Data & recovery'})).toBeVisible({timeout:45_000});
  const select=page.locator('[data-import]');
  await select.setInputFiles({name:'u53-reviewed.json',mimeType:'application/json',buffer:Buffer.from(archive)});
  await expect(page.locator('[data-data-status]')).toContainText('Backup validated');
  await page.locator('[data-confirm-check]').check();
  await other.goto('/#words');
  await expect(other.locator('[data-card-form]')).toBeVisible({timeout:45_000});
  await other.locator('[data-card-form] [name="fr"]').fill('une étoile');
  await other.locator('[data-card-form] [name="en"]').fill('star');
  await other.getByRole('button',{name:'Save my word'}).click();
  await expect(other.locator('[data-card-status]')).toContainText('Word saved');
  const newer=await ownState(other);
  expect(Object.keys(newer.content.userCards)).toHaveLength(2);
  await page.getByRole('button',{name:'Restore selected backup'}).click();
  await expect(page.locator('[data-data-status]')).toContainText('FRENCH_RESTORE_LOCAL_CHANGED',{timeout:30_000});
  expect(await ownState(other)).toEqual(newer);
  // The learner explicitly reviews the same archive again, now seeing newer work.
  await select.setInputFiles([]);
  await select.setInputFiles({name:'u53-reviewed.json',mimeType:'application/json',buffer:Buffer.from(archive)});
  await expect(page.locator('[data-data-status]')).toContainText('Backup validated');
  await page.locator('[data-confirm-check]').check();
  await page.getByRole('button',{name:'Restore selected backup'}).click();
  await expect(page.locator('[data-data-status]')).toContainText('Restore complete',{timeout:30_000});
  await expect.poll(async()=>Object.keys((await ownState(other)).content.userCards).length,{timeout:30_000}).toBe(1);
  const recovered=await ownState(other);
  expect(recovered.content.userCards).toEqual(original.content.userCards);
  expect(recovered.srs).toEqual(original.srs);
  expect(recovered.events).toEqual(original.events);
  expect(await page.evaluate(()=>localStorage.getItem('french3000-study-plan-v1')))
   .toBe('{"targetLevel":"B1","original":true}');
 }finally{await other.close();}
});

test('U53 migrated P35 fallback cannot overwrite already-used native learner data on startup',async({page})=>{
 await page.goto('/#words');
 const form=page.locator('[data-card-form]');
 await expect(form).toBeVisible({timeout:45_000});
 await form.locator('[name="fr"]').fill('une fleur');
 await form.locator('[name="en"]').fill('flower');
 await form.getByRole('button',{name:'Save my word'}).click();
 await expect(page.locator('[data-card-status]')).toContainText('Word saved');
 const before=await ownState(page);
 await page.evaluate(async()=>{
  const legacy={'p35:legacy::d31:0:recognition':{status:'learned',seen:4,interval:9,due:1700100000000}};
  localStorage.setItem('french3000-progress-v2',JSON.stringify(legacy));
  localStorage.setItem('french3000-depth-updated-at','1700000000000');
  // Simulate a damaged/missing cache summary, without deleting any learner-owned data.
  await new Promise((resolve,reject)=>{
   const request=indexedDB.open('thiepn-french-vnext');
   request.onerror=()=>reject(request.error);
   request.onsuccess=()=>{
    const db=request.result,tx=db.transaction('meta','readwrite');
    tx.objectStore('meta').delete('learner-summary');
    tx.oncomplete=()=>{db.close();resolve();};
    tx.onerror=()=>{db.close();reject(tx.error);};
   };
  });
 });
 await page.reload();
 await expect(page.locator('[data-card-form]')).toBeVisible({timeout:45_000});
 await expect.poll(async()=>page.evaluate(()=>new Promise((resolve,reject)=>{
  const req=indexedDB.open('thiepn-french-vnext');
  req.onerror=()=>reject(req.error);
  req.onsuccess=()=>{
   const db=req.result,tx=db.transaction('migration','readonly');
   const get=tx.objectStore('migration').get('legacy-import-v1');
   get.onsuccess=()=>resolve(get.result?.schema??'');
   get.onerror=()=>reject(get.error);
   tx.oncomplete=()=>db.close();
  };
 })),{timeout:30_000}).toBe('thiepn-french-legacy-import-v1');
 const after=await ownState(page);
 expect(after.content).toEqual(before.content);
 expect(after.srs).toEqual(before.srs);
 expect(after.events).toEqual(before.events);
 expect(after.srs.some(row=>row.noteId==='p35:legacy')).toBe(false);
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('french3000-progress-v2'))))
  .toHaveProperty('p35:legacy::d31:0:recognition');
});
