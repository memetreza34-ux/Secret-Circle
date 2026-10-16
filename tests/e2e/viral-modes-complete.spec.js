'use strict';

/* Issue #41, Welle Viral: Jedes der acht Viral-Spiele wird von der
   Einrichtung über drei echte Runden bis zum Ergebnis gespielt, danach per
   Neustart und „Wiederholen“ zwei weitere Male vollständig. Geprüft werden
   Punkte, genau ein Verlaufseintrag pro Session, das Aufräumen der aktiven
   Session und dass die geheime Wahl bei „Wer kennt mich am besten?“ nicht
   sichtbar wird. */

const { test, expect } = require('@playwright/test');
const catalog = require('../../party-wave-one-clue-catalog.js');

const HUB_KEY = 'secret-circle-party-hub-v1';
const ACTIVE_KEY = 'secret-circle-party-viral-active-v1';
const PLAYERS = ['Alex', 'Sam', 'Mika', 'Lina'];
const ROUNDS = 3;


async function snapshotCurrent(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)).current, ACTIVE_KEY);
}

const drivers = {
  async 'put-a-finger-down'(page, round) {
    await expect(page.locator('#quick-content .challenge-card')).not.toBeEmpty();
    const up = round !== 2;
    await page.getByRole('button', { name: up ? /Bleibt oben$/ : /Finger runter$/ }).click();
    await expect(page.locator('#quick-content .choice-result')).toHaveText(up ? 'Finger bleibt oben' : 'Finger runter');
    await page.getByRole('button', { name: 'Nächste Aussage' }).click();
    return up ? 1 : 0;
  },
  async 'guess-the-price'(page, round) {
    await expect(page.locator('#quick-content')).toContainText('Reiner Spielwert');
    /* Der Spielpreis steht vor der Schätzung nicht im DOM. */
    await expect(page.locator('#quick-content .money-amount')).toHaveCount(0);
    const { price } = await snapshotCurrent(page);
    expect(price).toBeGreaterThan(0);
    const guess = round === 3 ? 0 : price;
    await page.getByRole('spinbutton', { name: 'Deine Schätzung in Euro' }).fill(String(guess));
    await page.getByRole('button', { name: 'Schätzung festlegen' }).click();
    await expect(page.locator('#quick-content .money-amount')).toHaveText(`${price} €`);
    const points = round === 3 ? 0 : 3;
    await expect(page.locator('#quick-content')).toContainText(`Deine Schätzung: ${guess} € · ${points} ${points === 1 ? 'Punkt' : 'Punkte'}`);
    await page.getByRole('button', { name: 'Nächster Spielpreis' }).click();
    return points;
  },
  async 'higher-lower'(page, round) {
    const { first, second } = await snapshotCurrent(page);
    await expect(page.locator('#quick-content .reveal-number')).toHaveText(String(first[1]));
    await expect(page.locator('#quick-content .money-amount')).toHaveCount(0);
    const higherIsRight = Number(second[1]) > Number(first[1]);
    const pickRight = round !== 3;
    const pickHigher = pickRight ? higherIsRight : !higherIsRight;
    await page.getByRole('button', { name: pickHigher ? /Höher$/ : /Tiefer oder gleich$/ }).click();
    await expect(page.locator('#quick-content .money-amount')).toHaveText(String(second[1]));
    await expect(page.locator('#quick-content')).toContainText(pickRight ? 'Richtig – 1 Punkt.' : 'Nicht richtig.');
    await page.getByRole('button', { name: 'Nächstes Zahlen-Duell' }).click();
    return pickRight ? 1 : 0;
  },
  async 'know-me-best'(page, round) {
    await expect(page.locator('#quick-private-note')).toBeVisible();
    const options = page.locator('#quick-actions button');
    await expect(options).toHaveCount(3);
    const labels = await options.allTextContents();
    const secret = round - 1;
    await options.nth(secret).click();
    await expect(page.locator('#quick-player')).toHaveText('Die Gruppe rät die geheime Antwort');
    /* Nichts verrät der Gruppe die geheime Wahl: gleiche Knöpfe, und der Fokus
       hängt nicht von der Wahl ab (höchstens der erste Knopf). Runde 2 und 3
       wählen geheim B bzw. C und belegen das. */
    await expect(options).toHaveText(labels);
    const focusedIndex = await page.evaluate(() => [...document.querySelectorAll('#quick-actions button')].indexOf(document.activeElement));
    expect([-1, 0]).toContain(focusedIndex);
    await expect(page.locator('#quick-content')).not.toContainText('Antwort:');
    const right = round !== 2;
    await options.nth(right ? secret : (secret + 1) % 3).click();
    await expect(page.locator('#quick-content .choice-result')).toHaveText(`Antwort: ${labels[secret].replace(/^[ABC] · /, '')}`);
    await page.getByRole('button', { name: 'Nächste Person' }).click();
    return right ? 1 : 0;
  },
  async 'hear-me-out'(page, round) {
    await page.getByRole('button', { name: '30 Sekunden starten' }).click();
    await expect(page.locator('#quick-controls .quick-timer')).toBeVisible();
    await page.getByRole('button', { name: 'Argument beendet' }).click();
    const convinced = round !== 2;
    await page.getByRole('button', { name: convinced ? 'Überzeugt' : 'Nicht überzeugt', exact: true }).click();
    await expect(page.locator('#quick-content')).toContainText(convinced ? 'überzeugt – 1 Punkt.' : 'Die These blieb umstritten.');
    await page.getByRole('button', { name: 'Nächste These' }).click();
    return convinced ? 1 : 0;
  },
  async 'hot-seat'(page, round) {
    await expect(page.locator('#quick-content .hot-seat-list li')).toHaveCount(5);
    await page.getByRole('button', { name: '45 Sekunden starten' }).click();
    const done = round !== 2;
    await page.getByRole('button', { name: done ? 'Alle beantwortet' : 'Zeit vorbei' }).click();
    await expect(page.locator('#quick-content')).toContainText(done ? 'Hot Seat geschafft – 1 Punkt.' : 'Nicht alle Fragen geschafft.');
    await page.getByRole('button', { name: 'Nächste Person' }).click();
    return done ? 1 : 0;
  },
  async 'story-chain'(page, round) {
    await page.getByRole('button', { name: '90 Sekunden starten' }).click();
    const done = round !== 2;
    await page.getByRole('button', { name: done ? 'Geschichte beendet' : 'Timer beenden' }).click();
    await expect(page.locator('#quick-content')).toContainText(done ? 'Gemeinsames Ende gefunden – 1 Punkt.' : 'Die Geschichte bleibt offen.');
    await page.getByRole('button', { name: 'Neue Geschichte' }).click();
    return done ? 1 : 0;
  },
  async 'finish-the-sentence'(page, round) {
    const hit = round !== 2;
    await page.getByRole('button', { name: hit ? 'Kreativer Treffer' : 'Weiter', exact: true }).click();
    await expect(page.locator('#quick-content')).toContainText(hit ? 'Die Gruppe vergibt 1 Punkt.' : 'Kein Punkt in dieser Runde.');
    await page.getByRole('button', { name: 'Nächster Satz' }).click();
    return hit ? 1 : 0;
  }
};

