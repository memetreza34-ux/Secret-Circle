const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('loads setup, content and privacy without browser errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await expect(page.getByRole('heading', { name: 'Secret Circle' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Spiel starten' })).toBeEnabled();
  await expect(page.locator('#category option')).toHaveCount(15);
  await expect(page.getByText('Spielregeln und Punkte', { exact: true })).toBeVisible();

  await page.getByRole('link', { name: 'Datenschutz ansehen' }).click();
  await expect(page.getByRole('heading', { name: 'Deine Daten bleiben auf deinem Gerät' })).toBeVisible();
  await page.getByRole('link', { name: 'Zurück zum Spiel' }).click();
  await expect(page.locator('#setup-screen')).toBeVisible();
  expect(errors).toEqual([]);
});

test('starts a three-player game and protects the secret card', async ({ page }) => {
  await page.locator('#players').fill('Alex\nSam\nMika');
  await page.locator('#imposters').fill('1');
  await page.locator('#match-rounds').selectOption('1');
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  await expect(page.locator('#reveal-screen')).toBeVisible();
  await expect(page.locator('#secret')).toBeHidden();
  await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
  await expect(page.locator('#secret')).toBeVisible();
  await page.getByRole('button', { name: 'Karte schließen und weitergeben' }).click();
  await expect(page.locator('#secret')).toBeHidden();
  await expect(page.locator('#reveal-progress')).toContainText('Karte 2 von 3');
});

test('persists and restores an interrupted game', async ({ page }) => {
  await page.locator('#players').fill('Alex\nSam\nMika');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
  await page.getByRole('button', { name: 'Karte schließen und weitergeben' }).click();
  await page.reload();

  await expect(page.locator('#resume-box')).toBeVisible();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#reveal-progress')).toContainText('Karte 2 von 3');
});
