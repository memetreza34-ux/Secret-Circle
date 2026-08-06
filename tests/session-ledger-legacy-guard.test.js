'use strict';

const assert = require('node:assert/strict');
const Ledger = require('../session-ledger.js');
const Guard = require('../session-ledger-legacy-guard.js');

function storage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(String(key), String(value)); },
    removeItem(key) { values.delete(String(key)); },
    snapshot() { return Object.fromEntries(values); }
  };
}

function legacyWrite(engine, activeKey, prefix, includeExistingHub = true) {
  const active = {
    version: 1,
    gameId: `${engine}-demo`,
    targetRounds: 5,
    totalScore: 7,
    startedAt: '2026-08-06T17:00:00.000Z'
  };
  const baseHub = {
    version: 1,
    history: [],
    recent: [],
    stats: {},
    players: ['Alex', 'Sam', 'Mika']
  };
  const initial = { [activeKey]: JSON.stringify(active) };
  if (includeExistingHub) initial[Guard.hubKey] = JSON.stringify(baseHub);
  const memory = storage(initial);
  const nextHub = {
    ...baseHub,
    history: [{
      id: `${prefix}${Date.now()}-123`,
      gameId: active.gameId,
      title: `${engine} Demo`,
      endedAt: '2026-08-06T17:10:00.000Z',
      rounds: active.targetRounds,
      score: active.totalScore
    }],
    recent: [active.gameId],
    stats: {
      [active.gameId]: { plays: 1, rounds: active.targetRounds, best: active.totalScore }
    }
  };

  const firstRaw = Guard.normalizeHubWrite(memory, JSON.stringify(nextHub), Ledger);
  const first = JSON.parse(firstRaw);
  memory.setItem(Guard.hubKey, firstRaw);
  assert.equal(first.history.length, 1);
  assert.match(first.history[0].id, new RegExp(`^completion-${engine}-`));
  assert.deepEqual(first.stats[active.gameId], { plays: 1, rounds: 5, best: 7 });

  const retryHub = JSON.parse(JSON.stringify(nextHub));
  retryHub.history[0].id = `${prefix}${Date.now() + 1}-456`;
  retryHub.history[0].endedAt = '2026-08-06T17:11:00.000Z';
  retryHub.stats[active.gameId] = { plays: 2, rounds: 10, best: 7 };
  const retry = JSON.parse(Guard.normalizeHubWrite(memory, JSON.stringify(retryHub), Ledger));
  assert.equal(retry.history.length, 1, `${engine} retry must not duplicate history.`);
  assert.deepEqual(retry.stats[active.gameId], { plays: 1, rounds: 5, best: 7 });
  assert.equal(retry.history[0].id, first.history[0].id);
  return { memory, active, nextHub, first };
}

legacyWrite('mega', 'secret-circle-party-mega-active-v1', 'mega-');
legacyWrite('viral', 'secret-circle-party-viral-active-v1', 'viral-');
legacyWrite('mega', 'secret-circle-party-mega-active-v1', 'mega-', false);

const staleMega = {
  version: 1,
  gameId: 'stale-mega',
  targetRounds: 3,
  totalScore: 2,
  startedAt: '2026-08-06T16:00:00.000Z'
};
const activeViral = {
  version: 1,
  gameId: 'viral-current',
  targetRounds: 5,
  totalScore: 9,
  startedAt: '2026-08-06T18:00:00.000Z'
};
const staleMemory = storage({
  [Guard.hubKey]: JSON.stringify({ version: 1, history: [], recent: [], stats: {} }),
  'secret-circle-party-mega-active-v1': JSON.stringify(staleMega),
  'secret-circle-party-viral-active-v1': JSON.stringify(activeViral)
});
const viralWrite = {
  version: 1,
  history: [{ id: 'viral-123', gameId: activeViral.gameId, title: 'Viral Current', endedAt: '2026-08-06T18:10:00.000Z', rounds: 5, score: 9 }],
  recent: [activeViral.gameId],
  stats: { [activeViral.gameId]: { plays: 1, rounds: 5, best: 9 } }
};
const staleResolved = JSON.parse(Guard.normalizeHubWrite(staleMemory, JSON.stringify(viralWrite), Ledger));
assert.match(staleResolved.history[0].id, /^completion-viral-/);
assert.deepEqual(staleResolved.stats[activeViral.gameId], { plays: 1, rounds: 5, best: 9 });

const unrelatedStorage = storage({
  [Guard.hubKey]: JSON.stringify({ version: 1, history: [], recent: [], stats: {} })
});
const unrelated = JSON.stringify({ version: 1, history: [], recent: [], stats: { demo: { plays: 4 } } });
assert.equal(Guard.normalizeHubWrite(unrelatedStorage, unrelated, Ledger), unrelated);

assert.equal(Guard.version, 2);
assert.equal(Guard.engines.length, 2);
assert.equal(Guard.contextsFor(staleMemory).length, 2);

console.log(JSON.stringify({
  ok: true,
  megaExactOnceGuarded: true,
  viralExactOnceGuarded: true,
  firstHubWriteGuarded: true,
  staleOtherEngineIgnored: true,
  retryDoesNotDuplicateStats: true,
  unrelatedWritesUntouched: true
}, null, 2));
