const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator('#players').fill('Alex\nSam\nMika');
  await page.locator('#match-rounds').selectOption('1');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
});

test('secret card is concealed when the app loses focus', async ({ page }) => {
  await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
  await expect(page.locator('#secret')).toBeVisible();
  await expect(page.locator('#next-player')).toBeVisible();

  await page.evaluate(() => window.dispatchEvent(new Event('blur')));

  await expect(page.locator('#secret')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Geheime Karte anzeigen' })).toBeVisible();
  await expect(page.locator('#next-player')).toBeHidden();
  await expect(page.locator('#handoff-note')).toContainText('automatisch verdeckt');
});

test('concealed card cannot advance until it is reopened', async ({ page }) => {
  await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  const progressBefore = await page.locator('#reveal-progress').textContent();

  await page.evaluate(() => document.querySelector('#next-player').click());
  await expect(page.locator('#reveal-progress')).toHaveText(progressBefore);
  await expect(page.locator('#secret')).toBeHidden();

  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.getByRole('button', { name: 'Geheime Karte anzeigen' })).toBeFocused();
});

test('concealed card can be reopened and the round continues normally', async ({ page }) => {
  await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
  await expect(page.locator('#secret')).toBeVisible();
  await page.getByRole('button', { name: 'Karte schließen und weitergeben' }).click();
  await expect(page.locator('#reveal-progress')).toContainText('Karte 2 von 3');
});

test('privacy guard exposes a frozen runtime contract', async ({ page }) => {
  const result = await page.evaluate(() => ({
    version: window.SecretCirclePrivacyGuard?.version,
    frozen: Object.isFrozen(window.SecretCirclePrivacyGuard),
    concealType: typeof window.SecretCirclePrivacyGuard?.concealSecret
  }));
  expect(result).toEqual({ version: 2, frozen: true, concealType: 'function' });
});
