'use strict';
const assert = require('node:assert/strict');
const catalog = require('../party-routing.js');
const packs = require('../party-custom-packs.js');

assert.equal(packs.version, 2);
assert.equal(packs.storageKey, 'secret-circle-party-custom-packs-v1');
assert.equal(packs.maxPacks, 20);
assert.equal(packs.maxItems, 100);
assert.ok(packs.supportedGameIds.includes('charades'));
assert.ok(packs.supportedGameIds.includes('hot-potato'));
assert.ok(packs.supportedGameIds.includes('word-chain'));
assert.ok(!packs.supportedGameIds.includes('would-rather'));
assert.ok(!packs.supportedGameIds.includes('mafia'));

const parsed = packs.parseItems('  Erste Karte  \nzweite Karte\nERSTE KARTE\n\nDritte Karte  ');
assert.deepEqual(parsed, ['Erste Karte', 'zweite Karte', 'Dritte Karte']);
assert.equal(packs.parseItems(Array.from({ length: 140 }, (_, index) => `Karte ${index + 1}`).join('\n')).length, 100);

assert.equal(packs.normalizePack({ gameId: 'mafia', name: 'Nicht erlaubt', items: ['A', 'B', 'C'] }), null);
assert.equal(packs.normalizePack({ gameId: 'charades', name: 'Zu kurz', items: ['A', 'B'] }), null);

const created = packs.addPack({
  gameId: 'charades',
  name: 'Unsere Runde',
  items: ['Pinguin', 'Raumstation', 'Kaffeetasse', 'Pinguin']
});
assert.equal(created.gameId, 'charades');
assert.equal(created.name, 'Unsere Runde');
assert.deepEqual(created.items, ['Pinguin', 'Raumstation', 'Kaffeetasse']);
assert.deepEqual(catalog.getItems('charades', 'Eigene · Unsere Runde'), created.items);
assert.equal(catalog.itemCount('charades') >= created.items.length, true);
assert.throws(() => packs.addPack({
  gameId: 'charades',
  name: 'unsere runde',
  items: ['Eins', 'Zwei', 'Drei']
}), /existiert bereits/);

const copy = packs.getPacks();
copy[0].items.push('Manipulation');
assert.equal(packs.getPacks()[0].items.includes('Manipulation'), false);

assert.equal(packs.removePack(created.id), true);
assert.equal(packs.removePack(created.id), false);
assert.deepEqual(catalog.getItems('charades', 'Eigene · Unsere Runde'), []);

console.log(JSON.stringify({
  ok: true,
  customPackVersion: packs.version,
  supportedGames: packs.supportedGameIds.length,
  maximumPacks: packs.maxPacks,
  maximumItemsPerPack: packs.maxItems,
  duplicateCardsRemoved: true,
  unsupportedStructuredModesBlocked: true,
  catalogInjectionAndRemoval: true
}, null, 2));
