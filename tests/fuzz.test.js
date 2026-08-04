'use strict';
const assert = require('node:assert/strict');
const E = require('../game-engine.js');

const entries = Array.from({ length: 30 }, (_, index) => [`Begriff ${index + 1}`, `Hinweis ${index + 1}`]);

function revealAll(game) {
  let current = game;
  while (current.phase === 'reveal') current = E.advanceReveal(current);
  return current;
}

function voteRound(game, random) {
  let current = E.startVoting(game);
  let votingRounds = 0;
  while (current.phase === 'voting') {
    votingRounds += 1;
    assert.ok(votingRounds <= E.MAX_TIE_BREAKS + 1, 'Voting exceeded the finite tie-break limit.');
    const allowed = current.voteLeaders.length ? current.voteLeaders : current.players;
    for (const voter of current.players) {
      const candidates = allowed.filter(name => name !== voter);
      assert.ok(candidates.length >= 1, 'Every voter needs at least one valid target.');
      const target = candidates[Math.floor(random() * candidates.length)];
      current = E.castVote(current, voter, target);
      E.assertGame(current);
    }
    current = E.resolveVote(current);
    E.assertGame(current);
    if (current.phase === 'tie_break') current = E.startVoting(current);
  }
  return current;
}

function finishRound(game, random, correctGuess) {
  let current = revealAll(game);
  E.assertGame(current);

  if (random() > 0.5) {
    current = E.startTimer(current, 10_000);
    current = E.syncTimer(current, 10_000 + Math.floor(random() * 20_000));
    if (current.timerRunning && random() > 0.5) current = E.pauseTimer(current, 35_000);
    E.assertGame(current);
  }

  current = voteRound(current, random);
  if (current.phase === 'guess') {
    current = E.submitImposterGuess(current, correctGuess ? current.word : '__falscher_begriff__');
  }
  assert.equal(current.phase, 'completed');
  E.assertGame(current);
  return current;
}

let scenarios = 0;
let rounds = 0;
for (let scenario = 0; scenario < 120; scenario += 1) {
  const playerCount = 3 + (scenario % 18);
  const players = Array.from({ length: playerCount }, (_, index) => `P${scenario}-${index + 1}`);
  const maximumImposters = Math.min(6, playerCount - 1);
  const imposterCount = 1 + (scenario % maximumImposters);
  const matchRounds = 1 + (scenario % 6);
  const random = E.createRng(`fuzz-v7-${scenario}`);

  let game = E.createGame({
    players,
    entries,
    category: 'Fuzz',
    imposterCount,
    useHint: scenario % 2 === 0,
    roundSeconds: 60 + (scenario % 10) * 60,
    matchRounds,
    seed: `scenario-${scenario}`
  });

  assert.equal(game.players.length, playerCount);
  assert.equal(game.imposters.length, imposterCount);
  assert.equal(new Set(game.players).size, playerCount);
  assert.equal(new Set(game.revealOrder).size, playerCount);
  assert.equal(new Set(game.imposters).size, imposterCount);

  while (true) {
    game = finishRound(game, random, rounds % 2 === 0);
    rounds += 1;

    const leaderboard = E.leaderboard(game);
    assert.equal(leaderboard.length, playerCount);
    assert.deepEqual([...leaderboard].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'de-DE')), leaderboard);
    assert.ok(leaderboard.every(entry => Number.isInteger(entry.score) && entry.score >= 0));

    const history = E.historyEntry(game);
    assert.equal(history.round, game.currentRound);
    assert.equal(history.playerCount, playerCount);
    assert.equal(history.imposterCount, imposterCount);
    assert.ok(['innocents', 'imposters'].includes(history.winner));

    if (E.isMatchComplete(game)) break;
    const previousScores = JSON.parse(JSON.stringify(game.scores));
    const previousWords = [...game.usedWords];
    game = E.nextRound(game, {
      entries,
      category: 'Fuzz',
      imposterCount,
      useHint: scenario % 2 === 0,
      roundSeconds: 60 + (scenario % 10) * 60,
      seed: `scenario-${scenario}-round-${game.currentRound + 1}`
    });
    assert.deepEqual(game.scores, previousScores);
    if (previousWords.length < entries.length) {
      assert.ok(!previousWords.some(word => word.toLocaleLowerCase('de-DE') === game.word.toLocaleLowerCase('de-DE')));
    }
  }

  scenarios += 1;
}

const valid = E.createGame({
  players: ['A', 'B', 'C'],
  entries,
  category: 'Mutation',
  imposterCount: 1,
  roundSeconds: 60,
  matchRounds: 1,
  seed: 'mutation-base'
});
const corruptions = [
  { ...valid, version: 999 },
  { ...valid, phase: 'unknown' },
  { ...valid, revealOrder: ['A', 'A', 'C'] },
  { ...valid, imposters: ['Niemand'] },
  { ...valid, remainingSeconds: -1 },
  { ...valid, timerRunning: true, timerDeadline: null },
  { ...valid, scores: { A: 0, B: -1, C: 0 } },
  { ...valid, votes: { A: 'A' } },
  { ...valid, usedWords: [] }
];
for (const corrupted of corruptions) assert.throws(() => E.restoreGame(corrupted));

console.log(JSON.stringify({
  ok: true,
  engineVersion: E.VERSION,
  deterministicFuzzScenarios: scenarios,
  completedRounds: rounds,
  playerRange: '3-20',
  multipleImposters: true,
  timerTransitions: true,
  votingAndTieBreaks: true,
  matchProgression: true,
  corruptionMutationsRejected: corruptions.length
}, null, 2));
