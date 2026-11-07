const { test, expect } = require('@playwright/test');

const HUB_KEY = 'secret-circle-party-hub-v1';
const ACTIVE_KEY = 'secret-circle-party-hub-active-v1';

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
  "two-truths": "Fuchs-Abenteurer erzählt vom Bergsteigen, Zelten und einem erfundenen Flug auf einem Papierflieger",
  "word-chain": "Zugbegleiterin verbindet drei Waggons mit Apfel, Lampe und Elefant zu einer Wortkette",
  "hot-potato": "Dampfende Kartoffel fliegt zwischen zwei Ofenhandschuhen; im Hintergrund läuft eine Sanduhr",
  "taboo": "Klassischer Showmaster erklärt am Mikrofon einen Begriff; seine Karte zeigt einen Regenschirm und drei verbotene Hinweisbilder",
  "charades": "Klassischer Pantomime mit Baskenmütze und weißen Handschuhen spielt eine unsichtbare Wand vor; daneben steht eine Sanduhr",
  "imposter": "Chamäleon blufft mit leerer Karte zwischen zwei gleichen Schlüssel-Hinweisen",
  "truth-dare": "Bühnenmagier legt seine Maske ab, während eine Stuntfigur eine Mutprobe vorführt",
  "mafia": "Kater flüstert einem Mitspieler heimlich etwas zu, während eine Detektivin die Absprache bemerkt",
  "never-have": "Elefanten-Abenteurer hebt ertappt die Hand und erinnert sich daran, wie er in einem viel zu kleinen Zelt übernachtet hat",
  "question-imposter": "Vier Retro-Roboter vergleichen Fragekarten: drei zeigen eine Sonne, der nervöse vierte einen Mond",
  "location-spy": "Verunsicherter Otter-Spion späht mit leerem Notizbuch hinter einer Palme in eine Hotellobby",
  "most-likely": "Überraschter Igel zeigt auf sich, während vier Pfoten und Flügel gleichzeitig auf ihn deuten",
  "would-rather": "Faultier an einer Weggabelung schwankt zwischen einer Eistüte und einem Stück Pizza",
  "paranoia": "Zwei Erdmännchen flüstern hinter einer Pfote, während ein drittes misstrauisch zu ihnen zurückschaut",
  "wrong-answers": "Ziegenprofessor präsentiert stolz eine absichtlich falsche Antwort: einen Fisch auf einem Fahrrad",
  "wavelength": "Pinguin balanciert zwischen einem Eiswürfel und einer warmen Sonne auf einem Seil",
  "rapid-fire": "Gepard sprintet mit einer Stoppuhr in der Pfote an vorbeifliegenden Gegenständen vorbei",
  "forehead-guess": "Lama trägt ein Bilderrätsel am Stirnband, das nur seine kichernden Freunde sehen können",
  "who-am-i": "Verkleidete Rätselfigur betrachtet im Spiegel die möglichen Rollen Astronaut, Koch und Ritter",
  "anime-guess": "Drei eigenständige Rollenfiguren mit Schal, Zauberstab und Umhang stehen auf einer Bühne",
  "blind-ranking": "Maulwurf mit Augenbinde setzt eine Gummiente auf eine Stufe eines fünfstufigen Podests",
  "put-a-finger-down": "Oktopus rollt einen weiteren Arm ein, während andere Arme noch aufgerichtet sind",
  "higher-lower": "Bergziege steht zwischen einer Treppe nach oben und einer Treppe nach unten",
  "undercover-similar-word": "Limette versucht unauffällig zwischen vier fröhlichen Zitronen zu stehen",
  "bluff-trivia": "Pfau im Jackett erklärt selbstbewusst eine erfundene Museums-Erfindung: eine Teekanne mit Flügeln",
  "hot-takes": "Chilischote hält auf einer Kiste eine leidenschaftliche Rede, während das Gemüsepublikum überrascht reagiert",
  "money-challenge": "Hamster im Geschäftsanzug überlegt vor einem fliegenden Sparschwein mit schlichten goldenen Münzen",
  "red-green-flag": "Flamingo-Schiedsrichter wägt zwischen einer roten und einer grünen Flagge ab",
  "tier-list": "Giraffe überlegt, auf welches von fünf farbigen Regalbrettern sie einen Donut einordnen soll",
  "hear-me-out": "Kleine Maus verteidigt auf einer großen Bühne am Mikrofon leidenschaftlich eine Ananas",
  "pass-the-phone": "Detektivin reicht dem überraschten Chamäleon eine Gesprächskarte und übergibt ihm den nächsten Zug",
  "know-me-best": "Hund denkt an Knochen, Ball oder Socke, während zwei Freunde seine Wahl zu erraten versuchen",
  "sound-imitation": "Chamäleon erzeugt mit aufgeblasenen Backen Geräusche; Schallwellen zeigen Kuh, Zug und Vogel",
  "hum-song": "Wal summt mit geschlossenen Augen; Notenblasen steigen im Wasser auf",
  "password-one-word": "Chamäleon zeigt mit einem erhobenen Finger genau einen Hinweis an; die Detektivin errät das verdeckt gehaltene Schlüsselmotiv",
  "draw-guess": "Känguru zeichnet mit einem großen Wachsstift ein unfertiges Bilderrätsel auf Papier",
  "caption-battle": "Galeriebild einer Kuh auf einem Skateboard ist von leeren Sprechblasen für Bildunterschriften umgeben",
  "story-chain": "Offene Bücher bilden eine Brücke; Figuren setzen den Weg von einer Buchseite zur nächsten fort",
  "finish-the-sentence": "Frau zeichnet mit einer Schreibfeder ein leuchtendes Fragezeichen in die Luft; ein Eichhörnchen schaut neugierig zu",
  "fill-blank-battle": "Chamäleon und Detektivin bieten Banane und Gummiente als lustige Ergänzungen für dieselbe Lücke in einem Bildsatz an",
  "who-wrote-it": "Katzen-Detektiv untersucht mit einer Lupe gefaltete anonyme Zettel",
  "emoji-quiz": "Ein eigenständiger Cartoonkoch und ein schwebendes Pizzastück bilden gemeinsam ein Bilderrätsel",
  "guess-the-price": "Maus betrachtet einen Toaster mit Flügeln und leerem Preisschild durch eine Lupe",
  "fact-or-fake": "Pferd nimmt verlegen eine Einhornmaske ab und entlarvt die Täuschung",
  "percent-guess": "Eichhörnchen schätzt mit erhobener Pfote den Füllstand eines Glases mit Murmeln",
  "party-bracket": "Acht Alltagsgegenstände treten in einem Turnierbaum gegeneinander an; an der Spitze wartet ein Pokal",
  "spin-bottle": "Eine leere unbeschriftete Flasche dreht sich auf einem Teppich zwischen Chamäleon, Detektivin und Fuchs",
  "dice-coin": "Abgerundeter Würfel und schlichte goldene Münze wirbeln gemeinsam durch die Luft",
  "letter-categories": "Kaninchen jongliert Apfel, Anker, Ameise und Astronaut, während eine Sanduhr läuft",
  "dont-laugh": "Ernste Schildkröte versucht, bei den Faxen eines Affen nicht zu lachen",
  "scavenger-hunt": "Hund bringt eine Gummiente durch ein Wohnzimmer zurück und lässt Kissen hinter sich fliegen",
  "secret-mission": "Maus in einem schlichten Ninja-Kostüm stellt heimlich eine kleine Flagge hinter eine Blumenvase",
  "hot-seat": "Nervöses Kaninchen sitzt im Sessel unter einem Scheinwerfer, umgeben von Fragezeichen",
  "no-word-imposter": "Drei Pinguine betrachten eine Gummiente am Ausstellungsstand, während der vierte ratlos die Flügel hebt",
  "party-quiz": "Hamster am Quizpult hält seine Pfote bereit über vier farbigen Antwortknöpfen"
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
  const updateNotice = page.locator('.pwa-update-banner:visible');
  if (await updateNotice.count()) await updateNotice.getByRole('button', { name: 'Später' }).click();
  await page.locator('#start-btn').click();
  await expect(page).toHaveURL(/quick-play\.html\?game=wavelength$/);
  await expect(page.getByRole('heading', { name: 'Spektrum-Tipp' })).toBeVisible();
  await page.getByRole('link', { name: '← Alle Spiele' }).click();
  await expect(page).toHaveURL(/v2-hub\.html$/);
});

test('the player list is shared with the rest of the app and gates the start', async ({ page }) => {
  await seedHub(page, { players: ['Alex'] });
  await openV2(page, '#spiel=never-have');
  await expect(page.locator('#start-btn')).toBeDisabled();
  await expect(page.locator('#start-note')).toContainText('fehlen noch');

  await page.locator('#players-row').click();
  await page.locator('#player-input').fill('Sam');
  await page.locator('#player-add').click();
  await expect(page.locator('#player-badge')).toHaveText('2/20');
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).players, HUB_KEY)).toEqual(['Alex', 'Sam']);

  await expect(page.locator('#players-done')).toHaveText('Weiter zum Spiel');
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
