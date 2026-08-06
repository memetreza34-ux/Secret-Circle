const { test, expect } = require('@playwright/test');

async function configurePlayers(page, players = ['Alex', 'Sam', 'Mika', 'Lina']) {
  await page.goto('/party.html');
  await page.evaluate(value => {
    localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
      version: 1, players: value, favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
    localStorage.removeItem('secret-circle-party-quick-active-v1');
    localStorage.removeItem('secret-circle-party-mega-active-v1');
  }, players);
}

test('Party Hub exposes 37 playable games and accurate Quick Mode actions', async ({ page }) => {
  await configurePlayers(page);
  await page.goto('/party.html');
  await page.getByRole('button', { name: 'Spiele' }).click();
  await expect(page.locator('#result-count')).toHaveText('37');
  await expect(page.locator('.game-card.playable')).toHaveCount(37);
  await expect(page.locator('.game-card.planned')).toHaveCount(0);

  await page.locator('[data-game-id="wavelength"] [data-open-game="wavelength"]').click();
  await expect(page.locator('#detail-title')).toHaveText('Wellenlänge');
  await expect(page.locator('#start-selected-game')).toHaveText('Quick Mode öffnen');
  await page.locator('#start-selected-game').click();
  await expect(page).toHaveURL(/quick-play\.html\?game=wavelength/);
  await expect(page.getByRole('heading', { name: 'Wellenlänge' })).toBeVisible();
});

test('Wavelength completes a round and persists a resumable session', async ({ page }) => {
  await configurePlayers(page);
  await page.goto('/quick-play.html?game=wavelength');
  await page.locator('#quick-rounds').selectOption('3');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await expect(page.locator('#quick-progress')).toContainText('Runde 1 von 3');
  await expect(page.locator('.spectrum-card strong')).toContainText('Ziel:');
  await page.getByRole('button', { name: 'Ziel verbergen und Gerät weitergeben' }).click();
  await page.locator('input[type="range"]').evaluate(input => {
    input.value = '50';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.getByRole('button', { name: 'Position festlegen' }).click();
  await expect(page.locator('#quick-content')).toContainText('Eure Position: 50');
  await page.getByRole('button', { name: 'Nächstes Spektrum' }).click();
  await expect(page.locator('#quick-progress')).toContainText('Runde 2 von 3');

  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-quick-active-v1')));
  expect(saved.version).toBe(1);
  expect(saved.gameId).toBe('wavelength');
  expect(saved.round).toBe(2);
  expect(saved.players).toEqual(['Alex', 'Sam', 'Mika', 'Lina']);

  await page.reload();
  await expect(page.getByRole('button', { name: 'Fortsetzen' })).toBeVisible();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#quick-progress')).toContainText('Runde 2 von 3');
});

test('Rapid Fire finishes three rounds and records history and statistics', async ({ page }) => {
  await configurePlayers(page);
  await page.goto('/quick-play.html?game=rapid-fire');
  await page.locator('#quick-rounds').selectOption('3');
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  for (let round = 1; round <= 3; round += 1) {
    await page.getByRole('button', { name: /Sekunden starten/ }).click();
    await page.getByRole('button', { name: /geschafft/ }).click();
    await expect(page.locator('#quick-content')).toContainText('Geschafft');
    await page.getByRole('button', { name: 'Nächste Challenge' }).click();
  }

  await expect(page.locator('#quick-result')).toBeVisible();
  await expect(page.locator('#quick-final-score')).toHaveText('3');
  const hub = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-hub-v1')));
  expect(hub.history[0].gameId).toBe('rapid-fire');
  expect(hub.history[0].rounds).toBe(3);
  expect(hub.history[0].score).toBe(3);
  expect(hub.stats['rapid-fire'].rounds).toBe(3);
  expect(hub.stats['rapid-fire'].best).toBe(3);
  expect(await page.evaluate(() => localStorage.getItem('secret-circle-party-quick-active-v1'))).toBeNull();
});

test('all ten classic Quick Modes load original content without runtime errors', async ({ page }) => {
  await configurePlayers(page, ['Alex', 'Sam', 'Mika', 'Lina', 'Noah']);
  const ids = [
    'wavelength', 'draw-guess', 'rapid-fire', 'sound-imitation', 'forehead-guess',
    'letter-categories', 'dont-laugh', 'hum-song', 'scavenger-hunt', 'caption-battle'
  ];
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const id of ids) {
    await page.goto(`/quick-play.html?game=${id}`);
    await expect(page.locator('#quick-title')).not.toHaveText('Spiel laden');
    await expect(page.locator('#quick-pack option')).not.toHaveCount(0);
    await expect(page.locator('#quick-content-count')).toContainText('Karten');
    await page.getByRole('button', { name: 'Spiel starten' }).click();
    await expect(page.locator('#quick-play')).toBeVisible();
    await page.evaluate(() => localStorage.removeItem('secret-circle-party-quick-active-v1'));
  }
  expect(errors).toEqual([]);
});
