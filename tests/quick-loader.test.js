'use strict';

const assert = require('node:assert/strict');
const loader = require('../quick-loader.js');

const catalog = {
  createdGameIds: ['custom-game-demo'],
  viralGameIds: ['viral-demo'],
  megaGameIds: ['mega-demo'],
  waveOneQuizGameIds: ['party-quiz', 'fact-or-fake'],
  waveOneImposterGameIds: ['undercover-similar-word', 'no-word-imposter'],
  waveOneWritingGameIds: ['fill-blank-battle', 'who-wrote-it'],
  waveOneGameIds: ['party-quiz', 'fact-or-fake', 'undercover-similar-word', 'no-word-imposter', 'fill-blank-battle', 'who-wrote-it'],
  quickGameIds: ['quick-demo', 'party-quiz', 'fact-or-fake', 'undercover-similar-word', 'no-word-imposter', 'fill-blank-battle', 'who-wrote-it'],
  trendingGameIds: ['trend-demo']
};

assert.equal(loader.version, 10);
assert.equal(loader.ledgerSource, 'session-ledger.js');
assert.equal(loader.controlsSource, 'party-session-controls.js');
assert.equal(loader.replacementGuardSource, 'quick-session-replacement-guard.js');
assert.equal(loader.waveOneSource, 'party-wave-one-modes.js');
assert.equal(loader.waveOneImposterSource, 'party-wave-one-imposter-modes.js');
assert.equal(loader.waveOneWritingSource, 'party-wave-one-writing-modes.js');
assert.equal(loader.selectSource(catalog, 'custom-game-demo'), 'party-created-modes.js');
assert.equal(loader.selectSource(catalog, 'viral-demo'), 'party-viral-modes.js');
assert.equal(loader.selectSource(catalog, 'mega-demo'), 'party-mega-modes.js');
assert.equal(loader.selectSource(catalog, 'party-quiz'), 'party-wave-one-modes.js');
assert.equal(loader.selectSource(catalog, 'fact-or-fake'), 'party-wave-one-modes.js');
assert.equal(loader.selectSource(catalog, 'undercover-similar-word'), 'party-wave-one-imposter-modes.js');
assert.equal(loader.selectSource(catalog, 'no-word-imposter'), 'party-wave-one-imposter-modes.js');
assert.equal(loader.selectSource(catalog, 'fill-blank-battle'), 'party-wave-one-writing-modes.js');
assert.equal(loader.selectSource(catalog, 'who-wrote-it'), 'party-wave-one-writing-modes.js');
assert.equal(loader.selectSource(catalog, 'quick-demo'), 'party-quick-modes.js');
assert.equal(loader.selectSource(catalog, 'trend-demo'), 'party-quick-modes.js');
assert.equal(loader.selectSource(catalog, 'unknown-demo'), null);
assert.equal(loader.selectSource(null, 'quick-demo'), null);
assert.equal(loader.selectSource(catalog, ''), null);

assert.deepEqual(loader.scriptPlan(catalog, 'custom-game-demo', false, false, false), [
  'session-ledger.js', 'party-session-controls.js', 'quick-session-replacement-guard.js', 'party-created-modes.js'
]);
assert.deepEqual(loader.scriptPlan(catalog, 'party-quiz', false, true, false), [
  'session-ledger.js', 'quick-session-replacement-guard.js', 'party-wave-one-modes.js'
]);
assert.deepEqual(loader.scriptPlan(catalog, 'undercover-similar-word', false, true, false), [
  'session-ledger.js', 'quick-session-replacement-guard.js', 'party-wave-one-imposter-modes.js'
]);
assert.deepEqual(loader.scriptPlan(catalog, 'fill-blank-battle', false, true, false), [
  'session-ledger.js', 'quick-session-replacement-guard.js', 'party-wave-one-writing-modes.js'
]);
assert.deepEqual(loader.scriptPlan(catalog, 'who-wrote-it', true, true, true), [
  'party-wave-one-writing-modes.js'
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
  waveOneQuizEngineRouted: true,
  waveOneImposterEngineRoutedBeforeWaveFallback: true,
  waveOneWritingEngineRoutedBeforeWaveFallback: true,
  loaderVersion: loader.version
}, null, 2));
