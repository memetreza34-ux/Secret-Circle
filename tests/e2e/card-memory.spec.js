'use strict';

/* v104: Das Kartengedächtnis sorgt dafür, dass eine zweite Session nicht mit
   Karten der ersten beginnt. Je ein Spiel jeder Engine-Familie: zwei Sessions
   mit je drei Runden in einer Kategorie mit mindestens sechs Karten dürfen
   keine gemeinsame Karte haben. */

const { test, expect } = require('@playwright/test');
const catalog = require('../../party-wave-one-clue-catalog.js');

const HUB_KEY = 'secret-circle-party-hub-v1';
const MEMORY_KEY = 'secret-circle-card-memory-v1';
const PLAYERS = ['Alex', 'Sam', 'Mika', 'Lina', 'Noah', 'Lea'];
const ROUNDS = 3;

async function seedHub(page) {
  await page.goto('/party.html');
  await page.evaluate(({ key, players }) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({ version: 1, players, favorites: [], recent: [], presets: [], history: [], stats: {} }));
  }, { key: HUB_KEY, players: PLAYERS });
}

function expectDisjoint(first, second, label) {
  expect(new Set(first).size, `${label}: Session 1 doppelt`).toBe(ROUNDS);
  expect(new Set(second).size, `${label}: Session 2 doppelt`).toBe(ROUNDS);
  const shared = first.filter(card => second.includes(card));
  expect(shared, `${label}: Session 2 wiederholt ${shared.join(', ')}`).toEqual([]);
}

const quickCases = [
  { gameId: 'draw-guess', async card(page) {
    await page.getByRole('button', { name: 'Karte anzeigen' }).click();
    const value = await page.locator('#quick-content .challenge-card').textContent();
    await page.getByRole('button', { name: 'Überspringen', exact: true }).click();
    return value;
  } },
  { gameId: 'tier-list', async card(page) {
    const value = await page.locator('#quick-content .challenge-card').textContent();
    await page.getByRole('button', { name: 'S-Tier', exact: true }).click();
    await page.getByRole('button', { name: 'Nächster Begriff' }).click();
    return value;
  } },
  { gameId: 'finish-the-sentence', async card(page) {
    const value = await page.locator('#quick-content .challenge-card').textContent();
    await page.getByRole('button', { name: 'Weiter', exact: true }).click();
    await page.getByRole('button', { name: 'Nächster Satz' }).click();
    return value;
  } },
  { gameId: 'fact-or-fake', async card(page) {
    const value = await page.locator('#quick-content .challenge-card').textContent();
    await page.getByRole('button', { name: 'Fakt', exact: true }).click();
    await page.getByRole('button', { name: /^(Nächste Aussage|Session abschließen)$/ }).click();
    return value;
  } }
];

for (const entry of quickCases) {
  test(`Kartengedächtnis ${entry.gameId}: zweite Session ohne Karten der ersten`, async ({ page }) => {
    const pack = catalog.getPackNames(entry.gameId)[0];
    expect(catalog.getItems(entry.gameId, pack).length).toBeGreaterThanOrEqual(ROUNDS * 2);
    await seedHub(page);
    await page.goto(`/quick-play.html?game=${entry.gameId}`);
    await page.locator('#quick-pack').selectOption(pack);
    await page.locator('#quick-rounds').selectOption(String(ROUNDS));
    await page.locator('#quick-start').click();
    const sessions = [[], []];
    for (const cards of sessions) {
      await expect(page.locator('#quick-play')).toBeVisible();
      for (let round = 1; round <= ROUNDS; round += 1) cards.push((await entry.card(page)).trim());
      await expect(page.locator('#quick-result')).toBeVisible();
      if (cards === sessions[0]) await page.locator('#quick-replay').click();
    }
    expectDisjoint(sessions[0], sessions[1], entry.gameId);
    /* Im Speicher stehen nur Prüfsummen, keine Kartentexte. */
    const stored = await page.evaluate(key => localStorage.getItem(key), MEMORY_KEY);
    expect(stored).toBeTruthy();
    for (const card of [...sessions[0], ...sessions[1]]) expect(stored).not.toContain(card);
  });
}

test('Kartengedächtnis Hub never-have: zweite Session ohne Karten der ersten', async ({ page }) => {
  await seedHub(page);
  const sessions = [[], []];
  for (const cards of sessions) {
    await page.goto('/#spiel=never-have');
    const banner = page.locator('.pwa-update-banner:visible');
    if (await banner.count()) await banner.getByRole('button', { name: 'Später' }).click();
    await page.locator('#start-btn').click();
    await expect(page.locator('#play-layer')).toBeVisible();
    for (let round = 1; round <= ROUNDS; round += 1) {
      cards.push(((await page.locator('#play-content').textContent()) || '').trim());
      await page.getByRole('button', { name: 'Nächste Karte' }).click();
    }
    await page.getByRole('button', { name: 'Beenden & speichern' }).click();
    await expect(page).toHaveURL(/\/v2-hub\.html$/);
  }
  expectDisjoint(sessions[0], sessions[1], 'never-have');
});

test('Kartengedächtnis Advanced question-imposter: zweite Session ohne Fragen der ersten', async ({ page }) => {
  await seedHub(page);
  const sessions = [[], []];
  for (const cards of sessions) {
    await page.goto('/advanced.html?game=question-imposter');
    await expect(page.locator('#advanced-player-help')).toContainText(`${PLAYERS.length} Personen sind bereit.`);
    await page.locator('#advanced-length').selectOption(String(ROUNDS));
    await page.locator('#advanced-start').click();
    for (let round = 1; round <= ROUNDS; round += 1) {
      for (let index = 0; index < PLAYERS.length; index += 1) {
        await page.getByRole('button', { name: 'Meine Frage anzeigen' }).click();
        /* Der Rundenzustand wird beim ersten Aufdecken gespeichert. */
        if (index === 0) {
          const state = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-active-v1')));
          cards.push(state.session.advanced.pair.main);
        }
        await page.getByRole('button', { name: 'Frage verdecken und weitergeben' }).click();
      }
      await page.getByRole('button', { name: 'Geheime Abstimmung starten' }).click();
      const imposter = (await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-active-v1')))).session.advanced.imposter;
      await page.getByRole('button', { name: imposter, exact: true }).click();
      await page.getByRole('button', { name: 'Nächste Runde' }).click();
    }
    await page.getByRole('button', { name: 'Session speichern und beenden' }).click();
    await expect(page).toHaveURL(/\/v2-hub\.html#profil$/);
  }
  expectDisjoint(sessions[0], sessions[1], 'question-imposter');
});
