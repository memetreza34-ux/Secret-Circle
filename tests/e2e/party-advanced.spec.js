const { test, expect } = require('@playwright/test');

async function configurePlayers(page, players) {
  await page.goto('/party.html');
  await page.evaluate(value => {
    localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
      version: 1,
      players: value,
      favorites: [],
      recent: [],
      presets: [],
      history: [],
      stats: {}
    }));
    localStorage.removeItem('secret-circle-party-active-v1');
  }, players);
}

test('two truths and a lie supports private entry group voting and round persistence', async ({ page }) => {
  await configurePlayers(page, ['Alex', 'Sam', 'Mika']);
  await page.goto('/advanced.html?game=two-truths');
  await expect(page.getByRole('heading', { name: /Zwei Wahrheiten/ })).toBeVisible();
  await page.locator('#advanced-length').selectOption('3');
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  const inputs = page.locator('.advanced-form input');
  await inputs.nth(0).fill('Ich war schon in Rom');
  await inputs.nth(1).fill('Ich kann jonglieren');
  await inputs.nth(2).fill('Ich habe einen Drachen gesehen');
  await page.locator('.advanced-form select').selectOption('2');
  await page.getByRole('button', { name: 'Aussagen mischen und verdecken' }).click();
  await expect(page.locator('#play-content')).toContainText('gespeichert und gemischt');
  await page.getByRole('button', { name: 'Aussagen für die Gruppe anzeigen' }).click();
  await expect(page.locator('.statement-button')).toHaveCount(3);
  await page.locator('.statement-button').first().click();
  await expect(page.locator('#play-content')).toContainText('Die Lüge war:');
  await page.getByRole('button', { name: 'Nächste Person' }).click();
  await expect(page.locator('#play-progress')).toContainText('Runde 2 von 3');

  const active = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-active-v1')));
  expect(active.gameId).toBe('two-truths');
  expect(active.session.rounds).toBe(1);
});

test('question imposter privately distributes similar questions and resolves a vote', async ({ page }) => {
  await configurePlayers(page, ['Alex', 'Sam', 'Mika', 'Lina']);
  await page.goto('/advanced.html?game=question-imposter');
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  for (let index = 0; index < 4; index += 1) {
    await page.getByRole('button', { name: 'Meine Frage anzeigen' }).click();
    await expect(page.locator('#play-content')).not.toContainText('Gerät abschirmen');
    await page.getByRole('button', { name: 'Frage verdecken und weitergeben' }).click();
  }
  await expect(page.locator('#play-content')).toContainText('Fragen sind fast gleich');
  await page.getByRole('button', { name: 'Geheime Abstimmung starten' }).click();
  await expect(page.locator('.player-vote-grid button')).toHaveCount(4);
  await page.locator('.player-vote-grid button').first().click();
  await expect(page.locator('#play-player')).toContainText('Question Imposter:');
  await expect(page.locator('#play-content')).toContainText('Hauptfrage:');
  await expect(page.locator('#play-content')).toContainText('Andere Frage:');
});

test('location spy distributes secret roles and provides a location guess resolution', async ({ page }) => {
  await configurePlayers(page, ['Alex', 'Sam', 'Mika', 'Lina']);
  await page.goto('/advanced.html?game=location-spy');
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  for (let index = 0; index < 4; index += 1) {
    await page.getByRole('button', { name: 'Karte anzeigen' }).click();
    await expect(page.locator('#play-content')).toMatchAriaSnapshot(`- text: /Spion|Geheimer Ort/`);
    await page.getByRole('button', { name: 'Karte schließen und weitergeben' }).click();
  }
  await page.getByRole('button', { name: 'Spion versucht den Ort' }).click();
  await expect(page.locator('.player-vote-grid button')).toHaveCount(6);
  await page.locator('.player-vote-grid button').first().click();
  await expect(page.locator('#play-content')).toContainText('Der geheime Ort war:');
});

test('mafia deals private roles and opens a protected moderator overview', async ({ page }) => {
  await configurePlayers(page, ['Alex', 'Sam', 'Mika', 'Lina', 'Noah', 'Aylin']);
  await page.goto('/advanced.html?game=mafia');
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  for (let index = 0; index < 6; index += 1) {
    await page.getByRole('button', { name: 'Meine Rolle anzeigen' }).click();
    await expect(page.locator('#play-content')).toContainText('Deine Rolle:');
    await page.getByRole('button', { name: 'Rolle schließen und weitergeben' }).click();
  }
  await expect(page.locator('#play-player')).toContainText('neutrale Person');
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Moderatorübersicht öffnen' }).click();
  await expect(page.locator('.role-overview > div')).toHaveCount(6);
  await expect(page.getByRole('button', { name: 'Nachtphase starten' })).toBeVisible();
});

test('advanced sessions survive a reload and can be resumed', async ({ page }) => {
  await configurePlayers(page, ['Alex', 'Sam', 'Mika']);
  await page.goto('/advanced.html?game=two-truths');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await expect(page.locator('#advanced-play-layer')).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: /Session fortsetzen/ })).toBeVisible();
  await page.getByRole('button', { name: /Session fortsetzen/ }).click();
  await expect(page.locator('#advanced-play-layer')).toBeVisible();
  await expect(page.locator('#play-player')).toContainText('Alex');
});
