'use strict';

(function exposeQuickSessionReplacementGuard(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.SecretCircleQuickSessionReplacementGuard = api;
    api.install(root, root.document);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function createQuickSessionReplacementGuard() {
  const VERSION = 1;
  const FAILURE_MARKER = 'secret-circle-quick-replacement-failure-v1';
  const FAMILY_KEYS = Object.freeze({
    created: 'secret-circle-party-created-active-v1',
    viral: 'secret-circle-party-viral-active-v1',
    mega: 'secret-circle-party-mega-active-v1',
    quick: 'secret-circle-party-quick-active-v1'
  });
  const ROUND_LENGTHS = new Set([3, 5, 10, 20]);

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
    familyKeys: FAMILY_KEYS,
    familyForGame,
    storageKeyForGame,
    plausibleSnapshot,
    readSnapshot,
    confirmationMessage,
    authorizeStart,
    install
  });
});
