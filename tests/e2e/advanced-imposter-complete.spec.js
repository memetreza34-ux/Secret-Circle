'use strict';

/* Issue #41, letzte Welle: die vier Advanced-Spiele und Word Imposter.
   Advanced: drei Runden bis zur Session-Zusammenfassung, „Session speichern
   und beenden“, danach eine zweite vollständige Session. Mafia: drei komplette
   Partien (Rollen, Erzähler, Nacht, Tag) bis zum Sieg. Word Imposter: ein
   Match über drei Runden bis zum Endstand, danach „Neues Match“ vollständig.
   Die Privatsphäre beim Fortsetzen decken advanced-secret-resume und
   game-flow ab. */

const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';
const ADVANCED_KEY = 'secret-circle-party-active-v1';
const IMPOSTER_HISTORY_KEY = 'secret-circle-history-v7';
const PLAYERS = ['Alex', 'Sam', 'Mika', 'Lina', 'Noah', 'Lea'];
const ROUNDS = 3;

async function advancedState(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), ADVANCED_KEY);
}

async function readHub(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), HUB_KEY);
}

async function seedHub(page) {
  await page.goto('/party.html');
  await page.evaluate(({ key, players }) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({ version: 1, players, favorites: [], recent: [], presets: [], history: [], stats: {} }));
  }, { key: HUB_KEY, players: PLAYERS });
}

const advancedDrivers = {
  async 'two-truths'(page, round) {
    await page.getByLabel('Aussage 1').fill(`Wahrheit eins R${round}`);
    await page.getByLabel('Aussage 2').fill(`Wahrheit zwei R${round}`);
    await page.getByLabel('Aussage 3').fill(`Erfundene Lüge R${round}`);
    await page.getByLabel('Welche Aussage ist die Lüge?').selectOption({ label: 'Aussage 3' });
    await page.getByRole('button', { name: 'Aussagen mischen und verdecken' }).click();
    await page.getByRole('button', { name: 'Aussagen für die Gruppe anzeigen' }).click();
    const { lieIndex } = (await advancedState(page)).session.advanced;
    const right = round !== 2;
    await page.locator('.statement-button').nth(right ? lieIndex : (lieIndex + 1) % 3).click();
    if (right) await expect(page.locator('#play-eyebrow')).toHaveText('Richtig erkannt');
    await page.getByRole('button', { name: 'Nächste Person' }).click();
  },
  async 'question-imposter'(page, round) {
    for (let index = 0; index < PLAYERS.length; index += 1) {
      await page.getByRole('button', { name: 'Meine Frage anzeigen' }).click();
      await page.getByRole('button', { name: 'Frage verdecken und weitergeben' }).click();
    }
    await expect(page.locator('#play-eyebrow')).toHaveText('Antworten vergleichen');
    await page.getByRole('button', { name: 'Geheime Abstimmung starten' }).click();
    const { imposter } = (await advancedState(page)).session.advanced;
    const target = round === 2 ? PLAYERS.find(name => name !== imposter) : imposter;
    await page.getByRole('button', { name: target, exact: true }).click();
    if (target === imposter) await expect(page.locator('#play-eyebrow')).toHaveText('Imposter gefunden');
    await page.getByRole('button', { name: 'Nächste Runde' }).click();
  },
  async 'location-spy'(page, round) {
    for (let index = 0; index < PLAYERS.length; index += 1) {
      await page.getByRole('button', { name: 'Karte anzeigen' }).click();
      await page.getByRole('button', { name: 'Karte schließen und weitergeben' }).click();
    }
    await expect(page.locator('#play-eyebrow')).toHaveText('Fragerunde');
    await page.getByRole('button', { name: 'Spion wählen' }).click();
    const { spy } = (await advancedState(page)).session.advanced;
    const target = round === 2 ? PLAYERS.find(name => name !== spy) : spy;
    await page.getByRole('button', { name: target, exact: true }).click();
    if (target === spy) await expect(page.locator('#play-eyebrow')).toHaveText('Gruppe gewinnt');
    await page.locator('#play-actions button, #play-options button').filter({ hasText: /^Nächster Ort$/ }).click();
  },
  async 'mafia'(page) {
    for (let index = 0; index < PLAYERS.length; index += 1) {
      await page.getByRole('button', { name: 'Meine Rolle anzeigen' }).click();
      await expect(page.locator('#play-content')).toContainText('Deine Rolle:');
      await page.getByRole('button', { name: 'Rolle schließen und weitergeben' }).click();
    }
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Moderatorübersicht öffnen' }).click();
    for (let day = 1; day <= PLAYERS.length; day += 1) {
      await expect(page.locator('#play-eyebrow')).toHaveText(`Tag ${day} · Moderatorübersicht`);
      await page.getByRole('button', { name: 'Nachtphase starten' }).click();
      await page.getByRole('button', { name: 'Nacht auswerten' }).click();
      if (await page.locator('#play-eyebrow').textContent() === 'Mafia beendet') break;
      const { roles, alive } = (await advancedState(page)).session.advanced;
      const mafia = alive.find(name => roles[name] === 'Mafia');
      await page.getByRole('combobox', { name: 'Durch Tageswahl eliminiert' }).selectOption(mafia);
      await page.getByRole('button', { name: 'Tageswahl bestätigen' }).click();
      if (await page.locator('#play-eyebrow').textContent() === 'Mafia beendet') break;
    }
    await expect(page.locator('#play-eyebrow')).toHaveText('Mafia beendet');
    await expect(page.locator('#play-player')).toHaveText(/gewinnt$/);
    await page.getByRole('button', { name: 'Neue Mafia-Runde' }).click();
  }
};

