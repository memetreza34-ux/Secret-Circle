const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';
const TIMER_KEY = 'secret-circle-party-quick-timers-v1';
const QUICK_KEY = 'secret-circle-party-quick-active-v1';
const MEGA_KEY = 'secret-circle-party-mega-active-v1';

async function seedHub(page) {
  await page.goto('/party.html');
  await page.evaluate(({ hubKey, timerKey, quickKey, megaKey }) => {
    localStorage.setItem(hubKey, JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika', 'Lina'],
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
    localStorage.removeItem(timerKey);
    localStorage.removeItem(quickKey);
    localStorage.removeItem(megaKey);
  }, { hubKey: HUB_KEY, timerKey: TIMER_KEY, quickKey: QUICK_KEY, megaKey: MEGA_KEY });
}

async function startGame(page, gameId) {
  await page.goto(`/quick-play.html?game=${encodeURIComponent(gameId)}`);
  await page.locator('#quick-rounds').selectOption('3');
  await page.locator('#quick-start').click();
  await expect(page.locator('#quick-play')).toBeVisible();
}

test('privacy-sensitive Quick snapshot with impossible reveal phase is quarantined before engine resume', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'draw-guess');

  const seeded = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(seeded.current?.prompt).toBeTruthy();

  /* Die Engine sichert die laufende Session beim Verlassen der Seite. Der
     manipulierte Stand muss deshalb erst im neuen Dokument gesetzt werden,
     sonst überschreibt das pagehide-Speichern ihn wieder. */
  await page.addInitScript(({ quickKey, timerKey, active }) => {
    localStorage.setItem(quickKey, JSON.stringify({ ...active, phase: 'result' }));
    localStorage.setItem(timerKey, JSON.stringify({
      version: 1,
      snapshots: {
        quick: {
          gameId: active.gameId,
          sessionId: active.sessionId,
          round: active.round,
          phase: 'result',
          durationMs: 60000,
          remainingMs: 30000
        },
        mega: {
          gameId: 'who-am-i',
          sessionId: 'other-family-session',
          round: 1,
          phase: 'guess',
          durationMs: 60000,
          remainingMs: 45000
        }
      }
    }));
  }, { quickKey: QUICK_KEY, timerKey: TIMER_KEY, active: seeded });

  await page.reload();

  expect(await page.evaluate(key => localStorage.getItem(key), QUICK_KEY)).toBeNull();
  const timers = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), TIMER_KEY);
  expect(timers.snapshots.quick).toBeUndefined();
  expect(timers.snapshots.mega.sessionId).toBe('other-family-session');
  await expect(page.locator('#quick-resume-box')).toBeHidden();
  await expect(page.locator('#quick-play')).toBeHidden();
  await expect(page.locator('#quick-setup')).toBeVisible();
});

test('Mega identity snapshot cannot use an unknown phase to fall through into identity reveal', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'who-am-i');

  const before = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), MEGA_KEY);
  expect(before.current?.identity).toBeTruthy();

  await page.addInitScript(({ key, active }) => {
    localStorage.setItem(key, JSON.stringify({ ...active, phase: 'unexpected-reveal' }));
  }, { key: MEGA_KEY, active: before });

  await page.reload();

  expect(await page.evaluate(key => localStorage.getItem(key), MEGA_KEY)).toBeNull();
  await expect(page.locator('#quick-resume-box')).toBeHidden();
  await expect(page.locator('#quick-play')).toBeHidden();
  await expect(page.locator('#quick-setup')).toBeVisible();
});

test('cross-game family snapshot remains untouched by current-game resume quarantine', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'rapid-fire');
  const before = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);

  await page.goto('/quick-play.html?game=draw-guess');

  const after = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(after.gameId).toBe('rapid-fire');
  expect(after.sessionId).toBe(before.sessionId);
  await expect(page.locator('#quick-resume-box')).toBeHidden();
});
