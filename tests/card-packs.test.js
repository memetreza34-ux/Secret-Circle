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
const release = require('../party-core-release-catalog.js');
const catalog = require('../party-wave-one-clue-catalog.js');

const files = [...classic.cardPackFiles];
const onDisk = fs.readdirSync(ROOT).filter(name => /^party-cards-[a-z0-9-]+\.js$/.test(name)).sort();
assert.ok(files.length >= 1, 'mindestens eine Kartenpaket-Datei');
assert.deepEqual([...files].sort(), onDisk, 'jede party-cards-*.js steht in CARD_PACK_FILES und umgekehrt');

const packs = files.map(file => require(`../${file}`));
const ids = packs.map(pack => pack.id);
assert.equal(new Set(ids).size, ids.length, 'Kartenpaket-IDs sind eindeutig');
assert.deepEqual([...classic.cardPackIds], ids, 'alle Kartenpakete wurden in der Reihenfolge der Liste angewendet');
assert.deepEqual([...catalog.cardPackIds], ids, 'der vollständige Katalog trägt die Kartenpakete weiter');

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
const TEMPLATE = /^(?:Finger runter, wenn du |Gib das Handy an die Person,? |Bringe (?:jemanden|die Gruppe|das Team|zwei Personen|drei Personen|alle) dazu, |Sorge dafür, dass (?:jemand|die Gruppe|zwei Personen|drei Personen|alle) |(?:Die|Eine) Person |Jemand )/;
const words = text => new Set(String(text).toLocaleLowerCase('de-DE').replace(/[^a-zäöüß0-9 ]/g, ' ').split(/\s+/).filter(word => word.length > 2 && !STOP.has(word)));
const leadText = item => (Array.isArray(item) ? item[0] : item && typeof item === 'object' ? (item.question || item.statement || item.word || item.civilian || item.title || item.main || JSON.stringify(item)) : String(item)).replace(TEMPLATE, '');
/* Spielregeln für das Kartenformat, damit neue Karten wie die vorhandenen funktionieren. */
const FORMAT = {
  'put-a-finger-down': item => /^Finger runter, wenn du .+[.!]$/.test(item),
  'finish-the-sentence': item => / …$/.test(item),
  'hot-seat': item => /[?.]$/.test(item) && item.length <= 70,
  'guess-the-price': item => typeof item[0] === 'string' && Number.isInteger(item[1]) && item[1] > 0,
  'emoji-quiz': item => !/\p{L}/u.test(item[0]) && /\p{L}/u.test(item[1])
};
const disclosure = [/letzte\s+(?:private\s+)?nachricht/i, /kamerarolle/i, /passwort/i, /(?:deine|private)\s+adresse/i, /private[nr]?\s+chats?/i, /handynummer|telefonnummer/i];

let added = 0;
for (const pack of packs) {
  for (const [gameId, packsByName] of Object.entries(pack.additions)) {
    assert.ok(catalog.getGame(gameId), `${pack.id}: Spiel ${gameId} existiert`);
    for (const [packName, extra] of Object.entries(packsByName)) {
      const before = release.content[gameId]?.[packName] ?? null;
      const finalItems = catalog.content[gameId][packName];
      const baseItems = Array.isArray(before) ? before : Object.values(before || {}).flat();
      const extraItems = Array.isArray(extra) ? extra : Object.values(extra).flat();
      const context = `${pack.id}: ${gameId}/${packName}`;
      assert.ok(extraItems.length > 0, `${context} enthält Karten`);
      const reference = shape(baseItems[0]);
      for (const item of extraItems) {
        assert.equal(shape(item), reference, `${context}: Format passt nicht zu den vorhandenen Karten: ${JSON.stringify(item)}`);
        if (FORMAT[gameId]) assert.ok(FORMAT[gameId](item), `${context}: Kartenformat des Spiels verletzt: ${JSON.stringify(item)}`);
        for (const text of (Array.isArray(item) ? item : typeof item === 'object' ? Object.values(item).flat() : [item]).filter(value => typeof value === 'string')) {
          const normalized = text.normalize('NFKC').trim();
          assert.ok(normalized.length >= 1 && normalized.length <= 280, `${context}: Textlänge ${normalized.length}`);
          assert.doesNotMatch(normalized, /<|>|\bon\w+\s*=/i, `${context}: Markup in ${normalized}`);
          for (const pattern of disclosure) assert.doesNotMatch(normalized, pattern, `${context}: private Angabe in ${normalized}`);
        }
      }
      const flatFinal = Array.isArray(finalItems) ? finalItems : Object.values(finalItems).flat();
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
      added += extraItems.length;
    }
  }
}

console.log(JSON.stringify({ ok: true, cardPackFiles: files, cardPackIds: ids, addedCards: added }, null, 2));
