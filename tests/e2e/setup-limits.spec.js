const { test, expect } = require('@playwright/test');

function playerNames(count) {
  return Array.from({ length: count }, (_, index) => `Person ${index + 1}`);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('minimum setup supports three players and two imposters', async ({ page }) => {
  await page.locator('#players').fill(playerNames(3).join('\n'));
  await page.locator('#imposters').fill('2');
  await page.locator('#match-rounds').selectOption('1');
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  await expect(page.locator('#reveal-screen')).toBeVisible();
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-active-v7')));
  expect(state.players).toHaveLength(3);
  expect(state.imposters).toHaveLength(2);
  expect(new Set(state.imposters).size).toBe(2);
});

test('maximum setup supports twenty players and six imposters', async ({ page }) => {
  await page.locator('#players').fill(playerNames(20).join('\n'));
  await page.locator('#imposters').fill('6');
  await page.locator('#match-rounds').selectOption('1');
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  await expect(page.locator('#reveal-screen')).toBeVisible();
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-active-v7')));
  expect(state.players).toHaveLength(20);
  expect(state.revealOrder).toHaveLength(20);
  expect(new Set(state.revealOrder).size).toBe(20);
  expect(state.imposters).toHaveLength(6);
});

test('more than twenty players is rejected without persisting a game', async ({ page }) => {
  await page.locator('#players').fill(playerNames(21).join('\n'));
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  await expect(page.locator('#setup-screen')).toBeVisible();
  await expect(page.locator('#status')).toContainText('Höchstens 20 Personen');
  expect(await page.evaluate(() => localStorage.getItem('secret-circle-active-v7'))).toBeNull();
});

test('imposter count must remain below the player count', async ({ page }) => {
  await page.locator('#players').fill(playerNames(3).join('\n'));
  await page.locator('#imposters').fill('3');
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  await expect(page.locator('#setup-screen')).toBeVisible();
  await expect(page.locator('#status')).toContainText('kleiner als die Spielerzahl');
  expect(await page.evaluate(() => localStorage.getItem('secret-circle-active-v7'))).toBeNull();
});
