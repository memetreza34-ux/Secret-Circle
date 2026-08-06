'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Registry = require('../backup-schema-registry.js');

function read(file) {
  return fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
}

assert.equal(Registry.version, 1);
assert.equal(Registry.maximumFileBytes, 1_500_000);
assert.equal(Registry.list.length, 3);
assert.equal(Registry.byteLength('€'), 3);
assert.equal(Registry.byteLength('🎉'), 4);
assert.equal(Registry.get('complete').maximumEntries, 100);
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

const store = read('data-store.js');
const completeTools = read('party-data-tools.js');
const creator = read('game-creator.js');
const creatorPage = read('creator-page.js');

for (const marker of ["BACKUP_FORMAT = 'secret-circle-backup'", 'BACKUP_VERSION = 1', 'MAX_BACKUP_BYTES = 1_500_000']) {
  assert.match(store, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `Word-Imposter backup drift: ${marker}`);
}
for (const marker of ["FORMAT = 'secret-circle-complete-backup'", 'MAX_BYTES = 1_500_000', 'MAX_ENTRIES = 100', 'MAX_VALUE_BYTES = 1_000_000']) {
  assert.match(completeTools, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `Complete backup drift: ${marker}`);
}
for (const marker of ["type: 'secret-circle-created-games'", 'MAX_GAMES = 40', 'MAX_CARDS = 200', 'MAX_PACKS = 8']) {
  assert.match(creator, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `Creator library drift: ${marker}`);
}
assert.match(creatorPage, /file\.size > 1_500_000/);

console.log(JSON.stringify({
  ok: true,
  registeredSchemas: Registry.list.map(schema => schema.id),
  sharedUtf8Limit: true,
  runtimeContractsMatchRegistry: true,
  creatorCapacityRegistered: true
}, null, 2));
