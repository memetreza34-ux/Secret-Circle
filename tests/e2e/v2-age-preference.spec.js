'use strict';

const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';
const PREF_KEY = 'secret-circle-party-preferences-v1';

async function configure(page, ageLevel) {
  await page.goto('/');
  await page.evaluate(({ hub, pref, level }) => {
    localStorage.clear();
    localStorage.setItem(hub, JSON.stringify({
      version: 1, players: ['Aylin', 'Ben', 'Cem', 'Daria'],
      favorites: ['truth-dare'], recent: [], presets: [], history: [], stats: {}
    }));
    localStorage.setItem(pref, JSON.stringify({ version: 1, ageLevel: level, sessionLength: 5 }));
  }, { hub: HUB_KEY, pref: PREF_KEY, level: ageLevel });
}

test('Familienmodus filtert die kanonische Startseite, Empfehlungen und alle sechs Spielwelten', async ({ page }) => {
  await configure(page, 'family');
  await page.goto('/');
  await expect(page.locator('[data-screen="home"]')).toBeVisible();

  const recommendations = await page.locator('#sections [data-game-id]').evaluateAll(cards =>
    cards.map(card => ({ id: card.dataset.gameId, age: window.SecretCirclePartyCatalog.getGame(card.dataset.gameId).age }))
  );
  expect(recommendations.length).toBeGreaterThan(0);
  expect(recommendations.every(game => game.age === 'all'), JSON.stringify(recommendations)).toBe(true);

  const hero = await page.evaluate(() => {
    const title = document.querySelector('#hero-title').textContent.trim();
    const game = window.SecretCirclePartyCatalog.games.find(entry => entry.title === title);
    return { title, age: game?.age };
  });
  expect(hero.age, hero.title).toBe('all');

  await page.goto('/#spiele');
  const allowed = await page.evaluate(() => window.SecretCirclePartyCatalog.games
    .filter(game => game.status === 'playable' && game.age === 'all').length);
  expect(allowed).toBeGreaterThan(5);
  expect(allowed).toBeLessThan(55);
  await expect(page.locator('#grid .gcard')).toHaveCount(allowed);
  await expect(page.locator('#filters .chip').first()).toHaveText('Alle ' + allowed);
  await expect(page.locator('#grid [data-game-id="truth-dare"]')).toHaveCount(0);
  await expect(page.locator('#grid [data-game-id="charades"]')).toHaveCount(1);

  const visibleAge = await page.locator('#grid [data-game-id]').evaluateAll(cards =>
    cards.every(card => window.SecretCirclePartyCatalog.getGame(card.dataset.gameId).age === 'all')
  );
  expect(visibleAge).toBe(true);
  await page.locator('#q').fill('Wahrheit oder Pflicht');
  await expect(page.locator('#grid .gcard')).toHaveCount(0);
});

test('Direktlink zu einem nicht passenden Spiel sperrt Start, ohne Gruppe oder Einstellungen zu ändern', async ({ page }) => {
  await configure(page, 'family');
  await page.goto('/#spiel=truth-dare');
  await expect(page.locator('[data-screen="mode"]')).toBeVisible();
  await expect(page.locator('#mode-title')).toHaveText('Wahrheit oder Pflicht');
  await expect(page.locator('#players-count')).toHaveText('4/20');
  await expect(page.locator('#start-btn')).toBeDisabled();
  await expect(page.locator('#start-note')).toContainText('gewählten Altersstufe');
  await expect(page.locator('#start-note')).toContainText('Daten & Einstellungen');
  await page.locator('#start-btn').evaluate(button => button.click());
  await expect(page).toHaveURL(/\/#spiel=truth-dare$/);

  await page.goto('/party.html?view=settings');
  await expect(page.locator('#settings-age-level')).toHaveValue('family');
  await page.locator('#settings-age-level').selectOption('all');
  await page.goto('/index.html#spiel=truth-dare');
  await expect(page.locator('#start-btn')).toBeEnabled();
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), HUB_KEY);
  expect(saved.players).toEqual(['Aylin', 'Ben', 'Cem', 'Daria']);
  expect(saved.favorites).toEqual(['truth-dare']);
});

test('V2-Legacyalias übernimmt die gespeicherte Familienauswahl; ohne Präferenz bleiben alle 55 sichtbar', async ({ page }) => {
  await configure(page, 'family');
  await page.goto('/v2-hub.html#spiel=truth-dare');
  await expect(page.locator('#start-btn')).toBeDisabled();
  await page.goto('/v2-hub.html#spiele');
  const restrictedCount = await page.locator('#grid .gcard').count();
  expect(restrictedCount).toBeLessThan(55);
  await page.evaluate(key => localStorage.removeItem(key), PREF_KEY);
  await page.reload();
  await expect(page.locator('#grid .gcard')).toHaveCount(55);
  await expect(page.locator('#filters .chip').first()).toHaveText('Alle 55');
});
