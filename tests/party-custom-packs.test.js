'use strict';
const assert = require('node:assert/strict');
const catalog = require('../party-routing.js');
const packs = require('../party-custom-packs.js');

function createMemoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    failWrites: false,
    failRemoves: false,
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      if (this.failWrites) throw new Error('simulierter Speicherfehler');
      values.set(String(key), String(value));
    },
    removeItem(key) {
      if (this.failRemoves) throw new Error('simulierter Löschfehler');
      values.delete(String(key));
    },
    snapshot() {
      return Object.fromEntries(values);
    }
  };
}

assert.equal(packs.version, 3);
assert.equal(packs.storageKey, 'secret-circle-party-custom-packs-v1');
assert.equal(packs.maxPacks, 30);
assert.equal(packs.maxItems, 150);
assert.equal(typeof packs.createManager, 'function');
assert.ok(packs.supportedGameIds.includes('charades'));
assert.ok(packs.supportedGameIds.includes('hot-potato'));
assert.ok(packs.supportedGameIds.includes('word-chain'));
assert.ok(packs.supportedGameIds.includes('who-am-i'));
assert.ok(packs.supportedGameIds.includes('anime-guess'));
assert.ok(packs.supportedGameIds.includes('pass-the-phone'));
assert.ok(packs.supportedGameIds.includes('red-green-flag'));
assert.ok(packs.supportedGameIds.includes('secret-mission'));
assert.ok(packs.supportedGameIds.includes('tier-list'));
assert.ok(!packs.supportedGameIds.includes('money-challenge'));
assert.ok(!packs.supportedGameIds.includes('emoji-quiz'));
assert.ok(!packs.supportedGameIds.includes('mafia'));

const parsed = packs.parseItems('  Erste Karte  \nzweite Karte\nERSTE KARTE\n\nDritte Karte  ');
assert.deepEqual(parsed, ['Erste Karte', 'zweite Karte', 'Dritte Karte']);
assert.equal(packs.parseItems(Array.from({ length: 180 }, (_, index) => `Karte ${index + 1}`).join('\n')).length, 150);
assert.deepEqual(packs.parseItems('Cafe\u0301\nCAFÉ\nRakete\nSonne'), ['Café', 'Rakete', 'Sonne']);

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
assert.throws(() => packs.addPack({
  gameId: 'charades',
  name: 'unsere runde',
  items: ['Eins', 'Zwei', 'Drei']
}), /existiert bereits/);

const animePack = packs.addPack({
  gameId: 'anime-guess',
  name: 'Unsere Anime-Figuren',
  items: ['Eigene Figur A', 'Eigene Figur B', 'Eigene Figur C']
});
assert.deepEqual(catalog.getItems('anime-guess', 'Eigene · Unsere Anime-Figuren'), animePack.items);
assert.equal(packs.removePack(animePack.id), true);
assert.deepEqual(catalog.getItems('anime-guess', 'Eigene · Unsere Anime-Figuren'), []);

const copy = packs.getPacks();
copy[0].items.push('Manipulation');
assert.equal(packs.getPacks()[0].items.includes('Manipulation'), false);

assert.equal(packs.removePack(created.id), true);
assert.equal(packs.removePack(created.id), false);
assert.deepEqual(catalog.getItems('charades', 'Eigene · Unsere Runde'), []);

const storage = createMemoryStorage();
const transactional = packs.createManager(storage);
const stable = transactional.addPack({
  gameId: 'who-am-i',
  name: 'Transaktion',
  items: ['Rakete', 'Satellit', 'Raumanzug']
});
assert.equal(transactional.getPacks().length, 1);
assert.deepEqual(catalog.getItems('who-am-i', 'Eigene · Transaktion'), stable.items);
const beforeFailure = storage.snapshot();

storage.failWrites = true;
assert.throws(() => transactional.addPack({
  gameId: 'who-am-i',
  name: 'Darf nicht erscheinen',
  items: ['Eins', 'Zwei', 'Drei']
}), /konnten nicht gespeichert werden/);
assert.deepEqual(storage.snapshot(), beforeFailure);
assert.equal(transactional.getPacks().length, 1);
assert.deepEqual(catalog.getItems('who-am-i', 'Eigene · Darf nicht erscheinen'), []);

assert.throws(() => transactional.removePack(stable.id), /konnten nicht gespeichert werden/);
assert.equal(transactional.getPacks().length, 1);
assert.deepEqual(catalog.getItems('who-am-i', 'Eigene · Transaktion'), stable.items);

storage.failWrites = false;
assert.equal(transactional.removePack(stable.id), true);
assert.deepEqual(catalog.getItems('who-am-i', 'Eigene · Transaktion'), []);

const duplicateStorage = createMemoryStorage({
  'secret-circle-party-custom-packs-v1': JSON.stringify({
    version: 1,
    packs: [
      { id: 'eins', gameId: 'word-chain', name: 'Doppelt', items: ['A', 'B', 'C'], createdAt: '2026-08-04T00:00:00Z' },
      { id: 'zwei', gameId: 'word-chain', name: 'DOPPELT', items: ['D', 'E', 'F'], createdAt: '2026-08-04T00:00:01Z' },
      { id: 'eins', gameId: 'word-chain', name: 'Andere ID-Kopie', items: ['G', 'H', 'I'], createdAt: '2026-08-04T00:00:02Z' }
    ]
  })
});
const normalized = packs.createManager(duplicateStorage);
assert.equal(normalized.getPacks().length, 1);
assert.equal(normalized.getPacks()[0].name, 'Doppelt');
assert.deepEqual(catalog.getItems('word-chain', 'Eigene · Doppelt'), ['A', 'B', 'C']);
assert.equal(normalized.removePack('eins'), true);

console.log(JSON.stringify({
  ok: true,
  customPackVersion: packs.version,
  supportedGames: packs.supportedGameIds.length,
  maximumPacks: packs.maxPacks,
  maximumItemsPerPack: packs.maxItems,
  animeAndWhoAmIPacks: true,
  duplicateCardsRemoved: true,
  unicodeDuplicatesRemoved: true,
  structuredModesBlocked: true,
  catalogInjectionAndRemoval: true,
  duplicateStoredPacksNormalized: true,
  transactionRollback: true,
  failedRemovalPreservesPack: true
}, null, 2));
