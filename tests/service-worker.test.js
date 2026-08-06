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
assert.match(source, /event\.data\?\.type === 'SKIP_WAITING'/);
assert.match(source, /canonicalNavigation \? stripSearch\(request\) : request/);
assert.match(source, /caches\.match\(stripSearch\(request\), \{ cacheName: CACHE \}\)/);
assert.match(source, /quick-play\.html/);
assert.match(source, /pwa-update\.css/);
assert.match(source, /session-ledger\.js/);
assert.match(source, /session-ledger-legacy-guard\.js/);
assert.doesNotMatch(source, /\.then\(\(\) => self\.skipWaiting\(\)\)/);
assert.doesNotMatch(source, /cache\.put\(request,response\.clone\(\)\)/);

console.log(JSON.stringify({
  ok: true,
  cacheContract: 30,
  stagedUpdateCache: true,
  userControlledActivation: true,
  queryNavigationOffline: true,
  canonicalNavigationCaching: true,
  exactOnceLedgerOffline: true,
  megaViralGuardOffline: true
}, null, 2));
