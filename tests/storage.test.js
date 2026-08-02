'use strict';
const assert = require('node:assert/strict');
const E = require('../game-engine.js');
const { createStore, KEY_VERSION, BACKUP_FORMAT } = require('../data-store.js');

class MemoryStorage {
  constructor(initial = {}) {
    this.map = new Map(Object.entries(initial));
    this.failWrites = false;
  }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) {
    if (this.failWrites) throw Error('quota exceeded');
    this.map.set(key, String(value));
  }
  removeItem(key) { this.map.delete(key); }
}

const entries = [['Router', 'Netzwerk'], ['Sensor', 'Messung'], ['Kabel', 'Verbindung']];
const game = E.createGame({
  players: ['Alex', 'Sam', 'Mika'],
  entries,
  category: 'Technik',
  imposterCount: 1,
  useHint: true,
  roundSeconds: 180,
  matchRounds: 3,
  seed: 'storage-test'
});

const legacyCustom = [{
  id: 'legacy-space',
  name: 'Weltraum',
  entries: [['Mond', 'Nacht'], ['Mars', 'Planet']]
}];
const legacySettings = {
  players: 'Alex\nSam\nMika',
  category: 'technik',
  imposterCount: '1',
  useHint: true,
  duration: '3',
  matchRounds: '5'
};

const storage = new MemoryStorage({
  'secret-circle-active-v4': JSON.stringify(game),
  'secret-circle-custom-v4': JSON.stringify(legacyCustom),
  'secret-circle-history-v4': JSON.stringify([]),
  'secret-circle-settings-v4': JSON.stringify(legacySettings)
});
const store = createStore(storage);
const migrated = store.loadAll(E);
assert.equal(store.keyVersion, KEY_VERSION);
assert.equal(KEY_VERSION, 7);
assert.equal(migrated.active.id, game.id);
assert.equal(migrated.custom[0].name, 'Weltraum');
assert.equal(migrated.settings.category, 'technik');
assert.ok(migrated.warnings.some(message => message.includes('migriert')));
assert.ok(storage.getItem('secret-circle-active-v7'));
assert.ok(storage.getItem('secret-circle-custom-v7'));

const backup = JSON.parse(store.exportBackup(E));
assert.equal(backup.format, BACKUP_FORMAT);
assert.equal(backup.version, 1);
assert.equal(backup.data.active.id, game.id);
assert.equal(backup.data.custom[0].name, 'Weltraum');

store.clearAll();
assert.equal(storage.getItem('secret-circle-active-v7'), null);
assert.equal(storage.getItem('secret-circle-active-v4'), null);
const imported = store.importBackup(backup, E);
assert.equal(imported.ok, true);
assert.equal(store.loadAll(E).custom[0].name, 'Weltraum');

const invalidBackup = store.importBackup('{"format":"unknown"}', E);
assert.equal(invalidBackup.ok, false);
assert.match(invalidBackup.error, /keine unterstützte/);

storage.setItem('secret-circle-custom-v7', '{broken json');
const recovered = store.loadAll(E);
assert.deepEqual(recovered.custom, []);
assert.ok(recovered.warnings.some(message => message.includes('beschädigte')));
assert.equal(storage.getItem('secret-circle-custom-v7'), null);

const unavailable = createStore(null);
assert.equal(unavailable.available(), false);
assert.deepEqual(unavailable.loadAll(E).custom, []);
assert.equal(unavailable.setByKey(unavailable.keys.settings, legacySettings).ok, false);

const rollbackStorage = new MemoryStorage();
const rollbackStore = createStore(rollbackStorage);
assert.equal(rollbackStore.setByKey(rollbackStore.keys.settings, legacySettings).ok, true);
const previousSettings = rollbackStorage.getItem(rollbackStore.keys.settings);
rollbackStorage.failWrites = true;
const failedImport = rollbackStore.importBackup(backup, E);
assert.equal(failedImport.ok, false);
rollbackStorage.failWrites = false;
assert.equal(rollbackStorage.getItem(rollbackStore.keys.settings), previousSettings);

console.log(JSON.stringify({
  ok: true,
  storageMigration: true,
  corruptedDataRecovery: true,
  backupExportImport: true,
  unavailableStorageFallback: true,
  atomicImportRollback: true
}, null, 2));
