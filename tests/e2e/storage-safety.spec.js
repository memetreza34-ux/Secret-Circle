const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
});

test('malformed local JSON is discarded without breaking startup', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('secret-circle-custom-v7', '{not-json');
    localStorage.setItem('secret-circle-history-v7', 'null');
    localStorage.setItem('secret-circle-settings-v7', '[]');
    localStorage.setItem('secret-circle-active-v7', '{broken');
  });
  await page.reload();

  await expect(page.locator('#setup-screen')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Spiel starten' })).toBeEnabled();
  await expect(page.locator('#custom-list')).toContainText('Noch keine eigenen Kategorien');
  await expect(page.locator('#history-list')).toContainText('Noch keine abgeschlossenen Runden');
  await expect(page.locator('#resume-box')).toBeHidden();
});

test('stored user text is rendered as text and never as executable markup', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('secret-circle-custom-v7', JSON.stringify([{
      id: 'unsafe-category',
      name: '<img src=x onerror=window.__xss=true>',
      entries: [
        { word: '<svg onload=window.__xss=true>', hint: 'Hinweis' },
        { word: 'Sicher', hint: 'Test' }
      ]
    }]));
    localStorage.setItem('secret-circle-history-v7', JSON.stringify([{
      id: 'unsafe-history',
      completedAt: new Date().toISOString(),
      category: '<img src=x onerror=window.__xss=true>',
      playerCount: 4,
      imposterCount: 1,
      word: '<script>window.__xss=true</script>',
      imposters: ['Alex'],
      winner: 'imposters',
      round: 1
    }]));
  });
  await page.reload();

  await page.getByRole('button', { name: 'Eigene Kategorien' }).click();
  await expect(page.locator('#custom-list')).toContainText('<img src=x onerror=window.__xss=true>');
  await expect(page.locator('#history-list')).toContainText('<script>window.__xss=true</script>');
  await expect(page.locator('#custom-list img, #custom-list svg, #history-list img, #history-list script')).toHaveCount(0);
  expect(await page.evaluate(() => window.__xss)).toBeUndefined();
});

test('invalid stored category entries are removed independently', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('secret-circle-custom-v7', JSON.stringify([
      { id: 'valid', name: 'Weltraum', entries: [['Mond', 'Nacht'], ['Mars', 'Planet']] },
      { id: 'invalid', name: 'Kaputt', entries: [['Nur ein Begriff', 'Hinweis']] },
      { id: 'duplicate-id', name: 'Doppelt', entries: [['A', 'A'], ['B', 'B']] },
      { id: 'duplicate-id', name: 'Noch einmal', entries: [['C', 'C'], ['D', 'D']] }
    ]));
  });
  await page.reload();
  await page.getByRole('button', { name: 'Eigene Kategorien' }).click();

  await expect(page.locator('#custom-list')).toContainText('Weltraum');
  await expect(page.locator('#custom-list')).not.toContainText('Kaputt');
  await expect(page.locator('#custom-list')).toContainText('Doppelt');
  await expect(page.locator('#custom-list')).not.toContainText('Noch einmal');
});
