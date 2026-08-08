'use strict';

const assert = require('node:assert/strict');
const C = require('../party-routing.js');

assert.equal(C.version, 8);
assert.equal(typeof C.getItems, 'function');
assert.equal(typeof C.itemCount, 'function');
assert.equal(typeof C.coreRules, 'object');

const truthPacks = C.getPackNames('truth-dare');
assert.deepEqual(truthPacks, ['Locker', 'Lustig', 'Tief', 'Chaos']);
for (const pack of truthPacks) {
  const items = C.getItems('truth-dare', pack);
  assert.equal(items.length, 16, `Structured Truth/Dare pack must flatten to 16 cards: ${pack}`);
  assert.ok(items.every(item => typeof item === 'string' && item.trim().length > 0));
}
assert.equal(C.itemCount('truth-dare'), 64);

for (const id of ['would-rather', 'charades', 'taboo', 'two-truths', 'question-imposter', 'location-spy', 'mafia']) {
  const game = C.getGame(id);
  assert.ok(game, `Missing routed game: ${id}`);
  for (const pack of C.getPackNames(id)) {
    assert.ok(C.getItems(id, pack).length > 0, `Routed pack must expose items: ${id}/${pack}`);
  }
}

assert.equal(C.getGame('hot-potato').instructions.at(-1), 'Wer das Gerät bei STOPP hält, verliert die Runde.');
assert.equal(C.getGame('charades').competition.scoreMode, 'hit-counter');
assert.equal(C.getGame('taboo').competition.scoreMode, 'hit-counter');
assert.equal(Object.keys(C.coreRules).length, 15);

console.log(JSON.stringify({
  partyRoutingContract: 'PASS',
  structuredTruthDarePacks: truthPacks.length,
  truthDareCards: C.itemCount('truth-dare'),
  recursiveStructuredPackFlattening: true,
  machineReadableCoreRules: true
}, null, 2));
