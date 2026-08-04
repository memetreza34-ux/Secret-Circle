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

  expect(await page.evaluate(() => window.SecretCirclePartyHubPlus?.version)).toBe(5);
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

test('invalid negative and non-finite history values are normalized safely', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika'],
      favorites: [], recent: [], presets: [],
      history: [
        { id: 'one', gameId: 'charades', title: 'Scharade', endedAt: new Date().toISOString(), rounds: -8, score: -4 },
        { id: 'two', gameId: 'missing-game', title: 'Falsch', endedAt: new Date().toISOString(), rounds: 999, score: 999 }
      ],
      stats: { charades: { plays: -1, rounds: -2, best: -3 } }
    }));
  });
  await page.reload();
  const stats = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-hub-v1')).stats.charades);
  expect(stats).toEqual({ plays: 1, rounds: 0, best: 0 });
  await page.getByRole('button', { name: 'Verlauf' }).click();
  await expect(page.locator('#achievement-count')).toHaveText('1');
});

test('statistics storage failure is reported without breaking the Hub', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika'],
      favorites: [], recent: [], presets: [],
      history: [{ id: 'one', gameId: 'charades', title: 'Scharade', endedAt: new Date().toISOString(), rounds: 2, score: 3 }],
      stats: {}
    }));
  });
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === 'secret-circle-party-hub-v1' && String(value).includes('"plays":1')) {
        throw new DOMException('simulierter Statistikfehler', 'QuotaExceededError');
      }
      return original.call(this, key, value);
    };
  });
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Der ganze Spieleabend in einer App' })).toBeVisible();
  await expect(page.locator('#hub-status')).toContainText('Statistik konnte nicht repariert');
  const stats = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-hub-v1')).stats);
  expect(stats).toEqual({});
});

test('preference storage failure keeps the current filter usable and reports persistence loss', async ({ page }) => {
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key === 'secret-circle-party-preferences-v1') {
        throw new DOMException('simulierter Einstellungsfehler', 'QuotaExceededError');
      }
      return original.call(this, key, value);
    };
  });
  await page.reload();
  await page.getByRole('button', { name: 'Daten' }).click();
  await page.locator('#settings-age-level').selectOption('family');
  await expect(page.locator('#hub-status')).toContainText('gilt nur bis zum Neuladen');
  await expect(page.locator('#settings-age-level')).toHaveValue('family');
  expect(await page.evaluate(() => localStorage.getItem('secret-circle-party-preferences-v1'))).toBeNull();
});
