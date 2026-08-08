'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const hub = fs.readFileSync(path.join(root, 'party-hub.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'party.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'party.css'), 'utf8');

function functionBody(name) {
  return hub.match(new RegExp(`function ${name}\\([^)]*\\) \\{([\\s\\S]*?)\\n  \\}`, 'm'))?.[1] || '';
}

for (const id of ['finish-hub-game', 'skip-hub-round', 'pause-hub-game', 'abort-hub-game']) {
  assert.ok(html.includes(`id="${id}"`), `Missing Hub control ${id}`);
}
assert.ok(html.includes('role="group" aria-label="Spielsteuerung"'));
assert.ok(html.includes('<h1 id="play-title" tabindex="-1"></h1>'));
assert.ok(!html.includes('id="exit-game"'));

assert.match(hub, /function focusPlayPrimary\(\)/);
assert.match(hub, /function abortSession\(\)/);
assert.match(functionBody('abortSession'), /window\.confirm/);
assert.match(functionBody('abortSession'), /clearActiveSession/);
assert.doesNotMatch(functionBody('abortSession'), /recordCompletion/);
assert.match(hub, /event\.key === 'Escape'[\s\S]*abortSession\(\)/);

assert.match(hub, /function skipHubRound\(\)/);
assert.match(functionBody('skipHubRound'), /session\.rounds \+= 1/);
assert.match(functionBody('skipHubRound'), /advancePlayer\(\)/);
assert.doesNotMatch(functionBody('skipHubRound'), /session\.score \+=/);
assert.match(hub, /Runde übersprungen\. Dafür wurde kein Punkt vergeben\./);

assert.match(hub, /const activeTimedRound = Boolean\(session\.timer/);
assert.match(hub, /const completedRounds = session\.rounds \+ \(activeTimedRound \? 1 : 0\)/);
assert.match(hub, /rounds: completedRounds/);
assert.match(hub, /\$\('#play-progress'\)\.textContent = `\$\{session\.rounds\} Runden`/);

assert.match(hub, /TIMER_KINDS = new Set\(\['charades', 'taboo', 'hot-potato', 'word-chain'\]\)/);
assert.match(hub, /game\.mode === 'taboo'\) renderTabooStart\(\)/);
assert.match(hub, /function startTaboo\(remainingMs = 60_000/);
assert.match(hub, /hubTimer\.countdown\(remainingMs \/ 1000, timer, finishTabooTimer\)/);
assert.match(hub, /timerState\.kind === 'taboo'\) startTaboo/);
assert.match(hub, /word: cleanText\(value\.word, 120\)/);
assert.match(hub, /banned: Array\.isArray\(value\.banned\)/);

assert.match(css, /\.hub-session-controls/);
assert.match(css, /\.hub-abort-button/);
assert.match(css, /min-height:44px/);
assert.match(css, /@media \(max-width:480px\)[\s\S]*\.hub-session-controls\{grid-template-columns:1fr\}/);

console.log(JSON.stringify({
  hubControlContract: 'PASS',
  distinctFinishAndAbort: true,
  roundSkipWithoutPoint: true,
  focusManagement: true,
  timedTaboo: true,
  mobileControls: true
}, null, 2));
