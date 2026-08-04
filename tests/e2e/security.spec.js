const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    delete window.__x;
    delete window.__secretCircleInjected;
  });
  await page.reload();
});

test('custom category markup is rendered only as text', async ({ page }) => {
  const maliciousName = '<img src=x onerror=window.__x=1>';
  const maliciousWord = '<script>window.__secretCircleInjected=2</script>';
  const maliciousHint = '<b onclick="window.__secretCircleInjected=3">Hinweis</b>';

  await page.getByRole('button', { name: 'Eigene Kategorien' }).click();
  await page.locator('#custom-name').fill(maliciousName);
  await page.locator('#custom-words').fill(`${maliciousWord} | ${maliciousHint}\nSicher | Neutral`);
  await page.getByRole('button', { name: 'Kategorie speichern' }).click();

  await expect(page.locator('#custom-list')).toContainText(maliciousName);
  await expect(page.locator('#custom-list img')).toHaveCount(0);
  await expect(page.locator('#custom-list script')).toHaveCount(0);
  await expect(page.locator('#category option').last()).toHaveText(maliciousName);
  const globals = await page.evaluate(() => ({ x: window.__x, injected: window.__secretCircleInjected }));
  expect(globals).toEqual({ x: undefined, injected: undefined });
});

test('malicious-looking player names stay text through reveal and voting', async ({ page }) => {
  const maliciousPlayer = '<img src=x onerror=window.__x=4>';
  const players = [maliciousPlayer, 'Sam', 'Mika'];
  await page.locator('#players').fill(players.join('\n'));
  await page.locator('#match-rounds').selectOption('1');
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  for (let index = 0; index < players.length; index += 1) {
    await expect(page.locator('#player-name')).not.toContainText('[object Object]');
    await expect(page.locator('#reveal-screen img')).toHaveCount(0);
    await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
    await page.getByRole('button', { name: 'Karte schließen und weitergeben' }).click();
  }

  await page.getByRole('button', { name: 'Abstimmung starten' }).click();
  await expect(page.locator('#vote-options img')).toHaveCount(0);
  await expect(page.locator('#vote-options script')).toHaveCount(0);
  expect(await page.evaluate(() => window.__x)).toBeUndefined();
});

test('content security policy excludes unsafe script and object sources', async ({ page }) => {
  const policy = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
  expect(policy).toContain("default-src 'self'");
  expect(policy).toContain("script-src 'self'");
  expect(policy).toContain("object-src 'none'");
  expect(policy).toContain("base-uri 'none'");
  expect(policy).toContain("form-action 'self'");
  expect(policy).not.toContain("'unsafe-inline'");
  expect(policy).not.toContain("'unsafe-eval'");
});
