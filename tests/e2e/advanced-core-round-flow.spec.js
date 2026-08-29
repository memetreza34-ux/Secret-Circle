const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';
const ACTIVE_KEY = 'secret-circle-party-active-v1';
const PLAYERS = ['Alex', 'Sam', 'Mika', 'Lina', 'Noah', 'Lea', 'Emil', 'Sara'];

async function seed(page) {
  await page.goto('/party.html');
  await page.evaluate(({ hubKey, activeKey, players }) => {
    localStorage.setItem(hubKey, JSON.stringify({
      version: 1,
      players,
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
    localStorage.removeItem(activeKey);
  }, { hubKey: HUB_KEY, activeKey: ACTIVE_KEY, players: PLAYERS });
}

async function start(page, gameId) {
  await page.goto(`/advanced.html?game=${gameId}`);
  await page.locator('#advanced-length').selectOption('3');
  await page.locator('#advanced-start').click();
  await expect(page.locator('#advanced-play-layer')).toBeVisible();
}

async function active(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
}

test('Two Truths completes private input, shuffled vote and one scored round', async ({ page }) => {
  await seed(page);
  await start(page, 'two-truths');

  await page.getByLabel('Aussage 1').fill('Ich kann jonglieren');
  await page.getByLabel('Aussage 2').fill('Ich war schon in Island');
  await page.getByLabel('Aussage 3').fill('Ich habe einen Marathon gewonnen');
  await page.getByLabel('Welche Aussage ist die Lüge?').selectOption('2');
  await page.getByRole('button', { name: 'Aussagen mischen und verdecken' }).click();

  await expect(page.locator('#play-content')).toContainText('gespeichert und gemischt');
  await page.getByRole('button', { name: 'Aussagen für die Gruppe anzeigen' }).click();
  const state = await active(page);
  const lieIndex = state.session.advanced.lieIndex;
  expect(lieIndex).toBeGreaterThanOrEqual(0);
  expect(lieIndex).toBeLessThan(3);

  await page.locator('.statement-button').nth(lieIndex).click();
  await expect(page.locator('#play-eyebrow')).toHaveText('Richtig erkannt');
  await page.getByRole('button', { name: 'Nächste Person' }).click();

  const completed = await active(page);
  expect(completed.session.rounds).toBe(1);
  expect(completed.session.score).toBe(1);
  expect(completed.session.playerIndex).toBe(1);
});

test('Question Imposter completes private reveals, vote and one round', async ({ page }) => {
  await seed(page);
  await start(page, 'question-imposter');

  for (let index = 0; index < PLAYERS.length; index += 1) {
    await page.getByRole('button', { name: 'Meine Frage anzeigen' }).click();
    await page.getByRole('button', { name: 'Frage verdecken und weitergeben' }).click();
  }
  await expect(page.locator('#play-eyebrow')).toHaveText('Antworten vergleichen');
  await page.getByRole('button', { name: 'Geheime Abstimmung starten' }).click();

  const voting = await active(page);
  const imposter = voting.session.advanced.imposter;
  expect(PLAYERS).toContain(imposter);
  await page.getByRole('button', { name: imposter, exact: true }).click();
  await expect(page.locator('#play-eyebrow')).toHaveText('Imposter gefunden');
  await page.getByRole('button', { name: 'Nächste Runde' }).click();

  const completed = await active(page);
  expect(completed.session.rounds).toBe(1);
  expect(completed.session.score).toBe(2);
});

test('Location Spy completes private reveals, correct group vote and one round', async ({ page }) => {
  await seed(page);
  await start(page, 'location-spy');

  for (let index = 0; index < PLAYERS.length; index += 1) {
    await page.getByRole('button', { name: 'Karte anzeigen' }).click();
    await page.getByRole('button', { name: 'Karte schließen und weitergeben' }).click();
  }
  await expect(page.locator('#play-eyebrow')).toHaveText('Fragerunde');
  await page.getByRole('button', { name: 'Spion wählen' }).click();

  const voting = await active(page);
  const spy = voting.session.advanced.spy;
  expect(PLAYERS).toContain(spy);
  await page.getByRole('button', { name: spy, exact: true }).click();
  await expect(page.locator('#play-eyebrow')).toHaveText('Gruppe gewinnt');
  await page.getByRole('button', { name: 'Nächster Ort' }).click();

  const completed = await active(page);
  expect(completed.session.rounds).toBe(1);
  expect(completed.session.score).toBe(2);
});
