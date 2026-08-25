const { test, expect } = require('@playwright/test');

async function streamText(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

function replacementBackup(players = ['Aylin', 'Ben', 'Cem', 'Daria']) {
  return {
    format: 'secret-circle-complete-backup',
    version: 1,
    exportedAt: new Date().toISOString(),
    entries: {
      'secret-circle-party-hub-v1': JSON.stringify({
        version: 1,
        players,
        favorites: ['mafia'],
        recent: ['mafia'],
        presets: [],
        history: [],
        stats: {}
      }),
      'secret-circle-party-preferences-v1': JSON.stringify({ version: 1, ageLevel: 'family', sessionLength: 10 }),
      'secret-circle-party-custom-packs-v1': JSON.stringify({
        version: 1,
        packs: [{
          id: 'imported-pack',
          gameId: 'word-chain',
          name: 'Importiert',
          items: ['Solar', 'Rakete', 'Energie'],
          createdAt: new Date().toISOString()
        }]
      })
    }
  };
}

test.beforeEach(async ({ page }) => {
  await page.goto('/party.html');
  await page.evaluate(() => {
    [...Array(localStorage.length)].map((_, index) => localStorage.key(index)).filter(Boolean)
      .filter(key => key.startsWith('secret-circle-'))
      .forEach(key => localStorage.removeItem(key));
    localStorage.setItem('secret-circle-party-hub-v1', JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika'],
      favorites: ['charades'],
      recent: [],
      presets: [],
      history: [],
      stats: {}
    }));
    localStorage.setItem('secret-circle-party-custom-packs-v1', JSON.stringify({
      version: 1,
      packs: [{
        id: 'test-pack',
        gameId: 'charades',
        name: 'Eigene Runde',
        items: ['Pinguin', 'Raumstation', 'Kaffeetasse'],
        createdAt: new Date().toISOString()
      }]
    }));
    localStorage.setItem('secret-circle-settings-v7', JSON.stringify({ duration: 3 }));
  });
  await page.reload();
  await page.getByRole('button', { name: 'Daten' }).click();
});

test('complete backup exports Hub custom packs and Word Imposter local data together', async ({ page }) => {
  const api = await page.evaluate(() => ({
    version: window.SecretCirclePartyDataTools?.version,
    bytes: window.SecretCirclePartyDataTools?.byteLength('ä')
  }));
  expect(api).toEqual({ version: 6, bytes: 2 });

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Alles exportieren' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^secret-circle-backup-\d{4}-\d{2}-\d{2}\.json$/);
  const stream = await download.createReadStream();
  expect(stream).not.toBeNull();
  const text = await streamText(stream);
  const payload = JSON.parse(text);
  expect(payload.format).toBe('secret-circle-complete-backup');
  expect(payload.version).toBe(1);
  expect(payload.entries['secret-circle-party-hub-v1']).toContain('charades');
  expect(payload.entries['secret-circle-party-custom-packs-v1']).toContain('Eigene Runde');
  expect(payload.entries['secret-circle-settings-v7']).toContain('duration');
});

test('complete backup import replaces managed Secret Circle data and reloads safely', async ({ page }) => {
  const reloaded = page.waitForEvent('load');
  await page.locator('#hub-import-data').setInputFiles({
    name: 'secret-circle-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(replacementBackup()))
  });
  await reloaded;
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-hub-v1')).players.join(',')))
    .toBe('Aylin,Ben,Cem,Daria');
  await page.getByRole('button', { name: 'Spieler' }).click();
  await expect(page.locator('#hub-players')).toHaveValue('Aylin\nBen\nCem\nDaria');
  await page.getByRole('button', { name: 'Favoriten' }).click();
  await expect(page.locator('#favorites-grid')).toContainText('Mafia');
  await page.getByRole('button', { name: 'Daten' }).click();
  await expect(page.locator('#default-session-length')).toHaveValue('10');
  await expect(page.locator('#settings-age-level')).toHaveValue('family');
  await expect(page.locator('#custom-pack-list')).toContainText('Importiert');
  await expect(page.locator('#custom-pack-list')).toContainText('Wortkette');
});

test('complete backup import preserves unknown future Secret Circle namespaces', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('secret-circle-future-feature-v99', JSON.stringify({ version: 99, keep: 'future-data' }));
  });

  const reloaded = page.waitForEvent('load');
  await page.locator('#hub-import-data').setInputFiles({
    name: 'older-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(replacementBackup()))
  });
  await reloaded;

  const result = await page.evaluate(() => ({
    future: JSON.parse(localStorage.getItem('secret-circle-future-feature-v99')),
    players: JSON.parse(localStorage.getItem('secret-circle-party-hub-v1')).players
  }));
  expect(result.future).toEqual({ version: 99, keep: 'future-data' });
  expect(result.players).toEqual(['Aylin', 'Ben', 'Cem', 'Daria']);
});

test('invalid import is rejected without destroying existing local data', async ({ page }) => {
  await page.locator('#hub-import-data').setInputFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ format: 'unknown', entries: {} }))
  });
  await expect(page.locator('#hub-status')).toContainText('entspricht nicht dem Schema');
  const snapshot = await page.evaluate(() => ({
    players: JSON.parse(localStorage.getItem('secret-circle-party-hub-v1')).players,
    custom: JSON.parse(localStorage.getItem('secret-circle-party-custom-packs-v1')).packs[0].name
  }));
  expect(snapshot.players).toEqual(['Alex', 'Sam', 'Mika']);
  expect(snapshot.custom).toBe('Eigene Runde');
});

