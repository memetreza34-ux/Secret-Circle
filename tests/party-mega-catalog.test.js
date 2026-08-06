'use strict';
const assert = require('node:assert/strict');

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

assert.ok(mega.getItems('anime-guess', 'Shōnen-Klassiker').includes('Son Goku'));
assert.ok(mega.getItems('anime-guess', 'Neuere Hits').includes('Satoru Gojo'));
assert.ok(mega.getItems('forehead-guess', 'Anime-Archetypen').length >= 10);
assert.ok(mega.getItems('who-am-i', 'Geschichte').includes('Marie Curie'));
assert.ok(mega.getItems('pass-the-phone', 'Komplimente').every(item => typeof item === 'string'));
assert.ok(mega.getItems('money-challenge', 'Für 100 Euro').every(item => Array.isArray(item) && item.length === 2));
assert.ok(mega.getItems('emoji-quiz', 'Sprichwörter').every(item => Array.isArray(item) && item.length === 2));
assert.equal(mega.getItems('blind-ranking', 'Superkräfte').length, 10);
assert.equal(mega.getItems('tier-list', 'Hobbys').length, 10);

assert.equal(routed.version, 6);
assert.equal(routed.games.length, 45);
for (const id of megaIds) assert.equal(routed.getGame(id).href, `quick-play.html?game=${encodeURIComponent(id)}`);
for (const id of ['two-truths', 'question-imposter', 'location-spy', 'mafia']) {
  assert.equal(routed.getGame(id).href, `advanced.html?game=${encodeURIComponent(id)}`);
}

console.log(JSON.stringify({
  ok: true,
  megaCatalogGames: mega.games.length,
  routedGames: routed.games.length,
  megaModes: megaIds.length,
  allMegaQuickModes: mega.quickGameIds.length,
  animeFanQuiz: true,
  categoryExpansion: true,
  structuredCardsValidated: true
}, null, 2));
