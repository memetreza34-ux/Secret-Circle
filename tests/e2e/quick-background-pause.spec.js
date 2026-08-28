const { test, expect } = require('@playwright/test');

const TIMER_KEY = 'secret-circle-party-quick-timers-v1';

async function seedHub(page) {
  await page.goto('/party.html');
  await page.evaluate(() => {
    localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika', 'Lina'],
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
    localStorage.removeItem('secret-circle-party-quick-active-v1');
    localStorage.removeItem('secret-circle-party-quick-timers-v1');
  });
}

function secondsFromClock(text) {
  const match = String(text || '').trim().match(/^(\d+):(\d{2})$/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : NaN;
}

async function setSyntheticHidden(page, hidden) {
  await page.evaluate(value => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => value
    });
    document.dispatchEvent(new Event('visibilitychange'));
  }, hidden);
}

test('BG59/HS60 hidden Quick timer auto-pauses, persists immediately and requires explicit resume', async ({ page }) => {
  await seedHub(page);
  await page.goto('/quick-play.html?game=rapid-fire');
  await page.locator('#quick-rounds').selectOption('3');
  await page.locator('#quick-start').click();

  const startTimer = page.getByRole('button', { name: /Sekunden starten/ });
  await startTimer.click();
  const timer = page.locator('.quick-timer');
  await expect(timer).toBeVisible();
  await page.waitForTimeout(1_100);
  const beforeHidden = secondsFromClock(await timer.textContent());
  expect(beforeHidden).toBeGreaterThan(0);

  await setSyntheticHidden(page, true);
  await expect(page.locator('#quick-pause')).toHaveText('Fortsetzen');
  await expect(page.locator('#quick-pause-overlay')).toBeVisible();
  const pausedAt = secondsFromClock(await timer.textContent());

  const hiddenStore = await page.evaluate(timerKey => JSON.parse(localStorage.getItem(timerKey)), TIMER_KEY);
  expect(hiddenStore.version).toBe(1);
  expect(hiddenStore.snapshots.quick.gameId).toBe('rapid-fire');
  expect(hiddenStore.snapshots.quick.remainingMs).toBeGreaterThan(0);
  expect(hiddenStore.snapshots.quick.remainingMs).toBeLessThanOrEqual(hiddenStore.snapshots.quick.durationMs);

  await page.waitForTimeout(1_300);
  expect(secondsFromClock(await timer.textContent())).toBe(pausedAt);

  await setSyntheticHidden(page, false);
  await expect(page.locator('#quick-pause')).toHaveText('Fortsetzen');
  await page.waitForTimeout(1_100);
  expect(secondsFromClock(await timer.textContent())).toBe(pausedAt);

  await page.locator('#quick-pause').click();
  await expect(page.locator('#quick-pause')).toHaveText('Pause');
  await expect(page.locator('#quick-pause-overlay')).toBeHidden();
  await page.waitForTimeout(1_200);
  expect(secondsFromClock(await timer.textContent())).toBeLessThan(pausedAt);

  await page.getByRole('button', { name: 'Nicht geschafft' }).click();
  expect(await page.evaluate(timerKey => localStorage.getItem(timerKey), TIMER_KEY)).toBeNull();
});
