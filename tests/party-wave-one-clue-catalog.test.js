'use strict';

const assert = require('node:assert/strict');
const catalog = require('../party-wave-one-clue-catalog.js');

assert.equal(catalog.version, 7);
assert.deepEqual(catalog.waveOneClueGameIds, ['password-one-word']);
assert.equal(catalog.waveOneGameIds.length, 10);
assert.equal(catalog.games.length, 55);
const game = catalog.getGame('password-one-word');
assert.ok(game);
assert.equal(game.status, 'playable');
assert.equal(game.age, 'all');
assert.ok(catalog.quickGameIds.includes('password-one-word'));
assert.equal(catalog.itemCount('password-one-word'), 48);
for (const item of catalog.getItems('password-one-word')) {
  assert.equal(typeof item, 'string');
  assert.ok(item.trim().length >= 2);
  assert.ok(item.trim().length <= 60);
}

console.log(JSON.stringify({
  ok: true,
  catalogVersion: catalog.version,
  totalBuiltInGames: catalog.games.length,
  waveOneGames: catalog.waveOneGameIds.length,
  waveOneClueGames: catalog.waveOneClueGameIds.length,
  clueCards: catalog.itemCount('password-one-word'),
  adultContent: false,
  secretTargetByIndex: true
}, null, 2));
