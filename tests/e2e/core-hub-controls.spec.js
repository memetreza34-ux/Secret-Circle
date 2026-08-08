const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';
const ACTIVE_KEY = 'secret-circle-party-hub-active-v1';

async function seedHub(page) {
  await page.goto('/party.html');
  await page.evaluate(({ hubKey, activeKey }) => {
    localStorage.setItem(hubKey, JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika', 'Lina'],
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
    localStorage.removeItem(activeKey);
  }, { hubKey: HUB_KEY, activeKey: ACTIVE_KEY });
  await page.reload();
}

async function startGame(page, gameId) {
  await page.locator(`[data-open-game="${gameId}"]`).first().click();
  await page.locator('#start-selected-game').click();
  await expect(page.locator('#play-layer')).toBeVisible();
}

test('global skip advances a round without awarding a point and finish records it once', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'truth-dare');

  await page.locator('#skip-hub-round').click();
  await expect(page.locator('#play-progress')).toContainText('1 Runden');
  await expect(page.locator('#hub-status')).toContainText('kein Punkt');

  const active = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
  expect(active.session.rounds).toBe(1);
  expect(active.session.score).toBe(0);

  await page.locator('#finish-hub-game').click();
  const hub = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), HUB_KEY);
  expect(hub.history).toHaveLength(1);
  expect(hub.history[0].rounds).toBe(1);
  expect(hub.history[0].score).toBe(0);
});

test('abort discards active progress and never writes history or stats', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'word-chain');
  await page.getByRole('button', { name: '30-Sekunden-Runde starten' }).click();
  await expect(page.locator('.timer-display')).toBeVisible();

  page.once('dialog', dialog => dialog.accept());
  await page.locator('#abort-hub-game').click();
  await expect(page.locator('#play-layer')).toBeHidden();

  const result = await page.evaluate(({ hubKey, activeKey }) => ({
    active: localStorage.getItem(activeKey),
    hub: JSON.parse(localStorage.getItem(hubKey))
  }), { hubKey: HUB_KEY, activeKey: ACTIVE_KEY });
  expect(result.active).toBeNull();
  expect(result.hub.history).toHaveLength(0);
  expect(result.hub.stats['word-chain']).toBeUndefined();
});

test('Escape uses the same confirmed discard path instead of silently saving', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'truth-dare');
  await page.getByRole('button', { name: 'Wahrheit' }).click();

  page.once('dialog', dialog => dialog.accept());
  await page.keyboard.press('Escape');
  await expect(page.locator('#play-layer')).toBeHidden();

  const result = await page.evaluate(({ hubKey, activeKey }) => ({
    active: localStorage.getItem(activeKey),
    hub: JSON.parse(localStorage.getItem(hubKey))
  }), { hubKey: HUB_KEY, activeKey: ACTIVE_KEY });
  expect(result.active).toBeNull();
  expect(result.hub.history).toHaveLength(0);
  expect(result.hub.stats['truth-dare']).toBeUndefined();
});