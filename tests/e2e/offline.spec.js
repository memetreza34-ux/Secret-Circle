const { test, expect } = require('@playwright/test');

test('service worker caches the complete offline core', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) throw new Error('Service Worker is unavailable.');
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);

  const cacheState = await page.evaluate(async () => {
    const names = await caches.keys();
    const cache = await caches.open('secret-circle-v17');
    const expected = [
      './index.html', './privacy.html', './styles.css', './pwa.css',
      './runtime-guard.js', './setup-ux.js', './privacy-guard.js',
      './wake-lock.js', './app.js', './game-engine.js',
      './role-assignment.js', './word-packs.js', './data-store.js',
      './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'
    ];
    const missing = [];
    for (const path of expected) {
      const response = await cache.match(path);
      if (!response) missing.push(path);
    }
    return { names, missing };
  });
  expect(cacheState.names).toContain('secret-circle-v17');
  expect(cacheState.names.filter(name => name.startsWith('secret-circle-'))).toEqual(['secret-circle-v17']);
  expect(cacheState.missing).toEqual([]);

  await context.setOffline(true);
  await page.goto('/privacy.html');
  await expect(page.getByRole('heading', { name: 'Datenschutz' })).toBeVisible();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Secret Circle' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Spiel starten' })).toBeEnabled();
  await expect(page.locator('#players-help')).toContainText('eindeutige Personen erkannt');
});

test('offline mode preserves a locally saved active game', async ({ page, context }) => {
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
