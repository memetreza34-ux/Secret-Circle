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
    if (guard > 3) throw new Error('Voting did not resolve after the configured tie break.');
    for (const voter of players) {
      const preferred = firstRoundTargets?.[voter] || players.find(name => name !== voter);
      await castVisibleVote(page, voter, preferred);
      if (!(await page.locator('#vote-screen').isVisible())) break;
    }
  }
}

async function startBasicGame(page, players, rounds = '1') {
  await page.locator('#players').fill(players.join('\n'));
  await page.locator('#match-rounds').fill(rounds);
  await page.locator('#duration').fill('1');
  await page.locator('#start').click();
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

test('starts multiple match rounds, preserves scores and avoids repeated words', async ({ page }) => {
  const players = ['Alex', 'Sam', 'Mika', 'Lina'];
  await startBasicGame(page, players, '3');
  const firstState = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-active-v7')));
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
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-active-v7')));
  expect(Object.values(stored.scores).reduce((sum, value) => sum + value, 0)).toBeGreaterThan(0);
  expect(stored.word).not.toBe(firstState.word);
  expect(stored.usedWords).toContain(firstState.word);
  expect(scoresBefore).toHaveLength(players.length);
});

test('restores an interrupted round from local storage', async ({ page }) => {
  await page.locator('#players').fill('Alex\nSam\nMika');
  await page.locator('#start').click();
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
  /* Das Setup lässt den ungültigen Zustand gar nicht erst zu: Der doppelte Name
     wird benannt und der Startknopf bleibt gesperrt, statt den Klick anzunehmen
     und danach eine Fehlermeldung zu zeigen. */
  await expect(page.locator('#players-help')).toContainText('doppelter Name');
  await expect(page.locator('#start')).toBeDisabled();
  await expect(page.locator('#setup-screen')).toBeVisible();
  await expect(page.locator('#resume-box')).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem('secret-circle-active-v7'))).toBeNull();
});

test('setup offers only the built-in categories and no extra data tools', async ({ page }) => {
  await expect(page.locator('#category option').first()).toHaveText('Gemischt');
  expect(await page.locator('#category option').count()).toBeGreaterThan(3);
  for (const name of ['Eigene Kategorien', 'Sicherung exportieren', 'Alle lokalen Daten löschen', 'Verlauf löschen']) {
    await expect(page.getByRole('button', { name })).toHaveCount(0);
  }
});

test('recovers safely from corrupted persisted data', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('secret-circle-custom-v7', '{broken-json'));
  await page.reload();
  await expect(page.locator('#setup-screen')).toBeVisible();
  await expect(page.locator('#status')).toContainText('Lokale Daten wurden auf die neue App-Version aktualisiert');
  expect(await page.evaluate(() => localStorage.getItem('secret-circle-custom-v7'))).toBeNull();
});

test('exposes privacy information and remains usable on mobile viewport', async ({ page, isMobile }) => {
  const privacyLink = page.getByRole('link', { name: 'Datenschutz' });
  await expect(privacyLink).toBeVisible();
  await privacyLink.click();
  await expect(page).toHaveURL(/privacy\.html$/);
  await expect(page.getByRole('heading', { name: 'Deine Spieldaten bleiben auf deinem Gerät' })).toBeVisible();
  await page.goBack();
  if (isMobile) {
    await expect(page.locator('#setup-screen')).toBeVisible();
    await expect(page.locator('#start')).toBeVisible();
  }
});
