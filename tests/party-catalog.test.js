'use strict';
const assert = require('node:assert/strict');
const C = require('../party-catalog.js');

assert.equal(C.version, 1);
assert.ok(Array.isArray(C.games));
assert.equal(C.games.length, 18);
assert.equal(C.games.filter(game => game.status === 'playable').length, 14);
assert.equal(C.games.filter(game => game.status === 'planned').length, 4);

const ids = C.games.map(game => game.id);
assert.equal(new Set(ids).size, ids.length, 'Game ids must be unique.');
assert.ok(ids.includes('imposter'));
assert.ok(ids.includes('truth-dare'));
assert.ok(ids.includes('charades'));
assert.ok(ids.includes('hot-potato'));

for (const game of C.games) {
  assert.match(game.id, /^[a-z0-9-]+$/);
  assert.ok(game.title.length >= 3);
  assert.ok(game.description.length >= 30);
  assert.ok(['playable', 'planned'].includes(game.status));
  assert.ok(Number.isInteger(game.minPlayers) && game.minPlayers >= 1);
  assert.ok(Number.isInteger(game.maxPlayers) && game.maxPlayers >= game.minPlayers && game.maxPlayers <= 20);
  assert.ok(Number.isInteger(game.duration) && game.duration >= 5 && game.duration <= 60);
  assert.ok(Array.isArray(game.instructions) && game.instructions.length >= 3);
  assert.ok(Array.isArray(game.packs) && game.packs.length >= 1);
  assert.ok(Array.isArray(game.moods) && game.moods.length >= 1);
  assert.equal(C.getGame(game.id).title, game.title);
}

const contentGames = C.games.filter(game => C.getPackNames(game.id).length);
assert.ok(contentGames.length >= 10);
const totalCards = C.games.reduce((sum, game) => sum + C.itemCount(game.id), 0);
assert.ok(totalCards >= 300, `Expected at least 300 original cards, received ${totalCards}.`);

function walk(value, path = 'root') {
  if (typeof value === 'string') {
    assert.ok(value.trim().length > 0, `Empty string at ${path}`);
    assert.ok(!/<\/?(?:script|iframe|object|embed|style|svg)\b/i.test(value), `Unsafe markup at ${path}`);
    assert.ok(value.length <= 240, `Excessively long content at ${path}`);
    return;
  }
  if (Array.isArray(value)) {
    assert.ok(value.length > 0, `Empty array at ${path}`);
    value.forEach((item, index) => walk(item, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value);
    assert.ok(entries.length > 0, `Empty object at ${path}`);
    entries.forEach(([key, item]) => {
      assert.ok(key.trim().length > 0, `Empty key at ${path}`);
      walk(item, `${path}.${key}`);
    });
  }
}
walk(C.content, 'content');

for (const [pack, pairs] of Object.entries(C.content['would-rather'])) {
  for (const pair of pairs) {
    assert.equal(pair.length, 2, `Choice pair in ${pack} must contain exactly two options.`);
    assert.notEqual(pair[0], pair[1]);
  }
}

for (const [pack, cards] of Object.entries(C.content.taboo)) {
  for (const card of cards) {
    assert.ok(card.word);
    assert.equal(card.banned.length, 3, `Taboo card in ${pack} must contain three banned words.`);
    assert.equal(new Set(card.banned.map(value => value.toLocaleLowerCase('de-DE'))).size, card.banned.length);
  }
}

for (const [gameId, packs] of Object.entries(C.content)) {
  for (const packName of Object.keys(packs)) {
    assert.ok(C.getPackNames(gameId).includes(packName));
    assert.ok(C.itemCount(gameId) > 0);
  }
}

console.log(JSON.stringify({
  ok: true,
  catalogVersion: C.version,
  games: C.games.length,
  playableGames: C.games.filter(game => game.status === 'playable').length,
  plannedGames: C.games.filter(game => game.status === 'planned').length,
  contentGames: contentGames.length,
  totalCards
}, null, 2));
