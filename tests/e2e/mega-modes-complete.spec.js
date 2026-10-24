'use strict';

/* Issue #41, Welle Trend/Mega: Jedes der neun Trend-Spiele wird von der
   Einrichtung über drei echte Runden bis zum Ergebnis gespielt, danach per
   Neustart und „Wiederholen“ zwei weitere Male vollständig. Geprüft werden
   Punkte, genau ein Verlaufseintrag pro Session, das Aufräumen der aktiven
   Session und dass geheime Inhalte nur in der vorgesehenen Phase im DOM stehen. */

const { test, expect } = require('@playwright/test');
const catalog = require('../../party-wave-one-clue-catalog.js');

const HUB_KEY = 'secret-circle-party-hub-v1';
const ACTIVE_KEY = 'secret-circle-party-mega-active-v1';
const PLAYERS = ['Alex', 'Sam', 'Mika', 'Lina'];
const ROUNDS = 3;

function identityGame({ show, hide, success, next }) {
  return async (page, round) => {
    await expect(page.locator('#quick-content .challenge-card')).toHaveCount(0);
    await page.getByRole('button', { name: show }).click();
    await expect(page.locator('#quick-private-note')).toBeVisible();
    const identity = (await page.locator('#quick-content .challenge-card').textContent()).trim();
    expect(identity).not.toBe('');
    await page.getByRole('button', { name: hide }).click();
    /* Beim Raten steht die Identität nicht mehr im DOM. */
    await expect(page.locator('#quick-content')).not.toContainText(identity);
    await expect(page.locator('#quick-controls .quick-timer')).toBeVisible();
    const guessed = round !== 2;
    await page.getByRole('button', { name: guessed ? success : 'Nicht erraten', exact: true }).click();
    await expect(page.locator('#quick-content .challenge-card').first()).toHaveText(identity);
    await page.getByRole('button', { name: next }).click();
    return guessed ? 1 : 0;
  };
}

const drivers = {
  'who-am-i': identityGame({
    show: 'Identität der Gruppe zeigen', hide: 'Verbergen und 60 Sekunden starten',
    success: 'Identität erraten', next: 'Nächste Identität'
  }),
  'anime-guess': identityGame({
    show: 'Figur der Gruppe zeigen', hide: 'Figur verbergen und 60 Sekunden starten',
    success: 'Figur erraten', next: 'Nächste Anime-Figur'
  }),
  async 'money-challenge'(page, round) {
    await expect(page.locator('#quick-content')).toContainText('Nur hypothetisch');
    await expect(page.locator('#quick-content .money-amount')).not.toBeEmpty();
    const yes = round !== 3;
    await page.getByRole('button', { name: yes ? 'Würde ich machen' : 'Nie im Leben' }).click();
    return yes ? 1 : 0;
  },
  async 'blind-ranking'(page) {
    const seen = [];
    for (const rank of [5, 3, 1, 4, 2]) {
      await expect(page.locator('#quick-content')).toContainText(`Begriff ${seen.length + 1} von 5`);
      seen.push((await page.locator('#quick-content .challenge-card').textContent()).trim());
      await page.getByRole('button', { name: `Rang ${rank}`, exact: true }).click();
    }
    const result = page.locator('#quick-content .blind-ranking-result li');
    await expect(result).toHaveCount(5);
    /* Rang 1 bekam den dritten Begriff, Rang 5 den ersten. */
    await expect(result.nth(0)).toHaveText(seen[2]);
    await expect(result.nth(4)).toHaveText(seen[0]);
    expect(new Set(seen).size).toBe(5);
    await page.getByRole('button', { name: 'Nächstes Blind Ranking' }).click();
    return 1;
  },
  async 'emoji-quiz'(page, round) {
    await expect(page.locator('#quick-content .emoji-clue')).not.toBeEmpty();
    await expect(page.locator('#quick-content .challenge-card')).toHaveCount(0);
    await page.getByRole('button', { name: 'Antwort aufdecken' }).click();
    await expect(page.locator('#quick-content .challenge-card')).not.toBeEmpty();
    const right = round !== 2;
    await page.getByRole('button', { name: right ? 'Richtig' : 'Falsch', exact: true }).click();
    return right ? 1 : 0;
  },
  async 'pass-the-phone'(page) {
    await expect(page.locator('#quick-content .challenge-card')).not.toBeEmpty();
    await page.getByRole('button', { name: 'Handy weitergegeben' }).click();
    return 0;
  },
  async 'red-green-flag'(page, round) {
    const choice = round === 2 ? 'Green Flag' : 'Red Flag';
    await page.getByRole('button', { name: new RegExp(`${choice}$`) }).click();
    await expect(page.locator('#quick-content .choice-result')).toHaveText(`Entscheidung: ${choice}`);
    await page.getByRole('button', { name: 'Nächste Situation' }).click();
    return 0;
  },
  async 'secret-mission'(page, round) {
    await expect(page.locator('#quick-private-note')).toBeVisible();
    await expect(page.locator('#quick-content .challenge-card')).toHaveCount(0);
    await page.getByRole('button', { name: 'Mission anzeigen' }).click();
    const mission = (await page.locator('#quick-content .challenge-card').textContent()).trim();
    await page.getByRole('button', { name: 'Mission merken und verbergen' }).click();
    await expect(page.locator('#quick-content')).toContainText('Mission läuft');
    await expect(page.locator('#quick-content')).not.toContainText(mission);
    const done = round !== 2;
    await page.getByRole('button', { name: done ? 'Mission geschafft' : 'Nicht geschafft' }).click();
    await expect(page.locator('#quick-content .challenge-card').first()).toHaveText(mission);
    await page.getByRole('button', { name: 'Nächste Mission' }).click();
    return done ? 1 : 0;
  },
  async 'tier-list'(page, round) {
    const tier = ['S', 'B', 'D'][round - 1];
    await page.getByRole('button', { name: `${tier}-Tier`, exact: true }).click();
    await expect(page.locator('#quick-content .tier-result')).toHaveText(`${tier}-Tier`);
    await page.getByRole('button', { name: 'Nächster Begriff' }).click();
    return 1;
  }
};

