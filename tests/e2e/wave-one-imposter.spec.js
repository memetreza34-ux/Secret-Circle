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
  await expect(page.locator('#quick-group')).toContainText('Labs');
  await page.locator('#quick-pack').selectOption(pack);
  await page.locator('#quick-rounds').selectOption('3');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await expect(page.locator('#quick-play')).toBeVisible();
}

async function revealAll(page) {
  for (let index = 0; index < 4; index += 1) {
    await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
    await expect(page.getByRole('button', { name: 'Verstanden & verdecken' })).toBeVisible();
    await page.getByRole('button', { name: 'Verstanden & verdecken' }).click();
  }
  await expect(page.getByRole('button', { name: 'Geheime Abstimmung starten' })).toBeVisible();
}

async function voteOutActualImposter(page, imposterName) {
  await page.getByRole('button', { name: 'Geheime Abstimmung starten' }).click();
  const players = ['Alex', 'Sam', 'Mika', 'Lina'];
  for (const voter of players) {
    await page.getByRole('button', { name: 'Abstimmung öffnen' }).click();
    const target = voter === imposterName ? players.find(name => name !== voter && name !== imposterName) : imposterName;
    await page.getByRole('button', { name: target, exact: true }).click();
  }
}

test('Undercover similar-word uses private handoff, blur concealment and exact-once result resume', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'undercover-similar-word', 'Alltag');

  const initial = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(initial.gameId).toBe('undercover-similar-word');
  expect(initial.current.undercoverPlayer).toBeTruthy();
  expect(initial.current.civilian).toBeTruthy();
  expect(initial.current.undercover).toBeTruthy();

  const firstPlayer = initial.players[0];
  const expectedWord = firstPlayer === initial.current.undercoverPlayer ? initial.current.undercover : initial.current.civilian;
  await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
  await expect(page.locator('#quick-content')).toContainText(expectedWord);
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await expect(page.getByRole('button', { name: 'Geheime Karte anzeigen' })).toBeVisible();
  await expect(page.locator('#quick-content')).not.toContainText(expectedWord);

  await revealAll(page);
  await voteOutActualImposter(page, initial.current.undercoverPlayer);
  await expect(page.locator('#quick-content')).toContainText(`Imposter: ${initial.current.undercoverPlayer}`);

  const beforeReload = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(beforeReload.phase).toBe('result');
  expect(beforeReload.current.winner).toBe('group');
  expect(beforeReload.current.scored).toBe(true);

  await page.reload();
  await expect(page.locator('#quick-resume-box')).toBeVisible();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  const afterReload = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(afterReload.sessionId).toBe(beforeReload.sessionId);
  expect(afterReload.totalScore).toBe(beforeReload.totalScore);
  expect(afterReload.current.scored).toBe(true);
});

test('No-word Imposter gets exactly one last guess after being caught', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'no-word-imposter', 'Orte');
  const initial = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);

  await revealAll(page);
  await voteOutActualImposter(page, initial.current.undercoverPlayer);
  await expect(page.locator('#quick-player')).toContainText(initial.current.undercoverPlayer);
  await expect(page.locator('#quick-guess-input')).toBeVisible();

  await page.locator('#quick-guess-input').fill(initial.current.word);
  await page.getByRole('button', { name: 'Guess prüfen' }).click();
  await expect(page.locator('#quick-content')).toContainText(`Imposter: ${initial.current.undercoverPlayer}`);
  await expect(page.locator('#quick-content')).toContainText(`Gesuchtes Wort: ${initial.current.word}`);

  const result = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(result.phase).toBe('result');
  expect(result.current.winner).toBe('undercover');
  expect(result.current.guess.toLocaleLowerCase('de-DE')).toBe(initial.current.word.toLocaleLowerCase('de-DE'));
  expect(result.current.scored).toBe(true);
});

test('Wave 1 Imposter games use the same Quick-family replacement protection', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'undercover-similar-word', 'Essen');
  const before = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);

  await page.goto('/quick-play.html?game=no-word-imposter');
  await expect(page.locator('#quick-resume-box')).toBeHidden();
  page.once('dialog', dialog => {
    expect(dialog.message()).toContain('Undercover');
    expect(dialog.message()).toContain('Imposter ohne Wort');
    dialog.dismiss();
  });
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  const preserved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(preserved.gameId).toBe('undercover-similar-word');
  expect(preserved.sessionId).toBe(before.sessionId);
  await expect(page.locator('#quick-play')).toBeHidden();
});
