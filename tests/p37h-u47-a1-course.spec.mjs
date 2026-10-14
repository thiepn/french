import {test,expect} from '@playwright/test';

/** Actual browser acceptance for U46/U47 original A1 Course and Listen.
 * Practice feedback is transient; synthetic playback is not a pronunciation grade.
 */
async function startOriginalA1Listen(page){
 await page.goto('/#course');
 await expect(page.getByRole('heading',{name:'Course',exact:true})).toBeVisible();
 await expect(page.locator('.u6-stage-nav')).toBeVisible({timeout:45_000});
 await page.locator('.u6-stage-nav').getByRole('button',{name:'4. Listen'}).click();
 await expect(page.locator('[data-u6-stage="listen"]')).toBeVisible();
 await expect(page.locator('.u7-listening-question')).toHaveCount(2);
}

test('U47 A1 source-grounded listening repairs, independent transfer, keyboard and Write handoff',async({page})=>{
 await startOriginalA1Listen(page);
 const sounds=page.locator('.u44-original-sounds');
 await sounds.locator('summary').click();
 await expect(sounds.locator('.u44-original-sound-case')).toHaveCount(2);
 await expect(sounds.locator('.u46-original-speech-transfer')).toContainText('Try it in another situation');
 const first=sounds.locator('.u44-original-sound-case').first();
 await expect(first.locator('.u44-sound-explanation')).toBeHidden();
 await first.getByRole('button',{name:'Show / hide French text and sound guidance'}).click();
 await expect(first.locator('.u44-sound-explanation')).toBeVisible();
 const question=page.locator('.u7-listening-question').nth(1);
 await question.locator('select').selectOption('Je suis professeur ici.');
 await question.getByRole('button',{name:'Check listening answer'}).click();
 await expect(question.getByRole('status')).toContainText('Not yet');
 await expect(question.locator('.u46-listen-source-support')).toBeVisible();
 await expect(question.getByText(/^Authored key:/)).toBeHidden();
 const revealTurn=question.getByRole('button',{name:'Read relevant original turn'});
 await revealTurn.focus();
 await expect(revealTurn).toBeFocused();
 await page.keyboard.press('Enter');
 await expect(question.locator('.u46-listen-source-turn')).toContainText('Malik:');
 await question.locator('select').selectOption('Moi, c’est Malik.');
 await question.getByRole('button',{name:'Check listening answer'}).click();
 await expect(question.getByRole('status')).toContainText('Matches the original authored answer');
 await question.getByRole('button',{name:'Reveal authored answer and explanation'}).click();
 await expect(question.getByText(/^Authored key:/)).toBeVisible();
 await page.locator('.u6-stage-nav').getByRole('button',{name:'6. Write'}).click();
 await expect(page.locator('[data-u6-stage="write"]')).toBeVisible();
 await expect(page.locator('[data-u6-stage="write"] textarea').first()).toBeVisible();
});

test('U47 A1 text-first fallback remains usable with unavailable device TTS',async({page})=>{
 await page.addInitScript(()=>{
  Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:undefined});
 });
 await startOriginalA1Listen(page);
 await expect(page.getByRole('button',{name:'Play TTS dialogue'})).toBeDisabled();
 await expect(page.getByRole('button',{name:'Play slowly'})).toBeDisabled();
 const sounds=page.locator('.u44-original-sounds');
 await sounds.locator('summary').click();
 await expect(sounds.getByRole('button',{name:'Hear A'}).first()).toBeDisabled();
 await sounds.getByRole('button',{name:'Show / hide French text and sound guidance'}).first().click();
 await expect(sounds.locator('.u44-sound-explanation').first()).toBeVisible();
 await page.getByRole('button',{name:'Show French transcript'}).click();
 await expect(page.locator('.u7-listening-transcript')).toBeVisible();
 await expect(page.locator('.u7-listening-transcript')).toContainText('Bonjour');
 const question=page.locator('.u7-listening-question').nth(1);
 await question.locator('select').selectOption('Je suis professeur ici.');
 await question.getByRole('button',{name:'Check listening answer'}).click();
 await expect(question.getByRole('button',{name:'Read relevant original turn'})).toBeVisible();
 await question.getByRole('button',{name:'Read relevant original turn'}).click();
 await expect(question.locator('.u46-listen-source-turn')).toContainText('Malik:');
});
