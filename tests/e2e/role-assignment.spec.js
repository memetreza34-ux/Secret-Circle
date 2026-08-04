const { test, expect } = require('@playwright/test');

test('browser role assignment is deterministic and independent from reveal order', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(() => {
    const E = window.SecretCircleEngine;
    const Roles = window.SecretCircleRoleAssignment;
    const entries = window.SecretCircleContent.words.alltag;
    const players = ['Alex', 'Sam', 'Mika', 'Lina', 'Noah', 'Kim'];
    const firstRevealStates = new Set();
    let prefixMatches = 0;

    for (let index = 0; index < 120; index += 1) {
      const options = {
        players,
        entries,
        category: 'Alltag',
        imposterCount: 2,
        roundSeconds: 60,
        matchRounds: 1,
        seed: `browser-role-${index}`
      };
      const game = E.createGame(options);
      const repeated = E.createGame(options);
      firstRevealStates.add(game.imposters.includes(game.revealOrder[0]));
      const prefix = new Set(game.revealOrder.slice(0, game.imposters.length));
      if (game.imposters.every(name => prefix.has(name))) prefixMatches += 1;
      if (JSON.stringify(game.imposters) !== JSON.stringify(repeated.imposters)) {
        throw new Error('Role assignment is not deterministic.');
      }
    }

    let createLimitMessage = '';
    try {
      E.createGame({
        players: Array.from({ length: 8 }, (_, index) => `P${index + 1}`),
        entries,
        imposterCount: 7,
        roundSeconds: 60,
        matchRounds: 1,
        seed: 'invalid-seven-imposters'
      });
    } catch (error) {
      createLimitMessage = error.message;
    }

    const validSix = E.createGame({
      players: Array.from({ length: 8 }, (_, index) => `R${index + 1}`),
      entries,
      imposterCount: 6,
      roundSeconds: 60,
      matchRounds: 1,
      seed: 'browser-restore-six'
    });
    const forgedSeven = JSON.parse(JSON.stringify(validSix));
    forgedSeven.imposters = forgedSeven.players.slice(0, 7);
    let restoreLimitMessage = '';
    try {
      E.restoreGame(forgedSeven);
    } catch (error) {
      restoreLimitMessage = error.message;
    }

    return {
      apiVersion: Roles?.version,
      maximumImposters: E.MAX_IMPOSTERS,
      firstRevealStates: [...firstRevealStates].sort(),
      prefixMatches,
      sampledGames: 120,
      createLimitMessage,
      restoreLimitMessage
    };
  });

  expect(result.apiVersion).toBe(2);
  expect(result.maximumImposters).toBe(6);
  expect(result.firstRevealStates).toEqual([false, true]);
  expect(result.prefixMatches).toBeGreaterThan(0);
  expect(result.prefixMatches).toBeLessThan(result.sampledGames);
  expect(result.createLimitMessage).toContain('zwischen 1 und 6');
  expect(result.restoreLimitMessage).toContain('zwischen 1 und 6');
});
