const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';
const ACTIVE_KEY = 'secret-circle-party-hub-active-v1';

async function seedHub(page) {
  await page.goto('/party.html');
  await page.evaluate(({ hubKey, activeKey }) => {
    localStorage.setItem(hubKey, JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika', 'Lina', 'Noah', 'Lea'],
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
    localStorage.removeItem(activeKey);
  }, { hubKey: HUB_KEY, activeKey: ACTIVE_KEY });
  await page.reload();
}

async function startGame(page, gameId) {
  await page.locator('#browse-games').click();
  await page.locator(`[data-open-game="${gameId}"]`).first().click();
  await expect(page.locator('#game-detail')).toBeVisible();
  await page.locator('#start-selected-game').click();
  await expect(page.locator('#play-layer')).toBeVisible();
}

async function activeState(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
}

function clockSeconds(text) {
  const match = String(text).match(/(\d+):(\d{2})/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : -1;
}

test('Paranoia reload requires explicit resume and never auto-opens the secret question', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'paranoia');
  await page.getByRole('button', { name: 'Geheime Frage anzeigen' }).click();
  const before = await activeState(page);
  expect(before.session.used.length).toBeGreaterThan(0);

  await page.reload();
  await expect(page.locator('#play-layer')).toBeHidden();
  await expect(page.locator('#hub-resume-session')).toBeVisible();
  await expect(page.locator('#hub-resume-session')).toContainText('Geheime Inhalte werden nach einem Reload nicht automatisch geöffnet');

  await page.getByRole('button', { name: 'Session fortsetzen' }).click();
  await expect(page.locator('#play-content')).toContainText('Gerät so halten');
  await expect(page.getByRole('button', { name: 'Geheime Frage anzeigen' })).toBeVisible();
});

test('Charades restores the remaining time paused and continues from that value', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'charades');
  await page.getByRole('button', { name: 'Runde starten' }).click();
  await page.waitForTimeout(1200);
  await page.reload();

  const stored = await activeState(page);
  expect(stored.session.timer.kind).toBe('charades');
  expect(stored.session.timer.phase).toBe('running');
  expect(stored.session.timer.remainingMs).toBeGreaterThan(0);
  expect(stored.session.timer.remainingMs).toBeLessThan(60_000);

  await page.getByRole('button', { name: 'Session fortsetzen' }).click();
  const pause = page.locator('#pause-hub-game');
  await expect(pause).toBeEnabled();
  await expect(pause).toHaveText('Fortsetzen');
  const timer = page.locator('#play-actions .timer-display').first();
  const frozen = clockSeconds(await timer.textContent());
  await page.waitForTimeout(900);
  expect(clockSeconds(await timer.textContent())).toBe(frozen);

  await pause.click();
  await expect(pause).toHaveText('Pause');
  await page.waitForTimeout(1200);
  expect(clockSeconds(await timer.textContent())).toBeLessThan(frozen);
});

test('Hot Potato restores a hidden random remainder without exposing a countdown', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'hot-potato');
  await page.getByRole('button', { name: 'Zufallstimer starten' }).click();
  await page.waitForTimeout(800);
  await page.reload();

  const stored = await activeState(page);
  expect(stored.session.timer.kind).toBe('hot-potato');
  expect(stored.session.timer.remainingMs).toBeGreaterThan(0);
  expect(stored.session.timer.remainingMs).toBeLessThanOrEqual(25_000);

  await page.getByRole('button', { name: 'Session fortsetzen' }).click();
  await expect(page.locator('#pause-hub-game')).toHaveText('Fortsetzen');
  await expect(page.locator('#play-actions .timer-display').first()).toHaveText('●');
  await expect(page.locator('#play-actions span[hidden]')).toBeHidden();
});

test('Word Chain restores its letter and paused remaining time', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'word-chain');
  const startText = await page.locator('#play-content').textContent();
  const letter = startText.match(/Startbuchstabe:\s*(\S+)/)?.[1];
  expect(letter).toBeTruthy();
  await page.getByRole('button', { name: '30-Sekunden-Runde starten' }).click();
  await page.waitForTimeout(800);
  await page.reload();

  const stored = await activeState(page);
  expect(stored.session.timer.kind).toBe('word-chain');
  expect(stored.session.timer.letter).toBe(letter);
  expect(stored.session.timer.remainingMs).toBeGreaterThan(0);
  expect(stored.session.timer.remainingMs).toBeLessThan(30_000);

  await page.getByRole('button', { name: 'Session fortsetzen' }).click();
  await expect(page.locator('#play-content')).toContainText(`Start mit ${letter}`);
  await expect(page.locator('#pause-hub-game')).toHaveText('Fortsetzen');
});

test('discarding a restored Hub session never creates history or stats', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'truth-dare');
  await page.getByRole('button', { name: 'Wahrheit' }).click();
  await page.reload();
  await expect(page.locator('#hub-resume-session')).toBeVisible();

  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Gespeicherten Stand verwerfen' }).click();

  const result = await page.evaluate(({ hubKey, activeKey }) => ({
    active: localStorage.getItem(activeKey),
    hub: JSON.parse(localStorage.getItem(hubKey))
  }), { hubKey: HUB_KEY, activeKey: ACTIVE_KEY });
  expect(result.active).toBeNull();
  expect(result.hub.history).toHaveLength(0);
  expect(result.hub.stats['truth-dare']).toBeUndefined();
});
