const { test, expect } = require('@playwright/test');

test('service worker caches the complete offline core including the Party Hub', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) throw new Error('Service Worker is unavailable.');
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);

  const cacheState = await page.evaluate(async () => {
    const names = await caches.keys();
    const cache = await caches.open('secret-circle-v19');
    const expected = [
      './index.html', './party.html', './privacy.html',
      './styles.css', './pwa.css', './party.css',
      './runtime-guard.js', './setup-ux.js', './privacy-guard.js',
      './wake-lock.js', './app.js', './game-engine.js',
      './role-assignment.js', './word-packs.js', './data-store.js',
      './party-catalog.js', './party-hub.js',
      './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'
    ];
    const missing = [];
    for (const path of expected) {
      const response = await cache.match(path);
      if (!response) missing.push(path);
    }
    return { names, missing };
  });
  expect(cacheState.names).toContain('secret-circle-v19');
  expect(cacheState.names.filter(name => name.startsWith('secret-circle-'))).toEqual(['secret-circle-v19']);
  expect(cacheState.missing).toEqual([]);

  await context.setOffline(true);
  await page.goto('/privacy.html');
  await expect(page.getByRole('heading', { name: 'Datenschutz' })).toBeVisible();
  await page.goto('/party.html');
  await expect(page.getByRole('heading', { name: 'Der ganze Spieleabend in einer App' })).toBeVisible();
  await expect(page.locator('#playable-count')).toHaveText('14');
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Secret Circle' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Spiel starten' })).toBeEnabled();
  await expect(page.locator('#players-help')).toContainText('eindeutige Personen erkannt');
});

test('offline Party Hub can run a prompt game and preserve local data', async ({ page, context }) => {
  await page.goto('/party.html');
  await page.evaluate(() => localStorage.removeItem('secret-circle-party-hub-v1'));
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);

  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#hub-connection')).toContainText('Offline-Modus');
  await page.getByRole('button', { name: 'Alle Spiele ansehen' }).click();
  await page.locator('#game-search').fill('Entweder oder');
  await page.locator('[data-open-game="would-rather"]').click();
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await expect(page.locator('#play-layer')).toBeVisible();
  await expect(page.locator('.choice-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'Nächste Entscheidung' }).click();
  await page.getByRole('button', { name: 'Spiel verlassen' }).click();
  await page.getByRole('button', { name: 'Verlauf' }).click();
  await expect(page.locator('#hub-history')).toContainText('Entweder oder');
});

test('offline mode preserves a locally saved active Imposter game', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator('#players').fill('Alex\nSam\nMika');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
  await page.getByRole('button', { name: 'Karte schließen und weitergeben' }).click();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);

  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#connection')).toContainText('Offline-Modus');
  await expect(page.locator('#resume-box')).toBeVisible();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#reveal-progress')).toContainText('Karte 2 von 3');
});
