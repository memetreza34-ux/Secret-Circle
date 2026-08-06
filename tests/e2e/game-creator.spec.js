const { test, expect } = require('@playwright/test');

async function clearCreator(page) {
  await page.goto('/creator.html');
  await page.evaluate(() => {
    localStorage.removeItem('secret-circle-party-created-games-v1');
    localStorage.removeItem('secret-circle-party-onboarding-v1');
    localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika', 'Lina'],
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
  });
  await page.reload();
}

test('Creator explains the four-step flow and exposes six templates', async ({ page }) => {
  await clearCreator(page);
  await expect(page.getByRole('heading', { name: 'Eigenes Spiel erstellen' })).toBeVisible();
  await expect(page.locator('.creator-intro-steps span')).toHaveCount(4);
  await expect(page.locator('.template-card')).toHaveCount(6);
  await page.getByRole('button', { name: 'Hilfe zu Spielvorlagen' }).click();
  await expect(page.getByRole('dialog')).toContainText('Welche Vorlage passt?');
  await expect(page.getByRole('dialog')).toContainText('Entweder-oder zeigt zwei Optionen');
  await page.getByRole('button', { name: 'Hilfe schließen' }).click();
});

test('creates a custom choice game and opens it from the Party Hub', async ({ page }) => {
  await clearCreator(page);
  await page.locator('[data-template-id="choice"]').click();
  await page.getByRole('button', { name: 'Weiter zu Details' }).click();

  await page.locator('#creator-title').fill('Unser Anime Duell');
  await page.locator('#creator-group').fill('Anime & Freunde');
  await page.locator('#creator-description').fill('Die Gruppe entscheidet zwischen zwei eigenen Anime- und Freundschaftsoptionen.');
  await page.locator('#creator-min-players').fill('3');
  await page.locator('#creator-max-players').fill('10');
  await page.locator('#creator-duration').fill('18');
  await page.getByRole('button', { name: 'Icon 🎮 wählen' }).click();
  await page.getByRole('button', { name: 'Akzent pink wählen' }).click();
  await page.getByRole('button', { name: 'Weiter zu Inhalten' }).click();

  await page.locator('.pack-name').fill('Anime & Gaming');
  await page.locator('.pack-items').fill('Ninja | Magier\nMecha | Fantasy\nTeamkampf | Einzelduell\nOpening | Ending');
  await expect(page.locator('.pack-count')).toContainText('4 gültige Karten');
  await page.getByRole('button', { name: 'Weiter zur Prüfung' }).click();
  await expect(page.locator('#review-summary')).toContainText('Unser Anime Duell');
  await expect(page.locator('#review-summary')).toContainText('1 Kategorien · 4 Karten');
  await page.locator('#creator-safe-confirm').check();
  await page.getByRole('button', { name: 'Spiel speichern' }).click();

  await expect(page.locator('#creator-status')).toContainText('ist jetzt im Party Hub spielbar');
  await expect(page.locator('#created-games-list')).toContainText('Unser Anime Duell');
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-created-games-v1')));
  expect(saved.version).toBe(1);
  expect(saved.games).toHaveLength(1);
  expect(saved.games[0].templateId).toBe('choice');
  expect(saved.games[0].packs[0].items[0]).toEqual(['Ninja', 'Magier']);

  await page.locator('#created-games-list').getByRole('link', { name: 'Testen', exact: true }).click();
  await expect(page).toHaveURL(/party\.html\?game=custom-game-/);
  await expect(page.locator('#game-detail')).toBeVisible();
  await expect(page.locator('#detail-title')).toHaveText('Unser Anime Duell');
  await expect(page.locator('#start-selected-game')).toHaveText('Eigenes Spiel starten');
  await page.locator('#start-selected-game').click();
  await expect(page.locator('#play-layer')).toBeVisible();
  await expect(page.locator('.choice-card')).toHaveCount(2);
});

