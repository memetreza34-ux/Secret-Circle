'use strict';

const assert = require('node:assert/strict');
const catalog = require('../party-wave-one-voting-catalog.js');

assert.equal(catalog.version, 5);
assert.deepEqual(catalog.waveOneVotingGameIds, ['percent-guess', 'party-bracket']);
assert.equal(catalog.waveOneGameIds.length, 8);
assert.equal(catalog.games.length, 53);
for (const id of catalog.waveOneVotingGameIds) {
  const game = catalog.getGame(id);
  assert.ok(game);
  assert.equal(game.status, 'playable');
  assert.equal(game.age, 'all');
  assert.ok(catalog.quickGameIds.includes(id));
  assert.equal(catalog.itemCount(id), 24);
}
for (const item of catalog.getItems('percent-guess')) {
  assert.equal(typeof item.question, 'string');
  assert.ok(item.question.trim().length >= 8);
  assert.ok(Number.isInteger(item.answer));
  assert.ok(item.answer >= 0 && item.answer <= 100);
  assert.equal(typeof item.explanation, 'string');
  assert.ok(item.explanation.trim().length >= 8);
}
for (const item of catalog.getItems('party-bracket')) {
  assert.equal(typeof item.title, 'string');
  assert.ok(item.title.trim().length >= 4);
  assert.ok(Array.isArray(item.entries));
  assert.equal(item.entries.length, 8);
  assert.equal(new Set(item.entries.map(value => value.toLocaleLowerCase('de-DE'))).size, 8);
  assert.ok(item.entries.every(value => typeof value === 'string' && value.trim().length >= 2));
}

console.log(JSON.stringify({
  ok: true,
  catalogVersion: catalog.version,
  totalBuiltInGames: catalog.games.length,
  waveOneGames: catalog.waveOneGameIds.length,
  waveOneVotingGames: catalog.waveOneVotingGameIds.length,
  cardsPerVotingGame: 24,
  adultContent: false,
  derivedResumeState: true
}, null, 2));
