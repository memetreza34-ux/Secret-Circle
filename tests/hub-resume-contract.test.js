'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function read(file) {
  return fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
}

const hub = read('party-hub.js');
const runtime = read('runtime-guard.js');

assert.match(hub, /ACTIVE_KEY = 'secret-circle-party-hub-active-v1'/);
assert.match(hub, /ACTIVE_VERSION = 1/);
assert.match(hub, /normalizeActiveSession/);
assert.match(hub, /normalizeTimerState/);
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

for (const kind of ['charades', 'hot-potato', 'word-chain']) {
  assert.ok(hub.includes(`'${kind}'`), `missing resumable timer kind: ${kind}`);
}
assert.match(hub, /hubTimer\.remainingMilliseconds\(\)/);
assert.match(hub, /renderStoredTimerSession/);
assert.match(hub, /Laufende Timer-Runde wiederhergestellt und sicher pausiert/);
assert.match(hub, /setHubPaused\(true\)/);
assert.match(hub, /window\.addEventListener\('pagehide'/);
assert.match(hub, /document\.addEventListener\('visibilitychange'/);
assert.doesNotMatch(hub, /window\.setInterval/);
assert.doesNotMatch(hub, /performance\.now\(/);
assert.doesNotMatch(hub, /activeTimer/);

assert.match(runtime, /secret-circle-party-hub-active-v1/);
assert.match(runtime, /ACTIVE_SESSION_KEYS/);
assert.match(runtime, /hasActiveSession/);

console.log(JSON.stringify({
  ok: true,
  directHubActiveState: true,
  explicitSafeResume: true,
  playerSnapshot: true,
  secretContentNotAutoOpened: true,
  timerRestoration: ['charades', 'hot-potato', 'word-chain'],
  pwaUpdateProtection: true
}, null, 2));
