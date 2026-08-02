const { test, expect } = require('@playwright/test');

async function revealAllCards(page, playerCount) {
  for (let index = 0; index < playerCount; index += 1) {
    await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
    await expect(page.locator('#secret')).toBeVisible();
    await page.getByRole('button', { name: 'Karte schließen und weitergeben' }).click();
  }
}

async function castVisibleVote(page, voter, preferredTarget) {
  await expect(page.locator('#voter-name')).toContainText(voter);
  const preferred = page.getByRole('button', { name: preferredTarget, exact: true });
  if (await preferred.count()) {
    await preferred.click();
    return;
  }
  await page.locator('#vote-options button').first().click();
}

async function resolveAllVotingRounds(page, players, firstRoundTargets) {
  let guard = 0;
  while (await page.locator('#vote-screen').isVisible()) {
    guard += 1;
    if (guard > 5) throw new Error('Voting did not resolve after five rounds.');
    for (const voter of players) {
      const preferred = firstRoundTargets?.[voter] || players.find(name => name !== voter);
      await castVisibleVote(page, voter, preferred);
      if (!(await page.locator('#vote-screen').isVisible())) break;
    }
  }
}

async function startBasicGame(page, players, rounds = '1') {
  await page.locator('#players').fill(players.join('\n'));
  await page.locator('#match-rounds').selectOption(rounds);
  await page.locator('#duration').selectOption('1');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('completes a full match round with voting and result screen', async ({ page }) => {
  const players = ['Alex', 'Sam', 'Mika', 'Lina'];
  await startBasicGame(page, players);
  await revealAllCards(page, players.length);
  await expect(page.locator('#round-screen')).toBeVisible();
  await page.getByRole('button', { name: 'Abstimmung starten' }).click();

  await resolveAllVotingRounds(page, players, {
    Alex: 'Sam',
    Sam: 'Alex',
    Mika: 'Alex',
    Lina: 'Alex'
  });

  if (await page.locator('#guess-screen').isVisible()) {
    await page.locator('#imposter-guess').fill('absichtlich falsch');
    await page.getByRole('button', { name: 'Antwort prüfen' }).click();
  }

  await expect(page.locator('#result-screen')).toBeVisible();
  await expect(page.locator('#leaderboard .leader-row')).toHaveCount(players.length);
  await expect(page.locator('#next-round')).toBeHidden();
});

test('starts the next round and preserves the leaderboard', async ({ page }) => {
  const players = ['Alex', 'Sam', 'Mika', 'Lina'];
  await startBasicGame(page, players, '3');
  await revealAllCards(page, players.length);
  await page.getByRole('button', { name: 'Abstimmung starten' }).click();
  await resolveAllVotingRounds(page, players, {
    Alex: 'Sam',
    Sam: 'Alex',
    Mika: 'Alex',
    Lina: 'Alex'
  });
  if (await page.locator('#guess-screen').isVisible()) {
    await page.locator('#imposter-guess').fill('absichtlich falsch');
    await page.getByRole('button', { name: 'Antwort prüfen' }).click();
  }
  const scoresBefore = await page.locator('#leaderboard .leader-row').allTextContents();
  await page.getByRole('button', { name: 'Runde 2 starten' }).click();
  await expect(page.locator('#reveal-progress')).toContainText('Runde 2/3');
  await page.reload();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#reveal-progress')).toContainText('Runde 2/3');
  const storedScores = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-active-v4')).scores);
  expect(Object.values(storedScores).reduce((sum, value) => sum + value, 0)).toBeGreaterThan(0);
  expect(scoresBefore).toHaveLength(players.length);
});

test('restores an interrupted round from local storage', async ({ page }) => {
  await page.locator('#players').fill('Alex\nSam\nMika');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
  await page.getByRole('button', { name: 'Karte schließen und weitergeben' }).click();

  await page.reload();
  await expect(page.locator('#resume-box')).toBeVisible();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#reveal-screen')).toBeVisible();
  await expect(page.locator('#reveal-progress')).toContainText('Karte 2 von 3');
});

test('rejects invalid player setup without creating a game', async ({ page }) => {
  await page.locator('#players').fill('Alex\nAlex\nSam');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await expect(page.locator('#status')).toContainText('Doppelter Spielername');
  await expect(page.locator('#setup-screen')).toBeVisible();
  await expect(page.locator('#resume-box')).toBeHidden();
});

test('creates a custom category and clears all local data', async ({ page }) => {
  await page.getByRole('button', { name: 'Eigene Kategorien' }).click();
  await page.locator('#custom-name').fill('Weltraum');
  await page.locator('#custom-words').fill('Mond | Nacht\nMars | Planet');
  await page.getByRole('button', { name: 'Kategorie speichern' }).click();
  await expect(page.locator('#custom-list')).toContainText('Weltraum');

  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Alle lokalen Daten löschen' }).click();
  await expect(page.locator('#custom-list')).toContainText('Noch keine eigenen Kategorien');
  await expect(page.locator('#status')).toContainText('Alle lokalen Daten wurden gelöscht');
  const keys = await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('secret-circle-')));
  expect(keys).toEqual([]);
});

test('exposes privacy information and remains usable on mobile viewport', async ({ page, isMobile }) => {
  const privacyLink = page.getByRole('link', { name: 'Datenschutz' });
  await expect(privacyLink).toBeVisible();
  await privacyLink.click();
  await expect(page).toHaveURL(/privacy\.html$/);
  await expect(page.getByRole('heading', { name: 'Datenschutz' })).toBeVisible();
  await page.goBack();
  if (isMobile) {
    await expect(page.locator('#setup-screen')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Spiel starten' })).toBeVisible();
  }
});
