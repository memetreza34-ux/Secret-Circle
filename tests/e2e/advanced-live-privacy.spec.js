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

async function start(page, gameId) {
  await page.goto(`/advanced.html?game=${gameId}`);
  await page.locator('#advanced-length').selectOption('3');
  await page.locator('#advanced-start').click();
  await expect(page.locator('#advanced-play-layer')).toBeVisible();
}

async function expectProtectedAfterBlur(page, message) {
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await expect(page.locator('#play-player')).toBeHidden();
  await expect(page.locator('#play-content')).toBeHidden();
  await expect(page.locator('#play-options')).toBeHidden();
  await expect(page.locator('#play-actions')).toBeHidden();
  await expect(page.locator('#advanced-private-cover')).toBeVisible();
  await expect(page.locator('#advanced-private-cover')).toContainText(message);
}

for (const scenario of [
  {
    gameId: 'question-imposter',
    open: 'Meine Frage anzeigen',
    close: 'Frage verdecken und weitergeben',
    message: 'geheime Frage'
  },
  {
    gameId: 'location-spy',
    open: 'Karte anzeigen',
    close: 'Karte schließen und weitergeben',
    message: 'geheime Ortskarte'
  },
  {
    gameId: 'mafia',
    open: 'Meine Rolle anzeigen',
    close: 'Rolle schließen und weitergeben',
    message: 'geheime Rolle'
  }
]) {
  test(`${scenario.gameId} conceals an opened secret on app focus loss`, async ({ page }) => {
    await seedPlayers(page);
    await start(page, scenario.gameId);
    await page.getByRole('button', { name: scenario.open }).click();
    await expect(page.getByRole('button', { name: scenario.close })).toBeVisible();
    const secretBefore = (await page.locator('#play-content').textContent()) || '';
    expect(secretBefore.trim().length).toBeGreaterThan(0);

    await expectProtectedAfterBlur(page, scenario.message);
    await page.getByRole('button', { name: 'Geschützten Inhalt wieder anzeigen' }).click();

    await expect(page.locator('#advanced-private-cover')).toHaveCount(0);
    await expect(page.locator('#play-content')).toBeVisible();
    await expect(page.locator('#play-content')).toHaveText(secretBefore);
    await expect(page.getByRole('button', { name: scenario.close })).toBeVisible();
  });
}

test('Two Truths private composition is concealed without losing typed input', async ({ page }) => {
  await seedPlayers(page);
  await start(page, 'two-truths');

  const first = page.locator('#play-content input').first();
  await first.fill('Ich kann jonglieren');
  await expect(page.locator('#play-eyebrow')).toContainText('private Eingabe');

  await expectProtectedAfterBlur(page, 'private Eingabe');
  await page.getByRole('button', { name: 'Geschützten Inhalt wieder anzeigen' }).click();

  await expect(first).toBeVisible();
  await expect(first).toHaveValue('Ich kann jonglieren');
});

test('Mafia moderator overview is concealed on app focus loss', async ({ page }) => {
  await seedPlayers(page);
  await start(page, 'mafia');

  for (let index = 0; index < PLAYERS.length; index += 1) {
    await page.getByRole('button', { name: 'Meine Rolle anzeigen' }).click();
    await page.getByRole('button', { name: 'Rolle schließen und weitergeben' }).click();
  }

  await expect(page.getByRole('button', { name: 'Moderatorübersicht öffnen' })).toBeVisible();
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Moderatorübersicht öffnen' }).click();
  await expect(page.locator('.role-overview')).toBeVisible();

  await expectProtectedAfterBlur(page, 'Moderatorübersicht');
  await page.getByRole('button', { name: 'Geschützten Inhalt wieder anzeigen' }).click();
  await expect(page.locator('.role-overview')).toBeVisible();
});