const expectedResultText = {
  'higher-lower': 'Gruppe 2',
  'know-me-best': 'Gruppe 2',
  'story-chain': 'Gruppe 2',
  'guess-the-price': 'Rangliste: Alex 3 · Sam 3'
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

async function startViral(page, gameId) {
  await seedHub(page);
  await page.goto(`/quick-play.html?game=${encodeURIComponent(gameId)}`);
  await expect(page.locator('script[src="party-viral-modes.js"]')).toHaveCount(1);
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

test('Viral-Treiber decken genau die acht Spiele der Viral-Engine ab', () => {
  expect(Object.keys(drivers).sort()).toEqual([...catalog.viralGameIds].sort());
});

for (const gameId of catalog.viralGameIds) {
  test(`Viral ${gameId}: drei Runden bis Ergebnis, Verlauf genau einmal, Wiederholen bis Ergebnis`, async ({ page }) => {
    const game = catalog.getGame(gameId);
    expect(PLAYERS.length).toBeGreaterThanOrEqual(game.minPlayers);
    expect(PLAYERS.length).toBeLessThanOrEqual(game.maxPlayers);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    await startViral(page, gameId);
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


test('Viral: Doppeltipp auf die letzte Aktion startet keine neue Session', async ({ page }) => {
  await startViral(page, 'finish-the-sentence');
  for (let round = 1; round < ROUNDS; round += 1) {
    await page.getByRole('button', { name: 'Kreativer Treffer' }).click();
    await page.getByRole('button', { name: 'Nächster Satz' }).click();
  }
  await page.getByRole('button', { name: 'Kreativer Treffer' }).click();
  await page.getByRole('button', { name: 'Nächster Satz' }).dblclick();
  await expect(page.locator('#quick-result')).toBeVisible();
  await expect(page.locator('#quick-play')).toBeHidden();
  await expect(page.locator('#quick-final-score')).toHaveText(String(ROUNDS));
  expect(await readActive(page)).toBeNull();
  expect((await readHub(page)).history.filter(entry => entry.gameId === 'finish-the-sentence')).toHaveLength(1);
});
