'use strict';
const assert = require('node:assert/strict');
const catalog = require('../party-routing.js');
const packs = require('../party-custom-packs.js');

function createMemoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    failWrites: false,
    failRemoves: false,
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) {
      if (this.failWrites) throw new Error('simulierter Speicherfehler');
      values.set(String(key), String(value));
    },
    removeItem(key) {
      if (this.failRemoves) throw new Error('simulierter Löschfehler');
      values.delete(String(key));
    },
    snapshot() { return Object.fromEntries(values); }
  };
}

assert.equal(packs.version, 4);
assert.equal(packs.storageKey, 'secret-circle-party-custom-packs-v1');
assert.equal(packs.maxPacks, 30);
assert.equal(packs.maxItems, 150);
assert.equal(typeof packs.createManager, 'function');
for (const id of ['charades', 'hot-potato', 'word-chain', 'who-am-i', 'anime-guess', 'pass-the-phone', 'red-green-flag', 'secret-mission', 'tier-list']) {
  assert.ok(packs.supportedGameIds.includes(id), `custom packs should support ${id}`);
}
for (const id of ['money-challenge', 'emoji-quiz', 'mafia']) {
  assert.ok(!packs.supportedGameIds.includes(id), `structured mode must stay blocked: ${id}`);
}

const parsed = packs.parseItems('  Erste Karte  \nzweite Karte\nERSTE KARTE\n\nDritte Karte  ');
assert.deepEqual(parsed, ['Erste Karte', 'zweite Karte', 'Dritte Karte']);
assert.equal(packs.parseItems(Array.from({ length: 180 }, (_, index) => `Karte ${index + 1}`).join('\n')).length, 150);
assert.deepEqual(packs.parseItems('Cafe\u0301\nCAFÉ\nRakete\nSonne'), ['Café', 'Rakete', 'Sonne']);

assert.equal(packs.normalizePack({ gameId: 'mafia', name: 'Nicht erlaubt', items: ['Alpha', 'Beta', 'Gamma'] }), null);
assert.equal(packs.normalizePack({ gameId: 'charades', name: 'Zu kurz', items: ['Alpha', 'Beta'] }), null);

const created = packs.addPack({
  gameId: 'charades', name: 'Unsere Runde',
  items: ['Pinguin', 'Raumstation', 'Kaffeetasse', 'Pinguin']
});
assert.deepEqual(created.items, ['Pinguin', 'Raumstation', 'Kaffeetasse']);
assert.deepEqual(catalog.getItems('charades', 'Eigene · Unsere Runde'), created.items);
assert.throws(() => packs.addPack({
  gameId: 'charades', name: 'unsere runde', items: ['Eins', 'Zwei', 'Drei']
}), /existiert bereits/);

const animePack = packs.addPack({
  gameId: 'anime-guess', name: 'Unsere Anime-Figuren',
  items: ['Eigene Figur A', 'Eigene Figur B', 'Eigene Figur C']
});
assert.deepEqual(catalog.getItems('anime-guess', 'Eigene · Unsere Anime-Figuren'), animePack.items);
assert.equal(packs.removePack(animePack.id), true);
assert.ok(!catalog.getPackNames('anime-guess').includes('Eigene · Unsere Anime-Figuren'), 'removed pack must disappear from pack names');

const copy = packs.getPacks();
copy[0].items.push('Manipulation');
assert.equal(packs.getPacks()[0].items.includes('Manipulation'), false);
assert.equal(packs.removePack(created.id), true);
assert.equal(packs.removePack(created.id), false);
assert.ok(!catalog.getPackNames('charades').includes('Eigene · Unsere Runde'), 'removed pack must disappear from pack names');

const storage = createMemoryStorage();
const transactional = packs.createManager(storage);
const stable = transactional.addPack({
  gameId: 'who-am-i', name: 'Transaktion', items: ['Rakete', 'Satellit', 'Raumanzug']
});
assert.equal(transactional.getPacks().length, 1);
assert.deepEqual(catalog.getItems('who-am-i', 'Eigene · Transaktion'), stable.items);
const beforeFailure = storage.snapshot();

storage.failWrites = true;
assert.throws(() => transactional.addPack({
  gameId: 'who-am-i', name: 'Darf nicht erscheinen', items: ['Eins', 'Zwei', 'Drei']
}), /konnten nicht gespeichert werden/);
assert.deepEqual(storage.snapshot(), beforeFailure);
assert.equal(transactional.getPacks().length, 1);
assert.ok(!catalog.getPackNames('who-am-i').includes('Eigene · Darf nicht erscheinen'), 'rolled-back pack must not appear in pack names');
assert.throws(() => transactional.removePack(stable.id), /konnten nicht gespeichert werden/);
assert.equal(transactional.getPacks().length, 1);
assert.deepEqual(catalog.getItems('who-am-i', 'Eigene · Transaktion'), stable.items);

storage.failWrites = false;
assert.equal(transactional.removePack(stable.id), true);
assert.ok(!catalog.getPackNames('who-am-i').includes('Eigene · Transaktion'), 'removed pack must disappear from pack names');

const duplicateStorage = createMemoryStorage({
  'secret-circle-party-custom-packs-v1': JSON.stringify({
    version: 1,
    packs: [
      { id: 'eins', gameId: 'word-chain', name: 'Doppelt', items: ['Alpha', 'Beta', 'Gamma'], createdAt: '2026-08-04T00:00:00Z' },
      { id: 'zwei', gameId: 'word-chain', name: 'DOPPELT', items: ['Delta', 'Epsilon', 'Zeta'], createdAt: '2026-08-04T00:00:01Z' },
      { id: 'eins', gameId: 'word-chain', name: 'Andere ID-Kopie', items: ['Eta', 'Theta', 'Iota'], createdAt: '2026-08-04T00:00:02Z' }
    ]
  })
});
const normalized = packs.createManager(duplicateStorage);
assert.equal(normalized.getPacks().length, 1);
assert.equal(normalized.getPacks()[0].name, 'Doppelt');
assert.deepEqual(catalog.getItems('word-chain', 'Eigene · Doppelt'), ['Alpha', 'Beta', 'Gamma']);
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
  transactionRollback: true
}, null, 2));
