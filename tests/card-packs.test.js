'use strict';

/* Zusatzkarten aus party-cards-*.js: Jede Datei ist geladen, offline verfügbar
   und auf jeder Seite mit vollem Katalog eingebunden. Jede Karte passt ins
   Format ihrer Kategorie, ist sicherer Text und weder Dublette noch
   Fast-Doppler einer anderen Karte derselben Kategorie. */

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const classic = require('../party-core-classic-content.js');
const catalog = require('../party-wave-one-clue-catalog.js');

const files = [...classic.cardPackFiles];
const onDisk = fs.readdirSync(ROOT).filter(name => /^party-cards-[a-z0-9-]+\.js$/.test(name)).sort();
assert.ok(files.length >= 1, 'mindestens eine Kartenpaket-Datei');
assert.deepEqual([...files].sort(), onDisk, 'jede party-cards-*.js steht in CARD_PACK_FILES und umgekehrt');

const packs = files.map(file => require(`../${file}`));
const ids = packs.map(pack => pack.id);
assert.equal(new Set(ids).size, ids.length, 'Kartenpaket-IDs sind eindeutig');
/* Pakete ohne Stufe hängt party-core-classic-content.js an, Pakete mit
   stage 'wave-one' die letzte Katalogebene. */
for (const pack of packs) assert.ok(pack.stage === undefined || pack.stage === 'wave-one', `${pack.id}: unbekannte Stufe ${pack.stage}`);
const coreIds = packs.filter(pack => pack.stage === undefined).map(pack => pack.id);
const lateIds = packs.filter(pack => pack.stage === 'wave-one').map(pack => pack.id);
assert.deepEqual([...classic.cardPackIds], coreIds, 'alle Kern-Kartenpakete wurden in der Reihenfolge der Liste angewendet');
assert.deepEqual([...catalog.cardPackIds], coreIds, 'der vollständige Katalog trägt die Kartenpakete weiter');
assert.deepEqual(classic.lateCardPacks.map(pack => pack.id), lateIds, 'Wave-1-Pakete werden an die letzte Ebene weitergereicht');
assert.deepEqual([...catalog.lateCardPackIds], lateIds, 'die letzte Katalogebene hat alle Wave-1-Pakete angewendet');

