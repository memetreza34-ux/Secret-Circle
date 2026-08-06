const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/party.html');
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika', 'Lina'],
      favorites: ['charades'],
      recent: ['truth-dare'],
      presets: [],
      history: [],
      stats: {}
    }));
  });
  await page.reload();
});

test('Party Night creates a varied persistent plan and opens a selected game safely', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Euren ganzen Partyabend planen' })).toBeVisible();
  await expect(page.locator('#party-night-player-count')).toHaveText('4');
  await page.locator('#party-night-duration').selectOption('45');
  await page.locator('#party-night-mood').selectOption('funny');
  await page.locator('#party-night-age').selectOption('all');
  await page.getByRole('button', { name: 'Plan erstellen' }).click();

  await expect(page.locator('.party-night-step')).toHaveCount(3);
  await expect(page.locator('.party-night-step.current')).toHaveCount(1);
  await expect(page.locator('.party-night-step[aria-current="step"]')).toHaveCount(1);
  await expect(page.locator('#party-night-status')).toContainText('3 Spiele');

  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-night-v1')));
  expect(stored.version).toBe(1);
  expect(stored.steps).toHaveLength(3);
  expect(new Set(stored.steps.map(step => step.gameId)).size).toBe(3);

  await page.locator('.party-night-step').first().getByRole('button', { name: 'Öffnen' }).click();
  await expect(page.locator('#game-detail')).toBeVisible();
  await expect(page.locator('#detail-title')).not.toHaveText('');
  await page.getByRole('button', { name: 'Spieldetails schließen' }).click();

  await page.locator('.party-night-step').first().getByRole('button', { name: 'Als erledigt' }).click();
  await expect(page.locator('.party-night-step.done')).toHaveCount(1);
  await expect(page.locator('.party-night-step.current')).toHaveCount(1);

  await page.reload();
  await expect(page.locator('.party-night-step')).toHaveCount(3);
  await expect(page.locator('.party-night-step.done')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Partyabend fortsetzen' })).toBeVisible();
});

test('Party Night respects family and player filters and can be completed or cleared', async ({ page }) => {
  await page.locator('#party-night-duration').selectOption('30');
  await page.locator('#party-night-mood').selectOption('all');
  await page.locator('#party-night-age').selectOption('family');
  await page.getByRole('button', { name: 'Plan erstellen' }).click();

  const checks = await page.evaluate(() => {
    const plan = JSON.parse(localStorage.getItem('secret-circle-party-night-v1'));
    return plan.steps.map(step => {
      const game = window.SecretCirclePartyCatalog.getGame(step.gameId);
      return { age: game.age, min: game.minPlayers, max: game.maxPlayers, mode: game.mode };
    });
  });
  expect(checks.length).toBe(2);
  expect(checks.every(item => item.age === 'all')).toBe(true);
  expect(checks.every(item => item.min <= 4 && item.max >= 4)).toBe(true);
  expect(checks.every(item => !['utility', 'random-player'].includes(item.mode))).toBe(true);

  while (await page.locator('.party-night-step').getByRole('button', { name: 'Als erledigt' }).count()) {
    await page.locator('.party-night-step').getByRole('button', { name: 'Als erledigt' }).first().click();
  }
  await expect(page.locator('.party-night-summary')).toContainText('Abend abgeschlossen');
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Plan löschen' }).click();
  await expect(page.locator('.party-night-empty')).toContainText('Noch kein Ablauf geplant');
  expect(await page.evaluate(() => localStorage.getItem('secret-circle-party-night-v1'))).toBeNull();
});

test('15 minute planning produces one focused game and player count refreshes from the lobby', async ({ page }) => {
  await page.locator('#party-night-duration').selectOption('15');
  await page.getByRole('button', { name: 'Plan erstellen' }).click();
  await expect(page.locator('.party-night-step')).toHaveCount(1);

  await page.getByRole('button', { name: 'Spieler' }).click();
  await page.locator('#hub-players').fill('Aylin\nBen\nCem\nDaria\nEmir\nFatma');
  await page.getByRole('button', { name: 'Spieler speichern' }).click();
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.locator('#party-night-player-count')).toHaveText('6');
});

test('completed Hub history automatically advances the matching Party Night step', async ({ page }) => {
  await page.locator('#party-night-duration').selectOption('30');
  await page.getByRole('button', { name: 'Plan erstellen' }).click();
  const planned = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-night-v1')));
  const completedGameId = planned.steps[0].gameId;
  await page.evaluate(({ completedGameId, createdAt }) => {
    const state = JSON.parse(localStorage.getItem('secret-circle-party-hub-v1'));
    state.history.unshift({
      id: 'automatic-party-night-completion',
      gameId: completedGameId,
      title: window.SecretCirclePartyCatalog.getGame(completedGameId).title,
      endedAt: new Date(Date.parse(createdAt) + 1000).toISOString(),
      rounds: 1,
      score: 0
    });
    localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify(state));
  }, { completedGameId, createdAt: planned.createdAt });

  await page.reload();
  await expect(page.locator('.party-night-step').first()).toHaveClass(/done/);
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-night-v1')));
  expect(stored.steps[0].status).toBe('done');
  expect(stored.currentIndex).toBe(1);
});
