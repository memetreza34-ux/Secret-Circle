const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';
const ACTIVE_KEY = 'secret-circle-party-active-v1';
const GAMES = ['two-truths', 'question-imposter', 'location-spy', 'mafia'];

async function seed(page) {
  await page.goto('/party.html');
  await page.evaluate(({ hubKey, activeKey }) => {
    localStorage.setItem(hubKey, JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika', 'Lina', 'Noah', 'Lea', 'Emil', 'Sara'],
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
    localStorage.removeItem(activeKey);
  }, { hubKey: HUB_KEY, activeKey: ACTIVE_KEY });
}

for (const gameId of GAMES) {
  test(`${gameId} safe exit preserves the active session and does not count a completed play`, async ({ page }) => {
    await seed(page);
    await page.goto(`/advanced.html?game=${gameId}`);
    await page.locator('#advanced-length').selectOption('3');
    await page.locator('#advanced-start').click();
    await expect(page.locator('#advanced-play-layer')).toBeVisible();

    const before = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
    expect(before?.session?.id).toBeTruthy();

    page.once('dialog', dialog => dialog.accept());
    const navigation = page.waitForURL(/party\.html$/);
    await page.locator('#advanced-exit').click();
    await navigation;

    const result = await page.evaluate(({ hubKey, activeKey, id }) => {
      const hub = JSON.parse(localStorage.getItem(hubKey));
      const active = JSON.parse(localStorage.getItem(activeKey));
      return {
        active,
        history: hub.history.filter(entry => entry.gameId === id),
        stats: hub.stats[id] || null
      };
    }, { hubKey: HUB_KEY, activeKey: ACTIVE_KEY, id: gameId });

    expect(result.active).toBeTruthy();
    expect(result.active.gameId).toBe(gameId);
    expect(result.active.session.id).toBe(before.session.id);
    expect(result.history).toHaveLength(0);
    expect(result.stats).toBeNull();
  });
}
