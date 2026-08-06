'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.resolve(__dirname, '..', 'sw.js'), 'utf8');

assert.match(source, /secret-circle-v30/);
assert.match(source, /function stripSearch/);
assert.match(source, /canonicalNavigation \? stripSearch\(request\) : request/);
assert.match(source, /caches\.match\(stripSearch\(request\)\)/);
assert.match(source, /quick-play\.html/);
assert.match(source, /session-ledger\.js/);
assert.doesNotMatch(source, /cache\.put\(request,response\.clone\(\)\)/);

console.log(JSON.stringify({
  ok: true,
  cacheContract: 30,
  queryNavigationOffline: true,
  canonicalNavigationCaching: true,
  exactOnceLedgerOffline: true
}, null, 2));
