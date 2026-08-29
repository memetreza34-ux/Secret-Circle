const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';
const QUICK_KEY = 'secret-circle-party-quick-active-v1';

async function seedHub(page) {
  await page.goto('/party.html');
  await page.evaluate(({ hubKey, quickKey }) => {
    localStorage.setItem(hubKey, JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika', 'Lina'],
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
}

test('Party Quiz resolves exactly once and keeps the result stable through reload/resume', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'party-quiz', 'Allgemeinwissen');
  await expect(page.locator('#quick-group')).toContainText('Labs');
  await expect(page.locator('#quick-round-title')).toHaveText('Party Quiz');

  const answerButtons = page.locator('#quick-actions button');
  await expect(answerButtons).toHaveCount(4);
  await answerButtons.first().click();
  await expect(page.locator('#quick-content')).toContainText(/Richtig|Nicht ganz/);

  const before = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(before.gameId).toBe('party-quiz');
  expect(before.phase).toBe('result');
  expect(before.current.selected).not.toBeNull();
  expect([0, 1]).toContain(before.totalScore);

  await page.reload();
  await expect(page.locator('#quick-resume-box')).toBeVisible();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#quick-content')).toContainText(/Richtig|Nicht ganz/);

  const after = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(after.sessionId).toBe(before.sessionId);
  expect(after.round).toBe(before.round);
  expect(after.totalScore).toBe(before.totalScore);
  expect(after.current.selected).toBe(before.current.selected);
});

test('Fake oder Fakt is playable as a separate Wave 1 Labs mode', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'fact-or-fake', 'Natur');
  await expect(page.locator('#quick-group')).toContainText('Labs');
  await expect(page.locator('#quick-round-title')).toHaveText('Fake oder Fakt');
  await expect(page.getByRole('button', { name: 'Fakt' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Fake' })).toBeVisible();

  await page.getByRole('button', { name: 'Fakt' }).click();
  await expect(page.locator('#quick-content')).toContainText(/Richtig|Nicht ganz/);
  const snapshot = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(snapshot.gameId).toBe('fact-or-fake');
  expect(snapshot.phase).toBe('result');
  expect(typeof snapshot.current.selected).toBe('boolean');
});

test('Wave 1 games share Quick-family replacement protection across games', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'party-quiz', 'Technik');
  const before = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);

  await page.goto('/quick-play.html?game=fact-or-fake');
  await expect(page.locator('#quick-resume-box')).toBeHidden();
  page.once('dialog', dialog => {
    expect(dialog.message()).toContain('Party Quiz');
    expect(dialog.message()).toContain('Fake oder Fakt');
    dialog.dismiss();
  });
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  const preserved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(preserved.gameId).toBe('party-quiz');
  expect(preserved.sessionId).toBe(before.sessionId);
  await expect(page.locator('#quick-play')).toBeHidden();
});
