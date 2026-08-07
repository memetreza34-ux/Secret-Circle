'use strict';

const assert = require('node:assert/strict');
const A = require('../party-advanced.js');

assert.equal(A.mafiaCountForPlayers(6), 1);
assert.equal(A.mafiaCountForPlayers(7), 1);
assert.equal(A.mafiaCountForPlayers(8), 2);
assert.equal(A.mafiaCountForPlayers(11), 2);
assert.equal(A.mafiaCountForPlayers(12), 3);
assert.equal(A.mafiaCountForPlayers(15), 3);
assert.equal(A.mafiaCountForPlayers(16), 4);
assert.equal(A.mafiaCountForPlayers(20), 4);

function counts(values) {
  return values.reduce((result, value) => {
    result[value] = (result[value] || 0) + 1;
    return result;
  }, {});
}

const quick = counts(A.mafiaRoleList(8, 'Schnell'));
assert.deepEqual(quick, { Mafia: 2, Detektiv: 1, Dorfbewohner: 5 });

const classic = counts(A.mafiaRoleList(8, 'Klassisch'));
assert.deepEqual(classic, { Mafia: 2, Detektiv: 1, Arzt: 1, Dorfbewohner: 4 });

const extended = counts(A.mafiaRoleList(8, 'Erweitert'));
assert.deepEqual(extended, { Mafia: 2, Detektiv: 1, Arzt: 1, Beschützer: 1, Dorfbewohner: 3 });

for (const playerCount of [6, 8, 12, 16, 20]) {
  for (const pack of ['Schnell', 'Klassisch', 'Erweitert']) {
    assert.equal(A.mafiaRoleList(playerCount, pack).length, playerCount);
  }
}

const players = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const assigned = A.assignMafiaRoles(players, maximum => maximum - 1, 'Erweitert');
assert.deepEqual(new Set(Object.keys(assigned)), new Set(players));
assert.deepEqual(counts(Object.values(assigned)), extended);

assert.equal(A.mafiaWinner({
  alive: ['A', 'B', 'C'],
  roles: { A: 'Mafia', B: 'Dorfbewohner', C: 'Detektiv' }
}), null);
assert.equal(A.mafiaWinner({
  alive: ['A', 'B', 'C', 'D'],
  roles: { A: 'Mafia', B: 'Mafia', C: 'Dorfbewohner', D: 'Detektiv' }
}), 'Mafia');
assert.equal(A.mafiaWinner({
  alive: ['B', 'C'],
  roles: { A: 'Mafia', B: 'Dorfbewohner', C: 'Detektiv' }
}), 'Dorf');

console.log(JSON.stringify({
  mafiaRules: 'PASS',
  mafiaScaling: { '6-7': 1, '8-11': 2, '12-15': 3, '16-20': 4 },
  packs: ['Schnell', 'Klassisch', 'Erweitert'],
  protectorImplemented: true
}, null, 2));
