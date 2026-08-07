'use strict';

const assert = require('node:assert/strict');
const catalog = require('../party-routing.js');
const release = require('../party-release-structure.js');

const expectedCore = [
  'imposter', 'truth-dare', 'never-have', 'most-likely', 'would-rather',
  'paranoia', 'charades', 'taboo', 'hot-potato', 'word-chain',
  'two-truths', 'question-imposter', 'location-spy', 'mafia', 'wrong-answers'
];
const advanced = new Set(['two-truths', 'question-imposter', 'location-spy', 'mafia']);
const hubModes = new Map([
  ['truth-dare', 'truth-dare'],
  ['never-have', 'prompt'],
  ['most-likely', 'prompt'],
  ['would-rather', 'choice'],
  ['paranoia', 'paranoia'],
  ['charades', 'charades'],
  ['taboo', 'taboo'],
  ['hot-potato', 'hot-potato'],
  ['word-chain', 'word-chain'],
  ['wrong-answers', 'prompt']
]);

assert.deepEqual([...release.coreIds], expectedCore);
assert.equal(new Set(expectedCore).size, 15);
assert.equal(catalog.games.length, 45);

for (const id of expectedCore) {
  const game = catalog.getGame(id);
  assert.ok(game, `Core game missing: ${id}`);
  assert.equal(game.status, 'playable', `Core game must be technically playable: ${id}`);
  assert.ok(Number.isInteger(game.minPlayers) && game.minPlayers >= 1 && game.minPlayers <= 20, `Invalid minPlayers: ${id}`);
  assert.ok(Number.isInteger(game.maxPlayers) && game.maxPlayers >= game.minPlayers && game.maxPlayers <= 20, `Invalid maxPlayers: ${id}`);
  assert.ok(Number.isInteger(game.duration) && game.duration >= 1 && game.duration <= 120, `Invalid duration: ${id}`);
  assert.ok(['all', 'teen'].includes(game.age), `Invalid age level: ${id}`);
  assert.ok(Array.isArray(game.instructions) && game.instructions.length >= 1 && game.instructions.length <= 4, `Core rules must fit in four steps: ${id}`);
  assert.equal(new Set(game.instructions).size, game.instructions.length, `Duplicate rule step: ${id}`);
  game.instructions.forEach((rule, index) => {
    assert.equal(typeof rule, 'string', `Rule ${index + 1} must be text: ${id}`);
    assert.ok(rule.trim().length >= 6 && rule.trim().length <= 180, `Rule ${index + 1} has invalid length: ${id}`);
  });
  assert.ok(Array.isArray(game.packs) && game.packs.length >= 1, `Core game requires at least one pack: ${id}`);
  assert.deepEqual(catalog.getPackNames(id), game.packs, `Catalog packs must match game metadata: ${id}`);
  for (const pack of game.packs) {
    assert.ok(catalog.getItems(id, pack).length >= 1, `Core pack must contain content: ${id}/${pack}`);
  }

  if (id === 'imposter') {
    assert.equal(game.mode, 'link');
    assert.equal(game.href, 'index.html');
  } else if (advanced.has(id)) {
    assert.equal(game.mode, 'link', `Advanced core game must route through advanced.html: ${id}`);
    assert.equal(game.advancedMode, id);
    assert.equal(game.href, `advanced.html?game=${encodeURIComponent(id)}`);
  } else {
    assert.equal(game.mode, hubModes.get(id), `Unexpected Hub mode for ${id}`);
    assert.equal(game.href, undefined, `Direct Hub core game must not leave the Hub: ${id}`);
  }
}

const hubSource = require('node:fs').readFileSync(require('node:path').resolve(__dirname, '..', 'party-hub.js'), 'utf8');
assert.match(hubSource, /SecretCircleSessionLedger/);
assert.match(hubSource, /sessionId: L\.createSessionId\(game\.id\)/);
assert.match(hubSource, /completionId\('hub', game\.id, session\.sessionId\)/);
assert.match(hubSource, /L\.recordCompletion\(state,/);
assert.doesNotMatch(hubSource, /stats\.plays\s*=\s*Math\.max\(1,/);
assert.doesNotMatch(hubSource, /function rememberRecent[\s\S]*?plays:/, 'Opening a game must not increment plays.');

console.log(JSON.stringify({
  ok: true,
  coreGames: expectedCore.length,
  directHubCoreGames: hubModes.size,
  advancedCoreGames: advanced.size,
  wordImposterCoreGames: 1,
  maximumRuleSteps: 4,
  allCorePacksNonEmpty: true,
  hubPlayCountOnlyOnCompletion: true
}, null, 2));
