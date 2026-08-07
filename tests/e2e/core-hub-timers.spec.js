const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';

async function seedHub(page) {
  await page.goto('/party.html');
  await page.evaluate(key => {
    localStorage.setItem(key, JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika', 'Lina'],
      favorites: [],
      recent: [],
      presets: [],
      history: [],
      stats: {}
    }));
  }, HUB_KEY);
  await page.reload();
}

async function openHubGame(page, gameId) {
  await page.locator(`[data-open-game="${gameId}"]`).first().click();
  await page.locator('#start-selected-game').click();
  await expect(page.locator('#play-layer')).toBeVisible();
}

async function expectFrozenTimer(page, startButtonName) {
  await page.getByRole('button', { name: startButtonName }).click();
  const timer = page.locator('.timer-display').first();
  await expect(timer).toBeVisible();
  await page.waitForTimeout(1100);

  await page.locator('#pause-hub-game').click();
  await expect(page.locator('#pause-hub-game')).toHaveText('Fortsetzen');
  await expect(page.locator('#play-pause-status')).toContainText('Timer steht');
  expect(await page.locator('#play-options').evaluate(node => node.inert)).toBe(true);
  expect(await page.locator('#play-actions').evaluate(node => node.inert)).toBe(true);

  const frozen = await timer.textContent();
  await page.waitForTimeout(1400);
  await expect(timer).toHaveText(frozen);

  await page.locator('#pause-hub-game').click();
  await expect(page.locator('#pause-hub-game')).toHaveText('Pause');
  expect(await page.locator('#play-options').evaluate(node => node.inert)).toBe(false);
  expect(await page.locator('#play-actions').evaluate(node => node.inert)).toBe(false);
  await page.waitForTimeout(1200);
  expect(await timer.textContent()).not.toBe(frozen);
}

test('Scharade timer freezes during pause and resumes with remaining time', async ({ page }) => {
  await seedHub(page);
  await openHubGame(page, 'charades');
  await expectFrozenTimer(page, 'Runde starten');
});

test('Wortkette timer freezes during pause and resumes with remaining time', async ({ page }) => {
  await seedHub(page);
  await openHubGame(page, 'word-chain');
  await expectFrozenTimer(page, '30-Sekunden-Runde starten');
});

test('Heiße Kartoffel keeps its random remaining time hidden while paused', async ({ page }) => {
  await seedHub(page);
  await openHubGame(page, 'hot-potato');
  await page.getByRole('button', { name: 'Zufallstimer starten' }).click();

  const indicator = page.locator('.timer-display').first();
  await expect(indicator).toHaveText('●');
  await page.locator('#pause-hub-game').click();
  await expect(page.locator('#pause-hub-game')).toHaveText('Fortsetzen');
  await page.waitForTimeout(1500);
  await expect(indicator).toHaveText('●');
  await expect(page.locator('#play-pause-status')).toContainText('Timer steht');

  await page.locator('#pause-hub-game').click();
  await expect(page.locator('#pause-hub-game')).toHaveText('Pause');
});
