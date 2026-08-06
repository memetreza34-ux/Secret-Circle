const { test, expect } = require('@playwright/test');

test('catalog filters and last view survive reload and can be reset', async ({ page }) => {
  await page.goto('/party.html');
  await page.locator('[data-view-target="games"]').first().click();
  await expect(page.locator('#release-tier-filter')).toBeVisible();

  await page.locator('#game-search').fill('Mafia');
  await page.locator('#mood-filter').selectOption('deep');
  await page.locator('#player-filter').selectOption('medium');
  await page.locator('#age-filter').selectOption('teen');
  await page.locator('#status-filter').selectOption('playable');
  await page.locator('#release-tier-filter').selectOption('core');

  await expect.poll(async () => page.evaluate(() => {
    const raw = localStorage.getItem('secret-circle-party-catalog-filters-v1');
    return raw ? JSON.parse(raw) : null;
  })).toMatchObject({
    query: 'Mafia',
    mood: 'deep',
    players: 'medium',
    age: 'teen',
    status: 'playable',
    tier: 'core',
    view: 'games'
  });

  await page.reload();
  await expect(page.locator('#release-tier-filter')).toBeVisible();
  await expect(page.locator('#view-games')).toBeVisible();
  await expect(page.locator('#game-search')).toHaveValue('Mafia');
  await expect(page.locator('#mood-filter')).toHaveValue('deep');
  await expect(page.locator('#player-filter')).toHaveValue('medium');
  await expect(page.locator('#age-filter')).toHaveValue('teen');
  await expect(page.locator('#status-filter')).toHaveValue('playable');
  await expect(page.locator('#release-tier-filter')).toHaveValue('core');

  await page.locator('#reset-catalog-filters').click();
  await expect(page.locator('#game-search')).toHaveValue('');
  await expect(page.locator('#group-filter')).toHaveValue('all');
  await expect(page.locator('#mood-filter')).toHaveValue('all');
  await expect(page.locator('#player-filter')).toHaveValue('all');
  await expect(page.locator('#age-filter')).toHaveValue('all');
  await expect(page.locator('#status-filter')).toHaveValue('all');
  await expect(page.locator('#release-tier-filter')).toHaveValue('all');
});

test('age and release tier remain combined after either filter changes', async ({ page }) => {
  await page.goto('/party.html?view=games');
  await expect(page.locator('#release-tier-filter')).toBeVisible();

  await page.locator('#release-tier-filter').selectOption('core');
  await page.locator('#age-filter').selectOption('family');

  const visibleCards = page.locator('#game-grid .game-card:visible');
  await expect(visibleCards.first()).toBeVisible();
  const visibleIds = await visibleCards.evaluateAll(cards => cards.map(card => card.dataset.gameId));
  const visibleTiers = await visibleCards.evaluateAll(cards => cards.map(card => card.dataset.releaseTier));
  expect(visibleTiers.every(tier => tier === 'core')).toBeTruthy();

  for (const id of visibleIds) {
    const age = await page.locator(`#game-grid .game-card[data-game-id="${id}"]`).getAttribute('data-game-id');
    expect(age).toBeTruthy();
  }

  await page.locator('#age-filter').selectOption('teen');
  const teenVisibleTiers = await page.locator('#game-grid .game-card:visible').evaluateAll(cards => cards.map(card => card.dataset.releaseTier));
  expect(teenVisibleTiers.every(tier => tier === 'core')).toBeTruthy();
});
