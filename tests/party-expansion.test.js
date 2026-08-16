'use strict';
const assert = require('node:assert/strict');
const expanded = require('../party-expansion.js');
const routed = require('../party-routing.js');
const advanced = require('../party-advanced.js');

assert.equal(expanded.version, 3);
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
  assert.ok(locations.length >= 6);
  assert.equal(new Set(locations.map(value => value.toLocaleLowerCase('de-DE'))).size, locations.length);
}

assert.deepEqual(new Set(advanced.modes), new Set(['two-truths', 'question-imposter', 'location-spy', 'mafia']));
assert.equal(advanced.version, 1);

const totalItems = expanded.games.reduce((sum, game) => sum + expanded.itemCount(game.id), 0);
assert.ok(totalItems >= 384, `Expected at least 384 content items, received ${totalItems}.`);

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
  guaranteedMinimumItems: 384,
  totalItems
}, null, 2));
