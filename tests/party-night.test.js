'use strict';
const assert = require('node:assert/strict');
const catalog = require('../party-routing.js');
const planner = require('../party-night.js');

assert.equal(planner.version, 1);
assert.equal(planner.storageKey, 'secret-circle-party-night-v1');
assert.deepEqual(planner.normalizeConfig({ players: 99, duration: 31, mood: 'invalid', ageLevel: 'invalid' }), {
  players: 20,
  duration: 45,
  mood: 'all',
  ageLevel: 'all'
});

const familyGames = planner.eligibleGames({ players: 4, duration: 45, mood: 'funny', ageLevel: 'family' });
assert.ok(familyGames.length >= 3);
assert.ok(familyGames.every(game => game.status === 'playable'));
assert.ok(familyGames.every(game => game.age === 'all'));
assert.ok(familyGames.every(game => game.minPlayers <= 4 && game.maxPlayers >= 4));
assert.ok(familyGames.every(game => !['utility', 'random-player'].includes(game.mode)));

const config = { players: 4, duration: 45, mood: 'funny', ageLevel: 'all' };
const context = { favorites: ['charades'], recent: ['truth-dare'] };
const plan = planner.buildPlan(config, context, () => 0);
const repeatedPlan = planner.buildPlan(config, context, () => 0);
assert.ok(plan);
assert.equal(plan.version, 1);
assert.equal(plan.config.players, 4);
assert.equal(plan.config.duration, 45);
assert.equal(plan.steps.length, 3);
assert.deepEqual(repeatedPlan.steps.map(step => step.gameId), plan.steps.map(step => step.gameId));
assert.equal(new Set(plan.steps.map(step => step.gameId)).size, plan.steps.length);
assert.ok(plan.steps.every(step => catalog.getGame(step.gameId)?.status === 'playable'));
assert.ok(plan.steps.every(step => step.status === 'pending'));
assert.equal(plan.currentIndex, 0);
assert.ok(plan.estimatedMinutes >= 30);

const shortPlan = planner.buildPlan({ players: 4, duration: 15, mood: 'all', ageLevel: 'all' }, {}, () => -99);
assert.equal(shortPlan.steps.length, 1);
assert.ok(catalog.getGame(shortPlan.steps[0].gameId));
const malformedRandomPlan = planner.buildPlan(config, context, () => Number.NaN);
assert.equal(malformedRandomPlan.steps.length, 3);
assert.equal(new Set(malformedRandomPlan.steps.map(step => step.gameId)).size, 3);

const firstId = plan.steps[0].gameId;
const secondId = plan.steps[1].gameId;
const progressed = planner.updateStep(plan, firstId, 'done');
assert.equal(progressed.steps[0].status, 'done');
assert.equal(progressed.currentIndex, 1);
const skipped = planner.updateStep(progressed, secondId, 'skipped');
assert.equal(skipped.steps[1].status, 'skipped');
assert.equal(skipped.currentIndex, 2);
const completed = planner.updateStep(skipped, skipped.steps[2].gameId, 'done');
assert.equal(completed.currentIndex, completed.steps.length);

const normalized = planner.normalizePlan({
  ...completed,
  steps: [
    ...completed.steps,
    { gameId: completed.steps[0].gameId, status: 'pending' },
    { gameId: 'unknown-game', status: 'done' }
  ]
});
assert.equal(normalized.steps.length, completed.steps.length);
assert.equal(normalized.currentIndex, normalized.steps.length);
assert.equal(planner.normalizePlan({ version: 1, steps: [] }), null);

const historyPlan = planner.normalizePlan({
  version: 1,
  id: 'history-plan',
  createdAt: '2026-08-05T10:00:00.000Z',
  config: { players: 4, duration: 30, mood: 'all', ageLevel: 'all' },
  estimatedMinutes: 30,
  steps: [
    { gameId: 'charades', status: 'pending', reason: 'Test' },
    { gameId: 'imposter', status: 'pending', reason: 'Test' }
  ]
});
const historySync = planner.syncPlanFromHistory(historyPlan, [
  { gameId: 'charades', endedAt: '2026-08-05T10:05:00.000Z' },
  { gameId: 'truth-dare', endedAt: '2026-08-05T09:59:59.000Z' },
  { gameId: 'unknown-game', endedAt: '2026-08-05T10:06:00.000Z' }
], [
  { completedAt: '2026-08-05T10:10:00.000Z' }
]);
assert.equal(historySync.changed, true);
assert.deepEqual(historySync.plan.steps.map(step => step.status), ['done', 'done']);
assert.equal(historySync.plan.currentIndex, 2);
assert.ok(historySync.completedGameIds.includes('charades'));
assert.ok(historySync.completedGameIds.includes('imposter'));

const oldHistorySync = planner.syncPlanFromHistory({
  ...historyPlan,
  steps: historyPlan.steps.map(step => ({ ...step, status: 'pending' }))
}, [{ gameId: 'charades', endedAt: '2026-08-05T09:00:00.000Z' }], []);
assert.equal(oldHistorySync.changed, false);
assert.deepEqual(oldHistorySync.plan.steps.map(step => step.status), ['pending', 'pending']);

const memory = new Map();
const storage = {
  getItem: key => memory.has(key) ? memory.get(key) : null,
  setItem: (key, value) => memory.set(key, value),
  removeItem: key => memory.delete(key)
};
const store = planner.createStore(storage);
assert.equal(store.load(), null);
assert.equal(store.save(plan).ok, true);
assert.deepEqual(store.load().steps.map(step => step.gameId), plan.steps.map(step => step.gameId));
assert.equal(store.clear().ok, true);
assert.equal(store.load(), null);

const failingStore = planner.createStore({
  getItem: () => null,
  setItem: () => { throw new Error('quota'); },
  removeItem: () => { throw new Error('locked'); }
});
assert.equal(failingStore.save(plan).ok, false);
assert.equal(failingStore.clear().ok, false);

console.log(JSON.stringify({
  ok: true,
  partyNightVersion: planner.version,
  eligibleFamilyGames: familyGames.length,
  generatedSteps: plan.steps.length,
  shortPlanSteps: shortPlan.steps.length,
  stableDeterministicRanking: true,
  uniqueGames: true,
  ageAndGroupFiltering: true,
  persistentProgress: true,
  historyProgressSync: true,
  storageFailuresHandled: true
}, null, 2));
