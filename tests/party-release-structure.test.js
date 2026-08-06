'use strict';

const assert = require('node:assert/strict');
const catalog = require('../party-viral-catalog.js');
const release = require('../party-release-structure.js');

assert.equal(release.version, 1);
assert.equal(release.coreIds.length, 15);
assert.equal(release.labIds.length, 17);
assert.equal(new Set(release.coreIds).size, release.coreIds.length);
assert.equal(new Set(release.labIds).size, release.labIds.length);
assert.equal(release.coreIds.some(id => release.labIds.includes(id)), false);

const summary = release.counts(catalog.games);
assert.equal(catalog.games.length, 45);
assert.deepEqual(summary, { core: 15, extended: 13, labs: 17 });

for (const id of release.coreIds) {
  const game = catalog.getGame(id);
  assert.ok(game, `Core game missing from catalog: ${id}`);
  assert.equal(game.status, 'playable', `Core game must be technically playable: ${id}`);
  assert.equal(release.tierFor(game), 'core');
}
for (const id of release.labIds) {
  const game = catalog.getGame(id);
  assert.ok(game, `Labs game missing from catalog: ${id}`);
  assert.equal(release.tierFor(game), 'labs');
}

assert.equal(release.tierFor(catalog.getGame('hot-takes')), 'extended');
assert.equal(release.tierFor(catalog.getGame('wavelength')), 'extended');
assert.equal(release.tierFor({ id: 'custom-game-demo', custom: true, status: 'playable' }), 'extended');
assert.equal(release.tierFor({ id: 'unknown-planned', status: 'planned' }), 'labs');
assert.equal(release.tierFor(null), 'labs');

console.log(JSON.stringify({
  ok: true,
  totalBuiltInGames: catalog.games.length,
  coreGames: summary.core,
  extendedGames: summary.extended,
  labsGames: summary.labs,
  customGamesClassifiedAsExtended: true,
  plannedGamesClassifiedAsLabs: true
}, null, 2));
