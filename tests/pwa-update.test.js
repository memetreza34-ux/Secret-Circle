'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function read(file) {
  return fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
}

const runtime = read('runtime-guard.js');
const worker = read('sw.js');
const styles = read('pwa-update.css');

assert.match(runtime, /Neue Secret-Circle-Version bereit/);
assert.match(runtime, /Jetzt aktualisieren/);
assert.match(runtime, /Später/);
assert.match(runtime, /waitingWorker\.postMessage\(\{ type: 'SKIP_WAITING' \}\)/);
assert.match(runtime, /if \(!updateRequested \|\| reloadHandled\) return/);
assert.match(runtime, /registration\.waiting/);
assert.match(runtime, /updatefound/);
assert.match(runtime, /hasActiveSession/);
assert.match(runtime, /pwa-update\.css/);
assert.doesNotMatch(runtime, /const controlledAtStartup/);

assert.match(worker, /STAGING_CACHE/);
assert.match(worker, /stageCore/);
assert.match(worker, /promoteStagedCore/);
assert.match(worker, /SKIP_WAITING/);
assert.doesNotMatch(worker, /stageCore\(\).*skipWaiting/s);

assert.match(styles, /\.pwa-update-banner/);
assert.match(styles, /env\(safe-area-inset-bottom\)/);
assert.match(styles, /prefers-reduced-motion/);
assert.match(styles, /focus-visible/);

console.log(JSON.stringify({
  ok: true,
  visibleUpdateBanner: true,
  explicitUserActivation: true,
  activeSessionMessage: true,
  controlledSingleReload: true,
  stagedOfflineCore: true,
  accessibleResponsiveStyles: true
}, null, 2));
