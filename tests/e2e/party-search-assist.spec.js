const { test, expect } = require('@playwright/test');

test('synonym suggestion selects the matching game', async ({ page }) => {
  await page.goto('/party.html?view=games');
  const search = page.locator('#game-search');
  await expect(search).toBeVisible();
  await expect(search).toHaveAttribute('aria-autocomplete', 'list');

  await search.fill('werwolf');
  const suggestions = page.locator('#game-search-suggestions');
  await expect(suggestions).toBeVisible();
  await expect(search).toHaveAttribute('aria-expanded', 'true');

  const mafia = suggestions.locator('[data-game-id="mafia"]');
  await expect(mafia).toBeVisible();
  await mafia.click();
  await expect(search).toHaveValue('Mafia');
  await expect(suggestions).toBeHidden();
  await expect(page.locator('#game-grid .game-card:visible')).toHaveCount(1);
  await expect(page.locator('#game-grid .game-card:visible')).toHaveAttribute('data-game-id', 'mafia');
});

test('typo suggestion can be selected with keyboard', async ({ page }) => {
  await page.goto('/party.html?view=games');
  const search = page.locator('#game-search');
  await search.fill('impsoter');
  await expect(page.locator('#game-search-suggestions')).toBeVisible();

  await search.press('ArrowDown');
  await expect(search).toHaveAttribute('aria-activedescendant', /game-search-option-/);
  await search.press('Enter');
  await expect(search).toHaveValue('Word Imposter');
  await expect(search).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#game-grid .game-card:visible')).toHaveCount(1);
  await expect(page.locator('#game-grid .game-card:visible')).toHaveAttribute('data-game-id', 'imposter');
});

test('escape closes suggestions without changing the query', async ({ page }) => {
  await page.goto('/party.html?view=games');
  const search = page.locator('#game-search');
  await search.fill('montagsmaler');
  await expect(page.locator('#game-search-suggestions')).toBeVisible();
  await search.press('Escape');
  await expect(page.locator('#game-search-suggestions')).toBeHidden();
  await expect(search).toHaveValue('montagsmaler');
});
