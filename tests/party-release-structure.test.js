'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const catalog = require('../party-viral-catalog.js');
const release = require('../party-release-structure.js');

function read(file) {
  return fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
}

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

const runtime = read('runtime-guard.js');
const worker = read('sw.js');
const styles = read('party-release.css');
assert.match(runtime, /party-release-structure\.js/);
assert.match(runtime, /party-release\.css/);
assert.match(runtime, /loadPartyReleaseStructure/);
assert.match(worker, /\.\/party-release-structure\.js/);
assert.match(worker, /\.\/party-release\.css/);
assert.match(styles, /\.release-tier-overview/);
assert.match(styles, /\.release-tier-pill/);
assert.match(styles, /prefers-reduced-motion/);

console.log(JSON.stringify({
  ok: true,
  totalBuiltInGames: catalog.games.length,
  coreGames: summary.core,
  extendedGames: summary.extended,
  labsGames: summary.labs,
  customGamesClassifiedAsExtended: true,
  plannedGamesClassifiedAsLabs: true,
  runtimeLoaderIntegrated: true,
  offlineAssetsIntegrated: true,
  responsiveTierStyles: true
}, null, 2));
