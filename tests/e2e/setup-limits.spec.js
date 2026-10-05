const { test, expect } = require('@playwright/test');

function playerNames(count) {
  return Array.from({ length: count }, (_, index) => `Person ${index + 1}`);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('setup explains live player count and valid imposter range', async ({ page }) => {
  await expect(page.locator('#players-help')).toHaveText('4 dabei');
  await expect(page.locator('#imposters-help')).toHaveText('');
  await expect(page.locator('#imposters')).toHaveAttribute('max', '3');

  await page.locator('#players').fill('Alex\nSam\nMika');
  await expect(page.locator('#players-help')).toHaveText('3 dabei');
  await expect(page.locator('#imposters-help')).toHaveText('');
  await expect(page.locator('#imposters')).toHaveAttribute('max', '2');

  await page.locator('#imposters').fill('2');
  await page.locator('#players').fill('Alex\nSam');
  await expect(page.locator('#players-help')).toContainText('2 von mindestens 3 Personen');
  await expect(page.locator('#imposters')).toHaveValue('1');

  await page.locator('#players').fill('Alex\nAlex\nSam');
  await expect(page.locator('#players-help')).toContainText('1 doppelter Name');
});

test('Spieler lassen sich hinzufügen, umbenennen und entfernen; Zeit und Runden sind frei einstellbar', async ({ page }) => {
  const rows = page.locator('#player-list li');
  await expect(rows).toHaveCount(4);

  await page.getByRole('button', { name: 'Spieler hinzufügen' }).click();
  const newRow = page.getByRole('textbox', { name: 'Spieler 5' });
  await expect(newRow).toBeFocused();
  await newRow.fill('Noah');
  await expect(page.locator('#players')).toHaveValue('Alex\nSam\nMika\nLina\nNoah');

  const second = page.getByRole('textbox', { name: 'Spieler 2' });
  await second.fill('Samuel');
  await expect(second).toBeFocused();
  await expect(page.locator('#players')).toHaveValue('Alex\nSamuel\nMika\nLina\nNoah');

  await second.fill('alex');
  await expect(page.locator('#players-help')).toContainText('doppelter Name');
  await expect(page.locator('#start')).toBeDisabled();
  await second.fill('Sam');
  await expect(page.locator('#start')).toBeEnabled();

  await page.getByRole('button', { name: 'Mika entfernen' }).click();
  await expect(rows).toHaveCount(4);
  await expect(page.locator('#players')).toHaveValue('Alex\nSam\nLina\nNoah');
  await expect(page.locator('#players-help')).toHaveText('4 dabei');

  await page.getByRole('button', { name: 'Spieler hinzufügen' }).click();
  await page.locator('#imposters').focus();
  await expect(rows).toHaveCount(4);

  const fewerImposters = page.getByRole('button', { name: 'Weniger Imposter' });
  await expect(fewerImposters).toBeDisabled();
  await page.getByRole('button', { name: 'Mehr Imposter' }).click();
  await expect(page.locator('#imposters')).toHaveValue('2');
  await page.getByRole('button', { name: 'Längere Rundenzeit' }).click();
  await expect(page.locator('#duration')).toHaveValue('4');
  await page.locator('#match-rounds').fill('7');
  await page.locator('#match-rounds').blur();
  await expect(page.locator('#match-rounds')).toHaveValue('7');
  await page.locator('#match-rounds').fill('99');
  await page.locator('#match-rounds').blur();
  await expect(page.locator('#match-rounds')).toHaveValue('20');
  await expect(page.getByRole('button', { name: 'Mehr Runden' })).toBeDisabled();
  await page.getByRole('button', { name: 'Weniger Runden' }).click();
  await expect(page.locator('#match-rounds')).toHaveValue('19');

  await page.locator('#start').click();
  await expect(page.locator('#reveal-screen')).toBeVisible();
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-active-v7')));
  expect([...state.players].sort()).toEqual(['Alex', 'Lina', 'Noah', 'Sam']);
  expect(state.imposters).toHaveLength(2);
  expect(state.matchRounds).toBe(19);
  expect(state.roundSeconds).toBe(240);
  const settings = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-settings-v7')));
  expect(settings).toMatchObject({ duration: '4', matchRounds: '19' });
});

test('minimum setup supports three players and two imposters', async ({ page }) => {
  await page.locator('#players').fill(playerNames(3).join('\n'));
  await page.locator('#imposters').fill('2');
  await page.locator('#match-rounds').fill('1');
  await page.locator('#start').click();

  await expect(page.locator('#reveal-screen')).toBeVisible();
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-active-v7')));
  expect(state.players).toHaveLength(3);
  expect(state.imposters).toHaveLength(2);
  expect(new Set(state.imposters).size).toBe(2);
});

test('maximum setup supports twenty players and six imposters', async ({ page }) => {
  await page.locator('#players').fill(playerNames(20).join('\n'));
  await page.locator('#imposters').fill('6');
  await page.locator('#match-rounds').fill('1');
  await page.locator('#start').click();

  await expect(page.locator('#reveal-screen')).toBeVisible();
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-active-v7')));
  expect(state.players).toHaveLength(20);
  expect(state.revealOrder).toHaveLength(20);
  expect(new Set(state.revealOrder).size).toBe(20);
  expect(state.imposters).toHaveLength(6);
});

test('more than twenty players is rejected without persisting a game', async ({ page }) => {
  await page.locator('#players').fill(playerNames(21).join('\n'));
  await expect(page.locator('#players-help')).toContainText('Höchstens 20');

  /* Das Setup lässt den ungültigen Zustand gar nicht erst zu: Der Startknopf
     bleibt gesperrt, statt den Klick anzunehmen und danach zu meckern. */
  await expect(page.locator('#start')).toBeDisabled();
  await expect(page.locator('#setup-screen')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('secret-circle-active-v7'))).toBeNull();
});

test('imposter count must remain below the player count', async ({ page }) => {
  await page.locator('#players').fill(playerNames(3).join('\n'));
  await page.locator('#imposters').fill('3');

  /* Bei drei Personen sind höchstens zwei Imposter möglich; das Feld wird auf
     diesen Wert begrenzt, damit nie eine Runde ohne Unschuldige entsteht. */
  await expect(page.locator('#imposters')).toHaveValue('2');
  await expect(page.locator('#imposters')).toHaveAttribute('max', '2');

  await page.locator('#start').click();
  const active = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-active-v7') || 'null'));
  expect(active.imposters.length).toBe(2);
  expect(active.players.length).toBe(3);
});
