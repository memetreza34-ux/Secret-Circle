'use strict';

(function initialiseRuntimeGuard(root) {
  const VERSION = '1.0.0-beta.3';
  const UPDATE_RELOAD_KEY = 'secret-circle-update-reload';
  const UPDATE_STYLE = 'pwa-update.css';
  const PARTY_RELEASE_STYLE = 'party-release.css';
  const PARTY_RELEASE_SOURCE = 'party-release-structure.js';
  const ACTIVE_SESSION_KEYS = [
    'secret-circle-active-v7',
    'secret-circle-party-quick-active-v1',
    'secret-circle-party-mega-active-v1',
    'secret-circle-party-viral-active-v1',
    'secret-circle-party-created-active-v1',
    'secret-circle-party-advanced-active-v1'
  ];
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

  function loadPartyReleaseStructure() {
    if (!document.querySelector('#game-grid') || root.SecretCirclePartyReleaseStructure) return;
    ensureStylesheet(PARTY_RELEASE_STYLE);
    if (document.querySelector(`script[src="${PARTY_RELEASE_SOURCE}"]`)) return;
    const script = document.createElement('script');
    script.src = PARTY_RELEASE_SOURCE;
    script.dataset.sharedRuntime = 'party-release-structure';
    script.addEventListener('error', () => {
      const status = statusElement();
      if (!status || status.textContent) return;
      status.textContent = 'Die Release-Struktur des Spielekatalogs konnte nicht geladen werden. Alle Spiele bleiben weiterhin erreichbar.';
      status.classList.add('error');
    });
    document.body.append(script);
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
    updateStyle: UPDATE_STYLE,
    partyReleaseStyle: PARTY_RELEASE_STYLE,
    partyReleaseSource: PARTY_RELEASE_SOURCE,
    activeSessionKeys: Object.freeze([...ACTIVE_SESSION_KEYS]),
    hasActiveSession,
    showRuntimeError,
    showUpdate,
    loadPartyReleaseStructure
  });
})(window);
