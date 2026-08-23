'use strict';
const assert = require('node:assert/strict');
const Guard = require('../word-imposter-resume-guard.js');

const base = {
  phase: 'voting',
  players: ['Alex', 'Sam', 'Mika', 'Lina'],
  votes: {}
};

assert.equal(Guard.version, 1);
assert.equal(Object.isFrozen(Guard), true);
assert.equal(Guard.hasSequentialVotes(base), true);
assert.equal(Guard.hasSequentialVotes({ ...base, votes: { Alex: 'Sam' } }), true);
assert.equal(Guard.hasSequentialVotes({ ...base, votes: { Alex: 'Sam', Sam: 'Mika' } }), true);
assert.equal(Guard.hasSequentialVotes({ ...base, votes: { Sam: 'Alex' } }), false);
assert.equal(Guard.hasSequentialVotes({ ...base, votes: { Alex: 'Sam', Mika: 'Alex' } }), false);
assert.equal(Guard.hasSequentialVotes({ ...base, votes: { Alex: 'Sam', Sam: 'Mika', Mika: 'Lina', Lina: 'Alex' } }), true);
assert.equal(Guard.hasSequentialVotes({ ...base, votes: [] }), false);
assert.equal(Guard.hasSequentialVotes({ ...base, players: null }), false);
assert.equal(Guard.hasSequentialVotes({ ...base, phase: 'discussion', votes: { Mika: 'Alex' } }), true);

console.log(JSON.stringify({
  ok: true,
  version: Guard.version,
  sequentialVotingResume: true,
  malformedVotingResumeRejected: true
}, null, 2));
