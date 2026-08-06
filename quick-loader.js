(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {
    root.SecretCircleQuickLoader = api;
    api.load(root, root.document);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function createQuickLoader() {
  'use strict';

  function selectSource(catalog, gameId) {
    if (!catalog || !gameId) return null;
    if (catalog.createdGameIds?.includes(gameId)) return 'party-created-modes.js';
    if (catalog.viralGameIds?.includes(gameId)) return 'party-viral-modes.js';
    if (catalog.megaGameIds?.includes(gameId)) return 'party-mega-modes.js';
    if (catalog.quickGameIds?.includes(gameId) || catalog.trendingGameIds?.includes(gameId)) return 'party-quick-modes.js';
    return null;
  }

  function showFailure(documentRef, message) {
    const status = documentRef?.querySelector?.('#quick-status');
    if (!status) return;
    status.textContent = message;
    status.classList.add('error');
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

    const script = documentRef.createElement('script');
    script.src = source;
    script.dataset.gameEngine = gameId;
    script.addEventListener('error', () => {
      showFailure(documentRef, 'Die Spiel-Engine konnte nicht geladen werden. Bitte Seite neu laden.');
    });
    documentRef.body.append(script);
    return source;
  }

  return Object.freeze({ version: 2, selectSource, showFailure, load });
});