const expectedResultText = {
  'secret-mission': 'Rangliste: Alex 1 · Mika 1',
  'tier-list': 'Gruppe 3',
  'emoji-quiz': 'Gruppe 2',
  'pass-the-phone': `${ROUNDS} Trend-Runden wurden lokal gespeichert.`,
  'red-green-flag': `${ROUNDS} Trend-Runden wurden lokal gespeichert.`
};

async function readHub(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), HUB_KEY);
}

async function readActive(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
}

async function seedHub(page) {
  await page.goto('/party.html');
  await page.evaluate(({ key, players }) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({
      version: 1, players, favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
  }, { key: HUB_KEY, players: PLAYERS });
}

async function startMega(page, gameId) {
  await seedHub(page);
  await page.goto(`/quick-play.html?game=${encodeURIComponent(gameId)}`);
  await expect(page.locator('script[src="party-mega-modes.js"]')).toHaveCount(1);
  await page.locator('#quick-rounds').selectOption(String(ROUNDS));
  await page.locator('#quick-start').click();
  await expect(page.locator('#quick-play')).toBeVisible();
}

async function playSession(page, gameId) {
  let expected = 0;
  for (let round = 1; round <= ROUNDS; round += 1) {
    await expect(page.locator('#quick-progress')).toHaveText(`Runde ${round} von ${ROUNDS}`);
    const active = await readActive(page);
    expect(active.gameId).toBe(gameId);
    expect(active.round).toBe(round);
    expected += await drivers[gameId](page, round);
  }
  await expect(page.locator('#quick-result')).toBeVisible();
  await expect(page.locator('#quick-play')).toBeHidden();
  await expect(page.locator('#quick-final-score')).toHaveText(String(expected));
  return expected;
}

test('Trend-Treiber decken genau die neun Spiele der Mega-Engine ab', () => {
  expect(Object.keys(drivers).sort()).toEqual([...catalog.megaGameIds].sort());
});

for (const gameId of catalog.megaGameIds) {
  test(`Trend ${gameId}: drei Runden bis Ergebnis, Verlauf genau einmal, Wiederholen bis Ergebnis`, async ({ page }) => {
    const game = catalog.getGame(gameId);
    expect(PLAYERS.length).toBeGreaterThanOrEqual(game.minPlayers);
    expect(PLAYERS.length).toBeLessThanOrEqual(game.maxPlayers);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    await startMega(page, gameId);
    await expect(page.locator('#quick-title')).toHaveText(game.title);
    const firstScore = await playSession(page, gameId);
    if (expectedResultText[gameId]) await expect(page.locator('#quick-result-text')).toContainText(expectedResultText[gameId]);
    expect(await readActive(page)).toBeNull();

    let hub = await readHub(page);
    let entries = hub.history.filter(entry => entry.gameId === gameId);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ rounds: ROUNDS, score: firstScore, players: PLAYERS });
    expect(hub.stats[gameId]).toEqual({ plays: 1, rounds: ROUNDS, best: firstScore });
    expect(hub.recent[0]).toBe(gameId);

    await page.reload();
    await expect(page.locator('#quick-resume-box')).toBeHidden();
    expect((await readHub(page)).history.filter(entry => entry.gameId === gameId)).toHaveLength(1);

    await page.locator('#quick-rounds').selectOption(String(ROUNDS));
    await page.locator('#quick-start').click();
    const secondScore = await playSession(page, gameId);
    await page.locator('#quick-replay').click();
    await expect(page.locator('#quick-play')).toBeVisible();
    await expect(page.locator('#quick-progress')).toHaveText(`Runde 1 von ${ROUNDS}`);
    await expect(page.locator('#quick-score')).toHaveText('0 Punkte');
    const thirdScore = await playSession(page, gameId);

    hub = await readHub(page);
    entries = hub.history.filter(entry => entry.gameId === gameId);
    expect(entries).toHaveLength(3);
    expect(new Set(entries.map(entry => entry.id)).size).toBe(3);
    expect(entries.map(entry => entry.score)).toEqual([thirdScore, secondScore, firstScore]);
    expect(hub.stats[gameId]).toEqual({ plays: 3, rounds: ROUNDS * 3, best: Math.max(firstScore, secondScore, thirdScore) });

    const next = page.locator('#quick-next-game');
    await expect(next).toHaveAttribute('href', /^quick-play\.html\?game=[a-z0-9-]+$/);
    expect(await next.getAttribute('data-next-game-id')).not.toBe(gameId);
    expect(errors).toEqual([]);
  });
}

