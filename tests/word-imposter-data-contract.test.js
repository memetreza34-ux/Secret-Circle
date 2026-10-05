'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = relative => fs.readFileSync(path.resolve(__dirname, '..', relative), 'utf8');
const app = read('app.js');
const store = read('data-store.js');
const page = read('index.html');

assert.match(store, /const MAX_CUSTOM_CATEGORIES = 50;/);
assert.match(store, /const MAX_CUSTOM_ENTRIES = 200;/);
assert.match(store, /value\.length > MAX_CUSTOM_CATEGORIES/);
assert.match(store, /item\.entries\.length > MAX_CUSTOM_ENTRIES/);
assert.doesNotMatch(store, /value\.slice\(0,\s*50\)/, 'Custom categories must not be silently truncated.');
assert.match(store, /Array\.isArray\(snapshot\.data\)/);
assert.match(store, /maximumCustomCategories: MAX_CUSTOM_CATEGORIES/);
assert.match(store, /maximumCustomEntries: MAX_CUSTOM_ENTRIES/);

assert.doesNotMatch(app, /addCustomCategory|custom:/, 'Word Imposter bietet nur die eingebauten Kategorien an.');
assert.doesNotMatch(app, /importBackup|exportBackup/, 'Word Imposter sichert nicht mehr selbst; das macht die zentrale Sicherung im Profil.');
assert.match(app, /function nextPendingVoterIndex\(\)/);
assert.match(app, /findIndex\(player => !hasVoteFor\(player\)\)/);
assert.match(app, /voteIndex = game\.phase === 'voting' \? nextPendingVoterIndex\(\) : 0;/);
assert.doesNotMatch(app, /voteIndex\s*=\s*Object\.keys\(game\.votes\s*\|\|\s*\{\}\)\.length/);
assert.match(read('backup-schema-registry.js'), /const MAX_FILE_BYTES = 1_500_000;/);

assert.doesNotMatch(page, /id="custom-panel"|id="toggle-custom"/, 'Word Imposter legt keine eigenen Kategorien an.');

console.log(JSON.stringify({
  wordImposterDataContract: 'PASS',
  pendingVoterDerivedFromVotes: true,
  silentCategoryTruncationRejected: true,
  maximumCustomCategories: 50,
  maximumCustomEntries: 200,
  centralBackupByteLimit: true,
  builtInCategoriesOnly: true
}, null, 2));