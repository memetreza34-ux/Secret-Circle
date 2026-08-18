'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const mega = require('../party-mega-catalog.js');
const routed = require('../party-routing.js');

const megaIds = [
  'who-am-i', 'anime-guess', 'money-challenge', 'blind-ranking', 'emoji-quiz',
  'pass-the-phone', 'red-green-flag', 'secret-mission', 'tier-list'
];

assert.equal(mega.version, 4);
assert.equal(mega.games.length, 37);
assert.equal(new Set(mega.games.map(game => game.id)).size, 37);
assert.equal(mega.games.filter(game => game.status === 'playable').length, 37);
assert.deepEqual([...mega.megaGameIds], megaIds);
assert.equal(mega.quickGameIds.length, 19);

for (const id of megaIds) {
  const game = mega.getGame(id);
  assert.ok(game, `Missing mega mode ${id}`);
  assert.equal(game.status, 'playable');
  assert.equal(game.mode, 'link');
  assert.equal(game.href, `quick-play.html?game=${encodeURIComponent(id)}`);
  assert.ok(game.instructions.length >= 4);
  assert.ok(game.packs.length >= 4);
  assert.ok(mega.getPackNames(id).length >= 4);
  assert.ok(mega.itemCount(id) >= 32, `${id} needs broad launch content`);
}

const animeGame = mega.getGame('anime-guess');
assert.equal(animeGame.title, 'Anime-Archetypen erraten');
assert.equal(animeGame.group, 'Anime-Quiz');
assert.deepEqual(animeGame.packs, ['Action & Abenteuer', 'Magie & Mystery', 'Fantasy & Alltag', 'Sport & Games']);
assert.equal(mega.itemCount('anime-guess'), 40);
for (const pack of animeGame.packs) assert.equal(mega.getItems('anime-guess', pack).length, 10);
assert.ok(mega.getItems('anime-guess', 'Action & Abenteuer').includes('Ehrgeiziger Kampfkunst-Schüler'));
assert.ok(mega.getItems('anime-guess', 'Magie & Mystery').includes('Fluchjägerin'));

const removedAnimeReferences = [
  'Son Goku', 'Naruto Uzumaki', 'Monkey D. Ruffy', 'Ichigo Kurosaki', 'Edward Elric', 'Gon Freecss', 'Killua Zoldyck', 'Kenshin Himura', 'Natsu Dragneel', 'Yusuke Urameshi',
  'Tanjiro Kamado', 'Nezuko Kamado', 'Satoru Gojo', 'Yuji Itadori', 'Denji', 'Power', 'Eren Jäger', 'Mikasa Ackerman', 'Izuku Midoriya', 'Shoto Todoroki',
  'Sailor Moon', 'Light Yagami', 'Spike Spiegel', 'Inuyasha', 'Kagome Higurashi', 'Frieren', 'Anya Forger', 'Loid Forger', 'Totoro',
  'Ash Ketchum', 'Pikachu', 'Hinata Shoyo', 'Kageyama Tobio', 'Yoichi Isagi', 'Meguru Bachira', 'Tsubasa Ozora', 'Kirito', 'Asuna', 'Subaru Natsuki'
];
const source = fs.readFileSync(path.resolve(__dirname, '..', 'party-mega-catalog.js'), 'utf8');
for (const removed of removedAnimeReferences) {
  assert.ok(!source.includes(removed), `Concrete anime reference remains in shipped source: ${removed}`);
}

assert.ok(mega.getItems('forehead-guess', 'Anime-Archetypen').length >= 10);
assert.ok(mega.getItems('who-am-i', 'Geschichte').includes('Marie Curie'));
assert.ok(mega.getItems('pass-the-phone', 'Komplimente').every(item => typeof item === 'string'));
assert.ok(mega.getItems('money-challenge', 'Für 100 Euro').every(item => Array.isArray(item) && item.length === 2));
assert.ok(mega.getItems('emoji-quiz', 'Sprichwörter').every(item => Array.isArray(item) && item.length === 2));
assert.equal(mega.getItems('blind-ranking', 'Superkräfte').length, 10);
assert.equal(mega.getItems('tier-list', 'Hobbys').length, 10);

assert.equal(routed.version, 8);
assert.equal(routed.games.length, 45);
assert.equal(routed.createdGameIds.length, 0);
for (const id of megaIds) assert.equal(routed.getGame(id).href, `quick-play.html?game=${encodeURIComponent(id)}`);
for (const id of ['two-truths', 'question-imposter', 'location-spy', 'mafia']) {
  assert.equal(routed.getGame(id).href, `advanced.html?game=${encodeURIComponent(id)}`);
}

console.log(JSON.stringify({
  ok: true,
  megaCatalogGames: mega.games.length,
  routedGames: routed.games.length,
  routedVersion: routed.version,
  megaModes: megaIds.length,
  allMegaQuickModes: mega.quickGameIds.length,
  animeSourceReferenceSafe: true,
  concreteAnimeReferencesRemovedFromShippedSource: removedAnimeReferences.length,
  categoryExpansion: true,
  structuredCardsValidated: true
}, null, 2));