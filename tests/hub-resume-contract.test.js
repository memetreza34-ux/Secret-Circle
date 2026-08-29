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
const polish = read('party-hub-polish.js');

assert.match(hub, /ACTIVE_KEY = 'secret-circle-party-hub-active-v1'/);
assert.match(hub, /ACTIVE_VERSION = 1/);
assert.match(hub, /SecretCirclePartyHubRoundState/);
assert.match(hub, /normalizeActiveSession/);
assert.match(hub, /R\.normalizeResume/);
assert.match(hub, /R\.ensureCurrent/);
assert.match(hub, /R\.markParanoiaQuestion/);
assert.match(hub, /R\.resolveParanoia/);
assert.match(hub, /R\.clearCurrent/);
assert.match(hub, /Rundenergebnis anzeigen/);
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
assert.match(polish, /version: 17/);
assert.match(polish, /game\.id === 'paranoia'/);
assert.match(polish, /!playOptions\?\.querySelector\('button'\)/);

assert.equal(RoundState.version, 3);
assert.ok(RoundState.concealedCurrentModes.has('paranoia'));
assert.ok(RoundState.safeCurrentModes.has('hot-potato'));
assert.ok(RoundState.safeCurrentModes.has('word-chain'));

const catalog = {
  content: {
    'truth-dare': { Standard: { truth: ['T0', 'T1'], dare: ['D0', 'D1'] } },
    'never-have': { Standard: ['P0', 'P1'] },
    'would-rather': { Standard: [['A0', 'B0'], ['A1', 'B1']] },
    paranoia: { Standard: ['SECRET0', 'SECRET1'] },
    'hot-potato': { Standard: ['HP0', 'HP1'] },
    'word-chain': { Standard: ['A', 'B'] }
  }
};
const truthGame = { id: 'truth-dare', mode: 'truth-dare' };
const promptGame = { id: 'never-have', mode: 'prompt' };
const choiceGame = { id: 'would-rather', mode: 'choice' };
const secretGame = { id: 'paranoia', mode: 'paranoia' };
const hotPotatoGame = { id: 'hot-potato', mode: 'hot-potato' };
const wordChainGame = { id: 'word-chain', mode: 'word-chain' };

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

assert.deepEqual(RoundState.normalizeCurrent(promptGame, 'Standard', { kind: 'prompt', index: 1 }, catalog), { kind: 'prompt', index: 1 });
assert.deepEqual(RoundState.normalizeCurrent(choiceGame, 'Standard', { kind: 'choice', index: 0 }, catalog), { kind: 'choice', index: 0 });
assert.equal(RoundState.normalizeCurrent(promptGame, 'Standard', { kind: 'prompt', index: 99 }, catalog), null);
assert.equal(RoundState.normalizeCurrent(promptGame, 'Standard', { kind: 'prompt', index: -1 }, catalog), null);
assert.equal(RoundState.normalizeCurrent(secretGame, 'Standard', { kind: 'prompt', index: 0 }, catalog), null, 'mismatched kind must not become a secret resume reference');
assert.deepEqual(RoundState.normalizeCurrent(secretGame, 'Standard', { kind: 'paranoia', index: 0, phase: 'question' }, catalog), { kind: 'paranoia', index: 0, phase: 'question' });
assert.deepEqual(RoundState.normalizeCurrent(secretGame, 'Standard', { kind: 'paranoia', index: 1, phase: 'resolved', reveal: true }, catalog), { kind: 'paranoia', index: 1, phase: 'resolved', reveal: true });
assert.equal(RoundState.normalizeCurrent(secretGame, 'Standard', { kind: 'paranoia', index: 0, phase: 'resolved' }, catalog), null, 'resolved paranoia state requires an immutable boolean coin result');
assert.equal(RoundState.normalizeCurrent(secretGame, 'Standard', { kind: 'paranoia', index: 99, phase: 'question' }, catalog), null);

const paranoiaSession = { used: [], current: null };
assert.deepEqual(RoundState.ensureCurrent(paranoiaSession, 'paranoia', catalog.content.paranoia.Standard, () => 0), { index: 0, value: 'SECRET0' });
assert.equal(RoundState.markParanoiaQuestion(paranoiaSession), true);
assert.deepEqual(paranoiaSession.current, { kind: 'paranoia', index: 0, phase: 'question' });
assert.equal(RoundState.resolveParanoia(paranoiaSession, false), true);
assert.deepEqual(paranoiaSession.current, { kind: 'paranoia', index: 0, phase: 'resolved', reveal: false });
const resumedParanoia = RoundState.normalizeResume(secretGame, 'Standard', paranoiaSession, catalog, 500);
assert.deepEqual(resumedParanoia.current, paranoiaSession.current);
assert.deepEqual(resumedParanoia.used, [0]);

const hotPotatoSession = { used: [], current: null };
assert.deepEqual(RoundState.ensureCurrent(hotPotatoSession, 'hot-potato', catalog.content['hot-potato'].Standard, () => 0), { index: 0, value: 'HP0' });
assert.deepEqual(RoundState.normalizeResume(hotPotatoGame, 'Standard', hotPotatoSession, catalog, 500).current, { kind: 'hot-potato', index: 0 });
RoundState.clearCurrent(hotPotatoSession);
assert.equal(hotPotatoSession.current, null);

const wordChainSession = { used: [], current: null };
assert.deepEqual(RoundState.ensureCurrent(wordChainSession, 'word-chain', catalog.content['word-chain'].Standard, () => 1), { index: 1, value: 'B' });
assert.deepEqual(RoundState.normalizeResume(wordChainGame, 'Standard', wordChainSession, catalog, 500).current, { kind: 'word-chain', index: 1 });
RoundState.clearCurrent(wordChainSession);
assert.equal(wordChainSession.current, null);

const boundedPrompt = RoundState.normalizeResume(promptGame, 'Standard', { used: [0, 1, 99], current: null }, catalog, 500);
assert.deepEqual(boundedPrompt.used, [0, 1], 'stale used indexes outside current content must be removed');

for (const kind of ['charades', 'taboo', 'hot-potato', 'word-chain']) {
  assert.ok(timers.includes(`'${kind}'`), `missing resumable timer kind: ${kind}`);
}
assert.match(timers, /SecretCirclePartyHubRoundState/);
assert.match(timers, /R\.ensureCurrent\(current, 'hot-potato'/);
assert.match(timers, /R\.ensureCurrent\(current, 'word-chain'/);
assert.match(timers, /function startHotPotato[\s\S]*R\.clearCurrent\(current\)/);
assert.match(timers, /function startWordChain[\s\S]*R\.clearCurrent\(current\)/);
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
  safeCurrentCardResume: true,
  truthDareIndependentPools: true,
  concealedParanoiaReferenceResume: true,
  immutableParanoiaResolutionResume: true,
  resolvedParanoiaBlurConcealmentContract: true,
  preStartHotPotatoResume: true,
  preStartWordChainResume: true,
  preStartCurrentClearedOnTimerStart: true,
  staleUsedIndexesBounded: true,
  playerSnapshot: true,
  timerRestoration: ['charades', 'taboo', 'hot-potato', 'word-chain'],
  pwaUpdateProtection: true
}, null, 2));
