'use strict';

const assert = require('node:assert/strict');
const guard = require('../advanced-resume-guard.js');

const players = ['Alex', 'Sam', 'Mika', 'Lina', 'Noah', 'Lea', 'Emil', 'Sara'];

function snapshot(gameId, advanced, pack = 'Klassisch') {
  return {
    version: 2,
    gameId,
    session: {
      id: `test-${gameId}`,
      gameId,
      players: [...players],
      pack,
      targetRounds: 3,
      rounds: 0,
      score: 0,
      playerIndex: 0,
      used: [],
      startedAt: '2026-08-23T12:00:00.000Z',
      advanced
    }
  };
}

const twoTruths = snapshot('two-truths', {
  stage: 'result',
  author: 'Alex',
  statements: ['Ich mag Tee.', 'Ich fahre Fahrrad.', 'Ich war auf dem Mond.'],
  lieIndex: 2,
  voteIndex: 2,
  correct: true
});
assert.equal(guard.validateSnapshot(twoTruths, 'two-truths'), true);
assert.equal(guard.validateSnapshot(twoTruths, 'mafia'), false);
const impossibleTwoTruths = structuredClone(twoTruths);
impossibleTwoTruths.session.advanced.correct = false;
assert.equal(guard.validateSnapshot(impossibleTwoTruths, 'two-truths'), false);

const questionImposter = snapshot('question-imposter', {
  stage: 'result',
  revealIndex: 7,
  pair: { main: 'Welche Jahreszeit magst du?', imposter: 'Welches Wetter magst du?' },
  imposter: 'Sam',
  revealed: false,
  voted: 'Sam',
  correct: true
});
assert.equal(guard.validateSnapshot(questionImposter, 'question-imposter'), true);
const foreignQuestionImposter = structuredClone(questionImposter);
foreignQuestionImposter.session.advanced.imposter = 'Nicht in der Runde';
assert.equal(guard.validateSnapshot(foreignQuestionImposter, 'question-imposter'), false);

const locationSpy = snapshot('location-spy', {
  stage: 'result',
  revealIndex: 7,
  location: 'Bahnhof',
  spy: 'Lina',
  revealed: false,
  voted: 'Lina',
  correct: true
});
assert.equal(guard.validateSnapshot(locationSpy, 'location-spy'), true);
const inconsistentLocation = structuredClone(locationSpy);
inconsistentLocation.session.advanced.correct = false;
assert.equal(guard.validateSnapshot(inconsistentLocation, 'location-spy'), false);

const roles = {
  Alex: 'Mafia', Sam: 'Mafia', Mika: 'Detektiv', Lina: 'Arzt',
  Noah: 'Dorfbewohner', Lea: 'Dorfbewohner', Emil: 'Dorfbewohner', Sara: 'Dorfbewohner'
};
const mafia = snapshot('mafia', {
  stage: 'finished',
  revealIndex: 7,
  revealed: false,
  day: 2,
  roles,
  alive: ['Mika', 'Lina', 'Noah', 'Lea', 'Emil', 'Sara'],
  nightTarget: null,
  saved: null,
  protected: null,
  lastProtected: null,
  inspected: null,
  nightResult: '',
  winner: 'Dorf'
});
assert.equal(guard.validateSnapshot(mafia, 'mafia'), true);
const forgedMafiaWinner = structuredClone(mafia);
forgedMafiaWinner.session.advanced.winner = 'Mafia';
assert.equal(guard.validateSnapshot(forgedMafiaWinner, 'mafia'), false);
const forgedRoleCount = structuredClone(mafia);
forgedRoleCount.session.advanced.roles.Sara = 'Mafia';
assert.equal(guard.validateSnapshot(forgedRoleCount, 'mafia'), false);

assert.deepEqual(guard.expectedRoleCounts(8, 'Klassisch'), {
  Mafia: 2,
  Detektiv: 1,
  Arzt: 1,
  Beschützer: 0,
  Dorfbewohner: 4
});

console.log(JSON.stringify({
  advancedResumeGuard: 'PASS',
  guardedModes: ['two-truths', 'question-imposter', 'location-spy', 'mafia'],
  strictGameIdMatch: true,
  outcomeConsistency: true,
  mafiaWinnerIntegrity: true,
  mafiaRoleCountIntegrity: true
}, null, 2));