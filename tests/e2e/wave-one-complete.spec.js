'use strict';

/* Issue #41, Welle Wave-One: Jedes der zehn Wave-One-Spiele (sechs Engines)
   wird über drei vollständige Runden bis zum Ergebnis gespielt, danach per
   Neustart und „Wiederholen“ zwei weitere Male. Die Wertung einzelner Runden
   prüfen wave-one-*.spec.js; hier zählt der ganze Ablauf: Endpunktzahl gleich
   der Summe der gespeicherten Rundenergebnisse, genau ein Verlaufseintrag pro
   Session, keine alte Session nach dem Ende. */

const { test, expect } = require('@playwright/test');
const catalog = require('../../party-wave-one-clue-catalog.js');

const HUB_KEY = 'secret-circle-party-hub-v1';
const ACTIVE_KEY = 'secret-circle-party-quick-active-v1';
const PLAYERS = ['Alex', 'Sam', 'Mika', 'Lina'];
const ROUNDS = 3;
const NEXT = /^(Nächste Frage|Nächste Aussage|Nächste Runde|Nächste Bluff-Frage|Nächstes Zielwort|Nächste Schätzung|Nächstes Bracket|Session abschließen)$/;

async function readActive(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
}

async function readHub(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), HUB_KEY);
}

async function revealAllCards(page) {
  for (let index = 0; index < PLAYERS.length; index += 1) {
    await page.getByRole('button', { name: 'Geheime Karte anzeigen' }).click();
    await page.getByRole('button', { name: 'Verstanden & verdecken' }).click();
  }
}

async function voteOutImposter(page, imposter) {
  await page.getByRole('button', { name: 'Geheime Abstimmung starten' }).click();
  for (const voter of PLAYERS) {
    await page.getByRole('button', { name: 'Abstimmung öffnen' }).click();
    const target = voter === imposter ? PLAYERS.find(name => name !== voter) : imposter;
    await page.getByRole('button', { name: target, exact: true }).click();
  }
}

async function submitPrivateAnswers(page, round) {
  /* Antworttexte ohne Spielernamen, damit die Anonymitätsprüfung aussagekräftig ist. */
  for (const letter of ['A', 'B', 'C', 'D'].slice(0, PLAYERS.length)) {
    await page.getByRole('button', { name: 'Antwort eingeben' }).click();
    await page.locator('#quick-writing-input').fill(`Antwort ${letter} R${round}`);
    await page.getByRole('button', { name: 'Antwort speichern & verdecken' }).click();
  }
}

/* Jeder Treiber spielt eine Runde bis zur aufgelösten Ergebnisansicht. */
const drivers = {
  async 'party-quiz'(page) {
    await page.locator('#quick-actions button').first().click();
    await expect(page.locator('#quick-content')).toContainText(/Richtig – 1 Punkt\.|Nicht ganz\./);
  },
  async 'fact-or-fake'(page, round) {
    await page.getByRole('button', { name: round === 2 ? 'Fake' : 'Fakt', exact: true }).click();
    await expect(page.locator('#quick-content')).toContainText(/Richtig – 1 Punkt\.|Nicht ganz\./);
  },
  async 'undercover-similar-word'(page) {
    const { current } = await readActive(page);
    await revealAllCards(page);
    await voteOutImposter(page, current.undercoverPlayer);
    await expect(page.locator('#quick-content')).toContainText(`Imposter: ${current.undercoverPlayer}`);
  },
  async 'no-word-imposter'(page, round) {
    const { current } = await readActive(page);
    await revealAllCards(page);
    await voteOutImposter(page, current.undercoverPlayer);
    await expect(page.locator('#quick-guess-input')).toBeVisible();
    /* Runde 1 errät der Imposter das Wort, sonst nicht. */
    await page.locator('#quick-guess-input').fill(round === 1 ? current.word : 'Bestimmt falsch');
    await page.getByRole('button', { name: 'Guess prüfen' }).click();
    await expect(page.locator('#quick-content')).toContainText(`Gesuchtes Wort: ${current.word}`);
    expect((await readActive(page)).current.winner).toBe(round === 1 ? 'undercover' : 'group');
  },
  async 'fill-blank-battle'(page, round) {
    await submitPrivateAnswers(page, round);
    const options = page.locator('#quick-actions button');
    await expect(options).toHaveCount(PLAYERS.length);
    for (const name of PLAYERS) await expect(page.locator('#quick-actions')).not.toContainText(name);
    await options.nth(round - 1).click();
    await expect(page.locator('#quick-content')).toContainText('Geschrieben von');
  },
  async 'who-wrote-it'(page, round) {
    await submitPrivateAnswers(page, round);
    await expect(page.locator('#quick-content')).toContainText('Anonyme Antwort');
    for (let index = 0; index < PLAYERS.length; index += 1) {
      await page.getByRole('button', { name: PLAYERS[index], exact: true }).click();
    }
    await expect(page.locator('#quick-content')).toContainText(/— (Alex|Sam|Mika|Lina)/);
  },
  async 'percent-guess'(page, round) {
    const answer = await page.evaluate(key => {
      const state = JSON.parse(localStorage.getItem(key));
      return window.SecretCirclePartyCatalog.getItems('percent-guess', state.pack)[state.current.cardIndex].answer;
    }, ACTIVE_KEY);
    const guess = round === 3 ? (answer > 50 ? 0 : 100) : answer;
    await page.locator('#quick-estimate-input').fill(String(guess));
    await page.getByRole('button', { name: 'Schätzung prüfen' }).click();
    await expect(page.locator('#quick-content')).toContainText(`Deine Schätzung: ${guess} % · Zielwert: ${answer} %`);
  },
  async 'party-bracket'(page) {
    for (let decision = 0; decision < 7; decision += 1) {
      await page.locator('#quick-actions button').nth(decision % 2).click();
    }
    await expect(page.locator('#quick-content')).toContainText('Bracket-Sieger:');
  },
  async 'bluff-trivia'(page, round) {
    for (const player of PLAYERS) {
      await page.getByRole('button', { name: 'Fake-Antwort eingeben' }).click();
      await page.locator('#quick-bluff-input').fill(`Erfunden von ${player} R${round}`);
      await page.getByRole('button', { name: 'Speichern & verdecken' }).click();
    }
    for (let voter = 0; voter < PLAYERS.length; voter += 1) {
      await page.getByRole('button', { name: 'Antworten anzeigen' }).click();
      /* Die eigene Fake-Antwort steht nicht zur Wahl. */
      await expect(page.locator('#quick-actions')).not.toContainText(`Erfunden von ${PLAYERS[voter]} R${round}`);
      await page.locator('#quick-actions button').first().click();
    }
    await expect(page.locator('#quick-content')).toContainText('Richtige Antwort:');
  },
  async 'password-one-word'(page, round) {
    await page.getByRole('button', { name: 'Zielwort anzeigen' }).click();
    const target = (await page.locator('#quick-content .challenge-card').last().textContent()).trim();
    await page.locator('#quick-clue-input').fill('Zufallshinweis');
    await page.getByRole('button', { name: 'Hinweis speichern & verdecken' }).click();
    await expect(page.locator('#quick-content')).not.toContainText(target);
    await page.getByRole('button', { name: round === 2 ? 'Nicht erraten' : 'Erraten', exact: true }).click();
    await expect(page.locator('#quick-content')).toContainText(`Zielwort: ${target}`);
  }
};

