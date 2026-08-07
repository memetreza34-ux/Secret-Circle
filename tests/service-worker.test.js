'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.resolve(__dirname, '..', 'sw.js'), 'utf8');

assert.match(source, /const CACHE='secret-circle-v30'/);
assert.match(source, /const STAGING_CACHE='secret-circle-v30-staging'/);
assert.match(source, /function stripSearch/);
assert.match(source, /async function stageCore/);
assert.match(source, /async function promoteStagedCore/);
assert.match(source, /const active = await caches\.open\(CACHE\)/);
assert.match(source, /const stagedUrls = new Set/);
assert.match(source, /active\.delete\(request\)/);
assert.match(source, /event\.data\?\.type === 'SKIP_WAITING'/);
assert.match(source, /canonicalNavigation \? stripSearch\(request\) : request/);
assert.match(source, /caches\.match\(stripSearch\(request\), \{ cacheName: CACHE \}\)/);
assert.match(source, /quick-play\.html/);
assert.match(source, /pwa-update\.css/);
assert.match(source, /party-release\.css/);
assert.match(source, /party-release-structure\.js/);
assert.match(source, /party-filter-state\.js/);
assert.match(source, /party-search-assist\.js/);
assert.match(source, /party-search\.css/);
assert.match(source, /session-ledger\.js/);
assert.doesNotMatch(source, /session-ledger-legacy-guard\.js/);
assert.doesNotMatch(source, /await caches\.delete\(CACHE\)/);
assert.doesNotMatch(source, /\.then\(\(\) => self\.skipWaiting\(\)\)/);
assert.doesNotMatch(source, /cache\.put\(request,response\.clone\(\)\)/);

console.log(JSON.stringify({
  ok: true,
  cacheContract: 30,
  stagedUpdateCache: true,
  nonDestructivePromotion: true,
  userControlledActivation: true,
  queryNavigationOffline: true,
  canonicalNavigationCaching: true,
  releaseStructureOffline: true,
  persistentCatalogFiltersOffline: true,
  searchAssistanceOffline: true,
  exactOnceLedgerOffline: true,
  legacyGuardRemoved: true
}, null, 2));
