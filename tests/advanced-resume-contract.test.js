'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const runner = fs.readFileSync(path.join(root, 'party-advanced-runner.js'), 'utf8');
const runtime = fs.readFileSync(path.join(root, 'runtime-guard.js'), 'utf8');

assert.match(runner, /const ACTIVE_KEY = 'secret-circle-party-active-v1';/);
assert.match(runtime, /'secret-circle-party-active-v1'/);
assert.doesNotMatch(runtime, /'secret-circle-party-advanced-active-v1'/);
assert.match(runner, /function protectSensitiveResume\(candidate\)/);
assert.match(runner, /advanced\.stage === 'reveal' && advanced\.revealed === true/);
assert.match(runner, /advanced\.revealed = false/);
assert.match(runner, /candidate\.gameId === 'mafia' && advanced\.stage === 'overview'/);
assert.match(runner, /advanced\.stage = 'moderator'/);
assert.match(runner, /protectSensitiveResume\(candidate\)/);
assert.match(runner, /function resumeSession\(active\)[\s\S]*?persistActive\(\)/);

console.log(JSON.stringify({
  advancedResumeContract: 'PASS',
  pwaActiveKeyAligned: true,
  privateRevealHiddenAfterReload: true,
  mafiaOverviewReconfirmedAfterReload: true
}, null, 2));
