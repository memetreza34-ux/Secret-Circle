'use strict';
const assert = require('node:assert/strict');
const E = require('../game-engine.js');

const entries = [['Router', 'Netzwerk'], ['Sensor', 'Messung'], ['Kabel', 'Verbindung']];
const options = {
  players: ['Alex', 'Sam', 'Mika', 'Lina'],
  entries,
  category: 'Technik',
  imposterCount: 1,
  useHint: true,
  roundSeconds: 180,
  matchRounds: 3,
  seed: 'repeatable'
};

assert.deepEqual(E.normalizePlayers(' Alex\nSam, Mika '), ['Alex', 'Sam', 'Mika']);
assert.throws(() => E.normalizePlayers(['Alex', 'alex', 'Sam']), /Doppelter/);
assert.throws(() => E.normalizePlayers(['A', 'B']), /Mindestens/);
assert.equal(E.parseCustomEntries('Mond | Nacht\nSonne | Tag').length, 2);

const a = E.createGame(options);
const b = E.createGame(options);
assert.equal(a.version, 5);
assert.deepEqual(a.revealOrder, b.revealOrder);
assert.deepEqual(a.imposters, b.imposters);
assert.equal(a.word, b.word);
assert.equal(new Set(a.revealOrder).size, 4);
assert.equal(E.roleFor(a, a.imposters[0]).isImposter, true);
assert.equal(E.roleFor(a, a.players.find(player => !a.imposters.includes(player))).value, a.word);

let game = a;
for (let index = 0; index < 4; index += 1) game = E.advanceReveal(game);
assert.equal(game.phase, 'discussion');
game = E.setRemaining(game, 42);
assert.equal(game.remainingSeconds, 42);
game = E.startVoting(game);
for (const voter of game.players) {
  const target = game.players.find(name => name !== voter);
  game = E.castVote(game, voter, target);
}
game = E.resolveVote(game);
if (game.phase === 'tie_break') {
  game = E.startVoting(game);
  const leaders = [...game.voteLeaders];
  for (const voter of game.players) {
    const target = leaders.find(name => name !== voter) || leaders[0];
    game = E.castVote(game, voter, target);
  }
  game = E.resolveVote(game);
}
if (game.phase === 'guess') game = E.submitImposterGuess(game, game.word);
assert.equal(game.phase, 'completed');
assert.ok(['innocents', 'imposters'].includes(game.winner));
assert.equal(E.historyEntry(game).word, game.word);
assert.deepEqual(E.restoreGame(JSON.stringify(game)), game);
assert.equal(E.leaderboard(game).length, 4);

function discussionGame(seed = 'tie-test') {
  let current = E.createGame({ ...options, seed });
  for (let index = 0; index < current.players.length; index += 1) current = E.advanceReveal(current);
  return current;
}

let tie = E.startVoting(discussionGame());
const [p1, p2, p3, p4] = tie.players;
tie = E.castVote(tie, p1, p2);
tie = E.castVote(tie, p2, p1);
tie = E.castVote(tie, p3, p2);
tie = E.castVote(tie, p4, p1);
tie = E.resolveVote(tie);
assert.equal(tie.phase, 'tie_break');
assert.equal(tie.tieBreakCount, 1);
assert.deepEqual(new Set(tie.voteLeaders), new Set([p1, p2]));
assert.throws(() => E.castVote(E.startVoting(tie), p1, p3), /Stichwahl/);

let repeatedTie = E.startVoting(tie);
repeatedTie = E.castVote(repeatedTie, p1, p2);
repeatedTie = E.castVote(repeatedTie, p2, p1);
repeatedTie = E.castVote(repeatedTie, p3, p2);
repeatedTie = E.castVote(repeatedTie, p4, p1);
repeatedTie = E.resolveVote(repeatedTie);
assert.equal(repeatedTie.phase, 'completed');
assert.equal(repeatedTie.winner, 'imposters');
assert.equal(repeatedTie.eliminatedPlayer, null);

let duplicateVote = E.startVoting(discussionGame('duplicate-vote'));
duplicateVote = E.castVote(duplicateVote, duplicateVote.players[0], duplicateVote.players[1]);
assert.throws(
  () => E.castVote(duplicateVote, duplicateVote.players[0], duplicateVote.players[2]),
  /bereits abgestimmt/
);

const next = E.nextRound(game, { ...options, seed: 'round-2' });
assert.equal(next.currentRound, 2);
assert.deepEqual(next.scores, game.scores);
assert.equal(E.isMatchComplete(next), false);

assert.throws(() => E.restoreGame({ ...game, imposters: ['Niemand'] }), /Imposter/);
assert.throws(() => E.restoreGame({ ...game, imposters: [game.imposters[0], game.imposters[0]] }), /Imposter/);
assert.throws(() => E.restoreGame({ ...game, scores: { Alex: 0 } }), /Punktestand/);
assert.throws(() => E.restoreGame({ ...game, tieBreakCount: 2 }), /Stichwahlanzahl/);
assert.throws(() => E.restoreGame({ ...game, votes: { Alex: 'Alex' } }), /Selbststimmen/);
assert.throws(() => E.createGame({ ...options, imposterCount: 4 }), /Imposter-Zahl/);
assert.throws(() => E.createGame({ ...options, roundSeconds: 20 }), /Rundenzeit/);
assert.throws(() => E.createGame({ ...options, matchRounds: 0 }), /Match/);
assert.throws(() => E.submitImposterGuess({ ...game, phase: 'guess', completedAt: null, winner: null }, ''), /Begriff/);

console.log(JSON.stringify({
  ok: true,
  deterministic: true,
  roles: true,
  persistence: true,
  voting: true,
  finiteTieBreak: true,
  duplicateVoteProtection: true,
  scoring: true,
  matches: true,
  validation: true,
  history: true
}, null, 2));
