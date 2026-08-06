const { test, expect } = require('@playwright/test');

function captureErrors(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => errors.push(`request failed: ${request.url()}`));
  return errors;
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('loads Imposter setup content and privacy without browser errors', async ({ page }) => {
  const errors = captureErrors(page);
  await expect(page.getByRole('heading', { name: 'Secret Circle' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Spiel starten' })).toBeEnabled();
  await expect(page.locator('#category option')).toHaveCount(15);
  await page.getByRole('link', { name: 'Datenschutz ansehen' }).click();
  await expect(page.getByRole('heading', { name: 'Deine Daten bleiben auf deinem Gerät' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('loads the 45-game Hub and all four external engine families', async ({ page }) => {
  const errors = captureErrors(page);
  await page.goto('/party.html');
  await expect(page.getByRole('heading', { name: 'Der ganze Spieleabend in einer App' })).toBeVisible();
  await expect(page.locator('#playable-count')).toHaveText('45');
  await page.locator('#party-night-duration').selectOption('30');
  await page.getByRole('button', { name: 'Plan erstellen' }).click();
  await expect(page.locator('.party-night-step')).toHaveCount(2);

  await page.getByRole('button', { name: 'Spiele' }).click();
  await expect(page.locator('.game-card')).toHaveCount(45);
  await page.locator('#game-search').fill('Question Imposter');
  await page.locator('[data-open-game="question-imposter"]').click();
  await page.getByRole('button', { name: 'Erweitertes Spiel öffnen' }).click();
  await expect(page).toHaveURL(/advanced\.html\?game=question-imposter/);

  await page.goto('/party.html');
  await page.getByRole('button', { name: 'Spiele' }).click();
  await page.locator('#game-search').fill('Wellenlänge');
  await page.locator('[data-open-game="wavelength"]').click();
  await page.getByRole('button', { name: 'Quick Mode öffnen' }).click();
  await expect(page.getByRole('heading', { name: 'Wellenlänge' })).toBeVisible();

  await page.goto('/party.html');
  await page.getByRole('button', { name: 'Spiele' }).click();
  await page.locator('#game-search').fill('Anime-Figuren');
  await page.locator('[data-open-game="anime-guess"]').click();
  await page.getByRole('button', { name: 'Trend Mode öffnen' }).click();
  await expect(page.getByRole('heading', { name: 'Anime-Figuren erraten' })).toBeVisible();

  await page.goto('/party.html');
  await page.getByRole('button', { name: 'Spiele' }).click();
  await page.locator('#game-search').fill('Preis schätzen');
  await page.locator('[data-open-game="guess-the-price"]').click();
  await page.getByRole('button', { name: 'Viral Mode öffnen' }).click();
  await expect(page.getByRole('heading', { name: 'Preis schätzen' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('starts a three-player Imposter game and protects the secret card', async ({ page }) => {
  await page.locator('#players').fill('Alex\nSam\nMika');
  await page.locator('#imposters').fill('1');
  await page.locator('#match-rounds').selectOption('1');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await expect(page.locator('#secret')).toBeHidden();
  await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
  await expect(page.locator('#secret')).toBeVisible();
  await page.getByRole('button', { name: 'Karte schließen und weitergeben' }).click();
  await expect(page.locator('#reveal-progress')).toContainText('Karte 2 von 3');
});

test('persists and restores an interrupted Imposter game', async ({ page }) => {
  await page.locator('#players').fill('Alex\nSam\nMika');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
  await page.getByRole('button', { name: 'Karte schließen und weitergeben' }).click();
  await page.reload();
  await expect(page.locator('#resume-box')).toBeVisible();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#reveal-progress')).toContainText('Karte 2 von 3');
});
