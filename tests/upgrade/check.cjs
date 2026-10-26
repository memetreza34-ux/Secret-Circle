'use strict';
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../../.cache/pwa-upgrade');
const releases = JSON.parse(fs.readFileSync(path.join(root, 'releases.json')));
const current = releases.find(r => r.role === 'target');
const vm = require('node:vm'), content = vm.createContext({});
for (const file of ['word-packs.js', 'word-packs-extra.js']) vm.runInContext(fs.readFileSync(path.join(current.root, file), 'utf8'), content);
const expectedEntries = Object.values(content.SecretCircleContent.words).reduce((sum, words) => sum + words.length, 0);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2' };
const snapshot = page => page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('secret-circle-')).sort().map(k => [k, localStorage.getItem(k)])));
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
async function visible(page, selector) { await page.locator(selector).waitFor({ state: 'visible' }); }
async function poll(page, predicate) {
  const end = Date.now() + 15000;
  while (Date.now() < end) {
    try { if (await page.evaluate(predicate)) return; } catch (error) { if (!/Execution context was destroyed|Cannot find context/.test(error.message)) throw error; }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw Error('Browserzustand wurde nicht rechtzeitig erreicht');
}
async function cacheNames(page) { return page.evaluate(() => caches.keys()); }
async function update(page) {
  return page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    const result = new Promise((resolve, reject) => {
      const deadline = setTimeout(() => reject(Error('Kein abgeschlossener Installationsversuch')), 15000);
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        const changed = () => {
          if (['installed', 'redundant'].includes(worker.state)) { clearTimeout(deadline); resolve(worker.state); }
        };
        worker.addEventListener('statechange', changed); changed();
      }, { once: true });
    });
    await registration.update();
    return result;
  });
}
async function verifyCache(page, release) {
  const expected = Object.fromEntries(release.core.map(p => [p, sha(fs.readFileSync(path.join(release.root, p || 'index.html')))]));
  const actual = await page.evaluate(async ({ name, paths }) => {
    const cache = await caches.open(name), result = {};
    for (const path of paths) {
      const response = await cache.match('./' + path);
      if (!response) { result[path] = null; continue; }
      const digest = await crypto.subtle.digest('SHA-256', await response.arrayBuffer());
      result[path] = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
    }
    return result;
  }, { name: release.cache, paths: Object.keys(expected) });
  assert.deepEqual(actual, expected, 'Jede Offline-Datei muss bytegenau aus der Zielversion kommen');
  return Object.keys(expected).length;
}
async function scenario(browser, old, mobile, interrupted) {
  let served = old, failing = false;
  const name = old.cache.replace('secret-circle-', '') + '-' + (mobile ? 'handy' : 'desktop') + '-' + (interrupted ? 'abbruch' : 'erfolg');
  const server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (failing && pathname === '/card-memory.js') { res.writeHead(503); res.end('Gezielter Installationsabbruch'); return; }
    const filename = path.resolve(served.root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!filename.startsWith(served.root + path.sep) || !fs.existsSync(filename)) { res.writeHead(404); res.end(); return; }
    const data = fs.readFileSync(filename);
    res.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Cache-Control': pathname === '/sw.js' ? 'no-cache' : 'public, max-age=3600', 'Content-Length': data.length }); res.end(data);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  const context = await browser.newContext({ viewport: mobile ? { width: 375, height: 812 } : { width: 1280, height: 900 }, isMobile: mobile, hasTouch: mobile });
  const page = await context.newPage(), errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('dialog', dialog => dialog.accept());
  await context.tracing.start({ screenshots: true, snapshots: true });
  try {
    await page.goto(origin + '/word-imposter.html');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await poll(page, () => Boolean(navigator.serviceWorker.controller));
    assert.deepEqual((await cacheNames(page)).filter(n => /^secret-circle-v\d+$/.test(n)), [old.cache]);
    await verifyCache(page, old);
    await page.evaluate(() => {
      const players = ['Alex', 'Sam', 'Mika'];
      localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({ version: 1, players, favorites: ['truth-dare'], recent: ['truth-dare'], presets: [], history: [{ id: 'qa-update-verlauf', gameId: 'truth-dare', title: 'Wahrheit oder Pflicht', endedAt: '2026-10-25T18:00:00.000Z', rounds: 3, score: 0, players }], stats: {} }));
      localStorage.setItem('secret-circle-party-preferences-v1', JSON.stringify({ version: 1, ageLevel: 'family' }));
    });
    await page.locator('#players').fill('Alex\nSam\nMika');
    await page.locator('#start').click();
    await visible(page, '#reveal-screen');
    await page.getByRole('button', { name: 'Geheime Karte anzeigen', exact: true }).click();
    await visible(page, '#secret');
    const before = await snapshot(page);
    assert.ok(before['secret-circle-active-v7']);
    if (old.cache === 'secret-circle-v119') assert.ok(before['secret-circle-card-memory-v1']);
    served = current;
    if (interrupted) {
      failing = true;
      assert.equal(await update(page), 'redundant');
      assert.ok((await cacheNames(page)).includes(old.cache));
      assert.ok(!(await cacheNames(page)).includes(current.cache));
      assert.deepEqual(await snapshot(page), before);
      await context.setOffline(true);
      await page.reload();
      await visible(page, '#resume-box');
      await page.getByRole('button', { name: 'Fortsetzen', exact: true }).click();
      await visible(page, '#reveal-screen');
      assert.equal(await page.locator('#secret').isVisible(), false);
      assert.deepEqual(await snapshot(page), before);
      await context.setOffline(false); failing = false;
    }
    assert.equal(await update(page), 'installed');
    await visible(page, '.pwa-update-banner');
    assert.equal(await page.locator('#reveal-screen').isVisible(), true, 'Update wartet bis zur Zustimmung');
    assert.deepEqual(await snapshot(page), before);
    assert.ok((await cacheNames(page)).includes(old.cache));
    await page.getByRole('button', { name: 'Jetzt aktualisieren', exact: true }).click();
    await poll(page, () => window.SecretCircleCardMemory?.maximumShared === 16000);
    await visible(page, '#resume-box');
    assert.deepEqual(await snapshot(page), before, 'Update erhält sämtliche gespeicherten Nutzerdaten');
    assert.deepEqual((await cacheNames(page)).filter(n => /^secret-circle-v\d+$/.test(n)), [current.cache]);
    assert.ok(!(await cacheNames(page)).includes(current.cache + '-staging'));
    const verifiedFiles = await verifyCache(page, current);
    await context.setOffline(true);
    await page.reload();
    await visible(page, '#resume-box');
    assert.deepEqual(await snapshot(page), before);
    await page.getByRole('button', { name: 'Fortsetzen', exact: true }).click();
    await visible(page, '#reveal-screen');
    assert.equal(await page.locator('#secret').isVisible(), false);
    assert.deepEqual(await snapshot(page), before, 'Fortsetzen zieht keine neue Karte und verbraucht kein Gedächtnis');
    const count = await page.evaluate(() => Object.values(window.SecretCircleContent.words).reduce((sum, list) => sum + list.length, 0));
    assert.equal(count, expectedEntries);
    await page.goto(origin + '/v2-hub.html#spiele');
    await visible(page, '[data-screen="games"]');
    await page.goto(origin + '/quick-play.html?game=drawing-telephone');
    await page.locator('#quick-start').waitFor({ state: 'visible' });
    await page.locator('#quick-start').click();
    await visible(page, '#quick-play');
    await page.getByRole('button', { name: 'Ich bin bereit', exact: true }).click();
    await visible(page, 'canvas');
    assert.deepEqual(errors, [], 'Keine unerwarteten JavaScript-Fehler');
    await page.screenshot({ path: path.join(root, name + '.png') });
    const result = { name, result: 'PASS', source: old.sha, sourceCache: old.cache, target: current.sha, targetCache: current.cache, viewport: mobile ? '375x812' : '1280x900', interruptedInstall: interrupted, originalStorageKeys: Object.keys(before), storageDigest: sha(JSON.stringify(before)), verifiedTargetFiles: verifiedFiles, offlineWordEntries: count, newClassicOfflinePlayable: true, uncaughtErrors: errors };
    console.log(JSON.stringify(result));
    return result;
  } catch (error) {
    await page.screenshot({ path: path.join(root, name + '-fehler.png') }).catch(() => {});
    console.error(name + ': ' + error.stack); throw error;
  } finally {
    await context.tracing.stop({ path: path.join(root, name + '-trace.zip') }).catch(() => {});
    await context.close(); server.closeAllConnections(); await new Promise(resolve => server.close(resolve));
  }
}
(async () => {
  const browser = await chromium.launch();
  const results = [];
  const resultFile = path.join(root, process.argv[2] ? 'probe.json' : 'ergebnis.json');
  fs.rmSync(resultFile, { force: true });
  try {
    for (const old of releases.filter(r => r.role === 'baseline')) for (const mobile of [false, true]) for (const interrupted of [false, true]) {
      const name = old.cache.replace('secret-circle-', '') + '-' + (mobile ? 'handy' : 'desktop') + '-' + (interrupted ? 'abbruch' : 'erfolg');
      if (process.argv[2] && process.argv[2] !== name) continue;
      results.push(await scenario(browser, old, mobile, interrupted));
    }
    assert.ok(results.length, 'Kein definierter Testfall ausgewählt');
    fs.writeFileSync(resultFile, JSON.stringify({ at: new Date().toISOString(), browser: await browser.version(), results }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
