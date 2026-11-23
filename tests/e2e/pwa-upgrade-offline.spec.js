const { test, expect } = require('@playwright/test');
const { snapshot, startServer } = require('../helpers/release-server.js');
const HUB = 'secret-circle-party-hub-v1';
const ACTIVE = 'secret-circle-party-quick-active-v1';
const PLAYERS = ['Alex', 'Sam', 'Mika', 'Lina'];
const BASELINES = require('../fixtures/pwa-baselines.json');
const GAMES = [
  { id: 'draw-guess', selector: '#quick-content .challenge-card', show: 'Karte anzeigen', oldPhase: 'card' },
  { id: 'wavelength', selector: '.spectrum-card strong', show: 'Ziel anzeigen', oldPhase: 'ready' }
];
test.skip(({ browserName }) => browserName !== 'chromium', 'Echte Service-Worker-/Offline-Prüfung benötigt Chromium; WebKit-Geräteprüfung bleibt separat.');

async function begin(page, server, game) {
  await page.goto(server.origin + '/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await page.evaluate(({ key, players }) => localStorage.setItem(key, JSON.stringify({
    version: 1, players, favorites: [], recent: [], presets: [], history: [], stats: {}
  })), { key: HUB, players: PLAYERS });
  await page.goto(server.origin + '/quick-play.html?game=' + game.id);
  await page.locator('#quick-rounds').selectOption('3');
  await page.locator('#quick-start').click();
  if (game.id === 'draw-guess') await page.getByRole('button', { name: game.show, exact: true }).click();
  const secret = await page.locator(game.selector).textContent();
  expect(secret.trim()).not.toBe('');
  const state = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE);
  expect(state.phase).toBe(game.oldPhase);
  expect(typeof state.sessionId).toBe('string');
  return { state, secret };
}

async function activate(page, server, current, previous, game, before) {
  await expect(page.getByRole('button', { name: 'Jetzt aktualisieren', exact: true })).toBeVisible();
  await expect(page.locator(game.selector)).toHaveText(before.secret);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).sessionId, ACTIVE)).toBe(before.state.sessionId);
  const reloaded = page.waitForNavigation({ waitUntil: 'load' });
  await page.getByRole('button', { name: 'Jetzt aktualisieren', exact: true }).click();
  await reloaded;
  await page.getByRole('button', { name: 'Fortsetzen', exact: true }).click();
  await expect(page.locator(game.selector)).toHaveCount(0);
  await expect(page.locator('#quick-content')).not.toContainText(before.secret);
  const after = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE);
  expect(after.sessionId).toBe(before.state.sessionId);
  expect(after.round).toBe(before.state.round);
  expect(after.totalScore).toBe(before.state.totalScore);
  expect(after.phase).toBe('ready');
  if (game.id === 'draw-guess') expect(after.current).toEqual(before.state.current);
  else {
    expect(after.current.target).toBe(before.state.current.target);
    expect(after.current.spectrum).toEqual(before.state.current.spectrum);
    expect(after.current.targetShown).toBe(false);
  }
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).players, HUB)).toEqual(PLAYERS);
  await expect.poll(() => page.evaluate(() => caches.keys())).toEqual([current.manifest.cache]);
  expect(current.manifest.cache).not.toBe(previous.manifest.cache);
  await page.getByRole('button', { name: game.show, exact: true }).click();
  await expect(page.locator(game.selector)).toHaveText(before.secret);
}

for (const baseline of BASELINES) for (const game of GAMES) {
  test(`${baseline.label} → aktuell: ${game.id} bleibt nach Update und Offline-Neustart dieselbe verdeckte Partie`, async ({ page, context }) => {
    const previous = snapshot(baseline.ref);
    const current = snapshot('--current');
    const server = await startServer(previous);
    try {
      const before = await begin(page, server, game);
      expect(await page.evaluate(() => caches.keys())).toContain(previous.manifest.cache);
      server.use(current);
      await page.evaluate(async () => { const registration = await navigator.serviceWorker.getRegistration(); await registration.update(); });
      await activate(page, server, current, previous, game, before);
      await context.setOffline(true);
      await page.reload();
      await page.getByRole('button', { name: 'Fortsetzen', exact: true }).click();
      await expect(page.locator(game.selector)).toHaveCount(0);
      await page.getByRole('button', { name: game.show, exact: true }).click();
      await expect(page.locator(game.selector)).toHaveText(before.secret);
      expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).history, HUB)).toEqual([]);
    } finally { await server.close(); }
  });
}

test('fehlgeschlagene Cache-Installation erhält die alte Partie; erneuter Versuch lässt sich bewusst übernehmen', async ({ page }) => {
  const previous = snapshot(BASELINES[1].ref);
  const current = snapshot('--current');
  const server = await startServer(previous);
  const game = GAMES[0];
  try {
    const before = await begin(page, server, game);
    server.use(current);
    server.block('icon-512.png');
    const result = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      const failed = new Promise(resolve => registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker.addEventListener('statechange', () => { if (worker.state === 'redundant') resolve(true); });
      }, { once: true }));
      await registration.update();
      return failed;
    });
    expect(result).toBe(true);
    await expect(page.locator(game.selector)).toHaveText(before.secret);
    expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).sessionId, ACTIVE)).toBe(before.state.sessionId);
    const cachesAfterFailure = await page.evaluate(() => caches.keys());
    expect(cachesAfterFailure).toContain(previous.manifest.cache);
    expect(cachesAfterFailure).not.toContain(current.manifest.cache);
    server.block(null);
    await page.evaluate(async () => { const registration = await navigator.serviceWorker.getRegistration(); await registration.update(); });
    await activate(page, server, current, previous, game, before);
  } finally { await server.close(); }
});
