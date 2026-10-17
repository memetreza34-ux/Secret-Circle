'use strict';

/* Issue #41, Welle Hub: Jedes der 13 Hub-Spiele wird über den echten Weg der
   Startseite (Spieldetail → party.html?play=…&from=v2) drei Runden gespielt,
   mit „Beenden & speichern“ abgeschlossen und danach ein zweites Mal
   vollständig gespielt. Timer-Runden laufen mit einer Test-Uhr wirklich ab.
   Geprüft werden Runden, Punkte, genau ein Verlaufseintrag pro Session, das
   Aufräumen der aktiven Session und die Rückkehr zur Startseite. */

const { test, expect } = require('@playwright/test');
const catalog = require('../../party-wave-one-clue-catalog.js');

const HUB_KEY = 'secret-circle-party-hub-v1';
const ACTIVE_KEY = 'secret-circle-party-hub-active-v1';
const PLAYERS = ['Alex', 'Sam', 'Mika', 'Lina'];
const ROUNDS = 3;
const HUB_GAMES = catalog.games
  .filter(game => game.status === 'playable' && !['link', 'two-truths', 'question-imposter', 'location-spy', 'mafia'].includes(game.mode))
  .filter(game => !catalog.allFastGameIds.includes(game.id) && !catalog.waveOneGameIds.includes(game.id))
  .map(game => game.id);
const TIMER_GAMES = new Set(['charades', 'taboo', 'hot-potato', 'word-chain']);

async function content(page) {
  return ((await page.locator('#play-content').textContent()) || '').trim();
}

function promptGame(next) {
  return async page => {
    expect(await content(page)).not.toBe('');
    await page.getByRole('button', { name: next }).click();
    return 0;
  };
}

const drivers = {
  async 'truth-dare'(page, round) {
    await page.getByRole('button', { name: round === 2 ? 'Pflicht' : 'Wahrheit', exact: true }).click();
    expect(await content(page)).not.toBe('Wähle Wahrheit oder Pflicht.');
    await page.getByRole('button', { name: /Erledigt.*nächste Person/ }).click();
    return 0;
  },
  'never-have': promptGame('Nächste Karte'),
  'most-likely': promptGame('Nächste Karte'),
  'hot-takes': promptGame('Nächste Karte'),
  'wrong-answers': promptGame('Nächste Karte'),
  async 'would-rather'(page) {
    await expect(page.locator('#play-content .choice-card')).toHaveCount(2);
    await page.getByRole('button', { name: 'Nächste Entscheidung' }).click();
    return 0;
  },
  async 'paranoia'(page) {
    await expect(page.locator('#play-content')).toContainText('Gerät so halten');
    await page.getByRole('button', { name: 'Geheime Frage anzeigen' }).click();
    const question = await content(page);
    expect(question).not.toContain('Gerät so halten');
    await page.getByRole('button', { name: 'Name wurde genannt · Münze werfen' }).click();
    await expect(page.locator('#play-content')).toHaveText(new RegExp(`^(Frage wird aufgedeckt: ${question.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}|Die Frage bleibt geheim\\.)$`));
    await page.getByRole('button', { name: 'Nächste Person' }).click();
    return 0;
  },
  async 'charades'(page, round) {
    await page.getByRole('button', { name: 'Runde starten' }).click();
    const hits = [2, 0, 1][round - 1];
    for (let index = 0; index < hits; index += 1) await page.getByRole('button', { name: 'Treffer', exact: true }).click();
    await page.clock.runFor(61_000);
    await expect(page.locator('#play-content')).toHaveText(`Zeit vorbei · ${hits} Treffer`);
    await page.getByRole('button', { name: 'Nächste Person' }).click();
    return hits;
  },
  async 'taboo'(page, round) {
    await page.getByRole('button', { name: '60-Sekunden-Runde starten' }).click();
    await expect(page.locator('#play-content .taboo-word')).not.toBeEmpty();
    const hits = [1, 2, 0][round - 1];
    for (let index = 0; index < hits; index += 1) await page.getByRole('button', { name: 'Treffer', exact: true }).click();
    await page.clock.runFor(61_000);
    await expect(page.locator('#play-content')).toHaveText(`Zeit vorbei · ${hits} Treffer`);
    await page.getByRole('button', { name: 'Nächste Person' }).click();
    return hits;
  },
  async 'hot-potato'(page) {
    expect(await content(page)).not.toBe('');
    await page.getByRole('button', { name: 'Zufallstimer starten' }).click();
    /* Die Restzeit bleibt bewusst unsichtbar. */
    await expect(page.locator('#play-actions .timer-display')).toHaveText('●');
    await page.clock.runFor(26_000);
    await expect(page.locator('#play-content')).toHaveText('Wer das Gerät jetzt hält, verliert diese Runde.');
    await page.getByRole('button', { name: 'Neue Runde' }).click();
    return 0;
  },
  async 'word-chain'(page, round) {
    await expect(page.locator('#play-content')).toContainText('Startbuchstabe:');
    await page.getByRole('button', { name: '30-Sekunden-Runde starten' }).click();
    if (round === 2) {
      await page.clock.runFor(31_000);
      await expect(page.locator('#play-content')).toHaveText('Zeit vorbei.');
      await page.getByRole('button', { name: 'Neue Runde' }).click();
      return 0;
    }
    await page.getByRole('button', { name: 'Runde geschafft' }).click();
    return 1;
  },
  async 'spin-bottle'(page) {
    await page.getByRole('button', { name: 'Drehen', exact: true }).click();
    expect(PLAYERS).toContain(await content(page));
    return 0;
  },
  async 'dice-coin'(page, round) {
    const tool = ['Münze', 'W6', 'W20'][round - 1];
    await page.getByRole('button', { name: tool, exact: true }).click();
    const value = await content(page);
    if (tool === 'Münze') expect(['Kopf', 'Zahl']).toContain(value);
    else expect(Number(value)).toBeGreaterThanOrEqual(1);
    if (tool === 'W6') expect(Number(value)).toBeLessThanOrEqual(6);
    if (tool === 'W20') expect(Number(value)).toBeLessThanOrEqual(20);
    return 0;
  }
};

