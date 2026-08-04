const { test, expect } = require('@playwright/test');

async function revealAll(page, count = 3) {
  for (let index = 0; index < count; index += 1) {
    await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
    await page.getByRole('button', { name: 'Karte schließen und weitergeben' }).click();
  }
}

test('discussion requests a screen wake lock and releases it before voting', async ({ page }) => {
  await page.addInitScript(() => {
    window.__wakeRequests = 0;
    window.__wakeReleases = 0;
    Object.defineProperty(Navigator.prototype, 'wakeLock', {
      configurable: true,
      get() {
        return {
          request: async type => {
            if (type !== 'screen') throw new Error('Unexpected wake lock type.');
            window.__wakeRequests += 1;
            const listeners = [];
            return {
              addEventListener(event, listener) {
                if (event === 'release') listeners.push(listener);
              },
              async release() {
                window.__wakeReleases += 1;
                listeners.forEach(listener => listener());
              }
            };
          }
        };
      }
    });
  });

  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator('#players').fill('Alex\nSam\nMika');
  await page.locator('#match-rounds').selectOption('1');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await revealAll(page);

  await expect(page.locator('#round-screen')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__wakeRequests)).toBe(1);

  await page.getByRole('button', { name: 'Abstimmung starten' }).click();
  await expect(page.locator('#vote-screen')).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.__wakeReleases)).toBe(1);
});

test('wake lock remains an optional enhancement when the API is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, 'wakeLock', {
      configurable: true,
      value: undefined
    });
  });
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.locator('#players').fill('Alex\nSam\nMika');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await revealAll(page);

  await expect(page.locator('#round-screen')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Abstimmung starten' })).toBeEnabled();
  const contract = await page.evaluate(() => ({
    version: window.SecretCircleWakeLock?.version,
    frozen: Object.isFrozen(window.SecretCircleWakeLock),
    requestType: typeof window.SecretCircleWakeLock?.request,
    releaseType: typeof window.SecretCircleWakeLock?.release
  }));
  expect(contract).toEqual({
    version: 1,
    frozen: true,
    requestType: 'function',
    releaseType: 'function'
  });
});