async function startAdvanced(page, gameId) {
  await page.goto(`/advanced.html?game=${gameId}`);
  await expect(page.locator('#advanced-player-help')).toContainText(`${PLAYERS.length} Personen sind bereit.`);
  await page.locator('#advanced-length').selectOption(String(ROUNDS));
  await expect(page.locator('#advanced-start')).toBeEnabled();
  await page.locator('#advanced-start').click();
  await expect(page.locator('#advanced-play-layer')).toBeVisible();
}

async function playAdvancedSession(page, gameId) {
  for (let round = 1; round <= ROUNDS; round += 1) {
    await expect(page.locator('#play-progress')).toHaveText(`Runde ${round} von ${ROUNDS}`);
    await advancedDrivers[gameId](page, round);
    expect((await advancedState(page)).session.rounds).toBe(round);
  }
  const stored = (await advancedState(page)).session.score;
  await expect(page.locator('#play-eyebrow')).toHaveText('Session abgeschlossen');
  await expect(page.locator('#play-player')).toHaveText(`${ROUNDS} Runden gespielt`);
  await expect(page.locator('.session-summary strong')).toHaveText(String(stored));
  await page.getByRole('button', { name: 'Session speichern und beenden' }).click();
  await expect(page).toHaveURL(/\/v2-hub\.html#profil$/);
  expect(await page.evaluate(key => localStorage.getItem(key), ADVANCED_KEY)).toBeNull();
  return stored;
}

test('Advanced-Treiber decken genau die vier Advanced-Spiele ab', () => {
  expect(Object.keys(advancedDrivers).sort()).toEqual(['location-spy', 'mafia', 'question-imposter', 'two-truths']);
});

for (const gameId of Object.keys(advancedDrivers)) {
  test(`Advanced ${gameId}: drei Runden bis Zusammenfassung, Verlauf genau einmal, zweite Session vollständig`, async ({ page }) => {
    test.setTimeout(gameId === 'mafia' ? 120_000 : 60_000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await seedHub(page);

    await startAdvanced(page, gameId);
    const firstScore = await playAdvancedSession(page, gameId);
    let hub = await readHub(page);
    let entries = hub.history.filter(entry => entry.gameId === gameId);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ rounds: ROUNDS, score: firstScore, players: PLAYERS });
    expect(hub.stats[gameId]).toEqual({ plays: 1, rounds: ROUNDS, best: firstScore });
    expect(hub.recent[0]).toBe(gameId);

    await startAdvanced(page, gameId);
    const secondScore = await playAdvancedSession(page, gameId);
    hub = await readHub(page);
    entries = hub.history.filter(entry => entry.gameId === gameId);
    expect(entries).toHaveLength(2);
    expect(new Set(entries.map(entry => entry.id)).size).toBe(2);
    expect(entries.map(entry => entry.score)).toEqual([secondScore, firstScore]);
    expect(hub.stats[gameId]).toEqual({ plays: 2, rounds: ROUNDS * 2, best: Math.max(firstScore, secondScore) });
    expect(errors).toEqual([]);
  });
}

