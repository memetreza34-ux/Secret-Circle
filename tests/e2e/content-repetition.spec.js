'use strict';

/* Issue #41: Wiederholen sich Karten? Für je ein Spiel jeder Engine-Familie
   zehn Runden spielen: Solange die Kategorie unbenutzte Karten hat, darf
   keine Karte doppelt kommen; danach beginnt der Stapel neu. Wiederholungen
   zwischen zwei Sessions sind bewusst nicht Teil dieses Tests: Jede Session
   mischt den ganzen Stapel neu (siehe Bericht in Issue #41). */

const { test, expect } = require('@playwright/test');
const catalog = require('../../party-wave-one-clue-catalog.js');

const HUB_KEY = 'secret-circle-party-hub-v1';
const PLAYERS = ['Alex', 'Sam', 'Mika', 'Lina'];
const ROUNDS = 10;

async function seedHub(page) {
  await page.goto('/party.html');
  await page.evaluate(({ key, players }) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({ version: 1, players, favorites: [], recent: [], presets: [], history: [], stats: {} }));
  }, { key: HUB_KEY, players: PLAYERS });
}

async function startQuickPlay(page, gameId, pack) {
  await seedHub(page);
  await page.goto(`/quick-play.html?game=${gameId}`);
  await page.locator('#quick-pack').selectOption(pack);
  await page.locator('#quick-rounds').selectOption(String(ROUNDS));
  await page.locator('#quick-start').click();
  await expect(page.locator('#quick-play')).toBeVisible();
}

const cases = [
  {
    gameId: 'draw-guess', engine: 'Quick',
    async card(page) {
      await page.getByRole('button', { name: 'Karte anzeigen' }).click();
      const value = await page.locator('#quick-content .challenge-card').textContent();
      await page.getByRole('button', { name: 'Überspringen', exact: true }).click();
      return value;
    }
  },
  {
    gameId: 'tier-list', engine: 'Trend',
    async card(page) {
      const value = await page.locator('#quick-content .challenge-card').textContent();
      await page.getByRole('button', { name: 'S-Tier', exact: true }).click();
      await page.getByRole('button', { name: 'Nächster Begriff' }).click();
      return value;
    }
  },
  {
    gameId: 'finish-the-sentence', engine: 'Viral',
    async card(page) {
      const value = await page.locator('#quick-content .challenge-card').textContent();
      await page.getByRole('button', { name: 'Weiter', exact: true }).click();
      await page.getByRole('button', { name: 'Nächster Satz' }).click();
      return value;
    }
  },
  {
    gameId: 'fact-or-fake', engine: 'Wave-One',
    async card(page) {
      const value = await page.locator('#quick-content .challenge-card').textContent();
      await page.getByRole('button', { name: 'Fakt', exact: true }).click();
      await page.getByRole('button', { name: 'Nächste Aussage' }).click();
      return value;
    }
  }
];

for (const entry of cases) {
  test(`${entry.engine} ${entry.gameId}: keine Karte doppelt, solange die Kategorie unbenutzte Karten hat`, async ({ page }) => {
    const pack = catalog.getPackNames(entry.gameId)[0];
    const size = catalog.getItems(entry.gameId, pack).length;
    await startQuickPlay(page, entry.gameId, pack);
    const cards = [];
    for (let round = 1; round <= ROUNDS; round += 1) {
      await expect(page.locator('#quick-progress')).toHaveText(`Runde ${round} von ${ROUNDS}`);
      cards.push((await entry.card(page)).trim());
    }
    const firstPass = cards.slice(0, Math.min(size, ROUNDS));
    expect(new Set(firstPass).size, `${entry.gameId}/${pack}: ${firstPass.join(' | ')}`).toBe(firstPass.length);
    if (size < ROUNDS) {
      /* Erst nach einem vollen Durchgang dürfen Karten wiederkommen. */
      expect(new Set(firstPass)).toEqual(new Set(catalog.getItems(entry.gameId, pack).map(item => typeof item === 'string' ? item : item.statement)));
    }
    await expect(page.locator('#quick-result')).toBeVisible();
  });
}

test('Hub never-have: zehn Runden ohne doppelte Karte', async ({ page }) => {
  await seedHub(page);
  await page.goto('/#spiel=never-have');
  await expect(page.locator('[data-screen="mode"]')).toBeVisible();
  const banner = page.locator('.pwa-update-banner:visible');
  if (await banner.count()) await banner.getByRole('button', { name: 'Später' }).click();
  await page.locator('#start-btn').click();
  await expect(page.locator('#play-layer')).toBeVisible();
  const cards = [];
  for (let round = 1; round <= ROUNDS; round += 1) {
    cards.push(((await page.locator('#play-content').textContent()) || '').trim());
    await page.getByRole('button', { name: 'Nächste Karte' }).click();
  }
  expect(new Set(cards).size, cards.join(' | ')).toBe(ROUNDS);
});
