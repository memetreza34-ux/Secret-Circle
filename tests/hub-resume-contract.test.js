'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function read(file) {
  return fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
}

const hub = read('party-hub.js');
const timers = read('party-hub-timers.js');
const runtime = read('runtime-guard.js');

assert.match(hub, /ACTIVE_KEY = 'secret-circle-party-hub-active-v1'/);
assert.match(hub, /ACTIVE_VERSION = 1/);
assert.match(hub, /normalizeActiveSession/);
assert.match(hub, /T\.normalizeTimerState/);
assert.match(hub, /persistActiveSession/);
assert.match(hub, /loadActiveSession/);
assert.match(hub, /clearActiveSession/);
assert.match(hub, /offerHubResume/);
assert.match(hub, /Session fortsetzen/);
assert.match(hub, /Gespeicherten Stand verwerfen/);
assert.match(hub, /Geheime Inhalte werden nach einem Reload nicht automatisch geöffnet/);
assert.match(hub, /players: \[\.\.\.state\.players\]/);
assert.match(hub, /L\.normalizeSessionId/);
assert.match(hub, /MAX_ACTIVE_USED = 500/);
assert.match(hub, /hubTimer\.remainingMilliseconds\(\)/);
assert.match(hub, /timerGames\.renderStoredTimerSession\(\)/);
assert.match(hub, /window\.addEventListener\('pagehide'/);
assert.match(hub, /document\.addEventListener\('visibilitychange'/);

for (const kind of ['charades', 'taboo', 'hot-potato', 'word-chain']) {
  assert.ok(timers.includes(`'${kind}'`), `missing resumable timer kind: ${kind}`);
}
assert.match(timers, /renderStoredTimerSession/);
assert.match(timers, /Laufende Timer-Runde wiederhergestellt und sicher pausiert/);
assert.match(timers, /setHubPaused\(true\)/);
for (const source of [hub, timers]) {
  assert.doesNotMatch(source, /window\.setInterval/);
  assert.doesNotMatch(source, /performance\.now\(/);
  assert.doesNotMatch(source, /activeTimer/);
}

assert.match(runtime, /secret-circle-party-hub-active-v1/);
assert.match(runtime, /ACTIVE_SESSION_KEYS/);
assert.match(runtime, /hasActiveSession/);

console.log(JSON.stringify({
  ok: true,
  splitTimerModule: true,
  directHubActiveState: true,
  explicitSafeResume: true,
  playerSnapshot: true,
  secretContentNotAutoOpened: true,
  timerRestoration: ['charades', 'taboo', 'hot-potato', 'word-chain'],
  pwaUpdateProtection: true
}, null, 2));
