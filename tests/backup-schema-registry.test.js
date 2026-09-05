'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Registry = require('../backup-schema-registry.js');

function read(file) {
  return fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
}

const expectedCompleteKeys = [
  'secret-circle-active-v7',
  'secret-circle-custom-v7',
  'secret-circle-history-v7',
  'secret-circle-settings-v7',
  'secret-circle-party-hub-v1',
  'secret-circle-party-hub-active-v1',
  'secret-circle-party-active-v1',
  'secret-circle-party-quick-active-v1',
  'secret-circle-party-mega-active-v1',
  'secret-circle-party-viral-active-v1',
  'secret-circle-party-created-active-v1',
  'secret-circle-party-quick-timers-v1',
  'secret-circle-party-created-games-v1',
  'secret-circle-party-custom-packs-v1',
  'secret-circle-party-night-v1',
  'secret-circle-party-preferences-v1',
  'secret-circle-party-catalog-filters-v1'
];

assert.equal(Registry.version, 2);
assert.equal(Registry.maximumFileBytes, 1_500_000);
assert.equal(Registry.list.length, 3);
assert.equal(Registry.byteLength('€'), 3);
assert.equal(Registry.byteLength('🎉'), 4);
assert.equal(Registry.get('complete').maximumEntries, 100);
assert.equal(Registry.get('complete').maximumValueBytes, 1_000_000);
assert.deepEqual(Registry.completeStorageKeys, expectedCompleteKeys);
assert.deepEqual(Registry.get('complete').allowedKeys, expectedCompleteKeys);
assert.equal(Registry.get('creator-library').maximumGames, 40);
assert.equal(Registry.get('creator-library').maximumPacksPerGame, 8);
assert.equal(Registry.get('creator-library').maximumCardsPerPack, 200);

assert.equal(Registry.identify({ format: 'secret-circle-backup', version: 1 }).id, 'word-imposter');
assert.equal(Registry.identify({ format: 'secret-circle-complete-backup', version: 1 }).id, 'complete');
assert.equal(Registry.identify({ type: 'secret-circle-created-games', version: 1 }).id, 'creator-library');
assert.equal(Registry.identify({ format: 'unknown', version: 1 }), null);
assert.equal(Registry.validateHeader({ type: 'secret-circle-created-games', version: 1 }, 'creator-library').id, 'creator-library');
assert.throws(() => Registry.validateHeader({ format: 'secret-circle-backup', version: 1 }, 'complete'), /entspricht nicht/);
assert.throws(() => Registry.assertSize('€'.repeat(500_001), 'complete'), /1,5 MB/);

for (const key of expectedCompleteKeys) assert.equal(Registry.isAllowedCompleteStorageKey(key), true, `expected managed key: ${key}`);
assert.equal(Registry.isAllowedCompleteStorageKey('secret-circle-unrelated-v1'), false);
assert.equal(Registry.isAllowedCompleteStorageKey('secret-circle-party-future-feature-v99'), false);
assert.equal(Registry.isAllowedCompleteStorageKey('secret-circle-party-hub-v2'), false);
assert.equal(Registry.isAllowedCompleteStorageKey('secret-circle-settings-v8'), false);
assert.equal(Registry.isAllowedCompleteStorageKey('other-app-v1'), false);

assert.equal(Registry.validateCompleteStorageValue('secret-circle-active-v7', { version: 7, players: [] }), true);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-active-v7', { version: 6, players: [] }), false);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-custom-v7', []), true);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-custom-v7', {}), false);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-history-v7', []), true);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-settings-v7', { duration: '3' }), true);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-party-hub-v1', { version: 1, players: [] }), true);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-party-hub-v1', { version: 999, players: [] }), false);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-party-hub-v1', { version: 1 }), false);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-party-hub-active-v1', { version: 1, session: {} }), true);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-party-hub-active-v1', { version: 1 }), false);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-party-active-v1', { version: 2, gameId: 'mafia', session: {} }), true);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-party-active-v1', { version: 1, gameId: 'mafia', session: {} }), true);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-party-active-v1', { version: 3, gameId: 'mafia', session: {} }), false);
for (const key of [
  'secret-circle-party-quick-active-v1',
  'secret-circle-party-mega-active-v1',
  'secret-circle-party-viral-active-v1',
  'secret-circle-party-created-active-v1'
]) {
  assert.equal(Registry.validateCompleteStorageValue(key, { version: 1, gameId: 'example' }), true, key);
  assert.equal(Registry.validateCompleteStorageValue(key, { version: 2, gameId: 'example' }), false, key);
}
const validTimerStore = {
  version: 1,
  snapshots: {
    quick: { gameId: 'rapid-fire', sessionId: 'session-1', round: 2, phase: 'running', durationMs: 5000, remainingMs: 2300 },
    mega: { gameId: 'who-am-i', sessionId: 'session-2', round: 1, phase: 'guess', durationMs: 60000, remainingMs: 41000 }
  }
};
assert.equal(Registry.validateCompleteStorageValue('secret-circle-party-quick-timers-v1', validTimerStore), true);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-party-quick-timers-v1', { version: 2, snapshots: {} }), false);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-party-quick-timers-v1', { version: 1, snapshots: { unknown: validTimerStore.snapshots.quick } }), false);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-party-quick-timers-v1', { version: 1, snapshots: { quick: { ...validTimerStore.snapshots.quick, remainingMs: 6000 } } }), false);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-party-created-games-v1', { version: 1, games: [] }), true);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-party-created-games-v1', { version: 1, games: {} }), false);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-party-custom-packs-v1', { version: 1, packs: [] }), true);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-party-night-v1', { version: 1, steps: [] }), true);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-party-preferences-v1', { version: 1 }), true);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-party-catalog-filters-v1', { version: 1 }), true);
assert.equal(Registry.validateCompleteStorageValue('secret-circle-party-hub-v2', { version: 2, players: [] }), false);