/* Word Imposter nutzt word-imposter.html mit eigenem Verlauf. */
const catalog = require('../../party-wave-one-clue-catalog.js');

test('Word Imposter ist im Katalog der Link auf die eigene Engine', () => {
  const game = catalog.getGame('imposter');
  expect(game.status).toBe('playable');
  expect(game.href).toBe('word-imposter.html');
});

async function playImposterRound(page, players) {
  for (let index = 0; index < players.length; index += 1) {
    await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
    await expect(page.locator('#secret')).toBeVisible();
    await page.getByRole('button', { name: 'Karte schließen und weitergeben' }).click();
  }
  await expect(page.locator('#round-screen')).toBeVisible();
  await page.getByRole('button', { name: 'Abstimmung starten' }).click();
  const imposters = (await page.evaluate(() => JSON.parse(localStorage.getItem('secret-circle-active-v7')))).imposters;
  let guard = 0;
  while (await page.locator('#vote-screen').isVisible()) {
    guard += 1;
    if (guard > 3 * players.length) throw new Error('Abstimmung wurde nicht aufgelöst.');
    const voter = ((await page.locator('#voter-name').textContent()) || '').trim();
    const target = players.find(name => name !== voter && imposters.includes(name)) || players.find(name => name !== voter);
    const preferred = page.locator('#vote-options').getByRole('button', { name: target, exact: true });
    if (await preferred.count()) await preferred.click();
    else await page.locator('#vote-options button').first().click();
    if (await page.locator('#vote-handoff-screen').isVisible()) await page.getByRole('button', { name: 'Ich bin bereit' }).click();
  }
  if (await page.locator('#guess-screen').isVisible()) await page.getByRole('button', { name: 'Falsch', exact: true }).click();
  await expect(page.locator('#result-screen')).toBeVisible();
  await expect(page.locator('#leaderboard .leader-row')).toHaveCount(players.length);
}

test('Word Imposter: Match über drei Runden bis Endstand, jede Runde genau einmal im Verlauf, neues Match vollständig', async ({ page }) => {
  const players = ['Alex', 'Sam', 'Mika', 'Lina'];
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/word-imposter.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  const playMatch = async () => {
    await page.locator('#players').fill(players.join('\n'));
    await page.locator('#advanced-settings > summary').click();
    await page.locator('#match-rounds').fill(String(ROUNDS));
    await page.locator('#duration').fill('1');
    await page.locator('#start').click();
    for (let round = 1; round <= ROUNDS; round += 1) {
      await expect(page.locator('#reveal-progress')).toContainText(`Runde ${round}/${ROUNDS}`);
      await playImposterRound(page, players);
      await expect(page.locator('#result-meta')).toContainText(`Runde ${round}/${ROUNDS}`);
      if (round < ROUNDS) await page.getByRole('button', { name: `Runde ${round + 1} starten` }).click();
    }
    await expect(page.locator('#next-round')).toBeHidden();
  };

  await playMatch();
  let history = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), IMPOSTER_HISTORY_KEY);
  expect(history).toHaveLength(ROUNDS);
  expect(new Set(history.map(entry => entry.id)).size).toBe(ROUNDS);

  /* Neu laden auf dem Endstand speichert keine Runde doppelt. */
  await page.reload();
  history = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), IMPOSTER_HISTORY_KEY);
  expect(history).toHaveLength(ROUNDS);

  if (await page.locator('#result-screen').isVisible()) await page.locator('#result-screen [data-new-game]').click();
  else if (await page.locator('#resume-box').isVisible()) await page.locator('#resume-box button').nth(1).click();
  await expect(page.locator('#start')).toBeVisible();
  await playMatch();
  history = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), IMPOSTER_HISTORY_KEY);
  expect(history).toHaveLength(ROUNDS * 2);
  expect(new Set(history.map(entry => entry.id)).size).toBe(ROUNDS * 2);
  expect(errors).toEqual([]);
});
