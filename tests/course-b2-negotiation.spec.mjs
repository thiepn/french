import {test,expect} from '@playwright/test';

async function openScene(page,id){
 await page.goto('/#speak');
 const discovery=page.getByRole('region',{name:'Source-qualified original oral learning'});
 await expect(discovery).toBeVisible({timeout:45_000});
 await discovery.getByPlaceholder('Lesson topic or vocabulary').fill(id);
 await expect(discovery.getByRole('combobox',{name:'Select original French oral source'})).toHaveValue(id);
 const panel=discovery.getByRole('region',{name:'Branching B2 French stakeholder negotiation'});
 await expect(panel).toBeVisible();
 await expect(panel.locator('.u48-progress')).toContainText('Conversation turn 1 / 3');
 await expect(discovery.locator('.u31-stage-nav button')).toHaveCount(7);
 return {discovery,panel};
}
const scenes=[
 {id:'transfer-151',a:'Priorité A · Garantir l’accès équitable aux cours',
  supported:'Prévoir un essai limité avec exceptions d’accessibilité explicites, sans collecte de messages privés.',
  overclaim:'Interdire tous les téléphones sans exception parce que 72 % de tout le lycée l’exige.',
  supportedNext:'comment saurez-vous si cet essai aide réellement',
  wrongNext:'Vous venez de supprimer les exceptions',
  source:'Nadia'},
 {id:'transfer-152',a:'Priorité A · Répartir équitablement la permanence',
  supported:'Négocier une compensation et un roulement équitable pour la permanence du vendredi.',
  overclaim:'Affirmer que tous les salariés ont les mêmes horaires et acceptent déjà la permanence du vendredi.',
  supportedNext:'Quelles données et quelle échéance',
  wrongNext:'Vous avez présenté les horaires comme identiques',
  source:'Mélanie'},
 {id:'transfer-153',a:'Priorité A · Protéger immédiatement les aliments',
  supported:'Emprunter provisoirement un autre appareil sûr et vérifier le diagnostic avant la décision finale.',
  overclaim:'Continuer à utiliser l’appareil défectueux sans précaution pendant les quinze jours.',
  supportedNext:'Que vérifierons-nous ensuite',
  wrongNext:'Nous devons protéger les aliments dès aujourd’hui',
  source:'Clara'}
];
for(const s of scenes){
 test('U48 '+s.id+' adapts the next French stakeholder turn to an unsupported vs evidence-grounded move, without grading speech',async({page})=>{
  const {discovery,panel}=await openScene(page,s.id);
  const opener=panel.getByRole('textbox',{name:'Negotiation French response opening'});
  await opener.fill('Selon les interlocuteurs, nous devons nuancer les chiffres avant toute décision.');
  await expect(discovery.locator('.u31-oral')).toHaveAttribute('data-has-private-draft','true');
  await panel.getByRole('button',{name:'I rehearsed this reply aloud (self-report)'}).click();
  await expect(panel.locator('.u48-progress')).toContainText('self-reported rehearsals');
  await panel.getByRole('button',{name:s.a}).click();
  await expect(panel.locator('.u48-progress')).toContainText('Conversation turn 2 / 3');
  const evidence=panel.locator('.u48-evidence-turns');
  await expect(evidence).toBeHidden();
  await panel.getByRole('button',{name:'Reveal exact original French evidence'}).click();
  await expect(evidence.locator('.u48-source-card')).toHaveCount(2);
  await expect(evidence).toContainText(s.source);
  const challenge=panel.getByRole('textbox',{name:'Negotiation French response challenge-'+(s.id==='transfer-151'?'access':s.id==='transfer-152'?'equity':'safety')});
  await challenge.fill('Je comprends cette objection. Pourtant, la source précise une limite importante.');
  await panel.getByRole('button',{name:s.overclaim}).click();
  await expect(panel.locator('.u48-choice-feedback')).toContainText('Source overclaim');
  await expect(panel.locator('.u48-choice-feedback')).toContainText('NOT your free French notes or speech');
  await panel.getByRole('button',{name:'Hear the consequence: stakeholder follow-up →'}).click();
  await expect(panel.locator('.u48-progress')).toContainText('Conversation turn 3 / 3');
  await expect(panel.locator('.u48-stage')).toContainText(s.wrongNext);
  await panel.getByRole('button',{name:'← Reconsider the negotiating move'}).click();
  await expect(panel.getByRole('textbox',{name:/Negotiation French response challenge-/})).toHaveValue('Je comprends cette objection. Pourtant, la source précise une limite importante.');
  await panel.getByRole('button',{name:s.supported}).click();
  await expect(panel.locator('.u48-choice-feedback')).toContainText('Source-grounded proposal');
  await panel.getByRole('button',{name:'Hear the consequence: stakeholder follow-up →'}).click();
  await expect(panel.locator('.u48-stage')).toContainText(s.supportedNext);
  const final=panel.getByRole('textbox',{name:/Negotiation French response final-/});
  await final.fill('Je propose un essai provisoire sous conditions, puis un bilan avant une nouvelle décision.');
  await expect(panel.locator('.u48-criteria li')).toHaveCount(4);
  await expect(panel.locator('.u48-model')).toBeHidden();
  await panel.getByRole('button',{name:'Compare all three of your private French outlines'}).click();
  await expect(panel.locator('.u48-draft-comparison')).toContainText('Selon les interlocuteurs');
  await expect(panel.locator('.u48-draft-comparison')).toContainText('Je comprends cette objection');
  await expect(panel.locator('.u48-draft-comparison')).toContainText('Je propose un essai provisoire');
  await panel.getByRole('button',{name:'Reveal authored French comparison'}).click();
  await expect(panel.locator('.u48-model')).toBeVisible();
  await expect(panel.locator('.u48-model')).toContainText('not feedback generated from what you said');
  await expect(discovery.locator('.u31-oral')).toHaveAttribute('data-has-private-draft','true');
  await panel.getByRole('button',{name:'Clear all private negotiation drafts'}).click();
  await expect(discovery.locator('.u31-oral')).toHaveAttribute('data-has-private-draft','false');
 });
}

