'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function read(file) {
  return fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
}

const loader = read('quick-loader.js');
const created = read('party-created-modes.js');
const quick = read('party-quick-modes.js');
const mega = read('party-mega-modes.js');
const viral = read('party-viral-modes.js');
const guard = read('session-ledger-legacy-guard.js');
const serviceWorker = read('sw.js');

assert.match(loader, /session-ledger\.js/);
assert.match(loader, /session-ledger-legacy-guard\.js/);
assert.match(loader, /SecretCircleSessionLedger/);
assert.match(loader, /SecretCircleLegacySessionGuard/);
assert.match(serviceWorker, /\.\/session-ledger\.js/);
assert.match(serviceWorker, /\.\/session-ledger-legacy-guard\.js/);

for (const [name, source, engine] of [
  ['Creator', created, 'created'],
  ['Quick', quick, 'quick']
]) {
  assert.match(source, /SecretCircleSessionLedger/, `${name} engine must require the shared ledger.`);
  assert.match(source, new RegExp(`completionId\\('${engine}'`), `${name} engine must use a stable completion ID.`);
  assert.match(source, /recordCompletion\(loadHub\(\)/, `${name} engine must use exact-once recording.`);
  assert.match(source, /sessionId: L\.createSessionId/, `${name} engine must create a persistent session ID.`);
  assert.match(source, /legacySessionId/, `${name} engine must migrate old active sessions.`);
  assert.doesNotMatch(source, new RegExp(`${engine}-\\$\\{Date\\.now\\(\\)\\}`), `${name} engine must not use a new random completion ID on every retry.`);
}

assert.match(mega, /id: `mega-\$\{Date\.now\(\)\}/, 'Mega remains on the compatibility path until direct refactoring.');
assert.match(viral, /id: `viral-\$\{Date\.now\(\)\}/, 'Viral remains on the compatibility path until direct refactoring.');
assert.match(guard, /secret-circle-party-mega-active-v1/);
assert.match(guard, /secret-circle-party-viral-active-v1/);
assert.match(guard, /completionId\(definition\.engine/);
assert.match(guard, /recordCompletion\(baseHub, completion\)/);
assert.match(guard, /originalSetItem\.call/);

console.log(JSON.stringify({
  ok: true,
  creatorExactOnceIntegrated: true,
  quickExactOnceIntegrated: true,
  megaExactOnceCompatibilityGuard: true,
  viralExactOnceCompatibilityGuard: true,
  legacySessionsMigrated: true,
  offlineRuntimeIncluded: true
}, null, 2));
