'use strict';
const assert = require('node:assert/strict');

const viral = require('../party-viral-catalog.js');
const routed = require('../party-routing.js');

const viralIds = [
  'put-a-finger-down', 'guess-the-price', 'higher-lower', 'know-me-best',
  'hear-me-out', 'hot-seat', 'story-chain', 'finish-the-sentence'
];

assert.equal(viral.version, 5);
assert.equal(viral.games.length, 45);
assert.equal(new Set(viral.games.map(game => game.id)).size, 45);
assert.equal(viral.games.filter(game => game.status === 'playable').length, 45);
assert.deepEqual([...viral.viralGameIds], viralIds);
assert.equal(viral.allFastGameIds.length, 27);

const minimumItems = {
  'put-a-finger-down': 48,
  'guess-the-price': 48,
  'higher-lower': 48,
  'know-me-best': 36,
  'hear-me-out': 48,
  'hot-seat': 48,
  'story-chain': 36,
  'finish-the-sentence': 48
};

for (const id of viralIds) {
  const game = viral.getGame(id);
  assert.ok(game, `Missing viral mode ${id}`);
  assert.equal(game.status, 'playable');
  assert.equal(game.mode, 'link');
  assert.equal(game.href, `quick-play.html?game=${encodeURIComponent(id)}`);
  assert.ok(game.instructions.length >= 4);
  assert.ok(game.packs.length >= 6);
  assert.ok(viral.itemCount(id) >= minimumItems[id], `${id} needs broad launch content`);
  assert.deepEqual(viral.getPackNames(id), Object.keys(viral.content[id]));
}

assert.ok(viral.getItems('put-a-finger-down', 'Gaming').every(item => typeof item === 'string'));
assert.ok(viral.getItems('guess-the-price', 'Technik').every(item => Array.isArray(item) && item.length === 2 && Number.isInteger(item[1])));
assert.ok(viral.getItems('higher-lower', 'Wissen').every(item => Array.isArray(item) && item.length === 2 && Number.isInteger(item[1])));
assert.ok(viral.getItems('know-me-best', 'Reisen').every(item => Array.isArray(item) && item.length === 4));
assert.ok(viral.getItems('hot-seat', 'Kreativ').every(item => typeof item === 'string'));

assert.equal(routed.version, 8);
assert.equal(routed.games.length, 45);
assert.equal(routed.createdGameIds.length, 0);
for (const id of viralIds) assert.equal(routed.getGame(id).href, `quick-play.html?game=${encodeURIComponent(id)}`);
for (const id of ['two-truths', 'question-imposter', 'location-spy', 'mafia']) {
  assert.equal(routed.getGame(id).href, `advanced.html?game=${encodeURIComponent(id)}`);
}

console.log(JSON.stringify({
  ok: true,
  visibleGames: viral.games.length,
  playableGames: viral.games.filter(game => game.status === 'playable').length,
  routedVersion: routed.version,
  viralModes: viralIds.length,
  allFastModes: viral.allFastGameIds.length,
  structuredPriceCards: true,
  structuredHigherLowerCards: true,
  privatePreferenceCards: true,
  categoryBreadthValidated: true
}, null, 2));
