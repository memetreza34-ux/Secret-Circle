'use strict';
const { test, expect } = require('@playwright/test');
const HUB = 'secret-circle-party-hub-v1', ACTIVE = 'secret-circle-active-v7', MEMORY = 'secret-circle-card-memory-v1';
async function seed(page, players = []) {
  await page.goto('/');
  await page.evaluate(({ key, players }) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({ version: 1, players, favorites: ['truth-dare'], recent: [], presets: [], history: [], stats: {} }));
  }, { key: HUB, players });
}
async function add(page, name) {
  await page.locator('#add-player').click();
  await page.locator('#player-list input').last().fill(name);
}
const group = page => page.evaluate(key => JSON.parse(localStorage.getItem(key)).players, HUB);

test('Katalog führt ohne getrennte Spielerliste direkt zur einzigen Einrichtung und ersten Übergabe', async ({ page }) => {
  await seed(page);
  await page.goto('/v2-hub.html#spiele');
  await page.locator('#grid [data-game-id="imposter"]').click();
  await expect(page).toHaveURL(/word-imposter\.html\?from=v2$/);
  await expect(page.locator('#start')).toBeDisabled();
  for (const name of ['Alex', 'Sam', 'Mika']) await add(page, name);
  await expect(page.locator('#advanced-settings')).not.toHaveAttribute('open', '');
  await page.locator('#category-open').click();
  await page.locator('.category-row').filter({ has: page.getByText('Tiere', { exact: true }) }).click();
  await expect(page.locator('#category-value')).toHaveText('Tiere');
  await expect(page.locator('#start')).toBeEnabled();
  const url = page.url();
  await page.locator('#start').click();
  await expect(page.locator('#reveal-screen')).toBeVisible();
  await expect(page.locator('#secret')).toBeHidden();
  expect(page.url()).toBe(url);
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE);
  expect(saved.players).toEqual(['Alex', 'Sam', 'Mika']); expect(saved.category).toBe('Tiere');
  expect(await group(page)).toEqual(saved.players);
});

test('Unvollständige Gruppe lässt sich ergänzen und absichtlich leere Gruppe bleibt nach Neuladen leer', async ({ page }) => {
  await seed(page, ['Alex', 'Sam']);
  await page.evaluate(() => localStorage.setItem('secret-circle-settings-v7', JSON.stringify({ players: 'Alte\nSpieler\nNamen' })));
  await page.goto('/v2-hub.html#spiel=imposter');
  await expect(page.locator('#player-list input')).toHaveCount(2);
  await expect(page.locator('#start')).toBeDisabled();
  await add(page, 'Mika');
  await expect(page.locator('#start')).toBeEnabled();
  for (const name of ['Mika', 'Sam', 'Alex']) await page.getByRole('button', { name: name + ' entfernen', exact: true }).click();
  expect(await group(page)).toEqual([]);
  await page.reload();
  await expect(page.locator('#player-list input')).toHaveCount(0);
  await expect(page.locator('#start')).toBeDisabled();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).favorites, HUB)).toEqual(['truth-dare']);
});

test('32-Zeichen-Gruppenname bleibt vollständig; zu lange Namen sperren den Start', async ({ page }) => {
  await seed(page, ['A'.repeat(32), 'Sam', 'Mika']);
  await page.goto('/word-imposter.html');
  await expect(page.locator('#player-list input').first()).toHaveValue('A'.repeat(32));
  await expect(page.locator('#start')).toBeEnabled();
  await page.locator('#players').fill('A'.repeat(33) + '\nSam\nMika');
  await expect(page.locator('#start')).toBeDisabled();
  await expect(page.locator('#players-help')).toContainText('32 Zeichen');
  await page.locator('#player-list input').first().fill('Alex');
  await expect(page.locator('#start')).toBeEnabled();
  expect(await group(page)).toEqual(['Alex', 'Sam', 'Mika']);
});

test('Einrichtung ersetzt gespeicherte Partie nur nach Zustimmung; Fortsetzen verbraucht kein Wort', async ({ page }) => {
  await seed(page, ['Alex', 'Sam', 'Mika']);
  await page.goto('/word-imposter.html'); await page.locator('#start').click();
  await page.getByRole('button', { name: 'Geheime Karte anzeigen', exact: true }).click();
  const before = await page.evaluate(keys => keys.map(k => localStorage.getItem(k)), [ACTIVE, MEMORY]);
  await page.goto('/v2-hub.html#spiel=imposter');
  await expect(page.locator('#resume-box')).toBeVisible();
  expect(await page.evaluate(keys => keys.map(k => localStorage.getItem(k)), [ACTIVE, MEMORY])).toEqual(before);
  page.once('dialog', dialog => dialog.dismiss());
  await page.locator('#start').click();
  expect(await page.evaluate(keys => keys.map(k => localStorage.getItem(k)), [ACTIVE, MEMORY])).toEqual(before);
  await page.locator('#resume').click();
  await expect(page.locator('#reveal-screen')).toBeVisible();
  await expect(page.locator('#secret')).toBeHidden();
  expect(await page.evaluate(key => localStorage.getItem(key), MEMORY)).toBe(before[1]);
});

test('Start bleibt bei voller Gruppe sichtbar; kompakte Einrichtung passt auf schmale Bildschirme', async ({ page }) => {
  await seed(page, Array.from({ length: 20 }, (_, i) => 'Person ' + (i + 1)));
  for (const width of [375, 320]) {
    await page.setViewportSize({ width, height: 812 }); await page.goto('/word-imposter.html');
    await expect(page.locator('#start')).toBeEnabled();
    const box = await page.locator('#start').boundingBox();
    expect(box.y).toBeGreaterThan(0); expect(box.y + box.height).toBeLessThanOrEqual(812); expect(box.height).toBeGreaterThanOrEqual(44);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});

test('Empfehlung öffnet die Einrichtung auch ohne gespeicherte Gruppe', async ({ page }) => {
  await seed(page);
  await page.goto('/v2-hub.html');
  await expect(page.locator('#hero-title')).toContainText('Word');
  await page.locator('#hero-play').click();
  await expect(page).toHaveURL(/word-imposter\.html\?from=v2$/);
  await expect(page.locator('#setup-screen')).toBeVisible();
  await expect(page.locator('#start')).toBeDisabled();
  await page.getByRole('link', { name: '← Alle Spiele', exact: true }).click();
  await expect(page).toHaveURL(/v2-hub\.html#spiele$/);
  await expect(page.locator('#grid [data-game-id="imposter"]')).toBeVisible();
});
