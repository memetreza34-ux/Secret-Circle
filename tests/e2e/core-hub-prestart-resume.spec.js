const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';
const ACTIVE_KEY = 'secret-circle-party-hub-active-v1';

async function seedHub(page) {
  await page.goto('/party.html');
  await page.evaluate(({ hubKey, activeKey }) => {
    localStorage.setItem(hubKey, JSON.stringify({
      version: 1,
      players: ['Alex', 'Sam', 'Mika', 'Lina'],
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
    localStorage.removeItem(activeKey);
  }, { hubKey: HUB_KEY, activeKey: ACTIVE_KEY });
  await page.reload();
}

async function startGame(page, gameId) {
  await page.locator('#browse-games').click();
  await page.locator(`[data-open-game="${gameId}"]`).first().click();
  await expect(page.locator('#game-detail')).toBeVisible();
  await page.locator('#start-selected-game').click();
  await expect(page.locator('#play-layer')).toBeVisible();
}

async function activeState(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
}

test('Hot Potato keeps the same pre-start prompt across reload and hands it to the timer snapshot', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'hot-potato');

  const prompt = (await page.locator('#play-content').textContent())?.trim();
  expect(prompt).toBeTruthy();
  const before = await activeState(page);
  expect(before.session.timer).toBeNull();
  expect(before.session.current).toMatchObject({ kind: 'hot-potato' });
  expect(before.session.used).toContain(before.session.current.index);

  await page.reload();
  await page.getByRole('button', { name: 'Session fortsetzen' }).click();
  await expect(page.locator('#play-content')).toHaveText(prompt || '');
  const resumed = await activeState(page);
  expect(resumed.session.current).toEqual(before.session.current);
  expect(resumed.session.used).toEqual(before.session.used);

  await page.getByRole('button', { name: 'Zufallstimer starten' }).click();
  const running = await activeState(page);
  expect(running.session.current).toBeNull();
  expect(running.session.timer.kind).toBe('hot-potato');
  expect(running.session.timer.prompt).toBe(prompt);
});

test('Word Chain keeps the same pre-start letter across reload and hands it to the timer snapshot', async ({ page }) => {
  await seedHub(page);
  await startGame(page, 'word-chain');

  const text = (await page.locator('#play-content').textContent()) || '';
  const letter = text.match(/Startbuchstabe:\s*(\S+)/)?.[1];
  expect(letter).toBeTruthy();
  const before = await activeState(page);
  expect(before.session.timer).toBeNull();
  expect(before.session.current).toMatchObject({ kind: 'word-chain' });
  expect(before.session.used).toContain(before.session.current.index);

  await page.reload();
  await page.getByRole('button', { name: 'Session fortsetzen' }).click();
  await expect(page.locator('#play-content')).toContainText(`Startbuchstabe: ${letter}`);
  const resumed = await activeState(page);
  expect(resumed.session.current).toEqual(before.session.current);
  expect(resumed.session.used).toEqual(before.session.used);

  await page.getByRole('button', { name: '30-Sekunden-Runde starten' }).click();
  const running = await activeState(page);
  expect(running.session.current).toBeNull();
  expect(running.session.timer.kind).toBe('word-chain');
  expect(running.session.timer.letter).toBe(letter);
});
