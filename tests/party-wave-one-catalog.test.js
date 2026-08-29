'use strict';

const assert = require('node:assert/strict');
const catalog = require('../party-wave-one-catalog.js');

assert.equal(catalog.version, 2);
assert.deepEqual(catalog.waveOneGameIds, ['party-quiz', 'fact-or-fake']);
assert.equal(catalog.games.length, 47);
assert.ok(catalog.quickGameIds.includes('party-quiz'));
assert.ok(catalog.quickGameIds.includes('fact-or-fake'));

const quiz = catalog.getGame('party-quiz');
const fact = catalog.getGame('fact-or-fake');
assert.equal(quiz.status, 'playable');
assert.equal(fact.status, 'playable');
assert.equal(quiz.age, 'all');
assert.equal(fact.age, 'all');
assert.deepEqual(catalog.getPackNames('party-quiz'), ['Allgemeinwissen', 'Film & Serie', 'Technik']);
assert.deepEqual(catalog.getPackNames('fact-or-fake'), ['Natur', 'Film & Serie', 'Technik']);
assert.equal(catalog.itemCount('party-quiz'), 24);
assert.equal(catalog.itemCount('fact-or-fake'), 24);

for (const item of catalog.getItems('party-quiz')) {
  assert.equal(typeof item.question, 'string');
  assert.ok(item.question.length >= 8);
  assert.ok(Array.isArray(item.options));
  assert.equal(item.options.length, 4);
  assert.ok(item.options.every(option => typeof option === 'string' && option.trim().length >= 1));
  assert.ok(Number.isInteger(item.answer) && item.answer >= 0 && item.answer < 4);
  assert.equal(typeof item.explanation, 'string');
  assert.ok(item.explanation.length >= 8);
}
for (const item of catalog.getItems('fact-or-fake')) {
  assert.equal(typeof item.statement, 'string');
  assert.ok(item.statement.length >= 8);
  assert.equal(typeof item.fact, 'boolean');
  assert.equal(typeof item.explanation, 'string');
  assert.ok(item.explanation.length >= 8);
}

assert.equal(catalog.getGame('imposter').id, 'imposter', 'existing catalog remains available');
assert.ok(catalog.getItems('party-quiz', 'Film & Serie').every(item => !('image' in item) && !('audio' in item)));

console.log(JSON.stringify({
  ok: true,
  waveOneCatalogVersion: catalog.version,
  playableWaveOneGames: catalog.waveOneGameIds.length,
  partyQuizCards: catalog.itemCount('party-quiz'),
  factOrFakeCards: catalog.itemCount('fact-or-fake'),
  referenceSafeTextOnlyContent: true,
  sharedQuickFamily: true
}, null, 2));
