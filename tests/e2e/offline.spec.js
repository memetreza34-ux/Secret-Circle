const { test, expect } = require('@playwright/test');

async function waitForWorker(page) {
  await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) throw new Error('Service Worker is unavailable.');
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
}

async function seedPlayers(page) {
  await page.evaluate(() => {
    localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika', 'Lina'],
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
  });
}

test('service worker caches the complete v27 core including all trend engines', async ({ page, context }) => {
  await page.goto('/party.html');
  await waitForWorker(page);

  const cacheState = await page.evaluate(async () => {
    const names = await caches.keys();
    const cache = await caches.open('secret-circle-v27');
    const expected = [
      './index.html', './party.html', './advanced.html', './quick-play.html', './privacy.html',
      './styles.css', './pwa.css', './party.css', './party-extra.css', './party-night.css', './party-quick.css',
      './runtime-guard.js', './setup-ux.js', './privacy-guard.js', './wake-lock.js',
      './app.js', './game-engine.js', './role-assignment.js', './word-packs.js', './data-store.js',
      './party-catalog.js', './party-expansion.js', './party-trending-catalog.js', './party-mega-catalog.js',
      './party-routing.js', './party-custom-packs.js', './party-hub.js', './party-hub-plus.js',
      './party-hub-polish.js', './party-night.js', './party-data-tools.js', './party-advanced.js',
      './party-advanced-runner.js', './party-advanced-preferences.js', './party-quick-modes.js',
      './party-mega-modes.js', './quick-loader.js', './manifest.webmanifest', './icon.svg',
      './icon-192.png', './icon-512.png'
    ];
    const missing = [];
    for (const path of expected) if (!await cache.match(path)) missing.push(path);
    return { names, missing };
  });
  expect(cacheState.names).toContain('secret-circle-v27');
  expect(cacheState.names.filter(name => name.startsWith('secret-circle-'))).toEqual(['secret-circle-v27']);
  expect(cacheState.missing).toEqual([]);

  await context.setOffline(true);
  await page.goto('/party.html');
  await expect(page.getByRole('heading', { name: 'Der ganze Spieleabend in einer App' })).toBeVisible();
  await expect(page.locator('#playable-count')).toHaveText('37');
  await page.goto('/privacy.html');
  await expect(page.getByRole('heading', { name: 'Datenschutz' })).toBeVisible();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Secret Circle' })).toBeVisible();
});

test('offline Party Hub can create a Party Night plan and run a prompt game', async ({ page, context }) => {
  await page.goto('/party.html');
  await page.evaluate(() => localStorage.removeItem('secret-circle-party-hub-v1'));
  await waitForWorker(page);
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#hub-connection')).toContainText('Offline-Modus');
  await page.locator('#party-night-duration').selectOption('30');
  await page.getByRole('button', { name: 'Plan erstellen' }).click();
  await expect(page.locator('.party-night-step')).toHaveCount(2);
  await page.getByRole('button', { name: 'Alle Spiele ansehen' }).click();
  await page.locator('#game-search').fill('Entweder oder');
  await page.locator('[data-open-game="would-rather"]').click();
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await expect(page.locator('#play-layer')).toBeVisible();
});

test('advanced Question Imposter starts completely offline', async ({ page, context }) => {
  await page.goto('/party.html');
  await seedPlayers(page);
  await waitForWorker(page);
  await context.setOffline(true);
  await page.goto('/advanced.html?game=question-imposter');
  await expect(page.getByRole('heading', { name: /Question Imposter/ })).toBeVisible();
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await expect(page.locator('#advanced-play-layer')).toBeVisible();
});

test('classic Wavelength Quick Mode starts and resumes offline', async ({ page, context }) => {
  await page.goto('/party.html');
  await seedPlayers(page);
  await waitForWorker(page);
  await context.setOffline(true);
  await page.goto('/quick-play.html?game=wavelength');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await page.getByRole('button', { name: 'Ziel verbergen und Gerät weitergeben' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('input[type="range"]')).toBeVisible();
});

test('Anime Trend Mode starts and resumes completely offline', async ({ page, context }) => {
  await page.goto('/party.html');
  await seedPlayers(page);
  await waitForWorker(page);
  await context.setOffline(true);
  await page.goto('/quick-play.html?game=anime-guess');
  await expect(page.getByRole('heading', { name: 'Anime-Figuren erraten' })).toBeVisible();
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await page.getByRole('button', { name: 'Figur der Gruppe zeigen' }).click();
  await expect(page.locator('.challenge-card')).not.toHaveText('');
  await page.reload();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.getByRole('button', { name: 'Figur verbergen und 60 Sekunden starten' })).toBeVisible();
});

test('offline mode preserves a locally saved active Imposter game', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator('#players').fill('Alex\nSam\nMika');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
  await page.getByRole('button', { name: 'Karte schließen und weitergeben' }).click();
  await waitForWorker(page);
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#resume-box')).toBeVisible();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#reveal-progress')).toContainText('Karte 2 von 3');
});
