'use strict';

const assert = require('node:assert/strict');
const loader = require('../quick-loader.js');

const catalog = {
  createdGameIds: ['custom-game-demo'], viralGameIds: ['viral-demo'], megaGameIds: ['mega-demo'],
  waveOneQuizGameIds: ['party-quiz', 'fact-or-fake'],
  waveOneImposterGameIds: ['undercover-similar-word', 'no-word-imposter'],
  waveOneWritingGameIds: ['fill-blank-battle', 'who-wrote-it'],
  waveOneVotingGameIds: ['percent-guess', 'party-bracket'],
  waveOneBluffGameIds: ['bluff-trivia'], waveOneClueGameIds: ['password-one-word'],
  waveOneGameIds: ['party-quiz','fact-or-fake','undercover-similar-word','no-word-imposter','fill-blank-battle','who-wrote-it','percent-guess','party-bracket','bluff-trivia','password-one-word'],
  quickGameIds: ['quick-demo','party-quiz','fact-or-fake','undercover-similar-word','no-word-imposter','fill-blank-battle','who-wrote-it','percent-guess','party-bracket','bluff-trivia','password-one-word'],
  trendingGameIds: ['trend-demo']
};

assert.equal(loader.version, 11);
assert.equal(loader.ledgerSource, 'session-ledger.js');
assert.equal(loader.controlsSource, 'party-session-controls.js');
assert.equal(loader.replacementGuardSource, 'quick-session-replacement-guard.js');
assert.equal(loader.waveOneSource, 'party-wave-one-modes.js');
assert.equal(loader.waveOneImposterSource, 'party-wave-one-imposter-modes.js');
assert.equal(loader.waveOneWritingSource, 'party-wave-one-writing-modes.js');
assert.equal(loader.waveOneVotingSource, 'party-wave-one-voting-modes.js');
assert.equal(loader.waveOneBluffSource, 'party-wave-one-bluff-modes.js');
assert.equal(loader.waveOneClueSource, 'party-wave-one-clue-modes.js');

const expected = {
  'custom-game-demo': 'party-created-modes.js', 'viral-demo': 'party-viral-modes.js', 'mega-demo': 'party-mega-modes.js',
  'party-quiz': 'party-wave-one-modes.js', 'fact-or-fake': 'party-wave-one-modes.js',
  'undercover-similar-word': 'party-wave-one-imposter-modes.js', 'no-word-imposter': 'party-wave-one-imposter-modes.js',
  'fill-blank-battle': 'party-wave-one-writing-modes.js', 'who-wrote-it': 'party-wave-one-writing-modes.js',
  'percent-guess': 'party-wave-one-voting-modes.js', 'party-bracket': 'party-wave-one-voting-modes.js',
  'bluff-trivia': 'party-wave-one-bluff-modes.js', 'password-one-word': 'party-wave-one-clue-modes.js',
  'quick-demo': 'party-quick-modes.js', 'trend-demo': 'party-quick-modes.js'
};
for (const [id, source] of Object.entries(expected)) assert.equal(loader.selectSource(catalog, id), source);
assert.equal(loader.selectSource(catalog, 'unknown-demo'), null);
assert.equal(loader.selectSource(null, 'quick-demo'), null);
assert.equal(loader.selectSource(catalog, ''), null);

assert.deepEqual(loader.scriptPlan(catalog, 'percent-guess', false, true, false), ['session-ledger.js','quick-session-replacement-guard.js','party-wave-one-voting-modes.js']);
assert.deepEqual(loader.scriptPlan(catalog, 'bluff-trivia', true, true, true), ['party-wave-one-bluff-modes.js']);
assert.deepEqual(loader.scriptPlan(catalog, 'password-one-word', false, false, false), ['session-ledger.js','party-session-controls.js','quick-session-replacement-guard.js','party-wave-one-clue-modes.js']);
assert.deepEqual(loader.scriptPlan(catalog, 'unknown-demo', false, false, false), []);

console.log(JSON.stringify({
  ok: true, explicitRouting: true, unknownRoutesRejected: true, sharedLedgerLoadsFirst: true,
  sharedControlsLoadBeforeGuard: true, replacementGuardLoadsBeforeEngine: true,
  waveOneQuizEngineRouted: true, waveOneImposterEngineRoutedBeforeWaveFallback: true,
  waveOneWritingEngineRoutedBeforeWaveFallback: true, waveOneVotingEngineRoutedBeforeWaveFallback: true,
  waveOneBluffEngineRoutedBeforeWaveFallback: true, waveOneClueEngineRoutedBeforeWaveFallback: true,
  loaderVersion: loader.version
}, null, 2));