async function readHub(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), HUB_KEY);
}

async function startFromV2(page, gameId) {
  const game = catalog.getGame(gameId);
  await page.goto('/#spiel=' + encodeURIComponent(gameId));
  await expect(page.locator('[data-screen="mode"]')).toBeVisible();
  await expect(page.locator('#mode-title')).toHaveText(game.title);
  const banner = page.locator('.pwa-update-banner:visible');
  if (await banner.count()) await banner.getByRole('button', { name: 'Später' }).click();
  await page.locator('#start-btn').click();
  await expect(page).toHaveURL(/\/party\.html\?from=v2$/);
  await expect(page.locator('#play-layer')).toBeVisible();
  await expect(page.locator('#play-title')).toHaveText(game.title);
}

async function playSession(page, gameId) {
  let score = 0;
  for (let round = 1; round <= ROUNDS; round += 1) {
    score += await drivers[gameId](page, round);
    const active = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
    expect(active.session.gameId).toBe(gameId);
    expect(active.session.rounds).toBe(round);
    expect(active.session.score).toBe(score);
  }
  await expect(page.locator('#play-progress')).toHaveText(`${ROUNDS} Runden`);
  if (score) await expect(page.locator('#play-score')).toHaveText(`${score} ${score === 1 ? 'Punkt' : 'Punkte'}`);
  await page.getByRole('button', { name: 'Beenden & speichern' }).click();
  /* Aus der Startseite gestartet: zurück dorthin, keine aktive Session mehr. */
  await expect(page).toHaveURL(/\/v2-hub\.html$/);
  expect(await page.evaluate(key => localStorage.getItem(key), ACTIVE_KEY)).toBeNull();
  return score;
}

test('Hub-Treiber decken genau die 13 Spiele der Hub-Engine ab', () => {
  expect(HUB_GAMES).toHaveLength(13);
  expect(Object.keys(drivers).sort()).toEqual([...HUB_GAMES].sort());
});

for (const gameId of HUB_GAMES) {
  test(`Hub ${gameId}: drei Runden bis „Beenden & speichern“, Verlauf genau einmal, zweite Session vollständig`, async ({ page }) => {
    const game = catalog.getGame(gameId);
    expect(PLAYERS.length).toBeGreaterThanOrEqual(game.minPlayers);
    expect(PLAYERS.length).toBeLessThanOrEqual(game.maxPlayers);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    if (TIMER_GAMES.has(gameId)) await page.clock.install();

    await page.goto('/party.html');
    await page.evaluate(({ key, players }) => {
      localStorage.clear();
      localStorage.setItem(key, JSON.stringify({
        version: 1, players, favorites: [], recent: [], presets: [], history: [], stats: {}
      }));
    }, { key: HUB_KEY, players: PLAYERS });

    await startFromV2(page, gameId);
    const firstScore = await playSession(page, gameId);
    let hub = await readHub(page);
    let entries = hub.history.filter(entry => entry.gameId === gameId);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ rounds: ROUNDS, score: firstScore, players: PLAYERS });
    expect(entries[0].id).toMatch(/^completion-hub-/);
    expect(hub.stats[gameId]).toEqual({ plays: 1, rounds: ROUNDS, best: firstScore });
    expect(hub.recent[0]).toBe(gameId);

    /* Neu laden darf weder doppelt speichern noch eine alte Session anbieten. */
    await page.goto('/party.html');
    await expect(page.locator('#hub-resume-session')).toHaveCount(0);
    expect((await readHub(page)).history.filter(entry => entry.gameId === gameId)).toHaveLength(1);

    await startFromV2(page, gameId);
    const secondScore = await playSession(page, gameId);
    hub = await readHub(page);
    entries = hub.history.filter(entry => entry.gameId === gameId);
    expect(entries).toHaveLength(2);
    expect(new Set(entries.map(entry => entry.id)).size).toBe(2);
    expect(entries.map(entry => entry.score)).toEqual([secondScore, firstScore]);
    expect(hub.stats[gameId]).toEqual({ plays: 2, rounds: ROUNDS * 2, best: Math.max(firstScore, secondScore) });
    expect(errors).toEqual([]);
  });
}

test('Hub Scharade: Neuladen in laufender Runde verdeckt die Karte, Inhalt und Restzeit bleiben', async ({ page }) => {
  await page.goto('/party.html');
  await page.evaluate(({ key, players }) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({ version: 1, players, favorites: [], recent: [], presets: [], history: [], stats: {} }));
  }, { key: HUB_KEY, players: PLAYERS });
  await startFromV2(page, 'charades');
  await page.getByRole('button', { name: 'Runde starten' }).click();
  const card = await content(page);
  expect(card).not.toBe('');

  await page.reload();
  await page.getByRole('button', { name: 'Session fortsetzen' }).click();
  await expect(page.locator('#pause-hub-game')).toHaveText('Fortsetzen');
  await expect(page.locator('#hub-private-prompt-cover')).toContainText('Geheime Karte wurde automatisch verdeckt');
  await expect(page.locator('#play-content')).toBeHidden();
  await page.getByRole('button', { name: 'Geheime Karte wieder anzeigen' }).click();
  await expect(page.locator('#play-content')).toHaveText(card);
});
