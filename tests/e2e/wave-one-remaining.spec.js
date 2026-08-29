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

test('Prozent schätzen derives the score from catalog answer and keeps result exact-once on resume', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'percent-guess', 'Alltag');
  const answer = await page.evaluate(key => {
    const state = JSON.parse(localStorage.getItem(key));
    return window.SecretCirclePartyCatalog.getItems('percent-guess', state.pack)[state.current.cardIndex].answer;
  }, QUICK_KEY);
  await page.locator('#quick-estimate-input').fill(String(answer));
  await page.getByRole('button', { name: 'Schätzung prüfen' }).click();
  await expect(page.locator('#quick-content')).toContainText('+3 Punkte');
  const before = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(before.phase).toBe('result');
  expect(before.current.points).toBe(3);
  expect(before.totalScore).toBe(3);

  await page.reload();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#quick-content')).toContainText('+3 Punkte');
  const after = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(after.sessionId).toBe(before.sessionId);
  expect(after.current.cardIndex).toBe(before.current.cardIndex);
  expect(after.current.guess).toBe(before.current.guess);
  expect(after.totalScore).toBe(before.totalScore);
});

test('Party Bracket reconstructs the same winner from seven stored picks after reload', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'party-bracket', 'Snacks');
  for (let decision = 0; decision < 7; decision += 1) {
    await page.locator('#quick-actions button').first().click();
  }
  await expect(page.locator('#quick-content')).toContainText('Bracket-Sieger:');
  const winnerBefore = await page.locator('#quick-content .success-text').textContent();
  const before = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(before.phase).toBe('result');
  expect(before.current.picks).toHaveLength(7);
  expect(before.current.scored).toBe(true);

  await page.reload();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#quick-content .success-text')).toHaveText(winnerBefore);
  const after = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(after.current.picks).toEqual(before.current.picks);
  expect(after.totalScore).toBe(before.totalScore);
});

test('Bluff Trivia conceals private fake input and scores the final vote only once', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'bluff-trivia', 'Allgemeinwissen');

  await page.getByRole('button', { name: 'Fake-Antwort eingeben' }).click();
  await page.locator('#quick-bluff-input').fill('Erfundene Antwort A');
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await expect(page.locator('#quick-bluff-input')).toHaveCount(0);
  await page.getByRole('button', { name: 'Fake-Antwort eingeben' }).click();
  await page.locator('#quick-bluff-input').fill('Erfundene Antwort A');
  await page.getByRole('button', { name: 'Speichern & verdecken' }).click();

  for (const text of ['Erfundene Antwort B', 'Erfundene Antwort C']) {
    await page.getByRole('button', { name: 'Fake-Antwort eingeben' }).click();
    await page.locator('#quick-bluff-input').fill(text);
    await page.getByRole('button', { name: 'Speichern & verdecken' }).click();
  }

  for (let voter = 0; voter < 3; voter += 1) {
    await page.getByRole('button', { name: 'Antworten anzeigen' }).click();
    await expect(page.locator('#quick-actions')).not.toContainText('von Alex');
    await page.locator('#quick-actions button').first().click();
  }
  await expect(page.locator('#quick-content')).toContainText('Richtige Antwort:');
  const before = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(before.phase).toBe('result');
  expect(before.current.votes).toHaveLength(3);
  expect(before.current.scored).toBe(true);

  await page.reload();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#quick-content')).toContainText('Richtige Antwort:');
  const after = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(after.totalScore).toBe(before.totalScore);
  expect(after.current.votes).toEqual(before.current.votes);
});

test('Ein-Wort-Hinweis never auto-reveals the target and keeps the resolved round stable', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'password-one-word', 'Alltag');
  await page.getByRole('button', { name: 'Zielwort anzeigen' }).click();
  const target = await page.locator('#quick-content .challenge-card').last().textContent();
  expect(target).toBeTruthy();
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await expect(page.getByRole('button', { name: 'Zielwort anzeigen' })).toBeVisible();
  await expect(page.locator('#quick-content')).not.toContainText(target);

  await page.getByRole('button', { name: 'Zielwort anzeigen' }).click();
  await page.locator('#quick-clue-input').fill('Hinweiswort');
  await page.getByRole('button', { name: 'Hinweis speichern & verdecken' }).click();
  await expect(page.locator('#quick-content')).toContainText('Hinweiswort');
  await expect(page.locator('#quick-content')).not.toContainText(target);
  await page.getByRole('button', { name: 'Erraten' }).click();
  await expect(page.locator('#quick-content')).toContainText(`Zielwort: ${target}`);
  const before = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(before.phase).toBe('result');
  expect(before.current.success).toBe(true);
  expect(before.current.scored).toBe(true);

  await page.reload();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#quick-content')).toContainText(`Zielwort: ${target}`);
  const after = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(after.totalScore).toBe(before.totalScore);
  expect(after.current.cardIndex).toBe(before.current.cardIndex);
});
