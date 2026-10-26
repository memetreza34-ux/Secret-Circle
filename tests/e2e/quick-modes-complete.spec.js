'use strict';

/* Issue #41, Welle Quick: Jedes der zehn klassischen Quick-Spiele wird von
   der Einrichtung über drei echte Runden bis zum Ergebnis gespielt und danach
   über „Wiederholen“ ein zweites Mal vollständig. Geprüft werden Punkte,
   genau ein Verlaufseintrag pro beendeter Session, das Aufräumen der aktiven
   Session und dass geheime Inhalte erst nach dem Aufdecken im DOM stehen. */

const { test, expect } = require('@playwright/test');
const catalog = require('../../party-wave-one-clue-catalog.js');

const HUB_KEY = 'secret-circle-party-hub-v1';
const ACTIVE_KEY = 'secret-circle-party-quick-active-v1';
const PLAYERS = ['Alex', 'Sam', 'Mika', 'Lina'];
const ROUNDS = 3;

async function revealGuessCard(page, privateNote) {
  if (privateNote) await expect(page.locator('#quick-private-note')).toBeVisible();
  else await expect(page.locator('#quick-private-note')).toBeHidden();
  await expect(page.locator('#quick-content .challenge-card')).toHaveCount(0);
  await page.getByRole('button', { name: 'Karte anzeigen' }).click();
  await expect(page.locator('#quick-content .challenge-card')).not.toBeEmpty();
}

function guessing(successName, privateNote) {
  return async (page, round) => {
    await revealGuessCard(page, privateNote);
    if (round < ROUNDS) {
      await page.getByRole('button', { name: successName, exact: true }).click();
      return 1;
    }
    await page.getByRole('button', { name: 'Überspringen', exact: true }).click();
    return 0;
  };
}

const drivers = {
  async wavelength(page) {
    /* Das Ziel steht erst nach „Ziel anzeigen“ im DOM. */
    await expect(page.locator('#quick-private-note')).toBeVisible();
    await expect(page.locator('#quick-content')).not.toContainText('Ziel:');
    await page.getByRole('button', { name: 'Ziel anzeigen' }).click();
    const targetText = await page.locator('.spectrum-card strong').textContent();
    const target = Number(targetText.replace(/\D/g, ''));
    expect(target).toBeGreaterThanOrEqual(5);
    await page.getByRole('button', { name: 'Ziel verbergen und Gerät weitergeben' }).click();
    /* Das Team darf das Ziel beim Schätzen nicht mehr sehen. */
    await expect(page.locator('.spectrum-card')).toHaveCount(0);
    await expect(page.locator('#quick-content')).not.toContainText('Ziel:');
    await page.locator('#quick-content input[type="range"]').evaluate((input, value) => {
      input.value = String(value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }, target);
    await page.getByRole('button', { name: 'Position festlegen' }).click();
    await expect(page.locator('#quick-content')).toContainText(`Eure Position: ${target} · Abstand: 0 · 4 Punkte`);
    await page.getByRole('button', { name: 'Nächstes Spektrum' }).click();
    return 4;
  },
  'draw-guess': guessing('Erraten', true),
  'sound-imitation': guessing('Geräusch erraten', true),
  'hum-song': guessing('Melodie erraten', true),
  'forehead-guess': guessing('Begriff erraten', false),
  async 'rapid-fire'(page, round) {
    await page.getByRole('button', { name: /Sekunden starten$/ }).click();
    if (round < ROUNDS) {
      await page.getByRole('button', { name: /^\d+ geschafft$/ }).click();
      await expect(page.locator('#quick-content')).toContainText('Geschafft – 1 Punkt.');
    } else {
      await page.getByRole('button', { name: 'Nicht geschafft' }).click();
      await expect(page.locator('#quick-content')).toContainText('kein Punkt');
    }
    await page.getByRole('button', { name: 'Nächste Challenge' }).click();
    return round < ROUNDS ? 1 : 0;
  },
  async 'letter-categories'(page, round) {
    await expect(page.locator('#quick-content .letter-card')).toHaveText(/^[A-Z]$/);
    const categories = await page.locator('#quick-content .category-list li').count();
    expect(categories).toBeGreaterThan(0);
    await page.getByRole('button', { name: '60 Sekunden starten' }).click();
    await page.getByRole('button', { name: 'Vorzeitig auswerten' }).click();
    /* Runde 3 gibt bewusst zu viele Punkte ein: Die Engine begrenzt auf die
       Zahl der Kategorien. */
    const entered = round === 1 ? 2 : round === 2 ? 0 : 99;
    await page.getByRole('spinbutton', { name: 'Gültige einzigartige Antworten' }).fill(String(entered));
    await page.getByRole('button', { name: 'Punkte übernehmen' }).click();
    return Math.min(categories, entered);
  },
  async 'dont-laugh'(page, round) {
    await page.getByRole('button', { name: '30 Sekunden starten' }).click();
    const laughed = round !== 2;
    await page.getByRole('button', { name: laughed ? 'Jemand hat gelacht' : 'Alle blieben ernst' }).click();
    await expect(page.locator('#quick-content')).toContainText(laughed ? 'Mission erfüllt – 1 Punkt.' : 'Die Gruppe blieb ernst.');
    await page.getByRole('button', { name: 'Nächste Person' }).click();
    return laughed ? 1 : 0;
  },
  async 'scavenger-hunt'(page, round) {
    await page.getByRole('button', { name: '60 Sekunden starten' }).click();
    const found = round !== 3;
    await page.getByRole('button', { name: found ? 'Gegenstand gefunden' : 'Nicht gefunden' }).click();
    await expect(page.locator('#quick-content')).toContainText(found ? 'Gefunden – 1 Punkt.' : 'Kein passender Gegenstand gefunden.');
    await page.getByRole('button', { name: 'Nächste Suche' }).click();
    return found ? 1 : 0;
  },
  async 'caption-battle'(page, round) {
    await page.getByRole('button', { name: 'Captions sind bereit' }).click();
    await page.getByRole('combobox', { name: 'Gewinner dieser Runde' }).selectOption(round === 2 ? 'Mika' : 'Sam');
    await page.getByRole('button', { name: 'Gewinner bestätigen' }).click();
    return 1;
  }
};

const expectedRanking = {
  wavelength: 'Team 12',
  'letter-categories': 'Gruppe',
  'scavenger-hunt': 'Gruppe 2',
  'caption-battle': 'Sam 2 · Mika 1'
};

async function readHub(page) {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), HUB_KEY);
}

