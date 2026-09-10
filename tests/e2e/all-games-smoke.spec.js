const { test, expect } = require('@playwright/test');

/* Deckt jedes einzelne Spiel des Katalogs ab: Öffnen, Starten und die erste
   Spielfläche. Die übrigen Tests prüfen einzelne Spiele tief, dieser hier
   verhindert, dass ein Spiel beim Umbauen des Katalogs stillschweigend
   unerreichbar wird. */
const PLAYERS = ['Alex', 'Sam', 'Mika', 'Lina', 'Nora', 'Timo', 'Jara', 'Ben'];
const STEP = 8_000;

test('jedes Spiel im Katalog lässt sich öffnen und starten', async ({ page }) => {
  test.slow();
  const problems = [];
  page.on('pageerror', error => problems.push(`pageerror: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error') problems.push(`console: ${message.text()}`); });
  page.on('dialog', dialog => dialog.accept());

  await page.goto('/party.html');
  await page.evaluate(players => localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
    version: 1, players, favorites: [], recent: [], presets: [], history: [], stats: {}
  })), PLAYERS);

  const games = await page.evaluate(() => window.SecretCirclePartyCatalog.games
    .map(game => ({ id: game.id, href: game.href || null })));
  expect(games.length).toBeGreaterThanOrEqual(55);

  for (const game of games) {
    /* Vor jedem Spiel die gespeicherten Sessions leeren: Sonst fragt der
       Ersetzungsschutz nach und das nächste Spiel startet zu Recht nicht. */
    await page.evaluate(() => {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('secret-circle-') && key.includes('active')) localStorage.removeItem(key);
      }
    });

    if (!game.href) {
      await page.goto('/party.html?view=games');
      await page.locator(`[data-open-game="${game.id}"]:visible`).first().click({ timeout: STEP });
      await page.getByRole('button', { name: 'Jetzt spielen' }).click({ timeout: STEP });
      await expect(page.locator('#play-layer'), game.id).toBeVisible({ timeout: STEP });
      continue;
    }

    await page.goto('/' + game.href);
    if (game.href.startsWith('index')) {
      await page.locator('#players').fill(PLAYERS.join('\n'));
      await page.locator('#start').click({ timeout: STEP });
      await expect(page.locator('#reveal-screen'), game.id).toBeVisible({ timeout: STEP });
    } else if (game.href.startsWith('advanced')) {
      await page.locator('#advanced-start').click({ timeout: STEP });
      await expect(page.locator('#advanced-play-layer'), game.id).toBeVisible({ timeout: STEP });
    } else {
      await page.locator('#quick-start').click({ timeout: STEP });
      await expect(page.locator('#quick-play'), game.id).toBeVisible({ timeout: STEP });
    }
  }

  expect(problems).toEqual([]);
});
