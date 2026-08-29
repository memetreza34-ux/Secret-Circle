'use strict';
const assert = require('node:assert/strict');
const expanded = require('../party-expansion.js');
const routed = require('../party-routing.js');
const advanced = require('../party-advanced.js');

assert.equal(expanded.version, 4);
assert.equal(routed.version, 8);
assert.equal(expanded.games.length, 22);
assert.equal(expanded.games.filter(game => game.status === 'playable').length, 18);
assert.equal(expanded.games.filter(game => game.status === 'planned').length, 4);
assert.equal(new Set(expanded.games.map(game => game.id)).size, expanded.games.length);

const advancedPacks = {
  'two-truths': ['Locker', 'Reise', 'Schule & Arbeit'],
  'question-imposter': ['Alltag', 'Meinungen', 'Schätzfragen'],
  'location-spy': ['Reise', 'Alltag', 'Fantasieorte'],
  mafia: ['Schnell', 'Klassisch', 'Erweitert']
};
const advancedIds = Object.keys(advancedPacks);
for (const id of advancedIds) {
  const raw = expanded.getGame(id);
  const linked = routed.getGame(id);
  assert.equal(raw.status, 'playable');
  assert.ok(advanced.canHandle(raw.mode));
  assert.equal(linked.mode, 'link');
  assert.equal(linked.advancedMode, raw.mode);
  assert.equal(linked.href, `advanced.html?game=${id}`);
  assert.deepEqual(raw.packs, advancedPacks[id]);
  assert.deepEqual(expanded.getPackNames(id), advancedPacks[id]);
  assert.ok(expanded.itemCount(id) >= 4);
}

for (const id of ['two-truths', 'question-imposter', 'location-spy']) {
  for (const pack of expanded.getPackNames(id)) {
    assert.equal(expanded.getItems(id, pack).length, 16, `${id}/${pack} must keep release wave-1 depth.`);
  }
}
for (const pack of expanded.getPackNames('taboo')) {
  assert.equal(expanded.getItems('taboo', pack).length, 16, `taboo/${pack} must keep release wave-1 depth.`);
}
for (const pack of expanded.getPackNames('hot-potato')) {
  assert.equal(expanded.getItems('hot-potato', pack).length, 16, `hot-potato/${pack} must keep release wave-1 depth.`);
}
for (const pack of expanded.getPackNames('word-chain')) {
  assert.equal(expanded.getItems('word-chain', pack).length, 10, `word-chain/${pack} must keep ten starts.`);
}

for (const id of ['wavelength', 'draw-guess', 'rapid-fire', 'sound-imitation']) {
  const game = expanded.getGame(id);
  assert.ok(game);
  assert.equal(game.status, 'planned');
  assert.equal(game.mode, 'planned');
}

for (const pair of expanded.getItems('question-imposter')) {
  assert.equal(typeof pair.main, 'string');
  assert.equal(typeof pair.imposter, 'string');
  assert.notEqual(pair.main, pair.imposter);
}

for (const pack of expanded.getPackNames('location-spy')) {
  const locations = expanded.getItems('location-spy', pack);
  assert.equal(locations.length, 16);
  assert.equal(new Set(locations.map(value => value.toLocaleLowerCase('de-DE'))).size, locations.length);
}

assert.deepEqual(new Set(advanced.modes), new Set(['two-truths', 'question-imposter', 'location-spy', 'mafia']));
assert.equal(advanced.version, 1);

const totalItems = expanded.games.reduce((sum, game) => sum + expanded.itemCount(game.id), 0);
assert.ok(totalItems >= 524, `Expected at least 524 content items after release-content wave 1, received ${totalItems}.`);

console.log(JSON.stringify({
  ok: true,
  catalogVersion: expanded.version,
  routingVersion: routed.version,
  advancedModeVersion: advanced.version,
  games: expanded.games.length,
  playableGames: expanded.games.filter(game => game.status === 'playable').length,
  plannedGames: expanded.games.filter(game => game.status === 'planned').length,
  advancedPlayableGames: advancedIds.length,
  advancedPackMetadataAligned: true,
  structuredReleaseWave1: {
    tabooPerPack: 16,
    hotPotatoPerPack: 16,
    wordChainPerPack: 10,
    twoTruthsPerPack: 16,
    questionImposterPerPack: 16,
    locationSpyPerPack: 16
  },
  guaranteedMinimumItems: 524,
  totalItems
}, null, 2));
