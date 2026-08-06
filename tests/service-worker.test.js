'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.resolve(__dirname, '..', 'sw.js'), 'utf8');

assert.match(source, /secret-circle-v31/);
assert.match(source, /function stripSearch/);
assert.match(source, /canonicalNavigation \? stripSearch\(request\) : request/);
assert.match(source, /caches\.match\(stripSearch\(request\)\)/);
assert.match(source, /quick-play\.html/);
assert.doesNotMatch(source, /cache\.put\(request,response\.clone\(\)\)/);

console.log(JSON.stringify({
  ok: true,
  cacheVersion: 31,
  queryNavigationOffline: true,
  canonicalNavigationCaching: true
}, null, 2));
