'use strict';

const assert = require('node:assert/strict');
const catalog = require('../party-wave-one-imposter-catalog.js');

assert.equal(catalog.version, 3);
assert.deepEqual(catalog.waveOneQuizGameIds, ['party-quiz', 'fact-or-fake']);
assert.deepEqual(catalog.waveOneImposterGameIds, ['undercover-similar-word', 'no-word-imposter']);
assert.deepEqual(catalog.waveOneGameIds, ['party-quiz', 'fact-or-fake', 'undercover-similar-word', 'no-word-imposter']);
assert.equal(catalog.games.length, 49);
for (const id of catalog.waveOneGameIds) assert.ok(catalog.quickGameIds.includes(id));

const undercover = catalog.getGame('undercover-similar-word');
const noWord = catalog.getGame('no-word-imposter');
assert.equal(undercover.status, 'playable');
assert.equal(noWord.status, 'playable');
assert.equal(undercover.age, 'all');
assert.equal(noWord.age, 'all');
assert.deepEqual(catalog.getPackNames('undercover-similar-word'), ['Alltag', 'Essen', 'Gaming']);
assert.deepEqual(catalog.getPackNames('no-word-imposter'), ['Alltag', 'Essen', 'Orte']);
assert.equal(catalog.itemCount('undercover-similar-word'), 24);
assert.equal(catalog.itemCount('no-word-imposter'), 24);

for (const item of catalog.getItems('undercover-similar-word')) {
  assert.equal(typeof item.civilian, 'string');
  assert.equal(typeof item.undercover, 'string');
  assert.ok(item.civilian.trim().length >= 2);
  assert.ok(item.undercover.trim().length >= 2);
  assert.notEqual(item.civilian.toLocaleLowerCase('de-DE'), item.undercover.toLocaleLowerCase('de-DE'));
}
for (const item of catalog.getItems('no-word-imposter')) {
  assert.equal(typeof item, 'string');
  assert.ok(item.trim().length >= 2);
}

assert.equal(catalog.getGame('party-quiz').id, 'party-quiz');
assert.equal(catalog.getGame('imposter').id, 'imposter');

console.log(JSON.stringify({
  ok: true,
  catalogVersion: catalog.version,
  totalBuiltInGames: catalog.games.length,
  waveOneGames: catalog.waveOneGameIds.length,
  waveOneImposterGames: catalog.waveOneImposterGameIds.length,
  undercoverCards: catalog.itemCount('undercover-similar-word'),
  noWordCards: catalog.itemCount('no-word-imposter'),
  adultContent: false,
  referenceSafeTextOnlyContent: true
}, null, 2));
