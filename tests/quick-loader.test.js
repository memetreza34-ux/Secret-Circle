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

assert.equal(loader.version, 3);
assert.equal(loader.ledgerSource, 'session-ledger.js');
assert.equal(loader.selectSource(catalog, 'custom-game-demo'), 'party-created-modes.js');
assert.equal(loader.selectSource(catalog, 'viral-demo'), 'party-viral-modes.js');
assert.equal(loader.selectSource(catalog, 'mega-demo'), 'party-mega-modes.js');
assert.equal(loader.selectSource(catalog, 'quick-demo'), 'party-quick-modes.js');
assert.equal(loader.selectSource(catalog, 'trend-demo'), 'party-quick-modes.js');
assert.equal(loader.selectSource(catalog, 'unknown-demo'), null);
assert.equal(loader.selectSource(null, 'quick-demo'), null);
assert.equal(loader.selectSource(catalog, ''), null);
assert.deepEqual(loader.scriptPlan(catalog, 'custom-game-demo', false), ['session-ledger.js', 'party-created-modes.js']);
assert.deepEqual(loader.scriptPlan(catalog, 'custom-game-demo', true), ['party-created-modes.js']);
assert.deepEqual(loader.scriptPlan(catalog, 'unknown-demo', false), []);

console.log(JSON.stringify({
  ok: true,
  explicitRouting: true,
  unknownRoutesRejected: true,
  sharedRuntimeLoadsFirst: true,
  loaderVersion: loader.version
}, null, 2));
