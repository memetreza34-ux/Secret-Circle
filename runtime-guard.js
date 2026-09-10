'use strict';

(function initialiseRuntimeGuard(root) {
  const VERSION = '1.0.0-beta.3';
  const UPDATE_RELOAD_KEY = 'secret-circle-update-reload';
  const UPDATE_STYLE = 'pwa-update.css';
  const PARTY_RELEASE_STYLE = 'party-release.css';
  const PARTY_RELEASE_SOURCE = 'party-release-structure.js';
  const PARTY_FILTER_SOURCE = 'party-filter-state.js';
  const PARTY_SEARCH_STYLE = 'party-search.css';
  const PARTY_SEARCH_SOURCE = 'party-search-assist.js';
  const ACTIVE_SESSION_KEYS = [
    'secret-circle-active-v7',
    'secret-circle-party-hub-active-v1',
    'secret-circle-party-quick-active-v1',
    'secret-circle-party-mega-active-v1',
    'secret-circle-party-viral-active-v1',
    'secret-circle-party-created-active-v1',
    'secret-circle-party-active-v1'
  ];
  /* Manche Browser sperren den lokalen Speicher vollständig (privates Fenster,
     "alle Cookies blockieren", strenge Firmenprofile). Dann wirft bereits der
     Zugriff auf window.localStorage, und jedes Modul bricht beim Laden ab — die
     Seite bliebe leer. Der Ersatzspeicher hält die Sitzung im Arbeitsspeicher:
     Alles ist spielbar, nur nach dem Schließen ist der Stand weg. Ersetzt wird
     ausschließlich, wenn schon das Lesen fehlschlägt; ein voller Speicher wird
     an anderer Stelle behandelt und darf nicht verworfen werden. */
  function installStorageFallback() {
    try {
      const store = root.localStorage;
      if (!store) return false;
      store.getItem('__secret_circle_probe__');
      return false;
    } catch { /* unten wird ersetzt */ }

    const memory = new Map();
    const shim = {
      getItem(key) { const name = String(key); return memory.has(name) ? memory.get(name) : null; },
      setItem(key, value) { memory.set(String(key), String(value)); },
      removeItem(key) { memory.delete(String(key)); },
      clear() { memory.clear(); },
      key(index) { const keys = [...memory.keys()]; const position = Number(index); return keys[position] ?? null; },
      get length() { return memory.size; }
    };
    try {
      Object.defineProperty(root, 'localStorage', { configurable: true, get: () => shim });
      return true;
    } catch { return false; }
  }

  const storageFallbackActive = installStorageFallback();

  let fatalMessageShown = false;
  let waitingWorker = null;
  let updateRequested = false;
  let reloadHandled = false;
  let updateBanner = null;

  function statusElement() {
    return document.querySelector('#status, #hub-status, #advanced-status, #quick-status, #creator-status');
  }

  function showRuntimeError(message) {
    if (fatalMessageShown) return;
    fatalMessageShown = true;
    const status = statusElement();
    if (!status) return;
    status.textContent = message || 'Ein unerwarteter Fehler ist aufgetreten. Lade die App neu. Deine lokal gespeicherten Daten bleiben erhalten.';
    status.classList.add('error');
  }

  function hasActiveSession() {
    try { return ACTIVE_SESSION_KEYS.some(key => Boolean(localStorage.getItem(key))); }
    catch { return false; }
  }

  function ensureStylesheet(source) {
    if (!document.head || document.querySelector(`link[href="${source}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = source;
    document.head.append(link);
  }

  function loadScript(source, runtimeName, onLoad, failureMessage) {
    if (root[runtimeName]) {
      onLoad?.();
      return;
    }
    const existing = document.querySelector(`script[src="${source}"]`);
    if (existing) {
      existing.addEventListener('load', () => onLoad?.(), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = source;
    script.dataset.sharedRuntime = runtimeName;
    script.addEventListener('load', () => onLoad?.());
    script.addEventListener('error', () => {
      const status = statusElement();
      if (!status || status.textContent) return;
      status.textContent = failureMessage;
      status.classList.add('error');
    });
    document.body.append(script);
  }

  function loadPartySearchAssist() {
    if (!document.querySelector('#game-search')) return;
    ensureStylesheet(PARTY_SEARCH_STYLE);
    loadScript(
      PARTY_SEARCH_SOURCE,
      'SecretCirclePartySearchAssist',
      null,
      'Die erweiterten Suchvorschläge konnten nicht geladen werden. Die normale Katalogsuche bleibt weiterhin nutzbar.'
    );
  }

  function loadPartyFilterState() {
    if (!document.querySelector('#game-grid')) return;
    loadScript(
      PARTY_FILTER_SOURCE,
      'SecretCirclePartyFilterState',
      loadPartySearchAssist,
      'Gespeicherte Katalogfilter konnten nicht geladen werden. Der Spielekatalog bleibt weiterhin nutzbar.'
    );
  }

  function loadPartyReleaseStructure() {
    if (!document.querySelector('#game-grid')) return;
    ensureStylesheet(PARTY_RELEASE_STYLE);
    loadScript(
      PARTY_RELEASE_SOURCE,
      'SecretCirclePartyReleaseStructure',
      loadPartyFilterState,
      'Die Release-Struktur des Spielekatalogs konnte nicht geladen werden. Alle Spiele bleiben weiterhin erreichbar.'
    );
  }

  function createUpdateBanner() {
    if (updateBanner || !document.body) return updateBanner;
    ensureStylesheet(UPDATE_STYLE);

    const banner = document.createElement('section');
    banner.className = 'pwa-update-banner';
    banner.hidden = true;
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'App-Aktualisierung');

    const copy = document.createElement('div');
    copy.className = 'pwa-update-copy';
    const title = document.createElement('strong');
    title.textContent = 'Neue Secret-Circle-Version bereit';
    const message = document.createElement('p');
    message.dataset.updateMessage = 'true';
    copy.append(title, message);

    const actions = document.createElement('div');
    actions.className = 'pwa-update-actions';
    const accept = document.createElement('button');
    accept.type = 'button';
    accept.className = 'pwa-update-accept';
    accept.textContent = 'Jetzt aktualisieren';
    const later = document.createElement('button');
    later.type = 'button';
    later.className = 'pwa-update-later';
    later.textContent = 'Später';

    accept.addEventListener('click', () => {
      if (!waitingWorker) return;
      updateRequested = true;
      accept.disabled = true;
      later.disabled = true;
      accept.textContent = 'Wird aktualisiert …';
      message.textContent = 'Die neue Version wird aktiviert. Die App lädt anschließend einmal neu.';
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    });
    later.addEventListener('click', () => {
      banner.hidden = true;
    });

    actions.append(accept, later);
    banner.append(copy, actions);
    document.body.append(banner);
    updateBanner = banner;
    return banner;
  }

  function showUpdate(worker) {
    waitingWorker = worker;
    const display = () => {
      const banner = createUpdateBanner();
      if (!banner) return;
      const message = banner.querySelector('[data-update-message]');
      if (message) {
        message.textContent = hasActiveSession()
          ? 'Deine laufende Session ist lokal gespeichert. Beim Aktualisieren wird die App einmal neu geladen und kann danach fortgesetzt werden.'
          : 'Aktualisiere kontrolliert auf die neue Offline-Version. Die App wird danach einmal neu geladen.';
      }
      banner.querySelectorAll('button').forEach(button => { button.disabled = false; });
      const accept = banner.querySelector('.pwa-update-accept');
      if (accept) accept.textContent = 'Jetzt aktualisieren';
      banner.hidden = false;
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', display, { once: true });
    else display();
  }

  function watchRegistration(registration) {
    if (registration.waiting && navigator.serviceWorker.controller) showUpdate(registration.waiting);
    registration.addEventListener('updatefound', () => {
      const installing = registration.installing;
      if (!installing) return;
      installing.addEventListener('statechange', () => {
        if (installing.state === 'installed' && navigator.serviceWorker.controller) showUpdate(installing);
      });
    });
  }

  root.addEventListener('error', event => {
    const target = event.target;
    if (target && target !== root) {
      const criticalResource = target instanceof HTMLScriptElement
        || (target instanceof HTMLLinkElement && target.rel === 'stylesheet');
      if (criticalResource) showRuntimeError('Eine benötigte App-Datei konnte nicht geladen werden. Lade die App neu. Deine lokal gespeicherten Daten bleiben erhalten.');
      return;
    }
    showRuntimeError();
  }, true);

  root.addEventListener('unhandledrejection', () => {
    showRuntimeError();
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(watchRegistration).catch(() => {
      const status = statusElement();
      if (!status || status.textContent) return;
      status.textContent = 'Offline-Modus konnte nicht aktiviert werden. Online bleibt die App nutzbar.';
      status.classList.add('error');
    });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!updateRequested || reloadHandled) return;
      reloadHandled = true;
      try { sessionStorage.setItem(UPDATE_RELOAD_KEY, VERSION); } catch {}
      root.location.reload();
    });
  }

  function announceStorageFallback() {
    if (!storageFallbackActive) return;
    const status = statusElement();
    if (!status || status.textContent) return;
    status.textContent = 'Dieser Browser erlaubt keinen lokalen Speicher. Alles ist spielbar, aber der Spielstand geht beim Schließen verloren.';
    status.classList.add('error');
  }

  root.addEventListener('load', announceStorageFallback, { once: true });

  const initialisePageEnhancements = () => loadPartyReleaseStructure();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialisePageEnhancements, { once: true });
  else initialisePageEnhancements();

  root.addEventListener('pageshow', () => {
    try {
      if (sessionStorage.getItem(UPDATE_RELOAD_KEY) === VERSION) sessionStorage.removeItem(UPDATE_RELOAD_KEY);
    } catch {}
  }, { once: true });

  root.SecretCircleRuntime = Object.freeze({
    version: VERSION,
    storageFallbackActive,
    updateStyle: UPDATE_STYLE,
    partyReleaseStyle: PARTY_RELEASE_STYLE,
    partyReleaseSource: PARTY_RELEASE_SOURCE,
    partyFilterSource: PARTY_FILTER_SOURCE,
    partySearchStyle: PARTY_SEARCH_STYLE,
    partySearchSource: PARTY_SEARCH_SOURCE,
    activeSessionKeys: Object.freeze([...ACTIVE_SESSION_KEYS]),
    hasActiveSession,
    showRuntimeError,
    showUpdate,
    loadScript,
    loadPartyReleaseStructure,
    loadPartyFilterState,
    loadPartySearchAssist
  });
})(window);
