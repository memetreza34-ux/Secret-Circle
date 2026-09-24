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

  const familyVisible = await page.locator('#game-grid .game-card:visible').evaluateAll(cards => cards.map(card => {
    const game = window.SecretCirclePartyCatalog.getGame(card.dataset.gameId);
    return { id: card.dataset.gameId, tier: card.dataset.releaseTier, age: game?.age };
  }));
  expect(familyVisible.length).toBeGreaterThan(0);
  expect(familyVisible.every(item => item.tier === 'core')).toBeTruthy();
  expect(familyVisible.every(item => item.age === 'all')).toBeTruthy();

  await page.locator('#age-filter').selectOption('teen');
  const teenVisible = await page.locator('#game-grid .game-card:visible').evaluateAll(cards => cards.map(card => {
    const game = window.SecretCirclePartyCatalog.getGame(card.dataset.gameId);
    return { tier: card.dataset.releaseTier, age: game?.age };
  }));
  expect(teenVisible.length).toBeGreaterThanOrEqual(familyVisible.length);
  expect(teenVisible.every(item => item.tier === 'core')).toBeTruthy();
  expect(teenVisible.every(item => item.age === 'all' || item.age === 'teen')).toBeTruthy();
});

test('filter bar stays inside the page on tablet landscape widths', async ({ page }) => {
  /* Zwischen etwa 1000 und 1060 px ragte der Reifestufe-Filter aus der Leiste,
     weil er eine feste Mindestbreite hatte. Die Seite scrollte dann seitlich. */
  for (const width of [1001, 1024, 1060]) {
    await page.setViewportSize({ width, height: 768 });
    await page.goto('/party.html?view=games');
    await expect(page.locator('#release-tier-filter')).toBeVisible();
    const layout = await page.evaluate(() => {
      const bar = document.querySelector('.filter-bar').getBoundingClientRect();
      const tier = document.querySelector('#release-tier-filter').getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        tierPastBar: tier.right - bar.right
      };
    });
    expect(layout.overflow, `Seitlicher Überlauf bei ${width} px`).toBeLessThanOrEqual(0);
    expect(layout.tierPastBar, `Reifestufe ragt bei ${width} px aus der Leiste`).toBeLessThanOrEqual(0);
  }
});