async function seedHub(page) {
  await page.goto('/party.html');
  await page.evaluate(({ key, players }) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({
      version: 1, players, favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
  }, { key: HUB_KEY, players: PLAYERS });
}

async function playSession(page, gameId) {
  let stored = 0;
  for (let round = 1; round <= ROUNDS; round += 1) {
    await expect(page.locator('#quick-progress')).toHaveText(`Runde ${round} von ${ROUNDS}`);
    const before = await readActive(page);
    expect(before.gameId).toBe(gameId);
    expect(before.round).toBe(round);
    await drivers[gameId](page, round);
    const after = await readActive(page);
    expect(after.phase).toBe('result');
    expect(after.totalScore).toBeGreaterThanOrEqual(before.totalScore);
    stored = after.totalScore;
    const next = page.locator('#quick-actions').getByRole('button', { name: NEXT });
    await expect(next).toHaveText(round === ROUNDS && !['party-quiz', 'fact-or-fake'].includes(gameId) ? 'Session abschließen' : NEXT);
    await next.click();
  }
  await expect(page.locator('#quick-result')).toBeVisible();
  await expect(page.locator('#quick-play')).toBeHidden();
  await expect(page.locator('#quick-final-score')).toHaveText(String(stored));
  return stored;
}

test('Wave-One-Treiber decken genau die zehn Wave-One-Spiele ab', () => {
  expect(Object.keys(drivers).sort()).toEqual([...catalog.waveOneGameIds].sort());
});

for (const gameId of catalog.waveOneGameIds) {
  test(`Wave-One ${gameId}: drei Runden bis Ergebnis, Verlauf genau einmal, Wiederholen bis Ergebnis`, async ({ page }) => {
    const game = catalog.getGame(gameId);
    expect(PLAYERS.length).toBeGreaterThanOrEqual(game.minPlayers);
    expect(PLAYERS.length).toBeLessThanOrEqual(game.maxPlayers);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    await seedHub(page);
    await page.goto(`/quick-play.html?game=${encodeURIComponent(gameId)}`);
    await expect(page.locator('#quick-title')).toHaveText(game.title);
    await page.locator('#quick-rounds').selectOption(String(ROUNDS));
    await page.locator('#quick-start').click();
    await expect(page.locator('#quick-play')).toBeVisible();

    const firstScore = await playSession(page, gameId);
    expect(await readActive(page)).toBeNull();
    let hub = await readHub(page);
    let entries = hub.history.filter(entry => entry.gameId === gameId);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ rounds: ROUNDS, score: firstScore, players: PLAYERS });
    expect(hub.stats[gameId]).toEqual({ plays: 1, rounds: ROUNDS, best: firstScore });

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
    await expect(page.locator('#quick-next-game')).toHaveAttribute('href', /^(quick-play\.html\?game=[a-z0-9-]+|v2-hub\.html#spiele)$/);
    expect(errors).toEqual([]);
  });
}

test('Wave-One: Doppeltipp auf „Session abschließen“ startet keine neue Session', async ({ page }) => {
  await seedHub(page);
  await page.goto('/quick-play.html?game=percent-guess');
  await page.locator('#quick-rounds').selectOption(String(ROUNDS));
  await page.locator('#quick-start').click();
  for (let round = 1; round <= ROUNDS; round += 1) {
    await page.locator('#quick-estimate-input').fill('50');
    await page.getByRole('button', { name: 'Schätzung prüfen' }).click();
    const next = page.locator('#quick-actions').getByRole('button', { name: NEXT });
    if (round < ROUNDS) await next.click();
    else await next.dblclick();
  }
  await expect(page.locator('#quick-result')).toBeVisible();
  await expect(page.locator('#quick-play')).toBeHidden();
  expect(await readActive(page)).toBeNull();
  expect((await readHub(page)).history.filter(entry => entry.gameId === 'percent-guess')).toHaveLength(1);
});
