const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';
const ACTIVE_KEY = 'secret-circle-party-active-v1';
const PLAYERS = ['Alex', 'Sam', 'Mika', 'Lina', 'Noah', 'Lea', 'Emil', 'Sara'];
const CASES = [
  { gameId: 'two-truths', pack: 'Locker' },
  { gameId: 'question-imposter', pack: 'Alltag' },
  { gameId: 'location-spy', pack: 'Reise' },
  { gameId: 'mafia', pack: 'Klassisch' }
];

async function ensureHub(page) {
  await page.goto('/party.html');
  await page.evaluate(({ hubKey, players }) => {
    if (!localStorage.getItem(hubKey)) {
      localStorage.setItem(hubKey, JSON.stringify({
        version: 1, players,
        favorites: [], recent: [], presets: [], history: [], stats: {}
      }));
    }
  }, { hubKey: HUB_KEY, players: PLAYERS });
}

async function seedCompleted(page, { gameId, pack, sessionId }) {
  await ensureHub(page);
  await page.evaluate(({ activeKey, players, gameId, pack, sessionId }) => {
    localStorage.setItem(activeKey, JSON.stringify({
      version: 2,
      gameId,
      session: {
        id: sessionId, gameId, players, pack,
        targetRounds: 3, rounds: 3, score: 5, playerIndex: 3,
        used: [], advanced: null,
        startedAt: '2026-08-07T12:00:00.000Z'
      }
    }));
  }, { activeKey: ACTIVE_KEY, players: PLAYERS, gameId, pack, sessionId });
}

async function seedFinishedMafiaRound(page, sessionId) {
  await ensureHub(page);
  await page.evaluate(({ activeKey, players, sessionId }) => {
    const roles = {
      Alex: 'Mafia', Sam: 'Mafia', Mika: 'Detektiv', Lina: 'Arzt',
      Noah: 'Dorfbewohner', Lea: 'Dorfbewohner', Emil: 'Dorfbewohner', Sara: 'Dorfbewohner'
    };
    localStorage.setItem(activeKey, JSON.stringify({
      version: 2,
      gameId: 'mafia',
      session: {
        id: sessionId,
        gameId: 'mafia',
        players,
        pack: 'Klassisch',
        targetRounds: 3,
        rounds: 0,
        score: 3,
        playerIndex: 0,
        used: [],
        startedAt: '2026-08-07T12:00:00.000Z',
        advanced: {
          stage: 'finished', revealIndex: players.length - 1, revealed: false, day: 2,
          roles,
          alive: ['Mika', 'Lina', 'Noah', 'Lea', 'Emil', 'Sara'],
          nightTarget: null, saved: null, protected: null, lastProtected: null,
          inspected: null, nightResult: '', winner: 'Dorf'
        }
      }
    }));
  }, { activeKey: ACTIVE_KEY, players: PLAYERS, sessionId });
}

async function finishStoredSession(page, gameId) {
  await page.goto(`/advanced.html?game=${gameId}`);
  await expect(page.locator('#advanced-start')).toHaveText('Abgeschlossene Session ansehen');
  await page.locator('#advanced-start').click();
  await expect(page.locator('#play-eyebrow')).toHaveText('Session abgeschlossen');
  const navigation = page.waitForURL(/party\.html\?view=stats$/);
  await page.getByRole('button', { name: 'Session speichern und beenden' }).click();
  await navigation;
}

async function finishPendingMafiaRound(page) {
  await page.goto('/advanced.html?game=mafia');
  await expect(page.locator('#advanced-start')).toContainText('Session fortsetzen');
  await page.locator('#advanced-start').click();
  await expect(page.locator('#play-eyebrow')).toHaveText('Mafia beendet');
  await expect(page.getByRole('button', { name: 'Session beenden' })).toBeVisible();
  const navigation = page.waitForURL(/party\.html\?view=stats$/);
  await page.getByRole('button', { name: 'Session beenden' }).click();
  await navigation;
}

for (const entry of CASES) {
  test(`${entry.gameId} completion is recorded exactly once for the same Advanced session id`, async ({ page }) => {
    const sessionId = `exact-once-${entry.gameId}`;
    await seedCompleted(page, { ...entry, sessionId });
    await finishStoredSession(page, entry.gameId);

    let hub = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), HUB_KEY);
    expect(hub.history.filter(item => item.gameId === entry.gameId)).toHaveLength(1);
    expect(hub.history.find(item => item.gameId === entry.gameId).id).toBe(`advanced-${sessionId}`);
    expect(hub.stats[entry.gameId]).toEqual({ plays: 1, rounds: 3, best: 5 });
    expect(await page.evaluate(key => localStorage.getItem(key), ACTIVE_KEY)).toBeNull();

    await seedCompleted(page, { ...entry, sessionId });
    await finishStoredSession(page, entry.gameId);

    hub = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), HUB_KEY);
    expect(hub.history.filter(item => item.gameId === entry.gameId)).toHaveLength(1);
    expect(hub.stats[entry.gameId]).toEqual({ plays: 1, rounds: 3, best: 5 });
    expect(await page.evaluate(key => localStorage.getItem(key), ACTIVE_KEY)).toBeNull();
  });
}

test('a finished Mafia round saved directly is counted once and remains idempotent on retry', async ({ page }) => {
  const sessionId = 'exact-once-mafia-pending-finished-round';
  await seedFinishedMafiaRound(page, sessionId);
  await finishPendingMafiaRound(page);

  let hub = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), HUB_KEY);
  expect(hub.history.filter(item => item.gameId === 'mafia')).toHaveLength(1);
  expect(hub.history.find(item => item.gameId === 'mafia')).toMatchObject({
    id: `advanced-${sessionId}`,
    rounds: 1,
    score: 3
  });
  expect(hub.stats.mafia).toEqual({ plays: 1, rounds: 1, best: 3 });
  expect(await page.evaluate(key => localStorage.getItem(key), ACTIVE_KEY)).toBeNull();

  await seedFinishedMafiaRound(page, sessionId);
  await finishPendingMafiaRound(page);

  hub = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), HUB_KEY);
  expect(hub.history.filter(item => item.gameId === 'mafia')).toHaveLength(1);
  expect(hub.stats.mafia).toEqual({ plays: 1, rounds: 1, best: 3 });
  expect(await page.evaluate(key => localStorage.getItem(key), ACTIVE_KEY)).toBeNull();
});
