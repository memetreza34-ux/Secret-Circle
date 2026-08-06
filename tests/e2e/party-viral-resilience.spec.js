const { test, expect } = require('@playwright/test');

async function seedPlayers(page, players = ['Alex', 'Sam', 'Mika', 'Lina']) {
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
    localStorage.removeItem('secret-circle-party-viral-active-v1');
  }, players);
}

test('corrupted Viral snapshots are ignored without breaking setup', async ({ page }) => {
  await seedPlayers(page);
  await page.evaluate(() => {
    localStorage.setItem('secret-circle-party-viral-active-v1', JSON.stringify({
      version: 1,
      gameId: 'guess-the-price',
      targetRounds: 999,
      round: -2,
      pack: 'Nicht vorhanden',
      players: ['Alex', 'Alex'],
      totalScore: -100
    }));
  });
  await page.goto('/quick-play.html?game=guess-the-price');
  await expect(page.locator('#quick-setup')).toBeVisible();
  await expect(page.locator('#quick-resume-box')).toBeHidden();
  await expect(page.getByRole('button', { name: 'Spiel starten' })).toBeEnabled();
});

test('malicious-looking names remain plain text in Viral results', async ({ page }) => {
  const malicious = '<img src=x onerror=window.__viralInjected=1>';
  await seedPlayers(page, [malicious, 'Sam', 'Mika']);
  await page.goto('/quick-play.html?game=finish-the-sentence');
  await page.locator('#quick-rounds').selectOption('3');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  for (let round = 0; round < 3; round += 1) {
    await page.getByRole('button', { name: 'Kreativer Treffer' }).click();
    await page.getByRole('button', { name: 'Nächster Satz' }).click();
  }
  await expect(page.locator('#quick-result')).toBeVisible();
  await expect(page.locator('#quick-result img')).toHaveCount(0);
  await expect(page.locator('#quick-result script')).toHaveCount(0);
  await expect(page.locator('#quick-result-text')).toContainText(malicious);
  expect(await page.evaluate(() => window.__viralInjected)).toBeUndefined();
});

test('price guesses are clamped to the supported safe range', async ({ page }) => {
  await seedPlayers(page);
  await page.goto('/quick-play.html?game=guess-the-price');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  const input = page.locator('input[type="number"]');
  await expect(input).toHaveAttribute('min', '0');
  await expect(input).toHaveAttribute('max', '100000');
  await input.fill('999999999');
  await page.getByRole('button', { name: 'Schätzung festlegen' }).click();
  await expect(page.locator('#quick-content')).toContainText('Deine Schätzung: 100000 €');
});

test('Who Knows Me Best never reveals the secret choice during group voting', async ({ page }) => {
  await seedPlayers(page, ['Alex', 'Sam', 'Mika']);
  await page.goto('/quick-play.html?game=know-me-best');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  const options = page.locator('#quick-actions button');
  const secretLabel = await options.first().textContent();
  await options.first().click();
  await expect(page.locator('#quick-private-note')).toBeHidden();
  await expect(page.locator('#quick-content')).not.toContainText(`Antwort: ${secretLabel.split('·')[1].trim()}`);
  await expect(page.locator('#quick-actions button')).toHaveCount(3);
});

test('Viral Mode controls remain keyboard reachable and labelled', async ({ page }) => {
  await seedPlayers(page);
  await page.goto('/quick-play.html?game=guess-the-price');
  const unlabeled = await page.evaluate(() => [...document.querySelectorAll('input, select, textarea')]
    .filter(control => !(control.labels?.length || control.getAttribute('aria-label') || control.getAttribute('aria-labelledby')))
    .map(control => control.id || control.type));
  expect(unlabeled).toEqual([]);
  await page.getByRole('button', { name: 'Spiel starten' }).focus();
  await expect(page.getByRole('button', { name: 'Spiel starten' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('input[type="number"]')).toBeVisible();
  await page.locator('input[type="number"]').focus();
  await expect(page.locator('input[type="number"]')).toBeFocused();
});
