const { test, expect } = require('@playwright/test');

const CORE = [
  'imposter', 'truth-dare', 'never-have', 'most-likely', 'would-rather',
  'paranoia', 'charades', 'taboo', 'hot-potato', 'word-chain',
  'two-truths', 'question-imposter', 'location-spy', 'mafia', 'wrong-answers'
];
const ADVANCED = new Set(['two-truths', 'question-imposter', 'location-spy', 'mafia']);
const HUB_MODES = {
  'truth-dare': 'truth-dare',
  'never-have': 'prompt',
  'most-likely': 'prompt',
  'would-rather': 'choice',
  paranoia: 'paranoia',
  charades: 'charades',
  taboo: 'taboo',
  'hot-potato': 'hot-potato',
  'word-chain': 'word-chain',
  'wrong-answers': 'prompt'
};

test('assembled browser catalog keeps all 15 January core games valid', async ({ page }) => {
  await page.goto('/party.html');

  const snapshot = await page.evaluate(coreIds => {
    const catalog = window.SecretCirclePartyCatalog;
    return {
      total: catalog.games.length,
      games: coreIds.map(id => {
        const game = catalog.getGame(id);
        return {
          id,
          exists: Boolean(game),
          status: game?.status,
          mode: game?.mode,
          href: game?.href || null,
          advancedMode: game?.advancedMode || null,
          minPlayers: game?.minPlayers,
          maxPlayers: game?.maxPlayers,
          rules: game?.instructions || [],
          packs: catalog.getPackNames(id).map(name => ({ name, count: catalog.getItems(id, name).length }))
        };
      })
    };
  }, CORE);

  expect(snapshot.total).toBe(45);
  expect(snapshot.games).toHaveLength(15);

  for (const game of snapshot.games) {
    expect(game.exists, `${game.id} must exist`).toBe(true);
    expect(game.status, `${game.id} must be playable`).toBe('playable');
    expect(game.minPlayers).toBeGreaterThanOrEqual(1);
    expect(game.maxPlayers).toBeGreaterThanOrEqual(game.minPlayers);
    expect(game.maxPlayers).toBeLessThanOrEqual(20);
    expect(game.rules.length, `${game.id} rules`).toBeGreaterThanOrEqual(1);
    expect(game.rules.length, `${game.id} rules`).toBeLessThanOrEqual(4);
    expect(game.packs.length, `${game.id} packs`).toBeGreaterThanOrEqual(1);
    for (const pack of game.packs) expect(pack.count, `${game.id}/${pack.name}`).toBeGreaterThan(0);

    if (game.id === 'imposter') {
      expect(game.mode).toBe('link');
      expect(game.href).toBe('index.html');
    } else if (ADVANCED.has(game.id)) {
      expect(game.mode).toBe('link');
      expect(game.advancedMode).toBe(game.id);
      expect(game.href).toBe(`advanced.html?game=${encodeURIComponent(game.id)}`);
    } else {
      expect(game.mode).toBe(HUB_MODES[game.id]);
      expect(game.href).toBeNull();
    }
  }
});
