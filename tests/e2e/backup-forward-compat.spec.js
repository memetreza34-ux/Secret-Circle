const { test, expect } = require('@playwright/test');

const HUB_V1 = 'secret-circle-party-hub-v1';
const HUB_V2 = 'secret-circle-party-hub-v2';
const FUTURE_KEY = 'secret-circle-party-future-feature-v99';

function completeBackup(entries) {
  return {
    format: 'secret-circle-complete-backup',
    version: 1,
    exportedAt: new Date().toISOString(),
    entries
  };
}

async function openDataView(page) {
  await page.goto('/party.html');
  await page.evaluate(({ hubV1, hubV2, futureKey }) => {
    [...Array(localStorage.length)].map((_, index) => localStorage.key(index)).filter(Boolean)
      .filter(key => key.startsWith('secret-circle-'))
      .forEach(key => localStorage.removeItem(key));
    localStorage.setItem(hubV1, JSON.stringify({
      version: 1,
      players: ['Alt', 'Stand', 'Eins'],
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
    localStorage.setItem(hubV2, JSON.stringify({ version: 2, future: 'hub-v2-must-survive' }));
    localStorage.setItem(futureKey, JSON.stringify({ version: 99, future: 'namespace-must-survive' }));
  }, { hubV1: HUB_V1, hubV2: HUB_V2, futureKey: FUTURE_KEY });
  await page.reload();
  await page.getByRole('button', { name: 'Daten' }).click();
}

test('v51 older complete restore preserves future party namespace and future version of a known key', async ({ page }) => {
  await openDataView(page);

  const reloaded = page.waitForEvent('load');
  await page.locator('#hub-import-data').setInputFiles({
    name: 'current-v1-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(completeBackup({
      [HUB_V1]: JSON.stringify({
        version: 1,
        players: ['Neu', 'Import', 'Stand'],
        favorites: [], recent: [], presets: [], history: [], stats: {}
      })
    })))
  });
  await reloaded;

  const result = await page.evaluate(({ hubV1, hubV2, futureKey }) => ({
    current: JSON.parse(localStorage.getItem(hubV1)),
    futureVersion: JSON.parse(localStorage.getItem(hubV2)),
    futureNamespace: JSON.parse(localStorage.getItem(futureKey))
  }), { hubV1: HUB_V1, hubV2: HUB_V2, futureKey: FUTURE_KEY });

  expect(result.current.players).toEqual(['Neu', 'Import', 'Stand']);
  expect(result.futureVersion).toEqual({ version: 2, future: 'hub-v2-must-survive' });
  expect(result.futureNamespace).toEqual({ version: 99, future: 'namespace-must-survive' });
});

test('v51 rejects a backup that tries to write a future storage version', async ({ page }) => {
  await openDataView(page);

  await page.locator('#hub-import-data').setInputFiles({
    name: 'future-version-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(completeBackup({
      [HUB_V2]: JSON.stringify({ version: 2, future: 'attacker-or-newer-backup' })
    })))
  });

  await expect(page.locator('#hub-status')).toContainText(`Nicht unterstützter Speicherschlüssel: ${HUB_V2}`);
  const result = await page.evaluate(({ hubV1, hubV2 }) => ({
    current: JSON.parse(localStorage.getItem(hubV1)),
    future: JSON.parse(localStorage.getItem(hubV2))
  }), { hubV1: HUB_V1, hubV2: HUB_V2 });

  expect(result.current.players).toEqual(['Alt', 'Stand', 'Eins']);
  expect(result.future).toEqual({ version: 2, future: 'hub-v2-must-survive' });
});
