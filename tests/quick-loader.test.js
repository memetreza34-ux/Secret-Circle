'use strict';

const assert = require('node:assert/strict');
const loader = require('../quick-loader.js');

const catalog = {
  createdGameIds: ['custom-game-demo'],
  viralGameIds: ['viral-demo'],
  megaGameIds: ['mega-demo'],
  waveOneGameIds: ['party-quiz', 'fact-or-fake'],
  quickGameIds: ['quick-demo', 'party-quiz', 'fact-or-fake'],
  trendingGameIds: ['trend-demo']
};

assert.equal(loader.version, 8);
assert.equal(loader.ledgerSource, 'session-ledger.js');
assert.equal(loader.controlsSource, 'party-session-controls.js');
assert.equal(loader.replacementGuardSource, 'quick-session-replacement-guard.js');
assert.equal(loader.waveOneSource, 'party-wave-one-modes.js');
assert.equal(loader.selectSource(catalog, 'custom-game-demo'), 'party-created-modes.js');
assert.equal(loader.selectSource(catalog, 'viral-demo'), 'party-viral-modes.js');
assert.equal(loader.selectSource(catalog, 'mega-demo'), 'party-mega-modes.js');
assert.equal(loader.selectSource(catalog, 'party-quiz'), 'party-wave-one-modes.js');
assert.equal(loader.selectSource(catalog, 'fact-or-fake'), 'party-wave-one-modes.js');
assert.equal(loader.selectSource(catalog, 'quick-demo'), 'party-quick-modes.js');
assert.equal(loader.selectSource(catalog, 'trend-demo'), 'party-quick-modes.js');
assert.equal(loader.selectSource(catalog, 'unknown-demo'), null);
assert.equal(loader.selectSource(null, 'quick-demo'), null);
assert.equal(loader.selectSource(catalog, ''), null);

assert.deepEqual(loader.scriptPlan(catalog, 'custom-game-demo', false, false, false), [
  'session-ledger.js', 'party-session-controls.js', 'quick-session-replacement-guard.js', 'party-created-modes.js'
]);
assert.deepEqual(loader.scriptPlan(catalog, 'custom-game-demo', true, false, false), [
  'party-session-controls.js', 'quick-session-replacement-guard.js', 'party-created-modes.js'
]);
assert.deepEqual(loader.scriptPlan(catalog, 'custom-game-demo', false, true, false), [
  'session-ledger.js', 'quick-session-replacement-guard.js', 'party-created-modes.js'
]);
assert.deepEqual(loader.scriptPlan(catalog, 'custom-game-demo', true, true, false), [
  'quick-session-replacement-guard.js', 'party-created-modes.js'
]);
assert.deepEqual(loader.scriptPlan(catalog, 'custom-game-demo', true, true, true), ['party-created-modes.js']);
assert.deepEqual(loader.scriptPlan(catalog, 'viral-demo', false, false, false), [
  'session-ledger.js', 'party-session-controls.js', 'quick-session-replacement-guard.js', 'party-viral-modes.js'
]);
assert.deepEqual(loader.scriptPlan(catalog, 'mega-demo', true, true, false), ['quick-session-replacement-guard.js', 'party-mega-modes.js']);
assert.deepEqual(loader.scriptPlan(catalog, 'party-quiz', false, true, false), [
  'session-ledger.js', 'quick-session-replacement-guard.js', 'party-wave-one-modes.js'
]);
assert.deepEqual(loader.scriptPlan(catalog, 'quick-demo', false, true, false), [
  'session-ledger.js', 'quick-session-replacement-guard.js', 'party-quick-modes.js'
]);
assert.deepEqual(loader.scriptPlan(catalog, 'unknown-demo', false, false, false), []);

console.log(JSON.stringify({
  ok: true,
  explicitRouting: true,
  unknownRoutesRejected: true,
  sharedLedgerLoadsFirst: true,
  sharedControlsLoadBeforeGuard: true,
  replacementGuardLoadsBeforeEngine: true,
  waveOneEngineRoutedBeforeQuickFallback: true,
  allEngineFamiliesLoadDirectly: true,
  loaderVersion: loader.version
}, null, 2));
