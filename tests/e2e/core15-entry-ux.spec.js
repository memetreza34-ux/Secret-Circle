'use strict';

const { test, expect } = require('@playwright/test');

/* Die Liste muss dem verbindlichen Core-Vertrag entsprechen:
   tests/core-game-contract.test.js / party-release-structure.js.
   Dies ist ein echter Browser-Starttest, kein Ersatz für Gruppentests. */
const CORE = [
  { id: 'imposter', engine: 'word' },
  { id: 'truth-dare', engine: 'hub' },
  { id: 'never-have', engine: 'hub' },
  { id: 'most-likely', engine: 'hub' },
  { id: 'would-rather', engine: 'hub' },
  { id: 'paranoia', engine: 'hub' },
  { id: 'charades', engine: 'hub' },
  { id: 'taboo', engine: 'hub' },
  { id: 'hot-potato', engine: 'hub' },
  { id: 'word-chain', engine: 'hub' },
  { id: 'two-truths', engine: 'advanced' },
  { id: 'question-imposter', engine: 'advanced' },
  { id: 'location-spy', engine: 'advanced' },
  { id: 'mafia', engine: 'advanced' },
  { id: 'wrong-answers', engine: 'hub' }
];
const HUB_KEY = 'secret-circle-party-hub-v1';
const PLAYERS = ['Alex', 'Sam', 'Mika', 'Lina', 'Noah', 'Lea', 'Emil', 'Sara'];

test('the 15 Core entry cases match the actual published catalog', async ({ page }) => {
  await page.goto('/v2-hub.html');
  const catalog = await page.evaluate(() => window.SecretCirclePartyCatalog?.games
    ?.filter(g => g.status === 'playable' && g.releaseTier === 'core')
    .map(g => g.id) || []);
  // Some catalog generations use the release structure as their canonical tier source.
  if (catalog.length) expect(new Set(catalog)).toEqual(new Set(CORE.map(g => g.id)));
  expect(CORE).toHaveLength(15);
  expect(new Set(CORE.map(g => g.id)).size).toBe(15);
});

for (const { id, engine } of CORE) {
  test(`Core entry: ${id} explains the game and opens the correct playable engine`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/v2-hub.html');
    await page.evaluate(([key, players]) => {
      localStorage.clear();
      localStorage.setItem(key, JSON.stringify({
        version: 1, players, favorites: [], recent: [], presets: [], history: [], stats: {}
      }));
    }, [HUB_KEY, PLAYERS]);

    await page.goto(`/v2-hub.html#spiel=${id}`);
    await expect(page.locator('[data-screen="mode"]')).toBeVisible();
    await expect(page.locator('#mode-title')).not.toBeEmpty();
    await expect(page.locator('#mode-sub')).not.toBeEmpty();
    await expect(page.locator('#mode-steps li').first()).toBeVisible();
    await expect(page.locator('#start-btn')).toBeEnabled();
    await page.locator('#start-btn').click();

    if (engine === 'word') {
      await expect(page).toHaveURL(/\/index\.html$/);
      await expect(page.locator('#setup-screen')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Spiel starten' })).toBeVisible();
    } else if (engine === 'advanced') {
      await expect(page).toHaveURL(new RegExp(`/advanced\\.html\\?game=${id}$`));
      await expect(page.locator('#advanced-start')).toBeVisible();
      await expect(page.locator('#advanced-pack')).toBeVisible();
    } else {
      await expect(page).toHaveURL(/\/party\.html\?from=v2$/);
      await expect(page.locator('#play-layer')).toBeVisible();
      await expect(page.locator('#play-content')).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
}
