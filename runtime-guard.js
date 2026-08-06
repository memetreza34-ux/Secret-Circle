'use strict';

(function initialiseRuntimeGuard(root) {
  const VERSION = '1.0.0-beta.3';
  const UPDATE_RELOAD_KEY = 'secret-circle-update-reload';
  let fatalMessageShown = false;

  function statusElement() {
    return document.querySelector('#status, #hub-status, #advanced-status');
  }

  function showRuntimeError(message) {
    if (fatalMessageShown) return;
    fatalMessageShown = true;
    const status = statusElement();
    if (!status) return;
    status.textContent = message || 'Ein unerwarteter Fehler ist aufgetreten. Lade die App neu. Deine lokal gespeicherten Daten bleiben erhalten.';
    status.classList.add('error');
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
    navigator.serviceWorker.register('./sw.js').catch(() => {
      const status = statusElement();
      if (!status || status.textContent) return;
      status.textContent = 'Offline-Modus konnte nicht aktiviert werden. Online bleibt die App nutzbar.';
      status.classList.add('error');
    });

    const controlledAtStartup = Boolean(navigator.serviceWorker.controller);
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!controlledAtStartup) return;
      try {
        if (sessionStorage.getItem(UPDATE_RELOAD_KEY) === VERSION) return;
        sessionStorage.setItem(UPDATE_RELOAD_KEY, VERSION);
      } catch {}
      root.location.reload();
    });
  }

  root.addEventListener('pageshow', () => {
    try {
      if (sessionStorage.getItem(UPDATE_RELOAD_KEY) === VERSION) {
        sessionStorage.removeItem(UPDATE_RELOAD_KEY);
      }
    } catch {}
  }, { once: true });

  root.SecretCircleRuntime = Object.freeze({ version: VERSION, showRuntimeError });
})(window);
