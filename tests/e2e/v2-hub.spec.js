const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';
const ACTIVE_KEY = 'secret-circle-party-hub-active-v1';

// Ein verspäteter Updatehinweis wird über denselben Bedienweg vertagt wie im Spiel.
// Die eigenen Update-/Offline-Tests prüfen Aktivierung und Session-Schutz separat.
test.beforeEach(async ({ page }) => {
  await page.addLocatorHandler(page.locator('.pwa-update-banner'), async notice => {
    await notice.getByRole('button', { name: 'Später', exact: true }).click();
  });
});

function captureErrors(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  return errors;
}

async function seedHub(page, hub = {}) {
  await page.goto('/v2-hub.html');
  await page.evaluate(({ key, value }) => {
    localStorage.clear();
    localStorage.setItem(key, JSON.stringify({
      version: 1, players: ['Alex', 'Sam', 'Mika', 'Lina'], favorites: [], recent: [], presets: [], history: [], stats: {}, ...value
    }));
  }, { key: HUB_KEY, value: hub });
}

async function openV2(page, hash = '') {
  await page.goto(`/v2-hub.html${hash}`);
  await expect(page.locator('#app')).toBeVisible();
}

test('start screen renders from the real catalog without invented claims', async ({ page }) => {
  const errors = captureErrors(page);
  await seedHub(page);
  await openV2(page);
  await expect(page.locator('[data-screen="home"]')).toBeVisible();
  await expect(page.locator('#hero-badge')).toHaveText('Empfehlung');
  await expect(page.locator('#sections')).toContainText('Empfohlen');
  await expect(page.locator('#sections')).not.toContainText('Eure meistgespielten');
  await expect(page.locator('#sections')).not.toContainText('Zuletzt gespielt');
  await expect(page.locator('#resume-slot')).toBeEmpty();
  expect(errors).toEqual([]);
});

