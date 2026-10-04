const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';
const ACTIVE_KEY = 'secret-circle-party-hub-active-v1';

function captureErrors(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  return errors;
}

async function seedHub(page, hub = {}) {
  await page.goto('/v2-hub.html');
  await page.evaluate(({ key, value }) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({
      version: 1, players: ['Alex', 'Sam', 'Mika', 'Lina'], favorites: [], recent: [], presets: [], history: [], stats: {}, ...value
    }));
  }, { key: HUB_KEY, value: hub });
}

async function openV2(page, hash = '') {
  await page.goto(`/v2-hub.html${hash}`);
  await expect(page.locator('#app')).toBeVisible();
}

test('start screen renders from the real catalog without invented claims', async ({ page }) => {
  const errors = captureErrors(page);
  await seedHub(page);
  await openV2(page);
  await expect(page.locator('[data-screen="home"]')).toBeVisible();
  await expect(page.locator('#hero-badge')).toHaveText('Empfehlung');
  await expect(page.locator('#sections')).toContainText('Empfohlen');
  await expect(page.locator('#sections')).not.toContainText('Eure meistgespielten');
  await expect(page.locator('#resume-slot')).toBeEmpty();
  expect(errors).toEqual([]);
});

test('games screen lists all 55 games in six non-empty colour worlds', async ({ page }) => {
  await seedHub(page);
  await openV2(page, '#spiele');
  await expect(page.locator('#grid .gcard')).toHaveCount(55);
  const chips = await page.locator('#filters .chip').allTextContents();
  expect(chips[0]).toBe('Alle 55');
  const counts = chips.slice(1).map(text => Number(text.match(/(\d+)$/)[1]));
  expect(counts).toHaveLength(6);
  expect(counts.every(count => count > 0)).toBe(true);
  expect(counts.reduce((sum, count) => sum + count, 0)).toBe(55);

  await page.locator('#q').fill('Spektrum');
  await expect(page.locator('#grid .gcard')).toHaveCount(1);
  await page.locator('#grid .gcard').first().click();
  await expect(page.locator('#mode-title')).toHaveText('Spektrum-Tipp');
});

test('a hub game starts in the real engine with the chosen category and returns afterwards', async ({ page }) => {
  await seedHub(page);
  await openV2(page, '#spiel=never-have');
  await expect(page.locator('#mode-title')).toHaveText('Ich habe noch nie');
  await page.locator('#pack-row').click();
  const packs = page.locator('#pack-list .pack-row');
  await expect(packs.first()).toBeVisible();
  const second = (await packs.nth(1).locator('.row-main').textContent()).trim();
  await packs.nth(1).click();
  await expect(page.locator('#pack-value')).toHaveText(second);

  await page.locator('#start-btn').click();
  await expect(page).toHaveURL(/party\.html\?from=v2$/);
  await expect(page.locator('#play-layer')).toBeVisible();
  await expect(page.locator('#play-eyebrow')).toHaveText(second);

  await page.locator('#play-actions button').first().click();
  await page.locator('#finish-hub-game').click();
  await expect(page).toHaveURL(/v2-hub\.html$/);

  await page.getByRole('tab', { name: 'Profil' }).click();
  await expect(page.locator('#profile-stats')).toContainText('1Sessions');
  await expect(page.locator('#profile-recent .gcard')).toHaveCount(1);
});

test('a linked game opens its own engine page', async ({ page }) => {
  await seedHub(page);
  await openV2(page, '#spiel=wavelength');
  await expect(page.locator('#pack-row')).toBeHidden();
  await page.locator('#start-btn').click();
  await expect(page).toHaveURL(/quick-play\.html\?game=wavelength$/);
  await expect(page.getByRole('heading', { name: 'Spektrum-Tipp' })).toBeVisible();
  await page.getByRole('link', { name: '← Alle Spiele' }).click();
  await expect(page).toHaveURL(/v2-hub\.html$/);
});

test('the player list is shared with the rest of the app and gates the start', async ({ page }) => {
  await seedHub(page, { players: ['Alex'] });
  await openV2(page, '#spiel=never-have');
  await expect(page.locator('#start-btn')).toBeDisabled();
  await expect(page.locator('#start-note')).toContainText('fehlen noch');

  await page.locator('#players-row').click();
  await page.locator('#player-input').fill('Sam');
  await page.locator('#player-add').click();
  await expect(page.locator('#player-badge')).toHaveText('2/20');
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).players, HUB_KEY)).toEqual(['Alex', 'Sam']);

  await page.locator('[data-screen="players"] [data-back]').click();
  await expect(page.locator('#start-btn')).toBeEnabled();
});

test('a stored session is offered on the start screen and resumes in its engine', async ({ page }) => {
  await seedHub(page);
  await openV2(page, '#spiel=never-have');
  await page.locator('#start-btn').click();
  await expect(page.locator('#play-layer')).toBeVisible();
  await page.locator('#play-actions button').first().click();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).session.gameId, ACTIVE_KEY)).toBe('never-have');

  await openV2(page);
  await expect(page.locator('#resume-slot .resume')).toHaveCount(1);
  await expect(page.locator('#resume-slot')).toContainText('Ich habe noch nie');
  await page.locator('#resume-slot .resume-go').click();
  await expect(page).toHaveURL(/party\.html\?from=v2$/);
  await expect(page.getByRole('button', { name: 'Session fortsetzen' })).toBeEnabled();
});

test('"most played" appears only once there is real history', async ({ page }) => {
  const history = ['charades', 'taboo', 'charades', 'paranoia'].map((gameId, index) => ({
    id: `hub-${gameId}-${index}`, gameId, title: gameId, endedAt: new Date().toISOString(), rounds: 2, score: 0
  }));
  await seedHub(page, { history });
  await openV2(page);
  await expect(page.locator('#hero-badge')).toHaveText('Meistgespielt');
  await expect(page.locator('#sections')).toContainText('Eure meistgespielten');
  await expect(page.locator('#sections')).not.toContainText('Empfohlen');
  await expect(page.locator('#hero-title')).toHaveText('Scharade');
});
