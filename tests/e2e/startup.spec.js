const { test, expect } = require('@playwright/test');

test('all production modules load without startup or resource errors', async ({ page }) => {
  const errors = [];
  const failedRequests = [];

  page.on('pageerror', error => errors.push(`pageerror: ${error.message}`));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('requestfailed', request => {
    const url = new URL(request.url());
    if (url.origin === 'http://127.0.0.1:4173') {
      failedRequests.push(`${url.pathname}: ${request.failure()?.errorText || 'unknown'}`);
    }
  });

  const response = await page.goto('/');
  expect(response?.ok()).toBe(true);
  await expect(page.getByRole('heading', { name: 'Secret Circle' })).toBeVisible();

  const runtime = await page.evaluate(() => ({
    runtimeVersion: window.SecretCircleRuntime?.version,
    setupVersion: window.SecretCircleSetupUx?.version,
    privacyVersion: window.SecretCirclePrivacyGuard?.version,
    wakeLockVersion: window.SecretCircleWakeLock?.version,
    roleVersion: window.SecretCircleRoleAssignment?.version,
    engineVersion: window.SecretCircleEngine?.VERSION,
    engineFrozen: Object.isFrozen(window.SecretCircleEngine),
    maximumImposters: window.SecretCircleEngine?.MAX_IMPOSTERS,
    contentVersion: window.SecretCircleContent?.version,
    storeVersion: window.SecretCircleStore?.version,
    createGameType: typeof window.SecretCircleEngine?.createGame,
    restoreGameType: typeof window.SecretCircleEngine?.restoreGame
  }));

  expect(runtime).toMatchObject({
    runtimeVersion: '1.0.0-beta.3',
    setupVersion: 3,
    privacyVersion: 2,
    wakeLockVersion: 1,
    roleVersion: 3,
    engineVersion: 7,
    engineFrozen: true,
    maximumImposters: 6,
    contentVersion: 1,
    createGameType: 'function',
    restoreGameType: 'function'
  });
  expect(runtime.storeVersion).toBeTruthy();
  expect(failedRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test('every HTML-referenced local production asset returns successfully', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const assets = [
      ...document.querySelectorAll('script[src], link[href]')
    ].map(node => node.getAttribute('src') || node.getAttribute('href'))
      .filter(Boolean)
      .filter(value => !value.startsWith('data:'));
    const unique = [...new Set(assets)];
    const statuses = {};
    for (const asset of unique) {
      const response = await fetch(asset, { cache: 'no-store' });
      statuses[asset] = response.status;
    }
    return statuses;
  });

  for (const [asset, status] of Object.entries(result)) {
    expect(status, `${asset} did not load successfully`).toBeGreaterThanOrEqual(200);
    expect(status, `${asset} did not load successfully`).toBeLessThan(400);
  }
});
