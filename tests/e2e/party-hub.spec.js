const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/party.html');
  await page.evaluate(() => {
    localStorage.removeItem('secret-circle-party-hub-v1');
    localStorage.removeItem('secret-circle-party-hub-active-v1');
    localStorage.removeItem('secret-circle-party-preferences-v1');
    localStorage.removeItem('secret-circle-party-quick-active-v1');
    localStorage.removeItem('secret-circle-party-mega-active-v1');
    localStorage.removeItem('secret-circle-party-viral-active-v1');
  });
  await page.reload();
});

test('party hub exposes a clear 55-game playable catalog', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Von der ersten Runde bis zum nächsten Spiel' })).toBeVisible();
  await expect(page.locator('#playable-count')).toHaveText('55');
  await expect(page.locator('#planned-count')).toHaveText('0');
  await expect(page.locator('#content-count')).not.toHaveText('0');

  await page.getByRole('button', { name: 'Alle Spiele ansehen' }).click();
  await expect(page.getByRole('heading', { name: 'Kernspiele, Erweiterungen & Labs' })).toBeVisible();
  await expect(page.locator('#result-count')).toHaveText('55');
  await expect(page.locator('#game-grid .game-card')).toHaveCount(55);

  await page.locator('#status-filter').selectOption('playable');
  await expect(page.locator('#result-count')).toHaveText('55');
  await page.locator('#game-search').fill('Scharade');
  await expect(page.locator('#result-count')).toHaveText('1');
  await expect(page.getByRole('heading', { name: 'Scharade' })).toBeVisible();
});

test('age preference filters and persists the visible catalog', async ({ page }) => {
  await page.getByRole('button', { name: 'Alle Spiele ansehen' }).click();
  await page.locator('#age-filter').selectOption('family');
  const visibleCards = page.locator('#game-grid .game-card:not([hidden])');
  await expect(visibleCards).not.toHaveCount(0);
  await expect(page.locator('#game-grid [data-game-id="truth-dare"]')).toBeHidden();
  await expect(page.locator('#game-grid [data-game-id="charades"]')).toBeVisible();

  await page.reload();
  await page.getByRole('button', { name: 'Spiele', exact: true }).click();
  await expect(page.locator('#age-filter')).toHaveValue('family');
  await expect(page.locator('#game-grid [data-game-id="truth-dare"]')).toBeHidden();

  await page.getByRole('button', { name: 'Daten', exact: true }).click();
  await expect(page.locator('#settings-age-level')).toHaveValue('family');
  await page.locator('#settings-age-level').selectOption('all');
  await page.getByRole('button', { name: 'Spiele', exact: true }).click();
  await expect(page.locator('#game-grid [data-game-id="truth-dare"]')).toBeVisible();
});

test('truth or dare can be configured and played from the hub', async ({ page }) => {
  await page.getByRole('button', { name: 'Alle Spiele ansehen' }).click();
  await page.locator('#game-search').fill('Wahrheit oder Pflicht');
  await page.locator('[data-open-game="truth-dare"]:visible').click();

  await expect(page.locator('#detail-title')).toHaveText('Wahrheit oder Pflicht');
  await expect(page.locator('#detail-packs')).toContainText('Locker');
  await expect(page.locator('#detail-packs')).toContainText('Chaos');
  await page.locator('#pack-select').selectOption('Lustig');
  await page.locator('#start-selected-game').click();

  await expect(page.locator('#play-layer')).toBeVisible();
  await expect(page.locator('#play-player')).toContainText('Alex');
  await page.getByRole('button', { name: 'Wahrheit', exact: true }).click();
  await expect(page.locator('#play-content')).not.toHaveText('Wähle Wahrheit oder Pflicht.');
  await page.getByRole('button', { name: 'Erledigt · nächste Person' }).click();
  await expect(page.locator('#play-player')).toContainText('Sam');
  await page.getByRole('button', { name: 'Beenden & speichern' }).click();

  await page.getByRole('button', { name: 'Verlauf', exact: true }).click();
  await expect(page.locator('#hub-history')).toContainText('Wahrheit oder Pflicht');
  await expect(page.locator('#hub-history')).toContainText(/1 Runde(?!n)/);
  await expect(page.locator('#achievement-count')).toHaveText('1');
});

test('shared players, presets and favorites persist locally', async ({ page }) => {
  await page.getByRole('button', { name: 'Spieler', exact: true }).click();
  await page.locator('#hub-players').fill('Aylin\nBen\nCem\nDaria\nEren');
  await page.getByRole('button', { name: 'Spieler speichern' }).click();
  await expect(page.locator('#hub-players-help')).toContainText('5 eindeutige Personen');

  await page.locator('#preset-name').fill('Freitag');
  await page.getByRole('button', { name: 'Aktuelle Gruppe als Preset' }).click();
  await expect(page.locator('#preset-list')).toContainText('Freitag');

  await page.getByRole('button', { name: 'Spiele', exact: true }).click();
  await page.locator('#game-search').fill('Hot Takes');
  await page.locator('[data-favorite-game="hot-takes"]').click();
  await page.getByRole('button', { name: 'Favoriten', exact: true }).click();
  await expect(page.locator('#favorites-grid')).toContainText('Hot Takes');

  await page.reload();
  await page.getByRole('button', { name: 'Spieler', exact: true }).click();
  await expect(page.locator('#hub-players')).toHaveValue('Aylin\nBen\nCem\nDaria\nEren');
  await expect(page.locator('#preset-list')).toContainText('Freitag');
  await page.getByRole('button', { name: 'Favoriten', exact: true }).click();
  await expect(page.locator('#favorites-grid')).toContainText('Hot Takes');
});