async function playSession(page, gameId) {
  let expected = 0;
  for (let round = 1; round <= ROUNDS; round += 1) {
    await expect(page.locator('#quick-progress')).toHaveText(`Runde ${round} von ${ROUNDS}`);
    const active = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
    expect(active.gameId).toBe(gameId);
    expect(active.round).toBe(round);
    expected += await drivers[gameId](page, round);
  }
  await expect(page.locator('#quick-result')).toBeVisible();
  await expect(page.locator('#quick-play')).toBeHidden();
  await expect(page.locator('#quick-final-score')).toHaveText(String(expected));
  return expected;
}

test('Quick-Treiber decken genau die zehn Spiele der Quick-Engine ab', () => {
  expect(Object.keys(drivers).sort()).toEqual([...catalog.trendingGameIds].sort());
});

for (const gameId of catalog.trendingGameIds) {
  test(`Quick ${gameId}: drei Runden bis Ergebnis, Verlauf genau einmal, Wiederholen bis Ergebnis`, async ({ page }) => {
    const game = catalog.getGame(gameId);
    expect(PLAYERS.length).toBeGreaterThanOrEqual(game.minPlayers);
    expect(PLAYERS.length).toBeLessThanOrEqual(game.maxPlayers);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    await page.goto('/party.html');
    await page.evaluate(({ key, players }) => {
      localStorage.clear();
      localStorage.setItem(key, JSON.stringify({
        version: 1, players, favorites: [], recent: [], presets: [], history: [], stats: {}
      }));
    }, { key: HUB_KEY, players: PLAYERS });

    await page.goto(`/quick-play.html?game=${encodeURIComponent(gameId)}`);
    await expect(page.locator('#quick-title')).toHaveText(game.title);
    await page.locator('#quick-rounds').selectOption(String(ROUNDS));
    await page.locator('#quick-start').click();
    await expect(page.locator('#quick-play')).toBeVisible();

    const firstScore = await playSession(page, gameId);
    if (expectedRanking[gameId]) await expect(page.locator('#quick-result-text')).toContainText(expectedRanking[gameId]);
    expect(await page.evaluate(key => localStorage.getItem(key), ACTIVE_KEY)).toBeNull();

    let hub = await readHub(page);
    let entries = hub.history.filter(entry => entry.gameId === gameId);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ rounds: ROUNDS, score: firstScore, players: PLAYERS });
    expect(hub.stats[gameId]).toEqual({ plays: 1, rounds: ROUNDS, best: firstScore });
    expect(hub.recent[0]).toBe(gameId);

    /* Neu laden darf den Abschluss weder wiederholen noch eine alte Session anbieten. */
    await page.reload();
    await expect(page.locator('#quick-resume-box')).toBeHidden();
    hub = await readHub(page);
    expect(hub.history.filter(entry => entry.gameId === gameId)).toHaveLength(1);

    /* Wiederholen über die Ergebnisseite: neue Session mit gleicher Einstellung. */
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
    expect(hub.stats[gameId]).toEqual({
      plays: 3,
      rounds: ROUNDS * 3,
      best: Math.max(firstScore, secondScore, thirdScore)
    });

    const next = page.locator('#quick-next-game');
    await expect(next).toHaveAttribute('href', /^quick-play\.html\?game=[a-z0-9-]+$/);
    expect(await next.getAttribute('data-next-game-id')).not.toBe(gameId);
    expect(errors).toEqual([]);
  });
}

