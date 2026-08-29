'use strict';

const assert = require('node:assert/strict');
const Ledger = require('../session-ledger.js');

assert.equal(Ledger.version, 1);
assert.equal(Ledger.maximumHistory, 50);
assert.equal(Ledger.maximumRecent, 8);

const sessionId = Ledger.createSessionId('custom-game-demo', 1_700_000_000_000, 0.25);
assert.equal(sessionId, Ledger.createSessionId('custom-game-demo', 1_700_000_000_000, 0.25));
assert.ok(Ledger.normalizeSessionId(sessionId));
assert.equal(Ledger.normalizeSessionId('kurz'), '');
assert.equal(
  Ledger.legacySessionId('custom-game-demo', '2026-08-06T12:00:00.000Z', 5),
  Ledger.legacySessionId('custom-game-demo', '2026-08-06T12:00:00.000Z', 5)
);

const id = Ledger.completionId('created', 'custom-game-demo', sessionId);
assert.equal(id, Ledger.completionId('created', 'custom-game-demo', sessionId));
assert.notEqual(id, Ledger.completionId('created', 'custom-game-demo', `${sessionId}-new`));

const completion = {
  id,
  gameId: 'custom-game-demo',
  title: 'Eigenes Testspiel',
  endedAt: '2026-08-06T12:30:00.000Z',
  rounds: 5,
  score: 3
};

const first = Ledger.recordCompletion({ version: 1, history: [], recent: [], stats: {} }, completion);
assert.equal(first.recorded, true);
assert.equal(first.hub.history.length, 1);
assert.equal(first.hub.stats['custom-game-demo'].plays, 1);
assert.equal(first.hub.stats['custom-game-demo'].rounds, 5);
assert.equal(first.hub.stats['custom-game-demo'].best, 3);

const repeated = Ledger.recordCompletion(first.hub, completion);
assert.equal(repeated.recorded, false, 'The same completion must not be recorded twice.');
assert.equal(repeated.hub.history.length, 1);
assert.equal(repeated.hub.stats['custom-game-demo'].plays, 1);
assert.equal(repeated.hub.stats['custom-game-demo'].rounds, 5);

const secondSession = Ledger.recordCompletion(repeated.hub, {
  ...completion,
  id: Ledger.completionId('created', 'custom-game-demo', `${sessionId}-second`),
  score: 7
});
assert.equal(secondSession.recorded, true);
assert.equal(secondSession.hub.history.length, 2);
assert.equal(secondSession.hub.stats['custom-game-demo'].plays, 2);
assert.equal(secondSession.hub.stats['custom-game-demo'].rounds, 10);
assert.equal(secondSession.hub.stats['custom-game-demo'].best, 7);

assert.throws(() => Ledger.recordCompletion({}, { ...completion, id: '' }), /Ungültiger Session-Abschluss/);
assert.throws(() => Ledger.completionId('', 'game', sessionId), /Ungültige Session-Kennung/);

console.log(JSON.stringify({
  ok: true,
  deterministicSessionIds: true,
  stableCompletionIds: true,
  exactOnceHistory: true,
  exactOnceStatistics: true,
  bestScorePreserved: true
}, null, 2));
