import {test,expect} from '@playwright/test';

/** Real desktop and Android Chromium tabs share one original IndexedDB meta
 * owner. No browser-side fake CAS or invented source data is used here. */
async function saved(page){
 return page.evaluate(async()=>new Promise((resolve,reject)=>{
  const request=indexedDB.open('thiepn-french-vnext',5);
  request.onerror=()=>reject(request.error);
  request.onsuccess=()=>{
   const db=request.result,tx=db.transaction(['meta','srs','activity','learner'],'readonly');
   const source=tx.objectStore('meta').get('p35-source-graph-v1');
   const srs=tx.objectStore('srs').count();
   const activity=tx.objectStore('activity').count();
   const learner=tx.objectStore('learner').get('state-v1');
   tx.oncomplete=()=>{db.close();resolve({source:source.result,
     srs:srs.result,activity:activity.result,learner:learner.result})};
   tx.onerror=()=>reject(tx.error);
  };
 }));
}
async function originalHome(page){
 await page.goto('/#conversation');
 await expect(page.getByRole('heading',{name:'Original B2 dialogue practice'})).toBeVisible({timeout:45000});
}
async function submit(page,text,next){
 await page.getByRole('textbox',{name:'Reply to original source graph in French'}).fill(text);
 await page.getByRole('button',{name:'Check source rule'}).click();
 if(next)await expect(page.getByText('Pinned source graph node '+next,{exact:false})).toBeVisible();
}
test('U72 two tabs starting different B2 original dialogues cannot overwrite the first; newer checkpoint restores enabled controls',async({page,context})=>{
 await originalHome(page);
 const other=await context.newPage();
 await originalHome(other);
 const before=await saved(page);
 await page.getByRole('button',{name:'Practise original B2 · Defend a workplace policy'}).click();
 await expect(page.getByRole('heading',{name:'Defend a workplace policy'})).toBeVisible();
 const accepted=await saved(page);
 expect(accepted.source.active.scenarioId).toBe('work-policy-debate');
 await other.getByRole('button',{name:'Practise original B2 · Resolve a project crisis'}).click();
 await expect(other.getByText(/Another tab saved a newer original dialogue/)).toBeVisible();
 await expect(other.getByRole('heading',{name:'Defend a workplace policy'})).toBeVisible();
 const now=await saved(other);
 expect(now.source).toEqual(accepted.source);
 expect(now.source.active.nodeId).toBe('evaluation');
 expect(now.source.mission).toBeNull();
 expect(now.source.history).toEqual([]);
 expect(now.srs).toBe(before.srs);expect(now.activity).toBe(before.activity);
 expect(now.learner?.promotions?.B2?.earnedAt??0).toBe(0);
 await other.getByRole('button',{name:'Show original hint'}).click();
 await expect(other.getByText(/Source hint ·/)).toBeVisible();
 const support=await saved(page);
 expect(support.source.active.support).toBe(1);
 await other.close();
});
test('U72 stale B2 source turn loses atomic CAS to newer original node; unsent old reply is copyable but never applied to new node',async({page,context})=>{
 await originalHome(page);
 await page.getByRole('button',{name:'Practise original B2 · Defend a workplace policy'}).click();
 await expect(page.getByRole('heading',{name:'Defend a workplace policy'})).toBeVisible();
 const other=await context.newPage();await other.goto('/#conversation');
 await expect(other.getByRole('heading',{name:'Defend a workplace policy'})).toBeVisible({timeout:45000});
 const originalReply='Cette mesure peut améliorer la flexibilité, mais elle risque de compliquer la coordination.';
 const staleReply='Je préfère une autre organisation car plusieurs contraintes méritent un examen.';
 await submit(page,originalReply,'nuance');
 const afterFirst=await saved(page);
 expect(afterFirst.source.active.nodeId).toBe('nuance');
 expect(afterFirst.source.evidence).toHaveLength(1);
 await submit(other,staleReply,null);
 await expect(other.getByText(/Another tab saved a newer original dialogue/)).toBeVisible();
 await expect(other.getByText(/Pinned source graph node nuance/)).toBeVisible();
 const unsent=other.getByRole('textbox',{name:'Unsent reply from outdated source task'});
 await expect(unsent).toHaveValue(staleReply);
 await expect(unsent).toHaveJSProperty('readOnly',true);
 await expect(other.getByRole('textbox',{name:'Reply to original source graph in French'})).toHaveValue('');
 const final=await saved(other);
 expect(final.source).toEqual(afterFirst.source);
 expect(JSON.stringify(final.source)).not.toContain(staleReply);
 expect(JSON.stringify(final.source)).not.toContain(originalReply);
 expect(final.source.maxLevel).toBe('A1');
 await other.reload();
 await expect(other.getByText(/Pinned source graph node nuance/)).toBeVisible({timeout:45000});
 await expect(other.getByRole('textbox',{name:'Unsent reply from outdated source task'})).toHaveCount(0);
 await other.close();
});
test('U72 B2 practice mission stage advanced in first tab cannot be replaced by stale second-tab first-stage submission',async({page,context})=>{
 await originalHome(page);
 await page.getByRole('button',{name:'Practise B2 sequence · Advanced workplace decision'}).click();
 await expect(page.getByRole('heading',{name:'Resolve a project crisis'})).toBeVisible();
 const other=await context.newPage();await other.goto('/#conversation');
 await expect(other.getByRole('heading',{name:'Resolve a project crisis'})).toBeVisible({timeout:45000});
 const answers=[
  "Le retard vient surtout du fait que plusieurs dépendances ont été sous-estimées, pas d'une seule erreur individuelle.",
  "Repousser la date protège la qualité mais augmente les coûts ; réduire le périmètre limite le délai mais oblige à renoncer à certaines fonctions.",
  "Si nous gardions le plan actuel, nous risquerions de livrer en retard avec une qualité insuffisante.",
  "Je proposerais de reporter deux fonctions secondaires afin de préserver la date et les éléments critiques.",
  "Les deux parties veulent éviter un échec visible ; on peut donc maintenir la date pour un périmètre réduit et planifier le reste ensuite.",
  "En résumé, nous protégeons les éléments critiques maintenant et fixons une seconde étape pour le reste."
 ];
 const next=['options','consequence','tradeoff','mediation','summary'];
 for(let i=0;i<answers.length;i++){
  await submit(page,answers[i],i<next.length?next[i]:null);
 }
 await expect(page.getByRole('heading',{name:'Defend a workplace policy'})).toBeVisible();
 await expect(page.getByText(/Source mission Advanced workplace decision · task 2\/3/)).toBeVisible();
 const fresh=await saved(page);
 expect(fresh.source.mission.index).toBe(1);
 expect(fresh.source.mission.completed).toHaveLength(1);
 expect(fresh.source.mission.completed[0].scenarioId).toBe('project-crisis');
 expect(fresh.source.active.scenarioId).toBe('work-policy-debate');
 await submit(other,answers[0],null);
 await expect(other.getByText(/Another tab saved a newer original dialogue/)).toBeVisible();
 await expect(other.getByRole('heading',{name:'Defend a workplace policy'})).toBeVisible();
 await expect(other.getByRole('textbox',{name:'Unsent reply from outdated source task'})).toHaveValue(answers[0]);
 const state=await saved(other);
 expect(state.source).toEqual(fresh.source);
 expect(state.source.mission.index).toBe(1);
 expect(state.source.missionHistory??[]).toHaveLength(0);
 expect(JSON.stringify(state.source)).not.toContain(answers[0]);
 await other.reload();
 await expect(other.getByRole('heading',{name:'Defend a workplace policy'})).toBeVisible({timeout:45000});
 expect((await saved(other)).source.mission.index).toBe(1);
 await other.close();
});
test('U72 a stale original hint cannot silently downgrade independent evidence after another tab progressed',async({page,context})=>{
 await originalHome(page);
 await page.getByRole('button',{name:'Practise original B2 · Assess a disputed media claim'}).click();
 await expect(page.getByRole('heading',{name:'Assess a disputed media claim'})).toBeVisible();
 const other=await context.newPage();await other.goto('/#conversation');
 await expect(other.getByRole('heading',{name:'Assess a disputed media claim'})).toBeVisible({timeout:45000});
 const reply='Il faut d’abord savoir si la source est fiable et si les données soutiennent exactement cette conclusion.';
 await submit(page,reply,'certainty');
 const fresh=await saved(page);
 expect(fresh.source.active.support).toBe(0);
 expect(fresh.source.active.nodeId).toBe('certainty');
 await other.getByRole('button',{name:'Show source example'}).click();
 await expect(other.getByText(/Another tab saved a newer original dialogue/)).toBeVisible();
 await expect(other.getByText(/Pinned source graph node certainty/)).toBeVisible();
 const after=await saved(other);
 expect(after.source).toEqual(fresh.source);
 expect(after.source.active.support).toBe(0);
 expect(after.source.evidence[0].practiceOnly).toBe(true);
 expect(after.source.evidence[0].independent).toBe(true);
 await other.close();
});

