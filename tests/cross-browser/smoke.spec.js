const { test, expect } = require('@playwright/test');

function captureErrors(page) {
  const errors = [];
  const pending = new Set();
  let lastActivity = Date.now();
  const finished = request => { pending.delete(request); lastActivity = Date.now(); };
  page.on('request', request => { pending.add(request); lastActivity = Date.now(); });
  page.on('requestfinished', finished);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('requestfailed', request => { finished(request); errors.push(`request failed: ${request.url()}`); });
  // Vor absichtlicher Navigation müssen auch verzögert angeforderte Assets fertig
  // sein. Echte Abbrüche bleiben Fehler; es wird nichts aus errors herausgefiltert.
  const waitForResources = () => expect.poll(() => ({ pending: pending.size, quiet: Date.now() - lastActivity >= 200 }))
    .toEqual({ pending: 0, quiet: true });
  return { errors, waitForResources };
}

test.beforeEach(async ({ page }) => {
  // Ein neuer Offline-Cache kann den Hinweis erst während der Navigation zeigen.
  await page.addLocatorHandler(page.locator('.pwa-update-banner'), async notice => {
    await notice.getByRole('button', { name: 'Später', exact: true }).click();
  });
  // Speicher vorbereiten, ohne bereits App-Bilder und Skripte zu starten.
  await page.goto('/package.json');
  await page.evaluate(() => localStorage.clear());
});

test('canonical Hub aliases, dedicated Word Imposter and privacy load without browser errors', async ({ page }) => {
  const { errors, waitForResources } = captureErrors(page);
  for (const route of ['/', '/index.html', '/v2-hub.html']) {
    await page.goto(route);
    await expect(page.locator('[data-screen="home"]')).toBeVisible();
    await expect(page.locator('#hero-title')).not.toBeEmpty();
    await waitForResources();
  }
  await page.goto('/word-imposter.html');
  await expect(page.getByRole('heading', { name: 'Word Imposter', level: 1 })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Spiel starten' })).toBeDisabled();
  await page.locator('#players').fill('Alex\nSam\nMika');
  await expect(page.getByRole('button', { name: 'Spiel starten' })).toBeEnabled();
  await expect(page.locator('#category option')).toHaveCount(15);
  await waitForResources();

  await page.goto('/privacy.html');
  await expect(page.getByRole('heading', { name: 'Deine Spieldaten bleiben auf deinem Gerät' })).toBeVisible();
  await waitForResources();
  expect(errors).toEqual([]);
});

/* Öffnet ein Spiel über die Katalogsuche. Die Vorschlagsliste unter dem
   Suchfeld kann auf schmalen Bildschirmen über den Karten liegen; ein Mensch
   schließt sie zuerst. */
async function openFromCatalog(page, query, gameId, startLabel, waitForResources) {
  await waitForResources();
  await page.goto('/party.html');
  await page.getByRole('button', { name: 'Spiele', exact: true }).click();
  await page.locator('#game-search').fill(query);
  await page.locator('#game-search').press('Escape');
  await page.locator(`#game-grid [data-open-game="${gameId}"]`).click();
  await waitForResources();
  await page.getByRole('button', { name: startLabel }).click();
}

async function seedGroup(page) {
  await page.evaluate(() => localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
    version: 1, players: ['Alex', 'Sam', 'Mika', 'Lina'],
    favorites: [], recent: [], presets: [], history: [], stats: {}
  })));
  await page.evaluate(() => localStorage.setItem('secret-circle-party-preferences-v1', JSON.stringify({ sessionLength: 10 })));
}

test('loads the 55-game Hub and builds a Party Night plan', async ({ page }) => {
  const { errors, waitForResources } = captureErrors(page);
  await seedGroup(page);
  await page.goto('/party.html');
  await expect(page.getByRole('heading', { name: 'Von der ersten Runde bis zum nächsten Spiel' })).toBeVisible();
  await expect(page.locator('#playable-count')).toHaveText('55');
  await page.locator('#party-night-duration').selectOption('30');
  await page.getByRole('button', { name: 'Plan erstellen' }).click();
  await expect(page.locator('.party-night-step').first()).toBeVisible();

  await page.getByRole('button', { name: 'Spiele', exact: true }).click();
  await expect(page.locator('#game-grid .game-card.playable')).toHaveCount(55);
  await waitForResources();
  expect(errors).toEqual([]);
});

// Jede Familie erhält denselben eigenen Zeitrahmen und dieselbe Fehlerprüfung.
// So kann ein früher langsamer Wechsel die späteren Familien nicht verdrängen.
for (const engine of [
  { id: 'question-imposter', query: 'Question Imposter', label: 'Question Imposter öffnen', title: 'Question Imposter', page: 'advanced' },
  { id: 'wavelength', query: 'Spektrum', label: 'Quick Mode öffnen', title: 'Spektrum-Tipp', page: 'quick-play' },
  { id: 'anime-guess', query: 'Anime-Archetypen', label: 'Trend Mode öffnen', title: 'Anime-Archetypen erraten', page: 'quick-play' },
  { id: 'guess-the-price', query: 'Preis schätzen', label: 'Viral Mode öffnen', title: 'Preis schätzen', page: 'quick-play' }
]) {
  test(`opens ${engine.id} from the Hub without resource errors`, async ({ page }) => {
    const { errors, waitForResources } = captureErrors(page);
    await seedGroup(page);
    await openFromCatalog(page, engine.query, engine.id, engine.label, waitForResources);
    await expect(page).toHaveURL(new RegExp(`/${engine.page}\\.html\\?game=${engine.id}(?:&|$)`));
    await expect(page.getByRole('heading', { name: engine.title, level: 1 })).toBeVisible();
    if (engine.page === 'advanced') {
      // Die übernommene Rundenzahl belegt den Abschluss des Einstellungsskripts.
      await expect(page.locator('#advanced-length')).toHaveValue('10');
    } else await expect(page.locator('#quick-start')).toBeEnabled();
    await waitForResources();
    expect(errors).toEqual([]);
  });
}

test('starts a three-player Imposter game and protects the secret card', async ({ page }) => {
  await page.goto('/word-imposter.html');
  await page.locator('#players').fill('Alex\nSam\nMika');
  await page.locator('#advanced-settings > summary').click();
  await page.locator('#imposters').fill('1');
  await page.locator('#match-rounds').fill('1');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await expect(page.locator('#secret')).toBeHidden();
  await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
  await expect(page.locator('#secret')).toBeVisible();
  await page.getByRole('button', { name: 'Karte schließen und weitergeben' }).click();
  await expect(page.locator('#reveal-progress')).toContainText('Karte 2 von 3');
});

test('persists and restores an interrupted Imposter game', async ({ page }) => {
  await page.goto('/word-imposter.html');
  await page.locator('#players').fill('Alex\nSam\nMika');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
  await page.getByRole('button', { name: 'Karte schließen und weitergeben' }).click();
  await page.reload();
  await expect(page.locator('#resume-box')).toBeVisible();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#reveal-progress')).toContainText('Karte 2 von 3');
});
