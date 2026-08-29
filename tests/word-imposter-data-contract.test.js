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

assert.match(app, /STORE\.maximumCustomCategories/);
assert.match(app, /STORE\.maximumCustomEntries/);
assert.match(app, /STORE\.maximumBackupBytes/);
assert.match(app, /function nextPendingVoterIndex\(\)/);
assert.match(app, /findIndex\(player => !hasVoteFor\(player\)\)/);
assert.match(app, /voteIndex = game\.phase === 'voting' \? nextPendingVoterIndex\(\) : 0;/);
assert.doesNotMatch(app, /voteIndex\s*=\s*Object\.keys\(game\.votes\s*\|\|\s*\{\}\)\.length/);
assert.match(app, /file\.size > MAX_BACKUP_BYTES/);
assert.match(app, /custom\.length >= MAX_CUSTOM_CATEGORIES/);
assert.match(app, /rawRows\.length > MAX_CUSTOM_ENTRIES/);

assert.match(page, /bis zu 50 eigene Kategorien/);
assert.match(page, /2–200 unterschiedliche Begriffe/);
assert.match(page, /id="custom-words"[^>]*maxlength="25000"[^>]*aria-describedby="custom-words-help"/);
assert.match(page, /höchstens 200 Zeilen/);

console.log(JSON.stringify({
  wordImposterDataContract: 'PASS',
  pendingVoterDerivedFromVotes: true,
  silentCategoryTruncationRejected: true,
  maximumCustomCategories: 50,
  maximumCustomEntries: 200,
  backupUiUsesStoreByteLimit: true,
  visibleCustomLimits: true
}, null, 2));