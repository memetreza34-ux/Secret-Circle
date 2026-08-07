'use strict';

const assert = require('node:assert/strict');
const loader = require('../quick-loader.js');

const catalog = {
  createdGameIds: ['custom-game-demo'],
  viralGameIds: ['viral-demo'],
  megaGameIds: ['mega-demo'],
  quickGameIds: ['quick-demo'],
  trendingGameIds: ['trend-demo']
};

assert.equal(loader.version, 6);
assert.equal(loader.ledgerSource, 'session-ledger.js');
assert.equal(loader.controlsSource, 'party-session-controls.js');
assert.equal(loader.selectSource(catalog, 'custom-game-demo'), 'party-created-modes.js');
assert.equal(loader.selectSource(catalog, 'viral-demo'), 'party-viral-modes.js');
assert.equal(loader.selectSource(catalog, 'mega-demo'), 'party-mega-modes.js');
assert.equal(loader.selectSource(catalog, 'quick-demo'), 'party-quick-modes.js');
assert.equal(loader.selectSource(catalog, 'trend-demo'), 'party-quick-modes.js');
assert.equal(loader.selectSource(catalog, 'unknown-demo'), null);
assert.equal(loader.selectSource(null, 'quick-demo'), null);
assert.equal(loader.selectSource(catalog, ''), null);

assert.deepEqual(loader.scriptPlan(catalog, 'custom-game-demo', false, false), ['session-ledger.js', 'party-session-controls.js', 'party-created-modes.js']);
assert.deepEqual(loader.scriptPlan(catalog, 'custom-game-demo', true, false), ['party-session-controls.js', 'party-created-modes.js']);
assert.deepEqual(loader.scriptPlan(catalog, 'custom-game-demo', false, true), ['session-ledger.js', 'party-created-modes.js']);
assert.deepEqual(loader.scriptPlan(catalog, 'custom-game-demo', true, true), ['party-created-modes.js']);
assert.deepEqual(loader.scriptPlan(catalog, 'viral-demo', false, false), ['session-ledger.js', 'party-session-controls.js', 'party-viral-modes.js']);
assert.deepEqual(loader.scriptPlan(catalog, 'mega-demo', true, true), ['party-mega-modes.js']);
assert.deepEqual(loader.scriptPlan(catalog, 'quick-demo', false, true), ['session-ledger.js', 'party-quick-modes.js']);
assert.deepEqual(loader.scriptPlan(catalog, 'unknown-demo', false, false), []);

console.log(JSON.stringify({
  ok: true,
  explicitRouting: true,
  unknownRoutesRejected: true,
  sharedLedgerLoadsFirst: true,
  sharedControlsLoadBeforeEngine: true,
  allEngineFamiliesLoadDirectly: true,
  loaderVersion: loader.version
}, null, 2));
