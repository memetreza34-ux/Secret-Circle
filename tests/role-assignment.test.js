'use strict';
const assert = require('node:assert/strict');
const E = require('../game-engine.js');
const Roles = require('../role-assignment.js');

const entries = Array.from({ length: 12 }, (_, index) => [`Begriff ${index + 1}`, `Hinweis ${index + 1}`]);
const players = ['Alex', 'Sam', 'Mika', 'Lina', 'Noah', 'Kim'];

assert.equal(Roles.MAX_IMPOSTERS, 6);
assert.equal(Roles.version, 1);
assert.equal(Object.isFrozen(Roles), true);
assert.equal(Roles.install(E), E);
assert.equal(Roles.install(E), E, 'Installation must be idempotent.');
assert.equal(E.MAX_IMPOSTERS, 6);

const firstRevealWasImposter = new Set();
let revealPrefixMatches = 0;
for (let index = 0; index < 200; index += 1) {
  const seed = `independent-role-seed-${index}`;
  const game = E.createGame({
    players,
    entries,
    category: 'Test',
    imposterCount: 2,
    roundSeconds: 60,
    matchRounds: 2,
    seed
  });
  E.assertGame(game);
  firstRevealWasImposter.add(game.imposters.includes(game.revealOrder[0]));
  const prefix = new Set(game.revealOrder.slice(0, game.imposters.length));
  if (game.imposters.every(name => prefix.has(name))) revealPrefixMatches += 1;

  const repeated = E.createGame({
    players,
    entries,
    category: 'Test',
    imposterCount: 2,
    roundSeconds: 60,
    matchRounds: 2,
    seed
  });
  assert.deepEqual(repeated.revealOrder, game.revealOrder);
  assert.deepEqual(repeated.imposters, game.imposters);
  assert.equal(repeated.word, game.word);
}

assert.deepEqual(firstRevealWasImposter, new Set([true, false]), 'Reveal position must not disclose the role.');
assert.ok(revealPrefixMatches > 0, 'Independent assignment may naturally coincide with reveal order.');
assert.ok(revealPrefixMatches < 200, 'Imposters must not always be the first reveal positions.');

assert.throws(() => E.createGame({
  players: Array.from({ length: 8 }, (_, index) => `P${index + 1}`),
  entries,
  imposterCount: 7,
  roundSeconds: 60,
  matchRounds: 1,
  seed: 'too-many-imposters'
}), /zwischen 1 und 6/);

let completed = E.createGame({
  players,
  entries,
  category: 'Test',
  imposterCount: 2,
  roundSeconds: 60,
  matchRounds: 2,
  seed: 'next-round-one'
});
while (completed.phase === 'reveal') completed = E.advanceReveal(completed);
completed = E.startVoting(completed);
for (const voter of completed.players) {
  const target = completed.players.find(name => name !== voter && !completed.imposters.includes(name)) || completed.players.find(name => name !== voter);
  completed = E.castVote(completed, voter, target);
}
completed = E.resolveVote(completed);
assert.equal(completed.phase, 'completed');
const next = E.nextRound(completed, {
  entries,
  category: 'Test',
  imposterCount: 2,
  useHint: true,
  roundSeconds: 60,
  seed: 'next-round-two'
});
E.assertGame(next);
assert.equal(next.currentRound, 2);
assert.equal(next.imposters.length, 2);

console.log(JSON.stringify({
  ok: true,
  roleAssignmentVersion: Roles.version,
  maximumImposters: Roles.MAX_IMPOSTERS,
  sampledGames: 200,
  revealPrefixMatches,
  firstRevealRoleVaries: true,
  deterministic: true,
  nextRoundCovered: true
}, null, 2));
