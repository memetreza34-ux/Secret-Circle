'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const RoundState = require('../party-hub-round-state.js');

function read(file) {
  return fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
}

const hub = read('party-hub.js');
const timers = read('party-hub-timers.js');
const runtime = read('runtime-guard.js');
const partyPage = read('party.html');

assert.match(hub, /ACTIVE_KEY = 'secret-circle-party-hub-active-v1'/);
assert.match(hub, /ACTIVE_VERSION = 1/);
assert.match(hub, /SecretCirclePartyHubRoundState/);
assert.match(hub, /normalizeActiveSession/);
assert.match(hub, /R\.normalizeResume/);
assert.match(hub, /R\.ensureCurrent/);
assert.match(hub, /R\.clearCurrent/);
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
assert.ok(partyPage.indexOf('party-hub-round-state.js') < partyPage.indexOf('party-hub.js'));

assert.equal(RoundState.version, 1);
const catalog = {
  content: {
    'truth-dare': { Standard: { truth: ['T0', 'T1'], dare: ['D0', 'D1'] } },
    'never-have': { Standard: ['P0', 'P1'] },
    'would-rather': { Standard: [['A0', 'B0'], ['A1', 'B1']] },
    paranoia: { Standard: ['SECRET'] }
  }
};
const truthGame = { id: 'truth-dare', mode: 'truth-dare' };
const promptGame = { id: 'never-have', mode: 'prompt' };
const choiceGame = { id: 'would-rather', mode: 'choice' };
const secretGame = { id: 'paranoia', mode: 'paranoia' };

const truthSession = { used: [], usedByPool: { truth: [], dare: [] }, current: null };
assert.deepEqual(RoundState.ensureCurrent(truthSession, 'truth-dare', catalog.content['truth-dare'].Standard.truth, () => 0, 'truth'), { index: 0, value: 'T0' });
RoundState.clearCurrent(truthSession);
assert.deepEqual(RoundState.ensureCurrent(truthSession, 'truth-dare', catalog.content['truth-dare'].Standard.dare, () => 0, 'dare'), { index: 0, value: 'D0' });
assert.deepEqual(truthSession.usedByPool, { truth: [0], dare: [0] }, 'truth and dare index spaces must stay independent');

const resumedTruth = RoundState.normalizeResume(truthGame, 'Standard', {
  used: [99],
  usedByPool: truthSession.usedByPool,
  current: { kind: 'truth-dare', pool: 'dare', index: 0 }
}, catalog, 500);
assert.deepEqual(resumedTruth.usedByPool, { truth: [0], dare: [0] });
assert.deepEqual(resumedTruth.current, { kind: 'truth-dare', pool: 'dare', index: 0 });

assert.deepEqual(
  RoundState.normalizeCurrent(promptGame, 'Standard', { kind: 'prompt', index: 1 }, catalog),
  { kind: 'prompt', index: 1 }
);
assert.deepEqual(
  RoundState.normalizeCurrent(choiceGame, 'Standard', { kind: 'choice', index: 0 }, catalog),
  { kind: 'choice', index: 0 }
);
assert.equal(RoundState.normalizeCurrent(promptGame, 'Standard', { kind: 'prompt', index: 99 }, catalog), null);
assert.equal(RoundState.normalizeCurrent(promptGame, 'Standard', { kind: 'prompt', index: -1 }, catalog), null);
assert.equal(RoundState.normalizeCurrent(secretGame, 'Standard', { kind: 'prompt', index: 0 }, catalog), null, 'secret modes must never restore a visible current card');

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
  safeCurrentCardResume: true,
  truthDareIndependentPools: true,
  secretCurrentNotRestored: true,
  playerSnapshot: true,
  timerRestoration: ['charades', 'taboo', 'hot-potato', 'word-chain'],
  pwaUpdateProtection: true
}, null, 2));
