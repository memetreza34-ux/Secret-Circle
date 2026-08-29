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
  const opener = page.locator(`[data-open-game="${gameId}"]`).first();
  if (await opener.count() === 0) {
    await page.locator('#browse-games').click();
  }
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
  await expect(page.locator('#hub-round-guide')).toContainText('Nur die darstellende Person');
  await expectFrozenTimer(page, 'Runde starten');
});

test('Scharade and Tabu conceal secret timer cards when the app loses focus', async ({ page }) => {
  const games = [
    ['charades', 'Runde starten', /darstellende Person/i],
    ['taboo', '60-Sekunden-Runde starten', /erklärende Person/i]
  ];

  for (const [gameId, startLabel, guide] of games) {
    await seedHub(page);
    await openHubGame(page, gameId);
    await expect(page.locator('#hub-round-guide')).toContainText(guide);
    await page.getByRole('button', { name: startLabel }).click();

    const secretBefore = (await page.locator('#play-content').textContent()) || '';
    expect(secretBefore.trim().length).toBeGreaterThan(0);
    await expect(page.getByRole('button', { name: 'Treffer' })).toBeVisible();

    await page.evaluate(() => window.dispatchEvent(new Event('blur')));
    await expect(page.locator('#play-content')).toBeHidden();
    await expect(page.locator('#play-options')).toBeHidden();
    await expect(page.locator('#play-actions')).toBeHidden();
    await expect(page.locator('#hub-private-prompt-cover')).toContainText('Geheime Karte wurde automatisch verdeckt');

    await page.getByRole('button', { name: 'Geheime Karte wieder anzeigen' }).click();
    await expect(page.locator('#hub-private-prompt-cover')).toHaveCount(0);
    await expect(page.locator('#play-content')).toBeVisible();
    await expect(page.locator('#play-content')).toHaveText(secretBefore);
    await expect(page.getByRole('button', { name: 'Treffer' })).toBeVisible();
  }
});

test('Wortkette timer freezes during pause and resumes with remaining time', async ({ page }) => {
  await seedHub(page);
  await openHubGame(page, 'word-chain');
  await expect(page.locator('#hub-round-guide')).toContainText('letzten Buchstaben');
  await expect(page.locator('#hub-round-guide')).toContainText('Keine Wiederholungen');
  await expectFrozenTimer(page, '30-Sekunden-Runde starten');
});

test('Heiße Kartoffel keeps its random remaining time hidden while paused', async ({ page }) => {
  await seedHub(page);
  await openHubGame(page, 'hot-potato');
  await expect(page.locator('#hub-round-guide')).toContainText('bei STOPP hält, verliert die Runde');
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
