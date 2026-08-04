const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('runtime version matches the visible production beta version', async ({ page }) => {
  const runtimeVersion = await page.evaluate(() => window.SecretCircleRuntime?.version);
  expect(runtimeVersion).toBe('1.0.0-beta.3');
  await expect(page.locator('.app-footer')).toContainText('Version 1.0.0-beta.3');
});

test('unexpected runtime errors produce a recoverable user message', async ({ page }) => {
  await page.evaluate(() => {
    window.dispatchEvent(new ErrorEvent('error', {
      message: 'synthetic runtime failure',
      error: new Error('synthetic runtime failure')
    }));
  });

  await expect(page.locator('#status')).toHaveClass(/error/);
  await expect(page.locator('#status')).toContainText('unerwarteter Fehler');
  await expect(page.locator('#status')).toContainText('gespeicherter Spielstand bleibt erhalten');
});

test('critical resource errors are surfaced instead of leaving a silent broken screen', async ({ page }) => {
  await page.evaluate(() => {
    const script = document.createElement('script');
    document.body.append(script);
    script.dispatchEvent(new Event('error'));
    script.remove();
  });

  await expect(page.locator('#status')).toHaveClass(/error/);
  await expect(page.locator('#status')).toContainText('benötigte App-Datei');
});

test('runtime guard is available from the complete offline cache', async ({ page }) => {
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  const cached = await page.evaluate(async () => {
    const cache = await caches.open('secret-circle-v23');
    return Boolean(await cache.match('./runtime-guard.js'));
  });
  expect(cached).toBe(true);
});
