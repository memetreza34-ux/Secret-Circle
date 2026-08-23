'use strict';
const assert = require('node:assert/strict');
const Guard = require('../party-hub-resume-guard.js');

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

console.log(JSON.stringify({
  ok: true,
  version: Guard.version,
  crossModeTimerInjectionRejected: true,
  timerPhaseConsistencyProtected: true,
  nonTimerRunningStateRejected: true
}, null, 2));
