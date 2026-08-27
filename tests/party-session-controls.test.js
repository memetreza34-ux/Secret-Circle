'use strict';

const assert = require('node:assert/strict');
const Controls = require('../party-session-controls.js');

function node() {
  const listeners = new Map();
  const classes = new Set();
  const attributes = new Map();
  return {
    textContent: '', hidden: false, disabled: false, inert: false, href: '', dataset: {},
    classList: {
      toggle(name, value) { if (value) classes.add(name); else classes.delete(name); },
      contains(name) { return classes.has(name); }
    },
    addEventListener(type, callback) { listeners.set(type, callback); },
    click() { listeners.get('click')?.({ target: this }); },
    setAttribute(name, value) { attributes.set(name, String(value)); },
    removeAttribute(name) { attributes.delete(name); },
    getAttribute(name) { return attributes.get(name) ?? null; }
  };
}

function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
    dump(key) { return values.get(key) ?? null; }
  };
}

function createWindow(storage) {
  const listeners = new Map();
  return {
    localStorage: storage,
    navigator: { vibrate() {} },
    addEventListener(type, callback) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(callback);
    },
    dispatch(type, detail = {}) {
      for (const callback of listeners.get(type) || []) callback({ type, ...detail });
    }
  };
}

function createDocument(nodes = createNodes()) {
  const listeners = new Map();
  return {
    hidden: false,
    querySelector(selector) { return nodes[selector] || null; },
    addEventListener(type, callback) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(callback);
    },
    dispatch(type) {
      for (const callback of listeners.get(type) || []) callback({ type });
    }
  };
}

function createNodes() {
  return Object.fromEntries([
    '#quick-play', '#quick-pause', '#quick-skip', '#quick-exit', '#quick-replay',
    '#quick-next-game', '#quick-pause-overlay', '#quick-pause-state', '#quick-content',
    '#quick-controls', '#quick-actions'
  ].map(selector => [selector, node()]));
}

const catalogGames = {
  one: { id: 'one', status: 'playable' },
  two: { id: 'two', status: 'playable' },
  viral: { id: 'viral', status: 'playable' },
  custom: { id: 'custom', status: 'playable' },
  hidden: { id: 'hidden', status: 'planned' }
};
const catalog = {
  trendingGameIds: ['one', 'hidden'],
  quickGameIds: ['one'],
  megaGameIds: ['two'],
  viralGameIds: ['viral'],
  createdGameIds: ['custom'],
  getGame(id) { return catalogGames[id] || null; }
};

assert.equal(Controls.version, 4);
assert.equal(Controls.tickMilliseconds, 250);
assert.equal(Controls.timerStoreKey, 'secret-circle-party-quick-timers-v1');
assert.equal(Controls.timerStoreVersion, 1);
assert.deepEqual(Controls.timerFamilies, ['quick', 'mega', 'viral', 'created']);
assert.equal(Controls.familyForGame(catalog, 'one'), 'quick');
assert.equal(Controls.familyForGame(catalog, 'two'), 'mega');
assert.equal(Controls.familyForGame(catalog, 'viral'), 'viral');
assert.equal(Controls.familyForGame(catalog, 'custom'), 'created');
assert.equal(Controls.familyForGame(catalog, 'missing'), null);
assert.equal(Controls.formatMilliseconds(0), '0:00');
assert.equal(Controls.formatMilliseconds(1), '0:01');
assert.equal(Controls.formatMilliseconds(61_000), '1:01');
assert.deepEqual(Controls.orderedGameIds(catalog), ['one', 'two', 'viral', 'custom']);
assert.equal(Controls.nextGameId(catalog, 'one'), 'two');
assert.equal(Controls.nextGameId(catalog, 'two'), 'viral');
assert.equal(Controls.nextGameHref(catalog, 'one'), 'quick-play.html?game=two');
assert.equal(Controls.normalizeTimerSnapshot({ gameId: 'one', sessionId: 's1', round: 1, phase: 'running', durationMs: 5000, remainingMs: 3000 }).remainingMs, 3000);
assert.equal(Controls.normalizeTimerSnapshot({ gameId: 'one', sessionId: 's1', round: 1, phase: 'running', durationMs: 5000, remainingMs: 6000 }), null);

const nodes = createNodes();
const documentRef = createDocument(nodes);
const storage = createStorage();
const windowRef = createWindow(storage);
let currentTime = 0;
let intervalId = 0;
const intervals = new Map();
let skipped = 0;
let aborted = 0;
let replayed = 0;
let ended = 0;
let vibrations = 0;
windowRef.navigator.vibrate = () => { vibrations += 1; };