const gameIds = require('../../party-wave-one-clue-catalog.js').games.map(game => game.id);
const artwork = {
  "two-truths": "Eine Spielerin prüft drei Karten, während ihr Mitspieler betont unschuldig lächelt",
  "word-chain": "Zwei Spielerinnen verbinden ein rotes und ein gelbes Kettenglied",
  "hot-potato": "Zwei Spieler geben eine dampfende Kartoffel hektisch weiter",
  "taboo": "Ein Showmaster erklärt am Mikrofon einen Begriff, während er eine Karte mit Regenschirmmotiv hält",
  "charades": "Eine Pantomimin mit rotem Halstuch und weißen Handschuhen spielt eine unsichtbare Wand",
  "imposter": "Ein ertappter Spieler zieht die Schultern hoch, während eine Mitspielerin grinsend auf ihn zeigt",
  "truth-dare": "Eine Spielerin wählt grinsend zwischen einer Karte mit Sprechblase und einer mit Blitz",
  "mafia": "Eine Detektivin im violetten Mantel lässt eine Rollenkarte verschwinden, während ein Mitspieler zurückblickt",
  "never-have": "Eine Spielerin legt sich lächelnd die Hand auf die Brust, während ihr Mitspieler überrascht lacht",
  "question-imposter": "Zwei Spieler halten unterschiedliche Fragekarten mit Sonne und Mond nebeneinander",
  "location-spy": "Eine Spionin schaut irritiert auf einen Stadtplan, während ihr Mitspieler auf die Ortsmarkierung zeigt",
  "most-likely": "Eine Spielerin zeigt auf ihren überraschten Mitspieler, der auf sich selbst deutet",
  "would-rather": "Ein Spieler wägt zwischen einer Eistüte und einem Stück Pizza ab",
  "paranoia": "Eine Spielerin flüstert ihrer Nachbarin etwas zu, während ein Mitspieler neugierig hinsieht",
  "wrong-answers": "Ein Spieler präsentiert mit ernster Miene einen Turnschuh in einer Müslischale",
  "wavelength": "Ein Spieler stellt den Zeiger auf einer farbigen Halbkreisskala ein",
  "rapid-fire": "Ein Spieler nennt unter Zeitdruck Antworten und hält eine große Stoppuhr",
  "forehead-guess": "Ein Spieler trägt eine Fahrradkarte an der Stirn, während eine Mitspielerin einen Hinweis gestikuliert",
  "who-am-i": "Ein Spieler rätselt über seine geheime Rolle. Neben ihm erscheint eine Astronautin als mögliche Antwort",
  "anime-guess": "Zwei Stammfiguren stellen eine Magieschülerin und einen Abenteurer in selbst erfundenen Kostümen dar",
  "blind-ranking": "Eine Spielerin setzt einen Cupcake auf eine Rangstufe, während weitere Optionen verdeckt bleiben",
  "put-a-finger-down": "Ein Spieler klappt mit ertapptem Grinsen einen Finger ein",
  "higher-lower": "Ein Spieler entscheidet zwischen einem Pfeil nach oben und einem Pfeil nach unten",
  "undercover-similar-word": "Zwei Spielerinnen halten ähnliche Hinweiskarten mit einer Orange und einer Zitrone",
  "bluff-trivia": "Ein Spieler präsentiert einen angeblich echten Toaster mit Flügeln, während sein Mitspieler zweifelt",
  "hot-takes": "Eine Spielerin vertritt am Tisch ihre Meinung und die Runde reagiert überrascht",
  "money-challenge": "Ein Spieler wägt eine goldene Spielmünze gegen eine geheimnisvolle Aufgabenschachtel ab",
  "red-green-flag": "Eine Spielerin hält eine rote und eine grüne Flagge hoch und wägt beide ab",
  "tier-list": "Zwei Spieler diskutieren, in welches Fach eines farbigen Rangregals ein roter Becher gehört",
  "hear-me-out": "Ein Spieler verteidigt mit großer Geste eine Ananas als unerwartete Wahl",
  "pass-the-phone": "Eine Spielerin reicht ihr Handy an die überraschte Mitspielerin weiter",
  "know-me-best": "Eine Spielerin hält ihre Wahl verdeckt, während ihr Mitspieler versucht, sie zu erraten",
  "sound-imitation": "Ein Spieler ahmt das Heulen eines Wolfs nach",
  "hum-song": "Eine Spielerin summt mit geschlossenem Mund. Neben ihr sind Musiknoten zu sehen",
  "password-one-word": "Eine Spielerin hebt einen Finger für den einzigen Hinweis. Ihr Mitspieler hat einen Einfall",
  "draw-guess": "Eine Spielerin zeichnet einen Regenschirm, ihr Mitspieler scheint das Motiv zu erraten",
  "caption-battle": "Eine Spielerin zeigt ein kurioses Foto, während ihr Mitspieler mit einem Stift eine Bildunterschrift vorbereitet",
  "story-chain": "Zwei Spieler reichen ein aufgeschlagenes Buch weiter und erzählen die Geschichte gemeinsam",
  "finish-the-sentence": "Ein Spieler deutet mit einem Stift auf die leere Stelle am Ende einer Sprechblase",
  "fill-blank-battle": "Zwei Spielerinnen schieben unterschiedliche Antworten auf dieselbe Lücke zu",
  "who-wrote-it": "Eine Spielerin betrachtet einen anonymen Zettel und mustert ihren Mitspieler",
  "emoji-quiz": "Zwei Spieler lösen mit einer Sonne und einer Brille das Bilderrätsel Sonnenbrille",
  "guess-the-price": "Eine grauhaarige Spielerin schätzt den Preis eines Toasters mit leerem Preisschild",
  "fact-or-fake": "Eine Spielerin entscheidet zwischen einem Häkchen und einem Kreuz",
  "percent-guess": "Eine Spielerin schätzt den Füllstand eines Glases mit bunten Kugeln",
  "party-bracket": "Ein Spieler hebt den Pokal über einem vereinfachten Turnierbaum mit zwei Finalisten",
  "spin-bottle": "Ein Spieler dreht eine leere Flasche auf einem runden Tisch, zwei Mitspielerinnen schauen zu",
  "dice-coin": "Ein Spieler wirft eine goldene Münze hoch. Neben ihm ist ein großer Würfel zu sehen",
  "letter-categories": "Eine Spielerin sortiert eine Buchstabenkarte mit A neben Karten mit Apfel und Flugzeug",
  "dont-laugh": "Ein Spieler versucht ernst zu bleiben, während eine Mitspielerin eine Grimasse schneidet",
  "scavenger-hunt": "Eine Spielerin eilt mit einem gefundenen blauen Turnschuh zurück",
  "secret-mission": "Eine Spielerin stellt heimlich eine kleine Spielzeugente ab und blickt über die Schulter",
  "hot-seat": "Ein Spieler sitzt im Scheinwerferlicht auf einem Sessel und beantwortet schnelle Fragen",
  "no-word-imposter": "Ein Spieler hebt ratlos die leere Hand, während seine Mitspieler den Hinweis kennen",
  "party-quiz": "Ein Spieler mit runder Brille drückt den roten Quizbuzzer, während eine Mitspielerin jubelt"
};
async function expectArtwork(image, id) {
  await expect(image).toHaveAttribute('src', 'assets/images/' + id + '.webp');
  await expect(image).toHaveAttribute('alt', artwork[id]);
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate(el => el.complete && el.naturalWidth === 800 && el.naturalHeight === 600)).toBe(true);
}

