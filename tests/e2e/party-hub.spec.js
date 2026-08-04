const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/party.html');
  await page.evaluate(() => {
    localStorage.removeItem('secret-circle-party-hub-v1');
    localStorage.removeItem('secret-circle-party-preferences-v1');
  });
  await page.reload();
});

test('party hub exposes a clear playable catalog and roadmap', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Der ganze Spieleabend in einer App' })).toBeVisible();
  await expect(page.locator('#playable-count')).toHaveText('18');
  await expect(page.locator('#planned-count')).toHaveText('4');
  await expect(page.locator('#content-count')).not.toHaveText('0');

  await page.getByRole('button', { name: 'Alle Spiele ansehen' }).click();
  await expect(page.getByRole('heading', { name: 'Alle Spiele' })).toBeVisible();
  await expect(page.locator('#result-count')).toHaveText('22');
  await expect(page.locator('.game-card')).toHaveCount(22);

  await page.locator('#status-filter').selectOption('playable');
  await expect(page.locator('#result-count')).toHaveText('18');
  await page.locator('#game-search').fill('Scharade');
  await expect(page.locator('#result-count')).toHaveText('1');
  await expect(page.getByRole('heading', { name: 'Scharade' })).toBeVisible();
});

test('age preference filters and persists the visible catalog', async ({ page }) => {
  await page.getByRole('button', { name: 'Alle Spiele ansehen' }).click();
  await page.locator('#age-filter').selectOption('family');
  const visibleCards = page.locator('.game-card:not([hidden])');
  await expect(visibleCards).not.toHaveCount(0);
  await expect(page.locator('[data-game-id="truth-dare"]')).toBeHidden();
  await expect(page.locator('[data-game-id="charades"]')).toBeVisible();

  await page.reload();
  await page.getByRole('button', { name: 'Spiele' }).click();
  await expect(page.locator('#age-filter')).toHaveValue('family');
  await expect(page.locator('[data-game-id="truth-dare"]')).toBeHidden();

  await page.getByRole('button', { name: 'Daten' }).click();
  await expect(page.locator('#settings-age-level')).toHaveValue('family');
  await page.locator('#settings-age-level').selectOption('all');
  await page.getByRole('button', { name: 'Spiele' }).click();
  await expect(page.locator('[data-game-id="truth-dare"]')).toBeVisible();
});

test('truth or dare can be configured and played from the hub', async ({ page }) => {
  await page.getByRole('button', { name: 'Alle Spiele ansehen' }).click();
  await page.locator('#game-search').fill('Wahrheit oder Pflicht');
  await page.locator('[data-open-game="truth-dare"]').click();

  await expect(page.locator('#detail-title')).toHaveText('Wahrheit oder Pflicht');
  await expect(page.locator('#detail-packs')).toContainText('Locker');
  await expect(page.locator('#detail-packs')).toContainText('Chaos');
  await page.locator('#pack-select').selectOption('Lustig');
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  await expect(page.locator('#play-layer')).toBeVisible();
  await expect(page.locator('#play-player')).toContainText('Alex');
  await page.getByRole('button', { name: 'Wahrheit' }).click();
  await expect(page.locator('#play-content')).not.toHaveText('Wähle Wahrheit oder Pflicht.');
  await page.getByRole('button', { name: 'Erledigt · nächste Person' }).click();
  await expect(page.locator('#play-player')).toContainText('Sam');
  await page.getByRole('button', { name: 'Spiel verlassen' }).click();

  await page.getByRole('button', { name: 'Verlauf' }).click();
  await expect(page.locator('#hub-history')).toContainText('Wahrheit oder Pflicht');
  await expect(page.locator('#hub-history')).toContainText('1 Runden');
  await expect(page.locator('#achievement-count')).toHaveText('1');
});

test('shared players, presets and favorites persist locally', async ({ page }) => {
  await page.getByRole('button', { name: 'Spieler' }).click();
  await page.locator('#hub-players').fill('Aylin\nBen\nCem\nDaria\nEren');
  await page.getByRole('button', { name: 'Spieler speichern' }).click();
  await expect(page.locator('#hub-players-help')).toContainText('5 eindeutige Personen');

  await page.locator('#preset-name').fill('Freitag');
  await page.getByRole('button', { name: 'Aktuelle Gruppe als Preset' }).click();
  await expect(page.locator('#preset-list')).toContainText('Freitag');

  await page.getByRole('button', { name: 'Spiele' }).click();
  await page.locator('#game-search').fill('Hot Takes');
  await page.locator('[data-favorite-game="hot-takes"]').click();
  await page.getByRole('button', { name: 'Favoriten' }).click();
  await expect(page.locator('#favorites-grid')).toContainText('Hot Takes');

  await page.reload();
  await page.getByRole('button', { name: 'Spieler' }).click();
  await expect(page.locator('#hub-players')).toHaveValue('Aylin\nBen\nCem\nDaria\nEren');
  await expect(page.locator('#preset-list')).toContainText('Freitag');
  await page.getByRole('button', { name: 'Favoriten' }).click();
  await expect(page.locator('#favorites-grid')).toContainText('Hot Takes');
});

test('advanced games are playable and remaining roadmap games stay blocked', async ({ page }) => {
  await page.getByRole('button', { name: 'Alle Spiele ansehen' }).click();
  await page.locator('#game-search').fill('Mafia');
  await page.locator('[data-open-game="mafia"]').click();
  await expect(page.locator('#detail-badges')).toContainText('Jetzt spielbar');
  await page.getByRole('button', { name: 'Word Imposter öffnen' }).click();
  await expect(page).toHaveURL(/advanced\.html\?game=mafia/);

  await page.goto('/party.html');
  await page.getByRole('button', { name: 'Spiele' }).click();
  await page.locator('#status-filter').selectOption('planned');
  await expect(page.locator('#result-count')).toHaveText('4');
  await page.locator('[data-open-game="wavelength"]').click();
  await expect(page.locator('#detail-title')).toHaveText('Wellenlänge');
  await expect(page.getByRole('button', { name: 'Noch nicht spielbar' })).toBeDisabled();
  await expect(page.locator('#detail-badges')).toContainText('In Entwicklung');
});

test('party hub links back to the production word imposter flow', async ({ page }) => {
  await page.getByRole('link', { name: 'Word Imposter direkt' }).click();
  await expect(page).toHaveURL(/\/index\.html$/);
  await expect(page.getByRole('heading', { name: 'Secret Circle' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Spiel starten' })).toBeVisible();
});
