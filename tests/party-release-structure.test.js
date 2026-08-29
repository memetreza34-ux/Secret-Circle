'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const catalog = require('../party-wave-one-clue-catalog.js');
const release = require('../party-release-structure.js');

function read(file) { return fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8'); }

assert.equal(release.version, 5);
assert.equal(release.coreIds.length, 15);
assert.equal(release.labIds.length, 27);
assert.equal(new Set(release.coreIds).size, release.coreIds.length);
assert.equal(new Set(release.labIds).size, release.labIds.length);
assert.equal(release.coreIds.some(id => release.labIds.includes(id)), false);

const summary = release.counts(catalog.games);
assert.equal(catalog.games.length, 55);
assert.deepEqual(summary, { core: 15, extended: 13, labs: 27 });
for (const id of release.coreIds) {
  const game = catalog.getGame(id); assert.ok(game, `Core game missing: ${id}`); assert.equal(game.status, 'playable'); assert.equal(release.tierFor(game), 'core');
}
for (const id of release.labIds) {
  const game = catalog.getGame(id); assert.ok(game, `Labs game missing: ${id}`); assert.equal(release.tierFor(game), 'labs');
}

const waveOneLabs = ['bluff-trivia','party-quiz','fact-or-fake','percent-guess','fill-blank-battle','who-wrote-it','party-bracket','undercover-similar-word','no-word-imposter','password-one-word'];
for (const id of waveOneLabs) assert.equal(release.tierFor(catalog.getGame(id)), 'labs');
assert.equal(catalog.waveOneGameIds.length, 10);
assert.equal(release.tierFor(catalog.getGame('hot-takes')), 'extended');
assert.equal(release.tierFor(catalog.getGame('wavelength')), 'extended');
assert.equal(release.tierFor({ id: 'custom-game-demo', custom: true, status: 'playable' }), 'extended');
assert.equal(release.tierFor({ id: 'unknown-planned', status: 'planned' }), 'labs');
assert.equal(release.ageAllows({ age: 'all' }, 'family'), true);
assert.equal(release.ageAllows({ age: 'teen' }, 'family'), false);

const runtime = read('runtime-guard.js'); const worker = read('sw.js'); const tierStyles = read('party-release.css'); const searchStyles = read('party-search.css');
assert.match(runtime, /party-release-structure\.js/); assert.match(runtime, /party-filter-state\.js/); assert.match(runtime, /party-search-assist\.js/);
assert.ok(runtime.indexOf('loadPartyReleaseStructure') < runtime.lastIndexOf('loadPartyFilterState'));
assert.ok(runtime.indexOf('loadPartyFilterState') < runtime.lastIndexOf('loadPartySearchAssist'));
assert.match(worker, /\.\/party-release-structure\.js/); assert.match(worker, /\.\/party-filter-state\.js/); assert.match(worker, /\.\/party-search-assist\.js/);
assert.match(tierStyles, /\.release-tier-overview/); assert.match(tierStyles, /\.release-tier-pill/); assert.match(tierStyles, /prefers-reduced-motion/);
assert.match(searchStyles, /\.party-search-suggestions/); assert.match(searchStyles, /focus-visible/); assert.match(searchStyles, /prefers-reduced-motion/);

console.log(JSON.stringify({
  ok: true, totalBuiltInGames: catalog.games.length, coreGames: summary.core, extendedGames: summary.extended, labsGames: summary.labs,
  waveOneLabs, waveOneComplete: catalog.waveOneGameIds.length, customGamesClassifiedAsExtended: true,
  plannedGamesClassifiedAsLabs: true, ageAndReleaseTierCombined: true, offlineAssetsIntegrated: true,
  responsiveTierStyles: true, accessibleSearchStyles: true
}, null, 2));
