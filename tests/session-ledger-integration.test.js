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
const serviceWorker = read('sw.js');

assert.match(loader, /session-ledger\.js/);
assert.match(loader, /SecretCircleSessionLedger/);
assert.doesNotMatch(loader, /session-ledger-legacy-guard\.js/);
assert.doesNotMatch(loader, /SecretCircleLegacySessionGuard/);
assert.match(serviceWorker, /\.\/session-ledger\.js/);

for (const [name, source, engine] of [
  ['Creator', created, 'created'],
  ['Quick', quick, 'quick'],
  ['Mega', mega, 'mega'],
  ['Viral', viral, 'viral']
]) {
  assert.match(source, /SecretCircleSessionLedger/, `${name} engine must require the shared ledger.`);
  assert.match(source, new RegExp(`completionId\\('${engine}'`), `${name} engine must use a stable completion ID.`);
  assert.match(source, /recordCompletion\(loadHub\(\)/, `${name} engine must use exact-once recording.`);
  assert.match(source, /sessionId: L\.createSessionId/, `${name} engine must create a persistent session ID.`);
  assert.match(source, /legacySessionId/, `${name} engine must migrate old active sessions.`);
  assert.doesNotMatch(source, new RegExp(`${engine}-\\$\\{Date\\.now\\(\\)\\}`), `${name} engine must not use a new random completion ID on every retry.`);
  assert.match(source, /if \(result\.recorded && !saveHub\(result\.hub\)\) return/);
  assert.match(source, /if \(!saveActive\(\)\) \{\s*active = final;\s*return;/s, `${name} engine must restore active state if cleanup persistence fails.`);
}

console.log(JSON.stringify({
  ok: true,
  creatorExactOnceIntegrated: true,
  quickExactOnceIntegrated: true,
  megaExactOnceIntegrated: true,
  viralExactOnceIntegrated: true,
  legacySessionsMigrated: true,
  legacyGuardRemovedFromRuntime: true,
  offlineLedgerIncluded: true
}, null, 2));
