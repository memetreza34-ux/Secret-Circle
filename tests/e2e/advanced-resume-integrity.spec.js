const { test, expect } = require('@playwright/test');

const ACTIVE_KEY = 'secret-circle-party-active-v1';
const HUB_KEY = 'secret-circle-party-hub-v1';
const PLAYERS = ['Alex', 'Sam', 'Mika', 'Lina', 'Noah', 'Lea', 'Emil', 'Sara'];

async function seedHub(page) {
  await page.goto('/party.html');
  await page.evaluate(({ hubKey, players }) => {
    localStorage.setItem(hubKey, JSON.stringify({
      version: 1,
      players,
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
  }, { hubKey: HUB_KEY, players: PLAYERS });
}

async function seedForgedSession(page, gameId, advanced, pack) {
  await page.goto(`/advanced.html?game=${gameId}`);
  await page.evaluate(({ activeKey, gameId, players, advanced, pack }) => {
    localStorage.setItem(activeKey, JSON.stringify({
      version: 2,
      gameId,
      session: {
        id: `forged-${gameId}`,
        gameId,
        players,
        pack,
        targetRounds: 3,
        rounds: 0,
        score: 0,
        playerIndex: 0,
        used: [],
        startedAt: '2026-08-23T12:00:00.000Z',
        advanced
      }
    }));
  }, { activeKey: ACTIVE_KEY, gameId, players: PLAYERS, advanced, pack });
  await page.reload();
}

test('forged Two Truths outcome is discarded before resume UI can use it', async ({ page }) => {
  await seedHub(page);
  await seedForgedSession(page, 'two-truths', {
    stage: 'result',
    author: 'Alex',
    statements: ['Ich mag Tee.', 'Ich fahre Fahrrad.', 'Ich war auf dem Mond.'],
    lieIndex: 2,
    voteIndex: 2,
    correct: false
  }, 'Persönlich');

  await expect(page.locator('#advanced-status')).toContainText('inkonsistenter gespeicherter Rundenzustand');
  expect(await page.evaluate(key => localStorage.getItem(key), ACTIVE_KEY)).toBeNull();
  await expect(page.locator('#advanced-start')).not.toContainText('fortsetzen');
});

test('forged Mafia winner is discarded before moderator state is restored', async ({ page }) => {
  await seedHub(page);
  const roles = {
    Alex: 'Mafia', Sam: 'Mafia', Mika: 'Detektiv', Lina: 'Arzt',
    Noah: 'Dorfbewohner', Lea: 'Dorfbewohner', Emil: 'Dorfbewohner', Sara: 'Dorfbewohner'
  };
  await seedForgedSession(page, 'mafia', {
    stage: 'finished',
    revealIndex: 7,
    revealed: false,
    day: 2,
    roles,
    alive: ['Mika', 'Lina', 'Noah', 'Lea', 'Emil', 'Sara'],
    nightTarget: null,
    saved: null,
    protected: null,
    lastProtected: null,
    inspected: null,
    nightResult: '',
    winner: 'Mafia'
  }, 'Klassisch');

  await expect(page.locator('#advanced-status')).toContainText('inkonsistenter gespeicherter Rundenzustand');
  expect(await page.evaluate(key => localStorage.getItem(key), ACTIVE_KEY)).toBeNull();
  await expect(page.locator('#advanced-play-layer')).toBeHidden();
});
