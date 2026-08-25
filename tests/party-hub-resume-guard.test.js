'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Guard = require('../party-hub-resume-guard.js');

const read = file => fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
const polish = read('party-hub-polish.js');
const worker = read('sw.js');

const games = {
  'truth-dare': { id: 'truth-dare', mode: 'truth-dare', status: 'playable' },
  charades: { id: 'charades', mode: 'charades', status: 'playable' },
  taboo: { id: 'taboo', mode: 'taboo', status: 'playable' },
  imposter: { id: 'imposter', mode: 'link', status: 'playable' }
};
const catalog = { getGame: id => games[id] || null };
const session = (gameId, extra = {}) => ({ gameId, running: false, timer: null, ...extra });
const snapshot = value => ({ version: 1, session: value });

assert.equal(Guard.version, 1);
assert.equal(Object.isFrozen(Guard), true);
assert.equal(Guard.activeKey, 'secret-circle-party-hub-active-v1');
assert.equal(Guard.activeVersion, 1);

assert.equal(Guard.validateSnapshot(snapshot(session('truth-dare')), catalog), true);
assert.equal(Guard.validateSnapshot(snapshot(session('truth-dare', { running: true })), catalog), false);
assert.equal(Guard.validateSnapshot(snapshot(session('truth-dare', {
  timer: { kind: 'charades', phase: 'running', remainingMs: 60_000 }, running: true
})), catalog), false);

assert.equal(Guard.validateSnapshot(snapshot(session('charades')), catalog), true);
assert.equal(Guard.validateSnapshot(snapshot(session('charades', {
  running: true, timer: { kind: 'charades', phase: 'running', remainingMs: 60_000 }
})), catalog), true);
assert.equal(Guard.validateSnapshot(snapshot(session('charades', {
  running: false, timer: { kind: 'charades', phase: 'ended', remainingMs: 0 }
})), catalog), true);
assert.equal(Guard.validateSnapshot(snapshot(session('charades', {
  running: true, timer: { kind: 'taboo', phase: 'running', remainingMs: 60_000 }
})), catalog), false);
assert.equal(Guard.validateSnapshot(snapshot(session('charades', {
  running: false, timer: { kind: 'charades', phase: 'running', remainingMs: 60_000 }
})), catalog), false);
assert.equal(Guard.validateSnapshot(snapshot(session('charades', {
  running: true, timer: { kind: 'charades', phase: 'running', remainingMs: 0 }
})), catalog), false);
assert.equal(Guard.validateSnapshot(snapshot(session('charades', {
  running: true, timer: { kind: 'charades', phase: 'running', remainingMs: 3_600_001 }
})), catalog), false);
assert.equal(Guard.validateSnapshot(snapshot(session('charades', {
  running: false, timer: { kind: 'charades', phase: 'ended', remainingMs: 1 }
})), catalog), false);

assert.equal(Guard.validateSnapshot({ version: 2, session: session('truth-dare') }, catalog), false);
assert.equal(Guard.validateSnapshot(snapshot(session('imposter')), catalog), false);
assert.equal(Guard.validateSnapshot(snapshot(session('missing')), catalog), false);
assert.equal(Guard.validateSnapshot(null, catalog), false);

// Runtime integration: the browser must execute the same tested guard instead of a copied validator.
assert.match(polish, /function loadHubResumeGuard\(\)/);
assert.match(polish, /party-hub-resume-guard\.js/);
assert.match(polish, /SecretCirclePartyHubResumeGuard\?\.timerMatchesGame/);
assert.match(polish, /guard\.install\(window\)/);
assert.match(polish, /loadHubResumeGuard\(\);/);
assert.doesNotMatch(polish, /const ACTIVE_KEY = 'secret-circle-party-hub-active-v1'/);
assert.doesNotMatch(polish, /const TIMER_MODES = new Set/);
assert.match(worker, /\.\/party-hub-resume-guard\.js/);

console.log(JSON.stringify({
  ok: true,
  version: Guard.version,
  crossModeTimerInjectionRejected: true,
  timerPhaseConsistencyProtected: true,
  nonTimerRunningStateRejected: true,
  runtimeUsesTestedGuard: true,
  duplicatePolishValidatorRemoved: true,
  offlineGuardRequired: true
}, null, 2));