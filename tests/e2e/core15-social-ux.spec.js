'use strict';

const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';
const ACTIVE_KEY = 'secret-circle-party-hub-active-v1';
const SOCIAL = ['truth-dare', 'never-have', 'most-likely', 'would-rather', 'paranoia'];

async function startSocialGame(page, gameId) {
  await page.goto('/party.html');
  await page.evaluate(({ hub, active }) => {
    localStorage.clear();
    localStorage.setItem(hub, JSON.stringify({
      version: 1, players: ['Alex', 'Sam', 'Mika', 'Lina'],
      favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
    localStorage.removeItem(active);
  }, { hub: HUB_KEY, active: ACTIVE_KEY });
  await page.reload();
  await page.locator('#browse-games').click();
  await page.locator(`[data-open-game="${gameId}"]:visible`).first().click();
  await expect(page.locator('#game-detail')).toBeVisible();
  await expect(page.locator('#start-selected-game')).toBeEnabled();
  await page.locator('#start-selected-game').click();
  await expect(page.locator('#play-layer')).toBeVisible();
  await expect(page.locator('#play-title')).not.toBeEmpty();
  await expect(page.locator('#play-content')).not.toBeEmpty();
  // Nicht jede Social-Engine zeigt einen Rundenleitfaden: Wahrheit/Pflicht
  // und Paranoia haben stattdessen den Freiwilligkeits-/Skip-Hinweis.
  if (['truth-dare', 'paranoia'].includes(gameId)) {
    await expect(page.locator('#hub-voluntary-play-note')).toContainText('freiwillig');
  } else {
    await expect(page.locator('#hub-round-guide')).not.toBeEmpty();
  }
}

async function state(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
}

test('social Core packs have distinct working routes and no automatically assigned matchpoints', async ({ page }) => {
  for (const gameId of SOCIAL) {
    await startSocialGame(page, gameId);
    const active = await state(page);
    expect(active.gameId).toBe(gameId);
    expect(active.session.rounds).toBe(0);
    expect(active.session.score).toBe(0);
    await expect(page.locator('#play-score')).toHaveText('');
  }
});

test('Truth or Dare flows through both branches without penalizing voluntary skipping', async ({ page }) => {
  await startSocialGame(page, 'truth-dare');
  await expect(page.locator('#hub-voluntary-play-note')).toContainText('freiwillig');
  await page.getByRole('button', { name: 'Wahrheit', exact: true }).click();
  const truth = await state(page);
  expect(truth.session.current).toMatchObject({ kind: 'truth-dare', pool: 'truth' });
  await page.getByRole('button', { name: 'Erledigt · nächste Person' }).click();
  await page.getByRole('button', { name: 'Pflicht', exact: true }).click();
  const dare = await state(page);
  expect(dare.session.current).toMatchObject({ kind: 'truth-dare', pool: 'dare' });
  await page.locator('#skip-hub-round').click();
  const skipped = await state(page);
  expect(skipped.session.rounds).toBe(2);
  expect(skipped.session.score).toBe(0);
  await expect(page.locator('#hub-status')).toContainText('kein Punkt');
});

test('Never Have and Most Likely keep a readable card after reload and advance without score', async ({ page }) => {
  for (const gameId of ['never-have', 'most-likely']) {
    await startSocialGame(page, gameId);
    const question = (await page.locator('#play-content').textContent())?.trim();
    expect(question).toBeTruthy();
    await page.reload();
    await page.getByRole('button', { name: 'Session fortsetzen' }).click();
    await expect(page.locator('#play-content')).toHaveText(question || '');
    await page.getByRole('button', { name: 'Nächste Karte' }).click();
    const active = await state(page);
    expect(active.session.rounds).toBe(1);
    expect(active.session.score).toBe(0);
    expect(active.session.used).toHaveLength(2);
  }
});

test('Would Rather shows exactly two choices and never fakes a correct answer', async ({ page }) => {
  await startSocialGame(page, 'would-rather');
  await expect(page.locator('#play-content .choice-card')).toHaveCount(2);
  const choices = await page.locator('#play-content .choice-card').allTextContents();
  expect(choices.every(choice => choice.trim().length > 0)).toBe(true);
  await expect(page.locator('#play-actions')).toContainText('Nächste Entscheidung');
  await expect(page.locator('#play-actions')).not.toContainText(/Richtig|Falsch/);
  await page.getByRole('button', { name: 'Nächste Entscheidung' }).click();
  const active = await state(page);
  expect(active.session.rounds).toBe(1);
  expect(active.session.score).toBe(0);
  await expect(page.locator('#play-content .choice-card')).toHaveCount(2);
});

test('Paranoia preserves the same secret question but never auto-opens it after reload', async ({ page }) => {
  await startSocialGame(page, 'paranoia');
  await expect(page.locator('#play-content')).toContainText('niemand mitlesen');
  await page.getByRole('button', { name: 'Geheime Frage anzeigen' }).click();
  const question = (await page.locator('#play-content').textContent())?.trim();
  expect(question).toBeTruthy();
  await page.reload();
  await page.getByRole('button', { name: 'Session fortsetzen' }).click();
  await expect(page.locator('#play-content')).not.toHaveText(question || '');
  await expect(page.getByRole('button', { name: 'Geheime Frage anzeigen' })).toBeVisible();
  await page.getByRole('button', { name: 'Geheime Frage anzeigen' }).click();
  await expect(page.locator('#play-content')).toHaveText(question || '');
  await page.getByRole('button', { name: 'Name wurde genannt · Münze werfen' }).click();
  await expect(page.getByRole('button', { name: 'Nächste Person' })).toBeVisible();
  await page.getByRole('button', { name: 'Nächste Person' }).click();
  const active = await state(page);
  expect(active.session.rounds).toBe(1);
  expect(active.session.score).toBe(0);
});
