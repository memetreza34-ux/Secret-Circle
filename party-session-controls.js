(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCircleSessionControls = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createSessionControlsModule() {
  'use strict';

  const VERSION = 5;
  const TICK_MS = 250;
  const TIMER_STORE_KEY = 'secret-circle-party-quick-timers-v1';
  const TIMER_STORE_VERSION = 1;
  const TIMER_FAMILIES = Object.freeze(['quick', 'mega', 'viral', 'created']);
  const FAMILY_ACTIVE_KEYS = Object.freeze({
    quick: 'secret-circle-party-quick-active-v1',
    mega: 'secret-circle-party-mega-active-v1',
    viral: 'secret-circle-party-viral-active-v1',
    created: 'secret-circle-party-created-active-v1'
  });

  function formatMilliseconds(value) {
    const milliseconds = Math.max(0, Math.ceil(Number(value) || 0));
    const seconds = Math.ceil(milliseconds / 1000);
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  }

  function orderedGameIds(catalog) {
    const result = [];
    const seen = new Set();
    for (const list of [catalog?.trendingGameIds, catalog?.quickGameIds, catalog?.megaGameIds, catalog?.viralGameIds, catalog?.createdGameIds]) {
      for (const id of Array.isArray(list) ? list : []) {
        if (!id || seen.has(id)) continue;
        const game = catalog?.getGame?.(id);
        if (!game || game.status !== 'playable') continue;
        seen.add(id);
        result.push(id);
      }
    }
    return result;
  }

  function nextGameId(catalog, currentGameId) {
    const ids = orderedGameIds(catalog);
    if (!ids.length) return null;
    const currentIndex = ids.indexOf(currentGameId);
    if (currentIndex < 0) return ids[0];
    return ids[(currentIndex + 1) % ids.length] || null;
  }

  function nextGameHref(catalog, currentGameId) {
    const id = nextGameId(catalog, currentGameId);
    return id ? `quick-play.html?game=${encodeURIComponent(id)}` : 'party.html?view=games';
  }

  function familyForGame(catalog, gameId) {
    if (!gameId) return null;
    if (Array.isArray(catalog?.createdGameIds) && catalog.createdGameIds.includes(gameId)) return 'created';
    if (Array.isArray(catalog?.viralGameIds) && catalog.viralGameIds.includes(gameId)) return 'viral';
    if (Array.isArray(catalog?.megaGameIds) && catalog.megaGameIds.includes(gameId)) return 'mega';
    if ((Array.isArray(catalog?.quickGameIds) && catalog.quickGameIds.includes(gameId))
      || (Array.isArray(catalog?.trendingGameIds) && catalog.trendingGameIds.includes(gameId))) return 'quick';
    return null;
  }

  function normalizeTimerSnapshot(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const gameId = String(value.gameId ?? '').slice(0, 80);
    const sessionId = String(value.sessionId ?? '').slice(0, 160);
    const phase = String(value.phase ?? '').slice(0, 40);
    const round = Number(value.round);
    const durationMs = Number(value.durationMs);
    const remainingMs = Number(value.remainingMs);
    if (!gameId || !sessionId || !phase) return null;
    if (!Number.isInteger(round) || round < 1 || round > 20) return null;
    if (!Number.isInteger(durationMs) || durationMs < 1 || durationMs > 3_600_000) return null;
    if (!Number.isInteger(remainingMs) || remainingMs < 1 || remainingMs > durationMs) return null;
    return Object.freeze({ gameId, sessionId, round, phase, durationMs, remainingMs });
  }

  function normalizeTimerStore(value) {
    const store = { version: TIMER_STORE_VERSION, snapshots: {} };
    if (!value || typeof value !== 'object' || Array.isArray(value) || value.version !== TIMER_STORE_VERSION) return store;
    const snapshots = value.snapshots && typeof value.snapshots === 'object' && !Array.isArray(value.snapshots) ? value.snapshots : {};
    for (const family of TIMER_FAMILIES) {
      const snapshot = normalizeTimerSnapshot(snapshots[family]);
      if (snapshot) store.snapshots[family] = snapshot;
    }
    return store;
  }

  function readTimerStore(storage) {
    if (!storage?.getItem) return normalizeTimerStore(null);
    try { return normalizeTimerStore(JSON.parse(storage.getItem(TIMER_STORE_KEY))); }
    catch { return normalizeTimerStore(null); }
  }

  function writeTimerStore(storage, store) {
    if (!storage?.setItem || !storage?.removeItem) return false;
    try {
      const normalized = normalizeTimerStore(store);
      if (!Object.keys(normalized.snapshots).length) storage.removeItem(TIMER_STORE_KEY);
      else storage.setItem(TIMER_STORE_KEY, JSON.stringify(normalized));
      return true;
    } catch { return false; }
  }

  function familyTimerSnapshot(storage, family) {
    if (!TIMER_FAMILIES.includes(family)) return null;
    return normalizeTimerSnapshot(readTimerStore(storage).snapshots[family]);
  }

  function setFamilyTimerSnapshot(storage, family, snapshot) {
    if (!TIMER_FAMILIES.includes(family)) return false;
    const store = readTimerStore(storage);
    const normalized = normalizeTimerSnapshot(snapshot);
    if (normalized) store.snapshots[family] = normalized;
    else delete store.snapshots[family];
    return writeTimerStore(storage, store);
  }

  function activeContext(storage, family, expectedGameId) {
    const activeKey = FAMILY_ACTIVE_KEYS[family];
    if (!activeKey || !storage?.getItem) return null;
    try {
      const value = JSON.parse(storage.getItem(activeKey));
      const gameId = String(value?.gameId ?? '');
      const sessionId = String(value?.sessionId ?? '');
      const phase = String(value?.phase ?? '').slice(0, 40);
      const round = Number(value?.round);
      if (!value || value.version !== 1 || gameId !== expectedGameId || !sessionId || !phase) return null;
      if (!Number.isInteger(round) || round < 1 || round > 20 || value.completedRecorded === true) return null;
      return { gameId, sessionId, round, phase };
    } catch { return null; }
  }

  function timerContextMatches(snapshot, context, durationMs) {
    return Boolean(snapshot && context
      && snapshot.gameId === context.gameId
      && snapshot.sessionId === context.sessionId
      && snapshot.round === context.round
      && snapshot.phase === context.phase
      && snapshot.durationMs === durationMs);
  }

  function createController(options = {}) {
    const documentRef = options.documentRef || null;
    const windowRef = options.windowRef || null;
    const storage = options.storageRef || windowRef?.localStorage || null;
    const now = typeof options.now === 'function' ? options.now : () => Date.now();
    const setIntervalFn = typeof options.setIntervalFn === 'function' ? options.setIntervalFn : (callback, delay) => setInterval(callback, delay);
    const clearIntervalFn = typeof options.clearIntervalFn === 'function' ? options.clearIntervalFn : id => clearInterval(id);
    const confirmFn = typeof options.confirmFn === 'function' ? options.confirmFn : message => windowRef?.confirm ? windowRef.confirm(message) : true;
    const reloadFn = typeof options.reloadFn === 'function' ? options.reloadFn : () => windowRef?.location?.reload?.();
    const timerFamily = familyForGame(options.catalog, options.gameId);

    let bound = false;
    let sessionActive = false;
    let paused = false;
    let timerId = null;
    let timerNode = null;
    let timerEnd = null;
    let timerFinished = false;
    let timerDurationMs = 0;
    let remainingMs = 0;
    let lastTickAt = 0;
    let preservePersistedOnNextStop = false;

    const query = selector => documentRef?.querySelector?.(selector) || null;

    function setInert(selector, value) {
      const node = query(selector);
      if (!node) return;
      node.inert = Boolean(value);
      if (value) node.setAttribute?.('aria-disabled', 'true');
      else node.removeAttribute?.('aria-disabled');
    }

    function syncPauseUi() {
      const play = query('#quick-play');
      const pause = query('#quick-pause');
      const overlay = query('#quick-pause-overlay');
      const pauseState = query('#quick-pause-state');
      if (play?.classList) play.classList.toggle('is-paused', paused);
      if (pause) {
        pause.textContent = paused ? 'Fortsetzen' : 'Pause';
        pause.setAttribute?.('aria-pressed', paused ? 'true' : 'false');
      }
      if (overlay) overlay.hidden = !paused;
      if (pauseState) pauseState.textContent = paused ? 'Spiel pausiert. Der Timer steht.' : '';
      for (const selector of ['#quick-content', '#quick-controls', '#quick-actions']) setInert(selector, paused);
    }

    function syncActiveUi() {
      for (const selector of ['#quick-pause', '#quick-skip', '#quick-exit']) {
        const node = query(selector);
        if (node) node.disabled = !sessionActive;
      }
    }

    function renderTimer() { if (timerNode) timerNode.textContent = formatMilliseconds(remainingMs); }

    function resetRuntimeTimer() {
      if (timerId !== null) clearIntervalFn(timerId);
      timerId = null;
      timerNode = null;
      timerEnd = null;
      timerFinished = false;
      timerDurationMs = 0;
      remainingMs = 0;
      lastTickAt = 0;
    }

    function clearPersistedTimer() { if (timerFamily) setFamilyTimerSnapshot(storage, timerFamily, null); }

    function stopTimer() {
      resetRuntimeTimer();
      if (preservePersistedOnNextStop) {
        preservePersistedOnNextStop = false;
        return;
      }
      clearPersistedTimer();
    }

    function finishTimer() {
      if (timerFinished) return;
      timerFinished = true;
      if (timerId !== null) clearIntervalFn(timerId);
      timerId = null;
      remainingMs = 0;
      renderTimer();
      clearPersistedTimer();
      const onEnd = timerEnd;
      timerNode = null;
      timerEnd = null;
      timerDurationMs = 0;
      windowRef?.navigator?.vibrate?.([120, 80, 120]);
      onEnd?.();
    }

    function tick() {
      if (!timerNode || timerFinished) return;
      const current = now();
      const elapsed = Math.max(0, current - lastTickAt);
      lastTickAt = current;
      if (paused) return;
      remainingMs = Math.max(0, remainingMs - elapsed);
      renderTimer();
      if (remainingMs <= 0) finishTimer();
    }

    function consumePersistedRemaining(durationMs) {
      if (!timerFamily || durationMs <= 0) return null;
      const snapshot = familyTimerSnapshot(storage, timerFamily);
      if (!snapshot) return null;
      const context = activeContext(storage, timerFamily, options.gameId);
      const matches = timerContextMatches(snapshot, context, durationMs);
      setFamilyTimerSnapshot(storage, timerFamily, null);
      return matches ? snapshot.remainingMs : null;
    }

    function countdownMilliseconds(milliseconds, node, onEnd) {
      const durationMs = Math.max(0, Math.min(3_600_000, Math.round(Number(milliseconds) || 0)));
      const resumedMs = consumePersistedRemaining(durationMs);
      resetRuntimeTimer();
      timerNode = node || null;
      timerEnd = typeof onEnd === 'function' ? onEnd : null;
      timerDurationMs = durationMs;
      remainingMs = resumedMs ?? durationMs;
      lastTickAt = now();
      renderTimer();
      if (remainingMs <= 0) {
        finishTimer();
        return null;
      }
      timerId = setIntervalFn(tick, TICK_MS);
      return timerId;
    }

    function countdown(seconds, node, onEnd) {
      const safeSeconds = Math.max(0, Math.min(60 * 60, Number(seconds) || 0));
      return countdownMilliseconds(safeSeconds * 1000, node, onEnd);
    }

    function persistRunningTimerSnapshot(options = {}) {
      if (!timerFamily || !timerEnd || timerDurationMs <= 0 || remainingMs <= 0) return false;
      const context = activeContext(storage, timerFamily, options.gameId || options.expectedGameId || null) || activeContext(storage, timerFamily, createController.gameId);
      const active = context || activeContext(storage, timerFamily, createController.expectedGameId);
      const resolvedContext = active || activeContext(storage, timerFamily, arguments.callee?.gameId);
      if (!resolvedContext) return false;
      const saved = setFamilyTimerSnapshot(storage, timerFamily, {
        ...resolvedContext,
        durationMs: timerDurationMs,
        remainingMs: Math.max(1, Math.min(timerDurationMs, Math.ceil(remainingMs)))
      });
      if (saved && options.preserveOnNextStop === true) preservePersistedOnNextStop = true;
      return saved;
    }

    function saveCurrentTimer(preserveOnNextStop) {
      if (!timerFamily || !timerEnd || timerDurationMs <= 0 || remainingMs <= 0) return false;
      const context = activeContext(storage, timerFamily, options.gameId);
      if (!context) return false;
      const saved = setFamilyTimerSnapshot(storage, timerFamily, {
        ...context,
        durationMs: timerDurationMs,
        remainingMs: Math.max(1, Math.min(timerDurationMs, Math.ceil(remainingMs)))
      });
      if (saved && preserveOnNextStop) preservePersistedOnNextStop = true;
      return saved;
    }

    function handlePageHide() {
      return saveCurrentTimer(true);
    }

    function handlePageShow(event) {
      preservePersistedOnNextStop = false;
      if (!event?.persisted || !timerFamily) return false;
      const snapshot = familyTimerSnapshot(storage, timerFamily);
      if (!snapshot) return false;
      const context = activeContext(storage, timerFamily, options.gameId);
      if (!timerContextMatches(snapshot, context, snapshot.durationMs)) {
        setFamilyTimerSnapshot(storage, timerFamily, null);
        return false;
      }
      reloadFn();
      return true;
    }

    function setPaused(value) {
      const next = Boolean(value);
      if (next && !sessionActive) return false;
      if (paused === next) return true;
      paused = next;
      lastTickAt = now();
      syncPauseUi();
      options.onPauseChange?.(paused);
      return true;
    }

    function handleVisibilityChange() {
      if (!documentRef?.hidden) return false;
      if (!sessionActive || !timerNode || !timerEnd || timerFinished || timerDurationMs <= 0) return false;
      setPaused(true);
      saveCurrentTimer(false);
      return true;
    }

    function togglePause() { return setPaused(!paused); }

    function setSessionActive(value) {
      sessionActive = Boolean(value);
      if (!sessionActive) {
        setPaused(false);
        stopTimer();
      }
      syncActiveUi();
      return sessionActive;
    }

    function updateNextGame(catalog = options.catalog, currentGameId = options.gameId) {
      const next = query('#quick-next-game');
      if (!next) return null;
      const id = nextGameId(catalog, currentGameId);
      next.href = id ? `quick-play.html?game=${encodeURIComponent(id)}` : 'party.html?view=games';
      next.dataset.nextGameId = id || '';
      return id;
    }

    function bind() {
      if (bound || !documentRef) return bound;
      const pause = query('#quick-pause');
      const skip = query('#quick-skip');
      const exit = query('#quick-exit');
      const replay = query('#quick-replay');
      if (!pause || !skip || !exit || !replay) return false;
      pause.addEventListener('click', () => togglePause());
      skip.addEventListener('click', () => { if (sessionActive && !paused) options.onSkip?.(); });
      exit.addEventListener('click', () => {
        if (!sessionActive) return;
        if (!confirmFn('Session beenden und bisherigen Fortschritt verwerfen?')) return;
        const result = options.onAbort?.();
        if (result !== false) setSessionActive(false);
      });
      replay.addEventListener('click', () => options.onReplay?.());
      updateNextGame();
      bound = true;
      syncPauseUi();
      syncActiveUi();
      return true;
    }

    documentRef?.addEventListener?.('visibilitychange', handleVisibilityChange);
    windowRef?.addEventListener?.('pagehide', handlePageHide, { capture: true });
    windowRef?.addEventListener?.('pageshow', handlePageShow);
    bind();

    return Object.freeze({
      version: VERSION,
      bind,
      countdown,
      countdownMilliseconds,
      stopTimer,
      persistRunningTimerSnapshot: () => saveCurrentTimer(true),
      handlePageHide,
      handlePageShow,
      handleVisibilityChange,
      setPaused,
      togglePause,
      isPaused: () => paused,
      setSessionActive,
      isSessionActive: () => sessionActive,
      remainingMilliseconds: () => remainingMs,
      updateNextGame
    });
  }

  return Object.freeze({
    version: VERSION,
    tickMilliseconds: TICK_MS,
    timerStoreKey: TIMER_STORE_KEY,
    timerStoreVersion: TIMER_STORE_VERSION,
    timerFamilies: TIMER_FAMILIES,
    familyActiveKeys: FAMILY_ACTIVE_KEYS,
    formatMilliseconds,
    orderedGameIds,
    nextGameId,
    nextGameHref,
    familyForGame,
    normalizeTimerSnapshot,
    normalizeTimerStore,
    createController
  });
});