test('U48 genuinely changes the objection with the strategic priority; unsupported route never reuses another draft',async({page})=>{
 const {panel}=await openScene(page,'transfer-151');
 await panel.getByRole('button',{name:'Priorité A · Garantir l’accès équitable aux cours'}).click();
 await expect(panel.locator('.u48-stage')).toContainText('Si vous autorisez des exceptions');
 await panel.getByRole('textbox',{name:'Negotiation French response challenge-access'}).fill('Ma première réponse porte sur l’accès.');
 await panel.getByRole('button',{name:'← Reconsider strategic priority'}).click();
 await panel.getByRole('button',{name:'Priorité B · Vérifier les effets avant une généralisation'}).click();
 await expect(panel.locator('.u48-stage')).toContainText('Pourquoi ne pas imposer la règle');
 await expect(panel.getByRole('textbox',{name:'Negotiation French response challenge-evidence'})).toHaveValue('');
 await panel.getByRole('button',{name:'← Reconsider strategic priority'}).click();
 await panel.getByRole('button',{name:'Priorité A · Garantir l’accès équitable aux cours'}).click();
 await expect(panel.getByRole('textbox',{name:'Negotiation French response challenge-access'})).toHaveValue('Ma première réponse porte sur l’accès.');
});

test('U48 private notes invoke the existing U31 navigation guard; cancellation keeps the original lesson',async({page})=>{
 const {panel,discovery}=await openScene(page,'transfer-152');
 await panel.getByRole('textbox',{name:'Negotiation French response opening'}).fill('Ceci est un brouillon privé.');
 await expect(discovery.locator('.u31-oral')).toHaveAttribute('data-has-private-draft','true');
 page.once('dialog',dialog=>dialog.dismiss());
 await discovery.getByPlaceholder('Lesson topic or vocabulary').fill('transfer-151');
 await expect(discovery.getByRole('combobox',{name:'Select original French oral source'})).toHaveValue('transfer-152');
 await expect(panel.getByRole('textbox',{name:'Negotiation French response opening'})).toHaveValue('Ceci est un brouillon privé.');
});
