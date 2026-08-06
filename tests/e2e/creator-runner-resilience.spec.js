const { test, expect } = require('@playwright/test');

const GAME_ID = 'custom-game-runner-stats';

async function seedCreatorGame(page) {
  await page.goto('/party.html');
  await page.evaluate(({ gameId }) => {
    localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika', 'Lina'],
      favorites: [],
      recent: [],
      presets: [],
      history: [],
      stats: {}
    }));
    localStorage.setItem('secret-circle-party-created-games-v1', JSON.stringify({
      version: 1,
      games: [{
        id: gameId,
        title: 'Wiederholbares Duell',
        description: 'Die Gruppe entscheidet mehrere eigene Runden und speichert den Verlauf korrekt.',
        templateId: 'choice',
        icon: '🎯',
        accent: 'cyan',
        group: 'Eigene Tests',
        minPlayers: 2,
        maxPlayers: 10,
        duration: 10,
        age: 'all',
        packs: [{
          name: 'Standard',
          items: [['Meer', 'Berge'], ['Tag', 'Nacht'], ['Roboter', 'Drache'], ['Planen', 'Spontan']]
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]
    }));
    localStorage.removeItem('secret-circle-party-created-active-v1');
  }, { gameId: GAME_ID });
}

async function completeThreeChoiceRounds(page) {
  for (let round = 0; round < 3; round += 1) {
    await expect(page.locator('.choice-card')).toHaveCount(2);
    await page.locator('.choice-card').first().click();
    await expect(page.locator('.choice-result')).toContainText('Gewählt:');
    await page.getByRole('button', { name: 'Nächste Entscheidung' }).click();
  }
  await expect(page.locator('#quick-result')).toBeVisible();
}

test('Creator runner increments plays and history exactly once per completed session', async ({ page }) => {
  await seedCreatorGame(page);
  await page.goto(`/quick-play.html?game=${GAME_ID}`);
  await page.locator('#quick-rounds').selectOption('3');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await completeThreeChoiceRounds(page);

  let state = await page.evaluate(gameId => {
    const hub = JSON.parse(localStorage.getItem('secret-circle-party-hub-v1'));
    return { stats: hub.stats[gameId], history: hub.history.filter(entry => entry.gameId === gameId) };
  }, GAME_ID);
  expect(state.stats).toEqual({ plays: 1, rounds: 3, best: 0 });
  expect(state.history).toHaveLength(1);
  expect(await page.evaluate(() => localStorage.getItem('secret-circle-party-created-active-v1'))).toBeNull();

  await page.reload();
  state = await page.evaluate(gameId => {
    const hub = JSON.parse(localStorage.getItem('secret-circle-party-hub-v1'));
    return { stats: hub.stats[gameId], history: hub.history.filter(entry => entry.gameId === gameId) };
  }, GAME_ID);
  expect(state.stats.plays).toBe(1);
  expect(state.history).toHaveLength(1);

  await page.locator('#quick-rounds').selectOption('3');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await completeThreeChoiceRounds(page);

  state = await page.evaluate(gameId => {
    const hub = JSON.parse(localStorage.getItem('secret-circle-party-hub-v1'));
    return { stats: hub.stats[gameId], history: hub.history.filter(entry => entry.gameId === gameId) };
  }, GAME_ID);
  expect(state.stats).toEqual({ plays: 2, rounds: 6, best: 0 });
  expect(state.history).toHaveLength(2);
});

test('Creator runner sanitizes a resumable session before rendering it', async ({ page }) => {
  await seedCreatorGame(page);
  await page.evaluate(gameId => {
    localStorage.setItem('secret-circle-party-created-active-v1', JSON.stringify({
      version: 1,
      gameId,
      pack: 'Standard',
      targetRounds: 3,
      round: 2,
      score: 999999,
      scores: { Alex: 4, Fremd: 9000, Gruppe: -2 },
      playerIndex: 999,
      used: [-1, 0, 0, 999],
      current: ['Tag', 'Nacht'],
      phase: 'ready',
      choice: null,
      players: ['Alex', 'Sam', 'Mika', 'Lina'],
      startedAt: new Date().toISOString(),
      completedRecorded: false
    }));
  }, GAME_ID);

  await page.goto(`/quick-play.html?game=${GAME_ID}`);
  await expect(page.locator('#quick-resume-box')).toBeVisible();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#quick-progress')).toContainText('Runde 2 von 3');
  await expect(page.locator('#quick-score')).toHaveText('10000 Punkte');
  await expect(page.locator('.choice-card')).toHaveCount(2);

  const active = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-created-active-v1')));
  expect(active.playerIndex).toBe(3);
  expect(active.used).toEqual([0]);
  expect(active.scores).toEqual({ Alex: 4, Gruppe: 0 });
});
