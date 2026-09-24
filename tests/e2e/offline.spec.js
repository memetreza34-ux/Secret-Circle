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

test('service worker caches the complete v30 core including Creator guidance and dedicated player', async ({ page, context }) => {
  await page.goto('/party.html');
  await waitForWorker(page);

  const cacheState = await page.evaluate(async () => {
    const names = await caches.keys();
    /* Cachegeneration nicht festschreiben: Sie steigt mit jedem Offline-Release.
       Geprueft wird, dass genau ein Produktions-Cache existiert und vollstaendig ist. */
    const production = names.filter(name => /^secret-circle-v\d+$/.test(name));
    const cache = await caches.open(production[0]);
    const expected = [
      './index.html', './party.html', './advanced.html', './quick-play.html', './creator.html', './privacy.html',
      './styles.css', './pwa.css', './party.css', './party-extra.css', './party-night.css', './party-quick.css', './party-guide.css', './creator.css',
      './runtime-guard.js', './setup-ux.js', './privacy-guard.js', './wake-lock.js',
      './app.js', './game-engine.js', './role-assignment.js', './word-packs.js', './data-store.js',
      './party-catalog.js', './party-expansion.js', './party-trending-catalog.js', './party-mega-catalog.js',
      './party-viral-catalog.js', './party-routing.js', './game-creator.js', './creator-page.js',
      './party-custom-packs.js', './party-hub.js', './party-hub-plus.js', './party-hub-polish.js', './party-guide.js',
      './party-night.js', './party-data-tools.js', './party-advanced.js', './party-advanced-runner.js',
      './party-advanced-preferences.js', './party-quick-modes.js', './party-mega-modes.js',
      './party-viral-modes.js', './party-created-modes.js', './quick-loader.js',
      './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'
    ];
    const missing = [];
    for (const path of expected) if (!await cache.match(path)) missing.push(path);
    return { names, missing };
  });
  const productionCaches = cacheState.names.filter(name => /^secret-circle-v\d+$/.test(name));
  expect(productionCaches).toHaveLength(1);
  expect(cacheState.missing).toEqual([]);

  await context.setOffline(true);
  await page.goto('/party.html');
  await expect(page.getByRole('heading', { name: 'Von der ersten Runde bis zum nächsten Spiel' })).toBeVisible();
  await expect(page.locator('#playable-count')).toHaveText('55');
  await expect(page.getByRole('heading', { name: 'In drei Schritten zur ersten Runde' })).toBeVisible();
  await page.goto('/creator.html');
  await expect(page.getByRole('heading', { name: 'Eigenes Spiel erstellen' })).toBeVisible();
  await page.goto('/privacy.html');
  await expect(page.getByRole('heading', { name: 'Deine Spieldaten bleiben auf deinem Gerät' })).toBeVisible();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Secret Circle' })).toBeVisible();
});

test('offline Party Hub can create a Party Night plan and run a prompt game', async ({ page, context }) => {
  await page.goto('/party.html');
  /* Der Party-Night-Planer braucht gespeicherte Personen — ohne sie weist er
     korrekt darauf hin, statt einen Plan zu erstellen. */
  await seedPlayers(page);
  await waitForWorker(page);
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#hub-connection')).toContainText('Offline-Modus');
  await page.locator('#party-night-duration').selectOption('30');
  await page.getByRole('button', { name: 'Plan erstellen' }).click();
  await expect(page.locator('.party-night-step')).toHaveCount(2);
  await page.getByRole('button', { name: 'Alle Spiele ansehen' }).click();
  await page.locator('#game-search').fill('Entweder oder');
  await page.locator('[data-open-game="would-rather"]:visible').click();
  await page.getByRole('button', { name: 'Jetzt spielen' }).click();
  await expect(page.locator('#play-layer')).toBeVisible();
});

