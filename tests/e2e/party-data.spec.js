const { test, expect } = require('@playwright/test');

async function streamText(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
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
    localStorage.setItem('secret-circle-settings-v7', JSON.stringify({ duration: 3 }));
  });
  await page.reload();
  await page.getByRole('button', { name: 'Daten' }).click();
});

test('complete backup exports Hub and Word Imposter local data together', async ({ page }) => {
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Alles exportieren' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^secret-circle-backup-\d{4}-\d{2}-\d{2}\.json$/);
  const text = await streamText(await download.createReadStream());
  const payload = JSON.parse(text);
  expect(payload.format).toBe('secret-circle-complete-backup');
  expect(payload.version).toBe(1);
  expect(payload.entries['secret-circle-party-hub-v1']).toContain('charades');
  expect(payload.entries['secret-circle-settings-v7']).toContain('duration');
});

test('complete backup import replaces Secret Circle data and reloads safely', async ({ page }) => {
  const replacement = {
    format: 'secret-circle-complete-backup',
    version: 1,
    exportedAt: new Date().toISOString(),
    entries: {
      'secret-circle-party-hub-v1': JSON.stringify({
        version: 1,
        players: ['Aylin', 'Ben', 'Cem', 'Daria'],
        favorites: ['mafia'],
        recent: ['mafia'],
        presets: [],
        history: [],
        stats: {}
      }),
      'secret-circle-party-preferences-v1': JSON.stringify({ version: 1, ageLevel: 'family', sessionLength: 10 })
    }
  };

  await page.locator('#hub-import-data').setInputFiles({
    name: 'secret-circle-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(replacement))
  });
  await page.waitForLoadState('load');
  await page.getByRole('button', { name: 'Spieler' }).click();
  await expect(page.locator('#hub-players')).toHaveValue('Aylin\nBen\nCem\nDaria');
  await page.getByRole('button', { name: 'Favoriten' }).click();
  await expect(page.locator('#favorites-grid')).toContainText('Mafia');
  await page.getByRole('button', { name: 'Daten' }).click();
  await expect(page.locator('#default-session-length')).toHaveValue('10');
  await expect(page.locator('#settings-age-level')).toHaveValue('family');
});

test('invalid import is rejected without destroying existing local data', async ({ page }) => {
  await page.locator('#hub-import-data').setInputFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ format: 'unknown', entries: {} }))
  });
  await expect(page.locator('#hub-status')).toContainText('keine unterstützte');
  const players = await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-party-hub-v1')).players);
  expect(players).toEqual(['Alex', 'Sam', 'Mika']);
});

test('complete deletion removes Hub Imposter preferences and active sessions', async ({ page }) => {
  await page.evaluate(() => {
    localStorage.setItem('secret-circle-party-active-v1', JSON.stringify({ version: 1 }));
    localStorage.setItem('secret-circle-custom-v7', JSON.stringify([{ name: 'Test' }]));
  });
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Alle lokalen Daten löschen' }).click();
  await page.waitForLoadState('load');
  const keys = await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('secret-circle-')));
  expect(keys).toEqual([]);
});
