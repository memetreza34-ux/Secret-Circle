const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/party.html');
  await page.evaluate(() => localStorage.clear());
});

test('history repairs cumulative play round and best-score statistics', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika'],
      favorites: [],
      recent: ['charades'],
      presets: [],
      history: [
        { id: 'two', gameId: 'charades', title: 'Scharade', endedAt: new Date().toISOString(), rounds: 3, score: 4 },
        { id: 'one', gameId: 'charades', title: 'Scharade', endedAt: new Date(Date.now() - 1000).toISOString(), rounds: 2, score: 1 }
      ],
      stats: { charades: { plays: 1, rounds: 2, best: 1 } }
    }));
  });
  await page.reload();
  await page.getByRole('button', { name: 'Verlauf' }).click();

  await expect.poll(() => page.evaluate(() => {
    const stats = JSON.parse(localStorage.getItem('secret-circle-party-hub-v1')).stats.charades;
    return `${stats.plays}:${stats.rounds}:${stats.best}`;
  })).toBe('2:5:4');
  await expect(page.locator('#hub-history')).toContainText('Scharade');
  await expect(page.locator('#achievement-count')).toHaveText('1');
});

test('statistics repair never reduces newer aggregate values', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika'],
      favorites: [], recent: [], presets: [],
      history: [{ id: 'one', gameId: 'hot-takes', title: 'Hot Takes', endedAt: new Date().toISOString(), rounds: 1, score: 0 }],
      stats: { 'hot-takes': { plays: 7, rounds: 20, best: 9 } }
    }));
  });
  await page.reload();
  await page.getByRole('button', { name: 'Verlauf' }).click();
  const stats = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-hub-v1')).stats['hot-takes']);
  expect(stats).toEqual({ plays: 7, rounds: 20, best: 9 });
});
