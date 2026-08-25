const { test, expect } = require('@playwright/test');

const corePages = [
  '/index.html',
  '/party.html',
  '/advanced.html?game=two-truths',
  '/quick-play.html?game=wavelength',
  '/creator.html'
];

for (const route of corePages) {
  test(`core page reflows at 320 CSS px: ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(route);
    await expect.poll(async () => page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth <= root.clientWidth + 1;
    })).toBe(true);
  });
}

test('word imposter blocks invalid setup before start', async ({ page }) => {
  await page.goto('/index.html');
  const players = page.locator('#players');
  const imposters = page.locator('#imposters');
  const start = page.locator('#start');

  await players.fill('Alex\nSam');
  await expect(players).toHaveAttribute('aria-invalid', 'true');
  await expect(start).toBeDisabled();

  await players.fill('Alex\nSam\nMika\nLina');
  await expect(players).toHaveAttribute('aria-invalid', 'false');
  await expect(start).toBeEnabled();

  await imposters.fill('0');
  await expect(imposters).toHaveAttribute('aria-invalid', 'true');
  await expect(start).toBeDisabled();
  await expect(page.locator('#imposters-help')).toContainText('ganze Zahl zwischen 1 und 3');

  await imposters.fill('1');
  await expect(imposters).toHaveAttribute('aria-invalid', 'false');
  await expect(start).toBeEnabled();
});

test('word imposter setup reports duplicates and a group-size recommendation', async ({ page }) => {
  await page.goto('/index.html');
  const players = page.locator('#players');
  const start = page.locator('#start');

  await players.fill('Alex\nSam\nalex\nMika');
  await expect(page.locator('#players-help')).toContainText('doppelter Name');
  await expect(start).toBeDisabled();

  await players.fill('A\nB\nC\nD\nE\nF\nG\nH');
  await expect(page.locator('#imposters-help')).toContainText('Empfehlung für 8 Personen: 2');
  await expect(start).toBeEnabled();
});

test('party hub exposes skip link as first keyboard target', async ({ page }) => {
  await page.goto('/party.html');
  await page.keyboard.press('Tab');
  const active = page.locator(':focus');
  await expect(active).toHaveClass(/skip-link/);
  await expect(active).toHaveAttribute('href', '#hub-main');
});

test('personal social content communicates voluntary participation', async ({ page }) => {
  await page.goto('/party.html');
  await expect(page.getByText(/Persönliche Inhalte sind freiwillig/i)).toBeVisible();
  await expect(page.getByText(/Überspringen ist jederzeit erlaubt/i)).toBeVisible();

  await page.goto('/advanced.html?game=two-truths');
  await expect(page.getByText(/Persönliche Aussagen und Antworten sind freiwillig/i)).toBeVisible();
});

test('party search remains keyboard reachable with accessible autocomplete', async ({ page }) => {
  await page.goto('/party.html?view=games');
  const search = page.locator('#game-search');
  await expect(search).toBeVisible();
  await expect(search).toHaveAttribute('aria-autocomplete', 'list');
  await search.focus();
  await search.fill('impsoter');
  await search.press('ArrowDown');
  await expect(search).toHaveAttribute('aria-activedescendant', /game-search-option-/);
  await search.press('Escape');
  await expect(search).toHaveAttribute('aria-expanded', 'false');
});

test('hub view changes move programmatic focus to the visible heading', async ({ page }) => {
  await page.goto('/party.html');
  await expect.poll(() => page.evaluate(() => Boolean(window.SecretCirclePartyHubA11y))).toBe(true);

  await page.locator('[data-view-target="games"]').first().click();
  await expect(page.locator('#games-title')).toBeFocused();
  await expect(page.locator('#games-title')).toHaveAttribute('tabindex', '-1');

  await page.locator('[data-view-target="players"]').first().click();
  await expect(page.locator('#players-title')).toBeFocused();
  await expect(page.locator('#players-title')).toHaveAttribute('tabindex', '-1');
});

test('hub detail modal isolates background and traps keyboard focus', async ({ page }) => {
  await page.goto('/party.html?view=games');
  await expect.poll(() => page.evaluate(() => Boolean(window.SecretCirclePartyHubA11y))).toBe(true);

  await page.locator('[data-open-game="truth-dare"]').first().click();
  await expect(page.locator('#game-detail')).toBeVisible();
  await expect(page.locator('#game-detail')).toHaveAttribute('role', 'dialog');
  await expect(page.locator('#game-detail')).toHaveAttribute('aria-modal', 'true');
  await expect.poll(() => page.evaluate(() => document.querySelector('.hub-shell').inert)).toBe(true);
  await expect.poll(() => page.evaluate(() => document.querySelector('.skip-link').inert)).toBe(true);

  await page.locator('#favorite-selected').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#close-detail')).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('#favorite-selected')).toBeFocused();

  await page.locator('#close-detail').click();
  await expect(page.locator('#game-detail')).toBeHidden();
  await expect.poll(() => page.evaluate(() => document.querySelector('.hub-shell').inert)).toBe(false);
  await expect.poll(() => page.evaluate(() => document.querySelector('.skip-link').inert)).toBe(false);
});

test('active hub game is modal and keeps focus out of the hidden hub', async ({ page }) => {
  await page.goto('/party.html?view=games');
  await expect.poll(() => page.evaluate(() => Boolean(window.SecretCirclePartyHubA11y))).toBe(true);

  await page.locator('[data-open-game="truth-dare"]').first().click();
  await page.locator('#start-selected-game').click();
  await expect(page.locator('#play-layer')).toBeVisible();
  await expect(page.locator('#play-layer')).toHaveAttribute('role', 'dialog');
  await expect(page.locator('#play-layer')).toHaveAttribute('aria-modal', 'true');
  await expect.poll(() => page.evaluate(() => document.querySelector('.hub-shell').inert)).toBe(true);

  await page.getByRole('button', { name: 'Pflicht' }).focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#finish-hub-game')).toBeFocused();
});
