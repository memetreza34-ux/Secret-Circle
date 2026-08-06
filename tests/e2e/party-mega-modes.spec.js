const { test, expect } = require('@playwright/test');

async function seedHub(page, players = ['Alex', 'Sam', 'Mika', 'Lina']) {
  await page.goto('/party.html');
  await page.evaluate(value => {
    localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
      version: 1,
      players: value,
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
    localStorage.removeItem('secret-circle-party-mega-active-v1');
  }, players);
}

test('Party Hub exposes 37 playable games and dedicated Trend Mode actions', async ({ page }) => {
  await seedHub(page);
  await page.goto('/party.html');
  await expect(page.locator('#playable-count')).toHaveText('37');
  await page.getByRole('button', { name: 'Spiele' }).click();
  await expect(page.locator('#result-count')).toHaveText('37');
  await expect(page.locator('.game-card.playable')).toHaveCount(37);

  await page.locator('#game-search').fill('Anime-Figuren');
  await page.locator('[data-open-game="anime-guess"]').click();
  await expect(page.locator('#detail-title')).toHaveText('Anime-Figuren erraten');
  await expect(page.getByRole('button', { name: 'Trend Mode öffnen' })).toBeVisible();
  await page.getByRole('button', { name: 'Trend Mode öffnen' }).click();
  await expect(page).toHaveURL(/quick-play\.html\?game=anime-guess/);
  await expect(page.getByRole('heading', { name: 'Anime-Figuren erraten' })).toBeVisible();
});

test('Anime fan quiz and Who Am I protect the hidden identity', async ({ page }) => {
  await seedHub(page);
  await page.goto('/quick-play.html?game=anime-guess');
  await page.locator('#quick-pack').selectOption('Shōnen-Klassiker');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await expect(page.locator('#quick-content')).toContainText('ratende Person schaut weg');
  await page.getByRole('button', { name: 'Figur anzeigen' }).click();
  await expect(page.locator('.challenge-card')).not.toHaveText('');
  await expect(page.locator('#quick-private-note')).toContainText('Inoffizielles Fan-Quiz');

  await page.evaluate(() => localStorage.removeItem('secret-circle-party-mega-active-v1'));
  await page.goto('/quick-play.html?game=who-am-i');
  await page.locator('#quick-pack').selectOption('Geschichte');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await page.getByRole('button', { name: 'Identität der Gruppe zeigen' }).click();
  await expect(page.locator('.challenge-card')).not.toHaveText('');
  await page.getByRole('button', { name: 'Verbergen und 60 Sekunden starten' }).click();
  await expect(page.locator('.quick-timer')).toBeVisible();
  await expect(page.locator('#quick-content')).toContainText('Ja-Nein-Fragen');
});

test('Blind Ranking fills all five positions and Money Challenge scores safely', async ({ page }) => {
  await seedHub(page);
  await page.goto('/quick-play.html?game=blind-ranking');
  await page.locator('#quick-rounds').selectOption('3');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  for (const rank of [1, 2, 3, 4, 5]) {
    await page.getByRole('button', { name: `Rang ${rank}` }).click();
  }
  await expect(page.locator('.blind-ranking-result li')).toHaveCount(5);
  await expect(page.locator('#quick-score')).toContainText('1 Punkte');

  await page.evaluate(() => localStorage.removeItem('secret-circle-party-mega-active-v1'));
  await page.goto('/quick-play.html?game=money-challenge');
  await page.locator('#quick-pack').selectOption('Für 100 Euro');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await expect(page.locator('.money-amount')).toHaveText('100 €');
  await expect(page.locator('#quick-content')).toContainText('keine echte Zahlung');
  await page.getByRole('button', { name: 'Würde ich machen' }).click();
  await expect(page.locator('#quick-progress')).toContainText('Runde 2');
  await expect(page.locator('#quick-score')).toContainText('1 Punkte');
});

test('all nine mega trend modes load their category content and engine without runtime errors', async ({ page }) => {
  await seedHub(page, ['Alex', 'Sam', 'Mika', 'Lina', 'Noah']);
  const ids = [
    'who-am-i', 'anime-guess', 'money-challenge', 'blind-ranking', 'emoji-quiz',
    'pass-the-phone', 'red-green-flag', 'secret-mission', 'tier-list'
  ];
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const id of ids) {
    await page.goto(`/quick-play.html?game=${id}`);
    await expect(page.locator('#quick-title')).not.toHaveText('Spiel laden');
    await expect(page.locator('#quick-pack option')).not.toHaveCount(0);
    await page.getByRole('button', { name: 'Spiel starten' }).click();
    await expect(page.locator('#quick-play')).toBeVisible();
    await page.evaluate(() => localStorage.removeItem('secret-circle-party-mega-active-v1'));
  }
  expect(errors).toEqual([]);
});

test('custom Anime character packs appear in the fan quiz', async ({ page }) => {
  await seedHub(page);
  await page.evaluate(() => {
    localStorage.setItem('secret-circle-party-custom-packs-v1', JSON.stringify({
      version: 1,
      packs: [{
        id: 'anime-custom',
        gameId: 'anime-guess',
        name: 'Unsere Figuren',
        items: ['Figur Alpha', 'Figur Beta', 'Figur Gamma'],
        createdAt: '2026-08-06T10:00:00Z'
      }]
    }));
  });
  await page.goto('/quick-play.html?game=anime-guess');
  await expect(page.locator('#quick-pack')).toContainText('Eigene · Unsere Figuren (3)');
  await page.locator('#quick-pack').selectOption('Eigene · Unsere Figuren');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await page.getByRole('button', { name: 'Figur anzeigen' }).click();
  await expect(page.locator('.challenge-card')).toHaveText(/Figur (Alpha|Beta|Gamma)/);
});
