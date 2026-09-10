const { test, expect } = require('@playwright/test');

/* Die Spielflächen zentrieren ihren Inhalt senkrecht. Ist der Inhalt höher als
   die Fläche, ragte er früher über den oberen Rand hinaus und legte sich über
   die Steuerleiste — der Verlassen-Knopf war dann nicht mehr anklickbar.
   Diese Prüfung hält die Knöpfe auf schmalen und flachen Fenstern erreichbar. */
const VIEWPORTS = [
  { width: 1280, height: 720 },
  { width: 1024, height: 640 },
  { width: 1024, height: 560 },
  { width: 900, height: 600 },
  { width: 800, height: 600 }
];

async function seedPlayers(page) {
  await page.goto('/party.html');
  await page.evaluate(() => localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
    version: 1,
    players: ['Alex', 'Sam', 'Mika', 'Lina'],
    favorites: [], recent: [], presets: [], history: [], stats: {}
  })));
}

async function topElementAt(page, selector) {
  return page.evaluate(id => {
    const node = document.querySelector(id);
    if (!node) return 'fehlt';
    /* Erst in den sichtbaren Bereich holen: Auf kleinen Fenstern liegt die
       Leiste zunächst unterhalb des Sichtfelds, das ist in Ordnung. Geprüft
       wird, ob sie dort von etwas anderem überdeckt wird. */
    node.scrollIntoView({ block: 'center' });
    const box = node.getBoundingClientRect();
    const hit = document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2);
    if (!hit) return 'nichts';
    return hit === node || node.contains(hit) ? 'frei' : (hit.id || hit.tagName);
  }, selector);
}

test('Steuerknöpfe im Advanced-Spiel bleiben auf flachen Fenstern anklickbar', async ({ page }) => {
  await seedPlayers(page);
  for (const viewport of VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.goto('/advanced.html?game=two-truths');
    await page.locator('#advanced-start').click();
    await expect(page.locator('#advanced-play-layer')).toBeVisible();
    expect(await topElementAt(page, '#advanced-exit'), `${viewport.width}x${viewport.height}`).toBe('frei');
  }
});

test('Steuerknöpfe im Hub-Spiel bleiben auf flachen Fenstern anklickbar', async ({ page }) => {
  await seedPlayers(page);
  for (const viewport of VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.goto('/party.html');
    await page.locator('[data-open-game="never-have"]:visible').first().click();
    await page.getByRole('button', { name: 'Jetzt spielen' }).click();
    await expect(page.locator('#play-layer')).toBeVisible();
    for (const control of ['#finish-hub-game', '#abort-hub-game']) {
      expect(await topElementAt(page, control), `${control} ${viewport.width}x${viewport.height}`).toBe('frei');
    }
  }
});
