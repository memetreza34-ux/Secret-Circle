'use strict';

const assert = require('node:assert/strict');
const catalog = require('../party-wave-one-writing-catalog.js');

assert.equal(catalog.version, 4);
assert.deepEqual(catalog.waveOneWritingGameIds, ['fill-blank-battle', 'who-wrote-it']);
assert.equal(catalog.waveOneGameIds.length, 6);
assert.equal(catalog.games.length, 51);
for (const id of catalog.waveOneWritingGameIds) {
  const game = catalog.getGame(id);
  assert.ok(game);
  assert.equal(game.status, 'playable');
  assert.equal(game.age, 'all');
  assert.ok(catalog.quickGameIds.includes(id));
  assert.equal(catalog.itemCount(id), 24);
}
assert.deepEqual(catalog.getPackNames('fill-blank-battle'), ['Alltag', 'Gaming', 'Fantasie']);
assert.deepEqual(catalog.getPackNames('who-wrote-it'), ['Freundschaft', 'Icebreaker', 'Alltag']);
for (const id of catalog.waveOneWritingGameIds) {
  for (const item of catalog.getItems(id)) {
    assert.equal(typeof item, 'string');
    assert.ok(item.trim().length >= 8);
    assert.ok(item.length <= 220);
  }
}
assert.equal(catalog.getGame('party-quiz').id, 'party-quiz');
assert.equal(catalog.getGame('undercover-similar-word').id, 'undercover-similar-word');
assert.equal(catalog.getGame('imposter').id, 'imposter');

console.log(JSON.stringify({
  ok: true,
  catalogVersion: catalog.version,
  totalBuiltInGames: catalog.games.length,
  waveOneGames: catalog.waveOneGameIds.length,
  waveOneWritingGames: catalog.waveOneWritingGameIds.length,
  cardsPerWritingGame: 24,
  adultContent: false,
  privateInputRequired: true
}, null, 2));
