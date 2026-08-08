const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';
const ACTIVE_KEY = 'secret-circle-party-hub-active-v1';

async function seedHub(page) {
  await page.goto('/party.html');
  await page.evaluate(({ hubKey, activeKey }) => {
    localStorage.setItem(hubKey, JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika', 'Lina'],
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
    localStorage.removeItem(activeKey);
  }, { hubKey: HUB_KEY, activeKey: ACTIVE_KEY });
  await page.reload();
}

async function startTaboo(page) {
  await page.locator('[data-open-game="taboo"]').first().click();
  await page.locator('#start-selected-game').click();
  await page.getByRole('button', { name: '60-Sekunden-Runde starten' }).click();
  await expect(page.locator('.timer-display')).toBeVisible();
}

test('Taboo uses a pausable 60-second scoring round', async ({ page }) => {
  await seedHub(page);
  await startTaboo(page);

  const initial = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
  expect(initial.session.timer.kind).toBe('taboo');
  expect(initial.session.timer.remainingMs).toBeGreaterThan(0);
  expect(initial.session.timer.remainingMs).toBeLessThanOrEqual(60_000);
  expect(initial.session.timer.word).toBeTruthy();
  expect(Array.isArray(initial.session.timer.banned)).toBe(true);

  await page.getByRole('button', { name: 'Treffer' }).click();
  const afterHit = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
  expect(afterHit.session.score).toBe(1);
  expect(afterHit.session.timer.roundScore).toBe(1);

  await page.getByRole('button', { name: 'Begriff überspringen' }).click();
  const afterSkip = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
  expect(afterSkip.session.score).toBe(1);

  const timer = page.locator('.timer-display');
  await page.locator('#pause-hub-game').click();
  await expect(page.locator('#pause-hub-game')).toHaveText('Fortsetzen');
  const frozen = await timer.textContent();
  await page.waitForTimeout(1200);
  await expect(timer).toHaveText(frozen);
});

test('Taboo reload restores the same private card and remaining time paused', async ({ page }) => {
  await seedHub(page);
  await startTaboo(page);
  await page.waitForTimeout(900);

  const before = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
  const word = before.session.timer.word;
  const banned = before.session.timer.banned;
  const remaining = before.session.timer.remainingMs;
  expect(word).toBeTruthy();

  await page.reload();
  await expect(page.locator('#hub-resume-session')).toBeVisible();
  await page.getByRole('button', { name: 'Session fortsetzen' }).click();

  await expect(page.locator('#pause-hub-game')).toHaveText('Fortsetzen');
  await expect(page.locator('.taboo-word')).toHaveText(word);
  for (const item of banned) await expect(page.locator('.banned-list')).toContainText(item);

  const restored = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
  expect(restored.session.timer.kind).toBe('taboo');
  expect(restored.session.timer.word).toBe(word);
  expect(restored.session.timer.banned).toEqual(banned);
  expect(restored.session.timer.remainingMs).toBeGreaterThan(0);
  expect(Math.abs(restored.session.timer.remainingMs - remaining)).toBeLessThan(2_500);
});