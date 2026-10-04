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
  await expect(page.getByRole('heading', { name: 'Deine Spieldaten bleiben auf deinem Gerät' })).toBeVisible();
  expect(errors).toEqual([]);
});

/* Öffnet ein Spiel über die Katalogsuche. Die Vorschlagsliste unter dem
   Suchfeld kann auf schmalen Bildschirmen über den Karten liegen; ein Mensch
   schließt sie zuerst. */
async function openFromCatalog(page, query, gameId, startLabel) {
  await page.goto('/party.html');
  await page.getByRole('button', { name: 'Spiele', exact: true }).click();
  await page.locator('#game-search').fill(query);
  await page.locator('#game-search').press('Escape');
  await page.locator(`#game-grid [data-open-game="${gameId}"]`).click();
  await page.getByRole('button', { name: startLabel }).click();
}

test('loads the 55-game Hub and all four external engine families', async ({ page }) => {
  const errors = captureErrors(page);
  await page.goto('/party.html');
  await expect(page.getByRole('heading', { name: 'Von der ersten Runde bis zum nächsten Spiel' })).toBeVisible();
  await expect(page.locator('#playable-count')).toHaveText('55');
  await page.locator('#party-night-duration').selectOption('30');
  await page.getByRole('button', { name: 'Plan erstellen' }).click();
  await expect(page.locator('.party-night-step').first()).toBeVisible();

  await page.getByRole('button', { name: 'Spiele', exact: true }).click();
  await expect(page.locator('#game-grid .game-card.playable')).toHaveCount(55);

  await openFromCatalog(page, 'Question Imposter', 'question-imposter', 'Question Imposter öffnen');
  await expect(page).toHaveURL(/advanced\.html\?game=question-imposter/);

  await openFromCatalog(page, 'Spektrum', 'wavelength', 'Quick Mode öffnen');
  await expect(page.getByRole('heading', { name: 'Spektrum-Tipp' })).toBeVisible();

  await openFromCatalog(page, 'Anime-Archetypen', 'anime-guess', 'Trend Mode öffnen');
  await expect(page.getByRole('heading', { name: 'Anime-Archetypen erraten' })).toBeVisible();

  await openFromCatalog(page, 'Preis schätzen', 'guess-the-price', 'Viral Mode öffnen');
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
