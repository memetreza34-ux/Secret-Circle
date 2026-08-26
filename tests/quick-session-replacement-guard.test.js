'use strict';

const assert = require('node:assert/strict');
const guard = require('../quick-session-replacement-guard.js');

const catalog = {
  createdGameIds: ['custom-game-demo'],
  viralGameIds: ['viral-demo'],
  megaGameIds: ['mega-demo'],
  quickGameIds: ['quick-demo'],
  trendingGameIds: ['trend-demo', 'other-trend-demo'],
  getGame(id) {
    const titles = {
      'custom-game-demo': 'Eigenes Spiel',
      'viral-demo': 'Viral Demo',
      'mega-demo': 'Mega Demo',
      'quick-demo': 'Quick Demo',
      'trend-demo': 'Trend Demo',
      'other-trend-demo': 'Anderes Trendspiel'
    };
    return titles[id] ? { id, title: titles[id] } : null;
  }
};

function snapshot(gameId = 'trend-demo') {
  return {
    version: 1,
    gameId,
    sessionId: `session-${gameId}`,
    pack: 'Klassisch',
    targetRounds: 5,
    round: 2,
    players: ['Alex', 'Sam', 'Mika'],
    startedAt: '2026-08-26T14:00:00.000Z'
  };
}

function storageWith(value, key = guard.familyKeys.quick) {
  const values = new Map(value === undefined ? [] : [[key, JSON.stringify(value)]]);
  return {
    getItem(name) { return values.has(name) ? values.get(name) : null; },
    setItem(name, next) { values.set(name, String(next)); },
    removeItem(name) { values.delete(name); }
  };
}

assert.equal(guard.version, 1);
assert.equal(guard.familyForGame(catalog, 'custom-game-demo'), 'created');
assert.equal(guard.familyForGame(catalog, 'viral-demo'), 'viral');
assert.equal(guard.familyForGame(catalog, 'mega-demo'), 'mega');
assert.equal(guard.familyForGame(catalog, 'quick-demo'), 'quick');
assert.equal(guard.familyForGame(catalog, 'trend-demo'), 'quick');
assert.equal(guard.familyForGame(catalog, 'unknown'), null);
assert.equal(guard.storageKeyForGame(catalog, 'custom-game-demo'), 'secret-circle-party-created-active-v1');
assert.equal(guard.storageKeyForGame(catalog, 'viral-demo'), 'secret-circle-party-viral-active-v1');
assert.equal(guard.storageKeyForGame(catalog, 'mega-demo'), 'secret-circle-party-mega-active-v1');
assert.equal(guard.storageKeyForGame(catalog, 'trend-demo'), 'secret-circle-party-quick-active-v1');

assert.equal(guard.plausibleSnapshot(snapshot()), true);
assert.equal(guard.plausibleSnapshot({ ...snapshot(), version: 2 }), false);
assert.equal(guard.plausibleSnapshot({ ...snapshot(), round: 6 }), false);
assert.equal(guard.plausibleSnapshot({ ...snapshot(), players: ['Alex', 'alex'] }), false);
assert.equal(guard.plausibleSnapshot({ ...snapshot(), players: [] }), false);

const missing = guard.authorizeStart({ localStorage: storageWith(undefined), confirm() { throw new Error('must not confirm'); } }, catalog, 'trend-demo');
assert.equal(missing.allowed, true);
assert.equal(missing.existing, null);

let sameGamePrompt = '';
const sameGame = guard.authorizeStart({
  localStorage: storageWith(snapshot('trend-demo')),
  confirm(message) { sameGamePrompt = message; return false; }
}, catalog, 'trend-demo');
assert.equal(sameGame.allowed, false);
assert.match(sameGamePrompt, /Trend Demo/);
assert.match(sameGamePrompt, /neue Session beginnen/);

let crossGamePrompt = '';
const crossGameStorage = storageWith(snapshot('other-trend-demo'));
const crossGame = guard.authorizeStart({
  localStorage: crossGameStorage,
  confirm(message) { crossGamePrompt = message; return true; }
}, catalog, 'trend-demo');
assert.equal(crossGame.allowed, true);
assert.equal(crossGame.existing.value.gameId, 'other-trend-demo');
assert.match(crossGamePrompt, /Anderes Trendspiel/);
assert.match(crossGamePrompt, /Trend Demo/);
assert.equal(JSON.parse(crossGameStorage.getItem(guard.familyKeys.quick)).gameId, 'other-trend-demo');

const malformedStorage = storageWith({ version: 1, gameId: 'trend-demo', targetRounds: 5, round: 8, players: ['Alex'] });
const malformed = guard.authorizeStart({ localStorage: malformedStorage, confirm() { throw new Error('must not confirm malformed state'); } }, catalog, 'trend-demo');
assert.equal(malformed.allowed, true);
assert.equal(malformed.existing, null);

console.log(JSON.stringify({
  quickSessionReplacementGuard: 'PASS',
  families: ['quick', 'mega', 'viral', 'created'],
  sameGameReplacementConfirmed: true,
  crossGameFamilyReplacementConfirmed: true,
  guardDoesNotMutateStoredSnapshot: true,
  malformedSnapshotsDoNotBlockStart: true
}, null, 2));