test('plain text in an allowed storage key is rejected before mutation', async ({ page }) => {
  const malformed = replacementBackup();
  malformed.entries['secret-circle-party-hub-v1'] = 'not-json';

  await page.locator('#hub-import-data').setInputFiles({
    name: 'malformed-managed-value.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(malformed))
  });
  await expect(page.locator('#hub-status')).toContainText('Ungültiges JSON für secret-circle-party-hub-v1');

  const snapshot = await page.evaluate(() => ({
    players: JSON.parse(localStorage.getItem('secret-circle-party-hub-v1')).players,
    custom: JSON.parse(localStorage.getItem('secret-circle-party-custom-packs-v1')).packs[0].name
  }));
  expect(snapshot.players).toEqual(['Alex', 'Sam', 'Mika']);
  expect(snapshot.custom).toBe('Eigene Runde');
});

test('primitive JSON in an allowed storage key is rejected before mutation', async ({ page }) => {
  const malformed = replacementBackup();
  malformed.entries['secret-circle-party-hub-v1'] = JSON.stringify('not-an-object');

  await page.locator('#hub-import-data').setInputFiles({
    name: 'primitive-managed-value.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(malformed))
  });
  await expect(page.locator('#hub-status')).toContainText('Ungültige Datenstruktur für secret-circle-party-hub-v1');
  const players = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-hub-v1')).players);
  expect(players).toEqual(['Alex', 'Sam', 'Mika']);
});

test('multibyte backup over the byte limit is rejected before changing data', async ({ page }) => {
  const oversized = {
    format: 'secret-circle-complete-backup',
    version: 1,
    exportedAt: new Date().toISOString(),
    entries: {
      'secret-circle-oversized-v1': 'ä'.repeat(760_000)
    }
  };
  const buffer = Buffer.from(JSON.stringify(oversized));
  expect(buffer.byteLength).toBeGreaterThan(1_500_000);

  await page.locator('#hub-import-data').setInputFiles({
    name: 'oversized.json',
    mimeType: 'application/json',
    buffer
  });
  await expect(page.locator('#hub-status')).toContainText('größer als 1,5 MB');
  const players = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-hub-v1')).players);
  expect(players).toEqual(['Alex', 'Sam', 'Mika']);
});

test('failed import write rolls back every previous managed local entry', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('secret-circle-future-feature-v99', JSON.stringify({ keep: true }));
    const original = Storage.prototype.setItem;
    let failed = false;
    Storage.prototype.setItem = function setItem(key, value) {
      if (!failed && key === 'secret-circle-party-hub-v1' && String(value).includes('NeuImport')) {
        failed = true;
        throw new DOMException('simulierter Importfehler', 'QuotaExceededError');
      }
      return original.call(this, key, value);
    };
  });

  await page.locator('#hub-import-data').setInputFiles({
    name: 'rollback.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(replacementBackup(['NeuImport', 'Ben', 'Cem'])))
  });
  await expect(page.locator('#hub-status')).toContainText('alte Daten wiederhergestellt');
  const snapshot = await page.evaluate(() => ({
    players: JSON.parse(localStorage.getItem('secret-circle-party-hub-v1')).players,
    custom: JSON.parse(localStorage.getItem('secret-circle-party-custom-packs-v1')).packs[0].name,
    settings: JSON.parse(localStorage.getItem('secret-circle-settings-v7')).duration,
    future: JSON.parse(localStorage.getItem('secret-circle-future-feature-v99')).keep
  }));
  expect(snapshot).toEqual({ players: ['Alex', 'Sam', 'Mika'], custom: 'Eigene Runde', settings: 3, future: true });
});

test('failed deletion rolls back instead of leaving partial local data', async ({ page }) => {
  await page.evaluate(() => {
    const original = Storage.prototype.removeItem;
    let failed = false;
    Storage.prototype.removeItem = function removeItem(key) {
      if (!failed && key === 'secret-circle-party-custom-packs-v1') {
        failed = true;
        throw new DOMException('simulierter Löschfehler', 'InvalidStateError');
      }
      return original.call(this, key);
    };
  });
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Alle lokalen Daten löschen' }).click();
  await expect(page.locator('#hub-status')).toContainText('Datenlöschung abgebrochen');
  const snapshot = await page.evaluate(() => ({
    hub: Boolean(localStorage.getItem('secret-circle-party-hub-v1')),
    custom: Boolean(localStorage.getItem('secret-circle-party-custom-packs-v1')),
    settings: Boolean(localStorage.getItem('secret-circle-settings-v7'))
  }));
  expect(snapshot).toEqual({ hub: true, custom: true, settings: true });
});

test('complete deletion removes Hub custom packs Imposter preferences active sessions and unknown Secret Circle namespaces', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('secret-circle-party-active-v1', JSON.stringify({ version: 2 }));
    localStorage.setItem('secret-circle-custom-v7', JSON.stringify([{ name: 'Test' }]));
    localStorage.setItem('secret-circle-future-feature-v99', JSON.stringify({ keep: false }));
  });
  page.once('dialog', dialog => dialog.accept());
  const reloaded = page.waitForEvent('load');
  await page.getByRole('button', { name: 'Alle lokalen Daten löschen' }).click();
  await reloaded;
  await expect.poll(() => page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('secret-circle-')).length)).toBe(0);
});
