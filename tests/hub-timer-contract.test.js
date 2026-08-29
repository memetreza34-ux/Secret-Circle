'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const hub = fs.readFileSync(path.join(root, 'party-hub.js'), 'utf8');
const timers = fs.readFileSync(path.join(root, 'party-hub-timers.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'party.html'), 'utf8');
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

assert.ok(hub.includes('const S = window.SecretCircleSessionControls;'));
assert.ok(hub.includes('const T = window.SecretCirclePartyHubTimers;'));
assert.ok(hub.includes('const hubTimer = S.createController({ windowRef: window });'));
assert.ok(hub.includes('T.normalizeTimerState(value, { safeInteger, cleanText })'));
assert.ok(hub.includes('T.createTimerGames({'));
assert.ok(hub.includes('timerGames.renderStoredTimerSession()'));
assert.ok(hub.includes('hubTimer.remainingMilliseconds()'));
assert.ok(hub.includes("document.addEventListener('visibilitychange'"));
assert.ok(hub.includes("window.addEventListener('pagehide'"));
assert.ok(hub.includes('setHubPaused(true)'));
assert.ok(hub.includes("$('#pause-hub-game').addEventListener('click'"));

assert.ok(timers.includes("TIMER_KINDS = new Set(['charades', 'taboo', 'hot-potato', 'word-chain'])"));
assert.ok(timers.includes('const HOT_POTATO_MIN_MS = 10_000;'));
assert.ok(timers.includes('const HOT_POTATO_MAX_MS = 25_000;'));
assert.ok(timers.includes('HOT_POTATO_MIN_MS + randomInt(HOT_POTATO_RANGE_MS)'));
assert.ok(!timers.includes('10000 + randomInt(16000)'));
assert.ok(timers.includes('const R = window.SecretCirclePartyHubRoundState;'));
assert.ok(timers.includes("R.ensureCurrent(current, 'hot-potato'"));
assert.ok(timers.includes("R.ensureCurrent(current, 'word-chain'"));
assert.match(timers, /function startHotPotato[\s\S]*?R\.clearCurrent\(current\)/);
assert.match(timers, /function startWordChain[\s\S]*?R\.clearCurrent\(current\)/);
assert.ok(timers.includes("kind: 'charades', phase: 'running', remainingMs"));
assert.ok(timers.includes("kind: 'taboo', phase: 'running', remainingMs"));
assert.ok(timers.includes("kind: 'hot-potato', phase: 'running', remainingMs"));
assert.ok(timers.includes("kind: 'word-chain', phase: 'running', remainingMs"));
assert.ok(timers.includes('hubTimer.countdown(remainingMs / 1000, timer, finishCharadesTimer)'));
assert.ok(timers.includes('hubTimer.countdown(remainingMs / 1000, timer, finishTabooTimer)'));
assert.ok(timers.includes('hubTimer.countdown(remainingMs / 1000, hiddenClock, finishHotPotatoTimer)'));
assert.ok(timers.includes('hubTimer.countdown(remainingMs / 1000, timer, finishWordChainTimer)'));
assert.ok(timers.includes("timerState.kind === 'taboo') startTaboo"));
assert.ok(timers.includes('window.SecretCirclePartyHubTimers'));
for (const source of [hub, timers]) {
  assert.ok(!source.includes('activeTimer'));
  assert.ok(!source.includes('window.setInterval('));
  assert.ok(!source.includes('performance.now()'));
}

assert.ok(html.includes('id="pause-hub-game"'));
assert.ok(html.includes('id="play-pause-status"'));
const ledgerIndex = html.indexOf('<script src="session-ledger.js"></script>');
const controlsIndex = html.indexOf('<script src="party-session-controls.js"></script>');
const timersIndex = html.indexOf('<script src="party-hub-timers.js"></script>');
const roundStateIndex = html.indexOf('<script src="party-hub-round-state.js"></script>');
const hubIndex = html.indexOf('<script src="party-hub.js"></script>');
assert.ok(ledgerIndex >= 0 && controlsIndex > ledgerIndex && timersIndex > controlsIndex && roundStateIndex > timersIndex && hubIndex > roundStateIndex);
assert.ok(packageJson.scripts.check.includes('node --check tests/e2e/core-hub-prestart-resume.spec.js'));

console.log(JSON.stringify({
  hubTimerContract: 'PASS',
  splitTimerModule: true,
  sharedController: true,
  pausableCoreTimers: ['charades', 'taboo', 'hot-potato', 'word-chain'],
  hotPotatoRangeMs: [10_000, 25_000],
  preStartResumeModes: ['hot-potato', 'word-chain'],
  preStartCurrentClearedAtTimerStart: true,
  preStartBrowserContractInSyntaxGate: true,
  persistedRemainingTime: true,
  backgroundAutoPause: true,
  reloadResumePaused: true
}, null, 2));
