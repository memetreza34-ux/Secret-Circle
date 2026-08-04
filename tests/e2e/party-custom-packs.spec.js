const { test, expect } = require('@playwright/test');

async function clearSecretCircleData(page) {
  await page.evaluate(() => {
    const keys = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith('secret-circle-')) keys.push(key);
    }
    keys.forEach(key => localStorage.removeItem(key));
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/party.html');
  await clearSecretCircleData(page);
  await page.reload();
});

test('custom pack editor validates saves and exposes cards in the selected game', async ({ page }) => {
  await page.getByRole('button', { name: 'Daten' }).click();
  await expect(page.getByRole('heading', { name: 'Eigene Hub-Kategorien' })).toBeVisible();
  await expect(page.locator('#custom-pack-game option')).not.toHaveCount(0);

  await page.locator('#custom-pack-game').selectOption('charades');
  await page.locator('#custom-pack-name').fill('Unsere Gruppe');
  await page.locator('#custom-pack-items').fill('Pinguin\nRaumstation\nKaffeetasse\nPinguin');
  const reloaded = page.waitForEvent('load');
  await page.getByRole('button', { name: 'Eigenes Pack speichern' }).click();
  await reloaded;

  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-custom-packs-v1')));
  expect(stored.version).toBe(1);
  expect(stored.packs).toHaveLength(1);
  expect(stored.packs[0].items).toEqual(['Pinguin', 'Raumstation', 'Kaffeetasse']);

  await page.getByRole('button', { name: 'Spiele' }).click();
  await page.locator('#game-search').fill('Scharade');
  await page.locator('[data-open-game="charades"]').click();
  await expect(page.locator('#detail-packs')).toContainText('Eigene · Unsere Gruppe');
  await page.locator('#pack-select').selectOption('Eigene · Unsere Gruppe');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await expect(page.locator('#play-layer')).toBeVisible();
  await expect(page.locator('#play-content')).toHaveText(/Pinguin|Raumstation|Kaffeetasse/);
});

test('custom pack editor rejects too little content and duplicate pack names', async ({ page }) => {
  await page.getByRole('button', { name: 'Daten' }).click();
  await page.locator('#custom-pack-game').selectOption('hot-potato');
  await page.locator('#custom-pack-name').fill('Mini');
  await page.locator('#custom-pack-items').fill('Eins\nZwei');
  await page.getByRole('button', { name: 'Eigenes Pack speichern' }).click();
  await expect(page.locator('#hub-status')).toContainText('mindestens drei');
  expect(await page.evaluate(() => localStorage.getItem('secret-circle-party-custom-packs-v1'))).toBeNull();

  await page.locator('#custom-pack-items').fill('Eins\nZwei\nDrei');
  const firstReload = page.waitForEvent('load');
  await page.getByRole('button', { name: 'Eigenes Pack speichern' }).click();
  await firstReload;
  await page.getByRole('button', { name: 'Daten' }).click();
  await page.locator('#custom-pack-game').selectOption('hot-potato');
  await page.locator('#custom-pack-name').fill('mini');
  await page.locator('#custom-pack-items').fill('Vier\nFünf\nSechs');
  await page.getByRole('button', { name: 'Eigenes Pack speichern' }).click();
  await expect(page.locator('#hub-status')).toContainText('existiert bereits');
});

test('custom packs can be deleted and remain part of the complete data namespace', async ({ page }) => {
  await page.getByRole('button', { name: 'Daten' }).click();
  await page.locator('#custom-pack-game').selectOption('word-chain');
  await page.locator('#custom-pack-name').fill('Spezial');
  await page.locator('#custom-pack-items').fill('Solar\nRakete\nEnergie');
  const saveReload = page.waitForEvent('load');
  await page.getByRole('button', { name: 'Eigenes Pack speichern' }).click();
  await saveReload;
  await page.getByRole('button', { name: 'Daten' }).click();
  await expect(page.locator('#custom-pack-list')).toContainText('Spezial');

  page.once('dialog', dialog => dialog.accept());
  const deleteReload = page.waitForEvent('load');
  await page.locator('#custom-pack-list').getByRole('button', { name: 'Löschen' }).click();
  await deleteReload;
  await page.getByRole('button', { name: 'Daten' }).click();
  await expect(page.locator('#custom-pack-list')).toContainText('Noch kein eigenes Hub-Pack');
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-custom-packs-v1')));
  expect(stored.packs).toEqual([]);
});