const controller = Controls.createController({
  documentRef,
  windowRef,
  storageRef: storage,
  catalog,
  gameId: 'one',
  now: () => currentTime,
  setIntervalFn(callback) { intervalId += 1; intervals.set(intervalId, callback); return intervalId; },
  clearIntervalFn(id) { intervals.delete(id); },
  confirmFn: () => true,
  onSkip() { skipped += 1; },
  onAbort() { aborted += 1; return true; },
  onReplay() { replayed += 1; }
});

assert.equal(controller.isSessionActive(), false);
assert.equal(nodes['#quick-pause'].disabled, true);
assert.equal(nodes['#quick-next-game'].dataset.nextGameId, 'two');
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

// v59: backgrounding a running timer pauses it; becoming visible never auto-resumes.
const backgroundNodes = createNodes();
const backgroundDocument = createDocument(backgroundNodes);
const backgroundStorage = createStorage();
const backgroundWindow = createWindow(backgroundStorage);
let backgroundTime = 0;
let backgroundIntervalId = 0;
const backgroundIntervals = new Map();
const backgroundController = Controls.createController({
  documentRef: backgroundDocument,
  windowRef: backgroundWindow,
  storageRef: backgroundStorage,
  catalog,
  gameId: 'one',
  now: () => backgroundTime,
  setIntervalFn(callback) { backgroundIntervalId += 1; backgroundIntervals.set(backgroundIntervalId, callback); return backgroundIntervalId; },
  clearIntervalFn(id) { backgroundIntervals.delete(id); }
});
backgroundController.setSessionActive(true);
const backgroundTimerNode = node();
backgroundController.countdown(5, backgroundTimerNode, () => {});
backgroundTime = 1_000;
[...backgroundIntervals.values()][0]();
assert.equal(backgroundController.remainingMilliseconds(), 4_000);
backgroundDocument.hidden = true;
backgroundDocument.dispatch('visibilitychange');
assert.equal(backgroundController.isPaused(), true);
assert.equal(backgroundNodes['#quick-pause'].textContent, 'Fortsetzen');
assert.equal(backgroundNodes['#quick-pause-overlay'].hidden, false);
backgroundTime = 61_000;
[...backgroundIntervals.values()][0]();
assert.equal(backgroundController.remainingMilliseconds(), 4_000, 'background time must not reduce the timer');
backgroundDocument.hidden = false;
backgroundDocument.dispatch('visibilitychange');
assert.equal(backgroundController.isPaused(), true, 'returning visible must require explicit resume');
backgroundTime = 70_000;
[...backgroundIntervals.values()][0]();
assert.equal(backgroundController.remainingMilliseconds(), 4_000, 'visible state alone must not restart the timer');
backgroundNodes['#quick-pause'].click();
assert.equal(backgroundController.isPaused(), false);
backgroundTime = 71_000;
[...backgroundIntervals.values()][0]();
assert.equal(backgroundController.remainingMilliseconds(), 3_000, 'timer continues only after explicit resume');
backgroundController.stopTimer();

// v57: running Quick-family timers persist only technical remaining-time metadata on pagehide.
const resumeStorage = createStorage({
  'secret-circle-party-quick-active-v1': JSON.stringify({
    version: 1, gameId: 'one', sessionId: 'session-one', round: 1, phase: 'running', completedRecorded: false
  })
});
let resumeTime = 0;
let resumeIntervalId = 0;
const resumeIntervals = new Map();
const resumeNodes1 = createNodes();
const resumeWindow1 = createWindow(resumeStorage);
const resumeController1 = Controls.createController({
  documentRef: createDocument(resumeNodes1),
  windowRef: resumeWindow1,
  storageRef: resumeStorage,
  catalog,
  gameId: 'one',
  now: () => resumeTime,
  setIntervalFn(callback) { resumeIntervalId += 1; resumeIntervals.set(resumeIntervalId, callback); return resumeIntervalId; },
  clearIntervalFn(id) { resumeIntervals.delete(id); }
});
resumeController1.setSessionActive(true);
const runningNode = node();
resumeController1.countdown(5, runningNode, () => {});
resumeTime = 2_000;
[...resumeIntervals.values()][0]();
assert.equal(resumeController1.remainingMilliseconds(), 3_000);
resumeWindow1.dispatch('pagehide');
let persistedStore = JSON.parse(resumeStorage.dump(Controls.timerStoreKey));
assert.equal(persistedStore.version, 1);
assert.equal(persistedStore.snapshots.quick.gameId, 'one');
assert.equal(persistedStore.snapshots.quick.sessionId, 'session-one');
assert.equal(persistedStore.snapshots.quick.round, 1);
assert.equal(persistedStore.snapshots.quick.phase, 'running');
assert.equal(persistedStore.snapshots.quick.durationMs, 5_000);
assert.equal(persistedStore.snapshots.quick.remainingMs, 3_000);
resumeController1.stopTimer();
assert.notEqual(resumeStorage.dump(Controls.timerStoreKey), null, 'engine pagehide stop must preserve the captured snapshot');