test('game artwork loads locally in cards, banner and details with readable mobile titles', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await seedHub(page);
  await openV2(page);
  await expectArtwork(page.locator('#hero-art img'), 'imposter');
  await expect(page.locator('#hero-title')).toBeVisible();
  const bannerBottom = await page.locator('.hero-art').evaluate(el => el.getBoundingClientRect().bottom);
  const titleTop = await page.locator('#hero-title').evaluate(el => el.getBoundingClientRect().top);
  expect(bannerBottom).toBeLessThanOrEqual(titleTop);

  await openV2(page, '#spiele');
  expect(Object.keys(artwork).sort()).toEqual(gameIds.slice().sort());
  expect(gameIds).toHaveLength(55);
  await expect(page.locator('#grid .gcard img')).toHaveCount(55);
});

const artworkIds = Object.keys(artwork);
for (let offset = 0; offset < artworkIds.length; offset += 14) {
  const ids = artworkIds.slice(offset, offset + 14);
  test('game artwork loads in every card, batch ' + (offset / 14 + 1), async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await seedHub(page);
    await openV2(page, '#spiele');
    for (const id of ids) {
      const card = page.locator('#grid [data-game-id="' + id + '"]');
      await card.scrollIntoViewIfNeeded();
      await expectArtwork(card.locator('img'), id);
    }
  });
  test('game artwork loads in every detail, batch ' + (offset / 14 + 1), async ({ page }) => {
    await seedHub(page);
    for (const id of ids) {
      await openV2(page, '#spiel=' + id);
      await expectArtwork(page.locator('#mode-emblem img'), id);
    }
  });
}

test('games screen lists all 55 games in six non-empty colour worlds', async ({ page }) => {
  await seedHub(page);
  await openV2(page, '#spiele');
  await expect(page.locator('#grid .gcard')).toHaveCount(55);
  const chips = await page.locator('#filters .chip').allTextContents();
  expect(chips[0]).toBe('Alle 55');
  const counts = chips.slice(1).map(text => Number(text.match(/(\d+)$/)[1]));
  expect(counts).toHaveLength(6);
  expect(counts.every(count => count > 0)).toBe(true);
  expect(counts.reduce((sum, count) => sum + count, 0)).toBe(55);

  await page.locator('#q').fill('Spektrum');
  await expect(page.locator('#grid .gcard')).toHaveCount(1);
  await page.locator('#grid .gcard').first().click();
  await expect(page.locator('#mode-title')).toHaveText('Spektrum-Tipp');
});

