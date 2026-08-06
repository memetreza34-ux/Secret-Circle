(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.SecretCircleQuickLoader = api;
    api.load(root, root.document);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function createQuickLoader() {
  'use strict';

  const LEDGER_SOURCE = 'session-ledger.js';
  const LEGACY_GUARD_SOURCE = 'session-ledger-legacy-guard.js';

  function selectSource(catalog, gameId) {
    if (!catalog || !gameId) return null;
    if (catalog.createdGameIds?.includes(gameId)) return 'party-created-modes.js';
    if (catalog.viralGameIds?.includes(gameId)) return 'party-viral-modes.js';
    if (catalog.megaGameIds?.includes(gameId)) return 'party-mega-modes.js';
    if (catalog.quickGameIds?.includes(gameId) || catalog.trendingGameIds?.includes(gameId)) return 'party-quick-modes.js';
    return null;
  }

  function needsLegacyGuard(catalog, gameId) {
    return Boolean(catalog?.viralGameIds?.includes(gameId) || catalog?.megaGameIds?.includes(gameId));
  }

  function scriptPlan(catalog, gameId, ledgerReady = false, guardReady = false) {
    const source = selectSource(catalog, gameId);
    if (!source) return [];
    const plan = [];
    if (!ledgerReady) plan.push(LEDGER_SOURCE);
    if (needsLegacyGuard(catalog, gameId) && !guardReady) plan.push(LEGACY_GUARD_SOURCE);
    plan.push(source);
    return plan;
  }

  function showFailure(documentRef, message) {
    const status = documentRef?.querySelector?.('#quick-status');
    if (!status) return;
    status.textContent = message;
    status.classList.add('error');
  }

  function appendScript(documentRef, source, attributes = {}, onLoad, onError) {
    const script = documentRef.createElement('script');
    script.src = source;
    for (const [key, value] of Object.entries(attributes)) script.dataset[key] = value;
    if (onLoad) script.addEventListener('load', onLoad);
    if (onError) script.addEventListener('error', onError);
    documentRef.body.append(script);
    return script;
  }

  function load(windowRef, documentRef) {
    const catalog = windowRef?.SecretCirclePartyCatalog;
    if (!catalog) {
      showFailure(documentRef, 'Der Spielekatalog konnte nicht geladen werden. Bitte Seite neu laden.');
      return null;
    }

    const gameId = new windowRef.URLSearchParams(windowRef.location.search).get('game') || '';
    if (!gameId) {
      showFailure(documentRef, 'Es wurde kein Spiel ausgewählt. Öffne das Spiel erneut über den Party Hub.');
      return null;
    }

    const game = catalog.getGame?.(gameId);
    const source = selectSource(catalog, gameId);
    if (!game || game.status !== 'playable' || !source) {
      showFailure(documentRef, 'Dieses Spiel ist nicht verfügbar oder noch nicht für den Schnellspiel-Modus freigegeben.');
      return null;
    }

    const plan = scriptPlan(
      catalog,
      gameId,
      Boolean(windowRef.SecretCircleSessionLedger),
      Boolean(windowRef.SecretCircleLegacySessionGuard)
    );

    const loadNext = index => {
      if (index >= plan.length) return;
      const nextSource = plan[index];
      const isEngine = nextSource === source;
      const attributes = isEngine
        ? { gameEngine: gameId }
        : { sharedRuntime: nextSource === LEDGER_SOURCE ? 'session-ledger' : 'legacy-session-guard' };

      appendScript(documentRef, nextSource, attributes, () => {
        if (nextSource === LEDGER_SOURCE && !windowRef.SecretCircleSessionLedger) {
          showFailure(documentRef, 'Die gemeinsame Sitzungsverwaltung konnte nicht initialisiert werden.');
          return;
        }
        if (nextSource === LEGACY_GUARD_SOURCE && !windowRef.SecretCircleLegacySessionGuard) {
          showFailure(documentRef, 'Der Schutz vor doppelten Spielabschlüssen konnte nicht initialisiert werden.');
          return;
        }
        loadNext(index + 1);
      }, () => {
        const message = isEngine
          ? 'Die Spiel-Engine konnte nicht geladen werden. Bitte Seite neu laden.'
          : 'Die gemeinsame Sitzungsverwaltung konnte nicht geladen werden. Bitte Seite neu laden.';
        showFailure(documentRef, message);
      });
    };

    loadNext(0);
    return source;
  }

  return Object.freeze({
    version: 4,
    ledgerSource: LEDGER_SOURCE,
    legacyGuardSource: LEGACY_GUARD_SOURCE,
    selectSource,
    needsLegacyGuard,
    scriptPlan,
    showFailure,
    load
  });
});
