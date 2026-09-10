const { test, expect } = require('@playwright/test');

/* Browser mit vollständig gesperrtem lokalem Speicher (privates Fenster,
   "alle Cookies blockieren") lassen schon den Zugriff auf window.localStorage
   scheitern. Ohne Ersatz brach jedes Modul beim Laden ab und die Seiten blieben
   leer. Der Ersatzspeicher hält die Sitzung im Arbeitsspeicher. */
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() { throw new DOMException('storage disabled', 'SecurityError'); }
    });
  });
});

test('alle Seiten laden ohne Fehler, wenn der lokale Speicher gesperrt ist', async ({ page }) => {
  const problems = [];
  page.on('pageerror', error => problems.push(`pageerror: ${error.message}`));
  page.on('console', message => { if (message.type() === 'error') problems.push(`console: ${message.text()}`); });

  for (const url of ['/', '/party.html', '/quick-play.html?game=rapid-fire', '/creator.html', '/advanced.html?game=two-truths']) {
    await page.goto(url);
    await expect(page.locator('h1').first()).toBeVisible();
    expect(await page.evaluate(() => window.SecretCircleRuntime?.storageFallbackActive), url).toBe(true);
  }
  expect(problems).toEqual([]);
});

test('eine Quick-Runde bleibt mit gesperrtem Speicher vollständig spielbar', async ({ page }) => {
  await page.goto('/party.html');
  await page.evaluate(() => localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
    version: 1,
    players: ['Alex', 'Sam', 'Mika'],
    favorites: [], recent: [], presets: [], history: [], stats: {}
  })));
  await page.goto('/quick-play.html?game=rapid-fire');
  await page.locator('#quick-rounds').selectOption('3');
  await page.locator('#quick-start').click();
  await expect(page.locator('#quick-play')).toBeVisible();
  await page.getByRole('button', { name: /Sekunden starten/ }).click();
  await expect(page.locator('.quick-timer')).toBeVisible();
  await page.getByRole('button', { name: /geschafft$/ }).first().click();
  await expect(page.locator('#quick-content')).toContainText('Punkt');
});

test('der Hub weist auf den fehlenden Speicher hin', async ({ page }) => {
  await page.goto('/party.html');
  await expect(page.locator('#hub-status')).toContainText('kein');
});
