'use strict';
const assert = require('node:assert/strict');
const Creator = require('../game-creator.js');
const routing = require('../party-routing.js');

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    failWrites: false,
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) {
      if (this.failWrites) throw new Error('simulierter Speicherfehler');
      values.set(String(key), String(value));
    },
    removeItem(key) { values.delete(String(key)); },
    snapshot() { return Object.fromEntries(values); }
  };
}

assert.equal(Creator.version, 1);
assert.equal(Creator.storageKey, 'secret-circle-party-created-games-v1');
assert.equal(Creator.maxGames, 40);
assert.equal(Creator.maxCards, 200);
assert.equal(Creator.maxPacks, 8);
assert.deepEqual(Object.keys(Creator.templates), ['prompt', 'choice', 'guess', 'challenge', 'story', 'debate']);

assert.deepEqual(Creator.parseCards('Meer | Berge\nPlanen | Spontan\nMeer | Berge', 'choice'), [['Meer', 'Berge'], ['Planen', 'Spontan']]);
assert.deepEqual(Creator.parseCards([['Meer', 'Berge'], ['Planen', 'Spontan']], 'choice'), [['Meer', 'Berge'], ['Planen', 'Spontan']]);
assert.deepEqual(Creator.parseCards('Cafe\u0301\nCAFÉ\nRakete\nSonne', 'prompt'), ['Café', 'Rakete', 'Sonne']);
assert.equal(Creator.parseCards(Array.from({ length: 240 }, (_, index) => `Karte ${index}`).join('\n'), 'prompt').length, 200);

const storage = memoryStorage();
const store = Creator.createStore(storage);
const saved = store.save({
  title: 'Unser Entscheidungsduell',
  description: 'Die Gruppe entscheidet zwischen zwei eigenen Optionen.',
  templateId: 'choice',
  icon: '🎯',
  accent: 'cyan',
  group: 'Unsere Spiele',
  minPlayers: 3,
  maxPlayers: 12,
  duration: 20,
  age: 'all',
  packs: [
    { name: 'Alltag', items: 'Früh | Spät\nSüß | Salzig\nPlanen | Spontan' },
    { name: 'Fantasie', items: 'Fliegen | Teleportieren\nDrache | Roboter\nWeltall | Tiefsee' }
  ]
});
assert.ok(saved.id.startsWith('custom-game-'));
assert.equal(saved.packs.length, 2);
assert.equal(saved.packs[0].items.length, 3);
assert.deepEqual(saved.packs[0].items[0], ['Früh', 'Spät']);
assert.equal(store.list().length, 1);
assert.throws(() => store.save({
  title: 'unser entscheidungsduell',
  description: 'Gleicher Name mit anderer Schreibweise ist nicht erlaubt.',
  templateId: 'prompt',
  packs: [{ name: 'Standard', items: ['Alpha', 'Beta', 'Gamma'] }]
}), /existiert bereits/);

const copy = store.duplicate(saved.id);
assert.equal(store.list().length, 2);
assert.match(copy.title, /Kopie/);
assert.notEqual(copy.id, saved.id);

const exported = JSON.parse(store.exportData());
assert.equal(exported.type, 'secret-circle-created-games');
assert.equal(exported.version, 1);
assert.equal(exported.games.length, 2);
assert.deepEqual(exported.games.find(game => game.id === saved.id).packs[0].items[0], ['Früh', 'Spät']);

const importedStorage = memoryStorage();
const importedStore = Creator.createStore(importedStorage);
assert.equal(importedStore.importData(exported).length, 2);
assert.equal(importedStore.get(saved.id).title, saved.title);
assert.deepEqual(importedStore.get(saved.id).packs[0].items[0], ['Früh', 'Spät']);
assert.throws(() => importedStore.importData({ type: 'wrong', version: 1, games: [] }), /keine gültige/);

const beforeFailure = storage.snapshot();
storage.failWrites = true;
assert.throws(() => store.save({
  title: 'Darf nicht gespeichert werden',
  description: 'Dieser Datensatz simuliert einen fehlgeschlagenen Schreibvorgang.',
  templateId: 'prompt',
  packs: [{ name: 'Standard', items: ['Erste Karte', 'Zweite Karte', 'Dritte Karte'] }]
}), /konnte nicht gespeichert werden/);
assert.deepEqual(storage.snapshot(), beforeFailure);
assert.equal(store.list().length, 2);
storage.failWrites = false;

const catalog = routing.createCatalog(storage);
assert.equal(routing.version, 7);
assert.equal(routing.games.length, 45);
assert.equal(catalog.games.length, 47);
assert.equal(catalog.createdGameIds.length, 2);
const custom = catalog.getGame(saved.id);
assert.equal(custom.custom, true);
assert.equal(custom.mode, 'choice');
assert.equal(custom.group, 'Unsere Spiele');
assert.deepEqual(catalog.getPackNames(saved.id), ['Alltag', 'Fantasie']);
assert.deepEqual(catalog.getItems(saved.id, 'Alltag')[0], ['Früh', 'Spät']);
assert.equal(catalog.itemCount(saved.id), 6);

assert.equal(store.remove(saved.id), true);
assert.equal(store.remove(saved.id), false);

console.log(JSON.stringify({
  ok: true,
  creatorVersion: Creator.version,
  templates: Object.keys(Creator.templates).length,
  maximumGames: Creator.maxGames,
  maximumCardsPerPack: Creator.maxCards,
  routedBaseGames: routing.games.length,
  routedCreatedGames: catalog.createdGameIds.length,
  structuredChoiceCardsPreserved: true,
  unicodeDeduplication: true,
  transactionRollback: true,
  exportImport: true
}, null, 2));