test('U72 Listen-to-Write handoff never upgrades a newer Conversation node after original source changed in another tab',async({page,context})=>{
 await originalHome(page);
 await page.getByRole('button',{name:'Practise original B2 · Defend a workplace policy'}).click();
 await expect(page.getByRole('heading',{name:'Defend a workplace policy'})).toBeVisible();
 await page.getByRole('button',{name:'Listen to this original partner turn'}).click();
 await expect(page).toHaveURL(/#listen$/);
 await expect(page.getByText('Original P35 dialogue · partner listening')).toBeVisible({timeout:45000});
 await expect(page.getByRole('button',{name:'Continue original conversation in Write'})).toBeVisible();
 const other=await context.newPage();await other.goto('/#conversation');
 await expect(other.getByRole('heading',{name:'Defend a workplace policy'})).toBeVisible({timeout:45000});
 const first='Cette mesure peut améliorer la flexibilité, mais elle risque de compliquer la coordination.';
 await submit(other,first,'nuance');
 const accepted=await saved(other);
 expect(accepted.source.active.nodeId).toBe('nuance');
 expect(accepted.source.active.support).toBe(0);
 expect(accepted.source.evidence[0].practiceOnly).toBe(true);
 expect(accepted.source.evidence[0].independent).toBe(false,'Listen handoff correctly marks earlier response supported');
 await page.getByRole('button',{name:'Continue original conversation in Write'}).click();
 await expect(page.getByText(/Original conversation changed or could not be saved/)).toBeVisible();
 await expect(page).toHaveURL(/#listen$/);
 const after=await saved(page);
 expect(after.source).toEqual(accepted.source);
 expect(after.source.active.nodeId).toBe('nuance');
 expect(after.source.active.support).toBe(0,'stale Listen may not reveal model support against a new node');
 expect(after.source.evidence).toHaveLength(1);
 expect(after.learner?.promotions?.B2?.earnedAt??0).toBe(0);
 expect(JSON.stringify(after.source)).not.toContain(first);
 await other.close();
});
