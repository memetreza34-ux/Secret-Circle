const { test, expect } = require('@playwright/test');

async function seedHub(page) {
  await page.goto('/party.html');
  await page.evaluate(() => {
    localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika', 'Lina'],
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
    for (const key of [
      'secret-circle-party-quick-active-v1',
      'secret-circle-party-mega-active-v1',
      'secret-circle-party-viral-active-v1',
      'secret-circle-party-created-active-v1'
    ]) localStorage.removeItem(key);
  });
}

test('shared controls pause a running timer, skip, abort, replay and offer next game', async ({ page }) => {
  await seedHub(page);
  await page.goto('/quick-play.html?game=rapid-fire');
  await page.locator('#quick-rounds').selectOption('3');
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  await expect(page.locator('#quick-session-controls')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Runde überspringen' })).toBeVisible();
  await page.getByRole('button', { name: /Sekunden starten/ }).click();
  await expect(page.locator('.quick-timer')).toBeVisible();

  await page.waitForTimeout(350);
  await page.getByRole('button', { name: 'Pause' }).click();
  await expect(page.getByRole('button', { name: 'Fortsetzen' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#quick-pause-overlay')).toBeVisible();
  const frozenTimer = await page.locator('.quick-timer').textContent();
  await page.waitForTimeout(1_250);
  await expect(page.locator('.quick-timer')).toHaveText(frozenTimer);
  expect(await page.locator('#quick-actions').evaluate(node => node.inert)).toBe(true);

  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.getByRole('button', { name: 'Pause' })).toHaveAttribute('aria-pressed', 'false');
  expect(await page.locator('#quick-actions').evaluate(node => node.inert)).toBe(false);
  await page.waitForTimeout(1_100);
  await expect(page.locator('.quick-timer')).not.toHaveText(frozenTimer);

  await page.getByRole('button', { name: 'Runde überspringen' }).click();
  await expect(page.locator('#quick-progress')).toContainText('Runde 2 von 3');

  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Session beenden' }).click();
  await expect(page.locator('#quick-setup')).toBeVisible();
  await expect(page.locator('#quick-play')).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem('secret-circle-party-quick-active-v1'))).toBeNull();

  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await page.getByRole('button', { name: 'Runde überspringen' }).click();
  await page.getByRole('button', { name: 'Runde überspringen' }).click();
  await page.getByRole('button', { name: 'Runde überspringen' }).click();
  await expect(page.locator('#quick-result')).toBeVisible();

  const nextHref = await page.locator('#quick-next-game').getAttribute('href');
  expect(nextHref).toMatch(/^quick-play\.html\?game=/);
  expect(nextHref).not.toContain('game=rapid-fire');

  await page.getByRole('button', { name: 'Wiederholen' }).click();
  await expect(page.locator('#quick-play')).toBeVisible();
  await expect(page.locator('#quick-progress')).toContainText('Runde 1 von 3');
});

test('every fast engine loads controls and replacement guard before its engine', async ({ page }) => {
  await seedHub(page);
  const cases = [
    ['rapid-fire', 'party-quick-modes.js'],
    ['who-am-i', 'party-mega-modes.js'],
    ['hot-seat', 'party-viral-modes.js']
  ];

  for (const [gameId, engineSource] of cases) {
    await page.goto(`/quick-play.html?game=${gameId}`);
    await expect(page.locator('#quick-title')).not.toHaveText('Spiel laden');
    const sources = await page.locator('script[src]').evaluateAll(nodes => nodes.map(node => node.getAttribute('src')));
    const controlsIndex = sources.indexOf('party-session-controls.js');
    const guardIndex = sources.indexOf('quick-session-replacement-guard.js');
    const engineIndex = sources.indexOf(engineSource);
    expect(controlsIndex).toBeGreaterThanOrEqual(0);
    expect(guardIndex).toBeGreaterThan(controlsIndex);
    expect(engineIndex).toBeGreaterThan(guardIndex);
    await expect(page.getByRole('button', { name: 'Pause' })).toBeDisabled();
  }
});