test('a hub game starts in the real engine with the chosen category and returns afterwards', async ({ page }) => {
  await seedHub(page);
  await openV2(page, '#spiel=never-have');
  await expect(page.locator('#mode-title')).toHaveText('Ich habe noch nie');
  await page.locator('#pack-row').click();
  const packs = page.locator('#pack-list .pack-row');
  await expect(packs.first().locator('.row-main')).toHaveText('Gemischt');
  await expect(packs.first()).toHaveAttribute('aria-pressed', 'true');
  const second = (await packs.nth(2).locator('.row-main').textContent()).trim();
  await packs.nth(2).click();
  await expect(page.locator('#pack-value')).toHaveText(second);

  await page.locator('#start-btn').click();
  await expect(page).toHaveURL(/party\.html\?from=v2$/);
  await expect(page.locator('#play-layer')).toBeVisible();
  await expect(page.locator('#play-eyebrow')).toHaveText(second);

  await page.locator('#play-actions button').first().click();
  await page.locator('#finish-hub-game').click();
  await expect(page).toHaveURL(/v2-hub\.html$/);
  const recentStrip = page.locator('#sections .sec').first();
  await expect(recentStrip).toContainText('Zuletzt gespielt');
  await expect(recentStrip.locator('.gcard')).toHaveCount(1);

  await page.getByRole('tab', { name: 'Profil' }).click();
  await expect(page.locator('#profile-stats')).toContainText('1Sessions');
  await expect(page.locator('#profile-recent .row')).toHaveCount(1);
  await expect(page.locator('#profile-recent')).toContainText('Alex, Sam, Mika, Lina');
  await expect(page.locator('#resume-slot')).toBeEmpty();
});

test('"Gemischt" spielt Karten aus allen Kategorien und lässt sich nach dem Neuladen fortsetzen', async ({ page }) => {
  await seedHub(page);
  await openV2(page, '#spiel=never-have');
  await expect(page.locator('#pack-value')).toHaveText('Gemischt');
  await page.locator('#start-btn').click();
  await expect(page.locator('#play-layer')).toBeVisible();
  await expect(page.locator('#play-eyebrow')).toHaveText('Gemischt');
  const card = (await page.locator('#play-content').textContent()).trim();
  const stored = await page.evaluate(key => JSON.parse(localStorage.getItem(key)).session, ACTIVE_KEY);
  expect(stored.pack).toBe('Gemischt');

  await page.reload();
  await page.getByRole('button', { name: 'Session fortsetzen' }).click();
  await expect(page.locator('#play-layer')).toBeVisible();
  await expect(page.locator('#play-content')).toHaveText(card);
});

test('a linked game opens its own engine page', async ({ page }) => {
  await seedHub(page);
  await openV2(page, '#spiel=wavelength');
  await expect(page.locator('#pack-row')).toBeHidden();
  await page.locator('#start-btn').click();
  await expect(page).toHaveURL(/quick-play\.html\?game=wavelength$/);
  await expect(page.getByRole('heading', { name: 'Spektrum-Tipp' })).toBeVisible();
  await page.getByRole('link', { name: '← Alle Spiele' }).click();
  await expect(page).toHaveURL(/v2-hub\.html$/);
});

test('the start button opens the shared player list until enough people are ready', async ({ page }) => {
  await seedHub(page, { players: ['Alex'] });
  await openV2(page, '#spiel=never-have');
  await expect(page.locator('#start-btn')).toHaveText('Personen hinzufügen');
  await expect(page.locator('#start-note')).toContainText('fehlen noch');

  await page.locator('#start-btn').click();
  await expect(page.locator('#player-input')).toBeFocused();
  await expect(page.locator('#players-done')).toBeDisabled();
  await page.locator('#player-input').fill('Sam');
  await page.locator('#player-add').click();
  await expect(page.locator('#player-badge')).toHaveText('2/20');
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).players, HUB_KEY)).toEqual(['Alex', 'Sam']);

  await expect(page.locator('#players-done')).toHaveText('Weiter zum Spiel');
  await page.locator('#players-done').click();
  await expect(page.locator('#start-btn')).toHaveText('Spiel starten');
  await page.locator('#start-btn').click();
  await expect(page.locator('#play-layer')).toBeVisible();
});

