const { test, expect } = require('@playwright/test');

async function seedHub(page, players = ['Alex', 'Sam', 'Mika', 'Lina']) {
  await page.goto('/party.html');
  await page.evaluate(value => {
    localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
      version: 1, players: value, favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
    localStorage.removeItem('secret-circle-party-viral-active-v1');
  }, players);
}

test('Party Hub exposes 45 playable games and Viral Mode actions', async ({ page }) => {
  await seedHub(page);
  await page.goto('/party.html');
  await expect(page.locator('#playable-count')).toHaveText('45');
  await page.getByRole('button', { name: 'Spiele' }).click();
  await expect(page.locator('#result-count')).toHaveText('45');
  await expect(page.locator('.game-card.playable')).toHaveCount(45);
  await page.locator('#game-search').fill('Finger runter');
  await page.locator('[data-open-game="put-a-finger-down"]').click();
  await expect(page.getByRole('button', { name: 'Viral Mode öffnen' })).toBeVisible();
  await page.getByRole('button', { name: 'Viral Mode öffnen' }).click();
  await expect(page).toHaveURL(/quick-play\.html\?game=put-a-finger-down/);
  await expect(page.getByRole('heading', { name: 'Finger runter' })).toBeVisible();
});

test('Guess the Price calculates distance points and saves resume state', async ({ page }) => {
  await seedHub(page);
  await page.goto('/quick-play.html?game=guess-the-price');
  await page.locator('#quick-pack').selectOption('Supermarkt');
  await page.locator('#quick-rounds').selectOption('3');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await expect(page.locator('#quick-content')).toContainText('kein aktueller Händlerpreis');
  await page.locator('input[type="number"]').fill('20');
  await page.getByRole('button', { name: 'Schätzung festlegen' }).click();
  await expect(page.locator('.money-amount')).toContainText('€');
  await page.getByRole('button', { name: 'Nächster Spielpreis' }).click();
  await expect(page.locator('#quick-progress')).toContainText('Runde 2 von 3');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Fortsetzen' })).toBeVisible();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#quick-progress')).toContainText('Runde 2 von 3');
});

test('Who Knows Me Best hides the private choice before group voting', async ({ page }) => {
  await seedHub(page, ['Alex', 'Sam', 'Mika']);
  await page.goto('/quick-play.html?game=know-me-best');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await expect(page.locator('#quick-private-note')).toContainText('Nur die aktive Person');
  const privateOptions = page.locator('#quick-actions button');
  await expect(privateOptions).toHaveCount(3);
  const chosenText = await privateOptions.first().textContent();
  await privateOptions.first().click();
  await expect(page.locator('#quick-private-note')).toBeHidden();
  await expect(page.locator('#quick-actions button')).toHaveCount(3);
  await page.locator('#quick-actions button').first().click();
  await expect(page.locator('#quick-content')).toContainText('Antwort:');
  await expect(page.locator('#quick-content')).toContainText(chosenText.split('·')[1].trim());
});

test('Higher or Lower and Hot Seat run complete timed interactions', async ({ page }) => {
  await seedHub(page);
  await page.goto('/quick-play.html?game=higher-lower');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await page.getByRole('button', { name: /Höher/ }).click();
  await expect(page.locator('#quick-content')).toContainText(/Richtig|Nicht richtig/);

  await page.evaluate(() => localStorage.removeItem('secret-circle-party-viral-active-v1'));
  await page.goto('/quick-play.html?game=hot-seat');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await expect(page.locator('.hot-seat-list li')).toHaveCount(5);
  await page.getByRole('button', { name: '45 Sekunden starten' }).click();
  await expect(page.locator('.quick-timer')).toBeVisible();
  await page.getByRole('button', { name: 'Alle beantwortet' }).click();
  await expect(page.locator('#quick-content')).toContainText('Hot Seat geschafft');
});

test('all eight Viral Modes load categories and exactly one engine without errors', async ({ page }) => {
  await seedHub(page, ['Alex', 'Sam', 'Mika', 'Lina', 'Noah']);
  const ids = [
    'put-a-finger-down', 'guess-the-price', 'higher-lower', 'know-me-best',
    'hear-me-out', 'hot-seat', 'story-chain', 'finish-the-sentence'
  ];
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const id of ids) {
    await page.goto(`/quick-play.html?game=${id}`);
    await expect(page.locator('#quick-title')).not.toHaveText('Spiel laden');
    await expect(page.locator('#quick-pack option')).not.toHaveCount(0);
    await page.getByRole('button', { name: 'Spiel starten' }).click();
    await expect(page.locator('#quick-play')).toBeVisible();
    expect(await page.locator('script[src="party-viral-modes.js"]').count()).toBe(1);
    expect(await page.locator('script[src="party-mega-modes.js"]').count()).toBe(0);
    expect(await page.locator('script[src="party-quick-modes.js"]').count()).toBe(0);
    await page.evaluate(() => localStorage.removeItem('secret-circle-party-viral-active-v1'));
  }
  expect(errors).toEqual([]);
});

test('completed Viral Mode records one history entry and one play', async ({ page }) => {
  await seedHub(page);
  await page.goto('/party.html');
  await page.getByRole('button', { name: 'Spiele' }).click();
  await page.locator('#game-search').fill('Satz beenden');
  await page.locator('[data-open-game="finish-the-sentence"]').click();
  await page.getByRole('button', { name: 'Viral Mode öffnen' }).click();
  await page.locator('#quick-rounds').selectOption('3');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  for (let round = 0; round < 3; round += 1) {
    await page.getByRole('button', { name: 'Kreativer Treffer' }).click();
    await page.getByRole('button', { name: 'Nächster Satz' }).click();
  }
  await expect(page.locator('#quick-result')).toBeVisible();
  const hub = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-hub-v1')));
  expect(hub.history.filter(item => item.gameId === 'finish-the-sentence')).toHaveLength(1);
  expect(hub.stats['finish-the-sentence'].plays).toBe(1);
  expect(hub.stats['finish-the-sentence'].rounds).toBe(3);
  expect(hub.stats['finish-the-sentence'].best).toBe(3);
});
