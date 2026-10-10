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

test('malicious-looking player names stay text through reveal and voting', async ({ page }) => {
  const maliciousPlayer = '<img src=x onerror=window.__x=4>';
  const players = [maliciousPlayer, 'Sam', 'Mika'];
  await page.locator('#players').fill(players.join('\n'));
  await page.locator('#match-rounds').fill('1');
  await page.locator('#start').click();

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
