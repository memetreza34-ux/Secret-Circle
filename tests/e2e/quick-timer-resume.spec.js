const { test, expect } = require('@playwright/test');

const TIMER_KEY = 'secret-circle-party-quick-timers-v1';
const ACTIVE_KEY = 'secret-circle-party-quick-active-v1';

async function seedHub(page) {
  await page.goto('/party.html');
  await page.evaluate(({ timerKey, activeKey }) => {
    localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika', 'Lina'],
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
    localStorage.removeItem(timerKey);
    localStorage.removeItem(activeKey);
  }, { timerKey: TIMER_KEY, activeKey: ACTIVE_KEY });
}

function secondsFromClock(text) {
  const match = String(text || '').trim().match(/^(\d+):(\d{2})$/);
  if (!match) return NaN;
  return Number(match[1]) * 60 + Number(match[2]);
}

test('running Quick timer resumes with remaining time instead of restarting full duration', async ({ page }) => {
  await seedHub(page);
  await page.goto('/quick-play.html?game=rapid-fire');
  await page.locator('#quick-rounds').selectOption('3');
  await page.locator('#quick-start').click();

  const startTimer = page.getByRole('button', { name: /Sekunden starten/ });
  const label = await startTimer.textContent();
  const durationMatch = String(label).match(/(\d+)\s+Sekunden/);
  expect(durationMatch).not.toBeNull();
  const fullSeconds = Number(durationMatch[1]);
  expect(fullSeconds).toBeGreaterThanOrEqual(5);

  await startTimer.click();
  await expect(page.locator('.quick-timer')).toBeVisible();
  await page.waitForTimeout(1_300);
  const beforeReload = secondsFromClock(await page.locator('.quick-timer').textContent());
  expect(beforeReload).toBeLessThan(fullSeconds);
  expect(beforeReload).toBeGreaterThan(0);

  await page.reload();
  const stored = await page.evaluate(timerKey => JSON.parse(localStorage.getItem(timerKey)), TIMER_KEY);
  expect(stored.version).toBe(1);
  expect(stored.snapshots.quick.gameId).toBe('rapid-fire');
  expect(stored.snapshots.quick.remainingMs).toBeGreaterThan(0);
  expect(stored.snapshots.quick.remainingMs).toBeLessThan(stored.snapshots.quick.durationMs);

  await expect(page.locator('#quick-resume-box')).toBeVisible();
  await page.locator('#quick-resume').click();
  await expect(page.locator('.quick-timer')).toBeVisible();
  const afterResume = secondsFromClock(await page.locator('.quick-timer').textContent());
  expect(afterResume).toBeLessThan(fullSeconds);
  expect(afterResume).toBeLessThanOrEqual(beforeReload + 1);
  expect(afterResume).toBeGreaterThan(0);
  expect(await page.evaluate(timerKey => localStorage.getItem(timerKey), TIMER_KEY)).toBeNull();
});

test('timer snapshot from another session is discarded and cannot shorten a new timer', async ({ page }) => {
  await seedHub(page);
  await page.goto('/quick-play.html?game=rapid-fire');
  await page.locator('#quick-rounds').selectOption('3');
  await page.locator('#quick-start').click();

  const startTimer = page.getByRole('button', { name: /Sekunden starten/ });
  const label = await startTimer.textContent();
  const durationMatch = String(label).match(/(\d+)\s+Sekunden/);
  expect(durationMatch).not.toBeNull();
  const fullSeconds = Number(durationMatch[1]);
  const active = await page.evaluate(activeKey => JSON.parse(localStorage.getItem(activeKey)), ACTIVE_KEY);

  await page.evaluate(({ timerKey, active, fullSeconds }) => {
    localStorage.setItem(timerKey, JSON.stringify({
      version: 1,
      snapshots: {
        quick: {
          gameId: active.gameId,
          sessionId: `${active.sessionId}-stale`,
          round: active.round,
          phase: 'running',
          durationMs: fullSeconds * 1000,
          remainingMs: 1000
        }
      }
    }));
  }, { timerKey: TIMER_KEY, active, fullSeconds });

  await page.reload();
  await page.locator('#quick-resume').click();
  const resumedStartTimer = page.getByRole('button', { name: /Sekunden starten/ });
  await resumedStartTimer.click();
  await expect(page.locator('.quick-timer')).toHaveText(`0:${String(fullSeconds).padStart(2, '0')}`);
  expect(await page.evaluate(timerKey => localStorage.getItem(timerKey), TIMER_KEY)).toBeNull();
});