const ownershipSources = [
  'data-store.js',
  'runtime-guard.js',
  'party-hub.js',
  'party-hub-plus.js',
  'party-custom-packs.js',
  'party-night.js',
  'party-filter-state.js',
  'game-creator.js',
  'party-advanced-runner.js',
  'party-quick-modes.js',
  'party-mega-modes.js',
  'party-viral-modes.js',
  'party-created-modes.js',
  'party-session-controls.js'
].map(read).join('\n');
for (const key of expectedCompleteKeys) {
  /* Einige Keys werden in data-store.js über KEY_VERSION als Template gebaut
     (`secret-circle-custom-v${KEY_VERSION}`), nicht als fertiger Literal-String.
     Der Präfix ohne Versionsziffer bleibt im Quelltext sichtbar und reicht als
     Eigentümernachweis. */
  const prefix = key.replace(/\d+$/, '');
  const owned = ownershipSources.includes(key) || (prefix !== key && ownershipSources.includes(prefix));
  assert.ok(owned, `managed backup key has no current runtime owner: ${key}`);
}

const store = read('data-store.js');
const completeTools = read('party-data-tools.js');
const creator = read('game-creator.js');
const creatorPage = read('creator-page.js');

for (const marker of ["BACKUP_FORMAT = 'secret-circle-backup'", 'BACKUP_VERSION = 1', 'MAX_BACKUP_BYTES = 1_500_000']) {
  assert.match(store, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `Word-Imposter backup drift: ${marker}`);
}

for (const marker of [
  "registry?.get?.('complete')",
  'const PREFIX = schema.storagePrefix',
  'const FORMAT = schema.format',
  'const FORMAT_VERSION = schema.version',
  'const MAX_BYTES = schema.maximumBytes',
  'const MAX_ENTRIES = schema.maximumEntries',
  'const MAX_VALUE_BYTES = schema.maximumValueBytes',
  'registry.validateHeader(payload, \'complete\')',
  'registry.isAllowedCompleteStorageKey',
  'registry.validateCompleteStorageValue'
]) {
  assert.match(completeTools, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `Complete backup central-schema contract missing: ${marker}`);
}
for (const forbidden of [
  "const FORMAT = 'secret-circle-complete-backup'",
  'const MAX_BYTES = 1_500_000',
  'const MAX_ENTRIES = 100',
  'const MAX_VALUE_BYTES = 1_000_000'
]) {
  assert.doesNotMatch(completeTools, new RegExp(forbidden.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `Complete backup duplicated registry constant: ${forbidden}`);
}

for (const marker of ["type: 'secret-circle-created-games'", 'MAX_GAMES = 40', 'MAX_CARDS = 200', 'MAX_PACKS = 8']) {
  assert.match(creator, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `Creator library drift: ${marker}`);
}
assert.match(creatorPage, /file\.size > 1_500_000/);

console.log(JSON.stringify({
  ok: true,
  registryVersion: Registry.version,
  registeredSchemas: Registry.list.map(schema => schema.id),
  completeManagedKeys: expectedCompleteKeys.length,
  exactCurrentKeyAllowlist: true,
  futureStorageVersionsPreserved: true,
  keySpecificStorageWrappersValidated: true,
  quickTimerStoreValidated: true,
  managedKeysOwnedByCurrentRuntime: true,
  sharedUtf8Limit: true,
  completeBackupUsesCentralRegistry: true,
  completeBackupNoDuplicatedRegistryConstants: true,
  creatorCapacityRegistered: true
}, null, 2));