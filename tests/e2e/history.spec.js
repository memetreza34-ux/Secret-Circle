const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('round completed without imposter guess is stored exactly once', async ({ page }) => {
  const state = await page.evaluate(() => {
    let game = window.SecretCircleEngine.createGame({
      players: ['Alex', 'Sam', 'Mika', 'Lina'],
      entries: [['Mond', 'Nacht'], ['Sonne', 'Tag'], ['Stern', 'Himmel']],
      category: 'Testkategorie',
      imposterCount: 1,
      useHint: true,
      roundSeconds: 60,
      matchRounds: 1,
      seed: 'history-direct-result'
    });
    while (game.phase === 'reveal') game = window.SecretCircleEngine.advanceReveal(game);
    localStorage.setItem('secret-circle-active-v7', JSON.stringify(game));
    const innocent = game.players.find(name => !game.imposters.includes(name));
    return { players: game.players, innocent, word: game.word };
  });

  await page.reload();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await page.getByRole('button', { name: 'Abstimmung starten' }).click();

  for (const voter of state.players) {
    const target = voter === state.innocent
      ? state.players.find(name => name !== voter && name !== state.innocent)
      : state.innocent;
    await page.getByRole('button', { name: target, exact: true }).click();
  }

  await expect(page.locator('#result-screen')).toBeVisible();
  await expect(page.locator('#history-list .history-item')).toHaveCount(1);
  await expect(page.locator('#history-list')).toContainText(state.word);

  await page.reload();
  await expect(page.locator('#history-list .history-item')).toHaveCount(1);
  await expect(page.locator('#history-list')).toContainText(state.word);
});