test('home offers the catalog and search, and game details show one set of rules', async ({ page }) => {
  await openV2(page);
  await expect(page.getByRole('heading', { name: '55 Partyspiele auf einem Handy.' })).toBeVisible();
  await page.getByRole('button', { name: 'Alle Spiele', exact: true }).click();
  await expect(page.locator('#grid-count')).toHaveText('55');

  await page.getByRole('tab', { name: 'Start' }).click();
  await page.getByRole('button', { name: 'Suchen', exact: true }).click();
  await expect(page.getByRole('searchbox', { name: 'Spiel suchen' })).toBeFocused();
  await page.locator('#q').fill('Mafia');
  await page.locator('#grid [data-game-id="mafia"]').click();
  const rules = page.getByRole('region', { name: 'Spielregeln' });
  await expect(rules.getByRole('listitem')).toHaveCount(4);
  await expect(page.getByRole('button', { name: 'Ansehen', exact: true })).toHaveCount(0);
});

test('a delayed update notice can be deferred while adding players without activating it', async ({ page }) => {
  await seedHub(page, { players: ['Alex'] });
  await openV2(page, '#spiel=never-have');
  await page.locator('#players-row').click();
  await page.locator('#player-input').fill('Sam');
  await page.evaluate(() => {
    window.__updateMessages = [];
    window.SecretCircleRuntime.showUpdate({ postMessage: message => window.__updateMessages.push(message) });
  });
  const notice = page.locator('.pwa-update-banner');
  expect(await notice.isVisible()).toBe(true);
  await page.locator('#player-add').click();
  await expect(page.locator('#player-badge')).toHaveText('2/20');
  await expect(notice).toBeHidden();
  await expect(notice).toHaveCount(1);
  expect(await page.evaluate(() => window.__updateMessages)).toEqual([]);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).players, HUB_KEY)).toEqual(['Alex', 'Sam']);
  await page.locator('#players-done').click();
  await expect(page.locator('#start-btn')).toBeEnabled();
});

test('first-time hero setup leads back to the chosen game with its actual player minimum', async ({ page }) => {
  await seedHub(page, { players: [] });
  await openV2(page);
  await page.locator('#hero-play').click();
  await expect(page.locator('#player-hint')).toContainText('3 Personen nötig für Word Imposter');
  await expect(page.locator('#players-done')).toBeDisabled();
  for (const name of ['Alex', 'Sam', 'Mika']) {
    await page.locator('#player-input').fill(name);
    await page.locator('#player-add').click();
  }
  await page.locator('#players-done').click();
  await expect(page.locator('#mode-title')).toHaveText('Word Imposter');
  await expect(page.locator('#start-btn')).toHaveText('Spiel einrichten');
  await page.locator('#start-btn').click();
  await expect(page).toHaveURL(/word-imposter\.html$/);
  await expect(page.locator('#players')).toHaveValue('Alex\nSam\nMika');
});

test('Namen in der gemeinsamen Spielerliste lassen sich direkt ändern', async ({ page }) => {
  await seedHub(page);
  await openV2(page, '#spiel=never-have');
  await page.locator('#players-row').click();
  const first = page.getByRole('textbox', { name: 'Spieler 1' });
  await first.fill('Alexander');
  await first.press('Enter');
  await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key)).players, HUB_KEY)).toEqual(['Alexander', 'Sam', 'Mika', 'Lina']);

  const second = page.getByRole('textbox', { name: 'Spieler 2' });
  await second.fill('mika');
  await second.press('Enter');
  await expect(page.locator('#player-hint')).toContainText('mika steht schon in der Liste');
  await expect(page.getByRole('textbox', { name: 'Spieler 2' })).toHaveValue('Sam');
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).players, HUB_KEY)).toEqual(['Alexander', 'Sam', 'Mika', 'Lina']);
});

