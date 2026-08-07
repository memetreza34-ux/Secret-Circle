(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecretCircleSessionControls = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createSessionControlsModule() {
  'use strict';

  const VERSION = 1;
  const TICK_MS = 250;

  function formatMilliseconds(value) {
    const milliseconds = Math.max(0, Math.ceil(Number(value) || 0));
    const seconds = Math.ceil(milliseconds / 1000);
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  }

  function orderedGameIds(catalog) {
    const result = [];
    const seen = new Set();
    for (const list of [
      catalog?.trendingGameIds,
      catalog?.quickGameIds,
      catalog?.megaGameIds,
      catalog?.viralGameIds,
      catalog?.createdGameIds
    ]) {
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

  function createController(options = {}) {
    const documentRef = options.documentRef || null;
    const windowRef = options.windowRef || null;
    const now = typeof options.now === 'function' ? options.now : () => Date.now();
    const setIntervalFn = typeof options.setIntervalFn === 'function' ? options.setIntervalFn : (callback, delay) => setInterval(callback, delay);
    const clearIntervalFn = typeof options.clearIntervalFn === 'function' ? options.clearIntervalFn : id => clearInterval(id);
    const confirmFn = typeof options.confirmFn === 'function'
      ? options.confirmFn
      : message => windowRef?.confirm ? windowRef.confirm(message) : true;

    let bound = false;
    let sessionActive = false;
    let paused = false;
    let timerId = null;
    let timerNode = null;
    let timerEnd = null;
    let timerFinished = false;
    let remainingMs = 0;
    let lastTickAt = 0;

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

    function renderTimer() {
      if (timerNode) timerNode.textContent = formatMilliseconds(remainingMs);
    }

    function stopTimer() {
      if (timerId !== null) clearIntervalFn(timerId);
      timerId = null;
      timerNode = null;
      timerEnd = null;
      timerFinished = false;
      remainingMs = 0;
      lastTickAt = 0;
    }

    function finishTimer() {
      if (timerFinished) return;
      timerFinished = true;
      if (timerId !== null) clearIntervalFn(timerId);
      timerId = null;
      remainingMs = 0;
      renderTimer();
      const onEnd = timerEnd;
      timerNode = null;
      timerEnd = null;
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

    function countdown(seconds, node, onEnd) {
      stopTimer();
      const safeSeconds = Math.max(0, Math.min(60 * 60, Number(seconds) || 0));
      timerNode = node || null;
      timerEnd = typeof onEnd === 'function' ? onEnd : null;
      remainingMs = Math.round(safeSeconds * 1000);
      lastTickAt = now();
      renderTimer();
      if (remainingMs <= 0) {
        finishTimer();
        return null;
      }
      timerId = setIntervalFn(tick, TICK_MS);
      return timerId;
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

    function togglePause() {
      return setPaused(!paused);
    }

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
      skip.addEventListener('click', () => {
        if (!sessionActive || paused) return;
        options.onSkip?.();
      });
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

    bind();

    return Object.freeze({
      version: VERSION,
      bind,
      countdown,
      stopTimer,
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
    formatMilliseconds,
    orderedGameIds,
    nextGameId,
    nextGameHref,
    createController
  });
});
