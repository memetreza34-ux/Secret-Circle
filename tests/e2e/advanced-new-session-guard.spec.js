const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';
const ACTIVE_KEY = 'secret-circle-party-active-v1';
const PLAYERS = ['Alex', 'Sam', 'Mika', 'Lina', 'Noah', 'Lea', 'Emil', 'Sara'];

async function seedPlayers(page) {
  await page.goto('/party.html');
  await page.evaluate(({ hubKey, activeKey, players }) => {
    localStorage.setItem(hubKey, JSON.stringify({
      version: 1,
      players,
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
    localStorage.removeItem(activeKey);
  }, { hubKey: HUB_KEY, activeKey: ACTIVE_KEY, players: PLAYERS });
}

async function createResumableQuestionSession(page) {
  await page.goto('/advanced.html?game=question-imposter');
  await page.locator('#advanced-length').selectOption('3');
  await page.locator('#advanced-start').click();
  await expect(page.locator('#advanced-play-layer')).toBeVisible();
  const active = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
  expect(active?.session?.id).toBeTruthy();
  await page.goto('/advanced.html?game=question-imposter');
  await expect(page.locator('#advanced-start')).toContainText('Session fortsetzen');
  await expect(page.getByRole('button', { name: 'Neue Session beginnen' })).toBeVisible();
  return active;
}

test('cancelling New Session keeps the existing Advanced resume state untouched', async ({ page }) => {
  await seedPlayers(page);
  const before = await createResumableQuestionSession(page);

  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', { name: 'Neue Session beginnen' }).click();

  await expect(page.locator('#advanced-play-layer')).toBeHidden();
  await expect(page.locator('#advanced-start')).toContainText('Session fortsetzen');
  const after = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
  expect(after.session.id).toBe(before.session.id);
  expect(after.session.advanced).toEqual(before.session.advanced);
});

test('confirmed New Session replaces the old Advanced session only after explicit discard', async ({ page }) => {
  await seedPlayers(page);
  const before = await createResumableQuestionSession(page);

  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Neue Session beginnen' }).click();

  await expect(page.locator('#advanced-play-layer')).toBeVisible();
  const after = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
  expect(after.session.id).toBeTruthy();
  expect(after.session.id).not.toBe(before.session.id);
  expect(after.gameId).toBe('question-imposter');
  expect(after.session.rounds).toBe(0);
});

test('New Session stays fail-closed when the old active marker cannot be removed', async ({ page }) => {
  await seedPlayers(page);
  const before = await createResumableQuestionSession(page);

  await page.evaluate(activeKey => {
    const original = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function patchedRemoveItem(key) {
      if (key === activeKey) throw new Error('simulated remove failure');
      return original.call(this, key);
    };
  }, ACTIVE_KEY);

  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Neue Session beginnen' }).click();

  await expect(page.locator('#advanced-play-layer')).toBeHidden();
  await expect(page.locator('#advanced-status')).toContainText('konnte nicht entfernt werden');
  const after = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
  expect(after.session.id).toBe(before.session.id);
});