const sw = read('sw.js');
for (const page of ['index.html', 'v2-hub.html', 'party.html', 'quick-play.html']) {
  const html = read(page);
  const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(match => match[1]);
  const classicAt = scripts.indexOf('party-core-classic-content.js');
  assert.ok(classicAt > 0, `${page} lädt party-core-classic-content.js`);
  assert.deepEqual(scripts.slice(classicAt - files.length, classicAt), files, `${page} lädt alle Kartenpakete direkt vor party-core-classic-content.js`);
}
for (const file of files) {
  assert.ok(sw.includes(`'./${file}'`), `${file} ist im Offline-Core`);
  assert.ok(fs.statSync(path.join(ROOT, file)).size < 90_000, `${file} bleibt unter 90 KB`);
  assert.match(read(file), /^\(function \(root, data\) \{\n  'use strict';/, `${file} folgt dem Datendatei-Format`);
}

const shape = item => Array.isArray(item) ? `array:${item.length}:${item.map(value => typeof value).join(',')}`
  : item && typeof item === 'object' ? `object:${Object.keys(item).sort().join(',')}` : typeof item;
const STOP = new Set(('der die das ein eine einen einem einer und oder ich du er sie es wir ihr mit mich mir mein meine meinen am im in an auf zu zum zur von vom bei für ist sind war wird würde würdest hat habe hätte noch nur nicht kein keine was wie wer wo wann welche welcher welches welchen den dem des als so sehr auch aus über plötzlich jeden jede jeder immer schon man sich liebsten gern gerne einmal mache machen esse verbringe passt besten mag würden möchte soll darf kann lieber eher meistens wenn hast bist dass dich dir dein deine deinen').split(' '));
/* Feste Satzanfänge eines Spiels zählen nicht als gemeinsamer Inhalt. */
const TEMPLATE = /^(?:Finger runter, wenn du |Gib das Handy an die Person,? |Bringe (?:jemanden|die Gruppe|das Team|zwei Personen|drei Personen|alle) dazu, |Sorge dafür, dass (?:jemand|die Gruppe|zwei Personen|drei Personen|alle) |(?:Die|Eine) Person |Jemand |Nenne (?:zwei|drei|fünf|sechs|sieben) |Ich habe noch nie |Wer würde (?:eher|am ehesten) )/;
const words = text => new Set(String(text).toLocaleLowerCase('de-DE').replace(/[^a-zäöüß0-9 ]/g, ' ').split(/\s+/).filter(word => word.length > 2 && !STOP.has(word)));
const leadText = item => (Array.isArray(item) ? item[0] : item && typeof item === 'object' ? (item.question || item.statement || item.word || item.civilian || item.title || item.main || JSON.stringify(item)) : String(item)).replace(TEMPLATE, '').replace(/ und gib weiter\.$/, '');
/* Spielregeln für das Kartenformat, damit neue Karten wie die vorhandenen funktionieren. */
const FORMAT = {
  'put-a-finger-down': item => /^Finger runter, wenn du .+[.!]$/.test(item),
  'finish-the-sentence': item => / …$/.test(item),
  'hot-seat': item => /[?.]$/.test(item) && item.length <= 70,
  'guess-the-price': item => typeof item[0] === 'string' && Number.isInteger(item[1]) && item[1] > 0,
  'emoji-quiz': item => !/\p{L}/u.test(item[0]) && /\p{L}/u.test(item[1]),
  'rapid-fire': item => /^Nenne /.test(item[0]) && Number.isInteger(item[1]) && Number.isInteger(item[2]) && item[2] > item[1],
  wavelength: item => item[0] !== item[1],
  'letter-categories': item => new Set(item).size === item.length,
  /* Melodie summen nennt nur Musikarten und Anlässe, keine Liedtitel in Anführungszeichen. */
  'hum-song': item => !/[„“"]/.test(item),
  'never-have': item => /^Ich habe noch nie .+\.$/.test(item),
  'most-likely': item => /^Wer würde eher .+\?$/.test(item),
  paranoia: item => /^(?:Wer|Wem|Wen|Von wem) .+\?$/.test(item),
  taboo: item => item.banned.length === 3 && !item.banned.some(word => word.toLocaleLowerCase('de-DE') === item.word.toLocaleLowerCase('de-DE')),
  'word-chain': item => /^\p{Lu}$/u.test(item),
  'fill-blank-battle': item => / …$/.test(item),
  'who-wrote-it': item => /\?$/.test(item),
  'undercover-similar-word': item => item.civilian !== item.undercover
};
const disclosure = [/letzte\s+(?:private\s+)?nachricht/i, /kamerarolle/i, /passwort/i, /(?:deine|private)\s+adresse/i, /private[nr]?\s+chats?/i, /handynummer|telefonnummer/i];

/* Prüft neue Karten einer Kategorie: Format wie die vorhandenen, Spielregeln,
   sichere Texte. Danach die ganze Kategorie: keine Dubletten, keine Fast-Doppler. */
function checkNewItems(context, gameId, items, reference) {
  for (const item of items) {
    assert.equal(shape(item), reference, `${context}: Format passt nicht zu den vorhandenen Karten: ${JSON.stringify(item)}`);
    if (FORMAT[gameId]) assert.ok(FORMAT[gameId](item), `${context}: Kartenformat des Spiels verletzt: ${JSON.stringify(item)}`);
    for (const text of (Array.isArray(item) ? item : typeof item === 'object' ? Object.values(item).flat() : [item]).filter(value => typeof value === 'string')) {
      const normalized = text.normalize('NFKC').trim();
      assert.ok(normalized.length >= 1 && normalized.length <= 280, `${context}: Textlänge ${normalized.length}`);
      assert.doesNotMatch(normalized, /<|>|\bon\w+\s*=/i, `${context}: Markup in ${normalized}`);
      for (const pattern of disclosure) assert.doesNotMatch(normalized, pattern, `${context}: private Angabe in ${normalized}`);
    }
  }
}

function checkDistinct(context, flatFinal) {
  const keys = flatFinal.map(item => JSON.stringify(item).normalize('NFKC').toLocaleLowerCase('de-DE').replace(/\s+/g, ' '));
  assert.equal(new Set(keys).size, keys.length, `${context}: keine Dubletten nach dem Anhängen`);
  /* Fast-Doppler: drei oder mehr gemeinsame Inhaltswörter und mindestens 80 % Überschneidung. */
  const texts = flatFinal.map(leadText);
  for (let a = 0; a < texts.length; a += 1) {
    for (let b = a + 1; b < texts.length; b += 1) {
      const A = words(texts[a]);
      const B = words(texts[b]);
      if (!A.size || !B.size) continue;
      const shared = [...A].filter(word => B.has(word)).length;
      assert.ok(!(shared >= 3 && shared / Math.min(A.size, B.size) >= 0.8), `${context}: Fast-Doppler „${texts[a]}“ ~ „${texts[b]}“`);
    }
  }
}

let added = 0;
for (const pack of packs) {
  for (const [gameId, packsByName] of Object.entries(pack.additions)) {
    assert.ok(catalog.getGame(gameId), `${pack.id}: Spiel ${gameId} existiert`);
    for (const [packName, extra] of Object.entries(packsByName)) {
      const finalItems = catalog.content[gameId][packName];
      const flatFinal = Array.isArray(finalItems) ? finalItems : Object.values(finalItems).flat();
      const extraItems = Array.isArray(extra) ? extra : Object.values(extra).flat();
      const context = `${pack.id}: ${gameId}/${packName}`;
      assert.ok(extraItems.length > 0, `${context} enthält Karten`);
      /* Zusatzkarten stehen hinten; die erste Karte stammt also aus dem Basiskatalog. */
      checkNewItems(context, gameId, extraItems, shape(flatFinal[0]));
      checkDistinct(context, flatFinal);
      added += extraItems.length;
    }
  }
}

/* Advanced-Spiele: advanced.html lädt keine party-cards-*.js, ihre Zusatzkarten
   stehen deshalb in party-expansion.js (cardAdditions). Dieselben Regeln gelten. */
const ADVANCED_TARGET = 50;
for (const gameId of ['two-truths', 'question-imposter', 'location-spy']) {
  for (const packName of catalog.getPackNames(gameId)) {
    const items = catalog.content[gameId][packName];
    const context = `party-expansion: ${gameId}/${packName}`;
    assert.equal(items.length, ADVANCED_TARGET, `${context}: ${ADVANCED_TARGET} Karten`);
    checkNewItems(context, gameId, items, shape(items[0]));
    checkDistinct(context, items);
  }
}

console.log(JSON.stringify({ ok: true, cardPackFiles: files, cardPackIds: ids, addedCards: added }, null, 2));
