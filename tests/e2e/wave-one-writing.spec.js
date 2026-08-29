const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';
const QUICK_KEY = 'secret-circle-party-quick-active-v1';

async function seedHub(page) {
  await page.goto('/party.html');
  await page.evaluate(({ hubKey, quickKey }) => {
    localStorage.setItem(hubKey, JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika'],
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
    localStorage.removeItem(quickKey);
  }, { hubKey: HUB_KEY, quickKey: QUICK_KEY });
}

async function startGame(page, gameId, pack) {
  await page.goto(`/quick-play.html?game=${gameId}`);
  await expect(page.locator('#quick-title')).not.toHaveText('Spiel laden');
  await page.locator('#quick-pack').selectOption(pack);
  await page.locator('#quick-rounds').selectOption('3');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await expect(page.locator('#quick-play')).toBeVisible();
  await expect(page.locator('#quick-group')).toContainText('Labs');
}

async function submitPrivateAnswer(page, text) {
  await page.getByRole('button', { name: 'Antwort eingeben' }).click();
  await page.locator('#quick-writing-input').fill(text);
  await page.getByRole('button', { name: 'Antwort speichern & verdecken' }).click();
}

test('Wave 1 writing private entry conceals on blur without losing the stored round', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'fill-blank-battle', 'Alltag');
  await page.getByRole('button', { name: 'Antwort eingeben' }).click();
  await page.locator('#quick-writing-input').fill('Nur lokal sichtbar');
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await expect(page.locator('#quick-writing-input')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Antwort eingeben' })).toBeVisible();
  const snapshot = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(snapshot.phase).toBe('collect');
  expect(snapshot.current.answers).toHaveLength(0);
});

test('Satzduell keeps anonymous result and score exact-once through reload/resume', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'fill-blank-battle', 'Alltag');
  await submitPrivateAnswer(page, 'Antwort Alpha');
  await submitPrivateAnswer(page, 'Antwort Beta');
  await submitPrivateAnswer(page, 'Antwort Gamma');

  const voteButtons = page.locator('#quick-actions button');
  await expect(voteButtons).toHaveCount(3);
  for (const name of ['Alex', 'Sam', 'Mika']) await expect(page.locator('#quick-actions')).not.toContainText(name);
  await voteButtons.first().click();
  await expect(page.locator('#quick-content')).toContainText('Geschrieben von');

  const before = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(before.gameId).toBe('fill-blank-battle');
  expect(before.phase).toBe('result');
  expect(before.current.scored).toBe(true);
  expect(before.totalScore).toBe(1);

  await page.reload();
  await expect(page.locator('#quick-resume-box')).toBeVisible();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#quick-content')).toContainText('Geschrieben von');
  const after = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(after.sessionId).toBe(before.sessionId);
  expect(after.totalScore).toBe(before.totalScore);
  expect(after.current.winnerIndex).toBe(before.current.winnerIndex);
});

test('Wer hat das geschrieben reveals authors only after all guesses and resumes the result', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'who-wrote-it', 'Icebreaker');
  await submitPrivateAnswer(page, 'Antwort Eins');
  await submitPrivateAnswer(page, 'Antwort Zwei');
  await submitPrivateAnswer(page, 'Antwort Drei');

  await expect(page.locator('#quick-content')).toContainText('Anonyme Antwort');
  await expect(page.locator('#quick-content')).not.toContainText('— Alex');
  for (let index = 0; index < 3; index += 1) {
    await page.getByRole('button', { name: 'Alex', exact: true }).click();
  }
  await expect(page.locator('#quick-content')).toContainText(/— (Alex|Sam|Mika)/);

  const before = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(before.gameId).toBe('who-wrote-it');
  expect(before.phase).toBe('result');
  expect(before.current.guessIndex).toBe(3);
  expect(before.current.scored).toBe(true);

  await page.reload();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#quick-content')).toContainText(/— (Alex|Sam|Mika)/);
  const after = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(after.sessionId).toBe(before.sessionId);
  expect(after.totalScore).toBe(before.totalScore);
  expect(after.current.correctCount).toBe(before.current.correctCount);
});