async function startQuick(page, gameId) {
  await page.goto('/party.html');
  await page.evaluate(({ key, players }) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({
      version: 1, players, favorites: [], recent: [], presets: [], history: [], stats: {}
    }));
  }, { key: HUB_KEY, players: PLAYERS });
  await page.goto(`/quick-play.html?game=${encodeURIComponent(gameId)}`);
  await page.locator('#quick-rounds').selectOption(String(ROUNDS));
  await page.locator('#quick-start').click();
  await expect(page.locator('#quick-play')).toBeVisible();
}

for (const gameId of ['draw-guess', 'sound-imitation', 'hum-song', 'forehead-guess']) {
  test(`Quick ${gameId}: Neuladen bei offener Karte deckt sie wieder zu, Karte bleibt dieselbe`, async ({ page }) => {
    await startQuick(page, gameId);
    await page.getByRole('button', { name: 'Karte anzeigen' }).click();
    const secret = await page.locator('#quick-content .challenge-card').textContent();
    expect(secret.trim()).not.toBe('');

    await page.reload();
    await page.getByRole('button', { name: 'Fortsetzen' }).click();
    await expect(page.locator('#quick-progress')).toHaveText(`Runde 1 von ${ROUNDS}`);
    await expect(page.locator('#quick-content .challenge-card')).toHaveCount(0);
    await expect(page.locator('#quick-content')).not.toContainText(secret);
    const stored = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), ACTIVE_KEY);
    expect(stored.phase).toBe('ready');

    await page.getByRole('button', { name: 'Karte anzeigen' }).click();
    await expect(page.locator('#quick-content .challenge-card')).toHaveText(secret);
  });
}

test('Quick wavelength: Ziel erscheint erst nach Übergabe, auch in Folgerunden und nach Neuladen', async ({ page }) => {
  await startQuick(page, 'wavelength');
  await expect(page.locator('#quick-content')).toContainText('Gerät an Alex geben');
  await expect(page.locator('#quick-content')).not.toContainText('Ziel:');
  await page.getByRole('button', { name: 'Ziel anzeigen' }).click();
  const target = await page.locator('.spectrum-card strong').textContent();

  /* Neuladen, während das Ziel offen ist: wieder verdeckt, aber dasselbe Ziel. */
  await page.reload();
  await page.getByRole('button', { name: 'Fortsetzen' }).click();
  await expect(page.locator('#quick-content')).not.toContainText('Ziel:');
  await page.getByRole('button', { name: 'Ziel anzeigen' }).click();
  await expect(page.locator('.spectrum-card strong')).toHaveText(target);

  await page.getByRole('button', { name: 'Ziel verbergen und Gerät weitergeben' }).click();
  await page.getByRole('button', { name: 'Position festlegen' }).click();
  await page.getByRole('button', { name: 'Nächstes Spektrum' }).click();
  /* Wer weitertippt, sieht das Ziel der nächsten Person nicht. */
  await expect(page.locator('#quick-progress')).toHaveText(`Runde 2 von ${ROUNDS}`);
  await expect(page.locator('#quick-content')).toContainText('Gerät an Sam geben');
  await expect(page.locator('#quick-content')).not.toContainText('Ziel:');
});

test('Quick: Doppeltipp auf die letzte Aktion startet keine neue Session', async ({ page }) => {
  await startQuick(page, 'draw-guess');
  for (let round = 1; round < ROUNDS; round += 1) {
    await page.getByRole('button', { name: 'Karte anzeigen' }).click();
    await page.getByRole('button', { name: 'Erraten', exact: true }).click();
  }
  await page.getByRole('button', { name: 'Karte anzeigen' }).click();
  await page.getByRole('button', { name: 'Erraten', exact: true }).dblclick();

  await expect(page.locator('#quick-result')).toBeVisible();
  await expect(page.locator('#quick-play')).toBeHidden();
  await expect(page.locator('#quick-final-score')).toHaveText(String(ROUNDS));
  expect(await page.evaluate(key => localStorage.getItem(key), ACTIVE_KEY)).toBeNull();
  const hub = await readHub(page);
  expect(hub.history.filter(entry => entry.gameId === 'draw-guess')).toHaveLength(1);

  /* Der Fokus landet im Ergebnis; nach der kurzen Sperre ist „Wiederholen“ bedienbar. */
  await expect(page.locator('#quick-result-title')).toBeFocused();
  await expect(page.locator('#quick-result .inline-actions')).not.toHaveAttribute('aria-disabled', 'true');
  await page.locator('#quick-replay').click();
  await expect(page.locator('#quick-play')).toBeVisible();
  await expect(page.locator('#quick-progress')).toHaveText(`Runde 1 von ${ROUNDS}`);
});
