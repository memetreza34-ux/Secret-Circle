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
  const CONTROLS_SOURCE = 'party-session-controls.js';
  const REPLACEMENT_GUARD_SOURCE = 'quick-session-replacement-guard.js';
  const WAVE_ONE_SOURCE = 'party-wave-one-modes.js';

  function selectSource(catalog, gameId) {
    if (!catalog || !gameId) return null;
    if (catalog.createdGameIds?.includes(gameId)) return 'party-created-modes.js';
    if (catalog.viralGameIds?.includes(gameId)) return 'party-viral-modes.js';
    if (catalog.megaGameIds?.includes(gameId)) return 'party-mega-modes.js';
    if (catalog.waveOneGameIds?.includes(gameId)) return WAVE_ONE_SOURCE;
    if (catalog.quickGameIds?.includes(gameId) || catalog.trendingGameIds?.includes(gameId)) return 'party-quick-modes.js';
    return null;
  }

  function scriptPlan(catalog, gameId, ledgerReady = false, controlsReady = false, replacementGuardReady = false) {
    const source = selectSource(catalog, gameId);
    if (!source) return [];
    const plan = [];
    if (!ledgerReady) plan.push(LEDGER_SOURCE);
    if (!controlsReady) plan.push(CONTROLS_SOURCE);
    if (!replacementGuardReady) plan.push(REPLACEMENT_GUARD_SOURCE);
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
      Boolean(windowRef.SecretCircleSessionControls),
      Boolean(windowRef.SecretCircleQuickSessionReplacementGuard)
    );

    const loadNext = index => {
      if (index >= plan.length) return;
      const nextSource = plan[index];
      const isEngine = nextSource === source;
      const attributes = isEngine
        ? { gameEngine: gameId }
        : { sharedRuntime: nextSource === LEDGER_SOURCE
          ? 'session-ledger'
          : nextSource === CONTROLS_SOURCE
            ? 'session-controls'
            : 'session-replacement-guard' };

      appendScript(documentRef, nextSource, attributes, () => {
        if (nextSource === LEDGER_SOURCE && !windowRef.SecretCircleSessionLedger) {
          showFailure(documentRef, 'Die gemeinsame Sitzungsverwaltung konnte nicht initialisiert werden.');
          return;
        }
        if (nextSource === CONTROLS_SOURCE && !windowRef.SecretCircleSessionControls) {
          showFailure(documentRef, 'Die gemeinsame Spielsteuerung konnte nicht initialisiert werden.');
          return;
        }
        if (nextSource === REPLACEMENT_GUARD_SOURCE && !windowRef.SecretCircleQuickSessionReplacementGuard) {
          showFailure(documentRef, 'Der Schutz für gespeicherte Sessions konnte nicht initialisiert werden.');
          return;
        }
        loadNext(index + 1);
      }, () => {
        const message = isEngine
          ? 'Die Spiel-Engine konnte nicht geladen werden. Bitte Seite neu laden.'
          : nextSource === CONTROLS_SOURCE
            ? 'Die gemeinsame Spielsteuerung konnte nicht geladen werden. Bitte Seite neu laden.'
            : nextSource === REPLACEMENT_GUARD_SOURCE
              ? 'Der Schutz für gespeicherte Sessions konnte nicht geladen werden. Bitte Seite neu laden.'
              : 'Die gemeinsame Sitzungsverwaltung konnte nicht geladen werden. Bitte Seite neu laden.';
        showFailure(documentRef, message);
      });
    };

    loadNext(0);
    return source;
  }

  return Object.freeze({
    version: 8,
    ledgerSource: LEDGER_SOURCE,
    controlsSource: CONTROLS_SOURCE,
    replacementGuardSource: REPLACEMENT_GUARD_SOURCE,
    waveOneSource: WAVE_ONE_SOURCE,
    selectSource,
    scriptPlan,
    showFailure,
    load
  });
});
