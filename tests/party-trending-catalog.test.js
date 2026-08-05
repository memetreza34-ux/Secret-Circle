'use strict';
const assert = require('node:assert/strict');

const trending = require('../party-trending-catalog.js');
const routed = require('../party-routing.js');

assert.equal(trending.version, 3);
assert.equal(trending.games.length, 28);
assert.equal(new Set(trending.games.map(game => game.id)).size, 28);
assert.equal(trending.games.filter(game => game.status === 'playable').length, 28);
assert.equal(trending.games.filter(game => game.status === 'planned').length, 0);
assert.equal(trending.trendingGameIds.length, 10);

const expectedQuickModes = [
  'wavelength', 'draw-guess', 'rapid-fire', 'sound-imitation', 'forehead-guess',
  'letter-categories', 'dont-laugh', 'hum-song', 'scavenger-hunt', 'caption-battle'
];
assert.deepEqual([...trending.trendingGameIds], expectedQuickModes);

for (const id of expectedQuickModes) {
  const game = trending.getGame(id);
  assert.ok(game, `Missing quick mode ${id}`);
  assert.equal(game.status, 'playable');
  assert.equal(game.mode, 'link');
  assert.equal(game.href, `quick-play.html?game=${encodeURIComponent(id)}`);
  assert.ok(game.minPlayers >= 2);
  assert.ok(game.maxPlayers <= 20);
  assert.ok(game.duration >= 5);
  assert.ok(Array.isArray(game.instructions) && game.instructions.length >= 3);
  assert.ok(Array.isArray(game.packs) && game.packs.length >= 3);
  assert.deepEqual(trending.getPackNames(id), Object.keys(trending.content[id]));
  assert.ok(trending.itemCount(id) >= 18, `${id} needs enough launch content`);
  assert.ok(trending.getItems(id).length === trending.itemCount(id));
}

for (const id of ['wavelength', 'draw-guess', 'rapid-fire', 'sound-imitation']) {
  assert.equal(trending.getGame(id).status, 'playable');
}

for (const id of ['two-truths', 'question-imposter', 'location-spy', 'mafia']) {
  const game = routed.getGame(id);
  assert.equal(game.mode, 'link');
  assert.equal(game.href, `advanced.html?game=${encodeURIComponent(id)}`);
}
for (const id of expectedQuickModes) {
  assert.equal(routed.getGame(id).href, `quick-play.html?game=${encodeURIComponent(id)}`);
}

const rapid = trending.getItems('rapid-fire', '3 in 5 Sekunden');
assert.ok(rapid.every(item => Array.isArray(item) && item.length === 3));
assert.ok(rapid.every(([, required, seconds]) => Number.isInteger(required) && Number.isInteger(seconds)));
const spectra = trending.getItems('wavelength', 'Alltag');
assert.ok(spectra.every(item => Array.isArray(item) && item.length === 2));
const categories = trending.getItems('letter-categories', 'Klassisch');
assert.ok(categories.every(item => Array.isArray(item) && item.length === 5));

console.log(JSON.stringify({
  ok: true,
  catalogVersion: trending.version,
  visibleGames: trending.games.length,
  playableGames: trending.games.filter(game => game.status === 'playable').length,
  newQuickModes: expectedQuickModes.length,
  routedAdvancedGames: 4,
  allIdsUnique: true,
  originalContentValidated: true
}, null, 2));
