const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';
const QUICK_KEY = 'secret-circle-party-quick-active-v1';

async function seedHub(page) {
  await page.goto('/party.html');
  await page.evaluate(({ hubKey, quickKey }) => {
    localStorage.setItem(hubKey, JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika', 'Lina'],
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
    localStorage.removeItem(quickKey);
  }, { hubKey: HUB_KEY, quickKey: QUICK_KEY });
}

async function startRapidFire(page) {
  await page.goto('/quick-play.html?game=rapid-fire');
  await page.locator('#quick-rounds').selectOption('3');
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await expect(page.locator('#quick-play')).toBeVisible();
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
}

test('starting again requires confirmation and cancel preserves the same Quick session', async ({ page }) => {
  await seedHub(page);
  const before = await startRapidFire(page);

  await page.reload();
  await expect(page.locator('#quick-resume-box')).toBeVisible();
  await expect(page.locator('#quick-play')).toBeHidden();

  page.once('dialog', dialog => {
    expect(dialog.message()).toContain('gespeicherte Session');
    expect(dialog.message()).toContain('neue Session beginnen');
    dialog.dismiss();
  });
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  const afterCancel = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(afterCancel.sessionId).toBe(before.sessionId);
  expect(afterCancel.gameId).toBe('rapid-fire');
  await expect(page.locator('#quick-play')).toBeHidden();
  await expect(page.locator('#quick-status')).toContainText('bleibt erhalten');

  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await expect(page.locator('#quick-play')).toBeVisible();

  const afterConfirm = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(afterConfirm.gameId).toBe('rapid-fire');
  expect(afterConfirm.sessionId).not.toBe(before.sessionId);
});

test('cross-game start in the same Quick family cannot silently overwrite another game session', async ({ page }) => {
  await seedHub(page);
  const before = await startRapidFire(page);

  await page.goto('/quick-play.html?game=wavelength');
  await expect(page.locator('#quick-resume-box')).toBeHidden();

  page.once('dialog', dialog => {
    expect(dialog.message()).toContain('Rapid');
    expect(dialog.message()).toContain('Spektrum');
    dialog.dismiss();
  });
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  const preserved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(preserved.sessionId).toBe(before.sessionId);
  expect(preserved.gameId).toBe('rapid-fire');
  await expect(page.locator('#quick-play')).toBeHidden();

  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Spiel starten' }).click();
  await expect(page.locator('#quick-play')).toBeVisible();

  const replaced = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(replaced.gameId).toBe('wavelength');
  expect(replaced.sessionId).not.toBe(before.sessionId);
});

test('failed replacement write reloads fail-closed and preserves the previous stored session', async ({ page }) => {
  await seedHub(page);
  const before = await startRapidFire(page);

  await page.reload();
  await expect(page.locator('#quick-resume-box')).toBeVisible();

  await page.evaluate(key => {
    const original = Storage.prototype.setItem;
    let failed = false;
    Storage.prototype.setItem = function patchedSetItem(name, value) {
      if (this === localStorage && name === key && !failed) {
        failed = true;
        throw new DOMException('simulated quota failure', 'QuotaExceededError');
      }
      return original.call(this, name, value);
    };
  }, QUICK_KEY);

  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  await expect(page.locator('#quick-status')).toContainText('Die neue Session konnte nicht gespeichert werden');
  await expect(page.locator('#quick-resume-box')).toBeVisible();
  await expect(page.locator('#quick-play')).toBeHidden();

  const preserved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), QUICK_KEY);
  expect(preserved.gameId).toBe('rapid-fire');
  expect(preserved.sessionId).toBe(before.sessionId);
});
