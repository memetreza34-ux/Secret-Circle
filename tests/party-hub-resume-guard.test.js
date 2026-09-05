'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Guard = require('../party-hub-resume-guard.js');
const releaseMeta = require('../release-meta.json');

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

assert.equal(Guard.version, 2);
assert.equal(Object.isFrozen(Guard), true);
assert.equal(Guard.activeKey, 'secret-circle-party-hub-active-v1');
assert.equal(Guard.activeVersion, 1);
assert.equal(typeof Guard.removeResumeUi, 'function');

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

// Regression: a stale resume card must disappear together with an invalid stored snapshot.
{
  let resumeRemoved = false;
  let removedStorageKey = null;
  const errorClasses = new Set();
  const status = {
    textContent: '',
    classList: { add: value => errorClasses.add(value) }
  };
  const resumeNode = { remove: () => { resumeRemoved = true; } };
  const invalid = snapshot(session('truth-dare', {
    running: true,
    timer: { kind: 'charades', phase: 'running', remainingMs: 60_000 }
  }));
  const root = {
    SecretCirclePartyCatalog: catalog,
    localStorage: {
      getItem: key => key === Guard.activeKey ? JSON.stringify(invalid) : null,
      removeItem: key => { removedStorageKey = key; }
    },
    document: {
      querySelector: selector => {
        if (selector === '#hub-resume-session') return resumeNode;
        if (selector === '#hub-status') return status;
        return null;
      }
    }
  };

  assert.equal(Guard.install(root), false);
  assert.equal(removedStorageKey, Guard.activeKey);
  assert.equal(resumeRemoved, true);
  assert.match(status.textContent, /inkonsistenter Timer-Spielstand/);
  assert.equal(errorClasses.has('error'), true);
}

// Valid stored sessions must remain untouched.
{
  let removeCalls = 0;
  let resumeRemoved = false;
  const valid = snapshot(session('charades', {
    running: true,
    timer: { kind: 'charades', phase: 'running', remainingMs: 30_000 }
  }));
  const root = {
    SecretCirclePartyCatalog: catalog,
    localStorage: {
      getItem: key => key === Guard.activeKey ? JSON.stringify(valid) : null,
      removeItem: () => { removeCalls += 1; }
    },
    document: {
      querySelector: selector => selector === '#hub-resume-session'
        ? { remove: () => { resumeRemoved = true; } }
        : null
    }
  };

  assert.equal(Guard.install(root), true);
  assert.equal(removeCalls, 0);
  assert.equal(resumeRemoved, false);
}

// Runtime integration: the browser must execute the same tested guard instead of a copied validator.
assert.match(polish, /function setResumeUiPending\(pending\)/);
assert.match(polish, /resume\.setAttribute\('aria-busy', 'true'\)/);
assert.match(polish, /control\.disabled = true/);
assert.match(polish, /control\.setAttribute\('aria-disabled', 'true'\)/);
assert.match(polish, /function loadHubResumeGuard\(\)[\s\S]*setResumeUiPending\(true\)/);
assert.match(polish, /party-hub-resume-guard\.js/);
assert.match(polish, /SecretCirclePartyHubResumeGuard\?\.timerMatchesGame/);
assert.match(polish, /guard\.install\(window\)/);
assert.match(polish, /else setResumeUiPending\(false\)/);
assert.match(polish, /loadHubResumeGuard\(\);/);
assert.doesNotMatch(polish, /const ACTIVE_KEY = 'secret-circle-party-hub-active-v1'/);
assert.doesNotMatch(polish, /const TIMER_MODES = new Set/);
assert.match(worker, /\.\/party-hub-resume-guard\.js/);
assert.match(worker, /\.\/party-hub-polish\.js/);
assert.match(worker, new RegExp(releaseMeta.offlineCache.production));

console.log(JSON.stringify({
  ok: true,
  version: Guard.version,
  crossModeTimerInjectionRejected: true,
  timerPhaseConsistencyProtected: true,
  nonTimerRunningStateRejected: true,
  staleResumeUiRemovedWithInvalidSnapshot: true,
  validResumeStatePreserved: true,
  resumeUiQuarantinedUntilGuardValidation: true,
  runtimeUsesTestedGuard: true,
  duplicatePolishValidatorRemoved: true,
  offlineGuardRequired: true,
  cacheContract: releaseMeta.offlineCache.production
}, null, 2));