'use strict';
const assert = require('node:assert/strict');
const E = require('../game-engine.js');
const { createStore, KEY_VERSION, ENGINE_VERSION, BACKUP_FORMAT } = require('../data-store.js');

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

const legacyGame = JSON.parse(JSON.stringify(game));
legacyGame.version = 6;
delete legacyGame.timerRunning;
delete legacyGame.timerDeadline;

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
const legacyHistory = [{
  id: 'legacy-history',
  completedAt: '2026-08-01T12:00:00.000Z',
  category: 'Technik',
  playerCount: 3,
  word: 'Router',
  imposters: ['Sam'],
  winner: 'innocents'
}];

const storage = new MemoryStorage({
  'secret-circle-active-v4': JSON.stringify(legacyGame),
  'secret-circle-custom-v4': JSON.stringify(legacyCustom),
  'secret-circle-history-v4': JSON.stringify(legacyHistory),
  'secret-circle-settings-v4': JSON.stringify(legacySettings)
});
const store = createStore(storage);
const migrated = store.loadAll(E);
assert.equal(store.keyVersion, KEY_VERSION);
assert.equal(store.engineVersion, ENGINE_VERSION);
assert.equal(KEY_VERSION, 7);
assert.equal(ENGINE_VERSION, 7);
assert.equal(migrated.active.id, game.id);
assert.equal(migrated.active.version, 7);
assert.equal(migrated.active.timerRunning, false);
assert.equal(migrated.active.timerDeadline, null);
assert.deepEqual(migrated.active.usedWords, game.usedWords);
assert.equal(migrated.custom[0].name, 'Weltraum');
assert.equal(migrated.settings.category, 'technik');
assert.equal(migrated.history[0].round, 1);
assert.equal(migrated.history[0].imposterCount, 1);
assert.ok(migrated.warnings.some(message => message.includes('neue App-Version')));
assert.ok(storage.getItem('secret-circle-active-v7'));
assert.ok(storage.getItem('secret-circle-custom-v7'));
assert.equal(storage.getItem('secret-circle-active-v4'), null);
assert.equal(storage.getItem('secret-circle-custom-v4'), null);
assert.equal(storage.getItem('secret-circle-history-v4'), null);
assert.equal(storage.getItem('secret-circle-settings-v4'), null);

const currentKeyLegacyStorage = new MemoryStorage({
  'secret-circle-active-v7': JSON.stringify(legacyGame)
});
const currentKeyLegacyStore = createStore(currentKeyLegacyStorage);
const currentKeyMigrated = currentKeyLegacyStore.loadAll(E);
assert.equal(currentKeyMigrated.active.version, 7);
assert.equal(JSON.parse(currentKeyLegacyStorage.getItem('secret-circle-active-v7')).version, 7);
assert.ok(currentKeyMigrated.warnings.some(message => message.includes('aktualisiert')));

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
assert.equal(store.loadAll(E).active.version, 7);

const legacyBackup = JSON.parse(JSON.stringify(backup));
legacyBackup.data.active = legacyGame;
const legacyBackupStorage = new MemoryStorage();
const legacyBackupStore = createStore(legacyBackupStorage);
const importedLegacyBackup = legacyBackupStore.importBackup(legacyBackup, E);
assert.equal(importedLegacyBackup.ok, true);
assert.equal(importedLegacyBackup.data.active.version, 7);
assert.equal(importedLegacyBackup.data.active.timerRunning, false);

const invalidBackup = store.importBackup('{"format":"unknown"}', E);
assert.equal(invalidBackup.ok, false);
assert.match(invalidBackup.error, /keine unterstützte/);
const oversizedBackup = store.importBackup('x'.repeat(2_000_001), E);
assert.equal(oversizedBackup.ok, false);
assert.match(oversizedBackup.error, /zu groß/);

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
  realLegacyGameUpgrade: true,
  currentKeyUpgrade: true,
  corruptedDataRecovery: true,
  backupExportImport: true,
  legacyBackupImport: true,
  oversizedBackupProtection: true,
  unavailableStorageFallback: true,
  atomicImportRollback: true
}, null, 2));
