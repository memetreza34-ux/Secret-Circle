'use strict';
const assert = require('node:assert/strict');
const E = require('../game-engine.js');

const entries = [['Router', 'Netzwerk'], ['Sensor', 'Messung'], ['Kabel', 'Verbindung']];
const options = { players: ['Alex', 'Sam', 'Mika', 'Lina'], entries, category: 'Technik', imposterCount: 1, useHint: true, roundSeconds: 180, matchRounds: 4, seed: 'repeatable' };

function revealAll(game) {
  let current = game;
  while (current.phase === 'reveal') current = E.advanceReveal(current);
  return current;
}
function discussionGame(seed = 'discussion') { return revealAll(E.createGame({ ...options, seed })); }
function finishRound(game) {
  let current = game.phase === 'reveal' ? revealAll(game) : game;
  current = E.startVoting(current);
  const primary = current.players[0];
  const fallback = current.players[1];
  for (const voter of current.players) current = E.castVote(current, voter, voter === primary ? fallback : primary);
  current = E.resolveVote(current);
  if (current.phase === 'guess') current = E.submitImposterGuess(current, '__absichtlich_falsch__');
  assert.equal(current.phase, 'completed');
  return current;
}

assert.equal(E.VERSION, 7);
assert.deepEqual(E.normalizePlayers(' Alex\nSam, Mika '), ['Alex', 'Sam', 'Mika']);
assert.throws(() => E.normalizePlayers(['Alex', 'alex', 'Sam']), /Doppelter/);
assert.throws(() => E.normalizePlayers(['A', 'B']), /Mindestens/);
assert.equal(E.parseCustomEntries('Mond | Nacht\nSonne | Tag').length, 2);
assert.deepEqual(E.normalizeUsedWords(['Router', 'Sensor']), ['Router', 'Sensor']);
assert.throws(() => E.normalizeUsedWords(['Router', 'router']), /Doppelter Begriff/);

const first = E.createGame(options);
const repeated = E.createGame(options);
assert.deepEqual(first.revealOrder, repeated.revealOrder);
assert.deepEqual(first.imposters, repeated.imposters);
assert.equal(first.word, repeated.word);
assert.equal(new Set(first.revealOrder).size, 4);
assert.deepEqual(first.usedWords, [first.word]);
assert.equal(E.roleFor(first, first.imposters[0]).isImposter, true);
assert.equal(E.roleFor(first, first.players.find(player => !first.imposters.includes(player))).value, first.word);

let timed = discussionGame('timer');
timed = E.startTimer(timed, 1_000);
assert.equal(timed.timerRunning, true);
assert.equal(timed.timerDeadline, 181_000);
let synced = E.syncTimer(timed, 2_500);
assert.equal(synced.remainingSeconds, 179);
let paused = E.pauseTimer(timed, 2_500);
assert.equal(paused.remainingSeconds, 179);
assert.equal(paused.timerRunning, false);
assert.equal(paused.timerDeadline, null);
let resumed = E.startTimer(paused, 5_000);
assert.equal(resumed.timerDeadline, 184_000);
resumed = E.syncTimer(resumed, 184_001);
assert.equal(resumed.remainingSeconds, 0);
assert.equal(resumed.timerRunning, false);
assert.equal(resumed.timerDeadline, null);
assert.throws(() => E.startTimer(first, 1_000), /Diskussion/);
assert.throws(() => E.restoreGame({ ...timed, timerRunning: false }), /Timerfrist/);
assert.throws(() => E.restoreGame({ ...timed, timerDeadline: null }), /laufender Timer/);

let votingStopsTimer = E.startTimer(discussionGame('timer-vote'), 10_000);
votingStopsTimer = E.startVoting(votingStopsTimer);
assert.equal(votingStopsTimer.phase, 'voting');
assert.equal(votingStopsTimer.timerRunning, false);
assert.equal(votingStopsTimer.timerDeadline, null);

let tie = E.startVoting(discussionGame('tie-test'));
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
assert.throws(() => E.castVote(duplicateVote, duplicateVote.players[0], duplicateVote.players[2]), /bereits abgestimmt/);
assert.throws(() => E.castVote(E.startVoting(discussionGame('self-vote')), 'Alex', 'Alex'), /Ungültige Stimme/);

const round1 = finishRound(E.createGame({ ...options, seed: 'rotation-1' }));
const round2 = E.nextRound(round1, { ...options, seed: 'rotation-2' });
assert.equal(round2.currentRound, 2);
assert.deepEqual(round2.scores, round1.scores);
assert.notEqual(round2.word.toLocaleLowerCase('de-DE'), round1.word.toLocaleLowerCase('de-DE'));
assert.equal(round2.usedWords.length, 2);
const completed2 = finishRound(round2);
const round3 = E.nextRound(completed2, { ...options, seed: 'rotation-3' });
assert.equal(new Set(round3.usedWords.map(word => word.toLocaleLowerCase('de-DE'))).size, 3);
const completed3 = finishRound(round3);
const round4 = E.nextRound(completed3, { ...options, seed: 'rotation-4' });
assert.equal(round4.currentRound, 4);
assert.equal(round4.usedWords.length, 1);
const completed4 = finishRound(round4);
assert.equal(E.isMatchComplete(completed4), true);
assert.equal(E.leaderboard(completed4).length, 4);
assert.equal(E.historyEntry(completed4).word, completed4.word);
assert.deepEqual(E.restoreGame(JSON.stringify(completed4)), completed4);

assert.throws(() => E.restoreGame({ ...completed4, imposters: ['Niemand'] }), /Imposter/);
assert.throws(() => E.restoreGame({ ...completed4, scores: { Alex: 0 } }), /Punktestand/);
assert.throws(() => E.restoreGame({ ...completed4, tieBreakCount: 2 }), /Stichwahlanzahl/);
assert.throws(() => E.restoreGame({ ...completed4, votes: { Alex: 'Alex' } }), /Selbststimmen/);
assert.throws(() => E.restoreGame({ ...completed4, usedWords: ['Router', 'router'] }), /Doppelter Begriff/);
assert.throws(() => E.restoreGame({ ...completed4, usedWords: ['Nicht der aktuelle Begriff'] }), /Aktueller Begriff/);
assert.throws(() => E.createGame({ ...options, imposterCount: 4 }), /Imposter-Zahl/);
assert.throws(() => E.createGame({ ...options, roundSeconds: 20 }), /Rundenzeit/);
assert.throws(() => E.createGame({ ...options, matchRounds: 0 }), /Match/);

console.log(JSON.stringify({ ok: true, engineVersion: E.VERSION, deterministic: true, roles: true, persistence: true, deadlineTimer: true, backgroundResume: true, voting: true, finiteTieBreak: true, duplicateVoteProtection: true, scoring: true, matches: true, noRepeatedWords: true, validation: true, history: true }, null, 2));
