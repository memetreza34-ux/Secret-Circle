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
