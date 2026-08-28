'use strict';

(function exposeQuickSessionReplacementGuard(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.SecretCircleQuickSessionReplacementGuard = api;
    api.install(root, root.document);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function createQuickSessionReplacementGuard() {
  const VERSION = 2;
  const FAILURE_MARKER = 'secret-circle-quick-replacement-failure-v1';
  const TIMER_STORE_KEY = 'secret-circle-party-quick-timers-v1';
  const FAMILY_KEYS = Object.freeze({
    created: 'secret-circle-party-created-active-v1',
    viral: 'secret-circle-party-viral-active-v1',
    mega: 'secret-circle-party-mega-active-v1',
    quick: 'secret-circle-party-quick-active-v1'
  });
  const ROUND_LENGTHS = new Set([3, 5, 10, 20]);
  const PRIVATE_QUICK_GAMES = new Set(['draw-guess', 'sound-imitation', 'hum-song', 'forehead-guess']);

  function familyForGame(catalog, gameId) {
    if (!catalog || !gameId) return null;
    if (catalog.createdGameIds?.includes(gameId)) return 'created';
    if (catalog.viralGameIds?.includes(gameId)) return 'viral';
    if (catalog.megaGameIds?.includes(gameId)) return 'mega';
    if (catalog.quickGameIds?.includes(gameId) || catalog.trendingGameIds?.includes(gameId)) return 'quick';
    return null;
  }

  function storageKeyForGame(catalog, gameId) {
    const family = familyForGame(catalog, gameId);
    return family ? FAMILY_KEYS[family] : null;
  }

  function plausibleSnapshot(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || value.version !== 1) return false;
    if (typeof value.gameId !== 'string' || !value.gameId.trim() || value.gameId.length > 120) return false;
    if (!ROUND_LENGTHS.has(value.targetRounds) || !Number.isInteger(value.round) || value.round < 1 || value.round > value.targetRounds) return false;
    if (!Array.isArray(value.players) || value.players.length < 1 || value.players.length > 20) return false;
    const normalized = value.players.map(name => typeof name === 'string' ? name.trim().toLocaleLowerCase('de-DE') : '');
    return normalized.every(Boolean) && new Set(normalized).size === normalized.length;
  }

  function record(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
  }

  function text(value) {
    return typeof value === 'string' && Boolean(value.trim());
  }

  function boundedInteger(value, minimum, maximum) {
    return Number.isInteger(value) && value >= minimum && value <= maximum;
  }

  function validWavelength(value) {
    const phase = String(value.phase ?? 'ready');
    if (!['ready', 'guess', 'result'].includes(phase)) return false;
    const current = record(value.current);
    if (!current) return phase === 'ready';
    if (!Array.isArray(current.spectrum) || current.spectrum.length !== 2 || !current.spectrum.every(text)) return false;
    if (!boundedInteger(current.target, 5, 95)) return false;
    if (!Number.isFinite(Number(current.guess)) || Number(current.guess) < 0 || Number(current.guess) > 100) return false;
    if (phase === 'result' && !boundedInteger(current.points, 0, 4)) return false;
    return true;
  }

  function validPrivateQuickGuess(value) {
    const phase = String(value.phase ?? 'ready');
    if (!['ready', 'card'].includes(phase)) return false;
    const current = record(value.current);
    if (!current) return phase === 'ready';
    return text(current.prompt);
  }

  function validIdentityResume(value) {
    const phase = String(value.phase ?? 'ready');
    if (!['ready', 'card', 'guess', 'result'].includes(phase)) return false;
    const current = record(value.current);
    if (!current) return phase === 'ready';
    if (!text(current.identity)) return false;
    if (phase === 'result') return typeof current.success === 'boolean';
    return current.success === null || current.success === undefined;
  }

  function validMissionResume(value) {
    const phase = String(value.phase ?? 'ready');
    if (!['ready', 'card', 'active', 'result'].includes(phase)) return false;
    const current = record(value.current);
    if (!current) return phase === 'ready';
    if (!text(current.mission)) return false;
    if (phase === 'result') return typeof current.success === 'boolean';
    return current.success === null || current.success === undefined;
  }

  function validKnowMeBest(value) {
    const phase = String(value.phase ?? 'ready');
    if (!['ready', 'group', 'result'].includes(phase)) return false;
    const current = record(value.current);
    if (!current) return phase === 'ready';
    if (!text(current.question) || !Array.isArray(current.options) || current.options.length !== 3 || !current.options.every(text)) return false;
    if (phase === 'ready') return current.secret === null && current.groupGuess === null;
    if (!boundedInteger(current.secret, 0, 2)) return false;
    if (phase === 'group') return current.groupGuess === null;
    return boundedInteger(current.groupGuess, 0, 2);
  }

  function validGuessPrice(value) {
    const phase = String(value.phase ?? 'ready');
    if (!['ready', 'result'].includes(phase)) return false;
    const current = record(value.current);
    if (!current) return phase === 'ready';
    if (!text(current.label) || !Number.isFinite(Number(current.price)) || Number(current.price) < 0) return false;
    if (phase === 'ready') return current.guess === null && boundedInteger(current.points, 0, 3);
    return Number.isFinite(Number(current.guess)) && Number(current.guess) >= 0 && boundedInteger(current.points, 0, 3);
  }

  function validHigherLower(value) {
    if (String(value.phase ?? 'ready') !== 'ready') return false;
    const current = record(value.current);
    if (!current) return true;
    if (!Array.isArray(current.first) || current.first.length !== 2 || !Array.isArray(current.second) || current.second.length !== 2) return false;
    if (!text(String(current.first[0] ?? '')) || !text(String(current.second[0] ?? ''))) return false;
    const first = Number(current.first[1]);
    const second = Number(current.second[1]);
    if (!Number.isFinite(first) || !Number.isFinite(second)) return false;
    if (current.choice === null) return current.correct === null;
    if (!['higher', 'lower'].includes(current.choice) || typeof current.correct !== 'boolean') return false;
    const expected = current.choice === 'higher' ? second > first : second <= first;
    return current.correct === expected;
  }

  function validCreatedGuess(catalog, gameId, value) {
    const game = catalog?.getGame?.(gameId);
    if (game?.templateId !== 'guess') return true;
    const phase = String(value.phase ?? 'ready');
    if (!['ready', 'private', 'active', 'result'].includes(phase)) return false;
    const current = value.current;
    if (current === null || current === undefined) return phase === 'ready';
    if (!text(current)) return false;
    if (phase === 'result') return value.choice === 0 || value.choice === 1;
    return value.choice === null || value.choice === undefined;
  }

  function privacySensitiveResumeValid(catalog, gameId, value) {
    if (!plausibleSnapshot(value) || value.gameId !== gameId) return false;
    if (gameId === 'wavelength') return validWavelength(value);
    if (PRIVATE_QUICK_GAMES.has(gameId)) return validPrivateQuickGuess(value);
    if (gameId === 'who-am-i' || gameId === 'anime-guess') return validIdentityResume(value);
    if (gameId === 'secret-mission') return validMissionResume(value);
    if (gameId === 'know-me-best') return validKnowMeBest(value);
    if (gameId === 'guess-the-price') return validGuessPrice(value);
    if (gameId === 'higher-lower') return validHigherLower(value);
    if (familyForGame(catalog, gameId) === 'created') return validCreatedGuess(catalog, gameId, value);
    return true;
  }

  function readSnapshot(storage, key) {
    if (!storage || !key) return null;
    let raw;
    try { raw = storage.getItem(key); } catch { return null; }
    if (!raw) return null;
    try {
      const value = JSON.parse(raw);
      return plausibleSnapshot(value) ? { raw, value } : null;
    } catch {
      return null;
    }
  }

  function clearFamilyTimer(storage, family) {
    if (!storage || !family) return false;
    try {
      const raw = storage.getItem(TIMER_STORE_KEY);
      if (!raw) return true;
      const store = JSON.parse(raw);
      if (!store || store.version !== 1 || !store.snapshots || typeof store.snapshots !== 'object' || Array.isArray(store.snapshots)) {
        storage.removeItem(TIMER_STORE_KEY);
        return true;
      }
      delete store.snapshots[family];
      if (!Object.keys(store.snapshots).length) storage.removeItem(TIMER_STORE_KEY);
      else storage.setItem(TIMER_STORE_KEY, JSON.stringify(store));
      return true;
    } catch {
      return false;
    }
  }

  function quarantineInvalidSameGame(root, documentRef, catalog, gameId) {
    const family = familyForGame(catalog, gameId);
    const key = family ? FAMILY_KEYS[family] : null;
    if (!key || !root?.localStorage) return false;
    let raw;
    try { raw = root.localStorage.getItem(key); } catch { return false; }
    if (!raw) return false;
    let value;
    try { value = JSON.parse(raw); } catch { return false; }
    if (!value || value.gameId !== gameId) return false;
    if (privacySensitiveResumeValid(catalog, gameId, value)) return false;
    try { root.localStorage.removeItem(key); } catch { return false; }
    clearFamilyTimer(root.localStorage, family);
    const status = documentRef?.querySelector?.('#quick-status');
    if (status) {
      status.textContent = 'Die gespeicherte Session war inkonsistent und wurde vor dem Fortsetzen sicher verworfen.';
      status.classList.add('error');
    }
    return true;
  }

  function titleFor(catalog, gameId) {
    const title = catalog?.getGame?.(gameId)?.title;
    return typeof title === 'string' && title.trim() ? title.trim() : gameId;
  }

  function confirmationMessage(catalog, previousGameId, currentGameId) {
    const previous = titleFor(catalog, previousGameId);
    const current = titleFor(catalog, currentGameId);
    if (previousGameId === currentGameId) {
      return `Die gespeicherte Session „${previous}“ wird durch einen Neustart verworfen. Wirklich eine neue Session beginnen?`;
    }
    return `Es gibt noch eine gespeicherte Session „${previous}“. Sie würde durch „${current}“ ersetzt. Wirklich verwerfen und neu starten?`;
  }

  function authorizeStart(root, catalog, gameId) {
    const key = storageKeyForGame(catalog, gameId);
    const existing = readSnapshot(root?.localStorage, key);
    if (!key || !existing) return { allowed: true, key, existing: null };
    if (typeof root?.confirm !== 'function') return { allowed: false, key, existing };
    const allowed = Boolean(root.confirm(confirmationMessage(catalog, existing.value.gameId, gameId)));
    return { allowed, key, existing };
  }

  function saveFailureMessage(existing, catalog) {
    const title = titleFor(catalog, existing?.value?.gameId || 'gespeicherte Session');
    return `Die neue Session konnte nicht gespeichert werden. Die gespeicherte Session „${title}“ bleibt erhalten.`;
  }

  function showFailureMarker(root, documentRef) {
    let message = '';
    try {
      message = root.sessionStorage?.getItem(FAILURE_MARKER) || '';
      if (message) root.sessionStorage?.removeItem(FAILURE_MARKER);
    } catch {}
    if (!message) return false;
    const status = documentRef?.querySelector?.('#quick-status');
    if (!status) return false;
    status.textContent = message;
    status.classList.add('error');
    return true;
  }

  function install(root, documentRef) {
    if (!root || !documentRef) return false;
    const catalog = root.SecretCirclePartyCatalog;
    const gameId = new root.URLSearchParams(root.location?.search || '').get('game') || '';
    const key = storageKeyForGame(catalog, gameId);
    if (!key) return false;

    let blockPagehideRetry = false;
    showFailureMarker(root, documentRef);
    quarantineInvalidSameGame(root, documentRef, catalog, gameId);

    root.addEventListener('pagehide', event => {
      if (!blockPagehideRetry) return;
      event.stopImmediatePropagation();
    }, { capture: true });

    const start = documentRef.querySelector?.('#quick-start');
    if (!start) return false;

    start.addEventListener('click', event => {
      const authorization = authorizeStart(root, catalog, gameId);
      if (!authorization.allowed) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const status = documentRef.querySelector?.('#quick-status');
        if (status) {
          status.textContent = 'Die gespeicherte Session bleibt erhalten.';
          status.classList.remove('error');
        }
        return;
      }
      if (!authorization.existing) return;

      root.queueMicrotask?.(() => {
        let currentRaw = null;
        try { currentRaw = root.localStorage.getItem(authorization.key); } catch {}
        if (currentRaw !== authorization.existing.raw) return;

        const status = documentRef.querySelector?.('#quick-status');
        if (!status?.classList?.contains('error') || !status.textContent.includes('gespeichert werden')) return;

        const message = saveFailureMessage(authorization.existing, catalog);
        try { root.sessionStorage?.setItem(FAILURE_MARKER, message); } catch {}
        blockPagehideRetry = true;
        root.location?.reload?.();
      });
    }, { capture: true });
    return true;
  }

  return Object.freeze({
    version: VERSION,
    failureMarker: FAILURE_MARKER,
    timerStoreKey: TIMER_STORE_KEY,
    familyKeys: FAMILY_KEYS,
    familyForGame,
    storageKeyForGame,
    plausibleSnapshot,
    privacySensitiveResumeValid,
    clearFamilyTimer,
    quarantineInvalidSameGame,
    readSnapshot,
    confirmationMessage,
    authorizeStart,
    install
  });
});