const { test, expect } = require('@playwright/test');

async function revealAllCards(page, playerCount) {
  for (let index = 0; index < playerCount; index += 1) {
    await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
    await expect(page.locator('#secret')).toBeVisible();
    await page.getByRole('button', { name: 'Karte schließen und weitergeben' }).click();
  }
}

async function voteAllPlayers(page, players, targetByVoter) {
  for (const voter of players) {
    await expect(page.locator('#voter-name')).toContainText(voter);
    await page.getByRole('button', { name: targetByVoter[voter] }).click();
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('completes a full match round with voting and result screen', async ({ page }) => {
  const players = ['Alex', 'Sam', 'Mika', 'Lina'];
  await page.locator('#players').fill(players.join('\n'));
  await page.locator('#match-rounds').selectOption('1');
  await page.locator('#duration').selectOption('1');
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  await revealAllCards(page, players.length);
  await expect(page.locator('#round-screen')).toBeVisible();
  await page.getByRole('button', { name: 'Abstimmung starten' }).click();

  const targets = { Alex: 'Sam', Sam: 'Alex', Mika: 'Alex', Lina: 'Alex' };
  await voteAllPlayers(page, players, targets);

  if (await page.locator('#guess-screen').isVisible()) {
    await page.locator('#imposter-guess').fill('absichtlich falsch');
    await page.getByRole('button', { name: 'Antwort prüfen' }).click();
  }

  await expect(page.locator('#result-screen')).toBeVisible();
  await expect(page.locator('#leaderboard .leader-row')).toHaveCount(players.length);
  await expect(page.locator('#next-round')).toBeHidden();
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
});

test('exposes privacy information and remains usable on mobile viewport', async ({ page, isMobile }) => {
  await expect(page.getByRole('link', { name: 'Datenschutz' })).toBeVisible();
  if (isMobile) {
    await expect(page.locator('#setup-screen')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Spiel starten' })).toBeVisible();
  }
});
