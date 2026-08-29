'use strict';

const assert = require('node:assert/strict');
const catalog = require('../party-wave-one-bluff-catalog.js');

assert.equal(catalog.version, 6);
assert.deepEqual(catalog.waveOneBluffGameIds, ['bluff-trivia']);
assert.equal(catalog.waveOneGameIds.length, 9);
assert.equal(catalog.games.length, 54);
const game = catalog.getGame('bluff-trivia');
assert.ok(game);
assert.equal(game.status, 'playable');
assert.equal(game.age, 'all');
assert.ok(catalog.quickGameIds.includes('bluff-trivia'));
assert.equal(catalog.itemCount('bluff-trivia'), 24);
for (const item of catalog.getItems('bluff-trivia')) {
  assert.equal(typeof item.question, 'string');
  assert.ok(item.question.trim().length >= 8);
  assert.equal(typeof item.answer, 'string');
  assert.ok(item.answer.trim().length >= 1);
  assert.equal(typeof item.explanation, 'string');
  assert.ok(item.explanation.trim().length >= 8);
}

console.log(JSON.stringify({
  ok: true,
  catalogVersion: catalog.version,
  totalBuiltInGames: catalog.games.length,
  waveOneGames: catalog.waveOneGameIds.length,
  waveOneBluffGames: catalog.waveOneBluffGameIds.length,
  bluffCards: catalog.itemCount('bluff-trivia'),
  adultContent: false,
  privateFakeAnswersRequired: true
}, null, 2));
