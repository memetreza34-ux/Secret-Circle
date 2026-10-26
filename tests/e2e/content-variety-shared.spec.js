'use strict';
const { test, expect } = require('@playwright/test');
const KEY = 'secret-circle-party-mega-active-v1', MEMORY = 'secret-circle-card-memory-v1';
async function seed(page) {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({ version: 1, players: ['Alex', 'Sam', 'Mika', 'Lina'], favorites: [], recent: [], presets: [], history: [], stats: {} }));
  });
}
async function setup(page, id, pack = 'Alltag') {
  await page.goto('/quick-play.html?game=' + id);
  await expect(page.locator('#quick-start')).toBeEnabled();
  await page.locator('#quick-pack').selectOption(pack);
  await page.locator('#quick-rounds').selectOption('3');
  await page.locator('#quick-start').click();
  await expect(page.locator('#quick-play')).toBeVisible();
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), KEY);
}
async function ready(page) {
  if (await page.locator('#quick-pause').getAttribute('aria-pressed') === 'true') await page.locator('#quick-pause').click();
  await page.getByRole('button', { name: 'Ich bin bereit', exact: true }).click();
}
async function finish(page) {
  await ready(page);
  await page.getByRole('button', { name: 'Beenden & speichern', exact: true }).click();
  await expect(page.locator('#quick-result')).toBeVisible();
}

test('Neue Bildketten vermeiden Wiederholungen auch nach Neustarts; Fortsetzen verbraucht keine Vorlage', async ({ page }) => {
  await seed(page);
  const seen = [];
  for (let i = 0; i < 6; i++) {
    const state = await setup(page, 'drawing-telephone');
    expect(seen).not.toContain(state.current.seed); seen.push(state.current.seed);
    const before = await page.evaluate(key => localStorage.getItem(key), MEMORY);
    await ready(page);
    await page.locator('textarea').fill('Mein lokaler Entwurf');
    await page.reload();
    await page.locator('#quick-resume').click();
    expect(await page.evaluate(key => localStorage.getItem(key), MEMORY)).toBe(before);
    await finish(page);
  }
  expect(new Set(seen).size).toBe(6);
  const raw = await page.evaluate(key => localStorage.getItem(key), MEMORY);
  for (const word of [...seen, 'Mein lokaler Entwurf']) expect(raw).not.toContain(word);
});

test('Neue Drei-Runden-Stapel variieren, vorhandener Stapel bleibt beim Fortsetzen identisch und offline verfügbar', async ({ page, context, browserName }) => {
  test.skip(browserName === 'webkit', 'Playwright-WebKit unterstützt den Service-Worker-Offline-Neustart nicht; Online-Resume deckt party-classics.spec.js ab.');
  await seed(page);
  const first = await setup(page, 'three-rounds');
  await finish(page);
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
    return Boolean(registration.active);
  });
  await context.setOffline(true);
  const second = await setup(page, 'three-rounds');
  for (const word of second.current.deck) expect(first.current.deck).not.toContain(word);
  const before = await page.evaluate(key => localStorage.getItem(key), MEMORY);
  await ready(page);
  await page.reload();
  await page.locator('#quick-resume').click();
  expect((await page.evaluate(key => JSON.parse(localStorage.getItem(key)), KEY)).current.deck).toEqual(second.current.deck);
  expect(await page.evaluate(key => localStorage.getItem(key), MEMORY)).toBe(before);
  await expect(page.locator('#quick-content .challenge-card')).toHaveCount(0);
  await ready(page);
  await expect(page.locator('#quick-content .challenge-card')).not.toBeEmpty();
});
