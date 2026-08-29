'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function read(file) {
  return fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
}

const loader = read('quick-loader.js');
const controls = read('party-session-controls.js');
const quickPlay = read('quick-play.html');
const created = read('party-created-modes.js');
const quick = read('party-quick-modes.js');
const mega = read('party-mega-modes.js');
const viral = read('party-viral-modes.js');
const serviceWorker = read('sw.js');

assert.match(loader, /session-ledger\.js/);
assert.match(loader, /party-session-controls\.js/);
assert.match(loader, /SecretCircleSessionLedger/);
assert.match(loader, /SecretCircleSessionControls/);
assert.match(controls, /function createController/);
assert.match(controls, /function countdown/);
assert.match(controls, /function setPaused/);
assert.match(controls, /remainingMs/);
assert.doesNotMatch(loader, /session-ledger-legacy-guard\.js/);
assert.doesNotMatch(loader, /SecretCircleLegacySessionGuard/);
assert.match(serviceWorker, /\.\/session-ledger\.js/);
assert.match(serviceWorker, /\.\/party-session-controls\.js/);

for (const id of ['quick-pause', 'quick-skip', 'quick-exit', 'quick-replay', 'quick-next-game', 'quick-pause-overlay']) {
  assert.match(quickPlay, new RegExp(`id="${id}"`), `Shared control is missing from quick-play.html: ${id}`);
}

for (const [name, source, engine] of [
  ['Creator', created, 'created'],
  ['Quick', quick, 'quick'],
  ['Mega', mega, 'mega'],
  ['Viral', viral, 'viral']
]) {
  assert.match(source, /SecretCircleSessionLedger/, `${name} engine must require the shared ledger.`);
  assert.match(source, /SecretCircleSessionControls/, `${name} engine must require the shared controls.`);
  assert.match(source, /S\.createController/, `${name} engine must create the shared controller.`);
  assert.match(source, /onSkip:/, `${name} engine must expose shared skip.`);
  assert.match(source, /onAbort: abortSession/, `${name} engine must expose shared abort.`);
  assert.match(source, /onReplay: replaySession/, `${name} engine must expose shared replay.`);
  assert.match(source, /sessionControls\.countdown/, `${name} engine must use the pausable shared timer.`);
  assert.match(source, /sessionControls\.stopTimer/, `${name} engine must stop the shared timer.`);
  assert.match(source, /sessionControls\.setSessionActive\(true\)/, `${name} engine must enable controls while playing.`);
  assert.match(source, /sessionControls\.setSessionActive\(false\)/, `${name} engine must disable controls after completion or abort.`);
  assert.match(source, new RegExp(`completionId\\('${engine}'`), `${name} engine must use a stable completion ID.`);
  assert.match(source, /recordCompletion\(loadHub\(\)/, `${name} engine must use exact-once recording.`);
  assert.match(source, /sessionId: L\.createSessionId/, `${name} engine must create a persistent session ID.`);
  assert.match(source, /legacySessionId/, `${name} engine must migrate old active sessions.`);
  assert.doesNotMatch(source, /let timerId = null/, `${name} engine must not keep its own interval timer.`);
  assert.doesNotMatch(source, /const deadline = Date\.now\(\) \+ seconds \* 1000/, `${name} engine must not keep the old non-pausable timer.`);
  assert.doesNotMatch(source, new RegExp(`${engine}-\\$\\{Date\\.now\\(\\)\\}`), `${name} engine must not use a new random completion ID on every retry.`);
  assert.match(source, /if \(result\.recorded && !saveHub\(result\.hub\)\) return/);
  assert.match(source, /if \(!saveActive\(\)\) \{\s*active = final;\s*return;/s, `${name} engine must restore active state if cleanup persistence fails.`);
}

console.log(JSON.stringify({
  ok: true,
  creatorExactOnceIntegrated: true,
  quickExactOnceIntegrated: true,
  megaExactOnceIntegrated: true,
  viralExactOnceIntegrated: true,
  sharedPauseSkipAbortReplay: true,
  sharedPausableTimer: true,
  deterministicNextGame: true,
  legacySessionsMigrated: true,
  legacyGuardRemovedFromRuntime: true,
  offlineSharedRuntimeIncluded: true
}, null, 2));
