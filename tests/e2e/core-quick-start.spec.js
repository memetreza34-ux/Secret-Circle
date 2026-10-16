'use strict';

const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';

async function prepareGroup(page, players) {
  await page.goto('/party.html');
  await page.evaluate(({ key, list }) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({
      version: 1, players: list, favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
  }, { key: HUB_KEY, list: players });
  await page.reload();
  await expect.poll(() => page.evaluate(() => window.SecretCirclePartyReleaseStructure?.coreIds?.length)).toBe(15);
}

test('Schnellstart empfiehlt ausschließlich passende Kernspiele, nie Labs oder Erweiterungen', async ({ page }) => {
  await prepareGroup(page, ['Aylin', 'Ben', 'Cem', 'Daria']);
  const selected = new Set();
  for (let attempt = 0; attempt < 20; attempt += 1) {
    await page.locator('#quick-start').click();
    await expect(page.locator('#game-detail')).toBeVisible();
    const choice = await page.locator('#game-detail').evaluate(dialog => {
      const game = window.SecretCirclePartyCatalog.getGame(dialog.dataset.gameId);
      const release = window.SecretCirclePartyReleaseStructure;
      return {
        id: game.id,
        tier: release.tierFor(game),
        status: game.status,
        minPlayers: game.minPlayers,
        maxPlayers: game.maxPlayers
      };
    });
    expect(choice.tier, `Schnellstart wählte ${choice.id}`).toBe('core');
    expect(choice.status).toBe('playable');
    expect(choice.minPlayers).toBeLessThanOrEqual(4);
    expect(choice.maxPlayers).toBeGreaterThanOrEqual(4);
    selected.add(choice.id);
    await page.locator('#close-detail').click();
  }
  expect(selected.size).toBeGreaterThan(1);
  expect(await page.evaluate(() => localStorage.getItem('secret-circle-party-hub-active-v1'))).toBeNull();
});

test('Kernspiel-Schnellstart mit kleiner Gruppe respektiert Spielerlimits', async ({ page }) => {
  await prepareGroup(page, ['Aylin', 'Ben']);
  for (let attempt = 0; attempt < 6; attempt += 1) {
    await page.locator('#quick-start').click();
    await expect(page.locator('#game-detail')).toBeVisible();
    const valid = await page.locator('#game-detail').evaluate(dialog => {
      const game = window.SecretCirclePartyCatalog.getGame(dialog.dataset.gameId);
      return window.SecretCirclePartyReleaseStructure.tierFor(game) === 'core'
        && game.minPlayers <= 2 && game.maxPlayers >= 2;
    });
    expect(valid).toBe(true);
    await page.locator('#close-detail').click();
  }
});

test('fehlende Einstufung darf nie experimentelle Spiele zufällig empfehlen', async ({ page }) => {
  await prepareGroup(page, ['Aylin', 'Ben', 'Cem']);
  await page.evaluate(() => { delete window.SecretCirclePartyReleaseStructure; });
  await page.locator('#quick-start').click();
  await expect(page.locator('#game-detail')).toBeHidden();
  await expect(page.locator('#view-games')).toBeVisible();
  await expect(page.locator('#hub-status')).toContainText('Kernspiel-Auswahl wird geladen');
});