test('advanced Quick Trend and Viral Modes are all playable', async ({ page }) => {
  await page.getByRole('button', { name: 'Alle Spiele ansehen' }).click();
  await page.locator('#game-search').fill('Mafia');
  await page.locator('[data-open-game="mafia"]:visible').click();
  await expect(page.locator('#detail-badges')).toContainText('Jetzt spielbar');
  await page.locator('#start-selected-game').click();
  await expect(page).toHaveURL(/advanced\.html\?game=mafia/);

  await page.goto('/party.html');
  await page.getByRole('button', { name: 'Spiele', exact: true }).click();
  await page.locator('#game-search').fill('Spektrum');
  await page.locator('[data-open-game="wavelength"]:visible').click();
  await page.getByRole('button', { name: 'Quick Mode öffnen' }).click();
  await expect(page).toHaveURL(/quick-play\.html\?game=wavelength/);

  await page.goto('/party.html');
  await page.getByRole('button', { name: 'Spiele', exact: true }).click();
  await page.locator('#game-search').fill('Wer bin ich');
  await page.locator('[data-open-game="who-am-i"]:visible').click();
  await page.getByRole('button', { name: 'Trend Mode öffnen' }).click();
  await expect(page).toHaveURL(/quick-play\.html\?game=who-am-i/);

  await page.goto('/party.html');
  await page.getByRole('button', { name: 'Spiele', exact: true }).click();
  await page.locator('#game-search').fill('Finger runter');
  await page.locator('[data-open-game="put-a-finger-down"]:visible').click();
  await page.getByRole('button', { name: 'Viral Mode öffnen' }).click();
  await expect(page).toHaveURL(/quick-play\.html\?game=put-a-finger-down/);
  await expect(page.getByRole('heading', { name: 'Finger runter' })).toBeVisible();
});

test('planned catalog filter is empty because all visible games are playable', async ({ page }) => {
  await page.getByRole('button', { name: 'Alle Spiele ansehen' }).click();
  await page.locator('#status-filter').selectOption('planned');
  await expect(page.locator('#result-count')).toHaveText('0');
  await expect(page.locator('#game-grid')).toContainText('Keine Spiele passen zu diesen Filtern.');
});

test('party hub links back to the production word imposter flow', async ({ page }) => {
  await page.getByRole('link', { name: 'Word Imposter direkt' }).click();
  await expect(page).toHaveURL(/\/index\.html$/);
  await expect(page.getByRole('heading', { name: 'Word Imposter', level: 1 })).toBeVisible();
  await expect(page.locator('#start')).toBeVisible();
});
test('start labels survive a back-forward cache round trip', async ({ page }) => {
  await page.goto('/party.html');
  await page.evaluate(() => {
    dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true }));
    dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }));
  });
  await page.locator('#browse-games').click();
  for (const [id, label] of [['emoji-quiz', 'Trend Mode öffnen'], ['hot-seat', 'Viral Mode öffnen'], ['mafia', 'Mafia öffnen'], ['imposter', 'Word Imposter öffnen'], ['truth-dare', 'Jetzt spielen']]) {
    await page.locator(`#game-grid [data-open-game="${id}"]`).click();
    await expect(page.locator('#start-selected-game')).toHaveText(label);
    await page.locator('#close-detail').click();
  }
});

test('a custom game sharing a built-in title keeps its own start label', async ({ page }) => {
  await page.goto('/party.html');
  await page.evaluate(() => {
    const title = window.SecretCirclePartyCatalog.getGame('truth-dare').title;
    localStorage.setItem('secret-circle-party-created-games-v1', JSON.stringify({ version: 1, games: [{
      id: 'custom-game-same-title', title, description: 'Eigenes Spiel mit gleichem Namen', templateId: 'prompt',
      packs: [{ name: 'Test', items: ['Karte eins', 'Karte zwei', 'Karte drei'] }]
    }] }));
  });
  await page.reload();
  await page.locator('#browse-games').click();
  await page.locator('#game-grid [data-open-game="custom-game-same-title"]').click();
  await expect(page.locator('#start-selected-game')).toHaveText('Eigenes Spiel starten');
  await page.locator('#close-detail').click();
  await page.locator('#game-grid [data-open-game="truth-dare"]').click();
  await expect(page.locator('#start-selected-game')).toHaveText('Jetzt spielen');
});
