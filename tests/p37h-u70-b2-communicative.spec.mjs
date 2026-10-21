import {test,expect} from '@playwright/test';

// Genuine Chromium desktop and Android emulation; only the responses below
// are authored original P35 rule samples. No simulated grader or extra engine.
async function snapshot(page){
 return page.evaluate(async()=>new Promise((resolve,reject)=>{
  const req=indexedDB.open('thiepn-french-vnext',5);
  req.onerror=()=>reject(req.error);
  req.onsuccess=()=>{
   const db=req.result,tx=db.transaction(['meta','learner','srs','activity'],'readonly');
   const source=tx.objectStore('meta').get('p35-source-graph-v1');
   const learner=tx.objectStore('learner').get('state-v1');
   const srs=tx.objectStore('srs').count();
   const activity=tx.objectStore('activity').count();
   tx.oncomplete=()=>{db.close();resolve({
    source:source.result,learner:learner.result,srs:srs.result,activity:activity.result
   })};
   tx.onerror=()=>reject(tx.error);
  };
 }));
}
async function submitOriginal(page,text){
 await page.getByRole('textbox',{name:'Reply to original source graph in French'}).fill(text);
 await page.getByRole('button',{name:'Check source rule'}).click();
}
test('U70 original B2 entry opens all five P35 dialogue graphs and two P30-inspired sequences without B2 benchmark',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/#b2');
 await expect(page.getByRole('heading',{name:'Argument & Source Studio'})).toBeVisible({timeout:45000});
 await page.getByRole('button',{name:'Practise original P35 B2 dialogues and missions'}).click();
 await expect(page).toHaveURL(/#conversation$/);
 await expect(page.getByRole('heading',{name:'Original B2 dialogue practice'})).toBeVisible();
 for(const name of [
  'Defend a workplace policy','Debate a city transport policy',
  'Resolve a project crisis','Assess a disputed media claim','Mediate a team conflict']){
  await expect(page.getByRole('button',{name:'Practise original B2 · '+name})).toBeEnabled();
 }
 for(const name of ['Advanced workplace decision','Contested public issue']){
  await expect(page.getByRole('button',{name:'Practise B2 sequence · '+name})).toBeEnabled();
 }
 await expect(page.getByText(/Original B2 function contexts:/)).toBeVisible();
 await expect(page.getByText(/Practice only. Original P35 P28 B2 qualification and P29 maintenance are not available/)).toBeVisible();
 const width=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,screen:innerWidth}));
 expect(width.scroll).toBeLessThanOrEqual(width.screen+2);
 const before=await snapshot(page);
 expect(before.source?.active??null).toBeNull();
 expect(before.source?.maxLevel??'A1').toBe('A1');
});
test('U70 authentic P35 B2 multi-turn source graph matches authored French, survives reload, rotates variants and saves only private aggregate practice',async({page})=>{
 await page.goto('/#conversation');
 await expect(page.getByRole('heading',{name:'Original B2 dialogue practice'})).toBeVisible({timeout:45000});
 const before=await snapshot(page);
 await page.getByRole('button',{name:'Practise original B2 · Defend a workplace policy'}).click();
 await expect(page.getByRole('heading',{name:'Defend a workplace policy'})).toBeVisible();
 await expect(page.getByText(/Original P35 deterministic source · work-policy-debate · B2/)).toBeVisible();
 await expect(page.getByText(/wording variant 1\/4/)).toBeVisible();
 const answers=[
  'Cette mesure peut améliorer la flexibilité, mais elle risque de compliquer la coordination.',
  'Je suis favorable dans la mesure où les équipes gardent des moments communs.',
  "Je comprends l'objection, mais il faudrait comparer des résultats mesurables.",
  "On risquerait de créer des inégalités entre les postes si les contraintes réelles n'étaient pas prises en compte.",
  "Je proposerais une période d'essai, à condition qu'on évalue ensuite les résultats.",
  "En résumé, le principe est accepté à condition de préserver la coordination et de mesurer les effets."
 ];
 await submitOriginal(page,answers[0]);
 await expect(page.getByText(/Pinned source graph node nuance/)).toBeVisible();
 await page.reload();
 await expect(page.getByRole('heading',{name:'Defend a workplace policy'})).toBeVisible({timeout:45000});
 const resumed=await snapshot(page);
 expect(resumed.source?.schema).toBe('thiepn-french-p35-source-graph-v1');
 expect(resumed.source?.active?.scenarioId).toBe('work-policy-debate');
 expect(resumed.source?.active?.nodeId).toBe('nuance');
 expect(resumed.source?.maxLevel).toBe('A1');
 expect(resumed.source?.mission).toBeNull();
 expect(JSON.stringify(resumed.source)).not.toContain(answers[0]);
 for(let i=1;i<answers.length;i++){
  await submitOriginal(page,answers[i]);
  if(i!==answers.length-1)await expect(page.getByRole('textbox',{name:'Reply to original source graph in French'})).toBeVisible();
 }
 await expect(page.getByRole('heading',{name:'Original B2 dialogue practice'})).toBeVisible();
 const after=await snapshot(page);
 expect(after.source.active).toBeNull();
 expect(after.source.history[0].scenarioId).toBe('work-policy-debate');
 expect(after.source.history[0].complete).toBe(true);
 expect(after.source.history[0].turns).toBe(6);
 expect(after.source.maxLevel).toBe('A1');
 expect(after.source.evidence.some(x=>x.functionId==='evaluate')).toBe(true);
 expect(after.source.evidence.some(x=>x.functionId==='qualify')).toBe(true);
 expect(after.source.evidence.some(x=>x.functionId==='synthesize')).toBe(true);
 expect(after.source.evidence.every(x=>x.practiceOnly===true)).toBe(true);
 expect(after.srs).toBe(before.srs);
 expect(after.activity).toBe(before.activity);
 expect(after.learner?.promotions?.B2?.earnedAt??0).toBe(0);
 for(const response of answers)expect(JSON.stringify(after.source)).not.toContain(response);
 await page.getByRole('button',{name:'Practise original B2 · Defend a workplace policy'}).click();
 await expect(page.getByText(/wording variant 2\/4/)).toBeVisible();
});
test('U70 P30 three-stage workplace practice uses original P35 mission runner and resumes exact scene after reload',async({page})=>{
 await page.goto('/#conversation');
 await expect(page.getByRole('heading',{name:'Original B2 dialogue practice'})).toBeVisible({timeout:45000});
 await page.getByRole('button',{name:'Practise B2 sequence · Advanced workplace decision'}).click();
 await expect(page.getByRole('heading',{name:'Resolve a project crisis'})).toBeVisible();
 await expect(page.getByText(/Source mission Advanced workplace decision · task 1\/3/)).toBeVisible();
 await expect(page.getByText(/Original P35 deterministic source · project-crisis · B2/)).toBeVisible();
 const originalModel="Le retard vient surtout du fait que plusieurs dépendances ont été sous-estimées, pas d'une seule erreur individuelle.";
 await submitOriginal(page,originalModel);
 await expect(page.getByText(/Pinned source graph node options/)).toBeVisible();
 await page.reload();
 await expect(page.getByRole('heading',{name:'Resolve a project crisis'})).toBeVisible({timeout:45000});
 const resumed=await snapshot(page);
 expect(resumed.source?.mission?.id).toBe('u70-workplace-practice');
 expect(resumed.source?.mission?.index).toBe(0);
 expect(resumed.source?.active?.scenarioId).toBe('project-crisis');
 expect(resumed.source?.active?.nodeId).toBe('options');
 expect(resumed.source?.maxLevel).toBe('A1');
 expect(resumed.source?.missionHistory??[]).toHaveLength(0);
 expect(JSON.stringify(resumed.source)).not.toContain(originalModel);
 await page.getByRole('button',{name:'Pause original graph & home'}).click();
 await expect(page.getByRole('heading',{name:'Original B2 dialogue practice'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Resume original dialogue'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Practise B2 sequence · Contested public issue'})).toBeDisabled();
 await page.getByRole('button',{name:'Resume original dialogue'}).click();
 await expect(page.getByRole('heading',{name:'Resolve a project crisis'})).toBeVisible();
});
test('U70 unrecognized French text abstains in existing P35 rule engine, assistance remains practice-only, no B2 benchmark',async({page})=>{
 await page.goto('/#conversation');
 await expect(page.getByRole('heading',{name:'Original B2 dialogue practice'})).toBeVisible({timeout:45000});
 await page.getByRole('button',{name:'Practise original B2 · Assess a disputed media claim'}).click();
 await expect(page.getByRole('heading',{name:'Assess a disputed media claim'})).toBeVisible();
 const invented="Le chat dort près de la fenêtre, puis il regarde les oiseaux.";
 await submitOriginal(page,invented);
 await expect(page.getByText(/original source rules did not confidently match/i)).toBeVisible();
 const afterUncertain=await snapshot(page);
 expect(afterUncertain.source.active.nodeId).toBe('evidence');
 expect(afterUncertain.source.active.turns).toBe(0);
 expect(afterUncertain.source.missionHistory??[]).toHaveLength(0);
 expect(JSON.stringify(afterUncertain.source)).not.toContain(invented);
 await page.getByRole('button',{name:'Show source example'}).click();
 await expect(page.getByText(/Source model ·/)).toBeVisible();
 const supported="Il faut d'abord savoir si la source est fiable et si les données soutiennent exactement cette conclusion.";
 await submitOriginal(page,supported);
 await expect(page.getByText(/Pinned source graph node certainty/)).toBeVisible();
 const after=await snapshot(page);
 expect(after.source.active.turns).toBe(1);
 expect(after.source.evidence.at(-1).functionId).toBe('evaluate');
 expect(after.source.evidence.at(-1).credit).toBe(0);
 expect(after.source.evidence.at(-1).practiceOnly).toBe(true);
 expect(after.learner?.promotions?.B2?.earnedAt??0).toBe(0);
 expect(JSON.stringify(after.source)).not.toContain(supported);
});
