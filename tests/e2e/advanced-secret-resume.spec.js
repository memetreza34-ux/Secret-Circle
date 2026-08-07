const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';
const ACTIVE_KEY = 'secret-circle-party-active-v1';
const PLAYERS = ['Alex', 'Sam', 'Mika', 'Lina', 'Noah', 'Lea', 'Emil', 'Sara'];

async function seedPlayers(page) {
  await page.goto('/party.html');
  await page.evaluate(({ hubKey, activeKey, players }) => {
    localStorage.setItem(hubKey, JSON.stringify({
      version: 1,
      players,
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
    localStorage.removeItem(activeKey);
  }, { hubKey: HUB_KEY, activeKey: ACTIVE_KEY, players: PLAYERS });
}

async function start(page, gameId) {
  await page.goto(`/advanced.html?game=${gameId}`);
  await page.locator('#advanced-length').selectOption('3');
  await page.locator('#advanced-start').click();
  await expect(page.locator('#advanced-play-layer')).toBeVisible();
}

for (const scenario of [
  {
    gameId: 'question-imposter',
    reveal: 'Meine Frage anzeigen',
    hiddenText: 'Gerät abschirmen und die eigene Frage öffnen.'
  },
  {
    gameId: 'location-spy',
    reveal: 'Karte anzeigen',
    hiddenText: 'Gerät abschirmen und Karte öffnen.'
  },
  {
    gameId: 'mafia',
    reveal: 'Meine Rolle anzeigen',
    hiddenText: 'Gerät abschirmen und Rolle öffnen.'
  }
]) {
  test(`${scenario.gameId} hides an opened private reveal again after reload`, async ({ page }) => {
    await seedPlayers(page);
    await start(page, scenario.gameId);

    await expect(page.locator('#play-content')).toHaveText(scenario.hiddenText);
    await page.getByRole('button', { name: scenario.reveal }).click();
    await expect(page.locator('#play-content')).not.toHaveText(scenario.hiddenText);

    const exposed = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
    expect(exposed.session.advanced.stage).toBe('reveal');
    expect(exposed.session.advanced.revealed).toBe(true);

    await page.reload();
    await expect(page.locator('#advanced-play-layer')).toBeHidden();
    await expect(page.locator('#advanced-start')).toContainText('Session fortsetzen');
    await page.locator('#advanced-start').click();

    await expect(page.locator('#advanced-play-layer')).toBeVisible();
    await expect(page.locator('#play-content')).toHaveText(scenario.hiddenText);
    await expect(page.getByRole('button', { name: scenario.reveal })).toBeVisible();

    const protectedState = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
    expect(protectedState.session.advanced.stage).toBe('reveal');
    expect(protectedState.session.advanced.revealed).toBe(false);
  });
}

test('Mafia role overview requires moderator confirmation again after reload', async ({ page }) => {
  await seedPlayers(page);
  await page.goto('/advanced.html?game=mafia');
  await page.evaluate(({ activeKey, players }) => {
    const roles = {
      Alex: 'Mafia', Sam: 'Detektiv', Mika: 'Arzt', Lina: 'Dorfbewohner',
      Noah: 'Dorfbewohner', Lea: 'Dorfbewohner', Emil: 'Dorfbewohner', Sara: 'Dorfbewohner'
    };
    localStorage.setItem(activeKey, JSON.stringify({
      version: 2,
      gameId: 'mafia',
      session: {
        id: 'advanced-secret-resume-mafia',
        gameId: 'mafia',
        players,
        pack: 'Klassisch',
        targetRounds: 3,
        rounds: 0,
        score: 0,
        playerIndex: 0,
        used: [],
        startedAt: '2026-08-07T12:00:00.000Z',
        advanced: {
          stage: 'overview', revealIndex: players.length - 1, revealed: false, day: 1,
          roles, alive: players, nightTarget: null, saved: null, inspected: null, nightResult: ''
        }
      }
    }));
  }, { activeKey: ACTIVE_KEY, players: PLAYERS });
  await page.reload();

  await expect(page.locator('#advanced-start')).toContainText('Session fortsetzen');
  await page.locator('#advanced-start').click();
  await expect(page.locator('#play-eyebrow')).toHaveText('Erzähler-Modus');
  await expect(page.getByRole('button', { name: 'Moderatorübersicht öffnen' })).toBeVisible();
  await expect(page.locator('.role-overview')).toHaveCount(0);

  const protectedState = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
  expect(protectedState.session.advanced.stage).toBe('moderator');
});
