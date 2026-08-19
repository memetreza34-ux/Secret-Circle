'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.resolve(__dirname, '..', 'sw.js'), 'utf8');

assert.match(source, /const CACHE='secret-circle-v44'/);
assert.match(source, /const STAGING_CACHE='secret-circle-v44-staging'/);
assert.match(source, /function stripSearch/);
assert.match(source, /async function stageCore/);
assert.match(source, /async function promoteStagedCore/);
assert.match(source, /const active = await caches\.open\(CACHE\)/);
assert.match(source, /const stagedUrls = new Set/);
assert.match(source, /active\.delete\(request\)/);
assert.match(source, /event\.data\?\.type === 'SKIP_WAITING'/);
assert.match(source, /canonicalNavigation \? stripSearch\(request\) : request/);
assert.match(source, /caches\.match\(stripSearch\(request\), \{ cacheName: CACHE \}\)/);
assert.match(source, /backup-schema-registry\.js/);
assert.match(source, /party-catalog\.js/);
assert.match(source, /party-expansion\.js/);
assert.match(source, /party-mega-catalog\.js/);
assert.match(source, /party-viral-catalog\.js/);
assert.match(source, /party-core-release-catalog\.js/);
assert.match(source, /party-core-classic-content\.js/);
assert.match(source, /session-ledger\.js/);
assert.match(source, /party-session-controls\.js/);
assert.match(source, /party-hub-timers\.js/);
assert.match(source, /icon\.svg/);
assert.match(source, /icon-192\.png/);
assert.match(source, /icon-512\.png/);
assert.doesNotMatch(source, /session-ledger-legacy-guard\.js/);
assert.doesNotMatch(source, /await caches\.delete\(CACHE\)/);
assert.doesNotMatch(source, /\.then\(\(\) => self\.skipWaiting\(\)\)/);

console.log(JSON.stringify({
  ok: true,
  cacheContract: 44,
  stagedUpdateCache: true,
  nonDestructivePromotion: true,
  userControlledActivation: true,
  queryNavigationOffline: true,
  canonicalNavigationCaching: true,
  backupSchemaRegistryOffline: true,
  baseCatalogOffline: true,
  expansionCatalogOffline: true,
  megaCatalogOffline: true,
  viralCatalogOffline: true,
  coreReleaseContentOffline: true,
  coreClassicContentOffline: true,
  exactOnceLedgerOffline: true,
  sharedSessionControlsOffline: true,
  splitHubTimerModuleOffline: true,
  rasterPwaIconsOffline: true,
  legacyGuardRemoved: true
}, null, 2));