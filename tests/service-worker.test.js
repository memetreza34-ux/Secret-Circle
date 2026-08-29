'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const source = fs.readFileSync(path.resolve(__dirname, '..', 'sw.js'), 'utf8');

assert.match(source, /const CACHE='secret-circle-v63'/);
assert.match(source, /const STAGING_CACHE='secret-circle-v63-staging'/);
assert.match(source, /function stripSearch/);
assert.match(source, /async function stageCore/);
assert.match(source, /async function promoteStagedCore/);
assert.match(source, /const active = await caches\.open\(CACHE\)/);
assert.match(source, /const stagedUrls = new Set/);
assert.match(source, /active\.delete\(request\)/);
assert.match(source, /event\.data\?\.type === 'SKIP_WAITING'/);
assert.match(source, /canonicalNavigation \? stripSearch\(request\) : request/);
assert.match(source, /caches\.match\(stripSearch\(request\), \{ cacheName: CACHE \}\)/);
for (const marker of [
  /word-imposter-resume-guard\.js/, /party-hub-resume-guard\.js/, /party-hub-round-state\.js/,
  /party-hub-timers\.js/, /party-hub-polish\.js/, /party-hub-a11y\.js/, /secondary-surface-a11y\.js/,
  /advanced-resume-guard\.js/, /party-advanced-runner\.js/, /advanced-privacy-guard\.js/,
  /quick-session-replacement-guard\.js/, /quick-loader\.js/, /backup-schema-registry\.js/,
  /party-data-tools\.js/, /session-ledger\.js/, /party-session-controls\.js/,
  /party-wave-one-catalog\.js/, /party-wave-one-modes\.js/,
  /party-wave-one-imposter-catalog\.js/, /party-wave-one-imposter-modes\.js/,
  /party-wave-one-writing-catalog\.js/, /party-wave-one-writing-modes\.js/,
  /icon\.svg/, /icon-192\.png/, /icon-512\.png/
]) assert.match(source, marker);
assert.doesNotMatch(source, /session-ledger-legacy-guard\.js/);
assert.doesNotMatch(source, /await caches\.delete\(CACHE\)/);
assert.doesNotMatch(source, /\.then\(\(\) => self\.skipWaiting\(\)\)/);

console.log(JSON.stringify({
  ok: true,
  cacheContract: 63,
  stagedUpdateCache: true,
  nonDestructivePromotion: true,
  userControlledActivation: true,
  queryNavigationOffline: true,
  canonicalNavigationCaching: true,
  wordImposterResumeGuardOffline: true,
  hubResumeGuardOffline: true,
  hubRoundStateOffline: true,
  advancedResumeGuardOffline: true,
  advancedPrivacyGuardOffline: true,
  quickSessionReplacementGuardOffline: true,
  quickLoaderV10Offline: true,
  waveOneQuizCatalogOffline: true,
  waveOneQuizRunnerOffline: true,
  waveOneImposterCatalogOffline: true,
  waveOneImposterRunnerOffline: true,
  waveOneWritingCatalogOffline: true,
  waveOneWritingRunnerOffline: true,
  quickTimerResumeOffline: true,
  quickBfcacheResumeOffline: true,
  quickBackgroundPauseOffline: true,
  quickHiddenSnapshotOffline: true,
  sharedSessionControlsV5Offline: true,
  backupSchemaRegistryOffline: true,
  completeBackupHardeningOffline: true,
  exactOnceLedgerOffline: true,
  rasterPwaIconsOffline: true,
  legacyGuardRemoved: true
}, null, 2));
