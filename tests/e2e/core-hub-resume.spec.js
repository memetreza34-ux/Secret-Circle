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

test('Truth or Dare restores the exact safe current card after reload', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'truth-dare');
  await page.getByRole('button', { name: 'Wahrheit' }).click();

  const card = (await page.locator('#play-content').textContent())?.trim();
  expect(card).toBeTruthy();
  const before = await activeState(page);
  expect(before.session.current).toMatchObject({ kind: 'truth-dare', pool: 'truth' });
  expect(before.session.usedByPool.truth).toHaveLength(1);
  expect(before.session.usedByPool.dare).toHaveLength(0);
  expect(before.session.used).toHaveLength(0);

  await page.reload();
  await expect(page.locator('#hub-resume-session')).toBeVisible();
  await page.getByRole('button', { name: 'Session fortsetzen' }).click();

  await expect(page.locator('#play-content')).toHaveText(card || '');
  await expect(page.getByRole('button', { name: 'Erledigt · nächste Person' })).toBeVisible();
  const after = await activeState(page);
  expect(after.session.current).toEqual(before.session.current);
  expect(after.session.usedByPool).toEqual(before.session.usedByPool);
});

test('Truth and Dare keep independent used-card index spaces', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'truth-dare');

  await page.getByRole('button', { name: 'Wahrheit' }).click();
  const truth = await activeState(page);
  expect(truth.session.usedByPool.truth).toHaveLength(1);
  expect(truth.session.usedByPool.dare).toHaveLength(0);
  expect(truth.session.used).toHaveLength(0);

  await page.getByRole('button', { name: 'Erledigt · nächste Person' }).click();
  await page.getByRole('button', { name: 'Pflicht' }).click();
  const dare = await activeState(page);
  expect(dare.session.usedByPool.truth).toEqual(truth.session.usedByPool.truth);
  expect(dare.session.usedByPool.dare).toHaveLength(1);
  expect(dare.session.used).toHaveLength(0);
});

test('a normal prompt card also resumes without silently consuming a replacement', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'never-have');
  const card = (await page.locator('#play-content').textContent())?.trim();
  expect(card).toBeTruthy();
  const before = await activeState(page);
  expect(before.session.current).toMatchObject({ kind: 'prompt' });
  expect(before.session.used).toHaveLength(1);

  await page.reload();
  await page.getByRole('button', { name: 'Session fortsetzen' }).click();
  await expect(page.locator('#play-content')).toHaveText(card || '');
  const after = await activeState(page);
  expect(after.session.current).toEqual(before.session.current);
  expect(after.session.used).toEqual(before.session.used);
});

test('Paranoia reload requires explicit resume and never auto-opens the secret question', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'paranoia');
  await page.getByRole('button', { name: 'Geheime Frage anzeigen' }).click();
  const before = await activeState(page);
  expect(before.session.used.length).toBeGreaterThan(0);
  expect(before.session.current).toBeNull();

  await page.reload();
  await expect(page.locator('#play-layer')).toBeHidden();
  await expect(page.locator('#hub-resume-session')).toBeVisible();
  await expect(page.locator('#hub-resume-session')).toContainText('Geheime Inhalte werden nach einem Reload nicht automatisch geöffnet');

  await page.getByRole('button', { name: 'Session fortsetzen' }).click();
  await expect(page.locator('#play-content')).toContainText('Gerät so halten');
  await expect(page.getByRole('button', { name: 'Geheime Frage anzeigen' })).toBeVisible();
});

test('cross-mode timer corruption is discarded instead of resuming the wrong game runner', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'truth-dare');
  await page.getByRole('button', { name: 'Wahrheit' }).click();

  await page.evaluate(key => {
    const active = JSON.parse(localStorage.getItem(key));
    active.session.running = true;
    active.session.timer = {
      kind: 'charades', phase: 'running', remainingMs: 45_000,
      roundScore: 0, item: 'Fremde Timerkarte', prompt: '', letter: '', word: '', banned: []
    };
    localStorage.setItem(key, JSON.stringify(active));
  }, ACTIVE_KEY);

  await page.reload();
  await expect(page.locator('#play-layer')).toBeHidden();
  await expect(page.locator('#hub-resume-session')).toHaveCount(0);
  await expect(page.locator('#hub-status')).toContainText('inkonsistenter Timer-Spielstand');
  expect(await page.evaluate(key => localStorage.getItem(key), ACTIVE_KEY)).toBeNull();
});

test('v50 keeps resume actions disabled until the delayed guard finishes validation', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'truth-dare');
  await page.getByRole('button', { name: 'Wahrheit' }).click();

  let releaseGuard;
  await page.route('**/party-hub-resume-guard.js', async route => {
    await new Promise(resolve => { releaseGuard = resolve; });
    await route.continue();
  });

  await page.reload({ waitUntil: 'commit' });
  const resume = page.locator('#hub-resume-session');
  const resumeButton = page.getByRole('button', { name: 'Session fortsetzen' });
  const discardButton = page.getByRole('button', { name: 'Gespeicherten Stand verwerfen' });

  await expect(resume).toBeVisible();
  await expect(resume).toHaveAttribute('aria-busy', 'true');
  await expect(resumeButton).toBeDisabled();
  await expect(discardButton).toBeDisabled();
  expect(typeof releaseGuard).toBe('function');

  releaseGuard();

  await expect(resume).not.toHaveAttribute('aria-busy', 'true');
  await expect(resumeButton).toBeEnabled();
  await expect(discardButton).toBeEnabled();
  expect(await page.evaluate(key => localStorage.getItem(key), ACTIVE_KEY)).not.toBeNull();
});

test('v50 fails closed when the Hub resume guard cannot load', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'truth-dare');
  await page.getByRole('button', { name: 'Wahrheit' }).click();

  await page.route('**/party-hub-resume-guard.js', route => route.abort('failed'));
  await page.reload();

  await expect(page.locator('#play-layer')).toBeHidden();
  await expect(page.locator('#hub-resume-session')).toHaveCount(0);
  await expect(page.locator('#hub-status')).toContainText('Resume-Schutz konnte nicht geladen werden');
  expect(await page.evaluate(key => localStorage.getItem(key), ACTIVE_KEY)).not.toBeNull();
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
