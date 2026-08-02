const { test, expect } = require('@playwright/test');

async function startDiscussion(page) {
  const players = ['Alex', 'Sam', 'Mika'];
  await page.locator('#players').fill(players.join('\n'));
  await page.locator('#duration').selectOption('1');
  await page.locator('#match-rounds').selectOption('1');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  for (let index = 0; index < players.length; index += 1) {
    await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
    await page.getByRole('button', { name: 'Karte schließen und weitergeben' }).click();
  }
  await expect(page.locator('#round-screen')).toBeVisible();
}

function timerSeconds(text) {
  const [minutes, seconds] = text.split(':').map(Number);
  return minutes * 60 + seconds;
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('deadline timer counts accurately, pauses and survives a reload', async ({ page }) => {
  await startDiscussion(page);
  await expect(page.locator('#time')).toHaveText('01:00');

  await page.getByRole('button', { name: 'Timer starten' }).click();
  await page.waitForTimeout(1_250);
  const runningSeconds = timerSeconds(await page.locator('#time').innerText());
  expect(runningSeconds).toBeLessThan(60);
  expect(runningSeconds).toBeGreaterThan(0);

  await page.getByRole('button', { name: 'Timer pausieren' }).click();
  const pausedTime = await page.locator('#time').innerText();
  await page.waitForTimeout(1_100);
  await expect(page.locator('#time')).toHaveText(pausedTime);

  await page.getByRole('button', { name: 'Timer fortsetzen' }).click();
  await page.waitForTimeout(350);
  await page.reload();
  await expect(page.locator('#resume-box')).toBeVisible();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#round-screen')).toBeVisible();
  const resumedSeconds = timerSeconds(await page.locator('#time').innerText());
  expect(resumedSeconds).toBeLessThanOrEqual(timerSeconds(pausedTime));
  await expect(page.getByRole('button', { name: 'Timer pausieren' })).toBeVisible();
});

test('elapsed background deadline becomes an expired timer after resume', async ({ page }) => {
  await startDiscussion(page);
  await page.getByRole('button', { name: 'Timer starten' }).click();

  await page.evaluate(() => {
    const key = 'secret-circle-active-v7';
    const game = JSON.parse(localStorage.getItem(key));
    game.timerRunning = true;
    game.timerDeadline = Date.now() - 1_000;
    game.remainingSeconds = 30;
    localStorage.setItem(key, JSON.stringify(game));
  });

  await page.reload();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#time')).toHaveText('00:00');
  await expect(page.getByRole('button', { name: 'Zeit abgelaufen' })).toBeDisabled();
  await expect(page.locator('#status')).toContainText('Diskussionszeit ist abgelaufen');
});

test('legacy active game and settings migrate to storage version seven', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.clear();
    const game = window.SecretCircleEngine.createGame({
      players: ['Alex', 'Sam', 'Mika'],
      entries: [['Mond', 'Nacht'], ['Sonne', 'Tag']],
      category: 'Test',
      imposterCount: 1,
      useHint: true,
      roundSeconds: 60,
      matchRounds: 1,
      seed: 'legacy-migration'
    });
    game.version = 6;
    delete game.timerRunning;
    delete game.timerDeadline;
    localStorage.setItem('secret-circle-active-v4', JSON.stringify(game));
    localStorage.setItem('secret-circle-settings-v4', JSON.stringify({
      players: 'Alex\nSam\nMika',
      category: 'all',
      imposterCount: '1',
      useHint: true,
      duration: '1',
      matchRounds: '1'
    }));
  });

  await page.reload();
  await expect(page.locator('#resume-box')).toBeVisible();
  await expect(page.locator('#status')).toContainText('neue App-Version aktualisiert');

  const storage = await page.evaluate(() => ({
    current: JSON.parse(localStorage.getItem('secret-circle-active-v7')),
    legacyActive: localStorage.getItem('secret-circle-active-v4'),
    legacySettings: localStorage.getItem('secret-circle-settings-v4')
  }));
  expect(storage.current.version).toBe(7);
  expect(storage.current.timerRunning).toBe(false);
  expect(storage.current.timerDeadline).toBeNull();
  expect(storage.legacyActive).toBeNull();
  expect(storage.legacySettings).toBeNull();
});