test('Creator can save launch and resume a custom game completely offline', async ({ page, context }) => {
  await page.goto('/party.html');
  await seedPlayers(page);
  await waitForWorker(page);
  await context.setOffline(true);
  await page.goto('/creator.html');
  await page.locator('[data-template-id="choice"]').click();
  await page.getByRole('button', { name: 'Weiter zu Details' }).click();
  await page.locator('#creator-title').fill('Offline Duell');
  await page.locator('#creator-description').fill('Zwei eigene Optionen werden offline angezeigt und gemeinsam gewählt.');
  await page.getByRole('button', { name: 'Weiter zu Inhalten' }).click();
  await page.locator('.pack-name').fill('Offline');
  await page.locator('.pack-items').fill('Meer | Berge\nTag | Nacht\nRoboter | Drache');
  await page.getByRole('button', { name: 'Weiter zur Prüfung' }).click();
  await page.locator('#creator-safe-confirm').check();
  await page.getByRole('button', { name: 'Spiel speichern' }).click();
  await page.locator('#created-games-list').getByRole('link', { name: 'Testen', exact: true }).click();
  await expect(page.locator('#detail-title')).toHaveText('Offline Duell');
  await page.getByRole('button', { name: 'Eigenes Spiel starten' }).click();
  await expect(page).toHaveURL(/quick-play\.html\?game=custom-game-/);
  await page.locator('#quick-rounds').selectOption('3');
  await page.locator('#quick-start').click();
  await expect(page.locator('.choice-card')).toHaveCount(2);
  await page.locator('.choice-card').first().click();
  await page.getByRole('button', { name: 'Nächste Entscheidung' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#quick-progress')).toContainText('Runde 2 von 3');
  expect(await page.locator('script[src="party-created-modes.js"]').count()).toBe(1);
});

test('advanced Question Imposter starts completely offline', async ({ page, context }) => {
  await page.goto('/party.html');
  await seedPlayers(page);
  await waitForWorker(page);
  await context.setOffline(true);
  await page.goto('/advanced.html?game=question-imposter');
  await expect(page.getByRole('heading', { name: /Question Imposter/ })).toBeVisible();
  await page.locator('#advanced-start').click();
  await expect(page.locator('#advanced-play-layer')).toBeVisible();
});

test('classic Wavelength Quick Mode starts and resumes offline', async ({ page, context }) => {
  await page.goto('/party.html');
  await seedPlayers(page);
  await waitForWorker(page);
  await context.setOffline(true);
  await page.goto('/quick-play.html?game=wavelength');
  await page.locator('#quick-start').click();
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
  await expect(page.getByRole('heading', { name: 'Anime-Archetypen erraten' })).toBeVisible();
  await page.locator('#quick-start').click();
  await page.getByRole('button', { name: 'Figur der Gruppe zeigen' }).click();
  await expect(page.locator('.challenge-card')).not.toHaveText('');
  await page.reload();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.getByRole('button', { name: 'Figur verbergen und 60 Sekunden starten' })).toBeVisible();
});

test('Price Guess Viral Mode starts and resumes completely offline', async ({ page, context }) => {
  await page.goto('/party.html');
  await seedPlayers(page);
  await waitForWorker(page);
  await context.setOffline(true);
  await page.goto('/quick-play.html?game=guess-the-price');
  await expect(page.getByRole('heading', { name: 'Preis schätzen' })).toBeVisible();
  await page.locator('#quick-start').click();
  await page.locator('input[type="number"]').fill('50');
  await page.reload();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('input[type="number"]')).toBeVisible();
  expect(await page.locator('script[src="party-viral-modes.js"]').count()).toBe(1);
});

test('offline mode preserves a locally saved active Imposter game', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator('#players').fill('Alex\nSam\nMika');
  await page.locator('#start').click();
  await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
  await page.getByRole('button', { name: 'Karte schließen und weitergeben' }).click();
  await waitForWorker(page);
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#resume-box')).toBeVisible();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#reveal-progress')).toContainText('Karte 2 von 3');
});

test('connection badge promises offline use only once the worker controls the page', async ({ page }) => {
  await page.goto('/party.html');
  await waitForWorker(page);
  await expect(page.locator('#hub-connection')).toHaveText('Online · offline bereit');
  await page.goto('/');
  await expect(page.locator('#connection')).toHaveText('Online · offline bereit');
});

test.describe('without a service worker', () => {
  /* Privater Modus und In-App-Browser blockieren Service Worker. Dann darf die
     App nicht behaupten, sie sei offline bereit. */
  test.use({ serviceWorkers: 'block' });

  test('connection badge stays at plain online', async ({ page }) => {
    await page.goto('/party.html');
    await expect(page.locator('#hub-connection')).toHaveText('Online');
    await page.goto('/');
    await expect(page.locator('#connection')).toHaveText('Online');
  });
});
