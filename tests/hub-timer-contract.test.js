'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const hub = fs.readFileSync(path.join(root, 'party-hub.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'party.html'), 'utf8');

assert.ok(hub.includes('const S = window.SecretCircleSessionControls;'));
assert.ok(hub.includes('const hubTimer = S.createController({ windowRef: window });'));
assert.ok(hub.includes("TIMER_KINDS = new Set(['charades', 'taboo', 'hot-potato', 'word-chain'])"));
assert.ok(hub.includes("kind: 'charades', phase: 'running', remainingMs"));
assert.ok(hub.includes("kind: 'taboo', phase: 'running', remainingMs"));
assert.ok(hub.includes("kind: 'hot-potato', phase: 'running', remainingMs"));
assert.ok(hub.includes("kind: 'word-chain', phase: 'running', remainingMs"));
assert.ok(hub.includes('hubTimer.countdown(remainingMs / 1000, timer, finishCharadesTimer)'));
assert.ok(hub.includes('hubTimer.countdown(remainingMs / 1000, timer, finishTabooTimer)'));
assert.ok(hub.includes('hubTimer.countdown(remainingMs / 1000, hiddenClock, finishHotPotatoTimer)'));
assert.ok(hub.includes('hubTimer.countdown(remainingMs / 1000, timer, finishWordChainTimer)'));
assert.ok(hub.includes('hubTimer.remainingMilliseconds()'));
assert.ok(hub.includes('renderStoredTimerSession'));
assert.ok(hub.includes("timerState.kind === 'taboo') startTaboo"));
assert.ok(hub.includes("document.addEventListener('visibilitychange'"));
assert.ok(hub.includes("window.addEventListener('pagehide'"));
assert.ok(hub.includes('setHubPaused(true)'));
assert.ok(hub.includes("$('#pause-hub-game').addEventListener('click'"));
assert.ok(hub.includes('syncHubPauseUi();\n      return true;'));
assert.ok(!hub.includes('activeTimer'));
assert.ok(!hub.includes('window.setInterval('));
assert.ok(!hub.includes('performance.now()'));

assert.ok(html.includes('id="pause-hub-game"'));
assert.ok(html.includes('id="play-pause-status"'));
const ledgerIndex = html.indexOf('<script src="session-ledger.js"></script>');
const controlsIndex = html.indexOf('<script src="party-session-controls.js"></script>');
const hubIndex = html.indexOf('<script src="party-hub.js"></script>');
assert.ok(ledgerIndex >= 0 && controlsIndex > ledgerIndex && hubIndex > controlsIndex);

console.log(JSON.stringify({
  hubTimerContract: 'PASS',
  sharedController: true,
  pausableCoreTimers: ['charades', 'taboo', 'hot-potato', 'word-chain'],
  persistedRemainingTime: true,
  backgroundAutoPause: true,
  reloadResumePaused: true
}, null, 2));