'use strict';

const { test, expect } = require('@playwright/test');
const catalog = require('../../party-wave-one-clue-catalog.js');

const builtIns = catalog.games.filter(game => game.status === 'playable');
const playerNames = Array.from({ length: 20 }, (_, index) => 'Testperson ' + (index + 1));

test('Release-Katalog enthält genau 55 eindeutige spielbare Titel', async ({ page }) => {
  expect(builtIns).toHaveLength(55);
  expect(new Set(builtIns.map(game => game.id)).size).toBe(55);
  await page.goto('/');
  const actual = await page.evaluate(() => (window.SecretCirclePartyCatalog?.games || [])
    .filter(game => game.status === 'playable').map(game => game.id));
  expect(new Set(actual)).toEqual(new Set(builtIns.map(game => game.id)));
});

/* Schneller vollständiger Titel-Sweep (Chromium Desktop). Die vorhandene
   Cross-Browser-Suite prüft die gemeinsamen Engines separat in Firefox,
   WebKit und Mobilansichten. Dieser Sweep ist ausdrücklich KEIN
   Ergebnis-/Privacy-/Gruppentest und keine 55/55-Releasefreigabe. */
test.describe('55/55 – reale Startwege und erste aktive Szene', () => {
  test.skip(({ browserName, isMobile }) => browserName !== 'chromium' || isMobile,
    'Der vollständige Titel-Sweep läuft in Chromium Desktop; mobile und Cross-Browser-Engine-Tests laufen separat.');

  for (const game of builtIns) {
    test(`Spiel ${game.id}: V2-Start, Routing und aktive Engine`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const amount = Math.max(2, game.minPlayers);
      expect(amount).toBeLessThanOrEqual(game.maxPlayers);

      await page.goto('/');
      await page.evaluate(({ players }) => {
        localStorage.clear();
        localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
          version: 1, players, favorites: [], recent: [], presets: [], history: [], stats: {}
        }));
      }, { players: playerNames.slice(0, amount) });

      await page.goto('/#spiel=' + encodeURIComponent(game.id));
      await expect(page.locator('[data-screen="mode"]')).toBeVisible();
      await expect(page.locator('#mode-title')).toHaveText(game.title);
      await expect(page.locator('#mode-steps li').first()).toBeVisible();
      await expect(page.locator('#start-btn')).toBeEnabled();
      const banner = page.locator('.pwa-update-banner:visible');
      if (await banner.count()) await banner.getByRole('button', { name: 'Später' }).click();
      await page.locator('#start-btn').click();

      const pathname = new URL(page.url()).pathname;
      if (pathname.endsWith('/party.html')) {
        await expect(page.locator('#play-layer')).toBeVisible();
        await expect(page.locator('#play-title')).not.toBeEmpty();
        const snapshot = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-hub-active-v1')));
        expect(snapshot?.session?.gameId).toBe(game.id);
      } else if (pathname.endsWith('/quick-play.html')) {
        await expect(page.locator('#quick-start')).toBeEnabled();
        await page.locator('#quick-start').click();
        await expect(page.locator('#quick-play')).toBeVisible();
        const snapshot = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-quick-active-v1')));
        expect(snapshot?.gameId).toBe(game.id);
      } else if (pathname.endsWith('/advanced.html')) {
        await expect(page.locator('#advanced-start')).toBeEnabled();
        await page.locator('#advanced-start').click();
        await expect(page.locator('#advanced-play-layer')).toBeVisible();
        const snapshot = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-active-v1')));
        expect(snapshot?.gameId).toBe(game.id);
      } else if (pathname.endsWith('/word-imposter.html')) {
        await expect(page.locator('#start')).toBeEnabled();
        await page.locator('#start').click();
        await expect(page.locator('#reveal-screen')).toBeVisible();
      } else {
        throw new Error(`Spiel ${game.id} landete auf einer unbekannten Engine: ${pathname}`);
      }
      expect(errors, `Unbehandelte JS-Fehler bei ${game.id}`).toEqual([]);
    });
  }
});