// v58: a BFCache restore with a matching timer snapshot reloads into the normal explicit resume path.
let bfcacheReloads = 0;
const bfcacheWindow = createWindow(resumeStorage);
const bfcacheController = Controls.createController({
  documentRef: createDocument(createNodes()),
  windowRef: bfcacheWindow,
  storageRef: resumeStorage,
  catalog,
  gameId: 'one',
  reloadFn() { bfcacheReloads += 1; },
  setIntervalFn: () => 1,
  clearIntervalFn: () => {}
});
assert.equal(bfcacheController.handlePageShow({ persisted: false }), false);
assert.equal(bfcacheReloads, 0);
assert.equal(bfcacheController.handlePageShow({ persisted: true }), true);
assert.equal(bfcacheReloads, 1);
assert.notEqual(resumeStorage.dump(Controls.timerStoreKey), null, 'BFCache reload must leave the matching snapshot for the normal resume path');

const resumeNodes2 = createNodes();
const resumeWindow2 = createWindow(resumeStorage);
const resumeIntervals2 = new Map();
let resumeIntervalId2 = 0;
const resumeController2 = Controls.createController({
  documentRef: createDocument(resumeNodes2),
  windowRef: resumeWindow2,
  storageRef: resumeStorage,
  catalog,
  gameId: 'one',
  now: () => 0,
  setIntervalFn(callback) { resumeIntervalId2 += 1; resumeIntervals2.set(resumeIntervalId2, callback); return resumeIntervalId2; },
  clearIntervalFn(id) { resumeIntervals2.delete(id); }
});
resumeController2.setSessionActive(true);
const resumedNode = node();
resumeController2.countdown(5, resumedNode, () => {});
assert.equal(resumedNode.textContent, '0:03');
assert.equal(resumeController2.remainingMilliseconds(), 3_000);
assert.equal(resumeStorage.dump(Controls.timerStoreKey), null, 'matching snapshot is consumed once');
resumeController2.stopTimer();

// Stale session snapshots neither reload from BFCache nor alter a new timer.
resumeStorage.setItem(Controls.timerStoreKey, JSON.stringify({
  version: 1,
  snapshots: {
    quick: { gameId: 'one', sessionId: 'other-session', round: 1, phase: 'running', durationMs: 5000, remainingMs: 1000 }
  }
}));
let staleReloads = 0;
const staleWindow = createWindow(resumeStorage);
const staleNodes = createNodes();
const staleController = Controls.createController({
  documentRef: createDocument(staleNodes),
  windowRef: staleWindow,
  storageRef: resumeStorage,
  catalog,
  gameId: 'one',
  now: () => 0,
  reloadFn() { staleReloads += 1; },
  setIntervalFn: () => 1,
  clearIntervalFn: () => {}
});
assert.equal(staleController.handlePageShow({ persisted: true }), false);
assert.equal(staleReloads, 0);
assert.equal(resumeStorage.dump(Controls.timerStoreKey), null, 'stale BFCache snapshot is discarded without reload');
staleController.setSessionActive(true);
const staleNode = node();
staleController.countdown(5, staleNode, () => {});
assert.equal(staleNode.textContent, '0:05');
assert.equal(staleController.remainingMilliseconds(), 5_000);

console.log(JSON.stringify({
  ok: true,
  controllerVersion: Controls.version,
  pausableTimer: true,
  pauseBlocksRoundActions: true,
  sharedAbortReplaySkip: true,
  deterministicNextGame: true,
  accessibilityState: true,
  quickFamilyTimerResume: true,
  timerSnapshotPromptFree: true,
  staleTimerSnapshotRejected: true,
  bfcacheTimerReloadGuard: true,
  staleBfcacheSnapshotNoReload: true,
  backgroundVisibilityAutoPause: true,
  visibleRequiresExplicitResume: true
}, null, 2));