const secretResumeCases = [
  { gameId: 'who-am-i', show: 'Identität der Gruppe zeigen' },
  { gameId: 'anime-guess', show: 'Figur der Gruppe zeigen' },
  { gameId: 'secret-mission', show: 'Mission anzeigen' }
];

for (const { gameId, show } of secretResumeCases) {
  test(`Trend ${gameId}: Neuladen bei offenem Geheimnis deckt es wieder zu, Inhalt bleibt derselbe`, async ({ page }) => {
    await startMega(page, gameId);
    await page.getByRole('button', { name: show }).click();
    const secret = (await page.locator('#quick-content .challenge-card').textContent()).trim();
    expect(secret).not.toBe('');

    await page.reload();
    await page.getByRole('button', { name: 'Fortsetzen' }).click();
    await expect(page.locator('#quick-progress')).toHaveText(`Runde 1 von ${ROUNDS}`);
    await expect(page.locator('#quick-content .challenge-card')).toHaveCount(0);
    await expect(page.locator('#quick-content')).not.toContainText(secret);
    expect((await readActive(page)).phase).toBe('ready');

    await page.getByRole('button', { name: show }).click();
    await expect(page.locator('#quick-content .challenge-card')).toHaveText(secret);
  });
}

test('Trend: Doppeltipp auf die letzte Aktion startet keine neue Session', async ({ page }) => {
  await startMega(page, 'money-challenge');
  for (let round = 1; round < ROUNDS; round += 1) {
    await page.getByRole('button', { name: 'Würde ich machen' }).click();
  }
  await page.getByRole('button', { name: 'Würde ich machen' }).dblclick();
  await expect(page.locator('#quick-result')).toBeVisible();
  await expect(page.locator('#quick-play')).toBeHidden();
  await expect(page.locator('#quick-final-score')).toHaveText(String(ROUNDS));
  expect(await readActive(page)).toBeNull();
  expect((await readHub(page)).history.filter(entry => entry.gameId === 'money-challenge')).toHaveLength(1);
});
