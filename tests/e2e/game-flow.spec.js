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
  if (await preferred.count()) await preferred.click();
  else await page.locator('#vote-options button').first().click();
  if (await page.locator('#vote-handoff-screen').isVisible()) {
    await expect(page.locator('#vote-handoff-progress')).toContainText('gespeichert');
    await page.getByRole('button', { name: 'Ich bin bereit' }).click();
  }
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
  await page.locator('#advanced-settings > summary').click();
  await page.locator('#match-rounds').fill(rounds);
  await page.locator('#duration').fill('1');
  await page.locator('#start').click();
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('private vote handoff stays covered after reload and resume', async ({ page }) => {
  await startBasicGame(page, ['Alex', 'Sam', 'Mika'], '1');
  await revealAllCards(page, 3);
  await page.getByRole('button', { name: 'Abstimmung starten' }).click();
  await page.locator('#vote-options button').first().click();
  await expect(page.locator('#vote-handoff-screen')).toBeVisible();
  await expect(page.locator('#vote-screen')).toBeHidden();
  await page.reload();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#vote-handoff-screen')).toBeVisible();
  await page.getByRole('button', { name: 'Ich bin bereit' }).click();
  await expect(page.locator('#vote-screen')).toBeVisible();
  await expect(page.locator('#vote-progress')).toContainText('Stimme 2 von 3');
});

test('tie break starts behind a handoff and stays private after reload', async ({ page }) => {
  const players = ['Alex', 'Sam', 'Mika', 'Lina'];
  await startBasicGame(page, players);
  await revealAllCards(page, players.length);
  await page.getByRole('button', { name: 'Abstimmung starten' }).click();
  const votes = { Alex: 'Sam', Sam: 'Alex', Mika: 'Alex', Lina: 'Sam' };
  for (let index = 0; index < players.length; index += 1) {
    await page.getByRole('button', { name: votes[players[index]], exact: true }).click();
    if (index < players.length - 1) await page.getByRole('button', { name: 'Ich bin bereit' }).click();
  }
  await expect(page.locator('#vote-handoff-screen')).toBeVisible();
  await expect(page.locator('#vote-handoff-progress')).toContainText('Stichwahl');
  await expect(page.locator('#vote-screen')).toBeHidden();
  await page.reload();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#vote-handoff-screen')).toBeVisible();
  await page.getByRole('button', { name: 'Ich bin bereit' }).click();
  await expect(page.locator('#vote-progress')).toContainText('Stichwahl · Stimme 1 von 4');
});

test('imposter spoken answer is accepted by the group without a keyboard', async ({ page }) => {
  const players = ['Alex', 'Sam', 'Mika', 'Lina'];
  await startBasicGame(page, players);
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-active-v7')));
  const imposter = state.imposters[0];
  await revealAllCards(page, players.length);
  await page.getByRole('button', { name: 'Abstimmung starten' }).click();
  for (const player of players) {
    await page.getByRole('button', { name: player === imposter ? players.find(name => name !== imposter) : imposter, exact: true }).click();
    if (await page.locator('#vote-handoff-screen').isVisible()) await page.getByRole('button', { name: 'Ich bin bereit' }).click();
  }
  await expect(page.locator('#guess-screen')).toBeVisible();
  await expect(page.locator('#guess-screen input')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Richtig', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Richtig', exact: true }).click();
  await expect(page.locator('#result-heading')).toHaveText('Die Imposter gewinnen');
});

test('Word Imposter uses the shared group and writes valid edits back to it', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
    version: 1, players: ['Nora', 'Lea', 'Ben', 'Tariq'],
    favorites: ['truth-dare'], recent: [], presets: [], history: [], stats: {}
  })));
  await page.reload();
  await expect(page.locator('#players')).toHaveValue('Nora\nLea\nBen\nTariq');
  await expect(page.locator('#player-list input')).toHaveCount(4);
  await expect(page.locator('#import-group-players')).toBeHidden();

  /* Gültige Änderungen landen in der Gruppe, alle anderen Hub-Daten bleiben erhalten. */
  await page.locator('#players').fill('Nora\nLea\nOle');
  const shared = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-hub-v1')));
  expect(shared.players).toEqual(['Nora', 'Lea', 'Ole']);
  expect(shared.favorites).toEqual(['truth-dare']);

  /* Ungültige Zwischenstände (zu wenige Namen, doppelte Namen) ändern die Gruppe nicht. */
  await page.locator('#players').fill('Nora\nLea');
  await page.locator('#players').fill('Nora\nnora\nLea');
  const unchanged = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-hub-v1')));
  expect(unchanged.players).toEqual(['Nora', 'Lea', 'Ole']);

  await page.locator('#players').fill('Nora\nLea\nOle');
  await expect(page.locator('#start')).toBeEnabled();
  await page.locator('#start').click();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-active-v7')));
  expect(saved.players).toEqual(['Nora', 'Lea', 'Ole']);
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
    await page.getByRole('button', { name: 'Falsch', exact: true }).click();
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
    await page.getByRole('button', { name: 'Falsch', exact: true }).click();
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
  /* Der Datenschutz-Link liegt im Profil der Startseite. */
  await page.goto('/v2-hub.html#profil');
  await page.getByRole('button', { name: 'Datenschutz' }).click();
  const privacyLink = page.getByRole('link', { name: 'Vollständige Datenschutzhinweise' });
  await expect(privacyLink).toBeVisible();
  await privacyLink.click();
  await expect(page).toHaveURL(/privacy\.html$/);
  await expect(page.getByRole('heading', { name: 'Deine Spieldaten bleiben auf deinem Gerät' })).toBeVisible();
  await page.goto('/');
  if (isMobile) {
    await expect(page.locator('#setup-screen')).toBeVisible();
    await expect(page.locator('#start')).toBeVisible();
  }
});

test('a new match avoids words from the recent history', async ({ page }) => {
  const recent = await page.evaluate(() => window.SecretCircleContent.words.tiere.slice(0, 20).map(entry => entry[0]));
  const history = recent.map((word, index) => ({
    id: `verlauf-${index}`, completedAt: new Date(2026, 9, 1, 12, index).toISOString(), category: 'Tiere',
    playerCount: 4, players: ['Alex', 'Sam', 'Mika', 'Lina'], imposterCount: 1, word, imposters: ['Sam'], winner: 'innocents', round: 1
  }));
  for (let attempt = 0; attempt < 5; attempt += 1) {
    await page.evaluate(value => {
      localStorage.removeItem('secret-circle-active-v7');
      localStorage.setItem('secret-circle-history-v7', JSON.stringify(value));
    }, history);
    await page.reload();
    await page.locator('#category-open').click();
    await page.locator('#category-screen').getByRole('button', { name: /^Tiere/ }).click();
    await page.locator('#start').click();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-active-v7')));
    expect(recent).not.toContain(saved.word);
  }
});
