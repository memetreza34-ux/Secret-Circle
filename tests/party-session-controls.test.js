'use strict';

const assert = require('node:assert/strict');
const Controls = require('../party-session-controls.js');

function node() {
  const listeners = new Map();
  const classes = new Set();
  const attributes = new Map();
  return {
    textContent: '',
    hidden: false,
    disabled: false,
    inert: false,
    href: '',
    dataset: {},
    classList: {
      toggle(name, value) {
        if (value) classes.add(name);
        else classes.delete(name);
      },
      contains(name) { return classes.has(name); }
    },
    addEventListener(type, callback) { listeners.set(type, callback); },
    click() { listeners.get('click')?.({ target: this }); },
    setAttribute(name, value) { attributes.set(name, String(value)); },
    removeAttribute(name) { attributes.delete(name); },
    getAttribute(name) { return attributes.get(name) ?? null; }
  };
}

const nodes = Object.fromEntries([
  '#quick-play', '#quick-pause', '#quick-skip', '#quick-exit', '#quick-replay',
  '#quick-next-game', '#quick-pause-overlay', '#quick-pause-state', '#quick-content',
  '#quick-controls', '#quick-actions'
].map(selector => [selector, node()]));
const documentRef = { querySelector(selector) { return nodes[selector] || null; } };

let currentTime = 0;
let intervalId = 0;
const intervals = new Map();
let skipped = 0;
let aborted = 0;
let replayed = 0;
let ended = 0;
let vibrations = 0;

const catalogGames = {
  one: { id: 'one', status: 'playable' },
  two: { id: 'two', status: 'playable' },
  hidden: { id: 'hidden', status: 'planned' }
};
const catalog = {
  trendingGameIds: ['one', 'hidden'],
  quickGameIds: ['one'],
  megaGameIds: ['two'],
  viralGameIds: [],
  createdGameIds: [],
  getGame(id) { return catalogGames[id] || null; }
};

const controller = Controls.createController({
  documentRef,
  windowRef: { navigator: { vibrate() { vibrations += 1; } } },
  catalog,
  gameId: 'one',
  now: () => currentTime,
  setIntervalFn(callback) {
    intervalId += 1;
    intervals.set(intervalId, callback);
    return intervalId;
  },
  clearIntervalFn(id) { intervals.delete(id); },
  confirmFn: () => true,
  onSkip() { skipped += 1; },
  onAbort() { aborted += 1; return true; },
  onReplay() { replayed += 1; }
});

assert.equal(Controls.version, 1);
assert.equal(Controls.tickMilliseconds, 250);
assert.equal(Controls.formatMilliseconds(0), '0:00');
assert.equal(Controls.formatMilliseconds(1), '0:01');
assert.equal(Controls.formatMilliseconds(61_000), '1:01');
assert.deepEqual(Controls.orderedGameIds(catalog), ['one', 'two']);
assert.equal(Controls.nextGameId(catalog, 'one'), 'two');
assert.equal(Controls.nextGameId(catalog, 'two'), 'one');
assert.equal(Controls.nextGameHref(catalog, 'one'), 'quick-play.html?game=two');
assert.equal(nodes['#quick-next-game'].dataset.nextGameId, 'two');

assert.equal(controller.isSessionActive(), false);
assert.equal(nodes['#quick-pause'].disabled, true);
controller.setSessionActive(true);
assert.equal(nodes['#quick-pause'].disabled, false);

const timerNode = node();
controller.countdown(2, timerNode, () => { ended += 1; });
assert.equal(timerNode.textContent, '0:02');
assert.equal(intervals.size, 1);

currentTime = 1_000;
[...intervals.values()][0]();
assert.equal(timerNode.textContent, '0:01');
assert.equal(controller.remainingMilliseconds(), 1_000);

nodes['#quick-pause'].click();
assert.equal(controller.isPaused(), true);
assert.equal(nodes['#quick-pause'].textContent, 'Fortsetzen');
assert.equal(nodes['#quick-pause'].getAttribute('aria-pressed'), 'true');
assert.equal(nodes['#quick-pause-overlay'].hidden, false);
assert.equal(nodes['#quick-content'].inert, true);
assert.equal(nodes['#quick-actions'].inert, true);

currentTime = 6_000;
[...intervals.values()][0]();
assert.equal(timerNode.textContent, '0:01');
assert.equal(controller.remainingMilliseconds(), 1_000);
nodes['#quick-skip'].click();
assert.equal(skipped, 0, 'Skip is blocked while paused.');

nodes['#quick-pause'].click();
assert.equal(controller.isPaused(), false);
currentTime = 7_000;
[...intervals.values()][0]();
assert.equal(timerNode.textContent, '0:00');
assert.equal(ended, 1);
assert.equal(vibrations, 1);
assert.equal(intervals.size, 0);

nodes['#quick-skip'].click();
assert.equal(skipped, 1);
nodes['#quick-exit'].click();
assert.equal(aborted, 1);
assert.equal(controller.isSessionActive(), false);
assert.equal(nodes['#quick-pause'].disabled, true);
nodes['#quick-replay'].click();
assert.equal(replayed, 1);

controller.setSessionActive(true);
controller.setPaused(true);
controller.setSessionActive(false);
assert.equal(controller.isPaused(), false);
assert.equal(nodes['#quick-pause-overlay'].hidden, true);
assert.equal(nodes['#quick-content'].inert, false);

console.log(JSON.stringify({
  ok: true,
  pausableTimer: true,
  pauseBlocksRoundActions: true,
  sharedAbortReplaySkip: true,
  deterministicNextGame: true,
  accessibilityState: true
}, null, 2));
