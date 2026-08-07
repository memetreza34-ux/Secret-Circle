const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';
const ACTIVE_KEY = 'secret-circle-party-active-v1';
const PLAYERS = ['Alex', 'Sam', 'Mika', 'Lina', 'Noah', 'Lea', 'Emil', 'Sara'];

async function seedNight(page) {
  await page.goto('/party.html');
  await page.evaluate(({ hubKey, activeKey, players }) => {
    localStorage.setItem(hubKey, JSON.stringify({
      version: 1,
      players,
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
    localStorage.setItem(activeKey, JSON.stringify({
      version: 2,
      gameId: 'mafia',
      session: {
        id: 'mafia-extended-night-contract',
        gameId: 'mafia',
        players,
        pack: 'Erweitert',
        targetRounds: 3,
        rounds: 0,
        score: 0,
        playerIndex: 0,
        used: [],
        startedAt: '2026-08-07T12:00:00.000Z',
        advanced: {
          stage: 'night',
          revealIndex: 7,
          revealed: false,
          day: 2,
          roles: {
            Alex: 'Mafia', Sam: 'Mafia', Mika: 'Detektiv', Lina: 'Arzt',
            Noah: 'Beschützer', Lea: 'Dorfbewohner', Emil: 'Dorfbewohner', Sara: 'Dorfbewohner'
          },
          alive: players,
          nightTarget: null,
          saved: null,
          protected: null,
          lastProtected: 'Lea',
          inspected: null,
          nightResult: ''
        }
      }
    }));
  }, { hubKey: HUB_KEY, activeKey: ACTIVE_KEY, players: PLAYERS });
}

test('Extended Mafia applies doctor, protector and detective night actions', async ({ page }) => {
  await seedNight(page);
  await page.goto('/advanced.html?game=mafia');
  await expect(page.locator('#advanced-start')).toContainText('Session fortsetzen');
  await page.locator('#advanced-start').click();

  await expect(page.locator('#play-eyebrow')).toHaveText('Nacht 2');
  const mafiaTarget = page.getByLabel('Mafia-Ziel');
  const doctor = page.getByLabel('Arzt schützt');
  const protector = page.getByLabel('Beschützer schützt');
  const detective = page.getByLabel('Detektiv untersucht');
  await expect(mafiaTarget).toBeVisible();
  await expect(doctor).toBeVisible();
  await expect(protector).toBeVisible();
  await expect(detective).toBeVisible();

  await expect(protector.locator('option[value="Lea"]')).toHaveCount(0);

  await mafiaTarget.selectOption('Sara');
  await doctor.selectOption('Emil');
  await protector.selectOption('Sara');
  await detective.selectOption('Alex');
  await page.getByRole('button', { name: 'Nacht auswerten' }).click();

  await expect(page.locator('#play-eyebrow')).toHaveText('Tag 2');
  await expect(page.locator('#play-player')).toHaveText('In dieser Nacht wurde niemand eliminiert.');
  await expect(page.locator('#play-content')).toContainText('Alex ist Mafia');

  const active = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
  expect(active.session.advanced.alive).toContain('Sara');
  expect(active.session.advanced.lastProtected).toBe('Sara');
  expect(active.session.advanced.inspected).toBe('Alex');
});
