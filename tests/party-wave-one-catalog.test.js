'use strict';

const assert = require('node:assert/strict');
const catalog = require('../party-wave-one-catalog.js');

assert.equal(catalog.version, 3);
assert.deepEqual(catalog.waveOneQuizGameIds, ['party-quiz', 'fact-or-fake']);
assert.deepEqual(catalog.waveOneImposterGameIds, ['undercover-similar-word', 'no-word-imposter']);
assert.deepEqual(catalog.waveOneGameIds, ['party-quiz', 'fact-or-fake', 'undercover-similar-word', 'no-word-imposter']);
assert.equal(catalog.games.length, 49);
for (const id of catalog.waveOneGameIds) assert.ok(catalog.quickGameIds.includes(id));

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
assert.equal(catalog.itemCount('undercover-similar-word'), 24);
assert.equal(catalog.itemCount('no-word-imposter'), 24);

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
for (const item of catalog.getItems('undercover-similar-word')) {
  assert.equal(typeof item.civilian, 'string');
  assert.equal(typeof item.undercover, 'string');
  assert.notEqual(item.civilian.toLocaleLowerCase('de-DE'), item.undercover.toLocaleLowerCase('de-DE'));
}
for (const item of catalog.getItems('no-word-imposter')) assert.equal(typeof item, 'string');

assert.equal(catalog.getGame('imposter').id, 'imposter', 'existing catalog remains available');
assert.ok(catalog.getItems('party-quiz', 'Film & Serie').every(item => !('image' in item) && !('audio' in item)));

console.log(JSON.stringify({
  ok: true,
  waveOneCatalogVersion: catalog.version,
  playableWaveOneGames: catalog.waveOneGameIds.length,
  partyQuizCards: catalog.itemCount('party-quiz'),
  factOrFakeCards: catalog.itemCount('fact-or-fake'),
  undercoverCards: catalog.itemCount('undercover-similar-word'),
  noWordCards: catalog.itemCount('no-word-imposter'),
  referenceSafeTextOnlyContent: true,
  sharedQuickFamily: true
}, null, 2));
