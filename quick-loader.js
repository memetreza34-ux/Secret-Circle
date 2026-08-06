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

  function selectSource(catalog, gameId) {
    if (!catalog || !gameId) return null;
    if (catalog.createdGameIds?.includes(gameId)) return 'party-created-modes.js';
    if (catalog.viralGameIds?.includes(gameId)) return 'party-viral-modes.js';
    if (catalog.megaGameIds?.includes(gameId)) return 'party-mega-modes.js';
    if (catalog.quickGameIds?.includes(gameId) || catalog.trendingGameIds?.includes(gameId)) return 'party-quick-modes.js';
    return null;
  }

  function scriptPlan(catalog, gameId, ledgerReady = false) {
    const source = selectSource(catalog, gameId);
    if (!source) return [];
    return ledgerReady ? [source] : [LEDGER_SOURCE, source];
  }

  function showFailure(documentRef, message) {
    const status = documentRef?.querySelector?.('#quick-status');
    if (!status) return;
    status.textContent = message;
    status.classList.add('error');
  }

  function appendScript(documentRef, source, attributes = {}) {
    const script = documentRef.createElement('script');
    script.src = source;
    for (const [key, value] of Object.entries(attributes)) script.dataset[key] = value;
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

    const loadEngine = () => {
      const engine = appendScript(documentRef, source, { gameEngine: gameId });
      engine.addEventListener('error', () => {
        showFailure(documentRef, 'Die Spiel-Engine konnte nicht geladen werden. Bitte Seite neu laden.');
      });
    };

    if (windowRef.SecretCircleSessionLedger) {
      loadEngine();
      return source;
    }

    const ledger = appendScript(documentRef, LEDGER_SOURCE, { sharedRuntime: 'session-ledger' });
    ledger.addEventListener('load', () => {
      if (!windowRef.SecretCircleSessionLedger) {
        showFailure(documentRef, 'Die gemeinsame Sitzungsverwaltung konnte nicht initialisiert werden.');
        return;
      }
      loadEngine();
    });
    ledger.addEventListener('error', () => {
      showFailure(documentRef, 'Die gemeinsame Sitzungsverwaltung konnte nicht geladen werden. Bitte Seite neu laden.');
    });
    return source;
  }

  return Object.freeze({ version: 3, ledgerSource: LEDGER_SOURCE, selectSource, scriptPlan, showFailure, load });
});