test('supports multiple categories, editing and duplication', async ({ page }) => {
  await clearCreator(page);
  await page.locator('[data-template-id="story"]').click();
  await page.getByRole('button', { name: 'Weiter zu Details' }).click();
  await page.locator('#creator-title').fill('Unsere Story Nacht');
  await page.locator('#creator-description').fill('Die Gruppe entwickelt aus eigenen Anfängen kurze gemeinsame Geschichten.');
  await page.getByRole('button', { name: 'Weiter zu Inhalten' }).click();
  await page.locator('.pack-name').fill('Mystery');
  await page.locator('.pack-items').fill('Die Uhr lief rückwärts.\nIm Bahnhof erschien eine neue Tür.\nDer Brief kam aus der Zukunft.');
  await page.getByRole('button', { name: 'Weitere Kategorie' }).click();
  await page.locator('.pack-name').nth(1).fill('Fantasy');
  await page.locator('.pack-items').nth(1).fill('Der Drache verlor seine Stimme.\nDie Wolkenstadt sank langsam.\nDer Zauberstab bestellte Urlaub.');
  await page.getByRole('button', { name: 'Weiter zur Prüfung' }).click();
  await page.locator('#creator-safe-confirm').check();
  await page.getByRole('button', { name: 'Spiel speichern' }).click();
  await expect(page.locator('#created-games-list')).toContainText('2 Kategorien');

  await page.locator('#created-games-list').getByRole('button', { name: 'Kopieren', exact: true }).click();
  await expect(page.locator('#created-games-list .created-game-card')).toHaveCount(2);
  await expect(page.locator('#creator-title')).toHaveValue(/Kopie/);

  await page.locator('#created-games-list').getByRole('button', { name: 'Bearbeiten', exact: true }).first().click();
  await expect(page.locator('#creator-status')).toContainText('wird bearbeitet');
  await page.locator('#creator-description').fill('Bearbeitete Erklärung für unsere gemeinsame Story-Runde.');
  await page.getByRole('button', { name: 'Weiter zu Inhalten' }).click();
  await page.getByRole('button', { name: 'Weiter zur Prüfung' }).click();
  await page.locator('#creator-safe-confirm').check();
  await page.getByRole('button', { name: 'Spiel speichern' }).click();
  await expect(page.locator('#created-games-list')).toContainText('Bearbeitete Erklärung');
});

test('rejects incomplete cards and unsafe save confirmation omissions', async ({ page }) => {
  await clearCreator(page);
  await page.getByRole('button', { name: 'Weiter zu Details' }).click();
  await page.locator('#creator-title').fill('Zu wenig Karten');
  await page.locator('#creator-description').fill('Dieses Spiel soll die Creator-Validierung im Browser prüfen.');
  await page.getByRole('button', { name: 'Weiter zu Inhalten' }).click();
  await page.locator('.pack-items').fill('Nur eine Karte\nNur zwei Karten');
  await page.getByRole('button', { name: 'Weiter zur Prüfung' }).click();
  await expect(page.locator('#creator-status')).toContainText('mindestens drei gültige Karten');
  await page.locator('.pack-items').fill('Erste Karte\nZweite Karte\nDritte Karte');
  await page.getByRole('button', { name: 'Weiter zur Prüfung' }).click();
  await page.getByRole('button', { name: 'Spiel speichern' }).click();
  await expect(page.locator('#creator-status')).toContainText('Bestätige vor dem Speichern');
});

test('Hub guidance makes the main actions and short explanations visible', async ({ page }) => {
  await clearCreator(page);
  await page.goto('/party.html');
  await expect(page.getByRole('heading', { name: 'In drei Schritten zur ersten Runde' })).toBeVisible();
  await expect(page.locator('.simple-step-card')).toHaveCount(3);
  const creatorLinks = page.getByRole('link', { name: 'Eigenes Spiel erstellen' });
  await expect(creatorLinks.first()).toBeVisible();
  await expect(creatorLinks.first()).toHaveAttribute('href', 'creator.html');
  await page.getByRole('button', { name: 'Hilfe zum Schnellstart' }).click();
  await expect(page.locator('#hub-help-sheet')).toContainText('In weniger als einer Minute starten');
  await page.getByRole('button', { name: 'Hilfe schließen' }).click();
  await page.getByRole('button', { name: 'Spiele' }).click();
  await expect(page.locator('.filter-help')).toContainText('Suche und Filter lassen sich kombinieren');
  await expect(page.locator('.game-card .open-game').first()).toHaveText('Spielen');
});
