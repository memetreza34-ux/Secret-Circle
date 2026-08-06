'use strict';

const assert = require('node:assert/strict');
const Creator = require('../game-creator.js');

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(String(key), String(value)); },
    removeItem(key) { values.delete(String(key)); }
  };
}

const createdAt = '2025-01-01T00:00:00.000Z';
const updatedAt = '2025-02-01T00:00:00.000Z';
const game = {
  id: 'custom-game-timestamp-test',
  title: 'Zeitstempel Testspiel',
  description: 'Dieses Spiel prüft unveränderte Erstellungs- und Bearbeitungszeiten.',
  templateId: 'prompt',
  packs: [{ name: 'Standard', items: ['Alpha', 'Beta', 'Gamma'] }],
  createdAt,
  updatedAt
};

const normalized = Creator.normalizeGame(game);
assert.equal(normalized.createdAt, createdAt);
assert.equal(normalized.updatedAt, updatedAt);
assert.equal(Creator.normalizeTimestamp('ungültig', createdAt), createdAt);

const storage = memoryStorage({
  [Creator.storageKey]: JSON.stringify({ version: Creator.version, games: [game] })
});
const store = Creator.createStore(storage);
assert.equal(store.get(game.id).updatedAt, updatedAt);
store.reload();
assert.equal(store.get(game.id).updatedAt, updatedAt, 'Reload must not count as an edit.');

const exported = JSON.parse(store.exportData());
assert.equal(exported.games[0].createdAt, createdAt);
assert.equal(exported.games[0].updatedAt, updatedAt, 'Export must preserve timestamps.');

const importedStore = Creator.createStore(memoryStorage());
importedStore.importData(exported);
assert.equal(importedStore.get(game.id).createdAt, createdAt);
assert.equal(importedStore.get(game.id).updatedAt, updatedAt, 'Import must preserve timestamps.');

const edited = store.save({
  ...store.get(game.id),
  description: 'Diese Beschreibung wurde tatsächlich geändert und neu gespeichert.'
});
assert.equal(edited.createdAt, createdAt, 'Editing must preserve createdAt.');
assert.notEqual(edited.updatedAt, updatedAt, 'Saving a real edit must refresh updatedAt.');
assert.ok(Date.parse(edited.updatedAt) > Date.parse(updatedAt));

const duplicated = store.duplicate(game.id);
assert.notEqual(duplicated.id, game.id);
assert.ok(Date.parse(duplicated.createdAt) > Date.parse(createdAt));
assert.equal(duplicated.createdAt, duplicated.updatedAt);

console.log(JSON.stringify({
  ok: true,
  reloadPreservesUpdatedAt: true,
  exportImportPreservesTimestamps: true,
  realEditRefreshesUpdatedAt: true,
  duplicateGetsNewTimestamps: true
}, null, 2));
