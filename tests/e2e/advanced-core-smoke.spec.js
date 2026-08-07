const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';
const ADVANCED_ACTIVE_KEY = 'secret-circle-party-advanced-active-v1';
const GAMES = ['two-truths', 'question-imposter', 'location-spy', 'mafia'];

async function seedPlayers(page) {
  await page.goto('/party.html');
  await page.evaluate(({ hubKey, activeKey }) => {
    localStorage.setItem(hubKey, JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika', 'Lina', 'Noah', 'Lea', 'Emil', 'Sara'],
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
    localStorage.removeItem(activeKey);
  }, { hubKey: HUB_KEY, activeKey: ADVANCED_ACTIVE_KEY });
}

for (const gameId of GAMES) {
  test(`${gameId} starts through the shared Advanced runner and persists an active session`, async ({ page }) => {
    await seedPlayers(page);
    await page.goto(`/advanced.html?game=${gameId}`);

    await expect(page.locator('#advanced-start')).toBeVisible();
    await expect(page.locator('#advanced-pack')).toBeVisible();
    await expect(page.locator('#advanced-length')).toBeVisible();
    await page.locator('#advanced-length').selectOption('3');
    await page.locator('#advanced-start').click();

    await expect(page.locator('#advanced-play-layer')).toBeVisible();
    const active = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ADVANCED_ACTIVE_KEY);
    expect(active).toBeTruthy();
    expect(active.version).toBe(2);
    expect(active.gameId).toBe(gameId);
    expect(active.players).toEqual(['Alex', 'Sam', 'Mika', 'Lina', 'Noah', 'Lea', 'Emil', 'Sara']);

    await page.reload();
    await expect(page.locator('#advanced-play-layer')).toBeVisible();
    const resumed = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ADVANCED_ACTIVE_KEY);
    expect(resumed.gameId).toBe(gameId);
    expect(resumed.players).toEqual(active.players);

    page.once('dialog', dialog => dialog.accept());
    await page.locator('#advanced-exit').click();
    await expect(page.locator('#advanced-play-layer')).toBeHidden();
    expect(await page.evaluate(key => localStorage.getItem(key), ADVANCED_ACTIVE_KEY)).toBeNull();
  });
}
