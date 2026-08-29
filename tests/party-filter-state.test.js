'use strict';

const assert = require('node:assert/strict');
const Filters = require('../party-filter-state.js');
const Release = require('../party-release-structure.js');

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    failWrites: false,
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) {
      if (this.failWrites) throw new Error('quota exceeded');
      values.set(String(key), String(value));
    }
  };
}

assert.equal(Filters.version, 1);
assert.equal(Filters.storageKey, 'secret-circle-party-catalog-filters-v1');
assert.deepEqual(Filters.normalize(null), Filters.defaults);
assert.deepEqual(Filters.normalize({
  query: '  Party   Spiel  ',
  group: ' Eigene Spiele ',
  mood: 'chaotic',
  players: 'large',
  age: 'family',
  status: 'playable',
  tier: 'core',
  view: 'favorites'
}), {
  version: 1,
  query: 'Party Spiel',
  group: 'Eigene Spiele',
  mood: 'chaotic',
  players: 'large',
  age: 'family',
  status: 'playable',
  tier: 'core',
  view: 'favorites'
});
assert.equal(Filters.normalize({ mood: 'invalid' }).mood, 'all');
assert.equal(Filters.normalize({ tier: 'premium' }).tier, 'all');
assert.equal(Filters.normalize({ view: 'admin' }).view, 'home');
assert.equal(Filters.normalize({ query: 'x'.repeat(200) }).query.length, 120);
assert.equal(Filters.resolveView('favorites', 'stats'), 'stats');
assert.equal(Filters.resolveView('favorites', null), 'favorites');
assert.equal(Filters.resolveView('invalid', 'invalid'), 'home');

const storage = memoryStorage();
const written = Filters.write(storage, { query: 'Mafia', age: 'teen', tier: 'core', view: 'games' });
assert.equal(written.ok, true);
assert.deepEqual(Filters.read(storage), {
  version: 1,
  query: 'Mafia',
  group: 'all',
  mood: 'all',
  players: 'all',
  age: 'teen',
  status: 'all',
  tier: 'core',
  view: 'games'
});
storage.failWrites = true;
assert.equal(Filters.write(storage, Filters.defaults).ok, false);
assert.equal(Filters.write(null, Filters.defaults).ok, false);
assert.match(Filters.write(null, Filters.defaults).error, /nicht verfügbar/);

assert.equal(Release.ageAllows({ age: 'all' }, 'family'), true);
assert.equal(Release.ageAllows({ age: 'teen' }, 'family'), false);
assert.equal(Release.ageAllows({ age: 'teen' }, 'teen'), true);
assert.equal(Release.ageAllows({ age: 'all' }, 'teen'), true);
assert.equal(Release.ageAllows({ age: 'teen' }, 'all'), true);
assert.equal(Release.ageAllows(null, 'all'), false);

console.log(JSON.stringify({
  ok: true,
  filterStateVersion: Filters.version,
  persistentSearchAndSelects: true,
  persistedLastView: true,
  explicitUrlViewWins: true,
  invalidValuesSanitized: true,
  unavailableStorageReported: true,
  quotaFailureReported: true,
  ageAndReleaseTierCombined: true
}, null, 2));
