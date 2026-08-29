const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';

async function seedHub(page) {
  await page.goto('/party.html');
  await page.evaluate(key => {
    localStorage.setItem(key, JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika', 'Lina', 'Noah', 'Lea'],
      favorites: [],
      recent: [],
      presets: [],
      history: [],
      stats: {}
    }));
  }, HUB_KEY);
  await page.reload();
}

async function hubState(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), HUB_KEY);
}

test('opening an Advanced core game updates recent but never plays', async ({ page }) => {
  await seedHub(page);
  await page.locator('[data-open-game="mafia"]').first().click();
  await expect(page.locator('#detail-title')).toHaveText('Mafia');

  const navigation = page.waitForURL(/advanced\.html\?game=mafia$/);
  await page.locator('#start-selected-game').click();
  await navigation;

  const state = await hubState(page);
  expect(state.recent[0]).toBe('mafia');
  expect(state.stats.mafia).toBeUndefined();
  expect(state.history).toHaveLength(0);
});

test('a completed direct Hub round counts once and a zero-round finish counts zero', async ({ page }) => {
  await seedHub(page);

  await page.locator('[data-open-game="truth-dare"]').first().click();
  await expect(page.locator('#detail-title')).toHaveText('Wahrheit oder Pflicht');
  await page.locator('#start-selected-game').click();
  await expect(page.locator('#play-layer')).toBeVisible();

  await page.getByRole('button', { name: 'Wahrheit' }).click();
  await page.getByRole('button', { name: /Erledigt.*nächste Person/ }).click();
  await expect(page.locator('#play-progress')).toContainText('1 Runden');
  await page.getByRole('button', { name: 'Beenden & speichern' }).click();
  await expect(page.locator('#play-layer')).toBeHidden();

  let state = await hubState(page);
  expect(state.history).toHaveLength(1);
  expect(state.history[0].gameId).toBe('truth-dare');
  expect(state.history[0].rounds).toBe(1);
  expect(state.history[0].id).toMatch(/^completion-hub-/);
  expect(state.stats['truth-dare']).toEqual({ plays: 1, rounds: 1, best: 0 });

  await page.locator('[data-open-game="truth-dare"]').first().click();
  await page.locator('#start-selected-game').click();
  await page.getByRole('button', { name: 'Beenden & speichern' }).click();

  state = await hubState(page);
  expect(state.history).toHaveLength(1);
  expect(state.stats['truth-dare']).toEqual({ plays: 1, rounds: 1, best: 0 });
});