'use strict';

const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';

test('neues Gerät: keine fiktiven Spieler, erste Gruppe wird bewusst eingerichtet', async ({ page }) => {
  await page.goto('/package.json');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/');

  await expect(page.locator('[data-screen="home"]')).toBeVisible();
  await expect(page.locator('#hero-play')).toHaveText('Spieler einrichten');
  await expect(page.locator('#hero-title')).not.toBeEmpty();
  expect(await page.evaluate(key => localStorage.getItem(key), HUB_KEY)).toBeNull();

  await page.locator('#hero-play').click();
  await expect(page.locator('[data-screen="players"]')).toBeVisible();
  await expect(page.locator('#player-badge')).toHaveText('0/20');
  await page.locator('#player-input').fill('Aylin');
  await page.locator('#player-add').click();
  await page.locator('#player-input').fill('Ben');
  await page.locator('#player-add').click();
  await page.locator('#player-input').fill('Cem');
  await page.locator('#player-add').click();

  const names = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).players, HUB_KEY);
  expect(names).toEqual(['Aylin', 'Ben', 'Cem']);

  // Der Spieler-Screen hat bewusst keine Tabbar; über den kanonischen Root zurückgehen.
  await page.goto('/');
  await expect(page.locator('#hero-play')).toHaveText('Spielen');
  await page.goto('/#spiel=never-have');
  await expect(page.locator('#start-btn')).toBeEnabled();
  await page.locator('#start-btn').click();
  await expect(page.locator('#play-layer')).toBeVisible();
  // „Ich hab noch nie“ ist ein Gruppenspiel ohne aktiven Einzelspieler.
  // Der Spielstand muss dennoch die tatsächlich eingerichteten Personen nutzen.
  const active = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-hub-active-v1')));
  expect(active.session.gameId).toBe('never-have');
  expect(active.session.players).toEqual(['Aylin', 'Ben', 'Cem']);

  await page.goto('/#spieler');
  await expect(page.locator('#player-badge')).toHaveText('3/20');
  await expect(page.getByRole('textbox', { name: 'Spieler 1' })).toHaveValue('Aylin');
});

test('ohne gespeicherte Gruppe bleiben Spieleinstieg und Smart Party Night gesperrt', async ({ page }) => {
  await page.goto('/package.json');
  await page.evaluate(() => localStorage.clear());
  await page.goto('/#spiel=never-have');
  await expect(page.locator('#players-count')).toHaveText(/0\//);
  await expect(page.locator('#start-btn')).toBeDisabled();
  await expect(page.locator('#start-note')).toContainText('fehlen noch');

  await page.goto('/party.html');
  await expect(page.locator('#party-night-player-count')).toHaveText('0');
  await page.getByRole('button', { name: 'Plan erstellen' }).click();
  await expect(page.locator('#party-night-status')).toContainText('Speichere zuerst mindestens zwei Personen');
  expect(await page.evaluate(() => localStorage.getItem('secret-circle-party-night-v1'))).toBeNull();
  await page.locator('#quick-start').click();
  await expect(page.locator('#view-players')).toBeVisible();
  await expect(page.locator('#hub-players')).toHaveValue('');

  await page.goto('/party.html?play=never-have&from=v2');
  await expect(page).toHaveURL(/v2-hub\.html#spieler$/);
  await expect(page.locator('[data-screen="players"]')).toBeVisible();

  await page.goto('/word-imposter.html');
  await expect(page.locator('#players')).toHaveValue('');
  await expect(page.locator('#start')).toBeDisabled();
});

test('vorhandene echte oder frühere Beispielgruppen bleiben ohne Datenmigration erhalten', async ({ page }) => {
  await page.goto('/package.json');
  await page.evaluate(key => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({
      version: 1, players: ['Alex', 'Sam', 'Mika', 'Lina'],
      favorites: ['charades'], recent: [], presets: [], history: [], stats: {}
    }));
  }, HUB_KEY);

  await page.goto('/#spiel=never-have');
  await expect(page.locator('#players-count')).toHaveText('4/20');
  await expect(page.locator('#start-btn')).toBeEnabled();
  await page.goto('/#spieler');
  await expect(page.getByRole('textbox', { name: 'Spieler 1' })).toHaveValue('Alex');
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), HUB_KEY);
  expect(saved.favorites).toEqual(['charades']);
  expect(saved.players).toEqual(['Alex', 'Sam', 'Mika', 'Lina']);
  await page.goto('/word-imposter.html');
  await expect(page.locator('#players')).toHaveValue('Alex\nSam\nMika\nLina');
  await expect(page.locator('#start')).toBeEnabled();
});
