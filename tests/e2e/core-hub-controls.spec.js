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

async function openCatalog(page) {
  await page.locator('[data-view-target="games"]').first().click();
  await expect(page.locator('#view-games')).toBeVisible();
}

async function startGame(page, gameId) {
  const opener = page.locator(`[data-open-game="${gameId}"]`).first();
  if (await opener.count() === 0) await openCatalog(page);
  await page.locator(`[data-open-game="${gameId}"]`).first().click();
  await page.locator('#start-selected-game').click();
  await expect(page.locator('#play-layer')).toBeVisible();
}

test('personal hub games make voluntary skipping explicit during play', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'truth-dare');

  await expect(page.locator('#hub-voluntary-play-note')).toContainText('Alles freiwillig');
  await expect(page.locator('#hub-voluntary-play-note')).toContainText('ohne Begründung');
  await expect(page.locator('#skip-hub-round')).toHaveText('Überspringen · nächste Person');
  await expect(page.locator('#skip-hub-round')).toHaveAttribute('aria-label', /ohne Punkt/i);

  await page.getByRole('button', { name: 'Wahrheit' }).click();
  await expect(page.locator('#hub-voluntary-play-note')).toBeVisible();
});

test('simple social core games keep the round mechanic visible while playing', async ({ page }) => {
  const expectations = [
    ['never-have', /reagieren gleichzeitig/i, true],
    ['most-likely', /zeigen alle gleichzeitig/i, true],
    ['would-rather', /gleichzeitig A oder B/i, false]
  ];

  for (const [gameId, guide, voluntary] of expectations) {
    await seedHub(page);
    await openCatalog(page);
    await startGame(page, gameId);
    await expect(page.locator('#hub-round-guide')).toContainText(guide);
    if (voluntary) {
      await expect(page.locator('#hub-voluntary-play-note')).toBeVisible();
      await expect(page.locator('#skip-hub-round')).toHaveText('Überspringen · nächste Person');
    } else {
      await expect(page.locator('#hub-voluntary-play-note')).toHaveCount(0);
    }
  }
});

test('Wrong Answers stays scoreless and explains its manual losing condition', async ({ page }) => {
  await seedHub(page);
  await openCatalog(page);
  await startGame(page, 'wrong-answers');

  await expect(page.locator('#hub-round-guide')).toContainText(/absichtlich falsch antworten/i);
  await expect(page.locator('#hub-round-guide')).toContainText(/keine Punkte/i);
  const complete = page.getByRole('button', { name: 'Manuell beendete Runde abschließen und nächste Karte öffnen' });
  await expect(complete).toBeVisible();

  const before = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
  expect(before.session.rounds).toBe(0);
  expect(before.session.score).toBe(0);

  await complete.click();
  const after = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
  expect(after.session.rounds).toBe(1);
  expect(after.session.score).toBe(0);
  await expect(page.locator('#play-score')).toHaveText('');
});

test('Paranoia conceals an open secret question when the app loses focus', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'paranoia');

  await page.getByRole('button', { name: 'Geheime Frage anzeigen' }).click();
  await expect(page.locator('#play-actions')).toContainText('Name wurde genannt');
  const secretBefore = await page.locator('#play-content').textContent();
  expect(secretBefore?.trim().length).toBeGreaterThan(0);

  await page.evaluate(() => window.dispatchEvent(new Event('blur')));

  await expect(page.locator('#play-content')).toBeHidden();
  await expect(page.locator('#play-actions')).toBeHidden();
  await expect(page.locator('#hub-private-prompt-cover')).toBeVisible();
  await expect(page.locator('#hub-private-prompt-cover')).toContainText('automatisch verdeckt');

  await page.getByRole('button', { name: 'Geheime Frage wieder anzeigen' }).click();
  await expect(page.locator('#hub-private-prompt-cover')).toHaveCount(0);
  await expect(page.locator('#play-content')).toBeVisible();
  await expect(page.locator('#play-content')).toHaveText(secretBefore || '');
  await expect(page.locator('#play-actions')).toContainText('Name wurde genannt');
});

test('global skip advances a round without awarding a point and finish records it once', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'truth-dare');

  await page.locator('#skip-hub-round').click();
  await expect(page.locator('#play-progress')).toContainText('1 Runden');
  await expect(page.locator('#hub-status')).toContainText('kein Punkt');

  const active = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
  expect(active.session.rounds).toBe(1);
  expect(active.session.score).toBe(0);

  await page.locator('#finish-hub-game').click();
  const hub = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), HUB_KEY);
  expect(hub.history).toHaveLength(1);
  expect(hub.history[0].rounds).toBe(1);
  expect(hub.history[0].score).toBe(0);
});

test('abort discards active progress and never writes history or stats', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'word-chain');
  await page.getByRole('button', { name: '30-Sekunden-Runde starten' }).click();
  await expect(page.locator('.timer-display')).toBeVisible();

  page.once('dialog', dialog => dialog.accept());
  await page.locator('#abort-hub-game').click();
  await expect(page.locator('#play-layer')).toBeHidden();

  const result = await page.evaluate(({ hubKey, activeKey }) => ({
    active: localStorage.getItem(activeKey),
    hub: JSON.parse(localStorage.getItem(hubKey))
  }), { hubKey: HUB_KEY, activeKey: ACTIVE_KEY });
  expect(result.active).toBeNull();
  expect(result.hub.history).toHaveLength(0);
  expect(result.hub.stats['word-chain']).toBeUndefined();
});

test('Escape uses the same confirmed discard path instead of silently saving', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'truth-dare');
  await page.getByRole('button', { name: 'Wahrheit' }).click();

  page.once('dialog', dialog => dialog.accept());
  await page.keyboard.press('Escape');
  await expect(page.locator('#play-layer')).toBeHidden();

  const result = await page.evaluate(({ hubKey, activeKey }) => ({
    active: localStorage.getItem(activeKey),
    hub: JSON.parse(localStorage.getItem(hubKey))
  }), { hubKey: HUB_KEY, activeKey: ACTIVE_KEY });
  expect(result.active).toBeNull();
  expect(result.hub.history).toHaveLength(0);
  expect(result.hub.stats['truth-dare']).toBeUndefined();
});