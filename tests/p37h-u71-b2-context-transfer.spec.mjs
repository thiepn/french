import {test,expect} from '@playwright/test';

function evaluateRow(page){
 return page.locator('.source-b2-transfer-row')
  .filter({has:page.getByRole('heading',{name:'Evaluate evidence and options'})});
}
async function localSnapshot(page){
 return page.evaluate(async()=>new Promise((resolve,reject)=>{
  const request=indexedDB.open('thiepn-french-vnext',5);
  request.onerror=()=>reject(request.error);
  request.onsuccess=()=>{
   const db=request.result;
   const tx=db.transaction(['meta','srs','activity','learner'],'readonly');
   const source=tx.objectStore('meta').get('p35-source-graph-v1');
   const srs=tx.objectStore('srs').count();
   const activity=tx.objectStore('activity').count();
   const learner=tx.objectStore('learner').get('state-v1');
   tx.oncomplete=()=>{db.close();resolve({source:source.result,srs:srs.result,
    activity:activity.result,learner:learner.result})};
   tx.onerror=()=>reject(tx.error);
  };
 }));
}
async function answer(page,phrase,nextNode){
 await page.getByRole('textbox',{name:'Reply to original source graph in French'}).fill(phrase);
 await page.getByRole('button',{name:'Check source rule'}).click();
 if(nextNode)await expect(page.getByText(new RegExp('Pinned source graph node '+nextNode))).toBeVisible();
}
const workplace=[
 'Cette mesure peut améliorer la flexibilité, mais elle risque de compliquer la coordination.',
 'Je suis favorable dans la mesure où les équipes gardent des moments communs.',
 "Je comprends l'objection, mais il faudrait comparer des résultats mesurables.",
 "On risquerait de créer des inégalités entre les postes si les contraintes réelles n'étaient pas prises en compte.",
 "Je proposerais une période d'essai, à condition qu'on évalue ensuite les résultats.",
 "En résumé, le principe est accepté à condition de préserver la coordination et de mesurer les effets."
];
test('U71 exposes six authentic B2 functional contexts with current evidence, next original task and 390px mobile layout',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/#conversation');
 await expect(page.getByRole('heading',{name:'Original B2 function contexts:'})).toBeVisible({timeout:45000});
 const rows=page.locator('.source-b2-transfer-row');
 await expect(rows).toHaveCount(6);
 const evaluation=evaluateRow(page);
 await expect(evaluation.getByText(/0 \/ 4 completed original settings with unassisted rule matches/)).toBeVisible();
 await expect(evaluation.getByText(/First source dialogue · Defend a workplace policy/)).toBeVisible();
 await expect(evaluation.getByRole('button',{name:'Practise B2 function · Evaluate evidence and options'})).toBeEnabled();
 await expect(page.getByText(/Practice only. Original P35 P28 B2 qualification and P29 maintenance are not available/)).toBeVisible();
 const size=await page.evaluate(()=>({document:document.documentElement.scrollWidth,viewport:innerWidth}));
 expect(size.document).toBeLessThanOrEqual(size.viewport+2);
});
test('U71 original workplace rule matches require completed context before suggesting second authored civic setting; reload never awards scores',async({page})=>{
 await page.goto('/#conversation');
 await expect(page.getByRole('heading',{name:'Original B2 function contexts:'})).toBeVisible({timeout:45000});
 const before=await localSnapshot(page);
 await evaluateRow(page).getByRole('button',{name:'Practise B2 function · Evaluate evidence and options'}).click();
 await expect(page.getByRole('heading',{name:'Defend a workplace policy'})).toBeVisible();
 await answer(page,workplace[0],'nuance');
 await page.reload();
 await expect(page.getByRole('heading',{name:'Defend a workplace policy'})).toBeVisible({timeout:45000});
 const resumed=await localSnapshot(page);
 expect(resumed.source.active.nodeId).toBe('nuance');
 expect(resumed.source.maxLevel).toBe('A1');
 expect(JSON.stringify(resumed.source)).not.toContain(workplace[0]);
 const next=['objection','consequence','condition','summary'];
 for(let i=1;i<workplace.length;i++){
  await answer(page,workplace[i],i<workplace.length-1?next[i-1]:null);
 }
 await expect(page.getByRole('heading',{name:'Original B2 function contexts:'})).toBeVisible();
 const evaluation=evaluateRow(page);
 await expect(evaluation.getByText(/1 \/ 4 completed original settings with unassisted rule matches/)).toBeVisible();
 await expect(evaluation.getByText(/Different original setting · Debate a city transport policy/)).toBeVisible();
 const after=await localSnapshot(page);
 expect(after.source.active).toBeNull();
 expect(after.source.history[0].scenarioId).toBe('work-policy-debate');
 expect(after.source.history[0].complete).toBe(true);
 expect(after.source.evidence.some(e=>e.functionId==='evaluate'&&e.independent&&e.practiceOnly)).toBe(true);
 expect(after.srs).toBe(before.srs);
 expect(after.activity).toBe(before.activity);
 expect(after.learner?.promotions?.B2?.earnedAt??0).toBe(0);
 for(const phrase of workplace)expect(JSON.stringify(after.source)).not.toContain(phrase);
 await evaluation.getByRole('button',{name:'Practise B2 function · Evaluate evidence and options'}).click();
 await expect(page.getByRole('heading',{name:'Debate a city transport policy'})).toBeVisible();
 const second=await localSnapshot(page);
 expect(second.source.active.scenarioId).toBe('civic-transport-debate');
 expect(second.source.mission).toBeNull();
 expect(second.source.maxLevel).toBe('A1');
});
test('U71 a paused and unfinished authentic B2 dialogue preserves checkpoint, but cannot be counted as completed independent context',async({page})=>{
 await page.goto('/#conversation');
 await expect(page.getByRole('heading',{name:'Original B2 function contexts:'})).toBeVisible({timeout:45000});
 await evaluateRow(page).getByRole('button',{name:'Practise B2 function · Evaluate evidence and options'}).click();
 await answer(page,workplace[0],'nuance');
 await page.getByRole('button',{name:'Pause original graph & home'}).click();
 await expect(page.getByRole('heading',{name:'Original B2 function contexts:'})).toBeVisible();
 const evaluation=evaluateRow(page);
 await expect(evaluation.getByText(/0 \/ 4 completed original settings with unassisted rule matches/)).toBeVisible();
 await expect(evaluation.getByText(/1 unfinished source settings/)).toBeVisible();
 await expect(evaluation.getByText(/Retry source dialogue without help · Defend a workplace policy/)).toBeVisible();
 await expect(evaluation.getByRole('button',{name:'Practise B2 function · Evaluate evidence and options'})).toBeDisabled();
 await expect(page.getByRole('button',{name:'Resume original dialogue'})).toBeVisible();
 await page.reload();
 await expect(page.getByRole('heading',{name:'Defend a workplace policy'})).toBeVisible({timeout:45000});
 const saved=await localSnapshot(page);
 expect(saved.source.active.nodeId).toBe('nuance');
 expect(saved.source.history.filter(r=>r.scenarioId==='work-policy-debate')).toHaveLength(0);
 expect(saved.source.missionHistory??[]).toHaveLength(0);
});
test('U71 unsupported B2 responses do not manufacture cross-context matches or grade credit',async({page})=>{
 await page.goto('/#conversation');
 await expect(page.getByRole('heading',{name:'Original B2 function contexts:'})).toBeVisible({timeout:45000});
 await evaluateRow(page).getByRole('button',{name:'Practise B2 function · Evaluate evidence and options'}).click();
 const bad='Le chat joue dans le jardin et regarde la fenêtre.';
 await answer(page,bad,null);
 await expect(page.getByText(/original source rules did not confidently match/i)).toBeVisible();
 await page.getByRole('button',{name:'Pause original graph & home'}).click();
 const evaluation=evaluateRow(page);
 await expect(evaluation.getByText(/0 \/ 4 completed original settings with unassisted rule matches/)).toBeVisible();
 const state=await localSnapshot(page);
 expect(state.source.active.nodeId).toBe('evaluation');
 expect(state.source.evidence.some(e=>e.functionId==='evaluate')).toBe(false);
 expect(JSON.stringify(state.source)).not.toContain(bad);
 expect(state.learner?.promotions?.B2?.earnedAt??0).toBe(0);
});