test('a stored session is offered only in the profile and resumes in its engine', async ({ page }) => {
  await seedHub(page);
  await openV2(page, '#spiel=never-have');
  await page.locator('#start-btn').click();
  await expect(page.locator('#play-layer')).toBeVisible();
  await page.locator('#play-actions button').first().click();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).session.gameId, ACTIVE_KEY)).toBe('never-have');

  await openV2(page);
  await expect(page.locator('[data-screen="home"] .resume')).toHaveCount(0);
  await page.getByRole('tab', { name: 'Profil' }).click();
  await expect(page.locator('#resume-slot .resume')).toHaveCount(1);
  await expect(page.locator('#resume-slot')).toContainText('Ich habe noch nie');
  await page.locator('#resume-slot .resume-go').click();
  await expect(page).toHaveURL(/party\.html\?from=v2$/);
  await expect(page.getByRole('button', { name: 'Session fortsetzen' })).toBeEnabled();
});

test('"most played" appears only once there is real history', async ({ page }) => {
  const history = ['charades', 'taboo', 'charades', 'paranoia'].map((gameId, index) => ({
    id: `hub-${gameId}-${index}`, gameId, title: gameId, endedAt: new Date().toISOString(), rounds: 2, score: 0
  }));
  await seedHub(page, { history });
  await openV2(page);
  await expect(page.locator('#hero-badge')).toHaveText('Meistgespielt');
  await expect(page.locator('#sections')).toContainText('Eure meistgespielten');
  await expect(page.locator('#sections')).not.toContainText('Empfohlen');
  await expect(page.locator('#hero-title')).toHaveText('Scharade');
});

test('Datenschutz: Daten sichern oder löschen zeigt nur die Datenansicht und führt zurück ins Profil', async ({ page }) => {
  await page.goto('/v2-hub.html#profil');
  await expect(page.getByRole('link', { name: /Partyabend planen/ })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Eigenes Spiel erstellen/ })).toHaveCount(0);
  await expect(page.getByRole('link', { name: /Daten und eigene Inhalte/ })).toHaveCount(0);
  await page.locator('[data-screen="profile"] [data-open="profile-privacy"]').click();
  await page.getByRole('link', { name: 'Daten sichern oder löschen' }).click();
  await expect(page).toHaveURL(/party\.html\?view=settings&from=v2/);
  await expect(page.locator('#settings-title')).toBeVisible();
  await expect(page.locator('.hub-nav')).toBeHidden();
  await page.getByRole('link', { name: '← Profil' }).click();
  await expect(page).toHaveURL(/v2-hub\.html#profil$/);
  await expect(page.locator('[data-screen="profile"]')).toBeVisible();
});

test('kaputte URL-Fragmente blockieren weder den Hub-Start noch spätere Navigation', async ({ page }) => {
  const errors = captureErrors(page);

  for (const route of ['/index.html#spiel=%E0%A4%A', '/v2-hub.html#%', '/#spiel=%FF']) {
    const response = await page.goto(route);
    expect(response?.ok(), route).toBe(true);
    await expect(page.locator('[data-screen="home"]')).toBeVisible();
    await expect(page.locator('#hero-play')).toBeEnabled();
  }

  await page.goto('/#spiele');
  await expect(page.locator('[data-screen="games"]')).toBeVisible();
  await page.evaluate(() => { window.location.hash = '#spiel=%'; });
  await expect(page.locator('[data-screen="home"]')).toBeVisible();
  await expect(page.locator('#hero-play')).toBeEnabled();
  expect(errors).toEqual([]);
});
